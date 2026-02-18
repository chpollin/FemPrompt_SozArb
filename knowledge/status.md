# Status (2026-02-18)

## Aktueller Fokus: Benchmark vorbereiten + Paper iterieren

Knowledge-Base konsolidiert (Dateien umbenannt, Redundanzen eliminiert). Paper-Entwurf mit epistemischer Infrastruktur als Leitkonzept liegt im Repo. Drei Untersuchungen abgeschlossen: 21 fehlende Papers erklaert, Deep-Research-Prompts teilweise rekonstruiert, 10K-Assessment-Prompt geprueft.

---

## Meilenstein-Plan (bis 4. Mai 2026)

### M1: Knowledge-Konsolidierung -- ABGESCHLOSSEN

- [x] Dateien umbenannt (Nummern-Praefixe entfernt)
- [x] Redundanzen eliminiert (PAPER_VS_REPO.md, WORKFLOW.md, index.md)
- [x] CLAUDE.md korrigiert
- [x] Alle Querverweise aktualisiert
- Commit: `ff558e2`

### M2: Paper im Repo -- ABGESCHLOSSEN

- [x] `knowledge/paper/paper-draft.md` als Single Source of Truth
- [x] Epistemische Infrastruktur als Leitkonzept
- [x] 7 Abschnitte, 13 Fussnoten, Platzhalter fuer Ergebnisse
- Commit: `d7d4557`

### M3: Deep-Research-Prompts restaurieren

- [ ] Prompt-Template aus Git-History (`knowledge/Operativ.md`) in `prompts/deep-research-template.md` wiederherstellen
- [ ] Rekonstruierte Parametrisierung dokumentieren (was bekannt, was verloren)
- [ ] Paper-Behauptung korrigieren ("im Repository dokumentiert" -> ehrliche Formulierung)
- Abhaengigkeit: Keine

### M4: Korpus-Bereinigung (326 vs 305)

- [ ] HA-CSV mit aktuellem Zotero-Export abgleichen (DOI/Titel-Matching)
- [ ] 6 identifizierte Duplikate markieren/entfernen
- [ ] 30 unkategorisierte Zotero-Eintraege pruefen: Sollen sie ins HA?
- [ ] ID-Mapping-Datei erstellen (Zotero_Key -> HA_ID)
- Abhaengigkeit: Entscheidung ob 305 oder 326 als Benchmark-Basis

### M5: 10K LLM Assessment ausfuehren

- [ ] `assessment_prompt.md` mit Code synchronisieren (3 Doku-Inkonsistenzen)
- [ ] Optional: Calibration Items implementieren (3-5 Kontroll-Papers)
- [ ] Optional: Retry-Logik fuer fehlgeschlagene API-Calls
- [ ] Assessment ausfuehren (~$1.50, ~30 Min)
- Abhaengigkeit: M4 (Korpus-Basis muss klar sein)

### M6: Teilmengen-Benchmark ausfuehren

- [ ] Google Sheets exportieren (aktueller Stand, ~2/3 fertig)
- [ ] `merge_assessments.py` ausfuehren (Merge ueber Zotero_Key)
- [ ] `calculate_agreement.py` ausfuehren (Cohen's Kappa)
- [ ] `analyze_disagreements.py` ausfuehren
- [ ] Ergebnisse dokumentieren
- Abhaengigkeit: M5 + Human Assessment (mind. ~200 Papers)

### M7: Ergebnisse ins Paper einarbeiten

- [ ] Benchmark-Metriken in Abschnitt 5 einfuegen
- [ ] Divergenz-Analyse schreiben (3-5 annotierte Beispiele)
- [ ] Epistemische Marker beschreiben
- [ ] Zeichenzaehlung pruefen und kuerzen
- Abhaengigkeit: M6

### M8: Paper finalisieren + einreichen

- [ ] Review-Runde mit Co-Autor:innen
- [ ] Auf 18.000 Zeichen bringen
- [ ] Fussnoten finalisieren (max. 15)
- [ ] Einreichung 4. Mai 2026
- Abhaengigkeit: M7

### M9 (Nice-to-Have): Vault + GitHub Pages

- [ ] Vault-Building mit Assessment-Integration
- [ ] Statische GitHub-Pages-Seite fuer Wissensexploration
- Abhaengigkeit: M6 (Assessment-Daten fuer Vault)

---

## Untersuchungsergebnisse (2026-02-18)

### 21 fehlende Papers: Temporale Divergenz

Die HA-CSV wurde aus einem aelteren Zotero-Snapshot generiert. Seitdem hat sich die Bibliothek in beide Richtungen veraendert:

| | Anzahl |
|---|---|
| In beiden vorhanden | 292 |
| Nur in Zotero (neu hinzugefuegt) | 34 |
| Nur in HA (spaeter geloescht) | 13 |
| Netto-Differenz | 21 |

**Muster:** 30 der 34 Zotero-only-Papers haben keine Collection-Zugehoerigkeit (Bulk-Import nach HA-Erstellung). 6 der 34 sind Duplikate von Papers, die bereits in HA unter anderem Key existieren.

**Empfehlung:** HA mit aktuellem Zotero-Export neu synchronisieren, bestehende Bewertungen ueber DOI/Titel-Matching uebernehmen.

### Deep-Research-Prompts: Teilweise rekonstruierbar

**Gefunden:**
- Parametrisches Prompt-Template (5-Komponenten-Struktur: Rolle, Aufgabe, Kontext, Analyseschritte, Output-Format) in Git-History (`knowledge/Operativ.md`, Commit `0a98f49`)
- 3 von 4 Raw-Outputs (Claude, Gemini, Perplexity) in `deep-research/restored/`
- Alle 4 RIS-Dateien
- Meiste Placeholder-Werte rekonstruierbar

**Verloren:**
- Der exakt instanziierte Prompt-Text (wie er in die 4 Modelle eingefuegt wurde)
- Einige Placeholder-Werte (Autorenliste, spezifische Kompetenzen, Region)
- OpenAI/ChatGPT Raw-Output (war nur als binaere PDF committed)

**Konsequenz fuer Paper:** Die Behauptung "im Repository dokumentiert" muss korrigiert werden. Ehrliche Formulierung: Template rekonstruiert, instanziierter Prompt nicht persistent gespeichert.

### 10K Assessment-Prompt: Funktionsbereit

**Staerken:**
- Alle 10 Kategorien stimmen exakt mit Knowledge-Doc-Frontmatter ueberein
- Negative Constraints gegen Sycophancy implementiert
- Inklusions-Logik korrekt (TECHNIK_OK AND SOZIAL_OK)
- Neutrale Rollen-Beschreibung

**Schwaechen:**
- `assessment_prompt.md` (Doku) veraltet vs. tatsaechlicher Code-Prompt
- Keine Calibration Items implementiert (empfohlen, nicht Blocker)
- Keine Retry-Logik fuer API-Fehler
- 4 von 10 Kategorien ohne Positiv/Negativ-Beispiele

**Urteil:** Kann so ausgefuehrt werden. Doku-Sync und optionale Calibration Items sind empfohlen.

---

## Assessment

**Ein Korpus (326 Papers), zwei Assessment-Tracks:**

| Track | Methode | Schema | Status |
|-------|---------|--------|--------|
| **Human** | Google Sheets | 10 binaere Kategorien | ~2/3 fertig |
| **LLM (5D)** | Claude Haiku 4.5 | 5 Dimensionen (0-3) | Fertig |
| **LLM (10K)** | Claude Haiku 4.5 | 10 binaere Kategorien | Bereit (Prompt geprueft) |

### Human Assessment

| Aspekt | Stand |
|--------|-------|
| Papers in CSV | 305 (292 auch in aktuellem Zotero, 13 nur in HA) |
| Decisions getroffen | ~2/3 (ca. 200 Papers) |
| Schema | 10 binaere Kategorien (Technik + Sozial) |
| Bearbeiter | Susi Sackl-Sharif (aktiv), Sabine Klinger (spaeter) |

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
| Prompt-Status | Code-Prompt OK, Doku veraltet |
| Geschaetzte Kosten | ~$1.50 |
| Status | Bereit (nach Korpus-Klaerung) |

---

## Pipeline

### PDF-Akquise und Konvertierung (Fertig)

| Phase | Ergebnis |
|-------|----------|
| PDFs gesamt | 257/326 (78.8%) |
| Markdown-Konversion | 252/257 (98.1%) |
| Markdown bereinigt | 232/252 (markdown_clean/) |
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

---

## Paper: Forum Wissenschaft 2/2026

| Aspekt | Stand |
|--------|-------|
| Deadline | 4. Mai 2026 |
| Umfang | 18.000 Zeichen (inkl. Leerzeichen, inkl. Fussnoten) |
| Fokus | Epistemische Infrastruktur fuer LLM-gestuetzte Literature Reviews |
| **Paper-Datei** | **`knowledge/paper/paper-draft.md`** (Single Source of Truth) |
| Leitkonzept | Epistemische Asymmetrie + Epistemische Infrastruktur |
| Abgleich Paper vs. Repo | `knowledge/paper-integrity.md` |
| Arbeitsplan | `knowledge/paper/Forum Wissenschaft Paper - Arbeitsplan.md` |

**Hinweis:** Das Paper wird ausschliesslich im Repo iteriert. Google Docs ist nicht mehr relevant.

### Offene Punkte am Paper

| Punkt | Prioritaet |
|---|---|
| Ergebnis-Abschnitt befuellen (nach Benchmark) | Hoch (blockiert) |
| Zeichenzaehlung + Kuerzung auf 18.000 | Mittel |
| Deep-Research-Prompts rekonstruieren und verlinken | Mittel |
| Finale Review mit Co-Autor:innen | Nach Benchmark |

---

## Offene Punkte

- [x] Dubletten bereinigen (9 entfernt)
- [x] Seiten-Alignment im Review-Tool implementieren
- [x] 32 fehlende PDFs integriert
- [x] Knowledge Distillation (249 Dokumente)
- [x] Knowledge-Doc Verifikation (97.2% perfekt)
- [x] Repository-Bereinigung (analysis/, pipeline/summaries/, Redundanzen)
- [x] Paper-Entwurf schreiben (Wissensdokument v12 + Text)
- [x] Abgleich Paper vs. Repository (paper-integrity.md)
- [x] Knowledge-Base konsolidieren (Dateien umbenannt, Redundanzen eliminiert)
- [x] Paper im Repo einrichten (paper-draft.md als Single Source of Truth)
- [x] 21 fehlende Papers untersucht (temporale Divergenz, 6 Duplikate identifiziert)
- [x] Deep-Research-Prompts untersucht (Template in Git-History, instanziierter Prompt verloren)
- [x] 10K Assessment-Prompt geprueft (funktionsbereit, 3 Doku-Inkonsistenzen)
- [ ] Deep-Research-Prompt-Template im Repo wiederherstellen
- [ ] Korpus-Bereinigung (HA-CSV mit Zotero synchronisieren)
- [ ] 10K LLM Assessment ausfuehren
- [ ] Teilmengen-Benchmark ausfuehren
- [ ] Benchmark-Ergebnisse ins Paper einarbeiten
- [ ] Vault-Building (Obsidian) + GitHub Pages
- [ ] Paper finalisieren und einreichen (Deadline 4. Mai 2026)

---

## Fehlgeschlagene PDF-Konvertierungen (5)

1. `British_Association_of_Social_Workers_2025_Generat.pdf` - Data format error
2. `Browne_2023_Feminist_AI_Critical_Perspectives_on_Algorithms,.pdf` - Page dimension error
3. `Ulnicane_2024_Intersectionality_in_Artificial_Intelligence.pdf` - Conversion failure
4. `UNESCO__IRCAI_2024_Challenging.pdf` - Not valid
5. `Workers_2025_Generative.pdf` - Not valid

---

*Aktualisiert: 2026-02-18*
