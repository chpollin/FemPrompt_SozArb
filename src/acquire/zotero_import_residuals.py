#!/usr/bin/env python3
"""Prepare the owner's Zotero import: residual RIS packages and one checklist.

Data flow: the prepared RIS packages are read in a fixed order, the leading
Codex Websearch package first, and every record of a following package that the
earlier packages already cover is left out of that package's residual file. The
result is one cleaned RIS file per following package plus a Markdown checklist
that names, per package, what was dropped and what remains. Nothing is written
to Zotero, and the leading package is never modified.

Matching reuses the rules of src/acquire/zotero_group_reconcile.py, normalised
DOI first and then normalised title plus publication year. Author names play no
part. Two situations keep a record although its title agrees with an earlier
one, because the import plan asks for distinct expressions of a Work to be
retained as related Versions:
  1. the titles agree while the years differ or one year is missing
  2. title and year agree while both records carry a different DOI
Such a record stays in the residual file and is listed as a version relation to
curate.

Usage:
    python -m src.acquire.zotero_import_residuals --date 2026-09-20
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

from src.acquire.zotero_group_reconcile import (
    DEFAULT_LANE_RIS,
    DEFAULT_RIS,
    EXPORT_PATH,
    REPO,
    ReconcileError,
    _DATE_RE,
    _groups,
    _index,
    _table,
    library_from_export,
    load_ris,
    match_record,
    normalise_title,
)
from src.utils import setup_windows_encoding

SCHEMA = "femprompt-zotero-import-residuals/0.1"
LEADING_RIS = DEFAULT_RIS[0]
# Order of the import. The leading package binds first, the older prepared
# packages follow in the order of knowledge/plan.md, and the lane files of July
# 2026 come last because their earlier import is unconfirmed rather than denied.
FOLLOWING_RIS = tuple(DEFAULT_RIS[1:]) + DEFAULT_LANE_RIS
AUDIT_PATH = REPO / "corpus" / "deep-research" / "round2" / "Codex Websearch" / "bibliographic-audit.json"
DEFAULT_OUT_ROOT = REPO / "generated" / "zotero-import"

VERSION_RELATION_RULE = (
    "Resolve Zotero duplicate suggestions by Work identity. Retain distinct Preprint, "
    "Accepted Manuscript, proceedings, and Version-of-Record expressions as related Versions."
)

_TAG_RE = re.compile(r"^([A-Z0-9]{2})  - ?(.*)$")


def split_records(path: Path) -> list[str]:
    """Return the verbatim RIS block of every record parse_ris yields, in its order.

    The residual files must carry the original records unchanged, so the blocks
    are sliced out of the source text instead of being rendered again from the
    parsed tags. The block boundaries follow parse_ris: a block ends at its ER
    line, a block without any tag line is no record, and trailing content
    without an ER line still forms one.
    """
    lines, block, has_tag, blocks = path.read_text(encoding="utf-8-sig").splitlines(), [], False, []
    for line in lines:
        match = _TAG_RE.match(line)
        if match and match.group(1) == "ER":
            if has_tag:
                blocks.append("\n".join([*block, line]))
            block, has_tag = [], False
            continue
        if match:
            has_tag = True
        if match or (line.strip() and has_tag):
            block.append(line)
    if has_tag:
        blocks.append("\n".join([*block, "ER  - "]))
    return blocks


def _entry(record: dict[str, Any], label: str) -> dict[str, Any]:
    return {**record, "key": f"{label}#{record['index']}", "file": label}


def _version_relation(record: dict[str, Any], matches: list[dict[str, str]],
                      known: dict[str, dict[str, Any]]) -> list[dict[str, str]]:
    """Return the matched records that are a different publication Version, not a duplicate."""
    related = []
    for match in matches:
        other = known[match["key"]]
        if match["matched_field"] == "title_year" and record["doi"] and other["doi"] and record["doi"] != other["doi"]:
            related.append({"key": match["key"], "reason": "same title and year under a different DOI"})
    return related


def plan_import(leading: dict[str, Any], following: list[dict[str, Any]],
                library: dict[str, Any]) -> dict[str, Any]:
    """Decide for every record of the following packages whether it is dropped or kept."""
    library_index = _index(library["items"])
    known: dict[str, dict[str, Any]] = {}
    bound: list[dict[str, Any]] = []
    for record in leading["records"]:
        entry = _entry(record, leading["path"])
        known[entry["key"]] = entry
        bound.append(entry)

    packages, pooled_relations = [], []
    for ris in following:
        kept, dropped = [], []
        for record in ris["records"]:
            decision = match_record(record, _index(bound))
            relations = _version_relation(record, decision["matches"], known)
            relations += [{"key": key, "reason": "same title under a different or missing year"}
                          for key in decision["title_only_candidates"]]
            in_library = match_record(record, library_index)
            row = {
                "index": record["index"], "title": record["title"], "year": record["year"],
                "doi": record["doi"] or record["doi_unusable"], "candidate_id": record["candidate_id"],
                "covered_by": decision["matches"], "version_relations": relations,
                "library_keys": [match["key"] for match in in_library["matches"]],
            }
            if decision["matches"] and not relations:
                # The earlier record carries the identity. A DOI that only the
                # dropped record holds would be lost, so the checklist says so.
                row["identifier_note"] = ("the dropped record carries a DOI the covering record lacks"
                                          if record["doi"] and not any(known[m["key"]]["doi"]
                                                                       for m in decision["matches"]) else "")
                dropped.append(row)
                continue
            kept.append(row)
            entry = _entry(record, ris["path"])
            known[entry["key"]] = entry
            bound.append(entry)
        pooled_relations += [{"file": ris["path"], **row} for row in kept if row["version_relations"]]
        packages.append({"path": ris["path"], "sha256": ris["sha256"], "group": ris["group"],
                         "residual_file": f"{Path(ris['path']).stem}-residual.ris",
                         "kept": kept, "dropped": dropped, "invalid_records": ris["invalid_records"]})
    return {
        "schema": SCHEMA,
        "leading": {"path": leading["path"], "sha256": leading["sha256"],
                    "records": [{"index": r["index"], "title": r["title"], "year": r["year"],
                                 "doi": r["doi"] or r["doi_unusable"], "candidate_id": r["candidate_id"],
                                 "library_keys": [m["key"] for m in match_record(r, library_index)["matches"]]}
                                for r in leading["records"]]},
        "packages": packages,
        "version_relations": pooled_relations,
        "library_duplicate_candidates": _groups(
            library["items"], lambda i: {"key": i["key"], "title": i["title"], "year": i["year"],
                                         "item_type": i["item_type"]}),
    }


def metadata_corrections(leading: dict[str, Any], library: dict[str, Any],
                         path: Path = AUDIT_PATH) -> list[dict[str, Any]]:
    """Return the audit records that still await a correction in Zotero, with their key where one exists."""
    try:
        records = json.loads(path.read_text(encoding="utf-8"))["records"]
    except (OSError, ValueError, KeyError, TypeError) as error:
        raise ReconcileError(f"bibliographic audit cannot be read: {path}") from error
    if not isinstance(records, list):
        raise ReconcileError(f"bibliographic audit holds no record list: {path}")
    library_index = _index(library["items"])
    by_title = {normalise_title(record["title"]): record for record in leading["records"]}
    pending = []
    for record in records:
        if not isinstance(record, dict) or not record.get("pending_zotero_corrections"):
            continue
        # The audit carries no year, so the year comes from the leading package,
        # which is the import source of the same candidate.
        prepared = by_title.get(normalise_title(record.get("title")))
        keys = [match["key"] for match in match_record(prepared, library_index)["matches"]] if prepared else []
        pending.append({
            "candidate_id": record.get("candidate_id"), "title": record.get("title"),
            "zotero_keys": keys, "metadata_gaps": record.get("metadata_gaps") or [],
            "peer_review_status": record.get("peer_review_status"),
            "in_leading_package": prepared["index"] if prepared else None,
        })
    return pending


def render_checklist(plan: dict[str, Any], corrections: list[dict[str, Any]], *,
                     run_date: str, library: dict[str, Any]) -> str:
    def covered(row: dict[str, Any]) -> str:
        return ", ".join(f"{match['key']} ({match['matched_field']})" for match in row["covered_by"])

    out = [f"# Zotero import checklist, {run_date}", "",
           "The packages are imported in the order of the table below. A record of a following package is "
           "left out of its residual file when an earlier package already carries it, matched by normalised "
           "DOI or, failing that, by normalised title and publication year. Author names play no part. "
           "Records that the residual files keep although their title agrees with an earlier record are "
           "listed under the version relations, where the rule of the import plan applies.", "",
           VERSION_RELATION_RULE, "",
           f"Library compared against: `{library['source']}`.", ""]
    out += ["## Import order", ""]
    out += _table(("Order", "Package", "Residual file", "SHA-256 of the source"),
                  [(1, plan["leading"]["path"], "imported unchanged", plan["leading"]["sha256"])] +
                  [(position, package["path"],
                    package["residual_file"] if package["kept"] else "none, fully covered", package["sha256"])
                   for position, package in enumerate(plan["packages"], start=2)])

    out += [f"## Leading package `{plan['leading']['path']}`", "",
            "Every record of this package is imported. It is not modified.", ""]
    out += _table(("No.", "Year", "DOI", "Already in the library", "Candidate ID", "Title"),
                  [(r["index"], r["year"], r["doi"], ", ".join(r["library_keys"]), r["candidate_id"], r["title"])
                   for r in plan["leading"]["records"]])

    for package in plan["packages"]:
        out += [f"## Package `{package['path']}`", ""]
        out += [f"Residual file: `{package['residual_file']}`." if package["kept"]
                else "No residual file. Every record of this package is already covered.", ""]
        out += ["Records to import:", ""]
        out += _table(("Source no.", "Year", "DOI", "Already in the library", "Version relation", "Title"),
                      [(r["index"], r["year"], r["doi"], ", ".join(r["library_keys"]),
                        ", ".join(relation["key"] for relation in r["version_relations"]), r["title"])
                       for r in package["kept"]])
        out += ["Records left out, already covered:", ""]
        out += _table(("Source no.", "Covered by", "Identifier note", "Title"),
                      [(r["index"], covered(r), r["identifier_note"], r["title"]) for r in package["dropped"]])
        if package["invalid_records"]:
            out += ["Records set aside by the parser:", ""]
            out += _table(("Source no.", "Reason"),
                          [(r["index"], r["reason"]) for r in package["invalid_records"]])

    out += ["## Version relations to curate", "",
            "These records stay in their residual file. In Zotero they are related Versions of one Work, "
            "not duplicates to merge.", ""]
    out += _table(("Package", "Source no.", "Year", "DOI", "Related record", "Reason", "Title"),
                  [(row["file"], row["index"], row["year"], row["doi"], relation["key"], relation["reason"],
                    row["title"])
                   for row in plan["version_relations"] for relation in row["version_relations"]])

    out += ["## Expected duplicate decisions inside the group library", "",
            "Items the committed export already holds twice under the same identity.", ""]
    out += _table(("Matched field", "Value", "Items"),
                  [(group["matched_field"], group["value"],
                    ", ".join(f"{member['key']} ({member['item_type']}, {member['year'] or 'no year'})"
                              for member in group["members"]))
                   for group in plan["library_duplicate_candidates"]])

    out += ["## Outstanding metadata corrections", "",
            "Recorded in `corpus/deep-research/round2/Codex Websearch/bibliographic-audit.json`. "
            "A Zotero key is named where the committed export holds the record; otherwise the correction "
            "applies to the record once it has been imported.", ""]
    out += _table(("Candidate ID", "No. in the leading package", "Zotero key", "Peer-review status",
                   "Metadata gaps", "Title"),
                  [(c["candidate_id"], c["in_leading_package"], ", ".join(c["zotero_keys"]),
                    c["peer_review_status"], ", ".join(c["metadata_gaps"]), c["title"])
                   for c in corrections])
    return "\n".join(out).rstrip() + "\n"


def write_outputs(plan: dict[str, Any], blocks: dict[str, list[str]], checklist: str,
                  out_dir: Path) -> list[Path]:
    """Write the residual RIS files and the checklist into a directory that must not exist yet."""
    if out_dir.exists():
        raise ReconcileError(f"refusing to write into the existing directory {out_dir}")
    names = [package["residual_file"] for package in plan["packages"] if package["kept"]]
    if len(names) != len({name.casefold() for name in names}):
        raise ReconcileError("two packages would produce the same residual file name")
    out_dir.mkdir(parents=True)
    written = []
    for package in plan["packages"]:
        if not package["kept"]:
            continue
        text = "\n\n".join(blocks[package["path"]][row["index"] - 1] for row in package["kept"])
        path = out_dir / package["residual_file"]
        with open(path, "w", encoding="utf-8", newline="\n") as handle:
            handle.write(text.rstrip("\n") + "\n")
        written.append(path)
    path = out_dir / "import-checklist.md"
    with open(path, "w", encoding="utf-8", newline="\n") as handle:
        handle.write(checklist)
    return [*written, path]


def main(argv: list[str] | None = None) -> int:
    setup_windows_encoding()
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--date", required=True,
                        help="Run date, YYYY-MM-DD or YYYY-MM-DDTHHMM; names the output folder, the clock is never read")
    parser.add_argument("--out", type=Path, help="Output directory (default generated/zotero-import/<date>)")
    parser.add_argument("--leading", type=Path, default=LEADING_RIS,
                        help="The package that binds first and stays unchanged")
    parser.add_argument("--following", type=Path, nargs="+", default=list(FOLLOWING_RIS),
                        help="The older packages whose residual records are prepared, in import order")
    parser.add_argument("--export", type=Path, default=EXPORT_PATH,
                        help="Zotero export the records are compared against")
    args = parser.parse_args(argv)

    if not _DATE_RE.match(args.date):
        parser.error("--date must look like 2026-09-20 or 2026-09-20T1430")
    out_dir = args.out or DEFAULT_OUT_ROOT / args.date

    try:
        leading = load_ris(args.leading, "leading")
        following = [load_ris(path, "following") for path in args.following]
        if leading["path"] in {ris["path"] for ris in following}:
            raise ReconcileError("the leading package must not appear among the following packages")
        library = library_from_export(args.export)
        plan = plan_import(leading, following, library)
        checklist = render_checklist(plan, metadata_corrections(leading, library),
                                     run_date=args.date, library=library)
        blocks = {ris["path"]: split_records(path) for ris, path in zip(following, args.following, strict=True)}
        written = write_outputs(plan, blocks, checklist, out_dir)
    except ReconcileError as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1
    for path in written:
        print(f"Written: {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
