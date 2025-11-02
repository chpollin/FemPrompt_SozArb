#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Simulate filling out the assessment Excel (what a human would do)
This demonstrates the manual assessment step
"""

import pandas as pd
import sys
from pathlib import Path

# Fix Windows encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def fill_assessment_demo(input_excel, output_excel, num_to_assess=15):
    """
    Simulate human expert filling out assessment

    Args:
        input_excel: Empty assessment Excel
        output_excel: Filled assessment Excel
        num_to_assess: Number of papers to assess (default: 15)
    """
    print(f"📊 Loading assessment Excel: {input_excel}")
    df = pd.read_excel(input_excel, sheet_name='Assessment')

    print(f"   Total papers: {len(df)}")
    print(f"   Simulating assessment of first {num_to_assess} papers...\n")

    # Simulate realistic human assessment
    # In reality, expert would read abstracts and make decisions
    assessments = [
        # High relevance, high quality → Include
        {'Relevance': 'High', 'Quality': 'High', 'Decision': 'Include',
         'Notes': 'Core paper on AI literacy and feminist approaches'},

        # Medium relevance, high quality → Include
        {'Relevance': 'Medium', 'Quality': 'High', 'Decision': 'Include',
         'Notes': 'Solid methodology, relevant to bias mitigation'},

        # Low relevance → Exclude
        {'Relevance': 'Low', 'Quality': 'Medium', 'Decision': 'Exclude',
         'Notes': 'Off-topic: focuses on general AI applications, not bias'},

        # Medium relevance, low quality → Exclude
        {'Relevance': 'Medium', 'Quality': 'Low', 'Decision': 'Exclude',
         'Notes': 'Not peer-reviewed, insufficient methodology'},

        # High relevance, high quality → Include
        {'Relevance': 'High', 'Quality': 'High', 'Decision': 'Include',
         'Notes': 'Excellent intersectional analysis of AI systems'},

        # Unclear case
        {'Relevance': 'Medium', 'Quality': 'Medium', 'Decision': 'Unclear',
         'Notes': 'Need to read full text to decide'},

        # High relevance → Include
        {'Relevance': 'High', 'Quality': 'Medium', 'Decision': 'Include',
         'Notes': 'Directly addresses prompting strategies for bias mitigation'},

        # Off-topic → Exclude
        {'Relevance': 'Low', 'Quality': 'High', 'Decision': 'Exclude',
         'Notes': 'High quality but wrong focus (technical AI, no social aspect)'},

        # Include
        {'Relevance': 'High', 'Quality': 'High', 'Decision': 'Include',
         'Notes': 'Feminist AI framework, highly relevant'},

        # Include
        {'Relevance': 'Medium', 'Quality': 'High', 'Decision': 'Include',
         'Notes': 'Good empirical study on AI bias'},

        # Exclude
        {'Relevance': 'Low', 'Quality': 'Low', 'Decision': 'Exclude',
         'Notes': 'Grey literature, no scientific rigor'},

        # Include
        {'Relevance': 'High', 'Quality': 'High', 'Decision': 'Include',
         'Notes': 'Key paper on intersectionality in AI'},

        # Unclear
        {'Relevance': 'Medium', 'Quality': 'Medium', 'Decision': 'Unclear',
         'Notes': 'Abstract insufficient, need full text'},

        # Include
        {'Relevance': 'High', 'Quality': 'Medium', 'Decision': 'Include',
         'Notes': 'Practical prompting guidelines for diversity'},

        # Exclude
        {'Relevance': 'Low', 'Quality': 'Medium', 'Decision': 'Exclude',
         'Notes': 'Wrong domain: educational AI, not bias/discrimination'},
    ]

    # Fill in assessments
    for i in range(min(num_to_assess, len(df))):
        assessment = assessments[i % len(assessments)]
        df.loc[i, 'Relevance'] = assessment['Relevance']
        df.loc[i, 'Quality'] = assessment['Quality']
        df.loc[i, 'Decision'] = assessment['Decision']
        df.loc[i, 'Notes'] = assessment['Notes']

        # Show what we filled
        print(f"{i+1:2d}. {df.loc[i, 'Author_Year']:25s} → {assessment['Decision']:8s} "
              f"(R:{assessment['Relevance']:6s}, Q:{assessment['Quality']:6s})")

    # Save filled Excel
    print(f"\n💾 Saving filled assessment to: {output_excel}")
    df.to_excel(output_excel, sheet_name='Assessment', index=False)

    # Statistics
    stats = df['Decision'].value_counts()
    print(f"\n📊 Assessment Statistics:")
    print(f"   Include: {stats.get('Include', 0)}")
    print(f"   Exclude: {stats.get('Exclude', 0)}")
    print(f"   Unclear: {stats.get('Unclear', 0)}")
    print(f"   Not yet assessed: {df['Decision'].isna().sum()}")

    return df

if __name__ == '__main__':
    input_file = Path('assessment/assessment.xlsx')
    output_file = Path('assessment/assessment_curated.xlsx')

    if not input_file.exists():
        print(f"Error: {input_file} not found")
        print("Run first: python assessment/zotero_to_excel.py")
        sys.exit(1)

    df = fill_assessment_demo(input_file, output_file, num_to_assess=15)

    print("\n" + "="*70)
    print("✅ DEMO ASSESSMENT COMPLETE")
    print("="*70)
    print(f"\nFile created: {output_file}")
    print("\nThis simulates what a human expert would do:")
    print("1. Read abstract/title")
    print("2. Assess Relevance (High/Medium/Low)")
    print("3. Assess Quality (High/Medium/Low)")
    print("4. Make Decision (Include/Exclude/Unclear)")
    print("5. Add Notes with rationale")
    print("\nNext step: Import back to Zotero with tags")
    print(f"  python assessment/excel_to_zotero_tags.py --api-key YOUR_KEY --no-dry-run")
