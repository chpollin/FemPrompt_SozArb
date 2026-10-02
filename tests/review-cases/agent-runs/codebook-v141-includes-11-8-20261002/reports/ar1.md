# codebook-v141-includes-11-8-20261002 · ar1

- Akteur: agent
- Zuweisung: 2SNYUZG4, 5ERYSQCK, 9Y7ZFGI5, EN6GNKL3, HJ7BHX8J, JI24FQPV, Q4LK53XW, UJ7DXK8Y
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-11-8-20261002/ar1/ar1-coding.json
- Quellenbasis: docs/data/fulltext/<Paper-ID>.md, alle acht SHA-256 gegen das Laufmanifest geprüft und übereinstimmend, jede Quelle vollständig gelesen; Regeln aus assessment/categories.yaml 1.4.1 und knowledge/update-protocol.md (Eligibility, Text preparation and source gate, Agent-assisted completion, Analysis coding)
- Ergebnis: bestanden
- Verteilung: Include 6 · Unclear 2 · Exclude 0 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 2SNYUZG4 | Fulltext | verified | Unclear | AI_Literacies ja, Generative_KI ja, Prompting teilweise, Bias_Ungleichheit teilweise | Bildungsperspektive zu GenAI; soziale Dimension nur als Teilaspekt (WEIRD-Bias, Digital Divide); kein DOI im Text |
| 5ERYSQCK | Fulltext | verified | Unclear | Generative_KI ja, Prompting teilweise, Gender teilweise | Psychometrische Skala zu Vertrauen in LLMs; Gender nur als Regressionsbefund; Preprint ohne DOI |
| 9Y7ZFGI5 | Fulltext | verified | Include | AI_Literacies ja, KI_Sonstige ja, Bias_Ungleichheit ja, Gender ja, Diversitaet ja, Generative_KI/Feministisch/Fairness teilweise | Narrative Review; einige Zahlenangaben im Text sind als „Own elaboration“ ausgewiesen, Quellenqualität nicht Gegenstand dieser Codierung |
| EN6GNKL3 | Fulltext | verified | Include | AI_Literacies ja, Generative_KI ja, Bias_Ungleichheit ja, Prompting/KI_Sonstige/Gender/Diversitaet teilweise | Fallstudie Lehrkräftebildung; Bias_Ungleichheit als ja gewertet, weil Bias-Aktivität und Bias-Befunde drei der fünf Ergebnisabschnitte tragen |
| HJ7BHX8J | Fulltext | verified | Include | KI_Sonstige ja, Feministisch ja, Bias_Ungleichheit/Gender teilweise | Interviewstudie, feministische Theorie der Verantwortung; kein DOI im Text |
| JI24FQPV | Fulltext | verified | Include | Generative_KI ja, Soziale_Arbeit ja, AI_Literacies/Bias_Ungleichheit/Diversitaet teilweise | Textebene ohne Abstract |
| Q4LK53XW | Fulltext | verified | Include | KI_Sonstige ja, Bias_Ungleichheit ja, Gender ja, Feministisch ja, Fairness ja, Diversitaet teilweise | Philosophische Analyse intersektionaler Fairness |
| UJ7DXK8Y | Fulltext | verified | Include | KI_Sonstige ja, Bias_Ungleichheit ja, Diversitaet ja, Generative_KI/Prompting/Gender teilweise | Weder DOI noch Venue noch Jahr im Text |

## Abweichungen und Blocker

- Keine Blocker. Alle Titel stimmen mit dem Korpustitel überein, kein DOI-Konflikt.
- 2SNYUZG4, 5ERYSQCK, HJ7BHX8J, UJ7DXK8Y · Metadatenlücke · Text nennt keinen DOI (UJ7DXK8Y auch kein Jahr) · Bindung allein über version_id und Hash des Manifests; Status trotzdem verified, weil Titel und Autor:innen übereinstimmen.
- 2SNYUZG4, 5ERYSQCK · Entscheidung Unclear in einem Lauf, der Includes analysiert · Technikdimension ja, soziale Dimension höchstens teilweise · fachliche Klärung durch Domain-Expert:innen, ob die frühere Include-Entscheidung auf einer anderen Lesart der sozialen Kategorien beruht.
- knowledge/update-protocol.md, Abschnitt Eligibility, nennt Version 1.4 und fünf Ausschlussgründe, das Codebuch 1.4.1 führt zusätzlich Consolidated_expert_exclusion · kein Widerspruch für diesen Lauf, da kein Exclude vergeben wurde.

## Codierregeln mit Auslegungsbedarf

- AN_Mitigation_Status · EN6GNKL3 · Ob eine AI-Literacy-Schulung als Maßnahme gegen Bias gilt; gewählt Organisational_Process mit Evaluated, weil die Fallstudie ein abgeschlossenes, gemischtes Ergebnis zum Bias- und Ethikbewusstsein berichtet.
- AN_Theory_Reference · EN6GNKL3 · Soziotechnische Rahmung generativer KI als Reproduktion von Ungleichheit ist eine ausdrückliche Rahmung des Werks, aber keine benannte Theorie und rahmt vor allem die Didaktik; gewählt No.
- AN_Gender_Understanding · EN6GNKL3 · Gender nur im CEO-Befund als Mann-Frau-Gegensatz; gewählt Binary_Categorical mit Implicit_Only statt Unclear mit Absent.
- AN_Gender_Definition · HJ7BHX8J · Butlers Bestimmung von Gender als relationale Kategorie steht im eigenen Theorierahmen, dient dort aber der Begründung von Interdependenz; gewählt Explicit.
- AN_Bias_Axes, AN_Harm_Types · HJ7BHX8J · Geschlechtlich und rassifiziert verteilte Sorgearbeit betrifft Arbeit in der KI-Industrie, nicht Systembias; zitierte Diskriminierungsfälle nicht vom eigenen Ergebnis hergeleitet; gewählt None.
- AN_Harm_Types · Q4LK53XW · Allokative Benachteiligung im hypothetischen Einstellungsalgorithmus, die das Werk nicht als unmittelbar oder mittelbar klassifiziert (vom Pilotlauf offen gelassene Frage); gewählt Direct_Discrimination, weil die gelernte Präferenz an Rasse und Geschlecht hängt.
- AN_Harm_Types · Q4LK53XW · Gesichtserkennungsfall stammt aus zitierter Arbeit, das Werk führt aber eine eigene Ursachenanalyse; gewählt Disparate_Performance.
- AN_Bias_Axes · 9Y7ZFGI5 · Ländliche gegenüber städtischen Frauen als eigenes Beispiel im Intersektionalitätsabschnitt; gewählt Other_Axis (Wohnort) und Intersectional, obwohl kein Vergleich mit ländlichen Männern vorliegt.
- AN_Task · UJ7DXK8Y · Hassrede-Erkennung und soziale Akzeptabilität als NLP-Benchmark-Aufgaben ohne Berufspraxis; gewählt None statt Other_Task.
- AN_Gender_Understanding · UJ7DXK8Y · Social_Construct gestützt auf den Satz, Gender sei „culturally ascribed“; Schwelle für Social_Construct bleibt laut Pilotbericht offen.
- AN_Mitigation_Stage · UJ7DXK8Y · Empfehlung von Modellierungstechniken für Annotationsdissens als In_Training gewertet; allgemein formuliert.
- AN_Prompting_Role · EN6GNKL3 · Prompts als Mittel eines Bias-Tests in einer Lernaktivität; gewählt Research_Instrument statt Learning_Content.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
