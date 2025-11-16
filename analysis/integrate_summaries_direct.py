#!/usr/bin/env python3
"""
Integrate AI Summaries directly into Vault Papers
Replaces transclusion with direct content embedding
"""

import sys
import re
from pathlib import Path
from typing import Optional

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

def extract_summary_content(summary_path: Path) -> Optional[str]:
    """Extract the summary content from a summary file"""
    content = summary_path.read_text(encoding='utf-8')

    # Remove YAML frontmatter
    parts = content.split('---', 2)
    if len(parts) > 2:
        content = parts[2].strip()

    # Remove the title line (e.g., "# Summary: Klein 2024 Data")
    lines = content.split('\n')
    if lines and lines[0].startswith('# Summary:'):
        content = '\n'.join(lines[1:]).strip()

    return content if content else None


def integrate_summary_into_paper(paper_path: Path, summary_content: str) -> bool:
    """Replace transclusion or placeholder with direct summary content"""
    content = paper_path.read_text(encoding='utf-8')

    # Pattern 1: Replace transclusion
    transclusion_pattern = r'## AI Summary\s*\n\s*!\[\[summary_.*?\.md\]\]'
    if re.search(transclusion_pattern, content):
        new_content = re.sub(
            transclusion_pattern,
            f'## AI Summary\n\n{summary_content}',
            content
        )
        paper_path.write_text(new_content, encoding='utf-8')
        return True

    # Pattern 2: Replace "No AI summary available" message
    no_summary_pattern = r'## AI Summary\s*\n\s*\*No AI summary available.*?\*'
    if re.search(no_summary_pattern, content, re.DOTALL):
        new_content = re.sub(
            no_summary_pattern,
            f'## AI Summary\n\n{summary_content}',
            content,
            flags=re.DOTALL
        )
        paper_path.write_text(new_content, encoding='utf-8')
        return True

    return False


def main():
    summaries_dir = Path('SozArb_Research_Vault/Summaries')
    papers_dir = Path('SozArb_Research_Vault/Papers')

    # Get all summary files
    summary_files = list(summaries_dir.glob('summary_*.md'))

    stats = {
        'total_summaries': len(summary_files),
        'papers_updated': 0,
        'papers_not_found': 0,
        'summaries_empty': 0,
        'errors': 0
    }

    print(f"=== Integrating {stats['total_summaries']} Summaries ===\n")

    for summary_file in summary_files:
        # Extract base name (remove "summary_" prefix)
        base_name = summary_file.stem.replace('summary_', '')

        # Extract summary content
        summary_content = extract_summary_content(summary_file)
        if not summary_content:
            stats['summaries_empty'] += 1
            print(f"⚠️  Empty: {summary_file.name}")
            continue

        # Find matching paper(s)
        matching_papers = list(papers_dir.glob(f'{base_name}*.md'))

        if not matching_papers:
            stats['papers_not_found'] += 1
            print(f"❌ No paper found for: {summary_file.name}")
            continue

        # Update each matching paper
        for paper in matching_papers:
            try:
                if integrate_summary_into_paper(paper, summary_content):
                    stats['papers_updated'] += 1
                    print(f"✅ {paper.name[:60]}...")
                else:
                    print(f"⏭️  Already integrated: {paper.name[:60]}...")
            except Exception as e:
                stats['errors'] += 1
                print(f"❌ Error with {paper.name}: {e}")

    print(f"\n=== Summary ===")
    print(f"Total summaries: {stats['total_summaries']}")
    print(f"Papers updated: {stats['papers_updated']}")
    print(f"Papers not found: {stats['papers_not_found']}")
    print(f"Empty summaries: {stats['summaries_empty']}")
    print(f"Errors: {stats['errors']}")


if __name__ == '__main__':
    main()
