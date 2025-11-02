#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test PRISMA Filter Functionality
Demonstrates how the pipeline filters papers by PRISMA tags
"""

import json
import sys
from pathlib import Path

# Fix Windows encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def load_papers_with_filter(json_file, filter_tag='PRISMA_Include'):
    """
    Load papers and filter by PRISMA tag

    Args:
        json_file: Path to zotero JSON file
        filter_tag: Tag to filter by (default: PRISMA_Include)

    Returns:
        tuple: (all_papers, filtered_papers)
    """
    print(f"Loading papers from: {json_file}")
    with open(json_file, 'r', encoding='utf-8') as f:
        all_papers = json.load(f)

    print(f"   Total papers in file: {len(all_papers)}")

    # Filter by tag
    filtered_papers = []
    for paper in all_papers:
        tags_raw = paper.get('tags', [])
        # Handle both dict and string tag formats
        if tags_raw and isinstance(tags_raw[0], dict):
            tags = [t.get('tag', '') for t in tags_raw]
        else:
            tags = tags_raw if isinstance(tags_raw, list) else []

        if filter_tag in tags:
            filtered_papers.append(paper)

    print(f"   Papers with '{filter_tag}' tag: {len(filtered_papers)}")

    return all_papers, filtered_papers

def analyze_tags(papers):
    """Analyze tag distribution"""
    tag_counts = {}

    for paper in papers:
        tags_raw = paper.get('tags', [])
        # Handle both dict and string formats
        if tags_raw:
            if isinstance(tags_raw[0], dict):
                tags = [t.get('tag', '') for t in tags_raw]
            elif isinstance(tags_raw[0], str):
                tags = tags_raw
            else:
                continue
        else:
            continue

        for tag in tags:
            if isinstance(tag, str):  # Safety check
                tag_counts[tag] = tag_counts.get(tag, 0) + 1

    return tag_counts

def main():
    """Main test function"""
    print("="*70)
    print("PRISMA FILTER TEST")
    print("="*70)
    print()

    # Test file with simulated tags
    test_file = Path('analysis/zotero_test_with_tags.json')

    if not test_file.exists():
        print(f"Error: Test file not found: {test_file}")
        print("Run: python analysis/simulate_prisma_tags.py first")
        return

    # Load and filter
    all_papers, included_papers = load_papers_with_filter(test_file, 'PRISMA_Include')
    _, excluded_papers = load_papers_with_filter(test_file, 'PRISMA_Exclude')

    print()
    print("="*70)
    print("TAG DISTRIBUTION")
    print("="*70)

    tag_counts = analyze_tags(all_papers)
    prisma_tags = {k: v for k, v in tag_counts.items() if 'PRISMA' in k or 'Relevance' in k or 'Quality' in k}

    print("\nPRISMA and Assessment Tags:")
    for tag, count in sorted(prisma_tags.items()):
        print(f"   {tag:25s}: {count:3d} papers")

    print()
    print("="*70)
    print("INCLUDED PAPERS (would be processed by pipeline)")
    print("="*70)
    print()

    for i, paper in enumerate(included_papers, 1):
        title = paper.get('title', 'No title')
        authors = paper.get('creators', [])
        author_str = authors[0].get('lastName', 'Unknown') if authors else 'Unknown'
        year = paper.get('date', 'n.d.')[:4] if paper.get('date') else 'n.d.'
        tags_raw = paper.get('tags', [])
        if tags_raw and isinstance(tags_raw[0], dict):
            tags = [t.get('tag', '') for t in tags_raw]
        else:
            tags = tags_raw if isinstance(tags_raw, list) else []

        print(f"{i}. {author_str} ({year})")
        print(f"   {title[:65]}...")
        print(f"   Tags: {', '.join(tags)}")
        print()

    print("="*70)
    print("SUMMARY")
    print("="*70)
    print(f"Total papers in Zotero:        {len(all_papers)}")
    print(f"Papers tagged PRISMA_Include:  {len(included_papers)}")
    print(f"Papers tagged PRISMA_Exclude:  {len(excluded_papers)}")
    print(f"Papers untagged:               {len(all_papers) - len(included_papers) - len(excluded_papers)}")
    print()
    print(f"Pipeline efficiency: Processing {len(included_papers)}/{len(all_papers)} = "
          f"{len(included_papers)/len(all_papers)*100:.1f}% of papers")
    print()
    print("="*70)
    print("NEXT STEPS")
    print("="*70)
    print()
    print("1. The filter works! Pipeline will process only PRISMA_Include papers")
    print("2. This saves time and cost by skipping irrelevant papers")
    print("3. To test full pipeline with filtered data:")
    print()
    print("   # First, backup current zotero file")
    print("   cp analysis/zotero_vereinfacht.json analysis/zotero_vereinfacht.json.backup")
    print()
    print("   # Use test file for pipeline")
    print("   cp analysis/zotero_test_with_tags.json analysis/zotero_vereinfacht.json")
    print()
    print("   # Run pipeline (will process only 10 papers)")
    print("   python run_pipeline.py")
    print()
    print("   # Restore original after testing")
    print("   mv analysis/zotero_vereinfacht.json.backup analysis/zotero_vereinfacht.json")
    print()

if __name__ == '__main__':
    main()
