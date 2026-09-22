---
title: Plan
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: active
language: en
version: "0.7"
created: 2026-06-09
updated: 2026-09-22
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

The remaining scope includes the existing corpus, prepared 2026 intake and separately dated gap-filling candidates. The [completion package](../generated/completion/README.md) and `generated/literature-readiness.json` identify unresolved work per item. Existing bibliographic membership does not establish a checked reading source, completed annotation or scholarly verification.

[[handoff]] records the implemented baseline and current branch. [[verification]] records available evidence and authority. The complete literature synthesis and canonical manuscript remain unfinished. Continue from valid existing preparation, preserving historical research records and the active source holds below.

## Completion criteria

The project reaches completion when the following conditions hold.

1. Every intended corpus work has a stable identity and a documented source state.
2. Every screenable work has governed agent annotations and source-grounded AI Agent Review.
3. Domain experts have verified the statements and fields used as scholarly findings, with their exact evidence basis and declared review scope. Verification of a part grants no authority to unchecked content.
4. Quantitative analysis derives from committed structured data through executable scripts.
5. Qualitative analysis derives from source-linked Assertions in the Grounded Vault.
6. The literature report and paper have received domain-expert review of their scholarly interpretation.
7. Each public artifact meets its explicit release policy; the final scholarly manuscript additionally has a human publication-approval event. Preliminary AI-source-reviewed results retain their own attributed review basis.
8. The repository documents a reproducible setup path for a subsequent update or another review corpus.

## Provenance and verification alignment

The accepted scope permits human verification of individual fields or statements and first produces comparative literature synthesis. [[governance#Verification scope decision, 22 September 2026]] owns the authority rule, and [[research-vault#Comparative synthesis scope]] owns the analytical scope.

1. Implement human review targets at field or statement level without promoting their parent. Bind the reviewed content and its evidence dependencies to an identified person, actual review time, declared scope and outcome. A change to relevant evidence invalidates the review even if the field value or statement text is unchanged. Unrelated field changes need not invalidate an otherwise unchanged target.
2. Project current verification coverage per target and expose it in PRISM. Preserve the existing whole-record path and historical events until compatibility has been checked. Human verification receipts remain separate from AI-review receipts and deterministic checks.
3. Define publication of mixed-authority content before simplifying the publisher. Determine which verified fields, statements and necessary context belong to the result view. Preserve historical approvals and the existing preliminary AI-reviewed policy. A target-level verification must never make unrelated contents public or verified.
4. Check the integrated behaviour with changed-source, stale-review, rejected-review and mixed-scope cases. Keep field coverage, review validity and actual scholarly correctness as separate acceptance claims.
5. Make the verification path reachable for a domain expert under their own reviewer key. The browser test of 22 September 2026 showed that the verification panel and form appear only while the agent track (`ar2`) is the selected reviewer, that the recorded verification is written into the agent file rather than the expert's own file, that the provenance block renders source and derivation objects as `[object Object]` and prompt and model as raw JSON, and that an agent record is headed `Deine Bewertung` without marking its actor. These four defects block the first verification session and precede field-level verification.
6. Superseded on 22 September 2026: the round-one expert annotations are valid corpus decisions and need no new verification event. The experts' scope is the 2026 intake and the agent-coded records.

Clarify the substantive question answered by a field-level acceptance and the public projection of mixed-authority material. Comparative analysis proceeds with explicit source limitations and contradictory findings. Concrete interpretive disagreements go to domain-expert review with their evidence. These questions do not block source preparation, truthful inventory corrections or preparation of the comparative synthesis.

## Controlled corpus completion

The immediate goal is complete, inspectable preparation for assessment in PRISM across the existing corpus and prepared intake. A source is ready when its live Zotero identity, exact reading version, checked Markdown representation and source-linked knowledge document resolve together in the tool. Completed scholarly coding and domain-expert verification are separate achievements under [[update-protocol#Agent-assisted completion]]. Planning this sequence does not execute external writes or grant publication approval.

### Scope and evidence

Use the existing literature-readiness inventory and completion queues as the working register. Reconcile them with a fresh Zotero observation before execution. Every intended publication retains its live keys, historical aliases, exact reading version, available artifacts and concrete unresolved issue. Bibliographic records of the same verified publication version may share a reading text and knowledge document. Preprints and published versions retain their distinct source identities. A historical exclusion does not silently remove a work from the requested preparation scope.

Missing access, an unresolved identity or a withdrawn source remains an explicit gap. Recording the reason does not establish completed preparation. Any narrowed target corpus must be an explicit scope decision. Existing source holds under [[#Works with conflicts or holds]] remain binding.

### Sequence and acceptance checks

1. Establish the baseline. Reconcile live Zotero membership, Work-Version identities, available full texts, existing Markdown, knowledge documents and PRISM links. Acceptance requires every intended record to appear once in the register, with aliases distinguished from distinct versions. Preserve the dated baseline and identify the next missing artifact or decision per item.

2. Correct the bibliography. Compare disputed titles, author lists, identifiers and dates with publication sources. Distinguish online publication dates from issue dates. Prepare field-level corrections with old values, proposed values and source evidence, beginning with the documented conflicts under [[#Source and corpus readiness]]. Existing-item changes require a separately scoped apply operation beyond the creation-only importer described under [[governance#Authorised additive Zotero import]]. Each applied correction must check the current library version and be read back. Preserve annotation identities and record duplicate relationships without silently deleting or merging records. Acceptance requires agreement between the verified bibliography, live Zotero data and canonical projection for the affected item.

3. Obtain the exact reading sources. Reuse existing attachments and acquisition evidence before seeking publisher or repository copies. Record the acquired publication version separately from the preferred bibliographic version, along with its origin and content hash. Acceptance requires source identity supported by the document and publication metadata. If access or identity remains unresolved, record the concrete missing source or decision and continue with other eligible works.

4. Prepare Markdown and check conversion fidelity. Reuse valid conversions and run Docling for missing or unsuitable ones. Inspect the resulting text against the source, including headings, reading order, tables and figures where they carry an argument. Retain source files, original conversions and attributed repairs separately. Acceptance requires a readable representation with exact source provenance and no unresolved conversion loss that would affect assessment. A successful converter exit alone is insufficient. Visual evidence that PRISM cannot yet represent remains a separate implementation dependency.

5. Complete source-specific knowledge documents. Recover a historical document only when its source identity can be verified. Create or revise the document from the checked full text, covering the research question, method, findings, limitations and category-relevant evidence. Check literal quotations and their locations. Record the producer and actual review state. A separate agent reviews the draft against the source before recording AI review. Acceptance requires a valid document linked to the exact reading version and an explicit review result. Technical validation never grants domain-expert verification.

6. Integrate and exercise PRISM. Rebuild the corpus and reading projections. Check every intended record for the correct source, knowledge document and ten-category schema. Unassessed categories remain unset. Check representative browser cases for reading, evidence capture, assessment, saving, export and reload in an isolated trial. Acceptance requires the complete per-record integrity check and the applicable browser and automated tests. A record shown in the corpus or an abstract-only assessment does not establish full-text or knowledge-document completeness.

7. Reconcile the finished batch and the full corpus. Read back the affected Zotero records and rebuild the inventory. Compare expected records, version relationships and artifacts with the baseline. Report source availability, Markdown QC, knowledge-document review and PRISM usability separately. Declare complete preparation only when every intended publication version satisfies the preceding conditions. Remaining gaps and required inputs must be named explicitly. Scholarly assessment and publication follow their own existing contracts.

### Execution with subagents

Use the requested gpt-5.6-sol subagents for bounded assignments. Source and metadata work precedes dependent knowledge preparation. A separate reviewer checks knowledge drafts and source support. The main agent owns canonical registry and PRISM integration, verifies delegated results against real artifacts and resolves cross-file dependencies. Agents receive explicit record lists, permitted write paths and source references. Concurrent assignments use separate files, and no agent changes shared registries independently. If the requested model is unavailable, report the capacity limit and defer that assignment or perform explicitly attributed main-agent work without silently switching the delegated model.

Select the next bounded batch from unresolved entries in the current inventory. Preserve completed bibliographic repairs and valid source or knowledge reviews. Check the affected Zotero, source, Markdown, knowledge-document and PRISM links before extending the procedure to other works. After each batch, state what was actually verified, what remains blocked and the concrete source or decision needed to proceed. Preserve valid earlier work and immutable historical annotations. Push, merge and deployment retain the existing owner-controlled boundary.

## Remaining work

### Source and corpus readiness

- Review the conflict-marked intake records. [[governance#Authorised additive Zotero import]] governs the operator-authorised import. The additive corpus projection preserves hash-bound local metadata corrections and historical annotation keys.
- Resolve the remaining identity conflicts and unavailable, ambiguous, or rights-restricted Paper sources recorded by the queue.
- Reconcile historical residual-queue findings with the current [metadata corrections](../corpus/metadata_corrections.json), [source bindings](../corpus/source_version_bindings.json) and [completion queue](../generated/completion/README.md). Already applied local repairs must be preserved deliberately when the external Zotero library is curated and re-exported.
- Reconcile every prepared Codex source-readiness record with the curated Zotero Work and exact Version. Preserve any difference between the preferred bibliographic Version and the acquired source Version.
- Use the hash-bound original-PNG reading contract where text alone omits meaningful figures; every assigned reviewer must inspect the declared assets. Standalone image-based evidence annotations and unresolved visual gaps in the prepared intake remain separate work.
- Bind or convert any further Paper representation only after its work identity has passed the source audit.
- Repair the source-identified formula and figure losses in *Worst of Both Worlds: Biases Compound in Pre-trained Vision-and-Language Models* and *Unveiling and Mitigating Bias in Mental Health Analysis with Large Language Models*. The [conversion-QC receipts](../generated/source-acquisition/completion-20260921/conversion-qc/oa-review/conversion-qc.json) specify the affected figures and formulas. Their reviewed knowledge documents cover the supported prose, while complete source preparation remains open.
- Resolve the [registered-identifier gaps](../corpus/source-acquisition/completion-20260921/existing-version-contract-gaps.json) for the located reports before binding their reading copies. These are source-identity and implementation gaps, and do not establish that library access is required.
- Rebuild the agent-screening queue after each source or corpus change.

Canonical state carriers are `corpus/work_version_registry.json`, `generated/round2-intake-package.json`, `generated/round2-zotero-import.ris`, `generated/contextual-update-2026-08-24-intake-package.json`, `corpus/deep-research/round2/Codex Websearch/codex-websearch-2026-package.json`, `corpus/deep-research/round2/Codex Websearch/bibliographic-audit.json`, `generated/source-acquisition/codex-websearch-2026/source-readiness.json`, `generated/agent-screening-queue.json`, `docs/data/knowledge_doc_bindings.json`, and the reviewed full-text manifest.

The acquisition evidence under `generated/source-acquisition/completion-20260921/` distinguishes recovered sources, failed access attempts and identity conflicts. The record `JRG3B3LE` points to an arXiv text with a different title and remains unbound. The cultural-bias review associated with `Y4BMCI2J` requires reconciliation of the locally held first arXiv revision, the unpinned bibliography and a later withdrawn revision before source admission. The resolver also withholds historical files assigned to another registered work or publication version. These findings remain gaps in preparation.

Independent knowledge-document reviews and their superseded findings are retained under `corpus/knowledge-reviews/`. Accepted preparation documents reference the exact review receipt, source identity and reviewed body. `generated/literature-readiness.json` distinguishes governed source bindings from legacy candidates, which still need identity review. Full-text availability alone establishes neither conversion fidelity nor completed knowledge preparation.

### Governed agent annotation

Execute newly source-ready works under [[update-protocol#Agent-assisted completion]], including operationally isolated coding, deterministic PRISM transfer and separate source-grounded AI Agent Review. Preserve exact source identities and prior records when accepting new products. Use the current completion queue to distinguish missing coding from a fresh review required by changed evidence.

### Analysis and Assertions

- Use the current Work-level landscape and completion tables for explicitly bounded descriptive analysis; regenerate whole-corpus results after the intended corpus is resolved.
- Analyse category distributions, co-occurrences, evidence types, populations, practice fields, and gaps.
- Use topic modelling only if it answers a stated exploratory question; category co-occurrence or a legacy Graph edge is not an Assertion or a required completion step.
- Convert source-linked findings into atomic Assertions.
- Build the literature report and the paper synthesis over the shared Assertion layer.

Exploratory topics become scholarly findings only through interpretation against the source-linked knowledge structure. The coding vocabularies and research sub-questions remain governed by [[update-protocol]].

### Domain-expert verification

- Present the 2026 intake and the agent-coded records in PRISM verification mode; round-one annotations stay valid without a new verification event.
- Record accepted, corrected and accepted, changes requested, or rejected for each reviewed statement, field or explicitly scoped whole record. Use the existing whole-record path only when that entire record was checked. Field-level recording depends on [[#Provenance and verification alignment]].
- Preserve each correction as a superseding annotation with a field-level difference record.
- Verify the Assertions that support the literature report and the paper.
- Verify the scholarly interpretation of the report and manuscript after their complete synthesis exists.

Agent preparation supplies the evidence for domain-expert verification. The accepted scope is defined in [[governance#Verification scope decision, 22 September 2026]]. New evidence requires checking the affected review dependencies while preserving previous versions.

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
- Prepare and hand over the domain experts' GitHub Desktop clone with the built full-text layer, since `docs/data/fulltext/` is git-ignored and a plain clone shows abstracts only.
- Decide whether the source-binding contract accepts acquisition receipts (publisher landing URL and PDF hash) as identity evidence. Eleven prepared 2026 reading texts fail the current quoted-DOI rule because the conversion dropped the running headers.

## Waiting on the project owner

These steps still need an operator contribution. Additive Zotero import has its own explicit authorisation under [[governance#Authorised additive Zotero import]].

- Curation of ambiguous duplicate and Version relations in Zotero remains separate from adding missing records. Existing group records are not silently merged or rewritten. The canonical corpus retains historical records alongside live additions. `corpus/zotero_sync.json` records their library membership and confirmed aliases, while the metadata corrections and source holds remain in force.
- Deployment of the result site. `.github/workflows/pages.yml` runs only on manual dispatch from `main`, builds and checks the project, and uploads `build/site/`. The repository's Pages source must be set to GitHub Actions beforehand. A local build does not establish the deployed state, which must be checked when deployment is commissioned.
- Acceptance session of PRISM with the domain experts. The user stories in [[specification]] were written by the technical lead as a user proxy, and the verification mode has been exercised by automated tests and agents only. The repository records no session in which the domain experts worked through prepared records in the tool.
- Resolution of the works with conflicts or holds listed below.

### Works with conflicts or holds

`generated/completion/work-verification-queue.csv` is the source of truth for these states. The works are identified by title and Zotero record keys because the author metadata of the affected records is itself inconsistent.

| Work | Records | State | Next step |
|---|---|---|---|
| Prompt engineering techniques for mitigating cultural bias against Arabs and Muslims in large language models: A systematic review | `5UAHQESQ`, `6MJYP7ZX`, `EHQBHVYV`, `Y4BMCI2J`, `25XSMXKT`, `GUMWKBN6` | Source integrity hold. The arXiv version was withdrawn by its author as incomplete, and the historical resolution finds no evidence for the Version of Record that the registry prefers. The historical human Include stays recorded, and the work is withheld from current synthesis and release | Exact-Version reconciliation in Zotero and an explicit integrity resolution |
| AI Gender Bias, Disparities, and Fairness: Does Training Data Matter? | `CHJQ52DC`, `CSJS9JGH` | Conflicting human decisions and a source-version hold, because the bound text is an earlier arXiv revision than the binding declares | Decision by the domain experts and a corrected source binding |
| Predicting successful placements for youth in child welfare with machine learning | `EXRF5629` | Open negative AI source review. Local metadata and source binding were repaired on 2026-09-05 | Fresh governed screening of the repaired source by agents, then domain-expert verification |

The works in the source acquisition queue lack a reviewed Paper source. Their blockers are recorded per work in the same file and in `generated/agent-screening-queue.json`.

### Open decisions

| Decision | Required contribution |
|---|---|
| Author set and order for the result paper | Decision by the co-author group |
| Final scholarly release of verified research records and outputs | Person-attributed publication approval; the preliminary AI-source-reviewed release is already authorised |
| Final submission package | Approval of manuscript, supplement, disclosures, and selected venue requirements |
