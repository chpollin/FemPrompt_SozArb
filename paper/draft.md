---
title: "Paper Draft: LLM-Assisted Literature Review on Generative AI, Gender, and Social Work"
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: draft
language: en
version: "0.3"
created: 2026-06-09
updated: 2026-07-21
authors: [Christopher Pollin, Susanne Sackl-Sharif, Sabine Klinger] # [OPEN: author set and order, three named here vs. four on the Evidence Companion; co-author decision]
generated-with: Claude Code
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
related: [outline, update-protocol, plan]
---

**DRAFT, register 2 (a sober methodological account). The epistemic infrastructure for a traceable, reproducible LLM-assisted review leads; the qualitative synthesis is the review's substance, and the human-LLM divergence is a motivating illustration of why the infrastructure is needed, not a result the paper defends.** Every number in this draft is drawn from the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion that renders it; unfilled values are marked `[PENDING: ...]` and name the computation or decision that fills them. Sections whose content depends on the analysis coding (TP4) or the round 2 update (TP5) carry a frame and placeholders, not invented findings. Author order and the working title are co-author decisions. The coding-scheme and screening decisions this draft relies on are fixed project decisions recorded in `knowledge/plan.md`; the simulation-and-ratification mechanism they once carried was retired on 2026-07-03, and the project builds on them directly.

# Generative AI, Gender, and Bias in Social Work. An Account of a Traceable, Reproducible, LLM-Assisted Qualitative Literature Review

**Title note (operator revision 2026-07-21, co-author decision pending):** revised from "A Transparent, Reproducible Account of a Two-Round LLM-Assisted Qualitative Literature Review"; "traceable and reproducible" is the paper's own contribution vocabulary, the two-round structure is explained in the abstract. Conceptual alternatives on file: "... An LLM-Assisted Literature Review as Epistemic Infrastructure" and "... A Conformant-by-Construction LLM-Assisted Literature Review".

## Abstract

Generative AI enters social work practice faster than the profession can appraise its risks of bias and discrimination. We report a qualitative literature review at the intersection of generative AI, gender, and bias in social work, framed by feminist AI literacies, and we document the epistemic infrastructure that makes the review traceable and reproducible. The review ran in two rounds. Round one used four commercial deep-research systems, supplemented by manual search, for identification and a dual assessment track in which human experts and a large language model classified every paper under an identical ten-category schema, recorded separately and never merged. Rendered retrospectively against PRISMA 2020 and the trAIce extension, this round yields a record with named, unrepairable gaps, above all the missing pre-registered protocol. Round two runs prospectively through PRISM, a screening instrument whose data model derives the PRISMA flow diagram and the AI-disclosure section from recorded session data; the human screening decision remains binding, the model advisory. The human-model divergence of round one serves as a motivating illustration of why reliability must be established by the research process. Its decomposition shows that over half of the headline disagreement stems from workflow criteria the model structurally cannot see; on content-only decisions the two tracks reach near-parity in inclusion rates. [PENDING: one-sentence synthesis headline along SQ1–SQ3, after analysis coding.] The methodological contribution is the documented boundary between what retrospective reconstruction recovers and what must be recorded at the moment of the run.

## 1. Introduction

Social work is a field in which the stakes of algorithmic bias are not abstract: decisions touch child protection, mental health, and welfare administration, and the people affected are disproportionately those whom training-data biases misrepresent. As generative AI enters professional practice, practitioners and educators need to know what the research literature actually offers them: which prompting practices are discussed for this field, which bias dimensions are analysed, which mitigations have evidence behind them, and where the literature is silent. This review set out to answer that question for the intersection of generative AI, gender, bias, and social work, with feminist AI literacies, diversity- and power-sensitive, intersectional, bias-aware competencies in the use of generative AI, as its conceptual frame.

We made one design decision at the start. Every paper in the corpus would be assessed twice, once in a consolidated human expert annotation and once by a batch LLM assessment, with the two tracks recorded separately and never merged. The reason was substantive; we wanted to observe how a language model judges contested categories such as fairness and gender in this literature. Round one ran before the PRISMA-trAIce checklist (Holst et al. 2025) and the RAISE position statement (Flemyng et al. 2025), the proposals articulating what an AI-assisted review ought to disclose. Rendering it retrospectively against them yields a record in which each item is either reconstructable from the data we kept or a named gap, the missing pre-registered protocol among them. That boundary between what a kept record recovers and what it cannot motivates the design of round two.

The paper's contribution is an epistemic infrastructure that makes an LLM-assisted review traceable and reproducible. Its leading element is PRISM, a screening instrument whose data model derives the PRISMA-trAIce flow artifact and the AI disclosure section from recorded session data, to our knowledge, as of June 2026, the first tool documented to do so. Around it stand the two-round design and the retrospective record of round one with every gap named. The decomposed analysis of human-LLM screening divergence enters as an illustration of why reliability cannot be presupposed, not as a result the paper defends. The review's substance is its qualitative synthesis along three sub-questions, the inventory of prompting techniques reaching this literature and the evidence behind them (SQ1), the mapping of bias axes to proposed and tested mitigations (SQ2), and the domain-specific constraints and gaps that general-purpose prompt engineering guidance does not cover (SQ3). [PENDING: one-sentence preview of the synthesis, after coding.]

## 2. Background

Two strands of work frame this review. The first is the emerging literature on AI in social work and on feminist and intersectional perspectives on generative AI. Scoping work on AI in social work practice shows the literature concentrating in child protection and child welfare, with health care, homelessness and youth services, social assistance, and mental health also represented (Gardiner et al. 2026). The feminist AI literacies frame, developed in the project this review belongs to, names the competencies practice needs: diversity- and power-sensitive prompting, critical output assessment, and context sensitivity (Klinger et al. 2026). What has been missing is a systematic picture of whether and how the research literature supports those competencies with concrete, evaluable techniques.

The second strand is reporting standards for AI-assisted evidence synthesis, which exist as fresh proposals rather than settled norms. PRISMA-trAIce (Holst et al. 2025, JMIR AI) extends PRISMA 2020 with items for AI involvement, graded mandatory to optional, including an adapted flow diagram that separates records screened by AI systems from records screened by humans (trAIce item R1); it presents itself as a foundational proposal without a formal consensus process. RAISE (Flemyng et al. 2025), co-published across Cochrane, Campbell, JBI, and CEE, states mandatory reporting elements for responsible AI use in evidence synthesis: system names, versions, dates, purpose, methodological justification, validation evidence, limitations, and interests. Established screening platforms already record AI decisions as separate, reviewer-attributed records next to binding human decisions, EPPI-Reviewer, Nested Knowledge, and DistillerSR among them, so that design is prior art, not our contribution; what no surveyed tool does, to our knowledge as of June 2026, is emit the trAIce flow artifact or generate the disclosure section from session data.

The three platforms named above characterize this practice concretely. EPPI-Reviewer attributes LLM coding to a robot reviewer discriminable from human coding and offers a comparison mode against a human gold standard. The Nested Knowledge Robot Screener runs AI as one reviewer within dual screening, persisting its decisions as reviewer-level records under binding human adjudication. DistillerSR runs a classifier as an automated second reviewer with a per-reviewer audit trail.

Adjacent tools cover parts of the design. Covidence documents one automated exclusion step in its auto-updated PRISMA flow and provides static RAISE-aligned reporting templates. Elicit claims a dual-review data model whose persistence is undocumented. Rayyan, ASReview, SWIFT-Active Screener, Abstrackr, and RobotAnalyst offer prioritization or advisory display without persisting an AI decision record. The nearest software by name is the varlet99/prisma-traice-review-tool prototype, the only artifact found invoking PRISMA-trAIce by name, created in April 2026 and, as of June 2026, at an early stage with undocumented properties. On the methodological side, AIscreenR (Vembye et al.) benchmarks a GPT model as a second screener, and the AITDI meta-research protocol assesses the transparency of published AI-assisted reviews retrospectively, a stance adjacent to rendering one's own review as a conformant artifact.

Our review became, in part, a working test of what these proposals demand from a review that was already under way when they appeared.

## 3. Methods

### 3.1 Design overview

The review runs in two rounds. Round one (search executed October 2025, screening through spring 2026) was conducted before any of the instrumentation described here existed; we report it as it happened, including its gaps, and we make no conformance claim for it. Round two, a literature update restricted to work published since the round one cutoff, is designed and pre-registered, with its update protocol committed before the first search run; it has not yet been executed. It runs through the instrument described in 3.6. The contrast between the two rounds grounds the paper's argument about what an epistemic infrastructure must record at run time for an LLM-assisted review to be traceable and reproducible.

### 3.2 Identification

Round one identification ran a shared, expert-developed prompt template through four commercial deep research systems (ChatGPT, Claude, Gemini, Perplexity), supplemented by manual searches in scientific databases. Source attribution per record survives in the screening data, distributed across the four systems and manual search; the per-system split is in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion. The prompt template is committed in the repository; the executed prompt instantiations were not committed at run time, and post-hoc recovery corroborates machine-readable provenance for only a minority of records via restored RIS exports. We state this plainly as a provenance limitation of round one. The outputs were converted to RIS with the help of an LLM and imported into Zotero; the conversion itself is documented as performed but not reproducible for round one, and round two is designed to bind it to a committed prompt and run record.

### 3.3 Eligibility and category scheme

Both assessment tracks used the same schema of ten binary categories, four technical (AI literacies, generative AI, prompting, other AI) and six social (social work, bias and inequality, gender, diversity, feminist, fairness), with a fixed inclusion rule: a paper enters the analysis corpus when at least one technical and one social category apply. The schema is versioned in the repository (`categories.yaml` v1.2) and was developed by the domain experts before screening. Exclusions carry a reason from a documented list; the per-decision reason field is what the decomposition in section 5.2 rests on.

### 3.4 Screening: two tracks, never merged

The two tracks run in parallel by deliberate design, which enables systematic comparison of where their epistemic contributions converge and diverge. A sequential arrangement would have confined the model track to a preparatory function. Dual names two things at once, two independent assessment instances, the expert reviewers and the model, and two different epistemic foundations working the identical criteria. The separation also keeps model results from influencing the expert judgment.

In the human track, the reviewing experts recorded category judgments and decisions in a shared spreadsheet, with access to metadata, abstracts, and full texts. The resulting annotation is consolidated: the file carries no per-decision reviewer attribution, so the human track is one merged expert annotation, not two independent codings, and no inter-human agreement can be computed for round one. Deduplication happened inside screening rather than as a separate identification step; the flow diagram represents it as it happened. In the LLM track, a batch assessment (Claude Haiku 4.5, temperature and parameters as recorded in the assessment script) judged every corpus paper on title and abstract, producing the same ten binary categories, a derived decision, and a textual justification per paper. A supplementary two-by-two experiment varied model (Haiku, Sonnet) and input (title and abstract versus distilled knowledge documents); the knowledge-document condition is a mixed condition, since only part of the corpus had a knowledge document and the rest fell back to abstract input. The two tracks were recorded as sibling fields and never overwrite each other; the human decision is binding for corpus membership, the LLM decision is advisory and preserved.

### 3.5 Analysis coding

The synthesis along SQ1 to SQ3 rests on per-paper analysis fields coded over the included corpus: prompting technique families (vocabulary from The Prompt Report taxonomy, Schulhoff et al. 2025), bias axes, harm types (Gallegos et al. 2024, optional field), mitigation stage (Gallegos et al. 2024, extended by two practice-side codes) and status, population and practice field, and the coding text basis as an audit field. Coding follows written instructions with closed vocabularies, a never-empty rule, and import-time validation; the full design, including the staged retro-coding of round one includes, is committed in the repository (`knowledge/update-protocol.md`). The field decisions are fixed project decisions (`knowledge/plan.md`). [PENDING: coding execution; all synthesis numbers in section 5.3 and 5.4 follow from it by committed script.]

### 3.6 Instrument and record generation

PRISM, the screening and documentation layer built on the review's repository, is a static, dependency-free web tool over the published research data. It is the binding screening surface for the review (ADR-019); its data model keeps AI and human decisions as separate sibling records, and it derives the reported artifacts from the recorded session rather than from hand-filled templates. A batch captured in a spreadsheet instead enters over an import bridge that converts the export into per-reviewer decision files with a validation report over vocabulary violations, empty reasons, duplicates, and unknown identifiers.

The screening flow runs in one workspace:

1. Reviewers work every paper in a single screening surface, where the full-text reading view, the in-text search, the category assignment, and the derived decision live together; the record and the data functions open as on-demand panels rather than as separate destinations (ADR-020).
2. Evidence is pinned to the text passages that ground each category, so a category assignment carries the pinned snippet and its location as its recorded basis, and the source layer that was read is recorded per decision (ADR-024).
3. The tool derives an include or exclude decision from category coverage, and the human decision is the binding record. The reviewer can override the derivation in either direction, and each override requires a recorded free-text justification that is written to the record and shown in the locked view (ADR-023).
4. Each save writes a deterministic per-reviewer decision file, decisions sorted by paper identifier, one block per paper, so that reviewer identity is the Git commit author and git blame attributes each decision to the person who committed it (ADR-021).
5. From this recorded session the tool generates the PRISMA-trAIce adapted flow diagram, which separates the AI-screened lane from the human-screened lane (trAIce item R1), and the consolidated AI disclosure section (trAIce M-items with the RAISE Table 1 elements).

[PENDING: figure F5, PRISM screening workspace and record-generation flow]

The round-one record is carried through PRISM and generated from the surviving data, and it names per item what a reader can and cannot verify. Across PRISMA 2020 and trAIce some items are reconstructable, some only partially, and some not at all; the pre-specified protocol is missing by definition, because a pre-specification cannot be created after the fact (trAIce M1).

### 3.7 Agreement and divergence analysis

Decision agreement between the tracks is reported with the full statistic set: raw cells, observed agreement, Cohen's kappa, PABAK, kappa-max given the marginals, and the prevalence and bias indices, always together, because the decomposition in 5.2 shows how a single headline statistic misleads. Divergence is decomposed before it is interpreted, and it is reported as divergence, never as an error rate of either track, because no inter-human baseline exists for round one. All published numbers derive from the raw data files in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion that renders them. The round-one figures are regenerated by a committed replay script that self-tests against the canonical benchmark (`src/replay/`), so every reported round-one figure has a derivation path in the repository.

## 4. Study selection (the round-one record)

The human track carries the binding decisions; part of the corpus carries no human decision, a named gap of round one. The LLM track carries a decision for every corpus paper, and most records pair across the tracks by shared identifier. The corpus and track counts and the pairing tally live in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion. Human exclusion reasons distribute over duplicates, topical irrelevance, wrong publication type, and missing full text, with a small residue of other and empty values; the empty and out-of-vocabulary values are themselves a finding about unenforced vocabularies that round two's import validation closes. [PENDING: figure F1, the generated trAIce-adapted flow diagram with separate AI and human lanes, generated by the committed replay.]

## 5. Screening agreement as a motivating illustration, and what the divergence is made of

### 5.1 The headline number and why it cannot stand alone

On the paired decisions, the tracks agree on about half, and Cohen's kappa sits near chance; the cells and the statistic set live in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion. On the full set PABAK sits below kappa, and the kappa-max given the marginals leaves ample room for agreement, so the low agreement is a genuine property of the two tracks rather than a prevalence artifact. What the headline number hides is its composition.

### 5.2 Decomposition: task design before model judgment

The recorded exclusion reasons decompose the dominant divergence cell. Of the papers the LLM included against a human exclusion, a majority carry reasons a paper-isolated model structurally cannot act on, namely duplicates, missing full texts, and wrong publication types. A model that sees one paper at a time cannot know that the same paper appeared twice in the corpus, that the PDF was never obtained, or that the venue type was out of scope; these are corpus-management judgments, not content judgments. Restricted to content judgments, the picture changes: the include rates converge to near-parity, kappa rises, and kappa-max approaches its ceiling, which says the residual disagreement is genuine judgment scatter on a shared difficulty, not a marginal-distribution artifact. The decomposition figures live in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion. The often-reported inclusion bias of LLM screeners, on this corpus, is mostly a task-design artifact; what survives content-restriction is near-parity on the decision level with disagreement concentrated in particular categories. The supplementary two-by-two experiment adds one robust effect: knowledge-document input raises the LLM include rate in both models, and the fairness category degrades most under it. We report these as conditions of the measurement, with the mixed-condition caveat of 3.4.

The residual content-level divergence, the cases where the tracks decide differently on genuine content, admits a descriptive classification into three epistemic patterns, which the Evidence Companion records as its source. Semantic expansion covers cases where the model reads a category more broadly and finds relevance where disciplinary expertise draws a tighter boundary. Implicit field membership covers cases where the model assigns a paper to a field that resonates in the text without being addressed explicitly. Keyword inclusion covers cases where the model infers relevance from keywords without checking the substantive context. This classification is descriptive of the divergence cases, and the classification step is itself model-assisted, which the Evidence Companion discloses.

The methodological point concerns the record rather than the model's screening quality. The decomposition is possible because the exclusion reason was recorded per decision, which is what separates the workflow-criteria share of the divergence from the content-judgment share. Had the reasons been kept as free prose or not recorded at all, that separation would be unavailable and the artifact share of the divergence unrecoverable.

### 5.3 Corpus characteristics

[PENDING: category-level landscape of the included corpus (which technical and social categories co-occur, category frequencies, the per-category agreement range with social work and feminist highest and fairness lowest), from committed script over the merged data. The per-category agreement values live in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion; the frequency landscape needs the script run.]

## 6. The literature on prompt engineering for social work, gender, and bias (qualitative synthesis)

[PENDING: the qualitative synthesis of the review, following from the analysis coding (3.5) over the coded corpus of both rounds, round one and the pre-registered round-two update once it is executed. Frame, per sub-question:]

**SQ1, technique inventory.** [PENDING: which prompting technique families reach this literature, crossed with evidence type and mitigation status. Expected reporting: frequency table, narrative on the dominance pattern, e.g. whether General_Guidance and Role_Persona dominate over named techniques.]

**SQ2, bias-to-mitigation mapping.** [PENDING: co-occurrence of bias axes, harm types, and mitigation stages; which mitigations are evaluated rather than proposed.]

**SQ3, domain constraints and gaps.** [PENDING: explicit adaptation statements collected during coding; the zero cells of the technique-by-population table as the research-gap map.]

## 7. Discussion

[PENDING: substantive discussion of the SQ1 to SQ3 findings for social work practice and education, after coding.]

What can be discussed now is the methodological yield. The two-round design turns a common embarrassment, a review begun before reporting standards existed, into a usable contrast. The retrospective record shows precisely which trAIce and PRISMA items are recoverable from data and which cannot be recovered, and the prospective round shows the same items falling out of recorded data by construction. The boundary runs where decisions stop being data, where prose notes, unversioned prompts, and memory do not survive while per-decision fields do. Read as a design specification for epistemic infrastructure, the boundary yields five lessons:

1. Pre-specification is unrecoverable; a protocol not written before the run can only be declared absent afterwards.
2. Acquisition provenance must be captured at the moment of the run, since post-hoc recovery corroborated only a minority of round-one records and marks the ceiling.
3. Every decision needs its actor and its evidence basis recorded alongside it.
4. Controlled vocabularies must be enforced at the input surface.
5. Reported numbers must be derivations, not prose.

Two further points concern the divergence analysis. Human-LLM agreement studies on screening should separate corpus-management exclusions from content judgments before interpreting any agreement statistic, and on our corpus separating them moves the content-restricted agreement to near-parity. The dual-track design pays for itself as epistemics, since the LLM track surfaced category interpretations the experts then re-examined, and the human track exposed input-dependence in the model, the fairness degradation under distilled input being the clearest case. Keeping the tracks separate and recorded is what makes any of this available; none of it depends on claiming the LLM screens correctly.

The instrument is built for reuse beyond this review. Because its record generation is driven by the data model rather than by anything specific to this corpus, a third party can connect a different corpus and produce the same conformant flow diagram and disclosure section for a foreign review. Setting the instrument up for such an external review is the project's planned continuation.

## 8. Limitations

Round one carries named, unrepairable gaps as properties of its record. The round-1 protocol was not pre-registered, so trAIce M1 is a named gap. There is no per-decision reviewer attribution, hence no inter-human baseline; round two's full double screening is designed to supply that baseline. Search provenance is corroborated for only a minority of records. The human track is one consolidated annotation, so agreement statistics against it measure agreement with a merged product rather than with an individual expert. The knowledge-document condition of the supplementary experiment is mixed, since only part of the corpus had knowledge documents. The analysis coding is designed with its field decisions fixed, and its execution is still pending, so the synthesis numbers do not yet exist. The reporting standards we render against are proposals rather than consensus instruments and may change; we cite them with versions and dates. The user scenarios the instrument was built from were written by the technical lead as a proxy and are validated against the named users only at the project's validation session, so they stay hypotheses until that session.

## 9. AI use disclosure

[Generated section; final text falls out of the session data via the instrument.] Deep research systems (ChatGPT, Claude, Gemini, Perplexity; versions and run dates as recorded) performed literature identification under expert-written prompts; their outputs were independently supplemented by manual search. An LLM (Claude Haiku 4.5, model id and parameters as recorded in the committed assessment script) produced the advisory screening track; a second model (Claude Sonnet) and a distilled-input condition were used in the supplementary experiment. LLM-based coding assistants (Claude Code) were used to build the instrument and drafts of this paper under human direction; all empirical numbers derive from the raw data in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion that renders them, and await independent human verification. Costs are disclosed as factual values in the repository. Human decisions are binding throughout; no AI decision entered the corpus unreviewed.

## 10. Conclusion

[PENDING: closing paragraph integrating the substantive findings once coded.] On the methods side: a review team that wants its AI-assisted screening to be reportable under the emerging standards should not plan to reconstruct; it should plan to record. The fields that saved this review's interpretability, exclusion reasons, sibling AI and human decisions, source attribution, were all cheap to record at the moment of the run and impossible to recover afterwards. The instrument and protocol of our second round exist so that the next review, ours or someone else's, does not have to learn this retrospectively.

## References

[Verified set; complete during venue formatting.]

- Flemyng, E., et al. (2025). Responsible AI in Evidence SynthEsis (RAISE): guidance and recommendations. Position statement, co-published by Cochrane, Campbell Collaboration, JBI, and CEE.
- Gallegos, I. O., Rossi, R. A., Barrow, J., Tanjim, M. M., Kim, S., Dernoncourt, F., Yu, T., Zhang, R., Ahmed, N. K. (2024). Bias and Fairness in Large Language Models: A Survey. Computational Linguistics 50(3). DOI: 10.1162/coli_a_00524.
- Gardiner, B., O'Donoghue, K., Yeung, P., Jewel, Z. I. (2026). Social work practice and artificial intelligence: A scoping review. Aotearoa New Zealand Social Work 38(1). DOI: 10.11157/anzswj-vol38iss1id1267.
- Holst, et al. (2025). PRISMA-trAIce: a foundational proposal for transparent reporting of AI in systematic reviews. JMIR AI 4:e80247. DOI: 10.2196/80247.
- Klinger, S., et al. (2026). Orientierungsleitfaden. Diversitätssensibler Umgang mit Künstlicher Intelligenz. https://digitalesozialearbeit.github.io/orientierungsleitfaden
- Pollin, C., Sackl-Sharif, S., Klinger, S. (2026). Deep-Research-gestützte Literature-Reviews. Epistemische Infrastruktur als Praxis. Forum Wissenschaft 2/2026.
- Schulhoff, S., et al. (2025). The Prompt Report: A Systematic Survey of Prompt Engineering Techniques. arXiv:2406.06608v6.
- Thomas, J., et al. (2025, rev. 2026). RAISE guidance documents. OSF. DOI: 10.17605/OSF.IO/FWAUD.
- [PENDING: prior-art tool citations (EPPI-Reviewer, Nested Knowledge, DistillerSR, AIscreenR/Vembye et al.) with the exact references during venue formatting.]

*Updated: 2026-07-21. Draft status v0.3 implements the operator register decision of 2026-07-21, which removed the self-correction and failure narrative (the merge and pairing story, the overturned prevalence reading, the withdrawn in-tool-screening falsification), moved PRISM to the lead of the methodological contribution and added a numbered screening-flow walkthrough in 3.6, and clarified round two as designed and pre-registered but not yet executed. Sections 5.3, 6, and parts of 7 and 10 remain frames pending analysis coding, and figures F1 and F5 remain pending.*
