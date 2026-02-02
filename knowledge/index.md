# FemPrompt - Dokumentations-Index

Literature Research Pipeline: Human Expert vs. Agent Workflow Benchmark.

---

## Aktuelle Phase (Februar 2026)

| Track | Methode | Status |
|-------|---------|--------|
| Human Expert | Manuelles Assessment (Susi, Sabine) | In Arbeit |
| Agent Workflow | LLM-basiert (Claude Haiku 4.5) | Bereit |
| Benchmark | Vergleich Human vs. Agent | Pending |

**Paper:** Forum Wissenschaft 2/2026 (Deadline: 4. Mai 2026)
**Korpus:** 326 Papers (Zotero Group 6080294)

---

## Dokumentation

### Kern-Dokumente

| Datei | Inhalt |
|-------|--------|
| [01-project.md](01-project.md) | Forschungsfrage, Team, Theoretischer Rahmen |
| [02-methodology.md](02-methodology.md) | PRISMA 2020, 10-Kategorien-Schema, Benchmark |
| [03-status.md](03-status.md) | Aktueller Stand, offene Punkte |
| [04-technical.md](04-technical.md) | Pipeline-Architektur, Scripts, Kosten |

### Anleitungen

| Datei | Inhalt |
|-------|--------|
| [guides/quickstart.md](guides/quickstart.md) | 10-Minuten-Einstieg |
| [guides/llm-assessment.md](guides/llm-assessment.md) | LLM-basiertes PRISMA-Assessment |
| [guides/pdf-acquisition.md](guides/pdf-acquisition.md) | Hierarchische PDF-Akquise |

### Paper-Materialien

| Datei | Inhalt |
|-------|--------|
| [paper/Forum Wissenschaft Paper - Arbeitsplan.md](paper/Forum%20Wissenschaft%20Paper%20-%20Arbeitsplan.md) | Paper-Gliederung und Zeitplan |
| [paper/Human-LLM Assessment Benchmark.md](paper/Human-LLM%20Assessment%20Benchmark.md) | Benchmark-Spezifikation |

### Archiv

| Datei | Inhalt |
|-------|--------|
| [archive/journal-2025-11.md](archive/journal-2025-11.md) | Entwicklungsgeschichte November 2025 |

---

## Repository-Struktur

```
FemPrompt_SozArb/
  corpus/                  # EIN Korpus (326 Papers)
    zotero_export.json
    papers_metadata.csv
  assessment/
    human/                 # Track 1: Human Expert
    agent/                 # Track 2: Agent Workflow
  benchmark/               # Vergleich Human vs. Agent
    scripts/
    data/
    results/
  pipeline/                # PDF -> Markdown -> Summary -> Vault
    scripts/
    pdfs/
    markdown/
    summaries/
  vault/                   # EIN Obsidian Vault
  knowledge/               # Dokumentation (dieses Verzeichnis)
```

---

## Quick Links

**Assessment:**
```bash
python assessment/agent/run_assessment.py   # Agent Assessment
# Human Assessment: Google Sheets exportieren
```

**Pipeline:**
```bash
python pipeline/scripts/acquire_pdfs.py     # PDF-Akquise
python pipeline/scripts/convert_to_markdown.py
python pipeline/scripts/summarize_documents.py
python pipeline/scripts/generate_vault.py
```

**Benchmark:**
```bash
python benchmark/scripts/merge_assessments.py
python benchmark/scripts/calculate_agreement.py
python benchmark/scripts/analyze_disagreements.py
```

**Repository:** [github.com/chpollin/FemPrompt_SozArb](https://github.com/chpollin/FemPrompt_SozArb)

**Google Sheets:** [Thematisches Assessment](https://docs.google.com/spreadsheets/d/1z-HQSwVFg-TtdP0xo1UH4GKLMAXNvvXSdySPSA7KUdM/)

---

## Forschungsfragen

1. Wie manifestiert sich Bias in Frontier-LLMs kontextabhaengig?
2. Welche Prompt-Strategien ermoeglichen diskriminierungssensible KI-Nutzung?
3. Wie koennen Sozialarbeitende AI-Literacy entwickeln, die der Systemkomplexitaet gerecht wird?

---

## Team

| Person | Rolle |
|--------|-------|
| Susi Sackl-Sharif | Human-Assessment, Kategorien |
| Sabine Klinger | Human-Assessment |
| Christopher Pollin | Technische Umsetzung |
| Christina | Zotero-Kuratierung |
| Christian Steiner | Paper-Review |

---

*Version: 2.0 (2026-02-02) - Human vs. Agent Restructure*
