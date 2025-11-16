---
title: "MirrorStories: Reflecting Diversity through Personalized Narrative Generation with Large Language Models"
zotero_key: JEMUIGSX
author_year: "Yunusov (2024)"
authors: []

# Publication
publication_year: 2024.0
item_type: report
language: nan
doi: "nan"
url: "https://arxiv.org/html/2409.13935v1"

# Assessment
decision: Include
exclusion_reason: "nan"

# Relevance Scores (0-3)
rel_ai_komp: 1
rel_vulnerable: 2
rel_bias: 3
rel_praxis: 1
rel_prof: 1
total_relevance: 8

# Categorization
relevance_category: medium
top_dimensions: ["Bias Analysis", "Vulnerable Groups"]

# Tags
tags: ["paper", "include", "medium-relevance", "dim-vulnerable-medium", "dim-bias-high", "has-summary"]

# Summary
has_summary: true
summary_file: "summary_Yunusov_2024_MirrorStories.md"

# Metadata
date_added: 2025-11-10
source_tool: Manual
---

# MirrorStories: Reflecting Diversity through Personalized Narrative Generation with Large Language Models

## Quick Info

| Attribute | Value |
|-----------|-------|
| **Authors** | Unknown |
| **Year** | 2024.0 |
| **Decision** | **Include** |
| **Total Relevance** | **8/15** (medium) |
| **Top Dimensions** | Bias Analysis, Vulnerable Groups |


## Relevance Profile

| Dimension | Score | Assessment |
|-----------|-------|------------|
| AI Literacy & Competencies | 1/3 | ⭐ Low |
| Vulnerable Groups & Digital Equity | 2/3 | ⭐⭐ Medium |
| Bias & Discrimination Analysis | 3/3 | ⭐⭐⭐ High |
| Practical Implementation | 1/3 | ⭐ Low |
| Professional/Social Work Context | 1/3 | ⭐ Low |


## Abstract

This empirical study introduces a corpus of 1,500 personalized short stories generated with LLMs, incorporating identity features like gender, ethnicity, and age. Human judges rated these stories higher in engagement, diversity, and personalness. Narrative personalization increased textual diversity without harming moral comprehension. However, biases persist, such as preferential engagement for certain identities. The paper illustrates both potential and limitations of diversity-sensitive prompting.


## AI Summary

## Overview

This seminal paper presents critical improvements to the Skip-gram model, a neural network architecture for learning distributed word representations from large-scale unstructured text. The authors address two fundamental challenges: optimizing computational efficiency and representation quality of the Skip-gram model, and extending it to capture multi-word expressions that resist compositional interpretation. The work bridges theoretical advances in distributed semantics with practical engineering solutions, enabling scalable training on massive corpora (100+ billion words daily). By tackling both algorithmic efficiency and linguistic expressiveness, the paper establishes foundational techniques that became central to modern NLP systems.

## Main Findings

The research demonstrates three major technical achievements. First, subsampling frequent words during training—removing words with probability 1 - √(t/f) where t is a threshold and f is word frequency—produces 2-10x speedup while improving representation quality for less-frequent words by reducing noise from high-frequency terms that carry minimal semantic information. Second, negative sampling, a simplified variant of Noise Contrastive Estimation (NCE), replaces hierarchical softmax by sampling k negative examples rather than computing full probability distributions, delivering faster training and superior vector representations for frequent words. Third, the authors demonstrate that learning high-quality representations for millions of phrases is computationally feasible through data-driven phrase identification, addressing a critical limitation where compositional approaches fail for idiomatic expressions like "Boston Globe" (a newspaper, not a composition of "Boston" and "Globe").

## Methodology/Approach

The paper employs an empirical optimization framework combining three technical innovations. **Subsampling** probabilistically discards frequent words based on occurrence probability, reducing training data while preserving linguistic information and improving signal-to-noise ratio. **Negative sampling** replaces expensive hierarchical softmax with a contrastive objective: for each training pair, the model distinguishes the true context word from k randomly sampled negative examples, reducing computational complexity from O(V) to O(k) where V is vocabulary size. **Phrase detection** uses scoring mechanisms (unspecified in excerpt but data-driven) to identify multi-word expressions in raw text, enabling phrase-level embedding learning. The evaluation methodology emphasizes practical metrics: training speed improvements (2-10x) and representation quality comparisons. The theoretical foundation assumes linguistic patterns manifest as linear transformations in vector space, validated through analogical reasoning (vec('Madrid') - vec('Spain') + vec('France') ≈ vec('Paris')).

## Relevant Concepts

**Distributed representations:** Vector-based word encodings capturing semantic and syntactic properties through learned numerical patterns in continuous vector space.

**Skip-gram model:** Neural architecture predicting context words from target words within fixed windows, enabling efficient unsupervised learning from raw text without labeled data.

**Negative sampling:** Contrastive learning technique distinguishing true word-context pairs from randomly sampled negative examples, reducing computational complexity from full softmax normalization to k negative samples.

**Noise Contrastive Estimation (NCE):** Statistical framework treating classification as distinguishing true data from noise; negative sampling is a simplified NCE variant.

**Compositionality failure:** Principle that certain phrase meanings cannot be derived from component word meanings; idiomatic expressions require dedicated phrase-level representations.

**Hierarchical softmax:** Prior normalization technique using binary tree structures for efficient probability computation; replaced by negative sampling for superior performance.

**Subsampling probability:** Formula 1 - √(t/f) removes frequent words probabilistically, where t is threshold parameter and f is word frequency, balancing training efficiency with information preservation.

## Significance

This work fundamentally transformed NLP by democratizing access to high-quality word embeddings through computational optimization. The subsampling technique and negative sampling became standard training procedures for embedding models, enabling practitioners to train on previously intractable datasets. The explicit treatment of phrase representations established that multi-word expressions require dedicated handling rather than compositional approaches, creating a research agenda for phrase embeddings. Historically, this paper (published 2013) catalyzed the embedding revolution, making distributed representations practical for industry applications. The techniques introduced—particularly negative sampling—became foundational to subsequent advances in representation learning, influencing architectures from fastText to modern transformer-based models. By balancing theoretical insight with engineering pragmatism, the paper exemplifies how algorithmic innovation enables scientific progress in machine learning and established Word2Vec as the dominant embedding approach for nearly a decade.


## Links & Resources

- **DOI:** [nan](https://doi.org/nan)
- **URL:** https://arxiv.org/html/2409.13935v1
- **Zotero:** [Open in Zotero](zotero://select/items/JEMUIGSX)

## Related Concepts

- [[Concepts/Distributed_representations|Distributed representations]]
- [[Concepts/Skip_gram_model|Skip-gram model]]
- [[Concepts/Negative_sampling|Negative sampling]]
- [[Concepts/Noise_Contrastive_Estimation_NCE|Noise Contrastive Estimation (NCE)]]
- [[Concepts/Compositionality_failure|Compositionality failure]]
- [[Concepts/Hierarchical_softmax|Hierarchical softmax]]
- [[Concepts/Subsampling_probability|Subsampling probability]]

## Related Papers

*Use Obsidian graph view to explore papers with similar relevance profiles*

## Notes

*Add your research notes here*

