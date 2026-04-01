# Quickstart Guide

10-minute introduction to the literature review pipeline.

---

## Installation

1. Clone repository
2. Run `pip install -r requirements.txt`
3. Set API keys in `.env` file:
   - `ANTHROPIC_API_KEY` for Claude API
   - `ZOTERO_API_KEY` for Zotero API (optional)

---

## Pipeline Overview

The pipeline has 7 stages. All scripts are in `pipeline/scripts/`.

| Stage | Script | Input | Output | Cost |
|-------|--------|-------|--------|------|
| 1. PDF Acquisition | `download_zotero_pdfs.py` | Zotero API | `pipeline/pdfs/` | $0 |
| 2. Markdown Conversion | `convert_to_markdown.py` | PDFs | `pipeline/markdown/` | $0 |
| 3. Validation | `validate_markdown_enhanced.py` | Markdown + PDFs | Validation Reports | $0 |
| 4. Post-Processing | `postprocess_markdown.py` | Markdown | `pipeline/markdown_clean/` | $0 |
| 5. Knowledge Distillation | `distill_knowledge.py` | Markdown | `pipeline/knowledge/distilled/` | ~$7 |
| 6. LLM Assessment (10K) | `benchmark/scripts/run_llm_assessment.py` | Knowledge Docs | `benchmark/data/llm_assessment_10k.csv` | $1.44 |
| 7. Vault Generation | `generate_vault.py` | Knowledge Docs + Assessment CSVs | `vault/` + `docs/downloads/vault.zip` | $0 |

**Total cost:** ~$10.17 (Claude Haiku 4.5)

---

## Key Commands

### Knowledge Distillation (3-Stage)

```bash
python pipeline/scripts/distill_knowledge.py --input pipeline/markdown --output pipeline/knowledge/distilled --limit 5
```

Three stages: (1) LLM extracts JSON, (2) deterministic formatting, (3) LLM-as-a-Judge verification. Result: 249 knowledge documents, 97.2% with score ≥ 75.

### LLM Assessment (10K Benchmark)

```bash
python benchmark/scripts/run_llm_assessment.py
```

10 binary categories (4 technical + 6 social), inclusion logic (min. 1 technical AND min. 1 social). 326/326 papers, $1.44.

### Vault Generation (with Assessment Integration)

```bash
python pipeline/scripts/generate_vault.py --clean
```

Reads knowledge documents, Zotero metadata, and both assessment CSVs (LLM + Human). Generates Obsidian vault with YAML frontmatter including `llm_decision`, `human_decision`, `agreement`. 249 papers, 205 with assessment data, 79 concept notes.

### SPA Data Generation

```bash
python pipeline/scripts/generate_docs_data.py
```

Generates `docs/data/research_vault_v2.json` for the single-page application.

**GitHub Pages:** https://chpollin.github.io/FemPrompt_SozArb/

---

## Dual Assessment System

| Track | Method | Schema | Status |
|-------|--------|--------|--------|
| **Human** | Google Sheets → CSV Export | 10 binary categories | Complete (303/303, 142 Include, 161 Exclude) |
| **LLM** | Claude Haiku 4.5 | 10 binary categories | 326/326 (100%) |

Benchmark results (291 papers, Zotero_Key merge): Confusion matrix (100/34/108/49), base rates (LLM 71.5% vs. Human 46.0% include), Cohen's Kappa = 0.056.

---

## Performance

| Operation | Duration | Cost | Success Rate |
|-----------|----------|------|--------------|
| PDF Acquisition | 1–2 h | $0 | 78.8% (257/326) |
| Markdown Conversion | 2–3 h | $0 | 98% (252/257) |
| Knowledge Distillation | 6–7 h | ~$7 | 100% (249/249) |
| LLM Assessment (10K) | ~30 min | $1.44 | 100% (326/326) |
| Vault Generation | <1 min | $0 | 100% |
| **Total** | **~10 h** | **~$10.17** | — |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| HTTP 429 (Rate Limit) | Increase delay between API calls |
| Missing PDFs | Check logs: `acquisition_log.json` |
| Memory Error | Use smaller batches (`--limit 5`) |
| NaN Error | Check `isinstance(value, str)` before regex |

---

## Next Steps

1. **Methods:** [methods-and-pipeline.md](../methods-and-pipeline.md)
2. **Status:** [status.md](../status.md)
3. **Project context:** [project.md](../project.md)
4. **Paper integrity:** [paper-integrity.md](../paper-integrity.md)

---

*Updated: 2026-04-01*
