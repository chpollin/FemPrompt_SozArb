---
type: chapter
stage: draft
status: grounded
checked:
  validation: '2026-10-01'
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
posits: 4
created: '2026-10-01'
updated: '2026-10-01'
---

# SQ1 Use of large language models in social-work tasks and settings

SQ1 asks for which tasks and settings of social work the literature describes the use of large language models (LLMs) and which benefits it reports. The answer below rests only on the Assertions listed in the frontmatter and on the generated tables of the completion package. All of these Assertions have the status `grounded`. Neither they nor this chapter have received AI Agent Review or domain-expert verification.

## Coverage on 1 October 2026

- The completion package records 154 Works with a recorded Include. Of these, 21 carry decided coding for the population or practice-context field `AN_Population`. The same 21 carry decided coding for the prompting-role field `AN_Prompting_Role`, 7 with a coded value and 14 with the explicit value None. One included Work is under an integrity hold and 132 have no governed coding (`generated/completion/field-states.csv`, track `all`).
- The evidence-and-gap matrix of prompt techniques by population counts 21 Works coded on both fields and 133 open Works in every cell (`generated/completion/sq-association-tables.csv`, matrix `AN_Prompt_Techniques x AN_Population`).
- The category matrices of Gegenstand by Perspektive count 30 Works with governed category coding and 1 open Work (`generated/completion/sq-association-tables.csv`, matrices `Gegenstand x Perspektive`).
- 44 active distillates were available, and all of them were read for SQ1 (`generated/completion/completion-package.json`, `knowledge_coverage.active.counts_by_type`). Their Works are in one of three screening states, recorded Include, recorded Exclude or not yet screened (`generated/completion/completion-package.json`, `works[].effective_decision`). The state of each distillate used is listed under [Distillates used and their screening state](#distillates-used-and-their-screening-state).
- The codebook has no task field. Statements about tasks therefore come only from Assertions and not from the descriptive map ([analysis methods](../../../knowledge/analysis-methods.md#answering-the-research-questions)).

## Answer in brief

The current evidence does not answer SQ1 for the included corpus. Three statements can be made with their limits.

1. The coded map names the settings that the coded Works address, not the settings in which LLMs are used. Within the coded subset the most frequent value is a context not specific to social work, followed by child and family welfare and general social work. Every statement about settings without coded Works is not determinable, because most included Works lack coding.
2. The active distillates describe LLM use for social-work tasks as prospective or proposed. They name research tasks in social-work science[^1] under the condition of human validation[^2], case recording as an anticipated relief in practice[^3], chatbot-supported counselling as a future option[^5] and generated images as teaching material[^7]. The study among them that applies LLMs to a social-care documentation task evaluates gender bias and not benefit[^4].
3. No Assertion reports an evaluated benefit of LLM use in a social-work setting. Measured results concern either non-generative decision support in child welfare[^8][^9] or health and mental-health settings outside social work, where a review finds the evidence limited[^10] and the testing studies caution against clinical reliance[^11]. This statement describes the active distillates and not the literature, for the reasons given under [Not determinable and absent](#not-determinable-and-absent).

## Settings in the coded map

| Population or practice context | Works coded | Cell status |
|---|---:|---|
| Child_Family_Welfare | 4 | observed |
| General_Social_Work | 3 | observed |
| Education_Professional | 2 | observed |
| Mental_Health | 1 | observed |
| Health_Care | 1 | observed |
| Social_Assistance_Admin | 1 | observed |
| Homelessness_Youth | 0 | not determinable |
| Not_SW_Specific | 13 | observed |

The figures come from `generated/completion/sq-analysis-tables.csv`, field `AN_Population`, with 21 field-coded Works as denominator and 133 included Works missing or unresolved. The field allows several codes per Work, so the column sum exceeds the denominator. The status of the Homelessness_Youth cell follows `generated/completion/sq-association-tables.csv`, where every cell of this row with zero Works and open Works is `not_determinable`.

The population field records the context a Work addresses. It does not record whether the Work studies an LLM. The category matrices make the difference visible. The Gegenstand category Generative_KI meets the Perspektive category Soziale_Arbeit in 1 Work at level ja and in 3 Works at level teilweise or ja, whereas KI_Sonstige, the category for other AI, meets Soziale_Arbeit in 5 and 6 Works. Prompting and Soziale_Arbeit share no Work, and the table marks this cell as `not_determinable` because one Work remains open (`generated/completion/sq-association-tables.csv`, matrices `Gegenstand x Perspektive (ja)` and `Gegenstand x Perspektive (teilweise_or_ja)`). The Work coded ja for both generative AI and social work is "Research on the application risks and countermeasures of ChatGPT generative artificial intelligence in social work". It has no active distillate (`generated/completion/completion-package.json`, `knowledge_coverage.active.documents`) and therefore supports no Assertion yet.

The prompting-role value Recommended_Practice is coded for "Towards Substantive Equality in Artificial Intelligence: Transformative AI Policy for Gender Equality and Diversity" and for "Faires KIPrompting – Ein Leitfaden für Unternehmen" (`generated/completion/completion-package.json`, `works[].analysis_fields`). Both carry the population value Not_SW_Specific, the first additionally Social_Assistance_Admin, and neither has an active distillate. The coded map thus contains no Work in which recommended prompting practice is coded for a specific social-work setting. With 132 included Works uncoded, this is not determinable and no gap in the literature.

## Tasks and reported benefits

### Social-work research

Patton et al. (2023) and Victor et al. (2023) describe LLMs as assistive tools for research tasks, among them generating research questions, developing qualitative themes, editing transcripts, preparing presentations and extracting, classifying and clustering information in analysis[^1]. Both papers are conceptual contributions from 2023 and evaluate none of these uses. The benefits they name are therefore proposals. Both recommend that humans validate LLM-assisted material before dissemination and that researchers remain accountable for the text and analyses produced[^2]. These are recommendations of the two sources and not of this review.

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

## Contradictions and qualifications

No two SQ1 Assertions contradict each other, and all of them carry an empty `contested-with` list. Contradicting sources were not systematically searched, so the absence of contradictions does not establish agreement. The following qualifications remain.

- The child-welfare result reads as a benefit only for the combination of tool and worker discretion. The same source does not attribute the change to the tool[^9].
- Wang et al. report encouraging predictive performance and still judge the tested models inadequate for real-world deployment in critical mental-health tasks, so the reported performance and the authors' conclusion pull in different directions within one source[^11].
- Ingram presents administrative relief and the risk to reflective writing as two sides of the same recording task, not as separate findings[^3].
- The research literature frames LLMs as assistive under human validation[^1][^2], while the health studies with measured tasks caution against reliance[^11]. These positions concern different tasks and decision weights. Reading them as complementary rather than contradictory is an inference of this draft.

## Not determinable and absent

Three conditions are kept apart.

- A setting or task is not determinable when included Works remain uncoded or unread. This holds for every empty cell of the generated SQ1 tables, including Homelessness_Youth and the combination of Prompting and Soziale_Arbeit, and for every task, because no task field exists.
- A use is absent within a source when that source states it. The debt-counselling study collected no chatbot data[^5], and most participants in Ingram's study had not used the recording tool with service users[^3].
- Absence in the literature cannot be stated at present. That no evaluated benefit of LLM use in social work appears in the Assertions is an observation about the active distillates, several of which belong to Works not yet screened, and about the coded subset of included Works.

## What is needed to complete the answer

1. Active distillates for included Works that address LLM or AI use in social-work tasks and currently have none. The following carry the most direct SQ1 content by their titles, an inference from titles that the distillates would have to confirm.
   - "Clinical Social Workers' Perceptions of Large Language Models in Practice: Resistance to Automation and Prospects for Integration"
   - "The end of the world as we know it? ChatGPT and social work"
   - "Research on the application risks and countermeasures of ChatGPT generative artificial intelligence in social work", already coded
   - "Bedeutung von Künstlicher Intelligenz in der Sozialen Arbeit: Eine exemplarische arbeitsfeldübergreifende Betrachtung des Natural Language Processing (NLP)", already coded
   - "Voll (dia)logisch? Ein Werkstattbericht über den Einsatz von generativer KI in der Hochschulbildung für Soziale Arbeit"
   - "Akzeptanz von KI und organisationale Rahmenbedingungen in der Sozialen Arbeit"
   - "Artificial Intelligence Competence Needs for Youth Workers"
   - "'It happened to be the perfect thing': Experiences of generative AI chatbots for mental health"
   - "Social work and artificial intelligence: Collaboration and challenges", "The role of artificial intelligence (AI) and machine learning in social work practice", "Considering a unified model of artificial intelligence enhanced social work: A systematic review" and "Künstliche Intelligenz in der Sozialen Arbeit: Grundlagen für Theorie und Praxis"
   - "Towards Substantive Equality in Artificial Intelligence" and "Faires KIPrompting – Ein Leitfaden für Unternehmen", the two Works coded Recommended_Practice
2. Governed coding of the 132 uncoded included Works and resolution of the integrity hold, so that the population and prompting-role fields reach a complete denominator (`generated/completion/field-states.csv`).
3. Screening decisions for the not yet screened Works whose distillates support the Assertions on recording, care-note summarisation, counselling, education and the health settings. Until then these Assertions describe candidate literature.
4. The planned task field through a codebook amendment, recorded in `knowledge/analysis-methods.md` under Answering the research questions and to be defined in `knowledge/update-protocol.md` under Analysis coding. Candidate values can be drawn from the tasks the Assertions already name, case recording and documentation, summarisation of case notes, counselling, research, teaching and decision support.
5. A supplementary search for task literature, because identification centred on bias and gender and task literature without a bias focus may be underrepresented (`knowledge/analysis-methods.md`). The tasks above indicate where such a search would start.
6. Statement anchors in distillates where SQ1 content currently sits in unanchored sections. These include the list of research uses in the Victor et al. distillate, the uses in simulations and feedback on biased language in the Patton et al. distillate, usability and engagement in the youth mental-health review, the occupational analysis in the Chatterji et al. distillate, perceived utility in the study of social-work students' readiness for AI, and tutoring, assessment and simulation in the Hodgson et al. distillate on social-work education. The distillates on recording and on the NGO counselling assistant carry their content in a paragraph affirmed only by a generic anchored line. Adding anchors belongs to distillate maintenance under the Research Vault contract.
7. AI Agent Review of the SQ1 Assertions and then domain-expert verification of the Assertions and of this chapter.

## Distillates used and their screening state

The screening states come from `generated/completion/completion-package.json`, `works[].effective_decision`.

| Distillate | Screening state of the Work | Assertions |
|---|---|---|
| `completion-zitlbm8a-chatgpt-social-work-science` | Include, not yet coded | [^1] [^2] |
| `completion-amyzfaph-generative-ai-social-work-research` | Include, not yet coded | [^1] [^2] |
| `7fefmcbz-child-welfare-worker-algorithm-disparities` | Include, coded | [^8] [^9] |
| `r7v99era-racial-bias-nlp-child-protective-services` | Include, coded | [^8] |
| `bhxdu7vm-how-people-use-chatgpt` | Include, coded | [^12] |
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
- Distillates of included Works without SQ1 content concern AI literacy and competences, frameworks, bias mechanisms or prompting techniques and belong to SQ2 to SQ4. The Hodgson et al. distillate on social-work education (`vszm7ct6-ai-social-work-education`) discusses tutoring, assessment and simulation prospectively, but records generative AI as absent and anchors no use statement.
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
