---
title: Plan
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: active
language: en
version: "0.3"
created: 2026-06-09
updated: 2026-07-03
authors: [Christopher Pollin]
generated-with: Claude Code
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
related: [specification, design, data, journal, update-protocol]
---

Phased plan for completing the whole project: PRISM v1.0 (Stage A), the first-round pass of the existing review data through PRISM and its evaluation (Stage R, the demonstrable core), the real review cycle through the tool (Stage B), and closure plus reuse (Stage C). This is a process document; it is updated as phases close (mark done with date), and decisions made along the way go into [[specification]] as ADRs, not here.

## Zielbild (what "done" means)

The tool is not the goal; the goal is a review whose every decision is auditable, demonstrated on this project's own data. The project is finished when four things are true:

1. **The review is carried through PRISM, and only then complete.** All of the review's dual-track data (the full corpus, human decisions, LLM assessments, divergences, category evidence) passes through PRISM into a PRISMA 2020 plus trAIce record, public on the Evidence Companion, together with an honest conformance evaluation, which items the recorded data satisfies, which only partially, which not at all. The items unrepairable in retrospect (the absent pre-registered protocol above all) are named, not hidden; they show what epistemic infrastructure must record from the start.
2. **The instrument is the binding screening surface.** Per ADR-019 the colleagues screen in PRISM, where the more precise PRISMA steps happen, the screening decision, evidence grounding, flow, agreement, checklist, disclosure, and record. The Excel import bridge stays only as an entry seam for a batch captured elsewhere. Every category can point at the words that justify it, every AI involvement is disclosed, and the human decision is always the binding record.
3. **The cycle is repeatable.** The planned literature update (same versioned deep-research prompts, new batch, dual assessment, reconciliation) is executed inside the tool with the same record machinery. Reproducibility is proven by execution, not asserted.
4. **The infrastructure outlives the case.** The paper and the Evidence Companion publish the review; the repo documents how a third party sets up the same instrument for a different review (own categories, own corpus). That cashes out the project's claim, epistemic infrastructure as practice, beyond the single study.

Research chain and priority (decided 2026-06-09): the primary product is the **working instrument**. The chain runs: tool, then the updated, methodologically grounded corpus (Stage B), then the analysis of how prompt engineering must adapt for social work, gender, and bias contexts. A follow-up paper describes the extended review's results and the method; the Forum Wissenschaft paper is its precursor. When effort competes, colleague usability and the update cycle win over Companion polish; the record machinery serves the follow-up paper's methods section.

Narrative register (decided 2026-06-09): the project describes the workflow and how a large language model is used to build it out. It makes no efficiency or cost-benefit claims. Claims discipline: any empirical or novelty claim that reaches a paper, the Companion, or a report must be either recomputed from the raw data or verified against published sources, and no AI-generated figure may be presented as human-checked.

## Shaping decisions (taken 2026-06-09)

1. **Reading text: raw full text, read locally.** The screening view reads the raw Docling texts from `generated/markdown_clean/` through the connected clone (File System Access), option 2 in [[data]] (reading text source). Raw texts are never published; the public Pages site falls back to the served knowledge document, then the abstract. Every decision records which text source was actually read.
2. **Primary collaborator path: export/import without Git.** The reviewing colleagues work on the deployed Pages site in any browser and exchange their reviewer file as a download. Git plus File System Access stays the power path (technical lead, local clone).
3. **Testing: committed headless harness plus agent click-tests.** The jsdom harness moves into the repo and becomes reproducible; an AI browser agent executes documented click-scenarios against the real UI and protocols findings. No CI for now; revisit once the harness is committed.
4. **Scope.** Tool completion, testing, knowledge-base consolidation, push and deploy.

## Programme view: Teilprojekte (added 2026-06-09)

The vault-side programme plan ("Gesamtplan FemPrompt Forschungsprogramm", Projects/SocialAI) structures the research programme as seven Teilprojekte. Mapping onto this plan:

| TP | Name | Lives where |
|---|---|---|
| TP1 | PRISM working instrument | Stage A (P0 to P7, with P3 as the Excel import seam) |
| TP2 | First-round pass through PRISM, round one | Stage R |
| TP3 | Characterizing the human-AI divergence (illustration) | own work item; feeds R4 and the paper; elaboration session pending |
| TP4 | Operationalizing the analysis question (prompt engineering for social work, gender, bias) | own work item; MUST precede the B2 schema freeze so the Excel captures the analysis fields; deliverable: the analysis design in [[update-protocol]] plus schema extension |
| TP5 | Literature update, round two | Stage B |
| TP6 | Follow-up paper and FFG report | outside the repo; fed by R4, B3, TP3 |
| TP7 | Reuse extraction | Stage C |

Division of labour between the two layers: the vault carries the programme view and decisions history for the human; this document steers the repo work. A change in one layer that affects the other is mirrored in the same session.

### TP3 work plan: characterizing the divergence (illustration)

1. Harden the pairing from the raw CSVs, resolve the residual pairing discrepancy, and keep the re-pairing reproducible by committed script rather than by hand.
2. Canonical analysis set, computed by committed script, not by hand: full matrix plus the content-only subset (workflow-criteria exclusions Duplicate / No full text / Wrong publication type separated out), per category; metrics po, kappa, PABAK, kappa max, bias index; the KD-input contrast (where the inclusion bias survives); the 2x2 with the content-only sensitivity.
3. Write up the decomposed finding as the licensed source for the paper's empirical section. Framing rules: no error-rate language (no inter-human baseline), divergence decomposed before interpreted, the infrastructure-corrects-itself narrative explicit.
4. Apply the queued corrections: the README Byrt sentence and the Sonnet+KD best-condition qualifier.

Verification: every figure in the analysis document traces to committed script output; an independent re-derivation reproduces the headline table from the raw CSVs by a human-checked path. Validation: co-authors accept the decomposed framing. Done when: the paper can cite every number from the committed analysis document.

Status: the decomposed framing is settled qualitatively (workflow-criteria disagreement separated from content disagreement, no inter-human baseline, the divergence read as illustration); the committed re-pairing and per-category analysis scripts, and a human-checked path from the raw CSVs to every figure, remain to be (re)built. The numbers themselves live in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion, not in this plan; step 4 corrections remain queued for P6.

### TP4 work plan: operationalizing the analysis question

1. A structured working session turns "how must prompt engineering adapt for social work, gender, and bias" into answerable sub-questions (with the colleagues where possible).
2. Derive candidate capture fields from the sub-questions (for instance: prompt techniques discussed, bias types addressed, intervention or mitigation type, evidence type, population). Draft as a schema extension next to the ten categories.
3. Pilot: code a small stratified sample of already-included papers with the draft fields; measure answerability (fill rate, ambiguity notes); revise definitions.
4. Freeze: the extension goes into the Excel template for the update, `categories.yaml`, and the import-bridge validation (P3).

Verification: the pilot shows the fields are answerable from the texts. Validation: the colleagues confirm the fields capture what the analysis needs, before the schema freeze. Done when: the update's Excel template carries the analysis fields and the bridge validates them. Hard ordering: TP4 freeze precedes the B2 screening start.

Status: the analysis-design is written into [[update-protocol]] (sub-questions, field set with closed vocabularies); the field decisions were fixed on 2026-07-03 (see Decided questions below). Next are the pilot and the freeze.

## Programme verification and validation matrix

Verification means technically correct (automated or recomputed wherever possible); validation means it meets the need of the named humans. Nothing outward-facing ships without both.

| TP | Verification | Validation | Result criterion |
|---|---|---|---|
| TP1 Tool | committed harness green from clean clone; node checks; agent click-tests S1 to S6 | Excel round-trip with a real export; colleagues' workflow untouched | established workflow flows losslessly through the bridge |
| TP2 Retro-record | the replay reproduces the canonical benchmark by a human-checked path; every conformance item sourced | human review of the record page before publishing | citable record page live on the Companion |
| TP3 Divergence | all figures from committed script output; independent, human-checked re-derivation; sensitivity analyses documented | co-authors accept the decomposed framing | paper-ready analysis document, every number licensed |
| TP4 Analysis fields | pilot coding shows fields answerable | colleagues confirm fields serve the analysis | schema frozen before update screening |
| TP5 Update | protocol committed before any run; import validation reports; flow reconciles with decision log | reconciliation of divergences with the reviewers | updated corpus with complete audit trail |
| TP6 Paper/FFG | paper-integrity check against the repo before submission; claims only as licensed by a human-checked recomputation or published source | co-author review; venue peer review | submission with generated, verifiable methods section |
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

- Push `feat/prisma-screening-tool` and merge to `main`. Pages serves `docs/` from `main`, so the merge is the deploy.

Status: done 2026-06-30. The branch is on origin and fully merged into `main`; `prisma.html` is live on the Evidence Companion (fetch-verified 2026-07-02), which also confirms the Pages source setting.

### P1: Test foundation

- Commit the existing jsdom harness (behaviour checks plus real-data checks, journal session 12) as `tests/`, with a `package.json` (jsdom as dev dependency) and a README. The no-framework rule stays scoped to `docs/`; the boundary (app vanilla, tests may use dev dependencies) is documented in the repo `CLAUDE.md`.
- All checks pass from a clean clone with one documented command.
- Add the acceptance checks that exist in [[specification]] but not yet in the harness: export/import round-trip losslessness (FR-08), seed reproduces the canonical benchmark marginals (FR-05), reviewer schema 0.1 to 0.2 migration.

Done when: a fresh clone runs the full suite green with one command.

Status: the committed jsdom harness runs green from a clean clone (`npm test`); the browser leg (`run-tests.html`) shares the same suite. The harness injects `prisma-data.js`, `prisma.js`, `prisma-import.js`, then `tests.js`. The additional P1 acceptance checks are now in the suite (Section G): export/import round-trip losslessness (FR-08), the reviewer schema 0.1 to 0.2 migration, and the seed reproducing the canonical benchmark marginals from the real `research_vault_v2.json` (the runner injects it). ADR-017 removed the in-tool kappa and matrix, so the paired confusion matrix and kappa are not asserted in the harness; they belong to the offline benchmark data, not the tool.

### P2: Raw full-text reading (the methodological upgrade)

Motivation: evidence pinned on a knowledge document inherits the distillate's framing; the 2x2 experiment (journal session 11) showed knowledge documents amplify inclusion bias and degrade the Fairness kappa. Belege should come from the paper, not from an LLM summary of it.

- Connect target moves from `docs/data/screening/` to the repo root; the tool resolves `docs/data/screening/` (reviewer files) and `generated/markdown_clean/` (raw texts) as subpaths. Migration note for the handle stored in IndexedDB; reconnect once.
- Manifest: `src/publish/build_screening_index.py` additionally emits a `zotero_key` to raw-filename mapping (filenames only, no raw content is published).
- `fetchPaperText` stays the single seam: connected clone with resolvable raw file reads raw text; otherwise served knowledge document; otherwise abstract.
- Every decision records `text_source` (`raw`, `kd`, `abstract`) in the reviewer file (schema bump to 0.3, backward compatible) and in the decision-log CSV; the disclosure reports per-source counts (PRISMA-trAIce M4, input data).
- In-text search and evidence pinning operate on whatever text is loaded. Corpus-wide search stays on the served index and the UI says so; a local raw-text corpus index is out of scope (see below).
- ADR-013 in [[specification]] records all of this; [[data]] gets the limitation paragraph (knowledge-document screening inherits distillate framing) and the updated source table.

Done when: with a connected clone, a paper with a raw text renders it and its Belege carry `text_source: raw`; on Pages without a connection, behaviour is unchanged except the visible source label.

Note (2026-06-21): M3 (ADR-016) realized the layer-source provenance for the already-served document, splitting paper text from machine extraction and binding `origin` to the layer. That is distinct from P2, which still adds the raw Docling text from the local clone and the `text_source` field. P2 remains open; M3 closed the contamination path inside the served distillate.

### P3: Excel-to-PRISM import seam (reframed by ADR-019)

Under ADR-019 PRISM is the binding screening surface and the colleagues screen in the tool. The Excel import bridge stays as an entry and migration seam for a batch captured elsewhere, not as the canonical capture path. P3 therefore builds and validates that seam.

- Import bridge: ingest the established Excel/CSV export (the column shape of `assessment/human_assessment.csv`) as a human decision track; idempotent re-import; the import reports what was added, changed, and skipped.
- Validation at import, the data-hygiene lesson from R1: controlled-vocabulary check on exclusion reasons (the audit found the out-of-vocabulary value Other and empty cells), category completeness, duplicate Zotero keys; violations become a visible import report, never silent acceptance.
- The per-reviewer files are the persistence for in-tool screening, the binding capture path under ADR-019; a batch captured in Excel enters over the import seam.
- ADR-019 records this, superseding the colleague-capture rationale in ADR-001 and the simulated Excel-capture path; written into [[specification]].

Done when: an Excel export of the established format imports cleanly, the validation report flags vocabulary violations, and the imported track appears in flow, agreement, and record.

Status (2026-06-21): the pure conversion and validation report (controlled-vocabulary checks on category, decision and exclusion reason, duplicate Zotero keys, Unclear skip, collision guard, idempotent re-import) is now under the headless harness (`tests/tests.js`, via `window.__PRISMA_IMPORT_TEST__`). Still unexecuted in a browser: the FileReader flow, the MutationObserver mounting, the File System Access write, and the download path need the browser click-test (P5 S4) before P3 can be marked done. After the P2 connect-target move the bridge must write into the `docs/data/screening/` subpath instead of the handle root.

### P4: UI completion

- Keyboard-first screening (NFR-06): verify a full paper can be screened mouse-free; visible shortcut hints.
- Edge and empty states: the papers without any text, boilerplate abstracts, zero-hit searches, very long titles.
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

- One canonical number set (benchmark pairs, disagreements, confusion matrix, human decisions) lives in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion; `README.md`, [[plan]], and [[project]] point there and state findings qualitatively rather than restating figures; the superseded earlier figures survive only in journal and archive contexts.
- [[plan]]: new header date and a tool milestone (the PRISM build), milestone plan extended past 4 May.
- [[specification]]: superseded requirements (FR-03, FR-10, the placement of FR-05) marked inline instead of the trailing demotion paragraph; the v3 module descriptions pruned to v4 reality (genesis stays in [[journal]] and [[design]]).
- `knowledge/INDEX.md` and root `README.md` updated (tool section, plan row, costs).

Done when: searching the retired numbers hits only journal and archive contexts.

### P7: Dress rehearsal

- One end-to-end run of the colleague quickstart by someone who is not the builder (or a strict fresh-profile simulation), fixing friction only, no new features.
- Prepare the demo: seed perspective plus one worked example with pinned evidence.
- Freeze for the stakeholder validation.

Done when: the quickstart works without help from the builder.

## Stage A revision: the working-instrument redesign (decided 2026-06-30)

Stage A above was planned with the three-surface IA (ADR-012) and the colleague-capture framing that ADR-019 later narrowed. An operator session on 2026-06-30 brought two strands together: this branch (the folder restructure, the consolidated knowledge vault, the reframing of the divergence as illustration, trAIce at 17 items) and a separate working session that fixed the tool's direction and ran an independent, adversarially verified review of the shipped frontend. This section integrates both. It revises, not discards, the phase work above: the cuts below re-sequence P4 (UI completion) and parts of P2/P3 around a single decision, the tool is one workspace, identity is Git, the record is a generated output.

### What the consolidation teaches

1. The mission is now singular. ADR-019 (in-tool screening is binding) and the reframing (divergence is illustration, not the empirical core) together leave the tool one job: a clean, binding, evidence-grounded screening instrument. The comparison and demonstration apparatus earlier versions carried is research material for the Companion, not a tool surface. This makes the one-workspace redesign central, not polish.
2. Decisions live as ADRs in the vault, not as standalone plan documents. A redesign-plan document drafted on `main` in the same session was the anti-pattern and was removed; the vault is convention-conformant and stays so.
3. A shipped decision can still be wrong. ADR-018 (machine category evidence as `origin: ai` Belege) was committed on this branch; the independent review found the loaded snippets are the model's per-paper screening reasoning, not paper evidence, duplicated verbatim across every flagged category, with exclusionary text pinned as category support. The verification checkpoint applies to our own output: O1 below reopens ADR-018.
4. The three-surface IA and the reviewer-identity form are residue of the older downstream-layer framing. The instrument-for-active-research goal plus Git provenance let us simplify both.

### Redesign decisions (operator, 2026-06-30)

| Decision | New ADR | Revises |
|---|---|---|
| Tool purpose is an instrument for active research, not a one-shot demonstrator | ADR-020 | sharpens ADR-019 |
| The three surfaces merge into one workspace; the PRISMA record becomes a generated output, the data functions an edge affordance | ADR-020 | ADR-008, ADR-012 (three-surface IA) |
| Reviewer identity is the Git commit author; the in-tool identity form and the multi-reviewer perspective are dropped; the decisions file is written diff-able | ADR-021 | ADR-010 (one file per reviewer), the reviewer-identity open item, the simulated reviewer-identifiers row |
| Academic references leave the work surface; standard names live only in the generated record and disclosure | ADR-020 | P4/P6 design and reference placement |
| The divergence stays out of the tool (synthesis-only screening) | confirms ADR-014 | -- |

### Verified review findings folded in

The adversarial review (56 of 57 findings confirmed) maps onto the cuts below, not a separate list:

- Machine evidence is broken by design (blocker): O1, reopens ADR-018.
- Accessibility gaps (no focus ring on the search inputs, pin menu without dialog role or focus trap, category chips without `aria-pressed`, status by colour alone, focus lost on paper switch, hover-only tooltips, muted-text contrast): the accessibility cut, folds into P4 NFR-06.
- The hard inclusion AND-rule has no path to Include by judgement: O2.
- Technik/Sozial labels reproduce the framing the project retired: O3.
- Default entry on a boilerplate paper, thin-text substrate for a large share of the corpus: P2/ADR-013 (O4).

A second interactive pass (browser agent, 2026-06-30) ran a real screening on a local server and confirmed these at the live tool, with two refinements. It had loaded a stale build (one commit behind HEAD), so its O1 confirmation describes the pre-removal state, already fixed in HEAD; and it surfaced one finding not on the list, the category chip's accessible name carried the internal slug and the full definition, now fixed by moving the slug to a decorative tip (`aria-hidden`) and the definition to the button's description (`title`). The core mechanic (read, search, pin, derive, bind, persist, reload) was confirmed sound, and the deterministic decision record (ADR-021) was validated end to end.

### Sequenced cuts

Decided and unblocked first, gated cuts after their decision resolves. Each keeps the harness green (the current count is whatever `node tests/run.mjs` prints) and is recorded as an ADR.

1. **One workspace** (done 2026-06-30) -- ADR-020. Screening is the permanent surface; the PRISMA record and the data functions become on-demand affordances; academic references leave the work surface. Files: `docs/prisma.html`, `docs/js/prisma.js` (renderShell, showSurface, renderData), `docs/css/prisma.css`.
2. **Git provenance** (done 2026-06-30; O5 decided 2026-07-03: one file per reviewer) -- ADR-021. Drop the identity form and the perspective switcher; write the decisions file deterministically (stable order, one paper block); generate a session commit message. Files: `docs/js/prisma.js`, a deterministic serializer with its own test.
3. **Accessibility and keyboard flow** (done 2026-06-30) -- P4 NFR-06. Focus restoration after a paper switch, visible focus rings on inputs and controls, `aria-pressed` on category and exclusion chips, dialog semantics with focus move, Escape, and Tab trap for the pin menu, text equivalent for the colour-only status dot, slug and definition out of the chip's accessible name, keyboard-focus tooltips, darkened muted-text tokens for contrast.
4. **Machine evidence** (done 2026-06-30) -- ADR-022 supersedes ADR-018: removed from the evidence list; the model's per-paper reasoning stays only in the collapsed KI-Vorschlag.
5. **Inclusion logic** (done 2026-06-30) -- ADR-023 resolves O2: a reason-gated override to Include. The AND-rule derives a default; the human binds and may override it either way, an override to Include recording a free-text justification (RAISE P3). Grounded in [[standards]] and the RAISE primary source.
6. **Feminist language** (done 2026-06-30) -- O3: Technik/Sozial to Gegenstand/Perspektive on the work surface; the internal constants stay.
7. **Text substrate** (partial 2026-06-30) -- O4/P2/ADR-013: the tool opens on the first screenable paper (not boilerplate) and a textless paper shows a prominent notice instead of going silent; loading raw local full text remains the larger P2/ADR-013 work.

### Open gates

| ID | Question | Status |
|---|---|---|
| O1 | Machine evidence: remove from the evidence list, or replace with verbatim category quotes | resolved: removed (ADR-022, cut 4 done) |
| O2 | Inclusion AND-rule: keep rigid, or reason-gated override to Include | resolved: reason-gated override to Include (ADR-023, cut 5 done) |
| O3 | Technik/Sozial to Gegenstand/Perspektive | resolved: renamed (cut 6 done) |
| O4 | Thin-text papers: block, warn, or load raw local text | partial: warn + screenable entry done; raw local text is P2 (cut 7) |
| O5 | Decisions file: one shared file, or one per person | resolved: one file per reviewer (operator decision 2026-07-03, confirming the ADR-021 default) |

All seven cuts are built and on the branch: cuts 1 to 6 complete (O1 and O3 resolved; O2 resolved by ADR-023) and the warn-and-entry half of 7 done, the raw-local-text half remaining as the larger P2/ADR-013 work. The Stage A redesign is closed. O5 was decided on 2026-07-03: one decisions file per reviewer, confirming the ADR-021 default; no gate waits on the operator.

## Stage R: The first-round pass through PRISM and its evaluation

The demonstrable core of the project: the PRISMA methodology executed on exactly this review's data and shown in the frontend. R1 and R2 are data work and can start immediately, in parallel with Stage A; R3 needs the deployed tool (after P0) and doubles as its hardest usability test; R4 and R5 close the loop. Stage B later reuses this machinery for the update.

Shaping decisions (taken 2026-06-09): replay plus interactive agent pass; knowledge-document category evidence enters the replay as clearly labelled machine-extracted evidence, separate from reviewer evidence; the record is published on the Companion. Claim line: the first review round (the full corpus) is carried through PRISM as the first real pass and reported honestly, with the items unrepairable in retrospect named (the corpus papers without a human decision plus one unresolved pairing discrepancy; the missing pre-specified protocol M1). The same gate is enforced for the update (Stage B). The follow-up paper tells exactly this two-round story.

Status (2026-06-09): the first-round record is drafted ahead of a committed replay, every count flagged as a hand recount pending a scripted replay. A committed replay must supersede these counts, by a human-checked path, before the record is published on the Companion (R5). Update (2026-06-21): the residual pairing discrepancy is resolved (a stray Has_HA flag on `2YS85B49` in `papers_full.csv`, a key absent from the human CSV, no missing human decision); the full FlowModel generation (R4) still supersedes the hand-drafted counts before R5.

### V: Claim verification (added 2026-06-09 after the meta review)

Two claims the project leans on were asserted, not verified; both must be checked, by a human-checked path, before they may carry anything.

- V1, the benchmark check: the interpretation changes. Most of the LLM-include/human-exclude papers are human exclusions for Duplicate, No full text, or Wrong publication type, criteria a one-paper-at-a-time LLM cannot see; on the content-only subset the include rates converge and agreement rises. The README's prevalence-artifact framing is backwards, agreement is genuinely near chance. "Sonnet+KD best condition" flips under the content-only sensitivity. No inter-human reliability baseline exists. The figures live in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion.
- V2, methodological novelty: claim holds partially. Separate advisory AI records are established practice (EPPI-Reviewer, Nested Knowledge, DistillerSR); novel are the generated trAIce R1 flow artifact, session-derived disclosure generation, and the retrospective trAIce rendering. trAIce is a proposal (Holst et al. 2025, JMIR AI), RAISE is Cochrane-carried (Flemyng et al. 2025).

Consequence ledger (binding for R4 and the paper): the divergence must be reported decomposed (as illustration, not as a finding) (workflow-criteria disagreement vs content disagreement), with the agreement metrics, category-level breakdown, and the content-only sensitivity; the inclusion-bias claim survives only for the KD-input condition. The contribution claim is conformance by construction at the report-artifact level plus retrospective rendering, not AI-human separation as such. Corrections queued into P6: the README Byrt sentence and the Sonnet+KD best-condition qualifier. Tool implication for the agreement panel: report content-only agreement alongside the full matrix, since recorded exclusion reasons make the decomposition possible.

### R1: Data completeness audit

- Map every PRISMA 2020 phase and every trAIce item to its source in the repo: identification by source (deep research, manual, Zotero-only), duplicate handling, the dual screening tracks, the included sets.
- Name the holes explicitly: papers without a human decision, the non-auditable acquisition steps (the acquisition claims that carry no audit trail), no pre-registered protocol (M1), papers without any text.
- Output: a machine-readable conformance map (per item: reconstructable, partial, missing, with source path), the data behind the checklist surface and the evaluation in R4.

Done when: every checklist item points at data or at a named gap.

Status (2026-06-30): the per-item map is drafted as [[conformance-map]], the full PRISMA 2020 27-item checklist and all 17 trAIce items plus RAISE, each with status (reconstructable, partial, gap, N/A) and a source path, the named gaps consolidated (no round-1 protocol M1 above all). The count-bearing items are marked reconstructable; the committed R2 replay still has to supersede any hand recount before R4. A machine-readable emission for R4 is derived from the map when R4 builds the record bundle.

### R2: Replay seed completion

- A script builds the full retrospective FlowModel from the actual files (identification, duplicates, screening with the AI/human split, included), not hand-entered; the seed reproduces the canonical benchmark (kappa and confusion matrix as held in the offline benchmark data) as self-test, by a human-checked path.
- Machine-extracted evidence: the Kategorie-Evidenz quotes from the knowledge documents are imported per paper and category as a separate, labelled provenance class (new ADR; schema field distinct from reviewer evidence; rendered visually distinct; never counted as reviewer Belege).

Status (2026-06-21): the provenance-class half is built and verified (M3, ADR-016). The reading column now splits the served document into a paper layer and a machine-extraction layer (`splitDocLayers`), a Volltext / KI-Extraktion toggle switches between them, and a Beleg pinned from the KI-Extraktion layer carries `origin: ai` and never sets `work.cats`, so AI-sourced text cannot enter the binding decision. Headless tests cover the split and the binding separation; the boundary lands cleanly on all served documents.

Update (2026-06-21, Session 17): the residual pairing discrepancy is resolved (the stray Has_HA flag on `2YS85B49`, no missing human decision). A committed, human-checked replay that re-pairs the raw CSVs and reproduces the canonical matrix, the content-only sensitivity, and that resolution still has to be (re)built; the figures it would assert live in the data (`generated/benchmark-results/`, `docs/data/`), not in this plan. Reversed since (ADR-022, 2026-06-30): the ADR-018 machine-evidence preload (`injectMachineEvidence` from `docs/data/machine_evidence.json`) was removed; the loaded snippets were whole-paper reasoning duplicated verbatim across categories, not per-category quotes, so the per-category structure was fabricated. The machine assessment stays in the collapsed KI-Vorschlag, and the R2 goal of a real per-category provenance class still needs a verified quote-to-category mapping the data does not yet carry. The generator part and `machine_evidence.json` were deleted in the same audit-driven cleanup.

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
- Pipeline the new papers: PDF to `generated/markdown_clean/` (raw, unpublished), knowledge documents where wanted, rebuild the full-text index and the raw-text manifest.
- The colleagues screen the new papers in PRISM, the binding surface (this time with a pre-specified protocol, enforced vocabulary, and a reviewer column); a batch captured in Excel enters over the P3 import seam; evidence grounding happens in PRISM (machine evidence, agent pass, human verification of samples); the flow diagram shows the update cycle with the AI/human split.

Done when: every new paper has a binding human decision with evidence, recorded text source, and a sibling AI decision; the update is reproducible from the repo alone.

Status (2026-06-09): the pre-registration protocol is [[update-protocol]] (finalized from the round-1 draft), with paste-ready prompts per lane and two Claude Code rehearsal runs in `corpus/deep-research/update-rehearsal/`; it is committed before any round 2 search executes. Open inside it: whether both reviewers screen the full batch or a split, and whether the optional Claude Code lane L5 runs.

### B3: Reconciliation and the PRISMA record

- Reconcile divergent human decisions from the per-reviewer files (Daten & Sync panel); the consensus decision and the process are recorded (PRISMA-trAIce M8).
- Export the complete PRISMA record as one bundle with the Stage R machinery (R2, R4), now over the updated corpus: flow SVG, agreement metrics, both filled checklists, disclosure text, decision-log CSV; the bundle lives in the repo.
- The paper's methods and disclosure sections are generated from the bundle, then edited by the authors; a human-checked integrity pass checks the final paper text against the repository.

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

## Decided questions (the former simulation ledger)

These decisions were first simulated on 2026-06-09 to avoid blocking on external feedback. On 2026-07-03, after the stakeholder meeting of 2026-07-01, the operator retired the simulation-and-ratification mechanism entirely and fixed every row as a project decision; the project builds on them without a waiting state. The one revision against the simulated ledger is the screening mode (both reviewers screen everything, see below). Provenance of the simulation phase lives in the Git history and [[journal]].

### Analysis fields (the [[update-protocol]] TP4 decisions)

| # | Decision | Outcome | Rationale |
|---|---|---|---|
| 1 | Sub-question set | SQ1 to SQ3 confirmed; the gap map (SQ3) serves both the follow-up paper and the Fair Bench preparation | producing it once for two uses matches the programme economy |
| 2 | Field set, AN_Harm_Types | seven fields confirmed; AN_Harm_Types kept optional | the highest-burden field; SQ2 survives at reduced resolution without it |
| 3 | Encoding | semicolon multi-select | binary columns per code would make the working sheet unusable; the bridge validates either way |
| 4 | Retro-coding scope | staged: update batch first, then retro-code round-1 includes after the pilot stabilizes the definitions | avoids doubling the workload before the field definitions are proven |
| 5 | Coding setup | single human coder per paper, plus the advisory LLM track, plus a double-coded human-human overlap sample | full dual coding is unrealistic for two busy academics; the overlap sample closes the missing inter-human baseline at bounded cost |
| 6 | Vocabulary | Role_Persona promotion kept; AN_Population boundary rules added; Intersectional coded additively; Other_Axis stays | resolves the three vague-field findings; additive intersectionality preserves per-axis frequencies |
| 7 | Pilot | stratified pilot on a small sample; revise a field when coders flag ambiguity on more than roughly a quarter of papers | concrete enough to run, loose enough to revise |
| 8 | Studientyp | confirmed, existing column, vocabulary-enforced, no duplicate | no argument against it surfaced |

### Round-2 protocol (the [[update-protocol]] decisions)

| Decision | Outcome | Rationale |
|---|---|---|
| Screening mode | both reviewers screen the full batch independently (decided 2026-07-03, revising the simulated split-plus-overlap); inter-human agreement is computed over the entire double-screened set | the full double screening yields the inter-human baseline over everything and needs no split logic anywhere |
| Claude Code lane L5 | runs as a documented fifth lane | the rehearsal runs showed it works; an extra documented lane strengthens the multi-system design |
| Prompt provenance | cite `corpus/deep-research/literature-review-prompt.md` as the documented template, with the loss of the instantiated round-1 prompt stated as a known gap | settled by the submitted paper's own citation practice |
| Reviewer identifiers | neutral ids `reviewer-1` / `reviewer-2` repo-wide (avoids the R1 collision with the trAIce item id and the plan phase) | privacy-clean, PRISMA-sufficient, collision-free |
| Unclear decisions at import | imported as report items, not decisions; visible until resolved in Excel | the schema keeps two-valued decisions; Unclear is a work state |

### User-story validation (the stories in [[specification]])

The v4 core stories (read, search, pin) are confirmed in substance, with a role correction. ADR-019 makes in-tool screening the binding path; evidence pinning stays technically optional per decision (decided 2026-07-03), expected where a category is contested and at reconciliation, and the heavy in-tool reader during reconciliation is the review lead and technical lead. Record-an-exclusion is confirmed but lives in Excel; generate-record, produce-disclosure, verify-conformance, look-up-category, and understand-checklist are confirmed. The v3 blind and divergence stories are confirmed superseded. Share-a-session is dropped for round 2, since the Excel-plus-bridge path replaces session hand-off, and retained only as background for foreign reuse.

## Open items

- Filesystem housekeeping: the acquired PDFs still sit in the gitignored `pipeline/pdfs/` instead of the declared `generated/pdfs` (`config/defaults.yaml`); move or delete the leftover.
- Folder restructure executed 2026-06-30 (code into `src/`, generated data into `generated/`, deep-research into `corpus/`, assessment unified); see [[journal]] Session 24.

Resolved 2026-07-03: reviewer identity in public files (neutral ids `reviewer-1`/`reviewer-2` repo-wide, acceptable in a public repo); screening mode (both reviewers screen the full batch, see the decided questions above); O5 (one decisions file per reviewer, ADR-021 default confirmed as the decision); the [[conformance-map]] item 1 report reference (the Forum Wissenschaft paper is the external round-1 report of record, marked as outside the repo).
