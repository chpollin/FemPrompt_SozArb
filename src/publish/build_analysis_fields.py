#!/usr/bin/env python3
"""Emit the analysis-field vocabulary for PRISM and the Evidence Companion (FR-14, ADR-026).

The static apps cannot read assessment/categories.yaml directly, and a hand-kept
second vocabulary list in the JS would be a second source of truth that drifts
from the frozen schema. This script is the one seam: it reads the frozen
analysis_fields block from assessment/categories.yaml and writes it to
docs/data/analysis_fields.json. The panel's closed selections are fed only from
this file, so no code path can produce a value outside the frozen vocabulary.

The Studientyp vocabulary (existing study_types) travels along, because
update-protocol D makes Studientyp required for Include and the analysis export
carries it; it is not an AN_ field but is read from the same source here.

German display labels and definitions come from the separate
analysis_presentation block. They are presentation only and fail closed: every
field and value needs an entry, and an entry outside the vocabulary is an error,
so a label can neither go missing nor describe a code that does not exist.

Fields introduced after v1.3 carry `introduced_in`, and the derived field states
(analysis_field_states, such as not_collected) travel with their labels, so the apps
can tell a field nobody was asked to code from coded absence.

Output: docs/data/analysis_fields.json
  { "meta": {...}, "version": "1.4",
    "fields": [ { "name", "label", "definition", "multi", "values",
                  "value_labels", "value_definitions"[, "optional", "free_text",
                  "binding_when", "introduced_in", "pilot"] } ],
    "field_states": { "not_collected": { "label", "definition" } },
    "study_types": [...],
    "study_type": { "name": "Studientyp", "label", "definition", "multi": false,
                    "values", "value_labels", "value_definitions" } }

Run: python src/publish/build_analysis_fields.py
"""

import json
import re
import sys
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parents[2]
YAML_IN = ROOT / "assessment" / "categories.yaml"
JSON_OUT = ROOT / "docs" / "data" / "analysis_fields.json"
STUDY_FIELD = "Studientyp"

VERSION_RE = re.compile(r"^#\s*Version:\s*([0-9.]+)")


def _text(value: Any, where: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"analysis_presentation: {where} needs a nonempty text")
    return value.strip()


def _presented(name: str, values: list[str] | None, presentation: dict) -> dict:
    """Label and definition of one field and, unless free text, of each value."""
    entry = presentation.get(name)
    if not isinstance(entry, dict):
        raise ValueError(f"analysis_presentation: missing entry for {name}")
    out = {
        "label": _text(entry.get("label"), f"{name}.label"),
        "definition": _text(entry.get("definition"), f"{name}.definition"),
    }
    if values is None:
        if entry.get("values"):
            raise ValueError(f"analysis_presentation: free-text {name} takes no values")
        return out
    shown = entry.get("values") or {}
    unknown = sorted(set(map(str, shown)) - set(values))
    if unknown:
        raise ValueError(f"analysis_presentation: {name} names unknown values {unknown}")
    labels, definitions = {}, {}
    for value in values:
        item = shown.get(value)
        if not isinstance(item, dict):
            raise ValueError(f"analysis_presentation: missing entry for {name}.{value}")
        labels[value] = _text(item.get("label"), f"{name}.{value}.label")
        definitions[value] = _text(item.get("definition"), f"{name}.{value}.definition")
    out["value_labels"] = labels
    out["value_definitions"] = definitions
    return out


def build_payload(text: str) -> dict:
    """Project the frozen vocabulary and its presentation metadata."""
    version = ""
    for ln in text.split("\n")[:5]:
        m = VERSION_RE.match(ln)
        if m:
            version = m.group(1)
            break
    data = yaml.safe_load(text) or {}
    raw_fields = data.get("analysis_fields")
    if not raw_fields:
        raise ValueError("analysis_fields block not found in categories.yaml")
    presentation = data.get("analysis_presentation") or {}
    # YAML 1.1 keeps a code such as None as a string; stringify explicitly anyway.
    study_types = [str(value) for value in data.get("study_types") or []]
    names = {f["name"] for f in raw_fields} | {STUDY_FIELD}
    stray = sorted(set(presentation) - names)
    if stray:
        raise ValueError(f"analysis_presentation: unknown fields {stray}")

    # Keep only the keys the apps consume; drop notes/serves, which are coding
    # guidance, not vocabulary. A single-select field is `multi: false`.
    fields = []
    for f in raw_fields:
        out = {"name": f["name"]}
        if f.get("free_text"):
            out.update(_presented(f["name"], None, presentation))
            out["free_text"] = True
            fields.append(out)
            continue
        values = [str(value) for value in f.get("values", [])]
        shown = _presented(f["name"], values, presentation)
        out["label"], out["definition"] = shown["label"], shown["definition"]
        out["multi"] = bool(f.get("multi", False))
        out["values"] = values
        out["value_labels"] = shown["value_labels"]
        out["value_definitions"] = shown["value_definitions"]
        if f.get("optional"):
            out["optional"] = True
        if f.get("binding_when"):
            out["binding_when"] = f["binding_when"]
        if f.get("introduced_in"):
            out["introduced_in"] = str(f["introduced_in"])
        if f.get("pilot"):
            out["pilot"] = True
        fields.append(out)

    field_states = {}
    for state, entry in (data.get("analysis_field_states") or {}).items():
        if not isinstance(entry, dict):
            raise ValueError(f"analysis_field_states: {state} needs a mapping")
        field_states[state] = {
            "label": _text(entry.get("label"), f"analysis_field_states.{state}.label"),
            "definition": _text(
                entry.get("definition"), f"analysis_field_states.{state}.definition"
            ),
        }

    study_type = {
        "name": STUDY_FIELD,
        "multi": False,
        "values": study_types,
        **_presented(STUDY_FIELD, study_types, presentation),
    }
    return {
        "meta": {
            "generated_by": "src/publish/build_analysis_fields.py",
            "source": "assessment/categories.yaml",
            "note": "Closed vocabulary for the PRISM analysis panel (FR-14/ADR-026); the one source, do not hand-edit. Labels and definitions are presentation only.",
        },
        "version": version,
        "fields": fields,
        "field_states": field_states,
        "study_types": study_types,
        "study_type": study_type,
    }


def main() -> int:
    if not YAML_IN.exists():
        print(f"ERROR: {YAML_IN} not found", file=sys.stderr)
        return 1
    try:
        payload = build_payload(YAML_IN.read_text(encoding="utf-8"))
    except ValueError as error:
        print(f"ERROR: {error}", file=sys.stderr)
        return 1
    JSON_OUT.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    fields = payload["fields"]
    print(f"Wrote {JSON_OUT.relative_to(ROOT)}")
    print(f"  version: {payload['version']}  fields: {len(fields)}  study_types: {len(payload['study_types'])}")
    for f in fields:
        kind = "free" if f.get("free_text") else ("multi" if f.get("multi") else "single")
        n = len(f.get("values", []))
        print(f"    {f['name']:22} {kind:6} {n} values" + (" (optional)" if f.get("optional") else ""))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
