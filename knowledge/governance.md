---
title: Governance
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
topics: ["[[Research Governance]]", "[[Provenance]]", "[[Human-in-the-Loop]]"]
related: [project, methods, data, specification, verification, testing, update-protocol]
---

# Governance

FemPrompt assigns each research operation a defined actor, evidence basis, authority level, and publication boundary. AI agents may prepare the complete corpus and conduct source-grounded review. Domain experts retain final scholarly authority over verification, interpretation, and publication approval.

## Authority model

| Operation | Actor | Recorded result | Authority established |
|---|---|---|---|
| Additive Zotero import | Agent under the operator's explicit authorisation of 2026-09-21 | Source-bound plan, new group records, read-back receipt and unchanged pre-existing items | Bibliographic ingestion only, with no screening or scholarly approval |
| Source coding | AI agent or person | Annotation with evidence and provenance | `agent-annotated` for the governed agent path |
| Deterministic validation | Software agent | Hash-bound check receipt | Structural or rule conformance stated by the check |
| Source-grounded AI Agent Review | AI agent with reviewer role | Review report and lifecycle event | `ai-agent-reviewed` |
| Scholarly verification | Domain expert | Accepted, corrected and accepted, changes requested, or rejected | `verified` for accepted outcomes |
| Publication approval | Authorised person | Approval event over a verified artifact | `publication-approved` |

Deterministic validation evaluates explicit machine-readable requirements. AI Agent Review evaluates source support without conferring scholarly authority. Domain-expert verification evaluates evidence and interpretation. Publication approval records final scholarly release. The separately authorised AI-reviewed release policy below controls preliminary result projections.

## Screening lifecycle

The canonical order is `identified → curated → agent-annotated → ai-agent-reviewed → verified → publication-approved`. Every transition records a timestamp, an activity, and an actor reference. The state describes achieved authority for one artifact. It does not propagate automatically to a derived Assertion, report passage, figure, or paper claim.

Round one retains its conducted comparative design. Its consolidated expert annotation governs the round-one corpus decision, while the separately recorded LLM assessment supports the divergence analysis. Round two uses operationally isolated AI-agent tracks, deterministic PRISM transfer, separate source-grounded AI Agent Review, deferred domain-expert verification, and a separate publication decision.

## Verification scope decision, 22 September 2026

The operator accepts domain-expert verification of individual statements or fields. An accepted review applies only to the named content and its evidence basis in the checked version. Other fields, the containing document and derived interpretations retain their own authority. A whole-record verification remains possible when that is the declared review scope.

The current PRISM lifecycle still implements whole-record verification. It cannot yet record the newly authorised field-level review without promoting the parent record. [[plan#Provenance and verification alignment]] defines the implementation gap. No existing record or receipt is reinterpreted as a field-level human review.

The proposed simplification would remove a mandatory additional publication-approval action after sufficient human verification of the content being released. The following publication contract still describes the current implementation. Existing approval events remain historical evidence. The exact release projection for mixed-authority records, its purpose and rights boundaries still need to be settled before the current publisher changes. The authorised preliminary AI-reviewed release keeps its own attributed basis. Manuscript submission remains an explicit decision over the final manuscript.

## Provenance requirements

Each governed agent run binds the following information in its manifest and derived records.

- Run identifier, repository revision, prompt version, model identifier, and execution timestamp
- Assigned Paper sources and source hashes
- Stable Work identity, exact source Version, publication stage, and preferred-Version relation
- Reviewer identity, actor type, role, and output path
- Coding packet, projected PRISM track, AI Agent Review, and derived productive record
- Hashes for every artifact participating in validation or derivation
- Lifecycle events and validation receipts over the exact active annotation

Operational isolation uses separate agent contexts, reviewer identities, assignments, and output paths. It limits direct cross-track contamination and documents execution conditions. The project makes no epistemic-independence claim for language models.

## Corrections and re-execution

A domain-expert correction creates a complete new annotation version. The correction records its reason, field-level differences, responsible person, timestamp, and the annotation it supersedes. Earlier versions remain immutable. Re-execution creates a new run and new provenance records, preserving the prior run as research evidence.

## Publication boundary

The operator authorised an explicitly attributed AI-source-reviewed result release on 2026-09-05. `config/publication_policy.json` defines eligible states; a label alone never grants release. AI eligibility requires a current accepted source-review receipt with agent identity, available model identity, timezone-qualified timestamp, findings, source locators, and matching artifact/source hashes. `generated/verification/ai-source-reviews.json` preserves both positive and negative outcomes. The latest outcome across a screening record and its correction family governs its eligibility in both publication and completion reporting. Missing or stale support cannot enter the result projection. This permission does not promote any artifact to `verified` or `publication-approved`.

AI corrections live in immutable, attributed sidecar artifacts under `generated/verification/screening-corrections-*.json`. Each binds the original record hash, field-level before/after values, reason, actor and time. A later source-review receipt checks the correction. Contract 0.1 permits supported `AN_` analysis changes; contract 0.2 additionally permits the explicitly bounded Fairness 2→1 adjustment and exact existing Paper-quotation corrections against a separately registered source Version. The publisher preserves the derived decision, original screening document and historical annotations. A changed base record invalidates its correction. Bibliographic/version conflicts remain withheld until an attributed metadata or exact-source reconciliation has actually resolved them. Ambiguous interpretation remains explicit until reviewed. A review of a corrected projection must target its correction artifact; a review of the original record remains attached to that original artifact.

`build/site/` is the allowlisted result artifact. It contains released source-linked Assertions, reviewed Work-level screening, selected bibliographic metadata and a download built from those same datasets. `docs/` contains the working PRISM/Companion surfaces and must not be deployed wholesale. The repository remains an attributed research working record; the result-site boundary does not make existing repository files or Git history private. Human verification and approval remain necessary for the final scholarly manuscript, as distinguished from this labelled preliminary release.

Later negative reviews of a screening record or its correction family suppress earlier acceptances; they never reactivate an older coding. One attributed review session may reject the exact original and accept its hash-bound correction at the same timestamp when agent, model and original/base hash match. Other conflicting simultaneous family outcomes stop publication. Canonical projection permits only an explicitly checked mapping of missing or recognised matching legacy identifiers; foreign Work/Version evidence cannot be relabelled by attaching a receipt.

## Authorised additive Zotero import

The operator authorised agents to add missing prepared records to the `FemPrompt_SozArb` group on 21 September 2026. `src/acquire/zotero_group_import.py` implements creation-only writes using a key with read/write permission only for group `6080294`. Personal library and other group access remain disabled. Existing items are neither updated nor merged by this importer. The separate reconciliation tool retains its read-only credential contract.

Each import uses a source-hash-bound plan and a consistent live library snapshot. Application checks the library version and reads back every creation. Uncertain writes stop with a receipt and require reconciliation before continuation. Existing-item corrections require their own explicitly scoped operation and evidence. [[methods#Zotero reconciliation and import]] owns the commands, matching rules and persistence procedure.

Local snapshots, payload plans and receipts remain under ignored `generated/zotero-sync/` because they may contain private notes. The completed imports and the separately authorised title correction are documented in [[journal]]. The canonical corpus preserves original raw records and appends reconciled additions, while `corpus/zotero_sync.json` records membership and confirmed aliases. This authority grants bibliographic ingestion only.

## Targeted reconciliation and data maintenance

The indexed AI-review ledger uses hash-pinned immutable batches. It resolves the complete positive and negative review history before applying the latest-outcome rule. A changed, missing, nested or duplicated batch fails validation; an unlisted new file cannot grant publication.

Local bibliographic corrections are explicit AI-source-reviewed projections in `corpus/metadata_corrections.json`. They bind each original Zotero record hash and exact before/after values to the reviewing agent, available model, time, findings and checked source artifacts. They can correct metadata used in derived outputs without claiming that the external Zotero library was edited. A later changed export requires reconciliation of the correction. A disproven DOI is removed from active identity aliases and retained in the audit. Invalidated synthetic abstracts and knowledge documents cannot continue to masquerade as the corrected source.

`generated/verification/historical-resolution-2026-09-05.json` documents exact-row identity mappings, administrative author-error dispositions, round-specific differences and integrity findings. The completion builder checks historical row hashes, canonical target identities and source evidence before applying these interpretations. Historical human decisions remain unchanged. An attributed explanation of a metadata-error exclusion can expose an already recorded substantive Include; it does not create a new human Include. Conflicting substantive human decisions remain visible. A source or withdrawal hold restricts current synthesis and release without rewriting that historical decision or falsely declaring every publication expression retracted.

Alternative source Versions are bound separately from the bibliographic record and preferred Version in `corpus/source_version_bindings.json`. A narrowly scoped correction of an existing category level or exact quotation must preserve the derived decision and authority, match the original record and pass source-Version and quotation checks. It cannot change lifecycle state, invent a human actor or turn a new inclusion decision into a minor correction.

## Canonical carriers

| Concern | Canonical carrier |
|---|---|
| Lifecycle vocabulary and transition constraints | `docs/data/screening_lifecycle_contract.json` |
| Record structure and provenance fields | [[data]] |
| Work-Version vocabulary, identity, and record bindings | `docs/data/work_version_contract.json` and `corpus/work_version_registry.json` |
| Round-two execution contract | [[update-protocol]] |
| PRISM decisions and their implementation history | [[specification]] |
| Technical guarantees | [[testing]] |
| Claim and artifact verification state | [[verification]] |
