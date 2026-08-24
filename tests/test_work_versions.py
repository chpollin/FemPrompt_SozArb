"""Tests for the canonical Work-Version registry and selection contract."""

from __future__ import annotations

from copy import deepcopy

import pytest

from src.analysis.build_work_version_registry import REPO, build_registry
from src.analysis.work_versions import (
    load_contract,
    select_version_ids,
    validate_registry,
)


def _version(
    version_id: str,
    version_type: str,
    version_date: str,
    integrity_status: str = "current",
) -> dict[str, object]:
    return {
        "version_id": version_id,
        "version_type": version_type,
        "version_date": version_date,
        "integrity_status": integrity_status,
        "peer_review_status": "not_established",
        "peer_review_basis": "unknown",
        "relations": [],
    }


def test_preferred_version_uses_stage_while_latest_uses_date() -> None:
    contract = load_contract()
    versions = [
        _version("version:preprint", "preprint", "2026-03-01"),
        _version("version:record", "version_of_record", "2025-12-01"),
    ]

    latest, preferred = select_version_ids(versions, contract)

    assert latest == "version:preprint"
    assert preferred == "version:record"


def test_retracted_version_is_not_preferred() -> None:
    contract = load_contract()
    versions = [
        _version(
            "version:retracted",
            "enhanced_version_of_record",
            "2026-03-01",
            "retracted",
        ),
        _version("version:accepted", "accepted_manuscript", "2025-12-01"),
    ]

    latest, preferred = select_version_ids(versions, contract)

    assert latest == "version:retracted"
    assert preferred == "version:accepted"


def test_committed_registry_covers_zotero_and_round2_inputs() -> None:
    registry = build_registry(REPO)

    assert registry["counts"]["zotero_records"] == 326
    assert registry["counts"]["round2_candidates"] == 24
    assert len(registry["record_index"]) == 326
    assert len(registry["candidate_index"]) == 24
    assert all(work["preferred_version_id"] for work in registry["works"])


def test_registry_validation_rejects_unknown_version_type() -> None:
    registry = build_registry(REPO)
    broken = deepcopy(registry)
    broken["works"][0]["versions"][0]["version_type"] = "invented"

    with pytest.raises(ValueError, match="unknown version_type"):
        validate_registry(broken, load_contract())


def test_version_relations_resolve_within_one_work() -> None:
    registry = build_registry(REPO)
    all_version_ids: list[str] = []
    related_multi_version_works = 0

    for work in registry["works"]:
        versions = work["versions"]
        version_ids = {version["version_id"] for version in versions}
        all_version_ids.extend(version_ids)
        if len(versions) > 1 and any(version["relations"] for version in versions):
            related_multi_version_works += 1
        for version in versions:
            for relation in version["relations"]:
                assert relation["target_version_id"] in version_ids
                assert relation["target_version_id"] != version["version_id"]

    assert len(all_version_ids) == len(set(all_version_ids))
    assert related_multi_version_works > 0


def test_registry_keeps_preprint_and_version_of_record_as_distinct_versions() -> None:
    registry = build_registry(REPO)
    version_type_sets = [
        {version["version_type"] for version in work["versions"]}
        for work in registry["works"]
    ]

    assert any(
        "preprint" in version_types and "version_of_record" in version_types
        for version_types in version_type_sets
    )
