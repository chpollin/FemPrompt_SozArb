---
title: "What large language models know and what people think they know"
authors: ["Mark Steyvers", "Heliodoro Tejeda", "Aakriti Kumar", "Catarina Belem", "Sheer Karny", "Xinyue Hu", "Lukas W. Mayer", "Padhraic Smyth"]
year: 2025
type: journalArticle
language: en
categories:
  - AI_Literacies
  - Generative_KI
  - Prompting
  - Bias_Ungleichheit
  - Fairness
processed: 2026-02-05
source_file: Steyvers_2025_What_large_language_models_know_and_what_people.md
confidence: 94
---

# What large language models know and what people think they know

## Kernbefund

Nutzer überschätzen systematisch die Genauigkeit von LLM-Ausgaben mit Standarderklärungen; längere Erklärungen erhöhen das Vertrauen ohne die Antwortgenauigkeit zu verbessern. Durch Anpassung der Erklärungen an die interne Modellkonfidenz können Kalibrierungs- und Diskriminierungslücken erheblich reduziert werden.

## Forschungsfrage

Wie groß ist die Diskrepanz zwischen der internen Konfidenz von LLMs und der Wahrnehmung von Nutzern bezüglich dieser Konfidenz, und kann diese Lücke durch verbesserte Unsicherheitskommunikation verringert werden?

## Methodik

Empirisch: Verhaltensexperimente mit Nutzerstudien (n=41-60 Teilnehmer pro Experiment) kombiniert mit Analyse von LLM-Vertrauen auf Multiple-Choice und Short-Answer Fragen aus MMLU und TriviaQA Datensätzen.
**Datenbasis:** 6 Experimente mit insgesamt 321 Teilnehmern; 350 Multiple-Choice Fragen aus MMLU; 336 Short-Answer Fragen aus TriviaQA; Analyse von GPT-3.5, PaLM2 und GPT-4o

## Hauptargumente

- LLMs verfügen über interne Konfidenzindikatoren, die gut mit ihrer tatsächlichen Genauigkeit kalibriert sind, aber diese Konfidenz wird in den natürlichsprachlichen Erklärungen nicht angemessen kommuniziert, was zu einer 'Kalibrierungslücke' führt.
- Nutzer zeigen eine 'Längenbias': Sie bewerten längere Erklärungen als vertrauenswürdiger, auch wenn diese keine zusätzlichen Informationen zur Unterscheidung korrekter von falschen Antworten enthalten, was auf oberflächliche Verarbeitung hindeutet.
- Durch gezieltes Prompt-Engineering, das Unsicherheitssprache an die interne Modellkonfidenz anpasst (niedrig, mittel, hoch), können sowohl die Kalibrierungs- als auch Diskriminierungslücken deutlich verringert werden, was zu verbessertem Nutzervertrauen in KI-gestützte Entscheidungsfindung führt.

## Kategorie-Evidenz

### AI_Literacies

Das Paper untersucht zentral die Fähigkeit von Nutzern, LLM-Ausgaben richtig zu interpretieren und Unsicherheit zu verstehen: 'the ability to trust their outputs is crucial' und die Analyse von menschlicher Wahrnehmung von KI-Vertrauen adressiert direkt Kompetenzen im Umgang mit KI-Systemen.

### Generative_KI

Das Paper evaluiert drei öffentlich verfügbare generative LLMs (GPT-3.5, PaLM2, GPT-4o) und untersucht systematisch deren Konfidenzäußerungen und die Qualität ihrer natürlichsprachlichen Erklärungen.

### Prompting

Das Prompting wird als Interventionsmechanismus verwendet: 'we designed these prompts to induce varying degrees of certainty in the explanations' und es werden verschiedene Prompt-Stile manipuliert um unterschiedliche Unsicherheitssignale (low, medium, high confidence) zu erzeugen.

### Bias_Ungleichheit

Das Paper identifiziert systematische Verzerrungen in der Nutzerwahrnehmung: 'users tend to overestimate the accuracy of LLM responses' und die Längenbias zeigt, wie oberflächliche Textmerkmale zu falschen Vertrauenseinschätzungen führen, was zu ungleichen Entscheidungsergebnissen für verschiedene Nutzergruppen führen kann.

### Fairness

Das Papier adressiert Fairness durch das Konzept der Kalibrierung: 'By aligning the LLM's internal confidence with human perception of this confidence, we can bridge the gap' und evaluiert systematisch, wie Diskriminierungsfähigkeit zwischen korrekten und falschen Antworten (gemessen durch AUC-Metriken) verbessert werden kann.

## Assessment-Relevanz

**Domain Fit:** Das Paper ist relevant für KI-Literacies und Fairness, hat aber keinen direkten Bezug zu Sozialer Arbeit oder Gender Studies. Es untersucht jedoch kritische Fragen der vertrauenswürdigen KI-Kommunikation, die für alle Anwendungsdomänen (einschließlich Sozialer Dienste) von Bedeutung sind.

**Unique Contribution:** Das Paper trägt erstmals eine systematische empirische Untersuchung des 'Kalibrierungsgaps' und 'Diskriminierungsgaps' bei und zeigt praktische Interventionsmöglichkeiten durch Prompt-Modifikation, um die Kommunikation von Unsicherheit zu verbessern.

**Limitations:** Das Paper konzentriert sich auf Multiple-Choice und Short-Answer Fragen; die Übertragbarkeit auf längere, offene Fragen ist ungeklärt; die Nutzer waren überwiegend Laien ohne Domänenexpertise; die Langzeiteffekte des Vertrauenserwerbs wurden nicht untersucht.

**Target Group:** KI-Entwickler, UX/UI-Designer, Policymaker im Bereich KI-Governance, Wissenschaftler im Bereich menschlich-KI-Interaktion, Organisationen die LLMs in kritischen Entscheidungskontexten einsetzen (Gesundheit, Recht, Bildung, öffentliche Dienste)

## Schlüsselreferenzen

- [[Kadavath_et_al_2022]] - Language models (mostly) know what they know
- [[Hendrycks_et_al_2021]] - Measuring massive multitask language understanding (MMLU)
- [[Petty_Cacioppo_1984]] - The effects of involvement on responses to argument quantity and quality
- [[Ouyang_et_al_2022]] - Training language models to follow instructions with human feedback (RLHF)
- [[Azaria_Mitchell_2023]] - The internal state of an LLM can distinguish between truthful statements and lies
- [[Farquhar_et_al_2024]] - Detecting hallucinations in large language models using semantic entropy
- [[Budescu_et_al_2014]] - The interpretation of IPCC probabilistic statements around the world
- [[Steyvers_Kumar_2023]] - Three challenges for AI-assisted decision-making
- [[Guo_et_al_2017]] - On calibration of modern neural networks
- [[Rong_et_al_2023]] - Towards human-centered explainable AI: a survey of user studies for model explanations
