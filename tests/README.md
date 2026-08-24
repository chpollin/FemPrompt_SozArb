# tests/

Test foundation for the PRISM screening tool (plan P1). The shipped application remains framework-free; the test harness uses jsdom and Playwright as development dependencies. It covers decision derivation, flow aggregation, rendering helpers, evidence and analysis gates, persistence, agent provenance, operator conversion, and generated report data.

## How to run

Two legs, same suite (`tests.js`), same inline fixtures.

Headless (node, the committed harness): run `npm install` once, then `npm test`. The runner `tests/run.mjs` injects the same four scripts (`prisma-data.js`, `prisma.js`, `prisma-import.js`, `tests.js`) into a jsdom window in the same order as the browser page, prints `PASS n/n` to stdout, and sets the process exit code (non-zero on any failure). The app under `docs/` stays framework-free. Its small runtime dependency set is pinned under `docs/vendor/`; jsdom and Playwright remain development dependencies.

Browser: serve the repository root with a local static server and open `tests/run-tests.html`. The runner fetches the generated category schema before evaluating the production scripts. No build step or framework is required.

Results appear in three places so both humans and browser agents can read them:

- the page itself (one line per test, failures in red with the assertion message),
- `document.title` (`PASS n/n PRISM tests` or `FAIL k/n PRISM tests`),
- `window.__TEST_RESULTS__` (machine-readable object with the full result list).

The browser runner fetches the generated category schema, analysis vocabulary, and seed before loading the production logic. It does not start the application UI. The headless runner rejects network requests and injects the same generated inputs from disk.

## Files

| File | Purpose |
|---|---|
| `run-tests.html` | Browser runner page. Loads `../docs/js/prisma-data.js` (real `window.EC.escapeHtml`), then `../docs/js/prisma.js` (whose appended exposure block attaches `window.EC._test`), then `../docs/js/prisma-import.js` (the import bridge, which exposes `window.__PRISMA_IMPORT_TEST__`), then `tests.js`. Load order matters: the data layer must come first so `window.EC` exists when the exposure block runs. |
| `prisma-window.mjs` | The shared jsdom bootstrap: loads `prisma-data.js` before `prisma.js` and stubs `fetch`. Written once because that order carries the `window.EC._test` hook; used by `run.mjs` and by `browser/reconcile.mjs`. |
| `run.mjs` | Headless node runner. Injects the same four scripts into a jsdom window, reads `window.__TEST_RESULTS__`, and exits non-zero on failure. Run with `npm test`. |
| `tests.js` | The suite: assert helpers, inline fixtures, all test cases, result rendering. |
| `browser/pilot.mjs` | Supported-browser pilot (Playwright, Chromium): one isolated reviewer session end to end against the pinned fixtures in `tests/pilot/`, see `tests/pilot/README.md`. `npm run pilot -- --reviewer r1 --out tests/browser/out/r1`. |
| `browser/companion.mjs` | Public Companion acceptance run in Chromium. It covers the Literature Landscape, responsive layout, URL restoration, keyboard drill-down, local runtime assets, and browser errors. Run with `npm run test:browser-companion`. |
| `browser/reconcile.mjs` | Deterministic reconciliation of reviewer files through the tool's own `reconcileReviewers`; `--check` proves order independence, the SHA-256 lines prove the inputs were not touched. |
| `review-cases/validate-run-contract.mjs` | Work-Version agent-run contract: representative and alias record IDs, exact assigned publication Versions, frozen inputs, source hashes, model and prompt provenance, track separation, deterministic PRISM transfer, artifact hashes, outputs, and completion state. |
| `review-cases/validate-coding-packet.mjs` | Source-coding packet contract: exact assigned works, all ten categories, controlled analysis vocabulary, decision derivation, source hashes, and character-exact Paper quotations. |
| `review-cases/build-prism-track.mjs` and `roundtrip-prism-track.mjs` | Deterministic projection of coding packets through PRISM's production validation, import, record-requirement, and export functions. The round-trip establishes frontend data compatibility; it does not emulate visible interaction. |
| `review-cases/validate-ai-agent-review.mjs` | Separate source-grounded AI Agent Review: complete adjudication, controlled values, Paper quotation fidelity, difference resolution, and accepted output. |
| `review-cases/build-ai-agent-product.mjs` | Alias-aware projection of accepted Work-level judgements into version-aware schema-0.4 and productive schema-0.5 record products; historical run schemas retain their original schema-0.3 projection. |
| `test_build_fulltext.py` | pytest: full-text identity checks, fail-closed ambiguity and mismatch handling, and atomic publication rollback. |
| `test_screening_lifecycle.py` | pytest: schema-0.5 migration, role-gated lifecycle transitions, immutable corrections, and hash-bound validation receipts. |
| `test_merge_ai_agent_product.py` | pytest: append-only productive merge, idempotence, divergent-overwrite refusal, and atomic output. |
| `test_build_agent_screening_queue.py` | pytest: work-level human and AI coverage, alias handling, source readiness, and blocked queue generation. |
| `test_build_round2_intake.py` | pytest: RIS lane parsing, cross-lane deduplication, corpus matching, Zotero-export drift, and intake gating. |
| `test_round2_intake_package.py` | pytest: reconciliation of the three agent reviews, conflict withholding, safe RIS generation, and Version addressability. |
| `test_work_versions.py` | pytest: Work-Version coverage, controlled stages, preferred/latest selection, relation integrity, and distinct Preprint/Version-of-Record expressions. |
| `test_validate_research_vault.py` | pytest: the project-specific Grounded Vault status ladder, adjacent-layer anchors, required checks, and status ceilings. |

## What is covered

- Decision derivation truth table: `deriveDecision` (level 2 in both dimensions yields Include; level 1 in both yields Unclear; an empty dimension yields Exclude), `finalDecisionOf` with justified overrides, and `divergent`.
- Agreement metrics (removed with ADR-017): the human-AI agreement section (`computeMatrix`, `cohenKappa`, `kappaLabel` and the canonical-benchmark tests) left the tool. Agreement is no longer computed in-tool and no JS test recomputes it.
- Flow aggregation: `computeFlow` for the seed perspective (no exclusion reasons on the seed track) and a reviewer perspective (reason counting), empty corpus, papers missing one or both tracks.
- Markdown escaping and parsing: `EC.escapeHtml`, `inlineMd`, and `renderMarkdown` against script-tag and attribute-injection input; frontmatter stripping; embedded yaml-block skipping; list, blockquote, paragraph-joining, and heading-cap behaviour; `countOcc` including the non-overlapping-match property.
- Evidence and quality helpers: `pinEvidence` (Paper pin starts an empty category at level 1, term and snippet truncation, empty-term no-op), `unpinEvidence`, `evidenceCount`, `abstractQuality` (empty, boilerplate, short, acceptable).
- Persistence and commit: `reviewerPayload` schema `femprompt-prisma-reviewer/0.4`, exact Work-Version provenance on new records, the commit guard (Exclude requires a reason, override-Exclude likewise), the controlled exclusion-reason vocabulary, and `disclosureMarkdown` carrying the screening count and the external M9/R2 reference (no in-tool kappa or matrix, ADR-017).
- Evidence provenance (ADR-030): `pinEvidence` stores source layer and actor separately, retains `origin` for compatibility, and `evidenceListHtml` renders the neutral source marker Paper or LLM. Legacy evidence without provenance defaults to the Paper layer.
- Reference blindness (ADR-030): saved human records mount prior references only after the reviewer opens the comparison. Agent mode renders no comparison surface, so hidden DOM inspection cannot expose earlier judgements.
- Reading-column layer split and binding separation (M3, ADR-016/030): `splitDocLayers` separates the paper layer from the machine-extraction layer at the first `## Kernbefund`; Paper evidence starts an empty category at `teilweise`, while LLM-distillate evidence leaves it unset and cannot satisfy the save gate. An explicit reviewer action is required for `ja`.
- Text-source and Version provenance, load-token guard, decision log and deterministic reconciliation (Section L, ADR-027/037): `applyReading` sets `text_source` from what is shown and drops a stale response, `commit` records it with exact Work-Version identity, `decisionLogCsv` carries the source column, the disclosure reports per-source counts, `reconcileReviewers` classifies agree / divergent / single, is order-independent and never mutates its inputs.
- Import bridge validation (`window.__PRISMA_IMPORT_TEST__`, plan P3): three-level historical CSV categories, fail-closed unknown categories, decisions and exclusion reasons, duplicate-key rejection, derivation consistency, representable Exclude overrides, collision protection, idempotent re-import, and exact Work-Version binding when the corpus mapping is loaded. Converted positive categories still need Paper evidence and Include analysis in PRISM.
- Reading and publication (ADR-025/027/031): manifest-based local full text with metadata-abstract fallback, loaded-source gating, stale-response rejection, hidden pre-save distillate, and `text_source` persistence. Pytest separately verifies the publisher's source identity and atomic replacement rules.
- Lifecycle and authority (ADR-034/035): deterministic validation remains separate from AI Agent Review, domain-expert verification, and publication approval. The browser pilot observes a non-advancing `changes_requested` result, an immutable expert correction, and the separate public-release transition.
- Codex-native batch execution: Work-level assignments preserve aliases and bind the exact Paper Version, two source-coding packets validate independently, a separate AI Agent Review resolves differences against that Paper layer, PRISM's production functions round-trip the accepted data, and the append-only merge refuses record replacement.

Pure-function fixtures use neutral ids such as `r1` and `r2`; the supported-browser pilot deliberately runs the distinct keys `cp` and `ms` to catch hard-coded reviewer assumptions.

## Test exposure block in prisma.js

The pure functions are closure-scoped inside the IIFE of `docs/js/prisma.js`. A single appended block at the end of that closure (directly before the final `})();`) builds one `TEST_HOOK` object and exposes it under two names; no existing line was changed and the block has no runtime effect on the tool. `window.EC._test` is the name the headless harness reads, present on `run-tests.html` because `prisma-data.js` loads first so `window.EC` already exists. `window.__PRISMA_TEST__` is the same object under a standalone global; it survives on the production page `prisma.html`, where `prisma.js` loads before `prisma-data.js` and the data layer then replaces `window.EC` (dropping `EC._test`). Because both names point at the same object, a browser-agent trace on the real page reaches the full surface, including the surface driver `showSurface` and the M3 reading-layer seams `setReadMode` and `splitDocLayers`. `state` and `work` are getters (`getState`, `getWork`), not direct references, since `work` is reassigned by `resetWork`.

## State hygiene

Production recovery state uses `femprompt-prisma-state/0.2`; isolated trial runs use `femprompt-prisma-trial-state/0.1`. The suite snapshots and restores the production key. The browser pilot verifies that a same-origin trial cannot read or overwrite the production reviewer cache, and vice versa.

## Status

Executed and green: `npm test` reports `PASS n/n` headless under jsdom (jsdom is a dev dependency, pinned in `package.json`); the runner output is the source of truth for the current count. The browser leg (`run-tests.html`) runs the identical suite, and the supported-browser pilot (`npm run pilot`, contract in `tests/pilot/README.md`) drives the real page in Chromium.

## Relation to plan P1

Plan P1 names two test layers: the committed jsdom harness (node-based, dev dependencies allowed) and the browser runner. Both are present and share one suite (`tests.js`): `run.mjs` plus `package.json` is the headless harness, `run-tests.html` the browser leg. The P1 acceptance checks are in the suite: export/import round-trip losslessness (FR-08), the reviewer schema migration from 0.1 to the current version (Section H), and the seed reproducing the canonical benchmark marginals from the real `research_vault_v2.json`, which the runner injects. What the harness deliberately does not assert (in-tool kappa and matrix, ADR-017) belongs to the offline benchmark data; the retrospective counts and agreement figures are asserted by the committed replay (`src/replay/`), the third layer in the test responsibility matrix in `knowledge/plan.md`. The paths no automation can take are listed in `tests/manual-checklist.md`.
