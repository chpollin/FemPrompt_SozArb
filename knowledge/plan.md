---
title: Plan
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: active
language: en
version: "0.7"
created: 2026-06-09
updated: 2026-08-26
authors: [Christopher Pollin]
generated-with: Codex (GPT-5.6)
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
related: [project, governance, verification, testing, specification, data, journal, update-protocol, research-vault]
---

# Plan

The remaining work completes the literature corpus through governed agent annotation, domain-expert verification, analysis, and publication. Completed implementation history is preserved in [[journal]] and the ADR register in [[specification]]. Generated manifests carry current quantities and per-item processing states.

## Current operative state

PRISM implements evidence-grounded screening, complete Include coding, deterministic storage, lifecycle provenance, domain-expert verification, and a fail-closed publication gate. The Codex-native workflow produces operationally isolated coding packets, projects them through PRISM's production functions, and submits them to a separate source-grounded AI Agent Review. All source-ready Works in the canonical queue, including the residual Work `8NG4ZEWE`, have passed this workflow. The resulting records remain below domain-expert verification and publication approval.

The canonical Grounded Vault chain is installed, and its first vertical slice connects publication distillates, Assertions, and an initial literature-report chapter. The paper has one canonical manuscript under `research-vault/40_output/paper/paper.md`. Its qualitative synthesis remains open until the intended corpus and the relevant Assertions have been completed and verified.

The Work-Version registry is installed and projected into the corpus, the full-text manifest, PRISM, the agent-screening queue, the Grounded Vault source layer, and the public Literature Landscape contract. The generated screening queue is the per-work authority for residual source blocks. The consolidated round-two intake package contains the three agent reviews and an RIS file restricted to conflict-free imports. The separate `Codex Websearch` package contains the complete selected 2026 subset from three deeper search lanes, source enrichment, one deduplicated RIS, rights-gated acquisition, Docling conversion, direct agent source QC, and a fail-closed source-readiness ledger. Its prepared records remain identified and unscreened until Zotero curation and re-export provide canonical Work-Version bindings.

## Completion criteria

The project reaches completion when the following conditions hold.

1. Every intended corpus work has a stable identity and a documented source state.
2. Every screenable work has governed agent annotations and source-grounded AI Agent Review.
3. Domain experts have verified or corrected every record intended for the research synthesis.
4. Quantitative analysis derives from committed structured data through executable scripts.
5. Qualitative analysis derives from source-linked Assertions in the Grounded Vault.
6. The literature report and paper have received domain-expert review of their scholarly interpretation.
7. Every public projection has an explicit publication-approval event.
8. The repository documents a reproducible setup path for a subsequent update or another review corpus.

## Remaining work

### Source and corpus readiness

- Review the conflict-marked intake records, import the conflict-free RIS package into Zotero, and export the curated library.
- Import and curate `Codex Websearch/codex-websearch-2026-zotero-import.ris` in the confirmed `FemPrompt_SozArb` group library. Use it as the sole import source for its 2026 subset and reconcile older pending RIS files before importing their residual records.
- Resolve the remaining identity conflicts and unavailable, ambiguous, or rights-restricted Paper sources recorded by the queue.
- Use `generated/source-acquisition/residual-queue-9-20260826/resolution-ledger.json` for the record-level corrections and access blocks of the residual queue. Apply bibliographic corrections through Zotero curation and re-export.
- Reconcile every prepared Codex source-readiness record with the curated Zotero Work and exact Version. Preserve any difference between the preferred bibliographic Version and the acquired source Version.
- Resolve the visual-evidence representation gap before using image-dependent findings in PRISM annotations.
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

- Generate the quantitative literature landscape from the completed internal corpus.
- Analyse category distributions, co-occurrences, evidence types, populations, practice fields, and gaps.
- Use topic modelling as an exploratory layer over full text, distillates, annotations, keywords, and Vault relations.
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
- Record publication approval for the records, Assertions, report chapters, and paper version released publicly.
- Rebuild and inspect the Evidence Companion from the approved projection.

## Technical follow-up

- Confirm the native Chromium directory-permission and physical-write path in a disposable clone.
- Exercise the setup path with a person who did not build PRISM before extracting a reusable configuration guide.
- Consider modularising `docs/js/prisma.js` after the complete-corpus workflow is stable. The present monolith remains covered by the test system, and restructuring it during corpus production would add regression risk.

## Open operator decisions

| Decision | Required contribution |
|---|---|
| Author set and order for the result paper | Decision by the co-author group |
| Release of verified research records and outputs | Publication approval by an authorised person |
| Final submission package | Approval of manuscript, supplement, disclosures, and selected venue requirements |
