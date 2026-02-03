---
title: "Ghosal 2025 Unequal"
original_document: Ghosal_2025_Unequal.md
document_type: Empirical Study
research_domain: AI Ethics, AI Bias & Fairness, Natural Language Processing
methodology: Experimental, Comparative Analysis
keywords: LLM bias, queer representation, narrative constraints, marginalized groups, persona-based prompting
mini_abstract: "This paper demonstrates that LLMs generate systematically narrower, identity-focused narratives about LGBTQ+ individuals compared to non-queer personas, perpetuating representational marginalization through subtle associative patterns rather than explicit toxicity."
target_audience: Researchers, Practitioners, Policymakers
key_contributions: "Distinguishes representational constraints from explicit bias in LLMs"
geographic_focus: Not Applicable
publication_year: Unknown
related_fields: Media Studies, Critical Discourse Analysis, Disability Justice
summary_date: 2025-11-07
language: English
ai_model: claude-haiku-4-5
---

# Summary: Ghosal 2025 Unequal

## Overview

This paper investigates how Large Language Models systematically construct narrower, more identity-constrained narratives about LGBTQ+ individuals compared to non-queer personas in neutral contexts. The research addresses a critical gap in AI ethics by moving beyond traditional toxicity auditing to examine subtle representational biases embedded in LLM outputs. The authors argue that even when responses appear neutral or positive, they reflect and amplify real-world media disparities that marginalize LGBTQ+ people by reducing their complexity to identity-focused characteristics. The motivation is urgent: LLMs increasingly function in creative, educational, and therapeutic roles (including therapist chatbots), making their representational patterns consequential for cultural narrative formation. The paper demonstrates that problematic outputs operate through subtle prevalence patterns rather than overt toxicity, rendering them invisible to conventional bias auditing methods.

## Main Findings

The study demonstrates statistically significant differences in LLM portrayals of queer versus non-queer personas. When assuming LGBTQ+ identities, models disproportionately center responses on sexual orientation or gender identity, even when contextually irrelevant. For example, queried about employment, a queer male persona emphasizes identity-related job aspects, while a non-queer male persona focuses on career aspirations and community contributions. This reveals that LLMs default to identity-focused narratives for marginalized groups while affording non-marginalized groups full human complexity. The authors identify three distinct textual phenomena operating simultaneously: (1) **explicitly harmful representations** (overtly negative content), (2) **overly narrow representations** (identity-constrained scope), and (3) **discursive othering** (systematic marking of difference). Crucially, findings show that problematic outputs operate through cumulative prevalence patterns—the sheer frequency of identity-focus—rather than individual toxic instances, making detection difficult through standard bias audits.

## Methodology/Approach

The research employs comparative persona-based prompting experiments using Llama-3.1-8B-Instruct. Researchers instruct the model to assume specific identities (queer and non-queer pairs) and respond to identical neutral queries without additional contextual cues. This methodology operationalizes "constrained narratives" through systematic textual comparison. The theoretical framework integrates media studies (examining how narratives shape cultural consciousness and societal perception of marginalized groups) with disability justice scholarship (particularly the "inspiration porn" concept). Replication code is forthcoming, supporting methodological transparency and reproducibility.

## Relevant Concepts

**Constrained Narratives**: Narrow, stereotyped topic ranges assigned to marginalized groups, contrasting with full complexity afforded to default groups.

**Explicitly Harmful Representations**: Overtly negative or toxic content about marginalized individuals.

**Overly Narrow Representations**: Identity-constrained portrayals that reduce individuals to single characteristics.

**Discursive Othering**: Textual practices systematically marking marginalized individuals as fundamentally different through representational choices.

**Inspiration Porn**: Problematic portrayals reducing marginalized people (especially disabled individuals) to motivational examples, denying full humanity.

**Representational Bias**: Subtle associative patterns in AI outputs mirroring real-world media biases without explicit toxicity.

## Significance

This work advances AI ethics by establishing analytical frameworks for detecting structural representational constraints beyond explicit bias. It demonstrates how neutral prompts reveal embedded biases and connects LLM outputs to real-world narrative marginalization patterns. The research has immediate implications for applications where LLMs function as creative or therapeutic agents, suggesting current bias auditing practices inadequately address how AI systems reproduce social inequalities through representation. By bridging computational linguistics with critical media studies and disability justice frameworks, the paper opens new methodological pathways for understanding AI's role in cultural narrative formation and provides evidence-based grounds for demanding more equitable LLM development practices. The distinction between explicit bias and structural representational constraints represents a significant conceptual advance in the field.
