# codebook-v141-recode-01-6-20261002, AI Agent Review

- Akteur: agent, Rolle ai-agent-review, Prompt `prompts/prism-ai-agent-review-v0.4.md`
- Codebuch: 1.4.1, Reviewer-Prompt der Tracks 1.4
- Eingaben: `tracks/ar1-coding.json` und `tracks/ar2-coding.json`, beide PRISM-Tracks und Berichte, die sechs zugewiesenen Volltexte unter `docs/data/fulltext/`, alle Hashes gegen das Manifest geprüft
- Ausgabe: `ai-agent-review.json`
- Ergebnis: Validator bestanden (`PASS AI-agent review: 6 records`)
- Verteilung: agreed 1, resolved 5, blocked 0, Entscheidungen Include 6, Unclear 0, Exclude 0

Alle sechs Quellen wurden vollständig gelesen. Jede Kategorie- und Analysebelegstelle beider Pakete kommt in der zugewiesenen Quelle zusammenhängend vor. Zwei Belegstellen zu SQYLQFRU stimmen erst nach der Leerraumnormalisierung des Validators überein, weil die HTML-Extraktion Tabellenverweise auf eigene Zeilen setzt. Beide Tracks leiten für alle Werke Include ab, und die Review bestätigt diese Entscheidungen. Unterschiede allein in der Reihenfolge von Listenwerten gelten als übereinstimmend.

## Records

| Paper-ID | Ergebnis | Entscheidung | aufgelöste Felder |
|---|---|---|---|
| 4KMMPA6A | resolved | Include | AN_Harm_Types |
| 7L78MV2V | resolved | Include | Diversitaet, Feministisch |
| ET4MMZGH | resolved | Include | AN_Harm_Types |
| M62T5ICP | resolved | Include | KI_Sonstige, Feministisch, AN_Bias_Axes, AN_Harm_Types, AN_Population |
| SQYLQFRU | agreed | Include | keine |
| T8R8RKX9 | resolved | Include | Feministisch |

## Auflösungen

- 4KMMPA6A, AN_Harm_Types ohne Indirect_Discrimination. Die Stellenanzeigen-Passage in Abschnitt 4.7 ist ein konditionales Beispiel zu generiertem Anzeigentext und keine Allokation oder Entscheidung über Personen, der Mechanismus bleibt unter Exclusionary_Norms erfasst.
- 7L78MV2V, Diversitaet ja. Die Repräsentation demografischer Gruppen, Sprachen und Kulturen in Trainingskorpora trägt die Hälfte der Argumentation (Abschnitte 2.3 und 2.4) und kehrt im Fazit als Forderung nach mehr Diversität wieder.
- 7L78MV2V, Feministisch teilweise. Abschnitt 3.11 definiert Intersektionalität und führt ein eigenes Beispiel aus, bleibt aber einer von elf Inventarabschnitten.
- ET4MMZGH, AN_Harm_Types ohne Derogatory_Language. Die eigene Wirkungskategorie spricht von „derogatory and offensive treatment or erasure“, ihr einziges Beispiel, die binäre Geschlechtsklassifikation, belegt nur Erasure.
- M62T5ICP, KI_Sonstige teilweise. Der Bericht argumentiert selbst über die Datensatzgeschichte des maschinellen Lernens (ImageNet, WordNet) und führt einen Anhang zu ML und Computer Vision, die Belegstelle des zitierten Kinderschutzfalls wurde durch eigene Passagen ersetzt.
- M62T5ICP, Feministisch nein. „patriarchal“ steht einmal im Vorwort und wird nicht entwickelt.
- M62T5ICP, AN_Bias_Axes mit Physical_Appearance, ohne Gender. Das unzitierte Beispiel „dumb“ und „blonde“ ist ein eigenes ausgeführtes Beispiel, die Gender-Stellen sind zitierte Fälle oder eine Bemerkung zur Pronomenmehrdeutigkeit.
- M62T5ICP, AN_Harm_Types mit Misrepresentation. Der eigene Interviewbefund, regionale Kulturen würden von äußeren Stimmen dekontextualisiert, mit dem Sutra-Beispiel trägt den Wert.
- M62T5ICP, AN_Population General_Social_Work. Das Vorwort adressiert soziale Dienste ausdrücklich, und beide Tracks codieren Soziale_Arbeit teilweise und die Beratungsaufgabe aus denselben Passagen.
- T8R8RKX9, Feministisch ja. Die intersektionale Analyse ist eine der drei Forschungsfragen und ein Hauptergebnis, die Diskussion bindet sie an strukturelle Machtungleichheit.

## Markierungen für die Domänenexpert:innen

- 4KMMPA6A, Publikationstyp. Praxisleitfaden eines Hochschulprojekts für Unternehmen, vorläufig als wissenschaftliche graue Literatur zugelassen, ohne DOI oder stabile Kennung.
- ET4MMZGH, Publikationstyp. Kommentar in der Stanford Social Innovation Review ohne DOI, vorläufig nach der Kommentarregel auf Grundlage der eigenen Systemauswertung zugelassen.
- M62T5ICP, Handlungsfeld. General_Social_Work und Soziale_Arbeit stützen sich auf das Vorwort, der Hauptteil richtet sich an gemeinwohlorientierte Organisationen allgemein.

## Offene Codierregeln

- AN_Gender_Understanding, 7L78MV2V und T8R8RKX9, das Paar Binary_Categorical mit Intersectional bleibt im Codebuch offen und wurde von beiden Tracks gleich vergeben.
- AN_Harm_Types, 4KMMPA6A und ET4MMZGH, allokative Benachteiligungen ohne Einordnung als unmittelbar oder mittelbar bleiben unkodiert, soweit kein eigenes Proxy-Argument vorliegt.
- AN_Bias_Axes, ET4MMZGH, nicht-binäre Personen stehen unter Gender, die Abgrenzung zu Sexual_Orientation_Identity ist offen.

## Autoritätsgrenze

Die Übereinstimmung der beiden Tracks ist eine Prozessdiagnose. Beide Tracks liefen auf demselben Modell wie diese Review, ihre Übereinstimmung ist daher keine Reliabilitätsschätzung. Die Review begründet höchstens den internen Status `ai-agent-reviewed` und ersetzt weder die Stichprobenprüfung durch Domänenexpert:innen noch eine personengebundene Freigabe.
