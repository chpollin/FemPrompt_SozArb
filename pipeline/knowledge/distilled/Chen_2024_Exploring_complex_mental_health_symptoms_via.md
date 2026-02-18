---
title: "Exploring Complex Mental Health Symptoms via Classifying Social Media Data with Explainable LLMs"
authors: ["Kexin Chen", "Noelle Lim", "Claire Lee", "Michael Guerzhoy"]
year: 2024
type: conferencePaper
language: en
processed: 2026-02-05
source_file: Chen_2024_Exploring_complex_mental_health_symptoms_via.md
confidence: 88
---

# Exploring Complex Mental Health Symptoms via Classifying Social Media Data with Explainable LLMs

## Kernbefund

Das Paper demonstriert eine Pipeline zur Extraktion von Erkenntnissen aus Social-Media-Texten durch explainbare KI. Erste Ergebnisse zeigen, dass Lyme-Disease-Posts mit Mold-Erwähnungen signifikant häufiger mental-health-bezogen sind als in Referenzdatensätzen (44% vs. 19,7%), was auf eine bisher unterexplorierten Drei-Wege-Interaktion hindeutet.

## Forschungsfrage

Wie können wir komplexe psychische Erkrankungen durch Klassifizierung von Social-Media-Daten mit erklärbaren LLMs verstehen und neue Erkenntnisse über Symptome und Krankheitsnosologie gewinnen?

## Methodik

Empirisch / Mixed Methods: RoBERTa-basierte Textklassifikation von Reddit-Posts mit Erklärungsgenerierung durch Phrase-Masking und qualitativ-quantitative Analyse der Erklärungen durch Embedding-Ähnlichkeit und manuelle Kategorisierung.
**Datenbasis:** 47.482 Posts aus r/Anxiety und r/ADHD Subreddits; 58.398 Lyme-Posts (343 manuell annotiert); 5.000 Referenz-Posts aus r/AskDocs

## Hauptargumente

- Viele Menschen mit psychischen Erkrankungen konsultieren keine Spezialisten und wenden sich stattdessen an Online-Communities. Social Media bietet klinisch unzugängliche Daten über Symptome und Symptomüberschneidungen, die neue Erkenntnisse über komplexe Krankheiten ermöglichen können.
- Die Comorbidität von Angststörungen und ADHD (53% Überlappung bei erwachsenen ADHD-Patienten) wird oft übersehen oder falsch diagnostiziert, da Angstsymptome behandelt werden ohne ADHD zu erkennen. Soziale Medien können als Proxy-Datenquelle für diese klinisch relevante Comorbidität dienen.
- Explainability ist entscheidend: Durch Masking-basierte Erklärungen können einzelne Textpassagen identifiziert werden, die Klassifikationsentscheidungen treiben. Dies ermöglicht qualitative Analyse und Musteridentifikation, die über automatische Klassifikation hinausgehen und zu neuen klinischen Hypothesen führen (z.B. Mold-Lyme-Mental-Health-Nexus).

## Kategorie-Evidenz

### Evidenz 1

Das Paper adressiert 'Explainable AI' und technisches Verständnis für LLM-basierte Systeme. Die Pipeline erfordert Verständnis von RoBERTa-Klassifikatoren, Phrase-Masking-Erklärungsmethoden und Embedding-Techniken zur Interpretation von KI-Ausgaben.

### Evidenz 2

Verwendung von RoBERTa für Textklassifikation, NLP-Techniken (Phrase-Masking), OpenAI Text-Embedding-3-Large für Ähnlichkeitsanalyse, sowie Evaluierung mit traditionellen Baselines (Logistic Regression, Naive Bayes).

### Evidenz 3

Direkte Anwendung auf mentale Gesundheitszustände (Angststörung, ADHD, Lyme-Krankheit mit psychischen Folgen), Verwendung von Reddit als Datenquelle für nicht-professionelle Hilfesuche, Fokus auf Erkrankungen mit komplexen Symptomen die Sozialarbeiter betreffen, insbesondere Comorbidität und Früherkennung.

### Evidenz 4

Das Paper thematisiert implizit strukturelle Ungleichheiten: 53% der Erwachsenen mit ADHD haben Angststörungen, aber diese werden oft nicht erkannt - dies ist ein diagnostischer Bias. Menschen mit komplexen Erkrankungen ohne Zugang zu Spezialisten sind überrepräsentiert online.

### Evidenz 5

Fokus auf marginalisierte Gruppen: Menschen mit psychischen Erkrankungen, die keinen klinischen Zugang haben; Lyme-Disease-Patienten mit unterdiagnosed mental health aspects; Berücksichtigung verschiedener Online-Communities (r/Anxiety, r/ADHD, r/AskDocs) mit unterschiedlichen Patientendemographien.

### Evidenz 6

Die explainability-Methode zielt auf transparente und faire Klassifikation ab. Das Paper evaluiert Fairness durch F1-Score und Accuracy auf potenziell class-imbalanced Datensätzen. Die Verwendung von Baseline-Modellen ermöglicht Fairness-Vergleiche zwischen Algorithmen.

## Assessment-Relevanz

**Domain Fit:** Hohes Potenzial für Soziale Arbeit und KI: Das Paper verbindet explainbare KI mit mentalen Gesundheitserkrankungen und nutzt Social-Media-Daten von unterversorgten Populationen. Es demonstriert, wie algorithmische Systeme Kliniker bei der Identifikation übersehener Komorbiditäten unterstützen können und bietet Werkzeuge für evidenzbasierte Praxis.

**Unique Contribution:** Die systematische Kombination von LLM-basierter Klassifikation mit qualitativer Erklärungsanalyse (Phrase-Masking + Embedding-Clustering) zur Hypothesengenerierung über komplexe Krankheitszusammenhänge ist neuartig und methodologisch innovativ für mental health informatics.

**Limitations:** Kleine manuell annotierte Referenzdatensätze (n=343 für Lyme); anonym umformulierte Beispiele erschweren Reproduzierbarkeit; begrenzte statistische Validierung (einfaches Randomisierungsmodell statt formaler Signifikanztests); initiale/preliminary Ergebnisse für Lyme-Mold-Nexus nicht clinically validiert.

**Target Group:** Klinische Informatiker, Sozialarbeiter mit Mental-Health-Fokus, Mentale-Gesundheits-Forscher, KI/NLP-Entwickler in Healthcare, Digital Health Policy-Maker, Patienten-Advocacy-Organisationen für komplexe Erkrankungen (insbesondere ADHD, Angststörungen, Lyme-Krankheit)

## Schlüsselreferenzen

- [[Lee_Claire_S_Lim_Noelle_Guerzhoy_Michael_2024]] - Detecting a proxy for potential comorbid ADHD in people reporting anxiety symptoms from social media data
- [[Fallon_Brian_A_Nields_Jennifer_1994]] - Lyme disease: A neuropsychiatric illness
- [[Fallon_Brian_A_Madsen_Trine_Erlangsen_Annette_Benros_Michael_E_2021]] - Lyme borreliosis and associations with mental disorders and suicidal behavior: A nationwide danish cohort study
- [[Quinn_Patricia_O_Madhoo_Manisha_2014]] - A review of attention-deficit/hyperactivity disorder in women and girls
- [[Katzman_Martin_A_Bilkey_Terrence_E_Chokka_Pratap_Klassen_Laureen_L_2017]] - Adult ADHD and comorbid disorders: Clinical implications of a dimensional approach
- [[Low_Daniel_M_Rumker_Laurie_Talkar_Tanya_Torous_John_Cecchi_Guillermo_Ghosh_Soumya_S_2020]] - Natural language processing reveals vulnerable mental health support groups and heightened health anxiety on reddit during COVID-19
- [[Malviya_Keshu_Roy_Bholanath_Saritha_SK_2021]] - A transformers approach to detect depression in social media
- [[Giles_David_C_Newbold_Julie_2011]] - Self- and other-diagnosis in user-led mental health online communities
- [[Zachar_Peter_Kendler_Kenneth_S_2017]] - The philosophy of nosology
