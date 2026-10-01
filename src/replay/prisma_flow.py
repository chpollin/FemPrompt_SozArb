#!/usr/bin/env python3
"""PRISMA 2020 identification and selection flow per source, lane and round.

Extends the round-one replay to every identification source of the review. The
round-one counts are taken from ``replay_round1.build_flow_model`` so the two
cannot diverge. The later sources are re-derived from their committed lane
records, deduplicated by a preregistered identity rule, mapped onto the current
Zotero library and the Work-level decision state of the completion package.
The multiple-finds matrices count how often different deep-research systems
returned the same publication.

No timestamps are written, so the output is a deterministic function of the
listed inputs and can sit in the project build.

Run from the repo root:
    python -m src.replay.prisma_flow
    python -m src.replay.prisma_flow --check
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any, Iterable

from src.acquire.zotero_group_reconcile import (
    load_ris,
    normalise_doi,
    normalise_title,
)
from src.replay import replay_round1

REPO = Path(__file__).resolve().parents[2]
OUT_DIR = REPO / "generated" / "prisma-flow"
OUTPUT_NAMES = ("prisma-flow.json", "prisma-flow.csv", "prisma-flow.md", "multiple-finds.csv")
SCHEMA = "femprompt-prisma-flow/0.1"

DR = "corpus/deep-research"
R2 = f"{DR}/round2"
CONTEXTUAL = f"{R2}/contextual-update-2026-08-24"
CODEX = f"{R2}/Codex Websearch/raw"

# Ordered by execution. A later source is deduplicated against the records an
# earlier source transferred and against library items added before its start.
SOURCES: list[dict[str, Any]] = [
    {
        "source_id": "round1_deep_research",
        "round": "round1",
        "start_date": "2025-10-01",
        "label": "Round 1, four deep-research systems (restored RIS) plus manual search",
        "kind": "ris",
        "lanes": [
            {"lane_id": "R1-ChatGPT", "system": "ChatGPT", "path": f"{DR}/OpenAI.ris"},
            {"lane_id": "R1-Claude", "system": "Claude", "path": f"{DR}/Claude.ris"},
            {"lane_id": "R1-Gemini", "system": "Gemini", "path": f"{DR}/Gemini.ris"},
            {"lane_id": "R1-Perplexity", "system": "Perplexity", "path": f"{DR}/Perplexity.ris"},
        ],
    },
    {
        "source_id": "round2_deep_research",
        "round": "round2",
        "start_date": "2026-07-17",
        "label": "Round 2, deep-research lanes L1 to L3 and L5 (L4 Perplexity dropped)",
        "kind": "ris",
        "lanes": [
            {"lane_id": "L1", "system": "ChatGPT", "path": f"{R2}/ChatGPT_deep-research.ris"},
            {"lane_id": "L2", "system": "Claude", "path": f"{R2}/Claude_deep-research.ris"},
            {"lane_id": "L3", "system": "Gemini", "path": f"{R2}/Gemini_deep-research.ris"},
            {"lane_id": "L5", "system": "Claude Code", "path": f"{R2}/ClaudeCode_deep-research.ris"},
        ],
    },
    {
        "source_id": "contextual_update_2026_08_24",
        "round": "round2_supplement",
        "start_date": "2026-08-24",
        "label": "Contextual update 2026-08-24, three Codex subagent lanes, Tier A transferred",
        "kind": "lane_json",
        "lanes": [
            {"lane_id": "CU-A", "system": "Codex contextual", "path": f"{CONTEXTUAL}/lane-a-social-work.json"},
            {"lane_id": "CU-B", "system": "Codex contextual", "path": f"{CONTEXTUAL}/lane-b-feminist-social-work.json"},
            {"lane_id": "CU-C", "system": "Codex contextual", "path": f"{CONTEXTUAL}/lane-c-prompt-bias.json"},
        ],
    },
    {
        "source_id": "codex_websearch_2026",
        "round": "round2_supplement",
        "start_date": "2026-08-24",
        "label": "Codex Websearch 2026, three lanes, 2026 Versions only, Tier A transferred",
        "kind": "lane_json",
        "lanes": [
            {"lane_id": "CW-A", "system": "Codex Websearch", "path": f"{CODEX}/lane-a-social-work-2026.json"},
            {"lane_id": "CW-B", "system": "Codex Websearch", "path": f"{CODEX}/lane-b-gender-intersectionality-2026.json"},
            {"lane_id": "CW-C", "system": "Codex Websearch", "path": f"{CODEX}/lane-c-prompt-bias-2026.json"},
        ],
    },
    {
        "source_id": "targeted_followup_2026_09_05",
        "round": "round2_supplement",
        "start_date": "2026-09-05",
        "label": "Targeted gap follow-up 2026-09-05",
        "kind": "targeted_json",
        "lanes": [
            {"lane_id": "TF", "system": "Targeted follow-up", "path": f"{R2}/targeted-followup-2026-09-05.json"},
        ],
    },
]

# Three exclusion entries summarise whole groups of rejected hits and name no
# publication. Counting them as records would invent three identifications.
AGGREGATE_EXCLUSION_PREFIXES = (
    "All publications dated 2025 or earlier",
    "General artificial-intelligence publications without",
    "Technical and workshop-only fairness candidates",
)

LIBRARY_PATH = "corpus/zotero_export.json"
MAPPING_PATH = "corpus/source_tool_mapping.json"
SYNC_PATH = "corpus/zotero_sync.json"
VAULT_PATH = "docs/data/research_vault_v2.json"
COMPLETION_PATH = "generated/completion/completion-package.json"
ROUND2_INTAKE_PATH = "generated/round2-intake-package.json"
CONTEXTUAL_INTAKE_PATH = "generated/contextual-update-2026-08-24-intake-package.json"
CODEX_PACKAGE_PATH = f"{R2}/Codex Websearch/codex-websearch-2026-package.json"

# Work outcome classes, strongest authority first. A find bound to several
# Works reports the first class that any of them reaches.
OUTCOME_ORDER = (
    "expert_include",
    "expert_exclude",
    "expert_unresolved",
    "ai_review_include_pending_verification",
    "ai_review_exclude_pending_verification",
    "open_fulltext_ready",
    "open_fulltext_not_retrieved",
    "open_not_queued",
    "not_in_library",
)

MULTIPLE_FIND_SCOPES = {
    "round1_systems": ["R1-ChatGPT", "R1-Claude", "R1-Gemini", "R1-Perplexity"],
    "round2_systems": ["L1", "L2", "L3", "L5"],
}
PRODUCTS = ["ChatGPT", "Claude", "Gemini", "Perplexity", "Claude Code"]


def _read_json(rel: str) -> Any:
    return json.loads((REPO / rel).read_text(encoding="utf-8"))


def _sha256(rel: str) -> str:
    return "sha256:" + hashlib.sha256((REPO / rel).read_bytes()).hexdigest()


def _arxiv(value: Any) -> str:
    text = str(value or "").strip().casefold()
    text = re.sub(r"^(?:arxiv:|https?://arxiv\.org/abs/)", "", text)
    return re.sub(r"v\d+$", "", text)


def _values(value: Any) -> list[str]:
    """A field may hold one identifier, a list, or a semicolon-separated string."""
    items = value if isinstance(value, list) else [value]
    return [part.strip() for item in items if item for part in str(item).split(";") if part.strip()]


def identity_keys(doi: Any = "", title: Any = "", arxiv: Any = "") -> set[str]:
    """Preregistered identity rule: shared DOI, arXiv id or normalised title."""
    keys = set()
    for raw in _values(doi):
        if raw.casefold().startswith("arxiv:"):
            keys.add("arxiv:" + _arxiv(raw))
            continue
        norm_doi = normalise_doi(raw)
        if norm_doi:
            keys.add("doi:" + norm_doi)
            if norm_doi.startswith("10.48550/arxiv."):
                keys.add("arxiv:" + _arxiv(norm_doi.removeprefix("10.48550/arxiv.")))
    for raw in _values(arxiv):
        keys.add("arxiv:" + _arxiv(raw))
    norm_title = normalise_title(title)
    if norm_title:
        keys.add("title:" + norm_title)
    return keys


def cluster(records: list[dict[str, Any]]) -> list[list[dict[str, Any]]]:
    """Union-find over shared identity keys, deterministic in input order."""
    parent = list(range(len(records)))

    def find(i: int) -> int:
        while parent[i] != i:
            parent[i] = parent[parent[i]]
            i = parent[i]
        return i

    first_owner: dict[str, int] = {}
    for i, record in enumerate(records):
        for key in sorted(record["keys"]):
            if key in first_owner:
                a, b = find(i), find(first_owner[key])
                if a != b:
                    parent[max(a, b)] = min(a, b)
            else:
                first_owner[key] = i
    groups: dict[int, list[dict[str, Any]]] = defaultdict(list)
    for i, record in enumerate(records):
        groups[find(i)].append(record)
    return [groups[root] for root in sorted(groups)]


def _cluster_keys(group: Iterable[dict[str, Any]]) -> set[str]:
    return set().union(*(r["keys"] for r in group))


def _record(source: dict, lane: dict, index: int, title: str, status: str,
            doi: Any = "", arxiv: Any = "", year: str = "") -> dict[str, Any]:
    return {
        "source_id": source["source_id"],
        "lane_id": lane["lane_id"],
        "system": lane["system"],
        "index": index,
        "title": " ".join(str(title or "").split()),
        "status": status,
        "year": year,
        "keys": identity_keys(doi, title, arxiv),
    }


def _identifier_fields(entry: dict[str, Any]) -> tuple[list[str], list[str]]:
    """DOIs and arXiv ids from the varying identifier shapes of the lane files."""
    dois = _values(entry.get("doi"))
    arxivs: list[str] = []
    for field in ("other_identifiers", "identifiers", "identifier"):
        ids = entry.get(field)
        if isinstance(ids, dict):
            dois += _values(ids.get("doi"))
            arxivs += _values(ids.get("arxiv"))
        elif ids:
            dois += _values(ids)
    return dois, arxivs


def load_lane_records(source: dict[str, Any]) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    """All identification records of one source with their lane status."""
    records: list[dict[str, Any]] = []
    notes: dict[str, Any] = {}
    for lane in source["lanes"]:
        path = REPO / lane["path"]
        if source["kind"] == "ris":
            parsed = load_ris(path, lane["lane_id"], REPO)
            if parsed["invalid_records"]:
                notes[lane["lane_id"]] = {"invalid_ris_records": parsed["invalid_records"]}
            for r in parsed["records"]:
                records.append(_record(source, lane, r["index"], r["title"], "transferred",
                                       doi=r["doi"], year=r["year"]))
        elif source["kind"] == "lane_json":
            data = _read_json(lane["path"])
            for i, c in enumerate(data["candidates"], start=1):
                doi, arxiv = _identifier_fields(c)
                status = "transferred" if c.get("tier") == "A" else "tier_b"
                records.append(_record(source, lane, i, c.get("title"), status, doi=doi, arxiv=arxiv))
            aggregate = 0
            for i, e in enumerate(data["exclusions"], start=1):
                if str(e.get("title", "")).startswith(AGGREGATE_EXCLUSION_PREFIXES):
                    aggregate += 1
                    continue
                doi, arxiv = _identifier_fields(e)
                records.append(_record(source, lane, i, e.get("title"), "excluded_by_ai_agent",
                                       doi=doi, arxiv=arxiv))
            if aggregate:
                notes[lane["lane_id"]] = {"aggregate_exclusion_entries_not_counted": aggregate}
        elif source["kind"] == "targeted_json":
            data = _read_json(lane["path"])
            for i, c in enumerate(data["candidates"], start=1):
                records.append(_record(source, lane, i, c.get("title"), "transferred",
                                       doi=c.get("doi"), year=str(c.get("year") or "")))
    return records, notes


def load_library() -> list[dict[str, Any]]:
    """Library items with their identity keys and recorded import provenance.

    The 2026 imports carry their candidate identifier in Zotero's extra field.
    It binds a record whose curated title and DOI changed during enrichment,
    such as an arXiv preprint later published under another title, to the find.
    """
    items = []
    for item in _read_json(LIBRARY_PATH):
        extra = item.get("extra") or ""
        keys = identity_keys(item.get("DOI") or "", item.get("title"))
        for candidate in re.findall(r"FemPrompt-Candidate-ID:\s*(\S+)", extra):
            match = re.search(r"(?:^|:)(arxiv|doi):(.+)$", candidate)
            if match and match.group(1) == "arxiv":
                keys |= identity_keys(arxiv=match.group(2))
            elif match:
                keys |= identity_keys(doi=match.group(2))
        source = re.search(r"FemPrompt import source:\s*(.+)", extra)
        items.append({
            "key": item["key"],
            "date_added": item.get("dateAdded") or "",
            "collections": list(item.get("collections") or []),
            "import_source": source.group(1).strip() if source else "",
            "keys": keys,
        })
    return items


def _key_index(items: Iterable[dict[str, Any]], value: str) -> dict[str, set[str]]:
    index: dict[str, set[str]] = defaultdict(set)
    for item in items:
        for key in item["keys"]:
            index[key].add(item[value])
    return index


def work_outcomes() -> tuple[dict[str, str], dict[str, str]]:
    """Record id to Work id, and Work id to its outcome class."""
    works = _read_json(COMPLETION_PATH)["works"]
    record_work, outcome = {}, {}
    for work in works:
        authority, decision = work["decision_authority"], work["effective_decision"]
        if authority == "legacy_human":
            cls = {"Include": "expert_include", "Exclude": "expert_exclude"}.get(decision, "expert_unresolved")
        elif authority == "ai_review":
            cls = ("ai_review_include_pending_verification" if decision == "Include"
                   else "ai_review_exclude_pending_verification")
        elif work["source_queue_status"] == "ready":
            cls = "open_fulltext_ready"
        elif work["source_queue_status"] == "blocked_missing_paper_source":
            cls = "open_fulltext_not_retrieved"
        else:
            cls = "open_not_queued"
        outcome[work["work_id"]] = cls
        for record_id in work["record_ids"]:
            record_work[record_id] = work["work_id"]
    return record_work, outcome


def _outcome_of(library_keys: set[str], record_work: dict[str, str], outcome: dict[str, str]) -> str:
    classes = {outcome[record_work[k]] for k in library_keys if k in record_work}
    for cls in OUTCOME_ORDER:
        if cls in classes:
            return cls
    return "not_in_library" if not library_keys else "open_not_queued"


def round1_block(library: list[dict[str, Any]], r1_records: list[dict[str, Any]]) -> dict[str, Any]:
    """Round one from the canonical replay plus recoverable source attribution."""
    human = replay_round1.load_assessment(replay_round1.ASSESS / "human_assessment.csv")
    llm = replay_round1.load_assessment(replay_round1.ASSESS / "llm_assessment_10k.csv")
    papers = replay_round1.load_papers_full(replay_round1.ASSESS / "papers_full.csv")
    flow, _ = replay_round1.build_flow_model(human, llm, papers, {"script": "src/replay/replay_round1.py"})
    flow.pop("provenance")

    mapping = _read_json(MAPPING_PATH)["collection_mapping"]["deep_research_collections"]
    system_collections = {k: v["source_tool"] for k, v in mapping.items() if "round" not in v}
    corpus_keys = set(papers)
    collection_counts: Counter = Counter()
    unattributed = Counter()
    for item in library:
        if item["key"] not in corpus_keys:
            continue
        tools = sorted({system_collections[c] for c in item["collections"] if c in system_collections})
        if tools:
            for tool in tools:
                collection_counts["ChatGPT" if tool == "OpenAI" else tool] += 1
        elif item["collections"]:
            unattributed["thematic_collection_without_system_attribution"] += 1
        else:
            unattributed["no_collection"] += 1
    later = [i for i in library if i["key"] not in corpus_keys and i["date_added"] < "2026-07-17"]
    vault = {p["id"]: p for p in _read_json(VAULT_PATH)["papers"]}

    per_lane = {}
    for lane_id in MULTIPLE_FIND_SCOPES["round1_systems"]:
        lane_records = [r for r in r1_records if r["lane_id"] == lane_id]
        per_lane[lane_id] = {
            "restored_ris_records": len(lane_records),
            "distinct_finds": len(cluster(lane_records)),
        }
    ris_finds = cluster(r1_records)
    reasons = flow["human_exclusion_reasons"]
    return {
        "source_id": "round1_deep_research",
        "label": SOURCES[0]["label"],
        "period": "2025-10",
        "replay_flow_model": flow,
        "identification": {
            "records_identified_library": flow["identification"]["identified_records"],
            "per_system_zotero_collection_records": dict(sorted(collection_counts.items())),
            "per_system_restored_ris": per_lane,
            "restored_ris_records_total": len(r1_records),
            "restored_ris_distinct_finds": len(ris_finds),
            "restored_ris_duplicates_within_or_across_systems": len(r1_records) - len(ris_finds),
            "records_without_system_attribution": dict(sorted(unattributed.items())),
            "attribution_note": ("Only records of the four per-system Zotero collections and the restored RIS "
                                 "files carry a system. The remaining library records sit in thematic "
                                 "collections or none; whether they came from a deep-research system or the "
                                 "manual search is not recorded in the committed data."),
            "later_round1_era_records_outside_papers_full": len(later),
            "later_round1_era_records_with_expert_decision": sum(
                1 for i in later if vault.get(i["key"], {}).get("human")),
        },
        "deduplication": {
            "duplicates_flagged_in_library": flow["identification"]["duplicates_flagged"],
            "records_after_flagged_duplicates": flow["identification"]["records_after_dedup"],
            "expert_exclusions_as_duplicate": reasons["controlled_vocabulary"].get("Duplicate", 0),
            "actor": "Zotero curation flag and expert screening decision, reported separately",
        },
        "screening": {
            "actor": "consolidated expert assessment (Excel workflow)",
            "records_screened": flow["human_decisions"]["total"],
            "records_screened_in_library": flow["screening_tracks"]["human"]["in_corpus"],
            "records_screened_outside_papers_full": flow["screening_tracks"]["human"]["human_only_outside_corpus"],
            "records_excluded": flow["human_decisions"]["exclude"],
            "exclusion_reasons": dict(sorted({**reasons["controlled_vocabulary"],
                                              **reasons["out_of_vocabulary"]}.items())),
            "exclusions_without_reason": reasons["empty_on_exclude"],
            "reports_not_retrieved": reasons["controlled_vocabulary"].get("No_full_text", 0),
            "included": flow["human_decisions"]["include"],
            "llm_track_advisory": flow["llm_decisions"],
            "library_records_without_expert_decision": flow["denominators"]["llm_only"],
        },
    }


def source_block(source: dict[str, Any], records: list[dict[str, Any]], notes: dict[str, Any],
                 earlier_keys: set[str], earlier_any_keys: set[str], library: list[dict[str, Any]],
                 library_index: dict[str, set[str]], record_work: dict[str, str],
                 outcome: dict[str, str]) -> tuple[dict[str, Any], set[str]]:
    """Flow of one later source; returns the block and the keys it transferred."""
    lanes = {}
    lane_distinct_total = 0
    for lane in source["lanes"]:
        lane_records = [r for r in records if r["lane_id"] == lane["lane_id"]]
        status = Counter(r["status"] for r in lane_records)
        distinct = len(cluster(lane_records))
        lane_distinct_total += distinct
        lanes[lane["lane_id"]] = {
            "system": lane["system"],
            "path": lane["path"],
            "records_identified": len(lane_records),
            "records_by_lane_status": dict(sorted(status.items())),
            "duplicates_within_lane": len(lane_records) - distinct,
            **notes.get(lane["lane_id"], {}),
        }
    finds = cluster(records)
    dup_earlier, ineligible, transferred = [], [], []
    for group in finds:
        keys = _cluster_keys(group)
        if keys & earlier_keys:
            dup_earlier.append(group)
        elif not any(r["status"] == "transferred" for r in group):
            ineligible.append(group)
        else:
            transferred.append(group)
    selected = [g for g in finds if any(r["status"] == "transferred" for r in g)]
    outcomes: Counter = Counter()
    for group in transferred:
        lib = set().union(*(library_index.get(k, set()) for k in _cluster_keys(group)))
        outcomes[_outcome_of(lib, record_work, outcome)] += 1
    transferred_keys = set().union(*(_cluster_keys(g) for g in selected)) if selected else set()
    block = {
        "source_id": source["source_id"],
        "round": source["round"],
        "label": source["label"],
        "start_date": source["start_date"],
        "lanes": lanes,
        "records_identified": len(records),
        "duplicates_within_lanes": len(records) - lane_distinct_total,
        "duplicates_across_lanes": lane_distinct_total - len(finds),
        "distinct_finds": len(finds),
        "duplicates_of_earlier_sources": len(dup_earlier),
        "marked_ineligible_by_ai_agent": len(ineligible),
        "transferred_new_finds": len(transferred),
        "selected_finds_any_status": len(selected),
        "selected_finds_matching_any_earlier_record": sum(
            1 for g in selected if _cluster_keys(g) & earlier_any_keys),
        "outcome_of_transferred_finds": {k: outcomes.get(k, 0) for k in OUTCOME_ORDER},
    }
    return block, transferred_keys


def multiple_finds(all_records: list[dict[str, Any]]) -> dict[str, Any]:
    """Overlap of finds between identification systems, on global clusters."""
    clusters = cluster(all_records)
    lane_sets: dict[str, set[int]] = defaultdict(set)
    product_sets: dict[str, set[int]] = defaultdict(set)
    system_sets: dict[str, set[int]] = defaultdict(set)
    for ci, group in enumerate(clusters):
        for r in group:
            lane_sets[r["lane_id"]].add(ci)
            system_sets[_system_label(r)].add(ci)
            if r["source_id"] in ("round1_deep_research", "round2_deep_research"):
                product_sets[r["system"]].add(ci)

    def matrix(names: list[str], sets: dict[str, set[int]]) -> dict[str, Any]:
        rows = {a: {b: len(sets[a] & sets[b]) for b in names} for a in names}
        membership = Counter()
        for ci in set().union(*(sets[n] for n in names)):
            membership[sum(1 for n in names if ci in sets[n])] += 1
        return {
            "systems": names,
            "matrix": rows,
            "distinct_finds": sum(membership.values()),
            "finds_by_number_of_systems": {str(k): membership[k] for k in sorted(membership)},
            "finds_by_two_or_more_systems": sum(v for k, v in membership.items() if k >= 2),
        }

    systems = list(dict.fromkeys(_system_label(r) for r in all_records))
    return {
        "rule": "Same find when records share a normalised DOI, an arXiv id or a normalised title, transitively.",
        "round1_systems": matrix(MULTIPLE_FIND_SCOPES["round1_systems"], lane_sets),
        "round2_systems": matrix(MULTIPLE_FIND_SCOPES["round2_systems"], lane_sets),
        "deep_research_products_pooled": matrix(PRODUCTS, product_sets),
        "all_identification_systems": matrix(systems, system_sets),
    }


def _system_label(record: dict[str, Any]) -> str:
    if record["source_id"] == "round1_deep_research":
        return f"R1 {record['system']}"
    if record["source_id"] == "round2_deep_research":
        return f"R2 {record['system']}"
    return record["system"]


def current_state(library: list[dict[str, Any]]) -> dict[str, Any]:
    """Record and Work level screening state of the canonical corpus now."""
    papers = _read_json(VAULT_PATH)["papers"]
    sync = _read_json(SYNC_PATH)
    live = set(sync["live_record_ids"])
    alias_targets = {t for targets in sync["historical_to_live"].values() for t in targets}
    corpus = set(replay_round1.load_papers_full(replay_round1.ASSESS / "papers_full.csv"))
    added = {i["key"]: i["date_added"] for i in library}
    import_source = {i["key"]: i["import_source"] for i in library}
    open_parts: Counter = Counter()
    round2_by_source: Counter = Counter()
    for p in papers:
        if p["human"]:
            continue
        key = p["id"]
        if key not in live:
            part = "historical_record_without_live_library_item"
        elif key in alias_targets:
            part = "live_reimport_of_historical_record"
        elif key in corpus:
            part = "round1_library_record_without_expert_decision"
        elif added.get(key, "") < "2026-07-17":
            part = "round1_era_addition_without_expert_decision"
        else:
            part = "round2_identification_import"
            round2_by_source[import_source[key] or f"lane collection import {added[key][:10]}"] += 1
        open_parts[part] += 1
    works = _read_json(COMPLETION_PATH)["works"]
    by_authority = Counter(f"{w['decision_authority']}:{w['effective_decision']}" for w in works)
    _, outcome = work_outcomes()
    decided = sum(1 for p in papers if p["human"])
    return {
        "records": {
            "library_records": len(papers),
            "with_consolidated_expert_decision": decided,
            "open": len(papers) - decided,
            "open_by_origin": dict(sorted(open_parts.items())),
            "open_round2_imports_by_import_source": dict(sorted(round2_by_source.items())),
            "note": ("Historical records without a live item and their live re-imports describe the same "
                     "publication twice at record level. The Work level counts each publication once."),
        },
        "works": {
            "works": len(works),
            "by_decision_authority": dict(sorted(by_authority.items())),
            "by_outcome": {k: Counter(outcome.values()).get(k, 0) for k in OUTCOME_ORDER if k != "not_in_library"},
        },
        "fulltext_availability_records": dict(sorted(Counter(p["knowledge_coverage"] for p in papers).items())),
    }


def package_crosscheck() -> dict[str, Any]:
    """Counts the identification packages themselves declare, for comparison."""
    round2 = _read_json(ROUND2_INTAKE_PATH)["counts"]
    contextual = _read_json(CONTEXTUAL_INTAKE_PATH)["counts"]
    codex = _read_json(CODEX_PACKAGE_PATH)["counts"]
    return {
        "round2_intake_package": {"candidates": round2["candidates"]},
        "contextual_intake_package": {"selected_records": contextual["selected_records"]},
        "codex_websearch_package": {
            "lane_tier_a_rows": codex["lane_tier_a_rows"],
            "distinct_tier_a_candidates": codex["distinct_tier_a_candidates"],
            "previously_identified": codex["previously_identified"],
        },
    }


def build_flow() -> dict[str, Any]:
    library = load_library()
    library_index = _key_index(library, "key")
    record_work, outcome = work_outcomes()
    all_records: list[dict[str, Any]] = []
    input_paths = [LIBRARY_PATH, MAPPING_PATH, SYNC_PATH, VAULT_PATH, COMPLETION_PATH,
                   ROUND2_INTAKE_PATH, CONTEXTUAL_INTAKE_PATH, CODEX_PACKAGE_PATH,
                   "assessment/human_assessment.csv", "assessment/llm_assessment_10k.csv",
                   "assessment/papers_full.csv"]

    r1_records, _ = load_lane_records(SOURCES[0])
    all_records += r1_records
    input_paths += [lane["path"] for s in SOURCES for lane in s["lanes"]]
    r1_library_keys = set().union(*(i["keys"] for i in library if i["date_added"] < "2026-07-17"))
    earlier_transferred = set(r1_library_keys) | _cluster_keys(r1_records)
    earlier_any = set(earlier_transferred)

    sources = [round1_block(library, r1_records)]
    for source in SOURCES[1:]:
        records, notes = load_lane_records(source)
        library_before = set().union(
            *(i["keys"] for i in library if i["date_added"] < source["start_date"]))
        block, transferred = source_block(
            source, records, notes, earlier_transferred | library_before,
            earlier_any | library_before, library, library_index, record_work, outcome)
        sources.append(block)
        earlier_transferred |= transferred
        earlier_any |= _cluster_keys(records) if records else set()
        all_records += records

    return {
        "schema": SCHEMA,
        "generator": "src/replay/prisma_flow.py",
        "identity_rule": ("Records are the same find when they share a normalised DOI, an arXiv id or a "
                          "normalised title (transitively). Sources are processed in execution order; a "
                          "find is a duplicate of an earlier source when it matches a record an earlier "
                          "source transferred or a library item added before the source started."),
        "inputs": {p: _sha256(p) for p in sorted(set(input_paths))},
        "sources": sources,
        "multiple_finds": multiple_finds(all_records),
        "current_state": current_state(library),
        "package_crosscheck": package_crosscheck(),
    }


CSV_FIELDS = ("source_id", "lane_id", "box", "count")


def flow_rows(flow: dict[str, Any]) -> list[dict[str, Any]]:
    rows = []
    r1 = flow["sources"][0]
    for box, value in r1["identification"].items():
        if isinstance(value, int):
            rows.append({"source_id": r1["source_id"], "lane_id": "", "box": box, "count": value})
    for system, n in r1["identification"]["per_system_zotero_collection_records"].items():
        rows.append({"source_id": r1["source_id"], "lane_id": f"R1-{system}",
                     "box": "zotero_collection_records", "count": n})
    for lane_id, d in r1["identification"]["per_system_restored_ris"].items():
        for box, n in d.items():
            rows.append({"source_id": r1["source_id"], "lane_id": lane_id, "box": box, "count": n})
    for part, n in r1["identification"]["records_without_system_attribution"].items():
        rows.append({"source_id": r1["source_id"], "lane_id": "", "box": part, "count": n})
    for box, value in {**r1["deduplication"], **r1["screening"]}.items():
        if isinstance(value, int):
            rows.append({"source_id": r1["source_id"], "lane_id": "", "box": box, "count": value})
    for reason, n in r1["screening"]["exclusion_reasons"].items():
        rows.append({"source_id": r1["source_id"], "lane_id": "", "box": f"excluded_reason:{reason}", "count": n})
    for block in flow["sources"][1:]:
        for lane_id, lane in block["lanes"].items():
            for box in ("records_identified", "duplicates_within_lane"):
                rows.append({"source_id": block["source_id"], "lane_id": lane_id, "box": box, "count": lane[box]})
            for status, n in lane["records_by_lane_status"].items():
                rows.append({"source_id": block["source_id"], "lane_id": lane_id,
                             "box": f"lane_status:{status}", "count": n})
        for box, value in block.items():
            if isinstance(value, int):
                rows.append({"source_id": block["source_id"], "lane_id": "", "box": box, "count": value})
        for cls, n in block["outcome_of_transferred_finds"].items():
            rows.append({"source_id": block["source_id"], "lane_id": "", "box": f"outcome:{cls}", "count": n})
    state = flow["current_state"]
    for box in ("library_records", "with_consolidated_expert_decision", "open"):
        rows.append({"source_id": "current_state", "lane_id": "", "box": f"records:{box}",
                     "count": state["records"][box]})
    for part, n in state["records"]["open_by_origin"].items():
        rows.append({"source_id": "current_state", "lane_id": "", "box": f"open_records:{part}", "count": n})
    for part, n in state["records"]["open_round2_imports_by_import_source"].items():
        rows.append({"source_id": "current_state", "lane_id": "", "box": f"open_round2_import:{part}", "count": n})
    rows.append({"source_id": "current_state", "lane_id": "", "box": "works", "count": state["works"]["works"]})
    for cls, n in state["works"]["by_outcome"].items():
        rows.append({"source_id": "current_state", "lane_id": "", "box": f"works:{cls}", "count": n})
    return rows


def matrix_rows(flow: dict[str, Any]) -> list[dict[str, Any]]:
    rows = []
    for scope, m in flow["multiple_finds"].items():
        if not isinstance(m, dict):
            continue
        for a in m["systems"]:
            for b in m["systems"]:
                rows.append({"scope": scope, "system_a": a, "system_b": b, "shared_finds": m["matrix"][a][b]})
    return rows


def _csv(rows: list[dict[str, Any]], fields: tuple[str, ...]) -> str:
    buffer = io.StringIO()
    writer = csv.DictWriter(buffer, fieldnames=fields, lineterminator="\n")
    writer.writeheader()
    writer.writerows(rows)
    return buffer.getvalue()


def _md_matrix(m: dict[str, Any]) -> list[str]:
    names = m["systems"]
    lines = ["| | " + " | ".join(names) + " |", "|---|" + "---|" * len(names)]
    for a in names:
        lines.append(f"| {a} | " + " | ".join(str(m["matrix"][a][b]) for b in names) + " |")
    lines.append("")
    lines.append(f"Distinct finds {m['distinct_finds']}, found by two or more systems "
                 f"{m['finds_by_two_or_more_systems']}, by number of systems "
                 f"{m['finds_by_number_of_systems']}.")
    return lines


def render_markdown(flow: dict[str, Any]) -> str:
    r1 = flow["sources"][0]
    ident, dedup, scr = r1["identification"], r1["deduplication"], r1["screening"]
    lines = [
        "# PRISMA 2020 flow per identification source",
        "",
        f"Generated by `{flow['generator']}` from the inputs listed in `prisma-flow.json`. "
        "Diagonal cells of a matrix give the distinct finds of one system.",
        "",
        f"Identity rule. {flow['identity_rule']}",
        "",
        "## Round 1 (October 2025)",
        "",
        "| Box | Count |",
        "|---|---|",
        f"| Records identified (library, `papers_full.csv`) | {ident['records_identified_library']} |",
    ]
    for system, n in ident["per_system_zotero_collection_records"].items():
        lines.append(f"| of which in the {system} deep-research collection | {n} |")
    for part, n in ident["records_without_system_attribution"].items():
        lines.append(f"| of which without system attribution ({part.replace('_', ' ')}) | {n} |")
    lines += [
        f"| Restored round-1 RIS records (all four systems) | {ident['restored_ris_records_total']} |",
        f"| Restored RIS duplicates within or across systems | {ident['restored_ris_duplicates_within_or_across_systems']} |",
        f"| Duplicates flagged in the library | {dedup['duplicates_flagged_in_library']} |",
        f"| Records after flagged duplicates | {dedup['records_after_flagged_duplicates']} |",
        f"| Records screened by the consolidated expert assessment | {scr['records_screened']} |",
        f"| of which outside `papers_full.csv` | {scr['records_screened_outside_papers_full']} |",
        f"| Records excluded | {scr['records_excluded']} |",
    ]
    for reason, n in scr["exclusion_reasons"].items():
        lines.append(f"| excluded, reason {reason} | {n} |")
    lines += [
        f"| excluded without reason | {scr['exclusions_without_reason']} |",
        f"| Reports not retrieved (exclusion reason No_full_text) | {scr['reports_not_retrieved']} |",
        f"| Included | {scr['included']} |",
        f"| Library records without expert decision (LLM track only) | {scr['library_records_without_expert_decision']} |",
        f"| Later round-1-era records outside `papers_full.csv` | {ident['later_round1_era_records_outside_papers_full']} |",
        "",
        "## Later sources",
        "",
        "| Source | Identified | Dup. within lanes | Dup. across lanes | Dup. of earlier | Ineligible (AI agent) | Transferred new |",
        "|---|---|---|---|---|---|---|",
    ]
    for b in flow["sources"][1:]:
        lines.append(f"| {b['label']} | {b['records_identified']} | {b['duplicates_within_lanes']} | "
                     f"{b['duplicates_across_lanes']} | {b['duplicates_of_earlier_sources']} | "
                     f"{b['marked_ineligible_by_ai_agent']} | {b['transferred_new_finds']} |")
    lines += ["", "### Records identified per lane", "", "| Source | Lane | System | Identified | Lane status | Dup. within lane |",
              "|---|---|---|---|---|---|"]
    for b in flow["sources"][1:]:
        for lane_id, lane in b["lanes"].items():
            status = ", ".join(f"{k} {v}" for k, v in lane["records_by_lane_status"].items())
            lines.append(f"| {b['source_id']} | {lane_id} | {lane['system']} | {lane['records_identified']} | "
                         f"{status} | {lane['duplicates_within_lane']} |")
    lines += ["", "### Current outcome of the transferred new finds", "",
              "| Source | " + " | ".join(OUTCOME_ORDER) + " |", "|---|" + "---|" * len(OUTCOME_ORDER)]
    for b in flow["sources"][1:]:
        lines.append(f"| {b['source_id']} | " + " | ".join(
            str(b["outcome_of_transferred_finds"][k]) for k in OUTCOME_ORDER) + " |")
    state = flow["current_state"]
    lines += ["", "## Current screening state", "", "| Level | Box | Count |", "|---|---|---|"]
    for box in ("library_records", "with_consolidated_expert_decision", "open"):
        lines.append(f"| records | {box} | {state['records'][box]} |")
    for part, n in state["records"]["open_by_origin"].items():
        lines.append(f"| records | open, {part} | {n} |")
    for part, n in state["records"]["open_round2_imports_by_import_source"].items():
        lines.append(f"| records | open round-2 import from `{part}` | {n} |")
    lines.append(f"| works | works | {state['works']['works']} |")
    for cls, n in state["works"]["by_outcome"].items():
        lines.append(f"| works | {cls} | {n} |")
    lines += ["", state["records"]["note"], "", "## Multiple finds (Mehrfachfunde)", ""]
    titles = {
        "round1_systems": "Round 1, restored RIS per system",
        "round2_systems": "Round 2, deep-research lanes",
        "deep_research_products_pooled": "Deep-research products pooled across rounds",
        "all_identification_systems": "All identification systems",
    }
    for scope, title in titles.items():
        lines += [f"### {title}", ""] + _md_matrix(flow["multiple_finds"][scope]) + [""]
    return "\n".join(lines).rstrip() + "\n"


def render_outputs(flow: dict[str, Any]) -> dict[str, str]:
    return {
        "prisma-flow.json": json.dumps(flow, indent=2, ensure_ascii=False, sort_keys=False) + "\n",
        "prisma-flow.csv": _csv(flow_rows(flow), CSV_FIELDS),
        "prisma-flow.md": render_markdown(flow),
        "multiple-finds.csv": _csv(matrix_rows(flow), ("scope", "system_a", "system_b", "shared_finds")),
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--check", action="store_true",
                        help="Fail when the committed outputs differ from a fresh computation.")
    args = parser.parse_args(argv)
    outputs = render_outputs(build_flow())
    if args.check:
        stale = [name for name, text in outputs.items()
                 if not (OUT_DIR / name).is_file()
                 or (OUT_DIR / name).read_text(encoding="utf-8") != text]
        if stale:
            print("STALE: " + ", ".join(stale), file=sys.stderr)
            return 1
        print("OK: PRISMA flow outputs are current")
        return 0
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for name, text in outputs.items():
        (OUT_DIR / name).write_text(text, encoding="utf-8", newline="\n")
    print(f"Wrote {', '.join(OUTPUT_NAMES)} to {OUT_DIR.relative_to(REPO).as_posix()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
