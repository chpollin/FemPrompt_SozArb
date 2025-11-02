#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Write assessment tags directly to Zotero via API
Reads filled Excel and updates Zotero items with PRISMA tags
"""

import pandas as pd
import sys
from pathlib import Path
from pyzotero import zotero
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

# Fix Windows encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def write_tags_to_zotero(excel_file, library_id, library_type='group', api_key=None, dry_run=True):
    """
    Read assessment Excel and write tags to Zotero

    Args:
        excel_file: Path to filled assessment Excel
        library_id: Zotero library ID
        library_type: 'user' or 'group'
        api_key: Zotero API key (required for write access)
        dry_run: If True, only show what would be done (no actual writes)
    """
    print("="*80)
    print("EXCEL → ZOTERO TAG SYNCHRONIZATION")
    print("="*80)
    print()

    # Load Excel
    print(f"Loading assessment data from: {excel_file}")
    df = pd.read_excel(excel_file, sheet_name='Assessment')
    print(f"   Loaded {len(df)} papers")

    # Filter only assessed papers
    assessed = df[df['Decision'].notna()]
    print(f"   Papers with decisions: {len(assessed)}")
    print()

    # Statistics
    stats = assessed['Decision'].value_counts()
    print("Assessment breakdown:")
    for decision, count in stats.items():
        print(f"   {decision}: {count}")
    print()

    if not api_key:
        print("⚠️  WARNING: No API key provided!")
        print("   Running in READ-ONLY mode (dry run)")
        print("   To actually write tags, provide --api-key")
        dry_run = True
        print()

    # Connect to Zotero
    print(f"Connecting to Zotero {library_type} library: {library_id}...")
    zot = zotero.Zotero(library_id, library_type, api_key)

    # Process each assessed paper
    print()
    print("="*80)
    if dry_run:
        print("DRY RUN - Showing what WOULD be done (no actual changes)")
    else:
        print("WRITING TAGS TO ZOTERO")
    print("="*80)
    print()

    updates = []
    for idx, row in assessed.iterrows():
        zotero_key = row['Zotero_Key']
        decision = row['Decision']
        relevance = row['Relevance']
        quality = row['Quality']

        # Build tag list
        tags_to_add = []

        # Main PRISMA tag
        if decision == 'Include':
            tags_to_add.append('PRISMA_Include')
        elif decision == 'Exclude':
            tags_to_add.append('PRISMA_Exclude')
        elif decision == 'Unclear':
            tags_to_add.append('PRISMA_Unclear')

        # Optional quality tags
        if pd.notna(relevance):
            tags_to_add.append(f'Relevance_{relevance}')
        if pd.notna(quality):
            tags_to_add.append(f'Quality_{quality}')

        author_year = row['Author_Year']
        title_short = str(row['Title'])[:50]

        print(f"{idx+1:3d}. {author_year:30s} → {', '.join(tags_to_add)}")
        print(f"      {title_short}...")

        if not dry_run:
            try:
                # Fetch current item
                item = zot.item(zotero_key)

                # Get existing tags
                existing_tags = item['data'].get('tags', [])

                # Remove old assessment tags (PRISMA_*, Relevance_*, Quality_*)
                # This allows updating decisions without creating duplicates
                assessment_tag_prefixes = ['PRISMA_', 'Relevance_', 'Quality_']
                existing_tags = [
                    t for t in existing_tags
                    if not any(t['tag'].startswith(prefix) for prefix in assessment_tag_prefixes)
                ]

                # Add new tags from assessment
                for tag in tags_to_add:
                    existing_tags.append({'tag': tag})

                # Update item
                item['data']['tags'] = existing_tags
                zot.update_item(item)

                print(f"      ✅ Updated in Zotero")
                updates.append({'key': zotero_key, 'tags': tags_to_add, 'status': 'success'})

            except Exception as e:
                print(f"      ❌ Error: {e}")
                updates.append({'key': zotero_key, 'tags': tags_to_add, 'status': 'error', 'error': str(e)})

        print()

    print("="*80)
    print("SUMMARY")
    print("="*80)
    if dry_run:
        print(f"\nDRY RUN complete. No changes were made.")
        print(f"Would have updated {len(assessed)} papers with PRISMA tags.")
        print()
        print("To actually write to Zotero, run with:")
        print(f"  python {__file__} --excel {excel_file} --api-key YOUR_KEY --no-dry-run")
    else:
        successful = sum(1 for u in updates if u['status'] == 'success')
        failed = sum(1 for u in updates if u['status'] == 'error')
        print(f"\nUpdated {successful}/{len(assessed)} papers successfully")
        if failed > 0:
            print(f"Failed: {failed}")

    print()
    print("Next step: Check your Zotero library!")
    print("  - Open Zotero")
    print("  - Sync library")
    print("  - Filter by tag 'PRISMA_Include'")
    print()

    return updates

if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(
        description='Write assessment tags from Excel to Zotero via API'
    )

    parser.add_argument(
        '--excel',
        default='assessment/assessment_curated.xlsx',
        help='Filled assessment Excel file'
    )

    parser.add_argument(
        '--library-id',
        default='6080294',
        help='Zotero library ID (default: 6080294 - FemPrompt group)'
    )

    parser.add_argument(
        '--library-type',
        default='group',
        choices=['user', 'group'],
        help='Library type (default: group)'
    )

    parser.add_argument(
        '--api-key',
        default=None,
        help='Zotero API key (required for write access)'
    )

    parser.add_argument(
        '--no-dry-run',
        action='store_true',
        help='Actually write to Zotero (default is dry run)'
    )

    args = parser.parse_args()

    excel_path = Path(args.excel)
    if not excel_path.exists():
        print(f"Error: {excel_path} not found")
        sys.exit(1)

    write_tags_to_zotero(
        excel_file=excel_path,
        library_id=args.library_id,
        library_type=args.library_type,
        api_key=args.api_key,
        dry_run=not args.no_dry_run
    )
