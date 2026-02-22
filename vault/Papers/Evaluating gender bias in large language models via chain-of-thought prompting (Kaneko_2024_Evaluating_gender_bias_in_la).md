---
title: Evaluating gender bias in large language models via chain-of-thought prompting
authors:
  - M. Kaneko
  - D. Bollegala
  - N. Okazaki
  - T. Baldwin
year: 2024
type: report
doi: 
url: "https://arxiv.org/abs/2401.15585"
tags:
  - paper
llm_decision: Include
llm_confidence: 0.95
llm_categories:
  - Generative_KI
  - Prompting
  - Bias_Ungleichheit
  - Gender
  - Fairness
human_decision: Include
human_categories:
  - Generative_KI
  - Prompting
  - Bias_Ungleichheit
  - Gender
  - Fairness
agreement: agree
---

# Evaluating gender bias in large language models via chain-of-thought prompting

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

**LLM:** Include (Confidence: 0.95)
**Human:** Include

## Key Concepts

- [[Algorithmic Fairness Evaluation]]
- [[Chain-of-Thought Prompting]]
- [[Gender Bias in Large Language Models]]

## Wissensdokument

# Evaluating Gender Bias in Large Language Models via Chain-of-Thought Prompting

## Kernbefund

CoT-Prompting reduziert Geschlechtsbias in LLMs signifikant, indem es Modelle zwingt, ihre Vorhersageprozesse explizit zu artikulieren, auch wenn einfache Debiasing-Prompts allein ineffektiv sind. Der MGBR-Benchmark zeigt hohe Korrelation mit downstream-Task-Bias (BBQ, BNLI) aber niedrige Korrelation mit intrinsischen Bias-Metriken.

## Forschungsfrage

Kann Chain-of-Thought Prompting Geschlechtsbias in Large Language Models bei unausnutzbaren Aufgaben (unscalable tasks) reduzieren?

## Methodik

Empirisch: Entwicklung eines neuen Benchmarks (Multi-step Gender Bias Reasoning – MGBR) zur Evaluation von Geschlechtsbias durch Wort-Zählaufgaben; Vergleich von 23 LLMs mit verschiedenen Prompting-Strategien (Zero-shot, Few-shot, CoT, Debiasing Prompt); statistische Analyse mit McNemar-Test; Korrelationsanalyse mit bestehenden Bias-Benchmarks.
**Datenbasis:** 23 verschiedene LLMs (OPT-Familie: 125m-66b, Llama2-Familie: 7b-70b, GPT-J-6B, MPT-7b, GPT-3.5-Turbo, Claude-v1); N Testinstanzen mit randomisiert gesampelten Wort-Listen (p, q, r Parameter variiert)

## Hauptargumente

- LLMs zeigen beträchtliche Geschlechtsstereotype bei einfachen kognitiven Aufgaben (Wort-Zählung), die in der vorherigen Forschung vernachlässigt wurden, was auf tiefer verankerte implizite Bias hinweist.
- Step-by-step Reasoning durch CoT fungiert als Debiasing-Mechanismus, der LLMs zur expliziten Kategorisierung zwingt und versteckte Vorurteile aufdeckt; dieser Effekt ist stärker als explizite Debiasing-Instruktionen.
- Intrinsische vs. extrinsische Bias-Evaluation zeigen unterschiedliche Muster – MGBR korreliert mit downstream-Aufgaben-Bias (QA, NLI) aber nicht mit traditionellen intrinsischen Metriken, was für die praktische Relevanz spricht.

## Kategorie-Evidenz

### Evidenz 1

Fokus auf 'Large Language Models (LLMs)' wie OPT, Llama2, GPT-J, Claude mit Chain-of-Thought Prompting als zentrale Methode zur Debiasing generativer Systeme.

### Evidenz 2

Zentrale Methode ist Chain-of-Thought (CoT) Prompting: 'an LLM is required to explain step-by-step whether a word is feminine or masculine' mit spezifischen Prompt-Strategien (Zero-shot+CoT, Few-shot+CoT, Debiasing Prompt).

### Evidenz 3

Behandelt Themen wie Natural Language Processing (NLP), Word Embeddings, Language Model Scaling Laws, Arithmetic and Symbolic Reasoning in unscalable tasks.

### Evidenz 4

Expliziter Fokus auf 'unfair social biases' und 'discriminatory societal biases' in LLMs: 'LLMs still learn unfair social biases' und Untersuchung wie implizite Lernmechanismen zu stereotypen Assoziationen führen.

### Evidenz 5

Kernfokus auf Geschlechtsbias: 'gender bias in LLMs', 'gender-neutral occupations classified as feminine or masculine', Verwendung von feminine/masculine/gendered occupational words als Benchmark-Komponenten.

### Evidenz 6

Erwähnung marginalisierter Perspektiven durch Referenzen auf non-binary gender bias: 'gender biases have been reported related to non-binary gender' (Dev et al., 2021a) und Anerkennung intersektionaler Dimensionen jenseits Geschlecht (Rasse, Religion).

### Evidenz 7

Zentral für Fairness-Evaluation: 'bias score' als Fairness-Metrik definiert als Differenz in Genauigkeit zwischen unbiased vs. biased Konditionen; Vergleich mit Fairness-Benchmarks wie BBQ und BNLI mit Metriken für faire Vorhersagen.

## Assessment-Relevanz

**Domain Fit:** Hohe Relevanz für AI-Fairness und Gender Studies, jedoch begrenzte direkte Anwendung auf Soziale Arbeit. Das Paper adressiert kritische Fragen zur algorithmischen Gerechtigkeit und Geschlechterstereotypen in KI-Systemen, die für sozialarbeiterische Kontexte (z.B. Einsatz von KI in Beratung, Case Management, Risikobewertung) relevant sind.

**Unique Contribution:** Erstmalige Evaluation von Gender Bias in unscalable arithmetic/symbolic reasoning tasks via CoT und Nachweis, dass Step-by-Step-Reasoning als intrinsischer Debiasing-Mechanismus funktioniert, der stärker ist als explizite Anti-Bias-Instruktionen.

**Limitations:** Beschränkung auf englische Sprache (morphologisch limitiert), nur binäre Geschlechterkategorien, Fokus auf intrinsische Bias-Evaluation ohne Garantie für reale Downstream-Anwendungen, keine Evaluation von kommerziellen Systemen wie ChatGPT oder Bard.

**Target Group:** NLP-Forscher, KI-Entwickler und Machine Learning Ingenieure; Fairness-Auditor und AI Ethics-Experten; Policymaker zur Regulierung von LLMs; bedingt relevant für Sozialarbeiter und Organisationen, die KI-Systeme in ihrer Praxis einsetzen

## Schlüsselreferenzen

- [[Brown_et_al_2020]] - Language Models are Few-Shot Learners (GPT-3)
- [[Wei_et_al_2022]] - Chain-of-Thought Prompting Elicits Reasoning in LLMs
- [[Nadeem_et_al_2021]] - StereoSet: Measuring Stereotypical Bias in LMs
- [[Nangia_et_al_2020]] - CrowS-Pairs: Intrinsic Bias Evaluation Benchmark
- [[Parrish_et_al_2022]] - BBQ (Bias Benchmark for QA)
- [[Ganguli_et_al_2023]] - The Capacity for Moral Self-Correction in LLMs
- [[Bolukbasi_et_al_2016]] - Man is to Computer Programmer as Woman is to Homemaker
- [[Dev_et_al_2021]] - Harms of Gender Exclusivity in Language Technologies
- [[Kaneko_Bollegala_2022]] - Unmasking the Mask: Evaluating Social Biases in MLMs
- [[GoldfarbTarrant_et_al_2021]] - Intrinsic Bias Metrics Do Not Correlate with Application Bias
