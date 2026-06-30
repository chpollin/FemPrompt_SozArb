---
title: "Evaluating Gender Bias in Large Language Models via Chain-of-Thought Prompting"
authors: ["Masahiro Kaneko", "Danushka Bollegala", "Naoaki Okazaki", "Timothy Baldwin"]
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
source_file: Kaneko_2024_Debiasing_prompts_for_gender_bias_in_large.md
---

# Evaluating Gender Bias in Large Language Models via Chain-of-Thought Prompting

## Kernbefund

CoT-Prompting reduziert systematisch Geschlechterbias in LLMs signifikant, indem es Modelle dazu zwingt, ihre versteckten Annahmen über Geschlechterstereotypen explizit zu artikulieren, selbst bei einfachen Zählaufgaben.

## Forschungsfrage

Kann Chain-of-Thought (CoT) Prompting Geschlechterbias in Large Language Models bei unscalierbaren Aufgaben reduzieren?

## Methodik

Empirisch: Benchmark-Konstruktion (Multi-step Gender Bias Reasoning - MGBR), experimentelle Evaluierung mit 23 LLMs, Vergleich von sechs Prompting-Strategien (Zero-shot, Few-shot, CoT, Debiasing Prompts), Korrelationsanalyse mit bestehenden Bias-Metriken (BBQ, BNLI, CrowS-Pairs, StereoSet), statistische Tests (McNemar's test).
**Datenbasis:** 23 verschiedene LLMs getestet (OPT-Familie: 125m-66b, Llama2-Familie: 7b-70b, GPT-J, MPT, Falcon, Phi, Mistral, BioGPT); Benchmark mit zufällig generierten Word-Listen; multiple Test-Instanzen mit randomisierten Parametern.

## Hauptargumente

- Trotz ihrer beeindruckenden Reasoning-Fähigkeiten internalisieren und reproduzieren LLMs diskriminierende gesellschaftliche Biases aus ihrer Trainingskorpora, was sich auch bei kognitiv einfachen Aufgaben wie Wörter zählen manifestiert.
- Chain-of-Thought-Prompting, das Schritt-für-Schritt-Erklärungen für jeden einzelnen Schritt verlangt (z.B. explizite Geschlechtsklassifizierung jedes Wortes), zwingt Modelle ihre impliziten Annahmen zu externalisieren und reduziert damit unbewusste Biases signifikant.
- Die neu entwickelte MGBR-Benchmark zeigt unterschiedliche Korrelationsmuster mit bestehenden Bias-Evaluierungsmetriken und misst eine andere Dimension von Bias (sogenannte intrinsic bias vs. extrinsic bias), was auf die Notwendigkeit mehrfacher Evaluierungsperspektiven hinweist.

## Kategorie-Evidenz

### AI_Literacies

Das Paper adressiert die kritische Fähigkeit, LLMs zu verstehen und ihre Biases zu evaluieren. Es zeigt, wie CoT-Prompting als Instrument zur bewussteren Nutzung von LLMs fungiert: 'Humans organize their thoughts through natural language, enabling them to make better decisions'.

### Generative_KI

Fokus auf Large Language Models und ihre inhärenten Biases: 'Despite the impressive performance, unfortunately LLMs still learn unfair social biases'. Evaluation von 23 verschiedenen LLMs (OPT, Llama2, GPT-J, etc.).

### Prompting

Zentrale Methodik basiert auf Prompting-Strategien: 'In CoT, an LLM is required to explain step-by-step whether a word is feminine... Zero-shot+CoT follows Kojima et al. (2022) and adds "Let's think step by step"'.

### KI_Sonstige

Behandelt fundamentale NLP-Herausforderungen wie Wort-Embedding-Bias: 'Models do not explicitly learn the meanings of words but do so implicitly from the co-occurrences of tokens in a corpus, which can lead to flawed associations between words'.

### Bias_Ungleichheit

Hauptfokus auf algorithmischen Bias und diskriminierende Vorhersagen: 'Without step-by-step prediction, most LLMs make socially biased predictions, despite the task being as simple as counting words'. Das Paper zeigt systematische Verzerrungen in der Klassifikation von Berufen nach Geschlecht.

### Gender

Explizites Gender-Fokus in Benchmark-Design und Evaluation: 'We construct a benchmark for an unscalable task where the LLM is given a list of words comprising feminine, masculine, and gendered occupational words'. Die gesamte Studie konzentriert sich auf Geschlechterstereotypen.

### Diversitaet

Erkennt Begrenztheit der binären Geschlechtsperspektive: 'For future work, potential areas of exploration include extending the application of CoT techniques to non-binary genders (Dev et al., 2021b; Ovalle et al., 2023)' und erwähnt andere Formen sozialer Biases (Rasse, Religion).

### Fairness

Fairness ist zentral zur Evaluierungsmethodik: 'If an LLM is unbiased, the inclusion of occupational words in the input should not affect its prediction accuracy. However, if an LLM is gender biased, it might incorrectly count occupations as feminine or masculine words'. Verwendet Fairness-Konzepte zur Bias-Messung.

## Assessment-Relevanz

**Domain Fit:** Das Paper hat moderaten Bezug zur Sozialen Arbeit. Während es sich primär mit KI-technischen Fragen beschäftigt, sind die Erkenntnisse über Geschlechterstereotypen und Bias-Mitigation in KI-Systemen für Sozialarbeiter:innen relevant, die zunehmend algorithmen-gestützte Systeme in ihrer Praxis nutzen oder von diesen beeinflusst werden.

**Unique Contribution:** Die Konstruktion eines Benchmark-Datensatzes (MGBR), der spezifisch unbewussten Geschlechterbias durch eine einfache aber strikte Zählaufgabe operationalisiert und nachweist, dass CoT-Prompting durch Externalisierung von Stereotypen Bias reduzieren kann - während gleichzeitig die Differenzierung zwischen intrinsic und extrinsic Bias-Metriken beleuchtet wird.

**Limitations:** Das Paper evaluiert nur englische Sprachfähigkeiten, konzentriert sich ausschließlich auf binäre Geschlechterkategorien und Geschlechterbias (nicht Rasse, Religion, etc.), und die Studienautoren betonen selbst: 'intrinsic bias evaluation does not necessarily correlate with extrinsic bias evaluation' - es ist unklar ob CoT-Debiasing in echten downstream tasks genauso wirkt.

**Target Group:** Primär: NLP/KI-Forscher:innen und KI-Entwickler:innen, die sich mit Bias-Evaluierung und Debiasing-Methoden auseinandersetzen. Sekundär: Policy-Maker und KI-Ethics-Spezialist:innen, die an Fairness und Governance von LLMs arbeiten. Tertiär: Sozialarbeiter:innen und andere Praktiker:innen, die verstehen möchten, wie Bias in KI-gestützten Systemen funktioniert und potenziell gemindert werden kann.

## Schlüsselreferenzen

- [[Wei_et_al_2022]] - Chain-of-Thought Prompting Elicits Reasoning in Large Language Models
- [[Bolukbasi_et_al_2016]] - Man is to Computer Programmer as Woman is to Homemaker? Debiasing Word Embeddings
- [[Parrish_et_al_2022]] - BBQ: A Hand-Built Bias Benchmark for Question Answering
- [[Nadeem_et_al_2021]] - StereoSet: Measuring stereotypical bias in pretrained language models
- [[Nangia_et_al_2020]] - CrowS-Pairs: A Challenge Dataset for Measuring Social Biases in Masked Language Models
- [[Ganguli_et_al_2023]] - The Capacity for Moral Self-Correction in Large Language Models
- [[Kojima_et_al_2022]] - Large Language Models are Zero-Shot Reasoners
- [[Dev_et_al_2021]] - Harms of Gender Exclusivity and Challenges in Non-binary Representation in Language Technologies
- [[Kaneko_and_Bollegala_2022]] - Unmasking the Mask: Evaluating Social Biases in Masked Language Models
- [[Brown_et_al_2020]] - Language Models are Few-Shot Learners
