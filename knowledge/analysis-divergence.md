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
version: "0.7"
created: 2026-07-21
updated: 2026-10-01
authors: [Christopher Pollin]
generated-with: Claude Code, Codex (GPT-5.6), Claude Code (Claude Opus 5.5)
related: [methods, verification, standards, journal, project, INDEX]
---

# Analysis of the Round-One Expert and LLM Screening Divergence

The round-one divergence analysis compares the consolidated expert annotation with the separately executed LLM assessment. It serves as a motivating illustration for the workflow and demonstrates which questions become answerable when decisions, categories, and exclusion reasons remain machine-readable. Every quantity derives from the committed replay and the generated benchmark artifacts.

## Evidence basis

`src/replay/replay_round1.py` re-pairs the raw assessment files by `Zotero_Key`, reproduces the canonical benchmark as a self-test, and then writes the flow and agreement outputs under `generated/benchmark-results/replay/`. The replay fails on missing, surplus, or inconsistently paired records. Category comparisons drop cells the expert left empty or marked `?`, so per-category denominators count coded pairs only ([[methods#Round-one replay verification]]). This mechanism replaces earlier hand-maintained figures and the incorrect sequential-row pairing discovered during the first analysis.

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

The classification supports case inspection and assigns no correctness label. The generated divergence data holds no per-Paper assignment. The earlier assignments came from a local LLM cache that the reproducible build no longer reads, so every divergence item carries a `null` pattern until an attributed classification source exists, as [[data#Historical concept graph and divergence classification]] records.

## Worked cases

The case identified by `K3YCLBXK` is read here as an illustration of Implicit Field Membership, while the generated data hold no classification for it. The consolidated expert annotation includes the Paper, while the LLM finds the technical dimension and no qualifying social dimension. The strict inclusion rule therefore produces different decisions from two readings of field relevance.

The case identified by `CF6T2RD7` illustrates a workflow exclusion. The expert record marks a duplicate, while the Paper-isolated LLM judges the article content as relevant. The repeated title and associated Zotero identities are properties of the corpus. This case leaves the content-only subset.

## Gender category divergence

On 1 October 2026 the Gender category was examined because the experts coded it far more often than the LLM track. Among the 234 works with both codings, the experts coded Gender in 143 and the LLM in 74; 72 works carry Gender only on the expert side and 3 only on the LLM side. The round-one definition read "Expliziter Gender-Fokus, Geschlechterperspektive oder Analyse von Gender-Bias", with the negative example that demographic data containing sex without a gender focus does not count.

Each of the 72 divergent records and a control sample of 15 works coded Gender by both sides (seed 20261001) was classified against its available text by the strongest role of gender: G1 analytic focus, G2 variable or reported difference, G3 mention only (enumeration of protected attributes, related work, outlook), G4 absent in the available text. Sonnet subagents classified the full texts with a verbatim quote and line locator per record. The orchestrating agent checked 22 classifications at the text and corrected three. The per-record table and the selection scripts are in `generated/benchmark-results/gender-divergence-2026-10-01/`.

| Group | Records | G1 | G2 | G3 | G4 |
|---|---|---|---|---|---|
| Divergent, expert 1 and LLM 0 | 72 | 17 | 6 | 37 | 12 |
| Control, both 1 | 15 | 13 | 0 | 1 | 1 |

The 72 divergent records contain duplicates of the same work and resolve to 59 distinct texts (12 G1, 6 G2, 29 G3, 12 G4). Eleven divergent records had only an abstract, six of them an empty one, so ten of the twelve G4 cases cannot be interpreted.

- Most of the divergence comes from an expert reading broader than the definition. 55 of 72 divergent records do not meet it, and the recurring trigger is the enumeration formula "race, gender, …" common in this literature.
- A smaller genuine LLM blind spot concerns works that measure gender as one of several bias dimensions, mostly multi-bias benchmarks and surveys. The definition leaves open whether these count as an analysis of gender bias.
- A theory-informed gender perspective occurs in only three divergent works. Five divergent works (six records) define gender or cite gender theory, against nine of fifteen in the control group. This bears on SQ4.
- The same work received different expert decisions across duplicate records, for example two Include and four Exclude for one prompting study.

The Gender counts of the Kategorien view therefore follow the broad expert reading. Codebook 1.4 codes bias axes only when a work analyses bias along them and excludes axes named only in enumerations, which matches the narrow reading. Two record bindings surfaced as inconsistent, where the bound file names another work than the record (`YPYQ2TCL`, `ACDF4FL9`), and await a source-binding check.

## Interpretation limits

- All agreement metrics use the paired subset named in the generated denominator record.
- Round-one decoding parameters and a confidence threshold are incompletely recorded.
- The tested screening configurations come from one model family.
- Knowledge-document conditions inherit distillation and translation choices.
- The consolidated expert annotation has no per-decision reviewer identity and yields no inter-expert reliability estimate.

## Paper use

The analysis supports the paper's claims that workflow exclusions materially shape raw agreement, that content-only restriction changes the interpretation, that distilled input can alter category behaviour, and that structured decision reasons enable decomposition. The paper reports the generated figures from their data keys and describes the result as divergence between two recorded products. [[verification]] governs the final wording and publication authority.
