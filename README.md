# FemPrompt: Feminist AI Literacy Literature Review

Systematischer Literature Review zu **feministischer AI Literacy** und **LLM-Bias** (Gender, Race, Intersektionalitaet) im Kontext Sozialer Arbeit.

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

## Zielgruppe

| Zielgruppe | Nutzen |
|------------|--------|
| Forscher:innen (Soziale Arbeit + KI) | Strukturierte Literaturuebersicht |
| Praktiker:innen (Soziale Arbeit) | Evidenzbasis fuer LLM-Nutzung |
| Lehrende (AI Literacy) | Kursmaterial, Konzepte |

---

## Erfolgskriterien

| Kriterium | Status |
|-----------|--------|
| Literature Review (326 Papers kategorisiert) | 🔄 In Arbeit |
| Paper eingereicht (Forum Wissenschaft, 4. Mai 2026) | ⏸️ Wartet |
| Benchmark Human vs. Agent | ⏸️ Wartet |
| Obsidian Vault nutzbar | ⏸️ Wartet |

---

## Nicht-Ziele

- ❌ Fertiger Prompting-Leitfaden (nachgelagerte Phase)
- ❌ Tool fuer Endnutzer:innen
- ❌ Vollstaendige Automatisierung
- ❌ Training eigener Modelle

---

## Repository-Struktur

```
FemPrompt_SozArb/
├── corpus/                    # Korpus (326 Papers)
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
│   ├── tools/                # Browser-Tools (markdown_reviewer.html)
│   ├── pdfs/                 # 234 PDFs
│   ├── pdf_images/           # JPG-Seiten fuer Sync-Scroll (~4000 Bilder)
│   ├── markdown/             # 232 konvertierte Markdown-Dateien
│   ├── markdown_clean/       # Post-processed Markdown
│   ├── validation_reports/   # Validierungsberichte
│   └── summaries/
│
├── vault/                     # Obsidian Vault
│   └── MOCs/
│
└── knowledge/                 # Dokumentation
```

---

## Aktueller Stand

### Pipeline Phase 1: Datenakquise ✅

| Schritt | Status |
|---------|--------|
| PDF-Download | 234 PDFs |
| Markdown-Konversion | 232 (99.1%) |
| Validierung | 98.7 Konfidenz-Score |
| Review-Tool | Browser-basiert mit Sync-Scroll |

### Pipeline Phase 2: Assessment 🔄

| Track | Status |
|-------|--------|
| Human (Susi, Sabine) | In Arbeit |
| Agent (Claude Haiku) | Bereit |

### Pipeline Phase 3-4: Benchmark & Synthese ⏸️

Wartet auf Abschluss des Human-Assessments.

---

## Quick Start

### Assessment

```bash
# Agent Assessment
python assessment/agent/run_assessment.py \
  --input corpus/papers_metadata.csv \
  --output assessment/agent/results/

# Human Assessment: Google Sheets exportieren nach
# assessment/human/results/
```

### Benchmark

```bash
python benchmark/scripts/merge_assessments.py
python benchmark/scripts/calculate_agreement.py
python benchmark/scripts/analyze_disagreements.py
```

---

## Assessment-Schema

10 binaere Kategorien:

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

## Dokumentation

Vollstaendige Dokumentation: [`knowledge/`](knowledge/)

| Dokument | Inhalt |
|----------|--------|
| [01-project.md](knowledge/01-project.md) | Projektziel, Zielgruppe, Erfolgskriterien |
| [02-methodology.md](knowledge/02-methodology.md) | PRISMA 2020, Assessment-Schema |
| [03-status.md](knowledge/03-status.md) | Aktueller Stand |
| [04-technical.md](knowledge/04-technical.md) | Pipeline-Architektur |

---

## Paper

**Forum Wissenschaft 2/2026**
- Deadline: 4. Mai 2026
- Umfang: 18.000 Zeichen
- Fokus: LLM-gestuetzter Literature Review im Praxistest

---

*Version: 3.0 (2026-02-03)*
