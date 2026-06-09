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
| [FORSCHUNGSPROJEKT-PROMPTOTYPING.md](FORSCHUNGSPROJEKT-PROMPTOTYPING.md) | Concept document: Promptotyping as epistemic practice, 3 layers (Vault, Web Interface, Paper) |

## PRISMA Screening Tool (Promptotyping knowledge base)

Promptotyping document set for the PRISMA screening tool **PRISM**, a standalone, Git-backed page (`docs/prisma.html`, `docs/js/prisma.js`, `docs/css/prisma.css`) linked from the Evidence Companion. Since the v4 pivot (ADR-012) it is centred on **evidence-grounded screening**: read and search the document, pin found passages as Belege on categories, decide Include/Exclude. The human-AI comparison (kappa, matrix, flow) is research material that lives in the report layer plus the paper and Companion, not the working loop. Follows the Promptotyping document convention (frontmatter Pflichtkern, Obsidian wikilinks, function-named files).

| File | Function | Content |
|------|----------|---------|
| [prisma-methodology.md](prisma-methodology.md) | Reference | PRISMA 2020 as reporting standard, flow diagram, 27-item checklist, extension family, reporting-vs-conduct boundary |
| [ai-assisted-review-standards.md](ai-assisted-review-standards.md) | Reference | PRISMA-trAIce (14 items) + RAISE (3 principles), item-by-item mapping onto the dual assessment track, gap analysis |
| [specification.md](specification.md) | Substance (formal) | FR-01..13 (FR-11..13 = read, search, pin evidence), NFR-01..07, three v4 surfaces, ADR-001..012 (ADR-012 = the v4 pivot) |
| [user-stories.md](user-stories.md) | Substance (narrative) | 3 v4 core stories (read, search, pin) + the v3 scenarios as background, each with Ableitung |
| [data.md](data.md) | Material | ScreeningRecord, FlowModel, DisclosureMetadata, per-reviewer file schema 0.2 (evidence map), reading-text source + corpus index, evidence behaviour |
| [design.md](design.md) | Gestalt | UI/design brief; section 5 (5A-5D) specifies the three v4 surfaces as built |
| [design-review-prism-handoff.md](design-review-prism-handoff.md) | Review | Analysis of the PRISM Claude Design handoff: interaction model, design system, what was ported, v4 follow-up |

## Guides

| File | Content |
|------|---------|
| [guides/quickstart.md](guides/quickstart.md) | 10-minute introduction to the full pipeline (acquisition to vault) |
| [guides/manual-review-checklist.md](guides/manual-review-checklist.md) | Markdown review checklist for human-in-the-loop |

## Paper

The paper is being edited on Google Docs (Forum Wissenschaft 2/2026, deadline May 4, 2026).

## External Resources

| Resource | Link |
|----------|------|
| Repository | [github.com/chpollin/FemPrompt_SozArb](https://github.com/chpollin/FemPrompt_SozArb) |
| Evidence Companion | [chpollin.github.io/FemPrompt_SozArb](https://chpollin.github.io/FemPrompt_SozArb/) |
| Google Sheets (Human Assessment) | [Link](https://docs.google.com/spreadsheets/d/1z-HQSwVFg-TtdP0xo1UH4GKLMAXNvvXSdySPSA7KUdM/) |
| Prompt Governance | [prompts/CHANGELOG.md](../prompts/CHANGELOG.md) |
| Kappa Revision | Documented in [paper-integrity.md](paper-integrity.md) section 3.6 |

---

*Updated: 2026-06-09*
