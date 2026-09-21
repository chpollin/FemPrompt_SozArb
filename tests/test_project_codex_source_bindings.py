"""Tests for the read-only Codex source binding projection."""

from src.acquire.project_codex_source_bindings import build_bindings


def test_binding_keeps_work_identity_and_version_authority_separate(tmp_path) -> None:
    readiness = {
        "records": [
            {
                "candidate_id": "doi-source",
                "doi": "10.1/example",
                "title": "Same work",
                "local_representation": {
                    "format": "pdf",
                    "source_sha256": "a" * 64,
                },
                "local_source_version": {
                    "version_type": "accepted_manuscript",
                    "date": "2026-01-01",
                },
                "screening_markdown_file": "source.md",
                "screening_markdown_sha256": "b" * 64,
                "screening_source_ready": True,
            },
            {
                "candidate_id": "title-source",
                "doi": None,
                "title": "Unique: Title!",
                "local_representation": {
                    "format": "pdf",
                    "source_sha256": "c" * 64,
                },
                "local_source_version": {
                    "version_type": "proceedings_version",
                    "date": "2026-02",
                },
            },
        ]
    }
    registry = {
        "identifier_index": {
            "doi:10.1/example": {"work_id": "work:1", "version_id": "version:1"}
        },
        "works": [
            {
                "work_id": "work:1",
                "canonical_title": "Same work",
                "preferred_version_id": "version:1",
                "versions": [
                    {
                        "version_id": "version:1",
                        "version_type": "version_of_record",
                        "version_date": "2026-01-01",
                        "identifiers": {"zotero_key": ["KEY1"]},
                    }
                ],
            },
            {
                "work_id": "work:2",
                "canonical_title": "Unique Title",
                "preferred_version_id": "version:2",
                "versions": [
                    {
                        "version_id": "version:2",
                        "version_type": "proceedings_version",
                        "version_date": "2026-02-03",
                        "identifiers": {"zotero_key": ["KEY2"]},
                    }
                ],
            },
        ],
    }

    markdown = tmp_path / "source.md"
    markdown.write_text("source text\n", encoding="utf-8")
    readiness["records"][0]["screening_markdown_file"] = "source.md"
    import hashlib

    readiness["records"][0]["screening_markdown_sha256"] = hashlib.sha256(
        markdown.read_bytes()
    ).hexdigest()
    projection = build_bindings(readiness, registry, repo=tmp_path)
    records = {item["candidate_id"]: item for item in projection["records"]}

    assert records["doi-source"]["work_id"] == "work:1"
    assert records["doi-source"]["zotero_keys"] == ["KEY1"]
    assert records["doi-source"]["binding_status"] == "work_bound_version_conflict"
    assert records["doi-source"]["markdown_hash_check"] == "match"
    assert records["title-source"]["binding_basis"] == "unique_normalized_title"
    assert records["title-source"]["binding_status"] == "work_and_version_bound"
