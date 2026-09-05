"""Count knowledge coverage without treating document links as verified evidence."""
from __future__ import annotations

from collections import Counter, defaultdict
import json
from pathlib import Path, PurePosixPath

import yaml


def build_knowledge_coverage(repo: Path, registry: dict, inputs: set[str]) -> dict:
    """Return deterministic coverage and register every read file for fingerprinting.

    Denominators use registry record_index, excluding unbound search candidates.
    Recorded maturity is reported literally; this helper grants no review status.
    """
    repo = repo.resolve()

    def read(path: Path) -> str:
        relative = path.resolve().relative_to(repo).as_posix()
        inputs.add(relative)
        return path.read_text(encoding="utf-8")

    def metadata(path: Path) -> dict:
        text = read(path)
        if not text.startswith("---\n"):
            return {}
        parts = text.split("\n---", 1)
        value = yaml.safe_load(parts[0][4:]) if len(parts) == 2 else {}
        return value if isinstance(value, dict) else {}

    code = repo / "src/analysis/knowledge_coverage.py"
    if code.is_file():
        inputs.add(code.relative_to(repo).as_posix())
    papers = json.loads(read(repo / "docs/data/research_vault_v2.json"))["papers"]
    projected = {paper["id"]: paper for paper in papers}
    if len(projected) != len(papers):
        raise ValueError("Duplicate record IDs in knowledge projection")
    index = registry["record_index"]
    work_records, linked, document_records = defaultdict(list), {}, defaultdict(list)
    missing, broken, mismatches = [], [], []
    for key, binding in sorted(index.items()):
        work_records[binding["work_id"]].append(key)
        paper = projected.get(key, {})
        row = {"record_id": key, "work_id": binding["work_id"]}
        document = paper.get("knowledge_doc")
        if paper and paper.get("work_id") != binding["work_id"]:
            mismatches.append({**row, "projected_work_id": paper.get("work_id")})
        if not document:
            missing.append({**row, "reason": "no_document_link" if paper else "record_missing_from_projection"})
            continue
        try:
            pure = PurePosixPath(document)
            if (not isinstance(document, str) or "\\" in document or ":" in document
                    or pure.is_absolute() or ".." in pure.parts
                    or pure.parts[:2] != ("vault", "Papers") or pure.suffix != ".md"):
                raise ValueError("unsafe_or_unexpected_document_path")
            path = repo / "docs" / document
            canonical = path.resolve().relative_to(repo).as_posix()
            if not path.is_file():
                raise ValueError("document_file_missing")
            read(path)
            if paper.get("work_id") != binding["work_id"]:
                raise ValueError("projection_work_identity_mismatch")
        except (ValueError, TypeError) as exc:
            broken.append({**row, "knowledge_doc": document, "reason": str(exc)})
            continue
        linked[key] = canonical
        document_records[canonical].append(key)
    linked_works = {index[key]["work_id"] for key in linked}
    shared = []
    for document, keys in sorted(document_records.items()):
        works = sorted({index[key]["work_id"] for key in keys})
        if len(works) > 1:
            shared.append({"knowledge_doc": document, "work_ids": works, "record_ids": keys})

    graph_path = repo / "docs/data/concept_graph.json"
    graph = json.loads(read(graph_path)) if graph_path.is_file() else {}
    maps = graph.get("paper_concepts", {})
    mapped = {key for key, concepts in maps.items() if concepts and key in index}
    nodes = {node["id"] for node in graph.get("nodes", [])}
    edges = graph.get("edges", [])
    connected = {edge[end] for edge in edges for end in ("source", "target")}

    legacy = []
    for path in sorted((repo / "generated/distilled").glob("*.md")):
        legacy.append(metadata(path))
    migrated = []
    for path in sorted((repo / "research-vault/10_distillates").glob("*.md")):
        meta = metadata(path)
        if meta.get("layer") == "distillate":
            migrated.append(meta)
    active = []
    for folder in ("20_distillates", "30_assertions"):
        for path in sorted((repo / "research-vault" / folder).rglob("*.md")):
            meta = metadata(path)
            if meta.get("type") in {"distillate", "assertion", "moc"}:
                active.append({"path": path.relative_to(repo).as_posix(), "type": meta["type"],
                               "recorded_status": meta.get("status", "unrecorded"),
                               **({"work_id": meta["work-id"]} if meta.get("work-id") else {})})
    active.sort(key=lambda row: row["path"])
    return {
        "schema": "femprompt-knowledge-coverage/0.1",
        "definitions": {
            "denominator": "Canonical bibliographic records and unique Work IDs in registry.record_index; unbound candidates are excluded.",
            "linked": "An existing repository Knowledge Document linked from a matching record/Work projection. This is availability, not source verification, inclusion or completed synthesis.",
            "shared_document": "A document linked to multiple Work IDs is an identity-review candidate, not an automatically established duplicate.",
            "graph": "Concept co-occurrence is an exploratory document relationship, not a supported assertion or causal relation. Filtered graph nodes can legitimately be isolated.",
            "active_status": "Literal document maturity metadata only. Current source-bound review receipts are evaluated separately by the assertion and completion builders.",
            "legacy": "File/source/title counts are not counts of unique studies or reviewed assertions; migrated indexes are excluded.",
        },
        "counts": {"canonical_records": len(index), "record_bound_works": len(work_records),
                   "linked_records": len(linked), "linked_works": len(linked_works),
                   "distinct_linked_documents": len(document_records), "missing_link_records": len(missing),
                   "broken_link_records": len(broken), "works_without_linked_document": len(work_records) - len(linked_works),
                   "shared_documents_across_works": len(shared)},
        "records_without_document_link": missing, "broken_document_links": broken,
        "works_without_document": [{"work_id": work, "record_ids": keys} for work, keys in sorted(work_records.items()) if work not in linked_works],
        "shared_documents_across_works": shared, "projection_identity_mismatches": mismatches,
        "unbound_projection_record_ids": sorted(set(projected) - set(index)),
        "graph": {"available": graph_path.is_file(), "nodes": len(nodes), "edges": len(edges),
                  "canonical_mapped_records": len(mapped), "canonical_mapped_works": len({index[key]["work_id"] for key in mapped}),
                  "unbound_record_keys": sorted(set(maps) - set(index)),
                  "records_without_concept_map": sorted(set(index) - mapped),
                  "mapped_records_without_document": sorted(mapped - set(linked)),
                  "isolated_node_ids": sorted(nodes - connected),
                  "dangling_edge_node_ids": sorted(connected - nodes)},
        "legacy": {"generated_document_files": len(legacy),
                   "distinct_declared_source_files": len({m["source_file"] for m in legacy if m.get("source_file")}),
                   "distinct_exact_titles": len({m["title"] for m in legacy if m.get("title")}),
                   "migrated_distillates": len(migrated),
                   "migrated_audit_states": dict(sorted(Counter(m.get("audit", "unrecorded") for m in migrated).items()))},
        "active": {"counts_by_type": dict(sorted(Counter(row["type"] for row in active).items())),
                   "recorded_status_counts": dict(sorted(Counter(row["recorded_status"] for row in active).items())),
                   "distillate_work_ids": sorted({row["work_id"] for row in active if row["type"] == "distillate" and row.get("work_id")}),
                   "documents": active},
    }
