#!/usr/bin/env python3
"""
Markdown Conversion Quality Validator

Validates the quality of PDF-to-Markdown conversions by detecting:
- Encoding corruption (GLYPH<>, unicode errors)
- Excessive special characters
- Low text-to-noise ratio
- Abnormally large file sizes

Usage:
    python validate_markdown_quality.py --input-dir analysis/markdown_papers_socialai/
    python validate_markdown_quality.py --input-dir analysis/markdown_papers_socialai/ --output-csv validation_report.csv
"""

import argparse
import re
import json
from pathlib import Path
from typing import Dict, List, Tuple
from dataclasses import dataclass, asdict
from collections import Counter

@dataclass
class ValidationMetrics:
    """Quality metrics for a markdown file"""
    filename: str
    file_size_chars: int
    file_size_mb: float
    glyph_count: int
    unicode_error_count: int
    special_char_ratio: float
    text_to_noise_ratio: float
    readable_words_count: int
    status: str  # "PASS", "WARNING", "FAIL"
    issues: List[str]

class MarkdownValidator:
    """Validates markdown conversion quality"""

    # Thresholds for quality assessment
    MAX_GLYPH_COUNT = 50  # Max GLYPH<> placeholders
    MAX_UNICODE_ERROR_RATIO = 0.05  # Max 5% unicode errors
    MIN_TEXT_NOISE_RATIO = 0.3  # Min 30% readable text
    MAX_FILE_SIZE_MB = 2.0  # Abnormally large files (>2MB markdown)

    def __init__(self):
        self.glyph_pattern = re.compile(r'GLYPH<\d+>')
        self.unicode_error_pattern = re.compile(r'[✗✂✁☎✄✝✆✞✠✟☛✡☞✌✎✒✓✔✖✘✙✚✛✜✢✣✤✥✦★✧✩✫✪✭✬✯✮✱✰✲✴✳✶✵✸✷✹✺✼✻✽✾✿❀]+')
        self.special_char_pattern = re.compile(r'[➀➁➂➃➄➅➆➇➈➉➊➌➋➎➍➏➐➑➒➔➵➙➣↔➶➟➴➓➢➺➝➛➷➩➬➫➡➘➤→➼➱➹➠➸➻➾➚➪➮➯]+')
        self.word_pattern = re.compile(r'\b[a-zA-Z]{3,}\b')

    def validate_file(self, filepath: Path) -> ValidationMetrics:
        """Validate a single markdown file"""
        try:
            content = filepath.read_text(encoding='utf-8', errors='replace')
        except Exception as e:
            return ValidationMetrics(
                filename=filepath.name,
                file_size_chars=0,
                file_size_mb=0.0,
                glyph_count=0,
                unicode_error_count=0,
                special_char_ratio=0.0,
                text_to_noise_ratio=0.0,
                readable_words_count=0,
                status="FAIL",
                issues=[f"Cannot read file: {e}"]
            )

        # Calculate metrics
        file_size_chars = len(content)
        file_size_mb = file_size_chars / (1024 * 1024)

        glyph_matches = self.glyph_pattern.findall(content)
        glyph_count = len(glyph_matches)

        unicode_error_matches = self.unicode_error_pattern.findall(content)
        unicode_error_count = sum(len(m) for m in unicode_error_matches)
        unicode_error_ratio = unicode_error_count / max(file_size_chars, 1)

        special_char_matches = self.special_char_pattern.findall(content)
        special_char_count = sum(len(m) for m in special_char_matches)
        special_char_ratio = special_char_count / max(file_size_chars, 1)

        readable_words = self.word_pattern.findall(content)
        readable_words_count = len(readable_words)
        readable_chars = sum(len(word) for word in readable_words)
        text_to_noise_ratio = readable_chars / max(file_size_chars, 1)

        # Determine status and issues
        issues = []

        if glyph_count > self.MAX_GLYPH_COUNT:
            issues.append(f"High GLYPH count: {glyph_count} (threshold: {self.MAX_GLYPH_COUNT})")

        if unicode_error_ratio > self.MAX_UNICODE_ERROR_RATIO:
            issues.append(f"High unicode error ratio: {unicode_error_ratio:.2%} (threshold: {self.MAX_UNICODE_ERROR_RATIO:.0%})")

        if text_to_noise_ratio < self.MIN_TEXT_NOISE_RATIO:
            issues.append(f"Low readable text ratio: {text_to_noise_ratio:.2%} (threshold: {self.MIN_TEXT_NOISE_RATIO:.0%})")

        if file_size_mb > self.MAX_FILE_SIZE_MB:
            issues.append(f"Abnormally large file: {file_size_mb:.2f}MB (threshold: {self.MAX_FILE_SIZE_MB}MB)")

        # Determine overall status
        if not issues:
            status = "PASS"
        elif text_to_noise_ratio < 0.1 or glyph_count > 200:
            status = "FAIL"
        else:
            status = "WARNING"

        return ValidationMetrics(
            filename=filepath.name,
            file_size_chars=file_size_chars,
            file_size_mb=file_size_mb,
            glyph_count=glyph_count,
            unicode_error_count=unicode_error_count,
            special_char_ratio=special_char_ratio,
            text_to_noise_ratio=text_to_noise_ratio,
            readable_words_count=readable_words_count,
            status=status,
            issues=issues
        )

    def validate_directory(self, directory: Path) -> List[ValidationMetrics]:
        """Validate all markdown files in a directory"""
        results = []

        markdown_files = sorted(directory.glob("*.md"))

        if not markdown_files:
            print(f"[WARNING] No markdown files found in {directory}")
            return results

        print(f"[*] Validating {len(markdown_files)} markdown files...\n")

        for filepath in markdown_files:
            metrics = self.validate_file(filepath)
            results.append(metrics)

        return results

    def print_summary(self, results: List[ValidationMetrics]) -> None:
        """Print validation summary"""
        if not results:
            return

        status_counts = Counter(r.status for r in results)

        print("\n" + "="*80)
        print("VALIDATION SUMMARY")
        print("="*80)

        print(f"\n[PASS]    {status_counts['PASS']:3d} files")
        print(f"[WARNING] {status_counts['WARNING']:3d} files")
        print(f"[FAIL]    {status_counts['FAIL']:3d} files")
        print(f"[TOTAL]   {len(results):3d} files")

        # Show failed files
        failed = [r for r in results if r.status == "FAIL"]
        if failed:
            print("\n" + "="*80)
            print("FAILED FILES (Conversion Quality Issues)")
            print("="*80)
            for r in failed:
                print(f"\n[FILE] {r.filename}")
                print(f"   Size: {r.file_size_mb:.2f}MB ({r.file_size_chars:,} chars)")
                print(f"   Text Ratio: {r.text_to_noise_ratio:.1%}")
                print(f"   GLYPH Count: {r.glyph_count}")
                print(f"   Unicode Errors: {r.unicode_error_count}")
                for issue in r.issues:
                    print(f"   [!] {issue}")

        # Show warnings
        warnings = [r for r in results if r.status == "WARNING"]
        if warnings:
            print("\n" + "="*80)
            print("WARNING FILES (Minor Issues)")
            print("="*80)
            for r in warnings:
                print(f"\n[FILE] {r.filename}")
                print(f"   Size: {r.file_size_mb:.2f}MB")
                print(f"   Text Ratio: {r.text_to_noise_ratio:.1%}")
                for issue in r.issues:
                    print(f"   [!] {issue}")

        print("\n" + "="*80 + "\n")

    def save_report(self, results: List[ValidationMetrics], output_file: Path) -> None:
        """Save validation report to JSON"""
        report = {
            "summary": {
                "total_files": len(results),
                "pass": sum(1 for r in results if r.status == "PASS"),
                "warning": sum(1 for r in results if r.status == "WARNING"),
                "fail": sum(1 for r in results if r.status == "FAIL")
            },
            "files": [asdict(r) for r in results]
        }

        output_file.write_text(json.dumps(report, indent=2), encoding='utf-8')
        print(f"[SAVED] Report saved to: {output_file}")

    def save_csv(self, results: List[ValidationMetrics], output_file: Path) -> None:
        """Save validation report to CSV"""
        import csv

        with output_file.open('w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([
                "Filename", "Status", "Size (MB)", "Text Ratio",
                "GLYPH Count", "Unicode Errors", "Issues"
            ])

            for r in results:
                writer.writerow([
                    r.filename,
                    r.status,
                    f"{r.file_size_mb:.2f}",
                    f"{r.text_to_noise_ratio:.1%}",
                    r.glyph_count,
                    r.unicode_error_count,
                    "; ".join(r.issues)
                ])

        print(f"[SAVED] CSV report saved to: {output_file}")

def main():
    parser = argparse.ArgumentParser(
        description="Validate markdown conversion quality"
    )
    parser.add_argument(
        "--input-dir",
        required=True,
        help="Directory containing markdown files"
    )
    parser.add_argument(
        "--output-json",
        help="Output JSON report file (optional)"
    )
    parser.add_argument(
        "--output-csv",
        help="Output CSV report file (optional)"
    )

    args = parser.parse_args()

    input_dir = Path(args.input_dir)

    if not input_dir.exists():
        print(f"[ERROR] Directory not found: {input_dir}")
        return 1

    validator = MarkdownValidator()
    results = validator.validate_directory(input_dir)

    validator.print_summary(results)

    if args.output_json:
        validator.save_report(results, Path(args.output_json))

    if args.output_csv:
        validator.save_csv(results, Path(args.output_csv))

    # Exit code: 0 if all passed, 1 if any warnings, 2 if any failures
    if any(r.status == "FAIL" for r in results):
        return 2
    elif any(r.status == "WARNING" for r in results):
        return 1
    else:
        return 0

if __name__ == "__main__":
    exit(main())
