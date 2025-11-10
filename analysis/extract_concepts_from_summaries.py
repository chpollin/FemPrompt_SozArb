#!/usr/bin/env python3
"""
Extract concepts from summary keywords and generate concept pages.

This script:
1. Extracts keywords from all summaries
2. Normalizes and counts them
3. Creates concept pages with backlinks to papers
"""

import os
import glob
import re
from collections import defaultdict, Counter
from pathlib import Path

# Synonym mapping for normalization
SYNONYMS = {
    'algorithmic bias': ['Algorithmic Bias', 'AI bias', 'AI Bias'],
    'algorithmic discrimination': ['Algorithmic Discrimination'],
    'algorithmic fairness': ['fairness', 'Fairness', 'AI fairness', 'AI Fairness'],
    'intersectionality': ['Intersectionality', 'intersectional bias'],
    'gender bias': ['Gender Bias', 'gender equity'],
    'generative ai': ['Generative AI', 'GenAI'],
    'large language models': ['LLMs', 'LLM bias'],
    'responsible ai': ['Responsible AI', 'trustworthy AI', 'trust in AI'],
    'bias mitigation': ['Bias Mitigation', 'debiasing'],
    'feminist ai': ['Feminist AI'],
    'ai ethics': ['AI ethics', 'ethical AI'],
    'ai governance': ['AI governance'],
    'visual bias': ['visual bias', 'image generation bias'],
    'prompt engineering': ['prompting', 'prompt design'],
    'social work': ['social work practice', 'professional context'],
    'vulnerable populations': ['vulnerable groups', 'marginalized communities'],
    'welfare systems': ['welfare surveillance', 'automated decision-making'],
}

def normalize_keyword(keyword):
    """Normalize a keyword using synonym mapping."""
    keyword_lower = keyword.strip().lower()

    # Check if it matches any canonical form or synonym
    for canonical, synonyms in SYNONYMS.items():
        if keyword_lower == canonical:
            return canonical
        for syn in synonyms:
            if keyword_lower == syn.lower():
                return canonical

    return keyword_lower

def extract_keywords_from_summaries():
    """Extract and normalize keywords from all summaries."""
    keyword_to_summaries = defaultdict(list)
    summary_to_keywords = {}

    for summary_file in Path('SozArb_Research_Vault/Summaries').glob('summary_*.md'):
        with open(summary_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Extract keywords from YAML
        keywords_match = re.search(r'keywords:\s*(.+)', content)
        if not keywords_match:
            continue

        keywords_str = keywords_match.group(1).strip()
        keywords = [k.strip() for k in keywords_str.split(',')]

        # Normalize keywords
        normalized = [normalize_keyword(k) for k in keywords]
        summary_to_keywords[summary_file.name] = normalized

        for keyword in normalized:
            keyword_to_summaries[keyword].append(summary_file.name)

    return keyword_to_summaries, summary_to_keywords

def find_paper_for_summary(summary_filename):
    """Find the paper that references this summary."""
    import difflib

    # Extract summary ID
    summary_id = summary_filename.replace('summary_', '').replace('.md', '')

    # Get all papers
    papers = {}
    for f in Path('SozArb_Research_Vault/Papers').glob('*.md'):
        papers[f.stem] = f

    # Try exact match
    if summary_id in papers:
        return papers[summary_id].stem

    # Try fuzzy match
    matches = difflib.get_close_matches(summary_id, papers.keys(), n=1, cutoff=0.5)
    if matches:
        return matches[0]

    return None

def create_concept_page(concept, summaries, output_dir):
    """Create a concept page with backlinks to papers."""
    # Find papers for these summaries
    papers = []
    for summary in summaries:
        paper = find_paper_for_summary(summary)
        if paper:
            papers.append(paper)

    if not papers:
        return False

    # Create concept filename
    concept_title = concept.replace(' ', '_').title()
    filename = f"{concept_title}.md"
    filepath = output_dir / filename

    # Generate content
    content = f"""---
title: "{concept.title()}"
type: concept
frequency: {len(summaries)}
related_papers: {len(papers)}
tags: [concept, auto-generated]
---

# {concept.title()}

**Frequency:** {len(summaries)} summaries mention this concept
**Related papers:** {len(papers)}

## Definition

*[This section can be manually expanded]*

## Related Papers

"""

    for paper in sorted(papers):
        content += f"- [[{paper}]]\n"

    content += f"""

## Usage in Research

This concept appears in {len(summaries)} paper summaries, indicating its relevance to the SozArb research domain.

---

*Auto-generated from summary keywords*
*Last updated: 2025-11-10*
"""

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    return True

def main():
    """Main concept extraction process."""
    print("Extracting concepts from summaries...")
    keyword_to_summaries, summary_to_keywords = extract_keywords_from_summaries()

    # Count total keywords
    total_keywords = sum(len(keywords) for keywords in summary_to_keywords.values())
    unique_keywords = len(keyword_to_summaries)

    print(f"Total keywords: {total_keywords}")
    print(f"Unique concepts (after normalization): {unique_keywords}")

    # Filter concepts by frequency (>=2)
    frequent_concepts = {k: v for k, v in keyword_to_summaries.items() if len(v) >= 2}
    print(f"Concepts with ≥2 mentions: {len(frequent_concepts)}")

    # Create concepts directory
    concepts_dir = Path('SozArb_Research_Vault/Concepts')
    concepts_dir.mkdir(exist_ok=True)

    # Create concept pages
    created = 0
    for concept, summaries in sorted(frequent_concepts.items(), key=lambda x: len(x[1]), reverse=True):
        if create_concept_page(concept, summaries, concepts_dir):
            created += 1
            print(f"✓ Created: {concept.title()} ({len(summaries)} papers)")

    print()
    print(f"Created {created} concept pages in {concepts_dir}")

    # Create index
    create_concept_index(concepts_dir, frequent_concepts)

def create_concept_index(concepts_dir, concepts):
    """Create an index page for all concepts."""
    content = """---
title: "Concept Index"
type: index
tags: [concepts, navigation]
---

# Concept Index - SozArb Research

Auto-generated index of key concepts extracted from paper summaries.

## Concepts by Frequency

"""

    for concept, summaries in sorted(concepts.items(), key=lambda x: len(x[1]), reverse=True):
        concept_title = concept.replace(' ', '_').title()
        content += f"- **[[{concept_title}|{concept.title()}]]** ({len(summaries)} papers)\n"

    content += """

---

*Auto-generated from summary keywords*
*To update: run `python analysis/extract_concepts_from_summaries.py`*
"""

    with open(concepts_dir / 'INDEX.md', 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✓ Created concept index")

if __name__ == '__main__':
    main()
