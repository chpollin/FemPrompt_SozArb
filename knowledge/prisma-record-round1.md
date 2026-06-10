---
title: PRISMA Record Round 1
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
related: [plan, conformance-audit, verification-empirical-core, prisma-methodology, ai-assisted-review-standards, data]
---

This document is the retrospective PRISMA record of the first review round: 326 corpus papers, screened in two strictly separate lanes, a binding human lane and an advisory AI lane, rendered after the fact into the PRISMA 2020 flow structure (Identification, Screening, Included; Page et al. 2021) plus the AI-versus-human split that PRISMA-trAIce item R1 asks for (Holst et al. 2025, a proposed extension, cited as a proposal). The record is honest by design: the round was conducted without a pre-registered protocol and without run-time provenance capture, so this document names what the repository data can carry and what it cannot, and treats every gap as a finding about the conducted review, per [[conformance-audit]]. No conformance claim is made for round 1; conformance is enforced prospectively for the update round (Stage B of [[plan]]).

The machine-readable companion is `docs/data/flow_model.json`: every count there carries a source field naming the file and the counting rule. Evidence status, stated once and binding for every number below: all counts were recomputed on 2026-06-09 by an agent running anchored pattern counts over the raw CSVs in `benchmark/data/` and cross-checked against [[verification-empirical-core]] and [[conformance-audit]]; the scripted, committed replay (Stage R2 of [[plan]]) is pending, and the flow model carries the flag `agent_recount_scripted_replay_pending` until it exists.

## How to read this record

Each section ends with a verifiability statement. "A reader can verify" means the stated counts reproduce from named repository files with the documented counting rules, with no privileged access. "A reader cannot verify" means the repository contains no data that could confirm the statement, and the record says so instead of asserting it. The distinction follows the audit's three-way judgment (reconstructable, partial, missing) in [[conformance-audit]] and `docs/data/conformance_map.json`.

## Identification

The corpus is 326 records (`benchmark/data/papers_full.csv`, row-marker count). Identification used four AI deep-research providers (ChatGPT, Claude, Gemini, Perplexity) plus a manual search; the deviation from standard database searches is documented and justified in the methods documentation ([[prisma-methodology]], relevance section). The claimed per-source distribution exists only for the 303 records of the human assessment track, via the Source_Tool column of `benchmark/data/human_assessment.csv`: Perplexity 74, Claude 63, ChatGPT 62, Gemini 54, Manual 50, summing exactly to 303.

The acquisition is the record's first named gap. The Source_Tool column predates the repository record and is not auditable; the repository can corroborate provenance for exactly 34 records through restored RIS files (Claude 15, Gemini 3, OpenAI 6, Perplexity 10, per [[conformance-audit]]). The executed deep-research prompt instantiations were never committed; only the restored template survives. Query dates and provider-side model versions are unknown. Five further acquisition claims (low cross-provider overlap, single-provider finds, identical structured instructions to all four models, non-reproducible repeated queries, assistant-side merging and metadata cleaning) cannot be verified from the repository (`knowledge/paper-integrity.md`, section 4).

Duplicate handling also deviates from the textbook flow: 95 records are flagged as duplicates in `papers_full.csv`, but no records were removed before screening. Deduplication happened inside human screening, as 67 exclusions with the reason Duplicate. The flow model records this as it happened rather than back-fitting a duplicates-removed box.

A reader can verify: the 326-record corpus, the 95 duplicate flags, and the Source_Tool tallies, by recounting the named files. A reader cannot verify: that the Source_Tool attributions are true (except for 34 RIS-corroborated records), when and with which provider model versions the searches ran, or what prompt text was actually executed.

## Screening

Screening ran as two strictly separate lanes on identical ten-category criteria (`benchmark/config/categories.yaml`). The lanes were never merged destructively; the AI lane is advisory and the human decision is the binding record throughout.

### Human lane (binding)

The human track contains 303 decisions in `benchmark/data/human_assessment.csv`: 142 Include, 161 Exclude, no Unclear. The recorded exclusion reasons are 67 Duplicate, 54 Not relevant topic, 17 Wrong publication type, 10 No full text, 5 Other, 0 Language, 7 empty cells, plus one row not attributable by per-line pattern matching (a multiline-field artifact; the same residual [[conformance-audit]] records). Two hygiene findings attach: the value Other is outside the controlled vocabulary of `categories.yaml`, and empty reason cells violate it; the vocabulary was documented but not enforced at input time.

The lane has two structural gaps. First, the named gap of this record: 34 of the 326 corpus papers carry no human decision at all (`papers_full.csv`, Has_HA = No). For these 34 papers only the advisory AI assessment exists, and the binding record is simply absent; nothing in the repository explains the selection of what was humanly screened. Conversely, 12 human-track records do not pair with the AI corpus file at all. Second, the human track is one consolidated annotation, not a measured standard: the CSV has no reviewer column, the assessors are documented only collectively (a primary assessor R1, with corrections or additions by a second assessor R2 that are not traceable per record), and no inter-human reliability statistic exists ([[verification-empirical-core]]). Divergence quantities against this track are divergence, not error rates.

### AI lane (advisory)

The AI track contains 326 assessments in `benchmark/data/llm_assessment_10k.csv`, one per corpus paper: 232 Include, 94 Exclude. The model is the pinned snapshot claude-haiku-4-5-20251001 with max_tokens 1024; temperature and top-p were never set and are unrecorded API defaults ([[conformance-audit]], prompt and parameter finding). Input was title plus abstract per paper; the assessment prompt is versioned in `prompts/CHANGELOG.md`. Each record carries the ten category judgments, a decision, a confidence value, and reasoning text. The separate 2x2 model-by-input experiment is not part of this round-1 flow and is reported in [[verification-empirical-core]].

### Pairing and agreement

291 papers carry both decisions (`benchmark/data/merged_comparison.csv`, paired by Zotero key). The confusion matrix (human x AI) is 100 both-include, 34 human-include/AI-exclude, 108 human-exclude/AI-include, 49 both-exclude; Cohen's kappa on the decision is 0.0561. Any use of that number is bound to the decomposition in [[verification-empirical-core]]: PABAK is 0.0241, kappa-max given the marginals is 0.5081, and 72 of the 108 papers in the large divergence cell are human exclusions for workflow criteria (Duplicate, No full text, Wrong publication type) that a one-paper-at-a-time model cannot see; content-only, the include rates converge and kappa rises to 0.194.

One open inconsistency is recorded rather than smoothed over: `papers_full.csv` flags 292 papers as humanly assessed while only 291 pair in the benchmark merge. Which record fails to pair cannot be determined without re-running the merge; resolving it is the first task of the pending scripted replay (TP3 step 1 in [[plan]]).

A reader can verify: every count in this section, by recounting the three CSVs with the rules documented in `docs/data/flow_model.json`, and the pairing metadata against `benchmark/results/agreement_metrics.json`. A reader cannot verify: who inside the human lane took which decision, on which text basis a human decision was taken (no text_source field existed in round 1), and why 34 corpus papers were never humanly screened.

## Included

The binding included set of round 1 is the 142 human Include decisions. Within the 291 paired papers, 134 of them sit (100 with AI agreement, 34 against an AI exclude); the remaining 8 are among the 12 human-only records outside the AI corpus file. The AI lane's advisory included set is 232; it never determined inclusion.

The text basis of the included set is uneven and documented: of the 326 corpus papers, 236 have a served knowledge document, 75 have only an abstract, and 15 have no text at all in the served infrastructure ([[conformance-audit]], citing the verified markers of `docs/data/fulltext_index.json`). Upstream, 257 of 326 PDFs were acquired (69 behind access barriers), 252 converted, 249 distilled. For the 15 no-text papers a binding human decision may exist while no evidence basis for it survives, so an evidence-grounded replay cannot read what the screener read.

A reader can verify: the included counts and their closure (134 + 8 = 142) from the CSVs, and the per-paper text markers from the served index. A reader cannot verify: the evidence basis of any individual round-1 decision, because no decision recorded what text was read.

## Protocol and pre-specification

The round had no pre-registered protocol: no PROSPERO or OSF registration, no protocol document, no amendment record, and no pre-specification of the AI use exist anywhere in the repository (PRISMA 2020 item 24, trAIce M1, both judged missing in the audit). Unlike every other gap in this record, this one is non-reconstructable by definition; a pre-specification cannot be created after the fact, only declared absent. This record declares it absent. The literature update (Stage B of [[plan]]) closes it prospectively: a protocol committed before any run, with enforced vocabulary and a reviewer column.

A reader can verify: the absence, by searching the repository. A reader cannot verify: what would have been pre-specified, and nothing here pretends to know.

## Conformance summary

The full item-by-item audit is [[conformance-audit]]; the machine-readable map is `docs/data/conformance_map.json`. The tally for round 1: of the 27 PRISMA 2020 items, 10 are reconstructable (items 1 to 5, 9, 10, 16, 17, 27), 7 partial (items 6, 7, 8, 13, 19, 20, 23), and 10 missing (items 11, 12, 14, 15, 18, 21, 22, 24, 25, 26). Of the 17 PRISMA-trAIce items, 13 are reconstructable (T1, A1, I1, M3, M4, M5, M8, M9, M10, R1, R2, D1, D2), 3 partial (M2, M6, M7), and 1 missing (M1).

The shape of the two tallies is the finding. The reconstructable PRISMA core covers exactly what the project recorded as data (eligibility criteria, data items, the selection flow, study characteristics, availability), while the missing block is dominated by the appraisal layer of a full systematic review (risk of bias, effect measures, reporting bias, certainty) plus the administrative declarations (registration, support, competing interests). The trAIce profile is markedly stronger than the PRISMA 2020 profile because the dual-track design is precisely what trAIce asks for: separate AI and human decision records, a performance evaluation against a human reference, and full human oversight exist as data, not as assertions. What a protocol would have fixed in advance, and the acquisition provenance that was never captured at run time, are unrecoverable; that boundary between the repairable and the unrepairable is the design specification for what the infrastructure must record from the start ([[conformance-audit]], closing section).

## What this record is and is not

It is a retrospective rendering of a conducted review into the PRISMA 2020 plus trAIce flow and checklist structure, with every fillable item filled from data and every unfillable item named. It is not a conformance claim, not a protocol substitute, and not an assertion that round 1 met systematic-review standards; it demonstrably did not meet several. The record exists so that the gaps are explicit, attributable, and usable: each one maps to a concrete capture requirement that the PRISM instrument and the Stage B protocol implement for round 2.

## Sources

- `docs/data/flow_model.json` (per-count sources, this record's number ledger)
- [[conformance-audit]] and `docs/data/conformance_map.json` (item-level conformance, R1 audit)
- [[verification-empirical-core]] (adversarial recomputation of the benchmark numbers and their interpretation limits)
- [[prisma-methodology]] (PRISMA 2020 reference; Page et al. 2021, BMJ 372:n71)
- Holst et al. 2025, PRISMA-trAIce, JMIR AI 4:e80247, DOI 10.2196/80247 (proposed extension; cited as proposal, per [[verification-novelty]])
- `knowledge/paper-integrity.md` (non-auditable acquisition claims)

*Updated: 2026-06-09*
