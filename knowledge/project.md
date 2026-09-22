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
updated: 2026-09-22
authors: [Christopher Pollin]
generated-with: Claude Code, Codex (GPT-6)
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

- The intended corpus has explicit Work and Version identities, source-linked reading material and documented preparation gaps.
- Research contributions identify their producer, inputs and actual checks. Historical round-one assessments remain reconstructable.
- PRISM supports reading, evidence inspection, correction and reliable saving. Scholarly verification identifies the exact statement, field or whole artifact checked and its evidence basis.
- Comparative findings answer SQ1 to SQ3 through reproducible descriptive analysis and source-linked Assertions, retaining study conditions, contradictory evidence and limitations.
- The literature report and paper receive domain-expert verification of their substantive claims and interpretations. Publication follows the policy applicable to each output, and submission requires a decision over the final manuscript.

[[verification]] records the available evidence, [[specification]] the implemented tool contract, and [[plan]] the remaining work. These criteria state the target rather than a software or scholarly completion claim.

## Scope boundaries

| Boundary | Consequence |
|---|---|
| Empirical claims | The project reports descriptive findings from the recorded assessments and the reviewed literature. The round-one comparison measures divergence between documented products. Its missing independent inter-human baseline prevents treating that divergence as an LLM error rate or a general accuracy claim. [[analysis-divergence]] defines the interpretation limits |
| Prompting guidance | The first analytical output is comparative literature synthesis. Practice recommendations require a separate appraisal of study quality and transfer conditions under [[research-vault#Comparative synthesis scope]] |
| Experimental efficacy testing | The project reports experiments found in the literature and conducts no new prompting experiment |
| Tool audience | PRISM serves research teams and domain experts working on a review |
| Scholarly authority | Domain experts verify interpretations and approve publication |
| Model development | The workflow uses existing LLMs and records their versions and roles |

## Two strands of the project

The methodological strand develops the implemented workflow and its authority model. Its outputs are PRISM, the lifecycle and provenance schema, the governed agent-run contract, the round-one replay, and the documented Grounded Vault chain.

The substantive strand answers SQ1 to SQ3 from the completed corpus. Its outputs are the quantitative literature landscape, the source-linked Assertions, the literature report, and the paper synthesis. The same knowledge structure supplies a conceptual foundation for a later social-work bias benchmark.

## Corpus

The initial corpus was identified via four proprietary Deep Research systems (ChatGPT, Claude, Gemini, Perplexity) plus a limited manual search and curated in a Zotero group. It covers English and German literature on feminist AI literacies, generative AI, prompting and social work. The completion target also includes the prepared 2026 intake and separately dated gap-filling candidates; their identification does not imply a curated identity or screening inclusion. The [completion package](../generated/completion/README.md) distinguishes these populations and their current denominators. The historical benchmark, linked knowledge archive and active source-reviewed synthesis remain separate subsets.

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
| Scholarly authority | AI source review can be mistaken for domain-expert verification | Attributed preliminary release policy; separate domain-expert verification and final scholarly approval |
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

Phase 2 covers screening and analysis coding. Round one retains its separately recorded consolidated expert and LLM assessments. Round two assigns source coding to operationally isolated AI agents, uses deterministic PRISM transfer, and conducts a separate source-grounded AI Agent Review. Domain experts verify or correct the statements and fields used in the synthesis, or a whole record when that is the declared review scope. The current implementation and the authorised target scope are distinguished in [[governance#Verification scope decision, 22 September 2026]].

Phase 3 covers knowledge synthesis and publication. Distillation produces source-linked knowledge documents, Assertions consolidate atomic findings, and deterministic scripts compute quantitative results. Domain experts verify the resulting scholarly interpretation. Public outputs follow their declared release policy. The authorised preliminary AI-reviewed projection retains its actual review basis. The final manuscript requires human verification and an explicit submission decision under [[governance#Publication boundary]].

### Artificial epistemic authorities (Hauswald 2025)

Rico Hauswald argues that epistemic deference need not be tied to beliefs or communicative intentions; what matters is whether a system's outputs function as reliable truth indicators. Hauswald describes a justificatory esotericism: not the content but the justification remains inaccessible. Supplement (Ferrario, Facchini, Termine 2024): even empirically demonstrable superiority of an AI system does not establish epistemic authority, because authority presupposes epistemic virtues and normative answerability that machines do not possess.

### Double uncontrollability

Before deployment, it cannot be delimited for which tasks a model works reliably. After deployment, it cannot be explained why a particular output turned out as it did. This is intensified by AI agents, where chains of processing steps run whose intermediate results and decision logic remain additionally hidden.

### LLMs as exotic mind-like entities (Shanahan 2024)

Shanahan (Strange New Minds) coins the term for frontier LLMs: systems that operate differently from humans even when their behavior often appears human-like. LLMs lack the means to exercise concepts like understanding or belief in anything like the way we do. When practitioners attribute insight into client situations to these systems, they overlook that LLMs operate without the world understanding or critical reflective capacity that professional social work requires. Three aspects are relevant: emergent capabilities without explicit training (in-context learning, domain transfer), alignment tensions between Constitutional AI and the profession-specific values of social work, and persona effects (Chen et al. 2025, consistent character traits that shift through fine-tuning and produce unpredictable cross-trait effects).

### Sycophancy (prompt conformity)

The empirically documented tendency of LLMs to over-agree with prompt presuppositions; Malmqvist (2024) documents error-introduction rates of up to 40 percent for suggestive queries. Measures in the project: source-bound category decisions under the current codebook (gender proximity alone does not establish a feminist perspective; explicit and implicit approaches must meet the recorded definition, and every positive category needs its own evidence), calibration items (a small control group with known correct classification), and prompt versioning (every change in `prompts/CHANGELOG.md`).

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
