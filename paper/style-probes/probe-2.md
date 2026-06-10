---
title: "Style Probe 2: Methodological Narrative Register"
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
related: [outline, verification-empirical-core, verification-novelty]
---

Style probe for the follow-up paper (TP6, see [[outline]]). Register: methodological narrative, argument-led, the workflow told as a sequence of methodological decisions and corrections, first person plural, honest about failures. Venue models: Research Synthesis Methods, DHQ. All numbers licensed by knowledge/verification-empirical-core.md, knowledge/verification-novelty.md, and knowledge/conformance-audit.md; no efficiency or cost framing.

## Working title

What We Could Not Reconstruct: A Two-Round Methodological Account of an LLM-Assisted Literature Review on Generative AI, Gender, and Social Work

## Abstract

Reporting standards for AI-assisted evidence synthesis exist as proposals: the PRISMA-trAIce checklist and the RAISE position statement appeared in 2025. Few accounts describe what happens when a review team tries to meet them on a review already under way. We conducted a literature review on generative AI, gender, bias, and social work, assessing a corpus of 326 papers in two parallel tracks, a consolidated human expert annotation and a batch LLM assessment, and we attempted to render the completed first round as a PRISMA 2020 and PRISMA-trAIce record. The attempt failed in instructive ways. A pre-specified protocol could not be created after the fact; search provenance could not be reconstructed for most records; and an adversarial recomputation overturned our documented interpretation of the headline agreement statistic, a correction possible only because exclusion reasons had been recorded per decision. We describe the screening instrument we built in response, whose data model derives the trAIce flow artifact and the AI disclosure section from recorded data, and the design of the prospective second round, in which conformance is enforced by construction. The contribution is the documented boundary between what reconstruction recovers and what must be recorded at the moment of the run.

## Introduction (first two paragraphs)

When we began screening the literature on generative AI, gender, bias, and social work, we made one decision that proved more consequential than we understood at the time: every paper in the corpus would be assessed twice, once in a consolidated human expert annotation and once by a batch LLM assessment, with exclusion reasons recorded alongside the human decisions. We made this choice for substantive reasons, because we wanted to observe how a language model judges contested categories such as fairness and gender, not for reporting reasons. Much else we did not do. We wrote no pre-specified protocol. We kept no record of which reviewer made which decision, and we did not store the executed search prompts at the moment they ran. With the PRISMA-trAIce checklist (Holst et al. 2025) and the RAISE position statement (Flemyng et al. 2025) now articulating, as proposals, what an AI-assisted review ought to disclose, we asked how much of a conformant record we could still produce for our completed first round of 326 papers from the data we happened to have kept.

The answer is the useful part of this paper. The retrospective rendering succeeded wherever decisions had been recorded as data and failed exactly where they had lived in prose or in nobody's memory: a pre-specification cannot be created after the fact, and our post-hoc attempt to recover search provenance corroborated 34 of 326 records. More uncomfortably, the audit corrected us. We had documented the near-chance decision agreement between the two tracks (Cohen's kappa 0.056 on 291 paired decisions) as a prevalence artifact; an adversarial recomputation showed that framing is backwards, since the prevalence-adjusted statistic is lower still (PABAK 0.024). The recorded exclusion reasons then revealed a different structure: 72 of the 108 papers the LLM included against a human exclusion had been excluded as duplicates, for missing full text, or for wrong publication type, corpus-management criteria invisible to a model that sees one paper at a time. Restricted to content judgments (n = 199), the include rates converge (68.3 against 67.3 percent) and kappa rises to 0.194. Our infrastructure corrected our own interpretation, but only because one field, the exclusion reason, had been captured per decision. That asymmetry between what recorded data can repair and what no reconstruction can recover is the design argument of this paper, and the instrument and second review round we describe are built directly on it.

## Claims sources

- 326 corpus papers, 291 paired decisions, kappa 0.056, PABAK 0.024, 72 of 108 (Duplicate, No full text, Wrong publication type), content-only n = 199 with include rates 68.3 and 67.3 percent and kappa 0.194, consolidated human annotation without per-record reviewer identity: knowledge/verification-empirical-core.md, sections "Recomputation, Benchmark core", "Sensitivity: content-only benchmark", "How to report kappa 0.056 so it cannot be dismissed", "The human track is one consolidated annotation, not a measured standard".
- 34 of 326 records with corroborated search provenance; no pre-registered protocol; prompts not committed at run time: knowledge/conformance-audit.md, sections "Non-auditable acquisition steps" and "No pre-registered protocol".
- PRISMA-trAIce (Holst et al. 2025) and RAISE position statement (Flemyng et al. 2025) as 2025 proposals; trAIce flow artifact and session-derived disclosure as the licensed contribution carriers: knowledge/verification-novelty.md, sections "Verified bibliographic status of the standards" and "Consequences for phrasing the contribution".
