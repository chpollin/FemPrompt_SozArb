# Drei-Persona-Pilot

Dieser Ordner dokumentiert den ersten explorativen Lauf mit den Kürzeln `ea`, `mk` und `pe`. Die Tracks umfassen je zehn bearbeitete Papers. Wegen vier inzwischen behobener Werkzeugmängel sind sie Evaluationsmaterial und keine produktiven Forschungsdaten:

- PRISM erzeugte im Testmodus noch keinen authentischen Export; die JSON-Dateien wurden aus dem sichtbaren Browserzustand rekonstruiert.
- Belegquelle und handelnder Akteur waren im Feld `origin` vermischt.
- Ein angehefteter Paper-Beleg setzte die Kategorie automatisch auf `ja`.
- Enter konnte bei der Textsuche noch die vorherige Treffermenge verwenden.

Kanonische Laufartefakte sind `ea.json` mit `ea-report.md`, `mk.json` mit `mk-report.md` sowie `pe.json` mit `pe-ui-report.md`. `pe-analysis-report.md` und `pe-prepared.json` dokumentieren die vorgelagerte fachliche Vorbereitung und sind kein eigener Track.

Ein erneuter Lauf verwendet die jeweils im Run-Manifest gehashte Version von `prompts/prism-agent-reviewer.md`; aktuell ist das v0.4. Neue Läufe folgen der Struktur unter `tests/review-cases/agent-runs/`.
