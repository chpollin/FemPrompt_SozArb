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

The benchmark serves as a motivating illustration of why reliability cannot be presupposed. It records a substantial, asymmetric divergence between the LLM and the expert judgments; the decomposition shows that the headline gap is dominated by human workflow exclusions (duplicates, no full text, wrong publication type) that a single-paper LLM cannot see, and on content-only decisions the include rates converge. The figures live in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion.

## Screening Tool (PRISM)

Screening runs through **PRISM** ([`docs/prisma.html`](docs/prisma.html)), the project's binding PRISMA-trAIce screening instrument, distinct from the PRISMA reporting standard. The review's data is carried through PRISM (the first-round corpus and the planned literature update), and the review counts complete only once that pass is done. The roadmap is in [`knowledge/plan.md`](knowledge/plan.md).

## Repository Structure

```
corpus/                    # Corpus metadata (Zotero export) and Deep Research artifacts (RIS, raw outputs)
assessment/                # Assessment systems (human, llm-5d archived), categories.yaml (the 10 categories, single source of truth)
generated/                 # Generated artifacts
  benchmark-results/       # agreement_metrics.json, disagreements.csv
  pdfs/                    # acquired PDFs
  markdown/                # PDF -> Markdown
  markdown_clean/          # cleaned Markdown (the raw-text source PRISM resolves)
  distilled/               # distilled knowledge documents
  vault/                   # Obsidian Vault (Papers, Concepts, Divergences, Pipeline)
src/                       # Pipeline and publishing scripts (acquire, distill, assess, publish)
config/                    # Configuration (defaults.yaml)
prompts/                   # Prompt changelog and governance
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
| [plan.md](knowledge/plan.md) | Roadmap, current status, next steps |

**Evidence Companion:** https://chpollin.github.io/FemPrompt_SozArb/

---

*Updated: 2026-06-29*
