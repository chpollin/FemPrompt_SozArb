---
title: "Intersectional Fairness: A Fractal Approach"
authors: ["Giulio Filippi", "Sara Zannone", "Adriano Koshiyama"]
year: 2023
type: conferencePaper
language: en
categories:
  - KI_Sonstige
  - Bias_Ungleichheit
  - Gender
  - Diversitaet
  - Feministisch
  - Fairness
processed: 2026-02-05
source_file: Zannone_2023_Intersectional_Fairness_A_Fractal_Approach.md
confidence: 95
---

# Intersectional Fairness: A Fractal Approach

## Kernbefund

Fairness propagiert 'aufwärts' durch Intersektionalitätsebenen (von spezifischsten zu allgemeineren Gruppen), aber nicht 'abwärts'. Die Varianz der empirischen Erfolgsquoten folgt unter perfekter Fairness einem exponentiellen Skalierungsgesetz, das als Benchmark für Intersektionale Statistische Parität verwendet werden kann.

## Forschungsfrage

Wie kann intersektionale Fairness in KI-Systemen mathematisch modelliert und gemessen werden, wenn multiple geschützte Attribute auf verschiedenen Ebenen der Granularität intersektieren?

## Methodik

Theoretisch/Mathematisch mit empirischer Validierung: Geometrische Modellierung durch Hypercube-Struktur, dynamische Programmierung für Propagation, theoretische Beweise zur Fairness-Propagation, synthetische und echte Datenexperimente (Adult-Dataset).
**Datenbasis:** Synthetische Daten: M=10 geschützte Attribute, 1024 Vertices mit je 200R Instanzen (R∈[1,10]); Real: Adult-Dataset (N=48,842 Instanzen mit M=4 binären geschützten Attributen)

## Hauptargumente

- Die Modellierung von Intersektionalität als Hypercube-Struktur ermöglicht eine einheitliche geometrische Analyse aller möglichen intersektionalen Subgruppen gleichzeitig, anstatt a priori eine bestimmte Granularität festzulegen.
- Mathematischer Beweis: Wenn Fairness an der niedrigsten Ebene (vollständige Intersection aller geschützten Attribute) garantiert wird, impliziert dies notwendigerweise Fairness auf allen höheren Ebenen und für alle einzelnen Attribute – dies widerlegt die Annahme, dass Fairness auf Individualebene zu Gruppenfairness führt.
- Die Varianzreduktion erfolgt exponentiell mit aufsteigenden Ebenen unter Intersektionaler Statistischer Parität (ISP), was einen neuen statistischen Test und die VarRatio-Metrikfamilie zur Quantifizierung intersektionalen Bias ermöglicht und robuster gegen Stichprobenvarianz ist.

## Kategorie-Evidenz

### KI_Sonstige

Fokus auf algorithmische Fairness, statistische Parität, Gleichheit der Gelegenheiten in Klassifikationssystemen; mathematische und algorithmische Methoden für Machine Learning.

### Bias_Ungleichheit

'The issue of fairness in AI has received an increasing amount of attention in recent years. A number of AI systems involved in sensitive applications, like recruitment or credit scoring, were found to be biased against minority groups'

### Gender

'darker-skinned females' Diskriminierung in Gesichtserkennungssystemen; Gender als zentrale geschützte Attribut in Beispielen und Experimenten.

### Diversitaet

'the intersection of gender and ethnicity' (white male, black male, white female and black female); Fokus auf marginalisierte Gruppen durch Intersektionalität; multiple geschützte Attribute (Rasse, Geschlecht, Alter, Familienstand).

### Feministisch

Explizite Referenzen auf feministische Intersektionalitätstheorie: 'The concept of intersectional fairness, initially introduced by Black feminist scholars [Crenshaw(2013a), Crenshaw(2013b)]' und 'The fact that the discrimination faced by Black women was greater than the sum of the discrimination experienced by Black men and white women is a well-known concept in the feminist literature [Crenshaw(2013a)], also known as fairness gerrymandering'

### Fairness

Gesamtpapier widmet sich Fairness-Metriken (Statistical Parity, Disparate Impact, Equality of Outcome, Equality of Opportunity); mathematische Beweise zu Fairness-Propagation; Definition und Messung intersektionaler Fairness.

## Assessment-Relevanz

**Domain Fit:** Hochgradig relevant für die Schnittstelle KI/Diversität/Fairness, insbesondere für Verständnis systemischer Diskriminierung. Moderate Relevanz für Soziale Arbeit als Anwendungsfeld (rekrutierung, Kreditvergabe, Sozialdienste); stärker als theoretisch-methodischer Beitrag zur Fairness-Messung relevant.

**Unique Contribution:** Erstmals systematische mathematische Modellierung und Beweis, dass Fairness-Eigenschaften bei vollständiger intersektionaler Berücksichtigung automatisch auf alle höheren Aggregationsebenen propagieren, kombiniert mit neuem Varianz-basierten Messsystem für intersektionalen Bias.

**Limitations:** Beschränkung auf binäre geschützte Attribute (obwohl erweiterbar); Subsampling-Annahmen zur Validierung; aggregierende statt granulare Bias-Analyse; begrenzte echte Datenexperimente (nur Adult-Dataset).

**Target Group:** Primär: ML-Fairness-Forscher:innen, KI-Ethiker:innen, Algoritmenaudit-Spezialist:innen. Sekundär: Datenwissenschaftler:innen in sensiblen Anwendungsdomänen (Recruiting, Finanzdienstleistungen, Justiz), Policymaker mit Fairness-Mandaten. Tertiär: Sozialarbeiter:innen und Aktivist:innen, die Systeminequitäten verstehen möchten.

## Schlüsselreferenzen

- [[Crenshaw_2013]] - Demarginalizing the Intersection of Race and Sex / Mapping the Margins
- [[Buolamwini_Gebru_2018]] - Gender Shades: Intersectional Accuracy Disparities in Commercial Gender Classification
- [[Kearns_et_al_2018]] - Preventing Fairness Gerrymandering: Auditing and Learning for Subgroup Fairness
- [[Foulds_et_al_2020]] - An Intersectional Definition of Fairness / Bayesian Modeling of Intersectional Fairness
- [[Feldman_et_al_2014]] - Certifying and Removing Disparate Impact
- [[Hardt_et_al_2016]] - Equality of Opportunity in Supervised Learning
- [[Mehrabi_et_al_2021]] - A Survey on Bias and Fairness in Machine Learning
- [[Kong_2022]] - Are 'Intersectionally Fair' AI Algorithms Really Fair to Women of Color?
