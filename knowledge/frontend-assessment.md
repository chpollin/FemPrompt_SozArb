---
title: Frontend Assessment
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: active
language: en
version: "0.1"
created: 2026-06-21
updated: 2026-06-21
authors: [Christopher Pollin]
generated-with: Claude Code (Claude Opus 4.8)
related: [specification, data, plan, user-stories, status]
---

A critical assessment of the shipped PRISM screening frontend (`docs/prisma.html`) against its own requirements ([[specification]]), data model ([[data]]), and plan ([[plan]]), written 2026-06-21 after a verification pass: the test suite is green (56 of 56, headless jsdom), all three surfaces were exercised in the browser, and the storage path including the fallback was checked. The document records where the tool meets the need to support the literature review as it is actually conducted, where it does not, and how working with it persists to the repository. It is an evaluation layer; the decisions it implies are the operator's. It is the lane's assessment and has not been validated by the named authors.

## The central tension: the tool's center of gravity vs. the real workflow

Two decisions taken on 2026-06-09 point in different directions. ADR-012 rebuilt the tool around its screening surface: read the full text, search it, pin found words as evidence to categories (FR-11 to FR-13), the explicit heart of the v4 redesign. The same day, the P3 decision ([[plan]], Stage A) fixed that the two reviewing colleagues keep capturing categories in their established Excel, and PRISM is the downstream PRISMA layer that ingests that Excel. [[user-stories]] records this as a partially falsified usage model.

The consequence: the most built-out surface, evidence-grounded in-tool screening, is not the working path of the actual users. It serves the technical lead and the planned agent track. The colleagues' path is Excel, then the import bridge, then the report layer. This is documented and deliberate (in-tool screening is "not polished further", [[plan]] P3), but the demonstrable centerpiece and the everyday value point in different directions.

## Requirements assessment, measured against the real workflow

The report layer holds. The flow diagram (FR-04), the confusion matrix and kappa (FR-05), the disclosure generator (FR-06) and the dual checklist (FR-07) are built, run, and reproduce the canonical figures (matrix 100/34/108/49, kappa 0.056, n 291). This is the value PRISM delivers for the colleagues, and it stands.

The Excel bridge (`docs/js/prisma-import.js`) is carefully built: column mapping including the `Diversitaet / Intersektionalität` variant, controlled-vocabulary checks on exclusion reasons, duplicate detection, collision protection with no silent overwrite, a visible validation report. Its verification gap: it is tested against the column shape of `benchmark/data/human_assessment.csv` and a static hand-trace, not against a real, freshly exported colleague Excel. [[plan]] TP1 names exactly this as the open validation criterion.

The centerpiece passes the real user path by. Decisions imported from Excel land with an empty evidence map. The user story "every category I set points at the exact words that justify it" therefore holds for in-tool screening, not for the colleagues' actual captured decisions. Evidence grounding for those is deferred to a later phase and a different actor (machine evidence, agent pass, sample verification, [[plan]] B2).

A methodological limitation the project itself named is open in the shipped tool. What the screening surface renders and searches is not the raw text but the distilled knowledge document (`docs/vault/Papers/*.md`, FR-11 as built, [[data]] reading text source). The 2x2 experiment showed knowledge documents amplify the inclusion tendency. A Beleg pinned on a distillate inherits its framing. Raw local reading with a recorded text source is specified as ADR-013 and [[plan]] P2 but not implemented. Until then, in-tool Belege are pinned on an LLM summary, not on the paper.

Not built, deliberately or deferred: blind mode (removed by ADR-012), live LLM (FR-10 deferred), and a human-against-human reconciliation. The reviewers reconciliation table compares each reviewer against the AI, not the two humans against each other, and a consensus mechanism (PRISMA-trAIce M8) is absent. For the real two-person review cycle this is needed and sits in Stage B3, after the 1 July meeting. It is not in v1.0.

## How working with the tool persists to the repository

The canonical persisted unit is one JSON file per reviewer under `docs/data/screening/`, schema `femprompt-prisma-reviewer/0.2`, pretty-printed, keyed by `zotero_key`. Git is the sync layer; one file per reviewer keeps it conflict-free. Writing happens on every decision: `save()` writes to localStorage and, if a folder is connected, serializes the whole file through the File System Access API (`writeCurrentReviewer`). Direct write is Chromium-only; Firefox, Safari, and the colleague path use download and import. On load the files are the source of truth and overwrite the local cache.

Five findings on storage:

1. Documentation drift, fixed 2026-06-21. The screening README documented schema 0.1 without the `evidence` and `override` fields; the tool writes 0.2. Corrected in `docs/data/screening/README.md`.
2. The AI judgment is not in the reviewer file. It comes from the corpus (`research_vault_v2.json`). The full audit record is therefore the reviewer file plus the corpus snapshot. Reproducibility depends on the corpus keeping the `zotero_key` values stable across regenerations.
3. No reading provenance. Which text source a reviewer read (raw, knowledge document, abstract) is not stored; the `text_source` field is planned (P2, ADR-013) but not in the persisted record. For evidence provenance this is precisely the relevant information.
4. Timestamp churn. The `updated` field at the file head changes on every write, so every commit carries at least that one line, even when re-screening the same paper. Minor Git noise.
5. Reviewer key not validated. The file is named after the freely typed key, and the field is not validated. The public-repo pseudonym-versus-real-name question (Q1) is open, and a real name could land in a public file. A governance point before deploy, not after.

## Open methodological item

The one substantive content item is the evidence basis. In-tool Belege are currently pinned on the distilled knowledge document, not the raw text, and the project's own 2x2 experiment flagged that distillates shift the inclusion tendency. Either implement ADR-013 (raw local reading plus a recorded `text_source`) before in-tool Belege enter the paper, or label the pinned Belege in the stored record and the disclosure as knowledge-document based, so the evidence basis stays auditable.

## Relation to the knowledge base

Requirements and ADRs in [[specification]] (FR-11 to FR-13, ADR-012, ADR-013); workflow and phases in [[plan]] (P2, P3, B3); the persisted model in [[data]] (per-reviewer files, evidence behaviour); the canonical figures in [[verification-empirical-core]] reproduced via `benchmark/scripts/verify_femprompt.py`.

*Updated: 2026-06-21*
