---
title: User Stories
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
  name: Vorlage User Stories
  version: 0.1
  url: https://dhcraft.org/Promptotyping/promptotyping-document/user-stories
  alias: https://dhcraft.org/Promptotyping/#promptotyping-document-user-stories
topics: ["[[Scholar-Centered Design]]", "[[User Stories]]"]
related: [specification, data, ai-assisted-review-standards]
---

Usage scenarios for the PRISMA screening tool, in the form "As [role], who [context], I want [goal], so that [benefit]." Stories are grouped by intent: core screening operations, scholarly assurance (PRISMA/PRISMA-trAIce/RAISE conformance and reproducibility), and conceptual orientation. The roles are the review lead (Susi Sackl-Sharif), the reviewing experts (Sackl-Sharif, Klinger), the technical lead (Christopher Pollin), and an external reviewer/auditor (a journal referee or FFG reviewer). Each story carries an Ableitung that links it into the knowledge base. Formal requirements are in [[specification]].

## v4 core stories (current, evidence-grounded)

These three are the heart of the v4 redesign (see [[specification]] ADR-012, [[design]] section 0). They supersede the AI-anchoring stories below as the primary scenarios; those are kept as background.

### Read and move through the full text fast

*As a reviewing expert, who has 326 papers to get through, I want each paper as a readable, formatted full text (not only an abstract, since 50 papers have none), so that I can scan it quickly and judge it on the actual content.*

Ableitung:
- Requirement [[specification#Anforderungen]] FR-11
- Material [[data]] (full-text source, `docs/vault/Papers/*.md`)

### Search the text for the words that matter

*As a reviewing expert, who knows which terms signal a category, I want to search within the open paper and across all papers, so that I can jump straight to the relevant passages and find candidate studies fast.*

Ableitung:
- Requirement [[specification#Anforderungen]] FR-12
- Component [[design]] section 0 (Screening view)

### Pin a found word as evidence for a category

*As a reviewing expert, who must justify each inclusion, I want to pin a search hit and its surrounding passage as a Beleg on a category, so that every category I set points at the exact words that justify it and the decision is reproducible and citable in the report.*

Ableitung:
- Requirement [[specification#Anforderungen]] FR-13
- Material [[data]] (reviewer file schema 0.2, `evidence[category]`)
- Concept [[prisma-methodology]] (transparent, auditable selection)

## Core screening operations

### Screen a paper without being anchored by the AI

*As a reviewing expert, who must judge each study on its own merits, I want the AI's proposal hidden until I have recorded my own decision, so that my judgement stays independent and the comparison with the AI remains meaningful.*

Ableitung:
- Requirement [[specification#Anforderungen]] FR-02, FR-03
- Component [[specification#Screening Workspace]]
- Concepts [[ai-assisted-review-standards]] (dual track, RAISE human oversight), [[data#ScreeningRecord]]

### See where I diverge from the AI

*As a reviewing expert, who has just decided on a paper, I want to see the AI's decision and where it differs from mine, so that I can notice category interpretations I might have missed and the team can study the divergence.*

Ableitung:
- Requirement [[specification#Anforderungen]] FR-03, FR-05
- Component [[specification#Agreement Panel]]
- Concepts [[data#divergence]] (Semantic Expansion, Implicit Field Affiliation, Keyword Inclusion)

### Record an exclusion with a reason

*As a reviewing expert, who excludes a paper, I want to attach one reason from a fixed list, so that the exclusion is auditable and the flow diagram can break exclusions down by reason.*

Ableitung:
- Requirement [[specification#Anforderungen]] FR-02
- Component [[specification#Screening Workspace]]
- Concepts [[data#Category schema (reused, not redefined)]] (exclusion reasons)

### Watch the PRISMA picture build live

*As a review lead, who oversees the screening, I want the PRISMA flow diagram to update as decisions are made and to keep AI and human tallies separate, so that I always see the current state of the selection process in PRISMA-trAIce form.*

Ableitung:
- Requirement [[specification#Anforderungen]] FR-04
- Component [[specification#PRISMA Flow Diagram]]
- Concepts [[ai-assisted-review-standards]] (PRISMA-trAIce R1), [[data#FlowModel (PRISMA 2020 + trAIce R1 aggregation)]]

### Run a literature update on a fresh batch

*As the technical lead, who has a new set of papers from the same deep-research prompts, I want to import them with their offline AI assessment and screen only what is new, so that the update is screened the same way as the original corpus and stays reproducible.*

Ableitung:
- Requirement [[specification#Anforderungen]] FR-01, FR-09, NFR-03
- Component [[specification#Data I/O]]
- Concepts [[data#Session (export / import envelope)]]

## Scholarly assurance

### Generate a PRISMA-conformant record

*As a review lead, who is writing up the review, I want to export the flow diagram, the agreement metrics, and a filled checklist as one PRISMA record, so that the selection process is reported transparently and is ready for a methods section.*

Ableitung:
- Requirement [[specification#Anforderungen]] FR-04, FR-05, FR-07
- Component [[specification#Disclosure / Report Generator]]
- Concepts [[prisma-methodology]] (27-item checklist, flow diagram)

### Produce the AI-disclosure text automatically

*As the technical lead, who must disclose AI use, I want a generated disclosure section naming model, version, prompt, parameters, validation metrics, limitations, and conflicts, so that the report satisfies PRISMA-trAIce and RAISE without hand-assembling it.*

Ableitung:
- Requirement [[specification#Anforderungen]] FR-06
- Component [[specification#Disclosure / Report Generator]]
- Concepts [[ai-assisted-review-standards]] (trAIce M2/M3/M6/M8/M9, RAISE Table 1), [[data#DisclosureMetadata (trAIce M2/M3/M6 + RAISE Table 1)]]

### Verify the review is PRISMA-trAIce-conformant

*As an external reviewer, who is auditing the review, I want to see the AI-vs-human split in the flow diagram and a checklist of which PRISMA and PRISMA-trAIce items are met, so that I can confirm the AI use was reported responsibly.*

Ableitung:
- Requirement [[specification#Anforderungen]] FR-04, FR-07
- Component [[specification#Checklist Tracker]]
- Concepts [[ai-assisted-review-standards]] (PRISMA-trAIce status as proposed extension)

### Share a session with a colleague

*As a reviewing expert, who has screened part of a batch, I want to export my session and hand it to a colleague who imports it, so that we can divide and later reconcile the screening without a shared server.*

Ableitung:
- Requirement [[specification#Anforderungen]] FR-08, ADR-006
- Component [[specification#Data I/O]]
- Concepts [[data#Session (export / import envelope)]]

## Conceptual orientation

### Look up what a category means

*As a reviewing expert, who is unsure whether a paper is Gender or only Feministisch, I want the category definition at hand while I screen, so that I apply the schema consistently and understand the operationalisation gap the project documented.*

Ableitung:
- Requirement [[specification#Anforderungen]] FR-02
- Component [[specification#Screening Workspace]]
- Concepts [[data#Category schema (reused, not redefined)]], `benchmark/config/categories.yaml`

### Understand a checklist item

*As the technical lead, who is filling the checklist, I want each PRISMA-trAIce item to show its verbatim text and priority level, so that I know what "satisfied" requires before I mark it.*

Ableitung:
- Requirement [[specification#Anforderungen]] FR-07
- Component [[specification#Checklist Tracker]]
- Concepts [[ai-assisted-review-standards#The 14 items (verbatim, with priority level)]]

*Updated: 2026-06-09*
