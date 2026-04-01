# Status (2026-03-27)

## Current Focus: Human Assessment Completed, Benchmark Corrected

Human Assessment complete (303/303). Critical merge bug in benchmark/scripts/merge_assessments.py found and fixed (matched by sequential ID instead of Zotero_Key). Benchmark fully recalculated with correct pairing.
Next focus: M8 Paper finalization (deadline May 4). Divergence classification must be rerun with the new disagreements.

---

## Milestone Plan (through May 4, 2026)

### M1: Knowledge Consolidation -- COMPLETED

- [x] Files renamed (numeric prefixes removed)
- [x] Redundancies eliminated (PAPER_VS_REPO.md, WORKFLOW.md, index.md)
- [x] CLAUDE.md corrected
- [x] All cross-references updated
- Commit: `ff558e2`

### M2: Epistemic Infrastructure as Guiding Concept -- COMPLETED

- [x] Epistemic infrastructure established as guiding concept
- [x] Theoretical framework documented (project.md)
- Commit: `d7d4557`

### M3: Deep Research Prompts Restored -- COMPLETED

- [x] Prompt template from Git history (`knowledge/Operativ.md`) restored to `prompts/deep-research-template.md`
- [x] Reconstructed parameterization documented (what is known, what is lost)
- Commit: (see Git log)

### M4: Corpus Cleanup (326 vs 305) -- COMPLETED

- [x] HA CSV aligned with current Zotero export (292 shared, 34 Zotero-only, 13 HA-only)
- [x] Duplicates flagged (95 total: 76 title-based in Zotero + 60 in HA, with overlap)
- [x] `papers_full.csv` generated (326 rows, Has_HA column for mapping)
- [x] Generator script: `benchmark/scripts/generate_papers_csv.py`
- Benchmark basis: 326 papers, intersection with HA for kappa calculation
- Commit: (see Git log)

### M5: 10K LLM Assessment Execution -- COMPLETED

- [x] `assessment_prompt.md` synchronized with code (3 inconsistencies fixed: role, KI_Sonstige, negative constraints)
- [x] Examples added for all 10 categories in `categories.yaml` (v1.2)
- [x] Assessment executed: 326/326 papers, ~$1.44, Haiku 4.5
- [x] Result: `benchmark/data/llm_assessment_10k.csv` (232 Include, 94 Exclude)
- Commit: (see Git log)

### M6: Subset Benchmark Execution -- COMPLETED

- [x] Human Assessment CSV exported (`benchmark/data/human_assessment.csv`, 304 papers, 210 with Decision)
- [x] `merge_assessments.py` executed: 304 papers with both assessments, 22 LLM-only
- [x] `calculate_agreement.py` executed: Cohen's Kappa calculated
- [x] `analyze_disagreements.py` executed: 111 disagreements identified
- [x] Results documented in `benchmark/results/`
- Commit: `07c4ac6`

**Core Results (Confusion Matrix + Base Rates):**

| Metric | Value |
|--------|-------|
| Papers with both assessments | 291 (of 303 Human, 326 LLM) |
| **Human Include Rate** | **46.0% (134/291)** |
| **LLM Include Rate** | **71.5% (208/291)** |
| Difference | 25.5 percentage points |
| Total disagreements | 142 |
| Cohen's Kappa | 0.056 ("slight") |

**Confusion Matrix:**

```
                    LLM Include    LLM Exclude
Human Include          100              34
Human Exclude          108              49
```

**Category Agreement (correct Zotero_Key pairing):**

| Category | Agreement | Kappa | Interpretation | Human Yes | LLM Yes |
|----------|-----------|-------|----------------|-----------|---------|
| Soziale_Arbeit | 93.2% | 0.816 | almost perfect | 23.8% | 24.7% |
| Feministisch | 91.0% | 0.753 | substantial | 21.4% | 26.1% |
| Prompting | 80.1% | 0.533 | moderate | 36.9% | 22.0% |
| Bias_Ungleichheit | 79.5% | 0.439 | moderate | 78.6% | 73.5% |
| KI_Sonstige | 77.0% | 0.535 | moderate | 63.8% | 51.9% |
| AI_Literacies | 76.0% | 0.488 | moderate | 26.1% | 43.3% |
| Generative_KI | 75.8% | 0.538 | moderate | 57.2% | 38.1% |
| Diversitaet | 70.1% | 0.432 | moderate | 62.4% | 39.3% |
| Fairness | 69.2% | 0.388 | fair | 49.1% | 63.7% |
| Gender | 68.0% | 0.407 | moderate | 61.1% | 31.6% |

**Note on the Merge Bug (fixed 2026-03-27):** The previous benchmark results (Kappa 0.035, confusion matrix 65/23/78/34) were based on a faulty merge by sequential ID instead of Zotero_Key. 301 of 304 pairings compared different papers. The category kappas were partly negative -- this was noise, not substantive divergence. With correct pairing, all category kappas fall in the range 0.39--0.82.

**Divergence Patterns:** 142 disagreements identified (108 LLM-Include/Human-Exclude, 34 reversed). The qualitative classification into patterns (Semantic Expansion, Keyword Inclusion, Implicit Field Membership) must be rerun with the correctly paired disagreements.

### Model Comparison: Haiku 4.5 vs. Sonnet 4.6 (2026-04-01)

Controlled experiment: same prompt, same data, same human baseline, different model.

**Decision-Level:**

| Metric | Haiku 4.5 | Sonnet 4.6 | Human |
|--------|-----------|------------|-------|
| Include Rate | 71.5% | 82.5% | 46.0% |
| Decision Kappa | 0.056 | 0.098 | -- |
| LLM-Incl/Human-Excl | 108 | 122 | -- |
| Human-Incl/LLM-Excl | 34 | 16 | -- |
| Disagreements total | 142 | 138 | -- |
| Cost | $1.44 | ~$12 | -- |

**Category-Level Kappa:**

| Category | Haiku κ | Sonnet κ | Delta |
|----------|---------|----------|-------|
| Soziale_Arbeit | 0.816 | 0.821 | +0.005 |
| Feministisch | 0.753 | **0.819** | **+0.066** |
| Generative_KI | 0.538 | 0.556 | +0.018 |
| Prompting | 0.533 | 0.555 | +0.022 |
| KI_Sonstige | 0.535 | 0.551 | +0.016 |
| AI_Literacies | 0.488 | 0.479 | -0.009 |
| Bias_Ungleichheit | 0.439 | 0.460 | +0.021 |
| Diversitaet | 0.432 | 0.425 | -0.007 |
| Gender | 0.407 | **0.284** | **-0.123** |
| Fairness | 0.388 | 0.378 | -0.010 |

**Key finding:** A more capable model does not close the gap -- it shifts it. Sonnet includes even more aggressively (82.5% vs. 71.5%), widening the asymmetry with expert judgment (46%). Gender kappa drops sharply (0.407 -> 0.284), while Feministisch improves to near-perfect agreement (0.819). The divergence is structural-epistemic, not performance-based. The infrastructure is necessary regardless of model quality.

### M7: Benchmark Results Documentation -- COMPLETED

- [x] Benchmark metrics documented (confusion matrix, base rates, category kappas)
- [x] Divergence analysis: 3 patterns with concrete examples
- [x] Jagged-Frontier concept (Mollick) integrated
- Commit: (see Git log)

### M9 (Nice-to-Have): Vault + GitHub Pages

- [x] Static GitHub Pages site for knowledge exploration -- **IMPLEMENTED**
  - `docs/` SPA rebuilt: 4-tab layout (Papers, Benchmark, Dashboard, Graph)
  - Data pipeline: `pipeline/scripts/generate_docs_data.py` -> `docs/data/research_vault_v2.json`
  - GitHub Pages: https://chpollin.github.io/FemPrompt_SozArb/
- [x] Vault building (Obsidian): `pipeline/scripts/generate_vault.py` with assessment integration
  - 249 papers, 205 with assessment data (LLM + Human), 79 Concept Notes
  - ZIP for download: `docs/downloads/vault.zip`

### M10: Promptotyping v1 -- ARCHIVED (replaced by M12)

### M11: Promptotyping v2 -- ARCHIVED (replaced by M12)

- Vault v2 Generator (`scripts/generate_vault_v2.py`, ~1660 lines)
  - LLM concept extraction: 249 papers -> 136 consolidated concepts (freq >= 2)
  - LLM divergence classification: 111 cases in vault (142 total, vault regeneration pending) -> 3 patterns (52% Semantic, 30% Implicit, 18% Keyword; Sonnet 4.6 reclassification)
  - 4 vault document types: Papers (248), Concepts (136), Pipeline (5), Divergences (111; 142 after bugfix, regeneration pending)

### M12: Evidence Companion -- COMPLETED

Complete redesign as academic companion publication. 4 views: Knowledge Chat (default) > Knowledge Graph > Categories > Corpus.

### M13: Knowledge Taxonomy -- PLANNED

Knowledge Graph redesign: from flat concept graph to navigable taxonomy.

---

## Assessment

**One corpus (326 papers), two assessment tracks:**

| Track | Method | Schema | Status |
|-------|--------|--------|--------|
| **Human** | Google Sheets | 10 binary categories | **Complete (303/303, 142 Include, 161 Exclude)** |
| **LLM (5D)** | Claude Haiku 4.5 | 5 dimensions (0-3) | Complete (325/325) |
| **LLM (10K)** | Claude Haiku 4.5 | 10 binary categories | **Complete (326/326)** |

### Human Assessment -- COMPLETED

| Aspect | Status |
|--------|--------|
| Papers in CSV | 303 (1 defective row removed) |
| Decisions made | 303/303 (142 Include, 161 Exclude) |
| Schema | 10 binary categories (Technical + Social) |
| Assessors | Susi Sackl-Sharif, Christopher Pollin (27 corrections/additions) |

### LLM Assessment (5D - Complete)

325/325 papers, 222 Include, 83 Exclude, 20 Unclear, $1.15

### LLM Assessment (10K - Complete)

326/326 papers, 232 Include, 94 Exclude, $1.44

---

## Pipeline

### PDF Acquisition and Conversion (Complete)

| Phase | Result |
|-------|--------|
| Total PDFs | 257/326 (78.8%) |
| Markdown conversion | 252/257 (98.1%) |
| Failed | 5 (corrupt PDFs) |
| Quality score (average) | 93.1/100 |

### Knowledge Distillation (Complete + Verified)

| Aspect | Status |
|--------|--------|
| Documents processed | 249/252 (98.8%) |
| Verified quality | 242/249 perfect (97.2%) |
| API costs | ~$7 (total) |

---

## Selection Audit

### Provider Distribution (from `human_assessment.csv`, 305 papers)

| Provider | Papers | Share (DR) | DOI available |
|----------|--------|------------|---------------|
| Perplexity | 75 | 29.5% | 22 (29%) |
| Claude | 63 | 24.8% | 37 (59%) |
| ChatGPT | 62 | 24.4% | 42 (68%) |
| Gemini | 54 | 21.3% | 22 (41%) |
| **Deep Research total** | **254** | **100%** | **123 (48%)** |
| Manual (supplementary) | 50 | -- | 40 (80%) |

### Missingness Indicators

| Indicator | Value |
|-----------|-------|
| PDF acquisition rate | 257/326 (79%) |
| Not acquirable | 69/326 (21%) -- access barriers |
| Markdown conversion rate | 252/257 (98%) |
| Knowledge document rate | 249/252 (99%) |
| **Total loss rate** (Zotero -> knowledge document) | 77/326 (23.6%) |

### Pending

- [ ] OA analysis: Open Access status of the 326 papers via Unpaywall API (DOI-based, only possible for 53%)
- [ ] Overall overlap: not computable with available data

---

## Failed PDF Conversions (5)

1. `British_Association_of_Social_Workers_2025_Generat.pdf` - Data format error
2. `Browne_2023_Feminist_AI_Critical_Perspectives_on_Algorithms,.pdf` - Page dimension error
3. `Ulnicane_2024_Intersectionality_in_Artificial_Intelligence.pdf` - Conversion failure
4. `UNESCO__IRCAI_2024_Challenging.pdf` - Not valid
5. `Workers_2025_Generative.pdf` - Not valid

---

*Updated: 2026-04-01*
