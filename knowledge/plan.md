---
title: Plan
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: complete
language: en
version: "0.2"
created: 2026-06-09
updated: 2026-06-29
authors: [Christopher Pollin]
generated-with: Claude Code
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
related: [specification, design, data, journal, verification, update-protocol]
---

Phased plan for completing the whole project: PRISM v1.0 (Stage A), the first-round pass of the existing review data through PRISM and its evaluation (Stage R, the demonstrable core), the real review cycle through the tool (Stage B), and closure plus reuse (Stage C). This is a process document; it is updated as phases close (mark done with date), and decisions made along the way go into [[specification]] as ADRs, not here.

## Zielbild (what "done" means)

The tool is not the goal; the goal is a review whose every decision is auditable, demonstrated on this project's own data. The project is finished when four things are true:

1. **The review is carried through PRISM, and only then complete.** All of the review's dual-track data (the full corpus, human decisions, LLM assessments, divergences, category evidence; counts in [[verification]]) passes through PRISM into a PRISMA 2020 plus trAIce record, public on the Evidence Companion, together with an honest conformance evaluation, which items the recorded data satisfies, which only partially, which not at all. The items unrepairable in retrospect (the absent pre-registered protocol above all) are named, not hidden; they show what epistemic infrastructure must record from the start.
2. **The instrument is the binding screening surface.** Per ADR-019 the colleagues screen in PRISM, where the more precise PRISMA steps happen, the screening decision, evidence grounding, flow, agreement, checklist, disclosure, and record. The Excel import bridge stays only as an entry seam for a batch captured elsewhere. Every category can point at the words that justify it, every AI involvement is disclosed, and the human decision is always the binding record.
3. **The cycle is repeatable.** The planned literature update (same versioned deep-research prompts, new batch, dual assessment, reconciliation) is executed inside the tool with the same record machinery. Reproducibility is proven by execution, not asserted.
4. **The infrastructure outlives the case.** The paper and the Evidence Companion publish the review; the repo documents how a third party sets up the same instrument for a different review (own categories, own corpus). That cashes out the project's claim, epistemic infrastructure as practice, beyond the single study.

Research chain and priority (decided 2026-06-09): the primary product is the **working instrument**. The chain runs: tool, then the updated, methodologically grounded corpus (Stage B), then the analysis of how prompt engineering must adapt for social work, gender, and bias contexts. A follow-up paper describes the extended review's results and the method; the Forum Wissenschaft paper is its precursor. When effort competes, colleague usability and the update cycle win over Companion polish; the record machinery serves the follow-up paper's methods section.

Narrative register (decided 2026-06-09): the project describes the workflow and how a large language model is used to build it out. It makes no efficiency or cost-benefit claims. Claims discipline: any empirical or novelty claim that reaches a paper, the Companion, or a report must be either recomputed from the raw data or verified against published sources; the verification documents (below) are the ledger for this.

## Shaping decisions (taken 2026-06-09)

1. **Reading text: raw full text, read locally.** The screening view reads the raw Docling texts from `pipeline/markdown_clean/` through the connected clone (File System Access), option 2 in [[data]] (reading text source). Raw texts are never published; the public Pages site falls back to the served knowledge document, then the abstract. Every decision records which text source was actually read.
2. **Primary collaborator path: export/import without Git.** The reviewing colleagues work on the deployed Pages site in any browser and exchange their reviewer file as a download. Git plus File System Access stays the power path (technical lead, local clone).
3. **Testing: committed headless harness plus agent click-tests.** The jsdom harness moves into the repo and becomes reproducible; an AI browser agent executes documented click-scenarios against the real UI and protocols findings. No CI for now; revisit once the harness is committed.
4. **Scope.** Tool completion, testing, knowledge-base consolidation, push and deploy.

## Programme view: Teilprojekte (added 2026-06-09)

The vault-side programme plan ("Gesamtplan FemPrompt Forschungsprogramm", Projects/SocialAI) structures the research programme as seven Teilprojekte. Mapping onto this plan:

| TP | Name | Lives where |
|---|---|---|
| TP1 | PRISM working instrument | Stage A (P0 to P7, with P3 as the Excel import seam) |
| TP2 | First-round pass through PRISM, round one | Stage R |
| TP3 | Sharpening the human-AI divergence finding | own work item; source [[verification]]; feeds R4 and the paper; elaboration session pending |
| TP4 | Operationalizing the analysis question (prompt engineering for social work, gender, bias) | own work item; MUST precede the B2 schema freeze so the Excel captures the analysis fields; deliverable: the analysis design in [[update-protocol]] plus schema extension |
| TP5 | Literature update, round two | Stage B |
| TP6 | Follow-up paper and FFG report | outside the repo; fed by R4, B3, TP3 |
| TP7 | Reuse extraction | Stage C |

Division of labour between the two layers: the vault carries the programme view and decisions history for the human; this document steers the repo work. A change in one layer that affects the other is mirrored in the same session.

### TP3 work plan: sharpening the divergence finding

1. Harden the pairing: run the prepared re-pairing script (`C:\tmp\verify_femprompt.py`, move it into `benchmark/scripts/` on first run), resolve the 292-vs-291 discrepancy, commit the script and its output.
2. Canonical analysis set, computed by committed script, not by hand: full matrix plus the content-only subset (workflow-criteria exclusions Duplicate / No full text / Wrong publication type separated out), per category; metrics po, kappa, PABAK, kappa max, bias index; the KD-input contrast (where the inclusion bias survives); the 2x2 with the content-only sensitivity.
3. Write up the decomposed finding as the licensed source for the paper's empirical section (now in [[verification]]). Framing rules: no error-rate language (no inter-human baseline), divergence decomposed before interpreted, the infrastructure-corrects-itself narrative explicit.
4. Apply the queued corrections: the README Byrt sentence and the Sonnet+KD best-condition qualifier (see [[verification]]).

Verification: every figure in the analysis document traces to committed script output; an independent agent re-derives the headline table from the raw CSVs. Validation: co-authors accept the decomposed framing. Done when: the paper can cite every number from the committed analysis document.

Status (2026-06-09): step 3 done, the decomposed finding written and independently re-verified against the merged CSVs (now in [[verification]]); steps 1 and 2 (committed re-pairing and analysis scripts) pending shell access; step 4 corrections still queued for P6.

Update (2026-06-21): step 1 done. The re-pairing script `benchmark/scripts/verify_femprompt.py` was executed (shell now available) and reproduces every V1 figure exactly; the 292-vs-291 discrepancy is resolved as a stray Has_HA flag on `2YS85B49` in `papers_full.csv` (a key absent from the human CSV, no missing human decision). A regression guard `replay_selftest.py` asserts the canonical numbers and that resolution (PASS 18/18). Step 2 (a committed script emitting the full per-category analysis set) and step 4 corrections remain.

### TP4 work plan: operationalizing the analysis question

1. A structured working session turns "how must prompt engineering adapt for social work, gender, and bias" into answerable sub-questions (with the colleagues where possible).
2. Derive candidate capture fields from the sub-questions (for instance: prompt techniques discussed, bias types addressed, intervention or mitigation type, evidence type, population). Draft as a schema extension next to the ten categories.
3. Pilot: code a small stratified sample of already-included papers with the draft fields; measure answerability (fill rate, ambiguity notes); revise definitions.
4. Freeze: the extension goes into the Excel template for the update, `categories.yaml`, and the import-bridge validation (P3).

Verification: the pilot shows the fields are answerable from the texts. Validation: the colleagues confirm the fields capture what the analysis needs, before the schema freeze. Done when: the update's Excel template carries the analysis fields and the bridge validates them. Hard ordering: TP4 freeze precedes the B2 screening start.

Status: the analysis-design is written into [[update-protocol]] (sub-questions, candidate field set with closed vocabularies, the open decisions for ratification). Pilot and freeze wait on those decisions.

## Programme verification and validation matrix

Verification means technically correct (automated or recomputed wherever possible); validation means it meets the need of the named humans. Nothing outward-facing ships without both.

| TP | Verification | Validation | Result criterion |
|---|---|---|---|
| TP1 Tool | committed harness green from clean clone; node checks; agent click-tests S1 to S6 | Excel round-trip with a real export; colleagues' workflow untouched | established workflow flows losslessly through the bridge |
| TP2 Retro-record | replay self-test reproduces the canonical benchmark; every conformance item sourced | human review of the record page before publishing | citable record page live on the Companion |
| TP3 Divergence | all figures from committed script output; independent re-derivation; sensitivity analyses documented | co-authors accept the decomposed framing | paper-ready analysis document, every number licensed |
| TP4 Analysis fields | pilot coding shows fields answerable | colleagues confirm fields serve the analysis | schema frozen before update screening |
| TP5 Update | protocol committed before any run; import validation reports; flow reconciles with decision log | reconciliation of divergences with the reviewers | updated corpus with complete audit trail |
| TP6 Paper/FFG | paper-integrity check against the repo before submission; claims only as licensed by the verification documents | co-author review; venue peer review | submission with generated, verifiable methods section |
| TP7 Reuse | third-party dry run from documentation alone | an external person succeeds without help | documented setup path |

## Promptotyping operating loop

Every iteration in every stage follows the same cycle, and the documents are the interface between sessions; no session relies on chat memory.

1. **Knowledge first.** The change is specified before code: requirement or ADR in [[specification]], schema in [[data]], surface in [[design]], scenario in [[specification]].
2. **Build.** One Claude Code session implements against those documents.
3. **Verify.** The committed harness runs green, plus the affected click-test scenarios (S1 to S6); what neither covers goes on the manual checklist.
4. **Record.** Journal entry with decisions, results, and learnings; the plan phase is marked done with date.

The human role is the critical expert in the loop: decisions with methodological or outward-facing consequences (publishing, reviewer identity, copyright, merge to main) are taken by the human and recorded as ADRs. The reviewing colleagues are users, not operators: nothing on their path may require Git, a terminal, or this knowledge base.

## Stage A: PRISM v1.0

Validation resolves every "Effekt: to be observed" in [[specification]].

### P0: Secure and make visible

- Push `feat/prisma-screening-tool`. The entire tool (v1 to v4, 12 commits) currently exists on one disk only.
- Merge to `main` once P1 is green. Pages serves `docs/` from `main`, so the merge is the deploy (verify the Pages source setting on merge).

Done when: the branch is on GitHub; after merge, `prisma.html` is live on the Evidence Companion.

### P1: Test foundation

- Commit the existing jsdom harness (43 behaviour checks plus 11 real-data checks, journal session 12) as `tests/`, with a `package.json` (jsdom as dev dependency) and a README. The no-framework rule stays scoped to `docs/`; the boundary (app vanilla, tests may use dev dependencies) is documented in the repo `CLAUDE.md`.
- All checks pass from a clean clone with one documented command.
- Add the acceptance checks that exist in [[specification]] but not yet in the harness: export/import round-trip losslessness (FR-08), seed reproduces the canonical benchmark (kappa and confusion matrix as fixed in [[verification]]) (FR-05), reviewer schema 0.1 to 0.2 migration.

Done when: a fresh clone runs the full suite green with one command.

Status: the committed jsdom harness runs green from a clean clone (`npm test`); the browser leg (`run-tests.html`) shares the same suite. The harness injects `prisma-data.js`, `prisma.js`, `prisma-import.js`, then `tests.js`. The additional P1 acceptance checks are now in the suite (Section G): export/import round-trip losslessness (FR-08), the reviewer schema 0.1 to 0.2 migration, and the seed reproducing the canonical benchmark marginals from the real `research_vault_v2.json` (the runner injects it; the paired confusion matrix and kappa are asserted out-of-tool by `replay_selftest.py` and `build_flow_model.py`, since ADR-017 removed the in-tool kappa and matrix).

### P2: Raw full-text reading (the methodological upgrade)

Motivation: evidence pinned on a knowledge document inherits the distillate's framing; the 2x2 experiment (journal session 11) showed knowledge documents amplify inclusion bias and degrade the Fairness kappa. Belege should come from the paper, not from an LLM summary of it.

- Connect target moves from `docs/data/screening/` to the repo root; the tool resolves `docs/data/screening/` (reviewer files) and `pipeline/markdown_clean/` (raw texts) as subpaths. Migration note for the handle stored in IndexedDB; reconnect once.
- Manifest: `scripts/build_screening_index.py` additionally emits a `zotero_key` to raw-filename mapping (filenames only, no raw content is published).
- `fetchPaperText` stays the single seam: connected clone with resolvable raw file reads raw text; otherwise served knowledge document; otherwise abstract.
- Every decision records `text_source` (`raw`, `kd`, `abstract`) in the reviewer file (schema bump to 0.3, backward compatible) and in the decision-log CSV; the disclosure reports per-source counts (PRISMA-trAIce M4, input data).
- In-text search and evidence pinning operate on whatever text is loaded. Corpus-wide search stays on the served index and the UI says so; a local raw-text corpus index is out of scope (see below).
- ADR-013 in [[specification]] records all of this; [[data]] gets the limitation paragraph (knowledge-document screening inherits distillate framing) and the updated source table.

Done when: with a connected clone, a paper with a raw text renders it and its Belege carry `text_source: raw`; on Pages without a connection, behaviour is unchanged except the visible source label.

Note (2026-06-21): M3 (ADR-016) realized the layer-source provenance for the already-served document, splitting paper text from machine extraction and binding `origin` to the layer. That is distinct from P2, which still adds the raw Docling text from the local clone and the `text_source` field. P2 remains open; M3 closed the contamination path inside the served distillate.

### P3: Excel-to-PRISM import seam (reframed by ADR-019)

Under ADR-019 PRISM is the binding screening surface and the colleagues screen in the tool. The Excel import bridge stays as an entry and migration seam for a batch captured elsewhere, not as the canonical capture path. P3 therefore builds and validates that seam.

- Import bridge: ingest the established Excel/CSV export (the column shape of `benchmark/data/human_assessment.csv`) as a human decision track; idempotent re-import; the import reports what was added, changed, and skipped.
- Validation at import, the data-hygiene lesson from R1: controlled-vocabulary check on exclusion reasons (the audit found the out-of-vocabulary value Other and 7 empty cells), category completeness, duplicate Zotero keys; violations become a visible import report, never silent acceptance.
- The per-reviewer files are the persistence for in-tool screening, the binding capture path under ADR-019; a batch captured in Excel enters over the import seam.
- ADR-019 records this, superseding the colleague-capture rationale in ADR-001 and the simulated Excel-capture path; written into [[specification]].

Done when: an Excel export of the established format imports cleanly, the validation report flags vocabulary violations, and the imported track appears in flow, agreement, and record.

Status (2026-06-21): the pure conversion and validation report (controlled-vocabulary checks on category, decision and exclusion reason, duplicate Zotero keys, Unclear skip, collision guard, idempotent re-import) is now under the headless harness (seven tests, `tests/tests.js`, via `window.__PRISMA_IMPORT_TEST__`). Still unexecuted in a browser: the FileReader flow, the MutationObserver mounting, the File System Access write, and the download path need the browser click-test (P5 S4) before P3 can be marked done. After the P2 connect-target move the bridge must write into the `docs/data/screening/` subpath instead of the handle root.

### P4: UI completion

- Keyboard-first screening (NFR-06): verify a full paper can be screened mouse-free; visible shortcut hints.
- Edge and empty states: the 15 papers without any text, boilerplate abstracts, zero-hit searches, very long titles.
- The OKLCH/Plex design system applied consistently to the PRISMA & Report and Daten & Repo surfaces (the screening view already has it).
- Resolve the [[design]] section 9 questions that survive v4 (chip layout under repetition, responsive three-pane behaviour at laptop widths); record outcomes in [[design]].

Done when: click-test S2 and S6 pass without findings.

### P5: Agent click-tests

Documented scenarios an AI browser agent executes against the deployed tool (or a local server), protocols in [[journal]]; fixes loop back into P4.

- S1 cold load: three surfaces reachable, corpus loads, intro lines present.
- S2 screening pass: open paper, in-text search, step through hits, pin a Beleg, derived decision, override to exclude, required exclusion reason, commit, locked view, edit again.
- S3 corpus search to candidate list to decision.
- S4 export/import round-trip across two browser profiles (colleague simulation).
- S5 report surface: flow counts reconcile with the decision log, checklist status persists across reload, disclosure text contains the session facts, CSV downloads.
- S6 keyboard-only screening of one paper.

Not agent-testable, manual checklist (`tests/manual-checklist.md`): File System Access connect and write (browser security dialogs), the Git round-trip (commit, push, pull, reconnect), real colleague onboarding.

Done when: all six scenarios protocolled, findings fixed or explicitly deferred.

### P6: Knowledge-base consolidation

- One canonical number set (benchmark pairs, disagreements, confusion matrix, human decisions; the values in [[verification]]) applied across `README.md`, [[plan]], [[project]]; the superseded earlier figures survive only in journal and archive contexts.
- [[plan]]: new header date and a tool milestone (the PRISM build), milestone plan extended past 4 May.
- [[specification]]: superseded requirements (FR-03, FR-10, the placement of FR-05) marked inline instead of the trailing demotion paragraph; the v3 module descriptions pruned to v4 reality (genesis stays in [[journal]] and [[design]]).
- `knowledge/INDEX.md` and root `README.md` updated (tool section, plan row, costs).

Done when: searching the retired numbers hits only journal and archive contexts.

### P7: Dress rehearsal

- One end-to-end run of the colleague quickstart by someone who is not the builder (or a strict fresh-profile simulation), fixing friction only, no new features.
- Prepare the demo: seed perspective plus one worked example with pinned evidence.
- Freeze for the stakeholder validation.

Done when: the quickstart works without help from the builder.

## Stage R: The first-round pass through PRISM and its evaluation

The demonstrable core of the project: the PRISMA methodology executed on exactly this review's data and shown in the frontend. R1 and R2 are data work and can start immediately, in parallel with Stage A; R3 needs the deployed tool (after P0) and doubles as its hardest usability test; R4 and R5 close the loop. Stage B later reuses this machinery for the update.

Shaping decisions (taken 2026-06-09): replay plus interactive agent pass; knowledge-document category evidence enters the replay as clearly labelled machine-extracted evidence, separate from reviewer evidence; the record is published on the Companion. Claim line: the first review round (the full corpus) is carried through PRISM as the first real pass and reported honestly, with the items unrepairable in retrospect named (the corpus papers without a human decision plus one unresolved pairing discrepancy, see [[verification]]; the missing pre-specified protocol M1). The same gate is enforced for the update (Stage B). The follow-up paper tells exactly this two-round story.

Status (2026-06-09): the first-round record is drafted ahead of the replay script (now folded into [[verification]]) plus `docs/data/flow_model.json`, every count an agent recount flagged `agent_recount_scripted_replay_pending`. The committed R2 replay script must supersede these counts before the record is published on the Companion (R5). Update (2026-06-21): the 292-vs-291 pairing discrepancy is resolved (a stray Has_HA flag on `2YS85B49` in `papers_full.csv`, no missing human decision); the replay self-test reproduces the benchmark core, but the full FlowModel generation (R4) still supersedes the hand-drafted counts before R5.

### V: Claim verification (added 2026-06-09 after the meta review)

Two claims the project leans on were asserted, not verified; both are being checked before they may carry anything.

- V1, empirical core (done, see [[verification]]): all published numbers reproduce, but the interpretation changes. Most of the LLM-include/human-exclude papers are human exclusions for Duplicate, No full text, or Wrong publication type, criteria a one-paper-at-a-time LLM cannot see; on the content-only subset the include rates converge and kappa rises (figures in [[verification]]). The README's prevalence-artifact framing is backwards, agreement is genuinely near chance. "Sonnet+KD best condition" flips under the content-only sensitivity. No inter-human reliability baseline exists.
- V2, methodological novelty (done, see [[verification]]): claim holds partially. Separate advisory AI records are established practice (EPPI-Reviewer, Nested Knowledge, DistillerSR); novel are the generated trAIce R1 flow artifact, session-derived disclosure generation, and the retrospective trAIce rendering. trAIce is a proposal (Holst et al. 2025, JMIR AI), RAISE is Cochrane-carried (Flemyng et al. 2025); related-work list in the document.

Consequence ledger (binding for R4 and the paper): the divergence finding must be reported decomposed (workflow-criteria disagreement vs content disagreement), with po, kappa, PABAK, kappa_max, bias index, category kappas, and the content-only sensitivity; the inclusion-bias claim survives only for the KD-input condition. The contribution claim is conformance by construction at the report-artifact level plus retrospective rendering, not AI-human separation as such. Corrections queued into P6: the README Byrt sentence and the Sonnet+KD best-condition qualifier (see [[verification]]). Tool implication for the agreement panel: report content-only agreement alongside the full matrix, since recorded exclusion reasons make the decomposition possible.

### R1: Data completeness audit

- Map every PRISMA 2020 phase and every trAIce item to its source in the repo: identification by source (deep research, manual, Zotero-only), duplicate handling, the dual screening tracks, the included sets.
- Name the holes explicitly: papers without a human decision, the non-auditable acquisition steps ([[verification]]: five claims without audit trail), no pre-registered protocol (M1), papers without any text.
- Output: a machine-readable conformance map (per item: reconstructable, partial, missing, with source path), the data behind the checklist surface and the evaluation in R4.

Done when: every checklist item points at data or at a named gap.

### R2: Replay seed completion

- A script builds the full retrospective FlowModel from the actual files (identification, duplicates, screening with the AI/human split, included), not hand-entered; the seed reproduces the canonical benchmark (kappa and confusion matrix as fixed in [[verification]]) as self-test.
- Machine-extracted evidence: the Kategorie-Evidenz quotes from the knowledge documents are imported per paper and category as a separate, labelled provenance class (new ADR; schema field distinct from reviewer evidence; rendered visually distinct; never counted as reviewer Belege).

Status (2026-06-21): the provenance-class half is built and verified (M3, ADR-016). The reading column now splits the served document into a paper layer and a machine-extraction layer (`splitDocLayers`), a Volltext / KI-Extraktion toggle switches between them, and a Beleg pinned from the KI-Extraktion layer carries `origin: ai` and never sets `work.cats`, so AI-sourced text cannot enter the binding decision. Six headless tests cover the split and the binding separation; the boundary lands cleanly on all served documents.

Update (2026-06-21, Session 17): the replay-script self-test is built and green. `benchmark/scripts/replay_selftest.py` independently re-pairs the raw CSVs and asserts the canonical matrix, kappa, the content-only sensitivity, and the 292-vs-291 resolution (self-test green, exit 0; the asserted values are the canonical set in [[verification]]). The diagnostic `verify_femprompt.py` was executed and reproduces every V1 figure, its output matching the committed `recompute_verification.txt`. Done since (ADR-018): the machine's per-category assessment is pre-loaded as `origin: ai` Belege (`injectMachineEvidence` from `docs/data/machine_evidence.json`), using the model's per-category reasoning rather than the uncategorized raw `Evidenz` quotes, so no quote-to-category provenance is fabricated; the items are advisory, never bind `work.cats`, and are never written to the reviewer file.

Done when: the report surface shows the complete retrospective review from data alone.

### R3: Interactive agent screening pass

Status (decided 2026-06-09): paper-grade, not a throwaway usability run. Prerequisite: a pre-specified protocol document, committed before the run, fixing sample size and stratification, prompt and instruction version, stopping criteria, and its own disclosure. The agent track must not recreate the M1 gap (no pre-specified protocol) that R1 diagnoses for the original review.

- An AI browser agent screens a stratified sample in the real frontend: read, search, pin evidence, decide. Stratification over the confusion-matrix cells and text availability (raw, knowledge document, abstract only); sample size decided at phase kickoff.
- The agent writes the reviewer file `agent`, a third track besides the human seed and the batch LLM. Its agreement (kappa agent vs human, agent vs batch LLM) and its divergence patterns are an evaluation result in their own right: does interactive, evidence-grounded screening diverge differently than abstract-only batch assessment?
- By-product: a friction protocol of real tool use under load, fed back into Stage A polish.

Done when: the sample is screened with pinned evidence, the third track appears in the Reviewers and Agreement views, and the friction findings are journaled.

### R4: Record generation and evaluation

- Generate the full PRISMA record bundle from the replay: flow diagram (SVG, trAIce R1 split), agreement metrics for all tracks, both checklists filled from the R1 conformance map, disclosure text from the real metadata (model, prompt version, parameters, costs).
- The evaluation, written as a knowledge document, has three axes: (a) conformance of the conducted review (item status plus gaps), (b) expressiveness of the tool (can the frontend carry the whole process), (c) the three-track comparison from R3.

Done when: the bundle is versioned in the repo and the evaluation document exists.

### R5: Publication on the Companion

- The record and the conformance evaluation become a public, citable page of the Evidence Companion, linked from the Companion navigation and `prisma.html`. Publishing is a human decision at the moment it happens.

Done when: the public page shows the generated record, and the project can state: this review was conducted and reported with a PRISMA-trAIce methodology on exactly this data, verifiable in the frontend.

## Stage B: The real review cycle through the tool

Stage B proves repeatability: the tool carries the literature update end-to-end with the record machinery from Stage R. It follows the stakeholder validation (B1).

### B1: Stakeholder validation and v1.1

- Protocol the stakeholder validation against the open ADR effects: every "Effekt: to be observed" in [[specification]] gets its observation recorded (held, revised, or refuted).
- Friction findings become fixes; anything structural becomes an ADR; the result deploys as v1.1.
- Decide from observation, not assumption: do the colleagues want blind mode for fresh screening, do they use evidence pinning as designed, is the assessment pane sufficient.

Done when: no ADR carries an unobserved effect; v1.1 is deployed and the colleagues have screened their first real papers with it.

### B2: Literature update executed inside the tool

- Re-run the versioned deep-research prompts (`prompts/CHANGELOG.md` governance); export RIS; deduplicate against the existing corpus.
- Run the offline LLM assessment on the new batch with the versioned assessment prompt and recorded parameters (existing pipeline scripts; this is the disclosure's input).
- Pipeline the new papers: PDF to `pipeline/markdown_clean/` (raw, unpublished), knowledge documents where wanted, rebuild the full-text index and the raw-text manifest.
- The colleagues screen the new papers in PRISM, the binding surface (this time with a pre-specified protocol, enforced vocabulary, and a reviewer column); a batch captured in Excel enters over the P3 import seam; evidence grounding happens in PRISM (machine evidence, agent pass, human verification of samples); the flow diagram shows the update cycle with the AI/human split.

Done when: every new paper has a binding human decision with evidence, recorded text source, and a sibling AI decision; the update is reproducible from the repo alone.

Status (2026-06-09): the pre-registration protocol is [[update-protocol]] (finalized from the round-1 draft), with paste-ready prompts per lane and two Claude Code rehearsal runs in `deep-research/update-rehearsal/`; it is committed before any round 2 search executes. Open inside it: whether both reviewers screen the full batch or a split, and whether the optional Claude Code lane L5 runs.

### B3: Reconciliation and the PRISMA record

- Reconcile divergent human decisions on the Daten & Repo surface; the consensus decision and the process are recorded (PRISMA-trAIce M8).
- Export the complete PRISMA record as one bundle with the Stage R machinery (R2, R4), now over the updated corpus: flow SVG, agreement metrics, both filled checklists, disclosure text, decision-log CSV; the bundle lives in the repo.
- The paper's methods and disclosure sections are generated from the bundle, then edited by the authors; [[verification]] checks the final paper text against the repository.

Done when: the record bundle exists, the paper cites it, and the integrity check reports no unexplained deviation.

## Stage C: Closure and reuse

### C1: Evidence Companion sync

- Rebuild the Companion data (research vault, categories, graph, divergences) over the updated corpus; the human-AI comparison is updated as research material in the report layer and the Companion, never in the screening view.

### C2: Project closure

- Canonical numbers final across all documents; [[plan]] closes the milestone plan; the journal gets a closing entry; the vault Project Overview (SocialAI) is updated.

### C3: Reuse extraction

- Decide: PRISM stays in-repo, or becomes a standalone repo seeded with a neutral demo corpus. Either way, document the setup path for a foreign review: own `categories.yaml`, own corpus, own prompts, same record model.
- This is the generalization step that makes the project a methodological showcase for LLM-assisted, PRISMA-trAIce-conformant reviews; candidate for a DHCraft showcase and for the SocialAI strand's further work.

Done when: a third party could run their own review from the documentation alone, without reading this repo's history.

Status: the in-repo versus standalone decision above is still open; the setup path is written from the validated procedure when reuse is actually executed, not pre-drafted ahead of a dry run.

## Test responsibility matrix

| Layer | Owner | Where |
|---|---|---|
| Decision logic, kappa/flow aggregation, schema migration, renderer escaping, export/import round-trip | committed jsdom harness | `tests/` |
| Visual and interaction reality: reading flow, search stepping, pinning, downloads, keyboard, responsive | agent click-tests S1 to S6 | protocols in [[journal]] |
| File System Access dialogs and writes, GitHub Desktop versioning of the reviewer files, real onboarding | human | `tests/manual-checklist.md` |

## What this plan does not cover

Writing the Forum Wissenschaft paper itself (the plan delivers its methods inputs: the PRISMA record and the disclosure, B3), a raw-text corpus search index, CI (revisit after P1), and v2 features beyond reuse extraction (live multi-reviewer merge, mobile screening).

## Simulated decisions (pending ratification)

Every decision in this section is simulated. The project decided on 2026-06-09 not to block on external feedback: stakeholder decisions are simulated from a realistic perspective, explicitly marked, and ratified, revised, or dropped at the next real contact (the stakeholder meeting, or earlier written feedback). A simulated decision licenses work, never an outward claim: nothing here may appear in a publication, record, or report as a stakeholder decision until ratified. The simulated perspectives are grounded in the documented roles, the review lead and the second reviewing expert, both working in the established Excel environment under real time constraints; the simulation weights coding burden and workflow continuity high. ADR-019 has since ratified in-tool screening as the binding path and retired the earlier reading that screening inside the tool had been falsified; the Excel environment remains an entry seam, not the capture path.

### Analysis fields (the [[update-protocol]] TP4 open decisions)

| # | Decision | Simulated outcome | Rationale |
|---|---|---|---|
| 1 | Sub-question set | SQ1 to SQ3 confirmed; the gap map (SQ3) serves both the follow-up paper and the Fair Bench preparation | producing it once for two uses matches the programme economy |
| 2 | Field set, AN_Harm_Types | seven fields confirmed; AN_Harm_Types kept optional | the highest-burden field; SQ2 survives at reduced resolution without it |
| 3 | Encoding | semicolon multi-select | binary columns per code would make the working sheet unusable; the bridge validates either way |
| 4 | Retro-coding scope | staged: update batch first, then retro-code round-1 includes after the pilot stabilizes the definitions | avoids doubling the workload before the field definitions are proven |
| 5 | Coding setup | single human coder per paper, plus the advisory LLM track, plus a double-coded human-human overlap sample | full dual coding is unrealistic for two busy academics; the overlap sample closes the missing inter-human baseline at bounded cost |
| 6 | Vocabulary | Role_Persona promotion kept; AN_Population boundary rules added; Intersectional coded additively; Other_Axis stays | resolves the three vague-field findings; additive intersectionality preserves per-axis frequencies |
| 7 | Pilot | stratified pilot on a small sample; revise a field when coders flag ambiguity on more than roughly a quarter of papers | concrete enough to run, loose enough to revise |
| 8 | Studientyp | confirmed, existing column, vocabulary-enforced, no duplicate | no argument against it surfaced |

### Round-2 protocol (the [[update-protocol]] open issues)

| Decision | Simulated outcome | Rationale |
|---|---|---|
| Screening split | the two reviewers split the new batch with a double-screened overlap sample; the overlap yields the project's first inter-human agreement figures | workload-realistic; addresses the named baseline gap |
| Claude Code lane L5 | runs as a documented fifth lane | the rehearsal runs showed it works; an extra documented lane strengthens the multi-system design |
| Prompt provenance | cite `deep-research/literature-review-prompt.md` as the documented template, with the loss of the instantiated round-1 prompt stated as a known gap | settled by the submitted paper's own citation practice |
| Reviewer identifiers | neutral ids `reviewer-1` / `reviewer-2` repo-wide (avoids the R1 collision with the trAIce item id and the plan phase) | privacy-clean, PRISMA-sufficient, collision-free |
| Unclear decisions at import | imported as report items, not decisions; visible until resolved in Excel | the schema keeps two-valued decisions; Unclear is a work state |

### User-story validation (the stories in [[specification]])

The v4 core stories (read, search, pin) are confirmed in substance, with a role correction. ADR-019 makes in-tool screening the binding path; whether evidence pinning is required per decision or concentrated at reconciliation stays a workflow choice for the stakeholder meeting, and the heavy in-tool reader during reconciliation is the review lead and technical lead. Record-an-exclusion is confirmed but lives in Excel; generate-record, produce-disclosure, verify-conformance, look-up-category, and understand-checklist are confirmed. The v3 blind and divergence stories are confirmed superseded. Share-a-session is dropped for round 2, since the Excel-plus-bridge path replaces session hand-off, and retained only as background for foreign reuse.

### Ratification

At the next stakeholder meeting (or earlier written feedback), walk this ledger top to bottom; per row record ratified, revised (how), or dropped, update the affected documents ([[update-protocol]], [[specification]]), and remove the simulation marker from each decision as it resolves. The ledger stays as provenance of which decisions were, for a time, simulated.

## Open items

- Reviewer identity in public files: are the current short keys acceptable in a public repo, or pseudonyms? Decide before P3.
- Do the colleagues screen the full corpus or a split? Affects only the onboarding text, not the tool.
- Pages source setting (branch/folder) to verify at the P0 merge.
