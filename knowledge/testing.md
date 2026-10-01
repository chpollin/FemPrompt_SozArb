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
updated: 2026-10-01
authors: [Christopher Pollin]
generated-with: Codex (GPT-5.6), Codex (GPT-6), Claude Code (Claude Opus 5.5)
topics: ["[[Software Testing]]", "[[Research Software]]"]
related: [specification, data, governance, verification, methods, plan]
---

# Testing

The test system establishes the technical behaviour of PRISM, the public result site, the internal working application, the agent-run contracts, the publication and analysis pipeline, and the Grounded Vault validators. Test success supports claims about implemented behaviour. Scholarly correctness requires the separate verification process in [[verification]], and the result site additionally passes through the [independent acceptance review](#independent-acceptance-review-of-the-result-site).

## Commands

`npm run check` is the integrated gate and runs four parts in order.

1. `npm run check:data` runs `python -m src.publish.build_project --check`, which rejects changed inputs, missing outputs or stale hashes across the generated data, the completion package and `build/site/`, and then `npm run check:schemas`.
2. `npm test` runs the Node suites, namely the PRISM suite `tests/run.mjs`, the working-application suite `tests/companion.mjs`, the grounded chat suite `tests/chat.mjs`, the Literaturbild suite `tests/literature-landscape.mjs` and the visual source-asset check `tests/review-cases/verify-source-assets.mjs`.
3. `npm run test:python` runs `python -m pytest tests/ -q`.
4. `npm run test:release` runs `tests/browser/release.mjs` against the built `build/site/`, so it needs a preceding `npm run build`.

The browser test of the working application (`npm run test:browser-companion`) and the PRISM browser pilot (`npm run pilot`) run outside `npm run check`. Continuous integration runs both after the check. `npm run test:prism` and `npm run test:companion` run single Node suites, and `npm run reconcile` and `npm run verify:agent-track` run the reconciliation and agent-track utilities under `tests/browser/` and `tests/review-cases/`.

## Test layers

| Layer | Scope | Principal entry point |
|---|---|---|
| PRISM unit and integration tests | Category logic, evidence gates, analysis coding, persistence, import, serialization, lifecycle rendering, verification entries | `npm run test:prism` (part of `npm test`) |
| Working-application modules | `docs/index.html` loaded in jsdom with on-disk data, corpus table, the Kategorien lens map (Landkarte) with its lenses and detail panel, start view, hosted matrix, network, answer and work views under one router, nav tooltips, chat UI, URL restoration, `window.EC` helpers | `npm run test:companion` (part of `npm test`) |
| Grounded chat | Local answers without provider request when evidence is missing or the index is invalid, fail-closed attribution, key request only with a match, complete source quotations and provenance in the context | `node tests/chat.mjs` (part of `npm test`) |
| Python tests | Publishers, source identity, lifecycle validation, queue and intake builders, analysis tools, Grounded Vault checks | `npm run test:python` |
| Result-site acceptance | Client model of `release-model.js` on fixtures, then the built site in Chromium (see [Result-site browser test](#result-site-browser-test)) | `npm run test:release` |
| Working-application browser test | Start view with the Argumentkarte, answer pages, Literaturbild matrix, Wissensnetz, work view, Kategorien Landkarte and the Korpus workbench of `docs/index.html` in Chromium. For the Korpus the test recomputes both stage bars, the included subsets of the Auswertung stages and the work lists from the data files, checks the default sort by stage, and serves fixture reviewer files through route interception to check that saved human records count as bewertet and replace the round-one decision. On a real open work with a round-one LLM assessment it checks that neither the Korpus row, panel, filters, sort and CSV nor the LLM and Übereinstimmung bases of the Wissensnetz show or count its LLM assessment, that a fixture reviewer record brings it into the LLM basis, and that the Wissensnetz Entscheidung filter reads a reviewer record before the expert decision. On a real open work with a knowledge document it checks that the panel offers no download and that the Markdown and Vault exports of the whole corpus contain exactly the documents whose records all have a human decision. A screenshot of the Korpus at 1280 by 800 pixels goes to `tests/browser/out/companion/`. Also deep links, Back and Forward, legacy hashes, keyboard focus, nav tooltips, reflow at 390 px, local runtime assets | `npm run test:browser-companion` |
| PRISM browser pilot | Editor flow, persistence, recovery, agent-only paper without AI pre-assessment, acceptance mode, one-screen layout, responsive behaviour | `npm run pilot` |
| Agent-run validators | Manifest, coding packet, PRISM track, AI Agent Review, append-only merge | Commands documented in `tests/README.md` and the project skill |
| Result-site build | Allowlist without raw tracks and local sources, byte-identical download and site data, deterministic archives, refusal of unexpected files, read-only check, and a working archive that withholds every knowledge document linked by a record without a consolidated expert decision | `python -m pytest tests/test_build_release.py` |
| Generated page chrome | Rendered pages equal the committed outputs and use local runtime assets | `python -m pytest tests/test_build_pages.py` |
| Published analysis coverage | Explicit field states per released record, coverage partition with named withholding reasons, agreement of published coverage with released records, publication gates of the landscape | `python -m pytest tests/test_generate_literature_landscape.py` |
| Descriptive mapping tools | Field states per track partitioning the Include denominator, association cells that count works once and mark undeterminable cells instead of gaps, the category matrix over governed decisions, integrity holds, the round-one selection check by track and population, agreement of package field states with the SQ denominators | `python -m pytest tests/test_build_completion_package.py` |
| Agent-track diagnostics | Normalisation of sparse levels and nested analysis, separation of track differences, review outcomes and blockers | `python -m pytest tests/test_agent_track_diagnostics.py` |
| Round-one replay | Check mode without artifacts, both replay artifacts in default mode, the uncoded `?` marker counted as missing | `python -m pytest tests/test_replay_round1.py` |
| Working-data projections | Expert diversity column, uncoded cells as null, case variants of Ja and Nein, one `author_year` form, full abstracts and knowledge sections, null verification scores, listed unmapped expert records, disagreement join, null divergence pattern, concept-graph provenance | `python -m pytest tests/test_generate_docs_data.py tests/test_generate_vault_v2.py tests/test_generate_promptotyping_data.py` |
| Work-Version registry | Stable identity, controlled publication stages, preferred/latest selection, relations, Zotero and intake coverage | `python -m pytest tests/test_work_versions.py tests/test_round2_intake_package.py` |
| Contextual update intake | Cross-lane Tier-A deduplication, original-window preservation, Work-Version relation, Zotero target, unscreened lifecycle state | `python -m pytest tests/test_contextual_update_package.py` |
| Codex Websearch 2026 | Strict selected-Version date boundary, cross-lane deduplication, Zotero-export withholding, bibliographic-audit reconciliation, unscreened lifecycle state | `python -m pytest tests/test_codex_websearch_2026.py` |
| Codex source preparation | Rights gate, preferred/acquired Version separation, resumable PDF validation, repository-HTML representations, exact candidate coverage, agent-QC authority, repaired-source selection, visual-evidence blocking, and fail-closed Zotero binding | `python -m pytest tests/test_acquire_codex_websearch_2026.py tests/test_codex_source_readiness.py` |
| Zotero group reconciliation | Normalisation, DOI-first matching, absence of write calls, refusal of keys with write permission, key redaction, deterministic offline report | `python -m pytest tests/test_zotero_group_reconcile.py` |
| Zotero import residuals | Deduplication across the packages, version relations kept in the residual file, refusal to overwrite a prepared import, the unchanged leading package | `python -m pytest tests/test_zotero_import_residuals.py` |
| Authorised Zotero import | Group-limited access, preservation of real RIS metadata, held identity conflicts, stale-plan rejection, creation-only writes, receipt after uncertain response, semantic tag read-back and duplicate-free continuation | `python -m pytest tests/test_zotero_group_import.py` |
| Claim and Vault checks | Assertion anchors, adjacent-layer references, status discipline | `python -m src.publish.check_claims` and `python -m src.publish.validate_research_vault` |
| Library and knowledge coverage | Complete live membership, preserved benchmark annotations, null categories for unassessed records, source-bound active and recovered documents, independent reporting of missing full text and knowledge documents | `python -m pytest tests/test_generate_docs_data.py tests/test_project_active_distillates.py tests/test_project_recovered_knowledge.py tests/test_literature_readiness.py` |
| Schemas | Governed and generated JSON shapes against `schemas/` | `python -m pytest tests/test_schemas.py` and `npm run check:schemas` |
| PRISMA flow per identification source | The round-one flow equals the canonical replay, every later source balances, the current decision state partitions records and Works, multiple-find matrices are symmetric and the output is deterministic | `python -m pytest tests/test_prisma_flow.py` |
| Reviewer assignment | Open papers alternate between the two reviewers, a rerun is append-only and idempotent, an unknown reviewer is refused, and the committed assignment file is current | `python -m pytest tests/test_build_assignment.py` |
| Tracked path length | Every tracked path stays within 120 characters and title-derived stems are bounded and deterministic | `python -m pytest tests/test_path_length.py` |

### Result-site browser test

`tests/browser/release.mjs` first evaluates `release-model.js` from `build/site/` on fixture records. It checks the field states value, none, undecidable and not yet coded, both forms of `analysis.undecidable`, category groups without members, work-level fields, the coverage partition, cross-tabulation of multi-valued codes, the reader of `meta.analysis_coverage` against the data contract and its fallback, category evidence, network neighbours and the folding of umlauts in search.

It then serves `build/site/` locally and drives Chromium at 1440 by 900 pixels. The checks cover the main question and sub-questions on the start page, the absence of an inventory counter and of any claim that a question is answered, navigation labels equal to view titles, the answer page with the coded-share line first and the four parts Befunde, Matrix, Offen and Werke, matrix cells that link to the matrix, the suffix "des Werks" on work-level fields, the joint-coding wording of cells and its absence for work-level crosses, the work list of a cell with evidence quotations and locators, cell selection in the URL and its restoration on reload, browser back, focus on the work list after keyboard activation of a cell, the status line and the collapsed technical record of a work, the Korpus counter only after a search, the rendered Assertions with their review record, the network graph with its table equivalent, no provider request from the chat without evidence, unavailable working data, no horizontal document overflow at 390 by 844 pixels on the start, matrix, answer, Netz and Korpus views, no runtime errors and no external runtime request. Screenshots at both widths go to `tests/browser/out/release/`.

## Guaranteed behaviours

The automated suites cover the following contracts.

- Every positive category requires Paper-layer evidence.
- Agent Include records require complete analysis coding under the controlled vocabulary. Human records need none and keep an existing analysis part unchanged (ADR-045).
- Source identity conflicts fail closed before a full text can enter screening. Normalized filename collisions retain all candidates and cannot silently select an ambiguous fallback.
- Full-text publication loads the Work-Version registry and explicit source bindings once per invocation. A later invocation reads fresh inputs.
- Knowledge-document aliases share content only within the exact Work-Version binding, preserving existing-document precedence.
- Conversion-review projections retain the original recorded reviewer, time, scope and checked file identities in JSON and CSV. Displaying a receipt grants no new review authority.
- Completion candidates require an unambiguous selected-Version identifier for canonical binding. Title-derived Zotero matches cannot establish that binding, conflicting Versions withhold it, and observed library membership remains visible independently of binding or source readiness.
- Every record represented in the canonical registry resolves to one stable Work and exact bibliographic Version, and all Version relations stay inside that Work. Unbound supplement candidates remain explicitly pending.
- Preferred and latest Versions are derived independently, and a retracted Version cannot become preferred.
- Full-text manifests, new reviewer files, agent runs, evidence items, active distillates, and public projections retain exact Work-Version bindings.
- Reviewer files serialize deterministically and preserve actor and source provenance.
- Ordinary PRISM entry and reload start read-only even with a stored reviewer profile. No reviewer or folder setup, cache writes or disk writes occur. `Bearbeiten` enables editing, and returning to reading preserves the unsaved draft. The explicit trial and agent routes open their authoring workflows, and acceptance remains read-only.
- Human sessions show no AI pre-assessment (ADR-044). In Lesen and Bearbeiten no LLM proposal, LLM category colour or takeover appears, a paper with only a productive agent record starts empty and counts as open, list dots and the category filter use only the own record or the expert decision, and saving writes an own decision into the reviewer file. The agent file is never written and `ar2.json` stays byte-identical. Verification entries of earlier builds still load, validate and are written back unchanged (`prisma.html?verify=1` remains an alias for Bearbeiten, ADR-042).
- The working application shows no AI assessment of an open work (ADR-044). The Korpus and the LLM and Übereinstimmung bases of the Wissensnetz neither show nor count its round-one LLM assessment, and no Korpus download, export or prebuilt working archive ships a knowledge document linked by a record without a human decision.
- The PRISM workspace holds its one-screen layout at 1440x900 and 1280x800 in screening, including a paper with only an agent record. The document itself does not scroll, the reading column carries no horizontal overflow, and it keeps at least 60 percent of the viewport height.
- Browser recovery and repository files reconcile per Paper without silent overwrite.
- Agent coding packets pass through PRISM's production validation, import, record-requirement, and serialization functions.
- The governed transfer CLI explicitly activates editing before import. A CLI regression checks the complete projection and roundtrip against an unchanged archived packet, and a reviewer profile alone leaves normal reading mode intact.
- Validation receipts bind to the hash of the checked annotation.
- Lifecycle transitions require authorised actor roles and valid predecessor states.
- Productive agent merges are append-only and reject divergent overwrite.
- Public literature projections enforce the configured release policy, and AI-reviewed records require attributed artifact- and source-hash-bound receipts. The default publisher without an explicit policy retains its human publication-approval gate.
- Accepted AI corrections preserve the original annotations and bind their exact original hash, bounded before and after fields and source-reviewed correction artifact. A separately bound manuscript cannot overwrite bibliographic identity.
- Existing-Version source bindings preserve all Work and Version metadata and require exact title, identifier, arXiv revision and quoted source identity. Optional visual run assets require safe repository paths, real PNG bytes, exact image hashes and source and license provenance before and after execution. Original-PDF hashes remain declared acquisition evidence.
- The latest original and correction-family review governs both publication and completion. Later negative outcomes, missing correction tombstones, stale source hashes and conflicting simultaneous reviews cannot revive earlier acceptance.
- Work-wide source or withdrawal holds exclude otherwise reviewed coding from current analysis and Assertion release. An integrity hold alone removes a Work's coding from interim analysis.
- Duplicate bibliographic records contribute once per Work to result aggregations, and conflicting eligible codings stop publication.
- Every released record states each analysis field and `Studientyp` as value, none, undecidable or absent. `meta.analysis_coverage` partitions the scope per field, names one withholding reason per withheld Work, and agrees with the released records.
- The completion package partitions the Include denominator per field and track. Association cells count each Work once, carry an authority breakdown and mark a cell as not determinable while coding is open, so no empty cell is reported as a gap.
- The round-one replay treats the `?` marker as missing. The expert-sheet projections keep empty cells null, read Ja and Nein case-insensitively and read the expert diversity column. Absent verification scores stay null, unclassified divergences carry a null pattern, and the concept-graph provenance flags counts that do not recompute.
- Agent-track diagnostics report track differences, AI Agent Review outcomes and blockers separately.
- The result-site allowlist excludes raw screening files and full-text assets, and its downloadable research JSON is byte-identical to the site data.
- The result-site model derives field states and counts from released data only and reads the coverage block as [[data#Analysis field states and coverage]] defines it. The built site serves no working data, loads no external runtime resource and keeps its start, matrix, answer, Netz and Korpus views within a 390-pixel viewport.
- Grounded chat contexts contain released Assertions and exact source evidence. No-evidence queries remain local, and provider answers require supplied evidence identifiers.
- Grounded Vault outputs cannot exceed the authority state of their supporting layer.
- Preparation distillates retain their named producer and unreviewed status. Their exact source path, hash and publication Version must match the canonical binding before projection. Historical document recovery checks the source and document hashes without upgrading the original interpretation.
- All live Zotero keys enter the canonical corpus. Historical annotation keys remain available through explicit aliases. Unassessed records have empty decisions and null categories, and they do not alter the original benchmark denominator.

## Manual acceptance boundary

The native browser permission dialogue for the File System Access API remains a manual environment check because headless automation cannot grant the browser-owned permission. `tests/manual-checklist.md` defines that check, and the [partner acceptance run](#partner-acceptance-run) covers everything after the picker. The independent acceptance review of the result site, the project owner's review on a phone and the later acceptance session with the domain experts are manual procedures. Domain-expert usability and scholarly verification are research activities and therefore remain outside technical test success. A green `npm run check` establishes none of them.

## Partner acceptance run

The run reproduces the workflow of the two domain reviewers in a fresh clone of the private repository, from the build to the reviewer file that GitHub Desktop would commit. It clones from a local repository path into a short directory outside the working tree, so nothing leaves the machine, builds there, serves the clone with `python -X utf8 -m src.publish.serve --port <port>` and then runs

```sh
node tests/browser/partner.mjs --clone C:\tmp\fp-partner-<date> --base http://127.0.0.1:<port> --reviewer sabine
```

The script drives Chromium through the real build. It opens `prisma.html`, switches to `Bearbeiten`, sets the reviewer key, connects the working folder, narrows the list to `Offen` and the reviewer's `Zuteilung`, pins one Paper Beleg from the in-text search, chooses an exclusion reason, saves with Ctrl+S and reads the reviewer file back from disk. The native folder picker and its permission prompt need a user gesture that automation cannot give, so the script replaces `window.showDirectoryPicker` with a handle whose reads and writes reach the clone on disk through a bridge confined to the clone directory. Everything after the picker, including the resolution of `docs/data/screening` below the picked root and the write through `createWritable`, is the application's own code. The script never commits, pushes or deletes, and it records every write.

### Run of 1 October 2026

Clone of the branch with the provisional PRISM fixes of the same day, made from the local worktree into `C:\tmp\fp-partner-20261001`.

| Step | Result | Evidence |
|---|---|---|
| Clone from the local path | pass | `git remote -v` names only the local worktree |
| Dependencies | pass | the existing Python environment already held `requirements-build.txt`, so no install ran, and `node_modules` was a junction to the main checkout |
| `npm run build` | pass, with drift | the build ends with "OK", and `git status` then lists four data files as modified (`analysis_fields`, `assertion_index`, `literature_landscape`, `promptotyping_v2`) although `git diff` is empty and staging adds nothing. They were checked out again |
| Server and `prisma.html` | pass | the page offers `Lesen` and `Bearbeiten`, so the manifest and File System Access were recognised |
| Reviewer key | pass | key `sabine` set in `Bearbeiten` |
| Folder connection | pass, picker stubbed | one picker call, status "Arbeitsordner verbunden" |
| Assigned paper | pass | `Offen` plus `Zuteilung` Sabine opened a paper that `assignment.json` assigns to `sabine` |
| Assessment and save | pass | Paper Beleg from the in-text search on Soziale Arbeit, reason "Thema nicht einschlägig", Ctrl+S, status "Gespeichert in docs/data/screening/sabine.json" |
| Saved file | pass | `docs/data/screening/sabine.json` in the clone carries schema `femprompt-prisma-reviewer/0.5`, reviewer `sabine`, the Exclude with its reason, `text_source` `raw` and the Beleg with `source_layer` `paper`. `python -m src.publish.validate_schemas` reports ok |
| Written paths | pass | the application wrote only `docs/data/screening/sabine.json` |
| `git status` | pass | `git status --short --untracked-files=all` shows exactly `?? docs/data/screening/sabine.json` |
| List state | pass | the saved paper leaves `Offen` and appears under `Erfasst` with the PRISM capture mark |

Two observations concern the hand-over. A reviewer who builds on Windows sees the four drifted data files as changed in GitHub Desktop, and the safe action is to discard them, as [Clean-checkout verification](#clean-checkout-verification) describes. A pushed reviewer file is an input of the build manifest, so `npm run check` on `main` reports a stale build until the next `npm run build`, which is an integration step for the operator and not for the reviewers.

What stays manual for the reviewers is the native folder picker with the choice of the clone root and the browser's permission prompt for editing that folder, the renewed permission after the browser was closed ("Arbeitsordner einmal freigeben"), which the stubbed handle cannot reproduce after a reload, the commit and push in GitHub Desktop, and the visual and scholarly judgement of the assessment itself. `tests/manual-checklist.md` covers the native permission dialogue.

## Independent acceptance review of the result site

The review judges the built result site against its specification before the project owner reviews it and before deployment. An agent or person who did not implement the change carries it out, reads [[specification#Public Evidence Companion]] first and works on a fresh `npm run build` with a green `npm run check`. `npm run preview` serves the site at `/results/index.html`.

1. Data truth. A separate script recomputes every displayed figure from the released JSON under `build/site/data/` without using `release-model.js`. This covers every cell and its work list for every axis pair the Matrix offers and for every preset map on the answer pages, every coded-share and coverage line against `meta.analysis_coverage` and against counts over released records, the Offen and Werke lists, the Korpus facet counts and the Netz edge counts. Each difference is a finding.
2. Rule checks. Every epistemic display rule is checked on every view at 390 and at 1440 pixels width, including the cell and edge wording, the suffix of work-level fields, the coded-share line before each result, the reading of empty cells, the text or accessible label of every status mark, the attribution of recommendations, horizontal overflow and clipped labels.
3. Keyboard. Every control, cell, edge and link is reached and operated with the keyboard alone, focus stays visible, focus moves to the opened work list and to the heading of a newly opened view, the Netz figure answers the arrow, Home and End keys, and browser back restores the previous state.
4. Zoom. The views stay readable and operable at 200 percent text size and at 400 percent page zoom on a 1280-pixel window, the reflow case of WCAG 2.2, without loss of content or two-dimensional scrolling of text.
5. Contrast. Text meets 4.5:1 and large text, status marks, cell shading, network marks and focus indicators meet 3:1 against their background, measured in the rendered page, and no meaning depends on colour alone.
6. Content fitness. Each view answers its task for a reader from social-work practice and research. The review notes internal identifiers, untranslated controlled values, coding notes that could read as evidence, wording that implies an answered question, a relation or an effect, and texts that a reader cannot place without the project's internal vocabulary.

Findings name view, URL hash, viewport, expected and observed state, and they go into [[plan]]. A step that cannot be carried out is named with its reason instead of being reported as passed. The review grants no scholarly verification and no publication approval. Its result precedes the project owner's review on a phone and, later, the acceptance session with the domain experts.

## Clean-checkout verification

Use Python 3.11 or later and Node.js 22. From the repository root, install the build dependencies and browser, then generate and verify the local outputs:

```sh
python -m pip install -r requirements-build.txt
npm install
npx playwright install chromium
npm run build
npm run check
npm run test:browser-companion
npm run pilot
```

On Windows, clone into a short path such as `C:\femprompt`, for example with GitHub Desktop, and use a python.org installation, since the Microsoft Store alias for `python` does not run the build. Continuous integration uses `npm ci`.

The build reconstructs the git-ignored reading layer under `docs/data/fulltext/` from the tracked `generated/markdown_clean/`, the source-readiness and completion queues, corpus projections, Assertion index, the PRISMA flow in `generated/prisma-flow/`, downloads and the separate result site at `build/site/`. It uses the local source representations and performs no new AI reviews or external API calls. Fresh acquisition, PDF conversion and LLM distillation require the broader research environment described in [[methods]].

Hash-bearing research artifacts use canonical LF text so their checksums remain stable across operating systems. A build on Windows can leave line-ending-only drift in tracked files, which is discarded by checking the path out again. The browser pilot selects an available local port by default, with `--port` available for explicit binding. The native folder-picker checks remain in [the manual checklist](../tests/manual-checklist.md). The committed replay checks the retrospective benchmark counts and agreement figures.

## Local preview and deployment

Run `npm run preview`, which starts `python -X utf8 -m src.publish.serve`, and open [the working application](http://127.0.0.1:8870/index.html), [PRISM](http://127.0.0.1:8870/prisma.html) or, after a build, [the result site](http://127.0.0.1:8870/results/index.html), which is served from `build/site/`. Use `npm run preview -- --port 8871` to select another port.

`.github/workflows/quality.yml` runs the build, `npm run check`, the working-application browser test and the PRISM pilot in continuous integration. The manually dispatched `.github/workflows/pages.yml` runs on `main`, builds and checks the result, and uploads only `build/site/`. It takes effect once GitHub Actions is the repository's Pages source. On 1 October 2026 the repository became private while GitHub Pages stayed public and still served `docs/` from `main` through the branch build, including the working application and its data but not the git-ignored reading layer. Switching the Pages source requires the project owner's authorisation under [[plan]]. A local build does not update the live site, and passing local checks does not establish that either remote workflow has run.

## Change gates

| Change | Required checks |
|---|---|
| Screening behaviour or persistence | PRISM tests, Python tests, browser pilot |
| Result-site interface, model or allowlist | Build, `npm run test:release`, result-site build tests, then the independent acceptance review before the project owner's review |
| Working application under `docs/index.html` | `npm test` and the working-application browser test |
| Published literature landscape or analysis coverage | Landscape tests, build and `npm run test:release` |
| Completion-package analysis tools or agent-track diagnostics | Completion-package and diagnostics tests and `npm run check:data` after a build |
| Expert-sheet projections or the round-one replay | Working-data projection and replay tests, canonical replay |
| Lifecycle or productive record schema | Python tests and all agent-run validators |
| Work identity, publication Version, or bibliographic intake | Work-Version and round-two intake tests, registry `--check`, data regeneration |
| Dated contextual search supplement | Contextual-update package test and builder `--check` |
| Codex Websearch 2026 package | Codex-Websearch package test and builder `--check` |
| Codex Websearch source acquisition or QC | Source-acquisition and readiness tests, both builders with `--check` |
| Grounded Vault model or Assertions | Grounded Vault validator and claim-anchor check |
| Paper figures or count-bearing claims | Canonical replay and the applicable analysis generator |
| Governed or generated JSON shape, or a schema in `schemas/` | `python -m pytest tests/test_schemas.py` and `npm run check:schemas` |
| Reviewer assignment | Assignment tests |
| PRISMA flow or identification records | PRISMA-flow tests, then build and `npm run check:data` |
| File naming or a new tracked path | Path-length test |
