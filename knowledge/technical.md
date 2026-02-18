# Technische Dokumentation

---

## System-Anforderungen

### Software

- Python 3.8+
- Windows 10/11, macOS 10.14+, Linux

### Python-Pakete

Installation via `pip install -r requirements.txt`. Kern-Pakete:

| Paket | Version | Zweck |
|-------|---------|-------|
| anthropic | >=0.68.0 | Claude API |
| pandas, openpyxl | - | Excel-Verarbeitung |
| pyzotero | >=1.5.0 | Zotero API |
| docling | >=2.60.0 | PDF-Konversion |
| pdfplumber | >=0.10.0 | PDF-Analyse |
| python-dotenv | >=1.0.0 | Environment |

### Umgebungsvariablen

In `.env` Datei (nicht committen):
- `ANTHROPIC_API_KEY` - Claude API-Schluessel
- `ZOTERO_API_KEY` - Zotero API-Schluessel

---

## Pipeline-Architektur

### Empfohlener Workflow

| Schritt | Script | Input | Output | Wichtige Parameter |
|---------|--------|-------|--------|-------------------|
| 1. PDF-Download | `download_zotero_pdfs.py` | Zotero Group | `pipeline/pdfs/` | `--output` |
| 2. Markdown-Konversion | `convert_to_markdown.py` | PDFs | `pipeline/markdown/` | `--input`, `--output`, `--no-page-markers` |
| 3. Validierung | `validate_markdown_enhanced.py` | Markdown + PDFs | `pipeline/validation_reports/` | `--md-dir`, `--pdf-dir`, `--output-dir` |
| 4. Post-Processing | `postprocess_markdown.py` | Markdown | `pipeline/markdown_clean/` | `--input-dir`, `--output-dir` |
| 5. Human Review | `markdown_reviewer.html` | Markdown + PDFs | JSON-Export | Via Live Server oeffnen |
| 6. Knowledge Distillation | `distill_knowledge.py` | Markdown | `pipeline/knowledge/distilled/` | `--input`, `--output`, `--limit` |
| 7. Vault-Building | `generate_vault.py` | Knowledge Docs | `vault/` | `--input`, `--output` |

Alle Scripts befinden sich in `pipeline/scripts/`. Vollstaendige Parameter via `--help`.

---

## Script-Referenz

### Pipeline Scripts (pipeline/scripts/)

| Script | Funktion | Status |
|--------|----------|--------|
| `download_zotero_pdfs.py` | PDFs von Zotero herunterladen | Getestet |
| `acquire_pdfs.py` | PDF-Akquise mit 4 Fallback-Strategien | Getestet |
| `convert_to_markdown.py` | PDF zu Markdown mit Docling (inkl. Seiten-Marker) | Getestet |
| `validate_markdown_enhanced.py` | Multi-Layer Validierung + PDF-Vergleich | Getestet |
| `postprocess_markdown.py` | Konservative Artefakt-Bereinigung | Getestet |
| `pdf_to_images.py` | PDF-Seiten als Bilder extrahieren (fuer Reviewer) | Getestet |
| `summarize_documents.py` | Dokument-Zusammenfassungen | Getestet |
| `distill_knowledge.py` | Knowledge Distillation (3-Stage) | Abgeschlossen (249 Docs) |
| `validate_knowledge_docs.py` | Knowledge-Dokument-Validierung | Getestet |
| `verify_knowledge_quality.py` | Qualitaetspruefung Knowledge Docs | Abgeschlossen |
| `validate_pipeline.py` | Pipeline-Validierung (End-to-End) | Getestet |
| `generate_vault.py` | Obsidian Vault generieren | Ausstehend |
| `utils.py` | Zentrale Hilfsfunktionen (Logging, API, Config) | Aktiv |

### Pipeline Tools (pipeline/tools/)

| Tool | Funktion |
|------|----------|
| `markdown_reviewer.html` | Browser-Tool fuer Human-in-the-Loop Review |

### Corpus Scripts (corpus/)

| Script | Funktion |
|--------|----------|
| `extract_metadata.py` | Metadaten aus Zotero-Export extrahieren |

### Assessment Scripts

| Script | Funktion |
|--------|----------|
| `assessment-llm/assess_papers.py` | LLM-basiertes PRISMA-Assessment (5D) |
| `assessment-llm/analyze_results.py` | Ergebnis-Analyse des 5D-Assessments |
| `assessment-llm/write_llm_tags_to_zotero.py` | LLM-Tags in Zotero schreiben |
| `assessment/create_thematic_assessment.py` | Excel fuer manuelles Assessment |
| `assessment/excel_to_zotero_tags.py` | Excel-Tags in Zotero uebertragen |
| `benchmark/scripts/generate_papers_csv.py` | Zotero JSON -> papers_full.csv (326 Zeilen) |
| `benchmark/scripts/run_llm_assessment.py` | Benchmark-Assessment (10K, **326/326 ausgefuehrt**) |
| `benchmark/scripts/run_phase2_pipeline.py` | Phase-2-Pipeline fuer Benchmark |
| `benchmark/scripts/merge_assessments.py` | Human + LLM zusammenfuehren (wartet auf HA-Export) |
| `benchmark/scripts/calculate_agreement.py` | Cohen's Kappa berechnen (wartet auf Merge) |
| `benchmark/scripts/analyze_disagreements.py` | Qualitative Analyse (wartet auf Kappa) |

---

## Validierung & Post-Processing

### validate_markdown_enhanced.py

Multi-Layer Validierungssystem:

| Layer | Pruefung | Schwellwert |
|-------|----------|-------------|
| 1. Syntaktisch | GLYPH-Placeholder | max 50 |
| 1. Syntaktisch | Unicode-Fehler | max 5% |
| 2. Strukturell | Character-Ratio (MD/PDF) | min 0.7 |
| 2. Strukturell | Tabellen-Mismatch | Flag wenn >2 Differenz |
| 3. Semantisch | LLM Spot-Check | Optional, 10% Sample |
| 4. Manual | Review Queue | Priorisiert nach Konfidenz |

**Output-Dateien:**
- `validation_report_*.json` - Maschinenlesbar
- `validation_summary_*.csv` - Tabellenkalkulation
- `validation_report_*.md` - Menschenlesbar
- `manual_review_queue_*.csv` - Priorisierte Review-Liste

### postprocess_markdown.py

Konservative Bereinigung:

| Operation | Beschreibung | Sicherheit |
|-----------|--------------|------------|
| Hyphenation-Fix | Silbentrennungen zusammenfuegen | Sicher |
| Page Number Removal | Verwaiste Seitenzahlen entfernen | Sicher |
| Header Removal | Journal-Header (>10x + Pattern) | Konservativ |
| Newline Normalization | Max 2 Leerzeilen | Sicher |
| All-Caps Removal | **DEAKTIVIERT** | Zu riskant |

**Wichtig:** All-Caps-Entfernung ist deaktiviert, da strukturierte Dokumente (z.B. DigComp Framework) legitime Wiederholungen enthalten koennen.

### markdown_reviewer.html

Browser-Tool fuer Human-in-the-Loop Review. Oeffnen via Live Server in VS Code.

**Features:**
- **Seiten-Ansicht (Neu):** PDF-Seite und Markdown-Text nebeneinander pro Seite
- **Split-Ansicht:** Klassische Ansicht mit gesamtem PDF links und Markdown rechts
- PASS/WARN/FAIL Bewertung
- Filter: Alle / Offen / Warn
- Fortschrittsanzeige
- Export/Import als JSON
- LocalStorage-Persistenz

**Seiten-Alignment:**
Das Tool erkennt `<!-- PAGE N -->` Marker im Markdown und zeigt jede Seite als separaten Block mit dem entsprechenden PDF-Bild daneben. Erfordert Markdown mit Seiten-Markern (siehe convert_to_markdown.py).

**Keyboard-Shortcuts:**
- `1` PASS | `2` WARN | `3` FAIL | `0` Reset
- `←` `→` Navigation
- `L` Liste ein/ausblenden
- `V` Ansicht wechseln (Seiten/Split)

---

## Verzeichnisstruktur

| Verzeichnis | Inhalt | Dateien |
|-------------|--------|---------|
| `pipeline/scripts/` | Python-Scripts | download_zotero_pdfs.py, convert_to_markdown.py, validate_markdown_enhanced.py, postprocess_markdown.py, distill_knowledge.py, generate_vault.py, utils.py |
| `pipeline/tools/` | Browser-Tools | markdown_reviewer.html |
| `pipeline/pdfs/` | Heruntergeladene PDFs | 257 Dateien |
| `pipeline/markdown/` | Konvertierte Dokumente | 252 Dateien |
| `pipeline/markdown_clean/` | Post-Processed Dokumente | Bereinigt |
| `pipeline/validation_reports/` | Validierungsberichte | JSON, CSV, MD Reports |
| `pipeline/knowledge/distilled/` | Destillierte Wissensdokumente | 249 Dateien |
| `pipeline/knowledge/_stage1_json/` | Stage 1 Zwischenergebnisse | JSON |
| `pipeline/knowledge/_verification/` | Verifikationsberichte | JSON |
| `benchmark/config/` | Benchmark-Konfiguration | categories.yaml |
| `benchmark/scripts/` | Benchmark-Scripts | run_llm_assessment.py, merge_assessments.py, calculate_agreement.py, analyze_disagreements.py |
| `benchmark/data/` | Assessment-Daten | human_assessment.csv, llm_assessment_50.csv, llm_assessment_50_v2.csv, femprompt_papers.csv |
| `benchmark/data/phase2_test/` | Phase-2-Testdaten | acquisition_input.json, missing_pdfs.csv, pipeline_stats.json |
| `benchmark/results/` | Ergebnisse | (leer, wartet auf Benchmark-Ausfuehrung) |
| `corpus/` | Korpus-Metadaten | zotero_export.json, papers_metadata.csv, source_tool_mapping.json, extract_metadata.py |
| `deep-research/restored/` | Deep-Research-Artefakte | 4 RIS-Dateien, 3 Raw-Outputs, ris-template.md |
| `knowledge/` | Dokumentation | project, methodology, status, technical, paper-integrity, epistemic-framework + Guides + Paper |
| `vault/` | Obsidian Vault | Skelett: README.md + 5 MOC-Templates (nicht befuellt) |

---

## Performance & Kosten

### PDF→Markdown Pipeline (2026-02-03)

| Phase | Ergebnis | Dauer |
|-------|----------|-------|
| PDF-Download | 257/326 PDFs | ~10 min |
| Markdown-Konversion | 252/257 (98.1%) | ~45 min |
| Dubletten-Bereinigung | 9 entfernt | - |
| **Finale Dokumente** | **252 Markdown, 257 PDFs** | - |
| Post-Processing | 107k Zeichen bereinigt | ~2 min |

### Human Review (Stichprobe)

| Metrik | Wert |
|--------|------|
| Geprueft | 25/252 (~10%) |
| PASS | 20 (80%) |
| WARN | 4 (16%) |
| FAIL | 1 (4%) |

### Knowledge Distillation (Abgeschlossen)

| Metrik | Wert |
|--------|------|
| Dokumente verarbeitet | 249/252 (98.8%) |
| Verifizierte Qualitaet | 242/249 perfekt (97.2%) |
| Kosten (gesamt) | ~$7 |
| API-Calls pro Paper | 2 (Stage 2 lokal) |

**Verifikation (2026-02-06):** 242 Dokumente bestehen alle Checks (YAML-Frontmatter, Sektionen, Content-Uebereinstimmung mit Original). 5 Dokumente haben PDF-Upstream-Probleme, 2 haben niedrige Uebereinstimmung bei kurzen Dokumenten.

**Verifikations-Praezisierung (Was "verifiziert" bedeutet):**

| Aspekt | Gewicht | Pruefung | Kriterium |
|---|---|---|---|
| Completeness | 40% | Alle Pflichtfelder befuellt, keine wesentlichen Informationen fehlend | Vollstaendig = volle Punktzahl |
| Correctness | 40% | Extrahierte Aussagen stimmen mit Originaltext ueberein | Zitat muss im Original auffindbar sein |
| Category Validation | 20% | Kategorien-Zuordnungen durch Evidenzzitate gestuetzt | Evidenz-Zitat muss Kategorie stuetzen |

**Eskalationsregel:** Confidence < 75 markiert Dokument als `needs_correction`. Aktuell keine automatische Korrektur, nur Logging und manuelle Pruefung.

**Epistemischer Kontext:** Die Verifikation nutzt die Asymmetrie zwischen Erzeugung und Pruefung: Die Pruefung bereits erzeugter Ergebnisse ist systematisch einfacher als die Erzeugung neuer korrekter Ergebnisse. Dies ist die technische Grundlage fuer die Skalierung ueber spezialisierte Agenten-Teams (vgl. Snell et al. 2024, Test-Time Compute).

### API-Kosten

| Operation | Kosten | Status |
|-----------|--------|--------|
| PDF-Akquise | $0 | Abgeschlossen |
| Markdown-Konversion | $0 | Abgeschlossen |
| Validierung | $0 | Abgeschlossen |
| Post-Processing | $0 | Abgeschlossen |
| 5D LLM-Assessment (325 Papers) | $1.15 | Abgeschlossen |
| Knowledge Distillation (249 Papers) | ~$7.00 | Abgeschlossen |
| 10K LLM-Assessment (326 Papers) | $1.44 | **Abgeschlossen** |
| **Gesamt** | **~$10.17** | |

**Modell:** Claude Haiku 4.5 ($1.00/MTok Input, $5.00/MTok Output, Preise Stand Feb 2026)

---

## Fehlerbehandlung

### Windows-Encoding

Die Funktion `setup_windows_encoding()` in `utils.py` konfiguriert UTF-8 Encoding fuer Windows-Konsolen.

### HTTP 429 (Rate Limit)

Bei Rate-Limit-Fehlern den Delay zwischen API-Calls erhoehen (Standard: 2 Sekunden, empfohlen: 5 Sekunden).

### Fehlgeschlagene Konvertierungen

5 Dokumente konnten nicht konvertiert werden (korrupte oder ungewoehnliche Formate):
- `British_Association_of_Social_Workers_2025_Generat.pdf` - Data format error
- `Browne_2023_Feminist_AI_Critical_Perspectives_on_Algorithms,.pdf` - Page dimension error
- `Ulnicane_2024_Intersectionality_in_Artificial_Intelligence.pdf` - Conversion failure
- `UNESCO__IRCAI_2024_Challenging.pdf` - Not valid
- `Workers_2025_Generative.pdf` - Not valid

---

## Konfiguration

### Assessment-Kategorien (categories.yaml)

Das Benchmark verwendet 10 binaere Kategorien:

**Technik (4):** AI_Literacies, Generative_KI, Prompting, KI_Sonstige

**Sozial (6):** Soziale_Arbeit, Bias_Ungleichheit, Gender, Diversitaet, Feministisch, Fairness

Konfigurationsdatei: `benchmark/config/categories.yaml`

---

## Knowledge Distillation

### distill_knowledge.py

Dreistufiger Workflow zur Extraktion von Wissensdokumenten aus akademischen Papers.

**Konzept:** Knowledge Documents sind komprimierte Repräsentationen einzelner Papers (~1000 Token), die alle relevanten Informationen für das LLM-Assessment und Vault-Building enthalten.

**Stages:**

| Stage | Funktion | Input | Output | API-Call |
|-------|----------|-------|--------|----------|
| 1 | Extract & Classify | Markdown | JSON | Ja |
| 2 | Format Markdown | JSON | Markdown | Nein (lokal) |
| 3 | Verify | Markdown + Original | JSON | Ja |

**Output-Format (Markdown mit YAML-Frontmatter):**

```markdown
---
title: "Paper Titel"
authors: ["Autor1", "Autor2"]
year: 2024
type: journalArticle
categories:
  - AI_Literacies
  - Soziale_Arbeit
confidence: 95
processed: 2026-02-04
source_file: paper.md
---

# Paper Titel

## Kernbefund
[1-2 Sätze]

## Forschungsfrage
[1 Satz]

## Methodik
[Kurzbeschreibung]

## Hauptargumente
- Argument 1
- Argument 2

## Kategorie-Evidenz
### AI_Literacies
[Evidenz-Zitat]

## Schlüsselreferenzen
- [[Autor_Jahr]] - Kurztitel
```

**10 Kategorien (binär):**

- **Technik (4):** AI_Literacies, Generative_KI, Prompting, KI_Sonstige
- **Sozial (6):** Soziale_Arbeit, Bias_Ungleichheit, Gender, Diversitaet, Feministisch, Fairness

**Verwendung:**

```bash
# Test mit 10 Dokumenten
python pipeline/scripts/distill_knowledge.py --limit 10

# Vollständiger Durchlauf
python pipeline/scripts/distill_knowledge.py

# Einzelnes Dokument
python pipeline/scripts/distill_knowledge.py --single "pipeline/markdown/paper.md"
```

**Wichtige Parameter:**

| Parameter | Standard | Beschreibung |
|-----------|----------|--------------|
| `--input` | `pipeline/markdown` | Input-Verzeichnis |
| `--output` | `pipeline/knowledge/distilled` | Output-Verzeichnis |
| `--limit` | - | Anzahl Dokumente begrenzen |
| `--delay` | 1.0 | Sekunden zwischen API-Calls |
| `--no-skip` | False | Bereits verarbeitete nicht überspringen |

---

## Konfabulations-Dokumentation

Im bisherigen Durchlauf lieferte Deep Research ueberpruefbare Quellen. Dokumentierte Probleme:

| Typ | Beschreibung | Quelle |
|---|---|---|
| Nicht verifizierbarer Eintrag | Ein Deep-Research-Eintrag konnte nicht verifiziert werden | Paper-Text, Abschnitt "LLM-gestuetzter Pfad" |
| PDF-Upstream-Probleme | 5 Dokumente mit korrupten/falschen PDFs (nicht auf Konfabulation zurueckgehend) | `pipeline/knowledge/_verification/` |
| Niedrige Uebereinstimmung | 2 Dokumente mit niedrigem Score bei kurzen Texten (inhaltlich korrekt) | Verifikations-Report |

**Wichtig:** Die Pipeline-Fehler (PDF-Upstream) sind keine Konfabulationen des LLMs, sondern Probleme in der Datenbeschaffung. Der einzige dokumentierte Konfabulations-Fall betrifft die Deep-Research-Phase (Identifikation), nicht die Pipeline-Verarbeitung.

---

## Bekannte Dokumentationsfehler (korrigiert)

| Datei | Fehler | Korrektur | Datum |
|---|---|---|---|
| CLAUDE.md | "8 fallback strategies" | Korrigiert auf 4 (Zotero, DOI, Unpaywall, ArXiv) | 2026-02-18 |
| 03-status.md (alt) | "303 (254 DeepResearch + 49 Human 1 Collection)" | Tatsaechlich 305 in CSV (254 DR + 50 Manual + 1 leer) | 2026-02-14 |

---

*Aktualisiert: 2026-02-18*
