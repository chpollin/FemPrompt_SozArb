# Literature Review: AI Literacy & Bias in Social Work

Systematischer Literature Review zu **AI Literacy** und **LLM-Bias** (Gender, Race, Intersektionalitaet) im Kontext Sozialer Arbeit.

Teil des [Social AI Projekts](https://socialai.2aw.at/).

---

## Projektziel

**Primaer:** Empirische Grundlage schaffen fuer Forschung zu diskriminierungssensiblem Prompting.

**Sekundaer:** Methodische Innovation dokumentieren - LLM-gestuetztes Assessment im Vergleich zu Expert:innen-Bewertung.

---

## Forschungsfragen

1. Wie manifestiert sich Bias in Frontier-LLMs kontextabhaengig?
2. Welche Prompt-Strategien ermoeglichen diskriminierungssensible KI-Nutzung?
3. Wie koennen Sozialarbeitende AI-Literacy entwickeln?

---

## Korpus

**326 Papers** aus Zotero, zwei parallele Assessment-Tracks:

| Track | Methode | Schema | Status |
|-------|---------|--------|--------|
| **Human** | Google Sheets | 10 binaere Kategorien | In Arbeit |
| **LLM** | Claude Haiku 4.5 | 5 Dimensionen (0-3) | Fertig |

---

## Repository-Struktur

```
├── corpus/                    # Korpus-Metadaten
│   ├── zotero_export.json
│   └── papers_metadata.csv
│
├── assessment/                # Human Assessment Tools
│   ├── create_thematic_assessment.py
│   └── excel_to_zotero_tags.py
│
├── assessment-llm/            # LLM Assessment
│   ├── assess_papers.py       # Claude Haiku Pipeline
│   ├── prompt_template.md     # 5-Dimensionen Schema
│   └── output/                # Ergebnisse
│
├── benchmark/                 # Human vs. LLM Vergleich
│   ├── config/categories.yaml # 10-Kategorien Schema
│   ├── scripts/               # Analyse-Skripte
│   └── data/                  # Assessment-Daten
│
├── pipeline/                  # PDF → Markdown → Knowledge
│   ├── scripts/               # Python-Scripts
│   ├── tools/                 # Browser-Tools
│   ├── pdfs/                  # 257 PDFs
│   ├── markdown/              # 252 Markdown-Dateien
│   ├── markdown_clean/        # Bereinigte Markdowns
│   ├── knowledge/distilled/   # 249 destillierte Wissensdokumente
│   └── validation_reports/    # Validierungsberichte
│
├── config/                    # Konfiguration
│   └── defaults.yaml
│
├── vault/                     # Obsidian Vault (Output)
│
└── knowledge/                 # Dokumentation
```

---

## Aktueller Stand

### Assessment

| Track | Status | Details |
|-------|--------|---------|
| Human | In Arbeit | Google Sheets (Susi, Sabine) |
| LLM | Fertig | 325 Papers, 100% Erfolgsrate |

### Pipeline

| Schritt | Status | Details |
|---------|--------|---------|
| PDF-Download | Fertig | 257 PDFs |
| Markdown-Konversion | Fertig | 252 (98.1%) |
| Validierung | Fertig | 98.7 Konfidenz-Score |
| Knowledge Distillation | Fertig | 249/252 (98.8%) |
| Vault-Generierung | Wartet | - |

### Benchmark

Wartet auf Abschluss des Human-Assessments.

---

## Assessment-Schemas

### Human Assessment (10 binaere Kategorien)

| Kategorie | Gruppe |
|-----------|--------|
| AI_Literacies | Technik |
| Generative_KI | Technik |
| Prompting | Technik |
| KI_Sonstige | Technik |
| Soziale_Arbeit | Sozial |
| Bias_Ungleichheit | Sozial |
| Gender | Sozial |
| Diversitaet | Sozial |
| Feministisch | Sozial |
| Fairness | Sozial |

**Inklusions-Logik:** `(Technik >= 1) AND (Sozial >= 1) → Include`

### LLM Assessment (5 Dimensionen, 0-3)

| Dimension | Beschreibung |
|-----------|--------------|
| AI_Komp | AI/LLM-Kompetenzen |
| Vulnerable | Vulnerable Gruppen & Digital Equity |
| Bias | Algorithmische Verzerrungen |
| Praxis | Praktische Implementation |
| Prof | Professioneller Kontext (Soziale Arbeit) |

---

## Team

| Person | Rolle |
|--------|-------|
| Susi Sackl-Sharif | Human-Assessment, Forschungsleitung |
| Sabine Klinger | Human-Assessment |
| Christopher Pollin | Technische Umsetzung |
| Christina | Zotero-Kuratierung |
| Christian Steiner | Paper-Review |

---

## Paper

**Forum Wissenschaft 2/2026**
- Deadline: 4. Mai 2026
- Umfang: 18.000 Zeichen
- Fokus: LLM-gestuetzter Literature Review im Praxistest

---

## Dokumentation

| Dokument | Inhalt |
|----------|--------|
| [01-project.md](knowledge/01-project.md) | Projektziel, Zielgruppe |
| [02-methodology.md](knowledge/02-methodology.md) | PRISMA, Assessment-Schema |
| [03-status.md](knowledge/03-status.md) | Aktueller Stand |
| [04-technical.md](knowledge/04-technical.md) | Pipeline-Architektur |

---

*Aktualisiert: 2026-02-06*
