# Zotero-Excel Assessment Workflow Documentation

## Overview

A streamlined workflow for PRISMA-compliant literature assessment that bridges Zotero's bibliographic management with Excel's efficient assessment capabilities. This workflow enables systematic evaluation of research papers with full traceability and metadata preservation.

## Workflow Architecture

```
Zotero Library
    ↓
RIS Export (bibliography)
    ↓
ris_to_excel.py → Excel Template
    ↓
Human Assessment in Excel
    ↓
excel_to_ris.py → Enriched RIS
    ↓
Zotero Import (with tags)
    ↓
Pipeline Processing (filtered)
```

## Quick Start

### 1. Export from Zotero
```bash
# In Zotero:
Select Collection → Right Click → Export Collection
Format: RIS
Save as: bibliography.ris
```

### 2. Convert to Excel
```bash
python analysis/ris_to_excel.py bibliography.ris -o assessment.xlsx
```

### 3. Complete Assessments
Open `assessment.xlsx` in Excel and fill in:
- **Relevance_Score** (1-5): Core relevance to research question
- **Quality** (High/Medium/Low): Publication quality
- **Decision** (Include/Exclude/Unclear): Inclusion decision
- **Exclusion_Reason**: PRISMA-compliant reason if excluded
- **Notes**: Additional comments

### 4. Merge Back to RIS
```bash
python analysis/excel_to_ris.py assessment.xlsx bibliography.ris -o enriched.ris
```

### 5. Import to Zotero
Import `enriched.ris` into Zotero. Papers will have assessment tags for filtering.

## Assessment Criteria

### Relevance Scoring (1-5)
- **5**: Core topic (feminist AI literacy, diversity prompting)
- **4**: Highly relevant (intersectional bias analysis, prompt engineering)
- **3**: Relevant (general AI bias, fairness research)
- **2**: Peripheral (policy without theoretical framework)
- **1**: Off-topic

### Quality Assessment
- **High**: Q1/Q2 peer-reviewed journals, top conferences
- **Medium**: Peer-reviewed journals, standard conferences
- **Low**: Grey literature, reports, preprints, policy documents

### Decision Rules
- **Include**: Relevance ≥3 AND Quality ∈ {High, Medium}
- **Exclude**: Fails inclusion criteria
- **Unclear**: Requires team discussion

### PRISMA-Compliant Exclusion Reasons
1. Wrong topic
2. Wrong study type
3. Wrong timeframe
4. Not peer-reviewed
5. No full text
6. Duplicate
7. Language
8. Insufficient quality
9. Not empirical
10. Other (specify in notes)

## Excel Features

### Automated Features
- **Data Validation**: Dropdown lists for categorical fields
- **Conditional Formatting**: Color coding for decisions
  - Green: Include
  - Red: Exclude
  - Yellow: Unclear
- **Auto-generated Tags**: `=CONCAT("rel",K2,"_qual",L2,"_",M2)`
- **Frozen Headers**: Scrollable with fixed column headers
- **Hidden Columns**: Full abstracts/URLs hidden but accessible

### Efficiency Tips
1. Use filters to process papers by category
2. Sort by journal/year for batch processing
3. Filter "Unclear" items for team discussion
4. Use keyboard shortcuts for dropdown navigation

## Matching Algorithm

### Primary: DOI Matching
- Exact match on DOI field
- 100% accuracy when DOI present
- ~70% of papers have DOIs

### Fallback: Title Matching
- Normalized title comparison
- Removes punctuation, lowercases
- 85% similarity threshold (fuzzy matching)
- Handles minor variations

### Unmatched Entries
- Logged to `match_log.csv`
- Original RIS entry preserved
- Manual resolution possible

## Integration with Pipeline

### Filtering in Downstream Processing
```python
# In summarize-documents.py or other scripts
def filter_included_papers(ris_file):
    """Filter only papers marked as Include"""
    included = []
    for entry in parse_ris(ris_file):
        if "PRISMA_Include" in entry.get('keywords', []):
            included.append(entry)
    return included
```

### Using Assessment Metadata
Papers are enriched with:
- `N2` tags: Assessment data
- `KW` tags: Searchable keywords
  - `PRISMA_Include/Exclude/Unclear`
  - `Relevance_1` through `Relevance_5`
  - `Quality_High/Medium/Low`
  - Composite tags (e.g., `rel5_qualHigh_Include`)

## Time Estimates

### Single Reviewer
- Setup: 5 minutes
- Assessment: 5-10 minutes per paper
- 67 papers: 5-11 hours total
- Merge & Import: 10 minutes

### Dual Review Process
- Double the assessment time
- Add 1-2 hours for consensus meeting
- Cohen's Kappa calculation recommended

## Quality Assurance

### Pre-Assessment Checks
1. Verify all papers have titles
2. Check for duplicate entries
3. Ensure abstracts are available

### Post-Assessment Validation
1. Check for missing assessments
2. Verify exclusion reasons provided
3. Review "Unclear" items
4. Calculate inclusion rate

### Inter-Rater Reliability
For dual review:
```python
from sklearn.metrics import cohen_kappa_score
kappa = cohen_kappa_score(reviewer1_decisions, reviewer2_decisions)
# Target: κ > 0.60 (substantial agreement)
```

## Troubleshooting

### Excel Import Issues
- **Problem**: Special characters in titles
- **Solution**: UTF-8 encoding handled automatically

### Matching Failures
- **Problem**: No DOI and title variations
- **Solution**: Check `match_log.csv`, manually update

### Formula Errors
- **Problem**: Zotero_Tags column not calculating
- **Solution**: Formulas auto-added, check Excel version compatibility

## Testing

Run the test workflow:
```bash
python analysis/test_assessment_workflow.py
```

This will:
1. Convert sample RIS to Excel
2. Simulate assessments
3. Merge back to RIS
4. Verify enrichment

## Files Generated

1. **assessment.xlsx**: Excel template for assessment
2. **assessment_completed.xlsx**: Your completed assessments
3. **enriched.ris**: Original + assessment metadata
4. **match_log.csv**: Any matching issues (if applicable)

## Best Practices

1. **Backup Original RIS**: Keep unmodified copy
2. **Version Control**: Date-stamp assessment files
3. **Team Coordination**: Use shared Excel for collaboration
4. **Documentation**: Record assessment criteria modifications
5. **Validation**: Spot-check 10% of assessments

## Future Enhancements

- [ ] Web interface for assessment
- [ ] Direct Zotero API integration
- [ ] Automated quality scoring
- [ ] Multi-language support
- [ ] Real-time collaboration features
- [ ] Integration with citation managers beyond Zotero

## Requirements

### Python Packages
```bash
pip install pandas openpyxl xlsxwriter
```

### System Requirements
- Python 3.8+
- Excel or LibreOffice Calc
- Zotero (for import/export)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review test output: `test_assessment_workflow.py`
3. Examine `match_log.csv` for matching problems

---

*Version: 1.0*
*Last Updated: 2025-09-29*
*Part of: FemPrompt Research Pipeline*