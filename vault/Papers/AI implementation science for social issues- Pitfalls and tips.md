---
title: AI implementation science for social issues: Pitfalls and tips
authors:
  - K. Takaoka
year: 2022
type: journalArticle
doi: 10.2188/jea.JE20210380
tags:
  - paper
  - feminist-ai
  - bias-research
date_added: 2026-02-22
date_modified: 2026-02-22
bias_types:
  - Discrimination
mitigation_strategies: []
llm_decision: Include
llm_confidence: 0.95
llm_categories:
  - AI_Literacies
  - KI_Sonstige
  - Soziale_Arbeit
human_decision: Exclude
human_categories:
  - KI_Sonstige
  - Soziale_Arbeit
agreement: disagree
---

# AI implementation science for social issues: Pitfalls and tips

## Abstract

Case study documenting four-stage social implementation of AI system (AiCAN - Assistant of Intelligence for Child Abuse and Neglect) in Japanese Child Guidance Centers from 2012-2020. System uses machine learning to predict child abuse recurrence and Bayesian networks for real-time probabilistic inference to guide temporary protection decisions. Data from over 6,000 cases (2014-2018) were used to develop gradient boosting algorithms with AUROC >0.70. Implementation involved iterative stakeholder engagement, workflow redesign, training field staff, and addressing organizational resistance. Emphasizes critical importance of building consensus with practitioners, designing for field usability, ensuring data quality through validated scales, and employing eXplainable AI for transparency.

## Assessment

**LLM Decision:** Include (Confidence: 0.95)
**LLM Categories:** AI_Literacies, KI_Sonstige, Soziale_Arbeit
**Human Decision:** Exclude
**Human Categories:** KI_Sonstige, Soziale_Arbeit
**Agreement:** Disagree

## Key Concepts

### Bias Types
- [[Discrimination]]

## Full Text

---
title: "AI Implementation Science for Social Issues: Pitfalls and Tips"
authors: ["Kota Takaoka"]
year: 2022
type: journalArticle
language: en
processed: 2026-02-05
source_file: Takaoka_2022_AI_implementation_science_for_social_issues.md
confidence: 95
---

# AI Implementation Science for Social Issues: Pitfalls and Tips

## Kernbefund

Soziale Implementierung von KI erfordert nicht nur technische Lösungen, sondern umfassende Systemveränderungen in Dateninfrastruktur, Organisationskultur und stakeholder-engagement. Der entwickelte SSTRD-Modell (Sustainable Service Team as R&D) zeigt, dass KI-Implementierung im Sozialbereich nur durch langfristige Zusammenarbeit von Wissenschaft, Industrie und Behörden erfolgreich ist.

## Forschungsfrage

Wie können KI-Technologien systematisch in sozialen Bereichen wie dem Kinderschutz implementiert werden, und welche Fallstricke und Best Practices sollten dabei beachtet werden?

## Methodik

Theoretisch mit praktischem Use-Case: Vierstufiges Implementierungsmodell (Problemredefinition, technische Lösungsfindung, soziale Implementierung, horizontale Ausbreitung) illustriert durch Fallstudie zum Kindermissbrauch in Japan.
**Datenbasis:** Empirische Fallstudie mit 6.000+ Kinderschutzmeldungen aus einer japanischen Gemeinde (2014-2018), prospektive Datenerfassung mit Rückmeldungen alle 3-6 Monate

## Hauptargumente

- KI-Implementierung im Sozialbereich muss mit der Redefinition von Problemen zu lösbaren Fragen beginnen, nicht mit technologischen Lösungen. Dies erfordert intensive Zusammenarbeit mit Fachkräften, um Konsens über Ziele wie die Reduktion von Kindesmissbrauchsfällen zu erreichen.
- Datenqualität und -design sind zentral für KI-Implementierung: Standardisierte Datenerfassung, Behandlung von Klassenungleichgewicht (SMOTE) und Feature-Extraktion unter Berücksichtigung der Arbeitsbelastung in sozialen Organisationen sind notwendig.
- Explainability (XAI) ist in sozialen Kontexten essentiell, insbesondere wenn administrative und juristische Behörden involviert sind; lineare Modelle und interpretierbare ML-Methoden sollten bevorzugt werden gegenüber Black-Box-Ansätzen.
- Soziale Implementierung von KI wird durch psychologische Reaktanz, normalcy bias und Widerstand gegen Veränderungen behindert; Mitarbeiterschulung, klare Betriebsanleitungen und agile Methodologien sind entscheidend.
- KI sollte Fachkräfte unterstützen, nicht ersetzen: Das System dient der Verbesserung von Entscheidungsqualität und zur Überwindung kognitiver Verzerrungen durch datengestützte Unterstützung von Erfahrung und Intuition.

## Kategorie-Evidenz

### Evidenz 1

Artikel thematisiert erforderliche Kompetenzen von Fachkräften im Umgang mit KI-Systemen: 'training and briefing sessions for field staff to master them' und 'agile trial methodology' zur Entwicklung von Verständnis. Fokus auf Schulung, Betriebsanleitungen und das Überwinden von Widerständen gegen neue Technologien.

### Evidenz 2

Einsatz von Machine Learning (Gradient Boosting), Bayesian Networks, probabilistic modelling, clustering (unsupervised learning), sparse modelling und eXplainable AI (XAI). Konkrete Implementierung im AiCAN-System für Risikovorhersage und kausale Schlussfolgerung.

### Evidenz 3

Direkte Anwendung in Kinderschutzdiensten (Child Guidance Centers in Japan). Fokus auf Verbesserung sozialer Fachpraxis: 'improving the quality of decision making, enhancing operational efficiency, and professional training for practitioners.' Thematisiert spezifische Herausforderungen von Sozialarbeit wie Umgang mit mehrdeutigen Informationen.

### Evidenz 4

Thematisiert implizite Diskriminierung durch KI: 'there can be implicit discrimination and favoritism towards certain individuals due to sampling size, bias effects, and tuning effects of AI.' Diskutiert normalcy bias bei Fachkräften und systematische Unterschiede zwischen Kinderschutzzentren in Schutzstandards.

### Evidenz 5

Fokus auf vulnerable Gruppen (Kinder als Zielgruppe von Schutzmaßnahmen). Verknüpfung mit SDGs und Maslow's Hierarchy of Needs; Ziel ist Sicherheit und Wohlbefinden für alle Kinder ohne Gewalt und Missbrauch.

### Evidenz 6

Explizite Behandlung von Fairness bei KI-Entscheidungen: 'Political correctness and social norms must be carefully considered in AI implementation design.' Verwendung von PR und ROC Curves für evaluierung von Klassifikationsmodellen. Fokus auf gerechte Ressourcenallokation unter Budgetbeschränkungen: 'best possible choices within the resources available.'

## Assessment-Relevanz

**Domain Fit:** Hochgradig relevant für die Schnittstelle von KI und Sozialer Arbeit. Der Artikel adressiert konkrete Implementierungsfragen für vulnerable Gruppen (Kinder) und zeigt auf, wie KI-Systeme in niedrig-technisierten sozialen Kontexten funktionieren können, während ethische und fairness-bezogene Fragen zentral bleiben.

**Unique Contribution:** Bietet ein strukturiertes vierstufiges Implementierungsmodell für KI in sozialen Bereichen mit explizitem Fokus auf Fallstricke und praktische Tipps; führt das SSTRD-Modell als alternatives Governance-Modell zu traditionellen scientist-practitioner-Ansätzen ein.

**Limitations:** Fokus auf einen nationalen Kontext (Japan); begrenzte Diskussion von Fragen um Datenschutz und Privatsphäre jenseits technischer Sicherheitsarchitektur; Gender-Perspektive nicht adressiert; keine umfassende kritische Diskussion von Machtdynamiken zwischen Technolog:innen und Sozialarbeiter:innen.

**Target Group:** Sozialarbeiter:innen in Kinderschutz und verwandten Feldern; KI-Entwickler:innen mit Interesse an sozialen Anwendungen; Policy-maker und Administratoren in Sozialwesen und Behörden; Implementation Science Forscher:innen; Studierende in Sozialer Arbeit und angewandter KI

## Schlüsselreferenzen

- [[Chawla_et_al_2002]] - SMOTE: Synthetic Minority Over-sampling Technique
- [[Birken_Powell_Presseau_et_al_2017]] - Combined use of CFIR and TDF: Systematic Review
- [[Barredo_Arrieta_et_al_2020]] - Explainable Artificial Intelligence (XAI): Concepts and Challenges
- [[Ribeiro_Singh_Guestrin_2016]] - LIME: Local Interpretable Model-agnostic Explanations
- [[Lundberg_Lee_2017]] - SHAP: A Unified Approach to Interpreting Model Predictions
- [[Landes_McBain_Curran_2020]] - Effectiveness-Implementation Hybrid Designs
- [[Damschroder_2020]] - Clarity out of Chaos: Use of Theory in Implementation Research
- [[Chambers_Norton_2016]] - The Adaptome: Advancing the Science of Intervention Adaptation
