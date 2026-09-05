---
title: Testing
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: complete
language: en
version: "0.7"
created: 2026-08-23
updated: 2026-09-05
authors: [Christopher Pollin]
generated-with: Codex (GPT-5.6)
topics: ["[[Software Testing]]", "[[Research Software]]"]
related: [specification, data, governance, verification, methods]
---

# Testing

The test system establishes the technical behaviour of PRISM, the Evidence Companion, the agent-run contracts, the publication pipeline, and the Grounded Vault validators. Test success supports claims about implemented behaviour. Scholarly correctness requires the separate verification process in [[verification]].

## Test layers

| Layer | Scope | Principal entry point |
|---|---|---|
| PRISM unit and integration tests | Category logic, evidence gates, analysis coding, persistence, import, serialization, lifecycle rendering | `npm test` |
| Python tests | Publishers, source identity, lifecycle validation, queue and intake builders, Grounded Vault checks | `python -m pytest tests/` |
| PRISM browser pilot | Editor flow, persistence, recovery, acceptance mode, responsive behaviour | `npm run pilot` |
| Evidence Companion browser test | Public Literature Landscape, navigation state, accessibility interactions, local runtime assets | `node tests/browser/companion.mjs` |
| Agent-run validators | Manifest, coding packet, PRISM track, AI Agent Review, append-only merge | Commands documented in `tests/README.md` and the project skill |
| Work-Version registry | Stable identity, controlled publication stages, preferred/latest selection, relations, Zotero and intake coverage | `python -m pytest tests/test_work_versions.py tests/test_round2_intake_package.py` |
| Contextual update intake | Cross-lane Tier-A deduplication, original-window preservation, Work-Version relation, Zotero target, unscreened lifecycle state | `python -m pytest tests/test_contextual_update_package.py` |
| Codex Websearch 2026 | Strict selected-Version date boundary, cross-lane deduplication, Zotero-export withholding, bibliographic-audit reconciliation, unscreened lifecycle state | `python -m pytest tests/test_codex_websearch_2026.py` |
| Codex source preparation | Rights gate, preferred/acquired Version separation, resumable PDF validation, repository-HTML representations, exact candidate coverage, agent-QC authority, repaired-source selection, visual-evidence blocking, and fail-closed Zotero binding | `python -m pytest tests/test_acquire_codex_websearch_2026.py tests/test_codex_source_readiness.py` |
| Claim and Vault checks | Assertion anchors, adjacent-layer references, status discipline | `python -m src.publish.check_claims` and `python -m src.publish.validate_research_vault` |

## Guaranteed behaviours

The automated suites cover the following contracts.

- Every positive category requires Paper-layer evidence.
- Include records require complete analysis coding under the controlled vocabulary.
- Source identity conflicts fail closed before a full text can enter screening.
- Every Zotero record and round-two candidate resolves to one stable Work and one exact Version; all Version relations resolve inside that Work.
- Preferred and latest Versions are derived independently, and a retracted Version cannot become preferred.
- Full-text manifests, new reviewer files, agent runs, evidence items, active distillates, and public projections retain exact Work-Version bindings.
- Reviewer files serialize deterministically and preserve actor and source provenance.
- Browser recovery and repository files reconcile per Paper without silent overwrite.
- Agent coding packets pass through PRISM's production validation, import, record-requirement, and serialization functions.
- Validation receipts bind to the hash of the checked annotation.
- Lifecycle transitions require authorised actor roles and valid predecessor states.
- Productive agent merges are append-only and reject divergent overwrite.
- Public literature projections enforce the configured release policy; AI-reviewed records require attributed artifact/source-hash-bound receipts. The default publisher without an explicit policy retains its human publication-approval gate.
- Accepted AI analysis corrections preserve the original annotations and bind their exact original hash, before/after fields and source-reviewed correction artifact.
- Duplicate bibliographic records contribute once per Work to result aggregations; conflicting eligible codings stop publication.
- The result-site allowlist excludes raw screening files and full-text assets, and its downloadable research JSON is byte-identical to the site data.
- Grounded chat contexts contain released Assertions and exact source evidence; no-evidence queries remain local and provider answers require supplied evidence identifiers.
- Grounded Vault outputs cannot exceed the authority state of their supporting layer.

## Manual acceptance boundary

The native browser permission dialogue for the File System Access API remains a manual environment check because headless automation cannot grant the browser-owned permission. `tests/manual-checklist.md` defines that check. Domain-expert usability and scholarly verification are research activities and therefore remain outside technical test success.

## Clean-checkout verification

A repository-only verification uses Python 3.11 or later, `requirements-build.txt`, `npm ci`, and `npx playwright install chromium`. Run `npm run build`, then `npm run check`, `npm run test:browser-companion`, and `npm run pilot`. The build reconstructs the ignored local reading layer, source queues, corpus projections and separate result site without external API calls. The read-only `check:data` rejects changed inputs, missing outputs or stale hashes. Hash-bearing research artifacts use canonical LF text so their checksums remain stable across operating systems. The browser pilot selects an available local port by default; `--port` remains available for explicit binding.

`.github/workflows/quality.yml` runs the same gates in CI. `.github/workflows/pages.yml` is manually dispatched on main and uploads only the checked `build/site/` artifact. A successful local test does not establish that either remote workflow has run.

## Change gates

| Change | Required checks |
|---|---|
| Screening behaviour or persistence | PRISM tests, Python tests, browser pilot |
| Evidence Companion interface or projection | Companion tests and browser test |
| Lifecycle or productive record schema | Python tests and all agent-run validators |
| Work identity, publication Version, or bibliographic intake | Work-Version and round-two intake tests, registry `--check`, data regeneration |
| Dated contextual search supplement | Contextual-update package test and builder `--check` |
| Codex Websearch 2026 package | Codex-Websearch package test and builder `--check` |
| Codex Websearch source acquisition or QC | Source-acquisition and readiness tests; both builders with `--check` |
| Grounded Vault model or Assertions | Grounded Vault validator and claim-anchor check |
| Paper figures or count-bearing claims | Canonical replay and the applicable analysis generator |
