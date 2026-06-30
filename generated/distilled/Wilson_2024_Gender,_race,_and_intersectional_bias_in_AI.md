---
title: "Gender, Race, and Intersectional Bias in Resume Screening via Language Model Retrieval"
authors: ["Kyra Wilson", "Aylin Caliskan"]
year: 2024
type: conferencePaper
language: en
processed: 2026-02-05
source_file: Wilson_2024_Gender,_race,_and_intersectional_bias_in_AI.md
confidence: 95
---

# Gender, Race, and Intersectional Bias in Resume Screening via Language Model Retrieval

## Kernbefund

MTE-Modelle zeigen signifikante Verzerrungen, wobei weiße Namen in 85,1% der Tests bevorzugt werden, männliche Namen in 51,9% bevorzugt werden, und Black-Männer in bis zu 100% der Fälle benachteiligt sind – das reale Diskriminierungsmuster am Arbeitsmarkt widerspiegelnd.

## Forschungsfrage

Sind Massive Text Embedding (MTE) Modelle in Resume-Screening-Szenarien hinsichtlich Race und Gender bias, einschließlich intersektionaler Kombinationen, verzerrt?

## Methodik

Empirisch - Audit Study mit über 500 öffentlich verfügbaren Resumes und 500 Job Descriptions, angewendet auf drei MTE-Modelle via Zero-Shot Document Retrieval Framework mit frequenzgesteuerten Namen für vier intersektionale Gruppen (Black/White, male/female), Chi-Square Tests für Bias-Detektion
**Datenbasis:** Über 3 Millionen Vergleiche zwischen Resumes und Job Descriptions aus 9 Berufsgruppen, 500+ Resumes, 500+ Job Descriptions, 120 frequenzgesteuerte Namen (20 pro intersektionale Gruppe)

## Hauptargumente

- LLM-basierte Resume-Screening-Systeme werden zunehmend eingesetzt (99% der Fortune-500-Unternehmen nutzen KI-Hiring-Tools), obwohl ihre Bias-Eigenschaften schlecht dokumentiert sind und sie unter Umständen gesetzlich geschützte Gruppen diskriminieren.
- Intersektionale Analysen zeigen, dass die Benachteiligung nicht gleichmäßig verteilt ist: Black-Männer sind am stärksten benachteiligt (100% in Vergleichen mit White-Männern), während die Unterschiede zwischen White-Männern und White-Frauen minimal sind (44,4% Tests mit signifikanten Unterschieden).
- Technische Dokumentfeatures wie Länge und Name-Frequenz im Corpus beeinflussen Bias-Messungen erheblich: Title-Only-Resumes zeigen 96,2% signifikante Rassenunterschiede vs. 93,7% bei vollständigen Resumes, und Frequenz-Matching-Strategien können verändern, welche Gruppe bevorzugt wird.

## Kategorie-Evidenz

### Evidenz 1

Die Studie untersucht 'Large Language Models' (LLMs), speziell 'Massive Text Embedding Models' (MTEs) basierend auf Mistral-7B für Resume-Screening-Aufgaben

### Evidenz 2

Behandelt algorithmic decision systems, document retrieval frameworks, embeddings und NLP-basierte Systeme im Kontext automatisierter Entscheidungsfindung

### Evidenz 3

Zentrale Fragestellung: 'whether they can be used in this scenario without disadvantaging groups based on their protected attributes'; Befund: 'resumes with Black male names are disadvantaged in up to 100% of cases, replicating real-world patterns of bias in employment settings'

### Evidenz 4

Analysiert explizit Gender-Bias: 'male names were also favored compared to female names in the majority of experiments' (51,9% Tests), mit besonderem Fokus auf geschlechtsspezifische Auswirkungen in verschiedenen beruflichen Kontexten

### Evidenz 5

Untersucht marginalisierte Gruppen (Black, White, male, female), analysiert Repräsentation: 'We find that MTEs are biased, significantly favoring White-associated names in 85.1% of cases and female-associated names in only 11.1% of cases' und fokussiert auf intersektionale Perspektiven

### Evidenz 6

Nutzt intersektionale Theorie (Referenzen auf Ghavami & Peplau 2013 'An intersectional analysis of gender and ethnic stereotypes: Testing three hypotheses'): 'These findings validate three hypotheses of intersectionality'; Fokus auf strukturelle Benachteiligung überintersektionaler Kategorien im Arbeitsmarkt

### Evidenz 7

Analysiert algorithmische Fairness durch Resume-Audit-Studien: 'we perform a resume audit study to determine whether a selection of Massive Text Embedding (MTE) models are biased in resume screening scenarios' mit Chi-Square Tests und Fairness-Metriken zur Messung von Selection Rate Disparities

## Assessment-Relevanz

**Domain Fit:** Hochrelevant für die Schnittstelle AI/Soziale Arbeit/Gender: Das Paper dokumentiert systematisch, wie LLM-basierte automatisierte Entscheidungssysteme (Resume-Screening) strukturelle Diskriminierung in einem kritischen Bereich (Arbeitsmarktzugang) reproduzieren – ein zentrales Anliegen Sozialer Arbeit und Genderforschung. Die intersektionale Analyse zeigt, wie Automatisierung besonders marginalisierte Gruppen (Black-Männer) trifft.

**Unique Contribution:** Erste systematische Audit-Studie von Massive Text Embedding Modellen (nicht nur generativen LLMs) für Resume-Screening mit explizitem intersektionalen Fokus, die zeigt, wie Name-Frequenz und Dokumentlänge als technische Features Bias-Messungen fundamental verändern können.

**Limitations:** Begrenzt auf zwei Rassen- und zwei Geschlechtsgruppen via Namen-Signale; keine Analyse zusätzlicher Protected Attributes (Alter, Behinderung, Sexuelle Orientierung); nur englischsprachige Resumes; DOLMA-Corpus-Frequenzen approximieren nur das proprietäre Mistral-Training-Corpus.

**Target Group:** HR-Fachleute und Recruitingverantwortliche, KI-Developer und ML-Engineers, Tech-Policy-Maker und Regulatoren, Arbeitsrecht-Spezialisten, Forschende in AI Ethics/Fairness/Gender Studies, Sozialarbeiter im Kontext von Arbeitsmarktintegration, Organisationen mit Fokus auf Diversität und Inklusion

## Schlüsselreferenzen

- [[Bertrand_Mullainathan_2004]] - Are Emily and Greg more employable than Lakisha and Jamal? A field experiment on labor market discrimination
- [[Caliskan_Ajay_Charlesworth_Wolfe_Banaji_2022]] - Gender Bias in Word Embeddings: A Comprehensive Analysis of Frequency, Syntax, and Semantics
- [[Dastin_2018]] - Amazon scraps secret AI recruiting tool that showed bias against women
- [[Ghavami_Peplau_2013]] - An intersectional analysis of gender and ethnic stereotypes: Testing three hypotheses
- [[Guo_Caliskan_2021]] - Detecting emergent intersectional biases: Contextualized word embeddings contain a distribution of human-like biases
- [[Kirk_Jun_Volpin_et_al_2021]] - Bias out-of-the-box: An empirical analysis of intersectional occupational biases in popular generative language models
- [[Raghavan_Barocas_Kleinberg_Levy_2020]] - Mitigating bias in algorithmic hiring: evaluating claims and practices
- [[Wolfe_Caliskan_2021]] - Low frequency names exhibit bias and overfitting in contextualizing language models
- [[Yin_Alba_Nicoletti_2024]] - OpenAI's GPT Is a Recruiter's Dream Tool. Tests Show There's Racial Bias
