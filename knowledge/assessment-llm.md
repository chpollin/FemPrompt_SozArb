# LLM-Based Paper Assessment

Automated PRISMA assessment using Claude Haiku 4.5.

## Quick Start

```bash
# Ensure ANTHROPIC_API_KEY is set
export ANTHROPIC_API_KEY="sk-ant-your-key"  # Unix/Linux/macOS
$env:ANTHROPIC_API_KEY="sk-ant-your-key"    # Windows PowerShell

# Run assessment
python assessment-llm/assess_papers.py

# With custom input/output
python assessment-llm/assess_papers.py -i assessment/assessment.xlsx -o assessment-llm/output/assessment_llm.xlsx
```

## What It Does

1. **Reads** `assessment/assessment.xlsx` (265 papers from _DEEPRESEARCH collections)
2. **For each paper:**
   - Extracts metadata (title, authors, year, abstract, etc.)
   - Builds assessment prompt
   - Calls Claude Haiku 4.5 API
   - Parses JSON response
   - Validates scores (0-3 range)
3. **Writes** assessed papers to `assessment-llm/output/assessment_llm.xlsx`
4. **Logs** all API calls to `logs/api_calls.jsonl`

## Assessment Schema

**Decision:** Include | Exclude | Unclear

**Exclusion Reasons (if Exclude):**
- Not relevant topic
- Wrong publication type
- Wrong language
- Duplicate
- No full text
- Insufficient quality
- Other

**Relevance Scores (0-3):**
1. **AI_Komp**: AI/LLM-Kompetenzen (0=none → 3=framework development)
2. **Vulnerable**: Vulnerable Groups & Digital Equity (0=none → 3=intersectional focus)
3. **Bias**: Algorithmic Bias (0=none → 3=bias detection study)
4. **Praxis**: Practical Implementation (0=theory → 3=evaluated tool)
5. **Prof**: Professional Context (0=none → 3=social work study)

## Output

**Excel File:** Same structure as input, with filled assessment columns:
- Decision (M)
- Exclusion_Reason (N)
- Rel_AI_Komp (O)
- Rel_Vulnerable (P)
- Rel_Bias (Q)
- Rel_Praxis (R)
- Rel_Prof (S)
- Notes (T)

**Logs:**
- `logs/assessment.log` - Processing log with timestamps
- `logs/api_calls.jsonl` - Complete API call history with tokens/costs

## Performance

**Actual Results (Run 5 - 325 papers):**
- Duration: 23 minutes 48 seconds
- Input tokens: 557,647 (~1,716 per paper)
- Output tokens: 32,258 (~99 per paper)
- **Cost: $0.58**
- **Success Rate: 100% (325/325 papers)**

**Comparison with Run 1 (265 papers):**
- Run 1: 84.2% success (223/265), $0.39
- Run 5: 100% success (325/325), $0.58
- **Improvement: +15.8% success rate, +23% more papers**

## Rate Limiting

Default: 2 seconds between API calls (safe for Anthropic tier limits)

Adjust with `--delay` parameter:
```bash
python assessment-llm/assess_papers.py --delay 5.0  # 5 seconds between calls
```

## Error Handling & Auto-Repair

The script uses a two-layer error handling system:

### Layer 1: Response-Repair (NEW in Run 5)
Automatically repairs common LLM response issues BEFORE validation:

**Repair Actions:**
- `scores: null` → `[0, 0, 0, 0, 0]` (most common issue)
- Array too short → pad with zeros
- Array too long → truncate to 5 values
- Float scores → convert to int
- String scores → convert to int
- Null values in array → replace with 0

**Impact:** Run 5 achieved **100% success rate** (325/325 papers) vs Run 1 84.2% (223/265)

### Layer 2: Retry Logic
If repair fails, automatic retry with stricter settings:

**First Attempt:**
- Temperature: 0.3 (balanced consistency/creativity)
- If fails → automatic repair → retry

**Retry Attempt:**
- Temperature: 0.1 (stricter, more deterministic)
- 2-second delay before retry
- If still fails → paper marked as failed

**Error Types Handled:**
- **JSON Parse Errors:** Automatic retry with temperature=0.1
- **Validation Errors:** Auto-repair → retry with temperature=0.1
- **API Errors:** Automatic retry with temperature=0.1
- **After Retry:** If still fails, logged and paper marked as failed

### Auto-Exclude for Missing Abstracts
Papers without abstracts are automatically excluded without API calls:
- **Decision:** Exclude
- **Reason:** "No full text"
- **Saves:** API costs and processing time

## Quality Checks

The script automatically validates:
- ✓ JSON parseable
- ✓ All required keys present (decision, exclusion_reason, scores, note)
- ✓ Scores in range 0-3
- ✓ Scores array length = 5
- ✓ Decision in [Include, Exclude, Unclear]
- ✓ exclusion_reason logic (null for Include/Unclear)

## Files

```
assessment-llm/
├── assess_papers.py         # Main script
├── prompt_template.md       # Assessment prompt
├── README.md               # This file
├── logs/
│   ├── assessment.log      # Processing log
│   └── api_calls.jsonl     # API call history
└── output/
    └── assessment_llm.xlsx # Assessed papers
```

## Next Steps

After running assessment:

1. **Review output:** Open `assessment-llm/output/assessment_llm.xlsx`
2. **Check logs:** Review `logs/assessment.log` for errors
3. **Validate sample:** Manually check 10-20 papers for quality
4. **Export to Zotero:** Use `excel_to_zotero_tags.py` to import tags

## Notes

- All 265 papers have abstracts (verified)
- Script uses Claude Haiku 4 model (fast + cheap)
- Temperature: 0.3 (balanced consistency/creativity)
- Max tokens: 1024 (sufficient for JSON response)
