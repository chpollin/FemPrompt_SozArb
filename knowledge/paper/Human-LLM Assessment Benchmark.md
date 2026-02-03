---
type: knowledge
created: 2026-02-02
tags: [workflow, research, original, benchmark]
status: draft
---

# Human-LLM Assessment Benchmark

## Summary

Methodendokumentation für den parallelen Vergleich zwischen menschlichem und LLM-basiertem PRISMA-Assessment im Rahmen des FemPrompt Literature Reviews. Das Dokument spezifiziert Kategorien, Datenformate, Workflows und Metriken für die reproduzierbare Durchführung des Benchmarks.

## Forschungsfrage

Wie reliabel ist LLM-basiertes Literatur-Assessment im Vergleich zu Expert:innen-Bewertung bei einem interdisziplinären, nicht-englischsprachigen Forschungsfeld?

## Dual-Track Assessment Design

| Track | Akteure | Methode | Output |
|-------|---------|---------|--------|
| Human | Susi, Sabine | Kollaborativ via Google Sheets | Include/Exclude + Kategorien |
| LLM | Claude Haiku 4.5 | Automatisiert via Prompt | Include/Exclude + Kategorien |

**Kernprinzip:** Beide Tracks bewerten mit identischem Kategorienschema. Das Human-Assessment definiert das Schema, das LLM-Assessment übernimmt es exakt.

## Kategorienschema

### Bewertungskategorien (10 binär)

| Kategorie | Definition | Typ |
|-----------|------------|-----|
| AI_Literacies | Behandelt Kompetenzen im Umgang mit KI-Systemen | Ja/Nein |
| Generative_KI | Fokus auf generative KI-Modelle (LLMs, Bildgeneratoren) | Ja/Nein |
| Prompting | Behandelt Prompt-Strategien oder -Techniken | Ja/Nein |
| KI_Sonstige | Andere KI-Themen (ML, Robotik, etc.) | Ja/Nein |
| Soziale_Arbeit | Bezug zu sozialarbeiterischer Praxis oder Theorie | Ja/Nein |
| Bias_Ungleichheit | Thematisiert Diskriminierung, Bias oder Ungleichheit | Ja/Nein |
| Gender | Expliziter Gender-Fokus | Ja/Nein |
| Diversitaet | Thematisiert Diversität oder Inklusion | Ja/Nein |
| Feministisch | Verwendet feministische Theorie oder Methodik | Ja/Nein |
| Fairness | Thematisiert algorithmische Fairness | Ja/Nein |

### Entscheidung

| Feld | Optionen |
|------|----------|
| Decision | Include, Exclude, Unclear |
| Exclusion_Reason | Duplicate, Off-topic, No full text, Language, Other |
| Studientyp | Experimentell, Theoretisch, Review, Konzept, Empirisch |

### Konfigurationsdatei

Die Kategorien werden in einer YAML-Datei definiert, die vom LLM-Assessment-Prompt gelesen wird. Dies ermöglicht Anpassungen nach dem Meeting mit Susi/Sabine.

**Datei:** `benchmark/config/categories.yaml`

## Datenformate

### Human-Assessment (Input)

Export aus Google Sheets als CSV:

| Spalte | Typ | Beispiel |
|--------|-----|----------|
| ID | Integer | 115 |
| Zotero_Key | String | Z4YXX9PZ |
| Author_Year | String | Kamruzzaman (2024) |
| Title | String | Prompting techniques... |
| DOI | String | 10.48550/arXiv.2404.17218 |
| Abstract | Text | Study evaluates... |
| AI_Literacies | Ja/Nein | Ja |
| ... | ... | ... |
| Decision | String | Include |
| Exclusion_Reason | String | — |

### LLM-Assessment (Output)

Identisches Schema, generiert durch LLM-Prompt:

| Spalte | Typ | Quelle |
|--------|-----|--------|
| ID | Integer | Übernommen |
| Zotero_Key | String | Übernommen |
| AI_Literacies | Ja/Nein | LLM-Bewertung |
| ... | ... | ... |
| Decision | String | LLM-Bewertung |
| LLM_Confidence | Float (0-1) | LLM-Output |
| LLM_Reasoning | Text | LLM-Output |

### Merged Comparison (Analyse)

Zusammengeführter Datensatz für Vergleich:

| Spalte | Beschreibung |
|--------|--------------|
| paper_id | Eindeutige ID |
| human_decision | Include/Exclude/Unclear |
| llm_decision | Include/Exclude/Unclear |
| human_AI_Literacies | Ja/Nein |
| llm_AI_Literacies | Ja/Nein |
| ... | Weitere Kategorien |
| agreement_decision | TRUE/FALSE |
| agreement_categories | Anzahl übereinstimmender Kategorien |

## Repository-Struktur

| Verzeichnis | Inhalt |
|-------------|--------|
| `benchmark/config/` | Kategorie-Definitionen (categories.yaml) |
| `benchmark/data/` | Assessment-Daten (human, llm, merged) |
| `benchmark/prompts/` | LLM-Assessment-Prompt |
| `benchmark/scripts/` | Python-Scripts (run, merge, calculate, analyze) |
| `benchmark/results/` | Ergebnisse (metrics, disagreements, figures) |

## Workflow

### Phase 1: Human-Assessment (aktuell laufend)

1. Susi und Sabine bewerten 303 Papers via Google Sheets
2. Bei Uneinigkeit: Diskussion und Konsens-Entscheidung
3. Export als CSV → `benchmark/data/human_assessment.csv`

### Phase 2: LLM-Assessment (nach Human-Abschluss)

1. Kategorie-Definitionen finalisieren in `categories.yaml`
2. Assessment-Prompt generieren aus YAML
3. LLM-Assessment ausfuehren mit `run_llm_assessment.py`
   - Input: Paper-CSV, Config-YAML
   - Output: LLM-Assessment-CSV

### Phase 3: Vergleichsanalyse

1. **Daten zusammenfuehren:** `merge_assessments.py` kombiniert Human- und LLM-Assessment
2. **Metriken berechnen:** `calculate_agreement.py` berechnet Cohen's Kappa und Agreement-Statistiken
3. **Disagreements analysieren:** `analyze_disagreements.py` identifiziert Divergenz-Faelle

Alle Scripts in `benchmark/scripts/`, Parameter via `--help`.

## Metriken

### Quantitative Metriken

| Metrik | Beschreibung | Interpretation |
|--------|--------------|----------------|
| Overall Agreement | Prozent übereinstimmende Decisions | Basismaß |
| Cohen's Kappa | Zufallskorrigierte Übereinstimmung | <0.4 schlecht, 0.4-0.6 moderat, >0.6 gut |
| Category Agreement | Übereinstimmung pro Kategorie | Wo funktioniert LLM gut/schlecht? |
| Confusion Matrix | 2x2 (Human × LLM) | Systematische Verzerrungen |

### Erwartete Outputs

Die Datei `agreement_metrics.json` enthaelt:
- **n_papers**: Anzahl analysierter Papers (z.B. 303)
- **overall_agreement**: Prozent Uebereinstimmung (z.B. 0.78)
- **cohens_kappa**: Zufallskorrigierte Uebereinstimmung (z.B. 0.65)
- **by_category**: Agreement pro Kategorie (AI_Literacies, Feministisch, Soziale_Arbeit, etc.)
- **confusion_matrix**: 2x2-Matrix Human x LLM (include/exclude Kombinationen)

### Qualitative Analyse

Für das Paper: 5-10 Disagreement-Fälle mit Interpretation

| Typ | Beschreibung | Beispiel |
|-----|--------------|----------|
| LLM Include, Human Exclude | LLM erkennt Keywords, übersieht Kontext | Paper mit "AI" im Titel, aber off-topic |
| Human Include, LLM Exclude | LLM versteht implizite Relevanz nicht | Intersektionaler Ansatz ohne "feminist" |

## Visualisierungen für Paper

1. **Konfusionsmatrix** (Heatmap): Human × LLM Decision
2. **Barplot**: Agreement pro Kategorie
3. **Tabelle**: 3-5 annotierte Disagreement-Beispiele

## Offene Entscheidungen

| Frage | Status | Entscheidungsträger |
|-------|--------|---------------------|
| Finale Kategorie-Definitionen | Meeting mit Susi | Susi, Sabine |
| Include-Kriterien (wie viele Kategorien?) | Offen | Team |
| LLM-Modell (Claude Haiku oder andere?) | Vorschlag: Haiku 4.5 | Christopher |

## Kategorie-Definitionen (Entwurf)

Die vollstaendige Konfiguration befindet sich in `benchmark/config/categories.yaml`.

### Technik-Kategorien (4)

| Kategorie | Definition | Beispiel positiv | Beispiel negativ |
|-----------|------------|------------------|------------------|
| AI_Literacies | Kompetenzen, Faehigkeiten oder Wissen im Umgang mit KI-Systemen. Umfasst kritische Reflexion, technisches Verstaendnis oder praktische Anwendungskompetenz. | Framework fuer KI-Kompetenzentwicklung, Curriculum fuer AI Literacy in Schulen | Rein technische KI-Implementierung ohne Bildungsbezug |
| Generative_KI | Fokus auf generative KI-Modelle wie LLMs, Bildgeneratoren oder andere generative Systeme | ChatGPT-Studie, DALL-E Analyse | Klassische ML-Klassifikation |
| Prompting | Prompt-Engineering, Prompt-Strategien oder die Gestaltung von Eingaben fuer KI-Systeme | Chain-of-Thought Prompting, Jailbreak-Analyse | Allgemeine LLM-Nutzung ohne Prompt-Fokus |
| KI_Sonstige | Andere KI-Themen (klassisches ML, Robotik, Computer Vision ohne generativen Fokus) | Predictive Analytics in Sozialarbeit, Risikobewertungsalgorithmen | - |

### Sozial-Kategorien (6)

| Kategorie | Definition | Beispiel positiv | Beispiel negativ |
|-----------|------------|------------------|------------------|
| Soziale_Arbeit | Direkter Bezug zu sozialarbeiterischer Praxis, Theorie, Ausbildung oder den Zielgruppen Sozialer Arbeit | KI in der Jugendhilfe, Sozialarbeit-Curriculum | Allgemeine Bildungsforschung |
| Bias_Ungleichheit | Thematisiert Diskriminierung, algorithmischen Bias, soziale Ungleichheit oder strukturelle Benachteiligung im KI-Kontext | Bias-Audit von Gesichtserkennungssystemen | Technische Fairness-Metrik ohne Diskriminierungsbezug |
| Gender | Expliziter Gender-Fokus, Geschlechterperspektive oder Analyse von Gender-Bias | Gender-Bias in Sprachmodellen | Allgemeine Diversity-Studie |
| Diversitaet | Thematisiert Diversitaet, Inklusion oder Repraesentation verschiedener Gruppen | Repraesentation marginalisierter Gruppen in Trainingsdaten | - |
| Feministisch | Verwendet explizit feministische Theorie, Methodik oder Perspektive. Bezugnahme auf feministische Autor:innen oder Konzepte. | Intersektionale Analyse nach Crenshaw, Kritik aus feministischer Technikforschung | Gender erwaehnt, aber ohne feministische Rahmung |
| Fairness | Thematisiert algorithmische Fairness, faire ML-Systeme oder Fairness-Metriken | Equalized Odds Implementierung, Fairness-aware ML | - |

### Inklusions-Kriterien

Paper wird eingeschlossen, wenn mindestens zwei Kriterien erfuellt sind UND Relevanz fuer die Forschungsfrage besteht:
1. AI_Literacies ODER Generative_KI ODER Prompting
2. Feministisch ODER Gender ODER Bias_Ungleichheit
3. Soziale_Arbeit

### Exclusion Reasons

Duplicate, Off-topic, No_full_text, Language_not_accessible, Other

## Verbindung zu anderen Dokumenten

- [[Forum Wissenschaft Paper - Arbeitsplan]]: Paper-Kontext und Deadline
- [[Literature Review Pipeline - Technische Dokumentation]]: Bestehende Pipeline
- [[FemPrompt-SozArb MOC]]: Projekt-Navigation
- [[Workflow für eine Deep-Research-gestützte Literaturanalyse am Beispiel von feministischem AI-Literacy]]: Methodendokument

## Related

- [[SocialAI MOC]]
- [[Promptotyping MOC]]
- [[Critical-Expert-in-the-Loop]]
