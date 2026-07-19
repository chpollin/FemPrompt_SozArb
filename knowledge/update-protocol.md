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
updated: 2026-07-18
authors: [Christopher Pollin]
generated-with: Claude Code
topics: ["[[Pre-Registration]]", "[[Coding Scheme]]"]
related: [plan, data, specification, methods]
---

This document is the pre-registration protocol for the second literature round (TP5 and Stage B2 of [[plan]]). It exists because the first round had no pre-specified protocol, the one gap of the conducted review that cannot be repaired retrospectively (PRISMA-trAIce M1 and PRISMA 2020 item 24). The protocol closes that gap prospectively, carries the analysis-field design the round must capture at screening time (the Analysis fields section), and binds the RIS conversion to a reproducible procedure (the RIS conversion section). It is committed, in finalized form, before the first round 2 search runs; any change after the first run is recorded as a dated amendment, never as a silent edit. The protocol describes the workflow and how large language models are used within it; it makes no efficiency claims. It is a draft until the open items of section 10 and the analysis-field decisions are resolved.

## 1. Objectives

1. Update the existing first-round corpus with literature published since the round 1 search execution, using the same identification instrument: parallel deep research queries with an identical prompt across systems, followed by deduplication, dual assessment, and human-binding screening.
2. Conduct the round under full PRISMA 2020 plus PRISMA-trAIce conformance by construction: pre-specified protocol (this document), executed prompts committed verbatim with run metadata, enforced controlled vocabulary at capture, per-record reviewer identity, separate AI and human decision tracks, generated flow and disclosure artifacts.
3. Capture the analysis fields (prompt techniques, bias axes, harm types, mitigation, population; see the Analysis fields section) at screening time, so the round 2 corpus can carry the analysis of how prompt engineering must adapt for social work, gender, and bias contexts.
4. Produce the data for the two-round comparison: round 1 is carried through PRISM with named gaps (Stage R), round 2 demonstrates the same record machinery under prospective conformance.

## 2. Eligibility criteria

Eligibility is defined by `assessment/categories.yaml`, version 1.2, and is used unchanged: the ten categories in two dimensions (technology and social) and the controlled exclusion vocabulary are not restated here; the YAML file is the single source of truth. PRISM scores the categories three-level and derives the decision (both dimensions ja yields Include, both at least teilweise yields Unclear, any dimension entirely nein yields Exclude; ADR-024, [[specification]]); the requirement that both a technology and a social dimension be present is unchanged from round 1.

The analysis-field extension adds capture fields for the analysis question. These are descriptive coding fields, not eligibility criteria. If merging the extension into `assessment/categories.yaml` bumps the file version, the eligibility-relevant content remains identical to v1.2; any change to eligibility-relevant content would be a protocol amendment.

Additional time restriction for this round: only records published from July 2025 up to and including June 2026 enter screening (section 4 derives the window). Earlier records are out of scope for round 2 because round 1 covered them; if a search returns earlier records, they are removed at deduplication or excluded with the existing vocabulary, not silently dropped.

## 3. Information sources

The same deep research systems as round 1, named as the repository documents them (`prompts/deep-research-template.md`, four Deep Research interfaces; [[methods]], Phase 1; RIS artifacts in `corpus/deep-research/`).

| Lane | System | Status |
|---|---|---|
| L1 | ChatGPT (OpenAI) Deep Research | as round 1 |
| L2 | Claude (Anthropic) Deep Research | as round 1 |
| L3 | Gemini (Google) Deep Research | as round 1 |
| L4 | Perplexity Deep Research | as round 1 |
| L5 | Claude Code web research lane | optional, new in round 2 |

L5 is an optional fifth lane: a Claude Code session with web search tools executes the identical prompt agentically and writes its raw output to a file. It is documented exactly like the other lanes (executed prompt verbatim, provider and model version, run date, raw output committed at run time) and its results carry their own Source_Tool value so the lane stays separable in every analysis. Whether L5 runs is a human decision recorded before the first search. Manual identification remains permitted, as in round 1, recorded with Source_Tool Manual.

For every lane, the round 1 provenance lesson applies, what the infrastructure must record: the executed prompt verbatim, the provider and model version, the run date, and the raw output are stored as files under `corpus/deep-research/round2/` at run time. The RIS conversion of raw outputs is documented and committed this round (round 1 left it unreproducible); the procedure is in the RIS conversion section below.

## 4. Search strategy

### 4.1 The prompt

Round 2 uses the same prompt as round 1, with exactly one added sentence (the time restriction). The full paste-ready text per lane is Appendix A; the identical text is used for all lanes, as in round 1.

Provenance caveat, stated openly: the repository carries two accounts of the round 1 prompt. `corpus/deep-research/literature-review-prompt.md` presents a two-part prompt (a KONTEXT block with the research question plus a generic analysis prompt) as the prompt that generated the round 1 outputs. `prompts/CHANGELOG.md` records that the exactly instantiated round 1 prompt was never committed and is genuinely lost, with only the parametric template restored from Git history. This protocol uses the text of `corpus/deep-research/literature-review-prompt.md` as the documented round 1 prompt, because it is the only complete, instantiable prompt text in the repository and is already the referenced basis for the paper. The claim is therefore "round 2 uses the documented round 1 prompt", not "round 2 uses the verbatim executed round 1 prompt"; the latter is unprovable for round 1. Resolving the status of that file is an open item for finalization.

### 4.2 The round 2 window and the time restriction sentence

The round 1 search execution date was not recorded at run time; the repository bounds it to October 2025 (the prompt existed and was deleted in October 2025, `prompts/CHANGELOG.md`; the restored template's source commit `0a98f49` is dated 31.10.2025; the corpus was assessed by the 5D track on 2025-11-02). Round 2 sets the window to July 2025 through June 2026. The lower bound is pulled back from the October execution date to July deliberately: round 1's late-October run may have missed mid-2025 papers not yet indexed at search time, so the wider window is safer for coverage, and the overlap with the round 1 period (July to October 2025) is removed by the pre-specified deduplication step (section 4.4), which is cheaper than risking a gap. The upper bound is June 2026, the end of the fellowship search period. This is the recorded default; a narrower lower bound (October 2025) or a precise round 1 execution date would be a dated amendment before the first run.

The single added sentence, appended at the end of the prompt:

> Only include literature published from July 2025 up to and including June 2026, because work published before July 2025 was already covered by the first search round, and this time restriction supersedes the year range 2023-2025 stated in task 1.

No other wording of the round 1 prompt is changed. Appendix A flags every deviation inline.

### 4.3 Execution rules

One run per lane, all runs inside one declared execution window. A technically failed run may be retried; every attempt is logged with timestamp in the run record. Repeated runs for result comparison are not part of this protocol (round 1's claim of non-reproducible repeated queries was never auditable) and would require an amendment. Results are imported into Zotero collections with the established prefix convention and provenance preserved; `corpus/source_tool_mapping.json` is regenerated to cover the new records.

### 4.4 Deduplication

Deduplication against the existing corpus and within the new batch happens as a separate identification-phase step, before screening, by Zotero key, DOI, and title matching. Round 1 handled duplicates inside screening, which inflated the screening divergence. Pre-specifying deduplication before screening removes that artifact class for round 2. The deduplication result (removed records with match reason) is committed as part of the flow data.

## 5. Screening procedure

PRISM is the binding screening surface for round 2 ([[plan]] Stage B2, ADR-019 in [[specification]]). The reviewing colleagues screen the new batch in the tool, where every category points at the words that justify it and the human decision is the binding record. The screening record carries, for round 2, the same shape the established capture format does, the column shape of `assessment/human_assessment.csv`, extended by:

1. the analysis-field extension (frozen before screening starts, see the Analysis fields section), and
2. a per-record reviewer identity through neutral reviewer ids (R1, R2), closing the round 1 gap of per-record reviewer identity.

The tool enforces the controlled vocabulary at input time (validated values for Decision, Exclusion_Reason, category values, and the analysis fields); values like Other or empty reason cells, which round 1 admitted, are impossible by construction.

A batch captured in Excel elsewhere enters over the P3 import bridge ([[plan]] Stage A P3), which survives as an entry and migration seam rather than the canonical capture path, with idempotent re-import, an import report (added, changed, skipped), and validation of vocabulary, category completeness, duplicate Zotero keys, and the analysis fields. Violations are a visible import report, never silent acceptance.

In PRISM the more precise PRISMA steps happen, where machine-extracted evidence enters as a clearly labelled separate provenance class, human verification of evidence runs on samples, the text source actually read is recorded (raw, knowledge document, abstract), divergent human decisions are reconciled on the Daten und Repo surface with the consensus decision and process recorded (PRISMA-trAIce M8), and flow, agreement, checklist, and disclosure artifacts are generated from the data.

The dual track runs as in round 1: the offline LLM assessment processes the new batch with the versioned 10K assessment prompt (`src/assess/run_llm_assessment.py`, governed by `prompts/CHANGELOG.md`) and recorded parameters. Decoding parameters are set explicitly and recorded this round; round 1 left temperature and top-p as unrecorded API defaults. The human decision is the binding record; the LLM track is advisory and kept separate. An interactive agent screening lane (as in Stage R3) may run as a third track under its own pre-specified sub-protocol.

## 6. Pre-specified metrics

All agreement reporting for round 2 is fixed in advance, taking the round 1 reporting as binding precedent. For the human-LLM decision comparison:

1. Raw confusion matrix cells (both-include, human-include/LLM-exclude, LLM-include/human-exclude, both-exclude), reported before any coefficient.
2. Observed agreement po, Cohen's kappa, PABAK, and kappa-max, reported together as one decomposition; no single coefficient is reported alone.
3. Prevalence index and bias index as the quantitative form of marginal divergence.
4. Per-category kappas over the ten categories.
5. The content-only analysis, pre-specified this time instead of post hoc: pairs whose human exclusion reason is a workflow criterion (Duplicate, No full text, Wrong publication type) are separated out, and metrics 1 to 4 are reported for the content-only subset alongside the full matrix. With deduplication moved before screening (section 4.4), the Duplicate stratum should be near empty in round 2; its size is itself a reported check on the deduplication step.

The round 1 baseline values for comparison are taken from the data (generated/benchmark-results/, docs/data/) and the Evidence Companion; no baseline number is restated here, and the comparison script reads them from the committed source. No error-rate language: divergence quantities are divergence against a consolidated human annotation, not error, and round 1 has no inter-human baseline.

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
3. `assessment/categories.yaml` in the version in force, with the analysis-field extension merged and frozen, eligibility content unchanged from v1.2.
4. The Excel import template with the analysis fields, the reviewer column, and enforced vocabulary (dropdown validation), as the seam for a batch captured elsewhere; the colleagues screen in PRISM.
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

All five resolved by dated operator amendment on 2026-07-17 (run protocol `corpus/deep-research/round2/LAUFPROTOKOLL.md`):

1. Provenance confirmed as the documented round-1 prompt (not the unprovable verbatim execution); round-2 prompt committed.
2. Window confirmed, July 2025 to June 2026.
3. Analysis-field freeze relaxed to "before screening start" with a preceding pilot; frozen 2026-07-17 into `assessment/categories.yaml` (v1.3, `analysis_fields`).
4. Full-batch screening.
5. L5 lane ran (Claude Fable 5), 8 records, 5 new distinct candidates.

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
- `AN_Bias_Axes` (multi): `Gender`, `Race_Ethnicity`, `Intersectional`, `Disability`, `Age`, `Socioeconomic`, `Language_Culture`, `Sexual_Orientation_Identity`, `Religion`, `Physical_Appearance`, `Nationality_Migration`, `Other_Axis`, `None`. Deliberately internal, refining the corpus's social dimension and the project's intersectional framework; no external taxonomy was verified as canonical for axis enumeration. `Religion`, `Physical_Appearance`, and `Nationality_Migration` were added after the corpus mine found each independently evidenced (benchmark axes in BBQ/StereoSet/LIBRA, migration and coloniality in the social-work subset) rather than folded into `Other_Axis`. `Intersectional` requires at least two axes treated in their interaction, not merely co-mentioned.
- `AN_Harm_Types` (multi, optional): the Gallegos et al. 2024 Table 1 taxonomy verbatim, `Derogatory_Language`, `Disparate_Performance`, `Erasure`, `Exclusionary_Norms`, `Misrepresentation`, `Stereotyping`, `Toxicity`, `Direct_Discrimination`, `Indirect_Discrimination`, plus `None`. Proposed as optional (open decision 2) because it is the hardest field to code reliably; SQ2 survives without it at reduced resolution.
- `AN_Mitigation_Stage` (multi): the four Gallegos et al. model-side stages `Pre_Processing`, `In_Training`, `Intra_Processing`, `Post_Processing`, plus two project additions, `Prompt_Practice` (user-side prompt formulation at use time) and `Organisational_Process` (guidelines, training, oversight, workflow), plus `None`.
- `AN_Mitigation_Status` (single ordinal): `Evaluated`, `Demonstrated`, `Proposed`, `None`.
- `AN_Population` (multi): `Child_Family_Welfare`, `Mental_Health`, `Health_Care`, `Homelessness_Youth`, `Social_Assistance_Admin`, `Education_Professional`, `General_Social_Work`, `Not_SW_Specific`. Grounded in a scoping review of AI in social work (Gardiner et al. 2026), extended by `Education_Professional` (where AI literacy literature lives) and `Not_SW_Specific`. The least grounded vocabulary, explicitly up for revision (open decision 6).
- `AN_Coding_Basis` (single): `Fulltext`, `Knowledge_Doc`, `Abstract`. Every decision needs its evidence basis; text availability is uneven across the corpus (many papers served only as a knowledge document or an abstract, some with no served text), and several fields, notably `AN_Prompt_Techniques` and `AN_Harm_Types`, are unlikely to be codable from an abstract, which the pilot measures.
- `Studientyp` (reused): the existing column with the controlled vocabulary `Empirisch`, `Experimentell`, `Theoretisch`, `Konzept`, `Literaturreview`, `Unclear` from `categories.yaml`; becomes required and vocabulary-validated for included papers in the update round. No duplicate column is added.

## B.1 Revision after the pilot (2026-07-17, FROZEN)

Frozen 2026-07-17 by operator decision, together with section B, into `assessment/categories.yaml` as the `analysis_fields` block (v1.3, eligibility content unchanged from v1.2). The advisory pilot (section E.1, eight papers, stratified) and the operator's clarification of the study goal (everything the corpus says about prompting matters, not only technique families) produced the following revisions. They amend sections B to D and are now binding for the round-2 screening.

1. **New field `AN_Prompting_Role`** (multi): captures in which role prompting figures in the paper, independent of whether a technique family is codable. Codes: `Recommended_Practice` (the paper recommends or teaches prompting), `Research_Instrument` (prompts are used to elicit or measure model behaviour, e.g. bias probes), `Object_of_Critique` (prompting itself is analysed or criticized as a practice), `Learning_Content` (prompting as taught AI-literacy content), `None`. Rationale: the pilot showed papers with a clear prompting focus but no codable technique (prompts as bias-elicitation instrument); under the study goal these carry signal that `AN_Prompt_Techniques` alone loses.
2. **`AN_Prompt_Techniques: None` is explicitly legitimate with `Prompting: Ja`.** The human category codes topical focus, the technique field codes named technique families; they measure different things. The concrete strategy behind a `General_Guidance` coding is preserved verbatim in `AN_Notes`.
3. **`AN_Harm_Types` stays optional and becomes binding only where `AN_Coding_Basis = Fulltext`** (open decision 2 resolved as proposed): the pilot found the Gallegos mechanism rarely decidable from distillate or abstract; competing codes were frequent. From weaker text bases the field may be coded, but an empty value is not a validation error there.
4. **Review rule** (amends coding rule 5): for `Studientyp` Literaturreview or Konzept, the techniques, harms, and mitigations the paper synthesizes as its own subject matter are codable; rule 5 excludes only incidental citation, not the review's object.
5. **`AN_Population` sharpening:** `Education_Professional` is restricted to professional or higher-education AI-literacy settings (teaching professionals or students to work with AI); general-audience or unspecified contexts go to `Not_SW_Specific`. The fine-grained social-work practice codes stay unchanged and are re-examined after screening, when the corpus shows which fields actually occur (open decision 6 stays open for that part).
6. **`Role_Persona` promotion is kept** (open decision 6, this part resolved): the pilot found it independently, as the technique form professional-practice guidance actually names.
7. **Excel schema:** `AN_Prompting_Role` is appended after `AN_Population`; as a multi field it uses the semicolon encoding with a `Legend` entry, enforced at the P3 bridge like the other multi-select lists.

The freeze decision reviews sections B and B.1 together; after the freeze the vocabularies are written into `categories.yaml` as the `analysis_fields` block and this revision block is folded into B.

## C. Coding instructions

The capture surface is the PRISM tool, inline in the screening assessment column (ADR-026 in [[specification]], decided 2026-07-18); the Excel in the schema of section D remains the export and fallback format, and the legend sheet carries the code lists for anyone working outside the tool. The rules below are surface-independent. In the tool, rule 2's not-decidable case is captured as a per-field click and exported as the `AN_Notes` line `Feldname: nicht entscheidbar aus <Basis>`, so the frozen schema is unchanged and the cases stay machine-countable. General rules:

1. Code only papers with the binding decision Include. Excluded papers get no analysis codes.
2. Code from the deepest text available and record it in `AN_Coding_Basis`. Use `None` only when the paper genuinely does not address the field's subject; when a field is not decidable from the available text, write that into `AN_Notes`.
3. Never leave an analysis cell empty. Every field has a `None` code; an empty cell is a validation error at import.
4. Multi-select fields take one or more codes, semicolon-separated, verbatim from the legend sheet. No free text in coded columns; free text goes to `AN_Notes`.
5. Code what the paper does, not what it cites.

Per field, the salient rules: a technique group is assigned only when the paper names or recognizably describes a concrete technique within it (general talk is `General_Guidance`, persona or role prompts are `Role_Persona`); a bias axis is coded when the paper analyses bias along it, not when the axis appears only as a demographic descriptor; harms are coded only where named or demonstrated as a mechanism, matched against the Gallegos et al. definitions; mitigation stage is coded where the paper's mitigation actually intervenes; mitigation status takes the highest level reached; population codes the setting addressed, not the one speculated about. If the analysis fields are dual-coded (open decision 5), divergent codes are reconciled in the same downstream step as divergent decisions ([[plan]] B3), and per-field agreement is reported with the same decomposition framing, never as an error rate of either coder.

## D. Excel schema extension

Since ADR-026 (2026-07-18) this schema is the export and bridge contract, no longer the capture surface; capture happens in PRISM (section C), and the PRISM export emits exactly this column shape. The established format is the column shape of `assessment/human_assessment.csv`. The extension appends columns after `Notes`, so every existing parser and the P3 bridge see an unchanged prefix. New columns in order: `AN_Prompt_Techniques`, `AN_Bias_Axes`, `AN_Harm_Types` (optional), `AN_Mitigation_Stage`, `AN_Mitigation_Status`, `AN_Population`, `AN_Coding_Basis`, `AN_Notes` (free text). Additionally `Studientyp` becomes required for `Decision = Include`.

Mechanics: a `Legend` sheet lists every column, its codes, and one-line definitions; single-select columns get Excel data-validation dropdowns; multi-select columns are typed as semicolon lists, which Excel cannot validate natively, so enforcement happens at the P3 import bridge (split on `;`, trim, match against the closed list; empty-cell check on all `AN_` columns for included papers; a visible import report). The freeze writes the vocabularies into `categories.yaml` as a new `analysis_fields` block, so tool, bridge, and template read one source. An alternative encoding goes to the meeting (open decision 3): one binary column per code, matching the established one-column-per-category pattern and giving full dropdown validation, at the price of one column per code across all fields. The semicolon encoding is proposed as primary because it keeps the sheet readable; the bridge can ingest either.

## E. Analysis methods over the coded corpus

The analysis corpus is the set of papers with a binding human Include (round 1's included set plus whatever the update adds). Whether the first-round included papers are retro-coded is open decision 4; SQ1 to SQ3 can be answered on the update batch alone, but coverage and the gap map are stronger with retro-coding. Three method layers in ascending interpretive depth:

Frequencies. Per-field code frequencies over the coded corpus, computed by a committed script, never by hand. Multi-select fields are counted per code with the paper count as denominator. Outputs: the technique inventory (SQ1), the bias-axis and mitigation profiles (SQ2), the population coverage (SQ3).

Co-occurrence. Contingency tables over code pairs (techniques by bias axes, techniques by population, mitigation stage by evidence type and by status). Zero and near-zero cells are read as candidate research gaps, the SQ3 result and the Fair Bench feed. No significance testing: at corpus scale the tables are descriptive, and the claims discipline forbids dressing description as inference.

Qualitative synthesis. A structured synthesis along SQ1 to SQ3, written as a knowledge document after coding. Every synthesis claim is grounded in the coded fields plus quoted text; where coding ran through PRISM, the pinned evidence snippets (the evidence map, FR-13, [[data]]) are the quotable basis. Explicit adaptation statements are collected verbatim via `AN_Notes` and synthesized as the direct answer to SQ3.

The validation path before freeze ([[plan]] TP4 step 3): pilot the draft fields on a small stratified sample of already-included papers (strata: text availability, and Prompting yes/no), measure fill rate, collect ambiguity notes, revise definitions, then freeze.

## E.1 Pilot findings

The advisory pilot that fed the B.1 freeze, model Claude Opus, run 2026-07-17. The coding here was advisory and not binding; the binding coding is done later by humans in the Excel and PRISM workflow. It measured fill rate and decidability of the seven fields plus Studientyp against already-Include-coded papers, collected ambiguities, and derived the revision proposals that section B.1 froze.

Sampling. The population is the papers with `Decision = Include` in `assessment/human_assessment.csv`. Two strata along the validation path, Prompting yes/no from the `Prompting` category column and text availability. Text availability separates papers with a present distillate under `generated/distilled/` from papers without one, for which only the abstract from the CSV is available. Full texts under `_sources/` were not present on this machine, so the deepest available text base was either the distillate (`Knowledge_Doc`) or the abstract (`Abstract`). Cell occupancy (snapshot, run 2026-07-17):

| Cell | Prompting | Distillate | n |
|---|---|---|---|
| A | yes | present | 65 |
| B | yes | absent | 4 |
| C | no | present | 67 |
| D | no | absent | 6 |

All four cells were occupied by at least two, so no fill-up from a neighbouring cell was needed. The draw was deterministic, per cell the two alphabetically first by `Zotero_Key`, which makes the run reproducible. The drawn sample, eight papers:

| Cell | Zotero_Key | Author_Year | Text base |
|---|---|---|---|
| A | 22KJL3PC | Yuan 2025 | Knowledge_Doc |
| A | 22XEFRWP | Petzel 2025 | Knowledge_Doc |
| B | 64DQYVVB | Liu 2025 | Abstract |
| B | 6MJYP7ZX | Prakash 2023 | Abstract |
| C | 2SLISKSW | McCrory 2024 | Knowledge_Doc |
| C | 2SNYUZG4 | Yan 2024 | Knowledge_Doc |
| D | CHJQ52DC | Latif 2024 | Abstract |
| D | DWS4KXBW | Ovalle 2024 | Abstract |

Fill rate per field, measured as the share of the eight papers with a non-`None` value (snapshot, run 2026-07-17):

| Field | non-None | Fill rate |
|---|---|---|
| AN_Prompt_Techniques | 3/8 | 0.38 |
| AN_Bias_Axes | 8/8 | 1.00 |
| AN_Harm_Types | 8/8 | 1.00 |
| AN_Mitigation_Stage | 7/8 | 0.88 |
| AN_Mitigation_Status | 7/8 | 0.88 |
| AN_Population | 8/8 | 1.00 |
| Studientyp | 8/8 | 1.00 |

Decidability by text base. `AN_Bias_Axes`, `AN_Population`, and `Studientyp` were decidable from every text base, including the abstract. `AN_Prompt_Techniques` was the hardest and least often evidenceable field; it was assignable only where a technique was named explicitly (Liu chain-of-thought, Prakash five named approaches, Yuan four named strategies), and fell to `None` for the four papers without a prompting focus. `AN_Harm_Types` reached full fill rate formally but had the lowest assignment certainty; the boundaries between `Stereotyping`, `Misrepresentation`, and `Disparate_Performance` were repeatedly not cleanly drawable from distillate and abstract. `AN_Mitigation_Stage` from the abstract was only coarsely decidable for Latif.

Ambiguity list (carried forward at real coding time; a recurring ambiguity at one field is the signal for a definition sharpening by amendment):

- **A1 Prompting yes without a codable technique.** Several `Prompting: Ja` papers use prompts as an investigative instrument without recommending or evaluating a technique. The human `Prompting` category and the `AN_Prompt_Techniques` field measure different things. Without clarification a systematically low and hard-to-interpret fill rate arises.
- **A2 Harm types overlap.** `Stereotyping`, `Misrepresentation`, `Disparate_Performance`, and `Exclusionary_Norms` competed in five of the eight codings. From distillate or abstract the Gallegos definition (the exact harm mechanism) is often not decidable, because the mechanism is named only in the full text. The field is the least reliable at the current text base.
- **A3 Review papers and rule 5.** For Prakash (Literaturreview) the five prompt techniques are the subject of the paper, not something the paper itself does. Rule 5 (code what the paper does, not what it cites) and the study type Literaturreview stand in tension. Without a special rule for reviews either reviews vanish under `None` or rule 5 is violated.
- **A4 General_Guidance as a catch-all.** Yuan's four strategies are concrete, named, and evaluated interventions, but fall to `General_Guidance` for lack of a Prompt Report family, the least specific code. The most informative prompting paper of the sample loses its resolution in the technique field.
- **A5 AN_Population outside social work.** Six of the eight papers are not social-work-specific. `Not_SW_Specific` carries the main load, while the fine-grained SW practice fields (Child_Family_Welfare, Homelessness_Youth, Social_Assistance_Admin) were not assigned once. Whether this is the sample or the corpus is not decidable at eight papers.
- **A6 Education_Professional stretches.** Latif (grading student answers) and Yan (GenAI for learning) are education papers, not papers on professional continuing education. `Education_Professional` was meant for where the AI literacy literature lives, but here captures every education context and blurs.
- **A7 Intersectional as a label.** McCrory and Ovalle treat intersectionality as an analytic frame. The rule requires at least two axes in their interaction. For McCrory this holds; for Ovalle the assignment rests on the programmatic naming, not a worked two-axis analysis; the boundary between real intersectional analysis and intersectional vocabulary is barely drawable from the abstract.

Revision proposals from the pilot (advisory, informing the freeze, not replacing it; all are folded into the B.1 freeze above):

1. **AN_Harm_Types to optional or drop** (informs open decision 2). The pilot confirms this field's lowest assignment certainty and its full-text dependence. Recommendation: keep it optional and make it binding only at text base `Fulltext`. Under distillate- and abstract-only coding it yields more noise than signal.
2. **Separate prompting focus from prompting technique.** A short field or a rule that allows `AN_Prompt_Techniques = None` at `Prompting: Ja` and carries it as its own class (prompt as investigative instrument versus prompt as recommended practice). This makes the low fill rate interpretable instead of suspect.
3. **Special rule for review study types.** For `Literaturreview` and `Konzept`, rule 5 should be relaxed so the synthesized techniques are codable as what the review collects, with a mark in the basis or notes field. Otherwise the very survey works that map the technique inventory most densely go invisible under `None`.
4. **Keep the Role_Persona promotion** (informs open decision 6). Prakash evidences role and persona prompts as a standalone, repeatedly named category in the practice literature. The sample supports the promotion out of the zero-shot family, at one case.
5. **Sharpen AN_Population** (informs open decision 6). Two adjustments. Restrict `Education_Professional` to profession-related AI-literacy contexts and consider a separate value for general education, since Latif and Yan otherwise miscategorize. Finalize the fine-grained SW practice fields only after a larger sample, since they were not hit once in eight papers and their discrimination is not testable here.
6. **Keep Other_Axis for now** (informs open decision 6). In the sample every needed axis was covered by the existing list, `Other_Axis` was never used. That does not argue for an extension, but the sample is too small to drop it; keep it as a catch value until full coding.
7. **Supplement General_Guidance with free text.** Where a named, evaluated strategy falls to `General_Guidance` (the Yuan case), the concrete strategy should be held in `AN_Notes` so the resolution is not lost. Alternatively examine a later refinement of the technique vocabulary by framing- and constraint-based strategies.

## F. Open decisions and their resolution

The design's open decisions and the coding-workflow decisions (E1 to E8, section G) are one ledger, kept coherent here. Decisions marked "simulated, ratifiable" follow the project's simulation convention ([[plan]], Simulated decisions): they are resolved from the documented roles and binding only after the reviewing colleague confirms them at the next real contact. A full ratification pass of the simulation ledger is in [[plan]].

1. Sub-question set: confirm, sharpen, or replace SQ1 to SQ3, and whether the gap map (SQ3) is a deliverable of the follow-up paper, the Fair Bench preparation, or both. **Open.**
2. Field set and obligation: confirm the seven fields; decide whether `AN_Harm_Types` is kept, dropped, or required. **Resolved 2026-07-17 (freeze B.1 point 3):** kept, optional, binding only where `AN_Coding_Basis = Fulltext`.
3. Encoding: semicolon multi-select versus one binary column per code. **Resolved (section D):** semicolon multi-select as primary, enforced at the P3 bridge; the bridge can ingest either encoding.
4. Retro-coding scope: update batch only, or also the first round's included papers, and if so who codes and on which text basis. **Simulated, ratifiable (E1):** staggered, update batch first, retro-coding of the round 1 includes as a separate later run once the update pass has stabilized the definitions; SQ1 to SQ3 are answerable on the update batch alone.
5. Coding setup: single coder with spot checks, full dual coding, or single human coding plus an advisory LLM track. **Simulated, ratifiable (E1, E5):** one human coder per paper with the corpus split between R1 and R2, plus a pre-fixed stratified overlap sample both code independently, plus the advisory LLM track deferred (E6). The advisory LLM track extends the dual-track design to the analysis layer and needs its own pre-specified sub-protocol.
6. Vocabulary details: keep or revert the `Role_Persona` promotion; finalize `AN_Population`; decide whether `Other_Axis` stays or the axes list is extended. **Resolved 2026-07-17 (freeze B.1 points 5, 6):** promotion kept, `Education_Professional` sharpened, `Other_Axis` kept; the fine-grained SW practice codes stay open until screening shows which fields occur.
7. Pilot parameters: sample size and strata, and the answerability threshold that forces a definition revision. **Pilot done (section E.1); threshold simulated, ratifiable (E7):** a field enters the revision agenda when its ambiguity entries exceed roughly a quarter of the Include papers coded so far; crossing the threshold forces attention, not change, and R1 and R2 decide the revision because it would be a dated amendment of the frozen v1.3.
8. Studientyp reuse: confirm the existing column, vocabulary-enforced, is the evidence-type field and no duplicate is added. **Resolved (section B, D):** confirmed, `Studientyp` reused and required for Include, no duplicate column.

Two further capture-surface decisions from the coding workflow (section G):

- Coding basis where no full text exists. **Resolved 2026-07-18 (E2):** the narrow reading, only the verified research-vault distillate counts as `Knowledge_Doc` basis, because only it carries a verified evidence chain.
- Not-decidable handling and capture surface. **Resolved 2026-07-18 (E3, E4, E8):** capture is in PRISM, the analysis fields inline in the assessment column, appearing only at Include (ADR-026, FR-14 in [[specification]]); not-decidability is a per-field capture exported machine-countable, no new vocabulary code and no amendment; pinned evidence carries its source location, so SQ3 verbatims need no extra convention. The Excel schema (section D) stays as export and fallback.

Grounding sources (accessed 2026-06-09): Schulhoff et al., "The Prompt Report", arXiv:2406.06608v6; Gallegos et al., "Bias and Fairness in Large Language Models: A Survey", Computational Linguistics 50(3) 2024, arXiv:2309.00770v3; Gardiner, O'Donoghue, Yeung, Jewel, "Social work practice and artificial intelligence: A scoping review", Aotearoa New Zealand Social Work 38(1) 2026.

## G. Coding procedure

This section carries the coding method over the frozen analysis fields (`assessment/categories.yaml` v1.3, the `analysis_fields` block including `AN_Prompting_Role`), the operational form of sections B, B.1, and C. It is a draft, not a setting; humans code bindingly, every machine contribution stays advisory, consistent with the project's responsibility asymmetry. The decisions E1 to E8 are collected in section H. Any change to field definitions or vocabularies after coding start would be a dated amendment of the pre-registration, not a silent adjustment.

### G.1 Object and coding unit

Only papers with a binding human Include are coded (coding rule 1); excluded papers get no analysis codes. The analysis corpus is the round 1 Include set plus what round 2 adds; whether the round 1 includes are retro-coded is E1 (open decision 4), staggered, update batch first.

The coding unit is the paper per analysis field. Each field takes exactly one value or a semicolon-separated list from the closed vocabulary per paper; a finer segmentation of the text into coded passages is not required for the pre-registration's analysis layers (frequencies, co-occurrence, qualitative synthesis over SQ1 to SQ3) and would overrun the Excel workflow. The justification unit, separately, is the text passage. Where a coding decision is contested or load-bearing, the supporting passage is held, as a verbatim quote or precise reference in `AN_Notes`, or as a pinned evidence snippet where work runs in PRISM. For SQ3 the protocol requires collecting explicit adaptation statements verbatim through `AN_Notes` anyway.

### G.2 Coding basis, full text against distillate

Coding runs from the deepest available text, and the base actually read is held per paper in `AN_Coding_Basis` (`Fulltext`, `Knowledge_Doc`, `Abstract`; coding rule 2). The full text is the coding basis of choice where it lies in `generated/markdown_clean/` or over the local PRISM reading layer. Two fields depend on it especially, `AN_Harm_Types` is binding only at `AN_Coding_Basis = Fulltext` (freeze B.1 point 3), and the pilot found `AN_Prompt_Techniques` often unresolvable from weaker bases.

The research-vault distillates are working material, not coding basis. They serve as an entry, for orientation, for quickly finding evidence passages, because their quote claims are checked against the full text (documented evidence chain, `audit` frontmatter). Three constraints ground the separation:

1. The project's 2x2 experiment showed that knowledge documents inherit the framing of the distillation and reinforce the inclusion bias; a coding that reads only the distillate inherits that bias.
2. The distillates in `generated/distilled/` still on the waitlist are unverified; their category evidence can contain paraphrase with a quote claim (the error class from [[research-vault]]).
3. Even migrated research-vault distillates carry `status: migrated`, not `verified`; the binding human confirmation of the evidence chain is outstanding.

Where no full text exists, the distillate or the abstract is the honestly documented basis, which is exactly what `AN_Coding_Basis` records.

**E2 (resolved 2026-07-18, operator).** The narrow reading holds, only the verified research-vault version counts as `Knowledge_Doc` basis, because only it carries a verified evidence chain. The case stays rare, in the tool the full text is present for most papers.

### G.3 Procedure per analysis field

Recommended coding order per paper, first `AN_Prompting_Role`, because it fixes in which role prompting figures in the paper at all, then the remaining fields. The field rules from section C and B.1, summarized operationally:

| Field | Rule core |
|---|---|
| `AN_Prompting_Role` (multi) | In which role prompting appears (recommended practice, research instrument, object of critique, learning content), independent of whether a technique family is codable |
| `AN_Prompt_Techniques` (multi) | Only at a named or recognizably described concrete technique; `None` is legitimate at `Prompting: Ja` (B.1 point 2); the concrete strategy behind `General_Guidance` verbatim to `AN_Notes` |
| `AN_Bias_Axes` (multi) | An axis only when the paper analyses bias along it, not at a mere demographic mention; `Intersectional` requires at least two axes in their interaction |
| `AN_Harm_Types` (multi, optional) | Only named or demonstrated mechanisms, matched against the Gallegos definitions; binding only at full-text basis |
| `AN_Mitigation_Stage` (multi) | Where the mitigation actually intervenes, not where it could |
| `AN_Mitigation_Status` (single) | The highest level reached (Evaluated over Demonstrated over Proposed) |
| `AN_Population` (multi) | The addressed setting, not the speculatively mentioned; `Education_Professional` narrow, only professional or higher-education AI-literacy contexts (B.1 point 5) |
| `AN_Coding_Basis` (single) | The deepest text base actually read |
| `AN_Notes` (free) | Justifications, verbatim strategies and statements, non-decidability |

Across fields the coding rules 1 to 5 hold, in particular no empty cell (every field has `None`, an empty cell is a validation error at the import bridge) and code what the paper does, not what it cites. For `Studientyp` Literaturreview or Konzept the review special rule holds (B.1 point 4), the technique, harm, and mitigation inventory the review synthesizes is codable as the review's object; only incidental citation stays excluded.

### G.4 Handling of Unclear cases

Two levels are separated.

Screening-Unclear. A paper with derived decision Unclear (three-level categories, ADR-024) is not coded. It gets analysis codes only when the binding human pass resolves it to Include, where needed through the justified override (ADR-023). A provisional coding of Unclear papers only creates values that would have to be deleted again at Exclude.

Field-Unclear. `None` means the paper genuinely does not address the field's subject. If a field is not decidable from the available text base, `None` is not set; the non-decidability is held in `AN_Notes` with the field name (coding rule 2). The convention: one line per non-decidable field of the form `Feldname: nicht entscheidbar aus <Basis>` in `AN_Notes`, so the cases stay machine-countable and the fill rates interpretable, as the pilot did for `AN_Prompt_Techniques`. Ambiguities are collected, not silently decided. The pilot's ambiguity list (A1 to A7, section E.1) is carried forward at real coding; a recurring ambiguity at a field is the signal for a definition sharpening by amendment.

**E3 (resolved 2026-07-18, operator).** No new vocabulary code and thus no amendment, the frozen v1.3 stays untouched. Non-decidability is held in the PRISM analysis panel as a per-field capture and exported machine-countable; the `AN_Notes` line of the form `Feldname: nicht entscheidbar aus <Basis>` stays the fallback for capture outside the tool.

**E7 (simulated, ratifiable, 2026-07-18).** The pilot rule of thumb is taken as a trigger, not an automatism. A field enters the revision agenda when the carried-forward ambiguity list (A1 to A7 plus additions) carries an ambiguity entry for that field at more than roughly a quarter of the Include papers coded so far. The reference set is the running coding stock, not the whole corpus, so the threshold bites early. It is established by counting the machine-countable non-decidable and ambiguity capture per field (E3), which the operator delivers; the substantive revision R1 and R2 decide together, because a definition sharpening would be a dated amendment of the frozen v1.3. Crossing the threshold forces attention, not change; a field may stay unchanged after a justified review, then the finding stands as a consciously carried ambiguity in the list.

### G.5 Double coding and consensus procedure

The setup is E1/E5 (open decision 5), one human coder per paper, plus the advisory LLM track (deferred, E6), plus a double-coded human-human overlap sample. The draft takes it as a working hypothesis, because full double coding for two busy scientists is unrealistic and the overlap sample closes the missing inter-human baseline at limited cost.

Concrete procedure:

1. Split of the papers to be coded between R1 and R2; a pre-fixed, stratified overlap set both code independently, without knowledge of the other's coding.
2. Agreement on the overlap set is reported per field, with the same decomposition framing as in screening (observed agreement before coefficients, never as an error rate of one coder; at multi-select fields agreement per code). Computed by committed scripts, never by hand.
3. Divergent codes are resolved in a consensus session, analogous to the reconciliation of divergent screening decisions ([[plan]] B3, PRISMA-trAIce M8); the consensus value, the path to it, and the date are held. The consensus value replaces the single codes in the analysis data set, the single codes remain as raw data.
4. Unresolvable divergence is a finding, not a failure; it is documented as such and enters the ambiguity list.

**E1 (simulated, ratifiable, 2026-07-18).** Setup, each coder codes each paper as sole human coder, the analysis corpus is split between R1 and R2, plus the pre-fixed stratified overlap set (E5) both code independently. Split rule, deterministic and documented like the pilot draw, assignment of a paper to R1 or R2 by the parity of the `Zotero_Key` in stable sort, so the split is reproducible and fixed per paper without per-paper coordination; the overlap set is drawn before the split and assigned to both. The split rule is a load division, not a content criterion, and may be replaced at real contact by any other load-equal rule. Retro-coding of the round 1 includes does not run along but staggered after the update batch (linked to ledger decision 4), only once the update pass has stabilized the field definitions under real conditions; SQ1 to SQ3 are answerable on the update batch alone, retro-coding raises coverage and sharpness of the gap map but doubles the load before proven definitions. Consequence for tool and protocol: PRISM captures one human coding per Include paper with a coder id (R1, R2) analogous to the screening reviewer id; the staggered retro-coding is carried as its own, later coding run in the protocol, not as a precondition of the update pass.

**E5 (simulated, ratifiable, 2026-07-18).** Size as a share, not a drifting absolute, the overlap set spans roughly a fifth of the Include papers to be coded, with a lower bound of at least two papers per occupied stratum, so each stratum can carry an agreement at all. Strata analogous to the pilot, the cross of Prompting yes/no (`Prompting` category column) and text base (full text or deepest available distillate against abstract); the draw per stratum is deterministic by `Zotero_Key`, as in the pilot, and committed before coding start, so the overlap set is fixed in advance and not chosen retrospectively. Reporting set of the agreement measures per field, in the project's decomposition framing, observed agreement first, then the coefficients, never a coefficient alone and never as an error rate of one coder. At single-select fields observed agreement plus Cohen's kappa and PABAK; at multi-select fields agreement per code (pairwise yes/no per code over the overlap set), never over the field as a whole, because a multi-select field carries no single value per paper. Unresolvable divergence after the consensus session is a finding and enters the ambiguity list, not an error balance. Computed by committed scripts, never by hand, with the same discipline as the screening agreement metrics. Consequence for tool and protocol: PRISM holds R1's and R2's single codings on the overlap set separately, the consensus value from procedure step 3 replaces them in the analysis data set, the single codes remain as raw data; the agreement script reads the coder-separated exports.

**E6 (deferred 2026-07-18).** The advisory LLM coding track is not a precondition of the main coding and runs only if it demonstrably takes work off the coders. If it comes, it needs the protocol-named, pre-fixed sub-protocol (model version, prompt, parameters, committed before the run); without a protocol it does not run.

### G.6 Documentation form of the coding decisions

The capture location is the PRISM tool (E4, resolved 2026-07-18). The coding fields sit directly in the existing assessment column of the one working view, below the decision block, and appear only once the binding decision Include has fallen; no separate tab, no separate page. Captured per Include paper are the `AN_` fields as a closed selection directly from `assessment/categories.yaml` v1.3, with per-field non-decidability capture (E3), a notes field, and evidence locations from the existing evidence pins (E8). Vocabulary enforcement thus happens at capture time, as the pre-registration expects, a closed selection cannot produce an invalid value. The work package is held in [[specification]] as ADR-026 with FR-14; the panel must stand before coding starts, so the tool does not switch mid-pass.

The Excel in the column schema of `assessment/human_assessment.csv` (extended by the `AN_` columns after `Notes`, section D) stays as export and fallback format; the P3 import bridge (split, trim, match against the list, empty-cell check for includes, visible import report, never silent acceptance) stays the entry seam for stock captured outside the tool. `categories.yaml` v1.3 is the one source panel, bridge, and export read from.

**E8 (resolved by E4, 2026-07-18).** With capture in the PRISM tool, pinned evidence carries its source location automatically (marked passage with surrounding snippet); the pin is the source record for SQ3 verbatims, an extra manual convention drops out. Only for verbatims noted outside the tool the quote form in `AN_Notes` stays the fallback.

The documented stock per coding decision:

- the field value itself, vocabulary-validated at capture, exported to the committed CSV,
- the text base in `AN_Coding_Basis`,
- justifications and verbatim material in `AN_Notes`, non-decidability as a per-field capture,
- at consensus cases the consensus record from G.5,
- the pinned evidence with origin (`origin`) and source location as evidence anchor.

## H. Coding decisions, collected

Marker legend: "resolved" is operator-decided and binding; "simulated, ratifiable" follows the simulation convention ([[plan]], Simulated decisions), binding only after the reviewing colleague confirms at the next real contact ([[plan]]).

| Id | Question | Status |
|---|---|---|
| E1 | Ratification of the coding setup (split, retro-coding) | simulated, ratifiable 2026-07-18; split by Zotero_Key parity, retro-coding staggered |
| E2 | Distillate basis only in research-vault-verified version? | resolved 2026-07-18, narrow reading |
| E3 | Non-decidability by notes convention or own code | resolved 2026-07-18, per-field capture in the tool, no amendment |
| E4 | Capture location Excel alone or PRISM extension | resolved 2026-07-18, PRISM analysis panel (ADR-026), Excel as export |
| E5 | Overlap size, strata, agreement reporting set | simulated, ratifiable 2026-07-18; roughly a fifth, pilot strata, per-field decomposition reporting set |
| E6 | Advisory LLM coding track with own sub-protocol | deferred 2026-07-18 |
| E7 | Binding ambiguity threshold for definition revisions | simulated, ratifiable 2026-07-18; quarter threshold as trigger, R1/R2 decide revision |
| E8 | Source-location convention for SQ3 verbatims | resolved by E4, pins carry the source location |

---

# RIS conversion

This section closes the RIS-conversion gap by documenting what is known about the round 1 conversion and binding round 2 to a reproducible procedure.

## Round 1: what happened, what survives

The deep research outputs of round 1 were converted to RIS with the help of an LLM and imported into Zotero, the systems' generated summaries carried along as metadata. What survives in the repository: four restored RIS files in `corpus/deep-research/` and the structure template `ris-template.md`. What does not survive: the conversion prompt as executed, the model and version used, and the raw pre-conversion outputs for all but the restored set. The step is documented as performed but not reproducible; this is one of the named acquisition gaps, and the submitted paper's wording (conversion happened, by an LLM) is accurate but unverifiable in detail.

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

The prompt text is identical for all lanes, as in round 1. Source text: `corpus/deep-research/literature-review-prompt.md` (KONTEXT block plus analysis prompt). Hard line wraps of the source file are unwrapped for pasting; wording is unchanged. The structured deviations from the round 1 text are flagged in A.1.

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

Only include literature published from July 2025 up to and including June 2026, because work published before July 2025 was already covered by the first search round, and this time restriction supersedes the year range 2023-2025 stated in task 1. [DEVIATION: the single time restriction added for round 2, required by section 4.2]
```

## A.2 Lanes L1 to L4 (ChatGPT, Claude, Gemini, Perplexity)

The paste-ready text is A.1 with the two `[DEVIATION]` markers removed and the research question written into task 1 verbatim, nothing else changed. Identical text for all four lanes, pasted as is.

## A.3 Lane L5 (Claude Code web research lane, optional)

Identical prompt text to A.2. The execution environment differs from round 1 (an agentic Claude Code session with web search tools instead of a deep research product interface); the prompt wording is unchanged. The lane is documented like the others: executed prompt verbatim, model version, run date, raw output written to `corpus/deep-research/round2/raw/ClaudeCode_deep-research.md` and committed at run time.

## Related

- [[plan]]
- [[specification]]
- [[data]]
