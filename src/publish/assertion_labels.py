"""Short German labels for Assertions, kept outside the Assertion files.

An edit to a reviewed Assertion file invalidates its review receipt, so the labels
live in `research-vault/labels/assertion-labels.json`. Each label is bound to the
hash of the Statement it summarises. A label whose Statement has changed since is
dropped, so a tile never summarises wording the label was not written for.
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_LABELS = REPO_ROOT / "research-vault/labels/assertion-labels.json"
SCHEMA = "femprompt-assertion-labels/0.1"
MAX_WORDS = 8


def statement_hash(statement: str) -> str:
    """Whitespace-insensitive, so a reflowed Statement keeps its label."""
    return "sha256:" + hashlib.sha256(" ".join(statement.split()).encode("utf-8")).hexdigest()


def load_labels(path: Path = DEFAULT_LABELS) -> dict[str, dict[str, Any]]:
    if not path.is_file():
        return {}
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict) or data.get("schema") != SCHEMA or not isinstance(data.get("labels"), dict):
        raise ValueError(f"{path}: expected {SCHEMA} with a labels mapping")
    labels = data["labels"]
    for key, entry in labels.items():
        label = entry.get("label") if isinstance(entry, dict) else None
        if not isinstance(label, str) or not label.strip() or len(label.split()) > MAX_WORDS:
            raise ValueError(f"{path}: label of {key} must be nonempty text of at most {MAX_WORDS} words")
        if not str(entry.get("statement_sha256", "")).startswith("sha256:"):
            raise ValueError(f"{path}: label of {key} lacks statement_sha256")
    return labels


def current_label(labels: dict[str, dict[str, Any]], assertion_id: str, statement: str) -> str | None:
    entry = labels.get(assertion_id)
    if entry is None or entry["statement_sha256"] != statement_hash(statement):
        return None
    return entry["label"].strip()
