#!/usr/bin/env python3
"""
Extract metadata from Zotero JSON export to CSV for assessment.

Usage:
    python extract_metadata.py --input zotero_export.json --output papers_metadata.csv
"""

import json
import csv
import argparse
from pathlib import Path


def extract_creators(creators: list) -> str:
    """Extract author names from creators list."""
    if not creators:
        return ""

    authors = []
    for creator in creators:
        if creator.get("creatorType") == "author":
            last = creator.get("lastName", "")
            first = creator.get("firstName", "")
            if last and first:
                authors.append(f"{last}, {first}")
            elif last:
                authors.append(last)
            elif first:
                authors.append(first)

    return "; ".join(authors) if authors else ""


def extract_year(date: str) -> str:
    """Extract year from date string."""
    if not date:
        return ""

    # Try to extract 4-digit year
    import re
    match = re.search(r'\b(19|20)\d{2}\b', str(date))
    return match.group(0) if match else str(date)[:4] if len(str(date)) >= 4 else ""


def main():
    parser = argparse.ArgumentParser(description="Extract metadata from Zotero JSON")
    parser.add_argument("--input", "-i", default="zotero_export.json",
                        help="Input JSON file")
    parser.add_argument("--output", "-o", default="papers_metadata.csv",
                        help="Output CSV file")
    args = parser.parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output)

    # Load JSON
    print(f"Loading {input_path}...")
    with open(input_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    print(f"Found {len(data)} papers")

    # Define output fields
    fieldnames = [
        "ID",
        "Zotero_Key",
        "Title",
        "Authors",
        "Year",
        "DOI",
        "URL",
        "Abstract",
        "Item_Type",
        "Journal",
        "Source_Tool"  # Which Deep Research tool found it
    ]

    # Extract metadata
    rows = []
    for idx, item in enumerate(data, start=1):
        row = {
            "ID": idx,
            "Zotero_Key": item.get("key", ""),
            "Title": item.get("title", ""),
            "Authors": extract_creators(item.get("creators", [])),
            "Year": extract_year(item.get("date", "")),
            "DOI": item.get("DOI", ""),
            "URL": item.get("url", ""),
            "Abstract": item.get("abstractNote", ""),
            "Item_Type": item.get("itemType", ""),
            "Journal": item.get("publicationTitle", "") or item.get("journalAbbreviation", ""),
            "Source_Tool": item.get("extra", "").split("\n")[0] if item.get("extra") else ""
        }
        rows.append(row)

    # Write CSV
    print(f"Writing {output_path}...")
    with open(output_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Done! Extracted {len(rows)} papers to {output_path}")

    # Print summary
    with_abstract = sum(1 for r in rows if r["Abstract"])
    with_doi = sum(1 for r in rows if r["DOI"])
    print(f"\nSummary:")
    print(f"  - Papers with abstract: {with_abstract}/{len(rows)}")
    print(f"  - Papers with DOI: {with_doi}/{len(rows)}")


if __name__ == "__main__":
    main()
