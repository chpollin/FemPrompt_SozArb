---
type: chapter
stage: working
status: grounded
checked:
  validation: '2026-10-01'
assertions:
  - "[[30_assertions/child-protection-records-carry-existing-inequalities-into-algorithmic-decisions]]"
  - "[[30_assertions/child-protection-nlp-showed-lower-name-recall-for-black-clients]]"
  - "[[30_assertions/child-welfare-workers-showed-smaller-racial-disparity-than-algorithm]]"
  - "[[30_assertions/algorithmic-decision-making-can-introduce-and-expose-structural-bias]]"
  - "[[30_assertions/long-term-care-summaries-showed-model-dependent-gender-differences]]"
  - "[[30_assertions/psychiatric-diagnosis-audit-reports-gender-and-racial-ethnic-bias]]"
  - "[[30_assertions/mental-health-classification-shows-demographic-disparities-across-language-models]]"
  - "[[30_assertions/persona-prompts-shift-llm-outputs-toward-assigned-identities]]"
  - "[[30_assertions/llm-generated-text-positions-cultures-asymmetrically]]"
  - "[[30_assertions/vision-language-model-gender-stereotypes-override-visual-evidence]]"
  - "[[30_assertions/gender-equity-framework-links-gender-bias-to-allocative-and-representational-harms]]"
  - "[[30_assertions/gender-equity-literature-rejects-algorithmic-neutrality]]"
  - "[[30_assertions/visual-disinformation-review-identifies-compounded-risks-for-marginalised-communities]]"
  - "[[30_assertions/focus-groups-anticipate-misreading-of-underrepresented-clients-by-deception-detection]]"
  - "[[30_assertions/single-attribute-fairness-can-conceal-intersectional-unfairness]]"
  - "[[30_assertions/bias-evaluations-name-binary-gender-operationalisation-as-limitation]]"
  - "[[30_assertions/reported-prompting-effects-vary-across-models-and-bias-categories]]"
posits: 4
research-questions:
  - SQ2
created: '2026-10-01'
updated: '2026-10-01'
---

# Bias axes, harm types and affected groups (SQ2)

SQ2 asks which bias axes and harm types the literature identifies for the use of LLMs, and for which groups. This draft answers it in the two layers defined in [[analysis-methods#Answering the research questions]], a descriptive map of coded fields and source-linked Assertions. A map cell means that two codes occur in the same Work. It states no relation between them. The chapter and every Assertion it introduces carry the status `grounded`, which records a passed anchor and schema check only. No AI Agent Review and no domain-expert verification has taken place.

## Coverage

Of the 154 Works with a recorded Include, 21 are coded for the bias-axis field and 21 for the harm-type field. In each field 20 Works carry at least one value and 1 is explicitly coded None, while 132 Works lack coding and 1 is under an integrity hold.[^1] The population field is coded for 21 of the same Works.[^1] The bias-axis by harm-type matrix rests on 21 Works coded on both fields, with 133 Works open.[^2] The coding comes almost entirely from the AI-review decision track. All 16 included Works of that track have a coding state for both fields, while 4 of the 138 included Works of the legacy human track carry bias-axis values and 1 an explicit None.[^1] Every observed cell derives from coding at the lifecycle state `ai-agent-reviewed`, and none rests on domain-expert verification.[^2]

Every empty cell of the matrix has the status `not_determinable` because open Works remain, and no cell has the status `zero_in_complete_coding`.[^2] The map therefore supports statements about combinations that occur in coded Works. It supports no statement that the literature leaves an axis, a harm type or a combination unaddressed. This holds for the axis value Other_Axis, which no coded Work carries, and for the population value Homelessness_Youth, which no coded Work carries either.[^3]

The Assertions draw on the active distillates in `research-vault/20_distillates/publications/`. The Works behind these distillates differ in screening state, which the completion package records per Work.[^4]

- Included and coded in the map: [[30_assertions/child-protection-records-carry-existing-inequalities-into-algorithmic-decisions]], [[30_assertions/child-protection-nlp-showed-lower-name-recall-for-black-clients]], [[30_assertions/child-welfare-workers-showed-smaller-racial-disparity-than-algorithm]], [[30_assertions/gender-equity-framework-links-gender-bias-to-allocative-and-representational-harms]] and the gender-equity source of [[30_assertions/gender-equity-literature-rejects-algorithmic-neutrality]].
- Included without governed coding: [[30_assertions/algorithmic-decision-making-can-introduce-and-expose-structural-bias]].
- No screening decision recorded: the sources of all other Assertions in this chapter, including every LLM-specific harm finding and the feminist chapter in the neutrality Assertion.

The LLM-specific part of the answer below therefore rests on Works whose inclusion is still open.

## Bias axes and harm types in the coded map

The counts below refer to the 21 Works coded for the respective field. A Work can carry several values.[^5]

| Bias axis | Coded Works |
|---|---:|
| Gender | 15 |
| Race_Ethnicity | 13 |
| Socioeconomic | 9 |
| Intersectional | 8 |
| Age | 7 |
| Nationality_Migration | 7 |
| Disability | 6 |
| Language_Culture | 6 |
| Religion | 5 |
| Sexual_Orientation_Identity | 4 |
| Physical_Appearance | 2 |
| Other_Axis | 0 |
| None | 1 |

| Harm type | Coded Works |
|---|---:|
| Stereotyping | 14 |
| Direct_Discrimination | 13 |
| Disparate_Performance | 12 |
| Exclusionary_Norms | 12 |
| Indirect_Discrimination | 10 |
| Misrepresentation | 8 |
| Erasure | 4 |
| Derogatory_Language | 2 |
| Toxicity | 1 |
| None | 1 |

Gender and race or ethnicity are the most frequently coded axes, followed by socioeconomic position and intersectional framings. Stereotyping, direct discrimination, disparate performance and exclusionary norms are the most frequently coded harm types.[^5] The largest cells pair gender with stereotyping and race or ethnicity with disparate performance, each in 11 Works, followed by gender and race or ethnicity with direct discrimination, each in 10 Works.[^2] These cells show joint coding in the same Works and do not show that the sources tie the axis to the harm.

The breadth of the matrix rests on a few broadly coded Works. The literature review "Biases in large language models: Origins, inventory and discussion" carries every axis except Other_Axis and every harm type except None, so each of its codes enters a cell.[^4] Toxicity occurs only in this Work.[^2]

Of the 21 Works coded for population, 13 carry Not_SW_Specific, 4 Child_Family_Welfare, 3 General_Social_Work and 2 Education_Professional, and Mental_Health, Health_Care and Social_Assistance_Admin occur once each.[^3] Child and family welfare is the only social-work field represented by several coded Works. Whether the coded bias literature is predominantly not specific to social work becomes a finding only once coding is complete ([[analysis-methods#Answering the research questions]]).

## Findings carried by Assertions

### Allocative and decision harms in child and family welfare

The social-work evidence on bias in the active distillates concerns predictive and text-processing systems in child protection, not generative LLMs. Two sources argue that administrative records reflect reporting, surveillance and prior institutional decisions rather than the incidence of harm to children, so that systems built on them can reproduce racial and class inequalities.[^6] An evaluation of natural-language processing on contact notes of one county found significantly lower name recall for Black than for white clients, but little evidence that text features increased the aggregate racial disparities of the studied risk model.[^7] A mixed-methods study of one county intake reports that worker decisions assisted by a screening tool produced a smaller Black-white disparity in screen-in rates than a hypothetical algorithm-only policy, without establishing that the tool caused the change.[^8] A conceptual article on social-work practice and pedagogy argues that algorithmic decision-making gives no assurance against racism, disablism, heterosexism and misogyny in allocation and risk assessment and can introduce new structural biases, while reflexive use can draw attention to such biases.[^9]

### Differential treatment in generated care and clinical outputs

The LLM-specific harm evidence comes from studies that vary identity cues while holding case content constant. A counterfactual evaluation of summaries of adult long-term-care case notes reports gender differences that depended on the model, with none detected for Llama 3 and the clearest for Gemma. The authors link an underemphasis of women's health needs to possible disparities in service receipt, which the study does not observe.[^10] An audit of psychiatric diagnoses that varied implicit gender and racial or ethnic identity reports biases in the generated diagnoses and urges caution in clinical decision support.[^11] A preprint on mental-health classification with inserted demographic contexts for gender, race, age, religion, sexuality, nationality and their combinations reports measured fairness disparities, which fairness-aware prompts reduced without removing differences between models and tasks.[^12] All three designs measure differences in model outputs. The step from such a difference to a harm for a service user remains largely unmeasured in the active evidence.[^13]

### Identity- and culture-aligned shifts in generated text

Two experiments report that assigning a political, gender or other sociodemographic persona through the prompt shifts LLM outputs toward that identity.[^14] Two benchmark studies report culturally asymmetric perspectives, with insider tones in most US-context interview scripts and, for prompts written in Chinese, a shift of measured bias toward East Asian perspectives instead of its removal.[^15] Role_Persona is one of the prompt techniques coded for the practice question, so the persona finding names a risk that SQ3 has to weigh against the reported effects of that technique.[^16]

### Representational harms and structural accounts

A probing study of the vision-and-language model VL-BERT reports that learned gender stereotypes can override visual evidence, which the authors treat as a representational harm.[^17] A practice-oriented gender-equity framework connects gender bias from development decisions to unequal service quality, unequal resource allocation, stereotypes, erasure and physical or health harms.[^18] Together with a feminist conference chapter it rejects the premise of algorithmic neutrality and locates bias in socially constructed decisions about teams, data, labels, variables and proxies.[^19] A narrative mini review with an intersectional framework concludes that communities of colour, low-income populations and people in the Global South face compounded risks from AI-generated and AI-amplified visual disinformation.[^20] Participants in focus groups on a hypothetical AI deception-detection tool for mental-health care anticipated that culturally specific, neurodivergent or emotionally regulated behaviour could be misread as deception and that skewed training data could raise false-positive rates for clients from underrepresented backgrounds.[^21]

### Intersectionality and the operationalisation of groups

A survey of intersectional fairness reports that a model can satisfy fairness criteria for separate groups while remaining unfair to people at their intersections, and that computationally convenient subgroup definitions can themselves leave small groups unprotected.[^22] Three bias evaluations state that their binary or predefined treatment of gender and identity does not represent non-binary, diverse or intersectional identities.[^23] Read through the feminist lens of the project, the active evidence divides along this line. Structural disadvantage, intersecting positions and allocation appear in conceptual, review and social-work sources, while the empirical LLM studies measure output differences along single and often binary axes.[^24]

## Groups named in the Assertions

- Black children, families and clients in child protection.[^6][^7][^8]
- Families affected by class inequality in child protection.[^6]
- People exposed to racism, disablism, heterosexism and misogyny in allocation and risk assessment.[^9]
- Women in adult long-term care and in gender-equity frameworks.[^10][^18][^19]
- Patients signalled through gender and racial or ethnic identity in psychiatric diagnosis.[^11]
- Synthetic identities along gender, race, age, religion, sexuality, nationality and their combinations in mental-health classification.[^12]
- Political and gender identity groups under persona prompts.[^14]
- Cultures and language communities in generated text.[^15]
- Communities of colour, low-income populations and people in the Global South.[^20]
- Neurodivergent clients and clients from underrepresented cultural backgrounds.[^21]
- Non-binary, trans and gender-nonconforming people and people at intersections, as groups that the measured categories leave out.[^22][^23]

## Contradictions and tensions

1. Tool or discretion. The conceptual article expects that reflexive use of algorithmic decision-making can expose professional bias, while the county study found worker discretion associated with a smaller racial disparity than the algorithm-only policy.[^8][^9] The two statements concern a possibility and a single setting, so they do not contradict each other in the strict sense. They locate the corrective in opposite places.
2. Component and aggregate disparity. In the child-protection NLP study a disparity appears at the level of name recognition but not in the aggregate output of the risk model, while the same source and a conceptual analysis hold that records encode surveillance and prior decisions.[^6][^7] Whether a disparity is found depends on the level at which it is measured.
3. Model dependence. In the long-term-care study one model showed no detected gender differences and another the clearest differences.[^10] A general statement that LLMs produce gendered care summaries is not supported. The reported effects of prompting-based mitigation also vary across models and bias categories.[^25]
4. Coded map and distillate. The map codes the article "Algorithmic management in a work context" with the gender axis and the harm types direct discrimination and exclusionary norms.[^4] Its active distillate records gender as not an empirical subject of the article (`research-vault/20_distillates/publications/algorithmic-management-work-context.md`), and the two agent tracks differed on this record for both fields.[^26] Field-level verification has to decide which reading holds.

Among the active distillates no source reports a harm as absent for the same group, system and task for which another reports it as present.

## Limitation of the coded map

Each governed agent run codes a record in two operationally isolated tracks, which a separate AI Agent Review reconciles. For the bias-axis field the two tracks were identical on 9 of 22 compared records and differed on 13. The review adopted the value of one track in 11 of these records and set a value from neither track in 2. For the harm-type field the tracks were identical on 4 of 22 records and differed on 18, and the review adopted one track in 11 and set a value from neither track in 7.[^26] On the coding basis the tracks agreed in all 22 records, and on the mitigation status in 20.[^26] The harm-type disagreements concentrate on exclusionary norms, direct discrimination, indirect discrimination and disparate performance.[^26] The file labels these figures a workflow diagnostic and not an accuracy estimate, and both tracks come from the same model environment ([[analysis-methods#Statistical reservations]]). The frozen vocabulary in `assessment/categories.yaml` lists the harm values without definitions or anchor examples, which probably keeps the distinctions among the discrimination-related values unstable.[^27] The harm-type and bias-axis cells of the map are therefore the least settled part of the descriptive answer.

## What the answer still needs

- Coding of the remaining included Works for bias axes, harm types and population, after the harm-type vocabulary has received definitions and anchor examples as [[analysis-methods#Answering the research questions]] requires.
- Field-level domain-expert verification of the bias and harm codes, beginning with the records on which the agent tracks diverged.
- Screening decisions for the Works behind the LLM-specific Assertions, namely the long-term-care summaries, the psychiatric diagnosis audit, the mental-health classification preprint, the two persona experiments, the two cultural-bias benchmarks, the vision-and-language probe, the multi-persona mitigation study, the intersectional fairness survey, the feminist neutrality chapter, the visual-disinformation review and the deception-detection focus groups.
- Active distillates for the coded Works that have none, so that their findings can enter Assertions. These are "AI & Intersectionality: A Toolkit For Fairness & Inclusion", "Bedeutung von Künstlicher Intelligenz in der Sozialen Arbeit", "Biases in large language models: Origins, inventory and discussion", "Challenging systematic prejudices: an Investigation into Gender Bias in Large Language Models", "Evaluation of an artificial intelligence literacy course for university students with diverse study backgrounds", "Faires KI-Prompting – Ein Leitfaden für Unternehmen", "Fragile Foundations: Hidden Risks of Generative AI", "Gender und KI-Anwendungen", "Gender, Race, and Intersectional Bias in Resume Screening via Language Model Retrieval", "Intersectionality in Artificial Intelligence: Framing Concerns and Recommendations for Action", "Research on the application risks and countermeasures of ChatGPT generative artificial intelligence in social work" and "Towards Substantive Equality in Artificial Intelligence".[^4]
- Statement anchors for SQ2 findings that the active distillates hold only in unanchored prose. These include the sociodemographic variation in GPT-5 clinical recommendations with labels for transgender women, the forms of bias in the psychiatric audit, the omission of women's needs in Gemma summaries, the outsider positioning of non-Western settings, the mechanisms of the visual-disinformation review, the image observations in the critical digital literacy article, the prompt-writing barriers in the all-girls workshops, the digital-exclusion concerns in debt counselling, and the tensions around inclusion in AI-assisted recording. The distillates concerned carry generic anchors such as "The source supports this bounded finding for its reported design and sample" or none for these findings.
- Resolution of the integrity hold on the included Work on prompt techniques against cultural bias toward Arabs and Muslims, whose coding is withheld.[^1]
- A topic map for the topic Gender, Intersectionality, and Bias, which this draft did not create.
- AI Agent Review of the Assertions and of this chapter, followed by domain-expert verification of the statements and the interpretation.
- A test of the advisory hypothesis of a harm mismatch between prompting studies and social-work literature ([[analysis-sq-advisory]]) against complete coding. The advisory track served here only as orientation.

[^1]: Data from `generated/completion/field-states.csv`, tracks `all`, `legacy_human` and `ai_review`, fields `AN_Bias_Axes`, `AN_Harm_Types` and `AN_Population`.
[^2]: Data from `generated/completion/sq-association-tables.csv`, matrix `AN_Bias_Axes x AN_Harm_Types`, columns `work_count`, `status`, `works_coded_on_both_fields`, `works_open`, `authority` and `work_ids`.
[^3]: Data from `generated/completion/sq-analysis-tables.csv`, field `AN_Population`, which the file labels `SQ3` under the earlier numbering of sub-questions.
[^4]: Data from `generated/completion/completion-package.json`, fields `works[].effective_decision`, `works[].decision_authority`, `works[].analysis_eligible` and `works[].analysis_fields`.
[^5]: Data from `generated/completion/sq-analysis-tables.csv`, fields `AN_Bias_Axes` and `AN_Harm_Types`, column `work_count` with the denominator `denominator_field_coded_works`.
[^6]: Grounded in [[30_assertions/child-protection-records-carry-existing-inequalities-into-algorithmic-decisions]].
[^7]: Grounded in [[30_assertions/child-protection-nlp-showed-lower-name-recall-for-black-clients]].
[^8]: Grounded in [[30_assertions/child-welfare-workers-showed-smaller-racial-disparity-than-algorithm]].
[^9]: Grounded in [[30_assertions/algorithmic-decision-making-can-introduce-and-expose-structural-bias]].
[^10]: Grounded in [[30_assertions/long-term-care-summaries-showed-model-dependent-gender-differences]].
[^11]: Grounded in [[30_assertions/psychiatric-diagnosis-audit-reports-gender-and-racial-ethnic-bias]].
[^12]: Grounded in [[30_assertions/mental-health-classification-shows-demographic-disparities-across-language-models]].
[^13]: Posit. The cited Assertions measure output differences, and only the long-term-care study links one to an allocation, as a warning. Open evidence question: studies that follow generated records or recommendations into decisions about service users.
[^14]: Grounded in [[30_assertions/persona-prompts-shift-llm-outputs-toward-assigned-identities]].
[^15]: Grounded in [[30_assertions/llm-generated-text-positions-cultures-asymmetrically]].
[^16]: Posit. The coded value list in `assessment/categories.yaml` contains Role_Persona, and the transfer of the persona finding to that technique is an inference. Open evidence question: whether persona effects occur in social-work tasks such as case documentation.
[^17]: Grounded in [[30_assertions/vision-language-model-gender-stereotypes-override-visual-evidence]].
[^18]: Grounded in [[30_assertions/gender-equity-framework-links-gender-bias-to-allocative-and-representational-harms]].
[^19]: Grounded in [[30_assertions/gender-equity-literature-rejects-algorithmic-neutrality]].
[^20]: Grounded in [[30_assertions/visual-disinformation-review-identifies-compounded-risks-for-marginalised-communities]].
[^21]: Grounded in [[30_assertions/focus-groups-anticipate-misreading-of-underrepresented-clients-by-deception-detection]].
[^22]: Grounded in [[30_assertions/single-attribute-fairness-can-conceal-intersectional-unfairness]].
[^23]: Grounded in [[30_assertions/bias-evaluations-name-binary-gender-operationalisation-as-limitation]].
[^24]: Posit. The division is read from the Assertions of this chapter, which cover only the active distillates. Open evidence question: whether the complete coded map shows the same division between study types, measured as bias axes and harm types by study type.
[^25]: Grounded in [[30_assertions/reported-prompting-effects-vary-across-models-and-bias-categories]].
[^26]: Data from `generated/completion/agent-track-diagnostics.csv`, rows `AN_Bias_Axes`, `AN_Harm_Types`, `AN_Coding_Basis` and `AN_Mitigation_Status`, columns `compared_records`, `identical`, `different`, `adopted_one_track`, `value_from_neither_track`, `code_disagreements` and `different_record_refs`, labelled `workflow_diagnostic_not_accuracy`.
[^27]: Posit. The vocabulary carries no definitions, and the link between their absence and the disagreement is an inference. Open evidence question: track agreement on the harm-type field after definitions and anchor examples are added, measured against a human reference.
