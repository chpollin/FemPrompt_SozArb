#!/usr/bin/env python3
"""Build an offline, authority-preserving literature readiness inventory.

The projection joins the public corpus, full-text manifest, Work-Version registry,
and dated Zotero observation. It reports technical reviewability without treating
source availability or generated knowledge documents as scholarly review.

Usage:
    python -m src.analysis.build_literature_readiness
    python -m src.analysis.build_literature_readiness --check
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
import os
import re
import sys
from collections import Counter
from pathlib import Path
from typing import Any

from src.analysis.historical_resolution import RESOLUTION_PATH, load_source_holds

REPO = Path(__file__).resolve().parents[2]
DEFAULT_JSON = REPO / "generated" / "literature-readiness.json"
DEFAULT_CSV = REPO / "generated" / "literature-readiness.csv"


def _read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _abstract_quality(text: str) -> str:
    abstract = text.strip()
    if not abstract:
        return "missing"
    if re.search(
        r"National Bureau of Economic Research|Founded in 1920, the NBER|"
        r"private, non-profit, non-partisan organization",
        abstract,
        re.IGNORECASE,
    ):
        return "boilerplate"
    if len(abstract) < 120:
        return "too_short"
    return "usable"


def _extended_path(path: Path) -> str:
    target = str(path.resolve())
    if os.name == "nt" and not target.startswith("\\\\?\\"):
        return f"\\\\?\\{target}"
    return target


def _read_existing_text(path: Path) -> str | None:
    target = _extended_path(path)
    try:
        if not Path(target).is_file():
            return None
        with Path(target).open(encoding="utf-8") as document:
            return document.read()
    except OSError:
        return None


def _frontmatter_status(path: Path) -> tuple[bool, str]:
    text = _read_existing_text(path)
    if text is None:
        return False, "missing"
    if not text.startswith("---\n"):
        return True, "unreviewed"
    frontmatter = text.split("---", 2)[1]
    match = re.search(r"(?m)^status:\s*['\"]?([^'\"\n]+)", frontmatter)
    return True, match.group(1).strip() if match else "unreviewed"


def _source_details(
    repo: Path,
    paper: dict[str, Any],
    manifest_entry: dict[str, Any],
) -> dict[str, Any]:
    kind = str(manifest_entry.get("src") or "none")
    source_path = repo / "docs" / "data" / "fulltext" / f"{paper['id']}.md"
    binding = paper.get("source_binding") or {}
    expected_work = binding.get("work_id") or paper.get("work_id")
    expected_version = binding.get("source_version_id") or paper.get("version_id")
    exact_binding = bool(
        expected_work
        and expected_version
        and manifest_entry.get("work_id") == expected_work
        and manifest_entry.get("version_id") == expected_version
    )
    available = kind in {"clean", "raw"} and source_path.is_file()
    return {
        "source_kind": kind,
        "source_path": source_path.relative_to(repo).as_posix() if available else None,
        "source_markdown_sha256": _sha256(source_path) if available else None,
        "text_available": available,
        "canonical_binding_matches": exact_binding,
    }


def _assessment(paper: dict[str, Any]) -> dict[str, Any]:
    llm = paper.get("llm") or {}
    human = paper.get("human") or {}
    return {
        "llm_status": llm.get("assessment_status") or "unassessed",
        "llm_decision": llm.get("decision"),
        "human_present": bool(human.get("decision")),
        "human_decision": human.get("decision"),
    }


def build_readiness(
    repo: Path = REPO, live_snapshot_path: Path | None = None
) -> dict[str, Any]:
    corpus_path = repo / "docs" / "data" / "research_vault_v2.json"
    manifest_path = repo / "docs" / "data" / "fulltext_manifest.json"
    registry_path = repo / "corpus" / "work_version_registry.json"
    zotero_path = repo / "corpus" / "zotero_sync.json"
    papers = _read_json(corpus_path)["papers"]
    manifest = _read_json(manifest_path)
    registry = _read_json(registry_path)
    zotero_sync = _read_json(zotero_path)
    record_index = registry["record_index"]
    canonical_live_keys = set(zotero_sync["live_record_ids"])
    live_snapshot_keys = (
        {item["key"] for item in _read_json(live_snapshot_path)["items"]}
        if live_snapshot_path
        else None
    )

    source_holds = load_source_holds(repo)
    records: list[dict[str, Any]] = []
    seen: set[str] = set()
    for paper in papers:
        record_id = str(paper["id"])
        if record_id in seen:
            raise ValueError(f"duplicate canonical record key: {record_id}")
        seen.add(record_id)
        registry_identity = record_index.get(record_id) or {}
        exact_ids = bool(
            paper.get("work_id")
            and paper.get("version_id")
            and registry_identity.get("work_id") == paper.get("work_id")
            and registry_identity.get("version_id") == paper.get("version_id")
        )
        source = _source_details(repo, paper, manifest.get(record_id, {}))
        abstract_quality = _abstract_quality(str(paper.get("abstract") or ""))
        technical_reviewable = bool(
            exact_ids
            and (
                (source["text_available"] and source["canonical_binding_matches"])
                or abstract_quality == "usable"
            )
        )
        live_ids = sorted((paper.get("zotero_library") or {}).get("record_ids", []))
        knowledge_doc = paper.get("knowledge_doc")
        knowledge_path = repo / "docs" / str(knowledge_doc) if knowledge_doc else None
        knowledge_exists, knowledge_authority = (
            _frontmatter_status(knowledge_path) if knowledge_path else (False, "absent")
        )
        missing: list[str] = []
        source_hold = source_holds.get(paper.get("work_id")) or paper.get("source_hold")
        if source_hold:
            missing.append("resolve_recorded_source_hold_before_synthesis")
        if not exact_ids:
            missing.append("reconcile_exact_record_work_version_identity")
        if not live_ids:
            missing.append("bind_live_zotero_record")
        if source["text_available"] and not source["canonical_binding_matches"]:
            missing.append("repair_fulltext_canonical_source_binding")
        if not source["text_available"]:
            missing.append("acquire_canonical_version_fulltext")
            if abstract_quality != "usable":
                missing.append("record_substantive_abstract_if_fulltext_unavailable")
        if not knowledge_doc:
            missing.append("create_source_bound_knowledge_document")
        if knowledge_doc and not knowledge_exists:
            missing.append("restore_declared_knowledge_document")
        if knowledge_authority in {"unreviewed", "preparation"}:
            missing.append("review_knowledge_document_before_authority_promotion")
        records.append(
            {
                "record_id": record_id,
                "title": paper.get("title") or "",
                "work_id": paper.get("work_id"),
                "version_id": paper.get("version_id"),
                "live_zotero_ids": live_ids,
                "live_ids_in_canonical_sync": [
                    key for key in live_ids if key in canonical_live_keys
                ],
                **(
                    {
                        "live_ids_in_optional_snapshot": [
                            key for key in live_ids if key in live_snapshot_keys
                        ]
                    }
                    if live_snapshot_keys is not None
                    else {}
                ),
                **source,
                "abstract_quality": abstract_quality,
                "knowledge_doc": knowledge_doc,
                "knowledge_doc_exists": knowledge_exists,
                "knowledge_authority": knowledge_authority,
                "existing_category_assessment": _assessment(paper),
                "technical_reviewable": technical_reviewable,
                "source_hold": source_hold,
                "source_hold_reason": (source_hold or {}).get("reason"),
                "source_identity_issue": manifest.get(record_id, {}).get("reason"),
                "missing_steps": missing,
            }
        )

    live_keys = {key for record in records for key in record["live_zotero_ids"]}
    if live_keys != canonical_live_keys:
        raise ValueError(
            "published Zotero IDs differ from canonical corpus/zotero_sync.json; "
            f"missing={sorted(canonical_live_keys - live_keys)}, "
            f"extra={sorted(live_keys - canonical_live_keys)}"
        )
    works = {record["work_id"] for record in records if record["work_id"]}
    input_paths = [corpus_path, manifest_path, registry_path, zotero_path]
    if (repo / RESOLUTION_PATH).is_file():
        input_paths.append(repo / RESOLUTION_PATH)
    if live_snapshot_path:
        input_paths.append(live_snapshot_path.resolve())
    return {
        "schema": "femprompt-literature-readiness/1.0",
        "authority": "Technical inventory only; no review or scientific authority is promoted.",
        "inputs": [
            {
                "path": (
                    path.relative_to(repo.resolve()).as_posix()
                    if path.is_relative_to(repo.resolve())
                    else str(path)
                ),
                "sha256": _sha256(path),
            }
            for path in input_paths
        ],
        "counts": {
            "canonical_records": len(records),
            "unique_works": len(works),
            "live_zotero_ids": len(live_keys),
            "canonical_zotero_group_id": zotero_sync["group_id"],
            "canonical_zotero_library_version": zotero_sync["library_version"],
            "canonical_zotero_observed_on": zotero_sync["observed_on"],
            **(
                {"optional_live_snapshot_ids": len(live_snapshot_keys)}
                if live_snapshot_keys is not None
                else {}
            ),
            "canonical_keys_exactly_once": len(seen) == len(records),
            "technical_reviewable_records": sum(
                record["technical_reviewable"] for record in records
            ),
            "source_kinds": dict(
                sorted(Counter(r["source_kind"] for r in records).items())
            ),
            "knowledge_authorities": dict(
                sorted(Counter(r["knowledge_authority"] for r in records).items())
            ),
        },
        "records": records,
    }


def _json_text(payload: dict[str, Any]) -> str:
    return json.dumps(payload, ensure_ascii=False, indent=2) + "\n"


def _csv_text(payload: dict[str, Any]) -> str:
    output = io.StringIO(newline="")
    fields = [
        "record_id",
        "title",
        "work_id",
        "version_id",
        "live_zotero_ids",
        "source_kind",
        "source_path",
        "source_markdown_sha256",
        "text_available",
        "canonical_binding_matches",
        "abstract_quality",
        "knowledge_doc",
        "knowledge_doc_exists",
        "knowledge_authority",
        "technical_reviewable",
        "source_hold_reason",
        "source_identity_issue",
        "missing_steps",
    ]
    writer = csv.DictWriter(output, fieldnames=fields, lineterminator="\n")
    writer.writeheader()
    for record in payload["records"]:
        row = {field: record.get(field) for field in fields}
        row["live_zotero_ids"] = "|".join(record["live_zotero_ids"])
        row["missing_steps"] = "|".join(record["missing_steps"])
        writer.writerow(row)
    return output.getvalue()


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Build literature readiness inventory")
    parser.add_argument("--json", type=Path, default=DEFAULT_JSON)
    parser.add_argument("--csv", type=Path, default=DEFAULT_CSV)
    parser.add_argument(
        "--live-snapshot",
        type=Path,
        help="Optional ignored Zotero API snapshot for an explicit extra comparison",
    )
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    payload = build_readiness(live_snapshot_path=args.live_snapshot)
    outputs = ((args.json, _json_text(payload)), (args.csv, _csv_text(payload)))
    if args.check:
        if any(
            not path.exists() or path.read_text(encoding="utf-8") != text
            for path, text in outputs
        ):
            sys.exit("FEHLER: stale or missing literature readiness output")
        print("OK: literature readiness outputs are current")
        return
    for path, text in outputs:
        path.parent.mkdir(parents=True, exist_ok=True)
        temporary = path.with_suffix(f"{path.suffix}.tmp")
        temporary.write_text(text, encoding="utf-8", newline="\n")
        temporary.replace(path)
    print(f"OK: {payload['counts']['canonical_records']} canonical records audited")


if __name__ == "__main__":
    main()
