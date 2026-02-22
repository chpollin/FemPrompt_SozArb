---
title: "Divergenz: Evaluating gender bias in large language models via chain-of-thought prompting"
type: divergenz
pattern: Semantische Expansion
human_decision: Include
llm_decision: Exclude
severity: 3
paper_id: 121
tags:
  - divergenz
---
# Divergenz: Evaluating gender bias in large language models via chain-of-thought prompting

**Paper:** Kaneko (2024)
**Paper-ID:** 121

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
| Bias_Ungleichheit | Ja | Nein | **X** |
| Gender | Ja | Nein | **X** |
| Diversitaet | Nein | Nein |  |
| Feministisch | Nein | Nein |  |
| Fairness | Ja | Nein | **X** |

## LLM-Reasoning

> Das Paper behandelt rein technische Aspekte von LLM-Inferenz (Nondeterminismus, Sampling, Reproducibility). Während es Generative KI erwähnt, fehlt jeder soziale Bezug: keine AI Literacies, keine Bias/Fairness-Analyse, keine Bezüge zu Soziale Arbeit, Diversität oder Ungleichheit. Es ist ein rein technisches Konzeptpaper ohne gesellschaftliche, ethische oder pädagogische Dimension.

## Divergenz-Muster

**Pattern:** Semantische Expansion

**Begruendung:** Das LLM dehnt die Kategorie 'Prompting' zu eng aus (nur technische Chain-of-Thought-Inferenz) und erkennt nicht, dass empirische Bias-Evaluationen via Prompting dem Forschungsfeld inhärent angehören. Es unterschätzt systematisch, wie Bias/Gender/Fairness durch Prompting-Methoden untersucht werden.

## Annotation

KRITISCH: Agent übersieht Relevanz | Agent-Begründung: Das Paper behandelt rein technische Aspekte von LLM-Inferenz (Nondeterminismus, Sampling, Reproducib... | Technik-Differenz: Prompting | Sozial-Differenz: Bias_Ungleichheit, Gender, Fairness

