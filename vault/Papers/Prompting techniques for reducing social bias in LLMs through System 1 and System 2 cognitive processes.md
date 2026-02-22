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

**Extrahierte Kategorien:** AI_Literacies, Generative_KI, Prompting, KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet, Fairness
**Argumente:** 3 extrahiert

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

> Siehe [[Divergenz Chisca_2024_Prompting_techniques_for_reducing_social_bias_in]] fuer detaillierte Analyse


## Key Concepts

- [[Intersectional Bias Analysis]]

## Wissensdokument

# Prompting Techniques for Reducing Social Bias in LLMs through System 1 and System 2 Cognitive Processes

## Kernbefund

Human Persona kombiniert mit System 2 Prompting reduziert stereotypische Urteile um bis zu 19%, während CoT-Prompting überraschenderweise dem System 1 ähnlicher ist als dem System 2, was die gängige Annahme in der Literatur widerlegt.

## Forschungsfrage

Wie können Prompting-Techniken, die auf der Dual-Process-Theorie basieren, zur Reduzierung sozialer Vorurteile in Large Language Models beitragen, und unterscheiden sich diese Effekte je nach Persona-Modellierung?

## Methodik

Empirisch: Vergleichende Analyse von 12 Prompting-Techniken (Standard, CoT, System 1/2, mit Human/Machine Personas) über 5 LLMs (GPT-4, GPT-3.5, Llama2, Mistral7B, Gemini) auf 9 Bias-Kategorien unter Verwendung von zwei Bias-Datensätzen (StereoSet und GenAssocBias). Messmetrik: Stereotypische Antwortrate. Statistische Analyse: Kendall's τ Korrelation.
**Datenbasis:** 5 LLMs getestet, 9 Bias-Kategorien (Ageismus, Beauty, Beauty-Profession, Geschlecht, Institution, Nationalität, Beruf, Rasse, Religion), 2 Bias-Datensätze (StereoSet mit intra-sentence subset, GenAssocBias mit 2.100 Einträge für GPT-4, vollständig für andere Modelle)

## Hauptargumente

- Dual-Process-Theory kann auf LLMs angewendet werden: Durch explizite Prompts für System 1 (schnell, emotional) und System 2 (langsam, überlegt) können LLMs unterschiedliche Grade von Stereotypisierung zeigen, was darauf hindeutet, dass sie menschliche Kognitionsmuster modellieren.
- Human Persona ist kritisch für Bias-Reduktion: Die Einführung von Human Persona mit System 2 Prompting führt zu substantiellen Bias-Reduktionen, während Machine Persona deutlich weniger effektiv ist, was nahelegt, dass LLMs ihr Modell menschlicher Kognitiver Prozesse aktivieren müssen.
- CoT-Prompting entspricht nicht System 2: Entgegen verbreiteter Annahmen zeigt die Korrelationsanalyse, dass CoT-Prompting dem Standard-Prompt und System 1 ähnlicher ist als System 2, was frühere Annahmen zur Cognitiven Mappierung von CoT hinterfragt.

## Kategorie-Evidenz

### Evidenz 1

Kritische Reflexion über Assumptions in der KI-Forschung: 'This contradicts often stated assumptions by researchers in the past (Hagendorff et al., 2023)' - ein Beispiel für Hinterfragung bestehenden Wissens.

### Evidenz 2

Fokus auf Large Language Models (GPT-4, GPT-3.5, Llama 2, Mistral 7B, Gemini): 'large language models (LLMs) like GPT-4, ChatGPT, Llama 2 have revolutionized many aspects of technology and society.'

### Evidenz 3

Zentral für die gesamte Studie: 'We compare zero-shot CoT, debiasing, and a variety of dual process theory-based prompting strategies' mit systematischer Analyse von 12 Prompting-Techniken und deren Variationen.

### Evidenz 4

NLP und Dual-Process-Theorie-Anwendung auf LLMs: 'NLP researchers often compare zero-shot prompting in LLMs to System 1 reasoning and chain-of-thought (CoT) prompting to System 2.'

### Evidenz 5

Expliziter Fokus auf neun Bias-Kategorien und strukturelle Vorurteile: 'LLMs continue to struggle with embedded social biases' und systematische Analyse von Ageismus, Schönheits-Bias, Rassen-Bias, Religions-Bias, etc.

### Evidenz 6

Gender-Bias ist eine von neun analysierten Kategorien mit spezifischen Resultaten: 'We see no consistent prompt setting that best reduces gender bias, but the best setting leads to consistent bias reductions.' Vergleich mit früheren Studien zu Gender-Bias.

### Evidenz 7

Abdeckung mehrerer marginalisierter Kategorien (Rasse, Religion, Nationalität, Institution) und intersektionale Dimensionen von Bias: 'Kamruzzaman et al.'s bias detection dataset covers age, beauty, institution, beauty in the profession, and nationality bias'.

### Evidenz 8

Algorithmische Fairness und faire LLM-Ausgaben sind Kernthema: 'This task of mitigating social biases in LLMs is paramount to ensuring fairness and inclusivity in AI-driven communication and decisions.' Fairness-Metriken durch Reduktion stereotypischer Antworten.

## Assessment-Relevanz

**Domain Fit:** Das Paper hat moderate Relevanz für die Schnittstelle KI/Soziale Arbeit: Während es sich auf technische Bias-Reduktion in LLMs konzentriert, sind die erkannten Bias-Kategorien (Ageismus, Nationalität, Institution) relevant für sozialarbeiterische Kontexte. Allerdings fehlt ein expliziter Bezug zu sozialarbeiterischer Praxis oder Ethik.

**Unique Contribution:** Die systematische Kombination von Dual-Process-Theory mit Persona-Modellierung zur Bias-Reduktion ist innovativ, besonders die kontra-intuitiven Befunde zur CoT-Prompting-System-2-Annahme durch Kendall τ-Korrelationen.

**Limitations:** Die Studie konzentriert sich primär auf englischsprachige Bias-Kategorien in englischen Datensätzen; die Generalisierbarkeit auf andere Sprachen und kulturelle Kontexte ist unklar. Zudem wird nicht untersucht, ob die Bias-Reduktion auch in realen sozialarbeiterischen Anwendungsszenarien nachweisbar ist.

**Target Group:** KI-Entwickler:innen, NLP-Forscher:innen, Prompter:innen, AI Ethics-Spezialisten, potenziell auch Sozialarbeiter:innen mit Interesse an Algorithmic Fairness; weniger direkt für praktische Sozialarbeiter:innen geeignet ohne Adaptation auf Praxiskontexte.

## Schlüsselreferenzen

- [[Wei_et_al_2022]] - Chain-of-Thought Prompting Elicits Reasoning in Large Language Models
- [[Nadeem_et_al_2020]] - StereoSet: Measuring Stereotypical Bias in Pretrained Language Models
- [[Hagendorff_et_al_2023]] - Human-like Intuitive Behavior and Reasoning Biases Emerged in Large Language Models but Disappeared in ChatGPT
- [[Kaneko_et_al_2024]] - Evaluating Gender Bias in Large Language Models via Chain-of-Thought Prompting
- [[Beck_et_al_2024]] - Sensitivity, Performance, Robustness: Deconstructing the Effect of Sociodemographic Prompting
- [[De_Araujo_Roth_2024]] - Helpful Assistant or Fruitful Facilitator? Investigating How Personas Affect Language Model Behavior
- [[Evans_Stanovich_2013]] - Dual-Process Theories of Higher Cognition: Advancing the Debate
- [[Furniturewala_et_al_2024]] - Thinking Fair and Slow: On the Efficacy of Structured Prompts for Debiasing Language Models
- [[Lin_et_al_2024]] - SwiftSage: A Generative Agent with Fast and Slow Thinking for Complex Interactive Tasks
- [[Nighojkar_2024]] - Beyond Binary: Advancing Natural Language Inference for Human-like Reasoning
