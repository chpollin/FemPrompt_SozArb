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
updated: 2026-10-01
authors: [Christopher Pollin]
generated-with: Codex (GPT-5.6), Codex (GPT-6), Claude Code (Claude Opus 5.5)
topics: ["[[Verification]]", "[[Evidence Synthesis]]", "[[Research Integrity]]"]
related: [governance, testing, methods, standards, plan, data, analysis-methods, analysis-divergence, analysis-sq-advisory, research-vault]
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

## Current authority state

On 1 October 2026 no record, field, Assertion, report section or manuscript claim carries a domain-expert verification or publication-approval event. The productive round-two records reach at most `ai-agent-reviewed`. The earlier active Assertion slice carries attributed AI Agent Review. The SQ1 Assertions and the SQ1 chapter are `grounded`, which means that their references to active distillates resolve under the deterministic check and that no AI Agent Review has taken place. Only Assertions with an accepted AI review enter the [released Assertion index](../docs/data/assertion_index.json), so the SQ1 Assertions are not public.

## Current claim register

| Claim family | Current evidence | Current authority |
|---|---|---|
| Round-one flow and agreement figures | Re-derived from raw assessment files by the canonical replay, which self-tests against the committed benchmark. Since 1 October 2026 the replay and `merge_assessments.py` count the expert's `?` category marker as missing, which shifted the per-category agreement for Generative_KI and Soziale_Arbeit slightly. No knowledge document or manuscript quotes a changed value | Deterministically validated. Scholarly interpretation remains with the authors |
| Round-one divergence decomposition | Linked to named replay keys and documented in [[analysis-divergence]]. The per-item pattern classification has no committed source and is published as `null` ([[data#Historical concept graph and divergence classification]]) | Complete project analysis of the decomposition. Publication wording remains author-governed |
| PRISM screening and lifecycle behaviour | Automated unit, integration, mutation, and browser acceptance coverage | Technically validated |
| Work-Version identity layer | The canonical builder reconciles Zotero records and round-two candidates, validates controlled stages and relations, and reproduces the committed registry | Deterministically validated. Marked identity and metadata conflicts require operator resolution |
| Codex Websearch 2026 source preparation | The package, acquisition manifest, direct source comparison, repairs, visual manifests, and source-readiness builder preserve exact source-Version provenance and validated hashes | Bibliographic bindings are recorded for the prepared intake. Reading-source Version reconciliation, remaining conversion losses and PRISM screening are evaluated separately per item |
| Residual source preparation and reconciliation | The dated residual ledger preserves the earlier access and identity findings. Current metadata corrections, exact source bindings and completion rows record subsequent resolutions and remaining work | Source availability, fresh screening and accepted source review remain distinct states |
| Productive round-two agent annotations | `ar2.json` links every productive record through `review_runs` to manifest-bound source coding, deterministic PRISM projection, and separate source-grounded AI Agent Review artifacts | `ai-agent-reviewed`, domain-expert verification open |
| Published projections and analysis coverage | The generators publish an explicit state per analysis field and Work-level coverage with withholding reasons ([[data#Analysis field states and coverage]]). The repaired readers for the human diversity column, empty and `?` expert cells, case variants of Ja and Nein, the Zotero-keyed disagreement join and untruncated abstracts carry regression tests | Deterministically validated projection. Released states rest on attributed AI source review |
| Descriptive mapping and process diagnostics | Committed scripts write the field-state report, the SQ association tables, the round-one selection check and the agent-track diagnostics under the package fingerprint ([[methods#Descriptive mapping and process diagnostics]]). The SQ tables still label fields by the earlier sub-question numbering | Descriptive over declared subsets. Agreement between the agent tracks is a workflow diagnostic and no accuracy estimate |
| Answers to SQ1 to SQ4 | The [SQ1 chapter](../research-vault/40_output/literature-report/sq1-use.md) rests on grounded Assertions over active distillates and on the generated tables, and it states its coverage and not determinable cells. SQ2 to SQ4 have no answer chapter. The provisional manuscript uses the earlier reviewed Assertion slice | SQ1 grounded draft. AI Agent Review and domain-expert verification open |
| Public Evidence Companion and literature landscape | The explicit policy and current source-review ledger govern Work-level aggregation. Aliases and exact Versions remain inspectable. The result site reads released data only and is covered by `tests/browser/release.mjs`. It is not deployed | Attributed AI-source-reviewed subset. Unresolved records withheld and no human authority inferred. Interface acceptance review open ([[testing#Independent acceptance review of the result site]]) |
| Active distillates and Assertions | The [active Vault guide](research-vault.md#current-implementation-state) identifies the reviewed slice. Source passages, locators, artifact/source hashes and named AI attribution are checked | Source-reviewed active slice. Neither legacy document links nor Graph co-occurrences extend its evidence coverage |
| Historical concept graph | Frozen and unreviewed, without generator. Build flags record that its frequencies and edge weights do not recompute from its own paper concepts | No research authority. Historical artifact of the internal working application |

## The domain-expert verification path in PRISM

The route `docs/prisma.html?verify=1` opens the session in which a domain expert records the verification event that this register tracks. Its subject is the productive agent record for the current paper, resolved from the connected working folder rather than from a track the expert selects, and the assessment rail names it as the agent coding of that track. The expert keeps their own reviewer key. The recorded outcome, one of accepted, corrected and accepted, changes requested, or rejected, together with a publication approval taken afterwards, is appended to the expert's own reviewer file `docs/data/screening/<key>.json` under `verification_schema` `femprompt-prisma-verification/0.1` and the array `verifications`. The agent file is never written.

Each entry binds the paper, the agent track and the annotation it judges, the hash a deterministic validator recorded over that annotation or an explicit statement that no receipt exists, the expert and actor identifiers, the activity, the reason, and the complete lifecycle event. A correction carries the superseding annotation with its field-level differences, so the agent's original interpretation stays readable beside the expert's. When the folder is connected again, the expert file is projected onto a copy of the agent track, which is how the tool shows the achieved lifecycle state without persisting a derived record. The contract is ADR-040 in [[specification]], and the authority boundaries it preserves are those of ADR-035.

A recorded event establishes the authority of exactly the annotation it names. It extends to no derived Assertion, report section or paper claim, and a later correction of the agent record requires its own event.

## Rules for external claims

Count-bearing statements in the paper, report, and Evidence Companion must derive from committed data and an executable generator or replay. Qualitative literature statements must cite Assertions whose supporting distillates and source anchors resolve. A verified screening record does not verify a derived Assertion automatically. Each derived artifact receives its own evidence check and authority event.

The paper may describe implemented software behaviour after the applicable technical checks pass. It may describe agent annotations as `ai-agent-reviewed` when the source-grounded review exists. Final scholarly findings and manuscript approval remain author-governed. The operator separately authorised a labelled preliminary AI-source-reviewed result release. Its exact-artifact requirements and correction semantics are defined in [[governance#Publication boundary]].

A run manifest establishes completed execution only when its lifecycle is complete and its validation receipts, source bindings, and output hashes resolve. The presence of generated files or productive records alone does not raise the authority of an unfinished run manifest.

## Remaining verification work

- Review the SQ1 Assertions and the SQ1 chapter through a source-grounded AI Agent Review by an agent other than their author, then submit the Assertions used to domain-expert verification ([[plan#Answering the research questions]]).
- Re-check the SQ tables and the statements built on them after the relabelling to the current sub-questions ([[plan#Analysis tool follow-ups]]).
- Conduct the independent acceptance review of the public Evidence Companion, which recomputes every displayed cell from the data ([[plan#UI development]]).
- Resolve the source, identity, and metadata blocks recorded in `generated/round2-intake-package.json`, `generated/agent-screening-queue.json` and the [current completion queue](../generated/completion/README.md), including the works named in [[plan#Works with conflicts or holds]]. Preserve the already applied [metadata corrections](../corpus/metadata_corrections.json) and [exact source bindings](../corpus/source_version_bindings.json). A prepared source without a current binding remains unavailable for productive screening even when its bibliographic record is already in Zotero.
- Bind the prepared intake's visual source bundles after Work-Version reconciliation. Standalone image-based category evidence remains outside the text-quotation contract.
- Apply the governed coding and AI Agent Review workflow to every work that becomes source-ready, and recompute tables with their actual coverage denominators.
- Have domain experts verify the statements and fields used as findings and the derived report and paper interpretations. Each acceptance identifies its scope and evidence basis. The current whole-record workflow must not imply that target-level recording is already implemented.
- Apply the existing attributed AI-release policy to the preliminary subset, and obtain person-attributed approval for artifacts claimed as the final scholarly release.
