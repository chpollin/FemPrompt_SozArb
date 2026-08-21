---
title: "SQ Analysis, Advisory LLM Track (TP4)"
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: active
language: en
version: "0.3"
created: 2026-07-21
updated: 2026-07-21
authors: [Christopher Pollin]
generated-with: Claude Code
related: ["[[update-protocol]]", "[[plan]]", "[[methods]]", "[[analysis-divergence]]"]
---

This document is the advisory LLM track of the TP4 analysis ([[plan]], Decided questions, Analysis fields, the coding-setup row that pairs a single human coder with an advisory LLM track). It was produced by LLM workflow agents without human review. The binding track is the human pilot coding and the round-2 human coding of the same frozen field set; this advisory track anticipates their result and does not stand in for it. Nothing stated here is a licensed paper claim until a human reviewer confirms it. The figures live in the committed JSON artifacts under `generated/analysis-advisory/` (`manifest.json`, `sq_extraction.json`, `aggregates.json`, `syntheses_critique.json`), and this document references those keys rather than restating the numbers in prose.

## 1. Method chain

The advisory track ran as a fixed sequence over the human-included corpus.

- Scoping. `src/analysis/build_advisory_manifest.py` maps the human Include decisions to distilled knowledge documents; the mapping and its counts are in `manifest.json > counts`, the per-paper records in `manifest.json > papers`.
- Coding basis. The coding read section-filtered distilled knowledge documents, not raw full texts. Every paper carries `AN_Coding_Basis = Knowledge_Doc` (`sq_extraction.json`, per-paper field; `aggregates.json > provenance.coding_basis`).
- Per-paper coding. Each included paper was coded against the frozen field set and the closed vocabularies of [[update-protocol]] section B (`AN_Prompt_Techniques`, `AN_Bias_Axes`, `AN_Harm_Types`, `AN_Mitigation_Stage`, `AN_Mitigation_Status`, `AN_Population`, plus the reused `Studientyp`), with verbatim evidence snippets and answerability notes per field (`sq_extraction.json > papers`).
- Aggregation. Deterministic counting produced the frequency, co-occurrence, and answerability tables (`aggregates.json`). No significance testing; the tables are descriptive, per [[update-protocol]] section E.
- Synthesis. Three per-SQ syntheses turn the tables into candidate claims with strength ratings, gaps, and interpretive questions (`syntheses_critique.json > syntheses`).
- Critique. One adversarial pass re-checks every candidate claim against the underlying records and issues a verdict (`syntheses_critique.json > critique`).

Three coverage gaps are named rather than hidden.

- Human includes without a distilled document. A set of human-included papers carries no distilled document and is therefore absent from the coding; the papers are enumerated in `manifest.json > unmapped_includes` and counted in `manifest.json > counts.unmapped_includes`. Any technique, axis, or harm that appears only in those papers is invisible to this inventory.
- The distillate framing. The coding read German LLM-generated summaries, so every code and every effect-size figure is one distillation and one translation removed from the source paper. This is the P2 limitation stated in the task brief and flagged across the critique's general findings (`syntheses_critique.json > critique.general_findings`).
- Shared distillates under duplicate titles. The corpus carries duplicate entries, and the duplicate-title mapping attaches some distilled documents to two Zotero keys each, so the coded records rest on slightly fewer distinct distillates than papers; the affected entries are identifiable in `manifest.json > papers` via `mapped_via = duplicate_title`, and a few of those rows resolve a key to a sibling edition's distillate. Codes shared across such a pair enter the frequency denominators twice, and the mapping of those rows needs a human spot-check before the counts enter any licensed use.

## 2. Answerability for the human pilot

This section feeds TP4 step 3, the pilot that tests whether the fields are answerable from the served texts before the schema freeze ([[update-protocol]] section E; [[plan]] TP4). The advisory coder recorded, per field, whether a code was grounded in the text or flagged as ambiguous. The figures are in `aggregates.json > answerability`; the qualitative reading follows.

No field was ever coded not_codable. Every field reached a decision from knowledge-document input, which supports the design assumption that the frozen field set is answerable at the distillation level. Ambiguity was uneven across fields. Bias axes and harm types drew the most ambiguity flags; techniques drew the fewest, with status, populations, and stages in between. The concentration is substantive rather than incidental. Axis attribution is hard because a paper often mentions a demographic descriptor without analysing bias along it, which the coding rule ([[update-protocol]] section C) tells the coder to exclude. Harm-type matching is hard because it runs against the Gallegos definitions, the field [[update-protocol]] section B keeps optional as the hardest to code reliably.

For the pilot this suggests two priorities. The field set can be carried into the human pilot as answerable from knowledge-document input. The definitional work should concentrate on axis attribution and on harm-type matching, where the human coders are most likely to diverge and where the double-coded overlap sample ([[plan]] Decided questions, coding-setup row) will earn its cost.

## 3. Candidate claims per SQ

Each claim below is quoted to its one-sentence core from `syntheses_critique.json > syntheses`; the full text, evidence notes, and support keys stay in that file under the matching `SQ*.claims` entry. Each carries its strength rating and the adversarial verdict from `syntheses_critique.json > critique.verdicts`. The critique issued twenty-nine verdicts, twenty-six holds and three downgrades; the three downgrades are marked DOWNGRADE and carry the reason.

### SQ1, technique inventory and its evidence

- "Two-thirds of the corpus engages no prompting technique at all: 87 of 129 papers are coded T=None." (strong; DOWNGRADE). The count is verified exactly. The critique downgrades the surrounding move from a convenience sample assembled by four Deep Research systems to a claim about "the field's centre of gravity"; the descriptive count carries, the field-level generalization over-extends.
- "Where a technique is coded, an unnamed catch-all dominates and the named prompt-engineering taxonomy reaches the literature only as a thin front end." (strong; holds).
- "The named techniques cluster in experimental and empirical benchmark studies and mark the one corner of the corpus where mitigation is actually evaluated rather than merely proposed." (strong; holds).
- "The evaluated prompt-technique evidence sits almost entirely outside social work." (strong; holds).
- "The evaluated techniques target primarily single-axis gender and race stereotyping (with some representational erasure) and barely touch the intersectional, disability, socioeconomic and sexual-orientation harms the wider corpus foregrounds." (strong; holds).
- "Reported effectiveness is real but heterogeneous and internally contested." (moderate; DOWNGRADE). The individual effect sizes verify from the per-paper status evidence. The critique downgrades because the 87.7% ceiling is misattributed to a primary experiment when its source is a Literaturreview synthesizing others' studies, and every figure is read from a German distillate.
- "The Self_Criticism sub-cluster is the most coherent evaluated evidence: all five papers are coded Evaluated and converge on self-debiasing / self-critique loops that need no model access." (moderate; holds).
- "The General_Guidance code conflates two distinct things and should be split before it enters the paper: generic 'prompting literacy' mentions in AI-literacy/education papers (proposed, never evaluated) versus concrete but unnamed prompt manipulations that were actually evaluated for bias reduction." (moderate; holds).
- "Several technique codings are training-side prompt methods, not use-time prompt practice, so the technique inventory partly overstates what a practitioner can do at the prompt." (moderate; holds).

### SQ2, bias-to-mitigation mapping

- "The corpus addresses bias along two dominant axes, Gender (88 of 129) and Race/Ethnicity (80), with every other axis trailing far behind (Intersectional 42, Socioeconomic 33, Disability 27, Sexual_Orientation 26, Age 25, Language_Culture 21)." (strong; holds).
- "The corpus frames GenAI bias primarily as a representational-harm problem rather than an allocative one." (strong; DOWNGRADE). The harm frequencies verify and Stereotyping is genuinely the single top harm. The critique downgrades the "rather than allocative" sharpening, because the allocative and performance harms together form a substantial mass that SQ3 identifies as the social-work-central ones.
- "Proposed mitigation sits overwhelmingly at the Organisational_Process stage (80 of 129 papers), covering guidelines, AI-literacy training, governance, and oversight, and this stage is overwhelmingly Proposed rather than tested (Organisational_Process: Proposed 61, Demonstrated 11, Evaluated only 8)." (strong; holds).
- "The evidence gradient runs opposite to the attention gradient." (strong; holds).
- "Where mitigation is actually evaluated as a technical intervention, it targets chiefly Stereotyping on Gender and Race at the Prompt_Practice stage." (strong; holds).
- "Socioeconomic bias appears in the corpus almost exclusively as Indirect_Discrimination through proxy variables (15 of 33 socioeconomic papers carry Indirect_Discrimination, only 1 Direct), and it is addressed only by proposed organisational mitigation." (strong; holds).
- "Intersectional analysis, the framework's central commitment, is coded on 42 papers but sits overwhelmingly at Organisational_Process (30) and Proposed status, and reaches Prompt_Practice only 4 times and In_Training twice." (moderate; holds).
- "Every discrete prompting-technique group (ICL, Thought_Generation, Role_Persona, Self_Criticism, Ensembling, Decomposition) is coded almost exclusively Not_SW_Specific in the techniques_by_populations table; only the diffuse General_Guidance code reaches a social-work-adjacent population (Education_Professional 13)." (strong; holds).
- "A substantial part of what the corpus offers as mitigation is generic AI-literacy and governance carried by papers that name no bias axis (axis None on 21 papers) and no harm mechanism (harm None on 22), almost all at Organisational_Process, Proposed, in Education_Professional settings." (moderate; holds).
- "Model-side stages (In_Training, Intra_Processing, Post_Processing) are the domain of experimental evaluation rather than proposal (In_Training Evaluated 10 vs Proposed 3; Intra_Processing 2 of 2 Evaluated), and they originate in the general NLP debiasing literature (prompt-tuning, self-debiasing, embedding interventions, benchmark auditing)." (strong; holds).
- "Disability, Age, Language_Culture, and Sexual_Orientation are addressed mainly at organisational-proposed level and are largely absent from evaluated technical mitigation." (moderate; holds).
- "The corpus contains essentially one social-work-domain evaluated fairness intervention, a true-positive-rate audit of child-welfare predictive models by race and gender (XQM6WRU2, Post_Processing, Evaluated, Child_Family_Welfare), against Disparate_Performance and Indirect_Discrimination." (moderate; holds).

### SQ3, domain-specific constraints and gaps

- "No concrete, evaluated prompting technique appears in any genuine social-work practice field." (strong; holds).
- "The evaluated prompt techniques and the SW practice-field evidence target different harms." (strong; holds).
- "The bias axis most central to SW clientele, socioeconomic status and poverty-as-proxy, sits almost entirely in no-technique conceptual papers." (strong; holds).
- "Across all SW practice-field papers, mitigation status is overwhelmingly Proposed." (strong; holds).
- "SW states adaptation requirements that general prompting guidance does not cover." (moderate; holds).
- "Poverty and structural attributes acting as proxies for protected characteristics in statutory risk models is a SW-specific harm mechanism absent from the general guidance, and it is the SW theme with the most empirical (not merely conceptual) backing." (moderate; holds).
- "Health_Care and Mental_Health are the thinnest SW-adjacent fields." (moderate; holds).
- "SW's relational and involuntary-client dimension (the client who cannot exit the service and whose closeness to the technology raises rejection) is stated as a design constraint but has no operationalization in any prompt-mitigation study." (thin; holds).

## 4. The SQ3 gap map

The SQ3 gaps are the conceptual feed for the Fair Bench preparation ([[plan]] Decided questions, row 1; [[update-protocol]] section A, SQ3). They are listed from `syntheses_critique.json > syntheses.SQ3.gaps`, with the overlapping SQ1 and SQ2 gaps appended. Each basis names the aggregate key it rests on rather than restating the figure.

- Technique-transfer gap. Evaluated prompt-level bias mitigation exists only in non-SW benchmark settings. Basis: `aggregates.json > cooccurrence.techniques_by_populations`, the named-technique rows carrying only Not_SW_Specific and single Education_Professional cells.
- Harm-type mismatch. The harm the evaluated techniques reduce (representational Stereotyping) is not the harm the SW practice-field papers document (allocative Indirect_Discrimination and subgroup Disparate_Performance in predictive risk models). Basis: per-paper harm codes in `sq_extraction.json`, cross-read with `aggregates.json > cooccurrence.axes_by_harms`.
- Axis gap. Socioeconomic status and poverty-as-proxy, the axis most central to SW clientele, is confined to no-technique conceptual papers. Basis: `aggregates.json > cooccurrence.techniques_by_axes`, the None-by-Socioeconomic cell against the Socioeconomic total.
- Status gap. SW-specific requirements are almost entirely Proposed; no study evaluates whether a mitigation reduces bias in a SW practice setting. Basis: `aggregates.json > cooccurrence.stages_by_status`, the Organisational_Process row.
- Field-coverage gap. Within the scheme, Child_Family_Welfare, Mental_Health, Social_Assistance_Admin, and Health_Care carry no technique-level evidence; beyond it, whole practice fields (disability services, elderly care, addiction, homelessness, migration and refugee work, probation, domestic-violence shelters) have no population bucket, so their absence cannot be told apart from a scheme limitation. Basis: `aggregates.json > frequencies.populations` and the closed `AN_Population` list in [[update-protocol]] section B.
- Substrate gap for Fair Bench. SW's dominant AI harm lives in predictive analytics, the risk models a caseworker does not prompt, while the promptable-LLM evidence lives in generative tasks; a benchmark built on generative stereotyping sets would not instrument the allocative decision the SW literature worries about. Basis: SW-field harm and stage codes against the technique papers' Prompt_Practice, generative-task codes.

Overlapping gaps from the other sub-questions:

- Intersectional-mitigation gap (SQ1). Intersectional harm and prompt-technique mitigation almost never co-occur, although intersectionality is the corpus's third-most-coded axis. Basis: `aggregates.json > cooccurrence.techniques_by_axes`, the Intersectional cells against the Intersectional axis total.
- Scope-boundary caveat (SQ2). The absent socioeconomic intervention may be a boundary of this review's scope, which centres feminist AI literacies and prompting, rather than a field-level gap, because corrective methods for allocative bias live largely in the FairML and automated-decision-making literature this corpus samples thinly. Basis: `syntheses_critique.json > syntheses.SQ2.gaps`, the socioeconomic-scope entry.

## 5. Recommended structure for paper section 6

The three per-SQ `section6_outline` lists in `syntheses_critique.json` are merged here into one coherent outline for section 6 of the follow-up paper. This is a drafting frame, not licensed section text.

1. Framing and epistemic status. Define technique against the standard prompt-engineering taxonomy, state how the two boundary codes work (None for no technique, General_Guidance for unnamed prompting), and name the advisory, unreviewed, distillation-inherited status up front.
2. The bias landscape the corpus addresses. Axis concentration on Gender and Race with a thin tail, harm concentration on Stereotyping, with the substantial allocative and performance mass flagged as the counterweight.
3. Reach of the prompt repertoire. Most of the corpus is silent on technique; of the rest an unnamed bucket dominates and the named taxonomy reaches the literature only as a thin front end, with the compositional and agentic end absent.
4. The evidence gradient. A technique-by-Studientyp-by-status reading showing Prompt_Practice as the one evaluated corner against the proposal-heavy organisational mass, stated as the inversion in which the most-recommended stage is the least tested.
5. What the evaluated evidence covers and misses. Single-axis gender and race stereotyping set against the corpus's intersectional and allocative focus; an honest, non-poolable reading of the effect sizes; the Self_Criticism cluster as the cleanest evaluated family with its single-axis, non-SW scope flagged.
6. The population disconnect and what social work requires beyond general guidance. Evaluated mitigation severed from SW populations, with the child-welfare audit (XQM6WRU2) as the near-unique domain exception, and the adaptation-statement themes grouped as decision-support rather than replacement, poverty-as-proxy in statutory risk models, professional and research-ethics expansion for vulnerable and involuntary clients, participatory co-design and data sovereignty, and the political mandate for digital justice.
7. The zero-cell gap map. Technique-by-population zeros, the socioeconomic-axis concentration, the harm mismatch, and the Proposed-not-Evaluated status gap, presented as a compact descriptive table with the descriptive-only caveat.
8. Implication for Fair Bench. The substrate and harm-type mismatch, and a specification of what a SW-grounded benchmark must instrument, allocative proxy discrimination on involuntary clients, that existing benchmarks (StereoSet, BBQ, WinoMT, resume-screening) do not.
9. Limitations conditioning every claim above. Advisory unreviewed coding, the optional and hardest harm field, the distillation framing (P2), the missing harm-by-stage and harm-by-status tabulation reconstructed from per-paper codes, the absent distilled documents possibly concentrated in the thin fields, and the Education_Professional routing rule that may mask SW-field signal.

## 6. What this document licenses and what it does not

This document licenses drafting work and preparation. It licenses the drafting of the section-6 frames of the follow-up paper, the sharpening of the expert questions in `paper/expert-questions.md`, and the setting of pilot priorities for the analysis-field coding.

It licenses no paper claim, no figure, and no abstract headline. Every candidate claim in section 3 is a candidate for human confirmation, including the twenty-six that the adversarial pass rated holds; a hold is an internal-consistency check against the coded records, not a licence.

The path to licensing runs through the binding tracks. A candidate claim becomes citable once the human pilot coding and the round-2 human coding of the same field set confirm it, at which point the confirmed figure is read from the committed data and the claim enters the paper under the project's normal claims discipline.
