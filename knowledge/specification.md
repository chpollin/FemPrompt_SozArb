---
title: Specification
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: complete
language: en
version: "0.7"
created: 2026-06-09
updated: 2026-09-20
authors: [Christopher Pollin]
generated-with: Claude Code (Claude Opus 4.8), Codex (GPT-6)
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
template:
  name: Vorlage Specification
  version: 0.1
  url: https://dhcraft.org/Promptotyping/promptotyping-document/specification
  alias: https://dhcraft.org/Promptotyping/#promptotyping-document-specification
topics: ["[[Requirements Engineering]]", "[[Decision Records]]"]
related: [project, data, standards, plan, journal]
---

This document is the substance layer for the PRISMA screening tool, a standalone, PRISMA-conformant screening instrument (`docs/prisma.html`, see ADR-008) linked from the Evidence Companion. It describes what the tool does, how it was decided, and how it looks. The tool writes its data files directly into the connected project folder (File System Access); versioning happens outside the tool in GitHub Desktop (ADR-014, supersedes the in-tool Git surface of ADR-009). It has these sections with different update rhythms: Requirements (static, what the tool must do and for whom), Usage scenarios (the narrative usage scenarios), Feature scope (refactored per release, the current shape of the view and its modules), the Design system (the UI and design language, tokens, epistemic principles, and open design questions), and Decisions (monotonically growing ADRs). The data model lives in [[data]]; the standards being implemented are in [[standards]]. The five Companion views form the reference and synthesis layer documented in `CLAUDE.md`; this specification covers the PRISM working layer.

Current round-two interpretation. ADR-034 supersedes earlier round-two requirements that assign direct screening or analysis coding to domain experts. AI agents now prepare the complete batch, a separate AI-agent activity performs source-grounded AI Agent Review, and domain experts later verify the prepared records. ADR-037 binds each assignment to one Work and the exact publication Version used. Earlier requirements and ADRs remain readable where they describe round one or the evolution of the tool.

Current release boundary (2026-09-05). The operator-authorised preliminary result uses explicitly attributed AI source review under [[governance#Publication boundary]]. This revises earlier ADR wording that restricted every public projection to `publication-approved`; the lifecycle meanings and person-attributed final scholarly approval remain unchanged. The working application and its legacy knowledge archive are distinct from the allowlisted result site. Current coverage and completion are defined in [[research-vault#Current implementation state]] and the [generated completion package](../generated/completion/README.md).

## Requirements

### Functional requirements

- FR-01: Load a versioned screening batch from the repository. An operator-only converter may migrate a historical CSV into the current record contract; unknown categories, decisions, reasons, or inconsistent derivations fail closed. Acceptance: the daily editor requires no import interaction, and a converted record cannot bypass Paper-evidence or Include-analysis gates.
- FR-02: Record one operationally isolated screening decision per assigned Work: ten three-level categories (nein/teilweise/ja), a three-way decision derived as (both dimensions ja yields Include; both at least teilweise yields Unclear; any dimension entirely nein yields Exclude), and, on exclude, one reason from a controlled list. The actor may be a person or AI agent and remains explicit. Acceptance: the decision persists with reviewer id, actor type, timestamp, Work ID, and exact Version ID; the derived decision matches the three-level category logic (ADR-024/037).
- FR-03: Enforce independent capture by hiding the earlier expert assessment and the model proposal until the reviewer has saved their own decision. After saving, both references are available in a collapsed comparison section. Acceptance: no earlier judgement, reasoning, or category set is rendered before the independent decision; saving reveals the optional comparison without changing the reviewer's record.
- FR-04: Render a PRISMA 2020 flow diagram with the PRISMA-trAIce R1 split, identified -> screened -> included, with separate tallies for AI-tool decisions and human-reviewer decisions and a breakdown of exclusion reasons. Acceptance: counts reconcile with the decision log; the diagram exports as SVG. As built, the flow renders as an HTML diagram and the SVG export is not implemented.
- FR-05 (superseded by ADR-014/017): Compute agreement metrics live as decisions accrue: confusion matrix (human x AI), Cohen's kappa for the decision and per category, and base rates. As built, the in-tool agreement surface and the kappa computation are removed; agreement is evaluated externally on the benchmark corpus, where the figures live in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion.
- FR-06: Generate a PRISMA-trAIce / RAISE disclosure section from the session: tool name, version, date; stage and task; prompt version; decoding parameters; confidence threshold; a performance reference to the external M9/R2 benchmark evaluation (the in-tool kappa was removed by ADR-017); known limitations; conflicts of interest. Acceptance: emitted as Markdown, copyable and exportable.
- FR-07: Track reporting completeness against both the PRISMA 2020 checklist (27 items) and the PRISMA-trAIce checklist (17 items), with per-item status and notes. Acceptance: status persists across reloads and exports. As built, the tracker covers the PRISMA-trAIce 17 items only; the PRISMA 2020 checklist is not implemented.
- FR-08: Persist a recovery copy in localStorage and write one deterministic JSON file per reviewer into the connected repository folder. Acceptance: reload restores the browser copy; repository and browser records reconcile per paper by timestamp; unreadable or ambiguous file states block writes; operator-only exchange functions remain testable outside the daily editor.
- FR-09: Seed the tool with the existing FemPrompt corpus (the full dual-assessment corpus) as the Stage R seeded session, the round-1 data carried through PRISM (ADR-019). Acceptance: loads from `docs/data/` JSON without an import step.
- FR-10 (secondary): Provide an optional live-LLM on-ramp. With a local API key, request an AI proposal for a paper that lacks one, reusing the versioned assessment prompt. Acceptance: the proposal is stored as an AI decision, visibly labelled as live-generated, and never overrides the human decision.
- FR-11: Read the paper in full text. Where a paper has a Docling conversion, serve it locally as `docs/data/fulltext/{id}.md` (gitignored, ADR-025) and render it as the Volltext layer. The generated knowledge-document distillation is a separate `LLM-Wissensdestillat` reference layer. The reading pane falls back to the abstract where no full text exists. Acceptance: opening a paper listed in `fulltext_manifest.json` shows its full text; the pill reflects `Volltext`, `Metadaten-Abstract`, or `kein Papertext`. It never presents the distillate as a Papertext source.
- FR-12: Search the reading text. Provide an in-text search that highlights and steps through matches in the open Paper layer, plus a corpus-wide discovery index built from the project distillates. Acceptance: the UI labels match types and Paper identity explicitly, and a corpus identity hit never becomes an unrelated in-text query.
- FR-13: Pin a hit as evidence for a category. From a search hit or a selected passage, attach the term plus its surrounding snippet to one of the ten categories as a stored Beleg; evidence is saved with the decision and is citable in the report. Acceptance: every category recorded at `teilweise` or `ja` carries at least one Paper-layer evidence pin; the snippets persist in the reviewer file with separate source-layer and actor provenance.
- FR-14 (implemented 2026-07-18, strengthened 2026-08-22, ADR-026/028): Capture the qualitative analysis coding for included papers inline in the screening assessment column. The analysis fields appear once the binding decision is Include, including an override to Include. Per included paper, record the `AN_` fields as closed selections fed from `assessment/categories.yaml` v1.3, a per-field `nicht entscheidbar` capture, the text-source-derived `AN_Coding_Basis`, and `AN_Notes`; evidence pins carry their Fundstelle. Export uses the `human_assessment.csv` column schema. `src/publish/build_analysis_fields.py` emits `docs/data/analysis_fields.json` from the frozen `analysis_fields` block, which is the vocabulary source for the panel. `sanitizeAnalysis` drops values outside that vocabulary. The save gate requires a complete and internally consistent analysis record for Include. With Fulltext as the coding basis, `AN_Harm_Types` is required. A `nicht entscheidbar` selection clears competing values. Test coverage includes visibility, closed vocabulary, required fields, contradictory states, coding-basis derivation, export shape, reviewer-file determinism, and backward compatibility.
- FR-15 (implemented 2026-08-24, ADR-037): Bind bibliographic records to a stable Work and an exact publication Version. The registry groups Preprints, Accepted Manuscripts, Versions of Record, corrected Versions, and other known expressions without collapsing their identifiers or provenance. Acceptance: every corpus record and intake candidate resolves through the registry; preferred and latest Versions are explicit; new screening records and evidence carry `work_id` and `version_id`; source mismatch fails closed; screening coverage is computed at Work level.

The AI-forward requirements are demoted by ADR-012 and ADR-014. As built, FR-03 is a fixed independence rule rather than a user-controlled mode: earlier human and model assessments stay hidden until the reviewer's own decision has been saved. FR-05 has no in-tool surface or computation; agreement is evaluated externally on the benchmark corpus, with the figures in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion. FR-10 remains optional and unimplemented. The screening view centres on reading, searching, evidence capture, and complete analysis coding.

FR-11 to FR-13 acceptance, as built: FR-11 renders the reading text with a built-in Markdown renderer, falling back to the abstract, then to an empty state. FR-12 highlights and steps through in-text matches in the open document and filters the corpus via the prebuilt `docs/data/fulltext_index.json`; Enter applies the current query before navigating its matches. FR-13 pins a selected passage or a search hit as evidence with text, timestamp, source layer, and actor. A Paper pin starts an empty category at level `teilweise`; the reviewer explicitly decides whether it remains `teilweise` or becomes `ja`. The behaviour contract is in [[data]] (Evidence behaviour). The paper layer is the local Docling full text served under `docs/data/fulltext/` where one exists, the abstract otherwise (ADR-025); the source actually read is recorded per decision as `text_source` with the values `raw`, `abstract`, or `none` and rendered as a pill (ADR-027), while the superseded P2 design that resolved the raw texts from `generated/markdown_clean/` of the connected clone did not survive. On public Pages, where the full-text layer is not published, the abstract is the reading text. The File System Access write path remains on the manual checklist (`tests/manual-checklist.md`), since it cannot be exercised headless.

Acceptance (one-workspace IA, ADR-020/028/029; read/edit clarification 2026-09-05): Screening is the permanent surface. Ordinary entry and reload start in read mode, even with a saved reviewer profile. Only `Bearbeiten` enables the short reviewer key and repository-folder setup, annotation controls and saving. Returning to reading preserves the unsaved draft without writing it; the edit-mode flag is not persisted. Explicit `trial=1`, `actor=agent` and `verify=1` URLs retain their working modes, while acceptance remains read-only. Daily editing retains a compact target and folder status plus one disk action beside the paper position. Backup, import, project administration, reconciliation, and report triggers have no editor-facing surface. The underlying pure data and report functions remain available for tests and operator tooling. Kappa and the matrix have no in-tool computation; the disclosure references the external benchmark evaluation. A persisted older surface id is normalised onto the screening workspace on load.

### Non-functional requirements

- NFR-01: Static application, no backend. All logic is client-side and deployable on GitHub Pages. Runtime libraries are pinned under `docs/vendor/`; the public application loads no CDN resource. Measure: the view runs from `docs/` with no application server and the browser acceptance run records no external runtime request.
- NFR-02: Architectural consistency. IIFE modules expose shared behaviour through the `window.EC` API, matching the Companion views. Measure: a code reviewer recognises the same pattern as `kategorien.js` and `literaturbild.js`.
- NFR-03: Reproducibility. The canonical screening path uses pre-computed, file-backed AI assessments; live LLM calls are opt-in and labelled. Measure: a session can be reproduced from its exported JSON without any network call.
- NFR-04: Accountability (RAISE). Agent records retain `actor: agent` and remain distinguishable through typed provenance. Domain experts hold final scholarly authority. PRISM records domain verification and publication approval as separate lifecycle events. Measure: loading, saving, merging, verification, and export preserve the full schema-0.5 envelope.
- NFR-05: Data sovereignty. The optional Knowledge Chat keeps its API key in `sessionStorage`, scoped to the current tab. A request transmits the question and selected research context directly to the named model provider. No key is committed. Measure: a new tab has no stored key, the interface discloses the transmitted context, and the application contacts no provider before an explicit request.
- NFR-06: Keyboard-first screening. Category toggles and include/exclude reachable by keyboard, echoing the `markdown_reviewer.html` shortcut model. Measure: a full paper can be screened without the mouse.
- NFR-07: Performance. Smooth interaction for at least 500 papers in one session. Measure: no perceptible lag on decision entry or diagram redraw at that size.

## Usage scenarios (epics and user stories)

Usage scenarios in the form "As [role], who [context], I want [goal], so that [benefit]". Roles: the review lead, the reviewing experts (both university partners), the technical lead, and an external reviewer or auditor. The stories were written by the technical lead as a user proxy and stay hypotheses until validated against how the colleagues actually work; ADR-019 ratifies in-tool screening as the binding path and keeps the Excel import bridge only as an entry seam, superseding the earlier reading that the in-tool model had been falsified. The former ledger of decided questions left [[plan]] in the consolidation of 2026-08-23, and the [[journal]] entry of 2026-07-03 (Session 30) records how its simulated verdicts became project decisions. An acceptance session with the domain experts is listed in [[plan#Waiting on the project owner]].

### v4 core (current, evidence-grounded)

- Read and move through the Paper text fast. As a reviewing expert with many papers to get through, I want the local Docling full text where available and the metadata abstract otherwise, so that the generated distillate cannot silently become my evidence basis. (FR-11; reading-text source in [[data]].)
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

## Feature scope

### Information architecture (current)

Per ADR-012 the seven surfaces collapsed, AI was strongly reduced, and the screening view was rebuilt around full-text reading, search, and evidence. ADR-020 merged the working tabs into one workspace; ADR-029 reduces the editor workflow to two first-use settings and one daily save action:

1. Screening (the permanent workspace): a corpus overview with full-text search across all papers, plus a single-paper full-text working view with in-text search, evidence pinning per category, the derived include/exclude with the reason-gated symmetric override (ADR-023), and an optional collapsed AI suggestion. Subsumes the old Screening Workspace.
2. First-use setup and compact storage status: a filename-safe reviewer key and the local repository folder are selected once. The resulting target and save state remain visible in a compact line. Git versioning stays in GitHub Desktop.
3. Internal output functions: PRISMA flow, checklist, disclosure, decision-log, import, and reconciliation remain pure data functions or operator utilities. They have no control in the daily editor.

The build is specified screen by screen in the Design system section below.

The modules below describe PRISMA Flow, Checklist, Disclosure, and Data I/O in application order. The Screening view is specified by FR-11 to FR-14 and the evidence model in [[data]]; its old v3 modules survive only in the ADR log below.

### PRISMA Flow Diagram

Purpose. The PRISMA-trAIce adapted flow diagram as the tool's signature artefact.

Data basis. The `FlowModel` aggregation over all decisions (see [[data]]).

Interaction. Live redraw as decisions accrue; separate AI-decision and human-decision tallies per screening stage; exclusion-reason breakdown. The diagram renders as HTML; the SVG export remains an unbuilt requirement (FR-04).

Limits. It visualises the recorded process; it does not infer counts the data does not support, and it follows the PRISMA 2020 three-phase structure (Identification, Screening, Included), not the 2009 four-phase one.

### Checklist Tracker

Purpose. Track reporting completeness against PRISMA-trAIce (17 items); the PRISMA 2020 27-item checklist remains an unbuilt requirement (FR-07).

Data basis. A per-item status/notes store plus auto-derived hints (e.g. R1 satisfied once the split diagram has counts).

Interaction. Mark items, attach notes, see which are auto-satisfied by the session data; export the filled checklist.

Limits. It tracks reporting completeness, not methodological quality (AMSTAR 2 / ROBIS remain separate, see [[standards]]).

### Disclosure / Report Generator

Purpose. Emit the AI-disclosure text and the assembled PRISMA record for a paper or report.

Data basis. `DisclosureMetadata` plus the flow results (see [[data]]).

Interaction. Generate a Markdown disclosure section (PRISMA-trAIce M2/M3/M6/M8/M9 + RAISE Table 1), preview, copy, export; the decision log exports separately as CSV.

Limits. It drafts reporting text from recorded facts; the author edits and remains accountable. It does not submit, publish, or cite on the author's behalf.

### Data I/O

Purpose. Get batches in and PRISMA records out without a backend.

Data basis. Session JSON (full state), decision-log CSV, the Stage R seed dataset (the round-1 data carried through PRISM).

Interaction. The daily editor loads the repository corpus, retains a browser recovery copy, and writes the selected reviewer file through one disk action. Historical conversion, reconciliation, disclosure, and exchange remain operator functions without editor-facing controls.

Limits. Collaboration is file-based through separate reviewer JSON files and GitHub Desktop. Concurrent tabs using the same reviewer key are outside the supported workflow.

## Design system

The UI and design working layer for the tool. UI work proceeds from this section together with the Requirements above; it carries the current direction, the PRISMA essentials that drive the interface, the people it serves, the workspace and its panels as built, the design system proper, the epistemic principles, the tokens, the genesis of the design, and the open questions. Full standards detail lives in [[standards]], the data model in [[data]].

### Current direction

The tool is centred on evidence-grounded screening (ADR-012) and brings human and AI assessment together into a synthesis rather than scoring them against each other (ADR-014). Earlier iterations foregrounded the human-AI divergence study (blind reveal, kappa, matrix, reconciliation), which is the content of the paper and the Evidence Companion, not the work of the expert who wants to read literature fast. Three principles carry the current build.

1. Evidence-grounded screening is the core. The screening view is built around the paper's reading text (the local Docling full text served under `docs/data/fulltext/` where one exists, the abstract otherwise, ADR-025, see [[data]]), an in-text and corpus-wide search, and pinning a search hit as a Beleg on a category. A category is not a bare checkbox, it carries the words that justify it, which is reproducible and matches the reviewing colleagues' method.
2. AI is advisory and reduced. Earlier expert and model assessments stay hidden until the reviewer saves an independent decision. They can then be opened in a collapsed comparison section. Each Beleg keeps a provenance tag (ADR-015); a pin from the `LLM-Wissensdestillat` remains advisory and cannot satisfy the human evidence gate (ADR-016/028/029).
3. One workspace with a minimal storage state. Editors enter a short personal key and connect the repository folder once. The current target, folder, and save result remain compactly visible. A disk icon beside the paper position is the only primary storage action. GitHub Desktop handles versioning. Administrative and reporting utilities stay outside the editor surface (ADR-029).

```
SCREENING  ┌ corpus list + full-text search ┐  ┌ full text (formatted, searchable) ┐  ┌ categories + evidence ┐
           │ filter: status / category      │  │ <mark>gender</mark> ... hits 3/7   │  │ Gender  ✓             │
           │ search all texts: "gender"      │  │ "...gendered scripts of care..."   │  │  └ pin: "gendered..."  │
           │ [paper 13/87]                   │  │ [next hit ↵]  [pin as evidence]    │  │ derived: INCLUDE       │
           └─────────────────────────────────┘  └────────────────────────────────────┘  └───────────────────────┘
COMPACT STORAGE      editor key · target file · working folder · save state
INTERNAL OUTPUTS     flow · checklist · disclosure · exchange
```

The synthesis surface that brings human and AI Belege together is the next build; its level (per article, corpus-wide, or both) is the open KI1 decision (Open design questions below).

### PRISMA essentials that drive the UI

PRISMA is a reporting standard (make the selection process transparent and auditable), not a conduct standard, so the UI's job is to show the process honestly, not to automate judgement. The design-relevant distillation:

- Flow diagram (PRISMA 2020). Three phases, Identification, Screening, Included. The 2009 standalone Eligibility box is gone, do not draw it. Each phase carries counts; exclusions carry reasons.
- The signature requirement (PRISMA-trAIce R1). At every screening stage where AI was used, the flow diagram and text must distinguish records included or excluded by the AI tool from those decided by human reviewers, and report how many records the AI processed and with what outcome. This AI-versus-human split is the single most important visual in the tool. The adapted diagram adds separate fields for AI-excluded and human-excluded records and separates rule-based admin tools (deduplication) from evaluative AI.
- Governance (RAISE). The UI embodies three principles. The human is accountable and their decision is binding; AI is used with human oversight; any AI that makes or suggests a judgement is fully disclosed. The binding human decision is always visually primary, the AI proposal visibly advisory and secondary, the provenance (model, version, prompt) shown.
- Disclosure (PRISMA-trAIce M2/M3/M6/M8/M9 + RAISE Table 1). The report utilities emit a text block covering tool name, version, date, stage, task, prompt version, decoding parameters, confidence threshold, limitations, and conflicts of interest. Agreement metrics are evaluated externally (see The workspace and its panels as built and ADR-017/029).
- Checklists. PRISMA 2020 and PRISMA-trAIce (each item with a priority level), a trackable list with per-item status and notes; some items auto-satisfy from session data.
- The empirical heart. The project's finding is an asymmetric human-AI divergence, the LLM including more than the experts (the figures live in the data, `generated/benchmark-results/` and `docs/data/`, and the Evidence Companion that renders them). The UI treats this divergence as the product, not an error; it is visible only because AI and human decisions are recorded separately, which is exactly what R1 asks for. Divergence is a first-class, explorable state in the report layer, not the screening view.

### Personas

| Persona | Who | Primary need | Mode |
|---|---|---|---|
| Reviewing expert | reviewing experts | Screen each paper fast, independently, consistently | Keyboard-first, one paper at a time |
| Review lead | review lead | Oversee the selection, see the flow, produce the report | Dashboard, read and export |
| Technical lead | technical lead | Import batches, configure, generate disclosure, run the update | Data I/O and config |
| External reviewer or auditor | journal referee, funder reviewer | Verify the AI use was reported responsibly | Read-only, checklist and flow |

### The workspace and its panels as built

This is the workspace implemented in `docs/js/prisma.js` and `docs/css/prisma.css`, one permanent Screening surface with first-use setup, compact storage status, and one save action (ADR-020/028/029).

#### Page shell

Standalone page `docs/prisma.html` (ADR-008), wearing the Companion design since ADR-014. `js/prisma-data.js` provides the `window.EC` shim over `research_vault_v2.json`. The workspace begins with first-use setup or the compact connected-folder status and the fixed title Screening. The disk icon beside the paper position is the only daily save action.

- First-use setup: reviewer key and working folder.
- Daily storage: exact target file, connected-folder status, write result, and one disk action.
- Output utilities: PRISMA flow, checklist, disclosure, export, import, and reconciliation remain outside the editor surface.

There is no blind-mode toggle and no pre-decision comparison surface. After the independent save, earlier expert and model assessments are available in a collapsed, lazily mounted comparison. A persisted older surface id is normalised onto the screening workspace on load.

#### Screening (default surface)

The per-paper working surface, optimised for reading the document, finding the words that carry a category, and pinning them as evidence. Three panes in one grid.

- Left, corpus navigator. A full-text search box over the whole corpus (FR-12, backed by `docs/data/fulltext_index.json`) plus the paper list with status dots (none, include, exclude) and a hit-count badge when a corpus query is active. Selecting a paper opens it; an active corpus term is carried into the in-text search.
- Centre, reading column. A compact title and metadata header precedes a distinct reading surface. DOI and source URL are direct links. Source-URL-only conversion lines are removed from the document body when they repeat the structured source. A sticky in-text search bar highlights and steps through matches. The local Docling conversion is the Volltext layer; the generated knowledge-document distillation is labelled `LLM-Wissensdestillat` and remains visually and methodically separate. Papers without full text fall back to a corpus abstract marked `Metadaten-Abstract`; papers without a Paper layer show `kein Papertext`.
- Right, assessment. The ten category chips in two dimension groups use click and keyboard help popovers. Pinned Belege are grouped by category. The sticky action dock keeps derivation, validation, and save action visible while the assessment scrolls. Every selected category requires a human evidence pin. Include additionally requires a complete analysis record. Earlier assessments appear after saving in a collapsed comparison section.

Evidence pinning (FR-13). Selecting a passage in the reading column, or pressing "Treffer anheften" on the active in-text hit, opens a category menu. A pin from the Paper layer carries `source_layer: paper`, starts an empty category at `teilweise`, and can satisfy the evidence gate. A pin from the LLM-Wissensdestillat carries `source_layer: llm_distillate`, remains a labelled reference, and cannot satisfy that gate. `actor` separately identifies a human or agent reviewer; `origin` is retained only for backward compatibility. The contract is in [[data]].

```
SCREENING  ┌ Korpus + Volltext-Suche ┐  ┌ Titel · In-Text-Suche · Dokument ┐  ┌ Kategorien · Belege ┐
           │ [Suche: "gender"]        │  │ ...gendered <mark>scripts</mark>  │  │ Technik  Sozial      │
           │ ● Paper A      3×         │  │  of care...   [‹ 3/7 ›][anheften] │  │  Gender ✓            │
           │ ○ Paper B                 │  │ [Volltext | LLM-Wissensdestillat] │  │   └ "gendered..." M │
           │ ● Paper C      1×         │  │  Text markieren → Beleg anheften  │  │ abgeleitet: INCLUDE  │
           └───────────────────────────┘  └───────────────────────────────────┘  │ [Entscheidung] ↵     │
                                                                                   │ ▸ KI-Vorschlag (adv) │
                                                                                   └──────────────────────┘
```

#### Report and exchange utilities

The output functions compute the PRISMA 2020 flow with the trAIce R1 split, the checklist, disclosure, decision log, and deterministic reviewer reconciliation. ADR-029 removes their trigger from the editor because they do not belong to the per-paper workflow. Tests and operator scripts call the same pure functions. Since ADR-017 the disclosure no longer computes kappa or the matrix in-tool; it carries the trAIce M9/R2 item as a reference to an external benchmark evaluation.

#### Reviewer and storage

The first-use setup requires a short reviewer key before the first save. The key is canonicalised to lowercase to prevent case-fold collisions on Windows and fixes the target `docs/data/screening/<key>.json`. The picker accepts the repository root and resolves the screening directory below it; choosing the screening directory itself remains supported. After connection, the setup collapses to the exact target, folder status, write result, and a secondary folder-change action. The disk icon beside the paper position writes the file. GitHub Desktop handles commit and push. The application generates no commit message and invokes no Git action.

### Design system proper

The tool inherits the Companion frame and carries its own screening design language, ported from the PRISM design handoff (Design genesis below).

- Typography. System sans-serif fonts serve the interface, the platform monospace stack serves identifiers, and Georgia serves headings and the Paper reading surface. This avoids remote font requests while retaining the distinction between interface, data, and source text.
- Colour (OKLCH, semantic). Cool slate neutrals at very low chroma; functional accents at a shared chroma with hue carrying meaning, namely human and binding indigo, AI and advisory teal, include green, exclude red, divergence amber. Colour encodes the human-to-AI epistemic distinction consistently across components.
- Structure and code. One IIFE module `docs/js/prisma.js`, `'use strict'`, talking to `window.EC`; the screening grid is `--pt-nav-w | 1fr | --pt-rail-w`; `pt-*` namespaced CSS variables; responsive collapse of the navigator to an icon rail; width tokens for a real fullscreen tool. No framework and no build tool. Shared design tokens live in `docs/css/tokens.css`; PRISM and the Literature Landscape keep their view-specific styles separate. Runtime libraries are pinned locally.
- Data access. `window.EC` over `research_vault_v2.json`; the corpus search index is `docs/data/fulltext_index.json`, loaded once and lazily.
- Category system. The ten-category spectrum (`EC.CAT_COLORS`, the rainbow gradient in Gegenstand-to-Perspektive order); dimension grouping technology {AI_Literacies, Generative_KI, Prompting, KI_Sonstige}, social {Soziale_Arbeit, Bias_Ungleichheit, Gender, Diversitaet, Feministisch, Fairness}.

### Epistemic design principles

Each operationalises the project's thesis (reliability as a property of the process) and the standards.

1. Synthesis, not adversarial scoring. Human and AI assessment are brought together; the tool does not blend them into one number and no longer scores them against each other in the working view (ADR-014). Where they meet, each Beleg carries its provenance.
2. The current decision and lifecycle state are visually primary. AI proposals remain labelled references. AI-agent-reviewed records carry their status until domain experts verify them and record publication approval.
3. Provenance is always visible. Model, version, prompt version, and parameters travel with every AI proposal; each Beleg shows whether it is human or machine-sourced (PRISMA-trAIce M2/M6).
4. Reporting is a by-product, not extra work. The flow, the checklist, and the disclosure assemble themselves from the act of screening; the user never feels they are doing PRISMA on the side.

### Design genesis (the PRISM handoff)

The screening design language did not start from scratch. A second, independent high-fidelity prototype of the instrument was produced in Claude Design from the same [[data]] model and handed off as a bundle (README, transcript, React source, reference screens). It was a design reference, not the shipped tool, a clickable React prototype consuming the data substrate verbatim, with fabricated seed papers, that demonstrated the interaction model and a rigorous OKLCH-plus-IBM-Plex design system.

The decision (iteration v3) was to port its design language and interaction model onto the existing vanilla, Git-backed `docs/prisma.html` and keep React out, computing every metric live from the real corpus and the real per-reviewer data rather than from the prototype's hardcoded constants. Ported: the OKLCH token system and the IBM Plex tri-family, the three-pane workspace, the derived-decision-plus-explicit-override pattern with a required exclusion reason, the disclosure generator, and the checklist tracker with verbatim item text and priority. The v4 redesign (ADR-012) then recentred the panes on corpus search, reading, and evidence, removed the blind/reveal Agreement rail from the working view, and moved the comparison apparatus to the report layer, where ADR-014 and ADR-017 later removed it entirely. The fuller genesis of these iterations is in [[journal]].

### The screening surface and its evidence basis

PRISM is the binding human screening surface for the project (ADR-019), and the reviewing colleagues screen in the tool. The literature review counts as complete only once its records have passed the PRISM evidence and analysis gates. The historical CSV converter survives as an operator-only migration seam. Evidence is captured per decision; later reconciliation consumes those records without replacing their provenance. Agent records can enter the same versioned data area only with explicit provisional status and subsequent substantive ratification.

ADR-025 fixes the evidence basis: a local clone serves the cleaned Docling text as the Paper layer and falls back to the metadata abstract. The public site does not publish the local full texts. The generated distillate is a separate `LLM-Wissensdestillat`, stays unavailable until the independent decision is saved, and cannot satisfy the Paper-evidence gate. Every decision records `text_source`; every pin records `source_layer` and `actor`.

### Open design questions

1. The synthesis surface level (KI1): per article, corpus-wide, or both. This remains an operator decision for a future research function.
2. Stable, source-hashed text anchors for evidence projected beyond the local reviewer file.
3. A canonical consensus writer for human reconciliation; the current utilities provide deterministic comparison only.

## Decisions

### ADR-001 Prospective screening tool, not retrospective documentation

Context. The Evidence Companion today documents a finished review. The new view could either present that review through a PRISMA lens (viewer) or let colleagues conduct new screening (working tool).

Decision. Build a working, prospective screening tool; treat the existing corpus as a seeded case study.

Rationale. The stated need is that colleagues work better with the instrument, and a literature update with the same prompts is planned for the SocialAI strand. A viewer would not support that; a working tool does and still subsumes the retrospective view via the seed dataset.

Effect. Superseded by ADR-019. PRISM is the binding screening gate and the existing corpus is carried through it as a real pass, not held as a read-only seeded case study; the prospective-tool choice itself stands.

### ADR-002 Batch-import canonical, live-LLM optional

Context. A static app cannot run a server-side LLM batch, yet the project's principle is reproducible, file-backed data (no AI playground).

Decision. The canonical path imports papers plus pre-computed AI assessments (produced offline by the existing Python pipeline); a live-LLM on-ramp with a local key is an opt-in convenience.

Rationale. Keeps the reproducibility guarantee (NFR-03) while still letting a colleague get an AI second opinion on a stray paper, reusing the Knowledge Chat client-side-key pattern.

Effect. To be observed.

### ADR-003 Round-1 expert decision binding, AI advisory

Context. RAISE requires human oversight and author accountability; PRISMA-trAIce R1 requires AI and human decisions to be separable.

Decision. The expert decision is the binding round-1 record; the LLM decision is stored separately as advisory.

Rationale. Satisfies RAISE P1/P2 and makes the R1 split structurally possible; matches the project's responsibility-asymmetry thesis.

Effect. This remains the authority rule for the completed round-1 comparison. ADR-034 defines the later lifecycle for round 2.

### ADR-004 Blind independent screening mode

Context. The dual assessment track's value is that expert and LLM judge independently; seeing the AI proposal first would anchor the expert and collapse the comparison.

Decision. Offer a blind mode that withholds the AI proposal until the human decision is saved, then reveals it and computes divergence.

Rationale. Preserves the parallel-independent design that produces the human-AI divergence, and yields clean AI-vs-human tallies for the R1 diagram.

Effect. Superseded by ADR-011/012/014. ADR-011 set blind mode off by default, ADR-012 demoted the AI-forward parts, and ADR-014 removed blind/reveal from the tool entirely; the as-built view has no blind toggle (see FR-03 as built).

### ADR-005 Integrate as a fifth SPA view, not a subpage

Context. The tool could be a separate subpage or a new view inside the existing single-page app.

Decision. A fifth view inside `docs/index.html`, with its own IIFE module wired through `window.EC`.

Rationale. Keeps one application, reuses the corpus data, navigation, and styling, and matches the user's stated preference. Lower friction than a separate entry point.

Effect. Superseded by ADR-008; the tool became the standalone `docs/prisma.html`.

### ADR-006 localStorage plus JSON export for persistence

Context. A static app has no database, but screening decisions must survive reloads and be shareable.

Decision. Autosave the session to localStorage; share via explicit JSON export/import; export the decision log as CSV.

Rationale. The only backend-free option that preserves work and enables multi-reviewer reconciliation through files.

Effect. Superseded by ADR-009; concurrent multi-reviewer editing is explicitly out of scope (see Feature scope, Data I/O).

### ADR-007 Adopt PRISMA-trAIce as reporting target and RAISE as governance frame

Context. PRISMA 2020 alone does not operationalise the AI-vs-human split; two 2025 frameworks now do.

Decision. Implement PRISMA-trAIce (17 items, esp. R1) as the reporting target and treat RAISE (three principles, Table 1) as the governance frame; cite PRISMA-trAIce as a proposed, not yet formally endorsed, extension.

Rationale. They legitimise the existing dual track and give a concrete checklist to close gaps (protocol pre-registration, parameter disclosure, conflict-of-interest declaration). See [[standards]].

Effect. To be observed; the disclosure generator (FR-06) and checklist tracker (FR-07) are the direct consequences.

### ADR-008 Standalone fullscreen page (supersedes ADR-005)

Context. The tool grew into a Git-based working instrument; an embedded companion view cramped it into a reading-column layout.

Decision. Promote it to a dedicated fullscreen page `docs/prisma.html`; the companion's PRISMA nav links to it. A small data layer (`prisma-data.js`) provides a `window.EC` shim over `research_vault_v2.json` so the screening logic runs without the full companion app.

Rationale. A working screening tool needs full width and its own chrome, and a clean separation from the reference/exploration companion.

Effect. Implemented (rebuild stage 1). Supersedes ADR-005.

### ADR-009 File System Access persistence with Git (Git surface later removed by ADR-014)

Context. Collaborators must download the repo, screen in the browser, write into the data, and commit; localStorage alone is not shareable.

Decision. The File System Access API writes per-reviewer JSON files into `docs/data/screening/`, committed with Git by the user; export/import is the fallback; localStorage stays as a live cache.

Rationale. Git becomes the sync layer with no backend, matching the described "write into the data, commit, the other pulls" workflow.

Effect. Implemented (rebuild stage 2). Direct write is Chromium-only; the fallback covers Firefox/Safari. Supersedes ADR-006. ADR-014 later removed the in-tool Git surface (the add/commit/push hint and the Git language); the direct write stays, but versioning moved to GitHub Desktop outside the tool. The persistence mechanism is unchanged; only the in-tool Git affordance is gone.

### ADR-010 One file per reviewer

Context. Two reviewers editing one shared file would produce Git merge conflicts.

Decision. One JSON per reviewer (`<reviewer>.json`); the tool reads all of them to aggregate, and writes only the current reviewer's file. The existing expert assessment is a built-in `seed` reviewer.

Rationale. Conflict-free in Git, matches independent dual review (PRISMA-trAIce M8), and enables the Reviewers reconciliation surface.

Effect. Implemented (rebuild stage 2/4).

### ADR-011 Blind mode defaults off (resolves the design Q1)

Context. Blind-on by default hid the AI proposal on the seed case study, making screened papers look blank.

Decision. Blind mode defaults off; a reviewer turns it on for independent fresh screening.

Rationale. The tool opens on the seed, where seeing the AI is the point; independence is a deliberate per-session choice, not a default that confuses first contact.

Effect. Implemented (rebuild stage 3), together with: exclusion reason now required (no silent default), seed assessment shown as reference, derived decision suppressed until a category is set, and a boilerplate-abstract warning.

### ADR-012 Evidence-grounded screening, three views, reduced AI (supersedes the AI-forward parts of ADR-003/004 and the seven-surface IA)

Context. In use, the tool foregrounded the human-AI divergence study (blind reveal, kappa, matrix, divergence patterns, reconciliation) that is really the content of the paper and the Evidence Companion. The expert in the loop needs to work through literature fast, the way the reviewing colleagues actually did: by reading and searching the full text and grounding each category in concrete words found in the text. A number of papers also have no abstract in the corpus, so abstract-only reading is insufficient.

Decision. Recenter the tool on evidence-grounded screening. (1) The screening view is rebuilt around full-text reading and search (FR-11, FR-12), with found terms pinned as evidence to categories (FR-13). (2) AI is strongly reduced to an optional, collapsed suggestion; the human-AI comparison, kappa, and matrix move to the report layer, computed but not foregrounded; blind mode becomes optional and off by default. (3) The seven surfaces collapse into three: Screening, PRISMA & Report, Daten & Repo.

Rationale. Matches how the review was conducted, makes the tool legible (each view has one job and a what-do-I-do-here line), and removes apparatus the working user does not need, while still producing the PRISMA-trAIce R1/R2 data quietly for the report. The divergence research stays the property of the paper and the Companion, not a burden on the screening UI. Decided with the user 2026-06-09 after the v3 design port.

Effect. Knowledge docs updated; implementation is the next iteration. The agreement and reconciliation logic is kept (moved, not deleted), so PRISMA-trAIce reporting is preserved.

### ADR-013 Raw full-text reading with recorded text source (planned, not yet implemented)

Context. The screening view currently reads the served distilled knowledge document (`docs/vault/Papers/*.md`), not the raw paper text. Evidence pinned on a distillate inherits the distillate's framing; the 2x2 experiment (journal session 11) showed knowledge documents amplify inclusion bias and degrade the Fairness kappa. The raw Docling texts live in `generated/markdown_clean/`, copyrighted and not served.

Decision. Read the raw local full text from the connected clone through the single `fetchPaperText` seam (option 2 in [[data]]); raw texts are never published; the public Pages site falls back to the served knowledge document, then the abstract. Every decision records which text source was read (`text_source`: `raw`, `kd`, `abstract`) in the reviewer file (schema bump to 0.3, backward compatible) and in the decision-log CSV; the disclosure reports per-source counts (PRISMA-trAIce M4).

Rationale. A Beleg should come from the paper, not from an LLM summary of it; recording the text source makes the evidence basis auditable, the actor-text-evidence triple the round-1 audit could not reconstruct.

Effect. Planned and not yet implemented at the time of this decision (the former plan item P2). Until then the screening surface read the knowledge document, and in-tool Belege carried its colouring. ADR-025 later implemented the raw full-text layer.

### ADR-014 Synthesis over comparison, Git surface removed, design unified (supersedes the comparison parts of ADR-003/004/012 and the Git surface of ADR-009)

Context. Three operator decisions on 2026-06-21 reshaped the tool. (1) The leitmotif changed: human and AI assessment are never to be compared but always brought together into a synthesis; the built comparison surface (matrix, kappa, divergence, reconciliation) ran against that. (2) The in-tool Git surface duplicated what GitHub Desktop does and added a command block the working user does not need. (3) The tool page carried its own slim header and design, out of step with the four-view Companion.

Decision. (1) Remove the human-AI comparison surface from the tool: the Mensch-KI-Uebereinstimmung section, the confusion-matrix view, the kappa display, the divergence filter, and the reviewer reconciliation table are gone. The pure functions (`computeMatrix`, `cohenKappa`, `kappaLabel`) and the PRISMA-trAIce R1/R2 reporting data stay, feeding only the disclosure line. (2) Remove the in-tool Git surface (add/commit/push hint, Git language); keep the direct File System Access write into the project folder; versioning is GitHub Desktop, outside the tool. (3) Lift the tool page onto the Companion design (white background, rainbow accent bar, shared header, navigation, and footer, Font Awesome); unify the navigation across all five pages.

Rationale. The synthesis direction makes the tool produce a joint, evidence-grounded judgement instead of an adversarial human-vs-AI score; the divergence research stays the property of the paper and the Evidence Companion, not a burden on the screening UI. Removing the Git surface matches how versioning actually happens (GitHub Desktop) and cuts apparatus. One design across all pages makes the tool read as part of the Companion, not a bolt-on. Decided with the operator 2026-06-21.

Effect. Implemented and consolidated to main. Left open for the operator was the synthesis level (per article, across the holdings, or both) that underlies the synthesis surface still to be built. The provenance of each Beleg (AI or human) stays marked per Beleg (decided, implemented in ADR-015). The disclosure line with kappa and matrix was removed with ADR-017, `computeMatrix`, `cohenKappa` and `kappaLabel` were dropped together with their test, and agreement is evaluated externally.

### ADR-015 Per-Beleg provenance as a stored field, neutral, without valuation

Context. ADR-014 decided to bring human and AI assessment together instead of comparing them and recorded that the provenance of every Beleg (AI or human) is preserved. The synthesis surface (level open, KI1) later brings human and machine Belege into one view, and it must then be readable for each Beleg where it comes from.

Decision. Provenance is a stored field `origin` (`human` or `ai`) on every Beleg and no derivation from the render context. `pinEvidence` sets `origin: 'human'` on every reviewer pin, and machine or AI Belege carry `origin: 'ai'` where they are produced. `evidenceListHtml` renders a neutral marker per Beleg (human or AI) with the same shape and size for both. Only the established identity colour (`--pt-human`, `--pt-ai`) distinguishes them, and no valuation is expressed. The field is backward compatible, since a Beleg without `origin` renders as human (old Belege are reviewer pins).

Rationale. A stored field survives the later merge, a derivation from context does not. Neutrality by construction prevents the display from ranking one source above the other, consistent with the AI labelling rule. At the time of the decision all Belege in the list were reviewer pins, and the AI marker was covered by tests for the coming machine evidence (R2). Decided with the operator on 2026-06-21.

Effect. Implemented (`docs/js/prisma.js` pinEvidence and evidenceListHtml, `docs/css/prisma.css`) and covered by provenance tests in `tests/tests.js`. The synthesis level (KI1) stays open, and the provenance field is ready for it. ADR-016 governs the provenance per layer (where the snippet comes from) and its binding effect.

### ADR-016 Reading layers separated, Beleg provenance bound to the source layer

Context. The served knowledge document (`docs/vault/Papers/*.md`) joins two epistemically different layers, the Paper layer (Abstract, Key Concepts, Full Text) and the machine extraction (Kernbefund, Forschungsfrage, Methodik, Hauptargumente, Kategorie-Evidenz, Assessment-Relevanz, Schlüsselreferenzen). The reading view rendered both in one scroll without a boundary. ADR-015 records who pins (a human) and leaves open from which layer the snippet comes. A Beleg copied out of the Kategorie-Evidenz therefore carried the human marker although the text is machine-made. This is the contamination trace that ADR-003 (human binding, AI advisory) is meant to prevent.

Decision. `splitDocLayers` separates the loaded document at the first `## Kernbefund` heading into Paper layer and AI layer. The reading view receives a toggle (Volltext, KI-Extraktion) and shows a band above the AI layer that identifies it as extraction. Beleg provenance is bound to the layer being read, so a snippet from the AI layer receives `origin: 'ai'`. An AI Beleg never sets `work.cats` and therefore never binds the derived human decision. It is displayed as AI and stays advisory.

Rationale. The separation is thereby visible and also enforced in the data flow. The binding record (`work.cats`, and from it `deriveDecision`) feeds only on categories with Paper evidence, and machine evidence cannot tip it. This settles the question of origin that ADR-015 left open and realises for the served document what ADR-013 plans for the raw text, an auditable origin of evidence. ADR-013 (raw text from the local clone, `text_source`) is unaffected and stays open.

Effect. Implemented (`docs/js/prisma.js` splitDocLayers, pinEvidence with an origin parameter, the readingShellHtml toggle, setReadMode, paintActiveLayer, and `docs/css/prisma.css` toggle, band and pin-menu hint) and covered by tests for layer separation and binding separation in `tests/tests.js`. The boundary applies cleanly on all served documents. The synthesis level (KI1) and the proactive loading of `## Kategorie-Evidenz` as preloaded AI Belege (the R2 continuation) stay open.

### ADR-017 Kappa and matrix disclosure line removed, agreement evaluated externally

Context. ADR-014 removed the human-AI comparison surface from the tool. A remainder stayed, because the disclosure line still computed a Cohen's kappa and the confusion matrix through `computeMatrix`, `cohenKappa` and `kappaLabel`. This computation ran over the corpus loaded in the tool (`research_vault_v2.json`), a different set than the benchmark CSVs on which the canonical kappa rests. A number shown in the tool could therefore only deviate from the reference.

Decision. `computeMatrix`, `cohenKappa` and `kappaLabel` are dropped together with their tests. The disclosure keeps the trAIce item M9/R2 as a reference. AI-human agreement is evaluated outside the tool on the benchmark corpus in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion and is not recomputed in the screening tool. The decision was taken on the orchestrator side, is reversible and concerns only the tool. A possible inter-rater agreement statement of the companion paper is unaffected and remains a separate paper decision of the operator.

Rationale. The tool is thereby consistent as an evidence-grounded screening instrument and measures no agreement over a corpus that happens to be loaded. The canonical kappa lives in exactly one place, the benchmark evaluation over the raw CSVs. M9/R2 is referred to this source instead of being concealed, and trAIce conformance is preserved.

Effect. Implemented (`docs/js/prisma.js`, computeMatrix, cohenKappa and kappaLabel removed, disclosureMarkdown switched to the M9/R2 reference, TEST_HOOK cleaned) and covered by tests (section B of the suite removed, and the disclosure test now checks the absence of the tool kappa and the external reference, `tests/tests.js`). The headless run was green after the removal.

### ADR-018 Machine category evidence as a preloaded AI provenance class (R2)

Context. ADR-016 separates the reading layers and binds Beleg provenance to the source layer. A Beleg pinned from the AI layer carries `origin: 'ai'` and never binds the decision. The proactive part of R2 stayed open, namely that the machine category assignment should be visible per Paper as an AI Beleg on opening and not only when the reviewer pins by hand from the AI layer. The served knowledge document carries a `## Kategorie-Evidenz` block of uncategorised `### Evidenz N` snippets, and the data contain no source-to-category assignment.

Decision. A build step (`src/publish/build_screening_index.py`, `build_machine_evidence`) emits `docs/data/machine_evidence.json` with one evidence item per Paper and per LLM-flagged category, whose snippet is the LLM reasoning (`reasoning`) for this Paper. The detailed evidence quotations stay in the AI-extraction reading layer (M3), because locating them on individual categories would invent provenance, which the human and AI separation is meant to prevent. In the tool `loadMachineEvidence` loads the file, and `injectMachineEvidence` presents the items as `origin: 'ai'` Belege when a Paper without a decision is opened. They are advisory, marked as AI, never set `work.cats`, do not count towards the binding Beleg count and are never written into the reviewer file.

Rationale. The provenance binding laid out in ADR-016 is thereby fulfilled proactively as well as reactively (for whoever pins from the AI layer). The reviewer sees the machine assessment per category from the start, clearly marked as AI, and it cannot tip the derived human decision. Choosing the LLM reasoning over the raw quotations keeps the data honest, since an uncategorised snippet is not artificially attributed to a category.

Effect. Implemented (`src/publish/build_screening_index.py` build_machine_evidence, `docs/data/machine_evidence.json`, and `docs/js/prisma.js` loadMachineEvidence, injectMachineEvidence, exclusion from the binding count, no writing into the reviewer file). Provenance marking and binding separation are covered by tests (`tests/tests.js`). This closed the proactive R2 item (preloading machine evidence) that stayed open after ADR-016. The synthesis level (KI1) is unaffected and stays open. Superseded by ADR-022: the preload is removed, the model's reasoning was not paper evidence and fabricated a per-category provenance.

### ADR-019 PRISM the binding screening gate; the review complete only once all data has passed through it (supersedes the seed-case-study framing of ADR-001, the simulated Excel-capture path, and the no-conformance reading of round 1)

Context. Two framings had drifted apart from each other and from the build. The simulated P3 decisions ([[plan]], 2026-06-09, pending ratification) cast the colleagues' Excel as the capture path and PRISM as a downstream layer that ingests it, and recorded the in-tool screening usage model as partially falsified. The requirements and the data model were built the other way, every screening decision captured in the tool as the binding record (FR-02, FR-04, FR-11 to FR-13; the `ScreeningRecord` in [[data]]), with the existing corpus treated only as a read-only seed and rendered after the fact, no conformance claimed for round 1 ([[plan]] Stage R). The operator has now ratified one direction.

Decision. PRISM is the binding screening surface for the project, and the literature review counts as complete only once all of its data has passed through PRISM under PRISMA 2020 and PRISMA-trAIce, the screening decision, the evidence grounding, the flow, the agreement reference, the checklist, the disclosure, and the record. The first-round corpus is carried through PRISM as a real pass, not merely rendered; the Stage R replay becomes the seed of that pass, and the interactive screening pass (R3) and the published record (R5) are completion steps rather than optional overlays. The Excel import bridge (P3) survives only as an entry and migration seam for batches captured elsewhere, no longer as the canonical capture path. The earlier claim that in-tool screening was falsified is withdrawn; it rested on a partial, unexecuted usage assumption, not on an observed test.

Rationale. The build already encodes this direction, so the ratification closes the gap between the documentation and the instrument rather than commissioning new code. One binding surface makes every decision auditable in one place and lets the conformant artifacts fall out of the data model by construction, which is the project's standing novelty claim ([[INDEX]] glossary, [[data]]). Routing the first round through the same gate as the update makes reproducibility a property the tool enforces rather than a claim asserted twice. The honest limits of the first round survive the change unchanged. The absent pre-registered protocol (PRISMA 2020 item 24 and trAIce M1) cannot be repaired by passing the data through the tool, because pre-specification is by definition prior; the corpus papers without a human decision, the papers with no served text, and the lost acquisition provenance stay named. Conformance therefore means full conformance for everything the gate now governs and an honestly gapped record for the items that are structurally unrepairable in retrospect.

Effect. Supersedes ADR-001 (the existing review is no longer a seeded case study but data carried through the gate) and the simulated Excel-capture and falsified-in-tool-screening decisions in [[plan]]. [[plan]] Stage R is reframed from a retrospective replay to the first real pass, and the Zielbild completion test is restated against the gate. The round-1 record is reframed from no-conformance to the gate-plus-named-gaps framing. [[standards]], [[methods]], [[INDEX]], [[data]], and [[update-protocol]] are aligned in the same pass. The round-2 update ([[update-protocol]], Stage B) is unchanged in substance; it now reads as the second pass of one rule rather than the first conformant one. The colleague-facing capture question (do reviewers screen in the tool or import from Excel) is settled in favour of in-tool screening, with import as the seam; the per-story validation verdicts in [[plan]] stay simulated until the stakeholder meeting ratifies them in person.

### ADR-020 One workspace, the record and the data functions as on-demand panels (supersedes the three-surface navigation of ADR-008/012)

Context. ADR-012 collapsed seven surfaces to three coequal tabs (Screening, PRISMA & Report, Daten & Repo), and ADR-019 made in-tool screening the binding act. Three coequal tabs frame the record and the data sync as destinations of the same rank as the work. The operator session (2026-06-30) fixed the tool's purpose as an instrument for active research: the screening act is the work, the PRISMA record is its product, the data sync is infrastructure. The reframing (divergence as illustration, not the empirical core) leaves the tool one job, a clean binding screening surface.

Decision. The three tabs merge into one workspace. Screening is the permanent surface; the PRISMA record (flow, checklist, disclosure) and the data functions open as on-demand panels (a right slide-over with `role="dialog"`, Escape, backdrop dismiss, focus moved in and restored on close), not coequal tabs. Academic references (PRISMA-trAIce, Holst et al., RAISE, M9/R2) leave the work surface and live only inside the generated record and the disclosure. The existing render functions are reused: `renderReportSurface(target)` and `renderData(target)` take the panel body as their target; `showSurface` keeps its name for the test hook and routes the two panel ids to the overlay.

Rationale. The work surface then carries only what the screener needs; the record is consulted once, at the end, when the methods section is written; the data sync is an edge affordance, not a place one works. The academic apparatus is provenance for a methods reader, not for the act of screening, so it belongs with the artifact it documents. One place to work, two things to open, beats three coequal destinations.

Effect. Implemented (`docs/js/prisma.js` renderShell, showSurface, openPanel/renderPanel/closePanel, normalizeSurface fixed to screening, renderReportSurface/renderData with a target element, perspectiveBar removed, and `docs/css/prisma.css` workspace toolbar, overlay panel, focus ring). The headless suite was green (65/65), plus a shell smoke test (toolbar present, subnav gone, panels open, work surface without academic references). Supersedes the three-surface IA of ADR-008/012 for navigation; the surfaces' content is unchanged, only their placement and rank. The pin menu's own dialog semantics (a separate finding) stay for the accessibility cut.

### ADR-021 Reviewer identity is the Git commit author; deterministic decisions file and a generated commit message (revises ADR-010, removes the perspective UI)

Context. ADR-010 stored one file per reviewer, named by an in-tool Kürzel, and the report carried a perspective switcher across reviewer tracks. The operator decided (2026-06-30) that reviewer identity is the Git commit author, not a field in the tool: editors keep separate commits, and `git blame` on the decisions file attributes each decision to its author. The web tool cannot read the Git identity itself (a static page, the File System Access permission is sandboxed to the picked folder), so the capture happens at commit time, by Git, not by the tool.

Decision. Drop the in-tool reviewer-identity form and the multi-reviewer perspective switcher. The decisions file is written deterministically, decisions sorted by paper id, one block per paper, so a git diff shows exactly which decisions changed and git blame is meaningful (`reviewerFileText`, `sortedDecisions`). The tool generates a paste-ready session commit message (counts, exclusion-reason breakdown) so the commit documents the work (`commitMessage`). O5, one shared decisions file versus one per person, was decided on 2026-07-03: one file per reviewer, confirming the existing per-reviewer file key, now a minimal filename rather than a managed identity surface.

Rationale. A self-typed identity field is fragile metadata nobody maintains, the standing default `reviewer1` was the proof; Git authorship is stronger, versioned, tamper-evident provenance, which is what a methods project needs to answer "who decided this". Removing the perspective switcher also removes the last in-tool comparison apparatus, consistent with ADR-014 (synthesis over comparison). The deterministic file is the precondition for Git-as-provenance: without stable ordering every save reshuffles the file and blame becomes noise.

Effect. Implemented (`docs/js/prisma.js` sortedDecisions, reviewerFileText, commitMessage; writeCurrentReviewer and the file export use the deterministic form; the data panel switched to Git provenance with a commit helper; perspectiveBar/attachPerspective and the reviewer-identity form removed). Covered by tests (sortedDecisions order, reviewerFileText stability, commitMessage summary; `tests/tests.js` Section H), harness 65/65. Revises ADR-010 (the file key is no longer an identity surface) and removes the perspective UI of the ADR-014 report layer. Both follow-up questions are decided (2026-07-03): O5 is one file per reviewer, and the public-repo reviewer identity is the neutral ids reviewer-1/reviewer-2.

### ADR-022 Machine category evidence removed from the evidence list (supersedes ADR-018)

Context. ADR-018 preloaded the machine per-category assessment as `origin: 'ai'` Belege (`injectMachineEvidence` from `docs/data/machine_evidence.json`). An independent adversarial review (2026-06-30) found that the loaded snippets are the model's whole-paper screening reasoning, not a quote from the paper; that the identical snippet is duplicated verbatim across every LLM-flagged category in most papers, so the per-category structure is fabricated; and that snippets which argue for exclusion sit under a category as apparent support. The tool's purpose is verifiable, text-grounded, human-bound evidence, and a per-category machine "Beleg" of this kind is exactly the contamination the project means to prevent (the same defect class ADR-016 closed for hand-pinning).

Decision. The machine-evidence preload is removed in full: `injectMachineEvidence`, `loadMachineEvidence`, the `machineEvidence` map and its init load, the `renderScreening` injection, and the test-hook seams are deleted, and no machine evidence enters the Beleg list. The overall machine assessment stays visible where it belongs, in the collapsed KI-Vorschlag (the decision, the flagged categories, the reasoning), clearly marked advisory. The reading-layer provenance of ADR-016 is untouched: a reviewer can still pin a snippet from the KI-Extraktion layer as an `origin: 'ai'` Beleg, which is genuine per-snippet provenance.

Rationale. The collapsed suggestion already carries the model's decision and reasoning, so removing the per-category injection loses no information; it removes a false per-category structure and stops include/exclude reasoning being laundered into the evidence panel. Deletion beats a marked-but-misleading display.

Effect. Implemented (`docs/js/prisma.js`: loadMachineEvidence, injectMachineEvidence, the machineEvidence variables, the init preload, the renderScreening injection and the test-hook seams removed; the ADR-018 injection test removed; evidenceCount and commit comments switched to ADR-016). Harness 64/64. Supersedes ADR-018. The generator part `src/publish/build_screening_index.py` build_machine_evidence and `docs/data/machine_evidence.json` thereby became unused and were removed on 2026-06-30 in the audit-driven cleanup. The real `## Kategorie-Evidenz` quotations stay available in the AI-extraction reading layer (ADR-016). Importing them as a real per-category provenance class (the original R2 goal) stays open and would need a verified quotation-to-category assignment that the data do not yet carry.

### ADR-023 Reason-gated override to Include; the rule derives, the human binds (resolves O2)

Context. The screening derives a decision from category coverage (at least one Gegenstand and at least one Perspektive yields Include, otherwise Exclude). Until now the human could override only Include to Exclude; a derived Exclude was rigid. The browser-agent review reproduced the dead end: a reviewer who judges a paper relevant but cannot pin both category groups on thin text was forced to Exclude. That contradicts the project's own binding-human principle (ADR-003) and the governing standards. RAISE holds the synthesist ultimately responsible (P1) and the human decision binding with the rule advisory (P2); a tool that makes or suggests a judgement and then blocks the human from overriding it is not human-bound oversight.

Decision. The override is symmetric and the derived decision is a default, not a gate. From a derived Exclude the human can override to Include, which requires a recorded free-text justification; from a derived Include the override to Exclude already requires an exclusion reason. The justification is written to the decision record (`override: true`, `override_reason`), shown in the locked view, and rehydrated on edit. Toggling a category that flips the derivation clears a now-stale override and its justification.

Rationale. RAISE P3 requires that any AI- or rule-based judgement that is overridden be transparently reported; gating the Include override on a justification records exactly the deviation from the rule rather than hiding it or forcing the reviewer to bend categories. The AND-rule becomes a derivation aid with a documented escape hatch, consistent with the epistemic-infrastructure thesis: the deviation is named, not smoothed over. The binding decision stays human while the rule remains the transparent default.

Effect. Implemented (`docs/js/prisma.js`: finalDecisionOf symmetric, logicInner shows the direction-dependent override, the justification textarea with commit gate, commit writes `override_reason`, assessLockedHtml shows it, editRecord rehydrates it, and `docs/css/prisma.css` override block). With test (Section I). Resolves O2. The reciprocal override to Exclude still carries the exclusion reason, so both override directions are documented.

### ADR-024 Three-level screening categories; the derivation becomes three-way (supersedes the binary category type of ADR-012/023)

Context. Categories were binary (ja/nein) and the AND-rule derived a two-way decision. Reviewers need an intermediate value: a paper can address a dimension partially, and the corpus shows graded relevance rather than presence/absence. The archived 5D track already carried ordinal dimensions; the binary 10K track flattened them.

Decision. Each category takes three levels, nein / teilweise / ja (0 / 1 / 2); a chip cycles through them. The derivation becomes three-way and reuses the existing, previously underused Unclear decision: both dimensions with a ja yields Include; both at least teilweise but not both ja yields Unclear; any dimension entirely nein yields Exclude. The reason-gated override (ADR-023) is unchanged and still lifts a derived Exclude or Unclear to Include with a recorded justification. The existing binary human and LLM annotations stay binary and are shown as-is (a pinned human Beleg and a legacy boolean coerce to ja); only the reviewer's own new input uses the three levels.

Rationale. The three category levels map onto the three decision states the standard schema already offers, so Unclear stops being a dead value and becomes the honest resting state for partial coverage. Graded input records what a binary flag cannot, without a new decision vocabulary.

Effect. Implementiert (`docs/js/prisma.js`: catLevel/dimLevel/deriveDecision three-way, the cycling chip, decCls and the Unclear pill/dot/dec across logicInner, assessLockedHtml, statusLabel; `docs/css/prisma.css` the partial chip and the unclear colour). Mit Test (four deriveDecision cases for teilweise/Unclear, the chip contract). The canonical schema and analysis fields follow in `assessment/categories.yaml` ([[data]], [[update-protocol]]).

### ADR-025 Local full-text reading layer, gitignored, never published (implements ADR-013)

Context. ADR-013 planned raw full-text reading but it was never built; the served knowledge documents carried an empty `## Full Text` placeholder, so the human Volltext layer showed a stub while the real Docling conversions sat unshipped in `generated/markdown_clean/`. The screening premise, decide am Text, could not be met.

Decision. A generator (`src/publish/build_fulltext.py`) resolves each paper to its Docling conversion (via the knowledge doc's `source_file`, fallback first-author-year), cleans it (frontmatter, image comments, GLYPH artefacts) and writes one file per paper to `docs/data/fulltext/{id}.md` plus a `fulltext_manifest.json`. The reading pane loads that as the Volltext layer and keeps the distillation as the KI-Extraktion layer (ADR-016). The full texts are gitignored and never pushed: most are paywalled, so the public Pages site keeps only the fallback (abstract or distillation). Publishing publicly stays a separate, rights-gated decision.

Rationale. The copyright boundary the index builder already drew (do not publish `markdown_clean`) is respected by construction, while the reviewer on a local clone reads the real text. This keeps ADR-013's intent and drops its per-decision `text_source` bump as unneeded once the layer is a first-class asset with a manifest.

Effect. Implementiert (`src/publish/build_fulltext.py`; `docs/js/prisma.js` fetchFullText/loadFulltextManifest/hasFullText, loadReadingInto combines the Volltext and LLM-Wissensdestillat layers, the availability pill; `.gitignore` fences the outputs). Current coverage and exclusions are derived from `docs/data/fulltext_manifest.json`. Corpus search stays on the committed distillation index for the same copyright reason.

### ADR-026 Analysis coding captured in PRISM; Excel demoted to export format (resolves E4)

Context. The coding concept ([[update-protocol]]) drafted the analysis coding as an Excel workflow with vocabulary enforcement at the P3 import bridge and evidence separately in PRISM, three places for one act. The tool already renders the full text, searches it, pins evidence with provenance, and persists binding records; the operator's guiding principle for the coding phase is a low workload for the coders.

Decision. The analysis coding for included papers is captured in PRISM, inline in the existing single-workspace assessment column beneath the decision block, revealed on Include (FR-14, consistent with the one-workspace decision of ADR-020, no new tab or panel of coequal rank): the `AN_` fields as closed selections fed from `assessment/categories.yaml` v1.3 (unchanged, no amendment), a per-field nicht-entscheidbar capture (resolves E3 without a vocabulary change), notes, and Fundstellen from the existing evidence pins (resolves E8). The Excel in the `human_assessment.csv` schema remains the export and fallback format; the P3 bridge remains the entry seam for externally captured batches. The binding boundary is untouched: humans code, every machine contribution stays advisory (ADR-003).

Rationale. Vocabulary enforcement moves to capture time, which the pre-registration expects; a closed selection cannot produce an invalid value. One instrument for reading, screening, and coding keeps the coders' workload low and the evidence chain in one place. Decided with the operator 2026-07-18.

Effect. Implementiert (2026-07-18, FR-14). `src/publish/build_analysis_fields.py` emits `docs/data/analysis_fields.json` from the frozen `analysis_fields` block, the single vocabulary source for the panel; `docs/js/prisma.js` adds the vocabulary loader and helpers (`sanitizeAnalysis`, `setAnalysis`, `analysisNotes`, `harmTypesHint`), the inline panel (`analysisPanelHtml`, rendered in `assessLockedHtml` only on Include and wired by `attachAnalysisPanel`), and the analysis export (`analysisCsv`, human_assessment.csv schema, `AN_` columns after Notes per update-protocol D); `docs/css/prisma.css` styles the panel; `tests/tests.js` Section K covers the acceptance, harness green (91 PRISM, up from 78). The build additions are pure, no existing prisma.js function changed, so the binding screening record is byte-identical: a session that codes nothing writes exactly the pre-FR-14 reviewer file. The Excel in the human_assessment.csv schema stays the export and fallback, the P3 bridge the entry seam. [[update-protocol]] v0.2 records the decisions; E1, E5, and E7 remain open with the coders.

### ADR-027 Text source recorded per decision (schema 0.3), reading loads guarded, reconciliation record generated deterministically (revises the text_source clause of ADR-025; realizes the reconciliation input of plan B3)

Context. The Research Mission Control lane `social-ai · prism-pilot` (2026-08-21) asked for a supported-browser pilot that preserves two isolated reviewer sessions end to end, records the text source actually read, and reconciles decisions deterministically without mutating source data. Three gaps stood against that. ADR-025 had dropped the per-decision `text_source` field as unneeded once the full-text layer carried a manifest; but the manifest states availability, while PRISMA-trAIce M4 asks what the human actually read when deciding, and a decision taken on the abstract because the local clone was not connected is indistinguishable from one taken on the full text. The reading pane applied whichever fetch resolved last, so a slow full text of a paper already left could paint over the paper opened next. And the in-tool reconciliation table was removed with ADR-014, leaving plan B3 without a generated, order-independent input for the consensus session. A fourth finding surfaced in the same inspection: the on-demand panels of ADR-020 (PRISMA record, data and sync) had no visible affordance, so export and import were reachable only through the test hook.

Decision. (1) Every committed record carries `text_source` with the values `raw` (the Docling full text of the local layer), `abstract`, or `none`, taken from the paper layer shown at commit time; the reviewer file schema becomes `femprompt-prisma-reviewer/0.3`, additive and backward compatible (0.1 and 0.2 files load unchanged, a record without the field counts as `unrecorded`); the decision-log CSV gains a `text_source` column and the disclosure reports per-source counts (M4). The value `kd` foreseen in plan P2 does not occur because, since ADR-016, the knowledge document is never the paper layer. (2) `loadReadingInto` takes a monotonic load token and `applyReading` drops a response whose token is stale. (3) `reconcileReviewers` is a pure function over reviewer payloads: reviewers and papers sorted, each paper classified `agree`, `divergent` or `single` on the decision, both source records carried as copies, an empty `consensus` slot per paper for the human consensus session (trAIce M8); the same function serves the data-panel export and the CLI `tests/browser/reconcile.mjs`. (4) The workspace bar carries two buttons that open the record and the data panel. (5) The full-text builder refuses an ambiguous first-author-year fallback (two conversions sharing the prefix) instead of attaching the first. (6) Four findings of the two simulated sessions are folded in: the source pill is corrected in place once the full-text manifest resolves (the first paint could show `nur Abstract` over a full text), the inert layer toggle is hidden on papers without an AI layer (`[hidden]` had been outranked by the toggle's `display` rule), the decision-log CSV reports the current reviewer's decision and key instead of the seed perspective (which has had no UI since ADR-021), and a pinned Beleg sets its category at level 2, the same shape a chip writes. (7) The folder picker may be pointed at the repository root of the local clone, and the tool resolves `docs/data/screening/` below it for the reviewer files and creates the two levels when absent, while a picked folder without a `docs` child is still treated as the reviewer folder itself, the pre-existing connection; the parallel design that would have read the raw texts from `generated/markdown_clean/` of the connected clone does not survive, since the full text comes from the served manifest of ADR-025.

Rationale. Recording what was read is the only way the M4 statement can be made per decision rather than per corpus; the field is cheap, additive, and survives export and import unchanged. The load token removes a silent wrong-paper state that no screenshot would reveal later. A deterministic reconciliation record makes the consensus step auditable and reproducible and keeps the source files untouched, which is the precondition for Git as provenance (ADR-021). The panel buttons restore what ADR-020 decided. Decided within the lane authority (reversible PRISM implementation and directly governing documentation); merge and deployment stay outside it.

Effect. Implemented on branch `lane/prism-pilot` from `origin/main@58cfc07`: `docs/js/prisma.js` (`REVIEWER_SCHEMA` 0.3, `readToken`/`applyReading`, `text_source` in `commit`, `decisionLogCsv`, `textSourceCounts`, `reconcileReviewers`/`reconciliationText`, the two workspace buttons, the data-panel reconciliation export), `src/publish/build_fulltext.py` (ambiguous fallback), `tests/tests.js` Section L (eleven tests, harness 105 PRISM), `tests/test_build_fulltext.py`, the pinned pilot under `tests/pilot/` and the Playwright driver `tests/browser/pilot.mjs` with `tests/browser/reconcile.mjs`; `docs/css/prisma.css` hides the toggle. The session evidence of 2026-08-21 (both reviewer exports, traces, decision logs, the reconciliation in both input orders, SHA-256 list) is committed under `tests/pilot/evidence/2026-08-21/`. Measured against the real corpus (read-only, 326 papers): the ambiguous guard withholds four full texts that the first-match fallback would have attached, three of them one author-year triple; those papers now read as abstract-only instead of possibly carrying a foreign full text. The import bridge (`docs/js/prisma-import.js`) still writes 0.2 records for Excel batches, which carry no text source by nature and load as `unrecorded`. The File System Access write path remains on the manual checklist, now written out as `tests/manual-checklist.md`. Two independent verification rounds followed the build. The second checked the fixes by mutation, which exposed three assertions that named a property without testing it; the browser pilot now carries three checks that each fail under exactly one mutation (removing the commit gate, the post-load re-evaluation, or the load token), and the commit gate was corrected on the edit path, where a reopened decision left the button inert behind a stale hint. Two hardening changes followed the same round: the reading starts before the handlers are bound, so the gate is evaluated against this paper's load rather than the previous one, and the reading promise carries a rejection arm so one throwing fetch helper cannot leave the gate raised for the rest of the session. Item (7) is carried by `resolveScopes` and the repo-root connect in `docs/js/prisma.js`, adopted into this line by the operator decision of 2026-08-21.

### ADR-028 Explicit reviewer roles, inline storage, independent capture, and method gates (revises ADR-020/021/026/027)

Context. A real browser walkthrough with representative corpus papers exposed six operational failures. Both colleagues could silently land in `reviewer1.json`; storage errors and the exact write target were too distant from the save action; the data side panel overloaded a daily workflow with backup and administration; earlier expert and model assessments appeared before the independent judgement; category evidence and Include analysis remained incomplete without blocking save; and corpus search results did not identify papers precisely enough when one query matched several records.

Decision. The application requires an explicit neutral role, `reviewer1` or `reviewer2`, before any save and writes one deterministic file per role. A permanent inline storage bar shows the exact target, working folder, and save result. Backup and administration use collapsed inline details; the former data overlay is removed. Git authorship remains provenance, while commit text and Git actions stay entirely in GitHub Desktop. Earlier expert and model assessments remain hidden until the reviewer has saved an independent decision; a collapsed comparison section exposes them afterward. Every category recorded at level `teilweise` or `ja` requires a human evidence pin. An Include decision requires complete, consistent analysis coding; `AN_Coding_Basis` derives from `text_source`, and Fulltext requires `AN_Harm_Types`. Search ranks exact titles first and shows match type, full title, author/year, DOI, and paper id. A `paper` query parameter opens a known paper directly without selecting a reviewer or changing data. The paper header is compact, the DOI resolves as a hyperlink, and the distinct reading surface labels the generated reference layer `Wissensdestillat`.

Rationale. The reviewer file is part of the method record, so its owner must be explicit at the moment of capture. A visible save target and save result make the local-file workflow inspectable. Independent capture limits anchoring by earlier judgements. Evidence and analysis gates turn methodological completeness into a property of the stored record. Precise search identity and stable direct links make acceptance review reproducible.

Effect. Implemented in the static PRISM frontend with reviewer-schema 0.3 unchanged. The PRISMA record remains the only dialog. The browser pilot exercises both reviewer roles, foreign-file import, direct links, search identity, evidence and analysis gates, persistence, export/import, and deterministic reconciliation. Acceptance records live under `tests/review-cases/`; production reviewer files remain untouched. The native folder permission and physical write-error path remain on `tests/manual-checklist.md`.

### ADR-029 One-time editor setup, one save action, and read-only acceptance cases (revises ADR-028)

Context. The inline storage bar of ADR-028 still exposed setup, backup, import, project administration, and report concepts beside the screening task. Browser review showed that editors need two durable settings and one repeated action. It also showed that operator review cases need direct links without importing test judgements into an editable reviewer track. Mixed-case reviewer keys introduce a separate Windows risk because `CP.json` and `cp.json` address the same file on a case-insensitive filesystem.

Decision. Editors enter a short personal key and select the repository folder once. The key is canonicalised to lowercase and fixes `docs/data/screening/<key>.json`. After connection, the setup becomes a compact target, folder, and write status. The only primary storage action is a disk icon beside the paper position. Backup, import, project administration, reconciliation, and report triggers leave the editor surface; their pure functions remain available to tests and operator scripts. The result rule and evidence instructions move into accessible info popovers. The generated reading layer is named `LLM-Wissensdestillat`. Source URLs move into compact metadata links, and repeated URL-only lines leave the paper body. A `review` query loads a committed test fixture as a read-only acceptance view, limits navigation to its cases, and never writes browser or research data.

Rationale. The daily task is reading, evidence capture, assessment, and saving. Persistent administration controls compete with the full text and create false choices. One visible save action gives file persistence a stable location. Lowercase keys remove a real cross-platform filename collision. A read-only acceptance view makes proposed annotations inspectable while preserving the boundary between test judgements and production reviewer files.

Effect. The desktop reading column receives at least twice the width of the compact assessment rail at the supported wide viewport. Browser tests exercise reviewer setup, the disabled pre-connection save, UI-driven evidence correction, UI-driven analysis coding, physical file content, serial rapid saves, recovery after a failed write, explicit write-error feedback, and read-only acceptance navigation. Pure data-contract tests retain import, export, decision-log, and reconciliation coverage. The full-text builder stages assets and manifest together and restores the previous build after a generation failure. Native permission persistence remains on `tests/manual-checklist.md`; malformed existing reviewer files are now an automated fail-closed regression.

### ADR-030 Agent tracks as preconfigured, authentically exported PRISM runs; Beleg source and actor separated (revises ADR-015/016/027/029)

Current relation. ADR-036 retains the actor and source-provenance model while replacing visible PRISM trial transcription with deterministic projection through PRISM's production functions for new Codex runs. The visible exports described here remain the executed method of the initial governed pilot.

Context. The three-persona pilot showed that an agent persona alone defines no reproducible run. Instances needed a fixed key, an exact local URL, a Paper assignment, methodological sources and separate target paths. The trial mode could hold decisions only in the browser, and its JSON files had to be reconstructed afterwards. In addition `origin` denoted both the text layer and, supposedly, the acting human. Paper passages pinned by agents therefore appeared as `Mensch`. Setting a Paper Beleg automatically to level `ja` mixed the finding of evidence with the scholarly judgement of centrality.

Decision. An agent run receives an immutable manifest with run ID, repository, prompt version, rule sources, publication-type rule, fixed reviewer key, exact URL, Paper list and target paths. In the isolated trial mode PRISM accepts `actor=agent` and `reviewer=<key>` from the URL. The visible function `Testdaten exportieren` produces the authentic reviewer file. Payload and record additively carry `actor`, and every new Beleg carries `source_layer` and `actor`. The existing `origin` is kept for old files and is read only as a compatibility mapping of the text layer. The UI labels Belege by their source as `Paper` or `LLM`. A Paper Beleg sets an empty category to level `teilweise`, and level `ja` requires an explicit judgement. The LLM-Wissensdestillat still satisfies no Paper-evidence gate. Earlier references are not rendered in agent mode. In human sessions the closed comparison loads its contents only when it is opened explicitly. The shared run manifest is read-only for agents, and every instance writes only its own export and report.

Rationale. Key and URL are run identity and therefore belong in the concrete assignment. Separating persona and run parameters allows the same reviewed system prompt for several independent instances. Separate actor and source provenance answers two different questions, who coded and on which text layer the Beleg rests. An explicit centrality decision prevents an operating action from anticipating the Include threshold. Separate track paths avoid competing agent write access.

Effect. `prompts/prism-agent-reviewer.md` v1.0 defines the project-specific PRISM protocol, the ratified system prompt, all run parameters and a compact report schema. The operative rules correspond to v0.4 as tested in the ten-paper run, and version 1.0 fixes their ratified governance status and the publication-type rule as canonical default. `tests/review-cases/agent-runs/` contains the manifest convention. The browser pilot checks the preconfigured agent URL, actor provenance, reference blindness and the downloaded JSON track. During a trial run productive research data stay unchanged. An explicitly released technical takeover unites only authentic exports, keeps their provenance and stays separate from scholarly ratification. The first technically accepted track was stored as `docs/data/screening/ar2.json` with `status: provisional_technical_acceptance`. The run also led to four UI corrections: a visible Paper ID beside the DOI, identity searches without transfer into the full-text search, immediate update of the corpus status after complete analysis, and unambiguous save hints.

Implementation addendum 2026-08-23. Milestone 1 used two operationally isolated tracks with ten identical Paper IDs each. Both coding packets were exported through separate PRISM trial sessions and transcription-checked against 20 records and 115 input Belege. A separate source-grounded AI Agent Review checked categories, analysis fields and Belege. Schema 0.5 projects this result as `ai-agent-reviewed` and preserves the exact 0.3 version and both raw tracks. Domain-expert verification and publication approval are outstanding for all ten records.

### ADR-031 Recovery-safe repository persistence and one-write completeness (extends ADR-029/030)

Context. The closing audit found three data risks. Trial and production mode shared the same browser state. An older file state could displace newer browser data after a failed write. Queued writes used the folder handle that could be changed later. In addition the Include flow of that time first wrote the screening record and added analysis fields in further writes.

Decision. Trial mode and production receive separate `localStorage` namespaces. On connecting, file and browser records are merged per Paper by their record timestamps. Newer records and records present only locally are kept, while a conflict without comparable timestamps and every unreadable reviewer file block further writes. Every queued write binds the handle, the reviewer key and the serialised state at the time of queueing. An Include shows the analysis fields already in the working record and permits the single disk action only when screening and analysis are complete together. The LLM-Wissensdestillat becomes available only after the reviewer's own saved decision, and the reading mode returns to the Paper text on every change of Paper.

Rationale. The browser cache is a recovery layer and must not turn a failed physical write into data loss. An immutable target binding prevents a queue from writing into a folder selected later. The complete single write makes every saved Include record methodically valid and corresponds to the reduced editor flow.

Effect. The unit and browser checks cover separate trial states, merge rules, fault-tolerant write queues, blocking defective files, complete Includes before saving and the hidden reference layer. The native permission dialogue of the browser remains the only manual persistence test.

### ADR-032 Full-text identity veto before publication (extends ADR-025/027)

Context. The closing audit found two wrong full-text assignments that a mere title similarity had allowed. In one case a text carried the same title but deviating DOI, author and year details. In the other only the file name confirmed the corpus identity, while the document title identified a press release. A wrongly assigned full text would ground screening and Belege on a foreign work.

Decision. The publisher separates headings from the document from hints in the file name. Generic headings are discarded. A file name can confirm a substantial document title with at least two shared content words, but alone it does not count as proof of identity. A deviating primary DOI always blocks. Where the full text carries them, conflicts in first author and year also block a confirmation through the file name. An explicitly rejected file may not be assigned again through the author-year fallback. With remaining ambiguity or a title conflict PRISM delivers the metadata abstract and assigns no full text.

Rationale. A missing full text visibly reduces the text basis, whereas a foreign full text invisibly produces wrong decisions and Belege. In doubt the publisher therefore decides against the assignment and keeps the unresolved cases checkable in the manifest.

Effect. Real-case tests block the known DOI, author and year confusions and the press release. Nine full texts used in the technically accepted agent track stay byte-identical. The build reports unresolved cases as `title_mismatch` or `ambiguous` without delivering a foreign text.

### ADR-033 Canonical frontend schema and reproducible static publication

Context. The ten categories were defined in parallel in Python and several JavaScript files. The delivered pages obtained fonts and runtime libraries from external services. The Companion equated record links with knowledge documents. The data publisher wrote a generation time into the output and used a fixed temporary file name. These couplings made a reproducible check harder and could lead to deviating states on GitHub Pages or with parallel builds.

Decision. `assessment/categories.yaml` remains the canonical source. A deterministic publisher produces `docs/data/category_schema.json`, and PRISM, Companion and Literature Landscape read the same projection. D3 and Font Awesome are delivered locally with licence files. System fonts replace remote fonts. The Knowledge Chat stores the key in the session storage of the tab and points out the transmission of question and research context. `research_vault_v2.json` uses a fingerprint of the canonical sources, stable work identities and explicit coverage states. It is published through a unique temporary file with atomic replacement. The Literature Landscape writes view, filter and selection into the URL. Shared CSS tokens, general interface and Literature Landscape styles lie in separate files.

Rationale. A generated category projection prevents drift in content. Local dependencies make the static publication independent of third-party servers. Work identity and coverage status separate corpus structure from document holdings. Fingerprint and atomic replacement make repeated publications checkable and protect an existing file in case of an error.

Effect. The Python tests check schema drift, byte-identical repetition and rollback. The JavaScript suites read the published schema. A Chromium test checks Literature Landscape, URL restoration, responsive display, keyboard operation and the absence of external runtime requests. The complete PRISM browser pilot stays green.

### ADR-034 Agent-assisted round-2 screening with deferred domain verification

Status. Accepted and implemented on 2026-08-23; execution transfer revised by ADR-036.

Context. Round 1 used a comparative expert-LLM dual track and retains its consolidated expert decisions. The later ten-paper PRISM pilot used two operationally isolated agent tracks, deterministic transcription checks, and a separate source-grounded AI Agent Review. Its earlier technical ratification recorded integration and operator acceptance. No domain expert reviewed those records. The intended completion path assigns the high-volume screening work to Codex agents and schedules domain-expert verification after the full batch has been prepared.

Decision. Round 2 uses two manifest-bound Codex screening agents with separate contexts, identities, browser origins, and output paths. A separately commissioned AI agent checks both tracks against the Paper layer. Accepted records reach `ai-agent-reviewed` in a single corpus. Domain experts later verify every record, and a separate action records publication approval. PRISM embeds run and source provenance plus ordered lifecycle events in the existing record. Round-1 data and its authority remain unchanged. The detailed contract is [[update-protocol#Agent-assisted completion]].

Rationale. The arrangement preserves the completed comparative first round while allowing the expanded corpus to be prepared with the available agent infrastructure. AI Agent Review, domain-expert verification, and publication approval remain distinct transitions. Every later expert correction stays traceable to the original agent record.

Effect. Schema 0.5, the deterministic lifecycle validator, the PRISM verification mode, and the publication gate implement this decision. The ten-paper pilot is projected to `ai-agent-reviewed`; the exact 0.3 integration output and both raw tracks remain archived. No pilot record has domain-expert verification or publication approval. The separate offline 10K track remains outside the round-2 production path unless registered as an additional comparison study.

### ADR-035 Validation, AI Agent Review, domain-expert verification, and publication approval are distinct

Status. Accepted and implemented on 2026-08-23.

Current relation. The later [[governance#Publication boundary]] permits the separately authorised preliminary AI-source-reviewed projection. The effect below records the original publication gate. The whole-record lifecycle remains implemented, while [[governance#Verification scope decision, 22 September 2026]] defines the accepted field-level scope and its outstanding implementation.

Context. The terms `validated`, `verified`, and Machine Review had carried overlapping meanings. A deterministic schema can establish formal conformance, an AI agent can assess source support, and a domain expert can judge scholarly correctness. Collapsing these operations into one status would overstate the authority of technical and AI-based checks and would make later expert corrections difficult to reconstruct.

Decision. Deterministic scripts and schemas write artifact-local `checks`; they do not advance the lifecycle. Source-grounded assessment by an AI actor is named AI Agent Review and can establish `ai-agent-reviewed`. Domain experts record `accepted`, `corrected_and_accepted`, `changes_requested`, or `rejected`. The first two establish `verified`. A correction appends a complete annotation version with a field-level diff, reason, person, timestamp, and `supersedes`; the original agent annotation remains immutable. Publication approval is a separate person-attributed transition from `verified` to `publication-approved`.

Rationale. Each term now names the actor, operation, and authority it can establish. Persisted checks identify the exact annotation they tested by ID and hash. Artifact-local status prevents verification of a screening record from silently propagating to a derived Assertion, report section, or paper claim.

Effect. `docs/data/screening_lifecycle_contract.json` is the canonical lifecycle vocabulary. Schema 0.5 stores `annotations`, `active_annotation_id`, `checks`, provenance, and lifecycle events in each decision record. PRISM exposes the four expert outcomes and preserves corrections as new versions. The public publisher accepts only records with an accepted domain-expert verification followed by publication approval.

### ADR-036 Deterministic PRISM transfer for Codex agent tracks (revises ADR-030/034)

Status. Accepted and implemented on 2026-08-23.

Current relation. ADR-037 advances new reviewer tracks to schema 0.4 and new run manifests to schema 1.3 so the deterministic transfer carries exact Work-Version identity. Schema 0.3 tracks and run schema 1.2 remain the historical form of the runs governed here.

Context. ADR-030 required Codex reviewers to enter every annotation through visible PRISM trial sessions. The five-work run showed that the source review and the UI transcription are separable operations. Both reviewer agents produced complete source-grounded coding packets, while the in-app browser failed before page initialization. The committed harness could still execute PRISM's production validation, import, record-requirement, and serialization functions over the unchanged packets. Repeating the same values manually in a browser adds a transcription step and makes corpus completion depend on browser-session availability.

Decision. New Codex runs store each operationally isolated source review as a validated `femprompt-prisma-coding-packet/0.1`. The orchestrator projects the packet mechanically and passes it through `validateReviewerPayload`, `importReviewerPayload`, `recordRequirements`, and `reviewerFileText`. The resulting schema-0.3 tracks remain immutable inputs to the separate source-grounded AI Agent Review. Run schema 1.2 binds packets, reports, sources, prompts, models, generated tracks, and review outputs with hashes. The visible PRISM interface remains the surface for domain-expert verification, corrections, and browser acceptance tests.

Rationale. The packet is the direct product of source interpretation. Deterministic transfer preserves its exact values, exercises the production data contract, and removes an avoidable transcription dependency. Operational isolation continues through separate contexts and output paths. The method makes no epistemic independence claim. AI Agent Review, domain-expert verification, and publication approval retain their existing authority boundaries.

Effect. `prompts/prism-agent-reviewer-v1.1.md`, the PRISM agent-review skill, the run template, and the executable run validator require the new path. The run `uncovered-sources-5-20260823` records its original browser failure and the subsequent operator acceptance of the deterministic method. Its annotations and lifecycle states remain unchanged. Visible trial exports from the earlier ten-paper pilot remain valid historical artefacts.

### ADR-037 Stable Work identity and exact publication Version provenance

Status. Accepted and implemented on 2026-08-24.

Context. A DOI or Zotero record can identify only one publication expression of a scholarly work. The same work may exist as a Preprint, Accepted Manuscript, proof, Version of Record, or corrected Version of Record. Earlier stable identifiers grouped records sufficiently for frontend coverage, but they could conflate the scholarly Work with the particular text used as evidence. Publication stage also carried no reliable implication about peer review.

Decision. `corpus/work_version_registry.json` is the canonical bibliographic identity layer. Every scholarly Work receives a stable `work_id`; every known expression receives a stable `version_id` and controlled `version_type`. Publication stage, peer-review status and basis, integrity status, access, identifiers, relations, and provenance remain separate fields. `preferred_version_id` selects the normally screened expression by the documented stage rule, while `latest_version_id` records chronology. Screening coverage applies once per Work. Full-text manifests, new PRISM records, agent assignments, evidence, distillates, Assertions, and public projections bind to the exact Version used. Ambiguous identity or a mismatch between assignment and source blocks productive processing.

Rationale. The distinction prevents double screening while preserving the evidence actually read. It also supports claims about publication status without treating an Accepted Manuscript or Version of Record as automatic proof of peer review. Separate preferred and latest fields accommodate corrected, retracted, embargoed, or chronologically newer expressions.

Effect. `docs/data/work_version_contract.json` defines the vocabulary and selection rules. The registry builder reconciles the Zotero corpus and round-two intake, retains duplicate records as addressable mappings, and writes explicit conflicts for operator review. Reviewer schema 0.4 and run schema 1.3 add exact Work-Version bindings. Historical reviewer and run schemas remain readable. PRISM displays publication stage, peer-review metadata, Work ID, Version ID, and known Versions. The Grounded Vault validator requires exact Version provenance on active distillates.
