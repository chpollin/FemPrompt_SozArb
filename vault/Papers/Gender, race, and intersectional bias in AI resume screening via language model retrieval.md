---
title: Gender, race, and intersectional bias in AI resume screening via language model retrieval
authors:
  - K. Wilson
  - A. Caliskan
year: 2024
type: conferencePaper
doi: 10.1609/aies.v7i1.31748
url: "https://doi.org/10.1609/aies.v7i1.31748"
tags:
  - paper
llm_decision: Include
llm_confidence: 0.95
llm_categories:
  - Generative_KI
  - KI_Sonstige
  - Bias_Ungleichheit
  - Gender
  - Diversitaet
  - Feministisch
  - Fairness
human_decision: Include
human_categories:
  - Generative_KI
  - Bias_Ungleichheit
  - Gender
  - Diversitaet
agreement: agree
---

# Gender, race, and intersectional bias in AI resume screening via language model retrieval

## Transformation Trail

### Stufe 1: Extraktion & Klassifikation (LLM)

**Extrahierte Kategorien:** KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit, Gender, Diversitaet, Fairness
**Argumente:** 3 extrahiert

### Stufe 3: Verifikation (LLM)

| Metrik | Score |
|--------|-------|
| Completeness | 92 |
| Correctness | 96 |
| Category Validation | 94 |
| **Overall Confidence** | **94** |

### Stufe 4: Assessment

**LLM:** Include (Confidence: 0.95)
**Human:** Include

## Key Concepts

- [[Algorithmic Fairness Evaluation]]
- [[Intersectional Bias Analysis]]

## Wissensdokument

# Gender, Race, and Intersectional Bias in Resume Screening via Language Model Retrieval

## Kernbefund

Massive Text Embedding Models zeigen signifikante Bias: Weiße Namen werden in 85,1% der Fälle bevorzugt, während schwarze männliche Namen in bis zu 100% der Fälle benachteiligt werden. Dokument-Länge und Namenhäufigkeit beeinflussen die Bias-Messung erheblich.

## Forschungsfrage

Zeigen Massive Text Embedding Models Bias bei der automatisierten Lebenslauf-Screening basierend auf geschlechtlichen und rassischen Signalen in Namen, und wie beeinflussen Dokumentlänge und Namenhäufigkeit diese Bias-Messungen?

## Methodik

Empirisch: Audit-Studie mit über 500 öffentlich verfügbaren Lebensläufen und 500 Stellenbeschreibungen über neun Berufe hinweg. Verwendung von 120 frequenzgesteuerten Namen für vier intersektionale Gruppen (Schwarze Männer, Schwarze Frauen, Weiße Männer, Weiße Frauen). Document-Retrieval-Framework mit Cosine-Similarity und Chi-Quadrat-Tests zur Bias-Detektion.
**Datenbasis:** Über 500 Lebensläufe, über 500 Stellenbeschreibungen, 120 Frequenz-kontrollierte Namen, über 3 Millionen Vergleiche zwischen Lebensläufen und Stellenbeschreibungen, neun Berufsgruppen

## Hauptargumente

- Algorithmische Hiring-Tools, insbesondere LLMs und Massive Text Embedding Models, zeigen systematische Diskriminierungsmuster gegen Kandidaten mit schwarzen und weiblichen Namen, die reale Beschäftigungsdiskriminierung replizieren und verstärken.
- Intersektionale Analysen offenbaren, dass schwarze Männer die größte Benachteiligung erleben, während die Geschlechtsunterschiede hauptsächlich zwischen schwarzen Frauen und schwarzen Männern bestehen, nicht zwischen weißen Männern und Frauen.
- Textuelle Features wie Dokumentlänge und Namenhäufigkeit im Trainings-Corpus beeinflussen Bias-Messungen messbar: Kürzere Lebensläufe führen zu 22,2% mehr Bias-Fällen, und Frequenz-Matching-Strategien können bestimmen, ob schwarze oder weiße Namen bevorzugt werden.

## Kategorie-Evidenz

### Evidenz 1

Fokus auf Massive Text Embedding Models als spezialisierte LLMs für Retrieval-Aufgaben: 'While many studies have characterized the biases of foundation or instruction-tuned LLMs, very few have investigated the biases of MTEs'

### Evidenz 2

Direkter Bezug zu Einstellungsprozessen und deren Auswirkungen auf Chancengleichheit und gesellschaftliche Ungleichheit: 'AI hiring tools have revolutionized resume screening... it is estimated that 99% of Fortune 500 companies are already using some sort of AI assistance'

### Evidenz 3

Zentrale Fokussierung auf algorithmischen Bias und Diskriminierung: 'We find that the MTEs are biased, significantly favoring White-associated names in 85.1% of cases and female-associated names in only 11.1% of cases'

### Evidenz 4

Explizite Gender-Analyse und Geschlechts-Bias: 'While male names were also favored compared to female names in the majority of experiments, the disparities were less than those demonstrated using Black versus White names'

### Evidenz 5

Intersektionale Analyse mehrerer marginalisierter Gruppen und deren Repräsentation: 'Intersectional comparisons reveal resumes that contain Black male names are highly unfavored in resume screening'

### Evidenz 6

Fokus auf Fairness in algorithmischen Systemen und Fairness-Metriken: 'We use a chi-square test to determine whether the selected resumes are distributed uniformly amongst relevant groups'

## Assessment-Relevanz

**Domain Fit:** Das Paper ist hochrelevant für die Schnittstelle KI und Soziale Arbeit, da es zeigt, wie algorithmische Systeme zur Stellenbesetzung marginalisierte Gruppen systematisch benachteiligen und damit zentrale Fragen von Gerechtigkeit und Chancengleichheit aufwirft, die direkt mit sozialer Gerechtigkeit und Empowerment in der Sozialen Arbeit verbunden sind.

**Unique Contribution:** Erste umfassende Audit-Studie von Massive Text Embedding Models im Resume-Screening-Kontext mit fokussierter intersektionaler Analyse und Untersuchung von textualem Feature-Impact (Dokumentlänge, Namenhäufigkeit) auf Bias-Messungen.

**Limitations:** Die Studie ist auf Englisch-Sprache, zwei Rassen- und zwei Geschlechtsidentitäten beschränkt und repräsentiert Rasse und Geschlecht nur durch Namen, was eine 'reductive and incomplete way of representing these facets of identity' ist.

**Target Group:** KI-Entwickler, HR-Praktiker, Policy-Maker im Bereich Arbeitsmarktregulation, Forscher in AI Ethics und Fairness, Sozialarbeiter und Organisationen, die sich mit Chancengleichheit und Diskriminierungsschutz beschäftigen, sowie Arbeitnehmerschutzorganisationen

## Schlüsselreferenzen

- [[Bertrand_and_Mullainathan_2004]] - Are Emily and Greg more employable than Lakisha and Jamal? A field experiment on labor market discrimination
- [[Dastin_2018]] - Amazon scraps secret AI recruiting tool that showed bias against women
- [[Baert_2018]] - Hiring discrimination: An overview of (almost) all correspondence experiments since 2005
- [[Pager_2003]] - The mark of a criminal record
- [[Ghavami_and_Peplau_2013]] - An intersectional analysis of gender and ethnic stereotypes: Testing three hypotheses
- [[Caliskan_et_al_2022]] - Gender Bias in Word Embeddings: A Comprehensive Analysis of Frequency, Syntax, and Semantics
- [[Raghavan_et_al_2020]] - Mitigating bias in algorithmic hiring: evaluating claims and practices
- [[Elder_and_Hayes_2023]] - Signaling race, ethnicity, and gender with names: Challenges and recommendations
