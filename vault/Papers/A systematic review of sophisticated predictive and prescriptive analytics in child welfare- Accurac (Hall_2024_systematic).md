---
title: "A systematic review of sophisticated predictive and prescriptive analytics in child welfare: Accuracy, equity, and bias"
authors:
  - S. F. Hall
  - M. Sage
  - C. F. Scott
  - K. Magruder
  - J. Powers
year: 2024
type: journalArticle
doi: 10.1007/s10560-023-00931-2
url: 
tags:
  - paper
llm_decision: Include
llm_confidence: 0.95
llm_categories:
  - KI_Sonstige
  - Soziale_Arbeit
  - Bias_Ungleichheit
  - Diversitaet
  - Fairness
---

# A systematic review of sophisticated predictive and prescriptive analytics in child welfare: Accuracy, equity, and bias

## Transformation Trail

### Stufe 1: Extraktion & Klassifikation (LLM)

**Extrahierte Kategorien:** AI_Literacies, KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit, Diversitaet, Fairness
**Argumente:** 3 extrahiert

### Stufe 3: Verifikation (LLM)

| Metrik | Score |
|--------|-------|
| Completeness | 92 |
| Correctness | 98 |
| Category Validation | 95 |
| **Overall Confidence** | **94** |

### Stufe 4: Assessment

**LLM:** Include (Confidence: 0.95)

## Key Concepts

- [[Algorithmic Fairness in Child Welfare]]
- [[Racial Disparities in Algorithmic Decision-Making]]

## Wissensdokument

# A case study of algorithm-assisted decision making in child maltreatment hotline screening decisions

## Kernbefund

Das Allegheny Family Screening Tool (AFST) zeigt verbesserte Vorhersagegenauigkeit gegenüber menschlichen Urteilen, weist aber erhebliche Kalibrierungsprobleme bei schwarzen und weißen Kindern auf (z.B. 50% vs. 30% Platzierungsrate bei höchstem Score). In der Praxis werden die Modellvorgaben jedoch schwach umgesetzt, da Supervisoren 1 von 4 obligatorischen Screen-Ins überrufen.

## Forschungsfrage

Wie können Predictive Risk Models in der Kinderschutz-Hotline-Screening-Entscheidungsfindung fair und wirksam eingesetzt werden, und welche Bias-Probleme entstehen dabei?

## Methodik

Mixed Methods: Empirische Fallstudie mit Modellentwicklung, Fairness-Auditing, Validierung und Deployment-Analyse. Machine Learning Methoden (Logistische Regression, Random Forest, XGBoost, SVM). Kalibrierungsanalyse und Fehlerrate-Analyse stratifiziert nach Rasse/Ethnizität.
**Datenbasis:** 32.086 Referrals zur Modelltraining, 14.417 Referrals zur Validierung aus Allegheny County, PA; Implementierungsdaten von 11.157 Referrals nach Deployment

## Hauptargumente

- Statistische Modelle können objektiver sein als menschliche Entscheidungsträger, da sie konsistente Schwellwerte anwenden und nicht von kognitiven Verzerrungen (Recency Bias, Diskriminierung) beeinflusst werden, aber die zugrundeliegende Modellkalibrierung muss fairnessgerecht überprüft werden.
- Rassische Diskrepanzen in Kinderschutzmeldungen entstehen durch vier Faktoren: disproportionale Bedürfnisse, geografischer Kontext, ungleiche Ressourcenverteilung und rassische Vorurteile von Fachkräften; Modelle können Faktoren 1-2 nicht beheben, aber Ressourcenallokation (3) und Bias-Mitigation (4) unterstützen.
- Kalibrierungsfairness allein ist unzureichend: Modelle können kalibriert sein, aber ungleiche Fehlerraten über Rassengruppen hinweg aufweisen; es gibt unvermeidbare Trade-offs zwischen verschiedenen Fairness-Metriken bei unterschiedlichen Prävalenzraten über Gruppen.

## Kategorie-Evidenz

### Evidenz 1

Diskussion der Notwendigkeit, dass Fachkräfte verstehen, dass 'scores do not reflect anything about the certainty of the present allegations' und kritisches Verständnis von Modellgrenzen (Training, Überriding-Praktiken).

### Evidenz 2

Entwicklung und Evaluierung von Predictive Risk Models unter Verwendung von Machine Learning Methoden (Random Forest, XGBoost, Support Vector Machines) für algorithmische Entscheidungsunterstützung.

### Evidenz 3

Direkter Fokus auf Kinderschutzhilfe, Hotline-Screening-Entscheidungen, Fallbearbeiter-Praktiken und Integration von Modellen in reale Sozialarbeit-Workflows in Allegheny County Department of Human Services.

### Evidenz 4

Explizite Analyse rassischer Diskrepanzen: 'screened-in referrals that score a 20 on the AFST ventile scale are observed to result in placement in 50% of cases involving Black children and only 30% of cases involving White children'; statistische Diskriminierung durch Verwendung von Zip-Code als Proxy.

### Evidenz 5

Analyse stratifiziert nach Rasse/Ethnizität, Armut und Geschlecht; Fokus auf marginalisierte Gruppen (schwarze Kinder, Familien in Armut); Diskussion der Überrepräsentation von Schwarzen Kindern im Kinderschutz.

### Evidenz 6

Zentrale Thematisierung von Fairness-Metriken: Kalibrierung, Accuracy Equity (AUC-Gleichheit), False Positive/False Negative Rates; Diskussion der Unavoidability von Trade-offs bei Fairness-Kriterien; Vergleich mit COMPAS-Debatte.

## Assessment-Relevanz

**Domain Fit:** Hochgradig relevant für die Schnittstelle AI/Soziale Arbeit: Das Paper adressiert direkt die Implementierung von ML-Systemen in kritischen Kinderschutztätigkeiten, analysiert rassische Bias-Implikationen und untersucht, wie algorithmische Fairness in der Sozialen Arbeit praktiziert werden kann.

**Unique Contribution:** Die Fallstudie bietet seltene empirische Daten aus einer tatsächlich deplierten AI-Anwendung in der Sozialen Arbeit mit detaillierter Kalibrierungs- und Fairnessanalyse sowie realen Implementierungsergebnissen, die zeigen, dass Fairness ein Prozess-Property und nicht nur Modell-Property ist.

**Limitations:** Hauptlimitation: Selective Labels Problem – Platzierungsergebnisse sind nur für gescreente Fälle beobachtbar, nicht für gescreente-out Fälle; zudem wurden Analysen hauptsächlich auf Black/White Kategorien fokussiert und andere Rassengruppen unterrepräsentiert, sowie Übertragbarkeit auf andere Jurisdiktionen unklar.

**Target Group:** Primär: Sozialpolitiker und Kinderschutzbehördenleiter, KI-Entwickler in Government/Public Sector, Forschende in algorithmischer Fairness und Child Welfare; Sekundär: Sozialarbeiter, Ethiker, Datenschützer, Community Advocates

## Schlüsselreferenzen

- [[Chouldechova_Alexandra_2017]] - Fair prediction with disparate impact: A study of bias in recidivism prediction instruments
- [[CorbettDavies_Sam_et_al_2017]] - Algorithmic decision making and the cost of fairness
- [[Kleinberg_Jon_et_al_2016]] - Inherent trade-offs in the fair determination of risk scores
- [[Angwin_Julia_et_al_2016]] - How we analyzed the COMPAS recidivism algorithm
- [[Dettlaff_Alan_J_et_al_2011]] - Disentangling substantiation: The influence of race, income, and risk on the substantiation decision in child welfare
- [[Fluke_John_et_al_2011]] - Disparities and disproportionality in child welfare: Analysis of the research
- [[Meehl_Paul_E_1954]] - Clinical versus statistical prediction: A theoretical analysis and a review of the evidence
- [[Vaithianathan_Rhema_et_al_2013]] - Children in the public benefit system at risk of maltreatment: Identification via predictive modeling
- [[Shroff_Ravi_2017]] - Predictive analytics for city agencies: Lessons from children's services
- [[Skeem_Jennifer_L_Lowenkamp_Christopher_T_2016]] - Risk, race, and recidivism: predictive bias and disparate impact
