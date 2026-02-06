---
title: "The steerability of large language models toward data-driven personas"
authors: ["Junyi Li", "Charith Peris", "Ninareh Mehrabi", "Palash Goyal", "Kai-Wei Chang", "Aram Galstyan", "Richard Zemel", "Rahul Gupta"]
year: 2024
type: conferencePaper
language: en
categories:
  - Generative_KI
  - Prompting
  - KI_Sonstige
  - Bias_Ungleichheit
  - Diversitaet
  - Fairness
processed: 2026-02-05
source_file: He_2024_On_the_steerability_of_large_language_models.md
confidence: 95
---

# The steerability of large language models toward data-driven personas

## Kernbefund

Datengesteuerte Personas, die durch kollaboratives Filtern definiert werden, ermöglichen eine 57-77% bessere Steuerung von LLMs gegenüber Baseline-Methoden und erfassen nuanciertere soziale Gruppen als demografische Merkmale allein.

## Forschungsfrage

Wie können große Sprachmodelle durch datengesteuerte Personas, die auf kollaborativem Filtern basieren, besser gesteuert werden, um diverse Meinungen und unterrepräsentierte Gruppen abzubilden?

## Methodik

Empirisch - Machine Learning / NLP mit kollaborativem Filtern zur Persona-Generierung, Soft-Prompting-Modell (SPM) zur LLM-Steuerung, Evaluation mit OpinionQA-Dataset
**Datenbasis:** OpinionQA-Dataset mit 18.339 Teilnehmenden, 1.476 Multiple-Choice-Fragen zu 23 verschiedenen Themen; evaluiert auf GPT-Neo-1.3B, GPT-Neo-2.7B, GPT-j-6B und Falcon-7B-Instruct

## Hauptargumente

- Traditionale demografische Merkmale (Alter, Geschlecht, Parteiaffinität) sind unzureichend zur Abbildung der Vielfalt von Meinungen innerhalb und zwischen Gruppen; datengesteuerte Personas bieten eine nuanciertere Segmentierung basierend auf tatsächlichen Meinungsmustern.
- Kollaboratives Filtern ermöglicht die Projektion individueller Meinungsprofile in einen kontinuierlichen Einbettungsraum, was differenzierte Kontrollierbarkeit von LLMs ermöglicht und Bias-Verstärkung durch unterrepräsentierte Gruppen reduziert.
- Ein Single Soft-Prompting-Modell, das Persona-Embeddings in virtuelle Tokens für Prefix-Tuning abbildet, ist kosteneffizient und performant, da ähnliche Personas analoge Meinungen teilen und mit ähnlichen Token-Sequenzen steuerbar sind.

## Kategorie-Evidenz

### Generative_KI

The paper focuses on steering Large Language Models (LLMs) and uses 'soft-prompting model (SPM) which maps the embedding of a persona to a set of virtual tokens' for controllable generation.

### Prompting

Virtual tokens are 'prepended before tokens mapping to the actual input text, to steer the responses of the LLMs' using prefix-tuning and prompt-tuning techniques.

### KI_Sonstige

Uses collaborative filtering, a classical machine learning technique, to embed individuals into continuous vector space based on opinion responses.

### Bias_Ungleichheit

LLMs are known to 'generate biased responses where the opinions of certain groups and populations are underrepresented' and 'Santurkar et al. (2023) showed that LLMs under-represent the opinions of individuals aged 65 and over, Mormons, and the widowed.'

### Diversitaet

The approach aims to 'produce multiple perspectives and to reflect the diverse opinions' and 'encourage diversity through the curated inclusion of a broad spectrum of viewpoints' as well as 'diminishing polarization and preventing the marginalization of the voices of minority groups.'

### Fairness

The paper addresses fairness through controllable generation that 'can be leveraged to produce multiple perspectives in a balanced way' and proposes methods to align LLMs more equitably with diverse population segments rather than reinforcing majority opinions.

## Assessment-Relevanz

**Domain Fit:** Das Paper ist relevant für KI-Governance und Fairness, hat aber keinen direkten Bezug zu Sozialer Arbeit. Es adressiert jedoch zentrale Fragen von Bias, Repräsentation und Marginalisierung, die für sozialarbeiterische KI-Anwendungen wichtig sind.

**Unique Contribution:** Der Beitrag liegt in der erstmaligen Anwendung von kollaborativem Filtern zur Generierung datengestützter Personas für LLM-Steuerung, was eine nuanciertere und nicht-demografische Segmentierung von Bevölkerungsgruppen ermöglicht.

**Limitations:** Das Paper selbst nennt Limitationen: Abhängigkeit vom QA-Format für kollaboratives Filtern, Evaluation nur auf einem Dataset (OpinionQA), Test nur mit Prefix- und Prompt-Tuning (nicht mit LoRA oder anderen PEFT-Methoden); keine Diskussion möglicher Verstärkung von Biases in Trainingsdaten.

**Target Group:** NLP/KI-Entwickler, Fairness-ML-Forscher, Policy-Maker im Bereich KI-Governance, Anwendungsentwickler von LLM-Systemen in sozial sensiblen Bereichen (Healthcare, Bildung, öffentliche Services); potentiell relevant für sozialarbeiterische Fachpersonen, die mit KI-Systemen arbeiten oder diese evaluieren

## Schlüsselreferenzen

- [[Santurkar_et_al_2023]] - Alignment of LLM opinions with U.S. demographic groups (OpinionQA)
- [[Hwang_et_al_2023]] - Aligning language models to user opinions
- [[Brown_et_al_2020]] - Language Models are Few-Shot Learners (GPT-3)
- [[Li_and_Liang_2021]] - Prefix-Tuning: Optimizing continuous prompts for generation
- [[Lester_et_al_2021]] - The Power of Scale for Parameter-Efficient Prompt Tuning
- [[Hu_et_al_2021]] - LoRA: Low-Rank Adaptation of Large Language Models
- [[Durmus_et_al_2023]] - Towards measuring the representation of subjective global opinions in language models
- [[Argyle_et_al_2023]] - Out of one, many: Using language models to simulate human samples
