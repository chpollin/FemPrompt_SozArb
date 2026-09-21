"""Integration tests for the committed round-two intake contract."""

import json

from src.analysis.build_round2_intake import REPO, build_manifest, parse_ris


def test_committed_round2_intake_counts_and_gate() -> None:
    manifest = build_manifest(REPO)
    zotero_records = json.loads(
        (REPO / "corpus" / "zotero_export.json").read_text(encoding="utf-8")
    )

    assert manifest["lane_counts"] == {"L1": 5, "L2": 8, "L3": 8, "L5": 8}
    assert manifest["counts"] == {
        "lane_records": 29,
        "distinct_candidate_works": 24,
        "duplicate_lane_records_collapsed": 5,
        "cross_round_matches": 0,
        "works_present_in_l1_l3": 19,
        "works_only_in_l5": 5,
        "works_with_l5_attribution": 8,
        "committed_zotero_records": len(zotero_records),
        "candidate_works_with_existing_corpus_match": 24,
        "candidate_works_absent_from_committed_export": 0,
        "candidate_works_with_curated_zotero_key": 22,
        "candidate_works_with_ambiguous_zotero_candidates": 2,
        "round2_zotero_keys_missing_from_committed_export": 0,
        "screening_ready_works": 0,
    }
    assert manifest["committed_state"]["mapping_only_keys_by_source"] == {}
    assert manifest["gate"]["status"] == "blocked"
    assert (
        manifest["gate"]["reason"]
        == "paper_sources_not_reviewed_and_addressable_by_canonical_id"
    )


def test_round2_duplicate_lanes_remain_attributable() -> None:
    manifest = build_manifest(REPO)
    by_doi = {work["doi"]: work for work in manifest["works"]}

    assert by_doi["10.1038/s41467-025-68004-9"]["lanes"] == ["L2", "L3", "L5"]
    assert by_doi["10.1201/9781003585527-19"]["lanes"] == ["L1", "L2"]
    title_matches = [
        work
        for work in manifest["works"]
        if work["existing_match_basis"] == "normalised_title_only"
    ]
    assert len(title_matches) == 2
    assert all(work["zotero_key"] for work in title_matches)
    ambiguous = [
        work
        for work in manifest["works"]
        if work["intake_status"] == "ambiguous_zotero_candidates"
    ]
    assert len(ambiguous) == 2
    assert all(work["zotero_key"] is None for work in ambiguous)
    assert all(len(work["existing_corpus_candidates"]) == 2 for work in ambiguous)
    assert sum(work["zotero_key"] is not None for work in manifest["works"]) == 22
    assert all(work["screening_blockers"] for work in manifest["works"])


def test_round2_source_discovery_never_grants_screening_readiness() -> None:
    manifest = build_manifest(REPO)
    reviewed = [work for work in manifest["works"] if work["source_review"]]

    assert len(reviewed) == 24
    assert all(
        work["source_review"]["authority"] == "source_discovery_only"
        for work in reviewed
    )
    assert all(work["paper_source"] is None for work in manifest["works"])
    assert manifest["counts"]["screening_ready_works"] == 0


def test_each_committed_lane_ris_record_has_a_title() -> None:
    round2 = REPO / "corpus" / "deep-research" / "round2"
    for path in sorted(round2.glob("*_deep-research.ris")):
        records = parse_ris(path)
        assert records, path
        assert all(record.get("TI") or record.get("T1") for record in records), path
