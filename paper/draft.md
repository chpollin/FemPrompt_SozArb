---
title: "Paper Draft: Two-Round LLM-Assisted Literature Review on Generative AI, Gender, and Social Work"
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: draft
language: en
version: "0.1"
created: 2026-06-09
updated: 2026-06-09
authors: [Christopher Pollin, Susanne Sackl-Sharif, Sabine Klinger]
generated-with: Claude Code
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
related: [outline, verification, update-protocol, plan]
---

**DRAFT, register 2 (methodological narrative). The epistemic infrastructure for a traceable, reproducible LLM-assisted review leads; the qualitative synthesis is the review's substance, and the human-LLM divergence is a motivating illustration of why the infrastructure is needed, not a result the paper defends.** Every number in this draft is licensed by the verification documents in `knowledge/`; unfilled values are marked `[PENDING: ...]` and name the computation or decision that fills them. Sections whose content depends on the analysis coding (TP4) or the round 2 update (TP5) carry a frame and placeholders, not invented findings. Author order and the working title are co-author decisions. The simulated decisions this draft relies on (coding scheme details, screening split) are marked in `knowledge/plan.md` and require ratification before submission.

# Generative AI, Gender, and Bias in Social Work. A Transparent, Reproducible Account of a Two-Round LLM-Assisted Qualitative Literature Review

## Abstract

What does the research literature offer practitioners and educators in social work who want to use generative AI in a gender- and bias-sensitive way, and how must prompt engineering be adapted for that field? We report a literature review conducted in two rounds over a corpus of 326 papers identified through four commercial deep research systems and manual search. Every paper was assessed in two parallel tracks, a consolidated human expert annotation in a spreadsheet workflow and a batch LLM assessment, recorded separately and never merged. [PENDING: one to two sentences with the headline of the review's synthesis along SQ1 to SQ3, after analysis coding.] The review's substance is the literature picture it produces; around it we build an epistemic infrastructure that makes the LLM-assisted process traceable and reproducible. We attempted to render the completed first round as a PRISMA 2020 and PRISMA-trAIce record, and the attempt failed in instructive ways. A protocol cannot be pre-specified after the fact, and search provenance could be corroborated for only part of the corpus. The near-chance agreement between the two tracks serves as a motivating illustration of why reliability cannot be presupposed; an adversarial recomputation overturned our own documented interpretation of it, a correction possible only because exclusion reasons had been recorded per decision, and most of the dominant divergence cell turned out to be corpus-management exclusions invisible to a model that sees one paper at a time, with the figures and the decomposition home in `knowledge/verification.md` and the data. The second round therefore runs under a pre-committed protocol through an instrument that derives the trAIce flow artifact and the AI disclosure from recorded data. The methodological contribution is the documented boundary between what reconstruction recovers and what must be recorded at the moment of the run.

## 1. Introduction

Social work is a field in which the stakes of algorithmic bias are not abstract: decisions touch child protection, mental health, and welfare administration, and the people affected are disproportionately those whom training-data biases misrepresent. As generative AI enters professional practice, practitioners and educators need to know what the research literature actually offers them: which prompting practices are discussed for this field, which bias dimensions are analysed, which mitigations have evidence behind them, and where the literature is silent. This review set out to answer that question for the intersection of generative AI, gender, bias, and social work, with feminist AI literacies, diversity- and power-sensitive, intersectional, bias-aware competencies in the use of generative AI, as its conceptual frame.

We made one design decision at the start that proved more consequential than we understood at the time: every paper in the corpus would be assessed twice, once in a consolidated human expert annotation and once by a batch LLM assessment, with the two tracks recorded separately and never merged. We chose this for substantive reasons, because we wanted to observe how a language model judges contested categories such as fairness and gender in this literature, not for reporting reasons. Much else we did not do. We wrote no pre-specified protocol. We kept no record of which reviewer made which decision. We did not store the executed search prompts at the moment they ran. When the PRISMA-trAIce checklist (Holst et al. 2025) and the RAISE position statement (Flemyng et al. 2025) appeared as proposals articulating what an AI-assisted review ought to disclose, we asked how much of a conformant record we could still produce for our completed first round from the data we happened to have kept; the answer reshaped both our methods section and our second round.

The paper's contribution is an epistemic infrastructure that makes an LLM-assisted review traceable and reproducible. It comprises the two-round design, the retrospective record of round one with every gap named, and the instrument whose data model derives the PRISMA-trAIce flow artifact and the AI disclosure section from recorded data, to our knowledge, as of June 2026, the first tool documented to do so. The decomposed analysis of human-LLM screening divergence enters as an illustration of why reliability cannot be presupposed, not as a result the paper defends. The review's substance is its qualitative synthesis along three sub-questions, the inventory of prompting techniques reaching this literature and the evidence behind them (SQ1), the mapping of bias axes to proposed and tested mitigations (SQ2), and the domain-specific constraints and gaps that general-purpose prompt engineering guidance does not cover (SQ3). [PENDING: one-sentence preview of the synthesis, after coding.] The methodological account is deliberately told as a sequence of decisions and corrections, including the one where our own infrastructure proved our documented interpretation wrong.

## 2. Background

Two strands of work frame this review. The first is the emerging literature on AI in social work and on feminist and intersectional perspectives on generative AI. Scoping work on AI in social work practice shows the literature concentrating in child protection and child welfare, with health care, homelessness and youth services, social assistance, and mental health also represented (Gardiner et al. 2026). The feminist AI literacies frame, developed in the project this review belongs to, names the competencies practice needs: diversity- and power-sensitive prompting, critical output assessment, and context sensitivity (Klinger et al. 2026). What has been missing is a systematic picture of whether and how the research literature supports those competencies with concrete, evaluable techniques.

The second strand is reporting standards for AI-assisted evidence synthesis, which exist as fresh proposals rather than settled norms. PRISMA-trAIce (Holst et al. 2025, JMIR AI) extends PRISMA 2020 with items for AI involvement, graded mandatory to optional, including an adapted flow diagram that separates records screened by AI systems from records screened by humans (trAIce item R1); it presents itself as a foundational proposal without a formal consensus process. RAISE (Flemyng et al. 2025), co-published across Cochrane, Campbell, JBI, and CEE, states mandatory reporting elements for responsible AI use in evidence synthesis: system names, versions, dates, purpose, methodological justification, validation evidence, limitations, and interests. Established screening platforms already record AI decisions as separate, reviewer-attributed records next to binding human decisions, EPPI-Reviewer, Nested Knowledge, and DistillerSR among them, so that design is prior art, not our contribution; what no surveyed tool does, to our knowledge as of June 2026, is emit the trAIce flow artifact or generate the disclosure section from session data. Our review became, in part, a working test of what these proposals demand from a review that was already under way when they appeared.

## 3. Methods

### 3.1 Design overview

The review runs in two rounds. Round one (search executed October 2025, screening through spring 2026) was conducted before any of the instrumentation described here existed; we report it as it happened, including its gaps, and we make no conformance claim for it. Round two, a literature update restricted to work published since the round one cutoff, runs under a protocol committed before the first search, through the instrument described in 3.6. The contrast between the two rounds is not decoration, it grounds the paper's argument about what an epistemic infrastructure must record at run time for an LLM-assisted review to be traceable and reproducible.

### 3.2 Identification

Round one identification ran a shared, expert-developed prompt template through four commercial deep research systems (ChatGPT, Claude, Gemini, Perplexity), supplemented by manual searches in scientific databases. Source attribution per record survives in the screening data (Perplexity 74, Claude 63, ChatGPT 62, Gemini 54, manual 50, of 303 human-assessed records). The prompt template is committed in the repository; the executed prompt instantiations were not committed at run time, and post-hoc recovery corroborates machine-readable provenance for exactly 34 of 326 records via restored RIS exports. We state this plainly as a provenance limitation of round one. The outputs were converted to RIS with the help of an LLM and imported into Zotero; the conversion itself is documented as performed but not reproducible for round one, and round two binds it to a committed prompt and run record.

### 3.3 Eligibility and category scheme

Both assessment tracks used the same schema of ten binary categories, four technical (AI literacies, generative AI, prompting, other AI) and six social (social work, bias and inequality, gender, diversity, feminist, fairness), with a fixed inclusion rule: a paper enters the analysis corpus when at least one technical and one social category apply. The schema is versioned in the repository (`categories.yaml` v1.2) and was developed by the domain experts before screening. Exclusions carry a reason from a documented list; the reason field, as section 5.2 shows, later turned out to be the single most valuable field in the dataset.

### 3.4 Screening: two tracks, never merged

In the human track, the reviewing experts recorded category judgments and decisions in a shared spreadsheet, with access to metadata, abstracts, and full texts. The resulting annotation is consolidated: the file carries no per-decision reviewer attribution, so the human track is one merged expert annotation, not two independent codings, and no inter-human agreement can be computed for round one. Deduplication happened inside screening rather than as a separate identification step; the flow diagram represents it as it happened. In the LLM track, a batch assessment (Claude Haiku 4.5, temperature and parameters as recorded in the assessment script) judged every corpus paper on title and abstract, producing the same ten binary categories, a derived decision, and a textual justification per paper. A supplementary two-by-two experiment varied model (Haiku, Sonnet) and input (title and abstract versus distilled knowledge documents); the knowledge-document condition is a mixed condition, since 209 of 326 papers had a knowledge document and the rest fell back to abstract input. The two tracks were recorded as sibling fields and never overwrite each other; the human decision is binding for corpus membership, the LLM decision is advisory and preserved.

### 3.5 Analysis coding

The synthesis along SQ1 to SQ3 rests on per-paper analysis fields coded over the included corpus: prompting technique families (vocabulary from The Prompt Report taxonomy, Schulhoff et al. 2025), bias axes, harm types (Gallegos et al. 2024, optional field), mitigation stage (Gallegos et al. 2024, extended by two practice-side codes) and status, population and practice field, and the coding text basis as an audit field. Coding follows written instructions with closed vocabularies, a never-empty rule, and import-time validation; the full design, including the staged retro-coding of round one includes, is committed in the repository (`knowledge/update-protocol.md`). [PENDING RATIFICATION: the coding-scheme decisions are simulated pending the team meeting; see knowledge/plan.md.] [PENDING: coding execution; all synthesis numbers in section 5.3 and 5.4 follow from it by committed script.]

### 3.6 Instrument and record generation

PRISM, the screening and documentation layer built on the review's repository, is a static, dependency-free web tool over the published research data. It is the binding screening surface for the review (ADR-019), and reviewers screen in the tool, where the screening decision, the evidence grounding (reading, searching, and pinning text passages as per-category evidence), the reconciliation of divergent decisions, and record generation all live; a batch captured in a spreadsheet instead enters over an import bridge that converts the export into per-reviewer decision files with a validation report (vocabulary violations, empty reasons, duplicates, unknown identifiers). Its data model keeps AI and human decisions as separate sibling records and derives the PRISMA-trAIce adapted flow diagram (trAIce item R1) and a consolidated AI disclosure section (trAIce M-items plus RAISE Table 1 elements) from the recorded data rather than from hand-filled templates. The round-one record, carried through PRISM and generated from the surviving data, names per item what a reader can and cannot verify: of PRISMA 2020's 27 items, 10 are reconstructable, 7 partially, 10 not; of the 17 trAIce items, 13 are reconstructable, 3 partially, and one, the pre-specified protocol, is missing by definition, because a pre-specification cannot be created after the fact.

### 3.7 Agreement and divergence analysis

Decision agreement between the tracks is reported with the full statistic set: raw cells, observed agreement, Cohen's kappa, PABAK, kappa-max given the marginals, and the prevalence and bias indices, always together, because the decomposition in 5.2 shows how a single headline statistic misleads. Divergence is decomposed before it is interpreted, and it is reported as divergence, never as an error rate of either track, because no inter-human baseline exists for round one. All published numbers were independently recomputed from the raw data files; the recomputation documents are committed in the repository.

## 4. Study selection (the round-one record)

The corpus comprises 326 records. The human track carries 303 decisions (142 include, 161 exclude); 34 corpus records carry no human decision, a named gap of round one. The LLM track carries 326 decisions (232 include, 94 exclude). 291 records pair across the tracks by identifier; one pairing discrepancy (a 292nd record by one counting rule) remains unresolved pending a scripted re-pairing and is documented in the record. Human exclusion reasons distribute over duplicates (67), topical irrelevance (54), wrong publication type (17), missing full text (10), and a small residue of other and empty values; the empty and out-of-vocabulary values are themselves a finding about unenforced vocabularies that round two's import validation closes. [PENDING: figure F1, the generated trAIce-adapted flow diagram with separate AI and human lanes, from docs/data/flow_model.json after scripted replay.]

## 5. Screening agreement as a motivating illustration, and what the divergence is made of

### 5.1 The headline number and why it cannot stand alone

On the 291 paired decisions, the tracks agree on 149 (observed agreement 0.512): both include 100, both exclude 49, the LLM includes against a human exclude 108, the human includes against an LLM exclude 34. Cohen's kappa is 0.056, near chance. We had initially documented this near-chance agreement as a prevalence artifact; the adversarial recomputation showed that framing is backwards, since the prevalence-adjusted statistic PABAK is 0.024, lower still, and kappa-max given the marginals is 0.508. The low agreement is real, not a base-rate illusion. What the headline number hides is its composition.

### 5.2 Decomposition: task design before model judgment

The recorded exclusion reasons decompose the dominant divergence cell. Of the 108 papers the LLM included against a human exclusion, 72 carry reasons a paper-isolated model structurally cannot act on: 50 duplicates, 8 missing full texts, 14 wrong publication types. A model that sees one paper at a time cannot know that the same paper appeared twice in the corpus, that the PDF was never obtained, or that the venue type was out of scope; these are corpus-management judgments, not content judgments. Restricted to content judgments (n = 199), the picture changes: the include rates converge to 68.3 percent (LLM) against 67.3 percent (human), kappa rises to 0.194, and kappa-max rises to 0.977, which says the residual disagreement is genuine judgment scatter on a shared difficulty, not a marginal-distribution artifact. The often-reported inclusion bias of LLM screeners, on this corpus, is mostly a task-design artifact; what survives content-restriction is near-parity on the decision level with disagreement concentrated in particular categories. The supplementary two-by-two experiment adds one robust effect: knowledge-document input raises the LLM include rate in both models, and the fairness category degrades most under it. We report these as conditions of the measurement, with the mixed-condition caveat of 3.4.

The methodological point is not that the LLM screens well or badly. It is that our infrastructure corrected our own published interpretation, and that this correction was possible only because one field, the exclusion reason, had been recorded per decision. Had we recorded reasons as free prose, or not at all, the artifact share of the divergence would have been unrecoverable, and the wrong framing would have stood.

### 5.3 Corpus characteristics

[PENDING: category-level landscape of the included corpus (which technical and social categories co-occur, category frequencies, per-category agreement range 0.39 to 0.82 with social work and feminist highest and fairness lowest), from committed script over the merged data. The per-category kappas are licensed and recomputed; the frequency landscape needs the script run.]

## 6. The literature on prompt engineering for social work, gender, and bias (qualitative synthesis)

[PENDING: the qualitative synthesis of the review, following from the analysis coding (3.5). Frame, per sub-question:]

**SQ1, technique inventory.** [PENDING: which prompting technique families reach this literature, crossed with evidence type and mitigation status. Expected reporting: frequency table, narrative on the dominance pattern, e.g. whether General_Guidance and Role_Persona dominate over named techniques.]

**SQ2, bias-to-mitigation mapping.** [PENDING: co-occurrence of bias axes, harm types, and mitigation stages; which mitigations are evaluated rather than proposed.]

**SQ3, domain constraints and gaps.** [PENDING: explicit adaptation statements collected during coding; the zero cells of the technique-by-population table as the research-gap map.]

## 7. Discussion

[PENDING: substantive discussion of the SQ1 to SQ3 findings for social work practice and education, after coding.]

What can be discussed now is the methodological yield. First, the two-round design turns a common embarrassment, a review begun before reporting standards existed, into a usable contrast: the retrospective record shows precisely which trAIce and PRISMA items are recoverable from data and which are not, and the prospective round shows the same items falling out of recorded data by construction. The boundary runs where decisions stop being data: prose notes, unversioned prompts, and memory do not survive; per-decision fields do. Second, the divergence decomposition argues that human-LLM agreement studies on screening should separate corpus-management exclusions from content judgments before interpreting any agreement statistic; on our corpus the interpretation flips. Third, the dual-track design pays for itself not as automation but as epistemics: the LLM track surfaced category interpretations the experts then re-examined, and the human track exposed input-dependence in the model, the fairness degradation under distilled input being the clearest case. None of this requires claiming the LLM screens correctly; all of it requires keeping the tracks separate and recorded.

## 8. Limitations

Round one has named, unrepairable gaps: no pre-specified protocol, no per-decision reviewer attribution (hence no inter-human baseline; the round two overlap sample is designed to close this), and search provenance corroborated for only 34 of 326 records. The human track is one consolidated annotation; agreement statistics against it measure agreement with a merged product, not with an individual expert. The knowledge-document condition of the supplementary experiment is mixed (209 of 326 with knowledge documents). One pairing discrepancy (292 versus 291) awaits a scripted resolution. The analysis coding rests on decisions that are, at the time of this draft, simulated pending team ratification. The reporting standards we render against are proposals, not consensus instruments, and may change; we cite them with versions and dates. The user scenarios the instrument was built from were written by the technical lead as a proxy and are validated against the named users only at the project's validation session; one usage assumption (screening inside the tool) was already falsified and corrected during development, which we report as evidence for treating unvalidated scenarios as hypotheses.

## 9. AI use disclosure

[Generated section; final text falls out of the session data via the instrument.] Deep research systems (ChatGPT, Claude, Gemini, Perplexity; versions and run dates as recorded) performed literature identification under expert-written prompts; their outputs were independently supplemented by manual search. An LLM (Claude Haiku 4.5, model id and parameters as recorded in the committed assessment script) produced the advisory screening track; a second model (Claude Sonnet) and a distilled-input condition were used in the supplementary experiment. LLM-based coding assistants (Claude Code) were used to build the instrument, the verification documents, and drafts of this paper under human direction; all empirical numbers were recomputed from raw data independently of the drafting model, and the recomputation documents are committed. Costs are disclosed as factual values in the repository. Human decisions are binding throughout; no AI decision entered the corpus unreviewed.

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
- [PENDING: prior-art tool citations (EPPI-Reviewer, Nested Knowledge, DistillerSR, AIscreenR/Vembye et al.) with the exact references from knowledge/verification.md during venue formatting.]

*Updated: 2026-06-09. Draft status: sections 1 to 5, 7 (methods part), 8 to 10 written; sections 5.3, 6, and parts of 7 and 10 are frames pending analysis coding (TP4/TP5); flow figure pending scripted replay. Word count of written prose roughly in the lower half of the 6000 to 8000 corridor, leaving room for the synthesis sections.*
