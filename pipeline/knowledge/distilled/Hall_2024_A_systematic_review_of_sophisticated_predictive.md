---
title: "A Systematic Review of Sophisticated Predictive and Prescriptive Analytics in Child Welfare: Accuracy, Equity, and Bias"
authors: ["Seventy F. Hall", "Melanie Sage", "Carol F. Scott", "Kenneth Joseph"]
year: 2023
type: journalArticle
language: en
categories:
  - KI_Sonstige
  - Soziale_Arbeit
  - Bias_Ungleichheit
  - Diversitaet
  - Fairness
processed: 2026-02-05
source_file: Hall_2024_A_systematic_review_of_sophisticated_predictive.md
confidence: 93
---

# A Systematic Review of Sophisticated Predictive and Prescriptive Analytics in Child Welfare: Accuracy, Equity, and Bias

## Kernbefund

Weniger als die Hälfte der Studien befasst sich mit Ethik, Equity oder Bias; nur ein Drittel der Projektteams ist interdisziplinär zusammengesetzt; es fehlt ein einheitlicher Standard zur Vermeidung von Bias und Ungleichheit in algorithmierten Kinderschutzentscheidungen.

## Forschungsfrage

Inwiefern berücksichtigen Forschende Ethik, Equity und Bias bei der Entwicklung und Evaluation von prädiktiven und präskriptiven Machine-Learning-Algorithmen im Kinderschutz?

## Methodik

Systematisches Literatur-Review mit quantitativer Synthese (Mann-Whitney U Tests, Spearman's rank correlations); Analyse von 15 wissenschaftlichen Arbeiten (2010-2020) aus EBSCO, Google Scholar und Referenzlisten
**Datenbasis:** 15 Artikel, Konferenzbeiträge, Dissertationen und Buchkapitel; Stichprobengrößen der analysierten Studien: 1 bis 121.482 Fälle (Mdn = 10.000+)

## Hauptargumente

- Obwohl Machine-Learning-Algorithmen im Kinderschutz zur Verbesserung von Konsistenz und Fairness eingesetzt werden sollen, besteht das Risiko, dass sie Bias amplifiziieren, besonders für Familien mit häufigem Kontakt zu öffentlichen Systemen.
- Die mangelhafte Integration von Ethik-, Equity- und Bias-Überlegungen in Model-Entwicklung und -Evaluation sowie die fehlende Partizipation von Stakeholdern und Domänenexperten stellt ein erhebliches Problem dar.
- Eine interdisziplinäre Zusammenarbeit zwischen Informatikern, Sozialwissenschaftlern und Praktizierenden und die Anwendung partizipativer Designprinzipien sind notwendig, um die praktischen Implikationen algorithmierten Entscheidens im Kinderschutz zu berücksichtigen.

## Kategorie-Evidenz

### KI_Sonstige

Fokus auf 'sophisticated predictive and prescriptive analytics' und 'machine learning models' im Kinderschutz; Analyse von supervised ML-Ansätzen (linear models, tree-based models, neural networks) zur Outcome-Vorhersage.

### Soziale_Arbeit

Expliziter Fokus auf child welfare agencies, caseworker decision-making, risk assessment und child removal decisions; Analyse von Praxisanwendungen in Kinderschutzsystemen und deren Auswirkungen auf sozialarbeiterische Praxis.

### Bias_Ungleichheit

Zentrale Frage: 'To what extent do scholars address ethics, equity, and bias in their reporting of data source limitations, algorithmic design, and model implementation?'; Analyse von Diskriminierungsrisiken, insbesondere für 'families with frequent exposure to public systems'; Beispiel Wilson et al. (2015): Algorithmus identifizierte disproportional mehr Māori-Kinder als gefährdet.

### Diversitaet

Analyse von disparate impacts auf unterschiedliche racial/ethnic groups; Evaluierung von Equity durch Vergleich von Modellperformance und placement rates across racial subgroups; Thematisierung von marginalized communities und struktureller Benachteiligung.

### Fairness

Explizite Evaluation von algorithmic fairness durch Vergleich von AUC-Werten across racial subgroups (Chouldechova et al. 2018); Untersuchung von Fairness-Metriken und -Problemen; Diskussion von Equalized Odds (override rates across risk levels).

## Assessment-Relevanz

**Domain Fit:** Höchst relevant für die Schnittstelle AI/Soziale Arbeit: Das Paper adressiert direkt die Implementierung von prädiktiven Algorithmen in Kinderschutzinstitutionen und untersucht systematisch, wie ethische und Equity-Fragen in Forschung und Praxis behandelt werden. Besondere Relevanz für sozialarbeiterische Praxis und KI-Governance.

**Unique Contribution:** Erste systematische Review, die speziell auf sophisticated ML-Algorithmen im Kinderschutz fokussiert und quantitativ die Häufigkeit und Qualität der Behandlung von Ethik-, Equity- und Bias-Fragen in der Literatur analysiert; etabliert empirisch, dass ein systematischer Mangel an interdisziplinärer Zusammenarbeit und partizipativen Designprinzipien besteht.

**Limitations:** Review beschränkt auf Zeitraum 2010-2020 und englischsprachige Literatur; nur 15 Studien identifiziert, was auf begrenzte empirische Forschung in diesem Bereich hinweist; keine Bewertung der tatsächlichen Implementierungsergebnisse in Praxisfeldern.

**Target Group:** Sozialarbeiter und Kinderschutzpraktiker; KI-Entwickler und Informatiker; Policymaker im Bereich Kinderschutz und Sozialverwaltung; Forscher an der Schnittstelle von KI und Sozialer Arbeit; Ethiker und Equity-Experten in digitalen Systemen

## Schlüsselreferenzen

- [[Eubanks_2017]] - Automating Inequality: How High-Tech Tools Profile, Police, and Punish the Poor
- [[Keddell_2015]] - The Ethics of Predictive Risk Modelling in the Aotearoa/New Zealand Child Welfare Context
- [[Dare_Gambrill_2017]] - Ethical Analysis: Predictive Risk Models at Call Screening for Allegheny County
- [[Gillingham_2019]] - Can Predictive Algorithms Assist Decision-Making in Social Work with Children and Families?
- [[Chouldechova_et_al_2018]] - Predictive Risk Modelling with Equity Evaluation in Child Welfare
- [[Wilson_et_al_2015]] - Predictive Modeling: Potential Application in Prevention Services
- [[Vaithianathan_et_al_2013]] - Children in the Public Benefit System at Risk of Maltreatment
- [[Saxena_et_al_2020]] - A Human-Centered Review of Algorithms Used Within the U.S. Child Welfare System
