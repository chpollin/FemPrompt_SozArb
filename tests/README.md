# tests/

Test fundament for the PRISM screening tool (plan P1, browser leg). A zero-dependency test runner locks down the pure functions of `docs/js/prisma.js`: decision derivation, agreement metrics, flow aggregation, markdown escaping and parsing helpers, evidence handling, the commit guard, and the generated disclosure text.

## How to run

Open `tests/run-tests.html` in any browser, directly over `file://` or from a static server serving the repo root. There is no build step, no framework, and no test data to fetch; all fixtures are inline in `tests.js`.

Results appear in three places so both humans and browser agents can read them:

- the page itself (one line per test, failures in red with the assertion message),
- `document.title` (`PASS n/n PRISM tests` or `FAIL k/n PRISM tests`),
- `window.__TEST_RESULTS__` (machine-readable object with the full result list).

The only network activity is `docs/js/prisma-data.js` attempting to load the research vault JSON; over `file://` this fails, is caught by that script, and has no effect on the tests.

## Files

| File | Purpose |
|---|---|
| `run-tests.html` | Runner page. Loads `../docs/js/prisma-data.js` (real `window.EC.escapeHtml`), then `../docs/js/prisma.js` (whose appended exposure block attaches `window.EC._test`), then `tests.js`. Load order matters: the data layer must come first so `window.EC` exists when the exposure block runs. |
| `tests.js` | The suite: assert helpers, inline fixtures, all test cases, result rendering. |

## What is covered

- Decision derivation truth table: `deriveDecision` (at least one technical AND one social category yields Include), `finalDecisionOf` (override only demotes a derived Include), `divergent`.
- Agreement metrics on the canonical benchmark matrix: `computeMatrix` reproduces 100/34/108/49 on a synthetic 291-paper corpus; `cohenKappa` yields 0.0561; PABAK (0.0241), kappa-max (0.5081), prevalence (0.175) and bias index (0.254) are recomputed in-test from the matrix, since they are not implemented in `prisma.js`. The content-only sensitivity matrix 100/34/36/29 (n 199) yields kappa 0.194 and PABAK 0.296. All expected values are taken from `knowledge/verification-empirical-core.md` (Benchmark core table and content-only sensitivity table).
- Kappa edge cases: empty matrix (n = 0), degenerate marginals (pe = 1 guard), `kappaLabel` band boundaries.
- Flow aggregation: `computeFlow` for the seed perspective (no exclusion reasons on the seed track) and a reviewer perspective (reason counting), empty corpus, papers missing one or both tracks.
- Markdown escaping and parsing: `EC.escapeHtml`, `inlineMd`, and `renderMarkdown` against script-tag and attribute-injection input; frontmatter stripping; embedded yaml-block skipping; list, blockquote, paragraph-joining, and heading-cap behaviour; `countOcc` including the non-overlapping-match property.
- Evidence and quality helpers: `pinEvidence` (category set by pinning, term and snippet truncation, empty-term no-op), `unpinEvidence`, `evidenceCount`, `abstractQuality` (empty, boilerplate, short, acceptable).
- Persistence and commit: `reviewerPayload` schema `femprompt-prisma-reviewer/0.2`, the commit guard (Exclude requires a reason, override-Exclude likewise), the controlled exclusion-reason vocabulary, and `disclosureMarkdown` containing the canonical kappa and matrix.

Reviewer keys in fixtures are neutral ids (`r1`, `r2`).

## Test exposure block in prisma.js

The pure functions are closure-scoped inside the IIFE of `docs/js/prisma.js`. A single appended block at the end of that closure (directly before the final `})();`) exposes them as `window.EC._test`; no existing line was changed and the block has no runtime effect on the tool. On the production page `prisma.html`, where `prisma.js` loads before `prisma-data.js`, the data layer replaces `window.EC` afterwards, so the hook does not exist there. The older `window.__PRISMA_TEST__` hook (for the jsdom harness) is untouched.

## State hygiene

`commit()` persists app state to `localStorage` under `femprompt-prisma-state/0.2`. The suite snapshots that key before running and restores it afterwards, so running the tests from a served checkout does not pollute a same-origin PRISM session.

## Status

The suite was written without an executable shell or browser in the authoring session and has not been executed yet. First execution (open `run-tests.html`, read `document.title`) is the immediate next step; any failures will be assertion-level and visible per test on the page.

## Relation to plan P1

Plan P1 names two test layers: the committed jsdom harness (node-based, dev dependencies allowed) and this browser runner. This directory currently contains only the browser leg; the jsdom harness and its `package.json` are a separate commitment.
