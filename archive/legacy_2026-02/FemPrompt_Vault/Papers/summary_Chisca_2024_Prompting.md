---
title: summary_Chisca_2024_Prompting
authors:
  - Unknown Author
year: 2024
type: research-paper
tags:
  - paper
  - feminist-ai
  - bias-research
date_added: 2025-10-31
date_modified: 2025-10-31
bias_types:
  - Stereotypical
  - Stereotyping
mitigation_strategies:
  - Fine-tuning
  - Bias Mitigation
  - Debiasing
---

# summary_Chisca_2024_Prompting

## Key Concepts

### Bias Types
- [[Stereotypical]]
- [[Stereotyping]]

### Mitigation Strategies
- [[Bias Mitigation]]
- [[Debiasing]]
- [[Fine-tuning]]

## Full Text

---
title: "Chisca 2024 Prompting"
original_document: Chisca_2024_Prompting.md
document_type: Conference Paper
research_domain: AI Bias & Fairness
methodology: Experimental
keywords: prompt-tuning, gender bias, LLM debiasing, encoder models, fairness
mini_abstract: "This paper proposes a prompt-tuning method for mitigating gender bias in encoder-only language models by training reusable token embeddings with a KL-divergence-based loss function. The approach achieves competitive debiasing performance while maintaining language modeling ability with minimal computational overhead."
target_audience: Researchers
key_contributions: "Efficient prompt-tuning debiasing method for encoder models"
geographic_focus: Europe
publication_year: Unknown
related_fields: Natural Language Processing, Machine Learning, AI Ethics
summary_date: 2025-10-31
language: English
ai_model: claude-haiku-4-5
---

# Summary: Chisca 2024 Prompting

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
