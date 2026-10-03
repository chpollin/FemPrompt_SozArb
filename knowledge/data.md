---
title: Data
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: complete
language: en
version: "0.7"
created: 2026-06-09
updated: 2026-10-03
authors: [Christopher Pollin]
generated-with: Claude Code (Claude Opus 4.8), Codex (GPT-6), Claude Code (Claude Opus 5.5)
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
template:
  name: Vorlage Datengrundlage
  version: 0.1
  url: https://dhcraft.org/Promptotyping/promptotyping-document/data
  alias: https://dhcraft.org/Promptotyping/#promptotyping-document-data
topics: ["[[Data Modelling]]"]
related: [specification, methods, standards, governance, research-vault]
---

This document describes the substrate the PRISMA screening tool consumes and produces. The canonical persisted unit is one JSON file per reviewer or consolidated agent track. Schema `femprompt-prisma-reviewer/0.5` adds embedded provenance, immutable annotation versions, deterministic check receipts, and a record-level lifecycle to the version-aware evidence and text-source fields of schema 0.4. Annotations from people and AI agents use the same structural form and retain distinct actor types and roles. The comparative round-1 corpus continues to store the consolidated expert and LLM decisions as sibling fields for replay and divergence analysis. The category schema and inclusion logic come from `assessment/categories.yaml`. What the data means lives here; what the tool does with it lives in [[specification]].

## Local source preservation

Current acquisition uses the documented source stores under `generated/`. The local `pipeline/` tree also retains historical PDFs, conversion images and validation records. Source-review records under `generated/source-acquisition/completion-20260921/` still name concrete `pipeline/pdfs/` paths. Those paths remain valid evidence locations until a deliberate migration updates their provenance. The folder's exclusion from Git does not make its contents disposable.

Local sources recovered from retired worktrees retain their established relative paths under `generated/pdfs/` and `generated/source-acquisition/`. Historical reading projections, temporary acquisition material, visual inspection outputs and earlier benchmark logs are preserved under the ignored `generated/local-source-preservation/` tree. That tree lies outside the publisher's input patterns and the result-site allowlist. Retaining a file there grants no source binding, screening readiness or review authority.

The private preservation inventory is under `refactor-preservation/` in the directory returned by `git rev-parse --git-common-dir`. It records original paths, destinations, byte sizes and SHA-256 comparisons. Credentials remain at their original local location and are excluded from the file inventory. The consolidation recorded in [[journal]] preserved source bytes before retiring the worktrees.

## External metadata quality

Zotero exports and other external records can carry HTML markup in titles, unnormalised creator names and missing or wrong years, and a record can bind a text whose authors differ from its metadata. Matching therefore uses the established cascade with stable keys, never a title alone, and a metadata defect is corrected through the hash-bound correction contract, not in a projection.

## File naming and path length

Every tracked repository-relative path stays at 120 characters or less, so a clone root of up to 139 characters remains below the Windows limit of 260 characters without `core.longpaths`. `tests/test_path_length.py` fails when a tracked path exceeds the limit and runs with `npm run check`.

Python reads and writes text as UTF-8 with explicit encoding, since the Windows default code page CP1252 corrupts non-ASCII titles and quotations.

File names derived from a title or an author-year-title label go through `src/file_naming.py`. Characters Windows forbids become hyphens. A stem of more than 72 characters keeps its prefix up to a word boundary and ends with a hyphen and the first six hexadecimal digits of the SHA-256 of the case-folded full stem. The rule is deterministic, so `generate_docs_data.py` still finds a legacy knowledge document under `docs/vault/Papers/` from the current title, and titles that share a long prefix stay distinct. `generate_vault_v2.py` and `download_zotero_pdfs.py` apply the same rule to paper notes and acquisition stems.

The renames that brought the existing tree under the limit are recorded in `corpus/path_migration_2026-10-01.json`. Renamed paper notes are byte-identical, so the path and SHA-256 bindings in `corpus/knowledge_document_recovery.json` and `docs/data/knowledge_doc_bindings.json` changed only in their path fields. Three historical acquisition stems that no full-text manifest binds were renamed across their Markdown, distillate, verification and Research Vault files. `source_file` values that name local PDFs under `pipeline/pdfs/` keep the original acquisition filename. Acquisition stems bound by the full-text manifest keep their names, because knowledge documents embed them as source identity. Visual-evidence images use the short form `pNNN-t<table>-<label>.png`.

## Preparation evidence

The completion package resolves intake candidates through exact identifiers of the selected bibliographic Version. Historical Zotero matches can originate in title comparison, so they only confirm an identifier binding or expose a conflicting Version. Observed library membership remains separate from accepted bibliographic binding and checked reading-source readiness. The projection retains ambiguous matches as diagnostic candidates and records accepted binding evidence separately.

The literature-readiness inventory retains the recorded conversion reviewer, receipt time, scope, source paths and hashes alongside the conversion result. Its JSON and CSV projections expose the same recorded review evidence. These fields describe the existing receipt and grant no new review authority.

## Category schema (reused, not redefined)

Corpus membership comes from `corpus/zotero_export.json`, including records without a benchmark annotation. The historical raw records remain immutable inputs to the hash-bound metadata corrections. Later live records are appended. `corpus/zotero_sync.json` identifies the observed live group membership and confirmed historical aliases, so the corpus and live library have explicit, different denominators. The Work-Version registry preserves established identities when it admits these aliases.

PRISM projects unassessed categories as null and leaves the decision empty. Historical benchmark annotations retain their original category values and recorded authorship. An existing human annotation that becomes addressable after a live import remains a human annotation. Corpus membership alone adds no screening decision. The benchmark comparison continues to use its original assessed subset.

Historical knowledge-document titles only identify candidates. Publication requires a matching embedded source filename and exact manifest identity. Rejected candidates retain their diagnostic reasons. Hash-bound recoveries and active preparation distillates use their respective source contracts. `generated/literature-readiness.json` reports missing source material and knowledge documents separately from the technical ability to annotate an available abstract.

Ten three-level categories (nein/teilweise/ja = 0/1/2), split into two dimensions, with the three-way derivation from [[methods]] (ADR-024). The existing benchmark annotations (human and LLM `all_categories`) stay binary 0/1 and are read as-is; a legacy boolean coerces to ja. A new Paper-Beleg starts an empty category at teilweise and leaves the centrality judgement explicit (ADR-030).

- Technology: `AI_Literacies`, `Generative_KI`, `Prompting`, `KI_Sonstige`
- Social: `Soziale_Arbeit`, `Bias_Ungleichheit`, `Gender`, `Diversitaet`, `Feministisch`, `Fairness`
- Derivation: both dimensions ja yields Include; both at least teilweise yields Unclear; any dimension entirely nein yields Exclude.
- Exclusion reasons (controlled): `Duplicate`, `Not_relevant_topic`, `Wrong_publication_type`, `No_full_text`, `Language`, and `Consolidated_expert_exclusion`. The last one confirms a consolidated expert Exclude in PRISM without a substantive reason of its own (ADR-042) and is offered only on a draft seeded from the expert decision.

Canonical definitions stay in `assessment/categories.yaml`. `src/publish/build_category_schema.py` publishes the frontend projection `docs/data/category_schema.json`, which contains keys, groups, labels, definitions, colours, decision options, exclusion reasons and their German display labels (`exclusion_reason_labels`). Stored records always use the codes. PRISM, its CSV converter, the Companion, and the Literature Landscape consume this projection. The repository test compares it with the canonical YAML and blocks schema drift.

## Bibliographic correction and provenance projections

`corpus/zotero_export.json` remains the historical input. `corpus/metadata_corrections.json` applies reviewed field changes through original-record hashes, exact before values and source hashes. Bibliographic evidence for the 3 October 2026 curation lives under `corpus/source-acquisition/zotero-curation-2026-10-03/`. Private whole-library snapshots and notes remain outside Git. The live verification receipt establishes which external operation was read back without treating all remaining records as bibliographically verified.

The correction contract supports Zotero's native `proceedingsTitle`, `institution`, `university`, `volume`, `issue` and `pages` fields. Container projection prefers the field appropriate to the current document type, then retains legacy fallback behavior. A type change preserves the original export fields as historical data and uses the corrected type for display. Every correction retains its reviewing actor and evidence. Local identifier enrichment is explicitly deferred where it would silently combine established Work/Version identities. A correct identifier in Zotero therefore does not imply that the historical research registry has been migrated. `deferred_metadata_enrichments` likewise preserves verified live identity-field enrichments that would invalidate historical knowledge links, candidate links or explicit recovery contracts, including their same-Version aliases. These local deferrals keep the original historical projection and the corrected live bibliography distinct.

`corpus/source_version_bindings.json` retains the original source hashes, identities and identity-check values required by immutable AI-review receipts. Candidate rechecks against corrected metadata are preserved separately in `source-rechecks.json`. Where a changed check would invalidate those historical receipts, the corresponding local metadata enrichment is deferred. The validators and historical receipts remain unchanged. A genuine source-version mismatch becomes an evidence-bound synthesis hold in the historical-resolution contract. The selected arXiv record for *Towards a Feminist Metaethics of AI* remains separate from its currently bound ACM conference text until their expression relationship has been reconciled.

`corpus/source_tool_mapping.json` preserves the legacy mappings consumed by historical replay. Its `documented_item_provenance` and `confirmed_source_tool_mapping` fields record the current evidenced discovery paths, allowing several systems per record. `inferred_source_tool_mapping` preserves the earlier title-based inference separately. Current collection names, historical names, source-access dates and established search runs have distinct fields. Current provenance is not retroactively substituted into the historical PRISMA replay. A later consumer change must explicitly select the documented provenance and preserve the original research-round boundaries.

## Analysis vocabulary projection

`src/publish/build_analysis_fields.py` projects the frozen `analysis_fields` and `study_types` of `assessment/categories.yaml` into `docs/data/analysis_fields.json`. Each field carries `name`, `multi` and `values` and, as presentation metadata, a German `label` and `definition` together with `value_labels` and `value_definitions` keyed by the controlled value. The study types remain the `study_types` list for existing consumers and additionally form a `study_type` object shaped like a field. Labels and definitions come from the `analysis_presentation` block of the YAML. They are presentation only, and stored or exported coding always uses the controlled value. The projection fails when a field or value lacks a label or definition, or when an entry names a field or value outside the vocabulary.

`docs/data/assertion_index.json` carries for each released Assertion `research_questions`, the sorted sub-questions of its frontmatter field `research-questions` ([[research-vault#Assertions]]). An Assertion without the field exports an empty list.

`src/publish/build_assertion_map.py` writes the local working file `docs/data/assertions_working.json` (schema `femprompt-assertion-working/0.1`) for the Argumentkarte of the working Companion. It holds every document of type `assertion` in `research-vault/30_assertions/`, drafts included, with `id`, `ref`, `title`, `statement`, `status`, `released`, `research_questions`, `contested_with` and `works`. `released` is true exactly for the Assertions of the released index, which the build writes first. `contested_with` is the symmetric closure of the frontmatter field, so an entry recorded on one side marks both Assertions. `works` follows each grounding link to its distillate and maps the distillate's `record-id` to the record in `docs/data/promptotyping_v2.json` for `work_id`, title and author-year, one entry per record. The file is git-ignored like the reading layer, rebuilt by `npm run build`, listed among the build outputs so `npm run check` verifies it, and excluded from `build/site/` by the allowlist ([[governance#Publication boundary]]).

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
  "decision": "Unclear",
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
      "body": { "categories": { "Generative_KI": 2, "Gender": 1 }, "decision": "Unclear", "reason": null, "evidence": { "Gender": [{ "term": "…", "snippet": "…", "source_layer": "paper", "actor": "agent" }] }, "text_source": "raw", "reviewer": "ar2", "actor": "agent" }
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

The shipped tool persists not as one session blob but as one JSON per reviewer under `docs/data/screening/`, so version control is the sync layer (see ADR-009, ADR-010). An editor enters a short key once, connects the project folder, and uses one disk action to save the complete paper record. The File System Access API writes the selected reviewer's file; localStorage preserves an unsaved recovery copy and never silently overwrites a conflicting disk record. GitHub Desktop handles versioning outside PRISM. The daily editor surface has no import workflow; the operator-only converter accepts screening records as a controlled migration seam and does not import analysis fields.

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

Aggregation loads every `*.json` in the folder into `reviewers[key]`, except the reviewer assignment `assignment.json`. The explicitly selected reviewer role determines the reviewer side of the Flow. The earlier expert assessment (`paper.human`) and the model proposal (`paper.llm`) come from the corpus. The model proposal is never stored in a reviewer file and is not shown in human sessions (ADR-044). The expert decision seeds the draft of a paper without an own record (ADR-042). The productive agent track is loaded for reconciliation and diagnostics only and never seeds or colours a human session (ADR-044). Its binary values map 1 to ja and 0 or null to nein, the decision is taken over as it stands with an override where the derivation rule disagrees, and an expert Exclude carries `Consolidated_expert_exclusion`. Agent runs receive neither.

### Human records written by PRISM (ADR-042)

A record PRISM writes for a person carries the embedded contract of schema 0.5, and a file whose records all carry it is written as `femprompt-prisma-reviewer/0.5`. Agent trial exports and historical files without the contract keep 0.4.

- `provenance` names the reviewer key as a `person` actor with the role `screening`, one screening activity with the session identifier as `run_id`, `prompt` and `model` as `not_applicable`, and the Paper with its Work and Version as used source.
- A record seeded from the expert decision lists in `provenance.derived_from` an item `{ id: "expert:<paperId>", type: "consolidated_expert_assessment", reference: "docs/data/research_vault_v2.json#<paperId>.human", mapping: "1=ja", sha256 }`, where `sha256` is the corpus source fingerprint of `research_vault_v2.json` when the page has it. Its activity method is `prism_confirmation_of_consolidated_expert_assessment`.
- `evidence_basis` maps a category to `expert_assessment` when its level was taken over unchanged from the expert decision without a Paper pin, or to `formal_exclusion` when it was set on an Exclude for a formal reason without a Paper pin (ADR-048). Such a category satisfies the evidence gate, a `formal_exclusion` category only while the record stays a formal exclusion, and it does not count as a judged category in the Korpus view. Any other level needs a Paper pin. The formal reasons are marked `formal: true` in `assessment/categories.yaml` and projected as `formal_exclusion_reasons`.
- `annotations` holds the record body once, `checks` is empty, and `lifecycle` starts from a `curated` baseline with the basis `legacy_import` for an expert seed and `recorded` otherwise, with no events. A human screening record is never `verified`. Verification applies to agent records only, and PRISM no longer records it (ADR-044).

Verification entries written by earlier builds remain readable and are written back unchanged. Such an entry over an agent record carries `reviewer_id` and `actor_ids` from the reviewer key and one `activity_id` per editing session. Its `note` is required for `changes_requested` and `rejected` and optional for `accepted` and `corrected_and_accepted`. A correction body is built from the panel and replaces only the fields the reviewer changed. Without a note the correction names its changed paths as its reason, because the lifecycle contract requires a reason.

Versioning uses Git outside PRISM. Schema 0.4 is the version-aware isolated capture shape for new reviewer exports. A productive agent track is projected to schema 0.5 after the separate source-grounded AI Agent Review. The file `ar2.json` is append-only at the record level. A merge accepts new IDs, treats identical repeated input as idempotent, and rejects a divergent overwrite. Productive records carry `actor: agent` with their run-specific provenance and may reach `ai-agent-reviewed`. This state establishes operational completion and supports internal analysis. Domain-expert verification and publication approval require later person-attributed events.

### Reviewer assignment

`docs/data/screening/assignment.json` splits the open documents between the two reviewers (ADR-043). It is written only by `src/assess/build_assignment.py` and read by PRISM for the list filter `Zuteilung`. PRISM never writes it, and `assignment` is a reserved reviewer key.

```json
{
  "schema": "femprompt-prisma-assignment/1.0",
  "reviewers": [{ "key": "<reviewer key>", "label": "<display label>" }],
  "assigned_on": "2026-10-01",
  "updated_on": "<date of the latest run that added entries, absent before>",
  "rule": "<the assignment rule as text>",
  "assignments": { "<paperId>": "<reviewer key>" }
}
```

- Open means what PRISM counts as not done for every reviewer, neither a decision of the consolidated expert assessment nor a record or verification in a human reviewer file. An open paper with a record in an agent track belongs to the group `agent`, every other open paper to the group `unassessed`.
- Within each group the papers alternate between the reviewers in corpus order, and each group starts with the reviewer holding fewer entries, ties following the order of `reviewers`.
- Entries are append-only. A rerun adds open papers without an entry, never changes an existing one and keeps the entries of papers that have been done since. An entry naming a key outside `reviewers` makes the builder fail and is ignored by PRISM.
- `schemas/femprompt-prisma-assignment-1.0.schema.json` describes the file, and a test compares the committed file with a fresh build, so a corpus that gains open papers shows up as a failing check until the builder is rerun.

## Current intake and screening gates

`generated/agent-screening-queue.json` derives work-level coverage from the committed corpus, productive screening files, and the reviewed full-text manifest. Human coverage and governed AI-agent coverage apply to every alias of the same identified work. Each uncovered work carries its available text basis and a readiness reason. The queue blocks screening before an agent receives a source when reviewed Paper Markdown is absent. This state can identify a missing binding or conversion even when a PDF exists elsewhere.

`generated/round2-intake.json` audits the committed round-2 RIS lanes before productive screening. Three separately executed agent reviews record identity relations, bibliographic conflicts, and available source versions. `generated/round2-intake-package.json` joins those findings with the canonical registry and classifies every candidate as already curated, import-ready, needing review, or blocked. Only import-ready records enter `generated/round2-zotero-import.ris`. Zotero import, conflict resolution, curated re-export, and Markdown review remain operator actions. The generated manifests carry the current counts.

The dated supplement under `corpus/deep-research/round2/contextual-update-2026-08-24/` uses one shared lane schema for its three searches. `src/analysis/build_contextual_update_package.py` deduplicates Tier-A candidates across lanes and writes `generated/contextual-update-2026-08-24-intake-package.json` plus the corresponding Zotero RIS file. Each generated record retains its source lanes, bibliographic and access evidence, relation to an existing Work where applicable, and position relative to the original round-two publication window. The package lifecycle state is `identified`; Zotero import does not change the screening status.

`corpus/deep-research/round2/Codex Websearch/` is the self-contained 2026-only expansion. `src/analysis/build_codex_websearch_2026.py` reads the three complete lane files, restricts selected Versions to the declared 2026 cutoff, deduplicates Tier-A records, checks the committed Zotero export, and writes the package, RIS, and bibliographic audit inside that directory. The audit distinguishes blocking identity conflicts from explicit metadata gaps such as an unassigned DOI, unavailable full-text URL, or item-specific peer-review evidence that could not be established. Its counts and per-record states are the current authority for the later import.

The package is enriched by three source-check partitions before acquisition. `source-acquisition-plan.json` distinguishes the preferred bibliographic Version from every recorded full-text option, while `source-recovery-audit.json` retains alternative sources found after an automated endpoint fails. The runtime manifests record the option actually acquired, its exact Version relation, checksum, response validation, and failed alternatives. A complete repository HTML article is a valid local representation when its provenance and extraction are recorded with the same controls as a PDF conversion. `generated/source-acquisition/codex-websearch-2026/source-readiness.json` joins acquisition, the latest deterministic Markdown validation, direct agent source-Markdown QC, separate repairs, and visual-evidence limitations. It verifies every available source, screening Markdown, repair, manifest, and visual-asset checksum before granting readiness. Third-party PDF binaries and raw HTML captures remain local and ignored by Git. A fresh clone reproduces their preparation state from the acquisition manifests' previously verified hashes while requiring the versioned Markdown and visual assets to remain present. Source readiness means that a prepared representation can enter screening after identity binding; it does not establish inclusion, domain-expert verification, or publication approval.

## Published Companion records and work identity

`src/publish/generate_docs_data.py` writes `docs/data/research_vault_v2.json` through an atomic replacement. Its `source_fingerprint` hashes every canonical input and replaces a wall-clock generation timestamp. Unchanged sources therefore produce byte-identical output.

Each record publishes the full abstract and the Zotero item type in its recorded spelling, such as `journalArticle`. Display caps and case handling belong to the interface. `author_year` is derived from the Zotero creators after metadata corrections, as the first author's last name or organisation name followed by `et al.` for several authors and the year in parentheses. A record without a year carries the name alone, and a record without a named creator carries an empty label. The labels of the assessment sheets are not copied into it. `legacy_author_year` retains that earlier label only as the key of the established author-and-year fallback in `build_fulltext.py`, because deriving the key from the new label would bind further full-text sources. `meta.unmapped_human_records` lists expert-sheet keys without a corpus record, whose decisions cannot attach to a paper. [The completion package](../generated/completion/unmapped-historical-records.csv) retains their historical rows.

`src/publish/generate_promptotyping_data_v2.py` publishes abstracts and knowledge-document sections in full. A verification score absent from its record stays `null` rather than `0`.

`corpus/work_version_registry.json` is the canonical identity layer. Each Work carries a stable internal `work_id`; each known publication expression carries a stable `version_id`, a controlled `version_type`, identifiers, dates, access and integrity states, peer-review status and basis, relations, and provenance. `record_index` binds every Zotero record to one Work and one exact Version. `candidate_index` performs the same function for round-two intake records.

The registry distinguishes `preferred_version_id` from `latest_version_id`. The preferred version is the highest-ranked available publication stage that is not withdrawn or retracted. The latest version is selected by recorded date. The distinction avoids treating chronological recency as publication authority. Version of Record and corrected Version of Record are preferred over manuscripts and Preprints when available. All known versions remain addressable. Peer-review status is stored separately because publication stage alone is not a quality judgement.

`record_index` retains the bibliographic Version when a different accepted manuscript was actually read. The governed [source-binding manifest](../corpus/source_version_bindings.json) adds `source_index` and the corpus field `source_binding`, with exact source path/hash and source Version. Fulltext manifests and published quotations use that source Version while retaining `bibliographic_version_id` separately. Work-wide source holds restrict current synthesis even when a historical Include or earlier accepted review remains recorded.

Manifest 0.2 additionally supports `binding_mode: existing_version`: source and bibliographic Version must already be identical. It adds no Work, Version, identifier or relation. Both reviewed titles and the DOI or arXiv identity must match the registry; arXiv sources require an exact revision such as `v2`, since the arXiv DOI alone identifies no revision. Bound text quotations establish title and revision, and all source-QC evidence is hash-checked. The original manuscript-addition contract remains compatible.

Since the operator decision of 1 October 2026, `binding_mode: acquisition_receipt` binds a text on an acquisition receipt plus a passed identity check. The receipt names the origin as source URL or repository path, the retrieval time with timezone and the SHA-256 of the acquired artefact. A licensed original that stays local keeps its digest as provenance and is re-verified wherever the file is present. The identity check is `receipt_identity_check` in `src/analysis/work_versions.py`, run on the paper's own opening text after converter front matter and comments are removed, so a title written into front matter from the Zotero record proves nothing. The registered title must be printed there; the first registered author's surname must stand next to it whenever authors are registered; a DOI printed in the masthead must belong to the Work; a year that is not printed is recorded as such. The manifest records the check result, the source Version type and its difference to the preferred Version, and the registry builder and every consumer re-run the check against the hash-bound text, so a text of another work fails. When the text is a manuscript-stage expression of the record's Version of Record, the entry adds that Version through the manuscript-addition path with a `url` or `arxiv` identifier; it never adds a Version of Record and never changes the preferred Version. A duplicate record may bind the Version another record of the same Work registered. The receipt rule replaces no quotation evidence of the older modes.

An agent-run assignment can bind original visual reading material in `source.assets`: repository PNG path and byte hash, `media_type`, page/figure locator, original source URL, declared original-PDF hash and `CC-BY-4.0` license. The run validator checks the PNG itself and safe path in every run state; the original PDF digest is retained provenance and is not re-verified when that local PDF is absent. Both isolated reviewers must inspect all assigned assets. Their category evidence remains a text quotation; these reading assets do not introduce image-based PRISM annotation pins. The source-QC report distinguishes visual inspection, text completeness and unresolved source-internal inconsistencies.

Every corpus record carries the canonical identity plus `legacy_work_id` for migration. Duplicate Zotero records of one Work remain distinct records. Screening coverage applies once at Work level. A governed binding of one record extends to every record with the same Work and Version reference. A duplicate record with its own Version reference is bound to the same text through its own manifest entry. The [duplicates report](../generated/source-acquisition/oa-batch-2026-10-01/duplicate-records.csv) lists the records of each Work and the separately registered Works with an identical title, which are merge candidates for the work-level PRISMA flow. Merging established Works stays an operator decision; the registry builder refuses it.

A text cut from a whole issue, volume or proceedings file is kept as an excerpt with its line range in `generated/source-acquisition/oa-batch-2026-10-01/excerpts/excerpts.json`. An AI review of a released record stays current when the receipt binding serves exactly the text it read, either the bound file or the reading layer built from it. The full-text manifest, PRISM evidence, run manifests, Grounded Vault distillates, public publication records, and Assertions retain the exact Version used. The controlled vocabulary and selection rule live in `docs/data/work_version_contract.json`.

`knowledge_coverage` records why a paper does or does not expose a knowledge document.

- `linked` identifies a published document link.
- `fulltext_ready` identifies a safely bound full text whose document link is still absent.
- `identity_unresolved` identifies an ambiguous or conflicting source identity.
- `source_missing` identifies a record without a safely bound source.

The metadata reports record links and distinct document paths separately. The Companion header uses both values so a duplicated record does not look like an additional knowledge document.

These are availability measures for the historical working collection. `linked` does not mean that a distillate has a current source-review receipt, belongs to the active Vault, supports an Assertion or is eligible for SQ analysis. Bibliographic identity corrections can invalidate a same-title legacy knowledge document without suppressing a separately verified exact fulltext. [The Vault coverage guide](research-vault.md#current-implementation-state) separates archive links, active Assertions, screening and whole-corpus readiness.

## Knowledge-document coverage

The Companion counts corpus records with a non-empty `knowledge_doc` reference and reports the number of distinct document paths separately, because several Zotero records can reference the same Work and the same file. The current values stand only in `docs/data/research_vault_v2.json > meta`.

`generate_docs_data.py` resolves filenames case-insensitively, publishes the actual spelling and discards ambiguous matches. After publication it removes pages under `docs/vault/Papers/` that no current record references. Repository tests check the exact file spelling and the internal consistency of the coverage states.

`docs/data/knowledge_doc_bindings.json` holds only explicitly verified assignments between records, full-text sources and published knowledge documents. Title conflicts and ambiguous source identities stay blocked. Fuzzy title or author-year matches are candidates for manual clarification and produce no published link.

## Published literature landscape

`src/publish/generate_literature_landscape.py` joins the productive PRISM track with the corpus metadata and writes `docs/data/literature_landscape.json`. The public artifact follows the explicit `config/publication_policy.json`; the authorised preliminary release admits source-bound AI-reviewed records with attributed artifact/source-hash-bound review receipts. It preserves their actual lifecycle status and excludes raw full text and browser-only recovery state.

The generator is a fail-closed publication checkpoint. Without an explicit policy it requires `publication-approved`; the preliminary policy instead checks the exact AI review receipt, source identity and integrity holds. A release-eligible record still fails the build when it has an unknown Paper ID, an unknown category, a category value outside the vocabulary, a positive category without Paper evidence, or an incomplete Include analysis. Human approval claims additionally require a valid final approval event. The output reports the source-annotation total and the withheld total separately; preliminary AI review is never presented as domain-expert verification.

The Literature Landscape uses only Include records for thematic aggregation. Exclude and Unclear remain part of the progress summary. Category combinations are multi-valued co-occurrences, and the analysis fields retain their multi-select semantics. Every matrix cell and profile value resolves to the supporting papers, their analysis fields, and the stored Paper evidence.

### Analysis field states and coverage

Each released record's `analysis` carries `fields`, `field_states`, `undecidable` and `notes`. `field_states` names every controlled analysis field and `Studientyp` with exactly one state.

- `value` marks a substantive code.
- `none` marks the explicit code `None`.
- `undecidable` marks a field the coder declared not decidable from the source.
- `absent` marks an optional field the coding left empty, such as `AN_Harm_Types` on an abstract basis.

`fields` holds only the codes of `value` and `none` fields, so an empty list never stands in for a missing or undecidable coding. `undecidable` remains the list of undecidable field names for existing consumers.

Every annotation coded under codebook 1.4 or later records `analysis.codebook_version`, and an annotation without it counts as 1.3. Fields introduced later carry `introduced_in` in `analysis_fields.json`. The completion package derives the field state `not_collected` when a field was introduced after the newest codebook version of a Work's governed annotations, which keeps a field nobody was asked to code apart from `None`, from undecidable and from coding still to be done ([[codebook-v1.4-proposal#Field state not collected]]). The release projection shows such a field as absent, and the result site counts a Work as coded on the fields of the 1.3 baseline.

`meta.analysis_coverage` states for every field how the intended scope is covered, so an empty matrix cell can be read against its denominator instead of as a research gap. The scope joins the Works with a recorded Include in the completion package, where the human decision takes priority, with the released Include Works. `scope` reports both parts and the released Include Works outside the recorded Include set, which arise from documented round-specific divergences. Each entry under `fields` partitions the scope into the four released states and two unreleased states. `withheld` marks a Work that a hold, a conflict or a pending or negative review keeps out of the release, whether or not a coding exists. `withheld_by_reason` assigns each such Work one reason in the precedence order of `withheld_reasons`. `not_coded` marks a Work without coding and without a withholding reason.

- `source_hold` means a source-version or integrity hold restricts the Work.
- `decision_conflict` means recorded decisions conflict within or across tracks, or the released AI decision for the Work is not Include.
- `open_negative_review` means the latest AI source review of a record is negative and unresolved.
- `stale_source_review` means the accepted review targets an earlier source representation than the current binding.
- `review_pending` means a coded record has no accepted review yet.
- `field_conflict` means aliases of the Work carry conflicting codes for this field only.

```json
// counts are placeholders; the current values live in docs/data/literature_landscape.json
"analysis_coverage": {
  "unit": "work",
  "authority": "…",
  "scope": { "work_total": 0, "recorded_include_work_total": 0, "released_include_work_total": 0,
             "released_include_outside_recorded_include_work_total": 0 },
  "states": ["value", "none", "undecidable", "absent", "not_coded", "withheld"],
  "withheld_reasons": ["source_hold", "decision_conflict", "open_negative_review",
                       "stale_source_review", "review_pending", "field_conflict"],
  "fields": {
    "AN_Bias_Axes": { "value": 0, "none": 0, "undecidable": 0, "absent": 0, "not_coded": 0, "withheld": 0,
                      "withheld_by_reason": { "source_hold": 0, "…": 0 } }
  }
}
```

`fields` also holds the two category groups under the keys `object` and `perspective`. A released Work counts as `value` for a group when it carries at least one category of the group, which the release holds only at teilweise or ja, and as `none` otherwise. Unreleased Works take the same withholding reasons or `not_coded`, `undecidable` and `absent` stay zero, and the six states again sum to `scope.work_total`.

The released states recompute from the released records, and the unreleased states derive from the completion package's canonical Work rows through `canonical_work_rows`. The object carries counts only and no content of unreleased Works. The result site and its download carry the same object. Released states are attributed AI source review, never domain-expert verification. Whether counts about unreleased Works may appear on the public result site is an open decision recorded in [[governance#Publication boundary]].

The internal `generated/completion/field-states.csv` partitions the recorded Include Works alone, without the released Include Works outside that set, with a finer state set for analysis planning, described in [[methods#Descriptive mapping and process diagnostics]]. It is no release input. One rule decides `stale_source_review` for both, the function of that name in `src/publish/generate_literature_landscape.py`. A Work whose included AI-reviewed records all carry a review of another source representation than the current binding takes that state in the completion package and contributes no coding to its SQ tables.

## Reading text source and corpus search (v4, as built)

What the screening view reads and searches, and what it deliberately does not.

| What | Where | Note |
|---|---|---|
| Reading text (Volltext layer) | `docs/data/fulltext/{id}.md` via `fetchFullText`, listed in `fulltext_manifest.json` | the cleaned Docling full text, built by `src/publish/build_fulltext.py`; rebuilt in every clone by `npm run build`, git-ignored (ADR-025). Current coverage is derived from the manifest. |
| LLM-Wissensdestillat layer | the generated distillation from `paper.knowledge_doc` (`## Kernbefund` onward) | shown as a separate reference layer and excluded from the Paper-evidence gate (ADR-016/028/029/030) |
| Abstract fallback | `paper.abstract` in `research_vault_v2.json` | used when no full text exists; not every paper has an abstract |
| Corpus search index | `docs/data/fulltext_index.json` (built by `src/publish/build_screening_index.py`) | stays distillation-based, not the full text, for the same copyright reason |

The raw Docling full texts live in the tracked `generated/markdown_clean/` and hold copyrighted, paywalled papers, which stay in the private repository by operator decision of 1 October 2026. `build_fulltext.py` cleans them (frontmatter, image comments, GLYPH artefacts) into `docs/data/fulltext/`, which is git-ignored and rebuilt by `npm run build` in every clone. The Pages site serves only the fallback. Publishing the full texts publicly is outward-facing and a separate, rights-gated decision (ADR-025).

The screening view fetches the full text and the knowledge document together (`loadReadingInto`). The Papertext layer renders the paper with the built-in Markdown renderer, including pipe tables, glossaries under an acronym heading and Docling `/uniXXXX` glyph names, resolved at render time only so the served full texts keep their recovery hashes; the `LLM-Wissensdestillat` layer renders the generated distillation from `## Kernbefund` onward. In-text search runs over the active document; corpus-wide search runs over `fulltext_index.json`. The model proposal (`paper.llm`) is separate from both reading layers and is shown as a labelled reference in human sessions (ADR-038). The layer a snippet is pinned from sets `source_layer`; the configured run sets `actor` independently (ADR-030).

The built contract is ADR-025 plus ADR-027: `build_fulltext.py` writes the local reading layer under `docs/data/fulltext/`; PRISM reads it through `fulltext_manifest.json`, falls back to the metadata abstract, and records `raw`, `abstract`, or `none` in `text_source`. The knowledge-document distillate never becomes the Paper layer. An earlier paper-lane design with browser-side title-prefix matching and a `knowledge_doc` text-source value is superseded. The folder picker may target the repository root; PRISM resolves or creates `docs/data/screening/` below it. Publishing local full texts remains a separate rights-gated decision.

## Evidence behaviour (FR-13 contract, as built)

How a pinned Beleg is created, stored, and surfaced. This is the contract the reviewer-file writer and the UI both follow.

- Trigger: selecting a passage in the reading column (2 to 400 chars), or pressing "Treffer anheften" on the active in-text search hit. A category menu opens; choosing a category pins.
- Stored shape: `evidence[category]` is a list of `{ term, snippet, ts, origin, source_layer, actor, work_id, version_id }` for new Paper evidence. `term` is the selected text or the search query, trimmed to 80 chars. `snippet` is the surrounding context, trimmed to 260 chars. `ts` is an ISO timestamp. `source_layer` records Paper or LLM-Wissensdestillat; `actor` records person or agent. `work_id` and `version_id` identify the exact Paper expression. `origin` remains the legacy compatibility field.
- Coupling: pinning a Paper-Beleg on an empty category sets `categories[category] = 1`. The reviewer promotes it explicitly to 2 when the paper treats the aspect centrally. A pin from the LLM-Wissensdestillat never sets or satisfies a category. Every category at level 1 or 2 needs at least one Paper pin before the decision can be saved. Turning a category to 0 retains its existing pins for traceability; the reviewer can remove them individually.
- Edit/remove: a Beleg can be removed individually before the decision is recorded (the small remove control next to the snippet). There is no dedup; pinning the same passage twice stores two entries (the reviewer can remove one).
- Surfacing: Belege are saved with the decision in the reviewer file. The decision-log CSV reports an `evidence_count` per paper. The UI marks a Beleg only where it deviates from an ordinary Paper pin, as `LLM` for the distillate layer and `Agent` for an agent actor; the record carries the actor separately. The snippet of a pinned search hit is taken at the position of the active hit. Distillate evidence remains advisory and is excluded from the Paper-evidence gate. No model-generated reasoning is preloaded into category evidence.

## Save validation (schema 0.4 capture and schema 0.5 lifecycle contract)

- The reviewer key is mandatory. It contains two to twelve filename-safe characters, begins with a letter, and is canonicalised to lowercase. This prevents `CP.json` and `cp.json` from becoming separate in-memory tracks for the same Windows file. The canonical filename controls the loaded key; an imported payload cannot redirect a save into another track.
- Category values are `0`, `1`, and `2`. A positive value requires a Paper-evidence pin for that category, unless `evidence_basis` records the unchanged expert level (ADR-042) or a formal exclusion (ADR-048).
- A loaded record is complete only when its decision follows from its categories and override and an Exclude names its reason.
- A final Include requires all method fields defined as required by `analysis_fields.json`. `nicht entscheidbar` is mutually exclusive with substantive codes for the same field. The fields introduced in codebook 1.4 are optional in PRISM, because the analysis fields are coded by agent tracks, whose coding packets require every field of their codebook version. Sanitising keeps a recorded `codebook_version`, and an edit in the analysis panel records the loaded vocabulary version.
- `AN_Coding_Basis` is derived from `text_source`. A decision based on the local full text records `Fulltext`; when that basis applies, `AN_Harm_Types` is required.
- Exclude requires a controlled exclusion reason where the derivation or override demands one. An override to Include requires its free-text justification.
- The write result remains visible in a compact status line, and the target file in every save result. The button "Speichern" in the assessment dock is the only editor-facing save action. The local server writes the file (ADR-047), and the browser draft remains a recovery aid until the file confirms the write; records only the browser holds are offered for writing.
- Every write re-reads the file first. A change made outside the session is merged per paper by timestamp, and a divergence that cannot be ordered blocks the write until the reviewer keeps the file or the browser version. A record that cannot be used (unknown paper, invalid decision or reason, a human record bound to another Work-Version) is held back and written back unchanged. An empty file counts as absent. Keys of built-in tracks and of agent tracks are refused.

## Seed dataset (the round-1 data carried through PRISM)

The tool is seeded with the existing review and the round-one data carried through PRISM. The seed preserves the comparative expert and LLM tracks for replay. New round-two records enter through governed reviewer files and the validated import seam before their lifecycle state is evaluated:

| Source file | Provides |
|---|---|
| `docs/data/research_vault_v2.json` | paper metadata, assessment, knowledge summaries |
| `assessment/human_assessment.csv` | consolidated expert decisions for round one |
| `assessment/llm_assessment_10k.csv` | advisory AI decisions (Haiku) |
| `generated/benchmark-results/agreement_metrics.json` | reference agreement figures; `human_yes_rate` and `agent_yes_rate` use the 0 to 100 scale, `Source_Tool` is often empty and provider attribution relies on Zotero collections |

`src/publish/generate_docs_data.py` maps the assessment results and metadata into `docs/data/research_vault_v2.json`, the seed consumed by PRISM. The canonical round-one replay under `src/replay/` deterministically reproduces the benchmark and supplies the conformance check for count-bearing claims.

The projection reads Ja and Nein case-insensitively, as the canonical replay does. An empty cell or any other value in the expert sheet projects as `null` in `human.all_categories`, matching the LLM projection, so an uncoded category never appears as Nein. The canonical replay and the agreement metrics treat such a cell, including the expert's `?`, as missing, so it never enters a per-category denominator as a third label. `generated/benchmark-results/disagreements.csv` is keyed by Zotero key and fills `benchmark.disagreement_type`, `severity` and `affected_categories` of the same record. A disagreement without a corpus record stops the build.

## Historical concept graph and divergence classification

`docs/data/concept_graph.json` is a historical, frozen and unreviewed artifact. An earlier LLM concept extraction produced it from a local cache that is no longer part of the build, and no generator in the repository rebuilds it. Its node frequencies and edge weights do not recompute from its own `paper_concepts`. The Companion and `promptotyping_v2.json` render it unchanged. `generate_promptotyping_data_v2.py` therefore adds `concepts.provenance` with the status `historical_frozen_unreviewed` and two flags that check node frequencies and edge weights against `paper_concepts` on every build. Concept nodes and edges describe co-occurrence in a past extraction, not reviewed findings or current corpus coverage.

The divergence items in `promptotyping_v2.json` carry `pattern` and `justification` as `null`. The pattern classification came from a local LLM cache that the reproducible build no longer reads, and no committed classification source replaces it. `null` marks an unclassified divergence, and `meta.pattern_distribution` stays empty until an attributed classification source exists.

## Schemas

`schemas/` holds the JSON Schema (draft 2020-12) descriptions of the governed and generated JSON contracts. A schema documents the shape a generator already writes. It grants no authority beyond structural conformance and never replaces the canonical owner of a vocabulary, which stays with `assessment/categories.yaml`, `docs/data/work_version_contract.json` and `docs/data/screening_lifecycle_contract.json`.

- `femprompt-completion-package-1.0` describes `generated/completion/completion-package.json`, the provisional preparation package joining registry, productive track, 2026 candidates, Assertions and knowledge coverage. Its `researchVaultState` admits the Grounded Vault states `preparation`, `grounded`, `ai-agent-reviewed`, `verified` and `publication-approved` for Assertions and distillates ([[research-vault#Status and checks]]). The analysis blocks added on 1 October 2026 pass as additional properties without a constraint of their own.
- `femprompt-prisma-assignment-1.0` describes the reviewer assignment `docs/data/screening/assignment.json`, which the reviewer schema excludes.
- `femprompt-prisma-reviewer-0.5` describes a productive PRISM track under `docs/data/screening/`, with embedded provenance, immutable annotation versions, check receipts and lifecycle. The optional `verification_schema` and `verifications` keys are admitted without constraining the verification record itself.
- `femprompt-source-readiness-0.2` describes `generated/source-acquisition/codex-websearch-2026/source-readiness.json`.
- `femprompt-source-version-bindings-0.2` describes the governed source-binding manifest `corpus/source_version_bindings.json`.
- `femprompt-work-version-registry-0.1` describes the canonical identity layer `corpus/work_version_registry.json`.

Recorded bibliographic dates stay verbatim. The registry preserves the date as the source record carries it, including slash notation, month names and conference ranges, and year extraction for preferred and latest selection happens in code rather than through a stored normal form. Partial dates of year or year and month are equally valid where a selected Version carries no full date.

`src/publish/validate_schemas.py` binds each schema to the files it describes and exits non-zero on the offending file and JSON pointer. A file absent from a checkout is skipped, because the reading layer and the acquisition tree are prepared locally.

## Document boundary

Category definitions remain canonical in `categories.yaml`. [[methods]] describes the assessment pipeline, while [[specification]] describes the interface and its design system. This document defines the data substrate shared by both.
