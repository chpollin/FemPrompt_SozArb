---
title: Unequal voices: How LLMs construct constrained queer narratives
authors:
  - A. Ghosal
  - A. Gupta
  - V. Srikumar
year: 2025
type: report
url: https://arxiv.org/abs/2507.15585
tags:
  - paper
  - feminist-ai
  - bias-research
date_added: 2026-02-22
date_modified: 2026-02-22
bias_types:
  - Stereotype
---

# Unequal voices: How LLMs construct constrained queer narratives

## Abstract

Investigates how large language models represent queer individuals in generated narratives, uncovering tendencies toward stereotyped and narrow portrayals. Identifies phenomena including narrow topic range, discursive othering, and identity foregrounding. Shows LLMs unconsciously reinforce divide where marginalized groups are not afforded same breadth of narrative roles as others.

## Key Concepts

### Bias Types
- [[Stereotype]]

## Full Text

---
title: "Unequal Voices: How LLMs Construct Constrained Queer Narratives"
authors: ["Atreya Ghosal", "Ashim Gupta", "Vivek Srikumar"]
year: 2025
type: conferencePaper
language: en
processed: 2026-02-05
source_file: Ghosal_2025_Unequal_voices_How_LLMs_construct_constrained.md
confidence: 89
---

# Unequal Voices: How LLMs Construct Constrained Queer Narratives

## Kernbefund

LLMs generieren für queere Personas signifikant häufiger Begriffe der Diversität und Inklusion, fokussieren überproportional auf identitätsbezogene Themen und zeigen eine systematische Topic-Divergenz gegenüber nicht-queeren Personas, was als subtile Form der diskursiven Othering und Repräsentationseinengung wirkt.

## Forschungsfrage

Wie konstruieren Large Language Models eingeengte und systematisch verzerrte Narrative über queere Menschen im Vergleich zu nicht-queeren Personen?

## Methodik

Empirisch mit vier hypothesengesteuerten Experimenten: (1) Frequenzanalyse spezifischer Begriffe (Diversität, Inklusion), (2) Thematische Analyse von LLM-Outputs mittels LLM-as-Judge, (3) Systematischer Vergleich zwischen Queer (Q) und Not-Queer (¬Q) Personas, (4) Topic Divergence Messung. Getestete Modelle: Llama 3.1/3.3, Gemma, Qwen über fünf soziale Kontexte (Housing, Medical, Persona, Recommendation, Work).
**Datenbasis:** Automatisierte Prompt-basierte Generierung aus definierten Kontexten und Identitätsausdrücken mit Multiple-Choice-Evaluation durch LLM-Judge; genaue Samplegröße nicht explizit angegeben, aber systematische Tests über mindestens 6 verschiedene Modelle und 5 Kontexte mit jeweils Identity=User und Identity=Model Varianten.

## Hauptargumente

- Marginalisierte Gruppen werden in Diskursen oft auf stereotype, begrenzte Themen reduziert, während Dominanzgruppen die volle Komplexität menschlicher Existenz zugestanden wird. LLM-Outputs verstärken dieses Muster durch systematische Assoziationen, die auch bei oberflächlich nicht-negativen Outputs diskriminierend wirken.
- Repräsentationsharms müssen nicht explizit negativ oder beleidigend sein: Schmale, identitätsfokussierte Darstellungen queerer Menschen (analog zum 'Trans Broken Arm Syndrome' in der klinischen Praxis) können durch Umlenking von primären Anliegen zu Allokationsharms führen, insbesondere in Anwendungen wie Chatbot-Therapie.
- Discursive Othering durch Überkorrektur: LLMs foregrunden Diversität-, Inklusions- und Community-Konzepte bei queeren Kontexten unabhängig von faktischer Relevanz, was queere Personen auch in identitätsneutralen Alltags-Settings als 'anders' markiert und subtile soziale Marginalisierung perpetuiert.

## Kategorie-Evidenz

### Evidenz 1

Analyse von LLM-Outputs aus mehreren großen Sprachmodellen (Llama 3.1/3.3, Gemma, Qwen) in unterschiedlichen Persona-Szenarien.

### Evidenz 2

Systematische Prompt-Templates über fünf soziale Kontexte (Housing, Medical, Persona, Recommendation, Work) mit kontrollierten Identitätsausdrücken als Variablen.

### Evidenz 3

NLP-Analyse mit Porter Stemmer und NLTK-Library zur Begriffsfrequenz-Messung sowie LLM-as-Judge Evaluationsmethodik.

### Evidenz 4

Explizites Fallbeispiel eines Therapie-Chatbots mit queeren Patienten als Demonstrationsszenario für potenzielle Schädigungen; Fokus auf Mental-Health-Chatbots und klinische Interaktionspraxis.

### Evidenz 5

Zentrale These: Systematische Bias in LLM-Outputs reproduziert und perpetuiert soziale Marginalisierung queerer Menschen durch Repräsentationsharms und Allokationsharms.

### Evidenz 6

Expliziter Fokus auf LGBTQ+ Identitäten, speziell queere, schwule, lesbische und trans Personas als Subjekte der Repräsentationsanalyse.

### Evidenz 7

Analyse der Repräsentation marginalisierter Communities (queere Menschen) versus Dominanzgruppen; Intersektionalität implizit durch Fokus auf Othering-Prozesse.

### Evidenz 8

Vier Hypothesen zur Messung systematischer Fairness-Unterschiede (H1-H4); Bezug zu Fairness-Harms und Konzepten like Equalized Representation; Test auf diskriminatorische Assoziationsmuster.

## Assessment-Relevanz

**Domain Fit:** Hochgradig relevant für die Schnittstelle KI/Soziale Arbeit: Das Paper untersucht systematisch, wie LLMs marginalisierte Menschen (queere Personen) in praktischen Anwendungsszenarien (klinische Beratung, Therapie-Chatbots) darstellen und damit Schädigungen verursachen können – zentral für die sichere Implementierung von KI in sozialarbeiterischen Kontexten.

**Unique Contribution:** Operationalisierung subtiler, nicht-explizit negativer Repräsentationsharms durch drei konzeptuelle Kategorien (harmful, narrow, othering representations) und empirische Messung via vier testbare Hypothesen mit detaillierter Topic-Divergence-Analyse.

**Limitations:** Eingeschränkter Satz von Szenarien und Identitätstermen (nur englischsprachig, explizite Identitätsmarkierung durch Prompt erforderlich); latente Identitätsdarstellungen nicht untersucht; Generalisierbarkeit über Llama/Gemma/Qwen begrenzt; keine tiefen qualitativen Analysen einzelner problematischer Outputs.

**Target Group:** KI-Entwickler:innen und Sicherheitsauditor:innen (insbesondere für generative KI-Systeme in sensiblen Anwendungen), Sozialarbeit und klinische Praktiker:innen (Therapeut:innen, Berater:innen mit Chatbot-Einsatz), LGBTQ+-Advocacy und Diversitätsbeauftragte, AI Ethics und Fairness-Forscher:innen, Policymaker im Bereich KI-Regulation.

## Schlüsselreferenzen

- [[Blodgett_et_al_2020]] - Language (technology) is power: A critical survey of 'bias' in NLP
- [[Barocas_Hardt_Narayanan_2023]] - Fairness and Machine Learning: Limitations and Opportunities
- [[Gadiraju_et_al_2023]] - 'I wouldn't say offensive but...': Disability-centered perspectives on large language models
- [[Noble_2018]] - Algorithms of Oppression
- [[Wall_et_al_2023]] - Trans Broken Arm Syndrome in clinical practice
- [[Spivak_1985]] - Othering and epistemic violence
- [[Young_2014]] - Inspiration porn
- [[Meretoja_2017]] - The Ethics of Storytelling: Narrative Hermeneutics, History, and the Possible
