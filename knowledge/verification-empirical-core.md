---
title: "Verification: Empirical Core"
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
related: [plan, status, journal, paper-integrity]
---

This document is the result of phase V1 of [[plan]]: an adversarial recomputation of the project's central empirical claims from the raw assessment files, trusting no documented number. Scope: the benchmark pairing (claim a), the include rates (b), the confusion matrix (c), the decision kappa (d), the category kappas (e), the 2x2 information-basis experiment (f), and the state of the 2026-03-27 merge-bug fix (g), followed by an assessment of whether the documented interpretations survive the recomputed numbers. Every number in this document was counted or computed in this verification session; the source file is named at each table. The companion audit of process conformance is [[conformance-audit]]; the paper-versus-repository comparison is [[paper-integrity]].

## Verdict

**Reproduced exactly:** claims b, c, d, e, and the decision-level numbers of f. The benchmark cell counts (100 both-include, 34 human-include/LLM-exclude, 108 LLM-include/human-exclude, 49 both-exclude), the include rates (human 134/291 = 46.0 percent, LLM 208/291 = 71.5 percent), Cohen's kappa 0.0561, the category kappa range 0.3875 (Fairness) to 0.8163 (Soziale_Arbeit) with Gender 0.4074, and all four 2x2 conditions (include rates 71.5 / 88.7 / 82.5 / 91.4 percent, decision kappas 0.0561 / 0.0544 / 0.0979 / 0.1098) reproduce from the data.

**Reproduced with findings attached:** claim a (291 pairs of 303 human and 326 LLM rows reproduces; the one upstream discrepancy against `papers_full.csv` is resolved 2026-06-21, see Execution follow-up) and claim g (the merge fix is real in code and in the current artifacts).

**Deviates at the interpretation layer, not the number layer:** three documented interpretations do not survive scrutiny. First, the "prevalence-bias artifact" framing of kappa 0.056 (README.md, journal) is backwards: PABAK is 0.024, lower than kappa, so prevalence-and-bias adjustment makes the decision agreement look worse, not better. Second, more than half of the headline divergence cell (58 of 108, and 72 of 108 counting wrong publication type) consists of human exclusions for reasons the LLM could not see from a single title and abstract (duplicates, missing full text, publication type); in a content-only sensitivity the headline include-rate gap for Haiku plus abstract collapses from 25.5 points to 1.0 point. Third, "Sonnet + KD is the best condition overall" does not survive the same sensitivity, under which Sonnet + Abstract becomes the best decision-level condition.

**Limit of this verification:** the prepared end-to-end re-pairing script could not be executed because every code-execution channel of the session environment (Bash, PowerShell, Jupyter kernel) was unavailable throughout the session. The verification instead uses a closed chain of mechanical pattern counts on the raw and merged CSVs plus exact hand arithmetic, described under Method; the chain leaves no degree of freedom for the verified numbers, but running the script (`C:\tmp\verify_femprompt.py`, session-local) remains the cheap follow-up hardening step, and the per-category raw pairing is the one layer verified only through the merged artifact plus consistency identities.

## Method

Two execution-free layers were used, and it matters which number rests on which.

Layer 1, raw files. Row counts and decision marginals were counted with anchored regular expressions on the raw CSVs. Row counting used the row-start marker `^\d+,[A-Z0-9]{8},` (sequential ID, then 8-character Zotero key); decision counting on the LLM files used `(Ja|Nein),(Include|Exclude),`, which is position-unique because the decision column directly follows the ten Ja/Nein category columns; on the human file, `,Include,` and `,Exclude,` were counted (the decision is the only such token outside quoted prose; the counts 142 and 161 sum exactly to the 303 rows, and independently match the count in [[conformance-audit]], which parsed the same file with a CSV parser). Multi-line quoted fields make per-line counting fragile in principle; the human file has exactly two continuation lines (per the conformance audit's physical-line count), and all counts cross-checked.

Layer 2, the merge artifact `benchmark/data/merged_comparison.csv` and its three condition siblings. Confusion-matrix cells were counted with the column-sequence patterns `,Include,Include,Ja,` and the three analogues, which are unambiguous because the columns human_decision, agent_decision, agree_decision are adjacent and no other column triple can produce these sequences. The merged files are derived artifacts, so they were tied back to the raw files by four independent checks: (1) code review of `benchmark/scripts/merge_assessments.py` (pairing key is `Zotero_Key`, line 65) and `calculate_agreement.py` (standard Cohen's kappa, pairs with a missing decision dropped); (2) a bijectivity identity: the merged file has 291 both, 12 human-only, 35 LLM-only rows (positionally anchored counts), and 291 + 12 = 303 equals the raw human row count while 291 + 35 = 326 equals the raw LLM row count, which is only possible if neither raw file contains a duplicate Zotero key and the pairing is exact on the intersection; (3) marginal closure: paired human includes from the cells (100 + 34 = 134) plus the implied 8 includes among the 12 human-only rows equal the raw 142, and the paired LLM includes (208) are consistent with the raw 232 minus the 35 LLM-only rows; (4) spot traces of individual keys from both raw files into the merged file (22KJL3PC: human row 297, LLM row 212, decisions Include/Include; AFDLFCIL: human Exclude with reason Duplicate, LLM Include), confirming that the sequential IDs differ between the files and only key-based pairing can produce the observed rows.

All kappas, PABAK, kappa-max, and sensitivity values were then recomputed by hand from the verified cell counts using the standard formulas (kappa = (po - pe) / (1 - pe) with pe from the marginals; PABAK = 2po - 1). For the category kappas, where raw-level recounting was not feasible without execution, the reported values were verified by exact arithmetic identity: each category's kappa is fully determined by the reported n, agreement, and the two yes-counts, and all ten categories in `benchmark/results/agreement_metrics.json` satisfy the identity, in two cases only after accounting for a data quirk described below.

## Recomputation

### Benchmark core (Haiku 4.5, abstract input)

Source: raw counts from `benchmark/data/human_assessment.csv` and `benchmark/data/llm_assessment_10k.csv`; cells from `benchmark/data/merged_comparison.csv`; all derived statistics hand-computed from these counts.

| Quantity | Recomputed | Documented | Match |
|---|---|---|---|
| Human assessment rows | 303 (142 Include, 161 Exclude, 0 Unclear) | 303 (142/161) | yes |
| LLM assessment rows | 326 (232 Include, 94 Exclude) | 326 (232/94) | yes |
| Paired by Zotero_Key | 291 (12 human-only, 35 LLM-only) | 291 | yes |
| Confusion matrix (human x LLM) | 100 / 34 / 108 / 49 | 100 / 34 / 108 / 49 | yes |
| Human include rate | 134/291 = 0.4605 | 46.0 percent | yes |
| LLM include rate | 208/291 = 0.7148 | 71.5 percent | yes |
| Observed agreement po | 149/291 = 0.5120 | 0.512 | yes |
| Cohen's kappa | 0.0561 | 0.056 | yes |
| PABAK (2po - 1) | 0.0241 | not reported | new |
| Kappa-max given the marginals | 0.5081 | not reported | new |
| Prevalence index, bias index | 0.175, 0.254 | not reported | new |

### Category kappas (claim e)

Source: `benchmark/results/agreement_metrics.json`, each value verified by the arithmetic identity kappa = f(n, agreement, human yes-count, agent yes-count); the inputs trace to `merged_comparison.csv`. All ten reported kappas reproduce: Soziale_Arbeit 0.8163, Feministisch 0.7527, Generative_KI 0.5376, KI_Sonstige 0.5355, Prompting 0.5331, AI_Literacies 0.4880, Bias_Ungleichheit 0.4386, Diversitaet 0.4318, Gender 0.4074, Fairness 0.3875. The documented range 0.39 to 0.82 and the named values (claim e) are correct.

Two findings attach. First, the human CSV contains three literal `?` category cells (rows 167, 168: Generative_KI of the duplicated Ng 2021 entry; row 172: Soziale_Arbeit of Näscher 2025) and two lowercase `nein` cells. `merge_assessments.py` normalizes `nein` correctly but passes `?` through, so the kappa computation runs over a phantom third category; the Soziale_Arbeit value 0.8163 and the Generative_KI value 0.5376 only reproduce under exactly this treatment (dropping the Näscher pair would give Soziale_Arbeit roughly 0.825). The effect is below 0.01 everywhere and changes no conclusion, but the input vocabulary was not enforced, consistent with the hygiene finding in [[conformance-audit]]. Second, the category kappas rest on n = 234 to 238 pairs, not 291: roughly one fifth of paired papers lack human category values (largely the duplicate and no-full-text exclusions, where the assessors skipped category coding). Decision-level and category-level statements therefore describe different subsamples, and the category subsample is skewed toward papers the assessors engaged with substantively.

### 2x2 experiment (claim f)

Source: cells counted in `benchmark/data/merged_haiku_kd.csv`, `merged_sonnet.csv`, `merged_sonnet_kd.csv` (same patterns as above); raw marginals cross-checked in the three `llm_assessment_*.csv` files (281/45, 266/60, 293/33 Include/Exclude on 326 rows each); kappas hand-computed from the cells.

| Condition | Cells (II/IE/EI/EE) | LLM include | Decision kappa recomputed | Documented |
|---|---|---|---|---|
| Haiku + Abstract | 100/34/108/49 | 208/291 = 71.5 | 0.0561 | 71.5, 0.056 |
| Haiku + KD | 123/11/135/22 | 258/291 = 88.7 | 0.0544 | 88.7, 0.054 |
| Sonnet + Abstract | 118/16/122/35 | 240/291 = 82.5 | 0.0979 | 82.5, 0.098 |
| Sonnet + KD | 131/3/135/22 | 266/291 = 91.4 | 0.1098 | 91.4, 0.110 |

All documented decision-level numbers reproduce. The Fairness degradation claim also reproduces arithmetically from the condition JSONs (`benchmark/results/agreement_haiku_kd.json`, `agreement_sonnet_kd.json`): Fairness kappa 0.3875 to 0.1564 (Haiku) and 0.3776 to 0.2458 (Sonnet), with the LLM Fairness yes-rate jumping to 0.885 and 0.752 respectively against a constant human 0.49.

One design fact qualifies the whole table: the KD conditions are mixed conditions. By the `Input_Source` column of the raw files, 209 of 326 papers were assessed on knowledge documents and 117 fell back to abstract-only in both KD runs. Within the 291 benchmark pairs the KD share lies between 174 and 209 and was not separable without execution; no documented number is wrong because of this, but "Haiku + KD" means "Haiku with KD where available", and any per-condition claim inherits that dilution.

### Sensitivity: content-only benchmark

The human Exclude track mixes content judgments with corpus-management exclusions that the LLM had no information basis to replicate (a duplicate is invisible when the model sees one paper at a time). Recomputed reason split of the paired human exclusions (157), counted per confusion cell in `merged_comparison.csv`: in the LLM-include/human-exclude cell (108): 50 Duplicate, 8 No full text, 14 Wrong publication type, 28 Not relevant topic, 4 Language or Other, 3 empty, 1 free-text; in the both-exclude cell (49): 16 Duplicate, 1 No full text, 3 Wrong publication type, 26 Not relevant topic, 1 Language or Other, 2 empty. Removing the clearly non-content reasons (Duplicate, No full text, Wrong publication type; 92 papers) and recomputing by hand:

| Condition | n | Cells (II/IE/EI/EE) | Human include | LLM include | Kappa | PABAK |
|---|---|---|---|---|---|---|
| Haiku + Abstract | 199 | 100/34/36/29 | 67.3 | 68.3 | 0.194 | 0.296 |
| Haiku + KD | 199 | 123/11/55/10 | 67.3 | 89.4 | 0.087 | 0.337 |
| Sonnet + Abstract | 199 | 118/16/39/26 | 67.3 | 78.9 | 0.309 | 0.447 |
| Sonnet + KD | 199 | 131/3/50/15 | 67.3 | 91.0 | 0.256 | 0.467 |

(The milder cut, removing only Duplicate and No full text, gives n = 216, cells 100/34/50/32, kappa 0.142 for Haiku + Abstract.) Three things follow. The headline asymmetry 108 versus 34 becomes 36 versus 34 under the content-only view: at abstract level, Haiku's inclusion surplus over the human track almost vanishes (68.3 versus 67.3 percent). The KD over-inclusion is real and survives the sensitivity (plus 22 points both models). And the condition ranking flips: Sonnet + Abstract becomes the best decision-level condition (0.309), Sonnet + KD second (0.256), Haiku + KD clearly worst (0.087); the headline result "Sonnet + KD is the best condition" rests on the chance-correction term, since Sonnet + Abstract and Sonnet + KD have the identical raw agreement count of 153/291 and the kappa difference comes entirely from the more extreme marginals of the KD run.

### Claim g: the merge-bug fix

Verified threefold. The current `merge_assessments.py` pairs by `Zotero_Key` (line 65, with an explicit comment). The current artifacts were produced by the fixed code: `merged_comparison.csv` carries Zotero keys as `paper_id`, and the spot-traced keys have different sequential IDs in the two raw files (22KJL3PC is row 297 human and row 212 LLM), so ID-based pairing could not produce the observed merged rows. And the bijectivity identity above rules out residual silent mispairing by duplicate keys. The pre-fix numbers (kappa 0.035, matrix 65/23/78/34) survive only in journal and archive contexts, which is correct per the documentation policy. One adjacent discrepancy stays open, as already recorded in [[conformance-audit]]: `papers_full.csv` flags 292 papers as humanly assessed while only 291 pair; identifying the 292nd record requires the re-pairing script and is the first thing to check when it runs. (Resolved 2026-06-21, see Execution follow-up: the surplus key `2YS85B49` is a stray Has_HA flag absent from the human CSV, not a 292nd human decision.)

## Interpretation assessment

### The human track is one consolidated annotation, not a measured standard

The human CSV has no reviewer column. The documentation names the assessors collectively and inconsistently: `knowledge/status.md` names one primary assessor with 27 corrections or additions by a second person; `assessment/human/README.md` names two domain experts with consensus discussion of disagreements documented in Notes. No independent double coding, no adjudication log, and no inter-human reliability statistic exist for this track ([[conformance-audit]], reviewer-identity finding). The reference values the project cites (human inter-rater kappas of 0.77 to 0.84 in Woelfle et al. 2024 and Hanegraaf et al. 2024, but 0.29 to 0.39 for harder instruments and novice raters) are external. Consequence: every formulation of the kind "the LLM diverges from expert judgment by X" is, strictly, "the LLM diverges from one consolidated annotation process whose own reproducibility is unmeasured". An unknown fraction of the 70 content-level disagreements (36 plus 34 in the content-only view) would also appear between two independent human raters. The paper may keep the human track as its reference standard, and the epistemic argument (accountability resides with humans) is untouched, but it must not quantify "LLM error" against it, and it should state the missing baseline as a limitation rather than imply a gold standard.

### Divergence is not proof of LLM error, and the data shows it

The recomputation gives the asymmetry argument teeth in one direction and removes it in the other. Against the strong "inclusion bias" reading: 58 of the 108 papers in the headline divergence cell are duplicates or full-text failures, where the LLM answered a question the task design made unanswerable (the traced example AFDLFCIL is the content-identical twin of a paper the human track included; the LLM's Include is content-correct and counts as divergence anyway), and at abstract level the content-only include rates are nearly identical (68.3 versus 67.3 percent). For a real, weaker reading: under knowledge-document input both models over-include by more than 20 points even content-only, and the disagreement reasoning shows a mechanism, namely that the LLM was instructed to apply the two-condition rule mechanically while the assessors exercised judgment beyond it (the Näscher case carries the human note "Public Servants, nur TECHNIK": a target-population judgment the rule does not encode). Defensible phrasing: not "the LLM has an inclusion bias of 25 points" but "under enriched input the LLM applies a systematically lower exclusion threshold, and roughly half of the nominal divergence is an artifact of corpus-management exclusions outside the LLM's information basis".

### How to report kappa 0.056 so it cannot be dismissed

The currently documented framing, kappa 0.056 as a "prevalence-bias artifact per Byrt et al. 1993" (README.md), is the one statement a methods reviewer will test and reject: the prevalence-and-bias-adjusted kappa (PABAK) is 0.024, lower than the unadjusted 0.056, because observed agreement (51.2 percent) sits barely above the 48.3 percent expected from the two raters' marginals; the marginal divergence inflates rather than deflates this kappa relative to PABAK. The decision-level agreement of the headline benchmark is genuinely near chance, and no prevalence correction rescues it. What does carry the result is the decomposition: report po, kappa, PABAK, and kappa-max (0.508: the marginal divergence alone caps attainable kappa at about 0.51) together; report the bias index (0.254) as the quantitative form of the threshold difference; report the category kappas (0.39 to 0.82) as the level where real signal lives; and report the content-only sensitivity (kappa 0.194, asymmetry 36 versus 34) as the honest size of the judgment gap. That set is reviewer-proof because it concedes the near-chance headline number and shows precisely which structured disagreement produces it.

### Limits of the 2x2

The experiment has four cells, one run per cell, n = 291 throughout, no repeated runs (decoding temperature was never set and is an unrecorded API default, per [[conformance-audit]]), hence no dispersion estimate of any kind. The decision-kappa differences between conditions (0.054 to 0.110) are well within what single-run variation could produce at this n, and the recomputation showed the Sonnet ranking flipping under one defensible analytic choice. The include-rate effect of richer input is the robust part: it is large (17.2 and 8.9 points on the headline, 21 to 22 points content-only), directionally consistent across both models, and survives the sensitivity; as a descriptive two-model finding it can be stated, but "in ALL conditions" means exactly two KD-versus-abstract contrasts, not a general law. Two confounds must be named: the KD conditions are mixtures (209 of 326 papers KD-based, the rest abstract fallback), and the knowledge documents are themselves LLM-distilled, so the KD conditions test model judgment over machine-summarized text, not over more primary text. The Fairness degradation (0.39 to 0.16 and 0.38 to 0.25, with LLM yes-rates rising to 0.89 and 0.75) is consistent across both models and mechanistically plausible (fairness vocabulary saturates the distilled documents) and is the strongest category-level claim the 2x2 supports.

## Consequences for the paper

What may be stated as verified fact: the corpus and assessment counts (326, 303, 291, 142/161, 232/94); the confusion matrix and both include rates; kappa 0.056 with the full decomposition above; the category kappa range with Soziale_Arbeit and Feministisch substantial-to-almost-perfect and Fairness/Gender lowest; the KD-induced rise in include rate in both models; the Fairness degradation under KD input.

What must be rephrased: (1) drop the "prevalence-bias artifact" sentence and replace it with the po/PABAK/kappa-max decomposition; (2) every "LLM over-includes against expert judgment" sentence needs the duplicate confound named, with the content-only numbers (36 versus 34, 68.3 versus 67.3 percent) beside the headline numbers; (3) "Sonnet + KD is the best condition" becomes "Sonnet is the better model at decision level in both input conditions; which Sonnet condition is best depends on the treatment of non-content exclusions"; (4) the human track is "a consolidated expert annotation without independent double coding", and divergence quantities are divergence, not error rates; (5) the 2x2 is exploratory: one run per cell, mixed KD condition, LLM-distilled input texts.

What would harden the empirical core, in ascending cost: run the prepared re-pairing script end-to-end and resolve the 292-versus-291 record (minutes, removes the last derived-artifact dependency of this verification, including raw-level category pairing); rerun the agreement computation with the three `?` cells and the duplicate rows handled explicitly, publishing the content-only matrix beside the headline matrix; subgroup the KD conditions by `Input_Source` so the KD effect is estimated on actually-KD papers; bootstrap the papers (and ideally repeat the LLM runs at recorded decoding settings) to put intervals on all kappas before any condition ranking is claimed; have a second human independently re-screen a stratified sample (the confusion-matrix cells as strata, per Stage R3 of [[plan]]) to estimate the missing inter-human baseline, which converts "divergence" into an interpretable quantity; and resolve duplicates before comparison in the update round (Stage B), where the protocol can require it prospectively.

## Execution follow-up (2026-06-21)

The cheap hardening step this document named as pending, running the prepared re-pairing script end to end, is done. The session that wrote V1 had no code-execution channel; this one does. `benchmark/scripts/verify_femprompt.py` was executed and reproduces every figure in this document exactly: the matrix 100/34/108/49, kappa 0.0561, PABAK 0.0241, kappa-max 0.5081, the four 2x2 conditions, and the content-only sensitivity (n=199, matrix 100/34/36/29, kappa 0.1940). The committed `benchmark/results/recompute_verification.txt` matches the fresh run line for line, so the raw-level category pairing no longer rests on the merged artifact alone.

The 292-vs-291 record is resolved. `papers_full.csv` carries 292 Has_HA=Yes flags, but the surplus key `2YS85B49` does not appear in `human_assessment.csv` (303 rows, 303 unique keys). It is a stray metadata flag, not a 292nd human decision, so the 291 pairings stand and no figure in this document changes. The twelve human-only keys against the LLM CSV are a separate set, all twelve also absent from `papers_full.csv`.

A regression guard now holds these numbers. `benchmark/scripts/replay_selftest.py` re-pairs the raw CSVs independently of the diagnostic script and asserts the row counts, the pairing, the matrix, kappa, the content-only sensitivity, and the 292 resolution, exiting non-zero on any drift (PASS 18/18). What stays open from this document's harden-the-core list is the heavier work: subgrouping the KD conditions by `Input_Source`, bootstrapped intervals before any condition ranking, and the second-human re-screen for an inter-human baseline (Stage R3).

*Updated: 2026-06-21*
