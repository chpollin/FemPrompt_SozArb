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
        self.collections = {}  # Store collection mappings

    def fetch_collections(self) -> Dict[str, str]:
        """Fetch all collections and create ID -> Name mapping"""
        logger.info("Fetching collections from Zotero...")
        try:
            all_collections = self.zot.collections()
            collection_map = {}
            for coll in all_collections:
                coll_id = coll['key']
                coll_name = coll['data']['name']
                collection_map[coll_id] = coll_name
            logger.info(f"✓ Fetched {len(collection_map)} collections")
            self.collections = collection_map
            return collection_map
        except Exception as e:
            logger.warning(f"Could not fetch collections: {e}")
            return {}

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

    def extract_source_tool(self, collection_names: List[str]) -> str:
        """Extract Deep Research tool from collection names"""
        if not collection_names:
            return 'Manual'

        # Check collections for tool indicators
        for coll in collection_names:
            coll_lower = coll.lower()
            if 'claude' in coll_lower:
                return 'Claude'
            elif 'gemini' in coll_lower:
                return 'Gemini'
            elif 'openai' in coll_lower or 'gpt' in coll_lower:
                return 'ChatGPT'
            elif 'perplexity' in coll_lower:
                return 'Perplexity'

        return 'Manual'

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

    def normalize_year(self, date_str: str) -> str:
        """Extract and normalize publication year from various date formats"""
        import re
        if not date_str:
            return ''

        # Try to extract 4-digit year
        year_match = re.search(r'\b(19|20)\d{2}\b', date_str)
        if year_match:
            return year_match.group(0)

        # Handle partial formats like "09/2" -> return empty (will trigger warning)
        return ''

    def normalize_language(self, lang_str: str) -> str:
        """Normalize language codes to consistent format"""
        if not lang_str:
            return ''

        lang_lower = lang_str.lower().strip()

        # Normalize to 2-letter codes
        lang_map = {
            'eng': 'en',
            'english': 'en',
            'ger': 'de',
            'german': 'de',
            'deu': 'de'
        }

        return lang_map.get(lang_lower, lang_lower)

    def normalize_text(self, text: str) -> str:
        """Normalize whitespace in text: remove extra spaces, newlines, tabs"""
        import re
        if not text:
            return ''
        # Replace multiple whitespace (including newlines, tabs) with single space
        normalized = re.sub(r'\s+', ' ', text)
        # Strip leading/trailing whitespace
        return normalized.strip()

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
        filtered_count = 0

        for idx, item in enumerate(self.items, 1):
            # Extract and normalize publication year
            date_str = item.get('date', '')
            pub_year = self.normalize_year(date_str)

            # Extract and normalize language
            language = self.normalize_language(item.get('language', ''))

            # Extract collections (resolve IDs to names)
            collection_ids = item.get('collections', [])
            collection_names = [self.collections.get(coll_id, coll_id) for coll_id in collection_ids]

            # Extract source tool from collections
            source_tool = self.extract_source_tool(collection_names)

            # FILTER: Only include papers from _DEEPRESEARCH collections (with recognized tool)
            # DISABLED for SocialAI-LitReview-Curated (no collections, all papers should be included)
            # if source_tool == 'Manual':
            #     filtered_count += 1
            #     continue  # Skip papers without Deep Research tool

            # Extract key metadata
            row = {
                'ID': idx,
                'Zotero_Key': item.get('key', ''),
                'Author_Year': f"{self.extract_authors(item).split(';')[0].split(',')[0] if self.extract_authors(item) else 'Unknown'} ({pub_year})",
                'Title': item.get('title', ''),
                'DOI': item.get('DOI', ''),
                'Item_Type': item.get('itemType', ''),
                'Publication_Year': pub_year,
                'Language': language,
                'Source_Tool': source_tool,  # Deep Research tool that found this paper
                'Abstract': self.normalize_text(item.get('abstractNote', '')),
                'URL': item.get('url', ''),
                'Original_Tags': '; '.join([tag.get('tag', '') for tag in item.get('tags', [])]),

                # PRISMA Assessment fields (to be filled by human)
                'Decision': '',           # Include/Exclude/Unclear
                'Exclusion_Reason': '',   # Only if Decision=Exclude

                # Relevance dimensions (5 separate columns with 0-3 scoring)
                'Rel_AI_Komp': '',        # AI/LLM-Kompetenzen
                'Rel_Vulnerable': '',     # Vulnerable Gruppen & Digital Equity
                'Rel_Bias': '',           # Bias & Diskriminierung
                'Rel_Praxis': '',         # Praktische Implementation
                'Rel_Prof': '',           # Professioneller Kontext

                'Notes': '',              # Free text for rationale

                # Automatically computed (formulas in Excel)
                'Auto_Flags': '',         # Automatic quality checks
                'Zotero_Tags': ''         # PRISMA tags for Zotero import
            }

            excel_data.append(row)

        # Log filtering results
        if filtered_count > 0:
            logger.info(f"  - Filtered out {filtered_count} papers without Deep Research tool")
            logger.info(f"  - Included {len(excel_data)} papers from Deep Research collections")

        # Create DataFrame
        df = pd.DataFrame(excel_data)

        # Renumber IDs sequentially after filtering
        df['ID'] = range(1, len(df) + 1)

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
                'F': 15,  # Item_Type
                'G': 8,   # Publication_Year
                'H': 10,  # Language
                'I': 15,  # Source_Tool
                'J': 60,  # Abstract
                'K': 30,  # URL
                'L': 20,  # Original_Tags
                'M': 12,  # Decision
                'N': 25,  # Exclusion_Reason
                'O': 10,  # Rel_AI_Komp
                'P': 10,  # Rel_Vulnerable
                'Q': 10,  # Rel_Bias
                'R': 10,  # Rel_Praxis
                'S': 10,  # Rel_Prof
                'T': 40,  # Notes
                'U': 20,  # Auto_Flags
                'V': 18   # Zotero_Tags
            }

            for col, width in column_widths.items():
                worksheet.set_column(f'{col}:{col}', width)

            # Apply header format
            for col_num, value in enumerate(df.columns.values):
                worksheet.write(0, col_num, value, header_format)

            # Highlight assessment columns (M, N, O, P, Q, R, S, T)
            assessment_cols = ['M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T']
            for col in assessment_cols:
                col_idx = ord(col) - ord('A')
                for row_idx in range(1, len(df) + 1):
                    worksheet.write(row_idx, col_idx, df.iloc[row_idx-1, col_idx], assessment_format)

            # Add formula for Auto_Flags column (column U, index 20)
            for row_idx in range(1, len(df) + 1):
                # Check: Item_Type, Language, Year, DOI, Abstract
                formula = f'''=CONCATENATE(
IF(AND(F{row_idx+1}<>"journalArticle",F{row_idx+1}<>"book",F{row_idx+1}<>"conferencePaper",F{row_idx+1}<>"report"),"⚠️ Type ",""),
IF(AND(H{row_idx+1}<>"",H{row_idx+1}<>"en",H{row_idx+1}<>"de"),"⚠️ Lang ",""),
IF(OR(G{row_idx+1}<2015,G{row_idx+1}=""),"⚠️ Year ",""),
IF(E{row_idx+1}="","⚠️ DOI ",""),
IF(J{row_idx+1}="","⚠️ Abstract ",""))'''
                worksheet.write_formula(row_idx, 20, formula)

            # Add formula for Zotero_Tags column (column V, index 21)
            for row_idx in range(1, len(df) + 1):
                formula = f'=IF(M{row_idx+1}="Include", "PRISMA_Include", IF(M{row_idx+1}="Exclude", "PRISMA_Exclude", IF(M{row_idx+1}="Unclear", "PRISMA_Unclear", "")))'
                worksheet.write_formula(row_idx, 21, formula)

            # Freeze header row and first 4 columns
            worksheet.freeze_panes(1, 4)

            # Add data validation for Decision (column M)
            worksheet.data_validation(f'M2:M{len(df)+1}', {
                'validate': 'list',
                'source': ['Include', 'Exclude', 'Unclear'],
                'input_title': 'PRISMA Decision',
                'input_message': 'Include = use in analysis, Exclude = remove from study, Unclear = needs discussion',
                'error_title': 'Invalid Input',
                'error_message': 'Must select from dropdown'
            })

            # Add data validation for Exclusion_Reason (column N)
            worksheet.data_validation(f'N2:N{len(df)+1}', {
                'validate': 'list',
                'source': ['Not relevant topic', 'Wrong publication type', 'Wrong language',
                          'Duplicate', 'No access to full text', 'Insufficient quality', 'Other'],
                'input_title': 'Exclusion Reason',
                'input_message': 'Required if Decision = Exclude. Select primary reason for exclusion.',
                'error_title': 'Invalid Input',
                'error_message': 'Must select from dropdown'
            })

            # Add data validation for 5 Relevance Dimension columns (O, P, Q, R, S)
            relevance_scoring = ['0', '1', '2', '3']

            # O: Rel_AI_Komp
            worksheet.data_validation(f'O2:O{len(df)+1}', {
                'validate': 'list',
                'source': relevance_scoring,
                'input_title': 'AI/LLM-Kompetenzen',
                'input_message': '0=none | 1=tangential | 2=substantial | 3=core focus'
            })

            # P: Rel_Vulnerable
            worksheet.data_validation(f'P2:P{len(df)+1}', {
                'validate': 'list',
                'source': relevance_scoring,
                'input_title': 'Vulnerable & Digital Equity',
                'input_message': '0=none | 1=tangential | 2=substantial | 3=core focus'
            })

            # Q: Rel_Bias
            worksheet.data_validation(f'Q2:Q{len(df)+1}', {
                'validate': 'list',
                'source': relevance_scoring,
                'input_title': 'Bias & Diskriminierung',
                'input_message': '0=none | 1=tangential | 2=substantial | 3=core focus'
            })

            # R: Rel_Praxis
            worksheet.data_validation(f'R2:R{len(df)+1}', {
                'validate': 'list',
                'source': relevance_scoring,
                'input_title': 'Praxis Implementation',
                'input_message': '0=none | 1=tangential | 2=substantial | 3=core focus'
            })

            # S: Rel_Prof
            worksheet.data_validation(f'S2:S{len(df)+1}', {
                'validate': 'list',
                'source': relevance_scoring,
                'input_title': 'Professioneller Kontext',
                'input_message': '0=none | 1=tangential | 2=substantial | 3=core focus'
            })

            # Add conditional formatting: Green for Include, Red for Exclude
            include_format = workbook.add_format({'bg_color': '#C6EFCE', 'font_color': '#006100'})
            exclude_format = workbook.add_format({'bg_color': '#FFC7CE', 'font_color': '#9C0006'})

            worksheet.conditional_format(f'M2:M{len(df)+1}', {
                'type': 'cell',
                'criteria': '==',
                'value': '"Include"',
                'format': include_format
            })

            worksheet.conditional_format(f'M2:M{len(df)+1}', {
                'type': 'cell',
                'criteria': '==',
                'value': '"Exclude"',
                'format': exclude_format
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
        default='assessment/assessment.xlsx',
        help='Output Excel file (default: assessment/assessment.xlsx)'
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

        # Fetch collections first (for Source_Collections mapping)
        converter.fetch_collections()

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