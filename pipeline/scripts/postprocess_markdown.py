#!/usr/bin/env python3
"""
Markdown Post-Processing Script

Cleans up common conversion artifacts from PDF-to-Markdown conversion:
1. Removes repeated headers/footers (journal names, author lines)
2. Removes orphan page numbers
3. Fixes broken hyphenation
4. Normalizes excessive whitespace
5. Removes all-caps noise (except valid headings)

Usage:
    python postprocess_markdown.py --input-dir pipeline/markdown --output-dir pipeline/markdown_clean
    python postprocess_markdown.py --input-dir pipeline/markdown --in-place  # Modify in place
"""

import argparse
import re
import json
import shutil
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass, asdict
from collections import Counter

from utils import setup_windows_encoding

setup_windows_encoding()


@dataclass
class PostProcessingStats:
    """Statistics for post-processing a single document"""
    filename: str
    original_chars: int
    final_chars: int
    chars_removed: int

    # Specific fixes applied
    hyphenations_fixed: int
    page_numbers_removed: int
    repeated_headers_removed: int
    excessive_newlines_fixed: int
    all_caps_removed: int

    # Quality improvement
    artifact_score_before: float
    artifact_score_after: float


class MarkdownPostProcessor:
    """Post-process markdown files to clean up conversion artifacts"""

    # Known journal/publisher headers to remove
    JOURNAL_PATTERNS = [
        r'Contents lists available at ScienceDirect',
        r'journal homepage: www\.[^\n]+',
        r'https?://doi\.org/[^\s]+\s*\n',
        r'Received \d+ [A-Za-z]+ \d{4}[^\n]*\n',
        r'Accepted \d+ [A-Za-z]+ \d{4}[^\n]*\n',
        r'Available online[^\n]*\n',
        r'\d{4}-\d{4}/© \d{4}[^\n]+\n',  # Copyright lines
        r'© \d{4} (Elsevier|Springer|Wiley|Taylor)[^\n]+\n',
    ]

    # Pattern for orphan page numbers (standalone numbers 1-999)
    PAGE_NUMBER_PATTERN = re.compile(r'^\s*(\d{1,3})\s*$', re.MULTILINE)

    # Pattern for broken hyphenation at line end
    HYPHENATION_PATTERN = re.compile(r'(\w{3,})-\s*\n\s*([a-z]{3,})')

    # Pattern for excessive newlines (3 or more)
    EXCESSIVE_NEWLINES = re.compile(r'\n{3,}')

    # Pattern for all-caps lines (potential noise)
    ALL_CAPS_PATTERN = re.compile(r'^([A-Z][A-Z\s]{20,})$', re.MULTILINE)

    def __init__(self, detect_repeated_content: bool = True):
        self.detect_repeated_content = detect_repeated_content
        self.compiled_journal_patterns = [
            re.compile(p, re.IGNORECASE) for p in self.JOURNAL_PATTERNS
        ]

    def fix_hyphenation(self, content: str) -> Tuple[str, int]:
        """Fix words broken across lines by hyphenation"""
        count = 0

        def replace_hyphen(match):
            nonlocal count
            count += 1
            return match.group(1) + match.group(2)

        fixed = self.HYPHENATION_PATTERN.sub(replace_hyphen, content)
        return fixed, count

    def remove_page_numbers(self, content: str) -> Tuple[str, int]:
        """Remove orphan page numbers (standalone numbers on a line)"""
        # Find all matches first
        matches = self.PAGE_NUMBER_PATTERN.findall(content)
        count = len(matches)

        # Remove them
        cleaned = self.PAGE_NUMBER_PATTERN.sub('', content)
        return cleaned, count

    def remove_journal_headers(self, content: str) -> Tuple[str, int]:
        """Remove known journal/publisher header patterns"""
        count = 0
        for pattern in self.compiled_journal_patterns:
            matches = pattern.findall(content)
            count += len(matches)
            content = pattern.sub('', content)
        return content, count

    def detect_and_remove_repeated_content(self, content: str) -> Tuple[str, int]:
        """Detect repeated author lines / headers and remove duplicates

        CONSERVATIVE APPROACH: Only remove lines that are clearly
        header/footer noise, not legitimate repeated structure.

        Examples of SAFE to remove:
        - "Z.W. Petzel and L. Sowerby" (author line repeated on each page)
        - "Journal of XYZ" (journal name in header/footer)

        Examples of NOT SAFE to remove:
        - "At basic level and with guidance, I can:" (competency descriptor)
        - "Examples of use" (section marker)
        - "<!-- image -->" (legitimate image placeholders)
        """
        if not self.detect_repeated_content:
            return content, 0

        lines = content.split('\n')
        line_counts = Counter(lines)

        # Find lines that appear more than 10 times AND match specific patterns
        # that indicate header/footer content (not legitimate structure)
        repeated_lines = set()

        for line, count in line_counts.items():
            stripped = line.strip()

            # Skip empty lines and markdown syntax
            if not stripped or stripped.startswith('#') or stripped.startswith('|'):
                continue

            # Skip image placeholders
            if '<!-- image -->' in stripped:
                continue

            # Only flag as repeated if:
            # 1. Appears > 10 times (very high threshold)
            # 2. Looks like an author line (contains "and" with names)
            # 3. Is short (< 60 chars) - headers are usually short
            if count > 10 and len(stripped) < 60:
                # Check if it matches author/header patterns
                is_author_line = bool(re.search(r'^[A-Z]\.\w*\.\s+\w+\s+and\s+[A-Z]\.', stripped))
                is_journal_line = bool(re.search(r'^(Journal|Computers|International|European)', stripped, re.IGNORECASE))

                if is_author_line or is_journal_line:
                    repeated_lines.add(line)

        if not repeated_lines:
            return content, 0

        # Keep only the first occurrence of each repeated header line
        seen_repeated = set()
        new_lines = []
        removed_count = 0

        for line in lines:
            if line in repeated_lines:
                if line not in seen_repeated:
                    seen_repeated.add(line)
                    new_lines.append(line)
                else:
                    removed_count += 1
            else:
                new_lines.append(line)

        return '\n'.join(new_lines), removed_count

    def normalize_whitespace(self, content: str) -> Tuple[str, int]:
        """Normalize excessive newlines to maximum 2"""
        matches = self.EXCESSIVE_NEWLINES.findall(content)
        count = len(matches)
        normalized = self.EXCESSIVE_NEWLINES.sub('\n\n', content)
        return normalized, count

    def handle_all_caps(self, content: str) -> Tuple[str, int]:
        """Handle all-caps sections - DISABLED for safety

        RATIONALE: All-caps content may be legitimate:
        - Competency matrices (e.g., DigComp framework)
        - Table headers
        - Acronym definitions
        - Level descriptors

        Removing this risks losing important structured information.
        Instead, we leave this content and let the artifact detector flag it.
        """
        # DISABLED: Return content unchanged
        return content, 0

        # Original code preserved for reference:
        count = 0

        def evaluate_caps(match):
            nonlocal count
            text = match.group(1).strip()

            # If it's short (< 50 chars), it might be a valid heading
            if len(text) < 50:
                return match.group(0)

            # If it contains typical heading words, keep it
            heading_words = ['ABSTRACT', 'INTRODUCTION', 'METHOD', 'RESULT', 'DISCUSSION',
                           'CONCLUSION', 'REFERENCE', 'ACKNOWLEDGMENT', 'APPENDIX']
            if any(word in text for word in heading_words):
                return match.group(0)

            # Otherwise, it's likely noise from table of contents or headers
            count += 1
            return ''

        cleaned = self.ALL_CAPS_PATTERN.sub(evaluate_caps, content)
        return cleaned, count

    def calculate_artifact_score(self, content: str) -> float:
        """Calculate a simple artifact score for comparison"""
        score = 0

        # Count various artifacts
        glyph_count = len(re.findall(r'GLYPH<\d+>', content))
        page_numbers = len(self.PAGE_NUMBER_PATTERN.findall(content))
        broken_hyphens = len(self.HYPHENATION_PATTERN.findall(content))
        excessive_nl = len(self.EXCESSIVE_NEWLINES.findall(content))

        score += glyph_count * 10
        score += page_numbers * 1
        score += broken_hyphens * 2
        score += excessive_nl * 2

        # Normalize to 0-100
        return min(100, score / 5)

    def process_file(self, content: str, filename: str) -> Tuple[str, PostProcessingStats]:
        """Apply all post-processing steps to a markdown file"""
        original_chars = len(content)
        artifact_before = self.calculate_artifact_score(content)

        # Apply fixes in order
        content, hyphen_fixes = self.fix_hyphenation(content)
        content, page_removes = self.remove_page_numbers(content)
        content, header_removes = self.remove_journal_headers(content)
        content, repeated_removes = self.detect_and_remove_repeated_content(content)
        content, caps_removes = self.handle_all_caps(content)
        content, newline_fixes = self.normalize_whitespace(content)

        # Clean up any double blank lines created
        content = re.sub(r'\n{3,}', '\n\n', content)

        artifact_after = self.calculate_artifact_score(content)
        final_chars = len(content)

        stats = PostProcessingStats(
            filename=filename,
            original_chars=original_chars,
            final_chars=final_chars,
            chars_removed=original_chars - final_chars,
            hyphenations_fixed=hyphen_fixes,
            page_numbers_removed=page_removes,
            repeated_headers_removed=header_removes + repeated_removes,
            excessive_newlines_fixed=newline_fixes,
            all_caps_removed=caps_removes,
            artifact_score_before=artifact_before,
            artifact_score_after=artifact_after
        )

        return content, stats

    def process_directory(
        self,
        input_dir: Path,
        output_dir: Optional[Path] = None,
        in_place: bool = False
    ) -> List[PostProcessingStats]:
        """Process all markdown files in a directory"""

        if in_place:
            output_dir = input_dir
        elif output_dir is None:
            output_dir = input_dir.parent / f"{input_dir.name}_clean"

        output_dir.mkdir(parents=True, exist_ok=True)

        md_files = sorted(input_dir.glob("*.md"))
        if not md_files:
            print(f"[WARNING] No markdown files found in {input_dir}")
            return []

        print(f"[*] Post-processing {len(md_files)} markdown files...")
        print(f"[*] Output directory: {output_dir}")
        print()

        all_stats = []

        for i, md_path in enumerate(md_files, 1):
            try:
                content = md_path.read_text(encoding='utf-8')
                processed, stats = self.process_file(content, md_path.name)

                # Write output
                output_path = output_dir / md_path.name
                output_path.write_text(processed, encoding='utf-8')

                all_stats.append(stats)

                # Status indicator
                improvement = stats.artifact_score_before - stats.artifact_score_after
                status = "✓" if improvement > 0 else "="

                if stats.chars_removed > 100 or improvement > 5:
                    print(f"[{i}/{len(md_files)}] {status} {md_path.name[:45]}... "
                          f"(-{stats.chars_removed} chars, artifact: {stats.artifact_score_before:.0f}→{stats.artifact_score_after:.0f})")

            except Exception as e:
                print(f"[{i}/{len(md_files)}] ERROR {md_path.name}: {e}")

        return all_stats


def print_summary(stats: List[PostProcessingStats]) -> None:
    """Print summary of post-processing results"""
    if not stats:
        return

    total_chars_removed = sum(s.chars_removed for s in stats)
    total_hyphen = sum(s.hyphenations_fixed for s in stats)
    total_pages = sum(s.page_numbers_removed for s in stats)
    total_headers = sum(s.repeated_headers_removed for s in stats)
    total_newlines = sum(s.excessive_newlines_fixed for s in stats)
    total_caps = sum(s.all_caps_removed for s in stats)

    avg_before = sum(s.artifact_score_before for s in stats) / len(stats)
    avg_after = sum(s.artifact_score_after for s in stats) / len(stats)

    docs_improved = sum(1 for s in stats if s.artifact_score_after < s.artifact_score_before)

    print("\n" + "=" * 60)
    print("POST-PROCESSING SUMMARY")
    print("=" * 60)

    print(f"\nDocuments processed: {len(stats)}")
    print(f"Documents improved:  {docs_improved} ({docs_improved/len(stats):.1%})")

    print(f"\nTotal characters removed: {total_chars_removed:,}")

    print(f"\nFixes applied:")
    print(f"  Hyphenations fixed:       {total_hyphen:,}")
    print(f"  Page numbers removed:     {total_pages:,}")
    print(f"  Repeated headers removed: {total_headers:,}")
    print(f"  Excessive newlines fixed: {total_newlines:,}")
    print(f"  All-caps noise removed:   {total_caps:,}")

    print(f"\nArtifact score improvement:")
    print(f"  Before: {avg_before:.1f}")
    print(f"  After:  {avg_after:.1f}")
    print(f"  Change: {avg_after - avg_before:+.1f}")

    print("\n" + "=" * 60 + "\n")


def main():
    parser = argparse.ArgumentParser(
        description="Post-process markdown files to clean up conversion artifacts"
    )
    parser.add_argument(
        "--input-dir", required=True,
        help="Directory containing markdown files"
    )
    parser.add_argument(
        "--output-dir",
        help="Output directory (default: input_dir_clean)"
    )
    parser.add_argument(
        "--in-place", action="store_true",
        help="Modify files in place (overwrites originals)"
    )
    parser.add_argument(
        "--report", "-r",
        help="Save detailed report to JSON file"
    )

    args = parser.parse_args()

    input_dir = Path(args.input_dir)
    output_dir = Path(args.output_dir) if args.output_dir else None

    if not input_dir.exists():
        print(f"[ERROR] Input directory not found: {input_dir}")
        return 1

    if args.in_place:
        print("[WARNING] Running in-place mode - original files will be modified!")
        response = input("Continue? [y/N] ")
        if response.lower() != 'y':
            print("Aborted.")
            return 0

    processor = MarkdownPostProcessor()
    stats = processor.process_directory(input_dir, output_dir, args.in_place)

    print_summary(stats)

    if args.report:
        report = {
            'timestamp': datetime.now().isoformat(),
            'input_dir': str(input_dir),
            'output_dir': str(output_dir) if output_dir else str(input_dir),
            'in_place': args.in_place,
            'documents': [asdict(s) for s in stats]
        }
        report_path = Path(args.report)
        report_path.write_text(json.dumps(report, indent=2), encoding='utf-8')
        print(f"[SAVED] Report: {report_path}")

    return 0


if __name__ == "__main__":
    exit(main())
