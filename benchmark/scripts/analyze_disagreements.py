#!/usr/bin/env python3
"""
Analyze Disagreement Cases

Identifiziert und analysiert Fälle, bei denen Human und Agent Assessment
unterschiedliche Entscheidungen getroffen haben. Für qualitative Auswertung im Paper.

Usage:
    python analyze_disagreements.py --input data/merged_comparison.csv --output results/disagreement_cases.csv
"""

import argparse
import csv
from pathlib import Path
from collections import Counter


CATEGORIES = [
    'AI_Literacies', 'Generative_KI', 'Prompting', 'KI_Sonstige',
    'Soziale_Arbeit', 'Bias_Ungleichheit', 'Gender', 'Diversitaet', 'Feministisch', 'Fairness'
]


def classify_disagreement(row: dict) -> dict:
    """
    Klassifiziert einen Disagreement-Fall.

    Returns dict mit:
    - type: Art des Disagreements
    - severity: Schwere (1-3)
    - affected_categories: Welche Kategorien unterschiedlich bewertet wurden
    """
    human_dec = row.get('human_decision', '')
    agent_dec = row.get('agent_decision', '')

    # Decision Disagreement Type
    if human_dec == 'Include' and agent_dec == 'Exclude':
        dec_type = 'Human_Include_Agent_Exclude'
        severity = 3  # Kritisch - Agent würde relevantes Paper ausschließen
    elif human_dec == 'Exclude' and agent_dec == 'Include':
        dec_type = 'Human_Exclude_Agent_Include'
        severity = 2  # Mittel - Agent würde irrelevantes Paper einschließen
    elif human_dec == 'Include' and agent_dec == 'Unclear':
        dec_type = 'Human_Include_Agent_Unclear'
        severity = 2
    elif human_dec == 'Exclude' and agent_dec == 'Unclear':
        dec_type = 'Human_Exclude_Agent_Unclear'
        severity = 1
    elif human_dec == 'Unclear':
        dec_type = 'Human_Unclear'
        severity = 1
    else:
        dec_type = 'Other'
        severity = 1

    # Betroffene Kategorien identifizieren
    affected = []
    for cat in CATEGORIES:
        human_val = row.get(f'human_{cat}', '')
        agent_val = row.get(f'agent_{cat}', '')
        if human_val and agent_val and human_val != agent_val:
            affected.append(cat)

    return {
        'type': dec_type,
        'severity': severity,
        'affected_categories': affected,
        'n_affected': len(affected)
    }


def generate_annotation_hint(row: dict, classification: dict) -> str:
    """Generiert einen Hinweis für die qualitative Annotation."""

    hints = []

    # Basierend auf Disagreement Type
    if classification['type'] == 'Human_Include_Agent_Exclude':
        hints.append("KRITISCH: Agent übersieht Relevanz")
        if row.get('agent_reasoning'):
            hints.append(f"Agent-Begründung: {row['agent_reasoning'][:100]}...")

    elif classification['type'] == 'Human_Exclude_Agent_Include':
        hints.append("Agent sieht Relevanz, die Expert:innen nicht sehen")
        if row.get('human_exclusion_reason'):
            hints.append(f"Human-Exclusion: {row['human_exclusion_reason']}")

    # Betroffene Kategorien
    affected = classification['affected_categories']
    if affected:
        # Gruppieren nach Typ
        technik = [c for c in affected if c in ['AI_Literacies', 'Generative_KI', 'Prompting', 'KI_Sonstige']]
        sozial = [c for c in affected if c in ['Soziale_Arbeit', 'Bias_Ungleichheit', 'Gender', 'Diversitaet', 'Feministisch', 'Fairness']]

        if technik:
            hints.append(f"Technik-Differenz: {', '.join(technik)}")
        if sozial:
            hints.append(f"Sozial-Differenz: {', '.join(sozial)}")

    # Spezielle Kategorien
    if 'Feministisch' in affected:
        hints.append("ACHTUNG: Feministische Perspektive unterschiedlich bewertet")
    if 'Soziale_Arbeit' in affected:
        hints.append("ACHTUNG: Sozialarbeitsbezug unterschiedlich bewertet")

    return " | ".join(hints) if hints else "Keine spezifischen Hinweise"


def main():
    parser = argparse.ArgumentParser(description='Analyze Disagreement Cases')
    parser.add_argument('--input', required=True, help='Merged comparison CSV')
    parser.add_argument('--output', required=True, help='Output CSV for disagreements')
    parser.add_argument('--top', type=int, default=20, help='Top N cases für detaillierte Analyse')
    args = parser.parse_args()

    print(f"Lade Daten: {args.input}")

    rows = []
    with open(args.input, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    # Nur komplette Rows
    complete = [r for r in rows if r.get('has_human') == 'Ja' and r.get('has_agent') == 'Ja']
    print(f"Papers mit beiden Assessments: {len(complete)}")

    # Disagreements identifizieren
    disagreements = []

    for row in complete:
        if row.get('agree_decision') == 'Nein':
            classification = classify_disagreement(row)

            disagreement = {
                'paper_id': row.get('paper_id', ''),
                'title': row.get('title', ''),
                'author_year': row.get('author_year', ''),
                'human_decision': row.get('human_decision', ''),
                'agent_decision': row.get('agent_decision', ''),
                'disagreement_type': classification['type'],
                'severity': classification['severity'],
                'affected_categories': ', '.join(classification['affected_categories']),
                'n_affected_categories': classification['n_affected'],
                'human_exclusion_reason': row.get('human_exclusion_reason', ''),
                'agent_exclusion_reason': row.get('agent_exclusion_reason', ''),
                'agent_confidence': row.get('agent_confidence', ''),
                'agent_reasoning': row.get('agent_reasoning', ''),
                'annotation_hint': generate_annotation_hint(row, classification),
                'manual_annotation': ''  # Platzhalter für manuelle Analyse
            }

            # Kategorie-Details
            for cat in CATEGORIES:
                disagreement[f'human_{cat}'] = row.get(f'human_{cat}', '')
                disagreement[f'agent_{cat}'] = row.get(f'agent_{cat}', '')

            disagreements.append(disagreement)

    print(f"Disagreements gefunden: {len(disagreements)}")

    # Sortieren nach Severity (absteigend), dann nach affected categories
    disagreements.sort(key=lambda x: (-x['severity'], -x['n_affected_categories']))

    # Statistiken
    type_counts = Counter(d['disagreement_type'] for d in disagreements)
    severity_counts = Counter(d['severity'] for d in disagreements)

    print("\n📊 Disagreement Types:")
    for dtype, count in type_counts.most_common():
        print(f"   {dtype}: {count}")

    print("\n⚠️ Severity Distribution:")
    print(f"   Kritisch (3): {severity_counts.get(3, 0)}")
    print(f"   Mittel (2): {severity_counts.get(2, 0)}")
    print(f"   Niedrig (1): {severity_counts.get(1, 0)}")

    # Häufigste betroffene Kategorien
    all_affected = []
    for d in disagreements:
        all_affected.extend(d['affected_categories'].split(', '))
    all_affected = [a for a in all_affected if a]  # Filter empty

    print("\n📋 Most Affected Categories:")
    for cat, count in Counter(all_affected).most_common(5):
        print(f"   {cat}: {count}")

    # Output schreiben
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    fieldnames = [
        'paper_id', 'title', 'author_year',
        'human_decision', 'agent_decision', 'disagreement_type', 'severity',
        'affected_categories', 'n_affected_categories',
        'human_exclusion_reason', 'agent_exclusion_reason',
        'agent_confidence', 'agent_reasoning',
        'annotation_hint', 'manual_annotation'
    ]

    # Kategorie-Spalten hinzufügen
    for cat in CATEGORIES:
        fieldnames.extend([f'human_{cat}', f'agent_{cat}'])

    with open(args.output, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(disagreements)

    print(f"\n💾 Output: {args.output}")

    # Top Cases für Paper
    if args.top and disagreements:
        print(f"\n📝 Top {min(args.top, len(disagreements))} Cases für Paper:")
        print("-" * 80)

        for i, d in enumerate(disagreements[:args.top], 1):
            print(f"\n{i}. [{d['disagreement_type']}] Severity: {d['severity']}")
            print(f"   Title: {d['title'][:70]}...")
            print(f"   Human: {d['human_decision']} → Agent: {d['agent_decision']}")
            if d['affected_categories']:
                print(f"   Affected: {d['affected_categories']}")
            print(f"   Hint: {d['annotation_hint'][:100]}...")


if __name__ == '__main__':
    main()
