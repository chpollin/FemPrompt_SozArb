# codebook-v141-includes-08-7-20261002, AI Agent Review

- Akteur: agent (ai-agent-review), Prompt prompts/prism-ai-agent-review-v0.4.md, Codebuch assessment/categories.yaml 1.4.1, Reviewer-Prompt der Tracks prompts/prism-agent-reviewer-v1.4.md
- Eingaben: tracks/ar1-coding.json und tracks/ar2-coding.json, PRISM-Tracks tracks/ar1.json und tracks/ar2.json, Berichte reports/ar1.md und reports/ar2.md; alle Hashes stimmen mit dem Laufmanifest überein
- Quellen: die sieben zugewiesenen Volltexte unter docs/data/fulltext/, Hashes gegen das Manifest geprüft, vollständig gelesen
- Ausgabe: ai-agent-review.json
- Validator: PASS AI-agent review: 7 records
- Ergebnis: 7 Records, 0 agreed, 7 resolved, 0 blocked; Include 6, Unclear 1, Exclude 0

## Prüfumfang

Für jedes Werk wurden Paper-ID, Titel, DOI oder Ersatzkennung, Autor:innen und Jahr gegen den Volltext geprüft. Alle Belegstellen beider Tracks, in `evidence` wie in `analysis_evidence`, stehen zeichengetreu und zusammenhängend im zugewiesenen Volltext. Die finalen Evidence-Arrays sind die Vereinigung der Belegstellen beider Tracks, beschränkt auf positive Kategorien; Fundstellen, die einen verworfenen Analysewert trugen, wurden entfernt. Kein Identitäts-, Quellen-, Publikationstyp- oder Methodenkonflikt trat auf.

Drei Werke tragen keinen DOI im Text (8MDXCTA6, G53MCF3W, Y8J3HI9J). Titel, Autor:innen und Jahr stimmen, die Identität bleibt provisional ohne Konflikt. G53MCF3W ist ein Preprint und entspricht dem Versionstyp des Manifests.

## Records

| Paper-ID | Identität | Entscheidung | Ergebnis | Aufgelöste Felder |
|---|---|---|---|---|
| 8MDXCTA6 | provisional | Include | resolved | AN_Harm_Types |
| G53MCF3W | provisional | Include | resolved | AN_Mitigation_Stage |
| IDW7QSYG | verified | Include | resolved | AN_Bias_Axes, AN_Gender_Definition, AN_Gender_Understanding |
| J9IZDVTW | verified | Unclear | resolved | KI_Sonstige |
| XXCDL3A3 | verified | Include | resolved | AI_Literacies, AN_Gender_Definition |
| Y8J3HI9J | provisional | Include | resolved | AN_Harm_Types |
| ZLMLP53P | verified | Include | resolved | AN_Bias_Axes, AN_Mitigation_Status |

Beide Tracks stimmen in allen Entscheidungen überein. Kein Wert, den beide Tracks teilten, wurde überschrieben.

## Auflösungen

- 8MDXCTA6, AN_Harm_Types: Disparate_Performance ergänzt (ar2). Der Review führt den AUC-Vergleich über rassifizierte Gruppen als codierte Kategorie seiner Equity-Evaluation und synthetisiert dazu Befunde, die Reviewregel des Codebuchs codiert solche strukturierenden Kategorien.
- G53MCF3W, AN_Mitigation_Stage: Intra_Processing ergänzt (ar2). Abschnitt 5.2.2 schlägt Rückfragen des Modells bei vagen Prompts als eigenen Mechanismus während der Anwendung vor.
- IDW7QSYG, AN_Bias_Axes und AN_Gender_Understanding: Intersectional entfernt (ar2). H4 misst nur das gemeinsame Auftreten von Gender- und Race-Bezügen in Tweets, kein von der Kombination abhängiges Ergebnis.
- IDW7QSYG, AN_Gender_Definition: Implicit_Only (ar2). Die Gliederungswendung gender as a narrow social construct bestimmt Geschlecht nicht, das Verständnis ergibt sich aus der binären Klassifikation.
- J9IZDVTW, KI_Sonstige: teilweise (ar2). Der eigene AI-Literacy-Rahmen nennt machine learning principles und nicht-generative Anwendungen ausdrücklich als nachgeordneten Inhalt; Unclear bleibt.
- XXCDL3A3, AI_Literacies: teilweise (ar2). Das Werk adressiert ausdrücklich die kritische Praxis und Literacy von AI-Fairness-Forschenden als nachgeordneten Aspekt; Include bleibt.
- XXCDL3A3, AN_Gender_Definition: Explicit (ar2). Die als Bewertungsgrundlage übernommene Bestimmung nach Collins und Bilge legt Geschlecht als machtproduzierte soziale Teilung fest und trägt in beiden Tracks bereits Social_Construct.
- Y8J3HI9J, AN_Harm_Types: Erasure und Stereotyping entfernt (ar1). Beide stützen sich nur auf zitierte Einzelfälle in 4.1, die eine begriffliche Erweiterung illustrieren, nicht auf die eigene Stufenanalyse.
- ZLMLP53P, AN_Bias_Axes: Race_Ethnicity und Other_Axis entfernt (ar2). Race erscheint nur in Demografie- und Reichweitenangaben, Kaste nur in einer Aufzählung.
- ZLMLP53P, AN_Mitigation_Status: Evaluated (ar1). Das Werk bewertet nach eigener Angabe die Wirkung seiner organisatorischen Maßnahmen und berichtet abgeschlossene Erhebungen mit Ergebnis, darunter ein gemischtes.

Y8J3HI9J führt AN_Bias_Axes in beiden Tracks mit denselben drei Werten in anderer Reihenfolge; das ist kein inhaltlicher Unterschied.

## Für Domänenexpert:innen markiert

- IDW7QSYG: Grenze von Intersectional bei gemessenem gemeinsamem Auftreten zweier Achsen im Diskurs und Schwelle einer expliziten Gender-Definition.
- J9IZDVTW: Werk eines Laufs für eingeschlossene Werke, das nach den zehn Kategorien nur Unclear trägt; offen ist, ob socio-educational background als Bezug zur Sozialen Arbeit gilt.
- XXCDL3A3: Schwelle von AN_Gender_Definition Explicit bei einer übernommenen Bestimmung, die Geschlecht nur neben race und class als machtproduzierte Teilung nennt.
- Y8J3HI9J: Grenze zwischen eigenem Argument und zitierten Fällen bei Erasure und Stereotyping.
- ZLMLP53P: Evaluated für organisatorische Maßnahmen gegen Ausschluss aus der AI-Forschung, die keine technische Bias-Mitigation sind.

## Autoritätsgrenze

Die Übereinstimmung zweier Tracks auf demselben Modell ist eine Prozessdiagnose und keine Reliabilitätsschätzung. Dieser Review begründet höchstens den internen Status ai-agent-reviewed; fachliche Verifikation und Publikationsfreigabe bleiben bei den Domänenexpert:innen. Manifest, Pakete und Tracks wurden nicht verändert, keine produktive Screeningdatei wurde geöffnet oder geschrieben.
