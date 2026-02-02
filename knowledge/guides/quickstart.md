# Quickstart Guide

10-Minuten-Einstieg in die FemPrompt/SozArb Literature Research Pipeline.

---

## Installation

```bash
git clone <repo-url>
cd FemPrompt_SozArb
pip install -r requirements.txt
```

### Umgebungsvariablen

```bash
# Unix/Linux/macOS
export ANTHROPIC_API_KEY="sk-ant-your-key"

# Windows PowerShell
$env:ANTHROPIC_API_KEY="sk-ant-your-key"
```

---

## Quick Run Examples

### 1. Komplette Pipeline (automatisiert)

```bash
python run_pipeline.py

# Stages:
# 1. PDF-Akquise (Zotero + APIs)
# 2. PDF → Markdown (Docling)
# 3. AI-Summarisierung (Claude Haiku 4.5)
# 4. Knowledge Graph (Obsidian Vault)
# 5. Qualitaets-Validierung
```

### 2. LLM-basiertes PRISMA-Assessment

```bash
python assessment-llm/assess_papers.py \
  --input assessment-llm/input/papers.xlsx \
  --output assessment-llm/output/assessment.xlsx

# ~325 Papers in 24 min, $0.58, 100% Erfolgsrate
```

### 3. PDF-Akquise (PRISMA-gefiltert)

```bash
python analysis/getPDF_intelligent.py \
  --input assessment.xlsx \
  --output analysis/pdfs/ \
  --filter-decision Include
```

### 4. Manuelle Stage-Ausfuehrung

```bash
# Stage 1: PDFs akquirieren
python analysis/getPDF_intelligent.py --input assessment.xlsx --output analysis/pdfs/

# Stage 2: Markdown konvertieren
python analysis/pdf-to-md-converter.py --pdf-dir analysis/pdfs/ --output-dir analysis/markdown_papers/

# Stage 2b: Qualitaet validieren (spart API-Kosten!)
python analysis/validate_markdown_quality.py --input-dir analysis/markdown_papers/

# Stage 3: Summaries generieren
python analysis/summarize_documents_enhanced.py --input-dir analysis/markdown_papers/ --output-dir analysis/summaries_final/

# Stage 4: Vault erstellen
python analysis/generate_obsidian_vault_improved.py --input-dir analysis/summaries_final/ --output-dir FemPrompt_Vault/

# Stage 5: Qualitaet pruefen
python analysis/test_vault_quality.py --vault-dir FemPrompt_Vault/
```

---

## Pipeline-Optionen

```bash
# Nach Unterbrechung fortsetzen
python run_pipeline.py --resume

# Nur bestimmte Stages
python run_pipeline.py --stages acquire_pdfs,summarize

# Stages ueberspringen
python run_pipeline.py --skip convert_pdfs

# Vorschau (ohne Ausfuehrung)
python run_pipeline.py --dry-run

# Verbose Output
python run_pipeline.py -v
```

---

## Performance-Schaetzung

Fuer ~200 Include-Papers:

| Stage | Dauer | Kosten | Erfolgsrate |
|-------|-------|--------|-------------|
| LLM Assessment | 24 min | $0.58 | 100% |
| PDF-Akquise | 1-2 h | $0 | 70-80% |
| Markdown-Konversion | 2-3 h | $0 | ~100% |
| AI-Summarisierung | 6-7 h | $8-9 | ~100% |
| Vault-Generierung | <1 min | $0 | 100% |
| **Gesamt** | **~10 h** | **~$10** | **~75%** |

**Modell:** Claude Haiku 4.5

---

## Troubleshooting

### HTTP 429 (Rate Limit)

```python
# In summarize-documents.py:
time.sleep(5)  # von 2 auf 5 erhoehen
```

### Fehlende PDFs

Logs pruefen: `acquisition_log.json`, `missing_pdfs.csv`

### Memory Error bei PDF-Konversion

Kleinere Batches verarbeiten (5 PDFs pro Durchlauf).

---

## Naechste Schritte

1. **Mehr lernen:** [04-technical.md](../04-technical.md)
2. **Status pruefen:** [03-status.md](../03-status.md)
3. **Forschungskontext:** [01-project.md](../01-project.md)

---

*Version: 4.0 (2026-02-02)*
