---
title: "A Survey on Fairness in Large Language Models"
authors: ["Yingji Li", "Mengnan Du", "Rui Song", "Xin Wang", "Ying Wang"]
year: 2024
type: conferencePaper
language: en
categories:
  - AI_Literacies
  - Generative_KI
  - Prompting
  - KI_Sonstige
  - Bias_Ungleichheit
  - Gender
  - Diversitaet
  - Fairness
processed: 2026-02-05
source_file: Wang_2024_A_survey_on_fairness_in_large_language_models.md
confidence: 88
---

# A Survey on Fairness in Large Language Models

## Kernbefund

Der Survey zeigt, dass Fairness-Forschung in LLMs je nach Modellgröße und Trainingsparadigma unterschiedliche Ansätze erfordert: Medium-sized LLMs benötigen intrinsische und extrinsische Debiasing-Methoden, während Large-sized LLMs im Prompting-Paradigma neue Evaluations- und Debiasing-Strategien brauchen.

## Forschungsfrage

Wie können Bias und Fairness in Large Language Models verschiedener Größen und Trainingsparadigmen systematisch evaluiert und adressiert werden?

## Methodik

Review/Survey - systematische Literaturanalyse und Klassifizierung von Forschung zu Fairness in LLMs, organisiert nach Modellgröße und Trainingsparadigma (Pre-training/Fine-tuning vs. Prompting)
**Datenbasis:** Literaturbasiert - keine primäre Datenerhebung; umfangreiche Referenzliste mit Arbeiten zu Bias-Evaluierung und Debiasing in LLMs

## Hauptargumente

- LLMs erfassen gesellschaftliche Vorurteile aus unkurierten Trainingsdaten und propagieren diese in nachgelagerte Aufgaben, was diskriminierende Entscheidungen gegen marginalisierte Gruppen zur Folge hat (z.B. geschlechtsspezifische Verzerrungen bei Lebenslauf-Filterung, rassistische Bias in medizinischen Systemen).
- Die Unterscheidung zwischen intrinsischen Bias (in den Representationen des Pre-trained Models) und extrinsischen Bias (in downstream-Task-Outputs) ist zentral für die Entwicklung differenzierter Evaluations- und Debiasing-Methoden in Medium-sized LLMs.
- Große LLMs im Prompting-Paradigma zeigen unterschiedliche Bias-Manifestationen als Medium-sized Modelle und erfordern neue Evaluationsstrategien (z.B. demographische Repräsentation, stereotype Assoziationen, counterfactual fairness, Performance Disparities), um ihre Fairness zu bewerten.

## Kategorie-Evidenz

### AI_Literacies

Der Survey bietet umfassendes Wissen und technisches Verständnis für die Bewertung und Mitigation von Bias in LLMs: 'we provide a comprehensive review of related research on fairness in LLMs'

### Generative_KI

Fokus auf Large Language Models wie BERT, GPT-3, GPT-4, LLaMA, ChatGPT und deren Bias-Probleme: 'Large Language Models (LLMs), such as BERT, GPT-3, and LLaMA, have shown powerful performance'

### Prompting

Ausführliche Behandlung des Prompting-Paradigmas und Prompt-basierter Evaluationsmethoden: 'the prompting paradigm replaces the pre-training and fine-tuning paradigm as a more suitable learning strategy for large models'

### KI_Sonstige

Behandlung von NLP, Pre-trained Language Models, und klassischen ML-Bias-Konzepten: 'Social bias in language models can be defined as the assumption by the model that a person has a certain characteristic'

### Bias_Ungleichheit

Zentrale Thematisierung von Diskriminierung und algorithmischem Bias: 'Unfair LLM systems make discriminatory, stereotypic and demeaning decisions against vulnerable or marginalized demographics, causing undesirable social impacts and potential harms'

### Gender

Explizite Behandlung von Geschlechter-Bias in LLMs mit konkreten Beispielen: 'GPT-3 is found to associate males with higher levels of education and greater occupational competence' und 'automatic resume filtering systems can be gender-biased, which tend to assign programmer jobs to men and homemaker jobs to women'

### Diversitaet

Behandlung marginalisierter Gruppen und ihrer Repräsentation: 'gender, race, religion, age, sexuality, country, disease' als social sensitive topics und Analyse von Bias gegen verschiedene demografische Gruppen

### Fairness

Kernfokus des gesamten Surveys auf algorithmische Fairness, Fairness-Metriken und Debiasing-Methoden: 'The key to fairness in NLP is the presence of social biases in language models' sowie Behandlung von Metriken wie Statistical Parity, Equal Opportunity, Equalized Odds

## Assessment-Relevanz

**Domain Fit:** Das Paper ist hochrelevant für die Schnittstelle KI und Ungleichheit, insbesondere hinsichtlich struktureller Diskriminierung durch algorithmische Systeme. Es bietet however wenig direkten Bezug zu Sozialer Arbeit als Praxis oder zu konkreten Anwendungen in sozialarbeiterischen Kontexten.

**Unique Contribution:** Der Survey bietet eine neuartige, differenzierte Klassifizierung von Fairness-Forschung basierend auf Modellgröße und Trainingsparadigma, was eine präzisere und strukturiertere Übersicht bietet als bisherige breitere Surveys zu Fairness in KI.

**Limitations:** Der Survey ist stark technisch-algorithmisch ausgerichtet und adressiert wenig sozialwissenschaftliche oder normativ-philosophische Dimensionen von Fairness; zudem wird die fehlende explizite feministische Perspektive trotz Gender-Fokus nicht reflektiert.

**Target Group:** KI-Entwickler, NLP-Forscher, Informatiker, Data Scientists, Fairness-Spezialisten, Policymaker im Bereich KI-Regulierung, sowie Fachkräfte in High-Stakes-Anwendungen (Justiz, Healthcare, Finance) die mit LLMs arbeiten

## Schlüsselreferenzen

- [[Brown_et_al_2020]] - Language Models are Few-Shot Learners (GPT-3)
- [[Bolukbasi_et_al_2016]] - Man is to Computer Programmer as Woman is to Homemaker
- [[Abid_et_al_2021]] - Persistent anti-muslim bias in large language models
- [[Liang_et_al_2022]] - Holistic Evaluation of Language Models (HELM)
- [[Parrish_et_al_2021]] - Towards Debiasing Language Models at Scale
- [[Santy_et_al_2023]] - NLPositionality: Characterizing design biases of datasets and models
- [[Wang_et_al_2023]] - DecodingTrust: A comprehensive assessment of trustworthiness in GPT models
- [[Gallegos_et_al_2023]] - Bias and Fairness in Large Language Models (vorherige Survey)
- [[Ouyang_et_al_2022]] - Training language models to follow instructions with human feedback
- [[Ravfogel_et_al_2022]] - Linear Adversarial Concept Erasure
