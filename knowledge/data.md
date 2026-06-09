---
title: Data
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
  name: Vorlage Datengrundlage
  version: 0.1
  url: https://dhcraft.org/Promptotyping/promptotyping-document/data
  alias: https://dhcraft.org/Promptotyping/#promptotyping-document-data
topics: ["[[Data Modelling]]"]
related: [specification, ai-assisted-review-standards, methods-and-pipeline]
---

This document describes the substrate the PRISMA screening tool consumes and produces. The tool is built so that its data model is, by construction, a PRISMA-trAIce-conformant screening record: every screening decision stores the AI decision and the human decision separately, which is exactly what item R1 needs to render an AI-vs-human flow split. The model has four parts: the per-paper `ScreeningRecord`, the aggregated `FlowModel`, the `DisclosureMetadata`, and the `Session` envelope (export/import). The category schema and inclusion logic are reused verbatim from the benchmark (`benchmark/config/categories.yaml`); the seed dataset is the existing corpus. What the data *means* lives here; what is *done* with it lives in [[specification]].

## Category schema (reused, not redefined)

Ten binary categories, split into two dimensions, with the inclusion rule from [[methods-and-pipeline]]:

- Technology: `AI_Literacies`, `Generative_KI`, `Prompting`, `KI_Sonstige`
- Social: `Soziale_Arbeit`, `Bias_Ungleichheit`, `Gender`, `Diversitaet`, `Feministisch`, `Fairness`
- Inclusion: a paper is included iff (>=1 technology) AND (>=1 social).
- Exclusion reasons (controlled): `Duplicate`, `Not_relevant_topic`, `Wrong_publication_type`, `No_full_text`, `Language`.

Canonical definitions stay in `benchmark/config/categories.yaml`; the tool reads them, it does not fork them.

## ScreeningRecord (per paper)

The atomic unit. AI and human decisions are sibling objects so they never overwrite each other.

```json
{
  "zotero_key": "ABCD1234",
  "title": "Data Feminism for AI",
  "authors": "D'Ignazio & Klein",
  "year": 2024,
  "abstract": "…",
  "source_tool": "Claude | ChatGPT | Gemini | Perplexity | Manual",
  "input_source": "abstract | knowledge_doc",
  "knowledge_doc": "… optional distilled full-text …",

  "ai_decision": {
    "model": "claude-haiku-4-5",
    "version": "4.5",
    "date": "2026-03-15",
    "prompt_version": "v2.1",
    "parameters": { "temperature": 0.0, "max_tokens": 1024 },
    "confidence": 0.82,
    "categories": { "AI_Literacies": false, "Generative_KI": true, "…": false },
    "decision": "include | exclude",
    "reasoning": "… model justification (diagnostic, confabulation-prone) …",
    "source": "batch | live"
  },

  "human_decision": {
    "reviewer": "SSS | SK | CP",
    "timestamp": "2026-06-09T14:12:00Z",
    "categories": { "AI_Literacies": false, "Generative_KI": true, "…": false },
    "decision": "include | exclude",
    "exclusion_reason": null,
    "binding": true
  },

  "divergence": {
    "is_divergent": true,
    "axis": "decision | category",
    "pattern": "Semantic Expansion | Implicit Field Affiliation | Keyword Inclusion"
  }
}
```

Rules: `human_decision.binding` is always true and is the record of truth (NFR-04). `ai_decision` is optional (a paper may be screened without one) and is never mutated by human action. `divergence` is derived, not entered. `decision` is derived from `categories` via the inclusion rule and may be overridden with a recorded reason.

## FlowModel (PRISMA 2020 + trAIce R1 aggregation)

Derived from all `ScreeningRecord`s; the data behind the flow diagram. It keeps AI and human exclusions in separate fields, which is the core PRISMA-trAIce modification.

```json
{
  "identification": {
    "n_identified": 326,
    "by_source": { "DeepResearch": 254, "Manual": 50, "Zotero_only": 22 },
    "duplicates_removed": 0,
    "tool": "rule-based (deduplication) vs evaluative AI are reported separately"
  },
  "screening": {
    "n_screened": 291,
    "excluded_by_ai": { "total": 83, "by_reason": { "Not_relevant_topic": 60, "…": 23 } },
    "excluded_by_human": { "total": 157, "by_reason": { "Not_relevant_topic": 120, "…": 37 } },
    "ai_vs_human_matrix": { "both_include": 100, "human_incl_ai_excl": 34,
                            "ai_incl_human_excl": 108, "both_exclude": 49 }
  },
  "included": { "n_included_human": 134, "n_included_ai": 208 }
}
```

Note the two include counts: the binding human count and the advisory AI count are both reported (PRISMA-trAIce R1 asks for the AI-processed numbers and outcomes alongside the human ones). The 2020 three-phase structure is used; there is no standalone Eligibility box.

## DisclosureMetadata (trAIce M2/M3/M6 + RAISE Table 1)

The fields the disclosure generator (FR-06) needs. Most come from `ai_decision`; the rest are session-level.

| Field | Source | Standard |
|---|---|---|
| tool name / version / date | `ai_decision.model/version/date` | trAIce M2, RAISE T1 |
| stage and task | session config (identification, screening, synthesis) | trAIce M3 |
| prompt reference | `prompt_version` -> `prompts/CHANGELOG.md` | trAIce M6a |
| decoding parameters | `ai_decision.parameters` | trAIce M6b |
| confidence threshold | session config | trAIce M7 |
| human oversight | derived (proportion verified = 100% dual screening) | trAIce M8 |
| validation metrics | `FlowModel` agreement (kappa, matrix) | trAIce M9/R2, RAISE Table 1 |
| limitations | session notes | trAIce D1, RAISE Table 1 |
| conflicts of interest | session config | RAISE Table 1 |

## Session (export / import envelope)

The full persisted state, autosaved to localStorage and exportable as JSON (FR-08).

```json
{
  "schema": "femprompt-prisma-session/0.1",
  "created": "2026-06-09",
  "config": { "blind_mode": true, "reviewer": "CP", "stage": "screening",
              "disclosure": { "threshold": 0.5, "conflicts_of_interest": "none" } },
  "records": [ /* ScreeningRecord[] */ ],
  "checklist": { "prisma_2020": { "…": "status+notes" },
                 "prisma_traice": { "R1": "satisfied", "…": "status+notes" } }
}
```

Round-trip must be lossless (FR-08 acceptance). The `schema` string is versioned so future tool versions can migrate older sessions.

## Per-reviewer files and Git persistence (implemented model)

The shipped tool persists not as one session blob but as **one JSON per reviewer** under `docs/data/screening/`, so Git is the sync layer and reviewers never conflict (see ADR-009, ADR-010). The File System Access API writes the current reviewer's file directly into the repo on every decision; localStorage mirrors it as a cache; export/import is the fallback.

```json
// docs/data/screening/<reviewer>.json  (schema bumped to 0.2 with evidence)
{
  "schema": "femprompt-prisma-reviewer/0.2",
  "reviewer": "sss",
  "updated": "2026-06-09T12:00:00.000Z",
  "decisions": {
    "<paperId>": {
      "categories": { "Gender": true, "Soziale_Arbeit": true },
      "decision": "Include",
      "reason": null,
      "evidence": {
        "Gender": [
          { "term": "gendered scripts", "snippet": "...agents reproduce gendered scripts of care...", "ts": "..." }
        ]
      },
      "ts": "...", "reviewer": "sss"
    }
  }
}
```

The `evidence` map (added in schema 0.2, FR-13) is the v4 core: per category, a list of pinned Belege, each a `term` plus the surrounding `snippet` taken from the full text at screening time. Backward compatible: a 0.1 record without `evidence` loads as a record with no evidence. Evidence is the reviewer's textual justification; it is never written by the AI.

Aggregation: the tool loads every `*.json` in the folder into `reviewers[key]`, plus the built-in `seed` reviewer (the existing expert assessment, `paper.human`). A **perspective** selector chooses whose decisions count as the human side in the Flow and Agreement (default `seed`, which reproduces the benchmark). The **Reviewers** surface computes, per reviewer, n / include / exclude and kappa against the AI (PRISMA-trAIce M8/M9). The AI proposal is always `paper.llm` from the corpus, never stored in a reviewer file.

Git workflow: `git add docs/data/screening/<reviewer>.json && git commit -m "screening: N papers (<reviewer>)" && git push`; collaborators pull and reconnect the folder. Documented in `docs/data/screening/README.md`.

## Full-text source and evidence (v4)

The v4 screening view reads and searches the **full text**, not just the abstract. The converted full texts already exist and are servable:

| What | Where | Count |
|---|---|---|
| Full-text Markdown (Docling) | `docs/vault/Papers/<title>.md` | 226 files; all 236 `knowledge_doc` paths resolve under `docs/` |
| Path on the paper record | `paper.knowledge_doc` (e.g. `vault/Papers/<title>.md`) | relative to `docs/`, so `fetch(knowledge_doc)` works from `prisma.html` |
| Abstract | `paper.abstract` in `research_vault_v2.json` | empty for 50 of 326 papers, which is why full text is needed |

The screening view fetches `paper.knowledge_doc` on demand, renders the Markdown readably, and runs search over the fetched text. A corpus-wide search either fetches lazily or uses a prebuilt lightweight index (a `generate_*` step may add `docs/data/fulltext_index.json` of stemmed tokens to paper ids; to be added if lazy fetch is too slow over 326 files). Each search hit can be pinned as a `evidence[category]` entry (see the reviewer file above). The AI proposal (`paper.llm`) stays available but collapsed; it is not part of the evidence.

## Seed dataset (read-only case study)

The tool ships seeded with the existing review so colleagues see a worked example before importing their own batch:

| Source file | Provides |
|---|---|
| `docs/data/research_vault_v2.json` | paper metadata, assessment, knowledge summaries |
| `benchmark/data/human_assessment.csv` | binding human decisions (303) |
| `benchmark/data/llm_assessment_10k.csv` | advisory AI decisions (326, Haiku) |
| `benchmark/results/agreement_metrics.json` | reference agreement figures |

A small build step (a `generate_*` script, to be added) maps these into the `Session` schema as a read-only seed; the seed reproduces the canonical benchmark (kappa 0.056, matrix 100/34/108/49) as a self-test for FR-05.

## Was nicht reingehört

Category definitions (canonical in `categories.yaml`), the pipeline that produces the offline AI assessments (in [[methods-and-pipeline]]), and the UI that renders this data (in [[specification]] and a future `design.md`). This note describes the substrate, not the behaviour.

*Updated: 2026-06-09*
