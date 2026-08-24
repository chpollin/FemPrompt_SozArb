"""Verification tests for the annotation-native literature landscape."""

import importlib.util
import json
import sys
from copy import deepcopy
from pathlib import Path

import pytest

from src.assess import screening_lifecycle

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


def _approve_record(record: dict[str, object], paper_id: str) -> None:
    provenance = record["provenance"]
    provenance["actors"].extend(
        [
            {"id": "expert-1", "type": "person", "roles": ["domain_expert"]},
            {
                "id": "publisher-1",
                "type": "person",
                "roles": ["publication_approval"],
            },
        ]
    )
    no_model = {"status": "not_applicable", "value": "not_applicable"}
    provenance["activities"].extend(
        [
            {
                "id": f"{paper_id}:domain-verification",
                "type": "domain_expert_verification",
                "run_id": "test-verification",
                "method": "prism_domain_expert_verification",
                "prompt": {"status": "recorded", "reference": "test-protocol"},
                "model": no_model,
                "associated_actor_ids": ["expert-1"],
            },
            {
                "id": f"{paper_id}:publication-approval",
                "type": "publication_approval",
                "run_id": "test-publication",
                "method": "prism_publication_approval",
                "prompt": {"status": "recorded", "reference": "test-protocol"},
                "model": no_model,
                "associated_actor_ids": ["publisher-1"],
            },
        ]
    )
    annotation_id = record["active_annotation_id"]
    record["lifecycle"]["events"].extend(
        [
            {
                "event_id": f"{paper_id}:domain-verification",
                "event_type": "domain_expert_verification",
                "from": "ai-agent-reviewed",
                "to": "verified",
                "result": "accepted",
                "note": "Fachlich geprüft.",
                "at": "2026-08-22T12:00:00Z",
                "activity_id": f"{paper_id}:domain-verification",
                "actor_ids": ["expert-1"],
                "annotation_id": annotation_id,
            },
            {
                "event_id": f"{paper_id}:publication-approval",
                "event_type": "publication_approval",
                "from": "verified",
                "to": "publication-approved",
                "result": "approved",
                "note": "Für die öffentliche Projektion freigegeben.",
                "at": "2026-08-22T13:00:00Z",
                "activity_id": f"{paper_id}:publication-approval",
                "actor_ids": ["publisher-1"],
                "annotation_id": annotation_id,
            },
        ]
    )
    record["lifecycle"]["state"] = "publication-approved"


def _sync_annotation(record: dict[str, object]) -> None:
    annotation = next(
        item
        for item in record["annotations"]
        if item["annotation_id"] == record["active_annotation_id"]
    )
    annotation["body"] = screening_lifecycle.annotation_body(record)


def _fixture() -> tuple[dict[str, object], dict[str, object]]:
    screening = {
        "schema": "femprompt-prisma-reviewer/0.3",
        "reviewer": "test",
        "actor": "agent",
        "status": "provisional_technical_acceptance",
        "updated": "2026-08-22T12:00:00Z",
        "ratification": {
            "run_id": "test-run",
            "input_tracks": [
                {"reviewer": "rr1", "path": "tracks/rr1.json"},
                {"reviewer": "rr2", "path": "tracks/rr2.json"},
            ],
        },
        "decisions": {
            "P1": {
                "decision": "Include",
                "reason": None,
                "text_source": "raw",
                "reviewer": "test",
                "actor": "agent",
                "work_id": "work:11111111-1111-5111-8111-111111111111",
                "version_id": "version:11111111-1111-5111-8111-111111111111",
                "version_type": "version_of_record",
                "preferred_version_id": "version:11111111-1111-5111-8111-111111111111",
                "selected_version_is_preferred": True,
                "ts": "2026-08-22T12:00:00Z",
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
                "work_id": "work:22222222-2222-5222-8222-222222222222",
                "version_id": "version:22222222-2222-5222-8222-222222222222",
                "version_type": "preprint",
                "preferred_version_id": "version:22222222-2222-5222-8222-222222222222",
                "selected_version_is_preferred": True,
                "ts": "2026-08-22T12:00:00Z",
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
                "work_id": "work:11111111-1111-5111-8111-111111111111",
                "version_id": "version:11111111-1111-5111-8111-111111111111",
                "version_type": "version_of_record",
                "peer_review_status": "peer_reviewed",
                "preferred_version_id": "version:11111111-1111-5111-8111-111111111111",
                "latest_version_id": "version:11111111-1111-5111-8111-111111111111",
                "is_preferred_version": True,
                "work_versions": [
                    {
                        "version_id": "version:11111111-1111-5111-8111-111111111111",
                        "version_type": "version_of_record",
                    }
                ],
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
                "work_id": "work:22222222-2222-5222-8222-222222222222",
                "version_id": "version:22222222-2222-5222-8222-222222222222",
                "version_type": "preprint",
                "peer_review_status": "not_peer_reviewed",
                "preferred_version_id": "version:22222222-2222-5222-8222-222222222222",
                "latest_version_id": "version:22222222-2222-5222-8222-222222222222",
                "is_preferred_version": True,
                "work_versions": [],
            },
        ]
    }
    return screening_lifecycle.migrate_v03_document(screening), corpus


def test_build_withholds_records_without_publication_approval(
    tmp_path: Path,
) -> None:
    screening, corpus = _fixture()
    payload = landscape.build(
        _write(tmp_path / "screening.json", screening),
        _write(tmp_path / "corpus.json", corpus),
    )

    assert payload["meta"] == {
        "corpus_total": 2,
        "annotated_total": 0,
        "source_annotated_total": 2,
        "withheld_total": 2,
        "included_total": 0,
        "excluded_total": 0,
        "unclear_total": 0,
        "thematic_total": 0,
    }
    assert payload["source"]["provisional"] is True
    assert payload["source"]["publication_gate"] == "publication-approved"
    assert payload["records"] == []


def test_ratified_agent_consensus_is_not_publication_approval(tmp_path: Path) -> None:
    screening, corpus = _fixture()
    screening["status"] = "ratified_agent_consensus"

    payload = landscape.build(
        _write(tmp_path / "screening.json", screening),
        _write(tmp_path / "corpus.json", corpus),
    )

    assert payload["source"]["status"] == "ratified_agent_consensus"
    assert payload["source"]["provisional"] is True
    assert payload["meta"]["withheld_total"] == 2
    assert payload["records"] == []


def test_build_publishes_only_approved_records(tmp_path: Path) -> None:
    screening, corpus = _fixture()
    screening["status"] = "ai-agent-reviewed"
    _approve_record(screening["decisions"]["P1"], "P1")

    payload = landscape.build(
        _write(tmp_path / "screening.json", screening),
        _write(tmp_path / "corpus.json", corpus),
    )

    assert payload["meta"]["annotated_total"] == 1
    assert payload["meta"]["source_annotated_total"] == 2
    assert payload["meta"]["withheld_total"] == 1
    included = payload["records"][0]
    assert payload["schema"] == "femprompt-literature-landscape/1.1"
    assert included["id"] == "P1"
    assert included["lifecycle_state"] == "publication-approved"
    assert included["verification"]["result"] == "accepted"
    assert included["publication_approval"]["actor_ids"] == ["publisher-1"]
    assert included["version_type"] == "version_of_record"
    assert included["peer_review_status"] == "peer_reviewed"
    assert included["categories"][0]["evidence"][0]["source_layer"] == "paper"
    assert included["categories"][0]["evidence"][0]["snippet"]
    assert included["analysis"]["fields"]["AN_Bias_Axes"] == ["Gender"]
    assert included["analysis"]["undecidable"] == ["AN_Harm_Types"]


def test_positive_category_without_paper_evidence_fails(tmp_path: Path) -> None:
    screening, corpus = _fixture()
    record = screening["decisions"]["P1"]
    _approve_record(record, "P1")
    record["evidence"]["Gender"][0]["source_layer"] = "ai"
    _sync_annotation(record)

    with pytest.raises(ValueError, match="has no Paper evidence"):
        landscape.build(
            _write(tmp_path / "screening.json", screening),
            _write(tmp_path / "corpus.json", corpus),
        )


def test_include_without_analysis_fails(tmp_path: Path) -> None:
    screening, corpus = _fixture()
    record = screening["decisions"]["P1"]
    _approve_record(record, "P1")
    del record["analysis"]
    _sync_annotation(record)

    with pytest.raises(ValueError, match="has no complete analysis"):
        landscape.build(
            _write(tmp_path / "screening.json", screening),
            _write(tmp_path / "corpus.json", corpus),
        )


def test_incomplete_or_unknown_analysis_fails(tmp_path: Path) -> None:
    screening, corpus = _fixture()
    record = screening["decisions"]["P1"]
    _approve_record(record, "P1")
    record["analysis"]["fields"] = {
        "AN_Coding_Basis": "Fulltext",
        "Studientyp": "Empirisch",
    }
    _sync_annotation(record)
    with pytest.raises(ValueError, match="required analysis field"):
        landscape.build(
            _write(tmp_path / "incomplete.json", screening),
            _write(tmp_path / "corpus.json", corpus),
        )

    screening, corpus = _fixture()
    record = screening["decisions"]["P1"]
    _approve_record(record, "P1")
    record["analysis"]["fields"]["AN_Bias_Axes"] = ["Invented"]
    _sync_annotation(record)
    with pytest.raises(ValueError, match="invalid value"):
        landscape.build(
            _write(tmp_path / "unknown-analysis.json", screening),
            _write(tmp_path / "corpus-2.json", corpus),
        )


def test_unknown_paper_and_category_fail_closed(tmp_path: Path) -> None:
    screening, corpus = _fixture()
    unknown_paper = deepcopy(screening)
    _approve_record(unknown_paper["decisions"]["P2"], "P2")
    unknown_paper["decisions"]["P3"] = unknown_paper["decisions"].pop("P2")
    with pytest.raises(ValueError, match="has no corpus metadata"):
        landscape.build(
            _write(tmp_path / "unknown-paper.json", unknown_paper),
            _write(tmp_path / "corpus.json", corpus),
        )

    unknown_category = deepcopy(screening)
    record = unknown_category["decisions"]["P1"]
    _approve_record(record, "P1")
    record["categories"] = {"Invented": 2}
    _sync_annotation(record)
    with pytest.raises(ValueError, match="unknown category"):
        landscape.build(
            _write(tmp_path / "unknown-category.json", unknown_category),
            _write(tmp_path / "corpus-2.json", corpus),
        )
