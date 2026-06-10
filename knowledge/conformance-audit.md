---
title: Conformance Audit
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: active
language: en
version: "0.1"
created: 2026-06-09
updated: 2026-06-09
authors: [Christopher Pollin]
generated-with: Claude Code
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
related: [plan, specification, data, ai-assisted-review-standards, prisma-methodology, paper-integrity]
---

This document is the result of phase R1 of [[plan]]: an audit of whether the conducted review (326 papers, dual human and LLM assessment) can be retrospectively reconstructed as a PRISMA 2020 plus PRISMA-trAIce conformant record from the files in this repository. Every item of the PRISMA 2020 checklist (27 items) and of the PRISMA-trAIce proposal (17 item ids as encoded in `docs/js/prisma.js`) was judged against named repository files, and every number in this document was computed from those files, not copied from prose documentation. The machine-readable result, one entry per item with status and source paths, is `docs/data/conformance_map.json`; this document narrates the findings. The one-sentence verdict: the selection process and its AI involvement are reconstructable in unusual depth, because AI and human decisions were recorded separately from the start, while everything a protocol would have fixed in advance (registration, pre-specified AI use, risk-of-bias and certainty assessment) and the acquisition provenance that was never captured at run time are unrecoverable, which is itself the central design lesson for the infrastructure.

An item is judged reconstructable when the repository contains the data or text needed to fill it in a retrospective record, partial when required content exists with named holes, and missing when nothing in the repository can fill it. A missing status is a finding about the conducted review, not about the audit.

## Tally

PRISMA 2020 (27 items): 10 reconstructable (items 1 to 5, 9, 10, 16, 17, 27), 7 partial (items 6, 7, 8, 13, 19, 20, 23), 10 missing (items 11, 12, 14, 15, 18, 21, 22, 24, 25, 26). The reconstructable core covers exactly what the project recorded as data: eligibility criteria, data items, the selection flow, study characteristics, and availability. The missing block is dominated by the appraisal layer of a full systematic review (risk of bias, effect measures, reporting bias, certainty, in both methods and results) plus the administrative declarations (registration and protocol, support, competing interests).

PRISMA-trAIce (17 items): 13 reconstructable (T1, A1, I1, M3, M4, M5, M8, M9, M10, R1, R2, D1, D2), 3 partial (M2, M6, M7), 1 missing (M1). The trAIce profile is markedly stronger than the PRISMA 2020 profile because the dual-track design is precisely what trAIce asks for: separate AI and human decision records (R1), a performance evaluation against a human reference standard (M9, R2), and full human oversight (M8) exist as data, not as assertions.

## Findings

### Papers without a human decision

Of the 326 corpus papers in `benchmark/data/papers_full.csv` (326 record rows verified by row-marker count), 292 carry `Has_HA = Yes` and 34 carry `Has_HA = No`. The human assessment file `benchmark/data/human_assessment.csv` contains 303 logical records (306 physical lines, of which two are continuation lines of one multiline field plus the header), and all 303 carry a decision: 142 Include and 161 Exclude, no Unclear. The benchmark pairing in `benchmark/results/agreement_metrics.json` reports 291 papers with both assessments, 12 human-only and 35 agent-only records. So 34 corpus papers were never screened by the human track, and one further paper is marked as humanly assessed in `papers_full.csv` but did not pair in the benchmark merge (292 versus 291); which paper that is cannot be determined without re-running the merge, and that one-record discrepancy is recorded here as an open inconsistency between two derivations.

A related drift: `knowledge/status.md` reports the provider distribution on a 305-row version of the CSV (Perplexity 75) while the current file has 303 records with Source_Tool counts Perplexity 74, Claude 63, ChatGPT 62, Gemini 54, Manual 50 (sum 303, computed from `benchmark/data/human_assessment.csv`). The CSV is ground truth; the documented numbers are stale.

### Non-auditable acquisition steps

`knowledge/paper-integrity.md` (section 4) names the claims about the identification phase that cannot be verified from the repository. Five of them concern acquisition: that the overlap of results across providers was low, that some studies were identified by only a single provider, that all four models received identical structurally parameterized instructions, that repeated queries produced non-reproducible results, and that a research assistant merged results and cleaned metadata. The repository can corroborate provider provenance for exactly 34 records: the restored RIS files in `deep-research/restored/` contain 15 (Claude), 3 (Gemini), 6 (OpenAI), and 10 (Perplexity) records, mapped to Zotero keys by title matching in `corpus/source_tool_mapping.json` (generated 2026-02-14). The Source_Tool column in the human CSV claims provenance for all 303 papers, but its construction predates the repository record and is not auditable. The executed deep-research prompt text was never committed; `prompts/CHANGELOG.md` documents the restored template and lists what is genuinely lost (the instantiated prompt, the author list and region parameters, the OpenAI raw output).

### No pre-registered protocol

PRISMA-trAIce M1 (mandatory) and PRISMA 2020 item 24 are missing in the strict sense: no PROSPERO or OSF registration, no protocol document, and no amendment record exist anywhere in the repository. `knowledge/ai-assisted-review-standards.md` already names this as the one hard gap in its standards mapping. Unlike every other gap in this audit, this one is non-reconstructable by definition: a pre-specification cannot be created after the fact, only declared as absent. The planned literature update (Stage B of [[plan]]) is the opportunity to close it prospectively.

### Papers without any text

The published search index `docs/data/fulltext_index.json` carries a per-paper source marker; the verified counts are 236 papers with a served knowledge document, 75 with abstract only, and 15 with no text at all (the marker counts match the index metadata, and the sums equal 326). For those 15 papers a binding human decision may exist, but no evidence basis for it survives in the served infrastructure, so an evidence-grounded replay (Stage R3) cannot read what the screener read. Upstream, the documented loss chain explains the texts that are missing: `knowledge/status.md` records 257 of 326 PDFs acquired (69 behind access barriers), 252 converted, 249 distilled.

### Prompt and parameter record incomplete

trAIce M6 is partial on three counts, all verifiable. First, the assessment script `benchmark/scripts/run_llm_assessment.py` pins the model snapshot (claude-haiku-4-5-20251001) and max_tokens (1024) but never sets temperature or top-p, so the effective decoding values are unrecorded API defaults; the temperature value 0.0 shown in the `ScreeningRecord` example of [[data]] is an illustrative schema, not a recorded fact. Second, the executed deep-research prompt is partly lost (see above). Third, the 5D assessment prompt is referenced by `prompts/CHANGELOG.md` and `assessment/README.md` as `assessment-llm/prompt_template.md`, but no file of that name exists in the working tree (the folder is `assessment/llm-5d/` and contains no prompt file), so the 5D track's prompt is currently documented only by its CHANGELOG summary.

### Per-record reviewer identity absent

PRISMA item 8 asks how many reviewers screened each record and whether they worked independently. The dual human-versus-LLM independence is fully documented, but inside the human track `benchmark/data/human_assessment.csv` has no reviewer column: the assessors are named collectively in `knowledge/status.md` (including 27 corrections or additions by a second person), and which decision belongs to whom is not reconstructable. The PRISM tool's per-reviewer files (`docs/data/screening/`, schema femprompt-prisma-reviewer/0.2) fix exactly this for future screening.

### Vocabulary and hygiene findings

Of the 161 human exclusions, the recorded reasons are 67 Duplicate, 54 Not relevant topic, 32 across Wrong publication type, No full text, Language, and Other, and 7 with an empty reason cell (counts computed from `benchmark/data/human_assessment.csv`; the per-line pattern counts sum to 160 of 161, the residual being one row not cleanly attributable by pattern matching, noted as a minor data-hygiene remainder). The value Other does not exist in the controlled vocabulary of `benchmark/config/categories.yaml`, and empty reasons violate it; the vocabulary was documented but not enforced at input time. The 67 Duplicate exclusions also show that deduplication happened inside screening rather than as a separate identification-phase step, which the flow diagram must represent as it happened; `papers_full.csv` flags 95 records as duplicates in total.

## What the infrastructure must record from the start

The gaps sort cleanly into what could and could not be repaired afterwards, and that boundary is the design specification for epistemic infrastructure.

First, pre-specification is unrecoverable. A protocol, registration, and the declared intent of AI use (M1, item 24) must exist before the first decision; the instrument should refuse to start a review cycle without a protocol artifact it can link from the record, and the declarations that cost nothing at the start (support, competing interests, items 25 and 26) belong in the same session configuration.

Second, acquisition provenance must be captured at the moment of the run. The restored RIS situation shows the ceiling of post-hoc recovery: 34 of 326 papers corroborated. Every identification query needs the executed prompt verbatim, the provider and model version, the run date, and the raw output stored as files at run time; this is exactly the `prompts/CHANGELOG.md` governance extended from templates to executions, and Stage B2 of [[plan]] is specified that way.

Third, every decision needs its actor and its evidence basis. The legacy CSV records what was decided but not by whom or on which text; the reviewer-file schema (per-reviewer JSON with timestamps, pinned evidence, and the planned text_source field) records precisely the triple that this audit could not reconstruct.

Fourth, controlled vocabularies must be enforced by the input surface, not documented beside it. An exclusion reason like Other or an empty reason cell would have been impossible in a form that only offers the five defined reasons.

Fifth, reported numbers must be derivations, not prose. Every count that lived in documentation drifted from the data (305 versus 303 records, 75 versus 74 Perplexity, 292 versus 291 pairings), while every count derivable from files was exact. Generating the record from the data, which is Stage R2, removes the class of error rather than correcting instances of it.

*Updated: 2026-06-09*
