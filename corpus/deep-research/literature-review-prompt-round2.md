# Deep-Research-Prompt Runde 2: Update-Durchgang

**Status:** paste-ready Update-Prompt für den zweiten Deep-Research-Durchgang. Er ändert den Original-Prompt nicht, sondern bettet ihn referenzierbar ein und ergänzt drei Dinge: das erweiterte Suchfenster bis Juli 2026, die Dedup-Pflicht gegen Runde 1 und die Ausgabe nach der RIS-Vorlage.

Der Original-Prompt aus Runde 1 bleibt unverändert die referenzierbare Grundlage: [`literature-review-prompt.md`](literature-review-prompt.md). Die verbindliche Round-2-Präregistrierung mit Begründung jeder Abweichung liegt in [`../../knowledge/update-protocol.md`](../../knowledge/update-protocol.md); dieser Prompt ist deren paste-ready Ausführungsform, kein Ersatz.

---

## 1. Was dieser Prompt tut

Der Round-2-Prompt ist der Round-1-Prompt plus genau drei Ergänzungen. Keine andere Formulierung des Originals wird verändert.

| Ergänzung | Inhalt | Quelle |
|---|---|---|
| Suchfenster | Nur Literatur von Juli 2025 bis einschließlich Juni 2026, überschreibt den Jahresbereich 2023 bis 2025 aus Task 1 | update-protocol §4.2 |
| Dedup | Explizite Dedup-Anweisung gegen die Runde-1-Ausbeute, per DOI und Titel | update-protocol §4.4 |
| Ausgabeformat | Ausgabe direkt als RIS nach der Vorlage `ris-template.md`, Summary in `AB`, Qualitätsurteil in `N1` | ris-template.md |

Das Suchfenster ist bewusst auf Juli 2025 zurückgezogen, nicht auf den Oktober-2025-Lauf von Runde 1, weil der späte Runde-1-Lauf Mitte-2025-Arbeiten verpasst haben kann, die zur Suchzeit noch nicht indexiert waren. Die Überlappung Juli bis Oktober 2025 fängt der Dedup-Schritt ab.

---

## 2. Paste-ready Prompt (identisch für alle Lanes)

Der KONTEXT-Block (Forschungsfrage) steht unverändert wie in Runde 1. Der Analyse-Prompt ist der Round-1-Text mit den drei Ergänzungen. Für die Lanes L1 bis L4 (ChatGPT, Claude, Gemini, Perplexity) wird dieser Text unverändert eingefügt; die optionale Lane L5 (Claude Code Web-Research) nutzt denselben Text (update-protocol Appendix A.3).

```
KONTEXT

Wie können feministische KI-Literacies und intersektional informiertes Prompting als
kritische Praxis dazu beitragen, die Ko-Konstitution von Diskriminierungsformen in
KI-Systemen sichtbar zu machen, während gleichzeitig die Grenzen individueller
Kompetenzansätze gegenüber strukturellen Machtasymmetrien in der KI-Entwicklung
reflektiert werden?

You are an expert in systematic scientific literature analysis. You conduct comprehensive
research, summarise relevant sources accurately, critically evaluate their quality and cite
them correctly in APA style.

Your task:
1. Identify relevant academic literature on the topic '[research question above]', especially
   from peer-reviewed sources.
2. Create a concise summary (max. 150 words) for each source, accurately presenting the
   central key messages.
3. Cite each source completely in APA format (with URL)
4. Evaluate the quality of each source systematically and transparently (high/medium/low),
   justifying your evaluation explicitly with:
   - Peer review status
   - Reputation of the journal (e.g. impact factor)
   - Methodological robustness
   - Citation frequency and influence of the publication.
   - The quality of the text and the relevance of the topic.

Only include literature published from July 2025 up to and including June 2026, because work
published before July 2025 was already covered by the first search round, and this time
restriction supersedes any earlier year range.

Before finalising, deduplicate your result set against work already published before July 2025
and against duplicates within your own results, matching by DOI and by title. Do not output an
entry you would have listed in a 2023-2025 search; if in doubt about the publication date,
state the date you are relying on.

Output format: return the result as RIS records, one record per publication, following this
field mapping. Put the concise summary (task 2) into the AB field and the critical quality
assessment with its justification (task 4) into the N1 field, prefixed with the lane id. Use
TY JOUR for journal articles, TY CHAP for book chapters, TY BOOK for books, TY CONF for
conference papers, TY GEN otherwise. Map authors to AU (one per line), year to PY, title to
TI, journal or venue to JO, DOI to DO, URL to UR. Do not invent values: omit any field not
present in the source. Output only the RIS records, no commentary.
```

Die RIS-Feldbelegung folgt [`ris-template.md`](ris-template.md): `AB` trägt die Summary, `N1` das Qualitätsurteil. Weicht die Ausgabe eines Systems davon ab (etwa Prosa statt RIS), wird sie am Lauf vermerkt und über den Round-2-Konvertierungsprompt (update-protocol, Abschnitt RIS conversion) nachgezogen, statt das Systemergebnis stillschweigend umzuschreiben.

---

## 3. Ausführung durch den Operator (extern)

Der Prompt läuft in den proprietären Deep-Research-Produkten, nicht in diesem Repo. Ablauf je Lane, in dieser Reihenfolge:

1. **Rohausgabe zuerst sichern.** Den Prompt in die Lane einfügen, den Lauf ausführen, die unveränderte Rohausgabe je Lane und Lauf mit Zeitstempel ablegen (`corpus/deep-research/round2/raw/<Lane>_deep-research.md`), bevor irgendetwas konvertiert wird.
2. **RIS prüfen oder erzeugen.** Liefert die Lane schon RIS, wird es unverändert übernommen. Liefert sie Prosa, wird der Konvertierungsprompt aus update-protocol (Abschnitt RIS conversion) angewandt, mit Modellname, Version und Laufdatum im Laufprotokoll.
3. **Dedup als eigener Schritt.** Die Dedup-Anweisung im Prompt ist die erste Stufe; die verbindliche Dedup läuft zusätzlich als Identifikationsschritt vor dem Screening gegen den bestehenden Korpus, per Zotero-Key, DOI und Titel (update-protocol §4.4). Entfernte Records werden mit Match-Grund als Teil der Flow-Daten festgehalten.
4. **Spot-Check.** Eine Stichprobe konvertierter Einträge gegen die Rohausgabe prüfen (Autor, Jahr, Titel, DOI/URL, Lane-Zuordnung), Ergebnis ins Laufprotokoll.
5. **Import.** Zotero-Import nur aus den committed RIS-Dateien, mit der etablierten Prefix-Konvention; `corpus/source_tool_mapping.json` wird regeneriert.

Ein Lauf je Lane, alle Läufe in einem deklarierten Ausführungsfenster. Ein technisch fehlgeschlagener Lauf darf wiederholt werden, jeder Versuch wird mit Zeitstempel protokolliert. Wiederholte Läufe zum Ergebnisvergleich sind nicht Teil dieses Durchgangs und bräuchten ein Amendment.

---

## 4. Provenienz-Hinweis

Das Repo trägt zwei Fassungen des Round-1-Prompts. `literature-review-prompt.md` zeigt einen instanziierbaren zweiteiligen Prompt; `prompts/CHANGELOG.md` hält fest, dass der exakt ausgeführte Round-1-Prompt nie committet wurde und verloren ist. Dieser Update-Prompt baut auf der dokumentierten Fassung auf, weil sie die einzige vollständige, instanziierbare Prompt-Grundlage im Repo ist. Der Anspruch ist daher "Runde 2 nutzt den dokumentierten Round-1-Prompt", nicht "den verbatim ausgeführten"; letzteres ist für Runde 1 unbeweisbar. Die Statusklärung dieser Datei ist ein offener Punkt der Präregistrierung (update-protocol §10).
