---
title: "The power of Prompts: Evaluating and Mitigating Gender Bias in MT with LLMs"
authors: ["Aleix Sant", "Carlos Escolano", "Audrey Mash", "Francesca De Luca Fornaciari", "Maite Melero"]
year: 2024
type: conferencePaper
language: en
categories:
  - Generative_KI
  - Prompting
  - KI_Sonstige
  - Bias_Ungleichheit
  - Gender
  - Diversitaet
  - Fairness
processed: 2026-02-05
source_file: Sant_2024_The_power_of_prompts_Evaluating_and_mitigating.md
confidence: 89
---

# The power of Prompts: Evaluating and Mitigating Gender Bias in MT with LLMs

## Kernbefund

Base LLMs zeigen signifikant höheren Geschlechterbias als NMT-Modelle; durch gezielte Prompt-Strukturen mit Chain-of-Thought kann Gender-Bias bei instruktionsgestimmten LLMs um bis zu 12% reduziert werden, wodurch die Lücke zu NMT-Systemen deutlich verkleinert wird.

## Forschungsfrage

Können Prompt-Engineering-Techniken bei LLMs Geschlechterbias in maschineller Übersetzung effektiv reduzieren und wie vergleichen sich LLMs mit neuronalen Übersetzungssystemen bei dieser Aufgabe?

## Methodik

Empirisch: Benchmarking von 7 LLMs und 3 NMT-Modellen mittels 4 etablierter Test-Datasets (FLoRes200, WinoMT, Gold BUG, MuST-SHE) für Englisch→Katalanisch und Englisch→Spanisch; Prompt-Engineering-Experimente mit Few-Shot, Chain-of-Thought und Kontextvorgaben auf instruktionsgestimmtem LLM
**Datenbasis:** 4 etablierte Benchmark-Datasets (FLoRes200 mit repräsentativen Sätzen, WinoMT und Gold BUG für Gender Coreference Resolution, MuST-SHE für Gender Terms Detection); systematische Evaluation von 10 Modellvarianten

## Hauptargumente

- Geschlechterbias ist ein durchgehendes Problem in allen generativen NLP-Modellen mit potentiell schädlichen Folgen (Repräsentationsharm und Allokationsharm); LLMs verdienen spezielle Aufmerksamkeit, da bisherige Forschung den Gender-Bias vor allem in NMT-Systemen untersucht hat.
- Base LLMs schneiden bei Gender-Bias-Metriken deutlich schlechter ab als spezialisierte NMT-Modelle, insbesondere weil sie auf Prompts angewiesen sind und weniger auf parallele Übersetzungsdaten trainiert wurden.
- Prompt-Engineering mit Chain-of-Thought-Reasoning und strukturiertem Schritt-für-Schritt-Ansatz (Identifikation von Entitäten → Pronomen → Coreference → Geschlechtsbestimmung → Übersetzung) ist eine praktikable und direkt anwendbare Strategie zur Bias-Mitigation ohne Modellretraining.

## Kategorie-Evidenz

### Generative_KI

Paper evaluiert Large Language Models (LLMs) für Maschinenübersetzung: 'Four widely-used test sets are employed to benchmark various base LLMs' und untersucht 'Llama-2-7B', 'Aguila-7B', 'Flor-6.3B' sowie deren instruction-tuned Varianten.

### Prompting

Umfassende Exploration von Prompt-Engineering-Techniken: 'we explore prompting engineering techniques applied to an instruction-tuned LLM. We identify a prompt structure that significantly reduces gender bias by up to 12% on the WinoMT evaluation dataset' mittels Few-Shot, Chain-of-Thought und Kontext-Vorgaben.

### KI_Sonstige

Paper behandelt Machine Translation und Neural Machine Translation Models als etablierte NLP-Systeme: 'comparing their translation quality and gender bias against state-of-the-art Neural Machine Translation (NMT) models for English to Catalan and English to Spanish translation directions'.

### Bias_Ungleichheit

Expliziter Fokus auf Gender-Bias als Diskriminierungsproblem mit schädlichen Konsequenzen: 'gender bias is defined as the tendency of MT systems to produce translations that reflect or perpetuate gender stereotypes, inequalities, or assumptions' mit Verweis auf 'representational (i.e., misrepresentation or underrepresentation of social groups) or allocational harms (i.e., allocation or withholding of opportunities)'.

### Gender

Zentrale Analyse zweier Gender-Bias-Aufgaben: 'Gender Coreference Resolution' und 'Gender Terms Detection'; Evaluation mit Metriken für männliche und weibliche Terme; Beispiele zeigen stereotypische Geschlechterzuordnungen (z.B. Ingenieure maskulin, Krankenschwestern feminin).

### Diversitaet

Untersucht Geschlechterrepräsentation in maschineller Übersetzung mit Fokus auf marginalisierte Darstellungen: 'the presence of gender bias may affect the representation of genders in certain communities' und 'users of a machine translation system may not be proficient in at least one of the languages' sind gefährdet durch bias-behaftete Übersetzungen.

### Fairness

Fairness als zentrale Evaluation mit klassischen ML-Metriken (Accuracy, F1-Score für männliche/weibliche Klassen) und Gender-spezifischen Fairness-Gaps (ΔG = Differenz zwischen F1-male und F1-female); Ziel ist 'gender-bias mitigation' durch verbesserte Prompt-Strukturen.

## Assessment-Relevanz

**Domain Fit:** Das Paper hat begrenzte direkte Relevanz für Soziale Arbeit, adressiert aber ein kritisches Fairness- und Equity-Problem bei KI-Systemen, die zunehmend in sozialen Kontexten verwendet werden (insbesondere maschinelle Übersetzung in mehrsprachigen Sozialberatungs- und Betreuungskontexten). Die Methodologie zur Bias-Mitigation durch Prompt-Engineering ist auf andere generative KI-Anwendungen in der Sozialen Arbeit übertragbar.

**Unique Contribution:** Erste umfassende Evaluierung von Gender-Bias in LLMs für Maschinenübersetzung (nicht nur NMT) mit innovativer Demonstration, dass strukturierte Prompt-Engineering mit Chain-of-Thought explizit für Geschlechterdisambiguierung eingesetzt werden kann und signifikante Bias-Reduktion ohne Modellretraining erreicht.

**Limitations:** Beschränkung auf zwei Sprachpaare (Englisch→Katalanisch/Spanisch) mit grammatikalischem Geschlecht; keine Analyse nicht-binärer Geschlechtsidentitäten; keine User-Studien zu praktischen Auswirkungen; Prompt-Engineering-Ergebnisse möglicherweise nicht direkt auf andere Domänen übertragbar; keine Analyse der möglichen Trade-offs zwischen Gender-Bias-Reduktion und Übersetzungsqualität.

**Target Group:** NLP-Forscher:innen und Entwickler:innen von maschinellen Übersetzungssystemen; KI-Fairness-Spezialist:innen; Multilingual-Tech-Teams; Policy-Maker im Bereich KI-Governance und Sprachentechnologie; bedingt relevant für Sozialarbeiter:innen, die mit vulnerablen mehrsprachigen Zielgruppen arbeiten und Übersetzungstechnologie einsetzen

## Schlüsselreferenzen

- [[Friedman_Nissenbaum_1996]] - Bias in computer systems
- [[Stanovsky_et_al_2019]] - WinoMT: Gender Bias in Machine Translation
- [[Savoldi_et_al_2021]] - Gender Bias in Machine Translation
- [[Crawford_2017]] - Atlas of AI (Representational and Allocational Harms)
- [[Levy_et_al_2021]] - Gold BUG: A Gender-Bias Benchmark
- [[Bentivogli_et_al_2020]] - MuST-SHE: Multilingual & Spoken Language Evaluation for Gender Bias
- [[Wei_et_al_2022]] - Chain of Thought Prompting Elicits Reasoning in LLMs
- [[Costajussà_et_al_2020]] - Gender-Aware Neural Machine Translation
- [[Vanmassenhove_2024]] - Gender Bias in Machine Translation and the Era of LLMs
- [[Savoldi_et_al_2024]] - GPT-4 and Gender-Neutral Translations
