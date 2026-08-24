#!/usr/bin/env python3
"""Build the auditable round-two intake manifest from committed research data.

Data flow: the four committed round-two RIS lanes are parsed and deduplicated by
normalised DOI, then by normalised title.  The result is compared with the
round-one RIS files, the committed Zotero export, and the Zotero source mapping.
The manifest names intake blockers without inventing Zotero keys or Paper paths.

Usage:
    python -m src.analysis.build_round2_intake
    python -m src.analysis.build_round2_intake --check

The design implements the controlled-intake boundary in
knowledge/update-protocol.md: a work becomes screenable only after its curated
Zotero identity is present in the committed corpus projection.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import unicodedata
from collections import defaultdict
from pathlib import Path
from typing import Any

REPO = Path(__file__).resolve().parents[2]
ROUND2_DIR = REPO / "corpus" / "deep-research" / "round2"
DEFAULT_OUTPUT = REPO / "generated" / "round2-intake.json"

LANES = (
    ("L1", "OpenAI", "ChatGPT_deep-research.ris"),
    ("L2", "Claude", "Claude_deep-research.ris"),
    ("L3", "Gemini", "Gemini_deep-research.ris"),
    ("L5", "ClaudeCode", "ClaudeCode_deep-research.ris"),
)


def _normalise_doi(value: str) -> str:
    doi = value.strip().casefold()
    doi = re.sub(r"^https?://(?:dx\.)?doi\.org/", "", doi)
    return doi.removeprefix("doi:").strip()


def _normalise_title(value: str) -> str:
    text = unicodedata.normalize("NFKC", value).casefold()
    return " ".join(re.findall(r"[\w]+", text, flags=re.UNICODE))


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def parse_ris(path: Path) -> list[dict[str, Any]]:
    """Parse the conservative RIS subset used by the committed lane files."""
    if not path.exists():
        raise FileNotFoundError(f"missing RIS input: {path}")

    records: list[dict[str, Any]] = []
    current: dict[str, list[str]] = defaultdict(list)
    last_tag: str | None = None

    for raw_line in path.read_text(encoding="utf-8-sig").splitlines():
        match = re.match(r"^([A-Z0-9]{2})  - ?(.*)$", raw_line)
        if match:
            tag, value = match.groups()
            if tag == "ER":
                if current:
                    records.append(dict(current))
                    current = defaultdict(list)
                last_tag = None
                continue
            current[tag].append(value.strip())
            last_tag = tag
        elif raw_line.strip() and last_tag:
            current[last_tag][-1] = f"{current[last_tag][-1]} {raw_line.strip()}"

    if current:
        records.append(dict(current))
    return records


def _first(record: dict[str, list[str]], tag: str) -> str:
    values = record.get(tag, [])
    return values[0].strip() if values else ""


def _record_identity(record: dict[str, list[str]]) -> tuple[str, str]:
    doi = _normalise_doi(_first(record, "DO"))
    title = _normalise_title(_first(record, "TI") or _first(record, "T1"))
    if not title:
        raise ValueError("RIS record lacks a title")
    return doi, title


def _merge_round2_records(
    lane_records: list[tuple[str, str, dict[str, list[str]]]],
) -> list[dict[str, Any]]:
    works: list[dict[str, Any]] = []
    by_doi: dict[str, int] = {}
    by_title: dict[str, int] = {}

    for lane, source, record in lane_records:
        doi, title_norm = _record_identity(record)
        index = by_doi.get(doi) if doi else None
        if index is None:
            index = by_title.get(title_norm)

        if index is None:
            index = len(works)
            title = _first(record, "TI") or _first(record, "T1")
            year_match = re.search(r"\b(19|20)\d{2}\b", _first(record, "PY"))
            year = int(year_match.group(0)) if year_match else None
            works.append(
                {
                    "work_id": f"doi:{doi}" if doi else f"title:{title_norm}",
                    "title": title,
                    "normalised_title": title_norm,
                    "doi": doi or None,
                    "year": year,
                    "authors": list(record.get("AU", [])),
                    "lanes": [],
                    "lane_records": [],
                }
            )

        work = works[index]
        if lane not in work["lanes"]:
            work["lanes"].append(lane)
        work["lane_records"].append({"lane": lane, "source": source})
        if doi:
            by_doi[doi] = index
        by_title[title_norm] = index

    for work in works:
        work["lanes"].sort()
        has_imported_lane = any(lane in {"L1", "L2", "L3"} for lane in work["lanes"])
        work["intake_status"] = (
            "zotero_import_logged_export_pending"
            if has_imported_lane
            else "zotero_import_pending"
        )
        work["zotero_key"] = None
        work["paper_source"] = None
        work["screening_blockers"] = [
            "curated_zotero_identity_missing_from_committed_corpus",
            "paper_source_not_addressable_by_canonical_id",
        ]
    return works


def _round1_identities(repo: Path) -> tuple[set[str], set[str]]:
    dois: set[str] = set()
    titles: set[str] = set()
    for path in sorted((repo / "corpus" / "deep-research").glob("*.ris")):
        for record in parse_ris(path):
            doi, title = _record_identity(record)
            if doi:
                dois.add(doi)
            titles.add(title)
    return dois, titles


def build_manifest(repo: Path = REPO) -> dict[str, Any]:
    """Return the deterministic intake snapshot for the committed repository."""
    lane_records: list[tuple[str, str, dict[str, list[str]]]] = []
    lane_counts: dict[str, int] = {}
    inputs: list[dict[str, Any]] = []
    round2_dir = repo / "corpus" / "deep-research" / "round2"

    for lane, source, filename in LANES:
        path = round2_dir / filename
        records = parse_ris(path)
        lane_counts[lane] = len(records)
        lane_records.extend((lane, source, record) for record in records)
        inputs.append(
            {
                "lane": lane,
                "source": source,
                "path": path.relative_to(repo).as_posix(),
                "sha256": _sha256(path),
                "records": len(records),
            }
        )

    works = _merge_round2_records(lane_records)
    round1_dois, round1_titles = _round1_identities(repo)
    cross_round_matches = [
        work["work_id"]
        for work in works
        if (work["doi"] and work["doi"] in round1_dois)
        or work["normalised_title"] in round1_titles
    ]

    zotero_path = repo / "corpus" / "zotero_export.json"
    mapping_path = repo / "corpus" / "source_tool_mapping.json"
    zotero_items = json.loads(zotero_path.read_text(encoding="utf-8"))
    source_mapping = json.loads(mapping_path.read_text(encoding="utf-8"))
    committed_keys = {item.get("key") for item in zotero_items if item.get("key")}
    committed_by_doi: dict[str, list[str]] = defaultdict(list)
    committed_by_title: dict[str, list[str]] = defaultdict(list)
    for item in zotero_items:
        key = item.get("key")
        if not key:
            continue
        doi = _normalise_doi(item.get("DOI", ""))
        title = _normalise_title(item.get("title", ""))
        if doi:
            committed_by_doi[doi].append(key)
        if title:
            committed_by_title[title].append(key)

    existing_corpus_matches = 0
    for work in works:
        doi_matches = committed_by_doi.get(work["doi"], []) if work["doi"] else []
        title_matches = committed_by_title.get(work["normalised_title"], [])
        candidate_keys = sorted(set(doi_matches or title_matches))
        work["existing_corpus_candidates"] = candidate_keys
        work["existing_match_basis"] = (
            "doi" if doi_matches else "normalised_title_only" if title_matches else None
        )
        if candidate_keys:
            existing_corpus_matches += 1

    mapped_keys = source_mapping.get("source_tool_mapping", {})
    mapping_only = {
        key: sources
        for key, sources in mapped_keys.items()
        if key not in committed_keys
    }
    mapping_only_by_source: dict[str, int] = defaultdict(int)
    for sources in mapping_only.values():
        for source in sources:
            mapping_only_by_source[source] += 1

    imported_lane_works = sum(
        any(lane in {"L1", "L2", "L3"} for lane in work["lanes"]) for work in works
    )
    l5_only_works = sum(work["lanes"] == ["L5"] for work in works)
    l5_attribution_works = sum("L5" in work["lanes"] for work in works)

    return {
        "schema": "femprompt-round2-intake/0.1",
        "purpose": "Canonical intake audit before productive AI-agent screening",
        "script": "src/analysis/build_round2_intake.py",
        "protocol": "knowledge/update-protocol.md",
        "inputs": inputs,
        "counts": {
            "lane_records": len(lane_records),
            "distinct_candidate_works": len(works),
            "duplicate_lane_records_collapsed": len(lane_records) - len(works),
            "cross_round_matches": len(cross_round_matches),
            "works_present_in_l1_l3": imported_lane_works,
            "works_only_in_l5": l5_only_works,
            "works_with_l5_attribution": l5_attribution_works,
            "committed_zotero_records": len(zotero_items),
            "candidate_works_with_existing_corpus_match": existing_corpus_matches,
            "candidate_works_absent_from_committed_export": len(works)
            - existing_corpus_matches,
            "round2_zotero_keys_missing_from_committed_export": len(mapping_only),
            "screening_ready_works": 0,
        },
        "lane_counts": lane_counts,
        "committed_state": {
            "zotero_export": zotero_path.relative_to(repo).as_posix(),
            "zotero_export_sha256": _sha256(zotero_path),
            "source_mapping": mapping_path.relative_to(repo).as_posix(),
            "source_mapping_sha256": _sha256(mapping_path),
            "mapping_only_keys_by_source": dict(sorted(mapping_only_by_source.items())),
            "mapping_only_keys": sorted(mapping_only),
            "cross_round_matches": cross_round_matches,
        },
        "gate": {
            "status": "blocked",
            "reason": "round2_candidates_absent_from_committed_corpus_projection",
            "required_actions": [
                "import_l5_ris_into_zotero_and_preserve_lane_attribution",
                "export_the_curated_zotero_library_to_corpus/zotero_export.json",
                "regenerate_corpus/papers_metadata.csv_and_source_tool_mapping.json",
                "acquire_and_review_each_round2_paper_markdown_source",
                "rerun_this_manifest_until_screening_ready_works_equals_24",
            ],
        },
        "works": works,
    }


def _serialise(manifest: dict[str, Any]) -> str:
    return json.dumps(manifest, ensure_ascii=False, indent=2) + "\n"


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Build the round-two intake manifest")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument(
        "--check", action="store_true", help="Fail if the output is stale"
    )
    args = parser.parse_args()

    manifest = build_manifest()
    rendered = _serialise(manifest)
    output = args.output.resolve()
    if args.check:
        if not output.exists() or output.read_text(encoding="utf-8") != rendered:
            sys.exit(f"FEHLER: stale or missing intake manifest: {output}")
        print(f"OK: round-two intake manifest is current: {output}")
        return

    output.parent.mkdir(parents=True, exist_ok=True)
    temporary = output.with_suffix(f"{output.suffix}.tmp")
    temporary.write_text(rendered, encoding="utf-8")
    temporary.replace(output)
    counts = manifest["counts"]
    print(
        "OK: "
        f"{counts['lane_records']} lane records -> "
        f"{counts['distinct_candidate_works']} distinct round-two works"
    )
    print(
        "WARNUNG: productive screening remains blocked; "
        f"{counts['round2_zotero_keys_missing_from_committed_export']} mapped Zotero keys "
        "are absent from the committed export and L5 intake is pending",
        file=sys.stderr,
    )


if __name__ == "__main__":
    main()
