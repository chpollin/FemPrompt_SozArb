# Literature Review: AI Literacy & Bias in Social Work

## Project Goal

Systematic literature review on **feminist AI literacy** and **LLM bias** (gender, race, intersectionality) in the context of social work. Part of the Elisabeth List Fellowship project "Diversity-Sensitive Engagement with Artificial Intelligence" (University of Graz, 2025--2026).

**Primary goal:** Describe and operationalize epistemic infrastructure for LLM-assisted literature reviews -- using the case of a systematic review on feminist AI literacy and LLM bias in social work. Core question: What procedures, documentation structures, and workflow decisions are needed to ensure that LLM contributions in research remain verifiable, traceable, and accountable?

**Secondary goal (foundation):** Create a conceptual basis for a benchmark ("Fair Bench") for social work. The review identifies relevant terms, concepts, and discourse positions that can be transferred into test scenarios.

**Working definition of feminist AI literacies:** Diversity-sensitive, intersectional, and bias-aware competencies that social work professionals need when engaging with generative AI, with a focus on prompting, critical output evaluation, and context/application sensitivity.

---

## Research Questions

### Main Question

What epistemic infrastructure does an LLM-assisted literature review require to methodologically address the asymmetry between machine pattern recognition and expert judgment?

### Review (Content Questions, Secondary)

1. How does bias manifest context-dependently in frontier LLMs?
2. What prompting strategies enable discrimination-sensitive AI use?
3. How can social workers develop AI literacy that does justice to the system's complexity?

---

## Target Audience

| Audience | Benefit |
|----------|---------|
| Researchers (social work + AI) | Structured literature overview, research gaps |
| Practitioners (social work) | Evidence base for LLM use in practice |
| Educators (AI literacy) | Course material, concepts, case studies |

**Primary audience:** Researchers with limited AI expertise

---

## Success Criteria

### Must-Have (Minimum)

| Criterion | Measurable | Status |
|-----------|------------|--------|
| Workflow fully documented | Repository auditable | Implemented |
| Epistemic infrastructure documented | Repository auditable, prompts versioned | Implemented |
| Dual assessment track executed | Human + LLM assessment complete | Completed |
| Benchmark metrics computed | Confusion matrix, base rates, divergence analysis (kappa as comparative anchor) | Completed (details: `status.md`) |

### Should-Have

| Criterion | Measurable | Status |
|-----------|------------|--------|
| 249 knowledge documents | Structured full-text extraction | Completed (97.2% verified) |
| Divergence analysis | 111 cases categorized | Completed |
| Obsidian Vault | Interlinked knowledge base | Done (249 papers, 205 with assessment data) |

### Nice-to-Have

| Criterion | Measurable | Status |
|-----------|------------|--------|
| GitHub Pages | Static documentation site | Done (https://chpollin.github.io/FemPrompt_SozArb/) |
| OA analysis | Open access rate of the corpus | Pending |

---

## Non-Goals

| What is NOT part of the project | Why |
|---------------------------------|-----|
| Finished prompting guide | Planned for subsequent phase |
| Empirical validation of prompting strategies | Out of scope |
| End-user tool | Focus is research, not product |
| Full automation | Expert-in-the-loop remains central |
| Training custom models | Uses existing frontier LLMs |

---

## Two Levels of the Project

### Level 2: Methodological -- CORE CONTRIBUTION

**Question:** What epistemic infrastructure does an LLM-assisted literature review require to methodologically address the asymmetry between machine pattern recognition and expert judgment?

**Output:**
- Concept of epistemic infrastructure (four layers: workflow, research integrity, institutional, community)
- Dual assessment track as operationalization (human + LLM, parallel, independent)
- Benchmark results as illustration: divergence is measurable and informationally productive (results: see `status.md`)
- Documented, reproducible workflow in the repository (github.com/chpollin/FemPrompt_SozArb)

### Level 1: Substantive (Literature Review -- Use Case)

**Question:** What does the research say about LLM bias and feminist AI literacy?

**Output:**
- Thematically categorized corpus (326 papers, 10 binary categories)
- 249 distilled knowledge documents (full-text extraction, 3-stage SKE)
- Obsidian Vault (in progress)
- Conceptual foundation for Fair Bench (subsequent phase)

---

## Corpus

| Aspect | Value |
|--------|-------|
| Total papers | 326 (Zotero Group 6080294) |
| Origin | 254 Deep Research (4 models) + 50 manually identified + 22 Zotero only |
| Deep Research models | Gemini, Claude, ChatGPT, Perplexity |
| DR distribution | Perplexity 75, Claude 63, ChatGPT 62, Gemini 54 |
| Focus | Feminist AI literacies, generative AI, prompting, social work |
| Languages | English, German |
| Time span | 2017--2025 |

---

## Team

| Person | Role |
|--------|------|
| Christopher Pollin | Technical infrastructure, pipeline |
| Susi Sackl-Sharif | Human assessment, research lead |
| Sabine Klinger | Human assessment |
| Christina | Zotero curation, metadata |
| Christian Steiner | Paper review |

---

## Theoretical Framework

### Epistemic Asymmetry (Guiding Concept of the Paper)

Epistemic asymmetry describes a division of labor in which the involved agents process knowledge in fundamentally different ways, where neither side can fully evaluate the epistemic contributions of the other. LLMs process large volumes of text and recognize patterns across hundreds of documents. Experts assess the epistemic quality of sources and recognize nuances visible only through domain knowledge.

The asymmetry is reciprocal and context-dependent. It cannot be resolved with current systems but can only be productively managed through workflow design (Mollick: Co-Intelligence).

**Central thesis:** The responsibility asymmetry binds the other dimensions. Without attributable responsibility, there is no agent capable of methodologically addressing opacity, access conditions, and competence differentials.

#### Mapping Table: Asymmetry -> Risk -> Measure -> Artifact

| Asymmetry Dimension | Risk | Infrastructure Measure | Verifiable Artifact | Status |
|---|---|---|---|---|
| **Opacity** (justificatory esotericism) | Unverifiable selection by Deep Research models | Multi-provider strategy (4 models) + selection logging | `corpus/source_tool_mapping.json`, `deep-research/restored/` | Partial (logging in place, audit pending) |
| **Unsecured LLM outputs** | LLMs can generate factually unsupported claims | 3-stage SKE with deterministic stage 2 + verification stage 3 | `pipeline/knowledge/_verification/`, confidence scores in frontmatter | Implemented |
| **Sycophancy** | Prompt-induced over-attribution of categories | Negative constraints in prompts, calibration items, prompt versioning | `prompts/CHANGELOG.md`, negative constraints in `benchmark/scripts/run_llm_assessment.py` | Implemented (v2.1) |
| **Paywall bias** | Systematic underrepresentation of paywalled literature | Hierarchical acquisition strategy + OA disclosure | PRISMA flow diagram, acquisition rate (257/326 = 79%) | Partial (rate documented, OA analysis pending) |
| **Prompt competence** | Result dependence on prompt quality | Prompt governance: versioning, review, documentation | `prompts/CHANGELOG.md`, `prompts/deep-research-template.md` | Implemented |
| **Responsibility asymmetry** | No attributable agent on the LLM side | Expert track as epistemically binding reference track | Human assessment (Google Sheets), auditable assessment data | Implemented |
| **Provider divergence** | Different models yield different evidence bases | Multi-provider comparison, overlap analysis | `corpus/papers_metadata.csv` (Source_Tool column), provider statistics | Partial |
| **Resource asymmetry** | Unequal access to frontier models and infrastructure | Cost transparency, open-source pipeline where possible | Cost documentation ($10.17 total), Docling (open source) | Documented |

### Epistemic Infrastructure

Epistemic infrastructure denotes the totality of procedures, documentation structures, institutional regulations, and community practices that ensure LLM contributions in research remain verifiable, traceable, and accountable.

**Core principle:** Reliability cannot be presupposed as a property of the system but must be established as a property of the process.

**Operative design principle (verification checkpoints):** Each AI-assisted work step is followed by a verification checkpoint -- a defined point in the process where human or rule-based control checks the results.

**Diagnostic function of LLM justifications:** LLM assessments contain textual justifications. These are themselves confabulation-prone outputs. As a prompting strategy, they serve a diagnostic function: inconsistencies between classification and justification indicate unstable assignments.

**Four layers:**

| Layer | Description | Project Implementation |
|-------|-------------|----------------------|
| Workflow | Dual assessment track, deterministic processing stages | 3-stage SKE, parallel assessment |
| Research Integrity | Documentation, traceable design decisions | Repository, prompt changelog, verification checkpoints |
| Institutional | AI guidelines | Not yet in place |
| Community | Peer review practices that include workflows | Paper demand |

#### Design Principle: Who Decides What, Where, and Why?

**Phase 1: Identification (Deep Research)**

| Decision | Who Decides | Why | Artifact |
|---|---|---|---|
| Which literature is found? | 4 LLM models | Automated cross-disciplinary search | RIS files, Zotero collections |
| Which literature is supplemented? | Research assistant + researchers | Manual search closes gaps | 50 manual papers in `papers_metadata.csv` |
| Which duplicates are removed? | Research assistant | Metadata matching (DOI, title) | Zotero duplicate detection |

**Phase 2: Assessment (Dual Assessment)**

| Decision | Who Decides | Why | Artifact |
|---|---|---|---|
| Include/exclude (binding) | Experts (Sackl-Sharif, Klinger) | Domain knowledge, interpretive judgment | Google Sheets, `human_assessment.csv` |
| Include/exclude (exploratory) | LLM (Haiku 4.5) | Scalability, pattern recognition | `assessment_llm.xlsx` (5D), 10K output |
| Category assignment | Both (parallel, independent) | Comparison enables divergence analysis | Confusion matrix, base rates, divergence analysis |

**Phase 3: Synthesis (SKE)**

| Decision | Who Decides | Why | Artifact |
|---|---|---|---|
| Extraction (stage 1) | LLM (probabilistic) | Scaling across 249 documents | `_stage1_json/` |
| Formatting (stage 2) | Deterministic software | Reproducibility, no LLM involvement | `_stage2_draft/` |
| Verification (stage 3) | LLM (probabilistic with verification mandate) | Checking against original full text | `_verification/`, confidence score |
| Escalation at low confidence | Software rule (< 75) | Threshold-based forwarding | `needs_correction` flag |

### Artificial Epistemic Authorities (Hauswald 2025)

Rico Hauswald argues that epistemic deference need not be tied to beliefs or communicative intentions. What matters is whether a system's outputs function as reliable truth indicators.

Hauswald describes a justificatory esotericism: not the content but the justification remains inaccessible.

**Supplement (Ferrario/Facchini/Termine 2024):** Even empirically demonstrable superiority of an AI system does not establish epistemic authority, because authority presupposes epistemic virtues and normative answerability that machines do not possess.

### Double Uncontrollability

Before deployment, it cannot be delimited for which tasks a model works reliably. After deployment, it cannot be explained why a particular output turned out as it did. This is further intensified by AI agents, where chains of processing steps run whose intermediate results and decision logic remain additionally hidden.

### Competency Requirements for Epistemic Infrastructure

| Competency | Description |
|------------|-------------|
| Basic technical competency | Understanding code, repositories, and documented processes |
| AI-specific literacy | Addressing phenomena such as confabulation and sycophancy in process design |
| Reflective literacy | Critically assessing the epistemic consequences of the technologies deployed |

These competencies go far beyond traditional information literacy and are currently unevenly distributed.

### LLMs as "Exotic Mind-Like Entities" (Shanahan 2024)

Shanahan (2024, *Strange New Minds*) coins the term for frontier LLMs: systems that operate differently from humans, even when their behavior often appears human-like. LLMs "lack the means to exercise concepts" like understanding or belief "in anything like the way we do" (p. 71). When practitioners attribute insight into client situations to these systems, they overlook that LLMs operate without the world understanding or critical reflective capacity that professional social work requires.

Three aspects relevant to the project:
1. **Emergent capabilities** without explicit training (in-context learning, domain transfer)
2. **Alignment tensions** between Constitutional AI ("helpful, harmless, honest") and profession-specific values of social work
3. **Persona effects** (Chen et al. 2025): Consistent character traits that shift through fine-tuning and produce unpredictable cross-trait effects

### Sycophancy (Prompt Conformity)

Empirically documented tendency of LLMs to excessively agree with prompt presuppositions. Malmqvist (2024) documents error introduction rates of up to 40% for suggestive queries.

**Measures in the project:**

1. **Negative constraints** (in assessment prompts, v2.1):
   - "Classify as 'Feminist' only if the text explicitly uses feminist theory, methods, or perspectives OR refers to feminist authors. Implicit proximity to gender topics is insufficient."
   - "When uncertain: 'No' rather than 'Yes'. When in doubt, choose the more restrictive value."
   - "Do not assign more than 3-4 categories per paper unless the text genuinely addresses more."

2. **Calibration items:** 3-5 papers with known correct classification as a control group

3. **Prompt versioning:** Every change documented in `prompts/CHANGELOG.md`

### Situated Knowledge (Haraway)

All knowledge arises from specific social, cultural, and material contexts. Objectivity means explicit positioning, not a "view from nowhere."

**Operationalization:**
- Multi-model strategy: 4 LLMs with different training data
- Divergence between models is documented, not harmonized
- Own positioning (feminist, social-work-scientific) made transparent

### Intersectionality (Crenshaw)

Oppression does not operate along single axes (gender, race) but through their mutual constitution.

**Operationalization:**
- Multi-dimensional categorization schemas (10 binary categories)
- Prompt templates focus on intersectional perspectives
- Concept extraction preserves intersectional specificity

### Response-Ability (Haraway) / Responsibility Asymmetry

Responsibility means the capacity to respond and to maintain relationships. Responsibility for all results remains with the researchers, even when LLMs provide epistemically relevant contributions.

**Operationalization:**
- Expert-in-the-loop validation at critical decision points
- Explicit justifications for inclusion/exclusion decisions
- Transparent documentation of methodological limitations
- Expert track as epistemically binding reference track

---

## Methodological Limitations

- **Circularity:** LLMs are used to examine literature about the use of LLMs. This circularity is not a defect but a condition of the field
- **Justificatory esotericism (Hauswald):** Training data, model architectures, and selection logics are not disclosed
- **Unsecured LLM outputs:** Addressed by 3-stage SKE with deterministic stage 2 and verification
- **Sycophancy risk:** Addressed by negative constraints, calibration items
- **Paywall bias:** 79% acquisition rate, remainder behind access barriers
- **Resource asymmetry:** Groups studying bias and inequality frequently have fewer resources for building epistemic infrastructure
- **Dependence on proprietary systems**

### Three Systematic Limitations of the Benchmark

1. **Benchmark basis:** 291 of 326 papers with both assessments (303 human, 326 LLM, 291 overlap by Zotero key)
2. **Overlap analysis:** Verifiable only for a sample of 34 papers (93.8% unique)
3. **PDF acquisition rate:** 79% creates systematic underrepresentation of paywalled literature

---

## Glossary (Core Terms)

| Term | Definition |
|------|------------|
| Epistemic asymmetry | Division of labor in which involved agents process knowledge in fundamentally different ways |
| Epistemic infrastructure | Procedures, documentation structures, and regulations that make LLM contributions verifiable |
| Sycophancy | Tendency of LLMs to excessively agree with prompt presuppositions |
| Jagged frontier | Uneven competence distribution of AI systems (Mollick) |
| Structured Knowledge Extraction (SKE) | 3-stage processing of full texts into knowledge documents |
| Dual assessment track | Parallel arrangement of expert and LLM tracks |
| Responsibility asymmetry | Responsibility remains with researchers even though LLMs provide epistemically relevant contributions |
| Deep Research | Agent-based LLM systems for iterative search and cited synthesis |
| Knowledge document | Structured summary of a study with metadata, key findings, categories, and confidence score |
| Confabulation | Generation of coherent but factually unsupported claims without internal verification. More precise than "hallucination" because it describes the generative mechanism rather than a sensory experience. |
| Double uncontrollability | Before deployment, it cannot be delimited for which tasks a model works reliably; after deployment, it cannot be explained why an output turned out as it did. Intensified by AI agents. |
| Verification checkpoint | Defined point in the process where human or rule-based control checks whether results meet requirements for the next step. |
| Context window | Limited amount of text that an LLM can process per request. |
| Context rot | Degradation of processing quality with increasing input length (Hong et al. 2025). |
| Reusability | Principle that workflows should be documented such that they can be adapted for other research questions. |

---

## Open Items (Theory/Framing)

- [ ] Conduct OA analysis (Unpaywall API)
- [ ] Overlap analysis on full corpus (via `papers_metadata.csv`, not just RIS)
- [ ] Formalize escalation rule for expert review
- [ ] Institutional level: document AI guidelines reference

---

*Updated: 2026-04-01*
