---
title: "UN Women 2024 Artificial"
original_document: UN_Women_2024_Artificial.md
document_type: Research Paper
research_domain: Generative AI
methodology: Theoretical, Comparative Analysis
keywords: LLM scaling, data scarcity, neural scaling laws, synthetic data, training datasets
mini_abstract: "This paper forecasts when large language models will exhaust available public human-generated text data, projecting exhaustion between 2026-2032, and explores mitigation strategies including synthetic data generation and transfer learning to sustain AI progress beyond this constraint."
target_audience: Researchers, Policymakers, Industry
key_contributions: "Quantifies data scarcity timeline for LLM scaling and proposes solutions"
geographic_focus: Global
publication_year: Unknown
related_fields: Machine Learning, Natural Language Processing, AI Policy
summary_date: 2025-11-07
language: English
ai_model: claude-haiku-4-5
---

# Summary: UN Women 2024 Artificial

## Overview

This peer-reviewed paper by researchers at Epoch AI (with affiliations at University of Aberdeen, MIT CSAIL, Centre for the Governance of AI, and University of Tübingen) investigates a fundamental constraint facing artificial intelligence development: the potential exhaustion of publicly available human-generated text data for training large language models. The research addresses whether current LLM scaling trajectories can be sustained given finite data resources, or whether the field will encounter a critical bottleneck within this decade. By combining quantitative forecasting with analysis of existing datasets (RefinedWeb, C4, RedPajama) and established neural scaling laws, the authors provide both a timeline for data exhaustion and potential mitigation strategies. The work is significant because it bridges theoretical AI research with practical resource limitations, informing both technical development strategies and policy discussions around AI governance.

## Main Findings

The paper's central quantitative finding projects that the effective stock of publicly indexed human text—approximately 4×10¹⁴ tokens—will be fully utilized around 2028 under baseline assumptions, with a plausible range between 2026-2032 depending on model overtraining practices. This exhaustion point corresponds to approximately 5×10²⁸ FLOP of training compute for non-overtrained models; overtraining scenarios could accelerate exhaustion by several years. The research demonstrates that current LLM development trajectories, when plotted against available data supply, intersect at this median year (2028), indicating that scaling according to established neural scaling laws (Kaplan et al., 2020; Hoffmann et al., 2022) cannot continue indefinitely using only public human-generated text. However, the authors argue this constraint is not absolute; they identify three primary mitigation pathways: synthetic data generation (creating artificial training data through computational methods), transfer learning from data-rich specialized domains (leveraging domain-specific corpora), and improvements in data efficiency (achieving better performance with less data through algorithmic innovation). This dual finding—acknowledging real constraints while proposing solutions—positions the work as neither apocalyptic nor dismissive of genuine challenges.

## Methodology/Approach

The research employs a sophisticated dual-sided forecasting model integrating supply and demand analysis. The demand-side analysis projects future training dataset requirements by extrapolating observed LLM development patterns and applying established neural scaling laws, which mathematically relate model performance improvements to dataset expansion. The supply-side analysis quantifies the total stock of indexed public human text (data accessible through web indexing and curated corpora) by synthesizing historical internet growth data (Coffman & Odlyzko, 1998; Reinsel et al., 2018) with contemporary large-scale datasets. The methodology incorporates scenario analysis, including overtraining scenarios (training beyond theoretical optima) that could accelerate data exhaustion. Figure 1 provides visual synthesis, plotting projected dataset sizes against available stock to identify intersection points. This approach integrates historical data growth patterns with current AI development practices, creating a coherent forecasting framework suitable for policy and research planning.

## Relevant Concepts

**Neural Scaling Laws**: Mathematical relationships describing how model performance improves with increased training data, model size, and compute—fundamental to modern LLM development strategy and efficiency optimization.

**Effective Stock of Text**: The quantifiable amount of indexed, publicly available human-generated text suitable for LLM training, estimated at approximately 4×10¹⁴ tokens, derived from web pages and curated corpora.

**Data Exhaustion**: The projected point (circa 2028) at which demand for training data exceeds available supply under current development paradigms and scaling law assumptions.

**Synthetic Data Generation**: Creating artificial training data through computational methods to supplement or replace human-generated text, enabling continued scaling beyond natural data limits.

**Transfer Learning from Data-Rich Domains**: Leveraging specialized, high-quality datasets from specific fields (scientific literature, technical documentation) to improve model performance with limited general-purpose data.

**Data Efficiency Improvements**: Algorithmic and architectural innovations enabling models to achieve equivalent performance using smaller training datasets.

## Significance

This work significantly impacts AI development strategy, resource allocation decisions, and policy frameworks. It provides concrete timelines for addressing data constraints, enabling proactive research into alternative scaling methods before exhaustion occurs. The paper bridges technical AI research with governance implications, suggesting that resource scarcity—while real—may catalyze innovation rather than halt progress. By identifying specific, implementable mitigation strategies and quantifying uncertainty ranges (2026-2032), it reframes the data constraint as a solvable challenge requiring strategic planning. The research informs both industry development priorities and policy discussions around AI safety, resource governance, and the sustainability of current scaling paradigms.
