---
title: AI-Assisted Review Standards (PRISMA-trAIce and RAISE)
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: active
language: en
version: "0.1"
created: 2026-06-09
updated: 2026-06-09
authors: [Christopher Pollin]
generated-with: Claude Code (Claude Opus 4.8), full-text extraction of both primary sources
topics: ["[[Reporting Guidelines]]", "[[AI in Evidence Synthesis]]", "[[Epistemic Infrastructure]]"]
related: [prisma-methodology, specification, data, methods-and-pipeline, project]
---

This note is the methodological core for the PRISMA screening tool. Two 2025 frameworks now govern AI-assisted systematic reviews: **PRISMA-trAIce** (a reporting extension: *how* to document AI use) and **RAISE** (a governance position statement: *under what conditions* AI use is permissible). Together they both legitimise this project's dual assessment track (it already satisfies most of the demanding requirements) and provide a concrete checklist to sharpen it. The item-by-item mapping onto the existing workflow, and the remaining gaps, are in the two tables below. PRISMA-trAIce explicitly permits free reuse (MIT license). General PRISMA background is in [[prisma-methodology]].

## PRISMA-trAIce (Holst et al. 2025, JMIR AI)

PRISMA-trAIce (*Transparent Reporting of Artificial Intelligence in Comprehensive Evidence-synthesis*) is a discipline-agnostic **extension to PRISMA 2020** that closes a specific gap: PRISMA-AI (announced 2022, unpublished) targets reviews *about* AI; PRISMA-trAIce targets AI used *as a tool within* the review process. It is a 14-item checklist mapped onto the PRISMA 2020 section structure. It does not replace PRISMA; it sharpens PRISMA 2020 items 8 (selection process) and 9 (data collection), which already ask that automation tools be disclosed.

Status caveat (cite accordingly): the authors call it a **"well-founded proposal,"** not a formally endorsed extension. It has not undergone a Delphi/consensus process and is governed as a "living guideline" (GitHub single source of truth at https://github.com/cqh4046/PRISMA-trAIce, MIT license, plus a Discord community and planned annual reviews). In writing, reference it as a *proposed* extension.

### The 14 items (verbatim, with priority level)

| ID | Section | Level | Item (abridged where long) |
|---|---|---|---|
| T1 | Title | Optional | Indicate AI assistance in title/subtitle if AI played a substantial role (e.g. primary screening, data extraction). |
| A1 | Abstract | Optional | Summarise the AI tool(s) used, the SLR stage(s) applied, and their primary role. |
| I1 | Introduction | Recommended | State the rationale for using AI tools for specific tasks (volume, efficiency, novel methods). |
| M1 | Methods | Mandatory | State whether AI use was pre-specified in the protocol and where it can be accessed; report deviations. |
| M2 | Methods | Mandatory | For each tool: name, version, developer/provider; how to access; for custom tools, core functionality and how to replicate (code repo, base model). |
| M3 | Methods | Mandatory | The specific SLR stage(s) and the precise task(s) the AI performed at each stage. |
| M4 | Methods | Mandatory | Input data provided to the tool (training/fine-tuning/calibration data; or review data fed in: search results, abstracts, full texts). |
| M5 | Methods | Mandatory | Output data: format (e.g. structured JSON, classification labels with confidence scores) and any automated post-processing before human review. |
| M6 | Methods | Mandatory | Prompt engineering: full prompts (or detailed structure + few-shot examples) and where accessible; key parameters (temperature, max tokens, top-p); iterative refinement process. |
| M7 | Methods | Highly recommended | For non-LLM tools: algorithms/models; settings/parameters (e.g. classification thresholds, active-learning parameters). |
| M8 | Methods | Mandatory | Human-AI interaction and oversight: how many reviewers validated AI outputs; whether independent; reviewer qualifications; how outputs were presented; **what proportion of AI outputs were manually verified**; how AI-human discrepancies were resolved; calibration procedures. |
| M9 | Methods | Mandatory | Methods to evaluate AI performance: reference standard (e.g. consensus human decisions); metrics (accuracy, sensitivity, specificity, precision, recall, F1); bias/error-rate analyses; pilot/validation phases. |
| M10 | Methods | Recommended | Data governance: how input/output/intermediate data was managed and stored; privacy, security, copyright/ToS compliance. |
| R1 | Results | Mandatory | **Flow diagram and text clearly distinguish records included/excluded by AI tool decisions vs human reviewer decisions at each screening stage; report number of records processed by AI and the outcomes.** |
| R2 | Results | Mandatory | Report results of AI performance evaluations (from M9), including quantitative results and AI-human agreement. |
| D1 | Discussion | Recommended | Limitations of AI use (technical issues, biases, hallucinations, prompt-engineering challenges) and how they may have influenced the review. |
| D2 | Discussion | Optional | The experience of using AI: benefits, challenges, usability, implications for future reviews. |

### Adapted flow diagram

The core modification is the addition of **separate fields to distinguish exclusions made by human reviewers from those made by AI systems** at each screening stage, while preserving the familiar PRISMA layout. It also separates rule-based administrative tools (e.g. deduplication) from evaluative AI systems. This is item R1 made visual, and it is the central artefact the tool must render.

## RAISE (Cochrane, Campbell, JBI, CEE, Nov 2025)

RAISE (*Responsible use of AI in evidence SynthEsis*) is a joint position statement of the four major evidence-synthesis organisations, which have also formed a joint **AI Methods Group (2025)**. It is governance, not reporting. Three core principles (verbatim):

1. "Evidence synthesists are ultimately responsible for their evidence synthesis, including the decision to use artificial intelligence (AI) and automation."
2. "AI and automation in evidence synthesis should be used with human oversight."
3. "Any use of AI or automation that makes or suggests judgements should be fully and transparently reported in the evidence synthesis report."

AI that **makes or suggests judgements** must be declared, explicitly including **study eligibility decisions** (i.e. screening / include-exclude), risk-of-bias, data extraction, synthesis, GRADE, and drafting. AI for spelling/grammar/structure need not be. Acceptability criterion: authors "can use AI and automation as long as they can demonstrate that it will not compromise the methodological rigor or integrity of their synthesis," and they "may need to pilot (or calibrate) the AI system or tool to validate its performance."

Mandatory reporting elements (RAISE Table 1): AI system name(s)/version(s)/date(s); purpose and stages affected; justification that the tool is methodologically sound; evidence of validation/performance evaluation; known limitations and biases; financial/non-financial interests in the AI tool. RAISE points to PRISMA for the reporting mechanics and asks that inputs (prompt development), outputs, datasets, and code be made publicly available. RAISE comes as a three-part package: RAISE 1 (recommendations for practice), RAISE 2 (building/evaluating tools), RAISE 3 (selecting/using tools), Thomas et al. 2025a/b/c.

## Mapping onto this project's workflow

The dual assessment track and benchmark already satisfy most demanding requirements. Status: **Satisfied / Partial / Gap**.

| Requirement | Project artefact | Status |
|---|---|---|
| trAIce M2 — tool identity | Claude Haiku 4.5 and Sonnet 4.6 (model IDs); four Deep Research models (ChatGPT, Claude, Gemini, Perplexity) for identification | Satisfied |
| trAIce M3 — stage + task | Identification (deep research), Screening (10K assessment), Synthesis (3-stage SKE), each documented | Satisfied |
| trAIce M4 — input data | Title+Abstract vs Knowledge Docs, tracked per paper (`Input_Source`); 2x2 experiment | Satisfied |
| trAIce M5 — output format + post-processing | Structured JSON, per-category booleans, confidence scores; deterministic stage 2 | Satisfied |
| trAIce M6 — prompts + parameters | `prompts/` governance, `CHANGELOG.md`, negative constraints v2.1 — but decoding parameters (temperature, top-p, max tokens) and confidence thresholds not yet disclosed | **Partial** |
| trAIce M8 — human oversight | Full dual track: 100% human screening (303/303) and 100% LLM screening (326/326), parallel and independent; expert decision binding | Satisfied (gold standard) |
| trAIce M9 + R2 — AI performance evaluation | Confusion matrix, Cohen's kappa (decision + 10 categories), base rates, 142-case divergence analysis (3 patterns); human consensus as reference standard | Satisfied (project strength) |
| trAIce R1 — flow diagram AI vs human split | Data exists (matrix 100/34/108/49); the new tool renders the adapted flow diagram | **In progress (the tool)** |
| trAIce M10 — data governance | `.vault_cache/` (reproducible API cache), open repository | Satisfied |
| trAIce M1 — protocol pre-registration of AI use | No PROSPERO/OSF protocol on record | **Gap** |
| RAISE P1 — accountability | Expert track epistemically binding; responsibility-asymmetry framing in [[project]] | Satisfied |
| RAISE P2 — human oversight | Dual track, human decision binding | Satisfied |
| RAISE P3 — transparent reporting of AI judgements | Repo + prompt governance, but no single consolidated AI-disclosure section yet | **Partial** |
| RAISE Table 1 — justification + validation evidence | The benchmark *is* the validation evidence; needs explicit framing as such | **Partial** |
| RAISE Table 1 — conflicts of interest in AI tool | Not yet declared | **Gap** |

## Concrete improvements (the to-do list this yields)

1. **Pre-register a protocol** (OSF or PROSPERO) for the planned literature *update* run, explicitly specifying AI use per stage. Closes trAIce M1 and the RAISE protocol expectation.
2. **Auto-generate a consolidated AI-disclosure section / supplementary table** from the screening data: model name + version + date, stage, task, prompt version, decoding parameters, confidence threshold, validation metrics (kappa), known limitations. This is a tool feature and closes trAIce M6 (parameters), RAISE Table 1, and P3 at once.
3. **Disclose decoding parameters and any confidence threshold** in the assessment prompt config so M6b is explicit and reproducible.
4. **Declare conflicts of interest** regarding the AI tools used (RAISE Table 1, final row).
5. **Render the PRISMA-trAIce adapted flow diagram** (AI vs human split) as the tool's centrepiece. Closes trAIce R1.
6. **Frame the benchmark explicitly as the trAIce M9/R2 performance evaluation**, naming the human-consensus reference standard and the metrics, in the methods text the tool emits.

## How this legitimises the workflow

The project does not merely comply, it exceeds the baseline on the hard items. PRISMA-trAIce M8 asks "what proportion of AI outputs were manually verified" — here the answer is effectively 100%, because every paper was screened independently by both an expert and the LLM (full dual screening rather than AI-first with human spot-checks). M9/R2 asks for an AI performance evaluation against a reference standard — the confusion matrix, kappa, and divergence analysis already are that evaluation. RAISE's accountability principle is the project's pre-existing thesis (responsibility remains with the experts). The divergence (LLM 71.5% vs expert 46.0% include rate) is not a compliance failure but the empirical product of exactly the transparency these standards demand: it is only visible *because* AI and human decisions were recorded separately, which is what R1 asks for.

## Sources

Full-text extractions, primary sources:

- PRISMA-trAIce: Holst et al. 2025, JMIR AI 4:e80247, https://ai.jmir.org/2025/1/e80247 (DOI 10.2196/80247); repository (MIT) https://github.com/cqh4046/PRISMA-trAIce ; PMC mirror https://pmc.ncbi.nlm.nih.gov/articles/PMC12694947/
- RAISE: joint position statement (Cochrane, Campbell, JBI, CEE), Nov 2025; open-access mirror https://pmc.ncbi.nlm.nih.gov/articles/PMC12603384/ (also JBI Evidence Synthesis, Cochrane Library ED000178, Environmental Evidence 10.1186/s13750-025-00374-5)
- Boundary to PRISMA 2020 items 8/9: see [[prisma-methodology]]

## What this note does not cover

It does not reproduce the full RAISE 1/2/3 guidance documents (tool-selection and tool-building recommendations are out of scope here) and does not specify the tool's data model or UI (see [[data]] and [[specification]]). It documents the standards and their mapping, not the implementation.

## Related

- [[prisma-methodology]]
- [[specification]]
- [[data]]
- [[methods-and-pipeline]]
- [[project]]

*Updated: 2026-06-09*
