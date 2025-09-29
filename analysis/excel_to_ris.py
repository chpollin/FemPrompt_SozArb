#!/usr/bin/env python3
"""
Excel to RIS Merger for PRISMA-compliant Literature Review
Merges human assessments from Excel back into RIS format with enriched metadata
"""

import os
import re
import pandas as pd
from pathlib import Path
import logging
from typing import Dict, List, Optional, Tuple
from difflib import SequenceMatcher
import argparse
from datetime import datetime

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class ExcelToRISMerger:
    """Merge Excel assessments back into RIS format"""

    def __init__(self, excel_file: str, ris_file: str, output_file: str = None):
        """
        Initialize merger

        Args:
            excel_file: Path to Excel file with assessments
            ris_file: Path to original RIS file
            output_file: Path to output enriched RIS file (optional)
        """
        self.excel_file = Path(excel_file)
        self.ris_file = Path(ris_file)

        if not self.excel_file.exists():
            raise FileNotFoundError(f"Excel file not found: {excel_file}")
        if not self.ris_file.exists():
            raise FileNotFoundError(f"RIS file not found: {ris_file}")

        self.output_file = output_file or self.ris_file.with_name(
            self.ris_file.stem + '_enriched.ris'
        )

        self.assessments = {}
        self.ris_entries = []
        self.match_log = []

    def load_excel_assessments(self) -> Dict:
        """Load assessment data from Excel file"""
        try:
            df = pd.read_excel(self.excel_file, sheet_name='Assessment')
        except Exception as e:
            logger.error(f"Failed to read Excel file: {e}")
            raise

        # Process each row
        for idx, row in df.iterrows():
            # Skip rows without decision
            if pd.isna(row.get('Decision', '')) or row.get('Decision', '') == '':
                continue

            assessment = {
                'relevance': str(row.get('Relevance_Score', '')),
                'quality': row.get('Quality', ''),
                'decision': row.get('Decision', ''),
                'exclusion_reason': row.get('Exclusion_Reason', ''),
                'notes': row.get('Notes', ''),
                'reviewer': row.get('Reviewer', ''),
                'review_date': row.get('Review_Date', ''),
                'zotero_tags': row.get('Zotero_Tags', ''),
                'doi': row.get('DOI', ''),
                'title': row.get('Full_Title', row.get('Title', '')),
                'author_year': row.get('Author_Year', '')
            }

            # Store by multiple keys for matching
            key = f"entry_{idx}"
            self.assessments[key] = assessment

            # Also store by DOI if available
            if assessment['doi'] and not pd.isna(assessment['doi']):
                self.assessments[assessment['doi']] = assessment

            # Store by title for fallback matching
            if assessment['title']:
                title_key = self._normalize_title(assessment['title'])
                self.assessments[title_key] = assessment

        logger.info(f"Loaded {len([a for a in self.assessments.values() if a.get('decision')])} assessments from Excel")

        # Generate statistics
        self._print_assessment_stats(df)

        return self.assessments

    def _normalize_title(self, title: str) -> str:
        """Normalize title for matching"""
        # Remove special characters and lowercase
        normalized = re.sub(r'[^\w\s]', '', title.lower())
        # Remove extra spaces
        normalized = ' '.join(normalized.split())
        return normalized

    def _print_assessment_stats(self, df: pd.DataFrame):
        """Print statistics about assessments"""
        decisions = df['Decision'].value_counts()
        quality = df['Quality'].value_counts()

        print("\n[STATS] Assessment Statistics:")
        print("-" * 40)
        print("Decisions:")
        for dec, count in decisions.items():
            if pd.notna(dec):
                print(f"  {dec}: {count}")

        print("\nQuality Distribution:")
        for qual, count in quality.items():
            if pd.notna(qual):
                print(f"  {qual}: {count}")

        # Calculate inclusion rate
        total_assessed = len(df[df['Decision'].notna()])
        included = len(df[df['Decision'] == 'Include'])
        if total_assessed > 0:
            inclusion_rate = (included / total_assessed) * 100
            print(f"\nInclusion Rate: {inclusion_rate:.1f}% ({included}/{total_assessed})")

    def parse_ris_entries(self) -> List[Dict]:
        """Parse original RIS file into entries"""
        entries = []
        current_entry = {'raw_lines': []}

        with open(self.ris_file, 'r', encoding='utf-8') as f:
            for line in f:
                # Keep raw line for reconstruction
                current_entry['raw_lines'].append(line)

                line_stripped = line.strip()

                # Check for entry end
                if line_stripped.startswith('ER  -'):
                    if current_entry['raw_lines']:
                        # Extract key fields for matching
                        self._extract_key_fields(current_entry)
                        entries.append(current_entry)
                        current_entry = {'raw_lines': []}
                    continue

                # Parse key fields for matching
                if '  - ' in line_stripped:
                    tag = line_stripped[:2]
                    value = line_stripped[6:].strip()

                    if tag == 'DO':
                        current_entry['doi'] = value
                    elif tag in ['TI', 'T1']:
                        current_entry['title'] = current_entry.get('title', '') + value

        # Don't forget last entry if no ER tag
        if current_entry['raw_lines']:
            self._extract_key_fields(current_entry)
            entries.append(current_entry)

        logger.info(f"Parsed {len(entries)} entries from original RIS file")
        return entries

    def _extract_key_fields(self, entry: Dict):
        """Extract key fields from raw lines for matching"""
        for line in entry['raw_lines']:
            if '  - ' in line:
                tag = line[:2]
                value = line[6:].strip()

                if tag == 'DO' and 'doi' not in entry:
                    entry['doi'] = value
                elif tag in ['TI', 'T1'] and 'title' not in entry:
                    entry['title'] = value

    def match_assessment_to_entry(self, ris_entry: Dict) -> Optional[Dict]:
        """Match RIS entry to assessment using multiple strategies"""

        # Strategy 1: Match by DOI (most reliable)
        if ris_entry.get('doi'):
            if ris_entry['doi'] in self.assessments:
                logger.debug(f"Matched by DOI: {ris_entry['doi']}")
                return self.assessments[ris_entry['doi']]

        # Strategy 2: Match by normalized title
        if ris_entry.get('title'):
            normalized_title = self._normalize_title(ris_entry['title'])
            if normalized_title in self.assessments:
                logger.debug(f"Matched by title: {ris_entry['title'][:50]}...")
                return self.assessments[normalized_title]

        # Strategy 3: Fuzzy title matching (if exact match fails)
        if ris_entry.get('title'):
            best_match, score = self._fuzzy_match_title(ris_entry['title'])
            if best_match and score > 0.85:  # 85% similarity threshold
                logger.debug(f"Fuzzy matched (score {score:.2f}): {ris_entry['title'][:50]}...")
                return best_match

        # No match found
        logger.warning(f"No match found for: {ris_entry.get('title', 'Unknown')[:50]}...")
        self.match_log.append({
            'title': ris_entry.get('title', 'Unknown'),
            'doi': ris_entry.get('doi', 'No DOI'),
            'status': 'unmatched'
        })
        return None

    def _fuzzy_match_title(self, title: str) -> Tuple[Optional[Dict], float]:
        """Fuzzy match title against all assessments"""
        best_match = None
        best_score = 0

        normalized_title = self._normalize_title(title)

        for key, assessment in self.assessments.items():
            if assessment.get('title'):
                # Calculate similarity
                score = SequenceMatcher(
                    None,
                    normalized_title,
                    self._normalize_title(assessment['title'])
                ).ratio()

                if score > best_score:
                    best_score = score
                    best_match = assessment

        return best_match, best_score

    def enrich_ris_entry(self, ris_entry: Dict, assessment: Dict) -> List[str]:
        """Add assessment data to RIS entry"""
        enriched_lines = []
        inserted_assessment = False

        for line in ris_entry['raw_lines']:
            # Add line to output
            enriched_lines.append(line)

            # Insert assessment data before ER tag
            if line.strip().startswith('ER  -') and not inserted_assessment:
                # Insert assessment fields before the ER tag
                enriched_lines.pop()  # Remove ER tag temporarily

                # Add assessment as notes (N2 tag for secondary notes)
                if assessment.get('relevance'):
                    enriched_lines.append(f"N2  - Assessment_Relevance: {assessment['relevance']}\n")
                if assessment.get('quality'):
                    enriched_lines.append(f"N2  - Assessment_Quality: {assessment['quality']}\n")
                if assessment.get('decision'):
                    enriched_lines.append(f"N2  - Assessment_Decision: {assessment['decision']}\n")
                if assessment.get('exclusion_reason'):
                    enriched_lines.append(f"N2  - Exclusion_Reason: {assessment['exclusion_reason']}\n")
                if assessment.get('notes'):
                    enriched_lines.append(f"N2  - Assessment_Notes: {assessment['notes']}\n")
                if assessment.get('reviewer'):
                    enriched_lines.append(f"N2  - Reviewed_By: {assessment['reviewer']}\n")
                if assessment.get('review_date'):
                    enriched_lines.append(f"N2  - Review_Date: {assessment['review_date']}\n")

                # Add as keywords for searchability
                if assessment.get('decision'):
                    enriched_lines.append(f"KW  - PRISMA_{assessment['decision']}\n")
                if assessment.get('relevance'):
                    enriched_lines.append(f"KW  - Relevance_{assessment['relevance']}\n")
                if assessment.get('quality'):
                    enriched_lines.append(f"KW  - Quality_{assessment['quality']}\n")

                # Add composite tag
                if assessment.get('zotero_tags'):
                    enriched_lines.append(f"KW  - {assessment['zotero_tags']}\n")

                # Re-add ER tag
                enriched_lines.append(line)
                inserted_assessment = True

        return enriched_lines

    def merge(self):
        """Main merge process"""
        logger.info("Starting Excel to RIS merge...")

        # Load assessments from Excel
        self.load_excel_assessments()

        # Parse original RIS file
        ris_entries = self.parse_ris_entries()

        # Process each RIS entry
        enriched_entries = []
        matched_count = 0
        included_count = 0

        for ris_entry in ris_entries:
            # Try to match with assessment
            assessment = self.match_assessment_to_entry(ris_entry)

            if assessment:
                # Enrich entry with assessment
                enriched_lines = self.enrich_ris_entry(ris_entry, assessment)
                matched_count += 1

                if assessment.get('decision') == 'Include':
                    included_count += 1
            else:
                # Keep original entry unchanged
                enriched_lines = ris_entry['raw_lines']

            enriched_entries.extend(enriched_lines)

        # Write enriched RIS file
        with open(self.output_file, 'w', encoding='utf-8') as f:
            f.writelines(enriched_entries)

        # Write match log
        self._write_match_log()

        # Print summary
        print(f"\n[SUCCESS] Merge completed successfully!")
        print(f"[OUTPUT] Output file: {self.output_file}")
        print(f"[STATS] Statistics:")
        print(f"  - Total RIS entries: {len(ris_entries)}")
        print(f"  - Successfully matched: {matched_count}")
        print(f"  - Unmatched entries: {len(ris_entries) - matched_count}")
        print(f"  - Included papers: {included_count}")

        if self.match_log:
            print(f"\n[WARNING] {len(self.match_log)} entries could not be matched.")
            print(f"  See match_log.csv for details")

        return self.output_file

    def _write_match_log(self):
        """Write log of matching results"""
        if self.match_log:
            log_df = pd.DataFrame(self.match_log)
            log_file = self.output_file.with_name('match_log.csv')
            log_df.to_csv(log_file, index=False)
            logger.info(f"Match log written to: {log_file}")


def main():
    parser = argparse.ArgumentParser(description='Merge Excel assessments back into RIS format')
    parser.add_argument('excel_file', help='Path to Excel file with assessments')
    parser.add_argument('ris_file', help='Path to original RIS file')
    parser.add_argument('-o', '--output', help='Path to output enriched RIS file', default=None)
    parser.add_argument('-v', '--verbose', action='store_true', help='Verbose output')

    args = parser.parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    try:
        merger = ExcelToRISMerger(args.excel_file, args.ris_file, args.output)
        output_file = merger.merge()

        print("\nNext steps:")
        print("1. Import enriched RIS file into Zotero")
        print("2. Use tags/keywords for filtering in Zotero")
        print("3. Process 'Include' papers through AI summarization pipeline")

    except Exception as e:
        logger.error(f"Merge failed: {e}")
        return 1

    return 0


if __name__ == "__main__":
    exit(main())