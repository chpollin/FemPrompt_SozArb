---
title: "A Survey on Intersectional Fairness in Machine Learning: Notions, Mitigation, and Challenges"
authors: ["Usman Gohar", "Lu Cheng"]
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
source_file: Gohar_2023_A_Survey_on_Intersectional_Fairness_in_Machine.md
---

# A Survey on Intersectional Fairness in Machine Learning: Notions, Mitigation, and Challenges

## Kernbefund

Der Survey präsentiert die erste umfassende Taxonomie für intersektionale Fairness-Notionen und Fair-Learning-Methoden und identifiziert zentrale Herausforderungen wie Data Sparsity bei kleineren Subgruppen und die Unzulänglichkeit von Mittigationstechniken, die auf unabhängige Gruppen optimiert sind.

## Forschungsfrage

Wie können wir Intersektionale Fairness in Machine-Learning-Systemen verstehen, messen und mitigieren?

## Methodik

Literaturreview und systematische Taxonomie von Fairness-Notionen und Mitigationstechniken
**Datenbasis:** nicht empirisch; Synthese von 90+ wissenschaftlichen Arbeiten zur intersektionalen Fairness in ML

## Hauptargumente

- Intersektionale Fairness ist fundamentaler als traditionelle Group Fairness, da die Diskriminierungserfahrung von Individuen an der Schnittmenge mehrerer geschützter Attribute (z.B. Rasse und Geschlecht) qualitativ unterschiedlich ist und nicht durch Fairness auf individuellen Dimensionen erfasst wird.
- Existing Fairness-Notionen (Statistical Parity, Equality of Opportunity) können auf intersektionalen Gruppen unfair sein, wie Buolamwini & Gebru (2018) mit Gender Shades demonstrierten, wo Black Women signifikant höhere Fehlerquoten in Gesichtserkennungssystemen erlebten als andere Gruppen.
- Die Mitigation intersektionaler Bias erfordert spezialisierte technische Ansätze wie Subgroup Fairness, Multicalibration und Differential Fairness, die jeweils unterschiedliche Trade-offs zwischen Fairness-Garantien, Recheneffizienz und Data-Sparsity-Problemen aufweisen.

## Kategorie-Evidenz

### KI_Sonstige

Survey fokussiert auf Machine Learning Systeme, algorithmische Entscheidungssysteme in hochriskanten Anwendungen (criminal sentencing, bank loans, hiring decisions), sowie NLP und Ranking-Systeme.

### Bias_Ungleichheit

Zentral ist die Analyse von algorithmischen Diskriminierungen: 'Machine learning (ML) has been increasingly used in high-stake applications such as loans, criminal sentencing, and hiring decisions with reported fairness implications for different demographic groups'

### Gender

Explicit gender focus: 'Black woman's experience of discrimination differs from both women and Black people in general' und extensive Diskussion von Gender-Bias in NLP-Modellen (BERT, GPT-2), Sentiment Analysis und Gender Classification.

### Diversitaet

Intersektionalität als Kernkonzept: Paper diskutiert Repräsentation marginalisierter Gruppen an Schnittmengen mehrerer Identitätsdimensionen (race, gender, disability, sexuality, religion) und deren Underrepresentation in Daten.

### Feministisch

Explizit auf Crenshaw (1989) Intersektionalitätstheorie aufbauend: 'recent works have identified a more nuanced case of group unfairness that spans multiple subgroups based on Crenshaw's theory of intersectionality called intersectional group fairness'. Intersektionalität ist ursprünglich eine feministische kritische Theorie.

### Fairness

Kernthema: umfassende Taxonomie von Fairness-Notionen (Subgroup Fairness, Multicalibration, Multiaccuracy, Differential Fairness, Max-Min Fairness, Metric-based Fairness) mit mathematischen Definitionen und Mitigationsmethoden.

## Assessment-Relevanz

**Domain Fit:** Hochrelevant für die Schnittmenge AI/Gender Studies/Diversität, aber mit begrenzter direkter Relevanz für Soziale Arbeit, da der Paper rein technisch-algorithmisch fokussiert und nicht auf Implementierung in Sozialen Diensten oder Arbeit mit vulnerablen Gruppen eingeht.

**Unique Contribution:** Erste umfassende Taxonomie intersektionaler Fairness-Notionen mit kritischer Analyse ihrer Limitationen und ein systematischer Überblick über State-of-the-Art-Mitigationstechniken sowie offene Forschungsfragen.

**Limitations:** Paper ist rein theoretisch-konzeptuell; empirische Evaluationen der Fairness-Notionen auf realen Datensätzen sind begrenzt; wenig Behandlung von Kontextfaktoren jenseits statistischer Fairness; keine Integration qualitativer/sozialer Perspektiven von betroffenen Gruppen.

**Target Group:** ML-Forscher und -Entwickler, AI-Ethiker, Policymaker im Tech-Bereich, Gender Studies und Diversity-Spezialist:innen; begrenzt relevant für Sozialarbeiter:innen ohne technischen Hintergrund

## Schlüsselreferenzen

- [[Crenshaw_1989]] - Demarginalizing the Intersection of Race and Sex
- [[Buolamwini_Gebru_2018]] - Gender Shades: Intersectional Accuracy Disparities
- [[Kearns_et_al_2018]] - Preventing Fairness Gerrymandering: Subgroup Fairness
- [[HebertJohnson_et_al_2018]] - Multicalibration: Calibration for the Computationally-Identifiable Masses
- [[Foulds_et_al_2020]] - An Intersectional Definition of Fairness (Differential Fairness)
- [[Tan_Celis_2019]] - Assessing Social and Intersectional Biases in Contextualized Word Representations
- [[Mehrabi_et_al_2021]] - A Survey on Bias and Fairness in Machine Learning
- [[Dwork_et_al_2012]] - Fairness through Awareness
- [[Hashimoto_et_al_2018]] - Fairness without Demographics through Distributionally Robust Optimization
- [[Kirk_et_al_2021]] - Bias Out-of-the-Box: Intersectional Occupational Biases in Language Models
