# tests/

Test fundament for the PRISM screening tool (plan P1). A zero-dependency test suite locks down the pure functions of `docs/js/prisma.js`: decision derivation, agreement metrics, flow aggregation, markdown escaping and parsing helpers, evidence handling, the commit guard, and the generated disclosure text.

## How to run

Two legs, same suite (`tests.js`), same inline fixtures.

Headless (node, the committed harness): run `npm install` once, then `npm test`. The runner `tests/run.mjs` injects the same four scripts (`prisma-data.js`, `prisma.js`, `prisma-import.js`, `tests.js`) into a jsdom window in the same order as the browser page, prints `PASS n/n` to stdout, and sets the process exit code (non-zero on any failure). jsdom is a dev dependency of this harness only; the app under `docs/` stays framework-free and dependency-free.

Browser: open `tests/run-tests.html` directly over `file://` or from a static server serving the repo root. No build step, no framework, no test data to fetch.

Results appear in three places so both humans and browser agents can read them:

- the page itself (one line per test, failures in red with the assertion message),
- `document.title` (`PASS n/n PRISM tests` or `FAIL k/n PRISM tests`),
- `window.__TEST_RESULTS__` (machine-readable object with the full result list).

The only network activity is `docs/js/prisma-data.js` attempting to load the research vault JSON; over `file://` and in the headless runner this fails, is caught by that script, and has no effect on the tests.

## Files

| File | Purpose |
|---|---|
| `run-tests.html` | Browser runner page. Loads `../docs/js/prisma-data.js` (real `window.EC.escapeHtml`), then `../docs/js/prisma.js` (whose appended exposure block attaches `window.EC._test`), then `../docs/js/prisma-import.js` (the import bridge, which exposes `window.__PRISMA_IMPORT_TEST__`), then `tests.js`. Load order matters: the data layer must come first so `window.EC` exists when the exposure block runs. |
| `run.mjs` | Headless node runner. Injects the same four scripts into a jsdom window, reads `window.__TEST_RESULTS__`, and exits non-zero on failure. Run with `npm test`. |
| `tests.js` | The suite: assert helpers, inline fixtures, all test cases, result rendering. |

## What is covered

- Decision derivation truth table: `deriveDecision` (at least one technical AND one social category yields Include), `finalDecisionOf` (override only demotes a derived Include), `divergent`.
- Agreement metrics on the canonical benchmark matrix: `computeMatrix` reproduces 100/34/108/49 on a synthetic 291-paper corpus; `cohenKappa` yields 0.0561; PABAK (0.0241), kappa-max (0.5081), prevalence (0.175) and bias index (0.254) are recomputed in-test from the matrix, since they are not implemented in `prisma.js`. The content-only sensitivity matrix 100/34/36/29 (n 199) yields kappa 0.194 and PABAK 0.296. All expected values are taken from `knowledge/verification-empirical-core.md` (Benchmark core table and content-only sensitivity table).
- Kappa edge cases: empty matrix (n = 0), degenerate marginals (pe = 1 guard), `kappaLabel` band boundaries.
- Flow aggregation: `computeFlow` for the seed perspective (no exclusion reasons on the seed track) and a reviewer perspective (reason counting), empty corpus, papers missing one or both tracks.
- Markdown escaping and parsing: `EC.escapeHtml`, `inlineMd`, and `renderMarkdown` against script-tag and attribute-injection input; frontmatter stripping; embedded yaml-block skipping; list, blockquote, paragraph-joining, and heading-cap behaviour; `countOcc` including the non-overlapping-match property.
- Evidence and quality helpers: `pinEvidence` (category set by pinning, term and snippet truncation, empty-term no-op), `unpinEvidence`, `evidenceCount`, `abstractQuality` (empty, boilerplate, short, acceptable).
- Persistence and commit: `reviewerPayload` schema `femprompt-prisma-reviewer/0.2`, the commit guard (Exclude requires a reason, override-Exclude likewise), the controlled exclusion-reason vocabulary, and `disclosureMarkdown` containing the canonical kappa and matrix.
- Evidence provenance (KI2, ADR-015): `pinEvidence` stamps `origin: human`; `evidenceListHtml` renders a neutral Mensch/KI marker per Beleg, defaults a Beleg without `origin` to human, and uses the same marker class for both origins (no valuation).
- Reading-column layer split and binding separation (M3, ADR-016): `splitDocLayers` separates the paper layer from the machine-extraction layer at the first `## Kernbefund` heading (and yields no AI layer for an abstract-only doc); a human-origin Beleg sets the binding category while an AI-origin Beleg does not, so AI-sourced evidence alone never flips the derived decision to Include, yet is still stored and rendered as KI.
- Import bridge validation (`window.__PRISMA_IMPORT_TEST__`, plan P3): the data-hygiene report on crafted CSV fixtures, a clean Include with no error-level findings, an out-of-vocabulary exclusion reason flagged and preserved verbatim, an empty reason on Exclude flagged, a duplicate Zotero key reported and the second row skipped, an Unclear decision skipped, and an idempotent re-import counted as unchanged.

Reviewer keys in fixtures are neutral ids (`r1`, `r2`).

## Test exposure block in prisma.js

The pure functions are closure-scoped inside the IIFE of `docs/js/prisma.js`. A single appended block at the end of that closure (directly before the final `})();`) builds one `TEST_HOOK` object and exposes it under two names; no existing line was changed and the block has no runtime effect on the tool. `window.EC._test` is the name the headless harness reads, present on `run-tests.html` because `prisma-data.js` loads first so `window.EC` already exists. `window.__PRISMA_TEST__` is the same object under a standalone global; it survives on the production page `prisma.html`, where `prisma.js` loads before `prisma-data.js` and the data layer then replaces `window.EC` (dropping `EC._test`). Because both names point at the same object, a browser-agent trace on the real page reaches the full surface, including the surface driver `showSurface` and the M3 reading-layer seams `setReadMode` and `splitDocLayers`. `state` and `work` are getters (`getState`, `getWork`), not direct references, since `work` is reassigned by `resetWork`.

## State hygiene

`commit()` persists app state to `localStorage` under `femprompt-prisma-state/0.2`. The suite snapshots that key before running and restores it afterwards, so running the tests from a served checkout does not pollute a same-origin PRISM session.

## Status

Executed and green: `npm test` reports PASS 73/73 headless under jsdom (jsdom is a dev dependency, pinned in `package.json`). The browser leg (`run-tests.html`) runs the identical suite.

## Relation to plan P1

Plan P1 names two test layers: the committed jsdom harness (node-based, dev dependencies allowed) and the browser runner. Both are now present and share one suite (`tests.js`): `run.mjs` plus `package.json` is the headless harness, `run-tests.html` the browser leg. Still open from P1: the additional acceptance checks remain a separate work item, namely export/import round-trip losslessness (FR-08), the seed reproducing the canonical benchmark from the real `research_vault_v2.json` rather than synthetic fixtures (FR-05), and the reviewer schema 0.1 to 0.2 migration. The current suite covers the pure functions, including the canonical kappa and matrix on synthetic fixtures.
