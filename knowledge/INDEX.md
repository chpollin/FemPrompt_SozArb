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
updated: 2026-06-29
authors: [Christopher Pollin]
generated-with: Claude Code
related: [project, methods, specification, data, design, plan, journal, verification, standards, update-protocol]
---

This is the knowledge base of FemPrompt SozArb, a systematic literature review on feminist AI literacy and LLM bias in social work and the epistemic infrastructure built around it. It documents the conducted review and its benchmark, the PRISM screening tool, which is the binding screening surface the review is carried through (ADR-019), and the plan for the literature update. Concrete numbers do not live here: the benchmark figures live in `benchmark/results/` and in [[verification]], the corpus and screening data in `docs/data/` and `benchmark/data/`, and the Evidence Companion (https://chpollin.github.io/FemPrompt_SozArb/) renders them. This index shows where each piece of knowledge lives, in what order to read, and what the constitutive terms mean.

## Documents

In function order, not alphabetical.

| Document | Function | Update rhythm |
|---|---|---|
| [[project]] | Identity: goals, research questions, team, and the theoretical framework | rarely |
| [[methods]] | How the review was conducted: PRISMA deviation, dual assessment, the distillation pipeline | rarely |
| [[specification]] | Substance of the PRISM tool: requirements, user stories, and the ADR decision log | per tool iteration |
| [[data]] | The data substrate the PRISM tool consumes and produces | per schema change |
| [[design]] | UI and design system of the PRISM tool | per design iteration |
| [[plan]] | Forward steering: the staged roadmap, current status, and simulated decisions | per phase |
| [[refactor-frontend]] | Phased plan for refactoring the `docs/` frontend: verified findings across HTML, CSS, and JS with per-item acceptance checks | until executed |
| [[journal]] | Genesis: the chronological session log with decisions and learnings | per session |
| [[verification]] | Audit and the numbers home: the empirical recompute and divergence finding, PRISMA/trAIce conformance with the round-1 record carried through PRISM and novelty survey, paper versus repository | when a claim is re-verified |
| [[standards]] | The reporting standards implemented: PRISMA 2020, PRISMA-trAIce, RAISE | rarely |
| [[update-protocol]] | The round-2 pre-registration protocol, the analysis-field design, the RIS procedure | until round 2 starts |
| [[guides/manual-review-checklist]] | The human-in-the-loop markdown review checklist | rarely |

## Reading paths

- Onboarding a new collaborator: [[project]], [[methods]], [[specification]].
- Reproduce the benchmark: [[verification]], then run `benchmark/scripts/replay_selftest.py`.
- Understand a tool decision: [[specification]] (the Entscheidungen / ADR section), [[journal]], [[design]].
- Understand the divergence finding: [[verification]] (part 1).
- Prepare the literature update: [[plan]] (Stage B), [[update-protocol]], [[standards]].

## Convention

This knowledge base follows the convention for Promptotyping documents. It fixes the frontmatter schema (the Pflichtkern `title, project, method, status, created, updated`, with `version` shared repo-wide), the reading heuristic by function, and the structure principles every document is read against. The convention also forbids volatile quantities in the prose, which is why the numbers live in the data and in [[verification]], not here.

## Glossary

The project-constitutive terms, alphabetical. Sibling documents use these terms; this is where they are defined.

### Beleg
A pinned piece of evidence in the PRISM tool: a search hit or selected passage attached to a category, stored with its term, surrounding snippet, timestamp, and an origin (human or AI). A human-sourced Beleg sets the category and is binding; a machine-sourced Beleg is advisory and never sets a category.

### Confabulation
The generation of coherent but factually unsupported claims without internal verification. Preferred over "hallucination" because it names the generative mechanism rather than a sensory metaphor.

### Conformance by construction
The property that the screening record satisfies a reporting standard (PRISMA-trAIce R1, the AI-versus-human split; the disclosure) because the data model records AI and human decisions as separate first-class records, so the conformant artifacts fall out of the data rather than being written after the fact. The defensible novelty claim of the tool, see [[verification]].

### Context rot
The degradation of an LLM's processing quality as the input grows longer (Hong et al. 2025). The motivation for the distillation pipeline, which shortens full texts into knowledge documents before assessment.

### Deep Research
Agent-based LLM systems for iterative, autonomous literature search with cited synthesis. Four were used for identification (ChatGPT, Claude, Gemini, Perplexity).

### Distillation pipeline (Structured Knowledge Extraction, SKE)
The three-stage extraction of full texts into knowledge documents: an LLM extracts and classifies (stage 1), deterministic software formats (stage 2, no LLM), and an LLM verifies against the original (stage 3). The deterministic middle stage and the verification stage are the epistemic-infrastructure measures against unsecured LLM output.

### Divergence
A disagreement between the human and the LLM assessment of a paper, on the decision or on a category. The project's empirical core; classified into three patterns (Semantic Expansion, Implicit Field Membership, Keyword Inclusion). Divergence is reported as divergence, never as an error rate, because the human track has no independent inter-human baseline. The figures and the decomposition are in [[verification]].

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

### Responsibility asymmetry
Responsibility for all results remains with the researchers even when LLMs provide epistemically relevant contributions. The expert track is the epistemically binding reference track because accountability resides only there.

### Sycophancy
The documented tendency of LLMs to over-agree with a prompt's presuppositions. Countered in the assessment prompts by negative constraints and calibration items.

### Verification checkpoint
A defined point in the workflow where human or rule-based control checks AI-generated results before they flow into the next stage. The operative design principle of the epistemic infrastructure.

## What is missing and why

- No `architecture.md`. The tool is a static vanilla-JS page with no backend; its construction is covered by [[specification]], [[data]], and [[design]], and the research pipeline by [[methods]].
- No `testing.md`. The tool's behaviour tests live in `tests/` (a zero-dependency jsdom harness) and the empirical and conformance audits in [[verification]].
- No `report.md` (a status report for an external recipient). The current state lives in [[plan]] and this index; a formal external report is deferred to the FFG report and the follow-up paper.
- No numbers in the prose. Volatile quantities live in `benchmark/results/`, `docs/data/`, the Evidence Companion, and [[verification]], by convention.
