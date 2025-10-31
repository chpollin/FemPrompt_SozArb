---
title: "Sant 2024 power"
original_document: Sant_2024_power.md
document_type: Conference Paper
research_domain: AI Bias & Fairness, Natural Language Processing
methodology: Empirical/Quantitative, Comparative Analysis, Experimental
keywords: gender bias, machine translation, LLMs, prompt engineering, multilingual NLP
mini_abstract: "This paper benchmarks gender bias in LLMs versus NMT systems for English-Catalan and English-Spanish translation, demonstrating that prompt engineering can reduce bias by up to 12% in instruction-tuned LLMs."
target_audience: Researchers, Practitioners, Industry
key_contributions: "Systematic evaluation of gender bias in LLMs for MT"
geographic_focus: Europe
publication_year: Unknown
related_fields: Machine Translation, Fairness in AI, Prompt Engineering
summary_date: 2025-10-31
language: English
ai_model: claude-haiku-4-5
---

# Summary: Sant 2024 power

## Overview

This paper addresses gender bias in machine translation by conducting a comparative analysis of Large Language Models (LLMs) against state-of-the-art Neural Machine Translation (NMT) models for English-to-Catalan and English-to-Spanish translation. The research fills a critical gap by extending gender bias evaluation—previously focused on NMT systems—to LLMs, which are increasingly deployed for translation tasks. The authors investigate both the prevalence of gender bias across model architectures and practical mitigation strategies through prompt engineering, establishing baseline understanding of bias patterns in emerging LLM-based translation systems.

## Main Findings

The research reveals four critical discoveries. First, gender bias is pervasive across all tested models, confirming systemic challenges in machine translation architectures. Second, base LLMs consistently demonstrate significantly higher gender bias levels compared to state-of-the-art NMT systems, suggesting that LLM scale and training paradigms amplify stereotypical patterns. Third, strategic prompt engineering substantially reduces gender bias: specific prompt structures achieve up to 12% bias reduction on the WinoMT evaluation dataset compared to baseline prompts. Fourth, among tested techniques—few-shot learning, context-supplying, and chain-of-thought prompting—particular prompt structures prove most effective, with results meaningfully narrowing the performance gap between LLMs and NMT systems. Critically, this improvement occurs without resource-intensive model retraining, making it practically deployable.

## Methodology/Approach

The study employs a rigorous two-phase empirical methodology. Phase 1 (Benchmarking) utilizes four established evaluation datasets—FLoRes200 (general translation quality), WinoMT (gender-specific bias), Gold BUG (gender bias), and MuST-SHE (gender bias in speech)—to comprehensively assess both translation quality and gender bias across multiple base LLMs and NMT baselines. This multi-dataset approach strengthens validity by triangulating across different bias evaluation frameworks. Phase 2 (Mitigation) systematically experiments with prompt engineering techniques applied to instruction-tuned LLMs, including few-shot learning (providing examples), context-supplying prompts (adding contextual information), and chain-of-thought reasoning (step-by-step explanation). This structured exploration identifies which prompt structures most effectively reduce bias while maintaining translation quality.

## Relevant Concepts

**Gender bias in MT:** Systematic tendency of translation systems to produce outputs reflecting gender stereotypes, perpetuating representational harms (misrepresentation of social groups) or allocational harms (withholding opportunities/resources).

**Base LLMs:** Large language models trained on general language prediction without task-specific fine-tuning; typically exhibit higher bias than specialized variants.

**Instruction-tuned LLMs:** LLMs fine-tuned to follow specific directives and constraints; demonstrate improved performance on targeted tasks and serve as the primary intervention platform in this study.

**Prompt engineering:** Strategic design of input instructions to guide LLM behavior through techniques like few-shot examples, contextual framing, and reasoning chains.

## Significance

This work holds substantial practical and theoretical significance. Practically, it provides implementable, cost-effective strategies for reducing gender bias in production MT systems without expensive retraining—critical for organizations deploying LLM-based translation. Theoretically, it extends fairness evaluation frameworks to emerging LLM architectures, establishing baseline understanding of bias patterns and establishing prompt engineering as a viable bias mitigation approach. The focus on underrepresented language pairs (Catalan, Spanish) addresses a gap in multilingual bias research. However, limitations include restriction to Romance languages and specific test sets, potentially limiting generalizability to other language families, non-Romance languages, or alternative evaluation frameworks. The paper would benefit from explicit identification of tested LLM models and NMT baselines for reproducibility. Despite these constraints, the paper makes a valuable contribution to responsible AI deployment in commercial translation systems.
