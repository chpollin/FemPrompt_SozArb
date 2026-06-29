---
title: Design
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
template:
  name: Vorlage Design
  version: 0.1
  url: https://dhcraft.org/Promptotyping/promptotyping-document/design
  alias: https://dhcraft.org/Promptotyping/#promptotyping-document-design
status: complete
language: en
version: "0.2"
created: 2026-06-09
updated: 2026-06-29
authors: [Christopher Pollin]
generated-with: Claude Code
topics: ["[[Information Visualisation]]", "[[Scholar-Centered Design]]"]
related: [specification, data, journal]
---

This is the self-contained UI and design working document for the PRISM screening tool, a standalone page (`docs/prisma.html`, ADR-008) linked from the Evidence Companion. UI work proceeds from this document alone; it carries the current direction, the PRISMA essentials that drive the interface, the people it serves, the three surfaces as built, the design system, the epistemic principles, the tokens, the genesis of the design, and the open questions. Full standards detail lives in [[standards]], the formal requirements in [[specification]], the data model in [[data]].

## 1. Current direction

The tool is centred on evidence-grounded screening (ADR-012) and brings human and AI assessment together into a synthesis rather than scoring them against each other (ADR-014). Earlier iterations foregrounded the human-AI divergence study (blind reveal, kappa, matrix, reconciliation), which is the content of the paper and the Evidence Companion, not the work of the expert who wants to read literature fast. Three principles carry the current build.

1. Evidence-grounded screening is the core. The screening view is built around the served knowledge document (`paper.knowledge_doc`, the distilled per-paper summary under `docs/vault/Papers/*.md`, not raw full text, see [[data]]), an in-text and corpus-wide search, and pinning a search hit as a Beleg on a category. A category is not a bare checkbox, it carries the words that justify it, which is reproducible and matches the reviewing colleagues' method.
2. AI is advisory and reduced. The AI proposal is an optional, collapsed suggestion, off by default; there is no blind reveal and no in-tool kappa or matrix. Each Beleg keeps a provenance tag, human or AI (ADR-015); the machine-extracted Kategorie-Evidenz from the knowledge document enters as a clearly labelled AI provenance class that is shown and advisory but never sets a category, so machine text cannot flip the binding human decision (ADR-016, ADR-018).
3. Three surfaces, one Companion design. The seven v3 surfaces collapse to Screening, PRISMA & Report, and Daten & Repo, each with a one-line "what do I do here" header. The page wears the Companion design (white background, the rainbow accent bar, the shared header, navigation, and footer); versioning happens in GitHub Desktop, there is no in-tool Git surface.

```
SCREENING  ┌ corpus list + full-text search ┐  ┌ full text (formatted, searchable) ┐  ┌ categories + evidence ┐
           │ filter: status / category      │  │ <mark>gender</mark> ... hits 3/7   │  │ Gender  ✓             │
           │ search all texts: "gender"      │  │ "...gendered scripts of care..."   │  │  └ pin: "gendered..."  │
           │ [paper 13/87]                   │  │ [next hit ↵]  [pin as evidence]    │  │ derived: INCLUDE       │
           └─────────────────────────────────┘  └────────────────────────────────────┘  └───────────────────────┘
PRISMA & REPORT   flow diagram · checklist · disclosure (auto)        DATEN & REPO   connect · reviewer file · export
```

The synthesis surface that brings human and AI Belege together is the next build; its level (per article, corpus-wide, or both) is the open KI1 decision (section 9).

## 2. PRISMA essentials that drive the UI

PRISMA is a reporting standard (make the selection process transparent and auditable), not a conduct standard, so the UI's job is to show the process honestly, not to automate judgement. The design-relevant distillation:

- Flow diagram (PRISMA 2020). Three phases, Identification, Screening, Included. The 2009 standalone Eligibility box is gone, do not draw it. Each phase carries counts; exclusions carry reasons.
- The signature requirement (PRISMA-trAIce R1). At every screening stage where AI was used, the flow diagram and text must distinguish records included or excluded by the AI tool from those decided by human reviewers, and report how many records the AI processed and with what outcome. This AI-versus-human split is the single most important visual in the tool. The adapted diagram adds separate fields for AI-excluded and human-excluded records and separates rule-based admin tools (deduplication) from evaluative AI.
- Governance (RAISE). The UI embodies three principles. The human is accountable and their decision is binding; AI is used with human oversight; any AI that makes or suggests a judgement is fully disclosed. The binding human decision is always visually primary, the AI proposal visibly advisory and secondary, the provenance (model, version, prompt) shown.
- Disclosure (PRISMA-trAIce M2/M3/M6/M8/M9 + RAISE Table 1). The tool emits a text block covering tool name, version, date, stage, task, prompt version, decoding parameters, confidence threshold, limitations, conflicts of interest. The agreement metrics it once carried are evaluated externally now (section 4C).
- Checklists. PRISMA 2020 (27 items) and PRISMA-trAIce (17 items, each with a priority level), a trackable list with per-item status and notes; some items auto-satisfy from session data.
- The empirical heart. The project's finding is a large, asymmetric human-AI divergence, the LLM including substantially more than the experts (the figures and their decomposition are in [[verification]]). The UI treats this divergence as the product, not an error; it is visible only because AI and human decisions are recorded separately, which is exactly what R1 asks for. Divergence is a first-class, explorable state in the report layer, not the screening view.

## 3. Personas

| Persona | Who | Primary need | Mode |
|---|---|---|---|
| Reviewing expert | Sackl-Sharif, Klinger | Screen each paper fast, independently, consistently | Keyboard-first, one paper at a time |
| Review lead | Sackl-Sharif (lead) | Oversee the selection, see the flow, produce the report | Dashboard, read and export |
| Technical lead | Pollin | Import batches, configure, generate disclosure, run the update | Data I/O and config |
| External reviewer or auditor | Journal referee, FFG reviewer | Verify the AI use was reported responsibly | Read-only, checklist and flow |

## 4. The three surfaces (as built)

These are the surfaces implemented in `docs/js/prisma.js` and `docs/css/prisma.css`.

### 4A. Page shell

Standalone page `docs/prisma.html` (ADR-008), wearing the Companion design since ADR-014: the shared header (title, subtitle, authors, the rainbow accent bar), the navigation identical on all five pages, and the shared footer, plus a thin repo-connection bar. `js/prisma-data.js` provides the `window.EC` shim over `research_vault_v2.json`. A sub-navigation with exactly three buttons, each followed by a one-line intro:

- Screening: Volltext lesen und durchsuchen, Belege an Kategorien anheften, Include/Exclude entscheiden.
- PRISMA & Report: PRISMA-2020-Fluss, Checkliste und Disclosure, aus dem Screening erzeugt.
- Daten & Repo: Mit dem Projektordner verbinden, eine Datei pro Reviewer:in, Export/Import.

There is no blind-mode toggle and no comparison surface. A persisted v3 surface id is normalised onto these three on load.

### 4B. Screening (default surface)

The per-paper working surface, optimised for reading the document, finding the words that carry a category, and pinning them as evidence. Three panes in one grid.

- Left, corpus navigator. A full-text search box over the whole corpus (FR-12, backed by `docs/data/fulltext_index.json`) plus the paper list with status dots (none, include, exclude) and a hit-count badge when a corpus query is active. Selecting a paper opens it; an active corpus term is carried into the in-text search.
- Centre, reading column. Title and authors, a sticky in-text search bar (highlight all, step previous/next, hit counter, "Treffer anheften"), then the rendered document. The document is `paper.knowledge_doc` fetched on demand and rendered by the built-in minimal Markdown renderer (FR-11), splitting the paper layer from the machine-extraction layer at the first `## Kernbefund` heading with a Volltext / KI-Extraktion toggle (ADR-016). Papers without a `knowledge_doc` fall back to the abstract; a `nur Abstract` pill marks the fallback.
- Right, assessment. The ten category chips in two dimension groups (definitions on hover), the pinned Belege grouped by category with a per-Beleg human/KI marker, the derived `(>=1 Technik) UND (>=1 Sozial)` decision with the override-to-exclude switch, the exclusion-reason picker when the decision is Exclude, the binding "Entscheidung erfassen" action, and an optional collapsed AI suggestion.

Evidence pinning (FR-13). Selecting a passage in the reading column, or pressing "Treffer anheften" on the active in-text hit, opens a category menu. A pin from the paper layer is `origin: human`, sets the category, and is the binding justification; a pin from the KI-Extraktion layer is `origin: ai`, is shown marked KI, and never sets a category (ADR-016). The contract is in [[data]].

```
SCREENING  ┌ Korpus + Volltext-Suche ┐  ┌ Titel · In-Text-Suche · Dokument ┐  ┌ Kategorien · Belege ┐
           │ [Suche: "gender"]        │  │ ...gendered <mark>scripts</mark>  │  │ Technik  Sozial      │
           │ ● Paper A      3×         │  │  of care...   [‹ 3/7 ›][anheften] │  │  Gender ✓            │
           │ ○ Paper B                 │  │  [Volltext | KI-Extraktion]       │  │   └ "gendered..." M │
           │ ● Paper C      1×         │  │  Text markieren → Beleg anheften  │  │ abgeleitet: INCLUDE  │
           └───────────────────────────┘  └───────────────────────────────────┘  │ [Entscheidung] ↵     │
                                                                                   │ ▸ KI-Vorschlag (adv) │
                                                                                   └──────────────────────┘
```

### 4C. PRISMA & Report

The outputs, computed from the screening, not part of the working loop. One scroll with a perspective selector (whose decisions count as the human side) and three sections: the PRISMA 2020 flow with the trAIce R1 AI-versus-human split, the PRISMA-trAIce checklist (auto-satisfied where the setup already meets an item), and the AI-disclosure generator (Markdown preview, copy, export). Since ADR-017 the disclosure no longer computes kappa or the matrix in-tool; it carries the trAIce M9/R2 item as a reference to the external benchmark evaluation ([[verification]]). The divergence itself is research material for the paper and Companion, not screening work.

### 4D. Daten & Repo

Sync. Reviewer identity (the `<kuerzel>.json` filename), the File System Access connect, reconnect, and reload that writes each reviewer file directly into the project folder, export and import as the all-browser fallback, and the decision-log CSV. ADR-014 removed the in-tool Git workflow (versioning is GitHub Desktop) and the reviewer reconciliation table.

## 5. Design system

The tool inherits the Companion frame and carries its own screening design language, ported from the PRISM design handoff (section 7).

- Typography. IBM Plex tri-family: Sans for the UI, Mono for ids and data, Serif for reading the document. The Companion uses IBM Plex Serif for headings and Inter for body; the tool page wears the Companion header.
- Colour (OKLCH, semantic). Cool slate neutrals at very low chroma; functional accents at a shared chroma with hue carrying meaning, namely human and binding indigo, AI and advisory teal, include green, exclude red, divergence amber. Colour encodes the human-to-AI epistemic distinction consistently across components.
- Structure and code. One IIFE module `docs/js/prisma.js`, `'use strict'`, talking to `window.EC`; the screening grid is `--pt-nav-w | 1fr | --pt-rail-w`; `pt-*` namespaced CSS variables; responsive collapse of the navigator to an icon rail; width tokens for a real fullscreen tool. No framework, no build tool, CDN libraries only.
- Data access. `window.EC` over `research_vault_v2.json`; the corpus search index is `docs/data/fulltext_index.json`, loaded once and lazily.
- Category system. The ten-category spectrum (`EC.CAT_COLORS`, the rainbow gradient in Gegenstand-to-Perspektive order); dimension grouping technology {AI_Literacies, Generative_KI, Prompting, KI_Sonstige}, social {Soziale_Arbeit, Bias_Ungleichheit, Gender, Diversitaet, Feministisch, Fairness}.

## 6. Epistemic design principles

Each operationalises the project's thesis (reliability as a property of the process) and the standards.

1. Synthesis, not adversarial scoring. Human and AI assessment are brought together; the tool does not blend them into one number and no longer scores them against each other in the working view (ADR-014). Where they meet, each Beleg carries its provenance.
2. The human decision is visually primary and binding. The binding decision is the loud element; the AI proposal is quiet, labelled, and advisory; a machine-sourced Beleg never enters the binding record (RAISE accountability, ADR-016).
3. Provenance is always visible. Model, version, prompt version, and parameters travel with every AI proposal; each Beleg shows whether it is human or machine-sourced (PRISMA-trAIce M2/M6).
4. Reporting is a by-product, not extra work. The flow, the checklist, and the disclosure assemble themselves from the act of screening; the user never feels they are doing PRISMA on the side.

## 7. Design genesis (the PRISM handoff)

The screening design language did not start from scratch. A second, independent high-fidelity prototype of the instrument was produced in Claude Design from the same [[data]] model and handed off as a bundle (README, transcript, React source, reference screens). It was a design reference, not the shipped tool, a clickable React prototype consuming the data substrate verbatim, with fabricated seed papers, that demonstrated the interaction model and a rigorous OKLCH-plus-IBM-Plex design system.

The decision (iteration v3) was to port its design language and interaction model onto the existing vanilla, Git-backed `docs/prisma.html` and keep React out, computing every metric live from the real corpus and the real per-reviewer data rather than from the prototype's hardcoded constants. Ported: the OKLCH token system and the IBM Plex tri-family, the three-pane workspace, the derived-decision-plus-explicit-override pattern with a required exclusion reason, the disclosure generator, and the checklist tracker with verbatim item text and priority. The v4 redesign (ADR-012) then recentred the panes on corpus search, reading, and evidence, removed the blind/reveal Agreement rail from the working view, and moved the comparison apparatus to the report layer, where ADR-014 and ADR-017 later removed it entirely. The fuller genesis of these iterations is in [[journal]].

## 8. Assessment: center of gravity and the open evidence-basis item

A verification pass on the shipped frontend (2026-06-21) surfaced a standing tension worth keeping in view. The most built-out surface, evidence-grounded in-tool screening, is not the working path of the actual users; the two reviewing colleagues capture categories in their established Excel, and PRISM is the downstream PRISMA layer that ingests that Excel over the import bridge ([[specification]] P3 path, [[plan]]). In-tool evidence screening therefore serves the technical lead and the planned agent track; the colleagues' decisions arrive with an empty evidence map. This is documented and deliberate, but the demonstrable centerpiece and the everyday value point in different directions, which the synthesis surface (KI1) and the round-2 design must resolve.

The one substantive open methodological item is the evidence basis. What the screening surface renders and searches is the distilled knowledge document, not the raw text, and the project's own model-by-input experiment showed knowledge documents amplify the inclusion tendency ([[verification]]). A Beleg pinned on a distillate inherits its framing. The remedy is specified but not built (ADR-013, raw local reading with a recorded `text_source`, [[plan]] P2): either implement it before in-tool Belege enter the paper, or label the pinned Belege in the stored record and the disclosure as knowledge-document based, so the evidence basis stays auditable.

## 9. Open design questions

1. The synthesis surface level (KI1): per article, corpus-wide, or both. This gates the next build and is an operator decision.
2. How loud divergence should be where it is shown in the report layer, a quiet badge or a deliberate pause.
3. The ten category chips under repetition: two-row grid versus a compact dimension-split list, which reads faster.
4. Responsive scope: is screening desktop-only, or is tablet review supported.

## Was nicht reingehört

This document does not specify the technical architecture (a future `architecture.md`), does not restate the full PRISMA or PRISMA-trAIce text (see [[standards]]), and does not define the data schema (see [[data]]). It is the visual and interaction brief, the bridge from the standards and the requirements to a buildable interface.

## Related

- [[specification]]
- [[data]]
- [[journal]]
