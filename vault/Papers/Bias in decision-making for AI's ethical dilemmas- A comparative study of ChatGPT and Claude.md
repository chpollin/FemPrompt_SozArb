---
title: "Bias in decision-making for AI's ethical dilemmas: A comparative study of ChatGPT and Claude"
authors:
  - Z. Wu
year: 2025
type: report
doi: 
url: "https://arxiv.org/html/2501.10484v2"
tags:
  - paper
llm_decision: Exclude
llm_confidence: 0.3
llm_categories:
  - Generative_KI
  - Bias_Ungleichheit
human_decision: Include
human_categories:
  - Generative_KI
  - Bias_Ungleichheit
  - Gender
  - Diversitaet
  - Fairness
agreement: disagree
---

# Bias in decision-making for AI's ethical dilemmas: A comparative study of ChatGPT and Claude

## Transformation Trail

### Stufe 1: Extraktion & Klassifikation (LLM)

**Extrahierte Kategorien:** AI_Literacies, Generative_KI, KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet, Fairness
**Argumente:** 3 extrahiert

### Stufe 3: Verifikation (LLM)

| Metrik | Score |
|--------|-------|
| Completeness | 88 |
| Correctness | 92 |
| Category Validation | 93 |
| **Overall Confidence** | **91** |

### Stufe 4: Assessment

**LLM:** Exclude (Confidence: 0.3)
**Human:** Include

**Kategorie-Vergleich (bei Divergenz):**

| Kategorie | Human | LLM | Divergent |
|-----------|-------|-----|----------|
| AI_Literacies | Nein | Nein |  |
| Generative_KI | Ja | Ja |  |
| Prompting | Nein | Nein |  |
| KI_Sonstige | Nein | Nein |  |
| Soziale_Arbeit | Nein | Nein |  |
| Bias_Ungleichheit | Ja | Ja |  |
| Gender | Ja | Nein | X |
| Diversitaet | Ja | Nein | X |
| Feministisch | Nein | Nein |  |
| Fairness | Ja | Nein | X |

> Siehe [[Divergenz Wu_2025_Bias_in_decision-making_for_AI's_ethical_dilemmas]] fuer detaillierte Analyse


## Key Concepts

- [[Algorithmic Bias in Large Language Models]]
- [[Algorithmic Fairness]]
- [[Intersectional Discrimination]]

## Wissensdokument

# Bias in Decision-Making for AI's Ethical Dilemmas: A Comparative Study of ChatGPT and Claude

## Kernbefund

Beide LLMs zeigen signifikante Biases bei geschützten Attributen in ethischen Entscheidungen: GPT-3.5 Turbo bevorzugt stereotypisch dominante Gruppen (nicht-behinderte, männliche, hellhäutige, mittelaltrige Personen), während Claude 3.5 Sonnet ausgewogenere Präferenzen zeigt. Beide Modelle bevorzugen stark 'Good-looking' Personen, und die ethische Sensibilität sinkt drastisch in komplexeren intersektionalen Szenarien. Linguistische Referenten (z.B. 'Yellow' vs. 'Asian') beeinflussen die ethischen Bewertungen erheblich.

## Forschungsfrage

Weisen Large Language Models (LLMs) Bias bei geschützten Attributen auf und unterscheiden sich GPT-3.5 Turbo und Claude 3.5 Sonnet in ihren ethischen Entscheidungsmustern systematisch?

## Methodik

Empirisch - Simulationsstudie mit systematischer Evaluation von LLM-Antworten zu ethischen Dilemmata; 11.200 experimentelle Durchläufe mit kontrollierten Variationen von geschützten Attributen (Alter, Geschlecht, Rasse, Aussehen, Behinderungsstatus) in einzelnen und intersektionalen Kombinationen; quantitative Analyse mittels Normalized Frequency, Ethical Preference Priority, Sensitivity, Stability und Clustering-Analysen.
**Datenbasis:** n=11.200 experimentelle Trials (5.600 pro Modell); 7 Gruppen geschützter Attribute (20 Attribute insgesamt); 50 Iterationen pro Attributgruppe; 4 Wiederholungsrunden; Vergleich von GPT-3.5 Turbo und Claude 3.5 Sonnet

## Hauptargumente

- LLMs prägen Menschenrechte und Gerechtigkeit durch ihre ethischen Entscheidungsmuster: Die starke Präferenz für 'Good-looking' und die Diskriminierung von 'Unpleasant-looking', 'African', 'Yellow' und 'Disabled' Personen dokumentiert, dass Biases nicht zufällig sind, sondern systematische Muster menschlicher Diskriminierung reproduzieren, die in Trainingsdaten kodiert sind.
- Intersektionale Komplexität enthüllt versteckte Biases und verschärft ethische Risiken: Während Single-Attribute-Szenarios bereits Biases zeigen, sinkt die ethische Sensibilität (Unselected Frequency) in intersektionalen Szenarien bei beiden Modellen deutlich ab. Dies deutet darauf hin, dass LLMs mit mehrfach marginalisierten Personen besonders problematisch umgehen und ihre Vulnerabilität nicht erfassen können.
- Unterschiedliche Modellarchitekturen perpetuieren unterschiedliche Unterdrückungsmuster: GPT-3.5 zeigt Bias zugunsten traditioneller Machtstrukturen (Non-disabled, Masculine, Caucasian), während Claude diversere Präferenzen aufweist. Dies suggeriert, dass Trainings- und Fine-Tuning-Prozesse nicht neutral sind, sondern konkrete Machtverhältnisse widerspiegeln und bei Deployment in autonomen Systemen zu unterschiedlichen Diskriminierungsmustern führen.

## Kategorie-Evidenz

### Evidenz 1

Die Studie adressiert kritisches Verständnis von LLM-Funktionsweisen und deren ethischen Limitationen: 'it is undeniable that ethical limitations in AI still exist and should be publicly acknowledged' und 'it's crucial to demystify their performance in ethical contexts'

### Evidenz 2

Fokus auf zwei prominente LLM-Modelle: 'Using two prominent models - GPT-3.5 Turbo and Claude 3.5 Sonnet' und systematische Analyse ihrer Antwortmuster in ethischen Dilemmata

### Evidenz 3

Breites KI-Fairness-Framework: 'bias being a prominent representative' von ethischen Problemen in ML-Systemen und Analyse von 'algorithmische Biases' im Allgemeinen

### Evidenz 4

Zentrale Fokussierung auf Diskriminierung und strukturelle Benachteiligung: 'The biased outputs may lead to unfair treatment to the underrepresented individuals or groups of people, exacerbate the pre-existing inequalities' und 'systematic neglect of others'

### Evidenz 5

Geschlecht als geschütztes Attribut systematisch untersucht: 'Gender' in den 7 Attributgruppen mit Masculine, Feminine, Androgynous; Befund: 'Claude 3.5 Sonnet demonstrated more diverse protected attribute choices' inkl. Feminine-Präferenzen

### Evidenz 6

Intersektionale und diversitätsorientierte Analyse: '7 groups of 20 attributes', 'intersectional protected attribute combinations', Analyse von Race (Asian, Caucasian, African), Age, Disability Status; Befund: 'ethical sensitivity significantly decreases in more complex scenarios involving multiple protected attributes'

### Evidenz 7

Explizite Fairness-Fokussierung: 'justice and fairness' als zentrale Ethik-Prinzipien; 'fairness, justice, and accountability of ethical AI'; systematische Fairness-Metriken (Normalized Frequency, Preference Priority, Sensitivity, Stability, Clustering); algorithmic fairness Framework

## Assessment-Relevanz

**Domain Fit:** Das Paper ist hochrelevant für Schnittstellen von KI und sozialer Gerechtigkeit, hat aber keinen direkten Bezug zu Sozialer Arbeit als Berufspraxis. Für KI-Ethik, Fairness und die Analyse von Diskriminierungsmustern in autonomen Systemen ist es zentral; die Erkenntnisse sind für Soziale Arbeit relevant, falls KI-Systeme in Entscheidungen mit betroffenen Gruppen eingebunden werden (z.B. Risikobewertung, Ressourcenallokation).

**Unique Contribution:** Erste systematische vergleichende Analyse von GPT und Claude über 11.200 Trials mit intersektionalen geschützten Attributen in ethischen Dilemmata, die zeigt, dass ethische Sensibilität in komplexeren Szenarien kollabiert und linguistische Referenten zentral sind – methodologisch rigorose Quantifizierung von LLM-Biases jenseits einzelner Attribute.

**Limitations:** Keine Angabe zur Validierung der 'ethischen Korrektheit' der Modell-Antworten gegen normative Standards; begrenzt auf zwei Modelle und englischsprachige Prompts; kein Einbezug von Open-Source-Modellen; Mechanismen hinter Biases unklar aufgrund mangelnder Modell-Transparenz; keine Analyse möglicher Interventionen oder Debiasing-Strategien.

**Target Group:** KI-Entwickler und Designteams (insbes. bei ChatGPT/Claude-Integration), AI Ethics Researcher, Policy Maker in AI Governance, Organisationen mit autonomen Entscheidungssystemen (Autonomous Driving, Disaster Response), Sozialarbeiter:innen die KI-Systeme kritisch evaluieren müssen, Fairness und Accountability Auditor:innen

## Schlüsselreferenzen

- [[Obermeyer_et_al_2019]] - Dissecting racial bias in an algorithm used to manage the health of populations
- [[Jobin_Ienca_Vayena_2019]] - The global landscape of AI ethics guidelines
- [[Floridi_Cowls_2022]] - A unified framework of five principles for AI in society
- [[Barocas_Hardt_Narayanan_2023]] - Fairness and Machine Learning: Limitations and Opportunities
- [[Kearns_et_al_2018]] - Preventing Fairness Gerrymandering: Auditing and Learning for Subgroup Fairness
- [[Stahl_Stahl_2021]] - Ethical issues of AI
- [[Gallegos_et_al_2024]] - Bias and fairness in large language models: A survey
- [[CorbettDavies_et_al_2024]] - The measure and mismeasure of fairness
- [[Hofmann_et_al_2024]] - AI generates covertly racist decisions about people based on their dialect
- [[Naveed_et_al_2023]] - A comprehensive overview of large language models
