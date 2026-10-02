---
type: chapter
stage: draft
status: grounded
checked:
  validation: '2026-10-02'
assertions:
  - "[[30_assertions/kaneko-et-al-report-cot-reduced-bias-in-specific-evaluations]]"
  - "[[30_assertions/reported-prompting-effects-vary-across-models-and-bias-categories]]"
  - "[[30_assertions/kabra-et-al-transfer-reasoning-through-fine-tuning-for-bias-mitigation]]"
posits: 4
research-questions:
  - SQ3
created: '2026-10-02'
updated: '2026-10-02'
---

# SQ3 Handling of bias

SQ3 asks how the literature handles the bias forms it names, at which stage, with which techniques and with which evidence status ([[project#Research questions]]). This draft answers it in the two layers of [[analysis-methods#Answering the research questions]]. The descriptive layer counts the coded fields `AN_Mitigation_Stage`, `AN_Mitigation_Status`, `AN_Prompt_Techniques` and `AN_Prompting_Role`. The interpretive layer describes, from each Work's coding note and full text, what the Works with the status Evaluated assessed and with which result.

Every coding used here was produced by AI agent tracks and checked by a source-grounded AI Agent Review. None has been verified by a domain expert. The chapter itself has the status `grounded`, and the three Assertions it cites carry AI Agent Review without domain-expert verification. Recommendations named below are those of their sources.

## Coverage on 2 October 2026

- The completion package records 154 Works with a recorded Include. 104 of them carry a coding state for all four SQ3 fields. 50 are open, of which 25 carry a divergence between the human Include and the agent decision and therefore no coding, 22 lack coding, 2 have a stale source review and 1 is under an integrity hold (`generated/completion/field-states.csv`, track `all`).
- Within the 104, the stage and status fields carry a value in 96 Works and the explicit value None in 8. The technique field carries a value in 34 Works and None in 70. The prompting-role field carries a value in 45 Works and None in 59 (same file).
- 85 of the 104 Works were coded under codebook 1.4.1 and 19 under codebook 1.3 (`generated/completion/completion-package.json`, `works[].analysis_codebook_versions`). The stage, status and technique definitions did not change between these versions ([[update-protocol#Recoding and coding of the remaining Includes]]).
- Every observed cell of the SQ3 tables rests on coding at the lifecycle state `ai-agent-reviewed` (`generated/completion/sq-analysis-tables.csv`, column `authority`).

Every figure below therefore refers to 104 coded of 154 included Works. An empty cell is not determinable while 50 included Works remain open, and no statement in this chapter says that the literature leaves a stage, technique or status unaddressed.

## Answer in brief

1. In the coded Works, the literature handles bias mostly by proposing measures. 62 of 104 Works carry the status Proposed, 9 Demonstrated and 25 Evaluated, and 8 address no mitigation.
2. The most frequent stage is Organisational_Process, coded in 79 of 104 Works, and in 33 Works it is the only stage. Technical stages follow with Pre_Processing in 44 Works, Prompt_Practice in 25 and In_Training in 19. Most Works with an organisational stage carry the status Proposed.
3. Of the 25 Evaluated Works, 15 also carry the stage Prompt_Practice, and in each of these the evaluated intervention, by its coding note, includes a change to prompts or the prompting procedure. Their reported results are mixed. Plain instructions to be fair or diverse failed or helped little in several experiments, while structured procedures such as self-critique with voting, anti-stereotypical demonstrations, numeric anchors or multilingual prompting reduced the measured bias or increased diversity under the tested conditions. Chain-of-Thought prompting shows contrary results across studies.
4. No Evaluated Work assesses a handling of bias for an LLM in a social-work setting. The two Evaluated Works coded for child and family welfare are systematic reviews that report evaluations of predictive tools, not of LLMs.

## Stages

| Mitigation stage | Works coded | Cell status |
|---|---:|---|
| Pre_Processing | 44 | observed |
| In_Training | 19 | observed |
| Intra_Processing | 3 | observed |
| Post_Processing | 6 | observed |
| Prompt_Practice | 25 | observed |
| Organisational_Process | 79 | observed |
| None | 8 | observed |

Denominator 104 field-coded of 154 included Works, 50 open (`generated/completion/sq-analysis-tables.csv`, question SQ3, field `AN_Mitigation_Stage`). The field takes several values per Work, so the column sum exceeds the denominator. 51 of the 104 Works carry more than one stage (`generated/completion/completion-package.json`, `works[].analysis_fields`, computed over the 104 Works of the table).

Organisational_Process covers responsibility, participation, training, governance, audit and human oversight ([[update-protocol#Source-review clarification, 5 September 2026]]). Its dominance indicates that the coded literature frames bias handling largely as a question of institutional practice. This reading is an inference of this draft from the counts and needs the Assertions named under [What is needed to complete the answer](#what-is-needed-to-complete-the-answer).

## Status

| Mitigation status of the Work | Works coded |
|---|---:|
| Evaluated | 25 |
| Demonstrated | 9 |
| Proposed | 62 |
| None | 8 |

Denominator 104 field-coded of 154 included Works, 50 open (`generated/completion/sq-analysis-tables.csv`, field `AN_Mitigation_Status`). The status is one value per Work and records the highest supported status. Evaluated requires a completed assessment of an identifiable mitigation with a reported result, whether positive, negative or mixed, and a review qualifies when it synthesises such an assessment ([[update-protocol#Source-review clarification, 5 September 2026]]). Evaluated therefore does not mean effective.

## Prompt techniques and prompting role

| Prompt technique | Works coded | Cell status |
|---|---:|---|
| General_Guidance | 27 | observed |
| ICL | 11 | observed |
| Role_Persona | 11 | observed |
| Thought_Generation | 10 | observed |
| Self_Criticism | 4 | observed |
| Ensembling | 2 | observed |
| Decomposition | 0 | not determinable |
| None | 70 | observed |

| Prompting role | Works coded |
|---|---:|
| Research_Instrument | 32 |
| Recommended_Practice | 27 |
| Learning_Content | 11 |
| Object_of_Critique | 5 |
| None | 59 |

Denominator 104 field-coded of 154 included Works, 50 open (`generated/completion/sq-analysis-tables.csv`, fields `AN_Prompt_Techniques` and `AN_Prompting_Role`). Both fields take several values per Work. No coded Work carries Decomposition, and with 50 included Works open this is not determinable.

A technique code records that a Work names or recognisably describes the technique, whether as a tested intervention, a measurement instrument, a comparison baseline or a recommendation. General_Guidance is the most frequent code because it covers explicit instructions such as asking the model to avoid stereotypes. Prompting serves more often as a research instrument than as a recommended practice. Five Works treat prompting as an object of critique, among them Shin et al. (2024), who find prompt modifiers insufficient as bias control, and Kabra et al. (2025), who criticise the prompt sensitivity of Chain-of-Thought prompting.

## Stage and status coded in the same Work

| Stage | Evaluated | Demonstrated | Proposed | None |
|---|---:|---:|---:|---:|
| Pre_Processing | 11 | 4 | 29 | n. b. |
| In_Training | 10 | 2 | 7 | n. b. |
| Intra_Processing | 2 | n. b. | 1 | n. b. |
| Post_Processing | 4 | n. b. | 2 | n. b. |
| Prompt_Practice | 15 | 2 | 8 | n. b. |
| Organisational_Process | 11 | 8 | 60 | n. b. |
| None | n. b. | n. b. | n. b. | 8 |

Works per stage and per status of the Work. 104 Works coded on both fields, 50 open, and every empty cell is `not_determinable` (`generated/completion/sq-association-tables.csv`, matrix `AN_Mitigation_Stage x AN_Mitigation_Status`). n. b. marks a cell that is not determinable.

A cell counts Works in which a stage is coded and the Work as a whole carries a status. It does not state that the intervention at this stage was evaluated, demonstrated or proposed ([[specification#Epistemic display rules]]). The coding notes show how far the two diverge. Of the 11 Works in the cell Organisational_Process and Evaluated, the evaluated intervention is organisational in two, the AI literacy course of Kong et al. (2021) and the community measures of the Queer in AI case study (2023). In eight of the other nine the note ties the evaluation to a technical or prompt intervention, while the organisational measures remain proposals, and for Navigli et al. (2023) it names synthesised mitigation approaches without specifying them. This classification was read from the notes for this draft and is no coded field. Gengler et al. (2024) illustrate the case within one Work. Their guide is coded for four stages, and the status Evaluated applies only to adding the word "divers" to an image prompt.

The matrix of prompt technique by status shows the same limit (`generated/completion/sq-association-tables.csv`, matrix `AN_Prompt_Techniques x AN_Mitigation_Status`, 104 Works coded on both fields, 50 open). General_Guidance is coded together with Evaluated in 12 Works, and in several of them the guidance was the failed baseline, not the evaluated intervention.

## Works with the status Evaluated

The status Evaluated is coded for 25 of 104 Works (`generated/completion/sq-analysis-tables.csv`). By their coding notes and full texts, 18 report their own experiment or assessment and 7 synthesise evaluations reported by other studies. This split is a classification of this draft, made from `AN_Notes` in `docs/data/screening/ar2.json` and the full texts under `docs/data/fulltext/`, and no coded field. 15 of the 25 are experimental studies, 5 literature reviews, 2 empirical, 2 theoretical and 1 conceptual (field `Studientyp`). 21 of the 25 carry the population value Not_SW_Specific (`generated/completion/completion-package.json`, `works[].analysis_fields`).

The study by Kamruzzaman and Kim (2024) is counted twice among the 25, because its published and its extended version stand under separate Works (`7W3RGSSG`, `ACDF4FL9`). The identity flag waits for the domain experts ([[update-protocol#Coding run of 2 October 2026]]).

### Prompt-level interventions in the Works' own experiments

Fourteen Works report their own experiment with an intervention at the prompt stage. All of them test general-purpose or benchmark tasks outside social work.

- Lahoti et al. (2023) report that a procedure of self-critique, revision and self-voting increased the demographic diversity of people named in model answers against all baselines, while a plain instruction to answer with diversity failed.
- Kaneko et al. (2024) report lower bias scores for zero-shot and few-shot Chain-of-Thought prompting on their gender benchmark[^1] and judge an explicit debiasing instruction inadequate. They limit the comparative advantage of Chain-of-Thought to particular model conditions[^2].
- Kamruzzaman and Kim (2024) report that a human persona combined with an instruction to answer slowly and thoughtfully lowered stereotypical answers most on average, whereas Chain-of-Thought increased them. The strongest configuration was not best across all models and bias categories[^2].
- Kabra et al. (2025) transfer reasoning traces to base models through fine-tuning[^3] and report gains on a bias benchmark, while their Chain-of-Thought prompting comparator shows mixed or negative results. The coding note records inconsistencies between their tables.
- Salinas et al. (2025) find that qualitative context in the prompt reduced name-based race and gender disparities inconsistently, whereas a numeric anchor often removed them.
- Yuan et al. (2025) report that four prompt strategies, among them a fairness perspective and a multicultural scenario, reduced country differences in ChatGPT's decisions to non-significance in most task and model combinations, with one strategy failing in one game.
- Sant et al. (2024) report that a prompt with invented anti-stereotypical examples and short Chain-of-Thought reduced gender bias in machine translation at a slight loss of quality, while an instruction to ensure fair gender treatment brought no improvement.
- Wang et al. (2024) report that multilingual and multicultural prompting yielded the highest diversity of generated names in most comparisons and fewer hallucinated culture-specific names.
- Qiu et al. (2025) report that a system prompt built from bias-revealing demonstrations, step-by-step reasoning and self-verification mitigates gender bias while preserving model performance.
- Chisca et al. (2024) train soft prompt embeddings for frozen encoder models and report results on par with established debiasing methods and below one of them on one model.
- Clemmer et al. (2024) let a fine-tuned language model rewrite generic image prompts and report a smaller gap between generated and target ratios for ethnicity and gender.
- Shin et al. (2024) report that demographic modifiers in image prompts shifted output distributions inconsistently, with effects depending on modifier order.
- Gengler et al. (2024) report from an informal trial with one prompt in two image tools that adding "divers" changed the depiction little. Their guide recommends more detailed descriptions of the intended result, which is a recommendation of the source and was not evaluated.

### Technical interventions in the Works' own experiments

Tang et al. (2024) report that counterfactual data augmentation with parameter-efficient fine-tuning reduced gender bias across several benchmarks, one of which includes transgender and non-binary groups, without compromising general performance. Garg et al. (2019) report that counterfactual logit pairing and identity-token blindness closed a counterfactual fairness gap in toxicity classification without loss in overall accuracy and name trade-offs with group fairness.

### Organisational interventions in the Works' own assessments

Kong et al. (2021) evaluated an AI literacy course for university students and report that a gender gap in self-perceived AI empowerment present before the course was absent after it, with no significant gender difference in concept test scores before or after. The intervention addresses a gender gap in learning about AI and not bias in an AI system. The Queer in AI case study (2023) assesses the organisation's own measures against the exclusion of queer people from AI research through surveys and adoption figures and reports partly modest adoption. Both evaluations concern measures against exclusion in education and research communities.

### Synthesised evaluations

- Gallegos et al. (2024) report from Borchers et al. (2022) that instructions asking for diversity or gender equality were unsuccessful for bias removal. Their survey inventories the other techniques without assessment.
- Kattnig et al. (2024) report from Tyagi et al. that an enhanced variational autoencoder mitigates gender bias in static word embeddings.
- Lin and Chen (2022) report from Pierson et al. (2021) that patient-reported pain as label and a diverse dataset reduced unexplained pain disparities.
- Gohar and Cheng (2023) synthesise reported experimental results of intersectional fairness methods.
- Hall et al. (2024) report from Wilson et al. (2015) that separate prediction models for Māori children in child welfare did not achieve the desired effect, a negative result.
- Yu and Rose (2025) report from Purdy and Glass (2023) that group-specific risk thresholds in child welfare reduced false positive and false negative error rates among four subgroups.
- Navigli et al. (2023) are coded Evaluated under codebook 1.3 with a note that the review synthesises empirically tested mitigation approaches. The mitigation passages located in the full text for this draft describe approaches as proposed or under development and report no result. Under the clarification of 5 September 2026 an inventory does not suffice, so this status is doubtful and belongs to the domain-expert check.

### Demonstrated

Nine Works carry the status Demonstrated (`generated/completion/sq-analysis-tables.csv`). Two address social work directly. James et al. (2023) report using a critical case-study pedagogy on algorithmic decision-making in their own undergraduate social-work teaching without a reported evaluation. The narrative review "Artificial Intelligence in Social Sciences and Social Work" (2025), for which the corpus metadata name no author, reports diverse training data, debiasing and human oversight as implemented in pilot programmes without a reported result, and its reference list is flagged as doubtful. The other seven demonstrate inclusive image prompting, feminist AI projects, co-creation trainings and audits without completed assessment.

## Contradictions and qualifications

- Chain-of-Thought prompting reduced measured gender bias in the evaluation of Kaneko et al. (2024)[^1], increased stereotypical answers in that of Kamruzzaman and Kim (2024) and produced mixed or negative results as comparator in that of Kabra et al. (2025). The studies differ in benchmarks, bias metrics and models. That these differences explain the contrary results is an inference of this draft and untested.
- Explicit fairness or diversity instructions failed or helped little in Lahoti et al. (2023), Kaneko et al. (2024), Sant et al. (2024), Gengler et al. (2024) and in the study Gallegos et al. (2024) report. Yuan et al. (2025) report that comparable cues, such as asking for a fairness perspective, reduced country differences in most of their conditions. The tasks differ, allocation decisions in economic games against coreference, translation and image generation, and treating the task as relevant to the result is an inference of this draft.
- Several Evaluated Works report gains together with limits that their coding notes record, such as inconsistent tables in Kabra et al. (2025), an informal single-prompt trial in Gengler et al. (2024) and binary gender operationalisation in most prompt experiments. Effects reported in benchmark tasks say nothing yet about their transfer to social-work tasks.

## Not determinable and absent

- A stage, technique or status combination is not determinable when included Works remain open. This holds for every empty cell above and for Decomposition.
- Absence within a source is recorded where the source states it, as in the Works whose coding note limits Evaluated to one intervention and records the other measures as proposed.
- That no Evaluated Work assesses bias handling for an LLM in a social-work setting describes the 104 coded Works. With 50 included Works open it is no statement about the literature. Within the coded set, the evaluated handling in child and family welfare concerns predictive tools, and the two Works addressing social work with a practised measure report no evaluation.

## What is needed to complete the answer

1. Coding of the 50 open included Works, which means domain-expert decisions on the 25 Works with a divergence between human Include and agent decision, coding of the 22 missing Works, renewed source review of 2 Works and resolution of the integrity hold (`generated/completion/field-states.csv`).
2. Recoding of the 19 Works coded under codebook 1.3 under the current codebook, beginning with the three Evaluated Works among them. The status of Navigli et al. (2023) needs a check against the clarification of 5 September 2026, and the classification of the course evaluation of Kong et al. (2021) as bias mitigation needs a scholarly decision.
3. Resolution of the identity flag for the two Works of Kamruzzaman and Kim (2024), so that the study counts once.
4. A coded distinction between a Work's own evaluation and a synthesised evaluation, and the deferred stage-status pairs (`AN_Stage_Status`) once a validator enforces their rules ([[analysis-methods#Answering the research questions]]). Until then the attribution of a status to a stage rests on reading the notes, as done here.
5. Assertions for the evaluated results described above. The vault holds further SQ3 Assertions with the status `grounded`, among them on fairness-aware prompting in mental-health classification, persona-induced bias and prompt language, that have not yet received AI Agent Review and are not used here.
6. The human spot check of the coding runs against the full text ([[update-protocol#Validation of the AI coding]]), and then domain-expert verification of the Assertions and of this chapter.

[^1]: Grounded in [[30_assertions/kaneko-et-al-report-cot-reduced-bias-in-specific-evaluations]].
[^2]: Grounded in [[30_assertions/reported-prompting-effects-vary-across-models-and-bias-categories]].
[^3]: Grounded in [[30_assertions/kabra-et-al-transfer-reasoning-through-fine-tuning-for-bias-mitigation]].
