"""Build a separate result site from source-reviewed projections only.

The repository remains the attributed working record. Never deploy docs/ as a
directory: it contains working annotations and local reading assets. This builder
uses an explicit asset allowlist and constructs downloads from the same dataset.
"""
from __future__ import annotations

import argparse
import hashlib
import io
import json
import os
from pathlib import Path, PurePosixPath, PureWindowsPath
import re
import tempfile
import zipfile
from typing import Any

from src.assess.artifact_verification import load_publication_policy, load_reviews, safe_path

ROOT = Path(__file__).resolve().parents[2]
PUBLIC_FILES = (
    "css/tokens.css", "css/research.css", "css/literaturbild.css", "css/release.css",
    "js/public-release.js", "js/literaturbild.js", "js/wissenschat.js",
    "vendor/fontawesome/css/all.min.css", "vendor/fontawesome/LICENSE.txt",
    "data/category_schema.json", "data/analysis_fields.json",
    "data/literature_landscape.json", "data/assertion_index.json",
)
PUBLIC_METADATA = (
    "id", "title", "authors", "author_year", "year", "doi", "url", "journal",
    "item_type", "work_id", "version_id", "version_type", "version_date",
    "peer_review_status", "peer_review_basis", "preferred_version_id", "latest_version_id",
)


def json_bytes(payload: Any) -> bytes:
    return (json.dumps(payload, ensure_ascii=False, indent=2) + "\n").encode("utf-8")


def zip_bytes(files: dict[str, bytes]) -> bytes:
    buffer = io.BytesIO()
    # Stored entries avoid zlib-version differences between Windows and Linux.
    # These text packages are small; reproducible bytes outweigh compression.
    with zipfile.ZipFile(buffer, "w", compression=zipfile.ZIP_STORED) as archive:
        seen = set()
        for name, body in sorted(files.items()):
            validate_archive_name(name)
            if name.casefold() in seen:
                raise ValueError(f"Case-colliding archive path: {name!r}")
            seen.add(name.casefold())
            entry = zipfile.ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
            entry.compress_type = zipfile.ZIP_STORED
            entry.create_system = 3  # Unix metadata on every build host.
            entry.external_attr = 0o644 << 16
            archive.writestr(entry, body)
    return buffer.getvalue()


def validate_archive_name(name: str) -> None:
    """Reject extraction paths that escape or collide on supported platforms."""
    if not isinstance(name, str) or not name:
        raise ValueError("Archive path must be nonempty text")
    path = PurePosixPath(name)
    if (path.is_absolute() or path.as_posix() != name or ".." in path.parts
            or re.search(r'[\\\x00-\x1f<>:"|?*]', name)
            or any(part.endswith((" ", ".")) or PureWindowsPath(part).is_reserved() for part in path.parts)):
        raise ValueError(f"Invalid archive path: {name!r}")


def paper_filename(record_id: str) -> str:
    if not isinstance(record_id, str) or not re.fullmatch(r"[A-Za-z0-9_-]{1,64}", record_id):
        raise ValueError(f"Invalid corpus record ID for download: {record_id!r}")
    name = "Papers/" + record_id + ".md"
    validate_archive_name(name)
    return name


def _text_asset(path: Path) -> bytes:
    """The result-site manifest describes canonical LF bytes on every host."""
    return path.read_bytes().replace(b"\r\n", b"\n")


def _source_note(paper: dict, assertions: list[dict], records: list[dict]) -> bytes:
    lines = [f"# {paper['title']}", "", paper.get("author_year", ""), "",
             f"Work: `{paper['work_id']}`", f"Version: `{paper['version_id']}`", ""]
    for assertion in assertions:
        evidence = [e for e in assertion["evidence"] if e["record_id"] == paper["id"]]
        if not evidence:
            continue
        review = assertion.get("review") or {}
        lines += ["## Source-reviewed statement", "", assertion["statement"], "",
                  f"Assertion: `{assertion['id']}`; complete cross-source grounding: [assertion_index.json](../assertion_index.json).", "",
                  f"AI agent: {review.get('agent_id', '')}; model: {review.get('model', '')}; "
                  f"reviewed: {review.get('reviewed_at', '')}.", ""]
        for item in evidence:
            lines += [f"> {item['quote']}", "", f"Source: {item['source_url']} ({item['locator']}).", ""]
    for record in records:
        if record["work_id"] == paper["work_id"]:
            lines += ["## Screening of the Work", "", f"Decision: {record['decision']}",
                      f"Authority: {record['lifecycle_state']}", ""]
            for source in record.get("source_records", [record]):
                lines += [f"Screened source: `{source['id']}`; Version: `{source.get('version_id', '')}`."]
                review = source.get("ai_verification") or {}
                if review:
                    lines += [f"AI agent: {review.get('agent_id', '')}; model: {review.get('model', '')}; "
                              f"reviewed: {review.get('reviewed_at', '')}."]
            lines += [""]
    return "\n".join(lines).encode("utf-8")


def build_files(repo: Path = ROOT) -> dict[str, bytes]:
    """Re-derive gated data; stale stored projections cannot bypass the boundary."""
    from src.publish.build_assertion_index import build_index as build_assertions
    from src.publish.generate_literature_landscape import build as build_landscape

    policy = load_publication_policy(repo)
    reviews = load_reviews(repo)
    # Builders perform artifact-local state and evidence checks as well.
    assertions = build_assertions(
        vault=repo / "research-vault", registry_path=repo / "corpus/work_version_registry.json",
        policy_path=repo / "config/publication_policy.json",
        ledger_path=repo / "generated/verification/ai-source-reviews.json", repo=repo,
    )
    landscape = build_landscape(
        repo / "docs/data/screening/ar2.json", repo / "docs/data/research_vault_v2.json",
        repo / "docs/data/analysis_fields.json", repo / "docs/data/category_schema.json",
        repo / "docs/data/work_version_contract.json", publication_policy=policy,
        verification_receipts=reviews,
    )
    corpus = json.loads((repo / "docs/data/research_vault_v2.json").read_text(encoding="utf-8"))
    evidence_records = {e["record_id"] for a in assertions["assertions"] for e in a["evidence"]}
    screening_records = {identifier for r in landscape["records"] for identifier in r.get("record_ids", [r["id"]])}
    visible_ids = evidence_records | screening_records
    papers = [{key: p.get(key) for key in PUBLIC_METADATA} for p in corpus["papers"] if p["id"] in visible_ids]
    if len({p["id"] for p in papers}) != len(papers):
        raise ValueError("Duplicate corpus record ID in released metadata")
    if {p["id"] for p in papers} != visible_ids:
        raise ValueError("Reviewed evidence references missing corpus metadata")
    papers.sort(key=lambda p: (p["work_id"], p["version_id"], p["id"]))
    data = {
        "schema": "femprompt-public-release/0.1",
        "meta": {
            "public_label": policy["public_label"], "authority": policy["authority"],
            "record_count": len(papers), "work_count": len({p["work_id"] for p in papers}),
            "assertion_count": len(assertions["assertions"]),
            "screened_work_count": len(landscape["records"]),
            "scope": policy["scope"], "search_cutoff": policy["search_cutoff"],
            "completeness": "partial; source-reviewed subset of the intended corpus",
        },
        "papers": papers,
    }
    files = {}
    for name in PUBLIC_FILES:
        if name in {"data/assertion_index.json", "data/literature_landscape.json"}:
            continue
        files[name] = _text_asset(repo / "docs" / name)
    font_root = repo / "docs/vendor/fontawesome/webfonts"
    for font in sorted(font_root.glob("*.woff2")):
        files[font.relative_to(repo / "docs").as_posix()] = font.read_bytes()
    files["index.html"] = _text_asset(repo / "docs/release.html")
    files[".nojekyll"] = b""
    files["data/assertion_index.json"] = json_bytes(assertions)
    files["data/literature_landscape.json"] = json_bytes(landscape)
    files["data/public_release.json"] = json_bytes(data)
    dictionary = (
        "# FemPrompt source-reviewed dataset\n\n"
        "This is a partial, attributed research release, not a completed literature review.\n\n"
        "- public_release.json: bibliographic records supporting released evidence; work_id groups aliases, "
        "version_id identifies the exact publication expression.\n"
        "- assertion_index.json: source-linked statements, exact quotations and locators; review records the "
        "AI agent, model, review time, and findings.\n"
        "- literature_landscape.json: one screening result per Work, with source records and publication Versions retained.\n"
        "- ai-agent-reviewed means AI source review; verified means recorded domain-expert verification. "
        "Neither implies the other. publication-approved is a separate recorded event.\n"
        "- Missing records are withheld or still in preparation; absence is not an exclusion decision.\n"
        "- Counts describe this release only; record and Work denominators are distinct.\n"
        "- Statements summarise reported findings; AI source review is not a study-quality rating.\n\n"
        "Cite the project authors, repository, release fingerprint and access date. Original project text: "
        "CC BY 4.0; third-party quotations retain their source attribution and rights.\n"
    ).encode("utf-8")
    download = {"README.md": dictionary, "data-dictionary.md": dictionary}
    for name in ("public_release", "assertion_index", "literature_landscape"):
        download[name + ".json"] = files["data/" + name + ".json"]
    for paper in papers:
        download[paper_filename(paper["id"])] = _source_note(paper, assertions["assertions"], landscape["records"])
    # Frame paths and file digests explicitly; concatenating names and bytes has
    # ambiguous boundaries and is not a unique encoding of an archive inventory.
    fingerprint = hashlib.sha256(json_bytes({
        name: hashlib.sha256(body).hexdigest() for name, body in sorted(download.items())
    })).hexdigest()
    download["release.json"] = json_bytes({"schema": data["schema"], "content_sha256": fingerprint,
                                          "meta": data["meta"]})
    files["downloads/data-dictionary.md"] = dictionary
    files["downloads/research-data.zip"] = zip_bytes(download)
    files["data/release_manifest.json"] = json_bytes({
        "schema": "femprompt-release-manifest/0.1", "content_sha256": fingerprint,
        "files": {name: hashlib.sha256(body).hexdigest() for name, body in sorted(files.items())},
    })
    return files


def write_files(output: Path, files: dict[str, bytes], *, check: bool = False) -> None:
    """Replace only generated files; refuse to overwrite an unexpected tree."""
    seen = set()
    for name in files:
        validate_archive_name(name)
        if name.casefold() in seen:
            raise ValueError(f"Case-colliding release path: {name!r}")
        seen.add(name.casefold())
        safe_path(output, name)
    actual = {p.relative_to(output).as_posix() for p in output.rglob("*") if p.is_file()} if output.exists() else set()
    unexpected = actual - set(files)
    if unexpected:
        raise ValueError("Unexpected files in result directory; choose a fresh output: " + ", ".join(sorted(unexpected)))
    stale = [name for name, body in files.items() if not (output / name).is_file() or (output / name).read_bytes() != body]
    if check:
        if stale:
            raise ValueError("Stale release files: " + ", ".join(stale))
        return
    for name in stale:
        target = safe_path(output, name)
        target.parent.mkdir(parents=True, exist_ok=True)
        with tempfile.NamedTemporaryFile(dir=target.parent, delete=False) as temporary:
            temporary.write(files[name])
            temp_path = Path(temporary.name)
        os.replace(temp_path, target)


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, default=ROOT)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args(argv)
    repo = args.repo.resolve()
    output = (args.output or repo / "build/site").resolve()
    if output == repo or output == repo / "docs" or not output.is_relative_to(repo):
        raise ValueError("Release output must be a separate directory within the repository")
    files = build_files(repo)
    write_files(output, files, check=args.check)
    print(f"OK: attributed result site {'checked' if args.check else 'built'} at {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
