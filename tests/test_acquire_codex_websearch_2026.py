"""Tests for bounded Codex Websearch 2026 source acquisition."""

from src.acquire.acquire_codex_websearch_2026 import (
    REPO,
    _download_eligibility,
    _existing_result,
    _source_filename,
    _valid_pdf,
    build_plan,
)


def test_plan_covers_every_candidate_once() -> None:
    plan = build_plan(REPO)

    assert plan["counts"]["candidates"] == 58
    assert len(plan["records"]) == 58
    assert len({item["candidate_id"] for item in plan["records"]}) == 58
    assert (
        plan["counts"]["download_eligible"]
        <= plan["counts"]["with_recorded_source_url"]
    )
    assert plan["source_recovery"] is not None
    assert plan["counts"]["with_recovery_option"] == 14


def test_plan_separates_preferred_and_acquired_version() -> None:
    plan = build_plan(REPO)
    elephant = next(
        item
        for item in plan["records"]
        if item["candidate_id"] == "codex-websearch-2026:arxiv:2505.13995"
    )

    assert elephant["preferred_version_type"] == "version_of_record"
    assert elephant["source_version"]["version_type"] == "preprint"
    assert elephant["source_version"]["title"].startswith("ELEPHANT:")
    assert "Lujain Ibrahim" in elephant["source_version"]["authors"]
    assert (
        elephant["source_version"]["relation_to_preferred"]
        == "alternative_recorded_version"
    )

    mdpi = next(
        item
        for item in plan["records"]
        if item["candidate_id"] == "codex-websearch-2026:doi:10.3390/ai7010024"
    )
    assert [
        option["source_version"]["version_type"] for option in mdpi["source_options"]
    ] == [
        "version_of_record",
        "preprint",
    ]
    assert mdpi["source_options"][0]["source_version"]["relation_to_preferred"] == (
        "preferred_version"
    )

    springer = next(
        item
        for item in plan["records"]
        if item["candidate_id"] == "codex-websearch-2026:doi:10.1007/s44155-026-00463-x"
    )
    recovered = next(
        option for option in springer["source_options"] if option["source_recovery"]
    )
    assert recovered["source_version"]["version_type"] == "accepted_manuscript"
    assert recovered["source_version"]["relation_to_preferred"] == ("preferred_version")


def test_download_gate_requires_confirmed_open_https_source() -> None:
    assert _download_eligibility(
        {
            "access": {
                "status": "open_access",
                "fulltext_url": "https://example.org/paper.pdf",
            }
        }
    ) == (True, "confirmed_open_fulltext_url")
    assert _download_eligibility(
        {
            "access": {
                "status": "publisher_access",
                "fulltext_url": "https://example.org/paper.pdf",
            }
        }
    ) == (False, "access_not_confirmed_open")
    assert _download_eligibility(
        {
            "access": {
                "status": "open_access",
                "fulltext_url": "http://example.org/paper.pdf",
            }
        }
    ) == (False, "fulltext_url_not_https")


def test_pdf_validation_rejects_html_and_truncation() -> None:
    valid_pdf = b"%PDF-1.7\n" + (b"x" * 3_000) + b"\n%%EOF"

    assert _valid_pdf(valid_pdf) == (True, "valid_pdf_container")
    assert _valid_pdf(b"<html>" + (b"x" * 3_000)) == (
        False,
        "response_is_not_pdf",
    )
    assert _valid_pdf(b"%PDF-1.7\n" + (b"x" * 3_000)) == (
        False,
        "pdf_eof_marker_missing",
    )


def test_candidate_filename_is_stable_and_filesystem_safe() -> None:
    candidate_id = "codex-websearch-2026:doi:10.1000/example"

    assert _source_filename(candidate_id) == _source_filename(candidate_id)
    assert _source_filename(candidate_id).endswith(".pdf")
    assert len(_source_filename(candidate_id)) == 24


def test_existing_result_refreshes_version_metadata_without_changing_source(
    tmp_path,
) -> None:
    pdf = tmp_path / "source.pdf"
    pdf.write_bytes(b"%PDF-1.7\n" + (b"x" * 3_000) + b"\n%%EOF")
    item = {
        "source_url": "https://example.org/vor.pdf",
        "source_version": {"version_type": "version_of_record"},
        "source_options": [
            {
                "url": "https://example.org/preprint.pdf",
                "source_version": {
                    "version_type": "preprint",
                    "title": "Version-specific title",
                },
            }
        ],
    }
    previous = {
        "source_url": "https://example.org/preprint.pdf",
        "source_version": {"version_type": "preprint"},
    }

    result = _existing_result(item, pdf, previous)

    assert result is not None
    assert result["source_url"] == "https://example.org/preprint.pdf"
    assert result["source_version"]["title"] == "Version-specific title"
