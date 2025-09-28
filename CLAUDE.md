# Technical Documentation - FemPrompt Literature Research Pipeline

## System Overview

This documentation specifies the operational procedures for an automated literature research pipeline utilizing multi-model AI synthesis for bias and intersectionality analysis in artificial intelligence systems.

## System Requirements

### Software Dependencies
- Python 3.8 or higher
- Operating System: Windows 10/11, macOS 10.14+, Linux (Ubuntu 20.04+)

### Python Package Requirements
```bash
# Core dependencies
pip install requests==2.31.0
pip install pyyaml==6.0.1
pip install beautifulsoup4==4.12.2
pip install PyPDF2==3.0.1

# Development dependencies (optional)
pip install pytest==7.4.3
pip install mypy==1.7.1
pip install black==23.12.0
pip install ruff==0.1.7
```

### Environment Configuration
```bash
# Gemini API Key Configuration (required for document processing)
export GEMINI_API_KEY="your-api-key-here"              # Unix/Linux/macOS
$env:GEMINI_API_KEY="your-api-key-here"                # Windows PowerShell
set GEMINI_API_KEY=your-api-key-here                   # Windows Command Prompt
```

## Pipeline Architecture

### Execution Sequence
```bash
# Complete pipeline execution (currently manual, automation pending)
python analysis/getPDF.py                              # Stage 1: Document acquisition
python analysis/pdf-to-md-converter.py                 # Stage 2: Format conversion
python analysis/summarize-documents.py                 # Stage 3: Content analysis
python analysis/generate_obsidian_vault_improved.py    # Stage 4: Knowledge graph generation
python analysis/test_vault_quality.py                  # Stage 5: Quality validation
```

## Processing Stages

### Stage 1: Multi-Model Literature Discovery
**Process:** Systematic literature search using parametric prompts across four AI models
**Models:** Google Gemini 1.5 Pro, Anthropic Claude 3, OpenAI GPT-4, Perplexity Pro
**Output Directory:** `deep-research/[ModelName]/`
**Export Format:** RIS (Research Information Systems)
**Status:** Manual execution required

### Stage 2: Document Acquisition and Conversion
```bash
# Document download from identified sources
python analysis/getPDF.py
# Input: URL list from literature discovery
# Output: PDF documents in analysis/pdfs/

# PDF to Markdown conversion
python analysis/pdf-to-md-converter.py
# Input: analysis/pdfs/*.pdf
# Output: analysis/markdown_papers/*.md
# Processing time: ~30 seconds per document
```

### Stage 3: Automated Content Analysis
```bash
python analysis/summarize-documents.py
# Model: Google Gemini 2.5 Flash (temperature=0.3, max_tokens=2048)
# Process: 5-stage iterative refinement
#   1. Academic analysis (400 words)
#   2. Structured synthesis (500 words)
#   3. Critical validation
#   4. Clean summary generation
#   5. Metadata extraction (YAML format)
# Input: analysis/markdown_papers/*.md
# Output: analysis/summaries_final/*.md
# Processing time: 120±15 seconds per document
# API rate limit: 10-second delay between documents
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

### Procedure 1: Processing New Literature Corpus
```bash
# Sequential execution required
python analysis/summarize-documents.py                 # Duration: ~60 minutes for 30 documents
python analysis/generate_obsidian_vault_improved.py    # Duration: <1 minute
python analysis/test_vault_quality.py                  # Duration: <10 seconds
```

### Procedure 2: Vault Regeneration
```bash
# For concept extraction refinement only
python analysis/generate_obsidian_vault_improved.py
python analysis/test_vault_quality.py
# Note: Preserves existing document summaries
```

### Procedure 3: Failed Document Recovery
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
**Root Cause:** Exceeding Gemini API quota (60 requests per minute)
**Resolution:**
1. Modify `analysis/summarize-documents.py:415`
2. Increase delay: `time.sleep(10)` → `time.sleep(30)`
3. Alternative: Implement exponential backoff (2^n seconds)

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
├── deep-research/           # Multi-model literature search results
│   ├── Claude/             # Anthropic Claude outputs
│   ├── Gemini/             # Google Gemini outputs
│   ├── OpenAI/             # OpenAI GPT-4 outputs
│   └── Perplexity/         # Perplexity Pro outputs
├── to-Zotero/              # RIS format bibliographies
│   └── *.ris               # One file per AI model
├── analysis/               # Processing pipeline scripts
│   ├── markdown_papers/    # Converted documents (input)
│   ├── summaries_final/    # Processed summaries (output)
│   ├── getPDF.py           # Document acquisition
│   ├── pdf-to-md-converter.py # Format conversion
│   ├── summarize-documents.py # Content analysis
│   ├── generate_obsidian_vault_improved.py # Knowledge graph
│   └── test_vault_quality.py # Quality validation
├── FemPrompt_Vault/        # Obsidian knowledge graph output
│   ├── Papers/             # Individual paper notes
│   ├── Concepts/           # Extracted concept notes
│   └── MASTER_MOC.md       # Map of content
├── JOURNAL.md              # Development iteration log
├── CLAUDE.md               # Technical documentation (this file)
└── ReadMe.md               # Project overview

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
- Document summarization: 120±15 seconds per document
- Vault generation: <60 seconds for 35 documents
- PDF conversion: ~30 seconds per document (CPU-bound)
- Quality testing: <10 seconds
- API rate limit: 60 requests/minute (Gemini)
- Memory usage: ~500MB for typical 30-document corpus

### Input/Output Specifications
- Input formats: PDF, Markdown (.md)
- Output formats: Markdown (.md), JSONL, HTML
- Encoding: UTF-8 throughout
- Maximum document size: 50MB (PDF), 4MB (Markdown)
- API token limit: 2048 tokens per response

---
*Document Version: 2.0*
*Last Modified: 2025-09-28*
*Pipeline Version: 1.0*