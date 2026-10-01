---
title: Codebook Amendment v1.4 Proposal
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: draft
language: en
version: "0.1"
created: 2026-10-01
updated: 2026-10-01
authors: [Christopher Pollin]
generated-with: Claude Code (Claude Opus 5.5)
topics: ["[[Coding Scheme]]", "[[Inter-rater Reliability]]"]
related: [update-protocol, analysis-methods, project, plan, methods, journal]
---

# Codebook Amendment v1.4 Proposal

This proposal amends the analysis fields of `assessment/categories.yaml` for the five sub-questions UF1 to UF5 and awaits the operator's decision. Version 1.3 stays in force until then. The ready-to-apply change is `assessment/categories-v1.4.patch`, a unified diff against version 1.3 that `git apply` accepts without conflict. It touches the analysis fields, their presentation entries and a new field-state block. The ten eligibility categories, the decision rule and the exclusion reasons stay unchanged. [[update-protocol#Proposed codebook amendment v1.4]] records the original change list, which this document works out.

## Sub-questions and fields

The research questions are being merged into five sub-questions. The patch relabels the `serves` entries accordingly, with SQ1 becoming UF1, SQ2 becoming UF2, SQ3 becoming UF3 and SQ4 becoming UF5. UF4 is new. [[project#Research questions]] still carries the four-question wording and changes with the operator's decision on the question set.

| Sub-question | Fields after v1.4 | Coded by and when |
|---|---|---|
| UF1 Nutzung | `AN_Task` (new), `AN_Population`, `AN_Prompting_Role` (Recommended_Practice) | Screening coding of every Include |
| UF2 Bias-Formen | `AN_Bias_Axes` and `AN_Harm_Types` with sharpened rules, `AN_Population` | Screening coding of every Include |
| UF3 Umgang mit Bias | `AN_Prompt_Techniques`, `AN_Mitigation_Stage`, `AN_Mitigation_Status`, `AN_Stage_Status` (new) | Screening coding of every Include |
| UF4 Begriffliche Fundierung | `AN_Gender_Definition`, `AN_Gender_Understanding`, `AN_Theory_Reference` (all new), theories as Assertions | Content analysis of included full texts after screening |
| UF5 Kompetenzen | `AN_Prompting_Role` (Learning_Content), `AN_Mitigation_Stage` (Organisational_Process), Assertions | Screening coding plus synthesis |

The human reviewers code without AI pre-assessment ([[journal]], entry of 1 October 2026 on human screening). The UF4 fields are therefore defined for coding by a reader of the full text, and their anchor examples below come from the corpus.

## UF4 fields

UF4 asks whether the literature defines gender and bias, which understanding of gender it uses and which theories it draws on. These questions can be answered only from the full text, so the three fields are optional during screening and binding when `AN_Coding_Basis` is `Fulltext` in the content analysis. A Work coded from an abstract records the field as undecidable from the abstract.

### AN_Gender_Definition

Single value. It records whether the Work says what it means by gender.

| Value | Definition |
|---|---|
| `Explicit` | The Work determines gender in a sentence of its own or adopts a cited determination explicitly. A stated position on what gender is counts, such as the rejection of gender as a fixed property. |
| `Implicit_Only` | The Work gives no determination, but its understanding is recognisable from its categories, its measurement or its theoretical frame. |
| `Absent` | The Work treats gender as an object but neither determines it nor lets an understanding become recognisable. |
| `Not_Applicable` | The Work does not treat gender as an object. Sample demographics, a gender variable among controls or a single mention in an enumeration do not make gender an object. |

`Not_Applicable` is set exactly when `AN_Gender_Understanding` is `Not_Applicable`, and `Absent` goes with `Unclear`. The defining passage goes to `AN_Notes` with its location.

### AN_Gender_Understanding

Multiple values. It records the understanding that underlies the Work's own analysis. A conceptual statement that the analysis does not follow is recorded in `AN_Notes`, and the value follows the analysis.

| Value | Definition |
|---|---|
| `Binary_Categorical` | Gender appears as two fixed categories, such as woman and man, without the Work examining this setting. |
| `Social_Construct` | Gender is treated as socially produced, as a relation or as a structure of power. |
| `Non_Binary_Inclusive` | The analysis carries genders beyond the binary, such as non-binary or trans persons, as categories of its own. A mention in a limitation section does not suffice. |
| `Intersectional` | Gender is analysed in interaction with at least one further axis, under the same rule as `Intersectional` in `AN_Bias_Axes`. |
| `Unclear` | The Work treats gender, but its understanding cannot be determined. |
| `Not_Applicable` | The Work does not treat gender as an object. |

`Binary_Categorical` and `Non_Binary_Inclusive` exclude each other. `Unclear` and `Not_Applicable` stand alone. `Social_Construct` and `Intersectional` combine with each other and with `Non_Binary_Inclusive`.

### AN_Theory_Reference

Single value, `Yes` or `No`. `Yes` applies when the Work names a theory, a theoretical tradition or a theoretical concept and uses it to frame its treatment of gender or bias. A citation that supports an empirical finding is no theory reference. A technical fairness definition counts toward the definition of bias. The theories themselves are recorded as source-linked Assertions with their location, because a closed list would fix the answer to UF4 before the reading. The values are quoted in the YAML, since YAML 1.1 reads a bare `Yes` and `No` as booleans and the presentation keys would then no longer match the codes.

### Anchor examples from the corpus

The locations refer to the local Paper Markdown under `docs/data/fulltext/<Zotero key>.md`, which is built from the reviewed full texts and is not committed. The proposed codes are the drafter's reading and part of what the pilot tests.

| Work | Passage and location | Proposed coding |
|---|---|---|
| GP4JDSI8, Klein et al. (2024), Data Feminism for AI | "neither sex nor gender are essential, 'natural', or fixed properties" (line 141) | `Explicit`, `Social_Construct` and `Non_Binary_Inclusive`, `Yes` (data feminism) |
| 2EBHMYU4, Ulnicane (2024), Intersectionality in Artificial Intelligence | "the traditional understanding of gender as binary (male/female) is being challenged today" with intersectionality as frame (line 41) | `Explicit`, `Social_Construct` and `Intersectional`, `Yes` (intersectionality) |
| 7L93JBLR, Karagianni (2025), Gender in a stereo-(gender)typical EU AI law | "gender equality should not be understood as solely concerning women" after a passage on queer theory (lines 84 and 86) | `Explicit`, `Social_Construct` and `Intersectional`, `Yes` (queer theory, intersectional feminism) |
| CYZQ6XPK, Kaneko et al. (2024), Evaluating gender bias in LLMs via chain-of-thought prompting | "The gender biases we considered in this paper cover only binary gender." (Limitations, line 360) | `Implicit_Only`, `Binary_Categorical`, `No`. The limitation statement goes to `AN_Notes`. |
| 3XMBE43Z, Voutyrakou et al. (2025), Algorithmic Governance | "we included variations that referenced non-binary individuals" (Methods, line 121) | `Implicit_Only`, `Non_Binary_Inclusive` |
| 22XEFRWP, Petzel et al. (2025), Prejudiced interactions with LLMs | "Gender was dummy-coded (0 = woman, 1 = man)" (table note, line 148) | Boundary case. The coding of participants is sample demography and decides nothing alone. The understanding follows from how the Work treats its object. |
| RAV6DAFQ, Goldkind et al. (2023), ChatGPT and Social Work | No passage on gender in the full text | `Not_Applicable`, theory reference judged on the treatment of bias only |

The UF4 wording also asks whether the literature defines bias. Two corpus passages show the range. AZJW38MF, a round-two corpus text on socio-technical ethics work in social work, states that "In social work it is common to define bias as a prejudice against certain problems" (line 159). YMABYPKF, Salinas et al. (2025), introduces bias through the legal pair of disparate treatment and disparate impact (lines 43 to 47). The patch adds no bias-definition field, see [[#Uncertainties of this draft]].

## UF1 task field

`AN_Task` records the task of professional practice for which the Work describes, tests or proposes the use of AI. It complements `AN_Population`, which records the field or group of addressees. The field has multiple values, and every value is a candidate until the pilot rule below is met. The YAML marks the field with `pilot: true` and keeps it optional for Include until then.

| Value | Definition | Corpus anchor |
|---|---|---|
| `Documentation_Recording` | Case-related recording, such as case, session and progress notes, reports and care plans | JI24FQPV, Creswell Báez et al. (2025), "real-time drafting of session notes" (section on client-involved practice, line 43) |
| `Case_Assessment_Decision_Support` | Assessment of situations, risks and needs, and support for decisions about help | 7FEFMCBZ, Cheng et al. (2022), worker and algorithm "screening decisions" in child welfare (line 113) |
| `Counselling_Client_Communication` | Counselling, conversation and written or digital communication with clients | MA3LBJS6, Linnemann et al. (2023), section "NLP in der Beratung" (line 75) |
| `Administration` | Organisational work without case reference, such as scheduling, applications of the organisation, internal correspondence and billing | R5QQTD95, Schönauer (2025), digital technology "im administrativen Bereich" (line 9) |
| `Research` | Research in social work, such as literature work, data analysis and writing | U3AJIXAJ, Victor et al. (2023), section "General Research Activities" (line 53) |
| `Teaching_Further_Education` | Study, teaching and continuing education of professionals | YRBP6IEJ, Rodriguez et al. (2024), generative AI in the MSW curriculum |
| `Other_Task` | A task the list lacks, named in `AN_Notes` | |
| `None` | The Work describes no task of use | |

`Documentation_Recording` and `Administration` are separated by the case reference. A Work on a general LLM benchmark without an application task receives `None`. A Work whose task lies outside social work, such as résumé screening, receives `Other_Task` with the task in `AN_Notes`.

## Bias axes and harm types

The process diagnostics in `generated/completion/agent-track-diagnostics.csv` show that the two operationally isolated agent tracks agree on the decisions and differ most often on `AN_Harm_Types` and `AN_Bias_Axes`, followed by `AN_Mitigation_Stage`. The file holds the current values. Track agreement is a workflow diagnostic and no reliability estimate ([[update-protocol#Source-grounded AI Agent Review]]). Reading the disagreeing records against the AI Agent Review outcomes and the consensus records shows recurring patterns, and each proposed rule answers one of them. The rules stand in the YAML as `rules` entries of the two fields, and the German presentation definitions are sharpened to match.

### Patterns in the bias axes

| Pattern | Records | Proposed rule |
|---|---|---|
| One track codes axes the Work does not analyse | MA3LBJS6 (the consensus record states that age and gender are no axes the Work analyses), 7VFNS5R3 (study subject and programming experience are no axes of inequality) | An axis is coded when the Work analyses bias along it, measures or compares groups along it, or uses it as a worked example in its own argument |
| One track codes further axes, and the review settles sometimes for the longer and sometimes for the shorter list | 4ZL5Q48E and 4KMMPA6A (shorter list kept), BHXDU7VM and 2EBHMYU4 (longer list kept) | The same rule, which gives the review a criterion instead of a choice between tracks |
| `None` against named axes | VSZM7CT6, 8MRNK6FX | `None` when the Work discusses bias without an analysed axis. The reviews accepted an axis that the Work uses as its own example. |
| `Other_Axis` instead of or beside listed axes | P4YQIKJX, 7VFNS5R3, THGC3PA2 | `Other_Axis` only for a social axis the list lacks, named in `AN_Notes` |
| Differences on Race_Ethnicity, Nationality_Migration and Language_Culture | BHXDU7VM, 2EBHMYU4, EQV4DNQR, UKKQKL7I | Race_Ethnicity, Nationality_Migration and Language_Culture each receive a stated scope, and the Work's own naming decides |
| `Intersectional` coded by one track only | A2P8MXMY (kept), 4KMMPA6A (dropped) | A passage must show an outcome or argument that depends on the combination of axes |

The positive anchor for `Intersectional` is HMDFMBV3, Ma et al. (2023), whose dataset pairs a combined group with its stereotype, such as "('Black+Women', 'Angry Black Woman', …)" (section 2.3, line 45). The negative anchor for enumerations is R7V99ERA, Field et al. (2023), whose introduction lists gender, disability and mental health status as dimensions studied elsewhere (line 39), while the Work itself examines race. The boundary anchor is VSZM7CT6, Hodgson et al. (2022), with the sentence "AI algorithms may reinforce racial and gender stereotypes" (line 106). The AI Agent Review accepted gender and race here, and the pilot should test whether reviewers read such a sentence as a worked example or as an enumeration.

### Patterns in the harm types

| Pattern | Records | Proposed rule |
|---|---|---|
| One track assigns many more harm types than the other, and the review settles in both directions | 7FEFMCBZ and 4ZL5Q48E (shorter list kept), P4YQIKJX and A2P8MXMY (longer list kept), QUV5DQH3 and J5EF9W6M (mixed) | A harm type is coded when the Work demonstrates, measures or argues it for its own object, with one passage per value. Reviews code the harm types that structure their synthesis. |
| Discrimination assigned where the Work treats no decision about persons | VSZM7CT6, THGC3PA2 (both dropped in review) | Allocational harms are separated from representational harms first. Discrimination requires an allocation or a decision about persons or groups. |
| Direct against indirect discrimination | R7V99ERA, T8R8RKX9 | Direct when the decision changes with the group attribute itself, indirect when a neutral criterion or proxy produces the disadvantage. The Work's own classification takes precedence. |
| Exclusionary norms, stereotyping, misrepresentation and erasure used interchangeably | 7VFNS5R3, MA3LBJS6, UKKQKL7I, 4KMMPA6A | Each of the four receives a delimiting definition with an example |

The anchor for the taxonomy is the corpus Work MS3CNU3S, Gallegos et al. (2024), whose Table 1 divides the harms into representational harms and allocational harms, the latter being the "Disparate distribution of resources or opportunities between social groups" (lines 104 to 114). The project's harm vocabulary already follows this taxonomy, but the v1.3 definitions dropped the division, which is the most likely source of the discrimination disagreements. This is an inference from the disagreeing records listed above.

YMABYPKF, Salinas et al. (2025), anchors the direct and indirect distinction. The Work audits names that correlate with race and gender and concludes that "any disparities we observe may constitute bias in the form of disparate impact" (line 47), so the proposed code is `Indirect_Discrimination`. MA3LBJS6, Linnemann et al. (2023), anchors `Exclusionary_Norms`. Digital first contact must not be the only route, "da sonst weniger digital affine Hilfesuchende nicht mehr erreicht werden" (line 87), and the consensus record of the ratification run accepted `Exclusionary_Norms` on this passage.

The rules change at least one settled record. The AI Agent Review kept only `Disparate_Performance` for 7FEFMCBZ, while the Work reports a racial disparity in screen-in decisions (line 113), which the proposed rules would read as an allocational harm. This conflict is one reason for the recoding recommended below.

## Intervention-status pairs

`AN_Mitigation_Status` holds one value per Work, so a Work that evaluates a prompt intervention and only proposes organisational measures cannot show which stage reached which status. The new optional field `AN_Stage_Status` records one pair per coded stage, using the codes `<Stage>__<Status>` such as `Prompt_Practice__Evaluated`. It is binding when `AN_Mitigation_Status` is `Evaluated` or `Demonstrated` and receives `None` otherwise. The highest status across the pairs equals `AN_Mitigation_Status`, and every stage in the pairs also appears in `AN_Mitigation_Stage`. The intervention behind each pair is named in `AN_Notes`.

Composite codes keep the field inside the existing machinery, because `src/publish/build_analysis_fields.py` and PRISM handle closed multi-value vocabularies and no structured pair type. Pairs at the level of single prompt techniques remain in `AN_Notes`, since technique-level pairs would multiply the vocabulary for a subset of Works. The upgrade path is a structured pair type in the packet schema and in PRISM.

## Field state not collected under v1.3

Every new field carries `introduced_in: "1.4"`. A new block `analysis_field_states` defines the state `not_collected` with a German label for the interface. The state is derived for a record and field whenever the field was introduced after the codebook version under which the record was coded. Coders never enter it. It keeps three statements apart that the v1.3 data would otherwise mix, the coded absence `None`, the coder's declaration that a field is undecidable from the source, and a field nobody was asked to code. A map or table therefore never reads a Work coded under v1.3 as a Work without a task or without a gender definition.

## Recoding recommendation

1. The new UF4 fields are coded for every included Work with a full text in the human content analysis after screening. This is first coding and no recoding.
2. `AN_Task` is coded for every Include. For Works coded under v1.3 it shows `not_collected` until a coding pass reaches the Work.
3. `AN_Bias_Axes` and `AN_Harm_Types` are recoded for every Work coded under v1.3. The sharpened rules move boundaries systematically, as the 7FEFMCBZ case shows, and a mix of old and new boundaries would make the UF2 tables uninterpretable. The recoding runs in the same pass as `AN_Task`, so each full text is read once.
4. `AN_Stage_Status` is coded for the Works whose `AN_Mitigation_Status` is `Evaluated` or `Demonstrated`.
5. The remaining v1.3 fields keep their values, because their definitions do not change.

Who carries the recoding pass, the agent tracks with later human verification or the human reviewers within the content analysis, is an operator decision ([[#Decisions for the operator]]).

## Pilot protocol

### Sample

The pilot draws ten included Works with a local full text. The sample excludes every Work that serves as an anchor example above or whose agent coding this document discusses, because either would show the reviewers an expected answer and undo the coding without AI pre-assessment. The strata cover review round, the recorded eligibility values of Gender and Feministisch, study type, direct reference to social work, language and publication form. The round-one values come from the consolidated expert assessment. The UF4 value space is the target, so the list contains Works that are likely to fall on each side of the `Explicit`, `Implicit_Only`, `Absent` and `Not_Applicable` boundaries.

| No. | Zotero key | Work | Round | Strata |
|---|---|---|---|---|
| 1 | G53MCF3W | Gaba et al. (2025), Bias, accuracy, and trust: Gender-diverse perspectives on large language models | 1 | Gender ja, Feministisch nein, experimental, outside social work |
| 2 | KNQYFQ6B | Sant et al. (2024), The power of prompts: Evaluating and mitigating gender bias in MT with LLMs | 1 | Gender ja, Feministisch nein, experimental, outside social work |
| 3 | XW8NHCIE | Wilson et al. (2024), Gender, race, and intersectional bias in AI resume screening via language model retrieval | 1 | Gender ja, Feministisch nein, experimental, outside social work |
| 4 | PQC9G5EU | Wajcman et al. (2023), Feminism Confronts AI: The Gender Relations of Digitalisation | 1 | Gender ja, Feministisch ja, theoretical, outside social work |
| 5 | VFD9ENG6 | Gohar et al. (2023), A Survey on Intersectional Fairness in Machine Learning | 1 | Gender ja, Feministisch ja, literature review, outside social work |
| 6 | BDI6XU5A | Franken et al., Gender und KI-Anwendungen. Trägt KI zum Genderproblem oder zu seiner Lösung bei? | 2 | German project report on gender and AI, round two |
| 7 | Y6SAPNT2 | Vethman et al. (2025), Fairness Beyond the Algorithmic Frame | 1 | Gender nein, Feministisch ja, empirical, social work |
| 8 | LGYFN6JK | Patton et al. (2023), ChatGPT for Social Work Science | 1 | Gender ja, Feministisch nein, theoretical, social work |
| 9 | H59BNSX8 | James et al. (2023), Algorithmic decision-making in social work practice and pedagogy | 1 | Gender nein, Feministisch nein, empirical, social work |
| 10 | 3B87U5LN | Siddals et al. (2024), Experiences of generative AI chatbots for mental health | 1 | Gender nein, Feministisch nein, empirical, social work |

Reserves for a replacement within the same stratum are 7G73H3KM, Small (2023), feminist classroom assignments with generative AI, AIZGTQKG, Shah (2025), gender bias and digital literacy, 2SLISKSW, McCrory (2024), intersectionality in global AI governance, and 79TL6HSB, Chen et al. (2025), social work and AI. BDI6XU5A is the only round-two Work in the sample. It leaves the sample if the human screening excludes it, and the next reserve of its stratum takes its place. Its corpus label names a first author who differs from the imprint of the report, which the Zotero curation should check before the pilot. The author labels follow the corpus metadata in `docs/data/research_vault_v2.json`.

### Procedure

1. Both reviewers read the v1.4 definitions and the anchor examples. They discuss no pilot Work beforehand.
2. Each reviewer codes the ten Works independently from the full text in PRISM or the exchange sheet, without AI pre-assessment and without seeing the other's coding. The coding covers `AN_Gender_Definition`, `AN_Gender_Understanding`, `AN_Theory_Reference` with the theories as located passages, `AN_Task`, and `AN_Bias_Axes` and `AN_Harm_Types` under the sharpened rules. Each value carries its passage.
3. A deterministic script compares the two codings field by field and lists every difference with both passages.
4. The reviewers discuss every difference, agree on a consensus code and classify the cause as a gap in the definition, a boundary between two values, an overlooked passage or a difference of interpretation.
5. The definitions are revised where the classification calls for it, and the revision is recorded with its reason.

### Agreement measure

Ten Works carry no stable coefficient, so the pilot reports raw agreement and, for multi-value fields, positive specific agreement per value (Cicchetti and Feinstein 1990). Cohen's kappa is reported descriptively and without a threshold, since its confidence interval at this size spans most of the scale (Sim and Wright 2005). For theories, the comparison is the overlap of the located passages per Work. The disagreement table with causes carries more weight than any coefficient. Reliability in the sense of [[analysis-methods#Tier 2, analyses after complete expert-verified coding]] needs the larger stratified sample planned there.

### Decision rule

1. A single-value field is final when the reviewers agree on at least eight of the ten Works after the first independent round and no remaining difference stems from a gap in the definition.
2. A value of a multi-value field is final when no difference on it stems from a gap in the definition. Two values that the reviewers confuse in two or more Works are either merged or separated by an added rule.
3. A value that no reviewer uses in the pilot stays provisionally in the vocabulary and is reviewed after the first coding batch. Absence from ten Works is no reason to remove it.
4. If a field misses the rule, its revised definitions are tested on five further included Works from the reserve and the remaining corpus, under the same procedure.
5. With the rule met, `pilot: true` is removed from `AN_Task`, its optionality is decided, and the final vocabulary is recorded as v1.4 with a changelog entry.

## Consequences of adoption

Applying the patch changes the vocabulary only. The following follow-ups belong to the same adoption step.

- `npm run build` regenerates `docs/data/analysis_fields.json`, and the build manifest records the new input. The in-memory projection of the patched YAML through `build_payload` succeeds and yields the new fields with their German labels.
- `FIELDS` and `VALUE_SCOPE` in `src/analysis/build_completion_package.py` still use SQ1 to SQ4 and need the UF1 to UF5 mapping, and its `FIELD_STATES` needs `not_collected`. Without that change the field-state table reports every new field as missing.
- PRISM enforces bindings only for `AN_Harm_Types` today. The `binding_when` entries of the new fields need the same treatment, and the composite codes of `AN_Stage_Status` need a readable control.
- Annotations need a recorded codebook version, so that `not_collected` can be derived. Records without it count as v1.3.
- [[update-protocol#Analysis coding]], [[analysis-methods#Answering the research questions]] and [[project#Research questions]] change with the adopted vocabulary.

## Decisions for the operator

1. Adoption of the amendment as a whole or in parts, with the patch as the change to apply.
2. Who carries the recoding of bias axes and harm types and the coding of `AN_Task` for Works coded under v1.3.
3. Whether UF4 receives a field for the definition of bias.
4. Confirmation of the pilot sample, or a replacement by the reviewers.

## Uncertainties of this draft

- UF4 names the definition of bias, and the patch adds no field for it. A field `AN_Bias_Definition` with the values of `AN_Gender_Definition` would be the smallest addition. It was left out because the brief named three fields.
- `AN_Gender_Understanding` codes the understanding of the analysis. Works whose conceptual position and operationalisation diverge, as in CYZQ6XPK, keep the conceptual position only in `AN_Notes`. A split into a conceptual and an operational field would make this divergence countable, at the price of a further field.
- The line between `Explicit` and `Implicit_Only` is the least settled. A scope statement such as the limitation passage of CYZQ6XPK can be read as an explicit determination.
- The scope of `AN_Theory_Reference` is limited to theories that frame gender or bias. Works that ground their argument in a social-work or justice theory without reference to gender or bias may be read either way.
- The self-help use of chatbots by clients, which the mental-health literature of the corpus describes, fits no task value cleanly. It may need its own value or a rule for `Counselling_Client_Communication`.
- The proposed codes in the anchor tables are the drafter's reading, checked against the passages quoted but against no second reader.
- The rule that the Work's own classification decides between direct and indirect discrimination privileges legal framings of US origin, as in YMABYPKF.
