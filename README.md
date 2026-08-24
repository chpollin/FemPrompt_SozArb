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

The Evidence Companion also provides an annotation-native literature landscape. It derives its matrix,
analysis profiles, and evidence drill-down from the productive PRISM track through
`src/publish/generate_literature_landscape.py`. Provisional tracks remain visibly provisional, and thematic
aggregates include only included papers with complete analysis records.

The public application is framework-free and uses pinned local runtime assets. The ten review categories are generated from `assessment/categories.yaml` into one frontend schema. Corpus records carry a stable Work identity, an exact publication Version, and an explicit knowledge-document coverage status. The canonical registry retains Preprints, Accepted Manuscripts, Versions of Record, corrected Versions, and duplicate bibliographic records as distinct, traceable expressions of the same Work. Screening coverage applies once per Work; evidence remains bound to the Version read. The Literature Landscape stores its view, filters, profile, and selection in the URL.

## Screening Tool (PRISM)

Screening runs through **PRISM** ([`docs/prisma.html`](docs/prisma.html)), the project's binding PRISMA-trAIce screening instrument, distinct from the PRISMA reporting standard. The first-round corpus and the round-two update are carried through the same record machinery. Round-two AI agents prepare the records, a separate AI Agent Review checks their Paper support, and domain experts later verify the completed corpus. Publication approval is recorded separately. The operative state is in [`knowledge/plan.md`](knowledge/plan.md).

Controlled agent reviews use [`prompts/prism-agent-reviewer-v1.1.md`](prompts/prism-agent-reviewer-v1.1.md), the project-local [`prism-agent-review` skill](skills/prism-agent-review/SKILL.md), and a hashed run manifest based on [`tests/review-cases/agent-runs/run-template.json`](tests/review-cases/agent-runs/run-template.json). Productive integration requires two manifest-bound coding packets, deterministic projection through PRISM's production contract, and a separate source-grounded AI Agent Review. The current per-work processing state is generated in [`generated/agent-screening-queue.json`](generated/agent-screening-queue.json), while the append-only productive track is [`docs/data/screening/ar2.json`](docs/data/screening/ar2.json).

## Research Vault

Subject knowledge of the review lives in [`research-vault/`](research-vault/README.md) under the Grounded-Vault chain `00_sources → 10_markdown → 20_distillates → 30_assertions → 40_output`. Protected full texts remain local, while references, distillates, Assertions, and output documents retain resolvable links across adjacent layers. A distillate enters the active vault only after its evidence resolves against the reviewed Paper representation. Unresolved evidence remains in `research-vault/waitlist.md` for domain-expert verification. `src/publish/validate_research_vault.py` checks the active chain, and `src/publish/check_claims.py` remains the compatibility check for the legacy Claim layer.

## Testing

PRISM is tested in three layers. A jsdom harness over the pure functions and a Companion smoke suite run with `npm test`. A pinned supported-browser pilot drives the PRISM workflow with `npm run pilot`; `npm run test:browser-companion` verifies the public Companion, responsive Literature Landscape, URL restoration, local assets, and browser errors. The paths that need a native folder picker are specified in [`tests/manual-checklist.md`](tests/manual-checklist.md). The Python side, including the fail-closed publishers and atomic publication checks, runs with `python -m pytest tests/`. The committed replay asserts the retrospective counts and agreement figures.

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
  vault/Papers/            # Generated source for the downloadable paper collection
src/                       # Pipeline and publishing scripts (acquire, distill, assess, publish)
config/                    # Configuration (defaults.yaml)
prompts/                   # Prompt changelog and governance
skills/                    # Project-local controlled review workflow
docs/                      # Evidence Companion and PRISM tool (GitHub Pages)
knowledge/                 # Project documentation (single source of truth)
research-vault/            # Subject knowledge of the review in the Grounded-Vault layer model
paper/                     # Archived work notes, outline, and expert questions
tests/                     # PRISM test layers: jsdom harness, browser pilot, manual checklist
```

## Documentation

Full project documentation is in [`knowledge/`](knowledge/INDEX.md); start at the index.

| Document | Contents |
|----------|----------|
| [INDEX.md](knowledge/INDEX.md) | Navigation and glossary |
| [project.md](knowledge/project.md) | Project goal, theoretical framework |
| [methods.md](knowledge/methods.md) | PRISMA, assessment design, pipeline, scripts |
| [plan.md](knowledge/plan.md) | Roadmap, current status, next steps |
| [specification.md](knowledge/specification.md) | PRISM requirements, user stories, ADR decision log, design system |
| [data.md](knowledge/data.md) | The data substrate the tool consumes and produces |
| [standards.md](knowledge/standards.md) | PRISMA 2020, PRISMA-trAIce, RAISE, and this review's conformance state |
| [update-protocol.md](knowledge/update-protocol.md) | Round-2 pre-registration, analysis fields, coding procedure |
| [research-vault.md](knowledge/research-vault.md) | Grounded-Vault layer model and the migration precondition |
| [journal.md](knowledge/journal.md) | Chronological session log |

**Evidence Companion:** https://chpollin.github.io/FemPrompt_SozArb/

## Licence

- **Code** (pipeline, PRISM screening tool, publishing scripts): [MIT](LICENSE).
- **Documentation, knowledge documents, and other textual content**: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- **Corpus and bibliographic sources**: rights in the underlying publications and third-party research data remain with their respective rights holders.

---

*Updated: 2026-08-24*
