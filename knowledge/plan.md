---
title: Plan
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: active
language: en
version: "0.7"
created: 2026-06-09
updated: 2026-09-21
authors: [Christopher Pollin]
generated-with: Codex (GPT-5.6), Codex (GPT-6), Claude Code
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
related: [project, governance, verification, testing, specification, data, journal, handoff, update-protocol, research-vault]
---

# Plan

The remaining work completes the literature corpus through governed agent annotation, domain-expert verification, analysis, and publication. Completed implementation history is preserved in [[journal]] and the ADR register in [[specification]]. Generated manifests carry current quantities and per-item processing states. [[handoff]] states the current result and the continuation point.

## Current operative state

The operator-authorised preliminary result now uses attributed AI source review under `config/publication_policy.json`. The whole existing corpus and prepared 2026 intake remain in scope. `generated/completion/README.md` and its queues are the current completion dashboard; they distinguish existing human coding, newly source-reviewed agent coding, unresolved conflicts, unbound intake and manuscript gaps. The full review and paper remain unfinished.

The deterministic build, receipt validation, immutable AI correction projection, Work-level literature aggregation, Assertion-based chat, consistent downloads, and separate allowlisted result site are implemented. `npm run build` constructs `build/site/`; `npm run check` verifies it. The new site has not been deployed by the local build. `corpus/deep-research/round2/targeted-followup-2026-09-05.md` records the separately dated, deduplicated gap-filling search; its candidates are identified, not included results.

PRISM implements evidence-grounded screening, complete Include coding, deterministic storage, lifecycle provenance, domain-expert verification, and a fail-closed publication gate. The Codex-native workflow produces operationally isolated coding packets, projects them through PRISM's production functions, and submits them to a separate source-grounded AI Agent Review. Completed runs are recorded individually; the [current completion package](../generated/completion/README.md) identifies what still needs source binding, fresh screening or resolution. A recovered full text or repaired identity can make new screening necessary even where an older record exists. Source readiness does not establish completed annotation or review.

The canonical Grounded Vault chain contains the bounded active slice documented in [[research-vault#Current implementation state]]. The larger historical knowledge archive has not been collectively migrated or source-reviewed into this chain. The paper has one canonical manuscript under `research-vault/40_output/paper/paper.md`. Its current synthesis uses the reviewed subset; the complete qualitative synthesis remains open.

The Work-Version registry is installed and projected into the corpus, the full-text manifest, PRISM, the agent-screening queue, the Grounded Vault source layer, and the public Literature Landscape contract. The generated screening queue is the per-work authority for residual source blocks. The consolidated round-two intake package contains the three agent reviews and an RIS file restricted to conflict-free imports. The separate `Codex Websearch` package contains the complete selected 2026 subset from three deeper search lanes, source enrichment, one deduplicated RIS, rights-gated acquisition, Docling conversion, direct agent source QC, and a fail-closed source-readiness ledger. Its prepared records remain identified and unscreened until Zotero curation and re-export provide canonical Work-Version bindings.

## Completion criteria

The project reaches completion when the following conditions hold.

1. Every intended corpus work has a stable identity and a documented source state.
2. Every screenable work has governed agent annotations and source-grounded AI Agent Review.
3. Domain experts have verified or corrected every record intended for the research synthesis.
4. Quantitative analysis derives from committed structured data through executable scripts.
5. Qualitative analysis derives from source-linked Assertions in the Grounded Vault.
6. The literature report and paper have received domain-expert review of their scholarly interpretation.
7. Each public artifact meets its explicit release policy; the final scholarly manuscript additionally has a human publication-approval event. Preliminary AI-source-reviewed results retain their own attributed review basis.
8. The repository documents a reproducible setup path for a subsequent update or another review corpus.

## Remaining work

### Source and corpus readiness

- Review the conflict-marked intake records. [[#Authorised additive Zotero import]] governs the operator-authorised import. A fresh export must be reconciled with local metadata corrections before replacing the canonical corpus.
- Resolve the remaining identity conflicts and unavailable, ambiguous, or rights-restricted Paper sources recorded by the queue.
- Reconcile historical residual-queue findings with the current [metadata corrections](../corpus/metadata_corrections.json), [source bindings](../corpus/source_version_bindings.json) and [completion queue](../generated/completion/README.md). Already applied local repairs must be preserved deliberately when the external Zotero library is curated and re-exported.
- Reconcile every prepared Codex source-readiness record with the curated Zotero Work and exact Version. Preserve any difference between the preferred bibliographic Version and the acquired source Version.
- Use the hash-bound original-PNG reading contract where text alone omits meaningful figures; every assigned reviewer must inspect the declared assets. Standalone image-based evidence annotations and unresolved visual gaps in the prepared intake remain separate work.
- Bind or convert any further Paper representation only after its work identity has passed the source audit.
- Rebuild the agent-screening queue after each source or corpus change.

Canonical state carriers are `corpus/work_version_registry.json`, `generated/round2-intake-package.json`, `generated/round2-zotero-import.ris`, `generated/contextual-update-2026-08-24-intake-package.json`, `corpus/deep-research/round2/Codex Websearch/codex-websearch-2026-package.json`, `corpus/deep-research/round2/Codex Websearch/bibliographic-audit.json`, `generated/source-acquisition/codex-websearch-2026/source-readiness.json`, `generated/agent-screening-queue.json`, `docs/data/knowledge_doc_bindings.json`, and the reviewed full-text manifest.

### Governed agent annotation

- Execute every newly source-ready work in a manifest-bound batch.
- Produce two operationally isolated coding packets for each assignment.
- Project both packets deterministically through PRISM's production contract.
- Conduct a separate source-grounded AI Agent Review.
- Merge accepted products append-only into the productive agent track.
- Preserve prompts, models, source hashes, reports, generated tracks, and lifecycle events for every run.

The active contract is [[update-protocol#Agent-assisted completion]]. The authority model is defined in [[governance]].

### Analysis and Assertions

- Use the current Work-level landscape and completion tables for explicitly bounded descriptive analysis; regenerate whole-corpus results after the intended corpus is resolved.
- Analyse category distributions, co-occurrences, evidence types, populations, practice fields, and gaps.
- Use topic modelling only if it answers a stated exploratory question; category co-occurrence or a legacy Graph edge is not an Assertion or a required completion step.
- Convert source-linked findings into atomic Assertions.
- Build the literature report and the paper synthesis over the shared Assertion layer.

Exploratory topics become scholarly findings only through interpretation against the source-linked knowledge structure. The coding vocabularies and research sub-questions remain governed by [[update-protocol]].

### Domain-expert verification

- Present the completed prepared corpus in PRISM verification mode.
- Record accepted, corrected and accepted, changes requested, or rejected for every intended record.
- Preserve each correction as a superseding annotation with a field-level difference record.
- Verify the Assertions that support the literature report and the paper.
- Verify the scholarly interpretation of the report and manuscript after their complete synthesis exists.

Domain-expert verification occurs after agent preparation of the intended corpus. New evidence can be incorporated later by rerunning the affected steps and preserving the previous versions.

### Publication

- Generate the final PRISMA 2020 and PRISMA-trAIce reporting artifacts from the governed records.
- Insert the verified quantitative and qualitative findings into the canonical manuscript.
- Resolve the author set and order.
- Check the current author instructions of the selected journal before submission.
- Apply the already authorised AI-source-reviewed release policy to eligible preliminary results. Record person-attributed publication approval for the final scholarly records and manuscript when that later authority is claimed.
- Rebuild and inspect the separate result site from its policy-filtered projections.

## Technical follow-up

- Confirm the native Chromium directory-permission and physical-write path in a disposable clone.
- Exercise the setup path with a person who did not build PRISM before extracting a reusable configuration guide.
- Consider modularising `docs/js/prisma.js` after the complete-corpus workflow is stable. The present monolith remains covered by the test system, and restructuring it during corpus production would add regression risk.

## Waiting on the project owner

These steps still need an operator contribution. Additive Zotero import has its own explicit authorisation under [[#Authorised additive Zotero import]].

- Curation of ambiguous duplicate and Version relations in Zotero remains separate from adding missing records. Existing group records are not silently merged or rewritten. Before replacing `corpus/zotero_export.json`, reconcile the fresh snapshot with `corpus/metadata_corrections.json` and `generated/source-acquisition/residual-queue-9-20260826/resolution-ledger.json` so hash-bound local repairs remain valid.
- Promotion of implementation branches to `main`. Merges remain operator-gated. The local main inspected on 2026-09-21 already contains the September source-review work, knowledge refactor and read-only Zotero tooling. Earlier claims that those changes were absent from main are superseded by that inspection.
- Deployment of the result site. `.github/workflows/pages.yml` runs only on manual dispatch from `main`, builds and checks the project, and uploads `build/site/`. The repository's Pages source must be set to GitHub Actions beforehand. Until then the live address serves the earlier state.
- Acceptance session of PRISM with the domain experts. The user stories in [[specification]] were written by the technical lead as a user proxy, and the verification mode has been exercised by automated tests and agents only. The repository records no session in which the domain experts worked through prepared records in the tool.
- Resolution of the works with conflicts or holds listed below.

### Inspecting the group library before the import

`src/acquire/zotero_group_reconcile.py` reads the `FemPrompt_SozArb` group library through the Zotero Web API and compares it with the prepared RIS files and with the lane files of July 2026. It prepares the import and the manual duplicate curation and takes neither step. The tool cannot write. Its API client exposes a fixed list of read methods, a run stops when the key carries any write permission, and a test inspects the module source for the write methods of the client library.

A record counts as present when its normalised DOI equals that of a library item, or otherwise when normalised title and publication year are equal. A title that agrees under a different or missing year is listed as a candidate for inspection and is not counted as present. Author names play no part. The normalisation rules are documented in the module and covered by `tests/test_zotero_group_reconcile.py`.

The report consists of `report.json` and `report.md` in `generated/zotero-reconcile/<date>/`. It gives the status of every RIS record with the matching Zotero key and the matched field, the overlap between the RIS files, candidate duplicate groups inside the library, the collections, tags and notes that carry lane names, the keys of `corpus/source_tool_mapping.json` that the library does not hold, and the library version returned by the API, so that a later run can detect a change. The date comes from the `--date` flag, and the tool does not read the clock.

The project owner creates the key in the Zotero account settings on the page for new private keys, `https://www.zotero.org/settings/keys/new`. Personal library access stays switched off, the default group permission stays at none, and the per-group permission for `FemPrompt_SozArb` is set to read only. The key goes into the environment variable `ZOTERO_API_KEY` or into the git-ignored `.env` file in the repository root, and never into a committed file. The tool never prints the key and removes it from error messages of the client library.

```
python -m src.acquire.zotero_group_reconcile --date 2026-09-20
python -m src.acquire.zotero_group_reconcile --date 2026-09-20 --offline
```

The second form compares against the committed `corpus/zotero_export.json` and needs neither key nor network. Its report of 2026-09-20 lies in `generated/zotero-reconcile/2026-09-20-offline/`. According to that report the committed export contains neither the item keys nor the collection keys that `corpus/source_tool_mapping.json` records for the import of July 2026, and the records of the lane files are absent from it apart from a record matched by title and year. The Git history shows in addition that the set of item keys in the export has not changed since the commit of 2026-02-02, and the commit of 2026-08-22 corrected the metadata of a single record. The export therefore predates the import of July 2026. The live inspection of 2026-09-21 confirmed the earlier imports, as recorded under [[#Conflicting statements in the record]].

### Authorised additive Zotero import

The operator explicitly authorised agents to add missing prepared records to the `FemPrompt_SozArb` group on 2026-09-21. `src/acquire/zotero_group_import.py` implements this scope with a key restricted to read/write access for group `6080294`. Personal library and other group access stay disabled. The separate read-only reconciliation tool keeps its original permission contract.

The importer reads a consistent live snapshot and compares the prepared packages in their existing order, including the historical lane files. It writes a local plan containing each source hash, its identity decision and the exact new-item payload. The leading 2026 package is `corpus/deep-research/round2/Codex Websearch/codex-websearch-2026-zotero-import.ris`. Overlapping records in later packages are skipped. Matching uses normalised DOI and title/year. Different identifiers or years under an equal title, and conflicting titles under an equal DOI, are held for curation. Existing items are never updated or merged.

RIS metadata is mapped into Zotero item templates. Tags and source notes are retained, and fields without a native destination go into Extra with their original field label. Creator names are split only where the RIS already supplies a comma separator. Bibliographic import establishes neither a screening decision nor domain-expert verification.

```
python -m src.acquire.zotero_group_import --out generated/zotero-sync/<run>
python -m src.acquire.zotero_group_import --apply generated/zotero-sync/<run>/plan.json
```

Application rejects changed source files or a library version that differs from the prepared plan. Each creation carries the last library version as a precondition and is read back before the next write. Tag order is ignored during comparison because Zotero sorts tags, while author order remains significant. An uncertain write stops the run with a receipt. Continuation starts with a fresh live plan, which recognises items already created. Final snapshots establish whether the previously existing records stayed unchanged.

Snapshots, plans and receipts live locally under the ignored `generated/zotero-sync/` directory. They must not be committed because a group snapshot may contain private notes. Export replacement and Work-Version reconciliation remain separate operations with their own checks.

The completed live import of 2026-09-21 is evidenced by `generated/zotero-sync/2026-09-21/final-audit.json`. Every new record was read back and compared with its planned fields, and all pre-existing group records stayed unchanged. The prepared references are now represented in the library. The fresh flat export is retained beside the audit as `zotero-export-candidate.json`, pending reconciliation with the canonical corpus and its corrections.

Two conservative identity holds were resolved against publication sources. DOI `10.1145/3381884` already exists as Zotero item `R2LPR3VD` with its full subtitle, as confirmed by the [institutional publication record](https://researchportal.hkust.edu.hk/en/publications/broadening-artificial-intelligence-education-in-k-12-where-to-sta/). DOI `10.26615/978-954-452-098-4-060` identifies the separate proceedings version confirmed by [ACL Anthology](https://aclanthology.org/2025.ranlp-1.60/) and [Crossref](https://api.crossref.org/works/10.26615%2F978-954-452-098-4-060). Its cited resolution and exact payload are in the local version-resolution plan, and the new Zotero item is `2RK458W2`. Existing preprint records were preserved. These are bibliographic identity checks and confer no screening authority.

### Residual packages and the import checklist

`src/acquire/zotero_import_residuals.py` prepares the import itself. It reads the prepared packages in a fixed order, the leading `codex-websearch-2026-zotero-import.ris` first, then the older packages in the order of the list above and last the lane files of July 2026, and writes for every following package a cleaned residual RIS file that holds only the records no earlier package carries. The leading package is read and never written. Every kept record is copied verbatim out of its source file, so the tags, keywords and candidate notes of the package reach Zotero unchanged. Across the leading package and all residual files each record occurs once, which a test asserts against the repository packages.

The matching rules are those of the reconciliation tool, normalised DOI first and then normalised title plus publication year, with author names playing no part. Two situations keep a record although an earlier package carries its title, the years differing or one of them missing, and title and year agreeing while both records carry a different DOI. Such a record stays in the residual file and appears in the checklist as a version relation, because the import plan asks for distinct Preprint, Accepted Manuscript, proceedings and Version-of-Record expressions to be retained as related Versions rather than merged.

The output directory is named by the `--date` flag, the clock is not read, and a run into an existing directory is refused, so a prepared import cannot be overwritten silently. Beside the residual files the run writes `import-checklist.md`, which gives the import order with the source hashes, the records of the leading package, per following package the records to import and the records left out with the record that covers them, the version relations, the duplicate groups the committed export already holds, and the outstanding metadata corrections of `bibliographic-audit.json` with their Zotero key where the export holds one. The checklist states data and leaves counting to the reader.

```
python -m src.acquire.zotero_import_residuals --date 2026-09-20
```

The prepared import of 2026-09-20 lies in `generated/zotero-import/2026-09-20/`. Its residual files cover the two older import packages, the historical recovery, the targeted follow-up and the four lane files. The contextual update loses the 2026 records the leading package carries, the lane files lose records to the round-two package and to each other, and the historical recovery and the targeted follow-up keep all of theirs. The data of that run reports no version relation, so every overlap there is a plain repetition. One dropped lane record carries a DOI that the covering record lacks, which the checklist marks so that the identifier is not lost in the merge.

### Works with conflicts or holds

`generated/completion/work-verification-queue.csv` is the source of truth for these states. The works are identified by title and Zotero record keys because the author metadata of the affected records is itself inconsistent.

| Work | Records | State | Next step |
|---|---|---|---|
| Prompt engineering techniques for mitigating cultural bias against Arabs and Muslims in large language models: A systematic review | `5UAHQESQ`, `6MJYP7ZX`, `EHQBHVYV` | Source integrity hold. The arXiv version was withdrawn by its author as incomplete, and the historical resolution finds no evidence for the Version of Record that the registry prefers. The historical human Include stays recorded, and the work is withheld from current synthesis and release | Exact-Version reconciliation in Zotero and an explicit integrity resolution |
| AI Gender Bias, Disparities, and Fairness: Does Training Data Matter? | `CHJQ52DC`, `CSJS9JGH` | Conflicting human decisions and a source-version hold, because the bound text is an earlier arXiv revision than the binding declares | Decision by the domain experts and a corrected source binding |
| Predicting successful placements for youth in child welfare with machine learning | `EXRF5629` | Open negative AI source review. Local metadata and source binding were repaired on 2026-09-05 | Fresh governed screening of the repaired source by agents, then domain-expert verification |

The works in the source acquisition queue lack a reviewed Paper source. Their blockers are recorded per work in the same file and in `generated/agent-screening-queue.json`.

### Conflicting statements in the record

- `corpus/deep-research/round2/LAUFPROTOKOLL.md` records the Zotero import of lanes L1 to L3 as done by the operator on 2026-07-17. The live inspection on 2026-09-21 confirms that their records are in the group library. The conflicting intake and offline reports used an older committed export. Local evidence is under `generated/zotero-sync/2026-09-21/` and the import plans. The historical recovery package also matches existing group records. Its title-variant case was resolved under [[#Authorised additive Zotero import]].

### Open decisions

| Decision | Required contribution |
|---|---|
| Author set and order for the result paper | Decision by the co-author group |
| Final scholarly release of verified research records and outputs | Person-attributed publication approval; the preliminary AI-source-reviewed release is already authorised |
| Final submission package | Approval of manuscript, supplement, disclosures, and selected venue requirements |
