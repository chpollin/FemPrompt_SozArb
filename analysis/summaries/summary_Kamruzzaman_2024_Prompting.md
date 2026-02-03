---
title: "Kamruzzaman 2024 Prompting"
original_document: Kamruzzaman_2024_Prompting.md
document_type: Conference Paper
research_domain: AI Ethics, AI Bias & Fairness, Natural Language Processing
methodology: Empirical/Quantitative, Comparative Analysis, Experimental
keywords: dual process theory, chain-of-thought prompting, social bias mitigation, LLMs, persona modeling
mini_abstract: "This paper investigates how prompting techniques grounded in dual process theory reduce social bias in LLMs, comparing zero-shot CoT, debiasing, and dual process-based strategies across nine bias categories with up to 33% bias reduction achieved."
target_audience: Researchers, Practitioners, Industry
key_contributions: "Systematic framework linking dual process theory to LLM bias reduction"
geographic_focus: Not Applicable
publication_year: 2025
related_fields: Cognitive Psychology, AI Fairness, Human-Computer Interaction
summary_date: 2025-11-07
language: English
ai_model: claude-haiku-4-5
---

# Summary: Kamruzzaman 2024 Prompting

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
