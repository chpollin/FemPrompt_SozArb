---
title: Plan
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: active
language: en
version: "0.7"
created: 2026-06-09
updated: 2026-10-01
authors: [Christopher Pollin]
generated-with: Codex (GPT-5.6), Codex (GPT-6), Claude Code (Claude Opus 5.5)
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
related: [project, analysis-methods, governance, verification, testing, specification, data, journal, handoff, update-protocol, research-vault]
---

# Plan

The remaining work answers the main question and its five sub-questions from a governed and verifiable corpus, then reports and publishes the answer. Completed implementation history is preserved in [[journal]] and the ADR register in [[specification]]. Generated manifests carry current quantities and per-item processing states. [[handoff]] states the current result and the continuation point.

## Current operative state

The operator made the substantive question primary on 1 October 2026. The operator merged the questions the same day. [[project#Research questions]] holds the main question, SQ1 Use, SQ2 Bias forms, SQ3 Handling of bias, SQ4 Conceptual grounding and SQ5 Competences, and the methodological question as second question of the paper. [[project#Publication context]] records the target special issue in Adult Literacy Education, its dates and the framing of SQ2, SQ3 and SQ5 for adult education. [[analysis-methods#Answering the research questions]] states for each sub-question its data, method and current limits.

An answer draft for SQ1 exists as [sq1-use.md](../research-vault/40_output/literature-report/sq1-use.md) over grounded Assertions. It finds that no Assertion reports an evaluated benefit of LLM use in a social-work setting, a statement about the active distillates and not about the literature. Several included Works with direct SQ1 content have no active distillate yet. The operator cancelled the answer drafts for the other sub-questions on 1 October 2026. They wait for the coding run and the decisions under [[#Open decisions]].

The descriptive mapping tools and the agent-track process diagnostics exist ([[methods#Descriptive mapping and process diagnostics]]). The public Evidence Companion presents the released subset along the sub-questions ([[specification#Public Evidence Companion]]) and is not deployed. The [completion package](../generated/completion/README.md) and `generated/literature-readiness.json` identify unresolved work per item. Existing bibliographic membership does not establish a checked reading source, completed annotation or scholarly verification.

## Completion criteria

The project reaches completion when the following conditions hold.

1. Every intended corpus work has a stable identity and a documented source state.
2. Every screenable work has governed agent annotations and source-grounded AI Agent Review.
3. Domain experts have verified the statements and fields used as scholarly findings, with their exact evidence basis and declared review scope. Verification of a part grants no authority to unchecked content.
4. Quantitative analysis derives from committed structured data through executable scripts.
5. Qualitative analysis derives from source-linked Assertions in the Grounded Vault. Each sub-question has an answer chapter that states its coding coverage and keeps not determinable statements apart from absence in the literature.
6. The literature report and paper have received domain-expert review of their scholarly interpretation.
7. Each public artifact meets its explicit release policy. The final scholarly manuscript additionally has a human publication-approval event. Preliminary AI-source-reviewed results retain their own attributed review basis.
8. The repository documents a reproducible setup path for a subsequent update or another review corpus.

## Answering the research questions

The sub-questions are answered in the following order. Steps that depend on an operator decision name it from [[#Open decisions]] and do not start before it is taken.

1. Codebook decision. Decide whether the [[update-protocol#Proposed codebook amendment v1.4]] precedes the coding run (decision 1). If it is adopted, record it in [[update-protocol#Amendment record]], change `assessment/categories.yaml`, regenerate its projections and recode the Works already coded under v1.3. Without the amendment, SQ1 has no task field, SQ3 cannot attribute an evidence status to a single intervention and SQ4 has no field at all.
2. Supplementary-search decision. Decide whether a dated, separately documented search for literature on LLM use in social-work tasks without a bias focus extends the corpus (decision 2). If it is adopted, it runs as its own search layer with its own denominators through the intake path of [[update-protocol]] and the source preparation under [[#Controlled corpus completion]].
3. Coding run. Once decisions 1 and 3 permit it, run the governed analysis-coding agent over the included Works with full text, followed by the separate AI Agent Review under [[update-protocol#Agent-assisted completion]]. The field-state report and `meta.analysis_coverage` then show the reached coverage ([[data#Analysis field states and coverage]]).
4. Distillates and Assertions per sub-question. Distil the included Works with direct content for a sub-question that lack an active distillate, starting with those listed in [the SQ1 chapter](../research-vault/40_output/literature-report/sq1-use.md#what-is-needed-to-complete-the-answer). Screen the Works whose distillates already support SQ1 Assertions but carry no screening decision. Write the Assertions for SQ2 to SQ5 after the coding run. Every Assertion set receives a source-grounded AI Agent Review by an agent other than its author before an answer chapter treats it as reviewed. The SQ1 Assertions are grounded and await this review. SQ5 additionally needs the external framework of decision 4.
5. Expert verification. Domain experts verify the Assertions and coded fields that the answers use, under [[#Domain-expert verification]].
6. Synthesis. The mapping layer presents evidence-and-gap maps from the relabelled SQ tables. Best-fit framework synthesis runs over reviewed Assertions, and the interpretive layer follows decision 5 ([[analysis-methods#Synthesis layer]]). Contradicting evidence and not determinable cells stay explicit.
7. Report and paper. The SQ1 chapter under `research-vault/40_output/literature-report/` sets the form of an answer. The report scaffold `00-structure.md` still follows the earlier topic order and is aligned once decision 11 fixes the division of report, paper and Companion. Authors and venue follow decision 12, and the steps under [[#Publication]] complete the manuscript.

### Analysis and Assertions

- Use the current Work-level tables for explicitly bounded descriptive analysis that states its coverage. Regenerate whole-corpus results after the intended corpus is resolved.
- Use topic modelling only if it answers a stated exploratory question. Category co-occurrence or a legacy Graph edge is not an Assertion or a required completion step.
- Exploratory topics become scholarly findings only through interpretation against the source-linked knowledge structure. The coding vocabularies remain governed by [[update-protocol]]. The analysis tiers and the validation design are defined in [[analysis-methods]].

### Analysis tool follow-ups

- Name the new completion-package blocks for field states, SQ associations, the round-one selection check and the agent-track diagnostics in the completion-package schema.
- Build the Tier 1 analyses that [[analysis-methods#Implementation state]] names as not yet implemented.
- Record PRISMA-ScR in [[standards]] as an applied reporting standard if decision 5 adds it for the mapping layer ([[standards#Open reporting decision on PRISMA-ScR]]).

## UI development

The public Evidence Companion is specified in [[specification#Public Evidence Companion]].

1. Emit German display labels for analysis fields and values from `assessment/categories.yaml` through `build_analysis_fields.py`, and let the site read them.
2. Add an explicit sub-question field to the Assertion schema and `build_assertion_index.py`, replacing the topic table in `release-fragen.js` ([[specification#Open interface questions]]). Assertions already carry the optional frontmatter field `research-questions`, which the validator does not check against a vocabulary ([[research-vault#Assertions]]). The schema field would make it checked and released.
3. Replace the long internal agent coding notes in the public work list by field-level evidence once it exists. Until then the note stays collapsed and labelled as the rationale of the coding agent, never as evidence.
4. Let the site read `analysis.field_states`, so that it shows absent fields apart from fields not yet coded instead of folding both together.
5. Fix the clipped labels of the Netz view at 390 px. Its public visibility follows decision 7.
6. Run the [[testing#Independent acceptance review of the result site]], which recomputes every displayed figure from the released data and checks display rules, keyboard operation, zoom, contrast and content fitness. Its findings are recorded in this plan. An operator review on the phone follows, and an acceptance session with the domain experts comes later.
7. Switch Pages to `build/site/` under [[#Deployment]]. Until then Pages serves `docs/` including internal working data.
8. Keep the internal working application `docs/index.html` local. Its Kategorien view still lists concepts from the historical concept graph ([[data#Historical concept graph and divergence classification]]), and the page is not part of the public site.

## Deployment

GitHub Pages serves `docs/` from `main` as a legacy build at https://chpollin.github.io/FemPrompt_SozArb/ and therefore exposes the internal working surfaces. The repository has been private since 1 October 2026, while the Pages site stays public, so links from public pages to the repository are dead for the public. The operator decided on 29 September 2026 that Pages shows only the result page and that protected full texts leave the public repository. The target is therefore the allowlisted result site from `build/site/` under [[governance#Publication boundary]].

1. Obtain the operator's approval for the deployment and for merging the branch that carries the result site into `main` (decision 3).
2. Set the Pages source of the repository to GitHub Actions.
3. Dispatch `.github/workflows/pages.yml`, which runs on `main`, builds and checks the project and uploads only `build/site/`.
4. Check the deployed state at the public address. A local build or passing local checks do not establish it.

## Provenance and verification alignment

The accepted scope permits human verification of individual fields or statements and first produces comparative literature synthesis. [[governance#Verification scope decision, 22 September 2026]] owns the authority rule, and [[research-vault#Comparative synthesis scope]] owns the analytical scope. The whole-record path exists in Bearbeiten (ADR-040, unified by ADR-042). The experts' scope is the 2026 intake and the agent-coded records, and round-one annotations stay valid without a new verification event.

1. Implement human review targets at field or statement level without promoting their parent. Bind the reviewed content and its evidence dependencies to an identified person, actual review time, declared scope and outcome. A change to relevant evidence invalidates the review even if the field value or statement text is unchanged. Unrelated field changes need not invalidate an otherwise unchanged target.
2. Project current verification coverage per target and expose it in PRISM. Preserve the existing whole-record path and historical events until compatibility has been checked. Human verification receipts remain separate from AI-review receipts and deterministic checks.
3. Define publication of mixed-authority content before simplifying the publisher. Determine which verified fields, statements and necessary context belong to the result view. Preserve historical approvals and the existing preliminary AI-reviewed policy. A target-level verification must never make unrelated contents public or verified.
4. Check the integrated behaviour with changed-source, stale-review, rejected-review and mixed-scope cases. Keep field coverage, review validity and actual scholarly correctness as separate acceptance claims.

Clarify the substantive question answered by a field-level acceptance and the public projection of mixed-authority material. Concrete interpretive disagreements go to domain-expert review with their evidence. These questions do not block source preparation, truthful inventory corrections or preparation of the comparative synthesis.

## Controlled corpus completion

The goal is complete, inspectable preparation for assessment in PRISM across the existing corpus and prepared intake. A source is ready when its live Zotero identity, exact reading version, checked Markdown representation and source-linked knowledge document resolve together in the tool. Completed scholarly coding and domain-expert verification are separate achievements under [[update-protocol#Agent-assisted completion]]. Planning this sequence does not execute external writes or grant publication approval.

### Scope and evidence

Use the existing literature-readiness inventory and completion queues as the working register. Reconcile them with a fresh Zotero observation before execution. Every intended publication retains its live keys, historical aliases, exact reading version, available artifacts and concrete unresolved issue. Bibliographic records of the same verified publication version may share a reading text and knowledge document. Preprints and published versions retain their distinct source identities. A historical exclusion does not silently remove a work from the requested preparation scope.

Missing access, an unresolved identity or a withdrawn source remains an explicit gap. Recording the reason does not establish completed preparation. Any narrowed target corpus must be an explicit scope decision. Existing source holds under [[#Works with conflicts or holds]] remain binding.

### Sequence and acceptance checks

1. Establish the baseline. Reconcile live Zotero membership, Work-Version identities, available full texts, existing Markdown, knowledge documents and PRISM links. Acceptance requires every intended record to appear once in the register, with aliases distinguished from distinct versions, and names the next missing artifact or decision per item.
2. Correct the bibliography. Compare disputed titles, author lists, identifiers and dates with publication sources, distinguishing online publication dates from issue dates, and prepare field-level corrections with old values, proposed values and source evidence. Existing-item changes require a separately scoped apply operation beyond the creation-only importer of [[governance#Authorised additive Zotero import]]. Each applied correction checks the current library version and is read back. Annotation identities are preserved and duplicate relationships recorded without silent deletion or merging. Acceptance requires agreement between the verified bibliography, live Zotero data and canonical projection for the affected item.
3. Obtain the exact reading sources. Reuse existing attachments and acquisition evidence before seeking publisher or repository copies. Record the acquired publication version separately from the preferred bibliographic version, along with its origin and content hash. Acceptance requires source identity supported by the document and publication metadata. If access or identity remains unresolved, record the concrete missing source or decision and continue with other eligible works.
4. Prepare Markdown and check conversion fidelity. Reuse valid conversions and run Docling for missing or unsuitable ones. Inspect the result against the source, including headings, reading order, tables and figures where they carry an argument. Retain source files, original conversions and attributed repairs separately. A successful converter exit alone is insufficient. Visual evidence that PRISM cannot yet represent remains a separate implementation dependency.
5. Complete source-specific knowledge documents. Recover a historical document only when its source identity can be verified. Create or revise the document from the checked full text, covering research question, method, findings, limitations and category-relevant evidence. Check literal quotations and their locations and record the producer and actual review state. A separate agent reviews the draft against the source before AI review is recorded. Technical validation never grants domain-expert verification.
6. Integrate and exercise PRISM. Rebuild the corpus and reading projections, check every intended record for the correct source, knowledge document and ten-category schema, and check representative browser cases for reading, evidence capture, saving, export and reload in an isolated trial. Unassessed categories remain unset. A record shown in the corpus or an abstract-only assessment does not establish full-text or knowledge-document completeness.
7. Reconcile the finished batch and the full corpus. Read back the affected Zotero records, rebuild the inventory and report source availability, Markdown QC, knowledge-document review and PRISM usability separately. Declare complete preparation only when every intended publication version satisfies the preceding conditions, and name remaining gaps and required inputs explicitly.

### Execution with subagents

Bounded subagent assignments receive explicit record lists, permitted write paths and source references. Source and metadata work precedes dependent knowledge preparation, and a separate reviewer checks knowledge drafts and source support. The main agent owns canonical registry and PRISM integration, verifies delegated results against real artifacts and resolves cross-file dependencies. Concurrent assignments use separate files, and no agent changes shared registries independently. After each batch, state what was actually verified, what remains blocked and the concrete source or decision needed to proceed. Push, merge and deployment retain the owner-controlled boundary.

## Remaining work

### Source and corpus readiness

- Review the conflict-marked intake records. [[governance#Authorised additive Zotero import]] governs the operator-authorised import. The additive corpus projection preserves hash-bound local metadata corrections and historical annotation keys.
- Resolve the remaining identity conflicts and unavailable, ambiguous, or rights-restricted Paper sources recorded by the queue.
- Reconcile historical residual-queue findings with the current [metadata corrections](../corpus/metadata_corrections.json), [source bindings](../corpus/source_version_bindings.json) and [completion queue](../generated/completion/README.md). Already applied local repairs must be preserved deliberately when the external Zotero library is curated and re-exported.
- Reconcile every prepared Codex source-readiness record with the curated Zotero Work and exact Version. Preserve any difference between the preferred bibliographic Version and the acquired source Version.
- Use the hash-bound original-PNG reading contract where text alone omits meaningful figures. Standalone image-based evidence annotations and unresolved visual gaps in the prepared intake remain separate work.
- Repair the source-identified formula and figure losses in *Worst of Both Worlds: Biases Compound in Pre-trained Vision-and-Language Models* and *Unveiling and Mitigating Bias in Mental Health Analysis with Large Language Models*, as specified by the [conversion-QC receipts](../generated/source-acquisition/completion-20260921/conversion-qc/oa-review/conversion-qc.json).
- Bind or convert any further Paper representation only after its work identity has passed the source audit.
- Resolve the [registered-identifier gaps](../corpus/source-acquisition/completion-20260921/existing-version-contract-gaps.json) for the located reports before binding their reading copies.
- Bind the prepared 2026 reading texts that fail the quoted-DOI rule once the binding-contract decision under [[#Open decisions]] is taken, and rebuild the registry.
- Rebuild the agent-screening queue after each source or corpus change.
- Among the 2026 works without a usable full text, only the JSSWR paper on Chinese social work standards has an open-access author preprint, recorded in `generated/source-acquisition/codex-websearch-2026/reacquisition-2026-09-22.json` and converted locally without source QC or binding. The others are publisher-restricted and stay on the manual acquisition list `fehlende-volltexte-2026.xlsx`, which the partners received.

Canonical state carriers are `corpus/work_version_registry.json`, `generated/round2-intake-package.json`, `generated/round2-zotero-import.ris`, `generated/contextual-update-2026-08-24-intake-package.json`, `corpus/deep-research/round2/Codex Websearch/codex-websearch-2026-package.json`, `corpus/deep-research/round2/Codex Websearch/bibliographic-audit.json`, `generated/source-acquisition/codex-websearch-2026/source-readiness.json`, `generated/agent-screening-queue.json`, `docs/data/knowledge_doc_bindings.json`, and the reviewed full-text manifest.

The acquisition evidence under `generated/source-acquisition/completion-20260921/` distinguishes recovered sources, failed access attempts and identity conflicts. The record `JRG3B3LE` points to an arXiv text with a different title and remains unbound. The cultural-bias review associated with `Y4BMCI2J` requires reconciliation of the locally held first arXiv revision, the unpinned bibliography and a later withdrawn revision before source admission. Independent knowledge-document reviews and their superseded findings are retained under `corpus/knowledge-reviews/`.

### Governed agent annotation

Execute newly source-ready works under [[update-protocol#Agent-assisted completion]], including operationally isolated coding, deterministic PRISM transfer and separate source-grounded AI Agent Review. Preserve exact source identities and prior records when accepting new products. Use the current completion queue to distinguish missing coding from a fresh review required by changed evidence. The analysis-coding run over the included works is step 3 of [[#Answering the research questions]].

### Domain-expert verification

- Present the 2026 intake and the agent-coded records in PRISM verification mode.
- Record accepted, corrected and accepted, changes requested, or rejected for each reviewed statement, field or explicitly scoped whole record. Use the existing whole-record path only when that entire record was checked. Field-level recording depends on [[#Provenance and verification alignment]].
- Preserve each correction as a superseding annotation with a field-level difference record.
- Verify the Assertions that support the answer chapters, the literature report and the paper.
- Verify the scholarly interpretation of the report and manuscript after their complete synthesis exists.

The accepted scope is defined in [[governance#Verification scope decision, 22 September 2026]]. New evidence requires checking the affected review dependencies while preserving previous versions.

### Publication

- Generate the final PRISMA 2020 and PRISMA-trAIce reporting artifacts from the governed records, and PRISMA-ScR artifacts if decision 5 adds that standard.
- Insert the verified quantitative and qualitative findings into the canonical manuscript.
- Check the current author instructions of Adult Literacy Education before submission, send the optional draft for editorial feedback by 1 December 2026 and submit by 15 February 2027 ([[project#Publication context]]).
- Report the AI-assisted deep-research identification without database search as a declared PRISMA 2020 deviation.
- Apply the already authorised AI-source-reviewed release policy to eligible preliminary results. Record person-attributed publication approval for the final scholarly records and manuscript when that later authority is claimed.
- Rebuild and inspect the separate result site from its policy-filtered projections.

## Technical follow-up

- Confirm the native Chromium directory-permission and physical-write path in a disposable clone.
- Exercise the setup path with a person who did not build PRISM before extracting a reusable configuration guide.
- Prepare and hand over the domain experts' GitHub Desktop clone with the built full-text layer, since `docs/data/fulltext/` is git-ignored and a plain clone shows abstracts only.

## Waiting on the project owner

These steps need an operator contribution. Additive Zotero import has its own explicit authorisation under [[governance#Authorised additive Zotero import]].

- Curation of ambiguous duplicate and Version relations in Zotero remains separate from adding missing records. Existing group records are not silently merged or rewritten, and `corpus/zotero_sync.json` records library membership and confirmed aliases.
- Deployment of the result site under [[#Deployment]].
- Acceptance session of PRISM with the domain experts. The user stories in [[specification]] were written by the technical lead as a user proxy, and the verification mode has been exercised by automated tests and agents only.
- Resolution of the works with conflicts or holds listed below.
- The decisions listed under [[#Open decisions]].

### Works with conflicts or holds

`generated/completion/work-verification-queue.csv` is the source of truth for these states. The works are identified by title and Zotero record keys because the author metadata of the affected records is itself inconsistent.

| Work | Records | State | Next step |
|---|---|---|---|
| Prompt engineering techniques for mitigating cultural bias against Arabs and Muslims in large language models: A systematic review | `5UAHQESQ`, `6MJYP7ZX`, `EHQBHVYV`, `Y4BMCI2J`, `25XSMXKT`, `GUMWKBN6` | Source integrity hold. The arXiv version was withdrawn by its author as incomplete, and the historical resolution finds no evidence for the Version of Record that the registry prefers. The historical human Include stays recorded, and the work is withheld from current synthesis and release | Exact-Version reconciliation in Zotero and an explicit integrity resolution |
| AI Gender Bias, Disparities, and Fairness: Does Training Data Matter? | `CHJQ52DC`, `CSJS9JGH` | Conflicting human decisions and a source-version hold, because the bound text is an earlier arXiv revision than the binding declares | Decision by the domain experts and a corrected source binding |
| Predicting successful placements for youth in child welfare with machine learning | `EXRF5629` | Open negative AI source review. Local metadata and source binding were repaired on 2026-09-05 | Fresh governed screening of the repaired source by agents, then domain-expert verification |

The works in the source acquisition queue lack a reviewed Paper source. Their blockers are recorded per work in the same file and in `generated/agent-screening-queue.json`.

### Open decisions

None of these decisions has been taken. The numbers are referenced from the steps above.

| No. | Decision | Required contribution |
|---|---|---|
| 1 | Codebook amendment v1.4 before the coding run, as proposed by the critical review of 1 October 2026 and described in [[update-protocol#Proposed codebook amendment v1.4]], with intervention-status pairs, a task field, a state for fields not collected under v1.3, sharper definitions for harm types and bias axes and recoding of the coded works | Operator decision on adoption and scope |
| 2 | Supplementary search for literature on LLM use in social-work tasks without a bias focus, as a dated, separately documented search layer with its own denominators, or an answer limited to the existing bias-focused corpus | Operator decision |
| 3 | Permission for the Codex coding run with elevated Windows sandbox, and push and merge of `companion-redesign` and of the laptop branch `prepare-expert-verification` | Operator authorisation |
| 4 | External framework of general prompt guidance for SQ5. The candidate is the taxonomy of Schulhoff et al. (2024), *The Prompt Report*, which the technique vocabulary appears to follow. The project's own five-step formula must not serve as the standard | Operator decision |
| 5 | Interpretive synthesis method, critical interpretive synthesis or meta-narrative review, and whether PRISMA-ScR is added as reporting frame for the mapping layer ([[analysis-methods#Synthesis layer]], [[standards#Open reporting decision on PRISMA-ScR]]) | Operator decision |
| 6 | Whether aggregate coverage counts about unreleased works may appear on the result site ([[governance#Publication boundary]]) | Governance decision by the operator |
| 7 | Whether the Netz view appears publicly before coding coverage is sufficient. The critical review advised against it | Operator decision |
| 8 | Kubes (2024), *Feministische KI – Künstliche Intelligenz für alle?*, is released as an AI Include although its consolidated human decision is Exclude, a documented round-specific divergence, and it appears in the public matrix ([[governance#Publication boundary]]) | Operator decision on its public treatment |
| 9 | Whether historical divergence classifications from the Git history are restored as a committed, attributed source ([[data#Historical concept graph and divergence classification]]) | Operator decision |
| 10 | Whether the full-text cascade switches to creator-based `author_year` keys, which would change the source binding of several records | Source-identity decision by the operator |
| 11 | Paper architecture after the priority change. The Paper-Pipeline document in the personal vault still describes the methodological workflow as the main part, and the division of literature report, paper and Companion is open | Operator decision |
| 12 | Author set and order of the result paper. The venue is the special issue recorded in [[project#Publication context]] | Decision by the co-author group |
| 13 | Whether the source-binding contract accepts acquisition receipts, meaning the publisher landing URL and PDF hash, as identity evidence for prepared 2026 reading texts whose converted Markdown lost its DOI | Operator decision on the binding contract |
| 14 | Tier 2 reference coding needs a PRISM session mode that also hides the consolidated expert decision, since ADR-044 already hides the LLM proposal and the agent coding, and a randomly drawn verification sample in addition to the assigned scope ([[analysis-methods#Tier 2, analyses after complete expert-verified coding]]) | Operator decision on tool contract and sampling |
| 15 | Final scholarly release of verified research records and outputs | Person-attributed publication approval. The preliminary AI-source-reviewed release is already authorised |
| 16 | Final submission package | Approval of manuscript, supplement, disclosures, and selected venue requirements |
