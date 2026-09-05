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
updated: 2026-09-05
authors: [Christopher Pollin]
generated-with: Claude Code, Codex (GPT-6)
related: [project, methods, specification, data, standards, governance, testing, verification, plan, journal, handoff, update-protocol, research-vault, analysis-divergence, analysis-sq-advisory]
---

This is the knowledge base of FemPrompt SozArb, a qualitative literature review on feminist AI literacy and LLM bias in social work. It documents both review rounds, the comparative round-one benchmark, the agent-assisted round-two workflow, PRISM, and the Grounded Vault. PRISM is the governed screening and verification surface. Concrete numbers live in `generated/benchmark-results/`, `docs/data/`, and their generated views. This index identifies the canonical documents and defines the terms that connect them.

## Documents

In function order, not alphabetical.

| Document | Function | Update rhythm |
|---|---|---|
| [[project]] | Identity: goals, research questions, team, and the theoretical framework | rarely |
| [[methods]] | How the review was conducted, from identification and text preparation through both assessment rounds, lifecycle verification, the Grounded Vault, and replay verification | rarely |
| [[specification]] | The PRISM tool at one place: requirements, user stories, the ADR decision log, and the design system | per tool iteration |
| [[data]] | The data substrate the PRISM tool consumes and produces | per schema change |
| [[standards]] | The reporting standards implemented (PRISMA 2020, PRISMA-trAIce, RAISE), and this review's conformance state against them | rarely |
| [[governance]] | Authority, lifecycle, correction, provenance, and publication rules for people, AI agents, and software agents | per governance decision |
| [[testing]] | Technical guarantees, test layers, commands, and the manual acceptance boundary | per test-contract change |
| [[verification]] | Evidence and authority state of externally relevant claims and research artifacts | per verification event |
| [[plan]] | Remaining work, completion criteria, and the operator decisions that still affect the result | per material change |
| [[journal]] | Genesis: the chronological session log with decisions and learnings | per session |
| [[handoff]] | Open, source-bound handoff items awaiting integration or rejection | per handoff |
| [[update-protocol]] | The round-2 pre-registration, the analysis-field design, the pilot findings, the coding procedure, and the RIS procedure | until round 2 starts |
| [[analysis-divergence]] | The licensed round-1 divergence analysis the follow-up paper's empirical section cites, decomposed and read off named replay keys | per replay change |
| [[analysis-sq-advisory]] | The advisory SQ1 to SQ3 interpretation that will be replaced by governed full-corpus analysis and domain-expert verification | per coding run |
| [[research-vault]] | The Grounded-Vault layer model and the distillate audit as its migration precondition | until the research-vault is grounded |
| [[guides/manual-review-checklist]] | The human-in-the-loop markdown review checklist | rarely |

## Reading paths

- Onboarding a new collaborator: [[project]], [[methods]], [[specification]]. The reviewing colleagues use `docs/onboarding.html` instead; nothing on their path requires this knowledge base.
- Describe the method in the follow-up paper: [[methods]] (the chain and the depth, including the replay verification), [[standards]] (the conformance state and the named gaps).
- Prepare the qualitative coding: [[update-protocol]] (fields, pilot findings, and coding procedure).
- Inspect the benchmark: the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion; the committed replay (`src/replay/`) re-derives and asserts the figures, described in [[methods]].
- Understand a tool decision: [[specification]] (the Entscheidungen / ADR section and the design system), [[journal]].
- Understand the divergence (the motivating illustration and demonstration): [[methods]], [[analysis-divergence]].
- Evaluate conformance: [[standards]] (the criterion and the per-item status; the machine-readable item status in `generated/conformance/conformance_map.yaml`).
- Understand authority and publication boundaries: [[governance]], [[verification]].
- Reproduce a technical guarantee: [[testing]], followed by the applicable command or test artifact.
- Prepare the literature update: [[plan]] (source and corpus readiness), [[update-protocol]], [[standards]].
- Prepare the follow-up paper's synthesis: [[analysis-divergence]] (section 5), [[analysis-sq-advisory]] (section 6, advisory).
- Understand the research-vault: [[research-vault]] (the layer model and the audit precondition), `research-vault/README.md` (the built skeleton and its status).

## Convention

This knowledge base follows the convention for Promptotyping documents. It fixes the frontmatter schema (the Pflichtkern `title, project, method, status, created, updated`, with `version` shared repo-wide), the reading heuristic by function, and the structure principles every document is read against. The convention also forbids volatile quantities in the prose, which is why the numbers live in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion, not here.

These documents describe the result and the decisions behind it, not how an agent session was organised. Lane, persona, and mission-control framing therefore stays out of the prose, while the content of an operator decision and its date remain recorded.

Frontmatter such as `status: complete` describes the documentation artifact. It does not declare that the literature review, source coverage, distillation or manuscript is complete. Use the [completion package](../generated/completion/README.md), the [released Assertion index](../docs/data/assertion_index.json) and [[verification]] for those states. Dated ADRs and journal entries preserve their historical decisions; current publication rules are in [[governance#Publication boundary]].

## Glossary

The project-constitutive terms, alphabetical. Sibling documents use these terms; this is where they are defined.

### Assertion
An atomic, evidence-linked statement in the Grounded Vault. An Assertion cites identified statements in one or more distilled knowledge documents and may support the literature report, the paper, or both. Its status records how far the evidence chain has been checked.

### Beleg
A pinned passage in PRISM, stored with term, surrounding snippet, timestamp, source layer, and actor. A pin from the Paper layer starts an empty category at `teilweise`; the reviewer decides whether the aspect is central enough for `ja`. A pin from the LLM-Wissensdestillat remains advisory and cannot satisfy the Paper-evidence gate. The legacy `origin` field is retained only for compatibility; `source_layer` and `actor` carry the current provenance.

### Confabulation
The generation of coherent but factually unsupported claims without internal verification. Preferred over "hallucination" because it names the generative mechanism rather than a sensory metaphor.

### Conformance by construction
The property that the screening record satisfies a reporting standard (PRISMA-trAIce R1, the AI-versus-human split; the disclosure) because the data model records AI and human decisions as separate first-class records, so the conformant artifacts fall out of the data rather than being written after the fact. The defensible novelty claim of the tool.

### Context rot
The degradation of an LLM's processing quality as the input grows longer (Hong et al. 2025). The motivation for the distillation pipeline, which shortens full texts into knowledge documents before assessment.

### Deep Research
Agent-based LLM systems for iterative, autonomous literature search with cited synthesis. Four were used for identification (ChatGPT, Claude, Gemini, Perplexity).

### Distilled knowledge document
A structured, source-specific reduction of a full text. It records metadata, method, central findings, relevant arguments, and traceable source anchors. Distillation reduces the working context while retaining a route back to the full text. Historical generated documents are an archive of this transformation; only explicitly checked active distillates support the current Assertion chain. A document's existence, a corpus link, and an accepted source review are separate states; [[research-vault]] defines the coverage boundary.

### Divergence
A disagreement between the human and the LLM assessment of a paper, on the decision or on a category. The motivating illustration for the infrastructure; classified into three patterns (Semantic Expansion, Implicit Field Membership, Keyword Inclusion). Divergence is reported as divergence, never as an error rate, because the human track has no independent inter-human baseline. The figures and the decomposition live in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion.

### Final scholarly authority
The responsibility assigned to the domain experts for verification, scholarly interpretation, and publication approval. AI-agent annotations and AI Agent Reviews can prepare the complete corpus, but they cannot confer this authority.

### Grounded Vault
The evidence structure `sources → Markdown → distilled knowledge documents → Assertions → outputs`. Every report or paper statement that uses the structure remains traceable through the adjacent layers to its source.

### Operational isolation
The separation of AI-agent runs by context, reviewer identity, input assignment, and output path. It limits direct cross-track contamination and makes execution conditions auditable. It does not establish epistemic independence between language models.

### Publication approval
The person-attributed lifecycle transition from `verified` to `publication-approved`. It governs final scholarly release. The operator separately authorised a labelled preliminary AI-source-reviewed projection under `config/publication_policy.json`; this does not create a human approval event. [[governance#Publication boundary]] defines the two release bases.

### Publication version
A separately addressable expression of one scholarly work, such as an author original, Preprint, Accepted Manuscript, proof, Version of Record, or corrected Version of Record. Its publication stage, date, identifiers, access state, integrity state, and peer-review status are recorded independently. Publication stage is descriptive metadata and does not establish scholarly quality.

### Round-1 dual assessment track
The comparative arrangement used in the first review round. A consolidated expert annotation and an LLM assessment applied the same ten-category schema without access to each other's judgements. The two records remain separate so their divergence can be analysed. This term describes round 1 and does not name the round-2 completion workflow.

### Screening lifecycle
The ordered record states `identified → curated → agent-annotated → ai-agent-reviewed → verified → publication-approved`. Every transition is an event with a timestamp, activity, and actor reference. The state therefore reports achieved review authority rather than the mere existence of a file.

### Source-grounded AI Agent Review
A separate AI-agent activity that checks screening annotations and evidence against the assigned Paper source. It can advance an agent annotation to `ai-agent-reviewed`. It cannot produce domain-expert verification or publication approval.

### Validation
A deterministic script or schema check of an artifact against explicit structural, referential, or rule-based requirements. Its result is recorded under `checks` with tool, timestamp, subject hash, and status. Validation does not advance the scholarly lifecycle and does not establish the correctness of an interpretation.

### Epistemic asymmetry
A division of labour in which the agents process knowledge in fundamentally different ways and neither can fully evaluate the other's epistemic contribution. Reciprocal and context-dependent; managed through workflow design, not resolved.

### Epistemic infrastructure
The totality of procedures, documentation structures, distinct control points, and responsibility assignments that make LLM contributions in research verifiable, traceable, and accountable. The project's guiding concept. Core principle: reliability is not a property of the system to be presupposed but a property of the process to be established.

### Evidence Companion
The working research application under `docs/` renders corpus metadata, the historical benchmark and legacy knowledge archive alongside productive research projections. Its grounded chat retrieves only released Assertions and their exact evidence, not the entire archive. The separately generated result site under `build/site/` contains the allowlisted source-reviewed subset and matching download. A local build does not establish what is currently deployed at the GitHub Pages address.

### Jagged frontier
The uneven competence distribution of AI systems, strong on some tasks and weak on adjacent ones (Mollick). In this project, the LLM scores high agreement on explicit categories (Soziale_Arbeit, Feministisch) and low on interpretive ones (Gender).

### PRISM and PRISMA
PRISMA (with the final A) is the reporting standard (see [[standards]]). PRISM is this project's screening tool (`docs/prisma.html`). They are not the same; the names are kept distinct deliberately.

### Replay (round 1)
The committed script `src/replay/replay_round1.py` that re-derives the retrospective PRISMA flow and the agreement figures from the raw assessment CSVs, pairing by Zotero_Key, and reproduces the canonical benchmark file as a self-test before writing its outputs (`generated/benchmark-results/replay/`). The mechanism that lets count-bearing claims be asserted by script, superseding every hand recount; R4 builds the record from its outputs.

### Sycophancy
The documented tendency of LLMs to over-agree with a prompt's presuppositions. Countered in the assessment prompts by negative constraints and calibration items.

### Verification
The documented domain-expert assessment of an annotation, Assertion, or output against its evidence and scholarly meaning. Deterministic validation and source-grounded AI Agent Review are separate controls with lower authority.

### Work and Work-Version Registry
A Work is the stable project identity for one intellectual publication, independent of the expressions through which it is available. `corpus/work_version_registry.json` assigns a stable `work_id`, separate `version_id` values, exact record bindings, relations between versions, and distinct preferred and latest versions. Screening coverage is evaluated at Work level; evidence, full text, distillates, and Assertions retain the exact Version used.
