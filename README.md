# Deep-Research-Assisted Literature Reviews

Epistemic Infrastructure as Practice.

Christopher Pollin, Susanne Sackl-Sharif, Sabine Klinger, Christian Steiner

Part of the [Elisabeth List Fellowship project "Diversity-Sensitive Engagement with Artificial Intelligence"](https://socialai.2aw.at/) at the University of Graz.

---

## Project Goal

Systematic literature review on **feminist AI literacy** and **LLM bias** in the context of social work, building an epistemic infrastructure for LLM-assisted literature reviews. Documented in a paper for Forum Wissenschaft 2/2026 (submitted and editorially closed).

## Corpus and Assessment

A corpus identified via four Deep Research systems, screened in two parallel, independent tracks (an expert track and an LLM track) on an identical ten-category schema.

| Track | Schema | Status |
|-------|--------|--------|
| Human | 10 binary categories | Complete |
| LLM (10K) | 10 binary categories | Complete (the benchmark track) |
| LLM (5D) | 5 ordinal dimensions | Complete (archived) |

The benchmark result is a substantial, asymmetric divergence between the LLM and the expert judgments. The decomposition shows that the headline gap is dominated by human workflow exclusions (duplicates, no full text, wrong publication type) that a single-paper LLM cannot see; on content-only decisions the include rates converge. The full figures, the decomposition, and the provenance are in [`knowledge/verification.md`](knowledge/verification.md), reproducible via `benchmark/scripts/replay_selftest.py`.

## Repository Structure

```
corpus/                    # Corpus metadata (Zotero export)
assessment/                # Assessment systems (human, llm-5d archived)
benchmark/                 # Human vs. LLM benchmark (10K)
  config/                  # categories.yaml (the 10 categories, single source of truth)
  data/                    # llm_assessment_10k.csv, human_assessment.csv
  results/                 # agreement_metrics.json, disagreements.csv
  scripts/                 # incl. replay_selftest.py, verify_femprompt.py
pipeline/                  # PDF -> Markdown -> Knowledge
  knowledge/distilled/     # distilled knowledge documents
vault/                     # Obsidian Vault (Papers, Concepts, Divergences, Pipeline)
config/                    # Configuration (defaults.yaml)
prompts/                   # Prompt changelog and governance
deep-research/restored/    # Deep Research artifacts (RIS, raw outputs)
docs/                      # Evidence Companion and PRISM tool (GitHub Pages)
knowledge/                 # Project documentation (single source of truth)
```

## Documentation

Full project documentation is in [`knowledge/`](knowledge/INDEX.md); start at the index.

| Document | Contents |
|----------|----------|
| [INDEX.md](knowledge/INDEX.md) | Navigation and glossary |
| [project.md](knowledge/project.md) | Project goal, theoretical framework |
| [methods.md](knowledge/methods.md) | PRISMA, assessment design, pipeline, scripts |
| [verification.md](knowledge/verification.md) | Benchmark, divergence finding, conformance, paper integrity |
| [plan.md](knowledge/plan.md) | Roadmap, current status, next steps |

**Evidence Companion:** https://chpollin.github.io/FemPrompt_SozArb/

---

*Updated: 2026-06-29*
