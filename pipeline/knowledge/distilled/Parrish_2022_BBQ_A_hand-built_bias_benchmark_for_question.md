---
title: "BBQ: A Hand-Built Bias Benchmark for Question Answering"
authors: ["Alicia Parrish", "Angelica Chen", "Nikita Nangia", "Vishakh Padmakumar", "Jason Phang", "Jana Thompson", "Phu Mon Htut", "Samuel R. Bowman"]
year: 2022
type: conferencePaper
language: en
processed: 2026-02-05
source_file: Parrish_2022_BBQ_A_hand-built_bias_benchmark_for_question.md
confidence: 91
---

# BBQ: A Hand-Built Bias Benchmark for Question Answering

## Kernbefund

NLP-Modelle zeigen starke Abhängigkeit von Stereotypen in unterinformativen Kontexten und wählen in 77% der Fälle stereotype Antworten; auch mit informativem Kontext reduziert sich die Genauigkeit um bis zu 3,4 Prozentpunkte, wenn die korrekte Antwort mit sozialen Vorurteilen kollidiert.

## Forschungsfrage

Wie manifestieren sich soziale Vorurteile in den Ausgaben von NLP-Modellen bei Question-Answering-Aufgaben, und unter welchen Kontextbedingungen treten diese Verzerrungen auf?

## Methodik

Empirisch: Hand-erstellter Bias-Benchmark mit Kontextvariation und Multiple-Choice-Questions über 9 Bias-Dimensionen; Evaluation von UnifiedQA, RoBERTa und DeBERTaV3 Modellen; Crowdworker-Validierung
**Datenbasis:** BBQ-Dataset mit 325 einzigartigen Templates, expandiert zu durchschnittlich 175 Fragen pro Template, insgesamt über 58.000 Beispiele; Tests an 3 großen Sprachmodellen

## Hauptargumente

- Soziale Vorurteile in NLP-Modellen manifesta in diskreten Modellausgaben bei QA-Aufgaben und nicht nur in Marginal-Wahrscheinlichkeiten; unter-informative Kontexte führen zu Stereotype-Verstärkung (bis 77%), was Schaden durch Sterotypisierung und Attribution verursacht.
- Modelle zeigen konsistente Bias-Muster über neun soziale Dimensionen (Alter, Behinderung, Geschlecht, Nationalität, physisches Erscheinungsbild, Rasse/Ethnizität, Religion, SES, sexuelle Orientierung) und bevorzugen stereotype Antworten auch wenn korrekte Informationen vorhanden sind.
- Die Bias-Scores zeigen Geschlecht als besonders problematische Dimension mit über 5 Prozentpunkten Genauigkeitsunterschied zwischen bias-konform und bias-widersprechenden Antworten; intersektionale Biases sind schwächer messbar und erfordern weitere Forschung.

## Kategorie-Evidenz

### Evidenz 1

Paper fokussiert auf NLP-Modelle und Question-Answering Tasks: 'we measure biases against a range of social categories and also measure in which contexts these impacts are most likely to be exhibited'

### Evidenz 2

Expliziter Fokus auf soziale Vorurteile gegen marginalisierte Gruppen: 'social biases against people belonging to protected classes' und 'representational harms...occur when systems reinforce the subordination of some groups along the lines of identity'

### Evidenz 3

Geschlecht ist eine der neun Dimensionen mit besonders hohen Bias-Scores: 'this difference widening to over 5 points on examples targeting gender for most models tested'

### Evidenz 4

Benchmark adressiert neun verschiedene soziale Dimensionen und marginalisierte Gruppen: 'targets attested social biases against nine different socially-relevant categories' einschließlich Rasse, Religion, sexuelle Orientierung und SES

### Evidenz 5

Fokus auf faire Modellausgaben und Messung von Bias in QA-Systemen; Ziel ist 'facilitating efforts to mitigate those potential harms'

## Assessment-Relevanz

**Domain Fit:** Das Paper hat begrenzten direkten Bezug zu Sozialer Arbeit, ist aber hochrelevant für die Schnittstelle KI/Gesellschaft, insbesondere bezüglich algorithmischer Gerechtigkeit und dem Schutz marginalisierter Gruppen vor Diskriminierung durch KI-Systeme. Für Sozialarbeiter:innen ist es relevant als Ressource zum Verständnis von Bias in digitalen Systemen.

**Unique Contribution:** BBQ bietet das erste umfassende Hand-annotierte Benchmark-Dataset, das soziale Vorurteile in diskreten NLP-Modellausgaben bei Question-Answering misst und unterscheidet zwischen unter-informativen und informativen Kontexten.

**Limitations:** Das Benchmark ist auf US-englischsprachige Kontexte begrenzt; intersektionale Biases zeigen inkonsistente Ergebnisse und erfordern weitere Forschung; die Autoren betonen, dass niedrige Bias-Scores nicht beweisen, dass ein Modell unvoreingenommen ist.

**Target Group:** NLP-Forscher:innen, KI-Entwickler:innen, AI Ethics-Spezialist:innen, Fairness-Auditor:innen und Policymaker im KI-Bereich; sekundär relevant für Sozialarbeiter:innen und Advocacy-Organisationen, die sich mit algorithmischer Gerechtigkeit befassen

## Schlüsselreferenzen

- [[Crawford_2017]] - The trouble with bias
- [[Blodgett_et_al_2020]] - Language (technology) is power: A critical survey of bias in NLP
- [[Li_et_al_2020]] - UNQOVERing stereotyping biases via underspecified questions
- [[Rudinger_et_al_2018]] - Gender bias in coreference resolution
- [[Caliskan_et_al_2017]] - Semantics derived automatically from language corpora contain human-like biases
- [[Sheng_et_al_2019]] - Social Bias Frames for NLG
- [[Dev_et_al_2021]] - What do bias measures measure?
