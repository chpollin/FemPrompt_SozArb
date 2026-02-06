---
title: "AI Gender Bias, Disparities, and Fairness: Does Training Data Matter?"
authors: ["Ehsan Latif", "Xiaoming Zhai", "Lei Liu"]
year: 2023
type: journalArticle
language: en
categories:
  - Generative_KI
  - KI_Sonstige
  - Bias_Ungleichheit
  - Gender
  - Diversitaet
  - Fairness
processed: 2026-02-05
source_file: Latif_2023_AI_Gender_Bias,_Disparities,_and_Fairness_Does.md
confidence: 89
---

# AI Gender Bias, Disparities, and Fairness: Does Training Data Matter?

## Kernbefund

Mixed-trained Modelle zeigen keinen signifikanten geschlechtsspezifischen Bias und erzeugen geringere geschlechtsspezifische Disparitäten im Vergleich zu humans, während gender-spezifisch trainierte Modelle größere MSG aufweisen und Disparitäten vergrößern können.

## Forschungsfrage

Führen geschlechtsunausgeglichene Trainingsdaten zu geschlechtsspezifischem Bias in automatisierten Bewertungssystemen, oder können ausgewogene Mixed-Gender-Trainingsdatensätze geschlechtsneutrale KI-Modelle produzieren?

## Methodik

Empirisch - Fine-Tuning von BERT und GPT-3.5 auf drei Trainingsdatensätzen (mixed-gender, male-only, female-only) mit statistischen Analysen: Paired t-tests für Accuracy-Unterschiede, Mean Score Gap (MSG) für Disparitäten, Equalized Odds (EO) für Fairness.
**Datenbasis:** Über 1000 human-graded student-written responses von männlichen und weiblichen Teilnehmern zu sechs Assessment-Items aus der Educational Testing Service.

## Hauptargumente

- Geschlechtsunausgeglichene Trainingsdaten führen nicht notwendigerweise zu Scoring-Bias, können aber geschlechtsspezifische Disparitäten vergrößern und Scoring-Fairness reduzieren – dies widerlegt die weit verbreitete Annahme, dass KI unvermeidlich geschlechtsspezifische Vorurteile verstärkt.
- Mixed-trained Modelle demonstrieren konsistent niedrigere Mean Score Gaps und Equalized Odds Werte als gender-spezifisch trainierte Modelle, was die Notwendigkeit diverser und ausgewogener Trainingsdaten für faire KI-Systeme unterstreicht.
- Das Konzept des ‚pseudo-AI Bias' zeigt, dass Bias subtil und tief verankert sein kann; durch sorgfältig gestaltete Trainingsmethoden und diverse Datendarstellung können solche Probleme adressiert werden.

## Kategorie-Evidenz

### Generative_KI

Studie nutzt fine-tuned Version von BERT und GPT-3.5 zur automatisierten Bewertung von studentischen Antworten.

### KI_Sonstige

Einsatz von Machine Learning und Natural Language Processing für automatisierte Scoring-Systeme in der Bildungsbewertung.

### Bias_Ungleichheit

The study investigates 'discrimination against women in AI' und analysiert, wie 'gender-unbalanced data' algorithmic disparities erzeugen können.

### Gender

Expliziter Fokus auf Gender Bias: 'especially gender biases, which often cause serious problems' und Analyse von männlichen vs. weiblichen Responses in KI-Bewertungssystemen.

### Diversitaet

Betonung der Rolle von Diversity in Machine Learning: 'the important role that diversity is certain to play in machine learning' und 'gender-aware artificial intelligence'.

### Fairness

Umfangreiche Fairness-Analyse mittels Equalized Odds (EO): 'An EO value less than 0.01 indicates a fair model with minimal gender bias' und Vergleiche von mixed-trained vs. gender-specific models.

## Assessment-Relevanz

**Domain Fit:** Das Paper adressiert Gender Bias und Fairness in KI-basierten Bewertungssystemen im Bildungskontext mit direkter Relevanz für ethische KI-Entwicklung. Die Schnittstelle zu Sozialer Arbeit ist indirekt durch Bildungsgerechtigkeit gegeben, aber es fehlt ein expliziter Bezug zu sozialarbeiterischer Praxis oder Zielgruppen.

**Unique Contribution:** Die Studie liefert empirische Evidenz, dass ausgewogene Mixed-Gender-Trainingsdaten zu faireren KI-Modellen führen als gender-spezifische Modelle, und widerlegt damit die weit verbreitete Annahme der Unvermeidlichkeit von Gender Bias in KI.

**Limitations:** Die Studie konzentriert sich ausschließlich auf binäre Geschlechtskategorien (male/female), berücksichtigt keine non-binären oder anderen Identitäten; zudem ist die Analyse auf automatisierte Bewertungssysteme im Bildungskontext begrenzt.

**Target Group:** KI-Entwickler und Machine Learning-Ingenieure, Bildungstechnologen und EdTech-Forscher, Policy-Maker im Bildungsbereich, Fairness- und Bias-Experten in AI-Systemen, Bildungsforschungscommunity

## Schlüsselreferenzen

- [[Bolukbasi_et_al_2016]] - Man is to computer programmer as woman is to homemaker? Debiasing word embeddings
- [[Hardt_et_al_2016]] - Equality of opportunity in supervised learning
- [[Zhai_and_Krajcik_2022]] - Pseudo AI bias
- [[Zhai_and_Nehm_2023]] - AI and formative assessment: The train has left the station
- [[Leavy_2018]] - Gender bias in artificial intelligence: The need for diversity and gender theory in machine learning
- [[Hall_and_Ellis_2023]] - A systematic review of socio-technical gender bias in AI algorithms
- [[Madaio_et_al_2022]] - Beyond 'fairness': Structural (in)justice lenses on AI for education
- [[Holmes_et_al_2021]] - Ethics of AI in education: Towards a community-wide framework
