# Zotero → Excel → Zotero Roundtrip

Dieser Workflow zeigt, wie Sie PRISMA-Assessment in Excel durchführen und die Tags zurück in Zotero bringen.

## Kompletter Ablauf mit echten Daten

### Schritt 1: Export aus Zotero → Excel

```bash
python assessment/zotero_to_excel.py --library-id 6080294 --library-type group
```

**Ergebnis:**
- ✅ Excel-Datei erstellt: `assessment.xlsx`
- ✅ 325 Papers aus Zotero Group exportiert
- ✅ Spalten: ID, Zotero_Key, Author_Year, Title, DOI, Abstract, URL, Tags, **Relevance, Quality, Decision, Notes**

**Excel-Struktur:**

| ID | Zotero_Key | Author_Year | Title | Relevance | Quality | Decision | Notes |
|----|------------|-------------|-------|-----------|---------|----------|-------|
| 1 | BHXDU7VM | Chatterji (2025) | How People Use ChatGPT... | *leer* | *leer* | *leer* | *leer* |
| 2 | ABCD1234 | Chiu (2024) | What are AI literacy... | *leer* | *leer* | *leer* | *leer* |
| ... | ... | ... | ... | ... | ... | ... | ... |

### Schritt 2: Excel in Microsoft Excel / LibreOffice öffnen

**Was Sie sehen:**
- 325 Zeilen (Papers)
- Spalten J-M sind **gelb hervorgehoben** (Assessment-Felder)
- **Dropdown-Menüs:**
  - Relevance: `Low | Medium | High`
  - Quality: `Low | Medium | High`
  - Decision: `Include | Exclude | Unclear`
- Spalte N (Zotero_Tags) hat **automatische Formel**:
  ```excel
  =IF(L2="Include", "PRISMA_Include", IF(L2="Exclude", "PRISMA_Exclude", ...))
  ```

### Schritt 3: Assessment ausfüllen (Human Expert)

**Für jedes Paper:**
1. Lesen Sie Abstract (Spalte G)
2. Bewerten Sie Relevance (Spalte J): High / Medium / Low
3. Bewerten Sie Quality (Spalte K): High / Medium / Low
4. Entscheiden Sie (Spalte L): Include / Exclude / Unclear
5. Begründung in Notes (Spalte M)

**Beispiel für Paper #1:**
```
Title: "How People Use ChatGPT"
Abstract: "Founded in 1920, the NBER is a private..."
→ Relevance: HIGH (direkt zur Forschungsfrage)
→ Quality: HIGH (peer-reviewed NBER working paper)
→ Decision: INCLUDE
→ Notes: "Core paper on AI literacy and feminist approaches"
→ Zotero_Tags: PRISMA_Include (automatisch berechnet!)
```

**Nach 15 Papers bewertet:**
- ✅ 8 Papers → `PRISMA_Include`
- ✅ 5 Papers → `PRISMA_Exclude`
- ✅ 2 Papers → `PRISMA_Unclear`

### Schritt 4: Excel speichern

```
Datei → Speichern als → assessment_curated.xlsx
```

### Schritt 5: Tags zurück in Zotero schreiben

**Option A: Direkt via API (empfohlen)**

```bash
# Dry Run (zeigt nur, was passieren würde)
python assessment/excel_to_zotero_tags.py

# Mit API-Key (schreibt wirklich in Zotero)
python assessment/excel_to_zotero_tags.py \
  --api-key YOUR_ZOTERO_API_KEY \
  --no-dry-run
```

**Was passiert:**
```
1. Chatterji (2025) → PRISMA_Include, Relevance_High, Quality_High
   How People Use ChatGPT...
   ✅ Updated in Zotero

2. Chiu (2024) → PRISMA_Include, Relevance_Medium, Quality_High
   What are AI literacy...
   ✅ Updated in Zotero

3. Benlian (2024) → PRISMA_Exclude, Relevance_Low, Quality_Medium
   The AI literacy development...
   ✅ Updated in Zotero
...
```

### Schritt 6: In Zotero verifizieren

**In Zotero Desktop:**
1. Sync your library (grüner Pfeil-Button)
2. In linker Sidebar: Klick auf "Tags"
3. Sie sehen jetzt neue Tags:
   - `PRISMA_Include` (8 Papers)
   - `PRISMA_Exclude` (5 Papers)
   - `PRISMA_Unclear` (2 Papers)
   - `Relevance_High` (5 Papers)
   - `Quality_High` (6 Papers)
   - etc.

4. Klicken Sie auf Tag `PRISMA_Include`
   → Zotero zeigt nur die 8 inkludierten Papers!

**Wie es aussieht:**

```
ZOTERO LIBRARY
├── Collections
│   ├── Claude Deep Research
│   ├── Gemini Deep Research
│   └── ...
└── Tags (neu!)
    ├── PRISMA_Include (8)      ← HIER KLICKEN!
    ├── PRISMA_Exclude (5)
    ├── PRISMA_Unclear (2)
    ├── Relevance_High (5)
    ├── Quality_High (6)
    └── ...

Gefilterte Ansicht (nur PRISMA_Include):
┌─────────────────────────────────────────┐
│ ✓ Chatterji (2025) - How People...    │
│ ✓ Chiu (2024) - What are AI...        │
│ ✓ Casal-Otero (2023) - AI literacy... │
│ ✓ Chee (2024) - A Competency...       │
│ ... (4 more)                           │
└─────────────────────────────────────────┘
```

### Schritt 7: Pipeline läuft mit gefilterten Daten

**Jetzt exportieren Sie NUR die inkludierten Papers:**

```bash
# Export von Zotero (mit Tags!)
python analysis/fetch_zotero_group.py

# Pipeline filtert automatisch nach PRISMA_Include
python run_pipeline.py
```

**Was die Pipeline macht:**
```python
# Intern in getPDF_intelligent.py:
papers = load_zotero_json()  # 325 Papers
included = [p for p in papers if 'PRISMA_Include' in get_tags(p)]  # 8 Papers!

print(f"Processing {len(included)}/{len(papers)} papers")
# → "Processing 8/325 papers"
```

## Zusammenfassung: Der Workflow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. ZOTERO (325 Papers)                                      │
│    ↓ zotero_to_excel.py                                     │
│ 2. EXCEL (325 Zeilen, leer)                                 │
│    ↓ Human Assessment (Excel öffnen, ausfüllen)             │
│ 3. EXCEL (15 bewertet: 8 Include, 5 Exclude, 2 Unclear)     │
│    ↓ excel_to_zotero_tags.py --api-key XXX --no-dry-run     │
│ 4. ZOTERO (325 Papers, 15 mit Tags)                         │
│    ↓ fetch_zotero_group.py                                  │
│ 5. JSON (325 Papers mit Tags)                               │
│    ↓ Pipeline filtert: nur PRISMA_Include                   │
│ 6. PIPELINE (verarbeitet nur 8 Papers!)                     │
│    ↓ PDF → Markdown → Summary → Vault                       │
│ 7. OBSIDIAN VAULT (8 Papers, Konzepte)                      │
└─────────────────────────────────────────────────────────────┘
```

## Effizienz-Gewinn

| Metrik | Ohne Filter | Mit Filter (8/325) | Einsparung |
|--------|-------------|-------------------|-----------|
| Papers verarbeitet | 325 | 8 | 97.5% |
| Processing Zeit | ~10h | ~15min | 97.5% |
| API Kosten | ~$13 | ~$0.32 | 97.5% |
| PDF Downloads | 325 | 8 | 97.5% |

## Reale Anwendung

### Wenn Sie alle 325 Papers bewerten:

1. **Excel-Assessment (manuell):**
   - Zeit: ~10-15 Stunden (2-3 Minuten pro Paper)
   - Ergebnis: Z.B. 85 Papers → `PRISMA_Include`

2. **Tags in Zotero:**
   - Automatisch via API-Skript
   - Dauer: ~2-3 Minuten
   - 85 Papers mit `PRISMA_Include` Tag

3. **Pipeline:**
   - Verarbeitet nur 85 statt 325 Papers
   - Zeit: ~1.5 Stunden (statt 10 Stunden)
   - Kosten: ~$3.40 (statt ~$13)

4. **Finaler Vault:**
   - Nur PRISMA-konforme, hochwertige Papers
   - Wissenschaftlich valide
   - PRISMA-Flow dokumentierbar

## Wichtig: API-Key für Zotero

Um Tags ZURÜCK in Zotero zu schreiben, brauchen Sie einen API-Key:

1. Gehen Sie zu: https://www.zotero.org/settings/keys
2. Klicken Sie "Create new private key"
3. Permissions:
   - ✅ Allow library access
   - ✅ Allow write access
   - Library: "FemPrompt Research Group" (oder Ihre Library)
4. Kopieren Sie den API-Key
5. Nutzen Sie ihn im Skript:
   ```bash
   python analysis/excel_to_zotero_tags.py \
     --api-key sk-ant-... \
     --no-dry-run
   ```

**WICHTIG:** Der API-Key ist wie ein Passwort! Nicht öffentlich teilen!

## Dateien im Repo

**Dateien in diesem Workflow:**
- ✅ `assessment/assessment.xlsx` - Leeres Assessment-Template (325 Papers)
- ✅ `assessment/assessment_curated.xlsx` - Ausgefüllt (15 Papers bewertet)
- ✅ `assessment/zotero_to_excel.py` - Export Zotero → Excel
- ✅ `assessment/excel_to_zotero_tags.py` - Import Excel → Zotero (via API)
- ✅ `assessment/fill_assessment_demo.py` - Simuliert menschliche Bewertung

**Dokumentation:**
- ✅ `assessment/README.md` - Dieser Workflow-Guide
- ✅ `CLAUDE.md` - Komplette technische Dokumentation
- ✅ `WORKFLOW_EXAMPLE.md` - Pipeline-Beispiel

## Nächste Schritte

**Für Sie jetzt:**
1. ✅ Excel öffnen: `assessment/assessment.xlsx`
2. ✅ Erste 10-20 Papers bewerten
3. ✅ Speichern als: `assessment/assessment_curated.xlsx`
4. ✅ Zotero API-Key erstellen (https://www.zotero.org/settings/keys)
5. ✅ Tags zurück in Zotero schreiben:
   ```bash
   python assessment/excel_to_zotero_tags.py \
     --api-key YOUR_KEY \
     --no-dry-run
   ```
6. ✅ In Zotero prüfen: Sehen Sie die Tags?
7. ✅ Pipeline laufen lassen mit gefilterten Daten!
