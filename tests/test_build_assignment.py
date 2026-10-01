"""Regressions for the append-only split of open PRISM papers."""

import json
from collections import Counter

import pytest

from src.assess import build_assignment as assignment


def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value), encoding="utf-8")


def corpus(tmp_path, papers, agent=(), human=None):
    write(tmp_path / "docs/data/research_vault_v2.json", {"papers": papers})
    write(
        tmp_path / "docs/data/screening/ar2.json",
        {
            "schema": "femprompt-prisma-reviewer/0.5",
            "reviewer": "ar2",
            "actor": "agent",
            "decisions": {pid: {"decision": "Include"} for pid in agent},
        },
    )
    if human is not None:
        write(tmp_path / "docs/data/screening/cp.json", human)


def persist(tmp_path, document):
    write(tmp_path / "docs/data/screening/assignment.json", document)


def test_open_papers_alternate_within_each_kind(tmp_path):
    papers = [{"id": f"P{i}"} for i in range(9)]
    papers[0]["human"] = {"decision": "Include"}
    papers[1]["human"] = {"decision": "Exclude"}
    papers[2]["human"] = {"decision": None}
    corpus(
        tmp_path,
        papers,
        agent=("P3", "P5", "P8"),
        human={
            "schema": "femprompt-prisma-reviewer/0.5",
            "reviewer": "cp",
            "actor": "human",
            "decisions": {"P4": {"decision": "Exclude"}},
            "verifications": [{"paper_id": "P5", "result": "accepted", "event": {"event_id": "e"}}],
        },
    )
    document, added = assignment.build(tmp_path, "2026-10-01")
    # done: expert decisions P0, P1; own record P4; own verification P5
    assert list(document["assignments"]) == ["P2", "P3", "P6", "P7", "P8"]
    assert {pid: added[pid] for pid in ("P3", "P8")} == {"P3": "sabine", "P8": "susi"}
    # the unassessed stratum starts with the reviewer holding fewer entries (a tie)
    assert [added[pid] for pid in ("P2", "P6", "P7")] == ["sabine", "susi", "sabine"]
    assert document["assigned_on"] == "2026-10-01"
    assert [r["key"] for r in document["reviewers"]] == ["sabine", "susi"]


def test_rerun_is_idempotent_and_append_only(tmp_path):
    papers = [{"id": f"P{i}"} for i in range(4)]
    corpus(tmp_path, papers, agent=("P1",))
    first, _ = assignment.build(tmp_path, "2026-10-01")
    persist(tmp_path, first)
    again, added = assignment.build(tmp_path, "2026-10-05")
    assert added == {} and again == first

    # P0 becomes done, P4 is new and open, P1 was swapped by hand and stays so
    papers[0]["human"] = {"decision": "Include"}
    papers.append({"id": "P4"})
    first["assignments"]["P1"] = "susi"
    persist(tmp_path, first)
    corpus(tmp_path, papers, agent=("P1",))
    later, added = assignment.build(tmp_path, "2026-10-07")
    assert later["assignments"]["P0"] == first["assignments"]["P0"]
    assert later["assignments"]["P1"] == "susi"
    assert list(added) == ["P4"]
    assert later["assigned_on"] == "2026-10-01" and later["updated_on"] == "2026-10-07"
    counts = Counter(later["assignments"].values())
    assert abs(counts["sabine"] - counts["susi"]) <= 1


def test_unknown_reviewer_in_existing_file_is_refused(tmp_path):
    corpus(tmp_path, [{"id": "P0"}])
    persist(tmp_path, {"schema": assignment.SCHEMA, "assignments": {"P0": "xy"}})
    with pytest.raises(ValueError):
        assignment.build(tmp_path, "2026-10-01")


def test_committed_file_is_current_and_balanced():
    document, added = assignment.build(assignment.REPO, "2026-10-01")
    assert added == {}, "rerun src.assess.build_assignment"
    committed = json.loads(
        (assignment.REPO / "docs/data/screening/assignment.json").read_text(encoding="utf-8")
    )
    assert committed == document
    counts = Counter(committed["assignments"].values())
    assert abs(counts["sabine"] - counts["susi"]) <= 1
