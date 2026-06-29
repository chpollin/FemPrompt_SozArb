---
title: Update Protocol (Round 2 Pre-Registration)
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: draft
language: en
version: "0.2"
created: 2026-06-09
updated: 2026-06-29
authors: [Christopher Pollin]
generated-with: Claude Code
topics: ["[[Pre-Registration]]", "[[Coding Scheme]]"]
related: [plan, verification, data, specification, methods, reuse-setup]
---

This document is the pre-registration protocol for the second literature round (TP5 and Stage B2 of [[plan]]). It exists because the first round had no pre-specified protocol, the one gap of the conducted review that cannot be repaired retrospectively (PRISMA-trAIce M1 and PRISMA 2020 item 24, see [[verification]]). The protocol closes that gap prospectively, carries the analysis-field design the round must capture at screening time (the Analysis fields section), and binds the RIS conversion to a reproducible procedure (the RIS conversion section). It is committed, in finalized form, before the first round 2 search runs; any change after the first run is recorded as a dated amendment, never as a silent edit. The protocol describes the workflow and how large language models are used within it; it makes no efficiency claims. It is a draft until the open items of section 10 and the analysis-field decisions are resolved.

## 1. Objectives

1. Update the existing first-round corpus with literature published since the round 1 search execution, using the same identification instrument: parallel deep research queries with an identical prompt across systems, followed by deduplication, dual assessment, and human-binding screening.
2. Conduct the round under full PRISMA 2020 plus PRISMA-trAIce conformance by construction: pre-specified protocol (this document), executed prompts committed verbatim with run metadata, enforced controlled vocabulary at capture, per-record reviewer identity, separate AI and human decision tracks, generated flow and disclosure artifacts.
3. Capture the analysis fields (prompt techniques, bias axes, harm types, mitigation, population; see the Analysis fields section) at screening time, so the round 2 corpus can carry the analysis of how prompt engineering must adapt for social work, gender, and bias contexts.
4. Produce the data for the two-round comparison: round 1 is rendered retrospectively with named gaps (Stage R, see [[verification]]), round 2 demonstrates the same record machinery under prospective conformance.

## 2. Eligibility criteria

Eligibility is defined by `benchmark/config/categories.yaml`, version 1.2, and is used unchanged: the ten binary categories, the inclusion logic (at least one technology dimension AND at least one social dimension), and the controlled exclusion vocabulary are not restated here; the YAML file is the single source of truth.

The analysis-field extension adds capture fields for the analysis question. These are descriptive coding fields, not eligibility criteria. If merging the extension into `categories.yaml` bumps the file version, the eligibility-relevant content remains identical to v1.2; any change to eligibility-relevant content would be a protocol amendment.

Additional time restriction for this round: only records published in or after October 2025 enter screening (section 4 derives the cutoff). Earlier records are out of scope for round 2 because round 1 covered them; if a search returns earlier records, they are removed at deduplication or excluded with the existing vocabulary, not silently dropped.

## 3. Information sources

The same deep research systems as round 1, named as the repository documents them (`prompts/deep-research-template.md`, four Deep Research interfaces; [[methods]], Phase 1; RIS artifacts in `deep-research/restored/`).

| Lane | System | Status |
|---|---|---|
| L1 | ChatGPT (OpenAI) Deep Research | as round 1 |
| L2 | Claude (Anthropic) Deep Research | as round 1 |
| L3 | Gemini (Google) Deep Research | as round 1 |
| L4 | Perplexity Deep Research | as round 1 |
| L5 | Claude Code web research lane | optional, new in round 2 |

L5 is an optional fifth lane: a Claude Code session with web search tools executes the identical prompt agentically and writes its raw output to a file. It is documented exactly like the other lanes (executed prompt verbatim, provider and model version, run date, raw output committed at run time) and its results carry their own Source_Tool value so the lane stays separable in every analysis. Whether L5 runs is a human decision recorded before the first search. Manual identification remains permitted, as in round 1, recorded with Source_Tool Manual.

For every lane, the round 1 provenance lesson applies (see [[verification]], what the infrastructure must record): the executed prompt verbatim, the provider and model version, the run date, and the raw output are stored as files under `deep-research/round2/` at run time. The RIS conversion of raw outputs is documented and committed this round (round 1 left it unreproducible); the procedure is in the RIS conversion section below.

## 4. Search strategy

### 4.1 The prompt

Round 2 uses the same prompt as round 1, with exactly one added sentence (the time restriction). The full paste-ready text per lane is Appendix A; the identical text is used for all lanes, as in round 1.

Provenance caveat, stated openly: the repository carries two accounts of the round 1 prompt. `deep-research/literature-review-prompt.md` presents a two-part prompt (a KONTEXT block with the research question plus a generic analysis prompt) as the prompt that generated the round 1 outputs. `prompts/CHANGELOG.md` and [[verification]] record that the exactly instantiated round 1 prompt was never committed and is genuinely lost, with only the parametric template restored from Git history. This protocol uses the text of `deep-research/literature-review-prompt.md` as the documented round 1 prompt, because it is the only complete, instantiable prompt text in the repository and is already the referenced basis for the paper. The claim is therefore "round 2 uses the documented round 1 prompt", not "round 2 uses the verbatim executed round 1 prompt"; the latter is unprovable for round 1. Resolving the status of that file is an open item for finalization.

### 4.2 The round 1 cutoff and the time restriction sentence

The round 1 search execution date was not recorded at run time. The repository bounds it to October 2025: the prompt existed and was deleted in October 2025 (`prompts/CHANGELOG.md`); the restored template's source commit `0a98f49` is dated 31.10.2025; the corpus built from the searches was assessed by the 5D track on 2025-11-02. The cutoff is therefore set to October 2025, and the restriction includes the cutoff month itself ("in or after October 2025"), deliberately overlapping the round 1 search period; overlap duplicates are removed by the pre-specified deduplication step, which is cheaper than risking a coverage gap. If a precise execution date emerges from sources outside the repository, the cutoff is corrected by amendment before the first run.

The single added sentence, appended at the end of the prompt:

> Only include literature published in or after October 2025, because work published before October 2025 was already covered by the first search round executed in October 2025, and this time restriction supersedes the year range 2023-2025 stated in task 1.

No other wording of the round 1 prompt is changed. Appendix A flags every deviation inline.

### 4.3 Execution rules

One run per lane, all runs inside one declared execution window. A technically failed run may be retried; every attempt is logged with timestamp in the run record. Repeated runs for result comparison are not part of this protocol (round 1's claim of non-reproducible repeated queries was never auditable, see [[verification]]) and would require an amendment. Results are imported into Zotero collections with the established prefix convention and provenance preserved; `corpus/source_tool_mapping.json` is regenerated to cover the new records.

### 4.4 Deduplication

Deduplication against the existing corpus and within the new batch happens as a separate identification-phase step, before screening, by Zotero key, DOI, and title matching. Round 1 handled duplicates inside screening, which inflated the screening divergence cell (the duplicate decomposition is in [[verification]]). Pre-specifying deduplication before screening removes that artifact class for round 2. The deduplication result (removed records with match reason) is committed as part of the flow data.

## 5. Screening procedure

Capture stays where it works ([[plan]], Zielbild): the reviewing colleagues record categories and decisions in the established Excel format, the column shape of `benchmark/data/human_assessment.csv`, extended for round 2 by:

1. the analysis-field extension (frozen before screening starts, see the Analysis fields section), and
2. a reviewer column carrying neutral reviewer ids (R1, R2), closing the round 1 gap of per-record reviewer identity (see [[verification]]).

The Excel template enforces the controlled vocabulary at input time (dropdown validation for Decision, Exclusion_Reason, category values, and the analysis fields): values like Other or empty reason cells, which round 1 admitted, are impossible by construction.

The completed Excel imports into PRISM over the P3 bridge ([[plan]] Stage A P3): idempotent re-import, import report (added, changed, skipped), validation of vocabulary, category completeness, duplicate Zotero keys, and the analysis fields. Violations are a visible import report, never silent acceptance.

Downstream of the import, the more precise PRISMA steps happen in PRISM: machine-extracted evidence enters as a clearly labelled separate provenance class, human verification of evidence on samples, recording of the text source actually read (raw, knowledge document, abstract), reconciliation of divergent human decisions on the Daten und Repo surface with the consensus decision and process recorded (PRISMA-trAIce M8), and generation of flow, agreement, checklist, and disclosure artifacts from the data.

The dual track runs as in round 1: the offline LLM assessment processes the new batch with the versioned 10K assessment prompt (`benchmark/scripts/run_llm_assessment.py`, governed by `prompts/CHANGELOG.md`) and recorded parameters. Decoding parameters are set explicitly and recorded this round; round 1 left temperature and top-p as unrecorded API defaults (see [[verification]]). The human decision is the binding record; the LLM track is advisory and kept separate. An interactive agent screening lane (as in Stage R3) may run as a third track under its own pre-specified sub-protocol.

## 6. Pre-specified metrics

All agreement reporting for round 2 is fixed in advance, taking the round 1 verification as binding precedent. For the human-LLM decision comparison:

1. Raw confusion matrix cells (both-include, human-include/LLM-exclude, LLM-include/human-exclude, both-exclude), reported before any coefficient.
2. Observed agreement po, Cohen's kappa, PABAK, and kappa-max, reported together as one decomposition; no single coefficient is reported alone.
3. Prevalence index and bias index as the quantitative form of marginal divergence.
4. Per-category kappas over the ten categories.
5. The content-only analysis, pre-specified this time instead of post hoc: pairs whose human exclusion reason is a workflow criterion (Duplicate, No full text, Wrong publication type) are separated out, and metrics 1 to 4 are reported for the content-only subset alongside the full matrix. With deduplication moved before screening (section 4.4), the Duplicate stratum should be near empty in round 2; its size is itself a reported check on the deduplication step.

The round 1 baseline values for comparison are taken exclusively from [[verification]] (the benchmark core and content-only tables); no baseline number is restated here, and the comparison script reads them from the committed source. No error-rate language: divergence quantities are divergence against a consolidated human annotation, not error, and round 1 has no inter-human baseline.

If both reviewers screen a shared subset (or the full batch) independently, inter-human agreement is computed from the reviewer column with the same decomposition; this supplies the inter-human baseline round 1 lacks. Whether the colleagues screen the full batch or a split is an open decision ([[plan]], Open items) and must be fixed before screening starts; the metric set does not change either way.

All metrics are computed by committed scripts, never by hand; every published number traces to script output.

## 7. Roles

Neutral ids; no personal names in committed files.

| Id | Role |
|---|---|
| R1 | Reviewing colleague, human track, binding decisions |
| R2 | Reviewing colleague, human track, binding decisions; second coder on the shared subset |
| OP | Technical operator: runs searches, pipeline, LLM track, imports; does not screen |
| LLM | Offline 10K assessment track, advisory |
| AG | Optional interactive agent screening track, advisory |

The mapping of ids to persons is kept outside the repository. The human decision is the binding record in every case.

## 8. Committed before the first search runs

The pre-registration is complete when the following are in the repository, in this order, before any round 2 search executes:

1. This protocol, finalized (open items of section 10 resolved, status no longer draft).
2. The exact paste-ready prompt texts per lane (Appendix A) as a versioned prompt file under `prompts/`, with a `prompts/CHANGELOG.md` entry for the round 2 prompt version.
3. `benchmark/config/categories.yaml` in the version in force, with the analysis-field extension merged and frozen, eligibility content unchanged from v1.2.
4. The Excel capture template with the analysis fields, the reviewer column, and enforced vocabulary (dropdown validation), as the file the colleagues will actually use.
5. The P3 bridge import validation extended to the analysis fields and the reviewer column.
6. The 10K assessment prompt version and the run configuration with explicitly set decoding parameters.
7. The metrics pre-specification as committed, runnable scripts, including the content-only computation.
8. The deduplication procedure (script or documented manual procedure with output format).
9. The disclosure skeleton declaring the intended AI use of the round (identification lanes, LLM track, optional agent track), closing PRISMA-trAIce M1 prospectively.
10. The decision record: L5 yes or no, full-batch versus split screening, and the role assignment of section 7.

After the first search run, this list is frozen; changes happen only as dated amendments below.

## 9. Amendments

None yet. Format: date, what changed, why, which runs were affected.

## 10. Open items before finalization

1. Status of `deep-research/literature-review-prompt.md` versus the lost-prompt record (section 4.1): human decision on how the provenance is described in the final protocol.
2. Round 1 cutoff precision (section 4.2): confirm October 2025 or correct by amendment if a precise execution date exists outside the repository.
3. Analysis-field extension not yet frozen; items 3 to 5 of section 8 depend on it. The freeze must precede the B2 screening start; this protocol requires it before the first search so the pre-registration is complete in one commit state. Confirm or relax that stricter ordering.
4. Full-batch versus split screening for R1 and R2 (affects the inter-human baseline, section 6).
5. Decision on running L5 (Claude Code web research lane), with model version recording if yes.

---

# Analysis fields (TP4)

This section is the TP4 deliverable of [[plan]]: it turns the programme question, how prompt engineering must be adapted for social work, gender, and bias contexts, into an operationalized analysis design. Nothing here is frozen; every proposal is input for the stakeholder decision, which is recorded as ADRs in [[specification]] before the frozen schema goes into the Excel template, `categories.yaml`, and the P3 bridge validation. The hard ordering holds: the freeze precedes the B2 screening start, because the update's Excel template must carry the analysis fields from the first decision onward.

The design problem in one sentence: the first review round produced a corpus with binding inclusion decisions and ten binary topic categories, but no fields that say what an included paper contributes to the prompt-engineering question; a paper coded `Prompting: Ja` could recommend role prompts for case documentation or benchmark chain-of-thought debiasing, and the current schema cannot tell these apart.

## A. From programme question to sub-questions

The programme question presupposes a baseline (general-purpose prompt engineering), a target (social work, gender, and bias contexts), and a kind of answer (techniques, constraints, gaps). Decomposed along those three:

SQ1 (technique inventory and its evidence). Which prompting techniques does the literature discuss, recommend, or evaluate, and what kind of evidence supports each? Answerable as frequency of technique codes crossed with evidence type and mitigation status. SQ1 establishes which part of the general prompt-engineering repertoire reaches this literature.

SQ2 (bias-to-mitigation mapping). Which bias axes and harm types does this literature address, and which mitigation approaches, at which intervention stage, are proposed or tested against them? Answerable as co-occurrence of bias-axis, harm-type, and mitigation codes, with mitigation status separating proposals from evaluated interventions. SQ2 is the core of the adaptation question.

SQ3 (domain-specific constraints and gaps). Which requirements specific to social work populations does the literature state that general guidance does not cover, and for which practice fields is there no evidence at all? Answerable as population-context frequencies, the zero cells of the technique-by-population table, and a qualitative synthesis of explicit adaptation statements. SQ3 produces the research-gap map, the conceptual feed for the Fair Bench foundation ([[project]], secondary goal).

The three sub-questions are answerable from per-paper coding plus aggregation. They require no new experiments and keep the follow-up paper's empirical section computable from the coded Excel by committed script.

## B. Analysis fields

Seven new fields plus one reused field. Each field exists because at least one sub-question needs it.

| Field | Captures | Serves | Vocabulary basis |
|---|---|---|---|
| `AN_Prompt_Techniques` | which prompting technique families the paper discusses | SQ1 | The Prompt Report taxonomy (Schulhoff et al. 2025) |
| `AN_Bias_Axes` | along which social axes bias is analysed | SQ2 | project category schema plus intersectionality framework |
| `AN_Harm_Types` | which concrete harm mechanisms are named | SQ2 | Gallegos et al. 2024 harm taxonomy |
| `AN_Mitigation_Stage` | where in the lifecycle a mitigation intervenes | SQ2 | Gallegos et al. 2024 mitigation stages, extended |
| `AN_Mitigation_Status` | how far the mitigation is carried | SQ1, SQ2 | project-defined ordinal |
| `AN_Population` | social work practice field or population addressed | SQ3 | scoping-review practice domains, extended |
| `AN_Coding_Basis` | which text the coding was based on | audit trail | project-defined |
| `Studientyp` (reused) | evidence type of the paper | SQ1, SQ2 | existing `study_types` in `categories.yaml` |

Closed value lists:

- `AN_Prompt_Techniques` (multi): `ICL`, `Thought_Generation`, `Decomposition`, `Ensembling`, `Self_Criticism`, `Role_Persona`, `General_Guidance`, `None`. Grounded in The Prompt Report's five top-level groups; `Role_Persona` is promoted out of the zero-shot family to its own code because role and persona prompts are the form in which prompting most often appears in professional-practice guidance (a proposal, open decision 6).
- `AN_Bias_Axes` (multi): `Gender`, `Race_Ethnicity`, `Intersectional`, `Disability`, `Age`, `Socioeconomic`, `Language_Culture`, `Sexual_Orientation_Identity`, `Other_Axis`, `None`. Deliberately internal, refining the corpus's social dimension and the project's intersectional framework; no external taxonomy was verified as canonical for axis enumeration. `Intersectional` requires at least two axes treated in their interaction, not merely co-mentioned.
- `AN_Harm_Types` (multi, optional): the Gallegos et al. 2024 Table 1 taxonomy verbatim, `Derogatory_Language`, `Disparate_Performance`, `Erasure`, `Exclusionary_Norms`, `Misrepresentation`, `Stereotyping`, `Toxicity`, `Direct_Discrimination`, `Indirect_Discrimination`, plus `None`. Proposed as optional (open decision 2) because it is the hardest field to code reliably; SQ2 survives without it at reduced resolution.
- `AN_Mitigation_Stage` (multi): the four Gallegos et al. model-side stages `Pre_Processing`, `In_Training`, `Intra_Processing`, `Post_Processing`, plus two project additions, `Prompt_Practice` (user-side prompt formulation at use time) and `Organisational_Process` (guidelines, training, oversight, workflow), plus `None`.
- `AN_Mitigation_Status` (single ordinal): `Evaluated`, `Demonstrated`, `Proposed`, `None`.
- `AN_Population` (multi): `Child_Family_Welfare`, `Mental_Health`, `Health_Care`, `Homelessness_Youth`, `Social_Assistance_Admin`, `Education_Professional`, `General_Social_Work`, `Not_SW_Specific`. Grounded in a scoping review of AI in social work (Gardiner et al. 2026), extended by `Education_Professional` (where AI literacy literature lives) and `Not_SW_Specific`. The least grounded vocabulary, explicitly up for revision (open decision 6).
- `AN_Coding_Basis` (single): `Fulltext`, `Knowledge_Doc`, `Abstract`. Every decision needs its evidence basis (see [[verification]], infrastructure lessons); text availability is uneven across the corpus (many papers served only as a knowledge document or an abstract, some with no served text, see [[verification]]), and several fields, notably `AN_Prompt_Techniques` and `AN_Harm_Types`, are unlikely to be codable from an abstract, which the pilot measures.
- `Studientyp` (reused): the existing column with the controlled vocabulary `Empirisch`, `Experimentell`, `Theoretisch`, `Konzept`, `Literaturreview`, `Unclear` from `categories.yaml`; becomes required and vocabulary-validated for included papers in the update round. No duplicate column is added.

## C. Coding instructions

Written for the Excel workflow: the coders are the reviewing colleagues, the surface is the known spreadsheet, and the legend sheet carries the code lists in compact form. General rules:

1. Code only papers with the binding decision Include. Excluded papers get no analysis codes.
2. Code from the deepest text available and record it in `AN_Coding_Basis`. Use `None` only when the paper genuinely does not address the field's subject; when a field is not decidable from the available text, write that into `AN_Notes`.
3. Never leave an analysis cell empty. Every field has a `None` code; an empty cell is a validation error at import.
4. Multi-select fields take one or more codes, semicolon-separated, verbatim from the legend sheet. No free text in coded columns; free text goes to `AN_Notes`.
5. Code what the paper does, not what it cites.

Per field, the salient rules: a technique group is assigned only when the paper names or recognizably describes a concrete technique within it (general talk is `General_Guidance`, persona or role prompts are `Role_Persona`); a bias axis is coded when the paper analyses bias along it, not when the axis appears only as a demographic descriptor; harms are coded only where named or demonstrated as a mechanism, matched against the Gallegos et al. definitions; mitigation stage is coded where the paper's mitigation actually intervenes; mitigation status takes the highest level reached; population codes the setting addressed, not the one speculated about. If the analysis fields are dual-coded (open decision 5), divergent codes are reconciled in the same downstream step as divergent decisions ([[plan]] B3), and per-field agreement is reported with the decomposition framing of [[verification]], never as an error rate of either coder.

## D. Excel schema extension

The established capture format is the column shape of `benchmark/data/human_assessment.csv`. The extension appends columns after `Notes`, so every existing parser and the P3 bridge see an unchanged prefix. New columns in order: `AN_Prompt_Techniques`, `AN_Bias_Axes`, `AN_Harm_Types` (optional), `AN_Mitigation_Stage`, `AN_Mitigation_Status`, `AN_Population`, `AN_Coding_Basis`, `AN_Notes` (free text). Additionally `Studientyp` becomes required for `Decision = Include`.

Mechanics: a `Legend` sheet lists every column, its codes, and one-line definitions; single-select columns get Excel data-validation dropdowns; multi-select columns are typed as semicolon lists, which Excel cannot validate natively, so enforcement happens at the P3 import bridge (split on `;`, trim, match against the closed list; empty-cell check on all `AN_` columns for included papers; a visible import report). The freeze writes the vocabularies into `categories.yaml` as a new `analysis_fields` block, so tool, bridge, and template read one source. An alternative encoding goes to the meeting (open decision 3): one binary column per code, matching the established one-column-per-category pattern and giving full dropdown validation, at the price of roughly thirty additional columns. The semicolon encoding is proposed as primary because it keeps the sheet readable; the bridge can ingest either.

## E. Analysis methods over the coded corpus

The analysis corpus is the set of papers with a binding human Include (round 1's included set, see [[verification]], plus whatever the update adds). Whether the first-round included papers are retro-coded is open decision 4; SQ1 to SQ3 can be answered on the update batch alone, but coverage and the gap map are stronger with retro-coding. Three method layers in ascending interpretive depth:

Frequencies. Per-field code frequencies over the coded corpus, computed by a committed script, never by hand. Multi-select fields are counted per code with the paper count as denominator. Outputs: the technique inventory (SQ1), the bias-axis and mitigation profiles (SQ2), the population coverage (SQ3).

Co-occurrence. Contingency tables over code pairs (techniques by bias axes, techniques by population, mitigation stage by evidence type and by status). Zero and near-zero cells are read as candidate research gaps, the SQ3 result and the Fair Bench feed. No significance testing: at corpus scale the tables are descriptive, and the claims discipline forbids dressing description as inference.

Qualitative synthesis. A structured synthesis along SQ1 to SQ3, written as a knowledge document after coding. Every synthesis claim is grounded in the coded fields plus quoted text; where coding ran through PRISM, the pinned evidence snippets (the evidence map, FR-13, [[data]]) are the quotable basis. Explicit adaptation statements are collected verbatim via `AN_Notes` and synthesized as the direct answer to SQ3.

The validation path before freeze ([[plan]] TP4 step 3): pilot the draft fields on a small stratified sample of already-included papers (strata: text availability, and Prompting yes/no), measure fill rate, collect ambiguity notes, revise definitions, then freeze.

## F. Open decisions

1. Sub-question set: confirm, sharpen, or replace SQ1 to SQ3, and whether the gap map (SQ3) is a deliverable of the follow-up paper, the Fair Bench preparation, or both.
2. Field set and obligation: confirm the seven fields; decide whether `AN_Harm_Types` is kept (proposed optional), dropped, or required.
3. Encoding: semicolon multi-select versus one binary column per code.
4. Retro-coding scope: update batch only, or also the first round's included papers, and if so who codes and on which text basis.
5. Coding setup: single coder with spot checks, full dual coding, or single human coding plus an advisory LLM track (which would extend the dual-track design to the analysis layer and need its own pre-specified protocol).
6. Vocabulary details: keep or revert the `Role_Persona` promotion; finalize `AN_Population`; decide whether `Other_Axis` stays or the axes list is extended after the pilot.
7. Pilot parameters: sample size and strata, and the answerability threshold that forces a definition revision.
8. Studientyp reuse: confirm the existing column, vocabulary-enforced, is the evidence-type field and no duplicate is added.

Grounding sources (accessed 2026-06-09): Schulhoff et al., "The Prompt Report", arXiv:2406.06608v6; Gallegos et al., "Bias and Fairness in Large Language Models: A Survey", Computational Linguistics 50(3) 2024, arXiv:2309.00770v3; Gardiner, O'Donoghue, Yeung, Jewel, "Social work practice and artificial intelligence: A scoping review", Aotearoa New Zealand Social Work 38(1) 2026.

---

# RIS conversion

This section closes the RIS-conversion gap (paper-integrity item 3.8, now in [[verification]]) by documenting what is known about the round 1 conversion and binding round 2 to a reproducible procedure.

## Round 1: what happened, what survives

The deep research outputs of round 1 were converted to RIS with the help of an LLM and imported into Zotero, the systems' generated summaries carried along as metadata. What survives in the repository: four restored RIS files in `deep-research/restored/` and the structure template `ris-template.md`. What does not survive: the conversion prompt as executed, the model and version used, and the raw pre-conversion outputs for all but the restored set. The step is documented as performed but not reproducible; this is one of the named acquisition gaps in [[verification]], and the submitted paper's wording (conversion happened, by an LLM) is accurate but unverifiable in detail.

## Round 2: binding procedure

Per the execution rules of section 3, each lane's conversion in round 2 is documented at run time:

1. The raw deep research output is committed unaltered (one file per lane and run) before any conversion.
2. The conversion prompt is committed verbatim alongside, with model name and version and run date recorded in the lane's run record.
3. The conversion output (RIS) is committed next to its input, named so input, prompt, and output pair up.
4. A spot-check compares a sample of converted entries against the raw output (author, year, title, DOI or URL, source-tool attribution); the result goes into the run record.
5. Zotero import happens only from committed RIS files.

Conversion prompt for round 2 (template, instantiate per lane):

```
Convert the following deep research output into RIS format. One record per
referenced publication. Map: authors to AU (one per line), year to PY, title
to TI, journal or venue to JO, DOI to DO, URL to UR. Put the deep research
system's summary or recommendation text for the entry into N1, prefixed with
the lane id. Use TY JOUR for journal articles, TY CHAP for book chapters,
TY BOOK for books, TY CONF for conference papers, TY GEN otherwise. Do not
invent values: omit any field not present in the source text. Output only
the RIS records, no commentary.
```

Any deviation from this template at run time is flagged in the run record, mirroring the deviation convention of Appendix A.

---

# Appendix A: Paste-ready prompts per lane

The prompt text is identical for all lanes, as in round 1. Source text: `deep-research/literature-review-prompt.md` (KONTEXT block plus analysis prompt). Hard line wraps of the source file are unwrapped for pasting; wording is unchanged. The structured deviations from the round 1 text are flagged in A.1.

## A.1 Annotated master prompt (deviations flagged inline)

```
KONTEXT [DEVIATION: in the source file, KONTEXT is a markdown heading that labels the research-question block; whether the literal label line was pasted in round 1 is undocumented; it is kept here as the block label]

Wie können feministische KI-Literacies und intersektional informiertes Prompting als kritische Praxis dazu beitragen, die Ko-Konstitution von Diskriminierungsformen in KI-Systemen sichtbar zu machen, während gleichzeitig die Grenzen individueller Kompetenzansätze gegenüber strukturellen Machtasymmetrien in der KI-Entwicklung reflektiert werden?

You are an expert in systematic scientific literature analysis. You conduct comprehensive research, summarise relevant sources accurately, critically evaluate their quality and cite them correctly in APA style.

Your task:
1. Identify relevant academic literature on the topic '[the research question above]' from 2023-2025, especially from peer-reviewed sources. [DEVIATION: the source file shows the placeholder '[Topic]' replaced by the research question; the full research question is inserted verbatim because no shorter round 1 substitution text is documented]
2. Create a concise summary (max. 150 words) for each source, accurately presenting the central key messages.
3. Cite each source completely in APA format (with URL)
4. Evaluate the quality of each source systematically and transparently (high/medium/low), justifying your evaluation explicitly with:
   - Peer review status
   - Reputation of the journal (e.g. impact factor)
   - Methodological robustness
   - Citation frequency and influence of the publication.
   - The quality of the text and the relevance of the topic.

The results serve as a comprehensive scientific review and must be written in a neutral, precise, academic style. Structure of the answer:

1. APA citation
2. Concise summary of the key statements
3. Critical quality assessment including explicit justification

Only include literature published in or after October 2025, because work published before October 2025 was already covered by the first search round executed in October 2025, and this time restriction supersedes the year range 2023-2025 stated in task 1. [DEVIATION: the single time restriction added for round 2, required by section 4.2]
```

## A.2 Lanes L1 to L4 (ChatGPT, Claude, Gemini, Perplexity)

The paste-ready text is A.1 with the two `[DEVIATION]` markers removed and the research question written into task 1 verbatim, nothing else changed. Identical text for all four lanes, pasted as is.

## A.3 Lane L5 (Claude Code web research lane, optional)

Identical prompt text to A.2. The execution environment differs from round 1 (an agentic Claude Code session with web search tools instead of a deep research product interface); the prompt wording is unchanged. The lane is documented like the others: executed prompt verbatim, model version, run date, raw output written to `deep-research/round2/raw/ClaudeCode_deep-research.md` and committed at run time.

## Related

- [[plan]]
- [[verification]]
- [[specification]]
- [[data]]
- [[reuse-setup]]
