---
title: Design Review: PRISM Handoff
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
  name: Design Review
  version: 0.1
  url: https://dhcraft.org/Promptotyping/
topics: ["[[Scholar-Centered Design]]", "[[Information Visualisation]]"]
related: [design, specification, ai-assisted-review-standards, user-stories, data]
---

A second, independent high fidelity prototype of the screening tool ("PRISM") was produced in Claude Design from the same `[[data]]` model and handed off as a bundle (README, chat transcript, React/JSX source, reference screens). It is not the shipped tool: it is a design reference. This note records what is worth importing from it into our shipped vanilla, Git backed tool (`docs/prisma.html`), and what it deliberately leaves out. The decision on the implementation path is open (see last section).

## What the artifact is

PRISM is a clickable React prototype (React 18 plus in browser Babel via CDN) of the same instrument specified in `[[specification]]` and `[[design]]`. It consumes the `[[data]]` substrate verbatim: ten binary categories in two dimensions, inclusion rule `(>=1 tech) AND (>=1 social)`, five controlled exclusion reasons, `ScreeningRecord` with sibling AI and human decisions, the benchmark `FlowModel` (kappa 0.056, matrix 100/34/108/49). It ships fourteen fabricated seed papers in the project theme, autosaves to localStorage, and renders six surfaces: Screening, Agreement, PRISMA flow, Checklist, Disclosure, Data I/O.

## What it does better than our shipped tool

The value is in the interaction model and the design language, not the engineering.

1. Blind to reveal as a first class moment. The screening surface is a three pane workspace (paper list, reading column, Agreement rail). The rail moves through three explicit states: `blind` (AI hidden behind a lock with the rationale "Record your own decision first, so your judgement stays independent and the human to AI comparison stays meaningful"), `preview` (blind off, AI shown before deciding), and `revealed` (after the binding human decision, the divergence appears). Our tool treats blind as a setting; PRISM makes the reveal a designed event. This is RAISE human oversight and the independence requirement turned into an affordance.

2. Derived decision with explicit override. Categories feed `deriveDecision` live; the UI shows "derived: Include/Exclude" with the `(>=1 Technology) AND (>=1 Social)` logic read out term by term. An "Override to exclude" switch is offered only when the derived result is include, and it is stored as a separate boolean. The rule output and the human override stay distinct in the record, which is exactly the provenance the project argues for. Exclusion reason is required when the decision is exclude.

3. AI provenance and confabulation framing as UI. The Agreement rail surfaces model, prompt version, confidence (as a meter), decoding parameters, and run date per paper, labels the AI block "advisory" and the AI reasoning "diagnostic, confabulation prone". The epistemic stance (advisory not binding, confabulation as the operative term) is encoded in the interface, not just the prose.

4. Disclosure generator (we do not have this). It assembles a PRISMA-trAIce plus RAISE "Use of artificial intelligence" paragraph from the session, and pairs it with a field provenance table mapping each field (tool, stage, prompt, parameters, threshold, oversight, validation, limitations, conflicts) to its standard (trAIce M2/M3/M6/M7/M8/M9, RAISE Table 1). This is directly useful for the paper, which needs exactly this disclosure text.

5. Checklist tracker with teeth. Each item shows verbatim requirement text, priority (Essential/Recommended), and status (satisfied/partial/todo), filterable by PRISMA 2020 vs PRISMA-trAIce, traceable to `[[ai-assisted-review-standards]]`.

6. A rigorous, semantic design system. OKLCH tokens: cool slate neutrals at very low chroma; functional accents at shared chroma around 0.13 with hue carrying meaning (human/binding indigo 264, AI/advisory teal 218, include green 152, exclude red 28, divergence amber 70). IBM Plex tri family (Sans for UI, Mono for IDs and data, Serif for reading the abstract). Colour encodes the human to AI epistemic distinction consistently across every component. Responsive collapse of the sidebar to an icon rail, width tokens for a real fullscreen tool.

7. The `_gold` worked example device. Each seed paper carries a hidden reference decision plus a plausible divergence pattern (Keyword Inclusion, Implicit Field Affiliation, Semantic Expansion), so the prototype demonstrates real divergences without exposing them as "the answer". A good teaching or demo mode pattern, and it maps onto our real pattern distribution (52/30/18 percent).

## What it deliberately leaves out (so it is not a replacement)

- No persistence beyond localStorage. No File System Access, no Git collaboration, no per reviewer files. The "share" strip and the import dropzone are stubs.
- Fourteen fabricated papers, not the real 326 paper corpus.
- React plus in browser Babel, which violates our architecture rule (no framework, no build tool, IIFE vanilla JS, CDN only). It is fine for a prototype, not for the Evidence Companion.
- Kappa and the matrix are hardcoded corpus constants, not computed from the live decisions. Our tool computes them.
- The reviewer switcher does not actually partition or aggregate decisions across reviewers (single localStorage blob); our per reviewer file model and perspective selector (ADR-010) do.

## Synthesis

The two builds are complementary. PRISM is the UX, visual, and epistemic affordance reference; our `docs/prisma.html` is the data and collaboration engine with the real corpus. The right move is to port PRISM's design language and interaction model onto our vanilla Git backed tool and keep React out, computing all metrics live from real per reviewer decisions.

Prioritised port targets:

1. Design tokens: OKLCH accent system and IBM Plex tri family into `prisma.css` (semantic human vs AI colour).
2. Three pane screening workspace with the blind to record to reveal to divergence Agreement rail (the biggest single UX win, replaces our current screening surface).
3. Derived decision plus override plus required reason pattern.
4. Disclosure generator as a new module (high value for the paper).
5. Checklist tracker (verbatim items, priority, status, PRISMA vs trAIce filter).
6. Responsive collapse and fullscreen width.

All on the real corpus and real per reviewer aggregation, with kappa and matrix computed live.

## Decision taken and implemented (iteration v3)

Path (a) was chosen: port PRISM's design language and interaction model into the existing vanilla `docs/prisma.html`, keep React out, compute every metric live from the real corpus and per reviewer data. Rationale: the shipped tool already owns the hard backend (Git File System Access, per reviewer files, live kappa and matrix, reconciliation, disclosure, checklist) that PRISM only stubs; the gap was the design system and the reveal interaction, which port cleanly onto vanilla. This also improves on PRISM itself, because the metrics are computed (not hardcoded) and the data is the real 326 paper corpus (not fabricated).

Shipped in iteration v3:

1. Design tokens in `docs/css/prisma.css`: OKLCH neutrals and functional accents (human indigo, AI teal, include green, exclude red, divergence amber), IBM Plex tri family (Sans UI, Mono IDs and data, Serif reading), spacing, radii, shadows, layout width tokens. Loaded via a Google Fonts link in `prisma.html`.
2. Rebuilt screening workspace as three panes: paper navigator (status dots, jump to any paper), serif reading column, and an agreement rail with the three explicit states blind, preview, revealed.
3. Decision model changed to derived plus explicit override: the decision follows the `(>=1 tech) AND (>=1 social)` rule; an "Override zu Exclude" switch appears only when the derived result is Include and is stored as a separate boolean on the record; the exclusion reason is required and rendered as chips. This keeps rule output and human override distinct in the saved record.
4. Agreement rail: blind lock with the independence rationale (RAISE oversight), preview when blind is off, and on reveal a divergence or full agreement verdict, two decision cards (human binding vs AI advisory), a category comparison, the AI reasoning (labelled diagnostic and confabulation prone, from the real `llm.reasoning`), and an AI provenance block.
5. Category chips carry hover definitions (`CAT_DEFS`).

Not changed: the Git per reviewer persistence, perspective selector, Flow, Agreement matrix, Reviewers, Checklist, and Report surfaces keep their logic and inherit the new look.

Verification: `node --check` clean; a headless jsdom harness executes init, renders the three panes on the real 326 paper corpus, drives chip to derived to record, enforces the exclude reason requirement, and visits every surface (14 checks, all pass). The File System Access connect, read, and write path remains Chromium only and is not headless verifiable; it is unchanged from v2.

## Superseded open decision

The earlier fork (port in place vs separate page vs hold) is resolved by the decision above. Remaining design questions live in `[[design]]` section 9; formal constraints in `[[specification]]` ADRs.

*Updated: 2026-06-09*
