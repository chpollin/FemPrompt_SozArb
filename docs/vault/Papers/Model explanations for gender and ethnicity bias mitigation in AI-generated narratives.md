---
title: Model explanations for gender and ethnicity bias mitigation in AI-generated narratives
authors:
  - A. Salecha
  - P. K. Srijith
year: 2025
type: thesis
url: https://pdxscholar.library.pdx.edu/cgi/viewcontent.cgi?article=7888&context=open_access_etds
tags:
  - paper
  - feminist-ai
  - bias-research
date_added: 2026-02-22
date_modified: 2026-02-22
bias_types:
  - Stereotypen
  - Stereotyping
  - Intersectional Accuracy
  - Intersectionality
mitigation_strategies:
  - Bias Mitigation
  - Debiasing
  - Intersectional Accuracy
---

# Model explanations for gender and ethnicity bias mitigation in AI-generated narratives

## Key Concepts

### Bias Types
- [[Intersectional Accuracy]]
- [[Intersectionality]]
- [[Stereotypen]]
- [[Stereotyping]]

### Mitigation Strategies
- [[Bias Mitigation]]
- [[Debiasing]]
- [[Intersectional Accuracy]]

## Full Text

---
title: "Model Explanations for Gender and Ethnicity Bias Mitigation in AI-Generated Narratives"
authors: ["Martha Otisi Dimgba"]
year: 2025
type: thesis
language: en
processed: 2026-02-05
source_file: Salecha_2025_Model_explanations_for_gender_and_ethnicity_bias.md
confidence: 91
---

# Model Explanations for Gender and Ethnicity Bias Mitigation in AI-Generated Narratives

## Kernbefund

Die Integration von modellgenerierten Erklärungen in Prompts reduziert Bias um 2%-20% und verbessert die demografische Repräsentation signifikant. Alle drei Modelle zeigen konsistente Muster bei den Stereotypen-Erklärungen, die auf zugrundeliegende Bias-Strukturen hinweisen.

## Forschungsfrage

Wie können modellgenerierte Erklärungen zur Mitigation von Gender- und Ethnizitätsbias in von LLMs generierten Narrativen eingesetzt werden?

## Methodik

Empirisch: Vergleichende Analyse von drei LLMs (Llama 3.1 70B Instruct, Claude 3.5 Sonnet, GPT-4.0 Turbo) mit quantitativen Metriken (TVD, DPR) und qualitativer Story-Analyse über 25 Berufsfelder; iteratives prompt-basiertes Experiment mit modellgenerierten Erklärungen als Interventionen
**Datenbasis:** 5.400 generierte Stories (1.800 pro Modell) über 25 Berufsfelder; 500 Stories wurden von 3 unabhängigen Evaluatoren qualitativ analysiert; modellgenerierte Erklärungen wurden kondensiert und annotiert

## Hauptargumente

- LLMs perpetuieren trainingsdaten-induzierte Biases in narrativen Inhalten, insbesondere bei Gender und Ethnizität, was substantielle Harms für unterrepräsentierte Gruppen verursacht.
- Modellgenerierte Erklärungen können als Feedback-Mechanismus für iterative Bias-Mitigation genutzt werden und ermöglichen Transparenz über die Reasoning-Prozesse der Modelle bezüglich demografischer Entscheidungen.
- Ein zwei-schritt-prompt-Ansatz, der Modell-Erklärungen integriert, ist effektiver als einfache Vanilla-Prompts, ohne dabei die narrative Qualität (Kohärenz, Kreativität) zu beeinträchtigen.

## Kategorie-Evidenz

### Evidenz 1

Fokus auf drei LLMs: Llama 3.1 70B Instruct, Claude 3.5 Sonnet, GPT-4.0 Turbo; Analyse von KI-generierten narrativen Inhalten und deren bias-Charakteristiken.

### Evidenz 2

Zentral: Prompt-Engineering-Ansatz mit iterativen Prompts; drei-stufige Prompting-Strategie (Vanilla → Baseline → BAME mit Erklärungen); zwei-schritt-Ansatz mit Buffer-Statement wie 'Before you start, let me provide additional information'.

### Evidenz 3

Einsatz von Explainable AI (XAI) Prinzipien; TVD und DPR als quantitative Bias-Metriken; modellgenerierte Explanations als Interventionsmechanismus.

### Evidenz 4

Explicit focus: 'their outputs often amplify the biases present in their training data, perpetuating stereotypes and reinforcing societal inequities, particularly regarding gender and ethnicity'; Analyse von Unterrepräsentation in Narrativen.

### Evidenz 5

Explicit gender-bias analysis: 'Gender and Ethnicity Bias Mitigation'; gender-representation Analyse über 25 Berufsfelder; Geschlechterstereotype in Berufsfeldern (z.B. weibliche Überrepräsentation in Food Preparation).

### Evidenz 6

BAME dataset konzentriert sich auf demografische Diversität; Analyse von Ethnicity-Repräsentation (European, African, API, Hispanic/Latino); intersektionale Perspektive auf gender-within-ethnicity.

### Evidenz 7

Einsatz von Fairness-Metriken: Demographic Parity Ratio (DPR) und Total Variation Distance (TVD); Target-Distribution mit 25% für jede ethnische Gruppe; 0.15-Threshold für TVD-basierte Bias-Annotation als 'meaningful cutoff for bias quantification'.

## Assessment-Relevanz

**Domain Fit:** Hochrelevant für KI-Fairness und ethische KI-Entwicklung; begrenzte direkte Relevanz für Soziale Arbeit, aber wichtig für Verständnis von Bias in Systemen, die in sozialen Kontexten eingesetzt werden könnten. Fokus liegt primär auf technische Mitigation von Bias in Narrative-Generierung.

**Unique Contribution:** Innovativer Ansatz: Nutzung von modellgenerierten Erklärungen als iteratives Feedback-Loop für Bias-Mitigation; Schaffung des BAME-Datensatzes mit 5.400 Geschichten und expliziten Erklärungen; Demonstration, dass Explainability-fokussierte Interventionen Fairness-Metriken verbessern.

**Limitations:** Begrenztheit auf englischsprachige Inhalte und US-amerikanische Berufsklassifizierung; Training-Data-Analysen der Modelle nicht möglich due to unavailability; nur 500 Stories qualitativ analysiert; Threshold von 0.15 für TVD-Bias-Annotation erscheint arbiträr begründet.

**Target Group:** KI-Entwickler, Fairness-Forscher, Machine Learning Engineer, Explainable-AI-Experten, Organisationen die generative KI einsetzen; sekundär: Policy-Maker im Bereich ethischer KI, Algorithmic Accountability-Fachleute

## Schlüsselreferenzen

- [[Buolamwini_Gebru_2018]] - Gender Shades: Intersectional Accuracy Disparities in Commercial Gender Classification
- [[Bolukbasi_et_al_2016]] - Man is to Computer Programmer as Woman is to Homemaker? Debiasing Word Embeddings
- [[Suresh_Guttag_2021]] - A Framework for Understanding Sources of Harm throughout the Machine Learning Life Cycle
- [[Zhao_et_al_2023]] - Fairness and Explainability: Bridging the Gap Towards Fair Model Explanations
- [[Wang_et_al_2022]] - Towards Intersectionality in Machine Learning: Including More Identities, Handling Underrepresentation, and Performing Evaluation
- [[Sun_et_al_2019]] - Mitigating Gender Bias in Natural Language Processing: Literature Review
- [[Tao_et_al_2024]] - Cultural bias and cultural alignment of large language models
- [[Wan_et_al_2023]] - 'Kelly is a Warm Person, Joseph is a Role Model': Gender Biases in LLM-Generated Reference Letters
