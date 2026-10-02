# codebook-v141-includes-07-7-20261002, AI Agent Review

- Akteur: agent, Reviewer ai-agent-review
- Prompt: prompts/prism-ai-agent-review-v0.4.md, Codebuch 1.4.1, Reviewer-Prompt der Tracks 1.4
- Eingaben: tracks/ar1-coding.json und tracks/ar2-coding.json (Hashes laut Manifest), PRISM-Tracks tracks/ar1.json und tracks/ar2.json, Berichte reports/ar1.md und reports/ar2.md
- Quellenbasis: alle sieben zugewiesenen Volltexte unter docs/data/fulltext/ vollständig gelesen, SHA-256 aller Quellen gegen das Manifest geprüft und übereinstimmend
- Artefakt: ai-agent-review.json
- Validator: `PASS AI-agent review: 7 records`
- Ergebnis: 2 agreed, 5 resolved, 0 blocked
- Entscheidungen: Include 3, Unclear 4, Exclude 0

## Records

| Paper-ID | Ergebnis | ar1 | ar2 | Final | Aufgelöste Felder |
|---|---|---|---|---|---|
| 6JAZXKEB | resolved | Unclear | Unclear | Unclear | KI_Sonstige, Diversitaet |
| 9MDIBETZ | resolved | Include | Include | Include | AN_Bias_Axes |
| GPSB87RN | resolved | Include | Include | Include | Diversitaet, AN_Population, AN_Task, AN_Gender_Understanding |
| JMAWNUEV | agreed | Unclear | Unclear | Unclear | keine |
| MQJEES7J | agreed | Unclear | Unclear | Unclear | keine |
| T9KEZN3G | resolved | Unclear | Include | Unclear | Bias_Ungleichheit, Fairness, Entscheidung, Analyse |
| ZNHUCA4B | resolved | Include | Include | Include | Identitätsstatus, Soziale_Arbeit, AN_Bias_Axes, AN_Task |

## Auflösungen

- T9KEZN3G, Bias_Ungleichheit teilweise, Entscheidung Unclear. Bias-Verstärkung ist eine von elf Governance-Herausforderungen und eines von acht Handlungsfeldern, Digital Divide und Einkommensungleichheit stehen je in einem Satz, das Machtungleichgewicht betrifft die Marktmacht von Big Tech. Bias bleibt damit ein expliziter, nachgeordneter Teilaspekt des Einleitungsartikels. Die Analysefelder von ar2 entfallen. Ihre Disparate_Performance-Stelle wäre zudem eine zitierte Fremdaussage gewesen.
- T9KEZN3G, Fairness teilweise. Repräsentative Datensätze und Verfahren zur Erkennung und Behebung von Bias werden als Empfehlung genannt.
- ZNHUCA4B, AN_Bias_Axes Gender und Language_Culture. Ziffer 95 entwickelt die Wirkung von NLP auf gefährdete Sprachen und Dialekte als eigenes Argument und trägt dieselbe Erasure, die beide Tracks codieren. Armutslücke, Stadt-Land-Gefälle und Ländergruppen betreffen Zugang und digitale Spaltung, nicht Bias entlang einer Achse.
- ZNHUCA4B, AN_Task None. Sektorale Nennungen bleiben allgemeine Governance-Empfehlungen ohne bestimmte berufliche Aufgabe.
- ZNHUCA4B, Soziale_Arbeit nein. welfare steht nur in einer Aufzählung menschenrechtssensibler Einsatzbereiche, entscheidungsneutral.
- ZNHUCA4B, Identitätsstatus provisional. Die Paper-Ebene nennt weder DOI noch ISBN noch Dokumentsymbol.
- 9MDIBETZ, AN_Bias_Axes Gender. Das Werk bestimmt Gender Bias über die Geschlechtsidentität und führt nicht-binäre Identitäten als dritte Gruppe derselben Achse. Die Inklusion ist über AN_Gender_Understanding Non_Binary_Inclusive erfasst.
- GPSB87RN, Diversitaet ja. Inklusion marginalisierter Gruppen, diverse Teams und Umverteilung von Macht sind Kernziele des Rahmens.
- GPSB87RN, AN_Population Not_SW_Specific. Gesundheit ist nur das Feld des MIRA-Beispiels.
- GPSB87RN, AN_Task Other_Task. MIRA ist eine beschriebene KI-Diagnoseplattform, also eine Aufgabe außerhalb der Sozialen Arbeit.
- GPSB87RN, AN_Gender_Understanding Social_Construct. Nicht-binäre Personen erscheinen in einem Prüfkriterium, nicht als Kategorie einer Analyse, daher kein Non_Binary_Inclusive.
- 6JAZXKEB, KI_Sonstige ja. Maschinelles Lernen, Bilderkennung und Robotik sind der Lerninhalt des Programms.
- 6JAZXKEB, Diversitaet nein. Der einzige Beleg ist ein Satz in einem zitierten Lehrbeispiel zum Bias-Argument.

## Quellenprüfung

- Alle Kategorie- und Analysebelege beider Pakete wurden gegen die Quellen geprüft. Einzige nicht zusammenhängende Stelle ist das ar2-Zitat zu Disparate_Performance in T9KEZN3G, das über einen Absatzumbruch der Konvertierung läuft und eine zitierte Fremdaussage wiedergibt. Es entfällt mit der Entscheidung Unclear.
- Der finale Record übernimmt bei positiven Kategorien die Vereinigung der zeichengetreuen Belege beider Tracks. Für GPSB87RN kommen ein Diversitaet-Beleg und ein AN_Task-Beleg aus der Quelle hinzu.
- Die PRISM-Tracks entsprechen in ihren Hashes dem Manifest und tragen die Paketwerte.

## Markierung für Domänenexpert:innen

- T9KEZN3G: Die Gewichtung von Bias_Ungleichheit entscheidet zwischen Include und Unclear, die Tracks teilten sich, die Review wählt Unclear.
- ZNHUCA4B: Publikationstyp. Eine UNESCO-Empfehlung ist als normsetzendes Policy-Dokument zugelassen, beide Tracks nannten die engere Lesart als möglichen Blocker.
- 9MDIBETZ: Das Codebuch regelt die Abgrenzung von Gender und Sexual_Orientation_Identity für transgender und nicht-binäre Gruppen nicht ausdrücklich.
- GPSB87RN: Grenzfälle bei Non_Binary_Inclusive (Prüfkriterium ohne Analysekategorie) und bei AN_Task Other_Task aus einem Praxisbeispiel.

## Hinweise zum Lauf

- JMAWNUEV, MQJEES7J, 6JAZXKEB und T9KEZN3G enden in einem Lauf über Includes als Unclear, weil Bias, Fairness und Diversität am Volltext nur nachgeordnet behandelt werden. Ob die frühere Einschlussentscheidung auf einer anderen Gewichtung beruht, ist eine Frage für die Domänenexpert:innen.
- AN_Task ist Pilotfeld. Die Unterschiede in GPSB87RN und ZNHUCA4B betreffen die Grenze zwischen einem beschriebenen Praxisbeispiel und allgemeinen Sektornennungen in Governance-Texten.
- Die Übereinstimmung der Tracks ist eine Prozessdiagnose ohne Aussage über Reliabilität, beide Tracks liefen auf demselben Modell.
