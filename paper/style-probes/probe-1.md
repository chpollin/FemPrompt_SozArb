---
title: "Style Probe 1: Structured Empirical Methods Register"
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: draft
language: en
version: "0.1"
created: 2026-06-09
updated: 2026-06-09
authors: [Christopher Pollin]
generated-with: Claude Code
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
related: [outline, plan, verification]
---

Style probe for the follow-up paper ([[outline]], TP6 in [[plan]]): the opening written in one register only, as input for the style decision. Register of this probe: structured empirical methods register. Declarative, sober, IMRaD discipline, claims front-loaded; models are JMIR and PLOS methods papers. Every number is licensed by knowledge/verification.md, knowledge/verification.md, or knowledge/verification.md; the mapping is listed under Claims sources at the end. The register rules of the outline apply: no efficiency or cost framing, divergence reported as divergence and not as error, trAIce checklist items fully qualified ("trAIce item R1") to avoid collision with reviewer ids.

## Working title

Documenting Human and Large Language Model Screening Decisions in a Two-Round Literature Review on Generative AI, Gender, and Social Work: Conformance Audit and Instrument Development

## Abstract

Background: Reporting standards for AI-assisted evidence synthesis exist as proposals (PRISMA-trAIce) and position statements (RAISE) but are barely operationalized as working tools.

Objective: To audit which reporting items a completed dual-track review satisfies retrospectively, and to describe an instrument that generates conformant report artifacts from recorded decisions.

Methods: A review on generative AI, gender, bias, and social work (326 papers; 303 human and 326 large language model (LLM) records) was judged against PRISMA 2020 (27 items) and PRISMA-trAIce (17 items as encoded), each item against named repository files. Human-LLM divergence was recomputed from the raw assessment files and decomposed by recorded exclusion reasons.

Results: PRISMA 2020: 10 items reconstructable, 7 partial, 10 missing; PRISMA-trAIce: 13 reconstructable, 3 partial, 1 missing. The missing item, trAIce item M1 (pre-specified protocol), cannot be created after the fact. Decision-level agreement between the tracks was near chance (Cohen kappa 0.056); 72 of the 108 records the LLM included and the human track excluded reflect exclusion reasons outside the LLM's information basis, and content-only agreement rose to kappa 0.194.

Conclusions: Retrospective rendering recovers what was recorded as data. The second round runs through the instrument, whose flow diagram and AI disclosure are derivations of recorded decisions rather than prose.

## Introduction, first two paragraphs

PRISMA 2020 defines what a systematic review must report, but its 27 items leave the involvement of artificial intelligence (AI) in study selection invisible. Two responses appeared in 2025. PRISMA-trAIce (Holst et al., 2025) proposes a 17-item checklist along the PRISMA 2020 section structure, including an adapted flow diagram with separate fields for records screened by AI systems and by human reviewers (trAIce item R1); the checklist is a foundational proposal without a formal consensus process. The RAISE position statement (Flemyng et al., 2025), co-published across Cochrane, the Campbell Collaboration, JBI, and the Collaboration for Environmental Evidence, fixes mandatory reporting elements for AI use: system names, versions, and dates; purpose and stages; methodological justification; validation evidence; limitations; and interests. Neither standard is operationalized in working tools. As of June 2026, PRISMA-trAIce has 5 citing papers on Semantic Scholar, none implementing the checklist as software; screening platforms respond to RAISE with compliance documentation and static templates rather than conformant report generation. Keeping AI screening decisions as separate, advisory, reviewer-attributed records beside a binding human decision is established practice (EPPI-Reviewer, Nested Knowledge, DistillerSR); generating the standards' report artifacts from those records is documented for no surveyed tool.

This paper reports a literature review on generative AI, gender, bias, and social work whose corpus of 326 papers was assessed in two parallel tracks from the start: a consolidated human expert annotation (303 decision records: 142 Include, 161 Exclude) and a batch large language model (LLM) assessment (326 records), with category judgments on ten criteria. Its two rounds structure the design. Round one was conducted before any reporting instrument existed and without a pre-specified protocol; it is rendered retrospectively as a PRISMA 2020 plus PRISMA-trAIce record, every item judged against named repository files, every gap named, no conformance claim made. Round two, the literature update, runs prospectively through PRISM, a screening instrument whose data model holds AI and human decisions as separate first-class records, so that the trAIce-adapted flow diagram and the consolidated AI disclosure section are derived from the recorded data rather than written after the fact. The paper makes four contributions. To our knowledge, as of June 2026, PRISM is the first screening tool documented to emit the trAIce-adapted flow diagram (trAIce item R1) with separate tallies for AI and human decisions (C1), and the first documented to generate a consolidated AI disclosure section (trAIce M-items plus RAISE Table 1 elements) from session data (C2); the retrospective trAIce rendering of a completed two-round review is unpublished as of the same date (C3); and the divergence between the human and LLM tracks is decomposed by recorded exclusion reasons and reported as a motivating illustration of why reliability must be established by the process, as divergence and never as an error rate or an empirical finding (C4).

## Claims sources

- 326 papers, 303 human records (142 Include, 161 Exclude), 326 LLM records: knowledge/verification.md, section "1.1 (The benchmark core)".
- 27 PRISMA 2020 items, 17 trAIce items as encoded, tallies 10/7/10 and 13/3/1, trAIce item M1 missing and non-reconstructable by definition: knowledge/verification.md, opening section, section "2.2 (Conformance tally and findings)", and section "2.1 (the round-1 record, Protocol and pre-specification)".
- Cohen kappa 0.056, near-chance characterization, 72 of 108 divergent records attributable to Duplicate, No full text, or Wrong publication type, content-only kappa 0.194: knowledge/verification.md, sections "1.1 (The benchmark core)" and "1.4 (Decomposition, task artifacts versus content)".
- Ten category criteria: knowledge/verification.md, section "1.2 (Category agreement)".
- PRISMA-trAIce bibliographic facts (Holst et al. 2025, 14-item checklist, foundational proposal without formal consensus process, trAIce item R1 description), RAISE position statement facts (Flemyng et al. 2025, co-publication, Table 1 elements), 5 citing papers on Semantic Scholar with none implementing the checklist as software, vendor response as compliance documentation and static templates, prior-art status of EPPI-Reviewer, Nested Knowledge, and DistillerSR, "documented for no surveyed tool", C1 to C3 phrasings with the "to our knowledge, as of June 2026" hedge: knowledge/verification.md, sections "2.3 (Novelty verification, related work)", "2.3 (Novelty verification)", "2.3 (Novelty verification, Tool landscape)" and "2.3 (Novelty verification, the defensible contribution)".
- C4 framing (divergence, not error): knowledge/verification.md, section "1.6 (The human track, one consolidated annotation)".

*Updated: 2026-06-09*
