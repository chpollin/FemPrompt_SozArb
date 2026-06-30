---
title: "DR.GAP: Mitigating bias in large language models using gender-aware prompting with demonstration and reasoning"
authors:
  - H. Qiu
  - Y. Xu
  - M. Qiu
  - W. Wang
year: 2025
type: report
doi: 
url: "https://arxiv.org/html/2502.11603v1"
tags:
  - paper
llm_decision: Exclude
llm_confidence: 0.85
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
  - Diversitaet
agreement: disagree
---

# DR.GAP: Mitigating bias in large language models using gender-aware prompting with demonstration and reasoning

## Transformation Trail

### Stufe 1: Extraktion & Klassifikation (LLM)

**Extrahierte Kategorien:** Generative_KI, Prompting, KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet, Fairness
**Argumente:** 3 extrahiert

### Stufe 3: Verifikation (LLM)

| Metrik | Score |
|--------|-------|
| Completeness | 92 |
| Correctness | 96 |
| Category Validation | 94 |
| **Overall Confidence** | **94** |

### Stufe 4: Assessment

**LLM:** Exclude (Confidence: 0.85)
**Human:** Include

**Kategorie-Vergleich (bei Divergenz):**

| Kategorie | Human | LLM | Divergent |
|-----------|-------|-----|----------|
| AI_Literacies | Nein | Nein |  |
| Generative_KI | Ja | Ja |  |
| Prompting | Ja | Ja |  |
| KI_Sonstige | Nein | Nein |  |
| Soziale_Arbeit | Nein | Nein |  |
| Bias_Ungleichheit | Ja | Ja |  |
| Gender | Ja | Ja |  |
| Diversitaet | Ja | Nein | X |
| Feministisch | Nein | Nein |  |
| Fairness | Nein | Ja | X |

> Siehe [[Divergenz Qiu_2025_DR.GAP_Mitigating_bias_in_large_language_models]] fuer detaillierte Analyse


## Key Concepts

- [[Gender Bias in Large Language Models]]

## Wissensdokument

# DR.GAP: Mitigating Bias in Large Language Models using Gender-Aware Prompting with Demonstration and Reasoning

## Kernbefund

DR.GAP reduziert Gender-Bias um durchschnittlich 44,98% (GPT-3.5), 36,32% (Llama3) und 39,32% (Llama2-Alpaca) in Coreference-Resolution-Tasks, während die Modellnützlichkeit erhalten bleibt und das Verfahren auf Vision-Language Models generalisiert.

## Forschungsfrage

Wie können Gender-Bias in Large Language Models durch automatisierte, modell-agnostische Prompt-Engineering-Methoden effektiv reduziert werden, ohne die Modellleistung zu beeinträchtigen?

## Methodik

Empirisch: Automatisiertes Prompt-Engineering mit vier sequenziellen Modulen (Initial Reasoning, Verification, Gender-Independent Filtering, Iterative Refinement); experimentelle Evaluierung auf Coreference Resolution und QA-Tasks mit GPT-3.5, Llama3, Llama2-Alpaca und Vision-Language Models; Ablation Study und Cross-Dataset-Generalisierungstests.
**Datenbasis:** Sieben Evaluationsdatensätze: WinoBias, WinoGender, GAP, BUG (Coreference Resolution); BBQ, StereoSet, UnQover (QA); VisoGender (Vision-Language); MMLU und HellaSwag (Utility-Tests)

## Hauptargumente

- Existierende Debiasing-Methoden haben kritische Limitationen: Parameter-Tuning erfordert Modelzugriff, prompt-basierte Ansätze degradieren Modellnutzung oder verstärken Bias (wie CFD-Methode), und Optimierungsverfahren generalisieren nicht—DR.GAP adressiert alle drei Probleme simultan durch automatisierte, modell-agnostische Prompt-Generierung.
- Durch die Auswahl von Demonstrations-Beispielen, bei denen Zielmodelle scheitern aber Referenzmodelle (GPT-4) erfolgreich sind, isoliert DR.GAP Gender-Bias von anderen Fehlerquellen (Mehrdeutigkeit, Reasoning-Limitationen) und generiert daraus strukturierte, syllogistische Reasoning-Prozesse.
- Die vierstufige Reasoning-Generierung (Initial Reasoning, Verification, Gender-Independent Filtering, Iterative Refinement) stellt sicher, dass Demonstrations-Prompts semantisch fokussiert, faktisch korrekt und frei von Geschlechterstereotypen sind—die Ablation Study zeigt, dass jedes Modul notwendig ist.

## Kategorie-Evidenz

### Evidenz 1

Fokus auf Large Language Models (GPT-3.5, Llama3, Llama2-Alpaca) und Vision-Language Models (InstructBlip, Qwen2-VL, Llava-1.5); Abstract: 'Large Language Models (LLMs) exhibit strong natural language processing capabilities but also inherit and amplify societal biases'

### Evidenz 2

Expliziter Fokus auf Prompt-Engineering; Abstract: 'an automated and model-agnostic approach that mitigates gender bias' durch 'gender-aware prompting with demonstration and reasoning'; Sections 3.2.1-3.2.4 beschreiben Prompt-Design für Initial Reasoning, Verification, Gender-Independent Filtering und Iterative Refinement

### Evidenz 3

Behandelt Coreference Resolution und Question-Answering als NLP-Tasks; Section 2.1 diskutiert Gender Bias Evaluation Methods durch 'text generation and comprehension tasks'

### Evidenz 4

Zentral: 'trained on large-scale, unfiltered datasets, they not only inherit but also magnify social biases, exacerbating existing inequities'; Reduction of Gender Bias in AccGap und sAMB-Metriken als Hauptmesswerte; Limitation: 'our work is limited to the English language and does not account for cultural nuances or biases present in other languages'

### Evidenz 5

Expliziter Gender-Bias-Fokus: 'Gender bias, as a typical form of social bias, has been proven to be widely present in LLMs'; Evaluation auf gender-spezifischen Datensätzen (WinoBias, WinoGender, VisoGender); Ethics Statement: 'Our study targets binary gender biases in LLMs'

### Evidenz 6

Recognition von Limitationen: 'our current scope is restricted to binary gender biases, neglecting the diverse spectrum of gender identities beyond the binary. Future research should prioritize evaluating and mitigating biases against non-binary and gender-diverse individuals'; Cross-Model und Cross-Task Evaluierung demonstriert breite Anwendbarkeit

### Evidenz 7

Fairness als zentrale Zielsetzung: 'fairness concerns' im Abstract; Section 4.2 'Utility' evaluiert Fairness-Accuracy Trade-off; Figure 2 zeigt explizit Bias Mitigation (ΔBias) vs. Accuracy Changes (ΔAcc); Ethics Statement: 'guided by the principles of fairness, accountability, and transparency'

## Assessment-Relevanz

**Domain Fit:** Das Paper ist hochrelevant für die Schnittstelle KI und Fairness, hat aber limitierte direkte Relevanz für Soziale Arbeit. Es adressiert kritische Fragen zu algorithmischen Biases und Fairness in generativen KI-Systemen, die zunehmend in Anwendungen mit sozialem Impact eingesetzt werden (z.B. in Decision-Support-Systemen für Sozialverwaltungen).

**Unique Contribution:** DR.GAP entwickelt erstmals eine automatisierte, modell-agnostische Methode zur Gender-Bias-Reduktion, die sowohl auf Black-Box-Modelle anwendbar ist als auch Modellnutzung erhält, und demonstriert erfolgreiche Generalisierung auf Vision-Language Models.

**Limitations:** Paper adressiert nur binäre Gender-Biases in englischsprachigen Kontexten, nicht aber kulturelle und linguistische Variationen oder nicht-binäre Geschlechtsidentitäten; keine Human Evaluation vor Deployment und keine Validierung in echten sozialarbeiterischen Szenarien vorhanden

**Target Group:** KI-Entwickler:innen und ML-Engineer:innen, die an Bias-Mitigation und Fairness in LLMs arbeiten; NLP-Forscher:innen; Organisationen, die generative KI mit Fairness-Anforderungen einsetzen; begrenzt: Sozialarbeiter:innen und Policymaker (indirekt relevant für Verständnis von Biases in KI-Systemen mit sozialem Impact)

## Schlüsselreferenzen

- [[Wei_et_al_2022]] - Chain-of-Thought Prompting Elicits Reasoning in Large Language Models
- [[Ouyang_et_al_2022]] - Training language models to follow instructions with human feedback
- [[Oba_et_al_2024]] - Debiasing with detailed counterfactual preambles (CFD)
- [[Webster_et_al_2018]] - Gender bias in coreference resolution
- [[Nadeem_et_al_2020]] - StereoSet: Measuring stereotypical bias in pretrained language models
- [[Dong_et_al_2024]] - Disclosure and mitigation of gender bias in LLMs
- [[Ganguli_et_al_2023]] - The capacity for moral self-correction in large language models
- [[Schick_et_al_2021]] - Few-shot learning with multilingual language models
