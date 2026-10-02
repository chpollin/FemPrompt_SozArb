# codebook-v141-recode-03-6-20261002, ar2

- Akteur: agent
- Zuweisung: 2EBHMYU4, 4ZL5Q48E, 7FBB2KUC, A2P8MXMY, AHUSFEEA, INQNDHTI (Reihenfolge nach Laufmanifest)
- Coding-Paket: tmp/agent-runs/codebook-v141-recode-03-6-20261002/ar2/ar2-coding.json
- Quellenbasis: zugewiesene Volltexte unter docs/data/fulltext/, SHA-256 aller sechs Dateien vor der Codierung gegen das Manifest geprüft und übereinstimmend, jeder Text vollständig gelesen
- Ergebnis: bestanden
- Verteilung: Include 6, Unclear 0, Exclude 0, Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 2EBHMYU4 | Volltext | verified | Include | KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet, Feministisch (ja), AI_Literacies, Fairness (teilweise) | Framing-Analyse von vier Berichten, Artikel-DOI fehlt im Text |
| 4ZL5Q48E | Volltext | verified | Include | AI_Literacies, KI_Sonstige, Bias_Ungleichheit (ja) | Bias_Ungleichheit trägt die Machtasymmetrie Beschäftigte und Management |
| 7FBB2KUC | Volltext | verified | Include | Generative_KI, KI_Sonstige, Soziale_Arbeit (ja), AI_Literacies, Bias_Ungleichheit, Diversitaet (teilweise) | Manifest-Alias MA3LBJS6, DOI fehlt im Text |
| A2P8MXMY | Volltext | verified | Include | KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit, Fairness (ja), AI_Literacies, Diversitaet (teilweise) | |
| AHUSFEEA | Volltext | provisional | Include | AI_Literacies, KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet, Feministisch, Fairness (ja), Soziale_Arbeit (teilweise) | Projekttoolkit ohne Einzelautorschaft und DOI |
| INQNDHTI | Volltext | verified | Include | KI_Sonstige, Bias_Ungleichheit, Fairness (ja), AI_Literacies, Gender, Diversitaet (teilweise) | Systematisches Review, Gesundheitswesen |

## Abweichungen und Blocker

- AHUSFEEA, Publikationstyp und Identität: Toolkit des Erasmus+-Projekts DIVERSIFAIR (Work Package 5, Fassung November 2024) ohne individuelle Autor:innen und ohne DOI. Eingeordnet als belegter, projektgebundener Policy- und Praxisreport, weil er auf Interviews und Fokusgruppen beruht, Quellen nennt und eine identifizierbare institutionelle Autorschaft hat. Der Business-Case-Abschnitt hat Marketingcharakter, die Zielgruppe ist widersprüchlich angegeben (Industriesektor im Titel, Policymakers unter „For whom?“), und der niederländische Fall steht doppelt. Klärung durch die Domain-Expert:innen, ob der Typ die Publikationstypregel erfüllt.
- 2EBHMYU4 und 7FBB2KUC, Metadatenlücke: Keine Artikel-DOI im Text. Titel, Autorschaft und Jahr stimmen, daher verified.
- Keine Blocker.

## Codierregeln mit Auslegungsbedarf

- Bias_Ungleichheit, 4ZL5Q48E: Ja beruht auf der zentralen Analyse der Machtasymmetrie zwischen Beschäftigten und Management im KI-Kontext („strukturelle Benachteiligung“), nicht auf Diskriminierungsbias, der nur einen nachgeordneten Absatz bildet. Bei engerer Lesart wäre die Kategorie teilweise und die Entscheidung Unclear.
- AN_Bias_Axes, 4ZL5Q48E und 2EBHMYU4: Other_Axis für Position in der Arbeitshierarchie beziehungsweise für die geopolitische Position Global North und Global South, beide aus der eigenen Argumentation der Werke.
- AN_Harm_Types, AHUSFEEA: Die Fallbibliothek übernimmt Fälle aus Presse- und NGO-Quellen, analysiert sie aber in eigenen Abschnitten („Intersectionality at play“). Codiert wurden die Mechanismen dieser eigenen Analyse. Die niederländische Affäre wurde als Direct_Discrimination gelesen, weil nationale Herkunft selbst einging, obwohl Einkommen und Familienform zugleich als Proxies wirken.
- AN_Harm_Types, INQNDHTI: Das US-Allokationsbeispiel bleibt im Review ohne Klassifikation. Indirect_Discrimination stützt sich auf die eigene Benennung des Reviews, die allerdings das Fehlen von Gruppendaten betrifft.
- AN_Gender_Definition, 2EBHMYU4: Explicit als Grenzfall. Gender wird als sozial konstruierte, mit Macht verbundene und intersektional wirkende Kategorie bestimmt, ohne Definitionssatz.
- AN_Gender_Understanding, AHUSFEEA und INQNDHTI: AHUSFEEA analysiert Gender intersektional, aber nur über Frauen und Männer, codiert ist allein Intersectional, weil das offene Paar Binary_Categorical mit Intersectional nicht entschieden ist. INQNDHTI als Binary_Categorical aus der Gegenüberstellung von Frauen und männlich dominierten Daten.
- AN_Theory_Reference, 7FBB2KUC und 4ZL5Q48E: Yes als Grenzfall. Staub-Bernasconis Menschenrechtsprofession rahmt das Diskriminierungsverbot, die soziotechnische Perspektive rahmt das Verständnis von Bias als in Organisationskulturen verwurzelt.
- AN_Task, 2EBHMYU4 und AHUSFEEA: None, weil Personalauswahl und Betrugserkennung nur als Fallbeispiele erscheinen und die Werke keinen KI-Einsatz für eine Aufgabe beschreiben oder vorschlagen. 4ZL5Q48E und INQNDHTI erhielten Other_Task, weil sie den Einsatz im Personalmanagement beziehungsweise in der klinischen Entscheidungsunterstützung selbst zum Gegenstand haben.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
