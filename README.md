# FemPrompt: Human vs. Agent Literature Review

Vergleich zwischen menschlichem Expert:innen-Assessment und LLM-basiertem Agent-Workflow
für systematische Literature Reviews zu feministischer AI Literacy.

---

## Forschungsfrage

> Wie reliabel ist LLM-basiertes Literatur-Assessment im Vergleich zu Expert:innen-Bewertung
> bei einem interdisziplinären, feministisch-technischen Forschungsfeld?

**Paper:** Forum Wissenschaft 2/2026 (Deadline: 4. Mai 2026)

---

## Repository-Struktur

```
FemPrompt_SozArb/
├── corpus/                    # EIN Korpus (326 Papers)
│   ├── zotero_export.json
│   └── papers_metadata.csv
│
├── assessment/
│   ├── human/                 # Track 1: Human Expert
│   │   ├── schema.yaml
│   │   └── results/
│   │
│   └── agent/                 # Track 2: Agent Workflow
│       ├── config.yaml
│       ├── run_assessment.py
│       └── results/
│
├── benchmark/                 # Vergleich Human vs. Agent
│   ├── scripts/
│   │   ├── merge_assessments.py
│   │   ├── calculate_agreement.py
│   │   └── analyze_disagreements.py
│   └── results/
│
├── pipeline/                  # PDF → Markdown → Summary → Vault
│   ├── scripts/
│   ├── pdfs/
│   ├── markdown/
│   └── summaries/
│
├── vault/                     # EIN Obsidian Vault
│   └── MOCs/
│
└── knowledge/                 # Dokumentation
```

---

## Quick Start

### 1. Human Assessment

```bash
# Google Sheets exportieren nach:
assessment/human/results/assessment_YYYYMMDD.csv
```

### 2. Agent Assessment

```bash
python assessment/agent/run_assessment.py \
  --input corpus/papers_metadata.csv \
  --output assessment/agent/results/assessment_$(date +%Y%m%d).csv
```

### 3. Benchmark

```bash
# Assessments zusammenführen
python benchmark/scripts/merge_assessments.py \
  --human assessment/human/results/latest.csv \
  --agent assessment/agent/results/latest.csv \
  --output benchmark/data/merged_comparison.csv

# Agreement berechnen
python benchmark/scripts/calculate_agreement.py \
  --input benchmark/data/merged_comparison.csv \
  --output benchmark/results/

# Disagreements analysieren
python benchmark/scripts/analyze_disagreements.py \
  --input benchmark/data/merged_comparison.csv \
  --output benchmark/results/disagreement_cases.csv
```

---

## Assessment-Schema

Beide Tracks verwenden identisches 10-Kategorien-Schema:

| Kategorie | Typ | Gruppe |
|-----------|-----|--------|
| AI_Literacies | binär | Technik |
| Generative_KI | binär | Technik |
| Prompting | binär | Technik |
| KI_Sonstige | binär | Technik |
| Soziale_Arbeit | binär | Sozial |
| Bias_Ungleichheit | binär | Sozial |
| Gender | binär | Sozial |
| Diversitaet | binär | Sozial |
| Feministisch | binär | Sozial |
| Fairness | binär | Sozial |

**Inklusions-Logik:** `(Technik >= 1) AND (Sozial >= 1) → Include`

---

## Team

| Person | Rolle |
|--------|-------|
| Susi Sackl-Sharif | Human Expert Assessment |
| Sabine Klinger | Human Expert Assessment |
| Christopher Pollin | Technische Umsetzung |
| Christina | Zotero-Kuratierung |
| Christian Steiner | Paper-Review |

---

## Dokumentation

Vollständige Dokumentation: [`knowledge/`](knowledge/)

- [index.md](knowledge/index.md) - Dokumentations-Einstieg
- [02-methodology.md](knowledge/02-methodology.md) - PRISMA 2020, Assessment-Schema
- [04-technical.md](knowledge/04-technical.md) - Pipeline-Architektur

---

*Version: 2.0 (Human vs. Agent Restructure)*
*Erstellt: 2026-02-02*
