---
title: summary_Sant_2024_power
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
  - Stereotyping
  - Stereotypical
mitigation_strategies:
  - Prompt Engineering
  - Bias Evaluation
  - Bias Mitigation
  - Fine-tuning
---

# summary_Sant_2024_power

## Key Concepts

### Bias Types
- [[Stereotypical]]
- [[Stereotyping]]

### Mitigation Strategies
- [[Bias Evaluation]]
- [[Bias Mitigation]]
- [[Fine-tuning]]
- [[Prompt Engineering]]

## Full Text

---
title: "Sant 2024 power"
original_document: Sant_2024_power.md
document_type: Conference Paper
research_domain: AI Bias & Fairness, Natural Language Processing
methodology: Empirical/Quantitative, Comparative Analysis, Experimental
keywords: gender bias, machine translation, LLMs, prompt engineering, mitigation
mini_abstract: "This paper evaluates gender bias in LLM-based machine translation compared to NMT systems for English-Catalan and English-Spanish, demonstrating that prompt engineering can reduce bias by up to 12% on benchmark datasets."
target_audience: Researchers, Practitioners, Industry
key_contributions: "Prompt engineering reduces LLM gender bias in machine translation"
geographic_focus: Europe
publication_year: Unknown
related_fields: Machine Translation, Fairness in NLP, Prompt Engineering
summary_date: 2025-10-31
language: English
ai_model: claude-haiku-4-5
---

# Summary: Sant 2024 power

## Overview

This research addresses a critical gap in understanding gender bias within Large Language Models applied to machine translation tasks. While gender bias in traditional Neural Machine Translation systems has received considerable scholarly attention, base LLMs—increasingly deployed for translation purposes—remain largely understudied in this context. The paper conducts systematic benchmarking comparing base LLMs with state-of-the-art NMT models for English→Catalan and English→Spanish translation directions using four established evaluation datasets (FLoRes200, WinoMT, Gold BUG, MuST-SHE). Subsequently, the authors explore whether prompt engineering techniques applied to instruction-tuned LLMs can effectively mitigate identified biases. The work is motivated by recognizing that gender bias in translation systems produces tangible harms: representational harms (misrepresentation of social groups) and allocational harms (unequal resource distribution based on gender stereotypes).

## Main Findings

The research reveals several significant discoveries. First, gender bias is pervasive across all tested models, demonstrating systemic rather than isolated challenges. Second, base LLMs exhibit substantially higher degrees of gender bias compared to established NMT models, suggesting that transitioning to LLM-based translation introduces new fairness challenges. Most critically, specific prompt structures reduce gender bias by up to 12% on the WinoMT evaluation dataset—a meaningful reduction that substantially narrows the performance gap between LLMs and traditional NMT systems. The authors identify optimized prompt engineering as significantly more effective than straightforward prompting approaches. This finding demonstrates that prompt engineering represents a practical, non-invasive intervention strategy without requiring expensive model retraining or architectural modifications, making bias mitigation accessible to resource-constrained practitioners.

## Methodology/Approach

The study employs a rigorous two-phase methodology. Phase 1 conducts comprehensive benchmarking using four established evaluation datasets: FLoRes200, WinoMT, Gold BUG, and MuST-SHE. These datasets enable systematic assessment of both translation quality and gender bias across multiple base LLMs versus NMT baselines for two Romance language pairs. Phase 2 investigates mitigation strategies through systematic experimentation with prompt engineering techniques applied to instruction-tuned LLMs. The techniques tested include few-shot prompting (providing in-context examples), context-supplying prompts (offering relevant background information), and chain-of-thought reasoning (encouraging step-by-step problem decomposition). The research identifies which prompt structures prove most effective at reducing bias. This methodological framework operationalizes gender bias as systematic tendencies toward stereotypical translations, grounded in established fairness literature distinguishing representational and allocational harms.

## Relevant Concepts

**Gender Bias in MT:** The tendency of translation systems to produce outputs reflecting or perpetuating gender stereotypes, inequalities, or culturally-biased assumptions.

**Representational Harm:** Misrepresentation or underrepresentation of social groups and their identities in system outputs.

**Allocational Harm:** Allocation or withholding of opportunities or resources to certain groups based on biased predictions.

**Base LLMs:** Large language models without instruction-tuning, representing foundational model capabilities.

**Instruction-tuned LLMs:** Language models specifically fine-tuned to follow natural language instructions effectively, demonstrating improved alignment with user intent.

**Prompt Engineering:** Strategic design of input instructions to guide LLM behavior toward desired outputs without modifying underlying model parameters or requiring retraining.

## Significance

This work holds substantial significance for both academic research and practical applications. Theoretically, it extends established gender bias evaluation frameworks from specialized NMT systems to general-purpose LLMs, addressing an increasingly urgent concern as organizations transition to LLM-based translation solutions. The comparative analysis between base and instruction-tuned LLMs provides insights into how fine-tuning affects bias manifestation. Methodologically, the paper demonstrates that prompt-based interventions achieve bias reduction comparable to architectural modifications, positioning prompt engineering as a practical alternative for resource-constrained practitioners. Practically, the findings provide actionable guidance for deploying LLMs in translation contexts while maintaining fairness standards, with particular relevance for low-resource language pairs (Catalan, Spanish). The research contributes to responsible AI development by showing that significant bias mitigation—up to 12%—is achievable through relatively simple, implementable techniques, democratizing fairness improvements across organizations regardless of computational resources or technical expertise.
