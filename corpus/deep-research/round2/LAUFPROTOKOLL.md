# Laufprotokoll Deep-Research-Runde 2

**Status:** in Ausführung seit 2026-07-17. Ein Eintrag je Lane und Lauf, ausgefüllt vom Operator unmittelbar nach dem Lauf. Rohausgaben unverändert nach `raw/<Lane>_deep-research.md`, bevor irgendetwas konvertiert wird (Prompt-Dokument §3). Wiederholte Läufe zum Ergebnisvergleich sind nicht Teil des Durchgangs und bräuchten ein Amendment.

## Ausführungsfenster

- Deklariertes Fenster: 2026-07-17 bis [Enddatum eintragen]
- Prompt: `../literature-review-prompt-round2.md`, unverändert eingefügt: ja/nein je Lane unten

## Läufe

### L1 ChatGPT (Deep Research)

- Produkt und Modellversion:
- Datum und Uhrzeit des Laufs:
- Prompt unverändert eingefügt: ja/nein (Abweichung benennen)
- Rohausgabe gesichert als: `raw/ChatGPT_deep-research.md`
- Ausgabeformat: RIS direkt / Prosa (Konvertierung nötig)
- Auffälligkeiten:

### L2 Claude (Research)

- Produkt und Modellversion:
- Datum und Uhrzeit des Laufs:
- Prompt unverändert eingefügt: ja/nein
- Rohausgabe gesichert als: `raw/Claude_deep-research.md`
- Ausgabeformat: RIS direkt / Prosa
- Auffälligkeiten:

### L3 Gemini (Deep Research)

- Produkt und Modellversion:
- Datum und Uhrzeit des Laufs:
- Prompt unverändert eingefügt: ja/nein
- Rohausgabe gesichert als: `raw/Gemini_deep-research.md`
- Ausgabeformat: RIS direkt / Prosa
- Auffälligkeiten:

### L4 Perplexity (Deep Research)

- Produkt und Modellversion:
- Datum und Uhrzeit des Laufs:
- Prompt unverändert eingefügt: ja/nein
- Rohausgabe gesichert als: `raw/Perplexity_deep-research.md`
- Ausgabeformat: RIS direkt / Prosa
- Auffälligkeiten:

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
