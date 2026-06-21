---
title: Design
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: active
language: en
version: "0.1"
created: 2026-06-09
updated: 2026-06-21
authors: [Christopher Pollin]
generated-with: Claude Code (Claude Opus 4.8)
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
template:
  name: Vorlage Design
  version: 0.1
  url: https://dhcraft.org/Promptotyping/promptotyping-document/design
  alias: https://dhcraft.org/Promptotyping/#promptotyping-document-design
topics: ["[[Information Visualisation]]", "[[Scholar-Centered Design]]"]
related: [specification, user-stories, data, ai-assisted-review-standards, prisma-methodology]
---

This is the self-contained UI/design working document for the PRISMA screening tool, a standalone page (`docs/prisma.html`, ADR-008) linked from the Evidence Companion. It is written so that UI and design work can proceed **from this document alone**: it consolidates the PRISMA essentials that drive the interface (section 1-2), the people and scenarios it serves (3-4), each screen specified with layout, components, data, states, interactions and an ASCII wireframe (5), the design system to inherit (6), the epistemic design principles specific to this tool (7), the concrete tokens (8), and the open design questions left for the design work (9). Full domain detail lives in [[prisma-methodology]] and [[ai-assisted-review-standards]]; formal requirements in [[specification]]; the data model in [[data]]; the scenarios in [[user-stories]]. Where this document repeats those, it does so deliberately, because its purpose is hand-off.

> Read section 0 first. It is the current direction and supersedes the AI-forward, seven-surface specifics in sections 1, 4 to 7. Those sections are kept as background on the standards and the reasoning, not as the build target.

> **v5 update (2026-06-21, [[specification]] ADR-014).** Three changes layer onto the v4 direction below. (1) **Synthesis over comparison.** The human-AI comparison surface (matrix, kappa, divergence filter, reviewer reconciliation) is removed from the tool; human and AI assessment are to be brought together into a synthesis, not scored against each other. The next build is a synthesis surface (level open: per article / corpus-wide / both); each Beleg keeps a provenance tag (AI or human). (2) **No Git surface.** The in-tool `git add/commit/push` hint and Git language are gone; the direct File System Access write stays, versioning is GitHub Desktop outside the tool. (3) **Unified design.** The tool page now wears the Companion design (white background, rainbow accent bar, shared header, navigation, and footer); the navigation is identical on all five pages. Section 7 principle 1 ("AI and human, never merged") is reversed by this direction and reads as historical. Where section 0 below still says "agreement metrics computed here" or "Git", read it through this banner.

## 0. Redesign v4 (current direction)

Decided with the user on 2026-06-09 (see [[specification]] ADR-012). The v3 design port revealed the tool was over-built for its actual user: it foregrounded the human-AI divergence study (blind reveal, kappa, matrix, reconciliation), which is really the content of the paper and the Evidence Companion. The person using this tool is the expert in the loop who wants to work through literature fast, the way the reviewing colleagues did: read and search the document, and ground each category in concrete words found in it.

Three principles:

1. **Evidence-grounded screening is the core.** The screening view is built around the served knowledge document (`paper.knowledge_doc`, the distilled per-paper summary under `docs/vault/Papers/*.md`, not raw full text; see [[data]]), an in-text and corpus-wide search, and pinning a search hit as a Beleg on a category. A category is not a bare checkbox, it carries the words that justify it. This is reproducible and matches the colleagues' method.
2. **AI is strongly reduced.** The AI proposal becomes an optional, collapsed suggestion, off by default. No blind reveal, no kappa, no matrix in the working view. The comparison machinery is kept but moves to the report layer, computed quietly for PRISMA-trAIce R1/R2.
3. **Seven surfaces collapse to three**, each with a one-line "what is this, what do I do here" header:
   - **Screening**: corpus overview with full-text search; single-paper full-text view with in-text search, evidence pinning, derived decision, optional collapsed AI.
   - **PRISMA & Report**: flow diagram + checklist + disclosure in one place, generated from the screening (ADR-014 removed the agreement-metrics section; the figures feed only the disclosure line).
   - **Daten & Repo**: File System Access connect (write into the project folder), per-reviewer files, export/import (ADR-014 removed the in-tool Git workflow and the Reviewers reconciliation).

```
SCREENING  ┌ corpus list + full-text search ┐  ┌ full text (formatted, searchable) ┐  ┌ categories + evidence ┐
           │ filter: status / category      │  │ <mark>gender</mark> ... hits 3/7   │  │ Gender  ✓             │
           │ search all texts: "gender"      │  │ "...gendered scripts of care..."   │  │  └ pin: "gendered..."  │
           │ [paper 13/87]                   │  │ [next hit ↵]  [pin as evidence]    │  │ derived: INCLUDE       │
           └─────────────────────────────────┘  └────────────────────────────────────┘  └───────────────────────┘
PRISMA & REPORT   flow diagram · checklist · disclosure (auto)        DATEN & REPO   connect · reviewer file · export
```

The evidence data model is in [[data]] (reviewer file schema 0.2, `evidence[category] = [{term, snippet, ts}]`). The new requirements are FR-11 (read full text), FR-12 (search), FR-13 (pin evidence) in [[specification]].

## 1. What the tool is, in one paragraph

A prospective, PRISMA-conformant **screening instrument** built into the existing Evidence Companion single-page app as a fifth view next to Knowledge Chat, Knowledge Graph, Categories, and Corpus. Domain experts screen papers against ten binary categories to an include/exclude decision; an AI proposal for the same paper is recorded **separately** and never overrides the human; a live PRISMA 2020 flow diagram shows the selection process with the AI and human decisions split apart; an agreement panel quantifies the divergence; a checklist tracks reporting completeness; a generator emits the AI-disclosure text and the assembled PRISMA record. It is a static web app (vanilla JS, CDN libraries, no backend); sessions live in localStorage and travel as JSON.

## 2. PRISMA essentials that drive the UI

Everything below is the design-relevant distillation. PRISMA is a **reporting** standard (make the selection process transparent and auditable), not a conduct standard, so the UI's job is to *show* the process honestly, not to automate judgement.

- **Flow diagram (PRISMA 2020).** Three phases: Identification -> Screening -> Included. The 2009 standalone "Eligibility" box is gone; do not draw it. Each phase carries counts; exclusions carry reasons.
- **The signature requirement (PRISMA-trAIce R1).** At every screening stage where AI was used, the flow diagram and text must **distinguish records included/excluded by the AI tool from those decided by human reviewers**, and report how many records the AI processed and with what outcome. This AI-vs-human split is the single most important visual in the whole tool. The adapted diagram adds *separate fields* for AI-excluded and human-excluded records and also separates rule-based admin tools (deduplication) from evaluative AI.
- **Governance (RAISE).** Three principles the UI must embody: the human is accountable and their decision is binding; AI is used with human oversight; any AI that makes or suggests a judgement is fully disclosed. Design consequence: the binding human decision is always visually primary; the AI proposal is visibly advisory and secondary; provenance (model, version, prompt) is shown, not hidden.
- **Disclosure (PRISMA-trAIce M2/M3/M6/M8/M9 + RAISE Table 1).** The tool emits a text block: tool name/version/date, stage, task, prompt version, decoding parameters, confidence threshold, validation metrics (kappa), limitations, conflicts of interest. This is a generated-text surface with copy/export.
- **Checklists.** PRISMA 2020 (27 items) and PRISMA-trAIce (14 items, T1/A1/I1/M1-M10/R1-R2/D1-D2, each with a priority level mandatory/recommended/optional). A trackable list with per-item status and notes; some items auto-satisfy from session data (e.g. R1 once the split diagram has counts).
- **The empirical heart.** This project's finding is a large, asymmetric human-AI divergence (LLM include rate 71.5% vs expert 46.0%; matrix 100/34/108/49; decision kappa 0.056; category kappas 0.39-0.82, Gender lowest, Soziale_Arbeit highest). The UI must treat this divergence as **the product, not an error**: it is only visible because AI and human decisions are recorded separately, which is exactly what R1 asks for. Design for divergence as a first-class, explorable state.

## 3. Personas

| Persona | Who | Primary need | Mode |
|---|---|---|---|
| Reviewing expert | Sackl-Sharif, Klinger | Screen each paper fast, independently, consistently | Keyboard-first, one paper at a time |
| Review lead | Sackl-Sharif (lead) | Oversee the selection, see the flow + metrics, produce the report | Dashboard / read + export |
| Technical lead | Pollin | Import batches, configure, generate disclosure, run the update | Data I/O + config |
| External reviewer / auditor | Journal referee, FFG reviewer | Verify the AI use was reported responsibly | Read-only, checklist + flow |

## 4. User stories, UI-oriented

The twelve stories from [[user-stories]], grouped by intent, each tagged with the screen it touches.

Core screening operations
- Screen a paper without being anchored by the AI -> Screening Workspace (blind mode).
- See where I diverge from the AI -> Screening Workspace (post-decision reveal) + Agreement Panel.
- Record an exclusion with a reason -> Screening Workspace (reason picker).
- Watch the PRISMA picture build live -> Flow Diagram.
- Run a literature update on a fresh batch -> Data I/O (import) -> Screening Workspace.

Scholarly assurance
- Generate a PRISMA-conformant record -> Disclosure / Report Generator (+ Flow + Checklist).
- Produce the AI-disclosure text automatically -> Disclosure Generator.
- Verify the review is PRISMA-trAIce-conformant -> Checklist Tracker + Flow Diagram.
- Share a session with a colleague -> Data I/O (export/import).

Conceptual orientation
- Look up what a category means -> Screening Workspace (category definition on demand).
- Understand a checklist item -> Checklist Tracker (verbatim item + level).

## 5. Screens (v4, as built)

This section specifies the three v4 surfaces as implemented in `docs/js/prisma.js` and `docs/css/prisma.css` (commit c909e50). It replaces the v3 seven-surface design. The subsections 5.0a to 5.6 below it are kept as v3 background only (they describe the superseded AI-forward layout and the blind/reveal rail).

### 5A. Page shell

Standalone page `docs/prisma.html` (ADR-008). Since ADR-014 the page wears the Companion design: the shared header (title, subtitle, authors, the rainbow accent bar) and the navigation that is identical on all five pages, plus the shared footer; the repo-connection status (`#pt-conn-status`) sits in a thin connection bar. `js/prisma-data.js` provides the `window.EC` shim over `research_vault_v2.json`. Below the header, a sub-navigation with exactly three buttons, each followed by a one-line "what do I do here" intro:

- **Screening** -- Volltext lesen und durchsuchen, Belege an Kategorien anheften, Include/Exclude entscheiden.
- **PRISMA & Report** -- PRISMA-2020-Fluss, Checkliste und Disclosure, aus dem Screening erzeugt.
- **Daten & Repo** -- Mit dem Projektordner verbinden, eine Datei pro Reviewer:in, Export/Import.

There is no blind-mode toggle (removed in v4) and no comparison surface (removed by ADR-014). A persisted v3 surface id is normalised onto these three on load.

### 5B. Screening (default surface)

Purpose. The per-paper working surface. Optimised for reading the document, finding the words that carry a category, and pinning them as evidence. Three panes in one grid (`--pt-nav-w | 1fr | --pt-rail-w`).

Layout and data.
- **Left, corpus navigator.** A full-text search box over the whole corpus (FR-12 corpus search, backed by `docs/data/fulltext_index.json`) plus the paper list with status dots (none / include / exclude) and a hit-count badge when a corpus query is active. Selecting a paper opens it; if a corpus query is active, that term is carried into the in-text search of the opened paper.
- **Centre, reading column.** Title and authors, then a sticky in-text search bar (highlight all matches, step previous/next, hit counter, "Treffer anheften"), then the rendered document. The document is `paper.knowledge_doc` fetched on demand and rendered by the built-in minimal Markdown renderer (FR-11). Papers without a `knowledge_doc` fall back to the abstract; papers with neither show an empty state. A `nur Abstract` pill marks the fallback.
- **Right, assessment.** The ten category chips in two dimension groups (definitions on hover), the pinned Belege grouped by category (each a snippet with a remove control), the derived `(>=1 Technik) UND (>=1 Sozial)` decision with the override-to-exclude switch, the exclusion-reason picker when the decision is Exclude, the binding "Entscheidung erfassen" action, and an optional collapsed AI suggestion (`KI-Vorschlag (advisory)`, off by default).

Evidence pinning (FR-13). Selecting a passage in the reading column, or pressing "Treffer anheften" on the active in-text hit, opens a small category menu. Choosing a category stores `{term, snippet, ts}` under `evidence[category]` and sets that category on (pinning a Beleg implies the category). Belege are removable before the decision is recorded. The behaviour contract is in [[data]] (reviewer schema 0.2).

States. editing (no record yet, chips and pins live, derived decision updates), excluded (reason picker required), recorded (read-only summary with the recorded categories, decision, reason, and Belege, plus revise and next-open).

```
SCREENING  ┌ Korpus + Volltext-Suche ┐  ┌ Titel · In-Text-Suche · Dokument ┐  ┌ Kategorien · Belege ┐
           │ [Suche: "gender"] 184    │  │ ...gendered <mark>scripts</mark>  │  │ Technik  Sozial      │
           │ ● Paper A      3×         │  │  of care...   [‹ 3/7 ›][anheften] │  │  Gender ✓            │
           │ ○ Paper B                 │  │  Text markieren → Beleg anheften  │  │   └ "gendered..."  ✕ │
           │ ● Paper C      1×         │  │                                   │  │ abgeleitet: INCLUDE  │
           └───────────────────────────┘  └───────────────────────────────────┘  │ [Entscheidung] ↵     │
                                                                                   │ ▸ KI-Vorschlag (adv) │
                                                                                   └──────────────────────┘
```

### 5C. PRISMA & Report

Purpose. The outputs, computed from the screening, not part of the working loop. One scroll with a perspective selector (whose decisions count as the human side) and three sections (ADR-014 removed the agreement-matrix section): the PRISMA 2020 flow with the trAIce R1 AI-vs-human split, the PRISMA-trAIce checklist (14 items, auto-satisfied where the setup already meets them), and the AI-disclosure generator (Markdown preview, copy, export). The disclosure text still reports the kappa and matrix figures (trAIce M9), computed from the functions that survive without a surface; the divergence itself is research material for the paper and Companion, not the screening work.

### 5D. Daten & Repo

Purpose. Sync. Reviewer identity (the `<kuerzel>.json` filename), the File System Access connect/reconnect/reload that writes each reviewer file directly into the project folder, export/import as the all-browser fallback, and the decision-log CSV. ADR-014 removed the in-tool Git workflow (the copy-paste `git add/commit/push` hint is gone; versioning is GitHub Desktop outside the tool) and the reviewer reconciliation table (part of the removed human-AI comparison).

---

The remainder of this section (5.0a to 5.6) is **v3 background**, retained for the standards reasoning. It describes the superseded seven-surface, AI-forward, blind/reveal layout; the build target is 5A to 5D above.

### 5.0a Page shell and navigation (v3, superseded)

The view has one shell and six functional surfaces. Within the SPA the PRISMA view can present these as a left sub-nav or tabs (Workspace, Flow, Agreement, Checklist, Report, Data); the Workspace is the default landing surface.

### 5.0 Page shell and navigation

Implemented as a standalone fullscreen page `docs/prisma.html` (the companion's PRISMA nav links to it), not an embedded view (see ADR-008). A small data layer (`js/prisma-data.js`) provides a `window.EC` shim over `research_vault_v2.json`, so `js/prisma.js` runs without the full companion app. A slim app header carries the repo-connection status. The sub-navigation switches among **seven** surfaces: Workspace, Flow, Agreement, **Reviewers** (the multi-reviewer reconciliation added for the Git workflow), Checklist, Report, and Daten & Repo (reviewer identity, File System Access connect, export/import).

```
HEADER  Wissens-Chat | Wissensnetz | Kategorien | Korpus | [PRISMA] | About Methoden Hilfe
        ────────────────────────────────────────────────────────────────────────────────
PRISMA  ▸ Workspace   ▸ Flow   ▸ Agreement   ▸ Checklist   ▸ Report   ▸ Data
        [ active surface renders here ]
```

### 5.1 Screening Workspace (default surface)

Purpose. The per-paper triage where an expert reads a study and records the binding decision. The most-used screen; optimise for speed and for the anti-anchoring (blind) affordance.

Layout. Two columns: left = the paper (metadata, abstract, optional Knowledge Document tab); right = the decision (ten category toggles in two dimension groups, the auto-derived include/exclude, an exclusion-reason picker, save-and-next). The AI proposal area is **hidden in blind mode until the decision is saved**, then it reveals below with the divergence flagged.

Data. One `ScreeningRecord` (see [[data]]): metadata, abstract, optional knowledge_doc, optional ai_decision.

States. (a) blind, pre-decision: AI hidden; (b) decided: AI revealed, divergence computed; (c) blind off (e.g. reviewing the seed): AI shown alongside from the start; (d) excluded: reason picker required.

Interactions. Toggle categories (click or number keys), include/exclude derives from the rule (>=1 technology AND >=1 social) and can be overridden, pick a reason on exclude, Save & Next (Enter). Category label -> definition popover.

```
┌ PRISMA · Workspace ───────────────  Blind ●  Reviewer CP  ·  13/87 screened ┐
│                                                                             │
│ PAPER 13 / 87                              │  YOUR DECISION  (binding)       │
│ Data Feminism for AI                       │                                 │
│ D'Ignazio & Klein · 2024                   │  Technology                     │
│ Source: Claude (Deep Research)             │  [AI-Lit] [GenKI ✓] [Prompt]    │
│ ─────────────────────────────────────────  │  [KI-Sonst]                     │
│ Abstract                                   │  Social                         │
│ Lorem ipsum dolor sit amet, consectetur…   │  [SozArb] [Bias] [Gender]       │
│ … adipiscing elit, sed do eiusmod tempor.  │  [Divers] [Femin ✓] [Fair]      │
│ [ Knowledge Document ▸ ]                    │  ───────────────────────────    │
│                                            │  Derived: ● INCLUDE             │
│                                            │  [  Include  ] [  Exclude  ]    │
│                                            │  reason ▼ (only if Exclude)     │
│                                            │  [  Save & Next   ↵  ]          │
│ ─ after Save (AI reveal) ────────────────────────────────────────────────   │
│  AI · Haiku 4.5 · prompt v2.1 · conf 0.82   →  INCLUDE                        │
│  ⚠ Divergence (category): AI Gender = No · you Gender = Yes                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 PRISMA Flow Diagram (the signature surface)

Purpose. Render the PRISMA 2020 flow with the PRISMA-trAIce R1 AI-vs-human split. This is the artefact that goes into the paper.

Layout. Vertical PRISMA flow (Identification -> Screening -> Included). The Screening box is split into two parallel lanes, AI and Human, each with its exclusion-reason breakdown. Included shows both the binding human count and the advisory AI count. SVG export button.

Data. The `FlowModel` aggregation (see [[data]]).

States. live (updates as decisions accrue), final (locked for export), empty (no decisions yet -> show the structure with zeros).

Interactions. Hover a box for exact counts; click an exclusion reason to filter the Workspace to those papers; export SVG.

```
                       IDENTIFICATION
        ┌────────────────────────────────────────┐
        │ Records identified  n = 326             │
        │  Deep Research 254 · Manual 50 · Zotero 22│
        └───────────────────┬────────────────────┘
                            │  duplicates removed: 0
                       SCREENING  (n = 291)
        ┌─────────────────────────┬──────────────────────────┐
        │  AI tool (evaluative)    │  Human reviewers          │
        │  excluded 83             │  excluded 157             │
        │   · Not relevant   60    │   · Not relevant   120    │
        │   · Wrong type     14    │   · Wrong type      22    │
        │   · …               9    │   · …               15    │
        └─────────────────────────┴──────────────────────────┘
                            │
                        INCLUDED
        ┌────────────────────────────────────────┐
        │  Human (binding)   134                  │
        │  AI (advisory)     208                  │
        └────────────────────────────────────────┘
   [ Export SVG ]      AI vs Human matrix → see Agreement
```

### 5.3 Agreement Panel

Purpose. Make the divergence measurable in place; this is the PRISMA-trAIce M9/R2 performance evaluation against a human reference standard.

Layout. A 2x2 confusion matrix (Human x AI), the decision kappa with its label, base-rate comparison, and a per-category kappa bar list.

Data. Paired human/AI decisions across the session.

Interactions. Click a matrix cell -> filter Workspace to those papers; click a category bar -> filter to that category's divergences.

```
┌ PRISMA · Agreement ─────────────────────────────────────────────┐
│  CONFUSION MATRIX                κ(decision) 0.056  "slight"      │
│               AI Incl   AI Excl                                   │
│  Human Incl     100        34     Human include rate  46.0 %      │
│  Human Excl     108        49     AI    include rate  71.5 %      │
│  (click a cell to filter the workspace)                          │
│ ─────────────────────────────────────────────────────────────    │
│  Per-category κ                                                   │
│  Soziale_Arbeit ████████░░ .82     Gender        ████░░░░░░ .41   │
│  Feministisch   ███████░░░ .75     Fairness      ███░░░░░░░ .39   │
│  …                                                               │
└──────────────────────────────────────────────────────────────────┘
```

### 5.4 Checklist Tracker

Purpose. Track reporting completeness against PRISMA 2020 (27) and PRISMA-trAIce (14).

Layout. Two tabs (PRISMA 2020 / PRISMA-trAIce). Each item: id, verbatim text, priority level (for trAIce), status toggle (open / satisfied / n.a.), a note field, and an auto-hint where the session data already satisfies it.

Data. A per-item status/notes store plus derived hints.

Interactions. Toggle status, add a note, expand an item to read its verbatim text; export the filled checklist.

```
┌ PRISMA · Checklist ──────  [PRISMA 2020]  [PRISMA-trAIce] ───────┐
│  M8  Human-AI interaction and oversight        ● satisfied  (auto)│
│      "…how many reviewers validated AI outputs; what proportion   │
│       were manually verified…"  mandatory                         │
│      note: 100% dual screening, expert binding                    │
│  M9  AI performance evaluation                 ● satisfied        │
│      "…reference standard (consensus human decisions); metrics…"  │
│  R1  Study selection (AI-assisted)             ● satisfied  (auto)│
│      "…distinguish records excluded by AI vs human…"  mandatory   │
│  M1  Protocol pre-registration                 ○ open             │
│      "…state if AI use was pre-specified in a protocol…"          │
│  [ Export checklist ]                                             │
└──────────────────────────────────────────────────────────────────┘
```

### 5.5 Disclosure / Report Generator

Purpose. Emit the AI-disclosure text and bundle the PRISMA record.

Layout. A form/preview split: left = the disclosure fields (mostly prefilled from the session), right = the generated Markdown preview. Buttons: copy, export Markdown, bundle (Markdown + SVG flow + decision-log CSV).

Data. `DisclosureMetadata` + flow + agreement results.

Interactions. Edit a field -> preview updates; copy/export/bundle.

```
┌ PRISMA · Report ────────────────────────────────────────────────┐
│  FIELDS                         │  PREVIEW (Markdown)             │
│  Model    Haiku 4.5             │  ## AI use disclosure           │
│  Date     2026-03-15            │  Screening of 291 records used  │
│  Stage    Screening             │  Claude Haiku 4.5 (prompt v2.1, │
│  Prompt   v2.1                  │  temp 0.0). Every record was    │
│  Temp     0.0                   │  also screened independently by │
│  Threshold 0.5                  │  an expert (binding). Agreement:│
│  CoI      none                  │  κ 0.056; matrix 100/34/108/49. │
│  Limitations […]                │  Limitations: …                 │
│  [ Copy ] [ Export .md ] [ Bundle .zip ]                          │
└──────────────────────────────────────────────────────────────────┘
```

### 5.6 Data I/O

Purpose. Get batches in and PRISMA records out without a backend.

Layout. Import (drop JSON/CSV), session controls (autosave indicator, export session JSON, export decision-log CSV, clear), and a "Load seed corpus" entry that loads the existing 326-paper review read-only.

Interactions. Import validates and loads; export downloads; seed loads the case study; localStorage autosaves silently.

```
┌ PRISMA · Data ───────────────────────────────────────────────────┐
│  Import batch   [ drop .json / .csv here ]                         │
│  Session        autosaved ●   [ Export session .json ]            │
│                               [ Export decision log .csv ]        │
│  Case study     [ Load seed corpus (326, read-only) ]            │
└──────────────────────────────────────────────────────────────────┘
```

## 6. Design system to inherit

The view must look and behave like the existing Evidence Companion. Inherit, do not reinvent.

- Typography. IBM Plex Serif for headings, Inter for body (already loaded).
- Structure. `header` with `nav-view-btn` tabs; `main` with `section.content-section.view-content`; `switchView(id)` toggles `.active` + display; per-view `window.initializeX()`; side panel slide-in (480px) for detail; `.modal` for dialogs.
- Code pattern. One IIFE module `docs/js/prisma.js`, `'use strict'`, talking to `window.EC`; expose `window.initializePrisma` and any cross-view hooks. Register the script in `index.html` after the other view scripts.
- Data access. Reuse `window.EC`: `getAllPapers()`, `getKappas()`, `getDivergences()`, `getMeta()`, `CAT_COLORS`, `escapeHtml`, `showPaperDetail`. The seed corpus comes straight from these.
- Libraries already on the page (CDN): D3 7 (flow diagram + any force/graph), Chart.js 4 (matrix, bars), Fuse.js 7 (search), JSZip 3 (the bundle export). No new dependencies.
- CSS. Inherit variables from `research.css`; namespace new variables `pt-*` (project convention); reuse `nav-view-btn`, `content-section`, chips, `filter-select`, modal, the rate-bar pattern from the Categories view.

## 7. Epistemic design principles (specific to this tool)

These are not decoration; each operationalises the project's thesis (reliability as a property of the process) and the standards.

1. AI and human, never merged. Show the two decisions side by side or sequenced; never blend them into one number. (PRISMA-trAIce R1.)
2. Human decision is visually primary. The binding decision is the loud element; the AI proposal is quiet, labelled, secondary. (RAISE accountability.)
3. Divergence is a feature, not an error. Use the divergence marker (ring/colour) as an invitation to explore, not a red warning. The divergence *is* the finding.
4. Blind by default for new screening. Withhold the AI proposal until the human commits; this anti-anchoring affordance is what keeps the dual track independent.
5. Provenance is always visible. Model, version, prompt version, parameters travel with every AI proposal, inline. Reproducibility you can see. (PRISMA-trAIce M2/M6.)
6. Reporting is a by-product, not extra work. The flow, the metrics, the checklist, and the disclosure assemble themselves from the act of screening; the user should never feel they are "doing PRISMA" on the side.

## 8. Concrete tokens (from the existing app)

- Human (expert) = amber `#d4943a`. LLM (AI) = blue `#4b7bab`. (Source: the Categories view rate bars.)
- Concept clusters (for reference): Technik `#3a7d7e`, Bruecke `#7c6fae`, Sozial `#b0546e`.
- Divergence = ring outline (the Knowledge Graph "Divergenz" marker), not a fill.
- Ten-category spectrum: `EC.CAT_COLORS` (rainbow gradient, Gegenstand -> Perspektive order: AI_Literacies, Generative_KI, Prompting, KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit, Gender, Diversitaet, Feministisch, Fairness).
- Decision colours (new, propose): include = a calm green, exclude = a neutral grey (not alarm-red; exclusion is normal, not failure).
- Category dimension grouping: technology {AI_Literacies, Generative_KI, Prompting, KI_Sonstige}; social {Soziale_Arbeit, Bias_Ungleichheit, Gender, Diversitaet, Feministisch, Fairness}.

## 9. Open design questions (for the separate UI/design work)

1. Blind mode default: on for new screening, off for the seed case study, confirm per persona.
2. Flow diagram: D3-rendered (interactive, filterable) vs a static SVG template that is populated, decide on the interactivity budget for a first scaffold.
3. Ten categories in the Workspace: two-row chip grid vs a compact dimension-split list, which reads faster under repetition?
4. Sub-navigation: left rail vs top tabs vs a single scroll with anchored sections.
5. How loud should divergence be at the moment of reveal, a quiet badge or a deliberate pause that asks the expert to look?
6. Mobile/responsive scope: is screening a desktop-only task, or do we support tablet review?
7. Multi-reviewer reconciliation UI: out of scope for the scaffold (file-based per ADR-006), but how is a merge of two sessions surfaced later?

## Was nicht reingehort

This document does not specify the technical architecture (a future `architecture.md`), does not restate the full PRISMA or PRISMA-trAIce text (see [[prisma-methodology]] and [[ai-assisted-review-standards]]), and does not define the data schema (see [[data]]). It is the visual and interaction brief, the bridge from the standards and the stories to a buildable interface.

## Related

- [[specification]]
- [[user-stories]]
- [[data]]
- [[ai-assisted-review-standards]]
- [[prisma-methodology]]

*Updated: 2026-06-21*
