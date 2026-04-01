# Paper Text vs. Repository: Integrity Check

Systematic comparison between the paper text (Forum Wissenschaft, based on knowledge document v12) and the actual repository state. Synthesized from three checks: v8, v12, and sentence-level verification of the final text. The earlier v8 check (formerly `PAPER_VS_REPO.md` in root) is fully integrated here.

**Core principle:** The repository is ground truth. Where paper and repo contradict, the paper must be adjusted.

---

## Methodology

Every substantive claim in the paper was checked against code, data, and documentation. Results in five categories:

| Category | Meaning |
|----------|---------|
| VERIFIED | Paper and repo agree |
| CORRECTED | Paper v12 fixed a v8 problem |
| DEVIATION | Paper claims something different from repo |
| NOT VERIFIABLE | Claim cannot be checked against repo |
| MISSING IN PAPER | Repo has relevant content not in paper |

---

## 1. Verified Claims

### 1.1 Workflow Architecture

| Paper Claim | Repo Evidence | Status |
|-------------|---------------|--------|
| 3-stage knowledge distillation (LLM Extract, Deterministic Format, LLM Verify) | `pipeline/scripts/distill_knowledge.py`: Stage 1 = `STAGE1_EXTRACT_CLASSIFY_PROMPT`, Stage 2 = template rendering (no API call), Stage 3 = `STAGE3_VERIFY_PROMPT` | VERIFIED |
| Stage 2 deterministic, no LLM involvement | `stage2_format_markdown()` contains no API call, only local string formatting | VERIFIED |
| Confidence score: Completeness 40%, Correctness 40%, Categories 20%, threshold < 75 | `distill_knowledge.py` line 276 confirms exactly | VERIFIED |
| "Low confidence score triggers marking, signal to human" | `needs_correction: true` at score < 75, confirmed in code | VERIFIED |
| Docling for PDF-to-Markdown conversion | `pipeline/scripts/convert_to_markdown.py` uses Docling (>=2.60.0) | VERIFIED |
| Browser tool for visual validation (PDF left, Markdown right) | `pipeline/tools/markdown_reviewer.html` (667 lines): dual-pane with page alignment, PASS/WARN/FAIL, keyboard shortcuts | VERIFIED |
| PDF acquisition: hierarchical fallback strategy (Zotero, DOI, Unpaywall, ArXiv) | `pipeline/scripts/acquire_pdfs.py`: exactly 4 priority levels | VERIFIED |
| "Paywall-protected literature is systematically missing" | Loss rate 69/326 (21.2%) at PDF acquisition | VERIFIED |

### 1.2 Assessment System

| Paper Claim | Repo Evidence | Status |
|-------------|---------------|--------|
| Dual assessment track (Human parallel to LLM) | Both systems exist as conceptually parallel tracks | VERIFIED |
| 10 binary categories (4 technical + 6 social) | `benchmark/config/categories.yaml` confirms exactly | VERIFIED |
| Inclusion logic: min. 1 technical AND min. 1 social | Implemented in YAML and `run_llm_assessment.py` | VERIFIED |
| LLM Assessment (5D): 325 papers, 100% success rate | `assessment-llm/output/assessment_llm.xlsx`: 325 rows | VERIFIED |
| Result 5D: 222 Include, 83 Exclude, 20 Unclear | Assessment report confirms | VERIFIED |
| Expert track: Sackl-Sharif and Klinger | README, status documents | VERIFIED |
| PRISMA as shared framework for both tracks | Both assessment systems reference PRISMA | VERIFIED |
| Benchmark executed (M6 complete) | `merge_assessments.py`, `calculate_agreement.py`, `analyze_disagreements.py` executed, results in `benchmark/results/` | VERIFIED |

### 1.3 Numbers and Quantities

| Paper Claim | Repo Evidence | Status |
|-------------|---------------|--------|
| 326 papers in corpus | `corpus/zotero_export.json`: 326 entries | VERIFIED |
| 257 PDFs downloaded | `pipeline/pdfs/`: 257 files | VERIFIED |
| 252 Markdown files | `pipeline/markdown/`: 252 files | VERIFIED |
| 5 failed PDF conversions | `knowledge/status.md` documents | VERIFIED |
| 249 knowledge documents | `pipeline/knowledge/distilled/`: 249 files | VERIFIED |
| 97.2% verification quality (242/249 perfect) | 219+ verification JSONs in `pipeline/knowledge/_verification/` | VERIFIED |
| "No critical cases of ungrounded LLM outputs in current run" (Knowledge Distillation) | Verification reports show none; 7 issues are PDF upstream | VERIFIED |

### 1.4 Theoretical Framework

| Paper Claim | Repo Evidence | Status |
|-------------|---------------|--------|
| Repository at github.com/chpollin/FemPrompt_SozArb | Exists | VERIFIED |
| Knowledge directory documents epistemic decisions | `knowledge/` with 5 documentation files + paper materials | VERIFIED |

---

## 2. Corrections from v8/v12

Problems fixed in the final paper text compared to earlier versions:

| Problem (v8/v12) | Correction in Paper Text | Status |
|-------------------|--------------------------|--------|
| v12 said "no supplementary manual research" | Paper now says "supplemented by a limited number of manually identified studies" | CORRECTED |
| v8 flagged Vault as presented "as existing" | Paper now says "to be integrated [...] This step is in progress" | CORRECTED |
| v12 said "No ungrounded LLM outputs in current run" (absolute) | Paper now says "Experts encountered entries that could not be verified" (more nuanced) | CORRECTED |
| v8 flagged "MCP channel" without implementation | No longer mentioned in paper text | CORRECTED (removed) |

---

## 3. Deviations (Paper Must Be Corrected)

### 3.1 Deep Research Prompts — CORRECTED

**Paper says (updated):** "The prompt templates are documented in the repository."

**Repo shows:** The parametric prompt template was restored from Git history (commit `0a98f49`, `knowledge/Operativ.md`) and is at `prompts/deep-research-template.md`. It contains the 5-component structure (Role, Task, Context, Analysis Steps, Output Format), the RIS conversion prompt, and the document summary prompt. Most placeholder values were reconstructed (with source attribution and confidence rating). Genuinely lost: the exact instantiated prompt text, some placeholder values (author list, region, specific competencies), and the OpenAI raw output.

**Status:** Paper text (footnotes) and `prompts/CHANGELOG.md` updated. Wording is now honest: "Template documented, instantiated prompt reconstructed."

---

### 3.2 Visual Validation — OVERSTATED

**Paper says:** "A custom browser tool enables visual review of every conversion."

**Repo shows:** The tool exists and works. But per `knowledge/methods-and-pipeline.md`, only 25/252 (~10%) of conversions were actually reviewed (PASS 20, WARN 4, FAIL 1). "Every conversion" suggests complete coverage.

**Action needed:** Precise wording. Suggestion: "enables visual review of conversions" (without "every") or "a sample of approximately ten percent was visually reviewed."

---

### 3.3 10K System as Operational Track — RESOLVED (v0.4)

**Original problem (v12):** Only 50-paper test, never fully executed.

**Current status:** `run_llm_assessment.py` executed on all 326 papers ($1.44, Commit M5). Result: `benchmark/data/llm_assessment_10k.csv` (232 Include, 94 Exclude). Benchmark results (correct since 2026-03-27: κ = 0.056, confusion matrix 100/34/108/49, category kappas 0.39–0.82) in `benchmark/results/agreement_metrics.json`. Earlier merge bug (sequential ID instead of Zotero_Key) was fixed — all values before 2026-03-27 were incorrect.

**Status:** VERIFIED

---

### 3.4 Finding on Non-Verifiable Entries — CONTRADICTION WITH KNOWLEDGE DOCUMENT

**Paper says:** "In the current run, experts encountered entries that could not be verified."

**Knowledge document v12 says:** "No ungrounded LLM outputs in current run. Positive finding."

**Repo shows:** In `human_assessment.csv` there is exactly 1 entry with "KEINE QUELLE GEFUNDEN!" (ID 1, EJEFPZGA). No systematic category for non-verifiable entries in exclusion reasons. The 5 documented upstream problems (Debnath, Tun, D'Ignazio, Statistics, Näscher) are PDF quality issues, not LLM errors.

**Action needed:** Harmonize paper text and knowledge document. Paper is more cautiously worded than v12, but repo evidence supports neither a strong claim nor its categorical denial. Recommendation: Stay with the 1 documented case and formulate precisely.

---

### 3.5 Corpus Numbers — INTERNALLY INCONSISTENT

The paper deliberately uses magnitudes ("several hundred papers"), which is correct. But internal documents contradict:

| Source | Number |
|--------|--------|
| Zotero export | 326 |
| LLM Assessment (5D) | 325 (1 missing) |
| Human Assessment CSV | 305 rows (including 50 manual) |
| Status doc | "303 (254 DeepResearch + 49 Human 1 Collection)" |
| Human Assessment CSV Source_Tool | 254 DR + 50 Manual + 1 empty |

**Action needed:** Explain difference 326 minus 305 = 21 papers. Correct status doc from 303 to 305. Clarify 49 vs. 50 manual.

---

### 3.6 Kappa as Lead Metric — METHODOLOGICALLY PROBLEMATIC

**Paper says (v0.4):** "The primary comparison metric is Cohen's Kappa" and "kappa = 0.035 ('slight' per Landis & Koch)"

**Analysis (2026-02-22, updated 2026-03-27):** The old Kappa value 0.035 was based on a merge bug (sequential ID instead of Zotero_Key). The correct value is 0.056 ("slight"). The prevalence-bias argument remains valid: base rates diverge by 25.5 percentage points (LLM 71.5% Include vs. Human 46.0% Include). Category kappas range 0.39–0.82 (all positive, previously some negative due to incorrect matching).

**Action needed:** Paper must update all benchmark numbers: confusion matrix 100/34/108/49, Kappa 0.056, basis 291 papers, 142 disagreements. Details: `knowledge/status.md` M6.

---

### 3.7 Vault Script Integrates Assessment Data — RESOLVED

**Paper says:** "Both assessment streams are to be integrated into an interlinked knowledge representation."

**Repo shows:** `generate_vault.py` now reads `benchmark/data/llm_assessment_10k.csv` and `benchmark/data/human_assessment.csv`. Assessment data matched via Zotero key and written to YAML frontmatter: `llm_decision`, `human_decision`, `llm_categories`, `human_categories`, `llm_confidence`, `agreement`. 205/249 papers received assessment data.

**Status:** VERIFIED

---

### 3.8 RIS Conversion — NOT REPRODUCIBLE

**Paper says:** "An LLM converts the heterogeneous outputs to RIS format."

**Repo shows:** RIS files exist in `deep-research/restored/` (4 files, untracked), but:
- No conversion script
- No documented prompt or process
- `ris-template.md` is a structure template, not instructions

**Action needed:** Document conversion process or mark as external step in paper.

---

## 4. Not Verifiable from Repo

| Paper Claim | Why Not Verifiable |
|-------------|-------------------|
| "The overlap of results proved to be low" | Provenance documented for only 36/326 papers. `source_tool_mapping.json` shows 30/34 as unique, covering only 13% of corpus. No systematic overlap analysis. |
| "Some studies were identified by only a single provider" | Same data situation. Verifiable for 34 papers, not the rest. |
| "Identical, structurally parameterized instructions" | Prompts not in repo (see 3.1). |
| Temporal instability ("non-reproducible results on repeated queries") | No experiment documented in repo. Paper correctly marks as placeholder. |
| "Research assistant merged results, cleaned metadata" | No audit trail. Christina listed as "Zotero curation" in repo, not as "research assistant." |
| Expert decision types (bibliographic judgment, AI demarcation, interpretive inference) | Analytical categorization from reflection on assessment process. Not logged or annotated in repo. Paper correctly marks as "derived from reflection, not systematic analysis." |
| "Quality depends substantially on prompt design" | Conceptually plausible, but no A/B tests or prompt variants in repo. |

---

## 5. Missing in Paper (Available in Repo, Potentially Useful)

### 5.1 Post-Processing

`pipeline/scripts/postprocess_markdown.py` deterministically cleans: 230 hyphenations, 341 page numbers, 2,263 header repetitions, 107,545 characters removed. Another example of deliberate alternation between probabilistic and deterministic stages.

### 5.2 4-Layer Validation System

`pipeline/scripts/validate_markdown_enhanced.py` checks syntactic (GLYPH placeholders, Unicode), structural (character ratio MD/PDF), semantic (optional LLM spot-check), manual (review queue). Goes beyond the browser tool described in paper.

### 5.3 Cleaned Markdown Files

`pipeline/markdown_clean/` contains 232 of 252 files. 20 files failed quality checks. Shows the workflow actually selects.

### 5.4 Concrete Costs

LLM Assessment (5D): $1.15. Knowledge Distillation: ~$7. Total pipeline < $10. Supports the economic asymmetry argument ("for a few euros").

### 5.5 Upstream Problems as Finding

7 knowledge documents with problems, all PDF upstream: corrupt Markdown (Debnath_2024), wrong document in PDF (D'Ignazio_2024 contained Cabnal 2010), PDF was title page only (Näscher_2025), topically irrelevant (Statistics_2023). Concrete evidence of access barrier and quality problems.

### 5.6 Source Tool Distribution (from human_assessment.csv)

Perplexity 75, Claude 63, ChatGPT 62, Gemini 54, Manual 50. Shows unequal provider contributions but no overlap analysis.

### 5.7 Human Assessment Status

171/305 decisions (56.3%): 55 Include, 102 Exclude, 14 Unclear, 134 open. 115/305 (37.7%) with categories filled. Exclusion reasons: 60 Duplicate, 24 Not relevant topic, 10 Wrong publication type.

---

## 6. Action Items (Prioritized)

### Priority 1 — Must Fix Before Submission

| # | Problem | Action | Affects |
|---|---------|--------|---------|
| 1 | Prompts partially in repo | Template restored (`prompts/deep-research-template.md`), instantiated versions lost. Paper draft correctly states: "Template versioned, instantiated versions lost" | Partially resolved |
| 2 | "Every conversion" overstated | Precise wording (sample ~10%) | Paper section 3 |
| 3 | Finding on non-verifiable entries contradictory | Harmonize paper text and knowledge document | Paper section 1 + v12 document |

### Priority 2 — Research Integrity

| # | Problem | Action | Affects |
|---|---------|--------|---------|
| 4 | RIS conversion not reproducible | Document process | Repo + Paper section 1 |
| 5 | ~~Vault script doesn't integrate assessment data~~ | RESOLVED: `generate_vault.py` extended, 205/249 papers with assessment data | ~~Paper section 3~~ |
| 6 | Source tool mapping incomplete (89% unknown) | Complete mapping from human_assessment.csv | Repo |

### Priority 3 — Consistency

| # | Problem | Action | Affects |
|---|---------|--------|---------|
| 7 | Corpus numbers inconsistent (326/325/305/303) | Explain differences, correct status doc | Internal documents |
| 8 | Christina's role (Zotero curation vs. research assistant) | Align | Repo + Paper |

---

## 7. Theoretical Framework: Repo Anchoring

The theoretical superstructure of the paper (epistemic asymmetry, Hauswald, Co-Intelligence, epistemic infrastructure) exists exclusively in the paper draft and knowledge document. No project document in the repository uses these terms. This is not inherently problematic — a paper need not anchor its theoretical framework in code. But some "findings" serving as empirical evidence for the theory are thinly evidenced in the repo:

| "Finding" in Paper | Repo Evidence |
|--------------------|---------------|
| Provider divergence as structural feature | Quantifiable for only 34/326 papers |
| Expert decision types | Analytical reflection, not derivable from repo data |
| Non-verifiable entry | 1 documented case |
| Epistemic asymmetry in the feminist field | Conceptually plausible, not operationalized |

The paper frames its status as an "ongoing experiment" and uses numbers only as magnitudes (guardrails 3 and 6). This framing protects against most issues as long as the concrete deviations (section 3) are corrected.

---

## 8. Overall Assessment

### Well Supported

The technical workflow (knowledge distillation, Docling conversion, validation tool, 5D assessment, deterministic stage 2) is precisely and correctly described. Numbers are accurate. The 3-stage pipeline is implemented exactly as described in the paper. The confidence formula is verifiable down to the line.

### Corrected (v8/v12 to Paper Text)

Four important problems from earlier versions were fixed: manual papers now mentioned, Vault as "in progress" not completed, MCP channel removed, statement on non-verifiable entries more nuanced.

### Open

Two claims in the paper text do not match the repo and must be corrected before submission: prompts in repo (partially reconstructed), "every conversion" (overstated). Assessment data in Vault: RESOLVED (generate_vault.py extended, 205/249 papers with data). None of these corrections require major rewrites.

### Operational Status (updated 2026-03-27)

10K LLM Assessment completed on full corpus (326/326). Human Assessment: 303/326 with decision. Benchmark calculated: confusion matrix (108 LLM-Include/Human-Exclude vs. 34 reverse), base rates (LLM 71.5% vs. Human 46.0% Include), 142 disagreements analyzed. Cohen's Kappa (0.056) reported as comparison anchor but limited by prevalence-bias paradox (section 3.6).

---

*Updated: 2026-04-01*
