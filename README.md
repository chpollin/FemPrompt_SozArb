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

## Research Vault

Subject knowledge of the review lives in [`research-vault/`](research-vault/README.md) under the Grounded-Vault layer model: bibliographic records, one distillate per source, and atomic claims organised in topic maps, each layer referencing only the one below it. Three of the five layers are built. The anchor layer over the full texts is not, because it would carry licensed full texts of third parties and stays gitignored; the distillates therefore carry `migrated`, not `grounded`, and the deliverable layer is empty. A distillate enters the vault only once its evidence resolves verbatim in the committed full text; what a deterministic re-match could not resolve waits in `research-vault/waitlist.md` for binding human verification and is not part of the vault. The claim layer's anchors are checked by `src/publish/check_claims.py`, and the `grounded` status of that layer holds only while the check passes.

## Testing

PRISM is tested in three layers. A jsdom harness over the pure functions and a Companion smoke suite run with `npm test`; a pinned supported-browser pilot drives the real page in Chromium with `npm run pilot`, its contract in [`tests/pilot/README.md`](tests/pilot/README.md); the paths that need a native folder picker are specified for a person in [`tests/manual-checklist.md`](tests/manual-checklist.md). The Python side runs with `python -m pytest tests/`. The retrospective counts and agreement figures are asserted by the committed replay, not recounted by hand.

## Repository Structure"),
])

rw("CLAUDE.md", [
("**Last Updated:** 2026-06-30", "**Last Updated:** 2026-08-21"),

("| `src/replay/` | Round-1 replay (`replay_round1.py`, self-test against the canonical benchmark) | Yes, with care |",
 "| `src/replay/` | Round-1 replay (`replay_round1.py`, self-test against the canonical benchmark) | Yes, with care |
"
 "| `src/assess/replay_flow.py` | Second replay implementation with its own self-test, from the paper lane; which of the two is the production path is an open code decision in `knowledge/plan.md` | Do not extend before the decision |
"
 "| `research-vault/` | Subject knowledge of the literature in the Grounded-Vault layer model; `_sources/` and `00_representation/` are gitignored by license lock and are never created here | Yes, with care |
"
 "| `tests/` | PRISM test layers: jsdom harness, Companion smoke suite, browser pilot, pytest, manual checklist | Yes, with care |
"
 "| `paper/` | Follow-up paper (draft, outline, expert questions) | Yes, with care |"),

("Architecture rules: no build tool, no framework, no npm, CDN only (D3, Chart.js, Fuse.js, FontAwesome);",
 "Architecture rules: no build tool and no framework, the served pages load their libraries from a CDN (D3, Chart.js, Fuse.js, JSZip, FontAwesome) and nothing is bundled; npm exists only for the test harness (jsdom, Playwright) and never for anything the pages load;"),

("| Work journal | `knowledge/journal.md` |",
 "| Work journal | `knowledge/journal.md` |
"
 "| Subject knowledge of the literature (what the sources say, in which check state) | `research-vault/`, modelled in `knowledge/research-vault.md` |"),

(### Gates before committing

`npm test` (jsdom harness and Companion smoke suite), `python -m pytest tests/`, and `python -m src.publish.check_claims` when the claims layer was touched. The browser pilot (`npm run pilot`) runs before anything that changes the screening path. A green check is a precondition of the `grounded` status of the claims layer, not a formality.

### Git workflow

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
research-vault/            # Subject knowledge of the review in the Grounded-Vault layer model
paper/                     # Follow-up paper (draft, outline, expert questions)
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

*Updated: 2026-06-29*
