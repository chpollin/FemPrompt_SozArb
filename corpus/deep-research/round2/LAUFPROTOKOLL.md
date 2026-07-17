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
- Konvertierung: Prompt verbatim in `Gemini_conversion-prompt.md`, Modell Claude Fable 5 (claude-fable-5), Laufdatum 2026-07-17; Ausgabe `Gemini_deep-research.ris`, 8 Records; nichts erfunden, fehlende Felder weggelassen (kein DOI bei zwei Records, ein Autorenteam nur mit Nachnamen im Quelltext)
- Spot-Check (2026-07-17, Leitstelle): acht Stichproben (Titel, DOIs) zeichengenau in der Rohausgabe wiedergefunden; Vorbehalt des Konverters, die arXiv-DOI von Boufaied et al. steht so im Quelltext, wirkt aber fehlerhaft (ID-Jahresfolge 2604), unverändert übernommen und beim Screening zu prüfen
- Auffälligkeiten: Prosa-Bericht statt Record-Liste; die Konvertierung erfasst alle referenzierten Publikationen, die Fensterprüfung (Juli 2025 bis Juni 2026) läuft wie präregistriert erst bei Dedup und Screening

### L4 Perplexity (Deep Research)

- **Entfällt in Runde 2** (Operator, 2026-07-17): kein Perplexity-Zugang mehr vorhanden. Abweichung gegenüber Runde 1 (dort vier Lanes), als datiertes Amendment festgehalten; Runde 2 läuft mit den Lanes L1 bis L3. Konsequenz für die Auswertung, die Lane-Abdeckung der Rundenvergleiche ist entsprechend drei- statt vierspurig zu dokumentieren.

### L5 Claude Code Web-Research (optional, §10 Punkt 5)

- Läuft mit: ja/nein
- Modellversion (Pflicht bei ja):
- Datum und Uhrzeit:
- Rohausgabe gesichert als: `raw/ClaudeCode_deep-research.md`

## Nachgelagerte Schritte (je Lane abhaken)

- [x] RIS erzeugt für L1 und L2 (2026-07-17): `ChatGPT_deep-research.ris` (5 Records), `Claude_deep-research.ris` (8 Records); Inhalt identisch zur Rohausgabe bis auf das vorgeschriebene Lane-Präfix in N1 und getrimmte Zeilenenden. L3 in Konvertierung (siehe oben).
- [x] Dedup aller drei Lanes gegen den Bestandskorpus (2026-07-17, per DOI und normalisiertem Titel gegen `corpus/deep-research/*.ris`, 17 DOIs / 32 Titel Bestand): kein Match gegen Runde 1, kein Record entfernt. Zwei lane-übergreifende Duplikate innerhalb Runde 2, Gengler/Wedel 2025 "Ethical AI through a Feminist Lens" (L1 und L2) und Shieh et al. 2026 "Intersectional biases in narratives" (L2 und L3); bleiben in den RIS-Dateien (Lane-Attribution), Zusammenführung beim Zotero-Import mit dokumentiertem Match-Grund.
- [x] Spot-Check L1/L2 gegen die Rohausgabe (2026-07-17, Leitstelle): alle 13 Records, Autor/Jahr/Titel/DOI/URL unverändert übernommen, einzige Änderung das N1-Lane-Präfix. L3-Spot-Check im L3-Eintrag oben.
- [x] Zotero-Import erledigt (Operator, 2026-07-17), aus den committeten RIS-Dateien in die Gruppenbibliothek FemPrompt_SozArb, Sammlung `deepresearch-Juni-2025-2026` mit drei Lane-Untersammlungen; alle 21 Einträge per lokaler Zotero-API gegen die RIS-Dateien abgeglichen (5/8/8, vollständig). `corpus/source_tool_mapping.json` regeneriert (Runde-2-Collections und 21 Item-Keys, Duplikat-Hinweis für den Merge-Fall). Anmerkung zur Sammlungs-Benennung, das präregistrierte Fenster ist Juli 2025 bis Juni 2026, der Sammlungsname sagt "Juni-2025-2026"; inhaltlich ohne Folgen, hier vermerkt statt umbenannt.

## Amendment zur Präregistrierung (update-protocol §10)

Die Läufe wurden vor der Fixierung der fünf §10-Offenpunkte gestartet. Damit die Präregistrierung konsistent bleibt, werden die fünf Punkte hier als datiertes Amendment beantwortet und anschließend ins update-protocol übernommen:

1. **Prompt-Provenienz** (§4.1): bestätigt (Operator, 2026-07-17). Runde 2 nutzt den dokumentierten Round-1-Prompt als Grundlage; der Round-2-Prompt liegt committet als `../literature-review-prompt-round2.md`. Der Anspruch bleibt "dokumentierte Fassung", nicht "verbatim ausgeführte Runde-1-Fassung" (letztere ist unbeweisbar, siehe Provenienz-Hinweis im Prompt-Dokument).
2. **Suchfenster** (§4.2): bestätigt (Operator, 2026-07-17), Juli 2025 bis einschließlich Juni 2026.
3. **Analysefeld-Freeze** (§4.5): gelockert auf "vor Screening-Start" (Operator, 2026-07-17), Begründung: die Suchläufe waren zum Entscheidungszeitpunkt bereits ausgeführt, ein Freeze vor erster Suche ist nicht mehr erfüllbar. Zusätzlicher Operator-Entscheid: vor dem Freeze läuft ein Pilot der Analysefelder an einer stratifizierten Stichprobe bereits aufgenommener Papers (update-protocol, Validierungspfad vor Freeze); erst danach Fixierung, erst danach Screening.
4. **Screening-Modus** (§5): full-batch (Operator, 2026-07-17); alle Runde-2-Kandidaten in einem Durchgang.
5. **L5-Lane**: ja (Operator, 2026-07-17). Ausführung als Claude-Code-Web-Research mit demselben Prompt, Modellversion Claude Fable 5 (claude-fable-5); Protokollierung im L5-Eintrag oben.
