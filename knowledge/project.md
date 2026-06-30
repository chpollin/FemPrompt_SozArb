---
title: Project
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: complete
language: en
version: "0.2"
created: 2026-02-21
updated: 2026-06-29
authors: [Christopher Pollin]
generated-with: Claude Code
topics: ["[[Epistemic Infrastructure]]", "[[Feminist AI]]"]
related: [INDEX, methods, standards, journal]
---

This is the identity of the project: what it is, why it exists, and the theory it stands on. FemPrompt SozArb is a systematic literature review on feminist AI literacy and LLM bias in social work, and an epistemic infrastructure built around it. Part of the Elisabeth List Fellowship project "Diversity-Sensitive Engagement with Artificial Intelligence" (University of Graz, 2025 to 2026). The constitutive terms are defined in [[INDEX]]; the conducted methods are in [[methods]]. The divergence between the LLM and expert tracks illustrates why the infrastructure is needed.

## Project goal

Primary goal: describe and operationalize an epistemic infrastructure for LLM-assisted literature reviews, using the case of a systematic review on feminist AI literacy and LLM bias in social work. Core question: what procedures, documentation structures, and workflow decisions are needed so that LLM contributions in research remain verifiable, traceable, and accountable?

Secondary goal (foundation): create a conceptual basis for a benchmark ("Fair Bench") for social work. The review identifies relevant terms, concepts, and discourse positions that can be transferred into test scenarios.

Working definition of feminist AI literacies: diversity-sensitive, intersectional, and bias-aware competencies that social work professionals need when engaging with generative AI, with a focus on prompting, critical output evaluation, and context and application sensitivity.

## Research questions

Main question: what epistemic infrastructure does an LLM-assisted literature review require to methodologically address the asymmetry between machine pattern recognition and expert judgment?

Content questions (secondary):

1. How does bias manifest context-dependently in frontier LLMs?
2. What prompting strategies enable discrimination-sensitive AI use?
3. How can social workers develop AI literacy that does justice to the system's complexity?

## Target audience

| Audience | Benefit |
|---|---|
| Researchers (social work and AI) | Structured literature overview, research gaps |
| Practitioners (social work) | Evidence base for LLM use in practice |
| Educators (AI literacy) | Course material, concepts, case studies |

Primary audience: researchers with limited AI expertise.

## Success criteria

| Criterion | Status |
|---|---|
| Workflow fully documented, repository auditable | Implemented |
| Epistemic infrastructure documented, prompts versioned | Implemented |
| Dual assessment track executed (human and LLM) | Complete |
| Benchmark metrics computed (confusion matrix, base rates, divergence analysis) | Complete |
| Distilled knowledge documents from full texts | Complete |
| Divergence analysis classified into patterns | Complete |
| Obsidian Vault, interlinked knowledge base | Complete |
| GitHub Pages documentation site | Complete (the Evidence Companion) |
| Open Access analysis of the corpus | Pending |

## Non-goals

| What is not part of the project | Why |
|---|---|
| A finished prompting guide | Planned for a subsequent phase |
| Empirical validation of prompting strategies | Out of scope |
| An end-user tool | The focus is research, not product |
| Full automation | Expert-in-the-loop remains central |
| Training custom models | Uses existing frontier LLMs |

## Two levels of the project

Level 2, methodological, the core contribution. What epistemic infrastructure does an LLM-assisted review require to address the asymmetry between machine pattern recognition and expert judgment? Output: the concept of epistemic infrastructure (four layers, below), the dual assessment track as its operationalization, the benchmark results as illustration that divergence is measurable and informationally productive, and a documented, reproducible workflow in the repository.

Level 1, substantive, the literature review as use case. What does the research say about LLM bias and feminist AI literacy? Output: a thematically categorized corpus under the ten binary categories, the distilled knowledge documents, the Obsidian vault, and the conceptual foundation for Fair Bench.

## Corpus

The corpus was identified via four proprietary Deep Research systems (ChatGPT, Claude, Gemini, Perplexity) plus a limited manual search, curated in a Zotero group. It is English and German, spanning the late 2010s to 2025, focused on feminist AI literacies, generative AI, prompting, and social work. The exact counts, the provider distribution, and the acquisition loss chain are derivations from the data and live in the files under `assessment/` and `corpus/`.

## Team

| Person | Role |
|---|---|
| Christopher Pollin | Technical infrastructure, pipeline |
| Susi Sackl-Sharif | Human assessment, research lead |
| Sabine Klinger | Human assessment |
| Christina | Zotero curation, metadata |

## Theoretical framework

### Epistemic asymmetry (the paper's guiding concept)

Epistemic asymmetry describes a division of labor in which the involved agents process knowledge in fundamentally different ways, where neither side can fully evaluate the epistemic contributions of the other. LLMs process large volumes of text and recognize patterns across hundreds of documents. Experts assess the epistemic quality of sources and recognize nuances visible only through domain knowledge. The asymmetry is reciprocal and context-dependent. It cannot be resolved with current systems but can be productively managed through workflow design (Mollick, Co-Intelligence).

Central thesis: the responsibility asymmetry binds the other dimensions. Without attributable responsibility, there is no agent capable of methodologically addressing opacity, access conditions, and competence differentials.

The asymmetry maps onto concrete risks and infrastructure measures:

| Asymmetry dimension | Risk | Infrastructure measure |
|---|---|---|
| Opacity (justificatory esotericism) | Unverifiable selection by Deep Research models | Multi-provider strategy plus selection logging |
| Unsecured LLM outputs | LLMs can generate factually unsupported claims | 3-stage SKE with deterministic stage 2 and a verification stage 3 |
| Sycophancy | Prompt-induced over-attribution of categories | Negative constraints in prompts, calibration items, prompt versioning |
| Paywall bias | Systematic underrepresentation of paywalled literature | Hierarchical acquisition strategy plus OA disclosure |
| Prompt competence | Result dependence on prompt quality | Prompt governance: versioning, review, documentation |
| Responsibility asymmetry | No attributable agent on the LLM side | Expert track as the epistemically binding reference track |
| Provider divergence | Different models yield different evidence bases | Multi-provider comparison, overlap analysis |
| Resource asymmetry | Unequal access to frontier models and infrastructure | Cost transparency, open-source pipeline where possible |

### Epistemic infrastructure

Epistemic infrastructure denotes the totality of procedures, documentation structures, institutional regulations, and community practices that ensure LLM contributions in research remain verifiable, traceable, and accountable.

Core principle: reliability cannot be presupposed as a property of the system but must be established as a property of the process.

Operative design principle (verification checkpoints): each AI-assisted work step is followed by a verification checkpoint, a defined point in the process where human or rule-based control checks the results.

Diagnostic function of LLM justifications: LLM assessments contain textual justifications. These are themselves confabulation-prone outputs. As a prompting strategy they serve a diagnostic function, because inconsistencies between a classification and its justification indicate unstable assignments.

Four layers:

| Layer | Description | Project implementation |
|---|---|---|
| Workflow | Dual assessment track, deterministic processing stages | 3-stage SKE, parallel assessment |
| Research integrity | Documentation, traceable design decisions | Repository, prompt changelog, verification checkpoints |
| Institutional | AI guidelines | Not yet in place |
| Community | Peer review practices that include workflows | A demand the paper makes |

### Who decides what, where, and why

The design principle made concrete across the three phases:

Phase 1, identification. The four LLM models decide which literature is found (automated cross-disciplinary search); the research assistant and researchers decide what is supplemented (manual search closes gaps); the research assistant decides duplicate removal (metadata matching).

Phase 2, assessment. The experts (Sackl-Sharif, Klinger) make the binding include/exclude decision on domain knowledge and interpretive judgment; the LLM makes an exploratory decision for scalability and pattern recognition; both assign categories in parallel and independently, which is what enables the divergence analysis.

Phase 3, synthesis. The LLM extracts (stage 1, probabilistic, scaling across the corpus); deterministic software formats (stage 2, no LLM, for reproducibility); the LLM verifies against the original full text (stage 3, with a verification mandate); a software rule escalates at low confidence (a threshold-based forward to a human).

### Artificial epistemic authorities (Hauswald 2025)

Rico Hauswald argues that epistemic deference need not be tied to beliefs or communicative intentions; what matters is whether a system's outputs function as reliable truth indicators. Hauswald describes a justificatory esotericism: not the content but the justification remains inaccessible. Supplement (Ferrario, Facchini, Termine 2024): even empirically demonstrable superiority of an AI system does not establish epistemic authority, because authority presupposes epistemic virtues and normative answerability that machines do not possess.

### Double uncontrollability

Before deployment, it cannot be delimited for which tasks a model works reliably. After deployment, it cannot be explained why a particular output turned out as it did. This is intensified by AI agents, where chains of processing steps run whose intermediate results and decision logic remain additionally hidden.

### LLMs as exotic mind-like entities (Shanahan 2024)

Shanahan (Strange New Minds) coins the term for frontier LLMs: systems that operate differently from humans even when their behavior often appears human-like. LLMs lack the means to exercise concepts like understanding or belief in anything like the way we do. When practitioners attribute insight into client situations to these systems, they overlook that LLMs operate without the world understanding or critical reflective capacity that professional social work requires. Three aspects are relevant: emergent capabilities without explicit training (in-context learning, domain transfer), alignment tensions between Constitutional AI and the profession-specific values of social work, and persona effects (Chen et al. 2025, consistent character traits that shift through fine-tuning and produce unpredictable cross-trait effects).

### Sycophancy (prompt conformity)

The empirically documented tendency of LLMs to over-agree with prompt presuppositions; Malmqvist (2024) documents error-introduction rates of up to 40 percent for suggestive queries. Measures in the project: negative constraints in the assessment prompts (classify as Feminist only on explicit feminist theory, methods, perspective, or authors, not on mere proximity to gender topics; when uncertain, choose the more restrictive value; do not assign more than three or four categories unless the text genuinely addresses more), calibration items (a small control group with known correct classification), and prompt versioning (every change in `prompts/CHANGELOG.md`).

### Situated knowledge (Haraway)

All knowledge arises from specific social, cultural, and material contexts. Objectivity means explicit positioning, not a view from nowhere. Operationalization: a multi-model strategy (four LLMs with different training data), divergence between models documented rather than harmonized, and the project's own positioning (feminist, social-work-scientific) made transparent.

### Intersectionality (Crenshaw)

Oppression does not operate along single axes (gender, race) but through their mutual constitution. Operationalization: multi-dimensional categorization schemas (the ten binary categories), prompt templates focused on intersectional perspectives, and concept extraction that preserves intersectional specificity.

### Response-ability (Haraway) and responsibility asymmetry

Responsibility means the capacity to respond and to maintain relationships. Responsibility for all results remains with the researchers even when LLMs provide epistemically relevant contributions. Operationalization: expert-in-the-loop validation at critical decision points, explicit justifications for inclusion and exclusion decisions, transparent documentation of methodological limitations, and the expert track as the epistemically binding reference track.

## Methodological limitations

- Circularity: LLMs are used to examine literature about the use of LLMs. This is not a defect but a condition of the field.
- Justificatory esotericism (Hauswald): training data, model architectures, and selection logics are not disclosed.
- Unsecured LLM outputs: addressed by the 3-stage SKE with deterministic stage 2 and verification.
- Sycophancy risk: addressed by negative constraints and calibration items.
- Paywall bias: a substantial fraction of literature sits behind access barriers; the acquisition rate and its consequences are derivable from the data (generated/benchmark-results/, docs/data/) and the Evidence Companion.
- Resource asymmetry: groups studying bias and inequality frequently have fewer resources for building epistemic infrastructure.
- Dependence on proprietary systems.
- Benchmark limitations: the benchmark rests on the overlap of the human and LLM tracks, the provider overlap is verifiable only for a sample, and the acquisition barrier underrepresents paywalled literature. The exact subset sizes and the decomposed reading of the divergence are derivable from the data (generated/benchmark-results/, docs/data/) and the Evidence Companion.

## Open items (theory and framing)

- Conduct the OA analysis (Unpaywall API).
- Overlap analysis on the full corpus, not just the restored RIS sample.
- Formalize the escalation rule for expert review.
- Institutional level: document the AI-guidelines reference.
