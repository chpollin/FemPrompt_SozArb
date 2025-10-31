#!/usr/bin/env python3
"""
Vault Quality Test Suite
Tests the Obsidian vault generation for completeness and quality
"""

import os
import json
import re
from pathlib import Path
from typing import Dict, List, Tuple, Set
from collections import Counter
import yaml

class VaultQualityTester:
    def __init__(self, vault_path: str = None):
        if vault_path is None:
            self.vault_path = Path(__file__).parent.parent / "FemPrompt_Vault"
        else:
            self.vault_path = Path(vault_path)

        self.test_results = []
        self.warnings = []
        self.errors = []
        self.stats = {}

    def run_all_tests(self) -> Dict:
        """Run all quality tests and return report"""
        print("\n" + "="*60)
        print("VAULT QUALITY TEST SUITE")
        print("="*60 + "\n")

        # 1. Structure Tests
        print("1. STRUCTURE TESTS")
        print("-" * 40)
        self.test_vault_structure()

        # 2. Content Quality Tests
        print("\n2. CONTENT QUALITY TESTS")
        print("-" * 40)
        self.test_concept_quality()

        # 3. Linking Tests
        print("\n3. CROSS-LINKING TESTS")
        print("-" * 40)
        self.test_cross_links()

        # 4. Metadata Tests
        print("\n4. METADATA TESTS")
        print("-" * 40)
        self.test_metadata_completeness()

        # 5. Concept Extraction Tests
        print("\n5. CONCEPT EXTRACTION TESTS")
        print("-" * 40)
        self.test_concept_extraction_quality()

        # Generate Report
        return self.generate_report()

    def test_vault_structure(self):
        """Test 1: Check vault has correct structure"""
        required_folders = [
            "Papers",
            "Concepts",
            "Concepts/Bias_Types",
            "Concepts/Mitigation_Strategies",
            "MOCs",
            "Synthesis"
        ]

        required_files = [
            "MASTER_MOC.md",
            "README.md",
            "MOCs/Index.md",
            "MOCs/Concept_Frequency.md"
        ]

        # Check folders
        for folder in required_folders:
            folder_path = self.vault_path / folder
            if folder_path.exists():
                self.test_results.append(f"[OK] Folder exists: {folder}")
            else:
                self.errors.append(f"[ERROR] Missing folder: {folder}")

        # Check files
        for file in required_files:
            file_path = self.vault_path / file
            if file_path.exists():
                self.test_results.append(f"[OK] File exists: {file}")
            else:
                self.errors.append(f"[ERROR] Missing file: {file}")

        # Count files in each category
        paper_count = len(list((self.vault_path / "Papers").glob("*.md")))
        bias_count = len(list((self.vault_path / "Concepts/Bias_Types").glob("*.md")))
        mit_count = len(list((self.vault_path / "Concepts/Mitigation_Strategies").glob("*.md")))

        self.stats['papers'] = paper_count
        self.stats['bias_concepts'] = bias_count
        self.stats['mitigation_concepts'] = mit_count
        self.stats['total_concepts'] = bias_count + mit_count

        print(f"Papers: {paper_count}")
        print(f"Bias Concepts: {bias_count}")
        print(f"Mitigation Concepts: {mit_count}")
        print(f"Total Concepts: {self.stats['total_concepts']}")

    def test_concept_quality(self):
        """Test 2: Check concept quality (no duplicates, no fragments)"""
        all_concepts = []

        # Collect all concept files
        for category in ["Bias_Types", "Mitigation_Strategies"]:
            concept_path = self.vault_path / "Concepts" / category
            if concept_path.exists():
                for file in concept_path.glob("*.md"):
                    concept_name = file.stem
                    all_concepts.append(concept_name)

        # Check for duplicates (case-insensitive)
        concept_lower = [c.lower() for c in all_concepts]
        duplicates = [c for c in concept_lower if concept_lower.count(c) > 1]

        if duplicates:
            self.warnings.append(f"[WARN] Duplicate concepts found: {set(duplicates)}")
        else:
            self.test_results.append("[OK] No duplicate concepts")

        # Check for fragments (suspicious patterns)
        fragments = []
        for concept in all_concepts:
            # Check for fragments like "Of Intersectionality"
            if concept.startswith("Of ") or concept.startswith("And ") or concept.startswith("The "):
                fragments.append(concept)
            # Check for single words that shouldn't be standalone
            if concept.lower() in ['bias', 'gender', 'racial', 'ai']:
                fragments.append(concept)

        if fragments:
            self.warnings.append(f"[WARN] Potential fragment concepts: {fragments}")
        else:
            self.test_results.append("[OK] No fragment concepts detected")

        # Check concept length distribution
        concept_lengths = Counter(len(c) for c in all_concepts)
        short_concepts = [c for c in all_concepts if len(c) < 3]

        if short_concepts:
            self.warnings.append(f"[WARN] Very short concepts: {short_concepts}")

        print(f"Unique concepts: {len(set(all_concepts))}")
        print(f"Potential duplicates: {len(set(duplicates))}")
        print(f"Potential fragments: {len(fragments)}")

    def test_cross_links(self):
        """Test 3: Check that cross-links work properly"""
        broken_links = []
        valid_links = 0

        # Check a sample of papers for concept links
        papers_path = self.vault_path / "Papers"
        sample_papers = list(papers_path.glob("*.md"))[:5]  # Check first 5 papers

        for paper_file in sample_papers:
            with open(paper_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # Find all [[links]]
            links = re.findall(r'\[\[([^\]]+)\]\]', content)

            for link in links:
                # Check if linked file exists
                # Try in Concepts folders
                found = False
                for category in ["Bias_Types", "Mitigation_Strategies"]:
                    link_path = self.vault_path / "Concepts" / category / f"{link}.md"
                    if link_path.exists():
                        found = True
                        valid_links += 1
                        break

                if not found:
                    # Check if it's a paper link
                    paper_link = self.vault_path / "Papers" / f"{link}.md"
                    if paper_link.exists():
                        valid_links += 1
                    else:
                        broken_links.append((paper_file.stem, link))

        if broken_links:
            self.warnings.append(f"[WARN] Broken links found: {len(broken_links)}")
            for source, target in broken_links[:5]:  # Show first 5
                print(f"  - {source} -> {target}")
        else:
            self.test_results.append(f"[OK] All links valid (checked {valid_links} links)")

        print(f"Valid links: {valid_links}")
        print(f"Broken links: {len(broken_links)}")

    def test_metadata_completeness(self):
        """Test 4: Check that all papers have complete metadata"""
        incomplete_metadata = []

        papers_path = self.vault_path / "Papers"
        for paper_file in papers_path.glob("*.md"):
            with open(paper_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # Extract frontmatter
            if content.startswith('---'):
                frontmatter_end = content.find('---', 3)
                if frontmatter_end > 0:
                    frontmatter = content[3:frontmatter_end]

                    # Check required fields
                    required_fields = ['title', 'authors', 'year', 'tags']
                    missing_fields = []

                    for field in required_fields:
                        if f'{field}:' not in frontmatter:
                            missing_fields.append(field)

                    if missing_fields:
                        incomplete_metadata.append((paper_file.stem, missing_fields))

        if incomplete_metadata:
            self.warnings.append(f"[WARN] Papers with incomplete metadata: {len(incomplete_metadata)}")
        else:
            self.test_results.append("[OK] All papers have complete metadata")

        print(f"Papers with complete metadata: {self.stats['papers'] - len(incomplete_metadata)}/{self.stats['papers']}")

    def test_concept_extraction_quality(self):
        """Test 5: Analyze concept extraction patterns"""

        # Read frequency report
        freq_report_path = self.vault_path / "MOCs" / "Concept_Frequency.md"
        if freq_report_path.exists():
            with open(freq_report_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Extract top concepts and frequencies
            freq_pattern = r'\[\[([^\]]+)\]\] - (\d+) mentions'
            frequencies = re.findall(freq_pattern, content)

            if frequencies:
                top_concepts = [(c, int(f)) for c, f in frequencies[:10]]

                # Check for imbalanced extraction
                max_freq = top_concepts[0][1]
                min_freq = top_concepts[-1][1]

                if max_freq > min_freq * 10:
                    self.warnings.append(f"[WARN] High frequency imbalance: {max_freq}x vs {min_freq}x")

                # Check for over-extraction of generic terms
                generic_terms = ['AI Systems', 'Artificial Intelligence', 'Machine Learning']
                over_extracted = [c for c, f in top_concepts if c in generic_terms and f > 50]

                if over_extracted:
                    self.warnings.append(f"[WARN] Possible over-extraction: {over_extracted}")

                print(f"Top concept: {top_concepts[0][0]} ({top_concepts[0][1]}x)")
                print(f"Frequency range: {min_freq}-{max_freq}")

        # Check concept diversity
        if self.stats['total_concepts'] > 0:
            diversity_score = self.stats['total_concepts'] / self.stats['papers']
            print(f"Concept diversity: {diversity_score:.1f} concepts per paper")

            if diversity_score < 2:
                self.warnings.append("[WARN] Low concept diversity")
            elif diversity_score > 10:
                self.warnings.append("[WARN] Possible over-extraction")
            else:
                self.test_results.append("[OK] Good concept diversity")

    def generate_report(self) -> Dict:
        """Generate final test report"""
        print("\n" + "="*60)
        print("TEST REPORT SUMMARY")
        print("="*60)

        # Calculate scores
        total_tests = len(self.test_results) + len(self.warnings) + len(self.errors)
        passed_tests = len(self.test_results)
        warning_count = len(self.warnings)
        error_count = len(self.errors)

        if total_tests > 0:
            success_rate = (passed_tests / total_tests) * 100
        else:
            success_rate = 0

        # Quality Score (0-100)
        quality_score = max(0, 100 - (error_count * 20) - (warning_count * 5))

        print(f"\nMETRICS:")
        print(f"  Total Tests: {total_tests}")
        print(f"  [OK] Passed: {passed_tests}")
        print(f"  [WARN] Warnings: {warning_count}")
        print(f"  [ERROR] Errors: {error_count}")
        print(f"  Success Rate: {success_rate:.1f}%")
        print(f"  Quality Score: {quality_score}/100")

        print(f"\nSTATISTICS:")
        print(f"  Papers: {self.stats.get('papers', 0)}")
        print(f"  Total Concepts: {self.stats.get('total_concepts', 0)}")
        print(f"  - Bias Types: {self.stats.get('bias_concepts', 0)}")
        print(f"  - Mitigations: {self.stats.get('mitigation_concepts', 0)}")

        if self.errors:
            print(f"\nERRORS TO FIX:")
            for error in self.errors:
                print(f"  {error}")

        if self.warnings:
            print(f"\nWARNINGS TO REVIEW:")
            for warning in self.warnings[:5]:  # Show first 5
                print(f"  {warning}")

        # Recommendations
        print(f"\nRECOMMENDATIONS:")
        if quality_score >= 90:
            print("  [EXCELLENT] Vault quality is EXCELLENT!")
        elif quality_score >= 75:
            print("  [GOOD] Vault quality is GOOD. Minor improvements possible.")
        elif quality_score >= 60:
            print("  [ACCEPTABLE] Vault quality is ACCEPTABLE. Consider addressing warnings.")
        else:
            print("  [POOR] Vault quality needs improvement. Fix errors first.")

        if 'Of Intersectionality' in str(self.warnings):
            print("  -> Fix fragment extraction in regex patterns")
        if 'duplicate' in str(self.warnings).lower():
            print("  -> Improve deduplication in synonym mapping")
        if error_count > 0:
            print("  -> Critical: Fix structural errors")

        # Return structured report
        return {
            'quality_score': quality_score,
            'success_rate': success_rate,
            'passed_tests': passed_tests,
            'warnings': warning_count,
            'errors': error_count,
            'stats': self.stats,
            'recommendations': self.get_recommendations(quality_score)
        }

    def get_recommendations(self, quality_score: int) -> List[str]:
        """Get specific recommendations based on test results"""
        recommendations = []

        if self.errors:
            recommendations.append("Fix critical errors first")

        if any('fragment' in str(w) for w in self.warnings):
            recommendations.append("Improve regex patterns to avoid fragments")

        if any('duplicate' in str(w).lower() for w in self.warnings):
            recommendations.append("Enhance deduplication logic")

        if self.stats.get('total_concepts', 0) > 200:
            recommendations.append("Consider raising frequency threshold to 3")

        if quality_score < 75:
            recommendations.append("Review concept extraction patterns")

        return recommendations

def main():
    """Run the test suite"""
    import argparse

    parser = argparse.ArgumentParser(description='Test Obsidian vault quality')
    parser.add_argument('--vault-path', default=None, help='Path to vault')
    parser.add_argument('--verbose', action='store_true', help='Show detailed output')

    args = parser.parse_args()

    tester = VaultQualityTester(args.vault_path)
    report = tester.run_all_tests()

    # Save report to JSON
    report_path = Path(__file__).parent / "vault_test_report.json"
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2)

    print(f"\nFull report saved to: {report_path}")

    # Return exit code based on quality
    if report['quality_score'] >= 75:
        return 0  # Success
    else:
        return 1  # Needs improvement

if __name__ == "__main__":
    exit(main())