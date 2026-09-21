"""Add missing prepared RIS records to the authorised FemPrompt Zotero group.

Script-pipeline regime, retaining the repository's existing module layout.
The operator authorised additive group writes on 2026-09-21 (knowledge/plan.md).
Read the live library, preserve RIS fields in API templates, and write a local
plan. --apply accepts that exact plan while the library version is unchanged.
Every creation uses a version precondition and is read back. Existing items are
never updated. Ambiguous identities are held for curation. Writes are not retried
automatically because a timeout may follow a successful creation.

python -m src.acquire.zotero_group_import --out generated/zotero-sync/<run>
python -m src.acquire.zotero_group_import --apply generated/zotero-sync/<run>/plan.json
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import time
from pathlib import Path
from typing import Any
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from src.acquire.zotero_group_reconcile import (
    DEFAULT_LANE_RIS,
    DEFAULT_RIS,
    GROUP_ID,
    REPO,
    _library_item,
    extract_year,
    normalise_doi,
    normalise_title,
)
from src.analysis.build_round2_intake import parse_ris
from src.utils import get_env_var, load_env_file, setup_windows_encoding

TYPES = {
    "JOUR": "journalArticle",
    "CONF": "conferencePaper",
    "CHAP": "bookSection",
    "RPRT": "report",
    "GEN": "document",
    "UNPB": "manuscript",
}
FIELDS = {
    "TI": "title",
    "T1": "title",
    "DO": "DOI",
    "UR": "url",
    "VL": "volume",
    "IS": "issue",
    "PB": "publisher",
    "CY": "place",
    "LA": "language",
    "AB": "abstractNote",
    "SN": "ISBN",
}


class GroupClient:
    """Hold the credential and restrict writes to new items in the fixed group."""

    def __init__(self, key: str) -> None:
        self.key = key

    def request(
        self, path: str, payload: Any = None, version: int | None = None
    ) -> tuple[Any, int | None]:
        if payload is not None and (
            path != f"/groups/{GROUP_ID}/items" or version is None
        ):
            raise ValueError(
                "Only version-guarded item creation in the project group is allowed"
            )
        headers = {
            "Zotero-API-Key": self.key,
            "Zotero-API-Version": "3",
            "User-Agent": "FemPrompt-Zotero-Import/1 (https://github.com/chpollin/FemPrompt_SozArb)",
        }
        body = None
        if payload is not None:
            if any("key" in item or "version" in item for item in payload):
                raise ValueError("Existing-item writes are not supported")
            headers.update(
                {
                    "Content-Type": "application/json",
                    "If-Unmodified-Since-Version": str(version),
                }
            )
            body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        try:
            with urlopen(
                Request("https://api.zotero.org" + path, data=body, headers=headers),
                timeout=45,
            ) as response:
                data = json.load(response)
                revision = response.headers.get("Last-Modified-Version")
                backoff = float(response.headers.get("Backoff", "0"))
        except HTTPError as error:
            detail = (
                error.read()
                .decode("utf-8", errors="replace")
                .replace(self.key, "[redacted]")
            )
            raise RuntimeError(f"Zotero HTTP {error.code}: {detail[:800]}") from None
        except Exception as error:
            raise RuntimeError(str(error).replace(self.key, "[redacted]")) from None
        if backoff > 60:
            raise RuntimeError(
                "Zotero requests a backoff longer than one minute; resume after checking the receipt"
            )
        time.sleep(max(0.15, backoff))
        return data, int(revision) if revision is not None else None

    def check_access(self) -> None:
        info, _ = self.request("/keys/current")
        access = info.get("access", {})
        groups = access.get("groups", {})
        grant = groups.get(GROUP_ID, {})
        if any(access.get("user", {}).values()) or set(groups) != {GROUP_ID}:
            raise ValueError("Use a key restricted to the project group")
        if not grant.get("library") or not grant.get("write"):
            raise ValueError("The project group requires read/write access")

    def snapshot(self) -> dict[str, Any]:
        items: list[dict[str, Any]] = []
        version = None
        while True:
            page, current = self.request(
                f"/groups/{GROUP_ID}/items/top?format=json&limit=100&start={len(items)}"
            )
            if (
                not isinstance(page, list)
                or current is None
                or (version is not None and version != current)
            ):
                raise ValueError(
                    "Invalid or changing library snapshot; read the library again"
                )
            version = current
            items.extend(page)
            if len(page) < 100:
                return {"version": version, "items": items}


def save_json(path: Path, data: Any) -> None:
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    temporary.replace(path)


def identity(record: dict[str, list[str]]) -> dict[str, str]:
    return {
        "title": (record.get("TI") or record.get("T1") or [""])[0],
        "year": extract_year((record.get("PY") or record.get("DA") or [""])[0]),
        "doi": normalise_doi((record.get("DO") or [""])[0]),
    }


def classify(
    record: dict[str, str], items: list[dict[str, Any]]
) -> tuple[str, list[str]]:
    title = normalise_title(record["title"])
    same_doi = [i for i in items if record["doi"] and i["doi"] == record["doi"]]
    if same_doi:
        status = (
            "present"
            if all(normalise_title(i["title"]) == title for i in same_doi)
            else "ambiguous"
        )
        return status, [i["key"] for i in same_doi]
    same_title = [i for i in items if normalise_title(i["title"]) == title]
    if same_title:
        exact = [
            i
            for i in same_title
            if record["year"]
            and i["year"] == record["year"]
            and not (record["doi"] and i["doi"] and record["doi"] != i["doi"])
        ]
        return (
            ("present", [i["key"] for i in exact])
            if exact
            else ("ambiguous", [i["key"] for i in same_title])
        )
    return "missing", []


def to_item(
    record: dict[str, list[str]], template: dict[str, Any], source: str
) -> dict[str, Any]:
    """Preserve unrepresentable fields in Extra, and preserve unsplit creator names."""
    if not normalise_title(identity(record)["title"]):
        raise ValueError("RIS record has no usable title")
    if "\ufffd" in json.dumps(record, ensure_ascii=False):
        raise ValueError("RIS record contains a replacement character")
    item = json.loads(json.dumps(template))
    extra = [
        f"FemPrompt import source: {source}",
        "Screening-Status: identified_not_screened",
    ]
    used = {"TY", "AU", "KW", "N1", "PY", "DA", "SP", "EP"}
    for tag, field in FIELDS.items():
        if record.get(tag) and field in item:
            value = record[tag][0]
            item[field] = normalise_doi(value) if tag == "DO" else value
            if tag == "DO" and not item[field]:
                raise ValueError("RIS DOI is not a valid identifier")
            used.add(tag)
    item["date"] = (record.get("DA") or record.get("PY") or [""])[0]
    item["creators"] = []
    for author in record.get("AU", []):
        if "," in author:
            last, first = author.split(",", 1)
            item["creators"].append(
                {
                    "creatorType": "author",
                    "firstName": first.strip(),
                    "lastName": last.strip(),
                }
            )
        else:
            item["creators"].append({"creatorType": "author", "name": author})
    item["tags"] = [{"tag": value} for value in dict.fromkeys(record.get("KW", []))]
    container = {
        "journalArticle": "publicationTitle",
        "conferencePaper": "proceedingsTitle",
        "bookSection": "bookTitle",
        "report": "institution",
    }.get(item["itemType"])
    if record.get("T2") and container in item:
        item[container] = record["T2"][0]
        used.add("T2")
    if record.get("SP"):
        pages = record["SP"][0] + ("-" + record["EP"][0] if record.get("EP") else "")
        if "pages" in item:
            item["pages"] = pages
        else:
            extra.append(f"Pages: {pages}")
    extra.extend(record.get("N1", []))
    for tag, values in record.items():
        if tag not in used:
            extra.extend(
                f"{'DOI' if tag == 'DO' else 'RIS-' + tag}: {v}" for v in values
            )
    extra.append(f"RIS-Type: {record['TY'][0]}")
    item["extra"] = "\n".join(extra)
    return item


def prepare(
    client: GroupClient, snapshot: dict[str, Any], paths: list[Path]
) -> dict[str, Any]:
    items = [
        _library_item(i["key"], i["version"], i["data"])
        for i in snapshot["items"]
        if i["data"]["itemType"] not in {"note", "attachment", "annotation"}
    ]
    if any(i is None for i in items):
        raise ValueError("Snapshot contains an invalid item")
    templates: dict[str, Any] = {}
    records = []
    inputs = {}
    for path in paths:
        source = path.relative_to(REPO).as_posix()
        inputs[source] = hashlib.sha256(path.read_bytes()).hexdigest()
        for index, record in enumerate(parse_ris(path), 1):
            candidate = identity(record)
            status, matches = classify(candidate, items)
            entry = {
                "source": source,
                "index": index,
                **candidate,
                "status": status,
                "matches": matches,
            }
            if status == "missing":
                try:
                    kind = TYPES[record["TY"][0]]
                    if kind not in templates:
                        templates[kind], _ = client.request(
                            f"/items/new?itemType={kind}"
                        )
                    entry["payload"] = to_item(record, templates[kind], source)
                    entry["status"] = "create"
                    items.append({**candidate, "key": f"planned:{len(records)}"})
                except (KeyError, ValueError) as error:
                    entry.update(status="invalid", error=str(error))
            records.append(entry)
    return {
        "group": GROUP_ID,
        "library_version": snapshot["version"],
        "inputs": inputs,
        "records": records,
    }


def differences(expected: dict[str, Any], actual: dict[str, Any]) -> list[str]:
    # Zotero sorts tags on storage. Creator order, in contrast, is meaningful.
    def comparable(field: str, value: Any) -> Any:
        if field == "tags" and isinstance(value, list):
            return sorted((tag["tag"], tag.get("type", 0)) for tag in value)
        return value

    return [
        field
        for field, value in expected.items()
        if comparable(field, actual.get(field)) != comparable(field, value)
    ]


def apply(client: GroupClient, plan: dict[str, Any], folder: Path) -> dict[str, Any]:
    if plan.get("group") != GROUP_ID:
        raise ValueError("Plan targets another group")
    for source, digest in plan["inputs"].items():
        if hashlib.sha256((REPO / source).read_bytes()).hexdigest() != digest:
            raise ValueError(f"Changed input: {source}; prepare again")
    before = client.snapshot()
    if before["version"] != plan["library_version"]:
        raise ValueError("Library changed since planning; prepare again")
    receipt_path = folder / "receipt.json"
    if receipt_path.exists():
        raise ValueError(
            "A receipt already exists; inspect it and prepare a fresh plan"
        )
    receipt: dict[str, Any] = {
        "group": GROUP_ID,
        "before_version": before["version"],
        "created": [],
        "errors": [],
        "pending": None,
    }
    save_json(folder / "before.json", before)
    save_json(receipt_path, receipt)
    version = before["version"]
    for entry in plan["records"]:
        if entry["status"] != "create":
            continue
        receipt["pending"] = {
            "source": entry["source"],
            "index": entry["index"],
            "title": entry["title"],
        }
        save_json(receipt_path, receipt)
        try:
            result, next_version = client.request(
                f"/groups/{GROUP_ID}/items", [entry["payload"]], version
            )
            if result.get("failed") or result.get("unchanged") or next_version is None:
                raise ValueError(f"Creation failed or was ambiguous: {result}")
            success = result.get("successful", {}).get("0")
            key = success.get("key") if success else result.get("success", {}).get("0")
            if not isinstance(key, str) or not re.fullmatch(r"[A-Z0-9]{8}", key):
                raise ValueError("Creation did not return one valid item key")
            receipt["created"].append(
                {**receipt["pending"], "key": key, "verified": False}
            )
            save_json(receipt_path, receipt)
            observed, _ = client.request(f"/groups/{GROUP_ID}/items/{key}")
            changed = differences(entry["payload"], observed["data"])
            if changed:
                raise ValueError(f"Read-back mismatch for {key}: {changed}")
            receipt["created"][-1]["verified"] = True
            receipt["pending"] = None
            version = next_version
            save_json(receipt_path, receipt)
            print(f"[OK] Created and read back {key}", flush=True)
        except Exception as error:
            # An uncertain external write invalidates the batch's version contract.
            # Stop rather than retry or continue into possible duplicate creation.
            receipt["errors"].append(str(error).replace(client.key, "[redacted]"))
            save_json(receipt_path, receipt)
            raise
    after = client.snapshot()
    save_json(folder / "after.json", after)
    current = {i["key"]: i["data"] for i in after["items"]}
    changed_keys = [
        i["key"] for i in before["items"] if current.get(i["key"]) != i["data"]
    ]
    receipt["existing_items_changed"] = changed_keys
    receipt["after_version"] = after["version"]
    save_json(receipt_path, receipt)
    if changed_keys:
        raise ValueError(
            "Existing library items changed during the run; inspect the snapshots"
        )
    return receipt


def main(argv: list[str] | None = None) -> int:
    setup_windows_encoding()
    parser = argparse.ArgumentParser(description=__doc__)
    action = parser.add_mutually_exclusive_group(required=True)
    action.add_argument("--out", type=Path)
    action.add_argument("--apply", type=Path)
    args = parser.parse_args(argv)
    load_env_file(REPO / ".env")
    key = get_env_var("ZOTERO_API_KEY", required=True)
    try:
        client = GroupClient(key)
        client.check_access()
        if args.apply:
            plan = json.loads(args.apply.read_text(encoding="utf-8"))
            result = apply(client, plan, args.apply.parent)
            print(
                f"[OK] Verified {len(result['created'])} new items; existing items unchanged"
            )
        else:
            args.out.mkdir(parents=True, exist_ok=False)
            snapshot = client.snapshot()
            save_json(args.out / "before.json", snapshot)
            plan = prepare(client, snapshot, [*DEFAULT_RIS, *DEFAULT_LANE_RIS])
            save_json(args.out / "plan.json", plan)
            for status in ("create", "present", "ambiguous", "invalid"):
                print(
                    f"[OK] {status}: {sum(r['status'] == status for r in plan['records'])}"
                )
        return 0
    except Exception as error:
        print(f"[FEHLER] {str(error).replace(key, '[redacted]')}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
