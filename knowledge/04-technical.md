# Technische Dokumentation

Pipeline Version: 2.5
Letzte Aktualisierung: 2026-02-03

---

## System-Anforderungen

### Software

- Python 3.8+
- Windows 10/11, macOS 10.14+, Linux

### Python-Pakete

Installation via `pip install -r requirements.txt`. Kern-Pakete:

| Paket | Version | Zweck |
|-------|---------|-------|
| anthropic | >=0.68.0 | Claude API |
| pandas, openpyxl | - | Excel-Verarbeitung |
| pyzotero | >=1.5.0 | Zotero API |
| docling | >=2.60.0 | PDF-Konversion |
| pdfplumber | >=0.10.0 | PDF-Analyse |
| python-dotenv | >=1.0.0 | Environment |

### Umgebungsvariablen

In `.env` Datei (nicht committen):
- `ANTHROPIC_API_KEY` - Claude API-Schluessel
- `ZOTERO_API_KEY` - Zotero API-Schluessel

---

## Pipeline-Architektur

### Empfohlener Workflow

| Schritt | Script | Input | Output | Wichtige Parameter |
|---------|--------|-------|--------|-------------------|
| 1. PDF-Download | `download_zotero_pdfs.py` | Zotero Group | `pipeline/pdfs/` | `--output` |
| 2. Markdown-Konversion | `convert_to_markdown.py` | PDFs | `pipeline/markdown/` | `--input`, `--output` |
| 3. Validierung | `validate_markdown_enhanced.py` | Markdown + PDFs | `pipeline/validation_reports/` | `--md-dir`, `--pdf-dir`, `--output-dir` |
| 4. Post-Processing | `postprocess_markdown.py` | Markdown | `pipeline/markdown_clean/` | `--input-dir`, `--output-dir` |
| 5. Human Review | `markdown_reviewer.html` | Markdown + PDFs | JSON-Export | Via Live Server oeffnen |
| 6. Summarisierung | `summarize_documents.py` | Markdown | `pipeline/summaries/` | `--input`, `--output` |
| 7. Vault | `generate_vault.py` | Summaries | `vault/` | `--input`, `--output` |

Alle Scripts befinden sich in `pipeline/scripts/`. Vollstaendige Parameter via `--help`.

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

### Assessment Scripts

| Script | Funktion |
|--------|----------|
| `assessment-llm/assess_papers.py` | LLM-basiertes PRISMA-Assessment |
| `assessment/create_thematic_assessment.py` | Excel fuer manuelles Assessment |
| `benchmark/scripts/run_llm_assessment.py` | Benchmark-Assessment (10 Kategorien) |

---

## Validierung & Post-Processing

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

Browser-Tool fuer Human-in-the-Loop Review. Oeffnen via Live Server in VS Code.

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

| Verzeichnis | Inhalt | Dateien |
|-------------|--------|---------|
| `pipeline/scripts/` | Python-Scripts | download_zotero_pdfs.py, convert_to_markdown.py, validate_markdown.py, validate_markdown_enhanced.py, postprocess_markdown.py, summarize_documents.py, generate_vault.py, utils.py |
| `pipeline/tools/` | Browser-Tools | markdown_reviewer.html |
| `pipeline/pdfs/` | Heruntergeladene PDFs | 234 Dateien |
| `pipeline/markdown/` | Konvertierte Dokumente | 232 Dateien |
| `pipeline/markdown_clean/` | Post-Processed Dokumente | Bereinigt |
| `pipeline/validation_reports/` | Validierungsberichte | JSON, CSV, MD Reports |
| `pipeline/summaries/` | AI Summaries | Ausstehend |
| `benchmark/config/` | Benchmark-Konfiguration | categories.yaml |
| `benchmark/scripts/` | Benchmark-Scripts | run_llm_assessment.py, merge_assessments.py, calculate_agreement.py, analyze_disagreements.py |
| `benchmark/data/` | Assessment-Daten | human_assessment.csv, llm_assessment.csv, merged_comparison.csv |
| `benchmark/results/` | Ergebnisse | agreement_metrics.json, disagreement_cases.csv |
| `knowledge/` | Dokumentation | Markdown-Dateien |
| `FemPrompt_Vault/` | Obsidian Vault | Papers, Concepts, MOCs |

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

Die Funktion `setup_windows_encoding()` in `utils.py` konfiguriert UTF-8 Encoding fuer Windows-Konsolen.

### HTTP 429 (Rate Limit)

Bei Rate-Limit-Fehlern den Delay zwischen API-Calls erhoehen (Standard: 2 Sekunden, empfohlen: 5 Sekunden).

### Fehlgeschlagene Konvertierungen

2 Dokumente konnten nicht konvertiert werden:
- `Browne_2023_Feminist_AI_Critical_Perspectives_on_Algorithms,.pdf`
- `Ulnicane_2024_Intersectionality_in_Artificial_Intelligence.pdf`

---

## Konfiguration

### Assessment-Kategorien (categories.yaml)

Das Benchmark verwendet 10 binaere Kategorien:

**Technik (4):** AI_Literacies, Generative_KI, Prompting, KI_Sonstige

**Sozial (6):** Soziale_Arbeit, Bias_Ungleichheit, Gender, Diversitaet, Feministisch, Fairness

Konfigurationsdatei: `benchmark/config/categories.yaml`

---

*Version: 2.5 (2026-02-03)*
