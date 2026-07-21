---
title: "Paper Outline: Follow-up Paper (Two-Round Review Record)"
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: draft
language: en
version: "0.4"
created: 2026-06-09
updated: 2026-07-21
authors: [Christopher Pollin]
generated-with: Claude Code
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
related: [plan]
---

**SUPERSEDED IN STRUCTURE (updated 2026-07-21 to draft v0.4). `paper/draft.md` (v0.4) leads with the methodological integration question and reports the qualitative synthesis along SQ1 to SQ3 as that workflow's yield.** The framing question asks how generative AI can be integrated into a qualitative literature review so that every machine contribution remains traceable and re-executable while the domain experts' judgement stays binding, and what such a review yields. The claim stays with the documented case and its published artifacts (PRISM, replay scripts, protocols, the knowledge structure); the paper advances no general-framework or design-specification claim, and the three principles of the discussion are offered to teams that adopt the workflow. The primary reader is a social-work researcher planning an LLM-assisted review; the journal first choice is the Journal of Technology in Human Services. The divergence analysis carries two roles at once, motivation for why reliability must be established by the research process and demonstration of what the recorded per-decision data make analysable; its decomposition separates the workflow criteria a paper-isolated model cannot see from the content judgement, and it admits no error-rate reading because round one has no inter-human baseline.

This outline stays valid as the claims inventory. Every claim-to-source mapping below still licenses the draft's numbers. The outline's twelve sections map onto the draft's ten as follows:

- outline 1 (Introduction) to draft 1 (Introduction)
- outline 2 and 3 (standards, related work) to draft 2 (Background)
- outline 4 (round-one workflow) to draft 3.2 to 3.4 (Methods) and draft 4 (Study selection)
- outline 5 (PRISM) and 6 (retrospective rendering) to draft 3.6 (Instrument and record generation)
- outline 7 (motivating illustration) to draft 5 (Screening agreement) and draft 3.7 (Agreement and divergence analysis)
- outline 8 (round two) to draft 3.1 and 3.6 (round two designed and pre-registered, not yet executed)
- outline 9 (Discussion) to draft 7 (Discussion), with the subsections "The methodological yield" and "Integrating the workflow into a research process"
- outline 10 to draft 8 (Limitations), outline 11 to draft 9 (AI use disclosure), outline 12 to draft 10 (Conclusion)

The qualitative synthesis along SQ1 to SQ3 is draft section 6 and has no counterpart in the section list below; it is the workflow's reported yield and is drafted from the analysis coding. Path note: the source pointers below were normalised to the canonical `generated/benchmark-results/` location on 2026-07-21.

Original lead: Full outline of the follow-up paper (TP6 in [[plan]]). The paper describes the workflow of a dual-track literature review in social work and the use of large language models across its two rounds: a first round conducted before the instrument existed and rendered retrospectively as an honest PRISMA 2020 plus PRISMA-trAIce record with named gaps, and a second round (the literature update) conducted prospectively through the instrument with conformance enforced by construction. The Forum Wissenschaft paper is the precursor; this paper is fed by the Stage R record (R4), the Stage B update (B3), and the TP3 divergence analysis.

## Register and claims discipline (binding for the draft)

- The paper describes the workflow and the LLM use. It makes no efficiency, time-saving, or cost-benefit claims anywhere. Cost and token figures appear only as factual disclosure in the AI use section. Source: [[plan]], section "Zielbild" (narrative register decision, 2026-06-09).
- Every empirical number cites a committed, recomputable source. Until `knowledge/analysis-divergence.md` (TP3) exists, benchmark numbers are licensed only by the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion that renders them; once TP3 lands, the paper cites the committed analysis document and this outline's inventory entries are re-pointed. The divergence figures are used only as illustration and are not results the paper asserts. Source: [[plan]], section "TP3 work plan".
- The contribution is phrased as a generated PRISMA-trAIce flow artifact (checklist item R1), session-derived disclosure generation, and retrospective trAIce rendering. The paper does not claim novelty for AI-human decision separation as such; EPPI-Reviewer, Nested Knowledge, and DistillerSR are named as prior art in related work.
- Novelty statements carry the qualifier "to our knowledge, as of June 2026" and state the survey date.
- Divergence framing rules: no error-rate language (no inter-human baseline exists), divergence is decomposed before it is interpreted, the inclusion-bias claim survives only for the knowledge-document input condition. Source: [[plan]], section "V: Claim verification" (consequence ledger).
- Reviewer identities appear as neutral ids (R1, R2); no personal names in data, figures, or examples. To avoid collision, trAIce checklist items are always written fully qualified ("trAIce item R1") and plan phases as "phase R1 of the plan".
- Before submission: paper-integrity check of every claim against the repository ([[plan]], Programme verification and validation matrix, row TP6); re-check whether the RAISE guidance papers have appeared in Research Synthesis Methods and whether the varlet99 prototype has evolved.

## Working title and format

Working title (draft v0.4, co-author decision pending): "Generative AI, Gender, and Bias in Social Work. An Account of a Traceable, Reproducible, LLM-Assisted Qualitative Literature Review". Conceptual alternatives on file: "... An LLM-Assisted Literature Review as Epistemic Infrastructure" and "... A Conformant-by-Construction LLM-Assisted Literature Review". The earlier working titles ("Conformant by Construction ...", "An Honest Record First ...") are retired.

Target length 6000 to 8000 words excluding abstract, references, and appendices. The per-section bounds below sum above the target corridor; drafting trims toward it, with section 7 protected and sections 2, 3, and 9 as the cut candidates. **[Updated 2026-07-21 to draft v0.4: the draft names figure F1 (the generated trAIce-adapted flow diagram of round one, draft §4) and figure F5 (the PRISM screening workspace and record-generation flow, draft §3.6). The conformance tally, the decomposed divergence, and the 2x2 condition table are carried by the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion under the draft's discipline of keeping volatile numbers out of the prose, so they are no longer planned as numbered in-text figures.]** Appendices: the generated disclosure text, the conformance map excerpt, the protocol document of round two.

## 1. Introduction (600 to 750 words)

Bullets:

- The case: a literature review on generative AI, gender, bias, and social work, screened in two parallel tracks from the start, a consolidated human expert annotation and a batch LLM assessment, with category judgments on ten criteria. The corpus size is stated from the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion.
- The problem: reporting standards for AI-assisted evidence synthesis exist as fresh proposals (PRISMA-trAIce, 2025) and institutional position statements (RAISE, 2025), but they are barely operationalized as data models or working tools; vendors respond with compliance documentation rather than conformant report generation.
- The design answer: a two-round story. Round one was conducted without a pre-specified protocol and is rendered retrospectively and honestly, with every gap named (no conformance claim is made for it). Round two, the literature update, runs through an instrument (PRISM) whose data model makes the trAIce flow artifact and the disclosure section fall out of the recorded data. The contrast between what could and could not be reconstructed post hoc is the paper's central design argument.
- Contributions, exactly four: (C1) a screening instrument that emits the PRISMA-trAIce adapted flow diagram (trAIce item R1) as a working artifact with separate tallies for AI and human decisions; (C2) session-derived generation of a consolidated AI disclosure section (trAIce M-items plus RAISE Table 1 elements) instead of static templates; (C3) the retrospective trAIce rendering of an already-completed two-round review, presented as an unpublished framing as of June 2026; (C4) a decomposed account of human-LLM screening divergence on this corpus, used as a motivating illustration of why the infrastructure is needed, reported as divergence (not error) and claimed as nothing empirical about the literature. **[Updated 2026-07-21 to draft v0.4: the divergence carries two roles at once, motivation for why reliability must be established by the research process and demonstration of what the recorded per-decision reasons make analysable through the workflow-criteria-versus-content decomposition. The error-rate exclusion stands, since round one has no inter-human baseline.]**
- Roadmap paragraph.

Claims inventory:

- Corpus size, dual human and LLM assessment from the start, and the human and LLM record counts: the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion.
- "Round one rendered retrospectively and honestly, with named gaps; no conformance claim": [[plan]], section "Stage R" (shaping decisions and claim line).
- C1 and C2 as "first tool documented to", with hedge and survey date: stated qualitatively, survey date in the text.
- C3 "unpublished framing as of 2026-06-09": stated qualitatively with the survey date.
- C4 framing (divergence, not error): the human track is one consolidated annotation, so divergence quantities are not error rates.
- "PRISMA-trAIce and RAISE barely operationalized as tools" and "vendors respond with compliance documentation rather than conformant report generation": from the tool-landscape survey in related work.

## 2. Background: reporting standards for AI-assisted evidence synthesis (500 to 650 words)

Bullets:

- PRISMA 2020 as the baseline reporting framework; what its 27 items cover and where AI involvement is invisible in it.
- PRISMA-trAIce: Holst et al. 2025, JMIR AI, 17-item checklist along the PRISMA 2020 section structure (14 non-optional, 3 optional), items graded Mandatory to Optional; explicitly a foundational proposal without formal consensus process, not EQUATOR-registered; living-guideline governance via GitHub repository; the adapted flow diagram with separate fields for records screened by AI systems versus human reviewers (trAIce item R1). Cited as a proposal throughout.
- RAISE, two layers cited separately: the position statement (Flemyng et al. 2025, co-published across Cochrane, Campbell, JBI, CEE; carries the mandatory reporting elements of Table 1: system names, versions, dates, purpose and stages, methodological justification, validation evidence, limitations, interests) and the three guidance documents (Thomas et al., OSF, revised 2026-03-13, under journal review; preprint-level, cited with version date).
- Uptake status as context for the contribution window: minimal citation uptake of trAIce so far; vendors respond to RAISE with compliance documentation rather than conformant report generation.

Claims inventory:

- All bibliographic facts on PRISMA-trAIce (authors, venue, DOI 10.2196/80247, 17 items, proposal status, governance, trAIce item R1 description): the primary sources, cited directly in the paper.
- Citation uptake of trAIce as of the survey date, and that no citing paper implements the checklist as software: stated qualitatively from the survey, with the survey date.
- All bibliographic facts on RAISE (position statement co-publication, Table 1 elements, OSF guidance status and revision date): the primary sources, cited directly in the paper.
- "Vendors respond with compliance documentation, not conformant report generation": from the tool-landscape survey (Covidence and Nested Knowledge).

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

- Prior-art characterizations of EPPI-Reviewer, Nested Knowledge, DistillerSR (each records an attributed, advisory AI decision next to a binding human one) and the non-claim consequence: the primary sources and tool documentation, cited directly.
- Covidence partial status (automated step in flow, static templates, RAISE alignment): the tool documentation, cited directly.
- Elicit "claimed, not documented": the tool documentation, cited directly.
- varlet99 prototype facts (creation date, scope, undocumented properties): the public repository, cited directly with the survey date.
- AIscreenR as methodological prior art: the primary source, cited directly.
- AITDI as adjacent retrospective assessment: the primary source, cited directly.
- "No surveyed tool emits the trAIce item R1 split or session-derived disclosure": from the tool-landscape survey, stated with the survey date.
- Adapted-flow-diagram genre: the primary sources on review-update and living-review flow adaptations, cited directly.

## 4. Round one: the conducted review and its workflow (700 to 900 words)

Bullets:

- Identification: deep-research prompts run across four LLM providers plus manual additions; provider provenance recorded per paper in the human CSV (the per-provider Source_Tool distribution is read from the data); the executed prompt instantiations were not committed at run time, and post-hoc recovery corroborates provenance for only a minority of records via restored RIS files. Stated plainly as a provenance limitation of round one.
- Screening, human track: the reviewing experts (R1, R2) recorded category judgments and decisions in a shared Excel workflow; the CSV carries no reviewer column, so the track is one consolidated annotation (including corrections or additions by the second person), not two independent codings. Deduplication happened inside screening rather than as a separate identification step, and the flow diagram represents it as it happened.
- Screening, LLM track: batch assessment of the full corpus with a pinned model snapshot (claude-haiku-4-5-20251001), max_tokens 1024, versioned assessment prompt; temperature and top-p were never set and are unrecorded API defaults, disclosed as such. Later extended to a 2x2 (two models, two input bases) for the benchmark analysis (section 7).
- Text pipeline as LLM use: PDFs acquired for most of the corpus, a portion behind access barriers, then converted and distilled into LLM-generated knowledge documents; the served corpus offers a knowledge document for many papers, abstract only for some, and no text for a small remainder. The exact stage counts are read from the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion.
- Register note for drafting: this section describes what was done and with which models and parameters; it draws no comparison of effort or speed against a conventional workflow.

Claims inventory:

- Source_Tool distribution and the human-record count: the data (`generated/benchmark-results/`, `docs/data/`); the CSV is ground truth.
- Non-auditable acquisition claims and the corroborated minority of records: the data (`generated/benchmark-results/`, `docs/data/`) and the restored RIS files.
- No reviewer column, consolidated annotation, corrections by a second person: the human CSV (no reviewer column) read directly from the data.
- Deduplication inside screening, the Duplicate-exclusion count, and the records flagged as duplicates in papers_full.csv: the data (`generated/benchmark-results/`, `docs/data/`).
- Model snapshot, max_tokens, unrecorded temperature: the committed assessment script and its parameters.
- Versioned assessment prompt (the 10K assessment prompt, version history v1.0 to v2.1, embedded in `benchmark/scripts/run_llm_assessment.py`): prompts/CHANGELOG.md, sections "Prompt-Inventar" and "10K Assessment".
- Pipeline stage counts and text availability: the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion.

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
- Import-validation rationale (out-of-vocabulary exclusion value, empty reason cells): the human CSV read directly from the data.
- C1/C2 phrasing ("first screening tool documented to emit", "first tool documented to auto-generate", with hedge): stated qualitatively with the survey date.
- "Numbers in prose drifted, derived counts were exact": the prose-versus-derived discrepancies are read from the data (`generated/benchmark-results/`, `docs/data/`).
- Content-only agreement in the panel as tool implication: [[plan]], section "V: Claim verification" (consequence ledger, tool implication sentence).

## 6. Rendering round one retrospectively: the conformance audit (600 to 800 words)

Bullets:

- Method: every PRISMA 2020 item (27) and every trAIce item (17 as encoded in the tool) judged against named repository files; result is a machine-readable conformance map driving the checklist surface; every judgment computed from files, not copied from prose. The per-item conformance tallies are read from the tool's conformance surface, not restated here.
- PRISMA 2020 profile: a reconstructable core that is exactly what was recorded as data (eligibility, data items, selection flow, study characteristics, availability), a partial band, and a missing block that is the appraisal layer of a full systematic review (risk of bias, effect measures, certainty) plus administrative declarations.
- PRISMA-trAIce profile: markedly stronger than the PRISMA 2020 profile, because the dual-track design is what trAIce asks for, separate decision records, performance evaluation against a human reference, full human oversight, all present as data.
- The one hard gap: trAIce item M1 (pre-specified protocol and declared AI use) is missing and non-reconstructable by definition; a pre-specification cannot be created after the fact, only declared absent. This motivates round two.
- The named gaps presented as findings, not flaws: corpus papers without a human decision; one record marked humanly assessed that did not pair in the benchmark merge (open); papers with no surviving text basis; vocabulary violations; absent per-record reviewer identity; incomplete prompt and parameter record (unrecorded decoding defaults, partly lost deep-research prompt, missing 5D prompt file). The exact counts are read from the data (`generated/benchmark-results/`, `docs/data/`).
- Claim line stated verbatim in spirit: the record is published as an honest retrospective rendering; no conformance claim is made for round one.

Claims inventory:

- Audit method and conformance map: the tool's conformance surface, generated from the recorded data.
- PRISMA 2020 profile with item groups: the conformance surface; per-item tallies read there, not restated.
- trAIce profile and the explanation of the stronger profile: the conformance surface; per-item tallies read there, not restated.
- M1 missing and non-reconstructable by definition: the conformance surface and the absent round-1 protocol.
- Papers without a human decision and the open pairing discrepancy: the data (`generated/benchmark-results/`, `docs/data/`); the discrepancy stands open.
- Papers without any text: the data (`generated/benchmark-results/`, `docs/data/`).
- Prompt and parameter gaps: the committed assessment script and prompt governance, with the gaps named.
- "Honest retrospective record, no conformance claim": [[plan]], section "Stage R" (claim line).

## 7. A motivating illustration, the decomposed screening divergence (1100 to 1400 words)

**[Updated 2026-07-21 to draft v0.4: this material is draft section 5 (Screening agreement as a motivating illustration, and what the divergence is made of) together with draft §3.7 (Agreement and divergence analysis). In v0.4 the divergence is motivation and demonstration at once, the demonstration being what the recorded per-decision data make analysable.]**

Bullets:

- Benchmark core (headline condition, Haiku plus abstract input): the headline-condition matrix, include rates, and full metric set are read from the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion, reported together so the near-chance headline is neither dismissed nor oversold.
- Report the full decomposition set together, so the near-chance headline cannot be dismissed and is not oversold. The metrics (po, kappa, PABAK, kappa-max, bias index) come from the data; state them from there, not from prose here. Explicitly concede that decision-level agreement in the headline condition is genuinely near chance; the previously documented prevalence-artifact framing is dropped, since PABAK lies below kappa, so prevalence adjustment makes agreement look worse, not better.
- The decomposition that carries the finding: most of the papers in the headline divergence cell are human exclusions for Duplicate, No full text, or Wrong publication type, criteria a one-paper-at-a-time LLM cannot see. Under content-only sensitivity the asymmetry shrinks sharply, include rates converge, and decision-level agreement rises, with the exact cells and metrics read from the data. Defensible phrasing fixed here: not a fixed inclusion-bias figure but "under enriched input the LLM applies a systematically lower exclusion threshold, and roughly half of the nominal divergence is an artifact of corpus-management exclusions outside the LLM's information basis".
- Worked example (anonymized by Zotero key): the traced duplicate pair where the LLM's Include is content-correct and counts as divergence anyway.
- Category level, where the signal lives: per-category agreement spans from low on the contested categories (Fairness, Gender) to high on the domain category (Soziale_Arbeit); the values come from the data. Caveat that the per-category agreement rests on a subsample skewed toward substantively engaged papers.
- The 2x2 (two models, two input bases), reported as exploratory: include rates and decision-level agreement per cell are read from the data. Robust part: knowledge-document input raises the include rate in both models; content-only, both models over-include against the human track. Non-robust part: the condition ranking flips under the content-only sensitivity, so "Sonnet plus KD is the best condition" is not stated. Confounds named: KD conditions are mixed (a majority of papers KD-based, the rest abstract fallback), knowledge documents are themselves LLM-distilled, one run per cell with no dispersion estimate, unrecorded decoding settings.
- Strongest category-level claim of the 2x2: Fairness agreement degrades under KD input in both models, with LLM Fairness yes-rates rising against a constant human rate; the values come from the data. Mechanism stated as plausible (fairness vocabulary saturates the distilled documents), consistent across both models.
- Human track framed throughout as "one consolidated expert annotation without independent double coding"; divergence quantities are divergence, not error rates; external inter-human reliability from comparable published screenings cited as context only.
- The infrastructure-corrects-itself narrative made explicit: the decomposition was only possible because exclusion reasons were recorded per decision; the recorded data corrected the project's own earlier interpretation. This is offered as evidence that reliability must be built into the process, not as an empirical finding about LLM screening.

Claims inventory (all numbers in this section):

- Pairing, matrix, include rates, and decision-level agreement: the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion.
- PABAK, kappa-max, prevalence index, and bias index: the data (`generated/benchmark-results/`, `docs/data/`).
- Dropping the prevalence-artifact framing: PABAK sits below kappa, so prevalence adjustment lowers apparent agreement; read from the data.
- Reason split of the divergence cell and of the both-exclude cell: the recorded exclusion reasons in the data.
- Content-only table and the milder-cut variant: the data (`generated/benchmark-results/`, `docs/data/`).
- Defensible phrasing and the worked duplicate example: the recorded decisions and exclusion reasons in the data.
- Per-category agreement (all ten values, range, the subsample): the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion.
- 2x2 condition table (include rates, agreement) and raw marginals: the data (`generated/benchmark-results/`, `docs/data/`).
- KD mixed-condition fact (majority KD-based): the data (`generated/benchmark-results/`, `docs/data/`).
- KD include-rate effect and content-only over-inclusion against the human track in both models: the data (`generated/benchmark-results/`, `docs/data/`).
- Ranking flip and the raw agreement count behind the Sonnet difference: the data (`generated/benchmark-results/`, `docs/data/`).
- Exploratory status of the 2x2 (one run per cell, no dispersion, unrecorded decoding): the committed assessment script and its parameters.
- Fairness degradation values and yes-rates: the data (`generated/benchmark-results/`, `docs/data/`).
- Human-track framing and external reference reliability: the human CSV (one consolidated annotation) and the cited external screenings.
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
- "Closes M1 prospectively": [[plan]], section "Stage B" (the update as the opportunity to close it).

## 9. Discussion: what the infrastructure must record from the start (550 to 700 words)

**[Updated 2026-07-21 to draft v0.4: draft section 7 (Discussion) carries two subsections, "The methodological yield" and "Integrating the workflow into a research process". The five lessons below are condensed to three principles offered to teams that adopt the workflow, (a) what cannot be reconstructed must be recorded at the moment of the run, (b) the unit of the record is the single decision with its actor, its evidence basis, and machine-readable values, (c) a published figure is the endpoint of a re-executable derivation chain from the raw data. The paper frames these as an offer to adopting teams; it makes no design-specification claim for epistemic infrastructure. The adoption subsection names the workflow's prerequisites (a version-controlled repository as the record carrier, at least two domain experts as the binding track, every screening decision treated as a datum with actor, controlled-vocabulary reason, and evidence anchor) and the parts that transfer.]**

Bullets:

- The boundary between repairable and unrepairable gaps as the design specification for epistemic infrastructure, organized as the five lessons: (1) pre-specification is unrecoverable; (2) acquisition provenance must be captured at the moment of the run (post-hoc recovery corroborated only a minority of records, demonstrating the ceiling); (3) every decision needs its actor and its evidence basis; (4) controlled vocabularies must be enforced by the input surface, not documented beside it; (5) reported numbers must be derivations, not prose.
- The two-round contrast cashes the argument: the same review team, the same corpus domain, one round reconstructed with named holes and one round conformant by construction.
- What the divergence analysis means for LLM-assisted screening practice in this domain: divergence decomposition requires recorded exclusion reasons; a tool that records them makes the workflow-versus-content split computable for any review; the binding human decision plus advisory AI record is the established pattern, and the contribution sits at the report-artifact level.
- Honest placement of the contribution: trAIce is a proposal, "conformant" means conformant to a proposed living guideline; commercial vendors respond quickly to RAISE, so the novelty window for disclosure generation may be short; the survey date is stated.
- Generalization path: the instrument is designed for reuse with own categories, corpus, and prompts (Stage C of the plan), positioned as a methodological showcase, without overclaiming beyond the documented setup path.

Claims inventory:

- The five lessons and the repairable/unrepairable boundary: the named round-1 gaps and the conformance surface, stated qualitatively.
- Post-hoc recovery ceiling (a minority of records corroborated): the data (`generated/benchmark-results/`, `docs/data/`) and the restored RIS files.
- Contribution placement at report-artifact level and the established advisory-record pattern: the tool-landscape survey and the prior-art tools cited directly.
- Proposal status hedge and short novelty window: the standards' own status, stated with the survey date.
- Decomposition requires recorded reasons (infrastructure-corrects-itself): the recorded exclusion reasons in the data; [[plan]], section "TP3 work plan" (framing rules).
- Reuse path: [[plan]], section "C3: Reuse extraction" (design statement, no execution claim before it happens).

## 10. Limitations (350 to 500 words)

Bullets:

- No inter-human reliability baseline: the human track is one consolidated annotation whose own reproducibility is unmeasured; an unknown fraction of the content-level disagreements would also appear between two independent human raters; divergence quantities are therefore not error rates. External inter-human kappas cited as context, not as a substitute baseline.
- Data gaps of round one carried into the record: corpus papers without a human decision, plus one unresolved pairing discrepancy (one record marked humanly assessed that does not pair in the benchmark merge), reported as an open inconsistency; the exact counts are read from the data (`generated/benchmark-results/`, `docs/data/`).
- The 2x2 is exploratory: one run per cell, mixed KD condition, LLM-distilled input texts, unrecorded decoding defaults; no condition ranking is claimed.
- Proxy-written user stories: the usage scenarios that drove the instrument design were written by the technical lead as a user proxy and had not been validated by the named users at design time; one usage assumption (whether colleagues screen in the tool or capture in their spreadsheet) was open at design time and has since been settled by ADR-019 in favour of in-tool screening, with spreadsheet import as a migration seam. Validation status at submission is reported as it stands.
- Standards immaturity: PRISMA-trAIce is a proposal without consensus endorsement; RAISE guidance is preprint-level at the time of the survey; conformance claims are relative to these versions, with dates.
- Novelty survey coverage: public documentation only, preprints and grey literature incomplete, vendor features behind login walls unverifiable; survey date 2026-06-09 stated in the paper.

Claims inventory:

- Missing inter-human baseline and its consequence: the human CSV is one consolidated annotation, read directly from the data.
- Papers without a human decision and the pairing discrepancy: the data (`generated/benchmark-results/`, `docs/data/`).
- Exploratory 2x2: the committed assessment script and its parameters.
- Proxy-written user stories and the in-tool-versus-Excel usage assumption settled by ADR-019: knowledge/specification.md, ADR-019; per-story validation status in knowledge/plan.md.
- Standards status hedges: the standards' own published status, with the survey date.
- Survey coverage limits: stated qualitatively, with the survey date and scope of the survey.

## 11. AI use disclosure (250 to 350 words)

Bullets:

- This section is itself a demonstration object: the paper's disclosure text is generated from the record bundle (model names, versions, dates, purpose per stage, parameters, costs) and then edited by the authors; the section states this provenance.
- Factual disclosure of LLM use across the project, per stage: identification (deep-research runs across four providers), screening (batch assessment with pinned snapshot claude-haiku-4-5-20251001, max_tokens 1024, temperature unrecorded API default, disclosed as a gap for round one; recorded parameters in round two), text preparation (LLM-distilled knowledge documents), instrument development and knowledge-base authoring (Claude Code sessions under the Promptotyping method), and agent click-testing.
- Cost and token figures appear here as factual disclosure only, taken from the generated bundle; no efficiency or cost-benefit interpretation accompanies them.
- RAISE Table 1 element coverage cross-referenced to the generated disclosure in the appendix.

Claims inventory:

- Disclosure generation from session data and author editing: [[plan]], section "B3: Reconciliation and the PRISMA record"; novelty phrasing for the generated disclosure stated qualitatively with the survey date.
- Model snapshot, max_tokens, unrecorded temperature for round one: the committed assessment script and its parameters.
- Register rule (cost figures factual only): [[plan]], section "Zielbild" (narrative register).

## 12. Conclusion (150 to 250 words)

Bullets:

- Restate the two-round arc in two sentences: an honest retrospective record with named gaps, then a prospective round whose record is conformant by construction.
- The portable result: the boundary between what post-hoc reconstruction can and cannot recover, and the instrument pattern that moves reporting from prose to derivation.
- Close on the domain: what recorded divergence decomposition offers reviews on gender, bias, and social work, where category judgment is contested ground and the lowest agreement sits exactly on the contested categories.

Claims inventory:

- "Lowest agreement on the contested categories" (Fairness, Gender at the bottom of the category range): the per-category agreement in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion.
- Two-round claim line: [[plan]], section "Stage R" (shaping decisions).

## Open dependencies before drafting can finish

1. TP3 analysis document (`knowledge/analysis-divergence.md`) committed, with script-derived numbers; section 7 inventory re-pointed to it. Source: [[plan]], section "TP3 work plan".
2. The pairing discrepancy resolved by the re-pairing script, or reported as open in the limitations with its current wording. Source: the data (`generated/benchmark-results/`, `docs/data/`).
3. Stage R outputs (conformance map published, record page live) for figure F1 and F2 sources. Source: [[plan]], sections "R4" and "R5".
4. Stage B execution for section 8 numbers and the generated methods/disclosure inputs; until then section 8 stays design-register. Source: [[plan]], section "Stage B".
5. TP4 schema freeze if the paper reports the analysis fields of the update round. Source: [[plan]], section "TP4 work plan".
6. Pre-submission re-checks: RAISE journal publication status, varlet99 prototype status, citation-count refresh, paper-integrity check of the full text against the repository. Source: [[plan]], Programme verification and validation matrix, row TP6.
