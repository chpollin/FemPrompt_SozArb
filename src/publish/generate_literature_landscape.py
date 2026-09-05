"""Build the annotation-native literature landscape for the Evidence Companion.

The generator joins the productive PRISM reviewer track with corpus metadata and
publishes only the fields needed for aggregation and evidence drill-down. It is a
fail-closed validation and publication checkpoint. Unknown papers, invalid category values,
ungrounded positive categories, and incomplete Include records stop the build.

Usage:
    python src/publish/generate_literature_landscape.py
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter, defaultdict
from copy import deepcopy
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_SCREENING = REPO_ROOT / "docs" / "data" / "screening" / "ar2.json"
DEFAULT_CORPUS = REPO_ROOT / "docs" / "data" / "research_vault_v2.json"
DEFAULT_ANALYSIS_SCHEMA = REPO_ROOT / "docs" / "data" / "analysis_fields.json"
DEFAULT_CATEGORY_SCHEMA = REPO_ROOT / "docs" / "data" / "category_schema.json"
DEFAULT_WORK_VERSION_CONTRACT = (
    REPO_ROOT / "docs" / "data" / "work_version_contract.json"
)
DEFAULT_OUTPUT = REPO_ROOT / "docs" / "data" / "literature_landscape.json"

DECISIONS = frozenset(("Include", "Exclude", "Unclear"))
PUBLICATION_STATE = "publication-approved"


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
                    "work_id": str(
                        passage.get("work_id") or decision.get("work_id") or ""
                    ),
                    "version_id": str(
                        passage.get("version_id") or decision.get("version_id") or ""
                    ),
                }
            )
    return result


def _publication_event(
    decision: dict[str, Any], paper_id: str
) -> dict[str, Any] | None:
    """Return the publication event, or withhold a record that has not reached it."""
    lifecycle = decision.get("lifecycle")
    if not isinstance(lifecycle, dict):
        return None
    if lifecycle.get("state") != PUBLICATION_STATE:
        return None
    events = lifecycle.get("events")
    if not isinstance(events, list) or not events:
        raise ValueError(f"{paper_id}: publication approval has no lifecycle event")
    event = events[-1]
    if (
        not isinstance(event, dict)
        or event.get("from") != "verified"
        or event.get("to") != PUBLICATION_STATE
        or event.get("event_type") != "publication_approval"
        or event.get("result") != "approved"
    ):
        raise ValueError(
            f"{paper_id}: final lifecycle event is not publication approval"
        )
    if not str(event.get("event_id", "")).strip():
        raise ValueError(f"{paper_id}: publication approval event has no ID")
    if not str(event.get("at", "")).strip():
        raise ValueError(f"{paper_id}: publication approval event has no timestamp")
    actor_ids = event.get("actor_ids")
    if not isinstance(actor_ids, list) or not any(
        str(value).strip() for value in actor_ids
    ):
        raise ValueError(f"{paper_id}: publication approval event has no actor")
    return event


def _verification_event(decision: dict[str, Any], paper_id: str) -> dict[str, Any]:
    events = decision["lifecycle"]["events"]
    event = next(
        (
            candidate
            for candidate in reversed(events)
            if candidate.get("event_type") == "domain_expert_verification"
            and candidate.get("to") == "verified"
        ),
        None,
    )
    if event is None or event.get("result") not in (
        "accepted",
        "corrected_and_accepted",
    ):
        raise ValueError(
            f"{paper_id}: publication approval has no accepted verification"
        )
    return event


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
                raise ValueError(
                    f"{paper_id}: {name} combines None with substantive values"
                )
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


def _validate_recorded_identity(
    paper_id: str,
    work_id: Any,
    version_id: Any,
    paper: dict[str, Any],
    allow_legacy: bool,
) -> None:
    """Normalize only documented legacy identities, never conflicting ones."""
    if version_id not in (None, "", paper.get("version_id")):
        raise ValueError(f"{paper_id}: recorded version identity differs from corpus")
    if work_id in (None, "", paper.get("work_id")):
        return
    if allow_legacy and work_id == f"record:{paper_id}":
        return
    doi = paper.get("doi")
    if (
        allow_legacy
        and isinstance(work_id, str)
        and work_id.startswith("doi:")
        and isinstance(doi, str)
        and doi.strip()
        and work_id.removeprefix("doi:").strip().casefold() == doi.strip().casefold()
    ):
        return
    raise ValueError(f"{paper_id}: recorded work identity is unknown or differs from corpus")


def _validate_and_transform_record(
    paper_id: str,
    decision: dict[str, Any],
    paper: dict[str, Any],
    analysis_schema: dict[str, Any],
    allowed_categories: frozenset[str],
    ai_verification: dict[str, Any] | None = None,
) -> dict[str, Any]:
    outcome = decision.get("decision")
    if outcome not in DECISIONS:
        raise ValueError(f"{paper_id}: unsupported decision {outcome!r}")
    binding = (ai_verification or {}).get("canonical_binding")
    bound_identity = binding == {"paper_id": paper_id, "work_id": paper.get("work_id"), "version_id": paper.get("version_id")}
    if binding is not None and not bound_identity:
        raise ValueError(f"{paper_id}: AI verification receipt canonical binding differs from corpus")
    _validate_recorded_identity(
        paper_id, decision.get("work_id"), decision.get("version_id"), paper, bound_identity
    )

    published_categories = []
    for category, raw_level in sorted(decision.get("categories", {}).items()):
        if category not in allowed_categories:
            raise ValueError(f"{paper_id}: unknown category {category!r}")
        if isinstance(raw_level, bool) or raw_level not in (1, 2):
            raise ValueError(f"{paper_id}: invalid level {raw_level!r} for {category}")
        evidence = _paper_evidence(decision, category)
        for passage in evidence:
            _validate_recorded_identity(
                paper_id, passage["work_id"], passage["version_id"], paper, bound_identity
            )
            if bound_identity:
                passage["recorded_work_id"] = passage["work_id"]
                passage["recorded_version_id"] = passage["version_id"]
                passage["work_id"] = paper["work_id"]
                passage["version_id"] = paper["version_id"]
        if not evidence:
            raise ValueError(
                f"{paper_id}: positive category {category} has no Paper evidence"
            )
        published_categories.append(
            {"key": category, "level": raw_level, "evidence": evidence}
        )

    analysis = _analysis_payload(paper_id, decision, analysis_schema)
    if outcome == "Include" and analysis is None:
        raise ValueError(f"{paper_id}: Include record has no complete analysis payload")

    publication_event = _publication_event(decision, paper_id)
    if publication_event is None and ai_verification is None:
        raise ValueError(f"{paper_id}: record is not publication-approved")
    verification_event = (
        _verification_event(decision, paper_id)
        if decision["lifecycle"]["state"] in ("verified", PUBLICATION_STATE) else None
    )

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
        "work_id": paper.get("work_id") or f"record:{paper_id}",
        "version_id": paper.get("version_id"),
        "version_type": paper.get("version_type", "unknown"),
        "version_date": paper.get("version_date", ""),
        "peer_review_status": paper.get("peer_review_status", "not_established"),
        "peer_review_basis": paper.get("peer_review_basis", "unknown"),
        "preferred_version_id": paper.get("preferred_version_id"),
        "latest_version_id": paper.get("latest_version_id"),
        "is_preferred_version": paper.get("is_preferred_version", True),
        "work_versions": paper.get("work_versions", []),
        "identity_basis": paper.get("identity_basis", "record"),
        "knowledge_coverage": paper.get("knowledge_coverage", "source_missing"),
        "decision": outcome,
        "reason": decision.get("reason"),
        "text_source": decision.get("text_source", ""),
        "reviewer": decision.get("reviewer", ""),
        "actor": decision.get("actor", ""),
        "lifecycle_state": decision["lifecycle"]["state"],
        "publication_basis": "human-publication-approval" if publication_event else "ai-source-review",
        "recorded_identity": {"work_id": decision.get("work_id"), "version_id": decision.get("version_id")},
        "ai_verification": {
            key: deepcopy(ai_verification[key])
            for key in ("artifact", "sha256", "result", "review_type", "agent_id", "model", "model_id_status", "reviewed_at", "findings", "canonical_binding", "field_changes")
            if key in ai_verification
        } if ai_verification else None,
        "verification": {
            "event_id": verification_event.get("event_id"),
            "result": verification_event.get("result"),
            "at": verification_event.get("at"),
            "actor_ids": verification_event.get("actor_ids"),
            "annotation_id": verification_event.get("annotation_id"),
        } if verification_event else None,
        "publication_approval": {
            "event_id": publication_event.get("event_id"),
            "at": publication_event.get("at"),
            "actor_ids": publication_event.get("actor_ids"),
        } if publication_event else None,
        "categories": published_categories,
        "analysis": analysis,
    }


def _annotation_signature(record: dict[str, Any]) -> str:
    """Compare substantive coding, allowing different quotations and notes."""
    analysis = record.get("analysis")
    fields = analysis.get("fields", {}) if analysis else {}
    normalized_fields = {
        name: sorted(value) if isinstance(value, list) else value
        for name, value in fields.items() if name != "AN_Notes"
    }
    return json.dumps(
        {
            "decision": record["decision"],
            "reason": record.get("reason"),
            "categories": [(item["key"], item["level"]) for item in record["categories"]],
            "analysis_fields": normalized_fields if analysis else None,
            "undecidable": analysis.get("undecidable", []) if analysis else [],
        },
        sort_keys=True,
    )


def _aggregate_works(
    records: list[dict[str, Any]], papers: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    """Publish one aggregation row per Work while retaining approved provenance.

    Preferred versions select display metadata only; they never override conflicting
    approved coding. Such a conflict requires explicit reconciliation upstream.
    """
    by_work: dict[str, list[dict[str, Any]]] = defaultdict(list)
    corpus_aliases: dict[str, list[str]] = defaultdict(list)
    for paper in papers:
        corpus_aliases[paper.get("work_id") or f"record:{paper['id']}"].append(paper["id"])
    for record in records:
        by_work[record["work_id"]].append(record)

    works = []
    for work_id, aliases in sorted(by_work.items()):
        if len({_annotation_signature(record) for record in aliases}) != 1:
            ids = ", ".join(sorted(record["id"] for record in aliases))
            raise ValueError(
                f"{work_id}: conflicting publishable annotations ({ids}); "
                "reconcile decisions, categories and analysis before publication"
            )
        aliases.sort(key=lambda record: (not record["is_preferred_version"], record["id"]))
        work = deepcopy(aliases[0])
        work["aggregation_unit"] = "work"
        work["record_ids"] = sorted(record["id"] for record in aliases)
        work["corpus_record_ids"] = sorted(corpus_aliases[work_id])
        work["version_ids"] = sorted({record["version_id"] for record in aliases if record["version_id"]})
        work["source_records"] = deepcopy(sorted(aliases, key=lambda record: record["id"]))
        for category in work["categories"]:
            category["evidence"] = [
                {**passage, "source_record_id": record["id"]}
                for record in sorted(aliases, key=lambda record: record["id"])
                for candidate in record["categories"]
                if candidate["key"] == category["key"]
                for passage in candidate["evidence"]
            ]
        works.append(work)
    return works


def build(
    screening_path: Path,
    corpus_path: Path,
    analysis_schema_path: Path = DEFAULT_ANALYSIS_SCHEMA,
    category_schema_path: Path = DEFAULT_CATEGORY_SCHEMA,
    work_version_contract_path: Path = DEFAULT_WORK_VERSION_CONTRACT,
    publication_policy: dict[str, Any] | None = None,
    verification_receipts: dict[str, dict[str, Any]] | None = None,
) -> dict[str, Any]:
    """Join and verify the productive track, returning deterministic public data."""
    screening = _read_json(screening_path)
    try:
        from src.assess.screening_lifecycle import require_valid_document
    except ModuleNotFoundError:
        sys.path.insert(0, str(REPO_ROOT))
        from src.assess.screening_lifecycle import require_valid_document

    require_valid_document(screening)
    from src.assess.artifact_verification import reviewed_screening_projection
    corpus = _read_json(corpus_path)
    analysis_schema = _read_json(analysis_schema_path)
    category_schema = _read_json(category_schema_path)
    work_version_contract = _read_json(work_version_contract_path)
    category_groups = category_schema.get("groups", {})
    object_categories = category_groups.get("object", [])
    perspective_categories = category_groups.get("perspective", [])
    categories = frozenset((*object_categories, *perspective_categories))
    if len(categories) != 10:
        raise ValueError("Category schema does not contain ten unique categories")
    papers = corpus.get("papers", [])
    paper_by_id = {paper.get("id"): paper for paper in papers if paper.get("id")}
    if len(paper_by_id) != len(papers):
        raise ValueError("Corpus must contain unique, nonempty record IDs")
    decisions = screening.get("decisions", {})
    if not isinstance(decisions, dict):
        raise ValueError("Screening track has no decisions object")

    try:
        screening_file = screening_path.relative_to(REPO_ROOT).as_posix()
    except ValueError:
        screening_file = screening_path.name
    allowed_states = set((publication_policy or {}).get("allowed_states", [PUBLICATION_STATE]))
    if not allowed_states or allowed_states - {"ai-agent-reviewed", "verified", PUBLICATION_STATE}:
        raise ValueError("Invalid publication policy states")

    records = []
    withheld_total = 0
    for paper_id in sorted(decisions):
        paper = paper_by_id.get(paper_id)
        if paper is None:
            raise ValueError(f"{paper_id}: screening decision has no corpus metadata")
        decision = decisions[paper_id]
        if not isinstance(decision, dict):
            raise ValueError(f"{paper_id}: decision must be an object")
        state = decision.get("lifecycle", {}).get("state")
        if state not in allowed_states:
            withheld_total += 1
            continue
        receipt = None
        correction = None
        if _publication_event(decision, paper_id) is None:
            pointer_id = paper_id.replace("~", "~0").replace("/", "~1")
            artifact = f"{screening_file}#/decisions/{pointer_id}"
            decision, receipt, correction = reviewed_screening_projection(
                REPO_ROOT, artifact, decision,
                verification_receipts if verification_receipts is not None else {},
            )
            if receipt is None or receipt.get("result") != "accepted":
                withheld_total += 1
                continue
            if not correction and receipt.get("artifact") != artifact:
                raise ValueError(f"{paper_id}: AI verification receipt is stale or targets another record")
            if receipt.get("review_type") != "ai-source-review" or any(
                not isinstance(receipt.get(field), str) or not receipt[field].strip()
                for field in ("agent_id", "model", "reviewed_at", "findings")
            ):
                raise ValueError(f"{paper_id}: AI verification receipt lacks attribution")
            if not any(
                source.get("work_id") == paper.get("work_id")
                and source.get("version_id") == paper.get("version_id")
                for source in receipt.get("evidence", []) if isinstance(source, dict)
            ):
                raise ValueError(f"{paper_id}: AI verification receipt has no matching Work-Version evidence")
        records.append(
            _validate_and_transform_record(
                paper_id, decision, paper, analysis_schema, categories, receipt
            )
        )
        if correction:
            records[-1]["ai_correction"] = deepcopy(correction)

    approved_records = records
    records = _aggregate_works(approved_records, papers)
    counts = Counter(record["decision"] for record in records)
    record_counts = Counter(record["decision"] for record in approved_records)
    corpus_works = {paper.get("work_id") or f"record:{paper['id']}" for paper in papers}
    source_works = {paper_by_id[key].get("work_id") or f"record:{key}" for key in decisions}
    approved_works = {record["work_id"] for record in records}
    source_status = str(screening.get("status", "unknown"))
    return {
        "schema": "femprompt-literature-landscape/1.2",
        "source": {
            "screening_file": screening_file,
            "schema": screening.get("schema"),
            "reviewer": screening.get("reviewer"),
            "actor": screening.get("actor"),
            "status": source_status,
            "updated": screening.get("updated"),
            "publication_gate": "attributed-source-review" if publication_policy else PUBLICATION_STATE,
            "allowed_states": sorted(allowed_states),
            "public_label": (publication_policy or {}).get("public_label", "Publikationsfreigegeben"),
            "provisional": withheld_total > 0,
        },
        "meta": {
            "corpus_total": len(papers),
            "corpus_record_total": len(papers),
            "corpus_work_total": len(corpus_works),
            "annotated_total": len(records),
            "published_record_total": len(approved_records),
            "published_work_total": len(records),
            "source_annotated_total": len(decisions),
            "source_annotated_record_total": len(decisions),
            "source_annotated_work_total": len(source_works),
            "withheld_total": withheld_total,
            "withheld_record_total": withheld_total,
            "unpublished_work_total": len(source_works - approved_works),
            "included_total": counts["Include"],
            "excluded_total": counts["Exclude"],
            "unclear_total": counts["Unclear"],
            "thematic_total": counts["Include"],
            "aggregation_unit": "work",
            "record_decision_counts": {decision: record_counts[decision] for decision in sorted(DECISIONS)},
            "work_decision_counts": {decision: counts[decision] for decision in sorted(DECISIONS)},
            "denominators": {
                "corpus_total": "corpus_record_total",
                "annotated_total": "published_work_total",
                "source_annotated_total": "source_annotated_record_total",
                "withheld_total": "withheld_record_total",
                "included_total": "published_work_total",
                "excluded_total": "published_work_total",
                "unclear_total": "published_work_total",
                "thematic_total": "published_work_total",
            },
        },
        "category_groups": {
            "object": object_categories,
            "perspective": perspective_categories,
        },
        "version_type_labels": {
            item["key"]: item["label_de"]
            for item in work_version_contract.get("version_types", [])
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
    parser.add_argument("--analysis-schema", type=Path, default=DEFAULT_ANALYSIS_SCHEMA)
    parser.add_argument("--category-schema", type=Path, default=DEFAULT_CATEGORY_SCHEMA)
    parser.add_argument(
        "--work-version-contract",
        type=Path,
        default=DEFAULT_WORK_VERSION_CONTRACT,
    )
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--policy", type=Path, help="Explicit publication policy; default requires human publication approval")
    parser.add_argument("--verification-ledger", type=Path, help="Attributed source-review ledger, validated against current artifacts")
    return parser


def main() -> int:
    args = _parser().parse_args()
    try:
        policy = _read_json(args.policy.resolve()) if args.policy else None
        receipts = None
        if args.verification_ledger:
            sys.path.insert(0, str(REPO_ROOT))
            from src.assess.artifact_verification import validated_reviews
            receipts = validated_reviews(REPO_ROOT, _read_json(args.verification_ledger.resolve()))
        payload = build(
            args.screening.resolve(),
            args.corpus.resolve(),
            args.analysis_schema.resolve(),
            args.category_schema.resolve(),
            args.work_version_contract.resolve(),
            policy,
            receipts,
        )
        _write_json_atomic(args.output.resolve(), payload)
    except (FileNotFoundError, json.JSONDecodeError, ValueError) as error:
        print(f"FEHLER: {error}", file=sys.stderr)
        return 1
    print(
        "OK: literature landscape contains "
        f"{payload['meta']['published_work_total']} eligible reviewed works "
        f"from {payload['meta']['published_record_total']} records; "
        f"{payload['meta']['withheld_total']} withheld"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
