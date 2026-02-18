# Status (2026-02-18)

## Aktueller Fokus: Benchmark ausfuehren (M6) + Paper iterieren

M3-M5 abgeschlossen: Deep-Research-Prompt-Template restauriert, papers_full.csv generiert (326 Papers), 10K LLM Assessment ausgefuehrt (326/326, 232 Include, 94 Exclude, ~$1.44). Naechster Schritt: Google Sheets Export fuer Human Assessment -> Merge -> Cohen's Kappa berechnen.

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

### M3: Deep-Research-Prompts restaurieren -- ABGESCHLOSSEN

- [x] Prompt-Template aus Git-History (`knowledge/Operativ.md`) in `prompts/deep-research-template.md` wiederherstellen
- [x] Rekonstruierte Parametrisierung dokumentieren (was bekannt, was verloren)
- [x] Paper-Behauptung korrigieren ("im Repository dokumentiert" -> ehrliche Formulierung)
- Commit: (siehe Git-Log)

### M4: Korpus-Bereinigung (326 vs 305) -- ABGESCHLOSSEN

- [x] HA-CSV mit aktuellem Zotero-Export abgleichen (292 gemeinsam, 34 nur Zotero, 13 nur HA)
- [x] Duplikate markieren (95 gesamt: 76 Titel-basiert in Zotero + 60 in HA, Ueberlappung)
- [x] `papers_full.csv` generiert (326 Zeilen, Has_HA-Spalte fuer Mapping)
- [x] Generator-Script: `benchmark/scripts/generate_papers_csv.py`
- Benchmark-Basis: 326 Papers, Schnittmenge mit HA fuer Kappa-Berechnung
- Commit: (siehe Git-Log)

### M5: 10K LLM Assessment ausfuehren -- ABGESCHLOSSEN

- [x] `assessment_prompt.md` mit Code synchronisieren (3 Inkonsistenzen behoben: Rolle, KI_Sonstige, negative Constraints)
- [x] Beispiele fuer alle 10 Kategorien in `categories.yaml` ergaenzt (v1.2)
- [x] Assessment ausgefuehrt: 326/326 Papers, ~$1.44, Haiku 4.5
- [x] Ergebnis: `benchmark/data/llm_assessment_10k.csv` (232 Include, 94 Exclude)
- Commit: (siehe Git-Log)

### M6: Teilmengen-Benchmark ausfuehren

**BLOCKER:** Frische Google-Sheets-CSV benoetigt (Susi/Sabine muessen aktuellen Stand exportieren).

Vorbereitung abgeschlossen:
- LLM-Assessment: `benchmark/data/llm_assessment_10k.csv` (326/326, bereit)
- Merge-Script: `benchmark/scripts/merge_assessments.py` (bereit, Schnittmenge ueber Zotero_Key)
- Kappa-Script: `benchmark/scripts/calculate_agreement.py` (bereit)
- Disagreement-Script: `benchmark/scripts/analyze_disagreements.py` (bereit)

Ausstehend (nach HA-Export):
- [ ] **Google Sheets exportieren** -> als `benchmark/data/human_assessment_fresh.csv` ablegen
- [ ] `merge_assessments.py` ausfuehren (ergibt ~200 Papers Schnittmenge)
- [ ] `calculate_agreement.py` ausfuehren (Cohen's Kappa pro Kategorie)
- [ ] `analyze_disagreements.py` ausfuehren (Severity-Ranking)
- [ ] Ergebnisse in `benchmark/results/` dokumentieren
- Abhaengigkeit: Human Assessment (mind. ~200 Papers bewertet)

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
| **Human** | Google Sheets | 10 binaere Kategorien | ~2/3 fertig (BLOCKER fuer M6) |
| **LLM (5D)** | Claude Haiku 4.5 | 5 Dimensionen (0-3) | Fertig (325/325) |
| **LLM (10K)** | Claude Haiku 4.5 | 10 binaere Kategorien | **Fertig (326/326)** |

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

### LLM Assessment (10 Kategorien - abgeschlossen)

| Aspekt | Stand |
|--------|-------|
| Script | `benchmark/scripts/run_llm_assessment.py` |
| Prompt-Status | Code-Prompt und Doku synchronisiert (v2.1) |
| Tatsaechliche Kosten | $1.44 |
| Status | **Fertig** -- 326/326 Papers, 232 Include, 94 Exclude |
| Output | `benchmark/data/llm_assessment_10k.csv` |

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
| Ergebnis-Abschnitt befuellen (nach Benchmark) | Hoch (blockiert bis M6) |
| Zeichenzaehlung + Kuerzung auf 18.000 | Mittel |
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
- [x] 10K Assessment-Prompt geprueft und synchronisiert (3 Inkonsistenzen behoben, v2.1)
- [x] Deep-Research-Prompt-Template im Repo wiederhergestellt (`prompts/deep-research-template.md`)
- [x] Korpus-CSV generiert (`benchmark/data/papers_full.csv`, 326 Zeilen, Is_Duplicate + Has_HA Flags)
- [x] 10K LLM Assessment ausgefuehrt (326/326, $1.44, `benchmark/data/llm_assessment_10k.csv`)
- [ ] **Google Sheets Export** (aktuelle Human-Assessment-CSV von Susi/Sabine exportieren) -- BLOCKER
- [ ] Teilmengen-Benchmark ausfuehren (merge + kappa + disagreements)
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
