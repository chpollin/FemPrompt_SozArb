---
title: Dipper: Diversity in Prompts for Producing Large Language Model Outputs
authors:
  - G. K. R. Lau
year: 2023
type: conferencePaper
url: https://www.comp.nus.edu.sg/~greglau/assets/pdf/dipper_neurips_mint.pdf
tags:
  - paper
  - feminist-ai
  - bias-research
date_added: 2026-02-22
date_modified: 2026-02-22
---

# Dipper: Diversity in Prompts for Producing Large Language Model Outputs

## Abstract

Presents 'Dipper', an LLM prompting ensemble framework that systematically deploys a diverse set of prompts in parallel to improve the breadth of generated perspectives, including those of minority or marginalized groups. This training-free technique enhances demographic and perspective diversity without performance degradation.

## Key Concepts

## Full Text

---
title: "Dipper: Diversity in Prompts for Producing Large Language Model Ensembles in Reasoning Tasks"
authors: ["Gregory Kang Ruey Lau", "Wenyang Hu", "Diwen Liu", "Jizhuo Chen", "See-Kiong Ng", "Bryan Kian Hsiang Low"]
year: 2023
type: conferencePaper
language: en
processed: 2026-02-05
source_file: Lau_2023_Dipper_Diversity_in_Prompts_for_Producing_Large.md
confidence: 75
---

# Dipper: Diversity in Prompts for Producing Large Language Model Ensembles in Reasoning Tasks

## Kernbefund

Ein Ensemble aus drei kleinen Modellen (Qwen2-MATH-1.5B) mit optimierten, diversen Prompts kann die Leistung eines größeren Modells (Qwen2-MATH-7B) erreichen oder übertreffen, mit etwa 10%-Punkt Accuracy-Verbesserung gegenüber dem einzelnen Modell.

## Forschungsfrage

Wie kann man durch Diversity in Prompts ein leistungsfähiges LLM-Ensemble zur Laufzeit erzeugen, um die Reasoning-Fähigkeiten kleinerer Modelle zu verbessern?

## Methodik

Empirisch: Entwicklung eines trainingsfreien Ensemble-Frameworks (DIPPER) mit Prompt-Generator, Prompt-Selector (basierend auf semantischer Volumenoptimierung) und Response-Aggregator, evaluiert auf MATH, GSM8K und MMLU-STEM Datensätzen.
**Datenbasis:** Experimentelle Evaluierung auf MATH (500 Samples davon 480 Test-Samples), GSM8K und MMLU-STEM mit 20-Sample Validierungssets

## Hauptargumente

- Prompt-Diversity in LLM-Ensembles ist eine effektive Alternative zu Heterogeneity zwischen verschiedenen Modelltypen, da sie auf einer einzelnen Modellinstanz implementierbar ist und beliebig skalierbar.
- Die Optimierung von Prompt-Ensembles kann als Submodular-Maximierungsproblem formuliert werden, wobei Fidelity (Validierungsgenauigkeit) und Semantic Diversity (Volumen im Embedding-Raum) kombiniert werden.
- LLM-basierte Aggregation (LLMA) übertrifft Mehrheitsabstimmung bei der Ensemble-Aggregation, da sie das Reasoning-Output berücksichtigen kann, was bei Disaggreements zu 92% Korrektheit führt versus 8% bei Majority Voting.

## Kategorie-Evidenz

### Evidenz 1

Fokus auf Large Language Models (LLMs) wie Qwen2-MATH und GPT-4o für Reasoning-Tasks; 'we propose DIPPER, a novel, training-free LLM ensemble framework where a single LLM model type is fed an optimized, diverse set of reasoning prompts in parallel'

### Evidenz 2

Zentrale Komponente ist Prompt-Engineering: 'Drawing inspiration from how using different prompts w would result in varying response distributions...our DIPPER framework has the set of prompts {w_i} fed into the ensemble as the key ensemble design parameter'; Treatment von prompt fidelity und diversity metrics

### Evidenz 3

Ensemble Methods und Inferenzzeit-Optimierungen für Machine Learning; Submodular optimization; Batch inference techniques wie vLLM

### Evidenz 4

Zentrale Fokus auf Diversity in Prompts und deren Optimierung: 'a key challenge in achieving high performing ensembles is how diversity can be appropriately injected among its constituents'; semantic volume metric als Diversitätsmessung; 'more diverse prompts point to more varied directions in semantic space'

## Assessment-Relevanz

**Domain Fit:** Das Paper hat keinen direkten Bezug zu Sozialer Arbeit, Gender Studies oder kritischen Perspektiven auf KI-Gerechtigkeit. Es ist rein technisch orientiert auf Optimierung von LLM-Ensembles für Reasoning-Tasks. Die Thematisierung von 'Diversity' bezieht sich ausschließlich auf technische Prompt-Diversität, nicht auf gesellschaftliche Repräsentation oder Fairness.

**Unique Contribution:** Erste systematische Untersuchung homogener LLM-Ensembles, die Diversity ausschließlich durch Prompt-Variation injizieren, mit theoriegeleiteter Submodular-Optimierung basierend auf semantischer Volumenmaximierung.

**Limitations:** Evaluierung beschränkt auf mathematische Reasoning-Tasks (MATH, GSM8K, MMLU-STEM); keine Untersuchung auf anderen Task-Typen; keine Analyse möglicher negativer Auswirkungen oder ethischer Implikationen der Ensemble-Methode; keine Diskussion von Fairness oder Bias.

**Target Group:** KI-Entwickler, NLP-Forscher, Praktiker im Bereich Large Language Models, die Inferenzzeit-Optimierungen suchen; Entwickler mit Ressourcenbeschränkungen; nicht relevant für Sozialarbeiter, Policymaker oder kritische KI-Perspektiven

## Schlüsselreferenzen

- [[Wei_et_al_2023]] - Chain-of-Thought Prompting Elicits Reasoning in Large Language Models
- [[Yao_et_al_2023]] - Tree of Thoughts: Deliberate Problem Solving with Large Language Models
- [[Shinn_et_al_2024]] - Reflexion: Language agents with verbal reinforcement learning
- [[Wang_et_al_2023]] - Self-Consistency Improves Chain of Thought Reasoning in Language Models
- [[Kojima_et_al_2023]] - Large Language Models are Zero-Shot Reasoners
- [[Kwon_et_al_2023]] - Efficient memory management for large language model serving with pagedattention
- [[Hendrycks_et_al_2021]] - Measuring mathematical problem solving with the MATH dataset
- [[Nemhauser_et_al_1978]] - An analysis of approximations for maximizing submodular set functions
