---
title: "Prompting techniques for reducing social bias in LLMs through System 1 and System 2 cognitive processes"
zotero_key: UDWBF53B
author_year: "Chisca (2024)"
authors: []

# Publication
publication_year: 2024.0
item_type: report
language: nan
doi: "nan"
url: "https://arxiv.org/html/2404.17218v3"

# Assessment
decision: Exclude
exclusion_reason: "No full text"

# Relevance Scores (0-3)
rel_ai_komp: 0
rel_vulnerable: 0
rel_bias: 0
rel_praxis: 0
rel_prof: 0
total_relevance: 0

# Categorization
relevance_category: low
top_dimensions: []

# Tags
tags: ["paper", "exclude", "low-relevance"]

# Summary
has_summary: true
summary_file: "summary_Chisca_2024_Prompting.md"

# Metadata
date_added: 2025-11-10
source_tool: Manual
---

# Prompting techniques for reducing social bias in LLMs through System 1 and System 2 cognitive processes

## Quick Info

| Attribute | Value |
|-----------|-------|
| **Authors** | Unknown |
| **Year** | 2024.0 |
| **Decision** | **Exclude** |
| **Total Relevance** | **0/15** (low) |
| **Top Dimensions** | None |


## Exclusion Reason

No full text


## Relevance Profile

| Dimension | Score | Assessment |
|-----------|-------|------------|
| AI Literacy & Competencies | 0/3 | — None |
| Vulnerable Groups & Digital Equity | 0/3 | — None |
| Bias & Discrimination Analysis | 0/3 | — None |
| Practical Implementation | 0/3 | — None |
| Professional/Social Work Context | 0/3 | — None |


## Abstract

nan


## AI Summary

## Overview

This research addresses a critical challenge in contemporary NLP: mitigating social biases embedded in Large Language Models (LLMs) such as BERT and RoBERTa. The paper proposes an innovative prompt-tuning approach that efficiently reduces gender bias without requiring computationally expensive full model retraining. By training only small, reusable token embeddings that concatenate to input sequences, the authors present a practical solution to bias mitigation that maintains competitive performance while minimizing computational overhead. This work is particularly timely given the widespread deployment of LLMs in high-stakes applications where bias perpetuation poses significant risks to underrepresented groups.

## Main Findings

The research demonstrates three primary contributions: (1) a prompt-tuning method for encoder-only models that trains only small additional token embeddings rather than modifying full model parameters; (2) a novel KL-divergence-based loss function balancing bias reduction against language modeling performance preservation; and (3) an extensible template framework for gender bias that generalizes to other bias categories. Evaluations on SEAT and StereoSet benchmarks confirm competitive performance with state-of-the-art debiasing methods while maintaining minimal degradation of language modeling ability. The approach requires substantially fewer computational resources than existing alternatives, making it viable for resource-constrained environments. The template-based framework demonstrates extensibility beyond gender bias, suggesting applicability to other demographic and social bias categories, though specific performance metrics on alternative bias types remain to be established.

## Methodology/Approach

The methodology targets encoder-only models (BERT, RoBERTa) through prompt-tuning rather than parameter modification. The approach trains learnable token embeddings functioning as reusable prompts, concatenated to input sequences to guide bias reduction. A custom loss function based on Kullback-Leibler (KL) divergence balances competing objectives: reducing bias while preserving language modeling performance. Training utilizes template-based examples (e.g., "<GenderedWord> is a <Target>") systematically exposing gender stereotypes. Evaluation employs two complementary benchmarks: SEAT measures associations between demographic and target attributes in contextual embeddings, while StereoSet quantifies stereotypical word selection frequency. This dual-benchmark approach ensures comprehensive assessment of both bias reduction efficacy and model utility preservation, with results compared against existing state-of-the-art debiasing methods.

## Relevant Concepts

**Representational Harms**: Disparate system performance, exclusion, or stereotyping disadvantaging specific demographic groups in model outputs.

**Allocation Harms**: Discriminatory resource distribution resulting from biased model decisions.

**Encoder-Only Models**: Transformer architectures (BERT, RoBERTa) using bidirectional context without generative capabilities, suitable for classification and embedding tasks.

**SEAT (Sentence Embedding Association Test)**: Embedding-based metric measuring bias by quantifying associations between demographic attribute groups and target attribute groups in contextual embeddings.

**StereoSet**: Probability-based benchmark measuring bias frequency through stereotypical word selection in masked token prediction tasks.

**Prompt-Tuning**: Parameter-efficient fine-tuning approach training only small additional embeddings rather than full model parameters, reducing computational requirements.

**KL-Divergence**: Information-theoretic measure quantifying distribution divergence; here applied to balance bias reduction objectives against language modeling performance preservation.

## Significance

This work addresses a critical gap between theoretical fairness research and practical implementation constraints. By offering a computationally lightweight debiasing method, it democratizes bias mitigation for practitioners with limited computational resources. The research contributes to three interconnected domains: bias mitigation literature, prompt-learning paradigms, and practical fairness deployment. Most significantly, it demonstrates that competitive debiasing performance need not require substantial computational investment, making fairness considerations accessible across diverse organizational contexts. The extensible template framework provides a foundation for addressing multiple bias categories, advancing toward comprehensive fairness solutions in LLM applications. However, generalization to non-gender biases and scalability across diverse model architectures require further investigation.


## Links & Resources

- **DOI:** [nan](https://doi.org/nan)
- **URL:** https://arxiv.org/html/2404.17218v3
- **Zotero:** [Open in Zotero](zotero://select/items/UDWBF53B)

## Related Papers

*Use Obsidian graph view to explore papers with similar relevance profiles*

## Notes

*Add your research notes here*

