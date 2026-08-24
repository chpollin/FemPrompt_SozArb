#!/usr/bin/env python3
"""Consolidate agent intake checks and emit a controlled Zotero RIS package.

The package joins the independent identity, metadata, and source reviews by the
original round-two candidate identifier.  Deterministic rules classify records
as already curated, import-ready, needing review, or blocked.  Only import-ready
records enter the RIS output.  Zotero curation and the subsequent export remain
person-attributed operations outside this script.

Usage:
    python -m src.analysis.build_round2_intake_package
    python -m src.analysis.build_round2_intake_package --check
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path
from typing import Any

from src.analysis.work_versions import load_registry

REPO = Path(__file__).resolve().parents[2]
INTAKE_PATH = REPO / "generated" / "round2-intake.json"
REGISTRY_PATH = REPO / "corpus" / "work_version_registry.json"
REVIEW_DIR = REPO / "generated" / "round2-agent-review"
REVIEW_PATHS = {
    "identity": REVIEW_DIR / "identity.json",
    "metadata": REVIEW_DIR / "metadata.json",
    "source": REVIEW_DIR / "sources.json",
}
DEFAULT_OUTPUT = REPO / "generated" / "round2-intake-package.json"
DEFAULT_RIS = REPO / "generated" / "round2-zotero-import.ris"
EXPECTED_SCHEMAS = {
    "identity": "femprompt-round2-identity-review/0.1",
    "metadata": "femprompt-round2-metadata-review/0.1",
    "source": "femprompt-round2-source-review/0.1",
}
CONFLICT_STATUSES = {"conflict", "possible_match", "ambiguous"}
BLOCKED_STATUSES = {"insufficient", "unavailable"}


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def _review_records(
    role: str, path: Path, intake_hash: str, candidate_ids: set[str]
) -> dict[str, dict[str, Any]]:
    if not path.exists():
        return {}
    payload = _read_json(path)
    if payload.get("schema") != EXPECTED_SCHEMAS[role]:
        raise ValueError(f"{role}: unexpected review schema")
    if payload.get("input_sha256") != intake_hash:
        raise ValueError(f"{role}: review targets another intake snapshot")
    records = {
        str(record.get("input_work_id")): record
        for record in payload.get("records", [])
    }
    if set(records) != candidate_ids:
        missing = sorted(candidate_ids - set(records))
        extra = sorted(set(records) - candidate_ids)
        raise ValueError(f"{role}: candidate mismatch; missing={missing}, extra={extra}")
    return records


def _status(record: dict[str, Any] | None, field: str) -> str:
    return str((record or {}).get(field) or "unreviewed")


def _import_status(
    existing_keys: list[str], identity_status: str, metadata_status: str
) -> tuple[str, list[str]]:
    if existing_keys:
        return "already_curated", []
    statuses = {identity_status, metadata_status}
    if statuses & BLOCKED_STATUSES or "unreviewed" in statuses:
        return "blocked", [
            status for status in (identity_status, metadata_status) if status != "confirmed"
        ]
    if statuses & CONFLICT_STATUSES:
        return "needs_review", [
            status for status in (identity_status, metadata_status) if status != "confirmed"
        ]
    if statuses == {"confirmed"}:
        return "import_ready", []
    return "needs_review", sorted(statuses)


def _preferred_version(
    registry: dict[str, Any], candidate_id: str
) -> tuple[dict[str, Any], dict[str, Any]]:
    reference = registry.get("candidate_index", {}).get(candidate_id)
    if not reference:
        raise ValueError(f"{candidate_id}: absent from Work-Version candidate index")
    work = next(
        item for item in registry["works"] if item["work_id"] == reference["work_id"]
    )
    version = next(
        item
        for item in work["versions"]
        if item["version_id"] == work["preferred_version_id"]
    )
    return work, version


def _ris_type(version: dict[str, Any]) -> str:
    item_type = str(version.get("item_type") or "").casefold()
    if item_type == "journalarticle":
        return "JOUR"
    if item_type in {"booksection", "bookchapter"}:
        return "CHAP"
    if item_type == "conferencepaper":
        return "CONF"
    if item_type in {"report", "preprint"} or version.get("version_type") in {
        "preprint",
        "working_paper",
    }:
        return "RPRT"
    if item_type == "book":
        return "BOOK"
    return "GEN"


def _ris_text(records: list[dict[str, Any]]) -> str:
    lines: list[str] = []
    for record in records:
        version = record["preferred_version"]
        identifiers = version.get("identifiers", {})
        lines.append(f"TY  - {_ris_type(version)}")
        lines.append(f"TI  - {version.get('title') or record['title']}")
        for author in version.get("authors", []):
            lines.append(f"AU  - {author}")
        date = str(version.get("version_date") or "")
        year = re.search(r"\b(?:19|20)\d{2}\b", date)
        if year:
            lines.append(f"PY  - {year.group(0)}")
        for doi in identifiers.get("doi", [])[:1]:
            lines.append(f"DO  - {doi}")
        url = version.get("landing_url") or next(
            iter(identifiers.get("url", [])), ""
        )
        if url:
            lines.append(f"UR  - {url}")
        if version.get("journal_or_repository"):
            lines.append(f"T2  - {version['journal_or_repository']}")
        lines.extend(
            [
                f"KW  - FemPrompt work {record['work_id']}",
                f"KW  - Version type {version['version_type']}",
                "KW  - Round two intake",
                f"N1  - FemPrompt-Work-ID: {record['work_id']}",
                f"N1  - FemPrompt-Version-ID: {version['version_id']}",
                f"N1  - Version-Type: {version['version_type']}",
                f"N1  - Peer-Review-Status: {version['peer_review_status']}",
                f"N1  - Source-Lanes: {', '.join(record['source_lanes'])}",
                "ER  -",
                "",
            ]
        )
    return "\n".join(lines).rstrip() + ("\n" if lines else "")


def build_package(repo: Path = REPO) -> tuple[dict[str, Any], str]:
    """Return the consolidated intake package and its import-ready RIS text."""
    intake_path = repo / "generated" / "round2-intake.json"
    registry_path = repo / "corpus" / "work_version_registry.json"
    intake = _read_json(intake_path)
    registry = load_registry(registry_path)
    intake_hash = _sha256(intake_path)
    candidate_ids = {work["work_id"] for work in intake.get("works", [])}
    reviews = {
        role: _review_records(
            role,
            repo / path.relative_to(REPO),
            intake_hash,
            candidate_ids,
        )
        for role, path in REVIEW_PATHS.items()
    }

    records: list[dict[str, Any]] = []
    for intake_work in intake["works"]:
        candidate_id = intake_work["work_id"]
        work, preferred = _preferred_version(registry, candidate_id)
        identity_status = _status(
            reviews["identity"].get(candidate_id), "identity_status"
        )
        metadata_status = _status(
            reviews["metadata"].get(candidate_id), "metadata_status"
        )
        source_status = _status(reviews["source"].get(candidate_id), "source_status")
        import_status, blockers = _import_status(
            intake_work.get("existing_corpus_candidates", []),
            identity_status,
            metadata_status,
        )
        flags: list[str] = []
        for role in reviews:
            review = reviews[role].get(candidate_id, {})
            for flag in review.get("flags", []) or []:
                text = str(flag)
                if text not in flags:
                    flags.append(text)
        records.append(
            {
                "candidate_id": candidate_id,
                "work_id": work["work_id"],
                "title": work["canonical_title"],
                "source_lanes": work["source_lanes"],
                "existing_corpus_keys": intake_work.get(
                    "existing_corpus_candidates", []
                ),
                "agent_reviews": {
                    "identity": identity_status,
                    "metadata": metadata_status,
                    "source": source_status,
                },
                "zotero_import_status": import_status,
                "zotero_import_blockers": blockers,
                "screening_status": "blocked_pending_curated_zotero_export_and_reviewed_markdown",
                "preferred_version": preferred,
                "available_versions": work["versions"],
                "flags": sorted(flags),
            }
        )

    import_ready = [
        record for record in records if record["zotero_import_status"] == "import_ready"
    ]
    status_counts = {
        status: sum(record["zotero_import_status"] == status for record in records)
        for status in ("already_curated", "import_ready", "needs_review", "blocked")
    }
    inputs = [intake_path, registry_path]
    inputs.extend(
        repo / path.relative_to(REPO)
        for path in REVIEW_PATHS.values()
        if (repo / path.relative_to(REPO)).exists()
    )
    package = {
        "schema": "femprompt-round2-intake-package/0.1",
        "purpose": "Agent-prepared, person-curated Zotero intake for round two",
        "sources": [
            {
                "path": path.relative_to(repo).as_posix(),
                "sha256": _sha256(path),
            }
            for path in sorted(inputs, key=lambda item: item.as_posix())
        ],
        "counts": {
            "candidates": len(records),
            **status_counts,
            "screening_ready": 0,
        },
        "gate": {
            "status": "operator_action_required",
            "required_actions": [
                "review_needs_review_and_blocked_records",
                "import_generated_round2_zotero_import_ris",
                "export_curated_zotero_library",
                "rebuild_registry_metadata_and_source_mapping",
                "acquire_and_review_paper_markdown",
            ],
        },
        "records": sorted(records, key=lambda item: item["candidate_id"]),
    }
    return package, _ris_text(import_ready)


def _serialise(payload: dict[str, Any]) -> str:
    return json.dumps(payload, ensure_ascii=False, indent=2) + "\n"


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Build the round-two intake package")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--ris", type=Path, default=DEFAULT_RIS)
    parser.add_argument(
        "--check", action="store_true", help="Fail when either output is stale"
    )
    args = parser.parse_args()
    package, ris = build_package()
    rendered = _serialise(package)
    output = args.output.resolve()
    ris_output = args.ris.resolve()
    if args.check:
        stale = (
            not output.exists()
            or output.read_text(encoding="utf-8") != rendered
            or not ris_output.exists()
            or ris_output.read_text(encoding="utf-8") != ris
        )
        if stale:
            sys.exit("FEHLER: stale or missing round-two intake package")
        print("OK: round-two intake package and RIS are current")
        return
    for path, text in ((output, rendered), (ris_output, ris)):
        path.parent.mkdir(parents=True, exist_ok=True)
        temporary = path.with_suffix(f"{path.suffix}.tmp")
        temporary.write_text(text, encoding="utf-8")
        temporary.replace(path)
    print(
        "OK: "
        f"{package['counts']['import_ready']} import-ready, "
        f"{package['counts']['needs_review']} need review, "
        f"{package['counts']['already_curated']} already curated"
    )


if __name__ == "__main__":
    main()
