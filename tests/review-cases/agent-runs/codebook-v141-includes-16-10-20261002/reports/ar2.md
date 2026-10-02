# codebook-v141-includes-16-10-20261002 · ar2

- Akteur: agent
- Zuweisung: 4GYXUS9Y, 5G2QTZYD, 6N2E242K, 79TL6HSB, 7G73H3KM, 7IVS7X63, KPSF8EZE, LGYFN6JK, X7ZGW6CN, YTDMY5W4
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-16-10-20261002/ar2/ar2-coding.json
- Quellenbasis: zugewiesene Volltexte unter docs/data/fulltext/, jeweils vollständig gelesen, Codebuch 1.4.1, Promptversion 1.4
- Ergebnis: bestanden
- Verteilung: Include 9 · Unclear 1 · Exclude 0 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 4GYXUS9Y | Fulltext | verified | Include | AI_Literacies (t), Generative_KI, KI_Sonstige (t), Soziale_Arbeit, Bias_Ungleichheit (t) | Kommentar, Schaden nur zitiert |
| 5G2QTZYD | Fulltext | verified | Include | AI_Literacies (t), KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet, Feministisch, Fairness (t) | Datenquellen unbenannt, Tabelle 4 inkonsistent |
| 6N2E242K | Fulltext | verified | Include | AI_Literacies, Generative_KI (t), KI_Sonstige (t), Soziale_Arbeit | Bias kein Gegenstand |
| 79TL6HSB | Fulltext | verified | Include | AI_Literacies, KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit (t) | IRB-Nummer als Platzhalter |
| 7G73H3KM | Fulltext | verified | Include | AI_Literacies, Generative_KI, Prompting (t), Bias_Ungleichheit (t), Diversitaet (t), Feministisch | Gender nein, da nur zitiert oder aufgezählt |
| 7IVS7X63 | Fulltext | provisional | Include | Generative_KI, Prompting (t), Bias_Ungleichheit, Diversitaet (t) | Jahr, Venue und DOI nicht im Text |
| KPSF8EZE | Fulltext | verified | Unclear | AI_Literacies, Generative_KI (t), Prompting (t), KI_Sonstige (t), Bias_Ungleichheit (t), Diversitaet (t) | Sozialdimension nur nachgeordnet |
| LGYFN6JK | Fulltext | verified | Include | AI_Literacies (t), Generative_KI, Prompting (t), Soziale_Arbeit, Bias_Ungleichheit, Diversitaet (t) | |
| X7ZGW6CN | Fulltext | provisional | Include | KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet, Feministisch | Venue, Jahr und DOI nicht im Text |
| YTDMY5W4 | Fulltext | verified | Include | AI_Literacies, Generative_KI, Prompting, Bias_Ungleichheit, Diversitaet | institutionelles Rahmenwerk |

(t) = teilweise, sonst ja.

## Abweichungen und Blocker

- KPSF8EZE · Entscheidung · Das Editorial behandelt Bias, Gerechtigkeit und Diversität nur als nachgeordnete Teilaspekte von AI Literacy, keine Sozialkategorie erreicht ja, daraus folgt Unclear statt Include · Domänenentscheidung, ob die Sozialdimension für den Einschluss trägt
- YTDMY5W4 · Publikationstyp · Rahmenwerk der Open University in Version 0.1 mit benannter Autorschaft und Literaturliste, als belegter Policy-Report zugelassen · Bestätigung der Einordnung als graue Literatur durch die Domänenexpert:innen
- 5G2QTZYD · Quellenqualität · Die Daten der Hiring- und Gesichtserkennungsanalysen sind nicht ausgewiesen, Tabelle 4 nennt 10 von 130 Antworten als 4 Prozent · Prüfung der Belastbarkeit der eigenen Befunde
- 79TL6HSB · Quellenqualität · IRB-Genehmigungsnummer als Platzhalter „XXXXXX“, Prozentwerte aus qualitativer Erhebung · Prüfung der Belastbarkeit
- 7IVS7X63, X7ZGW6CN · Metadaten · Jahr, Venue und DOI fehlen im Text, Titel und Autor:innen stimmen, Status provisional · Metadatenabgleich

Keine Blocker.

## Codierregeln mit Auslegungsbedarf

- AN_Gender_Understanding · 5G2QTZYD · Binary_Categorical zusammen mit Intersectional, da die Regression Geschlecht binär codiert und Tabelle 2 ein kombinationsabhängiges Ergebnis für Schwarze Frauen zeigt. Die Paarung ist im Codebuch weder erlaubt noch ausgeschlossen.
- AN_Harm_Types · 5G2QTZYD · Direct_Discrimination, weil die eigene Regression Geschlecht selbst als Prädiktor des Hiring-Scores ausweist.
- AN_Harm_Types · 7IVS7X63 · Die Bereitschaftsfragen (vermieten, Nachbarschaft, Kinderbetreuung) erfassen Einstellungen, keine Entscheidung über Personen, daher keine Diskriminierungsart, sondern Stereotyping, Exclusionary_Norms und Misrepresentation.
- Feministisch · 7IVS7X63 · Die intersektionale Linse verbindet Nationalität und psychische Erkrankung ohne Macht- oder Geschlechteranalyse, daher nein.
- AN_Harm_Types · 7G73H3KM, YTDMY5W4 · Der Bias ist epistemisch (Mainstream-Ökonomie) beziehungsweise als Prämisse behauptet, ohne für eine soziale Gruppe einen Mechanismus zu entwickeln, daher None.
- AN_Bias_Axes · LGYFN6JK · Race_Ethnicity und Language_Culture aus dem eigenen Argument zu „white-centric“, „mainstream white English“ und Global South, die übrigen Achsen stehen nur in einer Aufzählung.
- AN_Gender_Definition · X7ZGW6CN · Explicit, da das Werk die queertheoretische Bestimmung übernimmt, dass „female“ keine klar definierte natürliche Kategorie ist, analog zum Anker GP4JDSI8.
- AN_Mitigation_Stage · 7G73H3KM · Die kritische Zitieraufgabe ist als Bildungsmaßnahme gegen Bias Organisational_Process zugeordnet.
- AN_Task · 79TL6HSB · „case progress tracking, documentation“ ist fallbezogen und daher Documentation_Recording, nicht Administration.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
