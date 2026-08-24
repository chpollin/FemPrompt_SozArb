# Drei-Persona-Pilot

Dieser Ordner dokumentiert den ersten explorativen Lauf mit den Kürzeln `ea`, `mk` und `pe`. Die Tracks umfassen je zehn bearbeitete Papers. Wegen vier inzwischen behobener Werkzeugmängel sind sie Evaluationsmaterial und keine produktiven Forschungsdaten:

- PRISM erzeugte im Testmodus noch keinen authentischen Export; die JSON-Dateien wurden aus dem sichtbaren Browserzustand rekonstruiert.
- Belegquelle und handelnder Akteur waren im Feld `origin` vermischt.
- Ein angehefteter Paper-Beleg setzte die Kategorie automatisch auf `ja`.
- Enter konnte bei der Textsuche noch die vorherige Treffermenge verwenden.

Kanonische Laufartefakte sind `ea.json` mit `ea-report.md`, `mk.json` mit `mk-report.md` sowie `pe.json` mit `pe-ui-report.md`. `pe-analysis-report.md` und `pe-prepared.json` dokumentieren die vorgelagerte fachliche Vorbereitung und sind kein eigener Track.

Ein erneuter Lauf verwendet stets die im Run-Manifest gehashte Promptversion. Der historische Track bleibt an `prompts/prism-agent-reviewer.md` v1.0 gebunden. Neue Läufe verwenden `prompts/prism-agent-reviewer-v1.1.md` und folgen dem Run-Schema 1.2 unter `tests/review-cases/agent-runs/`. Der explorative Pilot bleibt über seinen Baseline-Commit und den dort protokollierten v0.4-Hash reproduzierbar.
