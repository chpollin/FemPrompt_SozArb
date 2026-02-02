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

```
FemPrompt_SozArb/
├── benchmark/
│   ├── README.md                    # Diese Dokumentation
│   ├── config/
│   │   └── categories.yaml          # Kategorie-Definitionen
│   ├── data/
│   │   ├── human_assessment.csv     # Export Google Sheets
│   │   ├── llm_assessment.csv       # LLM-Output
│   │   └── merged_comparison.csv    # Zusammengeführt
│   ├── prompts/
│   │   └── assessment_prompt.md     # LLM-Assessment-Prompt
│   ├── scripts/
│   │   ├── run_llm_assessment.py    # LLM-Assessment ausführen
│   │   ├── merge_assessments.py     # Daten zusammenführen
│   │   ├── calculate_agreement.py   # Metriken berechnen
│   │   └── analyze_disagreements.py # Qualitative Analyse
│   └── results/
│       ├── agreement_metrics.json   # Quantitative Ergebnisse
│       ├── disagreement_cases.csv   # Divergenz-Fälle
│       └── figures/                 # Visualisierungen
```

## Workflow

### Phase 1: Human-Assessment (aktuell laufend)

1. Susi und Sabine bewerten 303 Papers via Google Sheets
2. Bei Uneinigkeit: Diskussion und Konsens-Entscheidung
3. Export als CSV → `benchmark/data/human_assessment.csv`

### Phase 2: LLM-Assessment (nach Human-Abschluss)

1. Kategorie-Definitionen finalisieren → `categories.yaml`
2. Assessment-Prompt generieren aus YAML
3. LLM-Assessment ausführen:
   ```bash
   python benchmark/scripts/run_llm_assessment.py \
     --input assessment/femprompt_papers.csv \
     --config benchmark/config/categories.yaml \
     --output benchmark/data/llm_assessment.csv
   ```

### Phase 3: Vergleichsanalyse

1. Daten zusammenführen:
   ```bash
   python benchmark/scripts/merge_assessments.py \
     --human benchmark/data/human_assessment.csv \
     --llm benchmark/data/llm_assessment.csv \
     --output benchmark/data/merged_comparison.csv
   ```

2. Metriken berechnen:
   ```bash
   python benchmark/scripts/calculate_agreement.py \
     --input benchmark/data/merged_comparison.csv \
     --output benchmark/results/agreement_metrics.json
   ```

3. Disagreements analysieren:
   ```bash
   python benchmark/scripts/analyze_disagreements.py \
     --input benchmark/data/merged_comparison.csv \
     --output benchmark/results/disagreement_cases.csv
   ```

## Metriken

### Quantitative Metriken

| Metrik | Beschreibung | Interpretation |
|--------|--------------|----------------|
| Overall Agreement | Prozent übereinstimmende Decisions | Basismaß |
| Cohen's Kappa | Zufallskorrigierte Übereinstimmung | <0.4 schlecht, 0.4-0.6 moderat, >0.6 gut |
| Category Agreement | Übereinstimmung pro Kategorie | Wo funktioniert LLM gut/schlecht? |
| Confusion Matrix | 2x2 (Human × LLM) | Systematische Verzerrungen |

### Erwartete Outputs

**agreement_metrics.json:**

```json
{
  "n_papers": 303,
  "overall_agreement": 0.78,
  "cohens_kappa": 0.65,
  "by_category": {
    "AI_Literacies": { "n": 303, "agreement": 0.85 },
    "Feministisch": { "n": 303, "agreement": 0.62 },
    "Soziale_Arbeit": { "n": 303, "agreement": 0.71 }
  },
  "confusion_matrix": {
    "human_include_llm_include": 156,
    "human_include_llm_exclude": 23,
    "human_exclude_llm_include": 41,
    "human_exclude_llm_exclude": 83
  }
}
```

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

## categories.yaml (Entwurf)

```yaml
# FemPrompt Assessment Categories
# Version: 1.0 (Draft - pending review with Susi/Sabine)

metadata:
  project: FemPrompt Literature Review
  last_updated: 2026-02-02
  status: draft

categories:
  - name: AI_Literacies
    definition: >
      Das Paper behandelt Kompetenzen, Fähigkeiten oder Wissen im Umgang
      mit KI-Systemen. Umfasst kritische Reflexion, technisches Verständnis
      oder praktische Anwendungskompetenz.
    type: binary
    examples_positive:
      - "Framework für KI-Kompetenzentwicklung"
      - "Curriculum für AI Literacy in Schulen"
    examples_negative:
      - "Rein technische KI-Implementierung ohne Bildungsbezug"

  - name: Generative_KI
    definition: >
      Fokus auf generative KI-Modelle wie Large Language Models,
      Bildgeneratoren oder andere generative Systeme.
    type: binary

  - name: Prompting
    definition: >
      Behandelt Prompt-Engineering, Prompt-Strategien oder die Gestaltung
      von Eingaben für KI-Systeme.
    type: binary

  - name: KI_Sonstige
    definition: >
      Andere KI-Themen, die nicht in die obigen Kategorien fallen
      (klassisches ML, Robotik, Computer Vision ohne generativen Fokus).
    type: binary

  - name: Soziale_Arbeit
    definition: >
      Direkter Bezug zu sozialarbeiterischer Praxis, Theorie, Ausbildung
      oder den Zielgruppen Sozialer Arbeit.
    type: binary

  - name: Bias_Ungleichheit
    definition: >
      Thematisiert Diskriminierung, algorithmischen Bias, soziale Ungleichheit
      oder strukturelle Benachteiligung im KI-Kontext.
    type: binary

  - name: Gender
    definition: >
      Expliziter Gender-Fokus, Geschlechterperspektive oder
      Analyse von Gender-Bias.
    type: binary

  - name: Diversitaet
    definition: >
      Thematisiert Diversität, Inklusion oder Repräsentation
      verschiedener Gruppen.
    type: binary

  - name: Feministisch
    definition: >
      Verwendet explizit feministische Theorie, Methodik oder Perspektive.
      Bezugnahme auf feministische Autor:innen oder Konzepte.
    type: binary
    examples_positive:
      - "Intersektionale Analyse nach Crenshaw"
      - "Kritik aus feministischer Technikforschung"
    examples_negative:
      - "Gender erwähnt, aber ohne feministische Rahmung"

  - name: Fairness
    definition: >
      Thematisiert algorithmische Fairness, faire ML-Systeme
      oder Fairness-Metriken.
    type: binary

decision:
  field: Decision
  options:
    - Include
    - Exclude
    - Unclear
  include_criteria: >
    Paper wird eingeschlossen, wenn es mindestens zwei der folgenden
    Kriterien erfüllt UND für die Forschungsfrage relevant ist:
    (1) AI_Literacies ODER Generative_KI ODER Prompting
    (2) Feministisch ODER Gender ODER Bias_Ungleichheit
    (3) Soziale_Arbeit

exclusion_reasons:
  - Duplicate
  - Off-topic
  - No_full_text
  - Language_not_accessible
  - Other
```

## Verbindung zu anderen Dokumenten

- [[Forum Wissenschaft Paper - Arbeitsplan]]: Paper-Kontext und Deadline
- [[Literature Review Pipeline - Technische Dokumentation]]: Bestehende Pipeline
- [[FemPrompt-SozArb MOC]]: Projekt-Navigation
- [[Workflow für eine Deep-Research-gestützte Literaturanalyse am Beispiel von feministischem AI-Literacy]]: Methodendokument

## Related

- [[SocialAI MOC]]
- [[Promptotyping MOC]]
- [[Critical-Expert-in-the-Loop]]
