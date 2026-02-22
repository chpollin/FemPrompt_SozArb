---
title: Policy advice and best practices on bias and fairness in AI
authors:
  - J. M. Alvarez
  - A. Bringas Colmenarejo
  - A. Elobaid
  - S. Fabbrizzi
  - M. Fahimi
  - A. Ferrara
  - 
  - S. Ruggieri
year: 2024
type: journalArticle
doi: 10.1007/s10676-024-09746-w
url: "https://link.springer.com/article/10.1007/s10676-024-09746-w"
tags:
  - paper
llm_decision: Exclude
llm_confidence: 0.85
llm_categories:
  - KI_Sonstige
  - Bias_Ungleichheit
  - Fairness
---

# Policy advice and best practices on bias and fairness in AI

## Transformation Trail

### Stufe 1: Extraktion & Klassifikation (LLM)

**Extrahierte Kategorien:** AI_Literacies, KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit, Diversitaet, Feministisch, Fairness
**Argumente:** 5 extrahiert

### Stufe 3: Verifikation (LLM)

| Metrik | Score |
|--------|-------|
| Completeness | 92 |
| Correctness | 98 |
| Category Validation | 95 |
| **Overall Confidence** | **95** |

### Stufe 4: Assessment

**LLM:** Exclude (Confidence: 0.85)

## Key Concepts

- [[Algorithmic Fairness]]
- [[Intersectionality in AI]]
- [[Representation Bias]]

## Wissensdokument

# Policy advice and best practices on bias and fairness in AI

## Kernbefund

Der Hauptbeitrag besteht in einer umfassenden Übersicht des Fair-AI-Forschungsstands sowie in Policy-Empfehlungen und Best Practices aus dem NoBIAS-Projekt, die zentrale unterentwickelte Themen wie Multi-Stakeholder-Partizipation, Intersektionalität, Kausalität und Monitoring adressieren. Fair-AI erfordert einen multidisziplinären Ansatz jenseits reiner technischer Optimierung und muss mit rechtlichen, sozialen und ethischen Frameworks integriert werden.

## Forschungsfrage

Wie können Bias und Fairness in KI-Systemen durch Policy-Interventionen und Best Practices verstanden, gemindert und kontrolliert werden?

## Methodik

Theoretisch/Review - systematische Übersicht der Fair-AI-Methoden, -Ressourcen und -Policies mit multidisziplinärem Ansatz basierend auf Erkenntnissen des NoBIAS-Forschungsprojekts
**Datenbasis:** nicht empirisch - Review und Policy-Synthese basierend auf Literaturanalyse und Projektergebnissen

## Hauptargumente

- KI-Systeme sind value-laden und können systematische Diskriminierung reproduzieren, weshalb algorithmische Fairness nicht nur ein technisches, sondern ein grundsätzlich multidisziplinäres Problem ist, das Perspektiven aus Recht, Philosophie, Sozialwissenschaften und Ethik integrieren muss.
- Die aktuelle Hegemonie technischer Fair-AI-Ansätze mit Fokus auf numerische Fairness-Metriken vernachlässigt kontextuelle, politische und substanzielle Gleichheitskonzepte; Multi-Stakeholder-Partizipation und menschenzentrierte AI sind notwendig für robuste Systeme.
- Intersektionalität und das Verbot-Debiasing-Paradoxon zeigen, dass Single-Attribute-Bias-Mitigation bestehende Ungleichheiten verstärken kann, weshalb Systeme ganzheitlich auf Wechselwirkungen zwischen geschützten Merkmalen analysiert werden müssen.
- Kausalität bietet einen vielversprechenden theoretischen Rahmen zur Erfassung echter Diskriminierungsmechanismen, erfordert aber explizite Stakeholder-Verhandlungen über Annahmen und kann nicht vollständig aus Daten allein inferiert werden.
- Bias ist nicht statisch sondern unterliegt Distribution Shifts über Zeit und Kontexte; kontinuierliches Monitoring und domänenspezifische Ansätze sind essentiell für Accountability in hochriskanten Anwendungskontexten.

## Kategorie-Evidenz

### Evidenz 1

Das Paper betont die Notwendigkeit multidisziplinärer Bildung und kritischer Reflexion über KI-Systeme: 'Involving a diverse group of people has shown to be critical in stages such as selecting the preferences instructed to the model' und diskutiert AI-Alignment und 'human-centered AI' als zentrale Kompetenzen.

### Evidenz 2

Umfassende Behandlung verschiedener KI-Subdisziplinen: 'fair-AI research has been rapidly expanding to all sub-fields of AI, including unsupervised and reinforcement learning, natural language processing (NLP), computer vision, speech processing, recommender systems, and knowledge representation'

### Evidenz 3

Konkrete Anwendung in Sozialen Diensten: 'The NoBIAS project contributed in Scott et al. (2022) to a participatory approach in the design of algorithmic systems in support of public employment services.' Bezug zu Arbeitsmarktentscheidungen und Beratung.

### Evidenz 4

Zentral für das Paper: 'algorithmic systems are value-laden in that they (1) create moral consequences, (2) reinforce or undercut ethical principles, or (3) enable or diminish stakeholder rights and dignity'. Extensive Diskussion von Diskriminierungsquellen und Harm: 'illegal discrimination against social groups protected by non-discrimination law'

### Evidenz 5

Starker Fokus auf Repräsentation und marginalisierte Gruppen: 'Active participation during the whole construction process of an AI system can be a key part of addressing the representation bias that prevails in current systems' und 'models trained on raw data fail to capture the nuances found in the less-represented segments of the data distribution (Mallen et al., 2023), which often correspond to underprivileged communities.'

### Evidenz 6

Das Paper zitiert und integriert explizit feministische Perspektiven: 'State, L., Fahimi, M. (2023). Careful explanations: A feminist perspective on XAI.' und 'Organizers Of QueerinAI et al., 2023' bei der Diskussion von Representationsbias. Intersektionalität wird als feministisches Konzept behandelt: 'different dimensions of identity cannot be understood in isolation but must be considered collectively' - dies ist Crenshaw'sche Intersektionalitätstheorie.

### Evidenz 7

Das ist das Kernthema des gesamten Papers: 'Fairness in AI (or simply, fair-AI) aims at designing methods for detecting, mitigating, and controlling biases in AI-supported decision making' mit detaillierter Diskussion von Group Fairness Metrics, Individual Fairness Metrics, Causal Fairness Metrics und deren trade-offs.

## Assessment-Relevanz

**Domain Fit:** Das Paper ist hochrelevant für die Schnittstelle KI und Soziale Arbeit, da es sowohl technische als auch policy-orientierte Lösungen für Fairness adressiert und explizit Anwendungen in sozialen Diensten (Arbeitsmarktservice) diskutiert. Die Integration feministischer und intersektionaler Perspektiven macht es wertvoll für equity-fokussierte Sozialarbeit.

**Unique Contribution:** Der besondere Beitrag liegt in der Integration von EU-Rechtsperspektiven mit technischer Fair-AI-Forschung sowie in der systematischen Behandlung unterentwickelter Themen wie intersektionale Bias-Mitigation, Multi-Stakeholder-Partizipation und Kausalität im Fairness-Kontext.

**Limitations:** Das Paper ist ein Review/Policy-Synthese ohne empirische Validierung der Empfehlungen; es behandelt die Spannung zwischen technischer Machbarkeit und normativen Anforderungen teilweise abstrakt und liefert begrenzte konkrete Implementierungsrichtlinien für komplexe Kontexte wie Soziale Arbeit.

**Target Group:** KI-Entwickler:innen und Datenwissenschaftler:innen, Policymaker und Regulatoren (insbesondere im EU-Kontext), Sozialarbeiter:innen und Fachkräfte sozialer Dienste, Ethik-Expert:innen, Forschende im Bereich AI Ethics und Fair ML, sowie Organisationen, die KI-Systeme in hochriskanten sozialen Kontexten implementieren

## Schlüsselreferenzen

- [[Pearl_2009]] - Causality: Models, Reasoning and Inference
- [[Mittelstadt_et_al_2023]] - Bridging the gap between fairness metrics and substantive equality
- [[Buolamwini_Gebru_2018]] - Gender Shades: Intersectional Accuracy Disparities in Commercial AI
- [[Friedman_Nissenbaum_1996]] - Bias in computer systems
- [[Smirnov_et_al_2021]] - Quota-based debiasing can decrease representation of the most under-represented groups
- [[Caton_Haas_2024]] - Fairness in Machine Learning: A Survey
- [[DIgnazio_Klein_2020]] - Data Feminism
- [[Kulynych_et_al_2020]] - Socio-technical systems and fairness in algorithmic decision-making
- [[Pedreschi_et_al_2008]] - Discrimination-aware data mining
- [[Wachter_et_al_2021]] - Why fairness cannot be automated: Bridging EU non-discrimination law and AI
