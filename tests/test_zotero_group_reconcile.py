"""Tests for the read-only Zotero group reconciliation. No network, no key."""

import json
import re
from pathlib import Path

import pytest

from src.acquire import zotero_group_reconcile as zgr
from src.acquire.zotero_group_reconcile import (
    DEFAULT_LANE_RIS,
    DEFAULT_RIS,
    ReadOnlyClient,
    ReconcileError,
    extract_year,
    library_from_api,
    library_from_export,
    load_ris,
    main,
    match_record,
    normalise_doi,
    normalise_title,
    reconcile,
)

FAKE_KEY = "k3yTHATmustNEVERappear0001"

# Every pyzotero method that issues POST, PUT, PATCH or DELETE.
WRITE_METHODS = (
    "create_items", "update_item", "update_items", "delete_item", "check_items",
    "create_collection", "create_collections", "update_collection", "update_collections",
    "delete_collection", "addto_collection", "deletefrom_collection",
    "add_tags", "delete_tags", "attachment_simple", "attachment_both", "upload_attachments",
    "set_fulltext", "saved_search", "delete_saved_search",
)


@pytest.mark.parametrize("raw", [
    "10.1086/726021",
    "https://doi.org/10.1086/726021",
    "http://dx.doi.org/10.1086/726021",
    "HTTPS://DOI.ORG/10.1086/726021",
    "doi:10.1086/726021",
    "  10.1086/ 726021. ",
    "https://doi.org/10.1086%2F726021",
])
def test_doi_normalisation_strips_prefix_case_whitespace_and_trailing_punctuation(raw):
    assert normalise_doi(raw) == "10.1086/726021"


@pytest.mark.parametrize("raw", ["", None, "n/a", "https://www.nber.org/papers/w34255", "10.1086"])
def test_doi_normalisation_rejects_values_that_are_no_doi(raw):
    assert normalise_doi(raw) == ""


def test_title_normalisation_covers_case_whitespace_punctuation_diacritics_and_markup():
    assert normalise_title("  Künstliche   Intelligenz: Maß & Mitte?  ") == "kunstliche intelligenz mass mitte"
    assert normalise_title("Toward Agency‐Centered\n   <scp>AI</scp>\n Literacy: A Scoping Review") == \
        "toward agency centered ai literacy a scoping review"
    assert normalise_title("Large Language Models’ Performance") == normalise_title("large language models' performance")
    assert normalise_title("Café_Society") == "cafe society"
    assert normalise_title("?!") == ""


def test_year_extraction():
    assert extract_year("2025/09/15") == "2025"
    assert extract_year("March 3, 1998") == "1998"
    assert extract_year("120251") == ""
    assert extract_year(None) == ""


def _item(key, title, date="", doi="", tags=(), collections=()):
    return zgr._library_item(key, 1, {"itemType": "journalArticle", "title": title, "date": date, "DOI": doi,
                                      "tags": [{"tag": t} for t in tags], "collections": list(collections)})


def _record(title, year="", doi=""):
    return {"index": 1, "title": title, "year": year, "doi": normalise_doi(doi)}


def test_doi_match_takes_precedence_and_title_needs_the_year():
    index = zgr._index([
        _item("AAAA1111", "Another title entirely", "2024", "https://doi.org/10.1000/ABC"),
        _item("BBBB2222", "Data Feminism for AI", "2024"),
        _item("CCCC3333", "Data feminism for AI!", "2023"),
    ])
    by_doi = match_record(_record("Data Feminism for AI", "2024", "doi:10.1000/abc"), index)
    assert by_doi["matches"] == [{"key": "AAAA1111", "matched_field": "doi"}]

    by_title = match_record(_record("DATA FEMINISM — for AI", "2024"), index)
    assert by_title["status"] == "present"
    assert by_title["matches"] == [{"key": "BBBB2222", "matched_field": "title_year"}]

    other_year = match_record(_record("Data Feminism for AI", "2022"), index)
    assert other_year["status"] == "absent"
    assert other_year["title_only_candidates"] == ["BBBB2222", "CCCC3333"]

    assert match_record(_record("Data Feminism for AI"), index)["status"] == "absent"


def test_author_names_play_no_part_in_matching():
    source = Path(zgr.__file__).read_text(encoding="utf-8")
    assert not re.search(r"creators|lastName|\"AU\"|'AU'", source)


def test_module_source_contains_no_write_call():
    source = Path(zgr.__file__).read_text(encoding="utf-8")
    for name in WRITE_METHODS:
        assert name not in source, name
    assert not re.search(r"\b(?:post|put|patch|delete)\s*\(", source, flags=re.IGNORECASE)
    assert "import requests" not in source and "urlopen" not in source and "http.client" not in source


def test_read_only_wrapper_blocks_every_write_method():
    class Client:
        def __getattr__(self, name):
            return lambda *args, **kwargs: name

    wrapped = ReadOnlyClient(Client())
    assert wrapped.items() == "items"
    for name in WRITE_METHODS:
        with pytest.raises(AttributeError):
            getattr(wrapped, name)


class FakeZotero:
    def __init__(self, access, fail_with=None):
        self.access, self.fail_with = access, fail_with

    def key_info(self):
        if self.fail_with:
            raise RuntimeError(self.fail_with)
        return {"key": FAKE_KEY, "userID": 1, "access": self.access}

    def last_modified_version(self):
        return 4711

    def everything(self, value):
        return value

    def items(self):
        return [
            {"key": "ITEM0001", "version": 12, "data": {
                "itemType": "journalArticle", "title": "Feminist AI Literacy", "date": "2026-01-05",
                "DOI": "10.1000/xyz", "tags": [{"tag": "Round two intake"}], "collections": ["COLL0001"]}},
            {"key": "NOTE0001", "version": 13, "data": {
                "itemType": "note", "parentItem": "ITEM0001", "note": "<p>L2: Bewertung hoch.</p><p>Other line</p>"}},
            {"key": "ATTA0001", "version": 14, "data": {"itemType": "attachment", "title": "PDF"}},
            {"key": None, "data": {}},
            "not an object",
        ]

    def collections(self):
        return [{"key": "COLL0001", "data": {"name": "Claude_deep-research", "parentCollection": "COLLPARENT"}},
                {"key": "COLL0002", "data": {"name": "Reading group", "parentCollection": False}}]


READ_ACCESS = {"groups": {"6080294": {"library": True, "write": False}}}


def test_live_path_reads_version_items_notes_and_lane_markers(tmp_path):
    library = library_from_api(FakeZotero(READ_ACCESS), "6080294")
    assert library["library_version"] == 4711
    assert [item["key"] for item in library["items"]] == ["ITEM0001"]
    assert len(library["invalid_items"]) == 2

    report = reconcile(library, [], run_date="2026-09-20", mode="live", mapping_path=tmp_path / "none.json")
    markers = report["lane_markers"]
    assert markers["collections"] == [{"key": "COLL0001", "name": "Claude_deep-research",
                                       "parent": "COLLPARENT", "item_keys": ["ITEM0001"]}]
    assert markers["tags"] == [{"tag": "Round two intake", "item_keys": ["ITEM0001"]}]
    assert markers["notes"] == [{"note_key": "NOTE0001", "parent_key": "ITEM0001",
                                 "marker_lines": ["L2: Bewertung hoch."]}]
    assert FAKE_KEY not in json.dumps(report)


@pytest.mark.parametrize("access", [
    {"groups": {"6080294": {"library": True, "write": True}}},
    {"groups": {"all": {"library": True, "write": True}}},
    {"user": {"library": True, "write": True}, "groups": {"6080294": {"library": True, "write": False}}},
])
def test_key_with_write_permission_is_refused(access):
    with pytest.raises(ReconcileError, match="write permission"):
        library_from_api(FakeZotero(access), "6080294")


def test_key_without_access_to_the_group_is_refused():
    with pytest.raises(ReconcileError, match="no read access"):
        library_from_api(FakeZotero({"groups": {"1": {"library": True, "write": False}}}), "6080294")


def test_key_never_reaches_output_even_when_the_api_error_quotes_it(tmp_path, monkeypatch, capsys):
    monkeypatch.setenv("ZOTERO_API_KEY", FAKE_KEY)
    monkeypatch.setattr(zgr, "load_env_file", lambda path=None: {})
    failing = FakeZotero(READ_ACCESS, fail_with=f"403 for https://api.zotero.org/keys/{FAKE_KEY}")
    monkeypatch.setattr(zgr, "_connect", lambda group, key: failing)

    assert main(["--date", "2026-09-20", "--out", str(tmp_path / "failed")]) == 1
    captured = capsys.readouterr()
    assert FAKE_KEY not in captured.out + captured.err
    assert "[redacted]" in captured.err

    monkeypatch.setattr(zgr, "_connect", lambda group, key: FakeZotero(READ_ACCESS))
    assert main(["--date", "2026-09-20", "--out", str(tmp_path / "live")]) == 0
    captured = capsys.readouterr()
    written = "".join(path.read_text(encoding="utf-8") for path in (tmp_path / "live").iterdir())
    assert FAKE_KEY not in captured.out + captured.err + written
    assert json.loads((tmp_path / "live" / "report.json").read_text(encoding="utf-8"))["library"]["library_version"] == 4711


def test_default_inputs_exist_in_the_repository():
    for path in (*DEFAULT_RIS, *DEFAULT_LANE_RIS):
        assert path.is_file(), path


def test_ris_loader_sets_aside_records_without_title_and_flags_unusable_doi(tmp_path):
    path = tmp_path / "sample.ris"
    path.write_text(
        "TY  - JOUR\nTI  - Toward Agency‐Centered\n      <scp>AI</scp>\n      Literacy\nPY  - 2025/03/01\n"
        "DO  - https://doi.org/10.1002/PRA2.1472\nN1  - FemPrompt-Candidate-ID: sample:1\nER  - \n\n"
        "TY  - JOUR\nAU  - Nobody, N.\nER  - \n\n"
        "TY  - GEN\nT1  - Second title\nDO  - see publisher page\nER  - \n", encoding="utf-8")
    loaded = load_ris(path, "import", repo=tmp_path)
    assert loaded["path"] == "sample.ris"
    assert [(r["index"], r["year"], r["doi"], r["candidate_id"]) for r in loaded["records"]] == \
        [(1, "2025", "10.1002/pra2.1472", "sample:1"), (3, "", "", None)]
    assert loaded["records"][1]["doi_unusable"] == "see publisher page"
    assert loaded["invalid_records"] == [{"index": 2, "reason": "record lacks TY or a usable title"}]
    with pytest.raises(ReconcileError):
        load_ris(tmp_path / "missing.ris", "import")


def test_offline_path_is_deterministic_and_needs_no_key(tmp_path, monkeypatch, capsys):
    monkeypatch.delenv("ZOTERO_API_KEY", raising=False)
    monkeypatch.setattr(zgr, "_connect", lambda *args: pytest.fail("offline mode must not connect"))
    monkeypatch.setattr(zgr, "load_env_file", lambda *args: pytest.fail("offline mode must not load the env file"))

    for name in ("first", "second"):
        assert main(["--date", "2026-09-20", "--offline", "--out", str(tmp_path / name)]) == 0
    capsys.readouterr()
    for filename in ("report.json", "report.md"):
        assert (tmp_path / "first" / filename).read_bytes() == (tmp_path / "second" / filename).read_bytes()
        assert b"\r\n" not in (tmp_path / "first" / filename).read_bytes()

    report = json.loads((tmp_path / "first" / "report.json").read_text(encoding="utf-8"))
    assert report["mode"] == "offline" and report["run_date"] == "2026-09-20"
    assert report["library"]["live"] is False
    export_keys = {entry["key"] for entry in json.loads(zgr.EXPORT_PATH.read_text(encoding="utf-8"))}
    assert {item["key"] for item in report["library"]["items"]} == export_keys
    assert [ris["path"] for ris in report["ris_files"] if ris["group"] == "import"] == \
        [path.relative_to(zgr.REPO).as_posix() for path in DEFAULT_RIS]
    for ris in report["ris_files"]:
        for record in ris["records"]:
            assert record["status"] in {"present", "absent"}
            assert (record["status"] == "present") == bool(record["matches"])
            assert all(match["key"] in export_keys and match["matched_field"] in {"doi", "title_year"}
                       for match in record["matches"])
    for group in report["library_duplicate_candidates"] + report["ris_overlap"]:
        assert len(group["members"]) > 1

    # A second run into the same folder must not overwrite the first report.
    assert main(["--date", "2026-09-20", "--offline", "--out", str(tmp_path / "first")]) == 1


def test_offline_library_lists_only_collections_the_export_uses():
    library = library_from_export()
    used = {key for item in library["items"] for key in item["collections"]}
    assert set(library["collections"]) == used


def test_date_is_required_and_validated(tmp_path):
    with pytest.raises(SystemExit):
        main(["--offline", "--out", str(tmp_path / "x")])
    with pytest.raises(SystemExit):
        main(["--date", "today", "--offline", "--out", str(tmp_path / "x")])
    source = Path(zgr.__file__).read_text(encoding="utf-8")
    assert "datetime" not in source and "time." not in source
