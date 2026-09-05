"""Apply attributed local metadata reconciliations without rewriting Zotero history.

These projections do not claim that the external library has been edited. Exact
base hashes and before values prevent an old correction from changing a later
export silently. Evidence artifacts are checked again on every build.
"""
from __future__ import annotations

from copy import deepcopy
from datetime import datetime
import json
from pathlib import Path

from src.assess.artifact_verification import artifact_hash, record_hash

CORRECTIONS_PATH = "corpus/metadata_corrections.json"
ALLOWED_FIELDS = {"title", "creators", "date", "DOI", "url", "itemType", "publicationTitle", "publisher", "repository", "abstractNote"}


def apply_metadata_corrections(repo: Path, items: list[dict]) -> list[dict]:
    path = repo / CORRECTIONS_PATH
    if not path.is_file():
        return deepcopy(items)
    data = json.loads(path.read_text(encoding="utf-8"))
    if data.get("schema") != "femprompt-metadata-corrections/0.1":
        raise ValueError("Unsupported metadata correction schema")
    projected = deepcopy(items)
    by_key = {item["key"]: item for item in projected}
    seen = set()
    for correction in data.get("corrections", []):
        key = correction.get("record_id")
        if key in seen or key not in by_key:
            raise ValueError(f"Unknown or repeated metadata correction: {key}")
        seen.add(key)
        item = by_key[key]
        if correction.get("base_sha256") != record_hash(item):
            raise ValueError(f"Stale metadata correction: {key}")
        for field in ("agent_id", "model", "reviewed_at", "findings"):
            if not isinstance(correction.get(field), str) or not correction[field].strip():
                raise ValueError(f"Metadata correction lacks {field}: {key}")
        if datetime.fromisoformat(correction["reviewed_at"].replace("Z", "+00:00")).tzinfo is None:
            raise ValueError(f"Metadata correction needs a timezone: {key}")
        if correction.get("authority") != "ai-source-reviewed-metadata":
            raise ValueError(f"Invalid metadata correction authority: {key}")
        evidence = correction.get("evidence")
        if not isinstance(evidence, list) or not evidence:
            raise ValueError(f"Metadata correction lacks evidence: {key}")
        for source in evidence:
            if not source.get("source_url") or not source.get("locator"):
                raise ValueError(f"Metadata correction lacks source locator: {key}")
            if artifact_hash(repo, source["source_path"]) != source.get("sha256"):
                raise ValueError(f"Stale metadata evidence: {key}")
        changes = correction.get("changes")
        if not isinstance(changes, list) or not changes:
            raise ValueError(f"Metadata correction has no changes: {key}")
        fields = set()
        for change in changes:
            field = change.get("field")
            if field not in ALLOWED_FIELDS or field in fields:
                raise ValueError(f"Unsupported or repeated metadata field: {field}")
            fields.add(field)
            if item.get(field) != change.get("before") or "after" not in change or not change.get("reason"):
                raise ValueError(f"Metadata correction does not match base field: {key}/{field}")
            item[field] = deepcopy(change["after"])
        item["_metadata_correction"] = {key: deepcopy(correction[key]) for key in (
            "record_id", "base_sha256", "agent_id", "model", "reviewed_at", "findings", "authority", "changes", "evidence"
        )}
    return projected


def corrected_csv_metadata(repo: Path, metadata: dict[str, dict]) -> dict[str, dict]:
    """Overlay only reconciled records on the historical CSV metadata view."""
    if not (repo / CORRECTIONS_PATH).is_file():
        return metadata
    items = json.loads((repo / "corpus/zotero_export.json").read_text(encoding="utf-8"))
    result = deepcopy(metadata)
    for item in apply_metadata_corrections(repo, items):
        if "_metadata_correction" not in item:
            continue
        row = result.setdefault(item["key"], {})
        columns = {"title": "Title", "date": "Year", "DOI": "DOI", "url": "URL", "itemType": "Item_Type", "publicationTitle": "Journal", "abstractNote": "Abstract"}
        for change in item["_metadata_correction"]["changes"]:
            field = change["field"]
            if field in columns:
                value = item.get(field) or ""
                row[columns[field]] = str(value)[:4] if field == "date" else value
            elif field == "creators":
                row["Authors"] = "; ".join(" ".join(filter(None, (c.get("firstName"), c.get("lastName") or c.get("name")))) for c in item[field] if c.get("creatorType") == "author")
        row["_metadata_correction"] = item["_metadata_correction"]
    return result
