# codebook-v141-includes-14-10-20261002, AI Agent Review

- Akteur: agent, Prüfinstanz ai-agent-review ohne Beteiligung an einem Track
- Regelquellen: `assessment/categories.yaml` 1.4.1, `prompts/prism-agent-reviewer-v1.4.md`, `prompts/prism-ai-agent-review-v0.4.md`, `knowledge/update-protocol.md` in den Abschnitten Eligibility, Text preparation and source gate, Agent-assisted completion und Analysis coding einschließlich Source-review clarification
- Eingaben: `tracks/ar1-coding.json`, `tracks/ar2-coding.json`, beide PRISM-Tracks und Berichte, zehn Volltexte unter `docs/data/fulltext/`, jeweils vollständig gelesen
- Hashprüfung: Codebuch, Reviewer-Prompt, Review-Prompt, beide Coding-Pakete und alle zehn Quellen stimmen mit dem Laufmanifest überein
- Ausgabe: `ai-agent-review.json`
- Ergebnis: 10 Records, davon 3 agreed, 7 resolved, 0 blocked
- Verteilung: Include 10, Unclear 0, Exclude 0
- Validator: `PASS AI-agent review: 10 records`

## Befund über beide Tracks

Beide Coding-Pakete bestehen den Paketvalidator, alle Kategorie- und Analysebelege stehen wörtlich in den zugewiesenen Quellen. Die Tracks stimmen in allen zehn Kategorien und in allen Entscheidungen überein. Abweichungen betreffen nur Analysefelder, am häufigsten `AN_Mitigation_Stage` und `AN_Mitigation_Status`, daneben je einmal `AN_Bias_Axes`, `AN_Harm_Types`, `AN_Bias_Definition`, `AN_Gender_Understanding`, `AN_Theory_Reference` und `Studientyp`. Kein Wert, den beide Tracks teilen, wurde überschrieben.

## Records

| Paper-ID | Ergebnis | Identität | Entscheidung | aufgelöste Felder |
|---|---|---|---|---|
| 4PK8UN82 | agreed | verified | Include | keine |
| AK7K4P97 | resolved | verified | Include | AN_Mitigation_Stage |
| DGLWM93D | agreed | verified | Include | keine |
| HMDFMBV3 | resolved | provisional | Include | AN_Bias_Axes, AN_Mitigation_Stage, AN_Mitigation_Status |
| JPUCNHNU | resolved | provisional | Include | AN_Mitigation_Stage, AN_Mitigation_Status |
| K6JQ7SVA | resolved | provisional | Include | AN_Harm_Types, Studientyp |
| MIT8HTC6 | resolved | provisional | Include | AN_Mitigation_Stage |
| UDZLIJWX | agreed | provisional | Include | keine |
| WLV8L8PM | resolved | provisional | Include | AN_Bias_Definition |
| YN9JAREI | resolved | provisional | Include | identity_check.status, AN_Gender_Understanding, AN_Mitigation_Status, AN_Theory_Reference |

## Auflösungen

- AK7K4P97, `AN_Mitigation_Stage` = Organisational_Process. Die Dekolonisierung von Datensätzen ist als Makropolitik der Datensouveränität und Gemeinschaftseigentümerschaft formuliert und benennt keine Vorbereitung von Lerndaten, daher kein Pre_Processing.
- HMDFMBV3, `AN_Bias_Axes` ergänzt um Other_Axis für politische Orientierung. Die Kategorie conservative und progressive gehört zu den sechs Merkmalen, aus denen die analysierten Gruppen gebildet werden, und erscheint in den Ergebnissen.
- HMDFMBV3, `AN_Mitigation_Stage` = Prompt_Practice mit Status Proposed. Die Limitations empfehlen, die Ausgabe durch Prompting zu regulieren, um Bias im Datensatz zu mindern.
- JPUCNHNU, `AN_Mitigation_Stage` = None mit Status None. Der Schlusssatz zu lokalisierten Daten verbindet Evaluation und Verbesserung allgemein und nennt keine bestimmbare Maßnahme.
- K6JQ7SVA, `AN_Harm_Types` ergänzt um Disparate_Performance. Abschnitt 4.2 und Anhang B leiten Equality of Opportunity als Leistungsgleichheit zwischen Untergruppen im eigenen Rahmenwerk her.
- K6JQ7SVA, `Studientyp` = Konzept. Die Experimente dienen ausdrücklich der Prüfung der theoretischen Ergebnisse, Kern des Werks ist das Rahmenwerk mit Metriken.
- MIT8HTC6, `AN_Mitigation_Stage` = Prompt_Practice und In_Training. Neben der Prompt-Umschreibung setzt das bias-proportionale Nachtrainieren des umschreibenden LLM ausdrücklich im Lernen an.
- WLV8L8PM, `AN_Bias_Definition` = Implicit_Only. Die übernommene Vasquez-Definition bestimmt heteronormative Eingabesprache, nicht den Bias der Modelle, der nur über Emotionswerte gemessen wird.
- YN9JAREI, Identitätsstatus provisional. Der Text nennt Zitiervorschlag, Autor:innen und Jahr, aber keine DOI oder andere stabile Kennung.
- YN9JAREI, `AN_Gender_Understanding` = Binary_Categorical und Intersectional. Die eigene Bildanalyse arbeitet mit Frauen und Männern, die Erwähnung genderqueerer Menschen bleibt konzeptuell und steht in den Notizen.
- YN9JAREI, `AN_Mitigation_Status` = Evaluated. Das Ergänzen von 'divers' im Prompt wird in zwei Tools geprüft und mit geringem Effekt berichtet, die Notiz begrenzt den Status auf diese Maßnahme.
- YN9JAREI, `AN_Theory_Reference` = No. Feministische KI erscheint nur im Ausblick als Narrativ mit Beispiel, Data Feminism und Gender Data Gap als weiterführende Lektüre und Illustration.

## Markierungen für Domänenexpert:innen

- YN9JAREI. Publikationstyp an der Grenze zwischen belegtem Praxisreport und allgemeinem Ratgeber, zugelassen als hochschulisch herausgegebene graue Literatur mit Quellenliste. Mitigation_Status Evaluated beruht auf einem informellen Einzeltest.
- HMDFMBV3. Ob politische Orientierung eine soziale Benachteiligungsachse im Sinn von Other_Axis ist, bleibt eine fachliche Entscheidung.
- WLV8L8PM. Social_Construct beruht auf der Heteronormativitätsrahmung binärer Gendernormen und nicht auf einem eigenen Satz über Gender, ein Grenzfall der Regel 1.4.1.
- K6JQ7SVA. Disparate_Performance stützt sich auf eine formale Herleitung ohne empirische Messung von Leistungsunterschieden.
- AK7K4P97. Der Theoriebezug Dekolonisierung von KI liegt an der Grenze zwischen rahmendem Konzept und Policy-Forderung.

## Autoritätsgrenze

Die Übereinstimmung beider Tracks ist eine Prozessdiagnose ohne Aussage über Reliabilität oder Genauigkeit, zumal beide Tracks auf demselben Modell liefen. Der Review begründet höchstens den internen Status ai-agent-reviewed. Fachliche Verifikation und Publikationsfreigabe bleiben Domänenexpert:innen vorbehalten.
