# codebook-v141-includes-09-7-20261002, AI Agent Review

- Akteur: agent (ai-agent-review)
- Prompt: prompts/prism-ai-agent-review-v0.4.md, Codebuch 1.4.1, Reviewer-Prompt der Tracks prism-agent-reviewer-v1.4.md
- Eingaben: tracks/ar1-coding.json und tracks/ar2-coding.json, beide gegen den Coding-Paket-Validator erneut bestanden, sowie die sieben zugewiesenen Volltexte unter docs/data/fulltext/, Hashes gegen das Manifest geprüft und vollständig gelesen
- Artefakt: ai-agent-review.json
- Validator: PASS AI-agent review: 7 records
- Ergebnis: agreed 0, resolved 7, blocked 0
- Entscheidungen: Include 4, Unclear 2, Exclude 1

Alle Belegstellen beider Tracks und alle Fundstellen in `analysis_evidence` stehen zeichengetreu in der jeweiligen Quelle. Beide Tracks stimmen in allen Entscheidungen überein. Jeder Record enthält mindestens einen dokumentierten Unterschied, bei BBLJ4RG3 und JKF6VAQB betrifft er nur den Identitätsstatus.

## Records

| Paper-ID | Identität | Entscheidung | aufgelöste Unterschiede |
|---|---|---|---|
| 8WBUGXRR | verified | Include | AI_Literacies ja, AN_Prompting_Role mit Learning_Content |
| BBLJ4RG3 | provisional | Unclear | Identitätsstatus provisional |
| DUV4TUG3 | provisional | Include | AN_Gender_Understanding Binary_Categorical, AN_Harm_Types mit Exclusionary_Norms |
| JJLSMEQA | verified | Unclear | Prompting nein |
| JKF6VAQB | provisional | Exclude (Not_relevant_topic) | Identitätsstatus provisional |
| PAZJHB8J | verified | Include | Identitätsstatus verified, AN_Bias_Axes nur Race_Ethnicity, AN_Task mit Teaching_Further_Education |
| VVEEL68I | verified | Include | AN_Bias_Axes ohne Race_Ethnicity |

## Auflösungen

- 8WBUGXRR, AI_Literacies `ja`. Das Rahmenwerk zielt ausdrücklich auf kritische Bewusstheit der Nutzenden, verlangt Literacy zu generativer KI und ihren gesellschaftlichen Folgen und bestimmt verantwortliches Prompt Engineering im Schluss als Kernbestandteil von AI Literacy. Daraus folgt auch `Learning_Content` in AN_Prompting_Role, da das Werk die Aufnahme in Curricula und Trainingsprogramme benennt.
- BBLJ4RG3 und JKF6VAQB, Identitätsstatus `provisional`. Beiden Texten fehlen DOI und eine stabile Quellenkennung, BBLJ4RG3 zusätzlich das Jahr. Die Reviewer-Regel lässt bei solchen Metadatenlücken nur eine vorläufige Codierung zu. Die Bandangabe, die ar1 für BBLJ4RG3 aus einem Zitat in JJLSMEQA übernahm, stammt nicht aus der zugewiesenen Quelle.
- DUV4TUG3, AN_Gender_Understanding `Binary_Categorical`. Die Analyse arbeitet mit den Knowledge-Graph-Labels male, female und other, und das Werk erklärt selbst, „other“ sei kein geeigneter Platzhalter für Geschlechter jenseits der Binarität. Nach der Regel für `Non_Binary_Inclusive` genügt eine solche Restkategorie nicht.
- DUV4TUG3, AN_Harm_Types `Erasure` und `Exclusionary_Norms`. Die eigene Baseline-Ausgabe liefert bei unterbestimmtem Prompt „only white male CEOs“, und das Werk führt dies auf implizite Annahmen des Modells zurück. Das ist ein dominanter Standard im Sinn der Feldregel und steht im eigenen Argument, nicht im Forschungsstand.
- JJLSMEQA, Prompting `nein`. Prompting erscheint nur in referierten Aussagen (UNESCO, HKEDB), in einer Tabellenzeile und in einem Teilnehmendenzitat. Keine Forschungsfrage und kein Ergebnis entwickelt es. Die Entscheidung Unclear bleibt unberührt.
- PAZJHB8J, Identitätsstatus `verified`. Zeitschrift, Jahrgang, Heft und Seiten identifizieren den Artikel trotz leerem DOI-Feld.
- PAZJHB8J, AN_Bias_Axes nur `Race_Ethnicity`. Nur diese Achse entwickelt der Review im eigenen Argument von Abschnitt 4.1. Die Fälle zu Wohngutscheinen und englischsprachigen Chatbots in 4.1.1 sind einzelne Sätze einer Liste zitierter Fälle, eine ihrer Quellen fehlt im Literaturverzeichnis.
- PAZJHB8J, AN_Task mit `Teaching_Further_Education`. Abschnitt 5 behandelt KI-Werkzeuge in Ausbildung und Weiterbildung der Sozialen Arbeit, die Abschnitte 5.3.3 und 6.1.1 beschreiben KI-gestütztes personalisiertes Lernen und NLP-Werkzeuge in Trainingskontexten.
- VVEEL68I, AN_Bias_Axes ohne `Race_Ethnicity`. Rassifizierung erscheint nur als Klammerbeispiel zu Postleitzahlen als Proxy und in einer einzelnen berichteten Teilnehmendeneinschätzung. Gender, Religion und Physical_Appearance sind dagegen als eigene Beispiele und als Rangaufgabe ausgeführt.

## Werke für eine fachliche Entscheidung durch Domänenexpert:innen

- DUV4TUG3: Titelvariante zwischen Korpus und Text, die Work-Version-Bindung braucht eine Bestätigung. Dazu kommt der Grenzfall Binary_Categorical gegenüber Non_Binary_Inclusive bei einer Restkategorie „other“.
- PAZJHB8J: Mehrere Kurzzitate passen nicht zum Literaturverzeichnis, was die Belastbarkeit der zitierten Fallbeispiele für die Synthese einschränkt. Die Abgrenzung der Achsen aus zitierten Fällen eines Reviews ist ebenfalls ein Grenzfall.
- VVEEL68I: Indirect_Discrimination beruht auf demselben Klammerbeispiel, das für die Achse Race_Ethnicity nicht genügt. AN_Theory_Reference Yes über kritisches Participatory Design steht an der Grenze zwischen rahmender Tradition und methodischem Etikett.
- BBLJ4RG3, JJLSMEQA, JKF6VAQB: Der Lauf codiert eingeschlossene Werke, die Quellenprüfung beider Tracks und der Review ergibt aber Unclear oder Exclude. Der Abgleich mit der früheren Entscheidung steht den Domänenexpert:innen zu.

## Grenzen

Beide Tracks liefen auf demselben Modell wie dieser Review. Die Übereinstimmung der Tracks ist eine Prozessdiagnose und keine Reliabilitätsschätzung. Der Review begründet höchstens den internen Status `ai-agent-reviewed` und ersetzt weder die fachliche Verifikation an der Stichprobe noch eine Publikationsfreigabe. Bei VVEEL68I sind Abschnitte 4.3 bis 5.3 in der Konvertierung verdoppelt und zerstückelt, alle Belege stammen aus zusammenhängenden Passagen.
