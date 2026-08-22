"""Tests for the canonical public category schema."""

from pathlib import Path

from src.publish import build_category_schema as category_schema


ROOT = Path(__file__).resolve().parents[1]


def test_public_category_schema_matches_canonical_yaml() -> None:
    payload = category_schema.build()

    assert payload["version"] == "1.3"
    assert payload["decision_options"] == ["Include", "Exclude", "Unclear"]
    assert payload["exclusion_reasons"] == [
        "Duplicate",
        "Not_relevant_topic",
        "Wrong_publication_type",
        "No_full_text",
        "Language",
    ]
    assert len(payload["categories"]) == 10
    assert payload["groups"]["object"] == [
        "AI_Literacies",
        "Generative_KI",
        "Prompting",
        "KI_Sonstige",
    ]
    assert payload["groups"]["perspective"] == [
        "Soziale_Arbeit",
        "Bias_Ungleichheit",
        "Gender",
        "Diversitaet",
        "Feministisch",
        "Fairness",
    ]
    assert all(item["definition"] for item in payload["categories"])
    assert all(item["label"] and item["color"] for item in payload["categories"])


def test_committed_schema_is_reproducible() -> None:
    expected = category_schema.build()
    actual = category_schema.json.loads(
        (ROOT / "docs" / "data" / "category_schema.json").read_text(
            encoding="utf-8"
        )
    )

    assert actual == expected
