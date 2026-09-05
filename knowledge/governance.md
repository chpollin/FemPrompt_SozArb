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
updated: 2026-09-05
authors: [Christopher Pollin]
generated-with: Codex (GPT-5.6)
topics: ["[[Research Governance]]", "[[Provenance]]", "[[Human-in-the-Loop]]"]
related: [project, methods, data, specification, verification, testing, update-protocol]
---

# Governance

FemPrompt assigns each research operation a defined actor, evidence basis, authority level, and publication boundary. AI agents may prepare the complete corpus and conduct source-grounded review. Domain experts retain final scholarly authority over verification, interpretation, and publication approval.

## Authority model

| Operation | Actor | Recorded result | Authority established |
|---|---|---|---|
| Source coding | AI agent or person | Annotation with evidence and provenance | `agent-annotated` for the governed agent path |
| Deterministic validation | Software agent | Hash-bound check receipt | Structural or rule conformance stated by the check |
| Source-grounded AI Agent Review | AI agent with reviewer role | Review report and lifecycle event | `ai-agent-reviewed` |
| Scholarly verification | Domain expert | Accepted, corrected and accepted, changes requested, or rejected | `verified` for accepted outcomes |
| Publication approval | Authorised person | Approval event over a verified artifact | `publication-approved` |

Deterministic validation evaluates explicit machine-readable requirements. AI Agent Review evaluates source support without conferring scholarly authority. Domain-expert verification evaluates evidence and interpretation. Publication approval records final scholarly release. The separately authorised AI-reviewed release policy below controls preliminary result projections.

## Screening lifecycle

The canonical order is `identified → curated → agent-annotated → ai-agent-reviewed → verified → publication-approved`. Every transition records a timestamp, an activity, and an actor reference. The state describes achieved authority for one artifact. It does not propagate automatically to a derived Assertion, report passage, figure, or paper claim.

Round one retains its conducted comparative design. Its consolidated expert annotation governs the round-one corpus decision, while the separately recorded LLM assessment supports the divergence analysis. Round two uses operationally isolated AI-agent tracks, deterministic PRISM transfer, separate source-grounded AI Agent Review, deferred domain-expert verification, and a separate publication decision.

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

The operator authorised an explicitly attributed AI-source-reviewed result release on 2026-09-05. `config/publication_policy.json` defines eligible states; a label alone never grants release. AI eligibility requires a current accepted source-review receipt with agent identity, available model identity, timezone-qualified timestamp, findings, source locators, and matching artifact/source hashes. `generated/verification/ai-source-reviews.json` preserves both positive and negative outcomes. The latest review of an artifact governs its eligibility. Missing or stale support cannot enter the result projection. This permission does not promote any artifact to `verified` or `publication-approved`.

AI analysis corrections live in immutable, attributed sidecar artifacts under `generated/verification/screening-corrections-*.json`. Each binds the original record hash, field-level before/after values, reason, actor and time. A later source-review receipt checks the correction. The publisher applies only supported analysis-field changes to its derived projection, records that basis, and preserves the original screening document and all historical annotations. A changed base record invalidates its correction. Bibliographic/version conflicts and ambiguous interpretation remain explicit unresolved findings. A review of a corrected projection must target its correction artifact; a review of the original record remains attached to that original artifact.

`build/site/` is the allowlisted result artifact. It contains released source-linked Assertions, reviewed Work-level screening, selected bibliographic metadata and a download built from those same datasets. `docs/` contains the working PRISM/Companion surfaces and must not be deployed wholesale. The repository remains an attributed research working record; the result-site boundary does not make existing repository files or Git history private. Human verification and approval remain necessary for the final scholarly manuscript, as distinguished from this labelled preliminary release.

Later negative reviews of a screening record or its correction family suppress earlier acceptances; they never reactivate an older coding. Conflicting family outcomes at the same timestamp stop publication. Canonical projection permits only an explicitly checked mapping of missing or recognised matching legacy identifiers; foreign Work/Version evidence cannot be relabelled by attaching a receipt.

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
