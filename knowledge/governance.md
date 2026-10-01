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
updated: 2026-10-01
authors: [Christopher Pollin]
generated-with: Codex (GPT-5.6), Codex (GPT-6), Claude Code (Claude Opus 5.5)
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
| Confirmation or correction of the consolidated expert decision | Domain expert in PRISM | Own screening record derived from the expert assessment, with a curated baseline of basis `legacy_import` | None beyond the expert's own screening record, never `verified` |
| Scholarly verification | Domain expert | Accepted, corrected and accepted, changes requested, or rejected | `verified` for accepted outcomes |
| Publication approval | Authorised person | Approval event over a verified artifact | `publication-approved` |

Deterministic validation evaluates explicit machine-readable requirements. AI Agent Review evaluates source support without conferring scholarly authority. Domain-expert verification evaluates evidence and interpretation. Publication approval records final scholarly release. The separately authorised AI-reviewed release policy below controls preliminary result projections.

## Screening lifecycle

The canonical order is `identified → curated → agent-annotated → ai-agent-reviewed → verified → publication-approved`. Every transition records a timestamp, an activity, and an actor reference. The state describes achieved authority for one artifact. It does not propagate automatically to a derived Assertion, report passage, figure, or paper claim.

Round one retains its conducted comparative design. Its consolidated expert annotation governs the round-one corpus decision, while the separately recorded LLM assessment supports the divergence analysis. Round two uses operationally isolated AI-agent tracks, deterministic PRISM transfer, separate source-grounded AI Agent Review, deferred domain-expert verification, and a separate publication decision. The PRISM interface no longer distinguishes rounds, while every record keeps the provenance that tells them apart.

PRISM prefills a document without an own record with the consolidated expert decision (ADR-042). A domain expert who saves it writes a human-authored screening record whose provenance names the expert assessment it derives from and whose lifecycle starts from a curated baseline with the basis `legacy_import`. Such a record is not a verification and never reaches `verified`. Anchoring on the expert decision is part of this design. These reviewer files confirm or correct the consolidated expert decision and are never a second independent human track, so no analysis may treat them as one or measure agreement with the expert decision on them.

Human screening in PRISM is no longer the verification of agent records. Following the team decision of 1 October 2026 (ADR-044), the reviewers screen without any AI pre-assessment. PRISM shows them neither the LLM assessment nor the productive agent record, and a paper with only an agent record starts empty. The agent records keep their state `ai-agent-reviewed` and remain a separate track that is compared with the human decisions afterwards. Domain-expert verification and publication approval of an agent record remain lifecycle steps of the contract, but PRISM offers no path to record them, and verification events recorded before that decision stay valid as historical evidence. The open papers are split between the two reviewers by the append-only `docs/data/screening/assignment.json` (ADR-043), and each person writes one reviewer file under their own key.

## Verification scope decision, 22 September 2026

The operator accepts domain-expert verification of individual statements or fields. An accepted review applies only to the named content and its evidence basis in the checked version. Other fields, the containing document and derived interpretations retain their own authority. A whole-record verification remains possible when that is the declared review scope.

The lifecycle contract and validator still implement whole-record verification, and since ADR-044 PRISM offers no action to record it. The newly authorised field-level review cannot yet be recorded without promoting the parent record. [[plan#Provenance and verification alignment]] defines the implementation gap. No existing record or receipt is reinterpreted as a field-level human review.

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

The operator authorised an explicitly attributed AI-source-reviewed result release on 2026-09-05. `config/publication_policy.json` defines eligible states, and a label alone never grants release. AI eligibility requires a current accepted source-review receipt with agent identity, available model identity, timezone-qualified timestamp, findings, source locators, and matching artifact/source hashes. `generated/verification/ai-source-reviews.json` preserves both positive and negative outcomes. The latest outcome across a screening record and its correction family governs its eligibility in both publication and completion reporting. Missing or stale support cannot enter the result projection. This permission does not promote any artifact to `verified` or `publication-approved`.

AI corrections live in immutable, attributed sidecar artifacts under `generated/verification/screening-corrections-*.json`. Each binds the original record hash, field-level before/after values, reason, actor and time. A later source-review receipt checks the correction. Contract 0.1 permits supported `AN_` analysis changes, and contract 0.2 additionally permits the explicitly bounded Fairness 2→1 adjustment and exact existing Paper-quotation corrections against a separately registered source Version. The publisher preserves the derived decision, original screening document and historical annotations. A changed base record invalidates its correction. Bibliographic/version conflicts remain withheld until an attributed metadata or exact-source reconciliation has actually resolved them. Ambiguous interpretation remains explicit until reviewed. A review of a corrected projection must target its correction artifact, and a review of the original record remains attached to that original artifact.

Later negative reviews of a screening record or its correction family suppress earlier acceptances and never reactivate an older coding. One attributed review session may reject the exact original and accept its hash-bound correction at the same timestamp when agent, model and original/base hash match. Other conflicting simultaneous family outcomes stop publication. Canonical projection permits only an explicitly checked mapping of missing or recognised matching legacy identifiers. Foreign Work/Version evidence cannot be relabelled by attaching a receipt.

`build/site/` is the allowlisted result artifact and the public Evidence Companion. It contains released source-linked Assertions, reviewed Work-level screening, selected bibliographic metadata, aggregate analysis coverage and a download built from those same datasets ([[specification#Public Evidence Companion]]). `docs/` contains the working PRISM and Companion surfaces with internal research data and must not be deployed wholesale. On 29 September 2026 the operator decided that GitHub Pages shows only the result page, and the switch of Pages to the result site is still pending ([[plan#Deployment]]). The plan of the same date to remove protected full texts from the repository was superseded on 1 October 2026, when the operator decided that the full texts stay in the now private repository as the tracked `generated/markdown_clean/`. The reading layer under `docs/data/fulltext/` is rebuilt locally by `npm run build`, stays git-ignored and is never served by Pages. The same holds for `docs/data/assertions_working.json`, the local projection of draft Assertions for the Argumentkarte, so unreleased Assertions appear only in a local clone after a build. Human verification and approval remain necessary for the final scholarly manuscript, as distinguished from this labelled preliminary release.

The GitHub repository has been private since 1 October 2026. It remains the attributed research working record for the project team, and its files and history were publicly readable before that date. GitHub Pages at `https://chpollin.github.io/FemPrompt_SozArb/` stays public and still serves `docs/` from `main` through the legacy branch build. The working surfaces under `docs/`, including internal working data, therefore remain publicly reachable until the deployment switch. Links from public pages into the repository no longer resolve for the public. The switch to the manually dispatched `.github/workflows/pages.yml`, which builds, checks and uploads only `build/site/`, requires the operator's authorisation and has not taken place ([[testing#Local preview and deployment]]).

The following release questions are open and await the operator.

- Whether aggregate coverage counts about unreleased Works may appear on the result site. `meta.analysis_coverage` publishes such counts without content of the unreleased Works ([[data#Analysis field states and coverage]]). The earlier release meta counted only the productive track.
- How to present a Work released as an AI Include whose consolidated human decision is Exclude. Kubes (2024), *Feministische KI – Künstliche Intelligenz für alle?*, appears in the public matrix on the basis of its AI source review, while the historical human Exclude stays recorded as a documented round-specific divergence.

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
