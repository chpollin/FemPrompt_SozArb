#!/usr/bin/env python3
"""
Create Bidirectional Concept Links in Vault Papers
Extracts concepts from "Relevant Concepts" section and creates wiki links
"""

import sys
import re
from pathlib import Path
from typing import List, Dict, Set

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')


def extract_concepts_from_summary(content: str) -> List[str]:
    """Extract concept names from the Relevant Concepts section"""
    # Find the Relevant Concepts section
    concepts_match = re.search(
        r'## Relevant Concepts\s*\n(.*?)(?=\n##|\Z)',
        content,
        re.DOTALL
    )

    if not concepts_match:
        return []

    concepts_text = concepts_match.group(1)

    # Extract concept names (bold text at start of lines)
    concept_names = re.findall(r'\*\*([^*]+?):\*\*', concepts_text)

    return [name.strip() for name in concept_names]


def create_concept_slug(concept_name: str) -> str:
    """Convert concept name to filename format"""
    # Replace spaces and special chars with underscores
    slug = re.sub(r'[^\w\s-]', '', concept_name)
    slug = re.sub(r'[-\s]+', '_', slug)
    return slug


def add_related_concepts_section(paper_path: Path, concepts: List[str]) -> bool:
    """Add Related Concepts section with wiki links to paper"""
    if not concepts:
        return False

    content = paper_path.read_text(encoding='utf-8')

    # Check if Related Concepts section already exists with content
    if re.search(r'## Related Concepts\s*\n\s*-\s*\[\[', content):
        return False  # Already has concept links

    # Create wiki links for concepts
    concept_links = '\n'.join([f'- [[Concepts/{create_concept_slug(c)}|{c}]]' for c in concepts])

    # Pattern: Replace empty "Related Papers" section
    pattern = r'(## Related Papers\s*\n\s*\*Use Obsidian.*?\*)'

    replacement = f'''## Related Concepts

{concept_links}

\\1'''

    new_content = re.sub(pattern, replacement, content, count=1)

    if new_content != content:
        paper_path.write_text(new_content, encoding='utf-8')
        return True

    return False


def update_concept_files(vault_dir: Path, paper_concepts: Dict[str, List[str]]):
    """Update or create concept files with backlinks to papers"""
    concepts_dir = vault_dir / 'Concepts'
    concepts_dir.mkdir(exist_ok=True)

    # Build reverse index: concept -> papers
    concept_to_papers: Dict[str, Set[str]] = {}

    for paper_name, concepts in paper_concepts.items():
        for concept in concepts:
            slug = create_concept_slug(concept)
            if slug not in concept_to_papers:
                concept_to_papers[slug] = set()
            concept_to_papers[slug].add(paper_name)

    print(f"\n=== Creating/Updating {len(concept_to_papers)} Concept Files ===\n")

    for concept_slug, papers in concept_to_papers.items():
        concept_file = concepts_dir / f'{concept_slug}.md'

        # Find original concept name (use first occurrence)
        original_name = concept_slug.replace('_', ' ')
        for paper_name, concepts in paper_concepts.items():
            for c in concepts:
                if create_concept_slug(c) == concept_slug:
                    original_name = c
                    break

        # Create or update concept file
        content = f'''---
title: "{original_name}"
type: concept
related_papers: {len(papers)}
tags: [concept, auto-generated]
---

# {original_name}

**Related papers:** {len(papers)}

## Definition

*[This section can be manually expanded]*

## Related Papers

{chr(10).join([f'- [[Papers/{p}|{p[:60]}...]]' for p in sorted(papers)])}

## Usage in Research

This concept appears in {len(papers)} paper summaries, indicating its relevance to the SozArb research domain.

---

*Auto-generated from summary keywords*
*Last updated: 2025-11-16*
'''

        concept_file.write_text(content, encoding='utf-8')
        print(f"✅ {concept_slug} ({len(papers)} papers)")


def main():
    vault_dir = Path('SozArb_Research_Vault')
    papers_dir = vault_dir / 'Papers'

    papers_with_summaries = []
    paper_concepts: Dict[str, List[str]] = {}

    print("=== Scanning Papers for Concepts ===\n")

    for paper_file in papers_dir.glob('*.md'):
        content = paper_file.read_text(encoding='utf-8')

        # Only process papers with embedded summaries
        if '## Relevant Concepts' not in content:
            continue

        concepts = extract_concepts_from_summary(content)

        if concepts:
            papers_with_summaries.append(paper_file)
            paper_concepts[paper_file.stem] = concepts

            # Add Related Concepts section to paper
            if add_related_concepts_section(paper_file, concepts):
                print(f"✅ {paper_file.name[:60]}... ({len(concepts)} concepts)")

    print(f"\n=== Summary ===")
    print(f"Papers with concepts: {len(papers_with_summaries)}")
    print(f"Total unique concepts: {len(set(c for concepts in paper_concepts.values() for c in concepts))}")

    # Update concept files
    if paper_concepts:
        update_concept_files(vault_dir, paper_concepts)

    print(f"\n✅ Bidirectional linking complete!")


if __name__ == '__main__':
    main()
