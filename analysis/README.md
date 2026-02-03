# Analysis Scripts

Hilfsskripte und Tools für die Literature Review Pipeline.

**Hinweis:** Die Hauptpipeline-Scripts befinden sich in `pipeline/scripts/`.

## Aktive Scripts

| Script | Funktion |
|--------|----------|
| `validate_markdown_quality.py` | Markdown-Qualitätsprüfung |
| `validate_vault.py` | Vault-Konsistenz prüfen |
| `utils.py` | Gemeinsame Hilfsfunktionen |
| `fetch_zotero_group.py` | Zotero API Zugriff |

## Konvertierungs-Tools

| Script | Funktion |
|--------|----------|
| `excel_to_ris.py` | Excel → RIS Format |
| `ris_to_excel.py` | RIS → Excel Format |

## Vault-Erweiterungen

| Script | Funktion |
|--------|----------|
| `generate_research_vault_with_assessment.py` | Vault mit Assessment-Daten |
| `export_vault_to_web_data.py` | Vault für Web-Interface |
| `export_vault_to_single_file.py` | Vault als einzelne Datei |
| `extract_concepts_from_summaries.py` | Konzept-Extraktion |
| `sync_summary_metadata.py` | Metadaten synchronisieren |
| `create_bidirectional_concept_links.py` | Verlinkungen erstellen |

## Test-Scripts

| Script | Funktion |
|--------|----------|
| `test_assessment_workflow.py` | Assessment-Workflow testen |
| `test_pipeline_comprehensive.py` | Pipeline-Gesamttest |
| `test_prisma_filter.py` | PRISMA-Filter testen |
| `test_vault_quality.py` | Vault-Qualität testen |

## Entfernte Scripts (jetzt in pipeline/scripts/)

Die folgenden Scripts wurden entfernt und durch modernere Versionen in `pipeline/scripts/` ersetzt:

| Entfernt | Ersetzt durch |
|----------|---------------|
| `getPDF_intelligent.py` | `pipeline/scripts/download_zotero_pdfs.py` |
| `pdf-to-md-converter.py` | `pipeline/scripts/convert_to_markdown.py` |
| `summarize_documents_enhanced.py` | `pipeline/scripts/summarize_documents.py` |
| `generate_obsidian_vault_improved.py` | `pipeline/scripts/generate_vault.py` |
| `_legacy/summarize-documents.py` | `pipeline/scripts/summarize_documents.py` |
