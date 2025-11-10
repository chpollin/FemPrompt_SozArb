# FemPrompt & SozArb Research Pipeline

**AI-Assisted Literature Research System for Bias and Intersectionality Analysis**

Automated, end-to-end research pipeline leveraging multiple AI models for systematic literature discovery, intelligent PDF acquisition, and knowledge graph generation.

**Last Updated:** 2025-11-02

---

## Projects

### 1. FemPrompt (326 papers)
- **Focus:** Feminist Digital/AI Literacies and diversity-reflective prompting
- **Research Question:** How can feminist AI literacies help expose and mitigate bias in AI?
- **Status:** Full pipeline operational, Obsidian vault generated
- **Zotero:** Group library 6080294

### 2. SozArb (325 papers) - Current
- **Focus:** AI literacy in social work and vulnerable populations
- **Research Question:** How can social workers develop AI literacy to serve vulnerable populations?
- **Status:** Complete research vault + web viewer operational
- **Zotero:** Group library 6284300 (socialai-litreview-curated)
- **Output:**
  - Obsidian vault with 325 papers (full YAML frontmatter)
  - Web viewer with 264 papers (search, filters, visualization)
  - 13 MOCs for navigation

---

## Quick Start

### Installation

```bash
# Clone repository
git clone <repo-url>
cd FemPrompt_SozArb

# Install dependencies
pip install -r requirements.txt

# Set API key
export ANTHROPIC_API_KEY="sk-ant-your-key"  # Linux/Mac
$env:ANTHROPIC_API_KEY="sk-ant-your-key"    # Windows PowerShell
```

### Run Complete Pipeline

```bash
# Automated execution (recommended)
python run_pipeline.py

# Advanced options
python run_pipeline.py --resume              # Resume from checkpoint
python run_pipeline.py --stages acquire_pdfs,summarize
python run_pipeline.py --dry-run             # Preview only
```

### Manual Stage Execution

```bash
# Step 1: Acquire PDFs (with Excel input and PRISMA filtering)
python analysis/getPDF_intelligent.py \
  --input assessment-llm/output/assessment_llm_run5.xlsx \
  --output analysis/pdfs/ \
  --filter-decision Include

# Step 2: Convert to Markdown
python analysis/pdf-to-md-converter.py \
  --pdf-dir analysis/pdfs/ \
  --output-dir analysis/markdown_papers/

# Step 3: Generate AI summaries (Claude Haiku 4.5)
python analysis/summarize-documents.py \
  --input-dir analysis/markdown_papers/ \
  --output-dir analysis/summaries_final/

# Step 4: Create research vault (Obsidian)
python analysis/generate_research_vault_with_assessment.py

# Step 5: Export to web viewer
python analysis/export_vault_to_web_data.py

# Step 6: Open web viewer
cd docs && python -m http.server 8000
# Visit: http://localhost:8000

# Optional: Validate vault quality
python analysis/test_vault_quality.py --vault-dir SozArb_Research_Vault/
```

---

## The Workflow (7 Steps)

### Step 1: Parametric Deep Research Prompt

Execute a standardized, reusable prompt across 4 AI platforms to discover literature:

**Core Template:**
```
You are an expert in systematic scientific literature analysis.
Conduct comprehensive research on [RESEARCH QUESTION] for [TIME PERIOD].

For each source:
1. Cite: Complete APA citation with URL
2. Summarize: 150-word summary of key messages
3. Evaluate: Quality (high/medium/low) with justification

Output in neutral, precise, academic style.
```

**Models Used:** Claude, Gemini, ChatGPT, Perplexity
**Output:** Model-specific bibliographies in `deep-research/[Model]/`

### Step 2: Standardize to RIS Format

Convert AI outputs to RIS format for Zotero import. AI summaries and quality notes preserved in abstract/notes fields.

**Output:** `to-Zotero/*.ris` (4 files, one per model)

### Step 3: Import to Zotero

Import RIS files into Zotero group library, organize by model collection, de-duplicate entries.

**Output:** Consolidated Zotero library (326 papers for FemPrompt, 325 for SozArb)

### Step 4: PRISMA Assessment

**Option A: LLM-Based (NEW - Fully Automated)**
```bash
python assessment-llm/assess_papers.py \
  --input papers_to_assess.xlsx \
  --output assessment_llm_run6.xlsx

# Results (SozArb Run 5):
# - 325 papers assessed in 24 minutes
# - 100% success rate, $0.58 cost
# - 208 Include, 84 Exclude, 33 Unclear
# - 5-dimensional relevance scoring (0-3 scale)
```

**Option B: Manual Excel-Based (Legacy)**
```bash
python assessment/zotero_to_excel.py  # Export to Excel
# [Fill assessment manually in Excel]
python assessment/excel_to_zotero_tags.py --no-dry-run  # Import tags back
```

**Output:** Curated library with PRISMA tags

### Step 5: PDF Acquisition (PRISMA-Filtered)

Hierarchical acquisition with 8 fallback strategies:

```bash
python analysis/getPDF_intelligent.py \
  --input assessment-llm/output/assessment_llm_run5.xlsx \
  --filter-decision Include \
  --output analysis/pdfs/

# Strategies: Zotero local → DOI → ArXiv → Unpaywall → Semantic Scholar → etc.
# Success rate: >70% for included papers
```

### Step 6: PDF → Markdown → AI Summaries

```bash
# Convert PDFs to Markdown (Docling)
python analysis/pdf-to-md-converter.py

# Generate summaries (Claude Haiku 4.5, 5-stage iterative refinement)
python analysis/summarize-documents.py
# Processing: ~60 seconds/document, ~$0.03-0.04/document
```

### Step 7: Knowledge Graph Generation

```bash
python analysis/generate_obsidian_vault_improved.py

# Algorithm:
# - Pattern-based concept extraction
# - Synonym mapping (182 terms → canonical forms)
# - Frequency filtering (≥2 occurrences)
# - 302 initial concepts → 35 final concepts
# Output: Obsidian-compatible vault with Papers/ and Concepts/ folders
```

---

## Key Features

### Innovations

1. **LLM-Based PRISMA Assessment** - 100% automated, $0.002/paper, 100% success rate
2. **Excel Input Support** - Direct .xlsx reading, no JSON conversion needed
3. **5-Dimensional Relevance Scoring** - Parametric, adaptable to other projects
4. **Hierarchical PDF Acquisition** - 8 fallback strategies for maximum coverage
5. **Multi-Model Literature Discovery** - Mitigates single-model bias

### Reusability

This pipeline is **fully parametric** and can be adapted for:
- Different research questions
- Different assessment dimensions (customize in `prompt_template.md`)
- Different document types
- Different knowledge graph structures

**See:** `assessment-llm/prompt_template_EXAMPLE_SOCIAL_WORK.md` for adaptation example

---

## Performance

**For 208 papers (SozArb Include set):**
- **LLM Assessment:** 24 minutes, $0.58
- **PDF Acquisition:** ~1-2 hours (70-80% success rate)
- **Markdown Conversion:** ~2-3 hours (30-40 sec/doc)
- **AI Summarization:** ~3-4 hours ($6-8 total cost)
- **Vault Generation:** <1 minute
- **Total:** ~6-9 hours, ~$7-9 cost

**Model:** Claude Haiku 4.5 (cost-efficient, fast, high-quality)

---

## Project Structure

```
FemPrompt_SozArb/
├── README.md                    # This file (project overview)
├── CLAUDE.md                    # Working rules for Claude AI
│
├── run_pipeline.py              # Master orchestration script
├── pipeline_config.yaml         # Configuration
├── requirements.txt             # Dependencies
│
├── analysis/                    # Processing pipeline
│   ├── getPDF_intelligent.py    # PDF acquisition (Excel + JSON input)
│   ├── pdf-to-md-converter.py   # Docling conversion
│   ├── summarize-documents.py   # Claude Haiku 4.5 summaries
│   ├── generate_obsidian_vault_improved.py  # Knowledge graph
│   ├── test_vault_quality.py    # Vault validation
│   ├── pdfs/                    # Downloaded PDFs
│   ├── markdown_papers/         # Converted markdown
│   └── summaries_final/         # AI summaries
│
├── assessment-llm/              # LLM-based PRISMA assessment
│   ├── assess_papers.py         # Main assessment script
│   ├── prompt_template.md       # 5-dimensional assessment prompt
│   ├── analyze_results.py       # Results analysis
│   ├── output/
│   │   ├── assessment_socialai_llm.xlsx  # 325 assessed papers
│   │   └── zotero_tags.csv               # Tag export
│   ├── write_llm_tags_to_zotero.py       # Zotero API integration
│   └── SOCIALAI_ASSESSMENT_REPORT.md     # Full assessment report
│
├── assessment/                  # Manual assessment (LEGACY)
│   ├── zotero_to_excel.py       # Zotero → Excel
│   ├── excel_to_zotero_tags.py  # Excel → Zotero tags
│   ├── assessment_socialai.xlsx # Manual assessment data
│   └── README.md
│
├── deep-research/               # Multi-model research outputs
│   ├── Claude/, Gemini/, OpenAI/, Perplexity/
│
├── to-Zotero/                   # RIS files for import
│   └── [4 model-specific .ris files]
│
├── FemPrompt_Vault/             # Obsidian knowledge graph (FemPrompt)
│   ├── Papers/                  # Individual paper notes
│   ├── Concepts/                # Extracted concepts
│   └── MASTER_MOC.md            # Navigation
│
├── docs/                        # Web viewer (Vanilla JS)
│   ├── index.html               # Main application
│   ├── css/research.css         # Professional academic design
│   ├── js/research-app.js       # Application logic
│   ├── data/                    # Auto-generated JSON data
│   │   ├── research_vault.json  # 264 papers with metadata
│   │   ├── graph_data.json      # Network visualization (896 edges)
│   │   └── statistics.json      # Aggregate statistics
│   ├── DESIGN.md                # Design system documentation
│   └── README.md                # Web viewer documentation
│
├── SozArb_Research_Vault/       # Obsidian vault (SozArb)
│   ├── Papers/                  # 325 paper notes with YAML frontmatter
│   ├── MOCs/                    # 13 Maps of Content
│   └── MASTER_MOC.md            # Main navigation
│
└── knowledge/                   # Project documentation
    ├── README.md                # Knowledge base index
    ├── QUICKSTART.md            # Installation & first steps
    ├── TECHNICAL.md             # Complete technical reference
    ├── STATUS.md                # Current state & next steps
    ├── JOURNAL.md               # Development history & decisions
    ├── METHODOLOGY.md           # PRISMA 2020 framework
    ├── PROJECT_OVERVIEW.md      # Research questions & goals
    ├── THEORETICAL_FRAMEWORK.md # Feminist epistemology
    ├── OPERATIONAL_GUIDES.md    # Prompts & workflows
    └── OBSIDIAN_WEB_PUBLISHING.md # Web viewer strategy
```

---

## Documentation

### For Users
- [README.md](README.md) (this file) - Project overview and quick start
- [docs/README.md](docs/README.md) - Web viewer documentation
- [docs/DESIGN.md](docs/DESIGN.md) - Design system reference
- [knowledge/QUICKSTART.md](knowledge/QUICKSTART.md) - Installation & first steps
- [knowledge/TECHNICAL.md](knowledge/TECHNICAL.md) - Complete technical reference
- [knowledge/STATUS.md](knowledge/STATUS.md) - Current state & next steps
- [assessment-llm/SOCIALAI_ASSESSMENT_REPORT.md](assessment-llm/SOCIALAI_ASSESSMENT_REPORT.md) - Assessment results

### For Developers
- [CLAUDE.md](CLAUDE.md) - Working rules for Claude AI assistant
- [knowledge/JOURNAL.md](knowledge/JOURNAL.md) - Development history & decisions

### Research Context (German)
- [knowledge/PROJECT_OVERVIEW.md](knowledge/PROJECT_OVERVIEW.md) - Forschungsfragen & Ziele
- [knowledge/THEORETICAL_FRAMEWORK.md](knowledge/THEORETICAL_FRAMEWORK.md) - Feministische Epistemologie
- [knowledge/METHODOLOGY.md](knowledge/METHODOLOGY.md) - PRISMA 2020 Framework
- [knowledge/OPERATIONAL_GUIDES.md](knowledge/OPERATIONAL_GUIDES.md) - Prompts & Workflows
- [knowledge/OBSIDIAN_WEB_PUBLISHING.md](knowledge/OBSIDIAN_WEB_PUBLISHING.md) - Web Viewer Strategy

---

## Requirements

**Python:** 3.8 or higher
**Key Dependencies:**
- `anthropic` (Claude API)
- `pandas`, `openpyxl` (Excel handling)
- `pyzotero` (Zotero API)
- `docling` (PDF conversion)

**API Keys:**
- `ANTHROPIC_API_KEY` (required for summarization and assessment)
- Zotero API key (optional, for tag import)

---

## Current Status

**FemPrompt:** ✅ Complete (vault generated, 35 concepts extracted)
**SozArb:**
- ✅ LLM assessment complete (325 papers, 100% success)
- 🔄 PDF acquisition ready (208 Include papers)
- ⏳ Markdown conversion pending
- ⏳ Summarization pending
- ⏳ Vault generation pending

**Next:** Execute PDF acquisition for SozArb Include papers

See **CURRENT_STATUS.md** for detailed next steps and decision points.

---

## License & Citation

[Add license information here]

**Citation:**
If you use this pipeline in your research, please cite:
[Add citation information here]

---

## Contact

[Add contact information here]