---
title: "LIBRA: Measuring bias of large language model from a local context"
authors:
  - B. Pan
  - H. Liu
  - Y. Hou
  - M. Yang
year: 2025
type: report
doi: 
url: "https://www.researchgate.net/publication/388686547_LIBRA_Measuring_Bias_of_Large_Language_Model_from_a_Local_Context"
tags:
  - paper
llm_decision: Exclude
llm_confidence: 0.85
llm_categories:
  - Generative_KI
  - KI_Sonstige
  - Bias_Ungleichheit
  - Diversitaet
  - Fairness
human_decision: Include
human_categories:
  - Generative_KI
  - Prompting
  - Bias_Ungleichheit
  - Gender
  - Diversitaet
  - Fairness
agreement: disagree
---

# LIBRA: Measuring bias of large language model from a local context

## Transformation Trail

### Stufe 1: Extraktion & Klassifikation (LLM)

**Extrahierte Kategorien:** AI_Literacies, Generative_KI, Fairness
**Argumente:** 3 extrahiert

### Stufe 3: Verifikation (LLM)

| Metrik | Score |
|--------|-------|
| Completeness | 88 |
| Correctness | 92 |
| Category Validation | 85 |
| **Overall Confidence** | **88** |

### Stufe 4: Assessment

**LLM:** Exclude (Confidence: 0.85)
**Human:** Include

**Kategorie-Vergleich (bei Divergenz):**

| Kategorie | Human | LLM | Divergent |
|-----------|-------|-----|----------|
| AI_Literacies | Nein | Nein |  |
| Generative_KI | Ja | Ja |  |
| Prompting | Ja | Nein | X |
| KI_Sonstige | Nein | Ja | X |
| Soziale_Arbeit | Nein | Nein |  |
| Bias_Ungleichheit | Ja | Ja |  |
| Gender | Ja | Nein | X |
| Diversitaet | Ja | Ja |  |
| Feministisch | Nein | Nein |  |
| Fairness | Ja | Ja |  |

> Siehe [[Divergenz Pan_2025_AI_literacy_and_trust_A_multi-method_study_of]] fuer detaillierte Analyse


## Key Concepts

- [[AI Literacy]]
- [[AI Trustworthiness]]

## Wissensdokument

# AI literacy and trust: A multi-method study of Human-GAI team collaboration

## Kernbefund

Higher AI literacy shows a paradox: while perceived value increases trust in GAI, greater knowledge can lead to distrust. The study identified three trust categories (trust 52%, distrust 26%, ambivalence 22%) and found that AI accuracy perceptions are critical determinants of trust formation.

## Forschungsfrage

Wie beeinflussen AI Literacy und Vertrauen die Zusammenarbeit zwischen Menschen und generativer KI in Team-Settings?

## Methodik

Mixed Methods: Qualitativ (kodierte Interviews zu Trust-Kategorien) und Quantitativ (Multinomiale logistische Regression und lineare Regression mit n=116 Studierenden in 23 Projektteams)
**Datenbasis:** n=116 undergraduate team members across 23 project teams throughout a semester; qualitative and quantitative measures on AI literacy (knowledge, perceived value, concerns) and trust in GAI

## Hauptargumente

- Trust is a fundamental requirement for effective human-AI teamwork, but unlike human teams, GAI teams face unique challenges because trust-building mechanisms based on shared experiences and interpersonal familiarity are unavailable in human-GAI interactions.
- AI literacy is a multidimensional construct comprising knowledge about GAI, perceived value, and perceived concerns. Knowledge paradoxically increases distrust while perceived value increases trust, suggesting that critical technical understanding can prompt skepticism about GAI reliability.
- The educational context reveals real-world trust deficits in AI adoption across domains (healthcare, K-12 education, software development), necessitating targeted AI literacy development programs to foster both informed use and appropriate calibration of trust in AI systems.

## Kategorie-Evidenz

### Evidenz 1

Long and Magerko (2020) define AI literacy as understanding basic AI concepts, recognizing practical applications, and evaluating social impacts. The study operationalizes AI literacy through three sub-constructs: knowledge about GAI, perceived value of GAI, and perceived concerns about GAI, with α=.75 overall reliability.

### Evidenz 2

Study focuses explicitly on human-generative AI (GAI) collaboration, defined as systems capable of generating new content based on training data, specifically examining LLMs like ChatGPT. Both Study 1 and Study 2 measure trust and perceptions of GAI as a teammate in collaborative settings.

### Evidenz 3

The National Institute of Standards and Technology (2023) AI Risk Management Framework is referenced, highlighting key attributes contributing to AI trustworthiness such as explainability, accuracy, reliability, and fairness as critical factors for positioning AI as a trustworthy collaborator.

## Assessment-Relevanz

**Domain Fit:** Das Paper hat nur begrenzte Relevanz für die Schnittstelle AI/Soziale Arbeit/Gender. Der Fokus liegt auf Hochschulbildung und Teamarbeit in Lehrkontexten, nicht auf Sozialarbeitsfeldern oder vulnerablen Zielgruppen. Gender und Vielfalt werden nicht explizit untersucht.

**Unique Contribution:** Das Paper trägt durch ein mixed-method Design zum Verständnis des Vertrauensparadoxons in GAI-Teams bei: Es zeigt, dass höhere AI Literacy zu mehr kritischem Bewusstsein und damit potentiell zu Misstrauen führen kann, während wahrgenommener Nutzen Vertrauen fördert.

**Limitations:** Limitationen: Nicht angegeben im Abstract/Excerpt; methodisch wahrscheinlich: Kleine Stichprobe von Studierenden in einem Lehrsetting, begrenzte Generalisierbarkeit auf andere Populationen und professionelle Kontexte

**Target Group:** Bildungsforscher, Hochschullehrende, Organisationsentwickler, HR-Profis, KI-Literacy-Curriculum-Designer, Forscher im Bereich Human-AI Collaboration und Team-Management

## Schlüsselreferenzen

- [[Lee_See_2004]] - Trust in automation: Designing for appropriate reliance
- [[Mayer_Davis_Schoorman_1995]] - An integrative model of organizational trust
- [[Kozlowski_et_al_2015]] - Teams, teamwork, and team effectiveness: Implications for human systems integration
- [[Fiore_Wiltshire_2016]] - Technology as a teammate: Cognition across members, artifacts, and technology
- [[Long_Magerko_2020]] - What is AI literacy? Competencies and design considerations
- [[Wilson_Daugherty_2018]] - Collaborative intelligence: Humans and AI are joining forces
- [[Chan_Hu_2023]] - AI literacy measure with knowledge, perceived value, and concerns sub-constructs
- [[ONeill_et_al_2022]] - Human-autonomy teaming: A review and analysis of the empirical literature
- [[National_Institute_of_Standards_and_Technology_2023]] - AI Risk Management Framework
- [[Guzman_Lewis_2019]] - Artificial intelligence and communication: A human-machine communication research agenda
