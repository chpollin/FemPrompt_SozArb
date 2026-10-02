# codebook-v141-recode-01-6-20261002, ar1

- Akteur: agent
- Zuweisung: 4KMMPA6A, 7L78MV2V, ET4MMZGH, M62T5ICP, SQYLQFRU, T8R8RKX9 (Laufmanifest tests/review-cases/agent-runs/codebook-v141-recode-01-6-20261002/run.json, Codebuch 1.4.1, Reviewer-Prompt 1.4)
- Coding-Paket: tmp/agent-runs/codebook-v141-recode-01-6-20261002/ar1/ar1-coding.json
- Quellenbasis: zugewiesene Volltexte unter docs/data/fulltext/, alle sechs vollständig gelesen, alle Quell-Hashes stimmen mit dem Manifest überein
- Ergebnis: bestanden
- Verteilung: Include 6, Unclear 0, Exclude 0, Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 4KMMPA6A | Volltext | provisional | Include | AI_Literacies, Generative_KI, Prompting, Bias_Ungleichheit, Gender, Diversitaet, Fairness (ja), Feministisch (teilweise) | Praxisleitfaden einer Hochschule ohne DOI, als wissenschaftliche Graue Literatur gelesen |
| 7L78MV2V | Volltext | verified | Include | Generative_KI, Bias_Ungleichheit (ja), Prompting, Gender, Diversitaet, Fairness (teilweise) | Survey mit eigenen Modellausgaben als Beispielen |
| ET4MMZGH | Volltext | provisional | Include | KI_Sonstige, Bias_Ungleichheit, Gender, Diversitaet, Feministisch (ja), AI_Literacies, Fairness (teilweise) | SSIR-Kommentar ohne DOI, Quelle mit doppeltem Einstieg und Paywall-Hinweis am Ende |
| M62T5ICP | Volltext | verified | Include | Generative_KI, Bias_Ungleichheit, Diversitaet (ja), AI_Literacies, KI_Sonstige, Soziale_Arbeit, Gender, Fairness (teilweise) | Policy-Report der Bertelsmann Stiftung mit DOI |
| SQYLQFRU | Volltext | verified | Include | Generative_KI, Bias_Ungleichheit, Fairness (ja), Prompting (teilweise) | arXiv-Preprint, Jahr im Text nicht genannt |
| T8R8RKX9 | Volltext | verified | Include | Generative_KI, KI_Sonstige, Bias_Ungleichheit, Gender, Fairness (ja), Prompting, Feministisch (teilweise) | AAAI-Beitrag 2024, arXiv-Langfassung als stabile Kennung |

## Abweichungen und Blocker

- 4KMMPA6A, Metadatenlücke, keine DOI oder stabile Kennung im Text, Titel, Autorschaft und Herausgeber stimmen überein, benötigte Klärung: stabile Kennung aus Zotero bestätigen.
- 4KMMPA6A, Publikationstyp, Praxisleitfaden für Unternehmen mit eigenen Prompting-Tests, Quellenliste und ausgewiesener Autorschaft, als belegter Praxisreport der Hochschule zugelassen, benötigte Klärung: Bestätigung der Zulässigkeit durch die Domänenexpert:innen.
- ET4MMZGH, Metadatenlücke und Publikationstyp, Artikel der Stanford Social Innovation Review ohne DOI, als fachwissenschaftlicher Kommentar mit eigener Quellenbasis (EGAL-Analyse) zugelassen, benötigte Klärung: Bestätigung, dass SSIR-Beiträge unter die Kommentarregel fallen.
- ET4MMZGH, Werkbindung, das Manifest bindet die Records ET4MMZGH und QUV5DQH3 an dieselbe Version, kodiert wurde nur der zugewiesene Text, keine Klärung durch diesen Track nötig.

## Codierregeln mit Auslegungsbedarf

- AN_Gender_Understanding, 7L78MV2V und T8R8RKX9, Paar Binary_Categorical mit Intersectional, beide Werte vergeben, weil die Analyse binär bleibt und zugleich ein kombinationsabhängiges Ergebnis oder Argument zeigt.
- AN_Theory_Reference, 7L78MV2V, Intersektionalität als knapp definiertes Rahmenkonzept des Abschnitts 3.11 als Theoriebezug gewertet.
- AN_Theory_Reference, 4KMMPA6A und M62T5ICP, Lesehinweise (Data Feminism) und Rahmungen der Datenkuratierung (Monokultur, 3Cs) nicht als Theoriebezug gewertet, weil sie die Behandlung von Gender oder Bias nicht rahmen.
- AN_Harm_Types, ET4MMZGH und 4KMMPA6A, allokative Benachteiligungen ohne Einordnung als direkt oder indirekt nicht kodiert, nur das ausgearbeitete Proxy-Beispiel (Gild) als Indirect_Discrimination.
- AN_Bias_Axes, ET4MMZGH, nicht-binäre Personen unter Gender geführt, die Trennung von Sexual_Orientation_Identity ist offen.
- AN_Bias_Definition, M62T5ICP, die Bestimmung von Bias als Parteilichkeit gegenüber Gruppen, Ideen oder Praktiken als ausdrückliche Bestimmung gewertet, obwohl der Report sie zugleich als kulturell variabel relativiert.
- AN_Gender_Definition, M62T5ICP, Gender bei Kategorie teilweise als Absent mit Unclear kodiert statt Not_Applicable, weil der Report Geschlecht mehrfach ausdrücklich anspricht, ohne es zu bestimmen.
- AN_Population, M62T5ICP, General_Social_Work aus der Adressierung sozialer Dienste und der Migrationsberatung, die Zielgruppe gemeinwohlorientierter Organisationen ist breiter.
- AN_Mitigation_Status, 4KMMPA6A, die illustrativen Bildtests mit dem Zusatz 'divers' als Demonstrated statt Evaluated gewertet, weil keine abgeschlossene Prüfung vorliegt.
- Studientyp, M62T5ICP, Empirisch aus der genannten Methode mit Expert:inneninterviews, der Report ist überwiegend konzeptionell.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
