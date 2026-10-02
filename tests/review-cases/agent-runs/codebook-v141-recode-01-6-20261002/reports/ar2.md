# codebook-v141-recode-01-6-20261002, ar2

- Akteur: agent
- Zuweisung: 4KMMPA6A, 7L78MV2V, ET4MMZGH, M62T5ICP, SQYLQFRU, T8R8RKX9 (Reihenfolge laut Laufmanifest)
- Coding-Paket: tmp/agent-runs/codebook-v141-recode-01-6-20261002/ar2/ar2-coding.json
- Quellenbasis: zugewiesene Volltexte unter docs/data/fulltext/, Hashes laut Validator mit dem Manifest übereinstimmend, jede Quelle vollständig gelesen
- Ergebnis: bestanden
- Verteilung: Include 6, Unclear 0, Exclude 0, Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 4KMMPA6A | Volltext | provisional | Include | AI_Literacies, Generative_KI, Prompting, Bias_Ungleichheit, Gender, Diversitaet, Fairness (ja), Feministisch (teilweise) | Praxisleitfaden einer Hochschule, als wissenschaftliche graue Literatur gelesen, keine DOI |
| 7L78MV2V | Volltext | verified | Include | Generative_KI, Bias_Ungleichheit, Diversitaet (ja), Prompting, Gender, Feministisch, Fairness (teilweise) | Survey mit eigenen Modellausgaben, DOI 10.1145/3597307 |
| ET4MMZGH | Volltext | provisional | Include | KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet, Feministisch (ja), AI_Literacies, Fairness (teilweise) | Fachkommentar in einer Praxiszeitschrift mit eigener Systemauswertung, keine DOI, Paywall-Teaser am Textende wiederholt |
| M62T5ICP | Volltext | verified | Include | Generative_KI, Bias_Ungleichheit, Diversitaet (ja), AI_Literacies, Soziale_Arbeit, Gender, Feministisch, Fairness (teilweise) | Policy-Report der Bertelsmann Stiftung, DOI 10.11586/2025078 |
| SQYLQFRU | Volltext | verified | Include | Generative_KI, Bias_Ungleichheit, Fairness (ja), Prompting (teilweise) | arXiv-Preprint 2504.05632v3 |
| T8R8RKX9 | Volltext | verified | Include | Generative_KI, KI_Sonstige, Bias_Ungleichheit, Gender, Feministisch, Fairness (ja), Prompting (teilweise) | Konferenzbeitrag (AAAI 2024), Langfassung arXiv 2407.20371, keine DOI im Text |

## Abweichungen und Blocker

- 4KMMPA6A, Publikationstyp und Identität, Leitfaden für Unternehmen eines geförderten Hochschulprojekts mit benannter Autorenschaft, eigenen Prompting-Demonstrationen und überwiegend journalistischen Quellen, als zulässige graue Literatur gewertet, keine DOI. Klärung: Bestätigung des Publikationstyps durch die Domain-Expert:innen.
- ET4MMZGH, Publikationstyp und Identität, Beitrag in einer Praxiszeitschrift ohne DOI und URL im Text, als fachwissenschaftlicher Kommentar mit eigener Auswertung gewertet. Klärung: Bestätigung des Publikationstyps und einer stabilen Quellenkennung.
- Keine Blocker.

## Codierregeln mit Auslegungsbedarf

- AN_Harm_Types, 4KMMPA6A, Indirect_Discrimination stützt sich auf das eigene Argument, dass männlich ansprechende Stellenanzeigen weniger Bewerbungen von Frauen bewirkten und ein darauf trainiertes Modell dies fortsetzt. Ob eine Stellenanzeige eine Allokation im Sinn der Regel ist, bleibt ein Grenzfall.
- AN_Mitigation_Status, 4KMMPA6A, die Promptvariante mit „divers“ wird an zwei Tools vorgeführt und kommentiert, als Demonstrated statt Evaluated codiert, weil keine abgeschlossene Prüfung vorliegt.
- AN_Bias_Axes, 4KMMPA6A und ET4MMZGH, Intersectional nicht codiert, weil die kombinierten Fälle (Women of Color, darker-skinned women) aus zitierten Quellen stammen und die eigene Auswertung nur Ko-Vorkommen zählt.
- AN_Gender_Understanding, 7L78MV2V und T8R8RKX9, Binary_Categorical zusammen mit Intersectional, ein vom Codebuch offen gelassenes Paar.
- AN_Gender_Understanding, ET4MMZGH, Non_Binary_Inclusive, weil nicht-binäre Personen als Kategorie der eigenen Wirkungsauswertung erscheinen. Trennung von Gender und Sexual_Orientation_Identity für nicht-binäre Gruppen bleibt offen, hier unter Gender geführt.
- AN_Bias_Definition, M62T5ICP, Explicit aus dem eigenen Satz, der Bias als Parteilichkeit gegenüber Gruppen, Ideen oder Praktiken bestimmt, obwohl der Report zugleich betont, Bias sei kulturell verschieden definiert. Grenzfall zu Implicit_Only.
- AN_Theory_Reference, 7L78MV2V, Intersektionalität rahmt Abschnitt 3.11 als Begriff und wurde als Theoriebezug gewertet, Grenze zwischen rahmendem Konzept und bloßer Erwähnung.
- AN_Task, M62T5ICP, Counselling_Client_Communication aus den Anwendungsbeispielen des Vorworts (Migrationsberatung, Sozialleistungsberatung, Hilfetelefon), der Hauptteil behandelt Foundation Models ohne Aufgabenbezug.
- Gender-Kategorie, 7L78MV2V, teilweise, weil Gender einer von elf Inventarabschnitten ist und nicht Hauptgegenstand.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
