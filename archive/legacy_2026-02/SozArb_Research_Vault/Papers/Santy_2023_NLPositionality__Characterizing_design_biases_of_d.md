---
title: "NLPositionality: Characterizing design biases of datasets and models"
zotero_key: 9HXBT8YG
author_year: "Santy (2023)"
authors: []

# Publication
publication_year: 2023.0
item_type: conferencePaper
language: nan
doi: "nan"
url: "https://aclanthology.org/2023.acl-long.530/"

# Assessment
decision: Include
exclusion_reason: "nan"

# Relevance Scores (0-3)
rel_ai_komp: 1
rel_vulnerable: 2
rel_bias: 3
rel_praxis: 2
rel_prof: 1
total_relevance: 9

# Categorization
relevance_category: medium
top_dimensions: ["Bias Analysis", "Vulnerable Groups"]

# Tags
tags: ["paper", "include", "medium-relevance", "dim-vulnerable-medium", "dim-bias-high", "dim-praxis-medium"]

# Summary
has_summary: true
summary_file: "summary_Santy_2023_NLPositionality.md"

# Metadata
date_added: 2025-11-10
source_tool: Manual
---

# NLPositionality: Characterizing design biases of datasets and models

## Quick Info

| Attribute | Value |
|-----------|-------|
| **Authors** | Unknown |
| **Year** | 2023.0 |
| **Decision** | **Include** |
| **Total Relevance** | **9/15** (medium) |
| **Top Dimensions** | Bias Analysis, Vulnerable Groups |


## Relevance Profile

| Dimension | Score | Assessment |
|-----------|-------|------------|
| AI Literacy & Competencies | 1/3 | ⭐ Low |
| Vulnerable Groups & Digital Equity | 2/3 | ⭐⭐ Medium |
| Bias & Discrimination Analysis | 3/3 | ⭐⭐⭐ High |
| Practical Implementation | 2/3 | ⭐⭐ Medium |
| Professional/Social Work Context | 1/3 | ⭐ Low |


## Abstract

This study provides a theoretical and methodological framework for making bias visible in AI models and datasets. It introduces the concept of "positionality" - the assumption that developers' social, cultural, and political perspectives inevitably flow into AI artifacts. The authors develop a method to quantify design biases by analyzing which dialects, demographic groups, or social contexts are under- or over-represented in datasets.


## AI Summary

## Overview

This paper addresses a critical challenge in computational political science: predicting political ideology from text when training data is sparse and systematically biased toward extreme positions. Authored by Chen Chen (CUHK Shenzhen), Dylan Walker (Chapman University), and Venkatesh Saligrama (Boston University), the research tackles selection bias in ideology prediction—a problem where self-reported labels are sparse and skewed toward extreme vocal posters, while moderate populations remain underrepresented. The core innovation decomposes document embeddings into two independent latent vectors: a neutral context vector (ideology-independent) and a position vector (ideology-aligned). This decomposition enables accurate predictions with minimal training data and strong generalization to out-of-distribution examples, particularly moderate positions absent from training sets. The approach is motivated by documented policy failures (e.g., Kansas abortion vote) where overestimation of public support resulted from overlooking silent majorities.

## Main Findings

The proposed model demonstrates substantial empirical success across multiple dimensions. First, it achieves superior performance compared to state-of-the-art baselines while training on only 5% of available biased data, demonstrating remarkable data efficiency. Second, evaluation on two benchmark datasets shows consistent outperformance of existing methods. Third, crowdsourced validation confirms that contextual vectors genuinely capture neutral content independent of ideology, validating the core theoretical decomposition assumption. Fourth, the context-filtering approach—removing neutral vectors during inference and retaining only position vectors—successfully enables predictions on out-of-distribution examples, particularly moderate positions systematically underrepresented in training data. These results collectively demonstrate that explicit decomposition effectively mitigates selection bias and enables ideology prediction extending beyond extreme vocal groups to broader population segments, including silent majorities crucial for policy analysis.

## Methodology/Approach

The technical framework combines statistical decomposition with deep learning in a modified variational autoencoder (VAE) architecture employing bi-modal priors. The model decomposes document embeddings into linear superposition: embedding = context vector + position vector. Context vectors capture ideology-neutral topical content; position vectors encode ideology-specific framing. End-to-end training produces intermediate outputs for both components. Crucially, at deployment time, predictions use exclusively position vectors, operationalizing the paper's central insight: ideology prediction should focus on "how" arguments are framed rather than "what" topics are discussed. This contextual filtering enables robust generalization. Validation combines benchmark dataset evaluation with crowdsourcing experiments verifying contextual vector neutrality and demonstrating ideological concentration after context removal.

## Relevant Concepts

**Selection Bias:** Systematic distortion where certain groups (extreme ideological positions) are overrepresented in training data while others (moderates) are underrepresented, causing models to misrepresent population distributions and fail on underrepresented groups.

**Position Vector:** Latent representation capturing ideology-specific information—how arguments are framed and positioned along the ideological spectrum, independent of topical content.

**Context Vector:** Latent representation capturing ideology-neutral topical and semantic content—the "what" of documents, independent of ideological stance.

**Bi-modal Priors:** Probabilistic framework in the VAE architecture using two distinct prior distributions to separately model context and position components during training.

**Out-of-Distribution Generalization:** Model's ability to accurately predict ideology on examples substantially different from training data, particularly for underrepresented moderate positions.

**Contextual Filtering:** Removing neutral context vectors during inference to isolate ideology-specific position signals, enabling robust predictions independent of topic variation.

## Significance

This work makes three interconnected contributions. Methodologically, it advances machine learning by explicitly modeling and mitigating selection bias rather than ignoring it—a novel approach to learning from imperfect real-world data. For NLP, it contributes techniques for text classification under biased supervision with minimal labeled data (5% threshold). For political science and policy analysis, it provides practical tools for understanding genuine public opinion beyond vocal minorities, directly addressing documented failures in policy prediction. The research reflects contemporary challenges in computational social science where data scarcity and bias are endemic. By enabling accurate ideology prediction from minimal biased data while generalizing to underrepresented populations, this approach has immediate applications for legislative analysis, public opinion research, media studies, and social science research broadly. The emphasis on decomposing content from ideology advances theoretical understanding of how to learn robust representations from imperfect data, with implications extending beyond political ideology to other domains involving biased, sparse supervision.


## Links & Resources

- **DOI:** [nan](https://doi.org/nan)
- **URL:** https://aclanthology.org/2023.acl-long.530/
- **Zotero:** [Open in Zotero](zotero://select/items/9HXBT8YG)

## Related Concepts

- [[Concepts/Selection_Bias|Selection Bias]]
- [[Concepts/Position_Vector|Position Vector]]
- [[Concepts/Context_Vector|Context Vector]]
- [[Concepts/Bi_modal_Priors|Bi-modal Priors]]
- [[Concepts/Out_of_Distribution_Generalization|Out-of-Distribution Generalization]]
- [[Concepts/Contextual_Filtering|Contextual Filtering]]

## Related Papers

*Use Obsidian graph view to explore papers with similar relevance profiles*

## Notes

*Add your research notes here*

