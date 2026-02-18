# Epistemische Asymmetrien in Deep-Research-gestuetzten Literature Reviews

Workflow-Design zwischen Large Language Models und Expert:innenwissen.

Christopher Pollin, Susanne Sackl-Sharif, Sabine Klinger, Christian Steiner

Teil des [Elisabeth-List-Fellowship-Projekts "Diversitaetssensibler Umgang mit Kuenstlicher Intelligenz"](https://socialai.2aw.at/) an der Universitaet Graz.

---

## Projektziel

Systematischer Literature Review zu **feministischer AI Literacy** und **LLM-Bias** im Kontext Sozialer Arbeit. Konzeptuelle Grundlage fuer eine Benchmark ("Fair Bench"). Methodische Innovation dokumentiert in einem Paper fuer Forum Wissenschaft (Deadline: 4. Mai 2026).

## Korpus

**326 Papers** aus Zotero (254 Deep Research + 50 manuell), drei Assessment-Tracks:

| Track | Schema | Status |
|-------|--------|--------|
| **Human** | 10 binaere Kategorien | In Arbeit (56%) |
| **LLM (5D)** | 5 Dimensionen (0-3) | Fertig (325/325) |
| **LLM (10K)** | 10 binaere Kategorien | Code bereit, wartet |

## Repository-Struktur

```
corpus/                    # Korpus-Metadaten (326 Papers)
assessment/                # Human Assessment Tools
assessment-llm/            # LLM Assessment (5D, abgeschlossen)
benchmark/                 # Human vs. LLM Benchmark (10K, wartet)
pipeline/                  # PDF -> Markdown -> Knowledge -> Vault
  scripts/                 # Python-Scripts (13 CLI-Tools)
  tools/                   # Browser-Tools (markdown_reviewer.html)
  knowledge/distilled/     # 249 destillierte Wissensdokumente
config/                    # Konfiguration (defaults.yaml)
prompts/                   # Prompt-Changelog und Governance
vault/                     # Obsidian Vault (Skelett, wartet auf Daten)
deep-research/restored/    # Deep-Research-Artefakte (RIS, Raw-Outputs)
knowledge/                 # Projektdokumentation (Single Source of Truth)
```

## Dokumentation

Die vollstaendige Projektdokumentation liegt in [`knowledge/`](knowledge/README.md):

| Dokument | Inhalt |
|----------|--------|
| [project.md](knowledge/project.md) | Projektziel, theoretischer Rahmen, Glossar |
| [methodology.md](knowledge/methodology.md) | PRISMA, dualer Bewertungspfad, SKE, Workflow |
| [status.md](knowledge/status.md) | Aktueller Stand, Blocker |
| [technical.md](knowledge/technical.md) | Pipeline-Architektur, Scripts, Kosten |
| [paper-integrity.md](knowledge/paper-integrity.md) | Paper vs. Repository (detailliert) |
| [epistemic-framework.md](knowledge/epistemic-framework.md) | Mapping-Tabelle, Sycophancy-Mitigation |
| [prompts/CHANGELOG.md](prompts/CHANGELOG.md) | Prompt-Versionierung |

## API-Kosten

| Operation | Kosten |
|-----------|--------|
| Knowledge Distillation (249 Docs) | ~$7.00 |
| LLM-Assessment 5D (325 Papers) | ~$1.15 |
| Validierung | ~$0.58 |
| **Gesamt** | **~$8.73** |

Modell: Claude Haiku 4.5

---

*Aktualisiert: 2026-02-18*
