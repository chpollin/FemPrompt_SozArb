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
updated: 2026-09-22
authors: [Christopher Pollin]
generated-with: Codex (GPT-5.6), Claude Code
related: [INDEX, plan, journal, governance, verification, testing]
---

# Handoff

## Current result

The follow-up branch `refactor/provenance-readiness` preserves conversion-review attribution, time, scope and checked file identities in the literature-readiness JSON and CSV. The completion projection reconciles candidate identifiers with the canonical registry and dated Zotero membership. Title-derived matches cannot establish a bibliographic Version, and conflicting or ambiguous matches remain unbound. Reading-source readiness and review authority retain their existing checks.

The operator accepts human verification of individual statements or fields and selected comparative literature synthesis as the first analytical output. [[governance#Verification scope decision, 22 September 2026]] and [[research-vault#Comparative synthesis scope]] record those decisions. Field-level human review and its PRISM interface still require implementation under [[plan#Provenance and verification alignment]]. The substantive question answered by a field acceptance and the public projection of mixed-authority content remain to be defined. Existing publication rules remain active.

Local `main` inspected on 2026-09-22 contains the Zotero integration, source-bound preparation and repository consolidation. The additional FemPrompt worktrees have been removed after their local source files were copied and verified by SHA-256. Their histories remain reachable from `main`. Full-text preparation now shares registry and binding inputs within each invocation, and knowledge projection indexes aliases by exact Work-Version identity. [[data#Local source preservation]] records the retained source locations. These changes have not been pushed or deployed.

The constructive project review of 2026-09-05 is implemented on this line. It comprises canonical Work aggregation, derived inventory and rates, consistent downloads, source-bound Assertion retrieval, attributed AI review receipts, immutable analysis corrections, and an allowlisted preliminary result site. [[project-review-2026-09-05]] records the findings and their remedies, [[governance#Publication boundary]] the release rule. The productive agent track `docs/data/screening/ar2.json` stands at `ai-agent-reviewed`. No record carries domain-expert verification or publication approval.

The literature review and the manuscript are unfinished. `generated/completion/README.md` holds the current quantities and the per-work and per-candidate queues, and [[plan]] lists the remaining work.

The live Zotero imports of 2026-09-21 cover the prepared packages and the missing historical references. Every successful creation was read back. Existing group entries remained unchanged during those imports. The subsequent controlled completion corrected the source-verified title of `SHJQQTI6` through a separately scoped operation and preserved its other fields. The canonical corpus preserves the original raw records and appends the live additions, retaining hash-bound corrections and historical annotation keys. `corpus/zotero_sync.json` records live membership and reconciled historical aliases. PRISM projects the complete corpus and leaves newly admitted, unassessed categories unset. [[data]] defines this distinction.

## Continuation point

The operator authorised additive Zotero writes and completion of the source and knowledge-document coverage on 2026-09-21. [[plan#Authorised additive Zotero import]] governs local snapshots and receipts. Continue [[plan#Controlled corpus completion]] from the current inventory. The documented initial author conflicts have source-backed corrections, and the first source-to-PRISM batch has passed its checks. Recovered reading sources and independently reviewed knowledge documents are integrated. The dated acquisition evidence and knowledge-review receipts distinguish completed checks from remaining source, conversion and review gaps. The preparation state in [[research-vault]] permits attributed, unreviewed documents while preserving separate source review and expert verification. Rebuild with `npm run build` after changes, and screen source-ready works under [[update-protocol#Agent-assisted completion]].

Completed steps stay closed. The run `recovered-arxiv-sources-2-20260905` finished source binding, isolated coding and separate AI Agent Review for its two recovered arXiv sources. The mitigation-stage clarification in [[update-protocol#Source-review clarification, 5 September 2026]] and the correction batches under `generated/verification/` are documented and need no blanket manual repetition.

The works and separately registered aliases under a conflict or hold retain those restrictions. They are named in [[plan#Works with conflicts or holds]].

AI corrections retain the original annotations and carry a newly reviewed sidecar artifact. Local metadata corrections in `corpus/metadata_corrections.json` must be reconciled deliberately with any future Zotero export.

## Working in this clone

`knowledge/project.md` is a hash-bound input of `generated/build-manifest.json` and of the completion package. A change to that file requires `npm run build` and a commit of the regenerated artifacts, otherwise `npm run check:data` fails.

A fresh clone lacks the ignored local reading layer under `docs/data/fulltext/`. `npm run check:data` and `python -m src.analysis.build_completion_package --check` therefore fail until `npm run build` has reconstructed it. The build needs no network access and no API key. Setup and gates are described in [[testing#Clean-checkout verification]].

`npm run preview` serves the working application from `docs/` with the Evidence Companion at `/index.html` and PRISM at `/prisma.html`. The generated result export is available under `/results/index.html`. PRISM opens in read mode, and `Bearbeiten` enables reviewer setup, annotation and saving.

Third-party PDF binaries remain under the ignored local source directory. Their verified SHA-256 values are retained in the acquisition manifests. Versioned Markdown, repairs, visual assets, source audits and readiness records provide the reproducible repository state.

## Verification state

The provenance-readiness changes passed the full build, freshness check, JavaScript and Python suites, result-site browser tests, targeted Ruff rules and formatting checks. Independent review found and resolved a title-match identity error before acceptance. The build-manifest comparison confines output changes to completion and literature-readiness projections. Original research inputs and review receipts remain byte-identical to the pre-change snapshot. Knowledge links and the revised prose were checked. No new human verification or publication-policy migration was performed.

The consolidation check of 2026-09-22 passed the complete build, project checks, Companion browser checks and PRISM pilot. Repeated builds produced identical manifests, and a Git archive export without private PDFs, credentials or caches reproduced the same manifest and passed the same suites. Research projections remained unchanged, and original research files and retained local sources matched their recorded byte hashes. The local preview served PRISM, the Companion and the result export successfully. These observations establish local technical behaviour. The native folder permission check of `tests/manual-checklist.md` and scholarly verification by domain experts remain open. [[verification]] holds the authority state per claim family.

The previously reported missing-document failure was traced to Windows path length handling. The documents existed, and the download and projection helpers now read their extended paths. Source and knowledge-document checks also exposed historical title-based mislinks, which are withheld or replaced by hash-bound recoveries. The importer retains the existing script-pipeline layout and dependency setup. No package migration or type-checker configuration was introduced. The latest [[journal]] entry records the completed integration checks.

The clean installation reported an existing `npm audit` advisory for the indirect development dependency `undici`. Its lockfile entry was unchanged by this refactor. Dependency remediation remains separate from the verified source-preparation changes.
