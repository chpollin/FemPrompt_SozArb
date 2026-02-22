---
title: "Divergenz: BBQ: A hand-built bias benchmark for question answering"
type: divergenz
pattern: Semantische Expansion
human_decision: Include
llm_decision: Exclude
severity: 3
paper_id: 180
tags:
  - divergenz
---
# Divergenz: BBQ: A hand-built bias benchmark for question answering

**Paper:** Parrish (2022)
**Paper-ID:** 180

## Entscheidungen

| | Entscheidung |
|---|---|
| **Human** | Include |
| **LLM** | Exclude |
| **Typ** | Human_Include_Agent_Exclude |
| **Schweregrad** | 3 |

## Kategorie-Vergleich

| Kategorie | Human | LLM | Divergent |
|-----------|-------|-----|----------|
| AI_Literacies | Nein | Nein |  |
| Generative_KI | Nein | Ja | **X** |
| Prompting | Nein | Nein |  |
| KI_Sonstige | Ja | Nein | **X** |
| Soziale_Arbeit | Nein | Nein |  |
| Bias_Ungleichheit | Ja | Nein | **X** |
| Gender | Ja | Nein | **X** |
| Diversitaet | Ja | Nein | **X** |
| Feministisch | Nein | Nein |  |
| Fairness | Ja | Nein | **X** |

## LLM-Reasoning

> Paper untersucht LLM-Fähigkeiten zur Vertrauensanalyse zwischen Individuen. Während Generative_KI (LLMs) relevant ist, fehlt jeglicher substantieller Bezug zu den sozialen Kategorien: kein direkter Sozialarbeitsbezug, keine Bias/Ungleichheit-Analyse, kein Gender-, Diversitäts- oder Fairness-Fokus. Die Vertrauensforschung ist allgemein sozialwissenschaftlich, nicht sozialarbeiterisch spezifisch. TECHNIK_OK, aber SOZIAL_NICHT_OK → Exclude.

## Divergenz-Muster

**Pattern:** Semantische Expansion

**Begruendung:** Das LLM dehnt 'Generative_KI' zu eng aus und kodiert 'Bias/Fairness in QA-Systemen' nicht als genuine Sozialarbeits-Inhalte, während es die implizite Feldrelevanz von BBQ für Fairness/Bias-Arbeit (zentral für Soziale Arbeit) übersieht.

## Annotation

KRITISCH: Agent übersieht Relevanz | Agent-Begründung: Paper untersucht LLM-Fähigkeiten zur Vertrauensanalyse zwischen Individuen. Während Generative_KI (L... | Technik-Differenz: Generative_KI, KI_Sonstige | Sozial-Differenz: Bias_Ungleichheit, Gender, Diversitaet, Fairness

