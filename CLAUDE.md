# Working Rules for Claude AI Assistant

**Project:** FemPrompt SozArb -- Systematic Literature Review on Feminist AI Literacies in Social Work
**Last Updated:** 2026-04-01

---

## Core Argument

This project builds an **epistemic infrastructure** for an LLM-assisted literature review. The central thesis: reliability cannot be presupposed as a property of the system but must be established as a property of the research process. The workflow is organized around **verification checkpoints** -- defined points after each AI-assisted step where human or rule-based control checks results before they flow into the next stage.

326 scientific papers were identified via 4 proprietary Deep Research systems (OpenAI, Google, Perplexity, Anthropic) and processed through a five-step workflow. A **dual assessment track** runs expert and LLM evaluation in parallel on the same 10-category schema, without mutual knowledge. The result: substantial divergence (LLM include rate 71.5% vs. expert 46.0%), asymmetrically distributed (108 cases LLM-Include/Expert-Exclude vs. 34 reversed). This divergence is the empirical core -- it demonstrates why the infrastructure is necessary.

The paper (Forum Wissenschaft 2/2026, deadline May 4) is being written on Google Docs, not in this repo.

---

## Key Terminology

Use these terms consistently. They are defined in `knowledge/project.md` (glossary).

| Term | Definition |
|------|------------|
| Epistemic infrastructure | Systematic arrangement of tools, decision rules, verification checkpoints, and responsibility assignments that establishes reliability in a research process |
| Distillation pipeline | 3-stage knowledge extraction from full texts: (1) LLM extract + classify, (2) deterministic formatting, (3) LLM verification against original |
| Dual assessment track | Parallel, independent evaluation by experts and LLM using identical 10-category schema |
| Verification checkpoint | Defined point where human or rule-based control checks AI-generated results |
| Knowledge document | Structured summary of a paper with core finding, methodology, arguments, category evidence, confidence score |
| Confabulation | Generation of coherent but factually unsupported claims (preferred over "hallucination") |
| Context rot | Degradation of LLM processing quality with increasing input length (Hong et al. 2025) |
| Sycophancy | LLM tendency to over-agree with prompt presuppositions |
| Deep Research | Agent-based LLM systems for iterative, autonomous literature search |
| Evidence Companion | The web-based academic companion publication at chpollin.github.io/FemPrompt_SozArb |

---

## Project Overview

326 papers are processed through a five-step workflow (Identification -> PDF Acquisition -> Markdown Conversion -> Knowledge Extraction -> Assessment). Core question: **What happens to knowledge when it flows through a distillation pipeline?**

The project has three layers:
1. **Obsidian Vault** -- 505 Markdown files (248 Papers, 136 Concepts, 111 Divergences [142 after bug fix, vault regeneration pending], 5 Pipeline stages, MOCs)
2. **Evidence Companion** -- `docs/index.html` + subpages. 4 Views: Knowledge Chat, Knowledge Graph, Categories, Corpus. Live: https://chpollin.github.io/FemPrompt_SozArb/
3. **Paper** -- Forum Wissenschaft 2/2026, deadline May 4, 2026 (on Google Docs, not in repo)

### Benchmark Results (correct since 2026-03-27)

| Metric | Value |
|--------|-------|
| LLM Include Rate | 71.5% (208/291) |
| Human Include Rate | 46.0% (134/291) |
| Difference | 25.5 percentage points |
| LLM-Include/Human-Exclude | 108 cases |
| Human-Include/LLM-Exclude | 34 cases |
| Cohen's Kappa (decision) | 0.056 ("slight") |
| Category Kappas | 0.39--0.82 (Soziale_Arbeit highest, Gender lowest) |
| Divergence patterns | Semantic Expansion (52%), Implicit Field Membership (30%), Keyword Inclusion (18%) |

### Model Comparison: Haiku 4.5 vs. Sonnet 4.6 (2026-04-01)

Controlled experiment: same prompt, same data, same human baseline, different model (~$12).

| Metric | Haiku 4.5 | Sonnet 4.6 | Human |
|--------|-----------|------------|-------|
| Include Rate | 71.5% | 82.5% | 46.0% |
| Decision Kappa | 0.056 | 0.098 | -- |
| Gender Kappa | 0.407 | **0.284** | -- |
| Feministisch Kappa | 0.753 | **0.819** | -- |

Key finding: Sonnet separates "Feministisch" from "Gender" -- it classifies feminist papers (e.g. "Data Feminism for AI") as Feministisch=Yes, Gender=No. The divergence is an operationalization gap in the Gender category definition, not a model quality issue. Details: `knowledge/status.md`.

### Assessment Tracks

| Track | Method | Schema | Status |
|-------|--------|--------|--------|
| **Human** | Google Sheets | 10 binary categories | Complete (303/303, 142 Include, 161 Exclude) |
| **LLM (5D)** | Claude Haiku 4.5 | 5 dimensions (0-3) | Complete (archived) |
| **LLM (10K)** | Claude Haiku 4.5 | 10 binary categories | Complete (326/326, Benchmark) |

---

## Repository Structure

### Directories

| Directory | Contents | Edit? |
|-----------|----------|-------|
| `knowledge/` | **Single source of truth** for all project documentation | Yes, with care |
| `pipeline/knowledge/distilled/` | 249 knowledge documents | Read-only |
| `pipeline/knowledge/_stage1_json/` | Raw JSON extractions (categories as booleans) | Read-only |
| `pipeline/knowledge/_stage2_draft/` | Markdown drafts | Read-only |
| `pipeline/knowledge/_verification/` | 219 verification files | Read-only |
| `vault/` | Obsidian Vault v2 (248 Papers, 136 Concepts, 111 Divergences [142 after bug fix]) | Generated |
| `docs/` | GitHub Pages: web interfaces + data + downloads | Actively edited |
| `docs/data/` | JSON data for web interfaces | Generated |
| `benchmark/` | Benchmark scripts + results + configuration | Complete |
| `assessment/` | LLM Assessment (5D) + Human Assessment | Complete |
| `scripts/` | Generators (Vault v2, Promptotyping data) | Actively edited |
| `config/` | `defaults.yaml` -- single config file | Do not change |
| `.vault_cache/` | LLM API cache (360 JSON files, reproducible) | Do not change |
| `prompts/` | Prompt governance + CHANGELOG | Read-only |

### Key Files

| File | Purpose | Edit? |
|------|---------|-------|
| `knowledge/status.md` | **Current state, milestones, benchmark results** | Yes |
| `knowledge/journal.md` | Work journal (chronological) | Yes |
| `knowledge/methods-and-pipeline.md` | Methods, script reference, costs | Rarely |
| `knowledge/project.md` | Theory, research questions, glossary | Rarely |
| `knowledge/README.md` | Documentation index | Yes |
| `knowledge/paper-integrity.md` | Paper vs. repo comparison (paper on Google Docs) | Rarely |
| `docs/index.html` | **Evidence Companion** (4-view SPA, default: Knowledge Chat) | **Active** |
| `docs/about.html` | Subpage: project, citation suggestion | Active |
| `docs/methoden.html` | Subpage: pipeline, category system, reuse | **Active** |
| `docs/help.html` | Subpage: user guide for all views | Active |
| `docs/js/research-app.js` | Main IIFE: data, table, modal tabs, navigation, export (~1100 lines) | **Active** |
| `docs/js/wissenschat.js` | Knowledge Chat: Gemini 3 Flash, streaming, citations (~620 lines) | **Active** |
| `docs/js/wissensnetz.js` | Knowledge Graph: D3 force graph, cluster layout, divergence mode (~780 lines) | **Active** |
| `docs/js/kategorien.js` | Categories Explorer: spectrum, detail, cross-view (~300 lines) | **Active** |
| `docs/css/research.css` | All styles (~1600 lines, refactored) | **Active** |
| `scripts/generate_vault_v2.py` | Vault v2 generator (~1660 lines, LLM calls) | Rarely |
| `benchmark/results/agreement_metrics.json` | Canonical benchmark metrics | Read-only |
| `benchmark/config/categories.yaml` | Canonical category definitions | Read-only |

---

## Evidence Companion (`docs/index.html`)

Academic companion publication to the paper. Vanilla JS + Chart.js + D3 via CDN.

**Live:** https://chpollin.github.io/FemPrompt_SozArb/

| View | Content | JS File |
|------|---------|---------|
| **Knowledge Chat** (default) | Gemini 3 Flash Q&A, inline citations -> Corpus, reference list | `wissenschat.js` |
| **Knowledge Graph** | D3 force graph, cluster layout (Bridge/Social), divergence mode, hover glow | `wissensnetz.js` |
| **Categories** | 10-category spectrum (Object->Perspective), rate comparison, divergence papers with LLM reasoning | `kategorien.js` |
| **Corpus** (reference layer) | Sortable table, filters, detail modal with tabs (Assessment + Knowledge Document), CSV/Markdown/Vault export | `research-app.js` |

**Subpages:** `about.html` (project, citation), `methoden.html` (pipeline, categories, LLM reuse), `help.html` (user guide)

**Architecture rules:**
- No build tool, no framework, no npm. CDN only (D3, Chart.js, Fuse.js, FontAwesome).
- IIFE pattern for all JS files, communication via `window.EC` API
- IBM Plex Serif (headings) + Inter (body)
- 10 categories as spectrum color system (gender-neutral, rainbow gradient in header)
- Detail panel as side panel (slide-in, 480px, table compression)
- Chat: API key local (localStorage + `config.local.js`, gitignored). Model: `gemini-3-flash-preview`
- Data: `docs/data/research_vault_v2.json` + `docs/data/concept_graph.json` + `docs/data/promptotyping_v2.json`
- Exports: JSZip via CDN for Markdown-ZIP export with system prompt

---

## Pipeline

### Workflow

```
326 Zotero Papers -> 257 PDFs (4 fallback strategies) -> 252 Markdown (Docling)
-> 249 Knowledge Docs (3-stage distillation: Extract JSON -> Format MD -> Verify)
```

Loss rate: 77/326 (23.6%) -- predominantly in PDF acquisition.

### Knowledge Document Structure

- YAML frontmatter: title, authors, year, type, language, processed, source_file, confidence
- Sections: Core Finding, Research Question, Methodology, Main Arguments, Category Evidence, Assessment Relevance, Key References
- **Categories are in `_stage1_json/`** as booleans, NOT in MD frontmatter

### LLM Costs (total)

| Component | Cost |
|-----------|------|
| Knowledge Distillation (249 papers) | ~$7 |
| 5D Assessment (325 papers) | $1.15 |
| 10K Assessment (326 papers) | $1.44 |
| Vault v2 (concepts + divergences) | ~$1 |
| **Total** | **~$10.59** |

---

## Data Flow (JSON)

### promptotyping_v2.json

Generated by `scripts/generate_promptotyping_data_v2.py`. Structure:

```
{
  "meta": { total_papers, disagreements, kappa, confusion_matrix, rates,
            pattern_distribution, asymmetry },
  "papers": [{ id, stem, title, author_year, stages, concepts, knowledge_summary }],
  "concepts": { nodes: [{ id, label, frequency, cluster, definition }],
                edges: [{ source, target, weight }] },
  "divergences": [{ paper_id, title, human_decision, llm_decision,
                    pattern, justification, severity, category_comparison, llm_reasoning }]
}
```

### research_vault_v2.json

Generated by `pipeline/scripts/generate_docs_data.py`. For Evidence Companion.

---

## Canonical Locations (Redundancy Rules)

Each piece of information has exactly ONE canonical location. Other files reference, never duplicate.

| Information | Canonical Location |
|-------------|-------------------|
| Benchmark results | `knowledge/status.md` (M6) + `benchmark/results/agreement_metrics.json` |
| Kappa revision | `knowledge/paper-integrity.md` section 3.6 + `knowledge/status.md` M6 |
| Script reference | `knowledge/methods-and-pipeline.md` |
| Pipeline statistics | `knowledge/status.md` + `knowledge/methods-and-pipeline.md` |
| Category definitions | `benchmark/config/categories.yaml` |
| Theory + operationalization | `knowledge/project.md` |
| Work journal | `knowledge/journal.md` |

---

## Working Conventions

### Session Start

1. Read `knowledge/status.md` (current state)
2. Check `git status` + `git log -3` (branch + recent commits)
3. Read `knowledge/journal.md` (last session, open items)
4. Create TodoWrite for multi-step tasks

### Documentation Rules

- **Language:** English for all documentation and code
- **No emojis** in documentation files
- **Date footer:** `*Updated: YYYY-MM-DD*` (no version numbers)
- **Tables** for comparisons, lists for enumerations
- **Update journal** for every substantive session

### Git Workflow

- **Commit format:** `[type]: [description]` (feat, fix, docs, refactor, test, chore)
- **Commit frequently** after each logical change
- **Push:** `git push -u origin <branch-name>`
- **NEVER** force push to main
- **Current branch:** `main`

**Do not commit:** `.env`, generated data (PDFs, Knowledge Docs), test artifacts, `.vault_cache/`

### Code Rules

- **Always read before editing** -- no changes to code not read first
- **Prefer existing files** -- do not create new files when editing suffices
- **IIFE pattern** for vanilla JS (`(function() { 'use strict'; ... })();`)
- **CSS:** Inherit variables from `research.css`, `pt-*` namespace for custom variables
- **Python:** `pathlib.Path` for file paths, force UTF-8, respect Windows MAX_PATH (truncate titles to 100 chars)

### TodoWrite

**ALWAYS use** for:
- Multi-step tasks (3+ steps)
- Long operations
- User requests with multiple items

**Update in real-time:**
- `in_progress` BEFORE work begins
- `completed` IMMEDIATELY after completion
- Only ONE task `in_progress` at a time

---

## Known Issues & Gotchas

| Problem | Solution |
|---------|----------|
| Windows `nul` file | Ignore (reserved device name, not git-tracked) |
| Knowledge Doc "Kernaussage" vs "Kernbefund" | Correct is "Kernbefund" (Core Finding) |
| 326 Zotero vs 303 HA papers | 291 overlap by Zotero_Key, 12 human-only, 35 LLM-only |
| Merge bug (fixed 2026-03-27) | merge_assessments.py matched by sequential ID instead of Zotero_Key. All old benchmark values (Kappa 0.035, Matrix 65/23/78/34) were wrong. New: Kappa 0.056, Matrix 100/34/108/49 |
| Kappa 0.056 | Decision kappa "slight", category kappas 0.39--0.82 |
| Source_Tool field empty | 290/326 empty, "254 DR / 50 Manual" from Zotero Collections |
| D3 Sankey links invisible | Use `fill: none` + `stroke-width` (NOT `fill`) |
| Title matching | 5-strategy cascade (Stage1-JSON, KD-YAML, Filename-Prefix, Author+Year, Fuzzy) |
| Windows MAX_PATH | Truncate filenames to 100 chars before suffix |
| `human_yes_rate` / `agent_yes_rate` | Scale 0-100 (e.g. 32.7 = 32.7%), NOT 0-1 |
| Vault divergences | 111 files in vault but 142 disagreements in data (vault regeneration pending) |
| Knowledge doc linking | 236 linked in JSON but 249 on disk (title matching gap in generator) |
| Gender category definition | Definition says "explicit gender focus" but experts read feminist theory as gender-relevant. Sonnet follows definition literally, Haiku is looser. Consider broadening definition. |

---

## Milestone Status (Summary)

| M | Name | Status |
|---|------|--------|
| M1 | Knowledge consolidation | Completed |
| M2 | Epistemic infrastructure concept | Completed |
| M3 | Deep Research prompts | Completed |
| M4 | Corpus cleanup | Completed |
| M5 | 10K LLM Assessment | Completed |
| M6 | Subset benchmark | Completed |
| M7 | Results documented | Completed |
| M8 | Paper finalization | **Open** (review round, submission May 4) |
| M9 | Vault + GitHub Pages | Completed |
| M10 | Promptotyping v1 | Archived (replaced by M12) |
| M11 | Promptotyping v2 | Archived (replaced by M12) |
| M12 | Evidence Companion | **Completed** (4 views, chat, modals, merged) |
| M13 | Knowledge Graph + Categories | **Completed** (cluster layout, divergence mode, categories explorer) |

---

## Key Innovations

1. **LLM-based PRISMA assessment** -- 326/326, 100% success rate, $1.44
2. **5-dimensional relevance scoring** -- Parametric, adaptable
3. **Hierarchical PDF acquisition** -- 4 fallback strategies, 79% success rate
4. **Human-LLM benchmark** -- Confusion matrix + base rates as primary metrics
5. **Epistemic divergence analysis** -- 142 disagreements classified into 3 patterns (52/30/18%, Sonnet 4.6)
6. **Knowledge Chat** -- Gemini 3 Flash over LLM-synthesized knowledge, inline citations with cross-view navigation
7. **Categories Explorer** -- 10 categories as interactive spectrum, rate comparison Human/LLM, divergence papers with reasoning
8. **Knowledge Graph** -- D3 cluster layout (Bridge/Social), divergence mode with pattern coloring, hover glow
9. **Knowledge Document tab** -- LLM-extracted sections (core finding, methodology, arguments) browseable in paper detail
10. **Curated Markdown export** -- Filtered knowledge documents as ZIP with system prompt for LLM reuse
11. **Obsidian Vault v2** -- 505 interlinked Markdown files with LLM-extracted concepts
12. **Controlled model comparison** -- Haiku 4.5 vs. Sonnet 4.6 on same data/prompt. Reveals that a more capable model shifts divergence rather than closing it (Gender-Feministisch split)

---

*This file is for Claude (me) only. Users should read knowledge/README.md instead.*
