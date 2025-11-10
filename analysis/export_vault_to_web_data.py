#!/usr/bin/env python3
"""
Export Research Vault to JSON for Web Viewer
Reads all paper markdown files and extracts YAML frontmatter + content
"""

import os
import sys
import json
import re
from pathlib import Path
from typing import Dict, List, Optional
import yaml

# Fix encoding for Windows console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

class VaultExporter:
    def __init__(self, vault_path: str = None):
        if vault_path is None:
            self.vault_path = Path(__file__).parent.parent / "SozArb_Research_Vault"
        else:
            self.vault_path = Path(vault_path)

        self.papers_path = self.vault_path / "Papers"
        self.output_path = Path(__file__).parent.parent / "docs" / "data"

        self.papers = []
        self.statistics = {}
        self.graph_data = {'nodes': [], 'edges': []}

    def parse_paper_file(self, filepath: Path) -> Optional[Dict]:
        """Parse a paper markdown file and extract YAML + content"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # Split YAML frontmatter from content
            if not content.startswith('---'):
                return None

            parts = content.split('---', 2)
            if len(parts) < 3:
                return None

            yaml_content = parts[1].strip()
            markdown_content = parts[2].strip()

            # Parse YAML
            try:
                metadata = yaml.safe_load(yaml_content)
            except yaml.YAMLError as e:
                print(f"  ⚠️ YAML error in {filepath.name}: {e}")
                return None

            # Extract abstract from markdown
            abstract_match = re.search(r'## Abstract\s*\n\s*(.+?)(?=\n##|\Z)', markdown_content, re.DOTALL)
            abstract = abstract_match.group(1).strip() if abstract_match else ""

            # Extract AI summary section
            summary_match = re.search(r'## AI Summary\s*\n\s*(.+?)(?=\n##|\Z)', markdown_content, re.DOTALL)
            summary_section = summary_match.group(1).strip() if summary_match else ""

            # Build paper object
            paper = {
                # Core identification
                'id': filepath.stem,
                'filename': filepath.name,
                'title': metadata.get('title', 'Untitled'),
                'author_year': metadata.get('author_year', 'Unknown'),
                'authors': metadata.get('authors', []),

                # Publication info
                'publication_year': metadata.get('publication_year', ''),
                'item_type': metadata.get('item_type', ''),
                'language': metadata.get('language', ''),
                'doi': metadata.get('doi', ''),
                'url': metadata.get('url', ''),

                # Assessment
                'decision': metadata.get('decision', 'Unclear'),
                'exclusion_reason': metadata.get('exclusion_reason', ''),

                # Relevance scores
                'rel_ai_komp': int(metadata.get('rel_ai_komp', 0)),
                'rel_vulnerable': int(metadata.get('rel_vulnerable', 0)),
                'rel_bias': int(metadata.get('rel_bias', 0)),
                'rel_praxis': int(metadata.get('rel_praxis', 0)),
                'rel_prof': int(metadata.get('rel_prof', 0)),
                'total_relevance': int(metadata.get('total_relevance', 0)),

                # Categorization
                'relevance_category': metadata.get('relevance_category', 'low'),
                'top_dimensions': metadata.get('top_dimensions', []),

                # Tags
                'tags': metadata.get('tags', []),

                # Summary
                'has_summary': metadata.get('has_summary', False),
                'summary_file': metadata.get('summary_file', ''),

                # Content
                'abstract': abstract[:500] if abstract else "",  # Limit to 500 chars
                'summary_section': summary_section[:300] if summary_section else "",  # Limit to 300 chars

                # Metadata
                'source_tool': metadata.get('source_tool', ''),
                'zotero_key': metadata.get('zotero_key', ''),
            }

            return paper

        except Exception as e:
            print(f"  ⚠️ Error parsing {filepath.name}: {e}")
            return None

    def load_papers(self):
        """Load all papers from vault"""
        print(f"\n📚 Loading papers from: {self.papers_path}")

        if not self.papers_path.exists():
            print(f"  ❌ Papers directory not found: {self.papers_path}")
            return

        paper_files = list(self.papers_path.glob("*.md"))
        print(f"  Found {len(paper_files)} paper files")

        for i, filepath in enumerate(paper_files, 1):
            if i % 50 == 0:
                print(f"  Progress: {i}/{len(paper_files)}")

            paper = self.parse_paper_file(filepath)
            if paper:
                self.papers.append(paper)

        print(f"  ✓ Loaded {len(self.papers)} papers successfully")

    def calculate_statistics(self):
        """Calculate vault statistics"""
        print("\n📊 Calculating statistics...")

        self.statistics = {
            'total_papers': len(self.papers),
            'by_decision': {},
            'by_relevance': {},
            'by_dimension': {
                'ai_komp': {'high': 0, 'medium': 0, 'low': 0, 'none': 0},
                'vulnerable': {'high': 0, 'medium': 0, 'low': 0, 'none': 0},
                'bias': {'high': 0, 'medium': 0, 'low': 0, 'none': 0},
                'praxis': {'high': 0, 'medium': 0, 'low': 0, 'none': 0},
                'prof': {'high': 0, 'medium': 0, 'low': 0, 'none': 0},
            },
            'with_summaries': 0,
            'average_relevance': 0,
        }

        # Count by decision
        for paper in self.papers:
            decision = paper['decision']
            self.statistics['by_decision'][decision] = self.statistics['by_decision'].get(decision, 0) + 1

            # Count by relevance category
            rel_cat = paper['relevance_category']
            self.statistics['by_relevance'][rel_cat] = self.statistics['by_relevance'].get(rel_cat, 0) + 1

            # Count by dimensions
            for dim in ['ai_komp', 'vulnerable', 'bias', 'praxis', 'prof']:
                score = paper[f'rel_{dim}']
                if score == 3:
                    self.statistics['by_dimension'][dim]['high'] += 1
                elif score == 2:
                    self.statistics['by_dimension'][dim]['medium'] += 1
                elif score == 1:
                    self.statistics['by_dimension'][dim]['low'] += 1
                else:
                    self.statistics['by_dimension'][dim]['none'] += 1

            # Count summaries
            if paper['has_summary']:
                self.statistics['with_summaries'] += 1

        # Calculate average relevance
        if self.papers:
            total_rel = sum(p['total_relevance'] for p in self.papers)
            self.statistics['average_relevance'] = round(total_rel / len(self.papers), 2)

        print(f"  ✓ Statistics calculated")

    def generate_graph_data(self):
        """Generate graph visualization data"""
        print("\n🕸️ Generating graph data...")

        # Create nodes
        for paper in self.papers:
            # Determine node size based on relevance
            size = 10 + (paper['total_relevance'] * 2)

            # Determine color based on decision
            color_map = {
                'Include': '#4CAF50',  # Green
                'Exclude': '#F44336',  # Red
                'Unclear': '#FF9800',  # Orange
            }
            color = color_map.get(paper['decision'], '#9E9E9E')

            node = {
                'id': paper['id'],
                'label': paper['author_year'],
                'title': f"{paper['title']}\nRelevance: {paper['total_relevance']}/15",
                'size': size,
                'color': color,
                'decision': paper['decision'],
                'relevance': paper['total_relevance'],
                'dimensions': {
                    'ai_komp': paper['rel_ai_komp'],
                    'vulnerable': paper['rel_vulnerable'],
                    'bias': paper['rel_bias'],
                    'praxis': paper['rel_praxis'],
                    'prof': paper['rel_prof'],
                }
            }
            self.graph_data['nodes'].append(node)

        # Create edges based on similar relevance profiles
        print(f"  Calculating similarity edges...")

        edge_threshold = 0.7  # Similarity threshold (0-1)
        max_edges_per_node = 5  # Limit edges per node

        for i, paper1 in enumerate(self.papers):
            similar_papers = []

            for j, paper2 in enumerate(self.papers):
                if i >= j:  # Skip self and already compared
                    continue

                # Calculate cosine similarity of dimension vectors
                v1 = [paper1['rel_ai_komp'], paper1['rel_vulnerable'], paper1['rel_bias'],
                      paper1['rel_praxis'], paper1['rel_prof']]
                v2 = [paper2['rel_ai_komp'], paper2['rel_vulnerable'], paper2['rel_bias'],
                      paper2['rel_praxis'], paper2['rel_prof']]

                # Dot product and magnitudes
                dot_product = sum(a * b for a, b in zip(v1, v2))
                magnitude1 = sum(a * a for a in v1) ** 0.5
                magnitude2 = sum(b * b for b in v2) ** 0.5

                if magnitude1 > 0 and magnitude2 > 0:
                    similarity = dot_product / (magnitude1 * magnitude2)
                else:
                    similarity = 0

                if similarity >= edge_threshold:
                    similar_papers.append((j, similarity))

            # Sort by similarity and take top N
            similar_papers.sort(key=lambda x: x[1], reverse=True)
            for j, similarity in similar_papers[:max_edges_per_node]:
                edge = {
                    'from': paper1['id'],
                    'to': self.papers[j]['id'],
                    'value': similarity,
                    'title': f"Similarity: {similarity:.2f}"
                }
                self.graph_data['edges'].append(edge)

        print(f"  ✓ Created {len(self.graph_data['nodes'])} nodes and {len(self.graph_data['edges'])} edges")

    def export_json(self):
        """Export data to JSON files"""
        print(f"\n💾 Exporting JSON data to: {self.output_path}")

        # Create output directory
        self.output_path.mkdir(parents=True, exist_ok=True)

        # Export papers
        papers_file = self.output_path / "research_vault.json"
        data = {
            'papers': self.papers,
            'statistics': self.statistics,
            'generated': '2025-11-10',
            'total_papers': len(self.papers),
        }

        with open(papers_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"  ✓ Exported papers: {papers_file}")

        # Export graph data
        graph_file = self.output_path / "graph_data.json"
        with open(graph_file, 'w', encoding='utf-8') as f:
            json.dump(self.graph_data, f, ensure_ascii=False, indent=2)
        print(f"  ✓ Exported graph: {graph_file}")

        # Export statistics only
        stats_file = self.output_path / "statistics.json"
        with open(stats_file, 'w', encoding='utf-8') as f:
            json.dump(self.statistics, f, ensure_ascii=False, indent=2)
        print(f"  ✓ Exported statistics: {stats_file}")

    def export(self):
        """Main export process"""
        print("\n" + "="*60)
        print("  Research Vault → Web Data Exporter")
        print("="*60)

        self.load_papers()
        self.calculate_statistics()
        self.generate_graph_data()
        self.export_json()

        print("\n" + "="*60)
        print("  ✅ EXPORT COMPLETE")
        print("="*60)
        print(f"\nExported {len(self.papers)} papers")
        print(f"Output directory: {self.output_path}")
        print("\nFiles created:")
        print(f"  - research_vault.json ({len(self.papers)} papers)")
        print(f"  - graph_data.json ({len(self.graph_data['nodes'])} nodes, {len(self.graph_data['edges'])} edges)")
        print(f"  - statistics.json")
        print("\nNext: Open docs/index.html in browser")
        print()

def main():
    exporter = VaultExporter()
    exporter.export()

if __name__ == "__main__":
    main()
