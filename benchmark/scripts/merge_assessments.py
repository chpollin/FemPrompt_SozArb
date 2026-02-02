#!/usr/bin/env python3
"""
Merge Human and LLM Assessments

Führt Human-Assessment (Google Sheets Export) und LLM-Assessment zusammen
für die Benchmark-Analyse.

Usage:
    python merge_assessments.py --human data/human_assessment.csv --llm data/llm_assessment.csv --output data/merged_comparison.csv
"""

import argparse
import csv
from pathlib import Path


# Kategorien für Vergleich
CATEGORIES = [
    'AI_Literacies', 'Generative_KI', 'Prompting', 'KI_Sonstige',
    'Soziale_Arbeit', 'Bias_Ungleichheit', 'Gender', 'Diversitaet', 'Feministisch', 'Fairness'
]


def normalize_value(value: str) -> str:
    """Normalisiert Ja/Nein Werte."""
    if not value:
        return ''
    v = str(value).strip().lower()
    if v in ['ja', 'yes', '1', 'true', 'x']:
        return 'Ja'
    if v in ['nein', 'no', '0', 'false', '']:
        return 'Nein'
    return value


def normalize_decision(value: str) -> str:
    """Normalisiert Decision Werte."""
    if not value:
        return ''
    v = str(value).strip().lower()
    if v in ['include', 'included', 'yes', '1']:
        return 'Include'
    if v in ['exclude', 'excluded', 'no', '0']:
        return 'Exclude'
    if v in ['unclear', 'maybe', '?']:
        return 'Unclear'
    return value


def load_assessment(filepath: str, prefix: str) -> dict:
    """
    Lädt Assessment CSV und gibt Dictionary mit ID als Key zurück.
    Prefix wird den Spalten vorangestellt (human_ oder llm_).
    """
    data = {}

    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)

        for row in reader:
            # ID extrahieren (verschiedene mögliche Spaltennamen)
            paper_id = row.get('ID') or row.get('id') or row.get('Zotero_Key') or row.get('zotero_key')

            if not paper_id:
                continue

            entry = {
                f'{prefix}_id': paper_id,
                f'{prefix}_title': row.get('Title', ''),
                f'{prefix}_author_year': row.get('Author_Year', ''),
            }

            # Kategorien mit Prefix
            for cat in CATEGORIES:
                entry[f'{prefix}_{cat}'] = normalize_value(row.get(cat, ''))

            # Decision
            entry[f'{prefix}_decision'] = normalize_decision(row.get('Decision', ''))
            entry[f'{prefix}_exclusion_reason'] = row.get('Exclusion_Reason', '')
            entry[f'{prefix}_studientyp'] = row.get('Studientyp', '')

            # LLM-spezifische Felder
            if prefix == 'llm':
                entry['llm_confidence'] = row.get('LLM_Confidence', row.get('Confidence', ''))
                entry['llm_reasoning'] = row.get('LLM_Reasoning', row.get('Reasoning', ''))

            data[str(paper_id)] = entry

    return data


def merge_assessments(human_data: dict, llm_data: dict) -> list:
    """Führt Human und LLM Assessments zusammen."""

    merged = []

    # Alle IDs sammeln
    all_ids = set(human_data.keys()) | set(llm_data.keys())

    for paper_id in sorted(all_ids, key=lambda x: int(x) if x.isdigit() else x):
        human = human_data.get(paper_id, {})
        llm = llm_data.get(paper_id, {})

        row = {
            'paper_id': paper_id,
            'title': human.get('human_title', llm.get('llm_title', '')),
            'author_year': human.get('human_author_year', llm.get('llm_author_year', '')),
            'has_human': 'Ja' if paper_id in human_data else 'Nein',
            'has_llm': 'Ja' if paper_id in llm_data else 'Nein',
        }

        # Kategorien vergleichen
        category_agreements = 0
        category_total = 0

        for cat in CATEGORIES:
            human_val = human.get(f'human_{cat}', '')
            llm_val = llm.get(f'llm_{cat}', '')

            row[f'human_{cat}'] = human_val
            row[f'llm_{cat}'] = llm_val

            # Agreement berechnen (nur wenn beide Werte vorhanden)
            if human_val and llm_val:
                agrees = human_val == llm_val
                row[f'agree_{cat}'] = 'Ja' if agrees else 'Nein'
                category_total += 1
                if agrees:
                    category_agreements += 1
            else:
                row[f'agree_{cat}'] = ''

        # Decision vergleichen
        row['human_decision'] = human.get('human_decision', '')
        row['llm_decision'] = llm.get('llm_decision', '')

        if row['human_decision'] and row['llm_decision']:
            row['agree_decision'] = 'Ja' if row['human_decision'] == row['llm_decision'] else 'Nein'
        else:
            row['agree_decision'] = ''

        # Zusatzinfos
        row['human_exclusion_reason'] = human.get('human_exclusion_reason', '')
        row['llm_exclusion_reason'] = llm.get('llm_exclusion_reason', '')
        row['human_studientyp'] = human.get('human_studientyp', '')
        row['llm_studientyp'] = llm.get('llm_studientyp', '')
        row['llm_confidence'] = llm.get('llm_confidence', '')
        row['llm_reasoning'] = llm.get('llm_reasoning', '')

        # Aggregierte Metriken
        row['category_agreements'] = category_agreements
        row['category_total'] = category_total
        row['category_agreement_rate'] = f"{category_agreements/category_total:.2%}" if category_total > 0 else ''

        merged.append(row)

    return merged


def main():
    parser = argparse.ArgumentParser(description='Merge Human and LLM Assessments')
    parser.add_argument('--human', required=True, help='Human Assessment CSV')
    parser.add_argument('--llm', required=True, help='LLM Assessment CSV')
    parser.add_argument('--output', required=True, help='Output merged CSV')
    args = parser.parse_args()

    print(f"Lade Human-Assessment: {args.human}")
    human_data = load_assessment(args.human, 'human')
    print(f"  → {len(human_data)} Einträge")

    print(f"Lade LLM-Assessment: {args.llm}")
    llm_data = load_assessment(args.llm, 'llm')
    print(f"  → {len(llm_data)} Einträge")

    print("\nMerge Assessments...")
    merged = merge_assessments(human_data, llm_data)

    # Statistiken
    both_present = sum(1 for r in merged if r['has_human'] == 'Ja' and r['has_llm'] == 'Ja')
    human_only = sum(1 for r in merged if r['has_human'] == 'Ja' and r['has_llm'] == 'Nein')
    llm_only = sum(1 for r in merged if r['has_human'] == 'Nein' and r['has_llm'] == 'Ja')

    print(f"  → {len(merged)} Papers total")
    print(f"  → {both_present} mit beiden Assessments")
    print(f"  → {human_only} nur Human")
    print(f"  → {llm_only} nur LLM")

    # Output schreiben
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Fieldnames in sinnvoller Reihenfolge
    fieldnames = ['paper_id', 'title', 'author_year', 'has_human', 'has_llm']

    for cat in CATEGORIES:
        fieldnames.extend([f'human_{cat}', f'llm_{cat}', f'agree_{cat}'])

    fieldnames.extend([
        'human_decision', 'llm_decision', 'agree_decision',
        'human_exclusion_reason', 'llm_exclusion_reason',
        'human_studientyp', 'llm_studientyp',
        'llm_confidence', 'llm_reasoning',
        'category_agreements', 'category_total', 'category_agreement_rate'
    ])

    with open(args.output, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(merged)

    print(f"\nOutput: {args.output}")


if __name__ == '__main__':
    main()
