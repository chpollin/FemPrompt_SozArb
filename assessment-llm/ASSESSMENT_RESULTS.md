# LLM Assessment Results - PRISMA Screening

**Date:** 2025-11-02
**Model:** Claude Haiku 4.5
**Papers Processed:** 265 (_DEEPRESEARCH collections only)

## Overview

Automated PRISMA screening using Claude Haiku 4.5 to assess 265 papers from the literature corpus. Papers were sourced from Deep Research AI agents (Claude, Gemini, ChatGPT, Perplexity).

## Results Summary

| Metric | Value |
|--------|-------|
| **Total Papers** | 265 |
| **Successfully Assessed** | 223 (84.2%) |
| **Failed Assessments** | 42 (15.8%) |
| **Input Tokens** | 348,085 |
| **Output Tokens** | 27,016 |
| **Total Cost** | $0.39 |
| **Processing Time** | ~17 minutes |
| **Average Time per Paper** | ~3.8 seconds |

## Assessment Schema

### Decision Categories
- **Include**: AI/LLM relevance AND (Bias OR Vulnerable Groups OR Professional Social Context)
- **Exclude**: Fails at least one inclusion criterion
- **Unclear**: Insufficient abstract or borderline case

### Relevance Dimensions (0-3 Scale)

1. **Rel_AI_Komp** - AI/LLM Competencies
   - 0: No mention
   - 1: Peripheral mention
   - 2: Dedicated chapter/data
   - 3: Core focus, framework development

2. **Rel_Vulnerable** - Vulnerable Groups & Digital Equity
   - 0: No mention
   - 1: Generic inclusion statements
   - 2: Specific barrier analysis
   - 3: Primary focus on marginalized populations

3. **Rel_Bias** - Algorithmic Bias
   - 0: No mention
   - 1: Single mention as limitation
   - 2: Discussion of specific bias types
   - 3: Bias detection/mitigation methods

4. **Rel_Praxis** - Practical Implementation
   - 0: Purely theoretical
   - 1: Abstract recommendations
   - 2: Concrete methods/tools
   - 3: Empirically evaluated intervention

5. **Rel_Prof** - Professional Context (Social Work)
   - 0: Technical/general education focus
   - 1: Potential relevance for practitioners
   - 2: Explicit care-work/counseling context
   - 3: Primary focus on social work

## Failed Papers

**Count:** 42 papers (15.8%)

**Failure Reason:** JSON validation errors - LLM returned malformed score arrays

**Failed Paper IDs:**
16, 21, 22, 28, 38, 40, 53, 55, 70, 73, 74, 77, 91, 111, 116, 118, 134, 135, 136, 138, 145, 148, 150, 155, 158, 159, 161, 177, 185, 194, 197, 199, 202, 205, 209, 232, 233, 235, 243, 260, 262, 263

**Recommendation:** Manual assessment required for failed papers

## Output Files

- **Excel:** `assessment-llm/output/assessment_llm.xlsx`
- **API Log:** `assessment-llm/logs/api_calls.jsonl`
- **Processing Log:** `assessment-llm/logs/assessment.log`

## Quality Validation

### Automated Checks Performed
- ✓ JSON parseable
- ✓ All required keys present (decision, exclusion_reason, scores, note)
- ✓ Scores in range 0-3
- ✓ Scores array length = 5
- ✓ Decision in [Include, Exclude, Unclear]
- ✓ exclusion_reason logic (null for Include/Unclear)

### Success Rate by Validation Check
- **JSON Parse Success:** 223/265 (84.2%)
- **Schema Validation:** 223/223 (100% of parsed responses)
- **Score Range Validation:** 223/223 (100%)

## Next Steps

1. **Manual Review:** Assess 42 failed papers manually or refine prompt
2. **Sample Validation:** Manually verify 10-20 LLM assessments for quality
3. **Zotero Export:** Use `excel_to_zotero_tags.py` to import assessment tags
4. **Pipeline Integration:** Filter downstream processing to only "Include" papers

## Cost Analysis

**Per-Paper Cost:** $0.39 / 265 = $0.00147 per paper

**Token Efficiency:**
- Average input tokens: 348,085 / 265 = 1,313 tokens/paper
- Average output tokens: 27,016 / 265 = 102 tokens/paper

**Pricing (Claude Haiku 4.5):**
- Input: $0.80/1M tokens
- Output: $4.00/1M tokens

## Technical Notes

- **Model:** `claude-haiku-4-5`
- **Temperature:** 0.3 (balanced consistency/creativity)
- **Max Tokens:** 1024 (sufficient for JSON response)
- **Rate Limiting:** 2-second delay between API calls
- **Retry Logic:** Anthropic SDK default exponential backoff
- **Validation:** Strict schema validation with detailed error logging

## Comparison to Manual Assessment

**Estimated Manual Effort:** 265 papers × 2 minutes/paper = 530 minutes (8.8 hours)

**Automated Performance:**
- **Time Saved:** ~8.5 hours
- **Cost:** $0.39
- **Consistency:** Uniform criteria application
- **Reproducibility:** Full API call logs for audit

**Trade-offs:**
- 15.8% failure rate requires manual intervention
- LLM may miss nuanced context available to human reviewers
- No ability to access full text (abstract-only assessment)
