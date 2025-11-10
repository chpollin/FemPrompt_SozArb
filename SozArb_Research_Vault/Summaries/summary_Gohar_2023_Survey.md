---
title: "Gohar 2023 Survey"
original_document: Gohar_2023_Survey.md
document_type: Literature Review
research_domain: AI Bias & Fairness
methodology: Literature Review
keywords: intersectional fairness, algorithmic bias, machine learning, demographic discrimination, subgroup fairness
mini_abstract: "This survey systematizes research on intersectional fairness in machine learning, examining how bias manifests across multiple demographic dimensions simultaneously and reviewing mitigation techniques that address compounded discrimination beyond single-attribute fairness approaches."
target_audience: Researchers
key_contributions: "Taxonomy of intersectional fairness notions and mitigation techniques"
geographic_focus: Global
publication_year: Unknown
related_fields: AI Ethics, Social Science/Intersectionality Theory, Algorithmic Accountability
summary_date: 2025-10-31
language: English
ai_model: claude-haiku-4-5
---

# Summary: Gohar 2023 Survey

## Overview

This survey by Gohar and Cheng addresses intersectional fairness in machine learning—how algorithmic bias manifests across multiple demographic dimensions simultaneously (race AND gender). Traditional fairness research treats demographic categories independently, examining fairness for each attribute separately. However, this approach fails to capture compounded discrimination experienced by individuals at intersectional identities. The survey systematizes emerging research on intersectional fairness across high-stakes applications including criminal sentencing, loan decisions, hiring, and NLP systems. It provides conceptual frameworks distinguishing independent group fairness, intersectional group fairness, and gerrymandered groups; reviews mitigation techniques including subgroup fairness and multicalibration; and identifies critical challenges requiring future investigation.

## Main Findings

The survey establishes that intersectional fairness constitutes a fundamentally distinct challenge from traditional group fairness. Empirical evidence demonstrates that algorithms can simultaneously achieve fairness metrics for independent demographic groups while exhibiting significant bias against intersectional subgroups—exemplified by Buolamwini and Gebru's finding that gender classification systems showed greater accuracy disparities for Black women than for Black people or women as independent groups. This amplification effect reveals that intersectional discrimination operates through unique mechanisms not reducible to component biases. The authors identify that existing single-dimension mitigation techniques prove inadequate for intersectional contexts. Emerging approaches like subgroup fairness and multicalibration offer partial solutions but require substantial further development. Critical technical challenges include: (1) determining appropriate granularity levels for intersectional subgroups, (2) managing data sparsity in smaller populations that increases statistical uncertainty, (3) addressing amplification phenomena where intersectional biases exceed constituent parts, and (4) establishing fairness guarantees across multiple intersectional dimensions simultaneously.

## Methodology/Approach

The survey employs a systematic taxonomic framework organizing intersectional fairness literature across three dimensions: conceptual definitions, mitigation techniques, and measurement frameworks. The authors distinguish between three group fairness categories: independent group fairness (single demographic dimensions), intersectional group fairness (multiple interacting dimensions producing unique discrimination patterns), and gerrymandered groups (unions of independent and intersectional categories). This taxonomy integrates social science foundations—specifically Crenshaw's intersectionality theory from sociology and philosophy—with machine learning fairness literature, creating an interdisciplinary framework. The approach systematizes nascent research into coherent categories while explicitly identifying gaps, open questions, and challenges requiring future investigation.

## Relevant Concepts

**Intersectionality**: Crenshaw's sociological theory positing that multiple identity dimensions interact to produce unique discrimination patterns distinct from isolated demographic categories.

**Independent Group Fairness**: Traditional fairness approaches treating demographic attributes separately without considering their interactions.

**Intersectional Group Fairness**: Fairness guarantees across subgroups defined by multiple intersecting demographic attributes simultaneously.

**Gerrymandered Groups**: Union of independent and intersectional group categories.

**Amplification Effect**: Phenomenon where intersectional bias exceeds the sum of component biases, indicating emergent discrimination mechanisms.

**Data Sparsity**: Reduced sample sizes in smaller intersectional subgroups, increasing statistical uncertainty and complicating fairness measurement and guarantee provision.

**Subgroup Fairness**: Emerging mitigation technique providing fairness guarantees across defined subgroups.

**Multicalibration**: Emerging mitigation technique addressing fairness across multiple intersectional dimensions.

## Significance

This survey occupies a crucial bridging position between social science and machine learning, legitimizing intersectionality theory within algorithmic fairness discourse. It advances beyond binary fairness conceptualizations toward nuanced, multidimensional approaches applicable across diverse domains (criminal justice, finance, hiring, NLP). By synthesizing emerging intersectional fairness literature into coherent frameworks with explicit problem categorization, the work positions intersectional fairness as an urgent, underexplored frontier requiring interdisciplinary attention. The survey's systematic identification of unique technical challenges, partial solutions, and open research questions provides researchers with actionable guidelines for future investigation, ultimately advancing more equitable machine learning systems for marginalized populations experiencing compounded discrimination.
