# PRISM supported-browser pilot

Pinned contract for the lane `social-ai · prism-pilot` (Research Mission Control board). Two fixed, non-production test papers run through the complete screening path in a supported browser (Chromium via Playwright), in two isolated reviewer sessions, and the resulting reviewer files are reconciled deterministically. Nothing here touches production data: the pilot serves `docs/` as is and overlays only the corpus, the full-text manifest and the full texts with the fixtures below through request interception.

## Fixtures (pinned before execution)

| Paper id | Title | Text source expected | Why |
|---|---|---|---|
| `PILOT-A` | Pilot paper A (full text) | `raw` | has a fixture full text (`fixtures/fulltext/PILOT-A.md`) and no knowledge document |
| `PILOT-B` | Pilot paper B (abstract only) | `abstract` | no full text, no knowledge document; the reading pane falls back to the abstract |

`manifest.json` pins the two papers, their expected text sources and the scripted decisions per reviewer (`r1`, `r2`). The decisions are chosen so that paper A agrees and paper B diverges, which makes the reconciliation non-trivial. The fixture corpus (`fixtures/vault.json`) carries the same record shape as `docs/data/research_vault_v2.json`.

## Scenario per reviewer session

One isolated browser context per reviewer (own storage, own downloads directory), reviewer key seeded through the documented localStorage config before load.

1. Cold load of `prisma.html` against the fixture corpus; the screening surface opens on paper A with the `Volltext` pill.
2. Paper A: in-text search for the pinned term, pin the hit as a Beleg on the pinned category, set the remaining categories by chip, commit. The record carries `text_source: raw`, the Beleg and the reviewer key.
3. Paper B: `nur Abstract` pill; set categories per script, choose the exclusion reason where the derived decision is Exclude, commit. The record carries `text_source: abstract`.
4. Reload the page; both records are still present (localStorage save path) and locked.
5. Open the data panel, export the reviewer file (download captured to the session directory).
6. Clear the own session, confirm both papers are open again, import the exported file, confirm both records are restored with decision, evidence, reviewer key and `text_source`.
7. Export the decision-log CSV and check the `text_source` column.
8. Screenshots after steps 1, 2, 3, 4, 6; a JSON trace of every assertion in the session directory.

The File System Access write path (`showDirectoryPicker`) needs a native picker and stays on the manual checklist (`tests/manual-checklist.md`); the pilot covers save, reload, export and import.

## Reconciliation

`node tests/browser/reconcile.mjs <r1.json> <r2.json> [--out file]` loads the tool's `reconcileReviewers` through the headless harness and writes the reconciliation record. The verification runs it twice with reversed input order and compares the two outputs byte for byte and the input files' SHA-256 before and after.

## Regressions added with the pilot

- asynchronous reading loads: a slower response for a previously opened paper must not overwrite the pane of the paper opened later (`loadReadingInto` load token);
- raw-text resolution collisions: the full-text builder refuses an ambiguous first-author-year fallback instead of assigning the first match (`src/publish/build_fulltext.py`, `tests/test_build_fulltext.py`).

## Evidence

`evidence/<date>/` holds the committed evidence of an executed pilot: both reviewer exports, their traces, the decision logs, the reconciliation record in both input orders and from the in-tool export, the load-bearing screenshots per reviewer under `screenshots/`, and `sha256.txt` over every file beside it. The full screenshot set of a run stays local under `tests/browser/out/` (gitignored) and is reproduced by rerunning the driver. Most frames come out byte-identical between runs; the delayed-load frame and the post-reload frame do not, because scroll position and load timing differ, so the hashes record what was captured rather than a reproducibility claim.
