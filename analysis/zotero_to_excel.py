#!/usr/bin/env python3
"""
Zotero to Excel Converter with Direct API Integration
Fetches bibliographic data directly from Zotero API and creates Excel for PRISMA assessment
"""

import os
import pandas as pd
from pathlib import Path
import logging
from typing import Dict, List, Optional
import argparse
from pyzotero import zotero

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class ZoteroToExcelConverter:
    """Fetch data from Zotero API and convert to Excel for assessment workflow"""

    def __init__(self, library_id: str, library_type: str = 'group', api_key: str = None):
        """
        Initialize converter with Zotero API credentials

        Args:
            library_id: Zotero library ID (user ID or group ID)
            library_type: 'user' or 'group' (default: 'group')
            api_key: Zotero API key (optional for public groups)
        """
        self.library_id = library_id
        self.library_type = library_type
        self.api_key = api_key

        # Initialize Zotero client
        logger.info(f"Connecting to Zotero {library_type} library: {library_id}")
        self.zot = zotero.Zotero(library_id, library_type, api_key)

        self.items = []

    def fetch_all_items(self) -> List[Dict]:
        """Fetch all items from Zotero library"""
        logger.info("Fetching items from Zotero API...")

        try:
            # Fetch all items (automatically handles pagination)
            all_items = self.zot.everything(self.zot.items())
            logger.info(f"✓ Fetched {len(all_items)} items from Zotero")

            # Filter for actual publications (not notes, attachments, etc.)
            valid_types = ['journalArticle', 'book', 'bookSection', 'conferencePaper',
                          'report', 'thesis', 'webpage', 'document']

            items = []
            for item in all_items:
                if item.get('data', {}).get('itemType') in valid_types:
                    items.append(item['data'])

            logger.info(f"✓ Filtered to {len(items)} valid publications")
            self.items = items
            return items

        except Exception as e:
            logger.error(f"✗ Failed to fetch items from Zotero: {e}")
            raise

    def extract_authors(self, item: Dict) -> str:
        """Extract author names from Zotero item"""
        creators = item.get('creators', [])
        if not creators:
            return ''

        author_names = []
        for creator in creators:
            if creator.get('creatorType') == 'author':
                last_name = creator.get('lastName', '')
                first_name = creator.get('firstName', '')
                if last_name and first_name:
                    author_names.append(f"{last_name}, {first_name[0]}.")
                elif last_name:
                    author_names.append(last_name)
                elif creator.get('name'):
                    author_names.append(creator.get('name'))

        return '; '.join(author_names)

    def create_excel(self, output_file: str) -> pd.DataFrame:
        """
        Convert Zotero items to Excel format for assessment

        Returns:
            DataFrame with assessment structure
        """
        if not self.items:
            logger.warning("No items to convert. Fetch items first.")
            return None

        logger.info(f"Converting {len(self.items)} items to Excel format...")

        # Prepare data for Excel
        excel_data = []

        for idx, item in enumerate(self.items, 1):
            # Extract key metadata
            row = {
                'ID': idx,
                'Zotero_Key': item.get('key', ''),
                'Author_Year': f"{self.extract_authors(item).split(';')[0].split(',')[0] if self.extract_authors(item) else 'Unknown'} ({item.get('date', 'n.d.')[:4]})",
                'Title': item.get('title', ''),
                'DOI': item.get('DOI', ''),
                'Item_Type': item.get('itemType', ''),
                'Abstract': item.get('abstractNote', ''),
                'URL': item.get('url', ''),
                'Tags': '; '.join([tag.get('tag', '') for tag in item.get('tags', [])]),

                # Assessment fields (to be filled by human)
                'Relevance': '',  # Low/Medium/High
                'Quality': '',    # Low/Medium/High
                'Decision': '',   # Include/Exclude/Unclear
                'Notes': '',      # Free text

                # Automatically computed (formula in Excel)
                'Zotero_Tags': ''  # Will be formula: =IF(Decision="Include", "PRISMA_Include", IF(Decision="Exclude", "PRISMA_Exclude", "PRISMA_Unclear"))
            }

            excel_data.append(row)

        # Create DataFrame
        df = pd.DataFrame(excel_data)

        # Save to Excel with formatting
        logger.info(f"Writing Excel file: {output_file}")

        with pd.ExcelWriter(output_file, engine='xlsxwriter') as writer:
            df.to_excel(writer, sheet_name='Assessment', index=False)

            # Get workbook and worksheet
            workbook = writer.book
            worksheet = writer.sheets['Assessment']

            # Define formats
            header_format = workbook.add_format({
                'bold': True,
                'bg_color': '#4472C4',
                'font_color': 'white',
                'border': 1
            })

            assessment_format = workbook.add_format({
                'bg_color': '#FFF2CC',
                'border': 1
            })

            # Set column widths and formats
            column_widths = {
                'A': 5,   # ID
                'B': 12,  # Zotero_Key
                'C': 20,  # Author_Year
                'D': 60,  # Title
                'E': 15,  # DOI
                'F': 12,  # Item_Type
                'G': 60,  # Abstract
                'H': 30,  # URL
                'I': 20,  # Tags
                'J': 12,  # Relevance (assessment)
                'K': 12,  # Quality (assessment)
                'L': 12,  # Decision (assessment)
                'M': 40,  # Notes (assessment)
                'N': 18   # Zotero_Tags
            }

            for col, width in column_widths.items():
                worksheet.set_column(f'{col}:{col}', width)

            # Apply header format
            for col_num, value in enumerate(df.columns.values):
                worksheet.write(0, col_num, value, header_format)

            # Highlight assessment columns
            assessment_cols = ['J', 'K', 'L', 'M']  # Relevance, Quality, Decision, Notes
            for col in assessment_cols:
                col_idx = ord(col) - ord('A')
                for row_idx in range(1, len(df) + 1):
                    worksheet.write(row_idx, col_idx, df.iloc[row_idx-1, col_idx], assessment_format)

            # Add formula for Zotero_Tags column (column N, index 13)
            for row_idx in range(1, len(df) + 1):
                formula = f'=IF(L{row_idx+1}="Include", "PRISMA_Include", IF(L{row_idx+1}="Exclude", "PRISMA_Exclude", IF(L{row_idx+1}="Unclear", "PRISMA_Unclear", "")))'
                worksheet.write_formula(row_idx, 13, formula)

            # Freeze header row and first 4 columns
            worksheet.freeze_panes(1, 4)

            # Add data validation for assessment fields
            worksheet.data_validation(f'J2:J{len(df)+1}', {
                'validate': 'list',
                'source': ['Low', 'Medium', 'High'],
                'input_title': 'Relevance',
                'input_message': 'Select: Low, Medium, or High relevance to research question',
                'error_title': 'Invalid Input',
                'error_message': 'Must select from dropdown'
            })

            worksheet.data_validation(f'K2:K{len(df)+1}', {
                'validate': 'list',
                'source': ['Low', 'Medium', 'High'],
                'input_title': 'Quality Assessment',
                'input_message': 'Select: Low, Medium, or High quality (peer-review, methodology)',
                'error_title': 'Invalid Input',
                'error_message': 'Must select from dropdown'
            })

            worksheet.data_validation(f'L2:L{len(df)+1}', {
                'validate': 'list',
                'source': ['Include', 'Exclude', 'Unclear'],
                'input_title': 'Decision',
                'input_message': 'Select: Include, Exclude, or Unclear',
                'error_title': 'Invalid Input',
                'error_message': 'Must select from dropdown'
            })

        logger.info(f"✓ Excel file created successfully: {output_file}")
        logger.info(f"  - {len(df)} papers ready for assessment")

        return df


def main():
    """Main function with command-line interface"""
    parser = argparse.ArgumentParser(
        description='Fetch bibliographic data from Zotero API and create Excel for PRISMA assessment'
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
        help='Library type: user or group (default: group)'
    )

    parser.add_argument(
        '--api-key',
        default=None,
        help='Zotero API key (optional for public groups)'
    )

    parser.add_argument(
        '-o', '--output',
        default='analysis/assessment.xlsx',
        help='Output Excel file (default: analysis/assessment.xlsx)'
    )

    args = parser.parse_args()

    # Create output directory if needed
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    try:
        # Initialize converter
        converter = ZoteroToExcelConverter(
            library_id=args.library_id,
            library_type=args.library_type,
            api_key=args.api_key
        )

        # Fetch items from Zotero
        items = converter.fetch_all_items()

        if not items:
            logger.warning("No items found in Zotero library")
            return

        # Create Excel file
        df = converter.create_excel(args.output)

        print("\n" + "="*80)
        print("SUCCESS: Excel assessment file created")
        print("="*80)
        print(f"\nFile: {args.output}")
        print(f"Papers: {len(items)}")
        print(f"\nNext steps:")
        print(f"1. Open {args.output} in Excel")
        print(f"2. Fill out assessment fields (Relevance, Quality, Decision, Notes)")
        print(f"3. Use excel_to_ris.py to merge assessments back to RIS format")
        print(f"4. Re-import enriched RIS into Zotero")

    except Exception as e:
        logger.error(f"✗ Error: {e}")
        raise


if __name__ == '__main__':
    main()