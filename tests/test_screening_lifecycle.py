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
RESIDUAL_PRODUCT = (
    ROOT
    / "tests"
    / "review-cases"
    / "agent-runs"
    / "residual-source-8ng4zewe-20260826"
    / "product-v0.4.json"
)


def _pilot() -> dict[str, Any]:
    return json.loads(PILOT.read_text(encoding="utf-8"))


def test_migration_preserves_separate_ai_review_activity_provenance() -> None:
    source = json.loads(RESIDUAL_PRODUCT.read_text(encoding="utf-8"))
    migrated = lifecycle.migrate_v03_document(source)
    record = migrated["decisions"]["8NG4ZEWE"]
    screening, ai_review = record["provenance"]["activities"]

    assert screening["prompt"]["reference"] == "prompts/prism-agent-reviewer-v1.1.md"
    assert ai_review["prompt"]["reference"] == "prompts/prism-ai-agent-review-v0.2.md"
    assert ai_review["prompt"]["sha256"] == (
        "01ad06b333cbe3c9143df11ffea98618a80c2a07aff9f36f58d060fa9900c566"
    )
    assert ai_review["associated_actor_ids"] == [
        "residual-source-8ng4zewe-20260826-ai-agent-review"
    ]


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


# Frozen pre-recode state, since the productive track itself carries the recode of this record.
PRODUCTIVE = ROOT / "tests" / "fixtures" / "ar2-ukkqkl7i-before-recode.json"
RECODE_RUN_ID = "recode-test-20261002"
RECODE_RECORD = "UKKQKL7I"


def recode_fixture(
    tmp_path: Path, base: dict[str, Any] | None = None
) -> tuple[dict[str, Any], dict[str, Any], dict[str, Any]]:
    """Return base track, migrated recode product and run manifest for one 1.3 record.

    The recode reuses the reviewed product of the run that first coded the record,
    marked as codebook 1.4.1 under a new run, so only the recode contract varies.
    """
    from src.assess.artifact_verification import record_hash

    base = base or json.loads(PRODUCTIVE.read_text(encoding="utf-8"))
    existing = base["decisions"][RECODE_RECORD]
    binding = {
        "annotation_id": existing["active_annotation_id"],
        "record_sha256": record_hash(existing).removeprefix("sha256:"),
    }
    manifest = json.loads((NEW_PRODUCT.parent / "run.json").read_text(encoding="utf-8"))
    manifest["run_id"] = RECODE_RUN_ID
    manifest["codebook"] = {"path": "assessment/categories.yaml", "version": "1.4.1"}
    for paper in manifest["assignment"]["papers"]:
        if paper["paper_id"] == RECODE_RECORD:
            paper["ai_agent_review_coverage"] = True
            paper["recode_of"] = {RECODE_RECORD: binding}
    manifest_path = tmp_path / "run.json"
    manifest_path.write_text(json.dumps(manifest), encoding="utf-8")
    source = json.loads(NEW_PRODUCT.read_text(encoding="utf-8"))
    source["decisions"] = {RECODE_RECORD: source["decisions"][RECODE_RECORD]}
    record = source["decisions"][RECODE_RECORD]
    record["ts"] = "2026-10-02T10:00:00.000Z"
    record["analysis"]["codebook_version"] = "1.4.1"
    context = source["review_context"]
    context.update(
        run_id=RECODE_RUN_ID,
        run_manifest=manifest_path.as_posix(),
        ai_agent_reviewer_actor_id=f"{RECODE_RUN_ID}-ai-agent-review",
        recodes={RECODE_RECORD: binding},
    )
    for track in context["input_tracks"]:
        track["actor_id"] = f"{RECODE_RUN_ID}-{track['reviewer']}"
    product = lifecycle.migrate_v03_document(
        source, checked_at="2026-10-02T10:05:00.000Z", base=base
    )
    return base, product, manifest


def test_recode_appends_a_superseding_annotation_and_keeps_the_state(
    tmp_path: Path,
) -> None:
    base, product, _ = recode_fixture(tmp_path)
    existing = base["decisions"][RECODE_RECORD]
    record = product["decisions"][RECODE_RECORD]
    recode = record["annotations"][-1]

    assert lifecycle.validate_document(product) == []
    assert record["annotations"][:-1] == existing["annotations"]
    assert recode["annotation_type"] == "ai_agent_recode"
    assert recode["supersedes"] == existing["active_annotation_id"]
    assert recode["codebook_version"] == "1.4.1"
    assert "codebook 1.3" in recode["reason"]
    assert record["active_annotation_id"] == recode["annotation_id"]
    assert record["analysis"]["codebook_version"] == "1.4.1"
    assert record["lifecycle"]["state"] == "ai-agent-reviewed"
    assert record["lifecycle"]["events"][:-1] == existing["lifecycle"]["events"]
    event = record["lifecycle"]["events"][-1]
    assert (event["event_type"], event["from"], event["to"]) == (
        "ai_agent_recode",
        "ai-agent-reviewed",
        "ai-agent-reviewed",
    )
    assert record["checks"][:-1] == existing["checks"]
    assert record["checks"][-1]["subject"]["annotation_id"] == recode["annotation_id"]


def test_recode_refuses_a_verified_record(tmp_path: Path) -> None:
    base = json.loads(PRODUCTIVE.read_text(encoding="utf-8"))
    record = base["decisions"][RECODE_RECORD]
    record["lifecycle"]["events"].append(
        {"event_type": "domain_expert_verification", "from": "ai-agent-reviewed", "to": "verified"}
    )
    record["lifecycle"]["state"] = "verified"

    with pytest.raises(ValueError, match="refusing to recode"):
        recode_fixture(tmp_path, base)


def test_recode_refuses_a_binding_to_another_record_version(tmp_path: Path) -> None:
    base, product, manifest = recode_fixture(tmp_path)
    source = json.loads(NEW_PRODUCT.read_text(encoding="utf-8"))
    changed = deepcopy(base)
    changed["decisions"][RECODE_RECORD]["checks"].append(
        deepcopy(changed["decisions"][RECODE_RECORD]["checks"][0])
        | {"check_id": "later-check"}
    )
    source["decisions"] = {RECODE_RECORD: source["decisions"][RECODE_RECORD]}
    source["review_context"].update(
        run_id=RECODE_RUN_ID,
        run_manifest=(tmp_path / "run.json").as_posix(),
        recodes=manifest["assignment"]["papers"][0]["recode_of"],
    )

    with pytest.raises(ValueError, match="does not match the current record"):
        lifecycle.migrate_v03_document(source, base=changed)


def test_validator_requires_recode_event_and_superseded_annotation(
    tmp_path: Path,
) -> None:
    _, product, _ = recode_fixture(tmp_path)
    without_event = deepcopy(product)
    without_event["decisions"][RECODE_RECORD]["lifecycle"]["events"].pop()
    wrong_supersedes = deepcopy(product)
    wrong_supersedes["decisions"][RECODE_RECORD]["annotations"][-1]["supersedes"] = "ar2:other"

    assert any(
        "has no ai_agent_recode event" in error
        for error in lifecycle.validate_document(without_event)
    )
    assert any(
        "supersedes: must reference the preceding annotation" in error
        for error in lifecycle.validate_document(wrong_supersedes)
    )
