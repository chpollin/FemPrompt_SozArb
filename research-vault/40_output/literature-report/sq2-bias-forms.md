---
type: chapter
stage: draft
status: grounded
checked:
  validation: '2026-10-02'
assertions:
  - "[[30_assertions/child-protection-records-carry-existing-inequalities-into-algorithmic-decisions]]"
  - "[[30_assertions/child-protection-nlp-showed-lower-name-recall-for-black-clients]]"
  - "[[30_assertions/child-welfare-workers-showed-smaller-racial-disparity-than-algorithm]]"
  - "[[30_assertions/algorithmic-decision-making-can-introduce-and-expose-structural-bias]]"
  - "[[30_assertions/gender-equity-framework-links-gender-bias-to-allocative-and-representational-harms]]"
  - "[[30_assertions/long-term-care-summaries-showed-model-dependent-gender-differences]]"
  - "[[30_assertions/psychiatric-diagnosis-audit-reports-gender-and-racial-ethnic-bias]]"
  - "[[30_assertions/bias-evaluations-name-binary-gender-operationalisation-as-limitation]]"
posits: 4
research-questions:
  - SQ2
created: '2026-10-02'
updated: '2026-10-02'
---

# SQ2 Bias forms, harm types and affected groups

SQ2 asks which bias forms the selected literature addresses, with which harm types, for which groups, and which forms are missing ([[project#Research questions]]). The answer uses the two layers of [[analysis-methods#Answering the research questions]]. The descriptive map rests on the coded fields `AN_Bias_Axes`, `AN_Harm_Types` and `AN_Population` of the completion package after the coding run of 2 October 2026. The qualitative substance comes from the coding notes (`AN_Notes`) and the located passages (`analysis_evidence`) of the productive agent records, with the quotations used below checked against the reading layer `docs/data/fulltext/`. A few statements rest on the Assertions listed in the frontmatter.

Every coding used here has the lifecycle state `ai-agent-reviewed`. It was produced by two operationally isolated agent tracks and reconciled by a separate AI Agent Review on the same model family. No coding, no Assertion and no statement of this chapter has received domain-expert verification. A map cell counts Works in which two codes occur together and states no relation between them. This chapter supersedes [[sq2-risks]], whose map rested on the 21 Works coded before the run of 2 October 2026.

## Coverage on 2 October 2026

- The completion package records 154 Works with a recorded Include. Of these, 104 carry decided coding for `AN_Bias_Axes`, 85 with at least one axis and 19 with the explicit value None. For `AN_Harm_Types` 103 are decided, 81 with at least one harm type and 22 with None, and one Work, Reamer (2023), is recorded as not decidable. `AN_Population` is decided for the same 104 Works (`generated/completion/field-states.csv`, track `all`).
- The 50 included Works without coding fall into four states. 25 carry a divergence between the human Include and an agent Unclear or Exclude (`human_agent_decision_divergence`) and stay uncoded until the domain experts decide. 22 have no coding and no full text in the reading layer. Two, Cheng et al. (2022) and Field et al. (2023), await a renewed source review for their current source binding. One, Basseri et al. (2025), is under an integrity hold (`generated/completion/field-states.csv` and `generated/completion/completion-package.json`, `works[].conflicts` and `works[].next_actions`).
- Of the 104 bias-coded Works, 85 were coded under codebook 1.4.1 and 19 under codebook 1.3. The 1.3 codings follow the older, wider rules for harm types and bias axes, which codebook 1.4 sharpened, and they await their recode ([[update-protocol#Coding run of 2 October 2026]]). The screening decision of 90 of these Works comes from the legacy human track and of 14 from the AI-review track (`generated/completion/completion-package.json`, `works[].analysis_codebook_versions` and `works[].decision_authority`).
- Four pairs of coded Works share a title or a text and are counted twice, the two entries of Gengler et al. (2024), Kamruzzaman et al. (2024), "Data Feminism for AI" (D'Ignazio et al. 2024 and Klein et al. 2024) and "Intersectional analysis of visual generative AI" (Jääskeläinen et al. 2025 and Sharma et al. 2024). The coding run flagged two of these pairs for the domain experts ([[update-protocol#Coding run of 2 October 2026]]). Counts below are per registered Work and include both members of each pair.

All figures in this chapter were computed by a script over the files named in each footnote.

## Answer in brief

1. Within the coded subset, gender and race or ethnicity are the most frequently coded axes, followed by socioeconomic position and intersectional framings. Exclusionary norms, stereotyping and indirect discrimination are the most frequently coded harm types.[^1]
2. The coded bias forms divide by population. Gender is jointly coded with a social-work field in few Works, while race or ethnicity and socioeconomic position dominate the coded Works on child and family welfare, social assistance and general social work. Stereotyping is coded mostly in Works not specific to social work, and indirect discrimination and exclusionary norms in the social-work fields.[^2] This is joint coding in the same Works and describes the coded subset.
3. In social-work Works the coding notes record allocation through predictive and administrative systems, proxies such as place of residence or household composition, and access norms such as digital-only application routes. Most of these Works concern non-generative decision systems. The social-work Works that address LLMs mostly name bias generically and analyse no axis under the coding rule.[^3]
4. Toxicity and derogatory language, other axes, and the population Homelessness_Youth are rare. Sexual orientation and gender identity, religion, physical appearance and intersectional framings are coded almost only in Works not specific to social work. Whether the literature leaves these forms out is not determinable, because 50 included Works remain uncoded and 19 Works carry the older coding rules.

## Bias axes

The denominator is 104 Works decided on `AN_Bias_Axes`, with 50 included Works open. A Work can carry several axes, so the column sums exceed the denominator.[^1]

| Bias axis | Works | coded under 1.4.1 | coded under 1.3 |
|---|---:|---:|---:|
| Gender | 63 | 48 | 15 |
| Race_Ethnicity | 56 | 45 | 11 |
| Socioeconomic | 29 | 20 | 9 |
| Intersectional | 28 | 20 | 8 |
| Language_Culture | 23 | 17 | 6 |
| Nationality_Migration | 23 | 16 | 7 |
| Age | 22 | 15 | 7 |
| Sexual_Orientation_Identity | 18 | 14 | 4 |
| Disability | 17 | 11 | 6 |
| Religion | 14 | 9 | 5 |
| Physical_Appearance | 11 | 9 | 2 |
| Other_Axis | 6 | 6 | 0 |
| None | 19 | 18 | 1 |

The six Other_Axis Works name the axis in their notes. These are marital status and household composition in the Danish welfare-fraud models (Amnesty International 2024), place of residence (Studeny 2025, Laine et al. 2025), political leaning as a demographic category (Ma et al. 2023) and the colonial position of the Global North and South (both entries of "Data Feminism for AI").[^4]

## Harm types

The denominator is 103 Works decided on `AN_Harm_Types`, with 51 included Works open.[^1]

| Harm type | Works | coded under 1.4.1 | coded under 1.3 |
|---|---:|---:|---:|
| Exclusionary_Norms | 47 | 35 | 12 |
| Stereotyping | 39 | 25 | 14 |
| Indirect_Discrimination | 32 | 23 | 9 |
| Disparate_Performance | 25 | 15 | 10 |
| Erasure | 23 | 19 | 4 |
| Direct_Discrimination | 20 | 8 | 12 |
| Misrepresentation | 16 | 8 | 8 |
| Toxicity | 3 | 2 | 1 |
| Derogatory_Language | 3 | 1 | 2 |
| None | 22 | 21 | 1 |

The two codebook versions carry different harm-type profiles. The 19 Works coded under 1.3 carry on average 3.79 harm-type values each, the 84 harm-coded Works under 1.4.1 carry 1.62. Direct discrimination comes from the 1.3 Works in 12 of its 20 Works, although they make up 19 of the 103 harm-coded Works.[^4] Codebook 1.4 requires an allocation or decision about persons for both discrimination types, counts name-based audits as indirect discrimination and excludes harms only cited from other work ([[update-protocol#Analysis coding]]). That the 1.3 profile reflects the older rules rather than the Works is an inference.[^5]

The harm types also differ by the study type of the Work, a single value per Work. Stereotyping is coded in 16 of 25 experimental Works, indirect discrimination in 9 of 13 literature reviews and exclusionary norms in 12 of the 17 harm-coded theoretical Works.[^4]

## Joint coding with populations

`AN_Population` records the field or group a Work addresses. Of the 104 Works decided on it, 71 carry Not_SW_Specific, 18 General_Social_Work, 16 Education_Professional, 10 Child_Family_Welfare, 6 each Social_Assistance_Admin and Mental_Health, 4 Health_Care and 1 Homelessness_Youth.[^1] Education_Professional and Health_Care include settings outside social work, such as teacher education and medical care.

The tables count Works in which an axis or harm type and a population are coded together. They show joint coding in the same Works and no relation. A cell marked n.d. has no coded Work and is not determinable, because 50 included Works (51 for harm types) remain open on at least one of the two fields.[^2]

| Bias axis | Child_Family_Welfare | Social_Assistance_Admin | General_Social_Work | Homelessness_Youth | Mental_Health | Health_Care | Education_Professional | Not_SW_Specific |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Gender | 1 | 3 | 1 | n.d. | 1 | 3 | 4 | 56 |
| Race_Ethnicity | 8 | 6 | 7 | 1 | 3 | 4 | 4 | 42 |
| Socioeconomic | 6 | 6 | 7 | 1 | 2 | 4 | 4 | 17 |
| Intersectional | 1 | 1 | 1 | n.d. | n.d. | n.d. | n.d. | 27 |
| Language_Culture | 2 | 2 | 3 | n.d. | 1 | 1 | 4 | 18 |
| Nationality_Migration | 2 | 4 | 2 | n.d. | 1 | 1 | 1 | 20 |
| Age | 2 | 4 | 2 | n.d. | 1 | 1 | 1 | 19 |
| Sexual_Orientation_Identity | n.d. | 1 | n.d. | n.d. | n.d. | n.d. | n.d. | 18 |
| Disability | 2 | 4 | 1 | 1 | 1 | 2 | 2 | 13 |
| Religion | n.d. | 1 | n.d. | n.d. | n.d. | n.d. | n.d. | 14 |
| Physical_Appearance | n.d. | n.d. | n.d. | n.d. | n.d. | n.d. | n.d. | 11 |
| Other_Axis | 1 | 2 | 1 | n.d. | n.d. | n.d. | n.d. | 4 |
| None | 1 | n.d. | 8 | n.d. | 3 | n.d. | 7 | 6 |

| Harm type | Child_Family_Welfare | Social_Assistance_Admin | General_Social_Work | Homelessness_Youth | Mental_Health | Health_Care | Education_Professional | Not_SW_Specific |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Exclusionary_Norms | 5 | 4 | 8 | n.d. | 2 | 2 | 5 | 34 |
| Stereotyping | 1 | 1 | 2 | n.d. | 1 | n.d. | 3 | 34 |
| Indirect_Discrimination | 8 | 5 | 7 | 1 | 3 | 3 | 4 | 19 |
| Disparate_Performance | 4 | 2 | 3 | n.d. | 1 | 3 | 1 | 18 |
| Erasure | 1 | 2 | 3 | n.d. | 1 | 1 | 2 | 20 |
| Direct_Discrimination | 2 | 3 | 3 | n.d. | n.d. | 2 | n.d. | 14 |
| Misrepresentation | 1 | 1 | 1 | n.d. | n.d. | 1 | 1 | 13 |
| Toxicity | n.d. | n.d. | n.d. | n.d. | n.d. | n.d. | n.d. | 3 |
| Derogatory_Language | n.d. | n.d. | n.d. | n.d. | n.d. | n.d. | n.d. | 3 |
| None | n.d. | n.d. | 6 | n.d. | 2 | n.d. | 7 | 11 |

56 of the 63 Gender Works carry Not_SW_Specific. Gender meets Child_Family_Welfare and General_Social_Work in one Work each, namely the edited volume of Linnemann et al. (2025), and Social_Assistance_Admin in three. Race or ethnicity and socioeconomic position are jointly coded with each of the three social-work fields in six to eight Works. 34 of the 39 Stereotyping Works carry Not_SW_Specific, while indirect discrimination is the most frequent harm type jointly coded with Child_Family_Welfare.[^2]

Of the 35 Works with at least one population value other than Not_SW_Specific, 14 carry the axis value None, and 12 of the 34 harm-coded among them carry the harm value None.[^4] The axis by harm-type matrix, with 103 Works coded on both fields and 51 open, pairs gender with exclusionary norms in 34 Works and with stereotyping in 33, and race or ethnicity with exclusionary norms in 31 and with indirect discrimination in 24. Of its 130 cells, 114 hold at least one Work and 16 are not determinable.[^6]

## Bias forms in the coded Works

The following paragraphs report what the coding notes and located passages record for the Works. They describe the Works as coded and attribute every argument to its source.

### Allocation through decision systems in social-work fields

The social-work Works with axis codes mostly concern predictive, scoring and administrative systems rather than LLMs. Amnesty International (2024) analyses the fraud-control models of the Danish welfare agency. The coding records direct discrimination through citizenship and foreign-affiliation inputs, which "directly discriminates on the basis of nationality, ethnicity and migration status", indirect discrimination through household, residency and income inputs acting as proxies, and exclusionary norms through the digital-only default. Its own survey of women's shelters carries the gender axis.[^7] Studeny (2025), a German conference handout, works through vignettes in which child-welfare algorithms rate families with a migration background as higher risk, place of residence acts as a proxy in debt and job-centre scoring, and benefit applications run "nur noch online über ein privates Portal [...], ohne analoge Alternativen".[^7]

The two systematic reviews of predictive analytics in child welfare structure their synthesis by equity. Hall et al. (2024) name proxy variables and "oversurveillance of marginalized communities" and use an equity category that compares model accuracy across racial groups, which carries indirect discrimination and disparate performance. Yu et al. (2025) report subgroup error rates and a synthesised post-processing correction with group-specific thresholds.[^7] James et al. (2023) argue from their own case analyses that disability-insurance scores overlook the individual impact of a disability and that a proximity-based police score led to "over-policing of African-American communities". Alam (2025) uses a reported child-welfare instrument that "flagged poverty-related factors as abuse indicators" and argues that algorithms privileging quantifiable variables discount the narratives of oppressed groups, which the coding records as erasure.[^7] The Assertions on child protection add that administrative records carry reporting and surveillance patterns into algorithmic decisions[^8], that an NLP tool showed lower name recall for Black clients[^9] and that worker-assisted screening showed a smaller racial disparity than an algorithm-only policy.[^10] The Works behind the second and third Assertion are among the two awaiting a renewed source review and have no coding.

### Language and knowledge norms in social-work Works on generative AI

Few social-work Works on generative AI carry axis codes. Patton et al. (2023) argue that LLMs "may be more likely to offer Eurocentric and white-centric content and to ignore literature and other information from BIPOC authors and authors from the Global South", coded as exclusionary norms and erasure along race or ethnicity and language or culture. Lanzetta et al. (2024) report from focus groups with youth workers that many AI tools are primarily available in English, "limiting their usability for non-English speaking youth workers and young people". The AI Agent Review flagged this as an access obstacle rather than a bias analysis. In the edited volume of Linnemann et al. (2025) one chapter observes that the recognition of Swiss German dialect depends on its proximity to Standard German, coded as disparate performance between language varieties. The 2024 article on application risks of ChatGPT in social work carries the socioeconomic axis and four harm types, but under the older rules of codebook 1.3.[^7] Ahn et al. (2025) add, for a predictive rather than a generative system, the worked example of a mental-health agency model trained mostly on English-speaking insured clients.[^7]

The other social-work Works on LLMs carry no axis. The notes of Creswell Báez et al. (2025), Goldkind et al. (2024), Rodriguez et al. (2024), Victor et al. (2023), Engelhardt et al. (2025) and Schönauer (2025) record bias as a participant concern, a generic risk of training data or a finding cited from other work, with groups named only in enumerations. Under the axis rule such mentions are not coded ([[update-protocol#Analysis coding]]). The coding thus finds in these Works no analysed axis, which is a statement about these Works under the rule and not about the bias their authors had in view.[^3]

### Output differences in studies outside social work

The experimental Works measure output differences of LLMs and image generators. Kamruzzaman et al. (2024), Kaneko et al. (2024), Ma et al. (2023), Parrish et al. (2022) and Tang et al. (2024) measure stereotyping through benchmark responses across up to nine social categories. Salinas et al. (2025) audit advice about persons with names perceived as Black or white and male or female and find that "Black, female-perceived names yield by far the worst response among all minority groups", which the coding records as indirect discrimination because names act as proxies. Yuan et al. (2025) code direct discrimination for allocations in simulated economic games that vary with the nationality stated in the prompt, and the note marks them as no real decisions about persons.[^7]

Image and text generation studies record defaults. Jääskeläinen et al. (2025) find that the hegemonic figure of their Stable Diffusion images "is a figure who is white, adult, able-bodied, and heteronormative masculine presenting". Voutyrakou et al. (2025) find that ChatGPT and Copilot policy drafts consider women's or non-binary needs only when prompted and describe a design "that equates 'neutral' with 'male,'". Dilek et al. (2025) record the same male default in CEO images generated by educators in a teacher-education course.[^7] Outside the coded subset, the Assertions on long-term-care summaries and psychiatric diagnoses report model-dependent gender differences and gender and racial or ethnic bias, but their Works are not yet screened.[^11][^12]

### Groups at the margins of the categories

Trans and non-binary people appear as analysed groups in Kong (2022), which argues that "there is no such thing as 'nonbinary gender' in the algorithm" of a body scanner, in Klein et al. (2024), in Cvoelcker (2023), whose case study records chat software that "blocked common queer terms", in Tang et al. (2024) and in Voutyrakou et al. (2025).[^7] The coding places these groups inconsistently. Tang et al. are coded under Gender only, Voutyrakou et al. under Sexual_Orientation_Identity, and the run lists the separation of the two values for trans and non-binary groups as an open rule question ([[update-protocol#Coding run of 2 October 2026]]). Three bias evaluations among the Assertions name their binary operationalisation of gender as a limitation.[^13]

Intersectional framings are coded in 28 Works, of which two carry a social-work population, Keddell (2019) and Ricaurte Quijano et al. (2024), both coded under 1.3.[^2] The gender-equity framework of Smith et al. (2021), also coded under 1.3, links gender bias to allocative and representational harms.[^14]

## Rare and absent forms

Four conditions are kept apart.

- Rare in the coded subset. Toxicity and derogatory language occur in three Works each, both in the LLM surveys of Gallegos et al. (2024) and Navigli et al. (2023), and additionally in Tang et al. (2024) and UNESCO and IRCAI (2024). None of them is jointly coded with a social-work population. Homelessness_Youth occurs once (James et al. 2023). The coding of Lanzetta et al. (2024) records that the vocabulary has no value for general youth work, so the rarity partly reflects the code list.[^4]
- Coded only outside social work. Physical appearance occurs in no Work with a social-work population. Sexual orientation and gender identity and religion occur there only in Ricaurte Quijano et al. (2024), a 1.3 coding.[^2]
- Coded absence within a Work. A None or a missing axis records that the Work does not analyse the axis under the coding rule. Gender, for example, appears only in enumerations in James et al. (2023), Baker et al. (2025) and Nuwasiima et al. (2024).[^7] This holds for the Work and does not show that the literature omits the axis.
- Not determinable. Every n.d. cell, and every statement that the literature leaves a form out, stays open while 50 included Works lack coding. The titles of the 22 Works without full text include studies on bias against women and girls in LLMs (UNESCO 2024), intersectional stereotype extraction (Charlesworth 2024), age-related bias (Shin et al. 2025), gender and ethnicity bias in generated narratives (Salecha et al. 2025), placement decisions in child welfare (Cher et al. 2024) and the AI Act and gender equality (Giannoni Adielsson et al. 2024). The two Works awaiting a renewed source review concern race in child welfare, and the Work under integrity hold concerns cultural bias against Arabs and Muslims. Most of the 25 divergence Works concern AI literacy, trust and governance by their titles.[^15] Coding these Works could change the counts for gender, age, religion and child and family welfare. That expectation is an inference from titles.[^16]

## Contradictions and qualifications

- The 1.3 and 1.4.1 codings follow different harm-type rules, so their counts are not strictly comparable, most visibly for direct discrimination.[^5]
- Track agreement is lowest where the categories are least settled. Across 107 records compared in governed agent runs, the two tracks gave identical axis codes in 76 and identical harm codes in 73. The review adopted one track's value in 27 records for each field and set a value from neither track in 4 for axes and 7 for harm types. Other_Axis accounts for 8 of the axis code disagreements and exclusionary norms for 12 of the harm code disagreements. The file labels these figures a workflow diagnostic and not an accuracy estimate.[^17]
- Two allocative cases show an open rule question. Reamer (2023) argues a biased assessment of clients through unrepresentative data without classifying it as direct or indirect, and the harm field was recorded as not decidable. Laine et al. (2025) describe a family losing welfare through a discriminatory algorithm and receive no discrimination code for the same reason.[^7]
- The 2025 narrative review "Artificial Intelligence in Social Sciences and Social Work" and Nuwasiima et al. (2024) carry agent flags for placeholder references or citations that do not match the reference list. Their codes rest only on the Works' own statements.[^7]

## What is needed to complete the answer

1. Coding of the 50 open included Works, which requires full texts for the 22 without one, domain-expert decisions on the 25 divergences, a renewed source review for Cheng et al. (2022) and Field et al. (2023) and resolution of the integrity hold (`generated/completion/field-states.csv`).
2. Recoding of the 19 Works coded under 1.3 for `AN_Bias_Axes` and `AN_Harm_Types`, which needs a contract for partial recoding ([[update-protocol#Coding run of 2 October 2026]]).
3. Rule revisions for the questions the run recorded, namely allocative disparities a Work does not classify as direct or indirect, the separation of Gender and Sexual_Orientation_Identity for trans and non-binary groups, Other_Axis, and a population value for general youth work.
4. A decision on counting the four pairs of Works that share a title or text.
5. The human spot check of the run samples for `AN_Bias_Axes` and `AN_Harm_Types` ([[update-protocol#Validation of the AI coding]]), then domain-expert verification of the codes and of this chapter.
6. Assertions for the coded findings above, which now rest on coding notes, and screening decisions for the Works behind the LLM-specific Assertions of [[sq2-risks]].

[^1]: Data from `generated/completion/sq-analysis-tables.csv`, question `SQ2`, fields `AN_Bias_Axes`, `AN_Harm_Types` and `AN_Population`, columns `work_count`, `denominator_field_coded_works` and `missing_or_unresolved_included_works`. The split by codebook version is computed from `generated/completion/completion-package.json`, `works[].analysis_codebook_versions`, and matches the table counts.
[^2]: Computed from `generated/completion/completion-package.json`, `works[].analysis_fields`, over the Works listed as coded or explicit None in `generated/completion/field-states.csv`, track `all`. Open Works per field from the same file.
[^3]: Posit. The six Works carry the axis value None, and their notes in `docs/data/screening/ar2.json` record bias as generic, cited or enumerated. That the social-work LLM literature as a whole names bias without analysing an axis is an inference from the coded subset. The open evidence question is whether the uncoded social-work Works on generative AI show the same pattern.
[^4]: Computed from `generated/completion/completion-package.json`, `works[].analysis_fields` and `works[].analysis_codebook_versions`, with the notes of the productive records in `docs/data/screening/ar2.json`, `decisions[].analysis.fields.AN_Notes`.
[^5]: Posit. The rule change is documented, while the attribution of the profile difference to it is an inference, because the 1.3 Works also differ in kind. The open evidence question is the harm-type profile of the same Works after recoding under 1.4.1.
[^6]: Data from `generated/completion/sq-association-tables.csv`, matrix `AN_Bias_Axes x AN_Harm_Types`, columns `work_count`, `status`, `works_coded_on_both_fields` and `works_open`.
[^7]: Coding notes and located passages of the productive records in `docs/data/screening/ar2.json` and in `final_coding.analysis_evidence` and `domain_expert_flags` of `tests/review-cases/agent-runs/codebook-v141-includes-*/ai-agent-review.json`. Quotations checked against `docs/data/fulltext/` for the records LXDG4KQK, LXKXPD5H, 8MDXCTA6, H59BNSX8, PYN6HB3E, LGYFN6JK, AXEIVEW3, YMABYPKF, YLAKP7Z2, 3XMBE43Z, Q4LK53XW and ZLMLP53P.
[^8]: Grounded in [[30_assertions/child-protection-records-carry-existing-inequalities-into-algorithmic-decisions]].
[^9]: Grounded in [[30_assertions/child-protection-nlp-showed-lower-name-recall-for-black-clients]].
[^10]: Grounded in [[30_assertions/child-welfare-workers-showed-smaller-racial-disparity-than-algorithm]]. The conceptual counterpart is [[30_assertions/algorithmic-decision-making-can-introduce-and-expose-structural-bias]], grounded in James et al. (2023).
[^11]: Grounded in [[30_assertions/long-term-care-summaries-showed-model-dependent-gender-differences]].
[^12]: Grounded in [[30_assertions/psychiatric-diagnosis-audit-reports-gender-and-racial-ethnic-bias]].
[^13]: Grounded in [[30_assertions/bias-evaluations-name-binary-gender-operationalisation-as-limitation]]. The Works behind it are not yet screened.
[^14]: Grounded in [[30_assertions/gender-equity-framework-links-gender-bias-to-allocative-and-representational-harms]].
[^15]: Data from `generated/completion/field-states.csv`, columns `missing_work_ids`, `conflict_decision_work_ids`, `stale_source_review_work_ids` and `hold_work_ids`, with titles from `generated/completion/completion-package.json`. Full-text availability checked against `docs/data/fulltext/`.
[^16]: Posit. The expectation rests on titles only. The open evidence question is which axis, harm and population codes these Works receive.
[^17]: Data from `generated/completion/agent-track-diagnostics.csv`, rows `AN_Bias_Axes` and `AN_Harm_Types`, columns `compared_records`, `identical`, `adopted_one_track`, `value_from_neither_track` and `code_disagreements`, labelled `workflow_diagnostic_not_accuracy`.
