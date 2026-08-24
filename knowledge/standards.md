---
title: Reporting Standards (PRISMA 2020, PRISMA-trAIce, RAISE)
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: complete
language: en
version: "0.7"
created: 2026-06-09
updated: 2026-08-24
authors: [Christopher Pollin]
generated-with: Claude Code, deep-research web synthesis and full-text extraction of the primary sources
topics: ["[[PRISMA]]", "[[Reporting Standards]]", "[[AI in Evidence Synthesis]]"]
related: [specification, methods]
---

This note is the reporting-standards reference for the project. It covers PRISMA 2020 as the reporting backbone and the two 2025 frameworks that govern AI-assisted reviews, PRISMA-trAIce (how to document AI use) and RAISE (under what conditions AI use is permissible). It is the criterion the conducted review and the PRISM tool report against, and the canonical home for the standards' item counts and citations. All claims are sourced in the Sources section below.

## What PRISMA is

PRISMA (Preferred Reporting Items for Systematic Reviews and Meta-Analyses) is a reporting standard, not a conduct standard. It specifies what must be transparently reported in a systematic review so a reader can understand why it was done, what the authors did, and what they found. It does not prescribe how to conduct a review, and it should not be used to assess methodological quality; other tools exist for that, namely AMSTAR 2 and ROBIS.

PRISMA originated in 2009 as a renaming and update of the QUOROM statement (1999, QUality Of Reporting Of Meta-analyses, focused on meta-analyses of randomised controlled trials). PRISMA 2020 is the current revision.

A terminology note matters here, because the tool built in this project is called PRISM. The reporting standard is PRISMA, with the final A; PRISM is this project's screening tool. The only genuine predecessor of PRISMA is QUOROM.

## PRISMA 2020 vs PRISMA 2009

PRISMA 2020 (Page et al., BMJ 2021;372:n71) was developed from 2017, posted as a MetaArXiv preprint in September 2020, and published in March 2021. It replaces the 2009 statement and reflects a decade of methodological advances in identifying, selecting, appraising, and synthesising studies. The concrete changes (Box 2, "What's new"):

- The protocol and registration item moved to a new "Other information" section.
- Search reporting now requires full search strategies for all databases, registers, and websites searched, not just at least one.
- The synthesis item in Methods was split into six sub-items, and the Results synthesis item into four.
- New items were added for certainty/confidence in the evidence, competing interests, and public availability of data, analytic code, and other materials.

PRISMA 2020 also acknowledges automation. It references natural language processing and machine learning for identifying relevant evidence and asks that automation tools be disclosed, which is the hook the AI layer below sharpens.

## Flow diagram and 27-item checklist

The PRISMA 2020 checklist has 27 items across seven sections (Title, Abstract, Introduction, Methods, Results, Discussion, Other information), some with sub-items, plus an expanded version with item-specific recommendations and a separate PRISMA 2020 for Abstracts checklist (12 items).

The flow diagram documents the flow of records through the review. PRISMA 2020 provides revised templates, with distinct versions for original and for updated reviews. A terminology caveat matters for the tool. PRISMA 2009 exposed four phases (Identification, Screening, Eligibility, Included); PRISMA 2020 restructures the diagram around Identification, Screening, and Included, folding the standalone Eligibility box in. The tool follows the 2020 structure while still recording per-phase counts and exclusion reasons.

## Extension family

PRISMA is supplemented by a family of official reporting extensions for specific review types or report parts.

| Extension | Scope | Anchor |
|---|---|---|
| PRISMA-S | Literature search reporting (16 items) | Rethlefsen et al. 2021 |
| PRISMA-ScR | Scoping reviews | Tricco et al. 2018 |
| PRISMA-P | Review protocols (17 items) | Moher et al. 2015 |
| PRISMA for Abstracts | Reporting in abstracts (now integrated into 2020) | Beller et al. 2013 |
| PRISMA-DTA | Diagnostic test accuracy | McInnes et al. 2018 |

An AI-focused extension, PRISMA-AI, is registered with EQUATOR as "under development" (since May 2022) but not yet published. It targets reviews about AI interventions, which differs from reporting AI used as a tool in the review process. That second case is what the AI layer below covers.

## PRISMA vs conduct standards (Cochrane, JBI)

PRISMA answers whether the report is complete and transparent. It does not answer whether the review was conducted rigorously. For conduct, the field uses comprehensive method resources (the Cochrane Handbook, the JBI Manual); for methodological quality and bias, separate instruments (AMSTAR 2, ROBIS, RoB 2, ROBINS-I). The project references these alternatives in [[methods]] (JBI, Cochrane 6.5, ENTREQ, MMAT). The screening tool is therefore a reporting instrument; it makes the selection process auditable but does not replace expert methodological judgement.

## PRISMA-trAIce (Holst et al. 2025, JMIR AI)

PRISMA-trAIce (Transparent Reporting of Artificial Intelligence in Comprehensive Evidence-synthesis) is a discipline-agnostic extension to PRISMA 2020 that closes a specific gap. PRISMA-AI (announced 2022, unpublished) targets reviews about AI; PRISMA-trAIce targets AI used as a tool within the review process. It is a 17-item checklist mapped onto the PRISMA 2020 section structure (14 non-optional, that is 10 mandatory plus 3 recommended plus 1 highly recommended, and 3 optional). It does not replace PRISMA; it sharpens PRISMA 2020 items 8 (selection process) and 9 (data collection), which already ask that automation tools be disclosed.

A status caveat governs how to cite it. The authors call it a "well-founded proposal," not a formally endorsed extension. It has not undergone a Delphi or consensus process and is governed as a living guideline (GitHub single source of truth at https://github.com/cqh4046/PRISMA-trAIce, MIT license, plus a Discord community and planned annual reviews). In writing, reference it as a proposed extension.

### The 17 items (verbatim, with priority level)

| ID | Section | Level | Item (abridged where long) |
|---|---|---|---|
| T1 | Title | Optional | Indicate AI assistance in title/subtitle if AI played a substantial role (e.g. primary screening, data extraction). |
| A1 | Abstract | Optional | Summarise the AI tool(s) used, the SLR stage(s) applied, and their primary role. |
| I1 | Introduction | Recommended | State the rationale for using AI tools for specific tasks (volume, efficiency, novel methods). |
| M1 | Methods | Mandatory | State whether AI use was pre-specified in the protocol and where it can be accessed; report deviations. |
| M2 | Methods | Mandatory | For each tool: name, version, developer/provider; how to access; for custom tools, core functionality and how to replicate (code repo, base model). |
| M3 | Methods | Mandatory | The specific SLR stage(s) and the precise task(s) the AI performed at each stage. |
| M4 | Methods | Mandatory | Input data provided to the tool (training/fine-tuning/calibration data, or review data fed in: search results, abstracts, full texts). |
| M5 | Methods | Mandatory | Output data: format (e.g. structured JSON, classification labels with confidence scores) and any automated post-processing before human review. |
| M6 | Methods | Mandatory | Prompt engineering: full prompts (or detailed structure and few-shot examples) and where accessible; key parameters (temperature, max tokens, top-p); iterative refinement process. |
| M7 | Methods | Highly recommended | For non-LLM tools: algorithms/models; settings/parameters (e.g. classification thresholds, active-learning parameters). |
| M8 | Methods | Mandatory | Human-AI interaction and oversight: how many reviewers validated AI outputs; whether independent; reviewer qualifications; how outputs were presented; what proportion of AI outputs were manually verified; how AI-human discrepancies were resolved; calibration procedures. |
| M9 | Methods | Mandatory | Methods to evaluate AI performance: reference standard (e.g. consensus human decisions); metrics (accuracy, sensitivity, specificity, precision, recall, F1); bias/error-rate analyses; pilot/validation phases. |
| M10 | Methods | Recommended | Data governance: how input/output/intermediate data was managed and stored; privacy, security, copyright/ToS compliance. |
| R1 | Results | Mandatory | Flow diagram and text clearly distinguish records included/excluded by AI tool decisions vs human reviewer decisions at each screening stage; report number of records processed by AI and the outcomes. |
| R2 | Results | Mandatory | Report results of AI performance evaluations (from M9), including quantitative results and AI-human agreement. |
| D1 | Discussion | Recommended | Limitations of AI use (technical issues, biases, hallucinations, prompt-engineering challenges) and how they may have influenced the review. |
| D2 | Discussion | Optional | The experience of using AI: benefits, challenges, usability, implications for future reviews. |

### Adapted flow diagram

The core modification is the addition of separate fields to distinguish exclusions made by human reviewers from those made by AI systems at each screening stage, while preserving the familiar PRISMA layout. It also separates rule-based administrative tools (e.g. deduplication) from evaluative AI systems. This is item R1 made visual, and it is the signature artefact of the report layer. The flow diagram, checklist, and disclosure are generated from stored records through internal report utilities (see [[specification]] ADR-012, ADR-020, and ADR-029). The agreement matrix and kappa are no longer computed in the editor (ADR-014/017); agreement is evaluated externally on the benchmark corpus. The working Screening view is centred on reading, searching, and pinning evidence (FR-11 to FR-13), without the divergence apparatus.

## RAISE (Cochrane, Campbell, JBI, CEE, Nov 2025)

RAISE (Responsible use of AI in evidence SynthEsis) is a joint position statement of the four major evidence-synthesis organisations, which have also formed a joint AI Methods Group (2025). It is governance, not reporting. Three core principles, verbatim:

1. "Evidence synthesists are ultimately responsible for their evidence synthesis, including the decision to use artificial intelligence (AI) and automation."
2. "AI and automation in evidence synthesis should be used with human oversight."
3. "Any use of AI or automation that makes or suggests judgements should be fully and transparently reported in the evidence synthesis report."

AI that makes or suggests judgements must be declared, explicitly including study eligibility decisions (screening, include-exclude), risk-of-bias, data extraction, synthesis, GRADE, and drafting. AI for spelling, grammar, or structure need not be. The acceptability criterion is that authors can use AI and automation as long as they can demonstrate that it will not compromise the methodological rigor or integrity of their synthesis, and they may need to pilot or calibrate the AI system to validate its performance.

The mandatory reporting elements (RAISE Table 1) are the AI system name(s), version(s), and date(s); the purpose and stages affected; a justification that the tool is methodologically sound; evidence of validation or performance evaluation; known limitations and biases; and financial or non-financial interests in the AI tool. RAISE points to PRISMA for the reporting mechanics and asks that inputs (prompt development), outputs, datasets, and code be made publicly available. RAISE comes as a three-part package, RAISE 1 (recommendations for practice), RAISE 2 (building and evaluating tools), RAISE 3 (selecting and using tools), Thomas et al. 2025a/b/c.

## Publication versions and peer-review metadata

The project uses the NISO Journal Article Versions terminology as the bibliographic basis for publication stages and Crossref's versioning guidance for relations between expressions. A Work denotes the underlying scholarly contribution. A Version denotes the exact expression used by the review, including a Preprint, Accepted Manuscript, proof, Version of Record, or corrected Version of Record. The operational vocabulary in `docs/data/work_version_contract.json` extends these terms where the corpus needs a submitted manuscript, working paper, enhanced Version of Record, or unknown stage.

Publication stage and peer-review status answer different questions. An Accepted Manuscript indicates acceptance and therefore normally follows journal peer review, but the metadata records the supporting basis explicitly. A Version of Record identifies the publisher's definitive expression and carries no automatic project-level assertion about the venue's review procedure. Preprints can later relate to an Accepted Manuscript or Version of Record without losing their own identifiers. The registry therefore stores `version_type`, `peer_review_status`, and `peer_review_basis` independently.

The preferred Version is the expression normally selected for screening under the project rule: a current corrected or enhanced Version of Record outranks a Version of Record, followed by an Accepted Manuscript and then a Preprint. Access and integrity constraints can alter that choice. The latest Version is determined chronologically and remains a separate field. This project mapping is an operational decision documented in [[specification#ADR-037 Stable Work identity and exact publication Version provenance]].

## Mapping onto this project's workflow

The project has two reporting situations. Round one is a conducted comparative expert and LLM assessment that can only be rendered retrospectively from its surviving records. Round two uses a governed agent workflow whose domain-expert verification remains open. The evidence behind the status judgements lives in the data, run manifests, generated conformance map, and the Evidence Companion. Status values are Satisfied, Partial, or Gap.

| Requirement | Project artefact | Status |
|---|---|---|
| trAIce M2: tool identity | Model identifiers are stored in round-one artifacts and each governed round-two run; identification systems are named in the method record | Partial because some round-one execution metadata is unrecoverable |
| trAIce M3: stage and task | Identification, text preparation, screening, AI Agent Review, analysis, and drafting are distinguished by activity | Satisfied |
| trAIce M4: input data | Round one distinguishes title and abstract from knowledge-document conditions; PRISM records the Paper source actually read and each run binds source hashes | Satisfied for recorded operations |
| trAIce M5: output format and post-processing | Structured JSON, immutable annotation versions, deterministic PRISM projection, and recorded derivations | Satisfied |
| trAIce M6: prompts and parameters | Versioned prompts and changelog for current runs; legacy prompt instances and some decoding parameters remain unavailable | Partial |
| trAIce M8: human oversight | Round one has a consolidated expert annotation and a separately executed LLM assessment. Round two assigns final verification to domain experts after AI Agent Review | Partial until round-two domain-expert verification is complete; no round-one inter-human baseline |
| trAIce M9 and R2: AI performance evaluation | Canonical replay, full statistic set, and divergence analysis against the consolidated expert track | Satisfied as an expert-reference comparison; no human consensus standard |
| trAIce R1: flow diagram, AI versus human split | Actor and activity records support the adapted flow rendering | Built; final paper rendering pending |
| trAIce M10: data governance | Versioned research data, local rights-gated full texts, source hashes, and explicit public-release boundary | Satisfied |
| trAIce M1: protocol pre-specification of AI use | Round one has no pre-specified protocol. Round two has an initial protocol and dated amendments | Gap for round one; Partial for round two |
| RAISE P1: accountability | [[governance]] assigns final scholarly authority and publication approval to people | Satisfied |
| RAISE P2: human oversight | Domain-expert verification is implemented as a distinct lifecycle stage | Partial until the intended corpus has been verified |
| RAISE P3: transparent reporting of AI judgements | Run manifests, prompt governance, actor provenance, and disclosure fields are implemented | Partial until the final consolidated disclosure is generated |
| RAISE Table 1: justification and performance evidence | Round-one benchmark, governed round-two runs, and [[verification]] provide the evidence structure | Partial until the completed workflow is verified |
| RAISE Table 1: conflicts of interest in AI tool | Declaration required in the final manuscript | Gap |

## Konformanzstand dieses Reviews

Der Item-für-Item-Status dieses Reviews gegen PRISMA 2020, PRISMA-trAIce und RAISE liegt als maschinenlesbares Artefakt in `generated/conformance/conformance_map.yaml`. Jeder Eintrag trägt Standard, Item-Kennung, Kurzbezeichnung, Status (reconstructable, partial, gap, not_applicable), Quellpfad oder benannte Lücke und die Nuance, die nicht in die Felder passt. Der Record-Generator speist sich aus dieser Datei. Die Round-one-Wiedergabe liefert die zählenden Werte, während die Konformanzbewertung die `partial`- und `gap`-Einträge in die transparente Berichterstattung übernimmt.

Die zählenden Items behauptet der committete Replay `src/replay/replay_round1.py`. Er paart die Roh-CSVs über den `Zotero_Key`, reproduziert die kanonische `generated/benchmark-results/agreement_metrics.json` als Selbsttest und schreibt danach `flow_model.json` und `agreement_replay.json` nach `generated/benchmark-results/replay/`. Für ein zählendes Item bedeutet der Status `reconstructable`, dass sein Wert aus diesen Ausgaben hervorgeht. Der Record-Generator liest diese Ausgaben; frühere Handzählungen sind damit abgelöst.

Die zentrale, retrospektiv unreparierbare Lücke ist das fehlende Runde-1-Protokoll (PRISMA-trAIce M1, PRISMA 24a-c). Der KI-Einsatz war in Runde 1 nicht vorab spezifiziert. Für Runde 2 lag ein erster Protokollstand vor den Suchen vor; einzelne operative Regeln wurden während oder nach der Ausführung als datierte Amendments festgelegt. Prospektive Konformanz wird deshalb nur für jene Operationen beansprucht, deren einschlägige Regeln nachweislich vorher committet waren.

Drei weitere benannte Lücken hängen am Korpus statt an einem Checklistenpunkt und tragen deshalb keine eigene Zeile im maschinenlesbaren Artefakt. Erstens Korpuspapiere, die durch den LLM-Strang liefen und in `assessment/human_assessment.csv` fehlen; sie stehen im Flow als Datensätze ohne bindende menschliche Entscheidung und werden nie stillschweigend eingeschlossen. Zweitens Teile der PDF-Beschaffung ohne vollständigen Audit-Trail, denn die Kette aus Beschaffung, Konvertierung und Destillation verliert auf jeder Stufe Material ([[methods]], Stage 2). Drittens Datensätze ohne Volltext als Folge ebendieser Verluste; die fehlgeschlagenen Konvertierungen sind in [[methods]] namentlich aufgeführt.

Die meta-analytischen PRISMA-Items sind für diesen Reviewtyp not_applicable. Als qualitatives Feld-Review mit Screening und Kategorisierung, ohne Meta-Analyse, ohne studienweise Risk-of-Bias-Bewertung, ohne Effektmasse und ohne Gewissheitsbewertung, treffen die Items 11 bis 15 sowie 18, 20, 21 und 22 nicht zu.

## Interpretation for this review

The round-one benchmark supports PRISMA-trAIce M9 and R2 as a comparison against one consolidated expert track. Its divergence measures differences between the recorded products. The missing inter-human baseline prevents classification of those differences as model error rates. Round two implements the M8 oversight path through deferred domain-expert verification of every intended productive record. That requirement remains partially satisfied until the verification events exist. [[verification]] carries the current evidence and authority state.

## Sources

All verified against primary sources (peer-reviewed publications or official guideline websites).

PRISMA:
- PRISMA history and development, official site: https://www.prisma-statement.org/history-and-development
- Page et al. 2021, PRISMA 2020 statement (BMJ 372:n71): https://systematicreviewsjournal.biomedcentral.com/articles/10.1186/s13643-021-01626-4 and https://pmc.ncbi.nlm.nih.gov/articles/PMC8008539/ (PMID 34446261)
- PRISMA extensions, official site: https://www.prisma-statement.org/extensions
- PRISMA 2020 flow diagram, official site: https://www.prisma-statement.org/prisma-2020-flow-diagram

AI layer:
- PRISMA-trAIce: Holst et al. 2025, JMIR AI 4:e80247, https://ai.jmir.org/2025/1/e80247 (DOI 10.2196/80247); repository (MIT) https://github.com/cqh4046/PRISMA-trAIce; PMC mirror https://pmc.ncbi.nlm.nih.gov/articles/PMC12694947/
- RAISE: joint position statement (Cochrane, Campbell, JBI, CEE), Nov 2025; open-access mirror https://pmc.ncbi.nlm.nih.gov/articles/PMC12603384/ (also JBI Evidence Synthesis, Cochrane Library ED000178, Environmental Evidence 10.1186/s13750-025-00374-5)

Publication versions:
- NISO RP-8-2008, Journal Article Versions (JAV): https://niso.org/publications/niso-rp-8-2008-jav
- Crossref, Best practices for versioning: https://crossref.org/documentation/principles-practices/best-practices/versioning/

## Related

- [[specification]]
- [[methods]]
- [[project]]
- [[governance]]
- [[verification]]
