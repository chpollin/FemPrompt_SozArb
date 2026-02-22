---
title: Measuring and mitigating unintended bias in text data
authors:
  - L. Dixon
  - J. Li
  - J. Sorensen
  - N. Thain
  - L. Vasserman
year: 2018
type: conferencePaper
tags:
  - paper
  - feminist-ai
  - bias-research
date_added: 2026-02-22
date_modified: 2026-02-22
bias_types:
  - Unfairness
  - Disparity
mitigation_strategies:
  - Debiasing
---

# Measuring and mitigating unintended bias in text data

## Key Concepts

### Bias Types
- [[Disparity]]
- [[Unfairness]]

### Mitigation Strategies
- [[Debiasing]]

## Full Text

---
title: "Measuring and Mitigating Unintended Bias in Text Classification"
authors: ["Lucas Dixon", "John Li", "Jeffrey Sorensen", "Nithum Thain", "Lucy Vasserman"]
year: 2018
type: conferencePaper
language: en
processed: 2026-02-05
source_file: Dixon_2018_Measuring_and_mitigating_unintended_bias_in_text.md
confidence: 94
---

# Measuring and Mitigating Unintended Bias in Text Classification

## Kernbefund

Durch strategisches Hinzufügen von nicht-toxischen Trainingsbeispielen mit bestimmten Identitätstermen lässt sich unbeabsichtigte Verzerrung in Textklassifikatoren reduzieren, ohne die Gesamtmodellleistung zu beeinträchtigen. Die neu eingeführte 'Pinned AUC'-Metrik ermöglicht schwellenwertunabhängige Erkennung von Verzerrungen.

## Forschungsfrage

Wie können unbeabsichtigte Verzerrungen in Textklassifikationsmodellen gemessen und mitigiert werden, insbesondere wenn demographische Informationen nicht verfügbar sind?

## Methodik

Empirisch: Experimentelle Evaluierung mit Convolutional Neural Networks, Synthetic Test Set Design mit Template-basierten Phrasen, Daten-Balancing-Ansatz, Multiple Evaluationsmetriken (AUC, Error Rate Equality Difference, Pinned AUC)
**Datenbasis:** 127.820 annotierte Wikipedia Talk Page Kommentare (Trainingsdaten), 31.866 gehaltene Testkommentare, synthetisches Test-Set mit 77.000 generierten Phrasen mit 51 Identitätstermen

## Hauptargumente

- Unbeabsichtigte Verzerrungen entstehen durch unausgewogene Darstellung von Identitätstermen in Trainingsdaten: Der Begriff 'gay' erscheint in 3% toxischer Kommentare, aber nur 0,5% aller Kommentare, was zu Überanpassung führt und das Modell veranlasst, Identitätsterme mit Toxizität zu assoziieren.
- Eine unsupervised Bias-Mitigation durch Hinzufügen nicht-toxischer Beispiele aus Wikipedia-Artikeln (statt manuell gekennzeichnete Kommentare) ist kosteneffizient und effektiv: Mit 4.620 zusätzlichen Trainingsamples wurde die False Positive Equality Difference von 74,13 auf 52,94 reduziert.
- Die Unterscheidung zwischen 'unbeabsichtigter Verzerrung' im Modell und 'Unfairness' in der Anwendung ist kritisch: Derselbe Bias kann je nach Einsatzszenario (automatisches Löschen vs. Review-Priorisierung vs. Batch-Veröffentlichung) unterschiedliche Auswirkungen haben.

## Kategorie-Evidenz

### Evidenz 1

Fokus auf Text-Klassifikation mit Convolutional Neural Networks, Trainingsmethoden mit TensorFlow/Keras, Evaluierung von Modellleistung

### Evidenz 2

Zentrale These: 'Initial versions of text classifiers trained on this data showed problematic trends for certain statements... Clearly non-toxic statements containing certain identity terms, such as 'I am a gay man', were given unreasonably high toxicity scores. We call this false positive bias.' Analyse von Diskriminierung durch Überrepräsentation bestimmter Identitätstermen in toxischen Trainingsdaten.

### Evidenz 3

Untersuchung von 51 verschiedenen Identitätstermen (atheist, queer, gay, transgender, lesbian, homosexual, feminist, black, white, muslim, etc.) und deren unterschiedliche Repräsentation in toxischen vs. nicht-toxischen Kommentaren. Fokus auf marginalisierte Communities und deren Darstellung in Trainingsdaten.

### Evidenz 4

Explizite Definition von Fairness-Metriken: 'Equality of Odds' und Error Rate Equality Difference. Entwicklung der 'Pinned AUC'-Metrik als schwellenwertunabhängiges Fairness-Evaluationsinstrument. Ziel: 'A more fair model will have similar values across all terms, approaching the equality of odds ideal.'

## Assessment-Relevanz

**Domain Fit:** Hochgradig relevant für KI-Fairness und Bias-Mitigation, mit Anwendungspotenzial in Community Moderation und Content Filtering. Der praktische Fokus auf Szenarien ohne demographische Metadaten ist besonders wertvoll. Schwach relevant für Soziale Arbeit, könnte aber indirekt für digitale Unterstützungssysteme bedeutsam sein.

**Unique Contribution:** Erstmalige systematische Definition und Messung von 'unbeabsichtigter Verzerrung' in Textklassifikation mit praktischer Unterscheidung von Modell-Bias und Anwendungs-Unfairness; Einführung der schwellenwertunabhängigen 'Pinned AUC'-Metrik als innovatives Evaluationsinstrument.

**Limitations:** Ansatz ist auf manuell identifizierte Identitätsterme beschränkt (51 Terme); Bias-Mitigation fokussiert nur auf False-Positive-Bias durch Hinzufügen negativer Beispiele; Evaluation erfolgt hauptsächlich auf synthetischen Daten mit Template-generierten Phrasen; Generalisierbarkeit auf andere Sprachen und Kontexte nicht getestet.

**Target Group:** KI-Entwickler und ML-Engineers, Fairness-Forscher, Content-Moderation-Teams, Plattformbetreiber (insbesondere Wikipedia und ähnliche Community-Plattformen), Policy-Maker im Bereich algorithmische Governance, Ethik-Committees in Tech-Unternehmen

## Schlüsselreferenzen

- [[Hardt_M_Price_E_Srebro_N_2016]] - Equality of Opportunity in Supervised Learning
- [[Feldman_M_Friedler_SA_Moeller_J_Scheidegger_C_Venkatasubramanian_S_2015]] - Certifying and Removing Disparate Impact
- [[Bolukbasi_T_Chang_KW_Zou_JY_Saligrama_A_Kalai_A_2016]] - Man is to Computer Programmer as Woman is to Homemaker? Debiasing Word Embeddings
- [[Beutel_A_Chen_J_Zhao_Z_Chi_EH_2017]] - Data Decisions and Theoretical Implications when Adversarially Learning Fair Representations
- [[Blodgett_SL_OConnor_B_2017]] - Racial Disparity in Natural Language Processing: A Case Study of Social Media African-American English
- [[Hovy_D_Spruit_SL_2016]] - The Social Impact of Natural Language Processing
- [[Kleinberg_JM_Mullainathan_S_Raghavan_M_2016]] - Inherent Trade-Offs in the Fair Determination of Risk Scores
