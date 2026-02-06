---
title: "Prompting Techniques for Reducing Social Bias in LLMs through System 1 and System 2 Cognitive Processes"
authors: ["Mahammed Kamruzzaman", "Gene Louis Kim"]
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
source_file: Kamruzzaman_2024_Prompting.md
confidence: 75
---

# Prompting Techniques for Reducing Social Bias in LLMs through System 1 and System 2 Cognitive Processes

## Kernbefund

Eine Kombination aus Human Persona, System 2 Prompting und explizitem Debiasing führt zu substantiellen Reduktionen von stereotypischen Urteilen (bis zu 33% Reduktion), wobei die optimale Kombination je nach Modell und Bias-Kategorie variiert.

## Forschungsfrage

Wie können Prompting-Strategien, die auf Dual-Process-Theorie basieren, in Kombination mit Persona und Debiasing-Techniken soziale Biases in Large Language Models reduzieren?

## Methodik

Empirisch: Vergleichende Experimente mit 12 Prompting-Techniken (CoT, System 1, System 2, Persona-Variationen) plus 6 Debiasing-Variationen, getestet auf 5 LLMs (GPT-4, GPT-4o-mini, Llama3.3, Mistral-7B, Gemma3-27B) über 9 Bias-Kategorien auf zwei Datensätzen (StereoSet und GenAssocBias).
**Datenbasis:** Zwei Bias-Detektions-Datensätze: StereoSet (9 Bias-Kategorien) und GenAssocBias (5 zusätzliche Bias-Kategorien). Jede Prompting-Technik 3x pro Modell getestet. GPT-4 mit Stichprobe von 2.100 Einträgen aus GenAssocBias.

## Hauptargumente

- Dual-Process-Theorie bietet einen psychologisch fundierten Rahmen zur Reduzierung von Biases in LLMs: System 2 Prompting (langsam, deliberativ) führt zu weniger stereotypischen Antworten als System 1 (schnell, intuitiv), was darauf hindeutet, dass LLMs menschliche Kognitionen approximieren.
- Human Persona ist kritisch für Bias-Reduktion: Persona-basierte Prompting verstärkt die Effekte von System 2 und Debiasing erheblich, was darauf suggests, dass LLM-Generationen an menschliche Kognitiv-Muster gekoppelt sind.
- Prompting-Strategien bieten praktische, ressourcenschonende Alternativen zu Fine-Tuning für geschlossene und API-beschränkte Modelle und ermöglichen End-Usern ohne technischen Zugang zur Gewichtskontrolle, Biases zu reduzieren.

## Kategorie-Evidenz

### AI_Literacies

Papier adressiert kritisches Verständnis von KI-Systemen und ihrer Biases sowie praktische Kompetenz im Prompt-Engineering: 'end-users can reduce bias in a manner that is practical for resource-constrained scenarios'.

### Generative_KI

Expliziter Fokus auf Large Language Models (GPT-4, ChatGPT, Llama, Mistral, Gemma): 'Large language models (LLMs) like GPT-4, ChatGPT, Llama have revolutionized many aspects of technology and society'.

### Prompting

Kernthema des Papers: 12 verschiedene Prompting-Techniken inkl. CoT, System 1/2, Persona-Variationen und Debiasing-Prompts. 'we compare zero-shot CoT, debiasing, and dual process theory-based prompting strategies'.

### KI_Sonstige

Verwendung von Chain-of-Thought (CoT) Prompting und dual process theory, die in klassischem NLP und kognitiven Modellierungen verwurzelt sind.

### Bias_Ungleichheit

Zentaler Fokus auf soziale Biases über 9 Kategorien (Ageismus, Geschlecht, Rasse, Religion, Nationalität, Profession, Schönheit, Institution): 'LLMs continue to struggle with embedded social biases' und 'these biases are difficult to identify and even more challenging to eliminate'.

### Gender

Geschlechterbias ist eine von 9 untersuchten Bias-Kategorien, mit spezifischen Analysen zu Geschlechterstereotypen: 'StereoSet covers gender, race, religion, and profession biases'. Beispiel: 'The chess player was Asian'.

### Diversitaet

Papier adressiert multiple marginalisierte Gruppen über 9 Bias-Kategorien (race, religion, nationality, age, beauty standards, institutional bias) und untersucht intersektionale Effekte: 'nine different social bias categories spanning ageism, beauty, gender, institutional, nationality, profession, race, religion'.

### Fairness

Expliziter Fairness-Fokus mit Metriken zur Messung stereotypischer Urteile und Debiasing-Techniken: 'task of mitigating social biases in LLMs is paramount to ensuring fairness and inclusivity in AI-driven communication and decisions'.

## Assessment-Relevanz

**Domain Fit:** Das Paper ist für die Schnittstelle KI und Fairness/Bias-Reduktion hochrelevant, hat aber keinen direkten Bezug zur Sozialen Arbeit. Es adressiert jedoch kritische Fragen zur ethischen KI-Nutzung, die für Sozialarbeiter:innen relevant sind, die zunehmend mit KI-Systemen in Kontakt kommen.

**Unique Contribution:** Erste Untersuchung der Schnittstelle von Dual-Process-Theorie und sozialen Biases in LLMs mit systematischem Vergleich von 12 Prompting-Variationen über 9 Bias-Kategorien und 5 Modellen, wobei die kritische Rolle von Human Persona für Bias-Reduktion etabliert wird.

**Limitations:** Limitation zur Geltung: (1) Analoge Anwendung von Dual-Process-Theorie auf LLMs ist nur textuell begründet, nicht auf internen Prozessen; (2) Evaluation nur auf Englisch und strukturiertem Q&A-Format, nicht auf offenen oder dialogischen Texten; (3) Keine Analyse von Trade-offs zwischen Bias-Reduktion und Modell-Performance; (4) Nur 5 LLMs getestet.

**Target Group:** KI-Entwickler:innen, Prompt-Engineer:innen, Forscher:innen im Bereich NLP und Fairness-in-ML, Policy-Maker für KI-Governance, Nutzer:innen von geschlossenen LLM-APIs (z.B. GPT-4) ohne Fine-Tuning-Zugang, sowie zunehmend Sozialarbeiter:innen und Vertreter:innen der Praxis, die mit KI-Systemen arbeiten.

## Schlüsselreferenzen

- [[Wei_et_al_2022]] - Chain-of-Thought Prompting Elicits Reasoning in LLMs
- [[Nadeem_et_al_2020]] - StereoSet: Measuring Stereotypical Bias in Pretrained Language Models
- [[Schick_et_al_2021]] - Self-Diagnosis and Self-Debiasing for Reducing Corpus-Based Bias in NLP
- [[Evans_Stanovich_2013]] - Dual-Process Theories of Higher Cognition
- [[Kamruzzaman_et_al_2024]] - Investigating Subtler Biases in LLMs: Ageism, Beauty, Institutional, and Nationality Bias
- [[Gallegos_et_al_2024]] - Self-Debiasing Large Language Models: Zero-Shot Recognition and Reduction of Stereotypes
- [[Hagendorff_et_al_2023]] - Human-Like Intuitive Behavior and Reasoning Biases in Large Language Models
- [[Beck_et_al_2024]] - Sensitivity, Performance, Robustness: Deconstructing the Effect of Sociodemographic Prompting
- [[Nighojkar_2024]] - An Inference-Centric Approach to Natural Language Processing and Cognitive Modeling
- [[Frankish_2010]] - Dual-Process and Dual-System Theories of Reasoning
