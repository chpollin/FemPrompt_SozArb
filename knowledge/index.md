# FemPrompt/SozArb - Dokumentations-Index

Literature Research Pipeline fuer feministisches AI-Literacy und Soziale Arbeit.

---

## Aktuelle Phase (Februar 2026)

| Projekt | Status | Naechster Schritt |
|---------|--------|-------------------|
| FemPrompt | Thematisches Assessment | Human-Assessment abschliessen |
| SozArb | Pausiert | Vault operativ (266 Papers) |

**Paper:** Forum Wissenschaft 2/2026 (Deadline: 4. Mai 2026)

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

## Verzeichnisstruktur

```
knowledge/
  index.md                 # Dieser Einstiegspunkt
  01-project.md            # Projekt + Theorie
  02-methodology.md        # Methodik + PRISMA
  03-status.md             # Aktueller Stand
  04-technical.md          # Technische Referenz
  guides/                  # Anleitungen
    quickstart.md
    llm-assessment.md
    pdf-acquisition.md
  paper/                   # Paper-Materialien
  archive/                 # Historische Dokumente
```

---

## Quick Links

**Ausfuehrung:**
```bash
python run_pipeline.py                    # Komplette Pipeline
python assessment-llm/assess_papers.py   # LLM-Assessment
python analysis/getPDF_intelligent.py    # PDF-Akquise
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

*Version: 1.0 (2026-02-02)*
