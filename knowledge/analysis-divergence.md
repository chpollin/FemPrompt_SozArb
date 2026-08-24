---
title: Analysis of the Round-One Expert and LLM Screening Divergence
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: complete
language: en
version: "0.6"
created: 2026-07-21
updated: 2026-08-23
authors: [Christopher Pollin]
generated-with: Claude Code, Codex (GPT-5.6)
related: [methods, verification, standards, journal, project, INDEX]
---

# Analysis of the Round-One Expert and LLM Screening Divergence

The round-one divergence analysis compares the consolidated expert annotation with the separately executed LLM assessment. It serves as a motivating illustration for the workflow and demonstrates which questions become answerable when decisions, categories, and exclusion reasons remain machine-readable. Every quantity derives from the committed replay and the generated benchmark artifacts.

## Evidence basis

`src/replay/replay_round1.py` re-pairs the raw assessment files by `Zotero_Key`, reproduces the canonical benchmark as a self-test, and then writes the flow and agreement outputs under `generated/benchmark-results/replay/`. The replay fails on missing, surplus, or inconsistently paired records. This mechanism replaces earlier hand-maintained figures and the incorrect sequential-row pairing discovered during the first analysis.

The principal generated keys are listed below.

| Analytical object | Generated source |
|---|---|
| Full decision matrix and statistics | `agreement_replay.json > full > decision` |
| Content-only sensitivity analysis | `agreement_replay.json > content_only` |
| Workflow exclusions removed from that subset | `agreement_replay.json > content_only > removed_workflow_pairs` |
| Model and input-condition contrast | `agreement_replay.json > condition_contrast` |
| Per-category input deltas | `comparison_4way.json > deltas` |
| Denominators and flow | `flow_model.json` |

## Full and content-only comparison

The full comparison shows weak decision agreement between the tracks. The prevalence-adjusted statistic remains weak, which rules out the earlier interpretation that base-rate skew alone explains the result. The full matrix therefore represents a real divergence between the two recorded products.

The content-only sensitivity analysis removes expert exclusions for duplicate records, unavailable full text, and wrong publication type. A Paper-isolated LLM cannot apply these corpus-management criteria. After their removal, the include rates move close together and agreement improves. The residual divergence concerns content categorisation rather than corpus administration.

The two subsets support different statements. The full matrix describes the observed review products. The content-only subset isolates judgements that both tracks could make from Paper content. Neither comparison supplies an error rate because round one has no inter-expert reference standard.

## Input-condition contrast

The supplementary experiment crosses two model configurations with title-plus-abstract and distilled-knowledge-document input. The best-ranked condition changes when workflow exclusions are removed. Any claim about a generally superior condition would therefore exceed the evidence.

Knowledge-document input produces a more inclusive assessment pattern even after the content-only restriction. The Fairness category shows the clearest deterioration in agreement under that input. These results support a methodological warning about distillation. Additional context can inherit and amplify the framing introduced during knowledge-document generation.

## Divergence patterns

The project uses three descriptive patterns to organise content disagreements.

- Semantic Expansion covers cases where the LLM applies a category more broadly than its operational definition.
- Implicit Field Membership covers cases where domain experts recognise field relevance from disciplinary cues that the Paper-level prompt does not surface.
- Keyword Inclusion covers category assignment from a lexical cue without sufficient contextual support.

The classification supports case inspection and assigns no correctness label. Per-Paper assignments remain in the generated divergence data rendered by the Evidence Companion.

## Worked cases

The case identified by `K3YCLBXK` illustrates Implicit Field Membership. The consolidated expert annotation includes the Paper, while the LLM finds the technical dimension and no qualifying social dimension. The strict inclusion rule therefore produces different decisions from two readings of field relevance.

The case identified by `CF6T2RD7` illustrates a workflow exclusion. The expert record marks a duplicate, while the Paper-isolated LLM judges the article content as relevant. The repeated title and associated Zotero identities are properties of the corpus. This case leaves the content-only subset.

## Interpretation limits

- All agreement metrics use the paired subset named in the generated denominator record.
- Round-one decoding parameters and a confidence threshold are incompletely recorded.
- The tested screening configurations come from one model family.
- Knowledge-document conditions inherit distillation and translation choices.
- The consolidated expert annotation has no per-decision reviewer identity and yields no inter-expert reliability estimate.

## Paper use

The analysis supports the paper's claims that workflow exclusions materially shape raw agreement, that content-only restriction changes the interpretation, that distilled input can alter category behaviour, and that structured decision reasons enable decomposition. The paper reports the generated figures from their data keys and describes the result as divergence between two recorded products. [[verification]] governs the final wording and publication authority.
