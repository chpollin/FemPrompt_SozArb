"""Scientific counting, authority and freshness regressions for completion data."""

import hashlib
import json

import pytest
import yaml

from src.analysis import build_completion_package as completion
from src.assess.artifact_verification import artifact_hash, record_hash, validated_reviews, latest_screening_review, reviewed_screening_projection


def registry():
    return {
        "record_index": {"A": {"work_id": "work:one", "version_id": "version:one"}, "B": {"work_id": "work:one", "version_id": "version:two"}},
        "works": [{"work_id": "work:one", "canonical_title": "One scholarly contribution", "preferred_version_id": "version:two"}],
    }


def test_residual_progress_checks_sources_without_inventing_screening(tmp_path):
    report_path = tmp_path / completion.RESIDUAL
    report_path.parent.mkdir(parents=True)
    (tmp_path / "queue.json").write_text("{}", encoding="utf-8")
    (tmp_path / "raw.json").write_text('[{"key":"A"}]', encoding="utf-8")
    (tmp_path / "original.md").write_text("Original article", encoding="utf-8")
    entry = {"record_id": "A", "canonical_binding_before": registry()["record_index"]["A"],
             "agent_id": "test", "model": "test", "reviewed_at": "2026-09-05T12:00:00Z",
             "finding": "Original acquired", "next_step": "Bind and screen",
             "raw_metadata_reference": "raw.json#/0", "raw_record_sha256": artifact_hash(tmp_path, "raw.json#/0"),
             "scholarly_screening_status": "not_performed_in_this_task",
             "original_text": {"source_path": "original.md", "sha256": artifact_hash(tmp_path, "original.md")}}
    report = {"schema": "femprompt-residual-source-resolution/0.1", "records": {"A": entry},
              "scope": {"original_queue": "queue.json", "original_queue_sha256": artifact_hash(tmp_path, "queue.json")}}
    report_path.write_text(json.dumps(report), encoding="utf-8")
    inputs = set()
    result = completion._residual_progress(tmp_path, registry(), inputs)
    assert result["A"]["scholarly_screening_status"] == "not_performed_in_this_task"
    assert "original.md" in inputs and "raw.json" in inputs
    (tmp_path / "original.md").write_text("Different version", encoding="utf-8")
    with pytest.raises(ValueError, match="Stale residual source"):
        completion._residual_progress(tmp_path, registry(), inputs)


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


def _family_review_fixture(tmp_path):
    artifact = "docs/data/screening/ar2.json#/decisions/A"
    body = {"decision": "Include", "analysis": {"fields": {"AN_Prompt_Techniques": ["ICL"]}}}
    original = {**body, "active_annotation_id": "original", "annotations": [{"annotation_id": "original", "body": body}], "lifecycle": {"state": "ai-agent-reviewed"}}
    path = tmp_path / "docs/data/screening/ar2.json"
    path.parent.mkdir(parents=True)
    path.write_text(json.dumps({"schema": "femprompt-prisma-reviewer/0.2", "decisions": {"A": original}}), encoding="utf-8")
    (tmp_path / "source.md").write_text("A supported finding.", encoding="utf-8")
    receipt = {"artifact": artifact, "sha256": record_hash(original), "result": "accepted", "review_type": "ai-source-review", "agent_id": "test-reviewer", "model": "test-model", "reviewed_at": "2026-09-05T12:00:00Z", "findings": "Fixture source review.", "evidence": [{"source_path": "source.md", "sha256": artifact_hash(tmp_path, "source.md"), "work_id": "work:one", "version_id": "version:one", "locator": "paragraph 1", "quote": "A supported finding."}]}
    return artifact, original, receipt


@pytest.mark.parametrize("all_acceptances_revoked", [False, True])
@pytest.mark.parametrize("missing_correction", [False, True])
def test_later_negative_correction_is_current_and_excluded_from_completion_analysis(tmp_path, all_acceptances_revoked, missing_correction):
    artifact, original, accepted = _family_review_fixture(tmp_path)
    correction_artifact = "generated/verification/corrections.json#/corrections/A"
    negative = dict(accepted, artifact=correction_artifact, sha256="sha256:" + "0" * 64, result="changes_requested", reviewed_at="2026-09-05T14:00:00Z", base_artifact=artifact, findings="The newer correction does not match its source.")
    if not missing_correction:
        correction_path = tmp_path / "generated/verification/corrections.json"
        correction_path.parent.mkdir(parents=True)
        correction_path.write_text(json.dumps({"corrections": {"A": {"base_artifact": artifact}}}), encoding="utf-8")
        negative.pop("base_artifact")  # Exercise correlation through artifact bytes.
    entries = [accepted, negative]
    if all_acceptances_revoked:
        entries.append(dict(accepted, result="unverifiable", reviewed_at="2026-09-05T13:00:00Z"))
    reviews = validated_reviews(tmp_path, {"schema": "femprompt-artifact-verification/0.1", "reviews": entries})
    assert bool(reviews) is not all_acceptances_revoked
    assert latest_screening_review(tmp_path, artifact, reviews) == negative
    assert reviewed_screening_projection(tmp_path, artifact, original, reviews) == (original, None, None)
    agents, issues = completion._agent_records(tmp_path, set(), reviews)
    row = agents["A"][0]
    assert not issues
    assert row["current_ai_review_result"] == "changes_requested"
    assert row["current_ai_source_review"]["artifact"] == correction_artifact
    assert row["current_ai_source_review"]["findings"] == negative["findings"]
    assert row["applied_ai_correction"] is None
    assert row["decision"] == "Include" and row["analysis"] == original["analysis"]["fields"]
    works, _ = completion._work_rows(registry(), [], agents, {})
    assert works[0]["open_ai_source_review_record_ids"] == ["A"]
    assert works[0]["analysis_eligible"] is False
    assert all(cell["work_count"] == 0 for cell in completion._analysis(works, schema()))


def test_completion_fails_closed_for_simultaneous_conflicting_family_reviews(tmp_path):
    artifact, _, accepted = _family_review_fixture(tmp_path)
    negative = dict(accepted, artifact="missing-correction.json#/corrections/A", result="changes_requested", base_artifact=artifact)
    reviews = validated_reviews(tmp_path, {"schema": "femprompt-artifact-verification/0.1", "reviews": [accepted, negative]})
    with pytest.raises(ValueError, match="Conflicting screening family reviews"):
        completion._agent_records(tmp_path, set(), reviews)


@pytest.mark.parametrize("integrity_hold", [False, True])
def test_source_hold_excludes_current_accepted_coding_from_completion_analysis(integrity_hold):
    reviewed = agent("A", ["ICL"])
    reviewed["current_ai_review_result"] = "accepted"
    resolution = {"work_resolutions": {"work:one": {"withhold_from_current_synthesis": True, "integrity_hold": integrity_hold}}}
    works, _ = completion._work_rows(registry(), [], {"A": [reviewed]}, {}, resolution)
    assert works[0]["current_ai_review_results"] == ["accepted"]
    assert works[0]["effective_decision"] == "Include"
    assert works[0]["analysis_eligible"] is False
    assert ("source_integrity_hold" if integrity_hold else "source_version_hold") in works[0]["conflicts"]
    assert all(cell["work_count"] == 0 for cell in completion._analysis(works, schema()))


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


@pytest.mark.parametrize("bound", [False, True])
def test_acquisition_history_does_not_reopen_a_completed_source_binding(bound):
    source_registry = registry()
    source_registry["source_index"] = {"A": {"source_version_id": "version:one"}} if bound else {}
    queue = {"queue": [{"work_id": "work:one", "queue_status": "ready" if bound else "blocked_missing_paper_source", "blockers": [] if bound else ["paper_source_missing"]}]}
    works, _ = completion._work_rows(source_registry, [], {}, queue)
    entry = {"record_id": "A", "original_text": {"source_path": "original.md"}, "next_step": "Bind the newly acquired text", "source_status": "acquired_unbound"}
    completion._attach_source_progress(works[0], {"A": entry}, source_registry)
    assert works[0]["source_acquisition_progress"][0]["source_status"] == "acquired_unbound"
    assert works[0]["newly_acquired_text_requires_binding"] is not bound
    assert (entry["next_step"] in works[0]["next_actions"]) is not bound
    if bound:
        assert "execute_governed_source_screening" in works[0]["next_actions"]
        assert not works[0]["agent_records"]
        assert not works[0]["analysis_eligible"]


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
