# codebook-v141-includes-14-10-20261002 · ar2

- Akteur: agent
- Zuweisung: 4PK8UN82, AK7K4P97, DGLWM93D, HMDFMBV3, JPUCNHNU, K6JQ7SVA, MIT8HTC6, UDZLIJWX, WLV8L8PM, YN9JAREI
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-14-10-20261002/ar2/ar2-coding.json
- Quellenbasis: zugewiesene Volltexte unter docs/data/fulltext/, jeweils vollständig gelesen, Codebuch 1.4.1, Prompt 1.4
- Ergebnis: bestanden
- Verteilung: Include 10 · Unclear 0 · Exclude 0 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 4PK8UN82 | Fulltext | verified | Include | Generative_KI, Soziale_Arbeit (ja), AI_Literacies, Prompting, Bias_Ungleichheit (teilweise) | Empfehlungspapier zur Sozialarbeitsforschung |
| AK7K4P97 | Fulltext | verified | Include | KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit, Diversitaet (ja), AI_Literacies, Generative_KI (teilweise) | EPIC-Modell, dekolonialer Rahmen |
| DGLWM93D | Fulltext | verified | Include | AI_Literacies, Generative_KI, Prompting, Soziale_Arbeit (ja), Bias_Ungleichheit (teilweise) | Werkstattbericht Hochschullehre |
| HMDFMBV3 | Fulltext | provisional | Include | Generative_KI, Prompting, Bias_Ungleichheit (ja), Gender, Diversitaet, Feministisch (teilweise) | DOI und Jahr fehlen im Text |
| JPUCNHNU | Fulltext | provisional | Include | Generative_KI, Bias_Ungleichheit, Diversitaet, Fairness (ja), Prompting (teilweise) | DOI und Jahr fehlen im Text |
| K6JQ7SVA | Fulltext | provisional | Include | KI_Sonstige, Bias_Ungleichheit, Fairness (ja), Gender, Feministisch (teilweise) | DOI und Jahr fehlen im Text |
| MIT8HTC6 | Fulltext | provisional | Include | Generative_KI, Prompting, Bias_Ungleichheit, Gender, Diversitaet, Fairness (ja) | DOI und Jahr fehlen im Text |
| UDZLIJWX | Fulltext | provisional | Include | Generative_KI, Diversitaet (ja), Prompting, Bias_Ungleichheit, Gender (teilweise) | DOI und Jahr fehlen im Text |
| WLV8L8PM | Fulltext | provisional | Include | Generative_KI, Bias_Ungleichheit, Gender, Diversitaet (ja), Prompting, Feministisch, Fairness (teilweise) | DOI und Jahr fehlen im Text |
| YN9JAREI | Fulltext | provisional | Include | AI_Literacies, Generative_KI, Prompting, Bias_Ungleichheit, Gender, Diversitaet, Fairness (ja), Feministisch (teilweise) | Praxisleitfaden, keine DOI, Publikationstyp siehe unten |

## Abweichungen und Blocker

- Keine Blocker. Kein Titel- oder DOI-Konflikt.
- HMDFMBV3, JPUCNHNU, K6JQ7SVA, MIT8HTC6, UDZLIJWX, WLV8L8PM, YN9JAREI · Metadatenlücke · DOI oder stabile Kennung und teils das Jahr stehen nicht im Volltext · Abgleich mit den Korpusmetadaten durch den Orchestrator, vorläufige Codierung gespeichert.
- HMDFMBV3 · interne Quelleninkonsistenz · Abschnitt 2.1 nennt gender (men and women), die Ergebnistabellen führen non-binary-Gruppen · Analyse folgt den Tabellen.

## Codierregeln mit Auslegungsbedarf

- Publikationstyp · YN9JAREI · Praxisleitfaden einer Hochschule im BMWK-geförderten Projekt mit identifizierbarer Autorenschaft, Quellenliste und eigenen Prompt-Tests, als belegter Report zulässig gewertet. Grenze zum allgemeinen Ratgeber, für die Fachexpert:innen markiert.
- AN_Mitigation_Status · YN9JAREI · Evaluated nur für das Ergänzen von 'divers' im Prompt mit berichtetem geringem Effekt. Der Test ist informell (ein Prompt, zwei Tools), Demonstrated wäre die engere Lesart.
- AN_Harm_Types · K6JQ7SVA · Indirect_Discrimination über das vom Werk selbst so benannte Maß disparate impact, Disparate_Performance über Equality of Opportunity. Beide stammen aus dem theoretischen Rahmen, die Realdatenanalyse aggregiert über Gruppen.
- AN_Harm_Types · WLV8L8PM · Emotionsunterschiede sind Ton-Unterschiede und daher kein Disparate_Performance. Exclusionary_Norms für die Abwertung queerer Sprache gegenüber der Normsprache als eigenes Ergebnis.
- AN_Harm_Types · UDZLIJWX · Bewertungsunterschiede von GPT-4 als Evaluator nach Gender und Ethnizität der Figuren passen auf keinen Wert (weder Qualitätsunterschied noch Entscheidung über Personen), daher None.
- AN_Harm_Types · 4PK8UN82, DGLWM93D · allgemeine Risikoaussagen zu Stereotypen und Diskriminierung ohne eigenes Argument zum Mechanismus, daher None.
- AN_Mitigation_Stage · MIT8HTC6 · das Werk ordnet sich selbst Post-Processing zu, verändert aber nur Prompts und trainiert das Umschreibe-LLM, daher Prompt_Practice und In_Training.
- AN_Mitigation_Stage · WLV8L8PM · Sicherheitsmechanismen der Anbieter werden nur aus Antwortmustern erschlossen und nicht identifiziert, daher None.
- AN_Mitigation_Stage · AK7K4P97 · Datendekolonisierung als Governance- und Advocacy-Forderung, daher Organisational_Process statt Pre_Processing.
- AN_Gender_Understanding · WLV8L8PM · Social_Construct aus der ausdrücklichen Bestimmung von Gender-Rollen und binären Gender-Normen als sprachlich kodierte Normordnung, nicht aus einem Satz der Form 'gender is socially constructed'.
- AN_Gender_Understanding · K6JQ7SVA, YN9JAREI · Paar Binary_Categorical mit Intersectional gewählt, da die Analyse binär bleibt und eine kombinationsabhängige Passage vorliegt.
- AN_Theory_Reference · HMDFMBV3 · Intersektionalität als Gruppenkombinatorik ohne Theoriebezug, daher No. K6JQ7SVA · Crenshaw rahmt das Problem ausdrücklich, daher Yes.
- AN_Theory_Reference · AK7K4P97, YN9JAREI · dekoloniale Perspektive bzw. Feministische KI als rahmende Konzepte gewertet. Die Grenze zur illustrativen Nennung ist nach dem Pilotbefund offen.
- AN_Bias_Axes · HMDFMBV3 · Other_Axis für politische Orientierung. K6JQ7SVA · marital-status nicht als Benachteiligungsachse codiert. JPUCNHNU · die acht Zielgruppen des Datensatzes werden nicht gruppenweise ausgewertet, daher nur Language_Culture.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
