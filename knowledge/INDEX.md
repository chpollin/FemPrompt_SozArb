---
title: Index
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
template:
  name: Vorlage Index
  version: 0.1
  url: https://dhcraft.org/Promptotyping/promptotyping-document/index
  alias: https://dhcraft.org/Promptotyping/#promptotyping-document-index
status: complete
language: en
version: "0.7"
created: 2026-06-29
updated: 2026-10-01
authors: [Christopher Pollin]
generated-with: Claude Code (Claude Opus 5.5), Codex (GPT-6)
related: [project, analysis-methods, methods, specification, data, standards, governance, testing, verification, plan, journal, handoff, update-protocol, codebook-v1.4-proposal, research-vault, analysis-divergence, analysis-sq-advisory, project-review-2026-09-05]
---

FemPrompt SozArb is a qualitative literature review on how social work professionals can use large language models responsibly, with attention to bias, gender and the groups affected. The project also builds the epistemic infrastructure that makes its AI-assisted research traceable, with two review rounds, the comparative round-one benchmark, the agent-assisted round-two workflow, PRISM as the governed human screening surface, the Grounded Vault and the public Evidence Companion. Concrete numbers live in `generated/`, `docs/data/` and their generated views.

## Documents

In function order, not alphabetical.

| Document | Function | Update rhythm |
|---|---|---|
| [[project]] | Project goal, main question with five sub-questions, publication context and the methodological second question, audience, scope boundaries, team and theoretical framework | rarely |
| [[analysis-methods]] | The methodological basis of the literature analysis, with the mapping and synthesis frame, the answer plan per research question, the analysis tiers, statistical reservations, validation of LLM-assisted analysis, appraisal tools and open disputes | per method decision |
| [[methods]] | How the review was conducted, from identification and text preparation through both assessment rounds, lifecycle verification, the Grounded Vault, the descriptive mapping tools and replay verification | rarely |
| [[specification]] | Requirements, user stories, the ADR decision log and the design system of PRISM, and the specification of the public Evidence Companion | per tool iteration |
| [[data]] | The data substrate that PRISM and the Evidence Companion consume and produce, including the field-state and coverage contract | per schema change |
| [[standards]] | The reporting standards implemented (PRISMA 2020, PRISMA-trAIce, RAISE) and the review's conformance state against them | rarely |
| [[governance]] | Authority, lifecycle, correction, provenance, and publication rules for people, AI agents, and software agents | per governance decision |
| [[testing]] | Commands, test layers, technical guarantees, the independent acceptance review of the result site, the manual acceptance boundary, setup, local preview and deployment | per test-contract change |
| [[verification]] | Evidence and authority state of externally relevant claims and research artifacts | per verification event |
| [[plan]] | Remaining work towards the answers to the sub-questions, analysis tool and interface development, deployment, completion criteria, the open operator decisions with their status and the decisions taken | per material change |
| [[journal]] | The chronological session log with decisions and learnings | per session |
| [[handoff]] | Current state of `main`, continuation point for the next session on either machine, and checkout conditions | per session close |
| [[project-review-2026-09-05]] | Dated review of 2026-09-05 with the findings, the implemented remedies and the uses of the completed data | snapshot, not updated |
| [[update-protocol]] | The round-two pre-registration, the analysis-field design, the pilot findings, the coding procedure, the amendment record and the RIS procedure | per protocol amendment |
| [[codebook-v1.4-proposal]] | The draft codebook amendment v1.4 for the five sub-questions, with the UF4 and task fields, sharper bias and harm rules, stage-status pairs, the not-collected state, the recoding recommendation and the pilot protocol, awaiting the operator's decision | per amendment decision |
| [[analysis-divergence]] | The licensed round-one divergence analysis that the methodological part of the paper cites, decomposed and read off named replay keys | per replay change |
| [[analysis-sq-advisory]] | The advisory interpretation of the three earlier sub-questions with their placement in SQ1 to SQ5, to be replaced by governed full-corpus analysis and domain-expert verification | per coding run |
| [[research-vault]] | The Grounded-Vault layer model, its status vocabulary and the active evidence chain | per change of the evidence chain |
| [[guides/manual-review-checklist]] | The human-in-the-loop markdown review checklist | rarely |

## Reading paths

- Resume the work through [[handoff]] (current branch state and continuation point), [[plan]] (remaining work and open decisions) and the newest [[journal]] entry.
- Answer a sub-question through [[project#Research questions]], [[analysis-methods#Answering the research questions]] and [[plan#Answering the research questions]]. The [SQ1 chapter](../research-vault/40_output/literature-report/sq1-use.md) shows the answer form with coverage, Assertions and not determinable cells.
- Plan or run the literature analysis with [[analysis-methods]] for frame, tiers, statistical reservations and validation design, and [[methods#Descriptive mapping and process diagnostics]] for the implemented tools.
- Develop or review the public Evidence Companion through [[specification#Public Evidence Companion]], [[data#Analysis field states and coverage]], [[plan#UI development]] and [[testing#Independent acceptance review of the result site]]. Deployment follows [[plan#Deployment]].
- Prepare the qualitative coding with [[update-protocol]] for fields, pilot findings and coding procedure. A codebook amendment is an open decision in [[plan#Open decisions]].
- Implement target-level human verification through [[governance#Verification scope decision, 22 September 2026]] and [[plan#Provenance and verification alignment]]. The comparative analysis follows [[research-vault#Comparative synthesis scope]].
- Understand authority and publication boundaries through [[governance]] and [[verification]].
- Describe the method in the paper with [[methods]] for the chain, the depth and the replay verification, [[standards]] for the conformance state and [[analysis-divergence]] for the round-one divergence. The paper architecture after the priority change is open in [[plan#Open decisions]].
- Inspect the benchmark through the data in `generated/benchmark-results/` and `docs/data/`. The committed replay in `src/replay/` re-derives and asserts the figures, described in [[methods#Round-one replay verification]].
- Understand a tool decision through the ADR register and the design system in [[specification]] and the [[journal]].
- Evaluate conformance through [[standards]] and the machine-readable item status in `generated/conformance/conformance_map.yaml`.
- Prepare the literature update and source readiness through [[plan#Controlled corpus completion]], [[update-protocol]] and [[standards]]. `generated/literature-readiness.json` and its CSV projection, rebuilt by `npm run build`, distinguish live Zotero membership, reading material, knowledge-document authority and remaining preparation.
- Inspect retained local sources through [[data#Local source preservation]] and reproduce technical guarantees through [[testing]].
- Add missing prepared references to Zotero through [[governance#Authorised additive Zotero import]] for the write scope and [[methods#Zotero reconciliation and import]] for commands and receipts.
- Set up a clone through the README and [[testing#Clean-checkout verification]].
- Onboard a new collaborator through [[project]], [[methods]] and [[specification]]. The reviewing colleagues use `docs/help.html#prism`, and nothing on their path requires this knowledge base.

## Convention

This knowledge base follows the convention for Promptotyping documents. It fixes the frontmatter schema, with the required core `title, project, method, status, created, updated` and the shared repository-wide `version` held here, the reading heuristic by function and the structure principles every document is read against. Volatile quantities stay in the data (`generated/`, `docs/data/`) and the generated views.

The documents describe the result and the decisions behind it. The content of an operator decision and its date are recorded, while lane, persona and mission-control framing stays out of the prose. Third parties appear by role and institution, and corpus works are cited by author and year or by title and Zotero record key.

Frontmatter such as `status: complete` describes the documentation artifact. It does not declare that the literature review, source coverage, distillation or manuscript is complete. The [completion package](../generated/completion/README.md), the [released Assertion index](../docs/data/assertion_index.json) and [[verification]] carry those states. Dated ADRs and journal entries preserve their historical decisions and the figures recorded at their date. Current publication rules are in [[governance#Publication boundary]].

## Glossary

The project-constitutive terms, in alphabetical order.

### Analysis coverage
The Work-level partition of the intended Include scope for each analysis field, published as `meta.analysis_coverage`. The released states value, none, undecidable and absent and the unreleased states not coded and withheld, with a named withholding reason, together give every empty map cell its denominator. The object carries counts only and no content of unreleased Works. [[data#Analysis field states and coverage]] defines it.

### Assertion
An atomic, evidence-linked statement in the Grounded Vault. An Assertion cites identified statements in one or more distilled knowledge documents and may support the literature report, the paper, or both. Its status records how far the evidence chain has been checked.

### Bearbeiten and Lesen
The two modes of PRISM (ADR-042). `Lesen` shows every document with its current human annotation and writes nothing. `Bearbeiten` exists only in a local clone whose build created the full-text manifest, opened in a browser with File System Access, and saves into the reviewer's own file. Neither mode shows an AI pre-assessment (ADR-044).

### Beleg
A pinned passage in PRISM, stored with term, surrounding snippet, timestamp, source layer, and actor. A pin from the Paper layer starts an empty category at `teilweise`, and the reviewer decides whether the aspect is central enough for `ja`. A pin from the LLM-Wissensdestillat remains advisory and cannot satisfy the Paper-evidence gate. The legacy `origin` field is retained only for compatibility, while `source_layer` and `actor` carry the current provenance.

### Confabulation
The generation of coherent but factually unsupported claims without internal verification. Preferred over "hallucination" because it names the generative mechanism rather than a sensory metaphor.

### Conformance by construction
The property that the screening record satisfies a reporting standard, such as the AI-versus-human split and the disclosure of PRISMA-trAIce R1, because the data model records AI and human decisions as separate first-class records. The conformant artifacts therefore follow from the data rather than being written after the fact. This is the defensible novelty claim of the tool.

### Context rot
The degradation of an LLM's processing quality as the input grows longer (Hong et al. 2025). The motivation for the distillation pipeline, which shortens full texts into knowledge documents before assessment.

### Deep Research
Agent-based LLM systems for iterative, autonomous literature search with cited synthesis. Four were used for identification (ChatGPT, Claude, Gemini, Perplexity).

### Distilled knowledge document
A structured, source-specific reduction of a full text. It records metadata, method, central findings, relevant arguments, and traceable source anchors. Distillation reduces the working context while retaining a route back to the full text. Historical generated documents are an archive of this transformation, and only explicitly checked active distillates support the current Assertion chain. A document's existence, a corpus link, and an accepted source review are separate states, and [[research-vault]] defines the coverage boundary.

### Divergence
A disagreement between the human and the LLM assessment of a paper, on the decision or on a category. It is the motivating illustration for the infrastructure. The analysis distinguishes three patterns (Semantic Expansion, Implicit Field Membership, Keyword Inclusion), while the per-item classification has no committed source and is published as `null` ([[data#Historical concept graph and divergence classification]]). Divergence is reported as divergence, never as an error rate, because the human track has no independent inter-human baseline. The figures and the decomposition live in the data (`generated/benchmark-results/`, `docs/data/`).

### Epistemic asymmetry
A division of labour in which the agents process knowledge in fundamentally different ways and neither can fully evaluate the other's epistemic contribution. It is reciprocal and context-dependent and is managed through workflow design rather than resolved.

### Epistemic infrastructure
The totality of procedures, documentation structures, distinct control points, and responsibility assignments that make LLM contributions in research verifiable, traceable, and accountable. The project's guiding concept. Its core principle holds that reliability is not a property of the system to be presupposed but a property of the process to be established.

### Erfasst and offen
The two states of the PRISM status filter. A document is erfasst when it has an own record or a decision of the consolidated expert assessment, which counts as done. Every other document is offen, including one with only an agent record (ADR-042, ADR-044).

### Evidence Companion
The public Evidence Companion is the result site that `src/publish/build_release.py` builds from `docs/release.html` into `build/site/`. It presents the allowlisted, AI-source-reviewed subset along the main question and the sub-questions, with matrix, network, work, Assertion and method views, a grounded chat that retrieves only released Assertions and their evidence, and a matching download ([[specification#Public Evidence Companion]]). The internal working application `docs/index.html` renders corpus metadata, the historical benchmark and the legacy knowledge archive. It is meant to stay local but remains publicly reachable until Pages switches to the result site ([[plan#Deployment]]). It carried the name Evidence Companion earlier and keeps it in tests and data contracts such as `tests/companion.mjs` and the Companion records of [[data]]. A local build does not establish what is currently deployed at the GitHub Pages address.

### Evidence-and-gap map
A matrix that crosses two coded dimensions, such as bias axes with mitigation stage, and lists in each cell the Works coded jointly on both, together with the Works still open (Snilstveit et al. 2016). A cell shows where the coded literature addresses a combination and states no relation between the codes. [[analysis-methods#Mapping layer]] defines the form, `generated/completion/sq-association-tables.csv` holds the generated matrices, and the Matrix view of the Evidence Companion cross-tabulates the released records in the same form.

### Field state
The state of one analysis field in one released record, stored in `analysis.field_states` as value, none, undecidable or absent. The field-state report of the completion package extends the vocabulary for Works outside the release, such as hold, conflict and missing ([[methods#Descriptive mapping and process diagnostics]]). [[data#Analysis field states and coverage]] defines the released states.

### Final scholarly authority
The responsibility assigned to the domain experts for verification, scholarly interpretation, and publication approval. AI-agent annotations and AI Agent Reviews can prepare the complete corpus, but they cannot confer this authority.

### Grounded
The status of a Grounded-Vault artifact whose required references to the layer below resolve under the deterministic anchor and schema check. A grounded Assertion or chapter has received neither AI Agent Review nor domain-expert verification. [[research-vault#Status and checks]] defines the status vocabulary.

### Grounded Vault
The evidence structure `sources → Markdown → distilled knowledge documents → Assertions → outputs`. Every report or paper statement that uses the structure remains traceable through the adjacent layers to its source.

### Jagged frontier
The uneven competence distribution of AI systems, strong on some tasks and weak on adjacent ones (Mollick). In this project, the LLM scores high agreement on explicit categories (Soziale_Arbeit, Feministisch) and low on interpretive ones (Gender).

### Joint coding
The occurrence of two codes in the same Work, which every matrix cell and network edge counts. Joint coding states no relation, direction or effect between the codes, and the interface words it as "gemeinsam codiert in n Werken" ([[specification#Epistemic display rules]]).

### Kernbefund
The German term for the core finding of a distilled knowledge document. It is the heading at which the LLM-Wissensdestillat layer begins in PRISM, and it is used untranslated in code, data and prose.

### Neuzugänge 2026
The German term used in prose for the 2026 intake candidates. The data layer keeps `candidate` and `candidate_index` unchanged.

### Not determinable
The status of a map cell or statement for which included Works on its axes remain uncoded or unread. The interface shows it as "n. b.", and it never counts as a gap in the literature. Absence can be stated only after complete coding and then only for that coding. Not determinable differs from undecidable, the coder's declaration that a field cannot be decided from a source.

### Operational isolation
The separation of AI-agent runs by context, reviewer identity, input assignment, and output path. It limits direct cross-track contamination and makes execution conditions auditable. It does not establish epistemic independence between language models.

### PRISM and PRISMA
PRISMA (with the final A) is the reporting standard (see [[standards]]). PRISM is this project's screening tool (`docs/prisma.html`). The two names are kept distinct deliberately.

### Publication approval
The person-attributed lifecycle transition from `verified` to `publication-approved`. It governs final scholarly release. The operator separately authorised a labelled preliminary AI-source-reviewed projection under `config/publication_policy.json`, which does not create a human approval event. [[governance#Publication boundary]] defines the two release bases.

### Publication version
A separately addressable expression of one scholarly work, such as an author original, Preprint, Accepted Manuscript, proof, Version of Record, or corrected Version of Record. Its publication stage, date, identifiers, access state, integrity state, and peer-review status are recorded independently. Publication stage is descriptive metadata and does not establish scholarly quality.

### Replay (round 1)
The committed script `src/replay/replay_round1.py` that re-derives the retrospective PRISMA flow and the agreement figures from the raw assessment CSVs, pairing by Zotero_Key, and reproduces the canonical benchmark file as a self-test before writing its outputs (`generated/benchmark-results/replay/`). It lets count-bearing claims be asserted by script and supersedes every hand recount. R4 builds the record from its outputs.

### Round-1 dual assessment track
The comparative arrangement used in the first review round. A consolidated expert annotation and an LLM assessment applied the same ten-category schema without access to each other's judgements. The two records remain separate so their divergence can be analysed. This term describes round 1 and does not name the round-2 completion workflow.

### Screening lifecycle
The ordered record states `identified → curated → agent-annotated → ai-agent-reviewed → verified → publication-approved`. Every transition is an event with a timestamp, activity, and actor reference. The state therefore reports achieved review authority rather than the mere existence of a file.

### Source-grounded AI Agent Review
A separate AI-agent activity that checks screening annotations and evidence against the assigned Paper source. It can advance an agent annotation to `ai-agent-reviewed`. It cannot produce domain-expert verification or publication approval.

### Sub-questions SQ1 to SQ5
The five sub-questions of the main question, SQ1 Use, SQ2 Bias forms, SQ3 Handling of bias, SQ4 Conceptual grounding and SQ5 Competences, merged on 1 October 2026. They correspond to the German UF1 to UF5 of the interface and to the Assertion field `research-questions`. [[project#Research questions]] holds their wording.

### Sycophancy
The documented tendency of LLMs to over-agree with a prompt's presuppositions. Countered in the assessment prompts by negative constraints and calibration items.

### Validation
A deterministic script or schema check of an artifact against explicit structural, referential, or rule-based requirements. Its result is recorded under `checks` with tool, timestamp, subject hash, and status. Validation does not advance the scholarly lifecycle and does not establish the correctness of an interpretation.

### Verification
The documented domain-expert assessment of a named statement, field, annotation, Assertion, or output against its evidence and scholarly meaning. The accepted scope applies only to the checked content. [[governance#Verification scope decision, 22 September 2026]] distinguishes target-level verification from the current whole-record implementation. Deterministic validation and source-grounded AI Agent Review are separate controls with lower authority.

### Work and Work-Version Registry
A Work is the stable project identity for one intellectual publication, independent of the expressions through which it is available. `corpus/work_version_registry.json` assigns a stable `work_id`, separate `version_id` values, exact record bindings, relations between versions, and distinct preferred and latest versions. Screening coverage is evaluated at Work level, while evidence, full text, distillates, and Assertions retain the exact Version used.

### Zuteilung
The assignment of the open papers to the two reviewers in `docs/data/screening/assignment.json`, and the PRISM list filter of the same name (ADR-043). The file is append-only, so a done paper keeps its entry, and it is no reviewer file. [[data#Reviewer assignment]] defines it.
