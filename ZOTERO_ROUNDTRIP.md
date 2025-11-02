# Complete PRISMA Assessment Workflow - LLM Automation

## Overview

This document describes the complete workflow for PRISMA 2020-compliant literature screening using automated LLM assessment with Claude Haiku 4.5.

**Status:** ✅ **Completed** - 265 papers assessed (223 successful, 42 failed)
**Date:** 2025-11-02
**Cost:** $0.39
**Duration:** ~17 minutes

## Workflow Architecture

```
Zotero Group Library (326 papers)
         ↓
[FILTER: _DEEPRESEARCH collections]
         ↓
Filtered papers (265 papers)
         ↓
Export to Excel (zotero_to_excel.py)
         ↓
assessment/assessment.xlsx (empty assessment columns)
         ↓
LLM Assessment (assess_papers.py)
         ↓
assessment-llm/output/assessment_llm.xlsx (84.2% completed)
         ↓
Manual review of 42 failed papers
         ↓
Fully completed Excel file
         ↓
Export to Zotero (excel_to_zotero_tags.py) [OPTIONAL]
         ↓
Zotero library with assessment tags
```

## Step-by-Step Execution

### Step 1: Export Zotero to Excel

**Purpose:** Create Excel template with all papers from _DEEPRESEARCH collections

```bash
python assessment/zotero_to_excel.py \
  --library-id 6080294 \
  --library-type group \
  --api-key YOUR_ZOTERO_KEY \
  --output assessment/assessment.xlsx
```

**Output:**
- `assessment/assessment.xlsx` (265 rows, columns A-V)
- Columns A-L: Metadata (read-only)
- Columns M-T: Assessment fields (empty, ready for completion)
- Columns U-V: Auto-generated formulas

**Key Features:**
- Filters to ONLY _DEEPRESEARCH collections (excludes "Manual" entries)
- Extracts Source_Tool from collection names (Claude/Gemini/ChatGPT/Perplexity)
- Normalizes Publication_Year (extracts 4-digit year)
- Normalizes Language (eng→en, ger→de)
- Creates dropdowns for all assessment fields
- Adds data validation and conditional formatting

### Step 2: Automated LLM Assessment

**Purpose:** Use Claude Haiku 4.5 to assess all 265 papers automatically

```bash
# Set Anthropic API key
export ANTHROPIC_API_KEY="sk-ant-your-key"              # Unix/Linux/macOS
$env:ANTHROPIC_API_KEY="sk-ant-your-key"                # Windows PowerShell

# Run assessment
python assessment-llm/assess_papers.py \
  --input assessment/assessment.xlsx \
  --output assessment-llm/output/assessment_llm.xlsx \
  --delay 2.0
```

**Parameters:**
- `--input`: Source Excel file (default: `assessment/assessment.xlsx`)
- `--output`: Output Excel file (default: `assessment-llm/output/assessment_llm.xlsx`)
- `--delay`: Seconds between API calls (default: 2.0)

**Process:**
1. Reads Excel file row by row
2. For each paper:
   - Builds assessment prompt from metadata + abstract
   - Calls Claude Haiku 4.5 API
   - Parses JSON response
   - Validates score ranges and structure
   - Writes results back to DataFrame
   - Logs API call to JSONL
3. Saves completed Excel file
4. Generates summary report

**Output:**
- `assessment-llm/output/assessment_llm.xlsx` - Assessed papers (84.2% complete)
- `assessment-llm/logs/assessment.log` - Processing log with timestamps
- `assessment-llm/logs/api_calls.jsonl` - Complete API call history

**Results:**
- ✅ Successfully assessed: 223/265 (84.2%)
- ❌ Failed assessments: 42/265 (15.8%)
- 💰 Cost: $0.39 (348,085 input + 27,016 output tokens)
- ⏱️ Duration: ~17 minutes (~3.8 seconds per paper)

### Step 3: Review Results

**Check processing log:**
```bash
# View final report
tail -30 assessment-llm/logs/assessment.log

# Check for errors
grep ERROR assessment-llm/logs/assessment.log
```

**Open Excel file:**
- File: `assessment-llm/output/assessment_llm.xlsx`
- Filter to empty Decision column to find failed papers (42 papers)
- Review sample of successful assessments (recommend 10-20 papers)

**Failed paper IDs:**
16, 21, 22, 28, 38, 40, 53, 55, 70, 73, 74, 77, 91, 111, 116, 118, 134, 135, 136, 138, 145, 148, 150, 155, 158, 159, 161, 177, 185, 194, 197, 199, 202, 205, 209, 232, 233, 235, 243, 260, 262, 263

**Common failure reason:** JSON validation error - LLM returned malformed score arrays

### Step 4: Manual Review of Failed Papers

**Option A: Complete in Excel**
1. Open `assessment-llm/output/assessment_llm.xlsx`
2. Filter: `Decision` column = (Blanks)
3. For each failed paper:
   - Read abstract
   - Select Decision dropdown
   - Select Exclusion_Reason (if Exclude)
   - Rate 5 relevance dimensions (0-3)
   - Add brief note

**Option B: Re-run with adjusted prompt**
- Edit `assessment-llm/prompt_template.md` to clarify scoring instructions
- Re-run only failed papers:
```bash
# TODO: Implement --retry-failed option
python assessment-llm/assess_papers.py \
  --input assessment-llm/output/assessment_llm.xlsx \
  --retry-failed \
  --delay 5.0
```

**Estimated time:** ~90 minutes for 42 papers (manual)

### Step 5: Quality Validation (Recommended)

**Sample validation:**
```python
import pandas as pd
import random

df = pd.read_excel('assessment-llm/output/assessment_llm.xlsx')

# Stratified sample (5 Include + 5 Exclude + 5 Unclear)
includes = df[df['Decision'] == 'Include'].sample(5)
excludes = df[df['Decision'] == 'Exclude'].sample(5)
unclear = df[df['Decision'] == 'Unclear'].sample(5)

sample = pd.concat([includes, excludes, unclear])
print(sample[['Zotero_Key', 'Title', 'Decision', 'Notes']])
```

**Manually review sample:**
- Check if Decision matches abstract content
- Verify score ranges make sense
- Ensure Notes provide clear rationale
- Calculate accuracy: (correct / 15) × 100%

**Target accuracy:** >90%

### Step 6: Export to Zotero (Optional)

**Purpose:** Import assessment results back to Zotero as tags

```bash
python assessment/excel_to_zotero_tags.py \
  --input assessment-llm/output/assessment_llm.xlsx \
  --library-id 6080294 \
  --library-type group \
  --api-key YOUR_ZOTERO_KEY
```

**Result:** Each paper in Zotero gets tags:
- `PRISMA_Include` or `PRISMA_Exclude` or `PRISMA_Unclear`
- `AI_Komp_2` (score value)
- `Vulnerable_1` (score value)
- `Bias_3` (score value)
- `Praxis_0` (score value)
- `Prof_2` (score value)

**Note:** The `excel_to_zotero_tags.py` script needs to be updated to handle 5 separate dimension columns (currently expects single Relevance_Score).

## Excel Column Structure

| Column | Name | Type | Description |
|--------|------|------|-------------|
| A | Zotero_Key | Text | Unique Zotero identifier |
| B | Title | Text | Paper title |
| C | Author_Year | Text | First author and year |
| D | Publication_Year | Text | Normalized year (YYYY) |
| E | Item_Type | Text | Document type (journalArticle, etc.) |
| F | Publication_Title | Text | Journal/venue name |
| G | DOI | Text | Digital Object Identifier |
| H | URL | Text | Access URL |
| I | Abstract | Text | Abstract text (all 265 papers have this) |
| J | Language | Text | Language code (en/de) |
| K | Date_Added | Text | Zotero import date |
| L | Source_Tool | Text | Deep Research AI (Claude/Gemini/ChatGPT/Perplexity) |
| **M** | **Decision** | **Dropdown** | **Include/Exclude/Unclear** |
| **N** | **Exclusion_Reason** | **Dropdown** | **7 categories (null for Include/Unclear)** |
| **O** | **Rel_AI_Komp** | **Dropdown** | **AI competencies (0-3)** |
| **P** | **Rel_Vulnerable** | **Dropdown** | **Vulnerable groups (0-3)** |
| **Q** | **Rel_Bias** | **Dropdown** | **Algorithmic bias (0-3)** |
| **R** | **Rel_Praxis** | **Dropdown** | **Practical implementation (0-3)** |
| **S** | **Rel_Prof** | **Dropdown** | **Professional context (0-3)** |
| **T** | **Notes** | **Text** | **Assessment rationale (max 30 words)** |
| U | Auto_Flags | Formula | Data quality warnings |
| V | Zotero_Tags | Formula | Tag string for export |

## Assessment Schema

### Decision Criteria

**Include:** Paper meets ALL criteria:
- ✅ AI/LLM relevance AND
- ✅ (Bias OR Vulnerable Groups OR Professional Social Context) AND
- ✅ Peer-reviewed publication AND
- ✅ Language DE/EN

**Exclude:** Paper fails at least one criterion

**Unclear:** Abstract insufficient or borderline case

### Exclusion Reasons (7 Categories)

Only applicable when Decision = "Exclude"

1. **Not relevant topic**: No AI/LLM or social-ethical dimension
2. **Wrong publication type**: Not peer-reviewed (editorial, blog, news)
3. **Wrong language**: Outside DE/EN
4. **Duplicate**: Identical content (same DOI or title+author)
5. **No full text**: Access technically impossible
6. **Insufficient quality**: Methodological issues in abstract
7. **Other**: Specify in Notes

### Relevance Dimensions (0-3 Scale)

Each dimension scored independently:

**0 = No mention**
**1 = Peripheral/tangential**
**2 = Substantial treatment**
**3 = Core focus**

#### 1. Rel_AI_Komp (AI/LLM Competencies)
- **0**: No mention of AI literacy or competencies
- **1**: Peripheral mention without elaboration
- **2**: Dedicated section, empirical data, or framework component
- **3**: Primary focus on competency development, own framework

**Examples:**
- Score 1: "AI literacy mentioned in introduction"
- Score 2: "Evaluation of AI literacy course with pre/post data"
- Score 3: Kong (2021) "AI literacy framework development"

#### 2. Rel_Vulnerable (Vulnerable Groups & Digital Equity)
- **0**: No mention of marginalized populations
- **1**: Generic inclusion statements without specifics
- **2**: Analysis of specific barriers or empirical inequality data
- **3**: Primary focus on marginalized populations or intersectional methodology

**Examples:**
- Score 1: "Technology should be accessible to all"
- Score 2: "Digital health divide analysis with empirical data"
- Score 3: Arias López (2023) "Digital literacy as health determinant"

#### 3. Rel_Bias (Algorithmic Bias & Fairness)
- **0**: No mention of bias or fairness
- **1**: Single mention as limitation without depth
- **2**: Discussion of specific bias types with examples/measurements
- **3**: Bias detection method development or empirical bias study

**Examples:**
- Score 1: "AI systems may contain bias (disclaimer)"
- Score 2: "Gender bias analysis in LLM outputs"
- Score 3: "Novel bias mitigation approach with evaluation"

#### 4. Rel_Praxis (Practical Implementation)
- **0**: Purely theoretical treatment
- **1**: Abstract recommendations without operationalization
- **2**: Concrete methods, tools, or guidelines (not evaluated)
- **3**: Empirically evaluated intervention or validated tool

**Examples:**
- Score 1: "Organizations should implement AI training"
- Score 2: "Step-by-step implementation guideline"
- Score 3: "Training intervention with pre/post assessment"

#### 5. Rel_Prof (Professional Context - Social Work)
- **0**: Technical or general education focus (K-12, general public)
- **1**: Potential relevance for practitioners suggested
- **2**: Explicit care-work, counseling, or related field reference
- **3**: Primary focus on social work or empirical study with professionals

**Examples:**
- Score 1: "Digital health literacy" (transferable methods, no direct SW context)
- Score 2: "AI ethics in counseling contexts"
- Score 3: "AI literacy for social workers: empirical study"

### Notes Field

**Purpose:** Brief rationale for decision (max 30 words)

**For Include:**
- Why relevant?
- Key strengths?
- Example: "Systematische Review zu Ethik von Technologie in Sozialer Arbeit. Starker Prof-Fokus, adressiert digitale Ungleichheit und vulnerable Gruppen."

**For Exclude:**
- Additional info if "Other" selected
- Example: "Rein technische ML-Studie ohne sozialen Kontext"

**For Unclear:**
- What's missing?
- Where's the borderline?
- Example: "Abstract unvollständig, unklar ob empirische Studie oder Konzeptpaper"

## LLM Configuration

### Model Settings

```python
model = "claude-haiku-4-5"
max_tokens = 1024
temperature = 0.3
```

**Rationale:**
- **Claude Haiku 4.5**: Fast, cost-effective, high-quality reasoning
- **1024 tokens**: Sufficient for structured JSON response
- **Temperature 0.3**: Balanced consistency (strict criteria) + creativity (nuanced scoring)

### Prompt Template

Located in: [assessment-llm/prompt_template.md](assessment-llm/prompt_template.md)

**Structure:**
1. Task description (PRISMA assessment for "AI in Sozialer Arbeit")
2. Paper metadata (title, authors, year, DOI, abstract, etc.)
3. Decision criteria with examples
4. Exclusion categories with definitions
5. Relevance dimension rubrics with scoring examples
6. Notes guidelines
7. JSON output format specification

**Key instruction:** "Antworte NUR mit validem JSON, keine zusätzlichen Erklärungen"

### Response Validation

Automated checks in `assess_papers.py`:

```python
def _validate_response(self, result: Dict):
    # Check required keys
    required_keys = ['decision', 'exclusion_reason', 'scores', 'note']

    # Validate scores array
    assert isinstance(result['scores'], list)
    assert len(result['scores']) == 5

    # Validate score ranges
    for score in result['scores']:
        assert 0 <= score <= 3

    # Validate decision value
    assert result['decision'] in ['Include', 'Exclude', 'Unclear']

    # Validate exclusion_reason logic
    if result['decision'] in ['Include', 'Unclear']:
        assert result['exclusion_reason'] is None

    if result['decision'] == 'Exclude':
        # Warning if null, but not fatal error
        if result['exclusion_reason'] is None:
            logger.warning("exclusion_reason is null for Exclude")
```

## Performance Metrics

### Processing Statistics

| Metric | Value |
|--------|-------|
| Total papers | 265 |
| Successfully assessed | 223 (84.2%) |
| Failed assessments | 42 (15.8%) |
| Processing time | ~17 minutes |
| Avg time per paper | ~3.8 seconds |

### API Usage

| Metric | Value |
|--------|-------|
| Input tokens | 348,085 |
| Output tokens | 27,016 |
| Avg input/paper | 1,313 tokens |
| Avg output/paper | 102 tokens |

### Cost Analysis

**Claude Haiku 4.5 Pricing:**
- Input: $0.80 per 1M tokens
- Output: $4.00 per 1M tokens

**Total Cost:**
- Input cost: (348,085 / 1,000,000) × $0.80 = $0.28
- Output cost: (27,016 / 1,000,000) × $4.00 = $0.11
- **Total: $0.39**

**Per-Paper Cost:** $0.39 / 265 = $0.00147 per paper

## Comparison to Alternatives

### Manual Assessment

**Estimated effort:** 265 papers × 2 min/paper = 530 minutes (8.8 hours)

**Pros:**
- 100% success rate (expert judgment)
- Can access full text (not just abstract)
- Nuanced understanding of context

**Cons:**
- Time-intensive (8.8 hours vs 17 minutes)
- Potential fatigue errors
- Inter-rater variability if multiple reviewers

### LLM Assessment (Implemented)

**Actual effort:** 17 minutes processing + ~90 minutes manual review = ~2 hours total

**Pros:**
- 97% time savings (2 hours vs 8.8 hours)
- Consistent criteria application
- Complete audit trail (API logs)
- Very low cost ($0.39)

**Cons:**
- 15.8% failure rate requires manual intervention
- Abstract-only (no full text access)
- May miss nuanced context

### Hybrid Approach (Recommended)

**Process:**
1. Run LLM assessment (17 minutes, $0.39)
2. Manual review of 42 failed papers (~90 minutes)
3. Sample validation of 20 successful assessments (~30 minutes)

**Total effort:** ~2.5 hours (72% time savings vs pure manual)

**Quality:** Best of both worlds (AI efficiency + human validation)

## Troubleshooting

### High Failure Rate (>20%)

**Symptoms:** More than 53 papers failed (20% of 265)

**Possible causes:**
1. Poor abstract quality (missing, truncated, non-English without translation)
2. Prompt ambiguity causing LLM confusion
3. API issues (rate limiting, timeouts)

**Solutions:**
1. Check abstract completeness in source Excel
2. Refine prompt template for clarity
3. Increase delay between calls (--delay 5.0)
4. Lower temperature (0.3 → 0.1) for stricter JSON compliance

### JSON Parse Errors

**Symptoms:** "Failed to parse JSON" errors in log

**Cause:** LLM returns explanatory text before/after JSON

**Current handling:** Code strips markdown code blocks (```json...```)

**Solutions:**
1. Reinforce prompt: "NUR JSON" → "Antworte AUSSCHLIESSLICH mit JSON. KEINE Erklärungen."
2. Add more robust JSON extraction (regex for {..."decision"...})
3. Increase max_tokens if response truncated mid-JSON

### Score Validation Errors

**Symptoms:** "scores must be list of 5 integers"

**Causes:**
- LLM returns fewer than 5 scores
- LLM returns scores as floats (2.5) instead of integers
- LLM returns scores outside 0-3 range

**Solutions:**
1. Add examples to prompt showing correct format: [2, 1, 3, 0, 2]
2. Clarify: "Each score must be EXACTLY 0, 1, 2, or 3 (integers only)"
3. Implement automatic rounding (2.5 → 3) in validation

### API Rate Limiting

**Symptoms:** HTTP 429 errors, "Rate limit exceeded"

**Solutions:**
1. Increase delay: --delay 5.0 (default: 2.0)
2. Check Anthropic tier limits at console.anthropic.com
3. Implement exponential backoff (already in Anthropic SDK)

## File Reference

```
assessment/
├── zotero_to_excel.py              # Zotero → Excel export
├── excel_to_zotero_tags.py         # Excel → Zotero import (needs update)
├── assessment.xlsx                 # Manual assessment template
└── README.md                       # Assessment workflow docs

assessment-llm/
├── assess_papers.py                # LLM automation script ⭐
├── prompt_template.md              # Assessment prompt ⭐
├── README.md                       # LLM workflow docs
├── ASSESSMENT_RESULTS.md           # Results summary ⭐
├── logs/
│   ├── assessment.log             # Processing log with timestamps
│   └── api_calls.jsonl            # API call history (348K tokens)
└── output/
    └── assessment_llm.xlsx        # LLM-assessed papers (84.2% complete) ⭐
```

## Next Steps

### Immediate (Required)

1. **Complete Failed Papers** (~90 minutes)
   - Manually assess 42 failed papers
   - Fill Decision, Exclusion_Reason, 5 dimensions, Notes

2. **Quality Validation** (~30 minutes)
   - Sample 20 LLM assessments stratified by decision type
   - Calculate accuracy vs expert judgment
   - Document findings

### Short-term (Recommended)

3. **Update Excel→Zotero Export** (~1 hour)
   - Modify `excel_to_zotero_tags.py` to handle 5 dimension columns
   - Test tag import to Zotero
   - Verify tags appear correctly

4. **Generate PRISMA Flow Diagram**
   - Count by Decision: Include/Exclude/Unclear
   - Create standard PRISMA 2020 flowchart
   - Document in paper/thesis

### Long-term (Optional)

5. **Improve LLM Success Rate**
   - Refine prompt based on failure patterns
   - Test with temperature variations
   - Consider GPT-4 for difficult cases

6. **Inter-Rater Reliability Study**
   - Dual assessment for 50 papers (human + LLM)
   - Calculate Cohen's Kappa for Decision
   - Calculate ICC for 5 dimensions

7. **Integration with Main Pipeline**
   - Filter getPDF_intelligent.py by Decision == "Include"
   - Only process included papers in summarization
   - Add PRISMA metadata to vault generation

## References

- [PRISMA 2020 Statement](http://www.prisma-statement.org/)
- [Claude API Documentation](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [Zotero API v3 Documentation](https://www.zotero.org/support/dev/web_api/v3/start)
- [assess_papers.py](assessment-llm/assess_papers.py) - Main implementation
- [prompt_template.md](assessment-llm/prompt_template.md) - LLM prompt
- [ASSESSMENT_RESULTS.md](assessment-llm/ASSESSMENT_RESULTS.md) - Detailed results

---

**Document Version:** 1.0
**Last Updated:** 2025-11-02
**Status:** ✅ Assessment Complete (84.2%), Manual Review Pending (15.8%)
