"""Apply a source-backed title correction in the existing script pipeline.

Read an explicit plan with the complete old item and hash-bound source evidence,
then PATCH only its title in the fixed project group. The creation-only importer
remains unchanged. Store the attempted operation before sending it and read back
every result, including an uncertain response. Never retry a write automatically.
The operation follows knowledge/plan.md, Controlled corpus completion, and
https://www.zotero.org/support/dev/web_api/v3/write_requests.

python -m src.acquire.zotero_title_correction --plan PATH [--apply]
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
from src.assess.artifact_verification import artifact_hash, safe_path
from src.utils import get_env_var, load_env_file, setup_windows_encoding


def patch_title(client: GroupClient, item: dict, title: str) -> None:
    """Send one conditional, single-field update without widening the importer."""
    request = Request(
        f"https://api.zotero.org/groups/{GROUP_ID}/items/{item['key']}",
        data=json.dumps({"title": title}, ensure_ascii=False).encode("utf-8"),
        method="PATCH",
        headers={
            "Zotero-API-Key": client.key,
            "Zotero-API-Version": "3",
            "Content-Type": "application/json",
            "If-Unmodified-Since-Version": str(item["version"]),
            "User-Agent": "FemPrompt-Title-Correction/1 (https://github.com/chpollin/FemPrompt_SozArb)",
        },
    )
    with urlopen(request, timeout=45) as response:
        if response.status != 204:
            raise RuntimeError(f"Unexpected title-write status: {response.status}")


def apply_correction(client: GroupClient, plan: dict, receipt_path: Path) -> dict:
    """Reject stale plans and verify that all unrelated item fields survive."""
    before = plan["before"]
    title = plan["title"]
    if (
        plan.get("group_id") != GROUP_ID
        or not re.fullmatch(r"[A-Z0-9]{8}", str(before.get("key", "")))
        or not isinstance(before.get("version"), int)
        or not isinstance(title, str)
        or not title.strip()
        or title == before.get("title")
        or not plan.get("evidence")
    ):
        raise ValueError("Invalid title-correction plan")
    for source in plan["evidence"]:
        if not source.get("source_url") or not source.get("locator"):
            raise ValueError("Title correction lacks a source locator")
        if artifact_hash(REPO, source["source_path"]) != source.get("sha256"):
            raise ValueError("Title correction evidence changed")
        quote = source.get("quote")
        text = safe_path(REPO, source["source_path"]).read_text(encoding="utf-8")
        if (
            not isinstance(quote, str)
            or not quote.strip()
            or " ".join(quote.split()) not in " ".join(text.split())
            or " ".join(title.split()).casefold()
            not in " ".join(quote.split()).casefold()
        ):
            raise ValueError("Title correction lacks a resolving title quotation")
    if receipt_path.exists():
        raise ValueError(
            "Receipt already exists; inspect it before preparing another operation"
        )
    path = f"/groups/{GROUP_ID}/items/{before['key']}"
    current, _ = client.request(path)
    if current["data"] != before:
        raise ValueError("Zotero item changed since planning")
    receipt = {
        "schema": "femprompt-zotero-title-correction/1.0",
        "attempted_at": datetime.now(timezone.utc).isoformat(),
        "group_id": GROUP_ID,
        "before": before,
        "title": title,
        "evidence": plan["evidence"],
        "status": "attempting",
    }
    save_json(receipt_path, receipt)
    try:
        patch_title(client, before, title)
    except Exception as error:
        receipt["write_error"] = str(error).replace(client.key, "[redacted]")
    try:
        after, _ = client.request(path)
        receipt["after"] = after["data"]
        expected = {**before, "title": title}
        ignored = {"version", "dateModified"}
        mismatch = [
            field
            for field in expected.keys() | after["data"].keys()
            if field not in ignored and expected.get(field) != after["data"].get(field)
        ]
        receipt["mismatched_fields"] = sorted(mismatch)
        receipt["status"] = "verified" if not mismatch else "readback_mismatch"
    except Exception as error:
        receipt["status"] = "readback_failed"
        receipt["readback_error"] = str(error).replace(client.key, "[redacted]")
    save_json(receipt_path, receipt)
    if receipt["status"] != "verified":
        raise RuntimeError(
            "Title update is not verified; inspect the receipt before continuing"
        )
    return receipt


def main() -> int:
    setup_windows_encoding()
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--plan", type=Path, required=True)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    plan = json.loads(args.plan.read_text(encoding="utf-8"))
    if not args.apply:
        print(
            json.dumps(
                {
                    "key": plan["before"]["key"],
                    "before": plan["before"]["title"],
                    "after": plan["title"],
                },
                ensure_ascii=False,
            )
        )
        return 0
    load_env_file(REPO / ".env")
    key = get_env_var("ZOTERO_API_KEY", required=True)
    try:
        client = GroupClient(key)
        client.check_access()
        apply_correction(
            client, plan, args.plan.with_name("title-correction-receipt.json")
        )
        print("[OK] Title correction read back; unrelated fields preserved")
        return 0
    except Exception as error:
        print(f"[FEHLER] {str(error).replace(key, '[redacted]')}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
