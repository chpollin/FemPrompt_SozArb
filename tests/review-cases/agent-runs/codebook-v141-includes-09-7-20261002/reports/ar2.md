# codebook-v141-includes-09-7-20261002, ar2

- Akteur: agent
- Zuweisung: 8WBUGXRR, BBLJ4RG3, DUV4TUG3, JJLSMEQA, JKF6VAQB, PAZJHB8J, VVEEL68I (Reihenfolge des Laufmanifests)
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-09-7-20261002/ar2/ar2-coding.json
- Quellenbasis: zugewiesene Volltexte unter docs/data/fulltext/, SHA-256 aller sieben Dateien gegen das Manifest geprüft und identisch, jede Quelle vollständig gelesen
- Ergebnis: bestanden
- Verteilung: Include 4, Unclear 2, Exclude 1, Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 8WBUGXRR | Fulltext | verified | Include | AI_Literacies, Generative_KI, Prompting, Bias_Ungleichheit (ja); Diversitaet, Fairness (teilweise) | Rahmenwerk aus narrativem Review, Bias als durchgehende Verantwortungsdimension aller fünf Komponenten |
| BBLJ4RG3 | Fulltext | provisional | Unclear | AI_Literacies, KI_Sonstige (ja); Bias_Ungleichheit, Fairness (teilweise) | Kein DOI und kein Jahr im Text. Fairness nur als eines von drei Ethikprinzipien im Kurs und im Survey, keine soziale Kategorie zentral |
| DUV4TUG3 | Fulltext | provisional | Include | Generative_KI, Prompting, Bias_Ungleichheit, Gender, Diversitaet, Fairness (ja) | Korpustitel und Texttitel weichen ab, Inhalt und Gegenstand stimmen überein |
| JJLSMEQA | Fulltext | verified | Unclear | AI_Literacies, Generative_KI (ja); Bias_Ungleichheit (teilweise) | Schulkontext, Bias nur als Befund zum Bewusstsein der Lehrkräfte |
| JKF6VAQB | Fulltext | provisional | Exclude (Not_relevant_topic) | Generative_KI (ja) | Kein DOI im Text. Soziale Dimension vollständig nein, Gender und Ethnizität nur als Kontrollvariablen |
| PAZJHB8J | Fulltext | provisional | Include | AI_Literacies, KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit (ja); Diversitaet, Fairness (teilweise) | DOI-Feld im Text leer; Zitate und Literaturliste passen an mehreren Stellen nicht zusammen |
| VVEEL68I | Fulltext | verified | Include | AI_Literacies, KI_Sonstige, Bias_Ungleichheit, Diversitaet, Fairness (ja); Soziale_Arbeit, Gender (teilweise) | Markdown enthält in Abschnitt 5 verdoppelte und zerlegte Layoutfragmente, die lesbaren Dubletten tragen den vollständigen Inhalt |

## Abweichungen und Blocker

- DUV4TUG3, Identität: Der Korpustitel lautet „Improving diversity of demographic representation in people entities in Large Language Models“, der Text trägt „Improving Diversity of Demographic Representation in Large Language Models via Collective-Critiques and Self-Voting“. Autor:innen, Gegenstand und Methode passen zum Korpustitel, DOI und Jahr fehlen im Text. Nach wörtlicher Lesart der Regel „Titel-Konflikte sperren die Quelle“ wäre der Record zu blockieren. Das Paket kann keinen blockierten Record ausdrücken, daher provisorisch codiert. Benötigt: Bestätigung der Work-Version-Bindung durch den Operator.
- BBLJ4RG3, JJLSMEQA, Entscheidung: Der Lauf ist als Codierung eingeschlossener Werke beschrieben, die Quellenprüfung ergibt für beide Unclear, weil keine Sozialkategorie die ja-Schwelle erreicht. Benötigt: Abgleich mit der früheren Entscheidung durch die AI Agent Review oder die Domain-Expert:innen.
- JKF6VAQB, Entscheidung: Die Quellenprüfung ergibt Exclude (Not_relevant_topic), die soziale Dimension bleibt vollständig nein. Benötigt: dieselbe Klärung wie oben. Das Werk ist im Manifest an die Records JKF6VAQB und ZHQMHHPQ gebunden.
- PAZJHB8J, Quellenqualität: Mehrere Kurzzitate passen nicht zur Literaturliste, etwa „Baker et al., 2021“ für NLP-Dokumentation bei einer Referenz [3] zu KI im Net-Zero-Gebäudedesign und „Dastidar et al., 2019“ neben einem Eintrag „Dastin, J. (2018)“. Der Publikationstyp (Review-Artikel einer Zeitschrift mit Autorenschaft) erfüllt die Publikationstypregel. Benötigt: Qualitätsurteil der Domain-Expert:innen zur Belastbarkeit für die Synthese.
- JKF6VAQB, BBLJ4RG3, PAZJHB8J: fehlender DOI oder fehlendes Jahr im Text, provisorische Identität ohne Konflikt.

## Codierregeln mit Auslegungsbedarf

- Bias_Ungleichheit, 8WBUGXRR: Bias ist nicht der einzige, aber der am stärksten ausgearbeitete Verantwortungsaspekt des Rahmenwerks (Beispielprompting, Chain-of-Thought-Prüfpunkte, Werkzeuge, Benchmarks), daher ja. Gender bleibt nein, weil Geschlecht nur in Attributaufzählungen und einem zitierten Ersetzungsbeispiel vorkommt; AN_Bias_Axes daher None.
- AN_Harm_Types, 8WBUGXRR und PAZJHB8J: Schäden aus zitierten Fällen (Gemini-Vorfall, Sprachbarriere von Chatbots) blieben uncodiert. Bei PAZJHB8J trägt das eigene Argument zu historischen Trainingsdaten und Zugang zu Leistungen Indirect_Discrimination; die Einordnung als mittelbar folgt dem Mechanismus über Daten, das Werk selbst klassifiziert nicht.
- AN_Bias_Axes, PAZJHB8J: Die Achsen stammen aus den Fallbeispielen eines Reviews, die das Werk als eigene Beispiele seines Arguments führt. Bei strenger Lesart der Regel zu Forschungsstand-Passagen fiele die Codierung schmaler aus.
- AN_Gender_Understanding, DUV4TUG3: Die Analyse führt male, female und other aus einem Knowledge Graph, das Werk nennt „other“ selbst keinen geeigneten Platzhalter für Geschlechter jenseits der Binarität. Codiert als Binary_Categorical mit Implicit_Only; Non_Binary_Inclusive verworfen, weil eine Restkategorie keine eigene Analysekategorie ist.
- AN_Gender_Understanding, VVEEL68I: Geschlecht erscheint nur über Trainingsbeispiele zu Rollenstereotypen, ohne eigenes Verständnis, daher Unclear mit Absent.
- AN_Theory_Reference, VVEEL68I: Kritische Perspektiven auf Participatory Design rahmen die Behandlung von AI-Bias-Training (Machtverhältnisse, Ethics-Washing). Grenzfall zwischen rahmender Tradition und methodischem Etikett, als Yes codiert.
- AN_Mitigation_Status, VVEEL68I: Das Training wurde angewendet, berichtet werden nur Reflexionen der Moderation, keine abgeschlossene Prüfung einer Wirkung auf Bias, daher Demonstrated.
- AN_Prompt_Techniques, DUV4TUG3: Die Baselines des eigenen Experiments (Few-Shot, CoT, 0-shot IF) sind als ICL, Thought_Generation und General_Guidance mitcodiert, weil das Werk sie selbst prüft.
- AN_Task, VVEEL68I: Kreditentscheidung, biometrische Identitätsprüfung und Zitationssuche als Other_Task; das Werk beschreibt keinen Einsatz in der Sozialen Arbeit.
- Soziale_Arbeit, VVEEL68I: teilweise über die Zielgruppen (Empfänger:innen sozialer Sicherungsleistungen, Betroffene häuslicher Gewalt), ohne sozialarbeiterische Rahmung.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
