#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Simulate PRISMA tags for testing the filtered pipeline
This script adds PRISMA_Include/Exclude tags to test papers
"""

import json
import random
import sys
from pathlib import Path

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def simulate_prisma_assessment(input_file, output_file, include_count=10):
    """
    Simulate PRISMA assessment by adding tags to papers

    Args:
        input_file: Path to zotero_vereinfacht.json
        output_file: Path to output JSON with simulated tags
        include_count: Number of papers to tag as PRISMA_Include (default: 10)
    """
    print(f"📚 Loading papers from: {input_file}")
    with open(input_file, 'r', encoding='utf-8') as f:
        papers = json.load(f)

    total = len(papers)
    print(f"   Total papers: {total}")

    # Randomly select papers for inclusion
    # In reality, this would be done by human expert in Zotero
    include_indices = random.sample(range(total), min(include_count, total))

    included_papers = []
    excluded_papers = []

    for idx, paper in enumerate(papers):
        # Ensure tags field exists
        if 'tags' not in paper:
            paper['tags'] = []

        # Add PRISMA tag
        if idx in include_indices:
            # Include this paper
            paper['tags'].append({'tag': 'PRISMA_Include'})
            # Optionally add quality tags
            paper['tags'].append({'tag': random.choice(['Relevance_High', 'Relevance_Medium'])})
            paper['tags'].append({'tag': random.choice(['Quality_High', 'Quality_Medium'])})
            included_papers.append(paper)
        else:
            # Exclude this paper (for first 50, rest untagged)
            if idx < 50:
                paper['tags'].append({'tag': 'PRISMA_Exclude'})
                excluded_papers.append(paper)

    # Save modified data
    print(f"\n✅ Simulated PRISMA assessment:")
    print(f"   - PRISMA_Include: {len(included_papers)}")
    print(f"   - PRISMA_Exclude: {len(excluded_papers)}")
    print(f"   - Untagged: {total - len(included_papers) - len(excluded_papers)}")

    print(f"\n📝 Included papers:")
    for i, paper in enumerate(included_papers[:5], 1):
        title = paper.get('title', 'No title')
        print(f"   {i}. {title[:70]}...")
    if len(included_papers) > 5:
        print(f"   ... and {len(included_papers) - 5} more")

    # Save to output file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(papers, f, indent=2, ensure_ascii=False)

    print(f"\n💾 Saved to: {output_file}")
    return included_papers, excluded_papers

if __name__ == '__main__':
    # Paths
    input_file = Path('analysis/zotero_vereinfacht.json')
    output_file = Path('analysis/zotero_test_with_tags.json')

    # Simulate with 10 included papers for testing
    included, excluded = simulate_prisma_assessment(input_file, output_file, include_count=10)

    print("\n" + "="*70)
    print("✅ SIMULATION COMPLETE")
    print("="*70)
    print(f"\nNext step: Test the filtered pipeline with:")
    print(f"  python analysis/getPDF_intelligent.py --test-mode")
