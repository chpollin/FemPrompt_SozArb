---
title: "Can prompt modifiers control bias"
original_document: Shin_2024_prompt.md
document_type: Research Paper
research_domain: AI Bias & Fairness
methodology: Empirical/Quantitative
keywords: text-to-image, gender bias, racial bias, prompt modifiers, generative AI
mini_abstract: "Comparative analysis of bias control through prompting across DALL-E, Midjourney, and Stable Diffusion."
target_audience: Researchers
key_contributions: "Quantifies prompt modifier effectiveness across platforms"
geographic_focus: Global
publication_year: 2024
related_fields: Computer Vision, HCI, Fairness ML
summary_date: 2025-10-31
language: English
---

# Summary: Can prompt modifiers control bias

## Overview

Shin et al. systematically investigate whether prompt engineering can mitigate demographic biases in text-to-image generative models. Through controlled experiments across three major platforms (DALL-E 2, Midjourney v5, Stable Diffusion 2.1), the research reveals that prompt modifiers offer partial but insufficient bias control, with effectiveness varying significantly across systems.

## Main Findings

Explicit demographic specifications substantially outperform vague diversity appeals. For CEO prompts, standard outputs showed 89% male representation, reducing to 63% with "diverse" modifiers but achieving parity only with explicit gender specification. Racial bias patterns proved similarly resistant, with intersectional identities (e.g., Black woman engineer) being systematically underrepresented without explicit prompting. Platform responsiveness varied: DALL-E achieved 42% bias reduction, Midjourney 28%, and Stable Diffusion only 15%.

## Methodology/Approach

The empirical study employed 500 occupation-based prompts tested systematically across three generative AI platforms. Modifiers included demographic specifications, diversity instructions, and neutral framing. Outputs were coded for gender presentation and racial representation, enabling quantitative comparison of bias patterns and mitigation effectiveness.

## Relevant Concepts

**Prompt modifiers**: Specific textual instructions added to guide AI output characteristics
**Gender bias**: Systematic over-representation of male-presenting individuals in professional contexts
**Racial bias**: Default representation skewed toward white-presenting subjects
**Intersectional discrimination**: Compounding biases affecting multiply-marginalized identities
**Algorithmic bias**: Systematic and unfair discrimination in automated decision-making systems
**Debiasing**: Techniques to reduce unfair bias in AI systems

## Significance

This research provides crucial empirical evidence that prompt engineering alone cannot fully address systemic bias in generative AI. While offering practitioners actionable strategies for bias reduction, it demonstrates that fundamental improvements require addressing training data composition and model architecture. The comparative platform analysis reveals that bias responsiveness varies by implementation, suggesting technical mitigation is possible but not automatic.
