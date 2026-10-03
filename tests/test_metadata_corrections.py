import copy
import json

import pytest

from src.analysis.metadata_corrections import apply_metadata_corrections, corrected_csv_metadata
from src.assess.artifact_verification import artifact_hash, record_hash


def fixture(repo):
    (repo / "corpus").mkdir()
    (repo / "evidence.md").write_text("Publisher identity: Correct Author, 2025.\n", encoding="utf-8")
    items = [{"key": "P1", "title": "A title", "date": "2024", "DOI": "10.1/old"}]
    correction = {
        "record_id": "P1", "base_sha256": record_hash(items[0]),
        "agent_id": "/root/test", "model": "test-model", "reviewed_at": "2026-09-05T15:00:00Z",
        "authority": "ai-source-reviewed-metadata", "findings": "Publisher corrects year and DOI.",
        "evidence": [{"source_path": "evidence.md", "sha256": artifact_hash(repo, "evidence.md"),
                      "source_url": "https://example.org/paper", "locator": "publication details"}],
        "changes": [{"field": "date", "before": "2024", "after": "2025", "reason": "Published in 2025"},
                    {"field": "DOI", "before": "10.1/old", "after": "10.1/new", "reason": "Correct identifier"}],
    }
    data = {"schema": "femprompt-metadata-corrections/0.1", "corrections": [correction]}
    (repo / "corpus/zotero_export.json").write_text(json.dumps(items), encoding="utf-8")
    save(repo, data)
    return items, data


def save(repo, data):
    (repo / "corpus/metadata_corrections.json").write_text(json.dumps(data), encoding="utf-8")


def test_projects_consistent_metadata_without_rewriting_export(tmp_path):
    items, _ = fixture(tmp_path)
    original = copy.deepcopy(items)
    exported = (tmp_path / "corpus/zotero_export.json").read_bytes()
    result = apply_metadata_corrections(tmp_path, items)
    assert result[0]["date"] == "2025" and result[0]["DOI"] == "10.1/new"
    assert result[0]["_metadata_correction"]["authority"] == "ai-source-reviewed-metadata"
    csv = corrected_csv_metadata(tmp_path, {"P1": {"Year": "2024", "DOI": "10.1/old", "Abstract": "Keep me"}})
    assert csv["P1"]["Year"] == "2025" and csv["P1"]["DOI"] == "10.1/new"
    assert csv["P1"]["Abstract"] == "Keep me"
    assert items == original
    assert exported == (tmp_path / "corpus/zotero_export.json").read_bytes()


def test_new_export_or_changed_evidence_invalidates_correction(tmp_path):
    items, _ = fixture(tmp_path)
    items[0]["title"] = "A revised title"
    with pytest.raises(ValueError, match="Stale metadata correction"):
        apply_metadata_corrections(tmp_path, items)
    items[0]["title"] = "A title"
    (tmp_path / "evidence.md").write_text("Different source", encoding="utf-8")
    with pytest.raises(ValueError, match="Stale metadata evidence"):
        apply_metadata_corrections(tmp_path, items)


@pytest.mark.parametrize("mutation,match", [
    (lambda c: c.update(agent_id=""), "lacks agent_id"),
    (lambda c: c.update(reviewed_at="2026-09-05T15:00:00"), "timezone"),
    (lambda c: c.update(authority="verified"), "authority"),
    (lambda c: c["changes"][0].update(field="key"), "Unsupported"),
    (lambda c: c["changes"][0].update(before="2023"), "base field"),
    (lambda c: c["evidence"][0].update(source_path="../outside.md"), "escapes"),
])
def test_rejects_unattributed_or_unbound_metadata_changes(tmp_path, mutation, match):
    items, data = fixture(tmp_path)
    mutation(data["corrections"][0])
    save(tmp_path, data)
    with pytest.raises(ValueError, match=match):
        apply_metadata_corrections(tmp_path, items)



@pytest.mark.parametrize("field,value,item_type", [
    ("proceedingsTitle", "Proceedings of the 2025 CHI Conference on Human Factors in Computing Systems", "conferencePaper"),
    ("institution", "Global Partnership on AI", "report"),
    ("university", "Portland State University", "thesis"),
])
def test_native_container_correction_reaches_csv_and_registry(tmp_path, field, value, item_type):
    from src.analysis.build_work_version_registry import _version_from_zotero

    items, data = fixture(tmp_path)
    items[0]["itemType"] = item_type
    correction = data["corrections"][0]
    correction["base_sha256"] = record_hash(items[0])
    correction["changes"] = [
        {"field": field, "before": None, "after": value, "reason": "Primary bibliographic container"}
    ]
    (tmp_path / "corpus/zotero_export.json").write_text(json.dumps(items), encoding="utf-8")
    save(tmp_path, data)
    corrected = apply_metadata_corrections(tmp_path, items)[0]
    assert corrected[field] == value
    assert "publicationTitle" not in corrected
    assert items[0].get(field) is None
    assert corrected_csv_metadata(tmp_path, {})["P1"]["Journal"] == value
    assert _version_from_zotero(corrected)["journal_or_repository"] == value


@pytest.mark.parametrize("field,value", [("volume", "12"), ("issue", "1"), ("pages", "7874-7900")])
def test_native_citation_extent_preserves_hash_bound_before_value(tmp_path, field, value):
    items, data = fixture(tmp_path)
    data["corrections"][0]["changes"] = [
        {"field": field, "before": None, "after": value, "reason": "Registered citation extent"}
    ]
    save(tmp_path, data)
    assert apply_metadata_corrections(tmp_path, items)[0][field] == value
    assert field not in items[0]
    data["corrections"][0]["changes"][0]["before"] = value
    save(tmp_path, data)
    with pytest.raises(ValueError, match="base field"):
        apply_metadata_corrections(tmp_path, items)



@pytest.mark.parametrize("item_type,field,value", [
    ("preprint", "repository", "arXiv"),
    ("conferencePaper", "proceedingsTitle", "Proceedings of the 2025 CHI Conference on Human Factors in Computing Systems"),
    ("report", "institution", "Global Partnership on AI"),
    ("thesis", "university", "Portland State University"),
])
def test_type_specific_container_overrides_preserved_legacy_field(tmp_path, item_type, field, value):
    from src.analysis.build_work_version_registry import _version_from_zotero

    items, data = fixture(tmp_path)
    items[0].update(itemType="journalArticle", publicationTitle="arXiv preprint")
    items[0][field] = value
    correction = data["corrections"][0]
    correction["base_sha256"] = record_hash(items[0])
    correction["changes"] = [
        {"field": "itemType", "before": "journalArticle", "after": item_type,
         "reason": "Selected source expression determines the bibliographic type"}
    ]
    (tmp_path / "corpus/zotero_export.json").write_text(json.dumps(items), encoding="utf-8")
    save(tmp_path, data)
    corrected = apply_metadata_corrections(tmp_path, items)[0]
    assert corrected["publicationTitle"] == "arXiv preprint"
    assert corrected_csv_metadata(tmp_path, {"P1": {"Journal": "arXiv preprint"}})["P1"]["Journal"] == value
    assert _version_from_zotero(corrected)["journal_or_repository"] == value


def test_corrected_authors_preserve_csv_family_first_source_resolution(tmp_path):
    from src.publish.build_fulltext import author_year_key, first_author_surname

    items, data = fixture(tmp_path)
    data["corrections"][0]["changes"] = [{
        "field": "creators", "before": None,
        "after": [
            {"creatorType": "author", "firstName": "Dialekti Athina", "lastName": "Voutyrakou"},
            {"creatorType": "author", "firstName": "Constantine", "lastName": "Skordoulis"},
        ],
        "reason": "Expanded author names from the 3XMBE43Z publication byline",
    }]
    save(tmp_path, data)
    authors = corrected_csv_metadata(tmp_path, {})["P1"]["Authors"]
    assert authors == "Voutyrakou, Dialekti Athina; Skordoulis, Constantine"
    assert first_author_surname(authors) == "voutyrakou"
    assert author_year_key({"legacy_author_year": authors.split(";", 1)[0] + " (2025)"}) == "voutyrakou2025"
