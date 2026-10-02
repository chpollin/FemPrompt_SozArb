# codebook-v141-includes-14-10-20261002 · ar1

- Akteur: agent
- Zuweisung: 4PK8UN82, AK7K4P97, DGLWM93D, HMDFMBV3, JPUCNHNU, K6JQ7SVA, MIT8HTC6, UDZLIJWX, WLV8L8PM, YN9JAREI (Laufmanifest tests/review-cases/agent-runs/codebook-v141-includes-14-10-20261002/run.json, Codebuch 1.4.1, Prompt 1.4)
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-14-10-20261002/ar1/ar1-coding.json
- Quellenbasis: zugewiesene Volltexte unter docs/data/fulltext/, jeweils vollständig gelesen, SHA-256 aller zehn Quellen gegen das Manifest geprüft
- Ergebnis: bestanden
- Verteilung: Include 10 · Unclear 0 · Exclude 0 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 4PK8UN82 | Volltext | verified | Include | AI_Literacies (t), Generative_KI, Prompting (t), Soziale_Arbeit, Bias_Ungleichheit (t) | Empfehlungen für Forschung und Herausgeberschaft, Bias nur als Hintergrund |
| AK7K4P97 | Volltext | verified | Include | AI_Literacies (t), Generative_KI (t), KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit, Diversitaet | EPIC-Modell, Dekolonisierung als Theoriebezug |
| DGLWM93D | Volltext | verified | Include | AI_Literacies, Generative_KI, Prompting, Soziale_Arbeit, Bias_Ungleichheit (t) | Buchkapitel, Lehrszenarien, eigene Bias-Bestimmung |
| HMDFMBV3 | Volltext | provisional | Include | Generative_KI, Prompting, Bias_Ungleichheit, Gender (t), Diversitaet (t), Feministisch (t) | Ankerwerk für Intersectional, kein DOI und Jahr im Text |
| JPUCNHNU | Volltext | provisional | Include | Generative_KI, Prompting (t), Bias_Ungleichheit, Diversitaet, Fairness | Achsen der acht Zielgruppen nur aggregiert, daher nur Language_Culture |
| K6JQ7SVA | Volltext | provisional | Include | KI_Sonstige, Bias_Ungleichheit, Gender (t), Feministisch (t), Fairness | Preprint, Studientyp an der Grenze zu Theoretisch |
| MIT8HTC6 | Volltext | provisional | Include | Generative_KI, Prompting, Bias_Ungleichheit, Gender, Diversitaet, Fairness | Selbstklassifikation Post-Processing, codiert als Prompt_Practice |
| UDZLIJWX | Volltext | provisional | Include | Generative_KI, Prompting (t), Bias_Ungleichheit (t), Gender (t), Diversitaet | Bewertungsunterschiede ohne passende Schadensart |
| WLV8L8PM | Volltext | provisional | Include | Generative_KI, Prompting (t), Bias_Ungleichheit, Gender, Diversitaet, Feministisch (t), Fairness (t) | Tonunterschied nicht als Disparate_Performance |
| YN9JAREI | Volltext | verified | Include | AI_Literacies, Generative_KI, Prompting, Bias_Ungleichheit, Gender, Diversitaet, Feministisch (t), Fairness | Praxisleitfaden, Publikationstyp als wissenschaftliche graue Literatur zugelassen |

(t) steht für `teilweise`, alle übrigen genannten Kategorien stehen auf `ja`.

## Abweichungen und Blocker

- Keine Blocker. Kein Titel- oder DOI-Konflikt, alle Quellenhashes stimmen mit dem Manifest überein.
- HMDFMBV3, JPUCNHNU, K6JQ7SVA, MIT8HTC6, UDZLIJWX, WLV8L8PM · Metadatenlücke · Der Volltext nennt Titel und Autor:innen, aber weder DOI noch Jahr oder Venue (MIT8HTC6 nennt nur WACV) · Bestätigung von DOI und Jahr aus der Zotero-Ebene, die Codierung bleibt davon unberührt.

## Codierregeln mit Auslegungsbedarf

- Publikationstyp · YN9JAREI · Leitfaden einer Hochschule für Management und Recht im BMWK-geförderten Projekt Mittelstand-Digital, mit benannter Autorenschaft, Zitiervorschlag, Expert:innenbeteiligung und Quellenliste, aber überwiegend Presse- und Webquellen. Als belegter Praxis- und Policy-Report im Sinn der ratifizierten Regel zugelassen, nicht als allgemeiner Ratgeber. Die Domänenexpert:innen sollten diese Einordnung bestätigen.
- AN_Harm_Types · WLV8L8PM · Negativere Emotionslabels für queeren Slang sind ein Tonunterschied und nach 1.4.1 kein Disparate_Performance. Exclusionary_Norms stützt sich auf das eigene Argument, dass Schutzmechanismen gegen heteronormative Sprache einen Bias gegen queere Sprache hinterlassen.
- AN_Harm_Types · UDZLIJWX · Präferenzunterschiede des GPT-4-Bewerters nach Gender und Herkunft passen auf keinen Wert der Taxonomie. Sie sind kein Qualitätsunterschied des Systems zwischen Gruppen, daher None.
- AN_Harm_Types · K6JQ7SVA · Ergebnisdisparitäten eines Klassifikators werden über das vom Werk selbst verwendete Kriterium disparate impact als Indirect_Discrimination codiert. Die Frage aus dem Pilotlauf, wie nicht selbst klassifizierte allokative Disparitäten zu codieren sind, bleibt offen.
- AN_Mitigation_Stage · MIT8HTC6 · Das Werk ordnet sich als Post-Processing ein. Codiert ist Prompt_Practice, weil der Eingriff den Prompt vor einem eingefrorenen Bildmodell ändert und keine Modellausgabe technisch verändert.
- AN_Gender_Understanding · WLV8L8PM · Social_Construct ist ein Grenzfall. Die Aussage, dass binäre Geschlechternormen soziale Normen sind, steht in der Heteronormativitätstaxonomie und in Tabelle 1, nicht in einem eigenen Satz über Geschlecht.
- AN_Gender_Understanding · HMDFMBV3 · Der Text nennt gender (men and women), die Datensatz- und Ergebnistabellen führen aber non-binary als Analysekategorie. Der Wert folgt der Analyse, also Non_Binary_Inclusive mit Intersectional.
- AN_Bias_Axes · JPUCNHNU · Der Datensatz deckt acht Zielgruppen ab, die Ergebnisse stehen aber nur aggregiert pro Modell. Codiert ist allein Language_Culture.
- AN_Bias_Axes · HMDFMBV3 · Die politische Orientierung wird analysiert, aber nicht als Other_Axis codiert, weil sie keine eindeutige soziale Benachteiligungsachse ist.
- AN_Theory_Reference · AK7K4P97 · Dekolonisierung von KI rahmt die Behandlung von strukturellem Bias im Modell selbst und wird daher als Theoriebezug codiert. Bei HMDFMBV3 bleibt Intersektionalität eine Kombination demografischer Merkmale ohne benannte Theorie, daher No.
- Studientyp · K6JQ7SVA · Die formalen Beweise liegen nahe an Theoretisch. Gewählt ist Experimentell wegen der kontrollierten synthetischen Experimente mit variiertem Bias.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
