import pytest

from src.assess import prepare_coding_run


def setup(tmp_path, monkeypatch):
    monkeypatch.setattr(prepare_coding_run, "ROOT", tmp_path)
    monkeypatch.setattr(prepare_coding_run, "codebook_version", lambda: "1.4.1")
    text = tmp_path / "docs" / "data" / "fulltext"
    text.mkdir(parents=True)
    (text / "P1.md").write_text("Full text.\n", encoding="utf-8")
    registry = {
        "record_index": {
            "P1": {"work_id": "work:w", "version_id": "version:pref"},
            "P2": {"work_id": "work:w", "version_id": "version:other"},
        },
        "works": [{"work_id": "work:w", "versions": [{"version_id": "version:pref", "version_type": "preprint"}]}],
    }
    works = {"work:w": {"work_id": "work:w", "effective_decision": "Include", "preferred_version_id": "version:pref",
                        "record_ids": ["P1", "P2"], "title": "A work", "decision_authority": "legacy_human"}}
    return registry, works


def test_records_of_another_version_are_no_aliases(tmp_path, monkeypatch):
    registry, works = setup(tmp_path, monkeypatch)
    entry = prepare_coding_run.paper_entry("P1", registry, works, {})
    assert entry["record_ids"] == ["P1"]


def test_work_with_coding_on_another_version_is_refused(tmp_path, monkeypatch):
    registry, works = setup(tmp_path, monkeypatch)
    with pytest.raises(SystemExit, match="another Version"):
        prepare_coding_run.paper_entry("P1", registry, works, {"P2": {}}, recode=True)
