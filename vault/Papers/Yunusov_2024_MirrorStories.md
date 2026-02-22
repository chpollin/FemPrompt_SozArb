---
title: Yunusov_2024_MirrorStories
authors:
  - Unknown Author
year: 2024
type: research-paper
tags:
  - paper
  - feminist-ai
  - bias-research
date_added: 2026-02-22
date_modified: 2026-02-22
bias_types: []
mitigation_strategies: []
---

# Yunusov_2024_MirrorStories

## Key Concepts

## Full Text

---
title: "Distributed Representations of Words and Phrases and their Compositionality"
authors: ["Tomas Mikolov", "Ilya Sutskever", "Greg Corrado", "Kai Chen", "Jeffrey Dean"]
year: 2013
type: conferencePaper
language: en
processed: 2026-02-05
source_file: Yunusov_2024_MirrorStories.md
confidence: 84
---

# Distributed Representations of Words and Phrases and their Compositionality

## Kernbefund

Der verbesserte Skip-Gram mit Negative Sampling und Subsampling ermöglicht effiziente Trainingsprozesse bei gleichzeitiger Verbesserung der Vektorqualität; Phrase-Vektoren können präzise analoges Denken ermöglichen und Vektoren zeigen additive Zusammensetzungsstrukturen.

## Forschungsfrage

Wie können hochwertige verteilte Vektorrepräsentationen von Wörtern und Phrasen effizient gelernt werden, und wie lassen sich diese Repräsentationen für analoges Denken und semantische Komposition nutzen?

## Methodik

Empirisch: Skip-Gram Modell mit Verbesserungen (Negative Sampling, Subsampling), Training auf 1-33 Milliarden Wörtern aus News-Korpora, Evaluation durch Analogie-Reasoning-Tasks
**Datenbasis:** Interne Google News-Datensätze: 1 Milliarde Wörter (Wortvektoren), 33 Milliarden Wörter (Phrase-Modell); Analogie-Testsets: Word Analogies, Phrase Analogies mit 3218 Beispielen

## Hauptargumente

- Das Skip-Gram Modell mit Negative Sampling übertrifft Hierarchical Softmax und Noise Contrastive Estimation bei der Erfassung syntaktischer und semantischer Wortbeziehungen mit 2-10x Beschleunigung durch Subsampling häufiger Wörter.
- Phrasen als einzelne Tokens zu behandeln ermöglicht die Darstellung idiomatischer Ausdrücke, deren Bedeutung nicht einfach aus Komponenten zusammensetzbar ist (z.B. 'Air Canada' vs. Komposition von 'Air' und 'Canada').
- Vektorrepräsentationen zeigen lineare Struktur, die intuitive arithmetische Operationen erlaubt: vec('Russia') + vec('river') ≈ vec('Volga River'), was auf implizite Vercodierung von Kontextverteilungen hindeutet.

## Kategorie-Evidenz

### Evidenz 1

Paper behandelt Natural Language Processing, Word Embeddings, Skip-Gram Modell, Negative Sampling und neuronale Sprachmodelle als Kernthemen klassischen Machine Learning für NLP-Aufgaben.

## Assessment-Relevanz

**Domain Fit:** Das Paper hat KEINE direkte Relevanz für die Schnittstelle AI/Soziale Arbeit/Gender Studies. Es ist eine rein technische Arbeit zur Optimierung von Wort-Embeddings ohne normative oder sozialwissenschaftliche Perspektive.

**Unique Contribution:** Einführung von Negative Sampling als effiziente Alternative zu Hierarchical Softmax und systematische Demonstration, dass Phrase-Vektoren idiomatische Bedeutungen erfassen können, mit erheblichen Effizienzgewinnen im Training.

**Limitations:** Keine Analyse von Bias, Fairness oder Diskriminierung in Wortrepräsentationen; keine Diskussion von sozialen Auswirkungen oder ethischen Implikationen der Wort-Embeddings; rein technische Fokussierung auf Performance-Metriken.

**Target Group:** Computerlinguisten, Machine Learning Ingenieure, NLP-Entwickler, Forscher in neuronalen Sprachmodellen; NICHT relevant für Sozialarbeiter, Sozialwissenschaftler oder Gender Studies-Forscher

## Schlüsselreferenzen

- [[Mikolov_et_al_2013]] - Efficient estimation of word representations in vector space
- [[Mikolov_et_al_2013]] - Linguistic Regularities in Continuous Space Word Representations
- [[Gutmann_Hyvärinen_2012]] - Noise-contrastive estimation of unnormalized statistical models
- [[Mnih_Hinton_2009]] - A scalable hierarchical distributed language model
- [[Morin_Bengio_2005]] - Hierarchical probabilistic neural network language model
- [[Bengio_et_al_2003]] - A neural probabilistic language model
- [[Collobert_Weston_2008]] - A unified architecture for natural language processing: deep neural networks with multitask learning
- [[Rumelhart_Hinton_Williams_1986]] - Learning representations by backpropagating errors
