#!/usr/bin/env python3
"""
Test script for the assessment workflow
Simulates human assessments for testing the complete pipeline
"""

import pandas as pd
import numpy as np
from pathlib import Path
import subprocess
import sys
from datetime import datetime

def simulate_assessments(excel_file: str):
    """Add simulated assessments to Excel file for testing"""

    # Load Excel file
    df = pd.read_excel(excel_file, sheet_name='Assessment')

    print(f"Loaded {len(df)} entries from Excel")

    # Simulate assessments based on realistic criteria
    np.random.seed(42)  # For reproducibility

    for idx, row in df.iterrows():
        title = row['Title'].lower() if pd.notna(row['Title']) else ''
        abstract = row['Abstract_Preview'].lower() if pd.notna(row['Abstract_Preview']) else ''

        # Determine relevance based on keywords
        relevance = 2  # Default
        if 'feminist' in title or 'feminist' in abstract:
            relevance = 5
        elif 'intersectional' in title or 'intersectional' in abstract:
            relevance = 4
        elif 'bias' in title or 'fairness' in abstract:
            relevance = 3
        elif 'ai' in title or 'artificial intelligence' in abstract:
            relevance = 3
        elif 'prompting' in title or 'prompt' in abstract:
            relevance = 4

        # Determine quality (random but weighted)
        quality_options = ['High', 'Medium', 'Low']
        quality_weights = [0.4, 0.4, 0.2]  # More likely to be High/Medium
        quality = np.random.choice(quality_options, p=quality_weights)

        # Make decision based on relevance and quality
        if relevance >= 3 and quality in ['High', 'Medium']:
            decision = 'Include'
            exclusion_reason = ''
        elif relevance < 2:
            decision = 'Exclude'
            exclusion_reason = 'Wrong topic'
        elif quality == 'Low' and relevance < 4:
            decision = 'Exclude'
            exclusion_reason = 'Insufficient quality'
        elif np.random.random() < 0.1:  # 10% unclear
            decision = 'Unclear'
            exclusion_reason = ''
        else:
            decision = 'Include'
            exclusion_reason = ''

        # Add assessments to DataFrame
        df.loc[idx, 'Relevance_Score'] = relevance
        df.loc[idx, 'Quality'] = quality
        df.loc[idx, 'Decision'] = decision
        df.loc[idx, 'Exclusion_Reason'] = exclusion_reason
        df.loc[idx, 'Notes'] = f"Auto-assessed for testing on {datetime.now().strftime('%Y-%m-%d')}"
        df.loc[idx, 'Reviewer'] = 'Test_Script'
        df.loc[idx, 'Review_Date'] = datetime.now().strftime('%Y-%m-%d')

        # Generate Zotero tags (will be recalculated by Excel formula)
        df.loc[idx, 'Zotero_Tags'] = f"rel{relevance}_qual{quality}_{decision}"

    # Save back to Excel
    output_file = excel_file.replace('.xlsx', '_assessed.xlsx')

    # Write to Excel with formatting preserved
    with pd.ExcelWriter(output_file, engine='xlsxwriter') as writer:
        df.to_excel(writer, sheet_name='Assessment', index=False)

        # Get workbook and worksheet
        workbook = writer.book
        worksheet = writer.sheets['Assessment']

        # Add conditional formatting for Decision column
        worksheet.conditional_format('M2:M1000', {
            'type': 'text',
            'criteria': 'containing',
            'value': 'Include',
            'format': workbook.add_format({'bg_color': '#C6EFCE', 'font_color': '#006100'})
        })

        worksheet.conditional_format('M2:M1000', {
            'type': 'text',
            'criteria': 'containing',
            'value': 'Exclude',
            'format': workbook.add_format({'bg_color': '#FFC7CE', 'font_color': '#9C0006'})
        })

        worksheet.conditional_format('M2:M1000', {
            'type': 'text',
            'criteria': 'containing',
            'value': 'Unclear',
            'format': workbook.add_format({'bg_color': '#FFEB9C', 'font_color': '#9C6500'})
        })

        # Set column widths
        worksheet.set_column('A:A', 5)   # ID
        worksheet.set_column('C:C', 20)  # Author_Year
        worksheet.set_column('D:D', 50)  # Title
        worksheet.set_column('K:K', 12)  # Relevance
        worksheet.set_column('L:L', 10)  # Quality
        worksheet.set_column('M:M', 10)  # Decision

    print(f"\nAssessments saved to: {output_file}")

    # Print summary statistics
    decisions = df['Decision'].value_counts()
    print("\n[STATS] Assessment Summary:")
    print("-" * 40)
    for dec, count in decisions.items():
        print(f"  {dec}: {count}")

    inclusion_rate = (len(df[df['Decision'] == 'Include']) / len(df)) * 100
    print(f"\nInclusion rate: {inclusion_rate:.1f}%")

    return output_file

def test_complete_workflow():
    """Test the complete assessment workflow"""

    print("=" * 60)
    print("TESTING COMPLETE ASSESSMENT WORKFLOW")
    print("=" * 60)

    # Step 1: Convert RIS to Excel
    print("\n[STEP 1] Converting RIS to Excel...")
    ris_file = "../to-Zotero/claude-deep-research-bibliography-1 - Copy.ris"

    result = subprocess.run([
        sys.executable, "ris_to_excel.py", ris_file, "-o", "test_assessment.xlsx"
    ], capture_output=True, text=True)

    if result.returncode != 0:
        print(f"Error: {result.stderr}")
        return

    print("[SUCCESS] Excel file created")

    # Step 2: Simulate assessments
    print("\n[STEP 2] Simulating human assessments...")
    assessed_file = simulate_assessments("test_assessment.xlsx")

    # Step 3: Merge back to RIS
    print("\n[STEP 3] Merging assessments back to RIS...")
    result = subprocess.run([
        sys.executable, "excel_to_ris.py",
        assessed_file,
        ris_file,
        "-o", "test_enriched.ris"
    ], capture_output=True, text=True)

    if result.returncode != 0:
        print(f"Error: {result.stderr}")
        return

    print(result.stdout)

    # Step 4: Verify enriched RIS
    print("\n[STEP 4] Verifying enriched RIS file...")
    enriched_file = Path("test_enriched.ris")
    if enriched_file.exists():
        with open(enriched_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Count assessment tags
        decision_count = content.count("Assessment_Decision:")
        relevance_count = content.count("Assessment_Relevance:")
        quality_count = content.count("Assessment_Quality:")

        print(f"Found {decision_count} decision tags")
        print(f"Found {relevance_count} relevance tags")
        print(f"Found {quality_count} quality tags")

        if decision_count > 0:
            print("\n[SUCCESS] Workflow test completed successfully!")
            print("\nGenerated files:")
            print("  1. test_assessment.xlsx - Initial Excel template")
            print("  2. test_assessment_assessed.xlsx - With simulated assessments")
            print("  3. test_enriched.ris - Enriched RIS with assessments")
            print("  4. match_log.csv - Matching results (if any issues)")
        else:
            print("[ERROR] No assessment tags found in enriched RIS")
    else:
        print("[ERROR] Enriched RIS file not created")

if __name__ == "__main__":
    test_complete_workflow()