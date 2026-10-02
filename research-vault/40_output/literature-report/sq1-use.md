---
type: chapter
stage: draft
status: grounded
checked:
  validation: '2026-10-02'
assertions:
  - "[[30_assertions/patton-and-victor-describe-prospective-llm-uses-in-social-work-research]]"
  - "[[30_assertions/social-work-research-guidance-conditions-llm-use-on-human-validation-and-accountability]]"
  - "[[30_assertions/ingram-reports-expected-tensions-of-ai-assisted-recording-in-social-work]]"
  - "[[30_assertions/rickman-tests-llm-summaries-of-social-care-notes-for-gender-bias]]"
  - "[[30_assertions/debt-counselling-study-discusses-chatbot-use-prospectively-without-chatbot-data]]"
  - "[[30_assertions/schroder-et-al-follow-development-of-an-ai-counselling-assistant-in-an-ngo]]"
  - "[[30_assertions/wallengren-lynch-proposes-generated-images-as-material-for-critical-teaching]]"
  - "[[30_assertions/cheng-et-al-and-field-et-al-examine-predictive-and-nlp-tools-in-child-welfare]]"
  - "[[30_assertions/cheng-et-al-report-smaller-disparity-for-worker-assisted-than-algorithm-only-screening]]"
  - "[[30_assertions/rapid-review-reports-limited-evidence-for-generative-ai-in-youth-mental-health-apps]]"
  - "[[30_assertions/llm-diagnosis-and-mental-health-studies-caution-against-clinical-reliance]]"
  - "[[30_assertions/chatterji-et-al-report-guidance-information-and-writing-dominate-consumer-chatgpt-use]]"
posits: 5
created: '2026-10-01'
updated: '2026-10-02'
---

# SQ1 Use of large language models in social-work tasks and settings

SQ1 asks for which tasks and settings of social work the literature describes the use of large language models (LLMs) and which benefits it reports. The chapter rests on the Assertions listed in the frontmatter and on the generated tables of the completion package. Where it draws on coding notes and full texts of Works coded on 2 October 2026 that no Assertion covers yet, it says so at the point of use. All listed Assertions have the status `grounded`. The analysis coding it reports has the lifecycle state `ai-agent-reviewed` and has not been checked by domain experts. Neither the Assertions nor this chapter have received AI Agent Review or domain-expert verification.

## Coverage on 2 October 2026

The coding run of 2 October 2026 coded the included Works with a full text under codebook 1.4.1, including the new task field `AN_Task` ([update protocol](../../../knowledge/update-protocol.md#coding-run-of-2-october-2026)). The figures below come from the generated files named with each of them.

- The completion package records 154 Works with a recorded Include (`generated/completion/field-states.csv`, track `all`, `include_denominator`).
- The population or practice-context field `AN_Population` is coded for 104 of them. The other 50 are 25 Works whose agent tracks diverged from the human Include (`conflict_decision`), 1 Work under an integrity hold, 2 Works whose source review is stale after a change of source binding, and 22 Works without governed coding (`generated/completion/field-states.csv`, field `AN_Population`). None of these 22 Works has a full text in the reading layer `docs/data/fulltext/`, a check made by a script over their record IDs in `generated/completion/completion-package.json`.
- The task field `AN_Task` is coded for 85 Works, 41 with at least one task value and 44 with the explicit value None. In addition to the 50 Works above, 19 Works were coded under codebook 1.3 and derive the state `not_collected` for the task field, which says nothing about the Work (`generated/completion/field-states.csv`, field `AN_Task`).
- The prompting-role field `AN_Prompting_Role` is coded for 104 Works, 45 with a value and 59 with None (`generated/completion/field-states.csv`, field `AN_Prompting_Role`).
- The category matrices of Gegenstand by Perspektive count 140 Works with governed category coding and 1 open Work (`generated/completion/sq-association-tables.csv`, matrices `Gegenstand x Perspektive`).
- 44 active distillates were available on 1 October 2026, and all of them were read for SQ1 (`generated/completion/completion-package.json`, `knowledge_coverage.active.counts_by_type`). Their screening and coding states are listed under [Distillates used and their screening state](#distillates-used-and-their-screening-state).

`AN_Task` is a pilot field. Its values are candidates until the pilot rule of the [update protocol](../../../knowledge/update-protocol.md#validation-of-the-ai-coding) is met, and the coding run left open questions on the values for school education and artistic practice. The field records the task for which a Work describes, tests or proposes the use of AI, not only of LLMs (`assessment/categories.yaml`). A task code therefore does not establish that the Work concerns an LLM, and it does not record whether a use took place or how it was assessed.

## Answer in brief

The coded Works show where the literature locates AI use in social work. They do not yet show a benefit of LLM use that was evaluated in a social-work setting, and a substantial part of the included corpus lacks the coding needed to say more.

1. What the coded Works show. Among the 85 Works coded on the task field, the most frequent task values are teaching and further education, case assessment and decision support, and counselling and client communication, followed by administration, documentation and recording, and research. Of the 35 Works coded with a social-work population value, 28 are coded on the task field and all 28 carry a task value, whereas the 44 Works coded None on the task field are all coded only as not specific to social work. In the cross-tabulation, case assessment and decision support occurs most often together with general social work and child and family welfare, and teaching occurs most often together with professional and higher education. These cells count joint coding in the same Work and state no relation between task and setting. The Assertions add that the tasks named for LLMs in social work are mostly prospective or proposed, namely research tasks under the condition of human validation[^1][^2], case recording as an anticipated relief[^3], chatbot-supported counselling as a future option[^5] and generated images as teaching material[^7].
2. What remains undetermined. No Assertion reports an evaluated benefit of LLM use in a social-work setting. Measured results in the Assertions concern non-generative decision support in child welfare[^8][^9] or health and mental-health settings outside social work, where a review finds the evidence limited[^10] and testing studies caution against clinical reliance[^11]. The newly coded records qualify this statement for the corpus. One included edited volume contains a usability evaluation of an LLM application for case notes in which practitioners judged the notes useful and time-saving while the efficiency gain remained in question, and one included interview study reports benefits that self-directed users of generative AI chatbots perceive for their mental health outside social work. Neither is covered by an Assertion, and neither is an outcome evaluation ([Evaluated benefit in the newly coded records](#evaluated-benefit-in-the-newly-coded-records)). Whether the literature reports evaluated benefits beyond these two Works is not determinable.
3. Coding gaps. 69 of the 154 included Works carry no decided task coding. They comprise 22 Works without coding and without a full text in the reading layer, 25 Works with a divergence between the human Include and the agent decision, 1 Work under an integrity hold, 2 Works with a stale source review and 19 Works coded under codebook 1.3, for which the task field is not collected. Seven of the 19 carry a social-work population value. Every empty cell of the SQ1 tables with open Works is therefore not determinable and no gap in the literature.

## Descriptive map

### Tasks

`AN_Task` is coded for 85 of 154 included Works. 69 included Works are missing or unresolved on this field. The field allows several values per Work, so the column sum exceeds the denominator (`generated/completion/sq-analysis-tables.csv`, question SQ1, field `AN_Task`). The values are pilot candidates.

| Task (pilot value) | Works with code |
|---|---:|
| Teaching_Further_Education | 16 |
| Case_Assessment_Decision_Support | 15 |
| Counselling_Client_Communication | 12 |
| Administration | 10 |
| Documentation_Recording | 7 |
| Research | 6 |
| Other_Task | 15 |
| None | 44 |

Other_Task collects tasks outside the list, which the coding note names. Its codes in the cross-tabulation below sit mostly with Works not specific to social work, for instance machine translation, as the coding note of that Work states.

### Settings

`AN_Population` is coded for 104 of 154 included Works. 50 included Works are missing or unresolved on this field. The field allows several values per Work (`generated/completion/sq-analysis-tables.csv`, question SQ1, field `AN_Population`).

| Population or practice context | Works with code |
|---|---:|
| General_Social_Work | 18 |
| Education_Professional | 16 |
| Child_Family_Welfare | 10 |
| Mental_Health | 6 |
| Social_Assistance_Admin | 6 |
| Health_Care | 4 |
| Homelessness_Youth | 1 |
| Not_SW_Specific | 71 |

35 of the 104 Works carry at least one value other than Not_SW_Specific, and 69 carry Not_SW_Specific alone, counted by a script over `analysis_fields` in `generated/completion/completion-package.json`. The population field records the context a Work addresses and not whether it studies an LLM. The category matrices show the difference. Among 140 Works with governed category coding and 1 open Work, the Gegenstand category Generative_KI meets the Perspektive category Soziale_Arbeit in 9 Works at level ja and in 20 Works at level teilweise or ja, KI_Sonstige, the category for other AI, in 19 and 27 Works, and Prompting in 2 and 6 Works (`generated/completion/sq-association-tables.csv`, matrices `Gegenstand x Perspektive (ja)` and `Gegenstand x Perspektive (teilweise_or_ja)`). These cells count joint coding of two categories in the same Work.

### Tasks and settings coded together

85 Works are coded on both fields, and 69 included Works are open on at least one of them. Each cell counts the Works in which the task and the setting are coded together. It states no relation, no direction and no effect. A cell marked n. d. has no contributing Work while Works are open and is not determinable, never zero (`generated/completion/sq-association-tables.csv`, matrix `AN_Task x AN_Population`).

| Task | Child_Family_Welfare | Mental_Health | Health_Care | Homelessness_Youth | Social_Assistance_Admin | Education_Professional | General_Social_Work | Not_SW_Specific |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Documentation_Recording | 2 | 3 | 1 | n. d. | 1 | 6 | 6 | n. d. |
| Case_Assessment_Decision_Support | 7 | 4 | 2 | 1 | 5 | 6 | 10 | n. d. |
| Counselling_Client_Communication | 5 | 5 | 2 | n. d. | 3 | 6 | 9 | n. d. |
| Administration | 2 | 2 | 1 | n. d. | 1 | 5 | 8 | n. d. |
| Research | 2 | 2 | 2 | n. d. | 2 | 2 | 6 | n. d. |
| Teaching_Further_Education | 5 | 3 | 1 | 1 | 3 | 13 | 8 | 1 |
| Other_Task | n. d. | n. d. | 1 | n. d. | n. d. | 1 | 1 | 13 |
| None | n. d. | n. d. | n. d. | n. d. | n. d. | n. d. | n. d. | 44 |

The Works coded together for a social-work task and a social-work setting are mostly conceptual contributions, reviews and interview or survey studies, and their coded mitigation status is mostly Proposed, according to the coding of these Works in `generated/completion/completion-package.json`. `AN_Mitigation_Status` describes how far a bias mitigation in the Work has been taken. It is a property of the whole Work and no measure of the benefit of a task use.

### Recommended prompting practice

The prompting-role value Recommended_Practice is coded for 27 of 104 Works coded on the field, with 50 included Works missing or unresolved (`generated/completion/sq-analysis-tables.csv`, question SQ1, field `AN_Prompting_Role`). It is coded together with Not_SW_Specific in 20 Works, with Education_Professional in 6, with General_Social_Work in 4, with Child_Family_Welfare and Social_Assistance_Admin in 2 each and with Mental_Health and Health_Care in 1 each. The Homelessness_Youth cell is not determinable (`generated/completion/sq-association-tables.csv`, matrix `AN_Population x AN_Prompting_Role`). The recommendations are those of the coded sources.

## Tasks and reported benefits

### Social-work research

Patton et al. (2023) and Victor et al. (2023) describe LLMs as assistive tools for research tasks, among them generating research questions, developing qualitative themes, editing transcripts, preparing presentations and extracting, classifying and clustering information in analysis[^1]. Both papers are conceptual contributions from 2023 and evaluate none of these uses. The benefits they name are therefore proposals. Both recommend that humans validate LLM-assisted material before dissemination and that researchers remain accountable for the text and analyses produced[^2]. These are recommendations of the two sources and not of this review. Both Works are now coded with the task value Research and the setting General_Social_Work.

### Documentation and case recording in practice

Ingram (2026) reports from a mixed-method baseline evaluation of the AI-assisted recording tool Magic Note that practitioners expect administrative relief and see it in tension with reflective writing, professional judgement, relational practice, inclusion and deskilling, and ethical complexity[^3]. The benefit is an expectation at baseline in one Scottish local authority, and most participants had not used the tool with service users. The distillate assigns the tool to generative AI without describing its architecture. Rickman (2025) uses the summarisation of long-term-care case notes from one English local authority as the test task of a counterfactual gender-bias evaluation and reports that differences in the summaries depend on the model[^4]. The study names a possible effect on service allocation but measures neither allocation nor any benefit of the summaries.

### Counselling

A 2026 study of social and debt counselling transfers its findings on digital counselling to the prospective design of chatbot-supported counselling and collected no chatbot-specific data[^5]. It contributes conditions for future use, such as counselling concepts geared to clients' resources and needs, and no observed benefit. Schrøder et al. (2026) follow how social workers and data engineers in one Scandinavian NGO develop an AI counselling assistant for volunteers in online counselling with children[^6]. The distillate does not establish that this assistant uses an LLM, and the ethnography evaluates no service outcome.

### Social-work education

Wallengren-Lynch (2026) proposes that images generated from prompts serve as classroom material for asking who or what is missing, marginalised or misrepresented, and presents the exercise as illustrative[^7]. The use is a proposed teaching function without an evaluated learning outcome.

### Child-welfare decision support without LLMs

The empirical studies from social-work practice among the included Works with active distillates examine predictive screening and natural-language processing of contact notes, not LLMs[^8]. Cheng et al. (2022) report a smaller Black-white screen-in disparity for worker decisions assisted by a screening tool than for a hypothetical algorithm-only policy and do not attribute the change to the tool[^9]. The result concerns the combination of score and worker discretion. It is adjacent evidence for SQ1 and documents no benefit of LLM use.

### Adjacent health and mental-health settings

A 2026 rapid review finds the evidence on generative AI in mental-health apps for young people small, heterogeneous and dominated by chatbots, with limited evidence for preventive or health-promoting effects[^10]. Three studies that test LLMs for mental-health prediction, automated psychiatric diagnosis and health consultations caution against relying on the tested models in clinical decisions, although Wang et al. (2024) report encouraging predictive performance[^11]. None of these sources concerns social work. Their transfer to social-work tasks with comparable decision weight is an open question, and treating them as indicative for such tasks is an inference of this draft.

### General reference profile

Chatterji et al. (2025) report that practical guidance, information seeking and writing account for most classified consumer ChatGPT conversations[^12]. The study does not examine social work. It can serve as a reference profile against which social-work-specific task descriptions are later compared, which is a proposed use of this draft and no finding of the source.

### Evaluated benefit in the newly coded records

The statement that no Assertion reports an evaluated benefit was checked against the 28 Works that carry a task value other than None together with a population value other than Not_SW_Specific, selected by a script from `analysis_fields` in `generated/completion/completion-package.json`. The check read the coding note `AN_Notes` of each of these Works in `docs/data/screening/ar2.json` and the relevant passages of the full texts of the Works whose notes point to an assessment of a use. It is a targeted reading and no complete review of the full texts. Its observations rest on sources that no Assertion covers yet.

- The edited volume Linnemann et al. (2025), coded as one Work, contains a chapter by Plafky et al. on a locally run application that turns dictated memory protocols into structured case notes with a speech-to-text model and a small open LLM (`docs/data/fulltext/L6PH7GDL.md`, chapter on case-note generation, section 3 on the usability tests). The authors tested it with three practitioners during development and with eight persons in one social-work facility over several days, followed by a focus group with four persons. Testers judged the generated notes useful, of high quality and time-saving. The application invented content when the dictated input was short, and testers stated that the need to check the output left the workload no lower than writing the note themselves. The chapter therefore reports a perceived benefit and questions the efficiency gain. Reading it as a usability evaluation and not as an outcome evaluation is an inference of this draft.
- Siddals et al. (2024) interviewed nineteen persons who use generative AI chatbots on their own for their mental health and report that most participants described positive impacts on their lives (`docs/data/fulltext/3B87U5LN.md`, abstract and results). Social work is not named. The Include rests on the target-group clause, a point the coding run passed to the domain experts ([update protocol](../../../knowledge/update-protocol.md#pilot-run-of-1-october-2026)).
- The remaining Works of the selection propose, discuss, survey or demonstrate task uses. Their coded mitigation status concerns bias mitigation and not task benefit, and the three Works coded Evaluated synthesise evaluations of predictive models in child welfare or health care and not of LLMs, according to their coding notes.

The earlier statement thus holds for the Assertions, and for the corpus it is narrowed. The included literature contains at least one practitioner evaluation of an LLM use in social-work documentation, with a perceived benefit and a questioned efficiency gain.

## Contradictions and qualifications

No two SQ1 Assertions contradict each other, and all of them carry an empty `contested-with` list. Contradicting sources were not systematically searched, so the absence of contradictions does not establish agreement. The following qualifications remain.

- The child-welfare result reads as a benefit only for the combination of tool and worker discretion. The same source does not attribute the change to the tool[^9].
- Wang et al. report encouraging predictive performance and still judge the tested models inadequate for real-world deployment in critical mental-health tasks, so the reported performance and the authors' conclusion pull in different directions within one source[^11].
- Ingram presents administrative relief and the risk to reflective writing as two sides of the same recording task, not as separate findings[^3]. The case-note chapter in Linnemann et al. (2025) reports a comparable pairing of perceived time saving and checking effort, which an Assertion would have to establish before the two are compared.
- The research literature frames LLMs as assistive under human validation[^1][^2], while the health studies with measured tasks caution against reliance[^11]. These positions concern different tasks and decision weights. Reading them as complementary rather than contradictory is an inference of this draft.

## Not determinable and absent

Three conditions are kept apart.

- A setting or task is not determinable when included Works remain uncoded or unresolved. This holds for every cell of the generated SQ1 tables marked n. d., including the Homelessness_Youth column for most tasks, and for task statements about the 19 Works coded under codebook 1.3, whose task field is not collected.
- A use is absent within a source when that source states it. The debt-counselling study collected no chatbot data[^5], and most participants in Ingram's study had not used the recording tool with service users[^3]. The 44 Works coded None on the task field describe no task for which AI is used, and all of them are coded as not specific to social work. This is coded absence within these Works and no statement about the literature.
- Absence in the literature cannot be stated at present. The corpus is no probability sample, task literature without a bias focus may be underrepresented, and 69 included Works lack decided task coding ([analysis methods](../../../knowledge/analysis-methods.md#statistical-reservations)).

## What is needed to complete the answer

1. Active distillates and Assertions for the coded Works that combine a social-work task with a social-work setting. The chapter on case-note generation in Linnemann et al. (2025) and the interview study of Siddals et al. (2024) carry the most direct benefit content. Further candidates by their coding are "Clinical Social Workers' Perceptions of Large Language Models in Practice: Resistance to Automation and Prospects for Integration", "Artificial Intelligence Competence Needs for Youth Workers", "Akzeptanz von KI und organisationale Rahmenbedingungen in der Sozialen Arbeit", "Social work and artificial intelligence: Collaboration and challenges", "Introducing Generative Artificial Intelligence into the MSW Curriculum" and "Voll (dia)logisch? Ein Werkstattbericht über den Einsatz von generativer KI in der Hochschulbildung für Soziale Arbeit".
2. Domain-expert decisions on the 25 Works with a human and agent decision divergence, resolution of the integrity hold, renewed source review of the 2 stale Works, a full text for the 22 uncoded Works, and the recode of the 19 Works coded under codebook 1.3, which has no contract for a partial recode yet ([update protocol](../../../knowledge/update-protocol.md#coding-run-of-2-october-2026)). Two of the 1.3 Works carry direct SQ1 content by their titles, "Research on the application risks and countermeasures of ChatGPT generative artificial intelligence in social work" and "Bedeutung von Künstlicher Intelligenz in der Sozialen Arbeit: Eine exemplarische arbeitsfeldübergreifende Betrachtung des Natural Language Processing (NLP)".
3. The human spot check of the coding run and the pilot decision on `AN_Task`, after which the task values become final or are revised ([update protocol](../../../knowledge/update-protocol.md#validation-of-the-ai-coding)).
4. Screening decisions for the not yet screened Works whose distillates support the Assertions on recording, care-note summarisation, counselling, education and the health settings. Until then these Assertions describe candidate literature.
5. Statement anchors in distillates where SQ1 content currently sits in unanchored sections. These include the list of research uses in the Victor et al. distillate, the uses in simulations and feedback on biased language in the Patton et al. distillate, usability and engagement in the youth mental-health review, the occupational analysis in the Chatterji et al. distillate, perceived utility in the study of social-work students' readiness for AI, and tutoring, assessment and simulation in the Hodgson et al. distillate on social-work education. The distillates on recording and on the NGO counselling assistant carry their content in a paragraph affirmed only by a generic anchored line. Adding anchors belongs to distillate maintenance under the Research Vault contract.
6. AI Agent Review of the SQ1 Assertions and then domain-expert verification of the Assertions and of this chapter.

The operator decided on 1 October 2026 against a supplementary search for task literature, so the answer stays limited to the existing corpus and names this limit ([project](../../../knowledge/project.md)).

## Distillates used and their screening state

The screening and coding states come from `generated/completion/completion-package.json`, `works[].effective_decision`, and from `generated/completion/field-states.csv`, field `AN_Task`. Works not yet screened appear in `candidates_2026` of the completion package.

| Distillate | Screening and coding state of the Work | Assertions |
|---|---|---|
| `completion-zitlbm8a-chatgpt-social-work-science` | Include, coded under 1.4.1 | [^1] [^2] |
| `completion-amyzfaph-generative-ai-social-work-research` | Include, coded under 1.4.1 | [^1] [^2] |
| `7fefmcbz-child-welfare-worker-algorithm-disparities` | Include, source review stale | [^8] [^9] |
| `r7v99era-racial-bias-nlp-child-protective-services` | Include, source review stale | [^8] |
| `bhxdu7vm-how-people-use-chatgpt` | Include, coded under 1.3, task not collected | [^12] |
| `k7nw3w34-ai-assisted-social-work-recording` | not yet screened | [^3] |
| `completion-j4k3xa52-gender-bias-long-term-care-llms` | not yet screened | [^4] |
| `generative-ai-social-debt-counselling` | not yet screened | [^5] |
| `azjw38mf-socio-technical-ethics-work` | not yet screened | [^6] |
| `qrk7c3jk-critical-digital-literacy-social-work-ai` | not yet screened | [^7] |
| `generative-ai-youth-mental-health-apps` | not yet screened | [^10] |
| `completion-9zkzqm63-bias-mental-health-llms` | not yet screened | [^11] |
| `demographic-bias-psychiatric-llm-diagnoses` | not yet screened | [^11] |
| `patient-bias-llm-health-consultations` | not yet screened | [^11] |

The other distillates were read and support no SQ1 Assertion.

- Distillates of Works with a recorded Exclude support no synthesis Assertion under the Research Vault contract. Among them are the randomised trial of the Emohaa mental-health chatbot (`emohaa-mental-health-chatbot`), which reports reduced mental distress for a system with a generative emotional-support component, and a study of machine-learning placement prediction in child welfare (`exrf5629-child-welfare-placement-prediction`).
- Distillates of included Works without SQ1 content concern AI literacy and competences, frameworks, bias mechanisms or prompting techniques and belong to SQ2, SQ3 and SQ5. The Hodgson et al. distillate on social-work education (`vszm7ct6-ai-social-work-education`) discusses tutoring, assessment and simulation prospectively, but records generative AI as absent and anchors no use statement.
- Distillates of not yet screened Works on technical bias measurement and mitigation, persona effects, image generation in workshops outside social work, stakeholder views on AI deception detection and teacher education describe no social-work task use of LLMs.

[^1]: Grounded in [[30_assertions/patton-and-victor-describe-prospective-llm-uses-in-social-work-research]].
[^2]: Grounded in [[30_assertions/social-work-research-guidance-conditions-llm-use-on-human-validation-and-accountability]].
[^3]: Grounded in [[30_assertions/ingram-reports-expected-tensions-of-ai-assisted-recording-in-social-work]].
[^4]: Grounded in [[30_assertions/rickman-tests-llm-summaries-of-social-care-notes-for-gender-bias]].
[^5]: Grounded in [[30_assertions/debt-counselling-study-discusses-chatbot-use-prospectively-without-chatbot-data]].
[^6]: Grounded in [[30_assertions/schroder-et-al-follow-development-of-an-ai-counselling-assistant-in-an-ngo]].
[^7]: Grounded in [[30_assertions/wallengren-lynch-proposes-generated-images-as-material-for-critical-teaching]].
[^8]: Grounded in [[30_assertions/cheng-et-al-and-field-et-al-examine-predictive-and-nlp-tools-in-child-welfare]].
[^9]: Grounded in [[30_assertions/cheng-et-al-report-smaller-disparity-for-worker-assisted-than-algorithm-only-screening]].
[^10]: Grounded in [[30_assertions/rapid-review-reports-limited-evidence-for-generative-ai-in-youth-mental-health-apps]].
[^11]: Grounded in [[30_assertions/llm-diagnosis-and-mental-health-studies-caution-against-clinical-reliance]].
[^12]: Grounded in [[30_assertions/chatterji-et-al-report-guidance-information-and-writing-dominate-consumer-chatgpt-use]].
