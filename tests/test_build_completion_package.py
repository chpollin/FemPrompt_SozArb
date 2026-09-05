"""Scientific counting, authority and freshness regressions for completion data."""

import hashlib
import json

import yaml

from src.analysis import build_completion_package as completion
from src.assess.artifact_verification import artifact_hash, record_hash


def registry():
    return {
        "record_index": {"A": {"work_id": "work:one", "version_id": "version:one"}, "B": {"work_id": "work:one", "version_id": "version:two"}},
        "works": [{"work_id": "work:one", "canonical_title": "One scholarly contribution", "preferred_version_id": "version:two"}],
    }


def agent(record_id, techniques=None, decision="Include"):
    return {
        "record_id": record_id, "decision": decision, "state": "ai-agent-reviewed",
        "analysis": {"AN_Prompt_Techniques": techniques or ["None"]}, "undecidable": {},
    }


def schema():
    return yaml.safe_load((completion.REPO / "assessment/categories.yaml").read_text(encoding="utf-8"))


def test_aliases_count_one_work_and_preserve_both_versions():
    rows, issues = completion._work_rows(registry(), [], {"A": [agent("A", ["ICL"])], "B": [agent("B", ["ICL"])]}, {})
    tables = completion._analysis(rows, schema())
    icl = next(row for row in tables if row["field"] == "AN_Prompt_Techniques" and row["value"] == "ICL")
    assert not issues
    assert len(rows) == 1
    assert rows[0]["version_ids"] == ["version:one", "version:two"]
    assert icl["work_count"] == icl["denominator_field_coded_works"] == 1


def test_human_exclusion_is_never_overridden_by_agent_inclusion():
    human = [{"Zotero_Key": "A", "Decision": "Exclude"}]
    rows, _ = completion._work_rows(registry(), human, {"B": [agent("B", ["ICL"])]}, {})
    assert rows[0]["effective_decision"] == "Exclude"
    assert rows[0]["decision_authority"] == "legacy_human"
    assert not rows[0]["analysis_eligible"]
    assert rows[0]["human_verification"] != "verified"
    assert "human_agent_decision_divergence" in rows[0]["conflicts"]


def test_explicit_duplicate_disposition_is_not_a_work_exclusion():
    human = [{"Zotero_Key": "A", "Decision": "Exclude", "Exclusion_Reason": "Duplicate"}, {"Zotero_Key": "B", "Decision": "Include"}]
    rows, _ = completion._work_rows(registry(), human, {}, {})
    assert rows[0]["effective_decision"] == "Include"
    assert rows[0]["human_duplicate_record_ids"] == ["A"]
    assert not rows[0]["conflicts"]
    assert rows[0]["human_decisions"] == ["Exclude", "Include"]


def test_conflicting_alias_codes_are_not_arbitrarily_merged():
    rows, _ = completion._work_rows(registry(), [], {"A": [agent("A", ["ICL"])], "B": [agent("B", ["Role_Persona"])]}, {})
    assert "AN_Prompt_Techniques" in rows[0]["analysis_conflicts"]
    tables = completion._analysis(rows, schema())
    assert all(row["work_count"] == 0 and row["denominator_field_coded_works"] == 0 for row in tables if row["field"] == "AN_Prompt_Techniques")


def test_missing_and_explicit_none_are_different():
    rows, _ = completion._work_rows(registry(), [], {"A": [agent("A")]}, {})
    tables = completion._analysis(rows, schema())
    explicit_none = next(row for row in tables if row["field"] == "AN_Prompt_Techniques" and row["value"] == "None")
    assert explicit_none["work_count"] == 1
    assert all(row["denominator_field_coded_works"] == 0 for row in tables if row["field"] == "AN_Population")


def test_undecidable_coding_is_excluded_from_field_denominator():
    record = agent("A", ["ICL"])
    record["undecidable"] = {"AN_Prompt_Techniques": {"reason": "source ambiguity"}}
    rows, _ = completion._work_rows(registry(), [], {"A": [record]}, {})
    tables = completion._analysis(rows, schema())
    assert all(row["denominator_field_coded_works"] == 0 for row in tables if row["field"] == "AN_Prompt_Techniques")


def test_accepted_correction_resolves_review_without_mutating_history(tmp_path):
    artifact = "docs/data/screening/ar2.json#/decisions/A"
    original = {
        "decision": "Include", "analysis": {"fields": {"AN_Mitigation_Status": "Evaluated"}},
        "active_annotation_id": "original-agent-annotation", "lifecycle": {"state": "ai-agent-reviewed"},
    }
    original["annotations"] = [{"annotation_id": "original-agent-annotation", "body": {
        "decision": "Include", "analysis": {"fields": {"AN_Mitigation_Status": "Evaluated"}},
    }}]
    raw_path = tmp_path / "docs/data/screening/ar2.json"
    raw_path.parent.mkdir(parents=True)
    raw_path.write_text(json.dumps({"schema": "femprompt-prisma-reviewer/0.2", "decisions": {"A": original}}), encoding="utf-8")
    raw_bytes = raw_path.read_bytes()
    correction_path = tmp_path / "generated/verification/corrections.json"
    correction_path.parent.mkdir(parents=True)
    correction = {
        "paper_id": "A", "base_artifact": artifact, "base_sha256": record_hash(original),
        "agent_id": "/test/reviewer", "model": "test-model", "corrected_at": "2026-09-05T12:50:00Z",
        "changes": [{"path": "/analysis/fields/AN_Mitigation_Status", "before": "Evaluated", "after": "None", "reason": "Source evaluates bias but no mitigation intervention."}],
    }
    correction_path.write_text(json.dumps({"schema": "femprompt-screening-corrections/0.1", "corrections": {"A": correction}}), encoding="utf-8")
    reference = "generated/verification/corrections.json#/corrections/A"
    accepted = {
        "artifact": reference, "sha256": artifact_hash(tmp_path, reference), "result": "accepted",
        "agent_id": "/test/reviewer", "model": "test-model", "reviewed_at": "2026-09-05T12:51:00Z",
        "findings": "Corrected analysis matches the source.",
    }
    negative = dict(accepted, artifact=artifact, sha256=record_hash(original), result="changes_requested", reviewed_at="2026-09-05T12:40:00Z")
    inputs = set()
    agents, issues = completion._agent_records(tmp_path, inputs, {reference: accepted}, {artifact: negative})
    record = agents["A"][0]
    assert not issues
    assert record["analysis"]["AN_Mitigation_Status"] == "None"
    assert record["original_analysis"]["AN_Mitigation_Status"] == "Evaluated"
    assert record["annotation_id"] == "original-agent-annotation"
    assert record["state"] == "ai-agent-reviewed"
    assert record["applied_ai_correction"] == correction
    assert record["current_ai_source_review"]["artifact"] == reference
    assert record["current_ai_review_result"] == "accepted"
    assert record["latest_original_ai_source_review"]["result"] == "changes_requested"
    assert raw_path.read_bytes() == raw_bytes
    assert "generated/verification/corrections.json" in inputs
    rows, _ = completion._work_rows(registry(), [], agents, {})
    assert rows[0]["corrected_ai_record_ids"] == ["A"]
    assert rows[0]["ai_correction_provenance"][0]["base_artifact"] == artifact
    assert rows[0]["ai_correction_provenance"][0]["base_sha256"] == record_hash(original)
    assert rows[0]["ai_correction_provenance"][0]["model"] == "test-model"
    assert rows[0]["open_ai_source_review_record_ids"] == []
    assert rows[0]["analysis_eligible"]
    table = next(row for row in completion._analysis(rows, schema()) if row["question"] == "SQ1" and row["field"] == "AN_Mitigation_Status" and row["value"] == "None")
    assert table["work_count"] == 1


def test_unresolved_negative_source_review_stays_open_and_out_of_analysis():
    record = agent("A", ["ICL"])
    record["current_ai_review_result"] = "changes_requested"
    rows, _ = completion._work_rows(registry(), [], {"A": [record]}, {})
    assert rows[0]["effective_decision"] == "Include"
    assert rows[0]["open_ai_source_review_record_ids"] == ["A"]
    assert "open_source_review" in rows[0]["conflicts"]
    assert not rows[0]["analysis_eligible"]
    assert all(row["work_count"] == 0 for row in completion._analysis(rows, schema()))


def test_source_readiness_checks_bytes_and_does_not_invent_binding(tmp_path):
    source = tmp_path / "source.md"
    source.write_text("prepared source", encoding="utf-8")
    package = {"records": [{"candidate_id": "candidate:one", "title": "Existing title", "matched_zotero_keys": []}]}
    ready = {"records": [{"candidate_id": "candidate:one", "screening_source_ready": True, "screening_markdown_file": "source.md", "screening_markdown_sha256": hashlib.sha256(source.read_bytes()).hexdigest()}]}
    rows = completion._candidate_rows(tmp_path, package, ready, registry(), set())
    assert rows[0]["source_hash_matches"]
    assert rows[0]["canonical_bindings"] == []
    source.write_text("changed source", encoding="utf-8")
    rows = completion._candidate_rows(tmp_path, package, ready, registry(), set())
    assert not rows[0]["source_hash_matches"]
    assert "prepared_markdown_hash_unbound_or_mismatch" in rows[0]["conflicts_or_constraints"]


def test_targeted_followup_does_not_infer_identity_or_promote_source_access():
    candidate = {
        "candidate_id": "gap:one", "title": "One scholarly contribution", "status": "identified_not_screened",
        "zotero_key": None, "work_id": None, "version_id": None,
        "source_access": {"basis": "fulltext_read", "read_sections": ["methods"]},
        "gap": "Concrete missing setting", "required_next_steps": ["canonical_work_version_binding", "regular_screening"],
    }
    followup = {"schema": "femprompt-targeted-followup/0.1", "candidates": [candidate], "agent_id": "/test/identifier", "model": "test-model", "generated_at": "2026-09-05T12:00:00Z"}
    row = completion._followup_rows(followup, registry())[0]
    assert row["canonical_bindings"] == []
    assert row["status"] == "identified_not_screened"
    assert row["work_id"] is None and row["version_id"] is None
    assert row["source_access"] == candidate["source_access"]
    assert row["identification_provenance"]["agent_id"] == "/test/identifier"
    assert row["source_artifact"].endswith("#/candidates/0")
    assert "canonical_bindings" not in candidate


def test_full_package_has_explicit_denominators_and_no_promoted_authority():
    package = completion.build_package()
    assert len({row["work_id"] for row in package["works"]}) == package["counts"]["canonical_record_bound_works"]
    assert package["counts"]["registry_all_works"] >= package["counts"]["canonical_record_bound_works"]
    assert package["counts"]["candidates_2026"] == len(package["candidates_2026"])
    assert package["counts"]["candidates_2026"] == 58
    assert package["counts"]["targeted_followup_candidates"] == len(package["targeted_followup_candidates"]) == 3
    assert package["counts"]["targeted_followup_with_canonical_binding"] == 0
    assert package["counts"]["targeted_followup_recorded_fulltext_read"] == 2
    assert all(row["status"] == "identified_not_screened" for row in package["targeted_followup_candidates"])
    assert completion.FOLLOWUP in {source["path"] for source in package["sources"]}
    assert all(row["scope"] == "included_in_completion_target_pending_curation_and_screening" for row in package["candidates_2026"])
    assert all(row["authority"] == "provisional_recorded_ai_review" for row in package["analysis_tables"])
    assert all(issue["type"] == "unmapped_human_record" for issue in package["issues"])
    assert package["counts"]["unmapped_historical_human_records"] == len(package["issues"])


def test_check_detects_any_missing_or_changed_managed_output(tmp_path, monkeypatch):
    package = completion.build_package()
    monkeypatch.setattr(completion, "build_package", lambda repo: package)
    args = ["--output-dir", str(tmp_path)]
    assert completion.main(args) == 0
    assert completion.main([*args, "--check"]) == 0
    (tmp_path / "synthesis-outline.md").write_text("stale", encoding="utf-8")
    assert completion.main([*args, "--check"]) == 1
    assert completion.main(args) == 0
    (tmp_path / "sq-analysis-tables.csv").unlink()
    assert completion.main([*args, "--check"]) == 1


def test_conformance_uses_current_manuscript_and_synthesis_subitems():
    path = completion.REPO / "generated/conformance/conformance_map.yaml"
    text = path.read_text(encoding="utf-8")
    assert "paper/draft.md" not in text
    items = {row["item_id"]: row for row in yaml.safe_load(text)["prisma_2020"]}
    assert "13" not in items
    assert all(items[key]["status"] != "not_applicable" for key in ("13a", "13b", "13c", "13d", "20a"))
    assert (completion.REPO / completion.MANUSCRIPT).is_file()
