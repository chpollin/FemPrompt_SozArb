---
title: Prompting techniques for reducing social bias in LLMs through System 1 and System 2 cognitive processes
authors:
  - M. Kamruzzaman
  - G. L. Kim
year: 2024
type: report
doi: 
url: "https://arxiv.org/html/2404.17218v1"
tags:
  - paper
llm_decision: Include
llm_confidence: 0.92
llm_categories:
  - Generative_KI
  - Prompting
  - Bias_Ungleichheit
  - Fairness
human_decision: Exclude
human_categories:
  - Generative_KI
  - Prompting
  - Bias_Ungleichheit
  - Gender
  - Fairness
agreement: disagree
---

# Prompting techniques for reducing social bias in LLMs through System 1 and System 2 cognitive processes

## Transformation Trail

### Stufe 1: Extraktion & Klassifikation (LLM)

**Extrahierte Kategorien:** Generative_KI, Prompting, KI_Sonstige, Bias_Ungleichheit, Diversitaet, Fairness
**Argumente:** 3 extrahiert

### Stufe 3: Verifikation (LLM)

| Metrik | Score |
|--------|-------|
| Completeness | 92 |
| Correctness | 98 |
| Category Validation | 95 |
| **Overall Confidence** | **94** |

### Stufe 4: Assessment

**LLM:** Include (Confidence: 0.92)
**Human:** Exclude

**Kategorie-Vergleich (bei Divergenz):**

| Kategorie | Human | LLM | Divergent |
|-----------|-------|-----|----------|
| AI_Literacies | Nein | Nein |  |
| Generative_KI | Ja | Ja |  |
| Prompting | Ja | Ja |  |
| KI_Sonstige | Nein | Nein |  |
| Soziale_Arbeit | Nein | Nein |  |
| Bias_Ungleichheit | Ja | Ja |  |
| Gender | Ja | Nein | X |
| Diversitaet | Nein | Nein |  |
| Feministisch | Nein | Nein |  |
| Fairness | Ja | Ja |  |

> Siehe [[Divergenz Kamruzzaman_2024_Prompting_techniques_for_reducing_social_bias_in]] fuer detaillierte Analyse


## Key Concepts

- [[Chain-of-Thought Prompting Limitations]]

## Wissensdokument

# Prompting Techniques for Reducing Social Bias in LLMs through System 1 and System 2 Cognitive Processes

## Kernbefund

Human Persona kombiniert mit System 2 Prompting reduziert stereotypische Urteile von LLMs am effektivsten (bis zu 13% Reduktion), während CoT-Prompting entgegen bisheriger Annahmen nicht dem System 2 Denken entspricht, sondern dem System 1 ähnlicher ist.

## Forschungsfrage

Können auf Dual-Process-Theorie basierende Prompting-Strategien soziale Biases in Large Language Models effektiver reduzieren als Standard-Prompting oder Chain-of-Thought-Methoden?

## Methodik

Empirisch: Vergleichende Analyse von 12 verschiedenen Prompting-Techniken (Standard, CoT, System 1, System 2, mit Human/Machine Personas) über zwei Bias-Datensätze (StereoSet und GenAssocBias) mit fünf LLMs (GPT-4, GPT-3.5, Llama-2-7B, Mistral7B, Gemini). Messung von Stereotyp-Response-Raten über 9 Bias-Kategorien. Statistische Analyse mittels Kendall τ Korrelation.
**Datenbasis:** StereoSet Dataset (intrasentence subset) + GenAssocBias Dataset mit Abdeckung von 9 Bias-Kategorien (Ageismus, Beauty, Beauty in Profession, Gender, Institutional, Nationality, Profession, Race, Religion) über 5 LLMs; GPT-4 getestet auf 2.100 Beispiele, andere Modelle auf vollständigen Datasets

## Hauptargumente

- Dual-Process-Theorie (System 1: schnell, emotional, vorurteilsbelastet; System 2: langsam, deliberativ, zuverlässig) kann auf LLMs angewendet werden, um durch explizite kognitiv-psychologische Prompts soziale Biases zu reduzieren.
- Die Kombination von Human Persona mit System 2 Prompting amplifiziert den Bias-Reduktions-Effekt stärker als Machine Persona, was darauf hindeutet, dass LLMs ein modelliertes Verständnis menschlicher Kognition haben, das über bloße System-interne Mechanismen hinausgeht.
- CoT-Prompting zeigt keine konsistente Bias-Reduktion und korreliert statistisch stärker mit System 1 als mit System 2 Prompting, was die bisherige Annahme widerlegt, dass CoT-Prompting System 2 Reasoning entspricht; die Persona-Zuweisung (Human vs. Machine generisch) reduziert Biases durch Self-Distancing-Effekt ähnlich Solomons Paradox bei Menschen.

## Kategorie-Evidenz

### Evidenz 1

Fokus auf Large Language Models (GPT-4, GPT-3.5, Llama 2, Mistral7B, Gemini) und deren Bias-Eigenschaften: 'These models display remarkable linguistic capabilities, crafting responses that not only mimic human language'

### Evidenz 2

Zentrale Methode: 'We use 12 different types of prompting techniques in our paper including the combinations of CoT, System 1, System 2, and Persona' mit detaillierten Prompt-Engineering-Strategien und Zero-Shot-Varianten

### Evidenz 3

NLP-Techniken und Dual-Process-Theorie aus kognitiver Psychologie: 'NLP researchers often compare zero-shot prompting in LLMs to System 1 reasoning and chain-of-thought (CoT) prompting to System 2'

### Evidenz 4

Expliziter Fokus auf soziale Biases: 'LLMs continue to struggle with embedded social biases. These biases show up in different ways, including stereotyping and biased answers' über 9 Bias-Kategorien einschließlich Rassismus, Gender, Religion, Nationalität

### Evidenz 5

Untersuchung von 9 verschiedenen Bias-Kategorien (Ageism, Beauty, Gender, Race, Religion, Nationality, Profession, etc.) repräsentiert multiple marginalisierte Gruppen und intersektionale Aspekte

### Evidenz 6

Fokus auf Bias-Reduktion und faire LLM-Outputs: 'This task of mitigating social biases in LLMs is paramount to ensuring fairness and inclusivity in AI-driven communication and decisions'

## Assessment-Relevanz

**Domain Fit:** Das Paper hat begrenzte direkte Relevanz für Soziale Arbeit, ist aber hochrelevant für die Schnittstelle KI und Fairness/Bias-Reduktion. Es bietet praktische Prompting-Techniken zur Reduktion von sozialen Biases in KI-Systemen, die in Anwendungsfeldern der Sozialen Arbeit (z.B. Risikobewertung, Ressourcenallokation) zum Einsatz kommen könnten.

**Unique Contribution:** Die Studie widerlegt die bisherige Annahme, dass CoT-Prompting System 2 Reasoning modelliert, und zeigt empirisch, dass Human Persona + System 2 Kombination die effektivste Strategie zur Bias-Reduktion ist, mit statistischen Korrelationsanalysen.

**Limitations:** Begrenzte Analyse auf englischsprachige Datasets; GPT-4 nur auf reduzierter Sample getestet (2.100 vs. vollständige Datasets); keine theoretische Erklärung für das Nicht-Funktionieren von CoT bei sozialen Biases; keine Untersuchung von Langzeit-Effekten oder User-Compliance.

**Target Group:** NLP-Forscher, KI-Entwickler und Ingenieure, Fairness-und-Bias-Spezialist:innen, Policymaker in AI-Governance, Ethiker:innen im KI-Bereich, Sozialwissenschaftler:innen die mit KI-Systemen arbeiten

## Schlüsselreferenzen

- [[Wei_et_al_2022]] - Chain-of-Thought Prompting Elicits Reasoning in Large Language Models
- [[Nadeem_et_al_2020]] - StereoSet: Measuring Stereotypical Bias in Pretrained Language Models
- [[Kaneko_et_al_2024]] - Evaluating Gender Bias in Large Language Models via Chain-of-Thought Prompting
- [[Hagendorff_et_al_2023]] - Human-like Intuitive Behavior and Reasoning Biases Emerged in Large Language Models but Disappeared in ChatGPT
- [[Gupta_et_al_2023]] - Bias Runs Deep: Implicit Reasoning Biases in Persona-Assigned LLMs
- [[Deshpande_et_al_2023]] - Toxicity in ChatGPT: Analyzing Persona-Assigned Language Models
- [[Evans_Stanovich_2013]] - Dual-Process Theories of Higher Cognition: Advancing the Debate
- [[Grossmann_Kross_2014]] - Exploring Solomon's Paradox: Self-Distancing Eliminates the Self-Other Asymmetry in Wise Reasoning
- [[Kamruzzaman_et_al_2023]] - Investigating Subtler Biases in LLMs: Ageism, Beauty, Institutional, and Nationality Bias
