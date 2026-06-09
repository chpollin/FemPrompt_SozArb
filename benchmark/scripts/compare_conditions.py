#!/usr/bin/env python3
"""
4-Way Comparison of Assessment Conditions

Compares agreement metrics across 4 experimental conditions:
- Haiku + Abstract, Haiku + KD, Sonnet + Abstract, Sonnet + KD

Usage:
    python compare_conditions.py --output ../results/comparison_4way.json
"""

import argparse
import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

RESULTS_DIR = Path(__file__).parent.parent / 'results'

CONDITIONS = {
    'Haiku + Abstract': 'agreement_haiku.json',
    'Haiku + KD':       'agreement_haiku_kd.json',
    'Sonnet + Abstract': 'agreement_sonnet.json',
    'Sonnet + KD':      'agreement_sonnet_kd.json',
}

CATEGORIES = [
    'AI_Literacies', 'Generative_KI', 'Prompting', 'KI_Sonstige',
    'Soziale_Arbeit', 'Bias_Ungleichheit', 'Gender', 'Diversitaet',
    'Feministisch', 'Fairness'
]


def load_results(results_dir: Path) -> dict:
    """Load all available agreement JSON files."""
    loaded = {}
    for name, filename in CONDITIONS.items():
        path = results_dir / filename
        if path.exists():
            with open(path, 'r', encoding='utf-8') as f:
                loaded[name] = json.load(f)
        else:
            print(f"  Warnung: {filename} nicht gefunden, ueberspringe {name}")
    return loaded


def build_comparison(results: dict) -> dict:
    """Build structured comparison across conditions."""
    comparison = {
        'conditions': {},
        'deltas': {},
    }

    for name, data in results.items():
        decision = data.get('decision', {})
        categories = data.get('categories', {})

        # Include rate from confusion matrix
        cm = decision.get('confusion_matrix', {})
        total_include = cm.get('Include_Include', 0) + cm.get('Exclude_Include', 0)
        total_papers = decision.get('n', 1)
        include_rate = total_include / total_papers if total_papers > 0 else 0

        condition_data = {
            'decision_kappa': decision.get('cohens_kappa', None),
            'decision_agreement': decision.get('overall_agreement', None),
            'include_rate': round(include_rate * 100, 1),
            'n': total_papers,
            'categories': {},
        }

        kappas = []
        for cat in CATEGORIES:
            cat_data = categories.get(cat, {})
            kappa = cat_data.get('kappa', None)
            condition_data['categories'][cat] = {
                'kappa': kappa,
                'agreement': cat_data.get('agreement', None),
                'human_yes_rate': cat_data.get('human_yes_rate', None),
                'agent_yes_rate': cat_data.get('agent_yes_rate', None),
            }
            if kappa is not None:
                kappas.append(kappa)

        condition_data['mean_category_kappa'] = round(sum(kappas) / len(kappas), 4) if kappas else None
        comparison['conditions'][name] = condition_data

    # Calculate deltas (KD vs Abstract within same model)
    for model in ['Haiku', 'Sonnet']:
        abstract_key = f'{model} + Abstract'
        kd_key = f'{model} + KD'
        if abstract_key in comparison['conditions'] and kd_key in comparison['conditions']:
            abstract = comparison['conditions'][abstract_key]
            kd = comparison['conditions'][kd_key]
            delta = {
                'decision_kappa': round(kd['decision_kappa'] - abstract['decision_kappa'], 4) if kd['decision_kappa'] is not None and abstract['decision_kappa'] is not None else None,
                'include_rate': round(kd['include_rate'] - abstract['include_rate'], 1),
                'mean_category_kappa': round(kd['mean_category_kappa'] - abstract['mean_category_kappa'], 4) if kd['mean_category_kappa'] is not None and abstract['mean_category_kappa'] is not None else None,
                'categories': {},
            }
            for cat in CATEGORIES:
                abs_k = abstract['categories'].get(cat, {}).get('kappa')
                kd_k = kd['categories'].get(cat, {}).get('kappa')
                delta['categories'][cat] = round(kd_k - abs_k, 4) if kd_k is not None and abs_k is not None else None
            comparison['deltas'][f'{model}: KD vs Abstract'] = delta

    return comparison


def print_comparison_table(comparison: dict):
    """Print formatted comparison table for paper use."""
    conditions = comparison['conditions']

    # Decision-level table
    print("\n" + "=" * 90)
    print("DECISION-LEVEL COMPARISON")
    print("=" * 90)
    header = f"{'Condition':<22} {'n':>5} {'Incl%':>7} {'Agree%':>8} {'Kappa':>8} {'Mean Cat K':>10}"
    print(header)
    print("-" * 90)

    for name, data in conditions.items():
        print(f"{name:<22} {data['n']:>5} {data['include_rate']:>6.1f}% {data['decision_agreement']*100:>7.1f}% {data['decision_kappa']:>8.4f} {data['mean_category_kappa']:>10.4f}")

    print(f"{'Human'::<22} {'291':>5} {'46.0%':>7} {'--':>8} {'--':>8} {'--':>10}")

    # Category-level table
    print("\n" + "=" * 90)
    print("CATEGORY-LEVEL KAPPA")
    print("=" * 90)
    cond_names = list(conditions.keys())
    header = f"{'Category':<20}" + "".join(f" {n:>16}" for n in cond_names)
    print(header)
    print("-" * 90)

    for cat in CATEGORIES:
        row = f"{cat:<20}"
        for name in cond_names:
            kappa = conditions[name]['categories'].get(cat, {}).get('kappa')
            row += f" {kappa:>16.4f}" if kappa is not None else f" {'--':>16}"
        print(row)

    # Deltas
    if comparison['deltas']:
        print("\n" + "=" * 90)
        print("DELTA: KD vs ABSTRACT (positive = KD better)")
        print("=" * 90)
        for delta_name, delta in comparison['deltas'].items():
            print(f"\n{delta_name}:")
            print(f"  Decision Kappa:      {delta['decision_kappa']:+.4f}" if delta['decision_kappa'] is not None else "  Decision Kappa:      --")
            print(f"  Include Rate:        {delta['include_rate']:+.1f}pp")
            print(f"  Mean Category Kappa: {delta['mean_category_kappa']:+.4f}" if delta['mean_category_kappa'] is not None else "  Mean Category Kappa: --")
            print(f"  Per category:")
            for cat in CATEGORIES:
                d = delta['categories'].get(cat)
                marker = ""
                if d is not None:
                    if d > 0.05:
                        marker = " <<"
                    elif d < -0.05:
                        marker = " !!"
                print(f"    {cat:<20} {d:+.4f}{marker}" if d is not None else f"    {cat:<20} --")


def main():
    parser = argparse.ArgumentParser(description='4-Way Assessment Comparison')
    parser.add_argument('--results-dir', type=str, default=str(RESULTS_DIR),
                        help='Directory with agreement JSON files')
    parser.add_argument('--output', type=str, default=None,
                        help='Output JSON path (default: results_dir/comparison_4way.json)')
    args = parser.parse_args()

    results_dir = Path(args.results_dir)
    output_path = Path(args.output) if args.output else results_dir / 'comparison_4way.json'

    print(f"Loading results from {results_dir}...")
    results = load_results(results_dir)
    print(f"Loaded {len(results)} conditions: {', '.join(results.keys())}")

    if len(results) < 2:
        print("Mindestens 2 Bedingungen noetig fuer Vergleich.")
        sys.exit(1)

    comparison = build_comparison(results)
    print_comparison_table(comparison)

    # Save JSON
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(comparison, f, indent=2, ensure_ascii=False)
    print(f"\nSaved: {output_path}")


if __name__ == '__main__':
    main()
