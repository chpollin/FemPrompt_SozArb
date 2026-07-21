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
version: "0.2"
created: 2026-06-29
updated: 2026-07-21
authors: [Christopher Pollin]
generated-with: Claude Code
related: [project, methods, specification, data, design, plan, journal, standards, conformance-map, update-protocol, analysis-divergence, analysis-sq-advisory]
---

This is the knowledge base of FemPrompt SozArb, a systematic literature review on feminist AI literacy and LLM bias in social work and the epistemic infrastructure built around it. It documents the conducted review and its benchmark, the PRISM screening tool, which is the binding screening surface the review is carried through (ADR-019), and the plan for the literature update. Concrete numbers do not live here. The benchmark figures live in the data (`generated/benchmark-results/`, `docs/data/`), the corpus and screening data in `docs/data/` and `assessment/`, and the Evidence Companion (https://chpollin.github.io/FemPrompt_SozArb/) renders them. This index shows where each piece of knowledge lives, in what order to read, and what the constitutive terms mean.

## Documents

In function order, not alphabetical.

| Document | Function | Update rhythm |
|---|---|---|
| [[project]] | Identity: goals, research questions, team, and the theoretical framework | rarely |
| [[methods]] | How the review was conducted: PRISMA deviation, dual assessment, the distillation pipeline | rarely |
| [[specification]] | Substance of the PRISM tool: requirements, user stories, and the ADR decision log | per tool iteration |
| [[data]] | The data substrate the PRISM tool consumes and produces | per schema change |
| [[design]] | UI and design system of the PRISM tool | per design iteration |
| [[plan]] | Forward steering: the staged roadmap, current status, and the decided questions | per phase |
| [[journal]] | Genesis: the chronological session log with decisions and learnings | per session |
| [[standards]] | The reporting standards implemented: PRISMA 2020, PRISMA-trAIce, RAISE | rarely |
| [[conformance-map]] | Per-item conformance of this review against PRISMA 2020 and trAIce, with source paths and named gaps (R1) | per Stage R step |
| [[update-protocol]] | The round-2 pre-registration protocol, the analysis-field design, the RIS procedure | until round 2 starts |
| [[analysis-divergence]] | The licensed round-1 divergence analysis the follow-up paper's empirical section cites, decomposed and read off named replay keys | per replay change |
| [[analysis-sq-advisory]] | The advisory, unreviewed SQ1 to SQ3 coding (TP4) feeding the paper's synthesis, pending human confirmation | per coding run |
| [[guides/manual-review-checklist]] | The human-in-the-loop markdown review checklist | rarely |

## Reading paths

- Onboarding a new collaborator: [[project]], [[methods]], [[specification]]. The reviewing colleagues use `docs/onboarding.html` instead; nothing on their path requires this knowledge base.
- Inspect the benchmark: the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion; the committed replay (`src/replay/`) re-derives and asserts the figures.
- Understand a tool decision: [[specification]] (the Entscheidungen / ADR section), [[journal]], [[design]].
- Understand the divergence (the motivating illustration and demonstration): [[methods]], [[analysis-divergence]].
- Evaluate conformance: [[standards]] (the criterion), [[conformance-map]] (this review's per-item status).
- Prepare the literature update: [[plan]] (Stage B), [[update-protocol]], [[standards]].
- Prepare the follow-up paper's synthesis: [[analysis-divergence]] (section 5), [[analysis-sq-advisory]] (section 6, advisory).

## Convention

This knowledge base follows the convention for Promptotyping documents. It fixes the frontmatter schema (the Pflichtkern `title, project, method, status, created, updated`, with `version` shared repo-wide), the reading heuristic by function, and the structure principles every document is read against. The convention also forbids volatile quantities in the prose, which is why the numbers live in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion, not here.

## Glossary

The project-constitutive terms, alphabetical. Sibling documents use these terms; this is where they are defined.

### Beleg
A pinned piece of evidence in the PRISM tool: a search hit or selected passage attached to a category, stored with its term, surrounding snippet, timestamp, and an origin (human or AI). A human-sourced Beleg sets the category and is binding; a machine-sourced Beleg is advisory and never sets a category.

### Confabulation
The generation of coherent but factually unsupported claims without internal verification. Preferred over "hallucination" because it names the generative mechanism rather than a sensory metaphor.

### Conformance by construction
The property that the screening record satisfies a reporting standard (PRISMA-trAIce R1, the AI-versus-human split; the disclosure) because the data model records AI and human decisions as separate first-class records, so the conformant artifacts fall out of the data rather than being written after the fact. The defensible novelty claim of the tool.

### Context rot
The degradation of an LLM's processing quality as the input grows longer (Hong et al. 2025). The motivation for the distillation pipeline, which shortens full texts into knowledge documents before assessment.

### Deep Research
Agent-based LLM systems for iterative, autonomous literature search with cited synthesis. Four were used for identification (ChatGPT, Claude, Gemini, Perplexity).

### Distillation pipeline (Structured Knowledge Extraction, SKE)
The three-stage extraction of full texts into knowledge documents: an LLM extracts and classifies (stage 1), deterministic software formats (stage 2, no LLM), and an LLM verifies against the original (stage 3). The deterministic middle stage and the verification stage are the epistemic-infrastructure measures against unsecured LLM output.

### Divergence
A disagreement between the human and the LLM assessment of a paper, on the decision or on a category. The motivating illustration for the infrastructure; classified into three patterns (Semantic Expansion, Implicit Field Membership, Keyword Inclusion). Divergence is reported as divergence, never as an error rate, because the human track has no independent inter-human baseline. The figures and the decomposition live in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion.

### Dual assessment track
The parallel, independent arrangement of an expert track and an LLM track on the same ten-category schema, without mutual knowledge. The methodological centerpiece, designed so the comparison reveals where the two epistemic foundations converge and diverge.

### Epistemic asymmetry
A division of labour in which the agents process knowledge in fundamentally different ways and neither can fully evaluate the other's epistemic contribution. Reciprocal and context-dependent; managed through workflow design, not resolved.

### Epistemic infrastructure
The totality of procedures, documentation structures, verification checkpoints, and responsibility assignments that make LLM contributions in research verifiable, traceable, and accountable. The project's guiding concept. Core principle: reliability is not a property of the system to be presupposed but a property of the process to be established.

### Evidence Companion
The web-based academic companion publication at https://chpollin.github.io/FemPrompt_SozArb/. Four views (Knowledge Chat, Knowledge Graph, Categories, Corpus) that render the corpus, the assessment, and the numbers from the data.

### Jagged frontier
The uneven competence distribution of AI systems, strong on some tasks and weak on adjacent ones (Mollick). In this project, the LLM scores high agreement on explicit categories (Soziale_Arbeit, Feministisch) and low on interpretive ones (Gender).

### Knowledge document
A structured summary of a study produced by the distillation pipeline: metadata, core finding, methodology, main arguments, category evidence, and a confidence score. The served reading text in the PRISM tool, distinct from the raw full text.

### PRISM and PRISMA
PRISMA (with the final A) is the reporting standard (see [[standards]]). PRISM is this project's screening tool (`docs/prisma.html`). They are not the same; the names are kept distinct deliberately.

### Replay (round 1)
The committed script `src/replay/replay_round1.py` that re-derives the retrospective PRISMA flow and the agreement figures from the raw assessment CSVs, pairing by Zotero_Key, and reproduces the canonical benchmark file as a self-test before writing its outputs (`generated/benchmark-results/replay/`). The mechanism that lets count-bearing claims be asserted by script, superseding every hand recount; R4 builds the record from its outputs.

### Responsibility asymmetry
Responsibility for all results remains with the researchers even when LLMs provide epistemically relevant contributions. The expert track is the epistemically binding reference track because accountability resides only there.

### Sycophancy
The documented tendency of LLMs to over-agree with a prompt's presuppositions. Countered in the assessment prompts by negative constraints and calibration items.

### Verification checkpoint
A defined point in the workflow where human or rule-based control checks AI-generated results before they flow into the next stage. The operative design principle of the epistemic infrastructure.

## What is missing and why

- No `architecture.md`. The tool is a static vanilla-JS page with no backend; its construction is covered by [[specification]], [[data]], and [[design]], and the research pipeline by [[methods]].
- No `testing.md`. The tool's behaviour tests live in `tests/` (a zero-dependency jsdom harness); the retrospective counts and agreement figures are asserted by the committed replay (`src/replay/`); the test responsibility matrix and the autonomous verification measures are in [[plan]].
- No `report.md` (a status report for an external recipient). The current state lives in [[plan]] and this index; a formal external report is deferred to the FFG report and the follow-up paper.
- No numbers in the prose. Volatile quantities live in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion, by convention.
