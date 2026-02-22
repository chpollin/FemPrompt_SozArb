# Deep-Research-gestuetzte Literature Reviews

Epistemische Infrastruktur als Praxis.

Christopher Pollin, Susanne Sackl-Sharif, Sabine Klinger, Christian Steiner

Teil des [Elisabeth-List-Fellowship-Projekts "Diversitaetssensibler Umgang mit Kuenstlicher Intelligenz"](https://socialai.2aw.at/) an der Universitaet Graz.

---

## Projektziel

Systematischer Literature Review zu **feministischer AI Literacy** und **LLM-Bias** im Kontext Sozialer Arbeit. Aufbau einer epistemischen Infrastruktur fuer LLM-gestuetzte Literature Reviews. Dokumentiert in einem Paper fuer Forum Wissenschaft (Deadline: 4. Mai 2026).

## Korpus und Assessment

**326 Papers** aus Zotero, zwei Assessment-Tracks:

| Track | Schema | Status |
|-------|--------|--------|
| **Human** | 10 binaere Kategorien | 210/326 mit Decision |
| **LLM (10K)** | 10 binaere Kategorien | 326/326 ($1.44) |

Archiviert: LLM 5D-Assessment (325/325, 5 ordinale Dimensionen, $1.15).

**Benchmark-Ergebnis:** Konfusionsmatrix (65 Include-Include, 78 LLM-Include/Human-Exclude, 23 umgekehrt, 34 Exclude-Exclude), Basisraten (LLM 68% vs. Human 42% Include), Cohen's Kappa = 0.035 (Prevalence-Bias-Artefakt nach Byrt et al. 1993). Details: `knowledge/status.md`, Abschnitt M6.

## Repository-Struktur

```
corpus/                    # Korpus-Metadaten (326 Papers, Zotero-Export)
assessment/                # Assessment-Systeme
  human/                   # Human Assessment (Google Sheets -> CSV)
  llm-5d/                  # LLM Assessment 5D (archiviert)
benchmark/                 # Human vs. LLM Benchmark (10K)
  config/                  # categories.yaml (10 Kategorien, Single Source of Truth)
  data/                    # llm_assessment_10k.csv, human_assessment.csv
  results/                 # agreement_metrics.json, disagreements.csv
pipeline/                  # PDF -> Markdown -> Knowledge
  scripts/                 # Python-Scripts (inkl. generate_vault.py)
  knowledge/distilled/     # 249 Knowledge-Dokumente
vault/                     # Obsidian Vault (249 Papers, 205 mit Assessment-Daten)
config/                    # Konfiguration (defaults.yaml)
prompts/                   # Prompt-Changelog und Governance
deep-research/restored/    # Deep-Research-Artefakte (RIS, Raw-Outputs)
docs/                      # GitHub Pages SPA
knowledge/                 # Projektdokumentation (Single Source of Truth)
```

## Dokumentation

Die vollstaendige Projektdokumentation liegt in [`knowledge/`](knowledge/README.md):

| Dokument | Inhalt |
|----------|--------|
| [project.md](knowledge/project.md) | Projektziel, theoretischer Rahmen, Glossar |
| [methods-and-pipeline.md](knowledge/methods-and-pipeline.md) | PRISMA, Assessment-Design, Pipeline, Scripts, Kosten |
| [status.md](knowledge/status.md) | Meilensteine, Benchmark-Ergebnisse, offene Punkte |
| [paper-integrity.md](knowledge/paper-integrity.md) | Paper vs. Repository Abgleich |

**GitHub Pages:** https://chpollin.github.io/FemPrompt_SozArb/

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

*Aktualisiert: 2026-02-22*
