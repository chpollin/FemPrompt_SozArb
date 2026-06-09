---
title: PRISMA Methodology
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: active
language: en
version: "0.1"
created: 2026-06-09
updated: 2026-06-09
authors: [Christopher Pollin]
generated-with: Claude Code (Claude Opus 4.8), deep-research web synthesis (21 primary sources)
topics: ["[[Systematic Review]]", "[[Reporting Guidelines]]", "[[PRISMA]]"]
related: [ai-assisted-review-standards, methods-and-pipeline, specification, project]
---

This note distills the PRISMA framework as the reporting backbone for the PRISMA screening tool (the standalone PRISM page; under the v4 pivot, ADR-012, PRISMA reporting lives on its "PRISMA & Report" surface, not the working Screening view). It covers what PRISMA is, the 2020 revision, the flow diagram and 27-item checklist, the extension family, and the boundary between PRISMA (reporting) and conduct standards such as Cochrane. The AI-specific layer (PRISMA-trAIce, RAISE, PRISMA 2020 items 8/9) is treated separately in [[ai-assisted-review-standards]], because that is where this project's methodological contribution sits. All claims are sourced; see the Sources section.

## What PRISMA is

PRISMA (Preferred Reporting Items for Systematic Reviews and Meta-Analyses) is a **reporting standard, not a conduct standard**. It specifies *what* must be transparently reported in a systematic review so a reader can understand why it was done, what the authors did, and what they found. It does not prescribe *how* to conduct a review, and it should not be used to assess methodological quality (other tools exist for that: AMSTAR 2, ROBIS).

PRISMA originated in 2009 as a renaming and update of the QUOROM statement (1999, *QUality Of Reporting Of Meta-analyses*, focused on meta-analyses of randomised controlled trials). PRISMA 2020 is the current revision.

Note on terminology: the relevant standard is **PRISMA**, not "PRISM" (an unrelated term). The only genuine predecessor is QUOROM.

## PRISMA 2020 vs PRISMA 2009

PRISMA 2020 (Page et al., BMJ 2021;372:n71) was developed from 2017, posted as a MetaArXiv preprint in September 2020, and published in March 2021. It replaces the 2009 statement and reflects a decade of methodological advances in identifying, selecting, appraising, and synthesising studies. Concrete changes (Box 2, "What's new"):

- The **protocol and registration** item moved to a new "Other information" section.
- **Search reporting** now requires full search strategies for *all* databases, registers, and websites searched, not just at least one.
- The **synthesis** item in Methods was split into six sub-items (and the Results synthesis item into four).
- **New items**: certainty/confidence in the evidence, competing interests, and public availability of data, analytic code, and other materials.

PRISMA 2020 also explicitly acknowledges automation: it references natural language processing and machine learning for identifying relevant evidence and asks that automation tools be disclosed (see [[ai-assisted-review-standards]]).

## Flow diagram and 27-item checklist

The **PRISMA 2020 checklist** has 27 items across seven sections (Title, Abstract, Introduction, Methods, Results, Discussion, Other information), some with sub-items, plus an expanded version with item-specific recommendations and a separate **PRISMA 2020 for Abstracts** checklist (12 items).

The **flow diagram** documents the flow of records through the review. PRISMA 2020 provides revised templates, with distinct versions for original and for updated reviews. A terminology caveat matters for the tool: PRISMA 2009 exposed four phases (Identification, Screening, Eligibility, Included); **PRISMA 2020 restructures the diagram around Identification, Screening, and Included** (the standalone "Eligibility" box is folded in). The tool follows the 2020 structure while still recording per-phase counts and exclusion reasons.

## Extension family

PRISMA is supplemented by a family of official reporting extensions for specific review types or report parts:

| Extension | Scope | Anchor |
|---|---|---|
| PRISMA-S | Literature search reporting (16 items) | Rethlefsen et al. 2021 |
| PRISMA-ScR | Scoping reviews | Tricco et al. 2018 |
| PRISMA-P | Review protocols (17 items) | Moher et al. 2015 |
| PRISMA for Abstracts | Reporting in abstracts (now integrated into 2020) | Beller et al. 2013 |
| PRISMA-DTA | Diagnostic test accuracy | McInnes et al. 2018 |

An AI-focused extension (**PRISMA-AI**) is registered with EQUATOR as "under development" (since May 2022) but not yet published; importantly it targets reviews *about* AI interventions, which is different from reporting AI used *as a tool* in the review process. That distinction is the subject of [[ai-assisted-review-standards]].

## PRISMA vs conduct standards (Cochrane, JBI)

PRISMA answers "is the report complete and transparent". It does **not** answer "was the review conducted rigorously". For conduct, the field uses comprehensive method resources (the Cochrane Handbook, the JBI Manual); for methodological quality and bias, separate instruments (AMSTAR 2, ROBIS, RoB 2, ROBINS-I). This project already references these alternatives in [[methods-and-pipeline]] (JBI, Cochrane 6.5, ENTREQ, MMAT). The screening tool is therefore a **reporting** instrument: it makes the selection process auditable; it does not replace expert methodological judgement.

## Relevance for this project

The review deviates from standard database searches: identification uses AI-assisted deep research (four models) plus a limited manual search. PRISMA explicitly permits such deviation **if it is documented and justified**, which this project does ([[methods-and-pipeline]], [[project]]). The dual assessment track (parallel, independent expert and LLM screening on identical 10-category criteria) is, in PRISMA terms, a fully documented selection process. What PRISMA 2020 alone does not yet operationalise, and what this project's tool must, is the transparent separation of AI-made from human-made screening decisions, which is exactly the contribution of [[ai-assisted-review-standards]].

## Sources

All verified against primary sources (peer-reviewed publications or official guideline websites), unanimous 3-0 verification:

- PRISMA history and development, official site: https://www.prisma-statement.org/history-and-development
- Page et al. 2021, PRISMA 2020 statement (BMJ 372:n71): https://systematicreviewsjournal.biomedcentral.com/articles/10.1186/s13643-021-01626-4 and https://pmc.ncbi.nlm.nih.gov/articles/PMC8008539/ (PMID 34446261)
- PRISMA extensions, official site: https://www.prisma-statement.org/extensions
- PRISMA 2020 flow diagram, official site: https://www.prisma-statement.org/prisma-2020-flow-diagram

## What this note does not cover

It does not reproduce the full 27-item checklist text (see the official statement) and does not cover the AI-reporting layer (PRISMA-trAIce, RAISE, items 8/9), which lives in [[ai-assisted-review-standards]]. It is a reference note, not a conduct manual; methodological how-to stays in [[methods-and-pipeline]].

## Related

- [[ai-assisted-review-standards]]
- [[methods-and-pipeline]]
- [[specification]]
- [[project]]

*Updated: 2026-06-09*
