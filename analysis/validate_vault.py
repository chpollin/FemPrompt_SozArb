#!/usr/bin/env python3
"""
Vault Quality Validator
Checks Obsidian vault integrity: broken links, metadata completeness, concept coverage
"""

import sys
import re
from pathlib import Path
from typing import Dict, List, Set, Tuple
from collections import defaultdict, Counter
import json

# Fix encoding for Windows console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

class VaultValidator:
    def __init__(self, vault_path: str = "FemPrompt_Vault"):
        self.vault_path = Path(vault_path)
        self.papers_path = self.vault_path / "Papers"
        self.concepts_path = self.vault_path / "Concepts"

        # Track issues
        self.broken_links: List[Tuple[str, str]] = []
        self.missing_metadata: List[Tuple[str, List[str]]] = []
        self.orphan_papers: List[str] = []
        self.orphan_concepts: List[str] = []

        # Statistics
        self.stats = {
            'total_papers': 0,
            'total_concepts': 0,
            'total_links': 0,
            'broken_links': 0,
            'metadata_issues': 0
        }

    def extract_wikilinks(self, content: str) -> Set[str]:
        """Extract all [[wikilinks]] from content"""
        pattern = r'\[\[([^\]]+)\]\]'
        return set(re.findall(pattern, content))

    def check_broken_links(self) -> None:
        """Find broken wikilinks"""
        print("\n[1/5] Checking for broken links...")

        # Build index of all valid targets
        valid_targets = set()

        # Add all paper titles
        for paper in self.papers_path.glob("*.md"):
            valid_targets.add(paper.stem)

        # Add all concept names
        for concept_dir in self.concepts_path.iterdir():
            if concept_dir.is_dir():
                for concept in concept_dir.glob("*.md"):
                    valid_targets.add(concept.stem)

        # Check all links in all files
        all_files = list(self.papers_path.glob("*.md"))
        all_files.extend(self.concepts_path.rglob("*.md"))

        for file_path in all_files:
            content = file_path.read_text(encoding='utf-8')
            links = self.extract_wikilinks(content)
            self.stats['total_links'] += len(links)

            for link in links:
                if link not in valid_targets:
                    self.broken_links.append((file_path.name, link))
                    self.stats['broken_links'] += 1

        print(f"  Found {self.stats['broken_links']} broken links in {len(all_files)} files")

    def check_metadata_completeness(self) -> None:
        """Check YAML frontmatter completeness"""
        print("\n[2/5] Checking metadata completeness...")

        required_fields = ['title', 'year', 'type', 'tags']

        for paper in self.papers_path.glob("*.md"):
            content = paper.read_text(encoding='utf-8')

            # Extract YAML frontmatter
            if content.startswith('---'):
                parts = content.split('---', 2)
                if len(parts) >= 3:
                    frontmatter = parts[1]

                    missing = []
                    for field in required_fields:
                        if f"{field}:" not in frontmatter:
                            missing.append(field)

                    if missing:
                        self.missing_metadata.append((paper.name, missing))
                        self.stats['metadata_issues'] += 1

        print(f"  Found {self.stats['metadata_issues']} papers with incomplete metadata")

    def check_orphan_nodes(self) -> None:
        """Find papers/concepts with no links"""
        print("\n[3/5] Checking for orphan nodes...")

        # Track which nodes are linked to
        linked_papers = set()
        linked_concepts = set()

        # Check all papers for concept links
        for paper in self.papers_path.glob("*.md"):
            content = paper.read_text(encoding='utf-8')
            links = self.extract_wikilinks(content)

            if not links:
                self.orphan_papers.append(paper.name)
            else:
                linked_concepts.update(links)

        # Check all concepts for paper backlinks
        for concept in self.concepts_path.rglob("*.md"):
            content = concept.read_text(encoding='utf-8')
            links = self.extract_wikilinks(content)

            if not links:
                self.orphan_concepts.append(concept.name)
            else:
                linked_papers.update(links)

        print(f"  Found {len(self.orphan_papers)} orphan papers")
        print(f"  Found {len(self.orphan_concepts)} orphan concepts")

    def analyze_concept_distribution(self) -> Dict[str, int]:
        """Analyze concept frequency distribution"""
        print("\n[4/5] Analyzing concept distribution...")

        concept_counts = Counter()

        for paper in self.papers_path.glob("*.md"):
            content = paper.read_text(encoding='utf-8')

            # Extract bias_types and mitigation_strategies from frontmatter
            if 'bias_types:' in content:
                bias_section = content.split('bias_types:')[1].split('mitigation_strategies:')[0]
                concepts = re.findall(r'- (.+)', bias_section)
                concept_counts.update(concepts)

            if 'mitigation_strategies:' in content:
                mit_section = content.split('mitigation_strategies:')[1].split('---')[0]
                concepts = re.findall(r'- (.+)', mit_section)
                concept_counts.update(concepts)

        distribution = {
            'high_frequency (10+)': sum(1 for c in concept_counts.values() if c >= 10),
            'medium_frequency (5-9)': sum(1 for c in concept_counts.values() if 5 <= c < 10),
            'low_frequency (2-4)': sum(1 for c in concept_counts.values() if 2 <= c < 5),
            'rare (1)': sum(1 for c in concept_counts.values() if c == 1)
        }

        print(f"  High frequency concepts: {distribution['high_frequency (10+)']}")
        print(f"  Medium frequency concepts: {distribution['medium_frequency (5-9)']}")
        print(f"  Low frequency concepts: {distribution['low_frequency (2-4)']}")

        return distribution

    def calculate_vault_score(self) -> int:
        """Calculate overall vault quality score (0-100)"""
        print("\n[5/5] Calculating vault quality score...")

        self.stats['total_papers'] = len(list(self.papers_path.glob("*.md")))
        self.stats['total_concepts'] = len(list(self.concepts_path.rglob("*.md")))

        score = 100

        # Deduct for broken links (severe issue)
        if self.stats['total_links'] > 0:
            broken_ratio = self.stats['broken_links'] / self.stats['total_links']
            score -= int(broken_ratio * 40)  # Max -40 points

        # Deduct for missing metadata (moderate issue)
        if self.stats['total_papers'] > 0:
            metadata_ratio = self.stats['metadata_issues'] / self.stats['total_papers']
            score -= int(metadata_ratio * 20)  # Max -20 points

        # Deduct for orphan papers (minor issue)
        if self.stats['total_papers'] > 0:
            orphan_ratio = len(self.orphan_papers) / self.stats['total_papers']
            score -= int(orphan_ratio * 15)  # Max -15 points

        # Deduct for orphan concepts (minor issue)
        if self.stats['total_concepts'] > 0:
            orphan_concept_ratio = len(self.orphan_concepts) / self.stats['total_concepts']
            score -= int(orphan_concept_ratio * 15)  # Max -15 points

        return max(0, score)

    def generate_report(self) -> str:
        """Generate validation report"""
        report = f"""
================================================================================
                        VAULT VALIDATION REPORT
================================================================================

Vault: {self.vault_path}

STATISTICS
----------
Total Papers:       {self.stats['total_papers']}
Total Concepts:     {self.stats['total_concepts']}
Total Links:        {self.stats['total_links']}

ISSUES FOUND
------------
Broken Links:       {self.stats['broken_links']}
Metadata Issues:    {self.stats['metadata_issues']}
Orphan Papers:      {len(self.orphan_papers)}
Orphan Concepts:    {len(self.orphan_concepts)}

QUALITY SCORE: {self.calculate_vault_score()}/100

"""

        if self.broken_links:
            report += "\nBROKEN LINKS (showing first 10):\n"
            for file, link in self.broken_links[:10]:
                report += f"  [{file}] -> [[{link}]] (target not found)\n"

        if self.missing_metadata:
            report += "\nMISSING METADATA (showing first 10):\n"
            for file, fields in self.missing_metadata[:10]:
                report += f"  [{file}] missing: {', '.join(fields)}\n"

        if self.orphan_papers:
            report += f"\nORPHAN PAPERS (showing first 10):\n"
            for paper in self.orphan_papers[:10]:
                report += f"  - {paper}\n"

        report += "\n" + "="*80 + "\n"

        return report

    def validate(self) -> Dict:
        """Run all validation checks"""
        print("\n" + "="*80)
        print("VAULT VALIDATION STARTING")
        print("="*80)

        self.check_broken_links()
        self.check_metadata_completeness()
        self.check_orphan_nodes()
        distribution = self.analyze_concept_distribution()
        score = self.calculate_vault_score()

        # Generate and print report
        report = self.generate_report()
        print(report)

        # Save report
        report_path = self.vault_path / "VALIDATION_REPORT.md"
        report_path.write_text(report, encoding='utf-8')
        print(f"Report saved to: {report_path}")

        return {
            'score': score,
            'stats': self.stats,
            'broken_links': len(self.broken_links),
            'metadata_issues': len(self.missing_metadata),
            'orphan_papers': len(self.orphan_papers),
            'orphan_concepts': len(self.orphan_concepts),
            'concept_distribution': distribution
        }


def main():
    import argparse

    parser = argparse.ArgumentParser(description='Validate Obsidian vault quality')
    parser.add_argument('--vault', default='FemPrompt_Vault',
                       help='Path to vault (default: FemPrompt_Vault)')
    args = parser.parse_args()

    validator = VaultValidator(args.vault)
    results = validator.validate()

    # Exit with error code if score is below threshold
    if results['score'] < 85:
        print(f"\nWARNING: Vault quality below threshold (85): {results['score']}/100")
        exit(1)
    else:
        print(f"\nSUCCESS: Vault quality acceptable: {results['score']}/100")
        exit(0)


if __name__ == "__main__":
    main()
