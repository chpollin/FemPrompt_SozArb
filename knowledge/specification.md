---
title: Specification
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: complete
language: en
version: "0.2"
created: 2026-06-09
updated: 2026-06-29
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
related: [project, data, design, standards, plan]
---

This document is the substance layer for the **PRISMA screening tool**, a standalone, PRISMA-conformant screening instrument (`docs/prisma.html`, see ADR-008) linked from the Evidence Companion. The tool writes its data files directly into the connected project folder (File System Access); versioning happens outside the tool in GitHub Desktop (ADR-014, supersedes the in-tool Git surface of ADR-009). It has three sections with different update rhythms: Requirements (static, what the tool must do and for whom), Funktionsumfang (refactored per release, the current shape of the view and its modules), and Decisions (monotonically growing ADRs). Narrative usage scenarios are the Anwendungsszenarien section below; the data model lives in [[data]]; the standards being implemented are in [[standards]]. The four existing views (Knowledge Chat, Knowledge Graph, Categories, Corpus) are the reference layer documented in `CLAUDE.md`; this spec covers only the new working layer.

## Anforderungen

### Funktionale Anforderungen

- FR-01: Import a screening batch (papers, optionally with a pre-computed LLM assessment per paper) from JSON or CSV. Acceptance: a valid export loads a session of N papers, each with `zotero_key`, title, abstract, and, where present, the AI proposal per category plus an include/exclude suggestion.
- FR-02: Record an independent human screening decision per paper: ten binary categories, an include/exclude decision derived as (>=1 technology dimension AND >=1 social dimension), and, on exclude, one reason from a controlled list. Acceptance: the decision persists with reviewer id and timestamp; the derived decision matches the category logic.
- FR-03: Offer a blind independent mode that hides the AI proposal until the human decision is recorded, then reveals it and flags divergence. Acceptance: with blind mode on, no AI field is rendered before the human decision; divergence is computed and shown after.
- FR-04: Render a PRISMA 2020 flow diagram with the PRISMA-trAIce R1 split, identified -> screened -> included, with separate tallies for AI-tool decisions and human-reviewer decisions and a breakdown of exclusion reasons. Acceptance: counts reconcile with the decision log; the diagram exports as SVG.
- FR-05 (superseded by ADR-014/017): Compute agreement metrics live as decisions accrue: confusion matrix (human x AI), Cohen's kappa for the decision and per category, and base rates. As built, the in-tool agreement surface and the kappa computation are removed; agreement is evaluated externally on the benchmark corpus, where the figures live in the data (`benchmark/results/`, `docs/data/`) and the Evidence Companion.
- FR-06: Generate a PRISMA-trAIce / RAISE disclosure section from the session: tool name, version, date; stage and task; prompt version; decoding parameters; confidence threshold; validation metrics (kappa); known limitations; conflicts of interest. Acceptance: emitted as Markdown, copyable and exportable.
- FR-07: Track reporting completeness against both the PRISMA 2020 checklist (27 items) and the PRISMA-trAIce checklist (17 items), with per-item status and notes. Acceptance: status persists across reloads and exports.
- FR-08: Persist the session in localStorage; export and import the full session as JSON; export the decision log as CSV. Acceptance: reload restores state; an export/import round-trip is lossless.
- FR-09: Seed the tool with the existing FemPrompt corpus (the full dual-assessment corpus) as the Stage R seeded session, the round-1 data carried through PRISM (ADR-019). Acceptance: loads from `docs/data/` JSON without an import step.
- FR-10 (secondary): Provide an optional live-LLM on-ramp. With a local API key, request an AI proposal for a paper that lacks one, reusing the versioned assessment prompt. Acceptance: the proposal is stored as an AI decision, visibly labelled as live-generated, and never overrides the human decision.
- FR-11: Read the paper in full text. Where a paper has a converted full text (`vault/Papers/*.md`, servable under `docs/`), render it formatted and readable in the screening view, not only the abstract (a number of papers have no abstract in the corpus). Acceptance: opening a paper whose `knowledge_doc` path resolves shows its full text; papers without one fall back to abstract or knowledge summary.
- FR-12: Search the full text. Provide an in-text search that highlights and steps through matches in the open paper, and a corpus-wide search that lists papers whose full text contains a term. Acceptance: a query highlights every hit in the open text and returns the set of papers containing it across the corpus.
- FR-13: Pin a hit as evidence for a category. From a search hit or a selected passage, attach the term plus its surrounding snippet to one of the ten categories as a stored Beleg; evidence is saved with the decision and is citable in the report. Acceptance: a category can carry one or more evidence snippets; they persist in the reviewer file and appear in the decision log and disclosure.

The AI-forward requirements are demoted by ADR-012 and then by ADR-014. As built: FR-03 (blind mode) is removed from the working view, there is no blind/reveal and no blind toggle; FR-05 (agreement metrics) no longer has a surface at all, ADR-014 removed the human-AI comparison view (matrix, kappa, divergence filter, reviewer reconciliation) from the tool entirely. ADR-017 then removed the in-tool kappa computation itself (`computeMatrix`/`cohenKappa`/`kappaLabel` and their tests are gone); agreement is evaluated externally on the benchmark corpus, with the figures in the data (`benchmark/results/`, `docs/data/`) and the Evidence Companion, and the disclosure carries the trAIce M9/R2 item as a reference to that source. FR-10 (live LLM) is not implemented (optional, minimal, deferred). The screening view centers on FR-11 to FR-13 (read, search, pin evidence).

FR-11 to FR-13 acceptance, as built: FR-11 renders `paper.knowledge_doc` (the served distilled knowledge document, see [[data]]) with a built-in Markdown renderer, falling back to the abstract, then to an empty state. FR-12 highlights and steps through in-text matches in the open document and filters the corpus via the prebuilt `docs/data/fulltext_index.json`. FR-13 pins a selected passage or a search hit as `evidence[category] = {term, snippet, ts}` in the reviewer file (schema 0.2), sets the category, and reports an `evidence_count` in the decision log. The behaviour contract is in [[data]] (Evidence behaviour). Note: "full text" here is the served knowledge document, not the raw paper text; reading the raw local full text is a copyright-gated follow-up via the single `fetchPaperText` seam.

Acceptance (three-surface IA): the sub-navigation has exactly three entries (Screening, PRISMA & Report, Daten & Repo); the seven v3 surfaces are gone; the flow, the checklist, and the disclosure are reachable from PRISMA & Report, while kappa and the matrix have no surface (ADR-014, they feed only the disclosure line); a persisted v3 surface id is normalised onto the three on load.

### Nicht-funktionale Anforderungen

- NFR-01: Static application, no backend. All logic client-side (vanilla JS + CDN libraries), deployable on GitHub Pages. Maßstab: the view runs from `docs/` with no server process.
- NFR-02: Architectural consistency. IIFE module exposing through the `window.EC` API, matching the four existing views. Maßstab: a code reviewer recognises the same pattern as `kategorien.js`.
- NFR-03: Reproducibility. The canonical screening path uses pre-computed, file-backed AI assessments; live LLM calls are opt-in and labelled. Maßstab: a session can be reproduced from its exported JSON without any network call.
- NFR-04: Accountability (RAISE). The human decision is always the binding record; the AI decision is advisory; every AI involvement is logged and appears in the disclosure output. Maßstab: no code path lets an AI decision become the final decision.
- NFR-05: Data sovereignty. Any API key is local only (localStorage or gitignored `config.local.js`), as in Knowledge Chat. Maßstab: no key is committed or transmitted anywhere but the model provider.
- NFR-06: Keyboard-first screening. Category toggles and include/exclude reachable by keyboard, echoing the `markdown_reviewer.html` shortcut model. Maßstab: a full paper can be screened without the mouse.
- NFR-07: Performance. Smooth interaction for at least 500 papers in one session. Maßstab: no perceptible lag on decision entry or diagram redraw at that size.

## Anwendungsszenarien (Epics und User Stories)

Usage scenarios in the form "As [role], who [context], I want [goal], so that [benefit]". Roles: the review lead (Sackl-Sharif), the reviewing experts (Sackl-Sharif, Klinger), the technical lead (Pollin), and an external reviewer or auditor. The stories were written by the technical lead as a user proxy and stay hypotheses until validated against how the colleagues actually work; ADR-019 ratifies in-tool screening as the binding path and keeps the Excel import bridge only as an entry seam, superseding the earlier reading that the in-tool model had been falsified (see [[plan]]). The simulated validation verdicts on these stories live in [[plan]] (simulated decisions).

### v4 core (current, evidence-grounded)

- Read and move through the full text fast. As a reviewing expert with many papers to get through, I want each paper rendered as a readable document (the served knowledge document where one exists, the abstract otherwise), so that I judge it on content, not metadata. (FR-11; reading-text source in [[data]].)
- Search the text for the words that matter. As a reviewing expert who knows which terms signal a category, I want to search within the open paper and across all papers, so that I jump straight to the relevant passages and find candidate studies fast. (FR-12.)
- Pin a found word as evidence for a category. As a reviewing expert who must justify each inclusion, I want to pin a search hit and its surrounding passage as a Beleg on a category, so that every category points at the exact words that justify it and the decision is reproducible and citable. (FR-13; reviewer schema 0.2 in [[data]].)

### Scholarly assurance

- Generate a PRISMA-conformant record (FR-04, FR-07): export the flow diagram, the checklist, and the disclosure as one record ready for a methods section.
- Produce the AI-disclosure text automatically (FR-06): a generated disclosure naming model, version, prompt, parameters, limitations, and conflicts, satisfying PRISMA-trAIce and RAISE without hand-assembly.
- Verify the review is conformant (FR-04, FR-07): as an external reviewer, see the AI-versus-human split in the flow and a checklist of which PRISMA and trAIce items are met.
- Run a literature update on a fresh batch (FR-01, FR-09): import a new set with its offline AI assessment and screen only what is new, the round-2 path in [[update-protocol]].

### Conceptual orientation

- Look up what a category means (FR-02): the category definition at hand while screening, so the schema is applied consistently and the Gender-Feministisch operationalisation gap stays visible.
- Understand a checklist item (FR-07): each PRISMA-trAIce item shows its verbatim text and priority level before it is marked.

Superseded v3 stories, kept only as decision context: screening behind a blind AI proposal and an in-tool see-where-I-diverge view were the v3 anchor scenarios; ADR-012 and ADR-014 removed the blind/reveal and the comparison surface, and the divergence is now research material in the Companion, not a screening-view feature.

## Funktionsumfang

### Information architecture (v4, current)

Per ADR-012 the seven surfaces collapse into three, AI is strongly reduced, and the screening view is rebuilt around full-text reading, search, and evidence:

1. **Screening** (the work): a corpus overview with full-text search across all papers, plus a single-paper full-text working view with in-text search, evidence pinning per category, the derived include/exclude, and an optional collapsed AI suggestion. Subsumes the old Screening Workspace.
2. **PRISMA & Report** (the outputs): the PRISMA 2020 flow diagram, the checklist, and the disclosure generator in one place, generated from the screening. ADR-014 removed the agreement matrix and kappa as a surface; they survive only as functions feeding the disclosure line. Subsumes Flow, Checklist, Disclosure.
3. **Daten & Repo** (sync): File System Access connect (write into the project folder), per-reviewer files, export/import. ADR-014 removed the in-tool Git workflow (versioning is in GitHub Desktop) and the Reviewers reconciliation section.

Each view carries a one-line "what is this, what do I do here" header. The three surfaces are specified screen by screen in [[design]] section 5 (5A to 5D), matching the build. The module descriptions below are the v3 shape, retained for the report and data parts; the Screening Workspace block is superseded by the v4 Screening view and the evidence model in [[data]].

The modules below are listed in application order: data in, screen, see the picture, report out.

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

### Agreement Panel (removed by ADR-014)

This module is no longer a surface in the tool. ADR-014 removed the human-AI comparison view (confusion matrix, decision and per-category kappa, base-rate comparison, cell-to-workspace filtering) in favour of synthesis over comparison. The underlying functions remain only to feed the disclosure line (PRISMA-trAIce M9); the divergence finding itself lives in the paper and the Evidence Companion. The block below is kept as the record of what the surface was.

Zweck (historisch). Make the human-AI divergence measurable in place (this was the PRISMA-trAIce M9/R2 performance evaluation).

Datengrundlage. Paired human and AI decisions across the session.

Interaktion. Confusion matrix, decision and per-category kappa, base-rate comparison; clicking a cell filtered the workspace to those papers.

Grenzen. Kappa was reported as a comparison anchor, not a quality verdict; the panel described divergence, it did not adjudicate it.

### Checklist Tracker

Zweck. Track reporting completeness against PRISMA 2020 (27 items) and PRISMA-trAIce (17 items).

Datengrundlage. A per-item status/notes store plus auto-derived hints (e.g. R1 satisfied once the split diagram has counts).

Interaktion. Mark items, attach notes, see which are auto-satisfied by the session data; export the filled checklist.

Grenzen. It tracks reporting completeness, not methodological quality (AMSTAR 2 / ROBIS remain separate, see [[standards]]).

### Disclosure / Report Generator

Zweck. Emit the AI-disclosure text and the assembled PRISMA record for a paper or report.

Datengrundlage. `DisclosureMetadata` plus the flow and agreement results (see [[data]]).

Interaktion. Generate a Markdown disclosure section (PRISMA-trAIce M2/M3/M6/M8/M9 + RAISE Table 1), preview, copy, export; bundle with the SVG flow diagram and the decision-log CSV.

Grenzen. It drafts reporting text from recorded facts; the author edits and remains accountable. It does not submit, publish, or cite on the author's behalf.

### Data I/O

Zweck. Get batches in and PRISMA records out without a backend.

Datengrundlage. Session JSON (full state), decision-log CSV, the Stage R seed dataset (the round-1 data carried through PRISM).

Interaktion. Import JSON/CSV, export session/log, load the seed corpus, autosave to localStorage.

Grenzen. Sharing between colleagues is file-based (export then import), not live collaboration.

## Entscheidungen

### ADR-001 Prospective screening tool, not retrospective documentation

Kontext. The Evidence Companion today documents a finished review. The new view could either present that review through a PRISMA lens (viewer) or let colleagues conduct new screening (working tool).

Wahl. Build a working, prospective screening tool; treat the existing corpus as a seeded case study.

Begründung. The stated need is that colleagues work better with the instrument, and a literature update with the same prompts is planned for the SocialAI strand. A viewer would not support that; a working tool does and still subsumes the retrospective view via the seed dataset.

Effekt. Superseded by ADR-019. PRISM is the binding screening gate and the existing corpus is carried through it as a real pass, not held as a read-only seeded case study; the prospective-tool choice itself stands.

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

Begründung. Preserves the parallel-independent design that produces the human-AI divergence, and yields clean AI-vs-human tallies for the R1 diagram.

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

Wahl. Implement PRISMA-trAIce (17 items, esp. R1) as the reporting target and treat RAISE (three principles, Table 1) as the governance frame; cite PRISMA-trAIce as a proposed, not yet formally endorsed, extension.

Begründung. They legitimise the existing dual track and give a concrete checklist to close gaps (protocol pre-registration, parameter disclosure, conflict-of-interest declaration). See [[standards]].

Effekt. To be observed; the disclosure generator (FR-06) and checklist tracker (FR-07) are the direct consequences.

### ADR-008 Standalone fullscreen page (supersedes ADR-005)

Kontext. The tool grew into a Git-based working instrument; an embedded companion view cramped it into a reading-column layout.

Wahl. Promote it to a dedicated fullscreen page `docs/prisma.html`; the companion's PRISMA nav links to it. A small data layer (`prisma-data.js`) provides a `window.EC` shim over `research_vault_v2.json` so the screening logic runs without the full companion app.

Begründung. A working screening tool needs full width and its own chrome, and a clean separation from the reference/exploration companion.

Effekt. Implemented (rebuild stage 1). Supersedes ADR-005.

### ADR-009 File System Access persistence with Git (Git surface later removed by ADR-014)

Kontext. Collaborators must download the repo, screen in the browser, write into the data, and commit; localStorage alone is not shareable.

Wahl. The File System Access API writes per-reviewer JSON files into `docs/data/screening/`, committed with Git by the user; export/import is the fallback; localStorage stays as a live cache.

Begründung. Git becomes the sync layer with no backend, matching the described "write into the data, commit, the other pulls" workflow.

Effekt. Implemented (rebuild stage 2). Direct write is Chromium-only; the fallback covers Firefox/Safari. Supersedes ADR-006. ADR-014 later removed the in-tool Git surface (the add/commit/push hint and the Git language); the direct write stays, but versioning moved to GitHub Desktop outside the tool. The persistence mechanism is unchanged; only the in-tool Git affordance is gone.

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

### ADR-012 Evidence-grounded screening, three views, reduced AI (supersedes the AI-forward parts of ADR-003/004 and the seven-surface IA)

Kontext. In use, the tool foregrounded the human-AI divergence study (blind reveal, kappa, matrix, divergence patterns, reconciliation) that is really the content of the paper and the Evidence Companion. The expert in the loop needs to work through literature fast, the way the reviewing colleagues actually did: by reading and searching the full text and grounding each category in concrete words found in the text. A number of papers also have no abstract in the corpus, so abstract-only reading is insufficient.

Wahl. Recenter the tool on evidence-grounded screening. (1) The screening view is rebuilt around full-text reading and search (FR-11, FR-12), with found terms pinned as evidence to categories (FR-13). (2) AI is strongly reduced to an optional, collapsed suggestion; the human-AI comparison, kappa, and matrix move to the report layer, computed but not foregrounded; blind mode becomes optional and off by default. (3) The seven surfaces collapse into three: Screening, PRISMA & Report, Daten & Repo.

Begründung. Matches how the review was conducted, makes the tool legible (each view has one job and a what-do-I-do-here line), and removes apparatus the working user does not need, while still producing the PRISMA-trAIce R1/R2 data quietly for the report. The divergence research stays the property of the paper and the Companion, not a burden on the screening UI. Decided with the user 2026-06-09 after the v3 design port.

Effekt. Knowledge docs updated; implementation is the next iteration. The agreement and reconciliation logic is kept (moved, not deleted), so PRISMA-trAIce reporting is preserved.

### ADR-013 Raw full-text reading with recorded text source (planned, not yet implemented)

Kontext. The screening view currently reads the served distilled knowledge document (`docs/vault/Papers/*.md`), not the raw paper text. Evidence pinned on a distillate inherits the distillate's framing; the 2x2 experiment (journal session 11) showed knowledge documents amplify inclusion bias and degrade the Fairness kappa. The raw Docling texts live in `pipeline/markdown_clean/`, copyrighted and not served.

Wahl. Read the raw local full text from the connected clone through the single `fetchPaperText` seam (option 2 in [[data]]); raw texts are never published; the public Pages site falls back to the served knowledge document, then the abstract. Every decision records which text source was read (`text_source`: `raw`, `kd`, `abstract`) in the reviewer file (schema bump to 0.3, backward compatible) and in the decision-log CSV; the disclosure reports per-source counts (PRISMA-trAIce M4).

Begründung. A Beleg should come from the paper, not from an LLM summary of it; recording the text source makes the evidence basis auditable, the actor-text-evidence triple the round-1 audit could not reconstruct.

Effekt. Geplant, noch nicht implementiert (plan.md P2). Bis dahin liest die Screening-Oberfläche das Wissensdokument, und In-Tool-Belege tragen dessen Färbung; diese Grenze ist in [[data]] benannt.

### ADR-014 Synthesis over comparison, Git surface removed, design unified (supersedes the comparison parts of ADR-003/004/012 and the Git surface of ADR-009)

Kontext. Three operator decisions on 2026-06-21 reshaped the tool. (1) The leitmotif changed: human and AI assessment are never to be compared but always brought together into a synthesis; the built comparison surface (matrix, kappa, divergence, reconciliation) ran against that. (2) The in-tool Git surface duplicated what GitHub Desktop does and added a command block the working user does not need. (3) The tool page carried its own slim header and design, out of step with the four-view Companion.

Wahl. (1) Remove the human-AI comparison surface from the tool: the Mensch-KI-Uebereinstimmung section, the confusion-matrix view, the kappa display, the divergence filter, and the reviewer reconciliation table are gone. The pure functions (`computeMatrix`, `cohenKappa`, `kappaLabel`) and the PRISMA-trAIce R1/R2 reporting data stay, feeding only the disclosure line. (2) Remove the in-tool Git surface (add/commit/push hint, Git language); keep the direct File System Access write into the project folder; versioning is GitHub Desktop, outside the tool. (3) Lift the tool page onto the Companion design (white background, rainbow accent bar, shared header, navigation, and footer, Font Awesome); unify the navigation across all five pages.

Begründung. The synthesis direction makes the tool produce a joint, evidence-grounded judgement instead of an adversarial human-vs-AI score; the divergence research stays the property of the paper and the Evidence Companion, not a burden on the screening UI. Removing the Git surface matches how versioning actually happens (GitHub Desktop) and cuts apparatus. One design across all pages makes the tool read as part of the Companion, not a bolt-on. Decided with the operator 2026-06-21.

Effekt. Implementiert und nach main konsolidiert. Offen, vom Operator zu klären: die Synthese-Ebene (pro Artikel / über den Bestand / beides), die der noch zu bauenden Synthese-Oberfläche zugrunde liegt; die Beleg-Herkunft (KI/Mensch) bleibt je Beleg gekennzeichnet (entschieden, umgesetzt in ADR-015). Die Disclosure-Zeile mit Kappa/Matrix ist mit ADR-017 entfernt, `computeMatrix`/`cohenKappa`/`kappaLabel` samt Test entfallen, Agreement wird extern bewertet.

### ADR-015 Per-Beleg-Herkunft als gespeichertes Feld, neutral, ohne Wertung

Kontext. ADR-014 entschied, Mensch- und KI-Bewertung zusammenzuführen statt zu vergleichen, und hielt fest, dass die Herkunft jedes Belegs (KI oder Mensch) erhalten bleibt. Die Synthese-Oberfläche (Ebene offen, KI1) bringt menschliche und maschinelle Belege später in eine Ansicht; dann muss je Beleg ablesbar sein, woher er stammt.

Wahl. Die Herkunft ist ein gespeichertes Feld `origin` (`human` oder `ai`) auf jedem Beleg, nicht eine Ableitung aus dem Render-Kontext. `pinEvidence` setzt `origin: 'human'` auf jeden Reviewer-Pin; maschinelle oder KI-Belege tragen `origin: 'ai'` dort, wo sie erzeugt werden. `evidenceListHtml` rendert je Beleg einen neutralen Marker (Mensch oder KI), gleiche Form und Größe für beide, nur die etablierte Identitätsfarbe (`--pt-human`, `--pt-ai`) unterscheidet, keine Wertung. Abwärtskompatibel: ein Beleg ohne `origin` rendert als Mensch (Alt-Belege sind Reviewer-Pins).

Begründung. Ein gespeichertes Feld überlebt die spätere Zusammenführung, eine Kontext-Ableitung nicht. Neutralität durch Konstruktion verhindert, dass die Darstellung eine Quelle über die andere stellt, konsistent zur KI-Kennzeichnungsregel. Heute sind alle Belege in der Liste Reviewer-Pins, der KI-Marker ist test-belegt für die kommende Maschinen-Evidenz (R2). Entschieden mit dem Operator 2026-06-21 (order femprompt-prism, Punkt 2).

Effekt. Implementiert (`docs/js/prisma.js` pinEvidence und evidenceListHtml, `docs/css/prisma.css`), test-abgedeckt (vier Provenienz-Tests, `tests/tests.js`). Die Synthese-Ebene (KI1) bleibt offen; das Provenienz-Feld ist dafür bereit. Die Herkunft je Schicht (woher der Schnipsel stammt) und ihre bindende Wirkung regelt ADR-016.

### ADR-016 Lese-Schichten getrennt, Beleg-Herkunft an die Quellschicht gebunden

Kontext. Das servierte Wissensdokument (`docs/vault/Papers/*.md`) fügt zwei epistemisch verschiedene Schichten aneinander, die Paper-Schicht (Abstract, Key Concepts, Full Text) und die Maschinen-Extraktion (Kernbefund, Forschungsfrage, Methodik, Hauptargumente, Kategorie-Evidenz, Assessment-Relevanz, Schlüsselreferenzen). Die Leseansicht rendert beide in einem Scroll ohne Grenze. ADR-015 hält fest, wer pinnt (Mensch), nicht, aus welcher Schicht der Schnipsel stammt. Ein aus der Kategorie-Evidenz herauskopierter Beleg trug damit Mensch, obwohl der Text maschinell ist. Das ist die Kontaminationsspur, die ADR-003 (Mensch bindend, KI advisory) verhindern soll.

Wahl. `splitDocLayers` trennt das geladene Dokument an der ersten `## Kernbefund`-Überschrift in Paper-Schicht und KI-Schicht. Die Leseansicht erhält einen Umschalter (Volltext, KI-Extraktion) und blendet über der KI-Schicht ein Band ein, das sie als Extraktion ausweist. Die Beleg-Herkunft wird an die gerade gelesene Schicht gebunden, ein Schnipsel aus der KI-Schicht bekommt `origin: 'ai'`. Entscheidend, ein KI-Beleg setzt nie `work.cats`, bindet also nie die abgeleitete menschliche Entscheidung; er wird als KI angezeigt und bleibt advisory.

Begründung. Die Trennung ist damit nicht nur sichtbar, sondern im Datenfluss erzwungen. Der bindende Record (`work.cats`, daraus `deriveDecision`) speist sich ausschließlich aus paper-belegten Kategorien, maschinelle Evidenz kann ihn nicht kippen. Das löst das in ADR-015 offen gebliebene Woher ein und realisiert für das servierte Dokument, was ADR-013 für den Rohtext plant, einen auditierbaren Evidenz-Ursprung. ADR-013 (Rohtext aus dem lokalen Clone, `text_source`) bleibt davon unberührt und weiter offen.

Effekt. Implementiert (`docs/js/prisma.js` splitDocLayers, pinEvidence mit origin-Parameter, readingShellHtml-Umschalter, setReadMode, paintActiveLayer; `docs/css/prisma.css` Umschalter, Band, Pin-Menü-Hinweis), test-abgedeckt (sechs Tests für Schicht-Trennung und bindende Separierung, `tests/tests.js`), auf allen servierten Dokumenten greift die Grenze sauber. Offen bleiben die Synthese-Ebene (KI1) und das proaktive Laden der `## Kategorie-Evidenz` als vorbelegte KI-Belege (R2-Fortsetzung).

### ADR-017 Kappa/Matrix-Disclosure-Zeile entfernt, Agreement extern bewertet

Kontext. ADR-014 entfernte die Mensch-KI-Vergleichsfläche aus dem Werkzeug. Ein Rest blieb, die Disclosure-Zeile berechnete weiter eine Cohen-Kappa und die Konfusionsmatrix über `computeMatrix`/`cohenKappa`/`kappaLabel`. Diese Rechnung lief über den im Werkzeug geladenen Korpus (`research_vault_v2.json`), eine andere Menge als die Benchmark-CSVs, auf denen die kanonische Kappa beruht. Eine im Werkzeug angezeigte Zahl konnte von der Referenz also nur abweichen.

Wahl. `computeMatrix`, `cohenKappa` und `kappaLabel` samt ihren Tests entfallen. Die Disclosure behält das trAIce-Item M9/R2, aber als Verweis, die AI-Mensch-Übereinstimmung wird außerhalb des Werkzeugs auf dem Benchmark-Korpus in den Daten (`benchmark/results/`, `docs/data/`) und der Evidence Companion bewertet, nicht im Screening-Tool nachgerechnet. Die Entscheidung ist orchestratorseitig, reversibel und betrifft nur das Werkzeug. Eine etwaige Inter-Rater-Agreement-Aussage des Begleitpapers bleibt davon unberührt und ist eine separate Paper-Entscheidung des Operators.

Begründung. Das Werkzeug ist damit konsistent, es ist ein evidenzgestütztes Screening-Instrument, kein Agreement-Messgerät über einem zufällig geladenen Korpus. Die kanonische Kappa lebt an genau einer Stelle, der Benchmark-Auswertung über den Roh-CSVs. M9/R2 wird nicht verschwiegen, sondern an diese Quelle verwiesen, die trAIce-Konformität bleibt gewahrt.

Effekt. Implementiert (`docs/js/prisma.js`, computeMatrix/cohenKappa/kappaLabel entfernt, disclosureMarkdown auf den M9/R2-Verweis umgestellt, TEST_HOOK bereinigt), test-abgedeckt (Section B der Suite entfernt, der Disclosure-Test prüft jetzt die Abwesenheit der Tool-Kappa und den externen Verweis, `tests/tests.js`). Headless grün nach der Entfernung.

### ADR-018 Maschinen-Kategorie-Evidenz als vorgeladene KI-Provenienzklasse (R2)

Kontext. ADR-016 trennt die Leseschichten und bindet die Beleg-Herkunft an die Quellschicht; ein aus der KI-Schicht gepinnter Beleg trägt `origin: 'ai'` und bindet nie die Entscheidung. Offen blieb der proaktive Teil von R2, die maschinelle Kategoriezuordnung soll je Paper schon beim Öffnen als KI-Beleg sichtbar sein, nicht erst wenn der Reviewer von Hand aus der KI-Schicht pinnt. Das servierte Wissensdokument trägt einen `## Kategorie-Evidenz`-Block aus unkategorisierten `### Evidenz N`-Schnipseln; eine Quelle-zu-Kategorie-Zuordnung existiert in den Daten nicht.

Wahl. Ein Build-Schritt (`scripts/build_screening_index.py`, `build_machine_evidence`) emittiert `docs/data/machine_evidence.json`, je Paper und je LLM-geflaggter Kategorie ein Evidenz-Item, dessen Snippet die Modell-Begründung (`reasoning`) für dieses Paper ist. Die detaillierten Evidenz-Zitate bleiben in der KI-Extraktions-Leseschicht (M3), sie auf einzelne Kategorien zu lokalisieren würde Provenienz erfinden, genau das, was die Mensch/KI-Trennung verhindern soll. Im Werkzeug lädt `loadMachineEvidence` die Datei, und `injectMachineEvidence` legt die Items beim Öffnen eines noch nicht entschiedenen Papers als `origin: 'ai'`-Belege vor. Sie sind advisory, als KI markiert, setzen nie `work.cats`, zählen nicht in den bindenden Beleg-Count und werden nie in die Reviewer-Datei geschrieben.

Begründung. Damit ist die in ADR-016 angelegte Provenienz-Bindung nicht nur reaktiv (wer aus der KI-Schicht pinnt), sondern proaktiv erfüllt, der Reviewer sieht die maschinelle Einschätzung je Kategorie von Anfang an, klar als KI gekennzeichnet, ohne dass sie die abgeleitete menschliche Entscheidung kippen kann. Die Wahl der Modell-Begründung statt der Roh-Zitate hält die Daten ehrlich, ein unkategorisierter Schnipsel wird nicht künstlich einer Kategorie zugeschrieben.

Effekt. Implementiert (`scripts/build_screening_index.py` build_machine_evidence, `docs/data/machine_evidence.json`; `docs/js/prisma.js` loadMachineEvidence, injectMachineEvidence, Ausschluss aus dem bindenden Count, kein Schreiben in die Reviewer-Datei). Die Provenienz-Kennzeichnung und die bindende Separierung sind test-abgedeckt (`tests/tests.js`). Schließt den proaktiven R2-Punkt (Maschinen-Evidenz vorladen), der nach ADR-016 offen blieb. Die Synthese-Ebene (KI1) bleibt davon unberührt und weiter offen.

### ADR-019 PRISM the binding screening gate; the review complete only once all data has passed through it (supersedes the seed-case-study framing of ADR-001, the simulated Excel-capture path, and the no-conformance reading of round 1)

Kontext. Two framings had drifted apart from each other and from the build. The simulated P3 decisions ([[plan]], 2026-06-09, pending ratification) cast the colleagues' Excel as the capture path and PRISM as a downstream layer that ingests it, and recorded the in-tool screening usage model as partially falsified. The requirements and the data model were built the other way, every screening decision captured in the tool as the binding record (FR-02, FR-04, FR-11 to FR-13; the `ScreeningRecord` in [[data]]), with the existing corpus treated only as a read-only seed and rendered after the fact, no conformance claimed for round 1 ([[plan]] Stage R). The operator has now ratified one direction.

Wahl. PRISM is the binding screening surface for the project, and the literature review counts as complete only once all of its data has passed through PRISM under PRISMA 2020 and PRISMA-trAIce, the screening decision, the evidence grounding, the flow, the agreement reference, the checklist, the disclosure, and the record. The first-round corpus is carried through PRISM as a real pass, not merely rendered; the Stage R replay becomes the seed of that pass, and the interactive screening pass (R3) and the published record (R5) are completion steps rather than optional overlays. The Excel import bridge (P3) survives only as an entry and migration seam for batches captured elsewhere, no longer as the canonical capture path. The earlier claim that in-tool screening was falsified is withdrawn; it rested on a partial, unexecuted usage assumption, not on an observed test.

Begründung. The build already encodes this direction, so the ratification closes the gap between the documentation and the instrument rather than commissioning new code. One binding surface makes every decision auditable in one place and lets the conformant artifacts fall out of the data model by construction, which is the project's standing novelty claim ([[INDEX]] glossary, [[data]]). Routing the first round through the same gate as the update makes reproducibility a property the tool enforces rather than a claim asserted twice. The honest limits of the first round survive the change unchanged. The absent pre-registered protocol (PRISMA 2020 item 24 and trAIce M1) cannot be repaired by passing the data through the tool, because pre-specification is by definition prior; the corpus papers without a human decision, the papers with no served text, and the lost acquisition provenance stay named. Conformance therefore means full conformance for everything the gate now governs and an honestly gapped record for the items that are structurally unrepairable in retrospect.

Effekt. Supersedes ADR-001 (the existing review is no longer a seeded case study but data carried through the gate) and the simulated Excel-capture and falsified-in-tool-screening decisions in [[plan]]. [[plan]] Stage R is reframed from a retrospective replay to the first real pass, and the Zielbild completion test is restated against the gate. The round-1 record is reframed from no-conformance to the gate-plus-named-gaps framing. [[standards]], [[methods]], [[design]], [[INDEX]], [[data]], and [[update-protocol]] are aligned in the same pass. The round-2 update ([[update-protocol]], Stage B) is unchanged in substance; it now reads as the second pass of one rule rather than the first conformant one. The colleague-facing capture question (do reviewers screen in the tool or import from Excel) is settled in favour of in-tool screening, with import as the seam; the per-story validation verdicts in [[plan]] stay simulated until the stakeholder meeting ratifies them in person.

## Was nicht reingehört

Architecture (stack, data flow, module boundaries) belongs in a future `architecture.md`; the data model belongs in [[data]]; design tokens and UI patterns belong in [[design]]; the standards themselves belong in [[standards]].

