---
title: "Master MOC - SozArb Literature Research"
type: master-moc
tags: [moc, master, navigation]
generated: 2025-11-10 07:10
---

# Master MOC - SozArb Literature Research

Complete navigation for AI Literacy in Social Work research corpus.

## Research Question

**How can social workers develop AI literacy to serve vulnerable populations ethically and effectively, particularly in addressing bias and discrimination in AI systems?**

---

## Vault Statistics

| Metric | Count | Percentage |
|--------|-------|------------|
| **Total Papers** | 325 | 100% |
| Papers with AI Summaries | 83 | 25.5% |
| | | |
| **PRISMA Decisions** | | |
| ✅ Include | 222 | 68.3% |
| ❌ Exclude | 83 | 25.5% |
| ❓ Unclear | 20 | 6.2% |
| | | |
| **Relevance Categories** | | |
| ⭐⭐⭐ High (≥10) | 95 | 29.2% |
| ⭐⭐ Medium (5-9) | 142 | 43.7% |
| ⭐ Low (<5) | 88 | 27.1% |

---

## Navigation

### By Assessment Decision

- [[MOCs/Papers_Include|📗 Included Papers]] (222)
- [[MOCs/Papers_Exclude|📕 Excluded Papers]] (83)
- [[MOCs/Papers_Unclear|📙 Unclear Papers]] (20)

### By Relevance Dimension

- [[MOCs/Dimension_AI_Literacy|🤖 AI Literacy & Competencies]]
- [[MOCs/Dimension_Vulnerable_Groups|🛡️ Vulnerable Groups & Digital Equity]]
- [[MOCs/Dimension_Bias_Analysis|⚖️ Bias & Discrimination Analysis]]
- [[MOCs/Dimension_Practical_Implementation|🔧 Practical Implementation]]
- [[MOCs/Dimension_Professional_Context|👥 Professional/Social Work Context]]

### By Relevance Level

- [[MOCs/Papers_High_Relevance|⭐⭐⭐ High Relevance Papers]] (95)
- [[MOCs/Papers_Medium_Relevance|⭐⭐ Medium Relevance Papers]] (142)
- [[MOCs/Papers_Low_Relevance|⭐ Low Relevance Papers]] (88)

### Special Collections

- [[MOCs/Papers_with_Summaries|📝 Papers with AI Summaries]] (83)
- [[MOCs/Top_Papers|🏆 Top 20 Papers by Total Relevance]]

---

## Quick Searches

Use these in Obsidian search:

- `tag:#include` - All included papers
- `tag:#high-relevance` - High relevance papers
- `tag:#has-summary` - Papers with AI summaries
- `tag:#dim-bias-high` - Papers with high bias dimension score
- `tag:#dim-vulnerable-high` - Papers focused on vulnerable groups

---

## Dataview Queries

### Top 10 Papers by Total Relevance

\`\`\`dataview
TABLE author_year, title, total_relevance, top_dimensions
FROM "Papers"
WHERE decision = "Include"
SORT total_relevance DESC
LIMIT 10
\`\`\`

### Papers by Dimension Score

\`\`\`dataview
TABLE author_year, rel_bias, rel_vulnerable, total_relevance
FROM "Papers"
WHERE rel_bias >= 2 OR rel_vulnerable >= 2
SORT total_relevance DESC
\`\`\`

---

## Your Research Workspace

- [[Synthesis/Research_Notes|📓 Your Research Notes]]
- [[Synthesis/Key_Insights|💡 Key Insights]]
- [[Synthesis/Research_Questions|❓ Open Questions]]
- [[Synthesis/Literature_Gaps|🔍 Identified Gaps]]

---

*Vault generated: 2025-11-10 07:10*
*Script: `generate_research_vault_with_assessment.py`*
*Total files: 325 papers + MOCs*
