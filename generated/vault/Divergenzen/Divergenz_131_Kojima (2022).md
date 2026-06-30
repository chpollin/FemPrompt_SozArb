---
title: "Divergenz: Large language models are zero-shot reasoners"
type: divergenz
pattern: Semantische Expansion
human_decision: Exclude
llm_decision: Include
severity: 2
paper_id: 131
tags:
  - divergenz
---
# Divergenz: Large language models are zero-shot reasoners

**Paper:** Kojima (2022)
**Paper-ID:** 131

## Entscheidungen

| | Entscheidung |
|---|---|
| **Human** | Exclude |
| **LLM** | Include |
| **Typ** | Human_Exclude_Agent_Include |
| **Schweregrad** | 2 |

## Kategorie-Vergleich

| Kategorie | Human | LLM | Divergent |
|-----------|-------|-----|----------|
| AI_Literacies | Nein | Nein |  |
| Generative_KI | Ja | Ja |  |
| Prompting | Ja | Nein | **X** |
| KI_Sonstige | Nein | Nein |  |
| Soziale_Arbeit | Nein | Nein |  |
| Bias_Ungleichheit | Nein | Ja | **X** |
| Gender | Nein | Ja | **X** |
| Diversitaet | Nein | Ja | **X** |
| Feministisch | Nein | Nein |  |
| Fairness | Nein | Nein |  |

## LLM-Reasoning

> Paper untersucht systematisch Bias und Diskriminierung in LLM-generierten Narrativen von queeren Personen. Erfüllt TECHNIK-Kriterium (Generative_KI: Fokus auf LLM-Outputs) und SOZIAL-Kriterium (Bias_Ungleichheit: Stereotypisierung marginalisierter Gruppen; Gender: queere Identitäten; Diversitaet: Repräsentation von LGBTQ+-Personen in KI-Systemen). Keine explizite feministische Theorie erkannt, daher Feministisch=Nein.

## Divergenz-Muster

**Pattern:** Semantische Expansion

**Begruendung:** Das LLM dehnt die Kategorien Bias_Ungleichheit, Gender und Diversitaet über ihre Kernkriterien hinaus aus, indem es allgemeine Erwähnungen von queeren Identitäten und LGBTQ+-Repräsentation als thematische Zugehörigkeit interpretiert, ohne dass der Paper explizit sozialpolitische oder diversitätsorientierte Forschung betreibt. Der Human erkennt korrekt, dass der Fokus auf eine technische Methode (Chain-of-Thought-Prompting) liegt, nicht auf die sozialen Implikationen.

## Annotation

Agent sieht Relevanz, die Expert:innen nicht sehen | Human-Exclusion: Not relevant topic | Technik-Differenz: Prompting | Sozial-Differenz: Bias_Ungleichheit, Gender, Diversitaet

