"""Apply source-backed field corrections, relations, tags and audit notes in Zotero.

Generalises src/acquire/zotero_title_correction.py under the operator authorisation
of 3 October 2026 for source-reviewed metadata correction with retained old values,
reciprocal relations and the tag `Prüfung: Quellenidentität offen` (knowledge/governance.md,
Authorised Zotero organisation). Each operation names one existing item, its complete
planned `before` data, the exact fields to set and hash-bound evidence. Writes are
conditional on the item version, read back field by field, recorded in one receipt and
never retried automatically. Deleting or merging items is outside this tool.

python -m src.acquire.zotero_field_correction --plan PATH [--apply]
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen

from src.acquire.zotero_group_import import GROUP_ID, REPO, GroupClient, save_json
from src.assess.artifact_verification import artifact_hash
from src.utils import get_env_var, load_env_file, setup_windows_encoding

# Bibliographic fields plus organisation fields; key, item type and attachments stay untouched.
ALLOWED_FIELDS = {
    "title", "creators", "date", "DOI", "url", "bookTitle", "proceedingsTitle",
    "conferenceName", "publisher", "place", "series", "ISBN", "tags", "relations",
}
USER_AGENT = "FemPrompt-Field-Correction/1 (https://github.com/chpollin/FemPrompt_SozArb)"


def send(client: GroupClient, method: str, path: str, payload: object, version: int | None) -> int:
    headers = {
        "Zotero-API-Key": client.key,
        "Zotero-API-Version": "3",
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
    }
    if version is not None:
        headers["If-Unmodified-Since-Version"] = str(version)
    request = Request(
        f"https://api.zotero.org{path}",
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        method=method,
        headers=headers,
    )
    with urlopen(request, timeout=45) as response:
        return response.status


def normalised(field: str, value: object) -> object:
    """Zotero stores a single relation as a string and several as a list; compare both forms alike."""
    if field == "relations" and isinstance(value, dict):
        return {k: sorted([v] if isinstance(v, str) else v) for k, v in value.items()}
    return value


def validate_plan(plan: dict) -> None:
    if plan.get("group_id") != GROUP_ID or not plan.get("operations"):
        raise ValueError("Invalid field-correction plan")
    for op in plan["operations"]:
        before = op.get("before", {})
        if not re.fullmatch(r"[A-Z0-9]{8}", str(before.get("key", ""))) or not isinstance(before.get("version"), int):
            raise ValueError("Operation lacks the complete planned item")
        changes = op.get("set", {})
        if set(changes) - ALLOWED_FIELDS:
            raise ValueError(f"{before['key']}: field outside the correction scope")
        if not changes and not op.get("note"):
            raise ValueError(f"{before['key']}: operation changes nothing")
        if any(before.get(field) == value for field, value in changes.items()):
            raise ValueError(f"{before['key']}: planned value equals the current value")
        if not op.get("evidence"):
            raise ValueError(f"{before['key']}: correction lacks evidence")
        for source in op["evidence"]:
            if not source.get("locator") or artifact_hash(REPO, source["source_path"]) != source.get("sha256"):
                raise ValueError(f"{before['key']}: evidence missing or changed")


def apply_plan(client: GroupClient, plan: dict, receipt_path: Path) -> dict:
    validate_plan(plan)
    if receipt_path.exists():
        raise ValueError("Receipt already exists; inspect it before preparing another operation")
    receipt = {
        "schema": "femprompt-zotero-field-correction/1.0",
        "attempted_at": datetime.now(timezone.utc).isoformat(),
        "group_id": GROUP_ID,
        "plan_reason": plan.get("reason"),
        "operations": [],
    }
    save_json(receipt_path, receipt)
    for op in plan["operations"]:
        before = op["before"]
        path = f"/groups/{GROUP_ID}/items/{before['key']}"
        entry = {"key": before["key"], "before": before, "set": op.get("set", {}), "note": op.get("note"),
                 "evidence": op["evidence"]}
        receipt["operations"].append(entry)
        current, _ = client.request(path)
        if current["data"] != before:
            entry["status"] = "skipped_item_changed_since_planning"
            save_json(receipt_path, receipt)
            continue
        if entry["set"]:
            entry["status"] = "attempting"
            save_json(receipt_path, receipt)
            try:
                send(client, "PATCH", path, entry["set"], before["version"])
            except Exception as error:
                entry["write_error"] = str(error).replace(client.key, "[redacted]")
            after, _ = client.request(path)
            expected = {**before, **entry["set"]}
            ignored = {"version", "dateModified"}
            mismatch = sorted(
                field for field in expected.keys() | after["data"].keys()
                if field not in ignored
                and normalised(field, expected.get(field)) != normalised(field, after["data"].get(field))
            )
            entry["after"] = after["data"]
            entry["mismatched_fields"] = mismatch
            entry["status"] = "verified" if not mismatch else "readback_mismatch"
            save_json(receipt_path, receipt)
            if mismatch:
                raise RuntimeError(f"{before['key']}: update not verified; inspect the receipt")
        if entry.get("note"):
            note = {"itemType": "note", "parentItem": before["key"], "note": entry["note"], "tags": [], "relations": {}}
            try:
                send(client, "POST", f"/groups/{GROUP_ID}/items", [note], None)
            except Exception as error:
                entry["note_error"] = str(error).replace(client.key, "[redacted]")
            children, _ = client.request(f"{path}/children")
            entry["note_status"] = (
                "verified" if any(c["data"].get("note") == entry["note"] for c in children) else "readback_missing"
            )
            if entry.get("status") in (None, "attempting"):
                entry["status"] = entry["note_status"]
            save_json(receipt_path, receipt)
            if entry["note_status"] != "verified":
                raise RuntimeError(f"{before['key']}: audit note not verified; inspect the receipt")
    return receipt


def main() -> int:
    setup_windows_encoding()
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--plan", type=Path, required=True)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    plan = json.loads(args.plan.read_text(encoding="utf-8"))
    validate_plan(plan)
    if not args.apply:
        for op in plan["operations"]:
            print(json.dumps({"key": op["before"]["key"], "set": op.get("set"), "note": bool(op.get("note"))},
                             ensure_ascii=False))
        return 0
    load_env_file(REPO / ".env")
    key = get_env_var("ZOTERO_API_KEY", required=True)
    try:
        client = GroupClient(key)
        client.check_access()
        apply_plan(client, plan, args.plan.with_name(args.plan.stem + "-receipt.json"))
        print("[OK] Field corrections read back; unrelated fields preserved")
        return 0
    except Exception as error:
        print(f"[FEHLER] {str(error).replace(key, '[redacted]')}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
