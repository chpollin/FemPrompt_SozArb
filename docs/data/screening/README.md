# Screening decisions (PRISMA screening tool)

This folder holds the working data of the PRISMA screening tool (`docs/prisma.html`).

## How it works

- Each reviewer screens independently into **their own file**: `<reviewer>.json` (e.g. `sss.json`, `sk.json`).
- The tool reads every `*.json` here to aggregate the flow diagram and the disclosure figures; it writes only the current reviewer's file.
- Per-reviewer files keep version control **conflict-free** (each person edits only their file) and match independent dual review (PRISMA-trAIce M8).

## Workflow

1. Open `docs/prisma.html` (local server in your clone, or GitHub Pages).
2. Tab "Daten & Repo": set your reviewer key, then "Mit Projektordner verbinden" and pick **this folder** (`docs/data/screening/`). Chromium browsers only; Firefox/Safari use Export/Import.
3. Screen. Every decision is written straight into `<reviewer>.json`.
4. Save and upload the written file with your usual tool (GitHub Desktop or the command line). Each reviewer only ever touches their own `<reviewer>.json`, so this stays conflict-free.
5. Collaborators pull the update, open the tool, reconnect this folder, and see the aggregated state.

## File format

```json
{
  "schema": "femprompt-prisma-reviewer/0.2",
  "reviewer": "sss",
  "updated": "2026-06-09T12:00:00.000Z",
  "decisions": {
    "<paperId>": {
      "categories": { "Gender": true, "Soziale_Arbeit": true },
      "decision": "Include",
      "override": false,
      "reason": null,
      "evidence": {
        "Gender": [
          { "term": "gendered scripts", "snippet": "...reproduce gendered scripts of care...", "ts": "..." }
        ]
      },
      "ts": "...",
      "reviewer": "sss"
    }
  }
}
```

Schema 0.2 adds `evidence` (pinned Belege per category, one `{term, snippet, ts}` list per category, FR-13) and `override` (a derived Include demoted to Exclude, with a required `reason`). A 0.1 file without these fields loads cleanly; the tool writes 0.2.

The AI assessment is not stored here; it comes from the corpus (`docs/data/research_vault_v2.json`). The built-in `seed` reviewer is the existing expert assessment from that corpus.
