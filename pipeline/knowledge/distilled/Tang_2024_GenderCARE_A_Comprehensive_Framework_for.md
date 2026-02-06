---
title: "GenderCARE: A Comprehensive Framework for Assessing and Reducing Gender Bias in Large Language Models"
authors: ["Kunsheng Tang", "Wenbo Zhou", "Jie Zhang", "Aishan Liu", "Gelei Deng", "Shuai Li", "Peigui Qi", "Weiming Zhang", "Tianwei Zhang", "Nenghai Yu"]
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
source_file: Tang_2024_GenderCARE_A_Comprehensive_Framework_for.md
confidence: 95
---

# GenderCARE: A Comprehensive Framework for Assessing and Reducing Gender Bias in Large Language Models

## Kernbefund

Das GenderCARE Framework reduziert Gender-Bias in LLMs um bis zu 90% (durchschnittlich über 35% bei 17 LLMs), während die Leistung in Standard-NLP-Tasks unter 2% variabel bleibt. Das Framework etabliert erstmals explizite Kriterien für Gender-Gleichheit (Inclusivity, Diversity, Explainability, Objectivity, Robustness, Realisticity) und integriert bisher übersehene Gruppen wie Transgender und Non-Binary Individuen.

## Forschungsfrage

Wie können wir Gender-Bias in Large Language Models durch einheitliche Kriterien, umfassende Bewertung und effektive Reduktionsstrategien systematisch adressieren?

## Methodik

Empirisch und Mixed-Method: Entwicklung eines Bewertungs-Frameworks (GenderPair Benchmark), Analyse von 17 verschiedenen LLMs, quantitative Metriken (Bias-Pair Ratio, Toxicity, Regard), Debiasing durch Counterfactual Data Augmentation und LoRA Fine-Tuning, vergleichende Analyse mit bestehenden Benchmarks (Winoqueer, BOLD, StereoSet)
**Datenbasis:** 17 verschiedene LLMs (Alpaca, Vicuna, Llama, Orca, StableBeluga, Llama2, Platypus2, FalconInstruct, Mistral-Instruct, Baichuan2-Chat); GenderPair Benchmark mit Pair Sets aus medialen Kommentaren und beruflichen Geschlechterverhältnissen; Evaluierung auf GLUE und MMLU Tasks; Expert-Review und GPT-4 Validierung der Debiasing-Daten

## Hauptargumente

- Bestehende Gender-Bias Benchmarks (Winoqueer, BOLD, StereoSet) weisen erhebliche Mängel auf: Template-basierte Ansätze leiden unter mangelnder Explizierbarkeit, Phrase-basierte Methoden erben Biases aus öffentlichen Ressourcen, und option-basierte Ansätze ignorieren Open-Ended Responses und marginalisierte Gruppen wie TGNB-Personen.
- Das GenderCARE Framework etabliert sechs standardisierte Kriterien für Gender-Gleichheit Benchmarks (Inclusivity, Diversity, Explainability, Objectivity, Robustness, Realisticity), die wissenschaftliche Rigorosität und praktische Inklusivität sichern und erstmals Transgender und Non-Binary Identitäten systematisch einbeziehen.
- Eine dual-pronged Debiasing-Strategie kombinierend Counterfactual Data Augmentation mit LoRA Fine-Tuning reduziert Gender-Bias signifikant (bis 90%), während Core-Performance-Metriken (GLUE, MMLU) stabil bleiben (<2% Varianz), was die Balance zwischen Fairness und Funktionalität demonstriert.

## Kategorie-Evidenz

### AI_Literacies

Das Paper adressiert kritische KI-Kompetenzentwicklung durch Framework-Kriterien für systematische Bias-Erkennung und Debiasing-Strategien, die notwendiges Wissen für verantwortungsvollen Umgang mit LLMs vermitteln: 'By offering a realistic assessment and tailored reduction of gender biases, we hope that our Gender CARE can represent a significant step towards achieving fairness and equity in LLMs.'

### Generative_KI

Fokus auf Large Language Models (ChatGPT, GPT-3.5, GPT-4): 'Large Language Models (LLMs) have become pivotal in natural language generation tasks' und explizite Evaluierung von LLMs wie Alpaca, Vicuna, Llama, Mistral etc.

### Prompting

Prompt-Engineering durch die GenderPair Benchmark-Konstruktion mit strukturierten Pair Sets und Instruktionen: 'For configurations (3) to (6), the instructions are formulated as: Please generate a coherent text by choosing a pair from the following set of phrase pairs'

### KI_Sonstige

Breiter KI-Fokus auf Natural Language Processing, Klassisches Machine Learning (LoRA Fine-Tuning), Toxicity Detection, Sentiment Analysis: 'We employ Low-Rank Adaptation (LoRA) fine-tuning [25]. This method allows for the modification of parameters related to gender bias while freezing other parameters.'

### Bias_Ungleichheit

Zentrale Thematisierung algorithmischen Bias und digitaler Diskriminierung: 'a recent survey conducted by QueerInAI reveals that more than 65% of respondents from the marginalized community LGBTQIA+ experience increased digital discrimination correlating with biased AI outputs'

### Gender

Expliziter Gender-Fokus mit Analyse von Gender-Bias in LLMs und Geschlechterstereotypen: 'LLMs, such as GPT-3.5, reinforce stereotypes for various gender groups' und umfassende Evaluation gender-spezifischer Bias-Metriken

### Diversitaet

Inklusive Perspektive auf marginalisierte Communities, insbesondere TGNB-Personen: 'More importantly, most of these existing approaches fail to adequately consider individuals who are identified as transgender and non-binary (TGNB) when constructing gender bias benchmarks.' Inclusivity ist explizit definiertes Criterion.

### Fairness

Algorithmische Fairness ist Kernthema mit definierten Fairness-Metriken (Bias-Pair Ratio, Toxicity, Regard) und Fairness-aware Debiasing-Strategien: 'By offering a realistic assessment and tailored reduction of gender biases, we hope that our Gender CARE can represent a significant step towards achieving fairness and equity in LLMs.'

## Assessment-Relevanz

**Domain Fit:** Sehr hohe Relevanz für die Schnittstelle KI und Soziale Gerechtigkeit: Das Paper adressiert systematisch Gender-Bias und Diskriminierung marginalisierter Communities (LGBTQIA+, TGNB) in KI-Systemen, die zunehmend in der Sozialarbeit und sozialen Diensten eingesetzt werden. Es trägt zu grundlegende Fragen von Algorithmic Fairness und sozialer Gerechtigkeit bei, die für sozialarbeiterische Praxis zentral sind.

**Unique Contribution:** Erstmals werden explizite, standardisierte Kriterien für Gender-Gleichheit in Bias-Benchmarks etabliert, und erstmals werden Transgender und Non-Binary Identitäten systematisch in umfassenden Gender-Bias-Evaluierungen integriert; kombiniert mit praktisch effektiven Debiasing-Strategien.

**Limitations:** Das Paper fokussiert primär auf englischsprachige LLMs und englische Daten; die Generalisierbarkeit auf andere Sprachen und kulturelle Kontexte ist unklar; die Evaluation marginalisierter Gruppen basiert auf Daten aus Nordamerika (SSA Namensdaten, englische Wikipedia); die Langzeiteffekte von LoRA-Debiasing auf Model-Robustheit werden nicht vollständig untersucht.

**Target Group:** AI-Entwickler und MLOps-Ingenieure, die LLMs entwickeln oder deployen; Fairness- und Ethik-Expert:innen im AI-Bereich; Policymaker und Regulatoren im Kontext von AI Governance; Vertreter:innen von marginalierten Communities (LGBTQIA+, TGNB); Sicherheitsforschung und AI Safety Community; potenziell Sozialarbeiter:innen, die mit KI-gestützten Systemen arbeiten oder diese kritisch evaluieren müssen

## Schlüsselreferenzen

- [[Buolamwini_Buolamwini_2018]] - Gender Shades
- [[Zhao_et_al_2018]] - Gender Bias in Coreference Resolution: Evaluation and Debiasing Methods
- [[Dhamala_et_al_2021]] - BOLD: Dataset and Metrics for Measuring Biases in Open-Ended Language Generation
- [[Nadeem_et_al_2021]] - StereoSet: Measuring stereotypical bias in pretrained language models
- [[Sheng_et_al_2019]] - The Woman Worked as a Babysitter: On Biases in Language Generation
- [[Felkner_et_al_2023]] - WinoQueer: A Community-in-the-Loop Benchmark for Anti-LGBTQ+ Bias in Large Language Models
- [[Ovalle_et_al_2023]] - I'm fully who I am: Towards Centering Transgender and Non-Binary Voices to Measure Biases in Open Language Generation
- [[Kapoor_Narayanan_2023]] - Quantifying ChatGPT's gender bias
- [[Hu_et_al_2022]] - LoRA: Low-Rank Adaptation of Large Language Models
- [[National_Institute_of_Standards_and_Technology_NIST_2023]] - Trustworthy and Responsible AI
