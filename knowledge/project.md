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
version: "0.6"
created: 2026-02-21
updated: 2026-08-23
authors: [Christopher Pollin]
generated-with: Claude Code
topics: ["[[Epistemic Infrastructure]]", "[[Feminist AI]]"]
related: [INDEX, methods, standards, governance, verification, plan, journal]
---

FemPrompt SozArb is a qualitative literature review on generative AI, gender, bias, and social work, together with the epistemic infrastructure that makes its AI-assisted research operations traceable. It forms part of the Elisabeth List Fellowship project "Diversity-Sensitive Engagement with Artificial Intelligence" at the University of Graz. The round-one expert and LLM divergence motivates the record design. The round-two workflow demonstrates how AI agents can prepare a corpus for later domain-expert verification.

## Project goal

The primary goal is to describe and operationalise an epistemic infrastructure for LLM- and agent-assisted qualitative literature review. The case study examines generative AI, gender, and bias in social work. The infrastructure records evidence, provenance, deterministic validation, source-grounded AI Agent Review, domain-expert verification, and publication approval as distinct operations.

A secondary goal is to create a conceptual basis for a social-work bias benchmark. The review identifies relevant terms, bias axes, mitigation approaches, population contexts, and domain-specific constraints that can inform later test scenarios.

Working definition of feminist AI literacies: diversity-sensitive, intersectional, and bias-aware competencies that social work professionals need when engaging with generative AI, with a focus on prompting, critical output evaluation, and context and application sensitivity.

## Research questions

The paper has one methodological integration question. How can LLMs and AI agents be integrated into a qualitative literature review with traceable contributions, re-executable processing, and final scholarly authority assigned to domain experts?

The literature analysis answers three sub-questions.

- SQ1 identifies the prompting techniques discussed in the literature and distinguishes proposed, demonstrated, and evaluated uses.
- SQ2 maps bias axes and harm types to mitigation stages and evidence status.
- SQ3 identifies social-work-specific constraints, population contexts, practice settings, and gaps in general-purpose prompt-engineering guidance.

The methodological question frames the paper. SQ1 to SQ3 demonstrate what the governed workflow yields from the literature. Their controlled fields and coding rules live in [[update-protocol]].

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
| Round-one comparative assessment and replay remain reconstructable | Implemented |
| Round-two agent runs preserve source, prompt, model, actor, and lifecycle provenance | Implemented for governed runs; complete corpus open |
| Domain experts can verify, correct, and approve prepared records in PRISM | Implemented; execution over the intended corpus open |
| Quantitative findings derive from committed data and executable scripts | Open for the completed corpus |
| Qualitative findings derive from source-linked Assertions | Initial vertical slice implemented; complete synthesis open |
| Public projections contain only publication-approved material | Implemented |
| Canonical literature report and paper receive domain-expert review | Open |

## Scope boundaries

| Boundary | Consequence |
|---|---|
| Empirical claims | The project is a qualitative review plus its epistemic infrastructure and makes no empirical claim. The round-one human and LLM divergence is a motivating illustration, not a finding to defend, and no inter-human baseline was set up that would carry one |
| Prompting guidance | The review synthesises reported practices and evidence; a practice guide can be derived later |
| Experimental efficacy testing | The project reports experiments found in the literature and conducts no new prompting experiment |
| Tool audience | PRISM serves research teams and domain experts working on a review |
| Scholarly authority | Domain experts verify interpretations and approve publication |
| Model development | The workflow uses existing LLMs and records their versions and roles |

## Two strands of the project

The methodological strand develops the implemented workflow and its authority model. Its outputs are PRISM, the lifecycle and provenance schema, the governed agent-run contract, the round-one replay, and the documented Grounded Vault chain.

The substantive strand answers SQ1 to SQ3 from the completed corpus. Its outputs are the quantitative literature landscape, the source-linked Assertions, the literature report, and the paper synthesis. The same knowledge structure supplies a conceptual foundation for a later social-work bias benchmark.

## Corpus

The corpus was identified via four proprietary Deep Research systems (ChatGPT, Claude, Gemini, Perplexity) plus a limited manual search, curated in a Zotero group. It is English and German, spanning the late 2010s to 2025, focused on feminist AI literacies, generative AI, prompting, and social work. The exact counts, the provider distribution, and the acquisition loss chain are derivations from the data and live in the files under `assessment/` and `corpus/`.

## Team

| Role | Responsibility |
|---|---|
| Technical and methodological lead | Infrastructure, data model, agent orchestration, analysis pipeline |
| Review lead | Research design, domain-expert verification, scholarly interpretation |
| Reviewing domain expert | Domain-expert verification and interpretation |
| Research assistant | Zotero curation, metadata correction, source management |

## Theoretical framework

### Epistemic asymmetry (the paper's guiding concept)

Epistemic asymmetry describes a division of labor in which the involved agents process knowledge in fundamentally different ways, where neither side can fully evaluate the epistemic contributions of the other. LLMs process large volumes of text and recognize patterns across hundreds of documents. Experts assess the epistemic quality of sources and recognize nuances visible only through domain knowledge. The asymmetry is reciprocal and context-dependent. It cannot be resolved with current systems but can be productively managed through workflow design (Mollick, Co-Intelligence).

Central thesis: the responsibility asymmetry binds the other dimensions. Without attributable responsibility, there is no agent capable of methodologically addressing opacity, access conditions, and competence differentials.

The asymmetry maps onto concrete risks and infrastructure measures:

| Asymmetry dimension | Risk | Infrastructure measure |
|---|---|---|
| Opacity (justificatory esotericism) | Unverifiable selection by Deep Research models | Multi-provider strategy plus selection logging |
| Unsecured LLM outputs | LLMs can generate factually unsupported claims | 3-stage SKE with deterministic validation, source-grounded AI Agent Review, and deferred domain-expert verification |
| Sycophancy | Prompt-induced over-attribution of categories | Negative constraints in prompts, calibration items, prompt versioning |
| Paywall bias | Systematic underrepresentation of paywalled literature | Hierarchical acquisition strategy plus OA disclosure |
| Prompt competence | Result dependence on prompt quality | Prompt governance: versioning, review, documentation |
| Scholarly authority | AI review cannot establish a domain interpretation or public release | Domain-expert verification and separate publication approval |
| Provider divergence | Different models yield different evidence bases | Multi-provider comparison, overlap analysis |
| Resource asymmetry | Unequal access to frontier models and infrastructure | Cost transparency, open-source pipeline where possible |

### Epistemic infrastructure

Epistemic infrastructure denotes the totality of procedures, documentation structures, institutional regulations, and community practices that ensure LLM contributions in research remain verifiable, traceable, and accountable.

Core principle: reliability cannot be presupposed as a property of the system but must be established as a property of the process.

Operative design principle: each AI-assisted work step has a named control point. Deterministic validation checks form and rules, AI Agent Review checks source support, and domain-expert verification establishes scholarly authority for the artifact under review.

Diagnostic function of LLM justifications: LLM assessments contain textual justifications. These are themselves confabulation-prone outputs. As a prompting strategy they serve a diagnostic function, because inconsistencies between a classification and its justification indicate unstable assignments.

Four layers:

| Layer | Description | Project implementation |
|---|---|---|
| Workflow | Round-specific assessment design and governed processing stages | Comparative expert and LLM tracks in round one; agent annotation, deterministic transfer, AI Agent Review, and deferred domain-expert verification in round two |
| Research integrity | Documentation, traceable design decisions | Repository, prompt changelog, validation receipts, AI Agent Review, domain-expert verification |
| Institutional | AI guidelines | Not yet in place |
| Community | Peer review practices that include workflows | A demand the paper makes |

### Who decides what, where, and why

The design principle made concrete across the three phases:

Phase 1 covers identification and curation. Deep Research systems propose literature. Researchers supplement the search, curate Zotero metadata, resolve duplicates, attach sources, and review Docling Markdown.

Phase 2 covers screening and analysis coding. Round one retains its separately recorded consolidated expert and LLM assessments. Round two assigns source coding to operationally isolated AI agents, uses deterministic PRISM transfer, and conducts a separate source-grounded AI Agent Review. Domain experts later verify or correct every intended productive record.

Phase 3 covers knowledge synthesis and publication. Distillation produces source-linked knowledge documents, Assertions consolidate atomic findings, and deterministic scripts compute quantitative results. Domain experts verify the resulting scholarly interpretation. An authorised person records publication approval for each public artifact.

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

Oppression does not operate along single axes (gender, race) but through their mutual constitution. Operationalization: multi-dimensional categorization schemas (the ten three-level categories), prompt templates focused on intersectional perspectives, and concept extraction that preserves intersectional specificity.

### Response-ability (Haraway) and responsibility asymmetry

Responsibility means the capacity to respond and to maintain relationships. Researchers retain responsibility for the results when LLMs provide epistemically relevant contributions. The workflow operationalises this through explicit evidence, attributable decisions, artifact-local domain-expert verification, and separate publication approval.

## Methodological limitations

- Circularity: LLMs are used to examine literature about LLM use. The workflow treats this field condition through explicit model provenance and source-linked verification.
- Justificatory esotericism (Hauswald): training data, model architectures, and selection logics are not disclosed.
- Unsecured LLM outputs: addressed by the 3-stage SKE with deterministic stage 2 and verification.
- Sycophancy risk: addressed by negative constraints and calibration items.
- Paywall bias: a substantial fraction of literature sits behind access barriers; the acquisition rate and its consequences are derivable from the data (generated/benchmark-results/, docs/data/) and the Evidence Companion.
- Resource asymmetry: groups studying bias and inequality frequently have fewer resources for building epistemic infrastructure.
- Dependence on proprietary systems.
- Benchmark limitations: the benchmark rests on the overlap of the human and LLM tracks, the provider overlap is verifiable only for a sample, and the acquisition barrier underrepresents paywalled literature. The exact subset sizes and the decomposed reading of the divergence are derivable from the data (generated/benchmark-results/, docs/data/) and the Evidence Companion.
