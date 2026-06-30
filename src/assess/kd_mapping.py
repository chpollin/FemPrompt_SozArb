#!/usr/bin/env python3
"""
KD-to-Zotero Mapping Module

Maps Knowledge Documents (pipeline/knowledge/distilled/) to Zotero_Keys
(benchmark/data/papers_full.csv) using a 3-strategy matching approach.
No Zotero API dependency -- uses only local files.

Usage (standalone test):
    python kd_mapping.py --papers ../data/papers_full.csv --kd-dir ../../pipeline/knowledge/distilled
"""

import argparse
import csv
import json
import re
import unicodedata
from difflib import SequenceMatcher
from pathlib import Path
from typing import Dict, List, Optional, Tuple


def normalize_for_matching(text: str) -> str:
    """Lowercase, strip punctuation, collapse whitespace."""
    if not text:
        return ""
    text = unicodedata.normalize('NFKD', text)
    text = text.lower()
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def extract_author_year_from_stem(stem: str) -> Tuple[Optional[str], Optional[str]]:
    """Parse AuthorSurname and YYYY from KD filename stem.

    Pattern: AuthorSurname_YYYY_Title_words...
    Examples:
        Ahmed_2024_Feminist_perspectives -> ('ahmed', '2024')
        A+ Alliance_2024_Incubating -> ('a+ alliance', '2024')
    """
    match = re.match(r'^(.+?)_(\d{4})_', stem)
    if match:
        return match.group(1).lower().strip(), match.group(2)
    return None, None


def extract_author_year_from_csv(author_year_str: str) -> Tuple[Optional[str], Optional[str]]:
    """Parse first author surname and year from CSV Author_Year column.

    Patterns:
        'Ahmed (2024)' -> ('ahmed', '2024')
        'Chatterji et al. (2025)' -> ('chatterji', '2025')
        'D'Ignazio & Klein (2020)' -> ("d'ignazio", '2020')
    """
    if not author_year_str:
        return None, None
    year_match = re.search(r'\((\d{4})\)', author_year_str)
    year = year_match.group(1) if year_match else None
    surname = re.split(r'\s*(?:et al\.?|&|\()', author_year_str)[0].strip().lower()
    return surname, year


def load_papers_index(papers_csv: Path) -> Dict[str, dict]:
    """Load papers_full.csv and index by normalized title and author/year."""
    papers = {}
    with open(papers_csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            zkey = row.get('Zotero_Key', '').strip()
            if not zkey:
                continue
            title_norm = normalize_for_matching(row.get('Title', ''))
            author, year = extract_author_year_from_csv(row.get('Author_Year', ''))
            papers[zkey] = {
                'title': row.get('Title', ''),
                'title_norm': title_norm,
                'author': author,
                'year': year,
                'author_year': row.get('Author_Year', ''),
            }
    return papers


def build_kd_mapping(papers_csv: Path, kd_dir: Path) -> Tuple[Dict[str, Path], List[str]]:
    """Build {zotero_key: kd_markdown_path} mapping using 3-strategy matching.

    Returns:
        matched: dict mapping Zotero_Key -> Path to KD markdown file
        unmatched: list of KD stems that could not be matched
    """
    papers = load_papers_index(papers_csv)
    stage1_dir = kd_dir / '_stage1_json'

    # Build lookup structures
    title_to_zkey = {}
    author_year_to_zkeys = {}
    for zkey, info in papers.items():
        if info['title_norm']:
            title_to_zkey[info['title_norm']] = zkey
        if info['author'] and info['year']:
            key = (info['author'], info['year'])
            author_year_to_zkeys.setdefault(key, []).append(zkey)

    # Collect KD stems (from markdown files, not stage1 json)
    kd_files = sorted(kd_dir.glob('*.md'))
    matched = {}
    unmatched = []
    stats = {'strategy1': 0, 'strategy2': 0, 'strategy3': 0}

    for kd_path in kd_files:
        stem = kd_path.stem
        zkey = None

        # Strategy 1: Stage1 JSON metadata.title -> CSV Title (exact normalized)
        json_path = stage1_dir / f'{stem}.json'
        if json_path.exists():
            try:
                with open(json_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                s1_title = normalize_for_matching(
                    data.get('metadata', {}).get('title', '')
                )
                if s1_title and s1_title in title_to_zkey:
                    zkey = title_to_zkey[s1_title]
                    stats['strategy1'] += 1
            except (json.JSONDecodeError, KeyError):
                pass

        # Strategy 2: Filename author+year -> CSV Author_Year
        if not zkey:
            stem_author, stem_year = extract_author_year_from_stem(stem)
            if stem_author and stem_year:
                # Direct match
                candidates = author_year_to_zkeys.get((stem_author, stem_year), [])
                if not candidates:
                    # Flexible prefix match (handle surname variants)
                    for (csv_author, csv_year), zkeys in author_year_to_zkeys.items():
                        if csv_year == stem_year and (
                            csv_author.startswith(stem_author[:3]) or
                            stem_author.startswith(csv_author[:3])
                        ):
                            candidates.extend(zkeys)

                if len(candidates) == 1:
                    zkey = candidates[0]
                    stats['strategy2'] += 1
                elif len(candidates) > 1:
                    # Disambiguate by title similarity
                    stem_title_part = normalize_for_matching(
                        re.sub(r'^.+?_\d{4}_', '', stem).replace('_', ' ')
                    )
                    best_ratio = 0
                    best_zkey = None
                    for c in candidates:
                        ratio = SequenceMatcher(
                            None, stem_title_part, papers[c]['title_norm']
                        ).ratio()
                        if ratio > best_ratio:
                            best_ratio = ratio
                            best_zkey = c
                    if best_zkey and best_ratio >= 0.3:
                        zkey = best_zkey
                        stats['strategy2'] += 1

        # Strategy 3: Fuzzy title match (KD YAML title or stem -> CSV title)
        if not zkey:
            # Try YAML frontmatter title from the markdown file
            kd_title = None
            try:
                text = kd_path.read_text(encoding='utf-8')
                if text.startswith('---'):
                    fm_end = text.index('---', 3)
                    fm = text[3:fm_end]
                    title_match = re.search(r'^title:\s*["\']?(.+?)["\']?\s*$', fm, re.MULTILINE)
                    if title_match:
                        kd_title = normalize_for_matching(title_match.group(1))
            except (ValueError, UnicodeDecodeError):
                pass

            if not kd_title:
                kd_title = normalize_for_matching(
                    re.sub(r'^.+?_\d{4}_', '', stem).replace('_', ' ')
                )

            best_ratio = 0
            best_zkey = None
            for z, info in papers.items():
                ratio = SequenceMatcher(None, kd_title, info['title_norm']).ratio()
                if ratio > best_ratio:
                    best_ratio = ratio
                    best_zkey = z
            if best_zkey and best_ratio >= 0.65:
                zkey = best_zkey
                stats['strategy3'] += 1

        if zkey and zkey not in matched:
            matched[zkey] = kd_path
        elif zkey and zkey in matched:
            # Duplicate match -- keep the one with longer filename (more specific)
            if len(str(kd_path)) > len(str(matched[zkey])):
                matched[zkey] = kd_path
        else:
            unmatched.append(stem)

    return matched, unmatched, stats


def load_kd_sections(kd_path: Path) -> str:
    """Read KD markdown and return assessment-relevant sections only.

    Includes: Kernbefund, Forschungsfrage, Methodik, Hauptargumente, Kategorie-Evidenz
    Excludes: Assessment-Relevanz (leaks pre-made judgment), Schluesselreferenzen
    """
    text = kd_path.read_text(encoding='utf-8')

    # Strip YAML frontmatter
    if text.startswith('---'):
        try:
            fm_end = text.index('---', 3)
            text = text[fm_end + 3:].strip()
        except ValueError:
            pass

    # Strip the H1 title line (first # line)
    lines = text.split('\n')
    if lines and lines[0].startswith('# '):
        lines = lines[1:]
    text = '\n'.join(lines).strip()

    # Extract only desired sections
    sections_to_include = {
        'Kernbefund', 'Forschungsfrage', 'Methodik',
        'Hauptargumente', 'Kategorie-Evidenz'
    }
    sections_to_exclude = {
        'Assessment-Relevanz', 'Schlüsselreferenzen', 'Schluesselreferenzen'
    }

    result_parts = []
    current_section = None
    current_lines = []
    include_current = False

    for line in text.split('\n'):
        if line.startswith('## '):
            # Save previous section if included
            if include_current and current_lines:
                result_parts.append(f'## {current_section}')
                result_parts.extend(current_lines)
                result_parts.append('')

            # Determine new section
            current_section = line[3:].strip()
            current_lines = []
            include_current = (
                current_section in sections_to_include and
                current_section not in sections_to_exclude
            )
        else:
            current_lines.append(line)

    # Don't forget last section
    if include_current and current_lines:
        result_parts.append(f'## {current_section}')
        result_parts.extend(current_lines)

    return '\n'.join(result_parts).strip()


def main():
    import sys
    sys.stdout.reconfigure(encoding='utf-8')

    parser = argparse.ArgumentParser(description='KD-to-Zotero Mapping Test')
    parser.add_argument('--papers', required=True, help='Path to papers_full.csv')
    parser.add_argument('--kd-dir', required=True, help='Path to pipeline/knowledge/distilled/')
    args = parser.parse_args()

    papers_csv = Path(args.papers)
    kd_dir = Path(args.kd_dir)

    total_kd = len(list(kd_dir.glob('*.md')))
    total_json = len(list((kd_dir / '_stage1_json').glob('*.json')))
    print(f"Papers CSV: {papers_csv}")
    print(f"KD Directory: {kd_dir}")
    print(f"KD files found: {total_kd}")
    print(f"Stage1 JSON files: {total_json}")
    print("-" * 60)

    matched, unmatched, stats = build_kd_mapping(papers_csv, kd_dir)
    duplicates = total_kd - len(matched) - len(unmatched)

    print(f"\nMatching Results:")
    print(f"  Total KD files:    {total_kd}")
    print(f"  Unique matches:    {len(matched)} Zotero_Keys")
    print(f"  Duplicate KDs:     {duplicates} (same paper, different filename)")
    print(f"  Unmatched:         {len(unmatched)}")
    print(f"\nStrategy breakdown:")
    print(f"  Strategy 1 (Stage1 JSON title):  {stats['strategy1']}")
    print(f"  Strategy 2 (Author+Year):        {stats['strategy2']}")
    print(f"  Strategy 3 (Fuzzy title):         {stats['strategy3']}")

    if unmatched:
        print(f"\nUnmatched KD stems ({len(unmatched)}):")
        for stem in sorted(unmatched):
            print(f"  - {stem}")

    # Test load_kd_sections on first matched file
    if matched:
        first_key = next(iter(matched))
        first_path = matched[first_key]
        sections = load_kd_sections(first_path)
        print(f"\nSample KD sections ({first_path.name}):")
        print(f"  Length: {len(sections)} chars")
        print(f"  Sections found: {[l[3:] for l in sections.split(chr(10)) if l.startswith('## ')]}")


if __name__ == '__main__':
    main()
