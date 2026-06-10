---
title: "Style Probe 3: Infrastructure Register"
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
related: [outline, plan, verification-empirical-core, verification-novelty, conformance-audit]
---

Probe for the style decision on the follow-up paper (TP6 in [[plan]]). Register: infrastructure register. The epistemic infrastructure is the protagonist, the design rationale leads, the review appears as the case the infrastructure carries. Models: tool and infrastructure papers in digital humanities and meta-research. Content limits follow the claims discipline of [[outline]]; every number below is licensed by knowledge/verification-empirical-core.md, knowledge/verification-novelty.md, or knowledge/conformance-audit.md.

## Working title

PRISM: An Epistemic Infrastructure for Conformant-by-Construction Reporting of Human and LLM Screening Decisions

## Abstract

Reporting standards for AI-assisted evidence synthesis are young: the PRISMA-trAIce checklist (2025) proposes fourteen items along the PRISMA 2020 section structure, and the RAISE position statement (2025) fixes mandatory disclosure elements across four evidence synthesis organizations. As of June 2026, neither has been operationalized as a data model in a working screening tool beyond one early-stage prototype; vendors respond with compliance documentation rather than conformant report generation. We present PRISM, a screening infrastructure built in the opposite direction: AI and human decisions are recorded as separate first-class records with pinned evidence, recorded text source, and enforced vocabularies, so that the trAIce-adapted flow diagram (trAIce item R1), the AI disclosure section, and both filled checklists are derivations of the data, not prose written after the fact. The infrastructure carries a real case, a literature review on generative AI, gender, bias, and social work (326 papers, dual human and LLM assessment from the start). Round one, conducted before the instrument existed, is rendered retrospectively with every gap named; a conformance audit found 10 of 27 PRISMA 2020 items and 13 of 17 trAIce items reconstructable from the repository. Round two runs through the instrument, with conformance enforced by construction.

## Introduction, first two paragraphs

A reporting checklist can only be filled with what was recorded, and most of what AI-assisted screening does is never recorded as data. PRISMA 2020 structures the reporting of systematic reviews in 27 items, but AI involvement is invisible in it: its flow diagram does not show which records a model excluded, and no item asks which prompt version ran on which date. Two standards now address this gap. The PRISMA-trAIce checklist (Holst et al. 2025) is a proposed extension with fourteen items along the PRISMA 2020 section structure; its adapted flow diagram adds separate fields for records screened by AI systems and by human reviewers (trAIce item R1). The RAISE position statement (Flemyng et al. 2025), co-published across Cochrane, the Campbell Collaboration, JBI, and the Collaboration for Environmental Evidence, fixes mandatory disclosure elements from system names and versions to validation evidence. Both are young: PRISMA-trAIce calls itself a foundational proposal without formal consensus process, and the RAISE guidance documents are under journal review as of the survey date. Both are also, to our knowledge as of June 2026, barely operationalized as software: no surveyed screening tool emits the trAIce item R1 flow split or generates a disclosure section from session data, and vendors respond with compliance documentation rather than conformant report generation.

This paper presents PRISM, a screening infrastructure that treats the standards as requirements on a data model rather than writing instructions. Its design rule is that every report artifact must be a derivation of recorded data: AI and human decisions persist as separate first-class records, every decision carries actor, evidence basis, and text source, vocabularies are enforced at the input surface, and the trAIce-adapted flow diagram, the disclosure section, and both checklists fall out of those records. The case the infrastructure carries is a literature review on generative AI, gender, bias, and social work: 326 papers, screened from the start in two parallel tracks, a consolidated human expert annotation (303 records: 142 Include, 161 Exclude) and a batch LLM assessment (326 records). The review's first round was conducted before the instrument existed, and that is the point. A conformance audit judged every item of PRISMA 2020 and of trAIce (17 items as encoded in the instrument) against named repository files: 10 of 27 and 13 of 17 are reconstructable, and the one hard gap, the pre-specified protocol (trAIce item M1), is non-reconstructable by definition. That boundary between the reconstructable and the unrecoverable is the infrastructure's design specification. Round one is therefore rendered retrospectively as an honest record, every gap named, with no conformance claim; round two, the literature update, runs prospectively through the instrument, with conformance enforced by construction.

## Claims licensing notes

- Fourteen trAIce items, proposal status, item R1 description, RAISE co-publication and Table 1 scope, guidance under journal review, operationalization gap, vendor response, single early-stage prototype: knowledge/verification-novelty.md.
- 326 papers, 303 human records (142 Include, 161 Exclude), 326 LLM records: knowledge/verification-empirical-core.md, section "Recomputation, Benchmark core".
- 27 PRISMA 2020 items, 17 trAIce items as encoded, tallies 10 of 27 and 13 of 17 reconstructable, M1 missing and non-reconstructable by definition: knowledge/conformance-audit.md, section "Tally" and "No pre-registered protocol".
- "Honest retrospective record, no conformance claim for round one": knowledge/plan.md, section "Stage R" (claim line).
- Register constraints observed: no efficiency, time-saving, or cost-benefit claims; no error-rate language; survey-date hedge carried in the introduction.
