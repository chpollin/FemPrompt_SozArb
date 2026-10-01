"""Build the local working collection from the canonical linked paper inventory.

The public result ZIP is separately emitted by build_release using reviewed data.
This archive is an explicitly labelled working snapshot, never a public release.
"""

import json
import os
from pathlib import Path

from src.assess.artifact_verification import safe_path
from src.publish.build_release import paper_filename, zip_bytes

ROOT = Path(__file__).resolve().parents[2]


def _read_document_bytes(path: Path, reference: str) -> bytes:
    """Read a document whose resolved path may exceed Windows' legacy limit."""
    target = str(path.resolve())
    if os.name == "nt" and not target.startswith("\\\\?\\"):
        target = f"\\\\?\\{target}"
    try:
        if not Path(target).is_file():
            raise FileNotFoundError(target)
        with Path(target).open("rb") as document:
            return document.read()
    except OSError as exc:
        raise ValueError(f"Missing linked knowledge document: {reference}") from exc


def has_expert_decision(paper: dict) -> bool:
    """Whether the consolidated expert decision of round one decides the record."""
    human = paper.get("human") or {}
    has_human = bool((paper.get("benchmark") or {}).get("has_human"))
    return has_human and human.get("decision") in ("Include", "Exclude")


def withheld_documents(papers: list[dict]) -> set[str]:
    """Knowledge documents linked by at least one record without a human decision.

    A document carries the round-one LLM decision and categories in its frontmatter
    and assessment sections, and the archive is linked from every page, PRISM
    included, so it must never precede the human decision of an open work (ADR-044).
    A document shared with an open record is withheld as a whole. Saved reviewer
    records are deliberately not read: reading them would need PRISM's record
    validation in Python, withholding errs on the safe side, and the Korpus view
    packs its exports in the browser with them.
    """
    return {
        paper["knowledge_doc"]
        for paper in papers
        if paper.get("knowledge_doc") and not has_expert_decision(paper)
    }


def build(repo: Path = ROOT) -> bytes:
    payload = json.loads(
        (repo / "docs/data/research_vault_v2.json").read_text(encoding="utf-8")
    )
    withheld = withheld_documents(payload["papers"])
    documents = {}
    links = []
    seen_ids = set()
    for paper in sorted(payload["papers"], key=lambda item: item["id"]):
        filename = paper_filename(paper["id"])
        if paper["id"] in seen_ids:
            raise ValueError(f"Duplicate corpus record ID: {paper['id']}")
        seen_ids.add(paper["id"])
        reference = paper.get("knowledge_doc")
        if not reference or reference in withheld:
            continue
        path = safe_path(repo / "docs", reference)
        if (
            not path.is_relative_to((repo / "docs/vault/Papers").resolve())
            or path.suffix != ".md"
        ):
            raise ValueError(
                f"Knowledge document is outside the paper-note collection: {reference}"
            )
        # Keep physical file identity, with short IDs to avoid Windows path limits.
        if path not in documents:
            documents[path] = (
                filename,
                _read_document_bytes(path, reference).replace(b"\r\n", b"\n"),
            )
        links.append(
            {
                "record_id": paper["id"],
                "work_id": paper["work_id"],
                "version_id": paper["version_id"],
                "knowledge_doc": documents[path][0],
            }
        )
    files = dict(documents.values())
    files["README.md"] = (
        b"# FemPrompt working collection\n\n"
        b"Historical and provisional research material, not a completed or uniformly verified synthesis.\n"
        b"The source-reviewed public release is built separately with agent/model/date attribution.\n"
        b"record-index.json retains aliases and exact bibliographic Versions. Document reuse across records "
        b"does not establish that the source was read in each of those Versions.\n"
        b"Knowledge documents of records without a consolidated expert decision are left out, "
        b"since they carry the round-one LLM assessment.\n"
    )
    files["record-index.json"] = (
        json.dumps(links, ensure_ascii=False, indent=2) + "\n"
    ).encode("utf-8")
    return zip_bytes(files)


def main() -> None:
    output = ROOT / "docs/downloads/vault.zip"
    output.parent.mkdir(parents=True, exist_ok=True)
    body = build()
    if not output.exists() or output.read_bytes() != body:
        temporary = output.with_suffix(".zip.tmp")
        temporary.write_bytes(body)
        temporary.replace(output)
    print("OK: working archive generated from canonical knowledge links")


if __name__ == "__main__":
    main()
