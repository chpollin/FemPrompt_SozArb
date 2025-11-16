# Quick Start - FemPrompt & SozArb Pipeline

Get started with the literature research pipeline in 10 minutes

---

## Installation

### 1. Clone Repository

```bash
git clone <repo-url>
cd FemPrompt_SozArb
```

### 2. Install Dependencies

```bash
# Install all Python packages
pip install -r requirements.txt

# Key packages installed:
# - anthropic (Claude API)
# - pandas, openpyxl (Excel handling)
# - pyzotero (Zotero API)
# - docling (PDF conversion)
```

### 3. Configure API Keys

```bash
# Linux/Mac
export ANTHROPIC_API_KEY="sk-ant-your-key-here"

# Windows PowerShell
$env:ANTHROPIC_API_KEY="sk-ant-your-key-here"

# Or create .env file (recommended):
echo "ANTHROPIC_API_KEY=sk-ant-your-key-here" > .env
```

---

## Quick Run Examples

### Example 1: Complete Pipeline (Automated)

```bash
# Run all 5 stages automatically
python run_pipeline.py

# What happens:
# Stage 1: PDF Acquisition (Zotero + APIs)
# Stage 2: PDF → Markdown conversion (Docling)
# Stage 3: AI Summarization (Claude Haiku 4.5)
# Stage 4: Knowledge Graph (Obsidian Vault)
# Stage 5: Quality Validation

# Duration: ~6-9 hours for 208 papers
# Cost: ~$7-9 (Claude Haiku 4.5)
```

### Example 2: LLM-Based PRISMA Assessment

```bash
# Assess 325 papers automatically
python assessment-llm/assess_papers.py \
  --input assessment-llm/input/papers_to_assess.xlsx \
  --output assessment-llm/output/assessment_run6.xlsx

# Results (Run 5 example):
# - 325 papers assessed in 24 minutes
# - 100% success rate
# - Cost: $0.58 (Claude Haiku 4.5)
# - Output: 208 Include, 84 Exclude, 33 Unclear
```

### Example 3: PDF Acquisition (PRISMA-Filtered)

```bash
# Acquire PDFs for ONLY included papers
python analysis/getPDF_intelligent.py \
  --input assessment-llm/output/assessment_llm_run5.xlsx \
  --output analysis/pdfs/ \
  --filter-decision Include

# Features:
# - Excel input (no JSON conversion needed)
# - 8 hierarchical fallback strategies
# - Success rate: 70-80%
# - Duration: ~1-2 hours for 208 papers
```

### Example 4: Manual Stage Execution

```bash
# Step 1: Acquire PDFs
python analysis/getPDF_intelligent.py \
  --input assessment-llm/output/assessment_llm_run5.xlsx \
  --output analysis/pdfs/ \
  --filter-decision Include

# Step 2: Convert to Markdown
python analysis/pdf-to-md-converter.py \
  --pdf-dir analysis/pdfs/ \
  --output-dir analysis/markdown_papers/

# Step 3a: Validate markdown quality (IMPORTANT - saves API costs!)
python analysis/validate_markdown_quality.py \
  --input-dir analysis/markdown_papers/ \
  --output-csv analysis/markdown_validation_report.csv

# Step 3b: Generate AI summaries (Enhanced v2.0)
python analysis/summarize_documents_enhanced.py \
  --input-dir analysis/markdown_papers/ \
  --output-dir analysis/summaries_final/

# Step 4: Create knowledge graph
python analysis/generate_obsidian_vault_improved.py \
  --input-dir analysis/summaries_final/ \
  --output-dir SozArb_Vault/

# Step 5: Validate quality
python analysis/test_vault_quality.py --vault-dir SozArb_Vault/
```

---

## The 7-Step Workflow

### Step 1: Multi-Model Deep Research

Execute parametric prompt across 4 AI platforms (Claude, Gemini, ChatGPT, Perplexity):

```
You are an expert in systematic scientific literature analysis.
Conduct comprehensive research on [RESEARCH QUESTION] for [TIME PERIOD].

For each source:
1. Cite: Complete APA citation with URL
2. Summarize: 150-word summary
3. Evaluate: Quality (high/medium/low) with justification

Output in neutral, academic style.
```

Output: `deep-research/[Model]/` - Model-specific bibliographies

### Step 2: Standardize to RIS

Convert AI outputs to RIS format for Zotero import.

Output: `to-Zotero/*.ris` (4 files)

### Step 3: Import to Zotero

Import RIS files into Zotero group library, de-duplicate, organize.

Output: Consolidated Zotero library (326 FemPrompt, 325 SozArb)

### Step 4: PRISMA Assessment

Option A: LLM-Based (Recommended)
```bash
python assessment-llm/assess_papers.py \
  --input papers.xlsx \
  --output assessment.xlsx

# 100% automated, $0.002/paper, 5-dimensional scoring
```

Option B: Manual Excel-Based
```bash
python assessment/zotero_to_excel.py
# [Fill assessment manually]
python assessment/excel_to_zotero_tags.py --no-dry-run
```

### Step 5: PDF Acquisition

```bash
python analysis/getPDF_intelligent.py \
  --input assessment.xlsx \
  --filter-decision Include \
  --output analysis/pdfs/

# 8 hierarchical strategies:
# Zotero → DOI → ArXiv → Unpaywall → Semantic Scholar → etc.
```

### Step 6: PDF → Markdown → Summaries

```bash
# Convert PDFs (Docling)
python analysis/pdf-to-md-converter.py

# Generate summaries (Claude Haiku 4.5)
python analysis/summarize-documents.py
# ~60 sec/document, ~$0.03-0.04/document
```

### Step 7: Knowledge Graph

```bash
python analysis/generate_obsidian_vault_improved.py

# Algorithm:
# - Pattern-based concept extraction
# - Synonym mapping (182 terms)
# - Frequency filtering (≥2 occurrences)
# - 302 concepts → 35 final concepts
```

---

## Performance Estimates

For 208 papers (SozArb Include set):

| Stage | Duration | Cost | Success Rate |
|-------|----------|------|--------------|
| LLM Assessment | 24 min | $0.58 | 100% |
| PDF Acquisition | 1-2 hours | Free | 70-80% |
| Markdown Conversion | 2-3 hours | Free | ~100% |
| **Markdown Validation** | **<1 min** | **Free** | **100%** |
| AI Summarization (v2.0) | 6-7 hours | $8-9 | ~100% |
| Vault Generation | <1 min | Free | 100% |
| Total | 9-12 hours | $9-10 | ~75% |

Model: Claude Haiku 4.5 (cost-efficient, fast, high-quality)

**Actual Results (47 papers processed 2025-11-16):**
- Markdown Validation: 46 PASS, 1 FAIL (saved $7.50 + 70 min on corrupted file)
- Enhanced Summarization v2.0: ~100 min, $2.00, 76.1/100 avg quality
- Per-paper: ~2.1 min, $0.042

---

## Common Commands

### Resume After Interruption

```bash
python run_pipeline.py --resume
```

### Run Specific Stages Only

```bash
python run_pipeline.py --stages acquire_pdfs,summarize
```

### Skip Stages

```bash
python run_pipeline.py --skip convert_pdfs
```

### Dry Run (Preview)

```bash
python run_pipeline.py --dry-run
```

### Verbose Output

```bash
python run_pipeline.py -v
```

---

## Troubleshooting

### Error: API Rate Limit (HTTP 429)

Solution: Increase delay in `summarize-documents.py`
```python
time.sleep(5)  # Instead of time.sleep(2)
```

### Error: Missing PDFs

Check: `acquisition_log.json` and `missing_pdfs.csv`
Solution: Manual download from university library

### Error: NaN URL in getPDF_intelligent.py

Fixed in latest version - Type checking added

### Error: Memory Error During PDF Conversion

Solution: Process in smaller batches (5 PDFs at a time)

---

## Next Steps

After Quick Start:

1. Learn more: Read `02_TECHNICAL.md` for complete technical reference
2. Check status: See `03_STATUS.md` for current project state
3. Understand research: Read German docs (`Projekt.md`, `Theorie.md`, `Methodik.md`)
4. Adapt pipeline: See `assessment-llm/prompt_template_EXAMPLE_SOCIAL_WORK.md`

---

## Key Innovations

1. LLM-Based PRISMA Assessment - 100% automated, $0.002/paper
2. Excel Input Support - Direct .xlsx reading, no JSON conversion
3. 5-Dimensional Relevance Scoring - Parametric, adaptable
4. Hierarchical PDF Acquisition - 8 fallback strategies
5. Multi-Model Literature Discovery - Mitigates single-model bias

---

Last Updated: 2025-11-16
Version: 2.1 (Enhanced Pipeline v2.0 + Markdown Validation)
Status: FemPrompt complete | SozArb Enhanced Summaries v2.0 complete (47 papers) 
