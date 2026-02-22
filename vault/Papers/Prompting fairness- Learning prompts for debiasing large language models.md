---
title: Prompting fairness: Learning prompts for debiasing large language models
authors:
  - A.-V. Chisca
  - A.-C. Rad
  - C. Lemnaru
year: 2024
type: conferencePaper
url: https://aclanthology.org/2024.ltedi-1.6/
tags:
  - paper
  - feminist-ai
  - bias-research
date_added: 2026-02-22
date_modified: 2026-02-22
bias_types:
  - Discrimination
  - Stereotyping
  - Stereotype
  - Stereotypical
  - Stereotypen
mitigation_strategies:
  - Debiasing
  - Fine-tuning
  - Counterfactual Data
llm_decision: Exclude
llm_confidence: 0.92
llm_categories:
  - Prompting
  - KI_Sonstige
  - Bias_Ungleichheit
  - Fairness
---

# Prompting fairness: Learning prompts for debiasing large language models

## Abstract

Introduces novel prompt-tuning method for reducing biases in encoder models like BERT and RoBERTa through training small sets of additional reusable token embeddings. Demonstrates state-of-the-art performance while maintaining minimal impact on language modeling capabilities through parameter-efficient approach applicable across different models and tasks.

## Assessment

**LLM Decision:** Exclude (Confidence: 0.92)
**LLM Categories:** Prompting, KI_Sonstige, Bias_Ungleichheit, Fairness

## Key Concepts

### Bias Types
- [[Discrimination]]
- [[Stereotype]]
- [[Stereotypen]]
- [[Stereotypical]]
- [[Stereotyping]]

### Mitigation Strategies
- [[Counterfactual Data]]
- [[Debiasing]]
- [[Fine-tuning]]

## Full Text

---
title: "Prompting Fairness: Learning Prompts for Debiasing Large Language Models"
authors: ["Andrei-Victor Chisca", "Camelia Lemnaru", "Andrei-Cristian Rad"]
year: 2024
type: conferencePaper
language: en
processed: 2026-02-05
source_file: Chisca_2024_Prompting_fairness_Learning_prompts_for_debiasing.md
confidence: 75
---

# Prompting Fairness: Learning Prompts for Debiasing Large Language Models

## Kernbefund

Die vorgeschlagene Prompt-Tuning-Methode erreicht state-of-the-art Debiasing-Performance bei BERT und konkurrenzfähige Ergebnisse bei RoBERTa, während sie eine minimale Auswirkung auf die Sprachmodellierungsfähigkeit hat. Die Methode trainiert nur kleine, wiederverwendbare Token-Embeddings, die zu beliebigen Eingabesequenzen hinzugefügt werden können.

## Forschungsfrage

Wie können Prompt-Tuning-Methoden eingesetzt werden, um Bias in Encoder-Sprachmodellen wie BERT und RoBERTa zu reduzieren, ohne die Sprachmodellierungsfähigkeit signifikant zu beeinträchtigen?

## Methodik

Empirisch: Entwicklung einer neuartigen Prompt-Tuning-Methode für Bias-Mitigation mit KL-Divergenz-basierter Verlustfunktion; Evaluierung auf zwei Bias-Messbenchmarks (SEAT, StereoSet); systematische Ablationsstudien zu Initialisierungsmethoden, Namensverwendung und groupspezifischen Optionen.
**Datenbasis:** Synthetische Daten: 159 Templates für Gender-Bias mit 4 Bias-Slot-Typen und 234 Zieloptionen (219 allgemeine + 15 gruppespezifische); Evaluierung auf etablierten Benchmarks: SEAT (6 Gender-Tests), StereoSet (Gender-, Professions-, Rassen- und Religionsbias-Tests); WikiText-2 für Pseudo-Perplexity-Messung.

## Hauptargumente

- Large Language Models internalisieren soziale Biases aus ihren Trainingsdaten und perpetuieren damit Stereotypen gegenüber unterrepräsentierten Gruppen; daher ist es notwendig, Bias-Mitigationsmethoden zu entwickeln, die diese Schäden reduzieren.
- Bestehende Bias-Mitigationsmethoden haben Nachteile: CDA erfordert vollständiges Modell-Retraining, INLP beeinträchtigt die Sprachmodellierungsfähigkeit erheblich, und projektionsbasierte Methoden benötigen zusätzliche Datenaugmentation.
- Prompt-Tuning bietet eine effiziente Alternative, da nur kleine, trainierbare Token-Embeddings hinzugefügt werden, während die Modellparameter eingefroren bleiben; die Methode kann durch eine KL-Divergenz-basierte Verlustfunktion trainiert werden, die fair zwischen sozialen Gruppen ausgewogene Vorhersagen fördert.

## Kategorie-Evidenz

### Evidenz 1

Kern der Methode: 'We base our approach on prompt tuning (Lester et al., 2021), which involves concatenating a set of trainable embeddings to the embedded input of the model while keeping the other parameters frozen.' Fokus auf Template-basiertes Prompt-Design und Prompt-Tuning als Debiasing-Strategie.

### Evidenz 2

Arbeit mit NLP-Modellen BERT und RoBERTa, Masked Language Modeling, Embedding-basierte Metriken; klassische NLP-Techniken ohne generativen Fokus.

### Evidenz 3

Expliziter Fokus auf algorithmischen Bias: 'Large language models are prone to internalize social biases due to the characteristics of the data used for their self-supervised training scheme' und 'representational harms, such as disparate system performance, exclusion or stereotyping, or allocation harms, such as discrimination and unequal allocation of resources'.

### Evidenz 4

Gender-Bias-Mitigation ist Hauptfokus: '159 templates, mostly focused on genders in relation to professions/occupations'; systematische Evaluierung von Gender-Bias durch SEAT und StereoSet Gender-Tests; Analyse von Geschlechterstereotypen bei Berufsbezeichnungen.

### Evidenz 5

Berücksichtigung mehrerer sozialer Gruppen und deren Repräsentation: 'we aim to give the model additional information at inference, in the form of compact prompt embeddings, which could enable it to implicitly infer a latent concept encompassing the desired behaviour: generating a fair and unbiased output' unter Beibehaltung der Gruppenidentität.

### Evidenz 6

Zentrales Konzept der Fairness durchzieht die Arbeit: Fairness-Metriken (SEAT effect sizes, StereoSet stereotype scores), KL-Divergenz-basierte Loss-Funktion für faire Vorhersageverteilungen: 'we minimize the KL divergence between the probability distribution predicted by the model for the allowed options of the target slots and a reference probability distribution', Ziel fairer Vorhersagen über Gruppen hinweg.

## Assessment-Relevanz

**Domain Fit:** Das Paper ist primär für KI-Entwickler und NLP-Forscher relevant, die sich mit Bias-Mitigation befassen. Für Soziale Arbeit besteht eine indirekte Relevanz, da algorithmischer Bias durch LLMs auch in sozialen Diensten (z.B. Chatbots für Beratung, automatisierte Fallentscheidungen) Schaden anrichten kann und faire Systeme ethisch geboten sind.

**Unique Contribution:** Die Arbeit kombiniert erstmals Prompt-Tuning mit KL-Divergenz-basierter Bias-Mitigation und demonstriert, dass minimal invasive, wiederverwendbare Prompts Fairness mit erhaltener Sprachmodellierungsfähigkeit vereinen können – ein Fortschritt gegenüber bestehenden Methoden, die oft Trade-offs erzwingen.

**Limitations:** Limitierungen: (1) Methode erfordert Template-Design und manuelle Auswahl von 'allowed options', was für andere Biasarten und mehrsprachige Kontexte nicht trivial ist; (2) Tokenizer-Abhängigkeit: nur Single-Token-Optionen; (3) Initialisierungsmethoden sind modellabhängig und nicht direkt auf andere Biasarten übertragbar; (4) Referenzverteilung basiert auf Original-Modellvorhersagen, wodurch bereits biased Modelle die Trainierung beeinflussen können.

**Target Group:** NLP-Forscher und KI-Entwickler, insbesondere die an Bias-Mitigation und Parameter-effizienten Methoden arbeiten; Systementwickler von LLM-Anwendungen; sekundär: Ethiker und Policy-Maker, die faire KI-Systeme fördern; potentiell auch Sozialarbeiter, die automatisierte Systeme in ihrer Praxis einsetzen oder evaluieren.

## Schlüsselreferenzen

- [[Caliskan_et_al_2017]] - Word Embeddings Association Test (WEAT)
- [[May_et_al_2019]] - Sentence Embedding Association Test (SEAT)
- [[Nadeem_et_al_2021]] - StereoSet: Measuring Stereotypical Bias in Pretrained Language Models
- [[Lester_et_al_2021]] - Prompt Tuning for Parameter-Efficient Fine-Tuning
- [[Zmigrod_et_al_2019]] - Counterfactual Data Augmentation (CDA)
- [[Ravfogel_et_al_2020]] - Iterative Nullspace Projection (INLP)
- [[Liang_et_al_2020]] - Sentence Debias
- [[Gallegos_et_al_2023]] - Bias and Fairness in Large Language Models: A Survey
- [[Meade_et_al_2022]] - An Empirical Survey of the Effectiveness of Debiasing Techniques
- [[Devlin_et_al_2019]] - BERT: Pre-training of Deep Bidirectional Transformers
