---
title: "Analysis Design: Operationalizing the Prompt-Engineering Question (DRAFT)"
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: draft
language: en
version: "0.1"
created: 2026-06-09
updated: 2026-06-09
authors: [Christopher Pollin]
generated-with: Claude Code
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
related: [plan, data, specification, verification-empirical-core, conformance-audit]
---

**DRAFT. Nothing in this document is frozen. Every proposal here is input for the 1 July 2026 meeting; the decisions taken there are recorded as ADRs in [[specification]], and the frozen schema then goes into the Excel template, `benchmark/config/categories.yaml`, and the P3 import-bridge validation, per the TP4 work plan in [[plan]].**

This document is the TP4 deliverable of [[plan]]: it turns the programme question, how prompt engineering must be adapted for social work, gender, and bias contexts, into an operationalized analysis design. It proposes (1) answerable sub-questions, (2) analysis fields that screening captures per included paper, (3) coding instructions fit for the established Excel workflow, (4) the concrete Excel schema extension, and (5) the analysis methods over the coded corpus. Section 6 lists the decisions the meeting must take. The hard ordering from [[plan]] holds: the TP4 freeze precedes the B2 screening start, because the update's Excel template must carry the analysis fields from the first decision onward.

The design problem in one sentence: the first review round produced a corpus with binding inclusion decisions and ten binary topic categories, but no fields that say *what* an included paper contributes to the prompt-engineering question; a paper coded `Prompting: Ja` could recommend role prompts for case documentation or benchmark chain-of-thought debiasing, and the current schema cannot tell these apart.

## 1. From programme question to sub-questions

The programme question is not answerable as posed: "adapted" presupposes a baseline (general-purpose prompt engineering), a target (social work, gender, and bias contexts), and a kind of answer (techniques, constraints, gaps). Decomposed along those three presuppositions:

**SQ1 (technique inventory and its evidence).** Which prompting techniques does the literature on AI in social work, gender, and bias contexts discuss, recommend, or evaluate, and what kind of evidence supports each technique? Answerable as: frequency of technique codes over the included corpus, crossed with evidence type and mitigation status. SQ1 establishes the baseline side: which part of the general prompt-engineering repertoire reaches this literature at all.

**SQ2 (bias-to-mitigation mapping).** Which bias axes and harm types does this literature address, and which mitigation approaches, at which intervention stage from prompt formulation to organisational process, are proposed or tested against them? Answerable as: co-occurrence of bias-axis, harm-type, and mitigation codes, with mitigation status separating proposals from evaluated interventions. SQ2 is the core of the adaptation question: adaptation, if it exists in the literature, shows up as specific mitigations bound to specific biases.

**SQ3 (domain-specific constraints and gaps).** Which requirements specific to social work populations and practice contexts does the literature state that general-purpose prompt engineering guidance does not cover, and for which practice fields is there no evidence at all? Answerable as: population-context frequencies, the zero cells of the technique-by-population table, and a qualitative synthesis of explicit adaptation statements. SQ3 produces the research-gap map, which is also the conceptual feed for the planned Fair Bench foundation ([[project]], secondary goal).

The three sub-questions are deliberately answerable from per-paper coding plus aggregation. They do not require new experiments, and they keep the follow-up paper's empirical section computable from the coded Excel by committed script, in line with the claims discipline of [[plan]] and the design lesson of [[conformance-audit]] that reported numbers must be derivations, not prose.

## 2. Analysis fields

Seven new fields plus one reused field. Each field exists because at least one sub-question needs it; fields that serve no sub-question were cut.

| Field | Captures | Serves | Vocabulary basis |
|---|---|---|---|
| `AN_Prompt_Techniques` | which prompting technique families the paper discusses | SQ1 | The Prompt Report taxonomy (Schulhoff et al. 2025), see 2.1 |
| `AN_Bias_Axes` | along which social axes bias is analysed | SQ2 | project category schema plus intersectionality framework, see 2.2 |
| `AN_Harm_Types` | which concrete harm mechanisms are named | SQ2 | Gallegos et al. 2024 harm taxonomy, see 2.3 |
| `AN_Mitigation_Stage` | where in the lifecycle a mitigation intervenes | SQ2 | Gallegos et al. 2024 mitigation stages, extended, see 2.4 |
| `AN_Mitigation_Status` | how far the mitigation is carried (proposed, demonstrated, evaluated) | SQ1, SQ2 | project-defined ordinal, see 2.5 |
| `AN_Population` | social work practice field or population addressed | SQ3 | scoping-review practice domains, extended, see 2.6 |
| `AN_Coding_Basis` | which text the coding was based on | audit trail | project-defined, see 2.7 |
| `Studientyp` (reused) | evidence type of the paper | SQ1, SQ2 | existing `study_types` in `benchmark/config/categories.yaml`, see 2.8 |

### 2.1 AN_Prompt_Techniques

Grounding: The Prompt Report (Schulhoff et al., "The Prompt Report: A Systematic Survey of Prompt Engineering Techniques", arXiv:2406.06608v6, 2025) assembles a taxonomy of 58 text-based prompting techniques. In version 6, the text-based techniques are organized into five top-level groups (sections 2.2.1 to 2.2.5): In-Context Learning (ICL), Thought Generation, Decomposition, Ensembling, and Self-Criticism; zero-shot techniques, including role prompting, sit inside the ICL group. Sources: https://arxiv.org/abs/2406.06608 and https://arxiv.org/html/2406.06608v6 (both accessed 2026-06-09).

Closed list (multi-select):

- `ICL` (in-context learning: few-shot examples, exemplar selection, zero-shot instruction techniques)
- `Thought_Generation` (chain-of-thought and variants)
- `Decomposition` (problem split into sub-prompts, e.g. least-to-most, plan-and-solve)
- `Ensembling` (multiple prompts or runs aggregated, e.g. self-consistency)
- `Self_Criticism` (model checks or revises its own output, e.g. self-refine, chain-of-verification)
- `Role_Persona` (prompts assigning a persona or professional role)
- `General_Guidance` (prompting discussed or recommended without any named technique)
- `None` (prompting not discussed)

`Role_Persona` is a named technique inside the taxonomy's zero-shot family, promoted here to its own code because role and persona prompts are the form in which prompting most often appears in professional-practice guidance, and folding them into `ICL` would erase exactly the signal SQ1 needs. This promotion is a proposal, not part of the cited taxonomy (open decision 6).

### 2.2 AN_Bias_Axes

Grounding: this list is deliberately internal. The corpus's social dimension already carries `Gender`, `Diversitaet`, and `Feministisch` as binary topic flags ([[data]], category schema), and the project's theoretical framework is explicitly intersectional ([[project]], Crenshaw operationalization). The axes list refines, rather than imports, that scheme; no external taxonomy is cited because none was verified as canonical for axis enumeration, and pretending otherwise would violate the citation discipline of this knowledge base.

Closed list (multi-select):

- `Gender`
- `Race_Ethnicity`
- `Intersectional` (at least two axes analysed in their interaction, not merely co-mentioned)
- `Disability`
- `Age`
- `Socioeconomic`
- `Language_Culture`
- `Sexual_Orientation_Identity`
- `Other_Axis` (named axis outside this list; name it in `AN_Notes`)
- `None` (no bias axis addressed)

### 2.3 AN_Harm_Types

Grounding: Gallegos et al., "Bias and Fairness in Large Language Models: A Survey" (Computational Linguistics 50(3), 2024; arXiv:2309.00770v3) defines, in its Table 1, a taxonomy of social harms: the representational harms derogatory language, disparate system performance, erasure, exclusionary norms, misrepresentation, stereotyping, and toxicity, and the allocational harms direct discrimination and indirect discrimination. Sources: https://arxiv.org/abs/2309.00770 and https://arxiv.org/html/2309.00770v3 (both accessed 2026-06-09).

Closed list (multi-select), taken verbatim from that taxonomy plus `None`:

- `Derogatory_Language`
- `Disparate_Performance`
- `Erasure`
- `Exclusionary_Norms`
- `Misrepresentation`
- `Stereotyping`
- `Toxicity`
- `Direct_Discrimination`
- `Indirect_Discrimination`
- `None`

This field is proposed as optional (open decision 2): it is the hardest field to code reliably, because it requires mapping the paper's own harm vocabulary onto the taxonomy, and SQ2 survives without it at reduced resolution (bias axes plus mitigation codes still answer the mapping question, only without the harm mechanism).

### 2.4 AN_Mitigation_Stage

Grounding: Gallegos et al. 2024 (same source and access date as 2.3) classifies bias mitigation techniques "by their intervention during pre-processing, in-training, intra-processing, and post-processing". These four stages are model-side. The social work literature, however, often locates mitigation outside the model: in the practitioner's prompt formulation at use time, or in organisational measures such as guidelines, training, and human oversight. Two extension codes capture this; they are project additions, not part of the cited taxonomy.

Closed list (multi-select):

- `Pre_Processing` (data or input modification before training, per Gallegos et al.)
- `In_Training` (parameter changes via training, per Gallegos et al.)
- `Intra_Processing` (inference-time changes without retraining, per Gallegos et al.)
- `Post_Processing` (output rewriting or filtering, per Gallegos et al.)
- `Prompt_Practice` (user-side prompt formulation strategies at use time; project addition)
- `Organisational_Process` (guidelines, training, human oversight, workflow design; project addition)
- `None` (no mitigation proposed or discussed)

### 2.5 AN_Mitigation_Status

Project-defined ordinal, single-select. Captures how far the paper carries its mitigation, which separates the recommendation literature from the evidence literature (SQ1, SQ2):

- `Evaluated` (mitigation measured against data or a comparison condition)
- `Demonstrated` (worked example shown, no measurement)
- `Proposed` (described or recommended only)
- `None` (no mitigation in the paper)

### 2.6 AN_Population

Grounding: a scoping review of social work practice and artificial intelligence (Gardiner, O'Donoghue, Yeung, and Jewel: "Social work practice and artificial intelligence: A scoping review", Aotearoa New Zealand Social Work 38(1), 2026, https://anzswjournal.nz/anzsw/article/view/1267, accessed 2026-06-09) maps the AI-and-social-work literature 2014 to 2024; its reviewed literature concentrates in child protection and child welfare, with health care, homelessness and youth services, social assistance and welfare administration, and mental health also appearing among the covered settings (the domain picture was corroborated from the article page and its reference list; the full text is available only as a PDF galley). The closed list starts from those domains and adds two codes the corpus demonstrably needs (professional education, which is where AI literacy literature lives, and a code for papers without any social work setting), plus a general bucket:

- `Child_Family_Welfare`
- `Mental_Health`
- `Health_Care`
- `Homelessness_Youth`
- `Social_Assistance_Admin`
- `Education_Professional` (education and training of social work students or professionals)
- `General_Social_Work` (social work addressed without a specific field)
- `Not_SW_Specific` (no social work setting; e.g. general LLM bias papers)

Multi-select. The list is the least grounded of the vocabularies and is explicitly up for revision at the meeting and in the pilot (open decision 6).

### 2.7 AN_Coding_Basis

Single-select audit field: `Fulltext`, `Knowledge_Doc`, `Abstract`. The conformance audit's third infrastructure lesson is that every decision needs its actor and its evidence basis ([[conformance-audit]]); the same holds for analysis coding. The field matters concretely because text availability is uneven: per [[conformance-audit]], 236 corpus papers have a served knowledge document, 75 have only an abstract, and 15 have no text at all (source: `docs/data/fulltext_index.json` counts). Several analysis fields, notably `AN_Prompt_Techniques` and `AN_Harm_Types`, are unlikely to be codable from an abstract; the pilot measures exactly this ([[plan]], TP4 step 3).

### 2.8 Studientyp (reused, not duplicated)

The evidence-type field already exists: the `Studientyp` column of the established Excel, with the controlled vocabulary `Empirisch`, `Experimentell`, `Theoretisch`, `Konzept`, `Literaturreview`, `Unclear` from `benchmark/config/categories.yaml` (`study_types`). No new column is added; instead, `Studientyp` becomes a required, vocabulary-validated field for included papers in the update round. The first round documented vocabularies without enforcing them, and the audit found the consequences (out-of-vocabulary and empty cells in the exclusion reasons, [[conformance-audit]]); the P3 bridge validation closes that for `Studientyp` as for every other coded field.

## 3. Coding instructions

Written for the Excel workflow: the coders are the reviewing colleagues (R1, R2), the coding surface is the known spreadsheet, and the legend sheet (section 4) carries the code lists and these instructions in compact form.

General rules:

1. Code only papers with the binding decision `Include`. Excluded papers get no analysis codes.
2. Code from the deepest text available and record it in `AN_Coding_Basis`. Use `None` only when the paper genuinely does not address the field's subject; when a field is not decidable from the available text, write that limitation into `AN_Notes`.
3. Never leave an analysis cell empty. Every field has a `None` code; an empty cell is a validation error at import. (First-round lesson: empty and out-of-vocabulary cells in `Exclusion_Reason`, [[conformance-audit]].)
4. Multi-select fields take one or more codes, semicolon-separated, codes verbatim from the legend sheet (e.g. `Gender;Intersectional`). Order does not matter. No free text in coded columns; free text goes to `AN_Notes`.
5. Code what the paper does, not what it cites. A paper that only references chain-of-thought work without discussing the technique does not get `Thought_Generation`.

Per field:

- `AN_Prompt_Techniques`: assign a technique group only when the paper names or recognizably describes a concrete technique within it. Prompting discussed only in general terms ("formulate prompts carefully") is `General_Guidance`. Prompts that assign a persona or professional role are `Role_Persona`. `None` when prompting does not occur; this is legitimate, since inclusion can rest on other technology categories.
- `AN_Bias_Axes`: code an axis when the paper analyses or addresses bias along it, not when the axis appears only as a demographic descriptor. `Intersectional` requires at least two axes treated in their interaction, mirroring the intersectionality criterion already used for `Feministisch` ([[data]], category schema).
- `AN_Harm_Types` (if kept): code only harms the paper names or demonstrates as a mechanism; match against the definitions of Gallegos et al. Table 1, summarized on the legend sheet. When the paper's harm does not fit any code, use `AN_Notes`, do not force a code.
- `AN_Mitigation_Stage`: the four model-side stages follow Gallegos et al.; use them only when the paper's mitigation actually intervenes there. Practitioner-side prompt strategies are `Prompt_Practice`; guidelines, training, oversight, and workflow measures are `Organisational_Process`. A paper may carry several codes.
- `AN_Mitigation_Status`: code the highest level the paper reaches, in the order Evaluated, Demonstrated, Proposed, None.
- `AN_Population`: code the setting or population the paper addresses, not the setting it speculates about. Papers on LLM bias without any social work setting are `Not_SW_Specific`.
- `Studientyp`: per the existing definitions in `categories.yaml`; now mandatory for included papers.

Disagreement handling: if the analysis fields are dual-coded (open decision 5), divergent codes are reconciled in the same downstream step as divergent decisions (PRISM, Daten & Repo surface, [[plan]] B3), and per-field agreement is reported under the TP3 framing rules: divergence decomposed and described, never reported as an error rate of either coder ([[verification-empirical-core]], interpretation assessment).

## 4. Excel schema extension

The established capture format is the column shape of `benchmark/data/human_assessment.csv` (decided 2026-06-09, [[plan]] P3): `ID, Zotero_Key, Author_Year, Title, DOI, Item_Type, Publication_Year, Language, Source_Tool, Abstract, URL,` ten category columns, `Studientyp, Decision, Exclusion_Reason, Notes`. The extension appends columns after `Notes`, so every existing parser and the P3 bridge see an unchanged prefix.

New columns, in order:

| Column | Type | Closed value list |
|---|---|---|
| `AN_Prompt_Techniques` | multi (semicolon) | `ICL`, `Thought_Generation`, `Decomposition`, `Ensembling`, `Self_Criticism`, `Role_Persona`, `General_Guidance`, `None` |
| `AN_Bias_Axes` | multi (semicolon) | `Gender`, `Race_Ethnicity`, `Intersectional`, `Disability`, `Age`, `Socioeconomic`, `Language_Culture`, `Sexual_Orientation_Identity`, `Other_Axis`, `None` |
| `AN_Harm_Types` | multi (semicolon), optional field | `Derogatory_Language`, `Disparate_Performance`, `Erasure`, `Exclusionary_Norms`, `Misrepresentation`, `Stereotyping`, `Toxicity`, `Direct_Discrimination`, `Indirect_Discrimination`, `None` |
| `AN_Mitigation_Stage` | multi (semicolon) | `Pre_Processing`, `In_Training`, `Intra_Processing`, `Post_Processing`, `Prompt_Practice`, `Organisational_Process`, `None` |
| `AN_Mitigation_Status` | single | `Evaluated`, `Demonstrated`, `Proposed`, `None` |
| `AN_Population` | multi (semicolon) | `Child_Family_Welfare`, `Mental_Health`, `Health_Care`, `Homelessness_Youth`, `Social_Assistance_Admin`, `Education_Professional`, `General_Social_Work`, `Not_SW_Specific` |
| `AN_Coding_Basis` | single | `Fulltext`, `Knowledge_Doc`, `Abstract` |
| `AN_Notes` | free text | none (ambiguities, near-miss codes, `Other_Axis` names) |

Additionally, `Studientyp` (existing column) becomes required for `Decision = Include`, validated against `study_types` in `categories.yaml`.

Mechanics in the workbook: a `Legend` sheet lists every column, its codes, and one-line definitions; single-select columns (`AN_Mitigation_Status`, `AN_Coding_Basis`, `Studientyp`) get Excel data-validation dropdowns; multi-select columns are typed as semicolon lists, which Excel cannot validate natively. Enforcement therefore happens at the P3 import bridge: per-cell vocabulary check (split on `;`, trim, match against the closed list), empty-cell check on all `AN_` columns for included papers, and a visible import report, never silent acceptance, exactly as already specified for the exclusion reasons in [[plan]] P3. The freeze also writes the vocabularies into `benchmark/config/categories.yaml` as a new `analysis_fields` block, so tool, bridge, and template read one source.

An alternative encoding exists and goes to the meeting (open decision 3): one binary column per code (`AN_PT_ICL: Ja/Nein`, etc.), which matches the established one-column-per-category pattern of the ten topic categories and gives full dropdown validation, at the price of roughly thirty additional columns (one per code of the four multi-select fields without their None codes, counted from the lists above; about forty when the optional harm field is kept). The semicolon encoding is proposed as primary because it keeps the sheet readable; the bridge can ingest either.

## 5. Analysis methods over the coded corpus

The analysis corpus is the set of papers with a binding human `Include`: in the first round 142 of 303 human decisions, of which 134 sit in the 291 benchmark pairs (source: [[verification-empirical-core]], benchmark core table), plus whatever the Stage B update adds. Whether the first-round included papers are retro-coded with the new fields is open decision 4; SQ1 to SQ3 can be answered on the update batch alone, but coverage and the gap map are stronger with retro-coding.

Three method layers, in ascending interpretive depth:

**Frequencies.** Per-field code frequencies over the coded corpus, computed by a committed script from the imported data, never by hand ([[conformance-audit]], fifth lesson: reported numbers must be derivations). Multi-select fields are counted per code (a paper can carry several codes) with the paper count as denominator, stated wherever reported. Outputs: the technique inventory (SQ1), the bias-axis and mitigation profiles (SQ2), the population coverage (SQ3).

**Co-occurrence.** Contingency tables over code pairs: `AN_Prompt_Techniques` by `AN_Bias_Axes` (which techniques are discussed against which biases), `AN_Prompt_Techniques` by `AN_Population` (which techniques reach which practice fields), `AN_Mitigation_Stage` by `Studientyp` and by `AN_Mitigation_Status` (where mitigation claims have evidence behind them). Zero and near-zero cells are read as candidate research gaps, which is the SQ3 result and the Fair Bench feed. No significance testing is planned: at corpus scale the tables are descriptive, and the project's claims discipline forbids dressing description as inference.

**Qualitative synthesis.** A structured synthesis along SQ1 to SQ3, written as a knowledge document after coding. Every synthesis claim is grounded in the coded fields plus quoted text; where the coding ran through PRISM, the pinned evidence snippets (evidence map, FR-13, [[data]]) are the quotable basis, so the synthesis inherits the same auditability as the screening decisions. Explicit adaptation statements (papers saying what general prompt guidance misses in social work contexts) are collected verbatim during coding via `AN_Notes` and synthesized as the direct answer to SQ3.

If the analysis fields are dual-coded or carry an advisory LLM track (open decision 5), per-field human-human or human-LLM agreement is reported with the full decomposition vocabulary established in [[verification-empirical-core]] (observed agreement, kappa, PABAK, marginals), and divergences are treated as findings about the field definitions, feeding the pilot revision loop. A known subsample caveat carries over from the first round: category-level coding there rests on fewer pairs than decision-level coding, because coders skipped category cells on workflow exclusions (n = 234 to 238 of 291, [[verification-empirical-core]], category kappas); the never-empty rule in section 3 is designed to prevent the analogous hole in the analysis fields.

Validation path before freeze, per [[plan]] TP4 step 3: pilot the draft fields on a small stratified sample of already-included papers (strata: text availability per [[conformance-audit]], and Prompting yes/no from the existing categories), measure fill rate and collect ambiguity notes, revise definitions, then freeze.

## 6. Open decisions for the 1 July 2026 meeting

1. **Sub-question set.** Confirm, sharpen, or replace SQ1 to SQ3. In particular: is the gap map (SQ3) a deliverable of the follow-up paper or of the Fair Bench preparation, or both?
2. **Field set and obligation.** Confirm the seven fields; decide whether `AN_Harm_Types` is kept (proposed: optional), dropped, or made required.
3. **Encoding.** Semicolon multi-select columns (proposed) versus one binary Ja/Nein column per code (matches the established category pattern, full dropdown validation, roughly thirty more columns).
4. **Retro-coding scope.** Code the analysis fields only for the update batch, or also retrospectively for the first round's included papers; if retro, who codes and on which text basis.
5. **Coding setup.** Single coder per paper with spot checks, full dual coding by R1 and R2, or single human coding plus an advisory LLM track (which would extend the project's dual-track design to the analysis layer and require its own pre-specified protocol, per the R3 lesson in [[plan]]).
6. **Vocabulary details.** Keep or revert the `Role_Persona` promotion out of the zero-shot family; finalize the `AN_Population` list; decide whether `Other_Axis` stays or the axes list is extended after the pilot.
7. **Pilot parameters.** Sample size and strata for the TP4 pilot, and the answerability threshold (which fill rate or ambiguity level forces a definition revision).
8. **Studientyp reuse.** Confirm that the existing `Studientyp` column, vocabulary-enforced, is the evidence-type field, and that no duplicate column is added.

## Sources

Repository sources for every number used: [[verification-empirical-core]] (303 human decisions, 142 Include, 291 pairs, 134 paired includes, category subsample n = 234 to 238), [[conformance-audit]] (text availability 236/75/15, vocabulary-hygiene findings), `benchmark/data/human_assessment.csv` (column shape), `benchmark/config/categories.yaml` (categories, exclusion reasons, study types).

Web sources, all opened on 2026-06-09:

1. Schulhoff, Sander, et al.: "The Prompt Report: A Systematic Survey of Prompt Engineering Techniques." arXiv:2406.06608v6 (2025). https://arxiv.org/abs/2406.06608 and https://arxiv.org/html/2406.06608v6 (accessed 2026-06-09). Taxonomy of 58 text-based prompting techniques in five top-level groups (In-Context Learning, Thought Generation, Decomposition, Ensembling, Self-Criticism); Role Prompting under section 2.2.1.3, Zero-Shot Prompting Techniques, inside the In-Context Learning group.
2. Gallegos, Isabel O.; Rossi, Ryan A.; Barrow, Joe; Tanjim, Md Mehrab; Kim, Sungchul; Dernoncourt, Franck; Yu, Tong; Zhang, Ruiyi; Ahmed, Nesreen K.: "Bias and Fairness in Large Language Models: A Survey." Computational Linguistics 50(3), 2024. arXiv:2309.00770v3. https://arxiv.org/abs/2309.00770 and https://arxiv.org/html/2309.00770v3 (accessed 2026-06-09). Harm taxonomy (Table 1) and mitigation taxonomy by intervention stage (pre-processing, in-training, intra-processing, post-processing).
3. Gardiner, Blake; O'Donoghue, Kieran; Yeung, Polly; Jewel, Ziaul Islam: "Social work practice and artificial intelligence: A scoping review." Aotearoa New Zealand Social Work 38(1), 2026. https://anzswjournal.nz/anzsw/article/view/1267 and https://doi.org/10.11157/anzswj-vol38iss1id1267 (accessed 2026-06-09). Scoping review of AI in social work practice 2014 to 2024; practice-domain picture of the literature (child protection and child welfare dominant; health care, homelessness and youth services, social assistance, and mental health also appearing), corroborated from the article page and its reference list, full text available only as PDF galley.

*Updated: 2026-06-09. Written by the orchestrating agent from the TP4 author agent's verbatim content with the verifier's four fixes applied (citation completion 2.6 and source 3, column-count correction in section 4 and open decision 6, Role Prompting location note in source 1); the subagent Write guard blocked the original write.*
