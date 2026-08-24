#!/usr/bin/env python3
"""Build a provenance-bound Zotero package for the dated contextual update.

Tier A is an identification priority, not a screening decision. The generated
records remain candidates until Zotero curation, source preparation, PRISM
screening, AI Agent Review, and domain-expert verification are complete.

Usage:
    python -m src.analysis.build_contextual_update_package
    python -m src.analysis.build_contextual_update_package --check
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import unicodedata
from copy import deepcopy
from pathlib import Path
from typing import Any

REPO = Path(__file__).resolve().parents[2]
UPDATE_ID = "contextual-update-2026-08-24"
UPDATE_DIR = REPO / "corpus" / "deep-research" / "round2" / UPDATE_ID
DEFAULT_OUTPUT = REPO / "generated" / f"{UPDATE_ID}-intake-package.json"
DEFAULT_RIS = REPO / "generated" / f"{UPDATE_ID}-zotero-import.ris"
EXPECTED_SCHEMA = "femprompt-contextual-search-lane/0.1"
ORIGINAL_WINDOW_START = "2025-07-01"
ORIGINAL_WINDOW_END = "2026-06-30"
ZOTERO_GROUP_ID = "6080294"
ZOTERO_LIBRARY_NAME = "FemPrompt_SozArb"


def _read_json(path: Path) -> dict[str, Any]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise ValueError(f"{path}: expected a JSON object")
    return payload


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _normalise_doi(value: Any) -> str | None:
    text = str(value or "").strip().casefold()
    for prefix in ("https://doi.org/", "http://doi.org/", "doi:"):
        if text.startswith(prefix):
            text = text[len(prefix) :]
    return text or None


def _normalise_title(value: Any) -> str:
    text = unicodedata.normalize("NFKD", str(value or "")).casefold()
    return " ".join(re.findall(r"[a-z0-9]+", text))


def _candidate_key(candidate: dict[str, Any]) -> str:
    doi = _normalise_doi(candidate.get("doi"))
    if doi:
        return f"doi:{doi}"
    identifiers = candidate.get("other_identifiers") or {}
    if isinstance(identifiers, dict):
        for name in ("arxiv", "acl_anthology", "pmid", "isbn"):
            value = str(identifiers.get(name) or "").strip().casefold()
            if value:
                return f"{name}:{value}"
    title = _normalise_title(candidate.get("title"))
    if not title:
        raise ValueError("candidate without DOI, external identifier, or title")
    digest = hashlib.sha256(title.encode("utf-8")).hexdigest()[:16]
    return f"title:{digest}"


def _window_relation(value: Any) -> str:
    date = str(value or "").strip()
    if not re.match(r"^\d{4}(?:-\d{2})?(?:-\d{2})?$", date):
        return "date_not_established"
    lower = date if len(date) == 10 else f"{date}-01" if len(date) == 7 else f"{date}-01-01"
    upper = date if len(date) == 10 else f"{date}-31" if len(date) == 7 else f"{date}-12-31"
    if upper < ORIGINAL_WINDOW_START:
        return "before_original_window"
    if lower > ORIGINAL_WINDOW_END:
        return "after_original_window"
    return "within_original_window"


def _candidate_score(candidate: dict[str, Any]) -> tuple[int, int, int]:
    metadata_fields = (
        "doi",
        "venue",
        "publication_date",
        "peer_review_evidence",
        "landing_url",
        "fulltext_url",
    )
    populated = sum(bool(candidate.get(field)) for field in metadata_fields)
    return (
        int(candidate.get("tier") == "A"),
        int(bool(candidate.get("relation_to_existing_work"))),
        populated,
    )


def _merge_candidates(
    current: dict[str, Any], incoming: dict[str, Any]
) -> dict[str, Any]:
    preferred, supplement = (
        (incoming, current)
        if _candidate_score(incoming) > _candidate_score(current)
        else (current, incoming)
    )
    merged = deepcopy(preferred)
    for field, value in supplement.items():
        if field.startswith("_"):
            continue
        if not merged.get(field) and value:
            merged[field] = deepcopy(value)
    merged["_source_lanes"] = sorted(
        set(current.get("_source_lanes", []))
        | set(incoming.get("_source_lanes", []))
    )
    merged["_source_tiers"] = {
        **current.get("_source_tiers", {}),
        **incoming.get("_source_tiers", {}),
    }
    return merged


def _selected_candidates(
    lane_payloads: list[tuple[Path, dict[str, Any]]],
) -> list[dict[str, Any]]:
    selected: dict[str, dict[str, Any]] = {}
    for path, payload in lane_payloads:
        if payload.get("schema") != EXPECTED_SCHEMA:
            raise ValueError(f"{path}: unexpected schema")
        lane_id = str(payload.get("lane_id") or path.stem)
        candidates = payload.get("candidates")
        if not isinstance(candidates, list):
            raise ValueError(f"{path}: candidates must be a list")
        for raw in candidates:
            if not isinstance(raw, dict) or raw.get("tier") != "A":
                continue
            candidate = deepcopy(raw)
            candidate["doi"] = _normalise_doi(candidate.get("doi"))
            candidate["_source_lanes"] = [lane_id]
            candidate["_source_tiers"] = {lane_id: "A"}
            key = _candidate_key(candidate)
            selected[key] = (
                _merge_candidates(selected[key], candidate)
                if key in selected
                else candidate
            )

    records: list[dict[str, Any]] = []
    for key, candidate in selected.items():
        source_lanes = candidate.pop("_source_lanes")
        source_tiers = candidate.pop("_source_tiers")
        relation = candidate.get("relation_to_existing_work")
        candidate.update(
            {
                "candidate_id": f"contextual:{key}",
                "source_lanes": source_lanes,
                "source_tiers": source_tiers,
                "identity_status": (
                    "new_version_of_existing_work" if relation else "new_work"
                ),
                "original_round2_window_relation": _window_relation(
                    candidate.get("publication_date")
                ),
                "zotero_status": "prepared_for_import",
                "screening_status": "identified_not_screened",
                "lifecycle_state": "identified",
            }
        )
        records.append(candidate)
    return sorted(records, key=lambda item: item["candidate_id"])


def _ris_type(candidate: dict[str, Any]) -> str:
    publication_type = str(candidate.get("publication_type") or "").casefold()
    if publication_type in {"book_chapter", "book_section", "booksection"}:
        return "CHAP"
    if publication_type in {"conference_paper", "conferencepaper"}:
        return "CONF"
    if publication_type in {"preprint", "report"}:
        return "RPRT"
    if publication_type == "book":
        return "BOOK"
    return "JOUR"


def _peer_review_text(candidate: dict[str, Any]) -> str:
    evidence = candidate.get("peer_review_evidence")
    if isinstance(evidence, dict):
        return json.dumps(evidence, ensure_ascii=False, separators=(",", ":"))
    return str(evidence or "not_established")


def _ris_text(records: list[dict[str, Any]]) -> str:
    lines: list[str] = []
    for record in records:
        lines.append(f"TY  - {_ris_type(record)}")
        lines.append(f"TI  - {record['title']}")
        for author in record.get("authors", []):
            lines.append(f"AU  - {author}")
        date = str(record.get("publication_date") or "")
        year = re.search(r"\b(?:19|20)\d{2}\b", date)
        if year:
            lines.append(f"PY  - {year.group(0)}")
        if date:
            lines.append(f"DA  - {date}")
        if record.get("venue"):
            lines.append(f"T2  - {record['venue']}")
        if record.get("doi"):
            lines.append(f"DO  - {record['doi']}")
        url = record.get("landing_url") or record.get("fulltext_url")
        if url:
            lines.append(f"UR  - {url}")
        lines.extend(
            [
                f"KW  - FemPrompt {UPDATE_ID}",
                f"KW  - Search lanes {', '.join(record['source_lanes'])}",
                f"KW  - {record['original_round2_window_relation']}",
                f"N1  - FemPrompt-Candidate-ID: {record['candidate_id']}",
                f"N1  - Identity-Status: {record['identity_status']}",
                f"N1  - Version-Status: {record.get('version_status') or 'not_established'}",
                f"N1  - Peer-Review-Evidence: {_peer_review_text(record)}",
            ]
        )
        if record.get("relation_to_existing_work"):
            lines.append(
                "N1  - Related-FemPrompt-Work-ID: "
                f"{record['relation_to_existing_work']}"
            )
        lines.extend(["ER  -", ""])
    return "\n".join(lines).rstrip() + ("\n" if lines else "")


def build_package(repo: Path = REPO) -> tuple[dict[str, Any], str]:
    """Return the contextual-update package and its Zotero RIS text."""
    update_dir = repo / "corpus" / "deep-research" / "round2" / UPDATE_ID
    paths = sorted(update_dir.glob("lane-*.json"))
    if not paths:
        raise ValueError(f"{update_dir}: no search-lane files")
    lane_payloads = [(path, _read_json(path)) for path in paths]
    records = _selected_candidates(lane_payloads)
    if not records:
        raise ValueError("contextual update has no Tier-A candidates")

    relation_counts = {
        relation: sum(
            record["original_round2_window_relation"] == relation
            for record in records
        )
        for relation in (
            "before_original_window",
            "within_original_window",
            "after_original_window",
            "date_not_established",
        )
    }
    package = {
        "schema": "femprompt-contextual-update-intake/0.1",
        "update_id": UPDATE_ID,
        "cutoff_date": "2026-08-24",
        "purpose": "Dated candidate supplement for Zotero curation and governed screening",
        "selection_rule": (
            "Tier A in at least one contextual search lane; identification priority "
            "does not establish PRISM inclusion"
        ),
        "original_round2_window": {
            "start": ORIGINAL_WINDOW_START,
            "end": ORIGINAL_WINDOW_END,
            "retrospectively_changed": False,
        },
        "sources": [
            {
                "path": path.relative_to(repo).as_posix(),
                "sha256": _sha256(path),
                "lane_id": payload.get("lane_id"),
            }
            for path, payload in lane_payloads
        ],
        "counts": {
            "selected_records": len(records),
            "new_works": sum(
                record["identity_status"] == "new_work" for record in records
            ),
            "new_versions_of_existing_works": sum(
                record["identity_status"] == "new_version_of_existing_work"
                for record in records
            ),
            "open_access": sum(bool(record.get("open_access")) for record in records),
            "fulltext_located": sum(
                bool(record.get("fulltext_url")) for record in records
            ),
            **relation_counts,
        },
        "zotero_target": {
            "library_name": ZOTERO_LIBRARY_NAME,
            "group_id": ZOTERO_GROUP_ID,
            "import_status": "not_imported",
        },
        "gate": {
            "status": "operator_action_required",
            "required_actions": [
                "import_RIS_into_confirmed_Zotero_group_library",
                "curate_metadata_and_Work-Version_relations_in_Zotero",
                "export_curated_Zotero_library",
                "rebuild_Work-Version_registry",
                "acquire_convert_and_review_preferred_fulltexts",
                "run_governed_PRISM_screening",
            ],
        },
        "records": records,
    }
    return package, _ris_text(records)


def _serialise(payload: dict[str, Any]) -> str:
    return json.dumps(payload, ensure_ascii=False, indent=2) + "\n"


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Build the contextual update package")
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
            sys.exit("FEHLER: stale or missing contextual-update package")
        print("OK: contextual-update package and RIS are current")
        return
    for path, text in ((output, rendered), (ris_output, ris)):
        path.parent.mkdir(parents=True, exist_ok=True)
        temporary = path.with_suffix(f"{path.suffix}.tmp")
        temporary.write_text(text, encoding="utf-8", newline="\n")
        temporary.replace(path)
    print(
        "OK: "
        f"{package['counts']['new_works']} new Works, "
        f"{package['counts']['new_versions_of_existing_works']} new Versions, "
        f"{package['counts']['selected_records']} RIS records"
    )


if __name__ == "__main__":
    main()
