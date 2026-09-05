"""Canonical corpus projections must never reuse historical display totals."""

from copy import deepcopy

import pytest

from src.publish import generate_promptotyping_data_v2 as publisher


def corpus_fixture():
    return {
        "meta": {"source_fingerprint": "sha256:fixture"},
        "papers": [
            {"id": "A", "work_id": "work:one", "knowledge_doc": "one.md", "knowledge_coverage": "linked",
             "llm": {"decision": "Include"}, "human": {"decision": "Exclude"}},
            {"id": "B", "work_id": "work:one", "knowledge_doc": "one.md", "knowledge_coverage": "linked",
             "llm": {"decision": "Include"}, "human": None},
            {"id": "C", "work_id": "work:two", "knowledge_doc": None, "knowledge_coverage": "source_missing",
             "llm": {"decision": "Exclude"}, "human": {"decision": "Include"}},
            {"id": "D", "work_id": "work:three", "knowledge_doc": None, "knowledge_coverage": "fulltext_ready",
             "llm": {"decision": "Unclear"}, "human": {"decision": "Unclear"}},
        ],
    }


def test_metrics_use_current_corpus_and_separate_denominators():
    result = publisher.build_summary(corpus_fixture(), {})
    assert result["total_papers"] == result["corpus_record_total"] == 4
    assert result["corpus_work_total"] == 3
    assert result["knowledge_docs"] == 1
    assert result["knowledge_linked_records"] == 2
    assert result["llm_include_rate"] == 0.5
    assert result["human_include_rate"] == pytest.approx(1 / 3)
    assert result["include_rates"]["human"]["denominator"] == 3
    assert result["include_rates"]["llm"]["denominator"] == 4
    assert result["paired_assessed"] == 3
    assert result["overall_agreement"] == pytest.approx(1 / 3)
    assert result["kappa"] == pytest.approx(0)
    assert result["asymmetry"] == {"llm_overincludes": 1, "human_overincludes": 1}
    assert result["source_fingerprint"] == "sha256:fixture"


def test_empty_denominators_are_unavailable_not_zero_or_historical_defaults():
    result = publisher.build_summary({"papers": []}, {})
    assert result["llm_include_rate"] is None
    assert result["human_include_rate"] is None
    assert result["kappa"] is None
    assert result["overall_agreement"] is None
    assert result["asymmetry"] == {"llm_overincludes": 0, "human_overincludes": 0}


@pytest.mark.parametrize("metrics", [
    {"decision": {"confusion_matrix": {"Include_Include": 99}}},
    {"decision": {"n": 999}},
])
def test_stale_benchmark_cannot_be_mixed_with_canonical_corpus(metrics):
    with pytest.raises(ValueError, match="Benchmark"):
        publisher.build_summary(corpus_fixture(), metrics)


def test_alias_journeys_keep_canonical_identity_and_assessment():
    corpus = corpus_fixture()
    legacy = [{"id": "A", "title": "Obsolete title", "knowledge_sections": {"kernbefund": "Finding"},
               "stages": {"assessment": {"llm": {"decision": "Exclude"}}}}]
    original = deepcopy(corpus)
    result = publisher.project_canonical_journeys(corpus, legacy)
    assert [paper["id"] for paper in result] == ["A", "B", "C", "D"]
    assert result[0]["stages"]["assessment"]["llm"]["decision"] == "Include"
    assert result[1]["work_id"] == "work:one"
    assert result[1]["knowledge_sections"] == {"kernbefund": "Finding"}
    assert result[2]["knowledge_sections"] is None
    assert result[2]["stages"]["conversion"]["pdf_acquired"] is None
    assert corpus == original


def test_journey_does_not_duplicate_complete_corpus_payloads():
    corpus = corpus_fixture()
    corpus["papers"][0].update(abstract="A" * 900, work_versions=[{"large": "registry payload"}])
    result = publisher.project_canonical_journeys(corpus, [])
    assert len(result[0]["abstract"]) == 500
    assert "work_versions" not in result[0] and "llm" not in result[0] and "human" not in result[0]
    assert result[0]["stages"]["assessment"]["human"]["decision"] == "Exclude"


def test_flow_conserves_records_without_inventing_serial_pdf_losses():
    flow = publisher.build_pipeline_flow(corpus_fixture())
    nodes = {node["id"]: node for node in flow["nodes"]}
    assert nodes["zotero"]["value"] == 4
    assert sum(link["value"] for link in flow["links"] if link["source"] == "zotero") == 4
    assert nodes["assessed_both"]["value"] == 3
    assert sum(link["value"] for link in flow["links"] if link["source"] == "assessed_both") == 3
    assert nodes["agree"]["value"] == 1
    assert nodes["disagree"]["value"] == 2
    assert "conv_fail" not in nodes
