---
title: Assessing trustworthy AI: Technical and legal perspectives of fairness in AI
authors:
  - M. Kattnig
  - A. Angerschmid
  - T. Reichel
  - R. Kern
year: 2024
type: journalArticle
url: https://graz.elsevierpure.com/ws/portalfiles/portal/89954869/1-s2.0-S0267364924001195-main.pdf
doi: 10.1016/j.clsr.2024.106053
tags:
  - paper
  - feminist-ai
  - bias-research
date_added: 2026-02-22
date_modified: 2026-02-22
bias_types:
  - Discrimination
mitigation_strategies:
  - Bias Mitigation
llm_decision: Include
llm_confidence: 0.92
llm_categories:
  - KI_Sonstige
  - Bias_Ungleichheit
  - Fairness
human_decision: Include
human_categories:
  - Generative_KI
  - KI_Sonstige
  - Bias_Ungleichheit
  - Gender
  - Diversitaet
  - Fairness
agreement: agree
---

# Assessing trustworthy AI: Technical and legal perspectives of fairness in AI

## Abstract

Kattnig et al. examine the disconnect between existing AI fairness techniques and the requirements of non-discrimination law, highlighting that many algorithmic bias mitigation methods do not meet legal standards for equality. Focusing on the EU context (with particular attention to the forthcoming AI Act and established non-discrimination directives), the authors review state-of-the-art bias mitigation approaches – from pre-processing data fixes to in-processing algorithms – and evaluate them against legal concepts of fairness and equality. They discuss how ambiguous legal frameworks and the difficulty of defining “fairness” pose challenges: for instance, fairness has multiple interpretations (individual vs. group fairness, formal vs. substantive equality) and is understood differently across disciplines. The paper argues for an interdisciplinary legal methodology to complement technical solutions. In practice, this means moving beyond purely quantitative parity metrics and ensuring AI systems comply with human rights and equality principles (e.g. ensuring de facto non-discrimination for all data subjects). By contrasting algorithms with legal norms, the study underlines that trustworthy AI requires more than technical robustness – it demands alignment with justice and accountability frameworks.

## Assessment

**LLM Decision:** Include (Confidence: 0.92)
**LLM Categories:** KI_Sonstige, Bias_Ungleichheit, Fairness
**Human Decision:** Include
**Human Categories:** Generative_KI, KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet, Fairness
**Agreement:** Agree

## Key Concepts

### Bias Types
- [[Discrimination]]

### Mitigation Strategies
- [[Bias Mitigation]]

## Full Text

---
title: "Assessing trustworthy AI: Technical and legal perspectives of fairness in AI"
authors: ["Markus Kattnig", "Alessa Angerschmid", "Thomas Reichel", "Roman Kern"]
year: 2024
type: journalArticle
language: en
processed: 2026-02-05
source_file: Kattnig_2024_Assessing_trustworthy_AI_Technical_and_legal.md
confidence: 89
---

# Assessing trustworthy AI: Technical and legal perspectives of fairness in AI

## Kernbefund

Obwohl zahlreiche technische Methoden zur Bias-Mitigation existieren, erfüllen nur wenige die bestehenden EU-Rechtsanforderungen. Eine interdisziplinäre Herangehensweise ist notwendig, um die Kluft zwischen technischen und rechtlichen Konzepten von Fairness zu überbrücken.

## Forschungsfrage

Wie können technische Methoden zur Bias-Mitigation mit den rechtlichen Anforderungen der EU, insbesondere des AI Act, in Einklang gebracht werden, um faire und nicht-diskriminierende KI-Systeme zu gewährleisten?

## Methodik

Theoretisch-vergleichende Review: Analyse von State-of-the-Art Bias-Mitigationsmethoden und deren Gegenüberstellung mit EU-Rechtlichen Anforderungen (AI Act, GDPR, ECHR, Non-Discrimination Law)

## Hauptargumente

- Fairness ist ein komplexes, interdisziplinäres Konzept, das in Rechtswissenschaften, Informatik und Sozialwissenschaften unterschiedlich definiert wird, was zu Umsetzungskhallengen führt.
- Bias in KI-Systemen entsteht durch systematische und historische Ungleichheiten in Trainingsdaten und kann durch Feedback-Loops verstärkt werden, was bereits benachteiligte Gruppen weiter diskriminiert.
- Technische Bias-Mitigationsmethoden (Pre-, In-, Post-Processing) müssen mit EU-Rechtlichen Anforderungen (Nicht-Diskriminierung, Fairness, Transparenz, Kontrollierbarkeit) abgeglichen werden, was bisher unzureichend geschieht.

## Kategorie-Evidenz

### Evidenz 1

Das Paper behandelt das Verständnis und die kritische Reflexion von KI-Systemen: 'it is crucial to examine the legal requirements for AI systems to ensure fairness and non-discrimination. This paper examines the legal framework for AI in the EU and provides insights into the challenges and opportunities of addressing bias mitigation in AI systems'

### Evidenz 2

Umfassende Behandlung von Machine Learning Methoden, algorithmischen Entscheidungssystemen und deren technischen Implementierungen: 'Automated decision-making systems (ADMs) gather and process data in order to make qualitative decisions with minimal to no human intervention'

### Evidenz 3

Zentraler Fokus auf algorithmischen Bias und soziale Ungleichheit: 'bias refers to the presence of systematic and unfair behaviour and errors in AI systems. Hence, a bias may lead to discriminatory outcomes and unfair treatment, which further implicates the importance of fairness' und 'systematic or historical inequalities, which exacerbate unfair treatment of already disadvantaged groups'

### Evidenz 4

Thematisiert Repräsentation und Benachteiligung verschiedener Gruppen: 'they especially targeted poor and minority neighbourhoods' und Diskussion von Group Fairness vs. Individual Fairness für unterschiedliche Populationen

### Evidenz 5

Zentrales Thema des gesamten Papers mit detaillierter Analyse von Fairness-Konzepten: 'Fairness is considered the central starting point for the application of AI in society' und umfassende Behandlung von Fairness-Maßnahmen, Group Fairness und Individual Fairness

## Assessment-Relevanz

**Domain Fit:** Das Paper ist hochrelevant für die Schnittstelle von KI und Regulierung, behandelt aber Soziale Arbeit nicht explizit. Es ist jedoch von großer Bedeutung für Sozialarbeiter:innen, die mit automatisierten Entscheidungssystemen (z.B. in Hilfevergabe, Risikoeinschätzung) konfrontiert sind und deren diskriminierendes Potenzial verstehen müssen.

**Unique Contribution:** Der besondere Beitrag liegt in der systematischen Gegenüberstellung von technischen Bias-Mitigationsmethoden mit EU-Rechtsanforderungen und der Aufzeigung der Lücke zwischen technischen und juridischen Fairness-Konzepten.

**Limitations:** Das Paper ist primär auf die EU fokussiert und behandelt Soziale Arbeit nicht als Anwendungsfeld; empirische Überprüfung der Rechtskonformität von Mitigationsmethoden fehlt.

**Target Group:** KI-Entwickler:innen, Compliance-Officer, Policymaker, Rechtsexpert:innen im Bereich KI-Regulierung, kritische Informatiker:innen; sekundär relevant für Sozialarbeiter:innen, die mit automatisierten Entscheidungssystemen arbeiten

## Schlüsselreferenzen

- [[Calders_et_al_2010]] - Massaging and Reweighting for Bias Mitigation
- [[Tyler_2000]] - Procedural Fairness Elements
- [[ONeil_2016]] - Weapons of Math Destruction / Feedback Loops in Automated Systems
- [[Rawls_None]] - Fair Procedures and Court Proceedings
- [[Lind_Tyler_1988]] - Procedural Justice in Court Systems
- [[Colquitt_2001]] - Organisational Justice
- [[Skitka_et_al_2000]] - Automation Bias in Decision-Support Systems
- [[Hussain_et_al_2022]] - Adversarial Attacks on Fairness in Machine Learning
- [[Dwork_et_al_2018]] - Decoupled Classifiers for Group-Fair Machine Learning
- [[Wachter_Mittelstadt_Russell_2021]] - Why Fairness Cannot Be Automated
