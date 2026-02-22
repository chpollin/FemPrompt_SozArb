---
title: Mitigating trust-induced inappropriate reliance on AI assistance
authors:
  - T. Srinivasan
  - J. Thomason
year: 2025
type: journalArticle
url: https://arxiv.org/pdf/2502.13321.pdf
tags:
  - paper
  - feminist-ai
  - bias-research
date_added: 2026-02-22
date_modified: 2026-02-22
---

# Mitigating trust-induced inappropriate reliance on AI assistance

## Abstract

Investigates trust-adaptive interventions to reduce inappropriate reliance on AI recommendations in decision-support tasks. Argues that AI assistants should adapt behavior based on user trust to mitigate both under- and over-trust. In two decision scenarios shows that providing supportive explanations for low trust and counter-explanations for high trust leads to 38% reduction in inappropriate reliance and 20% improvement in decision accuracy. Demonstrates that adaptive insertion of forced pauses to promote deliberation reduces over-trust, opening new paths for improved human-AI collaboration.

## Key Concepts

## Full Text

---
title: "Adjust for Trust: Mitigating Trust-Induced Inappropriate Reliance on AI Assistance"
authors: ["Tejas Srinivasan", "Jesse Thomason"]
year: 2025
type: conferencePaper
language: en
processed: 2026-02-05
source_file: Srinivasan_2025_Mitigating_trust-induced_inappropriate_reliance.md
confidence: 89
---

# Adjust for Trust: Mitigating Trust-Induced Inappropriate Reliance on AI Assistance

## Kernbefund

Vertrauensadaptive Interventionen – unterstützende Erklärungen bei niedrigem Vertrauen und Gegenargumente bei hohem Vertrauen – reduzieren unangemessene Abhängigkeit um bis zu 38% und verbessern die Entscheidungsgenauigkeit um 20%.

## Forschungsfrage

Wie können KI-Assistenten durch vertrauensadaptive Interventionen die unangemessene Abhängigkeit von KI-Empfehlungen bei zu hohem oder zu niedrigem Nutzervertrauen reduzieren?

## Methodik

Empirisch: Kontrollierte Between-Subjects Benutzer-Studien mit zwei Entscheidungsaufgaben (ARC-Wissensfragen, medizinische Diagnosen), simulierte KI-Assistenten, Messungen von Vertrauen und Reliance-Verhalten über mehrere Interaktionen hinweg
**Datenbasis:** User-Studien mit 30 Laienpersonen (ARC-Task), 20 Fachärzte (Diagnose-Task), insgesamt ca. 1800+ Nutzer-KI-Interaktionen

## Hauptargumente

- Nutzervertrauen ist nicht statisch und wird kontinuierlich durch Interaktionsergebnisse aktualisiert. Extremes Vertrauen (zu hoch oder zu niedrig) führt zu kognitiven Verzerrungen und unangemessener Abhängigkeit von KI-Empfehlungen (Over- und Under-Reliance).
- KI-Systeme sollten ihr Verhalten adaptiv an die Vertrauenslevel der Nutzer anpassen: Bei niedrigem Vertrauen erhöhen unterstützende Erklärungen die kritische Würdigung korrekter KI-Ratschläge; bei hohem Vertrauen reduzieren Gegenargumente oder erzwungene Pausen die unkritische Akzeptanz.
- Die Kombination von situationsspezifischen Interventionen (Erklärungen + kognitive Verzögerungen) führt zu messbar besserer Entscheidungsqualität und reduziert systemisch beide Formen unangemessener Abhängigkeit in High-Stakes-Domains wie Medizin.

## Kategorie-Evidenz

### Evidenz 1

Das Paper befasst sich explizit mit Nutzerkompetenzen im Umgang mit KI: 'trust does not always align with AI assistant trustworthiness' und untersucht wie Nutzer KI-Empfehlungen kritisch evaluieren und verarbeiten können. Die Interventionen zielen auf die Verbesserung des Verständnisses und der kritischen Reflexion ab.

### Evidenz 2

Das Paper behandelt klassische KI-Assistenzsysteme, algorithmische Entscheidungsfindung und Mensch-KI-Kollaboration in nicht-generativen Kontexten mit Fokus auf Vertrauen und Reliance-Verhalten.

### Evidenz 3

Das Paper adressiert systematische Verzerrungen in der Nutzer-KI-Interaktion: 'Miscalibrated trust acts as a cognitive bias' und untersucht unterschiedliche Fehlerraten (26% vs. 8% bei Ärzten, 68% vs. 40% Under-Reliance), die strukturelle Probleme der KI-Unterstützung offenbaren.

### Evidenz 4

Das Paper behandelt faire und angemessene Reliance als Fairness-Problem: 'Appropriate reliance can be fostered through various decision aids' und entwickelt Metriken und Interventionen zur Minimierung von Over- und Under-Reliance als Fairness-Dimensionen in KI-Systemen.

## Assessment-Relevanz

**Domain Fit:** Das Paper hat indirekten Bezug zur Schnittstelle von KI und Sozialer Arbeit durch seinen Fokus auf vulnerable Nutzer-KI-Interaktionen und High-Stakes Domains (Medizin, klinische Entscheidungen). Es ist relevant für sozialarbeiterische Kontexte, in denen KI-Assistenzsysteme in Beratung oder Fallmanagement eingesetzt werden könnten.

**Unique Contribution:** Das Paper leistet einen innovativen Beitrag durch die empirische Operationalisierung von vertrauensadaptiven Interventionen und zeigt, dass nicht Vertrauen selbst, sondern dessen (Fehl-)Kalibrierung das zentrale Design-Problem ist, das durch situationsspezifische, dynamische Verhaltensanpassungen adressierbar ist.

**Limitations:** Das Paper verwendet simulierte KI-Assistenten statt echter Systeme (z.B. LLMs), begrenzt sich auf Nutzer aus UK und USA, rekrutiert relativ kleine Stichproben (besonders 20 Ärzte), und kann daher Generalisierbarkeit nicht vollständig gewährleisten. Zudem setzt die Intervention Echtzeit-Feedback über Entscheidungskorrektheit voraus, was in realen Settings oft nicht verfügbar ist.

**Target Group:** KI-Entwickler und UX-Designer, die Assistenzsysteme entwickeln; klinische und medizinische Fachkräfte; Forschende in HCI und Human-AI Collaboration; Policy-Maker für AI Governance; indirekt relevant für Sozialarbeiter, die mit KI-gestützten Entscheidungssystemen arbeiten

## Schlüsselreferenzen

- [[Lee_See_2004]] - Trust in Automation: Designing for Appropriate Reliance
- [[Parasuraman_Riley_1997]] - Humans and Automation: Use, Misuse, Disuse, Abuse
- [[Jacovi_et_al_2021]] - Formalizing Trust in Artificial Intelligence
- [[Dzindolet_et_al_2003]] - The Role of Trust in Automation Reliance
- [[Buçinca_et_al_2021]] - To Trust or to Think: Cognitive Forcing Functions Can Reduce Overreliance
- [[Dhuliawala_et_al_2023]] - A Diachronic Perspective on User Trust in AI under Uncertainty
- [[Bansal_et_al_2021]] - Does the Whole Exceed Its Parts? The Effect of AI Explanations on Complementary Team Performance
- [[Lai_et_al_2023]] - Towards a Science of Human-AI Decision Making
