"""Tests for the self-contained 2026 Codex Websearch package."""

from src.analysis.build_codex_websearch_2026 import (
    REPO,
    _normalise_repository_download_url,
    build_outputs,
)


def test_package_is_2026_only_and_deduplicated() -> None:
    package, ris, _audit = build_outputs(REPO)

    assert package["counts"]["lane_tier_a_rows"] == 69
    assert package["counts"]["distinct_tier_a_candidates"] == 58
    assert len(package["records"]) == 58
    assert len({record["candidate_id"] for record in package["records"]}) == 58
    assert all(record["tier"] == "A" for record in package["records"])
    assert all(
        record["selected_version_date"].startswith("2026")
        for record in package["records"]
    )
    assert ris.count("TY  - ") == package["counts"]["import_ready"]
    assert ris.count("ER  -") == package["counts"]["import_ready"]


def test_package_preserves_identification_authority_boundary() -> None:
    package, _ris, _audit = build_outputs(REPO)

    assert package["zotero_target"] == {
        "library_name": "FemPrompt_SozArb",
        "group_id": "6080294",
        "import_status": "deferred_until_operator_at_desktop",
    }
    assert all(
        record["lifecycle_state"] == "identified"
        and record["screening_status"] == "identified_not_screened"
        for record in package["records"]
    )


def test_source_enrichment_partitions_every_candidate() -> None:
    package, _ris, audit = build_outputs(REPO)

    assert sum(item["records"] for item in package["source_enrichment_summaries"]) == 58
    assert {item["partition"] for item in package["source_enrichment_summaries"]} == {
        "A",
        "B",
        "C",
    }
    assert all(record.get("source_enrichment") for record in package["records"])
    assert audit["counts"]["fulltext_located"] >= 25


def test_elephant_correction_keeps_vor_and_preprint_distinct() -> None:
    package, _ris, _audit = build_outputs(REPO)
    record = next(
        item
        for item in package["records"]
        if item["candidate_id"] == "codex-websearch-2026:arxiv:2505.13995"
    )

    assert record["doi"] == "10.1126/science.aec8352"
    assert record["preferred_version"]["version_type"] == "version_of_record"
    assert record["preferred_version"]["landing_url"] == (
        "https://doi.org/10.1126/science.aec8352"
    )
    assert record["access"]["fulltext_url"] == "https://arxiv.org/pdf/2505.13995"
    preprint = next(
        version
        for version in record["versions"]
        if version["version_type"] == "preprint"
    )
    assert preprint["title"] == (
        "ELEPHANT: Measuring and understanding social sycophancy in LLMs"
    )
    assert "Lujain Ibrahim" in preprint["authors"]
    assert "Dyllan Han" in record["preferred_version"]["authors"]


def test_article_in_press_remains_an_accepted_manuscript() -> None:
    package, _ris, _audit = build_outputs(REPO)
    record = next(
        item
        for item in package["records"]
        if item["doi"] == "10.1007/s44155-026-00463-x"
    )

    assert record["publication_type"] == "journal_article"
    assert record["preferred_version"]["version_type"] == "accepted_manuscript"
    assert record["access"]["fulltext_url"].endswith("_reference.pdf")


def test_audit_reconciles_with_package_and_ris() -> None:
    package, ris, audit = build_outputs(REPO)

    assert audit["counts"]["distinct_tier_a_candidates"] == len(audit["records"])
    assert audit["counts"]["import_ready"] == ris.count("TY  - ")
    assert (
        audit["counts"]["new_in_codex_websearch"]
        + audit["counts"]["previously_identified"]
        == audit["counts"]["distinct_tier_a_candidates"]
    )
    assert all(not item["blocking_conflicts"] for item in audit["records"])


def test_zotero_matches_are_withheld_from_import_ris() -> None:
    package, ris, _audit = build_outputs(REPO)
    existing = [
        record
        for record in package["records"]
        if record["zotero_status"] == "already_in_committed_export"
    ]

    assert len(existing) == package["counts"]["already_in_committed_zotero_export"]
    assert all(record["matched_zotero_keys"] for record in existing)
    assert all(record["candidate_id"] not in ris for record in existing)


def test_repository_download_urls_use_the_direct_file_route() -> None:
    assert (
        _normalise_repository_download_url(
            "https://discovery.dundee.ac.uk/files/123/example.pdf"
        )
        == "https://discovery.dundee.ac.uk/ws/files/123/example.pdf"
    )
    assert (
        _normalise_repository_download_url(
            "https://kclpure.kcl.ac.uk/portal/files/123/example.pdf"
        )
        == "https://kclpure.kcl.ac.uk/ws/files/123/example.pdf"
    )
