# Pipeline: PDF → Markdown → Knowledge → Vault

Verarbeitungspipeline fuer den Literature Review.

## Workflow

```
corpus/zotero_export.json
        |
1. download_zotero_pdfs.py     → pipeline/pdfs/
        |
2. convert_to_markdown.py      → pipeline/markdown/
        |
3. validate_markdown_enhanced.py  (Qualitaetspruefung)
        |
4. postprocess_markdown.py     → pipeline/markdown_clean/
        |
5. markdown_reviewer.html      (Human Review)
        |
6. distill_knowledge.py        → pipeline/knowledge/distilled/
        |
7. generate_vault.py           → vault/
```

## Scripts (pipeline/scripts/)

| Script | Beschreibung | Status |
|--------|--------------|--------|
| `download_zotero_pdfs.py` | PDFs von Zotero herunterladen | Fertig |
| `convert_to_markdown.py` | PDF→Markdown mit Docling | Fertig |
| `validate_markdown_enhanced.py` | Multi-Layer Validierung | Fertig |
| `postprocess_markdown.py` | Artefakt-Bereinigung | Fertig |
| `distill_knowledge.py` | Knowledge Distillation (3-Stage) | Fertig (249 Docs) |
| `generate_vault.py` | Obsidian Vault generieren | Ausstehend |
| `validate_knowledge_docs.py` | Knowledge-Dokumente verifizieren | Fertig |
| `utils.py` | Hilfsfunktionen (Logging, API, Config) | Aktiv |

## Tools (pipeline/tools/)

| Tool | Beschreibung |
|------|--------------|
| `markdown_reviewer.html` | Browser-Tool fuer Human-in-the-Loop Review |

## Verzeichnisse

```
pipeline/
├── scripts/                # Python-Scripts
├── tools/                  # Browser-Tools
├── pdfs/                   # 257 PDFs
├── markdown/               # 252 Markdown-Dateien
├── markdown_clean/         # Bereinigte Markdowns
├── knowledge/distilled/    # 249 destillierte Wissensdokumente
└── validation_reports/     # Validierungsberichte
```

## Kosten

| Schritt | Kosten pro Paper |
|---------|------------------|
| PDF-Akquise | $0 |
| Markdown-Konversion | $0 |
| Knowledge Distillation | ~$0.028 |
| Vault-Generierung | $0 |

---

*Version: 2.0 (2026-02-06)*
