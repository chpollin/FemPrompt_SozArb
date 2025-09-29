#!/usr/bin/env python3
"""
Optimized RIS to Excel Converter for PRISMA-compliant Literature Review
Creates streamlined 13-column Excel for efficient assessment
"""

import os
import re
import pandas as pd
from pathlib import Path
import logging
from typing import Dict, List, Optional
import argparse
from datetime import datetime

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class OptimizedRISToExcelConverter:
    """Convert RIS bibliographic data to optimized 13-column Excel for assessment"""

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

    def create_optimized_dataframe(self) -> pd.DataFrame:
        """Create optimized 13-column DataFrame for efficient assessment"""

        assessment_data = []

        for idx, entry in enumerate(self.entries, 1):
            # Extract year from various date formats
            year = entry.get('year', '')
            if year and len(year) > 4:
                year_match = re.search(r'(\d{4})', year)
                year = year_match.group(1) if year_match else year[:4]

            # Create author_year identifier
            authors = entry.get('authors', 'Unknown')
            first_author = authors.split(';')[0].split(',')[0].strip() if authors else 'Unknown'
            author_year = f"{first_author}_{year}" if year else first_author

            # Truncate title for readability (50 chars as specified)
            title = entry.get('title', 'No title')
            title_short = title[:50] + '...' if len(title) > 50 else title

            # OPTIMIZED 13-COLUMN STRUCTURE
            assessment_row = {
                # A-D: Identification (4 columns)
                'Zotero_Key': entry.get('zotero_key', f'ID_{idx}'),
                'Author_Year': author_year,
                'Title_Short': title_short,
                'DOI': entry.get('doi', ''),

                # E-H: Assessment (4 columns)
                'Relevance': '',  # 1-5
                'Quality': '',  # High/Medium/Low
                'Decision': '',  # Include/Exclude/Unclear
                'Exclusion_Code': '',  # E1-E8 if excluded

                # I-J: Control (2 columns)
                'Consistency_Check': '',  # Formula for immediate validation
                'Auto_Tags': '',  # Will contain Excel formula

                # K: Timestamp (1 column)
                'Date_Reviewed': '',  # When reviewed

                # L-M: Optional (2 columns)
                'Notes': '',  # Additional notes
                'Second_Review': '',  # Yes if needed

                # Hidden data (stored but not shown by default)
                '_Full_Title': title,
                '_Abstract': entry.get('abstract', ''),
                '_Journal': entry.get('journal', ''),
                '_URL': entry.get('url', '')
            }

            assessment_data.append(assessment_row)

        df = pd.DataFrame(assessment_data)

        # Only keep visible columns in final dataframe
        visible_columns = [
            'Zotero_Key', 'Author_Year', 'Title_Short', 'DOI',
            'Relevance', 'Quality', 'Decision', 'Exclusion_Code',
            'Consistency_Check', 'Auto_Tags', 'Date_Reviewed',
            'Notes', 'Second_Review'
        ]

        df = df[visible_columns]

        return df

    def write_optimized_excel(self, df: pd.DataFrame):
        """Write optimized Excel with proper column ordering and validation"""

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

            # === DATA VALIDATION ===

            # E: Relevance Score (1-5)
            worksheet.data_validation('E2:E1000', {
                'validate': 'list',
                'source': ['1', '2', '3', '4', '5'],
                'input_title': 'Relevance Score',
                'input_message': '5=Core (feminist AI), 4=Highly relevant, 3=Relevant, 2=Peripheral, 1=Off-topic'
            })

            # F: Quality (High/Medium/Low)
            worksheet.data_validation('F2:F1000', {
                'validate': 'list',
                'source': ['High', 'Medium', 'Low'],
                'input_title': 'Quality Assessment',
                'input_message': 'High=Q1/Q2 journal, Medium=Peer-reviewed, Low=Grey literature'
            })

            # G: Decision (Include/Exclude/Unclear)
            worksheet.data_validation('G2:G1000', {
                'validate': 'list',
                'source': ['Include', 'Exclude', 'Unclear'],
                'input_title': 'Inclusion Decision',
                'input_message': 'Include=Meets criteria, Exclude=Does not meet, Unclear=Needs discussion'
            })

            # H: PRISMA-compliant exclusion codes (E1-E8)
            worksheet.data_validation('H2:H1000', {
                'validate': 'list',
                'source': [
                    '',  # Empty option when not excluded
                    'E1_Wrong_Population',   # Not feminist/AI focus
                    'E2_Wrong_Intervention',  # No literacy component
                    'E3_Wrong_Outcome',       # No bias/diversity analysis
                    'E4_Wrong_Type',          # Opinion without evidence
                    'E5_Language',            # Not English/German
                    'E6_No_Access',           # Paywall or unavailable
                    'E7_Duplicate',           # Already included
                    'E8_Quality',             # Insufficient quality
                ],
                'input_title': 'Exclusion Code',
                'input_message': 'Select PRISMA-compliant reason if excluding'
            })

            # M: Second Review flag
            worksheet.data_validation('M2:M1000', {
                'validate': 'list',
                'source': ['', 'Yes'],
                'input_title': 'Second Review',
                'input_message': 'Mark Yes if second opinion needed'
            })

            # === FORMULAS ===

            for row in range(2, len(df) + 2):
                # I: Consistency Check (IMMEDIATELY after Decision for visibility)
                consistency_formula = (
                    f'=IF(G{row}="","Pending",'
                    f'IF(AND(E{row}<3,G{row}="Include"),"⚠️ Low relevance but included",'
                    f'IF(AND(F{row}="Low",G{row}="Include"),"⚠️ Low quality but included",'
                    f'IF(AND(E{row}>=4,F{row}="High",G{row}="Exclude"),"⚠️ High relevance/quality but excluded",'
                    f'IF(AND(G{row}="Exclude",H{row}=""),"⚠️ Missing exclusion reason",'
                    f'"✓ OK")))))'
                )
                worksheet.write_formula(f'I{row}', consistency_formula)

                # J: Auto-generated tags
                tag_formula = f'=IF(G{row}="","",CONCATENATE("rel",E{row},"_qual",F{row},"_",G{row}))'
                worksheet.write_formula(f'J{row}', tag_formula)

                # K: Date (auto-filled when row is edited - requires VBA, so manual for now)
                # User should manually enter date or we could pre-fill with today

            # === CONDITIONAL FORMATTING ===

            # Decision column (G): Green/Red/Yellow
            worksheet.conditional_format('G2:G1000', {
                'type': 'text',
                'criteria': 'containing',
                'value': 'Include',
                'format': workbook.add_format({'bg_color': '#C6EFCE', 'font_color': '#006100'})
            })

            worksheet.conditional_format('G2:G1000', {
                'type': 'text',
                'criteria': 'containing',
                'value': 'Exclude',
                'format': workbook.add_format({'bg_color': '#FFC7CE', 'font_color': '#9C0006'})
            })

            worksheet.conditional_format('G2:G1000', {
                'type': 'text',
                'criteria': 'containing',
                'value': 'Unclear',
                'format': workbook.add_format({'bg_color': '#FFEB9C', 'font_color': '#9C6500'})
            })

            # Consistency Check (I): Highlight warnings
            worksheet.conditional_format('I2:I1000', {
                'type': 'text',
                'criteria': 'containing',
                'value': '⚠️',
                'format': workbook.add_format({'bg_color': '#FFE4B5', 'font_color': '#FF6600', 'bold': True})
            })

            # Second Review (M): Highlight when Yes
            worksheet.conditional_format('M2:M1000', {
                'type': 'text',
                'criteria': 'containing',
                'value': 'Yes',
                'format': workbook.add_format({'bg_color': '#E6E6FA', 'bold': True})
            })

            # === COLUMN WIDTHS (Optimized for 13 columns) ===
            worksheet.set_column('A:A', 15)  # Zotero_Key
            worksheet.set_column('B:B', 20)  # Author_Year
            worksheet.set_column('C:C', 40)  # Title_Short (50 chars)
            worksheet.set_column('D:D', 20)  # DOI
            worksheet.set_column('E:E', 10)  # Relevance
            worksheet.set_column('F:F', 10)  # Quality
            worksheet.set_column('G:G', 10)  # Decision
            worksheet.set_column('H:H', 18)  # Exclusion_Code
            worksheet.set_column('I:I', 25)  # Consistency_Check
            worksheet.set_column('J:J', 25)  # Auto_Tags
            worksheet.set_column('K:K', 12)  # Date_Reviewed
            worksheet.set_column('L:L', 30)  # Notes
            worksheet.set_column('M:M', 12)  # Second_Review

            # Freeze panes (header row)
            worksheet.freeze_panes(1, 4)  # Freeze first row and first 4 columns

            # === ADD INSTRUCTIONS SHEET ===
            instructions_df = pd.DataFrame({
                'Instructions': [
                    'OPTIMIZED 13-COLUMN ASSESSMENT WORKFLOW',
                    '',
                    'COLUMN STRUCTURE:',
                    'A-D: Identification - Key paper details',
                    'E-H: Assessment - Your evaluation',
                    'I-J: Automation - System-generated checks',
                    'K: Timestamp - Review date',
                    'L-M: Optional - Notes and flags',
                    '',
                    'RELEVANCE SCORING:',
                    '  5 = Core (feminist AI literacy, diversity prompting)',
                    '  4 = Highly relevant (intersectional bias analysis)',
                    '  3 = Relevant (general AI bias/fairness)',
                    '  2 = Peripheral (policy without theory)',
                    '  1 = Off-topic',
                    '',
                    'QUALITY LEVELS:',
                    '  High = Q1/Q2 journal, rigorous methodology',
                    '  Medium = Peer-reviewed, solid work',
                    '  Low = Grey literature, reports, limited methods',
                    '',
                    'DECISION RULES:',
                    '  Include = Relevance ≥3 AND Quality ≥Medium',
                    '  Exclude = Does not meet criteria (provide code)',
                    '  Unclear = Needs team discussion',
                    '',
                    'EXCLUSION CODES (E1-E8):',
                    '  E1 = Wrong population (not feminist/AI)',
                    '  E2 = Wrong intervention (no literacy)',
                    '  E3 = Wrong outcome (no bias analysis)',
                    '  E4 = Wrong type (opinion piece)',
                    '  E5 = Language barrier',
                    '  E6 = No access (paywall)',
                    '  E7 = Duplicate entry',
                    '  E8 = Quality issues',
                    '',
                    'CONSISTENCY CHECK:',
                    '  ✓ OK = Logically consistent',
                    '  ⚠️ Warning = Review your decision',
                    '',
                    'TIPS:',
                    '  - Sort by Author_Year for alphabetical review',
                    '  - Filter Consistency_Check for warnings',
                    '  - Use Second_Review=Yes for difficult cases',
                    '  - Add notes for borderline decisions',
                    '  - Date_Reviewed helps track progress'
                ]
            })
            instructions_df.to_excel(writer, sheet_name='Instructions', index=False)

            # === ADD SUMMARY SHEET ===
            summary_df = pd.DataFrame({
                'Metric': [
                    'Total Entries',
                    'To be assessed',
                    'Include',
                    'Exclude',
                    'Unclear',
                    'Warnings',
                    'Second Review Needed'
                ],
                'Value': [
                    len(df),
                    '=COUNTIF(Assessment!G:G,"")',
                    '=COUNTIF(Assessment!G:G,"Include")',
                    '=COUNTIF(Assessment!G:G,"Exclude")',
                    '=COUNTIF(Assessment!G:G,"Unclear")',
                    '=COUNTIF(Assessment!I:I,"⚠️*")',
                    '=COUNTIF(Assessment!M:M,"Yes")'
                ],
                'Percentage': [
                    '',
                    '=B2/B1*100',
                    '=B3/B1*100',
                    '=B4/B1*100',
                    '=B5/B1*100',
                    '=B6/B1*100',
                    '=B7/B1*100'
                ]
            })
            summary_df.to_excel(writer, sheet_name='Summary', index=False)

        logger.info(f"Optimized Excel file created: {self.output_file}")
        logger.info(f"Ready for assessment of {len(df)} entries in 13 columns")

    def convert(self):
        """Main conversion process"""
        logger.info("Starting optimized RIS to Excel conversion...")

        # Parse RIS file
        self.parse_ris()

        # Create optimized DataFrame
        df = self.create_optimized_dataframe()

        # Write to Excel with formatting
        self.write_optimized_excel(df)

        return self.output_file


def main():
    parser = argparse.ArgumentParser(
        description='Convert RIS to optimized 13-column Excel for PRISMA assessment'
    )
    parser.add_argument('ris_file', help='Path to input RIS file')
    parser.add_argument('-o', '--output', help='Path to output Excel file', default=None)
    parser.add_argument('-v', '--verbose', action='store_true', help='Verbose output')

    args = parser.parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    try:
        converter = OptimizedRISToExcelConverter(args.ris_file, args.output)
        output_file = converter.convert()

        print(f"\n[SUCCESS] Created optimized 13-column assessment Excel: {output_file}")
        print(f"[INFO] Total entries: {len(converter.entries)}")
        print("\nColumn Structure:")
        print("  A-D: Identification (Zotero_Key, Author_Year, Title, DOI)")
        print("  E-H: Assessment (Relevance, Quality, Decision, Exclusion)")
        print("  I-J: Automation (Consistency_Check, Auto_Tags)")
        print("  K-M: Meta (Date, Notes, Second_Review)")
        print("\nNext steps:")
        print("1. Open Excel and complete assessments")
        print("2. Watch for warnings in Consistency_Check column")
        print("3. Save and run excel_to_ris.py to merge back")

    except Exception as e:
        logger.error(f"Conversion failed: {e}")
        return 1

    return 0


if __name__ == "__main__":
    exit(main())