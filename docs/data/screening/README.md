# Screening decisions (PRISM)

This folder holds one deterministic PRISM decision file per reviewer.

## Editor workflow

1. Enter a personal key of two to twelve letters, numbers, hyphens, or underscores. PRISM normalises the key to lowercase and uses `docs/data/screening/<key>.json` as the target.
2. Select the root of the local repository once. PRISM resolves `docs/data/screening/` below it. Selecting the screening folder directly remains supported.
3. Read and assess a paper. Every selected category needs a Paper evidence pin. Pinning starts an empty category at `teilweise`; set `ja` explicitly when the aspect is central. Include also needs a complete, internally consistent `AN_` analysis record.
4. Press the disk icon beside the paper position. PRISM writes the complete reviewer file and reports the exact target or a write error.
5. Commit and push the changed file in GitHub Desktop. PRISM performs no Git action and creates no commit message.

The editor interface has no backup, import, reconciliation, project-administration, or report panel. Those data functions remain internal utilities and test contracts. The browser keeps a recovery copy when a physical write fails.

Both reviewers screen the full batch independently. Different reviewer keys produce different files. Git commit authorship records personal provenance while the short key keeps the research data compact.

## File format

```json
{
  "schema": "femprompt-prisma-reviewer/0.3",
  "reviewer": "cp",
  "actor": "human",
  "updated": "2026-08-22T12:00:00.000Z",
  "decisions": {
    "<paperId>": {
      "categories": { "Gender": 2 },
      "decision": "Exclude",
      "override": false,
      "reason": "Not_relevant_topic",
      "override_reason": null,
      "text_source": "raw",
      "evidence": {
        "Gender": [
          {
            "term": "gendered scripts",
            "snippet": "...reproduce gendered scripts of care...",
            "ts": "...",
            "origin": "human",
            "source_layer": "paper",
            "actor": "human"
          }
        ]
      },
      "ts": "...",
      "reviewer": "cp",
      "actor": "human"
    }
  }
}
```

Schema 0.2 introduced evidence and the symmetric override. Schema 0.3 adds `text_source` with `raw`, `abstract`, or `none`. `actor` and `source_layer` are additive provenance fields; legacy `origin` remains readable. Files using schema 0.1 or 0.2 still load. PRISM writes schema 0.3 with paper identifiers in stable order.

Agentenpiloten use `?trial=1&actor=agent&reviewer=<key>`. They write no production file during the run and export their isolated track through the visible `Testdaten exportieren` action. Their manifests and reports live under `tests/review-cases/agent-runs/`. A later production merge requires explicit operator acceptance and preserves the exported actor, reviewer, text-source, and evidence provenance.

`ar2.json` is the provisionally and technically accepted ten-paper agent track from `agent-v03-10b-20260822` plus its blinded source-repair supplement. The records are real versioned research data, while their substantive judgements and the pilot publication-type rule still require methodological ratification. The integrated evaluation and executable verification live beside the run manifest.

Earlier expert and model assessments come from `docs/data/research_vault_v2.json`. They stay hidden until the independent reviewer decision has been saved. Records below `tests/review-cases/` are acceptance fixtures and never become research decisions without explicit human acceptance.
