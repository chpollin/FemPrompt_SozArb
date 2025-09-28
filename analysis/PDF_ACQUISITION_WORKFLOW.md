# PDF Acquisition Workflow - Technical Specification

## Overview

This document specifies an intelligent, hierarchical PDF acquisition system that prioritizes locally available resources before attempting remote downloads. The system integrates with Zotero to enable domain experts to directly upload PDFs, eliminating manual URL collection.

## Acquisition Hierarchy

### Priority Level 1: Zotero Attachments
**Source:** PDFs directly attached to Zotero entries
**Method:** Zotero API or direct storage access
**Success Rate:** 100% if attachment exists
**Latency:** <1 second

### Priority Level 2: Metadata URLs
**Source:** URL/DOI fields in bibliographic metadata
**Method:** Direct HTTP download with authentication handling
**Success Rate:** ~70% (depends on access rights)
**Latency:** 2-10 seconds

### Priority Level 3: Academic Databases
**Sources:**
- Unpaywall API (legal open access)
- ArXiv direct download
- PubMed Central
- Institutional repositories
**Success Rate:** ~40% for recent papers
**Latency:** 5-20 seconds

### Priority Level 4: Manual Intervention
**Action:** Generate report for missing PDFs
**Output:** CSV with paper details for manual acquisition

## Implementation Architecture

```
Input: zotero_vereinfacht.json
  ↓
┌─────────────────────────────┐
│  PDF Acquisition Pipeline   │
├─────────────────────────────┤
│ 1. Parse Zotero Metadata    │
│ 2. Check Local Attachments  │
│ 3. Attempt Remote Download  │
│ 4. Validate PDF Integrity   │
│ 5. Log Results              │
└─────────────────────────────┘
  ↓
Output: analysis/pdfs/*.pdf
```

## Zotero Integration Methods

### Method A: Zotero API (Recommended)
```python
# Requirements: pyzotero library
from pyzotero import zotero

# Configuration
library_id = "user_or_group_id"
library_type = "user"  # or "group"
api_key = "your_api_key"  # Optional for public libraries

# Access pattern
zot = zotero.Zotero(library_id, library_type, api_key)
items = zot.items()
attachments = zot.children(item_key)
```

### Method B: Direct Storage Access
```python
# Zotero storage structure
# Windows: C:\Users\[username]\Zotero\storage\
# Mac: ~/Zotero/storage/
# Linux: ~/.zotero/storage/

# Storage pattern: [8-char-key]/[filename].pdf
# Example: ABCD1234/Smith_2023.pdf
```

### Method C: Export Bundle
```
Zotero → File → Export Library →
  Format: Zotero RDF
  ☑ Export Files
  → Creates zip with metadata + PDFs
```

## Data Flow Specification

### Input Format (zotero_vereinfacht.json)
```json
{
  "items": [
    {
      "key": "ABCD1234",
      "title": "Paper Title",
      "creators": [...],
      "date": "2023",
      "url": "https://doi.org/...",
      "DOI": "10.1234/...",
      "attachments": [
        {
          "key": "EFGH5678",
          "title": "Full Text PDF",
          "mimeType": "application/pdf",
          "path": "storage:Smith_2023.pdf"
        }
      ]
    }
  ]
}
```

### Output Structure
```
analysis/
├── pdfs/                    # Successfully acquired PDFs
│   ├── Smith_2023.pdf
│   ├── Jones_2024.pdf
│   └── ...
├── acquisition_log.json     # Detailed acquisition results
└── missing_pdfs.csv        # Papers requiring manual download
```

## Error Handling

### Network Errors
- Retry with exponential backoff (1s, 2s, 4s)
- Maximum 3 attempts per source
- Log failed attempts with error codes

### Access Restrictions
- Detect paywall responses (403, 401)
- Skip to next priority level
- Mark as "access_restricted" in log

### Invalid PDFs
- Verify PDF header (%PDF-)
- Check minimum file size (>1KB)
- Validate using PyPDF2

## Performance Optimization

### Parallel Processing
- Concurrent downloads (max 5 threads)
- Rate limiting per domain (2 req/sec)
- Progress bar with tqdm

### Caching
- Skip already downloaded PDFs
- Store failed attempts for 24 hours
- Cache successful URL patterns

## Usage Workflow for Domain Experts

### Step 1: Literature Collection in Zotero
1. Add papers to Zotero collection
2. **Attach PDFs directly when available**
3. Ensure metadata is complete (DOI/URL)

### Step 2: Export from Zotero
```
Select Collection → Right Click → Export Collection
Format: Better CSL JSON or Zotero RDF
☑ Include Attachments (if using RDF)
Save as: zotero_vereinfacht.json
```

### Step 3: Run Acquisition Pipeline
```bash
python analysis/getPDF_intelligent.py \
  --input zotero_vereinfacht.json \
  --output analysis/pdfs/ \
  --use-zotero-api  # Optional
```

### Step 4: Review Results
- Check `acquisition_log.json` for statistics
- Manually acquire PDFs listed in `missing_pdfs.csv`
- Re-run pipeline after adding missing PDFs to Zotero

## Configuration File (pdf_config.yaml)

```yaml
acquisition:
  zotero:
    api_key: "optional_api_key"
    library_id: "12345"
    library_type: "user"
    storage_path: "~/Zotero/storage"

  priorities:
    - zotero_attachment
    - metadata_url
    - unpaywall_api
    - arxiv_direct
    - manual_flag

  network:
    timeout: 30
    max_retries: 3
    concurrent_downloads: 5
    rate_limit_per_second: 2

  validation:
    min_pdf_size: 1024  # bytes
    check_pdf_header: true

  output:
    pdf_directory: "analysis/pdfs"
    log_file: "acquisition_log.json"
    missing_report: "missing_pdfs.csv"
```

## Success Metrics

### Target Performance
- **Automatic acquisition rate:** >80% with Zotero attachments
- **Processing speed:** 100 papers in <5 minutes
- **Error recovery:** 95% resilience to network issues

### Quality Assurance
- All PDFs validated for integrity
- Comprehensive logging for audit trail
- Clear reporting of manual intervention needs

## Integration with Existing Pipeline

### Before (Current)
```
Manual URL collection → getPDF.py → PDFs
```

### After (Improved)
```
Zotero with PDFs → getPDF_intelligent.py → PDFs
                ↓
         (Automatic fallback to URLs/APIs)
```

## Benefits

1. **For Domain Experts:**
   - Single tool for literature management (Zotero)
   - PDFs automatically transferred to pipeline
   - No manual URL collection needed

2. **For Pipeline:**
   - Higher PDF acquisition success rate
   - Faster processing (local PDFs)
   - Better error recovery

3. **For Research Quality:**
   - Consistent PDF versions
   - Traceable acquisition path
   - Reduced missing documents

---
*Specification Version: 1.0*
*Created: 2025-09-28*
*Status: Ready for Implementation*