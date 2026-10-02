# codebook-v141-includes-10-8-20261002 · ar1

- Akteur: agent
- Zuweisung: 22KJL3PC, 3AHQEHDF, 3AQ2K3BX, 6L85PRUW, 7L93JBLR, ERTJZW5M, K3YCLBXK, QY6P4RGQ
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-10-8-20261002/ar1/ar1-coding.json
- Quellenbasis: Volltexte docs/data/fulltext/<Paper-ID>.md laut Laufmanifest, jeweils vollständig gelesen, Codebuch 1.4.1
- Ergebnis: bestanden
- Verteilung: Include 6 · Unclear 2 · Exclude 0 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 22KJL3PC | Fulltext | verified | Include | Generative_KI ja, Prompting ja, Bias_Ungleichheit ja, AI_Literacies teilweise, Fairness teilweise | Promptstrategien gegen kulturellen Bias evaluiert |
| 3AHQEHDF | Fulltext | provisional | Include | Generative_KI ja, Prompting ja, Diversitaet ja, Bias_Ungleichheit teilweise | DOI und Jahr fehlen im Text |
| 3AQ2K3BX | Fulltext | provisional | Unclear | AI_Literacies ja, KI_Sonstige teilweise, Bias_Ungleichheit teilweise, Diversitaet teilweise | soziale Dimension nur nachgeordnet im Ethikteil, DOI und Jahr fehlen im Text |
| 6L85PRUW | Fulltext | verified | Include | Generative_KI ja, Prompting ja, Bias_Ungleichheit ja, Diversitaet ja, AI_Literacies teilweise, Gender teilweise | Methode demonstriert, nicht evaluiert |
| 7L93JBLR | Fulltext | verified | Include | KI_Sonstige ja, Bias_Ungleichheit ja, Gender ja, Diversitaet ja, Feministisch ja, Generative_KI teilweise, Soziale_Arbeit teilweise, Fairness teilweise | Ankerwerk für AN_Theory_Reference Yes |
| ERTJZW5M | Fulltext | verified | Unclear | AI_Literacies ja, KI_Sonstige ja, Bias_Ungleichheit teilweise | Bias nur als Vertrauensbarriere genannt |
| K3YCLBXK | Fulltext | verified | Include | AI_Literacies ja, Bias_Ungleichheit ja, Generative_KI teilweise, Prompting teilweise, KI_Sonstige teilweise, Gender teilweise, Diversitaet teilweise | Policy-Report von Digital Promise, nach Publikationstypregel zulässig |
| QY6P4RGQ | Fulltext | provisional | Include | Generative_KI ja, Bias_Ungleichheit ja, Gender teilweise, Fairness teilweise | DOI, Jahr und Ort fehlen im Text |

## Abweichungen und Blocker

- alle Records · Lesesperre · Zur Prüfung des Validator-Vokabulars wurden aus docs/data/analysis_fields.json die Version, die Feldnamen und die Studientypen ausgegeben. Die Datei liegt unter einem gesperrten Pfad, enthält aber nur die Projektion des Codebuchs und keine Urteile · Kenntnisnahme durch den Orchestrator
- 3AHQEHDF, 3AQ2K3BX, QY6P4RGQ · Metadatenlücke · Titel und Autor:innen stimmen überein, DOI und Jahr stehen nicht im konvertierten Text · Bestätigung der Identität aus der Zotero-Metadatenebene
- Keine Blocker.

## Codierregeln mit Auslegungsbedarf

- Studientyp und Entscheidung · 3AQ2K3BX, ERTJZW5M · Bias, Inklusion und Fairness erscheinen nur als nachgeordnete Teilaspekte, deshalb `teilweise` und Unclear. Für Analysefelder ist diese Charge als Include-Charge angelegt
- AN_Theory_Reference · 22KJL3PC · Hofstede- und GLOBE-Kulturdimensionen erklären die Quelle der kulturellen Stereotype und Biases. Als Yes codiert, Grenze zu einem bloßen Messrahmen
- AN_Theory_Reference · QY6P4RGQ · Der Begriff der representational harms (Crawford) rahmt die Bias-Bestimmung und wurde als theoretisches Konzept gewertet. Dieselbe Passage begründet AN_Bias_Definition Explicit
- AN_Harm_Types · 22KJL3PC · Die simulierte Zuteilung im Dictator- und Ultimatum-Spiel ändert sich mit der im Prompt genannten Nationalität und wurde als Direct_Discrimination codiert, obwohl es sich um eine simulierte und keine reale Allokation handelt
- AN_Bias_Axes und AN_Harm_Types · K3YCLBXK · Achsen und Schäden stammen aus zitierter Literatur. Das einzelne Arztbild-Beispiel ist nicht ausgeführt, daher jeweils None (Anker VSZM7CT6)
- AN_Bias_Axes · 6L85PRUW · Disability ist aus dem eigenen Argument zur toxic positivity codiert, ohne eigenes Fallbeispiel
- AN_Bias_Definition · 6L85PRUW · Die eigene Bestimmung von toxic positivity als Bias-Mechanismus wurde als Explicit gewertet
- AN_Population · 7L93JBLR · SyRI ist ein Fallbeispiel aus der Sozialhilfe, das Werk adressiert aber KI-Regulierung allgemein, daher Not_SW_Specific
- AN_Population · K3YCLBXK · Education_Professional für die Fortbildung von Lehrkräften und Not_SW_Specific für K-12-Schüler:innen gemeinsam vergeben
- Generative_KI · QY6P4RGQ · Das Werk rahmt die Modelle als Sprachmodelle. Getestet werden UnifiedQA (generativ) sowie die Encoder-Modelle RoBERTa und DeBERTaV3

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
