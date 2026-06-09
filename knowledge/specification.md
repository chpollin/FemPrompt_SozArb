---
title: Specification
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: active
language: en
version: "0.1"
created: 2026-06-09
updated: 2026-06-09
authors: [Christopher Pollin]
generated-with: Claude Code (Claude Opus 4.8)
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
template:
  name: Vorlage Specification
  version: 0.1
  url: https://dhcraft.org/Promptotyping/promptotyping-document/specification
  alias: https://dhcraft.org/Promptotyping/#promptotyping-document-specification
topics: ["[[Requirements Engineering]]", "[[Decision Records]]"]
related: [project, data, user-stories, ai-assisted-review-standards, prisma-methodology]
---

This document is the substance layer for the **PRISMA screening tool**, a new fifth view of the Evidence Companion that turns the existing reference application into a prospective, PRISMA-conformant screening instrument. It has three sections with different update rhythms: Requirements (static, what the tool must do and for whom), Funktionsumfang (refactored per release, the current shape of the view and its modules), and Decisions (monotonically growing ADRs). Narrative usage scenarios live separately in [[user-stories]]; the data model lives in [[data]]; the standards being implemented are in [[ai-assisted-review-standards]]. The four existing views (Knowledge Chat, Knowledge Graph, Categories, Corpus) are the reference layer documented in `CLAUDE.md`; this spec covers only the new working layer.

## Anforderungen

### Funktionale Anforderungen

- FR-01: Import a screening batch (papers, optionally with a pre-computed LLM assessment per paper) from JSON or CSV. Acceptance: a valid export loads a session of N papers, each with `zotero_key`, title, abstract, and, where present, the AI proposal per category plus an include/exclude suggestion.
- FR-02: Record an independent human screening decision per paper: ten binary categories, an include/exclude decision derived as (>=1 technology dimension AND >=1 social dimension), and, on exclude, one reason from a controlled list. Acceptance: the decision persists with reviewer id and timestamp; the derived decision matches the category logic.
- FR-03: Offer a blind independent mode that hides the AI proposal until the human decision is recorded, then reveals it and flags divergence. Acceptance: with blind mode on, no AI field is rendered before the human decision; divergence is computed and shown after.
- FR-04: Render a PRISMA 2020 flow diagram with the PRISMA-trAIce R1 split, identified -> screened -> included, with separate tallies for AI-tool decisions and human-reviewer decisions and a breakdown of exclusion reasons. Acceptance: counts reconcile with the decision log; the diagram exports as SVG.
- FR-05: Compute agreement metrics live as decisions accrue: confusion matrix (human x AI), Cohen's kappa for the decision and per category, and base rates. Acceptance: on the seed dataset the figures reproduce the offline benchmark (kappa 0.056, matrix 100/34/108/49).
- FR-06: Generate a PRISMA-trAIce / RAISE disclosure section from the session: tool name, version, date; stage and task; prompt version; decoding parameters; confidence threshold; validation metrics (kappa); known limitations; conflicts of interest. Acceptance: emitted as Markdown, copyable and exportable.
- FR-07: Track reporting completeness against both the PRISMA 2020 checklist (27 items) and the PRISMA-trAIce checklist (14 items), with per-item status and notes. Acceptance: status persists across reloads and exports.
- FR-08: Persist the session in localStorage; export and import the full session as JSON; export the decision log as CSV. Acceptance: reload restores state; an export/import round-trip is lossless.
- FR-09: Seed the tool with the existing FemPrompt corpus (326 papers, dual assessment) as a read-only case-study dataset. Acceptance: loads from `docs/data/` JSON without an import step.
- FR-10 (secondary): Provide an optional live-LLM on-ramp. With a local API key, request an AI proposal for a paper that lacks one, reusing the versioned assessment prompt. Acceptance: the proposal is stored as an AI decision, visibly labelled as live-generated, and never overrides the human decision.

### Nicht-funktionale Anforderungen

- NFR-01: Static application, no backend. All logic client-side (vanilla JS + CDN libraries), deployable on GitHub Pages. Maßstab: the view runs from `docs/` with no server process.
- NFR-02: Architectural consistency. IIFE module exposing through the `window.EC` API, matching the four existing views. Maßstab: a code reviewer recognises the same pattern as `kategorien.js`.
- NFR-03: Reproducibility. The canonical screening path uses pre-computed, file-backed AI assessments; live LLM calls are opt-in and labelled. Maßstab: a session can be reproduced from its exported JSON without any network call.
- NFR-04: Accountability (RAISE). The human decision is always the binding record; the AI decision is advisory; every AI involvement is logged and appears in the disclosure output. Maßstab: no code path lets an AI decision become the final decision.
- NFR-05: Data sovereignty. Any API key is local only (localStorage or gitignored `config.local.js`), as in Knowledge Chat. Maßstab: no key is committed or transmitted anywhere but the model provider.
- NFR-06: Keyboard-first screening. Category toggles and include/exclude reachable by keyboard, echoing the `markdown_reviewer.html` shortcut model. Maßstab: a full paper can be screened without the mouse.
- NFR-07: Performance. Smooth interaction for at least 500 papers in one session. Maßstab: no perceptible lag on decision entry or diagram redraw at that size.

Anwendungsszenarien siehe [[user-stories]].

## Funktionsumfang

Modules are listed in application order: data in, screen, see the picture, report out.

### Screening Workspace

Zweck. The per-paper triage surface where an expert reads a study and records a decision.

Datengrundlage. The `ScreeningRecord` per paper (see [[data]]): metadata, abstract, optional Knowledge Document, optional AI proposal.

Interaktion. Read title/abstract (and Knowledge Document tab if present), toggle the ten categories, confirm the auto-derived include/exclude, pick an exclusion reason on exclude. In blind mode the AI proposal stays hidden until the decision is saved, then divergence is shown.

Grenzen. It does not fetch papers, run a full-text search, or replace the expert's reading. One reviewer at a time; multi-reviewer reconciliation is via export/import, not concurrent editing.

### PRISMA Flow Diagram

Zweck. The PRISMA-trAIce adapted flow diagram as the tool's signature artefact.

Datengrundlage. The `FlowModel` aggregation over all decisions (see [[data]]).

Interaktion. Live redraw as decisions accrue; separate AI-decision and human-decision tallies per screening stage; exclusion-reason breakdown; SVG export for the report.

Grenzen. It visualises the recorded process; it does not infer counts the data does not support, and it follows the PRISMA 2020 three-phase structure (Identification, Screening, Included), not the 2009 four-phase one.

### Agreement Panel

Zweck. Make the human-AI divergence measurable in place (this is the PRISMA-trAIce M9/R2 performance evaluation).

Datengrundlage. Paired human and AI decisions across the session.

Interaktion. Confusion matrix, decision and per-category kappa, base-rate comparison; clicking a cell filters the workspace to those papers.

Grenzen. Kappa is reported as a comparison anchor, not a quality verdict; the panel describes divergence, it does not adjudicate it.

### Checklist Tracker

Zweck. Track reporting completeness against PRISMA 2020 (27 items) and PRISMA-trAIce (14 items).

Datengrundlage. A per-item status/notes store plus auto-derived hints (e.g. R1 satisfied once the split diagram has counts).

Interaktion. Mark items, attach notes, see which are auto-satisfied by the session data; export the filled checklist.

Grenzen. It tracks reporting completeness, not methodological quality (AMSTAR 2 / ROBIS remain separate, see [[prisma-methodology]]).

### Disclosure / Report Generator

Zweck. Emit the AI-disclosure text and the assembled PRISMA record for a paper or report.

Datengrundlage. `DisclosureMetadata` plus the flow and agreement results (see [[data]]).

Interaktion. Generate a Markdown disclosure section (PRISMA-trAIce M2/M3/M6/M8/M9 + RAISE Table 1), preview, copy, export; bundle with the SVG flow diagram and the decision-log CSV.

Grenzen. It drafts reporting text from recorded facts; the author edits and remains accountable. It does not submit, publish, or cite on the author's behalf.

### Data I/O

Zweck. Get batches in and PRISMA records out without a backend.

Datengrundlage. Session JSON (full state), decision-log CSV, the read-only seed dataset.

Interaktion. Import JSON/CSV, export session/log, load the seed corpus, autosave to localStorage.

Grenzen. Sharing between colleagues is file-based (export then import), not live collaboration.

## Entscheidungen

### ADR-001 Prospective screening tool, not retrospective documentation

Kontext. The Evidence Companion today documents a finished review. The new view could either present that review through a PRISMA lens (viewer) or let colleagues conduct new screening (working tool).

Wahl. Build a working, prospective screening tool; treat the existing corpus as a seeded case study.

Begründung. The stated need is that colleagues work better with the instrument, and a literature update with the same prompts is planned for the SocialAI strand. A viewer would not support that; a working tool does and still subsumes the retrospective view via the seed dataset.

Effekt. To be observed after the first meeting (1 July 2026).

### ADR-002 Batch-import canonical, live-LLM optional

Kontext. A static app cannot run a server-side LLM batch, yet the project's principle is reproducible, file-backed data (no AI playground).

Wahl. The canonical path imports papers plus pre-computed AI assessments (produced offline by the existing Python pipeline); a live-LLM on-ramp with a local key is an opt-in convenience.

Begründung. Keeps the reproducibility guarantee (NFR-03) while still letting a colleague get an AI second opinion on a stray paper, reusing the Knowledge Chat client-side-key pattern.

Effekt. To be observed.

### ADR-003 Human decision binding, AI advisory

Kontext. RAISE requires human oversight and author accountability; PRISMA-trAIce R1 requires AI and human decisions to be separable.

Wahl. The human decision is always the final, binding record; the AI decision is stored separately as advisory.

Begründung. Satisfies RAISE P1/P2 and makes the R1 split structurally possible; matches the project's responsibility-asymmetry thesis.

Effekt. To be observed.

### ADR-004 Blind independent screening mode

Kontext. The dual assessment track's value is that expert and LLM judge independently; seeing the AI proposal first would anchor the expert and collapse the comparison.

Wahl. Offer a blind mode that withholds the AI proposal until the human decision is saved, then reveals it and computes divergence.

Begründung. Preserves the parallel-independent design that produces the divergence finding, and yields clean AI-vs-human tallies for the R1 diagram.

Effekt. To be observed; blind mode is expected to be the default for new screening, off for reviewing the seed dataset.

### ADR-005 Integrate as a fifth SPA view, not a subpage

Kontext. The tool could be a separate subpage or a new view inside the existing single-page app.

Wahl. A fifth view inside `docs/index.html`, with its own IIFE module wired through `window.EC`.

Begründung. Keeps one application, reuses the corpus data, navigation, and styling, and matches the user's stated preference. Lower friction than a separate entry point.

Effekt. To be observed.

### ADR-006 localStorage plus JSON export for persistence

Kontext. A static app has no database, but screening decisions must survive reloads and be shareable.

Wahl. Autosave the session to localStorage; share via explicit JSON export/import; export the decision log as CSV.

Begründung. The only backend-free option that preserves work and enables multi-reviewer reconciliation through files.

Effekt. To be observed; concurrent multi-reviewer editing is explicitly out of scope (see Funktionsumfang, Data I/O).

### ADR-007 Adopt PRISMA-trAIce as reporting target and RAISE as governance frame

Kontext. PRISMA 2020 alone does not operationalise the AI-vs-human split; two 2025 frameworks now do.

Wahl. Implement PRISMA-trAIce (14 items, esp. R1) as the reporting target and treat RAISE (three principles, Table 1) as the governance frame; cite PRISMA-trAIce as a proposed, not yet formally endorsed, extension.

Begründung. They legitimise the existing dual track and give a concrete checklist to close gaps (protocol pre-registration, parameter disclosure, conflict-of-interest declaration). See [[ai-assisted-review-standards]].

Effekt. To be observed; the disclosure generator (FR-06) and checklist tracker (FR-07) are the direct consequences.

### ADR-008 Standalone fullscreen page (supersedes ADR-005)

Kontext. The tool grew into a Git-based working instrument; an embedded companion view cramped it into a reading-column layout.

Wahl. Promote it to a dedicated fullscreen page `docs/prisma.html`; the companion's PRISMA nav links to it. A small data layer (`prisma-data.js`) provides a `window.EC` shim over `research_vault_v2.json` so the screening logic runs without the full companion app.

Begründung. A working screening tool needs full width and its own chrome, and a clean separation from the reference/exploration companion.

Effekt. Implemented (rebuild stage 1). Supersedes ADR-005.

### ADR-009 File System Access persistence with Git (supersedes ADR-006)

Kontext. Collaborators must download the repo, screen in the browser, write into the data, and commit; localStorage alone is not shareable.

Wahl. The File System Access API writes per-reviewer JSON files into `docs/data/screening/`, committed with Git by the user; export/import is the fallback; localStorage stays as a live cache.

Begründung. Git becomes the sync layer with no backend, matching the described "write into the data, commit, the other pulls" workflow.

Effekt. Implemented (rebuild stage 2). Direct write is Chromium-only; the fallback covers Firefox/Safari. Supersedes ADR-006.

### ADR-010 One file per reviewer

Kontext. Two reviewers editing one shared file would produce Git merge conflicts.

Wahl. One JSON per reviewer (`<reviewer>.json`); the tool reads all of them to aggregate, and writes only the current reviewer's file. The existing expert assessment is a built-in `seed` reviewer.

Begründung. Conflict-free in Git, matches independent dual review (PRISMA-trAIce M8), and enables the Reviewers reconciliation surface.

Effekt. Implemented (rebuild stage 2/4).

### ADR-011 Blind mode defaults off (resolves the design Q1)

Kontext. Blind-on by default hid the AI proposal on the seed case study, making screened papers look blank.

Wahl. Blind mode defaults off; a reviewer turns it on for independent fresh screening.

Begründung. The tool opens on the seed, where seeing the AI is the point; independence is a deliberate per-session choice, not a default that confuses first contact.

Effekt. Implemented (rebuild stage 3), together with: exclusion reason now required (no silent default), seed assessment shown as reference, derived decision suppressed until a category is set, and a boilerplate-abstract warning.

## Was nicht reingehört

Architecture (stack, data flow, module boundaries) belongs in a future `architecture.md`; the data model belongs in [[data]]; design tokens and UI patterns belong in a future `design.md`; the standards themselves belong in [[ai-assisted-review-standards]] and [[prisma-methodology]].

*Updated: 2026-06-09*
