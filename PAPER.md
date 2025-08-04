# AI-Assisted Systematic Literature Review: From Discovery to Analysis

## Overview

This is a VIBE CODING / VIBE RESEARCH EXPERIMENT for conducting systematic literature reviews on AI bias and intersectionality. The workflow uses multiple AI models for literature discovery and provides custom scripts for automated PDF acquisition and content analysis.

**Research Question**: How can feminist Digital/AI Literacies and diversity-reflective prompting help to expose and mitigate bias and intersectional discrimination in AI technologies?

## Workflow

### Step 1: Multi-Model Literature Discovery

Deploy standardized prompt across 4 AI platforms:
- **Gemini** (Google)
- **Claude** (Anthropic)
- **ChatGPT** (OpenAI)
- **Perplexity** (Perplexity AI)

**Prompt Template**:
```
CONTEXT: [Research Question]

You are an expert in systematic scientific literature analysis. Your task is to conduct comprehensive research on the topic above for the period 2023-2025, focusing on peer-reviewed sources.

For each relevant source, you must:
1. Cite: Provide a complete APA-formatted citation, including a URL
2. Summarize: Write a concise summary (max 150 words) of key messages
3. Evaluate: Assess quality (high/medium/low) with justification
```

### Step 2: Convert to RIS Format

Convert all AI outputs to RIS format, preserving AI-generated summaries in `AB` field and quality assessments in `N1` field:

```ris
TY  - JOUR
AU  - Author, Name
PY  - 2024
TI  - Title
JO  - Journal
UR  - https://url
AB  - [AI-generated summary]
N1  - Quality: High - [AI assessment]
ER  -
```

### Step 3: Import to Zotero

- Import RIS files into Zotero
- Create separate collections per AI model
- Expert validates relevance and quality
- De-duplicate entries
- Curate final bibliography

### Step 4: Automated PDF Acquisition

**Script**: `getPDF.py`

**Features**:
- Multi-strategy PDF acquisition (8 strategies)
- Concurrent downloads (max_workers=3)
- Automatic retry with backoff
- PDF validation (header check, size limits)
- Detailed logging
- Unit tests included

**Strategies**:
1. Direct PDF URL detection
2. ArXiv pattern matching
3. Semantic Scholar API
4. CrossRef API
5. Sage Journals specific
6. ACM Digital Library specific
7. BASE Academic Search
8. HTML meta tag parsing

**Configuration**:
```python
@dataclass
class Config:
    max_workers: int = 3
    timeout: int = 15
    retry_attempts: int = 2
    delay_between_requests: float = 0.5
    min_pdf_size: int = 1024
    max_pdf_size: int = 50 * 1024 * 1024  # 50MB
```

### Step 5: Content Extraction

**Script**: `pdf-to-md-converter.py` (using Docling)
- Converts PDFs to Markdown
- Preserves structure and formatting
- Tracks conversion metadata
- Incremental processing (hash-based)

### Step 6: Corpus Analysis

**Script**: `md-to-process-corpus.py` (using LangExtract)

**Configuration**:
```bash
export GEMINI_API_KEY="YOUR_API_KEY_HERE"
```

**Extraction Schema**:
```python
- ai_technology: Specific AI system discussed
- bias_type: Form of bias identified  
- mitigation_strategy: Proposed solutions
- key_finding: Direct quote summarizing results
```

**Model**: `gemini-2.5-flash`

**Outputs**:
- `corpus_analysis.jsonl`: Machine-readable extracted data
- `corpus_analysis_visualization.html`: Interactive visualization with highlights

## Current Corpus

**28 research papers** including:
- Intersectional analysis of Stable Diffusion
- PreciseDebias automatic prompting
- Feminist AI frameworks
- Gender bias in LLMs
- Data feminism approaches
- UNESCO bias investigations

**Key Sources**:
- UN Women reports on AI and gender equality
- A+ Alliance Feminist AI Research Network ($2M CAD project)
- Friedrich-Ebert-Stiftung analysis papers
- ACL, FAccT, AAAI conference proceedings

## Technical Details

### Dependencies
- Python 3.8+
- requests, beautifulsoup4
- langextract (for corpus analysis)
- Docling (for PDF conversion)
- Zotero (reference management)

### Known Issues
1. **Model Version**: README incorrectly references "gemini-2.5-flash" - use "gemini-1.5-flash"
2. **Script Names**: README mentions "corpus_analysis_final_script.py" - actual is "md-to-process-corpus.py"
3. **JSON Parsing**: Hardened prompts needed to ensure valid JSON from AI
4. **Browser Storage**: Artifacts cannot use localStorage/sessionStorage

### API Integration
The environment includes extensive Canva API functionality for:
- Design search and retrieval
- Content extraction from Canva documents
- Export to various formats
- Folder management
- Comment/collaboration features
- AI design generation

## Limitations

1. **API Dependencies**: Requires active API keys and internet connection
2. **Language**: English-only sources
3. **Access**: Paywalled articles require manual download
4. **AI Knowledge Cutoffs**: Training data limitations affect recent publications
5. **Processing Errors**: Some PDFs fail conversion, some AI responses need retry

## Files Structure

```
├── analysis/
│   ├── getPDF.py                    # PDF acquisition script
│   ├── pdf-to-md-converter.py       # Docling conversion
│   ├── md-to-process-corpus.py      # LangExtract analysis
│   ├── conversion_metadata.json     # Tracking conversions
│   ├── zotero_vereinfacht.json      # Simplified bibliography
│   └── corpus_analysis.jsonl        # Extracted data
├── markdown_papers/                 # Converted papers
├── all_pdf/                        # Downloaded PDFs
└── to-Zotero/                      # RIS import files
```