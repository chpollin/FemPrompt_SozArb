---
title: Codebook v1.4
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: active
language: en
version: "1.0"
created: 2026-10-01
updated: 2026-10-01
authors: [Christopher Pollin]
generated-with: Claude Code (Claude Opus 5.5)
topics: ["[[Coding Scheme]]", "[[Inter-rater Reliability]]"]
related: [update-protocol, analysis-methods, project, plan, methods, journal, data]
---

# Codebook v1.4

The operator adopted codebook version 1.4 on 1 October 2026. `assessment/categories.yaml` carries it as the vocabulary in force, with the field rules and anchor examples that the agent tracks read. This document holds the reasons for the amendment, the corpus patterns behind the sharpened rules and the anchor passages with their locations. The binding coding rules, the run protocol and the validation design stand in [[update-protocol#Analysis coding]]. The file name keeps the word proposal from the drafting stage, because a rename would remove the old path.

## Adoption decisions

The operator decided the following on 1 October 2026.

- The ten eligibility categories, the decision rule and the exclusion reasons stay unchanged. Human reviewers screen in PRISM without AI pre-assessment.
- The analysis fields are coded only by AI agent tracks.
- SQ4 receives `AN_Gender_Definition`, `AN_Bias_Definition`, `AN_Gender_Understanding` and `AN_Theory_Reference`. `AN_Bias_Definition` answers the uncertainty of the draft about the definition of bias and uses the four values of `AN_Gender_Definition`.
- SQ1 receives `AN_Task` as a pilot field with the drafted values.
- `AN_Bias_Axes` and `AN_Harm_Types` receive the sharpened rules and anchor examples below.
- Every annotation records its codebook version. A field introduced in 1.4 derives the state `not_collected` for an annotation coded under 1.3, and no coder enters that state.
- `AN_Stage_Status` is deferred until a validator for its pairing rules exists ([[#Deferred stage-status pairs]]).
- The human pilot of the draft is replaced by the agreement of the two isolated AI tracks per field and a human spot check against the full text ([[update-protocol#Validation of the AI coding]]).
- The works coded under 1.3 are recoded by the AI tracks for `AN_Bias_Axes` and `AN_Harm_Types` and receive the new fields.

The draft numbered the sub-questions UF1 to UF5. The adopted codebook uses the identifiers SQ1 Nutzung, SQ2 Bias-Formen, SQ3 Umgang mit Bias, SQ4 Begriffliche Fundierung and SQ5 Kompetenzen of [[project#Research questions]]. The patch `assessment/categories-v1.4.patch`, cut against the earlier numbering, was removed. The adopted change was cut anew against the current file.

## Sub-questions and fields

| Sub-question | Fields after v1.4 |
|---|---|
| SQ1 Nutzung | `AN_Task` (new, pilot), `AN_Population`, `AN_Prompting_Role` (Recommended_Practice) |
| SQ2 Bias-Formen | `AN_Bias_Axes` and `AN_Harm_Types` with sharpened rules, `AN_Population` |
| SQ3 Umgang mit Bias | `AN_Prompt_Techniques`, `AN_Prompting_Role`, `AN_Mitigation_Stage`, `AN_Mitigation_Status` |
| SQ4 Begriffliche Fundierung | `AN_Gender_Definition`, `AN_Bias_Definition`, `AN_Gender_Understanding`, `AN_Theory_Reference` (all new), theories as located theory references |
| SQ5 Kompetenzen | `AN_Prompting_Role` (Learning_Content), `AN_Mitigation_Stage` (Organisational_Process) |

## SQ4 fields

SQ4 asks whether the literature defines gender and bias, which understanding of gender it uses and which theories it draws on. These questions can be answered only from the full text, so the fields are binding when `AN_Coding_Basis` is `Fulltext`.

`AN_Gender_Definition` and `AN_Bias_Definition` record whether a work says what it means by gender or by bias. `Explicit` needs a determination in a sentence of the work or an explicitly adopted cited one, and the coding packet carries that passage with its location. A technical fairness criterion counts as a determination of bias. `Implicit_Only` applies when the understanding is recognisable from categories, measurement or frame only. `Absent` applies when the work treats the object without either. `Not_Applicable` applies when gender or bias is no object of the work. Sample demographics, a gender control variable or a single mention in an enumeration do not make gender an object.

`AN_Gender_Understanding` records the understanding that underlies the work's own analysis. A conceptual statement that the analysis does not follow goes to `AN_Notes`. `Binary_Categorical` and `Non_Binary_Inclusive` exclude each other, and `Unclear` and `Not_Applicable` stand alone. `AN_Gender_Definition` is `Not_Applicable` exactly when the understanding is `Not_Applicable`, and `Absent` exactly when it is `Unclear`. The coding-packet validator enforces these pairings.

`AN_Theory_Reference` is `Yes` when the work names a theory, a theoretical tradition or a theoretical concept and uses it to frame its treatment of gender or bias. A citation that supports an empirical finding is no theory reference. The theory itself is recorded as a located theory reference with its name, passage and location, because a closed list would fix the answer to SQ4 before the reading. The values are quoted in the YAML, since YAML 1.1 reads a bare `Yes` and `No` as booleans.

### Anchor examples

The locations refer to the local Paper Markdown under `docs/data/fulltext/<Zotero key>.md`, which is built from the reviewed full texts and is not committed.

| Work | Passage and location | Coding |
|---|---|---|
| GP4JDSI8, Klein et al. (2024), Data Feminism for AI | "neither sex nor gender are essential, 'natural', or fixed properties" (line 141) | `Explicit`, `Social_Construct` and `Non_Binary_Inclusive`, `Yes` (data feminism) |
| 2EBHMYU4, Ulnicane (2024), Intersectionality in Artificial Intelligence | "the traditional understanding of gender as binary (male/female) is being challenged today" with intersectionality as frame (line 41) | `Explicit`, `Social_Construct` and `Intersectional`, `Yes` (intersectionality) |
| 7L93JBLR, Karagianni (2025), Gender in a stereo-(gender)typical EU AI law | "gender equality should not be understood as solely concerning women" after a passage on queer theory (lines 84 and 86) | `Explicit`, `Social_Construct` and `Intersectional`, `Yes` (queer theory, intersectional feminism) |
| CYZQ6XPK, Kaneko et al. (2024), Evaluating gender bias in LLMs via chain-of-thought prompting | "The gender biases we considered in this paper cover only binary gender." (Limitations, line 360) | `Implicit_Only`, `Binary_Categorical`, `No`. The limitation statement goes to `AN_Notes`. |
| 3XMBE43Z, Voutyrakou et al. (2025), Algorithmic Governance | "we included variations that referenced non-binary individuals" (Methods, line 121) | `Implicit_Only`, `Non_Binary_Inclusive` |
| 22XEFRWP, Petzel et al. (2025), Prejudiced interactions with LLMs | "Gender was dummy-coded (0 = woman, 1 = man)" (table note, line 148) | Boundary case. The coding of participants is sample demography and decides nothing alone. |
| RAV6DAFQ, Goldkind et al. (2023), ChatGPT and Social Work | No passage on gender in the full text | `Not_Applicable` |
| AZJW38MF, round-two text on socio-technical ethics work in social work | "In social work it is common to define bias as a prejudice against certain problems" (line 159) | `AN_Bias_Definition` `Explicit` |
| YMABYPKF, Salinas et al. (2025) | Bias introduced through the legal pair of disparate treatment and disparate impact (lines 43 to 47) | `AN_Bias_Definition` `Explicit` |

## SQ1 task field

`AN_Task` records the task of professional practice for which a work describes, tests or proposes the use of AI. It complements `AN_Population`, which records the field or group of addressees. The values are `Documentation_Recording`, `Case_Assessment_Decision_Support`, `Counselling_Client_Communication`, `Administration`, `Research`, `Teaching_Further_Education`, `Other_Task` and `None`. `Documentation_Recording` and `Administration` are separated by the case reference. A general LLM benchmark without an application task receives `None`, and a task outside social work, such as résumé screening, receives `Other_Task` with the task named in `AN_Notes`. The YAML marks the field with `pilot: true` and keeps it optional in PRISM until the values are final.

| Value | Corpus anchor |
|---|---|
| `Documentation_Recording` | JI24FQPV, Creswell Báez et al. (2025), "real-time drafting of session notes" (line 43) |
| `Case_Assessment_Decision_Support` | 7FEFMCBZ, Cheng et al. (2022), worker and algorithm "screening decisions" in child welfare (line 113) |
| `Counselling_Client_Communication` | MA3LBJS6, Linnemann et al. (2023), section "NLP in der Beratung" (line 75) |
| `Administration` | R5QQTD95, Schönauer (2025), digital technology "im administrativen Bereich" (line 9) |
| `Research` | U3AJIXAJ, Victor et al. (2023), section "General Research Activities" (line 53) |
| `Teaching_Further_Education` | YRBP6IEJ, Rodriguez et al. (2024), generative AI in the MSW curriculum |

The self-help use of chatbots by clients fits no value cleanly. The pilot run of 1 October 2026 contains such a work, and its result decides whether the field needs a value or a rule for it ([[update-protocol#Pilot run of 1 October 2026]]).

## Bias axes and harm types

The process diagnostics in `generated/completion/agent-track-diagnostics.csv` showed that the two agent tracks agreed on the decisions and differed most often on `AN_Harm_Types` and `AN_Bias_Axes`. Reading the disagreeing records against the AI Agent Review outcomes and the consensus records showed recurring patterns, and each rule in the YAML answers one of them.

### Patterns in the bias axes

| Pattern | Records | Rule |
|---|---|---|
| One track codes axes the work does not analyse | MA3LBJS6, 7VFNS5R3 | An axis is coded when the work analyses bias along it, measures or compares groups along it, or uses it as a worked example in its own argument |
| The review settled sometimes for the longer and sometimes for the shorter list | 4ZL5Q48E and 4KMMPA6A (shorter kept), BHXDU7VM and 2EBHMYU4 (longer kept) | The same rule gives the review a criterion instead of a choice between tracks |
| `None` against named axes | VSZM7CT6, 8MRNK6FX | `None` when the work discusses bias without an analysed axis |
| `Other_Axis` instead of or beside listed axes | P4YQIKJX, 7VFNS5R3, THGC3PA2 | `Other_Axis` only for a social axis the list lacks, named in `AN_Notes` |
| Differences on Race_Ethnicity, Nationality_Migration and Language_Culture | BHXDU7VM, 2EBHMYU4, EQV4DNQR, UKKQKL7I | Each of the three receives a stated scope, and the work's own naming decides |
| `Intersectional` coded by one track only | A2P8MXMY (kept), 4KMMPA6A (dropped) | A passage must show an outcome or argument that depends on the combination of axes |

The positive anchor for `Intersectional` is HMDFMBV3, Ma et al. (2023), whose dataset pairs a combined group with its stereotype (section 2.3, line 45). The negative anchor for enumerations is R7V99ERA, Field et al. (2023), whose introduction lists dimensions studied elsewhere (line 39) while the work itself examines race. The boundary anchor is VSZM7CT6, Hodgson et al. (2022), with the sentence "AI algorithms may reinforce racial and gender stereotypes" (line 106).

### Patterns in the harm types

| Pattern | Records | Rule |
|---|---|---|
| One track assigns many more harm types, and the review settled in both directions | 7FEFMCBZ and 4ZL5Q48E (shorter kept), P4YQIKJX and A2P8MXMY (longer kept), QUV5DQH3 and J5EF9W6M (mixed) | A harm type is coded when the work demonstrates, measures or argues it for its own object, with one passage per value |
| Discrimination assigned where the work treats no decision about persons | VSZM7CT6, THGC3PA2 (both dropped in review) | Allocational harms are separated from representational harms first, and discrimination requires an allocation or a decision about persons or groups |
| Direct against indirect discrimination | R7V99ERA, T8R8RKX9 | Direct when the decision changes with the group attribute, indirect when a neutral criterion or proxy produces the disadvantage, and name-based audits count as indirect |
| Exclusionary norms, stereotyping, misrepresentation and erasure used interchangeably | 7VFNS5R3, MA3LBJS6, UKKQKL7I, 4KMMPA6A | Each of the four receives a delimiting definition |

The anchor for the taxonomy is MS3CNU3S, Gallegos et al. (2024), whose Table 1 divides representational from allocational harms, the latter being the "Disparate distribution of resources or opportunities between social groups" (lines 104 to 114). The v1.3 definitions had dropped this division, which is the most likely source of the discrimination disagreements. This is an inference from the records listed above. YMABYPKF, Salinas et al. (2025), anchors the indirect case, since it audits names that correlate with race and gender and concludes that "any disparities we observe may constitute bias in the form of disparate impact" (line 47). MA3LBJS6 anchors `Exclusionary_Norms` with the passage that digital first contact must not be the only route, "da sonst weniger digital affine Hilfesuchende nicht mehr erreicht werden" (line 87).

The rules change at least one settled record. The AI Agent Review kept only `Disparate_Performance` for 7FEFMCBZ, while the work reports a racial disparity in screen-in decisions (line 113), which the rules read as an allocational harm. A mix of old and new boundaries would make the SQ2 tables uninterpretable, so the works coded under 1.3 are recoded for both fields.

## Field state not collected

Every new field carries `introduced_in: "1.4"`, and the block `analysis_field_states` defines `not_collected` with a German label. The completion package derives the state for a work and field when the field was introduced after the newest codebook version of the work's governed annotations. An annotation without a recorded version counts as 1.3. The state keeps four statements apart, the coded absence `None`, the declaration that a field is undecidable from the source, a field nobody was asked to code and a field still to be coded. A map or table therefore never reads a work coded under 1.3 as a work without a task or without a gender definition.

## Deferred stage-status pairs

`AN_Mitigation_Status` holds one value per work, so a work that evaluates a prompt intervention and only proposes organisational measures cannot show which stage reached which status. The draft proposed `AN_Stage_Status` with composite codes such as `Prompt_Practice__Evaluated`, whose pairing rules tie each pair to a coded stage and the highest status to `AN_Mitigation_Status`. The field is deferred until a validator enforces these rules, because without one the composite codes would let inconsistent pairs into the data unnoticed. Until then the intervention behind a status is named in `AN_Notes`, and the answer pages of SQ3 state that the status is a value per work.

## Remaining uncertainties

- The line between `Explicit` and `Implicit_Only` is the least settled, since a scope statement such as the limitation passage of CYZQ6XPK can be read as an explicit determination.
- `AN_Gender_Understanding` codes the understanding of the analysis. Works whose conceptual position and operationalisation diverge keep the conceptual position only in `AN_Notes`.
- Works that ground their argument in a social-work or justice theory without reference to gender or bias may be read either way for `AN_Theory_Reference`.
- The rule that the work's own classification decides between direct and indirect discrimination privileges legal framings of US origin, as in YMABYPKF.
- The anchor codings are the drafter's reading, checked against the passages quoted and against no second reader.
