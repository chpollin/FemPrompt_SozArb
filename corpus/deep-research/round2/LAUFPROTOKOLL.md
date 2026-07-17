# Laufprotokoll Deep-Research-Runde 2

**Status:** in Ausführung seit 2026-07-17. Ein Eintrag je Lane und Lauf, ausgefüllt vom Operator unmittelbar nach dem Lauf. Rohausgaben unverändert nach `raw/<Lane>_deep-research.md`, bevor irgendetwas konvertiert wird (Prompt-Dokument §3). Wiederholte Läufe zum Ergebnisvergleich sind nicht Teil des Durchgangs und bräuchten ein Amendment.

## Ausführungsfenster

- Deklariertes Fenster: 2026-07-17 bis [Enddatum eintragen]
- Prompt: `../literature-review-prompt-round2.md`, unverändert eingefügt: ja/nein je Lane unten

## Läufe

### L1 ChatGPT (Deep Research)

- Produkt und Modellversion: ChatGPT Deep Research, [Modellversion Operator]
- Datum und Uhrzeit des Laufs: 2026-07-17, vor 18:31 (Download-Zeitstempel der Rohausgabe)
- Prompt unverändert eingefügt: [Operator bestätigen]
- Rohausgabe gesichert als: `raw/ChatGPT_deep-research.md` (unverändert übernommen aus `Downloads/deep-research-report.md`, 2026-07-17)
- Ausgabeformat: RIS direkt, 5 Records; AB deutsch, N1 mit Qualitätsurteil, noch ohne Lane-Präfix
- Auffälligkeiten: keine bei der Sicherung; Dedup und Spot-Check stehen aus

### L2 Claude (Research)

- Produkt und Modellversion: Claude Research, [Modellversion Operator]
- Datum und Uhrzeit des Laufs: 2026-07-17, vor 18:31 (Download-Zeitstempel der Rohausgabe)
- Prompt unverändert eingefügt: [Operator bestätigen]
- Rohausgabe gesichert als: `raw/Claude_deep-research.md` (unverändert übernommen aus `Downloads/compass_artifact_wf-95833164-…_text_markdown.md`, 2026-07-17)
- Ausgabeformat: RIS direkt, 8 Records; AB englisch, N1 mit begründetem Qualitätsurteil, noch ohne Lane-Präfix
- Auffälligkeiten: ein Record mit PY 2026 (Shieh et al., Nature Communications, publiziert 08.01.2026, im Fenster); Dedup und Spot-Check stehen aus

### L3 Gemini (Deep Research)

- Produkt und Modellversion: Gemini Deep Research, [Modellversion Operator]
- Datum und Uhrzeit des Laufs: 2026-07-17 (Ablage `Downloads/gemini.txt`)
- Prompt unverändert eingefügt: [Operator bestätigen]
- Rohausgabe gesichert als: `raw/Gemini_deep-research.md` (unverändert übernommen aus `Downloads/gemini.txt`, 2026-07-17)
- Ausgabeformat: Prosa (deutscher Fließtext-Bericht), Konvertierung nach der verbindlichen Prozedur des update-protocol (Abschnitt Round 2: binding procedure)
- Konvertierung: Prompt verbatim in `Gemini_conversion-prompt.md`, Modell Claude Fable 5 (claude-fable-5), Laufdatum 2026-07-17; Ausgabe `Gemini_deep-research.ris`
- Spot-Check: [wird nach Konvertierung eingetragen]
- Auffälligkeiten: Prosa-Bericht statt Record-Liste; die Konvertierung erfasst alle referenzierten Publikationen, die Fensterprüfung (Juli 2025 bis Juni 2026) läuft wie präregistriert erst bei Dedup und Screening

### L4 Perplexity (Deep Research)

- **Entfällt in Runde 2** (Operator, 2026-07-17): kein Perplexity-Zugang mehr vorhanden. Abweichung gegenüber Runde 1 (dort vier Lanes), als datiertes Amendment festgehalten; Runde 2 läuft mit den Lanes L1 bis L3. Konsequenz für die Auswertung, die Lane-Abdeckung der Rundenvergleiche ist entsprechend drei- statt vierspurig zu dokumentieren.

### L5 Claude Code Web-Research (optional, §10 Punkt 5)

- Läuft mit: ja/nein
- Modellversion (Pflicht bei ja):
- Datum und Uhrzeit:
- Rohausgabe gesichert als: `raw/ClaudeCode_deep-research.md`

## Nachgelagerte Schritte (je Lane abhaken)

- [ ] RIS geprüft bzw. per Konvertierungsprompt erzeugt (Modell, Version, Laufdatum im Eintrag oben)
- [ ] Dedup als eigener Schritt gegen den Bestandskorpus (Zotero-Key, DOI, Titel); entfernte Records mit Match-Grund festgehalten
- [ ] Spot-Check konvertierter Einträge gegen die Rohausgabe
- [ ] Zotero-Import nur aus committeten RIS-Dateien, `corpus/source_tool_mapping.json` regeneriert

## Amendment zur Präregistrierung (update-protocol §10)

Die Läufe wurden vor der Fixierung der fünf §10-Offenpunkte gestartet. Damit die Präregistrierung konsistent bleibt, werden die fünf Punkte hier als datiertes Amendment beantwortet und anschließend ins update-protocol übernommen:

1. **Prompt-Provenienz** (§4.1): [Antwort Operator]
2. **Suchfenster** (§4.2, Default Juli 2025 bis Juni 2026): [bestätigt / geändert auf]
3. **Analysefeld-Freeze vor erster Suche** (strengere Ordnung): [bestätigt / gelockert auf "vor Screening-Start", mit Begründung, da die Suche bereits lief]
4. **Screening-Modus R1/R2** (full-batch / split): [Antwort Operator]
5. **L5-Lane** (ja/nein, Modellversion): [Antwort Operator]
