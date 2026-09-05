---
title: Data
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: complete
language: en
version: "0.7"
created: 2026-06-09
updated: 2026-09-05
authors: [Christopher Pollin]
generated-with: Claude Code (Claude Opus 4.8), Codex (GPT-6)
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

This document describes the substrate the PRISMA screening tool consumes and produces. The canonical persisted unit is one JSON file per reviewer or consolidated agent track. Schema `femprompt-prisma-reviewer/0.5` adds embedded provenance, immutable annotation versions, deterministic check receipts, and a record-level lifecycle to the version-aware evidence and text-source fields of schema 0.4. Annotations from people and AI agents use the same structural form and retain distinct actor types and roles. The comparative round-1 corpus continues to store the consolidated expert and LLM decisions as sibling fields for replay and divergence analysis. The category schema and inclusion logic come from `assessment/categories.yaml`. What the data means lives here; what the tool does with it lives in [[specification]].

## Category schema (reused, not redefined)

Ten three-level categories (nein/teilweise/ja = 0/1/2), split into two dimensions, with the three-way derivation from [[methods]] (ADR-024). The existing benchmark annotations (human and LLM `all_categories`) stay binary 0/1 and are read as-is; a legacy boolean coerces to ja. A new Paper-Beleg starts an empty category at teilweise and leaves the centrality judgement explicit (ADR-030).

- Technology: `AI_Literacies`, `Generative_KI`, `Prompting`, `KI_Sonstige`
- Social: `Soziale_Arbeit`, `Bias_Ungleichheit`, `Gender`, `Diversitaet`, `Feministisch`, `Fairness`
- Derivation: both dimensions ja yields Include; both at least teilweise yields Unclear; any dimension entirely nein yields Exclude.
- Exclusion reasons (controlled): `Duplicate`, `Not_relevant_topic`, `Wrong_publication_type`, `No_full_text`, `Language`.

Canonical definitions stay in `assessment/categories.yaml`. `src/publish/build_category_schema.py` publishes the frontend projection `docs/data/category_schema.json`, which contains keys, groups, labels, definitions, colours, decision options, and exclusion reasons. PRISM, its CSV converter, the Companion, and the Literature Landscape consume this projection. The repository test compares it with the canonical YAML and blocks schema drift.

## Screening annotation and lifecycle (per paper)

The decision record is the annotation unit. Its substantive fields stay stable when later review events are appended.

```json
{
  "work_id": "work:11111111-1111-5111-8111-111111111111",
  "version_id": "version:11111111-1111-5111-8111-111111111111",
  "version_type": "version_of_record",
  "preferred_version_id": "version:11111111-1111-5111-8111-111111111111",
  "selected_version_is_preferred": true,
  "categories": { "Generative_KI": 2, "Gender": 1 },
  "decision": "Include",
  "reason": null,
  "evidence": { "Gender": [{ "term": "…", "snippet": "…", "source_layer": "paper", "actor": "agent", "work_id": "work:11111111-1111-5111-8111-111111111111", "version_id": "version:11111111-1111-5111-8111-111111111111" }] },
  "text_source": "raw",
  "reviewer": "ar2",
  "actor": "agent",
  "provenance": {
    "annotation_id": "ar2:ABCD1234",
    "annotation_type": "screening_decision",
    "actors": [
      { "id": "curator-1", "type": "person", "roles": ["curation"] },
      { "id": "ai-screening:rr1", "type": "ai_agent", "roles": ["screening"] },
      { "id": "ai-review:ar1", "type": "ai_agent", "roles": ["ai_agent_reviewer"] },
      { "id": "validator-1", "type": "software_agent", "roles": ["validation"] }
    ],
    "activities": [
      {
        "id": "ABCD1234:agent-annotation",
        "type": "screening",
        "run_id": "round2-screening-01",
        "method": "operationally_isolated_agent_screening_with_separate_source_review",
        "prompt": { "status": "recorded", "reference": "prompts/prism-agent-reviewer-v1.1.md#1.1" },
        "model": { "status": "recorded", "reference": "openai:gpt-version" },
        "associated_actor_ids": ["ai-screening:rr1"]
      },
      {
        "id": "ABCD1234:ai-agent-review",
        "type": "ai_agent_review",
        "run_id": "round2-screening-01",
        "method": "source_grounded_ai_agent_review",
        "prompt": { "status": "recorded", "reference": "prompts/prism-ai-agent-review-v0.2.md#0.2" },
        "model": { "status": "recorded", "reference": "openai:gpt-version" },
        "associated_actor_ids": ["ai-review:ar1"]
      }
    ],
    "used_sources": [{ "id": "paper:ABCD1234", "type": "paper", "reference": "ABCD1234", "work_id": "work:11111111-1111-5111-8111-111111111111", "version_id": "version:11111111-1111-5111-8111-111111111111" }],
    "derived_from": [{ "id": "track:rr1", "type": "reviewer_track", "reference": "tests/review-cases/…/rr1.json" }]
  },
  "annotations": [
    {
      "annotation_id": "ar2:ABCD1234",
      "annotation_type": "screening_decision",
      "at": "2026-08-23T11:00:00Z",
      "actor_ids": ["ai-screening:rr1"],
      "body": { "categories": { "Generative_KI": 2, "Gender": 1 }, "decision": "Include", "reason": null, "evidence": { "Gender": [{ "term": "…", "snippet": "…", "source_layer": "paper", "actor": "agent" }] }, "text_source": "raw", "reviewer": "ar2", "actor": "agent" }
    }
  ],
  "active_annotation_id": "ar2:ABCD1234",
  "checks": [
    {
      "check_id": "ABCD1234:lifecycle-contract:1",
      "check_type": "lifecycle_contract",
      "status": "passed",
      "at": "2026-08-23T12:05:00Z",
      "actor_id": "validator-1",
      "tool": { "name": "src.assess.screening_lifecycle", "version": "0.5" },
      "subject": { "annotation_id": "ar2:ABCD1234", "sha256": "1cea52f3989a94bd6d258fcd02031a5529146b70fa6574a25a7738edeaf8f788" }
    }
  ],
  "lifecycle": {
    "baseline": { "state": "curated", "basis": "recorded", "at": "2026-08-23T10:00:00Z", "actor_ids": ["curator-1"] },
    "state": "ai-agent-reviewed",
    "events": [
      {
        "event_id": "ABCD1234:agent-annotation",
        "event_type": "agent_annotation",
        "from": "curated",
        "to": "agent-annotated",
        "at": "2026-08-23T11:00:00Z",
        "activity_id": "ABCD1234:agent-annotation",
        "actor_ids": ["ai-screening:rr1"],
        "result": "completed",
        "annotation_id": "ar2:ABCD1234"
      },
      {
        "event_id": "ABCD1234:ai-agent-review",
        "event_type": "ai_agent_review",
        "from": "agent-annotated",
        "to": "ai-agent-reviewed",
        "at": "2026-08-23T12:00:00Z",
        "activity_id": "ABCD1234:ai-agent-review",
        "actor_ids": ["ai-review:ar1"],
        "result": "accepted",
        "annotation_id": "ar2:ABCD1234"
      }
    ]
  }
}
```

The lifecycle is `identified → curated → agent-annotated → ai-agent-reviewed → verified → publication-approved`. Every transition references registered actors and an activity. AI Agent Review requires an `ai_agent` with the role `ai_agent_reviewer`. Domain-expert verification and publication approval require a `person` actor with the corresponding role. Verification records one of `accepted`, `corrected_and_accepted`, `changes_requested`, or `rejected`. The latter two outcomes append an event while the state remains `ai-agent-reviewed`. A correction appends a complete annotation version with a field-level diff, a reason, a person-attributed timestamp, and `supersedes`; the original AI-agent annotation remains unchanged. Checks belong to a separate `checks` array and require a `software_agent` with the role `validation`. A passed check establishes only the stated structural or rule conformance. A migrated record may begin with a `curated` baseline whose `basis` is `legacy_import`. Missing historical details use an explicit `legacy_gap` capture with the value `unrecorded`. Fields that do not apply to a person-led activity use `not_applicable` rather than a fabricated model value.

An expert correction is an additional annotation. It never overwrites the preceding version:

```json
{
  "annotation_id": "expert:ABCD1234:correction-1",
  "annotation_type": "domain_expert_correction",
  "supersedes": "ar2:ABCD1234",
  "at": "2026-09-15T10:30:00+02:00",
  "actor_ids": ["domain-expert:01"],
  "reason": "The evidence supports a narrower category assignment.",
  "changes": [
    { "path": "/categories/Gender", "before": 2, "after": 1 }
  ],
  "body": { "description": "The complete corrected annotation body is stored here." }
}
```

The abbreviated `body` in this documentation block stands for the full effective annotation. Productive records may not store a partial correction body.

The model is compatible with W3C provenance concepts while JSON remains canonical. The annotation is a PROV Entity and W3C Web Annotation. `actors` correspond to PROV Agents, `activities` to PROV Activities, `used_sources` to source entities used by an activity, and `derived_from` to derivation relations. A JSON-LD projection may map these fields later. The project does not maintain a second annotation registry.

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

The v3 single-blob format, kept only as a description of the earlier export shape. The built tool does not write this; it persists one file per reviewer (schema 0.4 for new captures, see "Per-reviewer files" below) and exports that file plus a decision-log CSV.

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
// docs/data/screening/<reviewer>.json  (0.4 version-aware capture before lifecycle projection)
{
  "schema": "femprompt-prisma-reviewer/0.4",
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
          { "term": "gendered scripts", "snippet": "...agents reproduce gendered scripts of care...", "ts": "...", "origin": "human", "source_layer": "paper", "actor": "human", "work_id": "work:…", "version_id": "version:…" }
        ]
      },
      "ts": "...", "reviewer": "sss", "actor": "human",
      "text_source": "raw",
      "work_id": "work:…",
      "version_id": "version:…",
      "version_type": "version_of_record",
      "preferred_version_id": "version:…",
      "selected_version_is_preferred": true
    }
  }
}
```

The `evidence` map (added in schema 0.2, FR-13) is the v4 core: per category, a list of pinned Belege, each a `term` plus the surrounding `snippet` taken from the read document at screening time. New records separate source and actor: `source_layer` is `paper` or `llm_distillate`, while `actor` is `human` or `agent`. The legacy `origin` value remains additive for backward compatibility and maps `human` to the Paper layer and `ai` to the distillate layer. A 0.1 record without `evidence` loads as a record with no evidence; old Belege without provenance load as Paper evidence (ADR-030).

`text_source` (added in schema 0.3, ADR-027) records the paper-layer text the decision was taken on, `raw` for the local Docling full text, `abstract` when only the abstract was shown, `none` when no text was available; a 0.1 or 0.2 record without the field loads unchanged and counts as unrecorded in the disclosure's per-source line (PRISMA-trAIce M4). The decision-log CSV carries the same value per row.

Schema 0.4 adds the stable Work identity and the exact Version used for the decision. Every new Paper Beleg repeats `work_id` and `version_id`. Historical reviewer files remain readable. When the Excel migration bridge runs against the loaded corpus, it resolves each Zotero key through the current Work-Version projection and writes schema 0.4. Offline migrations without that mapping retain historical schema 0.3 and acquire their version binding when they pass through PRISM.

The `decision` follows the three-level rule. Include requires at least one category at level 2 in each dimension. Unclear requires at least level 1 in each dimension without meeting Include. Exclude follows when one dimension remains empty. The active reviewer may override the derivation in either direction. An override to Include records a free-text `override_reason`, and an override to Exclude carries the exclusion `reason` (O2, ADR-023; RAISE P3). A category toggle that flips the derivation clears a stale override. The consolidated expert record retains corpus authority for round one. Round-two agent decisions require later domain-expert verification.

Aggregation loads every `*.json` in the folder into `reviewers[key]`. The explicitly selected reviewer role determines the reviewer side of the Flow. The earlier expert assessment (`paper.human`) and the model proposal (`paper.llm`) come from the corpus and are never stored in a reviewer file. Both stay hidden until the selected reviewer has saved an isolated decision; they then become available as collapsed reference material.

Versioning uses Git outside PRISM. Schema 0.4 is the version-aware isolated capture shape for new reviewer exports. A productive agent track is projected to schema 0.5 after the separate source-grounded AI Agent Review. The file `ar2.json` is append-only at the record level. A merge accepts new IDs, treats identical repeated input as idempotent, and rejects a divergent overwrite. Productive records carry `actor: agent` with their run-specific provenance and may reach `ai-agent-reviewed`. This state establishes operational completion and supports internal analysis. Domain-expert verification and publication approval require later person-attributed events.

## Current intake and screening gates

`generated/agent-screening-queue.json` derives work-level coverage from the committed corpus, productive screening files, and the reviewed full-text manifest. Human coverage and governed AI-agent coverage apply to every alias of the same identified work. Each uncovered work carries its available text basis and a readiness reason. The queue blocks screening before an agent receives a source when reviewed Paper Markdown is absent. This state can identify a missing binding or conversion even when a PDF exists elsewhere.

`generated/round2-intake.json` audits the committed round-2 RIS lanes before productive screening. Three separately executed agent reviews record identity relations, bibliographic conflicts, and available source versions. `generated/round2-intake-package.json` joins those findings with the canonical registry and classifies every candidate as already curated, import-ready, needing review, or blocked. Only import-ready records enter `generated/round2-zotero-import.ris`. Zotero import, conflict resolution, curated re-export, and Markdown review remain operator actions. The generated manifests carry the current counts.

The dated supplement under `corpus/deep-research/round2/contextual-update-2026-08-24/` uses one shared lane schema for its three searches. `src/analysis/build_contextual_update_package.py` deduplicates Tier-A candidates across lanes and writes `generated/contextual-update-2026-08-24-intake-package.json` plus the corresponding Zotero RIS file. Each generated record retains its source lanes, bibliographic and access evidence, relation to an existing Work where applicable, and position relative to the original round-two publication window. The package lifecycle state is `identified`; Zotero import does not change the screening status.

`corpus/deep-research/round2/Codex Websearch/` is the self-contained 2026-only expansion. `src/analysis/build_codex_websearch_2026.py` reads the three complete lane files, restricts selected Versions to the declared 2026 cutoff, deduplicates Tier-A records, checks the committed Zotero export, and writes the package, RIS, and bibliographic audit inside that directory. The audit distinguishes blocking identity conflicts from explicit metadata gaps such as an unassigned DOI, unavailable full-text URL, or item-specific peer-review evidence that could not be established. Its counts and per-record states are the current authority for the later import.

The package is enriched by three source-check partitions before acquisition. `source-acquisition-plan.json` distinguishes the preferred bibliographic Version from every recorded full-text option, while `source-recovery-audit.json` retains alternative sources found after an automated endpoint fails. The runtime manifests record the option actually acquired, its exact Version relation, checksum, response validation, and failed alternatives. A complete repository HTML article is a valid local representation when its provenance and extraction are recorded with the same controls as a PDF conversion. `generated/source-acquisition/codex-websearch-2026/source-readiness.json` joins acquisition, the latest deterministic Markdown validation, direct agent source-Markdown QC, separate repairs, and visual-evidence limitations. It verifies every available source, screening Markdown, repair, manifest, and visual-asset checksum before granting readiness. Third-party PDF binaries and raw HTML captures remain local and ignored by Git. A fresh clone reproduces their preparation state from the acquisition manifests' previously verified hashes while requiring the versioned Markdown and visual assets to remain present. Source readiness means that a prepared representation can enter screening after identity binding; it does not establish inclusion, domain-expert verification, or publication approval.

## Published Companion records and work identity

`src/publish/generate_docs_data.py` writes `docs/data/research_vault_v2.json` through an atomic replacement. Its `source_fingerprint` hashes every canonical input and replaces a wall-clock generation timestamp. Unchanged sources therefore produce byte-identical output.

`corpus/work_version_registry.json` is the canonical identity layer. Each Work carries a stable internal `work_id`; each known publication expression carries a stable `version_id`, a controlled `version_type`, identifiers, dates, access and integrity states, peer-review status and basis, relations, and provenance. `record_index` binds every Zotero record to one Work and one exact Version. `candidate_index` performs the same function for round-two intake records.

The registry distinguishes `preferred_version_id` from `latest_version_id`. The preferred version is the highest-ranked available publication stage that is not withdrawn or retracted. The latest version is selected by recorded date. The distinction avoids treating chronological recency as publication authority. Version of Record and corrected Version of Record are preferred over manuscripts and Preprints when available. All known versions remain addressable. Peer-review status is stored separately because publication stage alone is not a quality judgement.

`record_index` retains the bibliographic Version when a different accepted manuscript was actually read. The governed [source-binding manifest](../corpus/source_version_bindings.json) adds `source_index` and the corpus field `source_binding`, with exact source path/hash and source Version. Fulltext manifests and published quotations use that source Version while retaining `bibliographic_version_id` separately. Work-wide source holds restrict current synthesis even when a historical Include or earlier accepted review remains recorded.

Manifest 0.2 additionally supports `binding_mode: existing_version`: source and bibliographic Version must already be identical. It adds no Work, Version, identifier or relation. Both reviewed titles and the DOI or arXiv identity must match the registry; arXiv sources require an exact revision such as `v2`, since the arXiv DOI alone identifies no revision. Bound text quotations establish title and revision, and all source-QC evidence is hash-checked. The original manuscript-addition contract remains compatible.

An agent-run assignment can bind original visual reading material in `source.assets`: repository PNG path and byte hash, `media_type`, page/figure locator, original source URL, declared original-PDF hash and `CC-BY-4.0` license. The run validator checks the PNG itself and safe path in every run state; the original PDF digest is retained provenance and is not re-verified when that local PDF is absent. Both isolated reviewers must inspect all assigned assets. Their category evidence remains a text quotation; these reading assets do not introduce image-based PRISM annotation pins. The source-QC report distinguishes visual inspection, text completeness and unresolved source-internal inconsistencies.

Every corpus record carries the canonical identity plus `legacy_work_id` for migration. Duplicate Zotero records of one Work remain distinct records. Screening coverage applies once at Work level. The full-text manifest, PRISM evidence, run manifests, Grounded Vault distillates, public publication records, and Assertions retain the exact Version used. The controlled vocabulary and selection rule live in `docs/data/work_version_contract.json`.

`knowledge_coverage` records why a paper does or does not expose a knowledge document.

- `linked` identifies a published document link.
- `fulltext_ready` identifies a safely bound full text whose document link is still absent.
- `identity_unresolved` identifies an ambiguous or conflicting source identity.
- `source_missing` identifies a record without a safely bound source.

The metadata reports record links and distinct document paths separately. The Companion header uses both values so a duplicated record does not look like an additional knowledge document.

These are availability measures for the historical working collection. `linked` does not mean that a distillate has a current source-review receipt, belongs to the active Vault, supports an Assertion or is eligible for SQ analysis. Bibliographic identity corrections can invalidate a same-title legacy knowledge document without suppressing a separately verified exact fulltext. [The Vault coverage guide](research-vault.md#aktueller-implementierungsstand) separates archive links, active Assertions, screening and whole-corpus readiness.

## Wissensdokument-Abdeckung

Der Companion zählt Korpusrecords mit einem nichtleeren `knowledge_doc`-Verweis und weist die Zahl unterschiedlicher Dokumentpfade separat aus. Mehrere Zotero-Records können dasselbe Werk und dieselbe Datei referenzieren. Die aktuellen Werte stehen ausschließlich in `docs/data/research_vault_v2.json > meta`; dieser Vertragstext wiederholt keine veränderlichen Bestandszahlen.

`generate_docs_data.py` löst Dateinamen case-insensitiv auf, veröffentlicht die tatsächliche Schreibweise und verwirft mehrdeutige Matches. Nach der Publikation entfernt es Seiten unter `docs/vault/Papers/`, auf die kein aktueller Record verweist. Repository-Tests prüfen die exakte Dateischreibweise und die interne Konsistenz der Abdeckungszustände.

`docs/data/knowledge_doc_bindings.json` hält ausschließlich explizit verifizierte Zuordnungen zwischen Records, Volltextquellen und veröffentlichten Wissensdokumenten. Titelkonflikte und mehrdeutige Quellenidentitäten bleiben gesperrt. Fuzzy Titel- oder Autor-Jahr-Matches sind Kandidaten für eine manuelle Klärung und erzeugen keinen veröffentlichten Link.

## Published literature landscape

`src/publish/generate_literature_landscape.py` joins the productive PRISM track with the corpus metadata and writes `docs/data/literature_landscape.json`. The public artifact follows the explicit `config/publication_policy.json`; the authorised preliminary release admits source-bound AI-reviewed records with attributed artifact/source-hash-bound review receipts. It preserves their actual lifecycle status and excludes raw full text and browser-only recovery state.

The generator is a fail-closed publication checkpoint. Without an explicit policy it requires `publication-approved`; the preliminary policy instead checks the exact AI review receipt, source identity and integrity holds. A release-eligible record still fails the build when it has an unknown Paper ID, an unknown category, a category value outside the vocabulary, a positive category without Paper evidence, or an incomplete Include analysis. Human approval claims additionally require a valid final approval event. The output reports the source-annotation total and the withheld total separately; preliminary AI review is never presented as domain-expert verification.

The Literature Landscape uses only Include records for thematic aggregation. Exclude and Unclear remain part of the progress summary. Category combinations are multi-valued co-occurrences, and the analysis fields retain their multi-select semantics. Every matrix cell and profile value resolves to the supporting papers, their analysis fields, and the stored Paper evidence.

## Reading text source and corpus search (v4, as built)

What the screening view reads and searches, and what it deliberately does not.

| What | Where | Note |
|---|---|---|
| Reading text (Volltext layer) | `docs/data/fulltext/{id}.md` via `fetchFullText`, listed in `fulltext_manifest.json` | the cleaned Docling full text, built by `src/publish/build_fulltext.py`; local clone only, gitignored (ADR-025). Current coverage is derived from the manifest. |
| LLM-Wissensdestillat layer | the generated distillation from `paper.knowledge_doc` (`## Kernbefund` onward) | shown as a separate reference layer and excluded from the Paper-evidence gate (ADR-016/028/029/030) |
| Abstract fallback | `paper.abstract` in `research_vault_v2.json` | used when no full text exists; not every paper has an abstract |
| Corpus search index | `docs/data/fulltext_index.json` (built by `src/publish/build_screening_index.py`) | stays distillation-based, not the full text, for the same copyright reason |

The raw Docling full texts live in `generated/markdown_clean/` and hold copyrighted, paywalled papers. `build_fulltext.py` cleans them (frontmatter, image comments, GLYPH artefacts) into `docs/data/fulltext/`, which is gitignored and never pushed; the public Pages site keeps only the fallback. Publishing the full texts publicly is outward-facing and a separate, rights-gated decision (ADR-025).

The screening view fetches the full text and the knowledge document together (`loadReadingInto`). The Volltext layer renders the paper with the built-in Markdown renderer; the `LLM-Wissensdestillat` layer renders the generated distillation from `## Kernbefund` onward. In-text search runs over the active document; corpus-wide search runs over `fulltext_index.json`. The model proposal (`paper.llm`) is separate from both reading layers and stays hidden until the isolated decision is saved. The layer a snippet is pinned from sets `source_layer`; the configured run sets `actor` independently (ADR-030).

The built contract is ADR-025 plus ADR-027: `build_fulltext.py` writes the local reading layer under `docs/data/fulltext/`; PRISM reads it through `fulltext_manifest.json`, falls back to the metadata abstract, and records `raw`, `abstract`, or `none` in `text_source`. The knowledge-document distillate never becomes the Paper layer. An earlier paper-lane design with browser-side title-prefix matching and a `knowledge_doc` text-source value is superseded. The folder picker may target the repository root; PRISM resolves or creates `docs/data/screening/` below it. Publishing local full texts remains a separate rights-gated decision.

## Evidence behaviour (FR-13 contract, as built)

How a pinned Beleg is created, stored, and surfaced. This is the contract the reviewer-file writer and the UI both follow.

- Trigger: selecting a passage in the reading column (2 to 400 chars), or pressing "Treffer anheften" on the active in-text search hit. A category menu opens; choosing a category pins.
- Stored shape: `evidence[category]` is a list of `{ term, snippet, ts, origin, source_layer, actor, work_id, version_id }` for new Paper evidence. `term` is the selected text or the search query, trimmed to 80 chars. `snippet` is the surrounding context, trimmed to 260 chars. `ts` is an ISO timestamp. `source_layer` records Paper or LLM-Wissensdestillat; `actor` records person or agent. `work_id` and `version_id` identify the exact Paper expression. `origin` remains the legacy compatibility field.
- Coupling: pinning a Paper-Beleg on an empty category sets `categories[category] = 1`. The reviewer promotes it explicitly to 2 when the paper treats the aspect centrally. A pin from the LLM-Wissensdestillat never sets or satisfies a category. Every category at level 1 or 2 needs at least one Paper pin before the decision can be saved. Turning a category to 0 retains its existing pins for traceability; the reviewer can remove them individually.
- Edit/remove: a Beleg can be removed individually before the decision is recorded (the small remove control next to the snippet). There is no dedup; pinning the same passage twice stores two entries (the reviewer can remove one).
- Surfacing: Belege are saved with the decision in the reviewer file. The decision-log CSV reports an `evidence_count` per paper. The UI labels the source as `Paper` or `LLM`; the record carries the actor separately. Distillate evidence remains advisory and is excluded from the Paper-evidence gate. No model-generated reasoning is preloaded into category evidence.

## Save validation (schema 0.4 capture and schema 0.5 lifecycle contract)

- The reviewer key is mandatory. It contains two to twelve filename-safe characters, begins with a letter, and is canonicalised to lowercase. This prevents `CP.json` and `cp.json` from becoming separate in-memory tracks for the same Windows file. The canonical filename controls the loaded key; an imported payload cannot redirect a save into another track.
- Category values are `0`, `1`, and `2`. A positive value requires a Paper-evidence pin for that category.
- A final Include requires all method fields defined as required by `analysis_fields.json`. `nicht entscheidbar` is mutually exclusive with substantive codes for the same field.
- `AN_Coding_Basis` is derived from `text_source`. A decision based on the local full text records `Fulltext`; when that basis applies, `AN_Harm_Types` is required.
- Exclude requires a controlled exclusion reason where the derivation or override demands one. An override to Include requires its free-text justification.
- The exact target, connected-folder state, and write result remain visible in a compact status line. The disk icon beside the paper position is the only editor-facing save action. The browser draft remains a recovery aid until the connected file confirms the write.

## Seed dataset (the round-1 data carried through PRISM)

The tool is seeded with the existing review and the round-one data carried through PRISM. The seed preserves the comparative expert and LLM tracks for replay. New round-two records enter through governed reviewer files and the validated import seam before their lifecycle state is evaluated:

| Source file | Provides |
|---|---|
| `docs/data/research_vault_v2.json` | paper metadata, assessment, knowledge summaries |
| `assessment/human_assessment.csv` | consolidated expert decisions for round one |
| `assessment/llm_assessment_10k.csv` | advisory AI decisions (Haiku) |
| `generated/benchmark-results/agreement_metrics.json` | reference agreement figures |

`src/publish/generate_docs_data.py` maps the assessment results and metadata into `docs/data/research_vault_v2.json`, the seed consumed by PRISM. The canonical round-one replay under `src/replay/` deterministically reproduces the benchmark and supplies the conformance check for count-bearing claims.

## Document boundary

Category definitions remain canonical in `categories.yaml`. [[methods]] describes the assessment pipeline, while [[specification]] describes the interface and its design system. This document defines the data substrate shared by both.
