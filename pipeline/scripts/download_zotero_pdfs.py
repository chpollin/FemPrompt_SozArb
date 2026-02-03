#!/usr/bin/env python3
"""
Download all PDFs from Zotero Group Library

Downloads PDF attachments from Zotero and creates a report of
which papers have PDFs and which don't.

Usage:
    python download_zotero_pdfs.py --output pipeline/pdfs/
"""

import argparse
import json
import re
import sys
import time
from pathlib import Path
from datetime import datetime

# Import shared utilities
from utils import setup_windows_encoding, load_env_file, get_env_var

# Fix encoding for Windows console
setup_windows_encoding()

try:
    from pyzotero import zotero
except ImportError:
    print("Error: pyzotero not installed. Run: pip install pyzotero")
    sys.exit(1)


def sanitize_filename(name: str, max_length: int = 80) -> str:
    """Create safe filename from title."""
    # Remove/replace problematic characters
    name = re.sub(r'[<>:"/\\|?*]', '', name)
    name = re.sub(r'\s+', '_', name)
    name = re.sub(r'_+', '_', name)
    name = name.strip('_.')

    if len(name) > max_length:
        name = name[:max_length].rsplit('_', 1)[0]

    return name


def extract_author_year(item: dict) -> str:
    """Extract Author_Year string from item."""
    creators = item['data'].get('creators', [])
    first_author = ''

    for creator in creators:
        if creator.get('creatorType') == 'author':
            first_author = creator.get('lastName', creator.get('name', ''))
            break

    if not first_author and creators:
        first_author = creators[0].get('lastName', creators[0].get('name', 'Unknown'))

    date = item['data'].get('date', '')
    year = ''
    if date:
        match = re.search(r'(19|20)\d{2}', str(date))
        if match:
            year = match.group(0)

    if first_author and year:
        return f"{first_author}_{year}"
    elif first_author:
        return first_author
    else:
        return "Unknown"


def main():
    parser = argparse.ArgumentParser(description='Download PDFs from Zotero Group')
    parser.add_argument('--output', '-o', default='pipeline/pdfs',
                        help='Output directory for PDFs')
    parser.add_argument('--report', '-r', default='pipeline/pdf_acquisition_report.json',
                        help='Report file path')
    parser.add_argument('--limit', type=int, help='Limit number of items (for testing)')
    parser.add_argument('--delay', type=float, default=0.5,
                        help='Delay between downloads (seconds)')
    args = parser.parse_args()

    # Load credentials from .env
    env_path = Path(__file__).parent.parent.parent / '.env'
    load_env_file(env_path)

    api_key = get_env_var('ZOTERO_API_KEY', required=True)
    library_id = get_env_var('ZOTERO_LIBRARY_ID', required=True)

    # Setup output directory
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Connect to Zotero
    print(f"Connecting to Zotero Group {library_id}...")
    zot = zotero.Zotero(library_id, 'group', api_key)

    # Get all top-level items
    print("Fetching items...")
    items = zot.everything(zot.top())
    print(f"Found {len(items)} items")

    if args.limit:
        items = items[:args.limit]
        print(f"Limited to {len(items)} items")

    # Track results
    results = {
        'timestamp': datetime.now().isoformat(),
        'total_items': len(items),
        'with_pdf': 0,
        'without_pdf': 0,
        'download_errors': 0,
        'items': []
    }

    # Process each item
    print("\n" + "=" * 60)
    print("Downloading PDFs...")
    print("=" * 60)

    for i, item in enumerate(items, 1):
        item_key = item['key']
        title = item['data'].get('title', 'Untitled')
        author_year = extract_author_year(item)

        # Create filename
        title_short = sanitize_filename(title, max_length=50)
        filename = f"{author_year}_{title_short}.pdf"
        filepath = output_dir / filename

        item_result = {
            'key': item_key,
            'title': title,
            'author_year': author_year,
            'filename': filename,
            'has_pdf': False,
            'downloaded': False,
            'error': None
        }

        print(f"[{i}/{len(items)}] {author_year}: {title[:50]}...")

        # Check if already exists
        if filepath.exists():
            print(f"  -> Already exists, skipping")
            item_result['has_pdf'] = True
            item_result['downloaded'] = False
            item_result['note'] = 'Already existed'
            results['with_pdf'] += 1
            results['items'].append(item_result)
            continue

        # Get children (attachments)
        try:
            children = zot.children(item_key)
        except Exception as e:
            print(f"  -> Error fetching attachments: {e}")
            item_result['error'] = str(e)
            results['download_errors'] += 1
            results['items'].append(item_result)
            continue

        # Find PDF attachment
        pdf_found = False
        for child in children:
            if child['data'].get('contentType') == 'application/pdf':
                attachment_key = child['key']

                try:
                    # Download PDF
                    pdf_content = zot.file(attachment_key)

                    with open(filepath, 'wb') as f:
                        f.write(pdf_content)

                    print(f"  -> Downloaded: {filename}")
                    item_result['has_pdf'] = True
                    item_result['downloaded'] = True
                    results['with_pdf'] += 1
                    pdf_found = True
                    break

                except Exception as e:
                    print(f"  -> Download error: {e}")
                    item_result['error'] = str(e)
                    results['download_errors'] += 1

        if not pdf_found and not item_result.get('error'):
            print(f"  -> No PDF attachment")
            item_result['has_pdf'] = False
            results['without_pdf'] += 1

        results['items'].append(item_result)

        # Rate limiting
        time.sleep(args.delay)

    # Save report
    report_path = Path(args.report)
    report_path.parent.mkdir(parents=True, exist_ok=True)

    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    # Print summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Total items:      {results['total_items']}")
    print(f"With PDF:         {results['with_pdf']}")
    print(f"Without PDF:      {results['without_pdf']}")
    print(f"Download errors:  {results['download_errors']}")
    print(f"\nPDFs saved to:    {output_dir}")
    print(f"Report saved to:  {report_path}")

    # List items without PDF
    no_pdf = [r for r in results['items'] if not r['has_pdf']]
    if no_pdf:
        print(f"\n--- Items without PDF ({len(no_pdf)}) ---")
        for r in no_pdf[:20]:
            print(f"  - {r['author_year']}: {r['title'][:60]}")
        if len(no_pdf) > 20:
            print(f"  ... and {len(no_pdf) - 20} more")


if __name__ == '__main__':
    main()
