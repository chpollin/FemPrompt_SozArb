---
title: "Self-Debiasing Large Language Models: Zero-Shot Recognition and Reduction of Stereotypes"
authors: ["Isabel O. Gallegos", "Ryan Aponte", "Ryan A. Rossi", "Joe Barrow", "Md Mehrab Tanjim", "Tong Yu", "Hanieh Deilamsalehy", "Ruiyi Zhang", "Sungchul Kim", "Franck Dernoncourt", "Nedim Lipka", "Deonna Owens", "Jiuxiang Gu"]
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
source_file: Parrish_2025_Self-debiasing_large_language_models_Zero-shot.md
---

# Self-Debiasing Large Language Models: Zero-Shot Recognition and Reduction of Stereotypes

## Kernbefund

Both self-debiasing techniques significantly reduce stereotyping across nine diverse social groups (age, disability, gender identity, nationality, physical appearance, race/ethnicity, religion, sexual orientation, socioeconomic status), with reprompting showing the greatest bias reduction while relying only on simple prompts and the LLM itself.

## Forschungsfrage

Können Large Language Models durch Zero-Shot-Techniken ohne Modifikation ihrer Parameter oder Trainingsdaten dazu gebracht werden, ihre Stereotypen selbst zu erkennen und zu reduzieren?

## Methodik

Empirisch: Zwei Zero-Shot-Prompting-Techniken (Self-Debiasing via Explanation und Self-Debiasing via Reprompting) evaluiert mit dem BBQ-Datensatz über 15.556 Fragen zu neun sozialen Gruppen; Bias-Score-Messung und Bootstrap-Konfidenzintervalle
**Datenbasis:** n=15.556 ambiguous questions from the Bias Benchmark for Question Answering (BBQ), tested on GPT-3.5 Turbo, with additional validation on GPT-4o mini and LLaMA-3-8B-Instruct

## Hauptargumente

- Bestehende Bias-Mitigationstechniken erfordern häufig Zugriff auf Trainingsparameter, Trainingsdaten oder spezialisierte Decodierungsalgorithmen, was in Praktiken mit Black-Box-Modellen nicht umsetzbar ist; Zero-Shot-Self-Debiasing bietet eine zugängliche Alternative für breite Anwendung.
- Large Language Models besitzen die Fähigkeit, durch einfache Prompting-Strategien ihre eigenen stereotypischen Annahmen zu erkennen und zu korrigieren, ohne dass externe Modifikationen notwendig sind.
- Die Effektivität der Self-Debiasing-Techniken variiert nach sozialen Gruppen, mit besonders starken Ergebnissen bei Reprompting, was auf unterschiedliche Grade von Stereotypisierung in den Trainingsdaten hindeutet und die Notwendigkeit differenzierter Ansätze unterstreicht.

## Kategorie-Evidenz

### AI_Literacies

Das Paper befasst sich mit Zero-Shot-Capabilities von LLMs und wie Nutzer durch Prompting-Strategien KI-Systeme für Bias-Reduktion adaptieren können: 'we leverage the zero-shot capabilities of LLMs to reduce stereotyping'

### Generative_KI

Fokus auf Large Language Models und deren Fähigkeit zur Stereotypenreduktion: 'Large language models (LLMs) have shown remarkable advances in language generation and understanding but are also prone to exhibiting harmful social biases'

### Prompting

Zentrale Methodologie basiert auf Prompt-Engineering durch zwei Techniken: 'self-debiasing via explanation and self-debiasing via reprompting, we show that self-debiasing can significantly reduce the degree of stereotyping'

### Bias_Ungleichheit

Expliziter Fokus auf soziale Biases und Stereotypisierung über neun soziale Gruppen: 'We refer to this class of harms as social bias, a normative term that characterizes disparate representations, treatments, or outcomes between social groups due to historical and structural power imbalances'

### Diversitaet

Evaluation über neun diverse soziale Gruppen zur Gewährleistung von Repräsentation: 'We select BBQ for its breadth across nine social groups: age, disability, gender identity, nationality, physical appearance, race/ethnicity, religion, sexual orientation, and socioeconomic status'

### Fairness

Fokus auf Reduktion von Bias und faire Modellverhalten gemessen durch Bias-Scores: 'we demonstrate self-debiasing's ability to decrease stereotyping in question-answering over nine different social groups with a single prompt'

## Assessment-Relevanz

**Domain Fit:** Das Paper hat begrenzte direkte Relevanz für Soziale Arbeit, adressiert aber kritische Fragen der Algorithmengerechtigkeitund Diskriminierungsvermeidung, die für sozialarbeiterische Systeme (insbesondere bei der Nutzung von KI-gestützten Entscheidungshilfen in Beratung, Fallmanagement oder Ressourcenallokation) zunehmend relevant werden.

**Unique Contribution:** Die Arbeit bietet eine praktische, zugängliche Methode zur Bias-Reduktion in Black-Box-LLMs ohne technische Modifikationen, durch einfache Prompting-Strategien, was die Skalierbarkeit und Anwendbarkeit von Bias-Mitigationen erheblich erhöht.

**Limitations:** Das Paper konzentriert sich ausschließlich auf GPT-3.5 Turbo als Hauptmodell mit begrenzterer Validierung auf anderen Modellen; es untersucht nur Bias in englischsprachigen Frage-Antwort-Szenarien und adressiert nicht, wie sich diese Techniken auf andere Aufgaben oder Sprachen übertragen; die Dauerhaftigkeit der Bias-Reduktion über mehrere Interaktionen wird nicht untersucht.

**Target Group:** KI-Entwickler und MLOps-Teams, die mit Black-Box-LLM-Systemen arbeiten; Policy-Maker und Governance-Fachleute im Bereich algorithmische Fairness; NLP-Forscher und AI-Ethik-Fachleute; potenziell auch Sozialarbeiter, die KI-Systeme in ihrer Praxis einsetzen oder evaluieren

## Schlüsselreferenzen

- [[Parrish_et_al_2022]] - BBQ: A hand-built bias benchmark for question answering
- [[Bender_et_al_2021]] - On the Dangers of Stochastic Parrots
- [[Hutchinson_et_al_2020]] - Social biases in NLP models as barriers for persons with disabilities
- [[Sheng_et_al_2021]] - Societal biases in language generation: Progress and challenges
- [[Wei_et_al_2022]] - Chain-of-thought prompting elicits reasoning in large language models
- [[Kojima_et_al_2022]] - Large language models are zero-shot reasoners
- [[Schick_et_al_2021]] - Self-diagnosis and self-debiasing: A proposal for reducing corpus-based bias in NLP
- [[Weidinger_et_al_2022]] - Taxonomy of risks posed by language models
- [[Chen_et_al_2024]] - Debiasing prompts for large language models
