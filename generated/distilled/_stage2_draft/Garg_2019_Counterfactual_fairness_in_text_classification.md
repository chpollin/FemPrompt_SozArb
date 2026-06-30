---
title: "Counterfactual Fairness in Text Classification through Robustness"
authors: ["Sahaj Garg", "Vincent Perot", "Nicole Limtiaco", "Ankur Taly", "Ed H. Chi", "Alex Beutel"]
year: 2019
type: conferencePaper
language: en
categories:
  - KI_Sonstige
  - Bias_Ungleichheit
  - Diversitaet
  - Fairness
processed: 2026-02-05
source_file: Garg_2019_Counterfactual_fairness_in_text_classification.md
---

# Counterfactual Fairness in Text Classification through Robustness

## Kernbefund

Counterfactual Logit Pairing (CLP) und Blindness adressieren erfolgreich kontrafaktische Fairness ohne Beeinträchtigung der Gesamtgenauigkeit, zeigen aber Tradeoffs mit gruppenbasierter Fairness. CLP generalisiert besser zu ungesehenen Identitätstokens als Blindness.

## Forschungsfrage

Wie können wir sicherstellen, dass Text-Klassifizierer fair mit sensitiven Attributen wie Identitätsmerkmalen umgehen, indem wir kontrafaktische Fairness messen und optimieren?

## Methodik

Empirisch: Machine Learning Fairness. Entwicklung einer Fairness-Metrik (Counterfactual Token Fairness) und Erprobung von drei Optimierungsansätzen (Blindness, Counterfactual Augmentation, Counterfactual Logit Pairing) auf einem Kaggle-Datensatz mit 160K Wikipedia-Kommentaren zur Toxizitätserkennung.
**Datenbasis:** 160K manuell gekennzeichnete Wikipedia-Kommentare (toxisch/nicht toxisch, Kaggle-Datensatz), 50 Identitätstokens, Split in 35 Trainings- und 12 Evaluierungs-Tokens, separate Evaluierungsdatensatz mit höherer Identitätsterm-Häufigkeit, synthetische Testdaten

## Hauptargumente

- Toxizitätsklassifizierer zeigen systematische Ungerechtigkeit bei sensitiven Identitätsbegriffen: Der Baseline-Klassifizierer klassifiziert 'Some people are gay' mit 98% als toxisch, während 'Some people are straight' nur mit 2% als toxisch klassifiziert wird, was auf problematische Trainungsdaten-Bias hindeutet.
- Kontrafaktische Fairness ist komplementär, aber unterschiedlich von Gruppen-Fairness (equality of odds): Ein Modell kann Equality-of-Odds erfüllen, aber komplett bei kontrafaktischer Fairness versagen, wenn sensitive Attribute nur in disjunkten Datenkontexten auftreten.
- Asymmetrische Kontrafaktive stellen ein fundamentales Problem dar: Manche Substitutionen sind logisch gerechtfertigt (z.B. 'gay' als Beleidigung häufiger als 'straight'), weshalb nicht alle kontrafaktischen Paare identische Vorhersagen benötigen sollten; diese Unterscheidung erfordert sorgfältige Heuristische bei Training und Evaluation.

## Kategorie-Evidenz

### KI_Sonstige

Text Classification mit Neural Networks (CNN), Natural Language Processing, Machine Learning Fairness-Techniken. 'The classifier f can be an arbitrary neural network.' Paper konzentriert sich auf algorithmische Fairness in NLP-Systemen.

### Bias_Ungleichheit

Kernthema: Algorithmischer Bias bei Identitätsbegriffen. 'a baseline toxicity model predicted that 'Some people are gay' is 98% likely to be toxic and 'Some people are straight' is only 2% likely to be toxic.' Untersucht, wie sensitives Trainingsmaterial zu systematischer Diskriminierung führt.

### Diversitaet

Adressiert Benachteiligung marginalisierter Gruppen durch KI-Systeme. 'sexual orientation, race, or religion' als sensitive Attribute; fokussiert auf vulnerable Gruppen: 'when comments attack a particularly vulnerable group' sollte differentielle Behandlung erlaubt sein.

### Fairness

Zentraler Fokus auf Fairness-Metriken und -Methoden. Entwickelt 'Counterfactual Token Fairness (CTF)' als neue Fairness-Metrik. Vergleicht mit 'equality of odds' (Hardt et al. 2016). Diskutiert Tradeoffs: 'methods do not harm classifier performance, and have varying tradeoffs with group fairness.'

## Assessment-Relevanz

**Domain Fit:** Das Paper ist relevant für KI-Systeme in hochsensiblen Anwendungsbereichen (Online-Moderation, Content-Moderation), die Auswirkungen auf marginalisierte Gruppen haben können. Für Soziale Arbeit ist der Bezug indirekt: Es adressiert algorithmische Diskriminierung bei digitalen Services, die SozialarbeiterInnen und ihre Klientel betreffen, thematisiert aber nicht explizit sozialarbeiterische Kontexte.

**Unique Contribution:** Das Paper leistet einen innovativen Beitrag durch die systematische Verbindung von Robustness-Literatur (Adversarial Training) mit Fairness und führt Counterfactual Token Fairness als praktisch anwendbare Metrik ein, die über bestehende Gruppen-Fairness-Konzepte hinausgeht.

**Limitations:** Die Metrik beschränkt sich auf Token-Substitution und erfasst nicht komplexere semantische Fairness-Probleme; die Heuristik für asymmetrische Kontrafaktive ist task-spezifisch und nicht generalisierbar; Trade-offs zwischen Counterfactual Fairness und True Positive Rate (TPR) bei toxischen Kommentaren sind erheblich.

**Target Group:** NLP-Entwickler, Machine Learning Engineers, Fairness-Forscher, Content-Moderations-Systementwickler, AI Policy-Maker, Forschende zu Algorithmic Bias und Diskriminierung

## Schlüsselreferenzen

- [[Kusner_et_al_2017]] - Counterfactual Fairness
- [[Wachter_Mittelstadt_and_Russell_2017]] - Counterfactual Explanations without opening the black box
- [[Hardt_Price_and_Srebro_2016]] - Equality of Opportunity in Supervised Learning
- [[Dixon_et_al_2018]] - Measuring and Mitigating Unintended Bias in Text Classification
- [[Dwork_et_al_2011]] - Fairness through Awareness
- [[Kannan_Kurakin_and_Goodfellow_2018]] - Adversarial Logit Pairing
- [[Zemel_et_al_2013]] - Learning Fair Representations
- [[Beutel_et_al_2017]] - Data Decisions and Theoretical Implications when Adversarially Learning Fair Representations
- [[Chiappa_and_Gillam_2018]] - Path-Specific Counterfactual Fairness
- [[KohlerHausmann_2019]] - Eddie Murphy and the Dangers of Counterfactual Causal Thinking
