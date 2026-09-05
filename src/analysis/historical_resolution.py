"""Validate targeted historical reconciliations without rewriting human records."""
from __future__ import annotations

from datetime import datetime
import json
from pathlib import Path

from src.assess.artifact_verification import artifact_hash, record_hash, safe_path

RESOLUTION_PATH = "generated/verification/historical-resolution-2026-09-05.json"


def load_source_holds(repo: Path) -> dict[str, dict]:
    """Expose source-grounded restrictive holds to every publication consumer."""
    path = repo / RESOLUTION_PATH
    if not path.is_file():
        return {}
    data = json.loads(path.read_text(encoding="utf-8"))
    if data.get("schema") != "femprompt-historical-resolution/0.1":
        raise ValueError("Unsupported historical resolution schema")
    holds = {}
    for work_id, entry in data.get("work_resolutions", {}).items():
        if not entry.get("withhold_from_current_synthesis"):
            continue
        if entry.get("work_id") != work_id or not work_id.startswith("work:"):
            raise ValueError("Source hold work identity differs from its key")
        for field in ("agent_id", "model", "reviewed_at", "reason"):
            if not entry.get(field):
                raise ValueError(f"Source hold lacks {field}")
        if datetime.fromisoformat(entry["reviewed_at"].replace("Z", "+00:00")).tzinfo is None:
            raise ValueError("Source hold timestamp needs a timezone")
        if not entry.get("evidence"):
            raise ValueError("Source hold lacks evidence")
        for evidence in entry["evidence"]:
            if artifact_hash(repo, evidence["source_path"]) != evidence.get("sha256"):
                raise ValueError("Stale source hold evidence")
        pointer = work_id.replace("~", "~0").replace("/", "~1")
        artifact = f"{RESOLUTION_PATH}#/work_resolutions/{pointer}"
        holds[work_id] = {"artifact": artifact, "sha256": artifact_hash(repo, artifact),
                          "kind": "integrity_hold" if entry.get("integrity_hold") else "source_version_hold",
                          **{key: entry[key] for key in ("reason", "agent_id", "model", "reviewed_at")}}
    return holds


def load_resolution(repo: Path, registry: dict, human: list[dict], inputs: set[str]) -> dict:
    path = repo / RESOLUTION_PATH
    if not path.exists():
        return {}
    data = json.loads(path.read_text(encoding="utf-8"))
    if data.get("schema") != "femprompt-historical-resolution/0.1":
        raise ValueError("Unsupported historical resolution schema")
    inputs.add(RESOLUTION_PATH)
    human_by_id = {}
    for row in human:
        human_by_id.setdefault(row["Zotero_Key"], []).append(row)
    index = registry["record_index"]

    def row_matches(key, expected):
        matches = [r for r in human_by_id.get(key, []) if record_hash(r) == expected]
        if len(matches) != 1:
            raise ValueError(f"Historical resolution has a stale or ambiguous row: {key}")
        return matches[0]

    def verify(entry):
        for field in ("agent_id", "model", "reviewed_at", "reason"):
            if not isinstance(entry.get(field), str) or not entry[field].strip():
                raise ValueError(f"Historical resolution lacks {field}")
        if datetime.fromisoformat(entry["reviewed_at"].replace("Z", "+00:00")).tzinfo is None:
            raise ValueError("Historical resolution timestamp needs a timezone")
        if entry.get("human_annotations_unchanged") is not True:
            raise ValueError("Historical resolution cannot overwrite human annotations")
        evidence = entry.get("evidence", [])
        if entry.get("outcome") == "resolved" and not evidence:
            raise ValueError("Resolved historical finding lacks evidence")
        for source in evidence:
            reference = source["source_path"]
            if artifact_hash(repo, reference) != source.get("sha256"):
                raise ValueError(f"Stale historical resolution evidence: {reference}")
            if not source.get("locator") or (entry.get("outcome") == "resolved" and not source.get("source_url")):
                raise ValueError("Historical resolution evidence lacks a source locator")
            if source.get("quote"):
                text = safe_path(repo, reference.partition("#")[0]).read_text(encoding="utf-8")
                if " ".join(source["quote"].split()) not in " ".join(text.split()):
                    raise ValueError(f"Historical resolution quote does not resolve: {reference}")
            inputs.add(reference.partition("#")[0])

    for key, entry in data.get("identity_resolutions", {}).items():
        verify(entry)
        if entry.get("record_id") != key:
            raise ValueError("Historical identity resolution key differs from its record")
        row_matches(key, entry.get("historical_row_sha256"))
        if entry.get("outcome") != "resolved":
            continue
        if key in index:
            raise ValueError(f"Historical record now has a canonical binding; reconcile the old projection: {key}")
        expected = {"work_id": entry["target_work_id"], "version_id": entry["target_version_id"]}
        if not entry.get("target_record_ids") or any(index.get(target) != expected for target in entry["target_record_ids"]):
            raise ValueError(f"Historical resolution target identity changed: {key}")
    for work_id, entry in data.get("work_resolutions", {}).items():
        verify(entry)
        if entry.get("work_id") != work_id or not entry.get("record_ids") or any(index.get(key, {}).get("work_id") != work_id for key in entry["record_ids"]):
            raise ValueError(f"Historical work resolution crosses identities: {work_id}")
        for old in entry.get("historical_rows", []):
            row_matches(old["record_id"], old["historical_row_sha256"])
        for disposition in entry.get("administrative_record_dispositions", []):
            row = row_matches(disposition["record_id"], disposition["historical_row_sha256"])
            if disposition.get("kind") != "metadata_error" or row.get("Decision") != "Exclude" or index.get(disposition["record_id"]) != disposition.get("target_registry_binding") or disposition.get("target_work_id") != work_id:
                raise ValueError("Invalid administrative metadata disposition")
    return data
