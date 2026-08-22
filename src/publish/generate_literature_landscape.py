"""Build the annotation-native literature landscape for the Evidence Companion.

The generator joins the productive PRISM reviewer track with corpus metadata and
publishes only the fields needed for aggregation and evidence drill-down. It is a
fail-closed verification checkpoint. Unknown papers, invalid category values,
ungrounded positive categories, and incomplete Include records stop the build.

Usage:
    python src/publish/generate_literature_landscape.py
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_SCREENING = REPO_ROOT / "docs" / "data" / "screening" / "ar2.json"
DEFAULT_CORPUS = REPO_ROOT / "docs" / "data" / "research_vault_v2.json"
DEFAULT_ANALYSIS_SCHEMA = REPO_ROOT / "docs" / "data" / "analysis_fields.json"
DEFAULT_CATEGORY_SCHEMA = REPO_ROOT / "docs" / "data" / "category_schema.json"
DEFAULT_OUTPUT = REPO_ROOT / "docs" / "data" / "literature_landscape.json"

DECISIONS = frozenset(("Include", "Exclude", "Unclear"))
BINDING_STATUSES = frozenset(("accepted", "ratified_agent_consensus"))


def _read_json(path: Path) -> dict[str, Any]:
    if not path.is_file():
        raise FileNotFoundError(f"Required input is missing: {path}")
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError(f"Expected a JSON object in {path}")
    return data


def _paper_evidence(decision: dict[str, Any], category: str) -> list[dict[str, str]]:
    passages = decision.get("evidence", {}).get(category, [])
    result = []
    for passage in passages:
        if passage.get("source_layer") != "paper":
            continue
        term = str(passage.get("term", "")).strip()
        snippet = str(passage.get("snippet", "")).strip()
        if term and snippet:
            result.append(
                {
                    "term": term,
                    "snippet": snippet,
                    "source_layer": "paper",
                    "actor": str(passage.get("actor", "")),
                }
            )
    return result


def _analysis_payload(
    paper_id: str,
    decision: dict[str, Any],
    analysis_schema: dict[str, Any],
) -> dict[str, Any] | None:
    analysis = decision.get("analysis")
    if not isinstance(analysis, dict):
        return None
    fields = analysis.get("fields", {})
    undecidable = analysis.get("undecidable", {})
    if not isinstance(fields, dict) or not isinstance(undecidable, dict):
        raise ValueError(f"{paper_id}: malformed analysis payload")

    definitions = analysis_schema.get("fields", [])
    known_fields = {definition.get("name") for definition in definitions}
    allowed_fields = known_fields | {"Studientyp"}
    unknown_fields = set(fields) - allowed_fields
    unknown_undecidable = set(undecidable) - known_fields
    if unknown_fields or unknown_undecidable:
        unknown = sorted(unknown_fields | unknown_undecidable)
        raise ValueError(f"{paper_id}: unknown analysis fields {unknown}")

    study_type = fields.get("Studientyp")
    if study_type not in analysis_schema.get("study_types", []):
        raise ValueError(f"{paper_id}: missing or invalid Studientyp")

    expected_basis = {
        "raw": "Fulltext",
        "abstract": "Abstract",
        "knowledge_doc": "Knowledge_Doc",
    }.get(decision.get("text_source"))
    if not expected_basis or fields.get("AN_Coding_Basis") != expected_basis:
        raise ValueError(f"{paper_id}: invalid AN_Coding_Basis for the reading source")

    for definition in definitions:
        name = definition.get("name")
        value = fields.get(name)
        is_undecidable = undecidable.get(name) is True
        if undecidable.get(name) not in (None, False, True):
            raise ValueError(f"{paper_id}: invalid undecidable state for {name}")
        if is_undecidable and value not in (None, [], ""):
            raise ValueError(f"{paper_id}: {name} has a value and is undecidable")
        if definition.get("free_text"):
            if value is not None and not isinstance(value, str):
                raise ValueError(f"{paper_id}: invalid free text in {name}")
            continue

        vocabulary = definition.get("values", [])
        if definition.get("multi"):
            if value is not None and not isinstance(value, list):
                raise ValueError(f"{paper_id}: {name} must be a list")
            values = value or []
            if any(item not in vocabulary for item in values):
                raise ValueError(f"{paper_id}: invalid value in {name}")
            if "None" in values and len(values) > 1:
                raise ValueError(f"{paper_id}: {name} combines None with substantive values")
            filled = bool(values)
        else:
            if value is not None and value not in vocabulary:
                raise ValueError(f"{paper_id}: invalid value in {name}")
            filled = value is not None

        required = not definition.get("optional")
        if name == "AN_Harm_Types":
            required = expected_basis == "Fulltext"
        if name == "AN_Coding_Basis":
            required = True
        if required and not filled and not is_undecidable:
            raise ValueError(f"{paper_id}: required analysis field {name} is empty")

    ordered_names = [definition.get("name") for definition in definitions]
    return {
        "fields": {
            name: fields[name]
            for name in (*ordered_names, "Studientyp")
            if name in fields and name != "AN_Notes"
        },
        "notes": str(fields.get("AN_Notes", "")).strip(),
        "undecidable": sorted(name for name, value in undecidable.items() if value),
    }


def _validate_and_transform_record(
    paper_id: str,
    decision: dict[str, Any],
    paper: dict[str, Any],
    analysis_schema: dict[str, Any],
    allowed_categories: frozenset[str],
) -> dict[str, Any]:
    outcome = decision.get("decision")
    if outcome not in DECISIONS:
        raise ValueError(f"{paper_id}: unsupported decision {outcome!r}")

    published_categories = []
    for category, raw_level in sorted(decision.get("categories", {}).items()):
        if category not in allowed_categories:
            raise ValueError(f"{paper_id}: unknown category {category!r}")
        if isinstance(raw_level, bool) or raw_level not in (1, 2):
            raise ValueError(f"{paper_id}: invalid level {raw_level!r} for {category}")
        evidence = _paper_evidence(decision, category)
        if not evidence:
            raise ValueError(f"{paper_id}: positive category {category} has no Paper evidence")
        published_categories.append(
            {"key": category, "level": raw_level, "evidence": evidence}
        )

    analysis = _analysis_payload(paper_id, decision, analysis_schema)
    if outcome == "Include" and analysis is None:
        raise ValueError(f"{paper_id}: Include record has no complete analysis payload")

    return {
        "id": paper_id,
        "title": paper.get("title", ""),
        "author_year": paper.get("author_year", ""),
        "authors": paper.get("authors", ""),
        "year": paper.get("year"),
        "doi": paper.get("doi", ""),
        "url": paper.get("url", ""),
        "item_type": paper.get("item_type", ""),
        "journal": paper.get("journal", ""),
        "work_id": paper.get("work_id", f"record:{paper_id}"),
        "identity_basis": paper.get("identity_basis", "record"),
        "knowledge_coverage": paper.get("knowledge_coverage", "source_missing"),
        "decision": outcome,
        "reason": decision.get("reason"),
        "text_source": decision.get("text_source", ""),
        "reviewer": decision.get("reviewer", ""),
        "actor": decision.get("actor", ""),
        "categories": published_categories,
        "analysis": analysis,
    }


def build(
    screening_path: Path,
    corpus_path: Path,
    analysis_schema_path: Path = DEFAULT_ANALYSIS_SCHEMA,
    category_schema_path: Path = DEFAULT_CATEGORY_SCHEMA,
) -> dict[str, Any]:
    """Join and verify the productive track, returning deterministic public data."""
    screening = _read_json(screening_path)
    corpus = _read_json(corpus_path)
    analysis_schema = _read_json(analysis_schema_path)
    category_schema = _read_json(category_schema_path)
    category_groups = category_schema.get("groups", {})
    object_categories = category_groups.get("object", [])
    perspective_categories = category_groups.get("perspective", [])
    categories = frozenset((*object_categories, *perspective_categories))
    if len(categories) != 10:
        raise ValueError("Category schema does not contain ten unique categories")
    papers = corpus.get("papers", [])
    paper_by_id = {paper.get("id"): paper for paper in papers if paper.get("id")}
    decisions = screening.get("decisions", {})
    if not isinstance(decisions, dict):
        raise ValueError("Screening track has no decisions object")

    records = []
    for paper_id in sorted(decisions):
        paper = paper_by_id.get(paper_id)
        if paper is None:
            raise ValueError(f"{paper_id}: screening decision has no corpus metadata")
        decision = decisions[paper_id]
        if not isinstance(decision, dict):
            raise ValueError(f"{paper_id}: decision must be an object")
        records.append(
            _validate_and_transform_record(
                paper_id, decision, paper, analysis_schema, categories
            )
        )

    counts = Counter(record["decision"] for record in records)
    source_status = str(screening.get("status", "unknown"))
    try:
        screening_file = screening_path.relative_to(REPO_ROOT).as_posix()
    except ValueError:
        screening_file = screening_path.name
    return {
        "schema": "femprompt-literature-landscape/1.0",
        "source": {
            "screening_file": screening_file,
            "schema": screening.get("schema"),
            "reviewer": screening.get("reviewer"),
            "actor": screening.get("actor"),
            "status": source_status,
            "updated": screening.get("updated"),
            "provisional": source_status not in BINDING_STATUSES,
        },
        "meta": {
            "corpus_total": len(papers),
            "annotated_total": len(records),
            "included_total": counts["Include"],
            "excluded_total": counts["Exclude"],
            "unclear_total": counts["Unclear"],
            "thematic_total": counts["Include"],
        },
        "category_groups": {
            "object": object_categories,
            "perspective": perspective_categories,
        },
        "records": records,
    }


def _write_json_atomic(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    temporary.replace(path)


def _parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Build the annotation-native Evidence Companion dataset."
    )
    parser.add_argument("--screening", type=Path, default=DEFAULT_SCREENING)
    parser.add_argument("--corpus", type=Path, default=DEFAULT_CORPUS)
    parser.add_argument(
        "--analysis-schema", type=Path, default=DEFAULT_ANALYSIS_SCHEMA
    )
    parser.add_argument(
        "--category-schema", type=Path, default=DEFAULT_CATEGORY_SCHEMA
    )
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    return parser


def main() -> int:
    args = _parser().parse_args()
    try:
        payload = build(
            args.screening.resolve(),
            args.corpus.resolve(),
            args.analysis_schema.resolve(),
            args.category_schema.resolve(),
        )
        _write_json_atomic(args.output.resolve(), payload)
    except (FileNotFoundError, json.JSONDecodeError, ValueError) as error:
        print(f"FEHLER: {error}", file=sys.stderr)
        return 1
    print(
        "OK: literature landscape contains "
        f"{payload['meta']['annotated_total']} verified records"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
