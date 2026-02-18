---
title: "A Survey on Intersectional Fairness in Machine Learning: Notions, Mitigation, and Challenges"
authors: ["Usman Gohar", "Lu Cheng"]
year: 2023
type: conferencePaper
language: en
processed: 2026-02-05
source_file: Gohar_2023_Survey.md
confidence: 95
---

# A Survey on Intersectional Fairness in Machine Learning: Notions, Mitigation, and Challenges

## Kernbefund

Der Survey präsentiert die erste umfassende Taxonomie für intersektionale Fairness-Notionen (Subgroup Fairness, Multicalibration, Metric-based Fairness, Differential Fairness, Max-Min Fairness) und identifiziert kritische Herausforderungen wie Data Sparsity, Fairness Gerrymandering und die Notwendigkeit von Fairness jenseits reiner Parität.

## Forschungsfrage

Welche Notionen von intersektionaler Fairness existieren in Machine Learning, wie können intersektionale Diskriminierungen gemindert werden, und welche Herausforderungen ergeben sich dabei?

## Methodik

Theoretisch/Review - systematische Literaturübersicht mit Taxonomie-Entwicklung für intersektionale Fairness-Notionen und Mittigationsansätze
**Datenbasis:** nicht empirisch - Literaturanalyse und theoretische Synthese von 80+ wissenschaftlichen Arbeiten

## Hauptargumente

- Intersektionale Fairness erweitert das Verständnis von Algorithmen-Bias über einzelne geschützte Attribute hinaus: Eine ML-Vorhersage kann fair gegenüber unabhängigen Gruppen (z.B. Frauen, Schwarze Menschen) sein, diskriminiert aber Personen an der Schnittmenge dieser Identitäten (z.B. Schwarze Frauen) auf einzigartige Weise - ein Phänomen, das in bekannten Systemen wie Geschlechtsklassifikationsalgorithmen dokumentiert ist.
- Bestehende Mittigationsansätze basieren stark auf spezifischen Surrogate-Fairness-Notionen, die nicht generalisierbar sind: Die meisten Techniken (Auditing-basiert, Reweighting, Adversarial Learning) sind an bestimmte Fairness-Definitionen gebunden und können nicht als Plugin-Tools für beliebige Prädiktoren verwendet werden, was die praktische Anwendbarkeit einschränkt.
- Intersektionale Fairness ohne demografische Daten bietet Potenzial für Datenschutz, verstärkt aber Effektivitätsprobleme: Arbeiten wie Distributionally Robust Optimization (DRO) und Adversarial Reweighting vermeiden sensitive Attribute aus Datenschutzgründen, können aber intersektionale Gruppen ohne starke demografische Signale in ungeschützten Attributen verfehlen und versperren damit echte Intersektionalität.

## Kategorie-Evidenz

### Evidenz 1

Fokus auf Machine Learning Fairness, Algorithmen, Predictive Systems in hochstakigen Anwendungen wie Kreditvergabe und strafrechtliche Verurteilung: 'Machine learning (ML) has been increasingly used in high stake applications such as loans, criminal sentencing, and hiring decisions'

### Evidenz 2

Zentrale Thematisierung von Diskriminierung in ML-Systemen und deren Auswirkungen auf verschiedene demografische Gruppen: 'Measuring and mitigating discrimination in ML/AI systems has been studied extensively'

### Evidenz 3

Explizite Geschlechterperspektive mit Beispielen von Gender-Bias, insbesondere in Gesichtserkennungssystemen: 'Buolamwini and Gebru, 2018 identified accuracy disparities that were more significant for Black Women in gender classification algorithms'

### Evidenz 4

Starke Fokussierung auf marginalisierte und intersektionale Gruppen sowie deren differenzierte Erfahrungen: 'interaction along multiple dimensions of identity produces unique and differing levels of discrimination for various possible subgroups'

### Evidenz 5

Explizite Verwendung von Crenshaw's Intersektionalitätstheorie als Basis der gesamten Analyse: 'based on Crenshaw's theory of intersectionality [Crenshaw, 1989] called intersectional group fairness' und Bezugnahme auf intersektionales Verständnis von Diskriminationserfahrungen: 'a Black woman's experience of discrimination differs from both women and Black people in general'

### Evidenz 6

Kernfokus auf algorithmische Fairness mit umfassender Taxonomie von Fairness-Notionen: Statistical Parity Subgroup Fairness, Multicalibration, Metric-based Fairness, Differential Fairness und Max-Min Fairness werden detailliert analysiert

## Assessment-Relevanz

**Domain Fit:** Das Paper ist hochgradig relevant für die Schnittstelle AI und Soziale Arbeit, insbesondere bezüglich fairnessorientierter KI-Systeme in Entscheidungsprozessen, die vulnerable Gruppen betreffen. Die intersektionale Perspektive spricht direkt sozialarbeiterische Bedenken über strukturelle Diskriminierung und marginalisierte Communities an, auch wenn die Soziale Arbeit nicht explizit adressiert wird.

**Unique Contribution:** Dies ist die erste umfassende Taxonomie von intersektionalen Fairness-Notionen und Mittigationsansätzen in ML, die systematisch die Lücken zwischen theoretischen Fairness-Konzepten und praktischer Implementierbarkeit aufzeigt und dabei explizit feministische Intersektionalitätstheorie (Crenshaw) in den KI-Kontext integriert.

**Limitations:** Der Survey konzentriert sich primär auf Klassifikationsaufgaben mit i.i.d. Daten und behandelt andere KI-Domänen nur kurz; praktische Empfehlungen für Practitioners außerhalb des ML-Feldes sind limitiert; Die fehlende Diskussion von nicht-paritätsbasierten intersektionalen Fairness-Ansätzen wird von den Autoren selbst als kritische Lücke identifiziert.

**Target Group:** Primär: ML-Forscher, AI-Practitioners, Fairness-Techniker und Auditor:innen. Sekundär: Policy-Maker in der Regulierung von KI-Systemen, Vertreter:innen von Advocacy-Organisationen, kritische Technologiestudien-Forscher:innen. Potentiell relevant für: Sozialarbeiter:innen, die mit algorithmen-mediierten Entscheidungssystemen arbeiten (z.B. Kreditvergabe, strafrechtliche Verurteilung, Kinderschutz-Algorithmen).

## Schlüsselreferenzen

- [[Crenshaw_1989]] - Demarginalizing the Intersection of Race and Sex: A Black Feminist Critique of Antidiscrimination Doctrine, Feminist Theory and Antiracist Politics
- [[Buolamwini_Gebru_2018]] - Gender Shades: Intersectional Accuracy Disparities in Commercial Gender Classification
- [[Kearns_et_al_2018]] - Preventing Fairness Gerrymandering: Auditing and Learning for Subgroup Fairness
- [[HebertJohnson_et_al_2018]] - Multicalibration: Calibration for the (Computationally-identifiable) Masses
- [[Foulds_et_al_2020]] - An Intersectional Definition of Fairness
- [[Mehrabi_et_al_2021]] - A Survey on Bias and Fairness in Machine Learning
- [[Dwork_et_al_2012]] - Fairness Through Awareness
- [[Tan_Celis_2019]] - Assessing Social and Intersectional Biases in Contextualized Word Representations
- [[Cheng_et_al_2022]] - Debiasing Word Embeddings with Nonlinear Geometry
- [[Wang_et_al_2022]] - Towards Intersectionality in Machine Learning: Including More Identities, Handling Underrepresentation, and Performing Evaluation
