# Methods and Pipeline

This document describes **how** the systematic literature review was conducted -- from methodological rationale to technical implementation. For theoretical foundations and operationalization, see `project.md`.

---

## System Requirements

### Software

- Python 3.8+
- Windows 10/11, macOS 10.14+, Linux

### Python Packages

Install via `pip install -r requirements.txt`. Core packages:

| Package | Version | Purpose |
|---------|---------|---------|
| anthropic | >=0.68.0 | Claude API |
| pandas, openpyxl | - | Excel processing |
| pyzotero | >=1.5.0 | Zotero API |
| docling | >=2.60.0 | PDF conversion |
| pdfplumber | >=0.10.0 | PDF analysis |
| python-dotenv | >=1.0.0 | Environment |

### Environment Variables

In `.env` file (do not commit):
- `ANTHROPIC_API_KEY` -- Claude API key
- `ZOTERO_API_KEY` -- Zotero API key

---

## PRISMA 2020 Framework

The workflow follows PRISMA 2020 standards for systematic reviews:
- 27-item checklist structures identification, screening, and eligibility assessment
- Flow diagram documents the selection process with quantification at each phase
- Explicit specification of exclusion reasons

### Deviation from Standard Database Searches

The identification phase uses AI-assisted deep research instead of traditional database searches:
- 4 models (ChatGPT, Claude, Gemini, Perplexity) receive identical context-parameterized instructions
- Supplemented by a limited number of manually identified studies (50 of 305 papers in the human assessment)
- The deviation is explicitly documented and justified
- Motivation: testing a new technology, not reducing effort

**Note:** The deep research prompts were deleted from the repository in October 2025. Recovery from Git history required before submission (see `paper-integrity.md`, Section 3.1).

---

## Phase 1: Identification (Deep Research + Manual Search)

### Parametric Prompt

All 4 models receive identical prompts containing:

1. **Role:** Literature review specialist for feminist AI research
2. **Task:** Annotated bibliography with structured metadata
3. **Context:** Research objectives, temporal scope, geographic focus
4. **Analysis steps:** 20-30 publications, peer-reviewed prioritized
5. **Output format:** APA 7, 150-200 word summary, relevance score

### Execution

- Manual copy-paste into 4 deep research interfaces
- Results stored in Zotero collections with prefix "_DEEPRESEARCH"
- Typically 3-15 recommendations per model

### RIS Standardization

Heterogeneous model outputs are converted to RIS format.

**Standard fields:** Document type (TY), Authors (AU), Title (TI), Journal (JO), Volume (VL), Issue (IS), Pages (SP/EP), Year (PY), DOI (DO), Abstract (AB), Keywords (KW)

**Quality assurance:**
- DOI validation against CrossRef patterns
- Uncertain entries marked with N1 note
- Temporary conversion via Claude project

### Zotero Integration

**Import:** Sequential import of RIS files, model-specific collections (claude_, gemini_, openai_, perplexity_), provenance information preserved

**Quality control:** Duplicate detection via title matching and DOI comparison, metadata correction (ORCID, journal names), PDF attachment via browser integration

**Export:** `corpus/zotero_export.json` for pipeline input, `corpus/papers_metadata.csv` for metadata analysis, `corpus/source_tool_mapping.json` for provenance tracking

---

## Phase 2: Assessment (Dual Assessment Track)

### Epistemological Rationale

The dual assessment track is the methodological centerpiece of the workflow. The decision for parallel mode (not sequential) is deliberate: a sequential arrangement would have limited the LLM track to a preparatory function. Parallel mode enables systematic comparison and reveals where the epistemic contributions converge and where they diverge.

**Dual** refers to two characteristics simultaneously:
1. Two independent assessment instances (expert reviewers and LLM)
2. Two different epistemic foundations for assessment

Both tracks operate on the basis of PRISMA guidelines: identical criteria with different epistemic foundations. The separation protects the expert reviewers from having LLM results influence their own assessment.

### Human Assessment (10 Binary Categories)

**Research question:**
> To what extent do the topics or the intersection of feminist AI literacies, generative AI / prompting, and social work appear in the scientific literature?

**Technology dimensions (Yes/No):**

| Category | Description |
|----------|-------------|
| AI_Literacies | AI competencies, critical reflection, applied competence |
| Generative_KI | LLMs, ChatGPT, image generators |
| Prompting | Prompt engineering, input design |
| KI_Sonstige | Classical ML, algorithmic systems, predictive analytics |

**Social dimensions (Yes/No):**

| Category | Description |
|----------|-------------|
| Soziale_Arbeit | Practice, theory, education, target populations |
| Bias_Ungleichheit | Discrimination, algorithmic bias, structural disadvantage |
| Gender | Gender perspective, gender bias |
| Diversitaet | Diversity, inclusion, representation |
| Feministisch | Feminist theory, methodology, perspective (including implicit) |
| Fairness | Algorithmic fairness, fair ML systems |

**Inclusion logic:** A paper is included if **at least one technology dimension** AND **at least one social dimension** apply.

**Exclusion reasons:** Duplicate, Not_relevant_topic, Wrong_publication_type, No_full_text, Language

**Configuration file:** `benchmark/config/categories.yaml`

### Expert Track (Epistemically Authoritative)

Researchers from social work, gender/diversity studies, and technology studies assess each study according to 10 binary categories. This track is the epistemically authoritative reference track, because accountability and responsibility reside only here.

### LLM Track (Two Assessment Systems)

| System | Schema | Scale | Purpose | Status |
|--------|--------|-------|---------|--------|
| **5D** | 5 relevance dimensions | Ordinal (0-3) | Exploratory screening and prioritization | Complete (325/325) |
| **10K** | 10 binary categories | Yes/No | Benchmark against human assessment (Cohen's Kappa) | Complete (326/326, $1.44) |

### Human-LLM Benchmark

The benchmark compares human and LLM assessment and adapts the approach of Woelfle et al. (2024).

**Reference literature:**

| Study | Design | Key Kappa values | Relevance |
|-------|--------|-------------------|-----------|
| Woelfle et al. (2024) | Parallel human-AI assessment, 5 LLMs, 3 instruments | Human IRR: kappa 0.84 (PRISMA), 0.77 (AMSTAR), 0.29 (PRECIS-2) | Methodological template |
| Hanegraaf et al. (2024) | Systematic review (45 SLRs) + survey | Human IRR: kappa 0.82 (Abstract), 0.77 (Full-Text) | Human baseline |
| Sandner et al. (2025) | 54 students, 10 teams, 30 papers per team | Fleiss kappa 0.39 (novices), Cohen's kappa human-LLM: 0.52 | LLM deviates no more than humans |

**Primary metrics:** Confusion matrix, base rate comparison, disagreement analysis. Cohen's Kappa reported as comparison anchor. Basis: 291 papers with both assessments, kappa 0.056 ("slight"), category kappas 0.39-0.82. Details: `knowledge/status.md` M6.

**Benchmark scripts:**

| Script | Function |
|--------|----------|
| `benchmark/scripts/generate_papers_csv.py` | Zotero JSON -> papers_full.csv (326 rows) |
| `benchmark/scripts/run_llm_assessment.py` | Benchmark assessment (10K, 326/326) |
| `benchmark/scripts/merge_assessments.py` | Merge human + LLM (by Zotero_Key, 291 overlap) |
| `benchmark/scripts/calculate_agreement.py` | Compute Cohen's Kappa + confusion matrix |
| `benchmark/scripts/analyze_disagreements.py` | Disagreement identification (142 cases) |

---

## Phase 3: Synthesis (PDF -> Markdown -> Knowledge Documents)

### Pipeline Workflow

| Step | Script | Input | Output | Key parameters |
|------|--------|-------|--------|----------------|
| 1. PDF download | `download_zotero_pdfs.py` | Zotero Group | `pipeline/pdfs/` | `--output` |
| 2. Markdown conversion | `convert_to_markdown.py` | PDFs | `pipeline/markdown/` | `--input`, `--output` |
| 3. Validation | `validate_markdown_enhanced.py` | Markdown + PDFs | `pipeline/validation_reports/` | `--md-dir`, `--pdf-dir` |
| 4. Post-processing | `postprocess_markdown.py` | Markdown | `pipeline/markdown_clean/` | `--input-dir`, `--output-dir` |
| 5. Human review | `markdown_reviewer.html` | Markdown + PDFs | JSON export | Via Live Server |
| 6. Knowledge distillation | `distill_knowledge.py` | Markdown | `pipeline/knowledge/distilled/` | `--input`, `--output`, `--limit` |
| 7. Vault building | `generate_vault.py` | Knowledge docs + assessment CSVs | `vault/` | `--path`, `--clean` |

All scripts in `pipeline/scripts/`. Full parameters via `--help`.

### PDF Acquisition

**Script:** `acquire_pdfs.py` -- 4 fallback strategies: Zotero, DOI, Unpaywall, ArXiv

**Result:** 257/326 PDFs downloaded (78.8%)

### Markdown Conversion

**Script:** `convert_to_markdown.py` -- PDF to Markdown with Docling

**Result:** 252/257 converted (98.1%), 5 failed (corrupt formats), 9 duplicates removed

### Validation

**Script:** `validate_markdown_enhanced.py` -- Multi-layer validation:

| Layer | Check | Threshold |
|-------|-------|-----------|
| 1. Syntactic | GLYPH placeholders, Unicode errors | max 50 / max 5% |
| 2. Structural | Character ratio (MD/PDF) | min 0.7 |
| 3. Semantic | LLM spot-check | Optional, 10% sample |
| 4. Manual | Review queue | Prioritized by confidence |

### Post-Processing

**Script:** `postprocess_markdown.py` -- Conservative cleanup (hyphenation fix, page numbers, header removal)

### Human Review Tool

**Tool:** `pipeline/tools/markdown_reviewer.html` -- Browser tool for human-in-the-loop review

**Keyboard shortcuts:** `1` PASS | `2` WARN | `3` FAIL | `0` Reset | `<-` `->` Navigation

### Knowledge Distillation (3-Stage SKE)

**Script:** `distill_knowledge.py` -- Three-stage workflow:

| Stage | Function | Input | Output | API call |
|-------|----------|-------|--------|----------|
| 1 | Extract & classify | Markdown | JSON | Yes |
| 2 | Format Markdown | JSON | Markdown | No (local) |
| 3 | Verify | Markdown + original | JSON | Yes |

**Key parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `--input` | `pipeline/markdown` | Input directory |
| `--output` | `pipeline/knowledge/distilled` | Output directory |
| `--limit` | - | Limit number of documents |
| `--delay` | 1.0 | Seconds between API calls |

---

## Quality Assessment

### Bibliographic Validation

- DOI validation via CrossRef API
- Author disambiguation via ORCID
- Journal verification against DOAJ and Beall's List

### Alternative Review Standards

| Standard | Focus | Application |
|----------|-------|-------------|
| JBI Manual | Pluralistic evidence | 13 checklists for different study types |
| Cochrane 6.5 | Health interventions | RoB 2, ROBINS-I |
| ENTREQ | Qualitative syntheses | 21 items for reflexivity |
| MMAT | Mixed methods | 5 study-type-specific criteria |

---

## Circularity as a Field Condition

LLMs are used to examine literature on the use of LLMs. Feminist AI literacies are simultaneously the subject of the review and a prerequisite of the workflow. This circularity cannot be resolved and is treated not as a methodological flaw but as a condition of the field.

---

## Directory Structure

| Directory | Contents | Files |
|-----------|----------|-------|
| `pipeline/scripts/` | Python scripts | All pipeline scripts |
| `pipeline/tools/` | Browser tools | markdown_reviewer.html |
| `pipeline/pdfs/` | Downloaded PDFs | 257 files |
| `pipeline/markdown/` | Converted documents | 252 files |
| `pipeline/markdown_clean/` | Post-processed documents | Cleaned |
| `pipeline/knowledge/distilled/` | Distilled knowledge documents | 249 files |
| `pipeline/knowledge/_stage1_json/` | Stage 1 intermediate results | JSON |
| `pipeline/knowledge/_verification/` | Verification reports | JSON |
| `benchmark/config/` | Benchmark configuration | categories.yaml |
| `benchmark/scripts/` | Benchmark scripts | merge, calculate, analyze |
| `benchmark/data/` | Assessment data | human_assessment.csv, llm_assessment_10k.csv |
| `benchmark/results/` | Results | agreement_metrics.json, disagreements.csv |
| `corpus/` | Corpus metadata | zotero_export.json, papers_metadata.csv |
| `docs/` | GitHub Pages SPA | index.html, about.html, methoden.html, help.html |
| `docs/data/` | Generated JSON data | research_vault_v2.json, promptotyping_v2.json |
| `scripts/` | Project-wide scripts | generate_vault_v2.py, generate_promptotyping_data_v2.py |
| `.vault_cache/` | LLM API result cache (not committed) | concepts/ (249 JSON), divergences/ (111 JSON) |

---

## Script Reference

### Pipeline Scripts (pipeline/scripts/)

| Script | Function | Status |
|--------|----------|--------|
| `download_zotero_pdfs.py` | Download PDFs from Zotero | Tested |
| `acquire_pdfs.py` | PDF acquisition with 4 fallback strategies | Tested |
| `convert_to_markdown.py` | PDF to Markdown with Docling | Tested |
| `validate_markdown_enhanced.py` | Multi-layer validation + PDF comparison | Tested |
| `postprocess_markdown.py` | Conservative artifact cleanup | Tested |
| `distill_knowledge.py` | Knowledge distillation (3-stage) | Complete (249 docs) |
| `generate_vault.py` | Obsidian Vault v1 (archived, replaced by v2) | Archived |
| `generate_docs_data.py` | Generate SPA data (research_vault_v2.json) | Tested |

### Project Scripts (scripts/)

| Script | Function | Status |
|--------|----------|--------|
| `generate_vault_v2.py` | Vault v2 generator: LLM concept extraction, divergence classification | Complete |
| `generate_promptotyping_data_v2.py` | Generate Promptotyping v2 JSON | Complete |

---

## Performance & Costs

### API Costs

| Operation | Cost | Status |
|-----------|------|--------|
| PDF acquisition | $0 | Complete |
| Markdown conversion | $0 | Complete |
| Knowledge distillation (249 papers) | ~$7.00 | Complete |
| 5D LLM assessment (325 papers) | $1.15 | Complete |
| 10K LLM assessment (326 papers) | $1.44 | Complete |
| Vault v2 concept extraction (249 papers) | ~$0.75 | Complete |
| Vault v2 divergence classification (111 cases) | ~$0.22 | Complete |
| **Total** | **~$11.14** | |

**Model:** Claude Haiku 4.5 ($1.00/MTok input, $5.00/MTok output, prices as of Feb 2026)

---

## Vault v2

### Architecture

Vault v2 (`scripts/generate_vault_v2.py`) replaces the flat paper index (v1) with an epistemic network comprising 4 document types:

| Type | Count | Contents |
|------|-------|----------|
| **Paper Notes** | 248 | YAML frontmatter (assessment data), transformation trail, concept wikilinks, knowledge document full text |
| **Concept Notes** | 136 | LLM-extracted definitions, frequency, co-occurrence table, paper backlinks |
| **Pipeline Notes** | 5 | Stage descriptions, prompts (extracted from code), configuration |
| **Divergence Notes** | 111 | Pattern classification, category comparison table, LLM reasoning |

### LLM-Based Concept Extraction

- 249 API calls to Claude Haiku 4.5 (~$0.75)
- 3-8 domain concepts per paper (English canonical form)
- Post-processing: synonym merge (~35 manual entries), frequency filter (>= 2)
- Result: 136 consolidated concepts with co-occurrence matrix

### LLM-Based Divergence Classification

- 111 API calls to Claude Haiku 4.5 (~$0.22), reclassification with Sonnet 4.6
- 3 patterns (after reclassification): Semantic Expansion (52%), Implicit Field Affiliation (30%), Keyword Inclusion (18%)
- Note: 142 disagreements total (after merge bug fix), Vault contains 111 divergence files (regeneration pending)

### Title Matching (5 Strategies)

| Strategy | Description | Matches |
|----------|-------------|---------|
| 1 | Stage1-JSON `metadata.title` -> Zotero title | Primary |
| 2 | KD YAML frontmatter `title` -> Zotero title | Secondary |
| 3 | Filename prefix matching | Tertiary |
| 4 | Author+year from filename vs. Zotero | Quaternary |
| 5 | `difflib.SequenceMatcher` (threshold 0.65) | Fallback |

Result: 237/249 (vs. 226/249 in v1).

---

## Error Handling

### Windows Encoding

`setup_windows_encoding()` in `utils.py` configures UTF-8 encoding for Windows consoles.

### HTTP 429 (Rate Limit)

Increase delay between API calls (default: 2 seconds, recommended: 5 seconds).

---

*Updated: 2026-04-01*
