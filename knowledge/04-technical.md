# Technische Dokumentation

Pipeline Version: 2.4
Letzte Aktualisierung: 2026-02-03

---

## System-Anforderungen

### Software

- Python 3.8+
- Windows 10/11, macOS 10.14+, Linux

### Python-Pakete

```bash
pip install -r requirements.txt

# Kern-Pakete:
pip install anthropic>=0.68.0       # Claude API
pip install pandas openpyxl         # Excel
pip install pyzotero>=1.5.0         # Zotero API
pip install docling>=2.60.0         # PDF-Konversion
pip install pdfplumber>=0.10.0      # PDF-Analyse (NEU)
pip install python-dotenv>=1.0.0    # Environment
```

### Umgebungsvariablen

```bash
# .env Datei (empfohlen):
ANTHROPIC_API_KEY=sk-ant-your-key
ZOTERO_API_KEY=your-zotero-key
```

---

## Pipeline-Architektur

### Empfohlener Workflow (NEU)

```bash
# 1. PDFs von Zotero herunterladen
python pipeline/scripts/download_zotero_pdfs.py --output pipeline/pdfs/

# 2. Markdown konvertieren
python pipeline/scripts/convert_to_markdown.py --input pipeline/pdfs/ --output pipeline/markdown/

# 3. Validierung (Enhanced)
python pipeline/scripts/validate_markdown_enhanced.py \
  --md-dir pipeline/markdown \
  --pdf-dir pipeline/pdfs \
  --output-dir pipeline/validation_reports

# 4. Post-Processing (optional)
python pipeline/scripts/postprocess_markdown.py \
  --input-dir pipeline/markdown \
  --output-dir pipeline/markdown_clean

# 5. Human Review (optional) - Live Server in VS Code
# Oeffne: pipeline/tools/markdown_reviewer.html

# 6. LLM-Summarisierung
python pipeline/scripts/summarize_documents.py \
  --input pipeline/markdown_clean/ \
  --output pipeline/summaries/

# 7. Vault-Generierung
python pipeline/scripts/generate_vault.py \
  --input pipeline/summaries/ \
  --output vault/
```

---

## Script-Referenz

### Pipeline Scripts (pipeline/scripts/)

| Script | Funktion | Status |
|--------|----------|--------|
| `download_zotero_pdfs.py` | PDFs von Zotero herunterladen | ✅ Getestet |
| `convert_to_markdown.py` | PDF→Markdown mit Docling | ✅ Getestet |
| `validate_markdown.py` | Basis-Validierung (GLYPH, Unicode) | ✅ Getestet |
| `validate_markdown_enhanced.py` | Multi-Layer Validierung + PDF-Vergleich | ✅ Getestet |
| `postprocess_markdown.py` | Konservative Artefakt-Bereinigung | ✅ Getestet |
| `summarize_documents.py` | LLM-Summarisierung | Ausstehend |
| `generate_vault.py` | Obsidian Vault generieren | Ausstehend |
| `utils.py` | Hilfsfunktionen | ✅ Aktiv |

### Pipeline Tools (pipeline/tools/)

| Tool | Funktion |
|------|----------|
| `markdown_reviewer.html` | Browser-Tool fuer Human-in-the-Loop Review |

### Assessment

| Script | Funktion |
|--------|----------|
| assessment-llm/assess_papers.py | LLM-basiertes PRISMA-Assessment |
| assessment/create_thematic_assessment.py | Excel fuer manuelles Assessment |
| benchmark/scripts/run_llm_assessment.py | Benchmark-Assessment (10 Kategorien) |

---

## Validierung & Post-Processing (NEU)

### validate_markdown_enhanced.py

Multi-Layer Validierungssystem:

| Layer | Pruefung | Schwellwert |
|-------|----------|-------------|
| 1. Syntaktisch | GLYPH-Placeholder | max 50 |
| 1. Syntaktisch | Unicode-Fehler | max 5% |
| 2. Strukturell | Character-Ratio (MD/PDF) | min 0.7 |
| 2. Strukturell | Tabellen-Mismatch | Flag wenn >2 Differenz |
| 3. Semantisch | LLM Spot-Check | Optional, 10% Sample |
| 4. Manual | Review Queue | Priorisiert nach Konfidenz |

**Output-Dateien:**
- `validation_report_*.json` - Maschinenlesbar
- `validation_summary_*.csv` - Tabellenkalkulation
- `validation_report_*.md` - Menschenlesbar
- `manual_review_queue_*.csv` - Priorisierte Review-Liste

### postprocess_markdown.py

Konservative Bereinigung:

| Operation | Beschreibung | Sicherheit |
|-----------|--------------|------------|
| Hyphenation-Fix | Silbentrennungen zusammenfuegen | ✅ Sicher |
| Page Number Removal | Verwaiste Seitenzahlen entfernen | ✅ Sicher |
| Header Removal | Journal-Header (>10x + Pattern) | ⚠️ Konservativ |
| Newline Normalization | Max 2 Leerzeilen | ✅ Sicher |
| All-Caps Removal | **DEAKTIVIERT** | ❌ Zu riskant |

**Wichtig:** All-Caps-Entfernung ist deaktiviert, da strukturierte Dokumente (z.B. DigComp Framework) legitime Wiederholungen enthalten koennen.

### markdown_reviewer.html

Browser-Tool fuer Human-in-the-Loop Review:

**Features:**
- PDF und Markdown nebeneinander
- PASS/WARN/FAIL Bewertung
- Filter: Alle / Offen / Warn
- Fortschrittsanzeige
- Export als JSON
- LocalStorage-Persistenz

**Keyboard-Shortcuts:**
- `1` PASS | `2` WARN | `3` FAIL
- `←` `→` Navigation
- `L` Liste ein/ausblenden

---

## Verzeichnisstruktur

```
FemPrompt_SozArb/
  pipeline/
    scripts/                 # Python-Scripts
      download_zotero_pdfs.py
      convert_to_markdown.py
      validate_markdown.py
      validate_markdown_enhanced.py
      postprocess_markdown.py
      summarize_documents.py
      generate_vault.py
      utils.py
    tools/                   # Browser-Tools
      markdown_reviewer.html
    pdfs/                    # Downloaded PDFs (234)
    markdown/                # Konvertierte Dokumente (232)
    markdown_clean/          # Post-Processed Dokumente
    validation_reports/      # Validierungsberichte
    summaries/               # AI Summaries (ausstehend)

  benchmark/                 # Human-LLM Benchmark
    config/categories.yaml
    scripts/
    data/

  knowledge/                 # Dokumentation
    01-project.md
    02-methodology.md
    03-status.md
    04-technical.md
    paper/
    guides/
    reference/

  FemPrompt_Vault/           # Obsidian Vault
```

---

## Performance & Kosten

### PDF→Markdown Pipeline (2026-02-03)

| Phase | Ergebnis | Dauer |
|-------|----------|-------|
| PDF-Download | 234/306 PDFs | ~10 min |
| Markdown-Konversion | 232/234 (99.1%) | ~45 min |
| Validierung (Enhanced) | 136 PASS, 96 WARNING | ~5 min |
| Post-Processing | 107k Zeichen bereinigt | ~2 min |

### Validierungsergebnisse

| Metrik | Wert |
|--------|------|
| Konfidenz-Score (Durchschnitt) | 98.7/100 |
| Artefakt-Score (Durchschnitt) | 4.5/100 |
| Character-Ratio (Durchschnitt) | 1.13 |
| Tabellen-Mismatch | 94 Dokumente (40.5%) |
| FAIL-Dokumente | 0 |

### API-Kosten

| Operation | Kosten |
|-----------|--------|
| PDF-Akquise | $0 |
| Markdown-Konversion | $0 |
| Validierung | $0 |
| Post-Processing | $0 |
| LLM-Assessment | ~$0.002/Paper |
| LLM-Summarization | ~$0.04/Paper |

**Modell:** Claude Haiku 4.5 ($1/MTok Input, $5/MTok Output)

---

## Fehlerbehandlung

### Windows-Encoding

```python
# In utils.py:
def setup_windows_encoding():
    if sys.platform == 'win32':
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
```

### HTTP 429 (Rate Limit)

```python
time.sleep(5)  # Erhoehen von 2 auf 5
```

### Fehlgeschlagene Konvertierungen (2)

- `Browne_2023_Feminist_AI_Critical_Perspectives_on_Algorithms,.pdf`
- `Ulnicane_2024_Intersectionality_in_Artificial_Intelligence.pdf`

---

## Konfiguration

### categories.yaml (Benchmark)

```yaml
categories:
  # Technik (4)
  - AI_Literacies
  - Generative_KI
  - Prompting
  - KI_Sonstige

  # Sozial (6)
  - Soziale_Arbeit
  - Bias_Ungleichheit
  - Gender
  - Diversitaet
  - Feministisch
  - Fairness
```

---

*Version: 2.4 (2026-02-03)*
*Aktualisiert: Validierung, Post-Processing, Review-Tool hinzugefuegt*
