---
title: "Are \"Intersectionally Fair\" AI Algorithms Really Fair to Women of Color? A Philosophical Analysis"
authors:
  - Y. Kong
year: 2022
type: conferencePaper
doi: 10.1145/3531146.3533074
url: "https://doi.org/10.1145/3531146.3533074"
tags:
  - paper
llm_decision: Include
llm_confidence: 0.95
llm_categories:
  - KI_Sonstige
  - Bias_Ungleichheit
  - Gender
  - Diversitaet
  - Feministisch
  - Fairness
human_decision: Include
human_categories:
  - KI_Sonstige
  - Bias_Ungleichheit
  - Gender
  - Diversitaet
  - Feministisch
  - Fairness
agreement: agree
---

# Are "Intersectionally Fair" AI Algorithms Really Fair to Women of Color? A Philosophical Analysis

## Transformation Trail

### Stufe 1: Extraktion & Klassifikation (LLM)

**Extrahierte Kategorien:** AI_Literacies, KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet, Fairness
**Argumente:** 3 extrahiert

### Stufe 3: Verifikation (LLM)

| Metrik | Score |
|--------|-------|
| Completeness | 92 |
| Correctness | 98 |
| Category Validation | 95 |
| **Overall Confidence** | **95** |

### Stufe 4: Assessment

**LLM:** Include (Confidence: 0.95)
**Human:** Include

## Key Concepts

- [[Intersectional Bias]]

## Wissensdokument

# Fairness Indicators for Systematic Assessments of Visual Feature Extractors

## Kernbefund

Self-Supervised Learning auf großen, diversen Internetdatensätzen (z.B. Instagram mit 1 Milliarde Bildern) führt zu deutlich besseren Fairness-Ergebnissen als Supervised Learning auf ImageNet, besonders für unterrepräsentierte Gruppen bezüglich Geschlecht, Hautton und geografische Regionen.

## Forschungsfrage

Wie können Computer-Vision-Systeme systematisch auf Fairness und Bias hinsichtlich schädlicher Label-Assoziationen, geografischer Disparitäten und diskriminierender Repräsentationen von demografischen Merkmalen auditiert werden?

## Methodik

Empirisch: Entwicklung von drei standardisierten Fairness-Indikatoren und deren Anwendung auf mehrere vortrainierte Computer-Vision-Modelle (Supervised Learning, Weakly-Supervised Learning, Self-Supervised Learning) mit systematischen Ablationsstudien zu Datengröße, Datendomain und Modellgröße.
**Datenbasis:** Empirische Analyse von Computer-Vision-Modellen auf mehreren öffentlich verfügbaren Fairness-Datensätzen (Casual Conversations, OpenImages MIAP, UTK-Faces) mit verschiedenen Trainingsparadigmen und Modellgrößen (ResNet-50, RegNetY-16, RegNetY-128)

## Hauptargumente

- Standardisierte Fairness-Indikatoren sind notwendig zur systematischen Diagnose von Bias und Harms in Computer-Vision-Systemen und sollten als verpflichtende Audits in der CV-Forschung etabliert werden, ohne dabei ein umfassendes operationalisiertes Fairness-Konzept ersetzen zu wollen.
- Die Wahl des Trainingsparadigmas (Supervised vs. Weakly-Supervised vs. Self-Supervised) und die Datendomain/Datengröße haben signifikante Auswirkungen auf Fairness-Metriken: SSL auf ungefiltertem, menschenorientierten Internetdaten übertrifft deutlich die traditionelle ImageNet-basierte Supervised-Methode.
- Disparitäten bestehen in drei Kategorien: (1) schädliche Label-Assoziationen (z.B. Verbrechen, nicht-menschlich), (2) Performance-Unterschiede zwischen geografischen Regionen und Einkommensgruppen (bis zu 0,25 Unterschied), (3) Ungleiche Repräsentation demografischer Merkmale in Feature-Räumen, insbesondere für Frauen mit dunklerer Hautfarbe bei der Geschlechter-Retrieval-Aufgabe.

## Kategorie-Evidenz

### Evidenz 1

Paper betont Notwendigkeit von 'standardized fairness assessments' und 'widespread adoption and mandate of the fairness assessments in computer vision research' sowie Bereitstellung von 'code and guidance' für praktische Anwendung von Fairness-Audits.

### Evidenz 2

Fokus auf Computer Vision, spezifisch visual feature extractors, prätrainierte Modelle, und verschiedene Trainingsparadigmen (Supervised, Weakly-Supervised, Self-Supervised Learning).

### Evidenz 3

Zentral sind 'blatant disparities' zwischen demografischen Gruppen: 'difference of 0.25 between lower and higher income budgets, and about 0.20 between Africa and Europe', sowie 'error patterns between these groups' und 'poor performance when object recognition models are tested on geographically diverse images'.

### Evidenz 4

Explizite Analyse von Geschlechts-Bias: 'discrepancies in the error rates in gender classification systems', 'darker-skinned women are more frequently misgendered and/or not recognized', und Messungen von 'disparity in learned representations of social and demographic traits' insbesondere für Geschlecht.

### Evidenz 5

Fokus auf Repräsentation verschiedener Gruppen: 'sensitive groups defined by demographic attributes', 'marginalized groups such as immigrants', Analyse nach Hautton (Fitzpatrick scale), Geschlecht, Alter, geografischer Region, Einkommensgruppe, und intersektionale Analysen (gender × skintone).

### Evidenz 6

Zentral sind 'three fairness indicators' für Quantifizierung von 'harms and biases': (1) harmful label associations, (2) disparity in learned representations, (3) biased performance on geographically diverse images; verwendete Metriken: hit rates, precision at k, performance stratified by sensitive groups.

## Assessment-Relevanz

**Domain Fit:** Das Paper hat begrenzte direkte Relevanz für Soziale Arbeit, ist aber fundamental für KI-Governance und -Ethik im Kontext von automatisierten Systemen, die auch in sozialen Diensten eingesetzt werden. Der Fokus auf systematische Fairness-Audits und die Dokumentation von Disparitäten zwischen demografischen Gruppen sind wichtig für alle, die mit Algorithmen in Kontexten sozialer Intervention arbeiten.

**Unique Contribution:** Das Paper stellt einen praktischen, anwendbaren Rahmen für standardisierte Fairness-Audits von Computer-Vision-Modellen dar und zeigt empirisch, dass selbstüberwachtes Lernen auf großen, diversen Datensätzen ein vielversprechender Weg zur Reduktion intersektionaler Diskriminierung ist.

**Limitations:** Das Paper selbst dokumentiert mehrere Limitationen: (1) begrenzte Datenverfügbarkeit mit kleinen Stichproben und fehlender Ausreißer für nicht-binäre Geschlechter, (2) verwendung von 'perceived' Labels statt selbst-identifizierten demografischen Merkmalen, (3) Fokus auf binäre Klassifikation und einzelne Labels, (4) Risiko, dass Benchmarks zu einseitiger Optimierung führen könnten statt ganzheitlicher Fairness-Überlegungen.

**Target Group:** KI-Entwickler und Forschende im Computer-Vision-Bereich, ML-Engineers, Auditor:innen von algorithmischen Systemen, Policy-Maker im Bereich AI Governance, Ethiker:innen und Forscher:innen an der Schnittstelle von KI und sozialer Gerechtigkeit, sowie Organisationen, die Computer-Vision-Systeme für sensitive Anwendungen (Gesichtserkennung, automatische Objektklassifikation in sozialen Kontexten) einsetzen oder evaluieren.

## Schlüsselreferenzen

- [[Buolamwini_Gebru_2018]] - Gender Shades: Intersectional Accuracy Disparities in Commercial Gender Classification
- [[Raji_et_al_2020]] - Closing the AI accountability gap: Defining an end-to-end framework for internal algorithmic auditing
- [[He_et_al_2016]] - Deep Residual Learning for Image Recognition (ResNet)
- [[Radford_et_al_2021]] - Learning Transferable Visual Models From Natural Language Supervision (CLIP)
- [[Caron_et_al_2021]] - Emerging Properties in Self-Supervised Vision Transformers (SwAV)
- [[Singh_et_al_2022]] - Large Scale Self-Supervised Image Pre-training (SEER)
- [[Shankar_et_al_2021]] - No Classification without Representation: Assessing Geodiversity Issues in Open Data Sets for the Developing World
- [[Mitchell_et_al_2019]] - Model Cards for Model Reporting
- [[Yang_et_al_2022]] - Towards Fairer Datasets: Filtering and Balancing the Distribution of the People Subtree in the ImageNet Hierarchy
- [[Hardt_et_al_2016]] - Equality of Opportunity in Supervised Learning
