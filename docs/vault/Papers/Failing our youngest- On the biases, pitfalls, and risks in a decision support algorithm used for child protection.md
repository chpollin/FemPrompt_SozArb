---
title: Failing our youngest: On the biases, pitfalls, and risks in a decision support algorithm used for child protection
authors:
  - T. Moreau
  - R. Sinatra
  - V. Sekara
year: 2024
type: conferencePaper
doi: 10.1145/3630106.3658906
tags:
  - paper
  - feminist-ai
  - bias-research
date_added: 2026-02-22
date_modified: 2026-02-22
bias_types:
  - Discrimination
---

# Failing our youngest: On the biases, pitfalls, and risks in a decision support algorithm used for child protection

## Abstract

Critical empirical study examining child protection decision support algorithm deployed in Danish municipalities, analyzing its biases and implementation challenges. Using real administrative data from Denmark's child welfare system, evaluated algorithm's predictions against actual case outcomes and found significant biases including disproportionate impacts on immigrant families and systematic errors in risk assessment. Results revealed concerning patterns of false positives for marginalized communities and questioned algorithm's validity for high-stakes decision-making. Documents actual harms from deployed systems.

## Key Concepts

### Bias Types
- [[Discrimination]]

## Full Text

---
title: "Failing Our Youngest: On the Biases, Pitfalls, and Risks in a Decision Support Algorithm Used for Child Protection"
authors: ["Therese Moreau Hansen", "Roberta Sinatra", "Vedran Sekara"]
year: 2024
type: conferencePaper
language: en
processed: 2026-02-05
source_file: Moreau_2024_Failing_our_youngest_On_the_biases,_pitfalls,_and.md
confidence: 95
---

# Failing Our Youngest: On the Biases, Pitfalls, and Risks in a Decision Support Algorithm Used for Child Protection

## Kernbefund

Der DSS-Algorithmus weist erhebliche Mängel auf, darunter Informationslecks zwischen Test- und Trainings-Sets, unangemessene Proxies für Kindesmisshandlung, inkonsistente Risikoscores und signifikante altersbasierte Diskriminierung, die Kinder systematisch unterschiedlich bewertet.

## Forschungsfrage

Welche methodischen Fehler, Bias und Diskriminierungspotenziale weist der Decision Support System (DSS) Algorithmus auf, der von dänischen Behörden zur Identifikation gefährdeter Kinder in der Kinderschutzarbeit eingesetzt wird?

## Methodik

Empirisch: Algorithmisches Audit durch Zugangsanfrage zu Algorithmus-Dokumentation, Koeffizientengewichte und Trainingsmethoden; Counterfactual-Simulationen zur Analyse von Diskriminierungsmustern; Datenbasis-Analyse öffentlicher Statistiken.
**Datenbasis:** ~120.000 Mitteilungen an dänische Behörden (2014-2015); Analysen von öffentlichen Statistiken aus Denmark (2015-2020, n=56.541 Kinder); Simulationen mit fiktiven Kinderprofilen; Reverse Engineering des 9-Feature-Modells

## Hauptargumente

- Der DSS-Algorithmus zeigt methodische Defizite in der Datenverarbeitung (standardization vor train-test split führt zu Information Leakage), was zu überschätzter Performance führt und die reale Modellgüte gefährdet.
- Jüngere Kinder erhalten systematisch niedrigere Risikoscores als ältere, obwohl altersabhängiges erhöhtes Misshandlungsrisiko in der Forschung nicht belegt ist – dies resultiert aus verzerrten Trainingsdaten, die nur Fälle mit Behördenkontakt enthalten.
- Der Algorithmus ist selbstverstärkend (self-validating), da Sozialarbeiter:innen sowohl die Risikoscores als auch die Interventionen (Zielgrößen) bestimmen, was zu Zirkelschlüssen führt und echte Vorhersagekraft verdeckt.

## Kategorie-Evidenz

### Evidenz 1

Kritische Analyse der technischen Kompetenzen bei Algorithmus-Implementierung in Behörden: 'we strongly advise against the use of this kind of algorithms in local government, municipal, and child protection settings, and we call for rigorous evaluation of such tools before implementation'

### Evidenz 2

Detaillierte Audit eines Predictive Risk Models mit Post-Lasso Regression: 'The resulting linear model for DSS contains 9 features... and predicts a risk score (rs)' sowie Analyse von Machine-Learning-Methodologie

### Evidenz 3

Direkter Fokus auf Kinderschutzpraxis und sozialarbeiterische Entscheidungsfindung: 'Designed as a support tool for caseworkers assessing the risk of child abuse, DSS was developed and pilot-tested in collaboration with the municipalities'

### Evidenz 4

Nachweis von systematischer Diskriminierung und struktureller Benachteiligung: 'DSS scores children differently. For example, a well-treated 17-year-old... will have a base risk score of 8, while a 0-year-old will have a risk score of 1' sowie 'model predictions are very skewed with respect to socio-economic class'

### Evidenz 5

Analyse von Disparitäten gegenüber vulnerablen Gruppen (Kinder, sozioökonomisch Benachteiligte, Familien mit Substanzmissbrauch): 'some of the indicators of neglect are direct proxies of poverty'

### Evidenz 6

Zentrale Fokussierung auf algorithmische Fairness und Diskriminierungsfreiheit: 'Age is a protected attribute and globally recognized as a ground for discrimination. As such, avoiding automated discrimination based on protected attributes should be a prime concern'

## Assessment-Relevanz

**Domain Fit:** Hochrelevant an der Schnittstelle von KI-Systemen und Sozialer Arbeit: Das Paper demonstriert konkret, wie algorithmische Entscheidungssysteme in der sensiblen Domäne der Kinderschutzarbeit zu Diskriminierung und Fehlbewertungen vulnerabler Gruppen führen können – ein kritisches Anwendungsfeld für Fragen von Fairness und Ethik.

**Unique Contribution:** Das Paper leistet einen innovativen empirischen Beitrag durch ein rigoroses technisches Audit eines in der Praxis eingesetzten Kinderschutz-Algorithmus mittels Freedom of Information Request, Counterfactual-Analyse und öffentlicher Datennutzung, das systemische Diskriminierungsmechanismen aufdeckt, die ohne externe Audit verborgen geblieben wären.

**Limitations:** Begrenzte Zugangsrechte zur vollständigen Dokumentation und zum Quellcode des Algorithmus; fehlende direkte Zugang zu Trainingsdaten; keine Evaluation der neueren XGBoost-Version des Algorithmus; Audit basiert auf Reverse-Engineering und macht teilweise Annahmen über undokumentierte Prozesse.

**Target Group:** Mehrschichtig: (1) Sozialarbeiter:innen und Kinderschutzbehörden, die KI-Systeme evaluieren/einführen; (2) KI-Entwickler:innen und Datenwissenschaftler:innen in Public-Sector-Kontexten; (3) Policy-Maker und Regulatoren im Bereich Algorithmische Accountability; (4) Rechtswissenschaftler:innen und Ethiker:innen; (5) Forscher:innen in AI/Fairness und Applied Social Sciences

## Schlüsselreferenzen

- [[Chouldechova_BenavidesPrado_Fialko_Vaithianathan_2018]] - Algorithm-assisted decision making in child maltreatment hotline screening
- [[Eubanks_2018]] - Automating Inequality: How high-tech tools profile, police, and punish the poor
- [[Kapoor_Narayanan_2023]] - Leakage and the reproducibility crisis in machine-learning-based science
- [[Saxena_BadilloUrquiola_Wisniewski_Guha_2020]] - A human-centered review of algorithms used within the US child welfare system
- [[Salganik_et_al_2020]] - Measuring the predictability of life outcomes with a scientific mass collaboration
- [[Kaufman_Rosset_Perlich_Stitelman_2012]] - Leakage in data mining: Formulation, detection, and avoidance
- [[Thomas_Uminsky_2022]] - Reliance on metrics is a fundamental challenge for AI
- [[Broussard_2018]] - Artificial Unintelligence: How computers misunderstand the world
- [[Amnesty_International_2021]] - Xenophobic Machines: Discrimination through unregulated use of algorithms in the Dutch childcare benefits scandal
