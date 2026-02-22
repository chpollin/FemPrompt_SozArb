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

## Pipeline-Uebersicht

Die Pipeline hat 7 Stufen. Alle Scripts befinden sich in `pipeline/scripts/`.

| Stufe | Script | Input | Output | Kosten |
|-------|--------|-------|--------|--------|
| 1. PDF-Akquise | `download_zotero_pdfs.py` | Zotero API | `pipeline/pdfs/` | $0 |
| 2. Markdown-Konversion | `convert_to_markdown.py` | PDFs | `pipeline/markdown/` | $0 |
| 3. Validierung | `validate_markdown_enhanced.py` | Markdown + PDFs | Validation Reports | $0 |
| 4. Post-Processing | `postprocess_markdown.py` | Markdown | `pipeline/markdown_clean/` | $0 |
| 5. Knowledge Distillation | `distill_knowledge.py` | Markdown | `pipeline/knowledge/distilled/` | ~$7 |
| 6. LLM-Assessment (10K) | `benchmark/scripts/run_llm_assessment.py` | Knowledge Docs | `benchmark/data/llm_assessment_10k.csv` | $1.44 |
| 7. Vault-Generierung | `generate_vault.py` | Knowledge Docs + Assessment CSVs | `vault/` + `docs/downloads/vault.zip` | $0 |

**Gesamtkosten:** ~$10.17 (Claude Haiku 4.5)

---

## Wichtige Befehle

### Knowledge Distillation (3-Stage)

```bash
python pipeline/scripts/distill_knowledge.py --input pipeline/markdown --output pipeline/knowledge/distilled --limit 5
```

Drei Stufen: (1) LLM extrahiert JSON, (2) deterministisches Formatting, (3) LLM-as-a-Judge Verifikation. Ergebnis: 249 Knowledge-Dokumente, 97.2% mit Score >= 75.

### LLM-Assessment (10K-Benchmark)

```bash
python benchmark/scripts/run_llm_assessment.py
```

10 binaere Kategorien (4 Technik + 6 Sozial), Include-Logik (min. 1 Technik UND min. 1 Sozial). 326/326 Papers, $1.44.

### Vault-Generierung (mit Assessment-Integration)

```bash
python pipeline/scripts/generate_vault.py --clean
```

Liest Knowledge-Dokumente, Zotero-Metadaten und beide Assessment-CSVs (LLM + Human). Erzeugt Obsidian-Vault mit YAML-Frontmatter inkl. `llm_decision`, `human_decision`, `agreement`. 249 Papers, 205 mit Assessment-Daten, 79 Concept Notes.

### SPA-Daten generieren

```bash
python pipeline/scripts/generate_docs_data.py
```

Erzeugt `docs/data/research_vault_v2.json` fuer die Single-Page Application.

**GitHub Pages:** https://chpollin.github.io/FemPrompt_SozArb/

---

## Duales Assessment-System

| Track | Methode | Schema | Status |
|-------|---------|--------|--------|
| **Human** | Google Sheets -> CSV Export | 10 binaere Kategorien | 210/326 mit Decision |
| **LLM** | Claude Haiku 4.5 | 10 binaere Kategorien | 326/326 (100%) |

Benchmark-Ergebnisse: Konfusionsmatrix (65/23/78/34), Basisraten (LLM 68% vs. Human 42% Include), Cohen's Kappa = 0.035 (Prevalence-Bias-Artefakt).

---

## Performance

| Operation | Dauer | Kosten | Erfolgsrate |
|-----------|-------|--------|-------------|
| PDF-Akquise | 1-2 h | $0 | 78.8% (257/326) |
| Markdown-Konversion | 2-3 h | $0 | 98% (252/257) |
| Knowledge Distillation | 6-7 h | ~$7 | 100% (249/249) |
| LLM-Assessment (10K) | ~30 min | $1.44 | 100% (326/326) |
| Vault-Generierung | <1 min | $0 | 100% |
| **Gesamt** | **~10 h** | **~$10.17** | -- |

---

## Troubleshooting

| Problem | Loesung |
|---------|---------|
| HTTP 429 (Rate Limit) | Delay zwischen API-Calls erhoehen |
| Fehlende PDFs | Logs pruefen: `acquisition_log.json` |
| Memory Error | Kleinere Batches (`--limit 5`) |
| NaN-Fehler | `isinstance(value, str)` pruefen vor Regex |

---

## Naechste Schritte

1. **Methodik:** [methods-and-pipeline.md](../methods-and-pipeline.md)
2. **Status:** [status.md](../status.md)
3. **Projektkontext:** [project.md](../project.md)
4. **Paper-Abgleich:** [paper-integrity.md](../paper-integrity.md)

---

*Aktualisiert: 2026-02-22*
