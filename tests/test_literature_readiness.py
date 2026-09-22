"""Dataset-backed tests for the literature readiness inventory."""

import csv
import io
import json

import pytest

from src.analysis.build_literature_readiness import (
    REPO,
    _conversion_reviews,
    _csv_text,
    build_readiness,
)


def test_available_text_without_conversion_review_still_has_qc_gap() -> None:
    records = build_readiness(REPO)["records"]
    unchecked = [
        r for r in records if r["text_available"] and r["conversion_review"] is None
    ]
    assert unchecked
    assert all(
        "check_conversion_fidelity_against_original" in r["missing_steps"]
        for r in unchecked
    )
    checked = next(r for r in records if r["record_id"] == "AMYZFAPH")
    assert checked["conversion_review_result"] == "accepted_for_text_assessment"
    assert "check_conversion_fidelity_against_original" not in checked["missing_steps"]

    receipt_path = (
        REPO
        / "generated/source-acquisition/completion-20260921/conversion-qc/conversion-qc.json"
    )
    receipt = json.loads(receipt_path.read_text(encoding="utf-8"))
    receipt_record = next(
        record for record in receipt["records"] if record["record_id"] == "AMYZFAPH"
    )
    review = checked["conversion_review"]
    assert review["created_at"] == receipt["created_at"]
    assert review["reviewer"] == receipt["reviewer"]
    assert review["scope"] == receipt["scope"]
    for field in ("pdf_path", "pdf_sha256", "markdown_path", "markdown_sha256"):
        assert review[field] == receipt_record[field]


def test_conversion_review_rejects_changed_source_bytes(tmp_path) -> None:
    report = json.loads(
        (
            REPO
            / "generated/source-acquisition/completion-20260921/conversion-qc/conversion-qc.json"
        ).read_text(encoding="utf-8")
    )
    record = report["records"][0]
    path = tmp_path / record["markdown_path"]
    path.parent.mkdir(parents=True)
    path.write_text("Changed source representation", encoding="utf-8")
    receipt = tmp_path / "generated/source-acquisition/review/conversion-qc.json"
    receipt.parent.mkdir(parents=True)
    receipt.write_text(json.dumps({**report, "records": [record]}), encoding="utf-8")
    with pytest.raises(ValueError, match="Conversion review source changed"):
        _conversion_reviews(tmp_path)
    reviews, _paths = _conversion_reviews(tmp_path, set())
    assert reviews == {}, (
        "A superseded conversion cannot grant current review authority"
    )


def test_csv_preserves_conversion_review_evidence() -> None:
    payload = build_readiness(REPO)
    csv_records = {
        record["record_id"]: record
        for record in csv.DictReader(io.StringIO(_csv_text(payload)))
    }
    json_records = {record["record_id"]: record for record in payload["records"]}

    reviewed_id = "AMYZFAPH"
    assert (
        json.loads(csv_records[reviewed_id]["conversion_review"])
        == json_records[reviewed_id]["conversion_review"]
    )
    missing_id = next(
        record["record_id"]
        for record in payload["records"]
        if record["conversion_review"] is None
    )
    assert csv_records[missing_id]["conversion_review"] == ""


def test_inventory_covers_every_canonical_and_live_key_once() -> None:
    payload = build_readiness(REPO)
    records = payload["records"]
    record_ids = [record["record_id"] for record in records]
    live_ids = {key for record in records for key in record["live_zotero_ids"]}

    raw = json.loads((REPO / "corpus/zotero_export.json").read_text(encoding="utf-8"))
    sync = json.loads((REPO / "corpus/zotero_sync.json").read_text(encoding="utf-8"))
    assert set(record_ids) == {record["key"] for record in raw}
    assert len(record_ids) == len(set(record_ids))
    assert payload["counts"]["canonical_keys_exactly_once"] is True
    assert live_ids == set(sync["live_record_ids"])
    assert payload["counts"]["live_zotero_ids"] == len(live_ids)
    assert "optional_live_snapshot_ids" not in payload["counts"]
    assert payload["counts"]["unique_works"] < len(records)


def test_fulltext_reviewability_requires_canonical_version_binding() -> None:
    payload = build_readiness(REPO)
    fulltext_records = [
        record for record in payload["records"] if record["text_available"]
    ]

    assert fulltext_records
    assert all(
        not record["technical_reviewable"] or record["canonical_binding_matches"]
        for record in fulltext_records
        if record["abstract_quality"] != "usable"
    )


def test_unreviewed_knowledge_never_becomes_review_authority() -> None:
    payload = build_readiness(REPO)
    unreviewed = [
        record
        for record in payload["records"]
        if record["knowledge_authority"] in {"unreviewed", "preparation"}
    ]

    assert unreviewed
    assert all(
        "review_knowledge_document_before_authority_promotion"
        in record["missing_steps"]
        for record in unreviewed
    )


def test_readable_legacy_text_still_needs_exact_version_review() -> None:
    records = build_readiness(REPO)["records"]
    legacy = [r for r in records if r["source_identity_review"] == "legacy_candidate"]
    governed = [r for r in records if r["source_identity_review"] == "governed_binding"]
    assert legacy and governed
    assert all(
        "review_and_bind_exact_source_version" in r["missing_steps"] for r in legacy
    )
    assert all(
        "review_and_bind_exact_source_version" not in r["missing_steps"]
        for r in governed
    )


def test_long_knowledge_document_paths_use_extended_length_reads() -> None:
    payload = build_readiness(REPO)
    declared = [record for record in payload["records"] if record["knowledge_doc"]]

    assert declared
    assert all(record["knowledge_doc_exists"] for record in declared)
    assert all(record["knowledge_authority"] != "missing" for record in declared)


def test_reviewability_does_not_hide_missing_fulltext_or_knowledge_work() -> None:
    payload = build_readiness(REPO)
    nber = next(
        record for record in payload["records"] if record["record_id"] == "BHXDU7VM"
    )

    for record in payload["records"]:
        if not record["knowledge_doc"]:
            assert "create_source_bound_knowledge_document" in record["missing_steps"]
    assert "acquire_canonical_version_fulltext" not in nber["missing_steps"]
    abstract_only = next(
        record
        for record in payload["records"]
        if record["technical_reviewable"]
        and not record["text_available"]
        and record["abstract_quality"] == "usable"
    )
    assert "acquire_canonical_version_fulltext" in abstract_only["missing_steps"]


def test_readable_sources_do_not_erase_existing_scholarly_holds() -> None:
    payload = build_readiness(REPO)
    held = [record for record in payload["records"] if record["source_hold"]]
    assert held
    assert all(record["source_hold_reason"] for record in held)
    assert all(
        "resolve_recorded_source_hold_before_synthesis" in record["missing_steps"]
        for record in held
    )
