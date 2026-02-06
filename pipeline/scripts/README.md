# Pipeline Scripts

Scripts fuer die Verarbeitungspipeline: PDF → Markdown → Knowledge → Vault

## Workflow

```
1. download_zotero_pdfs.py      # PDFs von Zotero holen
         |
2. convert_to_markdown.py       # PDF → Markdown (mit Docling)
         |
3. validate_markdown_enhanced.py # Multi-Layer Validierung
         |
4. postprocess_markdown.py      # Artefakt-Bereinigung
         |
5. distill_knowledge.py         # Knowledge Distillation (3-Stage)
         |
6. generate_vault.py            # Obsidian Vault erstellen
```

## Scripts

| Script | Funktion | Status |
|--------|----------|--------|
| `download_zotero_pdfs.py` | PDFs von Zotero herunterladen | Fertig |
| `convert_to_markdown.py` | PDFs zu Markdown (Docling) | Fertig |
| `validate_markdown_enhanced.py` | Multi-Layer Validierung + PDF-Vergleich | Fertig |
| `postprocess_markdown.py` | Konservative Artefakt-Bereinigung | Fertig |
| `distill_knowledge.py` | Knowledge Distillation (3-Stage) | Fertig (249 Docs) |
| `generate_vault.py` | Obsidian Vault generieren | Ausstehend |
| `validate_knowledge_docs.py` | Knowledge-Dokumente verifizieren | Fertig |
| `utils.py` | Hilfsfunktionen (Logging, API, Config) | Aktiv |

## Verwendung

Alle Scripts haben `--help` fuer Parameter-Dokumentation.

```bash
# PDFs von Zotero herunterladen
python pipeline/scripts/download_zotero_pdfs.py --output pipeline/pdfs/

# Markdown konvertieren
python pipeline/scripts/convert_to_markdown.py --input pipeline/pdfs/ --output pipeline/markdown/

# Validierung
python pipeline/scripts/validate_markdown_enhanced.py --md-dir pipeline/markdown --pdf-dir pipeline/pdfs

# Post-Processing
python pipeline/scripts/postprocess_markdown.py --input-dir pipeline/markdown --output-dir pipeline/markdown_clean

# Knowledge Distillation
python pipeline/scripts/distill_knowledge.py --input pipeline/markdown --output pipeline/knowledge/distilled

# Vault generieren
python pipeline/scripts/generate_vault.py --input pipeline/knowledge/distilled --output vault/
```

## Konfiguration

Credentials in `.env`:

```
ANTHROPIC_API_KEY=...     # Fuer Knowledge Distillation
ZOTERO_API_KEY=...        # Fuer Zotero-Download
ZOTERO_LIBRARY_ID=...     # Zotero Group ID
```

Defaults in `config/defaults.yaml`.

---

*Version: 2.0 (2026-02-06)*
