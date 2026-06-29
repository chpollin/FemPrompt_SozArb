---
title: Verification and Audit
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
updated: 2026-06-29
authors: [Christopher Pollin]
generated-with: Claude Code
topics: ["[[Inter-Rater Reliability]]", "[[Benchmark]]", "[[Conformance]]"]
related: [methods, standards, plan, project]
---

This is the project's self-audit and the one place its numbers live. Every benchmark figure here was recomputed from the raw assessment files and is held by a committed regression guard, `benchmark/scripts/replay_selftest.py` (PASS 18/18), with the diagnostic recompute in `benchmark/scripts/verify_femprompt.py` and the committed output `benchmark/results/recompute_verification.txt`. Other knowledge documents state findings qualitatively and link here for the figures; the Evidence Companion renders the same numbers from the data. The document has three parts: the empirical recompute and the decomposed divergence finding (part 1), the conformance audit of the round-1 record carried through PRISM and the novelty verification (part 2), and the integrity check of the submitted paper against the repository (part 3).

---

# Part 1. Empirical core and divergence finding

The benchmark condition is Claude Haiku 4.5 on title and abstract against the consolidated human track, paired by Zotero key. The figures were first reproduced by an execution-free chain of anchored pattern counts and exact hand arithmetic over the raw and merged CSVs, then reproduced again by running the re-pairing script end to end (2026-06-21).

## 1.1 The benchmark core

Source: raw counts from `benchmark/data/human_assessment.csv` and `benchmark/data/llm_assessment_10k.csv`; cells from `benchmark/data/merged_comparison.csv`; derived statistics computed from those counts and asserted by `replay_selftest.py`.

| Quantity | Value |
|---|---|
| Human assessment rows | 303 (142 Include, 161 Exclude, 0 Unclear) |
| LLM assessment rows | 326 (232 Include, 94 Exclude) |
| Paired by Zotero_Key | 291 (12 human-only, 35 LLM-only) |
| Confusion matrix (both include / human-only / LLM-only / both exclude) | 100 / 34 / 108 / 49 |
| Human include rate | 134/291 = 46.0 percent |
| LLM include rate | 208/291 = 71.5 percent |
| Observed agreement po | 149/291 = 0.512 |
| Cohen's kappa | 0.0561 ("slight") |
| PABAK (2po minus 1) | 0.0241 |
| Kappa-max given the marginals | 0.5081 |
| Prevalence index, bias index | 0.175, 0.254 |

The headline reading would be that 142 of 291 decisions diverge (34 plus 108), the LLM includes 25.5 percentage points more than the human track, and chance-corrected agreement is near zero. Every part of that sentence is numerically true and, taken alone, misleading, for the two reasons part 1.4 and 1.5 unpack.

## 1.2 Category agreement

Source: `benchmark/results/agreement_metrics.json`, each value confirmed by the arithmetic identity kappa = f(n, agreement, human yes-count, agent yes-count).

| Category | Agreement | Kappa | Human yes-rate | LLM yes-rate |
|---|---|---|---|---|
| Soziale_Arbeit | 0.932 | 0.8163 | 0.238 | 0.247 |
| Feministisch | 0.910 | 0.7527 | 0.214 | 0.261 |
| Generative_KI | 0.759 | 0.5376 | 0.572 | 0.381 |
| KI_Sonstige | 0.770 | 0.5355 | 0.638 | 0.519 |
| Prompting | 0.801 | 0.5331 | 0.369 | 0.220 |
| AI_Literacies | 0.760 | 0.4880 | 0.261 | 0.433 |
| Bias_Ungleichheit | 0.795 | 0.4386 | 0.786 | 0.735 |
| Diversitaet | 0.701 | 0.4318 | 0.624 | 0.393 |
| Gender | 0.680 | 0.4074 | 0.611 | 0.316 |
| Fairness | 0.692 | 0.3875 | 0.491 | 0.637 |

Two caveats attach. The category kappas rest on n = 234 to 238 pairs, not 291, because roughly one fifth of paired papers lack human category values (largely the duplicate and no-full-text exclusions, where the assessors skipped category coding); decision-level and category-level statements therefore describe different subsamples, and the category subsample is skewed toward papers the assessors engaged with substantively. The human CSV also contains three literal `?` category cells and two lowercase `nein` cells; `merge_assessments.py` normalizes `nein` but passes `?` through, so two kappas (Soziale_Arbeit, Generative_KI) reproduce only under exactly that treatment. The effect is below 0.01 everywhere and changes no conclusion, but the input vocabulary was not enforced, consistent with the hygiene finding in part 2.

## 1.3 The model-by-input experiment

A 2x2 design varies the model (Haiku 4.5, Sonnet 4.6) and the input (title-and-abstract, LLM-distilled knowledge document), all on the 291 benchmark pairs. Cells counted in `benchmark/data/merged_comparison.csv`, `merged_haiku_kd.csv`, `merged_sonnet.csv`, `merged_sonnet_kd.csv`.

| Condition | Cells (II/IE/EI/EE) | LLM include rate | Decision kappa |
|---|---|---|---|
| Haiku + Abstract | 100/34/108/49 | 71.5 percent | 0.0561 |
| Haiku + KD | 123/11/135/22 | 88.7 percent | 0.0544 |
| Sonnet + Abstract | 118/16/122/35 | 82.5 percent | 0.0979 |
| Sonnet + KD | 131/3/135/22 | 91.4 percent | 0.1098 |

Two confounds bound every per-condition claim. The KD conditions are mixtures: 209 of 326 papers were assessed on knowledge documents and 117 fell back to abstract-only (the `Input_Source` column), so "plus KD" means "with KD where available". And the knowledge documents are themselves LLM-distilled, so the KD conditions test model judgment over machine-summarized text, not over more primary text. Each cell is one run at unrecorded decoding defaults (temperature was never set), so no dispersion estimate exists, and decision-kappa differences of the observed size (0.054 to 0.110) cannot ground a ranking claim.

## 1.4 Decomposition: task artifacts versus content disagreement

The human track recorded an exclusion reason for every exclusion. That single design fact makes the decomposition possible. The reason split of the 157 paired human exclusions, per confusion cell, recounted from `merged_comparison.csv`:

| Reason | LLM-include / human-exclude cell (108) | Both-exclude cell (49) |
|---|---|---|
| Duplicate | 50 | 16 |
| No full text | 8 | 1 |
| Wrong publication type | 14 | 3 |
| Not relevant topic | 28 | 26 |
| Other (out of vocabulary) or Language | 4 | 1 |
| Empty reason cell | 3 | 2 |
| Free-text reason | 1 | 0 |

Duplicate, No full text, and Wrong publication type are workflow criteria. They are properties of the corpus and the acquisition process, not of the paper's content, and they are invisible to a model handed one title and abstract with no corpus context. 72 of the 108 papers in the headline divergence cell are such exclusions; 58 counting only the two strictest cases. The traced example is paper AFDLFCIL, excluded by the human track as Duplicate while its content-identical twin was included; the LLM's Include on it is content-correct and counts as divergence anyway.

Removing the 92 workflow-criteria exclusions yields the content-only benchmark.

| Quantity | Headline (n = 291) | Content-only (n = 199) |
|---|---|---|
| Cells (II/IE/EI/EE) | 100/34/108/49 | 100/34/36/29 |
| Human include rate | 46.0 percent | 67.3 percent |
| LLM include rate | 71.5 percent | 68.3 percent |
| Include-rate gap | 25.5 points | 1.0 point |
| Disagreements | 142 | 70 |
| Cohen's kappa | 0.056 | 0.194 |
| PABAK | 0.024 | 0.296 |
| Bias index | 0.254 | 0.010 |

The asymmetry argument dissolves at abstract level: 108 versus 34 becomes 36 versus 34, and the include rates converge to within one point. The milder cut (removing only Duplicate and No full text) gives n = 216, cells 100/34/50/32, kappa 0.142. What remains after the decomposition is a genuine, roughly symmetric content disagreement on about a third of the content-decidable papers (70 of 199), whose interpretation is bounded by the missing inter-human baseline (part 1.6).

Under the same content-only cut the 2x2 reorders. Sonnet + Abstract becomes the best decision-level condition (kappa 0.309), Sonnet + KD second (0.256), Haiku + KD clearly worst (0.087); the headline result "Sonnet + KD is the best condition" rests on the chance-correction term, since Sonnet + Abstract and Sonnet + KD have the identical raw agreement count and the kappa difference comes entirely from the more extreme marginals of the KD run. The one robust input effect is on the include rate: knowledge-document input raises it in both models, content-only by 21.1 points (Haiku) and 12.1 points (Sonnet); this is where the inclusion-bias claim survives, with the Fairness category as the traced mechanism (kappa 0.3875 to 0.1564 for Haiku, 0.3776 to 0.2458 for Sonnet, the LLM Fairness yes-rate rising against a constant human rate as the distilled documents saturate with fairness vocabulary).

## 1.5 Why the prevalence explanation fails, and the defensible metric set

The previously documented framing explained kappa 0.056 as a prevalence-bias artifact per Byrt et al. 1993. That explanation is testable and fails in the checkable direction: the prevalence-and-bias-adjusted kappa (PABAK) is 0.024, lower than the unadjusted 0.056, because observed agreement (51.2 percent) sits barely above the 48.3 percent expected from the marginals. The marginal divergence inflates this kappa relative to PABAK rather than deflating it. The decision-level agreement of the headline benchmark is genuinely near chance, and no prevalence correction rescues it.

What carries the result is the decomposition reported across four numbers together, with the raw cells beside them: po (0.512 headline, 0.648 content-only), kappa (0.056 / 0.194), PABAK (0.024 / 0.296), and kappa-max (0.508 headline, so the 0.056 must be read against a ceiling of 0.51, not 1; content-only the ceiling rises to 0.977, so the 0.194 sits far below an almost-open ceiling). The bias index (0.254 headline, 0.010 content-only) is the quantitative form of the threshold difference. The category kappas are the level where real signal lives, with the n-caveat of part 1.2. This set is defensible precisely because it concedes the near-chance headline number and shows which structured disagreement produces it.

## 1.6 The human track is one consolidated annotation, not a measured standard

The human CSV has no reviewer column. The assessors are documented only collectively, a primary assessor with corrections or additions by a second person, with no independent double coding, no adjudication log, and no inter-human reliability statistic for the track. External reference values (inter-human screening kappas of 0.77 to 0.84 in Woelfle et al. 2024 and Hanegraaf et al. 2024, but 0.29 to 0.39 for harder instruments and novice raters) suggest an unknown fraction of the 70 content disagreements would also appear between two independent human raters. Every formulation of the kind "the LLM diverges from expert judgment by X" is, strictly, "the LLM diverges from one consolidated annotation process whose own reproducibility is unmeasured". The expert track remains the binding reference and the epistemic argument (accountability resides with humans) is untouched, but divergence quantities in this project are divergence, never error rates.

## 1.7 The infrastructure corrected its own finding

The decomposition was possible for one reason: the human track recorded an exclusion reason for every exclusion, even though nothing in the original analysis plan required those reasons for the agreement computation. Without the reason column, the 108 cell would be a single uninterpretable number, the 25.5-point over-inclusion would have stood as the finding, and the prevalence-artifact framing would have remained the only available defense of it. With the reason column, the same repository that produced the misleading headline also contained the data to correct it. This is the epistemic-infrastructure argument of the project in one concrete instance: recording more than the immediate analysis needs is what makes findings auditable against themselves later. The correction worked despite, not because of, the input hygiene; it survives because the vocabulary violations (the value Other, seven empty reason cells) are few.

## 1.8 Consequences for the paper, and the hardening list

What may be stated as verified fact: the corpus and assessment counts; the confusion matrix and both include rates; kappa 0.056 with the full decomposition above; the category kappa range with Soziale_Arbeit and Feministisch substantial-to-almost-perfect and Fairness and Gender lowest; the KD-induced rise in include rate in both models; the Fairness degradation under KD input.

What must be phrased carefully: drop the prevalence-bias-artifact sentence for the po/PABAK/kappa-max decomposition; every "LLM over-includes against expert judgment" sentence needs the duplicate confound named, with the content-only numbers beside the headline; "Sonnet + KD is the best condition" becomes "Sonnet is the better model at decision level in both input conditions, and which Sonnet condition is best depends on the treatment of non-content exclusions"; the human track is "a consolidated expert annotation without independent double coding", and divergence quantities are divergence, not error rates; the 2x2 is exploratory, one run per cell, mixed KD condition, LLM-distilled input texts.

What would still harden the empirical core, in ascending cost: subgroup the KD conditions by `Input_Source` so the KD effect is estimated on actually-KD papers; bootstrap the papers and ideally repeat the LLM runs at recorded decoding settings before any condition ranking is claimed; have a second human independently re-screen a stratified sample (the confusion-matrix cells as strata, Stage R3 of [[plan]]) to estimate the missing inter-human baseline, which converts divergence into an interpretable quantity; and resolve duplicates before comparison in the update round (Stage B), where the protocol can require it prospectively.

## 1.9 The pattern classification

The 142 disagreements were classified by Claude Sonnet 4.6 into three patterns. Canonical counts in `docs/data/promptotyping_v2.json` (`meta.pattern_distribution`): Semantic Expansion 73, Implicit Field Membership 42, Keyword Inclusion 26 (141 classified, plus 1 case with an empty pattern), i.e. 52 / 30 / 18 percent. The earlier Haiku classification (81 / 11 / 8) is superseded. The pattern split is a qualitative LLM classification, so the recompute guard does not recount it; its source is the JSON the Companion renders.

## 1.10 Execution follow-up (2026-06-21)

The re-pairing script was executed end to end. `verify_femprompt.py` reproduces every figure above exactly: the matrix 100/34/108/49, kappa 0.0561, PABAK 0.0241, kappa-max 0.5081, the four 2x2 conditions, and the content-only sensitivity (n=199, matrix 100/34/36/29, kappa 0.1940). The committed `recompute_verification.txt` matches the fresh run line for line, so the raw-level category pairing no longer rests on the merged artifact alone. The 292-versus-291 record is resolved: `papers_full.csv` carries 292 Has_HA flags, but the surplus key `2YS85B49` does not appear in `human_assessment.csv`; it is a stray metadata flag, not a 292nd human decision, so the 291 pairings stand. The regression guard `replay_selftest.py` re-pairs the raw CSVs independently and asserts the row counts, the pairing, the matrix, the kappa, the content-only sensitivity, and the 292 resolution (PASS 18/18).

---

# Part 2. Conformance, the round-1 record through PRISM, and novelty

This part carries the conducted first review round through PRISM into the PRISMA 2020 plus PRISMA-trAIce structure, audits how far it conforms, and verifies the novelty claim the project makes for its instrument. The standards themselves (PRISMA 2020, trAIce, RAISE, with item counts and citations) are in [[standards]]. Under ADR-019 round 1 is carried through PRISM as the first real pass, with the published record (R5) as its completion step; conformance holds for the items the recorded data supports, and the items unrepairable in retrospect (the absent pre-registered protocol M1 above all, the lost acquisition provenance, the papers with no served text) stay named as permanent limits, since pre-specification cannot be created after the fact. The update round (Stage B of [[plan]]) runs the same gate prospectively. The machine-readable companions are `docs/data/flow_model.json` (per-count sources) and `docs/data/conformance_map.json` (item-level status). Each record section below ends with what a reader can and cannot verify.

## 2.1 The first-round PRISMA record carried through PRISM

### Identification

The corpus is 326 records (`benchmark/data/papers_full.csv`). Identification used four AI deep-research providers (ChatGPT, Claude, Gemini, Perplexity) plus a manual search; the deviation from standard database searches is documented and justified in [[methods]]. The per-source distribution exists only for the 303 records of the human track, via the Source_Tool column: Perplexity 74, Claude 63, ChatGPT 62, Gemini 54, Manual 50, summing to 303.

Acquisition is the record's first named gap. The Source_Tool column predates the repository record and is not auditable; the repository corroborates provenance for exactly 34 records through restored RIS files (Claude 15, Gemini 3, OpenAI 6, Perplexity 10). The executed deep-research prompt instantiations were never committed; only the restored template survives. Query dates and provider-side model versions are unknown. Five further acquisition claims (low cross-provider overlap, single-provider finds, identical structured instructions to all four models, non-reproducible repeated queries, assistant-side merging and metadata cleaning) cannot be verified from the repository (part 3, section on non-verifiable claims). Duplicate handling also deviates from the textbook flow: 95 records are flagged as duplicates in `papers_full.csv`, but none were removed before screening; deduplication happened inside human screening, as 67 exclusions with the reason Duplicate. The flow model records this as it happened rather than back-fitting a duplicates-removed box.

A reader can verify the 326-record corpus, the 95 duplicate flags, and the Source_Tool tallies by recounting the named files. A reader cannot verify that the Source_Tool attributions are true (except for the 34 RIS-corroborated records), when and with which provider model versions the searches ran, or what prompt text was executed.

### Screening

Screening ran as two strictly separate tracks on identical ten-category criteria (`benchmark/config/categories.yaml`); the AI track is advisory and the human decision is binding throughout. The human track holds 303 decisions (142 Include, 161 Exclude, no Unclear), with recorded exclusion reasons 67 Duplicate, 54 Not relevant topic, 17 Wrong publication type, 10 No full text, 5 Other, 0 Language, 7 empty cells, plus one row not attributable by pattern matching. The AI track holds 326 assessments (232 Include, 94 Exclude), model snapshot claude-haiku-4-5-20251001, max_tokens 1024, temperature and top-p unrecorded API defaults, input title plus abstract per paper. 291 papers carry both decisions; the confusion matrix and its full decomposition are in part 1.

The human track has two structural gaps. 34 of the 326 corpus papers carry no human decision at all (`papers_full.csv`, Has_HA = No); for these only the advisory AI assessment exists, and nothing in the repository explains the selection of what was humanly screened. And the human track is one consolidated annotation without a reviewer column (part 1.6).

A reader can verify every count in this section by recounting the three CSVs with the rules in `flow_model.json` and the pairing against `agreement_metrics.json`. A reader cannot verify who inside the human track took which decision, on which text basis a decision was taken (no text_source field existed in round 1), or why 34 corpus papers were never humanly screened.

### Included

The binding included set of round 1 is the 142 human Include decisions. Within the 291 paired papers, 134 sit (100 with AI agreement, 34 against an AI exclude); the remaining 8 are among the 12 human-only records outside the AI corpus file (134 plus 8 equals 142). The AI track's advisory included set is 232; it never determined inclusion. The text basis is uneven and documented: of 326 corpus papers, 236 have a served knowledge document, 75 have only an abstract, and 15 have no text at all in the served infrastructure; upstream, 257 of 326 PDFs were acquired (69 behind access barriers), 252 converted, 249 distilled. For the 15 no-text papers a binding human decision may exist while no evidence basis survives, so an evidence-grounded replay cannot read what the screener read.

### Protocol and pre-specification

The round had no pre-registered protocol: no PROSPERO or OSF registration, no protocol document, no amendment record, and no pre-specification of the AI use (PRISMA 2020 item 24 and trAIce M1, both missing). Unlike every other gap, this one is non-reconstructable by definition; a pre-specification cannot be created after the fact, only declared absent. The literature update (Stage B of [[plan]]) closes it prospectively, with a protocol committed before any run; the draft is [[update-protocol]].

## 2.2 Conformance tally and findings

The full item-by-item judgment is in `docs/data/conformance_map.json`. Of the 27 PRISMA 2020 items, 10 are reconstructable (items 1 to 5, 9, 10, 16, 17, 27), 7 partial (6, 7, 8, 13, 19, 20, 23), and 10 missing (11, 12, 14, 15, 18, 21, 22, 24, 25, 26). Of the 17 PRISMA-trAIce items, 13 are reconstructable (T1, A1, I1, M3, M4, M5, M8, M9, M10, R1, R2, D1, D2), 3 partial (M2, M6, M7), and 1 missing (M1).

The shape of the two tallies is the finding. The reconstructable PRISMA core covers exactly what the project recorded as data (eligibility criteria, data items, the selection flow, study characteristics, availability), while the missing block is dominated by the appraisal layer of a full systematic review (risk of bias, effect measures, reporting bias, certainty) plus the administrative declarations (registration, support, competing interests). The trAIce profile is markedly stronger because the dual-track design is precisely what trAIce asks for: separate AI and human decision records (R1), a performance evaluation against a human reference standard (M9, R2), and full human oversight (M8) exist as data, not as assertions.

The individual findings behind the partial and missing items:

- Non-auditable acquisition. The repository corroborates provider provenance for 34 of 326 records (the restored RIS files); the Source_Tool column claims provenance for all 303 but is not auditable. The executed prompt text was never committed.
- No pre-registered protocol. trAIce M1 and item 24 are missing in the strict sense; this is the one hard, non-reconstructable gap.
- Papers without any text. 15 of 326 papers have no served text, so an evidence-grounded replay cannot read what the screener read.
- Prompt and parameter record incomplete. The assessment script pins the model snapshot and max_tokens but never sets temperature or top-p; the executed deep-research prompt is partly lost; the 5D assessment prompt is referenced as a file that does not exist in the working tree.
- Per-record reviewer identity absent. The human CSV has no reviewer column; the PRISM per-reviewer files fix this prospectively.
- Vocabulary and hygiene. The value Other is outside the controlled vocabulary of `categories.yaml`, and empty reason cells violate it; the vocabulary was documented but not enforced at input time.

The boundary between the repairable and the unrepairable is the design specification for the infrastructure. Pre-specification is unrecoverable, so a protocol and the declared intent of AI use must exist before the first decision. Acquisition provenance must be captured at the moment of the run, the executed prompt and the provider and model version stored as files. Every decision needs its actor and its evidence basis. Controlled vocabularies must be enforced by the input surface, not documented beside it. And reported numbers must be derivations, not prose: every count that lived in documentation drifted from the data (305 versus 303 records, 75 versus 74 Perplexity, 292 versus 291 pairings), while every count derivable from files was exact. Generating the record from the data removes the class of error rather than correcting instances of it.

## 2.3 Novelty verification

A deliberately adversarial web verification (2026-06-09) tested the claim that no existing tool implements the trAIce R1 AI-versus-human flow split or RAISE-style disclosure generation, and that a screening record conformant by construction is a real contribution. The claim holds partially. What is refuted: recording AI screening decisions as a separate, reviewer-attributed, advisory record next to a binding human decision is established practice in at least three mature tools (EPPI-Reviewer, Nested Knowledge Robot Screener, DistillerSR) and is marketed by Elicit. The paper must not claim novelty for AI-human decision separation as such. What holds: no surveyed tool emits the trAIce adapted flow diagram (R1, AI exclusions versus human exclusions as separate fields), no surveyed tool auto-generates a trAIce or RAISE disclosure section from session data (the closest are static reporting templates from Covidence and documentation pages from Nested Knowledge), and the only software artifact invoking PRISMA-trAIce by name is a two-commit, zero-star prototype (varlet99/prisma-traice-review-tool, April 2026). No publication retrospectively documents an already-conducted LLM-assisted review as a trAIce artifact.

### Tool landscape (accessed 2026-06-09)

Criteria: (i) AI screening; (ii) the AI decision kept as a separate, advisory, reviewer-attributed record next to the binding human decision; (iii) emission of trAIce/RAISE-conformant reporting artifacts (R1 flow split, disclosure section).

| Tool | AI screening | Separate advisory AI record (ii) | Disclosure generation (iii) |
|---|---|---|---|
| EPPI-Reviewer | Yes (priority screening; GPT-4o coding) | Yes; LLM coding attributed to the robot itself, always discriminable from human coding; comparison mode against a human gold standard | No |
| Nested Knowledge | Yes (Robot Screener, Smart Screener) | Yes; Robot Screener acts as one reviewer in dual screening, decision persists, human adjudication is binding | No; a RAISE Compliance Guide is user-facing documentation, not a session-derived artifact |
| DistillerSR | Yes (DistillerAI classifiers) | Yes (vendor documentation); automated second reviewer flagging discrepancies, audit trail per reviewer and timestamp | No |
| Covidence | Yes (Cochrane RCT classifier) | Partial; the classifier excludes before screening, inspectable and restorable | Partial; the PRISMA flow documents the one automated step; static reporting templates aligned with RAISE |
| Elicit | Yes (criteria-based LLM screening) | Claimed, not documented | No documented R1 split or disclosure generation |
| Rayyan | Yes (5-star relevance prediction) | No; advisory display, not a persisted decision | No |
| ASReview, SWIFT-Active Screener, Abstrackr, RobotAnalyst | Yes (active learning / prioritization) | No, by design; they rank, they make no include/exclude decision | No |
| Laser AI, silvi.ai | Yes (prioritization, suggestions) | Not documented as a reviewer-attributed decision record | No documented disclosure generation |
| varlet99/prisma-traice-review-tool | Yes (multi-provider LLM) | Partial; human can validate/modify/cancel the AI decision, separate persistence not documented | Not confirmed; methodology PDF export exists |
| Black-Lights/prisma-review-tool | Yes (rule-based plus AI via MCP) | No | No trAIce/RAISE mention |

### The defensible contribution

Phrased with a time stamp and a knowledge qualifier ("to our knowledge, as of June 2026"): PRISM is the first screening tool documented to emit the PRISMA-trAIce adapted flow diagram (R1) as a working artifact with separate AI and human tallies (Covidence comes closest, with a single automated step in its flow); the first documented to auto-generate a consolidated AI-disclosure section from the session data itself rather than static templates; the conformance-by-construction argument is the contribution, because the data model records AI and human decisions as separate first-class records with derivation logic, so the R1 artifact and the disclosure fall out of the data; and the retrospective trAIce rendering of an already-completed two-round review is an unpublished framing, with AITDI (the AI Transparency and Disclosure Index, JMIR Research Protocols 2026 e90588) as the adjacent assessment-side counterpart. Required hedges: trAIce is a six-month-old proposal without consensus endorsement and minimal citation uptake, so "conformant" means conformant to a proposed living guideline; the RAISE guidance papers are OSF preprints under journal review; and the commercial landscape responds quickly, so the novelty window for disclosure generation may be short and the survey date must be stated.

### Related work the paper must cite

Holst et al. 2025 (PRISMA-trAIce, cite as proposal); Flemyng et al. 2025 (RAISE position statement); Thomas et al. (RAISE 1 to 3 guidance, OSF, check for the Research Synthesis Methods publication before submission); EPPI-Reviewer, Nested Knowledge Robot Screener, and DistillerSR as prior art for AI-human decision separation; Covidence responsible automation; AIscreenR / Vembye et al. (GPT as second screener with benchmarking) as prior art for the dual-track design; the AITDI meta-research protocol as adjacent retrospective transparency assessment; varlet99/prisma-traice-review-tool as the only other software invoking trAIce by name; and the adapted-flow-diagram genre (review updates, living systematic reviews) for the diagram lineage. Full source URLs are in `docs/data/conformance_map.json` and the project's bibliography.

---

# Part 3. Paper versus repository

This part is the integrity check of the submitted Forum Wissenschaft paper (2/2026, based on knowledge document v12) against the repository. The paper is submitted and editorially closed; this is therefore the historical audit of the submitted text, kept for the two deviations that carry into the follow-up paper and as the record of how the repository was held as ground truth. Core principle: where paper and repo contradict, the paper is adjusted.

## 3.1 What was verified and what was corrected

The technical workflow is precisely and correctly described: the three-stage knowledge distillation (LLM extract, deterministic format, LLM verify), the deterministic stage 2 with no API call, the confidence formula (Completeness 40 percent, Correctness 40 percent, Categories 20 percent, threshold under 75), Docling conversion, the dual-pane validation tool, and the hierarchical PDF acquisition all match the code. The assessment system (the ten binary categories, the inclusion logic, the dual track) matches `categories.yaml` and the code. The corpus and pipeline counts match the files (part 1, part 2.1). Four problems from earlier paper versions were fixed in the submitted text: the manually identified studies are now mentioned, the Vault is described as in progress rather than complete, the absolute "no ungrounded LLM outputs" claim was softened, and an unimplemented MCP channel was removed.

## 3.2 The deviations, resolved and standing

Most deviations the earlier checks flagged were resolved in the submitted version: "every conversion" became "a sample", the contradictory non-verifiable-entries sentence was removed, the deep-research prompt provenance is stated honestly (template documented, instantiated prompt lost), and the kappa-as-lead-metric problem was resolved by removal, the submitted paper carrying no benchmark numbers at all and deferring all quantitative claims to the announced separate publication. The merge bug (matching by sequential ID instead of Zotero key, which produced the superseded kappa 0.035 and matrix 65/23/78/34) was fixed in code on 2026-03-27; the correct values are in part 1.

Two deviations stand, both confirmed in the submitted version and both carried to the follow-up paper rather than corrected with the editorial office (author decision 2026-06-09):

- 3.9, LLM path input basis. The submitted text says the LLM path assesses "auf Basis der extrahierten Wissensdokumente". The primary LLM assessment ran on title plus abstract; knowledge documents were the input only in the supplementary 2x2 arm, and there as a mixed condition (209 of 326 papers on knowledge documents, 117 on abstract). The follow-up paper states the input bases precisely.
- 3.10, research question quoted in shortened form. The submitted text presents an abridged form of the footnoted research-question template as a verbatim quotation. Low severity; quoted correctly in the follow-up.

## 3.3 What the repository cannot verify

Several paper claims rest on data the repository does not hold, and the paper marks them as magnitudes or as derived from reflection: the low cross-provider overlap and single-provider finds (provenance exists for 34 of 326 papers), the identical structured instructions to all four models (prompts not committed), the temporal instability of repeated queries (no experiment logged), the assistant-side merge and metadata cleaning (no audit trail), and the typology of expert decision types (an analytical reflection, not derivable from repository data). The theoretical superstructure (epistemic asymmetry, Hauswald, Co-Intelligence, epistemic infrastructure) lives in the paper and [[project]], not in code, which is legitimate for a paper's framework; the audit's role was only to flag where a "finding" offered as empirical evidence is thinly evidenced in the repository, and those are named here.

## 3.4 Standing repository to-dos surfaced by the check

Two items remain on the repository side, independent of the closed paper: document the RIS conversion process (the round-2 procedure and prompt are now in [[update-protocol]]), and complete the Source_Tool mapping from the human assessment file (provenance is currently auditable for 34 of 326).

## Sources

All numbers in part 1 trace to `benchmark/data/*.csv`, `benchmark/results/agreement_metrics.json`, and `docs/data/promptotyping_v2.json`, and are held by `benchmark/scripts/replay_selftest.py` and `verify_femprompt.py`. Part 2 traces to `docs/data/flow_model.json`, `docs/data/conformance_map.json`, the restored RIS files, and the primary standards sources listed in [[standards]]; the novelty survey URLs are in `conformance_map.json`. Part 3 checks the submitted paper text (as provided by the author 2026-06-09) against the repository.

## Related

- [[standards]]
- [[methods]]
- [[plan]]
- [[project]]
