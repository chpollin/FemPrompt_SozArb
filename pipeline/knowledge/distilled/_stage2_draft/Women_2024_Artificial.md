---
title: "Will we run out of data? Limits of LLM scaling based on human-generated data"
authors: ["Pablo Villalobos", "Anson Ho", "Jaime Sevilla", "Tamay Besiroglu", "Lennart Heim", "Marius Hobbhahn"]
year: 2024
type: workingPaper
language: en
categories:
  - Generative_KI
  - KI_Sonstige
  - Bias_Ungleichheit
  - Fairness
processed: 2026-02-05
source_file: Women_2024_Artificial.md
---

# Will we run out of data? Limits of LLM scaling based on human-generated data

## Kernbefund

Unter Annahme aktueller LLM-Entwicklungstrends werden Modelle zwischen 2026 und 2032 (oder früher bei Übertraining) auf der Größe des verfügbaren Bestands an öffentlichen Textdaten trainiert sein. Der Engpass entsteht durch eine Diskrepanz zwischen exponentieller Nachfrage nach Trainingsdaten und limitiertem Bestand.

## Forschungsfrage

Werden die verfügbaren öffentlichen menschlich erzeugten Textdaten die kontinuierliche Skalierung von Large Language Models begrenzen?

## Methodik

Theoretisch und quantitativ: Entwicklung eines mathematischen Modells zur Projektion der Nachfrage nach Trainingsdaten und des verfügbaren Bestands an öffentlichen Textdaten; Verwendung von Monte-Carlo-Simulationen zur Quantifizierung von Unsicherheiten; Datenquellen: Common Crawl, Google-Index, Internet-Statistiken.
**Datenbasis:** Sekundärdatenanalyse: Common Crawl (250+ Milliarden Webseiten), Google-Index-Schätzungen (250 Milliarden Webseiten), Internetverkehrsdaten, Metadaten zu trainierten LLMs; kein primäres Datensample, sondern aggregierte Internetstatistiken und Modellkonfigurationen.

## Hauptargumente

- Die öffentliche menschlich generierte Textdatenbasis kann die exponentiell wachsende Nachfrage nach Trainingsdaten für LLMs nicht unbegrenzt erfüllen. Das Modell projiziert einen Bestand von etwa 4e14 Tokens, der unter aktuellen Trends zwischen 2026-2032 aufgebraucht sein wird.
- Synthetische Datengenerierung, Transfer Learning aus datenreichen Domänen und Verbesserungen der Dateneffizienz könnten Strategien sein, um den Datenmangel-Engpass zu überwinden und Fortschritt in der Sprachmodellierung zu ermöglichen.
- Die Verwendung von Web-Scraping und nicht-indexierten Plattformdaten (Social Media, E-Mails, Messaging-Apps) wirft ernsthafte Bedenken bezüglich Datenschutz, Sicherheit und Gerechtigkeit auf; Entschädigung der Datenschöpfer wird als wichtige ethische Frage identifiziert.

## Kategorie-Evidenz

### Generative_KI

Der gesamte Paper fokussiert auf Large Language Models (LLMs) und deren Skalierung. Zentral sind LLMs wie GPT-4, PaLM, Llama etc.: 'Recent progress in language modeling has relied heavily on unsupervised training on vast amounts of human-generated text'

### KI_Sonstige

Das Paper behandelt neuronale Skalierungsgesetze, Trainingsdynamiken und technische Aspekte des Machine Learning jenseits generativer KI: 'large language models (LLMs) are typically trained according to neural scaling laws'

### Bias_Ungleichheit

Im Impact Statement werden Fairness und Gerechtigkeitsthemen adressiert, insbesondere bezüglich Datenschöpfern und Marginalisierung: 'there are strong arguments in favor of compensating the creators of the data used to train these systems'

### Fairness

Das Paper behandelt explizit Fragen von fairer Datennutzung, Datenschöpfer-Entschädigung und ethischen Implikationen von Daten-Scraping: 'The practice of scraping data from the web and using it for large-scale training of AI systems raises important issues regarding fairness and justice' und Diskussionen zu Privacy und Security bei Nutzung von Plattformdaten.

## Assessment-Relevanz

**Domain Fit:** Das Paper hat keine direkte Relevanz für Soziale Arbeit oder Gender Studies. Es adressiert ein technisches Problem der KI-Entwicklung (Datenverfügbarkeit für LLM-Skalierung). Indirekt ist es relevant für KI-Governance und die ethische Gestaltung von KI-Systemen, insbesondere bezüglich Datenschutz, Gerechtigkeit und Entschädigung von Datenschöpfern.

**Unique Contribution:** Das Paper leitet erstmalig ein umfassendes quantitatives Modell her, das die Diskrepanz zwischen verfügbarem Datenbestand und wachsender Nachfrage nach Trainingsdaten für LLMs projiziert und konkrete Zeitrahmen (2026-2032) für das Auftreten eines Datenengpasses angibt.

**Limitations:** Das Paper ignoriert KI-generierte Daten in der Hauptanalyse; die Schätzungen der Internetgröße sind mit hoher Unsicherheit behaftet (95% CI für 'whole web': 1900T-5200T); der Beitrag synthetischer Daten und Transfer Learning wird nur spekulativ behandelt; die Analyse berücksichtigt nicht den Einfluss von Datenschutzgesetzen (GDPR, CCPA) auf verfügbare Datenquellen.

**Target Group:** KI-Entwickler, KI-Forscher, Investoren im AI-Sektor, Policymaker im AI-Governance-Bereich, technische Führungskräfte in großen AI-Laboren (OpenAI, Anthropic, Meta), Fachleute für algorithmische Fairness und Datenschutz. Nicht primär für Sozialarbeiter oder Gender-Studies-Fachleute relevant.

## Schlüsselreferenzen

- [[Kaplan_et_al_2020]] - Scaling laws for neural language models
- [[Hoffmann_et_al_2022]] - Training compute-optimal large language models
- [[Muennighoff_et_al_2023]] - Techniques to mitigate data scarcity for training LLMs
- [[Penedo_et_al_2023]] - RefinedWeb dataset
- [[van_den_Bosch_et_al_2016]] - Estimating the size of Google's index
- [[Xue_et_al_2023]] - Multi-epoch training as solution for data scarcity
- [[Nostalgebraist_2022]] - High-quality training data as bottleneck
- [[Besiroglu_et_al_2024]] - Chinchilla scaling: A replication attempt
- [[Gao_et_al_2021]] - The Pile: An 800GB dataset of diverse text
