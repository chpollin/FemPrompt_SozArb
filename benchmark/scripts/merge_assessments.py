#!/usr/bin/env python3
"""
Merge Human and Agent Assessments

Fuehrt Human-Assessment (Google Sheets Export) und Agent-Assessment (LLM)
zusammen fuer die Benchmark-Analyse.

Usage:
    python merge_assessments.py \
        --human ../data/human_assessment.csv \
        --agent ../data/llm_assessment.csv \
        --output ../data/merged_comparison.csv
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
    Prefix wird den Spalten vorangestellt (human_ oder agent_).
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
            if prefix == 'agent':
                entry['agent_confidence'] = row.get('LLM_Confidence', row.get('Confidence', ''))
                entry['agent_reasoning'] = row.get('LLM_Reasoning', row.get('Reasoning', ''))

            data[str(paper_id)] = entry

    return data


def merge_assessments(human_data: dict, agent_data: dict) -> list:
    """Führt Human und LLM Assessments zusammen."""

    merged = []

    # Alle IDs sammeln
    all_ids = set(human_data.keys()) | set(agent_data.keys())

    for paper_id in sorted(all_ids, key=lambda x: int(x) if x.isdigit() else x):
        human = human_data.get(paper_id, {})
        agent = agent_data.get(paper_id, {})

        row = {
            'paper_id': paper_id,
            'title': human.get('human_title', agent.get('agent_title', '')),
            'author_year': human.get('human_author_year', agent.get('agent_author_year', '')),
            'has_human': 'Ja' if paper_id in human_data else 'Nein',
            'has_agent': 'Ja' if paper_id in agent_data else 'Nein',
        }

        # Kategorien vergleichen
        category_agreements = 0
        category_total = 0

        for cat in CATEGORIES:
            human_val = human.get(f'human_{cat}', '')
            agent_val = agent.get(f'agent_{cat}', '')

            row[f'human_{cat}'] = human_val
            row[f'agent_{cat}'] = agent_val

            # Agreement berechnen (nur wenn beide Werte vorhanden)
            if human_val and agent_val:
                agrees = human_val == agent_val
                row[f'agree_{cat}'] = 'Ja' if agrees else 'Nein'
                category_total += 1
                if agrees:
                    category_agreements += 1
            else:
                row[f'agree_{cat}'] = ''

        # Decision vergleichen
        row['human_decision'] = human.get('human_decision', '')
        row['agent_decision'] = agent.get('agent_decision', '')

        if row['human_decision'] and row['agent_decision']:
            row['agree_decision'] = 'Ja' if row['human_decision'] == row['agent_decision'] else 'Nein'
        else:
            row['agree_decision'] = ''

        # Zusatzinfos
        row['human_exclusion_reason'] = human.get('human_exclusion_reason', '')
        row['agent_exclusion_reason'] = agent.get('agent_exclusion_reason', '')
        row['human_studientyp'] = human.get('human_studientyp', '')
        row['agent_studientyp'] = agent.get('agent_studientyp', '')
        row['agent_confidence'] = agent.get('agent_confidence', '')
        row['agent_reasoning'] = agent.get('agent_reasoning', '')

        # Aggregierte Metriken
        row['category_agreements'] = category_agreements
        row['category_total'] = category_total
        row['category_agreement_rate'] = f"{category_agreements/category_total:.2%}" if category_total > 0 else ''

        merged.append(row)

    return merged


def main():
    parser = argparse.ArgumentParser(description='Merge Human and Agent Assessments')
    parser.add_argument('--human', required=True, help='Human Assessment CSV')
    parser.add_argument('--agent', '--agent', dest='agent', required=True, help='Agent Assessment CSV')
    parser.add_argument('--output', required=True, help='Output merged CSV')
    args = parser.parse_args()

    print(f"Lade Human-Assessment: {args.human}")
    human_data = load_assessment(args.human, 'human')
    print(f"  -> {len(human_data)} Eintraege")

    print(f"Lade Agent-Assessment: {args.agent}")
    agent_data = load_assessment(args.agent, 'agent')
    print(f"  -> {len(agent_data)} Eintraege")

    print("\nMerge Assessments...")
    merged = merge_assessments(human_data, agent_data)

    # Statistiken
    both_present = sum(1 for r in merged if r['has_human'] == 'Ja' and r['has_agent'] == 'Ja')
    human_only = sum(1 for r in merged if r['has_human'] == 'Ja' and r['has_agent'] == 'Nein')
    agent_only = sum(1 for r in merged if r['has_human'] == 'Nein' and r['has_agent'] == 'Ja')

    print(f"  → {len(merged)} Papers total")
    print(f"  → {both_present} mit beiden Assessments")
    print(f"  → {human_only} nur Human")
    print(f"  → {agent_only} nur LLM")

    # Output schreiben
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Fieldnames in sinnvoller Reihenfolge
    fieldnames = ['paper_id', 'title', 'author_year', 'has_human', 'has_agent']

    for cat in CATEGORIES:
        fieldnames.extend([f'human_{cat}', f'agent_{cat}', f'agree_{cat}'])

    fieldnames.extend([
        'human_decision', 'agent_decision', 'agree_decision',
        'human_exclusion_reason', 'agent_exclusion_reason',
        'human_studientyp', 'agent_studientyp',
        'agent_confidence', 'agent_reasoning',
        'category_agreements', 'category_total', 'category_agreement_rate'
    ])

    with open(args.output, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(merged)

    print(f"\nOutput: {args.output}")


if __name__ == '__main__':
    main()
