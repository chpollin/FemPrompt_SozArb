"""Integration tests for the agent-prepared round-two Zotero intake."""

from src.analysis.build_round2_intake_package import REPO, build_package


def test_package_classifies_every_candidate_once() -> None:
    package, ris = build_package(REPO)

    assert package["counts"]["candidates"] == 24
    assert len(package["records"]) == 24
    assert len({record["candidate_id"] for record in package["records"]}) == 24
    assert sum(
        package["counts"][status]
        for status in ("already_curated", "import_ready", "needs_review", "blocked")
    ) == 24
    assert ris.count("TY  - ") == package["counts"]["import_ready"]
    assert ris.count("ER  -") == package["counts"]["import_ready"]


def test_conflicts_never_enter_the_ris_package() -> None:
    package, ris = build_package(REPO)
    conflict_records = [
        record
        for record in package["records"]
        if "conflict" in record["agent_reviews"].values()
    ]

    assert conflict_records
    assert all(
        record["zotero_import_status"] in {"needs_review", "already_curated"}
        for record in conflict_records
    )
    assert all(record["work_id"] not in ris for record in conflict_records)


def test_every_asserted_version_remains_addressable() -> None:
    package, _ris = build_package(REPO)

    for record in package["records"]:
        version_ids = {
            version["version_id"] for version in record["available_versions"]
        }
        assert record["preferred_version"]["version_id"] in version_ids
        assert record["preferred_version"]["peer_review_status"] in {
            "peer_reviewed",
            "under_review",
            "not_peer_reviewed",
            "not_established",
        }


def test_mismatched_acl_source_is_withheld_from_ris() -> None:
    package, ris = build_package(REPO)
    record = next(
        item
        for item in package["records"]
        if item["candidate_id"]
        == "title:safety guardrails in large language models and selective refusal bias"
    )

    assert record["zotero_import_status"] == "needs_review"
    assert record["agent_reviews"]["identity"] == "conflict"
    assert record["agent_reviews"]["source"] == "ambiguous"
    assert record["title"] not in ris
