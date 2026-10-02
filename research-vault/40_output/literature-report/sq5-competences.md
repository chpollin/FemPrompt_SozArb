---
type: chapter
stage: draft
status: grounded
checked:
  validation: '2026-10-02'
assertions:
  - "[[30_assertions/ahn-et-al-propose-integrating-ai-literacy-across-existing-core-competencies]]"
  - "[[30_assertions/ai-literacy-for-social-work-framed-as-critical-understanding]]"
  - "[[30_assertions/victor-et-al-require-knowledge-of-tool-construction-limits-and-biases]]"
  - "[[30_assertions/social-work-research-guidance-requires-disclosure-of-prompts-and-models]]"
  - "[[30_assertions/social-work-research-guidance-requires-verification-of-and-accountability-for-ai-outputs]]"
  - "[[30_assertions/social-work-sources-name-professional-judgement-as-a-capacity-to-retain-and-strengthen]]"
  - "[[30_assertions/sources-link-responsible-llm-use-to-attention-to-marginalised-and-misrepresented-groups]]"
  - "[[30_assertions/james-et-al-propose-preparing-social-workers-to-challenge-harmful-algorithmic-processes]]"
  - "[[30_assertions/james-et-al-propose-a-case-based-technical-critical-pedagogy]]"
  - "[[30_assertions/sources-locate-responsible-ai-use-in-governance-and-quality-control-structures]]"
  - "[[30_assertions/sources-name-participation-of-affected-communities-as-a-condition-of-equitable-ai]]"
  - "[[30_assertions/sources-tie-algorithmic-decision-support-to-retained-professional-control]]"
  - "[[30_assertions/beloch-and-martin-argue-ai-supported-counselling-needs-concepts-tailored-to-clients]]"
  - "[[30_assertions/persona-prompting-can-introduce-identity-congruent-bias]]"
  - "[[30_assertions/xiao-et-al-find-no-fair-prompting-strategy-effective-in-every-tested-scenario]]"
posits: 3
research-questions:
  - SQ5
created: '2026-10-02'
updated: '2026-10-02'
---

# Competences and organisational conditions (SQ5)

SQ5 asks which competences and organisational conditions the literature names for a responsible use of large language models (LLMs), and where general prompting guidance falls short for social work ([project](../../../knowledge/project.md#research-questions)). The answer combines the descriptive map of three coded fields with source-linked Assertions and a comparison against *The Prompt Report* (Schulhoff et al. 2024), the external framework of general prompt guidance chosen on 1 October 2026 ([plan](../../../knowledge/plan.md), decision 9). All analysis coding used here has the lifecycle state `ai-agent-reviewed`. None of it, none of the Assertions and not this chapter has been verified by a domain expert. One Assertion has received AI Agent Review, all others carry the status `grounded`. Competences and conditions are reported as those of their sources and are no recommendations of this review.

## Coverage on 2 October 2026

- Of the 154 Works with a recorded Include, 104 are coded for the prompting-role field `AN_Prompting_Role`, 45 with at least one value and 59 with the explicit value None. 25 Works carry a divergence between the human Include and the agent decision and therefore no analysis coding, 1 is under an integrity hold, 2 have a stale source review and 22 lack coding (`generated/completion/field-states.csv`, track `all`). The same 104 Works are coded for `AN_Prompt_Techniques` and `AN_Mitigation_Stage`.
- Of the 104 coded Works, 90 belong to the legacy human decision track and 14 to the AI-review decision track (`generated/completion/field-states.csv`, tracks `legacy_human` and `ai_review`).
- 131 included Works carry a single governed category coding. Of these, 43 are coded `AI_Literacies` at level ja, 39 at level teilweise and 49 at level nein. Of the 43 ja-coded Works, 28 are among the 104 coded Works and 15 are among the 25 divergence Works (computed from `generated/completion/completion-package.json`, `works[].agent_records`, by the rule of the category matrices in `src/analysis/build_completion_package.py`).

The last figure bears directly on SQ5. The update protocol records that the agent tracks derived Unclear or Exclude mostly for AI-literacy frameworks, reviews and practice texts ([update protocol](../../../knowledge/update-protocol.md#coding-run-of-2-october-2026)). The divergence Works include AI-literacy reviews and frameworks such as Ng et al. (2021), Chiu et al. (2024), Pinski et al. (2024) and Chee et al. (2025). The literature that addresses competences most directly is therefore the part of the corpus with the least analysis coding.

## Answer in brief

Within the coded subset, three statements can be made.

1. Prompting appears as learning content in 11 of 104 coded Works, 10 of which also recommend it as practice. Three of the 11 address a social-work practice population. The social-work sources treat prompting as one competence among several, next to conceptual understanding of the models, assessment of outputs, documentation, verification and professional judgement.
2. Organisational measures are the most frequent mitigation stage, coded in 79 of 104 Works. In the social-work sources they comprise training, ethical guidelines and governance, participation of affected people and retained human control. The codebook does not separate these facets, so their distribution is not determinable from the coding.
3. Named prompting techniques concentrate in Works outside social work. Of the 28 coded Works with a social-work practice population, 23 code no technique and only Rodriguez et al. (2024) names a technique family. The social-work sources locate the requirements for responsible use largely in the handling of outputs, records and responsibilities, which the technique taxonomy of *The Prompt Report* does not cover. That this is where general prompt guidance falls short is an inference of this draft.

## How prompting appears in the coded Works

| Prompting role | Works coded | of 104 |
|---|---:|---:|
| Research_Instrument | 32 | 104 |
| Recommended_Practice | 27 | 104 |
| Learning_Content | 11 | 104 |
| Object_of_Critique | 5 | 104 |
| None | 59 | 104 |

The figures come from `generated/completion/sq-analysis-tables.csv`, field `AN_Prompting_Role`, and the script output. The field allows several values per Work, so the column sum exceeds the denominator. 50 included Works are open, so no role can be called absent from the literature.

The 11 Works coded Learning_Content are Engelhardt et al. (2025), Djeffal (2025), Small (2023), Skilton et al. (2024), Ruiz et al. (2024), Lanzetta et al. (2024), Rodriguez et al. (2024), Hauck et al. (2025), Linnemann et al. (2025) and the practice guide "Faires KI-Prompting" by Gengler et al. (2024), which the registry holds as two Works (`YN9JAREI`, `4KMMPA6A`). Whether these are one text is an identity question for the domain experts, and until it is resolved the count of distinct texts may be 10. Ten of the 11 also carry the category `AI_Literacies` at level ja. Three carry a social-work practice population, Lanzetta et al. (2024) for youth work, Rodriguez et al. (2024) for the Master of Social Work curriculum and the edited volume by Linnemann et al. (2025). Engelhardt et al. (2025) is a workshop report from social-work higher education and is coded with the population Education_Professional only.

Object_of_Critique is coded for 5 Works. Djeffal (2025) criticises chain-of-thought explanations as an "illusion of transparency", a passage checked in the full text. Linnemann et al. (2025) carries the value for a chapter on prompting attacks according to the coding note. The other three, Kabra et al. (2025), Navigli et al. (2023) and Shin et al. (2024), are technical works outside social work.

## Competences the sources name

The following attributions rest on the cited Assertions or on passages checked in the full text (`docs/data/fulltext/<record>.md`). Coding notes are cited only as the coding agent's rationale.

### Prompting as one competence among several

Rodriguez et al. (2024) propose a new accreditation competency indicator for social-work education and name "four foundational skills", conceptual understanding of how AI models are trained, "understanding how to write prompts effectively", "assessing output from GenAI models for ethical, socioemotional, and practice implications" and continuous learning about benefits and harms "at the individual, community, organizational, and national level" (`YRBP6IEJ`, checked). For prompting they cite chain-of-thought prompting and a catalogue of prompt patterns with personas. Lanzetta et al. (2024) report from focus groups with youth workers that prompt writing is a competence to be trained, "Writing clear and detailed prompts to generate relevant and personalised content for youth" (`AXEIVEW3`, checked). Engelhardt et al. (2025) describe "Prompting-Kompetenz" as a metacognitive ability to formulate questions and instructions and mention chain-of-thought prompting as a useful strategy (`DGLWM93D`, checked). Djeffal (2025) argues that organisations should treat prompt engineering not "merely" as a technical skill but as "a crucial component of AI literacy" (`8WBUGXRR`, checked).

### Critical understanding, verification and judgement

Ahn et al. (2025) propose integrating AI literacy across the existing core competencies of social work[^1]. Three social-work education sources describe the required literacy as technical understanding combined with critical understanding of social, ethical and political effects[^2]. Victor et al. (2023) require knowledge of a tool's construction, training data, limitations and potential biases[^3]. Patton et al. (2023) and Victor et al. (2023) treat prompts as part of the research record and require disclosure of the model and its prompts[^4], and they require that users verify generated text and analyses and remain accountable for them[^5]. Several sources name professional judgement as a capacity that education should strengthen and to which AI-supported work should remain subordinate[^6]. Two sources make attention to marginalised or misrepresented groups part of responsible engagement with generative output[^7]. James et al. (2023) propose that education prepare social workers to influence, constrain or refuse harmful algorithmic processes[^8] and outline a case-based pedagogy for this purpose[^9]. Creswell Báez et al. (2025) report from interviews with clinical social workers "an urgent need for social work education to address digital competency, critical algorithmic literacy, and the broader sociotechnical context of AI tools" (`JI24FQPV`, checked). Outside social work, Hauck et al. (2025) define critical AI literacy for higher education as the ability to evaluate outputs by equity, diversity, inclusion and accessibility principles and "to engage in equitable and inclusive prompting when required", and recommend comparing the outputs of repeated prompts to detect cultural bias (`YTDMY5W4`, checked).

All of these sources name competences as needed. None evaluates whether a curriculum or a named competence changes practice or reduces bias. The Assertions record this boundary in their scope sections.

## Organisational conditions the sources name

`Organisational_Process` is coded for 79 of 104 coded Works, in 33 of them as the only stage and in 11 together with Prompt_Practice. 26 of the 79 carry a social-work practice population (`generated/completion/sq-analysis-tables.csv`, row SQ5 `AN_Mitigation_Stage` Organisational_Process, and the script output). Mitigation status is coded once per Work and cannot be attributed to the organisational stage. Of the 79 Works, 60 carry the status Proposed, 8 Demonstrated and 11 Evaluated. For Hall et al. (2024) and Yu et al. (2025) the coding notes limit the status Evaluated to a synthesised evaluation of another study and to a post-processing fairness correction, so it does not concern the organisational measures these reviews also name.

The value covers responsibility, participation, training, governance, audit and human oversight ([update protocol](../../../knowledge/update-protocol.md#source-review-clarification-5-september-2026)). The coding does not record which of these a Work names. The social-work sources name the following.

- Training and ethics education. Goldkind et al. (2024) demand that social-work education "expand training on the Code of Ethics to speak to new AI tools" (`4GYXUS9Y`, checked). Rodriguez et al. (2024) and Lanzetta et al. (2024) place training in education and in-service learning.
- Governance and quality control. Sources locate responsible use partly in ethics and policy frameworks, documentation, audits, gender-sensitive governance and editorial quality control[^10]. Garkisch et al. (2024) name governance and oversight as guardrails for the quality of services and the rights and privacy of clients (`UENFDPH9`, checked).
- Participation. Sources from social work, gender equity, digital equity and intersectional fairness name the participation of affected communities as a condition for equitable AI[^11]. Studeny (2025) demands that social work call for transparency and "Widerspruchsmöglichkeiten" and names reflection methods such as a "MachtCheck" for tools (`LXKXPD5H`, checked).
- Human control. Keddell (2019) treats retained professional control as a condition for algorithmic decision support in child protection[^12]. Beloch and Martin (2026) argue that AI-supported counselling would need counselling concepts geared to clients' resources and needs[^13].

According to the coding notes, Reamer (2023), Nuwasiima et al. (2024), Chen et al. (2025), Ahn et al. (2025) and the Amnesty International (2024) report on Danish welfare administration name further combinations of training, audits, ethics committees, transparency and independent oversight. These attributions rest on the notes and have not been checked in the full text for this draft.

## Comparison with *The Prompt Report*

*The Prompt Report* presents a vocabulary of 33 terms and a taxonomy of 58 text-based prompting techniques. Its sixth version of 26 February 2025, consulted for this draft, groups these techniques into in-context learning, thought generation, decomposition, ensembling and self-criticism, places role prompting among the zero-shot techniques of its in-context learning section, and lists vanilla prompting, balanced demonstrations, cultural awareness and AttrPrompt under biases, stereotypes and culture (Schulhoff et al. 2024). The codebook values ICL, Thought_Generation, Decomposition, Ensembling and Self_Criticism follow these families. Role_Persona is kept as a separate value, and General_Guidance collects advice without a named family and has no counterpart in the taxonomy.

| Technique | Works coded | Works with a social-work practice population |
|---|---:|---:|
| General_Guidance | 27 | 5 |
| ICL | 11 | 0 |
| Role_Persona | 11 | 1 |
| Thought_Generation | 10 | 1 |
| Self_Criticism | 4 | 0 |
| Ensembling | 2 | 0 |
| Decomposition | 0 | 0 |
| None | 70 | 23 |

The first column has 104 coded Works as denominator, the second 28. The figures come from `generated/completion/sq-analysis-tables.csv`, field `AN_Prompt_Techniques`, `generated/completion/sq-association-tables.csv`, matrix `AN_Prompt_Techniques x AN_Population`, and the script output. Every zero cell has the status `not_determinable` because 50 included Works are open.

Within these limits the comparison shows three things. First, the named technique families occur almost entirely in Works without a social-work population. In the coded social-work Works only Rodriguez et al. (2024) names families, chain-of-thought prompting and personas from a pattern catalogue, and everything else is general guidance or no technique. Second, the general guidance in social-work and education sources concerns the clarity, specificity and iteration of prompts (Lanzetta et al. 2024, Rodriguez et al. 2024) or inclusive prompting and the comparison of outputs (Hauck et al. 2025), which the taxonomy treats at most under its alignment section. Third, the competences the social-work sources add, namely disclosure of prompts and models, verification of outputs, accountability, assessment for ethical and practice implications and retained judgement[^4][^5][^6], concern the handling of outputs and responsibilities rather than the construction of prompts. The taxonomy classifies how prompts are built and does not address these. Reading this difference as the point where general prompting guidance falls short for social work is an inference of this draft and not a finding of a source.

Evidence from outside social work qualifies the techniques that the social-work sources recommend. Two experiments report that assigning a social-identity persona can introduce identity-congruent bias[^14], although that Assertion makes no claim about professional role prompts such as a simulated client. In a medical benchmark, no fair prompting strategy reduced the measured accuracy gaps in every tested scenario[^15]. Whether these findings transfer to the role plays and persona patterns recommended for social-work education is an open question and an inference of this draft.

The comparison cannot yet determine the following.

- Whether social-work sources name techniques the taxonomy lacks. General_Guidance records the strategy only in the coding note, so its content is not countable.
- A comparison at the level of the 58 techniques. The codebook records families, not individual techniques.
- The prompting content of the 15 AI-literacy Works in the divergence set and of the 22 Works without coding.

## Contradictions and qualifications

- Djeffal (2025) recommends chain-of-thought prompting with ethical checkpoints and at the same time criticises chain-of-thought explanations as an illusion of transparency. The two positions concern different functions of the same technique within one source.
- Rodriguez et al. (2024) and Engelhardt et al. (2025) recommend chain-of-thought prompting and personas for social-work education, while the persona experiments outside social work report induced bias[^14]. The sources do not address each other.
- No two SQ5 Assertions are recorded as contested. Contradicting sources were not systematically searched, so this establishes no agreement.

## What is needed to complete the answer

1. A domain-expert decision on the 25 divergence Works, among them 15 coded `AI_Literacies` at level ja, and governed coding of the 22 uncoded Works, the hold and the 2 Works with stale source review (`generated/completion/field-states.csv`).
2. A codebook amendment that separates the facets of `Organisational_Process`, or Assertions per facet, because the coding does not record training, governance, participation and oversight separately.
3. A resolution of the duplicate Works `YN9JAREI` and `4KMMPA6A` for the guide by Gengler et al. (2024).
4. Assertions with anchored distillates for Rodriguez et al. (2024), Lanzetta et al. (2024), Engelhardt et al. (2025), Djeffal (2025), Creswell Báez et al. (2025), Goldkind et al. (2024), Studeny (2025) and Garkisch et al. (2024), whose passages this draft cites from the full text only.
5. Screening decisions for the not yet screened Works behind several Assertions, among them Wallengren-Lynch (2026), Beloch and Martin (2026) and the persona and medical prompting studies[^2][^13][^14][^15].
6. A decision whether the comparison with *The Prompt Report* should extend to its sections on alignment and evaluation, and a single citation of the report, since the plan names the 2024 version and the codebook presentation the 2025 version.
7. AI Agent Review of the cited Assertions and of this chapter, then domain-expert verification.

[^1]: Grounded in [[30_assertions/ahn-et-al-propose-integrating-ai-literacy-across-existing-core-competencies]], status `ai-agent-reviewed`, Work Include and coded.
[^2]: Grounded in [[30_assertions/ai-literacy-for-social-work-framed-as-critical-understanding]], Works of James et al. (2023) Include, Wallengren-Lynch (2026) and Pinazo-Hernandis and Carcavilla-González (2026) not yet screened.
[^3]: Grounded in [[30_assertions/victor-et-al-require-knowledge-of-tool-construction-limits-and-biases]], Work Include.
[^4]: Grounded in [[30_assertions/social-work-research-guidance-requires-disclosure-of-prompts-and-models]], Works Include.
[^5]: Grounded in [[30_assertions/social-work-research-guidance-requires-verification-of-and-accountability-for-ai-outputs]], Works Include.
[^6]: Grounded in [[30_assertions/social-work-sources-name-professional-judgement-as-a-capacity-to-retain-and-strengthen]], Works of Patton et al. (2023) and Hodgson et al. (2022) Include, Pinazo-Hernandis and Carcavilla-González (2026) not yet screened.
[^7]: Grounded in [[30_assertions/sources-link-responsible-llm-use-to-attention-to-marginalised-and-misrepresented-groups]], Patton et al. (2023) Include, Wallengren-Lynch (2026) not yet screened.
[^8]: Grounded in [[30_assertions/james-et-al-propose-preparing-social-workers-to-challenge-harmful-algorithmic-processes]], Work Include.
[^9]: Grounded in [[30_assertions/james-et-al-propose-a-case-based-technical-critical-pedagogy]], Work Include.
[^10]: Grounded in [[30_assertions/sources-locate-responsible-ai-use-in-governance-and-quality-control-structures]], Works of Baker et al. (2025), Smith et al. (2021) and Victor et al. (2023) Include.
[^11]: Grounded in [[30_assertions/sources-name-participation-of-affected-communities-as-a-condition-of-equitable-ai]], Baker et al. (2025) and Smith et al. (2021) Include, Gohar and Cheng (2023) and Putri (2026) not yet screened.
[^12]: Grounded in [[30_assertions/sources-tie-algorithmic-decision-support-to-retained-professional-control]], Keddell (2019) Include, the placement-prediction study Exclude. Under the Research Vault contract the excluded Work supports no synthesis statement, so only Keddell (2019) carries the claim here.
[^13]: Grounded in [[30_assertions/beloch-and-martin-argue-ai-supported-counselling-needs-concepts-tailored-to-clients]], Work not yet screened.
[^14]: Grounded in [[30_assertions/persona-prompting-can-introduce-identity-congruent-bias]], Works not yet screened.
[^15]: Grounded in [[30_assertions/xiao-et-al-find-no-fair-prompting-strategy-effective-in-every-tested-scenario]], Work not yet screened.

## Sources

- Schulhoff, S., Ilie, M., Balepur, N., Kahadze, K., Liu, A., Si, C., et al. (2024). The Prompt Report: A systematic survey of prompting techniques. arXiv preprint, version 6 of 26 February 2025. https://doi.org/10.48550/arXiv.2406.06608
