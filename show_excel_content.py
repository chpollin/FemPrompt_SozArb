#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import pandas as pd
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

df = pd.read_excel('assessment_real_FILLED.xlsx', sheet_name='Assessment')

print('='*80)
print('AUSGEFUELLTES ASSESSMENT EXCEL - So sieht es aus:')
print('='*80)
print()

# Show first 8 included papers
included = df[df['Decision'] == 'Include'].head(8)
print(f'INCLUDE Papers ({len(df[df["Decision"] == "Include"])} total):\n')
for i, row in included.iterrows():
    print(f'{i+1:2d}. {row["Author_Year"]:30s}')
    print(f'    Title: {str(row["Title"])[:60]}...')
    print(f'    Relevance: {row["Relevance"]:6s} | Quality: {row["Quality"]:6s}')
    print(f'    Notes: {str(row["Notes"])[:70]}...')
    print(f'    -> Zotero Tag: PRISMA_Include')
    print()

# Show first 3 excluded
excluded = df[df['Decision'] == 'Exclude'].head(3)
print(f'\nEXCLUDE Papers ({len(df[df["Decision"] == "Exclude"])} total):\n')
for i, row in excluded.iterrows():
    print(f'{i+1:2d}. {row["Author_Year"]:30s}')
    print(f'    Title: {str(row["Title"])[:60]}...')
    print(f'    Relevance: {row["Relevance"]:6s} | Quality: {row["Quality"]:6s}')
    print(f'    Notes: {str(row["Notes"])[:70]}...')
    print(f'    -> Zotero Tag: PRISMA_Exclude')
    print()

print('='*80)
print('NAECHSTER SCHRITT: Tags zurueck nach Zotero')
print('='*80)
print()
print('Das Excel wurde bewertet. Jetzt muessen die Tags zurueck ins Zotero:')
print()
print('Option 1: Direkt via Zotero API (empfohlen)')
print('  - Skript liest Excel')
print('  - Schreibt Tags direkt in Zotero Group')
print('  - Sie sehen die Tags sofort in Ihrem Zotero')
print()
print('Option 2: Via RIS Re-Import (komplex)')
print('  - Excel -> RIS mit Tags')
print('  - RIS manuell in Zotero importieren')
print('  - Mehr Schritte, fehleranfaelliger')
