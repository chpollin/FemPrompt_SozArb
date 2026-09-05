import copy
import json

import pytest

from src.analysis.build_completion_package import _work_rows, _historical_recovery_ris
from src.analysis.historical_resolution import load_resolution, load_source_holds, RESOLUTION_PATH
from src.assess.artifact_verification import artifact_hash, record_hash
from src.publish.serve import resolve_target


def fixture(repo):
    registry = {"record_index": {key: {"work_id": "work:one", "version_id": "version:one"} for key in ["A", "B"]},
                "works": [{"work_id": "work:one", "canonical_title": "A study", "preferred_version_id": "version:one"}]}
    human = [{"Zotero_Key": "A", "Decision": "Exclude", "Notes": "Wrong author"},
             {"Zotero_Key": "B", "Decision": "Include"}, {"Zotero_Key": "OLD", "Decision": "Include"}]
    (repo / "source.md").write_text("A supported source identity.\n", encoding="utf-8")
    attribution = {"agent_id": "/root/test", "model": "test-model", "reviewed_at": "2026-09-05T15:00:00Z",
                   "human_annotations_unchanged": True, "reason": "Publisher identifies this work.", "outcome": "resolved",
                   "evidence": [{"source_path": "source.md", "sha256": artifact_hash(repo, "source.md"),
                                 "source_url": "https://example.org/study", "locator": "title", "quote": "A supported source identity."}]}
    identity = {**copy.deepcopy(attribution), "record_id": "OLD", "historical_row_sha256": record_hash(human[2]),
                "target_work_id": "work:one", "target_version_id": "version:one", "target_record_ids": ["A", "B"]}
    work = {**copy.deepcopy(attribution), "work_id": "work:one", "record_ids": ["A", "B"],
            "round1_effective_decision": "Include", "resolution_kind": "administrative_metadata_disposition",
            "administrative_record_dispositions": [{"record_id": "A", "historical_row_sha256": record_hash(human[0]),
                 "kind": "metadata_error", "target_registry_binding": registry["record_index"]["A"], "target_work_id": "work:one"}]}
    data = {"schema": "femprompt-historical-resolution/0.1", "identity_resolutions": {"OLD": identity}, "work_resolutions": {"work:one": work}}
    save(repo, data)
    return registry, human, data


def save(repo, data):
    p = repo / RESOLUTION_PATH
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(data), encoding="utf-8")


def test_restores_real_historical_include_without_creating_zotero_record(tmp_path):
    registry, human, _ = fixture(tmp_path)
    before = copy.deepcopy(human)
    resolution = load_resolution(tmp_path, registry, human, set())
    rows, issues = _work_rows(registry, human, {}, {}, resolution)
    assert not issues and rows[0]["effective_decision"] == "Include"
    assert rows[0]["human_decisions"] == ["Exclude", "Include"]
    assert rows[0]["human_metadata_error_record_ids"] == ["A"]
    assert rows[0]["record_ids"] == ["A", "B"]
    assert rows[0]["human_record_ids"] == ["A", "B", "OLD"]
    assert human == before and "OLD" not in registry["record_index"]


def test_withdrawal_withholds_current_analysis_but_preserves_human_include(tmp_path):
    registry, human, data = fixture(tmp_path)
    work = data["work_resolutions"]["work:one"]
    work.update(integrity_hold=True, withhold_from_current_synthesis=True)
    save(tmp_path, data)
    resolution = load_resolution(tmp_path, registry, human, set())
    record = {"record_id": "B", "decision": "Include", "state": "ai-agent-reviewed", "analysis": {}, "undecidable": {}}
    rows, _ = _work_rows(registry, human, {"B": [record]}, {}, resolution)
    assert rows[0]["effective_decision"] == "Include" and not rows[0]["analysis_eligible"]
    assert rows[0]["conflicts"] == ["source_integrity_hold"]
    assert load_source_holds(tmp_path)["work:one"]["kind"] == "integrity_hold"


def test_changed_historical_row_or_target_requires_new_reconciliation(tmp_path):
    registry, human, _ = fixture(tmp_path)
    human[2]["Decision"] = "Exclude"
    with pytest.raises(ValueError, match="stale or ambiguous row"):
        load_resolution(tmp_path, registry, human, set())
    human[2]["Decision"] = "Include"
    registry["record_index"]["A"] = {"work_id": "work:foreign", "version_id": "version:foreign"}
    with pytest.raises(ValueError, match="target identity changed"):
        load_resolution(tmp_path, registry, human, set())


def test_source_change_invalidates_resolution_and_hold(tmp_path):
    registry, human, data = fixture(tmp_path)
    data["work_resolutions"]["work:one"]["withhold_from_current_synthesis"] = True
    save(tmp_path, data)
    (tmp_path / "source.md").write_text("Changed text", encoding="utf-8")
    with pytest.raises(ValueError, match="Stale historical"):
        load_resolution(tmp_path, registry, human, set())
    with pytest.raises(ValueError, match="Stale source hold"):
        load_source_holds(tmp_path)


def test_recovery_ris_contains_confirmed_metadata_and_no_invented_identity():
    unresolved = {"type": "unmapped_human_record", "record_id": "EMPTY"}
    confirmed = {"type": "unmapped_human_record", "record_id": "OLD", "identity_resolution": {
        "external_identity_confirmed": True, "external_identity": {"title": ["A recovered study"], "DOI": "10.1/test", "type": "journal-article", "author": [{"family": "Author", "given": "A."}], "published-print": {"date-parts": [[2024]]}},
        "agent_id": "/test", "model": "test-model", "reviewed_at": "2026-09-05T15:00:00Z"}}
    ris = _historical_recovery_ris([confirmed, unresolved])
    assert ris.count("TY  - ") == 1 and "DO  - 10.1/test" in ris
    assert "EMPTY" not in ris and "no new screening" in ris and "AU  - Author, A." in ris


def test_preview_serves_only_explicit_result_and_prism_roots(tmp_path):
    for name in ("build/site/index.html", "docs/index.html", "docs/prisma.html", "secret.txt"):
        p = tmp_path / name
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text("test", encoding="utf-8")
    assert resolve_target(tmp_path, "/") == tmp_path / "docs/index.html"
    assert resolve_target(tmp_path, "/prisma.html") == tmp_path / "docs/prisma.html"
    assert resolve_target(tmp_path, "/results/index.html") == tmp_path / "build/site/index.html"
    assert resolve_target(tmp_path, "/prism/prisma.html") == tmp_path / "docs/prisma.html"
    for url in ("/secret.txt", "/prism/../secret.txt", "/results/%2e%2e/%2e%2e/secret.txt", "/prism/C:/Windows/win.ini"):
        assert resolve_target(tmp_path, url) is None
