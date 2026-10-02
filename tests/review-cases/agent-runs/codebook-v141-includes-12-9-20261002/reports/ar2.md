# codebook-v141-includes-12-9-20261002 · ar2

- Akteur: agent
- Zuweisung: C325Y32P, CYZQ6XPK, KRUQB7L2, LT3D3ZQ2, LXKXPD5H, MTMU9UPJ, N7J2ZRFP, V4GTLMED, VP6SXQHY in der Reihenfolge von assignment.papers
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-12-9-20261002/ar2/ar2-coding.json
- Quellenbasis: zugewiesene Volltexte unter docs/data/fulltext/ mit den Manifest-Hashes, jeder Text vollständig gelesen, Codebuch 1.4.1, Prompt 1.4
- Ergebnis: bestanden
- Verteilung: Include 5 · Unclear 3 · Exclude 1 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| C325Y32P | Fulltext | verified | Unclear | KI_Sonstige ja, AI_Literacies, Generative_KI, Soziale_Arbeit, Bias_Ungleichheit, Diversitaet, Fairness teilweise | Policy-Report von Schwab Foundation und World Economic Forum, Bias und Zielgruppen nur als nachgeordnete Teilaspekte des Adoptionsrahmens |
| CYZQ6XPK | Fulltext | verified | Include | Generative_KI, Prompting, Bias_Ungleichheit, Gender, Fairness ja | Preprint ohne DOI im Text, CoT als evaluierte Debiasing-Strategie |
| KRUQB7L2 | Fulltext | verified | Exclude (Not_relevant_topic) | Generative_KI, Prompting ja, AI_Literacies teilweise | keine soziale Kategorie, Bias nur als Längen- und Präferenzbias ohne sozialen Bezug |
| LT3D3ZQ2 | Fulltext | verified | Include | KI_Sonstige, Feministisch ja, Bias_Ungleichheit, Gender, Diversitaet teilweise | Forschungsagenda feministische Metaethik, Manifest nennt preprint, Text trägt ACM-Referenz |
| LXKXPD5H | Fulltext | provisional | Include | KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit ja, AI_Literacies, Generative_KI, Diversitaet, Fairness teilweise | Tagungsunterlage OGSA 2025 ohne Autorennamen und ohne DOI im Text |
| MTMU9UPJ | Fulltext | verified | Include | Generative_KI, Prompting, Bias_Ungleichheit, Gender, Fairness ja | Preprint ohne DOI im Text, DR.GAP als evaluierte Prompting-Maßnahme |
| N7J2ZRFP | Fulltext | verified | Unclear | KI_Sonstige ja, Bias_Ungleichheit teilweise | Bias und Diskriminierung nur in einem referierenden Abschnitt eines IR-Agendaartikels |
| V4GTLMED | Fulltext | verified | Include | KI_Sonstige, Bias_Ungleichheit, Diversitaet, Feministisch ja, AI_Literacies, Gender, Fairness teilweise | Interviewstudie mit feministischer Methodik |
| VP6SXQHY | Fulltext | verified | Unclear | AI_Literacies ja, Generative_KI, Prompting, KI_Sonstige, Bias_Ungleichheit teilweise | Journal Pre-proof, Manifest nennt version_of_record, Bias nur als Teil der ethischen AI Literacy |

## Abweichungen und Blocker

- LXKXPD5H · Identität und Publikationstyp · Der Text nennt weder Autor:in noch DOI, nur Titel und Tagung (OGSA-Tagung 25. März 2025 Graz). Ich lese die Unterlage als Konferenzbeitrag einer fachwissenschaftlichen Gesellschaft der Sozialen Arbeit mit Literaturliste und codiere vorläufig. · Klärung der Autorenschaft aus den Korpusmetadaten und Bestätigung, dass die Tagungsunterlage unter die Publikationstypregel fällt.
- LT3D3ZQ2 · Versionstyp · Das Manifest führt die Version als preprint, der Text trägt ACM-Rechteblock und Referenzformat der AIES'22. Titel und DOI stimmen, kein Sperrgrund. · keine.
- VP6SXQHY · Versionstyp · Das Manifest führt version_of_record, der Text ist das Journal Pre-proof mit leerem DOI-Feld. Titel und Autoren stimmen, kein Sperrgrund. · keine.
- Keine Blocker.

## Codierregeln mit Auslegungsbedarf

- AN_Bias_Axes und AN_Gender_Understanding · LT3D3ZQ2 · Die Arbeit schlägt eine intersektionale Untersuchung vor, nach der Privileg und Benachteiligung vom Zusammenwirken von Gender mit Klasse, Race, Disability und Sexualität abhängen. Ich habe diese argumentative Abhängigkeit als Intersectional gewertet, obwohl kein empirisches Ergebnis vorliegt. Eine strengere Lesart ergäbe AN_Bias_Axes Gender und AN_Gender_Understanding Unclear mit AN_Gender_Definition Absent.
- AN_Harm_Types · LT3D3ZQ2 · Die Schäden, die das Werk selbst argumentiert, betreffen den AI-Ethik-Diskurs (Ethics-Washing und verwandte Effekte) und liegen außerhalb der Taxonomie. Die genannten KI-Fälle sind illustrative Fallstudien, daher None.
- AN_Bias_Definition · CYZQ6XPK, MTMU9UPJ · Beide Arbeiten bestimmen Bias ausschließlich technisch über ihre Bias-Scores. Ich habe das als ausdrückliche technische Bestimmung im Sinne der Feldnote gewertet (Explicit). Der Anker zu CYZQ6XPK betrifft nur Gender_Definition und Theory_Reference.
- AN_Harm_Types · LXKXPD5H · Direct_Discrimination stützt sich auf Fallbeispiele, in denen Herkunft oder Migrationshintergrund selbst in Score oder Risikobewertung eingeht, Indirect_Discrimination auf den Stadtteil als Proxy. Die Beispiele sind hypothetische Fallvignetten des Werks, keine Messung.
- AN_Bias_Axes · LXKXPD5H · Other_Axis steht für den Wohnort (Stadtteil). Frauen, Behinderung und Sprache erscheinen nur in Aufzählungen betroffener Gruppen und sind nicht codiert.
- AN_Task · LXKXPD5H · Teaching_Further_Education beruht auf dem ChatGPT-gestützten Avatar Konrad, den die Autorin oder der Autor für Workshops und Erklärvideos einsetzt.
- AN_Harm_Types · MTMU9UPJ · Exclusionary_Norms beruht auf dem eigenen Befund im Anhang B, dass VLMs bei unklarer Bildinformation auf männliche Pronomen zurückfallen. Disparate_Performance beruht auf der Genauigkeitsdifferenz zwischen maskulinen und femininen Pronomen.
- AN_Gender_Definition · V4GTLMED · Die Bestimmung von Gender und Race als Set von Relationen statt persönlicher Merkmale gilt als ausdrückliche eigene Bestimmung und trägt zugleich Social_Construct.
- Soziale_Arbeit · C325Y32P · Social Innovators arbeiten mit vulnerablen und marginalisierten Gruppen, Sozialarbeit wird nicht benannt. Ich habe den Zielgruppenbezug als teilweise gewertet, was das Werk bei Unclear hält.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
