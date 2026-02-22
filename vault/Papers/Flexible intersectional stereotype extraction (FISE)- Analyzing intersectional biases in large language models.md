---
title: Flexible intersectional stereotype extraction (FISE): Analyzing intersectional biases in large language models
authors:
  - T. Charlesworth
year: 2024
type: journalArticle
url: https://news.northwestern.edu/stories/2024/03/kellogg-study-suggests-that-some-intersectional-groups-are-more-represented-than-others-in-internet-text/
tags:
  - paper
  - feminist-ai
  - bias-research
date_added: 2026-02-22
date_modified: 2026-02-22
bias_types:
  - Discrimination
  - Stereotyping
  - Intersectional Stereotypes
  - Intersectionality
  - Stereotypisierung
  - Intersectional Stereotype
  - Stereotype
  - Stereotypen
  - Intersectional Spaces
mitigation_strategies:
  - Intersectional Stereotypes
  - Intersectional Stereotype
  - Intersectionality
  - Intersectional Spaces
llm_decision: Include
llm_confidence: 0.95
llm_categories:
  - Generative_KI
  - Bias_Ungleichheit
  - Gender
  - Diversitaet
  - Feministisch
  - Fairness
---

# Flexible intersectional stereotype extraction (FISE): Analyzing intersectional biases in large language models

## Abstract

Studie entwickelt FISE-Methode zur Messung intersektionaler Repräsentationsverzerrungen. Zeigt massive Dominanz weißer Männer in Internettexten und Ableitung entsprechender LLM-Biases.

## Assessment

**LLM Decision:** Include (Confidence: 0.95)
**LLM Categories:** Generative_KI, Bias_Ungleichheit, Gender, Diversitaet, Feministisch, Fairness

## Key Concepts

### Bias Types
- [[Discrimination]]
- [[Intersectional Spaces]]
- [[Intersectional Stereotype]]
- [[Intersectional Stereotypes]]
- [[Intersectionality]]
- [[Stereotype]]
- [[Stereotypen]]
- [[Stereotyping]]
- [[Stereotypisierung]]

### Mitigation Strategies
- [[Intersectional Spaces]]
- [[Intersectional Stereotype]]
- [[Intersectional Stereotypes]]
- [[Intersectionality]]

## Full Text

---
title: "Extracting Intersectional Stereotypes from Embeddings: Developing and Validating the Flexible Intersectional Stereotype Extraction Procedure"
authors: ["Tessa Charlesworth", "Kshitish Ghate", "Aylin Caliskan", "Mahzarin R. Banaji"]
year: 2024
type: journalArticle
language: en
processed: 2026-02-05
source_file: Charlesworth_2024_Flexible_intersectional_stereotype_extraction.md
confidence: 94
---

# Extracting Intersectional Stereotypes from Embeddings: Developing and Validating the Flexible Intersectional Stereotype Extraction Procedure

## Kernbefund

59% der Traits in der englischen Sprache sind mit weißen Männern assoziiert, während nur 5% mit schwarzen Frauen assoziiert sind. Diese Imbalancen in der Sprachrepräsentation führen zu systematischen Verzerrungen in KI-Systemen, wobei Klassenzugehörigkeit ein übergeordneter Faktor ist.

## Forschungsfrage

Wie sind verschiedene intersektionale Identitätsgruppen (basierend auf Rasse, Geschlecht und Klasse) in englischsprachigen Internettext-Daten repräsentiert und welche Konsequenzen hat dies für KI-Systeme?

## Methodik

Empirisch - Natural Language Processing; Entwicklung und Anwendung des FISE-Verfahrens (Flexible Intersectional Stereotype Extraction) auf 840 Milliarden Wörter englischsprachiger Internettext zur Analyse von Trait-Assoziationen
**Datenbasis:** 840 Milliarden Wörter aus englischsprachigen Internetquellen

## Hauptargumente

- Weiße Männer werden in englischsprachigen Internetdaten überrepräsentiert, während schwarze Frauen unsichtbar sind. Dies führt zu einer Dominanz-versus-Invisibilität-Dichotomie, die direkt in KI-Systeme übertragen wird.
- KI-Systeme reproduzieren und verstärken menschliche Verzerrungen, da sie auf von Menschen erstellten Daten trainiert werden. Wenn die Trainingsdaten verzerrt sind, werden auch die KI-Outputs verzerrt sein.
- Soziale Klasse ist ein übergeordneter Faktor bei der Repräsentation von Intersektionalität. Wohlhabende Identitäten werden unabhängig von Rasse und Geschlecht mit 78% positiven Traits assoziiert, während arme und schwarze Identitäten nur 21% positive Traits aufweisen.

## Kategorie-Evidenz

### Evidenz 1

Die Studie zielt darauf ab, Industrien zu zeigen, wie Sprache Stereotypen verkörpert, verbreitet und intensiviert: 'Our research can show industries that such findings and methods illustrate the societal significance of how language embodies, propagates and even intensifies stereotypes'

### Evidenz 2

Explizite Bezüge zu generativen KI-Systemen: 'you can see these kinds of imbalances coming out in the outputs' bei Google, ChatGPT, DALL-E

### Evidenz 3

Verwendung von Natural Language Processing (NLP) und Word Embeddings: 'an approach built on earlier versions of natural language processing (word embeddings) compared to the more advanced large language models'

### Evidenz 4

Zentral: '59% of traits in the English language are associated with white men, Black women are associated with only about 5% of the traits' und 'Imbalances in English language create imbalances in AI systems'

### Evidenz 5

Expliziter Gender-Fokus: 'the way gender, race and social class intersect and relate to systems of oppression, domination or discrimination' und geschlechtsspezifische Befunde wie Überrepräsentation weiblicher positiver Traits bei Wohlstand

### Evidenz 6

Intersektionale Perspektive auf Repräsentation: 'underrepresentation of Black women specifically in the training data' und 'When women of color are made invisible in the data, it is likely that the applications of large language models and AI will be particularly inaccurate'

### Evidenz 7

Die Studie bezieht sich auf Intersektionalitätstheorie und deren führende Theoretiker:innen (impliziert Crenshaw). Explizite Verbindung von intersektionaler Theorie mit KI-Kritik zur Analyse von Machtverhältnissen und Unterdrückung

### Evidenz 8

Algorithmic Fairness als zentrales Anliegen: 'The research tells us that even in these intersectional spaces where we are having race, gender and social class interacting, social class seems to be an overwhelming factor on how a person is represented' mit Fokus auf faire Repräsentation

## Assessment-Relevanz

**Domain Fit:** Hochgradig relevant für die Schnittstelle KI und Gender/Diversität. Das Paper demonstriert empirisch, wie sprachliche Verzerrungen in KI-Trainingsdaten intersektionale Ungleichheiten perpetuieren. Die Verbindung zu intersektionaler Theorie und KI-Systemen ist zentral für kritische KI-Literacies und Fairness-Diskurse.

**Unique Contribution:** Entwicklung und empirische Validierung des FISE-Verfahrens zur systematischen Messung intersektionaler Stereotypen in großen Textkorpora, was die dominante Rolle von Klassenposition in der Stereotypisierung erstmals quantitativ demonstriert.

**Limitations:** Das Paper analysiert nur englischsprachige Internetquellen und Word Embeddings; Limitierung auf English-Bias-Muster; keine Analyse von Kontextfaktoren oder diachroner Veränderung

**Target Group:** KI-Entwickler:innen, Policymaker, Gender Studies und Diversity-Spezialist:innen, KI-Ethiker:innen, Forscher:innen in Computational Social Science, Organisationen mit Fairness-Anforderungen bei KI-Systemen

## Schlüsselreferenzen

- [[Charlesworth_T_Ghate_K_Caliskan_A_Banaji_M_R_2024]] - Extracting Intersectional Stereotypes from Embeddings (FISE)
- [[Buolamwini_Gebru_2018]] - Gender Shades - Intersectional Bias in Face Recognition
- [[nicht_angegeben_2024]] - Implizite Referenz auf frühere Studien zu Bias in Image Models und Facial Recognition
