"""Tests for the PRISMA flow per identification source."""

import json
from pathlib import Path

import pytest

from src.replay import prisma_flow as flow_module

REPO = Path(__file__).resolve().parents[1]


@pytest.fixture(scope="module")
def flow():
    return flow_module.build_flow()


def test_round1_equals_committed_replay(flow) -> None:
    replay = json.loads(
        (REPO / "generated/benchmark-results/replay/flow_model.json").read_text(encoding="utf-8"))
    r1 = flow["sources"][0]
    replay.pop("provenance")
    assert r1["replay_flow_model"] == replay
    assert r1["identification"]["records_identified_library"] == replay["identification"]["identified_records"]
    assert r1["deduplication"]["duplicates_flagged_in_library"] == replay["identification"]["duplicates_flagged"]
    assert r1["screening"]["records_screened"] == replay["human_decisions"]["total"]
    assert r1["screening"]["included"] == replay["human_decisions"]["include"]
    assert r1["screening"]["records_excluded"] == replay["human_decisions"]["exclude"]
    assert r1["screening"]["reports_not_retrieved"] == (
        replay["human_exclusion_reasons"]["controlled_vocabulary"]["No_full_text"])
    reasons = r1["screening"]["exclusion_reasons"]
    assert sum(reasons.values()) + r1["screening"]["exclusions_without_reason"] == r1["screening"]["records_excluded"]


def test_round1_attribution_partitions_the_library(flow) -> None:
    ident = flow["sources"][0]["identification"]
    attributed = sum(ident["per_system_zotero_collection_records"].values())
    unattributed = sum(ident["records_without_system_attribution"].values())
    assert attributed + unattributed == ident["records_identified_library"]


def test_every_later_source_balances(flow) -> None:
    for block in flow["sources"][1:]:
        lanes = block["lanes"].values()
        assert block["records_identified"] == sum(lane["records_identified"] for lane in lanes)
        assert block["records_identified"] == (
            block["duplicates_within_lanes"] + block["duplicates_across_lanes"] + block["distinct_finds"])
        assert block["distinct_finds"] == (
            block["duplicates_of_earlier_sources"] + block["marked_ineligible_by_ai_agent"]
            + block["transferred_new_finds"])
        assert sum(block["outcome_of_transferred_finds"].values()) == block["transferred_new_finds"]


def test_selected_finds_match_package_declarations(flow) -> None:
    by_id = {block["source_id"]: block for block in flow["sources"]}
    packages = flow["package_crosscheck"]
    assert by_id["round2_deep_research"]["selected_finds_any_status"] == packages["round2_intake_package"]["candidates"]
    assert by_id["contextual_update_2026_08_24"]["selected_finds_any_status"] == (
        packages["contextual_intake_package"]["selected_records"])
    codex = by_id["codex_websearch_2026"]
    assert codex["selected_finds_any_status"] == packages["codex_websearch_package"]["distinct_tier_a_candidates"]
    assert codex["selected_finds_matching_any_earlier_record"] == (
        packages["codex_websearch_package"]["previously_identified"])


def test_current_state_partitions_records_and_works(flow) -> None:
    records = flow["current_state"]["records"]
    assert records["with_consolidated_expert_decision"] + records["open"] == records["library_records"]
    assert sum(records["open_by_origin"].values()) == records["open"]
    assert sum(records["open_round2_imports_by_import_source"].values()) == (
        records["open_by_origin"]["round2_identification_import"])
    works = flow["current_state"]["works"]
    assert sum(works["by_outcome"].values()) == works["works"]


def test_multiple_find_matrices_are_symmetric(flow) -> None:
    for scope, matrix in flow["multiple_finds"].items():
        if not isinstance(matrix, dict):
            continue
        names = matrix["systems"]
        for a in names:
            for b in names:
                assert matrix["matrix"][a][b] == matrix["matrix"][b][a], scope
        assert sum(matrix["finds_by_number_of_systems"].values()) == matrix["distinct_finds"]


def test_output_is_deterministic(flow) -> None:
    assert flow_module.render_outputs(flow) == flow_module.render_outputs(flow_module.build_flow())
    assert "generated_at" not in flow_module.render_outputs(flow)["prisma-flow.json"]


def test_identity_rule_links_doi_arxiv_and_title() -> None:
    records = [
        {"keys": flow_module.identity_keys(doi="https://doi.org/10.48550/arXiv.2404.17218v2")},
        {"keys": flow_module.identity_keys(arxiv="2404.17218", title="A Study")},
        {"keys": flow_module.identity_keys(doi="10.1000/X; 10.1000/y", title="a study!")},
        {"keys": flow_module.identity_keys(doi="10.1000/other", title="Another")},
    ]
    groups = flow_module.cluster(records)
    assert [len(group) for group in groups] == [3, 1]
    assert "doi:10.1000/y" in flow_module.identity_keys(doi=["10.1000/x", "10.1000/y"])


def test_aggregate_exclusions_are_not_records(tmp_path, monkeypatch) -> None:
    lane = {
        "candidates": [{"tier": "A", "title": "Kept", "doi": "10.1000/kept"},
                       {"tier": "B", "title": "Held", "doi": None}],
        "exclusions": [{"title": "All publications dated 2025 or earlier", "identifiers": {}, "reason": "x"},
                       {"title": "Rejected", "identifier": "10.1000/rejected", "reason": "y"}],
    }
    (tmp_path / "lane.json").write_text(json.dumps(lane), encoding="utf-8")
    monkeypatch.setattr(flow_module, "REPO", tmp_path)
    source = {"source_id": "s", "kind": "lane_json",
              "lanes": [{"lane_id": "X", "system": "test", "path": "lane.json"}]}
    records, notes = flow_module.load_lane_records(source)
    assert [r["status"] for r in records] == ["transferred", "tier_b", "excluded_by_ai_agent"]
    assert notes == {"X": {"aggregate_exclusion_entries_not_counted": 1}}
