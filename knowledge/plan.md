---
title: Plan
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: active
language: en
version: "0.7"
created: 2026-06-09
updated: 2026-09-05
authors: [Christopher Pollin]
generated-with: Codex (GPT-5.6), Codex (GPT-6)
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
related: [project, governance, verification, testing, specification, data, journal, update-protocol, research-vault]
---

# Plan

The remaining work completes the literature corpus through governed agent annotation, domain-expert verification, analysis, and publication. Completed implementation history is preserved in [[journal]] and the ADR register in [[specification]]. Generated manifests carry current quantities and per-item processing states.

## Current operative state

The operator-authorised preliminary result now uses attributed AI source review under `config/publication_policy.json`. The whole existing corpus and prepared 2026 intake remain in scope. `generated/completion/README.md` and its queues are the current completion dashboard; they distinguish existing human coding, newly source-reviewed agent coding, unresolved conflicts, unbound intake and manuscript gaps. The full review and paper remain unfinished.

The deterministic build, receipt validation, immutable AI correction projection, Work-level literature aggregation, Assertion-based chat, consistent downloads, and separate allowlisted result site are implemented. `npm run build` constructs `build/site/`; `npm run check` verifies it. The new site has not been deployed by the local build. `corpus/deep-research/round2/targeted-followup-2026-09-05.md` records the separately dated, deduplicated gap-filling search; its candidates are identified, not included results.

PRISM implements evidence-grounded screening, complete Include coding, deterministic storage, lifecycle provenance, domain-expert verification, and a fail-closed publication gate. The Codex-native workflow produces operationally isolated coding packets, projects them through PRISM's production functions, and submits them to a separate source-grounded AI Agent Review. Completed runs are recorded individually; the [current completion package](../generated/completion/README.md) identifies what still needs source binding, fresh screening or resolution. A recovered full text or repaired identity can make new screening necessary even where an older record exists. Source readiness does not establish completed annotation or review.

The canonical Grounded Vault chain contains the bounded active slice documented in [[research-vault#Aktueller Implementierungsstand]]. The larger historical knowledge archive has not been collectively migrated or source-reviewed into this chain. The paper has one canonical manuscript under `research-vault/40_output/paper/paper.md`. Its current synthesis uses the reviewed subset; the complete qualitative synthesis remains open.

The Work-Version registry is installed and projected into the corpus, the full-text manifest, PRISM, the agent-screening queue, the Grounded Vault source layer, and the public Literature Landscape contract. The generated screening queue is the per-work authority for residual source blocks. The consolidated round-two intake package contains the three agent reviews and an RIS file restricted to conflict-free imports. The separate `Codex Websearch` package contains the complete selected 2026 subset from three deeper search lanes, source enrichment, one deduplicated RIS, rights-gated acquisition, Docling conversion, direct agent source QC, and a fail-closed source-readiness ledger. Its prepared records remain identified and unscreened until Zotero curation and re-export provide canonical Work-Version bindings.

## Completion criteria

The project reaches completion when the following conditions hold.

1. Every intended corpus work has a stable identity and a documented source state.
2. Every screenable work has governed agent annotations and source-grounded AI Agent Review.
3. Domain experts have verified or corrected every record intended for the research synthesis.
4. Quantitative analysis derives from committed structured data through executable scripts.
5. Qualitative analysis derives from source-linked Assertions in the Grounded Vault.
6. The literature report and paper have received domain-expert review of their scholarly interpretation.
7. Each public artifact meets its explicit release policy; the final scholarly manuscript additionally has a human publication-approval event. Preliminary AI-source-reviewed results retain their own attributed review basis.
8. The repository documents a reproducible setup path for a subsequent update or another review corpus.

## Remaining work

### Source and corpus readiness

- Review the conflict-marked intake records, import the conflict-free RIS package into Zotero, and export the curated library.
- Import and curate `Codex Websearch/codex-websearch-2026-zotero-import.ris` in the confirmed `FemPrompt_SozArb` group library. Use it as the sole import source for its 2026 subset and reconcile older pending RIS files before importing their residual records.
- Resolve the remaining identity conflicts and unavailable, ambiguous, or rights-restricted Paper sources recorded by the queue.
- Reconcile historical residual-queue findings with the current [metadata corrections](../corpus/metadata_corrections.json), [source bindings](../corpus/source_version_bindings.json) and [completion queue](../generated/completion/README.md). Already applied local repairs must be preserved deliberately when the external Zotero library is curated and re-exported.
- Reconcile every prepared Codex source-readiness record with the curated Zotero Work and exact Version. Preserve any difference between the preferred bibliographic Version and the acquired source Version.
- Use the hash-bound original-PNG reading contract where text alone omits meaningful figures; every assigned reviewer must inspect the declared assets. Standalone image-based evidence annotations and unresolved visual gaps in the prepared intake remain separate work.
- Bind or convert any further Paper representation only after its work identity has passed the source audit.
- Rebuild the agent-screening queue after each source or corpus change.

Canonical state carriers are `corpus/work_version_registry.json`, `generated/round2-intake-package.json`, `generated/round2-zotero-import.ris`, `generated/contextual-update-2026-08-24-intake-package.json`, `corpus/deep-research/round2/Codex Websearch/codex-websearch-2026-package.json`, `corpus/deep-research/round2/Codex Websearch/bibliographic-audit.json`, `generated/source-acquisition/codex-websearch-2026/source-readiness.json`, `generated/agent-screening-queue.json`, `docs/data/knowledge_doc_bindings.json`, and the reviewed full-text manifest.

### Governed agent annotation

- Execute every newly source-ready work in a manifest-bound batch.
- Produce two operationally isolated coding packets for each assignment.
- Project both packets deterministically through PRISM's production contract.
- Conduct a separate source-grounded AI Agent Review.
- Merge accepted products append-only into the productive agent track.
- Preserve prompts, models, source hashes, reports, generated tracks, and lifecycle events for every run.

The active contract is [[update-protocol#Agent-assisted completion]]. The authority model is defined in [[governance]].

### Analysis and Assertions

- Use the current Work-level landscape and completion tables for explicitly bounded descriptive analysis; regenerate whole-corpus results after the intended corpus is resolved.
- Analyse category distributions, co-occurrences, evidence types, populations, practice fields, and gaps.
- Use topic modelling only if it answers a stated exploratory question; category co-occurrence or a legacy Graph edge is not an Assertion or a required completion step.
- Convert source-linked findings into atomic Assertions.
- Build the literature report and the paper synthesis over the shared Assertion layer.

Exploratory topics become scholarly findings only through interpretation against the source-linked knowledge structure. The coding vocabularies and research sub-questions remain governed by [[update-protocol]].

### Domain-expert verification

- Present the completed prepared corpus in PRISM verification mode.
- Record accepted, corrected and accepted, changes requested, or rejected for every intended record.
- Preserve each correction as a superseding annotation with a field-level difference record.
- Verify the Assertions that support the literature report and the paper.
- Verify the scholarly interpretation of the report and manuscript after their complete synthesis exists.

Domain-expert verification occurs after agent preparation of the intended corpus. New evidence can be incorporated later by rerunning the affected steps and preserving the previous versions.

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
- Consider modularising `docs/js/prisma.js` after the complete-corpus workflow is stable. The present monolith remains covered by the test system, and restructuring it during corpus production would add regression risk.

## Open operator decisions

| Decision | Required contribution |
|---|---|
| Author set and order for the result paper | Decision by the co-author group |
| Final scholarly release of verified research records and outputs | Person-attributed publication approval; the preliminary AI-source-reviewed release is already authorised |
| Final submission package | Approval of manuscript, supplement, disclosures, and selected venue requirements |
