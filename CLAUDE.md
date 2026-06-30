# Working Rules for Claude AI Assistant

**Project:** FemPrompt SozArb, a systematic literature review on feminist AI literacies in social work
**Last Updated:** 2026-06-30

---

## Core Argument

This project builds an **epistemic infrastructure** for an LLM-assisted literature review. The central thesis is that reliability cannot be presupposed as a property of the system but must be established as a property of the research process. The workflow is organized around **verification checkpoints**, defined points after each AI-assisted step where human or rule-based control checks results before they flow into the next stage. PRISM (`docs/prisma.html`) is the binding screening surface this runs through; per ADR-019 the review counts complete only once all of its data has passed through PRISM under PRISMA 2020 and PRISMA-trAIce, with the items unrepairable in retrospect (the absent round-1 protocol above all) named, not hidden.

A corpus of papers identified via four proprietary Deep Research systems was processed through a five-step workflow. A **dual assessment track** runs expert and LLM evaluation in parallel on the same ten-category schema, without mutual knowledge. The result is a substantial, asymmetric divergence between the LLM and the expert judgments. This divergence is a motivating illustration of why reliability cannot be presupposed as a property of the system; it is not a finding the review defends but a worked example of why the epistemic infrastructure is needed.

The Forum Wissenschaft 2/2026 paper is submitted and editorially closed (it was written on Google Docs, not in this repo). The active work is the PRISM screening tool and the follow-up paper on the epistemic infrastructure and the LLM-assisted review process, tracked in `knowledge/plan.md`.

---

## No volatile quantities

Costs and metrics (dollar totals, token counts, kappas, confusion-matrix cells, include rates, corpus and pipeline counts) are NOT hand-maintained in the prose of this file or the knowledge docs. They drift and contradict each other. Numbers live in the data (`generated/benchmark-results/`, `docs/data/`) and in the Evidence Companion that renders them. State findings qualitatively and point there. This file names structural constants (ten categories, four Deep Research models, three pipeline stages) but not run statistics.

---

## Key Terminology

Use these terms consistently. They are defined in `knowledge/INDEX.md` (glossary).

| Term | Definition |
|------|------------|
| Epistemic infrastructure | Systematic arrangement of tools, decision rules, verification checkpoints, and responsibility assignments that establishes reliability in a research process |
| Distillation pipeline (SKE) | Three-stage knowledge extraction from full texts: LLM extract and classify, deterministic formatting, LLM verification against the original |
| Dual assessment track | Parallel, independent evaluation by experts and LLM using an identical ten-category schema |
| Verification checkpoint | Defined point where human or rule-based control checks AI-generated results |
| Knowledge document | Structured summary of a paper with core finding, methodology, arguments, category evidence, confidence score |
| Confabulation | Generation of coherent but factually unsupported claims (preferred over "hallucination") |
| Context rot | Degradation of LLM processing quality with increasing input length (Hong et al. 2025) |
| Sycophancy | LLM tendency to over-agree with prompt presuppositions |
| Deep Research | Agent-based LLM systems for iterative, autonomous literature search |
| Evidence Companion | The web-based academic companion publication at chpollin.github.io/FemPrompt_SozArb |
| PRISM | This project's screening tool (`docs/prisma.html`), distinct from the PRISMA reporting standard |

---

## Project Overview

The corpus is processed through a five-step workflow (Identification, PDF acquisition, Markdown conversion, knowledge extraction, assessment). The core question is what happens to knowledge when it flows through a distillation pipeline.

Three layers:
1. **Obsidian Vault** (`generated/vault/`): interlinked Markdown of Papers, Concepts, Divergences, and Pipeline stages, generated.
2. **Evidence Companion** (`docs/index.html` plus subpages): four views (Knowledge Chat, Knowledge Graph, Categories, Corpus), live at https://chpollin.github.io/FemPrompt_SozArb/.
3. **Paper**: Forum Wissenschaft 2/2026, submitted and closed (on Google Docs). The follow-up paper is led by the infrastructure and the review method, not by a results claim.

The benchmark (the human-LLM divergence and its decomposition, used as a motivating illustration) and all figures live in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion; do not restate them here.

### Assessment tracks

| Track | Method | Schema | Status |
|-------|--------|--------|--------|
| Human | Google Sheets | 10 binary categories | Complete |
| LLM (5D) | Claude Haiku 4.5 | 5 ordinal dimensions | Complete (archived) |
| LLM (10K) | Claude Haiku 4.5 | 10 binary categories | Complete (the benchmark track) |

---

## Repository Structure

### Directories

| Directory | Contents | Edit? |
|-----------|----------|-------|
| `knowledge/` | **Single source of truth** for all project documentation (see `knowledge/INDEX.md`) | Yes, with care |
| `generated/distilled/` | Distilled knowledge documents | Read-only |
| `generated/distilled/_stage1_json/`, `_verification/` | Stage-1 JSON extractions, verification reports | Read-only |
| `generated/vault/` | Obsidian Vault v2 (Papers, Concepts, Divergences, Pipeline) | Generated |
| `docs/`, `docs/data/` | GitHub Pages web interfaces and generated JSON | Actively edited |
| `generated/benchmark-results/` | Benchmark results | Complete |
| `assessment/` | LLM 5D and human assessment | Complete |
| `src/publish/` | Generators (Vault v2, Promptotyping data) | Actively edited |
| `config/` | `defaults.yaml` (now lists `generated/` paths; the restructure superseded its do-not-change note) | Yes, with care |
| `.vault_cache/` | LLM API cache (reproducible) | Do not change |
| `prompts/` | Prompt governance and CHANGELOG | Read-only |

### Knowledge documents

`INDEX.md` (navigation and glossary), `project.md` (identity and theory), `methods.md` (review method and pipeline), `specification.md` (PRISM requirements, ADRs, user stories), `data.md` (tool data substrate), `design.md` (UI and design system), `plan.md` (roadmap, status, simulated decisions), `journal.md` (session log), `standards.md` (PRISMA, trAIce, RAISE), `conformance-map.md` (per-item PRISMA/trAIce conformance with source paths and named gaps, the R1 deliverable), `update-protocol.md` (round-2 protocol, analysis fields, RIS), `guides/manual-review-checklist.md`. Start at `INDEX.md`.

### Key web files

| File | Purpose |
|------|---------|
| `docs/index.html` | Evidence Companion (4-view SPA, default Knowledge Chat) |
| `docs/prisma.html` | PRISM screening tool |
| `docs/js/research-app.js` | Corpus table, modal tabs, navigation, export |
| `docs/js/wissenschat.js` | Knowledge Chat (Gemini 3 Flash, streaming, citations) |
| `docs/js/wissensnetz.js` | Knowledge Graph (D3 force graph, divergence mode) |
| `docs/js/kategorien.js` | Categories Explorer |
| `docs/js/prisma.js`, `prisma-data.js`, `prisma-import.js` | PRISM logic, data shim, Excel bridge |
| `docs/css/research.css`, `prisma.css` | Styles |
| `generated/benchmark-results/agreement_metrics.json` | Canonical benchmark metrics |
| `assessment/categories.yaml` | Canonical category definitions |

---

## Evidence Companion (`docs/index.html`)

Academic companion publication. Vanilla JS plus Chart.js and D3 via CDN.

**Live:** https://chpollin.github.io/FemPrompt_SozArb/

| View | Content | JS file |
|------|---------|---------|
| Knowledge Chat (default) | Gemini 3 Flash Q&A, inline citations to Corpus | `wissenschat.js` |
| Knowledge Graph | D3 force graph, cluster layout, divergence mode | `wissensnetz.js` |
| Categories | Ten-category spectrum, rate comparison, divergence papers | `kategorien.js` |
| Corpus (reference layer) | Sortable table, filters, detail modal, export | `research-app.js` |

Subpages: `about.html`, `methoden.html`, `help.html`.

Architecture rules: no build tool, no framework, no npm, CDN only (D3, Chart.js, Fuse.js, FontAwesome); IIFE pattern for all JS, communication via the `window.EC` API; IBM Plex Serif (headings) and Inter (body); ten categories as a gender-neutral spectrum; detail as a slide-in side panel; the chat API key is local only (localStorage plus gitignored `config.local.js`); data in `docs/data/research_vault_v2.json`, `concept_graph.json`, `promptotyping_v2.json`; ZIP export via JSZip.

---

## Pipeline

Workflow: Zotero papers, PDF acquisition (four fallback strategies), Markdown conversion (Docling), three-stage distillation (extract JSON, format Markdown, verify). The acquisition, conversion, and distillation loss chain is quantified in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion, not here.

Knowledge document structure: YAML frontmatter (title, authors, year, type, language, processed, source_file, confidence); sections Core Finding, Research Question, Methodology, Main Arguments, Category Evidence, Assessment Relevance, Key References. Categories live in `_stage1_json/` as booleans, not in the Markdown frontmatter.

---

## Data Flow (JSON)

`promptotyping_v2.json` (generated by `src/publish/generate_promptotyping_data_v2.py`): `meta` (totals, disagreements, kappa, confusion_matrix, rates, pattern_distribution, asymmetry), `papers`, `concepts` (nodes and edges), `divergences`. Note: `meta.total_papers` in the agreement JSONs is the union of the two assessment tracks, not the corpus (see the comment in `src/assess/calculate_agreement.py`).

`research_vault_v2.json` (generated by `src/publish/generate_docs_data.py`): for the Evidence Companion.

---

## Canonical Locations (Redundancy Rules)

Each piece of information has exactly ONE canonical location. Other files reference, never duplicate.

| Information | Canonical Location |
|-------------|-------------------|
| Benchmark figures, the divergence and its decomposition | the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion |
| Script reference, pipeline method | `knowledge/methods.md` |
| Category definitions | `assessment/categories.yaml` |
| Theory and operationalization | `knowledge/project.md` |
| Glossary | `knowledge/INDEX.md` |
| Roadmap, current status, simulated decisions | `knowledge/plan.md` |
| Standards (PRISMA, trAIce, RAISE) | `knowledge/standards.md` |
| Work journal | `knowledge/journal.md` |

---

## Working Conventions

### Session start

1. Read `knowledge/INDEX.md` (the map), then `knowledge/plan.md` (current state and next steps).
2. Check `git status` and `git log -3` (branch and recent commits).
3. Read `knowledge/journal.md` (last session, open items).
4. Create a TodoWrite for multi-step tasks.

### Documentation rules

- Language: English for all documentation and code (the journal is a bilingual historical log).
- No emojis in documentation files.
- No volatile quantities in prose (see the section above); the date lives in the frontmatter `updated` field, not in a footer.
- Frontmatter Pflichtkern on every authored knowledge doc: `title, project, method, status, created, updated`; `version` is shared repo-wide; `status` is document maturity, not operative status.
- Tables for comparisons, lists for enumerations.
- Update the journal for every substantive session.

### Git workflow

- Commit format: `[type]: [description]` (feat, fix, docs, refactor, test, chore).
- Commit frequently after each logical change.
- Branch off main for substantial work; NEVER force-push to main.
- Do not commit: `.env`, generated data (PDFs, knowledge docs), test artifacts, `.vault_cache/`.

### Code rules

- Always read before editing; do not change code not read first.
- Prefer existing files; do not create new files when editing suffices.
- IIFE pattern for vanilla JS; CSS inherits from `research.css` with the `pt-*` namespace.
- Python: `pathlib.Path`, force UTF-8, respect Windows MAX_PATH (truncate titles to 100 chars).

### TodoWrite

Use for multi-step tasks (three or more steps) and long operations. Mark `in_progress` before work and `completed` immediately after; only one task `in_progress` at a time.

---

## Known Issues and Gotchas

| Problem | Solution |
|---------|----------|
| Windows `nul` file | Ignore (reserved device name, not git-tracked) |
| "Kernaussage" vs "Kernbefund" | Correct is "Kernbefund" (Core Finding) |
| Benchmark numbers | The merge bug (sequential ID instead of Zotero_Key, fixed 2026-03-27) made all pre-fix figures wrong. The canonical figures live in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion; the union-vs-corpus and disagreement-count caveats apply. Do not resurrect old numbers from history. |
| Source_Tool field | Mostly empty; the provider split is a Zotero-Collections estimate |
| D3 Sankey links invisible | Use `fill: none` plus `stroke-width`, not `fill` |
| Title matching | Five-strategy cascade (Stage1-JSON, KD-YAML, filename prefix, author+year, fuzzy) |
| Windows MAX_PATH | Truncate filenames to 100 chars before the suffix |
| `human_yes_rate` / `agent_yes_rate` | Scale 0 to 100, not 0 to 1 |
| Gender category definition | The definition says "explicit gender focus" but experts read feminist theory as gender-relevant; Sonnet follows it literally, Haiku looser. Consider broadening it. |

---

## Milestones

The research artifacts (the identified corpus, the benchmark, the Evidence Companion, and the vault) are produced. Per ADR-019 the review counts complete only once all of its data is carried through PRISM; the active work is that pass, the PRISM tool, the first-round record (Stage R), and the round-2 update, tracked in `knowledge/plan.md` under Stage A/R/B/C and TP1 to TP7. The Forum paper is submitted and closed.

---

*This file is for Claude (me) only. Users should read `knowledge/INDEX.md` instead.*
