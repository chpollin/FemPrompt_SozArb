#!/usr/bin/env python3
"""
Phase 2 Pipeline: PDF-Akquise -> Markdown -> Summarisierung

Verarbeitet Include-Papers aus dem LLM-Assessment und fuehrt sie durch
die gesamte Pipeline bis zur fertigen Zusammenfassung.

Usage:
    python run_phase2_pipeline.py --input benchmark/data/llm_assessment_50_v2.csv --limit 5
"""

import argparse
import csv
import json
import os
import sys
import time
from pathlib import Path
from typing import Dict, List, Optional

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

try:
    import pandas as pd
    PANDAS_AVAILABLE = True
except ImportError:
    PANDAS_AVAILABLE = False
    print("Warning: pandas not installed. Install with: pip install pandas openpyxl")


def load_include_papers(input_file: str) -> List[Dict]:
    """Load papers with Decision=Include from assessment CSV/Excel."""
    input_path = Path(input_file)

    if input_path.suffix.lower() in ['.xlsx', '.xls']:
        if not PANDAS_AVAILABLE:
            print("Error: pandas required for Excel files")
            return []
        df = pd.read_excel(input_file)
    else:
        df = pd.read_csv(input_file)

    # Filter Include papers
    include_df = df[df['Decision'] == 'Include']

    papers = []
    for _, row in include_df.iterrows():
        papers.append({
            'id': row.get('ID', ''),
            'zotero_key': row.get('Zotero_Key', ''),
            'author_year': row.get('Author_Year', ''),
            'title': row.get('Title', ''),
            'decision': row.get('Decision', ''),
            'confidence': row.get('LLM_Confidence', 0)
        })

    return papers


def create_acquisition_input(papers: List[Dict], zotero_json_path: str, output_path: str) -> str:
    """Create input file for PDF acquisition with Zotero metadata."""

    # Load full Zotero metadata
    with open(zotero_json_path, 'r', encoding='utf-8') as f:
        zotero_data = json.load(f)

    # Build lookup by Zotero key
    zotero_lookup = {}
    for item in zotero_data:
        key = item.get('key', '')
        if key:
            zotero_lookup[key] = item

    # Match papers with Zotero metadata
    matched_items = []
    for paper in papers:
        zotero_key = paper['zotero_key']
        if zotero_key in zotero_lookup:
            item = zotero_lookup[zotero_key]
            item['_assessment'] = paper  # Add assessment info
            matched_items.append(item)
        else:
            print(f"Warning: Zotero key not found: {zotero_key}")

    # Save as JSON for PDF acquisition
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(matched_items, f, indent=2, ensure_ascii=False)

    print(f"Created acquisition input: {output_path} ({len(matched_items)} papers)")
    return output_path


def run_pdf_acquisition(input_file: str, output_dir: str) -> Dict:
    """Run PDF acquisition pipeline."""
    from analysis.getPDF_intelligent import PDFAcquisitionPipeline

    print("\n" + "="*60)
    print("PHASE 2.1: PDF Acquisition")
    print("="*60)

    pipeline = PDFAcquisitionPipeline(output_dir=output_dir)
    results = pipeline.process_bibliography(input_file)

    return results


def run_markdown_conversion(pdf_dir: str, output_dir: str) -> Dict:
    """Run PDF to Markdown conversion."""
    print("\n" + "="*60)
    print("PHASE 2.2: Markdown Conversion")
    print("="*60)

    pdf_path = Path(pdf_dir)
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    # Check for PDFs
    pdf_files = list(pdf_path.glob("*.pdf"))
    if not pdf_files:
        print(f"No PDFs found in {pdf_dir}")
        return {'converted': 0, 'failed': 0}

    print(f"Found {len(pdf_files)} PDFs to convert")

    # Import and run converter
    try:
        from docling.document_converter import DocumentConverter
        converter = DocumentConverter()

        stats = {'converted': 0, 'failed': 0}

        for i, pdf_file in enumerate(pdf_files, 1):
            print(f"[{i}/{len(pdf_files)}] Converting: {pdf_file.name}")

            try:
                result = converter.convert(str(pdf_file))
                markdown_content = result.document.export_to_markdown()

                # Add metadata header
                header = f"""---
source_file: {pdf_file.name}
conversion_date: {time.strftime('%Y-%m-%d %H:%M:%S')}
---

"""
                output_file = output_path / f"{pdf_file.stem}.md"
                output_file.write_text(header + markdown_content, encoding='utf-8')

                stats['converted'] += 1
                print(f"  -> Success: {output_file.name}")

            except Exception as e:
                print(f"  -> Failed: {e}")
                stats['failed'] += 1

            time.sleep(0.2)  # Small delay

        return stats

    except ImportError:
        print("Error: docling not installed. Install with: pip install docling")
        return {'converted': 0, 'failed': len(pdf_files)}


def run_summarization(markdown_dir: str, output_dir: str, limit: int = None) -> Dict:
    """Run LLM summarization pipeline."""
    print("\n" + "="*60)
    print("PHASE 2.3: LLM Summarization")
    print("="*60)

    from dotenv import load_dotenv
    load_dotenv()

    api_key = os.environ.get('ANTHROPIC_API_KEY')
    if not api_key:
        # Try loading from .env
        env_file = Path(__file__).parent.parent.parent / '.env'
        if env_file.exists():
            with open(env_file, 'r') as f:
                for line in f:
                    if line.startswith('ANTHROPIC_API_KEY='):
                        api_key = line.split('=', 1)[1].strip()
                        break

    if not api_key:
        print("Error: ANTHROPIC_API_KEY not found")
        return {'processed': 0, 'failed': 0}

    try:
        from anthropic import Anthropic
        client = Anthropic(api_key=api_key)
    except ImportError:
        print("Error: anthropic not installed. Install with: pip install anthropic")
        return {'processed': 0, 'failed': 0}

    markdown_path = Path(markdown_dir)
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    md_files = list(markdown_path.glob("*.md"))
    if limit:
        md_files = md_files[:limit]

    if not md_files:
        print(f"No markdown files found in {markdown_dir}")
        return {'processed': 0, 'failed': 0}

    print(f"Found {len(md_files)} markdown files to summarize")

    stats = {'processed': 0, 'failed': 0, 'total_cost': 0.0}

    for i, md_file in enumerate(md_files, 1):
        print(f"[{i}/{len(md_files)}] Summarizing: {md_file.name}")

        try:
            # Read markdown content
            content = md_file.read_text(encoding='utf-8')

            # Clean content (remove YAML frontmatter)
            if content.startswith('---'):
                parts = content.split('---', 2)
                if len(parts) > 2:
                    content = parts[2].strip()

            # Truncate if too long
            if len(content) > 15000:
                content = content[:15000] + "\n\n[... truncated ...]"

            # Generate summary
            prompt = f"""Analyze this research paper and create a structured summary.

PAPER CONTENT:
{content}

Create a summary with these sections:

## Overview
[Brief description of the paper's main topic, research question, and significance. 100-150 words]

## Main Findings
List 3-5 key findings as bullet points.

## Methodology
[Research approach, data sources, analysis methods. 50-100 words]

## Key Concepts
Define 3-5 key concepts from the paper in format:
**Concept:** Definition

## Relevance for Social Work
[How this relates to social work practice, AI literacy, or feminist perspectives. 50-100 words]

## Limitations
List 2-3 limitations mentioned in the paper.

Be precise and accurate. Total: ~400-500 words.
"""

            response = client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}]
            )

            summary = response.content[0].text

            # Calculate cost
            input_tokens = response.usage.input_tokens
            output_tokens = response.usage.output_tokens
            cost = (input_tokens / 1_000_000) * 1.00 + (output_tokens / 1_000_000) * 5.00
            stats['total_cost'] += cost

            # Save summary
            output_file = output_path / f"summary_{md_file.stem}.md"

            summary_content = f"""---
source_file: {md_file.name}
summarization_date: {time.strftime('%Y-%m-%d %H:%M:%S')}
model: claude-haiku-4-5-20251001
input_tokens: {input_tokens}
output_tokens: {output_tokens}
cost: ${cost:.4f}
---

# Summary: {md_file.stem}

{summary}
"""

            output_file.write_text(summary_content, encoding='utf-8')

            stats['processed'] += 1
            print(f"  -> Success (${cost:.4f})")

        except Exception as e:
            print(f"  -> Failed: {e}")
            stats['failed'] += 1

        # Rate limiting
        time.sleep(2)

    return stats


def main():
    parser = argparse.ArgumentParser(description='Phase 2 Pipeline: PDF -> Markdown -> Summaries')
    parser.add_argument('--input', required=True, help='LLM assessment CSV/Excel with Include papers')
    parser.add_argument('--zotero', default='corpus/zotero_export.json',
                       help='Zotero JSON with full metadata')
    parser.add_argument('--output-dir', default='benchmark/data/phase2_test',
                       help='Output directory for all pipeline outputs')
    parser.add_argument('--limit', type=int, default=5,
                       help='Limit number of papers (for testing)')
    parser.add_argument('--skip-pdf', action='store_true', help='Skip PDF acquisition')
    parser.add_argument('--skip-markdown', action='store_true', help='Skip Markdown conversion')
    parser.add_argument('--skip-summary', action='store_true', help='Skip summarization')

    args = parser.parse_args()

    # Setup directories
    output_dir = Path(args.output_dir)
    pdf_dir = output_dir / 'pdfs'
    markdown_dir = output_dir / 'markdown'
    summary_dir = output_dir / 'summaries'

    output_dir.mkdir(parents=True, exist_ok=True)

    print("="*60)
    print("PHASE 2 PIPELINE - PROTOTYPE TEST")
    print("="*60)
    print(f"Input: {args.input}")
    print(f"Output: {args.output_dir}")
    print(f"Limit: {args.limit} papers")
    print("="*60)

    # Load Include papers
    papers = load_include_papers(args.input)
    print(f"\nLoaded {len(papers)} Include papers")

    if args.limit:
        papers = papers[:args.limit]
        print(f"Limited to {len(papers)} papers for testing")

    # Show papers
    print("\nPapers to process:")
    for i, p in enumerate(papers, 1):
        print(f"  {i}. {p['author_year']} - {p['title'][:50]}...")

    # Create acquisition input
    acquisition_input = output_dir / 'acquisition_input.json'

    if not Path(args.zotero).exists():
        print(f"\nWarning: Zotero JSON not found: {args.zotero}")
        print("Creating minimal input from assessment data...")

        # Create minimal items from assessment
        items = []
        for p in papers:
            items.append({
                'key': p['zotero_key'],
                'title': p['title'],
                'creators': [{'lastName': p['author_year'].split('(')[0].strip()}],
                'date': '',
                'DOI': '',
                'url': ''
            })

        with open(acquisition_input, 'w', encoding='utf-8') as f:
            json.dump(items, f, indent=2, ensure_ascii=False)
    else:
        create_acquisition_input(papers, args.zotero, str(acquisition_input))

    # Pipeline statistics
    pipeline_stats = {
        'papers_input': len(papers),
        'pdf_acquisition': {},
        'markdown_conversion': {},
        'summarization': {}
    }

    # Phase 2.1: PDF Acquisition
    if not args.skip_pdf:
        try:
            results = run_pdf_acquisition(str(acquisition_input), str(pdf_dir))
            pipeline_stats['pdf_acquisition'] = results.get('stats', {})
        except Exception as e:
            print(f"PDF acquisition error: {e}")
            pipeline_stats['pdf_acquisition'] = {'error': str(e)}
    else:
        print("\nSkipping PDF acquisition (--skip-pdf)")

    # Phase 2.2: Markdown Conversion
    if not args.skip_markdown:
        try:
            results = run_markdown_conversion(str(pdf_dir), str(markdown_dir))
            pipeline_stats['markdown_conversion'] = results
        except Exception as e:
            print(f"Markdown conversion error: {e}")
            pipeline_stats['markdown_conversion'] = {'error': str(e)}
    else:
        print("\nSkipping Markdown conversion (--skip-markdown)")

    # Phase 2.3: Summarization
    if not args.skip_summary:
        try:
            results = run_summarization(str(markdown_dir), str(summary_dir), args.limit)
            pipeline_stats['summarization'] = results
        except Exception as e:
            print(f"Summarization error: {e}")
            pipeline_stats['summarization'] = {'error': str(e)}
    else:
        print("\nSkipping summarization (--skip-summary)")

    # Save pipeline statistics
    stats_file = output_dir / 'pipeline_stats.json'
    with open(stats_file, 'w', encoding='utf-8') as f:
        json.dump(pipeline_stats, f, indent=2, ensure_ascii=False)

    # Print summary
    print("\n" + "="*60)
    print("PIPELINE SUMMARY")
    print("="*60)
    print(f"Input papers: {pipeline_stats['papers_input']}")

    if 'total' in pipeline_stats.get('pdf_acquisition', {}):
        pdf_stats = pipeline_stats['pdf_acquisition']
        success = pdf_stats['total'] - pdf_stats.get('failed', 0)
        print(f"PDFs acquired: {success}/{pdf_stats['total']}")

    if 'converted' in pipeline_stats.get('markdown_conversion', {}):
        md_stats = pipeline_stats['markdown_conversion']
        print(f"Markdown converted: {md_stats['converted']}/{md_stats['converted'] + md_stats.get('failed', 0)}")

    if 'processed' in pipeline_stats.get('summarization', {}):
        sum_stats = pipeline_stats['summarization']
        print(f"Summaries generated: {sum_stats['processed']}/{sum_stats['processed'] + sum_stats.get('failed', 0)}")
        print(f"Summarization cost: ${sum_stats.get('total_cost', 0):.4f}")

    print(f"\nResults saved to: {args.output_dir}")
    print("="*60)


if __name__ == '__main__':
    main()
