---
title: "Intersectional Stereotypes in Large Language Models: Dataset and Analysis"
zotero_key: 9YEC6SQ7
author_year: "Ma (2023)"
authors: []

# Publication
publication_year: 2023.0
item_type: conferencePaper
language: nan
doi: "10.18653/v1/2023.findings-emnlp.575"
url: "https://aclanthology.org/2023.findings-emnlp.575.pdf"

# Assessment
decision: Include
exclusion_reason: "nan"

# Relevance Scores (0-3)
rel_ai_komp: 1
rel_vulnerable: 3
rel_bias: 3
rel_praxis: 1
rel_prof: 1
total_relevance: 9

# Categorization
relevance_category: medium
top_dimensions: ["Vulnerable Groups", "Bias Analysis"]

# Tags
tags: ["paper", "include", "medium-relevance", "dim-vulnerable-high", "dim-bias-high", "has-summary"]

# Summary
has_summary: true
summary_file: "summary_Ma_2023_Intersectional.md"

# Metadata
date_added: 2025-11-10
source_tool: Manual
---

# Intersectional Stereotypes in Large Language Models: Dataset and Analysis

## Quick Info

| Attribute | Value |
|-----------|-------|
| **Authors** | Unknown |
| **Year** | 2023.0 |
| **Decision** | **Include** |
| **Total Relevance** | **9/15** (medium) |
| **Top Dimensions** | Vulnerable Groups, Bias Analysis |


## Relevance Profile

| Dimension | Score | Assessment |
|-----------|-------|------------|
| AI Literacy & Competencies | 1/3 | ⭐ Low |
| Vulnerable Groups & Digital Equity | 3/3 | ⭐⭐⭐ High |
| Bias & Discrimination Analysis | 3/3 | ⭐⭐⭐ High |
| Practical Implementation | 1/3 | ⭐ Low |
| Professional/Social Work Context | 1/3 | ⭐ Low |


## Abstract

This EMNLP paper introduces a dataset for studying intersectional stereotypes and applies it to three LLMs. Results reveal emergent stereotypes not predictable from single-attribute analysis. Prompt engineering reduces but does not eliminate such patterns, highlighting persistent biases in generated narratives.


## AI Summary

## Overview

This research addresses a critical gap in AI bias scholarship by systematically investigating how Large Language Models propagate stereotypes targeting intersectional demographic groups—individuals defined by multiple overlapping identity categories simultaneously. While extensive prior research has examined single-category biases (racial bias, gender bias) or simplistic two-attribute intersections, this study pioneers comprehensive intersectional analysis. The authors recognize that real-world stereotypes frequently target complex intersectional identities (e.g., elderly Muslim women, disabled Asian conservatives) that cannot be adequately understood through reductionist frameworks. By curating a novel dataset of intersectional stereotypes across 14 demographic features spanning 6 categories and analyzing three contemporary LLMs' responses across 16 stereotype categories, the paper establishes intersectional bias as a critical but underexplored dimension of AI ethics requiring urgent attention.

## Main Findings

The research reveals several critical insights about LLM behavior. ChatGPT demonstrates capacity to generate authentic, human-validated stereotypes for intersectional groups comprising up to four demographic attributes, suggesting sophisticated understanding of complex social stereotypes. However, performance deteriorates significantly when demographic combinations exceed four attributes, resulting in overgeneralization and reduced stereotype authenticity—requiring post-hoc filtering to maintain dataset quality. Crucially, all three LLMs studied produce stereotypical responses across diverse intersectional groups, confirming that stereotype propagation is systematic rather than isolated. The study demonstrates that stereotypes manifest across 16 distinct categories, indicating multifaceted bias. Importantly, the research reveals that context-dependent stereotypes—covert biases embedded in contextual narratives rather than isolated words—are prevalent, extending beyond prior word-level analyses. These findings underscore that existing debiasing efforts targeting single categories remain insufficient.

## Methodology/Approach

The research employs an innovative mixed-methods framework combining computational and human validation. Dataset construction leverages ChatGPT itself to generate intersectional stereotypes across 14 demographic features: race (3 categories: white, black, Asian), age (2: young, old), religion (3: nonreligious, Christian, Muslim), gender (2: men, women), political orientation (2: conservative, progressive), and disability status (2: with, without). This permutational approach enables systematic exploration of diverse group combinations. Critically, the authors implement rigorous dual-validation mechanisms—both ChatGPT-assisted and human validation—with post-hoc filtering to mitigate algorithmic overgeneralization, particularly for 5+ attribute combinations. The empirical testing phase probes three contemporary LLMs using interrogation methodology adapted from prior research, analyzing responses across 16 stereotype categories while identifying patterns, severity, and context-dependency.

## Relevant Concepts

**Intersectionality**: Framework recognizing that individuals possess multiple, interconnected identity dimensions whose combined effects cannot be understood through isolated analysis.

**Stereotype propagation**: Process by which language models reproduce and amplify societal stereotypes through training data and learned patterns.

**Context-dependent stereotypes**: Covert biases embedded within contextual narratives and discourse rather than manifesting as isolated stereotypical words or phrases.

**Reductionism in bias research**: Problematic tendency to examine demographic categories independently, obscuring how biases compound at intersections.

**Dual validation with post-hoc filtering**: Methodological strategy employing both algorithmic and human assessment, followed by iterative refinement to enhance reliability and mitigate overgeneralization.

**Performance degradation threshold**: The empirically-identified limitation where LLM stereotype generation quality declines significantly beyond four intersecting demographic attributes.

## Significance

This work substantially advances AI ethics scholarship by establishing intersectional bias as a priority research area with quantifiable parameters (4-attribute threshold, 16 stereotype categories). The reusable intersectional stereotype dataset provides infrastructure for future investigations. Methodologically, the reflexive approach—using LLMs to study LLMs—demonstrates innovative research design while establishing LLMs' utility for bias research itself. The identification of context-dependent stereotypes extends understanding beyond word-level analysis. Most importantly, the findings demand immediate attention from AI developers and policymakers, establishing that comprehensive debiasing requires intersectional frameworks rather than single-category approaches. This research catalyzes paradigm shift toward sophisticated, nuanced understanding of algorithmic bias with practical implementation constraints.


## Links & Resources

- **DOI:** [10.18653/v1/2023.findings-emnlp.575](https://doi.org/10.18653/v1/2023.findings-emnlp.575)
- **URL:** https://aclanthology.org/2023.findings-emnlp.575.pdf
- **Zotero:** [Open in Zotero](zotero://select/items/9YEC6SQ7)

## Related Papers

*Use Obsidian graph view to explore papers with similar relevance profiles*

## Notes

*Add your research notes here*

