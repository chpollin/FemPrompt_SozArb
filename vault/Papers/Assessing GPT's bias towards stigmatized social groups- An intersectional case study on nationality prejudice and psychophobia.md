---
title: "Assessing GPT's bias towards stigmatized social groups: An intersectional case study on nationality prejudice and psychophobia"
authors:
  - H. Jiang
  - B. Kim
  - Z. C. Lipton
year: 2022
type: report
doi: 
url: "https://arxiv.org/pdf/2505.17045"
tags:
  - paper
llm_decision: Include
llm_confidence: 0.85
llm_categories:
  - Generative_KI
  - Bias_Ungleichheit
  - Diversitaet
  - Feministisch
  - Fairness
---

# Assessing GPT's bias towards stigmatized social groups: An intersectional case study on nationality prejudice and psychophobia

## Transformation Trail

### Stufe 1: Extraktion & Klassifikation (LLM)

**Extrahierte Kategorien:** Generative_KI, Prompting, KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit, Diversitaet, Feministisch, Fairness
**Argumente:** 3 extrahiert

### Stufe 3: Verifikation (LLM)

| Metrik | Score |
|--------|-------|
| Completeness | 88 |
| Correctness | 92 |
| Category Validation | 88 |
| **Overall Confidence** | **89** |

### Stufe 4: Assessment

**LLM:** Include (Confidence: 0.85)

## Key Concepts

- [[Intersectional Algorithmic Bias]]

## Wissensdokument

# Assessing GPT's Bias Towards Stigmatized Social Groups: An Intersectional Case Study on Nationality Prejudice and Psychophobia

## Kernbefund

GPT-Modelle zeigen systematisch stärkere negative Vorurteile gegenüber Nordkoreaner:innen im Vergleich zu Amerikaner:innen, insbesondere bei Kombination mit psychischen Erkrankungen. Die Modelle zeigen zudem Inkonsistenzen bei invertierten Skalen und treffen implizite kulturelle Annahmen.

## Forschungsfrage

Wie intersektieren sich GPT-Vorurteile gegenüber Nationalität und psychischen Erkrankungen und wie beeinflussen sie marginalisierte Gruppen?

## Methodik

Empirisch; strukturierte Prompt-Serie mit systematischer Variation von zwei Nationalitäten (USA, Nordkorea) und sechs psychischen Erkrankungen über fünf Alltagsszenarien, Likert-Skalen-Bewertungen (regulär und invertiert) sowie qualitative Analyse von Modell-Erklärungen.
**Datenbasis:** Systematische Prompt-Tests mit GPT-3.5, GPT-4 und GPT-4o (240 Prompts in Stufen 1-2 à 120 Prompts, 2 Prompts Stufe 3), 6 mentale Erkrankungskombinationen (bipolar, Depression, Schizophrenie - jeweils remittiert und symptomatisch), 5 Szenarien.

## Hauptargumente

- GPT-Modelle zeigen einen USA-zentrisch geprägten Bias und verweisen bei Nordkoreaner:innen explizit auf 'kulturelle Unterschiede', während solche Annahmen bei Amerikaner:innen nicht gemacht werden, was auf tiefere nationale Stereotypisierung hindeutet.
- Psychische Erkrankungen werden von GPT-Modellen nicht als Spektrum mit graduellen Symptomen diskutiert, sondern absolutistisch, was zu pauschaler Stigmatisierung führt und intersektionale Nuancierungen ignoriert.
- Numerische Inkonsistenzen bei Skalierung und Neu-Prompting zeigen systemische Unreliabilität in der Bewertung, die die Validität von LLM-basierten Bias-Metriken in Frage stellt und methodologische Vorsicht erfordert.

## Kategorie-Evidenz

### Evidenz 1

Fokus auf GPT-3.5/4/4o LLMs: 'Recent studies have separately highlighted significant biases within foundational large language models (LLMs) against certain nationalities and stigmatized social groups.'

### Evidenz 2

Strukturierte Prompt-Engineering mit Likert-Skalen und invertierten Skalen: 'We prompt GPT-3.5, GPT-4, and GPT-4o in three steps... Ask to answer the question with a Likert scale... Re-prompt with a flipped Likert scale.'

### Evidenz 3

NLP und algorithmische Bias-Analyse: 'evaluates model responses to several scenarios involving American and North Korean nationalities with various mental disabilities'

### Evidenz 4

Thematisiert vulnerable Gruppen (Menschen mit psychischen Erkrankungen, Migrant:innen) und alltägliche soziale Interaktionen (Wohnen, Kinderbetreuung, Arbeit): 'our prompts assess GPT's bias in everyday scenarios like renting, cohabiting, working, childcare, and marriage'

### Evidenz 5

Explizite Analyse struktureller Diskriminierung: 'Findings reveal significant discrepancies in empathy levels with North Koreans facing greater negative bias, particularly when mental disability is also a factor. This underscores the need for improvements in LLMs designed with a nuanced understanding of intersectional identity.'

### Evidenz 6

Intersektionale Perspektive mit explizitem Fokus auf marginalisierte Gruppen: 'This research seeks to explore the intersectional nature of LLM biases... how do GPT biases towards nationality and mental disabilities intersect and affect marginalized groups?'

### Evidenz 7

Verwendung intersektionaler Theorie und Perspektive auf marginalisierte Identitäten, die in der feministischen Kritik sozialer Systeme verankert ist: 'apply a novel approach in using an intersectional lens towards nationality prejudice and psychophobia'

### Evidenz 8

Evaluation von algorithmischer Fairness und Equity: 'evaluate model responses... Findings reveal significant discrepancies... underscores the need for improvements in LLMs designed with a nuanced understanding of intersectional identity... ensure equitable treatment of global users'

## Assessment-Relevanz

**Domain Fit:** Hochgradig relevant für die Schnittstelle AI/Soziale Arbeit/Gender: Das Paper analysiert systematisch, wie KI-Systeme vulnerable Gruppen diskriminieren, die zentral für Soziale Arbeit sind (Menschen mit psychischen Erkrankungen, Migrant:innen), und nutzt dabei intersektionale Perspektiven, die für kritische Sozialarbeitspraxis essentiell sind.

**Unique Contribution:** Das Paper trägt eine novel intersektionale Analyse ein, die explizit die Verschränkung von Nationalität und psychischer Erkrankung untersucht und dabei grundsätzliche Inconsistenzen in LLM-Bias-Bewertungen aufdeckt, was bestehende Bias-Messungen in Frage stellt.

**Limitations:** Kleine Prompt-Menge (240 Prompts), ausschließlich kommerzielle LLMs (keine Generalisierbarkeit auf andere Modelle), begrenzte kulturelle Diversität (nur USA/Nordkorea), Abhängigkeit von subjektiven Interpretationen von Bias und Skalierungsinvarianzen, keine Durchführung statistischer Signifikanztests.

**Target Group:** KI-Ethiker:innen, Sozialarbeiter:innen in digitalisierten Kontexten, Policymaker in AI-Governance, Entwickler:innen von LLMs, Vertreter:innen marginalisierter Gruppen, kritische AI-Forscher:innen mit intersektionaler Perspektive

## Schlüsselreferenzen

- [[Jiang_et_al_2022]] - Nationality Bias in Language Models
- [[Mei_et_al_2023]] - Bias against Stigmatized Groups in Language Models
- [[Bianchi_et_al_2023]] - Demographic Stereotypes in Text-to-Image Generation
- [[Caliskan_et_al_2017]] - Semantics and Human-like Biases in Language Corpora
- [[Charlesworth_et_al_2022]] - Historical Representations of Social Groups in Word Embeddings
- [[Guo_Caliskan_2021]] - Intersectional Biases in Contextualized Word Embeddings
- [[Caliskan_Lewis_2022]] - Social Biases in Word Embeddings and Human Cognition
