# AI-Generated Summaries

This directory contains AI-generated summaries for papers in the SozArb research corpus.

## Overview

- **Total summaries:** 73
- **Model used:** Claude Haiku 4.5
- **Generated:** 2025-11-07 to 2025-11-10
- **Source directories:**
  - `analysis/summaries_sozarb/` (58 summaries)
  - `analysis/summaries_final/` (16 summaries)

## Summary Structure

Each summary includes:

```yaml
title: Paper identifier
original_document: Source markdown filename
document_type: Type (Empirical Study, Policy Document, etc.)
research_domain: Domain (AI Ethics, AI Bias & Fairness, etc.)
methodology: Research approach
keywords: Key concepts (comma-separated)
mini_abstract: One-sentence summary
target_audience: Intended audience
key_contributions: Main contributions
geographic_focus: Geographic scope
publication_year: Year
related_fields: Related disciplines
summary_date: When summary was generated
language: Source language
ai_model: Model used (claude-haiku-4-5)
```

## Content Sections

1. **Overview** - Comprehensive context and research positioning
2. **Main Findings** - Key results and discoveries
3. **Methodology/Approach** - Research methods employed
4. **Relevant Concepts** - Key terms and definitions
5. **Significance** - Impact and contribution to field

## Usage in Obsidian

Papers link to summaries using Obsidian's transclusion syntax:

```markdown
## AI Summary
![[summary_PaperName.md]]
```

## Integration Status

- Papers with `has_summary: true` in YAML frontmatter: 59
- Available summaries: 73
- **Action needed:** 14 papers have summaries but aren't yet linked

## Maintenance

To update summary links in papers, run:

```bash
python analysis/sync_summary_metadata.py
```

---

*Part of the SozArb Research Vault*
*Generated: 2025-11-10*
