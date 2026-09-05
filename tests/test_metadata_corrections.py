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
