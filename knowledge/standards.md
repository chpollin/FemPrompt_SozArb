---
title: Reporting Standards (PRISMA 2020, PRISMA-trAIce, RAISE)
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: complete
language: en
version: "0.2"
created: 2026-06-09
updated: 2026-07-03
authors: [Christopher Pollin]
generated-with: Claude Code, deep-research web synthesis and full-text extraction of the primary sources
topics: ["[[PRISMA]]", "[[Reporting Standards]]", "[[AI in Evidence Synthesis]]"]
related: [specification, methods, conformance-map]
---

This note is the reporting-standards reference for the project. It covers PRISMA 2020 as the reporting backbone and the two 2025 frameworks that govern AI-assisted reviews, PRISMA-trAIce (how to document AI use) and RAISE (under what conditions AI use is permissible). It is the criterion the conducted review and the PRISM tool report against, and the canonical home for the standards' item counts and citations. All claims are sourced in the Sources section below.

## What PRISMA is

PRISMA (Preferred Reporting Items for Systematic Reviews and Meta-Analyses) is a reporting standard, not a conduct standard. It specifies what must be transparently reported in a systematic review so a reader can understand why it was done, what the authors did, and what they found. It does not prescribe how to conduct a review, and it should not be used to assess methodological quality; other tools exist for that, namely AMSTAR 2 and ROBIS.

PRISMA originated in 2009 as a renaming and update of the QUOROM statement (1999, QUality Of Reporting Of Meta-analyses, focused on meta-analyses of randomised controlled trials). PRISMA 2020 is the current revision.

A terminology note matters here, because the tool built in this project is called PRISM. The reporting standard is PRISMA, with the final A; PRISM is this project's screening tool. The only genuine predecessor of PRISMA is QUOROM.

## PRISMA 2020 vs PRISMA 2009

PRISMA 2020 (Page et al., BMJ 2021;372:n71) was developed from 2017, posted as a MetaArXiv preprint in September 2020, and published in March 2021. It replaces the 2009 statement and reflects a decade of methodological advances in identifying, selecting, appraising, and synthesising studies. The concrete changes (Box 2, "What's new"):

- The protocol and registration item moved to a new "Other information" section.
- Search reporting now requires full search strategies for all databases, registers, and websites searched, not just at least one.
- The synthesis item in Methods was split into six sub-items, and the Results synthesis item into four.
- New items were added for certainty/confidence in the evidence, competing interests, and public availability of data, analytic code, and other materials.

PRISMA 2020 also acknowledges automation. It references natural language processing and machine learning for identifying relevant evidence and asks that automation tools be disclosed, which is the hook the AI layer below sharpens.

## Flow diagram and 27-item checklist

The PRISMA 2020 checklist has 27 items across seven sections (Title, Abstract, Introduction, Methods, Results, Discussion, Other information), some with sub-items, plus an expanded version with item-specific recommendations and a separate PRISMA 2020 for Abstracts checklist (12 items).

The flow diagram documents the flow of records through the review. PRISMA 2020 provides revised templates, with distinct versions for original and for updated reviews. A terminology caveat matters for the tool. PRISMA 2009 exposed four phases (Identification, Screening, Eligibility, Included); PRISMA 2020 restructures the diagram around Identification, Screening, and Included, folding the standalone Eligibility box in. The tool follows the 2020 structure while still recording per-phase counts and exclusion reasons.

## Extension family

PRISMA is supplemented by a family of official reporting extensions for specific review types or report parts.

| Extension | Scope | Anchor |
|---|---|---|
| PRISMA-S | Literature search reporting (16 items) | Rethlefsen et al. 2021 |
| PRISMA-ScR | Scoping reviews | Tricco et al. 2018 |
| PRISMA-P | Review protocols (17 items) | Moher et al. 2015 |
| PRISMA for Abstracts | Reporting in abstracts (now integrated into 2020) | Beller et al. 2013 |
| PRISMA-DTA | Diagnostic test accuracy | McInnes et al. 2018 |

An AI-focused extension, PRISMA-AI, is registered with EQUATOR as "under development" (since May 2022) but not yet published. It targets reviews about AI interventions, which differs from reporting AI used as a tool in the review process. That second case is what the AI layer below covers.

## PRISMA vs conduct standards (Cochrane, JBI)

PRISMA answers whether the report is complete and transparent. It does not answer whether the review was conducted rigorously. For conduct, the field uses comprehensive method resources (the Cochrane Handbook, the JBI Manual); for methodological quality and bias, separate instruments (AMSTAR 2, ROBIS, RoB 2, ROBINS-I). The project references these alternatives in [[methods]] (JBI, Cochrane 6.5, ENTREQ, MMAT). The screening tool is therefore a reporting instrument; it makes the selection process auditable but does not replace expert methodological judgement.

## PRISMA-trAIce (Holst et al. 2025, JMIR AI)

PRISMA-trAIce (Transparent Reporting of Artificial Intelligence in Comprehensive Evidence-synthesis) is a discipline-agnostic extension to PRISMA 2020 that closes a specific gap. PRISMA-AI (announced 2022, unpublished) targets reviews about AI; PRISMA-trAIce targets AI used as a tool within the review process. It is a 17-item checklist mapped onto the PRISMA 2020 section structure (14 non-optional, that is 10 mandatory plus 3 recommended plus 1 highly recommended, and 3 optional). It does not replace PRISMA; it sharpens PRISMA 2020 items 8 (selection process) and 9 (data collection), which already ask that automation tools be disclosed.

A status caveat governs how to cite it. The authors call it a "well-founded proposal," not a formally endorsed extension. It has not undergone a Delphi or consensus process and is governed as a living guideline (GitHub single source of truth at https://github.com/cqh4046/PRISMA-trAIce, MIT license, plus a Discord community and planned annual reviews). In writing, reference it as a proposed extension.

### The 17 items (verbatim, with priority level)

| ID | Section | Level | Item (abridged where long) |
|---|---|---|---|
| T1 | Title | Optional | Indicate AI assistance in title/subtitle if AI played a substantial role (e.g. primary screening, data extraction). |
| A1 | Abstract | Optional | Summarise the AI tool(s) used, the SLR stage(s) applied, and their primary role. |
| I1 | Introduction | Recommended | State the rationale for using AI tools for specific tasks (volume, efficiency, novel methods). |
| M1 | Methods | Mandatory | State whether AI use was pre-specified in the protocol and where it can be accessed; report deviations. |
| M2 | Methods | Mandatory | For each tool: name, version, developer/provider; how to access; for custom tools, core functionality and how to replicate (code repo, base model). |
| M3 | Methods | Mandatory | The specific SLR stage(s) and the precise task(s) the AI performed at each stage. |
| M4 | Methods | Mandatory | Input data provided to the tool (training/fine-tuning/calibration data, or review data fed in: search results, abstracts, full texts). |
| M5 | Methods | Mandatory | Output data: format (e.g. structured JSON, classification labels with confidence scores) and any automated post-processing before human review. |
| M6 | Methods | Mandatory | Prompt engineering: full prompts (or detailed structure and few-shot examples) and where accessible; key parameters (temperature, max tokens, top-p); iterative refinement process. |
| M7 | Methods | Highly recommended | For non-LLM tools: algorithms/models; settings/parameters (e.g. classification thresholds, active-learning parameters). |
| M8 | Methods | Mandatory | Human-AI interaction and oversight: how many reviewers validated AI outputs; whether independent; reviewer qualifications; how outputs were presented; what proportion of AI outputs were manually verified; how AI-human discrepancies were resolved; calibration procedures. |
| M9 | Methods | Mandatory | Methods to evaluate AI performance: reference standard (e.g. consensus human decisions); metrics (accuracy, sensitivity, specificity, precision, recall, F1); bias/error-rate analyses; pilot/validation phases. |
| M10 | Methods | Recommended | Data governance: how input/output/intermediate data was managed and stored; privacy, security, copyright/ToS compliance. |
| R1 | Results | Mandatory | Flow diagram and text clearly distinguish records included/excluded by AI tool decisions vs human reviewer decisions at each screening stage; report number of records processed by AI and the outcomes. |
| R2 | Results | Mandatory | Report results of AI performance evaluations (from M9), including quantitative results and AI-human agreement. |
| D1 | Discussion | Recommended | Limitations of AI use (technical issues, biases, hallucinations, prompt-engineering challenges) and how they may have influenced the review. |
| D2 | Discussion | Optional | The experience of using AI: benefits, challenges, usability, implications for future reviews. |

### Adapted flow diagram

The core modification is the addition of separate fields to distinguish exclusions made by human reviewers from those made by AI systems at each screening stage, while preserving the familiar PRISMA layout. It also separates rule-based administrative tools (e.g. deduplication) from evaluative AI systems. This is item R1 made visual, and it is the signature artefact of the tool's report layer. Under the v4 pivot (see [[specification]] ADR-012, then ADR-020) the flow diagram lives with the checklist and the disclosure in the on-demand PRISMA-Record panel; the agreement matrix and kappa are no longer computed in the tool at all (ADR-014/017), agreement is evaluated externally on the benchmark corpus. The working Screening view is centred on reading, searching, and pinning evidence (FR-11 to FR-13), without the divergence apparatus.

## RAISE (Cochrane, Campbell, JBI, CEE, Nov 2025)

RAISE (Responsible use of AI in evidence SynthEsis) is a joint position statement of the four major evidence-synthesis organisations, which have also formed a joint AI Methods Group (2025). It is governance, not reporting. Three core principles, verbatim:

1. "Evidence synthesists are ultimately responsible for their evidence synthesis, including the decision to use artificial intelligence (AI) and automation."
2. "AI and automation in evidence synthesis should be used with human oversight."
3. "Any use of AI or automation that makes or suggests judgements should be fully and transparently reported in the evidence synthesis report."

AI that makes or suggests judgements must be declared, explicitly including study eligibility decisions (screening, include-exclude), risk-of-bias, data extraction, synthesis, GRADE, and drafting. AI for spelling, grammar, or structure need not be. The acceptability criterion is that authors can use AI and automation as long as they can demonstrate that it will not compromise the methodological rigor or integrity of their synthesis, and they may need to pilot or calibrate the AI system to validate its performance.

The mandatory reporting elements (RAISE Table 1) are the AI system name(s), version(s), and date(s); the purpose and stages affected; a justification that the tool is methodologically sound; evidence of validation or performance evaluation; known limitations and biases; and financial or non-financial interests in the AI tool. RAISE points to PRISMA for the reporting mechanics and asks that inputs (prompt development), outputs, datasets, and code be made publicly available. RAISE comes as a three-part package, RAISE 1 (recommendations for practice), RAISE 2 (building and evaluating tools), RAISE 3 (selecting and using tools), Thomas et al. 2025a/b/c.

## Mapping onto this project's workflow

The dual assessment track and benchmark already satisfy most of the demanding requirements. The figures that back the "Satisfied" judgements live in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion; this table states only the mapping and the status. Status values are Satisfied, Partial, or Gap. The full per-item conformance of this review, the complete PRISMA 2020 27-item checklist and all 17 trAIce items with source paths and named gaps, is in [[conformance-map]] (the R1 deliverable); this section is the AI-layer summary.

| Requirement | Project artefact | Status |
|---|---|---|
| trAIce M2: tool identity | Claude Haiku 4.5 and Sonnet 4.6 (model IDs); four Deep Research models (ChatGPT, Claude, Gemini, Perplexity) for identification | Satisfied |
| trAIce M3: stage and task | Identification (deep research), Screening (10K assessment), Synthesis (3-stage SKE), each documented | Satisfied |
| trAIce M4: input data | Title and abstract vs knowledge documents, tracked per paper (`Input_Source`); the 2x2 experiment | Satisfied |
| trAIce M5: output format and post-processing | Structured JSON, per-category booleans, confidence scores; deterministic stage 2 | Satisfied |
| trAIce M6: prompts and parameters | `prompts/` governance, `CHANGELOG.md`, negative constraints, per-prompt max_tokens; temperature, top-p, and confidence thresholds not yet disclosed | Partial |
| trAIce M8: human oversight | Full dual track, both human and LLM screening run parallel and independent across the corpus; the expert decision is binding | Satisfied (gold standard) |
| trAIce M9 and R2: AI performance evaluation | Confusion matrix, Cohen's kappa for the decision and the ten categories, base rates, and the divergence analysis, with human consensus as the reference standard | Satisfied (project strength) |
| trAIce R1: flow diagram, AI vs human split | The recorded AI and human decisions exist; the tool renders the adapted flow diagram in its on-demand PRISMA-Record panel | Built (tool); paper text pending |
| trAIce M10: data governance | `.vault_cache/` (reproducible API cache), open repository | Satisfied |
| trAIce M1: protocol pre-registration of AI use | No PROSPERO or OSF protocol on record | Gap |
| RAISE P1: accountability | Expert track epistemically binding; the responsibility-asymmetry framing in [[project]] | Satisfied |
| RAISE P2: human oversight | Dual track, human decision binding | Satisfied |
| RAISE P3: transparent reporting of AI judgements | Repo and prompt governance, but no single consolidated AI-disclosure section yet | Partial |
| RAISE Table 1: justification and validation evidence | The benchmark is the validation evidence; it needs explicit framing as such | Partial |
| RAISE Table 1: conflicts of interest in AI tool | Not yet declared | Gap |

## Concrete improvements (the to-do list this yields)

1. Pre-register a protocol (OSF or PROSPERO) for the planned literature update run, explicitly specifying AI use per stage. Closes trAIce M1 and the RAISE protocol expectation. The draft lives in [[update-protocol]].
2. Auto-generate a consolidated AI-disclosure section or supplementary table from the screening data, covering model name, version, date, stage, task, prompt version, decoding parameters, confidence threshold, validation metrics, known limitations. This is a tool feature and closes trAIce M6 (parameters), RAISE Table 1, and P3 at once.
3. Disclose decoding parameters and any confidence threshold in the assessment prompt config so M6b is explicit and reproducible.
4. Declare conflicts of interest regarding the AI tools used (RAISE Table 1, final row).
5. Render the PRISMA-trAIce adapted flow diagram (AI vs human split) in the tool's on-demand PRISMA-Record panel, the report layer separate from the working Screening view, per ADR-020. Done on the tool side; the exportable flow artefact and the paper text come from R4, fed by the committed replay (`src/replay/`).
6. Frame the benchmark explicitly as the trAIce M9/R2 performance evaluation, naming the human-consensus reference standard and the metrics, in the methods text the tool emits.

## How this legitimises the workflow

The project does not merely comply, it exceeds the baseline on the hard items. PRISMA-trAIce M8 asks what proportion of AI outputs were manually verified; here the answer is effectively complete, because every paper was screened independently by both an expert and the LLM, full dual screening rather than AI-first with human spot-checks. M9/R2 asks for an AI performance evaluation against a reference standard; the confusion matrix, kappa, and divergence analysis already are that evaluation. RAISE's accountability principle is the project's pre-existing thesis, that responsibility remains with the experts. The divergence between the LLM and the expert include rates is not a compliance failure but the empirical product of exactly the transparency these standards demand; it is visible only because AI and human decisions were recorded separately, which is what R1 asks for.

## Sources

All verified against primary sources (peer-reviewed publications or official guideline websites).

PRISMA:
- PRISMA history and development, official site: https://www.prisma-statement.org/history-and-development
- Page et al. 2021, PRISMA 2020 statement (BMJ 372:n71): https://systematicreviewsjournal.biomedcentral.com/articles/10.1186/s13643-021-01626-4 and https://pmc.ncbi.nlm.nih.gov/articles/PMC8008539/ (PMID 34446261)
- PRISMA extensions, official site: https://www.prisma-statement.org/extensions
- PRISMA 2020 flow diagram, official site: https://www.prisma-statement.org/prisma-2020-flow-diagram

AI layer:
- PRISMA-trAIce: Holst et al. 2025, JMIR AI 4:e80247, https://ai.jmir.org/2025/1/e80247 (DOI 10.2196/80247); repository (MIT) https://github.com/cqh4046/PRISMA-trAIce; PMC mirror https://pmc.ncbi.nlm.nih.gov/articles/PMC12694947/
- RAISE: joint position statement (Cochrane, Campbell, JBI, CEE), Nov 2025; open-access mirror https://pmc.ncbi.nlm.nih.gov/articles/PMC12603384/ (also JBI Evidence Synthesis, Cochrane Library ED000178, Environmental Evidence 10.1186/s13750-025-00374-5)

## What this note does not cover

It does not reproduce the full 27-item PRISMA checklist text (see the official statement) or the full RAISE 1/2/3 guidance documents (tool-selection and tool-building recommendations are out of scope here). It is a reference note, not a conduct manual; the methodological how-to stays in [[methods]], the tool's data model and UI in [[data]] and [[specification]].

## Related

- [[specification]]
- [[methods]]
- [[project]]
