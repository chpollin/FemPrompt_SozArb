---
title: More or less wrong: A benchmark for directional bias in LLM comparative reasoning
authors:
  - H. Liu
  - C. Sferrazza
  - Y. Lupu
year: 2025
type: report
url: https://arxiv.org/html/2506.03923v1
tags:
  - paper
  - feminist-ai
  - bias-research
date_added: 2026-02-22
date_modified: 2026-02-22
bias_types: []
mitigation_strategies: []
llm_decision: Exclude
llm_confidence: 0.85
llm_categories:
  - Generative_KI
  - Bias_Ungleichheit
  - Fairness
human_decision: Include
human_categories:
  - Generative_KI
  - Prompting
  - KI_Sonstige
  - Bias_Ungleichheit
  - Gender
  - Diversitaet
  - Fairness
agreement: disagree
---

# More or less wrong: A benchmark for directional bias in LLM comparative reasoning

## Assessment

**LLM Decision:** Exclude (Confidence: 0.85)
**LLM Categories:** Generative_KI, Bias_Ungleichheit, Fairness
**Human Decision:** Include
**Human Categories:** Generative_KI, Prompting, KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet, Fairness
**Agreement:** Disagree

## Key Concepts

## Full Text

---
title: "More or Less Wrong: A Benchmark for Directional Bias in LLM Comparative Reasoning"
authors: ["Mohammadamin Shafiei", "Hamidreza Saffari", "Nafise Sadat Moosavi"]
year: 2025
type: conferencePaper
language: en
processed: 2026-02-05
source_file: Shafie_2025_More_or_less_wrong_A_benchmark_for_directional.md
confidence: 95
---

# More or Less Wrong: A Benchmark for Directional Bias in LLM Comparative Reasoning

## Kernbefund

LLMs zeigen konsistente und richtungsabhängige Reasoning-Verzerrungen, wobei die Wahl und Position von Vergleichsbegriffen zu systematischen Vorhersagen in Richtung des Framing-Terms führt, unabhängig von der korrekten Antwort. Diese Effekte werden durch demografische Identitätsmarker (Geschlecht, Rasse) verstärkt.

## Forschungsfrage

Wie beeinflussen semantische Framing-Effekte (insbesondere die Verwendung von 'mehr', 'weniger', 'gleich') systematisch und direkt die Vorhersagen von Large Language Models bei logisch äquivalenten Vergleichsproblemen?

## Methodik

Empirisch: Kontrolliertes Benchmark-Experiment mit 300 vergleichenden Mathematik-Szenarien, evaluiert unter 14 Prompt-Varianten über drei LLM-Familien (GPT, Claude, Qwen). Systematische Variation von Framing-Termen, Positionen und demografischen Identitätsmarkern.
**Datenbasis:** 300 kontrollierte Vergleichsszenarien × 14 Prompt-Varianten × 6 Modellvarianten × 8 demografische Identitätsmarker = Tausende Evaluierungsfälle

## Hauptargumente

- Framing-Effekte in LLMs sind nicht nur oberflächliche Prompt-Sensitivität, sondern systematische semantische Biases, die zu direktionalen Fehlern führen (z.B. 'mehr'-gerahmte Prompts erhöhen 'mehr'-Antworten auch bei falscher Antwort). Dies offenbart eine grundlegende Limitation in Standard-Evaluationsparadigmen, die nur Genauigkeit messen.
- Chain-of-Thought-Prompting reduziert diese Biases teilweise, aber nicht vollständig, insbesondere bei strukturierten Ausgabeformaten (JSON), wo Modelle korrekt rechnen, aber Ausgaben im Frame der Eingabe formulieren. Dies deutet auf zwei unterschiedliche Fehlerquellen hin: Reasoning und Output-Formulierung.
- Demografische Identitätsmarker (Geschlecht, Rasse) interagieren mit Framing-Effekten und verstärken Reasoning-Disparitäten, besonders in Stereotyp-assoziierten Domänen (Caregiving, Einkaufen, Bildung). Dies weist auf gefährliche Verknüpfungen zwischen sprachlichem Framing und sozialen Vorurteilen hin.

## Kategorie-Evidenz

### Evidenz 1

Fokus auf 'large language models (LLMs)' und evaluation of 'three LLM families (GPT, Claude, and Qwen)' mit verschiedenen Modellgrößen

### Evidenz 2

Extensive Analyse von 'prompt framing variants', 'prompt position', 'chain-of-thought prompting', 'structured outputs (JSON)', sowie 'direct vs. indirect' Framing

### Evidenz 3

Untersuchung der zugrunde liegenden Mechanismen von Reasoning-Bias in LLMs, die über Standard-NLP hinausgehen

### Evidenz 4

Zentrales Thema: 'framing-induced reasoning errors', 'systematic directional bias', 'directional errors', 'reasoning disparities' und wie diese zu systematischen Benachteiligungen führen

### Evidenz 5

Explizite Analyse mit 'gender markers' (man, woman), 'gender bias in numerically grounded tasks', sowie Untersuchung von 'protected attributes such as gender'

### Evidenz 6

Evaluation mit mehreren demografischen Markern: 'gender and race references', 'protected attributes such as gender and race', getestet mit 5 Rassen-Kategorien (Asian, African, Hispanic, White, Black)

### Evidenz 7

Expliziter Fokus auf 'framing-aware benchmarks for diagnosing reasoning robustness and fairness in LLMs', 'fairness' und 'bias-sensitive evaluations'

## Assessment-Relevanz

**Domain Fit:** Hohe Relevanz für AI/Fairness-Schnittstelle, aber begrenzte direkte Anwendung für Soziale Arbeit. Der Fokus auf Reasoning-Biases in LLMs und deren Interaction mit demografischen Markern ist relevant für alle Kontexte, in denen LLMs für Entscheidungsfindung oder Assessment in sozialen Diensten eingesetzt werden könnten.

**Unique Contribution:** Erste systematische Isolierung von Framing-induzierten Reasoning-Biases in LLMs mit objektiver Grundwahrheit; neuartige Demonstration der Interaktion zwischen semantischem Framing und sozialen Identitätsmarkern in grounded reasoning tasks.

**Limitations:** Datensatz mit 300 Szenarien ist klein; binäre Geschlechtsbehandlung (Mann/Frau); begrenzte Rassen-Kategorien (5); keine anderen Protected Attributes (Religion, Einkommen); empirisch begrenzt auf mathematische Vergleichsaufgaben.

**Target Group:** KI-Forscher, LLM-Entwickler, Fairness/Bias-Experten, Policymaker im AI-Bereich, Evaluatoren von LLM-Systemen. Indirekt relevant für Sozialarbeiter und Praktiker, die LLMs für Assessment oder Entscheidungshilfen nutzen möchten.

## Schlüsselreferenzen

- [[Wei_et_al_2022]] - Chain of Thought Prompting
- [[Sclar_et_al_2023]] - Quantifying Language Models' Sensitivity to Spurious Features
- [[Lin_Ng_2023]] - Mind the Biases: Quantifying Cognitive Biases in Language Model Prompting
- [[Itzhak_et_al_2024]] - Instructed to Bias: Instruction-tuned LMs exhibit emergent cognitive bias
- [[Druckman_2001]] - Evaluating Framing Effects
- [[Gallegos_et_al_2024]] - Bias and Fairness in Large Language Models: A Survey
- [[Parrish_et_al_2022]] - BBQ: A Hand-Built Bias Benchmark
- [[Gupta_et_al_2024]] - Bias Runs Deep: Implicit Reasoning Biases in Persona-Assigned LLMs
- [[Opedal_et_al_2024]] - Do Language Models Exhibit the Same Cognitive Biases as Human Learners?
- [[Mohammad_2020]] - Gender Gap in Natural Language Processing Research
