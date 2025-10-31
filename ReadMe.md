# FemPrompt Research Pipeline

## AI-Assisted Literature Research System for Bias and Intersectionality Analysis

An automated, end-to-end research pipeline that leverages multiple AI models for systematic literature discovery, intelligent PDF acquisition, and knowledge graph generation.

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Set API key
export GEMINI_API_KEY="your-api-key-here"  # Linux/Mac
# or
$env:GEMINI_API_KEY="your-api-key-here"     # Windows PowerShell

# Run complete pipeline
python run_pipeline.py
```

## The Workflow

### **Step 1: Parametric Deep Research Prompt**

The process begins with a standardized prompt that can be adapted for any research question. It directs an AI to assume the role of an expert, defines the research scope, and specifies the exact output format, ensuring consistent and reusable results.

**Core Prompt Template:**
```

CONTEXT:

-----

How can feminist Digital/AI Literacies and diversity-reflective prompting help to expose and mitigate bias and intersectional discrimination in AI technologies?

-----

You are an expert in systematic scientific literature analysis. Your task is to conduct comprehensive research on the topic above for the period 2023-2025, focusing on peer-reviewed sources.

For each relevant source, you must:

1.  **Cite**: Provide a complete APA-formatted citation, including a URL.
2.  **Summarize**: Write a concise summary (max 150 words) of the central key messages.
3.  **Evaluate**: Assess the quality (high/medium/low) with an explicit justification covering:
      * Peer-review status
      * Journal reputation or impact
      * Methodological robustness
      * Citation frequency and influence

The output must be in a neutral, precise, academic style.

```

### **Step 2: Multi-Model Execution**

To mitigate single-model bias and broaden literature discovery, the prompt is executed in parallel across several major AI platforms (e.g., Gemini, Claude, ChatGPT, Perplexity). Each model independently generates a list of sources, summaries, and quality assessments.

### **Step 3: Standardize to RIS Format**

All AI-generated outputs are converted into the **RIS format**, a standard for bibliographic data. AI-generated summaries and quality notes are preserved in the abstract (`AB`) and notes (`N1`) fields, respectively. This makes the rich, AI-generated data portable and ready for reference management.

### **Step 4: Import and Organize in Zotero**

The standardized `.ris` files are imported into Zotero. To maintain traceability, results from each AI model are organized into separate collections. This allows for easy comparison and source attribution.

### **Step 5: Expert-in-the-Loop Validation**

A human expert reviews the aggregated bibliography in Zotero. This critical step involves:
* **Validating** the relevance and quality of AI-discovered sources.
* **De-duplicating** entries (using Zotero's built-in tools).
* **Correcting** any bibliographic inaccuracies.
* **Curating** the final list of sources for full-text analysis.

### **Step 6: Automated Content Analysis**

This phase performs deep content analysis using the full-text articles:

* **Preparation:** Ensure PDFs are converted to Markdown in `analysis/markdown_papers/` directory
* **Execution:** Run `python analysis/summarize-documents.py`
  * Uses Gemini 2.5 Flash with 5-stage iterative refinement
  * Generates structured summaries with metadata extraction
  * Processing time: ~2 minutes per document
* **Output:** `analysis/summaries_final/` containing:
  * Individual paper summaries with YAML frontmatter
  * Batch metadata tracking processing status

### **Step 7: Knowledge Graph Generation (Obsidian Vault)**

Transform your research papers into an interconnected knowledge graph using Obsidian:

* **Script:** Run `python analysis/generate_obsidian_vault_improved.py`
* **Features:**
  * Smart concept extraction with deduplication and normalization
  * Creates 35 focused concept notes from 35 papers (88% reduction from naive approach)
  * Consolidated intersectional concepts (34 variants → 5 core concepts)
  * Removed AI Technologies category entirely for cleaner focus on bias and mitigation
  * Frequency-based filtering and caps to prevent over-extraction
  * Complete metadata for all papers
  * Master MOC for complete vault navigation
  * Quality Score: 85/100 (tested with `test_vault_quality.py`)
* **Output:** `FemPrompt_Vault/` folder ready to open in Obsidian
* **Benefits:** Visual exploration of research connections, concept frequency tracking, and synthesis templates

## Automated Pipeline Execution

### Complete Workflow (Recommended)

```bash
# Run all stages automatically
python run_pipeline.py

# Resume from checkpoint after interruption
python run_pipeline.py --resume

# Run specific stages only
python run_pipeline.py --stages acquire_pdfs,convert_pdfs

# Skip specific stages
python run_pipeline.py --skip summarize

# Dry run to preview
python run_pipeline.py --dry-run
```

### Manual Stage Execution

For granular control, run stages individually:

```bash
# 1. Acquire PDFs from Zotero metadata
python analysis/getPDF_intelligent.py

# 2. Convert PDFs to Markdown
python analysis/pdf-to-md-converter.py

# 3. Generate AI summaries
python analysis/summarize-documents.py

# 4. Create Obsidian knowledge graph
python analysis/generate_obsidian_vault_improved.py

# 5. Validate vault quality
python analysis/test_vault_quality.py
```

## Project Structure

```
FemPrompt_SozArb/
├── run_pipeline.py              # Master orchestration script
├── pipeline_config.yaml         # Configuration file
├── analysis/                    # Processing scripts
│   ├── getPDF_intelligent.py    # Smart PDF acquisition
│   ├── pdf-to-md-converter.py   # Format conversion
│   ├── summarize-documents.py   # AI content analysis
│   ├── generate_obsidian_vault_improved.py  # Knowledge graph
│   ├── test_vault_quality.py    # Quality validation
│   ├── pdfs/                    # Downloaded PDFs
│   ├── markdown_papers/         # Converted documents
│   ├── summaries_final/         # AI-generated summaries
│   └── zotero_vereinfacht.json  # Bibliography metadata
├── FemPrompt_Vault/             # Obsidian knowledge graph
│   ├── Papers/                  # Individual paper notes
│   ├── Concepts/                # Extracted concepts
│   └── MASTER_MOC.md           # Navigation index
└── knowledge/                   # Project documentation
    ├── Projekt.md               # Research goals and status
    ├── Theorie.md               # Feminist theory
    ├── Methodik.md              # PRISMA methodology
    ├── Technisch.md             # Technical implementation
    ├── Prozess.md               # Workflow steps
    └── Operativ.md              # Prompts and benchmarks
```

## Documentation

Comprehensive project documentation is available in the `knowledge/` folder:

- **[Projekt.md](knowledge/Projekt.md)** - Research question, objectives, scope, limitations, and current status
- **[Theorie.md](knowledge/Theorie.md)** - Feminist theoretical framework (Haraway, Crenshaw, Response-Ability)
- **[Methodik.md](knowledge/Methodik.md)** - PRISMA 2020 methodology, quality criteria, assessment workflow
- **[Technisch.md](knowledge/Technisch.md)** - Technical implementation, API integration, troubleshooting
- **[Prozess.md](knowledge/Prozess.md)** - Step-by-step workflow from deep research to knowledge graph
- **[Operativ.md](knowledge/Operativ.md)** - Prompt templates, benchmarks, Git workflow

For technical details and troubleshooting, see [CLAUDE.md](CLAUDE.md).