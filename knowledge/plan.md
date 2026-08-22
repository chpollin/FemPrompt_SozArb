---
title: Plan
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: active
language: en
version: "0.5"
created: 2026-06-09
updated: 2026-08-22
authors: [Christopher Pollin]
generated-with: Claude Code
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
related: [specification, data, journal, update-protocol]
---

Phased plan for completing the whole project: PRISM v1.0 (Stage A), the first-round pass of the existing review data through PRISM and its evaluation (Stage R, the demonstrable core), the real review cycle through the tool (Stage B), and closure plus reuse (Stage C). This is a process document; it is updated as phases close (mark done with date), and decisions made along the way go into [[specification]] as ADRs, not here.

## Current operative state (2026-08-22)

PRISM now has one editor workspace, a one-time reviewer-key and repository-folder setup, and one disk action per complete paper. Paper evidence is required for every positive category. Include records contain their complete analysis before the single write. Earlier expert and model judgements remain unavailable until the independent record is saved; agent trial mode cannot expose them. Browser recovery data and repository files reconcile per paper by timestamp and ambiguous or malformed file states block writes. The supported-browser pilot exercises the editor, persistence, failure recovery, direct links, acceptance mode, isolated agent trials, and responsive layout. Only the native browser permission dialogue remains a manual environment check.

The canonical round-one replay is `src/replay/replay_round1.py`; the duplicate implementation under `src/assess/` has been retired. The ten-paper `ar2` agent result is stored in the production data as a provisional technical acceptance. Its content and the pilot publication-type rule still require methodological ratification before the track becomes a binding research judgement. The historical phase sections below retain decision provenance; this operative state supersedes their older implementation-status sentences where they differ.

## Zielbild (what "done" means)

The tool is not the goal; the goal is a review whose every decision is auditable, demonstrated on this project's own data. The project is finished when four things are true:

1. **The review is carried through PRISM, and only then complete.** All of the review's dual-track data (the full corpus, human decisions, LLM assessments, divergences, category evidence) passes through PRISM into a PRISMA 2020 plus trAIce record, public on the Evidence Companion, together with an honest conformance evaluation, which items the recorded data satisfies, which only partially, which not at all. The items unrepairable in retrospect (the absent pre-registered protocol above all) are named, not hidden; they show what epistemic infrastructure must record from the start.
2. **The instrument is the binding screening surface.** Per ADR-019 the colleagues screen in PRISM, where the more precise PRISMA steps happen, the screening decision, evidence grounding, flow, agreement, checklist, disclosure, and record. The Excel import bridge stays only as an entry seam for a batch captured elsewhere. Every category can point at the words that justify it, every AI involvement is disclosed, and the human decision is always the binding record.
3. **The cycle is repeatable.** The planned literature update (same versioned deep-research prompts, new batch, dual assessment, reconciliation) is executed inside the tool with the same record machinery. Reproducibility is proven by execution, not asserted.
4. **The infrastructure outlives the case.** The paper and the Evidence Companion publish the review; the repo documents how a third party sets up the same instrument for a different review (own categories, own corpus). That cashes out the project's claim, epistemic infrastructure as practice, beyond the single study.

Research chain and priority (decided 2026-06-09): the primary product is the **working instrument**. The chain runs: tool, then the updated, methodologically grounded corpus (Stage B), then the analysis of how prompt engineering must adapt for social work, gender, and bias contexts. A follow-up paper describes the extended review's results and the method; the Forum Wissenschaft paper is its precursor. When effort competes, colleague usability and the update cycle win over Companion polish; the record machinery serves the follow-up paper's methods section.

Narrative register (decided 2026-06-09): the project describes the workflow and how a large language model is used to build it out. It makes no efficiency or cost-benefit claims. Claims discipline: any empirical or novelty claim that reaches a paper, the Companion, or a report must be either recomputed from the raw data or verified against published sources, and no AI-generated figure may be presented as human-checked.

## Shaping decisions (taken 2026-06-09)

1. **Reading text: raw full text, served locally.** `src/publish/build_fulltext.py` produces the gitignored `docs/data/fulltext/` layer from the Docling conversions. A local server in the clone can serve that layer; the public Pages site falls back to the abstract because the copyrighted full texts are excluded from publication. Every decision records the source actually read.
2. **Primary collaborator path: local clone plus GitHub Desktop.** Each reviewing colleague works in a local clone, enters a short personal key once, connects the repository root, and writes only the corresponding reviewer file. GitHub Desktop handles commit, pull, and push. Historical import and export functions remain operator utilities outside the daily editor.
3. **Testing: committed unit, browser, and data checks.** The jsdom and Python suites verify logic and publication paths. A pinned Chromium pilot drives the visible workflow with faithful filesystem handles; the native folder-permission dialogue is the remaining manual check.
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

Status (2026-07-03): steps 1 and 2 are built as the committed replay (`src/replay/replay_round1.py`). It re-pairs the raw CSVs by Zotero_Key, separates the workflow-criteria exclusions for the content-only subset, computes the metric set per track and per category with the 2x2 content-only sensitivity, asserts the `2YS85B49` resolution, and reproduces the canonical `generated/benchmark-results/agreement_metrics.json` as a self-test before writing `generated/benchmark-results/replay/`. The human-checked path is the reviewed script plus its self-test; an independent re-derivation by a second person remains open. Step 3, the analysis write-up as the licensed source for the paper, is [[analysis-divergence]] (2026-07-21), written from the replay outputs; the paper lane carries it and this merge brings it in. The step 4 corrections are applied in `README.md`. The numbers themselves live in the data and the Evidence Companion, never in this plan.

### TP4 work plan: operationalizing the analysis question

1. A structured working session turns "how must prompt engineering adapt for social work, gender, and bias" into answerable sub-questions (with the colleagues where possible).
2. Derive candidate capture fields from the sub-questions (for instance: prompt techniques discussed, bias types addressed, intervention or mitigation type, evidence type, population). Draft as a schema extension next to the ten categories.
3. Pilot: code a small stratified sample of already-included papers with the draft fields; measure answerability (fill rate, ambiguity notes); revise definitions.
4. Freeze: the extension goes into `categories.yaml` and the PRISM analysis panel; the documented Excel exchange shape mirrors it.

Verification: the pilot shows the fields are answerable from the texts. Validation: the colleagues confirm the fields capture what the analysis needs, before the schema freeze. Done when: `categories.yaml` and PRISM carry the same closed fields and complete Includes cannot be saved without them. Any future external analysis importer must validate the same contract before use.

Status: the analysis design is frozen in `assessment/categories.yaml` v1.3 and rendered from `docs/data/analysis_fields.json`. PRISM enforces complete analysis capture before an Include record can be saved. Substantive human validation of the coding design remains part of the review work.

## Programme verification and validation matrix

Verification means technically correct (automated or recomputed wherever possible); validation means it meets the need of the named humans. Nothing outward-facing ships without both.

| TP | Verification | Validation | Result criterion |
|---|---|---|---|
| TP1 Tool | committed harness green from clean clone; node checks; agent click-tests S1 to S6 | Excel round-trip with a real export; colleagues' workflow untouched | established workflow flows losslessly through the bridge |
| TP2 Retro-record | the replay reproduces the canonical benchmark by a human-checked path; every conformance item sourced | human review of the record page before publishing | citable record page live on the Companion |
| TP3 Divergence | all figures from committed script output; independent, human-checked re-derivation; sensitivity analyses documented | co-authors accept the decomposed framing | paper-ready analysis document, every number licensed |
| TP4 Analysis fields | pilot coding shows fields answerable | colleagues confirm fields serve the analysis | schema frozen before update screening |
| TP5 Update | protocol and dated amendments reflect the actual operation order without retroactive prospectivity claims; converter validation reports; flow reconciles with decision log | reconciliation of divergences with the reviewers | updated corpus with complete audit trail |
| TP6 Paper/FFG | paper-integrity check against the repo before submission; claims only as licensed by a human-checked recomputation or published source | co-author review; venue peer review | submission with generated, verifiable methods section |
| TP7 Reuse | third-party dry run from documentation alone | an external person succeeds without help | documented setup path |

## Promptotyping operating loop

Every iteration in every stage follows the same cycle, and the documents are the interface between sessions; no session relies on chat memory.

1. **Knowledge first.** The change is specified before code: requirement or ADR in [[specification]], schema in [[data]], surface in [[specification]], scenario in [[specification]].
2. **Build.** One Claude Code session implements against those documents.
3. **Verify.** The committed harness runs green, plus the affected click-test scenarios (S1 to S6); what neither covers goes on the manual checklist.
4. **Record.** Journal entry with decisions, results, and learnings; the plan phase is marked done with date.

The human role is the critical expert in the loop: decisions with methodological or outward-facing consequences are taken by the human and recorded as ADRs. The reviewing colleagues use PRISM and GitHub Desktop; their path requires no terminal and no access to the knowledge base.

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

Note (2026-08-21): the raw local text half was built by ADR-025; the `text_source` half is built by ADR-027 (schema 0.3, decision-log column, per-source disclosure counts). Full texts come from the served manifest of ADR-025, with the recorded values `raw`, `abstract`, `none`. The connect target is the repository root, so the folder picker may be pointed there and the tool resolves `docs/data/screening/` below it; this is the one part of the paper lane's P2 design that was ported and holds here. The `kd` value does not occur since ADR-016 made the knowledge document the AI layer. P2 is closed except for the manual File System Access checklist.

Superseded record from the paper lane (status 2026-07-03): P2 was built there as ADR-024, reading the raw texts from `generated/markdown_clean/` of the connected clone, computing the paper-to-rawfile mapping in the browser by title prefix with year and longest-prefix tiebreaks instead of emitting a manifest from `build_screening_index.py`, keeping the reviewer schema at 0.2 as an additive change, and recording the values `raw`, `knowledge_doc`, `abstract`, `none`; the KI-Extraktion layer kept coming from the knowledge document there, and human browser verification was still pending, since File System Access cannot be exercised headless. The operator decision of 2026-08-21 does not carry that design into this line. The implemented behaviour is the ADR-027 one described above, which records no `knowledge_doc` value and runs no title-prefix matching.

Note (2026-06-21): M3 (ADR-016) realized the layer-source provenance for the already-served document, splitting paper text from machine extraction and binding `origin` to the layer. That is distinct from P2, which still adds the raw Docling text from the local clone and the `text_source` field. P2 remains open; M3 closed the contamination path inside the served distillate.

### P3: Excel-to-PRISM import seam (reframed by ADR-019)

Under ADR-019 PRISM is the binding screening surface and the colleagues screen in the tool. The Excel import bridge stays as an entry and migration seam for a batch captured elsewhere, not as the canonical capture path. P3 therefore builds and validates that seam.

- Import bridge: ingest the established Excel/CSV export (the column shape of `assessment/human_assessment.csv`) as a human decision track; idempotent re-import; the import reports what was added, changed, and skipped.
- Validation at import, the data-hygiene lesson from R1: controlled-vocabulary check on exclusion reasons (the audit found the out-of-vocabulary value Other and empty cells), category completeness, duplicate Zotero keys; violations become a visible import report, never silent acceptance.
- The per-reviewer files are the persistence for in-tool screening, the binding capture path under ADR-019; a batch captured in Excel enters over the import seam.
- ADR-019 records this, superseding the colleague-capture rationale in ADR-001 and the simulated Excel-capture path; written into [[specification]].

Done when: an Excel export of the established format imports cleanly, the validation report flags vocabulary violations, and the imported track appears in flow, agreement, and record.

Status (2026-08-22): the operator-only converter supports the historical three-level CSV vocabulary and fails closed on unknown categories, decisions, exclusion reasons, or category-decision combinations that the current contract cannot represent. Imported positive categories still require Paper evidence and Include analysis in PRISM before they count as complete. The converter has no daily editor control and writes no reviewer file itself.

### P4: UI completion

- Keyboard-first screening (NFR-06): verify a full paper can be screened mouse-free; visible shortcut hints.
- Edge and empty states: the papers without any text, boilerplate abstracts, zero-hit searches, very long titles.
- The OKLCH/Plex design system applied consistently to the PRISMA & Report and Daten & Repo surfaces (the screening view already has it).
- Resolve the [[specification]] section 9 questions that survive v4 (chip layout under repetition, responsive three-pane behaviour at laptop widths); record outcomes in [[specification]].

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

Note (2026-08-21): S2 (screening pass), S4 (export/import round-trip, own file in the own profile and the colleague's file imported next to it through `--import-foreign`) and the reload half of S5 are automated as the pinned Playwright pilot (`tests/pilot/README.md`, `tests/browser/pilot.mjs`); the two simulated reviewer sessions and the reconciliation check are recorded in the Research Mission Control lane `social-ai · prism-pilot`. S1, S3, S6 and the record surface of S5 remain to be protocolled.

### P6: Knowledge-base consolidation

- One canonical number set (benchmark pairs, disagreements, confusion matrix, human decisions) lives in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion; `README.md`, [[plan]], and [[project]] point there and state findings qualitatively rather than restating figures; the superseded earlier figures survive only in journal and archive contexts.
- [[plan]]: new header date and a tool milestone (the PRISM build), milestone plan extended past 4 May.
- [[specification]]: superseded requirements (FR-03, FR-10, the placement of FR-05) marked inline instead of the trailing demotion paragraph; the v3 module descriptions pruned to v4 reality (genesis stays in [[journal]] and [[specification]]).
- `knowledge/INDEX.md` and root `README.md` updated (tool section, plan row, costs).

Done when: searching the retired numbers hits only journal and archive contexts.

### P7: Dress rehearsal

- One end-to-end run of the colleague quickstart by someone who is not the builder (or a strict fresh-profile simulation), fixing friction only, no new features.
- Prepare the demo with independent capture and two worked examples whose category pins and analysis coding can be reviewed directly.
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
| Reviewer enters a short lowercase-canonical key; Git commit authorship supplies personal provenance; the decisions file is written diff-able | ADR-021/028/029 | ADR-010, the implicit `reviewer1` default, and the fixed-role selector |
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

1. **One workspace** (done 2026-06-30; revised 2026-08-22) -- ADR-020/028/029. Screening is permanent. First-use setup captures the reviewer key and repository folder. The daily surface retains compact storage status and one disk action. Report and exchange functions have no editor-facing trigger.
2. **Reviewer files and Git provenance** (done 2026-06-30; revised 2026-08-22) -- ADR-021/028/029. The reviewer enters a short personal key that is canonicalised to lowercase; the tool writes one deterministic file per key. GitHub Desktop supplies commit authorship and handles all Git interaction. PRISM creates no commit message.
3. **Accessibility and keyboard flow** (done 2026-06-30) -- P4 NFR-06. Focus restoration after a paper switch, visible focus rings on inputs and controls, `aria-pressed` on category and exclusion chips, dialog semantics with focus move, Escape, and Tab trap for the pin menu, text equivalent for the colour-only status dot, slug and definition out of the chip's accessible name, keyboard-focus tooltips, darkened muted-text tokens for contrast.
4. **Machine evidence** (done 2026-06-30) -- ADR-022 supersedes ADR-018: removed from the evidence list; the model's per-paper reasoning stays only in the collapsed KI-Vorschlag.
5. **Inclusion logic** (done 2026-06-30) -- ADR-023 resolves O2: a reason-gated override to Include. The AND-rule derives a default; the human binds and may override it either way, an override to Include recording a free-text justification (RAISE P3). Grounded in [[standards]] and the RAISE primary source.
6. **Feminist language** (done 2026-06-30) -- O3: Technik/Sozial to Gegenstand/Perspektive on the work surface; the internal constants stay.
7. **Text substrate** (done 2026-08-22 except native permission confirmation) -- O4/P2/ADR-013/025/027. The tool opens on a usable Paper layer, prioritises manifest-backed full text, records `text_source`, and treats the LLM distillate as a post-decision reference. The automated pilot covers the directory-handle and write semantics; only the browser-owned permission dialogue remains manual.

### Open gates

| ID | Question | Status |
|---|---|---|
| O1 | Machine evidence: remove from the evidence list, or replace with verbatim category quotes | resolved: removed (ADR-022, cut 4 done) |
| O2 | Inclusion AND-rule: keep rigid, or reason-gated override to Include | resolved: reason-gated override to Include (ADR-023, cut 5 done) |
| O3 | Technik/Sozial to Gegenstand/Perspektive | resolved: renamed (cut 6 done) |
| O4 | Thin-text papers: block, warn, or load raw local text | resolved: manifest-backed full text, abstract fallback, explicit no-text state; native permission dialogue remains manual |
| O5 | Decisions file: one shared file, or one per person | resolved: one file per reviewer (operator decision 2026-07-03, confirming the ADR-021 default) |

All seven cuts are built. The Stage A redesign is closed at the implementation and automated-verification level. A native Chromium folder-permission confirmation and substantive reviewer validation remain external acceptance activities.

## Stage R: The first-round pass through PRISM and its evaluation

The demonstrable core of the project: the PRISMA methodology executed on exactly this review's data and shown in the frontend. R1 and R2 are data work and can start immediately, in parallel with Stage A; R3 needs the deployed tool (after P0) and doubles as its hardest usability test; R4 and R5 close the loop. Stage B later reuses this machinery for the update.

Shaping decisions (taken 2026-06-09): replay plus interactive agent pass; knowledge-document category evidence enters the replay as clearly labelled machine-extracted evidence, separate from reviewer evidence; the record is published on the Companion. Claim line: the first review round (the full corpus) is carried through PRISM as the first real pass and reported honestly, with the items unrepairable in retrospect named (the corpus papers without a human decision plus one unresolved pairing discrepancy; the missing pre-specified protocol M1). The same gate is enforced for the update (Stage B). The follow-up paper tells exactly this two-round story.

Status (2026-06-09): the first-round record is drafted ahead of a committed replay, every count flagged as a hand recount pending a scripted replay. A committed replay must supersede these counts, by a human-checked path, before the record is published on the Companion (R5). Update (2026-06-21): the residual pairing discrepancy is resolved (a stray Has_HA flag on `2YS85B49` in `papers_full.csv`, a key absent from the human CSV, no missing human decision); the full FlowModel generation (R4) still supersedes the hand-drafted counts before R5. Update (2026-07-03): the committed replay exists and passes its self-test (see R2); every hand recount is superseded, and R4 generates the record from its outputs.

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

Status (2026-06-30): the per-item map is drafted as [[standards]], the full PRISMA 2020 27-item checklist and all 17 trAIce items plus RAISE, each with status (reconstructable, partial, gap, N/A) and a source path, the named gaps consolidated (no round-1 protocol M1 above all). The count-bearing items are marked reconstructable; the committed R2 replay (2026-07-03, `src/replay/replay_round1.py`) supersedes the hand recounts. A machine-readable emission for R4 is derived from the map when R4 builds the record bundle.

### R2: Replay seed completion

- A script builds the full retrospective FlowModel from the actual files (identification, duplicates, screening with the AI/human split, included), not hand-entered; the seed reproduces the canonical benchmark (kappa and confusion matrix as held in the offline benchmark data) as self-test, by a human-checked path.
- Machine-extracted evidence: the Kategorie-Evidenz quotes from the knowledge documents are imported per paper and category as a separate, labelled provenance class (new ADR; schema field distinct from reviewer evidence; rendered visually distinct; never counted as reviewer Belege).

Status (revised 2026-08-22): source provenance is built and verified (M3, ADR-016/028/029/030). The reading column separates the Paper layer from the generated knowledge-document distillation (`splitDocLayers`). The interface labels the latter `LLM-Wissensdestillat`. A pin from that layer carries `source_layer: llm_distillate`, never sets a category, and cannot satisfy the Paper-evidence gate. The separate `actor` field identifies human or agent review work.

Update (2026-06-21, Session 17): the residual pairing discrepancy is resolved (the stray Has_HA flag on `2YS85B49`, no missing human decision). A committed, human-checked replay that re-pairs the raw CSVs and reproduces the canonical matrix, the content-only sensitivity, and that resolution still has to be (re)built; the figures it would assert live in the data (`generated/benchmark-results/`, `docs/data/`), not in this plan. Reversed since (ADR-022, 2026-06-30): the ADR-018 machine-evidence preload (`injectMachineEvidence` from `docs/data/machine_evidence.json`) was removed; the loaded snippets were whole-paper reasoning duplicated verbatim across categories, not per-category quotes, so the per-category structure was fabricated. The machine assessment stays in the collapsed KI-Vorschlag, and the R2 goal of a real per-category provenance class still needs a verified quote-to-category mapping the data does not yet carry. The generator part and `machine_evidence.json` were deleted in the same audit-driven cleanup.

Update (2026-07-03): the committed replay exists (`src/replay/replay_round1.py`, documented in `src/replay/README.md`, outputs `flow_model.json` and `agreement_replay.json` under `generated/benchmark-results/replay/`). It rebuilds the retrospective FlowModel from the actual files, re-pairs by Zotero_Key, and passes its self-test against the canonical `agreement_metrics.json`; the V-section consequence ledger (the content-only decomposition and the best-condition sensitivity) is thereby script-backed. Open inside R2: the per-category machine-evidence provenance class still needs a verified quote-to-category mapping (see the ADR-022 reversal above). R4 consumes the replay outputs for the record bundle.

Done when: the report surface shows the complete retrospective review from data alone.

### R3: Interactive agent screening pass

Status (technically completed 2026-08-22, substantive ratification open): a governed ten-paper agent run and blinded one-paper source-repair supplement produced authentic PRISM exports. Their deterministic integration is stored as `docs/data/screening/ar2.json` with `status: provisional_technical_acceptance`. The run manifest records the application- and prompt-snapshot provenance gaps; the verifier checks inputs, integration, records, evidence passages, analysis completeness, and full-text hashes. The publication-type rule and every judgement remain subject to substantive ratification.

- The agent screens the assigned sample in isolated PRISM trial mode: read, search, pin Paper evidence, code, decide, save, and export.
- Each run fixes its reviewer key, URL, paper list, prompt hash, rules, target paths, and model in `run.json`. Authentic exports preserve `actor: agent`; technical integration and substantive ratification are separate operations.
- The browser work supplies a friction protocol. Its findings feed back into the editor only after reproduction and tests.

Technically done when: the authentic export and report exist, the executable verifier passes, provenance gaps are named, and reproducible tool defects have regression tests. Substantively done when the run rule and paper judgements have been independently ratified.

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
- Validate the fixed independent-capture rule, the evidence and analysis gates, the inline storage workflow, and the sticky assessment actions with the colleagues' first real papers.

Done when: no ADR carries an unobserved effect; v1.1 is deployed and the colleagues have screened their first real papers with it.

### B2: Literature update executed inside the tool

- Re-run the versioned deep-research prompts (`prompts/CHANGELOG.md` governance); export RIS; deduplicate against the existing corpus.
- Run the offline LLM assessment on the new batch with the versioned assessment prompt and recorded parameters (existing pipeline scripts; this is the disclosure's input).
- Pipeline the new papers: PDF to `generated/markdown_clean/` (raw, unpublished), knowledge documents where wanted, rebuild the full-text index and the raw-text manifest.
- The colleagues screen the new papers in PRISM, the binding surface, under the versioned protocol and its dated amendments. PRISM enforces the vocabulary, reviewer key, Paper evidence, and complete Include analysis. The operator-only converter may migrate a historical screening batch; external analysis records require a separate validator that is not implemented. The flow diagram shows the update cycle with the AI/human split.

Done when: every new paper has a binding human decision with evidence, recorded text source, and a sibling AI decision; the update is reproducible from the repo alone.

Status (2026-08-22): [[update-protocol]] contains the initial protocol state and the dated amendments that followed the searches of 2026-07-17. Paste-ready prompts and the rehearsal runs live in `corpus/deep-research/update-rehearsal/`. The repository claims prospective status only for rules demonstrably fixed before the operation they govern. Both reviewers screening the full batch and the documented L5 run are resolved; E1, E5, and E7 remain ratifiable proposals for the later coding procedure.

### B3: Reconciliation and the PRISMA record

- Generate deterministic reconciliation input with the operator utility over the separate reviewer files. The human consensus process still needs a canonical writer (PRISMA-trAIce M8); no project-administration surface exists in the editor.
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
| Retrospective flow counts and agreement figures: pairing, FlowModel, metric reproduction | committed replay with self-test against the canonical benchmark | `src/replay/`, outputs in `generated/benchmark-results/replay/` |

### Autonomous verification measures (added 2026-07-03)

What the assistant verifies without a human in the loop, and what stays human-only. Every build strand passes an execution check and an independent adversarial diff review before it is committed; findings are fixed or recorded as open items.

- Execution checks, both exit-code-gated: the jsdom harness from the working tree (`node tests/run.mjs`) and the replay self-test (`python src/replay/replay_round1.py`).
- Count-bearing claims are asserted only through the replay self-test; a figure the replay does not reproduce is written nowhere.
- Label consistency: UI strings quoted in `docs/onboarding.html` and `docs/help.html` must match the literals in `docs/js/prisma.js`; checkable by grep.
- After the next deploy: the agent click-tests S1 to S6 against the deployed tool, and a persona walkthrough of the onboarding page (whether a non-technical reviewer can follow it end to end).
- Human-only: File System Access connect and write in a real browser, the colleague dry run (P7), and the R5 publish decision.

## What this plan does not cover

Writing the Forum Wissenschaft paper itself (the plan delivers its methods inputs: the PRISMA record and the disclosure, B3), a raw-text corpus search index, CI (revisit after P1), and v2 features beyond reuse extraction (live multi-reviewer merge, mobile screening).

## Decided questions (the former simulation ledger)

These decisions were first simulated on 2026-06-09 to avoid blocking on external feedback. Later ADRs and dated amendments made most rows binding, including the screening mode in which both reviewers screen everything. The status column is authoritative: E1, E5, and E7 remain simulated, ratifiable proposals until the operator confirms them; all other rows carry the binding status stated below. Provenance of the simulation phase lives in the Git history and [[journal]].

### Analysis fields (the [[update-protocol]] TP4 decisions)

Ratification status added 2026-07-18 from the memo walk-through; the memo itself is folded back here. "Ratifiziert-wie-simuliert" marks a row the real decisions confirm as simulated; "revidiert" marks a changed row with its reason; "durch realen Entscheid getragen" marks a row an ADR or amendment has already overtaken, so the meeting only confirms it. The paper lane recorded the same eight rows on 2026-07-03 as fixed project decisions, without a ratification column and with the same outcomes as the simulated ones below. Where that record and the walk-through disagree about whether a row is settled, the status column and the Ratification subsection below carry both readings.

| # | Decision | Simulated outcome | Rationale | Ratification status (2026-07-18) |
|---|---|---|---|---|
| 1 | Sub-question set | SQ1 to SQ3 confirmed; the gap map (SQ3) serves both the follow-up paper and the Fair Bench preparation | producing it once for two uses matches the programme economy | ratifiziert-wie-simuliert. No real decision contradicts; the freeze amendments ([[update-protocol]] B.1) and the pilot run throughout against SQ1 to SQ3, and `categories.yaml` v1.3 presupposes them. |
| 2 | Field set, AN_Harm_Types | seven fields confirmed; AN_Harm_Types kept optional | the highest-burden field; SQ2 survives at reduced resolution without it | ratifiziert, präzisiert durch realen Entscheid. The freeze sharpened the row: `AN_Harm_Types` is optional and binding only when `AN_Coding_Basis = Fulltext` (B.1 point 3, v1.3 `binding_when`). The simulated "optional" is the conservative subset of the real form. |
| 3 | Encoding | semicolon multi-select | binary columns per code would make the working sheet unusable | ratifiziert, durch realen Entscheid getragen. ADR-026 makes PRISM the capture surface with closed per-field selection; the semicolon-encoded Excel shape is the documented export and exchange representation ([[update-protocol]] D, B.1 point 7). An external analysis importer is not implemented. |
| 4 | Retro-coding scope | staged: update batch first, then retro-code round-1 includes after the pilot stabilizes the definitions | avoids doubling the workload before the field definitions are proven | simuliert, ratifikationspflichtig (E1). No ADR has made the staged retro-coding binding. It remains an open operator proposal. |
| 5 | Coding setup | single human coder per paper, plus the advisory LLM track, plus a double-coded human-human overlap sample | full dual coding is unrealistic for two busy academics; the overlap sample closes the missing inter-human baseline at bounded cost | teilweise revidiert, weiterhin ratifikationspflichtig (E1, E5). E6 defers the advisory LLM track. The proposed single-coder split and the human-human overlap remain simulated until operator ratification. |
| 6 | Vocabulary | Role_Persona promotion kept; AN_Population boundary rules added; Intersectional coded additively; Other_Axis stays | resolves the three vague-field findings; additive intersectionality preserves per-axis frequencies | ratifiziert, durch realen Entscheid getragen. The freeze (B.1 points 5, 6; v1.3) overtook all four parts: Role_Persona promotion kept, `Education_Professional` bounded to occupational and higher-education AI literacy, `Intersectional` requires two interacting axes, `Other_Axis` stays the catch value. The fine-grained SW-practice fields stay open for post-screening retro-coding (open decision 6, this part). |
| 7 | Pilot | stratified pilot on a small sample; revise a field when coders flag ambiguity on more than roughly a quarter of papers | concrete enough to run, loose enough to revise | Pilot durchgeführt; Schwellenregel simuliert und ratifikationspflichtig (E7). The eight-paper pilot is complete. The quarter threshold remains a proposed trigger and becomes binding only by operator ratification. |
| 8 | Studientyp | confirmed, existing column, vocabulary-enforced, no duplicate | no argument against it surfaced | ratifiziert, durch realen Entscheid getragen. The freeze makes `Studientyp` mandatory for Include and vocabulary-validated (v1.3, `study_types`), no duplicate; the review special rule (B.1 point 4) settles literature review and concept. No counter-argument surfaced. |

### Round-2 protocol (the [[update-protocol]] decisions)

| Decision | Simulated outcome | Rationale | Ratification status (2026-07-18) |
|---|---|---|---|
| Screening split | the two reviewers split the new batch with a double-screened overlap sample; the overlap yields the project's first inter-human agreement figures | workload-realistic; addresses the named baseline gap | verworfen fürs Screening, übertragen auf die Codierung. The 2026-07-17 amendment ([[update-protocol]] section 10 point 4) fixed full-batch screening: both reviewers screen the full batch. The split-plus-overlap principle lives on in the coding layer (E1, E5), which halves the coding load and draws the inter-human baseline from the overlap sample there, not at screening. The paper lane records the same outcome one step earlier, as a decision of 2026-07-03 revising the simulated split; only the date of record differs. |
| Claude Code lane L5 | runs as a documented fifth lane | the rehearsal runs showed it works; an extra documented lane strengthens the multi-system design | ratifiziert, durch realen Entscheid getragen. The 2026-07-17 amendment (section 10 point 5) confirms L5 ran (Claude Fable 5), eight records, five new distinct candidates, documented like the other lanes with its own Source_Tool. |
| Prompt provenance | cite `corpus/deep-research/literature-review-prompt.md` as the documented template, with the loss of the instantiated round-1 prompt stated as a known gap | settled by the submitted paper's own citation practice | ratifiziert, durch realen Entscheid getragen. The 2026-07-17 amendment (section 10 point 1) confirms provenance as the documented round-1 prompt, not an unprovable verbatim execution; the round-2 prompt is committed. |
| Reviewer identifiers | short personal keys for the PRISM screening files | compact and explicit at capture | revised and implemented by ADR-029. Keys are canonicalised to lowercase and determine `docs/data/screening/<key>.json`; Git authorship supplies personal provenance. |
| Unclear decisions in the tool and converter | PRISM derives Unclear from three-level categories; the operator converter preserves a consistent Unclear row and rejects inconsistent combinations | Unclear is a first-class screening result and remains uncoded until a binding Include | ratifiziert und implementiert durch ADR-024 plus den fail-closed Konverter. |

### User-story validation (the stories in [[specification]])

The v4 core stories (read, search, pin) are confirmed in substance. ADR-019 makes in-tool screening the binding path; ADR-028 requires a human pin for every selected category and complete analysis coding for Include. Record-an-exclusion lives in PRISM. Generate-record, produce-disclosure, verify-conformance, look-up-category, and understand-checklist remain confirmed. Sharing happens through per-reviewer files in the local Git workflow.

| Story statement | Simulated outcome | Ratification status (2026-07-18) |
|---|---|---|
| v4 core stories (read, search, pin) | confirmed in substance, with a role correction | ratifiziert-wie-simuliert. The adversarial frontend review and the interactive passes (2026-06-30, Stage A revision above) confirmed the core mechanic; the heavy in-tool reader at reconciliation is the review and technical lead. |
| Evidence pinning per decision vs bundled at reconciliation | one human pin for every selected category at capture | revised and implemented by ADR-028; the save gate enforces it. |
| Record-an-exclusion | confirmed, lives in Excel | revidiert (Erfassungsort PRISM). Overtaken by ADR-026: capture happens in PRISM; the Excel shape is a documented exchange format. The story stays valid; its capture site moves from Excel into the tool. |
| generate-record, produce-disclosure, verify-conformance, look-up-category, understand-checklist | confirmed | ratifiziert-wie-simuliert. Carried by the Stage R machinery and the [[standards]] deliverable; no counter-finding. |
| v3 blind and divergence stories | confirmed superseded | ratifiziert, durch realen Entscheid getragen. Confirms ADR-014 (divergence stays out of the tool) and the reframing line, divergence as illustration not empirical core. |
| Share-a-session | dropped for round 2, kept as background for foreign reuse | ratifiziert-wie-simuliert. Deterministic per-reviewer files under ADR-021 replace the session hand-off; the story stays a reference for foreign reuse (Stage C). |

### Ratification

The memo walk-through of 2026-07-18 compared this ledger with ADR-019 to ADR-026 and the dated amendments in [[update-protocol]]. Its per-row outcomes are folded into the status columns above. Those columns are the current authority: rows overtaken by an ADR or amendment are binding; E1, E5, and E7 remain explicitly simulated and require operator ratification before their overlap, retro-coding, or revision-threshold procedures become binding. Earlier prose that treated every simulated row as fixed is superseded by this rule.

## Open operator decisions and later research work

- Ratify or revise the provisional publication-type rule used by the `ar2` agent pilot, then conduct substantive review of its ten decisions before treating the track as binding research data.
- Confirm the native Chrome or Edge directory permission and physical write once in a disposable clone; the automated handle-level contract is complete.
- Grounding the research-vault: the anchor layer `00_representation/` was never built, so the distillates carry `migrated` and not `grounded`, and the deliverable layer `30_deliverable/` is empty. The binding stage-3 verification of the waitlist (`research-vault/waitlist.md`) is untouched and cannot be delegated to a machine. Both are preconditions of a vault that carries its own status claim; decide whether they are executed in this project's scope.
- Filesystem housekeeping: the acquired PDFs still sit in the gitignored `pipeline/pdfs/` instead of the declared `generated/pdfs` (`config/defaults.yaml`); move or delete the leftover.
- Folder restructure executed 2026-06-30 (code into `src/`, generated data into `generated/`, deep-research into `corpus/`, assessment unified); see [[journal]] Session 24.

Resolved 2026-08-21: the P2 race (a decision committed while the text was still loading recorded the synchronous source guess). The ADR-027 implementation gates the commit on the applied reading and re-evaluates it when the read completes; the browser pilot asserts the gate, its release and a delayed out-of-order load, and three mutations each fell exactly one of those assertions. The per-source counts of the disclosure can rely on `text_source`.

Resolved 2026-08-22: PRISM requires a short lowercase-canonical reviewer key; both reviewers screen the full batch; every selected category requires a human evidence pin; Include requires complete analysis coding; earlier assessments remain hidden until the independent decision is saved; first-use setup captures key and repository folder; the daily surface retains one disk action; GitHub Desktop handles commit and push.

Historical decision 2026-07-03, later revised by ADR-029: the fixed public ids `reviewer-1` and `reviewer-2` were initially accepted. The current editor instead uses short lowercase-canonical reviewer keys chosen at setup. Still operative from that decision: both reviewers screen the full batch; one decisions file exists per reviewer; the Forum Wissenschaft paper remains the external round-one report of record.
