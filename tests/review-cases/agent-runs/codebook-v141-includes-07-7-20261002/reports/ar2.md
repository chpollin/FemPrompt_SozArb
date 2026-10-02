# codebook-v141-includes-07-7-20261002 · ar2

- Akteur: agent
- Zuweisung: 6JAZXKEB, 9MDIBETZ, GPSB87RN, JMAWNUEV, MQJEES7J, T9KEZN3G, ZNHUCA4B (Reihenfolge laut assignment.papers)
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-07-7-20261002/ar2/ar2-coding.json
- Quellenbasis: zugewiesene Volltexte unter docs/data/fulltext/, jeweils vollständig gelesen, alle SHA-256-Werte stimmen mit dem Laufmanifest überein; Regelquellen assessment/categories.yaml 1.4.1 (Hash laut Manifest) und knowledge/update-protocol.md, Abschnitte Eligibility, Text preparation and source gate, Agent-assisted completion, Analysis coding
- Ergebnis: bestanden
- Verteilung: Include 4 · Unclear 3 · Exclude 0 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 6JAZXKEB | Fulltext | provisional | Unclear | AI_Literacies ja, KI_Sonstige ja, Generative_KI teilweise, Bias_Ungleichheit teilweise, Diversitaet teilweise, Fairness teilweise | DOI und Jahr fehlen im Text; Datenbias ist nachgeordneter Teil der AI-Ethics-Dimension |
| 9MDIBETZ | Fulltext | verified | Include | Generative_KI ja, Bias_Ungleichheit ja, Gender ja, Diversitaet ja, Fairness ja, Prompting teilweise | DOI 10.1145/3658644.3670284; Debiasing evaluiert |
| GPSB87RN | Fulltext | verified | Include | KI_Sonstige ja, Bias_Ungleichheit ja, Gender ja, Feministisch ja, Diversitaet teilweise, Fairness teilweise | FES-Policy-Paper mit ISBN; Manifest bindet zusätzlich NBYNRKBL und NHIZN4QJ |
| JMAWNUEV | Fulltext | provisional | Unclear | AI_Literacies ja, Generative_KI ja, Prompting teilweise, Bias_Ungleichheit teilweise | Bias nur als Testitem und Blueprint-Konzept |
| MQJEES7J | Fulltext | provisional | Unclear | AI_Literacies ja, Generative_KI ja, Prompting teilweise, Bias_Ungleichheit teilweise | Bias nur als Teil der Concern-Facette und eines Skalenitems |
| T9KEZN3G | Fulltext | provisional | Include | Generative_KI ja, Bias_Ungleichheit ja, AI_Literacies teilweise, Diversitaet teilweise, Fairness teilweise | Untertitel des Korpustitels fehlt in der konvertierten Überschrift; Einleitungsartikel eines Special Issue |
| ZNHUCA4B | Fulltext | provisional | Include | KI_Sonstige ja, Bias_Ungleichheit ja, Gender ja, Diversitaet ja, AI_Literacies teilweise, Feministisch teilweise, Fairness teilweise | UNESCO-Empfehlung 2021, Publikationstyp als Policy-Dokument zugelassen |

## Abweichungen und Blocker

- keine Blocker
- T9KEZN3G · Metadaten · Die Überschrift im Text lautet nur „Governance of Generative AI“, der Untertitel des Korpustitels fehlt, das Abstract kündigt aber „a comprehensive framework to govern generative AI“ an; DOI und Jahr fehlen im Text · Bestätigung von DOI und Untertitel aus den Bibliografiedaten
- 6JAZXKEB, JMAWNUEV, MQJEES7J, ZNHUCA4B · Metadaten · DOI oder stabile Kennung und teils das Jahr stehen nicht im Papertext · Abgleich mit den Bibliografiedaten
- knowledge/update-protocol.md, Abschnitt Eligibility · Dokumentversatz · nennt categories.yaml „version 1.4“, das Manifest bindet 1.4.1; laut Changelog ist der Eligibility-Inhalt unverändert, daher kein inhaltlicher Widerspruch · redaktionelle Nachführung

## Codierregeln mit Auslegungsbedarf

- Publikationstyp · ZNHUCA4B · Die UNESCO-Empfehlung ist ein zwischenstaatliches normsetzendes Instrument, kein Forschungsbericht im engeren Sinn. Zugelassen als Policy-Dokument mit identifizierbarer institutioneller Urheberschaft und ausdrücklicher Grundlage in internationalen Rechtsinstrumenten. Falls die Regel „belegte Policy-Reports“ enger gemeint ist, wäre der Record als Publikationstyp-Blocker zu behandeln.
- Bias_Ungleichheit · JMAWNUEV, MQJEES7J, 6JAZXKEB · Bias erscheint jeweils ausdrücklich, aber nur als Unteraspekt eines AI-Literacy-Konstrukts (Testitem, Skalenitem, Ethikdimension). Codiert als teilweise, daraus folgt Unclear. Bei nein würden die Records Exclude.
- Bias_Ungleichheit · T9KEZN3G · Bias ist eine von mehreren Governance-Herausforderungen, zusammen mit Machtungleichgewicht, Digital Divide und Einkommensungleichheit aber ein durchgehender Argumentationsstrang mit eigenem Maßnahmenbereich; daher ja.
- AN_Harm_Types · T9KEZN3G · Disparate_Performance und Stereotyping stammen aus der eigenen Risiko- und Herausforderungssynthese des Einleitungsartikels, die sich auf Zitate stützt. Gewertet nach der Regel für Reviews und Taxonomien, die die eigene Synthese strukturieren; eine strengere Lesart ergäbe None.
- AN_Bias_Axes · ZNHUCA4B · Other_Axis für Wohnort (Stadt-Land) und Entwicklungsstand der Länder (LMICs), Socioeconomic für die Armutslücke, Language_Culture für bedrohte Sprachen; die langen Listen geschützter Merkmale sind Aufzählungen und bleiben uncodiert.
- AN_Bias_Axes · 9MDIBETZ · Transgender- und nicht-binäre Identitäten bilden eine eigene Analysegruppe; codiert als Gender und Sexual_Orientation_Identity für geschlechtliche Identität.
- AN_Gender_Understanding · GPSB87RN · Social_Construct aus der Aussage, Patriarchat sei ein System, in dem Macht vorwiegend bei Männern liegt; Non_Binary_Inclusive aus dem eigenen Gestaltungsprinzip gegen binäre Geschlechterkategorien. Intersectional nicht codiert, da keine Passage ein Ergebnis von der Kombination der Achsen abhängig macht.
- AN_Mitigation_Status · GPSB87RN · Demonstrated nur für das MIRA-Praxisbeispiel, das als umgesetzt beschrieben wird, ohne berichtetes Evaluationsergebnis.
- AN_Task · T9KEZN3G, ZNHUCA4B · Other_Task für Politikgestaltung, Verwaltung und sektorübergreifende Anwendungen (Gesundheit, Justiz, Stadtsteuerung); alternativ None, wenn Governance-Texte keine berufliche Aufgabe beschreiben sollen.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
