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
7. scripts/generate_vault_v2.py → vault/, docs/vault/Papers/
```

## Scripts (pipeline/scripts/)

| Script | Beschreibung | Status |
|--------|--------------|--------|
| `download_zotero_pdfs.py` | PDFs von Zotero herunterladen | Fertig |
| `convert_to_markdown.py` | PDF→Markdown mit Docling | Fertig |
| `validate_markdown_enhanced.py` | Multi-Layer Validierung | Fertig |
| `postprocess_markdown.py` | Artefakt-Bereinigung | Fertig |
| `distill_knowledge.py` | Knowledge Distillation (3-Stage) | Fertig |
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
├── pdfs/                   # akquirierte PDFs
├── markdown/               # konvertierte Markdown-Dateien
├── markdown_clean/         # Bereinigte Markdowns
├── knowledge/distilled/    # destillierte Wissensdokumente
└── validation_reports/     # Validierungsberichte
```

Die Verlustkette ueber Akquise, Konversion und Distillation sowie die zugehoerigen Zaehlungen liegen in den Daten (`benchmark/results/`, `docs/data/`) und im Evidence Companion, der sie rendert.

---

*Version: 2.0 (2026-02-06)*
