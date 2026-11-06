"""Attach acquired full-text PDFs to existing items of the project group in Zotero.

Implements decision 21 of knowledge/plan.md (full texts belong to their Zotero record)
for files acquired through the University of Graz licence or open access. Follows the
Zotero Web API file-upload sequence: create a child attachment, authorise the upload with
the file's MD5, send the bytes to the returned URL, register the upload, then read back
the stored MD5. The plan binds each file by SHA-256; one receipt records every step;
nothing is retried automatically. https://www.zotero.org/support/dev/web_api/v3/file_upload

python -m src.acquire.zotero_attachment_upload --plan PATH [--apply]
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from src.acquire.zotero_group_import import GROUP_ID, REPO, GroupClient, save_json
from src.utils import get_env_var, load_env_file, setup_windows_encoding

USER_AGENT = "FemPrompt-Attachment-Upload/1 (https://github.com/chpollin/FemPrompt_SozArb)"


def digest(path: Path, name: str) -> str:
    h = hashlib.new(name)
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def call(client: GroupClient, method: str, url: str, body: bytes, headers: dict) -> tuple[int, bytes]:
    base = {"Zotero-API-Key": client.key, "Zotero-API-Version": "3", "User-Agent": USER_AGENT}
    request = Request(url, data=body, method=method, headers={**base, **headers})
    with urlopen(request, timeout=120) as response:
        return response.status, response.read()


def validate(plan: dict) -> None:
    if plan.get("group_id") != GROUP_ID or not plan.get("files"):
        raise ValueError("Invalid attachment plan")
    for entry in plan["files"]:
        path = REPO / entry["path"]
        if not re.fullmatch(r"[A-Z0-9]{8}", str(entry.get("parent", ""))) or not path.is_file():
            raise ValueError(f"Invalid attachment entry: {entry.get('parent')}")
        if "sha256:" + digest(path, "sha256") != entry.get("sha256"):
            raise ValueError(f"{entry['parent']}: file changed since planning")
        if not entry.get("filename", "").endswith(".pdf"):
            raise ValueError(f"{entry['parent']}: attachment filename must end in .pdf")


def upload_one(client: GroupClient, entry: dict) -> dict:
    path = REPO / entry["path"]
    md5 = digest(path, "md5")
    group = f"https://api.zotero.org/groups/{GROUP_ID}"
    children, _ = client.request(f"/groups/{GROUP_ID}/items/{entry['parent']}/children")
    if any(c["data"].get("contentType") == "application/pdf" and c["data"].get("md5") == md5 for c in children):
        return {"status": "already_attached"}
    item = {"itemType": "attachment", "parentItem": entry["parent"], "linkMode": "imported_file",
            "title": entry.get("title", "Full Text PDF"), "contentType": "application/pdf", "charset": "",
            "filename": entry["filename"], "tags": [], "relations": {}, "note": entry.get("note", "")}
    _, raw = call(client, "POST", f"{group}/items", json.dumps([item]).encode("utf-8"),
                  {"Content-Type": "application/json"})
    created = json.loads(raw)
    key = created.get("successful", {}).get("0", {}).get("key")
    if not key:
        return {"status": "create_failed", "response": created.get("failed")}
    result = {"attachment_key": key, "md5": md5}
    form = urlencode({"md5": md5, "filename": entry["filename"], "filesize": path.stat().st_size,
                      "mtime": int(path.stat().st_mtime * 1000)}).encode()
    _, raw = call(client, "POST", f"{group}/items/{key}/file", form,
                  {"Content-Type": "application/x-www-form-urlencoded", "If-None-Match": "*"})
    auth = json.loads(raw)
    if not auth.get("exists"):
        body = auth["prefix"].encode("latin-1") + path.read_bytes() + auth["suffix"].encode("latin-1")
        upload = Request(auth["url"], data=body, method="POST", headers={"Content-Type": auth["contentType"]})
        with urlopen(upload, timeout=300) as response:
            if response.status not in (200, 201):
                return {**result, "status": f"storage_status_{response.status}"}
        call(client, "POST", f"{group}/items/{key}/file", urlencode({"upload": auth["uploadKey"]}).encode(),
             {"Content-Type": "application/x-www-form-urlencoded", "If-None-Match": "*"})
    stored, _ = client.request(f"/groups/{GROUP_ID}/items/{key}")
    result["stored_md5"] = stored["data"].get("md5")
    result["status"] = "verified" if stored["data"].get("md5") == md5 else "readback_mismatch"
    return result


def main() -> int:
    setup_windows_encoding()
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--plan", type=Path, required=True)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    plan = json.loads(args.plan.read_text(encoding="utf-8"))
    validate(plan)
    if not args.apply:
        for entry in plan["files"]:
            print(entry["parent"], entry["filename"])
        return 0
    receipt_path = args.plan.with_name(args.plan.stem + "-receipt.json")
    if receipt_path.exists():
        print("[FEHLER] Receipt already exists; inspect it before preparing another operation", file=sys.stderr)
        return 1
    load_env_file(REPO / ".env")
    key = get_env_var("ZOTERO_API_KEY", required=True)
    client = GroupClient(key)
    client.check_access()
    receipt = {"schema": "femprompt-zotero-attachment-upload/1.0", "attempted_at": datetime.now(timezone.utc).isoformat(),
               "group_id": GROUP_ID, "files": []}
    for entry in plan["files"]:
        record = {**entry, "status": "attempting"}
        receipt["files"].append(record)
        save_json(receipt_path, receipt)
        try:
            record.update(upload_one(client, entry))
        except Exception as error:
            record["status"] = "error"
            record["error"] = str(error).replace(key, "[redacted]")
        save_json(receipt_path, receipt)
        if record["status"] not in ("verified", "already_attached"):
            print(f"[FEHLER] {entry['parent']}: {record['status']}; inspect the receipt", file=sys.stderr)
            return 1
    print(f"[OK] {len(plan['files'])} attachments verified by MD5")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
