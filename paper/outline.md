---
title: "Paper Outline: Follow-up Paper (Two-Round Review Record)"
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: draft
language: en
version: "0.1"
created: 2026-06-09
updated: 2026-06-09
authors: [Christopher Pollin]
generated-with: Claude Code
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
related: [plan, verification]
---

**SUPERSEDED IN STRUCTURE (2026-06-09, narrative decision): the paper is results-led.** The research question (prompt engineering for social work, gender, and bias) leads; the workflow moves into the methods section; the divergence analysis becomes the validation subsection of the results; the deep methodological material lives on the Evidence Companion as citable supplement. The current draft implementing this structure is `paper/draft.md` (register 2, chosen by both style judges). This outline remains valid as the claims inventory: every claim-to-source mapping below still licenses the draft's numbers, and the section content carries over into the new structure (sections 4 to 6 into methods, section 7 into results-validation, sections 2 to 3 compressed into background and discussion).

Original lead: Full outline of the follow-up paper (TP6 in [[plan]]). The paper describes the workflow of a dual-track literature review in social work and the use of large language models across its two rounds: a first round conducted before the instrument existed and rendered retrospectively as an honest PRISMA 2020 plus PRISMA-trAIce record with named gaps, and a second round (the literature update) conducted prospectively through the instrument with conformance enforced by construction. The Forum Wissenschaft paper is the precursor; this paper is fed by the Stage R record (R4), the Stage B update (B3), and the TP3 divergence analysis.

## Register and claims discipline (binding for the draft)

- The paper describes the workflow and the LLM use. It makes no efficiency, time-saving, or cost-benefit claims anywhere. Cost and token figures appear only as factual disclosure in the AI use section. Source: [[plan]], section "Zielbild" (narrative register decision, 2026-06-09).
- Every empirical number cites a committed, recomputable source. Until `knowledge/analysis-divergence.md` (TP3) exists, the licensing source for all benchmark numbers is `knowledge/verification.md`; once TP3 lands, the paper cites the committed analysis document and this outline's inventory entries are re-pointed. Source: [[plan]], section "TP3 work plan".
- The contribution is phrased exactly as licensed by `knowledge/verification.md`: generated PRISMA-trAIce flow artifact (checklist item R1), session-derived disclosure generation, and retrospective trAIce rendering. The paper does not claim novelty for AI-human decision separation as such; EPPI-Reviewer, Nested Knowledge, and DistillerSR are named as prior art in related work. Source: knowledge/verification.md, sections "2.3 (Novelty verification)" and "2.3 (Novelty verification, the defensible contribution)".
- Novelty statements carry the qualifier "to our knowledge, as of June 2026" and state the survey date. Source: knowledge/verification.md, section "2.3 (Novelty verification, the defensible contribution)".
- Divergence framing rules: no error-rate language (no inter-human baseline exists), divergence is decomposed before it is interpreted, the inclusion-bias claim survives only for the knowledge-document input condition. Source: [[plan]], section "V: Claim verification" (consequence ledger); knowledge/verification.md, section "1.8 (Consequences for the paper)".
- Reviewer identities appear as neutral ids (R1, R2); no personal names in data, figures, or examples. To avoid collision, trAIce checklist items are always written fully qualified ("trAIce item R1") and plan phases as "phase R1 of the plan".
- Before submission: paper-integrity check of every claim against the repository ([[plan]], Programme verification and validation matrix, row TP6); re-check whether the RAISE guidance papers have appeared in Research Synthesis Methods and whether the varlet99 prototype has evolved (knowledge/verification.md, sections "2.3 (Novelty verification, related work)" and "2.3 (Novelty verification)").

## Working title and format

Working title (to be decided with co-authors): "Conformant by Construction: Documenting Human and LLM Decisions Across Two Rounds of a Literature Review on Generative AI, Gender, and Social Work". Alternative: "An Honest Record First: Retrospective and Prospective PRISMA-trAIce Reporting of an LLM-Assisted Review".

Target length 6000 to 8000 words excluding abstract, references, and appendices. The per-section lower bounds below sum to about 6550 words and the upper bounds to about 8550; drafting trims toward the corridor, with section 7 protected and sections 2, 3, and 9 as the cut candidates. Figures planned: (F1) the generated trAIce-adapted flow diagram of round one with the AI versus human split; (F2) the conformance tally as a two-panel item chart (PRISMA 2020 and trAIce); (F3) the decomposed divergence figure (full matrix beside content-only matrix); (F4) the 2x2 condition table with the content-only sensitivity. Appendices: the generated disclosure text, the conformance map excerpt, the protocol document of round two.

## 1. Introduction (600 to 750 words)

Bullets:

- The case: a literature review on generative AI, gender, bias, and social work, corpus of 326 papers, screened in two parallel tracks from the start, a consolidated human expert annotation and a batch LLM assessment, with category judgments on ten criteria.
- The problem: reporting standards for AI-assisted evidence synthesis exist as fresh proposals (PRISMA-trAIce, 2025) and institutional position statements (RAISE, 2025), but they are barely operationalized as data models or working tools; vendors respond with compliance documentation rather than conformant report generation.
- The design answer: a two-round story. Round one was conducted without a pre-specified protocol and is rendered retrospectively and honestly, with every gap named (no conformance claim is made for it). Round two, the literature update, runs through an instrument (PRISM) whose data model makes the trAIce flow artifact and the disclosure section fall out of the recorded data. The contrast between what could and could not be reconstructed post hoc is the paper's central design argument.
- Contributions, exactly four: (C1) a screening instrument that emits the PRISMA-trAIce adapted flow diagram (trAIce item R1) as a working artifact with separate tallies for AI and human decisions; (C2) session-derived generation of a consolidated AI disclosure section (trAIce M-items plus RAISE Table 1 elements) instead of static templates; (C3) the retrospective trAIce rendering of an already-completed two-round review, presented as an unpublished framing as of June 2026; (C4) a decomposed empirical analysis of human-LLM screening divergence on this corpus, reported as divergence, not error.
- Roadmap paragraph.

Claims inventory:

- "326 papers, dual human and LLM assessment from the start" and "303 human records (142 Include, 161 Exclude), 326 LLM records": knowledge/verification.md, section "1.1 (The benchmark core)"; knowledge/verification.md, section "2.1 (the round-1 record, Screening)".
- "Round one rendered retrospectively and honestly, with named gaps; no conformance claim": [[plan]], section "Stage R" (shaping decisions and claim line).
- C1 and C2 as "first tool documented to", with hedge and survey date: knowledge/verification.md, section "2.3 (Novelty verification, the defensible contribution)", items 1 and 2.
- C3 "unpublished framing as of 2026-06-09": knowledge/verification.md, section "2.3 (Novelty verification, the defensible contribution)".
- C4 framing (divergence, not error): knowledge/verification.md, section "1.6 (The human track, one consolidated annotation)".
- "PRISMA-trAIce and RAISE barely operationalized as tools" and "vendors respond with compliance documentation rather than conformant report generation": knowledge/verification.md, section "2.3 (Novelty verification)" (conclusion paragraph).

## 2. Background: reporting standards for AI-assisted evidence synthesis (500 to 650 words)

Bullets:

- PRISMA 2020 as the baseline reporting framework; what its 27 items cover and where AI involvement is invisible in it.
- PRISMA-trAIce: Holst et al. 2025, JMIR AI, 17-item checklist along the PRISMA 2020 section structure (14 non-optional, 3 optional), items graded Mandatory to Optional; explicitly a foundational proposal without formal consensus process, not EQUATOR-registered; living-guideline governance via GitHub repository; the adapted flow diagram with separate fields for records screened by AI systems versus human reviewers (trAIce item R1). Cited as a proposal throughout.
- RAISE, two layers cited separately: the position statement (Flemyng et al. 2025, co-published across Cochrane, Campbell, JBI, CEE; carries the mandatory reporting elements of Table 1: system names, versions, dates, purpose and stages, methodological justification, validation evidence, limitations, interests) and the three guidance documents (Thomas et al., OSF, revised 2026-03-13, under journal review; preprint-level, cited with version date).
- Uptake status as context for the contribution window: minimal citation uptake of trAIce so far; vendors respond to RAISE with compliance documentation rather than conformant report generation.

Claims inventory:

- All bibliographic facts on PRISMA-trAIce (authors, venue, DOI 10.2196/80247, 17 items, proposal status, governance, trAIce item R1 description): knowledge/verification.md (Part 2.3, novelty verification).
- "5 citing papers on Semantic Scholar as of 2026-06-09; none implements the checklist as software": knowledge/verification.md (Part 2.3, novelty verification; citation uptake).
- All bibliographic facts on RAISE (position statement co-publication, Table 1 elements, OSF guidance status and revision date): knowledge/verification.md, section "2.3 (Novelty verification, related work)".
- "Vendors respond with compliance documentation, not conformant report generation": knowledge/verification.md, section "2.3 (Novelty verification)" (conclusion) and section "2.3 (Novelty verification, Tool landscape)" (Covidence and Nested Knowledge rows).

## 3. Related work: tools and prior art (600 to 750 words)

Bullets:

- Explicit non-claim up front: recording AI screening decisions as a separate, advisory, reviewer-attributed record next to a binding human decision is established practice. Prior art named: EPPI-Reviewer (LLM coding attributed to a robot reviewer, discriminable from human coding, comparison mode against a human gold standard), Nested Knowledge Robot Screener (AI as one reviewer in dual screening, decisions persist as reviewer-level records, binding human adjudication), DistillerSR (classifier as automated second reviewer, per-reviewer audit trail).
- Partial neighbours: Covidence (one automated exclusion step documented in the auto-updated PRISMA flow; static RAISE-aligned reporting templates), Elicit (claimed but not documented dual-review data model), Rayyan, ASReview, SWIFT-Active Screener, Abstrackr, RobotAnalyst (prioritization or advisory display without persisted AI decision records).
- Nearest related software: the varlet99/prisma-traice-review-tool prototype, the only software artifact invoking PRISMA-trAIce by name (created 2026-04-15, early stage); its undocumented properties stated as such.
- Methodological prior art for the dual-track design: AIscreenR / Vembye et al. (GPT as second screener with benchmarking).
- Adjacent assessment-side work: the AITDI meta-research protocol (retrospective transparency assessment of published AI-assisted reviews), distinct from rendering one's own review as a conformant artifact.
- Adapted-flow-diagram genre note: flow adaptations exist for review updates and living systematic reviews; the trAIce diagram continues this genre, and PRISM would be, to our knowledge, the first tool to emit it.
- What no surveyed tool does: emit the trAIce item R1 flow split or auto-generate a trAIce/RAISE disclosure from session data. This delimits C1 and C2.

Claims inventory:

- Prior-art characterizations of EPPI-Reviewer, Nested Knowledge, DistillerSR (criterion ii yes) and the non-claim consequence: knowledge/verification.md, sections "2.3 (Novelty verification, Tool landscape)" and "2.3 (Novelty verification, the defensible contribution)" (first paragraph).
- Covidence partial status (automated step in flow, static templates, RAISE alignment): knowledge/verification.md, section "2.3 (Novelty verification, Tool landscape)", Covidence row.
- Elicit "claimed, not documented": knowledge/verification.md, section "2.3 (Novelty verification, Tool landscape)", Elicit row, and section "2.3 (Novelty verification)".
- varlet99 prototype facts (creation date, scope, undocumented properties): knowledge/verification.md, section "2.3 (Novelty verification)".
- AIscreenR as methodological prior art: knowledge/verification.md, section "2.3 (Novelty verification, related work)", item 8.
- AITDI as adjacent retrospective assessment: knowledge/verification.md, sections "2.3 (Novelty verification)" and "2.3 (Novelty verification, the defensible contribution)".
- "No surveyed tool emits the trAIce item R1 split or session-derived disclosure": knowledge/verification.md, section "2.3 (Novelty verification)".
- Adapted-flow-diagram genre: knowledge/verification.md, section "2.3 (Novelty verification, the defensible contribution)".

## 4. Round one: the conducted review and its workflow (700 to 900 words)

Bullets:

- Identification: deep-research prompts run across four LLM providers plus manual additions; provider provenance recorded per paper in the human CSV (Source_Tool counts: Perplexity 74, Claude 63, ChatGPT 62, Gemini 54, Manual 50; sum 303); the executed prompt instantiations were not committed at run time, and post-hoc recovery corroborates provenance for exactly 34 records via restored RIS files. Stated plainly as a provenance limitation of round one.
- Screening, human track: the reviewing experts (R1, R2) recorded category judgments and decisions in a shared Excel workflow; the CSV carries no reviewer column, so the track is one consolidated annotation (including corrections or additions by the second person), not two independent codings. Deduplication happened inside screening rather than as a separate identification step, and the flow diagram represents it as it happened.
- Screening, LLM track: batch assessment of all 326 papers with a pinned model snapshot (claude-haiku-4-5-20251001), max_tokens 1024, versioned assessment prompt; temperature and top-p were never set and are unrecorded API defaults, disclosed as such. Later extended to a 2x2 (two models, two input bases) for the benchmark analysis (section 7).
- Text pipeline as LLM use: PDFs acquired for 257 of 326 papers (69 behind access barriers), 252 converted, 249 distilled into LLM-generated knowledge documents; the served corpus offers a knowledge document for 236 papers, abstract only for 75, no text for 15.
- Register note for drafting: this section describes what was done and with which models and parameters; it draws no comparison of effort or speed against a conventional workflow.

Claims inventory:

- Source_Tool distribution and 303-record count: knowledge/verification.md, section "2.1 (the round-1 record, Screening)" (drift paragraph; the CSV is named as ground truth).
- Non-auditable acquisition claims and the 34 corroborated records (15 Claude, 3 Gemini, 6 OpenAI, 10 Perplexity): knowledge/verification.md, section "2.2 (Conformance tally and findings)".
- No reviewer column, consolidated annotation, corrections by a second person: knowledge/verification.md, section "2.2 (Conformance tally and findings)"; knowledge/verification.md, section "1.6 (The human track, one consolidated annotation)".
- Deduplication inside screening; 67 Duplicate exclusions; 95 records flagged as duplicates in papers_full.csv: knowledge/verification.md, section "2.1 (the round-1 record, Identification)".
- Model snapshot, max_tokens, unrecorded temperature: knowledge/verification.md, section "2.2 (Conformance tally and findings)".
- Versioned assessment prompt (the 10K assessment prompt, version history v1.0 to v2.1, embedded in `benchmark/scripts/run_llm_assessment.py`): prompts/CHANGELOG.md, sections "Prompt-Inventar" and "10K Assessment".
- Pipeline counts (257/69/252/249) and text availability (236/75/15): knowledge/verification.md, section "2.1 (the round-1 record, Included)".

## 5. The instrument: PRISM (600 to 800 words)

Bullets:

- Design position: PRISM is the downstream PRISMA layer over an established capture workflow, not its replacement. The reviewing experts keep recording categories and decisions in the known Excel format; PRISM ingests that export over an import bridge and carries evidence grounding, flow, agreement, checklist, disclosure, and record generation.
- Data model: AI and human decisions as separate first-class records with derivation logic; per-reviewer files with timestamps; pinned evidence per category; recorded text source per decision (raw text, knowledge document, abstract). The human decision is always the binding record.
- Import validation as enforced hygiene: controlled-vocabulary check on exclusion reasons, category completeness, duplicate keys; violations become a visible import report, never silent acceptance. Motivated directly by the round-one findings (out-of-vocabulary value Other, empty reason cells).
- Generated artifacts (the contribution carriers): the trAIce-adapted flow diagram with separate AI and human tallies (trAIce item R1); the consolidated disclosure section generated from session data (trAIce M-items plus RAISE Table 1 elements); both PRISMA checklists filled from a machine-readable conformance map.
- The conformance-by-construction argument: because the data model records both decision tracks as first-class data, the report artifacts are derivations of the data instead of prose written after the fact. Reported numbers that lived in prose drifted in round one; every count derivable from files was exact. Generation removes the class of error.
- Agreement panel reports the content-only agreement beside the full matrix, since recorded exclusion reasons make the decomposition possible (ties the instrument to section 7).
- Drafting constraint: every feature named here must match the shipped tool at submission; the paper-integrity check covers this section.

Claims inventory:

- Excel-Vorstufe design position and bridge scope: [[plan]], sections "Zielbild" (point 2) and "P3: Excel-to-PRISM bridge".
- Import-validation rationale (Other, 7 empty cells): knowledge/verification.md, section "2.2 (Conformance tally and findings)".
- C1/C2 phrasing ("first screening tool documented to emit", "first tool documented to auto-generate", with hedge): knowledge/verification.md, section "2.3 (Novelty verification, the defensible contribution)", items 1 to 3.
- "Numbers in prose drifted, derived counts were exact" (305 versus 303, 75 versus 74, 292 versus 291): knowledge/verification.md, section "2.2 (Conformance tally and findings)" (fifth point) and "Papers without a human decision".
- Content-only agreement in the panel as tool implication: [[plan]], section "V: Claim verification" (consequence ledger, tool implication sentence).

## 6. Rendering round one retrospectively: the conformance audit (600 to 800 words)

Bullets:

- Method: every PRISMA 2020 item (27) and every trAIce item (17 as encoded in the tool) judged against named repository files; result is a machine-readable conformance map driving the checklist surface; every number computed from files, not copied from prose.
- Tally, PRISMA 2020: 10 reconstructable, 7 partial, 10 missing. The reconstructable core is exactly what was recorded as data (eligibility, data items, selection flow, study characteristics, availability); the missing block is the appraisal layer of a full systematic review (risk of bias, effect measures, certainty) plus administrative declarations.
- Tally, PRISMA-trAIce: 13 reconstructable, 3 partial, 1 missing. The trAIce profile is markedly stronger because the dual-track design is what trAIce asks for: separate decision records, performance evaluation against a human reference, full human oversight, all present as data.
- The one hard gap: trAIce item M1 (pre-specified protocol and declared AI use) is missing and non-reconstructable by definition; a pre-specification cannot be created after the fact, only declared absent. This motivates round two.
- The named gaps presented as findings, not flaws: 34 corpus papers without a human decision; one record marked humanly assessed that did not pair in the benchmark merge (292 versus 291, open); 15 papers with no surviving text basis; vocabulary violations; absent per-record reviewer identity; incomplete prompt and parameter record (unrecorded decoding defaults, partly lost deep-research prompt, missing 5D prompt file).
- Claim line stated verbatim in spirit: the record is published as an honest retrospective rendering; no conformance claim is made for round one.

Claims inventory:

- Audit method and conformance map: knowledge/verification.md, opening section and section "2.2 (Conformance tally and findings)".
- PRISMA 2020 tally (10/7/10) with item groups: knowledge/verification.md, section "2.2 (Conformance tally and findings)".
- trAIce tally (13/3/1) and the explanation of the stronger profile: knowledge/verification.md, section "2.2 (Conformance tally and findings)".
- M1 missing and non-reconstructable by definition: knowledge/verification.md, section "2.1 (the round-1 record, Protocol and pre-specification)".
- 34 papers without human decision; 292 versus 291 open discrepancy: knowledge/verification.md, section "2.1 (the round-1 record, Screening)"; knowledge/verification.md, section "1.10 (Execution follow-up)" (the discrepancy restated as open).
- 15 papers without any text: knowledge/verification.md, section "2.2 (Conformance tally and findings)".
- Prompt and parameter gaps: knowledge/verification.md, section "2.2 (Conformance tally and findings)".
- "Honest retrospective record, no conformance claim": [[plan]], section "Stage R" (claim line).

## 7. Empirical core: the decomposed divergence finding (1100 to 1400 words)

Bullets:

- Benchmark core (headline condition, Haiku plus abstract input): 291 pairs from 303 human and 326 LLM records; confusion matrix 100 both-include, 34 human-include/LLM-exclude, 108 LLM-include/human-exclude, 49 both-exclude; include rates human 46.0 percent, LLM 71.5 percent; observed agreement 0.512; Cohen's kappa 0.056.
- Report the full decomposition set together, so the near-chance headline number cannot be dismissed and is not oversold: po 0.512, kappa 0.056, PABAK 0.024, kappa-max 0.508, bias index 0.254. Explicitly concede that decision-level agreement in the headline condition is genuinely near chance; the previously documented prevalence-artifact framing is dropped (PABAK lies below kappa, so prevalence adjustment makes agreement look worse, not better).
- The decomposition that carries the finding: 72 of the 108 papers in the headline divergence cell are human exclusions for Duplicate (50), No full text (8), or Wrong publication type (14), criteria a one-paper-at-a-time LLM cannot see. Content-only sensitivity (n=199): the asymmetry 108 versus 34 becomes 36 versus 34, include rates converge (LLM 68.3 versus human 67.3 percent), kappa rises to 0.194. Defensible phrasing fixed here: not "the LLM has an inclusion bias of 25 points" but "under enriched input the LLM applies a systematically lower exclusion threshold, and roughly half of the nominal divergence is an artifact of corpus-management exclusions outside the LLM's information basis".
- Worked example (anonymized by Zotero key): the traced duplicate pair where the LLM's Include is content-correct and counts as divergence anyway.
- Category level, where the signal lives: category kappas range 0.39 (Fairness) to 0.82 (Soziale_Arbeit), Gender 0.41; caveat that category kappas rest on 234 to 238 pairs, a subsample skewed toward substantively engaged papers.
- The 2x2 (two models, two input bases), reported as exploratory: include rates 71.5 / 88.7 / 82.5 / 91.4 percent and decision kappas 0.056 / 0.054 / 0.098 / 0.110 (Haiku abstract, Haiku KD, Sonnet abstract, Sonnet KD). Robust part: knowledge-document input raises the include rate in both models (17.2 and 8.9 points on the headline); content-only, both models over-include against the human track by more than 20 points. Non-robust part: the condition ranking flips under the content-only sensitivity (Sonnet abstract 0.309 becomes the best decision-level condition); "Sonnet plus KD is the best condition" is not stated. Confounds named: KD conditions are mixed (209 of 326 papers KD-based, the rest abstract fallback), knowledge documents are themselves LLM-distilled, one run per cell with no dispersion estimate, unrecorded decoding settings.
- Strongest category-level claim of the 2x2: Fairness degradation under KD input, kappa 0.39 to 0.16 (Haiku) and 0.38 to 0.25 (Sonnet), with LLM Fairness yes-rates rising to 0.89 and 0.75 against a constant human 0.49; mechanism stated as plausible (fairness vocabulary saturates the distilled documents), consistent across both models.
- Human track framed throughout as "one consolidated expert annotation without independent double coding"; divergence quantities are divergence, not error rates; external inter-human kappas (0.77 to 0.84 in comparable published screenings, 0.29 to 0.39 for harder instruments) cited as context only.
- The infrastructure-corrects-itself narrative made explicit: the decomposition was only possible because exclusion reasons were recorded per decision; the recorded data corrected the project's own earlier interpretation.

Claims inventory (all numbers in this section):

- Pairing, matrix, include rates, po, kappa: knowledge/verification.md, section "1.1 (The benchmark core)".
- PABAK 0.024, kappa-max 0.508, prevalence and bias index (0.175, 0.254): same section (rows marked new).
- Dropping the prevalence-artifact framing: knowledge/verification.md, section "1.5 (The defensible metric set)".
- Reason split of the divergence cell (50/8/14, plus 28 Not relevant topic and small residues) and of the both-exclude cell: knowledge/verification.md, section "1.4 (Decomposition, task artifacts versus content)".
- Content-only table (n=199; cells; kappas 0.194 / 0.087 / 0.309 / 0.256; PABAKs) and the milder-cut variant (n=216, kappa 0.142): same section.
- Defensible phrasing and the worked duplicate example: knowledge/verification.md, section "1.4 (Decomposition, task artifacts versus content)".
- Category kappas (all ten values, range, subsample n=234 to 238, the `?` cell quirk if mentioned): knowledge/verification.md, section "1.2 (Category agreement)".
- 2x2 condition table (include rates, kappas) and raw marginals: knowledge/verification.md, section "1.3 (The model-by-input experiment)".
- KD mixed-condition fact (209 of 326): same section (design fact paragraph).
- KD include-rate effect (17.2 and 8.9 points on the headline; content-only over-inclusion against the human track above 20 points in both models): knowledge/verification.md, sections "1.3 (The model-by-input experiment)" and "1.4 (Decomposition, task artifacts versus content)".
- Ranking flip and identical raw agreement count (153/291) behind the Sonnet kappa difference: knowledge/verification.md, section "1.4 (Decomposition, task artifacts versus content)".
- Exploratory status of the 2x2 (one run per cell, no dispersion, unrecorded decoding): knowledge/verification.md, section "1.3 (The model-by-input experiment)"; knowledge/verification.md, section "2.2 (Conformance tally and findings)".
- Fairness degradation values and yes-rates: knowledge/verification.md, section "1.3 (The model-by-input experiment)".
- Human-track framing and external reference kappas: knowledge/verification.md, section "1.6 (The human track, one consolidated annotation)".
- Re-pointing note: when `knowledge/analysis-divergence.md` (TP3) is committed, every entry above cites it instead; the analysis document must reproduce these values from committed script output before the paper draft freezes. Source for this process: [[plan]], section "TP3 work plan".

## 8. Round two: the enforced prospective protocol (550 to 700 words)

Bullets:

- The design inversion: everything the audit found unrecoverable in round one is required up front in round two. A pre-specified protocol document is committed before any run (closes trAIce item M1 prospectively), fixing search prompts, AI use, vocabulary, reviewer assignment, and stopping criteria.
- Identification with provenance at run time: re-run of the versioned deep-research prompts under the established CHANGELOG governance; executed prompt verbatim, provider, model version, run date, and raw output stored as files at the moment of the run.
- Screening: the reviewing experts (R1, R2) screen in PRISM, the binding surface, with a reviewer column and enforced vocabulary; a batch captured in a spreadsheet instead imports over the validation bridge; the offline LLM assessment runs with versioned prompt and recorded parameters as the sibling track; evidence grounding lives in PRISM.
- Reconciliation of divergent human decisions recorded as data (trAIce item M8); the consensus decision and the process persist in the record.
- Optional third track, contingent on execution: an interactive agent screening pass in the real frontend under its own pre-committed protocol (phase R3 of the plan), yielding a three-track comparison (human, batch LLM, interactive agent). Marked in the outline as pending; no numbers exist yet, and the section is written conditionally until R3 and R4 outputs are committed.
- Output: the complete PRISMA record bundle generated over the updated corpus (flow SVG with the trAIce item R1 split, agreement metrics for all tracks, both filled checklists, disclosure text, decision-log CSV); the paper's methods and disclosure sections are generated from this bundle and then edited by the authors, with the integrity check against the repository before submission.
- Update results (corpus growth, new divergence numbers) appear here only after B2/B3 execution; placeholders carry the source path of the future record bundle.

Claims inventory:

- All bullets in this section are design statements, licensed by [[plan]], sections "Stage B" (B1 to B3) and "R3: Interactive agent screening pass". No empirical numbers may appear in this section until the Stage B record bundle and the R3/R4 outputs exist in the repo; every future number cites the committed bundle files.
- "Closes M1 prospectively": knowledge/verification.md, section "2.1 (the round-1 record, Protocol and pre-specification)" (the update as the opportunity to close it).

## 9. Discussion: what the infrastructure must record from the start (550 to 700 words)

Bullets:

- The boundary between repairable and unrepairable gaps as the design specification for epistemic infrastructure, organized as the five lessons: (1) pre-specification is unrecoverable; (2) acquisition provenance must be captured at the moment of the run (post-hoc ceiling demonstrated: 34 of 326 corroborated); (3) every decision needs its actor and its evidence basis; (4) controlled vocabularies must be enforced by the input surface, not documented beside it; (5) reported numbers must be derivations, not prose.
- The two-round contrast cashes the argument: the same review team, the same corpus domain, one round reconstructed with named holes and one round conformant by construction.
- What the divergence analysis means for LLM-assisted screening practice in this domain: divergence decomposition requires recorded exclusion reasons; a tool that records them makes the workflow-versus-content split computable for any review; the binding human decision plus advisory AI record is the established pattern, and the contribution sits at the report-artifact level.
- Honest placement of the contribution: trAIce is a proposal, "conformant" means conformant to a proposed living guideline; commercial vendors respond quickly to RAISE, so the novelty window for disclosure generation may be short; the survey date is stated.
- Generalization path: the instrument is designed for reuse with own categories, corpus, and prompts (Stage C of the plan), positioned as a methodological showcase, without overclaiming beyond the documented setup path.

Claims inventory:

- The five lessons and the repairable/unrepairable boundary: knowledge/verification.md, section "2.2 (Conformance tally and findings)".
- Post-hoc recovery ceiling (34 of 326): knowledge/verification.md, section "2.2 (Conformance tally and findings)".
- Contribution placement at report-artifact level and the established advisory-record pattern: knowledge/verification.md, sections "2.3 (Novelty verification)" and "2.3 (Novelty verification, the defensible contribution)".
- Proposal status hedge and short novelty window: knowledge/verification.md, section "2.3 (Novelty verification, the defensible contribution)" (required hedges).
- Decomposition requires recorded reasons (infrastructure-corrects-itself): knowledge/verification.md, section "1.4 (Decomposition, task artifacts versus content)"; [[plan]], section "TP3 work plan" (framing rules).
- Reuse path: [[plan]], section "C3: Reuse extraction" (design statement, no execution claim before it happens).

## 10. Limitations (350 to 500 words)

Bullets:

- No inter-human reliability baseline: the human track is one consolidated annotation whose own reproducibility is unmeasured; an unknown fraction of the content-level disagreements would also appear between two independent human raters; divergence quantities are therefore not error rates. External inter-human kappas cited as context, not as a substitute baseline.
- Data gaps of round one carried into the record: 34 corpus papers without a human decision, plus one unresolved pairing discrepancy (one record marked humanly assessed that does not pair in the benchmark merge, 292 versus 291), reported as an open inconsistency.
- The 2x2 is exploratory: one run per cell, mixed KD condition, LLM-distilled input texts, unrecorded decoding defaults; no condition ranking is claimed.
- Proxy-written user stories: the usage scenarios that drove the instrument design were written by the technical lead as a user proxy and had not been validated by the named users at design time; one usage assumption (whether colleagues screen in the tool or capture in their spreadsheet) was open at design time and has since been settled by ADR-019 in favour of in-tool screening, with spreadsheet import as a migration seam. Validation status at submission is reported as it stands.
- Standards immaturity: PRISMA-trAIce is a proposal without consensus endorsement; RAISE guidance is preprint-level at the time of the survey; conformance claims are relative to these versions, with dates.
- Novelty survey coverage: public documentation only, preprints and grey literature incomplete, vendor features behind login walls unverifiable; survey date 2026-06-09 stated in the paper.

Claims inventory:

- Missing inter-human baseline and its consequence: knowledge/verification.md, section "1.6 (The human track, one consolidated annotation)".
- 34 papers without human decision; 292 versus 291 discrepancy: knowledge/verification.md, section "2.1 (the round-1 record, Screening)".
- Exploratory 2x2: knowledge/verification.md, section "1.3 (The model-by-input experiment)".
- Proxy-written user stories and the in-tool-versus-Excel usage assumption settled by ADR-019: knowledge/specification.md, ADR-019; per-story validation status in knowledge/plan.md.
- Standards status hedges: knowledge/verification.md, sections "2.3 (Novelty verification, related work)" and "2.3 (Novelty verification, the defensible contribution)".
- Survey coverage limits: knowledge/verification.md, section "2.3 (Novelty verification)".

## 11. AI use disclosure (250 to 350 words)

Bullets:

- This section is itself a demonstration object: the paper's disclosure text is generated from the record bundle (model names, versions, dates, purpose per stage, parameters, costs) and then edited by the authors; the section states this provenance.
- Factual disclosure of LLM use across the project, per stage: identification (deep-research runs across four providers), screening (batch assessment with pinned snapshot claude-haiku-4-5-20251001, max_tokens 1024, temperature unrecorded API default, disclosed as a gap for round one; recorded parameters in round two), text preparation (LLM-distilled knowledge documents), instrument development and knowledge-base authoring (Claude Code sessions under the Promptotyping method), agent click-testing, and the verification documents underlying this paper.
- Cost and token figures appear here as factual disclosure only, taken from the generated bundle; no efficiency or cost-benefit interpretation accompanies them.
- RAISE Table 1 element coverage cross-referenced to the generated disclosure in the appendix.

Claims inventory:

- Disclosure generation from session data and author editing: [[plan]], section "B3: Reconciliation and the PRISMA record"; novelty phrasing for the generated disclosure: knowledge/verification.md, section "2.3 (Novelty verification, the defensible contribution)", item 2.
- Model snapshot, max_tokens, unrecorded temperature for round one: knowledge/verification.md, section "2.2 (Conformance tally and findings)".
- Register rule (cost figures factual only): [[plan]], section "Zielbild" (narrative register).

## 12. Conclusion (150 to 250 words)

Bullets:

- Restate the two-round arc in two sentences: an honest retrospective record with named gaps, then a prospective round whose record is conformant by construction.
- The portable result: the boundary between what post-hoc reconstruction can and cannot recover, and the instrument pattern that moves reporting from prose to derivation.
- Close on the domain: what recorded divergence decomposition offers reviews on gender, bias, and social work, where category judgment is contested ground and the lowest agreement sits exactly on the contested categories.

Claims inventory:

- "Lowest agreement on the contested categories" (Fairness, Gender at the bottom of the category range): knowledge/verification.md, section "1.2 (Category agreement)".
- Two-round claim line: [[plan]], section "Stage R" (shaping decisions).

## Open dependencies before drafting can finish

1. TP3 analysis document (`knowledge/analysis-divergence.md`) committed, with script-derived numbers; section 7 inventory re-pointed to it. Source: [[plan]], section "TP3 work plan".
2. The 292-versus-291 pairing discrepancy resolved by the re-pairing script, or reported as open in the limitations with its current wording. Source: knowledge/verification.md, section "2.1 (the round-1 record, Screening)".
3. Stage R outputs (conformance map published, record page live) for figure F1 and F2 sources. Source: [[plan]], sections "R4" and "R5".
4. Stage B execution for section 8 numbers and the generated methods/disclosure inputs; until then section 8 stays design-register. Source: [[plan]], section "Stage B".
5. TP4 schema freeze if the paper reports the analysis fields of the update round. Source: [[plan]], section "TP4 work plan".
6. Pre-submission re-checks: RAISE journal publication status, varlet99 prototype status, Semantic Scholar citation count refresh, paper-integrity check of the full text against the repository. Source: knowledge/verification.md, sections "2.3 (Novelty verification, related work)" and "2.3 (Novelty verification)"; [[plan]], Programme verification and validation matrix, row TP6.
