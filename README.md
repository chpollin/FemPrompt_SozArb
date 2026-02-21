# Epistemische Asymmetrien in Deep-Research-gestuetzten Literature Reviews

Workflow-Design zwischen Large Language Models und Expert:innenwissen.

Christopher Pollin, Susanne Sackl-Sharif, Sabine Klinger, Christian Steiner

Teil des [Elisabeth-List-Fellowship-Projekts "Diversitaetssensibler Umgang mit Kuenstlicher Intelligenz"](https://socialai.2aw.at/) an der Universitaet Graz.

---

## Projektziel

Systematischer Literature Review zu **feministischer AI Literacy** und **LLM-Bias** im Kontext Sozialer Arbeit. Konzeptuelle Grundlage fuer eine Benchmark ("Fair Bench"). Methodische Innovation dokumentiert in einem Paper fuer Forum Wissenschaft (Deadline: 4. Mai 2026).

## Korpus und Assessment

**326 Papers** aus Zotero (254 Deep Research + 50 manuell), drei Assessment-Tracks:

| Track | Schema | Status |
|-------|--------|--------|
| **Human** | 10 binaere Kategorien | 210/326 mit Decision |
| **LLM (5D)** | 5 Dimensionen (0-3) | Fertig (325/325, archiviert) |
| **LLM (10K)** | 10 binaere Kategorien | Fertig (326/326, $1.44) |

**Benchmark-Ergebnis:** Decision Cohen's Kappa = 0,035 ("slight"), 111 Disagreements. Der niedrige Kappa-Wert quantifiziert die epistemische Asymmetrie zwischen keyword-basierter Musterkennung und disziplinaerer Urteilskraft. Details: `knowledge/status.md`, Abschnitt M6.

## Repository-Struktur

```
corpus/                    # Korpus-Metadaten (326 Papers, Zotero-Export)
assessment/                # Assessment-Systeme
  human/                   # Human Assessment (Excel, Skripte)
  llm-5d/                  # LLM Assessment 5D (abgeschlossen, archiviert)
benchmark/                 # Human vs. LLM Benchmark (10K, abgeschlossen)
  config/                  # categories.yaml (10 Kategorien, Single Source of Truth)
  data/                    # papers_full.csv, llm_assessment_10k.csv, human_assessment.csv
  results/                 # agreement_metrics.json, disagreements.csv
  scripts/                 # merge, calculate_agreement, analyze_disagreements
pipeline/                  # PDF -> Markdown -> Knowledge
  scripts/                 # Python-Scripts
  knowledge/distilled/     # 249 destillierte Wissensdokumente
config/                    # Konfiguration (defaults.yaml)
prompts/                   # Prompt-Changelog und Governance
deep-research/restored/    # Deep-Research-Artefakte (RIS, Raw-Outputs)
docs/                      # GitHub Pages SPA (Papers, Benchmark, Dashboard, Graph)
knowledge/                 # Projektdokumentation (Single Source of Truth)
```

## Dokumentation

Die vollstaendige Projektdokumentation liegt in [`knowledge/`](knowledge/README.md):

| Dokument | Inhalt |
|----------|--------|
| [project.md](knowledge/project.md) | Projektziel, theoretischer Rahmen (inkl. Mapping-Tabelle, Designprinzip), Glossar |
| [methods-and-pipeline.md](knowledge/methods-and-pipeline.md) | PRISMA, Assessment-Design, Pipeline, Scripts, Kosten |
| [status.md](knowledge/status.md) | Meilensteine, Benchmark-Ergebnisse, Selektions-Audit, offene Punkte |
| [paper-integrity.md](knowledge/paper-integrity.md) | Paper vs. Repository Abgleich |

## API-Kosten

| Operation | Kosten |
|-----------|--------|
| Knowledge Distillation (249 Docs) | ~$7.00 |
| LLM-Assessment 5D (325 Papers) | ~$1.15 |
| LLM-Assessment 10K (326 Papers) | ~$1.44 |
| Sonstiges | ~$0.58 |
| **Gesamt** | **~$10.17** |

Modell: Claude Haiku 4.5

---

*Aktualisiert: 2026-02-21*
