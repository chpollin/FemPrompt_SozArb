# Manual checklist: the paths no driver can take

What only a person in a real browser can verify. The counterpart to the committed harness (`tests/`), the replay self-test (`src/replay/`), and the supported-browser pilot (`tests/pilot/README.md`), which already covers cold load, screening, reload, export, import, the commit gate and the out-of-order load. The File System Access path needs the browser's native folder picker and its permission dialogs, which no automation reaches. Run it in Chromium (Chrome or Edge) on a local clone served from the repository (for example `python -m http.server` in `docs/`). Record date, browser and outcome per item in `knowledge/journal.md`; a failed item keeps the work open.

## File System Access

1. Connect to the repository root: open the `Daten & Sync` panel, choose `Mit Projektordner verbinden` and pick the **repository root** of the clone. Expected: the status line reads `verbunden (Repo-Wurzel), schreibt <reviewer>.json`, and `docs/data/screening/` is used even if it did not exist before.
2. Connect to the screening folder: repeat, picking `docs/data/screening/` directly. Expected: the status line reads `verbunden (Screening-Ordner)`, and writing still works. This is the pre-existing target and stays supported.
3. Load: reviewer files already in the folder appear as additional tracks (a second reviewer's decisions become visible after `Reviewer-Dateien neu laden`); a file on disk wins over the localStorage cache.
4. Write: screen one paper and commit. `<reviewer>.json` in the folder changes, decisions sorted by paper id, schema `femprompt-prisma-reviewer/0.3`, and the record carries `text_source`.
5. Rapid commits: screen three papers in quick succession. The file holds all three decisions, because the write chain serializes overlapping writes.
6. Reconnect and persistence: reload the page, choose `Erneut verbinden`, grant permission. Then close the browser entirely, reopen and reconnect. Expected: the stored handle is offered again, a permission re-prompt is acceptable, and the folder state is loaded.
7. Denied permission: refuse the permission dialog once. Expected: the tool says so, the status line stops claiming a connection, and the session survives in the localStorage cache with the export path available.
8. Unsupported browser (Firefox or Safari): the panel offers export and import only. Expected: the round trip through export, session clear and import works there as it does in the pilot.

## Git round trip

9. Commit the reviewer file with the message from the commit-message generator, push, pull in a second clone and reconnect there. Expected: the aggregated state (flow, disclosure) reflects both reviewer files, and `git blame` attributes each decision block to its author.
