# Deep-Research-Assisted Literature Reviews

Epistemic Infrastructure as Practice.

Christopher Pollin, Susanne Sackl-Sharif, Sabine Klinger, Christian Steiner

Part of the [Elisabeth List Fellowship project "Diversity-Sensitive Engagement with Artificial Intelligence"](https://socialai.2aw.at/) at the University of Graz.

---

## Project Goal

Systematic literature review on **feminist AI literacy** and **LLM bias** in the context of social work. Building an epistemic infrastructure for LLM-assisted literature reviews. Documented in a paper for Forum Wissenschaft (deadline: May 4, 2026).

## Corpus and Assessment

**326 papers** from Zotero, two assessment tracks:

| Track | Schema | Status |
|-------|--------|--------|
| **Human** | 10 binary categories | 303/326 with decision (291 overlap with LLM) |
| **LLM (10K)** | 10 binary categories | 326/326 ($1.44) |

Archived: LLM 5D assessment (325/325, 5 ordinal dimensions, $1.15).

**Benchmark results (corrected 2026-03-27, recompute-verified 2026-06-20):** Confusion matrix (100 Include-Include, 108 LLM-Include/Human-Exclude, 34 reversed, 49 Exclude-Exclude), base rates (LLM 71.5% vs. Human 46.0% Include), Cohen's Kappa = 0.056. The observed agreement is genuinely near chance (PABAK 0.024), not merely a prevalence artifact. The headline divergence is dominated by human workflow exclusions (Duplicate, No full text, Wrong publication type) that a single-paper LLM cannot see; on content-only decisions (n=199) the include rates converge and kappa rises to 0.194. Basis: 291 papers. Details: `knowledge/verification-empirical-core.md` (V1) and `knowledge/status.md`. Numbers reproducible via `benchmark/scripts/verify_femprompt.py`.

## Repository Structure

```
corpus/                    # Corpus metadata (326 papers, Zotero export)
assessment/                # Assessment systems
  human/                   # Human assessment (Google Sheets -> CSV)
  llm-5d/                  # LLM assessment 5D (archived)
benchmark/                 # Human vs. LLM benchmark (10K)
  config/                  # categories.yaml (10 categories, single source of truth)
  data/                    # llm_assessment_10k.csv, human_assessment.csv
  results/                 # agreement_metrics.json, disagreements.csv
pipeline/                  # PDF -> Markdown -> Knowledge
  scripts/                 # Python scripts (incl. generate_vault.py)
  knowledge/distilled/     # 249 knowledge documents
vault/                     # Obsidian Vault (248 papers, 136 concepts, 142 divergences after regeneration)
config/                    # Configuration (defaults.yaml)
prompts/                   # Prompt changelog and governance
deep-research/restored/    # Deep Research artifacts (RIS, raw outputs)
docs/                      # Evidence Companion (GitHub Pages)
knowledge/                 # Project documentation (single source of truth)
```

## Documentation

Full project documentation is in [`knowledge/`](knowledge/README.md):

| Document | Contents |
|----------|----------|
| [project.md](knowledge/project.md) | Project goal, theoretical framework, glossary |
| [methods-and-pipeline.md](knowledge/methods-and-pipeline.md) | PRISMA, assessment design, pipeline, scripts, costs |
| [status.md](knowledge/status.md) | Milestones, benchmark results, open items |
| [paper-integrity.md](knowledge/paper-integrity.md) | Paper vs. repository comparison |

**Evidence Companion:** https://chpollin.github.io/FemPrompt_SozArb/

## API Costs

| Operation | Cost |
|-----------|------|
| Knowledge distillation (249 docs) | ~$7.00 |
| LLM assessment 5D (325 papers) | ~$1.15 |
| LLM assessment 10K (326 papers) | ~$1.44 |
| Vault v2 (concepts + divergences) | ~$1.00 |
| **Total** | **~$10.59** |

Model: Claude Haiku 4.5

---

*Updated: 2026-04-01*
