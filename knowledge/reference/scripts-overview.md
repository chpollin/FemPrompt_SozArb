# Scripts-Uebersicht

Zentrale Dokumentation aller Python-Scripts im Projekt.

**Stand:** 2026-02-03

---

## Verzeichnisstruktur

| Verzeichnis | Inhalt |
|-------------|--------|
| `pipeline/scripts/` | Aktive Pipeline-Scripts |
| `pipeline/tools/` | Browser-Tools (HTML) |
| `benchmark/scripts/` | Benchmark Human vs. Agent |
| `assessment/` | Assessment-Workflows |
| `assessment-llm/` | LLM-Assessment |
| `corpus/` | Korpus-Vorbereitung |

---

## Pipeline Scripts (pipeline/scripts/)

**Zweck:** Hauptworkflow PDF → Markdown → Knowledge → Vault

**Status:** 252/257 PDFs konvertiert, validiert und bereinigt

| Script | Beschreibung | Status | Dependencies |
|--------|--------------|--------|--------------|
| `download_zotero_pdfs.py` | PDFs von Zotero Group herunterladen | Getestet | pyzotero |
| `convert_to_markdown.py` | PDF→Markdown mit Qualitaetsmetriken | Getestet | docling |
| `validate_markdown_enhanced.py` | Multi-Layer Validierung mit PDF-Vergleich | Getestet | pdfplumber |
| `postprocess_markdown.py` | Konservative Artefakt-Bereinigung | Getestet | - |
| `distill_knowledge.py` | Knowledge Distillation (3-Stage) | Abgeschlossen (249 Docs) | anthropic |
| `generate_vault.py` | Obsidian Vault generieren | Ausstehend | - |
| `utils.py` | Zentrale Hilfsfunktionen (Logging, API, JSON, Config) | Aktiv | - |

### validate_markdown_enhanced.py

Multi-Layer Validierungssystem:
- **Layer 1**: Syntaktisch (GLYPH, Unicode, Dateigroesse)
- **Layer 2**: Strukturell (PDF-Zeichenvergleich, Tabellen-Zaehlung)
- **Layer 3**: Semantisch (LLM-Stichproben, optional)
- **Layer 4**: Manual Review Queue

**Output:** JSON, CSV, Markdown Reports + Manual Review Queue

### postprocess_markdown.py

Konservative Bereinigung von Konvertierungsartefakten:
- Silbentrennungen zusammenfuegen
- Verwaiste Seitenzahlen entfernen
- Wiederholte Journal-Header entfernen (>10x + Pattern-Match)
- Uebermaessige Leerzeilen normalisieren

**Wichtig:** All-Caps-Entfernung ist DEAKTIVIERT (zu riskant fuer strukturierte Dokumente)

---

## Pipeline Tools (pipeline/tools/)

**Zweck:** Browser-basierte Werkzeuge fuer Human-in-the-Loop

| Tool | Beschreibung | Technologie |
|------|--------------|-------------|
| `markdown_reviewer.html` | PDF/Markdown Vergleichs-Tool fuer manuelle Review | HTML/JS |

### markdown_reviewer.html

Oeffnen mit Live Server in VS Code.

**Features:**
- PDF und gerendertes Markdown nebeneinander
- Dateiliste mit Status-Indikatoren
- PASS/WARN/FAIL Buttons + Keyboard (1/2/3)
- Filter: Alle / Offen / Warn
- Fortschrittsanzeige im Header
- Export als JSON
- LocalStorage-Persistenz

**Keyboard-Shortcuts:**
- `←` `→` Navigation
- `1` PASS | `2` WARN | `3` FAIL
- `L` Liste ein/ausblenden

---

## Benchmark Scripts (benchmark/scripts/)

**Zweck:** Vergleich Human Expert vs. LLM Assessment

| Script | Beschreibung | Dependencies |
|--------|--------------|--------------|
| `run_llm_assessment.py` | LLM-Assessment durchfuehren | anthropic |
| `merge_assessments.py` | Human + Agent zusammenfuehren | pandas |
| `calculate_agreement.py` | Cohen's Kappa berechnen | - |
| `analyze_disagreements.py` | Divergenz-Analyse | pandas |
| `run_phase2_pipeline.py` | Pipeline-Orchestrierung | - |

---

## Assessment Scripts (assessment/)

**Zweck:** Assessment-Daten verwalten

| Script | Beschreibung |
|--------|--------------|
| `create_thematic_assessment.py` | Thematisches Assessment-Template erstellen |
| `excel_to_zotero_tags.py` | Excel-Assessment zurueck zu Zotero-Tags |

---

## Assessment-LLM Scripts (assessment-llm/)

**Zweck:** LLM-basiertes PRISMA Assessment (urspruengliches System)

| Script | Beschreibung |
|--------|--------------|
| `assess_papers.py` | Papers bewerten |
| `analyze_results.py` | Ergebnisse analysieren |
| `write_llm_tags_to_zotero.py` | Tags nach Zotero schreiben |

---

## Empfohlener Workflow

| Schritt | Script | Beschreibung |
|---------|--------|--------------|
| 1 | `download_zotero_pdfs.py` | PDFs herunterladen |
| 2 | `convert_to_markdown.py` | Markdown konvertieren |
| 3 | `validate_markdown_enhanced.py` | Validierung (Enhanced) |
| 4 | `postprocess_markdown.py` | Post-Processing |
| 5 | `markdown_reviewer.html` | Human Review (optional) |
| 6 | `distill_knowledge.py` | Knowledge Distillation |
| 7 | `generate_vault.py` | Vault generieren |

Alle Scripts haben `--help` fuer Parameter-Dokumentation.

---

## Abhaengigkeiten

| Paket | Version | Zweck |
|-------|---------|-------|
| pyzotero | >=1.5.0 | Zotero API |
| anthropic | >=0.68.0 | Claude API |
| docling | >=2.60.0 | PDF→Markdown |
| pdfplumber | >=0.10.0 | PDF-Analyse fuer Validierung |
| pandas | - | Datenverarbeitung |
| pyyaml | - | Konfiguration |
| python-dotenv | >=1.0.0 | Environment |

---

## Aktueller Pipeline-Status

| Phase | Status | Ergebnis |
|-------|--------|----------|
| PDF-Download | Abgeschlossen | 257 PDFs |
| Markdown-Konvertierung | Abgeschlossen | 252/257 (98.1%) |
| Validierung (Enhanced) | Abgeschlossen | Konfidenz-Score 98.7 |
| Post-Processing | Abgeschlossen | 107k Zeichen bereinigt |
| Human Review Tool | Erstellt | Browser-Tool verfuegbar |
| Knowledge Distillation | Abgeschlossen | 249/252 (98.8%) |
| Vault-Generierung | Ausstehend | - |

### Fehlgeschlagene Konvertierungen (5)

- `British_Association_of_Social_Workers_2025_Generat.pdf`
- `Browne_2023_Feminist_AI_Critical_Perspectives_on_Algorithms,.pdf`
- `Ulnicane_2024_Intersectionality_in_Artificial_Intelligence.pdf`
- `UNESCO__IRCAI_2024_Challenging.pdf`
- `Workers_2025_Generative.pdf`

---

*Aktualisiert: 2026-02-06*
