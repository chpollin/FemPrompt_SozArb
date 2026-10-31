---
title: Paper Analysis Plan
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: draft
language: en
created: 2026-10-31
updated: 2026-10-31
authors: [Christopher Pollin]
generated-with: Codex (GPT-6)
related: [project, analysis-methods, plan, research-vault, governance, verification, journal]
---

# Paper Analysis Plan

This document turns the existing research questions into an executable analysis and evaluation design for the Adult Literacy Education paper. It owns the paper-specific analytical questions, the comparison of analysis procedures and their review criteria. [[project]] retains the project questions and publication context; [[analysis-methods]] retains the methodological frame. This plan does not amend the codebook or establish a verified synthesis.

## Scope and ownership

The substantive work belongs to SocialAI in this repository. `research-vault/` is its existing Grounded Vault instance. The generic `DigitalHumanitiesCraft/grounded-vault` repository owns reusable tooling and its separate methods manuscript. SocialAI source texts, annotations, Assertions and paper claims remain here. General lessons may be proposed to the template only after their evidence and transfer limits have been reviewed.

The Obsidian note `Projects/SocialAI/SocialAI Paper-Pipeline.md` explains the paper's purpose and routes to this document. `ACTIVE-WORK.md`, entry `social-ai`, owns current state and next actions. Neither duplicates the experiment records. The canonical manuscript remains `research-vault/40_output/paper/paper.md`; the detailed answers remain in `research-vault/40_output/literature-report/`.

## Paper question and analytical questions

The proposed paper-level question is: What does the selected literature imply for bias-sensitive feminist AI literacy among social work professionals, and which evidence and transfer limitations qualify these implications? The author group still decides the final wording and its connection to the special issue's adult-learning remit. Professional continuing education alone does not establish adult basic-skills relevance.

The following questions operationalise SQ1 to SQ5 without renumbering them.

| ID | Question to answer from the actual data | Analysis product and review focus |
|---|---|---|
| SQ1a | Which social-work tasks and settings are investigated, and which are merely mentioned as possible applications? | Work-level task map plus statement-level evidence. Separate direct social-work research from transfer from other fields. |
| SQ1b | Which benefits are measured, perceived by participants, or asserted by authors, under which conditions? | Benefits table retaining study design, participants or test material, outcome and limitations. |
| SQ2a | Which bias axes, harm mechanisms and affected groups are linked by the source itself? | Evidence-backed mechanism statements. Co-occurrence of codes in a Work does not establish a relation. |
| SQ2b | Which perspectives and contexts are missing from the coded corpus, and where is the answer undetermined because preparation or coding is incomplete? | Coverage map with explicit field states and a bounded account of corpus gaps. No inference to the entire research field. |
| SQ3a | Which mitigation is proposed, demonstrated or evaluated, for which task and source version? | One record per supported mitigation claim, preserving comparator, outcome and conditions. Work-level mitigation status must not be assigned to every technique. |
| SQ3b | Where do effects vary, fail or conflict with abstracts and conclusions? | Contradiction table with separate passages and comparison bases; retain null and adverse findings. |
| SQ4a | How are gender and bias defined, operationalised or left implicit, and which theories are explicitly used? | Full-text coding of definitions and theory references, distinguishing a theory used in the analysis from a passing citation; rules cover operational criteria, examples and quoted definitions in secondary analyses. |
| SQ4b | How do these concepts shape measurement, problem attribution and the proposed solutions? | Comparison of problem framing, actors and success criteria, distinguishing the source's stance from our interpretation. |
| SQ5a | Which competencies and organisational conditions do sources explicitly name, and which do we infer? | Two separately attributed statement types, each with supporting passages and transfer conditions. |
| SQ5b | Which implications concern practical output checking, critical assessment of evidence, participation or institutional decisions? | A provisional literacy synthesis with counterexamples and limits. It establishes no tested learning effect. |
| SQ5c | Where do general prompting instructions fail to address the tasks, affected groups and institutional conditions described in social work sources? | Compare source-linked findings with the previously selected external framework, The Prompt Report, under [[analysis-methods#Answering the research questions]]. Name the framework passage and version, matching competence, mismatch and transfer limit. |

Model identifiers and study dates qualify historical findings. Results obtained with older LLMs are not current performance claims. Sources' own study quality and the quality of our extraction are assessed separately.

## Comparison of three analysis procedures

All procedures use the same declared set of unique Works and exact source Versions. They answer different analytical questions, so agreement between their prose outputs is not an accuracy measure.

| Procedure | Input and operation | Output | Specific review question |
|---|---|---|---|
| Structured deductive extraction | Full texts and a fixed extraction form for mechanism, groups, mitigation, evidence status and limitations | Comparable evidence records | Does every populated field have appropriate support, and are relevant findings omitted? |
| Open thematic analysis | Full texts without the existing codebook or other agents' outputs; derive initial codes, then group them into candidate themes | Passage-to-code-to-theme chains | Does the theme add a defensible relation while retaining context, variation and counterexamples? |
| Comparative framing analysis | Full texts and questions about problem representation, causes, responsible actors, solutions and success criteria | Comparative interpretive matrix | Is each attributed frame supported, and are analyst assumptions or unaddressed issues labelled as interpretations? |

The mixed-genre open analysis is an exploratory thematic procedure. It is not a completed thematic synthesis of qualitative primary studies or a claim to reflexive thematic analysis. Likewise the framing exercise is a bounded component for the selected interpretive approach, not a completed Critical Interpretive Synthesis. Existing choices in [[analysis-methods#Synthesis layer]] remain in force.

## Evidence record and source preparation

Before the next recorded run, freeze a manifest of selected Work and Version identifiers, reading-file hashes, extraction provenance, inclusion basis, eligibility holds and producer track. Preserve duplicate bibliographic records; count a resolved underlying Work once. Exclude held evidence from scholarly claims until the relevant hold is resolved. Do not treat the agent's Include label as a human screening decision.

A trial record carries the question ID, exact source identity, section/page/line locator, short evidence passage, extracted statement, evidence type, study conditions, uncertainty and producer. Evidence types distinguish an author's own empirical finding, a cited finding, an author's recommendation and our analytical transfer. Preserve competing readings rather than resolving them by majority vote between agents.

Record the actual LLM identifier exposed by the runner, prompt version, date, input and output paths, settings, source-access failures and review changes. If an identifier or parameter is unavailable, record that limitation. Hashes captured later must be labelled retrospective, never as a pre-run manifest. Figures and tables missing from the Markdown extraction require checking against the source document before using their values.

These are requirements for the trial records, not new production-schema fields. Existing annotation and Assertion contracts remain authoritative under [[data]] and [[research-vault]]. Register and validate any later format extension before integrating it into the production pipeline.

## Review and evaluation design

The exploratory chat exercises are documented in [[journal#2026-10-31: Compare analysis procedures and locate the paper work]]. They motivate the following prospective validation. They provide neither a human reference nor a runtime or accuracy benchmark.

1. Select a small, heterogeneous development set and a separate held-out evaluation set from eligible existing Works. Cover direct social-work applications, technical LLM studies, literacy work and conceptual or policy contributions where available. Record selection reasons and unfilled strata. Freeze the evaluation set before prompt refinement; disclose any prior exposure of reviewers to its existing annotations.
2. Use the development set to clarify the extraction form, ambiguous code boundaries and the thematic/framing prompts. Freeze these versions before evaluating. If a rule changes after evaluation begins, rerun affected cases and keep both versions.
3. Run each procedure on the same held-out sources in separate contexts, with existing annotations and other procedures' outputs withheld. Repeat runs under the same recorded configuration to inspect stability. Operational separation does not establish epistemic independence between LLMs.
4. Have a source-review agent other than the producer check each extracted claim and interpretive chain against the full text. Record unsupported, overstated, misattributed, context-lost and source-mismatched claims separately. Recheck corrections against their exact artifact version.
5. Domain experts independently prepare reference extractions before seeing the agent outputs, then adjudicate differences with reasons. Reference coverage must include relevant findings omitted by all agents. Keep unresolved interpretations explicit. This work is separate from PRISM's existing human screening interface.
6. For themes and frames, domain experts assess traceability, contextual fidelity, attention to counterexamples and usefulness for the paper question. Alternative defensible interpretations are retained. Do not score all qualitative interpretations against one supposedly exhaustive gold label.
7. Integrate accepted evidence into the existing distillate and Assertion chain. Source review, deterministic validation, domain verification and publication approval retain their separate authority under [[governance]]. Only then update answer chapters and manuscript claims.

| Evaluation question | Observation to record | Interpretation limit |
|---|---|---|
| E1: Are claims supported and correctly attributed? | Counts and denominator of fully supported, corrected, unsupported and unresolved claim records; error types and examples | Correctness concerns the declared source and scope, not truth of the underlying study. |
| E2: Which relevant findings are missed? | Supported reference findings recovered divided by all adjudicated reference findings, plus omission examples | Recall is meaningful only against an explicitly scoped and sufficiently complete reference. |
| E3: Are outputs stable under repetition? | Changes in extraction fields, support and omissions; overlap and differences in theme evidence | Stable repetition may reproduce the same error. Theme wording alone is not a reliability measure. |
| E4: What does human review require? | Active extraction time, verification time, corrections and unresolved decisions, separately from machine runtime | Compare quality-adjusted end-to-end workflows. Avoid rereading the same source in a fixed order as a time-saving comparison. |
| E5: What does combining procedures add? | Distinct accepted findings, contradictions found, unsupported inferences introduced and changes to the synthesis | A methodological benefit is judged from evidence and usefulness, not output length or agreement alone. |

For a later efficiency comparison, counterbalance comparable source assignments between manual extraction and agent-assisted review and declare the stopping and acceptance rules beforehand. The exploratory set cannot establish population-level reliability or justify significance testing. No numerical pass threshold has been selected. A substantive pilot conclusion requires every reported claim to have a resolvable source and an explicit review outcome; unresolved support cannot be presented as accepted evidence.

## Integration into the paper

The structured records establish the evidence base. Open coding proposes additions and relations that the predefined categories miss. Framing analysis examines whether apparently similar interventions address the same problem and success criterion. For SQ5, explicitly compare accepted findings with the previously selected framework, The Prompt Report. Read and bind the relevant framework passages before treating a mismatch as established; record whether it concerns task coverage, evidence, affected groups or organisational conditions. The final synthesis retains these differences and marks the step from source findings to proposed literacy implications.

The paper reports performed and planned work in separate tenses and names its actual review authority. PRISM describes the digital screening workflow, PRISMA describes selection reporting, and the analysis procedures describe how content is interpreted. The identification history must reflect the documented AI-assisted searches and manual curation, rather than copying a conventional database-search narrative. Historical extraction studies justify a design choice only within their studied tasks; their reported LLM performance is not transferred to the present workflow.

## Open scholarly decisions

- The author group decides the final paper question and the adult-learning connection within the accepted publication context.
- Domain experts resolve the definition and secondary-source attribution boundaries before the held-out evaluation.
- The reference reviewers and their declared scope of responsibility must be assigned before human verification is claimed.
- Numerical acceptance criteria and the scope of any efficiency claim remain to be specified before a confirmatory comparison.

## Evaluation preparation of 31 October 2026

The [evaluation package](../evaluation/paper-2026-10-31/README.md) owns source-version selection, known-exposure exclusions and the repeated-run design. Its revised source packets and human-v2 forms supersede the original inputs for future evaluation. [Technical source review](../evaluation/paper-2026-10-31/sources-v2/review.md) and [the development comparison](../evaluation/paper-2026-10-31/development-v2/comparison.md) document bounded checks. V2 is qualitatively more inspectable, with residual overstatements and selective omissions. Removing the word cap and adding identity headers confound attribution to prompt changes alone. Final correction, equal-input and runtime freeze, and independent human reference creation precede evaluation. No held-out run or human verification is complete.
