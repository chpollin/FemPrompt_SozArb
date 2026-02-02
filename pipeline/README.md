# Pipeline: PDF → Markdown → Summary → Vault

Gemeinsame Verarbeitungspipeline fuer beide Assessment-Tracks.

## Uebersicht

```
corpus/papers_metadata.csv
        ↓
[Include-Filter aus Benchmark]
        ↓
pipeline/scripts/acquire_pdfs.py     → pipeline/pdfs/
        ↓
pipeline/scripts/convert_to_markdown.py → pipeline/markdown/
        ↓
pipeline/scripts/validate_markdown.py   (Qualitaetspruefung)
        ↓
pipeline/scripts/summarize_documents.py → pipeline/summaries/
        ↓
pipeline/scripts/generate_vault.py   → vault/
```

## Scripts

### 1. acquire_pdfs.py

Hierarchische PDF-Akquise mit 8 Fallback-Strategien.

```bash
python scripts/acquire_pdfs.py \
  --input ../corpus/papers_metadata.csv \
  --output pdfs/ \
  --filter-decision Include
```

### 2. convert_to_markdown.py

PDF zu Markdown Konversion mit Docling.

```bash
python scripts/convert_to_markdown.py \
  --input pdfs/ \
  --output markdown/
```

### 3. validate_markdown.py

Qualitaetspruefung der Markdown-Dateien.

```bash
python scripts/validate_markdown.py \
  --input markdown/ \
  --output validation_report.csv
```

### 4. summarize_documents.py

LLM-basierte Summarisierung (Enhanced v2.0).

```bash
python scripts/summarize_documents.py \
  --input markdown/ \
  --output summaries/
```

### 5. generate_vault.py

Obsidian Vault Generierung mit Assessment-Provenienz.

```bash
python scripts/generate_vault.py \
  --summaries summaries/ \
  --assessment ../benchmark/data/merged_comparison.csv \
  --output ../vault/
```

## Verzeichnisse

```
pipeline/
├── README.md          # Diese Datei
├── scripts/
│   ├── acquire_pdfs.py
│   ├── convert_to_markdown.py
│   ├── validate_markdown.py
│   ├── summarize_documents.py
│   ├── generate_vault.py
│   └── utils.py
├── pdfs/              # Heruntergeladene PDFs
├── markdown/          # Konvertierte Markdown-Dateien
└── summaries/         # LLM-generierte Zusammenfassungen
```

## Kosten-Schaetzung

| Schritt | Kosten pro Paper |
|---------|------------------|
| PDF-Akquise | $0 |
| Markdown-Konversion | $0 |
| Summarisierung | ~$0.04 |
| Vault-Generierung | $0 |

Fuer 200 Include-Papers: ~$8

---

*Version: 1.0 (2026-02-02)*
