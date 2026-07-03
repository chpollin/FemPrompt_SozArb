# Manual checklist (human-only verification)

What only a human in a real browser can verify; the counterpart to the committed harness (`tests/`), the replay self-test (`src/replay/`), and the agent click-tests S1 to S6. The test responsibility matrix lives in `knowledge/plan.md`. Findings go into `knowledge/journal.md`.

## File System Access (Chrome or Edge, real profile)

1. Connect: open the Daten & Sync panel, "Mit Projektordner verbinden", pick the **repository root** of a local clone. Expected: the connection bar shows the connection, no error dialog.
2. Raw text: open a paper that has a raw file in `generated/markdown_clean/`. Expected: source pill "Rohtext (lokal)", the Volltext layer shows the raw text, the KI-Extraktion toggle still shows the knowledge-document extraction.
3. `text_source`: record a decision on that paper and inspect the reviewer file. Expected: the record carries `"text_source": "raw"`.
4. Backward compatibility: connect `docs/data/screening/` directly (the pre-P2 target). Expected: a hint that raw texts are unavailable; the reviewer file is still written.
5. Write: record a decision and check that `docs/data/screening/<reviewer>.json` changed on disk (diff-stable, sorted by paper id).
6. Persistence: close and reopen the browser, reconnect. Expected: the stored handle is offered again (permission re-prompt is acceptable) and the state survives.

## Git round-trip

7. Commit the reviewer file (message from the commit-message generator), push, pull in a second clone, reconnect there. Expected: the aggregated state (flow, disclosure) reflects both files.

## Onboarding and browsers without File System Access

8. Dress rehearsal (plan P7): a colleague or a strict fresh-profile simulation follows `docs/onboarding.html` end to end without help from the builder.
9. Firefox or Safari: screening plus the Export/Import path works without a folder connection.

Everything the harness and the click-tests cover is out of scope here.
