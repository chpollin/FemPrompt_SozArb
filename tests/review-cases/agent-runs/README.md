# Agentische PRISM-Läufe

Jeder Lauf besitzt ein versioniertes `run.json`, einen eigenen PRISM-Export und einen kompakten Bericht pro Reviewer-Kürzel. Vor dem Lauf fixiert das Manifest Zuweisung, Prompt-Hash, Modell, Anwendungsversion und Regeln. Nach dem Lauf ergänzt die Orchestrierung Status, Export-Hashes, Supplements und Evaluationsverweise. Agenten verändern das Manifest nicht.

```text
agent-runs/<run-id>/
  run.json
  tracks/<reviewer>.json
  reports/<reviewer>.md
```

Für jeden Agenten läuft PRISM in einem getrennten Browserprofil und bei paralleler Ausführung auf einem eigenen lokalen Port. Ein Wiederholungslauf erhält ebenfalls einen neuen Browser-Ursprung, damit kein gespeicherter Testzustand in den Lauf gelangt. Die URL enthält `trial=1`, `actor=agent` und das feste Reviewer-Kürzel. Ein Track ist nur gültig, wenn er über die sichtbare Exportfunktion von PRISM entstanden ist. Produktive Dateien unter `docs/data/screening/` bleiben während des Laufs unberührt. Eine technische Übernahme erfordert eine ausdrückliche Operatorentscheidung und vereinigt nur authentische Exporte nach einer ausführbaren Prüfung. Die fachliche Ratifikation der Urteile und Laufregeln ist ein eigener Status.

Das Manifest enthält Aufgaben und gemeinsame Regeln. Laufende Befunde schreibt jede Instanz ausschließlich in den eigenen Bericht. Die Orchestrierung prüft danach Exporte und Berichte, ergänzt den Manifeststatus und übergibt die Tracks an eine getrennte Evaluation. Der produktive Datensatz bewahrt `actor`, Reviewer-Kürzel, Textquelle und Belegprovenienz aus dem authentischen Export.
