# PRISM supported-browser pilot

The Chromium pilot exercises the current editor contract with three non-production papers and isolated reviewer keys. Request interception supplies the fixture corpus, full-text manifest, search index, and paper texts. Production screening files are never read or changed.

## Fixtures

| Paper id | Text source | Contract covered |
|---|---|---|
| `PILOT-A` | `raw` | full-text search, UI-driven evidence correction, Include gates, and UI-driven analysis coding |
| `PILOT-B` | `abstract` | abstract fallback, DOI link, and the second decision path |
| `AIGLDZ4C` | `raw` | removal of a repeated source URL, compact source hyperlink, and author fallback |

`manifest.json` defines the expected decision for the keys `cp` and `ms`. Each run starts with a fresh browser context.

## Covered workflow

1. Set and canonicalise a short reviewer key.
2. Keep the disk action disabled until a working folder is connected.
3. Resolve the repository root to `docs/data/screening/` through a fake directory handle with the same browser API surface.
4. Read, search, attach and correct evidence through the visible controls.
5. Complete multi-select, undecidable, and notes fields through the analysis UI.
6. Save through the disk icon and verify the actual JSON written to the fake reviewer file.
7. Reload and confirm reviewer key, decisions, text source, and locked records.
8. Verify serial writes, immutable folder targets for queued writes, queue recovery after one failed write, explicit write-error feedback, malformed-file write blocking, pending-text gating, and stale-response rejection.
9. Verify separate same-origin storage for trial and production tracks, reference blindness before save, Paper-layer reset after navigation, direct paper links, accessible info popovers, compact metadata, source links, responsive behaviour, and the full-text priority over the assessment rail.

Pure export, import, decision-log, and reconciliation functions are tested in `tests/tests.js` and `tests/browser/reconcile.mjs`. They have no daily editor control and are intentionally absent from this browser workflow.

Run one reviewer session with:

```text
npm run pilot -- --reviewer cp --port 8767 --out tests/browser/out/cp
```

Run the second with `--reviewer ms` and a different port. The native folder picker and permission persistence remain in `tests/manual-checklist.md`.
