# Status (2026-02-03)

## Aktueller Fokus: Human Review & Summarisierung

Die PDF-zu-Markdown-Konvertierung ist abgeschlossen. Dubletten wurden bereinigt. Human Review laeuft (LLM-gestuetzt). Naechster Schritt: LLM-Summarisierung.

---

## Assessment

**Ein Korpus (326 Papers), zwei Assessment-Tracks:**

| Track | Methode | Schema | Status |
|-------|---------|--------|--------|
| **Human** | Google Sheets | 10 binaere Kategorien | 🔄 In Arbeit |
| **LLM** | Claude Haiku 4.5 | 5 Dimensionen (0-3) | ✅ Fertig |

### Human Assessment

| Aspekt | Stand |
|--------|-------|
| Papers | 303 (254 DeepResearch + 49 Human 1 Collection) |
| Schema | 10 binaere Kategorien (Technik + Sozial) |
| Google Spreadsheet | [Link](https://docs.google.com/spreadsheets/d/1z-HQSwVFg-TtdP0xo1UH4GKLMAXNvvXSdySPSA7KUdM/) |
| Bearbeiter | Susi Sackl-Sharif, Sabine Klinger |

### LLM Assessment

| Aspekt | Stand |
|--------|-------|
| Papers bewertet | 325/325 (100% Erfolgsrate) |
| Ergebnis | 222 Include, 83 Exclude, 20 Unclear |
| Kosten | $1.15 |
| Output | `assessment-llm/output/assessment_llm.xlsx` |

---

## Pipeline

### PDF→Markdown Konvertierung ✅

| Aspekt | Stand |
|--------|-------|
| PDFs (nach Dubletten-Bereinigung) | 225 |
| Erfolgreich konvertiert | 223 |
| Fehlgeschlagen | 2 (0.9%) |
| Dubletten entfernt | 9 |
| Quality-Score (Durchschnitt) | 94.7/100 |

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

Browser-basiertes Tool: `pipeline/tools/markdown_reviewer.html`
- **Seiten-Ansicht (Neu):** PDF-Seite und Markdown-Text nebeneinander pro Seite
- Split-Ansicht: Klassische Gesamtansicht
- PASS/WARN/FAIL Bewertung
- Keyboard-Shortcuts: `1` PASS, `2` WARN, `3` FAIL, `V` Ansicht wechseln
- Filter fuer offene/problematische Dokumente
- Export/Import als JSON

### Human Review (Stichprobe) 🔄

| Aspekt | Stand |
|--------|-------|
| Geprueft | 11 von 223 (5%) |
| PASS | 8 (73%) |
| WARN | 3 (27%) |
| FAIL | 0 (0%) |
| Export | `pipeline/validation_reports/human_review_2026-02-03.json` |

---

## Paper: Forum Wissenschaft 2/2026

| Aspekt | Stand |
|--------|-------|
| Deadline | 4. Mai 2026 |
| Umfang | 18.000 Zeichen |
| Fokus | LLM-gestuetzter Literature Review im Praxistest |

---

## Pipeline-Phasen

### Phase 1: Assessment & Benchmark

| Schritt | Status | Details |
|---------|--------|---------|
| Human-Assessment (Google Sheets) | 🔄 In Bearbeitung | Susi, Sabine |
| LLM-Assessment (Claude Haiku 4.5) | ✅ Fertig | 325 Papers |
| Benchmark-Analyse (Cohen's Kappa) | ⏸️ Wartet | Nach Human-Assessment |

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

## Offene Punkte

- [x] Dubletten bereinigen (9 entfernt)
- [x] Seiten-Alignment im Review-Tool implementieren
- [ ] Stichproben-Review abschliessen (~20 Dokumente)
- [ ] LLM-Summarisierung starten
- [ ] Human-Assessment im Google Spreadsheet abschliessen
- [ ] Benchmark-Metriken berechnen (nach Human-Assessment)

---

*Aktualisiert: 2026-02-03*
*Version: 8.0*
