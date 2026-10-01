"""Argumentkarte labels: kept outside the Assertions, bound to their Statement, public only when released."""
from __future__ import annotations

import json
import subprocess
from pathlib import Path

import pytest

from src.publish.assertion_labels import DEFAULT_LABELS, MAX_WORDS, SCHEMA, load_labels, statement_hash
from src.publish.build_assertion_map import build_map
from tests.test_build_assertion_map import _fixture

ROOT = Path(__file__).resolve().parents[1]


def _labels(tmp_path: Path, entries: dict) -> Path:
    path = tmp_path / "labels.json"
    path.write_text(json.dumps({"schema": SCHEMA, "labels": entries}), encoding="utf-8")
    return path


def test_map_shows_a_label_only_for_the_statement_it_was_written_for(tmp_path):
    args = _fixture(tmp_path)
    args["labels_path"] = _labels(tmp_path, {
        "draft-one": {"label": "Kurzer Kern", "statement_sha256": statement_hash("Statement  of\ndraft-one.")},
        "draft-two": {"label": "Veraltet", "statement_sha256": statement_hash("An earlier wording.")},
    })
    items = {item["id"]: item for item in build_map(**args)["assertions"]}
    assert items["draft-one"]["label"] == "Kurzer Kern"
    assert items["draft-two"]["label"] is None
    assert items["released-one"]["label"] is None


def test_overlong_or_unbound_labels_are_rejected(tmp_path):
    with pytest.raises(ValueError):
        load_labels(_labels(tmp_path, {"a": {"label": " ".join(["Wort"] * (MAX_WORDS + 1)),
                                              "statement_sha256": statement_hash("x")}}))
    with pytest.raises(ValueError):
        load_labels(_labels(tmp_path, {"a": {"label": "Kurz"}}))


def test_every_repository_assertion_has_a_current_short_label():
    labels = load_labels()
    items = build_map()["assertions"]
    assert {item["id"] for item in items} == set(labels)
    assert all(item["label"] and len(item["label"].split()) <= 7 for item in items)


def test_tracked_served_files_carry_no_label_of_an_unreleased_assertion():
    released = json.loads((ROOT / "docs/data/assertion_index.json").read_text(encoding="utf-8"))["assertions"]
    labels = json.loads(DEFAULT_LABELS.read_text(encoding="utf-8"))["labels"]
    released_ids = {item["assertion_ref"].rsplit("/", 1)[-1] for item in released}
    assert all(item.get("label") == labels[item["assertion_ref"].rsplit("/", 1)[-1]]["label"] for item in released)
    tracked = subprocess.run(["git", "ls-files", "docs", "build/site"], cwd=ROOT, capture_output=True,
                             text=True, check=True).stdout.splitlines()
    texts = [(ROOT / name).read_text(encoding="utf-8", errors="ignore") for name in tracked
             if (ROOT / name).is_file() and name.endswith((".json", ".js", ".html", ".md", ".csv"))]
    for key, entry in labels.items():
        if key in released_ids:
            continue
        assert not any(entry["label"] in text for text in texts), f"draft label of {key} in a served file"
