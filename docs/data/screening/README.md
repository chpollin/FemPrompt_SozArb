# Screening decisions (PRISM)

This folder holds one deterministic PRISM decision file per reviewer.

## Editor workflow

1. Start PRISM from a local repository checkout with `start-prism.cmd` (or `python -X utf8 -m src.publish.start_prism`). The published GitHub Pages copy is read-only. In the local server session, select your assigned reviewer profile (Review A, Review B, or Review C; its tooltip names the target file) or enter a personal key in `Bearbeiten`. PRISM normalises the key to lowercase and writes `docs/data/screening/<key>.json` directly into the repository via the local server (ADR-047). Keys of built-in tracks and of agent tracks such as `ar2` are refused.
2. Each document shows its current annotation, the own saved record, otherwise the consolidated expert decision as a prefilled draft, otherwise an empty draft. PRISM shows no AI pre-assessment, neither the LLM assessment nor the productive agent record, and a document with only an agent record starts empty (ADR-044). Check and correct the colour toggles. A category level taken over unchanged from the expert decision needs no Paper evidence pin. Every category added, raised or lowered needs one. In the human screening mode, PRISM captures only the six relevance categories, text evidence, and the final Include/Exclude decision without `AN_` analysis fields (ADR-045).
3. Every complete decision is written automatically to `docs/data/screening/<key>.json` by the local server; the save button beside the paper position also triggers an immediate write. PRISM never writes the agent file.
4. Commit and push the changed `docs/data/screening/<key>.json` file in GitHub Desktop. PRISM performs no Git action and creates no commit message.

The editor interface has no backup, import, reconciliation, project-administration, or report panel. Those data functions remain internal utilities and test contracts. The browser keeps a recovery copy and the changed drafts per document. Every write re-reads the file and merges a change made outside the session, and a divergence it cannot order blocks the write until the reviewer keeps one version.

Different reviewer keys produce different files. Git commit authorship records personal provenance while the short key keeps the research data compact. A reviewer file that confirms or corrects the consolidated expert decision is not a second independent human assessment and must not be analysed as one.

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

Schema 0.2 introduced evidence and the symmetric override. Schema 0.3 added `text_source` with `raw`, `abstract`, or `none`. Schema 0.4 binds the decision plus every new Paper evidence item to a stable Work and exact publication Version and remains the shape of agent trial exports. A human record PRISM writes now also carries the embedded schema 0.5 contract, so a file of such records is written as 0.5. A record seeded from the expert decision lists it in `provenance.derived_from`, marks unchanged expert levels in `evidence_basis` as `expert_assessment`, and starts from a curated baseline with the basis `legacy_import` without any verification event. `actor` and `source_layer` are additive provenance fields; legacy `origin` remains readable. Files using schema 0.1 through 0.3 still load. An offline historical Excel migration remains schema 0.3 until a corpus mapping is available; the normal in-app migration writes schema 0.4. PRISM writes new screening captures with paper identifiers in stable order.

Schema 0.5 is the governed productive format. It adds embedded `provenance`, immutable `annotations`, deterministic `checks`, and `lifecycle` objects to every decision. Its status sequence is `identified → curated → agent-annotated → ai-agent-reviewed → verified → publication-approved`. PRISM preserves the complete 0.5 envelope of a loaded file. Earlier builds recorded an expert outcome over an agent record in `Bearbeiten`, an unchanged draft as accepted, a changed one as corrected and accepted, and request changes or reject as explicit choices with a note. Since ADR-044 PRISM records no new outcome, and existing entries remain valid. Corrections append a version with `supersedes`, reason, actor, timestamp, and field-level differences. The event itself is written into the verifying expert's own file under `verification_schema` `femprompt-prisma-verification/0.1` and the array `verifications`, never into the agent file it judges; on load it is projected onto the agent track (ADR-040). The Literature Landscape follows `config/publication_policy.json`: the explicitly authorised preliminary release also admits source-bound AI-reviewed records with attributed review receipts, while preserving their actual lifecycle status. Without an explicit policy, the publisher requires `publication-approved`.

The Codex-native agent path begins with two operationally isolated source-coding packets. Each packet is validated against its manifest, assigned Work and Paper Version, source hashes, controlled vocabularies, decision thresholds, and exact quotations. The orchestrator then projects it through PRISM's production validation, import, record-requirement, and serialization functions. New run manifests use schema 1.3; historical schemas remain valid records of their execution. Run manifests, packets, tracks, and reports live under `tests/review-cases/agent-runs/`. A productive projection always requires a separate source-grounded AI Agent Review and preserves actor, reviewer, Work-Version identity, text-source, source-hash, and evidence provenance. The visible PRISM interface remains available for browser acceptance testing. Human reviewers do not see the agent records (ADR-044), which remain a separate track for the later comparison of AI and human assessments.

`ar2.json` is the append-only schema-0.5 productive agent track. Exact run membership, work and record identities, transfer mode, integration product, and execution history are recorded in its `review_runs` entries and the corresponding directories under `tests/review-cases/agent-runs/`. Earlier visible PRISM pilots and later deterministic PRISM transfers retain their distinct provenance.

Every productive decision carries `status: ai-agent-reviewed`. Embedded provenance retains track references, prompt and model metadata where available, the Paper source and hash, ordered events, and the active annotation snapshot. Deterministic lifecycle-contract receipts appear under `checks` where the producing run recorded them. No record is marked `verified` or `publication-approved`. Exact integration products, raw tracks, reports, manifests, and executable checks remain under the corresponding directories in `tests/review-cases/agent-runs/`.

Earlier expert and model assessments come from `docs/data/research_vault_v2.json`. The expert decision prefills a document without an own record, mapping 1 to ja and 0 or null to nein and keeping the expert decision with an override where the derivation rule disagrees. An expert Exclude carries `Consolidated_expert_exclusion`. The LLM assessment is not shown in human sessions (ADR-044), and agent runs render neither. Records below `tests/review-cases/` are acceptance fixtures and do not become research decisions through test execution.

## Reviewer assignment

`assignment.json` (`femprompt-prisma-assignment/1.0`) is not a reviewer file. It splits the open documents, those with only an agent record and those without any assessment, between the two reviewers and maps each paper id to a reviewer key declared in its `reviewers` list. PRISM reads it for the list filter `Zuteilung` and never writes it, and `assignment` is refused as a reviewer key. `python -X utf8 -m src.assess.build_assignment` writes it. Within the agent-record group and within the unassessed group the papers alternate between the reviewers in corpus order. A rerun is append-only. It never reassigns an entry, keeps the entries of papers that have been done since, and only adds open papers without an entry. A paper can be handed to the other reviewer by editing its entry in this file. The contract is in `knowledge/data.md` (Reviewer assignment) and ADR-043.
