---
title: Restructure Plan
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: draft
language: en
version: "0.2"
created: 2026-06-30
updated: 2026-06-30
authors: [Christopher Pollin]
generated-with: Claude Code
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
related: [methods, plan, journal]
---

A migration plan for the repository folder layout. It is a worked proposal, not executed. The goal is a layout that mirrors the six-step review logic, makes input legible against output, and puts all runnable code in one place. This document is transient and is deleted once the move is carried out; the resulting layout is then documented in [[methods]] and the structure section of `CLAUDE.md`.

The move must follow the distillate repair, not precede it. Restructuring while the distillate set is broken doubles the work, because the repair changes both paths and file contents. Sequence: repair and regenerate clean data first, then this migration, one move-group per commit.

## Why

The project is a linear review pipeline in six steps, but the folders do not line up with it. Three concrete defects:

1. Code lives in five separate locations with no rule, including one generator filed under the wrong stage.
2. Generated data sits mixed with source data inside the same folders, so nothing at the folder level says "do not hand-edit this, it is regenerated".
3. Nothing in a folder name marks its role as source, code, generated, or published.

## Current state (the real flow)

The pipeline and its real paths:

```
1 IDENTIFICATION   deep-research/            ->  corpus/zotero_export.json
2 ACQUISITION      pipeline/pdfs/  ->  pipeline/markdown/  ->  pipeline/markdown_clean/
3 DISTILLATION     pipeline/knowledge/distilled/   (+ _stage1_json, _stage2_draft, _verification)
4 ASSESSMENT       assessment/  +  benchmark/data/  ->  benchmark/results/
5 ASSEMBLY         scripts/  +  pipeline/scripts/  ->  vault/, docs/data/, docs/vault/Papers/
6 PUBLICATION      docs/                     (Evidence Companion + PRISM)
```

Code is scattered across five locations:

| Location | Holds | Belongs to step |
|----------|-------|-----------------|
| `pipeline/scripts/` | acquire, convert, postprocess, distill, validate | 2, 3 |
| `scripts/` | the publishing generators (vault, promptotyping json, screening index, pages) | 5 |
| `benchmark/scripts/` | agreement computation | 4 |
| `corpus/extract_metadata.py` | metadata extraction | 1 |
| `assessment/human/*.py` | excel to zotero tags | 4 |

One generator is filed under the wrong stage. `pipeline/scripts/generate_docs_data.py` writes `docs/data/research_vault_v2.json` and `graph_data.json`, so it is a step-5 publishing generator, but it sits among the step-2/3 pipeline scripts. The other three publishing generators sit in `scripts/`.

Source and generated data share folders:

| Folder | Source part | Generated part |
|--------|-------------|----------------|
| `pipeline/` | `scripts/`, `tools/` (code) | `pdfs/`, `markdown/`, `markdown_clean/`, `knowledge/distilled/` |
| `benchmark/` | `config/categories.yaml`, `data/*.csv` | `results/` |
| `corpus/` | `zotero_export.json`, `*.csv` | (none) plus `extract_metadata.py` (code) |
| `docs/` | `*.html`, `js/`, `css/` (authored) | `data/`, `vault/Papers/`, `downloads/` |

The assessment is split. The raw human Excel lives in `assessment/human/results/`, but the CSV the scripts actually read lives in `benchmark/data/human_assessment.csv`. The same evaluation is half in `assessment/`, half in `benchmark/`.

Untracked scratch on disk: `analysis/` is not gitignored and surfaces in `git status`; `logs/`, `test_pipeline_data/`, `.pipeline_status.json` are already ignored.

## Target structure

```
INPUT  (authored or collected)
  corpus/          identification: zotero_export.json + deep-research/ (provenance, moved in)
  assessment/      human + llm raw assessment + categories.yaml
  knowledge/       project documentation
  paper/           manuscript
  prompts/  config/

CODE  (everything that runs, one root, by step)
  src/
    acquire/   download, convert, postprocess
    distill/   distill_knowledge, validate (incl. the matcher fix)
    assess/    calculate_agreement
    publish/   generate_vault, generate_promptotyping_data, generate_docs_data,
               build_screening_index, build_pages

GENERATED  (machine output, reproducible, do not hand-edit)
  generated/
    markdown/  markdown_clean/  distilled/  pdfs/
    vault/
    benchmark-results/

PUBLISHED  (the served site, bound to docs/ by GitHub Pages)
  docs/   index.html, prisma.html, js, css, data/, vault/Papers, downloads
```

This collapses the top-level set to source, code, generated, published, with each folder name carrying its role. The two stated pains are resolved: code in one place, input legible against output.

## Move list

| From | To | Note |
|------|----|------|
| `scripts/*.py` | `src/publish/` | the four publishing generators |
| `pipeline/scripts/generate_docs_data.py` | `src/publish/` | misfiled generator, joins its siblings |
| `pipeline/scripts/` (acquire, convert, postprocess) | `src/acquire/` | |
| `pipeline/scripts/distill_knowledge.py`, `validate_pipeline.py`, `validate_knowledge_docs.py` | `src/distill/` | |
| `pipeline/scripts/utils.py` | `src/` | shared, imported by several |
| `benchmark/scripts/*.py` | `src/assess/` | |
| `corpus/extract_metadata.py` | `src/acquire/` | |
| `assessment/human/*.py` | `src/assess/` | |
| `pipeline/markdown/`, `markdown_clean/`, `pdfs/` | `generated/` | |
| `pipeline/knowledge/distilled/` (+ `_stage1_json`, `_stage2_draft`, `_verification`) | `generated/distilled/` | |
| `vault/` | `generated/vault/` | also changes the Obsidian open path |
| `benchmark/results/` | `generated/benchmark-results/` | |
| `benchmark/data/*.csv` | `assessment/` | unifies the split assessment |
| `benchmark/config/categories.yaml` | `assessment/` or `config/` | open decision |
| `deep-research/` | `corpus/deep-research/` | identification provenance |
| `pipeline/tools/markdown_reviewer.html` | `src/distill/` or keep under a `tools/` | open decision |

`docs/` does not move. Its generated children (`data/`, `vault/Papers/`, `downloads/`) stay because the served site must find them at those paths.

## Reference updates (the real hazard)

Each script computes the repo root relative to its own depth. Moving a script changes its depth, so the root computation breaks unless the parent count is fixed.

| Script | Current root computation | After move |
|--------|--------------------------|------------|
| `scripts/generate_vault_v2.py` | `Path(__file__).resolve().parent.parent` (1 deep) | `parents[2]` (2 deep in `src/publish/`) |
| `scripts/generate_promptotyping_data_v2.py` | `parent.parent` | `parents[2]` |
| `scripts/build_screening_index.py` | `parent.parent` | `parents[2]` |
| `scripts/build_pages.py` | `parent.parent` | `parents[2]` |
| `pipeline/scripts/generate_docs_data.py` | `dirname(dirname(dirname(...)))` (2 deep) | unchanged count (also 2 deep in `src/publish/`) |

Cross-script imports: `generate_promptotyping_data_v2.py` does `sys.path.insert(0, repo_root / "scripts")` and `from generate_vault_v2 import build_knowledge_doc_to_zotero_index`. Co-locating both in `src/publish/` means updating that insert to `src/publish` (or relying on same-dir import).

Path constants that point at moved folders, per the I/O survey:

- `generate_vault_v2.py`: `vault/`, `.vault_cache/`, `pipeline/knowledge/distilled/` (+ stage1/stage2/verification), `corpus/zotero_export.json`, `benchmark/data/*.csv`, `benchmark/results/*`, `benchmark/config/categories.yaml`, `pipeline/scripts/distill_knowledge.py`. Writes `vault/`, `docs/vault/Papers/`, `docs/downloads/vault.zip`.
- `generate_promptotyping_data_v2.py`: same input set plus `docs/data/promptotyping_v2.json` output, `benchmark/results/disagreements.csv`.
- `generate_docs_data.py`: `benchmark/data/*.csv`, `benchmark/results/*`, `corpus/papers_metadata.csv`, `docs/vault/Papers/`. Writes `docs/data/research_vault_v2.json`, `graph_data.json`.

Documentation references to update after the move: the `CLAUDE.md` Repository Structure, Key web files, and Canonical Locations sections; `pipeline/README.md`; `pipeline/scripts/README.md`; `knowledge/methods.md` (script reference, regeneration chain); `knowledge/data.md` (the reading-text source paths, since `pipeline/markdown_clean/` moves and PRISM reads it through the local clone). The validator guard in `validate_pipeline.py` carries the distilled paths and moves with the file.

PRISM reads `pipeline/markdown_clean/` from the connected local clone through the File System Access path (the raw reading-text source per [[plan]] shaping decision 1). Moving that folder to `generated/markdown_clean/` changes the path the tool resolves, so the screening-view code that opens it must update too.

## Fixed points and limits

- `docs/` is bound to GitHub Pages and stays, including its generated children.
- `vault/` is opened directly in Obsidian; moving it to `generated/vault/` changes that open path and any pinned Obsidian workspace.
- `.vault_cache/` is reproducible and can move or stay; it is gitignored.

## Order and verification

1. Repair the distillate defect and regenerate clean data (separate concern, must come first).
2. Migrate in move-groups, one commit each: code to `src/`, then generated data to `generated/`, then `deep-research/` into `corpus/`, then the assessment unification. Regenerate and test after each.

Per commit:

- `npm test` green (the jsdom harness must not depend on a moved path).
- Each regeneration step runs and writes the same-content output at the new paths.
- Live-site smoke: `docs/index.html` and `docs/prisma.html` load, a paper detail opens, `knowledge_doc` still resolves to `docs/vault/Papers/<title>.md`.
- `git grep` for each old path string returns only history.

## Open decisions

1. Code root name: `src/` or keep `scripts/` and just consolidate into it.
2. Whether `benchmark/` dissolves entirely (config to `config/` or `assessment/`, data to `assessment/`, results to `generated/`) or stays as one evaluation folder.
3. Whether to flatten `deep-research/restored/` (the name records a one-time recovery, not a category) while moving it into `corpus/`.
4. Where `pipeline/tools/markdown_reviewer.html` lands.
5. Side cleanup independent of the migration: gitignore or remove the untracked `analysis/` scratch.
