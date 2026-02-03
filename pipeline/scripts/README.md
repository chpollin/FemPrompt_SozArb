# Pipeline Scripts

Scripts für die Verarbeitungspipeline: PDF → Markdown → Summary → Vault

**Stand:** 2026-02-03 | 232/234 PDFs konvertiert (99.1%)

## Übersicht

| Script | Funktion | Status | Input | Output |
|--------|----------|--------|-------|--------|
| `download_zotero_pdfs.py` | PDFs von Zotero herunterladen | ✅ | Zotero API | `pdfs/*.pdf` |
| `convert_to_markdown.py` | PDFs zu Markdown (Docling) | ✅ | `pdfs/*.pdf` | `markdown/*.md` |
| `validate_markdown.py` | Artefakt-Erkennung | ✅ | `markdown/*.md` | JSON/CSV Report |
| `summarize_documents.py` | LLM-Zusammenfassung | ⏳ | `markdown/*.md` | `summaries/*.md` |
| `generate_vault.py` | Obsidian Vault generieren | ⏳ | `summaries/*.md` | `vault/` |
| `acquire_pdfs.py` | Alternative PDF-Akquise | Legacy | CSV | `pdfs/*.pdf` |
| `utils.py` | Hilfsfunktionen | ✅ | - | - |

## Workflow

```
1. download_zotero_pdfs.py   # PDFs von Zotero holen
         ↓
2. convert_to_markdown.py    # PDF → Markdown (mit Docling)
         ↓
3. validate_markdown.py      # Qualitätsprüfung
         ↓
4. summarize_documents.py    # LLM-Zusammenfassung
         ↓
5. generate_vault.py         # Obsidian Vault erstellen
```

## Verwendung

### Alle PDFs von Zotero herunterladen

```bash
python pipeline/scripts/download_zotero_pdfs.py \
  --output pipeline/pdfs/
```

Benötigt: `ZOTERO_API_KEY` und `ZOTERO_LIBRARY_ID` in `.env`

### Markdown konvertieren

```bash
# Alle PDFs konvertieren
python pipeline/scripts/convert_to_markdown.py \
  --input pipeline/pdfs/ \
  --output pipeline/markdown/ \
  --report pipeline/conversion_report.json

# Mit Optionen
python pipeline/scripts/convert_to_markdown.py \
  --input pipeline/pdfs/ \
  --output pipeline/markdown/ \
  --skip-existing \              # Bereits konvertierte überspringen
  --limit 10 \                   # Nur erste 10 (für Tests)
  --min-quality 80               # Mindest-Qualitätsscore
```

### Qualität validieren

```bash
# Artefakt-Prüfung (GLYPH, Unicode-Fehler, Text-Ratio)
python pipeline/scripts/validate_markdown.py \
  --input-dir pipeline/markdown/ \
  --output-json pipeline/validation_report.json \
  --output-csv pipeline/validation_report.csv
```

### Dokumente zusammenfassen

```bash
python pipeline/scripts/summarize_documents.py \
  --input pipeline/markdown/ \
  --output pipeline/summaries/
```

Benötigt: `ANTHROPIC_API_KEY` in `.env`

### Vault generieren

```bash
python pipeline/scripts/generate_vault.py \
  --input pipeline/summaries/ \
  --output vault/
```

## Konfiguration

Alle Scripts lesen Credentials aus `.env`:

```
ANTHROPIC_API_KEY=...     # Für LLM-Summarisierung
ZOTERO_API_KEY=...        # Für Zotero-Download
ZOTERO_LIBRARY_ID=...     # Zotero Group ID
```
