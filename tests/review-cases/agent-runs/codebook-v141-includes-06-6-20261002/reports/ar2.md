# codebook-v141-includes-06-6-20261002, ar2

- Akteur: agent
- Zuweisung: 6IU5JG5Y, GP4JDSI8, UENFDPH9, UFE85SCV, UFJ7ERFF, YLAKP7Z2 (Reihenfolge laut Laufmanifest)
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-06-6-20261002/ar2/ar2-coding.json
- Quellenbasis: zugewiesene Volltexte unter docs/data/fulltext/, SHA-256 aller sechs Dateien vor der Codierung gegen das Laufmanifest geprüft und übereinstimmend, jeweils vollständig gelesen (Literaturverzeichnisse durchgesehen)
- Ergebnis: bestanden
- Verteilung: Include 5, Unclear 1, Exclude 0, Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 6IU5JG5Y | Fulltext | verified | Include | KI_Sonstige ja, Bias_Ungleichheit ja, Diversitaet ja, Feministisch ja, Fairness ja, AI_Literacies teilweise, Soziale_Arbeit teilweise, Gender teilweise | Thematische Literaturanalyse mit Workshop-Evaluation, Empfehlungen für AI-Expert:innen |
| GP4JDSI8 | Fulltext | verified | Include | KI_Sonstige ja, Bias_Ungleichheit ja, Gender ja, Diversitaet ja, Feministisch ja, AI_Literacies teilweise, Generative_KI teilweise | Quelle bytegleich mit UFJ7ERFF |
| UENFDPH9 | Fulltext | provisional | Include | KI_Sonstige ja, Soziale_Arbeit ja, AI_Literacies teilweise, Bias_Ungleichheit teilweise, Diversitaet teilweise | Keine DOI im Text |
| UFE85SCV | Fulltext | verified | Unclear | AI_Literacies ja, KI_Sonstige teilweise, Bias_Ungleichheit teilweise, Gender teilweise, Diversitaet teilweise | Soziale Dimension erreicht nur teilweise |
| UFJ7ERFF | Fulltext | provisional | Include | wie GP4JDSI8 | Versionstyp preprint laut Manifest, Text ist die ACM-Fassung, bytegleich mit GP4JDSI8 |
| YLAKP7Z2 | Fulltext | provisional | Include | Generative_KI ja, Prompting ja, Bias_Ungleichheit ja, Gender ja, Diversitaet ja, Feministisch ja, AI_Literacies teilweise | Keine DOI im Text |

## Abweichungen und Blocker

- UFJ7ERFF, Identität und Version: Die zugewiesene Datei hat denselben SHA-256 wie die Quelle von GP4JDSI8 (andere work_id) und zeigt die publizierte ACM-FAccT-Fassung mit DOI 10.1145/3630106.3658543, während das Manifest den Versionstyp preprint führt. Klärung durch den Operator, ob zwei Works zusammenzuführen sind und welcher Versionstyp gilt. Die Codierung ist mit GP4JDSI8 identisch, weil der Text identisch ist.
- UENFDPH9 und YLAKP7Z2, Identität: Der Text nennt Titel, Autor:innen und Jahr, aber keine DOI und keinen Zeitschriftentitel des Artikels selbst. Keine Konflikte, daher vorläufig codiert. Abgleich der DOI gegen die Korpusmetadaten wird benötigt.
- UFE85SCV, Entscheidung: Die Ableitung ergibt Unclear, obwohl der Lauf als Include-Batch angelegt ist. Gender diversity ist eine von sechs Ergebniskategorien der Review mit einem kurzen Abschnitt und einem Diskussionssatz, sozioökonomische Ungleichheit erscheint nur als Desiderat. Keine Sozialkategorie erreicht damit einen zentralen Beitrag. Entscheidung durch Domain-Expert:innen.

## Codierregeln mit Auslegungsbedarf

- AN_Harm_Types, 6IU5JG5Y: Die Wohlfahrtsfälle (Niederlande, Frankreich), Gender Shades und COMPAS sind zitierte Fälle. Das eigene Argument betrifft den verengten algorithmischen Rahmen von AI Fairness und begründet keinen Schadensmechanismus, daher None.
- AN_Harm_Types, UENFDPH9: Erasure aus dem Syntheseabschnitt „Data and Algorithmic Injustice“ der Review (Unterrepräsentation macht Gruppen unsichtbar). Der Abschnitt mischt zitierte Folgen, eine Abbildung auf die Gallegos-Typen ist nur teilweise eindeutig.
- AN_Bias_Axes, UENFDPH9: indigene Menschen, junge Menschen und Arme stehen nur in einer Aufzählung aus zitierten Studien, daher None.
- AN_Bias_Axes, GP4JDSI8 und UFJ7ERFF: Other_Axis für die koloniale Position Global North und Global South (Principle 7, 5.1), nicht als Nationality_Migration gelesen, weil das Werk Arbeits- und Umwelthierarchien zwischen Weltregionen, nicht Staatsangehörigkeit oder Migration analysiert.
- AN_Bias_Definition, 6IU5JG5Y: Explicit über die ausdrücklich übernommene Bestimmung von (in)justice nach Young. Ungerechtigkeit wird als Unfairness gelesen. Bei engerer Lesart wäre Implicit_Only zu vergeben.
- AN_Gender_Definition, YLAKP7Z2: Explicit über Fußnote 2, die die binäre Geschlechternorm bestimmt und die Begriffe der Analyse festlegt. Bei engerer Lesart wäre Implicit_Only zu vergeben.
- AN_Gender_Understanding, 6IU5JG5Y: Social_Construct nicht vergeben, weil das Werk nur race ausdrücklich als sozial konstruiert bestimmt, nicht gender.
- AN_Harm_Types, YLAKP7Z2: Die ungenaue Darstellung von Gerichten wie Fufu betrifft kulturelle Gegenstände, nicht die Systemqualität zwischen sozialen Gruppen, daher kein Disparate_Performance.
- Studientyp, GP4JDSI8 und UFJ7ERFF: Konzept, weil die Prinzipien ein Rahmenwerk bilden. Das Werk nennt sich selbst „literature review and theory contribution“.
- Soziale_Arbeit, 6IU5JG5Y: teilweise über die Sozialleistungsfälle der Einleitung als Motivation. Kein Einfluss auf die Entscheidung.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
