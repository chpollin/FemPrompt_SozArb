---
title: "Divergenz: DR.GAP: Mitigating bias in large language models using gender-aware prompting wi"
type: divergenz
pattern: Semantische Expansion
human_decision: Include
llm_decision: Exclude
severity: 3
paper_id: 189
tags:
  - divergenz
---
# Divergenz: DR.GAP: Mitigating bias in large language models using gender-aware prompting with demonstration and reasoning

**Paper:** Qiu (2025)
**Paper-ID:** 189

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
| Generative_KI | Ja | Ja |  |
| Prompting | Ja | Nein | **X** |
| KI_Sonstige | Nein | Nein |  |
| Soziale_Arbeit | Nein | Nein |  |
| Bias_Ungleichheit | Ja | Ja |  |
| Gender | Ja | Nein | **X** |
| Diversitaet | Ja | Nein | **X** |
| Feministisch | Nein | Nein |  |
| Fairness | Nein | Ja | **X** |

## LLM-Reasoning

> Paper behandelt Fairness in Large Language Models (Generative_KI: Ja, Fairness: Ja, Bias_Ungleichheit: Ja). Jedoch fehlt der erforderliche SOZIAL-Kontext: Es gibt keinen direkten Bezug zu Sozialer Arbeit, Gender-Perspektive, Diversität oder feministischen Ansätzen. Allgemeine Fairness-Diskussionen in KI ohne Sozialarbeitsbezug sind nicht relevant für das Literature Review zu KI und Sozialer Arbeit. TECHNIK-Bedingung erfüllt, aber SOZIAL-Bedingung nicht erfüllt → Exclude.

## Divergenz-Muster

**Pattern:** Semantische Expansion

**Begruendung:** Das LLM dehnt 'Fairness' zu einer eigenständigen Kategorie aus und gewichtet technische Fairness-Aspekte höher als die implizite Anforderung, dass Gender/Diversität nur im Kontext von Sozialer Arbeit relevant sind. Die menschliche Entscheidung erkennt Gender und Diversität als feldspezifisch relevant an, während das LLM diese Kategorien narrower interpretiert.

## Annotation

KRITISCH: Agent übersieht Relevanz | Agent-Begründung: Paper behandelt Fairness in Large Language Models (Generative_KI: Ja, Fairness: Ja, Bias_Ungleichhei... | Technik-Differenz: Prompting | Sozial-Differenz: Gender, Diversitaet, Fairness

