---
title: "Biases in Large Language Models: Origins, Inventory, and Discussion"
authors: ["Roberto Navigli", "Simone Conia", "Björn Ross"]
year: 2023
type: journalArticle
language: en
categories:
  - AI_Literacies
  - Generative_KI
  - KI_Sonstige
  - Bias_Ungleichheit
  - Gender
  - Diversitaet
  - Fairness
processed: 2026-02-05
source_file: Navigli_2023_Biases_in_large_language_models_Origins,.md
confidence: 75
---

# Biases in Large Language Models: Origins, Inventory, and Discussion

## Kernbefund

Die meisten Verzerrungen in Sprachmodellen entstehen durch Data Selection Bias bei der Wahl der Trainingstexte; das Paper inventarisiert elf Typen sozialer Bias (Gender, Alter, sexuelle Orientierung, Ethnizität, Religion, Kultur, Nationalität, Behinderung, Sprache und intersektionale Bias) und argumentiert für präventive Ansätze bei der Datenkurierung statt nachträglicher Debiasingmaßnahmen.

## Forschungsfrage

Wie entstehen Verzerrungen in großen Sprachmodellen, welche Arten von sozialen Bias treten auf, und wie können sie gemessen und reduziert werden?

## Methodik

Theoretisch/Review: Systematische Analyse von Data Selection Bias und sozialen Bias-Typen in LLMs mit empirischen Beispielen und Literaturüberblick.
**Datenbasis:** nicht empirisch empirisch: Sekundäranalyse bestehender Studien, Analyse von Wikipedia-Domain-Verteilungen mit BabelNet, generative Beispiele aus LLM-Ausgaben

## Hauptargumente

- Data Selection Bias ist die Wurzel sozialer Verzerrungen in LLMs: Die Auswahl von Trainingstexten (z.B. Wikipedia-Überrepräsentation von Sport, Musik, Politik) prägt die Modelle systematisch und kann kaum mehr durch nachträgliche Debiasing-Maßnahmen korrigiert werden.
- Soziale Bias manifestieren sich intersektional und mehrschichtig: Ein Sprachmodell kann keine isolierten Bias gegen schwarze Menschen oder Frauen zeigen, aber stark gegen schwarze Frauen verzerrt sein, weshalb mehrdimensionale Analyse kritisch ist.
- Technische Lösungen allein sind unzureichend; interdisziplinäre Ansätze unter Einbeziehung von Psychologie, Soziologie, Linguistik und Commonsense-Wissen sind notwendig, um Bias zu verstehen und zu adressieren.

## Kategorie-Evidenz

### AI_Literacies

Das Paper diskutiert notwendiges Wissen zur Funktionsweise von LLMs und deren Risiken: 'we need to keep in mind that, in the words of Baeza-Yates, "the output quality of any algorithm is a function of the quality of the data that it uses"' – dies adressiert kritisches Verständnis.

### Generative_KI

Fokus auf 'large-scale pretrained language models, such as BERT, GPT, T5, and BART, which are now pervasive in every high-performance system for Machine [Learning]' und deren Bias.

### KI_Sonstige

NLP und algorithmische Systeme werden behandelt; Beispiel COMPAS-Recidivism-Vorhersage zeigt klassische ML-Bias: 'black defendants were often predicted to be at a higher risk of recidivism than they actually were'.

### Bias_Ungleichheit

Zentrale These: 'most types of bias originate in corpora and, consequently, language models learn and amplify such biases' und Diskussion struktureller Benachteiligungen ('harm, especially to minorities and marginalized groups').

### Gender

Expliziter Gender-Bias-Fokus: 'gender, sexual and racial biases' und Beispiel 'some sports have historically been male-dominated, meaning that the majority of their popular players have also been male' prägt Wikipedia und damit LLMs.

### Diversitaet

Extensive Behandlung von Minderheiten und marginalisierten Gruppen: 'bias against non-binary genders', 'religion bias', ethnische Bias, intersektionale Perspektiven ('a person's social identity can combine to create discrimination'), Sprachen-Diversität.

### Fairness

Mehrfache Diskussion von Fairness-Metriken: 'three generalized fairness metrics: pairwise comparison, background comparison, and multi-group comparison metrics' und Anforderung von Transparenz ('transparent about the levels of bias of production systems').

## Assessment-Relevanz

**Domain Fit:** Hohes Relevanzpotenzial für KI in der Sozialen Arbeit: Das Paper identifiziert konkrete Verzerrungen (Gender, Ethnizität, Behinderung, Nationalität), die in Entscheidungssystemen der Sozialen Arbeit (Fallzuordnung, Risikoeinschätzung) direkt zu Diskriminierung führen können. Es fehlt aber der direkter Bezug zu sozialarbeiterischer Praxis.

**Unique Contribution:** Das Paper leistet die erste umfassende, strukturierte Inventarisierung von elf Bias-Typen in LLMs mit Fokus auf Data Selection Bias als Root Cause und argumentiert programmatisch für Bias-Vermeidung durch Datenkurierung statt nachträglichem Debiasing.

**Limitations:** Keine empirischen Tests oder Messungen präsentiert; keine Analyse von Interventionsmaßnahmen oder deren Effektivität; begrenzte Behandlung von nicht-englischsprachigen Modellen trotz Erwähnung multilingualer Bias; fehlender direkter Anwendungsbezug auf konkrete Sektoren wie Soziale Arbeit.

**Target Group:** KI-Entwickler und Datenkuratore, NLP-Forscher, Fairness-Spezialisten, Policy-Maker, Tech-Ethiker; sekundär relevant für Sozialarbeiter in Positionen mit KI-Governance; begrenzt für praktizierende Sozialarbeiter ohne Technikhintergrund

## Schlüsselreferenzen

- [[Bolukbasi_et_al_2016]] - Man is to Computer Programmer as Woman is to Homemaker: Debiasing Word Embeddings
- [[Buolamwini_Buolamwini_2018]] - Gender Shades: Intersectional Accuracy Disparities in Commercial Gender Classification
- [[BaezaYates_2016]] - Data and algorithmic bias in the web
- [[Nangia_et_al_2020]] - CrowS-Pairs: A Challenge Dataset for Measuring Social Biases in Masked Language Models
- [[Nadeem_et_al_2021]] - StereoSet: Measuring Stereotypical Bias in Pretrained Language Models
- [[Abid_et_al_2021]] - Persistent anti-Muslim bias in large language models
- [[Obermeyer_et_al_2019]] - Dissecting racial bias in an algorithm used to manage the health of populations
- [[Bender_et_al_2021]] - On the dangers of stochastic parrots: Can language models be too big?
- [[Angwin_et_al_2016]] - Machine Bias (COMPAS case study)
