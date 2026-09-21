"""Dataset-backed tests for the literature readiness inventory."""

import json

from src.analysis.build_literature_readiness import REPO, build_readiness


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
