---
title: Handoff
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: active
language: en
version: "0.7"
created: 2026-08-23
updated: 2026-09-21
authors: [Christopher Pollin]
generated-with: Codex (GPT-5.6), Claude Code
related: [INDEX, plan, journal, governance, verification, testing]
---

# Handoff

## Current result

Local `main` inspected on 2026-09-21 includes the September source-review implementation, knowledge refactor and read-only Zotero tooling. The previous handoff's claim that those changes were absent from `main` is superseded by the observed history. The additive Zotero integration is developed on `codex/zotero-group-import`. Deployment has not been inspected in this session.

The constructive project review of 2026-09-05 is implemented on this line. It comprises canonical Work aggregation, derived inventory and rates, consistent downloads, source-bound Assertion retrieval, attributed AI review receipts, immutable analysis corrections, and an allowlisted preliminary result site. [[project-review-2026-09-05]] records the findings and their remedies, [[governance#Publication boundary]] the release rule. The productive agent track `docs/data/screening/ar2.json` stands at `ai-agent-reviewed`. No record carries domain-expert verification or publication approval.

The literature review and the manuscript are unfinished. `generated/completion/README.md` holds the current quantities and the per-work and per-candidate queues, and [[plan]] lists the remaining work.

The live Zotero imports of 2026-09-21 cover the prepared packages and the missing historical references. Every successful creation was read back. Existing group entries remained unchanged. The canonical corpus preserves the original raw records and appends the live additions, retaining hash-bound corrections and historical annotation keys. `corpus/zotero_sync.json` records live membership and reconciled historical aliases. PRISM projects the complete corpus and leaves newly admitted, unassessed categories unset. [[data]] defines this distinction.

## Continuation point

The operator authorised additive Zotero writes and completion of the source and knowledge-document coverage on 2026-09-21. [[plan#Authorised additive Zotero import]] governs local snapshots and receipts. Continue with the unresolved source-version matches and the remaining source-specific distillates. The preparation state in [[research-vault]] permits attributed, unreviewed documents while preserving separate source review and expert verification. Rebuild with `npm run build` after changes, and screen source-ready works under [[update-protocol#Agent-assisted completion]].

Completed steps stay closed. The run `recovered-arxiv-sources-2-20260905` finished source binding, isolated coding and separate AI Agent Review for its two recovered arXiv sources. The mitigation-stage clarification in [[update-protocol#Source-review clarification, 5 September 2026]] and the correction batches under `generated/verification/` are documented and need no blanket manual repetition.

Three works carry a conflict or hold that agents must preserve and cannot resolve. They are named in [[plan#Works with conflicts or holds]].

AI corrections retain the original annotations and carry a newly reviewed sidecar artifact. Local metadata corrections in `corpus/metadata_corrections.json` must be reconciled deliberately with any future Zotero export.

## Working in this clone

`knowledge/project.md` is a hash-bound input of `generated/build-manifest.json` and of the completion package. A change to that file requires `npm run build` and a commit of the regenerated artifacts, otherwise `npm run check:data` fails.

A fresh clone lacks the ignored local reading layer under `docs/data/fulltext/`. `npm run check:data` and `python -m src.analysis.build_completion_package --check` therefore fail until `npm run build` has reconstructed it. The build needs no network access and no API key. Setup and gates are described in [[testing#Clean-checkout verification]].

`npm run preview` serves the working application from `docs/` with the Evidence Companion at `/index.html` and PRISM at `/prisma.html`. The generated result export is available under `/results/index.html`. PRISM opens in read mode, and `Bearbeiten` enables reviewer setup, annotation and saving.

Third-party PDF binaries remain under the ignored local source directory. Their verified SHA-256 values are retained in the acquisition manifests. Versioned Markdown, repairs, visual assets, source audits and readiness records provide the reproducible repository state.

## Verification state

The session close of 2026-09-05 in [[journal]] records the passing build, the automated suites, the browser pilot and a repository-only Windows reproduction. These are local runs, and the journal documents no CI run for this state. The native folder permission check of `tests/manual-checklist.md` and the scholarly verification by domain experts are open. [[verification]] holds the authority state per claim family.

The previously reported missing-document failure was traced to Windows path length handling. The documents existed, and the download and projection helpers now read their extended paths. Source and knowledge-document checks also exposed historical title-based mislinks, which are withheld or replaced by hash-bound recoveries. The importer retains the existing script-pipeline layout and dependency setup. No package migration or type-checker configuration was introduced. The latest [[journal]] entry records the completed integration checks.
