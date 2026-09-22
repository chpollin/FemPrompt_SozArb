---
title: Verification
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
generated-with: Codex (GPT-5.6), Codex (GPT-6)
topics: ["[[Verification]]", "[[Evidence Synthesis]]", "[[Research Integrity]]"]
related: [governance, testing, methods, standards, plan, analysis-divergence, analysis-sq-advisory, research-vault]
---

# Verification

This register states which externally relevant project claims have a reproducible derivation, which artifacts have received source-grounded AI Agent Review, and which still require domain-expert verification or publication approval. The underlying data and generated manifests remain the source for quantities.

## Verification classes

| Class | Question | Evidence |
|---|---|---|
| Deterministic validation | Does the artifact satisfy its schema, references, hashes, and transition rules? | Check receipt and test output |
| AI Agent Review | Does the annotation have support in the assigned Paper source? | Source-grounded review report |
| Domain-expert verification | Does the artifact represent the evidence and its scholarly meaning correctly? | Person-attributed verification event |
| Publication approval | May the verified artifact enter a public projection? | Person-attributed approval event |

## Current claim register

| Claim family | Current evidence | Current authority |
|---|---|---|
| Round-one flow and agreement figures | Re-derived from raw assessment files by the canonical replay, which self-tests against the committed benchmark | Deterministically validated; scholarly interpretation remains with the authors |
| Round-one divergence decomposition | Linked to named replay keys and documented in [[analysis-divergence]] | Complete project analysis; publication wording remains author-governed |
| PRISM screening and lifecycle behaviour | Automated unit, integration, mutation, and browser acceptance coverage | Technically validated |
| Work-Version identity layer | The canonical builder reconciles Zotero records and round-two candidates, validates controlled stages and relations, and reproduces the committed registry | Deterministically validated; marked identity and metadata conflicts require operator resolution |
| Codex Websearch 2026 source preparation | The package, acquisition manifest, direct source comparison, repairs, visual manifests, and source-readiness builder preserve exact source-Version provenance and validated hashes | Bibliographic bindings are recorded for the prepared intake. Reading-source Version reconciliation, remaining conversion losses and PRISM screening are evaluated separately per item |
| Residual source preparation and reconciliation | The dated residual ledger preserves the earlier access and identity findings; current metadata corrections, exact source bindings and completion rows record subsequent resolutions and remaining work | Source availability, fresh screening and accepted source review remain distinct states |
| Productive round-two agent annotations | `ar2.json` links every productive record through `review_runs` to manifest-bound source coding, deterministic PRISM projection, and separate source-grounded AI Agent Review artifacts | `ai-agent-reviewed`; domain-expert verification open |
| SQ1 to SQ3 synthesis | Generated completion tables expose field-specific denominators; the provisional manuscript uses the active reviewed Assertion slice | Descriptive preparation over declared subsets; full-corpus synthesis and domain-expert verification open |
| Public Literature Landscape | The explicit policy and current source-review ledger govern Work-level aggregation; aliases and exact Versions remain inspectable | Attributed AI-source-reviewed subset; unresolved records withheld and no human authority inferred |
| Active distillates and Assertions | The [active Vault guide](research-vault.md#current-implementation-state) identifies the starting slice; source passages, locators, artifact/source hashes and named AI attribution are checked | Source-reviewed active slice; neither legacy document links nor Graph co-occurrences extend its evidence coverage |

## The domain-expert verification path in PRISM

The route `docs/prisma.html?verify=1` opens the session in which a domain expert records the verification event that this register tracks. Its subject is the productive agent record for the current paper, resolved from the connected working folder rather than from a track the expert selects, and the assessment rail names it as the agent coding of that track. The expert keeps their own reviewer key. The recorded outcome, one of accepted, corrected and accepted, changes requested, or rejected, together with a publication approval taken afterwards, is appended to the expert's own reviewer file `docs/data/screening/<key>.json` under `verification_schema` `femprompt-prisma-verification/0.1` and the array `verifications`. The agent file is never written.

Each entry binds the paper, the agent track and the annotation it judges, the hash a deterministic validator recorded over that annotation or an explicit statement that no receipt exists, the expert and actor identifiers, the activity, the reason, and the complete lifecycle event. A correction carries the superseding annotation with its field-level differences, so the agent's original interpretation stays readable beside the expert's. When the folder is connected again, the expert file is projected onto a copy of the agent track, which is how the tool shows the achieved lifecycle state without persisting a derived record. The contract is ADR-040 in [[specification]], and the authority boundaries it preserves are those of ADR-035.

A recorded event establishes the authority of exactly the annotation it names. It extends to no derived Assertion, report section or paper claim, and a later correction of the agent record requires its own event.

## Rules for external claims

Count-bearing statements in the paper, report, and Evidence Companion must derive from committed data and an executable generator or replay. Qualitative literature statements must cite Assertions whose supporting distillates and source anchors resolve. A verified screening record does not verify a derived Assertion automatically. Each derived artifact receives its own evidence check and authority event.

The paper may describe implemented software behaviour after the applicable technical checks pass. It may describe agent annotations as `ai-agent-reviewed` when the source-grounded review exists. Final scholarly findings and manuscript approval remain author-governed. The operator separately authorised a labelled preliminary AI-source-reviewed result release; its exact-artifact requirements and correction semantics are defined in [[governance#Publication boundary]].

A run manifest establishes completed execution only when its lifecycle is complete and its validation receipts, source bindings, and output hashes resolve. The presence of generated files or productive records alone does not raise the authority of an unfinished run manifest.

## Remaining verification work

- Resolve the source, identity, and metadata blocks recorded in `generated/round2-intake-package.json` and `generated/agent-screening-queue.json`.
- Continue unresolved residual cases from the [current completion queue](../generated/completion/README.md) and the works named in [[plan#Works with conflicts or holds]], preserving the already applied [metadata corrections](../corpus/metadata_corrections.json) and [exact source bindings](../corpus/source_version_bindings.json).
- Use the completed imports and canonical membership recorded in `corpus/zotero_sync.json` as the bibliographic baseline. Reconcile residual exact-Version and reading-source gaps through [[plan#Source and corpus readiness]]. A prepared source without a current binding remains unavailable for productive screening even when its bibliographic record is already in Zotero.
- Resolve the remaining exact reading-source Version differences and recover missing accessible full texts. Existing bibliographic bindings and accepted source bindings remain valid unless their evidence changes.
- Bind the prepared intake's visual source bundles after Work-Version reconciliation. The run contract now supports hash-bound original PNGs as mandatory assigned reading when declared; standalone image-based category evidence remains outside the text-quotation contract.
- Apply the governed coding and AI Agent Review workflow to every work that becomes source-ready.
- Extend complete analysis coding and source-checked distillates for eligible literature, then generate Assertions for the qualitative synthesis. Recompute tables with their actual coverage denominators.
- Have domain experts verify the statements and fields used as findings and the derived report and paper interpretations. Each acceptance identifies its scope and evidence basis. The current whole-record workflow must not imply that target-level recording is already implemented.
- Apply the existing attributed AI-release policy to the preliminary subset; obtain person-attributed approval for artifacts claimed as the final scholarly release.
