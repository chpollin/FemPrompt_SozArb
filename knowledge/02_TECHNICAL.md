# Technical Documentation - FemPrompt & SozArb Literature Research Pipeline

**Last Updated:** 2025-11-02
**Pipeline Version:** 2.0
**Implementation Status:** ~85% Complete

---

## System Overview

Automated literature research pipeline utilizing multi-model AI synthesis for bias and intersectionality analysis in artificial intelligence systems.

### Current Projects

#### 1. **FemPrompt** - Original Project (326 papers)
- **Focus:** Feminist Digital/AI Literacies and diversity-reflective prompting
- **Status:** Full pipeline operational
- **Zotero:** Group library 6080294
- **Output:** FemPrompt_Vault/ (Obsidian knowledge graph)

#### 2. **SozArb (Social Work AI Literacy)** - Current Project (325 papers)
- **Focus:** AI literacy in social work and vulnerable populations
- **Status:** LLM assessment complete, PDF acquisition ready
- **Zotero:** Group library 6284300 (socialai-litreview-curated)
- **Assessment:** 208 Include, 84 Exclude, 33 Unclear (100% success rate, $0.58)
- **Output:** Pending markdown corpus generation

---

## System Requirements

### Software Dependencies
- Python 3.8 or higher
- Operating System: Windows 10/11, macOS 10.14+, Linux (Ubuntu 20.04+)

### Python Package Requirements
```bash
# Install all dependencies
pip install -r requirements.txt

# Key packages:
pip install requests>=2.31.0 pyyaml>=6.0 PyPDF2>=3.0.0 beautifulsoup4>=4.12.0
pip install anthropic>=0.68.0            # Claude Haiku 4.5
pip install python-dotenv>=1.0.0         # Environment variables
pip install pandas openpyxl xlsxwriter   # Excel/assessment workflow
pip install pyzotero>=1.5.0              # Zotero API integration
pip install docling>=2.60.0              # Advanced PDF conversion
```

### Environment Configuration
```bash
# Claude API Key (required for document processing)
export ANTHROPIC_API_KEY="sk-ant-your-key"              # Unix/Linux/macOS
$env:ANTHROPIC_API_KEY="sk-ant-your-key"                # Windows PowerShell

# Or use .env file (recommended):
# Copy .env.example to .env and fill in your API key
```

---

## Pipeline Architecture

### Automated Execution (Recommended)
```bash
# Complete pipeline with single command
python run_pipeline.py                                 # Uses default config

# Advanced options
python run_pipeline.py --config my_config.yaml        # Custom configuration
python run_pipeline.py --resume                        # Resume from checkpoint
python run_pipeline.py --stages acquire_pdfs,summarize # Run specific stages
python run_pipeline.py --skip convert_pdfs            # Skip specific stages
python run_pipeline.py --dry-run                      # Preview without execution
python run_pipeline.py -v                             # Verbose logging
```

### Manual Execution (Legacy)
```bash
# Individual stage execution
python analysis/getPDF_intelligent.py                  # Stage 1: Document acquisition
python analysis/pdf-to-md-converter.py                 # Stage 2: Format conversion
python analysis/summarize-documents.py                 # Stage 3: Content analysis
python analysis/generate_obsidian_vault_improved.py    # Stage 4: Knowledge graph generation
python analysis/test_vault_quality.py                  # Stage 5: Quality validation
```

---

## Pre-Pipeline Workflow (Manual Curation)

### Phase 1: Multi-Model Deep Research
**Process:** Execute parametric research prompt across 4 AI platforms
**Models Used:** Claude, Gemini, ChatGPT, Perplexity
**Output:** Model-specific bibliographies in `deep-research/[Model]/`
**Duration:** ~2-3 hours per model

### Phase 2: RIS Standardization
**Process:** Convert AI outputs to RIS format for Zotero import
**Input:** Raw AI responses from each model
**Output:** `to-Zotero/*.ris` files (4 files, one per model)

### Phase 3: Zotero Import and Consolidation
**Process:** Import RIS files into Zotero, organize by model collection
**Manual Steps:**
- Import 4 RIS files into Zotero
- Organize into model-specific collections
- De-duplicate entries across models
- Correct metadata (authors, DOIs, dates)
- Attach PDFs where available

**Output:** Consolidated bibliography in Zotero Group

---

## LLM-Based PRISMA Assessment (NEW)

### Overview
**Purpose:** Automated literature screening using Claude Haiku 4.5
**Location:** `assessment-llm/`
**Status:** Operational, tested with 325 papers (SozArb project)

### Results (SozArb Run 5)
- **Papers assessed:** 325 (100% success rate)
- **Processing time:** 24 minutes
- **Cost:** $0.58 (Claude Haiku 4.5)
- **Assessment breakdown:**
  - Include: 208 papers (64.0%)
  - Exclude: 84 papers (25.8%)
  - Unclear: 33 papers (10.2%)

### 5-Dimensional Relevance Scoring (0-3 scale)
- **Rel_Bias:** 1.74 (bias analysis - strongest dimension)
- **Rel_Vulnerable:** 1.54 (vulnerable groups)
- **Rel_Praxis:** 1.25 (practical implementation)
- **Rel_Prof:** 1.17 (professional/social work context)
- **Rel_AI_Komp:** 0.90 (AI literacy - weakest)

### Running LLM Assessment

```bash
# 1. Prepare input (Excel with papers to assess)
python assessment-llm/prepare_input.py \
  --zotero-json analysis/zotero_vereinfacht.json \
  --output assessment-llm/input/papers_to_assess.xlsx

# 2. Run assessment
python assessment-llm/assess_papers.py \
  --input assessment-llm/input/papers_to_assess.xlsx \
  --output assessment-llm/output/assessment_llm_run6.xlsx

# 3. Export tags to CSV (for Zotero import)
python assessment-llm/export_tags_csv.py \
  --input assessment-llm/output/assessment_llm_run6.xlsx \
  --output assessment-llm/output/zotero_tags.csv

# 4. Optional: Write tags to Zotero via API
python assessment-llm/write_llm_tags_to_zotero.py \
  --excel assessment-llm/output/assessment_llm_run6.xlsx \
  --api-key YOUR_ZOTERO_API_KEY \
  --no-dry-run
```

### Files Created
- `assessment-llm/assess_papers.py` - Main assessment script
- `assessment-llm/prompt_template.md` - Assessment prompt (5 dimensions)
- `assessment-llm/output/assessment_llm_run5.xlsx` - 325 assessed papers
- `assessment-llm/output/zotero_tags.csv` - Tag export
- `assessment-llm/write_llm_tags_to_zotero.py` - Zotero API integration (pyzotero)
- `assessment-llm/write_llm_tags_to_zotero_simple.py` - Requests-only version
- `assessment-llm/README.md` - Complete documentation
- `assessment-llm/RUN5_FINAL_REPORT.md` - Detailed results

### Customization for Other Projects

The assessment system is fully parametric and can be adapted:

1. **Modify dimensions** in `prompt_template.md`:
   ```
   Current: Rel_AI_Komp, Rel_Vulnerable, Rel_Bias, Rel_Praxis, Rel_Prof
   Example: Rel_Clinical, Rel_Ethical, Rel_Methodological, etc.
   ```

2. **Adjust inclusion criteria**:
   - Edit prompt to match your research question
   - Modify exclusion reasons

3. **Change model** (in `assess_papers.py`):
   ```python
   model = "claude-haiku-4-5"  # or "claude-sonnet-4-5" for better quality
   ```

See `assessment-llm/prompt_template_EXAMPLE_SOCIAL_WORK.md` for adaptation example.

---

## Processing Stages (Main Pipeline)

### Stage 1: Filtered Zotero Export
**Process:** Export ONLY PRISMA-included papers from Zotero
**Script:**
```bash
python analysis/fetch_zotero_group.py
```
**Input:** Curated Zotero library with PRISMA tags
**Output:** `analysis/zotero_vereinfacht.json` with tag information
**Filtering:** Pipeline reads tags and processes only papers with `PRISMA_Include` tag

### Stage 2: Document Acquisition and Conversion

#### Intelligent PDF Acquisition (PRISMA-filtered)

**NEW:** Now supports Excel input directly (no JSON conversion needed)!

```bash
# Option A: From Excel with PRISMA filtering
python analysis/getPDF_intelligent.py \
  --input assessment-llm/output/assessment_llm_run5.xlsx \
  --output analysis/socialai-pdfs/ \
  --filter-decision Include

# Option B: From JSON (legacy)
python analysis/getPDF_intelligent.py \
  --input analysis/zotero_vereinfacht.json \
  --output analysis/pdfs/

# With Zotero API integration
python analysis/getPDF_intelligent.py \
  --input assessment-llm/output/assessment_llm_run5.xlsx \
  --filter-decision Include \
  --api-key YOUR_KEY \
  --library-id 6284300 \
  --library-type group
```

**Hierarchical acquisition strategy:**
1. Filter by Decision column (if Excel input with --filter-decision)
2. Zotero attachments (local PDFs)
3. Metadata URLs/DOIs
4. Open access APIs (Unpaywall, ArXiv)
5. Manual intervention report

**Success rate:** >70% for included papers
**Reports:** `acquisition_log.json`, `missing_pdfs.csv`

#### PDF to Markdown Conversion
```bash
python analysis/pdf-to-md-converter.py \
  --pdf-dir analysis/socialai-pdfs/ \
  --output-dir analysis/socialai-markdown/

# Processing time: ~30 seconds per document
```

### Stage 3: Automated Content Analysis
```bash
python analysis/summarize-documents.py \
  --input-dir analysis/socialai-markdown/ \
  --output-dir analysis/socialai-summaries/

# Model: Claude Haiku 4.5 (temperature=0.3, max_tokens=2048)
# Process: 5-stage iterative refinement
#   1. Academic analysis (400 words)
#   2. Structured synthesis (500 words)
#   3. Critical validation
#   4. Clean summary generation
#   5. Metadata extraction (YAML format)
# Processing time: ~60 seconds per document (2x faster than Claude Sonnet)
# API rate limit: 2-second delay between documents
# Cost: ~$0.03-0.04 per document ($1/M input + $5/M output tokens)
```

### Stage 4: Knowledge Graph Construction
```bash
python analysis/generate_obsidian_vault_improved.py \
  --input-dir analysis/socialai-summaries/ \
  --output-dir SozArb_Vault/

# Algorithm: Pattern-based concept extraction with normalization
# Deduplication: Synonym mapping (182 terms → canonical forms)
# Filtering: Frequency threshold ≥2 occurrences
# Consolidation: 302 initial concepts → 35 final concepts
# Categories: Bias Types (14), Mitigation Strategies (21)
# Output: Obsidian-compatible knowledge graph
# Processing time: <60 seconds for complete corpus
```

### Stage 5: Quality Validation
```bash
python analysis/test_vault_quality.py --vault-dir SozArb_Vault/

# Metrics evaluated:
#   - Concept uniqueness (target: >95%)
#   - Metadata completeness (target: 100%)
#   - Cross-reference integrity (target: <10 broken links)
#   - Frequency distribution analysis
# Current score: 85/100 (GOOD)
```

---

## Python Scripts Reference

### Master Orchestrator

#### run_pipeline.py
**Function:** Coordinates all five processing stages

**Features:**
- Checkpoint-based resume after interruptions
- Selective stage activation
- Stage skipping
- Dry-run mode
- Color-coded console output
- JSON-based status tracking in `.pipeline_status.json`

**Usage:**
```bash
python run_pipeline.py                    # Complete pipeline
python run_pipeline.py --resume           # Resume after interruption
python run_pipeline.py --stages acquire_pdfs,convert_pdfs
python run_pipeline.py --skip summarize
python run_pipeline.py --dry-run
```

**Requires:** All other scripts, `pipeline_config.yaml`, `ANTHROPIC_API_KEY`

---

### PDF Acquisition

#### getPDF_intelligent.py
**Function:** Downloads PDFs through hierarchical fallback strategies

**Strategies (in order):**
1. Zotero local attachments (fastest)
2. DOI resolution via CrossRef API
3. ArXiv ID extraction and download
4. Semantic Scholar API for open-access versions
5. Unpaywall integration
6. BASE Academic Search
7. Publisher-specific parsers
8. URL-based direct search

**NEW: Excel Input Support**
- Reads `.xlsx` files directly (no JSON conversion needed)
- Supports `--filter-decision` flag for PRISMA filtering
- Compatible with LLM assessment output format

**Output:**
- PDFs in specified output directory
- `acquisition_log.json` with success/error tracking
- `missing_pdfs.csv` for manual follow-up

**Usage:**
```bash
# From Excel with filtering
python analysis/getPDF_intelligent.py \
  --input assessment-llm/output/assessment_llm_run5.xlsx \
  --output analysis/pdfs/ \
  --filter-decision Include

# From JSON (legacy)
python analysis/getPDF_intelligent.py \
  --input analysis/zotero_vereinfacht.json \
  --output analysis/pdfs/

# With Zotero API
python analysis/getPDF_intelligent.py \
  --api-key KEY --library-id ID --library-type group
```

**Requires:** Input file (Excel or JSON), internet connection

---

### Document Conversion

#### pdf-to-md-converter.py
**Function:** Converts PDFs to structured Markdown with Docling

**Features:**
- Structure preservation (headings, lists, tables, citations)
- MD5 hash-based duplicate detection
- Metadata tracking in `conversion_metadata.json`
- Error tolerance (isolates problematic PDFs)
- Normalized filenames

**Output:**
- Markdown files in specified directory
- `conversion_metadata.json` with processing status

**Usage:**
```bash
python analysis/pdf-to-md-converter.py \
  --pdf-dir analysis/pdfs/ \
  --output-dir analysis/markdown_papers/
```

**Requires:** PDFs in input directory, optional docling installed

---

### AI-Assisted Analysis

#### summarize-documents.py
**Function:** Generates structured summaries with Claude Haiku 4.5

**5-Stage Workflow:**
1. Academic analysis (research question, methodology, results)
2. Structured synthesis (500 words)
3. Critical validation (consistency check)
4. Clean summary (150 words)
5. Metadata extraction (YAML format)

**Features:**
- Model: `claude-haiku-4-5` (alternative: `claude-sonnet-4-5`)
- Temperature 0.3 for consistency
- 2-second rate limiting (configurable)
- Batch metadata tracking
- Retry logic for transient errors
- Processing time: ~60 seconds per document (2x faster than Sonnet)
- Cost: ~$0.03-0.04 per document

**Output:**
- Summaries in specified directory
- `batch_metadata.json` with performance metrics

**Usage:**
```bash
python analysis/summarize-documents.py \
  --input-dir analysis/markdown_papers/ \
  --output-dir analysis/summaries_final/
```

**Requires:** `ANTHROPIC_API_KEY`, Markdown files in input directory

---

### Obsidian Vault Generation

#### generate_obsidian_vault_improved.py
**Function:** Creates navigable Obsidian knowledge base from summaries

**Features:**
- Pattern-based concept extraction
- Synonym mapping dictionary (182 entries)
- Fuzzy-matching deduplication
- Frequency-based filtering (min_frequency=2)
- Frequency caps for generic terms
- Intersectional consolidation
- Categories: Bias Types (14), Mitigation Strategies (21)

**Output:**
- `[VaultName]/Papers/` - Paper notes
- `[VaultName]/Concepts/` - Concept notes
- `[VaultName]/MASTER_MOC.md` - Navigation index

**Usage:**
```bash
python analysis/generate_obsidian_vault_improved.py \
  --input-dir analysis/summaries_final/ \
  --output-dir FemPrompt_Vault/
```

**Requires:** Summaries in input directory

---

#### test_vault_quality.py
**Function:** Validates Obsidian vault systematically

**Metrics:**
- Concept uniqueness (target: >95%)
- Metadata completeness (target: 100%)
- Link integrity (broken links)
- Network connectivity (isolated components)
- Overall score calculation

**Output:**
- Color-coded console report
- `vault_test_report.json` (optional)

**Usage:**
```bash
python analysis/test_vault_quality.py --vault-dir FemPrompt_Vault/
```

**Requires:** Vault directory exists

---

## Assessment Workflow (Manual - Legacy)

### zotero_to_excel.py
**Function:** Exports Zotero library to Excel assessment template

**Features:**
- Direct Zotero API integration via pyzotero
- PRISMA-compliant column structure
- Predefined assessment categories
- Conditional formatting in Excel
- Data validation for consistent inputs

**Output:** `assessment.xlsx` with structured assessment columns

**Usage:**
```bash
python assessment/zotero_to_excel.py -o assessment.xlsx
python assessment/zotero_to_excel.py --api-key KEY --library-id ID -o output.xlsx
```

**Requires:** `ZOTERO_API_KEY` (optional), `zotero_vereinfacht.json`

---

### excel_to_zotero_tags.py
**Function:** Imports assessment tags back to Zotero via API

**Features:**
- DOI/Title-based matching
- PRISMA tag enrichment (Include/Exclude/Unclear)
- Exclusion reasons as custom fields
- Roundtrip validation

**Output:** Zotero items updated with assessment tags

**Usage:**
```bash
python assessment/excel_to_zotero_tags.py \
  --excel assessment_curated.xlsx \
  --api-key YOUR_KEY \
  --no-dry-run
```

**Requires:** Filled `assessment.xlsx`, Zotero API key

---

## Standard Operating Procedures

### Procedure 1: Automated Complete Pipeline
```bash
# Single command for complete workflow
python run_pipeline.py                                 # Duration: ~90 minutes for 30 documents
```

### Procedure 2: Processing New Literature Corpus (Manual)
```bash
# Sequential execution required
python analysis/getPDF_intelligent.py                  # ~5 minutes for 30 PDFs
python analysis/pdf-to-md-converter.py                 # ~15 minutes
python analysis/summarize-documents.py                 # ~60 minutes for 30 documents
python analysis/generate_obsidian_vault_improved.py    # <1 minute
python analysis/test_vault_quality.py                  # <10 seconds
```

### Procedure 3: LLM Assessment + PDF Acquisition (SozArb Workflow)
```bash
# 1. Run LLM assessment
python assessment-llm/assess_papers.py \
  --input assessment-llm/input/papers_to_assess.xlsx \
  --output assessment-llm/output/assessment_run6.xlsx

# 2. Acquire PDFs for included papers only
python analysis/getPDF_intelligent.py \
  --input assessment-llm/output/assessment_run6.xlsx \
  --output analysis/socialai-pdfs/ \
  --filter-decision Include

# 3. Convert to Markdown
python analysis/pdf-to-md-converter.py \
  --pdf-dir analysis/socialai-pdfs/ \
  --output-dir analysis/socialai-markdown/

# 4. Generate summaries
python analysis/summarize-documents.py \
  --input-dir analysis/socialai-markdown/ \
  --output-dir analysis/socialai-summaries/

# 5. Create knowledge graph
python analysis/generate_obsidian_vault_improved.py \
  --input-dir analysis/socialai-summaries/ \
  --output-dir SozArb_Vault/
```

---

## Error Resolution

### Error: HTTP 429 (Rate Limit Exceeded)
**Symptom:** API returns status code 429 during document processing
**Root Cause:** Exceeding Claude API rate limits
**Resolution:**
1. Modify `analysis/summarize-documents.py` delay parameter
2. Increase delay: `time.sleep(2)` → `time.sleep(5)` or higher
3. Alternative: Implement exponential backoff (2^n seconds)
4. Check your Anthropic API tier limits at console.anthropic.com

### Error: MemoryError
**Symptom:** Process termination during PDF conversion
**Root Cause:** Insufficient RAM for documents >50MB
**Resolution:**
1. Limit batch size: Process maximum 5 PDFs concurrently
2. Increase heap allocation: `python -Xmx4096m script.py`
3. Pre-split PDFs: `pdftk input.pdf burst output page_%02d.pdf`

### Error: Missing Metadata
**Symptom:** Vault concepts lack bibliographic information
**Root Cause:** Filename mismatch between input JSON and markdown files
**Resolution:**
1. Verify file presence: `ls -la analysis/zotero_vereinfacht.json`
2. Check filename consistency: Paper names must match exactly (case-sensitive)
3. Fallback mechanism activates automatically

### Error: Concept Over-Extraction
**Symptom:** >100 concepts extracted from limited corpus
**Configuration Points:**
- Frequency caps: `generate_obsidian_vault_improved.py:198-203`
- Blacklist terms: `generate_obsidian_vault_improved.py:184-195`
- Minimum frequency: `generate_obsidian_vault_improved.py:441`

**Recommended Settings:**
```python
frequency_caps = {
    'AI Systems': 30,
    'Large Language Models': 50,
    'Artificial Intelligence': 30
}
min_frequency = 3  # Increase from 2
```

### Error: TypeError in getPDF_intelligent.py (NaN URL)
**Symptom:** `TypeError: expected string or bytes-like object, got 'float'`
**Root Cause:** Excel cells with NaN URLs passed as float to regex
**Resolution:** Fixed in latest version with type checking:
```python
if not url or not isinstance(url, str):
    url = ''
```

---

## Directory Structure

```
FemPrompt_SozArb/
├── run_pipeline.py              # Master orchestration script
├── pipeline_config.yaml         # Pipeline configuration
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables (API keys)
├── .gitignore                  # Git ignore patterns
│
├── analysis/                    # Processing pipeline scripts
│   ├── getPDF_intelligent.py    # Smart PDF acquisition (Excel + JSON support)
│   ├── pdf-to-md-converter.py   # Format conversion
│   ├── summarize-documents.py   # AI content analysis
│   ├── generate_obsidian_vault_improved.py # Knowledge graph
│   ├── test_vault_quality.py    # Quality validation
│   ├── fetch_zotero_group.py    # Zotero API integration
│   ├── pdfs/                    # Downloaded PDFs (gitignored)
│   ├── markdown_papers/         # Converted documents (gitignored)
│   ├── summaries_final/         # AI summaries (legacy data)
│   ├── zotero_vereinfacht.json  # Bibliography metadata
│   ├── zotero_vollstaendig.json # Complete Zotero export
│   ├── conversion_metadata.json # PDF conversion tracking
│   └── vault_test_report.json   # Vault quality metrics
│
├── assessment-llm/              # LLM-based PRISMA assessment (NEW)
│   ├── assess_papers.py          # Main assessment script
│   ├── prompt_template.md        # Assessment prompt (5 dimensions)
│   ├── output/
│   │   ├── assessment_llm_run5.xlsx  # 325 assessed papers
│   │   └── zotero_tags.csv           # Tag export
│   ├── write_llm_tags_to_zotero.py   # Zotero API (pyzotero)
│   ├── write_llm_tags_to_zotero_simple.py  # Zotero API (requests)
│   ├── README.md                 # Assessment documentation
│   ├── RUN5_FINAL_REPORT.md      # Detailed results
│   └── prompt_template_EXAMPLE_SOCIAL_WORK.md # Adaptation example
│
├── assessment/                   # Manual assessment workflow (LEGACY)
│   ├── zotero_to_excel.py        # Zotero → Excel export
│   ├── excel_to_zotero_tags.py   # Excel → Zotero tag import
│   ├── assessment.xlsx           # Empty template
│   ├── assessment_curated.xlsx   # Filled assessment
│   └── README.md                 # Assessment workflow guide
│
├── deep-research/               # Multi-model research results
│   ├── Claude/                 # Claude AI outputs
│   ├── Gemini/                 # Gemini outputs
│   ├── OpenAI/                 # ChatGPT outputs
│   └── Perplexity/             # Perplexity outputs
│
├── to-Zotero/                   # RIS files for import
│   ├── claude-deep-research-bibliography-1.ris
│   ├── Gemini-deep-research-bibliography-1.ris
│   ├── OpenAI-deep-research-bibliography-1.ris
│   ├── perplexity-deep-research-bibliography-1.ris
│   └── ris-template.md
│
├── FemPrompt_Vault/             # Obsidian knowledge graph (FemPrompt project)
│   ├── Papers/                  # Individual paper notes
│   ├── Concepts/
│   │   ├── Bias_Types/         # Extracted bias concepts
│   │   └── Mitigation_Strategies/ # Mitigation approaches
│   └── MASTER_MOC.md           # Navigation index
│
├── knowledge/                   # Project documentation
│   ├── Projekt.md               # Research goals
│   ├── Theorie.md               # Feminist theory
│   ├── Methodik.md              # PRISMA methodology
│   ├── Technisch.md             # Technical implementation
│   ├── Prozess.md               # Workflow steps
│   └── Operativ.md              # Prompts and benchmarks
│
├── TECHNICAL.md                 # This file
├── CLAUDE.md                    # Rules for Claude AI assistant
├── README.md                    # Project overview
├── CURRENT_STATUS.md            # Current state and next steps
└── JOURNAL.md                   # Development iteration log (archived)
```

---

## Technical Notes

### Critical Code Sections

1. **Concept normalization mapping:** `generate_obsidian_vault_improved.py:54-181`
   - Contains 182 synonym mappings
   - Modifications require consistency checks

2. **API workflow stages:** `summarize-documents.py:125-283`
   - Five-stage sequential processing
   - Each stage depends on previous output

3. **Frequency thresholds:** `generate_obsidian_vault_improved.py:441`
   - Default: min_frequency = 2
   - Affects concept inclusion criteria

4. **Excel input handling:** `getPDF_intelligent.py:_load_from_excel()`
   - Converts Excel rows to Zotero-like format
   - Supports Decision-based filtering

### Performance Characteristics

- **Document summarization:** ~60 seconds per document (Claude Haiku 4.5)
- **LLM assessment:** ~4.4 seconds per paper (Claude Haiku 4.5)
- **Vault generation:** <60 seconds for 35 documents
- **PDF conversion:** ~30 seconds per document (CPU-bound, Docling)
- **Quality testing:** <10 seconds
- **API rate limit:** 2-second delay between requests (Claude)
- **Memory usage:** ~500MB for typical 30-document corpus
- **Cost (Haiku 4.5):**
  - Assessment: ~$0.002 per paper ($0.58 for 325 papers)
  - Summarization: ~$0.03-0.04 per document

### Input/Output Specifications

- **Input formats:** PDF, Markdown (.md), Excel (.xlsx), JSON
- **Output formats:** Markdown (.md), JSONL, HTML, Excel (.xlsx)
- **Encoding:** UTF-8 throughout
- **Maximum document size:** 50MB (PDF), 4MB (Markdown)
- **API token limit:** 2048 tokens per response (configurable)

---

## Implementation Status

### Completed Components ✅

- Multi-model research workflow (4 AI platforms)
- RIS standardization (4 model-specific RIS files)
- **LLM-based PRISMA assessment** (NEW)
  - 100% success rate (325 papers in 24 minutes)
  - 5-dimensional relevance scoring
  - CSV export and Zotero API integration
  - Fully parametric and reusable
- **Excel input support for getPDF_intelligent.py** (NEW)
  - Direct .xlsx reading (no JSON conversion needed)
  - PRISMA filtering via --filter-decision flag
- Manual PRISMA assessment workflow (Excel-based with Zotero API)
- Pipeline orchestration (`run_pipeline.py`) - 5 automated stages
- Intelligent PDF acquisition (8 hierarchical strategies)
- Zotero API integration (`pyzotero` installed)
- PDF to Markdown conversion (Docling)
- AI summarization (Claude Haiku 4.5)
- Obsidian vault generation and validation
- Comprehensive documentation suite

### In Progress 🔄

- **SozArb project:**
  - LLM assessment: COMPLETE ✅
  - PDF acquisition: READY (208 papers with Decision=Include)
  - Markdown conversion: READY (waiting for PDFs)
  - Summarization: READY (waiting for Markdown)
  - Vault generation: READY (waiting for summaries)

### Known Issues ⚠️

- **Zotero API Access (SozArb project):** API keys return 403 errors from server environment
  - **Workarounds:** CSV export for manual import, run scripts locally
- None critical - all core functionality operational ✅

---

## References

### External Documentation
- **PRISMA 2020:** http://www.prisma-statement.org/
- **Anthropic API:** https://docs.anthropic.com/
- **Obsidian:** https://obsidian.md/
- **Docling:** https://github.com/DS4SD/docling
- **Zotero API:** https://www.zotero.org/support/dev/web_api/v3/start

### Internal Documentation
- **README.md** - Project overview and quick start
- **CLAUDE.md** - Working rules for Claude AI assistant
- **CURRENT_STATUS.md** - Current state and immediate next steps
- **assessment-llm/README.md** - LLM assessment system guide
- **assessment-llm/RUN5_FINAL_REPORT.md** - Detailed assessment results
- **knowledge/** folder - Complete project documentation

---

*Document Version: 2.0*
*Last Modified: 2025-11-02*
*Author: AI-assisted systematic literature research pipeline*
