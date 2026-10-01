---
title: MirrorStories: Reflecting Diversity through Personalized Narrative Generation with Large Language Models
authors:
  - S. Yunusov
  - H. Sidat
  - A. Emami
year: 2024
type: report
url: https://arxiv.org/html/2409.13935v1
tags:
  - paper
  - feminist-ai
  - bias-research
date_added: 2026-02-22
date_modified: 2026-02-22
mitigation_strategies:
  - Inclusive Narratives
---

# MirrorStories: Reflecting Diversity through Personalized Narrative Generation with Large Language Models

## Abstract

This empirical study introduces a corpus of 1,500 personalized short stories generated with LLMs, incorporating identity features like gender, ethnicity, and age. Human judges rated these stories higher in engagement, diversity, and personalness. Narrative personalization increased textual diversity without harming moral comprehension. However, biases persist, such as preferential engagement for certain identities. The paper illustrates both potential and limitations of diversity-sensitive prompting.

## Key Concepts

### Mitigation Strategies
- [[Inclusive Narratives]]

## Full Text

---
title: "MIRRORSTORIES: Reflecting Diversity through Personalized Narrative Generation with Large Language Models"
authors: ["Sarfaroz Yunusov", "Hamza Sidat", "Ali Emami"]
year: 2024
type: conferencePaper
language: en
processed: 2026-02-05
source_file: Yunusov_2024_MirrorStories_Reflecting_Diversity_through.md
confidence: 95
---

# MIRRORSTORIES: Reflecting Diversity through Personalized Narrative Generation with Large Language Models

## Kernbefund

Personalisierte LLM-generierte Geschichten erzielen signifikant höhere Bewertungen bei Engagement und Zufriedenheit (4,22 vs. 3,37 auf 5-Punkte-Skala) als generische Narrative, während sie gleichzeitig textuelle Diversität erhöhen und die vermittelte Moral bewahren.

## Forschungsfrage

Können Large Language Models effektiv personalisierte 'Mirror Stories' generieren, die die Identitäten und Erfahrungen diverser Leser widerspiegeln und zu höherem Engagement führen als generische Narrative?

## Methodik

Empirisch/Mixed-Methods: Generierung eines Corpus von 1.500 personalisierten Kurzgeschichten mit GPT-4, Claude-3 Sonnet und Gemini 1.5 Flash; Validierung der Personalisierungselemente durch 26 menschliche Evaluatoren; Bewertung durch menschliche Evaluatoren und GPT-4; Textanalysen (Shannon Diversity Index, BERTopic, Word2Vec); Bias-Analyse der LLM-Evaluationen.
**Datenbasis:** 1.500 generierte Kurzgeschichten; 26 diverse menschliche Evaluatoren (Universitätsstudenten); Identitätselemente aus 123 ethnischen Hintergründen, 124 Interessen und 28 Moralen; 30-Story-Sample für Personalisierungsvalidierung

## Hauptargumente

- Personalisierte LLM-generierte Geschichten integrieren erfolgreich Identitätselemente (Name, Geschlecht, Alter, Ethnizität, Interesse) mit hoher Erkennungsgenauigkeit durch menschliche Evaluatoren (100% für Geschlecht, 94% für Ethnizität) und übertreffen teilweise GPT-4-Leistungen.
- Personalisierung führt zu nachweislich höherem Reader-Engagement, Zufriedenheit und wahrgenommenem Bezug zu den Geschichten, während die kognitiven Fähigkeiten zur Moralverständnis nicht beeinträchtigt werden (keine signifikanten Unterschiede bei Moralidentifikation).
- Personalisierte Narrationen erreichen höhere textuelle Diversität (Shannon Diversity Index 4,71) im Vergleich zu generischen Varianten und adressieren damit die dokumentierte Unterrepräsentation von Minderheiten in Kinderliteratur und die Notwendigkeit für inklusivere Narrative.

## Kategorie-Evidenz

### Evidenz 1

Die Studie untersucht die Fähigkeit von LLMs, personalisierte Inhalte zu generieren, was einen kritischen Kompetenzbedarf im Umgang mit generativen KI-Systemen in der Praxis widerspiegelt: 'LLMs excel in generating human-like text and adapting content to various contextual needs'.

### Evidenz 2

Zentral für die Studie ist der Einsatz von GPT-4, Claude-3 Sonnet und Gemini 1.5 Flash zur Narrative-Generierung sowie DALL-E 2 für Bildgenerierung: 'Our study addresses this gap by exploring the potential of LLMs to create mirror stories-narratives that genuinely reflect and resonate with the identities of individual readers.'

### Evidenz 3

Strukturierte Prompts wurden für personalisierte vs. generische Geschichtengenerierung verwendet, mit expliziten Instruktionen zur Integration oder Vermeidung expliziter Identitätselemente: 'Personalized prompts incorporating identity elements were used to generate personalized stories. For Personalization Validation, these elements were specifically asked not to be stated explicitly.'

### Evidenz 4

Die Studie adressiert ein kernhaftes Anliegen Sozialer Arbeit: Zugehörigkeitsgefühl, Selbstverständnis und Empowerment durch Spiegelung von Identität in Narrativen. Dies ist relevant für Ausbildung, Beratung und Jugendförderung: 'Mirror books are stories that reflect the reader's identity, culture, and experiences, serving to engage, validate, and empower individuals... Such books are crucial in educational settings, fostering a sense of belonging and self-understanding.'

### Evidenz 5

Die Studie dokumentiert systematisch sowohl Unterrepräsentation als auch algorithmische Bias: 'Noticeable underrepresentation of non-white minority groups in literature relative to their population size' und identifiziert Geschlechts- und ethnische Bias in GPT-4-Evaluationen: 'Figure 5 shows an instance of gender-based bias, with stories featuring non-binary characters receiving lower ratings.'

### Evidenz 6

Explizite Integration von Geschlechtsidentität als Personalisierungselement (männlich, weiblich, nicht-binär) mit dokumentierter ungleicher Bewertung durch LLM-Evaluatoren: 'The dataset spans a broad age range from 10 to 60 years. MIRRORSTORIES comprises 1,500 narratives with an almost even split between male and female characters' sowie 'We found several preferential biases in GPT-4's evaluation results... with stories featuring non-binary characters receiving lower ratings.'

### Evidenz 7

Kernthema der Studie ist die Förderung von Repräsentation und Inklusion durch Generierung diverser personalisierter Narrative für 123 ethnische Hintergründe, 3 Geschlechtsidentitäten und 124 Interessen: 'Gap in cultural representation highlights the need for more inclusive narratives that reflect diverse reader identities, enhance empathy, and promote cultural awareness.'

### Evidenz 8

Die Studie untersucht systematisch die Qualität und Gerechtigkeit personalisierter Narrative sowie identifiziert und dokumentiert Bias in LLM-Bewertungen: 'Are there biases in LLM evaluations of personalized stories? We found several preferential biases in GPT-4's evaluation results.' und implementiert Safeguards gegen schädliche Inhalte und Bias-Audits.

## Assessment-Relevanz

**Domain Fit:** Das Paper ist hochrelevant für die Schnittstelle AI/Soziale Arbeit/Diversität, da es zeigt, wie generative KI-Systeme zur Adressierung struktureller Probleme (Unterrepräsentation in Literatur) eingesetzt werden können und gleichzeitig kritische Fragen zu LLM-Bias und -Fairness in der Praxis aufwirft. Es hat direktes Anwendungspotential für Beratung, Bildung und identitätsfördernde Interventionen in der Sozialen Arbeit.

**Unique Contribution:** Die Studie leistet einen innovativen empirischen Beitrag durch Schaffung des ersten umfassenden Corpus personalisierter, diversitäts-informierter Narrative und Nachweis, dass LLMs tatsächlich kulturelle und identitätsbezogene Elemente effektiv integrieren können, während sie gleichzeitig systematisch dokumentiert, wie diese Systeme selbst Gender- und Ethnizitäts-Bias reproduzieren.

**Limitations:** Die Studie konzentriert sich auf begrenzte Personalisierungsfaktoren (demografische Merkmale); Evaluator-Pool bestand primär aus Universitätsstudenten (begrenzte Repräsentativität); Subektivität bei Evaluationen; begrenzte Modellvarietät; und unklar bleibt die longitudinale Wirkung personalisierter Narrative auf tatsächliche Leser-Outcomes wie Selbstverständnis oder Empowerment.

**Target Group:** Sozialarbeiter (besonders in Jugendhilfe und Bildung), KI-Entwickler und Ethiker, Pädagogen, Policy-Maker im Bildungssektor, Verlage, Forscher in den Bereichen NLP/KI-Fairness, und Interessensgruppen für Diversität und kulturelle Repräsentation

## Schlüsselreferenzen

- [[Bishop_1990]] - Mirrors, Windows, and Sliding Glass Doors
- [[Brown_et_al_2020]] - Language Models are Few-Shot Learners
- [[Fleming_et_al_2016]] - More Mirrors in the Classroom
- [[Walkington_Bernacki_2014]] - Motivating Students by Personalizing Learning
- [[Phillips_2014]] - How Diversity Works
- [[Hoytt_et_al_2022]] - Impact of Cultural Responsiveness on Student Achievement
- [[Gilardi_et_al_2023]] - ChatGPT Outperforms Crowd Workers for Text-Annotation Tasks
- [[Jiang_et_al_2023]] - Evaluating and Inducing Personality in Pre-trained Language Models
- [[Li_et_al_2024]] - Tailoring Personality Traits in Large Language Models
- [[CCBC_2021]] - Books by and/or about Black, Indigenous, and People of Color
