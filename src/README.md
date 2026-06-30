# Pipeline: PDF → Markdown → Knowledge → Vault

Verarbeitungspipeline fuer den Literature Review.

## Workflow

```
corpus/zotero_export.json
        |
1. src/acquire/download_zotero_pdfs.py     → generated/pdfs/
        |
2. src/acquire/convert_to_markdown.py      → generated/markdown/
        |
3. src/acquire/validate_markdown_enhanced.py  (Qualitaetspruefung)
        |
4. src/acquire/postprocess_markdown.py     → generated/markdown_clean/
        |
5. src/distill/markdown_reviewer.html      (Human Review)
        |
6. src/distill/distill_knowledge.py        → generated/distilled/
        |
7. src/publish/generate_vault_v2.py → generated/vault/, docs/vault/Papers/
```

## Scripts (src/acquire/, src/distill/)

| Script | Beschreibung | Status |
|--------|--------------|--------|
| `src/acquire/download_zotero_pdfs.py` | PDFs von Zotero herunterladen | Fertig |
| `src/acquire/convert_to_markdown.py` | PDF→Markdown mit Docling | Fertig |
| `src/acquire/validate_markdown_enhanced.py` | Multi-Layer Validierung | Fertig |
| `src/acquire/postprocess_markdown.py` | Artefakt-Bereinigung | Fertig |
| `src/distill/distill_knowledge.py` | Knowledge Distillation (3-Stage) | Fertig |
| `src/distill/validate_knowledge_docs.py` | Knowledge-Dokumente verifizieren | Fertig |
| `src/utils.py` | Hilfsfunktionen (Logging, API, Config) | Aktiv |

## Tools (src/distill/)

| Tool | Beschreibung |
|------|--------------|
| `src/distill/markdown_reviewer.html` | Browser-Tool fuer Human-in-the-Loop Review |

## Verzeichnisse

```
generated/
├── pdfs/                   # akquirierte PDFs
├── markdown/               # konvertierte Markdown-Dateien
├── markdown_clean/         # Bereinigte Markdowns
└── distilled/              # destillierte Wissensdokumente

src/
├── acquire/                # Akquise- und Konversions-Scripts
├── distill/                # Distillations-Scripts und Browser-Tools
└── utils.py                # Hilfsfunktionen
```

Die Verlustkette ueber Akquise, Konversion und Distillation sowie die zugehoerigen Zaehlungen liegen in den Daten (`generated/benchmark-results/`, `docs/data/`) und im Evidence Companion, der sie rendert.

---

*Version: 2.0 (2026-02-06)*
