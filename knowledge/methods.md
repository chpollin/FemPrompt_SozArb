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
updated: 2026-07-18
authors: [Christopher Pollin]
generated-with: Claude Code
topics: ["[[Systematic Review]]", "[[PRISMA]]"]
related: [project, data, standards, plan, update-protocol, research-vault]
---

This document describes how the systematic literature review was conducted, from methodological rationale to technical implementation. It carries both the conducted chain, from identification through acquisition, distillation, dual assessment, and screening to the build of `research-vault/`, and the methodological depth at each stage. The theoretical foundations are in [[project]] and the reporting standards in [[standards]]. The corpus and pipeline figures live in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion. Concrete quantities are not restated here; the method is described by its structure, not by its run statistics. Dated snapshots of distributions live in artefacts such as `research-vault/waitlist.md`; fixed run dates of completed runs are exempt.

Two knowledge places frame the chain. `knowledge/` carries the steering knowledge about the work, `research-vault/` the object knowledge about what the literature says on the research question, with evidence chain and verification status ([[research-vault]]). The governing principle of the whole workflow is the responsibility asymmetry: every machine stage is advisory, and at defined points the human alone decides bindingly.

## The chain in overview

| Stage | Period | Tool | Binding human stage |
|---|---|---|---|
| 1 Identification round 1 | October 2025 | four deep-research systems, manual search, Zotero | Zotero curation |
| 2 Acquisition and text conversion | from November 2025 | `src/acquire/`, Docling | Markdown review |
| 3 Distillation (SKE) | from November 2025 | `src/distill/distill_knowledge.py` | none, output advisory |
| 4 Dual assessment and benchmark | until March 2026 | Excel/Google Sheets, `src/assess/` | expert track (binding) |
| 5 PRISM and Evidence Companion | February to July 2026 | `docs/` (vanilla JS, GitHub Pages) | PRISM screening |
| 6 Preregistration and analysis-field freeze | June to July 2026 | [[update-protocol]], `assessment/categories.yaml` | operator freeze and amendments |
| 7 Identification round 2 | from 2026-07-17 | lanes L1 to L3 and L5, Zotero | Zotero curation, PRISM screening (open) |
| 8 Distillate audit | 2026-07-17 to 2026-07-18 | `src/assess/evidence_audit.py`, `waitlist_resolution.py` | stage-3 verification (open) |
| 9 research-vault | from 2026-07-17 | `src/publish/build_research_vault.py`, `check_claims.py` | stage-3 verification, `verified` status (open) |

## System requirements

Python 3.8 or later, on Windows, macOS, or Linux. Core packages installed via `pip install -r requirements.txt`: `anthropic` (Claude API), `pandas` and `openpyxl` (Excel processing), `pyzotero` (Zotero API), `docling` (PDF conversion), `pdfplumber` (PDF analysis), `python-dotenv` (environment). Environment variables in a `.env` file (not committed): `ANTHROPIC_API_KEY`, `ZOTERO_API_KEY`.

## PRISMA 2020 framework

The workflow follows PRISMA 2020 for systematic reviews: the checklist structures identification, screening, and eligibility assessment; the flow diagram documents the selection process with quantification at each phase; exclusion reasons are specified explicitly. The reporting standard and its AI extensions are detailed in [[standards]]. Under ADR-019 in [[specification]], PRISM is now the binding screening surface through which the review data is carried, with the round-1 corpus replayed and screened in the tool and the published record completing that pass; the staged completion is tracked in [[plan]].

Deviation from standard database searches. Identification uses AI-assisted deep research instead of traditional database searches: four models (ChatGPT, Claude, Gemini, Perplexity) receive identical context-parameterized instructions, supplemented by a limited manual search. The deviation is explicitly documented and justified; the motivation is testing a new technology, not reducing effort. The executed deep-research prompts were not committed at run time and are partly lost; only the parametric template was restored from Git history (see `prompts/CHANGELOG.md`).

## Stage 1: Identification round 1 (deep research and manual search)

In place of classical database searches, four deep-research systems (ChatGPT, Claude, Gemini, Perplexity) ran with an identical prompt, supplemented by a limited manual search. Execution lay with the operator, results were converted to RIS by LLM and imported into model-specific Zotero collections.

Parametric prompt. All four models receive identical prompts containing a role (literature-review specialist for feminist AI research), a task (an annotated bibliography with structured metadata), context (research objectives, temporal scope, geographic focus), analysis steps (peer-reviewed prioritized), and an output format (APA 7, a short summary, a relevance score).

Execution. Manual copy-paste into the four deep-research interfaces; results stored in Zotero collections with a `_DEEPRESEARCH` prefix.

RIS standardization. Heterogeneous model outputs are converted to RIS format with the standard fields (document type, authors, title, journal, volume, issue, pages, year, DOI, abstract, keywords). Quality assurance: DOI validation against CrossRef patterns, uncertain entries marked with an N1 note. The round-1 conversion is documented but not reproducible; the round-2 procedure is binding and is in [[update-protocol]].

Zotero integration. Sequential import of RIS files into model-specific collections with provenance preserved; duplicate detection via title matching and DOI comparison; metadata correction; PDF attachment via browser integration. Export: `corpus/zotero_export.json` for pipeline input, `corpus/papers_metadata.csv` for metadata analysis, `corpus/source_tool_mapping.json` for provenance tracking.

Artefacts (committed): `corpus/deep-research/*.ris`, `prompts/deep-research-template.md`, `prompts/CHANGELOG.md`, `corpus/zotero_export.json`, `corpus/papers_metadata.csv`, `corpus/source_tool_mapping.json`.

Named gaps. The exactly instantiated round-1 prompt was not committed at run time and is lost; only the parametric template was restored from Git history. The RIS conversion is documented but not reproducible. A preregistered protocol was absent (PRISMA-trAIce M1). All three gaps are named in [[standards]], not hidden.

Binding human stage. Zotero curation, meaning import, duplicate checking, metadata correction, and PDF attachments in the group library.

## Stage 2: Acquisition and text conversion

PDF acquisition over four fallback strategies (Zotero, DOI, Unpaywall, ArXiv), conversion to Markdown with Docling, four-layer validation, conservative post-processing.

- Scripts: `src/acquire/download_zotero_pdfs.py`, `acquire_pdfs.py`, `convert_to_markdown.py`, `validate_markdown_enhanced.py`, `postprocess_markdown.py`.
- Artefacts: `generated/markdown_clean/` is committed and is the canonical full-text basis of all later checks; PDFs (`generated/pdfs/`) and validation reports stay local (gitignored).
- Binding human stage: the Markdown review in the dual-pane tool `src/distill/markdown_reviewer.html` (PASS, WARN, FAIL).
- Known failure mode, proven by machine in stage 8: individual full-text files contain a foreign paper (acquisition error), registered in `research-vault/waitlist.md`.

Pipeline steps, acquisition scripts in `src/acquire/` and distillation scripts in `src/distill/`, full parameters via `--help`:

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

## Stage 3: Distillation (Structured Knowledge Extraction)

Knowledge distillation (3-stage SKE). Stage 1 extracts and classifies (Markdown to JSON, an API call); stage 2 formats Markdown from the JSON locally with no API call; stage 3 verifies the formatted document against the original (an API call) and writes a confidence score, with a `needs_correction` flag below the threshold. Key parameters of `distill_knowledge.py`: `--input`, `--output`, `--limit`, `--delay`. The motivation is context rot; the terms are defined in the [[INDEX]] glossary.

- Script: `src/distill/distill_knowledge.py`; artefacts committed under `generated/distilled/` including `_stage1_json/` and `_verification/`.
- The category booleans in the stage-1 JSON are the authoritative category assignment of the distillates, not the Markdown.
- The distillates are machine raw material and stay advisory; their evidence quality was first checked systematically in stage 8.
- Binding human stage: none. The output is advisory.

## Stage 4: Assessment (dual assessment track)

Epistemological rationale. The dual assessment track is the methodological centerpiece. The decision for parallel mode, not sequential, is deliberate: a sequential arrangement would have limited the LLM track to a preparatory function, while parallel mode enables systematic comparison and reveals where the epistemic contributions converge and diverge. Dual refers to two characteristics at once, two independent assessment instances (expert reviewers and LLM) and two different epistemic foundations. Both tracks operate on PRISMA guidelines, identical criteria with different epistemic foundations; the separation protects the expert reviewers from having LLM results influence their assessment. The LLM track ran without knowledge of the human judgments; the comparison is reported as divergence, never as an error rate, because round 1 has no inter-human baseline.

Categories. Ten categories in two dimensions, defined canonically in `assessment/categories.yaml` and not redefined here:

- Technology: AI_Literacies, Generative_KI, Prompting, KI_Sonstige.
- Social: Soziale_Arbeit, Bias_Ungleichheit, Gender, Diversitaet, Feministisch, Fairness.

Scoring. The completed benchmark tracks scored the categories binary (Yes/No). The PRISM screening (ADR-024, [[specification]]) scores them three-level, nein/teilweise/ja, and derives a three-way decision: both dimensions ja yields Include, both at least teilweise yields Unclear, any dimension entirely nein yields Exclude. The existing binary annotations are read as-is. Exclusion reasons (controlled): Duplicate, Not_relevant_topic, Wrong_publication_type, No_full_text, Language.

Expert track (epistemically authoritative). Researchers from social work, gender and diversity studies, and technology studies assess each study against the ten categories in the established spreadsheet workflow. This is the epistemically authoritative reference track, because accountability and responsibility reside only here.

LLM track (two assessment systems). A 5D system (five relevance dimensions, ordinal 0 to 3) for exploratory screening and prioritization, and a 10K system (the ten binary categories, Yes/No) for the benchmark against the human assessment. Both run on Claude Haiku 4.5; the 10K run is the benchmark basis.

Human-LLM benchmark. The benchmark compares the human and LLM assessment and adapts the approach of Woelfle et al. (2024). Reference literature for the human inter-rater baseline: Woelfle et al. (2024, parallel human-AI assessment), Hanegraaf et al. (2024, human IRR across abstract and full-text screening), and Sandner et al. (2025, the LLM deviating from the human reference no more than human raters deviate from each other). The project's own confusion matrix, base rates, and divergence live in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion; the primary metrics are the confusion matrix and the base-rate comparison, with Cohen's kappa reported only as a comparison anchor (decision of 2026-02-22, [[journal]]).

Artefacts: `assessment/human_assessment.csv` (the binding track), `assessment/llm_assessment_*.csv`, `assessment/merged_*.csv`, the archived 5D track under `assessment/llm-5d/`; results in `generated/benchmark-results/` and `docs/data/`, rendered in the Evidence Companion.

Benchmark scripts (in `src/assess/`): `generate_papers_csv.py` (Zotero JSON to papers_full.csv), `run_llm_assessment.py` (the 10K assessment), `merge_assessments.py` (merge human and LLM strictly by Zotero_Key, after the merge bug fixed on 2026-03-27), `calculate_agreement.py` (Cohen's kappa and confusion matrix), `analyze_disagreements.py` (disagreement identification).

Binding human stage: the expert track. The human decision is the binding record of the review; the LLM track is advisory in every round.

## Stage 5: PRISM as the binding screening surface

PRISM (`docs/prisma.html`, not to be confused with the PRISMA standard) is the evidence-backed screening tool where a record is read, searched, a piece of evidence pinned per category, and the decision derived. The path there, with dates:

- ADR-019 (2026-06-29), PRISM is the binding screening surface, Excel remains the entry seam over the import bridge (P3).
- ADR-020/021 (2026-06-30), one working workspace, reviewer identity from the Git commit author, deterministically serialized decision files.
- ADR-022/023 (2026-06-30), the faulty machine category evidence removed, a reason-obligated override to Include (RAISE P3).
- ADR-024 (2026-07-01), three-level categories (nein/teilweise/ja) with the derived three-way decision Include/Unclear/Exclude.
- Full text local (2026-07-01), `src/publish/build_fulltext.py` builds the reading layer `docs/data/fulltext/` from `generated/markdown_clean/`; it is gitignored because copyright-protected, and publicly the tool falls back to knowledge document and abstract.

The human decision in PRISM is the binding record, every AI contribution marked as such (evidence provenance `origin`, AI suggestion collapsed). The retrospective replay of the round-1 data through PRISM (Stage R) and the round-2 pass (Stage B) are steered in [[plan]]; the conformance state per PRISMA and trAIce item is in [[standards]].

## Stage 6: Preregistration round 2 and analysis-field freeze

Because round 1 had no protocol fixed in advance, the second round was preregistered prospectively. [[update-protocol]] binds the search window, lanes, prompt, dedup procedure, screening procedure, metrics, and roles (neutral ids R1, R2, OP, LLM, AG), committed before the first run; changes after that only as dated amendments.

In parallel, the analysis question was operationalized (TP4 in [[plan]]). The chain with dates:

1. Analysis-field design with sub-questions SQ1 to SQ3 and closed vocabularies in [[update-protocol]], sections A to F.
2. Advisory LLM pilot on a stratified sample of already-included papers, fill rates and ambiguities in [[update-protocol]] (2026-07-17).
3. Operator clarification of the study aim and freeze (2026-07-17); the analysis fields stand as the `analysis_fields` block in `assessment/categories.yaml` v1.3, including the new field `AN_Prompting_Role`; the eligibility content stayed unchanged at v1.2. The pilot revisions are frozen in section B.1 of the protocol.
4. The five §10 open points of the preregistration were answered on 2026-07-17 by dated amendment, documented in `corpus/deep-research/round2/LAUFPROTOKOLL.md` (prompt provenance, window July 2025 to June 2026, freeze before screening start rather than before first search, full-batch screening, L5 yes).

Binding human stage: the operator freeze and the amendments.

## Stage 7: Identification round 2

Execution from 2026-07-17, logged per lane in `corpus/deep-research/round2/LAUFPROTOKOLL.md`, raw outputs unchanged under `round2/raw/`, RIS files committed alongside, the Gemini prose conversion with a verbatim committed conversion prompt and spot-check.

- L1 ChatGPT, L2 Claude, L3 Gemini ran; L4 Perplexity is dropped in round 2 (operator amendment 2026-07-17, no more access); L5 Claude Code web research ran as a documented additional lane.
- Dedup ran preregistered before screening, by DOI and normalized title against the existing corpus and within the round, no match against round 1.
- Zotero import L1 to L3 is done (operator, 2026-07-17), `corpus/source_tool_mapping.json` regenerated; the import of the L5 RIS is outstanding.
- An advisory LLM screening pass over the distinct round-2 candidates lies in `assessment/round2-screening-advisory.md` (2026-07-17, result distribution there). It is advisory; the binding decision is the human pass in PRISM, still outstanding.

Binding human stage: Zotero curation and the PRISM screening pass, the latter still outstanding.

## Stage 8: Distillate audit against the paraphrase-not-quote error class

Precondition of the research-vault migration ([[research-vault]]). The check is whether category evidence of the distillates marked as a quote stands character-exact in the committed full text.

1. Stage 1, deterministic pre-check (2026-07-17), `src/assess/evidence_audit.py`, finding classes OK, P, F, D, G.
2. Stage 2, adversarial machine check of the hard candidates, advisory (2026-07-17).
3. Stage 1b, deterministic re-check (2026-07-18), `src/assess/waitlist_resolution.py`, an artefact-tolerant contiguous-verbatim re-match that fully resolved the D class and proved a large part of the F candidates to be matcher or Docling artefacts.
4. Stage 3, the binding human verification of the remaining F, G, and U cases, is outstanding; the order by severity is fixed in `research-vault/waitlist.md`.

The check reports (`generated/distilled/_evidence_audit/`) are gitignored and local; the deterministic stages are regenerable from the committed inputs, the advisory stage-2 judgments as LLM judgments are not. Side finding of a shingle-Jaccard scan over the full texts: source-duplicate groups and the acquisition errors named in stage 2.

Binding human stage: the stage-3 verification, outstanding.

## Stage 9: research-vault

The top-level folder `research-vault/` carries the object knowledge on the five-stage grounded-vault model with strict downward reference, source, representation, distillate, claim, deliverable ([[research-vault]], rules in `research-vault/README.md`). Decision with date (operator, 2026-07-17): `generated/distilled/` stays pipeline output, `research-vault/` is the curated evidence-chain source; migration is not copying but the anchoring check against the origin.

- Skeleton and first migration wave 2026-07-17, rebuild after stage 1b on 2026-07-18 with `src/publish/build_research_vault.py`; every migrated distillate carries `audit`, `audit-stage1b`, and `reference` in the frontmatter, one CSL-JSON record per source in `references/`.
- Claims layer `20_claims/` with topic maps and atomic claims on core-finding anchors, deterministically checked with `src/publish/check_claims.py`; contradictory evidence carries `contested`.
- `_sources/` and `00_representation/` are gitignored and never exist in the public repo (license and push block); dead anchors to these layers are the expected consequence of the block, not an integrity error.
- Status ladder: `grounded` and `validated` set machine checks, `verified` is set by the human expert alone. The migrated distillates carry `migrated` because the anchor layer `00_representation/` is not yet built.
- What is not migrated is registered in `research-vault/waitlist.md` with finding class and reason (dated snapshot of the distribution there) and waits for the stage-3 verification.

Binding human stage: the stage-3 verification and the `verified` status.

## The binding human stages in the workflow

1. **Zotero curation** (stages 1 and 7). Import from committed RIS files, duplicate merge with a documented match reason, metadata correction. The duplicate merge of the round-2 and vault findings is open on the operator side.
2. **Expert track and PRISM screening** (stages 4, 5, 7). The human decision is the binding record of the review; the LLM track is advisory in every round. For round 2 the human pass is outstanding.
3. **Stage-3 verification** (stages 8 and 9). Only the human check decides the remaining F, G, and U cases of the waitlist and sets the status `verified` in the research-vault.
4. **Operator gates.** Freeze of the analysis fields, preregistration amendments, migration releases, and the merge to `main` are dated human decisions, held as ADRs in [[specification]], as amendments in [[update-protocol]], and in the `LAUFPROTOKOLL.md`.

## What is committed and what stays local

| Artefact | Location | Status |
|---|---|---|
| RIS, Zotero export, provenance mapping | `corpus/` | committed |
| full texts converted | `generated/markdown_clean/` | committed |
| PDFs, validation reports, audit reports | `generated/pdfs/`, `generated/validation_reports*/`, `generated/distilled/_evidence_audit/` | local, gitignored |
| distillates (pipeline output) | `generated/distilled/` including `_stage1_json/`, `_verification/` | committed |
| assessment data of both tracks | `assessment/` | committed |
| benchmark results, Companion data | `generated/benchmark-results/`, `docs/data/` | committed |
| PRISM full-text reading layer | `docs/data/fulltext/` | local, gitignored |
| research-vault, checkable layers | `research-vault/references/`, `10_distillates/`, `20_claims/`, `30_deliverable/` | committed |
| research-vault, protected layers | `research-vault/_sources/`, `00_representation/` | local, gitignored, never pushed |

## Named gaps and open steps (cut-off 2026-07-18)

Retrospectively unrepairable and openly named: no preregistered round-1 protocol (M1), the lost instantiated round-1 prompt, the non-reproducible round-1 RIS conversion, no inter-human baseline in round 1. Open in the forward pass: Zotero import of the L5 RIS with mapping follow-up, the binding human round-2 screening pass, the stage-3 verification of the waitlist, the Zotero duplicate merge, the `00_representation/` anchor layer for the `grounded` status, and the ratification of the simulated stakeholder decisions ([[plan]], Simulated decisions).

## Replay verification (Stage R)

The retrospective PRISMA FlowModel and the benchmark are reproduced from the raw assessment files by a committed, human-checkable path (Stage R, R2/R4 in [[plan]]). The replay rebuilds the flow from the raw CSVs, pairs the two screening tracks on Zotero_Key, computes the decomposed agreement metrics (full decision matrix plus content-only subset), and reproduces the canonical benchmark as a self-test. No count appears in this prose; the numbers are emitted by `src/assess/replay_flow.py` into `generated/benchmark-results/replay_flow.json` and held in the data and the Evidence Companion. The operative reproduction instructions and the human verification checklist live beside the script in `src/assess/README_replay.md`.

Two independent paths. A prior replay apparatus was removed as unverified AI output; it must not return as an unaudited black box. A self-test that imports the very logic it checks proves nothing, so the replay carries two computational paths that never share code.

- **Core path** (`src/assess/replay_flow.py`): the production computation. It loads the raw CSVs, pairs on Zotero_Key, builds the FlowModel, and computes the decomposed metrics. Its output is the emitted report.
- **Self-test path** (`src/assess/replay_selftest.py`): an independent re-derivation. It recomputes the decision confusion matrix and Cohen's kappa from the same raw CSVs by its own arithmetic, without importing anything from the core path, and compares both against `generated/benchmark-results/agreement_metrics.json`. It reports red or green.

Agreement across the two paths, and of both against the canonical benchmark, is what licenses the replay as human-checked. A green self-test means three things agree: the canonical benchmark, the core path, and an independent re-derivation.

FlowModel schema. The FlowModel follows PRISMA 2020's three phases (Identification, Screening, Included), with the trAIce R1 AI-versus-human split inside Screening. Each stage is a named count the script emits.

1. **Identification.** Records in the corpus, sourced from `papers_full.csv` (one row per Zotero record), broken down by `Collections` provenance and `Item_Type`.
2. **Duplicates removed.** Records flagged `Is_Duplicate == Yes` in `papers_full.csv`, cross-checked against the human track's `Exclusion_Reason == Duplicate`. The two duplicate signals are reported separately, since they are detected by different mechanisms; the replay does not collapse them into one authoritative number.
3. **Records screened, per track.** Human track (records with a human decision), LLM track (records with an LLM decision), paired (records in both, the benchmark set), human-only, and LLM-only. The LLM-only records are those without a binding human decision, named in the flow, never silently included ([[standards]] named gap 3).
4. **Excluded, with reasons.** Human exclusions grouped by `Exclusion_Reason`; the workflow-criteria reasons (Duplicate, No full text, Wrong publication type) are tagged as such, because a one-paper-at-a-time LLM cannot see them (the V1 decomposition, [[plan]] section V).
5. **Included.** Records with `Decision == Include`, per track. The human track is the binding record (ADR-019); the LLM Include set is the parallel advisory track, never a binding inclusion.

Pairing key and the 2YS85B49 resolution. Pairing is on `Zotero_Key`, always, never on the sequential `ID` column; a prior merge on an unstable sequential identifier produced plausible-looking but wrong results (the merge bug, [[plan]] V1). The residual pairing discrepancy is resolved and the replay reproduces the resolution rather than reopening it. The key `2YS85B49` is present in `papers_full.csv` with `Has_HA == Yes` and present in the LLM track, yet absent from `human_assessment.csv`. That `Has_HA` flag is stray; there is no missing human decision. Pairing therefore treats presence in `human_assessment.csv` as the sole authority for a human decision and ignores the `Has_HA` flag for the pairing count. The replay asserts this as a guarded check and flags it rather than silently proceeding if the discrepancy has changed.

Metric definitions. All metrics are computed on the decision pairs and per category over the paired set, unless the subset is named. The primary metrics are the confusion matrix and the base-rate comparison; Cohen's kappa `(po - pe) / (1 - pe)` is reported as the comparison anchor. Auxiliary indices isolate what depresses kappa: PABAK (`2 * po - 1` for the two-label decision) isolates the skewed base rate, kappa max expresses the ceiling under the fixed marginals, the bias index (`|b - c| / n`) measures the asymmetry of the disagreement. The confusion matrix is the 3x3 (Include/Exclude/Unclear) decision matrix keyed `{human}_{agent}`, matching `agreement_metrics.json`, and must not be transposed.

Category value normalisation. Category cells carry Ja/Nein or their variants; decisions carry Include/Exclude/Unclear. The replay normalises to a fixed vocabulary before any comparison, case-insensitive. An empty category cell stays empty and drops out of the category pairs, so a category's paired count excludes rows a human left blank; this mirrors `merge_assessments.py` so the core path reproduces the canonical figures, but the code is not imported, it is re-stated so the self-test path normalises independently. The empty-cell rule is load-bearing; mapping empty to Nein instead depresses every per-category kappa below the canonical value. Column-name variances are handled: the human CSV names the diversity category `Diversitaet / Intersektionalität`, the LLM CSV `Diversitaet`, both mapped to canonical `Diversitaet`. Out-of-vocabulary and `Other` exclusion values are surfaced in the report, never silently normalised away.

Content-only subset and the decomposed divergence. The content-only subset is the paired set minus the human records whose `Exclusion_Reason` is a workflow criterion (Duplicate, No full text, Wrong publication type in their human-CSV spelling). On this subset the two tracks' include rates converge and agreement rises. The divergence is reported decomposed, workflow-criteria disagreement separated from content disagreement, before any interpretation ([[plan]] Consequence ledger). No error-rate language is used; no inter-human baseline exists.

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
