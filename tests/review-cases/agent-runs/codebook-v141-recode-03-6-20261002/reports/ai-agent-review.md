# codebook-v141-recode-03-6-20261002, AI Agent Review

- Akteur: agent, Reviewer ai-agent-review, Prompt `prompts/prism-ai-agent-review-v0.4.md` (Version 0.4)
- Codebuch: `assessment/categories.yaml` Version 1.4.1, Reviewer-Prompt der Tracks 1.4
- Eingaben: `tracks/ar1-coding.json` und `tracks/ar2-coding.json`, PRISM-Tracks `tracks/ar1.json` und `tracks/ar2.json`, Berichte `reports/ar1.md` und `reports/ar2.md`, sechs Volltexte unter `docs/data/fulltext/`, alle SHA-256-Werte gegen das Manifest geprüft und übereinstimmend
- Lauf: Neukodierung nach ADR-046, die frühere Kodierung wurde nicht geöffnet
- Ergebnis: Validator bestanden (`PASS AI-agent review: 6 records`)
- Verteilung: agreed 0, resolved 6, blocked 0, Entscheidungen Include 6, Unclear 0, Exclude 0

## Prüfumfang

Jeder Volltext wurde vollständig gelesen. Alle Kategorienbelege und alle Fundstellen in `analysis_evidence` beider Tracks stehen zeichengetreu und zusammenhängend in der zugewiesenen Quelle. Kein Track zeigt einen Identitäts-, Quellen- oder Methodenkonflikt, der eine Sperre verlangt. Jeder Record weist mindestens einen Unterschied auf, daher ist kein Record `agreed`.

## Records

| Paper-ID | Identität | Entscheidung | aufgelöste Unterschiede | gewählte Basis |
|---|---|---|---|---|
| 2EBHMYU4 | verified | Include | Fairness nein | ar1 |
| 4ZL5Q48E | verified | Include | Bias_Ungleichheit ja, damit Include und Analyse | ar2, ergänzt um einen Beleg von ar1 |
| 7FBB2KUC | provisional | Include | Identitätsstatus, Diversitaet nein, AN_Bias_Definition Implicit_Only, AN_Population ohne Mental_Health | ar1 |
| A2P8MXMY | verified | Include | AN_Bias_Axes ohne Other_Axis | ar2 |
| AHUSFEEA | provisional | Include | AI_Literacies ja, AN_Task None | ar2, Notiz zu AN_Task ergänzt |
| INQNDHTI | verified | Include | Fairness ja, AN_Bias_Axes ohne Disability, AN_Harm_Types ohne Direct_Discrimination | ar2 |

## Auflösungen

- 2EBHMYU4, Fairness: Der Artikel nennt nur im Vorbeigehen die Forderung der Reports, über technisches Debiasing hinauszugehen. Algorithmische Fairness behandelt er nicht, daher nein.
- 4ZL5Q48E, Bias_Ungleichheit: Die strukturelle Benachteiligung der Beschäftigten gegenüber dem Management durch algorithmische Steuerung ist der erste Hauptbefund des Artikels und erfüllt die Codebuchdefinition (soziale Ungleichheit, strukturelle Benachteiligung im KI-Kontext), daher ja und Include. Die Analyse von ar2 ist quellenkonform.
- 7FBB2KUC, Identität: Zeitschrift und DOI fehlen im Text, daher provisional nach der Metadatenregel des Reviewer-Prompts.
- 7FBB2KUC, Diversitaet: Der einzige Beleg betrifft den Zugang weniger digital affiner Hilfesuchender und ist unter Bias_Ungleichheit erfasst, daher nein.
- 7FBB2KUC, AN_Bias_Definition: Die Diskussion lässt Bias als Reproduktion vorhandener Kontexte erkennen, daher Implicit_Only.
- 7FBB2KUC, AN_Population: Woebot ist ein Beispiel im Beratungsabschnitt, psychische Gesundheit ist kein adressiertes Handlungsfeld.
- A2P8MXMY, AN_Bias_Axes: Der Behördenstandort steht für Willkür und Entscheidungsvariabilität, nicht für eine soziale Benachteiligungsachse, daher kein Other_Axis.
- AHUSFEEA, AI_Literacies: Bewusstseinsbildung und AI Literacy sind erklärtes Hauptziel des Kits und Bestandteil jeder Zielgruppenstrategie, daher ja.
- AHUSFEEA, AN_Task: Die Einsatzfelder erscheinen nur als Bias-Fallbeispiele, das Kit schlägt keinen KI-Einsatz für eine Aufgabe vor, daher None wie bei 2EBHMYU4.
- INQNDHTI, Fairness: Fairness ist eigenes Unterthema des häufigsten Hauptthemas mit Strategien zur fairen Systemgestaltung, daher ja.
- INQNDHTI, AN_Bias_Axes: Die Synthese unterscheidet Gender und Ethnizität als Fairnessfaktoren, Behinderung steht nur in einem Aufzählungssatz, daher ohne Disability.
- INQNDHTI, AN_Harm_Types: Direct_Discrimination beruhte auf einem einzeln zitierten historischen Fall, die Synthese klassifiziert nur indirekte Diskriminierung.

## Markierung für Domänenexpert:innen

- 4ZL5Q48E: Ob die Machtasymmetrie zwischen Beschäftigten und Management als soziale Ungleichheit im Sinn von Bias_Ungleichheit zählt, entscheidet über Include und die gesamte Analysecodierung. Die Tracks lagen hier auseinander.
- AHUSFEEA: Der Publikationstyp eines Projekttoolkits ohne Einzelautorschaft mit Marketinganteilen, widersprüchlicher Zielgruppenangabe und doppelt geführtem Fall bleibt ein Grenzfall der Publikationstypregel. Achsen und Schadensarten stützen sich auf die eigene Analyse von Fällen aus Presse- und NGO-Quellen.

## Grenzfälle ohne Markierung

- 2EBHMYU4, AN_Gender_Definition Explicit: Der Artikel bestimmt Gender über eigene Sätze zur sozial konstruierten, nicht mehr binär verstandenen Kategorie, ohne Definitionssatz. Beide Tracks codieren übereinstimmend.
- 7FBB2KUC und 4ZL5Q48E, AN_Theory_Reference Yes: Staub-Bernasconis Menschenrechtsprofession beziehungsweise die soziotechnische Perspektive rahmen Bias ausdrücklich, die Grenze zwischen rahmendem Konzept und Erwähnung bleibt nach Protokoll offen.
- INQNDHTI: Deckblatt und Artikel nennen abweichende Seitenzahlen und Publikationsdaten, Titel und DOI stimmen.

## Autoritätsgrenze

Die Übereinstimmung der beiden Tracks ist eine Prozessdiagnose und keine Reliabilitätsschätzung, beide Tracks liefen auf demselben Modell. Der Review begründet höchstens den internen Status `ai-agent-reviewed`, die fachliche Verifikation durch Domänenexpert:innen und eine personengebundene Publikationsfreigabe folgen als eigene Schritte.
