"""Tests for the canonical PRISM screening lifecycle contract."""

from __future__ import annotations

import json
from copy import deepcopy
from pathlib import Path
from typing import Any, Callable

import pytest

from src.assess import screening_lifecycle as lifecycle


ROOT = Path(__file__).resolve().parents[1]
PILOT = (
    ROOT
    / "tests"
    / "review-cases"
    / "agent-runs"
    / "ratification-ar2-20260822"
    / "product-v0.3.json"
)
NEW_PRODUCT = (
    ROOT
    / "tests"
    / "review-cases"
    / "agent-runs"
    / "uncovered-sources-5-20260823"
    / "product-v0.3.json"
)


def _pilot() -> dict[str, Any]:
    return json.loads(PILOT.read_text(encoding="utf-8"))


def test_migration_projects_pilot_to_nested_ai_agent_reviewed_lifecycle() -> None:
    migrated = lifecycle.migrate_v03_document(_pilot())

    assert migrated["schema"] == lifecycle.SCHEMA_V05
    assert migrated["status"] == "ai-agent-reviewed"
    assert len(migrated["decisions"]) == 10
    assert lifecycle.validate_document(migrated) == []
    for paper_id, record in migrated["decisions"].items():
        lifecycle_data = record["lifecycle"]
        provenance = record["provenance"]
        assert lifecycle_data["baseline"] == {
            "state": "curated",
            "basis": "legacy_import",
            "at": record["ts"],
            "actor_ids": ["legacy-curation"],
        }
        assert lifecycle_data["state"] == "ai-agent-reviewed"
        assert [event["to"] for event in lifecycle_data["events"]] == [
            "agent-annotated",
            "ai-agent-reviewed",
        ]
        assert all(
            "activity_id" in event and "actor_ids" in event
            for event in lifecycle_data["events"]
        )
        assert provenance["annotation_id"] == f"ar2:{paper_id}"
        assert [actor["id"] for actor in provenance["actors"]] == [
            "legacy-curation",
            "ai-screening:rr1",
            "ai-screening:rr2",
            "legacy-ai-agent-reviewer",
        ]
        assert provenance["activities"][0]["associated_actor_ids"] == [
            "ai-screening:rr1",
            "ai-screening:rr2",
        ]
        assert provenance["actors"][0]["roles"] == ["curation"]
        assert provenance["actors"][-1]["type"] == "ai_agent"
        assert provenance["actors"][-1]["roles"] == ["ai_agent_reviewer"]
        assert provenance["activities"][0]["method"] == (
            "operationally_isolated_agent_screening_with_separate_source_review"
        )
        assert provenance["activities"][0]["prompt"] == {
            "status": "recorded",
            "reference": "prompts/prism-agent-reviewer.md",
            "version": "0.4",
            "sha256": "3EC4AFB62EF57C3FACFC8925F133F004ADF34F3F3D1B50709967E90FC1F8929A",
        }
        assert {item["id"] for item in provenance["derived_from"]} >= {
            "consensus",
            "run-manifest",
            "track:rr1",
            "track:rr2",
        }
        assert provenance["activities"][1]["model"] == {
            "status": "legacy_gap",
            "value": "unrecorded",
        }
        assert record["active_annotation_id"] == f"ar2:{paper_id}"
        assert record["annotations"][0]["body"] == lifecycle.annotation_body(record)
        assert record["checks"] == []
        assert [event["result"] for event in lifecycle_data["events"]] == [
            "completed",
            "accepted",
        ]


def test_new_run_migration_records_model_sources_and_review_derivations() -> None:
    source = json.loads(NEW_PRODUCT.read_text(encoding="utf-8"))

    migrated = lifecycle.migrate_v03_document(source)

    assert lifecycle.validate_document(migrated) == []
    record = migrated["decisions"]["UKKQKL7I"]
    assert record["lifecycle"]["baseline"] == {
        "state": "curated",
        "basis": "curated_corpus_snapshot",
        "at": record["ts"],
        "actor_ids": ["curation-provenance-unrecorded"],
    }
    assert record["provenance"]["activities"][0]["model"] == {
        "status": "recorded",
        "reference": "Codex collaboration runtime:opus",
        "provider": "Codex collaboration runtime",
        "model": "opus",
        "model_version": "runtime-alias-opus-2026-08-23",
    }
    assert record["provenance"]["used_sources"] == [
        {
            "id": "paper:UKKQKL7I",
            "type": "paper",
            "reference": "docs/data/fulltext/UKKQKL7I.md",
            "sha256": "d6ef1a0ffbf5ab4e5b570afe571b4ea15e612ebc847490d8da19cb3a4c802039",
        }
    ]
    assert {item["id"] for item in record["provenance"]["derived_from"]} == {
        "ai-agent-review",
        "run-manifest",
        "track:ar1",
        "track:ar2",
    }


def test_migration_is_deterministic() -> None:
    source = _pilot()
    first = lifecycle.migrate_v03_document(source)
    second = lifecycle.migrate_v03_document(source)

    assert json.dumps(first, ensure_ascii=False, sort_keys=True) == json.dumps(
        second, ensure_ascii=False, sort_keys=True
    )


@pytest.mark.parametrize(
    ("mutation", "expected_error"),
    [
        (
            lambda record: record["lifecycle"]["events"][0].__setitem__(
                "event_id", record["lifecycle"]["events"][1]["event_id"]
            ),
            "duplicate event id",
        ),
        (
            lambda record: record["lifecycle"]["events"][0].__setitem__(
                "at", "not-a-time"
            ),
            "invalid ISO-8601 timestamp",
        ),
        (
            lambda record: record["lifecycle"]["events"][1].__setitem__(
                "from", "curated"
            ),
            "expected 'agent-annotated'",
        ),
        (
            lambda record: record["provenance"].__setitem__("used_sources", []),
            "used_sources: at least one reference is required",
        ),
        (
            lambda record: record["lifecycle"]["events"][0].__setitem__(
                "actor_ids", ["missing-actor"]
            ),
            "unknown actor 'missing-actor'",
        ),
    ],
)
def test_validator_checks_lifecycle_and_provenance_references(
    mutation: Callable[[dict[str, Any]], None], expected_error: str
) -> None:
    migrated = lifecycle.migrate_v03_document(_pilot())
    record = next(iter(migrated["decisions"].values()))
    mutation(record)

    errors = lifecycle.validate_document(migrated)

    assert any(expected_error in error for error in errors)


def test_validator_enforces_human_domain_and_publication_gates() -> None:
    migrated = lifecycle.migrate_v03_document(_pilot())
    paper_id, record = next(iter(migrated["decisions"].items()))
    provenance = record["provenance"]
    lifecycle_data = record["lifecycle"]
    provenance["actors"].append(
        {
            "id": "domain-expert",
            "type": "person",
            "roles": ["domain_expert"],
        }
    )
    provenance["activities"].append(
        {
            "id": f"{paper_id}:domain-review",
            "type": "domain_review",
            "run_id": "domain-run",
            "method": "expert_review",
            "prompt": {
                "status": "recorded",
                "reference": "knowledge/update-protocol.md#1.1",
            },
            "model": {"status": "not_applicable", "value": "not_applicable"},
            "associated_actor_ids": ["domain-expert"],
        }
    )
    lifecycle_data["state"] = "publication-approved"
    lifecycle_data["events"].extend(
        [
            {
                "event_id": f"{paper_id}:domain-review",
                "event_type": "domain_expert_verification",
                "from": "ai-agent-reviewed",
                "to": "verified",
                "at": record["ts"],
                "activity_id": f"{paper_id}:domain-review",
                "actor_ids": ["domain-expert"],
                "result": "accepted",
                "note": "Fachlich geprüft.",
                "annotation_id": record["active_annotation_id"],
            },
            {
                "event_id": f"{paper_id}:publication-approval",
                "event_type": "publication_approval",
                "from": "verified",
                "to": "publication-approved",
                "at": record["ts"],
                "activity_id": f"{paper_id}:domain-review",
                "actor_ids": ["domain-expert"],
                "result": "approved",
                "note": "Freigabe erteilt.",
                "annotation_id": record["active_annotation_id"],
            },
        ]
    )

    errors = lifecycle.validate_document(migrated)

    assert any(
        "publication_approval requires a person publication_approval actor" in error
        for error in errors
    )


def test_validator_accepts_complete_domain_and_publication_path() -> None:
    migrated = lifecycle.migrate_v03_document(_pilot())
    paper_id, record = next(iter(migrated["decisions"].items()))
    provenance = record["provenance"]
    lifecycle_data = record["lifecycle"]
    provenance["actors"].extend(
        [
            {"id": "domain-expert", "type": "person", "roles": ["domain_expert"]},
            {
                "id": "publication-editor",
                "type": "person",
                "roles": ["publication_approval"],
            },
        ]
    )
    protocol = {
        "status": "recorded",
        "reference": "knowledge/update-protocol.md#1.1",
    }
    no_model = {"status": "not_applicable", "value": "not_applicable"}
    provenance["activities"].extend(
        [
            {
                "id": f"{paper_id}:domain-review",
                "type": "domain_expert_verification",
                "run_id": "domain-run",
                "method": "prism_domain_expert_verification",
                "prompt": protocol,
                "model": no_model,
                "associated_actor_ids": ["domain-expert"],
            },
            {
                "id": f"{paper_id}:publication-approval",
                "type": "publication_approval",
                "run_id": "publication-run",
                "method": "prism_publication_approval",
                "prompt": protocol,
                "model": no_model,
                "associated_actor_ids": ["publication-editor"],
            },
        ]
    )
    lifecycle_data["events"].extend(
        [
            {
                "event_id": f"{paper_id}:domain-review",
                "event_type": "domain_expert_verification",
                "from": "ai-agent-reviewed",
                "to": "verified",
                "at": record["ts"],
                "activity_id": f"{paper_id}:domain-review",
                "actor_ids": ["domain-expert"],
                "result": "accepted",
                "note": "Fachlich geprüft.",
                "annotation_id": record["active_annotation_id"],
            },
            {
                "event_id": f"{paper_id}:publication-approval",
                "event_type": "publication_approval",
                "from": "verified",
                "to": "publication-approved",
                "at": record["ts"],
                "activity_id": f"{paper_id}:publication-approval",
                "actor_ids": ["publication-editor"],
                "result": "approved",
                "note": "Freigabe erteilt.",
                "annotation_id": record["active_annotation_id"],
            },
        ]
    )
    lifecycle_data["state"] = "publication-approved"

    assert lifecycle.validate_document(migrated) == []


def test_validation_receipts_remain_separate_from_review_authority() -> None:
    migrated = lifecycle.migrate_v03_document(
        _pilot(), checked_at="2026-08-23T14:00:00+02:00"
    )

    assert lifecycle.validate_document(migrated) == []
    for record in migrated["decisions"].values():
        check = record["checks"][0]
        assert check["status"] == "passed"
        assert check["check_type"] == "lifecycle_contract"
        assert check["actor_id"] == "deterministic-validator"
        assert len(check["subject"]["sha256"]) == 64
        assert record["lifecycle"]["state"] == "ai-agent-reviewed"


def test_validator_rejects_a_validation_receipt_for_another_annotation_body() -> None:
    migrated = lifecycle.migrate_v03_document(
        _pilot(), checked_at="2026-08-23T14:00:00+02:00"
    )
    record = next(iter(migrated["decisions"].values()))
    record["checks"][0]["subject"]["sha256"] = "0" * 64

    errors = lifecycle.validate_document(migrated)

    assert any("does not match the annotation body" in error for error in errors)


def test_validator_accepts_correction_and_preserves_original_annotation() -> None:
    migrated = lifecycle.migrate_v03_document(_pilot())
    paper_id, record = next(
        (paper_id, record)
        for paper_id, record in migrated["decisions"].items()
        if record["decision"] == "Exclude"
    )
    original = deepcopy(record["annotations"][0])
    expert_id = "domain-expert"
    activity_id = f"{paper_id}:domain-review"
    record["provenance"]["actors"].append(
        {"id": expert_id, "type": "person", "roles": ["domain_expert"]}
    )
    record["provenance"]["activities"].append(
        {
            "id": activity_id,
            "type": "domain_expert_verification",
            "run_id": "domain-run",
            "method": "prism_domain_expert_verification",
            "prompt": {
                "status": "recorded",
                "reference": "knowledge/update-protocol.md#1.1",
            },
            "model": {"status": "not_applicable", "value": "not_applicable"},
            "associated_actor_ids": [expert_id],
        }
    )
    corrected = deepcopy(original["body"])
    corrected["reason"] = "Wrong_population"
    correction_id = f"{paper_id}:correction-1"
    record["annotations"].append(
        {
            "annotation_id": correction_id,
            "annotation_type": "domain_expert_correction",
            "supersedes": original["annotation_id"],
            "at": record["ts"],
            "actor_ids": [expert_id],
            "reason": "Der präzisere Ausschlussgrund ist belegt.",
            "changes": [
                {
                    "path": "/reason",
                    "before": original["body"]["reason"],
                    "after": corrected["reason"],
                }
            ],
            "body": corrected,
        }
    )
    for field, value in corrected.items():
        record[field] = deepcopy(value)
    record["active_annotation_id"] = correction_id
    record["lifecycle"]["events"].append(
        {
            "event_id": activity_id,
            "event_type": "domain_expert_verification",
            "from": "ai-agent-reviewed",
            "to": "verified",
            "at": record["ts"],
            "activity_id": activity_id,
            "actor_ids": [expert_id],
            "result": "corrected_and_accepted",
            "note": "Der präzisere Ausschlussgrund ist belegt.",
            "annotation_id": correction_id,
        }
    )
    record["lifecycle"]["state"] = "verified"

    assert lifecycle.validate_document(migrated) == []
    assert record["annotations"][0] == original
    assert record["annotations"][1]["supersedes"] == original["annotation_id"]


def test_validator_rejects_an_older_annotation_as_active() -> None:
    migrated = lifecycle.migrate_v03_document(_pilot())
    paper_id, record = next(
        (paper_id, record)
        for paper_id, record in migrated["decisions"].items()
        if record["decision"] == "Exclude"
    )
    original = deepcopy(record["annotations"][0])
    record["annotations"].append(
        {
            "annotation_id": f"{paper_id}:unselected-correction",
            "annotation_type": "domain_expert_correction",
            "supersedes": original["annotation_id"],
            "at": record["ts"],
            "actor_ids": ["legacy-curation"],
            "reason": "Testkorrektur.",
            "changes": [{"path": "/reason", "before": None, "after": "Other"}],
            "body": {**original["body"], "reason": "Other"},
        }
    )

    errors = lifecycle.validate_document(migrated)

    assert any("must reference the latest annotation" in error for error in errors)


def test_cli_migrates_then_validates(tmp_path: Path) -> None:
    output = tmp_path / "projected.json"

    assert lifecycle.main(["migrate", str(PILOT), str(output)]) == 0
    assert lifecycle.main(["validate", str(output)]) == 0
    assert (
        json.loads(output.read_text(encoding="utf-8"))["schema"] == lifecycle.SCHEMA_V05
    )
