# Status (2026-02-06)

## Aktueller Fokus: Benchmark vorbereiten

Knowledge Distillation und Qualitaetspruefung abgeschlossen. Naechster Schritt: Benchmark (Human vs. LLM Assessment). Blockiert durch Human-Assessment.

---

## Assessment

**Ein Korpus (326 Papers), zwei Assessment-Tracks:**

| Track | Methode | Schema | Status |
|-------|---------|--------|--------|
| **Human** | Google Sheets | 10 binaere Kategorien | In Arbeit |
| **LLM (5D)** | Claude Haiku 4.5 | 5 Dimensionen (0-3) | Fertig |
| **LLM (10K)** | Claude Haiku 4.5 | 10 binaere Kategorien | Wartet |

### Human Assessment

| Aspekt | Stand |
|--------|-------|
| Papers | 303 (254 DeepResearch + 49 Human 1 Collection) |
| Schema | 10 binaere Kategorien (Technik + Sozial) |
| Google Spreadsheet | [Link](https://docs.google.com/spreadsheets/d/1z-HQSwVFg-TtdP0xo1UH4GKLMAXNvvXSdySPSA7KUdM/) |
| Bearbeiter | Susi Sackl-Sharif, Sabine Klinger |

### LLM Assessment (5 Dimensionen - abgeschlossen)

| Aspekt | Stand |
|--------|-------|
| Papers bewertet | 325/325 (100% Erfolgsrate) |
| Ergebnis | 222 Include, 83 Exclude, 20 Unclear |
| Kosten | $1.15 |
| Output | `assessment-llm/output/assessment_llm.xlsx` |

### LLM Assessment (10 Kategorien - fuer Benchmark)

| Aspekt | Stand |
|--------|-------|
| Script | `benchmark/scripts/run_llm_assessment.py` |
| Schema | 10 binaere Kategorien (identisch mit Human) |
| Status | Wartet auf Human-Assessment |

---

## Pipeline

### PDF-Akquise und Konvertierung (Fertig)

| Phase | Ergebnis |
|-------|----------|
| PDFs gesamt | 257/326 (78.8%) |
| Markdown-Konversion | 252/257 (98.1%) |
| Fehlgeschlagen | 5 (korrupte PDFs) |
| Dubletten entfernt | 9 |
| Quality-Score (Durchschnitt) | 93.1/100 |

### Post-Processing (Fertig)

| Operation | Anzahl |
|-----------|--------|
| Silbentrennungen korrigiert | 230 |
| Seitenzahlen entfernt | 341 |
| Header-Wiederholungen entfernt | 2,263 |
| Zeichen insgesamt entfernt | 107,545 |

### Knowledge Distillation (Fertig + Verifiziert)

| Aspekt | Stand |
|--------|-------|
| Verarbeitete Dokumente | 249/252 (98.8%) |
| Verifizierte Qualitaet | 242/249 perfekt (97.2%) |
| API-Kosten | ~$7 (gesamt) |
| Output | `pipeline/knowledge/distilled/` |

**Verifikationsergebnis (2026-02-06):**

| Kategorie | Anzahl | Details |
|-----------|--------|---------|
| Perfekt | 242 | Alle Checks bestanden |
| PDF-Qualitaetsprobleme | 5 | Korrupte/falsche PDFs (nicht Pipeline-Fehler) |
| Niedrige Uebereinstimmung | 2 | Kurze Dokumente, inhaltlich korrekt |
| Nicht erstellt | 3 | Cvoelcker_2023, Smith_2021, UNESCO_2024_Bias |

**Problematische Dokumente (PDF-Upstream-Probleme):**
- `Debnath_2024_LLMs` - Original-Markdown korrupt (Zeichen-Muell)
- `Tun_2025_Trust` - PDF war nur PRISMA-Checklist
- `D_Ignazio_2024_Data` - PDF enthielt falsches Dokument (Cabnal 2010)
- `Statistics_2023_Occupational` - Kein AI/Gender Paper (US Bureau of Labor)
- `Naescher_2025_ReflectAI` - PDF war Konferenzband-Titelseite

---

## Benchmark (Wartet)

| Schritt | Status | Script |
|---------|--------|--------|
| Human-Assessment abschliessen | In Arbeit | Google Sheets |
| LLM-Assessment (10 Kategorien) | Wartet | `benchmark/scripts/run_llm_assessment.py` |
| Merge Human + LLM | Wartet | `benchmark/scripts/merge_assessments.py` |
| Cohen's Kappa berechnen | Wartet | `benchmark/scripts/calculate_agreement.py` |
| Disagreement-Analyse | Wartet | `benchmark/scripts/analyze_disagreements.py` |

---

## Paper: Forum Wissenschaft 2/2026

| Aspekt | Stand |
|--------|-------|
| Deadline | 4. Mai 2026 |
| Umfang | 18.000 Zeichen |
| Fokus | LLM-gestuetzter Literature Review im Praxistest |
| Arbeitsplan | `knowledge/paper/Forum Wissenschaft Paper - Arbeitsplan.md` |

---

## Offene Punkte

- [x] Dubletten bereinigen (9 entfernt)
- [x] Seiten-Alignment im Review-Tool implementieren
- [x] 32 fehlende PDFs integriert
- [x] Knowledge Distillation (249 Dokumente)
- [x] Knowledge-Doc Verifikation (97.2% perfekt)
- [x] Repository-Bereinigung (analysis/, pipeline/summaries/, Redundanzen)
- [ ] Human-Assessment im Google Spreadsheet abschliessen (Blocker)
- [ ] Benchmark-LLM-Assessment ausfuehren
- [ ] Benchmark-Metriken berechnen
- [ ] Vault-Building (Obsidian)
- [ ] Paper schreiben

---

## Fehlgeschlagene PDF-Konvertierungen (5)

1. `British_Association_of_Social_Workers_2025_Generat.pdf` - Data format error
2. `Browne_2023_Feminist_AI_Critical_Perspectives_on_Algorithms,.pdf` - Page dimension error
3. `Ulnicane_2024_Intersectionality_in_Artificial_Intelligence.pdf` - Conversion failure
4. `UNESCO__IRCAI_2024_Challenging.pdf` - Not valid
5. `Workers_2025_Generative.pdf` - Not valid

---

*Aktualisiert: 2026-02-06*
