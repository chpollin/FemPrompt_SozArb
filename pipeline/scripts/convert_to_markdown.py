#!/usr/bin/env python3
"""
Convert PDFs to Markdown using Docling

High-quality PDF to Markdown conversion with:
- Table extraction
- Figure captions
- List structures
- Heading hierarchy
- Quality metrics per document

Usage:
    python convert_to_markdown.py --input pipeline/pdfs/ --output pipeline/markdown/
    python convert_to_markdown.py --input pipeline/pdfs/ --output pipeline/markdown/ --report pipeline/conversion_report.json
"""

import argparse
import json
import sys
import time
import hashlib
from datetime import datetime
from pathlib import Path

# Fix encoding for Windows console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

try:
    from docling.document_converter import DocumentConverter
except ImportError:
    print("Error: docling not installed. Run: pip install docling")
    sys.exit(1)


def get_file_hash(filepath: Path) -> str:
    """Calculate MD5 hash of file for change detection."""
    hasher = hashlib.md5()
    with open(filepath, 'rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            hasher.update(chunk)
    return hasher.hexdigest()


def analyze_markdown_quality(markdown: str) -> dict:
    """
    Analyze structural quality of generated Markdown.

    Returns dict with quality metrics.
    """
    lines = markdown.split('\n')

    metrics = {
        'total_chars': len(markdown),
        'total_lines': len(lines),
        'total_words': len(markdown.split()),
        'headings': 0,
        'heading_levels': {},
        'tables': 0,
        'lists': 0,
        'figures': 0,
        'code_blocks': 0,
        'links': 0,
        'empty_lines': 0,
        'avg_line_length': 0
    }

    in_code_block = False
    in_table = False
    table_rows = 0
    non_empty_lines = []

    for line in lines:
        stripped = line.strip()

        # Code blocks
        if stripped.startswith('```'):
            in_code_block = not in_code_block
            if not in_code_block:
                metrics['code_blocks'] += 1
            continue

        if in_code_block:
            continue

        # Empty lines
        if not stripped:
            metrics['empty_lines'] += 1
            continue

        non_empty_lines.append(stripped)

        # Headings
        if stripped.startswith('#'):
            metrics['headings'] += 1
            level = len(stripped) - len(stripped.lstrip('#'))
            level = min(level, 6)
            metrics['heading_levels'][f'h{level}'] = metrics['heading_levels'].get(f'h{level}', 0) + 1

        # Tables
        if '|' in stripped and stripped.startswith('|'):
            if not in_table:
                in_table = True
                table_rows = 1
            else:
                table_rows += 1
        else:
            if in_table:
                if table_rows >= 2:  # At least header + separator
                    metrics['tables'] += 1
                in_table = False
                table_rows = 0

        # Lists
        if stripped.startswith(('- ', '* ', '+ ')) or (len(stripped) > 2 and stripped[0].isdigit() and stripped[1] in '.):'):
            metrics['lists'] += 1

        # Figures/Images
        if '![' in stripped:
            metrics['figures'] += 1

        # Links
        if '](' in stripped and '[' in stripped:
            metrics['links'] += stripped.count('](')

    # Close unclosed table
    if in_table and table_rows >= 2:
        metrics['tables'] += 1

    # Average line length
    if non_empty_lines:
        metrics['avg_line_length'] = round(sum(len(l) for l in non_empty_lines) / len(non_empty_lines), 1)

    return metrics


def calculate_quality_score(metrics: dict) -> tuple[int, list]:
    """
    Calculate quality score (0-100) based on metrics.

    Returns (score, issues_list)
    """
    score = 100
    issues = []

    # Minimum content check
    if metrics['total_words'] < 100:
        score -= 40
        issues.append("Very low word count (<100)")
    elif metrics['total_words'] < 500:
        score -= 20
        issues.append("Low word count (<500)")

    # Structure check - headings
    if metrics['headings'] == 0:
        score -= 15
        issues.append("No headings detected")
    elif metrics['headings'] < 3:
        score -= 5
        issues.append("Few headings (<3)")

    # Average line length (too short = fragmented, too long = missing structure)
    if metrics['avg_line_length'] < 20:
        score -= 10
        issues.append("Very short average line length (fragmented)")
    elif metrics['avg_line_length'] > 200:
        score -= 5
        issues.append("Very long average line length (missing line breaks)")

    # Empty line ratio
    if metrics['total_lines'] > 0:
        empty_ratio = metrics['empty_lines'] / metrics['total_lines']
        if empty_ratio > 0.5:
            score -= 10
            issues.append("Too many empty lines (>50%)")

    return max(0, score), issues


def convert_pdf(pdf_path: Path, converter: DocumentConverter) -> tuple[str, dict]:
    """
    Convert a single PDF to Markdown.

    Returns (markdown_content, conversion_info)
    """
    start_time = time.time()

    try:
        result = converter.convert(str(pdf_path))
        markdown = result.document.export_to_markdown()

        # Analyze quality
        metrics = analyze_markdown_quality(markdown)
        quality_score, issues = calculate_quality_score(metrics)

        duration = time.time() - start_time

        info = {
            'success': True,
            'duration_seconds': round(duration, 2),
            'metrics': metrics,
            'quality_score': quality_score,
            'quality_issues': issues
        }

        # Add metadata header
        header = f"""---
source_file: {pdf_path.name}
conversion_date: {datetime.now().isoformat()}
converter: docling
quality_score: {quality_score}
---

"""
        return header + markdown, info

    except Exception as e:
        duration = time.time() - start_time
        return None, {
            'success': False,
            'duration_seconds': round(duration, 2),
            'error': str(e)
        }


def main():
    parser = argparse.ArgumentParser(description='Convert PDFs to Markdown using Docling')
    parser.add_argument('--input', '-i', required=True, help='Input directory with PDFs')
    parser.add_argument('--output', '-o', required=True, help='Output directory for Markdown')
    parser.add_argument('--report', '-r', help='Report file path (JSON)')
    parser.add_argument('--limit', type=int, help='Limit number of files (for testing)')
    parser.add_argument('--skip-existing', action='store_true', help='Skip already converted files')
    parser.add_argument('--min-quality', type=int, default=0, help='Minimum quality score to accept (0-100)')
    args = parser.parse_args()

    input_dir = Path(args.input)
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Find PDFs
    pdf_files = sorted(input_dir.glob('*.pdf'))
    print(f"Found {len(pdf_files)} PDF files in {input_dir}")

    if not pdf_files:
        print("No PDF files found!")
        return

    if args.limit:
        pdf_files = pdf_files[:args.limit]
        print(f"Limited to {len(pdf_files)} files")

    # Initialize Docling
    print("Initializing Docling converter...")
    converter = DocumentConverter()

    # Track results
    results = {
        'timestamp': datetime.now().isoformat(),
        'input_dir': str(input_dir),
        'output_dir': str(output_dir),
        'total_files': len(pdf_files),
        'converted': 0,
        'skipped': 0,
        'failed': 0,
        'low_quality': 0,
        'files': []
    }

    print("\n" + "=" * 60)
    print("Converting PDFs to Markdown")
    print("=" * 60)

    for i, pdf_path in enumerate(pdf_files, 1):
        output_path = output_dir / f"{pdf_path.stem}.md"

        file_result = {
            'input': pdf_path.name,
            'output': output_path.name,
            'file_hash': get_file_hash(pdf_path)
        }

        print(f"\n[{i}/{len(pdf_files)}] {pdf_path.name}")

        # Skip existing
        if args.skip_existing and output_path.exists():
            print(f"  -> Skipped (already exists)")
            file_result['status'] = 'skipped'
            file_result['note'] = 'Already existed'
            results['skipped'] += 1
            results['files'].append(file_result)
            continue

        # Convert
        markdown, info = convert_pdf(pdf_path, converter)
        file_result.update(info)

        if markdown and info['success']:
            quality = info['quality_score']

            # Check quality threshold
            if quality < args.min_quality:
                print(f"  -> LOW QUALITY ({quality}/100) - below threshold {args.min_quality}")
                file_result['status'] = 'low_quality'
                results['low_quality'] += 1
            else:
                # Save markdown
                with open(output_path, 'w', encoding='utf-8') as f:
                    f.write(markdown)

                file_result['status'] = 'converted'
                results['converted'] += 1

                # Print summary
                m = info['metrics']
                print(f"  -> OK (Quality: {quality}/100, {m['total_words']} words, {m['headings']} headings, {m['tables']} tables)")

                if info['quality_issues']:
                    print(f"     Issues: {', '.join(info['quality_issues'])}")
        else:
            print(f"  -> FAILED: {info.get('error', 'Unknown error')}")
            file_result['status'] = 'failed'
            results['failed'] += 1

        results['files'].append(file_result)

    # Save report
    if args.report:
        report_path = Path(args.report)
        report_path.parent.mkdir(parents=True, exist_ok=True)
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        print(f"\nReport saved: {report_path}")

    # Print summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Total files:    {results['total_files']}")
    print(f"Converted:      {results['converted']}")
    print(f"Skipped:        {results['skipped']}")
    print(f"Failed:         {results['failed']}")
    print(f"Low quality:    {results['low_quality']}")

    if results['converted'] > 0:
        # Calculate averages
        converted_files = [f for f in results['files'] if f.get('status') == 'converted']
        if converted_files:
            avg_quality = sum(f.get('quality_score', 0) for f in converted_files) / len(converted_files)
            avg_words = sum(f.get('metrics', {}).get('total_words', 0) for f in converted_files) / len(converted_files)
            print(f"\nAverages:")
            print(f"  Quality score: {avg_quality:.1f}/100")
            print(f"  Words/doc:     {avg_words:.0f}")

    print(f"\nOutput: {output_dir}")


if __name__ == '__main__':
    main()
