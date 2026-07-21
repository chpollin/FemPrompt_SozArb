---
title: Analysis of the Round-1 Human-LLM Screening Divergence
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: active
language: en
version: "0.3"
created: 2026-07-21
updated: 2026-07-21
authors: [Christopher Pollin]
generated-with: Claude Code
related: [methods, plan, conformance-map, standards, journal, project, INDEX]
---

The licensed analysis (TP3 in [[plan]]) of the round-1 divergence between the expert track and the LLM track, written as the source the follow-up paper's empirical section cites. Every count-bearing statement traces to the committed replay; the figures live in the data (`generated/benchmark-results/`, `generated/benchmark-results/replay/`) and the Evidence Companion. This document points at the exact JSON key instead of restating a value, and cites a number only where it carries the argument, always as a read-off of a named key.

## Purpose and epistemic status

The document analyses the round-1 screening divergence and reports it decomposed, under the framing decided on 2026-06-09 and 2026-07-03 (the V-section consequence ledger in [[plan]]). The divergence is a motivating illustration for the epistemic infrastructure, showing why reliability has to be established by process design rather than presupposed of the model. It is not a finding the review defends. The expert track is the epistemically binding reference (see [[project]] and [[methods]]); the review's substance is the corpus and its categorisation. The document withholds any error-rate reading, since the human track carries no independent inter-human baseline for round 1. Divergence is reported as divergence.

## Data basis and provenance

The analysis rests on the committed replay `src/replay/replay_round1.py`, documented in `src/replay/README.md`. It re-pairs the three raw assessment CSVs (`assessment/human_assessment.csv`, `assessment/llm_assessment_10k.csv`, `assessment/papers_full.csv`) strictly by `Zotero_Key`, recorded under `agreement_replay.json > provenance > pairing_key`. Before it writes anything the script reproduces the canonical `generated/benchmark-results/agreement_metrics.json` as a self-test; `agreement_replay.json > self_test > passed` is true, at tolerance 1e-09, over the decision confusion matrix, the decision kappa, and the ten per-category kappas. That self-test plus the reviewed script is the human-checked path for the count-bearing claims; an independent re-derivation by a second person is still open ([[plan]] Stage R status).

The replay exists because of a specific failure. On 2026-03-27 (Session 9 in [[journal]]) the merge step paired the two tracks by a sequential row id in place of the stable `Zotero_Key`, so every pre-fix benchmark figure rested on wrong pairings; the marginals stayed plausible and only negative per-category kappas exposed the fault. Pairing by `Zotero_Key` in a committed, self-tested script forecloses that class of error. One residual pairing surplus is resolved and recorded under `flow_model.json > known_resolved_issue`, a stray `Has_HA` flag on key `2YS85B49` in `papers_full.csv` that the human CSV never carried, so no human decision is missing.

## The decomposition, full and content-only

The full set pairs both tracks over the whole corpus. Reading `agreement_replay.json > full > decision > two_by_two`, the decision kappa is 0.056101 and PABAK is 0.024055. PABAK sits below kappa, so correcting for skewed base rates and rater bias does not lift agreement above chance. The low agreement is genuine rather than an artifact of prevalence. This overturns the README's earlier prevalence-artifact framing, which read the low kappa as a base-rate side effect; the queued Byrt correction ([[plan]] P6) records the reversal. The prevalence and bias indices that generate PABAK (Byrt et al. 1993) are in the same block (`prevalence_index`, `bias_index`).

The content-only subset removes the workflow-criteria exclusion pairs, the human exclusions for Duplicate, No full text, and Wrong publication type that a one-paper-at-a-time LLM structurally cannot apply (`agreement_replay.json > content_only > removed_workflow_pairs`). On the remaining subset (`content_only > n`) the include rates reach near parity, `content_only > decision > two_by_two > human_include_rate` at 0.673367 against `llm_include_rate` at 0.683417, and overall agreement rises above the full-set value (`content_only > decision > overall_agreement`).

Each subset licenses a distinct statement. The full matrix licenses the statement that whole-decision agreement is near chance and is not a prevalence artifact. The content-only subset licenses the statement that once the workflow criteria are separated, the include rates converge and the residual disagreement is about content categorisation. Kappa is the comparison anchor across both subsets; the confusion matrix and the per-category values carry the argument, as the ledger requires.

## The 2x2 condition contrast

The condition contrast crosses two models (Haiku 4.5, Sonnet 4.6) with two inputs (title-plus-abstract, knowledge document), under `agreement_replay.json > condition_contrast > conditions`. Ranked by decision kappa on the full set the best condition is `sonnet_kd` (`condition_contrast > best_condition_by_kappa_full`). Under the content-only sensitivity the ranking flips to `sonnet`, the abstract input (`best_condition_by_kappa_content_only`). The earlier "Sonnet+KD best condition" claim therefore holds only before the workflow exclusions are separated, and the queued qualifier ([[plan]] P6) records this.

The inclusion bias survives the decomposition only under the knowledge-document input. On the content-only subset the abstract conditions lose most of their skew toward inclusion (`condition_contrast > conditions > haiku > content_only > bias_index` near zero, `sonnet > content_only > bias_index` small), while the knowledge-document conditions keep a substantial inclusion bias (`haiku_kd` and `sonnet_kd > content_only > bias_index` around a fifth). The knowledge-document input pushes the LLM include rate far above the human rate even after the workflow exclusions are gone.

The Fairness category degrades under the knowledge-document input. Reading `comparison_4way.json > deltas`, the Fairness kappa drops from the abstract to the KD condition for both models (`deltas > "Haiku: KD vs Abstract" > categories > Fairness` is -0.2311, the Sonnet delta -0.1318), while the LLM's Fairness yes-rate rises. Richer context makes the model apply Fairness more liberally and agree with the expert less. This matches the Session 11 finding in [[journal]] that more context improves some category recognition and amplifies the inclusion bias across all conditions.

## Three epistemic divergence patterns

The divergence is classified descriptively into three patterns, defined in the [[INDEX]] glossary and rendered as Divergence Notes on the Evidence Companion. Set on their own lines:

- Semantic Expansion: the model reads a category more broadly than its operational definition and marks a category the experts withhold.
- Implicit Field Membership: the experts read a paper as field-relevant from cues the single-paper prompt does not surface, and include where the model excludes.
- Keyword Inclusion: the model attaches a category to a surface keyword without the contextual grounding the experts require.

The classification orders the disagreements for inspection and assigns no error. The per-paper assignments and the model reasoning live on the Evidence Companion (the divergences data) and in the vault Divergence Notes; this document points there rather than restating them.

## Worked examples

Two paired cases show the two halves of the decomposition.

Content divergence, Zotero key `K3YCLBXK` (Ruiz 2024, "AI Literacy: A Framework to Understand, Evaluate, and Use Emerging Technology"). The experts include; the LLM excludes with `Not_relevant_topic`. The model grants the technology dimension (AI_Literacies) and finds no social dimension, so the strict inclusion AND-rule yields Exclude, while the experts read the paper as field-relevant. This is Implicit Field Membership, a content disagreement that stays in the content-only subset.

Workflow-criteria case, Zotero key `CF6T2RD7` (Reamer 2023, "Artificial intelligence in social work: Emerging ethical issues"). The experts exclude for `Duplicate`; the LLM, seeing one paper in isolation, assesses the content as relevant and includes. The same title recurs across four Zotero keys in the disagreement set (`CF6T2RD7`, `HN7KKNYV`, `IUN7Z56I`, `X2QQ4JH6`), which is the duplicate condition made visible. Duplicate status is invisible to a per-paper assessment, so this disagreement carries no content judgement and is removed for the content-only subset. It shows why the decomposition has to precede any interpretation.

## Limitations

- The benchmark denominators differ by design. `flow_model.json > denominators` records the corpus (`corpus_papers_full`), the union of the two tracks (`union_of_tracks`), and the paired set (`paired_both_tracks`); the agreement metrics run over the paired set, and `meta.total_papers` in the companion JSONs is the union. Any include-rate comparison has to name its denominator.
- The assessment temperature and the confidence threshold were not recorded (trAIce M6b in [[conformance-map]]), so the disclosure cannot state them.
- The LLM track is a single model family (Claude Haiku 4.5 and Sonnet 4.6). The patterns are not shown to hold across providers.
- The served knowledge documents are distillates; the knowledge-document condition inherits the distillate's framing, which is one mechanism behind its inclusion bias.
- No independent inter-human reliability baseline exists for round 1, so agreement carries no accuracy interpretation. The reference literature for such a baseline is Woelfle et al. (2024), Hanegraaf et al. (2024), and Sandner et al. (2025) ([[methods]]); the prevalence-adjusted metrics follow Byrt et al. (1993). The round-2 protocol supplies the double-screened inter-human baseline ([[plan]], [[update-protocol]]).

## What this licenses for the paper

The document backs these section-5 statements. Set on their own lines:

- Whole-decision agreement between the tracks is near chance and is not a prevalence artifact, since PABAK sits below kappa on the full set.
- Separating the workflow-criteria exclusions raises agreement and brings the include rates to near parity.
- The LLM carries an inclusion bias that survives the decomposition only under the knowledge-document input.
- The best-performing condition depends on whether the workflow exclusions are separated, so the "Sonnet+KD best" claim is qualified.
- The Fairness category degrades under the knowledge-document input.
- The divergence sorts into three descriptive patterns.

It does not license any error-rate or accuracy statement about either track, any claim that one model is better in general, any claim of generalisation beyond the Claude family, or any inter-human reliability figure. Those stay out of scope until the round-2 double screening supplies the baseline.
