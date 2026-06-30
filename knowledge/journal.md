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
updated: 2026-06-30
authors: [Christopher Pollin]
generated-with: Claude Code
related: [INDEX, plan, specification, design, verification]
---

# Arbeitsjournal

Chronologisches Protokoll der Arbeitssitzungen mit Entscheidungen, Ergebnissen und Learnings.

---

## 2026-06-29 (Session 21): Companion URL-state, a lean central store, shareable citable views

### What changed

1. **A central store coordinates the views.** `EC.store` (get/set/subscribe) is the Observer pattern the DH-interface standard prescribes for coordinated framework-free views. It holds the navigational state the URL serializes: active view, corpus filters, selected paper. The four views keep their internals and gained sync hooks (switchView, applyFilters, showPaperDetail, closePaperModal write the store); one subscriber mirrors the store into the location hash.
2. **A view is now a shareable, citable link.** The corpus filtered to one category with a paper open reproduces exactly when the link is opened. Only keys that differ from the defaults reach the hash, so a clean view stays a clean URL. View and paper changes are history steps (Back undoes them); filter and search churn replaces the current entry in place rather than flooding history. Restore runs on load, on Back/Forward, and on manual hash edits; the old bare `#view` links from the about and help pages stay compatible.
3. **The vault working tree was settled.** The Obsidian per-machine config (`vault/.obsidian/`) is gitignored, a stray empty paper note was dropped, and a paper note flagged as modified turned out to be a line-ending-only diff and was restored.

### Decided (the operator's)

- The store depth is the lean middle path, URL-state plus a minimal store, not the full event-bus rearchitecture. The functional driver is citable views, a genuine scholarly need, not pattern-matching, which keeps the change within YAGNI on working, tested code.

### Audit and fixes

An adversarial three-lens audit (correctness and loops, history and UX, security) over the new code confirmed several defects, all fixed and each guarded by a regression test verified red without its fix:

- Restore opened the paper against the full corpus, so the row highlight and detail prev/next walked the wrong index space; it now passes the rendered list.
- An unknown `cat=` key silently emptied the corpus; category keys are now validated against the category set at the deserialize trust boundary.
- A stale or unknown `paper=` id lingered in store and hash; restore now mirrors the state that was actually applied, cleaning a dead selection in place.
- A crafted `sort=` aborted the whole restore through an invalid selector; the value is assigned directly, since a select ignores an unknown option.
- Closing the modal left a spurious history entry that Back reopened, and one cross-view navigation wrote two entries; both are collapsed to a single intentional history step.

### Open items

- The full architecture, a typed event bus carrying semantic navigation intents and partitioned state, is the larger residual; the lean store already covers the cross-view coordination and the citable-URL goal.
- Detail prev/next arrowing pushes one history entry per paper, left as intended: each arrow is a deliberate navigation, so Back steps back through the papers viewed.
- The D3 concept graph and live chat streaming stay browser-only checks.

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

## Archiv (Sessions 1 bis 12b, kompakt)

Die frühen Sitzungen (2026-02-18 bis 2026-06-09, deutschsprachige Genese) verdichtet; der wörtliche Verlauf liegt in der Git-History, die tragenden Entscheidungen kanonisch in [[specification]], [[verification]] und [[methods]].

- **2026-06-09 (Session 12b):** Parallel-Implementierungswelle (Schreiber plus adversariale Verifizierer), Excel-Import-Brücke, Simulations-Ledger für Stakeholder-Entscheidungen, Paper-Outline und Stilproben.
- **2026-06-09 (Session 12):** PRISM v4 als evidence-grounded Screening-Tool implementiert, Volltextsuche und Beleg-Pinning, Blindmodus aufgelöst; die Verifizierer-Kette findet einen Faktenfehler in der bereits eingereichten Publikation.
- **2026-04-01 (Session 11):** 2x2-Experiment (Haiku/Sonnet x Abstract/Wissensdokument); die Divergenz erweist sich als strukturell, nicht datengetrieben; der Inklusions-Bias überlebt nur für die KD-Eingabe (Details in [[verification]]).
- **2026-04-01 (Session 10):** Repository-Audit gegen das Paper, englische Dokumentation abgeschlossen, Stage-1-Sektionierung korrigiert, Haiku und Sonnet divergieren qualitativ verschieden.
- **2026-03-27 (Session 9):** Human Assessment importiert und abgeschlossen; der Merge-Bug (sequentielle ID statt Zotero_Key) gefunden und behoben, Benchmark vollständig neu gerechnet (Zahlen in [[verification]]).
- **2026-03-24 (Session 8):** Kategorien-Explorer statt Bewertungsvergleich, Wissensnetz-Redesign mit Divergenz-Modus, Stats-Leiste im Header, Methoden-Seite, Datenfelder konsolidiert.
- **2026-03-24 (Session 6):** Wissens-Chat (Gemini) mit RAG-lite-Keyword-Suche, Quellenleiste mit Cross-View-Navigation, epistemischer Kreislauf geschlossen.
- **2026-03-24 (Session 6b-7):** Inline-Zitationen im Chat, Tab-Reihenfolge neu (Chat als Default), Header-Navigation als direkte Buttons, Rich-Data-Tooltips, Merge nach main.
- **2026-03-19 (Session 5):** Evidence Companion als einziges Frontend beschlossen, das Promptotyping-Interface verworfen, vollständiges Redesign, LLM-Confidence entfernt.
- **2026-02-22 (Session 4):** Promptotyping v2.1, epistemische Haltungen strukturell verankert (Stance-Sektionen), Featured Papers als narrative Anker.
- **2026-02-22 (Session 3):** Promptotyping v2 mit Vault v2 (Konzept-Extraktion, Divergenz-Klassifikation), vier Views (Sankey, Journey, Explorer, Navigator).
- **2026-02-22 (Session 2):** Kappa-Revision, das Prevalence-Bias-Paradox benannt, Kappa als primär für Human-Human-Vergleiche eingeordnet (siehe [[verification]]).
- **2026-02-21 (Session 1):** Knowledge-Konsolidierung Phase 2, redundante Dateien gelöscht, die Redundanzregel etabliert (ein kanonischer Ort pro Information).
