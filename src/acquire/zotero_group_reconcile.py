#!/usr/bin/env python3
"""Reconcile prepared RIS import files with the Zotero group library, read-only.

Data flow: the group library is read through the Zotero Web API (or, with
--offline, from the committed corpus/zotero_export.json), the RIS files are
parsed with the repository's RIS parser, and every RIS record is matched
against the library. The result is a JSON report and a Markdown rendering of
the same data. The tool prepares the owner's import and duplicate curation; it
never writes to Zotero.

Matching rule, in this order and nothing else:
  1. normalised DOI (see normalise_doi)
  2. normalised title plus publication year (see normalise_title, extract_year)
A title that agrees while the year differs or is missing is reported as a
candidate for human inspection and does not count as a match. Author names are
never used for matching.

Read-only guarantees: the API client is wrapped so that only the listed read
methods are reachable, and the run refuses a key that carries any write
permission.

Usage:
    python -m src.acquire.zotero_group_reconcile --date 2026-09-20 --offline
    python -m src.acquire.zotero_group_reconcile --date 2026-09-20
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import unicodedata
from collections import defaultdict
from pathlib import Path
from typing import Any
from urllib.parse import unquote

from src.analysis.build_round2_intake import parse_ris
from src.utils import get_env_var, load_env_file, setup_windows_encoding

REPO = Path(__file__).resolve().parents[2]
GROUP_ID = "6080294"
SCHEMA = "femprompt-zotero-reconcile/0.1"
EXPORT_PATH = REPO / "corpus" / "zotero_export.json"
MAPPING_PATH = REPO / "corpus" / "source_tool_mapping.json"
DEFAULT_OUT_ROOT = REPO / "generated" / "zotero-reconcile"
ROUND2_DIR = REPO / "corpus" / "deep-research" / "round2"

DEFAULT_RIS = (
    ROUND2_DIR / "Codex Websearch" / "codex-websearch-2026-zotero-import.ris",
    REPO / "generated" / "round2-zotero-import.ris",
    REPO / "generated" / "contextual-update-2026-08-24-zotero-import.ris",
    REPO / "generated" / "completion" / "historical-recovery.ris",
    ROUND2_DIR / "targeted-followup-2026-09-05.ris",
)
# The lane files of July 2026 are not import candidates any more. They are
# reconciled as well because the run log claims their import and the committed
# export does not show it (knowledge/plan.md, "Conflicting statements in the record").
DEFAULT_LANE_RIS = (
    ROUND2_DIR / "ChatGPT_deep-research.ris",
    ROUND2_DIR / "Claude_deep-research.ris",
    ROUND2_DIR / "Gemini_deep-research.ris",
    ROUND2_DIR / "ClaudeCode_deep-research.ris",
)

# Whitelist of pyzotero methods the tool may reach. All of them issue GET requests.
READ_METHODS = frozenset({"key_info", "items", "collections", "everything", "last_modified_version"})
CHILD_ITEM_TYPES = frozenset({"attachment", "note", "annotation"})

# A collection name, tag or note line counts as a lane marker when one of these
# patterns matches. They cover the names the run log and the RIS generators use.
LANE_PATTERNS = (
    r"deep[\s_-]?research",
    r"\bL[1-5]\b",
    r"\blanes?\b",
    r"round[\s_-]?(?:two|2)",
    r"runde[\s_-]?2",
    r"codex websearch",
    r"contextual-update",
    r"femprompt",
    r"targeted-followup",
)
_LANE_RE = re.compile("|".join(LANE_PATTERNS), flags=re.IGNORECASE)
_DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}(?:T\d{4}(?:\d{2})?Z?)?$")


class ReconcileError(Exception):
    """Input or API response that the tool refuses to work with."""


def normalise_doi(value: Any) -> str:
    """Return the bare lower-case DOI, or "" when the value is no DOI.

    Rules: percent-decoding, removal of all whitespace, case folding, removal of
    the prefixes https://doi.org/, http://dx.doi.org/ and doi:, removal of
    trailing sentence punctuation. A result that does not start with "10." and
    contain a slash is rejected.
    """
    doi = re.sub(r"\s+", "", unquote(str(value or ""))).casefold()
    doi = re.sub(r"^(?:https?://)?(?:dx\.)?doi\.org/", "", doi)
    doi = doi.removeprefix("doi:").rstrip(".,;")
    return doi if re.match(r"^10\.\d{4,9}/\S+$", doi) else ""


def normalise_title(value: Any) -> str:
    """Return the comparison form of a title.

    Rules: markup tags such as <scp> or <i> are dropped, compatibility
    decomposition (NFKD) separates diacritics, combining marks are removed, the
    text is case-folded (so that ß becomes ss), every character that is neither
    a letter nor a digit becomes a space, and whitespace is collapsed.
    """
    text = re.sub(r"<[^<>]{1,40}>", " ", str(value or ""))
    text = unicodedata.normalize("NFKD", text)
    text = "".join(ch for ch in text if not unicodedata.combining(ch)).casefold()
    return " ".join(re.findall(r"[^\W_]+", text, flags=re.UNICODE))


def extract_year(value: Any) -> str:
    """Return the first four-digit year between 1500 and 2099 in a date string."""
    match = re.search(r"(?<!\d)(1[5-9]\d{2}|20\d{2})(?!\d)", str(value or ""))
    return match.group(1) if match else ""


def redact(text: str, secret: str | None) -> str:
    # pyzotero puts the key into the URL of the key-info request, and HTTP
    # errors quote that URL, so every outgoing message passes through here.
    return text.replace(secret, "[redacted]") if secret else text


class ReadOnlyClient:
    """Expose only the whitelisted read methods of a pyzotero client."""

    def __init__(self, client: Any) -> None:
        self._client = client

    def __getattr__(self, name: str) -> Any:
        if name not in READ_METHODS:
            raise AttributeError(f"{name} is not a permitted read method")
        return getattr(self._client, name)


def _has_write_permission(access: Any) -> bool:
    if isinstance(access, dict):
        return any((key == "write" and bool(value)) or _has_write_permission(value)
                   for key, value in access.items())
    return False


def _first(record: dict[str, list[str]], *tags: str) -> str:
    for tag in tags:
        values = record.get(tag) or []
        if values and values[0].strip():
            return " ".join(values[0].split())
    return ""


def load_ris(path: Path, group: str, repo: Path = REPO) -> dict[str, Any]:
    """Parse one RIS file into comparable records; records without a title are set aside."""
    if not path.is_file():
        raise ReconcileError(f"RIS input not found: {path}")
    try:
        raw_records = parse_ris(path)
    except UnicodeDecodeError as error:
        raise ReconcileError(f"RIS input is not UTF-8: {path}") from error
    try:
        label = path.resolve().relative_to(repo.resolve()).as_posix()
    except ValueError:
        label = path.name
    records, invalid = [], []
    for index, raw in enumerate(raw_records, start=1):
        title = _first(raw, "TI", "T1")
        if not raw.get("TY") or not normalise_title(title):
            invalid.append({"index": index, "reason": "record lacks TY or a usable title"})
            continue
        doi_raw = _first(raw, "DO")
        candidate_id = next((note.split(":", 1)[1].strip() for note in raw.get("N1", [])
                             if note.startswith("FemPrompt-Candidate-ID:")), None)
        records.append({
            "index": index,
            "title": title,
            "year": extract_year(_first(raw, "PY", "Y1", "DA")),
            "doi": normalise_doi(doi_raw),
            "doi_unusable": doi_raw if doi_raw and not normalise_doi(doi_raw) else None,
            "candidate_id": candidate_id,
        })
    return {
        "path": label,
        "group": group,
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
        "records": records,
        "invalid_records": invalid,
    }


def _library_item(key: Any, version: Any, data: Any) -> dict[str, Any] | None:
    if not isinstance(key, str) or not key or not isinstance(data, dict):
        return None
    tags = [tag.get("tag") if isinstance(tag, dict) else tag for tag in data.get("tags") or []]
    return {
        "key": key,
        "version": version if isinstance(version, int) else None,
        "item_type": str(data.get("itemType") or ""),
        "title": " ".join(str(data.get("title") or "").split()),
        "year": extract_year(data.get("date")),
        "doi": normalise_doi(data.get("DOI")),
        "tags": sorted(tag for tag in tags if isinstance(tag, str) and tag),
        "collections": sorted(c for c in data.get("collections") or [] if isinstance(c, str)),
    }


def library_from_export(path: Path = EXPORT_PATH, mapping_path: Path = MAPPING_PATH) -> dict[str, Any]:
    """Build the library view from the committed export, which holds flat top-level items."""
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError) as error:
        raise ReconcileError(f"export cannot be read: {path}") from error
    if not isinstance(payload, list):
        raise ReconcileError("export is not a list of items")
    items, invalid = [], []
    for position, entry in enumerate(payload):
        item = _library_item(entry.get("key"), entry.get("version"), entry) if isinstance(entry, dict) else None
        if item is None:
            invalid.append({"position": position, "reason": "entry lacks a key or is no object"})
        else:
            items.append(item)
    # The export carries collection keys only. The committed mapping is the one
    # repository source that names some of them, and a key the export never uses
    # is left out so that the mapping cannot make a collection appear.
    known = _mapping_collections(mapping_path)
    names = {key: {"name": known.get(key, {}).get("name"), "parent": None}
             for key in sorted({c for item in items for c in item["collections"]})}
    return {
        "source": "corpus/zotero_export.json",
        "live": False,
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
        "library_version": max((item["version"] or 0 for item in items), default=0),
        "library_version_kind": "highest item version in the export, not the library version of the API",
        "items": items, "invalid_items": invalid, "collections": names, "notes": [],
    }


def library_from_api(client: Any, group_id: str) -> dict[str, Any]:
    """Read items, notes and collections of the group through whitelisted GET calls."""
    zot = ReadOnlyClient(client)
    info = zot.key_info()
    access = info.get("access") if isinstance(info, dict) else None
    if not isinstance(access, dict):
        raise ReconcileError("key information carries no access block")
    if _has_write_permission(access):
        raise ReconcileError("the key carries write permission; create a key with read access only")
    groups = access.get("groups") if isinstance(access.get("groups"), dict) else {}
    grant = groups.get(group_id) or groups.get("all") or {}
    if not (isinstance(grant, dict) and grant.get("library")):
        raise ReconcileError(f"the key has no read access to group {group_id}")

    version = zot.last_modified_version()
    raw_items = zot.everything(zot.items())
    raw_collections = zot.everything(zot.collections())
    if not isinstance(raw_items, list) or not isinstance(raw_collections, list):
        raise ReconcileError("API response is not a list")

    items, notes, invalid = [], [], []
    for position, entry in enumerate(raw_items):
        data = entry.get("data") if isinstance(entry, dict) else None
        item = _library_item(entry.get("key"), entry.get("version"), data) if isinstance(data, dict) else None
        if item is None:
            invalid.append({"position": position, "reason": "entry lacks a key or a data object"})
        elif item["item_type"] == "note":
            notes.append({"key": item["key"], "parent": data.get("parentItem"), "text": str(data.get("note") or "")})
        elif item["item_type"] not in CHILD_ITEM_TYPES:
            items.append(item)
    collections = {}
    for entry in raw_collections:
        data = entry.get("data") if isinstance(entry, dict) else None
        if isinstance(data, dict) and isinstance(entry.get("key"), str):
            collections[entry["key"]] = {"name": str(data.get("name") or ""),
                                         "parent": data.get("parentCollection") or None}
    return {
        "source": f"https://api.zotero.org/groups/{group_id}",
        "live": True,
        "sha256": None,
        "library_version": int(version),
        "library_version_kind": "Last-Modified-Version of the API",
        "items": items, "invalid_items": invalid, "collections": collections, "notes": notes,
    }


def _mapping_collections(path: Path) -> dict[str, dict[str, Any]]:
    if not path.is_file():
        return {}
    try:
        mapping = json.loads(path.read_text(encoding="utf-8"))
        collections = mapping["collection_mapping"]["deep_research_collections"]
    except (ValueError, KeyError, TypeError):
        return {}
    return {key: value for key, value in collections.items() if isinstance(value, dict)}


def _index(entries: list[dict[str, Any]]) -> tuple[dict[str, list], dict[tuple[str, str], list], dict[str, list]]:
    by_doi, by_title_year, by_title = defaultdict(list), defaultdict(list), defaultdict(list)
    for entry in entries:
        title = normalise_title(entry["title"])
        if entry["doi"]:
            by_doi[entry["doi"]].append(entry)
        if title:
            by_title[title].append(entry)
            if entry["year"]:
                by_title_year[(title, entry["year"])].append(entry)
    return by_doi, by_title_year, by_title


def match_record(record: dict[str, Any], index: tuple[dict, dict, dict]) -> dict[str, Any]:
    """Apply the two-step rule to one RIS record."""
    by_doi, by_title_year, by_title = index
    title = normalise_title(record["title"])
    matches = [{"key": item["key"], "matched_field": "doi"} for item in by_doi.get(record["doi"], [])]
    if not matches and record["year"]:
        matches = [{"key": item["key"], "matched_field": "title_year"}
                   for item in by_title_year.get((title, record["year"]), [])]
    matched_keys = {match["key"] for match in matches}
    # Same title under another or no year is left to the curator, because
    # preprint and version of record often differ by a year.
    title_only = sorted(item["key"] for item in by_title.get(title, []) if item["key"] not in matched_keys)
    return {"status": "present" if matches else "absent", "matches": matches,
            "title_only_candidates": title_only if not matches else []}


def _groups(entries: list[dict[str, Any]], describe) -> list[dict[str, Any]]:
    """Group entries that agree on DOI, or on title plus year where no DOI group binds them."""
    by_doi, by_title_year, _ = _index(entries)
    result, bound = [], set()
    for doi, members in sorted(by_doi.items()):
        if len(members) > 1:
            result.append({"matched_field": "doi", "value": doi, "members": [describe(m) for m in members]})
            bound.update(id(m) for m in members)
    for (title, year), members in sorted(by_title_year.items()):
        if len(members) > 1 and not all(id(m) in bound for m in members):
            result.append({"matched_field": "title_year", "value": f"{title} ({year})",
                           "members": [describe(m) for m in members]})
    return result


def lane_markers(library: dict[str, Any]) -> dict[str, Any]:
    collections = []
    for key, meta in sorted(library["collections"].items()):
        if meta.get("name") and _LANE_RE.search(meta["name"]):
            collections.append({"key": key, "name": meta["name"], "parent": meta.get("parent"),
                                "item_keys": sorted(i["key"] for i in library["items"] if key in i["collections"])})
    by_tag = defaultdict(list)
    for item in library["items"]:
        for tag in item["tags"]:
            if _LANE_RE.search(tag):
                by_tag[tag].append(item["key"])
    notes = []
    for note in library["notes"]:
        text = re.sub(r"<[^<>]+>", "\n", note["text"])
        lines = [" ".join(line.split()) for line in text.splitlines() if _LANE_RE.search(line)]
        if lines:
            notes.append({"note_key": note["key"], "parent_key": note["parent"],
                          "marker_lines": [line[:200] for line in lines]})
    return {"patterns": list(LANE_PATTERNS), "collections": collections,
            "tags": [{"tag": tag, "item_keys": sorted(keys)} for tag, keys in sorted(by_tag.items())],
            "notes": notes}


def recorded_mapping(library: dict[str, Any], path: Path = MAPPING_PATH) -> dict[str, Any] | None:
    """Compare the keys the committed source-tool mapping records with the library."""
    if not path.is_file():
        return None
    try:
        item_keys = json.loads(path.read_text(encoding="utf-8")).get("source_tool_mapping") or {}
    except ValueError:
        return None
    present = {item["key"] for item in library["items"]}
    used = {key for item in library["items"] for key in item["collections"]}
    return {
        "source": "corpus/source_tool_mapping.json",
        "collections": [{"key": key, "name": value.get("name"), "lane": value.get("lane"),
                         "round": value.get("round"),
                         # Offline the collection names come from this same mapping, so the
                         # question can only be answered from the live library.
                         "known_to_library": key in library["collections"] if library["live"] else None,
                         "holds_library_items": key in used}
                        for key, value in sorted(_mapping_collections(path).items())],
        "item_keys_present": sorted(key for key in item_keys if key in present),
        "item_keys_absent": sorted(key for key in item_keys if key not in present),
    }


def reconcile(library: dict[str, Any], ris_files: list[dict[str, Any]], *, run_date: str,
              mode: str, group_id: str = GROUP_ID, mapping_path: Path = MAPPING_PATH) -> dict[str, Any]:
    index = _index(library["items"])
    pooled = []
    for ris in ris_files:
        for record in ris["records"]:
            record.update(match_record(record, index))
            pooled.append({**record, "file": ris["path"]})
    return {
        "schema": SCHEMA,
        "run_date": run_date,
        "mode": mode,
        "matching_rule": ["normalised DOI", "normalised title plus year"],
        "authority": "Deterministic comparison only. Import, merge and curation remain with the project owner.",
        "library": {key: library[key] for key in
                    ("source", "live", "sha256", "library_version", "library_version_kind", "invalid_items")}
                   | {"group_id": group_id, "collections": library["collections"], "items": library["items"]},
        "ris_files": ris_files,
        "ris_overlap": _groups(pooled, lambda r: {"file": r["file"], "index": r["index"], "title": r["title"],
                                                   "year": r["year"], "status": r["status"]}),
        "library_duplicate_candidates": _groups(
            library["items"], lambda i: {"key": i["key"], "title": i["title"], "year": i["year"],
                                         "item_type": i["item_type"]}),
        "lane_markers": lane_markers(library),
        "recorded_mapping": recorded_mapping(library, mapping_path),
    }


def _cell(value: Any) -> str:
    return " ".join(str(value if value not in (None, "") else "n/a").split()).replace("|", "\\|")


def _table(header: tuple[str, ...], rows: list[tuple]) -> list[str]:
    if not rows:
        return ["None.", ""]
    lines = ["| " + " | ".join(header) + " |", "|" + "---|" * len(header)]
    lines += ["| " + " | ".join(_cell(v) for v in row) + " |" for row in rows]
    return lines + [""]


def render_markdown(report: dict[str, Any]) -> str:
    library = report["library"]
    out = [f"# Zotero group library reconciliation, {report['run_date']} ({report['mode']})", "",
           "Read-only comparison. A record is present when its normalised DOI matches a library item, "
           "or, failing that, when its normalised title and its year match. Titles that agree under "
           "another or no year are listed as candidates and do not count as present.", "",
           f"- Library source: `{library['source']}`",
           f"- Group: {library['group_id']}",
           f"- Library version: {library['library_version']} ({library['library_version_kind']})", ""]
    for ris in report["ris_files"]:
        out += [f"## RIS file `{ris['path']}` ({ris['group']})", "", f"SHA-256 `{ris['sha256']}`", ""]
        out += _table(("No.", "Status", "Zotero key", "Matched field", "Title-only candidates", "Year", "DOI", "Title"),
                      [(r["index"], r["status"], ", ".join(m["key"] for m in r["matches"]),
                        ", ".join(sorted({m["matched_field"] for m in r["matches"]})),
                        ", ".join(r["title_only_candidates"]), r["year"], r["doi"] or r["doi_unusable"], r["title"])
                       for r in ris["records"]])
        if ris["invalid_records"]:
            out += ["Records set aside:", ""] + _table(
                ("No.", "Reason"), [(r["index"], r["reason"]) for r in ris["invalid_records"]])
    out += ["## Overlap between RIS records", ""]
    out += _table(("Matched field", "Value", "Records"),
                  [(g["matched_field"], g["value"],
                    ", ".join(f"{m['file']} no. {m['index']} ({m['status']})" for m in g["members"]))
                   for g in report["ris_overlap"]])
    out += ["## Candidate duplicate pairs inside the library", ""]
    out += _table(("Matched field", "Value", "Items"),
                  [(g["matched_field"], g["value"],
                    ", ".join(f"{m['key']} ({m['item_type']}, {m['year'] or 'no year'})" for m in g["members"]))
                   for g in report["library_duplicate_candidates"]])
    markers = report["lane_markers"]
    out += ["## Lane markers in the library", "", "Collections whose name matches a lane pattern:", ""]
    out += _table(("Key", "Name", "Parent", "Item keys"),
                  [(c["key"], c["name"], c["parent"], ", ".join(c["item_keys"])) for c in markers["collections"]])
    out += ["Tags that match a lane pattern:", ""]
    out += _table(("Tag", "Item keys"), [(t["tag"], ", ".join(t["item_keys"])) for t in markers["tags"]])
    out += ["Notes that match a lane pattern:", ""]
    out += _table(("Note", "Parent item", "Lines"),
                  [(n["note_key"], n["parent_key"], " / ".join(n["marker_lines"])) for n in markers["notes"]])
    mapping = report["recorded_mapping"]
    if mapping:
        out += [f"## Keys recorded in `{mapping['source']}`", ""]
        out += _table(("Collection", "Name", "Lane", "Round", "Known to the library", "Holds library items"),
                      [(c["key"], c["name"], c["lane"], c["round"], c["known_to_library"], c["holds_library_items"])
                       for c in mapping["collections"]])
        out += ["Item keys of the mapping that the library does not hold:", "",
                ", ".join(mapping["item_keys_absent"]) or "None.", ""]
    out += ["## Library items", ""]
    out += _table(("Key", "Type", "Year", "DOI", "Title"),
                  [(i["key"], i["item_type"], i["year"], i["doi"], i["title"])
                   for i in sorted(library["items"], key=lambda i: i["key"])])
    return "\n".join(out).rstrip() + "\n"


def write_reports(report: dict[str, Any], out_dir: Path) -> tuple[Path, Path]:
    json_path, md_path = out_dir / "report.json", out_dir / "report.md"
    if json_path.exists() or md_path.exists():
        raise ReconcileError(f"refusing to overwrite an existing report in {out_dir}")
    out_dir.mkdir(parents=True, exist_ok=True)
    for path, text in ((json_path, json.dumps(report, indent=2, ensure_ascii=False) + "\n"),
                       (md_path, render_markdown(report))):
        with open(path, "w", encoding="utf-8", newline="\n") as handle:
            handle.write(text)
    return json_path, md_path


def _connect(group_id: str, api_key: str) -> Any:
    try:
        from pyzotero import zotero
    except ImportError as error:
        raise ReconcileError("pyzotero is not installed. Run: pip install -r requirements.txt") from error
    return zotero.Zotero(group_id, "group", api_key)


def main(argv: list[str] | None = None) -> int:
    setup_windows_encoding()
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--date", required=True,
                        help="Run date, YYYY-MM-DD or YYYY-MM-DDTHHMM; names the report folder, the clock is never read")
    parser.add_argument("--out", type=Path, help="Report directory (default generated/zotero-reconcile/<date>[-offline])")
    parser.add_argument("--offline", action="store_true",
                        help="Reconcile against corpus/zotero_export.json; needs no key and no network")
    parser.add_argument("--export", type=Path, default=EXPORT_PATH, help="Export used by --offline")
    parser.add_argument("--ris", type=Path, nargs="+", default=list(DEFAULT_RIS), help="Prepared import files")
    parser.add_argument("--lane-ris", type=Path, nargs="*", default=list(DEFAULT_LANE_RIS),
                        help="Lane files whose earlier import is to be checked")
    parser.add_argument("--group", default=GROUP_ID, help="Zotero group ID")
    args = parser.parse_args(argv)

    if not _DATE_RE.match(args.date):
        parser.error("--date must look like 2026-09-20 or 2026-09-20T1430")
    if not re.fullmatch(r"\d+", args.group):
        parser.error("--group must be numeric")
    out_dir = args.out or DEFAULT_OUT_ROOT / (args.date + ("-offline" if args.offline else ""))

    api_key = None
    try:
        ris_files = [load_ris(path, "import") for path in args.ris]
        ris_files += [load_ris(path, "lane") for path in args.lane_ris]
        if args.offline:
            library = library_from_export(args.export)
        else:
            load_env_file(REPO / ".env")
            api_key = get_env_var("ZOTERO_API_KEY", required=True)
            library = library_from_api(_connect(args.group, api_key), args.group)
        report = reconcile(library, ris_files, run_date=args.date,
                           mode="offline" if args.offline else "live", group_id=args.group)
        json_path, md_path = write_reports(report, out_dir)
    except ReconcileError as error:
        print(f"Error: {redact(str(error), api_key)}", file=sys.stderr)
        return 1
    except Exception as error:  # pyzotero and HTTP errors quote request URLs
        print(f"Error: {type(error).__name__}: {redact(str(error), api_key)}", file=sys.stderr)
        return 1
    print(f"Report written: {json_path}")
    print(f"Report written: {md_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
