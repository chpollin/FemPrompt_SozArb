# Status (2026-02-03)

## Aktueller Fokus: LLM-Summarisierung

Die PDF-zu-Markdown-Konvertierung ist abgeschlossen. Korpus erweitert (32 zusaetzliche PDFs). Test-Durchlauf der Summarisierung erfolgreich (79.9/100 Quality). Naechster Schritt: Vollstaendige LLM-Summarisierung.

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
| PDFs gesamt (nach Erweiterung) | 257 |
| Erfolgreich konvertiert | 252 |
| Fehlgeschlagen | 5 (1.9%) |
| Dubletten entfernt | 9 |
| Quality-Score (Durchschnitt) | 93.1/100 |

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
- **Seiten-Ansicht:** PDF-Seite und Markdown-Text nebeneinander pro Seite
- Split-Ansicht: Klassische Gesamtansicht
- PASS/WARN/FAIL Bewertung
- Keyboard-Shortcuts: `1` PASS, `2` WARN, `3` FAIL, `V` Ansicht wechseln
- Filter fuer offene/problematische Dokumente
- Export/Import als JSON

### Human Review (Stichprobe) 🔄

| Aspekt | Stand |
|--------|-------|
| Geprueft | 25 von 252 (~10%) |
| PASS | 20 (80%) |
| WARN | 4 (16%) |
| FAIL | 1 (4%) |
| Export | `pipeline/validation_reports/human_review_2026-02-03.json` |

### LLM-Summarisierung 🔄

| Aspekt | Stand |
|--------|-------|
| Test-Durchlauf | ✅ Erfolgreich (20 Dokumente) |
| Quality-Score (Durchschnitt) | 79.9/100 |
| API-Kosten (Test) | $0.26 |
| Existierende Summaries | 78 (58 kopiert + 20 Test) |
| Fehlende Summaries | ~174 |
| Geschaetzte Kosten (Rest) | ~$7 |

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
| PDF-Download (Zotero) | ✅ Abgeschlossen | 257 PDFs (inkl. 32 neue) |
| Markdown-Konversion (Docling) | ✅ Abgeschlossen | 252/257 (98.1%) |
| Validierung (Enhanced) | ✅ Abgeschlossen | 98.7 Konfidenz |
| Post-Processing | ✅ Abgeschlossen | 107k Zeichen bereinigt |
| Human Review Tool | ✅ Erstellt | Browser-Tool verfuegbar |
| LLM-Summarisierung (Test) | ✅ Abgeschlossen | 20 Dokumente, 79.9/100 |
| LLM-Summarisierung (Vollstaendig) | ⏳ Bereit | ~174 Dokumente |
| Vault-Generierung (Obsidian) | ⏸️ Wartet | Nach Summarisierung |

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
- [x] 32 fehlende PDFs aus analysis/pdfs/ integrieren
- [x] Existierende 58 Summaries wiederverwenden
- [x] Test-Durchlauf Summarisierung (20 Dokumente)
- [ ] Vollstaendige LLM-Summarisierung (~174 Dokumente)
- [ ] Human-Assessment im Google Spreadsheet abschliessen
- [ ] Benchmark-Metriken berechnen (nach Human-Assessment)
- [ ] Vault-Generierung

---

## Fehlgeschlagene Konvertierungen

Diese 5 PDFs konnten nicht konvertiert werden (korrupte oder ungewoehnliche Formate):

1. `British_Association_of_Social_Workers_2025_Generat.pdf` - Data format error
2. `Browne_2023_Feminist_AI_Critical_Perspectives_on_Algorithms,.pdf` - Page dimension error
3. `Ulnicane_2024_Intersectionality_in_Artificial_Intelligence.pdf` - Conversion failure
4. `UNESCO__IRCAI_2024_Challenging.pdf` - Not valid
5. `Workers_2025_Generative.pdf` - Not valid

---

*Aktualisiert: 2026-02-03*
*Version: 9.0*
