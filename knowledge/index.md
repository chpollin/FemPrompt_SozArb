# FemPrompt - Dokumentations-Index

Systematischer Literature Review zu **feministischer AI Literacy** und **LLM-Bias** im Kontext Sozialer Arbeit.

---

## Projektziel

**Primaer:** Empirische Grundlage schaffen fuer Forschung zu diskriminierungssensiblem Prompting.

**Sekundaer:** Methodische Innovation dokumentieren (Human vs. Agent Assessment Benchmark).

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
| Literature Review (326 Papers) | 🔄 In Arbeit |
| Paper eingereicht (4. Mai 2026) | ⏸️ Wartet |
| Benchmark Human vs. Agent | ⏸️ Wartet |
| Obsidian Vault | ⏸️ Wartet |

---

## Nicht-Ziele

- ❌ Fertiger Prompting-Leitfaden
- ❌ Tool fuer Endnutzer:innen
- ❌ Vollstaendige Automatisierung

---

## Aktuelle Phase (Februar 2026)

| Track | Methode | Status |
|-------|---------|--------|
| Human Expert | Manuelles Assessment (Susi, Sabine) | 🔄 In Arbeit |
| Agent Workflow | LLM-basiert (Claude Haiku 4.5) | ⏸️ Bereit |
| Benchmark | Vergleich Human vs. Agent | ⏸️ Pending |

**Paper:** Forum Wissenschaft 2/2026 (Deadline: 4. Mai 2026)

---

## Dokumentation

### Kern-Dokumente

| Datei | Inhalt |
|-------|--------|
| [01-project.md](01-project.md) | Projektziel, Zielgruppe, Erfolgskriterien, Nicht-Ziele |
| [02-methodology.md](02-methodology.md) | PRISMA 2020, 10-Kategorien-Schema, Benchmark |
| [03-status.md](03-status.md) | Aktueller Stand, offene Punkte |
| [04-technical.md](04-technical.md) | Pipeline-Architektur, Scripts, Kosten |

### Anleitungen

| Datei | Inhalt |
|-------|--------|
| [guides/quickstart.md](guides/quickstart.md) | 10-Minuten-Einstieg |
| [guides/llm-assessment.md](guides/llm-assessment.md) | LLM-basiertes PRISMA-Assessment |
| [guides/pdf-acquisition.md](guides/pdf-acquisition.md) | Hierarchische PDF-Akquise |
| [guides/manual-review-checklist.md](guides/manual-review-checklist.md) | Markdown-Review Checkliste |

### Paper-Materialien

| Datei | Inhalt |
|-------|--------|
| [paper/Forum Wissenschaft Paper - Arbeitsplan.md](paper/Forum%20Wissenschaft%20Paper%20-%20Arbeitsplan.md) | Paper-Gliederung und Roadmap |
| [paper/Human-LLM Assessment Benchmark.md](paper/Human-LLM%20Assessment%20Benchmark.md) | Benchmark-Spezifikation |

### Archiv

| Datei | Inhalt |
|-------|--------|
| [archive/journal-2025-11.md](archive/journal-2025-11.md) | Entwicklungsgeschichte November 2025 |

---

## Repository-Struktur

```
FemPrompt_SozArb/
  corpus/                  # Korpus (326 Papers)
  assessment/
    human/                 # Track 1: Human Expert
    agent/                 # Track 2: Agent Workflow
  benchmark/               # Vergleich Human vs. Agent
  pipeline/                # PDF -> Markdown -> Summary -> Vault
  vault/                   # Obsidian Vault
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
python pipeline/scripts/acquire_pdfs.py
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

## Ressourcen

| Ressource | Link |
|-----------|------|
| Repository | [github.com/chpollin/FemPrompt_SozArb](https://github.com/chpollin/FemPrompt_SozArb) |
| Google Sheets | [Thematisches Assessment](https://docs.google.com/spreadsheets/d/1z-HQSwVFg-TtdP0xo1UH4GKLMAXNvvXSdySPSA7KUdM/) |
| Zotero Group | 6080294 |

---

*Version: 3.0 (2026-02-03)*
