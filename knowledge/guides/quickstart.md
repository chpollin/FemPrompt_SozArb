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

### 1. LLM-basiertes PRISMA-Assessment

Das Script `assessment-llm/assess_papers.py` bewertet Papers automatisch.

**Aufruf:** `python assessment-llm/assess_papers.py -i input.xlsx -o output.xlsx`

**Input:** Excel mit Paper-Metadaten (Titel, Abstract)
**Output:** Excel mit Decision (Include/Exclude/Unclear) und Scores

Performance: ~325 Papers in 24 min, $0.58, 100% Erfolgsrate

### 2. PDF-Akquise

Das Script `pipeline/scripts/download_zotero_pdfs.py` laedt PDFs von Zotero:

**Aufruf:** `python pipeline/scripts/download_zotero_pdfs.py --output pipeline/pdfs/`

**Ergebnis:** 257/326 PDFs heruntergeladen (78.8%)

### 3. Einzelne Stages ausfuehren

Alle Pipeline-Scripts befinden sich in `pipeline/scripts/`:

| Stage | Script | Wichtige Parameter |
|-------|--------|-------------------|
| 1 | `download_zotero_pdfs.py` | `--output pipeline/pdfs/` |
| 2 | `convert_to_markdown.py` | `--input pipeline/pdfs/ --output pipeline/markdown/` |
| 2b | `validate_markdown_enhanced.py` | `--md-dir pipeline/markdown --pdf-dir pipeline/pdfs` |
| 3 | `postprocess_markdown.py` | `--input-dir pipeline/markdown --output-dir pipeline/markdown_clean` |
| 4 | `distill_knowledge.py` | `--input pipeline/markdown --output pipeline/knowledge/distilled` |
| 5 | `generate_vault.py` | `--input pipeline/knowledge/distilled --output vault/` |

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

1. **Mehr lernen:** [technical.md](../technical.md)
2. **Status pruefen:** [status.md](../status.md)
3. **Forschungskontext:** [project.md](../project.md)

---

*Aktualisiert: 2026-02-06*
