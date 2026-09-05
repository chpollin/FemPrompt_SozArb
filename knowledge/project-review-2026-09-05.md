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

## Checklist resolution

The targeted source-review batches and the completion package carry the current item states; the former blanket human checklist is no longer a separate application. `npm run preview` opens the existing result website and PRISM. Temporary checklist files are outside the build and are not a research authority record.

- The mitigation-status and processing-stage ambiguities were resolved against the existing codebook and original texts. The dated clarification is in `knowledge/update-protocol.md`; correction batch C preserves exact field changes and its source review.
- Trust-pilot metadata was reconciled across its aliases and the original source was reviewed again. The original youth-placement record was found to contain another paper's DOI and invented author/abstract details. The title-matching original was located; local metadata and source binding were repaired, while a fresh screening remains required.
- The social-work-education source is an Accepted Manuscript with textual differences from the Version of Record. Its exact source binding and narrowly scoped quotation/category correction preserve the preferred bibliographic Version and the original annotation.
- Historical identity reconciliation recovers existing decisions without creating Zotero records. Wrong-author exclusions are separated from substantive content decisions where the original note and primary metadata establish that distinction. The Ng Include is no longer lost behind two administrative Duplicate records.
- The Asseri review was withdrawn as incomplete. A current synthesis hold preserves the historical Include but prevents using the withdrawn findings as current support. The Latif conflict additionally exposes a v2 text served under a v4 binding. Its substantive human disagreement remains unresolved.
- The healthcare-trust and university-commentary differences are documented as round-specific scope/authority differences. Their historical human Exclude decisions remain intact; the newer AI assessment is a distinct record.
- The canonical manuscript now contains a provisional synthesis linked to the reviewed Assertions, with explicit model, evidence and transfer limits. It does not claim a completed whole-corpus synthesis or a formal study-quality appraisal.

Machine-readable identity, historical and residual-source reports under `generated/verification/` retain the actual agent, available model, review date and primary evidence. `generated/completion/historical-recovery.ris` prepares confirmed historical publications missing from the current registry for curation. Source access, pending screening and final scholarly decisions remain separate from metadata recovery.

## Completion and useful outputs

The result site and download already support evidence lookup, source-linked questions and inspection of the reviewed subset. The completion tables support planning the remaining work across the entire corpus, including the prepared 2026 intake and separately dated targeted additions. New candidate metadata and RIS are ready for curation; identification does not imply inclusion.

After source binding, complete coding and Assertion-based synthesis, the same structured data can support:

- A literature report and follow-up paper with reproducible tables and traceable claims.
- Descriptive comparisons of prompting techniques, bias axes, mitigation evidence and social-work contexts, using clearly stated Work denominators.
- Teaching materials and case discussions about feminist AI literacy, distinguishing source findings from suggested professional practice.
- A citable research-data release with its codebook, source provenance, limitations and release fingerprint.
- Later literature updates that preserve the original search window and show what each new batch changes.

Research priorities are applying the now documented mitigation-stage rules, resolving remaining source and Version conflicts, completing coding of newly bound candidates, study-quality appraisal and expanding the active Assertion chain. [The Vault coverage guide](research-vault.md#aktueller-implementierungsstand) distinguishes the historical knowledge archive, the active reviewed slice and analysis readiness. Practice recommendations require a stronger synthesis than the existence of a prompt technique in an individual paper. The preliminary AI-reviewed release and the final author-approved scholarly manuscript remain explicitly separate products.

## Operation

Follow the setup commands in `README.md`. `npm run build` constructs all managed projections and `npm run check` verifies them. `npm run preview` opens the working application from `docs/`; the optional result export is available under `/results/`. The Pages workflow requires an explicit deployment from main. The operator authorised committing and pushing the reviewed session on its working branch; this does not deploy the site, alter Zotero or complete the scientific manuscript.
