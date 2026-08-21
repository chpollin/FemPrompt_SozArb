# Manual checklist: the paths no driver can take

The Playwright pilot (`tests/pilot/README.md`) covers cold load, screening, reload, export, import and the out-of-order load. The File System Access path needs the browser's native folder picker and its permission dialogs, which no automation reaches, so it is checked by a person in Chromium (Chrome or Edge) on a local clone served from `docs/` (for example `python -m http.server` in `docs/`). Record date, browser, and outcome per item in the journal when the check is run; a failed item keeps the work open.

1. Connect: open `prisma.html`, open the `Daten & Sync` panel, click `Mit Projektordner verbinden`, pick `docs/data/screening/` of the clone, grant read and write. The status line reads `verbunden, schreibt <reviewer>.json`.
2. Load: reviewer files already in the folder appear as additional tracks (a second reviewer's decisions are visible after `Reviewer-Dateien neu laden`); the own file, if present, wins over the localStorage cache.
3. Write: screen one paper and commit. `<reviewer>.json` in the folder changes, decisions sorted by paper id, schema `femprompt-prisma-reviewer/0.3`, the record carries `text_source`.
4. Rapid commits: screen three papers in quick succession. The file holds all three decisions (the write chain serializes overlapping writes).
5. Reconnect: reload the page, click `Erneut verbinden`, grant permission. The status line returns, the folder state is loaded.
6. Commit message: `Commit-Nachricht erzeugen` yields a message with the session counts and the file name; commit the file with GitHub Desktop or the command line, pull on a second clone, reconnect there, the decisions appear.
7. Denied permission: refuse the permission dialog once. The tool reports it and falls back to the localStorage cache and the export path without losing the session.
8. Unsupported browser (Firefox or Safari): the panel shows the export and import fallback only; the session round trip through export, clear, and import works there as in the pilot.
