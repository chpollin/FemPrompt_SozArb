"""Tests for the dated contextual literature-update package."""

from src.analysis.build_contextual_update_package import REPO, build_package


def test_contextual_update_selects_only_tier_a_candidates() -> None:
    package, ris = build_package(REPO)

    assert package["counts"]["selected_records"] == 23
    assert package["counts"]["new_works"] == 22
    assert package["counts"]["new_versions_of_existing_works"] == 1
    assert len(package["records"]) == 23
    assert len({record["candidate_id"] for record in package["records"]}) == 23
    assert all(record["tier"] == "A" for record in package["records"])
    assert ris.count("TY  - ") == 23
    assert ris.count("ER  -") == 23


def test_original_window_is_preserved_as_record_metadata() -> None:
    package, _ris = build_package(REPO)

    assert package["original_round2_window"]["retrospectively_changed"] is False
    assert package["counts"]["before_original_window"] > 0
    assert package["counts"]["within_original_window"] > 0
    assert package["counts"]["after_original_window"] > 0
    assert all(
        record["original_round2_window_relation"]
        in {
            "before_original_window",
            "within_original_window",
            "after_original_window",
            "date_not_established",
        }
        for record in package["records"]
    )


def test_new_version_retains_relation_to_existing_work() -> None:
    package, ris = build_package(REPO)
    versions = [
        record
        for record in package["records"]
        if record["identity_status"] == "new_version_of_existing_work"
    ]

    assert len(versions) == 1
    assert (
        versions[0]["relation_to_existing_work"]
        == "work:7644e99b-9dd1-545f-af98-ab7fed6643e6"
    )
    assert versions[0]["relation_to_existing_work"] in ris


def test_generated_records_remain_unscreened_candidates() -> None:
    package, _ris = build_package(REPO)

    assert package["zotero_target"] == {
        "library_name": "FemPrompt_SozArb",
        "group_id": "6080294",
        "import_status": "not_imported",
    }
    assert all(
        record["lifecycle_state"] == "identified"
        and record["screening_status"] == "identified_not_screened"
        for record in package["records"]
    )
