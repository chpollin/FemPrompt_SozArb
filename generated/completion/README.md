# Completion package

Source fingerprint: `sha256:a3283c993e9cca8e685f4d4d00b6875f163a062ab6512fed5d9fa90aac462b81`. Deterministic internal preparation; no approval is created.

Scope: existing corpus plus all already identified 2026 candidates (search cutoff 2026-08-24) and the separate targeted gap-fill intake from 2026-09-05. Candidate membership does not imply inclusion. New search should address a concrete evidence gap with excellent sources.

| Coverage | Count |
|---|---:|
| Canonical bibliographic records | 326 |
| Canonical record-bound works | 257 |
| All registry works, including pending candidates | 280 |
| Works with recorded human annotations | 229 |
| Works with recorded AI-review records | 29 |
| Works with decision or coding conflicts | 11 |
| Works with an unresolved negative AI source review | 6 |
| Records using an accepted immutable AI correction | 5 |
| Historical human records missing canonical identity binding | 12 |
| Source acquisition/screening queue | 8 |
| 2026 candidates | 58 |
| 2026 candidates with canonical binding | 0 |
| 2026 candidates with recorded, locally hash-matching ready text | 33 |
| Separate targeted gap-fill candidates | 3 |
| Targeted gap-fill candidates with canonical binding | 0 |
| Targeted gap-fill candidates with recorded fulltext reading | 2 |
| Active assertions | 3 |
| Assertions with current source-hash-bound AI review | 3 |

Use `work-verification-queue.csv` to resolve discrepancies and missing coding per work. The complete JSON preserves each active annotation, recorded actors, models, event dates, and historical provenance gaps. Human annotations remain authoritative in their track; AI review is labelled separately and can be used according to the configured publication policy. No new human verification is inferred from old CSV rows.

Accepted corrections are applied only as source-hash-bound projections. The JSON retains the original analysis, original review outcome, correction base artifact/hash, exact field differences and correcting agent/model/time. The work queue links each correction and its immutable basis with agent, model and dates. A negative original review is resolved for the projected coding only by a later accepted correction. Further review of corrected coding must target its correction artifact; review authority belongs to the exact artifact. Unresolved negative reviews remain open and their work is excluded from interim AI analysis counts.

An explicit historical `Exclude` / `Duplicate` disposition applies to the bibliographic record, not the work, and does not contradict an included alias. Other conflicting exclusions remain unresolved. `unmapped-historical-records.csv` retains legacy decisions that cannot currently be placed in the registry; they are not silently dropped into the canonical denominator.

Use `candidate-2026-readiness.csv` for import, exact Work-Version binding, source exceptions and remaining preparation. Existing Zotero and manuscript files are not changed. Registry-only candidates are retained separately in `registry-candidate-queue.csv`; overlap with the 2026 package must be curated, so these counts cannot be added.

Use [targeted-followup-queue.csv](targeted-followup-queue.csv) or [targeted-followup-queue.json](targeted-followup-queue.json) for the 3 targeted gap-fill candidates, their stated evidence gaps, source-access limits and next steps. They are identified, unbound and unscreened; recorded fulltext reading does not grant review or release authority. These candidates belong to the completion scope but are counted separately from canonical works and the original 2026 search. The later targeted search date does not change that search's cutoff.

Use `sq-analysis-tables.csv` for provisional descriptive counts and `synthesis-outline.md` for the source-bound writing plan. Uncoded works and conflicts remain visible in each denominator. Complete source reading and explicit AI-review provenance are required for new scientific assertions; deterministic checks alone do not constitute review. Study quality must be appraised separately before deriving practice recommendations.

Regenerate with `python -m src.analysis.build_completion_package`; verify freshness with `python -m src.analysis.build_completion_package --check`. Generated tables and prose share the JSON fingerprint. `--check` fails if any managed output is absent or differs, including after source deletion or a changed annotation.

This directory is an internal operator package and is not a website release input. Publication selection is handled by the dedicated policy and publisher, not by these provisional tables.
