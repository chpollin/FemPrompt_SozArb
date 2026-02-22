---
title: Improving human-AI partnerships in child welfare: Understanding worker practices, challenges, and desires for algorithmic decision support
authors:
  - A. Kawakami
  - V. Sivaraman
  - H.-F. Cheng
  - L. Stapleton
  - Y. Cheng
  - D. Qing
  - A. Perer
  - Z. S. Wu
  - H. Zhu
  - K. Holstein
year: April 30
type: conferencePaper
doi: 10.1145/3491102.3517439
tags:
  - paper
  - feminist-ai
  - bias-research
date_added: 2026-02-22
date_modified: 2026-02-22
bias_types: []
mitigation_strategies: []
llm_decision: Include
llm_confidence: 0.95
llm_categories:
  - AI_Literacies
  - KI_Sonstige
  - Soziale_Arbeit
  - Bias_Ungleichheit
  - Fairness
human_decision: Exclude
human_categories:
  - KI_Sonstige
  - Bias_Ungleichheit
agreement: disagree
---

# Improving human-AI partnerships in child welfare: Understanding worker practices, challenges, and desires for algorithmic decision support

## Abstract

Empirical study examining how child maltreatment hotline workers interact with Allegheny Family Screening Tool, an AI-based decision support system. Through interviews and contextual inquiries, found workers' reliance on algorithmic predictions guided by four key factors: knowledge of contextual information beyond AI model capabilities, beliefs about system limitations, organizational pressures around tool use, and awareness of misalignments between algorithmic predictions and their own decision-making objectives. Reveals discrimination risks stemming from workers lacking adequate training on tool's data sources and limitations.

## Assessment

**LLM Decision:** Include (Confidence: 0.95)
**LLM Categories:** AI_Literacies, KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit, Fairness
**Human Decision:** Exclude
**Human Categories:** KI_Sonstige, Bias_Ungleichheit
**Agreement:** Disagree

## Key Concepts

## Full Text

---
title: "Improving Human-AI Partnerships in Child Welfare: Understanding Worker Practices, Challenges, and Desires for Algorithmic Decision Support"
authors: ["Anna Kawakami", "Venkatesh Sivaraman", "Hao-Fei Cheng", "Logan Stapleton", "Yanghuidi Cheng", "Diana Qing", "Adam Perer", "Zhiwei Steven Wu", "Haiyi Zhu", "Kenneth Holstein"]
year: 2022
type: conferencePaper
language: en
processed: 2026-02-05
source_file: Kawakami_2022_Improving_human-AI_partnerships_in_child_welfare.md
confidence: 89
---

# Improving Human-AI Partnerships in Child Welfare: Understanding Worker Practices, Challenges, and Desires for Algorithmic Decision Support

## Kernbefund

Obwohl das AFST seit fünf Jahren im Einsatz ist, bleibt es eine Spannungsquelle für Arbeiter, die das System als verpasste Gelegenheit zur wirksamen Ergänzung ihrer Fähigkeiten wahrnehmen. Die Abhängigkeit der Arbeiter vom AFST wird durch vier Faktoren gesteuert: kontextuelle Informationen jenseits des Modells, Überzeugungen über die Modellleistung, organisatorische Drücke und Misalignments zwischen algorithmischen Zielen und Entscheidungsobjektiven.

## Forschungsfrage

Wie integrieren Sozialarbeiter in der Kinderschutzbehörde das Allegheny Family Screening Tool (AFST) in ihre tägliche Entscheidungsfindung, und welche Designmöglichkeiten existieren zur Unterstützung effektiverer KI-gestützter Entscheidungsfindung?

## Methodik

Mixed Methods: Qualitativ-empirisch mit kontextuellen Befragungen (contextual inquiries) und semi-strukturierten Interviews mit Mitarbeitern einer Kinderschutzbehörde (call screeners und supervisors)
**Datenbasis:** Kontextuelle Befragungen und semi-strukturierte Interviews mit Kinderschutz-Hotline-Mitarbeitern (Call Screeners und Supervisoren) einer US-amerikanischen Kinderschutzbehörde

## Hauptargumente

- Arbeiter verlassen sich auf das AFST nicht primär aufgrund von Vertrauen, sondern aufgrund wahrgenommener organisatorischer Drücke und interner Überwachung ihrer Außerkraftsetzungsquoten, was dazu führt, dass sie manchmal gegen ihre eigene fachliche Einschätzung entscheiden.
- Arbeiter verfügen über kontextuelle Informationen (wie die spezifische Art der Vorwürfe, Beziehungen zwischen Tätern und Opfern, familiäre Umstände), die das AFST-Modell nicht erfasst, und diese lokale Expertise führt zu kritischem Hinterfragen und Außerkraftsetzung von Algorithmusempfehlungen.
- Arbeiter haben begrenzte Transparenz über die Funktionsweise des AFST-Modells und müssen daher Vermutungen über seine Faktoren und deren Gewichtung anstellen, was zu ungenauen mentalen Modellen und suboptimalen Entscheidungen führt; sie fordern explizitere Erklärbarkeit und Counterfactual-Interfaces.

## Kategorie-Evidenz

### Evidenz 1

Workers' mental models of the AFST: 'the more you use [the AFST], you kind of pick up why it will go a certain way' (C1). Arbeiter entwickeln informelle Verständnismodelle für die Algorithmusfunktion, benötigen aber bessere Schulung und Transparenz: 'If we knew more about how we got to the score, I think I'd pay more attention' (C3).

### Evidenz 2

Das Paper fokussiert auf ein Machine-Learning-basiertes Vorhersagesystem (AFST) mit Hunderten von automatisch extrahierten Features aus Verwaltungsdaten zur algorithmischen Entscheidungsunterstützung im Kinderschutz.

### Evidenz 3

Direkte ethnographische Untersuchung von Sozialarbeitern (call screeners, supervisors) in einer Kinderschutzbehörde bei der alltäglichen Entscheidungsfindung zum Kindesmissbrauchsscreening. Paper untersucht praktische Herausforderungen und Bedürfnisse von Fachkräften.

### Evidenz 4

Workers perceive that AFST assigns higher risk scores to families from underprivileged racial identities and socioeconomic backgrounds: 'workers perceived that the AFST tended to assign higher risk scores to families from underprivileged racial identities and socioeconomic backgrounds (C1, C2, S2).' Discussion of how system involvement proxies for race and poverty.

### Evidenz 5

Paper thematisiert, wie das System überproportional marginalisierte Familien (Rasse, Armut) betreffen könnte und wie Arbeiter aus verschiedenen Kontexten unterschiedliche Interpretationen des Systems haben. Intersektionale Überlegungen bezüglich Geschlecht, Rasse und sozioökonomischem Status.

### Evidenz 6

Explicit discussion of algorithmic fairness concerns: Workers question whether AFST's use of system involvement, family size, and re-referral numbers as predictive features is fair. 'the more people that are involved with these families, no matter what it's for, the higher their score's gonna be' (C5). Workers concerned about misalignment between algorithmic predictions and actual child safety risk.

## Assessment-Relevanz

**Domain Fit:** Hochgradig relevant für die Schnittstelle von KI und Sozialer Arbeit. Das Paper untersucht empirisch, wie KI-Systeme in einer kernhaften Anwendungsdomäne der Sozialen Arbeit (Kinderschutz) tatsächlich von Fachkräften genutzt werden und welche ethischen sowie praktischen Herausforderungen entstehen.

**Unique Contribution:** Dies ist die erste in-depth qualitative Untersuchung von Praktikern, die tatsächlich mit dem AFST arbeiten (nicht retrospektive Analysen). Sie kompliziert Narrative in der Literatur über die Effektivität von ADS im Kinderschutz durch Evidenz von organisatorischen Drücken, Bias-Wahrnehmungen und Misalignments zwischen algorithmischen Zielen und echten Schutzbedürfnissen.

**Limitations:** Die Studie fokussiert auf ein spezifisches System (AFST) in einem Bezirk; Generalisierbarkeit auf andere ADS-Kontexte im Kinderschutz oder anderen öffentlichen Sektoren bleibt unklar. Keine explizite Analyse der Perspektiven von Familien oder Kindern, nur von Arbeitern. Gender ist thematisch nicht explizit behandelt.

**Target Group:** Primär: HCI-Forscher, KI-Ethiker, Softwareentwickler und Designer von Entscheidungsunterstützungssystemen. Sekundär: Sozialarbeiter, Fachkräfte im Kinderschutz, Policymaker, Organisationen der Kinder- und Jugendhilfe, Befürworter von Algorithmic Accountability im öffentlichen Sektor.

## Schlüsselreferenzen

- [[Chouldechova_PutnamHornstein_et_al_2018]] - A case study of algorithm-assisted decision making in child maltreatment hotline screening decisions
- [[Eubanks_2018]] - Automating inequality: How high-tech tools profile, police, and punish the poor
- [[DeArteaga_Fogliato_Chouldechova_2020]] - A case for humans-in-the-loop: Decisions in the presence of erroneous algorithmic scores
- [[Saxena_BadilloUrquiola_Wisniewski_Guha_2021]] - A framework of high-stakes algorithmic decision-making for the public sector developed through a case study of child welfare
- [[Yang_Steinfeld_Zimmerman_2019]] - Unremarkable AI: Fitting intelligent decision support into critical, clinical decision-making processes
- [[Brown_Chouldechova_PutnamHornstein_et_al_2019]] - Toward algorithmic accountability in public services: A qualitative study of affected community perspectives on algorithmic decision-making in child welfare services
- [[Holten_Møller_Shklovski_Hildebrandt_2020]] - Shifting concepts of value: Designing algorithmic decision-support systems for public services
- [[Green_2019]] - The principles and limits of algorithm-in-the-loop decision making
- [[Levy_Chasalow_Riley_2021]] - Algorithms and Decision-Making in the Public Sector
