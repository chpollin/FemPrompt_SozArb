# Screening decisions (PRISM)

This folder holds one deterministic PRISM decision file per reviewer.

## Editor workflow

1. Enter a personal key of two to twelve letters, numbers, hyphens, or underscores. PRISM normalises the key to lowercase and uses `docs/data/screening/<key>.json` as the target.
2. Select the root of the local repository once. PRISM resolves `docs/data/screening/` below it. Selecting the screening folder directly remains supported.
3. Read and assess a paper. Every selected category needs a Paper evidence pin. Pinning starts an empty category at `teilweise`; set `ja` explicitly when the aspect is central. Include also needs a complete, internally consistent `AN_` analysis record.
4. Press the disk icon beside the paper position. PRISM writes the complete reviewer file and reports the exact target or a write error.
5. Commit and push the changed file in GitHub Desktop. PRISM performs no Git action and creates no commit message.

The editor interface has no backup, import, reconciliation, project-administration, or report panel. Those data functions remain internal utilities and test contracts. The browser keeps a recovery copy when a physical write fails.

Both reviewers screen the full batch in operationally isolated sessions. Different reviewer keys produce different files. Git commit authorship records personal provenance while the short key keeps the research data compact.

## File format

```json
{
  "schema": "femprompt-prisma-reviewer/0.4",
  "reviewer": "cp",
  "actor": "human",
  "updated": "2026-08-22T12:00:00.000Z",
  "decisions": {
    "<paperId>": {
      "work_id": "work:...",
      "version_id": "version:...",
      "version_type": "version_of_record",
      "preferred_version_id": "version:...",
      "selected_version_is_preferred": true,
      "categories": { "Gender": 2 },
      "decision": "Exclude",
      "override": false,
      "reason": "Not_relevant_topic",
      "override_reason": null,
      "text_source": "raw",
      "evidence": {
        "Gender": [
          {
            "work_id": "work:...",
            "version_id": "version:...",
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

Schema 0.2 introduced evidence and the symmetric override. Schema 0.3 added `text_source` with `raw`, `abstract`, or `none`. Schema 0.4 is the current isolated capture format and binds the decision plus every new Paper evidence item to a stable Work and exact publication Version. `actor` and `source_layer` are additive provenance fields; legacy `origin` remains readable. Files using schema 0.1 through 0.3 still load. An offline historical Excel migration remains schema 0.3 until a corpus mapping is available; the normal in-app migration writes schema 0.4. PRISM writes new screening captures with paper identifiers in stable order.

Schema 0.5 is the governed productive format. It adds embedded `provenance`, immutable `annotations`, deterministic `checks`, and `lifecycle` objects to every decision. Its status sequence is `identified → curated → agent-annotated → ai-agent-reviewed → verified → publication-approved`. The verification mode preserves the complete 0.5 envelope. An expert outcome can accept, correct and accept, request changes, or reject. Corrections append a version with `supersedes`, reason, actor, timestamp, and field-level differences. The public Literature Landscape admits only `publication-approved` records.

The Codex-native agent path begins with two operationally isolated source-coding packets. Each packet is validated against its manifest, assigned Work and Paper Version, source hashes, controlled vocabularies, decision thresholds, and exact quotations. The orchestrator then projects it through PRISM's production validation, import, record-requirement, and serialization functions. New run manifests use schema 1.3; historical schemas remain valid records of their execution. Run manifests, packets, tracks, and reports live under `tests/review-cases/agent-runs/`. A productive projection always requires a separate source-grounded AI Agent Review and preserves actor, reviewer, Work-Version identity, text-source, source-hash, and evidence provenance. The visible PRISM interface remains available for domain-expert verification and browser acceptance testing.

`ar2.json` is the append-only schema-0.5 productive agent track. Exact run membership, work and record identities, transfer mode, integration product, and execution history are recorded in its `review_runs` entries and the corresponding directories under `tests/review-cases/agent-runs/`. Earlier visible PRISM pilots and later deterministic PRISM transfers retain their distinct provenance.

Every productive decision carries `status: ai-agent-reviewed`. Embedded provenance retains track references, prompt and model metadata where available, the Paper source and hash, ordered events, and the active annotation snapshot. Deterministic lifecycle-contract receipts appear under `checks` where the producing run recorded them. No record is marked `verified` or `publication-approved`. Exact integration products, raw tracks, reports, manifests, and executable checks remain under the corresponding directories in `tests/review-cases/agent-runs/`.

Earlier expert and model assessments come from `docs/data/research_vault_v2.json`. They stay hidden until the reviewer has saved the current decision. Records below `tests/review-cases/` are acceptance fixtures and do not become research decisions through test execution.
