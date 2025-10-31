# Technical Documentation - FemPrompt Literature Research Pipeline

## System Overview

This documentation specifies the operational procedures for an automated literature research pipeline utilizing multi-model AI synthesis for bias and intersectionality analysis in artificial intelligence systems.

**Current Status:** Implementation ~70% complete | Python 3.11.9 | Windows environment

## System Requirements

### Software Dependencies
- Python 3.8 or higher
- Operating System: Windows 10/11, macOS 10.14+, Linux (Ubuntu 20.04+)

### Python Package Requirements
```bash
# Install all dependencies at once
pip install -r requirements.txt

# Or install manually:
pip install requests>=2.31.0 pyyaml>=6.0 PyPDF2>=3.0.0 beautifulsoup4>=4.12.0
pip install anthropic>=0.68.0            # Required for Claude Haiku 4.5
pip install python-dotenv>=1.0.0         # For environment variables
pip install pandas openpyxl xlsxwriter   # For assessment workflow
pip install pyzotero>=1.5.0              # For Zotero API integration
pip install docling>=2.60.0              # For advanced PDF conversion
```

### Environment Configuration
```bash
# Claude API Key Configuration (required for document processing)
export ANTHROPIC_API_KEY="sk-ant-your-key"              # Unix/Linux/macOS
$env:ANTHROPIC_API_KEY="sk-ant-your-key"                # Windows PowerShell
set ANTHROPIC_API_KEY=sk-ant-your-key                   # Windows Command Prompt

# Or use .env file (recommended):
# Copy .env.example to .env and fill in your API key
```

## Pipeline Architecture

### Configuration File
The pipeline uses `pipeline_config.yaml` for customization. A default configuration is provided with sensible defaults. Key settings include:
- Stage enable/disable flags
- API rate limiting
- File paths
- Performance tuning

### Automated Execution
```bash
# Complete pipeline execution with single command
python run_pipeline.py                                 # Uses default config

# With custom configuration
python run_pipeline.py --config my_config.yaml

# Alternative execution modes
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

## Multi-Model Research Workflow (Pre-Pipeline)

### Phase 1: Deep Research with Multiple AI Models
**Process:** Execute parametric research prompt across 4 AI platforms
**Models Used:** Gemini, Claude, ChatGPT, Perplexity
**Output:** Model-specific bibliographies in `deep-research/[Model]/`

### Phase 2: RIS Standardization
**Process:** Convert AI outputs to RIS format for Zotero import
**Input:** Raw AI responses from each model
**Output:** `to-Zotero/*.ris` files (4 files, one per model)

### Phase 3: Zotero Import and Consolidation
**Process:** Import RIS files into Zotero, organize by model collection
**Manual Steps:** De-duplication, metadata correction, PDF attachment
**Output:** Consolidated bibliography in Zotero

## Processing Stages (Main Pipeline)

### Stage 0: PRISMA-Compliant Assessment (NEW)
**Process:** Human assessment of bibliographic entries for inclusion/exclusion
**Scripts:**
```bash
# Fetch directly from Zotero API and create Excel
python analysis/zotero_to_excel.py -o assessment.xlsx

# Complete assessments in Excel
# Open assessment.xlsx and fill: Relevance, Quality, Decision

# Merge assessments back to RIS
python analysis/excel_to_ris.py assessment.xlsx bibliography.ris -o enriched.ris
```
**Output:** Enriched RIS with PRISMA tags (Include/Exclude/Unclear)

### Stage 1: Literature Collection and Import
**Process:** Import bibliography from Zotero after multi-model literature search
**Input:** `analysis/zotero_vereinfacht.json` (exported from Zotero)
**Status:** Manual Zotero export required before pipeline execution

### Stage 2: Document Acquisition and Conversion

#### Intelligent PDF Acquisition
```bash
python analysis/getPDF_intelligent.py
# Hierarchical acquisition strategy:
#   1. Zotero attachments (local PDFs)
#   2. Metadata URLs/DOIs
#   3. Open access APIs (Unpaywall, ArXiv)
#   4. Manual intervention report
# Input: analysis/zotero_vereinfacht.json
# Output: analysis/pdfs/*.pdf
# Success rate: >80% with Zotero attachments
# Reports: acquisition_log.json, missing_pdfs.csv

# With Zotero API integration:
python analysis/getPDF_intelligent.py \
  --api-key YOUR_KEY \
  --library-id 12345 \
  --library-type user
```

#### PDF to Markdown Conversion
```bash
python analysis/pdf-to-md-converter.py
# Input: analysis/pdfs/*.pdf
# Output: analysis/markdown_papers/*.md
# Processing time: ~30 seconds per document
```

### Stage 3: Automated Content Analysis
```bash
python analysis/summarize-documents.py
# Model: Claude Haiku 4.5 (claude-haiku-4-5, temperature=0.3, max_tokens=2048)
# Process: 5-stage iterative refinement
#   1. Academic analysis (400 words)
#   2. Structured synthesis (500 words)
#   3. Critical validation
#   4. Clean summary generation
#   5. Metadata extraction (YAML format)
# Input: analysis/markdown_papers/*.md
# Output: analysis/summaries_final/*.md
# Processing time: ~60 seconds per document (2x faster than previous approach)
# API rate limit: 2-second delay between documents
# Cost: ~$0.03-0.04 per document ($1/M input + $5/M output tokens)
```

### Stage 4: Knowledge Graph Construction
```bash
python analysis/generate_obsidian_vault_improved.py
# Algorithm: Pattern-based concept extraction with normalization
# Deduplication: Synonym mapping (182 terms → canonical forms)
# Filtering: Frequency threshold ≥2 occurrences
# Consolidation: 302 initial concepts → 35 final concepts
# Categories: Bias Types (14), Mitigation Strategies (21)
# Output: FemPrompt_Vault/ (Obsidian-compatible format)
# Processing time: <60 seconds for complete corpus
```

### Stage 5: Quality Validation
```bash
python analysis/test_vault_quality.py
# Metrics evaluated:
#   - Concept uniqueness (target: >95%)
#   - Metadata completeness (target: 100%)
#   - Cross-reference integrity (target: <10 broken links)
#   - Frequency distribution analysis
# Current score: 85/100 (GOOD)
# Output: Console report with detailed metrics
```

## Standard Operating Procedures

### Procedure 1: Automated Complete Pipeline
```bash
# Single command for complete workflow
python run_pipeline.py                                 # Duration: ~90 minutes for 30 documents

# With custom configuration
python run_pipeline.py --config my_config.yaml
```

### Procedure 2: Processing New Literature Corpus (Manual)
```bash
# Sequential execution required
python analysis/getPDF_intelligent.py                  # Duration: ~5 minutes for 30 PDFs
python analysis/pdf-to-md-converter.py                 # Duration: ~15 minutes
python analysis/summarize-documents.py                 # Duration: ~60 minutes for 30 documents
python analysis/generate_obsidian_vault_improved.py    # Duration: <1 minute
python analysis/test_vault_quality.py                  # Duration: <10 seconds
```

### Procedure 3: Vault Regeneration
```bash
# For concept extraction refinement only
python analysis/generate_obsidian_vault_improved.py
python analysis/test_vault_quality.py
# Note: Preserves existing document summaries
```

### Procedure 4: Failed Document Recovery
```bash
# Identify failed documents
grep '"failed"' analysis/summaries_final/batch_metadata.json

# Adjust rate limiting (if API errors)
# Modify: analysis/summarize-documents.py:415
# Current: time.sleep(10)
# Recommended: time.sleep(30)
```

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
**Root Cause:** Filename mismatch between `zotero_vereinfacht.json` and markdown files
**Resolution:**
1. Verify file presence: `ls -la analysis/zotero_vereinfacht.json`
2. Check filename consistency: Paper names must match exactly (case-sensitive)
3. Fallback mechanism activates automatically (lines 264-266)

### Error: Concept Over-Extraction
**Symptom:** >100 concepts extracted from limited corpus
**Configuration Points:**
- Frequency caps: `analysis/generate_obsidian_vault_improved.py:198-203`
- Blacklist terms: `analysis/generate_obsidian_vault_improved.py:184-195`
- Minimum frequency: `analysis/generate_obsidian_vault_improved.py:441`
**Recommended Settings:**
```python
frequency_caps = {
    'AI Systems': 30,
    'Large Language Models': 50,
    'Artificial Intelligence': 30
}
min_frequency = 3  # Increase from 2
```

## Directory Structure

```
FemPrompt_SozArb/
├── run_pipeline.py              # Master orchestration script
├── pipeline_config.yaml         # Pipeline configuration
├── requirements.txt            # Python dependencies
├── analysis/                    # Processing pipeline scripts
│   ├── pdfs/                    # Downloaded PDF documents (EMPTY)
│   ├── markdown_papers/         # Converted documents (EMPTY)
│   ├── summaries_final/         # AI-generated summaries (LEGACY DATA)
│   ├── all_pdf/                 # Alternative PDF storage
│   ├── __pycache__/            # Python cache files
│   ├── zotero_vereinfacht.json  # Bibliography metadata
│   ├── zotero_vollstaendig.json # Complete Zotero export
│   ├── zotero_sammlungen.json   # Zotero collections
│   ├── conversion_metadata.json # PDF conversion tracking
│   ├── vault_test_report.json   # Vault quality metrics
│   ├── getPDF.py                # Legacy PDF downloader (deprecated)
│   ├── getPDF_intelligent.py    # Smart PDF acquisition
│   ├── pdf-to-md-converter.py   # Format conversion
│   ├── summarize-documents.py   # Content analysis
│   ├── generate_obsidian_vault_improved.py # Knowledge graph
│   ├── test_vault_quality.py    # Quality validation
│   ├── ris_to_excel.py          # NEW: RIS to Excel converter
│   ├── excel_to_ris.py          # NEW: Excel to RIS merger
│   ├── test_assessment_workflow.py # NEW: Assessment test
│   ├── ASSESSMENT_WORKFLOW.md   # NEW: Assessment documentation
│   ├── PDF_ACQUISITION_WORKFLOW.md # PDF acquisition specs
│   └── SUMMARIZE-DOCUMENTS.md   # Summarization documentation
├── deep-research/               # Multi-model research results
│   ├── Claude/                 # Claude AI outputs
│   ├── Gemini/                 # Gemini outputs
│   ├── OpenAI/                 # ChatGPT outputs
│   └── Perplexity/             # Perplexity outputs
├── to-Zotero/                   # RIS files for import
│   ├── claude-deep-research-bibliography-1.ris
│   ├── Gemini-deep-research-bibliography-1.ris
│   ├── OpenAI-deep-research-bibliography-1.ris
│   ├── perplexity-deep-research-bibliography-1.ris
│   └── ris-template.md
├── knowledge/                   # NEW: Empty folder (purpose unclear)
├── FemPrompt_Vault/             # Obsidian knowledge graph (NOT YET CREATED)
├── deep_research_workflow_diagram.png # Workflow visualization
├── JOURNAL.md                   # Development iteration log
├── CLAUDE.md                    # Technical documentation (this file)
└── ReadMe.md                    # Project overview

```

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

### Performance Characteristics
- Document summarization: ~60 seconds per document (Claude Haiku 4.5)
- Vault generation: <60 seconds for 35 documents
- PDF conversion: ~30 seconds per document (CPU-bound, Docling)
- Quality testing: <10 seconds
- API rate limit: 2-second delay between requests (Claude)
- Memory usage: ~500MB for typical 30-document corpus
- Cost: ~$1.30-1.70 for 43 documents (Claude Haiku 4.5)

### Input/Output Specifications
- Input formats: PDF, Markdown (.md)
- Output formats: Markdown (.md), JSONL, HTML
- Encoding: UTF-8 throughout
- Maximum document size: 50MB (PDF), 4MB (Markdown)
- API token limit: 2048 tokens per response

## Implementation Status

### Completed Components ✅
- Multi-model research workflow
- RIS standardization (4 model-specific RIS files)
- Assessment workflow implementation (Excel-based with Zotero API integration)
- Pipeline orchestration (`run_pipeline.py`)
- Intelligent PDF acquisition (`getPDF_intelligent.py`)
- Zotero API integration (`pyzotero` installed)
- Documentation suite (CLAUDE.md, JOURNAL.md, README.md)

### In Progress 🔄
- PRISMA assessment (human review phase)
- PDF acquisition from assessed papers
- Document summarization with Claude Haiku 4.5

### Not Started ❌
- Obsidian vault generation (FemPrompt_Vault/)
- Complete pipeline execution
- Quality validation
- Final synthesis

### Known Issues ⚠️
- None - all critical path issues fixed ✅
- FemPrompt_Vault/ will be created on first vault generation run
- 12 PDFs successfully acquired in testing

---
*Document Version: 3.0*
*Last Modified: 2025-09-29*
*Pipeline Version: 1.0*
*Implementation Status: ~70% Complete*