"""Presentation labels of the analysis vocabulary stay complete and closed."""

from pathlib import Path

import pytest

from src.publish import build_analysis_fields as analysis_fields

ROOT = Path(__file__).resolve().parents[1]

SOURCE = """# Version: 1.3
study_types:
  - Empirisch
analysis_fields:
  - name: AN_Mitigation_Status
    multi: false
    serves: [SQ3]
    values: [Evaluated, None]
  - name: AN_Notes
    free_text: true
analysis_presentation:
  AN_Mitigation_Status:
    label: Evidenzstand
    definition: Ein Wert für das ganze Werk.
    values:
      Evaluated: {label: Evaluiert, definition: Abschließend geprüft.}
      None: {label: Keine Maßnahme, definition: Keine Maßnahme behandelt.}
  AN_Notes: {label: Notizen, definition: Freitext.}
  Studientyp:
    label: Studientyp
    definition: Studientyp des Werks.
    values:
      Empirisch: {label: Empirisch, definition: Eigene Daten.}
"""


def test_labels_and_definitions_are_projected_per_field_and_value() -> None:
    payload = analysis_fields.build_payload(SOURCE)

    status, notes = payload["fields"]
    assert status["label"] == "Evidenzstand"
    assert status["values"] == ["Evaluated", "None"]
    assert status["value_labels"] == {"Evaluated": "Evaluiert", "None": "Keine Maßnahme"}
    assert status["value_definitions"]["None"] == "Keine Maßnahme behandelt."
    assert "serves" not in status
    assert notes == {"name": "AN_Notes", "label": "Notizen", "definition": "Freitext.", "free_text": True}
    assert payload["study_types"] == ["Empirisch"]
    assert payload["study_type"]["value_labels"] == {"Empirisch": "Empirisch"}
    assert payload["study_type"]["multi"] is False


@pytest.mark.parametrize(
    "old, new",
    [
        ("      None: {label: Keine Maßnahme, definition: Keine Maßnahme behandelt.}\n", ""),
        ("Evaluated: {label: Evaluiert,", "Evaluiert: {label: Evaluiert,"),
        ("  AN_Notes: {label: Notizen, definition: Freitext.}\n", ""),
        ("  AN_Notes: {label: Notizen", "  AN_Other: {label: Notizen"),
        ("definition: Eigene Daten.", "definition: ' '"),
    ],
)
def test_missing_or_stray_presentation_fails_closed(old: str, new: str) -> None:
    assert old in SOURCE
    with pytest.raises(ValueError, match="analysis_presentation"):
        analysis_fields.build_payload(SOURCE.replace(old, new))


def test_canonical_vocabulary_is_fully_labelled() -> None:
    payload = analysis_fields.build_payload(
        (ROOT / "assessment/categories.yaml").read_text(encoding="utf-8")
    )
    assert payload["version"] == "1.3"
    for field in payload["fields"]:
        assert field["label"] and field["definition"]
        if not field.get("free_text"):
            assert list(field["value_labels"]) == field["values"]
            assert list(field["value_definitions"]) == field["values"]
    assert list(payload["study_type"]["value_labels"]) == payload["study_types"]
