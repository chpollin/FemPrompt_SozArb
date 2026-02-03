# Analysis Scripts

Legacy-Scripts aus der ursprünglichen Pipeline-Entwicklung.

**Empfehlung:** Neue Entwicklung sollte in `pipeline/scripts/` stattfinden.

## Status

| Script | Status | Ersetzt durch | Beschreibung |
|--------|--------|---------------|--------------|
| `getPDF_intelligent.py` | Legacy | `pipeline/scripts/download_zotero_pdfs.py` | PDF-Akquise |
| `pdf-to-md-converter.py` | Legacy | `pipeline/scripts/convert_to_markdown.py` | PDF→Markdown |
| `summarize_documents_enhanced.py` | Legacy | `pipeline/scripts/summarize_documents.py` | LLM-Summarisierung |
| `generate_obsidian_vault_improved.py` | Legacy | `pipeline/scripts/generate_vault.py` | Vault-Generierung |
| `validate_markdown_quality.py` | Aktiv | - | Markdown-Qualitätsprüfung |
| `validate_vault.py` | Aktiv | - | Vault-Validierung |
| `test_*.py` | Test | - | Testscripts |
| `utils.py` | Aktiv | - | Hilfsfunktionen |

## Kategorien

### PDF-Akquise
- `getPDF_intelligent.py` - Hierarchische PDF-Beschaffung (Zotero, Unpaywall, etc.)
- `fetch_zotero_group.py` - Zotero API Zugriff

### Konvertierung
- `pdf-to-md-converter.py` - PDF zu Markdown (PyMuPDF)
- `excel_to_ris.py` - Excel zu RIS Format
- `ris_to_excel.py` - RIS zu Excel Format

### Summarisierung
- `summarize_documents_enhanced.py` - LLM-basierte Zusammenfassung

### Vault-Generierung
- `generate_obsidian_vault_improved.py` - Obsidian Vault aus Summaries
- `generate_research_vault_with_assessment.py` - Vault mit Assessment-Daten
- `export_vault_to_web_data.py` - Vault für Web-Interface exportieren
- `export_vault_to_single_file.py` - Vault als einzelne Datei

### Validierung
- `validate_markdown_quality.py` - Prüft Markdown-Qualität
- `validate_vault.py` - Prüft Vault-Konsistenz

### Hilfsfunktionen
- `utils.py` - Gemeinsam genutzte Funktionen
- `extract_concepts_from_summaries.py` - Konzept-Extraktion
- `sync_summary_metadata.py` - Metadaten synchronisieren
- `create_bidirectional_concept_links.py` - Verlinkungen erstellen

### Tests
- `test_assessment_workflow.py`
- `test_pipeline_comprehensive.py`
- `test_prisma_filter.py`
- `test_vault_quality.py`

### Legacy (in `_legacy/`)
- `summarize-documents.py` - Alte Version der Summarisierung
