---
title: Large language models are zero-shot reasoners
authors:
  - T. Kojima
  - S. S. Gu
  - M. Reid
  - Y. Matsuo
  - Y. Iwasawa
year: 2022
type: conferencePaper
tags:
  - paper
  - feminist-ai
  - bias-research
date_added: 2026-02-22
date_modified: 2026-02-22
bias_types: []
mitigation_strategies:
  - Fine-tuning
llm_decision: Exclude
llm_confidence: 0.95
llm_categories:
  - Generative_KI
  - Prompting
human_decision: Exclude
human_categories:
  - Generative_KI
  - Prompting
agreement: agree
---

# Large language models are zero-shot reasoners

## Assessment

**LLM Decision:** Exclude (Confidence: 0.95)
**LLM Categories:** Generative_KI, Prompting
**Human Decision:** Exclude
**Human Categories:** Generative_KI, Prompting
**Agreement:** Agree

## Key Concepts

### Mitigation Strategies
- [[Fine-tuning]]

## Full Text

---
title: "Large Language Models are Zero-Shot Reasoners"
authors: ["Takeshi Kojima", "Machel Reid", "Yutaka Matsuo", "Yusuke Iwasawa", "Shixiang Shane Gu"]
year: 2022
type: conferencePaper
language: en
processed: 2026-02-05
source_file: Kojima_2022_Large_language_models_are_zero-shot_reasoners.md
confidence: 92
---

# Large Language Models are Zero-Shot Reasoners

## Kernbefund

Ein einfaches Single-Prompt-Template ('Let's think step by step') aktiviert Multi-Step-Reasoning in großen Sprachmodellen ohne Few-Shot-Beispiele und zeigt erhebliche Leistungssteigerungen über diverse Reasoning-Aufgaben hinweg (z.B. 17.7% → 78.7% auf MultiArith), was auf bislang wenig erforschte Zero-Shot-Fähigkeiten von LLMs hindeutet.

## Forschungsfrage

Können große Sprachmodelle durch einfache Prompting-Techniken wie 'Let's think step by step' als Zero-Shot-Reasoner für komplexe Multi-Step-Reasoning-Aufgaben fungieren, ohne task-spezifische Few-Shot-Beispiele zu benötigen?

## Methodik

Empirisch - Experimentelle Evaluierung von Zero-Shot-CoT-Prompting auf 12 Datensätzen aus vier Kategorie von Reasoning-Aufgaben mit mehreren LLM-Modellen (InstructGPT, PaLM, GPT-2, GPT-3, GPT-Neo, GPT-J, T0, OPT)
**Datenbasis:** Evaluierung auf 12 Benchmarks: 6 arithmetische Datensätze (SingleEq, AddSub, MultiArith, AQUA-RAT, GSM8K, SVAMP), 2 Commonsense-Datensätze (CommonsenseQA, StrategyQA), 2 symbolische Reasoning-Aufgaben (Last Letter, Coin Flip), 2 weitere logische Reasoning-Aufgaben (Date Understanding, Tracking Shuffled Objects)

## Hauptargumente

- Large Language Models verfügen über fundamentale Zero-Shot-Reasoning-Fähigkeiten, die durch gezielte Prompting-Strategien aktiviert werden können, ohne dass task-spezifische Few-Shot-Beispiele erforderlich sind. Diese Fähigkeiten wurden in der Forschung bislang unterschätzt.
- Das Zero-Shot-CoT-Verfahren ist universal anwendbar und task-agnostisch: Ein einziger Prompt funktioniert konsistent über arithmetische, symbolische, Commonsense- und logische Reasoning-Aufgaben hinweg, während Few-Shot-CoT-Ansätze task-spezifische Engineering benötigen.
- Die Skalierungskurven von Zero-Shot-CoT nähern sich denen von Few-Shot-CoT an und verbessern sich mit Model-Größe, was darauf hindeutet, dass höherstufige kognitive Fähigkeiten (generisches logisches Reasoning) durch einfaches Prompting extrahiert werden können, ohne Finetuning oder aufwändiges Prompt-Design.

## Kategorie-Evidenz

### Evidenz 1

Das Paper diskutiert fundamentale Fähigkeiten und Kompetenzen im Umgang mit LLMs: 'we show that LLMs are decent zero-shot reasoners by simply adding Let's think step by step before each answer' und betont die Wichtigkeit, 'zero-shot knowledge hidden inside LLMs' zu verstehen.

### Evidenz 2

Fokus auf große vortrainierte Sprachmodelle (LLMs) wie GPT-3, InstructGPT und PaLM: 'Pretrained large language models (LLMs) are widely used in many sub-fields of natural language processing (NLP)'

### Evidenz 3

Zentrale Methodik ist Chain-of-Thought-Prompting und Zero-Shot-Prompting: 'Zero-shot-CoT, using the same single prompt template' und 'simply adding Let's think step by step before each answer'

### Evidenz 4

Das Paper behandelt NLP, Reasoning-Aufgaben, In-Context-Learning und Skalierungsgesetze von Sprachmodellen, die über generatives Prompting hinausgehen

## Assessment-Relevanz

**Domain Fit:** Das Paper ist primär ein Beitrag zur KI/NLP-Forschung mit Fokus auf Prompting-Engineering und hat keine direkte Relevanz für die Schnittstelle zwischen KI und Sozialer Arbeit oder Gender Studies. Es adressiert technische Aspekte von Sprachmodellen, nicht deren soziale Implikationen oder Anwendungen in sozialen Kontexten.

**Unique Contribution:** Die bahnbrechende Erkenntnis, dass einfaches Zero-Shot-Prompting ('Let's think step by step') mit großen Sprachmodellen für komplexes Multi-Step-Reasoning funktioniert, ohne task-spezifische Exemplare zu benötigen, wird mit umfangreichen empirischen Evidenzen auf 12 Benchmarks und mehreren Modellen untermauert.

**Limitations:** Das Paper konzentriert sich ausschließlich auf technische Leistungsmessungen und adressiert nicht die potentiellen negativen Auswirkungen, Bias oder Fairness-Probleme der evaluierten LLMs; es fehlt auch eine kritische Reflexion über die sozialen oder ethischen Implikationen der Technologie.

**Target Group:** Primär KI-Forscher, NLP-Praktiker, Machine-Learning-Ingenieure und Entwickler, die mit großen Sprachmodellen arbeiten; sekundär Technologie-Manager und Policy-Maker im AI-Bereich. Nicht direkt relevant für Sozialarbeiter, Gender-Forscher oder kritische Technologie-Studien ohne zusätzliche Kontextualisierung.

## Schlüsselreferenzen

- [[Wei_et_al_2022]] - Chain of Thought Prompting
- [[Brown_et_al_2020]] - Language Models are Few-Shot Learners (GPT-3)
- [[Chowdhery_et_al_2022]] - PaLM: Scaling Language Modeling with Pathways
- [[Liu_et_al_2021]] - Pre-train, Prompt, and Predict
- [[Vaswani_et_al_2017]] - Attention is All You Need
- [[Devlin_et_al_2019]] - BERT: Pre-training of Deep Bidirectional Transformers
- [[Raffel_et_al_2020]] - Exploring the Limits of Transfer Learning with Unified Text-to-Text Transformer
- [[Wang_et_al_2022]] - Self-Consistency Improves Chain of Thought Reasoning
- [[Stanovich_and_West_2000]] - System 1 and System 2 Thinking
- [[Srivastava_et_al_2022]] - Beyond the Imitation Game: Quantifying and Extrapolating the Capabilities of Language Models
