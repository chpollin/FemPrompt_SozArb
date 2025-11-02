#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Write LLM assessment tags to Zotero via API (using requests only, no pyzotero)
Adapted for assessment_llm_run5.xlsx format with 5-dimensional relevance scores
"""

import pandas as pd
import sys
import json
import time
import requests
from pathlib import Path

def write_llm_tags_to_zotero(excel_file, library_id, library_type='group', api_key=None, dry_run=True):
    """
    Read LLM assessment Excel and write tags to Zotero

    Args:
        excel_file: Path to assessment_llm_run5.xlsx
        library_id: Zotero library ID
        library_type: 'user' or 'group'
        api_key: Zotero API key (required for write access)
        dry_run: If True, only show what would be done (no actual writes)
    """
    print("="*80)
    print("LLM ASSESSMENT → ZOTERO TAG SYNCHRONIZATION")
    print("="*80)
    print()

    # Load Excel (no sheet_name parameter - uses first sheet)
    print(f"Loading LLM assessment data from: {excel_file}")
    df = pd.read_excel(excel_file)
    print(f"   Loaded {len(df)} papers")

    # Filter only assessed papers (should be all 325)
    assessed = df[df['Decision'].notna()]
    print(f"   Papers with decisions: {len(assessed)}")
    print()

    # Statistics
    stats = assessed['Decision'].value_counts()
    print("Assessment breakdown:")
    for decision, count in stats.items():
        print(f"   {decision}: {count}")
    print()

    # Relevance score statistics
    print("Average relevance scores (0-3 scale):")
    score_cols = ['Rel_AI_Komp', 'Rel_Vulnerable', 'Rel_Bias', 'Rel_Praxis', 'Rel_Prof']
    for col in score_cols:
        avg = assessed[col].mean()
        print(f"   {col}: {avg:.2f}")
    print()

    if not api_key:
        print("WARNING: No API key provided!")
        print("   Running in READ-ONLY mode (dry run)")
        print("   To actually write tags, provide --api-key")
        dry_run = True
        print()

    # Setup API connection
    base_url = f"https://api.zotero.org/{library_type}s/{library_id}"
    headers = {
        'Zotero-API-Key': api_key,
        'Content-Type': 'application/json'
    }

    # Test connection
    print(f"Connecting to Zotero {library_type} library: {library_id}...")
    try:
        response = requests.get(
            f"{base_url}/items?limit=1",
            headers=headers
        )
        if response.status_code == 200:
            total_items = response.headers.get('Total-Results', 'unknown')
            print(f"   Connected successfully. Library has {total_items} items.")
        else:
            print(f"   ERROR: Failed to connect (HTTP {response.status_code})")
            print(f"   Response: {response.text}")
            return []
    except Exception as e:
        print(f"   ERROR: Connection failed: {e}")
        return []
    print()

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
    error_count = 0
    success_count = 0

    for idx, row in assessed.iterrows():
        zotero_key = row['Zotero_Key']
        decision = row['Decision']
        author_year = row['Author_Year']
        title_short = str(row['Title'])[:50]

        # Build tag list
        tags_to_add = []

        # Main PRISMA tag
        if decision == 'Include':
            tags_to_add.append('PRISMA_Include')
        elif decision == 'Exclude':
            tags_to_add.append('PRISMA_Exclude')
        elif decision == 'Unclear':
            tags_to_add.append('PRISMA_Unclear')

        # Add 5-dimensional relevance tags (only for Include/Unclear)
        if decision in ['Include', 'Unclear']:
            # Calculate total relevance score
            total_score = sum([
                row['Rel_AI_Komp'],
                row['Rel_Vulnerable'],
                row['Rel_Bias'],
                row['Rel_Praxis'],
                row['Rel_Prof']
            ])

            # Add overall relevance tag
            if total_score >= 10:
                tags_to_add.append('Relevance_High')
            elif total_score >= 6:
                tags_to_add.append('Relevance_Medium')
            else:
                tags_to_add.append('Relevance_Low')

            # Add specific dimension tags for high scores (≥2)
            if row['Rel_AI_Komp'] >= 2:
                tags_to_add.append('Dimension_AI_Literacy')
            if row['Rel_Vulnerable'] >= 2:
                tags_to_add.append('Dimension_Vulnerable_Groups')
            if row['Rel_Bias'] >= 2:
                tags_to_add.append('Dimension_Bias')
            if row['Rel_Praxis'] >= 2:
                tags_to_add.append('Dimension_Practice')
            if row['Rel_Prof'] >= 2:
                tags_to_add.append('Dimension_Social_Work')

        # Add exclusion reason tag if applicable
        if decision == 'Exclude' and pd.notna(row.get('Exclusion_Reason')):
            exclusion = row['Exclusion_Reason'].replace(' ', '_')
            tags_to_add.append(f'Exclusion_{exclusion}')

        print(f"{idx+1:3d}. {author_year:30s} → {decision}")
        print(f"      Tags: {', '.join(tags_to_add)}")
        print(f"      Title: {title_short}...")

        if not dry_run:
            try:
                # Fetch current item
                item_url = f"{base_url}/items/{zotero_key}"
                response = requests.get(item_url, headers=headers)

                if response.status_code != 200:
                    raise Exception(f"HTTP {response.status_code}: {response.text}")

                item = response.json()

                # Get existing tags
                existing_tags = item['data'].get('tags', [])

                # Remove old assessment tags
                assessment_tag_prefixes = [
                    'PRISMA_', 'Relevance_', 'Quality_',
                    'Dimension_', 'Exclusion_'
                ]
                existing_tags = [
                    t for t in existing_tags
                    if not any(t['tag'].startswith(prefix) for prefix in assessment_tag_prefixes)
                ]

                # Add new tags from LLM assessment
                for tag in tags_to_add:
                    existing_tags.append({'tag': tag})

                # Update item
                item['data']['tags'] = existing_tags

                # Send update
                update_response = requests.patch(
                    item_url,
                    headers={
                        **headers,
                        'If-Unmodified-Since-Version': str(item['version'])
                    },
                    json=item['data']
                )

                if update_response.status_code in [200, 204]:
                    print(f"      ✓ Updated in Zotero")
                    success_count += 1
                    updates.append({
                        'key': zotero_key,
                        'tags': tags_to_add,
                        'status': 'success'
                    })
                else:
                    raise Exception(f"Update failed: HTTP {update_response.status_code}")

                # Rate limiting: 1 request per second
                time.sleep(1)

            except Exception as e:
                print(f"      ✗ Error: {e}")
                error_count += 1
                updates.append({
                    'key': zotero_key,
                    'tags': tags_to_add,
                    'status': 'error',
                    'error': str(e)
                })

        print()

    print("="*80)
    print("SUMMARY")
    print("="*80)
    if dry_run:
        print(f"\nDRY RUN complete. No changes were made.")
        print(f"Would have updated {len(assessed)} papers with PRISMA tags.")
        print()
        print("Tags that would be written:")
        print("  - PRISMA_Include / PRISMA_Exclude / PRISMA_Unclear")
        print("  - Relevance_High / Medium / Low (based on total score)")
        print("  - Dimension_* tags for high-scoring dimensions (≥2)")
        print("  - Exclusion_* tags for excluded papers")
        print()
        print("To actually write to Zotero, run with:")
        print(f"  python {sys.argv[0]} --no-dry-run --api-key YOUR_KEY")
    else:
        print(f"\nUpdated {success_count}/{len(assessed)} papers successfully")
        if error_count > 0:
            print(f"Failed: {error_count}")
            print("\nFailed items:")
            for u in updates:
                if u['status'] == 'error':
                    print(f"  - {u['key']}: {u['error']}")

    print()
    print("Next steps:")
    print("  1. Open Zotero: https://www.zotero.org/groups/6284300/socialai-litreview-curated")
    print("  2. Sync library (green sync button)")
    print("  3. Filter by tag 'PRISMA_Include' (208 papers expected)")
    print("  4. Review dimension tags (e.g., 'Dimension_Bias')")
    print()

    return updates

if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(
        description='Write LLM assessment tags from Excel to Zotero via API'
    )

    parser.add_argument(
        '--excel',
        default='assessment-llm/output/assessment_llm_run5.xlsx',
        help='LLM assessment Excel file (default: assessment_llm_run5.xlsx)'
    )

    parser.add_argument(
        '--library-id',
        default='6284300',
        help='Zotero library ID (default: 6284300 - socialai-litreview-curated)'
    )

    parser.add_argument(
        '--library-type',
        default='group',
        choices=['user', 'group'],
        help='Library type (default: group)'
    )

    parser.add_argument(
        '--api-key',
        required=True,
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

    write_llm_tags_to_zotero(
        excel_file=excel_path,
        library_id=args.library_id,
        library_type=args.library_type,
        api_key=args.api_key,
        dry_run=not args.no_dry_run
    )
