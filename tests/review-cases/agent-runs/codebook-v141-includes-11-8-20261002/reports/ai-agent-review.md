# codebook-v141-includes-11-8-20261002, AI Agent Review

- Akteur: agent (ai-agent-review), an keinem Track beteiligt
- Prompt: prompts/prism-ai-agent-review-v0.4.md (Hash wie im Laufmanifest)
- Codebuch: assessment/categories.yaml 1.4.1 (Hash wie im Laufmanifest), Reviewer-Prompt des Laufs prompts/prism-agent-reviewer-v1.4.md
- Eingaben: tracks/ar1-coding.json und tracks/ar2-coding.json, PRISM-Tracks ar1.json und ar2.json, Berichte ar1.md und ar2.md, acht Volltexte unter docs/data/fulltext/ mit den Manifest-Hashes
- Ausgabe: ai-agent-review.json
- Validator: `PASS AI-agent review: 8 records`
- Ergebnis: 2 agreed, 6 resolved, 0 blocked. Entscheidungen Include 6, Unclear 2, Exclude 0.

## Prüfgrundlage

Alle acht Quellhashes und beide Pakethashes stimmen mit dem Laufmanifest überein. Beide Coding-Pakete bestehen den Paketvalidator. Jede Kategorie-Belegstelle und jede Fundstelle in `analysis_evidence` beider Tracks kommt zeichengetreu in der zugewiesenen Quelle vor, ebenso die beiden Fundstellen, die die Review ergänzt. Die Volltexte wurden vollständig gelesen, Literaturverzeichnisse nur auf Metadaten durchgesehen. Gelesen wurden außerdem die im Prompt genannten Abschnitte von knowledge/update-protocol.md. Gesperrte Pfade wurden nicht geöffnet.

Beide Tracks stimmen in allen acht Entscheidungen überein. Kein Titel- oder DOI-Konflikt, kein Publikationstypkonflikt. Der Identitätsstatus weicht bei 2SNYUZG4 und UJ7DXK8Y ab. Beide Texte nennen weder DOI noch Jahr noch Venue, deshalb übernimmt die Review dort den Status provisional, weil der Reviewer-Prompt bei solchen Metadatenlücken eine vorläufige Codierung vorsieht.

## Records

| Paper-ID | Ergebnis | Entscheidung | aufgelöste Felder |
|---|---|---|---|
| 2SNYUZG4 | resolved | Unclear | Diversitaet, Identitätsstatus |
| 5ERYSQCK | agreed | Unclear | keine |
| 9Y7ZFGI5 | resolved | Include | Feministisch, AN_Bias_Axes, AN_Harm_Types, AN_Mitigation_Stage, AN_Gender_Understanding |
| EN6GNKL3 | resolved | Include | AN_Mitigation_Status, AN_Theory_Reference |
| HJ7BHX8J | resolved | Include | Bias_Ungleichheit, Diversitaet, AN_Bias_Axes |
| JI24FQPV | resolved | Include | Prompting, AN_Prompting_Role |
| Q4LK53XW | agreed | Include | keine (Schadensarten nur in anderer Reihenfolge) |
| UJ7DXK8Y | resolved | Include | Fairness, AN_Bias_Axes, AN_Mitigation_Stage, AN_Gender_Understanding, Identitätsstatus |

## Auflösungen

- 2SNYUZG4, Diversitaet teilweise. Abschnitt 3.2 benennt die ungleiche Sprachrepräsentation generativer Modelle, der Schluss fragt nach Gleichheit und Inklusivität von KI-Lernwerkzeugen. Die Entscheidung bleibt Unclear.
- 9Y7ZFGI5, Feministisch ja. Die erste Forschungsfrage und die Synthese behandeln Gender-Bias als systemisches Problem sozialer Strukturen, ergänzt durch einen Abschnitt zu Intersektionalität.
- 9Y7ZFGI5, AN_Bias_Axes nur Gender, AN_Gender_Understanding nur Binary_Categorical. Das Stadt-Land-Beispiel betrifft Zugang zu Bildung und Technik, nicht KI-Bias, und vergleicht nur Frauen untereinander. Die Intersectional-Regel ist damit nicht erfüllt, Other_Axis entfällt.
- 9Y7ZFGI5, Exclusionary_Norms aufgenommen. Die eigene Synthese stellt fest, dass die Bedürfnisse von Frauen in der Entwicklung nicht berücksichtigt werden und Gesundheitsalgorithmen geschlechtsspezifische Faktoren auslassen. Dazu ist eine zweite Fundstelle ergänzt.
- 9Y7ZFGI5, In_Training gestrichen. Adversarial debiasing steht nur in einer Aufzählung populärer Techniken, die Klarstellung vom 5. September 2026 lässt solche Nennungen keine eigene technische Stufe tragen.
- EN6GNKL3, AN_Mitigation_Status Demonstrated. Das Werk versteht sich als illustrative Fallstudie des durchgeführten Kurses und berichtet keine abgeschlossene Prüfung eines biasbezogenen Ergebnisses.
- EN6GNKL3, AN_Theory_Reference Yes. Die Rahmung generativer KI als soziotechnisches System, das Ungleichheiten und Biases fortschreibt, trägt auch die Bias-Aktivität, deren Befunde ausdrücklich die soziotechnischen Implikationen von Bias reflektieren. Diese Fundstelle ist ergänzt.
- HJ7BHX8J, Bias_Ungleichheit teilweise, Diversitaet nein, AN_Bias_Axes None. Zentral ist die Verantwortung für KI. Die geschlechtlich und rassifiziert verteilte Sorgearbeit ist ein Arbeitsmarktargument aus zitierter Literatur und keine Analyse von KI-Bias entlang dieser Achsen.
- JI24FQPV, Prompting nein, AN_Prompting_Role None. Die ChatGPT-Demonstration im Interview ist ein Verfahrensschritt, dessen Ausgabe die Studie nicht auswertet.
- UJ7DXK8Y, Fairness nein. Das Werk misst Ausrichtungsunterschiede als Design-Bias und rahmt sie an keiner Stelle als algorithmische Fairness.
- UJ7DXK8Y, Nationality_Migration aufgenommen. Tabelle 2 vergleicht nach Land der Herkunft und des Wohnorts, Abschnitt 2 nennt Nationalität als Aspekt der Positionalität, und das Codebuch codiert eine Achse unter dem Namen, den das Werk ihr gibt.
- UJ7DXK8Y, In_Training aufgenommen. Die Empfehlungen verlangen ausdrücklich Modellierungstechniken, die Annotationsdissens abbilden, statt das Modell auf ein Label zu zwingen. Status bleibt Proposed.
- UJ7DXK8Y, Social_Construct gestrichen. Der Satz, Gender sei kulturell zugeschrieben, steht im Hintergrund zur Positionalität, die Analyse folgt selbstberichteten Kategorien. Der Satz steht jetzt in AN_Notes.

## Markierung für Domänenexpert:innen

- 2SNYUZG4, Werk eines Include-Laufs, das beide Tracks quellengestützt nur als Unclear führen, weil die soziale Dimension nachgeordnet bleibt.
- 5ERYSQCK, Unclear hängt allein an Gender teilweise aus einer Regressionsvariable. Mit Gender nein ergäbe sich Exclude.
- EN6GNKL3, Grenze zwischen rahmendem Konzept und Theoriebezug bei der soziotechnischen Rahmung, dazu Demonstrated gegenüber Evaluated für einen ausgewerteten Kurs.
- HJ7BHX8J, ob ein feministisches Argument zur geschlechtlich und rassifiziert verteilten Wartungsarbeit eine Bias-Achse begründet.
- Q4LK53XW, Direct_Discrimination für einen Einstellungsalgorithmus, der aus historischen Erfolgsdaten lernt und den das Werk nicht als unmittelbare oder mittelbare Diskriminierung einordnet. Diese Frage ließ schon der Pilotlauf offen.

## Grenzen

Beide Tracks liefen auf demselben Modell wie diese Review. Übereinstimmung ist eine Prozessdiagnose und keine Reliabilitätsschätzung. Der Review begründet höchstens den internen Status ai-agent-reviewed, keine fachliche Verifikation und keine Publikationsfreigabe.
