#!/usr/bin/env python3
"""
Literature Research Vault Generator
Generates Obsidian vault with full assessment integration
"""

import os
import sys
import json
import re
import shutil
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional
from datetime import datetime
from collections import defaultdict, Counter
import pandas as pd

# Fix encoding for Windows console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

class ResearchVaultGenerator:
    def __init__(self, base_path: str = None, vault_name: str = "SozArb_Research_Vault"):
        if base_path is None:
            self.base_path = Path(__file__).parent.parent
        else:
            self.base_path = Path(base_path)

        self.vault_path = self.base_path / vault_name

        # Data sources
        self.assessment_file = self.base_path / "assessment-llm" / "output" / "assessment_socialai_llm.xlsx"
        self.zotero_file = self.base_path / "analysis" / "zotero_vereinfacht.json"
        self.summaries_path = self.base_path / "analysis" / "summaries_sozarb"

        # Output paths
        self.papers_path = self.vault_path / "Papers"
        self.mocs_path = self.vault_path / "MOCs"
        self.concepts_path = self.vault_path / "Concepts"
        self.synthesis_path = self.vault_path / "Synthesis"

        # Data storage
        self.papers_data = []
        self.statistics = {
            'total_papers': 0,
            'include': 0,
            'exclude': 0,
            'unclear': 0,
            'with_summaries': 0,
            'high_relevance': 0,
            'medium_relevance': 0,
            'low_relevance': 0,
        }

    def load_data(self):
        """Load and merge all data sources"""
        print("\n📚 Loading data sources...")

        # Load assessment data
        print(f"  Loading assessment: {self.assessment_file}")
        assessment_df = pd.read_excel(self.assessment_file)
        print(f"  ✓ Loaded {len(assessment_df)} papers from assessment")

        # Load Zotero data
        print(f"  Loading Zotero: {self.zotero_file}")
        with open(self.zotero_file, 'r', encoding='utf-8') as f:
            zotero_data = json.load(f)
        zotero_dict = {item['key']: item for item in zotero_data}
        print(f"  ✓ Loaded {len(zotero_dict)} items from Zotero")

        # Check for summaries
        summary_files = {}
        if self.summaries_path.exists():
            for file in self.summaries_path.glob("summary_*.md"):
                # Extract key from filename (e.g., "summary_Alvarez_2024_Policy.md" -> identifier)
                summary_files[file.stem] = file
            print(f"  ✓ Found {len(summary_files)} AI summaries")

        # Merge data
        print("\n🔗 Merging data sources...")
        for _, row in assessment_df.iterrows():
            paper = self._merge_paper_data(row, zotero_dict, summary_files)
            if paper:
                self.papers_data.append(paper)

        print(f"  ✓ Merged data for {len(self.papers_data)} papers")

        # Calculate statistics
        self._calculate_statistics()

    def _merge_paper_data(self, assessment_row, zotero_dict, summary_files) -> Optional[Dict]:
        """Merge data from assessment, Zotero, and summaries"""
        zotero_key = assessment_row.get('Zotero_Key', '')

        # Get Zotero data
        zotero_item = zotero_dict.get(zotero_key, {})

        # Extract authors
        authors = []
        if 'creators' in zotero_item:
            for creator in zotero_item['creators']:
                if creator.get('creatorType') == 'author':
                    first = creator.get('firstName', '')
                    last = creator.get('lastName', '')
                    full_name = f"{first} {last}".strip()
                    if full_name:
                        authors.append(full_name)

        # Calculate total relevance
        rel_scores = {
            'ai_komp': assessment_row.get('Rel_AI_Komp', 0) or 0,
            'vulnerable': assessment_row.get('Rel_Vulnerable', 0) or 0,
            'bias': assessment_row.get('Rel_Bias', 0) or 0,
            'praxis': assessment_row.get('Rel_Praxis', 0) or 0,
            'prof': assessment_row.get('Rel_Prof', 0) or 0,
        }
        total_relevance = sum(rel_scores.values())

        # Determine relevance category
        if total_relevance >= 10:
            relevance_category = 'high'
        elif total_relevance >= 5:
            relevance_category = 'medium'
        else:
            relevance_category = 'low'

        # Get top dimensions
        dim_names = {
            'ai_komp': 'AI Literacy',
            'vulnerable': 'Vulnerable Groups',
            'bias': 'Bias Analysis',
            'praxis': 'Practical Implementation',
            'prof': 'Professional Context'
        }
        sorted_dims = sorted(rel_scores.items(), key=lambda x: x[1], reverse=True)
        top_dimensions = [dim_names[k] for k, v in sorted_dims[:2] if v > 0]

        # Check for summary
        author_year = assessment_row.get('Author_Year', '').replace(' ', '_').replace('(', '').replace(')', '')
        title_words = assessment_row.get('Title', '')[:50].replace(' ', '_').replace('/', '_').replace(':', '_')

        # Try to find matching summary
        has_summary = False
        summary_file = None
        for summary_key in summary_files.keys():
            if author_year.lower() in summary_key.lower():
                has_summary = True
                summary_file = summary_files[summary_key].name
                break

        # Generate tags
        tags = ['paper']
        decision = assessment_row.get('Decision', 'Unclear')
        tags.append(decision.lower())
        tags.append(f"{relevance_category}-relevance")

        # Add dimension tags
        for dim, score in rel_scores.items():
            if score >= 2:
                level = 'high' if score == 3 else 'medium'
                tags.append(f"dim-{dim.replace('_', '-')}-{level}")

        if has_summary:
            tags.append('has-summary')

        # Build paper data
        paper = {
            # Identification
            'zotero_key': zotero_key,
            'author_year': assessment_row.get('Author_Year', 'Unknown'),
            'title': assessment_row.get('Title', 'Untitled'),
            'authors': authors,

            # Publication info
            'publication_year': assessment_row.get('Publication_Year', ''),
            'item_type': assessment_row.get('Item_Type', ''),
            'language': assessment_row.get('Language', ''),
            'doi': assessment_row.get('DOI', ''),
            'url': assessment_row.get('URL', ''),
            'abstract': zotero_item.get('abstractNote', assessment_row.get('Abstract', '')),

            # Assessment
            'decision': decision,
            'exclusion_reason': assessment_row.get('Exclusion_Reason', ''),

            # Relevance scores
            'rel_ai_komp': rel_scores['ai_komp'],
            'rel_vulnerable': rel_scores['vulnerable'],
            'rel_bias': rel_scores['bias'],
            'rel_praxis': rel_scores['praxis'],
            'rel_prof': rel_scores['prof'],
            'total_relevance': total_relevance,
            'relevance_category': relevance_category,
            'top_dimensions': top_dimensions,

            # Tags
            'tags': tags,

            # Summary
            'has_summary': has_summary,
            'summary_file': summary_file,

            # Metadata
            'source_tool': assessment_row.get('Source_Tool', ''),
            'date_added': datetime.now().strftime('%Y-%m-%d'),
        }

        return paper

    def _calculate_statistics(self):
        """Calculate vault statistics"""
        for paper in self.papers_data:
            self.statistics['total_papers'] += 1

            decision = paper['decision'].lower()
            if decision == 'include':
                self.statistics['include'] += 1
            elif decision == 'exclude':
                self.statistics['exclude'] += 1
            else:
                self.statistics['unclear'] += 1

            if paper['has_summary']:
                self.statistics['with_summaries'] += 1

            category = paper['relevance_category']
            if category == 'high':
                self.statistics['high_relevance'] += 1
            elif category == 'medium':
                self.statistics['medium_relevance'] += 1
            else:
                self.statistics['low_relevance'] += 1

    def create_vault_structure(self):
        """Create vault directory structure"""
        print("\n📁 Creating vault structure...")

        # Remove existing vault
        if self.vault_path.exists():
            print(f"  Removing existing vault: {self.vault_path}")
            shutil.rmtree(self.vault_path)

        # Create directories
        directories = [
            self.vault_path,
            self.papers_path,
            self.mocs_path,
            self.concepts_path,
            self.synthesis_path,
        ]

        for directory in directories:
            directory.mkdir(parents=True, exist_ok=True)
            print(f"  ✓ Created: {directory.name}/")

    def generate_paper_notes(self):
        """Generate paper notes for all papers"""
        print(f"\n📄 Generating paper notes for {len(self.papers_data)} papers...")

        for i, paper in enumerate(self.papers_data, 1):
            if i % 50 == 0:
                print(f"  Progress: {i}/{len(self.papers_data)}")

            # Generate filename (sanitize - remove invalid Windows filename chars)
            author_year = paper['author_year'].replace(' ', '_').replace('(', '').replace(')', '')
            title_short = paper['title'][:50]
            # Remove invalid Windows filename characters
            invalid_chars = '<>:"/\\|?*'
            for char in invalid_chars:
                title_short = title_short.replace(char, '_')
            title_short = title_short.replace(' ', '_')
            filename = f"{author_year}_{title_short}.md"
            filepath = self.papers_path / filename

            # Generate content
            content = self._generate_paper_content(paper)

            # Write file
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

        print(f"  ✓ Generated {len(self.papers_data)} paper notes")

    def _generate_paper_content(self, paper: Dict) -> str:
        """Generate markdown content for a paper"""

        # Score level labels
        def score_level(score):
            if score == 3:
                return "⭐⭐⭐ High"
            elif score == 2:
                return "⭐⭐ Medium"
            elif score == 1:
                return "⭐ Low"
            else:
                return "— None"

        # YAML frontmatter
        yaml = f"""---
title: "{paper['title']}"
zotero_key: {paper['zotero_key']}
author_year: "{paper['author_year']}"
authors: {json.dumps(paper['authors'])}

# Publication
publication_year: {paper['publication_year']}
item_type: {paper['item_type']}
language: {paper['language']}
doi: "{paper['doi']}"
url: "{paper['url']}"

# Assessment
decision: {paper['decision']}
exclusion_reason: "{paper['exclusion_reason']}"

# Relevance Scores (0-3)
rel_ai_komp: {paper['rel_ai_komp']}
rel_vulnerable: {paper['rel_vulnerable']}
rel_bias: {paper['rel_bias']}
rel_praxis: {paper['rel_praxis']}
rel_prof: {paper['rel_prof']}
total_relevance: {paper['total_relevance']}

# Categorization
relevance_category: {paper['relevance_category']}
top_dimensions: {json.dumps(paper['top_dimensions'])}

# Tags
tags: {json.dumps(paper['tags'])}

# Summary
has_summary: {str(paper['has_summary']).lower()}
summary_file: "{paper['summary_file'] or ''}"

# Metadata
date_added: {paper['date_added']}
source_tool: {paper['source_tool']}
---
"""

        # Main content
        content = f"""
# {paper['title']}

## Quick Info

| Attribute | Value |
|-----------|-------|
| **Authors** | {', '.join(paper['authors']) if paper['authors'] else 'Unknown'} |
| **Year** | {paper['publication_year']} |
| **Decision** | **{paper['decision']}** |
| **Total Relevance** | **{paper['total_relevance']}/15** ({paper['relevance_category']}) |
| **Top Dimensions** | {', '.join(paper['top_dimensions']) if paper['top_dimensions'] else 'None'} |

"""

        # Exclusion reason if excluded
        if paper['decision'] == 'Exclude' and paper['exclusion_reason']:
            content += f"""
## Exclusion Reason

{paper['exclusion_reason']}

"""

        # Relevance profile
        content += f"""
## Relevance Profile

| Dimension | Score | Assessment |
|-----------|-------|------------|
| AI Literacy & Competencies | {paper['rel_ai_komp']}/3 | {score_level(paper['rel_ai_komp'])} |
| Vulnerable Groups & Digital Equity | {paper['rel_vulnerable']}/3 | {score_level(paper['rel_vulnerable'])} |
| Bias & Discrimination Analysis | {paper['rel_bias']}/3 | {score_level(paper['rel_bias'])} |
| Practical Implementation | {paper['rel_praxis']}/3 | {score_level(paper['rel_praxis'])} |
| Professional/Social Work Context | {paper['rel_prof']}/3 | {score_level(paper['rel_prof'])} |

"""

        # Abstract
        if paper['abstract']:
            content += f"""
## Abstract

{paper['abstract']}

"""

        # AI Summary
        if paper['has_summary'] and paper['summary_file']:
            content += f"""
## AI Summary

![[{paper['summary_file']}]]

"""
        else:
            content += """
## AI Summary

*No AI summary available. This paper was assessed but not yet processed through the summarization pipeline.*

"""

        # Links & Resources
        content += f"""
## Links & Resources

"""

        if paper['doi']:
            content += f"- **DOI:** [{paper['doi']}](https://doi.org/{paper['doi']})\n"
        if paper['url']:
            content += f"- **URL:** {paper['url']}\n"
        if paper['zotero_key']:
            content += f"- **Zotero:** [Open in Zotero](zotero://select/items/{paper['zotero_key']})\n"

        # Related papers section (placeholder)
        content += """
## Related Papers

*Use Obsidian graph view to explore papers with similar relevance profiles*

## Notes

*Add your research notes here*

"""

        return yaml + content

    def generate_dimension_mocs(self):
        """Generate MOCs for each relevance dimension"""
        print("\n📊 Generating dimension MOCs...")

        dimensions = {
            'AI_Literacy': ('AI Literacy & Competencies', 'rel_ai_komp'),
            'Vulnerable_Groups': ('Vulnerable Groups & Digital Equity', 'rel_vulnerable'),
            'Bias_Analysis': ('Bias & Discrimination Analysis', 'rel_bias'),
            'Practical_Implementation': ('Practical Implementation', 'rel_praxis'),
            'Professional_Context': ('Professional/Social Work Context', 'rel_prof'),
        }

        for dim_key, (dim_name, score_key) in dimensions.items():
            self._generate_dimension_moc(dim_key, dim_name, score_key)

        print(f"  ✓ Generated {len(dimensions)} dimension MOCs")

    def _generate_dimension_moc(self, dim_key: str, dim_name: str, score_key: str):
        """Generate a single dimension MOC"""

        # Group papers by score
        papers_by_score = {3: [], 2: [], 1: [], 0: []}

        for paper in self.papers_data:
            score = paper[score_key]
            papers_by_score[score].append(paper)

        # Sort by total relevance within each score
        for score in papers_by_score:
            papers_by_score[score].sort(key=lambda p: p['total_relevance'], reverse=True)

        # Generate content
        content = f"""---
title: "Dimension: {dim_name}"
type: dimension-moc
dimension: {dim_key}
date_created: {datetime.now().strftime('%Y-%m-%d')}
tags: [moc, dimension]
---

# Dimension: {dim_name}

Research papers organized by relevance score for this dimension.

## Statistics

| Score | Count | Percentage |
|-------|-------|------------|
| ⭐⭐⭐ High (3) | {len(papers_by_score[3])} | {len(papers_by_score[3])/len(self.papers_data)*100:.1f}% |
| ⭐⭐ Medium (2) | {len(papers_by_score[2])} | {len(papers_by_score[2])/len(self.papers_data)*100:.1f}% |
| ⭐ Low (1) | {len(papers_by_score[1])} | {len(papers_by_score[1])/len(self.papers_data)*100:.1f}% |
| — None (0) | {len(papers_by_score[0])} | {len(papers_by_score[0])/len(self.papers_data)*100:.1f}% |

Average score: {sum(p[score_key] for p in self.papers_data)/len(self.papers_data):.2f}

---

"""

        # Add papers by score
        for score in [3, 2, 1]:
            if papers_by_score[score]:
                level = "⭐⭐⭐ High" if score == 3 else "⭐⭐ Medium" if score == 2 else "⭐ Low"
                content += f"\n## {level} (Score {score})\n\n"

                for paper in papers_by_score[score][:50]:  # Limit to top 50
                    author_year = paper['author_year'].replace(' ', '_').replace('(', '').replace(')', '')
                    title_short = paper['title'][:50].replace(' ', '_').replace('/', '_').replace(':', '_').replace('?', '')
                    filename = f"{author_year}_{title_short}"

                    content += f"- [[{filename}|{paper['author_year']}: {paper['title'][:60]}...]] (Total: {paper['total_relevance']}/15)\n"

        # Write file
        filepath = self.mocs_path / f"Dimension_{dim_key}.md"
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

    def generate_master_moc(self):
        """Generate master MOC"""
        print("\n🎯 Generating Master MOC...")

        content = f"""---
title: "Master MOC - SozArb Literature Research"
type: master-moc
tags: [moc, master, navigation]
generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}
---

# Master MOC - SozArb Literature Research

Complete navigation for AI Literacy in Social Work research corpus.

## Research Question

**How can social workers develop AI literacy to serve vulnerable populations ethically and effectively, particularly in addressing bias and discrimination in AI systems?**

---

## Vault Statistics

| Metric | Count | Percentage |
|--------|-------|------------|
| **Total Papers** | {self.statistics['total_papers']} | 100% |
| Papers with AI Summaries | {self.statistics['with_summaries']} | {self.statistics['with_summaries']/self.statistics['total_papers']*100:.1f}% |
| | | |
| **PRISMA Decisions** | | |
| ✅ Include | {self.statistics['include']} | {self.statistics['include']/self.statistics['total_papers']*100:.1f}% |
| ❌ Exclude | {self.statistics['exclude']} | {self.statistics['exclude']/self.statistics['total_papers']*100:.1f}% |
| ❓ Unclear | {self.statistics['unclear']} | {self.statistics['unclear']/self.statistics['total_papers']*100:.1f}% |
| | | |
| **Relevance Categories** | | |
| ⭐⭐⭐ High (≥10) | {self.statistics['high_relevance']} | {self.statistics['high_relevance']/self.statistics['total_papers']*100:.1f}% |
| ⭐⭐ Medium (5-9) | {self.statistics['medium_relevance']} | {self.statistics['medium_relevance']/self.statistics['total_papers']*100:.1f}% |
| ⭐ Low (<5) | {self.statistics['low_relevance']} | {self.statistics['low_relevance']/self.statistics['total_papers']*100:.1f}% |

---

## Navigation

### By Assessment Decision

- [[MOCs/Papers_Include|📗 Included Papers]] ({self.statistics['include']})
- [[MOCs/Papers_Exclude|📕 Excluded Papers]] ({self.statistics['exclude']})
- [[MOCs/Papers_Unclear|📙 Unclear Papers]] ({self.statistics['unclear']})

### By Relevance Dimension

- [[MOCs/Dimension_AI_Literacy|🤖 AI Literacy & Competencies]]
- [[MOCs/Dimension_Vulnerable_Groups|🛡️ Vulnerable Groups & Digital Equity]]
- [[MOCs/Dimension_Bias_Analysis|⚖️ Bias & Discrimination Analysis]]
- [[MOCs/Dimension_Practical_Implementation|🔧 Practical Implementation]]
- [[MOCs/Dimension_Professional_Context|👥 Professional/Social Work Context]]

### By Relevance Level

- [[MOCs/Papers_High_Relevance|⭐⭐⭐ High Relevance Papers]] ({self.statistics['high_relevance']})
- [[MOCs/Papers_Medium_Relevance|⭐⭐ Medium Relevance Papers]] ({self.statistics['medium_relevance']})
- [[MOCs/Papers_Low_Relevance|⭐ Low Relevance Papers]] ({self.statistics['low_relevance']})

### Special Collections

- [[MOCs/Papers_with_Summaries|📝 Papers with AI Summaries]] ({self.statistics['with_summaries']})
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

*Vault generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}*
*Script: `generate_research_vault_with_assessment.py`*
*Total files: {self.statistics['total_papers']} papers + MOCs*
"""

        filepath = self.vault_path / "MASTER_MOC.md"
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

        print("  ✓ Generated Master MOC")

    def generate_additional_mocs(self):
        """Generate additional MOC files"""
        print("\n📑 Generating additional MOCs...")

        # Papers by decision
        self._generate_decision_moc('Include', [p for p in self.papers_data if p['decision'] == 'Include'])
        self._generate_decision_moc('Exclude', [p for p in self.papers_data if p['decision'] == 'Exclude'])
        self._generate_decision_moc('Unclear', [p for p in self.papers_data if p['decision'] == 'Unclear'])

        # Papers by relevance
        self._generate_relevance_moc('High', [p for p in self.papers_data if p['relevance_category'] == 'high'])
        self._generate_relevance_moc('Medium', [p for p in self.papers_data if p['relevance_category'] == 'medium'])
        self._generate_relevance_moc('Low', [p for p in self.papers_data if p['relevance_category'] == 'low'])

        # Papers with summaries
        self._generate_summaries_moc([p for p in self.papers_data if p['has_summary']])

        # Top papers
        self._generate_top_papers_moc()

        print("  ✓ Generated 8 additional MOCs")

    def _generate_decision_moc(self, decision: str, papers: List[Dict]):
        """Generate MOC for papers by decision"""

        icon = "📗" if decision == "Include" else "📕" if decision == "Exclude" else "📙"

        content = f"""---
title: "{decision} Papers"
type: decision-moc
decision: {decision}
count: {len(papers)}
date_created: {datetime.now().strftime('%Y-%m-%d')}
tags: [moc, decision, {decision.lower()}]
---

# {icon} {decision} Papers

Total: {len(papers)} papers

"""

        # Sort by total relevance
        papers_sorted = sorted(papers, key=lambda p: p['total_relevance'], reverse=True)

        for paper in papers_sorted:
            author_year = paper['author_year'].replace(' ', '_').replace('(', '').replace(')', '')
            title_short = paper['title'][:50].replace(' ', '_').replace('/', '_').replace(':', '_').replace('?', '')
            filename = f"{author_year}_{title_short}"

            summary_badge = "📝" if paper['has_summary'] else ""
            content += f"- [[{filename}|{paper['author_year']}: {paper['title'][:70]}...]] {summary_badge} (Relevance: {paper['total_relevance']}/15)\n"

        filepath = self.mocs_path / f"Papers_{decision}.md"
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

    def _generate_relevance_moc(self, level: str, papers: List[Dict]):
        """Generate MOC for papers by relevance level"""

        stars = "⭐⭐⭐" if level == "High" else "⭐⭐" if level == "Medium" else "⭐"

        content = f"""---
title: "{level} Relevance Papers"
type: relevance-moc
relevance_level: {level}
count: {len(papers)}
date_created: {datetime.now().strftime('%Y-%m-%d')}
tags: [moc, relevance, {level.lower()}-relevance]
---

# {stars} {level} Relevance Papers

Total: {len(papers)} papers

"""

        # Sort by total relevance
        papers_sorted = sorted(papers, key=lambda p: p['total_relevance'], reverse=True)

        for paper in papers_sorted:
            author_year = paper['author_year'].replace(' ', '_').replace('(', '').replace(')', '')
            title_short = paper['title'][:50].replace(' ', '_').replace('/', '_').replace(':', '_').replace('?', '')
            filename = f"{author_year}_{title_short}"

            content += f"- [[{filename}|{paper['author_year']}: {paper['title'][:70]}...]] (Score: {paper['total_relevance']}/15, {paper['decision']})\n"

        filepath = self.mocs_path / f"Papers_{level}_Relevance.md"
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

    def _generate_summaries_moc(self, papers: List[Dict]):
        """Generate MOC for papers with summaries"""

        content = f"""---
title: "Papers with AI Summaries"
type: summaries-moc
count: {len(papers)}
date_created: {datetime.now().strftime('%Y-%m-%d')}
tags: [moc, summaries]
---

# 📝 Papers with AI Summaries

Papers that have been processed through the AI summarization pipeline (Claude Haiku 4.5).

Total: {len(papers)} papers

"""

        papers_sorted = sorted(papers, key=lambda p: p['total_relevance'], reverse=True)

        for paper in papers_sorted:
            author_year = paper['author_year'].replace(' ', '_').replace('(', '').replace(')', '')
            title_short = paper['title'][:50].replace(' ', '_').replace('/', '_').replace(':', '_').replace('?', '')
            filename = f"{author_year}_{title_short}"

            content += f"- [[{filename}|{paper['author_year']}: {paper['title'][:70]}...]] (Relevance: {paper['total_relevance']}/15)\n"

        filepath = self.mocs_path / "Papers_with_Summaries.md"
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

    def _generate_top_papers_moc(self):
        """Generate MOC for top papers"""

        papers_sorted = sorted(self.papers_data, key=lambda p: p['total_relevance'], reverse=True)
        top_20 = papers_sorted[:20]

        content = f"""---
title: "Top 20 Papers by Relevance"
type: top-papers-moc
count: 20
date_created: {datetime.now().strftime('%Y-%m-%d')}
tags: [moc, top-papers]
---

# 🏆 Top 20 Papers by Total Relevance

The most relevant papers for AI literacy in social work research.

"""

        for i, paper in enumerate(top_20, 1):
            author_year = paper['author_year'].replace(' ', '_').replace('(', '').replace(')', '')
            title_short = paper['title'][:50].replace(' ', '_').replace('/', '_').replace(':', '_').replace('?', '')
            filename = f"{author_year}_{title_short}"

            dims = ', '.join(paper['top_dimensions']) if paper['top_dimensions'] else 'N/A'
            summary_badge = "📝" if paper['has_summary'] else ""

            content += f"\n## {i}. {paper['author_year']}: {paper['title']}\n\n"
            content += f"- **Link:** [[{filename}]]\n"
            content += f"- **Total Relevance:** {paper['total_relevance']}/15\n"
            content += f"- **Top Dimensions:** {dims}\n"
            content += f"- **Decision:** {paper['decision']}\n"
            content += f"- **Has Summary:** {'Yes 📝' if paper['has_summary'] else 'No'}\n"

        filepath = self.mocs_path / "Top_Papers.md"
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

    def generate_readme(self):
        """Generate vault README"""
        print("\n📄 Generating README...")

        content = f"""# SozArb Literature Research Vault

Obsidian vault for systematic literature research on AI literacy in social work.

## Research Question

**How can social workers develop AI literacy to serve vulnerable populations ethically and effectively, particularly in addressing bias and discrimination in AI systems?**

## Vault Statistics

- **Total Papers:** {self.statistics['total_papers']}
- **Included Papers:** {self.statistics['include']}
- **Papers with AI Summaries:** {self.statistics['with_summaries']}
- **High Relevance Papers:** {self.statistics['high_relevance']}

## Getting Started

1. Open this folder in Obsidian
2. Start with [[MASTER_MOC]] for complete navigation
3. Use tags and search to filter papers
4. Explore dimension MOCs for thematic navigation

## Folder Structure

- **Papers/** - All {self.statistics['total_papers']} research papers with full metadata
- **MOCs/** - Maps of Content for navigation
- **Synthesis/** - Your research notes and insights
- **Concepts/** - Extracted concepts (if available)

## Key Features

### Full Assessment Integration

Each paper includes:
- PRISMA decision (Include/Exclude/Unclear)
- 5-dimensional relevance scores (0-3 scale)
- Total relevance score (0-15)
- Complete metadata (authors, DOI, abstract, etc.)
- AI summary (if available)

### Navigation by Dimension

Five relevance dimensions:
1. AI Literacy & Competencies
2. Vulnerable Groups & Digital Equity
3. Bias & Discrimination Analysis
4. Practical Implementation
5. Professional/Social Work Context

### Tag System

- `#include` / `#exclude` / `#unclear` - PRISMA decisions
- `#high-relevance` / `#medium-relevance` / `#low-relevance`
- `#dim-*-high` / `#dim-*-medium` - Dimension scores
- `#has-summary` - Papers with AI summaries

## Recommended Plugins

- **Dataview** - Query and visualize paper data
- **Graph View** - Explore paper relationships
- **Tag Pane** - Navigate by tags

## Generated

- **Date:** {datetime.now().strftime('%Y-%m-%d %H:%M')}
- **Script:** `generate_research_vault_with_assessment.py`
- **Assessment Source:** LLM-based PRISMA assessment (Claude Haiku 4.5)
- **Summary Source:** Claude Haiku 4.5 (58 papers)

---

Start exploring: [[MASTER_MOC]]
"""

        filepath = self.vault_path / "README.md"
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

        print("  ✓ Generated README")

    def generate(self):
        """Main generation process"""
        print("\n" + "="*60)
        print("  Literature Research Vault Generator")
        print("  with Full Assessment Integration")
        print("="*60)

        # Load data
        self.load_data()

        # Create structure
        self.create_vault_structure()

        # Generate content
        self.generate_paper_notes()
        self.generate_dimension_mocs()
        self.generate_additional_mocs()
        self.generate_master_moc()
        self.generate_readme()

        # Summary
        print("\n" + "="*60)
        print("  ✅ VAULT GENERATION COMPLETE")
        print("="*60)
        print(f"\nVault location: {self.vault_path}")
        print(f"\nStatistics:")
        print(f"  Total papers: {self.statistics['total_papers']}")
        print(f"  - Include: {self.statistics['include']}")
        print(f"  - Exclude: {self.statistics['exclude']}")
        print(f"  - Unclear: {self.statistics['unclear']}")
        print(f"  With summaries: {self.statistics['with_summaries']}")
        print(f"  High relevance: {self.statistics['high_relevance']}")
        print(f"\nNext steps:")
        print(f"  1. Open Obsidian")
        print(f"  2. Open folder as vault: {self.vault_path}")
        print(f"  3. Start with: MASTER_MOC.md")
        print("\n")

def main():
    generator = ResearchVaultGenerator()
    generator.generate()

if __name__ == "__main__":
    main()
