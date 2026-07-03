# Screening decisions (PRISM)

This folder holds the per-reviewer decision files of the PRISM screening tool (`docs/prisma.html`).

## How it works

- Each reviewer screens independently into **their own file**, `<reviewer>.json` (the tool default is `reviewer1.json`). Reviewer ids are neutral (`reviewer1`, `reviewer2`); personal names and initials stay out of file names.
- The tool reads every `*.json` here to aggregate the flow diagram and the disclosure figures; it writes only the current reviewer's file.
- Per-reviewer files keep version control **conflict-free** (each person edits only their file) and match independent dual review (PRISMA-trAIce M8). Who decided what travels with the Git commit author (ADR-021).

## Workflow

1. Open `docs/prisma.html` (GitHub Pages, or a local server in your clone).
2. Panel "Daten & Sync": "Mit Projektordner verbinden" and pick the **repository root** of your clone (since P2/ADR-024). The tool derives this folder for the reviewer files and `generated/markdown_clean/` for the raw reading texts. Picking this folder directly still works but disables the raw texts (the tool shows a hint). Chromium browsers only; Firefox/Safari use Export/Import.
3. Screen. Every decision is written straight into `<reviewer>.json`.
4. Commit and push the written file with your usual tool (GitHub Desktop or the command line). Each reviewer only ever touches their own file, so this stays conflict-free.
5. Collaborators pull the update, reconnect, and see the aggregated state.

Both reviewers screen the full batch (decided 2026-07-03). How the second reviewer selects `reviewer2` is an open item in `knowledge/plan.md` (a UI switcher or a documented manual step), settled before the colleagues start.

## File format

```json
{
  "schema": "femprompt-prisma-reviewer/0.2",
  "reviewer": "reviewer1",
  "updated": "2026-07-03T12:00:00.000Z",
  "decisions": {
    "<paperId>": {
      "categories": { "Gender": true, "Soziale_Arbeit": true },
      "decision": "Include",
      "override": false,
      "reason": null,
      "override_reason": null,
      "text_source": "raw",
      "evidence": {
        "Gender": [
          { "term": "gendered scripts", "snippet": "...reproduce gendered scripts of care...", "ts": "...", "origin": "human" }
        ]
      },
      "ts": "...",
      "reviewer": "reviewer1"
    }
  }
}
```

Schema 0.2 adds `evidence` (pinned Belege per category, one `{term, snippet, ts, origin}` list per category, FR-13) and the symmetric override (ADR-023): an override to Exclude carries a required `reason` from the controlled vocabulary, an override to Include a required free-text `override_reason`. `text_source` (added additively under P2/ADR-024) records which text the decision was grounded on, one of `raw`, `knowledge_doc`, `abstract`, `none`; files without it load unchanged. A 0.1 file loads cleanly; the tool writes 0.2.

The AI assessment is not stored here; it comes from the corpus (`docs/data/research_vault_v2.json`). The built-in `seed` reviewer is the existing expert assessment from that corpus.
