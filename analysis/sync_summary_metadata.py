#!/usr/bin/env python3
"""
Sync summary metadata between available summaries and paper YAML frontmatter.

This script:
1. Finds all summaries in SozArb_Research_Vault/Summaries/
2. Matches them to papers using fuzzy matching
3. Updates paper YAML frontmatter with correct summary_file and has_summary fields
"""

import os
import glob
import re
import difflib
from pathlib import Path

def find_papers_and_summaries():
    """Find all papers and summaries."""
    # Get all summaries
    summaries = {}
    summary_dir = Path('SozArb_Research_Vault/Summaries')
    for f in summary_dir.glob('summary_*.md'):
        basename = f.name
        # Extract paper identifier from summary filename
        paper_id = basename.replace('summary_', '').replace('.md', '')
        summaries[paper_id] = basename

    # Get all papers
    papers = {}
    paper_dir = Path('SozArb_Research_Vault/Papers')
    for f in paper_dir.glob('*.md'):
        basename = f.stem  # filename without .md
        papers[basename] = f

    return summaries, papers

def match_summary_to_paper(summary_id, papers, cutoff=0.5):
    """Match a summary ID to a paper using fuzzy matching."""
    # Try exact match first
    if summary_id in papers:
        return summary_id

    # Try fuzzy match
    matches = difflib.get_close_matches(summary_id, papers.keys(), n=1, cutoff=cutoff)
    if matches:
        return matches[0]

    return None

def update_paper_yaml(paper_path, summary_filename):
    """Update paper YAML frontmatter with summary information."""
    with open(paper_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check current state
    has_summary_match = re.search(r'has_summary:\s*(true|false)', content)
    summary_file_match = re.search(r'summary_file:\s*"([^"]*)"', content)

    current_has_summary = has_summary_match.group(1) if has_summary_match else None
    current_summary_file = summary_file_match.group(1) if summary_file_match else None

    # Check if already correct
    if current_has_summary == 'true' and current_summary_file == summary_filename:
        return False, "already correct"

    # Update has_summary
    if has_summary_match:
        content = content.replace(
            f'has_summary: {has_summary_match.group(1)}',
            'has_summary: true'
        )
    else:
        # Add has_summary field after # Summary header
        content = re.sub(
            r'(# Summary\n)',
            r'\1has_summary: true\n',
            content
        )

    # Update summary_file
    if summary_file_match:
        content = content.replace(
            f'summary_file: "{summary_file_match.group(1)}"',
            f'summary_file: "{summary_filename}"'
        )
    else:
        # Add summary_file field after has_summary
        content = re.sub(
            r'(has_summary: true\n)',
            rf'\1summary_file: "{summary_filename}"\n',
            content
        )

    # Write back
    with open(paper_path, 'w', encoding='utf-8') as f:
        f.write(content)

    return True, f"updated: {current_summary_file} → {summary_filename}"

def main():
    """Main synchronization process."""
    summaries, papers = find_papers_and_summaries()

    print(f"Found {len(summaries)} summaries")
    print(f"Found {len(papers)} papers")
    print()

    matched = 0
    updated = 0
    already_correct = 0
    unmatched = []

    for summary_id, summary_filename in summaries.items():
        # Match to paper
        paper_id = match_summary_to_paper(summary_id, papers)

        if paper_id:
            paper_path = papers[paper_id]
            changed, reason = update_paper_yaml(paper_path, summary_filename)

            if changed:
                print(f"✓ Updated: {paper_path.name}")
                print(f"  → {reason}")
                updated += 1
            else:
                already_correct += 1

            matched += 1
        else:
            unmatched.append(summary_filename)

    print()
    print("=" * 60)
    print(f"Matched summaries: {matched}/{len(summaries)}")
    print(f"Papers updated: {updated}")
    print(f"Papers already correct: {already_correct}")
    print(f"Unmatched summaries: {len(unmatched)}")

    if unmatched:
        print("\nUnmatched summaries:")
        for s in unmatched[:10]:
            print(f"  - {s}")
        if len(unmatched) > 10:
            print(f"  ... and {len(unmatched) - 10} more")

if __name__ == '__main__':
    main()
