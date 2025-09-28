# Development Journal - FemPrompt Obsidian Vault

## 2025-09-28: Improving Concept Extraction

### Current Issues with Concept Detection

The current implementation uses simple regex patterns which leads to:
- **302 concepts** extracted from 35 papers
- Duplicates like "Generative AI" vs "Generative Ai" (spacing issues)
- Over-generic terms like standalone "Gender", "Bias", "Fairness"
- Missing variations (e.g., "ML" not linked to "Machine Learning")
- No context awareness (extracts fragments from compound terms)

### Improvement Strategy

We're implementing simple but effective improvements without complex NLP:

#### 1. **Normalization & Deduplication**
- Convert to consistent casing
- Strip extra whitespace
- Map common variations to canonical forms
- Example: "GPT-3", "gpt3", "GPT 3" → "GPT-3"

#### 2. **Synonym Mapping**
- Create mappings for common abbreviations
- Link related terms
- Example: "ML" → "Machine Learning", "LLMs" → "Large Language Models"

#### 3. **Minimum Context Requirements**
- Skip overly generic single words
- Require minimum character length (e.g., 3+ chars)
- Blacklist common but unhelpful terms

#### 4. **Compound Term Preservation**
- Detect and preserve multi-word concepts
- Avoid fragmenting "gender bias" into "gender" + "bias"
- Priority for longer, more specific matches

#### 5. **Frequency Thresholds**
- Track concept frequency across papers
- Only create notes for concepts appearing 2+ times
- Separate high-frequency (10+ mentions) from rare concepts

### Implementation Plan

1. **Add normalization function** to clean extracted concepts
2. **Create synonym dictionary** for common AI/bias terms
3. **Add blacklist** for overly generic terms
4. **Improve regex patterns** to capture full phrases
5. **Add frequency analysis** before creating concept notes

### Expected Improvements

- Reduce from ~300 to ~150-200 meaningful concepts
- No more duplicates
- Better concept relationships
- More useful for research navigation

## 2025-09-28: Test Results

### Improvements Achieved ✅

**Before:** 302 concepts (all included)
**After:** 126 concepts created + 46 skipped = 172 unique concepts found

#### Key Improvements:

1. **Reduced noise by 58%** (302 → 126 meaningful concepts)
2. **Frequency filtering works** - 46 rare concepts (mentioned only once) were skipped
3. **Deduplication successful** - No more "Generative AI" vs "Generative Ai"
4. **Better normalization** - Consistent naming across concepts

#### Top Concepts by Frequency:
- Large Language Models (118 mentions)
- AI Systems (107 mentions)
- Artificial Intelligence (68 mentions)
- Discrimination (51 mentions)
- Intersectional Bias (38 mentions)

#### Frequency Distribution:
- High frequency (10+ mentions): 26 concepts
- Medium (5-9): 16 concepts
- Low (2-4): 50 concepts
- Rare (1, skipped): 46 concepts

### Still Needs Work:

1. **Fragment issue**: "Of Intersectionality" (30 mentions) - probably extracted from "analysis of intersectionality"
2. **Over-specific intersectional variants**: Could merge "Intersectional Analysis", "Intersectional Approach", "Intersectional Feminist", etc.
3. **Consider threshold adjustment**: Maybe frequency >= 3 instead of >= 2

---

## 2025-09-28: Final Status and Cleanup

### Current State

We now have **three vault generation scripts**:
1. `generate_obsidian_vault.py` - Original with 302 concepts + 89 authors
2. `generate_obsidian_vault_v2.py` - Failed attempt at limiting concepts
3. `generate_obsidian_vault_improved.py` - **FINAL VERSION** with smart filtering

### Active Vaults
- `FemPrompt_Vault/` - Original vault (can be deleted)
- `FemPrompt_Vault_Improved/` - **CURRENT BEST** with 126 concepts

### Recommendation
**Use `generate_obsidian_vault_improved.py` going forward:**
- Best concept extraction (126 meaningful concepts)
- Deduplication and normalization
- Frequency-based filtering
- No author clutter

### Files to Keep/Delete

**KEEP:**
- `analysis/generate_obsidian_vault_improved.py` ✅ (Best version)
- `JOURNAL.md` ✅ (Documentation)
- `FemPrompt_Vault_Improved/` ✅ (Best vault)

**DELETE:**
- `analysis/generate_obsidian_vault.py` ❌ (Obsolete, creates too many concepts)
- `analysis/generate_obsidian_vault_v2.py` ❌ (Failed experiment)
- `FemPrompt_Vault/` ❌ (Old vault with 302 concepts)

### Next Steps
1. Delete obsolete scripts and vaults
2. Rename improved script to main version
3. Update README to reference the improved vault
4. Consider future improvements (fragment fixes, better intersectional grouping)

---

## Previous Sessions

### Initial Vault Creation
- Created script `generate_obsidian_vault.py`
- Extracted 302 concepts, 89 authors, 33 papers
- Full cross-linking implementation

### Streamlining Attempt
- Tried limiting to "top 50" concepts (arbitrary)
- Removed author files per user request
- Realized frequency != importance

### Current Status
- Using original script without author generation
- All 302 concepts preserved
- Ready for improvement phase