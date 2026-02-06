---
title: "Guardrails, not Guidance: Understanding Responses to LGBTQ+ Language in Large Language Models"
authors: ["Joshua Tint"]
year: 2025
type: conferencePaper
language: en
categories:
  - AI_Literacies
  - Generative_KI
  - Prompting
  - Bias_Ungleichheit
  - Diversitaet
  - Fairness
processed: 2026-02-05
source_file: Tint_2025_Guardrails,_not_guidance_Understanding_responses.md
confidence: 91
---

# Guardrails, not Guidance: Understanding Responses to LGBTQ+ Language in Large Language Models

## Kernbefund

Safety-Mechanismen neutralisieren offene heteronormative Bias durch neutrale/korrektive Antworten, versagen aber bei systemischen Verzerrungen gegenüber LGBTQ+-Slang, das überproportional negative emotionale Labels auslöst.

## Forschungsfrage

Wie unterscheiden sich die emotionalen Inhalte von LLM-Antworten bei heteronormativen versus nicht-heteronormativen Prompts und LGBTQ+-Slang?

## Methodik

Empirisch: Zwei Experiment mit emotional content classification (RoBERTa-Base auf GoEmotions Dataset), Embedding-basierte Cluster-Analyse mit Mahalanobis-Distanz, Analyse von 500 Tweets (HeteroCorpus) und 1398 Quora-Fragenpaare, getestet auf 7 LLM-Modellen (GPT-3.5, GPT-4o, Llama2, Llama3.2, Gemma, Gemma2, Mistral)
**Datenbasis:** n=500 Tweets aus HeteroCorpus; n=1398 extrahierte Fragenpaare aus Quora Dataset; 7 verschiedene LLM-Modelle mit unterschiedlichen Parametergrößen

## Hauptargumente

- Aktuelle Fairness-Ansätze adressieren nur explizite Diskriminierung, nicht die subtileren Formen von Bias gegenüber marginalisiertem Sprachgebrauch wie LGBTQ+-Slang, obwohl diese für Minderheitengruppen in Online-Räumen essentiell sind.
- Sicherheitsmechanismen in LLMs erzeugen überproportionale Neutralisierung und Korrektionen bei heteronormativen Prompts, während LGBTQ+-Slang stärker negative emotionale Reaktionen und Disapproval auslöst, was auf asymmetrische Behandlung hindeutet.
- Die Unterrepräsentation von LGBTQ+-Slang in Trainingskorpora kombiniert mit fehlerhaften Sicherheitsmaßnahmen schafft ein System, das marginalisierte Sprachgemeinschaften weiter benachteiligt statt inklusive NLP-Systeme zu ermöglichen.

## Kategorie-Evidenz

### AI_Literacies

Der Paper analysiert, wie Nutzer mit LLMs interagieren und wie diese Systeme Sprachverständnis vermitteln: 'Language models have integrated themselves into many aspects of digital life' und untersucht implizite Mechanismen der Modelle.

### Generative_KI

Fokus auf große Sprachmodelle: 'Through two experiments, the study assesses the emotional content and the impact of queer slang on responses from models including GPT-3.5, GPT4o, Llama2, Llama3, Gemma and Mistral.'

### Prompting

Analyse von Prompt-Strategien und deren Auswirkungen: 'heteronormative prompts can trigger safety mechanisms, leading to neutral or corrective responses, while LGBTQ+ slang elicits more negative emotions'.

### Bias_Ungleichheit

Zentraler Fokus auf algorithmischen Bias: 'Biases in LLMs arise during data collection, model development, and evaluation' und 'queer slang is underrepresented in large language model training corpora'.

### Diversitaet

Expliziter Fokus auf marginalisierte Communities und deren Sprachgebrauch: 'Queer communities, in particular, are heavily impacted by biased language technologies' und intersektionale Perspektive auf AAVE und LGBTQ+-Slang.

### Fairness

Zentrale Problematisierung von Fairness-Defiziten: 'current fairness approaches' versagen und 'To foster truly inclusive NLP systems, future research and development must prioritize the equitable representation of minority linguistic forms'.

## Assessment-Relevanz

**Domain Fit:** Das Paper hat limitierte direkte Relevanz für Soziale Arbeit, adressiert aber zentrale Fragen von digitaler Inklusion und Fairness für marginalisierte Gruppen (LGBTQ+ Personen), die im Kontext von Online-Beratung und digitalen sozialen Diensten zunehmend relevant werden.

**Unique Contribution:** Das Paper leistet einen innovativen Beitrag durch die Kombination von Embedding-basierter Slang-Detektion mit Emotion-Classification, um subtile Bias jenseits expliziter Diskriminination nachzuweisen und die Limitationen bestehender Safety-Mechanismen zu enthüllen.

**Limitations:** Experiment 2 vergleicht LGBTQ+-Slang nicht mit anderen Slang-Varianten oder informalen Dialekten, daher bleibt unklar, ob Reaktionen spezifisch für queere Sprache oder generalisiert für non-standard dialects gelten; zudem wird die Auswirkung auf faktische Outputs nicht untersucht.

**Target Group:** NLP-Forscher, KI-Entwickler, Fairness-Ingenieure, LGBTQ+-Advocacy-Organisationen, Content Moderation-Teams, Policymaker im Bereich algorithmischer Governance, Wissenschaftler in queer studies und Digital Humanities

## Schlüsselreferenzen

- [[Felkner_et_al_2023]] - WinoQueer: A community-in-the-loop benchmark for anti-LGBTQ+ bias in large language models
- [[Sap_et_al_2019]] - The risk of racial bias in hate speech detection
- [[Zhao_et_al_2019]] - Gender bias in contextualized word embeddings
- [[Bolukbasi_et_al_2016]] - Man is to computer programmer as woman is to homemaker? debiasing word embeddings
- [[Kiritchenko_Mohammad_2018]] - Examining gender and race bias in two hundred sentiment analysis systems
- [[Baker_2003]] - Polari - the lost language of gay men
- [[Leap_2023]] - Queer linguistics and discourse analysis
- [[Ungless_et_al_2023]] - Potential pitfalls with automatic sentiment analysis: The example of queerphobic bias
- [[Vásquez_et_al_2022]] - HeteroCorpus: A corpus for heteronormative language detection
- [[Dorn_et_al_2024]] - Harmful speech detection by language models exhibits gender-queer dialect bias
