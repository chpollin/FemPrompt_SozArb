---
title: "Divergenz: More or less wrong: A benchmark for directional bias in LLM comparative reasonin"
type: divergenz
pattern: Keyword-Inklusion
human_decision: Include
llm_decision: Exclude
severity: 3
paper_id: 153
tags:
  - divergenz
---
# Divergenz: More or less wrong: A benchmark for directional bias in LLM comparative reasoning

**Paper:** Liu (2025)
**Paper-ID:** 153

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
| AI_Literacies | Nein | Ja | **X** |
| Generative_KI | Ja | Nein | **X** |
| Prompting | Ja | Nein | **X** |
| KI_Sonstige | Ja | Ja |  |
| Soziale_Arbeit | Nein | Nein |  |
| Bias_Ungleichheit | Ja | Ja |  |
| Gender | Ja | Nein | **X** |
| Diversitaet | Ja | Nein | **X** |
| Feministisch | Nein | Nein |  |
| Fairness | Ja | Ja |  |

## LLM-Reasoning

> Paper erfüllt TECHNIK-Kriterium (AI_Literacies, KI_Sonstige) und SOZIAL-Kriterium (Bias_Ungleichheit, Fairness). JEDOCH: Thema ist klinische Entscheidungsunterstützung im Gesundheitswesen, NICHT Soziale Arbeit. Keine Verknüpfung zu sozialarbeiterischer Praxis, Theorie oder Zielgruppen. Bias/Fairness-Diskussion bezieht sich auf medizinische Kontexte, nicht auf Soziale Arbeit. Daher: außerhalb des Scope des Literaturreviews zu KI in Sozialer Arbeit.

## Divergenz-Muster

**Pattern:** Keyword-Inklusion

**Begruendung:** Das LLM hat die Keywords 'Bias', 'Fairness' und 'LLM' erkannt und automatisch die Kategorien positiv markiert, ohne zu erkennen, dass der klinische Anwendungskontext außerhalb des Soziale-Arbeit-Fokus liegt. Der Mensch erkannte korrekt, dass die fachliche Domäne (Gesundheitswesen, nicht Soziale Arbeit) die Inklusion rechtfertigt, während das LLM nur oberflächliche Keyword-Matches identifizierte.

## Annotation

KRITISCH: Agent übersieht Relevanz | Agent-Begründung: Paper erfüllt TECHNIK-Kriterium (AI_Literacies, KI_Sonstige) und SOZIAL-Kriterium (Bias_Ungleichheit... | Technik-Differenz: AI_Literacies, Generative_KI, Prompting | Sozial-Differenz: Gender, Diversitaet

