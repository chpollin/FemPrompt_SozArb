# Completion package

Source fingerprint: `sha256:7987896e4010383aeb99bd39c9c0700077ef27833a08ea9f6f8221db9e84396e`. Deterministic internal preparation; no approval is created.

Scope: existing corpus plus all already identified 2026 candidates (search cutoff 2026-08-24) and the separate targeted gap-fill intake from 2026-09-05. Candidate membership does not imply inclusion. New search should address a concrete evidence gap with excellent sources.

| Coverage | Count |
|---|---:|
| Canonical bibliographic records | 326 |
| Canonical record-bound works | 257 |
| All registry works, including pending candidates | 280 |
| Works with recorded human annotations | 229 |
| Works with recorded AI-review records | 29 |
| Works with decision or coding conflicts | 3 |
| Works with an unresolved negative AI source review | 1 |
| Records using an accepted immutable AI correction | 9 |
| Historical human records missing canonical identity binding | 10 |
| Historical human records reconciled to existing Works | 2 |
| Works under a confirmed integrity hold | 1 |
| Source acquisition/screening queue | 8 |
| Queued Works with newly acquired text still requiring exact binding and source QC | 2 |
| 2026 candidates | 58 |
| 2026 candidates with canonical binding | 0 |
| 2026 candidates with recorded, locally hash-matching ready text | 33 |
| Separate targeted gap-fill candidates | 3 |
| Targeted gap-fill candidates with canonical binding | 0 |
| Targeted gap-fill candidates with recorded fulltext reading | 2 |
| Active assertions | 3 |
| Assertions with current source-hash-bound AI review | 3 |

## Knowledge coverage

| Availability measure (not verification) | Count |
|---|---:|
| Canonical records linked to an existing Knowledge Document | 241 / 326 |
| Distinct linked Knowledge Documents | 183 |
| Work IDs with a linked Knowledge Document | 190 / 257 |
| Work IDs without a linked Knowledge Document | 67 |
| Broken document links | 0 |
| Documents shared across multiple Work IDs (identity-review candidates) | 7 |
| Canonical records mapped in the exploratory concept graph | 208 |
| Graph keys without canonical record binding | 12 |

`completion-package.json` → `knowledge_coverage` contains the exact missing-record/Work lists, shared-document identity candidates, unbound graph keys, isolated nodes, and the active versus legacy document inventory. Document availability does not establish scholarly verification or analysis eligibility. Graph edges represent concept co-occurrence, not supported scientific assertions. Stable Work IDs still require duplicate reconciliation; current totals are not a final count of distinct publications. The active Assertion slice above is the source-reviewed synthesis layer, while the larger linked archive remains a working input.

Use `work-verification-queue.csv` to resolve discrepancies and missing coding per work. The complete JSON preserves each active annotation, recorded actors, models, event dates, and historical provenance gaps. Human annotations remain authoritative in their track; AI review is labelled separately and can be used according to the configured publication policy. No new human verification is inferred from old CSV rows.

Accepted corrections are applied only as source-hash-bound projections. The JSON retains the original analysis, original review outcome, correction base artifact/hash, exact field differences and correcting agent/model/time. The work queue links each correction and its immutable basis with agent, model and dates. A negative original review is resolved for the projected coding only by an accepted review of its exact correction. Rejection and correction acceptance may share a timestamp only for the same agent/model and the exact original-hash-bound correction; other simultaneous conflicts fail closed. Further review of corrected coding must target its correction artifact; review authority belongs to the exact artifact. Unresolved negative reviews remain open and their work is excluded from interim AI analysis counts.

An explicit historical `Exclude` / `Duplicate` disposition applies to the bibliographic record, not the work, and does not contradict an included alias. Attributed source-grounded historical resolutions can additionally identify an author-error exclusion as an administrative metadata disposition; exact original row hashes and target Work bindings are checked before applying it. The original decision remains visible. Substantive human conflicts stay unresolved. Documented round-specific differences keep their separate human and AI decisions. Source/version and withdrawal holds prevent current synthesis regardless of the historical Include decision.

`unmapped-historical-records.csv` retains legacy decisions that cannot currently be placed in the registry. `historical-recovery.ris` prepares independently confirmed missing publications for Zotero import; it does not create Zotero IDs, new inclusion decisions or verification events. The evidence and unresolved empty record are recorded in `generated/verification/historical-resolution-2026-09-05.json`.

Use `candidate-2026-readiness.csv` for import, exact Work-Version binding, source exceptions and remaining preparation. Existing Zotero and manuscript files are not changed. Registry-only candidates are retained separately in `registry-candidate-queue.csv`; overlap with the 2026 package must be curated, so these counts cannot be added.

Use [targeted-followup-queue.csv](targeted-followup-queue.csv) or [targeted-followup-queue.json](targeted-followup-queue.json) for the 3 targeted gap-fill candidates, their stated evidence gaps, source-access limits and next steps. They are identified, unbound and unscreened; recorded fulltext reading does not grant review or release authority. These candidates belong to the completion scope but are counted separately from canonical works and the original 2026 search. The later targeted search date does not change that search's cutoff.

Use `sq-analysis-tables.csv` for provisional descriptive counts and `synthesis-outline.md` for the source-bound writing plan. Uncoded works and conflicts remain visible in each denominator. Complete source reading and explicit AI-review provenance are required for new scientific assertions; deterministic checks alone do not constitute review. Study quality must be appraised separately before deriving practice recommendations.

Regenerate with `python -m src.analysis.build_completion_package`; verify freshness with `python -m src.analysis.build_completion_package --check`. Generated tables and prose share the JSON fingerprint. `--check` fails if any managed output is absent or differs, including after source deletion or a changed annotation.

This directory is an internal operator package and is not a website release input. Publication selection is handled by the dedicated policy and publisher, not by these provisional tables.
