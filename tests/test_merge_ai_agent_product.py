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
        _read(BASE),
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
