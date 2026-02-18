# Epistemische Infrastruktur: Mapping-Tabelle

Operationalisierung des Leitbegriffs "epistemische Infrastruktur" aus dem Paper "Epistemische Asymmetrien in Deep-Research-gestuetzten Literature Reviews". Die Tabelle verknuepft jede Asymmetrie-Dimension mit konkreten Risiken, Massnahmen und pruefbaren Artefakten im Repository.

---

## Zentrale Mapping-Tabelle

| Asymmetrie-Dimension | Risiko | Infrastruktur-Massnahme | Pruefbares Artefakt | Status |
|---|---|---|---|---|
| **Intransparenz** (justifikatorische Esoterik) | Unueberpruefbare Selektion durch Deep-Research-Modelle | Multi-Provider-Strategie (4 Modelle) + Selektions-Logging | `corpus/source_tool_mapping.json`, `deep-research/restored/` | Teilweise (Logging vorhanden, Audit ausstehend) |
| **Konfabulation** | Erzeugung plausibler, aber falscher Aussagen | 3-Stage SKE mit deterministischer Stufe 2 + Verifikation Stufe 3 | `pipeline/knowledge/_verification/`, Confidence-Scores in Frontmatter | Umgesetzt |
| **Sycophancy** | Prompt-induzierte Ueberattribuierung von Kategorien | Negative Constraints in Prompts, Calibration Items, Prompt-Versionierung | `prompts/CHANGELOG.md`, negative Constraints in `benchmark/scripts/run_llm_assessment.py` | In Arbeit |
| **Paywall-Bias** | Systematische Unterrepraesentation kostenpflichtiger Literatur | Hierarchische Beschaffungsstrategie + OA-Disclosure | PRISMA Flow-Diagramm, Beschaffungsrate (257/326 = 79%) | Teilweise (Rate dokumentiert, OA-Analyse ausstehend) |
| **Prompt-Kompetenz** | Ergebnisabhaengigkeit von Prompt-Qualitaet | Prompt-Governance: Versionierung, Review, Dokumentation | `prompts/CHANGELOG.md` | In Arbeit |
| **Verantwortungsasymmetrie** | Keine zurechenbare Instanz auf LLM-Seite | Expert:innen-Pfad als epistemisch verbindlicher Referenzpfad | Human Assessment (Google Sheets), auditierbare Bewertungsdaten | Umgesetzt (Assessment laufend) |
| **Anbieter-Divergenz** | Verschiedene Modelle liefern verschiedene Evidenzbasen | Multi-Provider-Vergleich, Overlap-Analyse | `corpus/papers_metadata.csv` (Source_Tool-Spalte), Provider-Statistiken | Teilweise (Verteilung dokumentiert, Overlap-Analyse ausstehend) |
| **Ressourcenasymmetrie** | Ungleich verteilter Zugang zu Frontier-Modellen und Infrastruktur | Kosten-Transparenz, Open-Source-Pipeline wo moeglich | Kosten-Dokumentation ($8.73 gesamt), Docling (Open Source) | Dokumentiert |

---

## Designprinzip

Fuer jede Phase des Workflows gilt eine Leitfrage: **Wer entscheidet wo was, und warum?**

### Phase 1: Identifikation (Deep Research)

| Entscheidung | Wer entscheidet | Warum | Artefakt |
|---|---|---|---|
| Welche Literatur wird gefunden? | 4 LLM-Modelle | Automatisierte Suche ueber Disziplinen | RIS-Dateien, Zotero-Collections |
| Welche Literatur wird ergaenzt? | Studienassistentin + Forschende | Manuelle Recherche schliesst Luecken | 50 Manual-Papers in `papers_metadata.csv` |
| Welche Duplikate werden entfernt? | Studienassistentin | Metadaten-Abgleich (DOI, Titel) | Zotero-Duplikaterkennung |

### Phase 2: Bewertung (Dual Assessment)

| Entscheidung | Wer entscheidet | Warum | Artefakt |
|---|---|---|---|
| Include/Exclude (verbindlich) | Expert:innen (Sackl-Sharif, Klinger) | Feldkenntnis, interpretative Urteilskraft | Google Sheets, `human_assessment.csv` |
| Include/Exclude (explorativ) | LLM (Haiku 4.5) | Skalierbarkeit, Muster-Erkennung | `assessment_llm.xlsx` (5D), 10K-Output |
| Kategorie-Zuordnung | Beide (parallel, unabhaengig) | Vergleich ermoeglicht Divergenz-Analyse | Benchmark-Metriken (Cohen's Kappa) |

### Phase 3: Synthese (SKE)

| Entscheidung | Wer entscheidet | Warum | Artefakt |
|---|---|---|---|
| Extraktion (Stufe 1) | LLM (probabilistisch) | Skalierung ueber 249 Dokumente | `_stage1_json/` |
| Formatierung (Stufe 2) | Deterministische Software | Reproduzierbarkeit, keine Konfabulation | `_stage2_draft/` |
| Verifikation (Stufe 3) | LLM (probabilistisch mit Pruefauftrag) | Pruefung gegen Original-Volltext | `_verification/`, Confidence-Score |
| Eskalation bei niedrigem Confidence | Software-Regel (< 75) | Schwellenwert-basierte Weiterleitung | `needs_correction`-Markierung |

---

## Verifikation in der SKE: Was "verifiziert" bedeutet

Die Verifikation in Stufe 3 prueft drei Aspekte mit definierten Gewichtungen:

| Aspekt | Gewicht | Pruefung | Schwellenwert |
|---|---|---|---|
| Completeness | 40% | Sind alle Pflichtfelder befuellt? Fehlen wesentliche Informationen? | Vollstaendig = 100%, Fehlendes Feld = Abzug |
| Correctness | 40% | Stimmen extrahierte Aussagen mit dem Originaltext ueberein? | Zitat muss im Original auffindbar sein |
| Category Validation | 20% | Sind Kategorien-Zuordnungen durch Evidenzzitate gestuetzt? | Evidenz-Zitat muss Kategorie stuetzen |

**Gesamt-Confidence:** Gewichteter Score (0-100). Ergebnis: 242/249 (97.2%) erreichen Score >= 75.

**Eskalationsregel:** Confidence < 75 markiert Dokument als `needs_correction`. Aktuell keine automatische Korrektur, nur Logging. Expert:innen-Review fuer markierte Dokumente empfohlen, aber nicht systematisch umgesetzt.

---

## Sycophancy-Mitigation: Konkrete Massnahmen

### Negative Constraints (in Assessment-Prompts)

Explizite Regeln, die Ueberattribuierung verhindern:

- "Klassifiziere nur als 'Feministisch', wenn der Text explizit feministische Theorie, Methoden oder Perspektiven verwendet ODER sich auf feministische Autor:innen bezieht. Implizite Naehe zu Gender-Themen reicht nicht."
- "Bei Unsicherheit: 'Nein' statt 'Ja'. Im Zweifel fuer den restriktiveren Wert."
- "Vergib nicht mehr als 3-4 Kategorien pro Paper, es sei denn, der Text adressiert tatsaechlich mehr."

### Calibration Items

3-5 Papers mit bekannter korrekter Klassifikation werden als Kontrollgruppe eingesetzt:

| Paper (Beispiel) | Erwartete Klassifikation | Prueft |
|---|---|---|
| Rein technisches ML-Paper ohne Sozialbezug | Alle Sozial-Kategorien = Nein | False-Positive-Rate |
| Explizit feministisches Paper | Feministisch = Ja | True-Positive-Rate |
| Fairness-Paper ohne Gender-Bezug | Feministisch = Nein, Fairness = Ja | Trennschaerfe |

### Prompt-Versionierung

Jede Aenderung am Prompt wird in `prompts/CHANGELOG.md` dokumentiert mit:
- Versionsnummer (vX.Y)
- Datum
- Aenderung und Begruendung
- Auswirkung auf Testergebnisse (falls gemessen)

---

## Selektions-Audit: Kennzahlen

### Provider-Verteilung (aus `human_assessment.csv`, 305 Papers)

| Provider | Papers | Anteil (DR) | DOI verfuegbar |
|----------|--------|-------------|----------------|
| Perplexity | 75 | 29.5% | 22 (29%) |
| Claude | 63 | 24.8% | 37 (59%) |
| ChatGPT | 62 | 24.4% | 42 (68%) |
| Gemini | 54 | 21.3% | 22 (41%) |
| **Deep Research gesamt** | **254** | **100%** | **123 (48%)** |
| Manual (ergaenzend) | 50 | -- | 40 (80%) |
| **Gesamt** | **305** | -- | **163 (53%)** |

**Befund DOI-Verfuegbarkeit:** Manuelle Recherche liefert deutlich hoehere DOI-Raten (80%) als Deep Research (48%). Perplexity hat die niedrigste DOI-Rate (29%), was auf mehr graue Literatur hindeutet.

### Publikationstypen

| Typ | Anzahl | Anteil |
|-----|--------|--------|
| journalArticle | 182 | 59.7% |
| report | 60 | 19.7% |
| conferencePaper | 42 | 13.8% |
| bookSection | 9 | 3.0% |
| book | 6 | 2.0% |
| webpage | 4 | 1.3% |
| thesis | 1 | 0.3% |

### Overlap-Analyse (aus RIS-Dateien, 34 Papers)

Die RIS-Dateien in `deep-research/restored/` decken 34 von 254 Deep-Research-Papers ab (13.4%). Fuer diese Stichprobe:

| Metrik | Wert |
|--------|------|
| Total unique Papers in RIS | 32 |
| Davon nur von 1 Provider gefunden | 30 (93.8%) |
| Davon von 2+ Providern gefunden | 2 (6.2%) |
| **Overlap-Rate** | **6.2%** |

**Die 2 Overlap-Papers:**
1. "Gender Bias in Artificial Intelligence: Empowering Women..." (OpenAI + Perplexity)
2. "Data Feminism for AI" (Claude + Perplexity)

**Einschraenkung:** Diese Zahlen gelten nur fuer die 34 Papers der ersten RIS-Runde. Die restlichen 220 Deep-Research-Papers kamen aus weiteren Runden, deren RIS nie committiert wurde. Eine Gesamt-Overlap-Analyse auf Korpus-Ebene ist mit den vorhandenen Daten nicht moeglich, da `human_assessment.csv` jedes Paper nur einem einzigen Provider zuordnet (basierend auf Zotero-Collection-Zugehoerigkeit).

### Missingness-Indikatoren

| Indikator | Wert |
|-----------|------|
| PDF-Beschaffungsrate | 257/326 (79%) |
| Nicht beschaffbar | 69/326 (21%) -- primaer Paywall |
| Markdown-Konversionsrate | 252/257 (98%) |
| Knowledge-Doc-Rate | 249/252 (99%) |
| **Gesamte Verlustrate** (Zotero -> Knowledge Doc) | 77/326 (23.6%) |

### Noch ausstehend

- **OA-Analyse:** Open-Access-Status der 326 Papers via Unpaywall-API (DOI-basiert, daher nur fuer 53% moeglich)
- **Gesamt-Overlap:** Nicht berechenbar mit vorhandenen Daten (s.o.)

---

## Offene Punkte

- [ ] OA-Analyse durchfuehren (Unpaywall-API)
- [ ] Overlap-Analyse auf vollem Korpus (ueber `papers_metadata.csv`, nicht nur RIS)
- [ ] Calibration Items definieren und testen
- [ ] Eskalationsregel fuer Expert:innen-Review formalisieren
- [ ] Institutional-Level: KI-Richtlinien-Bezug dokumentieren

---

*Aktualisiert: 2026-02-18*
