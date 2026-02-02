---
title: summary_Shin_2024_prompt
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
  - Systematic Bias
mitigation_strategies:
  - Bias Evaluation
  - Prompt Engineering
  - Bias Mitigation
---

# summary_Shin_2024_prompt

## Key Concepts

### Bias Types
- [[Systematic Bias]]

### Mitigation Strategies
- [[Bias Evaluation]]
- [[Bias Mitigation]]
- [[Prompt Engineering]]

## Full Text

---
title: "Shin 2024 prompt"
original_document: Shin_2024_prompt.md
document_type: Empirical Study
research_domain: AI Bias & Fairness
methodology: Comparative Analysis
keywords: text-to-image generation, prompt engineering, bias control, generative models, fairness
mini_abstract: "This study systematically analyzes how prompt modifiers can control societal biases in leading text-to-image generative models (Stable Diffusion, DALL·E 3, Adobe Firefly) across gender, race, and cultural dimensions, proposing a novel bias sensitivity taxonomy for standardized evaluation."
target_audience: Researchers
key_contributions: "Framework for systematic bias evaluation in generative AI"
geographic_focus: Global
publication_year: Unknown
related_fields: AI Ethics, Computer Vision, Human-Computer Interaction
summary_date: 2025-10-31
language: English
ai_model: claude-haiku-4-5
---

# Summary: Shin 2024 prompt

## Overview

This research, supported by NSF Awards 2243979 and 2318101, examines whether prompt modifiers can effectively control bias in leading text-to-image generative models—specifically Stable Diffusion, DALL·E 3, and Adobe Firefly. The study addresses a critical gap in AI ethics by investigating how these systems encode and respond to societal biases across gender, race, geography, and culture. Rather than treating bias as an inevitable byproduct of AI development, the authors propose that systematic prompt engineering combined with standardized evaluation frameworks could provide meaningful mitigation strategies. The work is motivated by observable disparities in model outputs: when prompted with generic terms like "monk," different models produce dramatically different demographic distributions, suggesting that bias manifestation is neither uniform nor inevitable. By conducting comparative analysis across three major commercial models and introducing a novel bias sensitivity taxonomy, the research establishes foundational evidence for developing common metrics and standards for bias evaluation in generative AI systems.

## Main Findings

The research reveals striking differential bias patterns across models. Stable Diffusion and DALL·E 3 demonstrate extreme homogeneity in their outputs, generating exclusively male monks (100% in SD, 97% in DALL·E 3) and heavily skewed racial representations (100% Asian in SD). Conversely, Adobe Firefly shows substantially more balanced demographics, producing 54% female monks and more diverse racial representations. Critically, explicit racial modifiers—such as adding "Who is Black" to prompts—partially override default biases but with inconsistent effectiveness. While Adobe Firefly achieves approximately 50% Black representation with this modifier, DALL·E 3 achieves only 6%, indicating that modifier responsiveness varies significantly by model architecture. Prompt sequencing analysis reveals that modifier order influences bias manifestation, though effectiveness remains limited. These findings establish that bias control through prompting is possible but insufficient alone, requiring complementary technical interventions beyond user-level prompt engineering.

## Methodology/Approach

The study employs rigorous comparative empirical analysis utilizing multiple methodological components. Researchers tested base prompts combined with strategic modifiers to measure how additional descriptors influence output distributions. They analyzed prompt sequencing effects to determine whether modifier order and positioning affect bias manifestation patterns. Quantitative distribution analysis measured gender and racial representation across generated images, with results presented in systematic tables enabling cross-model comparison. The authors introduced a novel bias sensitivity taxonomy—a comprehensive framework categorizing different bias types, model responsiveness patterns, and sensitivity levels to bias-mitigation requests. This systematic, replicable approach enables objective comparison across models and establishes methodological precedent for future bias research in generative AI, supporting the development of uniform evaluation standards.

## Relevant Concepts

**Bias inheritance**: The phenomenon where AI models systematically reproduce and amplify societal biases present in training data and algorithmic design choices.

**Prompt engineering**: Strategic manipulation of text inputs to influence AI output characteristics, including demographic representations and bias mitigation.

**Prompt sequencing**: The ordering and positioning of modifiers within prompts, which influences how effectively bias-mitigation requests are processed by generative models.

**Bias sensitivity taxonomy**: A classification framework categorizing types of biases, measuring model responsiveness to bias-mitigation requests, and establishing standardized evaluation metrics.

**Model-specific bias mitigation mechanisms**: Deliberate internal architectural or training approaches that enable certain models (e.g., Adobe Firefly) to demonstrate superior bias control compared to competitors.

**Differential bias patterns**: Variations in how different models encode and express identical biases, suggesting model-specific architectural or training differences.

## Significance

This research advances AI ethics by establishing empirical rigor in bias evaluation, moving beyond anecdotal observations toward systematic comparative analysis. It bridges the theory-practice gap by connecting abstract bias concepts to concrete user-level interventions. Most importantly, it proposes replicable methodological frameworks and introduces a novel bias sensitivity taxonomy that could standardize bias evaluation across future AI systems, supporting evidence-based policy development for generative AI regulation. The discovery that Adobe Firefly demonstrates superior bias mitigation suggests deliberate internal mechanisms are possible, providing a model for responsible AI development. By establishing common metrics, evaluation standards, and taxonomic frameworks, this work contributes essential infrastructure for responsible AI governance, accountability, and the development of ethical guidelines for next-generation generative AI systems.
