---
title: Plan
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: active
language: en
version: "0.7"
created: 2026-06-09
updated: 2026-10-02
authors: [Christopher Pollin]
generated-with: Codex (GPT-5.6), Codex (GPT-6), Claude Code (Claude Opus 5.5)
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
related: [project, analysis-methods, governance, verification, testing, specification, data, journal, handoff, update-protocol, codebook-v1.4-proposal, research-vault, standards]
---

# Plan

The remaining work answers the main question and its five sub-questions from a governed and verifiable corpus, then reports and publishes the answer. Completed implementation history is preserved in [[journal]] and the ADR register in [[specification]]. Generated manifests carry current quantities and per-item processing states. [[handoff]] states the current result and the continuation point, and [[#Open decisions]] lists every decision that still waits for the operator.

## Current operative state

[[project#Research questions]] holds the main question, SQ1 Use, SQ2 Bias forms, SQ3 Handling of bias, SQ4 Conceptual grounding and SQ5 Competences, and the methodological question as second question of the paper. [[project#Publication context]] records the target special issue in Adult Literacy Education, its dates and the framing of SQ2, SQ3 and SQ5 for adult education. [[analysis-methods#Answering the research questions]] states for each sub-question its data, method and current limits.

The division of labour is fixed. Human reviewers screen the open papers in PRISM with the ten categories and without AI pre-assessment (ADR-044), split between the two reviewers by `docs/data/screening/assignment.json` (ADR-043). Decisions of the consolidated expert assessment are prefilled and count as done. The analysis fields are coded by AI agents in operationally isolated runs with a separate AI Agent Review ([[update-protocol#Agent-assisted completion]]). PRISM has no human analysis step (decision 20, ADR-045).

Answer drafts for all five sub-questions exist under `research-vault/40_output/literature-report/` since 2 October 2026 ([[research-vault#Current implementation state]]). They map the AI-agent-reviewed coding and name for each sub-question what stays undetermined, chiefly the works with a human and agent decision divergence, which are concentrated among the AI-literacy works that SQ5 depends on, the works coded under 1.3, the uncoded works without full text and the duplicate Works that inflate counts.

The descriptive mapping tools, the agent-track process diagnostics and the PRISMA flow per identification source exist ([[methods#Descriptive mapping and process diagnostics]], [[standards#Identification and selection reporting]]). The public Evidence Companion presents the released subset along the sub-questions ([[specification#Public Evidence Companion]]) and is not deployed. The [completion package](../generated/completion/README.md) and `generated/literature-readiness.json` identify unresolved work per item. Existing bibliographic membership does not establish a checked reading source, completed annotation or scholarly verification.

## Completion criteria

The project reaches completion when the following conditions hold.

1. Every intended corpus work has a stable identity and a documented source state.
2. Every screenable work has a human screening decision, and every included work has governed agent coding of its analysis fields with source-grounded AI Agent Review.
3. Domain experts have verified the statements and fields used as scholarly findings, with their exact evidence basis and declared review scope. Verification of a part grants no authority to unchecked content.
4. Quantitative analysis derives from committed structured data through executable scripts.
5. Qualitative analysis derives from source-linked Assertions in the Grounded Vault. Each sub-question has an answer chapter that states its coding coverage and keeps not determinable statements apart from absence in the literature.
6. The literature report and paper have received domain-expert review of their scholarly interpretation.
7. Each public artifact meets its explicit release policy. The final scholarly manuscript additionally has a human publication-approval event. Preliminary AI-source-reviewed results retain their own attributed review basis.
8. The repository documents a reproducible setup path for a subsequent update or another review corpus.

## Answering the research questions

The sub-questions are answered in the following order. Steps that depend on an open decision name it from [[#Open decisions]].

1. Codebook decision. Taken on 1 October 2026. Codebook 1.4 is in force, with the SQ4 fields, the pilot field `AN_Task`, the sharpened rules for bias axes and harm types and the deferred stage-status pairs ([[update-protocol#Analysis coding]], [[codebook-v1.4-proposal]]). The Works coded under v1.3 are recoded in the coding run.
2. Supplementary-search decision. Decide whether a dated, separately documented search for literature on LLM use in social-work tasks without a bias focus extends the corpus (decision 7). If it is adopted, it runs as its own search layer with its own denominators through the intake path of [[update-protocol]] and the source preparation under [[#Controlled corpus completion]].
3. Coding run. Carried out on 2 October 2026 for the included Works with full text that had no 1.4 coding ([[update-protocol#Coding run of 2 October 2026]]). Open are the recode of the Works coded under 1.3, which needs a packet and merge contract for a partial recode, the human spot check of the drawn samples, the domain-expert decision on the human and agent decision divergences, and the rule revision for the recurring boundary questions. The field-state report and `meta.analysis_coverage` show the reached coverage ([[data#Analysis field states and coverage]]).
4. Distillates and Assertions per sub-question. Distil the included Works with direct content for a sub-question that lack an active distillate, starting with those listed in [the SQ1 chapter](../research-vault/40_output/literature-report/sq1-use.md#what-is-needed-to-complete-the-answer). Screen the Works whose distillates already support SQ1 Assertions but carry no screening decision. Write the Assertions for SQ2 to SQ5 after the coding run. Every Assertion set receives a source-grounded AI Agent Review by an agent other than its author before an answer chapter treats it as reviewed. The SQ1 Assertions are grounded and await this review. SQ5 additionally needs the external framework of decision 4.
5. Expert verification. Domain experts verify the Assertions and coded fields that the answers use, under [[#Domain-expert verification]].
6. Synthesis. The mapping layer presents evidence-and-gap maps from the SQ tables. Best-fit framework synthesis runs over reviewed Assertions, and the interpretive layer follows decision 8 ([[analysis-methods#Synthesis layer]]). Contradicting evidence and not determinable cells stay explicit. A supplementary search (decision 7) would extend the corpus as its own search layer with its own denominators.
7. Report and paper. The SQ1 chapter under `research-vault/40_output/literature-report/` sets the form of an answer. The report scaffold `00-structure.md` still follows the earlier topic order and is aligned once decision 6 fixes the division of report, paper and Companion. The steps under [[#Publication]] complete the manuscript.

### Analysis and Assertions

- Use the current Work-level tables for explicitly bounded descriptive analysis that states its coverage. Regenerate whole-corpus results after the intended corpus is resolved.
- Use topic modelling only if it answers a stated exploratory question. Category co-occurrence or a legacy Graph edge is not an Assertion or a required completion step.
- Exploratory topics become scholarly findings only through interpretation against the source-linked knowledge structure. The coding vocabularies remain governed by [[update-protocol]]. The analysis tiers and the validation design are defined in [[analysis-methods]].

### Analysis tool follow-ups

- Name the new completion-package blocks for field states, SQ associations, the round-one selection check and the agent-track diagnostics in the completion-package schema.
- Build the Tier 1 analyses that [[analysis-methods#Implementation state]] names as not yet implemented.
- Fill the open fields of the round-two run record listed in [[standards#Identification and selection reporting]].
- Give the coding packet and merge a contract for a partial recode with `supersedes`, so that the Works coded under 1.3 receive `AN_Task`, the SQ4 fields and the sharpened bias-axis and harm-type rules without a full recoding of their unchanged fields.
- Record a reviewer prompt 1.5 whose report schema separates the distribution line by commas instead of middle dots, which the tracks of the 2 October run handled inconsistently.

## UI development

The public Evidence Companion is specified in [[specification#Public Evidence Companion]].

1. Emit German display labels for analysis fields and values from `assessment/categories.yaml` through `build_analysis_fields.py`, and let the site read them.
2. Add an explicit sub-question field to the Assertion schema and `build_assertion_index.py`, replacing the topic table in `release-fragen.js` ([[specification#Open interface questions]]). Assertions already carry the frontmatter field `research-questions`, which the validator checks against SQ1 to SQ5 ([[research-vault#Assertions]]). The schema field would carry it into the released index.
3. Replace the long internal agent coding notes in the public work list by field-level evidence once it exists. Until then the note stays collapsed and labelled as the rationale of the coding agent, never as evidence.
4. Let the site read `analysis.field_states`, so that it shows absent fields apart from fields not yet coded instead of folding both together.
5. Fix the clipped labels of the Netz view at 390 px. Its public visibility follows decision 12.
6. Run the [[testing#Independent acceptance review of the result site]], which recomputes every displayed figure from the released data and checks display rules, keyboard operation, zoom, contrast and content fitness. Its findings are recorded in this plan. An operator review on the phone follows, and an acceptance session with the domain experts comes later.
7. Switch Pages to `build/site/` under [[#Deployment]] once decision 3 is taken. Until then Pages serves `docs/` including internal working data.
8. Keep the internal working application `docs/index.html` local. Its Kategorien view still lists concepts from the historical concept graph ([[data#Historical concept graph and divergence classification]]).

## Deployment

GitHub Pages serves `docs/` from `main` as a legacy build at https://chpollin.github.io/FemPrompt_SozArb/ and therefore exposes the internal working surfaces, while the git-ignored reading layer stays off the site. The repository has been private since 1 October 2026 and the Pages site stays public, so links from public pages to the repository are dead for the public. The operator decided on 29 September 2026 that Pages shows only the result page. The target is the allowlisted result site from `build/site/` under [[governance#Publication boundary]], and the switch is decision 3.

1. Obtain the operator's approval for the switch.
2. Set the Pages source of the repository to GitHub Actions.
3. Dispatch `.github/workflows/pages.yml`, which runs on `main`, builds and checks the project and uploads only `build/site/`.
4. Check the deployed state at the public address. A local build or passing local checks do not establish it.

## Provenance and verification alignment

The accepted scope permits human verification of individual fields or statements and first produces comparative literature synthesis. [[governance#Verification scope decision, 22 September 2026]] owns the authority rule, and [[research-vault#Comparative synthesis scope]] owns the analytical scope. Since ADR-044 PRISM offers no human verification action. The verification data model of ADR-040 and existing entries stay readable, and round-one annotations stay valid corpus decisions without a new verification event.

1. Implement human review targets at field or statement level without promoting their parent. Bind the reviewed content and its evidence dependencies to an identified person, actual review time, declared scope and outcome. A change to relevant evidence invalidates the review even if the field value or statement text is unchanged. Unrelated field changes need not invalidate an otherwise unchanged target.
2. Decide where such reviews are recorded, given that human sessions in PRISM must not show the agent coding before the human decision (ADR-044). Human verification receipts remain separate from AI-review receipts and deterministic checks.
3. Define publication of mixed-authority content before simplifying the publisher. Determine which verified fields, statements and necessary context belong to the result view. Preserve historical approvals and the existing preliminary AI-reviewed policy. A target-level verification must never make unrelated contents public or verified.
4. Check the integrated behaviour with changed-source, stale-review, rejected-review and mixed-scope cases. Keep field coverage, review validity and actual scholarly correctness as separate acceptance claims.

These questions do not block human screening, source preparation, truthful inventory corrections or preparation of the comparative synthesis.

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
- Apply the prepared metadata corrections with their receipt bindings. `generated/source-acquisition/oa-batch-2026-10-01/pending-metadata-corrections.patch` corrects corrupt Zotero metadata from authoritative evidence and binds the texts that then pass the identity check. Applied with `git apply` and rebuilt, it removes the published projections of the legacy knowledge documents whose bibliographic identity it corrects, so it waits for the operator's confirmation of those deletions.
- Acquire the texts listed in `generated/source-acquisition/oa-batch-2026-10-01/remaining-for-acquisition.csv`. Several are open access but refused automated download and open in a browser; the others need licence or library access. The list also names the held texts that fail the identity check and what each needs.
- Correct the creators and year of the duplicate records `YPYQ2TCL` and `7IVS7X63` of *Assessing GPT's bias towards stigmatized social groups*, which carry those of two works the paper cites. The bound text is the right work ([[analysis-divergence#Gender category divergence]]).
- Re-review *Defeating Nondeterminism in LLM Inference* (`FTJM5R8N`) on the newly captured page with its title before binding it, since its released AI review read the earlier conversion.
- Rebuild the agent-screening queue after each source or corpus change.
- Resolve the Work duplicates the coding run and the answer drafts reported. `UFJ7ERFF` and `D2EGAVKZ` are bound to the same ACM text as `GP4JDSI8`, `HLBXNWAZ` is bound to the same text as `YLAKP7Z2` although its metadata names other authors, `7W3RGSSG` and `ACDF4FL9` are a paper and its extended version under separate Works, and `YN9JAREI` and `4KMMPA6A` as well as `WS4KQPWN` and the Work of `2EBHMYU4` may be the same publications. Coded pairs are counted twice until the Works are merged or the Versions corrected. Check the title variants of `DUV4TUG3` and `LBLF9BCW` and the creators of `SQYLQFRU`, `ACDF4FL9`, `ZLMLP53P` and `SS5HTYY6` against the sources and Zotero.

Canonical state carriers are `corpus/work_version_registry.json`, `generated/round2-intake-package.json`, `generated/round2-zotero-import.ris`, `generated/contextual-update-2026-08-24-intake-package.json`, `corpus/deep-research/round2/Codex Websearch/codex-websearch-2026-package.json`, `corpus/deep-research/round2/Codex Websearch/bibliographic-audit.json`, `generated/source-acquisition/codex-websearch-2026/source-readiness.json`, `generated/agent-screening-queue.json`, `docs/data/knowledge_doc_bindings.json`, and the reviewed full-text manifest.

The acquisition evidence under `generated/source-acquisition/completion-20260921/` distinguishes recovered sources, failed access attempts and identity conflicts. The record `JRG3B3LE` points to an arXiv text with a different title and remains unbound. The cultural-bias review associated with `Y4BMCI2J` requires reconciliation of the locally held first arXiv revision, the unpinned bibliography and a later withdrawn revision before source admission. Independent knowledge-document reviews and their superseded findings are retained under `corpus/knowledge-reviews/`.

### Governed agent annotation

Execute newly source-ready works under [[update-protocol#Agent-assisted completion]], including operationally isolated coding, deterministic PRISM transfer and separate source-grounded AI Agent Review. Preserve exact source identities and prior records when accepting new products. Use the current completion queue to distinguish missing coding from a fresh review required by changed evidence. The analysis-coding run over the included works is step 3 of [[#Answering the research questions]].

### Domain-expert verification

- Verify the Assertions that support the answer chapters, the literature report and the paper, each against its evidence.
- Verify the coded fields that the answers use, once [[#Provenance and verification alignment]] provides a field-level record that keeps the agent coding out of the human screening session.
- Preserve each correction as a superseding annotation with a field-level difference record.
- Verify the scholarly interpretation of the report and manuscript after their complete synthesis exists.

The accepted scope is defined in [[governance#Verification scope decision, 22 September 2026]]. New evidence requires checking the affected review dependencies while preserving previous versions.

### Publication

- Generate the final PRISMA 2020 and PRISMA-trAIce reporting artifacts from the governed records, and the PRISMA-ScR checklist for the mapping layer.
- Report the identification through AI-assisted deep research without database search with the declared deviation for items 6 and 7 and the wording recorded in [[standards#Identification and selection reporting]].
- Insert the verified quantitative and qualitative findings into the canonical manuscript.
- Check the current author instructions of Adult Literacy Education before submission, send the optional draft for editorial feedback by 1 December 2026 and submit by 15 February 2027 ([[project#Publication context]]).
- Apply the already authorised AI-source-reviewed release policy to eligible preliminary results. Record person-attributed publication approval for the final scholarly records and manuscript when that later authority is claimed.
- Rebuild and inspect the separate result site from its policy-filtered projections.

## Technical follow-up

- Confirm the native Chromium directory-permission path in a disposable clone. Since ADR-047 it is only the fallback for a static server, and the operator's own test of 2 October 2026 connected a clone through it.
- Exercise the setup path of the README with a person who did not build PRISM before, on a fresh Windows clone, and correct the documentation where it fails.

## Waiting on the project owner

These steps need an operator contribution. Additive Zotero import has its own explicit authorisation under [[governance#Authorised additive Zotero import]].

- Curation of ambiguous duplicate and Version relations in Zotero remains separate from adding missing records. Existing group records are not silently merged or rewritten, and `corpus/zotero_sync.json` records library membership and confirmed aliases.
- Acceptance session of PRISM with the domain experts. The user stories in [[specification]] were written by the technical lead as a user proxy.
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

The numbers are referenced from the steps above. The status column states how far each decision has come.

| No. | Decision | Status | Required contribution |
|---|---|---|---|
| 1 | Source-binding rule for the prepared 2026 reading texts whose converted Markdown lost its DOI, by accepting acquisition receipts as identity evidence | Taken on 1 October 2026 and implemented. Pending are the metadata corrections patch, which deletes stale knowledge-document projections, and the merge of duplicate Works | Operator confirmation of the patch and of duplicate merges |
| 2 | Remapping of the four Assertions with AI Agent Review that carry the earlier numbering or no sub-question field ([[research-vault#Assertions]]). An edit invalidates their review receipts | Taken on 1 October 2026 and carried out as proposed, see [[#Decisions taken]] | None |
| 3 | Switch of GitHub Pages from `docs/` to the result site in `build/site/` ([[#Deployment]]) | Open. The target was decided on 29 September 2026 | Operator authorisation |
| 4 | PRISMA-ScR as reporting frame for the mapping layer ([[standards#Reporting decision on PRISMA-ScR]]) | Taken on 1 October 2026, adopted. The PRISMA-ScR items are mapped in [[standards#PRISMA-ScR items]] and in the machine-readable conformance map | None |
| 5 | Publication of the round-one matrix | Open | Operator decision on scope and form |
| 6 | Article type, paper architecture and author order of the result paper for Adult Literacy Education. The Paper-Pipeline document in the personal vault still describes the methodological workflow as the main part, and the division of literature report, paper and Companion is open | Open. Venue decided | Decision by the co-author group |
| 7 | Supplementary search for literature on LLM use in social-work tasks without a bias focus, as a dated, separately documented search layer with its own denominators, or an answer limited to the existing bias-focused corpus | Taken on 1 October 2026. No supplementary search; the answer stays limited to the existing corpus and the limit is named | None |
| 8 | Interpretive synthesis method, critical interpretive synthesis or meta-narrative review ([[analysis-methods#Synthesis layer]]) | Taken on 1 October 2026. Critical interpretive synthesis | None |
| 9 | External framework of general prompt guidance for SQ5. The candidate is the taxonomy of Schulhoff et al. (2024), *The Prompt Report*, which the technique vocabulary appears to follow. The project's own five-step formula must not serve as the standard | Taken on 1 October 2026. *The Prompt Report* (Schulhoff et al. 2024) | None |
| 10 | LLM and harness for the analysis-coding run | Taken on 2 October 2026. Claude Code subagents on Claude Opus 5.5 for both tracks and the review, recorded per track as same-model | None |
| 11 | Deletion of superseded files, among them the redirect page `docs/onboarding.html` and the files of the old Literaturbild and the concept-graph network that the working application no longer loads | Taken on 1 October 2026 and carried out, together with the merged agent worktrees and branches | None |
| 12 | Whether the Netz view appears publicly before coding coverage is sufficient. The critical review advised against it | Open | Operator decision |
| 13 | Whether aggregate coverage counts about unreleased works may appear on the result site ([[governance#Publication boundary]]) | Open | Governance decision by the operator |
| 14 | Kubes (2024), *Feministische KI – Künstliche Intelligenz für alle?*, is released as an AI Include although its consolidated human decision is Exclude, a documented round-specific divergence, and it appears in the public matrix ([[governance#Publication boundary]]) | Open | Operator decision on its public treatment |
| 15 | Whether historical divergence classifications from the Git history are restored as a committed, attributed source ([[data#Historical concept graph and divergence classification]]) | Open | Operator decision |
| 16 | Whether the full-text cascade switches to creator-based `author_year` keys, which would change the source binding of several records | Open | Source-identity decision by the operator |
| 17 | Tier 2 reference coding needs a PRISM session mode that also hides the consolidated expert decision, and a randomly drawn verification sample in addition to the assigned scope ([[analysis-methods#Tier 2, analyses after complete expert-verified coding]]) | Open | Operator decision on tool contract and sampling |
| 18 | Final scholarly release of verified research records and outputs | Open. The preliminary AI-source-reviewed release is authorised | Person-attributed publication approval |
| 19 | Final submission package | Open | Approval of manuscript, supplement, disclosures and venue requirements |
| 20 | Whether PRISM drops the analysis-coding step that it still required of a human reviewer on an Include (FR-14 in [[specification]]) | Taken on 1 October 2026. PRISM has no human analysis step (ADR-045) | None |
| 21 | Whether the assigned open papers without paper text are acquired before the reviewers reach them, or screened on their metadata and excluded as Kein Volltext, which ADR-048 makes a formal exclusion. A sweep of 2 October 2026 found a substantial share of both reviewers' lists without paper text and some with only an abstract ([[testing#Run of 2 October 2026]]) | Open | Operator decision before the screening sessions |

### Decisions taken

These decisions left the open list. Their content lives at the linked place.

| Date | Decision | Recorded in |
|---|---|---|
| 24 September 2026 | The editors of Adult Literacy Education accepted the expression of interest, which fixes the venue | [[project#Publication context]] |
| 1 October 2026 | The main question and the five sub-questions SQ1 to SQ5 were merged | [[project#Research questions]] |
| 1 October 2026 | Human reviewers screen without AI pre-assessment | ADR-044 in [[specification]] |
| 1 October 2026 | The open papers are split between the two reviewers | ADR-043 in [[specification]] |
| 1 October 2026 | The codebook amendment v1.4 is adopted and in force, with `AN_Bias_Definition` added and `AN_Stage_Status` deferred, and a pilot run on ten works recorded | [[codebook-v1.4-proposal]], [[update-protocol#Amendment record]] |
| 1 October 2026 | The working Companion and PRISM redesign were merged into `main` and pushed. The elevated sandbox permission of the earlier coding-run plan is replaced by a harness-agnostic run | [[journal]] |
| 1 October 2026 | Full texts stay in the private repository, superseding the plan of 29 September 2026 to remove protected texts. The laptop branch `prepare-expert-verification`, which carried that removal, is not merged | [[governance#Publication boundary]] |
| 1 October 2026 | All prepared reading texts are to be bound, in principle | Decision 1 above |
| 1 October 2026 | Texts are bound on an acquisition receipt plus a re-run identity check (`binding_mode: acquisition_receipt`), without weakening the identity test | [[data]] |
| 1 October 2026 | Accepted by the operator on 1 October 2026. The Korpus stage bar is split into Screening (Identifiziert, mit Text, bewertet, eingeschlossen) and Auswertung (kodiert, in Aussagen), without arrows in either bar. Reason, the stages are not nested, since most coded works and most works cited by Assertions have no human screening decision, and neither are bewertet and mit Text. Each Auswertung stage shows its human-Include subset as a smaller "davon n eingeschlossen" filter. Revert path, restore the single list in `barHtml` of `docs/js/korpus-stages.js`, the `<ol id="stage-bar">` in `docs/index.html` and the arrow rule in `docs/css/research.css` from the parent of this commit | [[specification#Working Companion]] |
| 1 October 2026 | Accepted by the operator on 1 October 2026. Saved reviewer records of the assigned reviewers count as bewertet in the Korpus and replace the round-one expert decision, the newer record winning between two reviewers, in the order of PRISM's `paperSubject` and `isDone`. Unclear counts as bewertet, not as eingeschlossen, and shows as ?. The CSV column `Expert_Decision` became `Screening_Decision` with a new `Screening_Source`. Reason, the Korpus would otherwise call works open that PRISM counts as erfasst. Revert path, drop `addReviewerFile` and the reviewer branch of `decision` in `docs/js/korpus-stages.js` | [[specification#Working Companion]] |
| 1 October 2026 | Accepted by the operator on 1 October 2026. The Korpus table opens sorted "nach Stand" instead of "LLM-Include zuerst", which stays selectable. Reason, the workbench serves the review stages, not the round-one LLM comparison. Revert path, set `DEFAULT_SORT` in `docs/js/research-app.js` back to `relevance` and the first option of `#sort-by` | [[specification#Working Companion]] |
| 1 October 2026 | Accepted by the operator on 1 October 2026. PRISM skips a publisher cover page (Taylor & Francis, ACM) at the start of a reading text at render time, by a fixed marker list, without a control and without rendering the skipped part. Reason: the sheet repeats the metadata of the paper head and adds distribution chrome, and a hidden copy in the page would catch in-text hits out of sight. Revert: remove the `publisherCoverEnd` call in `paperBodyMarkdown` of `docs/js/prisma.js` | [[specification#Screening (default surface)]] |
| 1 October 2026 | Accepted by the operator on 1 October 2026. The Docling entities `&amp;`, `&lt;` and `&gt;` are decoded once where the full text enters the reader, never in the stored file. Reason: the double escaping showed "&amp;" while the source hash binds the stored text. Revert: drop `decodeConverterEntities` from `paperBodyMarkdown` | [[specification#Screening (default surface)]] |
| 1 October 2026 | Accepted by the operator on 1 October 2026. An expert Exclude taken over against the rule reads as one line below the panel head, "Ausgeschlossen durch Expert:innen, Kategorien ergäben Include", with the decision badge kept, and in `Bearbeiten` the override and the reasons sit behind "Ausschluss ändern". Reason: four elements stated one fact, while editing must stay complete. Revert: let `expertAdoptedExclusion` return false | [[specification#Screening (default surface)]] |
| 1 October 2026 | Accepted by the operator on 1 October 2026. The `Zuteilung` filter is left out under `Erfasst`, and choosing `Erfasst` clears the assignee selection. Reason: the assignment covers open papers, so the segments only counted zeros, and a kept selection would make the `Offen` count disagree with its list. Revert: drop the `statusFilter` condition in `assigneeFilterAvailable` and the reset in the status handler | ADR-043 in [[specification]] |
| 1 October 2026 | Accepted by the operator on 1 October 2026. The counter "n von N erfasst" of ADR-042 is removed, and the position "n / N" stays. Reason: the `Erfasst` segment carries the same count, while the position answers where the open paper stands in the filtered list. Revert: restore the `pt-ws-done` span in `positionBarHtml` | ADR-042 in [[specification]] |
| 1 October 2026 | Accepted by the operator on 1 October 2026. The in-text step arrows are hidden until there is more than one hit, the DOI in the paper head wraps instead of being cut, and the middle-dot separators of PRISM (metadata line, provenance line, save hint, list subtitle, provenance details) are replaced by spacing or commas. Reason: operator screen review and the interface rule against middle-dot separators. Revert: the corresponding hunks in `docs/js/prisma.js` and `docs/css/prisma.css` | [[specification#Screening (default surface)]] |
| 1 October 2026 | Accepted by the operator on 1 October 2026. Codebook 1.4.1 clarifies three rules from the 1.4 pilot: a harm type needs the work's own argument or result, a difference in tone or style is not by itself `Disparate_Performance`, `Social_Construct` needs an explicit statement. Reason: `AN_Harm_Types` had the lowest track agreement in the pilot. The validators and the PRISM sanitiser accept a patch version so that annotations keep 1.4.1. Revert: restore `assessment/categories.yaml` 1.4 and drop the amendment row | [[update-protocol#Amendment record]] |
| 1 October 2026 | Accepted by the operator on 1 October 2026. The four Assertions with AI Agent Review carry the current sub-question numbering (Kabra, Kaneko and the variation Assertion SQ3, Ahn SQ5). Only `research-questions` changed. The earlier acceptances are invalidated by `generated/verification/assertion-remap-invalidation-2026-10-01.json` and replaced by new receipts of the review below. Revert: restore the previous field values and remove both batches from the ledger index | [[research-vault#Assertions]] |
| 1 October 2026 | Accepted by the operator on 1 October 2026. AI Agent Review of all Assertions against their grounding blocks and sources by eight Claude Sonnet 5.5 subagents with an orchestrator sample check, recorded in `generated/verification/assertion-reviews-2026-10-01.json`. Reason: the grounded drafts needed a source review before any further use. The status field of the grounded Assertions is unchanged, so none is released. Proposed narrowings stand in the receipts and are not applied. Revert: remove the batch from the ledger index | [[research-vault#Status and checks]] |
| 1 October 2026 | Accepted by the operator on 1 October 2026. German short labels for the Argumentkarte in `research-vault/labels/assertion-labels.json`, bound to the hash of each Statement. Reason: tiles showed no content. The local working file carries all labels, the released index only those of released Assertions. Revert: remove the file, the loader and the tile label | [[research-vault#Assertions]] |
| 2 October 2026 | The operator confirmed codebook 1.4.1, chose Claude Code subagents on Claude Opus 5.5 for the coding run (decision 10) and authorised integrating each fully resolved run into the agent track. Sixteen runs were coded, reviewed and integrated with record receipts. Revert: restore `docs/data/screening/ar2.json`, `generated/verification/ai-source-reviews.json` and the generated projections from the parent of the run commit and remove the run folders and the receipt batch | [[update-protocol#Coding run of 2 October 2026]] |
| 2 October 2026 | Provisional, pending the operator's acceptance. The local server writes the reviewer files, PRISM connects to it without a folder step, and the reviewer is chosen by name from the assignment. Reason, in a fresh-clone test the folder step was the one setup step a reviewer could get wrong, a folder without `docs` was silently taken as the target, and saving needed Chrome or Edge. Revert path, drop `loadLocalServer` from the init chain in `docs/js/prisma.js` and the `/__prism/` routes from `src/publish/serve.py` | ADR-047 in [[specification]] |
| 2 October 2026 | Provisional, pending the operator's acceptance. The save action is a labelled button "Speichern" in the assessment dock instead of the disk icon in the corpus column, a dot or a check beside the decision badge states the save state, and the text basis appears only when weaker than the full text. Reason, operator screen review of the panel. Revert path, restore `positionBarHtml`, `dockHtml`, the rail head and `textBasisHtml` in `docs/js/prisma.js` from the parent commit | ADR-047 in [[specification]] |
| 2 October 2026 | Provisional, delegated by the operator and pending acceptance. An Exclude for a formal reason (Duplikat, Falscher Publikationstyp, Kein Volltext, Sprache) needs no Paper Beleg, and its set categories are stored with `evidence_basis` `formal_exclusion`. A set category without a Beleg is outlined at the toggle, and a click on an incomplete save moves to the first gap. Reason, a duplicate could not be saved without six passages that carry no evidence value for its exclusion. Revert path, remove the `formal: true` lines from `assessment/categories.yaml` and rebuild | ADR-048 in [[specification]] |
| 2 October 2026 | Provisional, pending the operator's acceptance. Under `Offen` PRISM lists papers with a full text first, then abstract-only, then without paper text, and names the weaker basis in the entry. Reason, a reviewer's queue otherwise opened early on papers that cannot be read, while decision 21 is open. Revert path, let `tieredOrder` in `docs/js/prisma.js` return false | [[specification#Screening (default surface)]] |
