---
title: A sociolinguistic approach to stereotype assessment in large language models
authors:
  - A. Klinge
  - K. Kjeldsen
year: 2024
type: conferencePaper
url: https://facctconference.org/static/docs/facct2025-206archivalpdfs/facct2025-final1618-acmpaginated.pdf
tags:
  - paper
  - feminist-ai
  - bias-research
date_added: 2026-02-22
date_modified: 2026-02-22
bias_types:
  - Stereotypstärke
  - Stereotyping
  - Stereotype
  - Stereotypical
  - Stereotypen
mitigation_strategies: []
llm_decision: Include
llm_confidence: 0.75
llm_categories:
  - Generative_KI
  - Bias_Ungleichheit
  - Gender
---

# A sociolinguistic approach to stereotype assessment in large language models

## Assessment

**LLM Decision:** Include (Confidence: 0.75)
**LLM Categories:** Generative_KI, Bias_Ungleichheit, Gender

## Key Concepts

### Bias Types
- [[Stereotype]]
- [[Stereotypen]]
- [[Stereotypical]]
- [[Stereotyping]]
- [[Stereotypstärke]]

## Full Text

---
title: "Detecting Linguistic Indicators for Stereotype Assessment with Large Language Models"
authors: ["Rebekka Görge", "Michael Mock", "Héctor Allende-Cid"]
year: 2025
type: conferencePaper
language: en
processed: 2026-02-05
source_file: Klinge_2024_A_sociolinguistic_approach_to_stereotype.md
confidence: 95
---

# Detecting Linguistic Indicators for Stereotype Assessment with Large Language Models

## Kernbefund

Linguistische Indikatoren aus dem SCSC-Framework ermöglichen eine objektive, interpretierbare und feingranulare Bewertung von Stereotypstärke. Größere Modelle (Llama-3.3-70B, GPT-4) zeigen bessere Performance, und mehr Few-Shot-Beispiele verbessern die Erkennung signifikant.

## Forschungsfrage

Wie können linguistische Indikatoren zur Erkennung und Quantifizierung von Stereotypen in Sprache durch Large Language Models systematisch erfasst werden?

## Methodik

Mixed: Theoretisch (Sociolinguistic SCSC-Framework) + Empirisch (In-Context Learning mit LLMs, Annotation von CrowS-Pairs Dataset, Scoring-Function basierend auf menschlichen Stereotype-Rankings)
**Datenbasis:** 143 manuell annotierte Sätze aus CrowS-Pairs Dataset; Validierung gegen menschliche Stereotype-Rankings von Liu (2024); Evaluation mit 5 LLMs (GPT-4, GPT-4-mini, Llama-3.3-70B, Llama-3.1-8B, Mixtral-8x7B)

## Hauptargumente

- Bestehende NLP-Ansätze zur Stereotype-Erkennung mangelt es an Verankerung in soziolinguistischer Theorie und objektiven, interpretierbaren Bewertungskriterien. Binäre Klassifikationen sind unzureichend für die Erfassung von Stereotype-Nuancen.
- Das SCSC-Framework (Social Category and Stereotype Communication) bietet linguistisch fundierte Indikatoren (Kategorialisierung, Generalisierungsform, Konnotation, Signalwörter), die die Stärke von Stereotypen objektiv messbar machen, ohne menschliche Annotationen vorauszusetzen.
- In-Context Learning mit LLMs ermöglicht automatisierte Erkennung linguistischer Stereotyp-Indikatoren mit hoher Genauigkeit (94-97% für Kategorienlabels bei Llama-3.3-70B/GPT-4) und liefert interpretierbare Erklärungen, was Transparenz gegenüber bestehenden schwarz-box-Systemen erhöht.

## Kategorie-Evidenz

### Evidenz 1

Fokus auf Large Language Models (GPT-4, Llama-3.3-70B, Mixtral-8x7B) und deren Fähigkeit zur Stereotype-Erkennung: 'we integrate LLMs to automatically detect linguistic indicators by guiding them through the categorization scheme using an in-context learning approach'

### Evidenz 2

Einsatz von In-Context Learning und Few-Shot Prompting zur Instruktion der LLMs: 'use in-context learning to instruct LLMs to examine the linguistic properties of a sentence containing stereotypes' und 'The use of more few-shot examples significantly improves the performance'

### Evidenz 3

Breiter NLP-Fokus jenseits Generative-KI; Stereotype-Erkennung in Language Models, Fairness und Bias in NLP: 'Research on stereotyping in NLP is an integral part of the wider investigation of fairness and bias in AI'

### Evidenz 4

Zentrale Thematisierung von Stereotypen als Daten-Bias und Repräsentationsschaden in KI: 'Social categories and stereotypes embedded in language can introduce data bias into the training of Large Language Models (LLMs)' und 'Encoded in human language, also large language models trained on massive amount of aggregated and crawled text data are learning, reproducing and disseminating stereotypes'

### Evidenz 5

Analyse von Stereotypen über mehrere soziale Kategorien (Race/Color, Gender, Ethnizität): 'the SCSC's framework's linguistic theory is English-specific' und Evaluierung über CrowS-Pairs mit verschiedenen sozialen Kategorien; Anerkennung von Repräsentationsunterschieden: 'we recognize that these stereotypes are not representative of all cultures'

### Evidenz 6

Expliziter Fairness-Fokus als Forschungsgebiet und Ziel: 'Research on stereotyping in NLP is an integral part of the wider investigation of fairness and bias in AI'; Entwicklung fairer Bewertungsmethoden für Stereotype: 'To mitigate representational harm, state-of-the-art (SOTA) LLMs are equipped with guardrails to prevent stereotypical output'

## Assessment-Relevanz

**Domain Fit:** Das Paper ist hochrelevant für die Schnittstelle KI-Fairness und algorithmische Gerechtigkeit, hat aber nur indirekten Bezug zu Sozialer Arbeit. Es bietet technische Werkzeuge zur Stereotype-Erkennung, die in KI-Systemen relevant sind, die in sozialen Diensten eingesetzt werden könnten.

**Unique Contribution:** Erste Integration sociolinguistischer Theorie (SCSC-Framework) mit Large Language Models zur objektiven, interpretierbaren und quantifizierbaren Bewertung von Stereotype-Stärke statt binärer Klassifikation; Novel Scoring-Funktion basierend auf empirischer Validierung mit menschlichen Rankings.

**Limitations:** Ansatz ist aktuell auf Englisch beschränkt; basiert nur auf öffentlich verfügbarem CrowS-Pairs Dataset; setzt voraus, dass Sätze bereits Stereotype enthalten (Stereotype-Erkennung noch nicht vollständig integriert); Evaluierung nur auf einzelnen Sätzen ohne Kontext; hohe Rechenkosten für große Datenmengen; Ergebnisse ohne mehrfache Runs validiert (budgetbedingt).

**Target Group:** NLP-Forscher, KI-Entwickler und Fairness-Spezialisten; Mitarbeiter in der KI-Sicherheit und Bias-Mitigation; Policymaker im Bereich Fairness und Governance von KI-Systemen; Wissenschaftler in Computerlinguistik und angewandter Linguistik. Sekundär: Sozialarbeiter und Organisationen, die mit automatisierten Entscheidungssystemen arbeiten.

## Schlüsselreferenzen

- [[Beukeboom_Burgers_2019]] - Social Categories and Stereotypes Communication (SCSC) Framework
- [[Liu_2024]] - Quantifying Stereotypes in Language
- [[Blodgett_et_al_2020]] - Language Technology is Power: Critical Survey on Bias in NLP
- [[Nangia_et_al_2020]] - CrowS-Pairs: Challenge Dataset for Measuring Social Biases
- [[Nadeem_et_al_2021]] - StereoSet: Measuring Stereotypical Bias in Language Models
- [[Sap_et_al_2020]] - Social Bias Frames: Reasoning about Social and Power Implications
- [[Hovy_Prabhumoye_2021]] - Five Sources of Bias in Natural Language Processing
- [[Navigli_et_al_2023]] - Biases in Large Language Models: Origins, Inventory, Discussion
- [[Gallegos_et_al_2024]] - Bias and Fairness in Large Language Models: A Survey
