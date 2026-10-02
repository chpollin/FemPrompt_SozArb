---
type: chapter
stage: draft
status: grounded
checked:
  validation: '2026-10-02'
assertions: []
posits: 5
research-questions:
  - SQ4
created: '2026-10-02'
updated: '2026-10-02'
---

# Conceptual grounding of gender and bias (SQ4)

SQ4 asks whether the literature defines gender and bias, which understanding of gender underlies it and on which theories it rests ([[project#Research questions]]). The question is answerable only from full texts, and codebook 1.4 gives it the four fields `AN_Gender_Definition`, `AN_Bias_Definition`, `AN_Gender_Understanding` and `AN_Theory_Reference` ([[update-protocol#Analysis coding]]). No Assertion with the research question SQ4 exists yet. This draft therefore rests only on the coded fields and on the located definition passages and theory references that the AI Agent Review of the coding runs of 2 October 2026 retained. All of these codings have the lifecycle state `ai-agent-reviewed`, and none has been verified by a domain expert. The chapter itself has the status `grounded`, which records a passed schema check and no review. A cell of a cross-tabulation counts Works in which two codes occur together and states no relation between them.

## Coverage on 2 October 2026

The SQ4 fields exist only in annotations coded under codebook 1.4 or 1.4.1. An annotation coded under 1.3 derives the state `not_collected`, which says nothing about the Work. The SQ4 denominator is therefore the set of included Works coded under codebook 1.4.1.

- The completion package records 154 Works with a recorded Include. Of these, 85 carry all four SQ4 fields, all coded under codebook 1.4.1 in the runs `codebook-v141-includes-*-20261002` (`generated/completion/field-states.csv`, track `all`, and `generated/completion/completion-package.json`, `works[].analysis_codebook_versions`).
- 19 included Works are `not_collected` because their analysis coding dates from codebook 1.3 and the partial recode of these Works is still open ([[plan#Analysis tool follow-ups]]). All 19 have a full text in the reading layer. They are listed under [Works not collected](#works-not-collected).
- 25 included Works carry no analysis coding because the agent tracks derived Unclear or Exclude against the human Include (`human_agent_decision_divergence`). They wait for a domain-expert decision ([[update-protocol#Coding run of 2 October 2026]]).
- 22 included Works are uncoded because no full text of the preferred Version is in the reading layer (`docs/data/fulltext/`), so the run did not assign them.
- 1 Work is under an integrity hold and 2 carry a stale source review (`generated/completion/field-states.csv`).
- Every cross-tabulation below counts 85 Works coded on both fields and 69 included Works open (`generated/completion/sq-association-tables.csv`, matrix `AN_Gender_Understanding x AN_Theory_Reference`, and own computation over the same records).
- All 85 codings have the lifecycle state `ai-agent-reviewed` and the decision authority of the human screening (`legacy_human`), and none carries an accepted AI correction or a domain-expert verification (`generated/completion/sq-analysis-tables.csv`, column `authority_breakdown`).

Two pairs of these Works are bound to byte-identical full texts. "Data Feminism for AI" stands as Klein et al. (2024) and as D'Ignazio et al. (2024), and "Intersectional analysis of visual generative AI" stands as Sharma et al. (2024) and Jääskeläinen et al. (2025), where the full text of both names Jääskeläinen, Sharma, Pallett and Åsberg as authors (`docs/data/fulltext/HLBXNWAZ.md` and `YLAKP7Z2.md`, line 5). Both pairs are coded identically on all four fields and inflate the counts of the critical understandings below. The counts state Works as registered, and the theory table adds the number of distinct texts.

## Answer in brief

The coded subset allows four statements. None of them describes the included corpus, for the reasons given under [Not determinable and absent](#not-determinable-and-absent).

1. Bias is defined more often than gender. 38 of 85 coded Works define bias explicitly and 44 only implicitly, whereas 12 define gender explicitly, 33 only implicitly and 9 treat gender without a recognisable understanding. 31 coded Works do not treat gender as an object at all.
2. An explicit definition of gender and a binary categorical understanding do not occur together in any coded Work. All 21 Works coded `Binary_Categorical` define gender only implicitly, and all 12 explicit definitions come with a social-constructivist, non-binary inclusive or intersectional understanding.
3. Of the 54 coded Works that treat gender, 30 carry at least one of the values `Social_Construct`, `Non_Binary_Inclusive` and `Intersectional`, and 15 carry `Binary_Categorical` alone. The critical understandings concentrate in conceptual, theoretical and review Works with feminist theory references, while the binary understanding is the most frequent code among experimental Works. That the two clusters reflect different research traditions is an inference of this draft.
4. 50 of 85 coded Works frame gender or bias with a named theory. Intersectionality is by far the most frequently named frame, ahead of feminist science and technology studies, other named feminist frames and justice frames, and 29 of the 50 Works name at least one frame labelled feminist, intersectional or queer. The other theory references come from anti-discrimination law, formal fairness definitions, theories of justice and power, cognitive psychology and technology acceptance.

## Definitions of gender and understanding of gender

The definition field has one value per Work. The understanding field allows several values per Work, so column sums exceed the denominator.

| `AN_Gender_Definition` | Works |
|---|---:|
| Explicit | 12 |
| Implicit_Only | 33 |
| Absent | 9 |
| Not_Applicable | 31 |

| `AN_Gender_Understanding` | Works |
|---|---:|
| Binary_Categorical | 21 |
| Social_Construct | 16 |
| Non_Binary_Inclusive | 14 |
| Intersectional | 19 |
| Unclear | 9 |
| Not_Applicable | 31 |

Both tables count 85 coded Works (`generated/completion/sq-analysis-tables.csv`, fields `AN_Gender_Definition` and `AN_Gender_Understanding`). The combinations per Work are Binary_Categorical alone 15, Binary_Categorical with Intersectional 6, all three critical values together 7, Social_Construct alone 6, Non_Binary_Inclusive alone 4, Intersectional alone 2, Social_Construct with Intersectional 2, Non_Binary_Inclusive with Intersectional 2, and Social_Construct with Non_Binary_Inclusive 1 (own computation over `works[].analysis_fields` in `generated/completion/completion-package.json`). Of the 7 Works with all three critical values, four belong to the two pairs of identical texts, so they stand for 5 distinct texts.

### Joint coding of definition and understanding

Works coded jointly on `AN_Gender_Definition` and `AN_Gender_Understanding`, 85 coded on both fields, 69 included Works open.

| Definition \ Understanding | Binary_Categorical | Social_Construct | Non_Binary_Inclusive | Intersectional | Unclear | Not_Applicable |
|---|---:|---:|---:|---:|---:|---:|
| Explicit | 0 | 10 | 8 | 8 | 0 | 0 |
| Implicit_Only | 21 | 6 | 6 | 11 | 0 | 0 |
| Absent | 0 | 0 | 0 | 0 | 9 | 0 |
| Not_Applicable | 0 | 0 | 0 | 0 | 0 | 31 |

The cells for Absent with Unclear and for Not_Applicable with Not_Applicable follow from the pairing rule of the codebook and carry no finding (`assessment/categories.yaml`, field `AN_Gender_Definition`). The zero cell for Explicit with Binary_Categorical is no pairing rule. Part of it is definitional, because `Binary_Categorical` describes two fixed categories that the Work does not examine, and an explicit determination of gender usually examines them. That the zero cell is therefore partly an artefact of the value definitions is an inference of this draft.

The explicit definitions take three forms in the located passages.

- A determination of gender as relational, non-essential or materialised in technology. Klein et al. (2024) state that "neither sex nor gender are essential, 'natural', or fixed properties" (`docs/data/fulltext/GP4JDSI8.md`, line 141). Browne et al. (2024) adopt Butler's argument that gender is "fundamentally a relational category" (`docs/data/fulltext/HJ7BHX8J.md`, line 57).
- A terminological determination that separates sex and gender and names genders beyond the binary. Tang et al. (2024) define gender as encompassing "a broader spectrum, including the array of identities beyond the male-female binary" (`docs/data/fulltext/9MDIBETZ.md`, line 120). Gaba et al. (2025) define men and women as cisgender and add non-binary and transgender participants as a third group (`docs/data/fulltext/G53MCF3W.md`, line 35).
- A footnote that fixes the terminology of the Work. Kong (2022) adopts the term gender/sex to cover gender, sex and their interactions (`docs/data/fulltext/Q4LK53XW.md`, line 53), and the visual generative AI study warns that the terms man and woman risk "reinforcing the binary gender norm" (`docs/data/fulltext/HLBXNWAZ.md`, line 48).

The binary understanding appears in experimental bias evaluations without a definition. Kaneko et al. (2024) state in their limitations that "the gender biases we considered in this paper cover only binary gender" (`docs/data/fulltext/CYZQ6XPK.md`, line 360), which the codebook anchors as Implicit_Only and Binary_Categorical. Among the 23 coded Works of study type Experimentell, 10 carry Binary_Categorical and 4 Non_Binary_Inclusive, whereas the 13 theoretical Works carry Binary_Categorical once (own computation, joint coding of `AN_Gender_Understanding` and `Studientyp`). The grounded Assertion [[30_assertions/bias-evaluations-name-binary-gender-operationalisation-as-limitation]], assigned to SQ2, records the same pattern for three further bias evaluations that name their binary operationalisation as a limitation. Its sources lie outside the 85 coded Works or carry no SQ4 coding, so it supports this observation only as a parallel.

## Definitions of bias

| `AN_Bias_Definition` | Works |
|---|---:|
| Explicit | 38 |
| Implicit_Only | 44 |
| Absent | 1 |
| Not_Applicable | 2 |

The table counts 85 coded Works (`generated/completion/sq-analysis-tables.csv`, field `AN_Bias_Definition`). 83 of the 85 coded Works treat bias as an object. That this reflects the identification strategy, which centred on bias and gender ([[analysis-methods#Answering the research questions]]), is an inference of this draft.

The explicit determinations differ in kind. The grouping below is a reading of this draft over the located passages and no coded field, so it carries no counts.

- Technical criteria and metrics, among them intersectional statistical parity in Zannone (2023) (`docs/data/fulltext/K6JQ7SVA.md`, line 129) and counterfactual fairness in Garg et al. (2019).
- Legal doctrine, among them disparate treatment and disparate impact in Salinas et al. (2025) (`docs/data/fulltext/YMABYPKF.md`, line 43) and the anti-discrimination ratio rule in Gohar et al. (2023).
- Structural and power-based determinations, among them social bias as "disparate treatment or outcomes between social groups that arise from historical and structural power asymmetries" in Gallegos et al. (2024) (`docs/data/fulltext/MS3CNU3S.md`, line 35), AI bias as a form of structural injustice in Lin et al. (2022) (`docs/data/fulltext/Y8J3HI9J.md`, line 11) and bias as the partial perspective of AI systems in Browne et al. (2024).
- Bias as prejudice or systematic error of persons or systems, among them the influence of caseworkers' personal beliefs and attitudes on decisions in Hall et al. (2024) (`docs/data/fulltext/8MDXCTA6.md`, line 164) and systematic and unfair behaviour of AI systems in Kattnig et al. (2024).

## Theory references

### Joint coding of bias definition and theory reference

Works coded jointly on `AN_Bias_Definition` and `AN_Theory_Reference`, 85 coded on both fields, 69 included Works open.

| Bias definition \ Theory reference | Yes | No |
|---|---:|---:|
| Explicit | 23 | 15 |
| Implicit_Only | 27 | 17 |
| Absent | 0 | 1 |
| Not_Applicable | 0 | 2 |

Works with an explicit and Works with an only implicit bias definition carry a theory reference in the same proportion, 23 of 38 and 27 of 44, both 0.61 when rounded (own computation over `generated/completion/completion-package.json`). An explicit definition of bias and a theoretical frame thus occur independently of each other in the coded subset.

The generated matrix of understanding by theory reference shows that all 16 Works coded Social_Construct and 17 of the 19 Works coded Intersectional carry a theory reference, while the 21 Works coded Binary_Categorical split into 10 with and 11 without (`generated/completion/sq-association-tables.csv`, matrix `AN_Gender_Understanding x AN_Theory_Reference`). All 9 Works coded Unclear carry a theory reference. Since their understanding of gender is not determinable, their theory presumably frames bias rather than gender, which is an inference of this draft.

### Named theories

The 50 Works with `AN_Theory_Reference` Yes carry 123 located theory references with 104 distinct theory names in the final coding of the AI Agent Review (`tests/review-cases/agent-runs/codebook-v141-includes-*-20261002/ai-agent-review.json`, `records[].final_coding.analysis_evidence.AN_Theory_Reference[].theory`). The names were normalised into theory families as follows.

- Each name was lower-cased and matched against a fixed list of patterns, one per family. The patterns cover English and German spellings, so "Intersektionalität" joins intersectionality.
- One name may join several families. "Intersectional technofeminism" counts for intersectionality and for feminist science and technology studies.
- A Work counts once per family, however many of its references fall into that family.
- A family is labelled feminist when its name contains feminist, intersectional or queer. Epistemic injustice, decolonial theory and critical race theory are counted separately, although parts of the literature place them in feminist thought.
- Names that matched no pattern stay as single frames.

| Theory family | Works | Distinct texts |
|---|---:|---:|
| Intersectionality, Black feminist thought and the matrix of domination | 21 | 19 |
| Feminist science and technology studies and technofeminism | 8 | 7 |
| Social justice and other justice frames (Rawls, Tyler, design justice, data justice) | 8 | 8 |
| Feminist theory, feminist policy analysis and other named feminist frames | 8 | 7 |
| Data feminism | 5 | 4 |
| Structural injustice and justice after Young | 5 | 5 |
| Decolonial theory and coloniality | 4 | 4 |
| Critical race theory and antiracist frameworks | 4 | 4 |
| Feminist standpoint theory and feminist epistemology | 3 | 3 |
| Epistemic, testimonial and hermeneutic injustice | 3 | 3 |
| Queer theory and heteronormativity | 3 | 3 |
| Formal fairness definitions (group, individual, counterfactual) | 3 | 3 |
| Feminist ethics and ethics of care | 3 | 3 |
| Theories of power (Foucault, Weber, socio-technical power) | 3 | 3 |
| Representational and allocational harms | 2 | 2 |
| Anti-discrimination law | 2 | 2 |
| Participatory and co-creative research traditions | 2 | 2 |
| Algorithmic reparation | 2 | 1 |
| Dual process theory | 2 | 2 |
| Technology acceptance and trust models | 1 | 1 |
| Hofstede's cultural dimensions | 1 | 1 |
| Inclusion and exclusion in systems theory and critical theory | 1 | 1 |
| Othering and structural discrimination | 1 | 1 |

The single frames are critical digital literacy (Hauck et al. 2025), critical legal studies (Ovalle et al. 2023), the digital divide (Studeny 2025), the framework of bias in computer systems by Friedman and Nissenbaum and positionality (Santy et al. 2023), hermeneutic reverse engineering (Shukla 2025), sociolinguistic research on stereotypes (Gallegos et al. 2024), stereotype threat (Shah 2025), tactical technical communication (Skilton et al. 2024) and technoliberalism (Toupin 2024).

29 of the 50 Works, or 27 of 48 distinct texts, name at least one feminist, intersectional or queer frame. Among these 29 Works, 15 carry Social_Construct, 15 Intersectional, 9 Non_Binary_Inclusive and 5 Binary_Categorical, so a feminist frame and a binary analysis meet in Zannone (2023), Shah (2025), Fraile-Rojas et al. (2025), Ahmed (2024) and Gohar et al. (2023). 15 of the 16 Works coded Social_Construct name such a frame. The Dual process theory family consists of the published and the extended version of Kamruzzaman et al. (2024), which stand as separate Works with different full texts ([[update-protocol#Coding run of 2 October 2026]]).

## Boundary questions flagged by the run

The two agent tracks differed before review on `AN_Gender_Understanding` in 12 of the 85 Works, on `AN_Gender_Definition` in 8, on `AN_Bias_Definition` in 5 and on `AN_Theory_Reference` in 4 (`records[].differences` of the AI Agent Review files). Agreement between two tracks on the same LLM is a workflow diagnostic and says nothing about accuracy. The review and the tracks flagged the following questions for the domain experts.

- The threshold of `Social_Construct`. Gallegos et al. (2024) were coded Social_Construct on the statement that "social groups are often socially constructed" (`docs/data/fulltext/MS3CNU3S.md`, line 132), a statement about social groups in general and not about gender alone. Shukla (2025) was resolved to Unclear against a track that read a sentence on societal definitions of race and gender as Social_Construct.
- The pair `Binary_Categorical` with `Intersectional`, which 6 Works carry. Gohar et al. (2023) compute bias scores "for a binary gender" (`docs/data/fulltext/VFD9ENG6.md`, line 217) while analysing subgroups such as Black females and Black males (line 417). The review notes for Salinas et al. (2025) that the authors claim no intersectional analysis although the field rule assigns Intersectional. For Shah (2025) and Fraile-Rojas et al. (2025) the review removed Intersectional against one track.
- The threshold of an explicit gender definition, for an adopted determination that names gender only as a power-produced social division beside race and class in Ovalle et al. (2023), for the phrase "gender as a narrow social construct" in Fraile-Rojas et al. (2025) and for a terminological footnote in Jääskeläinen et al. (2025).
- The line between a definition of power and a definition of bias. The review resolved Klein et al. (2024) and Jääskeläinen et al. (2025) to Implicit_Only and Vethman (2025) to Explicit through Young's determination of injustice, and flagged the consistency of these resolutions itself.
- The line between a framing theory and an ethical evaluation framework in Yu et al. (2025), the separation of `Gender` and `Sexual_Orientation_Identity` for trans and non-binary groups in Tang et al. (2024), and `Non_Binary_Inclusive` for a test criterion without an analytic category in Wudel et al. (2025).

The update protocol records these questions as open for rule revision after the spot check ([[update-protocol#Validation of the AI coding]]). Until then the counts of Social_Construct, Intersectional and the explicit definitions carry the uncertainty of these boundaries.

## Not determinable and absent

- The distribution in the 69 open included Works is not determinable. Every statement above describes the 85 coded Works.
- The open Works are not a random remainder. The titles of the 19 not collected Works include several that centre on gender, intersectionality or gender equality, among them Ulnicane (2024), Smith et al. (2021), the UNESCO and IRCAI study (2024), Franken et al., Wilson et al. (2024) and the DIVERSIFAIR toolkit (2024). Their coding could shift the shares of the critical understandings and of the feminist theory frames. This expectation rests on titles and is an inference of this draft.
- A Work coded `Not_Applicable` for gender does not treat gender as an object in the coded reading. This is a statement about the Work, not about the literature.
- No absence in the literature can be stated. That no coded Work combines an explicit gender definition with a binary categorical understanding is an observation about the coded subset.

## What is needed to complete the answer

1. The partial recode of the 19 Works coded under codebook 1.3, which needs the packet and merge contract with `supersedes` ([[plan#Analysis tool follow-ups]]).
2. Full texts of the preferred Version for the 22 uncoded included Works, with source binding, so that they can enter a coding run.
3. Domain-expert decisions on the 25 Works with divergent human and agent decisions, and the resolution of the integrity hold and of the 2 stale source reviews.
4. Resolution of the Work identities that affect the counts, the two pairs bound to identical texts (`GP4JDSI8` and `D2EGAVKZ`, `HLBXNWAZ` and `YLAKP7Z2`, where the metadata of `HLBXNWAZ` names other authors than its text), the two versions of Kamruzzaman et al. (2024) and the two Works titled "Intersectionality in artificial intelligence" (`WS4KQPWN` and the Work of `2EBHMYU4`), which may be one Work.
5. The rule revision for the boundary questions above, then the domain-expert spot check of the runs, which covers the four SQ4 fields and every flagged Work.
6. SQ4 Assertions grounded in distillates, for instance on the forms of explicit gender definition, on the binary operationalisation of experimental bias evaluations and on intersectionality as the dominant frame. Only 7 of the 85 coded Works have an active distillate, so this needs distillation first (`generated/completion/completion-package.json`, `knowledge_coverage.active.documents`, and [[research-vault#Assertions]]).
7. AI Agent Review and domain-expert verification of those Assertions and of this chapter.

## Works not collected

The following 19 included Works carry analysis coding under codebook 1.3 and therefore no SQ4 fields (`generated/completion/field-states.csv`, `not_collected_work_ids`).

- Kong et al. (2021), "Evaluation of an artificial intelligence literacy course for university students"
- Ricaurte Quijano et al. (2024), "Towards Substantive Equality in Artificial Intelligence"
- Hodgson et al. (2022), "Problematising artificial intelligence in social work education"
- Kabra et al. (2025), "Reasoning towards fairness"
- Ulnicane (2024), "Intersectionality in Artificial Intelligence: Framing Concerns and Recommendations for Action"
- Smith et al. (2021), "When Good Algorithms Go Sexist"
- "Research on the application risks and countermeasures of ChatGPT generative artificial intelligence in social work", without author metadata in the corpus
- UNESCO and IRCAI (2024), "Challenging systematic prejudices: an Investigation into Gender Bias in Large Language Models"
- Navigli et al. (2023), "Biases in large language models: Origins, inventory and discussion"
- Jarrahi et al. (2021), "Algorithmic management in a work context"
- Wilson et al. (2024), "Gender, Race, and Intersectional Bias in Resume Screening via Language Model Retrieval"
- Keddell (2019), "Algorithmic justice in child protection"
- Washington (2025), "Fragile Foundations: Hidden Risks of Generative AI"
- DIVERSIFAIR Project (2024), "AI & Intersectionality: A Toolkit For Fairness & Inclusion"
- Franken et al., "Gender und KI-Anwendungen", without a year in the corpus
- Gengler et al. (2024), "Faires KIPrompting – Ein Leitfaden für Unternehmen"
- Chatterji et al. (2025), "How People Use ChatGPT"
- Li et al. (2023), "Ethics & AI: A systematic review on ethical concerns and related strategies"
- Linnemann et al. (2023), "Bedeutung von Künstlicher Intelligenz in der Sozialen Arbeit"

The German practice guide by Gengler et al. (2024) may stand twice in the corpus. A Work with the record `YN9JAREI` and the title "Faires KI-Prompting – Ein Leitfaden für Unternehmen" is among the 85 coded Works, while the Work `4KMMPA6A` with the variant title above is not collected. The identity of the two rests on the titles and is unchecked.
