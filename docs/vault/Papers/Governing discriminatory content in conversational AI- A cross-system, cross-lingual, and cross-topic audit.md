---
title: Governing discriminatory content in conversational AI: A cross-system, cross-lingual, and cross-topic audit
authors:
  - J. Zeng
  - K. van Es
year: 2025
type: journalArticle
url: https://doi.org/10.1080/1369118X.2025.2537803
doi: 10.1080/1369118X.2025.2537803
tags:
  - paper
  - feminist-ai
  - bias-research
date_added: 2026-02-22
date_modified: 2026-02-22
mitigation_strategies:
  - Fine-tuning
---

# Governing discriminatory content in conversational AI: A cross-system, cross-lingual, and cross-topic audit

## Abstract

Conducts mixed-method audit of how major conversational AI systems respond to and regulate discriminatory content. Analysis is cross-system, cross-lingual, and cross-topic, revealing that refusal sensitivity and answering strategies vary significantly across all three axes. Discusses value alignment process through reinforcement learning with human feedback and implementation of guardrails, highlighting tensions when tech platforms become arbiters of morality.

## Key Concepts

### Mitigation Strategies
- [[Fine-tuning]]

## Full Text

---
title: "Governance of discriminatory content in conversational AIs: a cross-platform and cross-cultural analysis"
authors: ["Na Ta", "Jing Zeng", "Zhanghao Li"]
year: 2025
type: journalArticle
language: en
processed: 2026-02-05
source_file: Zeng_2025_Governing_discriminatory_content_in.md
confidence: 88
---

# Governance of discriminatory content in conversational AIs: a cross-platform and cross-cultural analysis

## Kernbefund

Erhebliche Unterschiede in Refusal-Raten zwischen Systemen (0,54%-21,70%) und Sprachen; identifiziert vier typische Antwortstrategien bei diskriminatorischen Fragen: Moral arbiter, Know-it-all expert, Non-confrontational fence-sitter, Local values ideologue.

## Forschungsfrage

Wie regulieren verschiedene conversational AI-Systeme diskriminatorische Inhalte unterschiedlich je nach Plattform, Sprache und kulturellem Kontext?

## Methodik

Mixed Methods: Quantitativ - algorithmic auditing mit 28.314 Responses über API-Tests (ChatGPT, Gemini, Llama, Ernie Bot, Tongyi, ChatGLM); Qualitativ - thematische Analyse von 1.100 Konversationen mit Refusal-Detektion und Kategorisierung von Antwortstrategien.
**Datenbasis:** 28.314 Responses aus doppelten Durchläufen; 1.100 annotierte Konversationen für qualitative Analyse; zwei unabhängige Annototatoren (Krippendorff alpha 0,9212); Konsistenztests über Läufe (F1-Scores 0,83-1,0)

## Hauptargumente

- Generative AI-Systeme unterliegen unterschiedlichen regulatorischen Rahmenbedingungen (US: Innovationsorientierung, China: Top-down Governance, EU: AI Act) und implementieren daher divergente Content-Moderationsmechanismen, was zu inkonsistenten Governance-Strategien führt.
- Diskriminatorische Inhalte entstehen durch Training auf biased Web-Daten (z.B. Reddit mit toxischen Communities); während Unternehmen durch Value Alignment und Guardrails gegensteuern, zeigen Ergebnisse dass diese Mechanismen ungleich wirksam sind und problematische Bias perpetuieren.
- Die vier identifizierten Antwortstrategien (moralischer Arbiter vs. neutraler Fence-Sitter vs. Expert vs. lokale Ideologie) reflektieren zugrunde liegende Governance-Philosophien: Western systems betonen Moralurteil; chinesische Systeme lokalisieren und kontextualisieren; andere weichen aus - was auf ungelöste Spannung zwischen technologischer Fairness und plattformspezifischer Verantwortung hindeutet.

## Kategorie-Evidenz

### Evidenz 1

Fokus auf conversational AI-Systeme: 'ChatGPT and others', 'LLM-powered applications', detailed analysis of ChatGPT, Gemini, Ernie Bot, etc.

### Evidenz 2

Algorithm auditing basiert auf systematisch konstruierten Prompts zur Detektion diskriminatorischer Inhalte; 'constructed prompts for auditing conversational AI systems'

### Evidenz 3

Klassisches ML/NLP: Large Language Models, training data bias, fine-tuning, value alignment, guardrails als Sicherheitsmechanismen

### Evidenz 4

Zentral: 'discriminatory content output unjustly differentiating or prejudicing individuals or groups based on specific attributes'; Analyse von Bias zu Race, Religion, Sexual Orientation, Age, Disability, Gender

### Evidenz 5

Explizite Analyse von Gender-Bias; 'gender prompts', Unterschiede bei weiblichen vs. männlichen Framing; Sexualorientierung (lesbian, gay, bisexual)

### Evidenz 6

Analyse marginalisierter Gruppen: Black people, Indians, Asians; LGBTQ+ Orientierungen (homosexuality, lesbianism, bisexuality); Religion (Islam, Christianity, Buddhism); Disability; Age

### Evidenz 7

Fairness und Transparenz als zentrale Prinzipien; 'fairness is upheld at a systemic rather than merely cosmetic level'; Analyse disparater Auswirkungen auf verschiedene Gruppen

## Assessment-Relevanz

**Domain Fit:** Das Paper ist relevant für KI-Governance und algorithmische Fairness, aber nicht direkt für Soziale Arbeit. Jedoch: Die Analyse von Bias in AI-Systemen betrifft vulnerable Gruppen (Armut, Sexualorientierung, Behinderung, Race), die zentral für sozialarbeiterische Praxis sind; Findings zur Gatekeeping-Funktion von KI haben Implikationen für Wohlfahrtssysteme.

**Unique Contribution:** Erste vergleichende cross-lingual und cross-platform Audit von chinesischen und Silicon Valley KI-Systemen bezüglich diskriminatorischer Inhalte; methodischer Framework für systematische Chatbot-Governance-Analyse; empirische Evidenz für divergente Governance-Philosophien zwischen Kulturräumen.

**Limitations:** Begrenzt auf 6 chatbot-Systeme und englisch/chinesisch; Prompts fokussieren auf spezifische Diskriminierungstypen (race, religion, sexuality, gender, age, disability) möglicherweise nicht alle relevanten Formen; qualitative Analyse basiert auf 1.100 Samples (begrenzte Tiefe); Auswirkungen auf reale Nutzer:innen nicht gemessen.

**Target Group:** AI-Entwickler und Product Manager; Policymaker und Regulatoren (besonders China/US Vergleich); KI-Ethik-Forscher:innen; Fairness-Auditor:innen; kritische Plattformstudien; bedingt relevant für Sozialarbeiter:innen die mit KI-gestützten Systemen arbeiten oder diese kritisch evaluieren sollen

## Schlüsselreferenzen

- [[Gillespie_2018]] - Custodians of the Internet: Platforms, content moderation, and the hidden decisions
- [[Schramowski_et_al_2022]] - Large pretrained language models contain human-like biases of what is right and wrong
- [[Ouyang_et_al_2022]] - Training language models to follow instructions with human feedback
- [[Roberts_2019]] - Behind the Screen
- [[Gehman_et_al_2020]] - Real Toxicity Prompts: Evaluating neural toxic degeneration in language models
- [[Baack_2024]] - A Critical Analysis of the Largest Source for Generative AI Training Data: Common Crawl
- [[Stańczak_et_al_2023]] - Quantifying gender bias towards politicians in cross-lingual language models
- [[Neff_Nagy_2016]] - Talking to bots: Symbiotic agency and the case of Tay
- [[Jobin_et_al_2019]] - The global landscape of AI ethics guidelines
- [[Zeng_van_Es_2025]] - The techno-politics of conversational AI's moral agency
