"""Integration tests for work-level AI-agent screening coverage."""

import json

from src.analysis.build_agent_screening_queue import REPO, build_queue


def test_queue_preserves_existing_human_authority() -> None:
    queue = build_queue(REPO)

    assert queue["counts"] == {
        "canonical_records": 326,
        "canonical_works": 257,
        "direct_human_annotated_records": 291,
        "direct_ai_agent_reviewed_without_human": 21,
        "unannotated_alias_records_covered_at_work_level": 5,
        "queued_records": 9,
        "queued_works": 9,
        "ready_works": 0,
        "blocked_abstract_only_works": 4,
        "blocked_without_text_works": 5,
    }
    assert len(queue["covered_alias_records"]) == 5


def test_completed_source_run_closes_ready_gate() -> None:
    queue = build_queue(REPO)
    ready = [item for item in queue["queue"] if item["queue_status"] == "ready"]

    assert ready == []
    assert queue["gate"]["status"] == "blocked"
    queued_ids = {item["representative_record_id"] for item in queue["queue"]}
    assert not {
        "UKKQKL7I",
        "8MRNK6FX",
        "4KMMPA6A",
        "EQV4DNQR",
        "J5EF9W6M",
        "VSZM7CT6",
        "7FEFMCBZ",
        "R7V99ERA",
        "4ZL5Q48E",
        "J7V3AAQT",
        "3ZNMTJ5B",
        "A2P8MXMY",
        "BDI6XU5A",
        "BHXDU7VM",
        "FTJM5R8N",
        "NSI6S5QE",
        "P4YQIKJX",
        "QUV5DQH3",
    } & queued_ids


def test_reviewed_duplicate_work_projects_to_both_records() -> None:
    screening = json.loads(
        (REPO / "docs" / "data" / "screening" / "ar2.json").read_text(encoding="utf-8")
    )
    representative = screening["decisions"]["8MRNK6FX"]
    duplicate = screening["decisions"]["SSF5Q33W"]

    assert duplicate["alias_of"] == "8MRNK6FX"
    assert duplicate["work_id"] == representative["work_id"]
    assert duplicate["lifecycle"]["state"] == "ai-agent-reviewed"
