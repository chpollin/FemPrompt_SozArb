"""Publish the canonical screening categories for the static applications.

The scientific vocabulary remains in ``assessment/categories.yaml``. This
small stdlib-only publisher adds presentation labels and colours and emits the
subset needed by PRISM, the Evidence Companion, and downstream publishers.

Usage:
    python src/publish/build_category_schema.py
"""

from __future__ import annotations

import json
import os
import re
import sys
import tempfile
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
YAML_IN = ROOT / "assessment" / "categories.yaml"
JSON_OUT = ROOT / "docs" / "data" / "category_schema.json"

VERSION_RE = re.compile(r"^#\s*Version:\s*([0-9.]+)")
CATEGORY_RE = re.compile(r"^\s{2}-\s+name:\s*(\S+)\s*$")
GROUP_RE = re.compile(r"^\s{4}group:\s*(\S+)\s*$")
OPTION_RE = re.compile(r"^\s{4}-\s+(\S+)\s*$")
REASON_RE = re.compile(r"^\s{2}-\s+code:\s*(\S+)\s*$")

PRESENTATION = {
    "AI_Literacies": ("AI Literacies", "#5b8c5a"),
    "Generative_KI": ("Generative KI", "#3a7d7e"),
    "Prompting": ("Prompting", "#4b7bab"),
    "KI_Sonstige": ("KI Sonstige", "#7c6fae"),
    "Soziale_Arbeit": ("Soziale Arbeit", "#b0546e"),
    "Bias_Ungleichheit": ("Bias & Ungleichheit", "#c2694e"),
    "Gender": ("Gender", "#d4943a"),
    "Diversitaet": ("Diversität", "#8a7542"),
    "Feministisch": ("Feministisch", "#a24b7a"),
    "Fairness": ("Fairness", "#6a8e4e"),
}


def _section(lines: list[str], key: str) -> list[str]:
    start = next(
        (index + 1 for index, line in enumerate(lines) if line == f"{key}:"),
        None,
    )
    if start is None:
        raise ValueError(f"Missing top-level YAML section: {key}")
    end = next(
        (
            index
            for index in range(start, len(lines))
            if lines[index] and not lines[index].startswith((" ", "#"))
        ),
        len(lines),
    )
    return lines[start:end]


def _folded_value(lines: list[str], start: int) -> str:
    values = []
    for line in lines[start + 1 :]:
        if re.match(r"^\s{4}\S", line) or CATEGORY_RE.match(line):
            break
        if line.startswith("      ") and line.strip():
            values.append(line.strip())
    return " ".join(values)


def _nested_options(lines: list[str], key: str) -> list[str]:
    start = next(
        (index + 1 for index, line in enumerate(lines) if line == f"  {key}:"),
        None,
    )
    if start is None:
        raise ValueError(f"Missing nested YAML sequence: {key}")
    values = []
    for line in lines[start:]:
        match = OPTION_RE.match(line)
        if match:
            values.append(match.group(1))
            continue
        if line.strip():
            break
    return values


def build(source: Path = YAML_IN) -> dict[str, Any]:
    """Return the public category schema derived from the canonical YAML."""
    if not source.is_file():
        raise FileNotFoundError(f"Required category source is missing: {source}")
    lines = source.read_text(encoding="utf-8").splitlines()
    version = next(
        (match.group(1) for line in lines[:6] if (match := VERSION_RE.match(line))),
        "",
    )
    section = _section(lines, "categories")
    decision_options = _nested_options(_section(lines, "decision"), "options")
    exclusion_reasons = [
        match.group(1)
        for line in _section(lines, "exclusion_reasons")
        if (match := REASON_RE.match(line))
    ]
    if decision_options != ["Include", "Exclude", "Unclear"]:
        raise ValueError(f"Unexpected decision vocabulary: {decision_options}")
    if not exclusion_reasons:
        raise ValueError("Missing exclusion reasons")
    categories: list[dict[str, str]] = []
    current: dict[str, str] | None = None
    for index, line in enumerate(section):
        category_match = CATEGORY_RE.match(line)
        if category_match:
            if current:
                categories.append(current)
            current = {"key": category_match.group(1)}
            continue
        if current is None:
            continue
        group_match = GROUP_RE.match(line)
        if group_match:
            current["group"] = group_match.group(1)
        elif re.match(r"^\s{4}definition:\s*>\s*$", line):
            current["definition"] = _folded_value(section, index)
    if current:
        categories.append(current)

    keys = [category["key"] for category in categories]
    if set(keys) != set(PRESENTATION) or len(keys) != len(PRESENTATION):
        raise ValueError(
            "Category presentation metadata does not match categories.yaml: "
            f"yaml={keys}, presentation={list(PRESENTATION)}"
        )
    for category in categories:
        if category.get("group") not in {"technik", "sozial"}:
            raise ValueError(f"Invalid group for {category['key']}")
        category["label"], category["color"] = PRESENTATION[category["key"]]

    return {
        "schema": "femprompt-category-schema/1.0",
        "source": "assessment/categories.yaml",
        "version": version,
        "decision_options": decision_options,
        "exclusion_reasons": exclusion_reasons,
        "categories": categories,
        "groups": {
            "object": [item["key"] for item in categories if item["group"] == "technik"],
            "perspective": [item["key"] for item in categories if item["group"] == "sozial"],
        },
    }


def _write_json_atomic(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(
            "w",
            encoding="utf-8",
            newline="\n",
            dir=path.parent,
            prefix=f".{path.name}.",
            suffix=".tmp",
            delete=False,
        ) as output:
            temporary = Path(output.name)
            json.dump(payload, output, ensure_ascii=False, indent=2)
            output.write("\n")
        os.replace(temporary, path)
    finally:
        if temporary and temporary.exists():
            temporary.unlink()


def main() -> int:
    try:
        payload = build()
        _write_json_atomic(JSON_OUT, payload)
    except (FileNotFoundError, ValueError) as error:
        print(f"FEHLER: {error}", file=sys.stderr)
        return 1
    print(
        f"OK: {JSON_OUT.relative_to(ROOT)} contains "
        f"{len(payload['categories'])} canonical categories"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
