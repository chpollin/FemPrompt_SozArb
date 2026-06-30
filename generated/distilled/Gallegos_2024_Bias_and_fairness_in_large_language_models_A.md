---
title: "Bias and Fairness in Large Language Models: A Survey"
authors: ["Isabel O. Gallegos", "Ryan A. Rossi", "Joe Barrow", "Md Mehrab Tanjim", "Sungchul Kim", "Franck Dernoncourt", "Tong Yu", "Ruiyi Zhang", "Nesreen K. Ahmed"]
year: 2024
type: journalArticle
language: en
processed: 2026-02-05
source_file: Gallegos_2024_Bias_and_fairness_in_large_language_models_A.md
confidence: 75
---

# Bias and Fairness in Large Language Models: A Survey

## Kernbefund

Der Survey konsolidiert und vereinheitlicht fragmentiertes Wissen über Bias-Evaluation und Mitigation in LLMs durch drei intuitive Taxonomien, die Evaluierungsmetriken (nach Operationalisierungsebenen: Embeddings, Wahrscheinlichkeiten, generierter Text), Evaluierungsdatensätze und Mitigationstechniken (nach Interventionsstadium: Pre-, In-, Intra-, Post-Processing) strukturieren.

## Forschungsfrage

Wie können Bias und Fairness in großen Sprachmodellen systematisch evaluiert und gemindert werden?

## Methodik

Theoretisch/Review - umfassende Literaturübersicht mit Formalisierung von Konzepten, Entwicklung von drei taxonomischen Klassifikationssystemen für Metriken, Datensätze und Mitigationstechniken.
**Datenbasis:** Nicht empirisch - systematische Literaturanalyse und konzeptionelle Konsolidierung bestehender Forschung

## Hauptargumente

- LLMs erben und verstärken gesellschaftliche Stereotypen, Missrepräsentationen und ausgrenzende Sprache aus ihren Trainingsdaten, was besonders marginalisierte Gemeinschaften schadet und Systeme struktureller Ungerechtigkeit verfestigt.
- Eine präzise Konzeptualisierung und Formalisierung von 'sozialen Bias' und 'Fairness' ist notwendig, um unterschiedliche Schadensformen zu disambiguieren und operationalisierbare Fairness-Kriterien für verschiedene NLP-Anwendungen zu entwickeln.
- Bestehende Mitigationsansätze (Pre-, In-, Intra-, Post-Processing) haben je spezifische Limitationen: Data-Augmentation-Techniken basieren auf problematischen Proxy-Variablen und binären Gruppierungen, Prompt-Modifikationen zeigen begrenzte Effektivität, und Embedding-basierte Ansätze beziehen sich schwach auf downstream-Bias - daher werden integrative und kontextgerechte Ansätze benötigt.

## Kategorie-Evidenz

### Evidenz 1

Der Survey zielt darauf ab, 'Forscher und Praktiker zu befähigen, die Ausbreitung von Bias in LLMs besser zu verstehen und zu verhindern' und bietet umfassende konzeptionelle Rahmen und Taxonomien zum Verständnis von Bias in sprachlichen KI-Systemen.

### Evidenz 2

Fokus auf 'große Sprachmodelle (LLMs)' mit autoregressive, autoencoding und encoder-decoder Architekturen (GPT, BERT, T5) und deren Fähigkeiten zur Textgenerierung und Few-Shot Learning.

### Evidenz 3

Section 5.1.4 behandelt 'Instruction Tuning' mit 'Modified Prompting Language' und 'Control Tokens' als Bias-Mitigationstechniken durch Modifikation von Eingabeprompts.

### Evidenz 4

Umfangreiche Abdeckung von NLP-Techniken, Embedding-Methoden, Attention-Mechanismen, Loss-Funktionen und neuronalen Architektur-Modifikationen.

### Evidenz 5

Explizit: 'LLMs erben Stereotypen, Missrepräsentationen, verächtliche und ausgrenzende Sprache...die überproportional bereits gefährdete und marginalisierte Gemeinschaften betreffen' und 'die automatisierte Reproduktion von Ungerechtigkeit kann Systeme der Ungleichheit verfestigen'.

### Evidenz 6

Umfangreiche Behandlung von Geschlechterbias mit mehreren zitierten Arbeiten zu Geschlechterstereotypen in LLMs, Coreference Resolution und Pronomen-Bias (z.B. Webster et al., Sheng et al.).

### Evidenz 7

Thematisiert 'marginalisierte Gemeinschaften', unterrepräsentierte Sprachvarietäten, verschiedene soziale Gruppen (Race, Religion, Sexualität) und fordert 'intersektionale Perspektiven' auf Bias.

### Evidenz 8

Zentral für den Survey: Formalisierung von Fairness-Desiderata für LLMs, umfangreiche Taxonomie von Fairness-Metriken (Embedding-, Wahrscheinlichkeits- und Text-basiert), Behandlung von Fairness-Notionen aus ML adaptiert für NLP.

## Assessment-Relevanz

**Domain Fit:** Das Paper ist hochgradig relevant für die Schnittstelle KI und Soziale Arbeit, da es systematisch dokumentiert, wie automatisierte Systeme marginalisierte Gemeinschaften schädigen können, und praktizierten umfassende Frameworks zur Fairness bietet. Die Fokussierung auf gesellschaftliche Machtverhältnisse und strukturelle Ungerechtigkeit verbindet sich direkt mit sozialarbeiterischer Verantwortung für vulnerable Gruppen.

**Unique Contribution:** Der einzigartige Beitrag liegt in der umfassenden Formalisierung und Vereinheitlichung fragmentierter Literatur durch drei ineinander greifende Taxonomien, die Forschende und Praktiker befähigen, Bias-Evaluierungs- und Mitigationsansätze systematisch zu vergleichen und kontextgerecht auszuwählen.

**Limitations:** Das Paper konzentriert sich primär auf Englisch und beschränkt sich auf geschlossene formale Metriken, Datensätze und Techniken; es behandelt nicht umfassend kulturelle und kontextuelle Relativität von Fairness, die Machtverhältnisse in der KI-Entwicklung selbst, oder langfristige soziale Auswirkungen im Feld.

**Target Group:** KI-Entwickler und NLP-Praktiker, Fairness-Forschende, Algorithmic Auditors, Policy-Maker im Bereich Algorithmen-Governance, Sozialarbeiter und Organisationen, die KI-Systeme einsetzen oder regulieren, sowie Forschende in Gender Studies und Critical Data Studies, die KI-Systeme kritisch analysieren.

## Schlüsselreferenzen

- [[Bender_et_al_2021]] - On the Dangers of Stochastic Parrots
- [[Benjamin_2020]] - Race After Technology
- [[Sheng_et_al_2019]] - The Woman Worked as a Babysitter: On Biases in Language Generation
- [[Bolukbasi_et_al_2016]] - Man is to Computer Programmer as Woman is to Homemaker
- [[Buolamwini_Buolamwini_2018]] - Gender Shades
- [[Suresh_Guttag_2021]] - A Framework for Understanding Sources of Harm Throughout the Machine Learning Life Cycle
- [[Mehrabi_et_al_2021]] - A Survey on Bias and Fairness in Machine Learning
- [[Bommasani_et_al_2021]] - On the Opportunities and Risks of Foundation Models
- [[Webster_et_al_2020]] - Measuring and Reducing Gendered Correlations in Pre-trained Models
- [[Ravfogel_et_al_2020]] - Null It Out: Guarding Protected Attributes by Iterative Nullspace Projection
