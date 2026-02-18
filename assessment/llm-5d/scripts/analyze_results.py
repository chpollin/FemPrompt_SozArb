#!/usr/bin/env python3
"""Quick analysis of assessment results"""
import pandas as pd

df = pd.read_excel('assessment-llm/output/assessment_socialai_llm.xlsx')

print(f'Total papers: {len(df)}')
print(f'\nDecision breakdown:')
print(df['Decision'].value_counts())

print(f'\nPapers with no abstract (auto-excluded):')
no_abstract = df[df['Exclusion_Reason'].str.contains('Kein Abstract', na=False)].shape[0]
print(f'  {no_abstract}')

print(f'\nExclusion reasons breakdown:')
print(df[df['Decision'] == 'Exclude']['Exclusion_Reason'].value_counts())

print(f'\nAverage relevance scores (Include papers only):')
include_df = df[df['Decision'] == 'Include']
print(f'  Papers with Include decision: {len(include_df)}')
for col in ['Rel_AI_Komp', 'Rel_Vulnerable', 'Rel_Bias', 'Rel_Praxis', 'Rel_Prof']:
    if col in include_df.columns:
        avg = include_df[col].mean()
        print(f'  {col}: {avg:.2f}')

print(f'\nTop 10 Include papers by total relevance score:')
include_df['Total_Score'] = (include_df['Rel_AI_Komp'] + include_df['Rel_Vulnerable'] +
                              include_df['Rel_Bias'] + include_df['Rel_Praxis'] + include_df['Rel_Prof'])
top10 = include_df.nlargest(10, 'Total_Score')[['Title', 'Total_Score', 'Rel_AI_Komp', 'Rel_Vulnerable', 'Rel_Bias', 'Rel_Praxis', 'Rel_Prof']]
for idx, row in top10.iterrows():
    print(f"\n  {row['Title'][:80]}")
    print(f"    Total: {row['Total_Score']}, AI:{row['Rel_AI_Komp']}, Vuln:{row['Rel_Vulnerable']}, Bias:{row['Rel_Bias']}, Prax:{row['Rel_Praxis']}, Prof:{row['Rel_Prof']}")
