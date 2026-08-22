"""Verification tests for the annotation-native literature landscape."""

import importlib.util
import json
import sys
from copy import deepcopy
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location(
    "generate_literature_landscape",
    ROOT / "src" / "publish" / "generate_literature_landscape.py",
)
landscape = importlib.util.module_from_spec(spec)
sys.modules["generate_literature_landscape"] = landscape
spec.loader.exec_module(landscape)


def _write(path: Path, payload: dict[str, object]) -> Path:
    path.write_text(json.dumps(payload), encoding="utf-8")
    return path


def _fixture() -> tuple[dict[str, object], dict[str, object]]:
    screening = {
        "schema": "femprompt-prisma-reviewer/0.3",
        "reviewer": "test",
        "actor": "agent",
        "status": "provisional_technical_acceptance",
        "updated": "2026-08-22T12:00:00Z",
        "decisions": {
            "P1": {
                "decision": "Include",
                "reason": None,
                "text_source": "raw",
                "reviewer": "test",
                "actor": "agent",
                "categories": {"Generative_KI": 2, "Gender": 1},
                "evidence": {
                    "Generative_KI": [
                        {
                            "term": "language model",
                            "snippet": "The study evaluates a language model.",
                            "source_layer": "paper",
                            "actor": "agent",
                        }
                    ],
                    "Gender": [
                        {
                            "term": "gender bias",
                            "snippet": "The analysis measures gender bias.",
                            "source_layer": "paper",
                            "actor": "agent",
                        }
                    ],
                },
                "analysis": {
                    "fields": {
                        "AN_Prompting_Role": ["None"],
                        "AN_Prompt_Techniques": ["None"],
                        "AN_Bias_Axes": ["Gender"],
                        "AN_Mitigation_Stage": ["None"],
                        "AN_Mitigation_Status": "None",
                        "AN_Population": ["Not_SW_Specific"],
                        "AN_Coding_Basis": "Fulltext",
                        "AN_Notes": "Grounded note.",
                        "Studientyp": "Empirisch",
                    },
                    "undecidable": {"AN_Harm_Types": True},
                },
            },
            "P2": {
                "decision": "Exclude",
                "reason": "Not_relevant_topic",
                "text_source": "abstract",
                "reviewer": "test",
                "actor": "agent",
                "categories": {},
                "evidence": {},
            },
        },
    }
    corpus = {
        "papers": [
            {
                "id": "P1",
                "title": "Paper one",
                "author_year": "Author (2024)",
                "authors": "Author, A.",
                "year": 2024,
                "doi": "10.1234/one",
                "url": "",
                "item_type": "journalarticle",
                "journal": "Journal",
            },
            {
                "id": "P2",
                "title": "Paper two",
                "author_year": "Author (2023)",
                "authors": "Author, B.",
                "year": 2023,
                "doi": "",
                "url": "https://example.org/two",
                "item_type": "webpage",
                "journal": "",
            },
        ]
    }
    return screening, corpus


def test_build_preserves_grounded_annotations_and_marks_provisional(
    tmp_path: Path,
) -> None:
    screening, corpus = _fixture()
    payload = landscape.build(
        _write(tmp_path / "screening.json", screening),
        _write(tmp_path / "corpus.json", corpus),
    )

    assert payload["meta"] == {
        "corpus_total": 2,
        "annotated_total": 2,
        "included_total": 1,
        "excluded_total": 1,
        "unclear_total": 0,
        "thematic_total": 1,
    }
    assert payload["source"]["provisional"] is True


def test_build_marks_ratified_agent_consensus_as_binding(tmp_path: Path) -> None:
    screening, corpus = _fixture()
    screening["status"] = "ratified_agent_consensus"

    payload = landscape.build(
        _write(tmp_path / "screening.json", screening),
        _write(tmp_path / "corpus.json", corpus),
    )

    assert payload["source"]["status"] == "ratified_agent_consensus"
    assert payload["source"]["provisional"] is False
    included = payload["records"][0]
    assert included["id"] == "P1"
    assert included["categories"][0]["evidence"][0]["source_layer"] == "paper"
    assert included["categories"][0]["evidence"][0]["snippet"]
    assert included["analysis"]["fields"]["AN_Bias_Axes"] == ["Gender"]
    assert included["analysis"]["undecidable"] == ["AN_Harm_Types"]


def test_positive_category_without_paper_evidence_fails(tmp_path: Path) -> None:
    screening, corpus = _fixture()
    screening["decisions"]["P1"]["evidence"]["Gender"][0]["source_layer"] = "ai"

    with pytest.raises(ValueError, match="has no Paper evidence"):
        landscape.build(
            _write(tmp_path / "screening.json", screening),
            _write(tmp_path / "corpus.json", corpus),
        )


def test_include_without_analysis_fails(tmp_path: Path) -> None:
    screening, corpus = _fixture()
    del screening["decisions"]["P1"]["analysis"]

    with pytest.raises(ValueError, match="has no complete analysis"):
        landscape.build(
            _write(tmp_path / "screening.json", screening),
            _write(tmp_path / "corpus.json", corpus),
        )


def test_incomplete_or_unknown_analysis_fails(tmp_path: Path) -> None:
    screening, corpus = _fixture()
    screening["decisions"]["P1"]["analysis"]["fields"] = {
        "AN_Coding_Basis": "Fulltext",
        "Studientyp": "Empirisch",
    }
    with pytest.raises(ValueError, match="required analysis field"):
        landscape.build(
            _write(tmp_path / "incomplete.json", screening),
            _write(tmp_path / "corpus.json", corpus),
        )

    screening, corpus = _fixture()
    screening["decisions"]["P1"]["analysis"]["fields"]["AN_Bias_Axes"] = [
        "Invented"
    ]
    with pytest.raises(ValueError, match="invalid value"):
        landscape.build(
            _write(tmp_path / "unknown-analysis.json", screening),
            _write(tmp_path / "corpus-2.json", corpus),
        )


def test_unknown_paper_and_category_fail_closed(tmp_path: Path) -> None:
    screening, corpus = _fixture()
    unknown_paper = deepcopy(screening)
    unknown_paper["decisions"]["P3"] = unknown_paper["decisions"].pop("P2")
    with pytest.raises(ValueError, match="has no corpus metadata"):
        landscape.build(
            _write(tmp_path / "unknown-paper.json", unknown_paper),
            _write(tmp_path / "corpus.json", corpus),
        )

    unknown_category = deepcopy(screening)
    unknown_category["decisions"]["P1"]["categories"] = {"Invented": 2}
    with pytest.raises(ValueError, match="unknown category"):
        landscape.build(
            _write(tmp_path / "unknown-category.json", unknown_category),
            _write(tmp_path / "corpus-2.json", corpus),
        )
