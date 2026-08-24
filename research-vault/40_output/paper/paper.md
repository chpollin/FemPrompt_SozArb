---
title: "An LLM- and Agent-Assisted Workflow for Qualitative Literature Review: Generative AI, Gender, and Bias in Social Work"
type: chapter
stage: working
status: grounded
checked: {}
assertions: []
posits: 0
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
manuscript_status: draft
language: en
version: "0.7"
created: 2026-06-09
updated: 2026-08-24
authors: [Christopher Pollin, Susanne Sackl-Sharif, Sabine Klinger] # [OPEN: author set and order, three named here vs. four on the Evidence Companion; co-author decision]
generated-with: Claude Code
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
related: [update-protocol, plan, research-vault]
---

**Canonical manuscript draft.** This is the single current paper text in the Grounded Vault output. The qualitative synthesis along SQ1 to SQ3 will be inserted after full-corpus analysis and domain-expert verification. Methodological claims will acquire Assertion links as their project sources are ingested. Unfilled passages remain marked `[PENDING: ...]`. Author order and the working title still require co-author approval.

# An LLM- and Agent-Assisted Workflow for Qualitative Literature Review: Generative AI, Gender, and Bias in Social Work

**Working title.** The title names both LLM assistance and agentic execution. The domain clause identifies the review case. Co-author approval remains open.

## Abstract

Generative AI affects social work practice and the research processes used to appraise its risks. This paper examines how LLMs and AI agents can support a qualitative literature review while every AI-assisted contribution remains attributable, evidence-linked, and subject to final scholarly authority. The case concerns generative AI, gender, and bias in social work. Round one combined identification through four commercial deep-research systems and manual searches with a comparative expert and LLM assessment under one ten-category scheme. Its retrospective PRISMA 2020 and PRISMA-trAIce rendering preserves the surviving record and identifies gaps that cannot be reconstructed. Round two uses versioned deep-research runs, curated Zotero metadata, publication-version reconciliation, full texts converted to reviewed Markdown, two operationally isolated AI-agent screening tracks, and a separate source-grounded AI Agent Review. PRISM records immutable annotation versions, deterministic checks, exact Work-Version evidence, actors, activities, and lifecycle transitions in a canonical JSON structure. Domain experts verify the prepared corpus at the end, and publication approval remains a separate transition. The Grounded Vault derives distilled knowledge documents and Assertions from the included full texts for subsequent quantitative and qualitative analysis. The completed governed implementation runs have reached the `ai-agent-reviewed` state. They have no domain-expert verification or public approval. [PENDING: synthesis result along SQ1 to SQ3 after full-corpus analysis and domain-expert verification.] The contribution is an implemented and testable workflow for agent-assisted review whose authority states and evidence paths remain explicit.

## 1. Introduction

Social work is a field in which the stakes of algorithmic bias are concrete. Decisions touch child protection, mental health, and welfare administration, and the people affected are disproportionately those whom training-data biases misrepresent. As generative AI enters professional practice, practitioners and educators need to know what the research literature actually offers them, the prompting practices discussed for this field, the bias dimensions analysed, the mitigations with evidence behind them, and the places where the literature is silent. This review set out to answer that question for the intersection of generative AI, gender, bias, and social work, with feminist AI literacies, diversity- and power-sensitive, intersectional, bias-aware competencies in the use of generative AI, as its conceptual frame.

Round one began with a comparative design. Every paper was assessed once in a consolidated expert annotation and once by a batch LLM assessment, with both records preserved separately. This allowed the project to examine how a language model applies contested categories such as fairness and gender. Round one ran before the PRISMA-trAIce checklist (Holst et al. 2025) and the RAISE position statement (Flemyng et al. 2025). Its retrospective rendering identifies which items can be reconstructed from the retained data and which remain gaps. The absent pre-registered protocol is the clearest gap. Round two extends this record into an agent-assisted completion and verification workflow.

The paper asks how LLMs and AI agents can be integrated into a qualitative literature review with traceable contributions, re-executable processing, and final scholarly authority assigned to domain experts. We answer through a documented case with published software and method artifacts. The intended readers are researchers in social work and adjacent human services who plan reviews with LLM assistance. PRISM is the principal artifact. Its data model derives reporting and disclosure artifacts from the recorded session and now governs provenance, verification, and public release. The decomposed round-one expert and LLM divergence demonstrates what such a record makes analysable without serving as a model-quality claim. The review will produce a qualitative synthesis along three sub-questions. They cover the prompting techniques and their evidence (SQ1), the mapping of bias axes to proposed and tested mitigations (SQ2), and the domain-specific constraints and gaps absent from general-purpose prompt-engineering guidance (SQ3). [PENDING: one-sentence preview of the synthesis after coding.]

## 2. Background

Following Zhao et al. (2026), this paper uses LLM for a pretrained language model whose scale supports broad language-processing capabilities. AI agent denotes a modular, LLM-enabled system that performs a bounded task through reasoning and tool use (Sapkota et al. 2025). The term applies here to the Codex reviewers assigned to defined screening and source-review tasks. Epistemic independence and self-governing research agency are outside this claim.

Two strands of work frame this review. The first is the emerging literature on AI in social work and on feminist and intersectional perspectives on generative AI. Scoping work on AI in social work practice shows the literature concentrating in child protection and child welfare, with health care, homelessness and youth services, social assistance, and mental health also represented (Gardiner et al. 2026). The feminist AI literacies frame, developed in the project this review belongs to, names the competencies practice needs, diversity- and power-sensitive prompting, critical output assessment, and context sensitivity (Klinger et al. 2026). What has been missing is a systematic picture of whether and how the research literature supports those competencies with concrete, evaluable techniques.

The second strand is reporting standards for AI-assisted evidence synthesis, which exist as fresh proposals rather than settled norms. PRISMA-trAIce (Holst et al. 2025, JMIR AI) extends PRISMA 2020 with items for AI involvement, graded mandatory to optional, including an adapted flow diagram that separates records screened by AI systems from records screened by humans (trAIce item R1); it presents itself as a foundational proposal without a formal consensus process. RAISE (Flemyng et al. 2025), co-published across Cochrane, Campbell, JBI, and CEE, states mandatory reporting elements for responsible AI use in evidence synthesis, among them system names, versions, dates, purpose, methodological justification, validation evidence, limitations, and interests. Established screening platforms already record AI decisions as separate, reviewer-attributed records next to binding human decisions, EPPI-Reviewer, Nested Knowledge, and DistillerSR among them, so that design is prior art, and the paper claims no novelty for it; what no surveyed tool does, to our knowledge as of June 2026, is emit the trAIce flow artifact or generate the disclosure section from session data.

The three platforms named above characterize this practice concretely. EPPI-Reviewer attributes LLM coding to a robot reviewer discriminable from human coding and offers a comparison mode against a human gold standard. The Nested Knowledge Robot Screener runs AI as one reviewer within dual screening, persisting its decisions as reviewer-level records under binding human adjudication. DistillerSR runs a classifier as an automated second reviewer with a per-reviewer audit trail.

Adjacent tools cover parts of the design. Covidence documents one automated exclusion step in its auto-updated PRISMA flow and provides static RAISE-aligned reporting templates. Elicit claims a dual-review data model whose persistence is undocumented. Rayyan, ASReview, SWIFT-Active Screener, Abstrackr, and RobotAnalyst offer prioritization or advisory display without persisting an AI decision record. The nearest software by name is the varlet99/prisma-traice-review-tool prototype, the only artifact found invoking PRISMA-trAIce by name, created in April 2026 and, as of June 2026, at an early stage with undocumented properties. On the methodological side, AIscreenR (Vembye et al.) benchmarks a GPT model as a second screener, and the AITDI meta-research protocol assesses the transparency of published AI-assisted reviews retrospectively, a stance adjacent to rendering one's own review as a conformant artifact.

Our review became, in part, a working test of what these proposals demand from a review that was already under way when they appeared.

## 3. Methods

### 3.1 Design overview

The review has two rounds. Round one used a comparative expert and LLM assessment and remains a distinct methodological phase. Round two updates the literature and completes the new material through an agent-assisted workflow. Its searches ran from 17 July 2026 under a versioned protocol and a dated amendment record. The repository claims prospective status only for rules fixed before the operation they governed. Governed implementation runs have completed agent annotation and source-grounded AI Agent Review. Screening of the complete round-two set, domain-expert verification, and publication approval remain open. This separation makes the achieved authority of every record visible.

### 3.2 Identification

Round one identification ran a shared, expert-developed prompt template through four commercial deep-research systems, ChatGPT, Claude, Gemini, and Perplexity. Manual searches in scientific databases supplemented the results. The outputs were converted to RIS with LLM assistance and imported into Zotero. Source attribution survives per record, while the exact executed prompt instances and RIS conversion cannot be reconstructed completely.

Round two repeated the identification process with versioned prompts and run logs. It added a context-informed Codex search and a deeper 2026-only Codex expansion through separately recorded lanes for social-work applications, feminist and inequality research, and prompt-based bias mitigation. Each executed lane retains its prompt scope, date, raw findings, source evidence, and candidate relations. Zotero is the curated metadata layer for both rounds. Domain researchers used its duplicate tools, reviewed imported records, corrected metadata, and attached the available PDFs. The newly identified 2026 package remains prepared for Zotero import and curated re-export.

Source preparation begins only from access states supported by the source audit. Available PDFs are converted to Markdown with Docling and pass deterministic structural checks followed by direct AI-agent comparison against the source. An automatic pass does not grant source readiness. Material omissions produce a separate repaired representation whose changes and verification evidence remain recorded. Where the source depends on images that the current PRISM evidence object cannot retain with stable locators, the representation remains blocked. Full repository HTML can serve as a Paper representation when its exact publication Version, extraction method, source hash, and direct source comparison are recorded.

Bibliographic reconciliation distinguishes the scholarly Work from the publication Version used as evidence. One stable project Work ID groups Preprints, Accepted Manuscripts, proofs, Versions of Record, corrected Versions, and duplicate Zotero records that represent the same contribution. Every known expression retains its own Version ID, version-specific title and authors where they differ, identifiers, date, access and integrity status, provenance, and relations. Publication stage and peer-review status are recorded separately. The workflow selects a preferred available Version for screening and also preserves the chronologically latest Version. A locally acquired Preprint or Accepted Manuscript retains that status even when the Work has a bibliographically preferred journal record. Screening coverage is counted once per Work; full-text conversion, evidence, distillation, and Assertions retain the exact Version read.

### 3.3 Eligibility and category scheme

Round one's expert and LLM tracks used the same ten binary categories, four technical categories and six social categories. A Paper entered the analysis corpus when at least one technical and one social category applied. Round two retains these eligibility dimensions and records each category on the three levels `nein`, `teilweise`, and `ja`. Its three-way derivation yields Include, Unclear, or Exclude. The current schema is versioned in the repository (`categories.yaml` v1.3) and adds controlled analysis fields while preserving the eligibility dimensions. Exclusions carry a reason from a documented list; the per-decision reason field supports the decomposition in section 5.2.

### 3.4 Round-one comparative screening

Round one used two separately recorded assessment tracks so their convergence and divergence could be analysed. The consolidated expert annotation and the LLM assessment applied the same criteria without access to each other's judgements during execution. The separation describes the operation of this round. It does not support a general claim of epistemic independence for language models.

The domain experts recorded category judgements and decisions in a shared spreadsheet with access to metadata, abstracts, and full texts. The resulting file is a consolidated expert annotation without per-decision reviewer attribution. Inter-expert agreement therefore cannot be computed for round one. A batch LLM assessment judged title and abstract under the same ten categories and recorded a derived decision and justification for each paper. A supplementary experiment varied model and input between title plus abstract and distilled knowledge documents. The knowledge-document condition is mixed because only part of the corpus had such a document. Expert and LLM records remain sibling data fields. The expert annotation supplies the round-one corpus decision.

### 3.5 Round-two agent screening and verification

Round two assigns the high-volume screening work to AI agents. Two tracks receive the same Work and exact Paper Version in separate Codex contexts under distinct reviewer identities and output paths. Each source-grounded coding packet is validated and projected through PRISM's production validation, import, record-requirement, and serialization functions. This operational isolation limits direct cross-track contamination and preserves the conditions of each execution. A separate AI-agent activity performs source-grounded AI Agent Review over both annotations and the assigned Paper Version. The productive record embeds actors, activities, prompt and model references, Work-Version sources, derived artifacts, and ordered lifecycle events.

The lifecycle is `identified → curated → agent-annotated → ai-agent-reviewed → verified → publication-approved`. Deterministic validation checks structural requirements, allowed transitions, and the hash of the exact annotation under review; its receipts do not change lifecycle authority. AI-agent activities can reach `ai-agent-reviewed`. A domain expert then records `accepted`, `corrected_and_accepted`, `changes_requested`, or `rejected`. Acceptance and corrected acceptance establish `verified`; the other outcomes remain at `ai-agent-reviewed`. A correction creates a complete superseding annotation with a field-level difference record while preserving the agent annotation. Publication approval requires a separate person-attributed event. Re-execution adds new provenance records and leaves earlier annotation versions intact.

### 3.6 Analysis coding

The synthesis along SQ1 to SQ3 rests on per-paper analysis fields coded over the included corpus: prompting technique families (vocabulary from The Prompt Report taxonomy, Schulhoff et al. 2025), bias axes, harm types (Gallegos et al. 2024, optional field), mitigation stage (Gallegos et al. 2024, extended by two practice-side codes) and status, population and practice field, and the coding text basis as an audit field. Coding follows written instructions with closed vocabularies, a never-empty rule, and import-time validation; the full design, including the staged retro-coding of round one includes, is committed in the repository (`knowledge/update-protocol.md`). The field decisions are fixed project decisions (`knowledge/plan.md`). [PENDING: coding execution; all synthesis numbers in section 5.3 and 5.4 follow from it by committed script.]

### 3.7 Instrument and record generation

PRISM is a static web tool over the review data. It supports direct screening, isolated AI-agent capture, and a verification mode for domain experts. Its canonical screening schema stores annotations and their provenance together. A separate Work-Version registry normalises bibliographic identity across Zotero records and publication expressions; it serves a different function from the embedded annotation provenance. The current JSON can later be projected to JSON-LD using PROV-O and the W3C Web Annotation model. TEI remains an optional research-data export.

The screening flow runs in one workspace:

1. Reviewers work every paper in a single screening surface, where the full-text reading view, the in-text search, the category assignment, and the derived decision live together; the record and the data functions open as on-demand panels rather than as separate destinations (ADR-020).
2. Evidence is pinned to the text passages that ground each category, so a category assignment carries the pinned snippet and its location as its recorded basis, and the source layer that was read is recorded per decision (ADR-024).
3. The tool derives an include or exclude decision from category coverage. A reviewer can override the derivation in either direction, and each override requires a recorded free-text justification that is written to the record and shown in the locked view (ADR-023).
4. Each save writes a deterministic per-reviewer decision file, decisions sorted by paper identifier, one block per paper, so that reviewer identity is the Git commit author and git blame attributes each decision to the person who committed it (ADR-021).
5. Verification mode displays the current lifecycle, provenance actors, activities, source references, annotation versions, deterministic checks, derived artifacts, and event history. It records the four governed domain-expert outcomes, preserves corrections as superseding annotations, and exposes publication approval as a separate action.
6. Public literature projections contain only records with a valid `publication-approved` event. Withheld records remain available in the internal source data and are counted without exposing their analysis.

[PENDING: figure F5, PRISM screening workspace and record-generation flow]

The round-one record is carried through PRISM and generated from the surviving data, and it names per item what a reader can and cannot verify. Across PRISMA 2020 and trAIce some items are reconstructable, some only partially, and some not at all; the pre-specified protocol is missing by definition, because a pre-specification cannot be created after the fact (trAIce M1).

### 3.8 Grounded Vault and literature analysis

The Grounded Vault organises the included literature through the chain `sources → Markdown → distilled knowledge documents → Assertions → outputs`. Every active distillate identifies the Work and exact publication Version represented by its reviewed Paper source. Distilled knowledge documents reduce full texts to structured, source-linked material that fits the working context of later AI-agent tasks. Assertions then express atomic cross-document statements with explicit links to identified source statements. The literature report and the paper are sibling outputs over this shared Assertion layer.

Quantitative analysis will describe category distributions, co-occurrences, evidence types, populations, practice fields, and gaps in the completed corpus. Qualitative analysis will synthesise the Assertions along the three research sub-questions. Topic modelling can provide an exploratory overview over full-text, distillate, annotation, and vault keywords. Its topics remain analytical proposals until interpreted against the source-linked knowledge structure. Literature Assertions enter the paper's results only after full-corpus analysis and domain-expert verification.

### 3.9 Agreement and divergence analysis

Decision agreement between the tracks is reported with the full statistic set, raw cells, observed agreement, Cohen's kappa, PABAK, kappa-max given the marginals, and the prevalence and bias indices, always together, because the decomposition in 5.2 shows how a single headline statistic misleads. Divergence is decomposed before it is interpreted, and it is reported as divergence, never as an error rate of either track, because no inter-human baseline exists for round one. All published numbers derive from the raw data files in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion that renders them. The round-one figures are regenerated by a committed replay script that self-tests against the canonical benchmark (`src/replay/`), so every reported round-one figure has a derivation path in the repository.

## 4. Study selection (the round-one record)

The expert track carries the round-one corpus decisions. Part of the corpus has no expert decision, which remains a named gap. The LLM track contains a decision for every corpus paper, and most records pair across the tracks by shared identifier. The corpus and track counts and the pairing tally live in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion. Expert exclusion reasons distribute over duplicates, topical irrelevance, wrong publication type, and missing full text, with a small residue of other and empty values. The empty and out-of-vocabulary values show where round one lacked enforced vocabularies. Round two validates these fields at capture and migration. [PENDING: figure F1, the generated trAIce-adapted flow diagram with separate AI and expert lanes, generated by the committed replay.]

## 5. Screening agreement as a motivating illustration, and what the divergence is made of

### 5.1 The headline number and why it cannot stand alone

On the paired decisions, the tracks agree on about half, and Cohen's kappa sits near chance; the cells and the statistic set live in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion. On the full set PABAK sits below kappa, and the kappa-max given the marginals leaves ample room for agreement, so the low agreement is a genuine property of the two tracks rather than a prevalence artifact. What the headline number hides is its composition.

### 5.2 Decomposition: task design before model judgment

The recorded exclusion reasons decompose the dominant divergence cell. Of the papers the LLM included against a human exclusion, a majority carry reasons a paper-isolated model structurally cannot act on, namely duplicates, missing full texts, and wrong publication types. A model that sees one paper at a time cannot know that the same paper appeared twice in the corpus, that the PDF was never obtained, or that the venue type was out of scope; these are corpus-management judgments and carry no content assessment. Restricted to content judgments, the picture changes; the include rates converge to near-parity, kappa rises, and kappa-max approaches its ceiling, which says the residual disagreement is genuine judgment scatter on a shared difficulty rather than a marginal-distribution artifact. The decomposition figures live in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion. The often-reported inclusion bias of LLM screeners, on this corpus, is mostly a task-design artifact; what survives content-restriction is near-parity on the decision level with disagreement concentrated in particular categories. The supplementary two-by-two experiment adds one robust effect; knowledge-document input raises the LLM include rate in both models, and the fairness category degrades most under it. We report these as conditions of the measurement, with the mixed-condition caveat of 3.4.

The residual content-level divergence, the cases where the tracks decide differently on genuine content, admits a descriptive classification into three epistemic patterns, which the Evidence Companion records as its source. Semantic expansion covers cases where the model reads a category more broadly and finds relevance where disciplinary expertise draws a tighter boundary. Implicit field membership covers cases where the model assigns a paper to a field that resonates in the text without being addressed explicitly. Keyword inclusion covers cases where the model infers relevance from keywords without checking the substantive context. This classification is descriptive of the divergence cases, and the classification step is itself model-assisted, which the Evidence Companion discloses.

The methodological point concerns the record rather than the model's screening quality. The decomposition is possible because the exclusion reason was recorded per decision, which is what separates the workflow-criteria share of the divergence from the content-judgment share. Had the reasons been kept as free prose or not recorded at all, that separation would be unavailable and the artifact share of the divergence unrecoverable.

### 5.3 Corpus characteristics

[PENDING: category-level landscape of the included corpus (which technical and social categories co-occur, category frequencies, the per-category agreement range with social work and feminist highest and fairness lowest), from committed script over the merged data. The per-category agreement values live in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion; the frequency landscape needs the script run.]

## 6. The literature on prompt engineering for social work, gender, and bias (qualitative synthesis)

[PENDING: the qualitative synthesis of the review, following from the analysis coding (3.6) over the completed corpus of both rounds. Frame by sub-question.]

**SQ1, technique inventory.** [PENDING: which prompting technique families reach this literature, crossed with evidence type and mitigation status. Expected reporting: frequency table, narrative on the dominance pattern, e.g. whether General_Guidance and Role_Persona dominate over named techniques.]

**SQ2, bias-to-mitigation mapping.** [PENDING: co-occurrence of bias axes, harm types, and mitigation stages; which mitigations are evaluated rather than proposed.]

**SQ3, domain constraints and gaps.** [PENDING: explicit adaptation statements collected during coding; the zero cells of the technique-by-population table as the research-gap map.]

## 7. Discussion

[PENDING: substantive discussion of the SQ1 to SQ3 findings for social work practice and education, after coding.]

### The methodological yield

The two-round design turns a common embarrassment, a review begun before reporting standards existed, into a usable contrast. The retrospective record shows precisely which trAIce and PRISMA items are recoverable from data and which cannot be recovered, and the prospective round shows the same items falling out of recorded data by construction. The boundary runs where decisions stop being data, where prose notes, unversioned prompts, and memory do not survive while per-decision fields do. For a team planning a similar review, the boundary condenses into three principles, each with its instance in this review's repository:

1. What cannot be reconstructed must be recorded at the moment of the run. Round one's pre-specified protocol and its acquisition provenance are declared absences (trAIce M1); round two therefore commits its protocol and its per-lane search exports before and during the run (`knowledge/update-protocol.md`).
2. The unit of the record is the single decision, carrying its actor, its evidence basis, and machine-readable values. Round one's consolidated table with free-text reasons is the negative case; PRISM's per-reviewer decision files with pinned evidence and enforced vocabularies are the positive one (ADR-021 to ADR-024).
3. A published figure is the endpoint of a re-executable derivation chain from the raw data. A figure that exists only as typed prose has no chain behind it and drifts as the data changes; every round-one figure here is regenerated by the committed replay script, which self-tests against the canonical benchmark (`src/replay/`).

Two further points concern the divergence analysis. Expert and LLM agreement studies on screening should separate corpus-management exclusions from content judgements before interpreting any agreement statistic. On our corpus, this restriction moves the inclusion rates toward near-parity. The recorded round-one tracks also make input-dependent changes visible, with the fairness category showing the clearest degradation under distilled input. These observations depend on separate records and support no claim that the LLM screens correctly.

### Integrating the workflow into a research process

The workflow was built for reuse, and its parts remain separable. PRISM is a static, dependency-free web tool over published research data; because its record generation is driven by the data model rather than by anything specific to this corpus, a third party can connect a different corpus and produce the same conformant flow diagram and disclosure section for a foreign review. Configuring the instrument for such an external review is a planned continuation. The replay pattern, a committed script that re-derives every published figure from the raw files and self-tests against the canonical result, transfers to any review that keeps its decisions as data. The update protocol and the coding instructions serve as templates for a pre-registered round. The distillation layer is the most corpus-specific part and the most expensive to rebuild; a team can run the workflow without it and forgoes the knowledge-document input condition.

An adoption has several prerequisites. The workflow uses a version-controlled repository as the record carrier, assigns final scholarly authority to domain experts, and treats every screening decision as a datum with an actor, a controlled reason, and an evidence anchor. PRISM requires no build tooling or institutional platform because it runs as a static page over files. The workflow makes AI-agent contributions inspectable and re-derivable. Each review must still evaluate the quality of those contributions against its own sources and scholarly criteria.

## 8. Limitations

Round one carries named gaps as properties of its record. Its protocol was not pre-registered, so trAIce M1 remains unsatisfied. The consolidated expert annotation lacks per-decision reviewer attribution and supplies no inter-expert baseline. Search provenance is corroborated for only a minority of records. Agreement statistics therefore compare the LLM with a merged expert product. The knowledge-document condition of the supplementary experiment is mixed because only part of the corpus had a knowledge document. Bibliographic reconciliation can document publication stage and supporting metadata, but it cannot infer undocumented peer-review procedures. The expanded round-two intake still requires Zotero curation and exact Work-Version binding before its prepared sources can enter screening. Some source endpoints remain available only as publisher or repository HTML, require operator-mediated retrieval, or contain visual evidence that the present PRISM representation cannot carry. Round two currently has `ai-agent-reviewed` productive records without domain-expert verification. Full-corpus screening and analysis coding remain incomplete, so the literature synthesis does not yet exist. The reporting standards are proposals that may change. The user scenarios were written by the technical lead as proxies and remain hypotheses until domain-user review.

## 9. AI use disclosure

[Generated section; the final text will be derived from recorded activities.] Deep-research systems, including ChatGPT, Claude, Gemini, and Perplexity, supported literature identification under expert-written prompts. Manual searches supplemented those runs. Claude Haiku 4.5 produced the round-one LLM screening track, while a supplementary experiment also used Claude Sonnet and distilled-input conditions. Codex AI agents produced operationally isolated round-two screening tracks across manifest-bound runs and a separate source-grounded AI Agent Review for each productive integration. LLM-based coding assistants supported software development and manuscript drafting under researcher direction. The productive schema records prompts, models, actors, sources, and legacy gaps. No round-two agent record has domain-expert verification or publication approval. Only publication-approved records may enter the public Literature Landscape.

## 10. Conclusion

[PENDING: closing paragraph integrating the substantive findings once coded.] The methodological result already supports a concrete requirement. An agent-assisted review should record its decisions, evidence, actors, activities, prompts, models, and authority transitions at execution time. Retrospective reconstruction cannot recover missing run data. PRISM and the round-two protocol implement these fields in a repeatable workflow, while the Grounded Vault carries source-linked evidence and its current authority state into the later literature report and paper.

## References

[Verified set; complete during venue formatting.]

- Flemyng, E., et al. (2025). Responsible AI in Evidence SynthEsis (RAISE): guidance and recommendations. Position statement, co-published by Cochrane, Campbell Collaboration, JBI, and CEE.
- Gallegos, I. O., Rossi, R. A., Barrow, J., Tanjim, M. M., Kim, S., Dernoncourt, F., Yu, T., Zhang, R., Ahmed, N. K. (2024). Bias and Fairness in Large Language Models: A Survey. Computational Linguistics 50(3). DOI: 10.1162/coli_a_00524.
- Gardiner, B., O'Donoghue, K., Yeung, P., Jewel, Z. I. (2026). Social work practice and artificial intelligence: A scoping review. Aotearoa New Zealand Social Work 38(1). DOI: 10.11157/anzswj-vol38iss1id1267.
- Holst, et al. (2025). PRISMA-trAIce: a foundational proposal for transparent reporting of AI in systematic reviews. JMIR AI 4:e80247. DOI: 10.2196/80247.
- Klinger, S., et al. (2026). Orientierungsleitfaden. Diversitätssensibler Umgang mit Künstlicher Intelligenz. https://digitalesozialearbeit.github.io/orientierungsleitfaden
- Pollin, C., Sackl-Sharif, S., Klinger, S. (2026). Deep-Research-gestützte Literature-Reviews. Epistemische Infrastruktur als Praxis. Forum Wissenschaft 2/2026.
- Sapkota, R., Roumeliotis, K. I., Karkee, M. (2025). AI Agents vs. Agentic AI: A Conceptual Taxonomy, Applications and Challenges. Information Fusion 126:103599. DOI: 10.1016/j.inffus.2025.103599.
- Schulhoff, S., et al. (2025). The Prompt Report: A Systematic Survey of Prompt Engineering Techniques. arXiv:2406.06608v6.
- Thomas, J., et al. (2025, rev. 2026). RAISE guidance documents. OSF. DOI: 10.17605/OSF.IO/FWAUD.
- Zhao, W. X., et al. (2026). A Survey of Large Language Models. arXiv:2303.18223v19. DOI: 10.48550/arXiv.2303.18223.
- [PENDING: prior-art tool citations (EPPI-Reviewer, Nested Knowledge, DistillerSR, AIscreenR/Vembye et al.) with the exact references during venue formatting.]

*Updated: 2026-08-24. Draft v0.7 incorporates the executed round-two searches, Work-Version reconciliation, exact acquired-Version provenance, agent source QC and repair, the agent-assisted completion contract, governed source acquisition and screening runs, schema 0.5 provenance, immutable annotation corrections, deterministic validation, the screening lifecycle, the PRISM verification mode, the public release gate, and the Grounded Vault output structure. Sections 5.3, 6, and parts of 7 and 10 remain frames pending full-corpus analysis and domain-expert verification. Figures F1 and F5 remain pending.*
