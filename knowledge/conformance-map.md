---
title: Conformance Map (PRISMA 2020, PRISMA-trAIce, RAISE)
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: draft
language: en
version: "0.2"
created: 2026-06-30
updated: 2026-06-30
authors: [Christopher Pollin]
generated-with: Claude Code
related: [standards, plan, methods, specification, data]
---

The R1 deliverable of Stage R in [[plan]]: every PRISMA 2020 checklist item and every PRISMA-trAIce item mapped to its source in the repository, or to a named gap. It is the data behind the tool's checklist surface and the input to the R4 record generation and conformance evaluation. The item text, priority levels, and citations live in [[standards]]; this document holds only the project-specific mapping. The corpus and benchmark figures live in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion, never here; where an item asks for a count, the status records that the count is reconstructable and the R2 replay produces it by a human-checked path.

## Status vocabulary

- **Reconstructable**: the item is fully backed by committed data or documentation; for count-bearing items the value falls out of the R2 replay.
- **Partial**: part of the item is backed, a stated portion is missing or not yet consolidated.
- **Gap**: the item cannot be reconstructed from the recorded data; the hole is named, not hidden.
- **N/A**: the item does not apply to this review type (a qualitative review of a field, screening and categorisation, with no meta-analysis, no per-study risk-of-bias appraisal, no effect measures, no certainty rating).

A draft caveat governs the count-bearing items. The retrospective flow counts and the agreement figures are reconstructable but not yet asserted by a committed replay; R2 must supersede any hand recount before R4 publishes the record (see [[plan]] Stage R status).

## PRISMA 2020 (27 items)

The 2020 structure exposes three flow phases (Identification, Screening, Included); the standalone Eligibility box of 2009 is folded in (see [[standards]]).

| Item | Checklist item (abridged) | Status | Source or gap |
|---|---|---|---|
| 1 | Title identifies the report as a systematic review | Reconstructable | `paper/` (Forum Wissenschaft, submitted and closed) |
| 2 | Abstract, structured summary | Reconstructable | `paper/draft.md` |
| 3 | Introduction, rationale | Reconstructable | [[project]], `paper/draft.md` |
| 4 | Introduction, objectives and questions | Reconstructable | [[project]] (research questions), `assessment/categories.yaml` (eligibility operationalised) |
| 5 | Eligibility criteria | Reconstructable | `assessment/categories.yaml` (ten categories, inclusion logic), [[methods]] (exclusion reasons) |
| 6 | Information sources | Reconstructable | [[methods]] Phase 1, `corpus/source_tool_mapping.json`, `corpus/deep-research/*.ris` (four Deep Research systems plus manual search) |
| 7 | Search strategy, full | Partial | `corpus/deep-research/literature-review-prompt.md` (parametric template); the instantiated round-1 prompts were not committed at run time and are partly lost (`prompts/CHANGELOG.md`) |
| 8 | Selection process | Reconstructable | [[methods]] Phase 2 (dual track), `assessment/human_assessment.csv`, `assessment/llm_assessment_10k.csv`; PRISM is the binding screening surface (ADR-019) |
| 9 | Data collection process | Reconstructable | [[methods]] Phase 3 (3-stage SKE), `src/distill/distill_knowledge.py`, `generated/distilled/` |
| 10 | Data items | Reconstructable | `assessment/categories.yaml`, the knowledge-document schema in [[methods]] |
| 11 | Study risk-of-bias assessment | N/A | No per-study RoB appraisal was conducted; appraisal standards were consulted but not applied per study ([[methods]] Quality assessment) |
| 12 | Effect measures | N/A | No quantitative effect synthesis (field review, not an intervention meta-analysis) |
| 13 | Synthesis methods | N/A | No meta-analytic synthesis; the synthesis is the distillation pipeline and the category mapping, reported under items 9 and 10 |
| 14 | Reporting-bias assessment | N/A | No across-study reporting-bias assessment for this review type |
| 15 | Certainty assessment | N/A | No GRADE or equivalent certainty rating |
| 16a | Results, study selection flow | Reconstructable | The retrospective FlowModel from `assessment/papers_full.csv` and the screening CSVs; counts produced by the R2 replay |
| 16b | Results, excluded studies with reasons | Reconstructable | `assessment/human_assessment.csv` (exclusion reasons), the controlled vocabulary in [[methods]]; the data-hygiene caveat (out-of-vocabulary values) is handled at the P3 import |
| 17 | Study characteristics | Reconstructable | `generated/distilled/`, `docs/data/research_vault_v2.json` |
| 18 | Risk of bias in studies | N/A | See item 11 |
| 19 | Results of individual studies | Reconstructable | `docs/data/research_vault_v2.json` (per-paper core finding and category evidence) |
| 20 | Results of syntheses | N/A | No statistical synthesis; the category-level pattern is rendered in the Evidence Companion (Categories view) |
| 21 | Reporting biases | N/A | See item 14 |
| 22 | Certainty of evidence | N/A | See item 15 |
| 23 | Discussion (summary, limitations, conclusions) | Reconstructable | [[project]], [[methods]] (Circularity as a field condition), `paper/draft.md` |
| 24a-c | Registration and protocol | Gap | No PROSPERO or OSF registration and no pre-specified protocol for round 1; the round-2 protocol is [[update-protocol]], committed before any round-2 run |
| 25 | Support and funding | Reconstructable | `README.md` (Elisabeth List Fellowship, University of Graz) |
| 26 | Competing interests | Partial | No consolidated competing-interests statement; the AI-tool conflict-of-interest declaration (RAISE Table 1) is not yet written |
| 27 | Availability of data, code, materials | Reconstructable | The public repository and the Evidence Companion; raw full texts in `generated/markdown_clean/` are not published for copyright reasons, stated as a deliberate limitation |

## PRISMA-trAIce (17 items)

The AI-as-tool layer. Item text and priority levels are in [[standards]]; this completes the mapping table there to all 17 items.

| Item | Level | Status | Source or gap |
|---|---|---|---|
| T1 | Optional | Partial | The conducted review foregrounds AI assistance in its framing, not in the title proper; addressable in the disclosure |
| A1 | Optional | Partial | The AI tools and stages are documented; a single abstract-level summary is addressable in the disclosure |
| I1 | Recommended | Reconstructable | [[methods]], [[project]] (the rationale is testing the technology, not reducing effort) |
| M1 | Mandatory | Gap | AI use was not pre-specified in a round-1 protocol; the round-2 protocol ([[update-protocol]]) pre-specifies it, closing the gap forward, not retrospectively |
| M2 | Mandatory | Reconstructable | Claude Haiku 4.5 and Sonnet 4.6 (model IDs); four Deep Research systems for identification ([[standards]], [[methods]]) |
| M3 | Mandatory | Reconstructable | Identification, Screening, Synthesis, each with its task documented ([[methods]]) |
| M4 | Mandatory | Reconstructable | Title-plus-abstract versus knowledge documents, tracked per paper (`Input_Source`); the 2x2 input experiment |
| M5 | Mandatory | Reconstructable | Structured JSON, per-category booleans, confidence scores; deterministic stage 2 (`generated/distilled/_stage1_json/`, `src/distill/`) |
| M6 | Mandatory | Partial | `prompts/` governance and `CHANGELOG.md`; decoding parameters (temperature, top-p, max tokens) and the confidence threshold are not yet disclosed |
| M7 | Highly recommended | N/A | No non-LLM evaluative classifier; deduplication is rule-based in Zotero and is reported as administrative, not evaluative |
| M8 | Mandatory | Reconstructable | Full dual track, human and LLM screening parallel and independent across the corpus, the expert decision binding ([[methods]]); the project strength on this item |
| M9 | Mandatory | Reconstructable | Confusion matrix, Cohen's kappa, base rates, divergence analysis, human consensus as the reference standard; figures in `generated/benchmark-results/` |
| M10 | Recommended | Reconstructable | `.vault_cache/` (reproducible API cache), open repository; the copyright limitation on raw texts is named |
| R1 | Mandatory | Partial | The recorded AI and human decisions exist and the tool renders the adapted flow diagram (AI versus human split) on its PRISMA & Report surface; the generated flow SVG and the paper text are produced by R4 |
| R2 | Mandatory | Reconstructable | The benchmark is the performance evaluation (`generated/benchmark-results/`); the paper text is produced by R4 |
| D1 | Recommended | Reconstructable | [[project]], [[methods]] (confabulation, context rot, sycophancy, the decomposed divergence as illustration) |
| D2 | Optional | Reconstructable | The epistemic-infrastructure narrative across [[project]] and [[journal]] |

## RAISE (governance)

| Element | Status | Source or gap |
|---|---|---|
| P1 accountability | Reconstructable | Expert track epistemically binding; the responsibility-asymmetry framing in [[project]] |
| P2 human oversight | Reconstructable | Dual track, human decision binding |
| P3 transparent reporting of AI judgements | Partial | Repo and prompt governance exist; a single consolidated AI-disclosure section is not yet written |
| Table 1 justification and validation | Partial | The benchmark is the validation evidence; it needs explicit framing as the trAIce M9/R2 evaluation in the emitted methods text |
| Table 1 conflicts of interest | Gap | Not yet declared |

## Named gaps (consolidated)

The items unrepairable in retrospect are named here, not hidden; they show what an epistemic infrastructure must record from the start.

1. **No pre-registered round-1 protocol** (PRISMA 24a-c, trAIce M1). The central retrospective gap. Round 2 closes it forward with [[update-protocol]], committed before any run.
2. **The instantiated round-1 deep-research prompts are partly lost** (PRISMA 7, trAIce M6). Only the parametric template survives in `corpus/deep-research/literature-review-prompt.md`; the round-1 RIS conversion is documented but not reproducible.
3. **Papers without a human decision.** Corpus papers carried through the LLM track but absent from `assessment/human_assessment.csv`; named in the flow as records without a binding human decision, never silently included.
4. **Non-auditable acquisition steps.** Parts of the PDF acquisition carry no full audit trail; the acquisition, conversion, and distillation chain loses material at each step ([[methods]] Phase 3), including the named failed conversions.
5. **Papers without any text.** Acquisition and conversion losses leave some records with no full text; the five conversion failures are named in [[methods]].
6. **Decoding parameters and confidence threshold not disclosed** (trAIce M6b). Closeable by writing them into the assessment prompt config.
7. **Conflicts of interest in the AI tools not declared** (RAISE Table 1, PRISMA 26).

One earlier discrepancy is resolved, not a gap: the residual pairing discrepancy was a stray `Has_HA` flag on key `2YS85B49` in `assessment/papers_full.csv`, a key absent from the human CSV, with no missing human decision (see [[plan]] Stage R status).

## How R4 consumes this

R4 generates the full PRISMA record bundle from the committed replay (flow SVG with the trAIce R1 split, agreement metrics for all tracks, both checklists filled from this map, disclosure text from the real metadata) and writes the conformance evaluation as a knowledge document. This map supplies the per-item status and source path; the R2 replay supplies the counts; the evaluation reads the Partial and Gap rows as its honest-conformance section. The to-do list that the Partial and Gap rows yield is the queued work in [[standards]] (Concrete improvements) and [[plan]] (P6, Stage R).
