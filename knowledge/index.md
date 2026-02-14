# Literature Review - Dokumentations-Index

Systematischer Literature Review zu **AI Literacy** und **LLM-Bias** im Kontext Sozialer Arbeit.

Teil des [Social AI Projekts](https://socialai.2aw.at/).

---

## Projektziel

**Primaer:** Empirische Grundlage schaffen fuer Forschung zu diskriminierungssensiblem Prompting.

**Sekundaer:** Methodische Innovation dokumentieren (Human vs. LLM Assessment Benchmark).

---

## Korpus

**326 Papers** aus Zotero (254 Deep Research + 50 manuell), drei Assessment-Tracks:

| Track | Methode | Schema | Status |
|-------|---------|--------|--------|
| **Human** | Google Sheets | 10 binaere Kategorien | In Arbeit (56%) |
| **LLM (5D)** | Claude Haiku 4.5 | 5 Dimensionen (0-3) | Fertig |
| **LLM (10K)** | Claude Haiku 4.5 | 10 binaere Kategorien | Wartet |

---

## Erfolgskriterien

| Kriterium | Status |
|-----------|--------|
| Knowledge Distillation (249 Docs) | Fertig |
| Paper-Entwurf (Forum Wissenschaft) | Entwurf liegt vor |
| Paper-Repo-Abgleich | Fertig |
| Human Assessment (56%) | In Arbeit (Blocker) |
| Benchmark Human vs. LLM | Wartet |
| Obsidian Vault | Wartet |
| Paper einreichen (4. Mai 2026) | Wartet |

---

## Dokumentation

### Kern-Dokumente

| Datei | Inhalt |
|-------|--------|
| [01-project.md](01-project.md) | Projektziel, theoretischer Rahmen (epistemische Asymmetrie, Konfabulation, Sycophancy), Glossar |
| [02-methodology.md](02-methodology.md) | PRISMA 2020, dualer Bewertungspfad, SKE, Assessment-Schemas, Zirkularitaet |
| [03-status.md](03-status.md) | Aktueller Stand, Blocker, offene Punkte |
| [04-technical.md](04-technical.md) | Pipeline-Architektur, Scripts, Performance, Verifikations-Praezisierung |
| [05-paper-repo-abgleich.md](05-paper-repo-abgleich.md) | Abgleich Paper-Text vs. Repository (detailliert, Satz-fuer-Satz) |
| [06-epistemic-infrastructure.md](06-epistemic-infrastructure.md) | Mapping-Tabelle (Asymmetrie -> Risiko -> Massnahme -> Artefakt), Sycophancy-Mitigation, Selektions-Audit |

### Workflow und Prompt-Governance

| Datei | Inhalt |
|-------|--------|
| [WORKFLOW.md](../WORKFLOW.md) | Workflow-Uebersicht (Pipeline + Assessment + Benchmark) |
| [PAPER_VS_REPO.md](../PAPER_VS_REPO.md) | Kurzversion Paper-vs-Repo (verweist auf 05-paper-repo-abgleich.md) |
| [prompts/CHANGELOG.md](../prompts/CHANGELOG.md) | Versionierte Prompts: 5D, 10K, SKE Stage 1+3, Sycophancy-Massnahmen |

### Anleitungen

| Datei | Inhalt |
|-------|--------|
| [guides/quickstart.md](guides/quickstart.md) | 10-Minuten-Einstieg |
| [guides/manual-review-checklist.md](guides/manual-review-checklist.md) | Markdown-Review Checkliste |

### Paper-Materialien

| Datei | Inhalt |
|-------|--------|
| [paper/Forum Wissenschaft Paper - Arbeitsplan.md](paper/Forum%20Wissenschaft%20Paper%20-%20Arbeitsplan.md) | Paper-Gliederung und Struktur |
| [paper/Human-LLM Assessment Benchmark.md](paper/Human-LLM%20Assessment%20Benchmark.md) | Benchmark-Spezifikation |
| [paper/Referenzliteratur-Benchmark-Design.md](paper/Referenzliteratur-Benchmark-Design.md) | Referenzstudien und erwartete Kappa-Werte |

---

## Repository-Struktur

```
├── corpus/                  # Korpus-Metadaten (326 Papers, Provenienz)
├── deep-research/restored/  # Deep-Research-Artefakte (RIS, Raw-Outputs)
├── assessment/              # Human Assessment Tools
├── assessment-llm/          # LLM Assessment (5D, abgeschlossen)
├── benchmark/               # Human vs. LLM Benchmark (10K, wartet)
├── pipeline/                # PDF -> Markdown -> Knowledge -> Vault
│   └── knowledge/distilled/ # 249 Wissensdokumente
├── config/                  # Konfiguration (defaults.yaml)
├── vault/                   # Obsidian Vault (Skelett, nicht befuellt)
├── prompts/                 # Prompt-Changelog und Governance
└── knowledge/               # Dokumentation (01-06 + Guides + Paper)
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

*Aktualisiert: 2026-02-14*
