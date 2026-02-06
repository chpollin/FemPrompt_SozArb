# Literature Review - Dokumentations-Index

Systematischer Literature Review zu **AI Literacy** und **LLM-Bias** im Kontext Sozialer Arbeit.

Teil des [Social AI Projekts](https://socialai.2aw.at/).

---

## Projektziel

**Primaer:** Empirische Grundlage schaffen fuer Forschung zu diskriminierungssensiblem Prompting.

**Sekundaer:** Methodische Innovation dokumentieren (Human vs. LLM Assessment Benchmark).

---

## Korpus

**326 Papers** aus Zotero, zwei parallele Assessment-Tracks:

| Track | Methode | Schema | Status |
|-------|---------|--------|--------|
| **Human** | Google Sheets | 10 binaere Kategorien | In Arbeit |
| **LLM** | Claude Haiku 4.5 | 5 Dimensionen (0-3) | Fertig |

---

## Erfolgskriterien

| Kriterium | Status |
|-----------|--------|
| Literature Review (326 Papers) | In Arbeit |
| Paper eingereicht (4. Mai 2026) | Wartet |
| Benchmark Human vs. LLM | Wartet |
| Obsidian Vault | Wartet |

---

## Dokumentation

### Kern-Dokumente

| Datei | Inhalt |
|-------|--------|
| [01-project.md](01-project.md) | Projektziel, Zielgruppe, Erfolgskriterien |
| [02-methodology.md](02-methodology.md) | PRISMA 2020, Assessment-Schemas |
| [03-status.md](03-status.md) | Aktueller Stand |
| [04-technical.md](04-technical.md) | Pipeline-Architektur, Scripts |

### Anleitungen

| Datei | Inhalt |
|-------|--------|
| [guides/quickstart.md](guides/quickstart.md) | 10-Minuten-Einstieg |
| [guides/manual-review-checklist.md](guides/manual-review-checklist.md) | Markdown-Review Checkliste |

### Paper-Materialien

| Datei | Inhalt |
|-------|--------|
| [paper/Forum Wissenschaft Paper - Arbeitsplan.md](paper/Forum%20Wissenschaft%20Paper%20-%20Arbeitsplan.md) | Paper-Gliederung |
| [paper/Human-LLM Assessment Benchmark.md](paper/Human-LLM%20Assessment%20Benchmark.md) | Benchmark-Spezifikation |

---

## Repository-Struktur

```
├── corpus/                  # Korpus-Metadaten (326 Papers)
├── assessment/              # Human Assessment Tools
├── assessment-llm/          # LLM Assessment (5D, abgeschlossen)
├── benchmark/               # Human vs. LLM Benchmark
├── pipeline/                # PDF -> Markdown -> Knowledge -> Vault
│   └── knowledge/distilled/ # 249 Wissensdokumente
├── config/                  # Konfiguration (defaults.yaml)
├── vault/                   # Obsidian Vault (Output)
└── knowledge/               # Dokumentation
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
| Google Sheets | [Assessment](https://docs.google.com/spreadsheets/d/1z-HQSwVFg-TtdP0xo1UH4GKLMAXNvvXSdySPSA7KUdM/) |

---

*Aktualisiert: 2026-02-06*
