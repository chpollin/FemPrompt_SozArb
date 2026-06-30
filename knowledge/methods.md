---
title: Methods and Pipeline
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: complete
language: en
version: "0.2"
created: 2026-02-21
updated: 2026-06-29
authors: [Christopher Pollin]
generated-with: Claude Code
topics: ["[[Systematic Review]]", "[[PRISMA]]"]
related: [project, data, standards]
---

This document describes how the systematic literature review was conducted, from methodological rationale to technical implementation. The theoretical foundations are in [[project]] and the reporting standards in [[standards]]. The corpus and pipeline figures live in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion. Concrete quantities are not restated here; the method is described by its structure, not by its run statistics.

## System requirements

Python 3.8 or later, on Windows, macOS, or Linux. Core packages installed via `pip install -r requirements.txt`: `anthropic` (Claude API), `pandas` and `openpyxl` (Excel processing), `pyzotero` (Zotero API), `docling` (PDF conversion), `pdfplumber` (PDF analysis), `python-dotenv` (environment). Environment variables in a `.env` file (not committed): `ANTHROPIC_API_KEY`, `ZOTERO_API_KEY`.

## PRISMA 2020 framework

The workflow follows PRISMA 2020 for systematic reviews: the checklist structures identification, screening, and eligibility assessment; the flow diagram documents the selection process with quantification at each phase; exclusion reasons are specified explicitly. The reporting standard and its AI extensions are detailed in [[standards]]. Under ADR-019 in [[specification]], PRISM is now the binding screening surface through which the review data is carried, with the round-1 corpus replayed and screened in the tool and the published record completing that pass; the staged completion is tracked in [[plan]].

Deviation from standard database searches. Identification uses AI-assisted deep research instead of traditional database searches: four models (ChatGPT, Claude, Gemini, Perplexity) receive identical context-parameterized instructions, supplemented by a limited manual search. The deviation is explicitly documented and justified; the motivation is testing a new technology, not reducing effort. The executed deep-research prompts were not committed at run time and are partly lost; only the parametric template was restored from Git history (see `prompts/CHANGELOG.md`).

## Phase 1: Identification (deep research and manual search)

Parametric prompt. All four models receive identical prompts containing a role (literature-review specialist for feminist AI research), a task (an annotated bibliography with structured metadata), context (research objectives, temporal scope, geographic focus), analysis steps (peer-reviewed prioritized), and an output format (APA 7, a short summary, a relevance score).

Execution. Manual copy-paste into the four deep-research interfaces; results stored in Zotero collections with a `_DEEPRESEARCH` prefix.

RIS standardization. Heterogeneous model outputs are converted to RIS format with the standard fields (document type, authors, title, journal, volume, issue, pages, year, DOI, abstract, keywords). Quality assurance: DOI validation against CrossRef patterns, uncertain entries marked with an N1 note. The round-1 conversion is documented but not reproducible; the round-2 procedure is binding and is in [[update-protocol]].

Zotero integration. Sequential import of RIS files into model-specific collections with provenance preserved; duplicate detection via title matching and DOI comparison; metadata correction; PDF attachment via browser integration. Export: `corpus/zotero_export.json` for pipeline input, `corpus/papers_metadata.csv` for metadata analysis, `corpus/source_tool_mapping.json` for provenance tracking.

## Phase 2: Assessment (dual assessment track)

Epistemological rationale. The dual assessment track is the methodological centerpiece. The decision for parallel mode, not sequential, is deliberate: a sequential arrangement would have limited the LLM track to a preparatory function, while parallel mode enables systematic comparison and reveals where the epistemic contributions converge and diverge. Dual refers to two characteristics at once, two independent assessment instances (expert reviewers and LLM) and two different epistemic foundations. Both tracks operate on PRISMA guidelines, identical criteria with different epistemic foundations; the separation protects the expert reviewers from having LLM results influence their assessment.

Categories. Ten binary categories in two dimensions, defined canonically in `assessment/categories.yaml` and not redefined here:

- Technology: AI_Literacies, Generative_KI, Prompting, KI_Sonstige.
- Social: Soziale_Arbeit, Bias_Ungleichheit, Gender, Diversitaet, Feministisch, Fairness.

Inclusion logic: a paper is included if at least one technology dimension AND at least one social dimension apply. Exclusion reasons (controlled): Duplicate, Not_relevant_topic, Wrong_publication_type, No_full_text, Language.

Expert track (epistemically authoritative). Researchers from social work, gender and diversity studies, and technology studies assess each study against the ten categories. This is the epistemically authoritative reference track, because accountability and responsibility reside only here.

LLM track (two assessment systems). A 5D system (five relevance dimensions, ordinal 0 to 3) for exploratory screening and prioritization, and a 10K system (the ten binary categories, Yes/No) for the benchmark against the human assessment. Both run on Claude Haiku 4.5; the 10K run is the benchmark basis.

Human-LLM benchmark. The benchmark compares the human and LLM assessment and adapts the approach of Woelfle et al. (2024). Reference literature for the human inter-rater baseline: Woelfle et al. (2024, parallel human-AI assessment), Hanegraaf et al. (2024, human IRR across abstract and full-text screening), and Sandner et al. (2025, the LLM deviating from the human reference no more than human raters deviate from each other). The project's own confusion matrix, base rates, and divergence live in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion; the primary metrics are the confusion matrix and the base-rate comparison, with Cohen's kappa reported only as a comparison anchor.

Benchmark scripts (in `src/assess/`): `generate_papers_csv.py` (Zotero JSON to papers_full.csv), `run_llm_assessment.py` (the 10K assessment), `merge_assessments.py` (merge human and LLM by Zotero_Key), `calculate_agreement.py` (Cohen's kappa and confusion matrix), `analyze_disagreements.py` (disagreement identification).

## Phase 3: Synthesis (PDF to Markdown to knowledge documents)

Pipeline workflow, acquisition scripts in `src/acquire/` and distillation scripts in `src/distill/`, full parameters via `--help`:

| Step | Script | Input | Output |
|---|---|---|---|
| 1. PDF download | `src/acquire/download_zotero_pdfs.py` / `src/acquire/acquire_pdfs.py` | Zotero group | `generated/pdfs/` |
| 2. Markdown conversion | `src/acquire/convert_to_markdown.py` | PDFs | `generated/markdown/` |
| 3. Validation | `src/acquire/validate_markdown_enhanced.py` | Markdown and PDFs | `generated/validation_reports/` |
| 4. Post-processing | `src/acquire/postprocess_markdown.py` | Markdown | `generated/markdown_clean/` |
| 5. Human review | `src/distill/markdown_reviewer.html` | Markdown and PDFs | JSON export |
| 6. Knowledge distillation | `src/distill/distill_knowledge.py` | Markdown | `generated/distilled/` |
| 7. Vault building | `src/publish/generate_vault_v2.py` | Knowledge docs and assessment CSVs | `generated/vault/` |

PDF acquisition uses four fallback strategies in priority order (Zotero, DOI, Unpaywall, ArXiv). A substantial fraction of PDFs sits behind access barriers, and the acquisition, conversion, and distillation chain loses material at each step. Some conversions failed on corrupt or invalid source files and are documented so the gap is named:

- `British_Association_of_Social_Workers_2025_Generat.pdf` (data format error)
- `Browne_2023_Feminist_AI_Critical_Perspectives_on_Algorithms.pdf` (page dimension error)
- `Ulnicane_2024_Intersectionality_in_Artificial_Intelligence.pdf` (conversion failure)
- `UNESCO__IRCAI_2024_Challenging.pdf` (not valid)
- `Workers_2025_Generative.pdf` (not valid)

Validation runs in four layers: syntactic (GLYPH placeholders, Unicode errors), structural (the character ratio between Markdown and PDF), semantic (an optional LLM spot-check), and manual (a review queue prioritized by confidence). Post-processing is a conservative cleanup (hyphenation fix, page-number and header removal). The human review tool `src/distill/markdown_reviewer.html` is a dual-pane browser tool with PASS, WARN, and FAIL keyboard shortcuts.

Knowledge distillation (3-stage SKE). Stage 1 extracts and classifies (Markdown to JSON, an API call); stage 2 formats Markdown from the JSON locally with no API call; stage 3 verifies the formatted document against the original (an API call) and writes a confidence score, with a `needs_correction` flag below the threshold. Key parameters of `distill_knowledge.py`: `--input`, `--output`, `--limit`, `--delay`.

## Quality assessment

Bibliographic validation: DOI validation via the CrossRef API, author disambiguation via ORCID, journal verification against DOAJ and Beall's List. Alternative review standards consulted for the appraisal layer that a reporting standard does not cover: the JBI Manual (pluralistic evidence), Cochrane 6.5 (RoB 2, ROBINS-I), ENTREQ (qualitative syntheses), and MMAT (mixed methods).

## Circularity as a field condition

LLMs are used to examine literature on the use of LLMs; feminist AI literacies are simultaneously the subject of the review and a prerequisite of the workflow. This circularity cannot be resolved and is treated not as a methodological flaw but as a condition of the field.

## Vault v2

`src/publish/generate_vault_v2.py` replaces the flat v1 paper index with an epistemic network of four document types: Paper Notes (assessment frontmatter, transformation trail, concept wikilinks, the knowledge-document full text), Concept Notes (LLM-extracted definitions, frequency, a co-occurrence table, paper backlinks), Pipeline Notes (stage descriptions, prompts extracted from code, configuration), and Divergence Notes (pattern classification, category comparison, LLM reasoning). Concepts are extracted by an LLM call per paper, post-processed by synonym merge and a frequency filter; divergences are classified by an LLM (the canonical classification is Sonnet 4.6). Title matching from the distilled documents to the Zotero records runs a five-strategy cascade (Stage1-JSON title, knowledge-document YAML title, filename prefix, author and year, then `difflib.SequenceMatcher` as fallback). The exact node, concept, and divergence counts are derivations and live in the generated JSON.

## Directory structure

| Directory | Contents |
|---|---|
| `src/acquire/`, `src/distill/` | Python pipeline scripts |
| `src/distill/` | `markdown_reviewer.html` |
| `generated/pdfs/`, `generated/markdown/`, `generated/markdown_clean/` | Downloaded PDFs, converted and post-processed Markdown |
| `generated/distilled/`, `_stage1_json/`, `_verification/` | Distilled documents and intermediate results |
| `assessment/` | `categories.yaml` |
| `src/assess/`, `assessment/`, `generated/benchmark-results/` | Benchmark scripts, assessment data, results |
| `corpus/` | `zotero_export.json`, `papers_metadata.csv`, `source_tool_mapping.json` |
| `docs/`, `docs/data/` | The Evidence Companion and its generated JSON |
| `src/publish/` | `generate_vault_v2.py`, `generate_promptotyping_data_v2.py` |
| `.vault_cache/` | LLM API result cache (not committed, reproducible) |

## Error handling

Windows encoding: `setup_windows_encoding()` in `src/utils.py` configures UTF-8 for Windows consoles. HTTP 429 (rate limit): increase the delay between API calls.
