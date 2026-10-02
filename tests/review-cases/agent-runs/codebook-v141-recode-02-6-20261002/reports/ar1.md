# codebook-v141-recode-02-6-20261002, ar1

- Akteur: agent
- Zuweisung: 6TAA76Q4, 7VFNS5R3, 8JR5AGRG, 8MRNK6FX, HDXTRBUK, JFDBPUBN
- Coding-Paket: tmp/agent-runs/codebook-v141-recode-02-6-20261002/ar1/ar1-coding.json
- Quellenbasis: zugewiesene Volltexte unter docs/data/fulltext/, jeweils vollständig gelesen, Hashes vom Validator gegen das Manifest geprüft
- Ergebnis: bestanden
- Verteilung: Include 5, Unclear 1, Exclude 0, Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 6TAA76Q4 | Volltext, NBER Working Paper 34255 | verified | Unclear | Generative_KI ja, Prompting teilweise, Bias_Ungleichheit teilweise, Gender teilweise | Geschlechterlücke der Nutzung ist ein Unterabschnitt der deskriptiven Nutzungsanalyse, keine Sozialkategorie erreicht ja |
| 7VFNS5R3 | Volltext | provisional | Include | AI_Literacies ja, KI_Sonstige ja, Gender ja, Bias_Ungleichheit teilweise, Diversitaet teilweise | DOI und Jahr fehlen im Text |
| 8JR5AGRG | Volltext, UNESCO/IRCAI Issue Brief | verified | Include | Generative_KI ja, Bias_Ungleichheit ja, Gender ja, Diversitaet ja, Prompting, AI_Literacies, KI_Sonstige, Feministisch, Fairness teilweise | Policy-Report mit eigenen Studien, nach Publikationstypregel zulässig |
| 8MRNK6FX | Volltext | provisional | Include | Generative_KI ja, Soziale_Arbeit ja, Bias_Ungleichheit ja, KI_Sonstige, AI_Literacies, Diversitaet teilweise | DOI, Venue und Jahr fehlen im Text |
| HDXTRBUK | Volltext, Accepted Manuscript | verified | Include | KI_Sonstige ja, Soziale_Arbeit ja, AI_Literacies teilweise, Bias_Ungleichheit teilweise | Titel weicht nur in der Großschreibung ab |
| JFDBPUBN | Volltext, Projektbericht FH Bielefeld | verified | Include | AI_Literacies ja, KI_Sonstige ja, Gender ja, Bias_Ungleichheit ja, Diversitaet, Feministisch, Fairness teilweise | Projektbericht mit DOI, nach Publikationstypregel zulässig |

## Abweichungen und Blocker

- 7VFNS5R3, Identität, der konvertierte Text enthält weder DOI noch Erscheinungsjahr, Titel, Autoren und Zeitschrift stimmen, Metadatenabgleich gegen den Zotero-Datensatz.
- 8MRNK6FX, Identität, der konvertierte Text enthält weder DOI noch Venue noch Jahr, Titel und Autor stimmen, Metadatenabgleich gegen den Zotero-Datensatz.
- 6TAA76Q4, Entscheidung Unclear, das Manifest führt den Datensatz als Recode einer früheren Kodierung, die Ableitung ergibt hier keine Include-Schwelle, Klärung durch AI Agent Review und gegebenenfalls Domain-Expert:innen.
- Keine Blocker.

## Codierregeln mit Auslegungsbedarf

- Gender, 6TAA76Q4, die Geschlechterlücke der Nutzung steht im Abstract und unter den acht Befunden, bleibt aber ein deskriptiver Unterabschnitt (Namensanalyse), gewählt teilweise.
- AN_Mitigation_Stage und AN_Mitigation_Status, 7VFNS5R3, der Kurs verringert eine Geschlechterlücke im KI-Lernen und nicht algorithmischen Bias, Organisational_Process und Evaluated sind auf diese Schulung und ihr eigenes Prä-Post-Ergebnis beschränkt.
- AN_Task, 7VFNS5R3 und JFDBPUBN, KI als Lerninhalt beziehungsweise Einstellungsbefragung ohne Aufgabe, die mit KI erledigt wird, gewählt None.
- AN_Bias_Axes Intersectional, 8JR5AGRG, Studie 3 berichtet je nach Kombination von Geschlecht und Kultur unterschiedliche Berufszuschreibungen, das Werk nennt intersektionale Analyse selbst als Limitation, gewählt Intersectional, Paar Binary_Categorical mit Intersectional in AN_Gender_Understanding.
- AN_Mitigation_Status, 8JR5AGRG, Evaluated stützt sich nur auf den Modellvergleich RLHF gegen nicht RLHF-trainierte Modelle, alle übrigen Empfehlungen bleiben Vorschläge.
- AN_Harm_Types, 8JR5AGRG, repetitivere Texte für Frauen und lokale Gruppen als Unterschied in Diversität und Stil nicht als Disparate_Performance codiert.
- AN_Harm_Types, 8MRNK6FX, Leistungsverweigerung „based on their inherent characteristics“ als Direct_Discrimination gelesen, das Werk klassifiziert selbst nicht, Stereotyping-Satz ohne Mechanismus nicht codiert.
- AN_Theory_Reference, HDXTRBUK, Braidottis kritischer Posthumanismus rahmt „persistent inequalities“ unmittelbar vor der Bias-Aussage, gewählt Yes, Grenze zwischen rahmendem Konzept und illustrativer Erwähnung offen.
- AN_Gender_Understanding, JFDBPUBN, binäre Analyse nach Ausschluss von „divers“ bei ausdrücklicher Bestimmung von Gender als sozialem Geschlecht und sozialisationstheoretischer Herleitung der Hypothesen, gewählt Binary_Categorical mit Social_Construct.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
