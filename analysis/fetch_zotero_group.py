#!/usr/bin/env python3
"""
Fetch all items from Zotero Group Library via API
"""

import json
import sys
from pathlib import Path
from pyzotero import zotero

# Configuration
API_KEY = "dqwmAxRVbdHk5mhgzB1uKCT5"
LIBRARY_ID = "6080294"
LIBRARY_TYPE = "group"

def fetch_zotero_items():
    """Fetch all items from Zotero group"""
    print(f"Connecting to Zotero Group {LIBRARY_ID}...")

    try:
        # Initialize Zotero client
        zot = zotero.Zotero(LIBRARY_ID, LIBRARY_TYPE, API_KEY)

        # Fetch all items
        print("Fetching all items...")
        items = zot.everything(zot.top())

        print(f"[OK] Fetched {len(items)} items from Zotero")

        # Filter for regular items (not notes, attachments)
        regular_items = [
            item for item in items
            if item['data'].get('itemType') not in ['note', 'attachment']
        ]

        print(f"[OK] Found {len(regular_items)} regular items (excluding notes/attachments)")

        # Convert to simplified format
        simplified_items = []
        for item in regular_items:
            data = item['data']

            # Extract basic metadata
            simplified = {
                'key': item['key'],
                'version': item['version'],
                'itemType': data.get('itemType'),
                'title': data.get('title', 'Untitled'),
                'creators': data.get('creators', []),
                'date': data.get('date', ''),
                'url': data.get('url', ''),
                'DOI': data.get('DOI', ''),
                'abstractNote': data.get('abstractNote', ''),
                'tags': [tag['tag'] for tag in data.get('tags', [])],
                'collections': data.get('collections', []),
                'relations': data.get('relations', {}),
            }

            simplified_items.append(simplified)

        # Save to JSON
        output_file = Path(__file__).parent / "zotero_full_export.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(simplified_items, f, indent=2, ensure_ascii=False)

        print(f"[OK] Saved to: {output_file}")
        print(f"\nSummary:")
        print(f"  Total items: {len(simplified_items)}")

        # Count by type
        types = {}
        for item in simplified_items:
            item_type = item['itemType']
            types[item_type] = types.get(item_type, 0) + 1

        print(f"  Item types:")
        for item_type, count in sorted(types.items(), key=lambda x: -x[1]):
            print(f"    - {item_type}: {count}")

        return simplified_items

    except Exception as e:
        print(f"[ERROR] Error: {e}", file=sys.stderr)
        return None

if __name__ == "__main__":
    items = fetch_zotero_items()
    if items:
        print(f"\n[OK] Successfully exported {len(items)} items")
        sys.exit(0)
    else:
        print("\n[ERROR] Export failed")
        sys.exit(1)
