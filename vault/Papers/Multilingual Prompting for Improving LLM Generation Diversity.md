---
title: Multilingual Prompting for Improving LLM Generation Diversity
authors:
  - Q. Wang
  - S. Pan
  - T. Linzen
  - E. Black
year: 2025
type: report
url: https://arxiv.org/html/2505.15229v1
tags:
  - paper
  - feminist-ai
  - bias-research
date_added: 2026-02-22
date_modified: 2026-02-22
bias_types: []
mitigation_strategies:
  - Equitable Manner
llm_decision: Include
llm_confidence: 0.85
llm_categories:
  - Generative_KI
  - Prompting
  - Bias_Ungleichheit
  - Diversitaet
  - Fairness
human_decision: Exclude
human_categories: []
agreement: disagree
---

# Multilingual Prompting for Improving LLM Generation Diversity

## Abstract

This study introduces multilingual prompting as a strategy to enhance narrative diversity in LLM outputs. By using prompts with diverse languages and cultural cues, models produced outputs with improved demographic and opinion diversity. Compared to temperature-based and persona prompting, multilingual prompting was more effective and reduced cultural hallucinations.

## Assessment

**LLM Decision:** Include (Confidence: 0.85)
**LLM Categories:** Generative_KI, Prompting, Bias_Ungleichheit, Diversitaet, Fairness
**Human Decision:** Exclude
**Agreement:** Disagree

## Key Concepts

### Mitigation Strategies
- [[Equitable Manner]]

## Full Text

---
title: "Multilingual Prompting for Improving LLM Generation Diversity"
authors: ["Qihan Wang", "Shidong Pan", "Tal Linzen", "Emily Black"]
year: 2025
type: conferencePaper
language: en
processed: 2026-02-05
source_file: Wang_2025_Multilingual_Prompting_for_Improving_LLM.md
confidence: 94
---

# Multilingual Prompting for Improving LLM Generation Diversity

## Kernbefund

Multilingual Prompting übertrifft bestehende Diversitäts-Techniken konsistent und erhöht demografische, kulturelle und perspektivische Vielfalt in LLM-Outputs, während die Genauigkeit bei faktischen Aufgaben erhalten bleibt.

## Forschungsfrage

Wie können Multilingual-Prompting-Techniken die kulturelle und demografische Diversität in den Ausgaben von Large Language Models erhöhen?

## Methodik

Empirisch: Experimentelle Evaluationen mit GPT-4o, GPT-4o-mini, LLaMA 70B und LLaMA 8B; Vergleich mehrerer Prompting-Strategien (Monolingual, High Temperature, Personas, Multilingual, Multicultural); menschliche Annotationsstudien (n=84 Annotatoren); Entropie-basierte Diversitätsmessung.
**Datenbasis:** Evaluationen über mehrere Modelle; 105 berufsbezogene Prompts aus dem People Diversity Dataset; Social-Chem-101 Datensatz für Normen-Fragen; 420 Namen-Annotationen mit 3 Annotatoren pro Name; Sanity Check mit adversarialen Multiple-Choice-Fragen (9-10/10 Genauigkeit)

## Hauptargumente

- LLMs generieren kulturell homogene und monolinguale Antworten, die westliche oder dominierende Perspektiven überrepräsentieren und marginalisierte Gruppen systematisch vernachlässigen, was zu unfairer Exposition und unzureichender Repräsentation führt.
- Multilingual Prompting nutzt die language-spezifischen Wissensencodierungen in LLMs, indem es Prompts in mehreren Sprachen mit kulturellen Hinweisen generiert und die Responses kombiniert, wodurch ein breiteres Spektrum kulturellen Wissens aktiviert wird.
- Die Kombination von Sprache und kulturellen Hinweisen (Namen, Geburtsort, Essen) ist effektiver als nur kulturelle Hinweise auf Englisch, da die native Sprache Halluzinationen über kulturell spezifische Informationen reduziert und Diversität erhöht.

## Kategorie-Evidenz

### Evidenz 1

Das Paper adressiert Large Language Models (GPT-4o, GPT-4o-mini, LLaMA 70B, 8B) und deren Fähigkeit zur Generierung diverser Inhalte.

### Evidenz 2

Zentrale Methodik: 'multilingual prompting - a prompting method which generates several variations of a base prompt with added cultural and linguistic cues from several cultures' sowie Vergleich mit anderen Prompting-Techniken wie 'step-by-step recall prompting', 'personas prompting', und High Temperature Sampling.

### Evidenz 3

Das Paper thematisiert explizit: 'lack of demographic diversity when queried about individuals can lead to unfair lack of exposure of artists, academics, and other professionals on the basis of their race, ethnicity, or nationality' und 'LLMs generate largely monocultural responses...often leaning towards expressing Western values'.

### Evidenz 4

Primärer Fokus auf 'demographic diversity', 'cultural diversity', 'perspective diversity', und 'overall diversity in LLM generations'. Messung durch Entropie über 30 generierte Namen, mit Annotation nach Nationalität, Ethnizität und geografischer Region.

### Evidenz 5

Das Paper argumentiert für 'equitable manner' der Informationsexposition durch LLMs und untersucht, ob die Outputs 'reflect the diversity of real-world perspectives' sowie die Reduktion von Halluzinationen bei kulturell spezifischen Informationen.

## Assessment-Relevanz

**Domain Fit:** Das Paper adressiert die Schnittstelle zwischen KI-Systemen und sozialer Gerechtigkeit durch die Frage, wie generative KI-Modelle unterschiedliche kulturelle und demografische Gruppen repräsentieren. Während nicht explizit auf Soziale Arbeit bezogen, ist die Problematik der fairen und diversitären Informationsbereitstellung für Felder wie Beratung, Advocacy und Community-Arbeit relevant.

**Unique Contribution:** Die Erkenntnis, dass Multilingual Prompting—die gezielte Kombination von Prompts in mehreren Sprachen mit kulturellen Hinweisen—konsistent wirksamer ist als bestehende Diversitäts-Techniken, liefert eine praktische und skalierbare Methode zur Mitigation von kulturellem Bias in LLM-Outputs.

**Limitations:** Das Paper ist auf drei Sprachen (Englisch, Chinesisch, Japanisch) beschränkt und zeigt Probleme mit Instruction-Following in niedrig-ressourcenstarken Sprachen und ungleiche Resultate über Modellgrößen hinweg; der Evaluationsfokus liegt primär auf demografischer Repräsentation von Namen, nicht auf Inhaltsqualität oder echte kulturelle Authentizität.

**Target Group:** KI-Entwickler und Modellierer (besonders bei Anwendung von LLMs), Fairness- und Ethik-Forscher, Content-Moderator:innen, Organisationen die LLMs für User-Studies oder Annotation einsetzen, Policy-Maker im Bereich AI Governance, potenziell auch Sozialarbeiter:innen die LLMs in der Praxis einsetzen

## Schlüsselreferenzen

- [[Aggarwal_et_al_2025]] - Language models' factuality depends on the language of inquiry
- [[Santurkar_et_al_2023]] - Whose opinions do language models reflect?
- [[Wang_et_al_2025]] - Large language models that replace human participants can harmfully misportray and flatten identity groups
- [[Wu_et_al_2024]] - Generative monoculture in large language models
- [[Bommasani_et_al_2022]] - Picking on the same person: Does algorithmic monoculture lead to outcome homogenization?
- [[Kwok_et_al_2024]] - Evaluating cultural adaptability of a large language model via simulation of synthetic personas
- [[Padmakumar_He_2023]] - Does writing with language models reduce content diversity?
- [[Forbes_et_al_2020]] - Social Chemistry 101: Learning to reason about social and moral norms
- [[Hayati_et_al_2023]] - How far can we extract diverse perspectives from large language models?
- [[Lahoti_et_al_2023]] - Improving diversity of demographic representation in large language models via collective-critiques and self-voting
