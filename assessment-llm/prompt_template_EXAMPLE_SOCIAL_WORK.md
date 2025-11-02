# Paper-Assessment: Social Work Literature Review

Bewerte Paper für Literature Review "AI Tools in Social Work Practice":

## Metadaten
- **Titel**: {title}
- **Autor(en)**: {authors}
- **Jahr**: {year}
- **Typ**: {item_type}
- **DOI**: {doi}
- **Sprache**: {language}
- **Quelle**: {source_tool}

## Abstract
{abstract}

---

## Research Question
How are AI tools being adopted in social work practice, and what are the implications for professional ethics, client privacy, and service quality?

## Decision
**Include**: Direct relevance to AI adoption in social work practice OR ethical/practical implications for social workers
**Exclude**: Not relevant to social work context, wrong publication type, language issues, or insufficient quality
**Unclear**: Abstract incomplete or borderline relevance

## Exclusion-Kategorien (nur bei Exclude)
- **Not relevant topic**: No connection to social work practice or AI tools
- **Wrong publication type**: Not peer-reviewed (Editorial, Commentary, Blog, News)
- **Wrong language**: Outside EN/DE/ES
- **Duplicate**: Same content already captured
- **No full text**: No abstract available
- **Insufficient quality**: Methodological flaws evident in abstract
- **Other**: Specify in Notes

## Relevanz-Scoring (0-3, nur bei Include/Unclear)

**Practice** - Direct practice applications:
- 0: No mention of practice applications
- 1: Theoretical discussion of potential applications
- 2: Case studies or implementation examples
- 3: Empirical evaluation of tools in practice settings

**Ethics** - Ethical considerations:
- 0: No ethical discussion
- 1: Brief mention of ethical concerns
- 2: Dedicated section on ethics with analysis
- 3: Primary focus on ethical frameworks or guidelines

**Privacy** - Data privacy and confidentiality:
- 0: No mention
- 1: General privacy statements
- 2: Analysis of specific privacy challenges
- 3: Privacy frameworks or technical solutions

**Outcomes** - Client/service outcomes:
- 0: No outcome data
- 1: Hypothetical outcome discussion
- 2: Descriptive outcome data
- 3: Empirical outcome evaluation with metrics

**Adoption** - Implementation and adoption barriers/facilitators:
- 0: No discussion
- 1: Brief mention of challenges
- 2: Analysis of barriers/facilitators
- 3: Adoption framework or change management study

## Notes
Rationale in bullet points, max 30 words
- **Include**: Why relevant? Key strengths?
- **Exclude**: Additional info (if "Other" selected)
- **Unclear**: What's missing? Where's the borderline?

## Output Format
RESPOND ONLY with valid JSON. NO explanations, NO additional text.

**REQUIRED FORMAT (exactly like this):**

```json
{{
  "decision": "Include",
  "exclusion_reason": null,
  "scores": [2, 1, 3, 0, 2],
  "note": "Brief rationale here"
}}
```

**CRITICAL requirements for scores array:**
- MUST contain EXACTLY 5 integer values
- EACH value MUST be 0, 1, 2, or 3 (integers, NO floats like 2.5)
- NO null values allowed (use 0 instead of null)
- NO strings allowed (2 not "2")
- Order: [Practice, Ethics, Privacy, Outcomes, Adoption]

**Examples of CORRECT scores:**
- `[2, 1, 3, 0, 2]` ✓
- `[0, 0, 0, 0, 0]` ✓
- `[3, 3, 3, 3, 3]` ✓
- `[1, 2, 1, 1, 0]` ✓

**Examples of WRONG scores (avoid!):**
- `[2, 1, 3]` ✗ (only 3 values)
- `[2, 1, 3, 0, 2, 1]` ✗ (6 values)
- `[2.5, 1, 3, 0, 2]` ✗ (float instead of integer)
- `[2, 1, null, 0, 2]` ✗ (null value)
- `["2", "1", "3", "0", "2"]` ✗ (strings)

**Additional requirements:**
- decision: ONLY "Include", "Exclude", or "Unclear" (exact spelling)
- exclusion_reason: null for Include/Unclear, otherwise category string from list above
- note: Max 30 words, concise rationale
