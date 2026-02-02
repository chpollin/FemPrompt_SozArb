#!/usr/bin/env python3
"""
Calculate Agreement Metrics

Berechnet Übereinstimmungsmetriken zwischen Human und Agent Assessment:
- Overall Agreement
- Cohen's Kappa
- Agreement pro Kategorie
- Konfusionsmatrix

Usage:
    python calculate_agreement.py --input data/merged_comparison.csv --output results/agreement_metrics.json
"""

import argparse
import csv
import json
from collections import Counter
from pathlib import Path


# Kategorien für Analyse
CATEGORIES = [
    'AI_Literacies', 'Generative_KI', 'Prompting', 'KI_Sonstige',
    'Soziale_Arbeit', 'Bias_Ungleichheit', 'Gender', 'Diversitaet', 'Feministisch', 'Fairness'
]


def calculate_cohens_kappa(y_true: list, y_pred: list) -> float:
    """
    Berechnet Cohen's Kappa für zwei Listen von Labels.

    Kappa = (Po - Pe) / (1 - Pe)
    Po = observed agreement
    Pe = expected agreement by chance
    """
    if len(y_true) != len(y_pred) or len(y_true) == 0:
        return 0.0

    # Observed agreement
    agreements = sum(1 for t, p in zip(y_true, y_pred) if t == p)
    po = agreements / len(y_true)

    # Expected agreement by chance
    labels = set(y_true) | set(y_pred)
    pe = 0.0

    for label in labels:
        p_true = sum(1 for t in y_true if t == label) / len(y_true)
        p_pred = sum(1 for p in y_pred if p == label) / len(y_pred)
        pe += p_true * p_pred

    # Kappa
    if pe == 1.0:
        return 1.0 if po == 1.0 else 0.0

    kappa = (po - pe) / (1 - pe)
    return round(kappa, 4)


def calculate_confusion_matrix(y_true: list, y_pred: list, labels: list) -> dict:
    """Berechnet Konfusionsmatrix als Dictionary."""
    matrix = {}

    for true_label in labels:
        for pred_label in labels:
            key = f"{true_label}_{pred_label}"
            matrix[key] = sum(1 for t, p in zip(y_true, y_pred) if t == true_label and p == pred_label)

    return matrix


def interpret_kappa(kappa: float) -> str:
    """Interpretiert Kappa-Wert."""
    if kappa < 0:
        return "poor (less than chance)"
    elif kappa < 0.20:
        return "slight"
    elif kappa < 0.40:
        return "fair"
    elif kappa < 0.60:
        return "moderate"
    elif kappa < 0.80:
        return "substantial"
    else:
        return "almost perfect"


def main():
    parser = argparse.ArgumentParser(description='Calculate Agreement Metrics')
    parser.add_argument('--input', required=True, help='Merged comparison CSV')
    parser.add_argument('--output', required=True, help='Output JSON file')
    args = parser.parse_args()

    print(f"Lade Daten: {args.input}")

    # Daten laden
    rows = []
    with open(args.input, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    # Nur Rows mit beiden Assessments
    complete_rows = [r for r in rows if r.get('has_human') == 'Ja' and r.get('has_agent') == 'Ja']
    print(f"Papers mit beiden Assessments: {len(complete_rows)}")

    if len(complete_rows) == 0:
        print("Keine vergleichbaren Daten gefunden!")
        return

    # === Decision Agreement ===
    human_decisions = [r['human_decision'] for r in complete_rows if r['human_decision']]
    agent_decisions = [r['agent_decision'] for r in complete_rows if r['agent_decision']]

    # Filtern auf Papers mit beiden Decisions
    decision_pairs = [(r['human_decision'], r['agent_decision'])
                      for r in complete_rows
                      if r['human_decision'] and r['agent_decision']]

    if decision_pairs:
        human_dec = [p[0] for p in decision_pairs]
        agent_dec = [p[1] for p in decision_pairs]

        decision_agreement = sum(1 for h, l in decision_pairs if h == l) / len(decision_pairs)
        decision_kappa = calculate_cohens_kappa(human_dec, agent_dec)
        decision_confusion = calculate_confusion_matrix(
            human_dec, agent_dec,
            ['Include', 'Exclude', 'Unclear']
        )
    else:
        decision_agreement = 0.0
        decision_kappa = 0.0
        decision_confusion = {}

    # === Category Agreement ===
    category_metrics = {}

    for cat in CATEGORIES:
        human_col = f'human_{cat}'
        agent_col = f'agent_{cat}'

        pairs = [(r[human_col], r[agent_col])
                 for r in complete_rows
                 if r.get(human_col) and r.get(agent_col)]

        if pairs:
            human_vals = [p[0] for p in pairs]
            agent_vals = [p[1] for p in pairs]

            agreement = sum(1 for h, l in pairs if h == l) / len(pairs)
            kappa = calculate_cohens_kappa(human_vals, agent_vals)

            # Counts
            human_yes = sum(1 for v in human_vals if v == 'Ja')
            agent_yes = sum(1 for v in agent_vals if v == 'Ja')

            category_metrics[cat] = {
                'n': len(pairs),
                'agreement': round(agreement, 4),
                'kappa': kappa,
                'kappa_interpretation': interpret_kappa(kappa),
                'human_yes_count': human_yes,
                'human_yes_rate': round(human_yes / len(pairs), 4) if pairs else 0,
                'agent_yes_count': agent_yes,
                'agent_yes_rate': round(agent_yes / len(pairs), 4) if pairs else 0
            }
        else:
            category_metrics[cat] = {
                'n': 0,
                'agreement': None,
                'kappa': None
            }

    # === Aggregierte Metriken ===
    overall_category_agreement = sum(
        m['agreement'] for m in category_metrics.values() if m['agreement'] is not None
    ) / len([m for m in category_metrics.values() if m['agreement'] is not None])

    # === Ergebnis zusammenstellen ===
    results = {
        'metadata': {
            'total_papers': len(rows),
            'papers_with_both_assessments': len(complete_rows),
            'papers_human_only': sum(1 for r in rows if r.get('has_human') == 'Ja' and r.get('has_agent') == 'Nein'),
            'papers_agent_only': sum(1 for r in rows if r.get('has_human') == 'Nein' and r.get('has_agent') == 'Ja')
        },
        'decision': {
            'n': len(decision_pairs),
            'overall_agreement': round(decision_agreement, 4),
            'cohens_kappa': decision_kappa,
            'kappa_interpretation': interpret_kappa(decision_kappa),
            'confusion_matrix': decision_confusion
        },
        'categories': category_metrics,
        'summary': {
            'mean_category_agreement': round(overall_category_agreement, 4),
            'best_agreement_category': max(
                [(k, v['agreement']) for k, v in category_metrics.items() if v['agreement'] is not None],
                key=lambda x: x[1]
            )[0] if category_metrics else None,
            'worst_agreement_category': min(
                [(k, v['agreement']) for k, v in category_metrics.items() if v['agreement'] is not None],
                key=lambda x: x[1]
            )[0] if category_metrics else None
        }
    }

    # Output schreiben
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    # Console Output
    print("\n" + "=" * 60)
    print("AGREEMENT METRICS")
    print("=" * 60)

    print(f"\n📊 Decision Agreement")
    print(f"   Papers: {results['decision']['n']}")
    print(f"   Overall Agreement: {results['decision']['overall_agreement']:.1%}")
    print(f"   Cohen's Kappa: {results['decision']['cohens_kappa']:.3f} ({results['decision']['kappa_interpretation']})")

    print(f"\n📋 Category Agreement")
    print(f"   {'Category':<20} {'Agreement':>10} {'Kappa':>10} {'Human Ja':>10} {'Agent Ja':>10}")
    print("   " + "-" * 60)

    for cat, metrics in category_metrics.items():
        if metrics['agreement'] is not None:
            print(f"   {cat:<20} {metrics['agreement']:>10.1%} {metrics['kappa']:>10.3f} {metrics['human_yes_rate']:>10.1%} {metrics['agent_yes_rate']:>10.1%}")

    print(f"\n📈 Summary")
    print(f"   Mean Category Agreement: {results['summary']['mean_category_agreement']:.1%}")
    print(f"   Best Agreement: {results['summary']['best_agreement_category']}")
    print(f"   Worst Agreement: {results['summary']['worst_agreement_category']}")

    if results['decision']['confusion_matrix']:
        print(f"\n🔢 Confusion Matrix (Decision)")
        cm = results['decision']['confusion_matrix']
        print(f"   Human\\Agent    Include  Exclude  Unclear")
        print(f"   Include      {cm.get('Include_Include', 0):>7}  {cm.get('Include_Exclude', 0):>7}  {cm.get('Include_Unclear', 0):>7}")
        print(f"   Exclude      {cm.get('Exclude_Include', 0):>7}  {cm.get('Exclude_Exclude', 0):>7}  {cm.get('Exclude_Unclear', 0):>7}")
        print(f"   Unclear      {cm.get('Unclear_Include', 0):>7}  {cm.get('Unclear_Exclude', 0):>7}  {cm.get('Unclear_Unclear', 0):>7}")

    print(f"\n💾 Output: {args.output}")


if __name__ == '__main__':
    main()
