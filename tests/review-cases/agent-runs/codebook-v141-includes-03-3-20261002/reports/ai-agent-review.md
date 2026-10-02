# codebook-v141-includes-03-3-20261002, AI Agent Review

- Akteur: agent, Rolle ai-agent-review, an keinem Track beteiligt
- Prompt: prompts/prism-ai-agent-review-v0.4.md, Codebuch assessment/categories.yaml 1.4.1, Reviewer-Prompt der Tracks prompts/prism-agent-reviewer-v1.4.md
- Eingaben: tracks/ar1-coding.json, tracks/ar2-coding.json, tracks/ar1.json, tracks/ar2.json, reports/ar1.md, reports/ar2.md
- Quellenbasis: docs/data/fulltext/GJF776AY.md, KQ5A8D6E.md und MS3CNU3S.md, jeweils vollständig gelesen, SHA-256 gegen das Manifest geprüft und übereinstimmend
- Artefakt: ai-agent-review.json
- Validator: `PASS AI-agent review: 3 records`
- Ergebnis: 3 Records, 0 agreed, 3 resolved, 0 blocked
- Entscheidungen: Include 3, Unclear 0, Exclude 0

## Records

| Paper-ID | Identität | Ergebnis | Entscheidung | aufgelöste Felder |
|---|---|---|---|---|
| GJF776AY | verified | resolved | Include | AN_Bias_Axes, AN_Gender_Definition, AN_Gender_Understanding |
| KQ5A8D6E | verified | resolved | Include | Bias_Ungleichheit, AN_Task |
| MS3CNU3S | provisional | resolved | Include | identity_check.status |

Beide Tracks stimmen in allen drei Entscheidungen überein. Kein Wert, den beide Tracks teilen, wurde überschrieben. Die Kategoriebelege der finalen Records sind aus beiden Tracks zusammengeführt, bei GJF776AY ersetzt der eigene Satz des Essays den referierten Keyes-Befund als Gender-Beleg.

## Auflösungen

GJF776AY, AN_Bias_Axes: gewählt Race_Ethnicity und Gender ohne Sexual_Orientation_Identity. Geschlechtsidentität erscheint nur im einen Satz, der Keyes (2018) zur automatischen Geschlechtserkennung referiert, und der Essay führt sie nicht als eigenes Beispiel aus.

GJF776AY, AN_Gender_Understanding: gewählt Unclear statt Social_Construct. Der Satz zu den „societal definitions of race and gender“ beschreibt das Training eines Gesichtserkennungssystems in einem referierten Fall und hält kein eigenes Verständnis von Geschlecht als soziale Herstellung fest, die Schwelle von 1.4.1 ist nicht erreicht.

GJF776AY, AN_Gender_Definition: gewählt Absent statt Implicit_Only, folgt aus der Paarungsregel mit Unclear.

KQ5A8D6E, Bias_Ungleichheit: gewählt teilweise statt ja. Nichtdiskriminierung ist eines von sechs ethischen Prinzipien und wiederkehrender Lerninhalt, der Beitrag des Rahmenwerks ist aber eine Kompetenzstruktur für Schulcurricula, in der Bias ein expliziter nachgeordneter Aspekt bleibt. Include trägt weiterhin über Diversitaet ja.

KQ5A8D6E, AN_Task: gewählt None statt Other_Task. KI ist Lerngegenstand des Schulcurriculums, die Schreibübungen mit KI-Werkzeugen sind Lernaktivität von Schüler:innen, und KI-gestützte Leistungsbeurteilung erscheint nur als Ausblick in Abschnitt 5.8.

MS3CNU3S, identity_check.status: gewählt provisional statt verified. Titel, Autorenliste und Daten stimmen ohne Konflikt, der Text druckt aber keinen DOI, und der Reviewer-Prompt behandelt eine solche Metadatenlücke als vorläufige Codierung mit Dokumentation.

## Für Domänenexpert:innen markiert

- GJF776AY: Schwelle von Social_Construct beim Satz zu „societal definitions of race and gender“ und die Frage, ob referierte Fälle wie Keyes (2018) als eigene Beispiele für AN_Bias_Axes zählen.
- KQ5A8D6E: Wertelücke in AN_Task für schulische Bildung außerhalb von Teaching_Further_Education und die Grenze zwischen ja und teilweise für Bias_Ungleichheit in einem breiten Kompetenzrahmen.
- MS3CNU3S: Social_Construct beruht auf einer Aussage über soziale Gruppen allgemein, nicht über Geschlecht allein; der DOI-Abgleich gegen die Korpusmetadaten steht aus.

## Prüfung

- Identität, Publikationstyp, Kategorien, Ableitung der Entscheidung, Feldregeln und Paarungsregeln gegen die Quellen geprüft
- Zeichengetreue Fundstellen aller Kategorie- und Analysebelege durch den Validator bestätigt
- Manifest, Coding-Pakete, Tracks und Berichte der Tracks unverändert, nichts committet
