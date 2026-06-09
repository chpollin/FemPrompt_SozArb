# Screening decisions (Git-based PRISMA tool)

This folder holds the working data of the PRISMA screening tool (`docs/prisma.html`).

## How it works

- Each reviewer screens independently into **their own file**: `<reviewer>.json` (e.g. `sss.json`, `sk.json`).
- The tool reads every `*.json` here to aggregate the flow diagram, agreement, and reviewer reconciliation; it writes only the current reviewer's file.
- Per-reviewer files keep Git **conflict-free** (each person edits only their file) and match independent dual review (PRISMA-trAIce M8).

## Workflow

1. Open `docs/prisma.html` (local server in your clone, or GitHub Pages).
2. Tab "Daten & Repo": set your reviewer key, then "Mit Repo-Ordner verbinden" and pick **this folder** (`docs/data/screening/`). Chromium browsers only; Firefox/Safari use Export/Import.
3. Screen. Every decision is written straight into `<reviewer>.json`.
4. Commit and push:
   ```
   git add docs/data/screening/<reviewer>.json
   git commit -m "screening: N papers (<reviewer>)"
   git push
   ```
5. Collaborators `git pull`, open the tool, reconnect this folder, and see the aggregated state.

## File format

```json
{
  "schema": "femprompt-prisma-reviewer/0.1",
  "reviewer": "sss",
  "updated": "2026-06-09T12:00:00.000Z",
  "decisions": {
    "<paperId>": { "categories": { "Gender": true }, "decision": "Include", "reason": null, "ts": "...", "reviewer": "sss" }
  }
}
```

The AI assessment is not stored here; it comes from the corpus (`docs/data/research_vault_v2.json`). The built-in `seed` reviewer is the existing expert assessment from that corpus.
