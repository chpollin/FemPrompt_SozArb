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
  - Intersectional Identity
  - Stereotyping
  - Intersectionality
  - Algorithmic Bias
mitigation_strategies:
  - Bias Mitigation
  - Intersectionality
  - Inclusive Representation
  - Intersectional Identity
  - Prompting Strategies
  - Prompt Engineering
---

# summary_Shin_2024_prompt

## Key Concepts

### Bias Types
- [[Algorithmic Bias]]
- [[Intersectional Identity]]
- [[Intersectionality]]
- [[Stereotyping]]

### Mitigation Strategies
- [[Bias Mitigation]]
- [[Inclusive Representation]]
- [[Intersectional Identity]]
- [[Intersectionality]]
- [[Prompt Engineering]]
- [[Prompting Strategies]]

## Full Text

---
title: "Shin 2024 prompt"
original_document: Shin_2024_prompt.md
document_type: Empirical Study
research_domain: AI Bias & Fairness
methodology: Comparative Analysis
keywords: prompt engineering, text-to-image generation, algorithmic bias, demographic representation, generative AI
mini_abstract: "This empirical study tests whether prompt modifiers can control bias in text-to-image AI systems across DALL-E, Midjourney, and Stable Diffusion, finding that explicit demographic specifications provide partial mitigation but cannot eliminate underlying training data biases."
target_audience: Researchers
key_contributions: "Comparative platform analysis of prompt modifier effectiveness"
geographic_focus: Not Applicable
publication_year: Unknown
related_fields: AI Ethics, Human-Computer Interaction, Computational Linguistics
summary_date: 2025-10-31
language: English
ai_model: claude-haiku-4-5
---

# Summary: Shin 2024 prompt

## Overview

This academic research examines the effectiveness of prompt modifiers as a tool for controlling demographic biases in text-to-image generative AI systems. The study conducts a comparative analysis across three major platforms—DALL-E 2, Midjourney v5, and Stable Diffusion 2.1—to determine whether careful prompt engineering can meaningfully mitigate gender, racial, and intersectional biases. The central inquiry challenges the widespread assumption that users can simply "engineer" their way out of algorithmic bias through strategic language choices. The research demonstrates that while prompt modifiers offer limited improvements, they represent a superficial intervention that shifts rather than eliminates bias, and cannot address the fundamental biases embedded in training data and model architecture.

## Main Findings

The research reveals significant quantitative evidence regarding bias patterns and modifier effectiveness. For gender representation, standard "CEO" prompts generated 89% male-presenting images across all platforms; adding "diverse" language reduced this to 63% male, while explicit gender specification achieved balanced representation. Racial bias proved similarly persistent: "doctor" prompts without modifiers yielded 78% white-presenting individuals, improving only to 45% white when modified with "racially diverse." Critically, intersectional identities—such as "Black woman engineer"—remained severely underrepresented without explicit specification, revealing that models default to dominant group stereotypes.

Platform comparison demonstrated variable responsiveness: DALL-E showed the strongest response to diversity modifiers (42% improvement), Midjourney exhibited moderate responsiveness (28% improvement), and Stable Diffusion proved least responsive (15% improvement). Crucially, the study identifies that explicit demographic specifications substantially outperform vague diversity appeals, establishing a critical distinction in prompt engineering effectiveness. The research identifies three key limitations: prompt modifiers cannot fully overcome training data biases, user burden increases substantially with explicit specification requirements, and "diversity" remains ambiguous and inconsistently interpreted across platforms.

## Methodology/Approach

The study employs rigorous comparative experimental design, testing 500 occupation-based prompts systematically across three platforms. Researchers categorized modifiers into three distinct types: demographic specifications ("Asian woman," "elderly man"), diversity instructions ("diverse group," "inclusive representation"), and neutral framing ("person," "professional"). This framework treats prompt engineering as an independent variable with demographic representation as the dependent outcome. The methodology enables direct platform comparison and quantifiable measurement of modifier effectiveness, providing empirical evidence for claims about prompt engineering's limitations and establishing measurable benchmarks for bias mitigation potential.

## Relevant Concepts

**Prompt Engineering**: Strategic manipulation of input language to influence AI output characteristics, often assumed to resolve algorithmic problems through user-level intervention.

**Bias Shifting vs. Elimination**: The distinction between reducing bias manifestation (shifting) versus removing underlying bias sources (elimination); prompt modifiers achieve the former but not the latter.

**Algorithmic Bias**: Systematic disparities in AI system outputs reflecting and amplifying demographic inequalities present in training data.

**Intersectionality**: The compounded effects of multiple marginalized identities (race, gender, age) that models often fail to represent adequately without explicit specification.

**User Burden**: The increasing cognitive and operational load placed on end-users to manually specify demographic details to achieve fair representation.

**Training Data Bias**: Demographic imbalances in datasets used to train models, which fundamentally constrain what systems can generate regardless of prompting strategies.

## Significance

This research holds substantial implications for AI ethics, policy, and responsibility distribution. By empirically demonstrating that prompt modifiers cannot fully overcome training data biases and that explicit specifications substantially outperform vague diversity language, the study challenges techno-optimistic narratives suggesting users can independently solve fairness problems. The findings advocate for shifting responsibility from end-users to developers and policymakers, emphasizing that systemic solutions—including improved training datasets, model architecture redesign, and regulatory oversight—remain necessary for achieving genuinely fair AI systems. The work contributes critical evidence to ongoing debates about whether bias mitigation should burden individual users or require structural institutional change, positioning itself against the dangerous assumption that prompt engineering alone constitutes adequate fairness intervention. Platform-specific responsiveness data provides actionable insights for developers while establishing empirical benchmarks for future bias mitigation research.
