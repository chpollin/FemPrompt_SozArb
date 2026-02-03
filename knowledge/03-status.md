# Status (2026-02-03)

## Aktueller Fokus: PDF→Markdown Validierung abgeschlossen

Die PDF-zu-Markdown-Konvertierung und Validierung ist abgeschlossen. Naechster Schritt: LLM-Summarisierung.

---

## FemPrompt Pipeline - Phase 2 AKTIV

### PDF→Markdown Konvertierung ✅

| Aspekt | Stand |
|--------|-------|
| PDFs heruntergeladen | 234 (von 306 Zotero-Items) |
| Erfolgreich konvertiert | 232 (99.1%) |
| Fehlgeschlagen | 2 (0.9%) |
| Konfidenz-Score (Durchschnitt) | 98.7/100 |

### Validierung ✅

| Metrik | Wert |
|--------|------|
| PASS | 136 (58.6%) |
| WARNING | 96 (41.4%) |
| FAIL | 0 (0.0%) |
| Artefakt-Score (Durchschnitt) | 4.5/100 |
| Tabellen-Mismatch | 94 Dokumente |

### Post-Processing ✅

| Operation | Anzahl |
|-----------|--------|
| Silbentrennungen korrigiert | 230 |
| Seitenzahlen entfernt | 341 |
| Header-Wiederholungen entfernt | 2,263 |
| Zeichen insgesamt entfernt | 107,545 |

### Human-in-the-Loop Review Tool ✅

Browser-basiertes Tool erstellt: `pipeline/tools/markdown_reviewer.html`
- PDF und Markdown nebeneinander
- PASS/WARN/FAIL Bewertung
- Keyboard-Shortcuts (1/2/3, Pfeiltasten, S fuer Sync)
- Filter fuer offene/problematische Dokumente
- Export als JSON

### PDF-zu-JPG Konvertierung ✅

| Aspekt | Stand |
|--------|-------|
| PDFs konvertiert | 234 |
| Seiten generiert | ~4000+ |
| Output | `pipeline/pdf_images/[pdf-name]/page_001.jpg` |

Ermoeglicht synchrones Scrollen im Review-Tool (Toggle mit 'S').

### Naechste Schritte

1. **Stichproben-Review** mit Review-Tool durchfuehren
2. **LLM-Summarisierung** der validierten Markdown-Dokumente
3. **Obsidian Vault** generieren

---

## FemPrompt Thematisches Assessment

| Aspekt | Stand |
|--------|-------|
| Papers exportiert | 303 (254 DeepResearch + 49 Human 1 Collection) |
| Schema | 10 binaere Kategorien (Technik + Sozial) |
| Google Spreadsheet | [Link](https://docs.google.com/spreadsheets/d/1z-HQSwVFg-TtdP0xo1UH4GKLMAXNvvXSdySPSA7KUdM/) |
| Bearbeiter | Susi Sackl-Sharif, Sabine Klinger |

### LLM-Assessment Benchmark

| Aspekt | Stand |
|--------|-------|
| Test-Durchlauf | 50 Papers (V2) |
| Inkonsistenz-Rate | 6% (V1: 20%) |
| Bereit fuer Vollauf | Ja (~$1.30 geschaetzt) |

---

## SozArb (325 Papers) - PAUSIERT

| Phase | Status |
|-------|--------|
| Assessment | 325/325 (222 Include, 83 Exclude, 20 Unclear) |
| Enhanced Summaries | 75/222 |
| Vault | Operativ (266 Papers, 144 Concepts) |

---

## Paper: Forum Wissenschaft 2/2026

| Aspekt | Stand |
|--------|-------|
| Deadline | 4. Mai 2026 |
| Umfang | 18.000 Zeichen |
| Fokus | Deep-Research-gestuetzte Literature Reviews im Praxistest |

---

## Pipeline-Phasen

### Phase 1: Assessment & Benchmark

| Schritt | Status | Details |
|---------|--------|---------|
| Human-Assessment (Google Sheets) | 🔄 In Bearbeitung | Susi, Sabine |
| LLM-Assessment (Claude Haiku 4.5) | ⏸️ Bereit | Wartet auf Human |
| Benchmark-Analyse (Cohen's Kappa) | ⏸️ Wartet | Nach beiden Assessments |

### Phase 2: Pipeline-Execution

| Schritt | Status | Details |
|---------|--------|---------|
| PDF-Download (Zotero) | ✅ Abgeschlossen | 234 PDFs |
| Markdown-Konversion (Docling) | ✅ Abgeschlossen | 232/234 |
| Validierung (Enhanced) | ✅ Abgeschlossen | 98.7 Konfidenz |
| Post-Processing | ✅ Abgeschlossen | 107k Zeichen bereinigt |
| Human Review Tool | ✅ Erstellt | Browser-Tool verfuegbar |
| LLM-Summarisierung | ⏳ Naechster Schritt | - |
| Vault-Generierung (Obsidian) | ⏸️ Wartet | - |

### Phase 3: Paper-Entwicklung

| Schritt | Status |
|---------|--------|
| Textbausteine | ⏸️ Wartet |
| Ergebnisse einarbeiten | ⏸️ Wartet |
| Finalisierung | ⏸️ Wartet |

---

## Technische Artefakte (heute erstellt)

| Datei | Zweck |
|-------|-------|
| `pipeline/scripts/validate_markdown_enhanced.py` | Multi-Layer Validierung mit PDF-Vergleich |
| `pipeline/scripts/postprocess_markdown.py` | Konservative Artefakt-Bereinigung |
| `pipeline/tools/markdown_reviewer.html` | Human-in-the-Loop Review Tool mit Sync-Scroll |
| `pipeline/scripts/pdf_to_images.py` | PDF-zu-JPG Konverter fuer Sync-Scroll |
| `knowledge/paper/Validation-Methodology.md` | Paper-Dokumentation der Methodik |
| `knowledge/guides/manual-review-checklist.md` | Strukturierte Review-Checkliste |
| `pipeline/validation_reports/COMPARISON_REPORT.md` | Post-Processing Transparenz-Report |

---

## Offene Punkte

- [ ] Stichproben-Review mit Browser-Tool (~10% der Dokumente)
- [ ] LLM-Summarisierung starten
- [ ] Human-Assessment im Google Spreadsheet abschliessen
- [ ] LLM-Assessment Vollauf durchfuehren
- [ ] Benchmark-Metriken berechnen

---

*Aktualisiert: 2026-02-03*
*Version: 6.1*
