---
title: "Improving Diversity of Demographic Representation in Large Language Models via Collective-Critiques and Self-Voting"
authors: ["Preethi Lahoti", "Nicholas Blumm", "Xiao Ma", "Raghavendra Kotikalapudi", "Sahitya Potluri", "Qijun Tan", "Hansa Srinivasan", "Ben Packer", "Ahmad Beirami", "Alex Beutel", "Jilin Chen"]
year: 2023
type: conferencePaper
language: en
processed: 2026-02-05
source_file: Lahoti_2023_Improving_diversity_of_demographic_representation.md
confidence: 95
---

# Improving Diversity of Demographic Representation in Large Language Models via Collective-Critiques and Self-Voting

## Kernbefund

LLMs können Diversitätsmängel in ihren Antworten selbst erkennen und kritisieren. Die CCSV-Methode (Collective-Critique and Self-Voting) verbessert Menschen- und Kulturdiversität dramatisch, wobei Zero-Shot-Prompting überraschenderweise besser und robuster ist als Few-Shot-Ansätze.

## Forschungsfrage

Wie können große Sprachmodelle dazu gebracht werden, diverse demografische Darstellungen in ihren generierten Antworten zu erzeugen, statt homogene Antworten zu produzieren?

## Methodik

Empirisch - Entwicklung von Evaluationsdatensätzen, Metriken zur Messung von Diversität (Entropie, Max-Gap), Prompting-Technik (Collective-Critique and Self-Voting), automatisierte und menschliche Evaluationen mit Flan-PaLM 540B Modell
**Datenbasis:** Zwei selbst erstellte Evaluationsdatensätze mit handgefertigten Templates und Populationen, 105 Berufe abdeckend; Flan-PaLM 540B Modell; menschliche Evaluationen mit 30 Ratern aus verschiedenen geografischen Regionen (Southeast Asia, Latin America, Central Europe) mit unterschiedlichen demografischen Hintergründen

## Hauptargumente

- LLMs zeigen baseline sehr geringe Diversität in ihren Antworten (~99% gleiche Geschlechtsdarstellung, ~98% gleiche ethnische Darstellung), was ein ernsthafter Fairness- und Inklusionsproblem darstellt, das sich von bisherigen Bias-Studien unterscheidet, die auf Stereotypen fokussieren.
- LLMs besitzen intrinsische Fähigkeiten, Diversitätsprobleme zu verstehen und zu kritisieren, was genutzt werden kann, ohne zusätzliches Training oder handgefertigte Beispiele zu benötigen - ein Unterschied zu Constitutional AI und anderen Baseline-Methoden.
- Die CCSV-Methode durch Aggregation mehrerer Kritiken und Self-Voting von revidierten Entwürfen übertrifft alle Baselines deutlich und zeigt, dass Zero-Shot-Prompting robuster und verallgemeinerbarer ist als Few-Shot-Prompting, was konventionelle In-Context-Learning-Weisheit widerlegt.

## Kategorie-Evidenz

### Evidenz 1

Das Paper adressiert generative Large Language Models (LLMs) wie Flan-PaLM 540B explizit: 'A crucial challenge for generative large language models (LLMs) is diversity: when a user's prompt is under-specified, models may follow implicit assumptions while generating a response'

### Evidenz 2

Prompting ist zentral zur Methode: 'we propose a new technique called collective-critique and self-voting (CCSV) to self-improve people diversity of LLMs by tapping into its diversity reasoning capabilities' mit spezifischen Prompts wie 'Critique the AI model's response and identify ways in which it lacks diversity'

### Evidenz 3

Das Paper behandelt algorithmische Entscheidungssysteme und NLP im Kontext von Fairness und Bias: 'homogenization (Bommasani et al., 2022) poses concerns for using LLMs in downstream applications from a responsibility perspective, much like the diversity and inclusion concerns in recommendation, ranking and image search'

### Evidenz 4

Expliziter Fokus auf Diskriminierung und Unterrepräsentation: 'certain demographic groups being under-represented or even erased from the generated responses' und 'baseline Flan-PaLM model has very low diversity scores close to 0.0 with ∼ 99% of responses belonging to the same gender on average and ∼ 98% of responses belonging to the same ethnicity'

### Evidenz 5

Geschlechterdimensionen sind zentrale Evaluationskriterien: 'We find that the baseline Flan-PaLM model has very low diversity scores close to 0.0 with ∼ 99% of responses belonging to the same gender on average' und Geschlecht ist eine der evaluierten demografischen Attribute

### Evidenz 6

Kernthema des gesamten Papers: 'we formalize diversity of representation in generative LLMs' und 'we present evaluation datasets and propose metrics to measure diversity in generated responses along people and culture axes' mit Fokus auf Repräsentation marginalisierter Gruppen

## Assessment-Relevanz

**Domain Fit:** Das Paper ist relevant für die Schnitttstelle KI und Fairness/Diversität, hat aber keinen direkten Bezug zur Sozialen Arbeit. Es trägt jedoch zur Verantwortungsethik von KI-Systemen bei, die potenziell in sozialen Kontexten eingesetzt werden könnten, wo diverse Repräsentation wichtig ist.

**Unique Contribution:** Das Paper ist das erste, das systematisch das Problem der Unterrepräsentation demografischer Gruppen in LLM-Generationen anspricht und eine Zero-Shot-Prompting-Lösung entwickelt, die Modelle ihre eigenen Diversitätsmängel erkennen und selbst verbessern lässt, ohne handgefertigte Beispiele.

**Limitations:** Die Evaluationsdatensätze sind handgefertigt und daher begrenzt; die automatisierte Bewertung hängt von Wissensgraphen ab, die unzureichende Abdeckung marginalisierter Gruppen haben; nur zwei demografische Dimensionen (Geschlecht und Ethnizität) werden evaluiert; begrenzt auf Flan-PaLM Modell; nur Englisch; vermutlich nur effektiv auf großen Modellen mit ausreichenden Reasoning-Fähigkeiten.

**Target Group:** KI-Entwickler und Forscher, besonders jene an LLM-Entwicklung und Responsible AI beteiligt; Machine Learning Engineers; Policymaker im KI-Governance; Ethik- und Fairness-Spezialist:innen; potentiell auch sozialwissenschaftlich interessierte KI-Praktiker:innen

## Schlüsselreferenzen

- [[Wei_et_al_2022]] - Chain-of-Thought Prompting
- [[Bai_et_al_2022]] - Constitutional AI
- [[Wang_et_al_2022]] - Self-Consistency
- [[Bommasani_et_al_2022]] - On the Opportunities and Risks of Foundation Models
- [[Gehman_et_al_2020]] - RealToxicityPrompts
- [[Nadeem_et_al_2020]] - StereoSet
- [[Rudinger_et_al_2018]] - Gender Bias in Coreference Resolution
- [[Smith_et_al_2022]] - Evaluating Bias in Language Models
- [[Kojima_et_al_2022]] - Large Language Models are Zero-Shot Reasoners
