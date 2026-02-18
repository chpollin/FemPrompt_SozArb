#!/usr/bin/env python3
"""
Generate full papers CSV from Zotero export for LLM assessment.

Parses corpus/zotero_export.json and creates a CSV with all 326 papers,
including metadata needed by run_llm_assessment.py. Also maps against
benchmark/data/human_assessment.csv to flag which papers have HA data.

Usage:
    python generate_papers_csv.py
    python generate_papers_csv.py --output benchmark/data/papers_full.csv
"""

import argparse
import csv
import json
import re
import sys
from pathlib import Path


def format_author_year(creators: list, date: str) -> str:
    """Format creators and date into 'LastName et al. (YYYY)' style."""
    if not creators:
        return f"[Author not specified] ({extract_year(date)})"

    # Get first author's last name
    first = creators[0]
    last_name = first.get("lastName", first.get("name", "Unknown"))

    year = extract_year(date)

    if len(creators) == 1:
        return f"{last_name} ({year})"
    elif len(creators) == 2:
        second = creators[1]
        second_name = second.get("lastName", second.get("name", "Unknown"))
        return f"{last_name} & {second_name} ({year})"
    else:
        return f"{last_name} et al. ({year})"


def extract_year(date: str) -> str:
    """Extract year from various date formats."""
    if not date:
        return "n.d."
    match = re.search(r"(\d{4})", date)
    return match.group(1) if match else "n.d."


def load_ha_keys(ha_path: Path) -> dict:
    """Load Zotero keys from human assessment CSV. Returns key -> row mapping."""
    if not ha_path.exists():
        print(f"Warning: {ha_path} not found. Has_HA will be False for all.")
        return {}

    ha_keys = {}
    with open(ha_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            key = row.get("Zotero_Key", "").strip()
            if key:
                ha_keys[key] = row
    return ha_keys


def detect_duplicates_in_zotero(entries: list) -> set:
    """
    Detect duplicate entries within the Zotero export by title similarity.
    Returns set of keys that are duplicates (keeping the first occurrence).
    """
    # Normalize titles for comparison
    title_map = {}  # normalized_title -> first_key
    duplicate_keys = set()

    for entry in entries:
        title = entry.get("title", "").strip()
        if not title:
            continue

        # Normalize: lowercase, strip punctuation, collapse whitespace
        normalized = re.sub(r"[^\w\s]", "", title.lower())
        normalized = re.sub(r"\s+", " ", normalized).strip()

        if normalized in title_map:
            duplicate_keys.add(entry["key"])
        else:
            title_map[normalized] = entry["key"]

    return duplicate_keys


def main():
    # Resolve project root (two levels up from this script)
    script_dir = Path(__file__).resolve().parent
    project_root = script_dir.parent.parent

    parser = argparse.ArgumentParser(
        description="Generate full papers CSV from Zotero export"
    )
    parser.add_argument(
        "--zotero",
        default=str(project_root / "corpus" / "zotero_export.json"),
        help="Path to Zotero JSON export",
    )
    parser.add_argument(
        "--ha",
        default=str(project_root / "benchmark" / "data" / "human_assessment.csv"),
        help="Path to human assessment CSV",
    )
    parser.add_argument(
        "--output",
        default=str(project_root / "benchmark" / "data" / "papers_full.csv"),
        help="Output CSV path",
    )
    args = parser.parse_args()

    # Load Zotero export
    zotero_path = Path(args.zotero)
    if not zotero_path.exists():
        print(f"Error: {zotero_path} not found")
        sys.exit(1)

    print(f"Loading Zotero export from {zotero_path}...")
    with open(zotero_path, "r", encoding="utf-8") as f:
        entries = json.load(f)
    print(f"  {len(entries)} entries loaded")

    # Load human assessment keys
    ha_path = Path(args.ha)
    print(f"Loading human assessment from {ha_path}...")
    ha_keys = load_ha_keys(ha_path)
    print(f"  {len(ha_keys)} HA entries loaded")

    # Detect duplicates within Zotero export
    zotero_dupes = detect_duplicates_in_zotero(entries)
    print(f"  {len(zotero_dupes)} title-based duplicates detected in Zotero")

    # Also check which are marked as Duplicate in HA
    ha_dupes = set()
    for key, row in ha_keys.items():
        if row.get("Exclusion_Reason", "").strip() == "Duplicate":
            ha_dupes.add(key)
    print(f"  {len(ha_dupes)} marked as Duplicate in HA")

    # Combine duplicate sets
    all_dupes = zotero_dupes | ha_dupes

    # Generate CSV
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    fieldnames = [
        "ID",
        "Zotero_Key",
        "Author_Year",
        "Title",
        "DOI",
        "URL",
        "Abstract",
        "Item_Type",
        "Publication_Year",
        "Collections",
        "Is_Duplicate",
        "Has_HA",
    ]

    rows_written = 0
    dup_count = 0
    ha_match_count = 0
    no_abstract_count = 0

    with open(output_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()

        for i, entry in enumerate(entries, start=1):
            key = entry.get("key", "")
            title = entry.get("title", "")
            creators = entry.get("creators", [])
            date = entry.get("date", "")
            abstract = entry.get("abstractNote", "").strip()
            doi = entry.get("DOI", "").strip()
            url = entry.get("url", "").strip()
            item_type = entry.get("itemType", "")
            collections = entry.get("collections", [])

            is_dup = key in all_dupes
            has_ha = key in ha_keys

            if is_dup:
                dup_count += 1
            if has_ha:
                ha_match_count += 1
            if not abstract:
                no_abstract_count += 1

            row = {
                "ID": i,
                "Zotero_Key": key,
                "Author_Year": format_author_year(creators, date),
                "Title": title,
                "DOI": doi,
                "URL": url,
                "Abstract": abstract,
                "Item_Type": item_type,
                "Publication_Year": extract_year(date),
                "Collections": ";".join(collections) if collections else "",
                "Is_Duplicate": "Yes" if is_dup else "No",
                "Has_HA": "Yes" if has_ha else "No",
            }
            writer.writerow(row)
            rows_written += 1

    print(f"\nOutput: {output_path}")
    print(f"  Total rows: {rows_written}")
    print(f"  Duplicates flagged: {dup_count}")
    print(f"  With HA data: {ha_match_count}")
    print(f"  Without abstract: {no_abstract_count}")
    print(f"  Without HA (Zotero-only): {rows_written - ha_match_count}")


if __name__ == "__main__":
    main()
