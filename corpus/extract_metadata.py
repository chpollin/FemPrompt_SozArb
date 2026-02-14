#!/usr/bin/env python3
"""
Extract metadata from Zotero JSON export to CSV for assessment.

Resolves Source_Tool provenance using two strategies:
1. Collection-based: Maps Zotero collection IDs to Deep Research source tools
   via source_tool_mapping.json (generated from restored RIS files)
2. RIS-based: Direct title matching from restored RIS files

Usage:
    python extract_metadata.py --input zotero_export.json --output papers_metadata.csv
    python extract_metadata.py --input zotero_export.json --output papers_metadata.csv --mapping source_tool_mapping.json
"""

import json
import csv
import re
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

    match = re.search(r'\b(19|20)\d{2}\b', str(date))
    return match.group(0) if match else str(date)[:4] if len(str(date)) >= 4 else ""


def load_source_mapping(mapping_path: Path) -> dict:
    """Load source tool mapping (collection-based and RIS-based)."""
    if not mapping_path.exists():
        return {}, {}

    with open(mapping_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Build collection_id -> source_tool lookup
    coll_to_source = {}
    deep_research = data.get("collection_mapping", {}).get("deep_research_collections", {})
    for coll_id, info in deep_research.items():
        coll_to_source[coll_id] = info["source_tool"]

    # Build zotero_key -> [source_tools] lookup from RIS matching
    key_to_sources = {}
    for key, sources in data.get("source_tool_mapping", {}).items():
        key_to_sources[key] = sources

    return coll_to_source, key_to_sources


def resolve_source_tool(item: dict, coll_to_source: dict, key_to_sources: dict) -> str:
    """Resolve Source_Tool for a paper using collection mapping and RIS matching."""
    key = item.get("key", "")
    collections = item.get("collections", [])

    sources = set()

    # Strategy 1: RIS-based direct match (highest confidence)
    if key in key_to_sources:
        sources.update(key_to_sources[key])

    # Strategy 2: Collection-based inference
    for coll_id in collections:
        if coll_id in coll_to_source:
            sources.add(coll_to_source[coll_id])

    return "; ".join(sorted(sources)) if sources else ""


def main():
    parser = argparse.ArgumentParser(description="Extract metadata from Zotero JSON")
    parser.add_argument("--input", "-i", default="zotero_export.json",
                        help="Input JSON file")
    parser.add_argument("--output", "-o", default="papers_metadata.csv",
                        help="Output CSV file")
    parser.add_argument("--mapping", "-m", default="source_tool_mapping.json",
                        help="Source tool mapping JSON (default: source_tool_mapping.json)")
    args = parser.parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output)
    mapping_path = input_path.parent / args.mapping

    # Load source tool mapping
    coll_to_source, key_to_sources = load_source_mapping(mapping_path)
    if coll_to_source or key_to_sources:
        print(f"Loaded source mapping: {len(coll_to_source)} collections, {len(key_to_sources)} RIS matches")
    else:
        print("Warning: No source_tool_mapping.json found. Source_Tool column will be empty.")

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
        "Source_Tool"
    ]

    # Extract metadata
    rows = []
    source_tool_count = 0
    for idx, item in enumerate(data, start=1):
        source_tool = resolve_source_tool(item, coll_to_source, key_to_sources)
        if source_tool:
            source_tool_count += 1

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
            "Source_Tool": source_tool
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
    print(f"  - Papers with Source_Tool: {source_tool_count}/{len(rows)}")


if __name__ == "__main__":
    main()
