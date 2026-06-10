---
title: "Reuse Setup: Running a Foreign Review on the PRISM Machinery"
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
status: draft
language: en
version: "0.1"
created: 2026-06-09
updated: 2026-06-09
authors: [Christopher Pollin]
generated-with: Claude Code
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
related: [plan, data, specification, prisma-methodology]
---

This document is the setup path for reusing this project's review machinery for a different systematic review: a different topic, different categories, different corpus, different prompts. It implements Stage C3 of [[plan]] (reuse extraction). The target reader is a third party who has never worked in this repository and should reach a first screened paper from this document alone.

**Status: draft, not yet validated.** The TP7 verification criterion in [[plan]] is a third-party dry run from documentation alone. This path has been derived from the code and data as committed, but no external person has executed it yet. It stays `status: draft` until the round 2 dress rehearsal (the Stage B update cycle, which exercises the same machinery end to end) confirms or corrects each step. Where this document and the code disagree, the code is right and this document has a bug; please report it.

## What you reuse and what you replace

The machinery is generic. The review content is not. The split:

| Component | Path | Stays or replaced |
|---|---|---|
| PRISM screening tool (three surfaces: Screening, PRISMA & Report, Daten & Repo) | `docs/prisma.html`, `docs/js/prisma.js`, `docs/js/prisma-data.js`, `docs/css/prisma.css`, `docs/css/research.css` | Stays. Category constants inside `prisma.js` and `prisma-data.js` are replaced (see Step 3) |
| PRISMA 2020 flow logic and the PRISMA-trAIce checklist items | hardcoded in `docs/js/prisma.js` (`TRAICE` array, flow and checklist rendering) | Stays. These are reporting standards, not review content |
| Reviewer file persistence (one JSON per reviewer, schema `femprompt-prisma-reviewer/0.2`) | `docs/data/screening/` plus its `README.md` | Stays. The decision files themselves are of course your own |
| Record generation (flow diagram, agreement, checklist, disclosure, generated from screening data) | inside `docs/js/prisma.js` | Stays |
| Corpus search index builder | `scripts/build_screening_index.py` | Stays, reads whatever corpus you generate |
| LLM batch assessment runner (prompt is assembled from the category config at runtime) | `benchmark/scripts/run_llm_assessment.py` | Stays. Model id and parameters are yours to set and disclose |
| Agreement and disagreement analysis | `benchmark/scripts/calculate_agreement.py`, `benchmark/scripts/analyze_disagreements.py` | Stays |
| Verification discipline (every published number recomputed from committed script output, prompts under version governance, conformance mapping) | practice, plus `prompts/CHANGELOG.md` as the pattern | Stays. This is the point of the exercise |
| Category schema (definitions, groups, include rule, exclusion vocabulary) | `benchmark/config/categories.yaml` | Replaced |
| Corpus metadata | `corpus/zotero_export.json` | Replaced |
| Search prompts | `prompts/deep-research-template.md`, documented in `prompts/CHANGELOG.md` | Replaced (the changelog governance pattern stays) |
| Assessment data | `benchmark/data/*.csv`, `benchmark/results/*` | Replaced (regenerated from your corpus) |
| Tool data files | `docs/data/research_vault_v2.json`, `docs/data/fulltext_index.json`, `docs/vault/` | Replaced (regenerated) |
| Raw full texts and PDFs | `pipeline/pdfs/`, `pipeline/markdown_clean/` | Replaced. Never published, local clone only |
| Project documentation | `knowledge/` | Replaced by your own promptotyping documents |

One decision is still open in [[plan]] C3: whether PRISM stays inside this repository or becomes a standalone repository seeded with a neutral demo corpus. Until that is decided, reuse means copying the files listed below into your own repository.

## The data contract: what the tool actually loads

All loading happens relative to `docs/` (the GitHub Pages root). From `docs/js/prisma-data.js` and `docs/js/prisma.js`:

1. `docs/data/research_vault_v2.json`, fetched once by `prisma-data.js` (`fetch('data/research_vault_v2.json')`). This is the corpus the tool screens. Required top-level keys: `meta` (object), `kappa_by_category` (object, may be empty `{}` for a fresh review), `papers` (array).
2. `docs/data/fulltext_index.json`, fetched by `loadCorpusIndex()` in `prisma.js`. Powers corpus-wide search. Optional: if the fetch fails the tool logs a warning and corpus search is simply empty.
3. Per paper, the served knowledge document at the relative path in the paper's `knowledge_doc` field (in this repo `vault/Papers/<title>.md`), fetched lazily by `fetchPaperText()`. If `knowledge_doc` is `null` or the fetch fails, the tool falls back to the abstract. `fetchPaperText()` is the single seam for changing the reading source.
4. `docs/data/screening/<reviewer>.json`, written via the File System Access API when a directory is connected (Chromium browsers), with export and import as the fallback path for all other browsers.

Minimal paper object in `papers`, taken from the shape of the committed `docs/data/research_vault_v2.json`:

```json
{
  "id": "UNIQUE_KEY",
  "title": "…",
  "author_year": "Author et al. (YYYY)",
  "authors": "Last, First; Last, First",
  "year": 2026,
  "doi": "",
  "url": "",
  "abstract": "…",
  "item_type": "journalarticle",
  "journal": "",
  "knowledge_doc": null,
  "llm": null,
  "human": null
}
```

`llm` and `human` may both be `null`; the tool guards for this (`aiProposal()` and `seedDecision()` in `prisma.js`). A fresh foreign review therefore starts with metadata only and fills the tracks as it goes. When present, `llm` carries `decision`, `categories` (array of names), `all_categories` (name to 0/1 map), `reasoning`; `human` carries `decision`, `categories`, `all_categories`. The `id` must be stable and unique, it is the key in every reviewer file and log.

## Step by step: from empty folder to first screening

### Step 1: Copy the machinery

Create your repository and copy these files, keeping the relative layout:

```
docs/prisma.html
docs/js/prisma.js
docs/js/prisma-data.js
docs/css/prisma.css
docs/css/research.css
docs/data/screening/README.md
docs/.nojekyll
scripts/build_screening_index.py
benchmark/config/categories.yaml        (as template, you rewrite it)
benchmark/scripts/generate_papers_csv.py
benchmark/scripts/run_llm_assessment.py
benchmark/scripts/calculate_agreement.py
benchmark/scripts/analyze_disagreements.py
prompts/CHANGELOG.md                    (as template, you empty it)
requirements.txt
```

`docs/prisma.html` loads only the two JS files and the two CSS files above plus Google Fonts; there is no build step and no framework. The Python scripts need the packages in `requirements.txt` (the assessment runner needs `anthropic` and `yaml`).

### Step 2: Define your categories

Rewrite `benchmark/config/categories.yaml`. This file is the single source of truth for the assessment prompt and the import validation. For each category: `name` (the technical key, no spaces, used everywhere downstream), `definition`, `type: binary`, `group`, positive and negative examples. Then:

- `decision.include_criteria`: your inclusion rule in prose. The original rule is two-pool: include if at least one category from the technik group and at least one from the sozial group is yes.
- `exclusion_reasons`: your controlled vocabulary. The tool refuses free-text reasons; the import validation (planned P3 bridge, see [[plan]]) flags out-of-vocabulary values. The data hygiene lesson from this project's first round, recorded in [[conformance-audit]], is that uncontrolled capture produces out-of-vocabulary values and empty cells, so fix the vocabulary before anyone screens.
- `study_types`: optional list if you capture study type.

### Step 3: Mirror the categories in the tool

The tool does not read `categories.yaml` (it is a static page without a YAML loader). The category constants are duplicated in the JavaScript and must be edited by hand, all near the top of the files:

In `docs/js/prisma.js`:

- `TECH_CATS` and `SOCIAL_CATS`: your category keys, split into the two pools of the include rule. If your review has a different decision logic than "at least one from each pool", also change `deriveDecision(cats)`, the one function that turns a category pattern into Include or Exclude.
- `CAT_LABELS`: key to display label.
- `CAT_DEFS`: key to one-sentence definition (the chip tooltips).
- `EXCLUSION_REASONS`: must match `exclusion_reasons` in your `categories.yaml` exactly.
- `MODEL_DEFAULT`: name, id, date, prompt version and parameters of your LLM assessment, this feeds the generated disclosure text. If you run no LLM track, leave it, the disclosure reports what the data shows.

In `docs/js/prisma-data.js`:

- `CAT_COLORS`: key to hex color for the category chips.

This duplication (YAML, prisma.js, prisma-data.js) is a known manual synchronization risk; there is no generator. Check the three places against each other before the first screening.

### Step 4: Build your corpus

Export your library from Zotero (or any reference manager) and place the export as `corpus/zotero_export.json`. Run `benchmark/scripts/generate_papers_csv.py` to produce `benchmark/data/papers_full.csv`, the flat metadata table the assessment runner reads. The script also looks for `benchmark/data/human_assessment.csv` to flag papers that already have a human decision; on a fresh review that file does not exist yet, the script prints a warning and proceeds. If you do not use Zotero, produce a CSV with the same columns by other means; the column shape is the header of the committed `benchmark/data/papers_full.csv`.

If your corpus comes from deep-research prompts: version the prompt in `prompts/`, log it in `prompts/CHANGELOG.md` before the first run, and keep the raw outputs (RIS exports). The non-recoverable losses in this project's first round (exact executed prompt text never committed, see `prompts/CHANGELOG.md`) are the cautionary tale: nothing about acquisition is auditable later unless it is committed at the time.

### Step 5: Optional LLM batch assessment

If you want the advisory AI track from the start, write a pre-specified protocol first (sample, prompt version, model id, parameters, stopping criteria) and commit it before the run. This is PRISMA-trAIce item M1; the retrospective audit of this project's first round ([[conformance-audit]]) names the missing pre-specified protocol as a gap that cannot be repaired afterwards.

Then run:

```
python benchmark/scripts/run_llm_assessment.py --input benchmark/data/papers_full.csv --config benchmark/config/categories.yaml --output benchmark/data/llm_assessment.csv
```

The prompt is assembled at runtime from your `categories.yaml` (definitions, examples, include rule), so replacing the categories replaces the prompt. Record model id, temperature, max tokens and prompt version; they go into `MODEL_DEFAULT` (Step 3) and the disclosure. Cost figures, if you report them, are factual disclosure, nothing more.

The human track is captured wherever your reviewers work; in this project that is an Excel sheet whose column shape is `benchmark/data/human_assessment.csv`, imported downstream (the P3 bridge in [[plan]]).

### Step 6: Generate the tool corpus file

Produce `docs/data/research_vault_v2.json` in the shape of the data contract above. In this repository the file is emitted by `scripts/generate_vault_v2.py`, but that script is coupled to this project's specifics (knowledge documents, divergence notes, concept extraction) and is not the reuse path. For a foreign review, write a small builder that maps your `papers_full.csv` plus your assessment CSVs into the JSON shape, with `kappa_by_category: {}` and a minimal `meta`. This builder does not yet exist as a committed generic script; until it does, the data contract section above is its specification.

If you have per-paper reading documents you are allowed to publish, place them under `docs/` (this repo uses `docs/vault/Papers/`) and set each paper's `knowledge_doc` to the relative path. If not, leave `knowledge_doc: null`; the tool reads the abstract.

### Step 7: Build the search index

```
python scripts/build_screening_index.py
```

Reads `docs/data/research_vault_v2.json` and each served `knowledge_doc`, falls back to the abstract, and writes `docs/data/fulltext_index.json`. The script deliberately does not read unpublished raw texts; it publishes nothing that is not already served. Skip this step if you can live without corpus-wide search at first.

### Step 8: Set up the screening folder

Keep `docs/data/screening/` with its `README.md`. Decide reviewer identifiers before anything is pushed to a public repository: use neutral ids (r1, r2), not names or recognizable short keys. Each reviewer's decisions live in their own file (`r1.json`, `r2.json`), which keeps Git merges conflict-free and matches independent dual review (PRISMA-trAIce M8).

### Step 9: Serve and screen the first paper

Locally:

```
cd docs
python -m http.server
```

Open `http://localhost:8000/prisma.html`. The page does not work from `file://`. For the team, publish via GitHub Pages serving `docs/`.

First screening pass: open the tab "Daten & Repo", set your reviewer key, and either connect the `docs/data/screening/` folder of your local clone (Chromium browsers, decisions are written directly into your reviewer file) or rely on export and import (any browser, exchange the JSON file by download). Switch to "Screening", open the first paper, read, search in the text, pin evidence passages to categories, set the categories, accept or override the derived decision, choose an exclusion reason from the controlled vocabulary if excluding, and commit the decision. Then commit the reviewer file to Git:

```
git add docs/data/screening/r1.json
git commit -m "screening: first paper (r1)"
```

The "PRISMA & Report" surface now shows the flow, agreement (once a second track exists), checklist and generated disclosure for whatever has been recorded. That is the test that the machinery is alive.

### Step 10: Keep the record discipline

From the first paper on: prompts only under version governance, every exclusion against the controlled vocabulary, every outward-facing number recomputed from committed script output (`benchmark/scripts/calculate_agreement.py` writes `benchmark/results/`), protocol documents committed before runs, and the human decision always the binding record with the AI track stored separately and advisory. The machinery enforces some of this; the rest is practice, and it is the part that makes the record citable.

## Validation checklist for the dress rehearsal

This document leaves draft status when an external person, working only from this document and the copied files, confirms:

1. The tool loads a foreign corpus JSON built to the data contract (Step 6) without code changes beyond Step 3.
2. The category replacement in Step 3 is complete (no leftover category key from this project appears anywhere in the UI).
3. A full screening decision with pinned evidence round-trips into the reviewer file and back after reload.
4. The generated flow, checklist and disclosure reflect the foreign review's data, not residue from this one.
5. Every step's command runs as written on a clean machine with `requirements.txt` installed.

Discrepancies found in the rehearsal are fixed here, not worked around.

## Related

- [[plan]], Stage C3: the reuse decision and the done criterion this document serves
- [[data]]: data architecture of the original review
- [[specification]]: ADRs that explain why the machinery is shaped this way
- [[conformance-audit]]: the gaps a review accumulates when the record discipline starts too late
