---
title: "Prompting techniques for reducing social bias in LLMs through System 1 and System 2 cognitive processes"
zotero_key: FMXXR4DH
author_year: "Kamruzzaman (2024)"
authors: []

# Publication
publication_year: 2024.0
item_type: report
language: nan
doi: "nan"
url: "https://arxiv.org/html/2404.17218v1"

# Assessment
decision: Include
exclusion_reason: "nan"

# Relevance Scores (0-3)
rel_ai_komp: 1
rel_vulnerable: 2
rel_bias: 3
rel_praxis: 3
rel_prof: 1
total_relevance: 10

# Categorization
relevance_category: high
top_dimensions: ["Bias Analysis", "Practical Implementation"]

# Tags
tags: ["paper", "include", "high-relevance", "dim-vulnerable-medium", "dim-bias-high", "dim-praxis-high", "has-summary"]

# Summary
has_summary: true
summary_file: "summary_Kamruzzaman_2024_Prompting.md"

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
| **Decision** | **Include** |
| **Total Relevance** | **10/15** (high) |
| **Top Dimensions** | Bias Analysis, Practical Implementation |


## Relevance Profile

| Dimension | Score | Assessment |
|-----------|-------|------------|
| AI Literacy & Competencies | 1/3 | ⭐ Low |
| Vulnerable Groups & Digital Equity | 2/3 | ⭐⭐ Medium |
| Bias & Discrimination Analysis | 3/3 | ⭐⭐⭐ High |
| Practical Implementation | 3/3 | ⭐⭐⭐ High |
| Professional/Social Work Context | 1/3 | ⭐ Low |


## Abstract

This study evaluates 12 prompt strategies across five LLMs, finding that instructing a model to adopt a System 2 (deliberative) reasoning style and a "human persona" most effectively reduces stereotypes. Combining these two strategies yielded up to a 13% reduction in stereotypical responses. Contrary to prior assumptions, Chain-of-Thought (CoT) prompting alone was not as effective, showing bias levels similar to a default prompt. The results suggest that prompts encouraging careful, human-like reasoning are key for mitigating bias.


## AI Summary

## Overview

This research paper addresses social bias mitigation in Large Language Models through psychologically-informed prompting techniques grounded in dual process theory. Authored by Kamruzzaman and Kim (University of South Florida), and accepted at RANLP-2025, the work applies Kahneman's cognitive framework—distinguishing System 1 (fast, intuitive, bias-prone) from System 2 (slow, deliberate, analytical) reasoning—to develop practical prompting strategies. Unlike computationally expensive fine-tuning requiring model weight access, this approach offers lightweight, accessible solutions suitable for closed-source models and resource-constrained environments. The research systematically evaluates three prompting strategies across two bias datasets spanning nine social bias categories (beyond previous gender-bias-focused work), testing multiple LLM models including Llama3.3. Code is publicly available, enabling reproducibility and practitioner implementation.

## Main Findings

The research demonstrates that combining multiple interventions achieves substantial bias reduction, with maximum improvements reaching 33% decrease in stereotypical judgments. Critically, all four tested interventions independently reduce social bias: (1) human persona adoption, (2) explicit debiasing instructions, (3) System 2 reasoning prompts, and (4) zero-shot chain-of-thought prompting. However, no universal optimal strategy exists; effectiveness varies significantly by specific LLM model and bias category. Notably, human persona modeling produces independent bias-reduction effects beyond cognitive process simulation alone, indicating LLMs respond to social role-playing through mechanisms transcending pure reasoning enhancement. This context-dependent effectiveness reveals that optimal combinations differ across model-bias category pairs, requiring tailored approaches rather than standardized solutions. The findings suggest prompting interventions operate through multiple complementary mechanisms rather than single causal pathways.

## Methodology/Approach

The experimental design employs comparative analysis across three prompting strategies: zero-shot chain-of-thought (step-by-step reasoning without examples), direct debiasing instructions (explicit fairness guidance), and dual process theory-based prompting (System 2 engagement). Testing occurs on two bias datasets encompassing nine social bias categories, substantially expanding previous research scope. Researchers introduce human and machine personas as independent variables, enabling isolation of whether dual process effects operate independently or depend on explicit persona modeling. Multiple LLM models undergo testing to ensure generalizability. This methodological design allows disentanglement of confounding factors and identification of which intervention components contribute most substantially to bias reduction, with systematic comparison revealing interaction effects between strategies.

## Relevant Concepts

**Dual Process Theory:** Kahneman's psychological framework positing two cognitive systems—System 1 (automatic, emotional, susceptible to biases) and System 2 (deliberate, analytical, rational)—governing human decision-making and reasoning.

**Chain-of-Thought (CoT) Prompting:** Technique requiring LLMs to articulate step-by-step reasoning processes, theoretically engaging System 2 analytical capabilities and improving accuracy, transparency, and fairness in outputs.

**Zero-shot CoT:** CoT prompting without providing examples, relying on the model's inherent reasoning capabilities without demonstration-based learning.

**Social Bias:** Systematic stereotypical judgments embedded in LLM outputs reflecting training data prejudices, cultural assumptions, and learned associations across nine categories (gender, race, religion, age, disability, sexual orientation, etc.).

**Persona Modeling:** Instructing LLMs to adopt specific social roles or identities (human vs. machine), influencing response generation patterns and bias manifestation.

**Direct Debiasing:** Explicit fairness instructions embedded in prompts, instructing models to avoid stereotypical reasoning.

## Significance

This work makes four critical contributions to AI ethics and cognitive science. First, it systematizes the theoretical connection between established psychological frameworks and LLM behavior, providing principled foundations for bias mitigation grounded in cognitive science. Second, it offers immediately actionable solutions for practitioners lacking model access or computational resources, democratizing bias reduction techniques beyond institutional capabilities. Third, it expands bias research beyond gender to encompass nine categories, providing comprehensive empirical evidence of prompting effectiveness across diverse bias types. Fourth, it demonstrates that accessible, lightweight interventions achieve meaningful bias reduction (up to 33%), making ethical AI deployment more feasible across diverse organizational contexts. The research acknowledges inherent limitations—prompting may have ceiling effects compared to architectural modifications—yet establishes that accessible interventions can substantially improve fairness in deployed systems.


## Links & Resources

- **DOI:** [nan](https://doi.org/nan)
- **URL:** https://arxiv.org/html/2404.17218v1
- **Zotero:** [Open in Zotero](zotero://select/items/FMXXR4DH)

## Related Concepts

- [[Concepts/Dual_Process_Theory|Dual Process Theory]]
- [[Concepts/Chain_of_Thought_CoT_Prompting|Chain-of-Thought (CoT) Prompting]]
- [[Concepts/Zero_shot_CoT|Zero-shot CoT]]
- [[Concepts/Social_Bias|Social Bias]]
- [[Concepts/Persona_Modeling|Persona Modeling]]
- [[Concepts/Direct_Debiasing|Direct Debiasing]]

## Related Papers

*Use Obsidian graph view to explore papers with similar relevance profiles*

## Notes

*Add your research notes here*

