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
version: "0.8"
created: 2026-06-09
updated: 2026-10-02
authors: [Christopher Pollin]
generated-with: Claude Code, Codex (GPT-5.6), Claude Code (Claude Opus 5.5)
topics: ["[[Pre-Registration]]", "[[Coding Scheme]]", "[[AI Agents]]"]
related: [plan, governance, verification, data, specification, methods, standards, project, analysis-methods, codebook-v1.4-proposal]
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
4. Capture the analysis fields of [[#Analysis coding]] within each included round-two annotation.
5. Prepare the intended corpus agentically and present the complete result to domain experts for verification.
6. Produce machine-readable inputs for PRISMA 2020, PRISMA-trAIce, the literature analysis, the report, and the paper.

## Research questions

The methodological question asks how LLMs and AI agents can be integrated into a qualitative literature review with traceable contributions, re-executable processing, and final scholarly authority assigned to domain experts.

The literature analysis originally used three sub-questions on prompting techniques and their evidence status, on the mapping of bias axes and harm types to proposed, demonstrated or evaluated mitigations, and on social-work-specific contexts, constraints and research gaps. On 1 October 2026 the operator made the substantive question primary and reformulated the sub-questions around the tasks of social work. [[project#Research questions]] holds the current wording and the mapping from the earlier questions. On the same day the operator merged grant questions, the team-meeting grid and the reformulation into five sub-questions SQ1 to SQ5 and adopted codebook version 1.4 for them ([[#Analysis coding]]). The `serves` entries of the analysis fields in `assessment/categories.yaml` and the question labels of the generated SQ tables use this numbering.

## Eligibility

`assessment/categories.yaml` version 1.4 is the vocabulary source. Its eligibility content is unchanged since version 1.2. The eligibility scheme has ten categories in two dimensions. PRISM records `nein`, `teilweise`, or `ja` for each category.

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

When text conversion omits figures, an assignment may additionally provide source-QC-reviewed original PNG pages or figures with exact hashes, page locators and documented CC BY 4.0 permission in `source.assets`. Every reviewer reads the complete assigned text and all listed images. The run validator checks these image bytes and paths before and after execution; the original PDF hash records the acquired source. Quantitative graph interpretation retains its stated limitations, and internal source inconsistencies remain explicit. Category evidence still requires a quotation from the assigned text. This makes visual material available for reading without claiming that PRISM already supports image-evidence pins or that all pending visual-evidence cases are resolved.

## Agent-assisted completion

### Operationally isolated tracks

A coding run is an AI harness run. Two agent tracks receive the same frozen criteria and Paper sources in separate harness contexts, each with its own working folder, reviewer identity and output paths, and neither reads the other's output. A track may run as a Claude Code subagent, as a Codex agent or in another harness. Each track produces a `femprompt-prisma-coding-packet/0.2` bound to the run manifest, its codebook version and the source hashes, and the orchestrator copies packet and report to the manifest paths after the track has finished. Run schema 1.4 records per track the harness, provider, model and model identifier, and `isolation.model_diversity` states whether both tracks use the same model. Operational isolation limits direct cross-track contamination and documents execution conditions. It establishes no epistemic-independence claim, and two tracks on the same model are less independent than two tracks on different models. Runs under schema 1.3 and earlier keep their run-wide model and their packets 0.1, which read as codebook 1.3.

### Deterministic PRISM transfer

The orchestrator validates each coding packet and projects it through PRISM's production `validateReviewerPayload`, `importReviewerPayload`, `recordRequirements`, and `reviewerFileText` functions. New schema-0.4 tracks preserve the packet values, record the codebook version in each annotation's analysis and bind every decision and Paper evidence item to the assigned `work_id` and `version_id`. Historical schema-0.3 tracks remain valid immutable inputs to AI Agent Review. Run schema 1.4 binds the codebook version and hash, Work and Version assignments, sources, prompts, per-track execution environments, packets, reports, projected tracks, review outputs, and hashes. A run under schema 1.4 may code works that human screening already covers and records that coverage.

Visible PRISM interaction remains the domain-expert verification and correction surface and the basis of browser acceptance tests. Historical visible trial exports retain their original execution provenance.

### Source-grounded AI Agent Review

A separately commissioned AI agent compares the two tracks with the assigned Paper source. The review checks source identity, quotation fidelity, category support, decision derivation, controlled vocabularies, the field rules and located analysis passages of the codebook version, and Include-analysis completeness. Accepted output reaches `ai-agent-reviewed`. Unsupported evidence, unresolved source identity, incomplete analysis, or a failed contract blocks productive integration.

Agreement between the two AI-agent tracks is a workflow diagnostic. It provides no estimate of inter-expert reliability or model accuracy.

## Analysis coding

Every Include record captures the fields defined in `assessment/categories.yaml` version 1.4.1, whose clarifications over 1.4 the operator accepted on 1 October 2026 ([[#Amendment record]]). The analysis fields are coded only by AI agent tracks, and human reviewers screen in PRISM without AI pre-assessment. The field rules (`rules`) and anchor passages (`anchors`) in the YAML are binding for the tracks. [[codebook-v1.4-proposal]] holds the reasons and the corpus patterns behind them.

| Field | Sub-question | Coding rule |
|---|---|---|
| `AN_Task` | SQ1 | Task of professional practice for which the work describes, tests or proposes AI use. Pilot field, its values are candidates until the pilot rule below is met |
| `AN_Population` | SQ1, SQ2 | Addressed population or setting, with professional education applied narrowly |
| `AN_Prompting_Role` | SQ1, SQ3, SQ5 | Role of prompting in the paper, including recommended practice, research instrument, object of critique, or learning content |
| `AN_Bias_Axes` | SQ2 | An axis the work analyses, measures, compares or uses as its own worked example. Enumerations, sample demographics, related work and outlook do not count, and `Intersectional` needs a passage whose outcome depends on the combination |
| `AN_Harm_Types` | SQ2 | A mechanism the work's own argument or result establishes for its own object, one passage per value, never a harm only cited from other work. Discrimination requires an allocation or a decision about persons, and name-based audits count as indirect discrimination. A difference in tone or style of output is not by itself `Disparate_Performance`. Required when the coding basis is full text |
| `AN_Prompt_Techniques` | SQ3 | Named or recognisably described technique. `None` remains valid when prompting is present without a codable technique |
| `AN_Mitigation_Stage` | SQ3, SQ5 | Stage at which the intervention operates |
| `AN_Mitigation_Status` | SQ3 | Proposed, demonstrated, evaluated, or the applicable controlled status, one value per Work |
| `AN_Gender_Definition` | SQ4 | Whether the work determines gender explicitly, only implicitly, not at all, or does not treat it. `Explicit` carries its located passage |
| `AN_Bias_Definition` | SQ4 | The same four values for bias. A technical fairness criterion counts as a determination |
| `AN_Gender_Understanding` | SQ4 | Understanding of gender underlying the work's own analysis. `Binary_Categorical` excludes `Non_Binary_Inclusive`, `Unclear` and `Not_Applicable` stand alone and pair with `Absent` and `Not_Applicable` of `AN_Gender_Definition`. `Social_Construct` needs an explicit statement in the work |
| `AN_Theory_Reference` | SQ4 | `Yes` when a named theory frames the treatment of gender or bias. Each theory is recorded as a located theory reference with name, passage and location |
| `Studientyp` | | Controlled study type reused from the project schema |
| `AN_Coding_Basis` | | Paper source used for the coding |
| `AN_Notes` | | Source-linked clarification, concrete strategy behind general guidance, and machine-countable non-decidability notes |

Every field has an explicit value or a recorded non-decidability state. `None` means the paper does not address the field. A non-decidable field records `Feldname: nicht entscheidbar aus <Basis>` in `AN_Notes`. Review and concept papers may code the technique, harm, and mitigation inventories they synthesise when those inventories are the paper's object. The coding-packet validator rejects a packet that violates a pairing rule, lacks a located passage for an explicit definition or a theory reference, or codes a field outside its codebook version.

Every annotation records the codebook version under which it was coded. A field introduced after that version derives the state `not_collected`, which no coder enters and which says nothing about the work. An annotation without a recorded version counts as 1.3. `AN_Stage_Status`, the stage-status pairs of the draft, is deferred until a validator enforces its pairing rules ([[codebook-v1.4-proposal#Deferred stage-status pairs]]).

Round-two Includes receive the analysis fields during agent screening. Round-one Includes enter the same vocabulary through separately manifested runs. The final synthesis therefore covers both rounds under one analysis schema while preserving their screening provenance.

### Recoding and coding of the remaining Includes

The works coded under version 1.3 receive a full recode under the current codebook by the same governed run procedure as the other works, two isolated tracks and a separate AI Agent Review. The recode replaces the complete coding, all ten categories, the decision and every analysis field, instead of recoding `AN_Bias_Axes` and `AN_Harm_Types` and adding the new fields to the kept 1.3 values. One annotation then carries one codebook version, so no record mixes fields of two runs and the state `not_collected` stays derivable from the active annotation. `python -m src.assess.prepare_coding_run <run-id> <purpose> <paper-id> ... --recode` admits a work only when its productive agent coding stands under an older codebook and binds each of its productive records by active annotation and canonical record hash in `recode_of`. Integration appends the result as an `ai_agent_recode` annotation that supersedes the 1.3 annotation, which stays in the record as history (ADR-046). The included works without analysis coding receive the full coding as new records. Both passes run as harness runs under schema 1.4 with AI Agent Review and the validation below.

### Validation of the AI coding

The validation replaces the human pilot of the draft. It has two parts.

1. Track agreement. `python -m src.assess.agent_track_diagnostics <run folder> --output <run folder>/track-agreement.json` computes per field the raw agreement over the works both tracks include, the positive specific agreement per value of a multi-value field (Cicchetti and Feinstein 1990) and Cohen's kappa as a descriptive figure without threshold, since its interval at batch size spans most of the scale (Sim and Wright 2005). Agreement between two tracks is a workflow diagnostic and estimates neither accuracy nor inter-expert reliability.
2. Human spot check against the full text. Domain experts check a sample of the AI-agent-reviewed records of each run, as set out below.

The spot check draws per run a seeded random sample of max(5, 15 percent of the run) works, rounded up, half from the works on which the tracks agreed on every analysis field and the rest from the works with at least one difference. Every work that a track or the AI Agent Review flags for a domain-expert decision joins the sample. The seed and the drawn works stand in `spot-check-sample.json` in the run folder. Each sampled work is checked for `AN_Task`, the four SQ4 fields, `AN_Bias_Axes` and `AN_Harm_Types`. The expert first codes these fields from the full text in the exchange sheet without seeing the AI record. Only then the expert opens the final AI-reviewed record and records per field `accepted`, `corrected` with the supporting passage, or `undecidable`. The blind step gives a human reference that the AI record cannot anchor, and the second step feeds the existing person-attributed verification with field-level differences. The two experts share the sample, and a work is checked by one expert. A field corrected in more than one fifth of the sampled works, or a value that experts and tracks confuse in two or more works, returns to rule revision before the next run, and the revision is recorded with its reason. The figures are reported per field as counts with the sample size. They describe the checked sample and are no corpus estimate.

The pilot rule for `AN_Task` follows the same evidence. Its values become final, and `pilot: true` is removed, when no difference in track agreement or spot check stems from a gap in the value definitions. A value no track uses stays provisionally in the vocabulary, since absence from a small sample is no reason to remove it.

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

The existing two-dimensional eligibility rule includes non-generative algorithmic systems and social dimensions beyond a direct social-work setting. Absence of generative AI or of a direct social-work application is therefore not, by itself, a round-two exclusion. Direct practice relevance and transferability are assessed separately for the earlier SQ3 on social-work contexts, whose content now belongs to SQ1 and SQ5. The publication medium alone does not establish quality. Scholarly grey literature can contribute a conceptual inventory or teaching example when its authorship, source, relevant content and limitations are clear. A withdrawal blocks current synthesis pending an explicit integrity resolution. These clarifications do not overwrite round-one human decisions or invent a missing round-one protocol.

### Pilot run of 1 October 2026

The run `codebook-v14-pilot-10-20261001` tested codebook 1.4 and the harness-agnostic contract on ten included works with a full text and without coding under 1.3. The sample covers experimental, theoretical, review and empirical works, works with and without a Gender or Feministisch category in the expert assessment, works inside and outside social work and one German practice guide, and it avoids every anchor work of [[codebook-v1.4-proposal]]. Two Claude Code subagents on the same LLM coded the works in separate working folders, and a third subagent performed the AI Agent Review. Packets, PRISM tracks, the review, the track agreement and the proposed spot-check sample stand in `tests/review-cases/agent-runs/codebook-v14-pilot-10-20261001/`. No productive screening file was written and no record was verified.

The tracks agreed on every decision and on most categories. Among the analysis fields they diverged most on `AN_Harm_Types`, followed by `AN_Bias_Axes` and `AN_Gender_Understanding`, while the new definition fields and `AN_Task` diverged rarely. The review resolved every difference from the source and never overrode a value both tracks shared. `track-agreement.json` holds the figures. Because both tracks ran on one LLM, their agreement is the upper end of what two tracks show and says nothing about accuracy.

The pilot exposed the following points for the full run.

- The protocol text lagged the codebook during the run, and all three agents reported it and followed the manifest. The text above now carries 1.4.
- The transfer refused the reviewer key `ar2` after ADR-044 had reserved agent keys for human sessions. The governed transfer now runs as an agent session.
- The harm-type rule needs an anchor that separates the work's own argument from lists of cited cases, a statement that differences in tone are no `Disparate_Performance`, and a decision on allocative disparities that a work does not classify as direct or indirect.
- `AN_Gender_Understanding` leaves the pair `Binary_Categorical` with `Intersectional` and the threshold for `Social_Construct` open. `AN_Theory_Reference` needs a line between a framing concept and an illustrative mention. `AN_Bias_Definition` could be tied to the `Bias_Ungleichheit` category so that `Not_Applicable` becomes checkable.
- Whether researchers screening case notes is `Documentation_Recording` remains open for `AN_Task`. The self-help chatbot work was coded consistently as client communication by both tracks.
- The Soziale_Arbeit target-group clause carried the Include of a mental-health chatbot study that never names social work, and a practice guide passed the publication-type rule as scholarly grey literature. Both go to the domain experts with the spot-check sample.

### Coding run of 2 October 2026

The runs `codebook-v141-includes-<batch>-<works>-20261002` coded under codebook 1.4.1 every effective Include with a full text of its preferred Version that carried no 1.4 coding, together with the ten pilot works, which were recoded because the harm-type and `Social_Construct` rules changed after the pilot. The operator chose Claude Code subagents on Claude Opus 5.5 for both tracks and the review (decision 10). `src.assess.prepare_coding_run` writes each manifest from the run template, `src.assess.complete_coding_run` performs packet transfer, review completion, the spot-check draw and the append-only integration into `docs/data/screening/ar2.json`, and `src.assess.review_integrated_records` lets a separate agent issue the record receipts that the completion package requires for every productive record. Reviewer prompt 1.4 names codebook 1.4.1, the AI Agent Review prompt 0.4 stays in force. Each run folder holds its manifest, packets, PRISM tracks, reports, review, track agreement, spot-check sample and products.

The run exposed the following points.

- Agent tracks derived Unclear or Exclude for part of the human Includes, mostly AI-literacy frameworks, reviews and practice texts whose social dimension stays secondary. The completion package records each as `human_agent_decision_divergence`, the human decision stays effective, and the work carries no analysis coding until the domain experts decide. Every such work stands in the spot-check sample of its run.
- The open questions of the pilot recurred across runs. They concern allocative disparities a work does not classify as direct or indirect, the pair `Binary_Categorical` with `Intersectional`, the threshold of `Social_Construct`, the line between a framing concept and a theory reference, `AN_Task` values for school education and artistic practice, and the separation of `Gender` and `Sexual_Orientation_Identity` for trans and non-binary groups. They wait for a rule revision under [[#Validation of the AI coding]].
- The tracks reported source and identity problems, among them two Works bound to one text (`UFJ7ERFF`, `GP4JDSI8`), a published and an extended version under separate Works (`7W3RGSSG`, `ACDF4FL9`), title variants (`DUV4TUG3`, `LBLF9BCW`) and works with doubtful reference lists or data reporting (`PAZJHB8J`, `SS5HTYY6`, `5G2QTZYD`, `79TL6HSB`). The flags stand in the spot-check samples.
- The anchor work `7L93JBLR` of [[codebook-v1.4-proposal]] was coded by the run it anchors.
- The first manifests listed records of other Versions of the same Work as aliases, and agent-written files carried CRLF line endings under hashes that an LF checkout would break. Both were corrected before the commit and recorded in the affected manifests, and the scripts now prevent them.

The works coded under 1.3 still awaited their recode after these runs, because the merge refused a divergent record and the lifecycle had no agent annotation that supersedes another. ADR-046 added that contract as a full recode ([[#Recoding and coding of the remaining Includes]]).

### Recode runs of 2 October 2026

The runs `codebook-v141-recode-<batch>-6-20261002` recoded under ADR-046 the included works whose productive agent coding followed codebook 1.3, by the same procedure as the coding run, with `recode_of` binding each existing record. The new annotation supersedes the 1.3 annotation, which stays in the record history, and the earlier AI source-review and correction receipts of those records are withheld until the fresh record receipts. Three works stayed outside. One has its text only on a non-preferred Version, one is effectively excluded, and the coding of the preferred Version of a third was reviewed but held out of integration, because its Work keeps 1.3 coding on a record of another Version and two codings of one Work would conflict. That case waits for the operator's Version-binding decision, and `prepare_coding_run` now refuses a Work whose agent coding sits on another Version. The recode turned some former agent Includes into Unclear, which the completion package records as human and agent decision divergences.

## Lifecycle and authority

The ordered states are `identified → curated → agent-annotated → ai-agent-reviewed → verified → publication-approved`.

Deterministic checks bind to the exact annotation ID and content hash. They record structural and rule conformance. A domain expert later records `accepted`, `corrected_and_accepted`, `changes_requested`, or `rejected` for every intended productive record. Accepted outcomes establish `verified`. Corrections append a complete person-attributed annotation with field-level differences and `supersedes`. Publication approval requires a later person-attributed event.

A governed agent recode appends a complete `ai_agent_recode` annotation with `supersedes`, the hash of the replaced record, the codebook version and its reason, together with an `ai_agent_recode` event of the new run's AI Agent Review that keeps the record at `ai-agent-reviewed` (ADR-046). It is open only to a record at `ai-agent-reviewed` without a domain-expert verification or publication-approval event. An AI source-review receipt of the replaced record no longer counts for the recoded record, which needs a fresh receipt from `src.assess.review_integrated_records`.

Internal topic modelling, descriptive analysis, Assertion generation, and report drafting may use `ai-agent-reviewed` data when every derived artifact retains the supporting lifecycle state. Final scholarly literature claims require domain-expert verification. The operator's separately dated preliminary-release permission in `config/publication_policy.json` allows explicitly labelled, currently source-reviewed AI projections under the artifact and source integrity gates in [[governance#Publication boundary]]. It does not establish human verification or final scholarly publication approval.

## Process diagnostics

`src/assess/agent_track_diagnostics.py` derives diagnostics from the stored tracks and lifecycle events and writes them into the completion package ([[methods#Descriptive mapping and process diagnostics]]).

- decision, category, and analysis-field differences between agent tracks
- source-grounding corrections introduced during AI Agent Review
- blocked records grouped by source, identity, evidence, or analysis reason
- lifecycle distributions across the governed corpus
- source-basis distributions used for annotation and analysis

In the pooled runs the two tracks agree on the decisions and differ most often on harm types, bias axes and mitigation stages. The generated diagnostics hold the current values. Round-one expert and LLM divergence remains a separate comparative analysis governed by [[analysis-divergence]].

## Roles

| Role | Responsibility |
|---|---|
| Review lead | Research design, domain verification, interpretation, publication decision |
| Reviewing domain expert | Screening without AI pre-assessment, spot check of the AI analysis coding, domain verification and correction |
| Technical and methodological lead | Run orchestration, deterministic integration, analysis generation |
| Research assistant | Zotero curation, metadata correction, source management |
| AI screening agent | Source-grounded annotation and the only analysis coding |
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
| 2026-09-05 | Original visual reading assets | Allowed optional hash-bound, attributed CC BY 4.0 PNG representations alongside the exact Paper text; assigned reviewers must read every declared asset. Text quotation requirements, decision criteria and scholarly authority remain unchanged. Updated prompt versions repair section references and document the existing AI-review output schema. |
| 2026-10-01 | Research questions | Made the substantive question primary and reformulated the sub-questions as SQ1 to SQ4 ([[project#Research questions]]). The coding vocabulary and the eligibility rule remain unchanged. A codebook amendment v1.4 was proposed at this step and adopted later the same day (row Codebook 1.4 and harness runs). |
| 2026-10-01 | Research questions | Merged grant questions, team-meeting grid and reformulation into SQ1 to SQ5. SQ4 Competences became SQ5, SQ4 Conceptual grounding is new and has no field under version 1.3. The `serves` entries follow the new numbering, and the vocabulary is unchanged. |
| 2026-10-01 | Codebook 1.4 and harness runs | Adopted codebook 1.4 with the SQ4 fields, the pilot field `AN_Task`, sharpened rules for bias axes and harm types and the recorded codebook version per annotation, and deferred `AN_Stage_Status`. Analysis fields are coded by AI agent tracks only. The run became harness-agnostic under run schema 1.4 with per-track execution environments. Track agreement and a human spot check replace the human pilot. Eligibility and decision rule unchanged. |
| 2026-10-01 | Codebook 1.4.1 | Clarified three rules after the pilot run of 1 October 2026, in which `AN_Harm_Types` showed the lowest track agreement. A harm type is coded only when the work's own argument or result establishes it, not when the work cites it from other work. A difference in tone or style of model output is not by itself `Disparate_Performance`. `Social_Construct` in `AN_Gender_Understanding` requires an explicit statement in the work. Values, fields, pairing rules, eligibility and decision rule are unchanged, and annotations record 1.4.1 as their codebook version. The pilot run keeps its record under 1.4. The amendment was first applied provisionally and was accepted by the operator on 1 October 2026 ([[plan#Decisions taken]]). |

Detailed execution evidence remains in run manifests, the prompt changelog, `corpus/deep-research/round2/LAUFPROTOKOLL.md`, [[journal]], and ADR-026 through ADR-037 in [[specification]].
