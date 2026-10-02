# codebook-v141-includes-06-6-20261002 · ar1

- Akteur: agent
- Zuweisung: 6IU5JG5Y, GP4JDSI8, UENFDPH9, UFE85SCV, UFJ7ERFF, YLAKP7Z2 (Reihenfolge des Laufmanifests)
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-06-6-20261002/ar1/ar1-coding.json
- Quellenbasis: zugewiesene Volltexte unter docs/data/fulltext/, alle Hashes gegen das Manifest geprüft und vollständig gelesen; Regeln aus assessment/categories.yaml 1.4.1 und den freigegebenen Abschnitten von knowledge/update-protocol.md
- Ergebnis: bestanden
- Verteilung: Include 5 · Unclear 1 · Exclude 0 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 6IU5JG5Y | Fulltext | verified | Include | KI_Sonstige ja, Bias_Ungleichheit ja, Diversitaet ja, Feministisch ja, Fairness ja, AI_Literacies teilweise, Soziale_Arbeit teilweise, Gender teilweise | Thematische Analyse von FAccT- und AIES-Papers mit Workshop-Evaluation, Literaturreview |
| GP4JDSI8 | Fulltext | verified | Include | Generative_KI ja, KI_Sonstige ja, Bias_Ungleichheit ja, Gender ja, Diversitaet ja, Feministisch ja, AI_Literacies teilweise | Text ist die ACM-Verlagsfassung, Manifest nennt version_type unknown |
| UENFDPH9 | Fulltext | provisional | Include | KI_Sonstige ja, Soziale_Arbeit ja, AI_Literacies teilweise, Bias_Ungleichheit teilweise, Diversitaet teilweise | Text enthält weder DOI noch Zeitschriftennamen des Artikels |
| UFE85SCV | Fulltext | verified | Unclear | AI_Literacies ja, KI_Sonstige teilweise, Bias_Ungleichheit teilweise, Gender teilweise, Diversitaet teilweise | Keine soziale Kategorie erreicht ja, daher keine Analysecodierung |
| UFJ7ERFF | Fulltext | provisional | Include | wie GP4JDSI8 | Quelldatei byte-identisch mit GP4JDSI8, Manifest nennt preprint, Text ist die Verlagsfassung |
| YLAKP7Z2 | Fulltext | provisional | Include | Generative_KI ja, Prompting ja, Bias_Ungleichheit ja, Gender ja, Diversitaet ja, Feministisch ja, AI_Literacies teilweise, Fairness teilweise | Text enthält weder DOI noch Zeitschriftennamen des Artikels |

## Abweichungen und Blocker

- UFJ7ERFF · Identität · Die zugewiesene Quelle hat denselben SHA-256 wie die Quelle von GP4JDSI8, obwohl beide Records verschiedene work_id tragen. Das Manifest führt UFJ7ERFF als preprint, der Text ist aber die ACM-Fassung von FAccT '24 mit Veröffentlichungsdatum 3. Juni 2024. Titel und DOI stehen nicht im Konflikt, daher vorläufig codiert und identisch zu GP4JDSI8 · Klärung, ob beide Works zusammengeführt werden oder ob für UFJ7ERFF eine eigene Preprint-Quelle gebunden werden muss.
- GP4JDSI8 · Metadaten · Manifest nennt version_type unknown, der Text ist die Verlagsfassung mit DOI 10.1145/3630106.3658543 · Versionstyp im Work-Version-Register nachtragen.
- UENFDPH9, YLAKP7Z2 · Identität · Die Texte enthalten keine DOI und keinen Zeitschriftennamen des Artikels selbst, Titel, Autor:innen und Jahr stimmen · DOI aus Zotero gegen die Quelle bestätigen.
- UFE85SCV · Entscheidung · Der Lauf ist als Include-Batch angelegt, die Quelle trägt nach den Schwellen nur Unclear. Gender erscheint als eine kurze Teilkategorie der Synthese und als Diskussionssatz, sozioökonomische Ungleichheit als einzelner Diskussionspunkt, Soziale Arbeit fehlt · fachliche Prüfung, ob die frühere Include-Entscheidung auf einer anderen Lesart der Gender- oder Diversitätskategorie beruht.

## Codierregeln mit Auslegungsbedarf

- AN_Mitigation_Status · 6IU5JG5Y · Der Workshop mit KI-Fachleuten bewertete Zwischenfassungen der Empfehlungen auf Umsetzbarkeit, nicht die Wirkung einer angewandten Maßnahme. Gewählt Proposed, Evaluated wäre bei weiter Lesart der Source-review clarification vertretbar.
- AN_Bias_Axes, AN_Harm_Types · 6IU5JG5Y · Die Wohlfahrtsskandale in den Niederlanden und Frankreich sowie Gender Shades sind zitierte Fälle. Achsen wurden nur aus dem eigenen ausgeführten Beispiel der Einleitung codiert, Schadensarten nach der Regel von 1.4.1 auf None gesetzt.
- AN_Bias_Definition · 6IU5JG5Y · Explicit über die ausdrücklich übernommene Bestimmung von Ungerechtigkeit nach Young, die das Werk als Maßstab für soziale Gerechtigkeit setzt.
- AN_Bias_Definition · GP4JDSI8, UFJ7ERFF · Explicit über die übernommene Bestimmung von Macht als strukturelle Privilegierung und systematische Benachteiligung; Bias als Wort wird nicht eigens definiert.
- AN_Harm_Types · GP4JDSI8, UFJ7ERFF · Indirect_Discrimination stützt sich auf das in Prinzip 1 ausgeführte Mieterscreening-Beispiel mit Belegen aus der Literatur. Gewertet als eigenes Arbeitsbeispiel, nicht als bloß zitierter Fall.
- Fairness · GP4JDSI8, UFJ7ERFF · nein, weil das Werk keine algorithmischen Fairnesskriterien, Metriken oder faire Systemgestaltung behandelt, obwohl es auf der FAccT erschien.
- AN_Harm_Types, AN_Bias_Axes · UENFDPH9 · Das Synthesethema Data and Algorithmic Injustice zählt unterrepräsentierte Gruppen und Folgen wie Ausschluss und Stigmatisierung nur auf. Gewählt jeweils None, Erasure wäre bei weiter Lesart der Review-Regel möglich.
- AN_Theory_Reference · UENFDPH9 · Yes, weil das Triple Mandate und Taylors Data-Justice-Rahmen das Element Nondiscrimination des Modells rahmen. Die Rahmung betrifft Bias nur über dieses Element.
- AN_Population · UENFDPH9 · General_Social_Work, Kinder- und Jugendhilfe ist ein Befund über die gesichtete Literatur, nicht das Handlungsfeld des Modells.
- AN_Gender_Definition · YLAKP7Z2 · Explicit über Fußnote 2, die die eigene Begriffsverwendung von Geschlecht als heteronormative Repräsentation festlegt.
- AN_Bias_Definition · YLAKP7Z2 · Explicit über die übernommene Bestimmung von Machtsystemen nach Guillaumin und die Intersektionalitätsbestimmung in Abschnitt 2.2.
- Studientyp · YLAKP7Z2 · Empirisch statt Experimentell, weil die Promptkontraste einer interpretativen Bildanalyse dienen und kein kontrollierter Vergleich vorliegt.
- AN_Harm_Types · YLAKP7Z2 · Toxicity nicht codiert, weil der Kodex sie an Sprache bindet und das Werk gewaltvolle Bildsymbole beschreibt.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
