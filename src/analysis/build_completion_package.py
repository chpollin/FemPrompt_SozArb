"""Build an internal, source-bound completion and verification package.

No source annotation, Zotero identity, approval, or manuscript is changed.
Run after the registry, vault, screening queue, and source readiness builders::

    python -m src.analysis.build_completion_package
    python -m src.analysis.build_completion_package --check
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
import re
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path
from typing import Any

import yaml

from src.assess.artifact_verification import LEDGER_PATH, artifact_hash, load_reviews, latest_screening_review, reviewed_screening_projection
from src.file_hashing import file_sha256
from src.analysis.historical_resolution import load_resolution, RESOLUTION_PATH
from src.analysis.knowledge_coverage import build_knowledge_coverage

REPO = Path(__file__).resolve().parents[2]
OUTPUT = Path("generated/completion")
SEARCH = "corpus/deep-research/round2/Codex Websearch"
READY = "generated/source-acquisition/codex-websearch-2026/source-readiness.json"
FOLLOWUP = "corpus/deep-research/round2/targeted-followup-2026-09-05.json"
MANUSCRIPT = "research-vault/40_output/paper/paper.md"
RESIDUAL = "generated/verification/residual-resolution-2026-09-05.json"
FIELDS = {
    "SQ1": ("AN_Prompt_Techniques", "AN_Mitigation_Status"),
    "SQ2": ("AN_Bias_Axes", "AN_Harm_Types", "AN_Mitigation_Stage", "AN_Mitigation_Status"),
    "SQ3": ("AN_Population",),
}
STATES = ("identified", "curated", "agent-annotated", "ai-agent-reviewed", "verified", "publication-approved")


def _json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def _dump(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n"


def _sha(path: Path) -> str:
    return file_sha256(path)


def _frontmatter(path: Path) -> tuple[dict, str]:
    text = path.read_text(encoding="utf-8")
    parts = text.split("---", 2)
    return (yaml.safe_load(parts[1]) or {}, parts[2]) if text.startswith("---") and len(parts) == 3 else ({}, text)


def _gaps(value: Any, prefix: str = "") -> list[str]:
    """Preserve absent historical provenance; never infer a model or reviewer."""
    result = []
    if isinstance(value, dict):
        if value.get("status") == "legacy_gap":
            result.append(prefix)
        for key, child in value.items():
            result.extend(_gaps(child, f"{prefix}.{key}" if prefix else key))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            result.extend(_gaps(child, f"{prefix}[{index}]"))
    return result


def _codes(value: Any) -> tuple[str, ...]:
    if value is None or value == "":
        return ()
    values = value if isinstance(value, list) else [value]
    return tuple(sorted({str(item).strip() for item in values if str(item).strip()}))


def _human_disposition(row: dict) -> dict:
    """Project multiline CSV notes with LF without changing the source row."""
    notes = row.get("Notes")
    return {"record_id": row["Zotero_Key"], "decision": row.get("Decision"),
            "reason": row.get("Exclusion_Reason"),
            "notes": notes.replace("\r\n", "\n").replace("\r", "\n") if isinstance(notes, str) else notes}


def _csv(rows: list[dict], columns: list[str]) -> str:
    stream = io.StringIO(newline="")
    writer = csv.DictWriter(stream, fieldnames=columns, lineterminator="\n", extrasaction="ignore")
    writer.writeheader()
    for row in rows:
        writer.writerow({key: json.dumps(value, ensure_ascii=False) if isinstance(value, (dict, list)) else value for key, value in row.items() if key in columns})
    return stream.getvalue()


def _historical_recovery_ris(issues: list[dict]) -> str:
    """Prepare confirmed missing publications for import, not for inclusion."""
    lines = []
    for issue in issues:
        resolution = issue.get("identity_resolution") or {}
        metadata = resolution.get("external_identity") or {}
        if issue.get("type") != "unmapped_human_record" or not resolution.get("external_identity_confirmed") or not metadata.get("DOI"):
            continue
        titles = metadata.get("title") or []
        if not titles:
            continue
        lines.extend(["TY  - JOUR" if metadata.get("type") == "journal-article" else "TY  - CONF" if metadata.get("type") == "proceedings-article" else "TY  - GEN", "TI  - " + titles[0]])
        for author in metadata.get("author", []):
            name = ", ".join(part for part in (author.get("family"), author.get("given")) if part)
            if name:
                lines.append("AU  - " + name)
        date = metadata.get("published-online") or metadata.get("published-print") or metadata.get("published") or {}
        parts = date.get("date-parts") or []
        if parts and parts[0]:
            lines.append("PY  - " + str(parts[0][0]))
        lines.extend(["DO  - " + metadata["DOI"], "UR  - https://doi.org/" + metadata["DOI"],
                      f"N1  - Recovered historical record {issue['record_id']}; metadata verified by {resolution['agent_id']}, {resolution['model']}, {resolution['reviewed_at']}. Import candidate only; no new screening or human verification. Historical decisions remain in assessment/human_assessment.csv. Evidence: {RESOLUTION_PATH}.", "ER  -", ""])
    return "\n".join(lines)


def _latest_review_records(repo: Path) -> dict[str, dict]:
    """Retain negative outcomes for operator attention as well as accepted ones."""
    reviews = load_reviews(repo)
    return getattr(reviews, "latest", {})


def _residual_progress(repo: Path, registry: dict, inputs: set[str]) -> dict[str, dict]:
    """Expose attributed acquisition progress without opening a screening gate."""
    if not (repo / RESIDUAL).is_file():
        return {}
    report = _json(repo / RESIDUAL)
    if report.get("schema") != "femprompt-residual-source-resolution/0.1":
        raise ValueError("Unsupported residual resolution schema")
    inputs.add(RESIDUAL)
    scope = report["scope"]
    if artifact_hash(repo, scope["original_queue"]) != scope["original_queue_sha256"]:
        raise ValueError("Stale residual queue evidence")
    inputs.add(scope["original_queue"])
    for key, entry in report["records"].items():
        if entry.get("record_id") != key or registry["record_index"].get(key) != entry["canonical_binding_before"]:
            raise ValueError(f"Stale residual identity binding: {key}")
        if not all(entry.get(field) for field in ("agent_id", "model", "reviewed_at", "finding", "next_step")):
            raise ValueError(f"Unattributed residual resolution: {key}")
        if datetime.fromisoformat(entry["reviewed_at"].replace("Z", "+00:00")).tzinfo is None:
            raise ValueError(f"Residual review needs a timezone: {key}")
        raw = entry["raw_metadata_reference"]
        if artifact_hash(repo, raw) != entry["raw_record_sha256"]:
            raise ValueError(f"Stale residual raw record: {key}")
        inputs.add(raw.partition("#")[0])
        evidence = [*entry.get("evidence", [])]
        for followup in entry.get("follow_up_reviews", []):
            if not all(followup.get(field) for field in ("agent_id", "model", "reviewed_at", "finding", "result")):
                raise ValueError(f"Unattributed residual follow-up: {key}")
            if datetime.fromisoformat(followup["reviewed_at"].replace("Z", "+00:00")).tzinfo is None:
                raise ValueError(f"Residual follow-up needs a timezone: {key}")
            if followup.get("canonical_binding_before") != entry["canonical_binding_before"] or artifact_hash(repo, followup["raw_metadata_reference"]) != followup["raw_record_sha256"]:
                raise ValueError(f"Stale residual follow-up identity: {key}")
            evidence.extend(followup.get("evidence", []))
        if entry.get("original_text"):
            evidence.append(entry["original_text"])
        for source in evidence:
            if artifact_hash(repo, source["source_path"]) != source["sha256"]:
                raise ValueError(f"Stale residual source: {key}")
            inputs.add(source["source_path"].partition("#")[0])
    return report["records"]


def _agent_records(repo: Path, inputs: set[str], reviews: dict | None = None, latest_reviews: dict | None = None) -> tuple[dict[str, list[dict]], list[dict]]:
    reviews = reviews if reviews is not None else {}
    # Retain negative-only ValidatedReviews and accept the older split-input API.
    # Choose each artifact's newest receipt before resolving its whole family.
    outcomes = {}
    for source in (reviews, getattr(reviews, "latest", {}), latest_reviews if latest_reviews is not None else {}):
        for artifact, receipt in source.items():
            prior = outcomes.get(artifact)
            at = datetime.fromisoformat(receipt["reviewed_at"].replace("Z", "+00:00"))
            prior_at = datetime.fromisoformat(prior["reviewed_at"].replace("Z", "+00:00")) if prior else None
            if at == prior_at and receipt != prior:
                raise ValueError(f"Conflicting reviews at the same time: {artifact}")
            if prior is None or at > prior_at:
                outcomes[artifact] = receipt
    records: dict[str, list[dict]] = defaultdict(list)
    issues = []
    for path in sorted((repo / "docs/data/screening").glob("*.json")):
        relative = path.relative_to(repo).as_posix()
        data = _json(path)
        if not str(data.get("schema", "")).startswith("femprompt-prisma-reviewer/"):
            continue
        inputs.add(relative)
        for record_id, record in sorted(data.get("decisions", {}).items()):
            pointer = record_id.replace("~", "~0").replace("/", "~1")
            artifact = f"{relative}#/decisions/{pointer}"
            projected, receipt, correction = reviewed_screening_projection(repo, artifact, record, outcomes)
            current_review = latest_screening_review(repo, artifact, outcomes)
            if receipt:
                inputs.add(receipt["artifact"].partition("#")[0])
            annotation = next((a for a in record.get("annotations", []) if a.get("annotation_id") == record.get("active_annotation_id")), None)
            body = annotation.get("body", {}) if annotation else record
            lifecycle = record.get("lifecycle", {})
            provenance = record.get("provenance", {})
            records[record_id].append({
                "record_id": record_id,
                "path": relative,
                "annotation_id": record.get("active_annotation_id"),
                "decision": body.get("decision"),
                "analysis": projected.get("analysis", {}).get("fields", {}) if correction else body.get("analysis", {}).get("fields", {}),
                "original_analysis": body.get("analysis", {}).get("fields", {}),
                "current_ai_source_review": _review_summary(current_review),
                "current_ai_review_result": current_review["result"] if current_review else "not_recorded",
                "latest_original_ai_source_review": _review_summary(outcomes.get(artifact)),
                "applied_ai_correction": correction,
                "undecidable": body.get("analysis", {}).get("undecidable", {}),
                "evidence_categories": sorted(body.get("evidence", {})),
                "state": lifecycle.get("state", "unrecorded"),
                "events": lifecycle.get("events", []),
                "actors": provenance.get("actors", []),
                "activities": provenance.get("activities", []),
                "used_sources": provenance.get("used_sources", []),
                "legacy_provenance_gaps": _gaps(provenance),
                "alias_of": record.get("alias_of"),
            })
            if not annotation:
                issues.append({"type": "missing_active_annotation", "record_id": record_id, "path": relative})
    return records, issues


def _review_summary(receipt: dict | None) -> dict | None:
    if receipt is None:
        return None
    return {key: receipt[key] for key in ("artifact", "sha256", "agent_id", "model", "reviewed_at", "result", "findings", "model_id_status") if key in receipt}


def _assertions(repo: Path, inputs: set[str], reviews: dict | None = None) -> list[dict]:
    reviews = reviews or {}
    result = []
    for path in sorted((repo / "research-vault/30_assertions").glob("*.md")):
        metadata, body = _frontmatter(path)
        inputs.add(path.relative_to(repo).as_posix())
        if metadata.get("type") != "assertion":
            continue
        sources = []
        for link in metadata.get("grounding", []):
            target = str(link).strip("[]").split("|", 1)[0]
            file, _, anchor = target.partition("#")
            relative = f"research-vault/{file}.md"
            source_path = repo / relative
            if not source_path.resolve().is_relative_to((repo / "research-vault").resolve()):
                raise ValueError(f"Assertion grounding escapes research-vault: {link}")
            source_metadata, source_body = _frontmatter(source_path) if source_path.exists() else ({}, "")
            if source_path.exists():
                inputs.add(relative)
            sources.append({
                "link": link, "path": relative, "anchor": anchor,
                "exists": source_path.exists(), "anchor_present": bool(anchor and anchor in source_body),
                "work_id": source_metadata.get("work-id"),
                "version_id": source_metadata.get("version-id"),
                "record_id": source_metadata.get("record-id"),
                "distillate_state": source_metadata.get("status", "unrecorded"),
                "current_ai_source_review": _review_summary(reviews.get(relative)),
            })
        statement = re.search(r"## Statement\s*\n(.*?)(?=\n## |\Z)", body, re.S)
        result.append({
            "path": path.relative_to(repo).as_posix(),
            "title": next((line[2:] for line in body.splitlines() if line.startswith("# ")), path.stem),
            "statement": statement.group(1).strip() if statement else "",
            "state": metadata.get("status", "unrecorded"),
            "current_ai_source_review": _review_summary(reviews.get(path.relative_to(repo).as_posix())),
            "checked": {k: str(v) for k, v in metadata.get("checked", {}).items()},
            "sources": sources,
            "work_ids": sorted({source["work_id"] for source in sources if source["work_id"]}),
            "structural_grounding_complete": bool(sources) and all(s["exists"] and s["anchor_present"] and s["work_id"] and s["version_id"] for s in sources),
            "authority_note": "Recorded AI-review state is distinct from human verification; structural grounding does not verify meaning.",
        })
    return result


def _work_rows(registry: dict, human: list[dict], agents: dict, queue: dict, resolution: dict | None = None) -> tuple[list[dict], list[dict]]:
    resolution = resolution or {}
    index = registry["record_index"]
    works = {work["work_id"]: work for work in registry["works"]}
    human_by_record: dict[str, list[dict]] = defaultdict(list)
    for row in human:
        human_by_record[row["Zotero_Key"]].append(row)
    record_groups: dict[str, list[str]] = defaultdict(list)
    for record_id, binding in index.items():
        record_groups[binding["work_id"]].append(record_id)
    queue_by_work = {row["work_id"]: row for row in queue.get("queue", [])}
    historical_bindings = {key: entry for key, entry in resolution.get("identity_resolutions", {}).items() if entry.get("outcome") == "resolved"}
    unmapped = [{"type": "unmapped_human_record", "record_id": key, "historical_rows": human_by_record[key], "identity_resolution": resolution.get("identity_resolutions", {}).get(key)} for key in sorted(human_by_record) if key not in index and key not in historical_bindings]
    unmapped += [{"type": "unmapped_agent_record", "record_id": key} for key in sorted(agents) if key not in index]
    result = []
    for work_id, record_ids in sorted(record_groups.items()):
        work = works[work_id]
        bound_legacy = {key: entry for key, entry in historical_bindings.items() if entry["target_work_id"] == work_id}
        human_rows = [row for record_id in [*record_ids, *bound_legacy] for row in human_by_record[record_id]]
        work_resolution = resolution.get("work_resolutions", {}).get(work_id, {})
        agent_rows = [row for record_id in record_ids for row in agents.get(record_id, [])]
        human_decisions = sorted({row.get("Decision", "") for row in human_rows if row.get("Decision")})
        # Exclude/Duplicate is a record disposition, not a negative judgement of
        # the underlying work. Preserve it for audit, but do not invent a work
        # disagreement when another alias is explicitly included.
        duplicates = [row for row in human_rows if row.get("Decision") == "Exclude" and row.get("Exclusion_Reason", "").strip().casefold() == "duplicate"]
        metadata_ids = {item["record_id"] for item in work_resolution.get("administrative_record_dispositions", [])}
        substantive_human = [row for row in human_rows if row not in duplicates and row["Zotero_Key"] not in metadata_ids]
        human_work_decisions = sorted({row.get("Decision", "") for row in substantive_human if row.get("Decision")})
        agent_decisions = sorted({row["decision"] for row in agent_rows if row["decision"]})
        open_reviews = sorted({row["record_id"] for row in agent_rows if row.get("current_ai_review_result") in {"changes_requested", "unverifiable"}})
        conflicts = []
        if len(human_work_decisions) > 1:
            conflicts.append("conflicting_human_decisions")
        if len(agent_decisions) > 1:
            conflicts.append("conflicting_agent_decisions")
        if human_work_decisions and agent_decisions and human_work_decisions != agent_decisions:
            if not (work_resolution.get("outcome") == "resolved" and work_resolution.get("resolution_kind", "").startswith("documented_round_specific")):
                conflicts.append("human_agent_decision_divergence")
        integrity_hold = bool(work_resolution.get("integrity_hold"))
        source_hold = bool(work_resolution.get("withhold_from_current_synthesis"))
        if integrity_hold:
            conflicts.append("source_integrity_hold")
        elif source_hold:
            conflicts.append("source_version_hold")
        if open_reviews:
            conflicts.append("open_source_review")
        effective = human_work_decisions[0] if len(human_work_decisions) == 1 else agent_decisions[0] if not human_work_decisions and len(agent_decisions) == 1 else None
        if work_resolution.get("outcome") == "resolved" and work_resolution.get("round1_effective_decision") != effective:
            raise ValueError(f"Historical resolution differs from the retained human decision: {work_id}")
        eligible_agent_rows = [row for row in agent_rows if row["decision"] == "Include" and row["state"] in STATES[3:]]
        field_values, field_conflicts, field_undecidable = {}, {}, {}
        for name in sorted({name for names in FIELDS.values() for name in names} | {"AN_Coding_Basis", "AN_Prompting_Role", "Studientyp"}):
            sets = {_codes(row["analysis"].get(name)) for row in eligible_agent_rows}
            sets.discard(())
            if len(sets) == 1:
                field_values[name] = list(next(iter(sets)))
            elif len(sets) > 1:
                field_conflicts[name] = [list(value) for value in sorted(sets)]
            undecidable = [row["undecidable"][name] for row in eligible_agent_rows if name in row["undecidable"]]
            if undecidable:
                field_undecidable[name] = undecidable
        if field_conflicts:
            conflicts.append("conflicting_agent_analysis_fields")
        actions = []
        if conflicts:
            actions.append("reconcile_recorded_divergences_without_overwriting_human_track")
        if work_id in queue_by_work:
            actions.append("execute_governed_source_screening" if queue_by_work[work_id].get("queue_status") == "ready" else "resolve_source_blockers_then_governed_screening")
        if human_rows:
            actions.append("retain_legacy_human_decision_and_document_historical_provenance_limits")
        if agent_rows:
            actions.append("retain_ai_review_tier_and_record_any_further_review_at_artifact_level")
        if open_reviews:
            actions.append("resolve_negative_source_review_before_using_affected_AI_coding")
        if effective == "Include" and not field_values:
            actions.append("complete_source_bound_SQ1_SQ2_SQ3_coding")
        if work_resolution:
            actions.extend(work_resolution.get("required_next_steps", []))
        if source_hold:
            actions.append("withhold_from_current_synthesis")
        result.append({
            "work_id": work_id, "title": work["canonical_title"], "record_ids": sorted(record_ids),
            "version_ids": sorted({index[key]["version_id"] for key in record_ids}),
            "preferred_version_id": work.get("preferred_version_id"),
            "human_record_ids": sorted({row["Zotero_Key"] for row in human_rows}),
            "human_decisions": human_decisions, "agent_decisions": agent_decisions,
            "human_substantive_decisions": human_work_decisions,
            "human_duplicate_record_ids": sorted(row["Zotero_Key"] for row in duplicates),
            "human_metadata_error_record_ids": sorted(metadata_ids),
            "historical_identity_bindings": bound_legacy,
            "historical_resolution": work_resolution or None,
            "integrity_hold": integrity_hold,
            "human_record_dispositions": [_human_disposition(row) for row in human_rows],
            "effective_decision": effective,
            "decision_authority": "legacy_human" if human_work_decisions else "ai_review" if agent_decisions else "unassessed",
            "human_verification": "legacy_human_annotation_not_new_lifecycle_verification" if human_rows else "not_recorded",
            "agent_records": agent_rows,
            "legacy_human_provenance_note": "Consolidated historical expert CSV; no new named reviewer, review date, or lifecycle event inferred." if human_rows else None,
            "agent_lifecycle_states": sorted({row["state"] for row in agent_rows}),
            "current_ai_review_results": sorted({row.get("current_ai_review_result", "not_recorded") for row in agent_rows}),
            "open_ai_source_review_record_ids": open_reviews,
            "corrected_ai_record_ids": sorted({row["record_id"] for row in agent_rows if row.get("applied_ai_correction")}),
            "ai_correction_provenance": [{
                "record_id": row["record_id"],
                "artifact": row["current_ai_source_review"]["artifact"],
                "sha256": row["current_ai_source_review"]["sha256"],
                "base_artifact": row["applied_ai_correction"]["base_artifact"],
                "base_sha256": row["applied_ai_correction"]["base_sha256"],
                "agent_id": row["current_ai_source_review"]["agent_id"],
                "model": row["current_ai_source_review"]["model"],
                "reviewed_at": row["current_ai_source_review"]["reviewed_at"],
                "corrected_at": row["applied_ai_correction"]["corrected_at"],
            } for row in agent_rows if row.get("applied_ai_correction")],
            "analysis_track": "recorded_ai_review",
            "analysis_eligible": effective == "Include" and bool(eligible_agent_rows) and not open_reviews and not source_hold and not any(c.endswith("decisions") or c == "human_agent_decision_divergence" for c in conflicts),
            "analysis_fields": field_values, "analysis_conflicts": field_conflicts, "analysis_undecidable": field_undecidable,
            "conflicts": conflicts,
            "source_queue_status": queue_by_work.get(work_id, {}).get("queue_status"),
            "source_blockers": queue_by_work.get(work_id, {}).get("blockers", []),
            "next_actions": actions,
        })
    return result, unmapped


def _attach_source_progress(work: dict, residual: dict, registry: dict) -> None:
    """Keep dated acquisition findings while deriving outstanding work now."""
    progress = [residual[key] for key in work["record_ids"] if key in residual]
    bindings = registry.get("source_index", {})
    work["source_acquisition_progress"] = progress
    work["current_source_binding_record_ids"] = sorted(key for key in work["record_ids"] if key in bindings)
    work["newly_acquired_text_requires_binding"] = any(entry.get("original_text") and entry["record_id"] not in bindings for entry in progress)
    work["next_actions"].extend(entry["next_step"] for entry in progress if entry["record_id"] not in bindings)
    work["next_actions"].extend(review["recommended_disposition"] for entry in progress for review in entry.get("follow_up_reviews", []) if review.get("recommended_disposition"))


def _analysis(rows: list[dict], schema: dict) -> list[dict]:
    included = [row for row in rows if row["effective_decision"] == "Include"]
    eligible = [row for row in included if row["analysis_eligible"]]
    output = []
    definitions = {field["name"]: field for field in schema["analysis_fields"]}
    for question, names in FIELDS.items():
        for name in names:
            definition = definitions[name]
            # YAML 1.1 can interpret a code such as None as a string; stringify explicitly.
            allowed = [str(code) for code in definition.get("values", [])]
            available = [row for row in eligible if row["analysis_fields"].get(name) and name not in row["analysis_undecidable"] and all(value in allowed for value in row["analysis_fields"][name])]
            for value in allowed:
                matching = [row for row in available if value in row["analysis_fields"][name]]
                output.append({
                    "question": question, "field": name, "value": value,
                    "work_count": len(matching), "work_ids": [row["work_id"] for row in matching],
                    "denominator_field_coded_works": len(available),
                    "denominator_ai_analysis_eligible_works": len(eligible),
                    "denominator_recorded_include_works": len(included),
                    "missing_or_unresolved_included_works": len(included) - len(available),
                    "authority": "provisional_recorded_ai_review",
                    "counting_rule": "Each work counted at most once per value; multi-code field totals may exceed denominator.",
                })
    return output


def _candidate_rows(repo: Path, package: dict, readiness: dict, registry: dict, inputs: set[str]) -> list[dict]:
    ready = {row["candidate_id"]: row for row in readiness.get("records", [])}
    result = []
    for candidate in sorted(package.get("records", []), key=lambda row: row["candidate_id"]):
        preparation = ready.get(candidate["candidate_id"], {})
        keys = candidate.get("matched_zotero_keys", [])
        bindings = [dict(record_id=key, **registry["record_index"][key]) for key in keys if key in registry["record_index"]]
        markdown = preparation.get("screening_markdown_file")
        exists = bool(markdown and (repo / markdown).is_file())
        expected = preparation.get("screening_markdown_sha256")
        if exists:
            if not (repo / markdown).resolve().is_relative_to(repo.resolve()):
                raise ValueError(f"Source path escapes repository: {markdown}")
            inputs.add(markdown)
        # Acquisition hashes retain their original byte-exact contract. Only
        # this builder's new input fingerprints use canonical LF text bytes.
        hash_matches = bool(exists and expected and hashlib.sha256((repo / markdown).read_bytes()).hexdigest() == expected)
        conflicts = []
        if len({binding["work_id"] for binding in bindings}) > 1:
            conflicts.append("multiple_canonical_works_for_candidate")
        if len(bindings) != len(keys):
            conflicts.append("matched_zotero_key_missing_from_registry")
        if markdown and not exists:
            conflicts.append("prepared_markdown_missing_locally")
        elif exists and not hash_matches:
            conflicts.append("prepared_markdown_hash_unbound_or_mismatch")
        local_version = preparation.get("local_source_version") or {}
        alternative = local_version.get("relation_to_preferred") == "alternative_recorded_version"
        if alternative:
            conflicts.append("source_uses_alternative_publication_version")
        pending = candidate.get("source_enrichment", {}).get("pending_zotero_corrections", [])
        if pending:
            conflicts.append("pending_zotero_metadata_corrections")
        actions = []
        if not bindings:
            actions.append("import_or_match_in_Zotero_then_export_and_rebuild_registry")
        if not preparation.get("screening_source_ready") or not hash_matches:
            actions.append("acquire_or_complete_source_preparation")
        if alternative:
            actions.append("curate_exact_source_version_and_document_preferred_version_exception")
        if pending:
            actions.append("apply_evidenced_metadata_corrections_in_Zotero")
        actions.append("perform_governed_screening_and_record_AI_review_provenance")
        result.append({
            "candidate_id": candidate["candidate_id"], "title": candidate["title"],
            "doi": candidate.get("doi"), "selected_version_date": candidate.get("selected_version_date"),
            "source_lanes": candidate.get("source_lanes", []),
            "zotero_status": candidate.get("zotero_status"), "canonical_bindings": bindings,
            "source_readiness": preparation.get("source_readiness", "not_recorded"),
            "recorded_source_ready": bool(preparation.get("screening_source_ready")),
            "source_hash_matches": hash_matches, "screening_markdown_file": markdown,
            "screening_markdown_sha256": expected, "local_source_version": local_version,
            "preferred_version": candidate.get("preferred_version"),
            "screening_status": candidate.get("screening_status", "identified_not_screened"),
            "pending_zotero_corrections": pending, "conflicts_or_constraints": conflicts,
            "next_actions": actions,
            "scope": "included_in_completion_target_pending_curation_and_screening",
        })
    return result


def _followup_rows(followup: dict, registry: dict) -> list[dict]:
    """Project identified gap-fill candidates without inventing screening or IDs."""
    if followup.get("schema") != "femprompt-targeted-followup/0.1" or not isinstance(followup.get("candidates"), list):
        raise ValueError("Unsupported targeted follow-up input")
    rows = []
    for index, candidate in enumerate(followup["candidates"]):
        key = candidate.get("zotero_key")
        binding = registry["record_index"].get(key)
        rows.append({
            **candidate,
            "source_artifact": f"{FOLLOWUP}#/candidates/{index}",
            "canonical_bindings": [dict(record_id=key, **binding)] if binding else [],
            "scope": "targeted_gap_fill_pending_curation_and_screening",
            "identification_provenance": {key: followup.get(key) for key in ("agent_id", "model", "model_id_status", "generated_at", "authority")},
            "authority_note": "Source access and topical selection are recorded identification evidence, not screening, source-review approval or human verification.",
        })
    return sorted(rows, key=lambda row: row["candidate_id"])


def build_package(repo: Path = REPO) -> dict:
    inputs = {"corpus/work_version_registry.json", "assessment/human_assessment.csv", "assessment/categories.yaml", "generated/agent-screening-queue.json", f"{SEARCH}/codex-websearch-2026-package.json", READY, FOLLOWUP, MANUSCRIPT, "knowledge/project.md", "src/analysis/build_completion_package.py", "src/file_hashing.py", "generated/conformance/conformance_map.yaml"}
    reviews = load_reviews(repo)
    if (repo / LEDGER_PATH).is_file():
        inputs.add(LEDGER_PATH)
        inputs.add("src/assess/artifact_verification.py")
        for receipt in reviews.values():
            inputs.update(source["source_path"].partition("#")[0] for source in receipt["evidence"])
    registry = _json(repo / "corpus/work_version_registry.json")
    with (repo / "assessment/human_assessment.csv").open(encoding="utf-8-sig", newline="") as handle:
        human = list(csv.DictReader(handle))
    queue = _json(repo / "generated/agent-screening-queue.json")
    package = _json(repo / SEARCH / "codex-websearch-2026-package.json")
    readiness = _json(repo / READY)
    followup = _json(repo / FOLLOWUP)
    schema = yaml.safe_load((repo / "assessment/categories.yaml").read_text(encoding="utf-8"))
    agents, issues = _agent_records(repo, inputs, reviews, getattr(reviews, "latest", {}))
    resolution = load_resolution(repo, registry, human, inputs)
    if resolution:
        inputs.add("src/analysis/historical_resolution.py")
    works, unmapped = _work_rows(registry, human, agents, queue, resolution)
    residual = _residual_progress(repo, registry, inputs)
    for work in works:
        _attach_source_progress(work, residual, registry)
    issues.extend(unmapped)
    candidates = _candidate_rows(repo, package, readiness, registry, inputs)
    followup_candidates = _followup_rows(followup, registry)
    assertions = _assertions(repo, inputs, reviews)
    knowledge_coverage = build_knowledge_coverage(repo, registry, inputs)
    source_records = [{"path": path, "sha256": _sha(repo / path)} for path in sorted(inputs)]
    fingerprint = "sha256:" + hashlib.sha256(_dump(source_records).encode("utf-8")).hexdigest()
    registry_extra = [work for work in registry["works"] if work["work_id"] not in {row["work_id"] for row in works}]
    return {
        "schema": "femprompt-completion-package/1.0",
        "status": "provisional_internal_preparation",
        "source_fingerprint": fingerprint, "sources": source_records,
        "scope": {"existing_corpus": True, "already_identified_2026_candidates": True, "targeted_gap_fill_candidates": True, "cutoff_date_2026_package": package.get("cutoff_date"), "targeted_followup_search_date": followup.get("search_date"), "new_literature_search": "only_excellent_gap_fill_if_separately_justified", "target_membership_is_not_screening_inclusion": True},
        "authority": "Recorded human annotations, AI review, human verification, and publication policy remain separate. This builder neither verifies scientific meaning nor grants approval.",
        "counts": {
            "canonical_records": len(registry["record_index"]), "canonical_record_bound_works": len(works),
            "registry_all_works": len(registry["works"]), "registry_works_without_canonical_record": len(registry_extra),
            "human_annotated_works": sum(bool(row["human_record_ids"]) for row in works),
            "ai_review_recorded_works": sum(bool(row["agent_records"]) for row in works),
            "works_with_conflicts": sum(bool(row["conflicts"]) for row in works),
            "works_with_open_ai_source_review": sum(bool(row["open_ai_source_review_record_ids"]) for row in works),
            "records_with_accepted_ai_correction": sum(len(row["corrected_ai_record_ids"]) for row in works),
            "unmapped_historical_human_records": sum(row["type"] == "unmapped_human_record" for row in issues),
            "reconciled_historical_human_records": sum(len(row["historical_identity_bindings"]) for row in works),
            "works_with_integrity_hold": sum(row["integrity_hold"] for row in works),
            "queued_source_works": len(queue.get("queue", [])),
            "source_queue_works_with_newly_acquired_unbound_text": sum(bool(work["source_queue_status"]) and work["newly_acquired_text_requires_binding"] for work in works),
            "canonical_decisions": dict(sorted(Counter(row["effective_decision"] or "unresolved" for row in works).items())),
            "candidates_2026": len(candidates), "candidates_2026_with_canonical_binding": sum(bool(row["canonical_bindings"]) for row in candidates),
            "candidates_2026_recorded_source_ready": sum(row["recorded_source_ready"] for row in candidates),
            "candidates_2026_current_ready_source": sum(row["recorded_source_ready"] and row["source_hash_matches"] for row in candidates),
            "targeted_followup_candidates": len(followup_candidates),
            "targeted_followup_with_canonical_binding": sum(bool(row["canonical_bindings"]) for row in followup_candidates),
            "targeted_followup_recorded_fulltext_read": sum(row.get("source_access", {}).get("basis") == "fulltext_read" for row in followup_candidates),
            "active_assertions": len(assertions),
            "active_assertions_with_current_ai_source_review": sum(bool(row["current_ai_source_review"]) for row in assertions),
            "assertion_states": dict(sorted(Counter(row["state"] for row in assertions).items())),
        },
        "works": works, "candidates_2026": candidates,
        "historical_resolution_source": RESOLUTION_PATH if resolution else None,
        "residual_resolution_source": RESIDUAL if residual else None,
        "targeted_followup": {"source": FOLLOWUP, **{key: followup.get(key) for key in ("search_date", "search_cutoff", "changes_main_search_cutoff", "search_type", "authority", "agent_id", "model", "model_id_status", "generated_at", "deduplication")}},
        "targeted_followup_candidates": followup_candidates,
        "registry_candidates_without_canonical_record": [{"work_id": work["work_id"], "title": work["canonical_title"], "flags": work.get("flags", []), "review_status": work.get("review_status", {}), "legacy_work_ids": work.get("legacy_work_ids", [])} for work in registry_extra],
        "analysis_tables": _analysis(works, schema), "analysis_field_definitions": schema["analysis_fields"],
        "assertions": assertions, "issues": issues,
        "knowledge_coverage": knowledge_coverage,
        "interpretation_limits": [
            "Canonical counts use unique work_id; registry-only and unbound 2026 candidates are not silently pooled.",
            "Stable Work IDs do not establish complete bibliographic deduplication. Shared knowledge documents and deferred identifier enrichments identify remaining reconciliation tasks; do not interpret current Work totals as a final count of distinct publications.",
            "Targeted gap-fill candidates form a separate identified, unbound and unscreened intake; neither the canonical nor the 2026-package denominator includes them.",
            "Human decisions retain priority; divergences and conflicting field values require explicit reconciliation.",
            "SQ tables describe recorded AI-review coding, not a completed full-corpus synthesis or human-verified result.",
            "Missing coding is separate from the explicit None code; multi-code totals are not percentages of all literature.",
            "Proposed, Demonstrated and Evaluated describe recorded study evidence status, not effectiveness or study quality.",
            "Source identity, source transcription, scientific interpretation and methodological quality are distinct checks.",
        ],
    }


def render_outputs(package: dict) -> dict[str, str]:
    counts = package["counts"]
    coverage = package["knowledge_coverage"]
    knowledge = coverage["counts"]
    graph = coverage["graph"]
    fingerprint = package["source_fingerprint"]
    preamble = f"Source fingerprint: `{fingerprint}`. Deterministic internal preparation; no approval is created.\n"
    readme = "# Completion package\n\n" + preamble + f"""
Scope: existing corpus plus all already identified 2026 candidates (search cutoff {package['scope']['cutoff_date_2026_package']}) and the separate targeted gap-fill intake from {package['scope']['targeted_followup_search_date']}. Candidate membership does not imply inclusion. New search should address a concrete evidence gap with excellent sources.

| Coverage | Count |
|---|---:|
| Canonical bibliographic records | {counts['canonical_records']} |
| Canonical record-bound works | {counts['canonical_record_bound_works']} |
| All registry works, including pending candidates | {counts['registry_all_works']} |
| Works with recorded human annotations | {counts['human_annotated_works']} |
| Works with recorded AI-review records | {counts['ai_review_recorded_works']} |
| Works with decision or coding conflicts | {counts['works_with_conflicts']} |
| Works with an unresolved negative AI source review | {counts['works_with_open_ai_source_review']} |
| Records using an accepted immutable AI correction | {counts['records_with_accepted_ai_correction']} |
| Historical human records missing canonical identity binding | {counts['unmapped_historical_human_records']} |
| Historical human records reconciled to existing Works | {counts['reconciled_historical_human_records']} |
| Works under a confirmed integrity hold | {counts['works_with_integrity_hold']} |
| Source acquisition/screening queue | {counts['queued_source_works']} |
| Queued Works with newly acquired text still requiring exact binding and source QC | {counts['source_queue_works_with_newly_acquired_unbound_text']} |
| 2026 candidates | {counts['candidates_2026']} |
| 2026 candidates with canonical binding | {counts['candidates_2026_with_canonical_binding']} |
| 2026 candidates with recorded, locally hash-matching ready text | {counts['candidates_2026_current_ready_source']} |
| Separate targeted gap-fill candidates | {counts['targeted_followup_candidates']} |
| Targeted gap-fill candidates with canonical binding | {counts['targeted_followup_with_canonical_binding']} |
| Targeted gap-fill candidates with recorded fulltext reading | {counts['targeted_followup_recorded_fulltext_read']} |
| Active assertions | {counts['active_assertions']} |
| Assertions with current source-hash-bound AI review | {counts['active_assertions_with_current_ai_source_review']} |

## Knowledge coverage

| Availability measure (not verification) | Count |
|---|---:|
| Canonical records linked to an existing Knowledge Document | {knowledge['linked_records']} / {knowledge['canonical_records']} |
| Distinct linked Knowledge Documents | {knowledge['distinct_linked_documents']} |
| Work IDs with a linked Knowledge Document | {knowledge['linked_works']} / {knowledge['record_bound_works']} |
| Work IDs without a linked Knowledge Document | {knowledge['works_without_linked_document']} |
| Broken document links | {knowledge['broken_link_records']} |
| Documents shared across multiple Work IDs (identity-review candidates) | {knowledge['shared_documents_across_works']} |
| Canonical records mapped in the exploratory concept graph | {graph['canonical_mapped_records']} |
| Graph keys without canonical record binding | {len(graph['unbound_record_keys'])} |

`completion-package.json` → `knowledge_coverage` contains the exact missing-record/Work lists, shared-document identity candidates, unbound graph keys, isolated nodes, and the active versus legacy document inventory. Document availability does not establish scholarly verification or analysis eligibility. Graph edges represent concept co-occurrence, not supported scientific assertions. Stable Work IDs still require duplicate reconciliation; current totals are not a final count of distinct publications. The active Assertion slice above is the source-reviewed synthesis layer, while the larger linked archive remains a working input.

Use `work-verification-queue.csv` to resolve discrepancies and missing coding per work. The complete JSON preserves each active annotation, recorded actors, models, event dates, and historical provenance gaps. Human annotations remain authoritative in their track; AI review is labelled separately and can be used according to the configured publication policy. No new human verification is inferred from old CSV rows.

Accepted corrections are applied only as source-hash-bound projections. The JSON retains the original analysis, original review outcome, correction base artifact/hash, exact field differences and correcting agent/model/time. The work queue links each correction and its immutable basis with agent, model and dates. A negative original review is resolved for the projected coding only by an accepted review of its exact correction. Rejection and correction acceptance may share a timestamp only for the same agent/model and the exact original-hash-bound correction; other simultaneous conflicts fail closed. Further review of corrected coding must target its correction artifact; review authority belongs to the exact artifact. Unresolved negative reviews remain open and their work is excluded from interim AI analysis counts.

An explicit historical `Exclude` / `Duplicate` disposition applies to the bibliographic record, not the work, and does not contradict an included alias. Attributed source-grounded historical resolutions can additionally identify an author-error exclusion as an administrative metadata disposition; exact original row hashes and target Work bindings are checked before applying it. The original decision remains visible. Substantive human conflicts stay unresolved. Documented round-specific differences keep their separate human and AI decisions. Source/version and withdrawal holds prevent current synthesis regardless of the historical Include decision.

`unmapped-historical-records.csv` retains legacy decisions that cannot currently be placed in the registry. `historical-recovery.ris` prepares independently confirmed missing publications for Zotero import; it does not create Zotero IDs, new inclusion decisions or verification events. The evidence and unresolved empty record are recorded in `generated/verification/historical-resolution-2026-09-05.json`.

Use `candidate-2026-readiness.csv` for import, exact Work-Version binding, source exceptions and remaining preparation. Existing Zotero and manuscript files are not changed. Registry-only candidates are retained separately in `registry-candidate-queue.csv`; overlap with the 2026 package must be curated, so these counts cannot be added.

Use [targeted-followup-queue.csv](targeted-followup-queue.csv) or [targeted-followup-queue.json](targeted-followup-queue.json) for the {counts['targeted_followup_candidates']} targeted gap-fill candidates, their stated evidence gaps, source-access limits and next steps. They are identified, unbound and unscreened; recorded fulltext reading does not grant review or release authority. These candidates belong to the completion scope but are counted separately from canonical works and the original 2026 search. The later targeted search date does not change that search's cutoff.

Use `sq-analysis-tables.csv` for provisional descriptive counts and `synthesis-outline.md` for the source-bound writing plan. Uncoded works and conflicts remain visible in each denominator. Complete source reading and explicit AI-review provenance are required for new scientific assertions; deterministic checks alone do not constitute review. Study quality must be appraised separately before deriving practice recommendations.

Regenerate with `python -m src.analysis.build_completion_package`; verify freshness with `python -m src.analysis.build_completion_package --check`. Generated tables and prose share the JSON fingerprint. `--check` fails if any managed output is absent or differs, including after source deletion or a changed annotation.

This directory is an internal operator package and is not a website release input. Publication selection is handled by the dedicated policy and publisher, not by these provisional tables.
"""
    dictionary = "# Data dictionary\n\n" + preamble + """
| Field / artifact | Meaning |
|---|---|
| work_id | Canonical scholarly contribution; one counting unit even with multiple records or versions. |
| record_ids | Zotero bibliographic aliases linked through registry record_index. |
| version_ids / preferred_version_id | Exact linked expressions and preferred expression; an alternative source needs a recorded exception. |
| decision_authority | legacy_human, ai_review or unassessed; distinct tracks are never silently promoted. |
| effective_decision | One consistent substantive human decision if recorded, otherwise one consistent AI decision; null on unresolved within-track conflict or absence. Explicit Exclude/Duplicate is a record disposition, not a substantive work exclusion. |
| human_substantive_decisions / human_duplicate_record_ids | Work judgements and administrative duplicate records are distinct; all original dispositions and reasons remain in human_record_dispositions. Multiline note line endings use LF in this projection; original CSV rows remain unchanged. |
| historical_identity_bindings / human_metadata_error_record_ids | Attributed exact-row reconciliations link otherwise unbound historical decisions or separate documented metadata-error dispositions; they do not modify the Zotero library or historical CSV. |
| historical_resolution / integrity_hold | Source-grounded conflict explanation, separate round-specific recommendation and any current source/withdrawal hold. A hold does not rewrite the historical decision and prevents current synthesis. |
| human_verification | Historical CSV evidence or missing evidence; never a fabricated current lifecycle event. |
| agent_records | Active annotation, lifecycle events, actor/model provenance, source references and legacy gaps as recorded. |
| current_ai_source_review | Current accepted source-hash-bound review with actual agent, disclosed model, time and substantive findings; historical provenance remains separate. |
| applied_ai_correction / original_analysis | Immutable correction projection and original coding side by side; correction base artifact/hash and each field change remain auditable. |
| ai_correction_provenance | Work-queue references to each correction, its immutable basis, hashes and correcting/reviewing agent, model and dates. |
| open_ai_source_review_record_ids | Negative or unverifiable source reviews with no accepted correction; affected work coding is not counted in interim SQ tables. |
| analysis_eligible | Include with AI-reviewed analysis, no within-track decision conflict, no human/AI decision divergence and no unresolved negative source review. |
| analysis_fields | Consistent coded values across Include annotations of the work; absent values remain missing. |
| analysis_conflicts / analysis_undecidable | Conflicting or explicitly undecidable coding; excluded from that field's denominator. |
| source_blockers / next_actions | Preparation actions for the operator, not automatic exclusion reasons. |
| source_acquisition_progress | Attributed metadata corrections and original-text acquisitions, checked against raw record and evidence hashes. An acquired text alone does not establish screening readiness or scholarly verification. |
| current_source_binding_record_ids / newly_acquired_text_requires_binding | Current registry bindings and remaining binding work, derived separately from dated acquisition findings. A resolved binding no longer creates a stale acquisition action; screening remains its own queue step. |
| knowledge_coverage | Deterministic availability inventory with missing documents, identity-review candidates and concept-graph binding gaps. Active maturity labels are recorded literally and do not substitute for current review receipts. |
| candidate_id / canonical_bindings | Search-package identity and explicit current Zotero/registry mapping; title similarity never binds identities. |
| targeted_followup_candidates | Separate gap-fill intake; preserves original candidate metadata and status, gap rationale, required next steps, source access, exact-version details and identification provenance. |
| targeted_followup.source / targeted_followup_candidates[].source_artifact | Fingerprinted intake JSON and exact original candidate pointer. Source reading is identification evidence, not a new screening or human-verification event. |
| source_hash_matches | Current local screening Markdown equals its recorded SHA-256; not scientific verification. |
| conflicts_or_constraints | Exact-version exceptions, metadata corrections, absent bindings or local source integrity concerns. |
| work_count / work_ids | Unique works assigned a given controlled code; identities permit audit of every count. |
| denominator_field_coded_works | Eligible works with valid, decided coding for this field. |
| denominator_ai_analysis_eligible_works | Works eligible for this interim AI analysis before missing-field handling. |
| denominator_recorded_include_works | All works with a consistent Include decision in the selected authority track. |
| missing_or_unresolved_included_works | Included works not represented in this field; not coded as None. |
| assertions[].sources | Exact distillate paths, block anchors, record, Work and Version binding. |
| structural_grounding_complete | All stated targets/anchors/identities exist; not verification of content. |
| sources / source_fingerprint | SHA-256 of each input and deterministic aggregate; known text formats normalize CRLF to LF, binary bytes remain exact. Existing acquisition hashes retain their original byte-exact contract. No wall-clock timestamp disguises stale data. |

Controlled descriptive fields below come from `assessment/categories.yaml`. They do not replace inclusion criteria. Multi-code values can overlap; no prevalence or causal effect follows from these frequency tables.

"""
    for field in package["analysis_field_definitions"]:
        dictionary += f"- `{field['name']}`: " + (", ".join(str(v) for v in field.get("values", [])) or "free text") + ("; multiple codes allowed" if field.get("multi") else "") + ".\n"
    outline = "# Provisional source-bound synthesis outline\n\n" + preamble + "\nThis is a writing and verification plan, not a finished synthesis. The canonical manuscript remains `" + MANUSCRIPT + "`. Tables count recorded coding; the statements below are existing assertion texts with their recorded authority, not new findings.\n\n"
    topics = {"SQ1": "Prompting techniques and proposed, demonstrated or evaluated uses", "SQ2": "Bias axes, harm types, mitigation stages and evidence status", "SQ3": "Social work populations, settings, constraints and transfer limits"}
    for question, topic in topics.items():
        outline += f"## {question}: {topic}\n\n"
        tables = [row for row in package["analysis_tables"] if row["question"] == question]
        for name in FIELDS[question]:
            field_rows = [row for row in tables if row["field"] == name]
            first = field_rows[0]
            outline += f"- `{name}`: {first['denominator_field_coded_works']} coded works out of {first['denominator_recorded_include_works']} works with recorded Include; {first['missing_or_unresolved_included_works']} missing or unresolved. See the CSV for codes and contributing work IDs.\n"
        outline += "\nBefore final prose, complete missing codes, reconcile conflicts, distinguish observed study findings from proposals, and assess design limitations. Do not infer that absent coding demonstrates a literature gap.\n\n"
    outline += "## Existing source-bound assertions\n\n"
    for assertion in package["assertions"]:
        outline += f"### {assertion['title']}\n\nRecorded state: `{assertion['state']}`. Source: `{assertion['path']}`.\n\n{assertion['statement']}\n\n"
        review = assertion["current_ai_source_review"]
        if review:
            outline += f"Current source review: `{review['agent_id']}`, {review['model']}, `{review['reviewed_at']}`. {review['findings']}\n\n"
        for source in assertion["sources"]:
            outline += f"- `{source['path']}#{source['anchor']}`; Work `{source['work_id']}`; Version `{source['version_id']}`; distillate state `{source['distillate_state']}`.\n"
        outline += "\nReview exact text, study conditions, direction of reported findings and transfer limits before expanding this statement. Preserve the AI-review and human-verification distinction.\n\n"
    outline += "## Completion decisions\n\n- Curate all already identified 2026 candidates and explicitly document exclusions or unavailable sources.\n- Process the separate targeted gap-fill queue: source acquisition where needed, canonical Work-Version binding, then regular screening; retain its separate search provenance.\n- Complete Work-Version-bound coding and AI source reviews with recorded actor, model, time and hashes.\n- Apply the publication policy to each artifact while exposing its authority tier.\n- Add study-quality and applicability assessment before producing practice guidance or a bias benchmark.\n- Consolidate results, limitations, conflicts of interest and reporting disclosures in the canonical manuscript.\n"
    return {
        "completion-package.json": _dump(package), "README.md": readme,
        "data-dictionary.md": dictionary, "synthesis-outline.md": outline,
        "work-verification-queue.csv": _csv(package["works"], ["work_id", "title", "record_ids", "preferred_version_id", "human_decisions", "human_substantive_decisions", "human_duplicate_record_ids", "human_metadata_error_record_ids", "historical_identity_bindings", "historical_resolution", "integrity_hold", "agent_decisions", "decision_authority", "human_verification", "agent_lifecycle_states", "current_ai_review_results", "corrected_ai_record_ids", "ai_correction_provenance", "open_ai_source_review_record_ids", "effective_decision", "analysis_eligible", "analysis_conflicts", "analysis_undecidable", "conflicts", "source_queue_status", "source_blockers", "source_acquisition_progress", "next_actions"]),
        "unmapped-historical-records.csv": _csv([issue for issue in package["issues"] if issue["type"] == "unmapped_human_record"], ["record_id", "type", "historical_rows"]),
        "historical-recovery.ris": _historical_recovery_ris(package["issues"]),
        "candidate-2026-readiness.csv": _csv(package["candidates_2026"], ["candidate_id", "title", "doi", "selected_version_date", "source_lanes", "zotero_status", "canonical_bindings", "source_readiness", "recorded_source_ready", "source_hash_matches", "screening_markdown_file", "screening_status", "conflicts_or_constraints", "pending_zotero_corrections", "next_actions"]),
        "targeted-followup-queue.json": _dump({"schema": "femprompt-targeted-followup-queue/0.1", "source_fingerprint": fingerprint, "scope": "separate_targeted_gap_fill_intake", "provenance": package["targeted_followup"], "candidates": package["targeted_followup_candidates"]}),
        "targeted-followup-queue.csv": _csv(package["targeted_followup_candidates"], ["candidate_id", "title", "year", "doi", "arxiv_id", "version", "gap", "status", "canonical_bindings", "source_access", "peer_review_evidence", "landing_url", "fulltext_url", "required_next_steps", "source_artifact", "identification_provenance", "authority_note"]),
        "registry-candidate-queue.csv": _csv(package["registry_candidates_without_canonical_record"], ["work_id", "title", "flags", "review_status", "legacy_work_ids"]),
        "sq-analysis-tables.csv": _csv(package["analysis_tables"], ["question", "field", "value", "work_count", "work_ids", "denominator_field_coded_works", "denominator_ai_analysis_eligible_works", "denominator_recorded_include_works", "missing_or_unresolved_included_works", "authority", "counting_rule"]),
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, default=REPO)
    parser.add_argument("--output-dir", type=Path)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args(argv)
    repo = args.repo.resolve()
    output = args.output_dir.resolve() if args.output_dir else repo / OUTPUT
    try:
        outputs = render_outputs(build_package(repo))
        stale = []
        for filename, content in outputs.items():
            target = output / filename
            if args.check:
                if not target.exists() or target.read_text(encoding="utf-8") != content:
                    stale.append(filename)
            else:
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text(content, encoding="utf-8", newline="\n")
        if stale:
            print("Stale completion outputs: " + ", ".join(stale))
            return 1
        print(f"Completion package {'current' if args.check else 'written'}: {len(outputs)} files")
        return 0
    except (OSError, ValueError, KeyError, yaml.YAMLError) as error:
        print(f"Completion package failed: {error}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
