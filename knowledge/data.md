---
title: Data
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: complete
language: en
version: "0.4"
created: 2026-06-09
updated: 2026-08-22
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
related: [specification, methods, standards]
---

This document describes the substrate the PRISMA screening tool consumes and produces. The tool is built so that its data model is, by construction, a PRISMA-trAIce-conformant screening record: every screening decision stores the AI decision and the human decision separately, which is exactly what item R1 needs to render an AI-vs-human flow split. The model has the per-paper `ScreeningRecord`, the aggregated `FlowModel`, and the `DisclosureMetadata`. The canonical persisted unit in the built tool is one file per reviewer (schema `femprompt-prisma-reviewer/0.3`, with the evidence map and the recorded text source, see below); the single-blob `Session` envelope is the superseded v3 export shape. The category schema and inclusion logic are reused verbatim from the benchmark (`assessment/categories.yaml`); the seed dataset is the existing corpus. What the data *means* lives here; what is *done* with it lives in [[specification]].

## Category schema (reused, not redefined)

Ten three-level categories (nein/teilweise/ja = 0/1/2), split into two dimensions, with the three-way derivation from [[methods]] (ADR-024). The existing benchmark annotations (human and LLM `all_categories`) stay binary 0/1 and are read as-is; a legacy boolean coerces to ja. A new Paper-Beleg starts an empty category at teilweise and leaves the centrality judgement explicit (ADR-030).

- Technology: `AI_Literacies`, `Generative_KI`, `Prompting`, `KI_Sonstige`
- Social: `Soziale_Arbeit`, `Bias_Ungleichheit`, `Gender`, `Diversitaet`, `Feministisch`, `Fairness`
- Derivation: both dimensions ja yields Include; both at least teilweise yields Unclear; any dimension entirely nein yields Exclude.
- Exclusion reasons (controlled): `Duplicate`, `Not_relevant_topic`, `Wrong_publication_type`, `No_full_text`, `Language`.

Canonical definitions stay in `assessment/categories.yaml`; the tool reads them, it does not fork them.

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
    "pattern": "Semantic Expansion | Implicit Field Membership | Keyword Inclusion"
  }
}
```

Rules: `human_decision.binding` is always true and is the record of truth (NFR-04). `ai_decision` is optional (a paper may be screened without one) and is never mutated by human action. `divergence` is derived, not entered. `decision` is derived from `categories` via the inclusion rule and may be overridden with a recorded reason.

## FlowModel (PRISMA 2020 + trAIce R1 aggregation)

Derived from all `ScreeningRecord`s; the data behind the flow diagram. It keeps AI and human exclusions in separate fields, which is the core PRISMA-trAIce modification.

```json
// counts are placeholders; the figures live in the data (generated/benchmark-results/, docs/data/) and the Evidence Companion
{
  "identification": {
    "n_identified": 0,
    "by_source": { "DeepResearch": 0, "Manual": 0, "Zotero_only": 0 },
    "duplicates_removed": 0,
    "tool": "rule-based (deduplication) vs evaluative AI are reported separately"
  },
  "screening": {
    "n_screened": 0,
    "excluded_by_ai": { "total": 0, "by_reason": { "Not_relevant_topic": 0, "…": 0 } },
    "excluded_by_human": { "total": 0, "by_reason": { "Not_relevant_topic": 0, "…": 0 } },
    "ai_vs_human_matrix": { "both_include": 0, "human_incl_ai_excl": 0,
                            "ai_incl_human_excl": 0, "both_exclude": 0 }
  },
  "included": { "n_included_human": 0, "n_included_ai": 0 }
}
```

Note the two include counts: the binding human count and the advisory AI count are both reported (PRISMA-trAIce R1 asks for the AI-processed numbers and outcomes alongside the human ones). The 2020 three-phase structure is used; there is no standalone Eligibility box. The AI figures in this illustrative block are on the paired papers; the shipped tool reports the AI track over all identified records, while the human track stays on the paired subset it covers. Both are correct for their reference set, and the matrix and kappa are always on the paired subset. The actual figures live in the data (generated/benchmark-results/, docs/data/) and the Evidence Companion.

## DisclosureMetadata (trAIce M2/M3/M6 + RAISE Table 1)

The fields the disclosure generator (FR-06) needs. Most come from `ai_decision`; the rest are session-level.

| Field | Source | Standard |
|---|---|---|
| tool name / version / date | `ai_decision.model/version/date` | trAIce M2, RAISE T1 |
| stage and task | session config (identification, screening, synthesis) | trAIce M3 |
| prompt reference | `prompt_version` -> `prompts/CHANGELOG.md` | trAIce M6a |
| decoding parameters | `ai_decision.parameters` | trAIce M6b |
| confidence threshold | session config | trAIce M7 |
| human oversight | derived (proportion verified under dual screening) | trAIce M8 |
| validation metrics | external benchmark evaluation (the data and the Evidence Companion) | trAIce M9/R2, RAISE Table 1 |
| limitations | session notes | trAIce D1, RAISE Table 1 |
| conflicts of interest | session config | RAISE Table 1 |

## Session (export / import envelope, v3 single-blob, superseded)

The v3 single-blob format, kept only as a description of the earlier export shape. The built tool does not write this; it persists one file per reviewer (schema 0.3, see "Per-reviewer files" below) and exports that file plus a decision-log CSV.

```json
{
  "schema": "femprompt-prisma-session/0.1",
  "created": "2026-06-09",
  "config": { "reviewer": "CP", "stage": "screening",
              "disclosure": { "threshold": 0.5, "conflicts_of_interest": "none" } },
  "records": [ /* ScreeningRecord[] */ ],
  "checklist": { "prisma_2020": { "…": "status+notes" },
                 "prisma_traice": { "R1": "satisfied", "…": "status+notes" } }
}
```

Round-trip must be lossless (FR-08 acceptance). The `schema` string is versioned so future tool versions can migrate older sessions.

## Per-reviewer files and version-controlled persistence (implemented model)

The shipped tool persists not as one session blob but as **one JSON per reviewer** under `docs/data/screening/`, so version control is the sync layer (see ADR-009, ADR-010). An editor enters a short key once, connects the project folder, and uses one disk action to save the complete paper record. The File System Access API writes the selected reviewer's file; localStorage preserves an unsaved recovery copy and never silently overwrites a conflicting disk record. GitHub Desktop handles versioning outside PRISM. The daily editor surface has no import workflow; the operator-only converter accepts screening records as a controlled migration seam and does not import analysis fields.

```json
// docs/data/screening/<reviewer>.json  (schema 0.2 added evidence, 0.3 adds text_source)
{
  "schema": "femprompt-prisma-reviewer/0.3",
  "reviewer": "sss",
  "actor": "human",
  "updated": "2026-06-09T12:00:00.000Z",
  "decisions": {
    "<paperId>": {
      "categories": { "Gender": true, "Soziale_Arbeit": true },
      "decision": "Include",
      "reason": null,
      "override": false,
      "override_reason": null,
      "evidence": {
        "Gender": [
          { "term": "gendered scripts", "snippet": "...agents reproduce gendered scripts of care...", "ts": "...", "origin": "human", "source_layer": "paper", "actor": "human" }
        ]
      },
      "ts": "...", "reviewer": "sss", "actor": "human",
      "text_source": "raw"
    }
  }
}
```

The `evidence` map (added in schema 0.2, FR-13) is the v4 core: per category, a list of pinned Belege, each a `term` plus the surrounding `snippet` taken from the read document at screening time. New records separate source and actor: `source_layer` is `paper` or `llm_distillate`, while `actor` is `human` or `agent`. The legacy `origin` value remains additive for backward compatibility and maps `human` to the Paper layer and `ai` to the distillate layer. A 0.1 record without `evidence` loads as a record with no evidence; old Belege without provenance load as Paper evidence (ADR-030).

`text_source` (added in schema 0.3, ADR-027) records the paper-layer text the decision was taken on, `raw` for the local Docling full text, `abstract` when only the abstract was shown, `none` when no text was available; a 0.1 or 0.2 record without the field loads unchanged and counts as unrecorded in the disclosure's per-source line (PRISMA-trAIce M4). The decision-log CSV carries the same value per row.

The `decision` follows the three-level rule: Include requires at least one category at level 2 in each dimension; Unclear requires at least level 1 in each dimension without meeting Include; Exclude follows when one dimension remains empty. The human binds and may override the derivation either way. An override to Include records a free-text `override_reason`, so the deviation from the rule is documented (O2, ADR-023; RAISE P3); an override to Exclude carries the exclusion `reason`. A category toggle that flips the derivation clears a now-stale override.

Aggregation: the tool loads every `*.json` in the folder into `reviewers[key]`. The current human side of the Flow is the explicitly selected reviewer role. The earlier expert assessment (`paper.human`) and the model proposal (`paper.llm`) come from the corpus and are never stored in a reviewer file. Both stay hidden until the selected reviewer has saved an independent decision; they are then available as collapsed reference material.

Versioning: the reviewer files are committed in GitHub Desktop outside the tool (ADR-014 removed the in-tool `git add/commit/push` hint); collaborators pull and reconnect the folder. Documented in `docs/data/screening/README.md`. The agent file `ar2.json` retains `actor: agent` at payload and record level and carries `status: provisional_technical_acceptance`. The operator accepted its technically verified integration into real research data; substantive judgements and the pilot publication-type rule still require methodological ratification.

## Reading text source and corpus search (v4, as built)

What the screening view reads and searches, and what it deliberately does not.

| What | Where | Note |
|---|---|---|
| Reading text (Volltext layer) | `docs/data/fulltext/{id}.md` via `fetchFullText`, listed in `fulltext_manifest.json` | the cleaned Docling full text, built by `src/publish/build_fulltext.py`; local clone only, gitignored (ADR-025). Current coverage is derived from the manifest. |
| LLM-Wissensdestillat layer | the generated distillation from `paper.knowledge_doc` (`## Kernbefund` onward) | shown as a separate reference layer and excluded from the Paper-evidence gate (ADR-016/028/029/030) |
| Abstract fallback | `paper.abstract` in `research_vault_v2.json` | used when no full text exists; not every paper has an abstract |
| Corpus search index | `docs/data/fulltext_index.json` (built by `src/publish/build_screening_index.py`) | stays distillation-based, not the full text, for the same copyright reason |

The raw Docling full texts live in `generated/markdown_clean/` and hold copyrighted, paywalled papers. `build_fulltext.py` cleans them (frontmatter, image comments, GLYPH artefacts) into `docs/data/fulltext/`, which is gitignored and never pushed; the public Pages site keeps only the fallback. Publishing the full texts publicly is outward-facing and a separate, rights-gated decision (ADR-025).

The screening view fetches the full text and the knowledge document together (`loadReadingInto`). The Volltext layer renders the paper with the built-in Markdown renderer; the `LLM-Wissensdestillat` layer renders the generated distillation from `## Kernbefund` onward. In-text search runs over the active document; corpus-wide search runs over `fulltext_index.json`. The model proposal (`paper.llm`) is separate from both reading layers and stays hidden until the independent decision is saved. The layer a snippet is pinned from sets `source_layer`; the configured run sets `actor` independently (ADR-030).

The built contract is ADR-025 plus ADR-027: `build_fulltext.py` writes the local reading layer under `docs/data/fulltext/`; PRISM reads it through `fulltext_manifest.json`, falls back to the metadata abstract, and records `raw`, `abstract`, or `none` in `text_source`. The knowledge-document distillate never becomes the Paper layer. An earlier paper-lane design with browser-side title-prefix matching and a `knowledge_doc` text-source value is superseded. The folder picker may target the repository root; PRISM resolves or creates `docs/data/screening/` below it. Publishing local full texts remains a separate rights-gated decision.

## Evidence behaviour (FR-13 contract, as built)

How a pinned Beleg is created, stored, and surfaced. This is the contract the reviewer-file writer and the UI both follow.

- Trigger: selecting a passage in the reading column (2 to 400 chars), or pressing "Treffer anheften" on the active in-text search hit. A category menu opens; choosing a category pins.
- Stored shape: `evidence[category]` is a list of `{ term, snippet, ts, origin, source_layer, actor }`. `term` is the selected text or the search query, trimmed to 80 chars. `snippet` is the surrounding context, trimmed to 260 chars. `ts` is an ISO timestamp. `source_layer` records Paper or LLM-Wissensdestillat; `actor` records Mensch oder Agent. `origin` remains the legacy compatibility field.
- Coupling: pinning a Paper-Beleg on an empty category sets `categories[category] = 1`. The reviewer promotes it explicitly to 2 when the paper treats the aspect centrally. A pin from the LLM-Wissensdestillat never sets or satisfies a category. Every category at level 1 or 2 needs at least one Paper pin before the decision can be saved. Turning a category to 0 retains its existing pins for traceability; the reviewer can remove them individually.
- Edit/remove: a Beleg can be removed individually before the decision is recorded (the small remove control next to the snippet). There is no dedup; pinning the same passage twice stores two entries (the reviewer can remove one).
- Surfacing: Belege are saved with the decision in the reviewer file. The decision-log CSV reports an `evidence_count` per paper. The UI labels the source as `Paper` or `LLM`; the record carries the actor separately. Distillate evidence remains advisory and is excluded from the Paper-evidence gate. No model-generated reasoning is preloaded into category evidence.

## Save validation (schema 0.3 record contract)

- The reviewer key is mandatory. It contains two to twelve filename-safe characters, begins with a letter, and is canonicalised to lowercase. This prevents `CP.json` and `cp.json` from becoming separate in-memory tracks for the same Windows file. The canonical filename controls the loaded key; an imported payload cannot redirect a save into another track.
- Category values are `0`, `1`, and `2`. A positive value requires a Paper-evidence pin for that category.
- A final Include requires all method fields defined as required by `analysis_fields.json`. `nicht entscheidbar` is mutually exclusive with substantive codes for the same field.
- `AN_Coding_Basis` is derived from `text_source`. A decision based on the local full text records `Fulltext`; when that basis applies, `AN_Harm_Types` is required.
- Exclude requires a controlled exclusion reason where the derivation or override demands one. An override to Include requires its free-text justification.
- The exact target, connected-folder state, and write result remain visible in a compact status line. The disk icon beside the paper position is the only editor-facing save action. The browser draft remains a recovery aid until the connected file confirms the write.

## Seed dataset (the round-1 data carried through PRISM)

The tool is seeded with the existing review, the round-1 data carried through PRISM as Stage R. The Stage R replay populates the session that the interactive screening pass (R3) continues, so the seed is the first real pass through the gate. A batch captured elsewhere enters over the import seam, a migration path and not the capture default:

| Source file | Provides |
|---|---|
| `docs/data/research_vault_v2.json` | paper metadata, assessment, knowledge summaries |
| `assessment/human_assessment.csv` | binding human decisions |
| `assessment/llm_assessment_10k.csv` | advisory AI decisions (Haiku) |
| `generated/benchmark-results/agreement_metrics.json` | reference agreement figures |

`src/publish/generate_docs_data.py` maps the assessment results and metadata into `docs/data/research_vault_v2.json`, the Stage R seed consumed by PRISM. The canonical round-one replay under `src/replay/` independently reproduces the benchmark and supplies the conformance check for count-bearing claims.

## Was nicht reingehört

Category definitions (canonical in `categories.yaml`), the pipeline that produces the offline AI assessments (in [[methods]]), and the UI that renders this data (in [[specification]], including its design system). This note describes the substrate, not the behaviour.

