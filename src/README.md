# src/

Pipeline and analysis scripts for the literature review. The canonical description of the method and every script's role is `knowledge/methods.md`; this file is only the directory index.

## Layout

```
src/
├── acquire/   # PDF acquisition and Markdown conversion
├── distill/   # 3-stage knowledge distillation and the human review tool
├── assess/    # dual-track assessment and benchmark scripts (see assess/README.md)
├── publish/   # generators for the Evidence Companion, vault, and screening index
├── replay/    # committed round-1 replay (see replay/README.md)
└── utils.py   # shared helpers (logging, API, config, Windows UTF-8)
```

## Main flow

```
corpus/zotero_export.json
  → acquire/download_zotero_pdfs.py | acquire/acquire_pdfs.py   → generated/pdfs/
  → acquire/convert_to_markdown.py (Docling)                    → generated/markdown/
  → acquire/validate_markdown_enhanced.py                       → generated/validation_reports/
  → acquire/postprocess_markdown.py                             → generated/markdown_clean/
  → distill/markdown_reviewer.html (human review)
  → distill/distill_knowledge.py (3-stage SKE)                  → generated/distilled/
  → publish/generate_vault_v2.py                                → generated/vault/, docs/vault/Papers/
  → publish/generate_docs_data.py, generate_promptotyping_data_v2.py,
    build_screening_index.py                                    → docs/data/
```

Beside the pipeline: `assess/` produces and compares the assessment tracks (`assessment/`, `generated/benchmark-results/`), and `replay/replay_round1.py` re-derives the retrospective PRISMA flow and agreement figures from the raw CSVs with a self-test against the canonical benchmark (`generated/benchmark-results/replay/`).

The loss chain across acquisition, conversion, and distillation is quantified in the data (`generated/benchmark-results/`, `docs/data/`) and the Evidence Companion.
