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
related: [outline]
---

Style probe for the follow-up paper (TP6, see [[outline]]). Register: methodological narrative, argument-led, the workflow told as a sequence of methodological decisions and corrections, first person plural, honest about failures. Venue models: Research Synthesis Methods, DHQ. Numbers are licensed by the data (benchmark/results/, docs/data/) and the Evidence Companion; no efficiency or cost framing.

## Working title

What We Could Not Reconstruct: A Two-Round Methodological Account of an LLM-Assisted Literature Review on Generative AI, Gender, and Social Work

## Abstract

Reporting standards for AI-assisted evidence synthesis exist as proposals: the PRISMA-trAIce checklist and the RAISE position statement appeared in 2025. Few accounts describe what happens when a review team tries to meet them on a review already under way. We conducted a literature review on generative AI, gender, bias, and social work, assessing the corpus in two parallel tracks, a consolidated human expert annotation and a batch LLM assessment, and we attempted to render the completed first round as a PRISMA 2020 and PRISMA-trAIce record. The attempt failed in instructive ways. A pre-specified protocol could not be created after the fact; search provenance could not be reconstructed for most records; and recomputation from the raw files revised our documented interpretation of the headline agreement statistic, a correction possible only because exclusion reasons had been recorded per decision. We describe the screening instrument we built in response, whose data model derives the trAIce flow artifact and the AI disclosure section from recorded data, and the design of the prospective second round, in which conformance is enforced by construction. The contribution is the documented boundary between what reconstruction recovers and what must be recorded at the moment of the run.

## Introduction (first two paragraphs)

When we began screening the literature on generative AI, gender, bias, and social work, we made one decision that proved more consequential than we understood at the time: every paper in the corpus would be assessed twice, once in a consolidated human expert annotation and once by a batch LLM assessment, with exclusion reasons recorded alongside the human decisions. We made this choice for substantive reasons, because we wanted to observe how a language model judges contested categories such as fairness and gender, not for reporting reasons. Much else we did not do. We wrote no pre-specified protocol. We kept no record of which reviewer made which decision, and we did not store the executed search prompts at the moment they ran. With the PRISMA-trAIce checklist (Holst et al. 2025) and the RAISE position statement (Flemyng et al. 2025) now articulating, as proposals, what an AI-assisted review ought to disclose, we asked how much of a conformant record we could still produce for our completed first round from the data we happened to have kept.

The answer is the useful part of this paper. The retrospective rendering succeeded wherever decisions had been recorded as data and failed exactly where they had lived in prose or in nobody's memory: a pre-specification cannot be created after the fact, and our post-hoc attempt to recover search provenance corroborated only a small fraction of records. More uncomfortably, recomputation corrected us. We had documented the near-chance decision agreement between the two tracks as a prevalence artifact; recomputation from the raw files showed that framing is backwards, since the prevalence-adjusted statistic is lower still. The recorded exclusion reasons then revealed a different structure: most of the papers the LLM included against a human exclusion had been excluded as duplicates, for missing full text, or for wrong publication type, corpus-management criteria invisible to a model that sees one paper at a time. Restricted to content judgments, the include rates converge and agreement rises. Our infrastructure corrected our own interpretation, but only because one field, the exclusion reason, had been captured per decision. That asymmetry between what recorded data can repair and what no reconstruction can recover is the design argument of this paper, and the instrument and second review round we describe are built directly on it.

## Claims sources

- Corpus and paired-decision counts, agreement statistics, the decomposition of divergent records by exclusion reason, content-only convergence, consolidated human annotation without per-record reviewer identity: the data (benchmark/results/, docs/data/) and the Evidence Companion.
- Corroborated search provenance, no pre-registered protocol, prompts not committed at run time: derive from the per-item judgment against named repository files.
- PRISMA-trAIce (Holst et al. 2025) and RAISE position statement (Flemyng et al. 2025) as 2025 proposals; trAIce flow artifact and session-derived disclosure as the licensed contribution carriers: the cited primary sources and the tool survey.
