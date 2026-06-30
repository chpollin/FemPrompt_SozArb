---
title: Explicitly unbiased large language models still form biased associations
authors:
  - X. Bai
  - A. Wang
  - I. Sucholutsky
  - T. L. Griffiths
year: 2025
type: journalArticle
doi: 10.1073/pnas.2416228122
url: "https://doi.org/10.1073/pnas.2416228122"
tags:
  - paper
llm_decision: Include
llm_confidence: 0.92
llm_categories:
  - Generative_KI
  - Bias_Ungleichheit
  - Fairness
---

# Explicitly unbiased large language models still form biased associations

## Transformation Trail

### Stufe 1: Extraktion & Klassifikation (LLM)

**Extrahierte Kategorien:** Generative_KI, Prompting, KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet, Fairness
**Argumente:** 3 extrahiert

### Stufe 3: Verifikation (LLM)

| Metrik | Score |
|--------|-------|
| Completeness | 92 |
| Correctness | 98 |
| Category Validation | 95 |
| **Overall Confidence** | **95** |

### Stufe 4: Assessment

**LLM:** Include (Confidence: 0.92)

## Key Concepts

- [[Algorithmic Fairness in Generative AI]]

## Wissensdokument

# Explicitly unbiased large language models still form biased associations

## Kernbefund

Alle 8 untersuchten, als unbiased geltenden LLMs zeigen weitverbreitete stereotypische Assoziationen und subtile Diskriminierungen in Entscheidungen über 4 soziale Kategorien hinweg (Rasse, Geschlecht, Religion, Gesundheit), die an 21 gesellschaftliche Stereotype gebunden sind.

## Forschungsfrage

Können explizit entbiaste Large Language Models immer noch implizite Vorurteile aufweisen, die sich auf tatsächliche Entscheidungen auswirken?

## Methodik

Empirisch: Zwei psychologisch inspirierte, prompt-basierte Messmethoden (LLM Word Association Test, LLM Relative Decision Test) zur Erfassung impliziter Bias in 8 value-aligned LLMs über 33.600 einzigartige Prompts getestet
**Datenbasis:** 8 value-aligned LLMs (GPT-4, GPT-3.5-Turbo, Claude-3-Sonnet, Claude-3-Opus, Llama2Chat-7B/13B/70B, Alpaca-7B); 33.600 einzigartige Prompts; zwei Evaluierungsphasen (Dezember 2023-Januar 2024, März-Mai 2024)

## Hauptargumente

- Explizite und implizite Vorurteile sind unterschiedliche Phänomene: Value-aligned LLMs bestehen existierende Bias-Benchmarks, die auf explizite Vorurteile testen, zeigen aber dennoch implizite Assoziationen analog zu Menschen, die egalitäre Werte vertreten, aber subtile Diskriminierungen aufweisen.
- Psychologisch validierte Messmethoden sind notwendig zur Offenlegung impliziter Bias in proprietären Modellen: Da Einbettungen nicht zugänglich sind, ermöglichen prompt-basierte Methoden, die auf der Implicit Association Test und psychologischen Forschung basieren, die Messung von impliziten Bias durch beobachtbares Verhalten.
- Relative Vergleiche zwischen zwei Kandidaten sind stärker aussagekräftig für implizite Bias als absolute Einzelbewertungen: Das LLM Relative Decision Test zeigt, dass GPT-4 bei Relativvergleichen signifikant mehr Diskriminierung aufweist (z.B. afrikanische Namen für Hilfsjobs, kaukasische Namen für Leitungspositionen).

## Kategorie-Evidenz

### Evidenz 1

Fokus auf Large Language Models: 'Large language models (LLMs) can pass explicit social bias tests but still harbor implicit biases'. Untersuchung von GPT-4, Claude-3, Llama2Chat Modellen.

### Evidenz 2

Zwei prompt-basierte Messmethoden: 'LLM Word Association Test, a prompt-based method for revealing implicit bias; and LLM Relative Decision Test, a strategy to detect subtle discrimination in contextual decisions.' Insgesamt 33.600 einzigartige Prompts.

### Evidenz 3

Explizite Verbindung zu NLP und algorithmischen Entscheidungssystemen: 'Traditional word embedding techniques, analyzing static and contextualized associations in training data'. Analyse von Wort-Einbettungen und Modellverhalten.

### Evidenz 4

Zentrale Thematik: 'we find that they still show widespread stereotype biases on two psychology-inspired measures.' Dokumentation von 21 Stereotypen über Rasse (z.B. 'race and criminality, race and weapons'), Geschlecht, Religion, Gesundheit.

### Evidenz 5

Geschlechterstereotypen explizit untersucht: 'suggest women study humanities while men study science' und Gender-assoziierte Begriffe wie 'power' und 'home'. Gender als eine von 4 sozialen Kategorien.

### Evidenz 6

Explizite Adressierung marginalisierter Gruppen über multiple Kategorien: 'stereotype biases mirroring those in society in 8 value-aligned models across 4 social categories (race, gender, religion, health)'. Analyse intersektionaler Stereotypen.

### Evidenz 7

Fairness-Kontext und Algorithmen: 'measures to detect subtle discrimination in contextual decisions' und 'Algorithmic fairness, fair ML-Systems'. Fokus auf Fairness-aware Bias-Detection in LLMs. Logistische Regressionsmodelle zur Fairness-Analyse.

## Assessment-Relevanz

**Domain Fit:** Hoch relevant für KI-Fairness und algorithmische Gerechtigkeit: Das Paper identifiziert implizite Diskriminierungsmechanismen in weit verbreiteten LLMs, die in praktischen Anwendungen (Hiring, Beratung, Zuweisung von Ressourcen) signifikante Folgen für marginalisierte Gruppen haben könnten. Für Soziale Arbeit relevant, da LLMs zunehmend in Fallmanagement und Entscheidungsunterstützung eingesetzt werden.

**Unique Contribution:** Das Paper kombiniert psychologische Methoden zur Implizit-Bias-Messung mit modernen LLMs und zeigt, dass bestehende Bias-Benchmarks nicht ausreichend sind, um tatsächliche diskriminatorische Verhaltensmuster aufzudecken—ein kritischer Beitrag zur Fairness in generativer KI.

**Limitations:** Das Paper untersucht hauptsächlich englischsprachige Modelle und Stereotypen; es fehlt eine mechanistische Erklärung für das Entstehen von Bias in großen Modellen; die Entscheidungsaufgaben spiegeln die Word-Association-Tests wider, was die ökologische Validität einschränken könnte.

**Target Group:** KI-Entwickler und Forscher, Fairness-Auditor, Policymaker im Bereich AI Governance, Sozialarbeiter und Organisationen, die LLMs in sensiblen Entscheidungskontexten einsetzen, Algorithmic Justice Advocates, Wissenschaftler in KI-Ethik und Psychologie

## Schlüsselreferenzen

- [[Caliskan_Bryson_Narayanan_2017]] - Semantics derived automatically from language corpora contain human-like biases
- [[Greenwald_McGhee_Schwartz_1998]] - Implicit Association Test
- [[Banaji_Greenwald_2016]] - Blindspot: Hidden Biases of Good People
- [[Dhamala_et_al_2021]] - BOLD: Dataset and metrics for measuring biases in open-ended language generation
- [[Parrish_et_al_2022]] - A hand-built bias benchmark for question answering
- [[Tamkin_et_al_2023]] - Evaluating and mitigating discrimination in language model decisions
- [[Bai_et_al_2022]] - Constitutional AI: Harmlessness from AI feedback
- [[Crosby_Bromley_Saxe_1980]] - Recent unobtrusive studies of black and white discrimination and prejudice
- [[Devine_1989]] - Stereotypes and prejudice: Their automatic and controlled components
- [[Kurdi_et_al_2019]] - Relationship between the implicit association test and intergroup behavior: A meta-analysis
