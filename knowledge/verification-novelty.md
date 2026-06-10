---
title: "Verification: Methodological Novelty"
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: active
language: en
version: "0.1"
created: 2026-06-09
updated: 2026-06-09
authors: [Christopher Pollin]
generated-with: Claude Code
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
related: [plan, ai-assisted-review-standards, specification]
---

This document records a web verification (conducted 2026-06-09 via web search and direct fetching of primary sources) of the claim: "PRISMA-trAIce (2025) and RAISE (2025) have hardly been operationalized as data models or working tools; existing screening tools do not implement the trAIce R1 AI-vs-human flow split or RAISE-style disclosure generation. A tool whose screening record is conformant by construction is a real methodological contribution." The verification was deliberately adversarial: the goal was to find existing tools and publications that already do what PRISM does.

## Verdict

The claim **holds partially**. The part that holds: no surveyed tool emits the PRISMA-trAIce adapted flow diagram (R1, AI exclusions vs human exclusions as separate fields), no surveyed tool auto-generates a trAIce or RAISE disclosure section from session data (the closest are static reporting templates from Covidence and documentation pages from Nested Knowledge), and the only software artifact that invokes PRISMA-trAIce by name is a two-commit, zero-star prototype from April 2026. The part that is **refuted**: the underlying design idea of recording AI screening decisions as a separate, reviewer-attributed, advisory record next to a binding human decision is established practice in at least three mature tools (EPPI-Reviewer, Nested Knowledge Robot Screener, DistillerSR) and is marketed by Elicit. The paper must therefore not claim novelty for AI-human decision separation as such; the defensible contribution is conformance by construction at the report-artifact level (R1 flow diagram and session-derived disclosure generation) plus the retrospective trAIce rendering of an already-conducted review, for which no published precedent was found.

## Verified bibliographic status of the standards

### PRISMA-trAIce

Holst, Dirk; Moenck, Keno; Koch, Julian; Schmedemann, Ole; Schüppstuhl, Thorsten: "Transparent Reporting of AI in Systematic Literature Reviews: Development of the PRISMA-trAIce Checklist." JMIR AI, vol. 4 (2025), article e80247, DOI 10.2196/80247, published 2025-12-10. Source: https://ai.jmir.org/2025/1/e80247 (accessed 2026-06-09); PMC mirror: https://pmc.ncbi.nlm.nih.gov/articles/PMC12694947/ (accessed 2026-06-09).

Verified properties:

- 14-item checklist organized along the PRISMA 2020 section structure (title, abstract, introduction, methods, results, discussion), items graded Mandatory, Highly Recommended, Recommended, Optional.
- Endorsement status: explicitly a "foundational proposal"; the authors state the checklist "has not yet undergone" a formal consensus process and that the development was "not a formal, large-scale consensus-building exercise, such as a Delphi study." It is not endorsed by the PRISMA group or registered with EQUATOR as a formal extension. Cite as a proposed extension.
- Living guideline governance: GitHub repository as "single source of truth" plus a Discord community hub with planned annual reviews. Official repository: https://github.com/cqh4046/PRISMA-trAIce (MIT license, created 2025-06-18, accessed 2026-06-09 via GitHub API).
- The adapted flow diagram distinguishes rule-based administrative tools from evaluative AI systems and adds "specific fields to report the number of records screened separately by AI systems versus human reviewers" (item R1). Source: https://ai.jmir.org/2025/1/e80247 (accessed 2026-06-09).
- Citation uptake: 5 citing papers on Semantic Scholar as of 2026-06-09 (source: https://api.semanticscholar.org/graph/v1/paper/DOI:10.2196/80247, accessed 2026-06-09). The citing works apply or reference the checklist; none implements it as software.

### RAISE

RAISE has two layers that must be cited separately.

Position statement: Flemyng, Ella; Noel-Storr, Anna; Macura, Biljana; Gartlehner, Gerald; Thomas, James; Meerpohl, Joerg J.; Jordan, Zoe; Minx, Jan; Eisele-Metzger, Angelika; Hamel, Candyce; Jemioło, Paweł; Porritt, Kylie; Grainger, Matthew: "Position Statement on Artificial Intelligence (AI) Use in Evidence Synthesis Across Cochrane, the Campbell Collaboration, JBI, and the Collaboration for Environmental Evidence 2025." Published 2025-11-10, co-published identically in Cochrane Database of Systematic Reviews (ED000178), Campbell Systematic Reviews (DOI 10.1002/cl2.70074), JBI Evidence Synthesis, and Environmental Evidence (DOI 10.1186/s13750-025-00374-5). Source: https://pmc.ncbi.nlm.nih.gov/articles/PMC12603384/ (accessed 2026-06-09). The statement carries the mandatory reporting elements (Table 1: AI system names, versions, dates; purpose and stages; justification of methodological soundness; validation evidence; limitations and biases; interests and funding).

Recommendations and guidance: Thomas et al., "Responsible use of AI in evidence SynthEsis (RAISE): recommendations and guidance," three documents (RAISE 1 recommendations for practice, RAISE 2 building and evaluating AI evidence synthesis tools, RAISE 3 selecting and using AI evidence synthesis tools), published on the Open Science Framework, DOI 10.17605/OSF.IO/FWAUD, https://osf.io/fwaud/ (accessed 2026-06-09). Status update relevant for citation: substantially revised versions of all three papers were published on OSF on 2026-03-13 and submitted to Research Synthesis Methods for peer review (source: https://osf.io/fwaud/wiki/home/ via web search, accessed 2026-06-09). The guidance documents are therefore preprint-level, not journal-published; the position statement is journal-published. Check for a Research Synthesis Methods publication before paper submission and cite the OSF version with its version date otherwise.

## Operationalization of the standards as tools

Direct search for implementations (GitHub API repository search for "PRISMA-trAIce", accessed 2026-06-09, https://api.github.com/search/repositories?q=PRISMA-trAIce) returns three repositories:

1. cqh4046/PRISMA-trAIce: the official checklist repository (MIT). Checklist artifacts, not a tool.
2. varlet99/prisma-traice-review-tool: "Outil web de revue systématique assistée par IA (PRISMA 2020), FastAPI + React + support multi-fournisseurs LLM", created 2026-04-15, 2 commits, 0 stars, no releases. https://github.com/varlet99/prisma-traice-review-tool (accessed 2026-06-09). It records LLM screening decisions (include/exclude/uncertain with justification) and lets humans validate, modify, or cancel an AI decision; it generates an automatic PRISMA 2020 SVG diagram and exports a methodology PDF. Its README does not document an R1-style AI-vs-human split in the diagram, does not confirm whether AI and human decisions persist as separate fields or whether the human decision overwrites the AI decision, and does not confirm trAIce checklist or disclosure emission. This is the only tool found that invokes PRISMA-trAIce by name; it is an early-stage prototype, and it must be cited as nearest related software.
3. seandavi/agentic-writing-patterns: a narrative review paper project (created 2026-05-20) that self-describes as "PRISMA-trAIce-compliant" with Claude as a collaborator. https://github.com/seandavi/agentic-writing-patterns (accessed 2026-06-09). Not a screening tool, but evidence that the "trAIce-compliant by construction" framing has begun to appear in the wild as of May 2026.

In the citing literature, the most relevant operationalization is an assessment instrument, not a tool: Lin et al. (author list not verified in detail), "Evaluating the Methodological Quality of Artificial Intelligence-Assisted Systematic Reviews: Protocol for a Mixed Methods Meta-Research Study," JMIR Research Protocols 2026, e90588, https://www.researchprotocols.org/2026/1/e90588 (accessed 2026-06-09). It refines and applies an "AI Transparency and Disclosure Index (AITDI)" retrospectively to published AI-assisted systematic reviews 2023 to 2025. This is retrospective assessment of disclosure quality, adjacent to but distinct from PRISM's retrospective rendering of one's own review as a trAIce-conformant artifact.

Conclusion for this section: as of 2026-06-09, neither PRISMA-trAIce nor RAISE has been operationalized as a data model in a working screening tool beyond the varlet99 prototype. Vendors respond to RAISE with compliance documentation, not with conformant report generation (see next section).

## Tool landscape

Criteria, following the verification brief: (i) AI screening features; (ii) the AI decision kept as a separate, advisory, reviewer-attributed record next to the binding human decision; (iii) emission of trAIce/RAISE-conformant reporting artifacts (R1 flow split, disclosure section). All sources accessed 2026-06-09.

| Tool | AI screening | Separate advisory AI record (ii) | Disclosure generation (iii) | Source URL | Accessed |
|---|---|---|---|---|---|
| EPPI-Reviewer | Yes (priority screening; GPT-4o coding via UI) | **Yes.** LLM coding "is added in the name of the robot itself (e.g. 'OpenAI GPT4')" so "it is always possible to discriminate between coding produced by the robot and coding produced by humans"; comparison mode against human gold standard; positioned as evaluation-only | No. No PRISMA flow AI split, no disclosure generation documented | https://eppi.ioe.ac.uk/cms/Default.aspx?tabid=3921 | 2026-06-09 |
| Nested Knowledge | Yes (Robot Screener, Smart Screener) | **Yes.** Robot Screener acts as one reviewer in dual screening; its decision persists as a reviewer-level record; human adjudication makes the binding final decision; inclusion probabilities can be hidden for independent human decisions | No. "Disclosure of AI Systems" page and a "RAISE Compliance Guide" are user-facing documentation, not session-derived report artifacts; no documented AI/human split in the PRISMA output | https://about.nested-knowledge.com/docs/robot-screener/ and https://about.nested-knowledge.com/docs/raise/ | 2026-06-09 |
| DistillerSR | Yes (DistillerAI classifiers) | **Yes (vendor documentation).** A classifier can "act as an automated second reviewer, flagging discrepancies with the human reviewer's decision"; audit trail traceable to individual reviewer and timestamp | No. PRISMA 2020 diagram and inter-rater reports, no documented AI/human flow split or disclosure generation | https://www.distillersr.com/products/distillersr-systematic-review-software | 2026-06-09 |
| Covidence | Yes (Cochrane RCT classifier; pre-screening exclusion) | Partial. The classifier excludes before screening; decisions are inspectable and restorable but it is not an advisory record next to a human decision | Partial. "The PRISMA flow diagram updates automatically to document the automated step" (one automated exclusion step, not a general R1 split); static "reporting templates ... to cite the use of AI in your PRISMA flow diagram and methods sections", explicitly aligned with RAISE and the 2025 Cochrane position statement | https://support.covidence.org/help/covidences-approach-to-responsible-automation-ai and https://www.covidence.org/blog/ai-screening-automation-systematic-reviews/ | 2026-06-09 |
| Elicit Systematic Review | Yes (criteria-based LLM screening, per-criterion scores) | Claimed, not documented. Marketing: "dual review pairs two humans with AI assistance, or uses AI as the second reviewer. Every decision is PRISMA-auditable"; the workflow description (blog, 2025-02-20) shows only recommendations plus manual override | No documented R1 split or disclosure generation | https://pro.elicit.com/solutions/systematic-reviews and https://elicit.com/blog/systematic-review/ | 2026-06-09 |
| Rayyan | Yes (5-star relevance prediction on undecided records) | No. The rating is an advisory display, not a persisted decision record; human decisions are the only screening decisions | No. PRISMA diagram and screening report without AI/human split | https://help.rayyan.ai/hc/en-us/articles/17461088734353-How-to-use-Rayyan-s-Predictions-Classifier-for-Relevance-Ranking | 2026-06-09 |
| ASReview | Yes (active learning prioritization) | No, by design. The model ranks; it makes no include/exclude decisions, so there is no AI decision record | No. Transparency guidance exists in the literature, not disclosure generation in the tool | https://pmc.ncbi.nlm.nih.gov/articles/PMC10335470/ | 2026-06-09 |
| SWIFT-Active Screener | Yes (active learning with integrated recall estimation) | No | No | https://pubmed.ncbi.nlm.nih.gov/32203803/ | 2026-06-09 |
| Abstrackr | Yes (ML predictions) | No | No | https://pmc.ncbi.nlm.nih.gov/articles/PMC6857345/ | 2026-06-09 |
| RobotAnalyst | Yes (active learning, topic grouping) | No | No | https://pmc.ncbi.nlm.nih.gov/articles/PMC6857345/ | 2026-06-09 |
| Laser AI | Yes (AI prioritization, extraction suggestions) | Not documented as a reviewer-attributed decision record; full action-level audit trail is documented | No documented disclosure generation | https://www.laser.ai/product | 2026-06-09 |
| silvi.ai | Yes (AI screening suggestions) | Not documented | No documented | https://silvi.ai/screen-studies-with-ai | 2026-06-09 |
| varlet99/prisma-traice-review-tool | Yes (multi-provider LLM, include/exclude/uncertain with justification) | Partial. Human can validate, modify, or cancel the AI decision; whether both persist as separate fields is not documented | Not confirmed. Methodology PDF export exists; trAIce checklist, R1 split, and disclosure emission not documented | https://github.com/varlet99/prisma-traice-review-tool | 2026-06-09 |
| Black-Lights/prisma-review-tool | Yes (rule-based pass plus AI pass via MCP) | No | No. No trAIce/RAISE mention | https://github.com/Black-Lights/prisma-review-tool | 2026-06-09 |

Context note: Cochrane selected Laser AI and Nested Knowledge for an evidence synthesis platform study, which signals these two as the institutionally endorsed frontier (source: https://www.knowledgespeak.com/news/cochrane-selects-laser-ai-and-nested-knowledge-for-evidence-synthesis-platform-study/, accessed 2026-06-09). Nested Knowledge published a self-assessment against the Cochrane joint statement and RAISE on 2025-12-08 (https://about.nested-knowledge.com/2025/12/08/responsible-ai-in-evidence-synthesis-how-nested-knowledge-meets-the-new-standards-from-cochrane-joint-statement-and-raise-guidelines/, accessed 2026-06-09).

## Retrospective PRISMA rendering

No publication was found that retrospectively documents an already-conducted LLM-assisted review as a PRISMA-trAIce artifact (searches on retrospective/post-hoc PRISMA documentation, AI transparency statements, and trAIce application phrases, all 2026-06-09). The nearest neighbours, all to be cited as adjacent rather than identical work:

- The AITDI meta-research protocol applies a transparency index retrospectively to published AI-assisted reviews (assessment of others' reporting, not self-documentation as an artifact). https://www.researchprotocols.org/2026/1/e90588 (accessed 2026-06-09).
- Adapted PRISMA flow diagrams exist as a genre: for review updates (https://pmc.ncbi.nlm.nih.gov/articles/PMC4046496/, accessed 2026-06-09) and for living systematic reviews (https://pmc.ncbi.nlm.nih.gov/articles/PMC8804909/, accessed 2026-06-09). The trAIce adapted diagram continues this genre; PRISM would be, to our knowledge, the first tool to emit it.
- The seandavi/agentic-writing-patterns repository claims trAIce compliance for an agentic narrative review, showing the compliance-by-construction framing emerging, without a screening data model. https://github.com/seandavi/agentic-writing-patterns (accessed 2026-06-09).

The two-round retrospective framing (a completed human round and a completed LLM round, rendered post hoc into a trAIce-conformant record) therefore appears novel as of 2026-06-09, with the usual caveat that search coverage of preprints and grey literature is incomplete.

## Related work the paper must cite

1. Holst et al. 2025, PRISMA-trAIce, JMIR AI 4:e80247, DOI 10.2196/80247 (proposed extension; cite as proposal).
2. Flemyng et al. 2025, RAISE position statement, co-published in four journals, e.g. Campbell Systematic Reviews DOI 10.1002/cl2.70074 and Environmental Evidence DOI 10.1186/s13750-025-00374-5.
3. Thomas et al., RAISE recommendations and guidance (RAISE 1 to 3), OSF, DOI 10.17605/OSF.IO/FWAUD, revised version 2026-03-13 (check for the Research Synthesis Methods publication before submission).
4. EPPI-Reviewer LLM coding documentation (robot-attributed coding, comparison mode) as prior art for AI-human decision separation: https://eppi.ioe.ac.uk/cms/Default.aspx?tabid=3921.
5. Nested Knowledge Robot Screener and RAISE Compliance Guide as prior art for AI-as-reviewer with human adjudication and for vendor-side RAISE response: https://about.nested-knowledge.com/docs/robot-screener/ and https://about.nested-knowledge.com/docs/raise/.
6. DistillerSR (AI second reviewer, audit trail): https://www.distillersr.com/products/distillersr-systematic-review-software.
7. Covidence responsible automation (RCT classifier documented in the auto-updated PRISMA flow; static reporting templates; RAISE alignment): https://support.covidence.org/help/covidences-approach-to-responsible-automation-ai.
8. AIscreenR / Vembye et al., GPT as second screener with benchmarking (R package vignette https://cran.r-project.org/web/packages/AIscreenR/vignettes/Using-GPT-API-Models-For-Screening.html and the associated Psychological Methods 2025 paper on GPT models as "highly reliable second screeners") as methodological prior art for the dual-track design.
9. AITDI meta-research protocol, JMIR Research Protocols 2026 e90588, as adjacent retrospective transparency assessment.
10. varlet99/prisma-traice-review-tool as the only other software artifact invoking PRISMA-trAIce by name.
11. Optional, for the adapted-flow-diagram genre: PMC4046496 (review updates) and PMC8804909 (living systematic reviews).

## Consequences for phrasing the contribution

The paper may not claim that separating AI and human screening decisions is new. EPPI-Reviewer attributes LLM coding to a robot reviewer with explicit discriminability and comparison mode; Nested Knowledge persists Robot Screener decisions as reviewer-level records under binding human adjudication; DistillerSR markets an automated second reviewer with a per-reviewer audit trail. Any "first" claim at the level of decision records would be refuted in review by a reader who knows these tools.

What the evidence supports, phrased with a time stamp and a knowledge qualifier ("to our knowledge, as of June 2026"):

1. PRISM is the first screening tool documented to emit the PRISMA-trAIce adapted flow diagram (item R1) as a working artifact, with separate tallies for AI-tool and human-reviewer decisions. No surveyed tool documents this output; Covidence comes closest with a single automated step documented in its PRISMA flow.
2. PRISM is the first tool documented to auto-generate a consolidated AI-disclosure section (trAIce M-items plus RAISE Table 1 elements) from the session data itself, rather than offering static templates (Covidence) or documentation pages (Nested Knowledge).
3. The conformance-by-construction argument is sound and should carry the contribution: because the data model records AI and human decisions as separate first-class records with derivation logic, the trAIce R1 artifact and the disclosure section fall out of the data instead of being written after the fact.
4. The retrospective trAIce rendering of an already-completed two-round review is an unpublished framing as of 2026-06-09 and can be presented as such, citing AITDI as the adjacent assessment-side counterpart.

Required hedges: PRISMA-trAIce is a six-month-old proposal without consensus endorsement and with minimal citation uptake (5 citing works on Semantic Scholar, 2026-06-09), so "conformant" means conformant to a proposed living guideline; the RAISE guidance papers are OSF preprints under journal review as of March 2026; the commercial tool landscape responds quickly to RAISE (Covidence and Nested Knowledge both published alignment statements in late 2025), so the novelty window for the disclosure-generation feature may be short and the survey date must be stated in the paper.

## What could not be verified

- Whether varlet99/prisma-traice-review-tool stores AI and human decisions as separate persistent fields, and whether its PDF export contains a disclosure section; the README is silent and the repository has no documentation beyond it.
- Whether Nested Knowledge's or DistillerSR's exported PRISMA diagrams distinguish AI decisions from human decisions; the documentation does not say, and absence of documentation is not proof of absence of the feature.
- Elicit's actual dual-review data model; the marketing page claims AI as second reviewer with PRISMA-auditable decisions, the workflow documentation describes only recommendations with manual override; product access would be needed to resolve the gap.
- RobotReviewer was not evaluated in depth; it targets risk-of-bias assessment rather than screening and was treated as out of scope.
- Citation counts rely on Semantic Scholar (2026-06-09) and may lag Google Scholar; no Google Scholar access was available.
- Vendor documentation behind login walls and recent product releases without public documentation; all tool characterizations rest on public pages as of 2026-06-09.
