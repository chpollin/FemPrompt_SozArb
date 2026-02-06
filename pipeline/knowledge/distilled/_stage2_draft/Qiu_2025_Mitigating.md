---
title: "EDITBIAS: Debiasing Stereotyped Language Models via Model Editing"
authors: ["Qiu"]
year: 2025
type: conferencePaper
language: en
categories:
  - KI_Sonstige
  - Bias_Ungleichheit
  - Gender
  - Diversitaet
  - Fairness
processed: 2026-02-05
source_file: Qiu_2025_Mitigating.md
---

# EDITBIAS: Debiasing Stereotyped Language Models via Model Editing

## Kernbefund

EDITBIAS zeigt überlegene Debiasing-Leistung im Vergleich zu klassischen Methoden und ist robust gegenüber Geschlechts-Umkehrung und semantischer Verallgemeinerung, jedoch offenbart die Arbeit einen fundamentalen Trade-off zwischen Debiasing-Effektivität und Bewahrung von Sprachmodellierungsfähigkeiten, insbesondere bei größeren und kausalen Sprachmodellen.

## Forschungsfrage

Wie können stereotype Verzerrungen in vortrainierten Sprachmodellen effizient durch Model Editing mit kleinen Editor-Netzwerken eliminiert werden, ohne die Sprachmodellierungsfähigkeiten wesentlich zu beeinträchtigen?

## Methodik

Empirisch: Model Editing mit Editor-Hypernetworks, kombiniert mit speziell entworfenen Debiasing- und Retaining-Loss-Funktionen; Experimente auf StereoSet mit BERT (RoBERTa) und GPT-2 Modellen; Analyse der Bias-Lokalisierung durch Bias Tracing; Vergleich mit vier klassischen Debiasing-Baselines.
**Datenbasis:** StereoSet (Intrasentence-Subset) mit stereotypisierten, antistereotypisierten und bedeutungslosen Kontexten für Gender-, Rassen- und Religions-Bias; Gender Counterfactual Test Set; Synonym-augmentiertes Test Set mittels WordNet.

## Hauptargumente

- Bisherige Debiasing-Methoden (Fine-Tuning, Prompt-Tuning, Representation Projection) ändern nicht die grundlegend verzerrte Natur von Sprachmodellen oder sind ineffizient; Model Editing mit kleinen Hypernetworks bietet eine effiziente Alternative, die nur partielle Parameter modifiziert und direkt anwendbar ist.
- Eine symmetrische Debiasing-Loss-Funktion basierend auf KL-Divergenz in Kombination mit einer Retaining-Loss-Funktion ermöglicht es, dass Editor-Netzwerke sowohl Bias eliminieren als auch Sprachmodellierungsfähigkeiten bewahren können.
- Bias ist stärker in frühen Schichten verankert (insbesondere in MLPs), wo grundlegende linguistische Muster und Stereotyp-Assoziationen gelernt werden; das Editieren früher Schichten ist daher effektiver als das Editieren oberer Schichten, aber es besteht ein Trade-off zwischen erfolgreicher Debiasierung und Erhalt der Modellleistung.

## Kategorie-Evidenz

### KI_Sonstige

Model Editing mit Editor-Hypernetworks, NLP-Methode auf Transformers (RoBERTa, GPT-2), Sprachmodellierungsfähigkeiten: 'small editor hyper-networks can be flexibly applied to any language model'

### Bias_Ungleichheit

Fokus auf stereotypische Verzerrungen in Sprachmodellen: 'pretrained language models (PLMs) inherently manifest various biases' und 'gender bias, race bias, among others'; Analyse von Stereotypen gegenüber verschiedenen demografischen Gruppen.

### Gender

Explizite Behandlung von Gender-Bias: 'gender bias attribute words for gender bias are she, he, mother, father'; Gender Reverse Robustness Test zur Evaluierung der Gleichbehandlung von männlichen und weiblichen Geschlechtern.

### Diversitaet

Untersuchung von Bias über mehrere demografische Dimensionen: Gender, Race (Rasse), Religion; Fokus auf 'different demographic groups in society'; StereoSet umfasst multiple Bias-Kategorien.

### Fairness

Zentrale Fairness-Perspektive: 'Debiasing aims to make a language model equally treat the stereotypical contexts and anti-stereotypical contexts for fairness'; Verwendung von Fairness-Metriken durch Stereotype Score (SS) und Language Modeling Score (LMS); 'To ensure fairness and accuracy in language models' applications'.

## Assessment-Relevanz

**Domain Fit:** Das Paper adressiert die technische Seite von KI-Bias und Fairness in Sprachmodellen und ist relevant für KI-Fachleute und Systementwickler; der Bezug zur Sozialen Arbeit ist indirekt (potenzielle Anwendung biased LLMs in sozialen Kontexten), aber nicht explizit thematisiert.

**Unique Contribution:** EDITBIAS bietet eine effiziente, parametersparende Alternative zu bestehenden Debiasing-Methoden durch Model Editing mit Hypernetworks und identifiziert die kritische Rolle früher Netzwerk-Schichten bei der Kodierung von Bias sowie den fundamentalen Trade-off zwischen Debiasing und Modellleistung.

**Limitations:** Evaluation nur auf einem Benchmark-Datensatz (StereoSet); begrenzte Experimente mit großen Sprachmodellen aufgrund von GPU-Ressourcen; Trade-off zwischen Debiasing-Effektivität und Sprachmodellierungsleistung wird identifiziert, aber nicht grundlegend gelöst; keine Analyse der Übertragbarkeit auf andere Bias-Typen oder Sprachen.

**Target Group:** KI-Forschende und NLP-Entwickler; Fairness-Spezialist:innen in ML-Systemen; Organisationen, die Sprachmodelle in produktiven Umgebungen einsetzen; potenziell Sozialarbeiter:innen und Policymaker, die sich mit Auswirkungen biased KI-Systemen auseinandersetzen.

## Schlüsselreferenzen

- [[Nadeem_et_al_2021]] - StereoSet: Measuring stereotypical bias in pretrained language models
- [[Liang_et_al_2020]] - SentenceDebias: Debiasing Sentence Representations
- [[Ravfogel_et_al_2020]] - INLP: Iterative Null-space Projection for debiasing embeddings
- [[Meng_et_al_2022]] - Locating and Editing Factual Knowledge in Language Models
- [[Mitchell_et_al_2022]] - Fast Model Editing at Scale
- [[Cao_et_al_2021]] - Editing Factual Knowledge in Language Models
- [[Sun_et_al_2019]] - Mitigating Gender Bias in Natural Language Processing
- [[Zhao_et_al_2020]] - Gender bias in multilingual embeddings
- [[Dev_et_al_2021]] - Bias Representations in Language Models
