"""Tests for append-only integration of governed AI-agent review products."""

from __future__ import annotations

import json
from copy import deepcopy
from pathlib import Path

import pytest

from src.assess import merge_ai_agent_product, screening_lifecycle


ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "docs" / "data" / "screening" / "ar2.json"
PRODUCT = (
    ROOT
    / "tests"
    / "review-cases"
    / "agent-runs"
    / "uncovered-sources-5-20260823"
    / "product-v0.5.json"
)


def _read(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def _premerge_base(product: dict) -> dict:
    base = _read(BASE)
    for paper_id in product["decisions"]:
        base["decisions"].pop(paper_id, None)
    base["review_runs"] = [
        run
        for run in base.get("review_runs", [])
        if run.get("run_id") != "uncovered-sources-5-20260823"
    ]
    return base


def test_merge_adds_six_records_for_five_work_assignments() -> None:
    product = _read(PRODUCT)
    base = _premerge_base(product)

    merged = merge_ai_agent_product.merge_documents(
        base,
        product,
        product_path=PRODUCT,
    )

    assert len(merged["decisions"]) == len(base["decisions"]) + 6
    assert merged["decisions"]["SSF5Q33W"]["alias_of"] == "8MRNK6FX"
    assert (
        merged["decisions"]["SSF5Q33W"]["work_id"]
        == (merged["decisions"]["8MRNK6FX"]["work_id"])
    )
    assert merged["review_runs"][-1]["run_id"] == "uncovered-sources-5-20260823"
    assert len(merged["review_runs"][-1]["work_ids"]) == 5
    assert screening_lifecycle.validate_document(merged) == []


def test_merge_is_idempotent() -> None:
    product = _read(PRODUCT)
    first = merge_ai_agent_product.merge_documents(
        _premerge_base(product),
        product,
        product_path=PRODUCT,
    )

    second = merge_ai_agent_product.merge_documents(
        first,
        product,
        product_path=PRODUCT,
    )

    assert second == first


def test_merge_refuses_divergent_existing_record() -> None:
    base = _read(BASE)
    product = _read(PRODUCT)
    base["decisions"]["UKKQKL7I"] = deepcopy(product["decisions"]["UKKQKL7I"])
    base["decisions"]["UKKQKL7I"]["alias_of"] = "DIFFERENT"

    with pytest.raises(ValueError, match="Refusing to overwrite divergent record"):
        merge_ai_agent_product.merge_documents(base, product, product_path=PRODUCT)


def _recode(tmp_path: Path) -> tuple[dict, dict, dict, Path]:
    from tests.test_screening_lifecycle import recode_fixture

    base, product, manifest = recode_fixture(tmp_path)
    path = tmp_path / "product-v0.5.json"
    path.write_text(json.dumps(product), encoding="utf-8")
    return base, product, manifest, path


def _merge(base: dict, product: dict, manifest: dict, path: Path) -> dict:
    return merge_ai_agent_product.merge_documents(
        base, product, product_path=path, run_manifest=manifest
    )


def test_merge_replaces_a_bound_recode_and_records_it(tmp_path: Path) -> None:
    from tests.test_screening_lifecycle import RECODE_RECORD, RECODE_RUN_ID

    base, product, manifest, path = _recode(tmp_path)
    merged = _merge(base, product, manifest, path)

    assert merged["decisions"][RECODE_RECORD] == product["decisions"][RECODE_RECORD]
    assert {k: v for k, v in merged["decisions"].items() if k != RECODE_RECORD} == {
        k: v for k, v in base["decisions"].items() if k != RECODE_RECORD
    }
    entry = next(run for run in merged["review_runs"] if run["run_id"] == RECODE_RUN_ID)
    assert entry["recoded_record_ids"] == [RECODE_RECORD]
    assert screening_lifecycle.validate_document(merged) == []
    assert _merge(merged, product, manifest, path) == merged


def test_merge_refuses_to_recode_a_verified_record(tmp_path: Path) -> None:
    from tests.test_screening_lifecycle import RECODE_RECORD

    base, product, manifest, path = _recode(tmp_path)
    record = base["decisions"][RECODE_RECORD]
    record["provenance"]["actors"].append(
        {"id": "domain-expert", "type": "person", "roles": ["domain_expert"]}
    )
    record["provenance"]["activities"].append(
        {
            "id": "domain-review",
            "type": "domain_expert_verification",
            "run_id": "domain-run",
            "method": "prism_domain_expert_verification",
            "prompt": {"status": "not_applicable", "value": "not_applicable"},
            "model": {"status": "not_applicable", "value": "not_applicable"},
            "associated_actor_ids": ["domain-expert"],
        }
    )
    record["lifecycle"]["events"].append(
        {
            "event_id": "domain-review",
            "event_type": "domain_expert_verification",
            "from": "ai-agent-reviewed",
            "to": "verified",
            "at": "2026-10-02T09:00:00.000Z",
            "activity_id": "domain-review",
            "actor_ids": ["domain-expert"],
            "result": "accepted",
            "annotation_id": record["active_annotation_id"],
        }
    )
    record["lifecycle"]["state"] = "verified"
    assert screening_lifecycle.validate_document(base) == []

    with pytest.raises(ValueError, match="Refusing to recode UKKQKL7I: its state .verified."):
        _merge(base, product, manifest, path)


def test_merge_refuses_a_recode_of_another_annotation(tmp_path: Path) -> None:
    from tests.test_screening_lifecycle import RECODE_RECORD

    base, product, manifest, path = _recode(tmp_path)
    record = base["decisions"][RECODE_RECORD]
    old_id, new_id = record["active_annotation_id"], "ar2:UKKQKL7I:renamed"
    record["active_annotation_id"] = record["provenance"]["annotation_id"] = new_id
    record["annotations"][0]["annotation_id"] = new_id
    for item in [*record["lifecycle"]["events"], *(c["subject"] for c in record["checks"])]:
        if item.get("annotation_id") == old_id:
            item["annotation_id"] = new_id
    assert screening_lifecycle.validate_document(base) == []

    with pytest.raises(ValueError, match="does not supersede the active annotation"):
        _merge(base, product, manifest, path)


def test_merge_refuses_a_tampered_history_prefix(tmp_path: Path) -> None:
    from tests.test_screening_lifecycle import RECODE_RECORD

    base, product, manifest, path = _recode(tmp_path)
    product["decisions"][RECODE_RECORD]["annotations"][0]["at"] = "2026-01-01T00:00:00.000Z"
    assert screening_lifecycle.validate_document(product) == []

    with pytest.raises(ValueError, match="exact record history"):
        _merge(base, product, manifest, path)


def test_merge_refuses_a_recode_bound_to_another_record_hash(tmp_path: Path) -> None:
    from tests.test_screening_lifecycle import RECODE_RECORD

    base, product, manifest, path = _recode(tmp_path)
    for paper in manifest["assignment"]["papers"]:
        if RECODE_RECORD in paper.get("recode_of", {}):
            paper["recode_of"][RECODE_RECORD]["record_sha256"] = "0" * 64

    with pytest.raises(ValueError, match="bound record hash differs"):
        _merge(base, product, manifest, path)


def test_merge_refuses_a_recode_the_manifest_does_not_bind(tmp_path: Path) -> None:
    from tests.test_screening_lifecycle import RECODE_RECORD

    base, product, manifest, path = _recode(tmp_path)
    for paper in manifest["assignment"]["papers"]:
        paper.pop("recode_of", None)

    with pytest.raises(ValueError, match="binds no recode"):
        _merge(base, product, manifest, path)
    del base["decisions"][RECODE_RECORD]
    with pytest.raises(ValueError, match="Refusing to recode absent record"):
        _merge(base, product, manifest, path)
