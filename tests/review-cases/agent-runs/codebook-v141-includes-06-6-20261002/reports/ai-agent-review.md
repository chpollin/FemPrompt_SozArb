# codebook-v141-includes-06-6-20261002, AI Agent Review

- Akteur: agent (ai-agent-review)
- Prompt: prompts/prism-ai-agent-review-v0.4.md
- Codebuch: assessment/categories.yaml 1.4.1
- Eingaben: tracks/ar1-coding.json, tracks/ar2-coding.json, tracks/ar1.json, tracks/ar2.json, reports/ar1.md, reports/ar2.md
- Quellen: sechs zugewiesene Volltexte unter docs/data/fulltext/, Hashes gegen das Manifest geprüft und vollständig gelesen
- Artefakt: ai-agent-review.json
- Validator: PASS AI-agent review: 6 records
- Ergebnis: 2 agreed, 4 resolved, 0 blocked
- Entscheidungen: Include 5, Unclear 1, Exclude 0

## Records

| Paper-ID | Ergebnis | Entscheidung | Aufgelöste Felder |
|---|---|---|---|
| 6IU5JG5Y | agreed | Include | keine |
| GP4JDSI8 | resolved | Include | Generative_KI, AN_Bias_Definition |
| UENFDPH9 | resolved | Include | AN_Harm_Types |
| UFE85SCV | agreed | Unclear | keine |
| UFJ7ERFF | resolved | Include | Generative_KI, AN_Bias_Definition |
| YLAKP7Z2 | resolved | Include | Fairness, AN_Bias_Definition |

Alle Kategorie- und Analysebelege beider Tracks stehen zeichengetreu in der Quelle, Abweichungen betreffen nur Zeilenumbrüche. Unterschiede, die allein die Reihenfolge mehrwertiger Felder betreffen (AN_Bias_Axes und AN_Harm_Types bei GP4JDSI8 und UFJ7ERFF, AN_Task bei UENFDPH9), sind keine inhaltlichen Abweichungen.

## Auflösungen

- GP4JDSI8 und UFJ7ERFF, Generative_KI teilweise. Das Werk behandelt KI-Forschung insgesamt, prädiktive und generative KI nebeneinander, generative Modelle bilden einen wiederkehrenden, aber nachgeordneten Strang. KI_Sonstige ja trägt die Technikdimension.
- GP4JDSI8 und UFJ7ERFF, AN_Bias_Definition Implicit_Only. Die übernommene Definition in Prinzip 1 bestimmt Macht als strukturelle Privilegierung und Benachteiligung, nicht Bias, Diskriminierung oder Unfairness. Das Bias-Verständnis ist nur aus der Rahmung erkennbar.
- UENFDPH9, AN_Harm_Types None. Der Syntheseabschnitt „Data and Algorithmic Injustice“ ist ein allgemeines Ungerechtigkeitsthema und reiht zitierte Folgen aneinander. Keine Schadensart strukturiert die Synthese als Abschnitt, Tabellenzeile oder Kategorie, die Unsichtbarkeit stammt aus zitierten Studien.
- YLAKP7Z2, Fairness teilweise. Die eigenen Empfehlungen folgen dem Konzept der algorithmic reparation als Grundlage für Bau, Bewertung und Anpassung von ML-Systemen, mit gezielter Intervention und kuratierten Trainingsdaten. Das ist eine nachgeordnete Behandlung fairer Systemgestaltung.
- YLAKP7Z2, AN_Bias_Definition Implicit_Only. Die Passagen nach Guillaumin und zur Intersektionalität bestimmen Machtsysteme, das Werk setzt „biases“ in Anführungszeichen und bestimmt den Begriff nicht.

## Identität und Werkbindung

- UFJ7ERFF und GP4JDSI8 sind an byte-identische Quelldateien gebunden, die ACM-Fassung von FAccT 2024 mit DOI 10.1145/3630106.3658543. Das Manifest führt sie als zwei Works, UFJ7ERFF mit dem Versionstyp preprint und GP4JDSI8 mit unknown. Titel, Autor:innen, Jahr und DOI widersprechen dem Korpus nicht, die Codierung des Textes ist daher gültig und die Identität von UFJ7ERFF bleibt provisional. Vor der Synthese ist eine Operatorentscheidung nötig, ob beide Works zusammengeführt werden und welche Version UFJ7ERFF bindet, damit dieselbe Publikation nicht doppelt zählt.
- UENFDPH9 und YLAKP7Z2 bleiben provisional, weil der Text weder DOI noch Zeitschriftennamen nennt. Titel, Autor:innen und Daten stimmen.

## Markierungen für Domänenexpert:innen

- UFE85SCV: Unclear in einem Include-Batch, die soziale Dimension erreicht nur teilweise.
- GP4JDSI8: Grenze zwischen übernommener Machtdefinition und Bias-Bestimmung, Stufe von Generative_KI.
- UFJ7ERFF: dieselben Fragen wie GP4JDSI8, dazu die mögliche Werkdublette.
- YLAKP7Z2: Grenze bei AN_Bias_Definition, Fairness teilweise über algorithmic reparation, AN_Gender_Definition Explicit aus einer terminologischen Fußnote.
- UENFDPH9: Reichweite der Review-Regel für AN_Harm_Types.
- 6IU5JG5Y: AN_Bias_Definition Explicit über Youngs Bestimmung von Ungerechtigkeit, Konsistenz mit den Implicit_Only-Auflösungen prüfen.

## Selbstprüfung

- Records entsprechen exakt den zugewiesenen Paper-IDs: ja
- jeder Unterschied ist mit beiden Trackwerten, gewähltem Wert und Begründung dokumentiert: ja
- kein Wert, den beide Tracks teilen, wurde überschrieben: ja
- alle finalen Belege und Fundstellen stehen in der Quelle: ja
- Validator bestanden: ja
- Manifest, Pakete und Tracks unverändert, nichts committet: ja
