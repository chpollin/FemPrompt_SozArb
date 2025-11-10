---
title: "Gohar 2023 Survey"
original_document: Gohar_2023_Survey.md
document_type: Literature Review
research_domain: AI Bias & Fairness
methodology: Literature Review
keywords: intersectional fairness, machine learning discrimination, multiple sensitive attributes, bias mitigation, subgroup fairness
mini_abstract: "This survey systematizes the emerging field of intersectional fairness in ML, examining how algorithms discriminate based on multiple overlapping identity dimensions and reviewing mitigation techniques and open challenges."
target_audience: Researchers
key_contributions: "Taxonomy of intersectional fairness notions and mitigation approaches"
geographic_focus: Global
publication_year: Unknown
related_fields: Social Science/Intersectionality Theory, Algorithmic Fairness, Applied Ethics
summary_date: 2025-11-07
language: English
ai_model: claude-haiku-4-5
---

# Summary: Gohar 2023 Survey

## Overview

This survey examines intersectional fairness in machine learning systems, addressing a critical gap in algorithmic fairness research. While traditional fairness approaches focus on single demographic dimensions (race OR gender), this work highlights how algorithms can simultaneously discriminate against individuals at the intersection of multiple identity categories. The survey synthesizes emerging research on conceptualizing, measuring, and mitigating intersectional bias—discrimination that emerges uniquely from combinations of multiple sensitive attributes rather than from their independent effects. Drawing on Crenshaw's intersectionality theory from social science, the authors establish that intersectional fairness represents a necessary evolution beyond binary fairness frameworks, particularly urgent given high-stakes ML applications in criminal justice, lending, and hiring decisions where discriminatory outcomes have severe real-world consequences.

## Main Findings

The survey identifies three fundamental challenges in intersectional fairness research. First, the **granularity dilemma** questions at what level of intersectional subgroup specificity fairness guarantees should apply—balancing comprehensive protection against practical feasibility and computational constraints. Second, the **data sparsity problem** reveals that smaller intersectional subgroups generate higher measurement uncertainty, complicating fairness assessment and validation. Third, **technical inadequacy** demonstrates that traditional mitigation techniques designed for single-attribute fairness prove ineffective for intersectional contexts. A critical paradox emerges: algorithms can achieve fairness metrics for independent groups (women, Black people) while systematically disadvantaging intersectional subgroups (Black women). The authors emphasize that intersectional discrimination amplifies rather than simply combines constituent biases. Empirical evidence from Buolamwini and Gebru's gender classification study and NLP generative model evaluations confirms this phenomenon, demonstrating that intersectional bias is not theoretical but practically consequential in high-stakes domains.

## Methodology/Approach

The survey employs structured literature synthesis combining conceptual taxonomy development with theoretical grounding. The authors establish a three-category taxonomy: independent group fairness (single-attribute), intersectional group fairness (multiple-attribute combinations), and gerrymandering groups (unions of both categories). This taxonomy organizes existing approaches while clarifying conceptual distinctions essential for systematic analysis. The methodology integrates social science foundations—specifically intersectionality theory—with computer science technical approaches including subgroup fairness and multicalibration algorithms. By systematizing emerging technical solutions alongside philosophical frameworks, the survey bridges disciplinary perspectives and establishes that intersectional fairness requires integrated theoretical and practical innovation beyond existing single-attribute frameworks.

## Relevant Concepts

**Intersectionality**: Crenshaw's theory positing that multiple identity dimensions interact to produce unique discrimination experiences distinct from single-attribute effects.

**Independent Group Fairness**: Traditional fairness approaches treating demographic categories separately without considering their intersections.

**Intersectional Group Fairness**: Fairness guarantees applied to subgroups defined by combinations of multiple sensitive attributes.

**Gerrymandering Groups**: Union of independent and intersectional groups, representing comprehensive fairness coverage.

**Amplification Thesis**: The principle that intersectional identities generate amplified discrimination beyond additive combinations of constituent biases.

**Data Sparsity**: The statistical challenge where smaller intersectional subgroups contain fewer samples, increasing measurement uncertainty and validation difficulty.

**Subgroup Fairness**: Technical approach providing fairness guarantees across multiple intersectional subgroups simultaneously.

**Multicalibration**: Algorithmic technique for achieving fairness across diverse intersectional subgroups through iterative calibration.

## Significance

This survey establishes intersectional fairness as a distinct research subfield addressing practical inadequacies in current ML fairness frameworks. Its significance lies in legitimizing interdisciplinary approaches, demonstrating that algorithmic fairness requires social science theoretical foundations alongside technical solutions. By documenting real-world discriminatory outcomes in criminal justice, lending, and hiring systems and identifying specific technical challenges, the work provides researchers with concrete guidelines for future investigation. The survey's emphasis on high-stakes applications underscores urgency, particularly for vulnerable populations experiencing compounded discrimination. The identification of the fairness paradox—where independent fairness masks intersectional discrimination—challenges fundamental assumptions in ML ethics. Ultimately, it reframes ML fairness from a binary problem to a multidimensional challenge requiring novel conceptual frameworks and mitigation strategies that acknowledge complex identity intersections and their amplified discriminatory effects.
