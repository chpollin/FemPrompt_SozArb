#!/usr/bin/env python3
"""
RIS to Excel Converter for PRISMA-compliant Literature Review
Exports bibliographic data from RIS format to Excel for efficient human assessment
"""

import os
import re
import pandas as pd
from pathlib import Path
import logging
from typing import Dict, List, Optional
import argparse

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class RISToExcelConverter:
    """Convert RIS bibliographic data to Excel for assessment workflow"""

    def __init__(self, ris_file: str, output_file: str = None):
        """
        Initialize converter

        Args:
            ris_file: Path to input RIS file
            output_file: Path to output Excel file (optional)
        """
        self.ris_file = Path(ris_file)
        if not self.ris_file.exists():
            raise FileNotFoundError(f"RIS file not found: {ris_file}")

        self.output_file = output_file or self.ris_file.with_suffix('.xlsx')
        self.entries = []

    def parse_ris(self) -> List[Dict]:
        """Parse RIS file and extract key fields for assessment"""
        current_entry = {}

        with open(self.ris_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()

                # Skip empty lines
                if not line:
                    continue

                # Check for entry end
                if line.startswith('ER  -'):
                    if current_entry:
                        self.entries.append(current_entry)
                        current_entry = {}
                    continue

                # Parse field
                if '  - ' in line:
                    tag = line[:2]
                    value = line[6:].strip()

                    # Map RIS tags to readable fields
                    field_map = {
                        'TI': 'title',
                        'T1': 'title',
                        'AU': 'authors',
                        'A1': 'authors',
                        'PY': 'year',
                        'Y1': 'year',
                        'DO': 'doi',
                        'UR': 'url',
                        'AB': 'abstract',
                        'T2': 'journal',
                        'JO': 'journal',
                        'KW': 'keywords',
                        'N1': 'notes',
                        'ID': 'zotero_key'
                    }

                    if tag in field_map:
                        field_name = field_map[tag]

                        # Handle multiple authors/keywords
                        if field_name in ['authors', 'keywords']:
                            if field_name in current_entry:
                                current_entry[field_name] += f"; {value}"
                            else:
                                current_entry[field_name] = value
                        # Handle abstract/notes (might be multi-line)
                        elif field_name in ['abstract', 'notes']:
                            if field_name in current_entry:
                                current_entry[field_name] += f" {value}"
                            else:
                                current_entry[field_name] = value
                        else:
                            current_entry[field_name] = value

        # Don't forget last entry
        if current_entry:
            self.entries.append(current_entry)

        logger.info(f"Parsed {len(self.entries)} entries from RIS file")
        return self.entries

    def create_assessment_dataframe(self) -> pd.DataFrame:
        """Create DataFrame optimized for assessment workflow"""

        assessment_data = []

        for idx, entry in enumerate(self.entries, 1):
            # Extract year from various date formats
            year = entry.get('year', '')
            if year and len(year) > 4:
                # Extract year from date like "2024/01/15"
                year_match = re.search(r'(\d{4})', year)
                year = year_match.group(1) if year_match else year[:4]

            # Create author_year identifier
            authors = entry.get('authors', 'Unknown')
            first_author = authors.split(';')[0].split(',')[0].strip() if authors else 'Unknown'
            author_year = f"{first_author}_{year}" if year else first_author

            # Truncate title for readability
            title = entry.get('title', 'No title')
            title_short = title[:100] + '...' if len(title) > 100 else title

            assessment_row = {
                'ID': idx,
                'Zotero_Key': entry.get('zotero_key', ''),
                'Author_Year': author_year,
                'Title': title_short,
                'Full_Title': title,
                'DOI': entry.get('doi', ''),
                'URL': entry.get('url', ''),
                'Abstract_Preview': entry.get('abstract', '')[:200] + '...' if entry.get('abstract') else '',
                'Journal': entry.get('journal', ''),
                'Keywords': entry.get('keywords', ''),
                # Assessment columns (empty for manual filling)
                'Relevance_Score': '',  # 1-5
                'Quality': '',  # High/Medium/Low
                'Decision': '',  # Include/Exclude/Unclear
                'Exclusion_Reason': '',  # If excluded
                'Notes': '',  # Additional notes
                'Reviewer': '',  # Who reviewed
                'Review_Date': '',  # When reviewed
                'Second_Review': '',  # Flag for second review needed
                'Consistency_Check': '',  # Will contain Excel formula for validation
                # Auto-generated tag column (Excel formula will go here)
                'Zotero_Tags': ''  # Will contain Excel formula
            }

            assessment_data.append(assessment_row)

        df = pd.DataFrame(assessment_data)

        # Add Excel formula for auto-generating tags
        # This will be added when writing to Excel

        return df

    def write_excel_with_formatting(self, df: pd.DataFrame):
        """Write DataFrame to Excel with formatting and validation"""

        # Create Excel writer with xlsxwriter engine
        with pd.ExcelWriter(self.output_file, engine='xlsxwriter') as writer:
            # Write main assessment sheet
            df.to_excel(writer, sheet_name='Assessment', index=False)

            # Get workbook and worksheet
            workbook = writer.book
            worksheet = writer.sheets['Assessment']

            # Define formats
            header_format = workbook.add_format({
                'bold': True,
                'text_wrap': True,
                'valign': 'top',
                'fg_color': '#D7E4BD',
                'border': 1
            })

            # Add data validation for categorical columns
            # Relevance Score (1-5)
            worksheet.data_validation('K2:K1000', {
                'validate': 'list',
                'source': ['1', '2', '3', '4', '5'],
                'input_title': 'Relevance Score',
                'input_message': '1=Off-topic, 2=Peripheral, 3=Relevant, 4=Highly Relevant, 5=Core'
            })

            # Quality (High/Medium/Low)
            worksheet.data_validation('L2:L1000', {
                'validate': 'list',
                'source': ['High', 'Medium', 'Low'],
                'input_title': 'Quality Assessment',
                'input_message': 'High=Peer-reviewed top journal, Medium=Peer-reviewed, Low=Grey literature'
            })

            # Decision (Include/Exclude/Unclear)
            worksheet.data_validation('M2:M1000', {
                'validate': 'list',
                'source': ['Include', 'Exclude', 'Unclear'],
                'input_title': 'Inclusion Decision',
                'input_message': 'Include=Meets criteria, Exclude=Does not meet, Unclear=Needs discussion'
            })

            # PRISMA-compliant exclusion reasons (reduced set)
            worksheet.data_validation('N2:N1000', {
                'validate': 'list',
                'source': [
                    'E1_Wrong_Focus',     # Not feminist AI/prompting
                    'E2_Wrong_Type',      # Opinion without evidence
                    'E3_No_Access',       # Paywall or unavailable
                    'E4_Duplicate',       # Already included
                    'E5_Quality',         # Methodological issues
                ],
                'input_title': 'Exclusion Reason',
                'input_message': 'Select PRISMA-compliant reason if excluding'
            })

            # Second Review flag (Yes/No)
            worksheet.data_validation('Q2:Q1000', {
                'validate': 'list',
                'source': ['', 'Yes'],
                'input_title': 'Second Review',
                'input_message': 'Mark Yes if second opinion needed'
            })

            # Add Excel formula for Consistency Check (column R)
            for row in range(2, len(df) + 2):
                # Check for logical inconsistencies
                consistency_formula = (
                    f'=IF(M{row}="","Pending",'
                    f'IF(AND(K{row}<3,M{row}="Include"),"⚠️ Low relevance but included",'
                    f'IF(AND(L{row}="Low",M{row}="Include"),"⚠️ Low quality but included",'
                    f'IF(AND(K{row}>=4,L{row}="High",M{row}="Exclude"),"⚠️ High relevance/quality but excluded",'
                    f'"✓ OK"))))'
                )
                worksheet.write_formula(f'R{row}', consistency_formula)

            # Add Excel formula for Zotero tags (column T - moved one column right)
            for row in range(2, len(df) + 2):
                formula = f'=IF(M{row}="","",CONCATENATE("rel",K{row},"_qual",L{row},"_",M{row}))'
                worksheet.write_formula(f'T{row}', formula)

            # Conditional formatting for Decision column
            # Green for Include
            worksheet.conditional_format('M2:M1000', {
                'type': 'text',
                'criteria': 'containing',
                'value': 'Include',
                'format': workbook.add_format({'bg_color': '#C6EFCE', 'font_color': '#006100'})
            })

            # Red for Exclude
            worksheet.conditional_format('M2:M1000', {
                'type': 'text',
                'criteria': 'containing',
                'value': 'Exclude',
                'format': workbook.add_format({'bg_color': '#FFC7CE', 'font_color': '#9C0006'})
            })

            # Yellow for Unclear
            worksheet.conditional_format('M2:M1000', {
                'type': 'text',
                'criteria': 'containing',
                'value': 'Unclear',
                'format': workbook.add_format({'bg_color': '#FFEB9C', 'font_color': '#9C6500'})
            })

            # Highlight rows needing second review
            worksheet.conditional_format('Q2:Q1000', {
                'type': 'text',
                'criteria': 'containing',
                'value': 'Yes',
                'format': workbook.add_format({'bg_color': '#E6E6FA', 'bold': True})
            })

            # Highlight consistency check warnings
            worksheet.conditional_format('R2:R1000', {
                'type': 'text',
                'criteria': 'containing',
                'value': '⚠️',
                'format': workbook.add_format({'bg_color': '#FFE4B5', 'font_color': '#FF6600'})
            })

            # Set column widths for better readability
            worksheet.set_column('A:A', 5)   # ID
            worksheet.set_column('B:B', 15)  # Zotero_Key
            worksheet.set_column('C:C', 20)  # Author_Year
            worksheet.set_column('D:D', 50)  # Title
            worksheet.set_column('E:E', 50)  # Full_Title (hidden by default)
            worksheet.set_column('F:F', 25)  # DOI
            worksheet.set_column('G:G', 30)  # URL (hidden)
            worksheet.set_column('H:H', 40)  # Abstract_Preview
            worksheet.set_column('I:I', 30)  # Journal
            worksheet.set_column('J:J', 30)  # Keywords
            worksheet.set_column('K:K', 12)  # Relevance
            worksheet.set_column('L:L', 10)  # Quality
            worksheet.set_column('M:M', 10)  # Decision
            worksheet.set_column('N:N', 20)  # Exclusion_Reason
            worksheet.set_column('O:O', 30)  # Notes
            worksheet.set_column('P:P', 15)  # Reviewer
            worksheet.set_column('Q:Q', 12)  # Second_Review
            worksheet.set_column('R:R', 30)  # Consistency_Check
            worksheet.set_column('S:S', 12)  # Review_Date
            worksheet.set_column('T:T', 30)  # Zotero_Tags

            # Hide less important columns
            worksheet.set_column('E:E', None, None, {'hidden': True})  # Full_Title
            worksheet.set_column('G:G', None, None, {'hidden': True})  # URL

            # Freeze panes for header row
            worksheet.freeze_panes(1, 0)

            # Add instructions sheet
            instructions_df = pd.DataFrame({
                'Instructions': [
                    'ASSESSMENT WORKFLOW INSTRUCTIONS',
                    '',
                    '1. RELEVANCE SCORING:',
                    '   5 = Core topic (feminist AI literacy, diversity prompting)',
                    '   4 = Highly relevant (intersectional bias analysis)',
                    '   3 = Relevant (general AI bias/fairness)',
                    '   2 = Peripheral (policy without theory)',
                    '   1 = Off-topic',
                    '',
                    '2. QUALITY ASSESSMENT:',
                    '   High = Top-tier peer-reviewed journal (Q1/Q2)',
                    '   Medium = Peer-reviewed journal or conference',
                    '   Low = Grey literature, reports, preprints',
                    '',
                    '3. DECISION MAKING:',
                    '   Include = Relevance ≥3 AND Quality ≥Medium',
                    '   Exclude = Does not meet criteria',
                    '   Unclear = Needs team discussion',
                    '',
                    '4. EXCLUSION CODES (PRISMA-compliant):',
                    '   E1_Wrong_Focus = Not feminist AI/prompting',
                    '   E2_Wrong_Type = Opinion without evidence',
                    '   E3_No_Access = Paywall or unavailable',
                    '   E4_Duplicate = Already included',
                    '   E5_Quality = Methodological issues',
                    '',
                    '5. QUALITY CONTROL:',
                    '   - Consistency_Check warns of logical issues',
                    '   - Mark Second_Review=Yes for difficult cases',
                    '   - Orange highlights = consistency warnings',
                    '   - Purple highlights = needs second review',
                    '',
                    '6. TIPS:',
                    '   - Use filters to show only "Unclear" for discussion',
                    '   - Sort by Relevance to prioritize review',
                    '   - Check Abstract_Preview for quick assessment',
                    '   - Add your initials in Reviewer column',
                    '   - Zotero_Tags auto-generate for import'
                ]
            })
            instructions_df.to_excel(writer, sheet_name='Instructions', index=False)

            # Add summary statistics sheet
            stats_df = pd.DataFrame({
                'Metric': ['Total Entries', 'Placeholder for stats after assessment'],
                'Value': [len(df), '']
            })
            stats_df.to_excel(writer, sheet_name='Statistics', index=False)

        logger.info(f"Excel file created: {self.output_file}")
        logger.info(f"Ready for assessment of {len(df)} entries")

    def convert(self):
        """Main conversion process"""
        logger.info("Starting RIS to Excel conversion...")

        # Parse RIS file
        self.parse_ris()

        # Create assessment DataFrame
        df = self.create_assessment_dataframe()

        # Write to Excel with formatting
        self.write_excel_with_formatting(df)

        return self.output_file


def main():
    parser = argparse.ArgumentParser(description='Convert RIS file to Excel for assessment')
    parser.add_argument('ris_file', help='Path to input RIS file')
    parser.add_argument('-o', '--output', help='Path to output Excel file', default=None)
    parser.add_argument('-v', '--verbose', action='store_true', help='Verbose output')

    args = parser.parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    try:
        converter = RISToExcelConverter(args.ris_file, args.output)
        output_file = converter.convert()
        print(f"\n[SUCCESS] Successfully created assessment Excel: {output_file}")
        print(f"[INFO] Total entries: {len(converter.entries)}")
        print("\nNext steps:")
        print("1. Open Excel file and complete assessments")
        print("2. Save Excel file when done")
        print("3. Run excel_to_ris.py to merge assessments back")

    except Exception as e:
        logger.error(f"Conversion failed: {e}")
        return 1

    return 0


if __name__ == "__main__":
    exit(main())