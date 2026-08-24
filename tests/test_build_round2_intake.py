"""Integration tests for the committed round-two intake contract."""

from src.analysis.build_round2_intake import REPO, build_manifest, parse_ris


def test_committed_round2_intake_counts_and_gate() -> None:
    manifest = build_manifest(REPO)

    assert manifest["lane_counts"] == {"L1": 5, "L2": 8, "L3": 8, "L5": 8}
    assert manifest["counts"] == {
        "lane_records": 29,
        "distinct_candidate_works": 24,
        "duplicate_lane_records_collapsed": 5,
        "cross_round_matches": 0,
        "works_present_in_l1_l3": 19,
        "works_only_in_l5": 5,
        "works_with_l5_attribution": 8,
        "committed_zotero_records": 326,
        "candidate_works_with_existing_corpus_match": 1,
        "candidate_works_absent_from_committed_export": 23,
        "round2_zotero_keys_missing_from_committed_export": 21,
        "screening_ready_works": 0,
    }
    assert manifest["committed_state"]["mapping_only_keys_by_source"] == {
        "Claude": 8,
        "Gemini": 8,
        "OpenAI": 5,
    }
    assert manifest["gate"]["status"] == "blocked"


def test_round2_duplicate_lanes_remain_attributable() -> None:
    manifest = build_manifest(REPO)
    by_doi = {work["doi"]: work for work in manifest["works"]}

    assert by_doi["10.1038/s41467-025-68004-9"]["lanes"] == ["L2", "L3", "L5"]
    assert by_doi["10.1201/9781003585527-19"]["lanes"] == ["L1", "L2"]
    title_match = [
        work for work in manifest["works"] if work["existing_corpus_candidates"]
    ]
    assert len(title_match) == 1
    assert title_match[0]["existing_match_basis"] == "normalised_title_only"
    assert all(work["zotero_key"] is None for work in manifest["works"])
    assert all(work["screening_blockers"] for work in manifest["works"])


def test_each_committed_lane_ris_record_has_a_title() -> None:
    round2 = REPO / "corpus" / "deep-research" / "round2"
    for path in sorted(round2.glob("*_deep-research.ris")):
        records = parse_ris(path)
        assert records, path
        assert all(record.get("TI") or record.get("T1") for record in records), path
