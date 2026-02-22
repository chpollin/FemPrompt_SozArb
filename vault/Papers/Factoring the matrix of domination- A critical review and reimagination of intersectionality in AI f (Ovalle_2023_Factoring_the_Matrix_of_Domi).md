---
title: "Factoring the matrix of domination: A critical review and reimagination of intersectionality in AI fairness"
authors:
  - A. Ovalle
  - A. Subramonian
  - V. Gautam
  - G. Gee
  - K. W. Chang
year: 2023
type: conferencePaper
doi: 10.1145/3600211.3604705
url: "https://dl.acm.org/doi/abs/10.1145/3600211.3604705"
tags:
  - paper
llm_decision: Include
llm_confidence: 0.95
llm_categories:
  - KI_Sonstige
  - Bias_Ungleichheit
  - Gender
  - Diversitaet
  - Feministisch
  - Fairness
human_decision: Exclude
human_categories:
  - KI_Sonstige
  - Bias_Ungleichheit
  - Gender
  - Diversitaet
  - Fairness
agreement: disagree
---

# Factoring the matrix of domination: A critical review and reimagination of intersectionality in AI fairness

## Transformation Trail

### Stufe 1: Extraktion & Klassifikation (LLM)

**Extrahierte Kategorien:** AI_Literacies, KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit, Gender, Diversitaet, Feministisch, Fairness
**Argumente:** 3 extrahiert

### Stufe 4: Assessment

**LLM:** Include (Confidence: 0.95)
**Human:** Exclude

**Kategorie-Vergleich (bei Divergenz):**

| Kategorie | Human | LLM | Divergent |
|-----------|-------|-----|----------|
| AI_Literacies | Nein | Nein |  |
| Generative_KI | Nein | Nein |  |
| Prompting | Nein | Nein |  |
| KI_Sonstige | Ja | Ja |  |
| Soziale_Arbeit | Nein | Nein |  |
| Bias_Ungleichheit | Ja | Ja |  |
| Gender | Ja | Ja |  |
| Diversitaet | Ja | Ja |  |
| Feministisch | Nein | Ja | X |
| Fairness | Ja | Ja |  |

> Siehe [[Divergenz Ovalle_2023_Factoring_the_Matrix_of_Domination_A_Critical]] fuer detaillierte Analyse


## Key Concepts

- [[Algorithmic Bias]]
- [[Design Justice]]
- [[Subgroup Fairness Metrics]]

## Wissensdokument

# Factoring the Matrix of Domination: A Critical Review and Reimagination of Intersectionality in AI Fairness

## Kernbefund

AI-Fairness-Forscher reduzieren Intersektionalität primär auf Fairness-Metriken für demographische Subgruppen und ignorieren dabei zentrale intersektionale Prinzipien wie Machtrelationen, soziale Kontexte und kritisches Handeln für Gerechtigkeit.

## Forschungsfrage

Wie wird Intersektionalität in der AI-Fairness-Literatur diskutiert und welche Lücken entstehen zwischen der Konzeptualisierung und Operationalisierung intersektionaler Frameworks?

## Methodik

Kritische Literaturanalyse; deduktive und induktive Codierung von 30 AI-Fairness-Papers gegen Collins und Bilges Intersektionalitäts-Tenets; Mixed-Methods mit Interannotator-Agreement-Messungen (Randolph's κ)
**Datenbasis:** n=30 peer-reviewed AI-Fairness-Papers; 11 Papiere wurden von 3 Annotatoren kodiert, 19 weitere von mindestens 1 Annotator

## Hauptargumente

- Intersektionalität ist ein kritisches Praxis-Framework zur Analyse von Machtstrukturen und struktureller Unterdrückung, nicht bloß ein statistisches Problem der Fairness-Optimierung über Subgruppen.
- Die epistemologischen Fundamente der KI-Forschung sind in kolonialer Wissenschaft verwurzelt; Intersektionalität kann helfen, diese zu hinterfragen und marginalisierte Wissensproduktion zu zentralisieren.
- Vier Hauptlücken wurden identifiziert: (1) fehlende Auseinandersetzung mit Machtrelationen über das KI-System hinaus, (2) schwache Zitierpraxen intersektionaler Literatur, (3) Verlust von Relationalität zwischen Strukturen durch statistische Operationalisierung, (4) mangelnde soziale Gerechtigkeit als explizites Praxisziel.

## Kategorie-Evidenz

### Evidenz 1

Kritische Analyse von Wissensproduktion und epistemologischen Grundlagen in der KI-Forschung: 'The epistemologies of AI research are not divorced from scientific colonialism's legacy.'

### Evidenz 2

Breite Kritik auf algorithmische Fairness, ML-Systeme, predictive systems und deren Machteffekte fokussiert.

### Evidenz 3

Expliziter Bezug zu Sozialen Systemen und struktureller Unterdrückung: 'intersectionality [...] allows us to examine how social inequalities persist through domains of structure and discipline'; Engagement mit carceral systems und sozialer Gerechtigkeit.

### Evidenz 4

Zentrale Analyse algorithmischen Bias und struktureller Ungleichheit: 'the goal of minimizing negative outcomes across demographic groups, including groups associated with multiple, intersectional demographic attributes'

### Evidenz 5

Expliziter Gender-Fokus mit Referenzen auf Black women, gender-intersections und geschlechtsspezifische Dimensionen von Unterdrückung.

### Evidenz 6

Kernfokus auf Intersektionalität, marginalisierte Communities und intersektionale Perspektiven: 'examining interlocking mechanisms of structural oppression [...] which produce inequality'

### Evidenz 7

Explizit feministische Theorie (Crenshaw, Collins, Black Feminist epistemology, hooks): 'Black feminist knowledge' wird zentralisiert; Referenzen zu 'gentrification of intersectionality' und Schutz Black feminist Wissensproduktion.

### Evidenz 8

Zentrale Kritik der Fairness-Literatur: 'The majority of the papers we review approach intersectionality from the narrow perspective of subgroup fairness.'

## Assessment-Relevanz

**Domain Fit:** Hochgradig relevant für die Schnittstelle AI/Soziale Arbeit/Gender: Das Paper verbindet kritische sozialwissenschaftliche Theorie (intersektionaler Feminismus, Dekolonialität) mit technischer KI-Forschung und zeigt, wie soziale Gerechtigkeit in AI-Systemen operationalisiert werden kann. Besonders wertvoll für Sozialarbeiter und KI-Entwickler, die kritische Reflexion suchen.

**Unique Contribution:** Das Paper bietet die erste systematische kritische Analyse, wie AI-Fairness-Papiere intersektionale Theorie (miss)verwenden, und entwickelt ein operationalisierbares Framework (Collins/Bilges Tenets) zur Messung echter intersektionaler Praxis versus oberflächlicher Fairness-Optimierung.

**Limitations:** Fokus auf englischsprachige, akademische peer-reviewed Papiere (nicht Industrie oder globale Perspektiven); begrenzte Analyse praktischer Implementierungen außerhalb des AI-Pipelines; Positioniertheit der Autoren auf US/Europa kann globale Kontexte limitieren.

**Target Group:** AI-Forscher und -Entwickler mit Fairness-Fokus; Sozialwissenschaftler und kritische Theoretiker; Policy-Maker; Lehrende in KI-Ethik; Community-Organizer und soziale Gerechtigkeit Aktivisten; Studierenden in Gender Studies, KI-Ethik, Sozialer Arbeit

## Schlüsselreferenzen

- [[Crenshaw_1989]] - Demarginalizing the Intersection of Race and Sex (Intersectionality foundational work)
- [[Collins_2000]] - Black Feminist Thought (Matrix of Domination framework)
- [[Buolamwini_Gebru_2018]] - Gender Shades (intersectional subgroups in computer vision)
- [[DIgnazio_Klein_2020]] - Data Feminism
- [[Eubanks_2019]] - Automating Inequality (algorithmic systems and surveillance)
- [[hooks_bell_2000]] - Feminist Theory: From Margin to Center
- [[Freeman_1978]] - Legitimizing Racial Discrimination Through Antidiscrimination Law (critical legal studies)
- [[Mitchell_et_al_2019]] - Model Cards for Model Reporting
- [[ConstanzaChock_2020]] - Design Justice (intersectional critical design)
- [[AlexanderFloyd_2012]] - Black Feminist Knowledge and Black Feminist Erasure (citational praxis)
