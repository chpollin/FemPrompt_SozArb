---
title: "Analysis: Human-AI Divergence"
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
related: [plan, verification-empirical-core, verification-novelty, conformance-audit]
---

This document is the TP3 deliverable of [[plan]]: the decomposed human-AI divergence finding, written as the licensed source for the empirical section of the follow-up paper. Primary source for every figure is [[verification-empirical-core]], whose recomputation chain traces each number to the raw files; the confusion-matrix cells and the exclusion-reason decomposition were additionally recounted in this session directly from `benchmark/data/merged_comparison.csv` and `benchmark/data/merged_sonnet_kd.csv` with positionally anchored pattern counts, and all derived statistics quoted here were recomputed by hand from those cells. Framing rules, fixed in the TP3 work plan of [[plan]]: no error-rate language (no inter-human baseline exists), divergence is decomposed before it is interpreted, and the infrastructure-corrects-itself observation is made explicit.

One open hardening step qualifies the whole document: the committed re-pairing script (TP3 step 1 in [[plan]]) has not yet run end to end, so the numbers rest on the closed verification chain of [[verification-empirical-core]] plus this session's recounts, and the one-record discrepancy between `benchmark/data/papers_full.csv` (292 papers flagged as humanly assessed) and the benchmark pairing (291 pairs) remains unresolved ([[conformance-audit]]).

## 1. The headline matrix, and why the headline kappa alone misleads

The benchmark condition is Haiku 4.5 on title and abstract against the consolidated human track, paired by Zotero key. All values below from [[verification-empirical-core]] (benchmark core table); the four cells recounted in this session from `benchmark/data/merged_comparison.csv`.

| Quantity | Value | Source |
|---|---|---|
| Paired papers | 291 (of 303 human and 326 LLM records) | `merged_comparison.csv` via [[verification-empirical-core]] |
| Confusion matrix (both include / human-only include / LLM-only include / both exclude) | 100 / 34 / 108 / 49 | recounted this session from `benchmark/data/merged_comparison.csv` |
| Human include rate | 134/291 = 46.0 percent | [[verification-empirical-core]] |
| LLM include rate | 208/291 = 71.5 percent | [[verification-empirical-core]] |
| Observed agreement po | 149/291 = 0.512 | [[verification-empirical-core]] |
| Cohen's kappa | 0.056 | [[verification-empirical-core]] |
| PABAK | 0.024 | [[verification-empirical-core]] |
| Kappa-max given the marginals | 0.508 | [[verification-empirical-core]] |
| Bias index | 0.254 | [[verification-empirical-core]] |
| Prevalence index | 0.175 | [[verification-empirical-core]] |

The headline reading would be: 142 of 291 decisions diverge (34 plus 108, cells above), the LLM includes 25.5 percentage points more than the human track (71.5 versus 46.0, table above), and chance-corrected agreement is near zero. Every part of that sentence is numerically true and, taken alone, misleading, for two reasons that the rest of this document unpacks.

First, the single kappa aggregates two different kinds of disagreement: disagreement about paper content and disagreement produced by the task design, because the human track applied corpus-management criteria that a paper-isolated LLM structurally cannot apply. A model that sees one title and abstract at a time has no information basis to call a paper a duplicate of another paper, to know that no full text could be obtained, or to apply a publication-type cut that was operationalized outside the prompt. Section 2 separates these.

Second, the number 0.056 carries no interpretation by itself. It sits near zero both because real content disagreement exists and because the two tracks have strongly divergent marginals (46.0 versus 71.5 percent include), which cap the attainable kappa at 0.508 (kappa-max, table above). Reporting the kappa without the cells, the marginals, and the cap invites either of two wrong conclusions: that the comparison is worthless, or that the LLM is wrong in half of all decisions. Section 4 gives the metric set that blocks both.

## 2. Decomposition: task artifacts versus content disagreement

The human track recorded an exclusion reason for every exclusion. That single design fact makes the decomposition possible. The reason split of the 157 paired human exclusions, per confusion cell ([[verification-empirical-core]], sensitivity section; the per-reason counts of both cells recounted this session from `benchmark/data/merged_comparison.csv`):

| Reason | LLM-include / human-exclude cell (108) | Both-exclude cell (49) |
|---|---|---|
| Duplicate | 50 | 16 |
| No full text | 8 | 1 |
| Wrong publication type | 14 | 3 |
| Not relevant topic | 28 | 26 |
| Other (out-of-vocabulary value; no Language exclusion occurs among the paired rows) | 4 | 1 |
| Empty reason cell | 3 | 2 |
| Free-text reason | 1 | 0 |

Duplicate, No full text, and Wrong publication type are workflow criteria: they are properties of the corpus and the acquisition process, not of the paper's content, and they are invisible to a model that is handed one title and abstract with no corpus context. 72 of the 108 papers in the headline divergence cell (50 plus 8 plus 14, table above) are such exclusions; 58 of 108 counting only the two strictest cases (Duplicate, No full text). The traced example from [[verification-empirical-core]]: paper AFDLFCIL was excluded by the human track as Duplicate, and its content-identical twin was included; the LLM's Include on AFDLFCIL is content-correct and counts as divergence anyway.

Removing the 92 workflow-criteria exclusions (66 Duplicate, 9 No full text, 17 Wrong publication type across both cells, table above) yields the content-only benchmark ([[verification-empirical-core]], sensitivity table):

| Quantity | Headline (n = 291) | Content-only (n = 199) |
|---|---|---|
| Cells (II/IE/EI/EE) | 100/34/108/49 | 100/34/36/29 |
| Human include rate | 46.0 percent | 67.3 percent |
| LLM include rate | 71.5 percent | 68.3 percent |
| Include-rate gap | 25.5 points | 1.0 point |
| Disagreements | 142 | 70 |
| Cohen's kappa | 0.056 | 0.194 |
| PABAK | 0.024 | 0.296 |
| Bias index | 0.254 | 0.010 (recomputed this session: (36 minus 34)/199) |

The asymmetry argument dissolves at abstract level: 108 versus 34 becomes 36 versus 34, and the include rates converge to within one point. The milder cut (removing only Duplicate and No full text) gives n = 216, cells 100/34/50/32, kappa 0.142 ([[verification-empirical-core]]). Interpretation, marked as such: at abstract input, the data does not support an inclusion-bias claim for the LLM; what the headline cell mostly measures is that the human track was doing corpus management and the LLM was not, because it could not. What remains after the decomposition is a genuine, roughly symmetric content disagreement on about a third of the content-decidable papers (70 of 199, table above), whose interpretation is further bounded by the missing inter-human baseline (section 4).

## 3. The knowledge-document input effect (model x input)

The 2x2 experiment varies model (Haiku 4.5, Sonnet) and input (abstract, LLM-distilled knowledge document). Headline values from [[verification-empirical-core]] (2x2 table); the Sonnet+KD cells recounted this session from `benchmark/data/merged_sonnet_kd.csv`.

| Condition | Cells (II/IE/EI/EE) | LLM include rate | Kappa (n = 291) |
|---|---|---|---|
| Haiku + Abstract | 100/34/108/49 | 71.5 percent | 0.056 |
| Haiku + KD | 123/11/135/22 | 88.7 percent | 0.054 |
| Sonnet + Abstract | 118/16/122/35 | 82.5 percent | 0.098 |
| Sonnet + KD | 131/3/135/22 | 91.4 percent | 0.110 |

Under the content-only sensitivity (same 92 papers removed, human include rate 67.3 percent throughout; [[verification-empirical-core]], sensitivity table):

| Condition | Cells (II/IE/EI/EE) | LLM include rate | Kappa (n = 199) | PABAK |
|---|---|---|---|---|
| Haiku + Abstract | 100/34/36/29 | 68.3 percent | 0.194 | 0.296 |
| Haiku + KD | 123/11/55/10 | 89.4 percent | 0.087 | 0.337 |
| Sonnet + Abstract | 118/16/39/26 | 78.9 percent | 0.309 | 0.447 |
| Sonnet + KD | 131/3/50/15 | 91.0 percent | 0.256 | 0.467 |

Three results, in descending robustness.

The input effect on the include rate is the robust finding. Knowledge-document input raises the include rate in both models, headline by 17.2 points (Haiku) and 8.9 points (Sonnet), content-only by 21.1 points (Haiku) and 12.1 points (Sonnet), recomputed this session from the content-only include rates in the tables above (89.4 minus 68.3 and 91.0 minus 78.9). This is where the inclusion-bias claim survives: under enriched input both models apply a systematically lower exclusion threshold, content-only more than 20 points above the human rate. It is a descriptive two-model finding from exactly two KD-versus-abstract contrasts, not a general law.

The category-level mechanism is the Fairness degradation: kappa 0.3875 to 0.1564 (Haiku) and 0.3776 to 0.2458 (Sonnet) when moving from abstract to KD input, with the LLM Fairness yes-rate rising to 0.885 and 0.752 against a constant human 0.49 (`benchmark/results/agreement_haiku_kd.json`, `agreement_sonnet_kd.json` via [[verification-empirical-core]]). Interpretation, marked as such: fairness vocabulary saturates the distilled documents, and the model reads the distillate's framing as the paper's content. This is consistent across both models and is the strongest category-level claim the 2x2 supports.

The condition ranking is not robust. "Sonnet + KD is the best condition" holds on the headline kappas (0.110, table above) and flips under the content-only sensitivity, where Sonnet + Abstract leads (0.309 versus 0.256). The headline ranking rests on the chance-correction term alone: Sonnet + Abstract and Sonnet + KD have the identical raw agreement count of 153 of 291, and the kappa difference comes entirely from the more extreme marginals of the KD run ([[verification-empirical-core]]). The defensible sentence is: Sonnet is the better model at decision level in both input conditions; which Sonnet input condition is best depends on the treatment of non-content exclusions.

Two confounds bound all KD statements ([[verification-empirical-core]], limits of the 2x2). The KD conditions are mixtures: 209 of 326 papers were assessed on knowledge documents and 117 fell back to abstract-only (Input_Source column of the raw assessment files), so "plus KD" means "with KD where available". And the knowledge documents are themselves LLM-distilled, so the KD conditions test model judgment over machine-summarized text, not over more primary text. Additionally, each cell is one run at unrecorded decoding defaults (temperature never set, [[conformance-audit]]), so no dispersion estimate exists and kappa differences of the observed size (0.054 to 0.110 headline) cannot ground a ranking claim.

## 4. Why the prevalence explanation fails, and the defensible metric set

The previously documented framing explained kappa 0.056 as a prevalence-bias artifact per Byrt et al. 1993 (README.md, pre-correction state recorded in [[verification-empirical-core]]). That explanation is testable and fails in this data, in the checkable direction: the prevalence-and-bias-adjusted kappa is 0.024, lower than the unadjusted 0.056 ([[verification-empirical-core]]). A prevalence artifact would require PABAK above kappa, meaning the skew suppresses an actually higher agreement. Here observed agreement is 51.2 percent against 48.3 percent expected from the marginals ([[verification-empirical-core]]), so the marginal divergence inflates this kappa relative to PABAK rather than deflating it. The decision-level agreement of the headline benchmark is genuinely near chance, and no prevalence correction rescues it. The corrected README sentence is queued as a P6 item in [[plan]].

What carries the result instead is the decomposition across four numbers reported together, with the raw cells always beside them:

- po (0.512 headline, 0.648 content-only; [[verification-empirical-core]]) states the plain agreement before any correction.
- kappa (0.056 / 0.194) concedes the near-chance headline value instead of explaining it away.
- PABAK (0.024 / 0.296) shows the direction of the marginal effect and blocks the prevalence-artifact reading preemptively.
- kappa-max (0.508 headline; [[verification-empirical-core]]) shows that the marginal divergence alone caps attainable kappa at about 0.51, so the 0.056 must be read against a ceiling of 0.508, not against 1. The bias index (0.254 headline, 0.010 content-only; section 2) is the quantitative form of that threshold difference.

One additional diagnostic, recomputed in this session from the content-only cells of section 2 (100/34/36/29, marginals 134/65 human and 136/63 LLM): the content-only kappa-max is 0.977, because the converged marginals no longer cap agreement. The content-only kappa of 0.194 therefore sits far below an almost-open ceiling. Interpretation, marked as such: after the task artifacts are removed, the remaining disagreement is real judgment scatter, not a marginal artifact in either direction; the two tracks disagree on content in about one of three decidable cases.

This metric set is defensible precisely because it concedes everything a methods reviewer would check. It does not claim the headline kappa is better than it looks; it shows which structured disagreement produces it. The category kappas (0.3875 Fairness to 0.8163 Soziale_Arbeit, Gender 0.4074; `benchmark/results/agreement_metrics.json` via [[verification-empirical-core]]) are reported as the level where real signal lives, with the caveat that they rest on 234 to 238 pairs, not 291, and that subsample is skewed toward papers the assessors engaged with substantively ([[verification-empirical-core]]).

A boundary on all of it: the human track is one consolidated annotation without independent double coding, reviewer attribution, or an inter-human reliability statistic ([[conformance-audit]], reviewer-identity finding; the file has no reviewer column). External reference values (inter-human screening kappas of 0.77 to 0.84 in Woelfle et al. 2024 and Hanegraaf et al. 2024, but 0.29 to 0.39 for harder instruments and novice raters; via [[verification-empirical-core]]) suggest an unknown fraction of the 70 content disagreements would also appear between two independent human raters. Divergence quantities in this project are therefore divergence, never error rates.

## 5. The infrastructure corrected its own finding

The decomposition in section 2 was possible for exactly one reason: the human track recorded an exclusion reason for every exclusion, even though nothing in the original analysis plan required those reasons for the agreement computation. Without the reason column, the 108 cell would be a single uninterpretable number, the 25.5-point over-inclusion would have stood as the finding, and the prevalence-artifact framing would have remained the only available defense of it. With the reason column, the same repository that produced the misleading headline also contained the data to correct it. This is the epistemic-infrastructure argument of the project in one concrete instance: recording more than the immediate analysis needs is what makes findings auditable against themselves later ([[verification-novelty]] grounds the same argument at the report-artifact level).

The correction worked despite, not because of, the input hygiene. The reasons were documented as a controlled vocabulary but not enforced at input time: the 161 human exclusions include 7 empty reason cells and the out-of-vocabulary value Other ([[conformance-audit]], vocabulary finding), and the merged benchmark carries 5 empty reason cells (3 in the divergence cell, 2 in the both-exclude cell) and 1 free-text reason inside the two exclude cells (section 2 table). The decomposition survives because the violations are few; at a higher violation rate it would not have.

What round 2 must instrument, derived from this episode and aligned with the Stage B specification in [[plan]] and the design lessons in [[conformance-audit]]:

1. Enforced exclusion vocabulary at the input surface (the P3 import bridge validates it; violations become a visible report, never silent acceptance).
2. Deduplication as a separate identification-phase step before screening, so workflow exclusions never enter the agreement comparison at all. The 67 Duplicate exclusions in the human track ([[conformance-audit]]) show deduplication happened inside screening in round 1; the flow diagram must show round 1 as it happened and round 2 as designed.
3. Reviewer attribution per decision (the per-reviewer file schema with neutral reviewer ids), so the consolidated-annotation limitation of section 4 does not recur.
4. Recorded text source per decision (raw, knowledge document, abstract), so input-condition contrasts can be computed on actually-comparable subsets instead of mixed conditions (section 3 confound).
5. Recorded decoding parameters and repeated runs where feasible, so condition comparisons can carry dispersion estimates.
6. A pre-specified protocol before the first decision (the M1 gap; [[conformance-audit]]), including the planned agreement analysis with the decomposition built in, so the content-only view is a pre-registered primary analysis rather than a post-hoc sensitivity.

## 6. What this sharpens in the paper, and what follows for the programme

For the paper (TP6 in [[plan]]), the empirical section changes from a single dramatic number to a two-layer finding, and gains rather than loses force by it:

1. The headline result is reported in full (matrix 100/34/108/49, kappa 0.056, PABAK 0.024, kappa-max 0.508, bias index 0.254; section 1) and immediately decomposed: 72 of the 108 nominal divergences are workflow-criteria exclusions outside the LLM's information basis (section 2).
2. The content-only result becomes the substantive comparison: include rates 68.3 versus 67.3 percent, kappa 0.194 under a kappa-max of 0.977, 70 real content disagreements on 199 decidable papers (sections 2 and 4).
3. The inclusion-bias claim is restated narrowly: it survives only for knowledge-document input, where both models exceed the human include rate by more than 20 points content-only, with the Fairness category as the traced mechanism (section 3).
4. The condition-ranking claim is dropped in favor of the model-level statement (Sonnet better at decision level in both input conditions) plus the explicit sensitivity dependence (section 3).
5. All divergence language is divergence from one consolidated expert annotation, stated as such, with the missing inter-human baseline as a named limitation (section 4).
6. The methods narrative carries the section 5 episode explicitly: the infrastructure corrected its own finding because exclusion reasons were recorded; this is the conformance-by-construction contribution of [[verification-novelty]] demonstrated on the project's own first-round data, and it is the two-round story the follow-up paper tells (Stage R claim line in [[plan]]).

For the programme: TP3 feeds R4 (the record's agreement panel reports the content-only matrix beside the full matrix, which the recorded reasons make computable by construction) and constrains TP5 (the round-2 protocol pre-specifies the decomposed analysis and the instrumentation list of section 5). The remaining hardening steps, in ascending cost ([[verification-empirical-core]], consequences section): run the committed re-pairing script and resolve the 292-versus-291 record; recompute agreement with the three literal `?` category cells and the duplicate rows handled explicitly; subgroup the KD conditions by Input_Source; bootstrap and repeat runs at recorded decoding settings before any condition ranking; and the stratified second-rater sample (Stage R3) that converts divergence into an interpretable quantity. Until the script run, this document's numbers are licensed by the verification chain of [[verification-empirical-core]] plus the recounts named at each table.

*Updated: 2026-06-09*
