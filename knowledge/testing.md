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
updated: 2026-09-22
authors: [Christopher Pollin]
generated-with: Codex (GPT-5.6), Codex (GPT-6)
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
| Zotero group reconciliation | Normalisation, DOI-first matching, absence of write calls, refusal of keys with write permission, key redaction, deterministic offline report | `python -m pytest tests/test_zotero_group_reconcile.py` |
| Zotero import residuals | Deduplication across the packages, version relations kept in the residual file, refusal to overwrite a prepared import, the unchanged leading package | `python -m pytest tests/test_zotero_import_residuals.py` |
| Authorised Zotero import | Group-limited access, preservation of real RIS metadata, held identity conflicts, stale-plan rejection, creation-only writes, receipt after uncertain response, semantic tag read-back and duplicate-free continuation | `python -m pytest tests/test_zotero_group_import.py` |
| Claim and Vault checks | Assertion anchors, adjacent-layer references, status discipline | `python -m src.publish.check_claims` and `python -m src.publish.validate_research_vault` |
| Library and knowledge coverage | Complete live membership, preserved benchmark annotations, null categories for unassessed records, source-bound active and recovered documents, independent reporting of missing full text and knowledge documents | `python -m pytest tests/test_generate_docs_data.py tests/test_project_active_distillates.py tests/test_project_recovered_knowledge.py tests/test_literature_readiness.py` |

## Guaranteed behaviours

The automated suites cover the following contracts.

- Every positive category requires Paper-layer evidence.
- Include records require complete analysis coding under the controlled vocabulary.
- Source identity conflicts fail closed before a full text can enter screening. Normalized filename collisions retain all candidates and cannot silently select an ambiguous fallback.
- Full-text publication loads the Work-Version registry and explicit source bindings once per invocation. A later invocation reads fresh inputs.
- Knowledge-document aliases share content only within the exact Work-Version binding, preserving existing-document precedence.
- Conversion-review projections retain the original recorded reviewer, time, scope and checked file identities in JSON and CSV. Displaying a receipt grants no new review authority.
- Completion candidates require an unambiguous selected-Version identifier for canonical binding. Title-derived Zotero matches cannot establish that binding, conflicting Versions withhold it, and observed library membership remains visible independently of binding or source readiness.
- Every record represented in the canonical registry resolves to one stable Work and exact bibliographic Version; all Version relations stay inside that Work. Unbound supplement candidates remain explicitly pending.
- Preferred and latest Versions are derived independently, and a retracted Version cannot become preferred.
- Full-text manifests, new reviewer files, agent runs, evidence items, active distillates, and public projections retain exact Work-Version bindings.
- Reviewer files serialize deterministically and preserve actor and source provenance.
- Ordinary PRISM entry and reload start read-only even with a stored reviewer profile: no reviewer/folder setup, cache writes or disk writes occur. `Bearbeiten` enables editing; returning to reading preserves the unsaved draft. The explicit trial and agent routes open their authoring workflows, and acceptance remains read-only.
- The verification route `prisma.html?verify=1` opens an editing session whose subject is the productive agent record for the current paper, taken from the connected working folder without selecting a track. The rail heads it as the agent coding and offers no revision control; a paper without an agent record names the missing subject instead of offering a capture. A recorded verification or publication-approval event is written into the verifying expert's own file under `verification_schema` and `verifications`, the agent file is never written, its loaded envelope stays identical, and a reload projects the expert file back onto the agent track. Provenance renders as readable text.
- The PRISM workspace holds its one-screen layout at 1440x900 and 1280x800 in screening and in verification: the document itself does not scroll, the reading column carries no horizontal overflow, and it keeps at least 60 percent of the viewport height.
- Browser recovery and repository files reconcile per Paper without silent overwrite.
- Agent coding packets pass through PRISM's production validation, import, record-requirement, and serialization functions.
- The governed transfer CLI explicitly activates editing before import. A CLI regression checks the complete projection and roundtrip against an unchanged archived packet; a reviewer profile alone leaves normal reading mode intact.
- Validation receipts bind to the hash of the checked annotation.
- Lifecycle transitions require authorised actor roles and valid predecessor states.
- Productive agent merges are append-only and reject divergent overwrite.
- Public literature projections enforce the configured release policy; AI-reviewed records require attributed artifact/source-hash-bound receipts. The default publisher without an explicit policy retains its human publication-approval gate.
- Accepted AI corrections preserve the original annotations and bind their exact original hash, bounded before/after fields and source-reviewed correction artifact. A separately bound manuscript cannot overwrite bibliographic identity.
- Existing-Version source bindings preserve all Work/Version metadata and require exact title, identifier, arXiv revision and quoted source identity. Optional visual run assets require safe repository paths, real PNG bytes, exact image hashes and source/license provenance before and after execution; original-PDF hashes remain declared acquisition evidence.
- The latest original/correction-family review governs both publication and completion. Later negative outcomes, missing correction tombstones, stale source hashes and conflicting simultaneous reviews cannot revive earlier acceptance.
- Work-wide source or withdrawal holds exclude otherwise reviewed coding from current analysis and Assertion release.
- Duplicate bibliographic records contribute once per Work to result aggregations; conflicting eligible codings stop publication.
- The result-site allowlist excludes raw screening files and full-text assets, and its downloadable research JSON is byte-identical to the site data.
- Grounded chat contexts contain released Assertions and exact source evidence; no-evidence queries remain local and provider answers require supplied evidence identifiers.
- Grounded Vault outputs cannot exceed the authority state of their supporting layer.
- Preparation distillates retain their named producer and unreviewed status. Their exact source path, hash and publication Version must match the canonical binding before projection. Historical document recovery checks the source and document hashes without upgrading the original interpretation.
- All live Zotero keys enter the canonical corpus. Historical annotation keys remain available through explicit aliases. Unassessed records have empty decisions and null categories, and they do not alter the original benchmark denominator.

## Manual acceptance boundary

The native browser permission dialogue for the File System Access API remains a manual environment check because headless automation cannot grant the browser-owned permission. `tests/manual-checklist.md` defines that check. Domain-expert usability and scholarly verification are research activities and therefore remain outside technical test success.

## Clean-checkout verification

Use Python 3.11 or later and Node.js 22. From the repository root, install the build dependencies and browser, then generate and verify the local outputs:

```sh
python -m pip install -r requirements-build.txt
npm ci
npx playwright install chromium
npm run build
npm run check
npm run test:browser-companion
npm run pilot
```

The build reconstructs the ignored local reading layer, source-readiness and completion queues, corpus projections, Assertion index, downloads and separate result site at `build/site/`. It uses the local source representations and performs no new AI reviews or external API calls. Fresh acquisition, PDF conversion and LLM distillation require the broader research environment described in [[methods]]. The read-only `npm run check:data` rejects changed inputs, missing outputs or stale hashes.

Hash-bearing research artifacts use canonical LF text so their checksums remain stable across operating systems. The browser pilot selects an available local port by default, with `--port` available for explicit binding. The native folder-picker checks remain in [the manual checklist](../tests/manual-checklist.md). The committed replay checks the retrospective benchmark counts and agreement figures.

## Local preview and deployment

Run `npm run preview` and open [the project website](http://127.0.0.1:8870/index.html) or [PRISM](http://127.0.0.1:8870/prisma.html). The optional generated publication export is available at `/results/index.html`. Use `npm run preview -- --port 8871` to select another port.

`.github/workflows/quality.yml` runs the automated gates in continuous integration. For deployment, select GitHub Actions as the repository's Pages source. The manually dispatched `.github/workflows/pages.yml` runs on `main`, builds and checks the result, and uploads only `build/site/`. A local build does not update the live site, and passing local checks does not establish that either remote workflow has run. Deployment requires the project owner's authorisation under [[plan]].

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
| Governed or generated JSON shape, or a schema in `schemas/` | `python -m pytest tests/test_schemas.py` and `npm run check:schemas` |
