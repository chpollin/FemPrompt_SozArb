---
title: Journal
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: complete
language: de
version: "0.2"
created: 2026-02-18
updated: 2026-06-29
authors: [Christopher Pollin]
generated-with: Claude Code
related: [INDEX, plan, specification, design, verification]
---

# Arbeitsjournal

Chronologisches Protokoll der Arbeitssitzungen mit Entscheidungen, Ergebnissen und Learnings.

---

## 2026-06-29 (Session 20): docs/ frontend refactor, shared EC helpers, security and stream robustness, const/let migration, chrome generator

### What changed

1. **Shared helpers consolidated on `window.EC`.** `catLabel`, `download`, `paperStatus`, `navigateToPaper`, `isHttpUrl` now have one definition; the concept graph got a local `endId`/`nodeById`, the category explorer a node-label index. Per-render listener rebinding was replaced by delegated handlers on the stable containers (corpus table, category detail, chat messages, paper modal), and the corpus tooltips compute their aggregates in one pass.
2. **Security and correctness.** `href` is validated against `^https?:` so a `javascript:` URL in the data can no longer execute; the interpolated `onclick` download was replaced by a delegated `data-action`; the chat's partial `escapeAttr` gave way to `EC.escapeHtml`; the chat stream got an AbortController, a timeout, a stop control, and state reset on a broken read, and its error path uses `insertAdjacentHTML`; PRISM's CSV quotes every cell, and reviewer import validates the structure and sanitizes the key before touching persistent state.
3. **Performance.** Streamed-markdown re-render is coalesced to one paint per frame, the graph frequency slider is debounced through `requestAnimationFrame`, and dead state (`_sizeScale`, a double divergence-toggle) was removed.
4. **Volatile numbers.** Tooltip, chat-prompt, and content-page figures are now derived from the data or stated qualitatively; the chat system prompt recomputes the benchmark marginals from the confusion matrix. The content pages (about, methoden, help, index meta) had their hard-coded rates, kappa, cost table, and counts removed outright per the operator's call, pointing to the Kategorien-Explorer instead.
5. **const/let migration.** Every `docs/js` module dropped `var`; a conservative codemod (default `let`, `const` only for a single, never-reassigned binding) handled the four edited-in-place files, the four rewritten files were done by hand, and decorative banner comments were stripped throughout. Verified against the PRISM test harness and per-module syntax checks; an independent pass found no `const` placed on a reassigned binding.
6. **CSS and index.** Focus-ring recolored to the teal primary, dead selectors and a print block that named non-existent classes fixed, the duplicate mobile chat media block merged; `index.html` dropped the unused Chart.js, deferred its libraries, and gave the view tabs `role`/`aria-controls`/`aria-selected` (the section `aria-labelledby` were dangling before).
7. **`scripts/build_pages.py`.** New generator holds the single source for the shared document head (favicon, font links, the common meta, FontAwesome and research.css), the footer on every page, and the content-subpage header (about, help, methoden, prisma, active state parameterized). `index.html` keeps its bespoke tab-and-stats in-body header and its own SEO and Open Graph metas; PRISM keeps its `noindex`, `prisma.css`, and repo-connection bar through per-page slots. The font load moved from an `@import` inside `research.css` to a `<link>` in each head, which also retired the double font load PRISM carried. The methoden category-name cells now reference the `--cat-*` tokens instead of repeating their hex.
8. **Verification.** A jsdom smoke harness for the Companion modules joined the PRISM pure-function harness under `npm test`, driving data load, the corpus table, delegated clicks, the category explorer, the chat UI, and the chat error path; the D3 graph and live streaming stay a browser check. An adversarial multi-agent audit over every changed code file then caught two regressions the smoke tests had missed, both in the new chat-stream handling: a real API error re-rendered the message list after appending its error banner and so wiped it, and an aborted partial answer was finalized without its `complete` flag and lost its citations on the next re-render. Both fixed, with a regression test left behind for the error banner.

### Decided (global working rules, the operator's)

- const by default, `let` when reassigned, `var` only for genuine function-scoped hoisting, with file consistency outranking the preference.
- Comments record the why, never the what; no banner art or decorative separators.
- A project `journal.md` is kept compact, precise, and conceptual, one entry per substantive session, written to read the same a month later.
- On the content pages, volatile numbers are removed rather than data-bound; the document head, header, and footer are deduplicated through a `scripts/` generator rather than a runtime inject or a build tool.
- For web and programming work, the operator's curated coding knowledge in the Obsidian vault (`Coding/`, indexed by Coding MOC) is consulted before writing code, so output follows those standards.

### Open items

- The Companion's cross-view coordination is a shared-object-with-getters (`window.EC`) plus direct navigation calls, not the operator's preferred central State Manager with `subscribe`/`setState`, an event bus, and URL-state serialization. Moving to that architecture, including shareable, citable URL state for filters and selections, is a larger separate piece, noted not started.
- The smoke harness covers the non-graph Companion paths; the D3 concept graph and live chat streaming are exercised only in a real browser.

---

## 2026-06-29 (Session 19): ADR-019, PRISM the binding screening gate, the documentation realigned

**Branch:** `refactor/knowledge-vault` (unpushed)

### What happened

1. **Round-one framing wrong and internally inconsistent.** Two audits over the knowledge base found that the documentation encoded the opposite of the operator's intent. Round one was described as a completed review rendered retrospectively, held as a read-only seeded case study with no conformance claim, while the colleagues' Excel was cast as the capture path and PRISM as a downstream PRISMA layer that ingests it. The requirements and the data model were built the other way, every screening decision captured in the tool as the binding record (FR-02, FR-04, FR-11 to FR-13, the `ScreeningRecord` in [[data]]). The "in-tool screening partially falsified" reading rested on a single unexecuted usage assumption inside the pending-ratification simulated decisions, not on an observed test.
2. **The operator ratified one direction.** Through two forks: PRISM is the binding screening surface and Excel is only an entry seam, not a co-equal capture path; and "everything goes through PRISMA" holds retroactively for round one, so the literature review counts complete only once all of its data has passed through PRISM.
3. **ADR-019 the anchor.** Recorded in [[specification]], it makes PRISM the binding screening gate, carries the first-round corpus through PRISM as a real pass (the Stage R replay seeds it, R3 and R5 are completion steps), demotes the Excel import bridge to an entry and migration seam, withdraws the falsification reading, and supersedes ADR-001's seeded-case-study framing together with the simulated Excel-capture path. PRISMA stays a reporting standard, not a conduct standard.
4. **Gate plus named gaps replaces no-conformance-for-round-one.** Conformance holds for everything the recorded data supports; the items unrepairable in retrospect stay named as permanent limits, the absent pre-registered protocol (PRISMA 2020 item 24, trAIce M1) above all, with the lost acquisition provenance, the papers with no served text, and the corpus papers without a human decision. Pre-specification cannot be created after the fact.
5. **Propagated across the documentation.** [[specification]] as the anchor, then [[verification]] part 2, [[plan]] (the Zielbild completion test, Stage R, the P3 seam, the retired simulated decisions), [[methods]], [[INDEX]], [[design]], [[data]], [[update-protocol]], the project `CLAUDE.md`, and the root `README.md`. [[standards]] needed no change, its per-item conformance map already named M1 as a gap and framed PRISMA as a reporting standard. A read-only verification pass over the whole set flagged the seed-dataset section in [[data]] still calling the corpus a read-only case study (fixed), and the same residue in FR-09 and the Data-I/O Datengrundlage of [[specification]] (fixed).
6. **The paper realigned too.** `paper/draft.md` (section 3.6) and `paper/outline.md` still described Excel as the capture path with PRISM downstream and cited the withdrawn falsification as a limitation. Aligned to ADR-019 with minimal edits, preserving the per-item conformance figures and the genuine proxy-written-user-stories limitation. The novelty contribution stays the retrospective trAIce rendering of an already-conducted review, which is reporting-side and unchanged by the gate.

### Open items

- The branch is unpushed; push and merge to `main` are the operator's call.
- The per-story validation verdicts in [[plan]] stay simulated until the stakeholder meeting ratifies them in person; the capture-locus question itself is settled, in-tool screening with Excel as the seam.
- No new code is required, the build already encodes in-tool capture. Forward work is unchanged, the Stage R5 publication and the round-2 update carried through the same gate.

### Follow-up, dead-reference sweep

A repo-wide reference inventory then ran against the actual files. The follow-up paper's whole provenance apparatus ([[draft]], [[outline]], the three style probes) cited three knowledge docs that the earlier consolidation had folded into [[verification]] (the empirical core, the conformance audit, and the novelty verification), plus an analysis-design and a simulation-ledger that had moved into [[update-protocol]] and [[plan]]. Every pointer was repointed to the consolidated file and each old section name remapped to the current Part or subsection of [[verification]], with an adversarial audit catching three claim-level routing errors (dedup and pipeline counts belong to 2.1, the divergence-not-error framing to 1.6) and four phantom anchors left by Oxford-comma and parenthetical citation forms. Two stray path errors were fixed in [[plan]] and [[specification]]. Left by design: the concept topic-tags (Obsidian links, not file refs), the journal's historical file pointers (rewriting them would falsify the record), and the forward-reference to the planned `analysis-divergence.md` (TP3). Two items surfaced but not changed, both content rather than references in the superseded [[outline]]: the 292-versus-291 record is described as an open discrepancy though [[verification]] 1.10 resolved it on 2026-06-21, and a "5 citing papers on Semantic Scholar" figure no longer has a home in [[verification]] after consolidation.

---

## 2026-06-29 (Session 18): refactor completeness, the R4/P1/R1 deliverables, trAIce 17, the no-self-description rule

**Branch:** `refactor/knowledge-vault` (unpushed)

### What happened

1. **Refactor completeness.** A second audit (a 15-document workflow) over the consolidated knowledge base found the residue the first pass missed: scheduling and meeting-date framing, remaining `lane` usages, volatile quantities still in prose, ten stale pointers to deleted files in `plan.md`, and colon-as-connector. All folded into the single refactor commit.
2. **Four follow-on deliverables, one commit each.** ADR-018 recorded in [[specification]] (the machine category-evidence layer shipped in code but undocumented). `benchmark/scripts/build_flow_model.py`, the committed generator that computes the retrospective FlowModel from the raw CSVs, self-verifies the canonical invariants, and supersedes the agent-recounted `docs/data/flow_model.json` (R4). Section G of the jsdom suite: export/import round-trip losslessness (FR-08), the reviewer schema 0.1 to 0.2 migration, the seed reproducing the benchmark marginals (FR-05), and an `injectMachineEvidence` test (P1). The R1 conformance map repointed onto the consolidated structure.
3. **trAIce item count corrected.** The checklist has 17 items (14 non-optional, 3 optional), confirmed against the trAIce single source of truth; the recurring "14" in [[standards]], [[specification]], [[design]], `prisma.js`, and the paper was the non-optional count mislabelled as the total.
4. **The no-self-description rule.** A document does not state what it omits, defers, or that material lives elsewhere; no "what is missing" or "was nicht reingehört" sections. Established in the global `CLAUDE.md` and the vault convention (which previously prescribed the opposite as "Negative Selbstdefinition"). About 25 instances across the FemPrompt docs are inventoried; the cut is pending.
5. **`reuse-setup.md` removed** (12 docs now). It documented a never-executed, self-admittedly buggy reuse path; the intent stays in [[plan]] Stage C3, the validated path gets written when reuse is run.

### Open items

- The branch is unpushed; push and merge to `main` are the operator's call.
- Pending style work: cut the inventoried "X is not here" instances; decide whether the "This document is/describes X" openers are reworked to lead with the subject.
- Project forward work: render the retrospective PRISMA record on the Companion (Stage R5, now unblocked by the scripted FlowModel and the conformance map); the raw full-text reading upgrade (P2); the divergence-finding sharpening (TP3).

---

## 2026-06-21 (Session 17): R2 replay executed, benchmark core reproduced by execution, 292-vs-291 resolved

**Branch:** `main` (this entry's milestone commit secures the unit)

### What happened

The benchmark core that V1 (`verification-empirical-core.md`) could only verify by execution-free hand counting was reproduced by running code, and the one discrepancy V1 left open is resolved. V1 had no shell channel; this session does.

1. **Re-pairing script executed.** `benchmark/scripts/verify_femprompt.py` (the adversarial recompute moved into the repo earlier) runs and reproduces every V1 figure exactly: the 291-pair confusion matrix 100/34/108/49, Cohen kappa 0.0561, PABAK 0.0241, kappa-max 0.5081, the content-only sensitivity (n=199, matrix 100/34/36/29, kappa 0.1940), and all four 2x2 conditions. The committed output `benchmark/results/recompute_verification.txt` matches the fresh run line for line.
2. **292-vs-291 resolved.** `papers_full.csv` flags 292 papers Has_HA=Yes; the surplus key `2YS85B49` is absent from `human_assessment.csv`. It is a stray metadata flag, not a missing human decision, so the 291 real pairings stand. This was the open item V1 named as "the first thing to check when it runs".
3. **Self-test added.** `benchmark/scripts/replay_selftest.py` is a regression guard, independent of the diagnostic script: it re-pairs the raw CSVs itself and asserts the canonical numbers plus the 292 resolution, exiting non-zero on any drift. PASS 18/18. This closes the replay-script self-test that R2 named as open.

### Verification

- `python replay_selftest.py` reports PASS 18/18, exit 0: row counts (303/142/161, 326/232/94), pairing (291/12/35), matrix 100/34/108/49, kappa 0.0561, po 0.5120, sensitivity (199, 100/34/36/29, kappa 0.1940), and the Has_HA surplus resolving to the single key 2YS85B49.
- `python verify_femprompt.py` output matches the committed `recompute_verification.txt`.

### Decisions

- The self-test re-implements the pairing and kappa independently rather than importing the diagnostic script. An adversarial recompute should not reuse the logic it guards, and two independent implementations agreeing on the number is the stronger statement.
- The numbers were verified, not changed. No raw CSV, no merge artifact, no documented figure was touched; the work makes the existing claim reproducible by execution, which the plan's claims discipline requires.

### Open items (next)

- Proactive R2: load the `## Kategorie-Evidenz` quotes as pre-filled `origin: ai` Belege (the provenance class and the binding exclusion are in place since M3).
- R4 record bundle generation supersedes the hand-drafted FlowModel counts before any Companion publication (R5).
- KI1 (synthesis level) and the disclosure kappa/matrix line stay operator gates.

---

## 2026-06-21 (Session 16): M3 built, the reading column now enforces the human/AI layer separation

**Branch:** `main` (this entry's milestone commit secures the unit)

### What happened

The reframed M3 from Session 15, built and verified . The contamination path the review session found is now closed in code, not just marked.

1. **Layer split.** `splitDocLayers(md)` separates the served knowledge document into its paper layer (Abstract, Key Concepts, Full Text) and its machine-extraction layer (Kernbefund, Forschungsfrage, Methodik, Hauptargumente, Kategorie-Evidenz, Assessment-Relevanz, Schlüsselreferenzen), cutting at the first `## Kernbefund` heading and pulling the boundary up over a repeated H1 title. Verified on all 226 served documents (a throwaway jsdom trace over the real corpus, boundary clean 226 of 226).
2. **Toggle and band.** The reading column gains a Volltext / KI-Extraktion toggle (`setReadMode`, `paintActiveLayer`, `updateLayerToggle`); the toggle appears only when a paper has an AI layer. The KI-Extraktion view shows a band marking it as non-verbatim, and the pin menu warns when a snippet comes from that layer.
3. **Binding separation.** `pinEvidence` takes an `origin` argument bound to the read layer. A paper-layer pin is `origin: human` and sets `work.cats`, the binding category. A KI-Extraktion-layer pin is `origin: ai`, is stored and rendered marked KI, but never sets `work.cats`, so AI-sourced text can never flip the derived human decision. This realizes ADR-003 (human binding, AI advisory) at the evidence level, and the woher that ADR-015 left open.

### Verification

- `node tests/run.mjs` reports PASS 73/73 (was 67/67): six new tests cover the split (paper keeps Full Text, AI layer holds Kernbefund and Kategorie-Evidenz, abstract-only yields no AI layer) and the binding separation (human pin sets the category, AI pin does not, AI evidence alone stays Exclude, both-human derives Include, AI Beleg stored and rendered KI yet advisory).
- Real-data trace: `splitDocLayers` lands the boundary cleanly on all 226 served knowledge documents (paper layer never contains Kernbefund, AI layer always holds Kernbefund and Kategorie-Evidenz). The scratch script was deleted, working tree clean.

### Decisions

- Origin reflects the source layer of the text, not who clicked. A human reading the AI extraction and pinning from it produces an `origin: ai` Beleg, because the text is machine-authored. This keeps AI output from being laundered into a clean human Beleg.
- The binding record is `work.cats`; only a paper-layer pin writes to it. AI evidence is visible and advisory but structurally excluded from the derived decision. ADR-016 records this.
- KI1 (synthesis level) and the disclosure kappa/matrix line stayed untouched, both are operator direction calls outside the boundary.

### Documentation sync (same session)

`specification.md` gained ADR-016 (layer split, origin bound to layer, binding separation) and ADR-015 now points to it. `data.md` updated the evidence shape and the coupling and surfacing rules to the layer-source semantics, and added the layer-split paragraph. `plan.md` R2 status records the provenance-class half as built (still open: proactive Kategorie-Evidenz preload, replay self-test); P2 got a note distinguishing it from M3. `tests/README.md` went to 73/73 with an M3 coverage bullet.

### Open items (next)

- Proactive R2: load the `## Kategorie-Evidenz` quotes as pre-filled `origin: ai` Belege in the same list; the provenance class and the binding exclusion are already in place.
- KI1 (synthesis level) at the operator, gating the synthesis surface.
- The trAIce disclosure kappa/matrix line stays or falls (operator).

---

## 2026-06-21 (Session 15): review session, the reading column fuses two epistemic layers, M3 reframed, distance to the overall goal

**Branch:** `main` (no code change; an architectural finding and an assessment, documentation only)

### What happened

A review session , triggered by a walkthrough of the screening surface. Verifying what the reading column actually renders surfaced a gap that reshapes the next milestone, and prompted an honest verdict on how far the work is from its overall goal.

1. **The reading column silently fuses verbatim text and AI extraction.** Verified against all 226 served knowledge docs (`docs/vault/Papers/*.md`): each is one document concatenating a paper layer (`## Abstract`, `## Key Concepts`, `## Full Text`) and an AI layer (`## Kernbefund`, `## Forschungsfrage`, `## Methodik`, `## Hauptargumente`, `## Kategorie-Evidenz` with `### Evidenz 1..5`, `## Assessment-Relevanz`, `## Schlüsselreferenzen`). `fetchPaperText` loads it and `renderMarkdown` dumps the whole thing into one scroll. There is no toggle and no boundary marker. A reviewer scrolls from the real paper straight into a machine summary with nothing separating them.
2. **The provenance gap this creates.** KI2 records who pinned a Beleg (human), not where the snippet came from. A Beleg lifted out of the `## Kategorie-Evidenz` (AI) section still renders as a clean Mensch pin. The separation the tool promises is now visibly marked but not enforced in the live flow, which is exactly the contamination path the project means to close.
3. **M3 reframed.** From "load machine-extracted Kategorie-Evidenz as AI-origin Belege" to "split the reading column into Volltext and KI-Extraktion, mark the boundary, and bind Beleg-Herkunft to the layer the snippet came from". Same R2 source material (`## Kategorie-Evidenz`), but the work now lands where the provenance promise is actually kept. Three concrete steps, ranked: a labelled boundary band at `## Kernbefund` (cheap), a Volltext / KI-Extraktion view toggle over the loaded document, and automatic `origin: ai` on snippets pinned from the AI layer. KI1-independent.

### Assessment: distance to the overall goal

The overall goal is an auditable instrument that runs a real FemPrompt screening pass with every decision backed by Kategorie-Evidenz, human and AI cleanly separated and disclosed, the result reproducible and published as the Companion. Verdict: the load-bearing foundation is reached (three surfaces, harness green 67/67, provenance plumbing as a stored field, import bridge under test), the overall goal is clearly not. Four things stand between here and there, the first only surfaced this session: the human/AI separation is not yet enforced in the reading flow (M3), the synthesis surface is unbuilt and gated on KI1, the kappa/matrix replay is asserted but not scriptable from real data, and no real screening pass, record bundle, or publication exists yet. The methodologically hardest part lies ahead, not behind it.

### Open at the operator

- M3 go (build the reframed reading-column split and provenance binding).
- KI1 (synthesis level), gating the synthesis surface.
- The trAIce disclosure kappa/matrix line, stays or falls with the comparison logic.

---

## 2026-06-21 (Session 14): two milestones, per-Beleg provenance and the import bridge under test

**Branch:** `main` (base `74dd183`; this entry's milestone commit secures both units)

### What happened

A milestone session . Two self-contained, verified units were built and secured; the headless harness went from 56 to 67 green.

1. **KI2, per-Beleg provenance (decided order item, now built).** Each Beleg records its origin as first-class data. `pinEvidence` stamps `origin: 'human'` on every reviewer pin; `evidenceListHtml` renders a neutral Mensch/KI marker per Beleg and defaults legacy Belege (no origin field) to human. The marker reuses the established human/ai identity hues (`--pt-human`/`--pt-ai`), same shape and weight for both, no valuation. This is the provenance plumbing the synthesis surface (KI1) needs: when human and AI evidence are brought together, each Beleg already carries where it came from. Today every Beleg in the list is a human pin, so the live change is the Mensch tag; the KI rendering is test-verified for when machine evidence (R2 Kategorie-Evidenz) feeds the same list. Files: `docs/js/prisma.js` (pinEvidence, evidenceListHtml, the `_test` exposure), `docs/css/prisma.css` (the neutral marker rules).
2. **The Excel-to-PRISM import bridge brought under the test harness.** `docs/js/prisma-import.js` builds the full data-hygiene validation report (out-of-vocabulary category/decision/exclusion-reason values, duplicate Zotero keys, Unclear rows, collision guard, idempotent re-import) and already exposed `window.__PRISMA_IMPORT_TEST__`, but the harness never loaded it: the auditability backbone of the R1 lesson was committed yet untested. `tests/run.mjs` and `tests/run-tests.html` now inject the module; seven tests lock the validation behaviour against crafted CSV fixtures (clean Include, out-of-vocab reason preserved verbatim, empty reason flagged, duplicate key skipped, Unclear skipped, idempotent re-import unchanged).

### Verification

- `node tests/run.mjs` reports PASS 67/67 (was 56/56): four KI2 provenance tests plus seven import-bridge tests, all headless jsdom. Green criterion met for both milestones.
- The KI2 marker is verified by render assertion, not by pixel screenshot: the shared Chrome window makes screenshots unreliable here (Session 13 learning), so the trace is the deterministic rendered markup `pt-evid-origin-human">Mensch` and `pt-evid-origin-ai">KI` asserted in the suite.

### Decisions

- Provenance is a stored field (`origin`) on each Beleg, not an inference from the render container, so it survives the future human/AI merge. Backward-compatible: legacy Belege without the field render as human.
- The marker is neutral by construction: identical shape and size for both origins, only the established identity hue differs, no better/worse styling.

### Documentation sync (same session)

After the build, the knowledge docs were aligned to the new code (the round's Doku-am-Code-nachziehen). `specification.md` gained ADR-015 (per-Beleg `origin` field, neutral marker, backward-compatible), and ADR-014's open line now points to it. `data.md` updated the evidence stored shape to `{ term, snippet, ts, origin }` with the provenance note and reconciled the "never written by the AI" line. `plan.md` P1 and P3 status lines were refreshed (harness committed and green 67/67; the import validation now under test, the browser S4 path still open). `tests/README.md` was updated (four injected scripts, PASS 67/67, the provenance and import-bridge coverage bullets).

### Open items (next)

- Milestone 3 (scoped, not built): machine-extracted Kategorie-Evidenz as AI-origin Belege (R2), feeding the same provenance-marked list; independent of KI1.
- KI1 (synthesis level) stays at the operator; it gates the synthesis surface, not the provenance plumbing, which is now ready for it.
- The trAIce disclosure kappa/matrix line stays or falls (operator); on fall, retire `computeMatrix`/`cohenKappa`/`kappaLabel` and their test.

---

## 2026-06-21 (Session 13): verified runnable, then synthesis over comparison, Git and comparison surfaces removed, design unified, consolidated to main

**Branch:** `feat/prisma-screening-tool` -> consolidated into `main` (verification at `1c1217a`, consolidation through `8f6580b`)

### What happened

A verification-and-direction session . The tool went from built-but-unverified to verified-runnable, then through three operator-driven direction changes that reshaped what the tool is, before the work was consolidated onto main.

1. **Verification.** The never-run test suite was started and brought green (56 of 56, headless jsdom). All three surfaces were exercised, the storage path including the export/import fallback was checked, and the absence of secret leaks confirmed (detail below). A critical assessment of the shipped frontend was written ([[design]]), and two real number errors were corrected (305 -> 303, recompute-backed).
2. **Git surface removed from the tool** (operator order, `21059ba`). The `git add/commit/push` hint block and the Git language left the Daten & Repo surface; "Git-based" left the page description; dead `.pt-git-hint` CSS was removed. The direct File System Access write stays: it lands the file in a GitHub Desktop working copy, where versioning now happens outside the tool. The internal `commit()` (records a decision, not a Git commit) is untouched.
3. **Human-AI comparison surface removed** (operator order: synthesis over comparison, `ba4db2f`). The leitmotif changed: human and AI assessment are never to be compared but always brought together into a synthesis. Removed from the working tool: the Mensch-KI-Uebereinstimmung section, the confusion-matrix view, the kappa display, the divergence filter, the reviewer reconciliation table, and the comparison intros and footer. Kept: the flow, the checklist, the disclosure, and the pure functions `computeMatrix`/`cohenKappa`/`kappaLabel`, because the disclosure line (PRISMA-trAIce M9) and the tests still use them. The divergence finding stays the property of the paper and the Evidence Companion, not the screening UI.
4. **Design unified across all pages** (`c42bcc5`). The tool page (`docs/prisma.html`) was lifted onto the Companion design: white background, the rainbow accent bar under the header, the shared header with title and navigation, the shared footer, Font Awesome. The navigation is now identical on all five pages (the PRISM link everywhere, one label). The slim tool header and dead `pt-app-header` CSS are gone. Tool logic and tests untouched.
5. **Consolidated to main** (`5a09be4`, `8f6580b`). On the operator's instruction, `feat/prisma-screening-tool` was fast-forwarded into `main` and pushed; work continues on main from here, no own branches (the post-refactor rule). The knowledge docs were synced to the new reality as ADR-014 (`5a09be4`: specification, design, README, data, frontend-assessment, plan, the screening README), keeping the research findings intact and only correcting the tool-describing parts. The `prisma.js` file header and a stale section comment were aligned to ADR-014 (`8f6580b`, comment-only). Tests stay green on main.

### Verification (detail, HEAD `1c1217a`)

- Test foundation verified against a real run: `npm test` (headless jsdom harness `tests/run.mjs`) reports PASS 56/56. The suite written in the 2026-06-09 wave, first shipped unrun, is now proven runnable, not just commit-claimed.
- All three surfaces clicked through in the browser (local static server on `docs/`, prisma.html). The app loads cleanly: the console reports `326 papers loaded` and `initialized, 326 papers, FS supported`, no errors.
  - **Screening with Beleg pinning:** full-text search finds hits, "Treffer anheften" opens the category menu, `pinEvidence` sets category plus Beleg (term, snippet, timestamp). Derivation confirmed: >=1 Technik AND >=1 Sozial flips the derived decision from Exclude to Include.
  - **PRISMA & Report:** the PRISMA-2020 flow (n=326, separate AI/human tracks, advisory/binding), the confusion matrix 100/34/108/49 with kappa=0.056 at n=291, ten category kappas, the 14-item trAIce checklist (Holst et al. 2025), the AI disclosure with Markdown preview carrying the canonical kappa and matrix. The numbers match `knowledge/verification-empirical-core.md` and the README. The matrix/kappa view seen here was the comparison surface later removed in `ba4db2f`; the disclosure line keeps the numbers.
  - **Daten & Repo:** the File System Access workflow (connect `docs/data/screening/`, one JSON per reviewer, schema 0.2), the export/import fallback for all browsers, the reviewer reconciliation table, the Excel-CSV bridge with a check report and collision guard. The reconciliation table and the Git workflow seen here were later removed in `21059ba`/`ba4db2f`.
- Storage and sync path including fallback verified: a decision is written to localStorage (`femprompt-prisma-state/0.2`) and survives a reload (done counter 1/326, Beleg kept). Connection status stays "nicht mit Repo verbunden", so the localStorage fallback applies. The export payload `femprompt-prisma-reviewer/0.2` checked well-formed via `__PRISMA_TEST__.reviewerPayload`. The test decision was removed afterwards, demo state pristine (0/326).
- No secret leak: `docs/js/config.local.js` (Gemini key) and `.env` are gitignored and never committed; the key is absent from history. The PRISM files do not reference the key, only `docs/index.html` loads `config.local.js` with `onerror=""` (graceful), so the tool deploys safely without a key.

### Operator decisions recorded this session

- Publication, merge strategy, and project management are out of scope for this work.
- Leitmotif: synthesis, not comparison.
- Standing rule: self-commit at every milestone and push to main without asking.
- Evidence provenance (KI2): each Beleg stays marked as AI- or human-sourced, a plain provenance tag without judgement.
- Open at the operator (KI1): the synthesis level (per article / corpus-wide / both). This gates the next content milestone, the synthesis surface that replaces the removed comparison.

### Learnings

- In a shared report repo, a plain `git commit` swept a foreign already-staged file into the commit. Use `git commit, <path>` there, the working tree is shared with parallel instances.
- Most "old" numbers in the knowledge base are legitimate intermediate states (208 on 291 pairs vs 232 on 326), not errors. Verify against the recompute before "correcting".
- The jsdom harness is the reliable trace, not the screenshot: the Chrome window is shared with the parallel frontend sessions and is resized continuously, so pixel clicks and screenshots are unreliable. Resolution-independent are element references (`find`) and `javascript_tool` against `window.__PRISMA_TEST__`.
- Avoid blocking dialogs: "Eigene Session leeren" calls `confirm()`, the FS Access error paths `alert()`. Do not click these in a browser automation run; clean up directly via localStorage instead.
- Merge scope was wider than the tool: the feature branch differed from main in 62 files, only 10 under `docs/`, the rest the paper strand, benchmark experiments, and knowledge. The full merge brought the paper strand onto main, which the operator accepted before the fast-forward consolidation.

### Open items (next)

- Decide the synthesis level (KI1), then design and build the synthesis surface with per-Beleg provenance (KI2).
- Decide whether the disclosure kappa/matrix line (trAIce M9) stays or falls with the comparison logic; on fall, retire `computeMatrix`/`cohenKappa`/`kappaLabel` and their test (the last code-consolidation remainder).
- Decide whether the tool's inner widgets also move onto the Companion typography (the frame is unified, the inner screening panels still use the tool font).

---

## 2026-06-09 (Session 12b, Abend): Gesamtumsetzungs-Welle und Solo-Abschluss

**Branch:** `feat/prisma-screening-tool`

### Was passiert ist

- Parallel-Welle (23 Agenten, Schreiber plus adversariale Verifizierer, disjunkte Datei-Territorien, ohne Shell): Excel-Import-Bruecke (`docs/js/prisma-import.js`), Browser-Testfundament (`tests/`, ungelaufen), Retro-Record Runde 1 plus `flow_model.json`, Divergenz-Analyse (TP3), Update-Protokoll mit paste-ready Prompts (TP5), Reuse-Pfad (TP7), Paper-Outline plus drei Stilproben mit Juroren-Panel.
- TP4-Analysedesign vom Subagenten-Schreib-Guard blockiert (Dateinamen mit "analysis"); vom Orchestrator aus dem woertlichen Agenten-Inhalt mit vier Verifizierer-Fixes geschrieben.
- Solo danach: `simulation-ledger.md` (alle Stakeholder-Entscheidungen simuliert, markiert, ratifizierbar), `ris-conversion.md` (schliesst paper-integrity 3.8), `paper/draft.md` (Register 2, ergebnisgefuehrt, offene Stellen als PENDING markiert), Vault-Dokumente nachgezogen.
- Paper-Integritaets-Abgleich der eingereichten Forum-Fassung: alte Korrekturrunde verifiziert eingearbeitet; ein neuer Befund (LLM-Pfad-Input-Basis, 3.9) dokumentiert, vom Autor entschieden: keine Korrektur an die Redaktion, Praezisierung im Folgepaper.

### Was wir gelernt haben

- **Exklusive Datei-Territorien tragen Parallel-Wellen:** 23 Agenten im selben Working Tree ohne Konflikt, weil jede Datei genau einen Besitzer hatte und README/plan einem finalen Konsolidierer gehoerten.
- **Schreib-Guards treffen Dateinamen, nicht Inhalte:** Subagenten koennen keine .md-Dateien mit "analysis" im Namen schreiben; Workarounds: Inhalt woertlich im Strukturfeld zurueckgeben (Orchestrator schreibt) oder NTFS-`::$DATA`-Pfadform.
- **Simulierte Stakeholder-Entscheidungen brauchen ein Ledger:** als simuliert markiert, mit Begruendung aus realistischer Perspektive, Ratifikationspunkt definiert; lizenzieren Arbeit, nie Aussenaussagen.
- **Die Verifikationskette zahlt sich doppelt:** Die Nachrechnung korrigierte nicht nur den Kernbefund (Divergenz-Zerlegung), sondern fing auch einen Faktenfehler in der bereits eingereichten Publikation.

---

## 2026-06-09 (Session 12): PRISM v4, evidence-grounded screening tool

**Branch:** `feat/prisma-screening-tool`

### What happened

Implemented the v4 redesign of the screening tool (ADR-012) in code. The tool was rebuilt around the way the reviewing colleagues actually worked: reading and searching the text, and grounding each category in concrete words found in it. The human-AI divergence apparatus (blind/reveal, kappa, matrix) moved out of the working view into a report layer.

1. **Seven surfaces collapsed to three:** Screening, PRISMA & Report (flow, agreement matrix, checklist, disclosure in one place), Daten & Repo (File System Access, per-reviewer files, export/import, reviewer reconciliation folded in). The blind-mode toggle was removed; AI is now an optional collapsed suggestion.
2. **Evidence-grounded Screening view (FR-11/12/13):** three panes, a corpus navigator with full-text search across all papers (left), the formatted, searchable document (centre) with in-text highlight and hit stepping, and categories plus pinned Belege with the derived Include/Exclude (right). Selecting a passage or a search hit pins it as a Beleg on a category, which sets that category. The reviewer file schema was bumped to 0.2 with an `evidence[category] = [{term, snippet, ts}]` map (backward compatible: 0.1 files load without evidence).
3. **Minimal Markdown renderer**, no new dependency (architecture rule), strips the note's leading and embedded frontmatter, wikilinks, and HTML comments; escapes before inline formatting so no document text can inject markup.

### Full-text source finding (important, for the joint evaluation)

The served `docs/vault/Papers/*.md` files are NOT raw full text. They are the distilled knowledge documents (English abstract plus the German Kernbefund / Methodik / Hauptargumente / Kategorie-Evidenz, the last of which already carries real per-category quotes). The raw Docling full texts (232 files, e.g. 100k chars) live in `pipeline/markdown_clean/`, which is not served and holds copyrighted, paywalled papers. Publishing those to the public Pages site is outward-facing and hard to reverse, so this iteration builds the whole read/search/pin mechanic over the already-published knowledge documents. The text source is a single pluggable seam (`fetchPaperText`), so swapping in raw local full text (read from the clone, never published) is a one-function change, gated on a copyright decision.

### Data layer

New `scripts/build_screening_index.py` extracts plain searchable text from the served knowledge documents (and abstracts for papers without one) into `docs/data/fulltext_index.json` for instant corpus search. Coverage: 326 papers, 236 with a knowledge document, 75 abstract-only, 15 with no text. Index 1.55 MB (gzips to roughly 400 KB, loaded once, lazily). It publishes nothing new.

### Verification

`node --check` clean. A headless jsdom harness (kept in a throwaway dir, not committed) passes 43 behaviour checks (three surfaces, corpus search, in-text highlight and stepping, evidence pin and unpin, derived decision, commit writing schema 0.2 with evidence, locked-record view, the report and data surfaces) plus 11 real-data checks (init on the real 326-paper corpus, rendering a real, messy vault note: frontmatter stripped, no wikilink leak, no script injection). The File System Access write path stays Chromium-only and is not headless-verifiable, unchanged from v3.

### Open items (next)

- Sync the spec docs to the built reality: rewrite `design.md` section 5 for the three v4 surfaces, write the evidence behaviour and the corrected full-text contract into `data.md`, reconcile the FR/ADR text in `specification.md`.
- Knowledge-base consolidation: one canonical number set (111 vs 142, 303 vs 305, costs, pipeline stages), fix stale footers, remove the epistemic-asymmetry evaluation frame, add a tool-build milestone, update README.
- Decide the full-text source (publish raw texts, read-local-only, or keep distilled).

---

## 2026-04-01 (Session 11): 2x2 Information Basis Experiment + Paper Integrity Check

**Branch:** `main`

### Paper vs. Repo Comparison

Systematic comparison of the paper text (Forum Wissenschaft draft) against the complete repository. 42 claims checked. Key findings:
- **1 factual error:** Paper said LLM assessment uses "extrahierte Wissensdokumente", actually uses Title + Abstract from papers_full.csv. The knowledge documents are NOT used as input.
- **1 deviation:** "deterministisch aus den Wissensdokumenten abgeleitet" for the knowledge graph, concept extraction is LLM-based, not deterministic. Fixed in revised draft.
- **5 not verifiable:** Phase 1 (RIS conversion, metadata import, expert verification) has no audit trail.
- **24 verified:** Pipeline, benchmark numbers, categories, assessment system all correct.

### 2x2 Experiment: Information Basis x Model

**Motivation:** The discovery that the 10K assessment uses only abstracts raised the question: would knowledge documents improve LLM assessment quality?

**Implementation:**
- New module `benchmark/scripts/kd_mapping.py`: Maps 209/249 KDs to Zotero_Keys via 3-strategy matching (exact title, author+year, fuzzy). No Zotero API dependency.
- Refactored `benchmark/scripts/run_llm_assessment.py`: New `--kd-dir` flag enriches prompt with KD sections (Kernbefund, Forschungsfrage, Methodik, Hauptargumente, Kategorie-Evidenz). Excludes Assessment-Relevanz (would leak pre-made judgments). New `Input_Source` column tracks KD vs Abstract per paper.
- New `benchmark/scripts/compare_conditions.py`: 4-way comparison with delta analysis.

**Results (2x2 design, all on 291 benchmark papers):**

| Condition | Include% | Decision K | Gender K | Feministisch K |
|-----------|----------|-----------|----------|----------------|
| Haiku+Abs | 71.5% | 0.056 | 0.407 | 0.753 |
| Haiku+KD | 88.7% | 0.054 | **0.530** | 0.753 |
| Sonnet+Abs | 82.5% | 0.098 | 0.284 | 0.819 |
| Sonnet+KD | 91.4% | **0.110** | **0.449** | **0.841** |

**Key findings:**
1. Sonnet + KD is the best condition (Decision K +0.012, Mean Cat K +0.026, Gender +0.166)
2. Haiku is overwhelmed by richer context, mean category kappa drops (-0.06)
3. Inclusion bias intensifies with more context across ALL conditions
4. Fairness degrades in both KD conditions (ubiquitous fairness language in KDs)
5. **The divergence is NOT information deficit**, structural inclusion bias persists even with full-text extractions

**Interpretation for paper:** More context improves category-specific recognition (especially Gender, Prompting, Generative_KI for Sonnet) but amplifies the inclusion bias. This strengthens the paper's central argument: reliability requires process design, not just better models or more data.

---

## 2026-04-01 (Session 10): Repository audit, English translation, Haiku vs Sonnet experiment

**Branch:** `main`

### What happened

1. **Repository audit against paper:** Systematic comparison of all claims in the paper (Google Docs) against the actual repository state. Found and fixed: stale merge-bug data never committed (210->291), wrong provider name (Elicit->correct 4 providers), unbacked causal claims ("primarily paywalls" with no OA analysis), inconsistent terminology ("LLM-Pipeline" vs paper's "workflow"/"distillation pipeline").

2. **All documentation translated to English:** CLAUDE.md (rewritten with Core Argument + Key Terminology sections), status.md, project.md, methods-and-pipeline.md, paper-integrity.md, README.md, quickstart.md. Root README.md also updated.

3. **Paper text verified against code:** Discovered that the paper falsely claimed Stage 1 "splits the document into semantic sections", the code (`distill_knowledge.py`) processes the full text as a whole (up to 45k chars). Corrected passage provided to paper author.

4. **Haiku 4.5 vs Sonnet 4.6 experiment:** Ran 10K assessment with claude-sonnet-4-6. Same prompt, same data, same human baseline. Result: Sonnet does NOT close the gap, it shifts it. Include rate rises to 82.5% (vs Haiku 71.5%, Human 46%). Gender kappa drops sharply (0.407->0.284). Feministisch improves to 0.819.

5. **Gender-Feministisch split discovered:** Sonnet systematically separates "Feministisch" from "Gender". Papers like "Data Feminism for AI" get Feministisch=Yes, Gender=No. Sonnet follows the category definition literally ("explicit gender focus"), while experts read feminist theory as inherently gender-relevant. Of 21 cases where the models disagree on Gender, Haiku matches Human in 20/21. This is an operationalization gap in the category definition, not a model quality issue.

### Key learnings

- **Divergence is structural, not performance-based:** A more capable model shifts the divergence pattern rather than closing it. This strengthens the paper's core argument.
- **Category definitions matter more than model quality:** The Gender definition ("explicit gender focus") excludes what experts consider relevant (feminist theory treating gender implicitly). The infrastructure makes this visible.
- **Pipeline description must match code:** The paper claimed sectionization that doesn't exist in the code. Every factual claim needs verification against the implementation.
- **Context Rot motivates the pipeline, not sectionization within it:** The distillation pipeline exists because full texts are too long, but it doesn't address this through section-splitting.

### Commits

| Commit | Description |
|--------|-------------|
| `595a94f` | Merge-bug correction published + all frontend numbers updated |
| `783b530` | Remaining fallbacks, pattern percentages, vault hints |
| `b940cc4` | Deep Research providers corrected (Elicit -> correct 4) |
| `3567022` | All docs translated to English, terminology aligned with paper |
| `125c6a8` | Root README.md to English, delete stale new-paper.md |
| `e5169fa` | Haiku vs Sonnet experiment results |

---

## 2026-03-27 (Session 9): Human Assessment abgeschlossen, Merge-Bug behoben

**Branch:** `main`

### Was passiert ist

1. **Human Assessment abgeschlossen:** Google Spreadsheet importiert (304 Zeilen). 27 Korrekturen/Ergaenzungen angewendet: 5 Christopher-Papers reviewed (Chisca, Garg, Gohar, Hayati, He), 16 Unclear aufgeloest (13 Include, 3 Exclude), 4 leere Decisions ergaenzt, 1 Fehlerkorrektur (Kaneko war faelschlich Exclude), 1 Kategorie-Update (Gohar: Feministisch Nein->Ja wg. Crenshaw). 1 defekte Zeile entfernt. Ergebnis: 303 Papers, 142 Include, 161 Exclude, 0 Unclear.

2. **Kritischen Merge-Bug entdeckt und behoben:** `merge_assessments.py` matchte Human- und LLM-Assessment per sequentieller ID statt Zotero_Key. Die beiden CSVs haben komplett unterschiedliche ID-Reihenfolgen (301 von 304 IDs zeigten auf verschiedene Papers). Alle bisherigen Benchmark-Ergebnisse (Kappa 0,035, Konfusionsmatrix 65/23/78/34, 111 Divergenzen) basierten auf falschen Paarungen. Fix: Zeile 65 in merge_assessments.py auf Zotero_Key umgestellt.

3. **Benchmark komplett neu berechnet:** 291 Papers mit beiden Assessments (korrekt per Zotero_Key gepaart). Konfusionsmatrix: 100/34/108/49. Kappa: 0,056. Kategorie-Kappas jetzt alle 0,39 bis 0,82 (vorher teils negativ, das war Rauschen). 142 Disagreements (108 LLM-Inc/Human-Exc, 34 umgekehrt).

4. **Divergenz-Klassifikation mit Sonnet 4.6:** Alten Divergenz-Cache invalidiert (.vault_cache/divergences/). 142 Faelle neu klassifiziert mit Claude Sonnet 4.6 (statt Haiku 4.5). Ergebnis: Semantische Expansion 51% (73), Implizite Feldzugehoerigkeit 30% (42), Keyword-Inklusion 19% (27). Sonnet differenziert deutlich staerker als Haiku, weniger pauschale "Semantische Expansion", mehr Erkennung von implizitem Feldwissen.

5. **JSON-Daten regeneriert:** research_vault_v2.json und promptotyping_v2.json mit korrekten Metriken und Divergenz-Mustern neu generiert. Alle Wissensdokumente (methods-and-pipeline, paper-integrity, project, quickstart) aktualisiert.

### Was wir gelernt haben

**Merge-Key ist kritisch:** Ein Merge per sequentieller ID statt stabiler Identifier (Zotero_Key) produziert plausibel aussehende aber voellig falsche Ergebnisse. Die alten Zahlen (78:23 Ratio, Kappa 0,035) sahen inhaltlich sinnvoll aus, weil die Marginalverteilungen (Basisraten) korrekt blieben, nur die Zellwerte der Konfusionsmatrix waren Zufall.

**Kategorie-Kappas als Validierungsindikator:** Die alten Kategorie-Kappas waren teils negativ (Gender -0,098, Fairness -0,163). Negative Kappas bei binaeren Kategorien sind ein Warnsignal fuer fehlerhaftes Matching. Die korrekten Werte (0,39 bis 0,82) zeigen echte Uebereinstimmungssignale.

**Sonnet 4.6 vs Haiku 4.5 bei Klassifikation:** Sonnet produziert differenziertere Divergenz-Klassifikationen. Haiku hatte 81% als "Semantische Expansion" eingestuft (Catch-all). Sonnet verteilt 51/30/19, die Muster sind ausgeglichener und die Begruendungen inhaltlich praeziser.

### Was entstanden ist

| Datei | Aenderung |
|-------|-----------|
| `benchmark/scripts/merge_assessments.py` | Bug-Fix: Zotero_Key statt sequentielle ID |
| `benchmark/data/human_assessment.csv` | Neu: 303 Zeilen, 27 Korrekturen, komplett |
| `benchmark/data/merged_comparison.csv` | Neu: 291 korrekt gepaarte Papers |
| `benchmark/results/agreement_metrics.json` | Neu: korrekte Metriken |
| `benchmark/results/disagreements.csv` | Neu: 142 korrekt gepaarte Disagreements |
| `docs/data/research_vault_v2.json` | Regeneriert mit korrekten Metriken |
| `docs/data/promptotyping_v2.json` | Regeneriert mit Sonnet-4.6-Divergenzmustern |
| `scripts/generate_vault_v2.py` | Modell fuer Divergenz-Klassifikation: Sonnet 4.6 |
| `knowledge/status.md` | Benchmark-Ergebnisse aktualisiert |
| `knowledge/methods-and-pipeline.md` | Script-Referenzen + Metriken aktualisiert |
| `knowledge/paper-integrity.md` | Merge-Bug + neue Werte dokumentiert |
| `knowledge/project.md` | Benchmark-Basis aktualisiert |
| `knowledge/guides/quickstart.md` | Benchmark-Zahlen aktualisiert |
| `CLAUDE.md` | HA-Status, Leitkonzepte, Known Issues aktualisiert |

### Offene Punkte

- [ ] Vault-Notes regenerieren (142 Divergenz-Notes mit neuen Mustern) + Vault-ZIP
- [ ] Evidence Companion: Stats im Header pruefen (326 Papers, 249 WD, 291 Bewertungen)
- [ ] Paper-Zahlen aktualisieren (Konfusionsmatrix, Raten, Divergenz-Muster)
- [ ] M8: Paper finalisieren (Deadline 4. Mai)

---

## 2026-03-24 (Session 8): Kategorien-Explorer, Wissensnetz-Redesign, Methoden-Seite

**Branch:** `main`

### Was passiert ist

1. **Bewertungsvergleich ersetzt durch Kategorien-Explorer:** Der statische Dashboard-View (Callout, Slope Chart, Kappa) wurde durch einen interaktiven Kategorien-Explorer ersetzt. 10 Kategorien als Spektrum (Gegenstand bis Perspektive), Klick auf eine Kategorie zeigt: Rate-Vergleich (Human vs LLM), konkrete Divergenz-Papers mit LLM-Reasoning, haeufige Konzepte. Cross-View-Navigation zu Korpus und Wissensnetz.

2. **Wissensnetz-Redesign:** Cluster-separierendes Layout (Technik links, Sozial rechts, Bruecke oben). Divergenz-Modus-Toggle (hebt Divergenz-Konzepte hervor, faerbt nach dominantem Muster). Hover-Glow-Effekt (SVG feGaussianBlur Filter). Always-visible Detail-Sidebar mit Placeholder. Kompakte Toolbar (Suche + Legende + Buttons). Full-width Layout (bricht aus main max-width aus).

3. **Divergenz-Daten-Anreicherung:** `promptotyping_v2.json` wird geladen. 111 Divergenzen werden per Title-Matching auf Paper-Objekte gemappt (pattern, justification, category_comparison, llm_reasoning). Neue EC API: getDivergencePatterns(), getDivergences(), getCategoryDivergences().

4. **Stats-Bar in Header:** Die separate Stats-Zeile (326 Papers, 249 WD, 210 Bewertungen, 10 Kategorien) wurde als kompakte Zeile in den Header integriert.

5. **Methoden-Unterseite (methoden.html):** Neue statische Seite mit Pipeline-Visualisierung, Kategorie-System-Tabelle, Bewertungsmethodik, Kernergebnissen, Kosten, Limitationen.

6. **Navigation vereinheitlicht:** Alle Seiten (index, about, methoden, help) haben identische Navigation: Chat | Wissensnetz | Kategorien | Korpus | About | Methoden | Hilfe. Hash-basierte Navigation von Unterseiten zurueck zu Views. "Fragen Sie das Wissen" durch "Recherche im Forschungskorpus" ersetzt.

### Was wir gelernt haben

**Kein Dashboard, sondern Exploration:** Der Bewertungsvergleich war ein Bericht, man scrollt und schaut. Der Kategorien-Explorer ist ein Werkzeug, man waehlt eine Dimension und sieht die konkrete Evidenz. Das ist der Unterschied zwischen "Zeigen was ist" und "Explorierbar machen".

**Force Layout + Cluster:** Cluster-separierendes Layout funktioniert nur, wenn die Cluster-Force dominant ist (0.4) und die Link-Force schwach (0.06). Sonst zieht die Link-Force alles in einen Blob zurueck.

**Fehlende Dimension:** 27 ungenutzte Datenfelder identifiziert. Kein fuenfter View noetig, stattdessen Knowledge-Sections und Verification-Scores in bestehende Views integrieren.

### Was entstanden ist

| Datei | Aenderung |
|-------|-----------|
| `docs/js/kategorien.js` | Neu: Kategorien-Explorer IIFE (~300 Zeilen) |
| `docs/js/wissensnetz.js` | Komplett neu: Cluster-Layout, Divergenz-Modus, Glow, Sidebar |
| `docs/js/research-app.js` | Divergenz-Daten laden, EC API, Modal-Tabs, Markdown-Export (~1100 Zeilen) |
| `docs/js/wissenschat.js` | Heading geaendert |
| `docs/js/features.js` | Entfernt (war nur noch No-Op Stubs) |
| `docs/index.html` | Kategorien-Explorer, Wissensnetz Toolbar, Stats in Header, Modal-Tabs |
| `docs/methoden.html` | Neu: Pipeline-Viz, Kategorie-Tabelle, Nachnutzungsanleitungen |
| `docs/about.html` | Nav aktualisiert |
| `docs/help.html` | Nav + Inhalt aktualisiert (Kategorien statt Bewertungsvergleich) |
| `docs/css/research.css` | Refactored: -700 Zeilen toten Code, Kategorien + Wissensnetz + Detail-Tabs |
| `scripts/generate_promptotyping_data_v2.py` | Cluster-Schwelle 0.55, leere Human-Werte als null |
| `docs/data/*.json` | Regeneriert mit neuen Clustern (7/20/109) |

### Offene Punkte

- [ ] M8: Paper finalisieren (Deadline 4. Mai)

---

## 2026-03-24 (Session 6): Wissens-Chat + Panel-Optimierung + Quellenleiste

**Branch:** `FemPrompt_SozArb_promptotyping-interface`

### Was passiert ist

1. **Panel-Optimierung:** Side Panel von 680px auf `min(480px, 45vw)` verkleinert. Bei offenem Panel werden Tabellenspalten (Jahr, Status, Kategorien) ausgeblendet, Overlay transparent, Tabelle bleibt klickbar. Aktive Zeile wird hervorgehoben. Kein Scroll-Lock mehr.

2. **Vault-Download aufgewertet:** "Vault (.zip)" umbenannt zu "Wissensdokumente (.zip)" mit Tooltip und Erklaertext ("505 Markdown-Dateien, nutzbar in Obsidian oder als LLM-Kontext").

3. **Wissens-Chat (neuer 4. Tab):** Gemini 2.5 Flash-basierter Q&A-Chat ueber den Forschungskorpus. RAG-lite: Keyword-Suche ueber 326 Papers + 136 Konzepte, Top 30 als Kontext. SSE-Streaming. API-Key lokal im Browser (localStorage). 3 Vorschlagsfragen als Einstieg.

4. **Quellenleiste mit Cross-View-Navigation:** Nach jeder Chat-Antwort erscheint eine klickbare Quellenleiste. Papers werden per Autoren-/Titel-Matching als "zitiert" erkannt. Klick navigiert zum Korpus-Tab und oeffnet das Detail-Panel, der epistemische Kreislauf: Chat-Antwort → Quelle → LLM-Begruendung pruefen → zurueck.

5. **Bug-Fix:** Quellenleisten bleiben bei Re-Render erhalten (complete-Flag + Event Delegation statt direkter Listener).

### Was wir gelernt haben

**Side Panel vs. Accordion:** Side Panel ist das richtige Pattern fuer Explorations-Tools (vs. Accordion fuer Archive). Das Problem war nicht das Panel, sondern der Informationsverlust in der komprimierten Tabelle. Loesung: gezielte Spaltenreduktion statt pauschaler Komprimierung.

**Chat als epistemisches Interface:** Ein Chat ueber die Wissensbasis wird erst dann sinnvoll, wenn die Antworten verifizierbar sind. Die Quellenleiste mit Navigation zum Korpus-Tab macht den Chatbot zu einem verifizierbaren epistemischen Werkzeug statt einer Black Box.

**RAG-lite reicht:** Fuer 326 Papers braucht man kein Embedding-basiertes Retrieval. Einfaches Keyword-Matching + Padding mit Divergenz-Faellen liefert guten Kontext. Gemini 2.5 Flash mit 1M Kontext koennte sogar alles auf einmal verarbeiten.

### Was entstanden ist

| Datei | Aenderung |
|-------|-----------|
| `docs/js/wissenschat.js` | Neu: ~560 Zeilen, Chat + Streaming + Quellenleiste + Navigation |
| `docs/js/research-app.js` | Panel-Logik, EC.getConceptData(), Chat-Lazy-Init, highlightActiveRow() |
| `docs/css/research.css` | Panel-Optimierung, Chat-Styles, Quellenleiste (~300 Zeilen neu) |
| `docs/index.html` | 4. Tab, Vault-Link, config.local.js Einbindung |
| `.env` | Gemini API Key (gitignored) |
| `docs/js/config.local.js` | Browser-Bridge fuer API Key (gitignored) |

---

## 2026-03-24 (Session 6b-7): UI Polish, Navigation, Tooltips, Merge

**Branch:** `FemPrompt_SozArb_promptotyping-interface` → gemerged zu `main`

### Was passiert ist

1. **Inline-Zitationen:** Gemini-Antworten werden post-processed, Autor (Jahr) Muster werden erkannt und als klickbare Links zum Korpus-Tab gerendert. Referenzliste unter jeder Antwort zeigt nur tatsaechlich zitierte Papers.

2. **Chat-Redesign:** Chat als eigenstaendiges Fenster (weiss, Border, Shadow). Subtiler Primary-Akzent oben statt doppeltem Regenbogen. API-Key-Bar kompakt. User-Bubble dunkelgrau statt teal.

3. **Tab-Reihenfolge:** Wissens-Chat (Default) > Wissensnetz > Bewertungsvergleich > Korpus (Referenzschicht). Chat wird sofort initialisiert.

4. **Header-Navigation:** Dropdown durch direkte View-Buttons ersetzt. About/Hilfe als echte Unterseiten (`about.html`, `help.html`) statt Modals. `switchView()` als globale Funktion.

5. **Rich Data Tooltips:** JS-basierte Tooltips mit echten Daten aus dem JSON: Jahresverteilung (Barcharts), Pipeline-Verlust (Step-Chain), Include/Exclude/Divergenz (Stat-Grid), Kategorie-Haeufigkeit (farbige Balken), Top-Konzepte.

6. **Bewertungsvergleich:** Callout-Box "78 vs. 23" fuer Kernergebnis. Slope-Label-Overlap gefixt.

7. **Wissensnetz:** Legende (Technik/Sozial/Bruecke + Divergenz-Ring).

8. **Merge zu main** und GitHub Pages Deployment.

### Was wir gelernt haben

**Verifiable Chat > Black-Box Chat:** Der Wissens-Chat wird erst wertvoll, wenn jede Aussage verifizierbar ist. Inline-Zitationen + Cross-View-Navigation zum Korpus schliessen den epistemischen Kreislauf.

**Tooltips als Datenschicht:** Statt Beschreibungstext zeigen die Tooltips echte Statistiken (Barcharts, Pipeline-Viz). Das macht die Stats-Bar zu einer interaktiven Datenebene statt nur einer Zahlenleiste.

**Navigation flach halten:** Dropdown war ein Schritt zu viel. Direkte Buttons sind besser fuer 4 Views, man sieht sofort alle Optionen.

### Offene Punkte

- [ ] M13: Wissenstaxonomie (Wissensnetz-Redesign: Hierarchie, Quell-Definitionen, Kategoriefarben)
- [ ] M8: Paper finalisieren (Abb. 3 abgleichen, Deadline 4. Mai)
- [ ] Bewertungsvergleich: Dashboard-Charakter weiter reduzieren

---

## 2026-03-19 (Session 5): Evidence Companion, Richtungswechsel

**Branch:** `FemPrompt_SozArb_promptotyping-interface`
**Commits:** `1d54c46`, `895d791`, `a7703e4`

### Was passiert ist

1. **Gesamtanalyse:** Paper-Text vs. Repository vs. Web-Frontend abgeglichen. Identifiziert: Das Paper referenziert eine "publizierte Wissensumgebung" (Abb. 3), das ist das Research Dashboard, nicht Promptotyping.

2. **Richtungswechsel:** Promptotyping-Interface wird nicht weiterentwickelt. Entscheidung: Ein einziges Frontend als akademische Begleitpublikation ("Evidence Companion").

3. **Komplettes Redesign von `docs/index.html`:**
   - Name: "Feministische AI Literacies, Systematischer Review"
   - IBM Plex Serif fuer Headings (akademische Seriositaet)
   - Weisser Header, Spektrum-Farbsystem (10 Kategorien als Regenbogen)
   - Tabelle statt Cards (sortierbar, 50/Seite, Pagination)
   - Seitenpanel statt Modal (slide-in)
   - Tabs entfernt, dann als 2-Tab-Navigation wiederhergestellt (Korpus / Bewertungsvergleich)

4. **LLM-Confidence entfernt:** War Selbsteinschaetzung des LLMs, keine valide Metrik. Komplett raus aus Interface, Daten, Generator.

5. **Datengenerator erweitert:** 300 Papers (249 full + 51 thin), DOI/URL/Abstract, Knowledge-Sektionen, Kategorie-Raten, deterministische Picks.

6. **Farbsystem redesigned:** 10 Kategorien als genderneutrales Spektrum (Salbeigruen -> Teal -> Stahlblau -> Lila -> Altrosa -> Terrakotta -> Bernstein -> Olivgold -> Pflaume -> Moosgruen). Gruppierung als "Gegenstand" (KI-Dimension) und "Perspektive" (Gesellschaftliche Dimension) statt "Technik/Sozial".

### Was wir gelernt haben

**Promptotyping vs. Evidence Companion:**
- Promptotyping ging ueber das Paper-Versprechen hinaus. Das Paper beschreibt eine Wissensumgebung zum Explorieren, Vergleichen, Identifizieren, Nachvollziehen. Das ist ein Evidence Browser, kein Pipeline-Explorer.
- **Learning:** Das Interface muss das einloesen, was das Paper verspricht, nicht mehr. Zusaetzliche Features (Pipeline-Sankey, Konzept-Force-Graph) sind interessant, aber nicht das, was Reviewer:innen oder Kolleg:innen brauchen.

**Design-Professionalitaet:**
- Das alte Dashboard wirkte wie ein Tech-Startup (dunkler Header, KPI-Tiles, bunte Zahlen). Akademische Interfaces brauchen: Serif-Headings, Whitespace, zurueckhaltende Farben, Journal-Style Tabellen.
- **Learning:** Inspirationsquellen: Our World in Data (Klarheit), Distill.pub (Artikel als Interface), eLife (Progressive Enhancement). Nicht: SaaS-Dashboards, Admin-Panels.

**LLM-Confidence ist keine Metrik:**
- Der Wert 0.95 suggeriert Praezision, die nicht gegeben ist. Es ist eine Selbsteinschaetzung des LLMs, kein unabhaengiges Qualitaetsmass. Muss raus.
- **Learning:** Jede Zahl im Interface muss pruefbar sein. Pseudoquantitative Werte (LLM-Confidence, Sycophancy-Scores) sind irrefuehrend.

**Farbcodierung und Gender:**
- Blau (Technik) / Warm (Sozial) reproduziert Gender-Stereotypen, inakzeptabel fuer ein feministisches Forschungsprojekt.
- **Learning:** Farbsysteme sind politisch. Ein Regenbogen-Spektrum ohne hierarchische Zuordnung ist die bessere Wahl.

**"Gegenstand" und "Perspektive" statt "Technik" und "Sozial":**
- Die interne Operationalisierung (TECHNIK_OK AND SOZIAL_OK) muss nicht die UI-Sprache sein. "Gegenstand" (was wird untersucht?) und "Perspektive" (aus welchem Blickwinkel?) ist praeziser und fachlicher.

### Was entstanden ist

| Datei | Aenderung |
|-------|-----------|
| `docs/index.html` | Komplett neu: Header, Intro, 2 Tabs, Tabelle, Detail-Panel, Footer |
| `docs/css/research.css` | Redesign: Typographie, Farben, Layout (~1400 Zeilen) |
| `docs/js/research-app.js` | Rewrite: Tabelle, Sortierung, Detail-Panel, Confidence entfernt (~600 Zeilen) |
| `docs/js/features.js` | filterByQuadrant angepasst |
| `scripts/generate_promptotyping_data_v2.py` | +200 Zeilen: thin papers, DOI/URL, KD-Sektionen, Kategorie-Raten |
| `docs/data/promptotyping_v2.json` | Regeneriert: 300 Papers, 1.7 MB |

### Offene Punkte

- [ ] Wissensnetz-View (Konzept-Graph, Tab 3)
- [ ] Bewertungsvergleich-Tab (Konfusionsmatrix, Slope Chart)
- [ ] Promptotyping-Dateien physisch entfernen (werden nicht mehr geladen, aber existieren noch)
- [ ] CLAUDE.md aktualisieren
- [ ] Merge zu main nach Fertigstellung
- [ ] Paper: Abb. 3 und Fazit-Beschreibung mit tatsaechlichem Interface abgleichen

---

## 2026-02-22 (Session 4): Promptotyping v2.1, Epistemische Tiefe

**Branch:** `FemPrompt_SozArb_promptotyping-interface`
**Dauer:** ~3h (2 Claude-Sessions, davon 1 Context-Kompression)

### Was passiert ist

1. **Kritische Evaluation von v2**, 4 Screenshots im Browser betrachtet. Erkenntnis: Das Interface ist ein Daten-Explorer, kein epistemisches Werkzeug. 5 Probleme identifiziert: Haltungen nur dekorativ, Paper Journey startet leer, Konzept-Graph monochrom, Divergenzen zeigen Karten statt Geschichten, kein roter Faden.

2. **Plan geschrieben und genehmigt**, 4-Phasen-Plan (Datengenerator, HTML, JS, CSS) mit detaillierten Code-Snippets. Ziel: Interface soll die Frage beantworten "Was passiert mit Wissen, wenn es durch eine LLM-Pipeline fliesst?", nicht durch Zahlen, sondern durch navigierbare Erfahrung.

3. **Phase A: Datengenerator erweitert**, 3 Featured Papers handverlesen (Ahmed_2024: Semantische Expansion, Shafie_2025: Keyword-Inklusion, Kaneko_2024: Uebereinstimmung). Konzept-Cluster berechnet (1 Technik, 55 Sozial, 80 Bridge). Pattern-Distribution + Asymmetrie-Daten in Meta.

4. **Phase B: HTML umgebaut**, 5 Views statt 4 (Landing als Default). Stances-Legend kompakt. Container fuer Featured Papers in Journey + Concept Legend.

5. **Phase C: JS komplett neu geschrieben** (~1090 Zeilen), Landing View mit Kennzahlen + Featured Cards. Paper Journey mit Pre-Populated Picks + Stance-basierte Timeline. Concept Explorer mit Cluster-Farben + Divergenz-Ring. Divergenz-Navigator mit Narrative Cards + Exemplarische Faelle + Knowledge Summary in Detail. Alle Detail-Panels mit 3 Stance-Sektionen (Ergebnis/Prozess/Grenze).

6. **Phase D: CSS komplett neu geschrieben** (~650 Zeilen), Stance-Sektionen als Kern-Pattern (farbige linke Raender). Landing-Layout. Featured Cards mit Stance-Bars. Journey Picks als Pills. Narrative Divergenz-Cards mit Story-Bars. Konzept-Legende. Responsive Breakpoints.

### Was wir gelernt haben

**Epistemische Haltungen muessen strukturell sein, nicht dekorativ:**
- v2 hatte 3 farbige Punkte als Banner. Sah nett aus, tat nichts.
- v2.1 verwendet `.stance-section` Divs mit farbigen linken Raendern in JEDER Detail-Ansicht. Die Farbe IST die Information.
- **Learning:** Wenn ein UI-Element weggelassen werden kann ohne Funktionsverlust, ist es Dekoration. Epistemische Haltungen muessen die Informationsarchitektur bestimmen, nicht die Farbgebung.

**Konzept-Cluster spiegeln den Korpus:**
- Erwartet: ~30% Technik, ~40% Sozial, ~30% Bridge
- Tatsaechlich: 1 Technik (0.7%), 55 Sozial (40.4%), 80 Bridge (58.8%)
- Interpretation: Fast alle Konzepte im Korpus "AI Literacy + Soziale Arbeit" haben per Definition Verbindungen zu beiden Seiten. Nur 1 reines Technik-Konzept ueberlebt den 65%-Threshold.
- **Learning:** Die Cluster-Verteilung ist ein Ergebnis, kein Problem. Sie zeigt, dass der Korpus tatsaechlich interdisziplinaer ist.

**Featured Papers als narrativer Anker:**
- Statt leerer Views: 3 handverlesene Papers repraesentieren je ein Divergenz-Muster.
- Der User sieht sofort "Hier ist ein konkretes Beispiel" statt "Bitte suche etwas".
- **Learning:** Narrative brauchen Protagonisten. Zahlen und Suchfelder reichen nicht.

### Was entstanden ist (Aenderungen an bestehenden Dateien)

| Datei | Aenderung |
|-------|-----------|
| `scripts/generate_promptotyping_data_v2.py` | +Featured Papers, +Cluster, +Pattern-Distribution (~+80 Zeilen) |
| `docs/promptotyping.html` | +Landing View, +Stances Legend, +5 Views statt 4 (~+40 Zeilen) |
| `docs/js/promptotyping-app.js` | Komplett-Rewrite (~1090 Zeilen, vorher 778) |
| `docs/css/promptotyping.css` | Komplett-Rewrite (~650 Zeilen, vorher 653) |
| `docs/data/promptotyping_v2.json` | Regeneriert mit neuen Feldern |

### Offene Punkte

- [ ] Browser-Test (lokal via HTTP-Server)
- [ ] Mobile-Ansicht pruefen (< 768px)
- [ ] Merge zu main nach Browser-Test

---

## 2026-02-22 (Session 3): Promptotyping v2, Vom Dashboard zum Forschungsartefakt

**Branch:** `FemPrompt_SozArb_promptotyping-interface`
**Commits:** `bb147c0` (v1), `3476437` (v2)
**Dauer:** ~6h (3 Claude-Sessions)
Aufwand: 249 Konzept-Extraktionen und 111 Divergenz-Klassifikationen (Haiku 4.5)

### Was passiert ist

1. **Promptotyping v1 gebaut und verworfen**, Erstes Interface war ein 5-Schritte-Dashboard, das den Forschungsprozess *beschreibt* (Trichter, Prozess-Diagramme, Statistiken). Problem erkannt: Ein Dashboard zeigt Zahlen, kein Wissen. Committed als `bb147c0`, sofort als Ausgangspunkt fuer v2 verwendet.

2. **Konzeptdokument geschrieben**, `knowledge/FORSCHUNGSPROJEKT-PROMPTOTYPING.md` definiert Promptotyping als epistemische Praxis: "Der Forschungsprozess wird zum Forschungsgegenstand." Drei Haltungen operationalisiert: Zeigen was ist / Zeigen wie / Zeigen was nicht geht.

3. **3-Phasen-Plan erstellt und umgesetzt:**
   - Phase 1: Vault v2 (`scripts/generate_vault_v2.py`, ~1660 Zeilen), LLM-basierte Konzept-Extraktion (249 Papers -> 136 konsolidierte Konzepte), Divergenz-Klassifikation (111 Faelle in 3 Muster), 5-Strategie-Titel-Matching (237/249 vs. vorher 226/249)
   - Phase 2: Datengenerator (`scripts/generate_promptotyping_data_v2.py`, ~500 Zeilen), Reine Datentransformation, kein LLM
   - Phase 3: Web-Interface (HTML + CSS + JS Neubau), 4 Views statt 5 Steps: Pipeline-Sankey, Paper Journey, Konzept-Explorer (Force Graph), Divergenz-Navigator

### Was wir gelernt haben

**Titel-Matching ist ein unterschaetztes Problem:**
- `simplify_title()` in v1 war naiv (50-Char-Truncation + 20-Char-Prefix). Verlor 23/249 Papers.
- 5-Strategie-Kaskade (Stage1-JSON-Titel, KD-YAML-Titel, Filename-Prefix, Autor+Jahr, Fuzzy) bringt 237/249.
- Die letzten 12 sind echte Datenqualitaetsprobleme: falsche Titel in Knowledge-Docs (LLM-Halluzination bei Extraktion), nicht-standardisierte Autorennamen (D'Ignazio, Arias_Lopez), Organisationsautoren (Statistics, Women, Alliance).
- **Learning:** Matching braucht mehrere unabhaengige Signale. Ein einzelnes Signal (egal wie clever) scheitert an der Vielfalt realer Daten.

**Windows MAX_PATH ist ein reales Problem:**
- Zotero-Titel koennen sehr lang sein. `safe_filename(title)` + Zotero-Key-Suffix sprengt 260 Zeichen.
- Fix: Titel auf 100 Zeichen kuerzen vor Suffix-Anhaengung.
- 27 Filename-Kollisionen bei 249 Papers (verschiedene Papers mit aehnlichen Titeln).
- **Learning:** Dateinamen aus externen Quellen immer defensiv behandeln. Laenge begrenzen, Kollisionen explizit pruefen.

**D3-Sankey-Links sind keine Linien:**
- `d3.sankeyLinkHorizontal()` erzeugt einen Path, der mit `stroke-width` gerendert wird (nicht `fill`).
- Orphan-Nodes (ohne Links) koennen D3-Sankey crashen.
- **Learning:** D3-Dokumentation genau lesen. Die meisten "mein Sankey rendert nicht"-Probleme sind fill/stroke-Verwechslungen.

**Divergenz-Muster-Verteilung ueberrascht:**
- Erwartet: ~50% Keyword, ~30% Semantisch, ~20% Implizit
- Tatsaechlich: 81% Semantische Expansion, 11% Keyword-Inklusion, 8% Implizite Feldzugehoerigkeit
- Interpretation: Der LLM expandiert Bedeutung viel staerker als erwartet. Er findet "Fairness" wo nur "Gerechtigkeit" steht, "Soziale Arbeit" wo nur "Community Services" steht. Das ist kein Bug, es ist das Kernphaenomen der epistemischen Asymmetrie.
- **Learning:** Die drei Muster aus dem Paper sind empirisch bestaetigt, aber die Gewichtung ist anders als theoretisch vermutet. Das Paper sollte das reflektieren.

**IIFE-Pattern fuer Vanilla JS bleibt solide:**
- Kein Build-Tool, kein Framework, kein npm. Nur eine IIFE mit State-Management und View-Routing.
- 778 Zeilen fuer 4 Views mit D3-Sankey, D3-Force-Graph, Suche, Filter und Cross-View-Navigation.
- **Learning:** Fuer statische GitHub Pages ohne Backend ist Vanilla JS + IIFE nach wie vor die beste Wahl. Die Komplexitaet liegt in den Daten, nicht im Framework.

**Kappa-Prevalence-Bias bestaetigt sich auch in der Divergenz-Analyse:**
- 81% Semantische Expansion = LLM findet Relevanz, die Human nicht sieht.
- Konsistent mit LLM-Include-Rate 68% vs. Human 42%.
- Kappa 0.035 ist Symptom, nicht Diagnose. Die Diagnose ist: LLM und Human operieren auf verschiedenen epistemischen Ebenen.

### Was entstanden ist

| Artefakt | Pfad | Groesse |
|----------|------|---------|
| Vault v2 Generator | `scripts/generate_vault_v2.py` | ~1660 Zeilen |
| Datengenerator | `scripts/generate_promptotyping_data_v2.py` | ~500 Zeilen |
| Web-Interface HTML | `docs/promptotyping.html` | 172 Zeilen |
| Web-Interface CSS | `docs/css/promptotyping.css` | 653 Zeilen |
| Web-Interface JS | `docs/js/promptotyping-app.js` | 778 Zeilen |
| JSON-Daten | `docs/data/promptotyping_v2.json` | 1.0 MB |
| Vault: Paper Notes | `vault/Papers/` | 248 Dateien |
| Vault: Concept Notes | `vault/Concepts/` | 136 Dateien |
| Vault: Pipeline Notes | `vault/Pipeline/` | 5 Dateien |
| Vault: Divergenz Notes | `vault/Divergenzen/` | 111 Dateien |
| Vault: MOCs | `vault/MOCs/` + `MASTER_MOC.md` | 5 Dateien |
| Vault ZIP | `docs/downloads/vault.zip` | 1.1 MB |
| LLM-Cache | `.vault_cache/` | 360 JSON-Dateien |
| Konzeptdokument | `knowledge/FORSCHUNGSPROJEKT-PROMPTOTYPING.md` | 252 Zeilen |

### Offene Punkte

- [ ] Web-Interface im Browser testen (lokal via HTTP-Server fuer JSON-Fetch)
- [ ] Cross-View-Navigation verifizieren (Konzept-Klick -> Explorer, Paper-Klick -> Journey)
- [ ] Mobile-Ansicht pruefen (< 768px)
- [ ] Divergenz-Pattern-Matching in Paper-Journey verbessern (18/74 disagree-Papers ohne Pattern)
- [ ] Paper v0.5: Divergenz-Muster-Verteilung (81/11/8) einarbeiten
- [ ] Merge zu main nach Browser-Test

---

## 2026-02-22 (Session 2): Kappa-Revision und Workflow-Analyse

**Branch:** `main`
**Dokumentiert in:** `knowledge/paper-integrity.md` Abschnitt 3.6, `knowledge/status.md` M6-Interpretation

### Was passiert ist

- Comprehensive Workflow-Analyse des gesamten Forschungsprozesses
- Kappa-Revision: Cohen's Kappa 0.035 als Prevalence-Bias-Artefakt identifiziert (Byrt et al. 1993)
- Entscheidung: Primaere Metriken sind Konfusionsmatrix + Basisraten, Kappa bleibt als Vergleichsanker

### Was wir gelernt haben

- **Prevalence-Bias-Paradox:** Bei 26 Prozentpunkten Basisraten-Differenz (LLM 68% vs. Human 42% Include) kollabiert Kappa, unabhaengig von der Bewertungsqualitaet. Das ist kein Fehler im Benchmark, sondern eine bekannte Eigenschaft von Kappa (Byrt et al. 1993).
- **Kappa ist kein primaerer Indikator fuer Human-LLM-Vergleiche:** Die Referenzliteratur (Woelfle, Hanegraaf, Sandner) verwendet Kappa fuer Human-Human-Vergleiche, wo Basisraten aehnlich sind. Fuer Human-LLM-Vergleiche mit systematischer Basisraten-Divergenz ist Kappa irrefuehrend.

---

## 2026-02-21 (Session 1): Knowledge-Konsolidierung Phase 2

**Branch:** `main`
**Commit:** `471dca1`

### Was passiert ist

- 13 redundante Dateien aus `knowledge/` geloescht
- `epistemic-framework.md` in `project.md` gemergt
- `methodology.md` + `technical.md` in `methods-and-pipeline.md` gemergt
- Redundanzregeln etabliert (jede Information hat genau einen kanonischen Ort)

### Was wir gelernt haben

- **Redundanz in Dokumentation ist Gift:** Wenn dieselbe Information an 3 Stellen steht, divergieren die Stellen innerhalb von 2 Sessions. Redundanzregeln brauchen explizite Zuweisung ("Benchmark-Ergebnisse NUR in status.md").
- **MEMORY.md ist der Schluessel:** Die Auto-Memory-Datei in `.claude/projects/` ueberlebt Session-Wechsel. Redundanzregeln dort festhalten verhindert Regression.

---

## 2026-02-18 (Sessions): Paper v0.4, SPA-Rebuild, Visualisierungen

**Branch:** `main`
**Commits:** `5d8bd36` bis `45998df`

### Was passiert ist

- Research Vault SPA komplett neu gebaut (4-Tab-Layout: Papers, Benchmark, Dashboard, Graph)
- Observable Plot durch Chart.js ersetzt (Observable Plot crashte im Static-Hosting-Kontext)
- Visualisierungen epistemisch reframed: Divergenz-Scatter, Slope Chart, Overlap-Treemap, Coverage Map
- Paper v0.4 geschrieben: 17.975 Zeichen (Limit 18.000), alle Abschnitte ausformuliert
- `knowledge/` konsolidiert (M1 abgeschlossen)

### Was wir gelernt haben

- **Observable Plot ist fuer Static Hosting ungeeignet:** Braucht ESM-Imports, die auf `file://` und einfachen Hosts Probleme machen. Chart.js via CDN funktioniert ueberall.
- **Visualisierungen brauchen epistemische Funktion:** Ein Radar-Chart zeigt Daten. Ein Slope Chart zeigt *Divergenz*, die Steigung ist die Aussage. Das ist der Unterschied zwischen "Daten darstellen" und "Wissen zeigen".
- **Confusion-Matrix-Bug:** `generate_docs_data.py` hatte eine fehlende Guard-Clause fuer Papers ohne Human-Assessment. Zeigte sich erst bei 326 Papers (vorher nur 210 getestet).

---

## Wiederkehrende Muster

### Was immer wieder hilft

1. **Mehrstrategie-Matching:** Nie auf ein einzelnes Signal verlassen (Titel, DOI, Autor). Immer Kaskade mit Fallbacks.
2. **LLM-Caching:** API-Ergebnisse sofort als JSON cachen. Erlaubt Vault-Regeneration ohne erneute API-Calls.
3. **Redundanzregeln:** Jede Information hat genau einen kanonischen Ort. Andere Stellen referenzieren, duplizieren nicht.
4. **Vanilla JS + CDN:** Fuer statische Seiten kein Build-Tool. D3 und Chart.js per CDN, IIFE-Pattern, fertig.
5. **TodoWrite konsequent nutzen:** Hilft nicht nur beim Tracking, sondern beim Denken. Aufgaben formulieren zwingt zur Klarheit.

### Was immer wieder schiefgeht

1. **Windows-Pfade:** `MAX_PATH`, `nul`-Datei (reservierter Geraetename), CP1252 statt UTF-8.
2. **Datenqualitaet in externen Quellen:** Zotero-Titel koennen HTML enthalten, Autorennamen sind nicht normalisiert, Jahreszahlen fehlen.
3. **Kappa-Interpretation:** Cohen's Kappa ist fuer symmetrische Vergleiche (Human-Human) entwickelt. Fuer asymmetrische Vergleiche (Human-LLM mit verschiedenen Basisraten) ist es irrefuehrend.
