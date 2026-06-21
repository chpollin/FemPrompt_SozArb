# Knowledge Base — FemPrompt_SozArb

Central documentation for the systematic literature review on AI literacy and LLM bias in the context of social work. This directory is the **single source of truth** for all project information.

---

## Core Documents

| File | Content |
|------|---------|
| [project.md](project.md) | Project goals, research questions, team, theoretical framework (asymmetry mapping, epistemic infrastructure, SKE verification, sycophancy measures), glossary |
| [methods-and-pipeline.md](methods-and-pipeline.md) | PRISMA, assessment design, pipeline (PDF → Markdown → Knowledge → Vault v2), script reference, costs |
| [status.md](status.md) | Milestones (M1–M13), benchmark results, selection audit, open items |
| [paper-integrity.md](paper-integrity.md) | Systematic comparison of paper text vs. repository (VERIFIED / DEVIATION / MISSING) |
| [journal.md](journal.md) | Work journal: chronological session log with decisions, results, and learnings |
| [plan.md](plan.md) | Process: Zielbild and staged plan for the whole project (A: tool v1.0 to 1 July 2026, R: retrospective PRISMA replay and evaluation, B: update cycle through the tool, C: closure and reuse) |
| [FORSCHUNGSPROJEKT-PROMPTOTYPING.md](FORSCHUNGSPROJEKT-PROMPTOTYPING.md) | Concept document: Promptotyping as epistemic practice, 3 layers (Vault, Web Interface, Paper) |

## PRISMA Screening Tool (Promptotyping knowledge base)

Promptotyping document set for the PRISMA screening tool **PRISM**, a standalone page (`docs/prisma.html`, `docs/js/prisma.js`, `docs/css/prisma.css`) linked from the Evidence Companion, on the shared Companion design since ADR-014. Since the v4 pivot (ADR-012) it is centred on **evidence-grounded screening**: read and search the document, pin found passages as Belege on categories, decide Include/Exclude. ADR-014 removed the human-AI comparison surface (kappa, matrix, divergence, reconciliation): the leitmotif is synthesis over comparison, the divergence figures stay research material in the paper and Companion (the flow and disclosure remain in the tool). Versioning is GitHub Desktop outside the tool, not an in-tool Git surface. Follows the Promptotyping document convention (frontmatter Pflichtkern, Obsidian wikilinks, function-named files).

| File | Function | Content |
|------|----------|---------|
| [prisma-methodology.md](prisma-methodology.md) | Reference | PRISMA 2020 as reporting standard, flow diagram, 27-item checklist, extension family, reporting-vs-conduct boundary |
| [ai-assisted-review-standards.md](ai-assisted-review-standards.md) | Reference | PRISMA-trAIce (14 items) + RAISE (3 principles), item-by-item mapping onto the dual assessment track, gap analysis |
| [specification.md](specification.md) | Substance (formal) | FR-01..13 (FR-11..13 = read, search, pin evidence), NFR-01..07, three v4 surfaces, ADR-001..014 (ADR-012 = the v4 pivot, ADR-014 = synthesis over comparison, Git surface removed, design unified) |
| [user-stories.md](user-stories.md) | Substance (narrative) | 3 v4 core stories (read, search, pin) + the v3 scenarios as background, each with Ableitung |
| [data.md](data.md) | Material | ScreeningRecord, FlowModel, DisclosureMetadata, per-reviewer file schema 0.2 (evidence map), reading-text source + corpus index, evidence behaviour |
| [design.md](design.md) | Gestalt | UI/design brief; section 5 (5A-5D) specifies the three v4 surfaces as built |
| [design-review-prism-handoff.md](design-review-prism-handoff.md) | Review | Analysis of the PRISM Claude Design handoff: interaction model, design system, what was ported, v4 follow-up |
| [frontend-assessment.md](frontend-assessment.md) | Assessment | Critical assessment of the shipped frontend against requirements, the real Excel-then-tool workflow, and the repository storage model; five storage findings, recommendations (2026-06-21) |

The pure-function test suite for the tool lives in `tests/` (zero-dependency browser runner, see `tests/README.md`).

## Review Record and Verification

Deliverables of the plan stages V and R and of the Teilprojekte TP3, TP5, TP7 (see [plan.md](plan.md)). Every number in these documents traces to the raw files in `benchmark/data/` or to a named source.

| File | Content |
|------|---------|
| [verification-empirical-core.md](verification-empirical-core.md) | V1: adversarial recomputation of the central empirical claims from the raw assessment files; decomposed reading of the human-AI divergence (workflow vs. content disagreement), full metric set, content-only sensitivity |
| [verification-novelty.md](verification-novelty.md) | V2: web verification of the methodological novelty claim; holds partially, the defensible contribution is conformance by construction at the report-artifact level; related-work list |
| [conformance-audit.md](conformance-audit.md) | R1: every PRISMA 2020 and PRISMA-trAIce item judged against the repository (reconstructable / partial / missing); machine-readable map in `docs/data/conformance_map.json` |
| [prisma-record-round1.md](prisma-record-round1.md) | Retrospective PRISMA record of review round 1 (Stage R): identification, both screening lanes, named gaps; companion data `docs/data/flow_model.json`; agent recount, scripted replay pending |
| [analysis-divergence.md](analysis-divergence.md) | TP3 deliverable: the decomposed human-AI divergence finding, licensed source for the empirical section of the follow-up paper |
| [update-protocol-draft.md](update-protocol-draft.md) | TP5: pre-registration protocol draft for literature update round 2, with paste-ready prompts; to be finalized and committed before the first round 2 search; rehearsal runs in `deep-research/update-rehearsal/` |
| [reuse-setup.md](reuse-setup.md) | TP7 / Stage C3: setup path for running a foreign review on the PRISM machinery; draft until a third-party dry run |
| [analysis-design.md](analysis-design.md) | TP4 deliverable (DRAFT): sub-questions SQ1 to SQ3, seven analysis fields with closed vocabularies, coding instructions, Excel schema extension, eight decisions for the 1 July 2026 meeting |
| [simulation-ledger.md](simulation-ledger.md) | All simulated stakeholder decisions (TP4, TP5, user-story validation) with rationale; every entry pending ratification at the next real contact; simulation rule of 2026-06-09 |
| [ris-conversion.md](ris-conversion.md) | Closes paper-integrity 3.8: round 1 RIS conversion documented as performed but not reproducible; binding documented procedure plus conversion prompt for round 2 |

## Guides

| File | Content |
|------|---------|
| [guides/quickstart.md](guides/quickstart.md) | 10-minute introduction to the full pipeline (acquisition to vault) |
| [guides/manual-review-checklist.md](guides/manual-review-checklist.md) | Markdown review checklist for human-in-the-loop |

## Paper

The Forum Wissenschaft paper (2/2026) is submitted and editorially closed; the integrity check of the submitted text against the repository is in [paper-integrity.md](paper-integrity.md). The follow-up paper is results-led (narrative decision 2026-06-09: the research question leads, the workflow lives in the methods section): outline with claims inventory in `paper/outline.md`, register probes in `paper/style-probes/` (register 2 chosen, both judges), full draft in `paper/draft.md` with pending sections marked; synthesis numbers follow the TP4 analysis coding.

## External Resources

| Resource | Link |
|----------|------|
| Repository | [github.com/chpollin/FemPrompt_SozArb](https://github.com/chpollin/FemPrompt_SozArb) |
| Evidence Companion | [chpollin.github.io/FemPrompt_SozArb](https://chpollin.github.io/FemPrompt_SozArb/) |
| Google Sheets (Human Assessment) | [Link](https://docs.google.com/spreadsheets/d/1z-HQSwVFg-TtdP0xo1UH4GKLMAXNvvXSdySPSA7KUdM/) |
| Prompt Governance | [prompts/CHANGELOG.md](../prompts/CHANGELOG.md) |
| Kappa Revision | Documented in [paper-integrity.md](paper-integrity.md) section 3.6 |

---

*Updated: 2026-06-21*
