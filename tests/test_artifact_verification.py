import copy
import json
from pathlib import Path

import pytest

from src.assess.artifact_verification import artifact_hash, record_hash, validated_reviews, reviewed_screening_projection


def ledger(tmp_path: Path):
    (tmp_path / "claim.md").write_text("A claim.\n", encoding="utf-8")
    (tmp_path / "source.md").write_text("A supported finding.\n", encoding="utf-8")
    receipt = {
        "artifact": "claim.md", "sha256": artifact_hash(tmp_path, "claim.md"),
        "result": "accepted", "review_type": "ai-source-review", "agent_id": "reviewer-1",
        "model": "test-model", "reviewed_at": "2026-09-05T12:00:00Z",
        "findings": "The claim is supported by the indicated source passage.",
        "evidence": [{"source_path": "source.md", "sha256": artifact_hash(tmp_path, "source.md"),
                      "work_id": "work:one", "version_id": "version:one", "locator": "paragraph 1",
                      "quote": "A supported finding."}],
    }
    return {"schema": "femprompt-artifact-verification/0.1", "reviews": [receipt]}


def test_receipt_binds_artifact_and_source(tmp_path):
    data = ledger(tmp_path)
    assert "claim.md" in validated_reviews(tmp_path, data)
    (tmp_path / "source.md").write_text("A different finding.", encoding="utf-8")
    with pytest.raises(ValueError, match="Stale source"):
        validated_reviews(tmp_path, data)


def test_indexed_ledger_preserves_outcomes_and_detects_changed_batch(tmp_path):
    data = ledger(tmp_path)
    negative = copy.deepcopy(data["reviews"][0])
    negative.update(result="unverifiable", reviewed_at="2026-09-06T12:00:00Z")
    data["reviews"].append(negative)
    (tmp_path / "batch.json").write_text(json.dumps(data), encoding="utf-8")
    index = {"schema": "femprompt-artifact-verification/0.2", "reviews": [],
             "review_sources": [{"path": "batch.json", "sha256": artifact_hash(tmp_path, "batch.json")}]}
    expected = validated_reviews(tmp_path, data)
    actual = validated_reviews(tmp_path, index)
    assert actual == expected and actual.latest == expected.latest
    (tmp_path / "batch.json").write_text(json.dumps({**data, "reviews": data["reviews"][:1]}), encoding="utf-8")
    with pytest.raises(ValueError, match="Stale review source batch"):
        validated_reviews(tmp_path, index)


def test_indexed_ledger_rejects_duplicate_receipts_and_nested_sources(tmp_path):
    data = ledger(tmp_path)
    (tmp_path / "batch.json").write_text(json.dumps(data), encoding="utf-8")
    index = {"schema": "femprompt-artifact-verification/0.2", "reviews": list(data["reviews"]),
             "review_sources": [{"path": "batch.json", "sha256": artifact_hash(tmp_path, "batch.json")}]}
    with pytest.raises(ValueError, match="Duplicate receipt"):
        validated_reviews(tmp_path, index)
    index["reviews"] = []
    (tmp_path / "batch.json").write_text(json.dumps(index), encoding="utf-8")
    index["review_sources"][0]["sha256"] = artifact_hash(tmp_path, "batch.json")
    with pytest.raises(ValueError, match="nested"):
        validated_reviews(tmp_path, index)


def test_latest_negative_review_withholds_previous_acceptance(tmp_path):
    data = ledger(tmp_path)
    next_review = copy.deepcopy(data["reviews"][0])
    next_review.update(result="changes_requested", reviewed_at="2026-09-06T12:00:00Z")
    data["reviews"].append(next_review)
    assert validated_reviews(tmp_path, data) == {}


def test_json_pointer_receipt_survives_unrelated_record_addition(tmp_path):
    path = tmp_path / "records.json"
    path.write_text(json.dumps({"decisions": {"one": {"decision": "Include"}}}), encoding="utf-8")
    expected = artifact_hash(tmp_path, "records.json#/decisions/one")
    path.write_text(json.dumps({"decisions": {"two": {}, "one": {"decision": "Include"}}}), encoding="utf-8")
    assert artifact_hash(tmp_path, "records.json#/decisions/one") == expected == record_hash({"decision": "Include"})


def test_false_quote_or_missing_identity_cannot_release(tmp_path):
    data = ledger(tmp_path)
    data["reviews"][0]["evidence"][0]["quote"] = "Invented finding"
    with pytest.raises(ValueError, match="quotation"):
        validated_reviews(tmp_path, data)
    data["reviews"][0]["evidence"][0]["quote"] = ""
    data["reviews"][0]["agent_id"] = ""
    with pytest.raises(ValueError, match="agent_id"):
        validated_reviews(tmp_path, data)


def test_repository_escape_is_rejected(tmp_path):
    data = ledger(tmp_path)
    data["reviews"][0]["artifact"] = "../outside.md"
    with pytest.raises(ValueError, match="escapes"):
        validated_reviews(tmp_path, data)


def correction_ledger(tmp_path):
    data = ledger(tmp_path)
    original = {"analysis": {"fields": {"AN_Mitigation_Status": "Evaluated"}}, "lifecycle": {"state": "ai-agent-reviewed"}}
    (tmp_path / "records.json").write_text(json.dumps({"decisions": {"P1": original}}), encoding="utf-8")
    correction = {"paper_id": "P1", "base_artifact": "records.json#/decisions/P1",
                  "base_sha256": record_hash(original), "agent_id": "corrector", "model": "test-model",
                  "corrected_at": "2026-09-05T11:00:00Z",
                  "changes": [{"path": "/analysis/fields/AN_Mitigation_Status", "before": "Evaluated",
                               "after": "None", "reason": "The source evaluates bias, not a mitigation intervention."}]}
    (tmp_path / "corrections.json").write_text(json.dumps({"schema": "femprompt-screening-corrections/0.1", "corrections": {"P1": correction}}), encoding="utf-8")
    data["reviews"][0].update(artifact="corrections.json#/corrections/P1", sha256=artifact_hash(tmp_path, "corrections.json#/corrections/P1"))
    return original, data, correction


def test_correction_preserves_historical_annotation_and_authority(tmp_path):
    original, data, correction = correction_ledger(tmp_path)
    before = copy.deepcopy(original)
    projected, receipt, basis = reviewed_screening_projection(tmp_path, "records.json#/decisions/P1", original, validated_reviews(tmp_path, data))
    assert projected["analysis"]["fields"]["AN_Mitigation_Status"] == "None"
    assert projected["lifecycle"] == original["lifecycle"]
    assert original == before
    assert basis == correction and receipt["agent_id"] == "reviewer-1"


def test_changed_original_invalidates_correction_receipt(tmp_path):
    original, data, _ = correction_ledger(tmp_path)
    original["analysis"]["fields"]["AN_Mitigation_Status"] = "Proposed"
    (tmp_path / "records.json").write_text(json.dumps({"decisions": {"P1": original}}), encoding="utf-8")
    with pytest.raises(ValueError, match="Stale or mismatched"):
        validated_reviews(tmp_path, data)


def test_ai_correction_cannot_change_lifecycle_even_with_matching_hash(tmp_path):
    _, data, correction = correction_ledger(tmp_path)
    correction["changes"] = [{"path": "/lifecycle/state", "before": "ai-agent-reviewed", "after": "verified", "reason": "invalid authority escalation"}]
    (tmp_path / "corrections.json").write_text(json.dumps({"schema": "femprompt-screening-corrections/0.1", "corrections": {"P1": correction}}), encoding="utf-8")
    data["reviews"][0]["sha256"] = artifact_hash(tmp_path, "corrections.json#/corrections/P1")
    with pytest.raises(ValueError, match="Unsupported or repeated"):
        validated_reviews(tmp_path, data)


def test_canonical_receipt_binding_is_checked_against_registry(tmp_path):
    _, data, _ = correction_ledger(tmp_path)
    receipt = data["reviews"][0]
    receipt["canonical_binding"] = {"paper_id": "P1", "work_id": "work:one", "version_id": "version:one"}
    (tmp_path / "corpus").mkdir()
    registry = {"record_index": {"P1": {"work_id": "work:one", "version_id": "version:one"}},
                "works": [{"work_id": "work:one", "versions": [{"version_id": "version:one"}]}]}
    path = tmp_path / "corpus/work_version_registry.json"
    path.write_text(json.dumps(registry), encoding="utf-8")
    assert receipt["artifact"] in validated_reviews(tmp_path, data)
    registry["record_index"]["P1"]["version_id"] = "version:other"
    path.write_text(json.dumps(registry), encoding="utf-8")
    with pytest.raises(ValueError, match="binding does not match"):
        validated_reviews(tmp_path, data)


def _base_acceptance(tmp_path, correction_receipt):
    receipt = copy.deepcopy(correction_receipt)
    receipt.update(
        artifact="records.json#/decisions/P1",
        sha256=artifact_hash(tmp_path, "records.json#/decisions/P1"),
        reviewed_at="2026-09-04T12:00:00Z",
    )
    return receipt


def test_revoked_correction_cannot_revive_older_base_acceptance(tmp_path):
    original, data, _ = correction_ledger(tmp_path)
    accepted_correction = copy.deepcopy(data["reviews"][0])
    revoked = copy.deepcopy(accepted_correction)
    revoked.update(result="changes_requested", reviewed_at="2026-09-06T12:00:00Z")
    data["reviews"] = [_base_acceptance(tmp_path, accepted_correction), accepted_correction, revoked]
    reviews = validated_reviews(tmp_path, data)
    assert len(reviews) == 1  # The public mapping remains backward compatible.
    assert reviews.latest[revoked["artifact"]]["result"] == "changes_requested"
    assert reviewed_screening_projection(tmp_path, "records.json#/decisions/P1", original, reviews) == (original, None, None)

    renewed = copy.deepcopy(accepted_correction)
    renewed["reviewed_at"] = "2026-09-07T12:00:00Z"
    data["reviews"].append(renewed)
    projected, receipt, _ = reviewed_screening_projection(tmp_path, "records.json#/decisions/P1", original, validated_reviews(tmp_path, data))
    assert receipt == renewed
    assert projected["analysis"]["fields"]["AN_Mitigation_Status"] == "None"


@pytest.mark.parametrize("target", ["canonical_binding", "base_artifact", "pointer_only"])
def test_revocation_survives_removed_correction_artifact(tmp_path, target):
    original, data, _ = correction_ledger(tmp_path)
    correction_receipt = data["reviews"][0]
    revoked = copy.deepcopy(correction_receipt)
    revoked.update(result="unverifiable", reviewed_at="2026-09-06T12:00:00Z")
    if target == "canonical_binding":
        revoked[target] = {"paper_id": "P1", "work_id": "work:one", "version_id": "version:one"}
    elif target == "base_artifact":
        revoked[target] = "records.json#/decisions/P1"
    data["reviews"] = [_base_acceptance(tmp_path, correction_receipt), revoked]
    (tmp_path / "corrections.json").unlink()
    reviews = validated_reviews(tmp_path, data)
    assert reviewed_screening_projection(tmp_path, "records.json#/decisions/P1", original, reviews) == (original, None, None)


def test_newer_base_rejection_withholds_accepted_correction(tmp_path):
    original, data, _ = correction_ledger(tmp_path)
    rejected = _base_acceptance(tmp_path, data["reviews"][0])
    rejected.update(result="changes_requested", reviewed_at="2026-09-06T12:00:00Z")
    data["reviews"].append(rejected)
    reviews = validated_reviews(tmp_path, data)
    assert reviewed_screening_projection(tmp_path, "records.json#/decisions/P1", original, reviews) == (original, None, None)


def test_simultaneous_conflicting_corrections_fail_regardless_of_ledger_order(tmp_path):
    original, data, correction = correction_ledger(tmp_path)
    alternative = copy.deepcopy(correction)
    alternative["changes"][0]["after"] = "Proposed"
    (tmp_path / "corrections-b.json").write_text(json.dumps({"schema": "femprompt-screening-corrections/0.1", "corrections": {"P1": alternative}}), encoding="utf-8")
    second = copy.deepcopy(data["reviews"][0])
    second.update(artifact="corrections-b.json#/corrections/P1", sha256=artifact_hash(tmp_path, "corrections-b.json#/corrections/P1"))
    data["reviews"].append(second)
    for rows in (data["reviews"], list(reversed(data["reviews"]))):
        reviews = validated_reviews(tmp_path, {"schema": data["schema"], "reviews": rows})
        with pytest.raises(ValueError, match="Conflicting screening family reviews"):
            reviewed_screening_projection(tmp_path, "records.json#/decisions/P1", original, reviews)


def test_correction_id_must_match_base_record_even_without_canonical_binding(tmp_path):
    original, data, correction = correction_ledger(tmp_path)
    (tmp_path / "records.json").write_text(json.dumps({"decisions": {"P2": original}}), encoding="utf-8")
    correction["base_artifact"] = "records.json#/decisions/P2"
    (tmp_path / "corrections.json").write_text(json.dumps({"schema": "femprompt-screening-corrections/0.1", "corrections": {"P1": correction}}), encoding="utf-8")
    data["reviews"][0]["sha256"] = artifact_hash(tmp_path, "corrections.json#/corrections/P1")
    with pytest.raises(ValueError, match="Stale or mismatched screening correction"):
        validated_reviews(tmp_path, data)
