#!/usr/bin/env python3
"""Build the work-level queue for productive AI-agent screening.

The queue preserves the project's authority rule: a work with any existing human
annotation is not reassessed by an AI agent.  Productive PRISM records at
``ai-agent-reviewed`` or above also cover their work.  Duplicate Zotero records
therefore do not create artificial screening tasks.

Only a verified local Paper representation (``clean`` or ``raw`` in the full-text
manifest) opens the run gate.  An abstract remains visible as an acquisition aid,
but does not replace the controlled full-text intake required by the round-two
protocol.

Usage:
    python -m src.analysis.build_agent_screening_queue
    python -m src.analysis.build_agent_screening_queue --check
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict
from pathlib import Path
from typing import Any

from src.file_hashing import file_sha256

REPO = Path(__file__).resolve().parents[2]
DEFAULT_OUTPUT = REPO / "generated" / "agent-screening-queue.json"
REVIEWED_STATES = {"ai-agent-reviewed", "verified", "publication-approved"}
SOURCE_PRIORITY = {"clean": 3, "raw": 2, "none": 0}


def _sha256(path: Path) -> str:
    return file_sha256(path)


def _screening_states(repo: Path) -> dict[str, str]:
    states: dict[str, str] = {}
    screening_dir = repo / "docs" / "data" / "screening"
    for path in sorted(screening_dir.glob("*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        if not str(data.get("schema", "")).startswith("femprompt-prisma-reviewer/"):
            continue
        for paper_id, record in data.get("decisions", {}).items():
            state = record.get("lifecycle", {}).get("state")
            if state in REVIEWED_STATES:
                states[paper_id] = state
    return states


def _representative(
    papers: list[dict[str, Any]], fulltext: dict[str, dict[str, Any]]
) -> dict[str, Any]:
    def rank(paper: dict[str, Any]) -> tuple[int, int, int, str]:
        source = fulltext.get(paper["id"], {}).get("src", "none")
        return (
            -int(bool(paper.get("is_preferred_version", True))),
            -SOURCE_PRIORITY.get(source, 0),
            -int(bool(paper.get("abstract"))),
            paper["id"],
        )

    return min(papers, key=rank)


def build_queue(repo: Path = REPO) -> dict[str, Any]:
    """Return the deterministic work-level screening queue."""
    vault_path = repo / "docs" / "data" / "research_vault_v2.json"
    fulltext_path = repo / "docs" / "data" / "fulltext_manifest.json"
    vault = json.loads(vault_path.read_text(encoding="utf-8"))
    fulltext = json.loads(fulltext_path.read_text(encoding="utf-8"))
    screening_states = _screening_states(repo)

    work_groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for paper in vault["papers"]:
        work_groups[paper["work_id"]].append(paper)

    queue: list[dict[str, Any]] = []
    covered_aliases: list[dict[str, Any]] = []
    direct_human_records = 0
    direct_ai_only_records = 0
    queued_records = 0

    for work_id, papers in sorted(work_groups.items()):
        human_records = sorted(paper["id"] for paper in papers if paper.get("human"))
        reviewed_records = sorted(
            paper["id"] for paper in papers if paper["id"] in screening_states
        )
        direct_human_records += len(human_records)
        direct_ai_only_records += sum(
            paper["id"] in screening_states and not paper.get("human")
            for paper in papers
        )

        unannotated = [
            paper
            for paper in papers
            if not paper.get("human") and paper["id"] not in screening_states
        ]
        if not unannotated:
            continue
        if human_records or reviewed_records:
            covered_aliases.extend(
                {
                    "work_id": work_id,
                    "record_id": paper["id"],
                    "covered_by_human_records": human_records,
                    "covered_by_ai_agent_reviewed_records": reviewed_records,
                }
                for paper in unannotated
            )
            continue

        representative = _representative(unannotated, fulltext)
        representative_id = representative["id"]
        source = fulltext.get(representative_id, {"src": "none", "chars": 0})
        source_status = source.get("src", "none")
        source_path = repo / "docs" / "data" / "fulltext" / f"{representative_id}.md"
        paper_source = (
            source_path.relative_to(repo).as_posix()
            if source_status in {"clean", "raw"} and source_path.exists()
            else None
        )
        preferred_source = bool(representative.get("is_preferred_version", True))
        source_version_id = source.get("version_id")
        version_matches = not source_version_id or source_version_id == representative.get(
            "version_id"
        )
        ready = paper_source is not None and preferred_source and version_matches
        blockers: list[str] = []
        if paper_source is None:
            blockers.append("reviewed_fulltext_markdown_missing")
        if not preferred_source:
            blockers.append("preferred_version_paper_source_missing")
        if not version_matches:
            blockers.append("paper_source_version_mismatch")
        queued_records += len(unannotated)
        queue.append(
            {
                "work_id": work_id,
                "preferred_version_id": representative.get("preferred_version_id"),
                "latest_version_id": representative.get("latest_version_id"),
                "selected_version_id": representative.get("version_id"),
                "selected_version_type": representative.get("version_type", "unknown"),
                "selected_version_is_preferred": preferred_source,
                "available_versions": representative.get("work_versions", []),
                "representative_record_id": representative_id,
                "record_ids": sorted(paper["id"] for paper in unannotated),
                "title": representative["title"],
                "author_year": representative["author_year"],
                "doi": representative.get("doi") or None,
                "url": representative.get("url") or None,
                "abstract_available": bool(representative.get("abstract")),
                "source_status": source_status,
                "source_chars": source.get("chars", 0),
                "paper_source": paper_source,
                "paper_source_work_id": source.get("work_id"),
                "paper_source_version_id": source_version_id,
                "paper_source_sha256": _sha256(source_path) if ready else None,
                "queue_status": "ready" if ready else "blocked_missing_paper_source",
                "blockers": blockers,
            }
        )

    ready_works = sum(item["queue_status"] == "ready" for item in queue)
    abstract_only = sum(
        item["queue_status"] != "ready" and item["abstract_available"] for item in queue
    )
    no_text = sum(
        item["queue_status"] != "ready" and not item["abstract_available"]
        for item in queue
    )
    canonical_records = len(vault["papers"])
    partition = (
        direct_human_records
        + direct_ai_only_records
        + queued_records
        + len(covered_aliases)
    )
    if partition != canonical_records:
        raise ValueError(
            f"record partition mismatch: {partition} classified, {canonical_records} canonical"
        )

    return {
        "schema": "femprompt-agent-screening-queue/0.2",
        "purpose": "Work-level queue for records without human or governed AI-agent review",
        "script": "src/analysis/build_agent_screening_queue.py",
        "authority_rule": "Any human annotation covers the canonical work; duplicate records do not trigger reassessment.",
        "sources": {
            "research_vault": vault_path.relative_to(repo).as_posix(),
            "research_vault_sha256": _sha256(vault_path),
            "fulltext_manifest": fulltext_path.relative_to(repo).as_posix(),
            "fulltext_manifest_sha256": _sha256(fulltext_path),
            "productive_screening_dir": "docs/data/screening",
        },
        "counts": {
            "canonical_records": canonical_records,
            "canonical_works": len(work_groups),
            "direct_human_annotated_records": direct_human_records,
            "direct_ai_agent_reviewed_without_human": direct_ai_only_records,
            "unannotated_alias_records_covered_at_work_level": len(covered_aliases),
            "queued_records": queued_records,
            "queued_works": len(queue),
            "ready_works": ready_works,
            "blocked_abstract_only_works": abstract_only,
            "blocked_without_text_works": no_text,
        },
        "gate": {
            "status": "partial" if ready_works else "blocked",
            "ready_work_ids": [
                item["work_id"] for item in queue if item["queue_status"] == "ready"
            ],
            "required_action": "Acquire and review Paper Markdown for every blocked work before its agent run.",
        },
        "queue": queue,
        "covered_alias_records": covered_aliases,
    }


def _serialise(queue: dict[str, Any]) -> str:
    return json.dumps(queue, ensure_ascii=False, indent=2) + "\n"


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Build the AI-agent screening queue")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument(
        "--check", action="store_true", help="Fail if the output is stale"
    )
    args = parser.parse_args()

    queue = build_queue()
    rendered = _serialise(queue)
    output = args.output.resolve()
    if args.check:
        if not output.exists() or output.read_text(encoding="utf-8") != rendered:
            sys.exit(f"FEHLER: stale or missing screening queue: {output}")
        print(f"OK: AI-agent screening queue is current: {output}")
        return

    output.parent.mkdir(parents=True, exist_ok=True)
    temporary = output.with_suffix(f"{output.suffix}.tmp")
    temporary.write_text(rendered, encoding="utf-8", newline="\n")
    temporary.replace(output)
    counts = queue["counts"]
    print(
        "OK: "
        f"{counts['queued_works']} uncovered works; "
        f"{counts['ready_works']} ready and "
        f"{counts['queued_works'] - counts['ready_works']} blocked on Paper sources"
    )


if __name__ == "__main__":
    main()
