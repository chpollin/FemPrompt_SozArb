---
title: Constructive project review and implementation
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
status: active
language: en
version: "0.7"
created: 2026-09-05
updated: 2026-09-05
related: [plan, governance, methods, testing, verification, handoff]
---

# Constructive project review and implementation

The research infrastructure is usable and has a reproducible result build. The entire intended literature review is not complete: identified intake needs canonical source binding and screening, existing coding conflicts need resolution, and the full evidence synthesis and manuscript remain open. Current quantities and item states are generated in `generated/completion/README.md`; this document explains their implications without maintaining a second inventory.

## Implemented improvements

| Finding | Implemented remedy | Practical consequence |
|---|---|---|
| Bibliographic aliases could inflate thematic results | Aggregate eligible annotations once per canonical Work; preserve aliases and exact publication Versions; reject conflicting eligible codings | Counts have an explicit denominator and auditable source records |
| Fixed historical rates and competing inventory joins drifted | Derive Promptotyping metrics and downloads from the canonical corpus; remove duplicated full corpus blocks from journey enrichment | The working views and exports refer to the same inventory |
| Chat could rely on short abstracts, generated reasoning and unrelated padding | Retrieve released Assertions and their exact evidence blocks; answer absent-evidence queries locally; require supplied evidence IDs in model answers | The interface exposes the actual evidence scope instead of implying coverage of the whole corpus |
| Public working files and a UI publication filter were conflated | Build a separate allowlisted result site and matching research ZIP under `build/site/` | Only the selected result artifact is deployed; repository working records remain explicitly identified |
| AI review was not uniformly attributed at the released artifact | Store agent, available model identity, UTC time, findings, source locators and exact artifact/source hashes | Review provenance is visible and remains distinct from human verification |
| Source reading exposed incorrect locators and analysis coding | Correct active source locators; retain original negative reviews; apply clear analysis changes as reviewed immutable sidecar projections | Historical annotations remain intact and users can inspect the before/after reasoning |
| Readiness provenance could point to a visual manifest instead of the acquisition manifest | Separate the two path variables | Source readiness points back to the correct acquisition record |
| Reproduction depended on local caches, output freshness and fixed test ports | One offline build, managed input/output manifest, committed enrichment inputs, cross-platform text hashing, deterministic ZIPs, CI and available-port browser tests | Local and clean-checkout builds can be compared without hidden local state |
| PRISMA references and synthesis applicability were outdated | Reconcile the conformance map with the canonical manuscript and distinguish synthesis preparation from completed reporting | Reporting gaps remain visible and actionable |

## Unresolved source findings

These records remain withheld from the preliminary result. The ledger contains source-specific evidence and the queue carries their current status.

| Record | Resolution needed |
|---|---|
| `3GB9B4IJ` | Reconcile the bibliographic publication year with the original source through the canonical metadata workflow |
| `7L78MV2V` | Define how a review's synthesis of evaluated interventions maps to mitigation status; avoid confusing measurement of bias with evaluation of a mitigation |
| `EXRF5629` | Obtain an identifiable original source instead of relying on a truncated synthetic metadata summary |
| `J5EF9W6M` | Resolve inferred processing-stage labels against explicit operational definitions and source passages |
| `P4YQIKJX` | Resolve broad multi-stage mitigation coding against the source and a more precise codebook |
| `VSZM7CT6` | Bind the accepted-manuscript source to its exact Version and repair the quoted passage before re-review |

Legacy human and agent annotations remain separate tracks. A recorded historical human decision does not fill missing actor/model/source provenance and does not resolve a conflicting alias automatically. Administrative duplicate exclusions are distinguished from substantive disagreements. The completion package also retains unmapped historical records, source blocks and unbound candidates.

## Completion and useful outputs

The result site and download already support evidence lookup, source-linked questions and inspection of the reviewed subset. The completion tables support planning the remaining work across the entire corpus, including the prepared 2026 intake and separately dated targeted additions. New candidate metadata and RIS are ready for curation; identification does not imply inclusion.

After source binding, complete coding and Assertion-based synthesis, the same structured data can support:

- A literature report and follow-up paper with reproducible tables and traceable claims.
- Descriptive comparisons of prompting techniques, bias axes, mitigation evidence and social-work contexts, using clearly stated Work denominators.
- Teaching materials and case discussions about feminist AI literacy, distinguishing source findings from suggested professional practice.
- A citable research-data release with its codebook, source provenance, limitations and release fingerprint.
- Later literature updates that preserve the original search window and show what each new batch changes.

Research priorities are precise mitigation-stage definitions, source and Version reconciliation, complete coding of newly bound candidates, study-quality appraisal and expansion of the active Assertion chain. Practice recommendations require a stronger synthesis than the existence of a prompt technique in an individual paper. The preliminary AI-reviewed release and the final author-approved scholarly manuscript remain explicitly separate products.

## Operation

Follow the setup commands in `README.md`. `npm run build` constructs all managed projections and `npm run check` verifies them. The result site is `build/site/`; `docs/` is the working application. The Pages workflow is prepared for an explicit deployment from main. This implementation did not push, publish, alter Zotero or complete the scientific manuscript.
