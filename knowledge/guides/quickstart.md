# Quickstart Guide

10-Minuten-Einstieg in die Literature Review Pipeline.

---

## Installation

1. Repository klonen
2. `pip install -r requirements.txt` ausfuehren
3. API-Keys in `.env` Datei setzen:
   - `ANTHROPIC_API_KEY` fuer Claude API
   - `ZOTERO_API_KEY` fuer Zotero API (optional)

---

## Pipeline-Schritte

### 1. Komplette Pipeline (automatisiert)

Das Script `run_pipeline.py` fuehrt alle Stages sequenziell aus:
1. PDF-Akquise (Zotero + APIs)
2. PDF→Markdown (Docling)
3. AI-Summarisierung (Claude Haiku 4.5)
4. Knowledge Graph (Obsidian Vault)
5. Qualitaets-Validierung

### 2. LLM-basiertes PRISMA-Assessment

Das Script `assessment-llm/assess_papers.py` bewertet Papers automatisch.

**Aufruf:** `python assessment-llm/assess_papers.py -i input.xlsx -o output.xlsx`

**Input:** Excel mit Paper-Metadaten (Titel, Abstract)
**Output:** Excel mit Decision (Include/Exclude/Unclear) und Scores

Performance: ~325 Papers in 24 min, $0.58, 100% Erfolgsrate

### 3. PDF-Akquise

Das Script `analysis/getPDF_intelligent.py` laedt PDFs mit 8 Fallback-Strategien:
- Zotero Attachments
- DOI via CrossRef
- ArXiv, Unpaywall, Semantic Scholar, BASE
- Publisher-Parser
- URL-Suche

**Aufruf:** `python analysis/getPDF_intelligent.py --input assessment.xlsx --output analysis/pdfs/ --filter-decision Include`

### 4. Einzelne Stages ausfuehren

Alle Pipeline-Scripts befinden sich in `pipeline/scripts/`:

| Stage | Script | Wichtige Parameter |
|-------|--------|-------------------|
| 1 | `download_zotero_pdfs.py` | `--output pipeline/pdfs/` |
| 2 | `convert_to_markdown.py` | `--input pipeline/pdfs/ --output pipeline/markdown/` |
| 2b | `validate_markdown_enhanced.py` | `--md-dir pipeline/markdown --pdf-dir pipeline/pdfs --output-dir pipeline/validation_reports` |
| 3 | `summarize_documents.py` | `--input pipeline/markdown/ --output pipeline/summaries/` |
| 4 | `generate_vault.py` | `--input pipeline/summaries/ --output vault/` |
| 5 | `test_vault_quality.py` | `--vault-dir vault/` |

Vollstaendige Parameter via `--help`.

---

## Pipeline-Optionen

| Option | Beschreibung |
|--------|--------------|
| `--resume` | Nach Unterbrechung fortsetzen |
| `--stages` | Nur bestimmte Stages ausfuehren |
| `--skip` | Stages ueberspringen |
| `--dry-run` | Vorschau ohne Ausfuehrung |
| `-v` | Verbose Output |

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

| Problem | Loesung |
|---------|---------|
| HTTP 429 (Rate Limit) | Delay zwischen API-Calls erhoehen (5 statt 2 Sekunden) |
| Fehlende PDFs | Logs pruefen: `acquisition_log.json`, `missing_pdfs.csv` |
| Memory Error | Kleinere Batches verarbeiten (5 PDFs pro Durchlauf) |

---

## Naechste Schritte

1. **Mehr lernen:** [04-technical.md](../04-technical.md)
2. **Status pruefen:** [03-status.md](../03-status.md)
3. **Forschungskontext:** [01-project.md](../01-project.md)

---

*Version: 5.0 (2026-02-03)*
