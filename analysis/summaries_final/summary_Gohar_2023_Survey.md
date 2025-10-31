---
title: "Gohar 2023 Survey"
original_document: Gohar_2023_Survey.md
document_type: Literature Review
research_domain: AI Bias & Fairness
methodology: Survey
keywords: intersectional fairness, algorithmic bias, machine learning discrimination, demographic subgroups, fairness mitigation
mini_abstract: "This survey systematizes research on intersectional fairness in ML systems, examining how algorithms discriminate against individuals at intersections of multiple sensitive attributes and reviewing mitigation techniques and open challenges."
target_audience: Researchers
key_contributions: "Taxonomy of intersectional fairness notions and mitigation approaches"
geographic_focus: Global
publication_year: Unknown
related_fields: Critical Race Theory, AI Ethics, Algorithmic Accountability
summary_date: 2025-10-31
language: English
ai_model: claude-haiku-4-5
---

# Summary: Gohar 2023 Survey

## Overview

This survey by Gohar and Cheng addresses a critical gap in machine learning fairness research by examining **intersectional fairness**—the phenomenon where algorithmic discrimination emerges at the intersection of multiple demographic characteristics rather than from single attributes alone. The work responds to widespread concerns about fairness implications in high-stakes ML applications including criminal sentencing, loan decisions, hiring, and facial recognition systems. By grounding analysis in Crenshaw's intersectionality theory from critical race studies, the authors establish that discrimination experienced by individuals at intersectional identities—such as Black women—differs fundamentally from discrimination affecting constituent groups independently. The survey synthesizes state-of-the-art approaches, develops a comprehensive taxonomy of intersectional fairness notions, and identifies key technical and conceptual challenges for future research.

## Main Findings

The survey reveals several critical insights. First, traditional fairness metrics focusing on independent group fairness (single demographic dimensions) systematically fail to detect discrimination affecting intersectional subgroups. Empirical evidence demonstrates that algorithms can appear fair across racial groups and gender groups independently while exhibiting substantial accuracy disparities for specific intersectional combinations—exemplified by Buolamwini and Gebru's finding that gender classification systems showed significantly lower accuracy for Black women. Second, intersectional bias operates through an **amplification mechanism**, where combined demographic identities intensify discrimination beyond additive effects of individual attributes. Third, intersectional fairness introduces distinct technical challenges: (a) determining appropriate granularity levels for fairness guarantees across exponentially increasing subgroup combinations, (b) managing severe data sparsity in smaller populations that increases statistical uncertainty and reduces reliable fairness assessment, and (c) adapting conventional mitigation techniques that prove ineffective for intersectional contexts. The survey identifies emerging solutions including subgroup fairness frameworks and multicalibration approaches, though acknowledges their limitations in addressing all identified challenges.

## Methodology/Approach

The document employs systematic survey methodology to organize fragmented literature into coherent frameworks. The authors develop a three-category taxonomy: (1) **independent group fairness** treating demographic attributes separately, (2) **intersectional group fairness** accounting for combined demographic characteristics and their interactions, and (3) **gerrymandering groups** representing unions of independent and intersectional groups. This taxonomy is grounded in interdisciplinary theory drawing from philosophy, social psychology, and contemporary ML fairness literature. The approach incorporates conceptual mapping through visual representations (Figure 1) to clarify distinctions between fairness categories. The authors substantiate theoretical arguments with concrete empirical examples from computer vision and natural language processing domains, demonstrating the problem's prevalence across ML applications.

## Relevant Concepts

- **Intersectionality**: Crenshaw's theoretical framework positing that multiple identity dimensions interact to produce unique discrimination experiences distinct from single-dimension effects
- **Independent Group Fairness**: Traditional fairness approaches treating demographic attributes separately without considering their interactions
- **Intersectional Group Fairness**: Fairness guarantees accounting for combined demographic characteristics and their compounded effects
- **Gerrymandering Groups**: Union of independent and intersectional group categories, representing comprehensive fairness coverage
- **Subgroup Fairness**: Technical approach providing fairness guarantees across multiple demographic subgroups simultaneously (Kearns et al., 2018)
- **Multicalibration**: Algorithmic technique ensuring calibrated predictions across diverse demographic combinations (Hebert-Johnson et al., 2018)
- **Data Sparsity Problem**: Statistical challenge where smaller intersectional subgroups contain insufficient data for reliable fairness assessment, increasing uncertainty in bias detection
- **Amplification Thesis**: Phenomenon where intersectional identities intensify biases beyond constituent group effects

## Significance

This survey establishes intersectional fairness as a distinct, urgent research priority within ML fairness discourse. By bridging social theory with technical ML approaches, it legitimizes previously marginalized concerns about compounded discrimination. The work provides researchers with structured frameworks, identifies concrete gaps requiring investigation, and offers practical guidelines for future research directions. Its significance extends beyond academia to policy and practice, as it demonstrates that fairness-aware ML systems require fundamentally reconceptualized approaches acknowledging demographic complexity rather than simplified single-dimension models. The survey's emphasis on high-stakes applications (criminal justice, financial services) underscores urgent practical implications for vulnerable populations experiencing intersectional discrimination.
