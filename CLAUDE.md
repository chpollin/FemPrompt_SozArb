# Working Rules for Claude AI Assistant

**Project:** FemPrompt SozArb, a systematic literature review on feminist AI literacies in social work
**Last Updated:** 2026-08-24

---

## Core Argument

This project implements a traceable workflow for an LLM- and agent-assisted literature review. Reliability is established through recorded evidence, provenance, deterministic validation, source-grounded AI Agent Review, domain-expert verification, and publication approval. PRISM (`docs/prisma.html`) is the governed screening and verification surface. The Grounded Vault carries source-linked knowledge into the literature report and the follow-up paper.

Round one used a comparative expert and LLM assessment under the same ten-category schema. Its divergence remains a motivating illustration and a demonstration of what per-decision records make analysable. Round two uses controlled intake, two operationally isolated AI-agent tracks, a separate source-grounded AI Agent Review, and deferred verification by domain experts. Operational isolation records execution conditions and supports no claim of epistemic independence. Every productive record follows the lifecycle `identified → curated → agent-annotated → ai-agent-reviewed → verified → publication-approved`.

The Forum Wissenschaft 2/2026 paper is submitted and editorially closed; it was written on Google Docs and is not maintained in this repository. The remaining work is tracked in `knowledge/plan.md`. It comprises source and corpus readiness, governed round-two agent annotation, full-corpus analysis, Assertion-backed synthesis, domain-expert verification, and publication approval. The canonical manuscript is `research-vault/40_output/paper/paper.md`. Its methodological integration question frames the paper, while SQ1 to SQ3 report the workflow's yield for social-work researchers planning an LLM-assisted review.

---

## No volatile quantities

Costs and metrics (dollar totals, token counts, kappas, confusion-matrix cells, include rates, corpus and pipeline counts) are NOT hand-maintained in the prose of this file or the knowledge docs. They drift and contradict each other. Numbers live in the data (`generated/benchmark-results/`, `docs/data/`) and in the Evidence Companion that renders them. State findings qualitatively and point there. This file names structural constants (ten categories, four Deep Research models, three pipeline stages) but not run statistics.

---

## Key Terminology

Use these terms consistently. They are defined in `knowledge/INDEX.md` (glossary).

| Term | Definition |
|------|------------|
| Epistemic infrastructure | Systematic arrangement of tools, decision rules, distinct control points, and responsibility assignments that establishes reliability in a research process |
| Distilled knowledge document | Source-specific structured reduction of a full text with traceable source anchors |
| Assertion | Atomic evidence-linked statement over one or more distilled knowledge documents |
| Work | Stable project identity for one scholarly contribution across bibliographic records and publication expressions |
| Publication Version | Exact Preprint, Accepted Manuscript, proof, Version of Record, corrected Version, or other expression used as evidence |
| Work-Version registry | Canonical mapping from Zotero records and intake candidates to one Work and one exact Version |
| Round-1 dual assessment track | Separately recorded expert and LLM assessments used for the first-round comparison |
| Operational isolation | Separate agent contexts, browser states, assignments, and outputs without an epistemic-independence claim |
| Source-grounded AI Agent Review | AI-agent check of annotations and evidence against the Paper source |
| Validation | Deterministic check of structural, referential, or rule conformance; it grants no scholarly authority |
| Verification | Domain-expert assessment of an artifact against its evidence and scholarly meaning |
| Final scholarly authority | Domain-expert responsibility for verification, interpretation, and publication approval |
| Screening lifecycle | Ordered authority states from identification through publication approval |
| Grounded Vault | Evidence chain from sources through Markdown, distillates, Assertions, and outputs |
| Confabulation | Generation of coherent but factually unsupported claims (preferred over "hallucination") |
| Context rot | Degradation of LLM processing quality with increasing input length (Hong et al. 2025) |
| Sycophancy | LLM tendency to over-agree with prompt presuppositions |
| Deep Research | Agent-based LLM systems for iterative, autonomous literature search |
| Evidence Companion | The web-based academic companion publication at chpollin.github.io/FemPrompt_SozArb |
| PRISM | This project's screening tool (`docs/prisma.html`), distinct from the PRISMA reporting standard |

---

## Project Overview

The corpus flows from identification through Zotero curation, Work-Version reconciliation, PDF acquisition, reviewed Docling Markdown, agent annotation, AI Agent Review, internal Grounded Vault synthesis and analysis, artifact-local domain-expert verification, and publication approval. Screening coverage is Work-level; full texts, evidence, distillates, and Assertions retain exact Version provenance.

Three publication layers:
1. **Distilled knowledge** (`generated/distilled/`): source-grounded paper distillates with stage and verification artefacts.
2. **Evidence Companion** (`docs/index.html` plus subpages): five views (Knowledge Chat, Knowledge Graph, Literature Landscape, Categories, Corpus), live at https://chpollin.github.io/FemPrompt_SozArb/.
3. **Paper**: Forum Wissenschaft 2/2026, submitted and closed (on Google Docs). The follow-up paper is led by the infrastructure and the review method, not by a results claim.

`research-vault/` is the curated subject-knowledge layer. `generated/vault/Papers/` is only the generated source of the downloadable paper collection; the former concept, divergence, pipeline, and MOC projections are retired.

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
| `generated/vault/Papers/` | Generated source of the downloadable Obsidian paper collection | Generated |
| `docs/`, `docs/data/` | GitHub Pages web interfaces and generated JSON | Actively edited |
| `generated/benchmark-results/` | Benchmark results; `replay/` holds the committed round-1 replay outputs | Complete |
| `assessment/` | LLM 5D and human assessment | Complete |
| `src/publish/` | Deterministic publishers for paper notes, Companion data, schema, and literature landscape | Actively edited |
| `src/replay/` | Round-1 replay (`replay_round1.py`, self-test against the canonical benchmark) | Yes, with care |
| `research-vault/` | Subject knowledge in the Grounded-Vault chain; protected source and Markdown layers remain local, while legacy `10_distillates/` and `20_claims/` are read-only migration sources | Yes, with care |
| `tests/` | PRISM test layers: jsdom harness, Companion smoke suite, browser pilot, pytest, manual checklist | Yes, with care |
| `paper/` | Expert questions and historical manuscript planning; the canonical paper is `research-vault/40_output/paper/paper.md` | Yes, with care |
| `config/` | `defaults.yaml` (now lists `generated/` paths; the restructure superseded its do-not-change note) | Yes, with care |
| `.vault_cache/` | LLM API cache (reproducible) | Do not change |
| `prompts/` | Versioned prompt governance and changelog | Edit only through a documented prompt version or status change |
| `skills/prism-agent-review/` | Project-local workflow for controlled PRISM agent tracks and source-grounded AI Agent Review | Follow the canonical prompt and run manifest |

### Knowledge documents

`INDEX.md` provides navigation and the glossary. `project.md` carries identity, research questions, and theory. `methods.md`, `standards.md`, `specification.md`, and `data.md` describe the review method, reporting frame, PRISM decisions, and data substrate. `governance.md` defines authority and publication rules, `testing.md` the technical guarantees, and `verification.md` the evidence and authority state of externally relevant claims. `plan.md` carries the forward work, `journal.md` the decision provenance, and `handoff.md` the open process inbox. `update-protocol.md` governs round-two identification, screening, coding, and verification. `research-vault.md` defines the active Grounded Vault model. The paper lane contributes `analysis-divergence.md` and the draft `analysis-sq-advisory.md`. The per-item PRISMA and trAIce conformance state remains machine-readable in `generated/conformance/conformance_map.yaml`. Start at `INDEX.md`.

### Key web files

| File | Purpose |
|------|---------|
| `docs/index.html` | Evidence Companion (5-view SPA, default Knowledge Chat) |
| `docs/prisma.html` | PRISM screening tool |
| `docs/onboarding.html` | Reviewer onboarding (German walkthrough for the two colleagues) |
| `docs/js/research-app.js` | Corpus table, modal tabs, navigation, export |
| `docs/js/wissenschat.js` | Knowledge Chat (Gemini 3 Flash, streaming, citations) |
| `docs/js/wissensnetz.js` | Knowledge Graph (D3 force graph, divergence mode) |
| `docs/js/literaturbild.js` | Annotation-native Literature Landscape with evidence drill-down |
| `docs/js/kategorien.js` | Categories Explorer |
| `docs/js/prisma.js`, `prisma-data.js`, `prisma-import.js` | PRISM logic, data shim, Excel bridge |
| `docs/css/tokens.css`, `research.css`, `literaturbild.css`, `prisma.css` | Shared tokens and view-specific styles |
| `generated/benchmark-results/agreement_metrics.json` | Canonical benchmark metrics |
| `assessment/categories.yaml` | Canonical category definitions |

---

## Evidence Companion (`docs/index.html`)

Academic companion publication. Framework-free vanilla JavaScript with pinned local D3 and Font Awesome assets.

**Live:** https://chpollin.github.io/FemPrompt_SozArb/

| View | Content | JS file |
|------|---------|---------|
| Knowledge Chat (default) | Gemini 3 Flash Q&A, inline citations to Corpus | `wissenschat.js` |
| Knowledge Graph | D3 force graph, cluster layout, divergence mode | `wissensnetz.js` |
| Literature Landscape | PRISM category matrix, analysis profiles, Paper-evidence drill-down | `literaturbild.js` |
| Categories | Ten-category spectrum, rate comparison, divergence papers | `kategorien.js` |
| Corpus (reference layer) | Sortable table, filters, detail modal, export | `research-app.js` |

Subpages: `about.html`, `methoden.html`, `help.html`, `onboarding.html`.

Architecture rules: no build tool and no framework. Runtime libraries are pinned under `docs/vendor/`; npm is used for the test harness and controlled vendor refreshes. IIFE modules communicate through `window.EC`. System font stacks avoid remote font requests. `assessment/categories.yaml` is the canonical source for categories, decision options, and exclusion reasons; `docs/data/category_schema.json` is its generated frontend projection. The chat API key stays in `sessionStorage` for the current tab. Questions and selected research data are sent only when the user calls the model provider. Data lives in `docs/data/research_vault_v2.json`, `concept_graph.json`, `promptotyping_v2.json`, and `literature_landscape.json`. Markdown export produces one concatenated file without a runtime archive library.

---

## Pipeline

Workflow: Zotero papers, Work-Version reconciliation, PDF acquisition (four fallback strategies), Markdown conversion (Docling), three-stage distillation (extract JSON, format Markdown, verify). The acquisition, conversion, and distillation loss chain is quantified in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion, not here.

Knowledge document structure: YAML frontmatter (title, authors, year, type, language, processed, source_file, confidence); sections Core Finding, Research Question, Methodology, Main Arguments, Category Evidence, Assessment Relevance, Key References. Categories live in `_stage1_json/` as booleans, not in the Markdown frontmatter.

---

## Data Flow (JSON)

`promptotyping_v2.json` (generated by `src/publish/generate_promptotyping_data_v2.py`): `meta` (totals, disagreements, kappa, confusion_matrix, rates, pattern_distribution, asymmetry), `papers`, `concepts` (nodes and edges), `divergences`. Note: `meta.total_papers` in the agreement JSONs is the union of the two assessment tracks, not the corpus (see the comment in `src/assess/calculate_agreement.py`).

`research_vault_v2.json` (generated by `src/publish/generate_docs_data.py`): for the Evidence Companion.

`corpus/work_version_registry.json` (generated by `src/analysis/build_work_version_registry.py`): canonical Work and publication-Version identity, record and candidate bindings, preferred/latest selection, peer-review basis, relations, conflicts, and provenance. `docs/data/work_version_contract.json` defines the controlled vocabulary and selection rule.

`literature_landscape.json` (generated by `src/publish/generate_literature_landscape.py`): the verified, annotation-native Companion projection of the productive PRISM track. Its thematic records are Include-only, while progress retains all annotated decisions and source status.

---

## Canonical Locations (Redundancy Rules)

Each piece of information has exactly ONE canonical location. Other files reference, never duplicate.

| Information | Canonical Location |
|-------------|-------------------|
| Benchmark figures, the divergence and its decomposition | the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion |
| Script reference, pipeline method | `knowledge/methods.md` |
| Category definitions | `assessment/categories.yaml` |
| Work identity, publication Version, and bibliographic relations | `corpus/work_version_registry.json` and `docs/data/work_version_contract.json` |
| Theory and operationalization | `knowledge/project.md` |
| Glossary | `knowledge/INDEX.md` |
| Remaining work and operator decisions | `knowledge/plan.md` |
| Authority, lifecycle and publication rules | `knowledge/governance.md` |
| Technical guarantees | `knowledge/testing.md` |
| Claim and artifact verification state | `knowledge/verification.md` |
| Standards (PRISMA, trAIce, RAISE) | `knowledge/standards.md` |
| Work journal | `knowledge/journal.md` |
| Subject knowledge of the literature (what the sources say, in which check state) | `research-vault/`, modelled in `knowledge/research-vault.md` |

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

### Gates before committing

`npm test` (jsdom harness and Companion smoke suite), `python -m pytest tests/`, and `python -m src.publish.check_claims` when the claims layer was touched. The browser pilot (`npm run pilot`) runs before anything that changes the screening path. A green anchor check is the precondition of the `grounded` status of the claims layer, not a formality.

### Git workflow

- Commit format: `[type]: [description]` (feat, fix, docs, refactor, test, chore).
- Commit frequently after each logical change.
- Branch off main for substantial work; NEVER force-push to main.
- Do not commit secrets, licensed PDFs or full texts, disposable browser output, or `.vault_cache/`. A verified open-access source conversion may be committed when its frontmatter records the stable source, authorship, licence, and conversion provenance. Governed reviewer records and reproducibility manifests are versioned research data and may be committed after their validation gates pass.

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

## Current completion boundary

The identified corpus, the round-one benchmark, PRISM, the Evidence Companion, and the initial Grounded Vault layers exist. The review is complete when the intended corpus has a reviewed source basis, every productive round-two record has passed the governed lifecycle, the literature analysis is derived from the completed records, Assertions support the report and paper, and domain experts have verified the scholarly outputs. Public projections additionally require publication approval. `knowledge/plan.md` is the canonical forward record.

---

*This file is for Claude (me) only. Users should read `knowledge/INDEX.md` instead.*
