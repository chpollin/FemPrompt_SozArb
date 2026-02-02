#!/usr/bin/env python3
"""
Prepare Assessment Data

Konvertiert Zotero JSON Export in CSV-Format für LLM-Assessment.
"""

import csv
import json
import re
from pathlib import Path


def extract_year(date_str: str) -> str:
    """Extrahiert Jahr aus Datumsstring."""
    if not date_str:
        return ""
    # Versuche verschiedene Formate
    match = re.search(r'(\d{4})', date_str)
    return match.group(1) if match else ""


def format_authors(creators: list) -> str:
    """Formatiert Autorenliste."""
    if not creators:
        return ""

    authors = []
    for c in creators:
        if c.get('creatorType') == 'author':
            last = c.get('lastName', '')
            first = c.get('firstName', '')
            if last:
                authors.append(f"{last}, {first}" if first else last)

    if not authors:
        return ""
    if len(authors) == 1:
        return authors[0]
    if len(authors) == 2:
        return f"{authors[0]} & {authors[1]}"
    return f"{authors[0]} et al."


def format_author_year(creators: list, date: str) -> str:
    """Formatiert Author (Year) String."""
    authors = format_authors(creators)
    year = extract_year(date)

    if authors and year:
        # Nur Nachname des ersten Autors
        first_author = creators[0].get('lastName', '') if creators else ''
        if len(creators) > 2:
            return f"{first_author} et al. ({year})"
        elif len(creators) == 2:
            second_author = creators[1].get('lastName', '')
            return f"{first_author} & {second_author} ({year})"
        else:
            return f"{first_author} ({year})"
    elif authors:
        return authors
    elif year:
        return f"({year})"
    return ""


def main():
    input_file = Path("analysis/zotero_vereinfacht.json")
    output_file = Path("benchmark/data/femprompt_papers.csv")

    # Lade Zotero Daten
    print(f"Lade: {input_file}")
    with open(input_file, 'r', encoding='utf-8') as f:
        papers = json.load(f)

    print(f"Gefunden: {len(papers)} Papers")

    # Erstelle Output-Verzeichnis
    output_file.parent.mkdir(parents=True, exist_ok=True)

    # Konvertiere zu CSV
    rows = []
    for i, paper in enumerate(papers, 1):
        row = {
            'ID': i,
            'Zotero_Key': paper.get('key', ''),
            'Title': paper.get('title', ''),
            'Author_Year': format_author_year(paper.get('creators', []), paper.get('date', '')),
            'Authors': format_authors(paper.get('creators', [])),
            'Year': extract_year(paper.get('date', '')),
            'DOI': paper.get('DOI', ''),
            'URL': paper.get('url', ''),
            'Abstract': paper.get('abstractNote', ''),
            'ItemType': paper.get('itemType', ''),
        }
        rows.append(row)

    # Schreibe CSV
    fieldnames = ['ID', 'Zotero_Key', 'Title', 'Author_Year', 'Authors', 'Year', 'DOI', 'URL', 'Abstract', 'ItemType']

    with open(output_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    # Statistiken
    with_abstract = sum(1 for r in rows if r['Abstract'])
    with_doi = sum(1 for r in rows if r['DOI'])

    print(f"\nOutput: {output_file}")
    print(f"Papers gesamt: {len(rows)}")
    print(f"Mit Abstract: {with_abstract} ({100*with_abstract/len(rows):.1f}%)")
    print(f"Mit DOI: {with_doi} ({100*with_doi/len(rows):.1f}%)")


if __name__ == '__main__':
    main()
