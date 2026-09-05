---
title: Round-Two Update Protocol
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: active
language: en
version: "0.7"
created: 2026-06-09
updated: 2026-09-05
authors: [Christopher Pollin]
generated-with: Claude Code, Codex (GPT-5.6)
topics: ["[[Pre-Registration]]", "[[Coding Scheme]]", "[[AI Agents]]"]
related: [plan, governance, verification, data, specification, methods, standards]
---

# Round-Two Update Protocol

This protocol governs literature identification, controlled intake, agent-assisted screening, analysis coding, and deferred domain-expert verification for the second review round. Its initial state existed before the production searches. Dated amendments record rules introduced during or after execution. Prospective claims apply only to operations governed by a previously recorded rule.

## Protocol history

Round one retains its conducted comparative design and its provenance limits. Its consolidated expert annotation and LLM assessment remain separate records. The missing pre-specified round-one protocol cannot be reconstructed retrospectively.

Round-two searches ran under the initial protocol and were documented in `corpus/deep-research/round2/LAUFPROTOKOLL.md`. Later amendments introduced the final analysis-field vocabulary, PRISM capture rules, full agent preparation, source-grounded AI Agent Review, deterministic PRISM transfer, deferred domain-expert verification, and the publication lifecycle. The ADR register in [[specification]] preserves the implementation decisions.

## Objectives

1. Update the first-round corpus with literature from the defined round-two publication window.
2. Preserve search, conversion, curation, source, prompt, model, actor, and lifecycle provenance.
3. Apply the same eligibility dimensions across both rounds while retaining their distinct coding scales and authority structures.
4. Capture the analysis fields required for SQ1 to SQ3 within each included round-two annotation.
5. Prepare the intended corpus agentically and present the complete result to domain experts for verification.
6. Produce machine-readable inputs for PRISMA 2020, PRISMA-trAIce, the literature analysis, the report, and the paper.

## Research questions

The methodological question asks how LLMs and AI agents can be integrated into a qualitative literature review with traceable contributions, re-executable processing, and final scholarly authority assigned to domain experts.

The literature analysis uses three sub-questions.

- SQ1 identifies prompting techniques and their evidence status.
- SQ2 maps bias axes and harm types to proposed, demonstrated, or evaluated mitigations.
- SQ3 identifies social-work-specific contexts, constraints, and research gaps.

## Eligibility

`assessment/categories.yaml` version 1.3 is the vocabulary source. The eligibility scheme has ten categories in two dimensions. PRISM records `nein`, `teilweise`, or `ja` for each category.

- Include requires at least one `ja` category in each dimension.
- Unclear requires at least one `teilweise` category in each dimension without meeting the Include rule.
- Exclude applies when one dimension remains entirely `nein`.

Exclusions use the controlled reasons `Duplicate`, `Not_relevant_topic`, `Wrong_publication_type`, `No_full_text`, and `Language`. Analysis fields describe included literature and do not influence eligibility.

The round-two publication window runs from July 2025 through June 2026. Overlap with round one is resolved during deduplication.

## Identification and search provenance

The identification design repeats the multi-system Deep Research approach of round one and permits documented manual supplementation. A fifth context-informed agentic web-search lane was added through a dated amendment. Each executed lane preserves the following artifacts.

- executed prompt and prompt version
- provider, model identifier, and run timestamp
- raw search output
- conversion prompt and converted RIS file
- source-tool label for every imported record
- run note covering failures, retries, and deviations

The executed artifacts under `corpus/deep-research/round2/` carry the factual run record. Future supplementary Codex or Claude Code searches require their own prompt, model, date, raw output, and resulting records before they count as identification lanes.

On 24 August 2026, three operationally separate Codex subagents executed a context-informed supplement covering direct social-work applications, feminist and inequality research, and prompt-based bias mitigation. The protocol, query patterns, primary-source links, duplicate checks, complete Tier-A and Tier-B candidate sets, exclusions, and saturation statements are committed under `corpus/deep-research/round2/contextual-update-2026-08-24/`. The supplement preserves the original publication window. Earlier missed publications and post-window publications carry explicit window-relation metadata and enter the same Zotero, source, screening, review, and verification gates as other candidates.

A deeper 2026-only expansion is stored under `corpus/deep-research/round2/Codex Websearch/`. It retains three complete lane records, an execution manifest, the exact year and cutoff rule, a cross-lane bibliographic audit, and one deduplicated RIS package for the 2026 subset. This package is the sole later import source for its 2026 candidates; overlapping 2026 records from earlier pending RIS files must not be imported separately.

## RIS conversion and Zotero curation

Every RIS conversion preserves a direct input-prompt-output relation.

1. Store the raw Deep Research output unchanged.
2. Store the exact conversion prompt with model and run metadata.
3. Store the RIS output beside its source artifacts.
4. Check a documented sample against author, year, title, DOI or URL, and source-tool attribution.
5. Import Zotero records from the committed RIS output.

Zotero is the curated metadata layer. Domain researchers use it to resolve duplicates, inspect titles and publication types, correct metadata, retain Deep Research summaries and abstracts, and attach available PDFs. DOI, title, and Work identity are reconciled before screening.

The canonical Work-Version registry follows Zotero curation. One stable `work_id` groups publication expressions of the same scholarly work. Every known Preprint, Accepted Manuscript, proof, Version of Record, or corrected Version of Record retains its own `version_id`, identifiers, date, access status, integrity status, and provenance. Publication stage and peer-review status remain separate metadata dimensions. `preferred_version_id` identifies the version normally selected for screening; `latest_version_id` records chronology and may differ. Duplicate bibliographic records remain addressable through `record_index`. Screening coverage applies once per Work, while Paper evidence, full-text conversion, distillation, and Assertions cite the exact Version used.

## Text preparation and source gate

PDFs are converted to Markdown with Docling. The conversion-review interface supports visual inspection of the resulting structure. A Work becomes screenable only after its identity is stable and reviewed Paper Markdown for its preferred available Version is bound to it. The generated queue records unavailable, ambiguous, unbound, version-mismatched, or conversion-pending sources before an agent receives an assignment.

The Paper layer is the evidence basis for screening. The LLM-Wissensdestillat remains a separately labelled reference layer and cannot satisfy a positive-category evidence requirement.

## Agent-assisted completion

### Operationally isolated tracks

Two Codex agents receive the same frozen criteria and Paper source in separate contexts, under distinct reviewer identities and output paths. Each produces a `femprompt-prisma-coding-packet/0.1` bound to the run manifest and source hashes. Operational isolation limits direct cross-track contamination and documents execution conditions. It establishes no epistemic-independence claim.

### Deterministic PRISM transfer

The orchestrator validates each coding packet and projects it through PRISM's production `validateReviewerPayload`, `importReviewerPayload`, `recordRequirements`, and `reviewerFileText` functions. New schema-0.4 tracks preserve the packet values and bind every decision and Paper evidence item to the assigned `work_id` and `version_id`. Historical schema-0.3 tracks remain valid immutable inputs to AI Agent Review. Run schema 1.3 binds Work and Version assignments, sources, prompts, models, packets, reports, projected tracks, review outputs, and hashes.

Visible PRISM interaction remains the domain-expert verification and correction surface and the basis of browser acceptance tests. Historical visible trial exports retain their original execution provenance.

### Source-grounded AI Agent Review

A separately commissioned AI agent compares the two tracks with the assigned Paper source. The review checks source identity, quotation fidelity, category support, decision derivation, controlled vocabularies, and Include-analysis completeness. Accepted output reaches `ai-agent-reviewed`. Unsupported evidence, unresolved source identity, incomplete analysis, or a failed contract blocks productive integration.

Agreement between the two AI-agent tracks is a workflow diagnostic. It provides no estimate of inter-expert reliability or model accuracy.

## Analysis coding

Every Include record captures the fields defined in `assessment/categories.yaml` version 1.3.

| Field | Coding rule |
|---|---|
| `AN_Prompting_Role` | Role of prompting in the paper, including recommended practice, research instrument, object of critique, or learning content |
| `AN_Prompt_Techniques` | Named or recognisably described technique; `None` remains valid when prompting is present without a codable technique |
| `AN_Bias_Axes` | Explicitly addressed axes; `Intersectional` requires interacting axes |
| `AN_Harm_Types` | Explicit harm mechanism; required when the coding basis is full text |
| `AN_Mitigation_Stage` | Stage at which the intervention operates |
| `AN_Mitigation_Status` | Proposed, demonstrated, evaluated, or the applicable controlled status |
| `AN_Population` | Addressed population or setting, with professional education applied narrowly |
| `Studientyp` | Controlled study type reused from the project schema |
| `AN_Coding_Basis` | Paper source used for the coding |
| `AN_Notes` | Source-linked clarification, concrete strategy behind general guidance, and machine-countable non-decidability notes |

Every field has an explicit value or a recorded non-decidability state. `None` means the paper does not address the field. A non-decidable field records `Feldname: nicht entscheidbar aus <Basis>` in `AN_Notes`. Review and concept papers may code the technique, harm, and mitigation inventories they synthesise when those inventories are the paper's object.

Round-two Includes receive the analysis fields during agent screening. Round-one Includes enter the same vocabulary through a separately manifested backfill run. The final synthesis therefore covers both rounds under one analysis schema while preserving their screening provenance.

### Source-review clarification, 5 September 2026

This clarification records the interpretation used in the targeted re-review of existing annotations. It does not claim retrospective preregistration and does not change the ten categories or controlled vocabulary.

`Evaluated` requires a completed assessment of an identifiable mitigation and a reported result. A negative or mixed result qualifies; evaluation does not mean effectiveness. A review may synthesise such an assessment, but a reference list, an inventory of techniques, or bias measurement without a mitigation assessment does not suffice. `AN_Notes` identifies the intervention, the result discussed, and its source; it explicitly distinguishes a synthesised evaluation from the review's own experiment. For mixed inventories, the single status field records the highest supported stage and the note limits that status to the relevant intervention. Other recommendations are not thereby evaluated. A proposed future evaluation remains `Proposed`.

| Mitigation stage | Required source support |
|---|---|
| `Pre_Processing` | Selection, cleaning, augmentation, weighting or other preparation of learning data |
| `In_Training` | An intervention explicitly placed in learning or retraining; a clear training recommendation may qualify as `Proposed` |
| `Intra_Processing` | A specified technical intervention during model application or inference |
| `Post_Processing` | A technical change to model outputs or learned representations, such as calibration or filtering |
| `Prompt_Practice` | A change to instructions or the prompting procedure |
| `Organisational_Process` | Responsibility, participation, training, governance, audit or human oversight |

Each assigned stage needs its own source support. Monitoring alone does not establish an inference intervention. Inspecting an output does not establish a technical output modification. Generic fairness constraints, compensation or lifecycle language do not justify assigning every technical stage. Stage and evidence status remain separate: an explicit recommendation can identify a stage while remaining `Proposed`. The decisions and exact Paper passages for the reviewed cases are in `generated/verification/screening-review-c.json`.

The existing two-dimensional eligibility rule includes non-generative algorithmic systems and social dimensions beyond a direct social-work setting. Absence of generative AI or of a direct social-work application is therefore not, by itself, a round-two exclusion. Direct practice relevance and transferability are assessed separately for SQ3. The publication medium alone does not establish quality: scholarly grey literature can contribute a conceptual inventory or teaching example when its authorship, source, relevant content and limitations are clear. A withdrawal blocks current synthesis pending an explicit integrity resolution. These clarifications do not overwrite round-one human decisions or invent a missing round-one protocol.

## Lifecycle and authority

The ordered states are `identified → curated → agent-annotated → ai-agent-reviewed → verified → publication-approved`.

Deterministic checks bind to the exact annotation ID and content hash. They record structural and rule conformance. A domain expert later records `accepted`, `corrected_and_accepted`, `changes_requested`, or `rejected` for every intended productive record. Accepted outcomes establish `verified`. Corrections append a complete person-attributed annotation with field-level differences and `supersedes`. Publication approval requires a later person-attributed event.

Internal topic modelling, descriptive analysis, Assertion generation, and report drafting may use `ai-agent-reviewed` data when every derived artifact retains the supporting lifecycle state. Final scholarly literature claims require domain-expert verification. The operator's separately dated preliminary-release permission in `config/publication_policy.json` allows explicitly labelled, currently source-reviewed AI projections under the artifact and source integrity gates in [[governance#Publication boundary]]. It does not establish human verification or final scholarly publication approval.

## Process diagnostics

Committed scripts derive diagnostics from the stored tracks and lifecycle events.

- decision, category, and analysis-field differences between agent tracks
- source-grounding corrections introduced during AI Agent Review
- blocked records grouped by source, identity, evidence, or analysis reason
- lifecycle distributions across the governed corpus
- source-basis distributions used for annotation and analysis

Round-one expert and LLM divergence remains a separate comparative analysis governed by [[analysis-divergence]].

## Roles

| Role | Responsibility |
|---|---|
| Review lead | Research design, domain verification, interpretation, publication decision |
| Reviewing domain expert | Domain verification and correction |
| Technical and methodological lead | Run orchestration, deterministic integration, analysis generation |
| Research assistant | Zotero curation, metadata correction, source management |
| AI screening agent | Source-grounded annotation and analysis coding |
| AI agent reviewer | Source-grounded review of tracks and proposed productive record |
| Software agent | Deterministic validation and publication checks |

## Amendment record

| Date | Amendment | Effect |
|---|---|---|
| 2026-07-17 | Search execution and field-freeze amendments | Recorded actual lane execution and refined the analysis vocabulary |
| 2026-07-18 | PRISM analysis capture | Moved controlled analysis coding into the Include workflow and retained Excel as exchange format |
| 2026-08-22 | Evidence and completeness gates | Required Paper evidence for positive categories and complete analysis before saving an Include |
| 2026-08-23 | Agent-assisted completion | Assigned full corpus preparation to two AI-agent tracks with separate AI Agent Review and deferred domain-expert verification |
| 2026-08-23 | Authority vocabulary | Separated deterministic validation, AI Agent Review, domain-expert verification, and publication approval |
| 2026-08-23 | Deterministic PRISM transfer | Replaced visible trial transcription for new Codex runs with production-function projection of validated coding packets |
| 2026-08-24 | Work-Version identity | Added stable Work identities, exact publication Version bindings, separate stage and peer-review metadata, and preferred-version source gates |
| 2026-08-24 | Context-informed search supplement | Executed three dated Codex search lanes, retained the original round-two window, and prepared Tier-A candidates for Zotero curation without assigning screening decisions |
| 2026-08-24 | Codex Websearch 2026 | Expanded the context-informed search through three deep 2026-only lanes and produced one deduplicated, audited Zotero package for the complete selected subset |

Detailed execution evidence remains in run manifests, the prompt changelog, `corpus/deep-research/round2/LAUFPROTOKOLL.md`, [[journal]], and ADR-026 through ADR-037 in [[specification]].
