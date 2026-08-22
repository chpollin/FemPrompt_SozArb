# Evidenz- und Daten-Audit `ea`

## Persona und Vorgehen

Die Prüfung erfolgte als forensische Evidenz- und Daten-Auditorin ausschließlich am jeweiligen Volltext. Frühere Expert:innen-, LLM- und Akzeptanzurteile blieben geschlossen. Eine positive Kategorie erhielt mindestens eine präzise angeheftete Passage. Stufe 2 bezeichnet einen direkten substanziellen Bezug, Stufe 1 einen belastbaren Kontextbezug und Stufe 0 einen fehlenden Bezug. Analyse-Codes wurden aus Volltext und kontrolliertem Vokabular abgeleitet; mögliche Überinterpretationen sind als Unsicherheit ausgewiesen.

Das Kürzel `ea` wurde sichtbar eingegeben. Alle zehn Fälle wurden nach Aktualisierung des Volltext-Publishers über `prisma.html?trial=1&paper=<ID>` geladen, fachlich im sichtbaren PRISM-Frontend bearbeitet und über das Diskettensymbol gespeichert. Die Vergleichssektion blieb geschlossen.

## Zehn Entscheidungen

Technischer Vektor in der Reihenfolge `AI_Literacies / Generative_KI / Prompting / KI_Sonstige`; sozialer Vektor in der Reihenfolge `Soziale_Arbeit / Bias_Ungleichheit / Gender / Diversitaet / Feministisch / Fairness`.

| Paper-ID | Technik | Sozial | Entscheidung | Begründung |
|---|---:|---:|---|---|
| `Z4YXX9PZ` | `0/2/2/0` | `0/2/2/2/0/2` | Include | Experimentelle Prüfung von Promptvarianten gegen soziale Stereotype |
| `AIGLDZ4C` | `2/2/2/0` | `0/2/2/2/0/0` | Exclude | `Wrong_publication_type`, Override gesetzt |
| `I78CL6R5` | `2/1/1/2` | `0/2/0/2/0/2` | Include | Empirischer Co-Design eines AI-Literacy-Rahmens |
| `J9IZDVTW` | `2/0/0/2` | `0/1/0/0/0/2` | Include | AI-Literacy-Erhebung mit Fairness als Kerndimension |
| `CLKAD87H` | `2/2/2/0` | `0/2/1/1/0/2` | Include | Evaluierter Recommender für verantwortliches Prompting |
| `CY5IMM6G` | `2/1/0/2` | `2/2/0/2/1/2` | Include | AI-Literacy-Rahmen für die Soziale Arbeit |
| `EHQBHVYV` | `0/2/2/0` | `0/2/0/2/2/2` | Include | Review zu Prompting gegen Arab/Muslim-Bias |
| `ZLMLP53P` | `0/1/0/2` | `0/2/2/2/2/2` | Include | Organisationsfallstudie zu queer-intersektionaler KI-Praxis |
| `UBYTNGNV` | `0/1/0/2` | `0/2/2/2/1/2` | Include | Gendergleichheit und Diskriminierung im AI Act |
| `JZN2I6J5` | `0/2/2/2` | `0/2/2/1/0/2` | Include | Experimentelles Soft-Prompt-Tuning gegen Gender-Bias |

Verteilung ist neun Includes, ein Exclude und kein offener Fall.

## Fallbezogene Begründung und stärkste Passagen

- `Z4YXX9PZ` vergleicht zwölf Promptvarianten in fünf Sprachmodellen und neun Bias-Kategorien. Belegt durch “12 different prompting techniques including CoT, System 1, System 2, and Persona” sowie “gender bias improvement of up to 9 percent across various models.”
- `AIGLDZ4C` behandelt inklusive Bildprompts und stereotype Ausgaben direkt, ist jedoch durch “Blog»AI” und “9 min read” als Blog ausgewiesen. Der Inhaltsbeleg lautet “They erase people, reinforce biases, and exclude audiences.”
- `I78CL6R5` entwickelt mit 30 Lehrkräften einen noch nicht feldevaluierten AI-Literacy-Rahmen. Belegt durch “students need to learn how to prompt effectively” und “fairness and biases; trust and transparency; accountability; social benefit”.
- `J9IZDVTW` erhebt AI Literacy bei 66 Doktorand:innen. Belegt durch “four dimensions: cognitive, operational, critical and ethical” und “encompassing transparency, fairness, responsibility”.
- `CLKAD87H` untersucht mit zehn Interviews und 20 Nutzungssitzungen einen Responsible-Prompting-Recommender. Belegt durch “support novice prompt engineers and raise awareness about RAI in prompting-time” und “generated classes are fair, balanced, and representative.”
- `CY5IMM6G` überträgt AI Literacy auf mehrere Handlungsfelder der Sozialen Arbeit. Belegt durch “AI literacy among social workers” und “algorithmic biases can perpetuate systemic oppression through data, design, and deployment choices.”
- `EHQBHVYV` synthetisiert acht Studien zu Prompting gegen Arab/Muslim-Bias. Belegt durch “cultural prompting, affective priming, self-debiasing techniques, structured multi-step pipelines” und “associating these groups with terrorism, violence, or religious extremism”.
- `ZLMLP53P` dokumentiert community-geführte queer-intersektionale KI-Praxis. Belegt durch “intersectionality as critical inquiry and praxis” und “computational approaches to fairness can reinforce”.
- `UBYTNGNV` analysiert den AI Act aus Gendergleichheits- und Nichtdiskriminierungsperspektive. Belegt durch “through the lens of gender equality” und “appropriate measures to detect, prevent and mitigate possible biases”.
- `JZN2I6J5` evaluiert Soft-Prompt-Tuning für BERT und RoBERTa mit SEAT und StereoSet. Belegt durch “a novel prompt-tuning method for reducing biases” und “particularize this method to gender bias”.

## Gemeinsame Fälle

Die neun Includes bilden die gemeinsame inhaltliche Gruppe. Jeder Beitrag verbindet einen belastbaren KI-, Prompting- oder AI-Literacy-Bezug mit Bias, Fairness oder Diversität. `AIGLDZ4C` erfüllt diese inhaltliche Verbindung ebenfalls, scheitert jedoch ausschließlich am Publikationstyp. Eine Übereinstimmung mit fremden Reviewer:innenurteilen wurde methodisch nicht erhoben.

## Wichtigste Grenzfälle

- `J9IZDVTW` stützt den Include auf Fairness als gemessene ethische Kompetenzdimension. Konkrete Bias-Achsen und eine Intervention fehlen.
- `CLKAD87H` ist hinsichtlich Nutzbarkeit und wahrgenommener RAI-Verbesserung evaluiert. Ein direkter Bias-Benchmark fehlt.
- `CY5IMM6G` erhält `Feministisch=1` aufgrund der expliziten antirassistischen, intersektionalen und machtbezogenen Perspektive. Gender ist keine eigene Analyseachse.
- `EHQBHVYV` umfasst acht heterogene englischsprachige Studien. Metriken sind nicht direkt vergleichbar; die Sammelkategorie Arab/Muslim kann Gruppenunterschiede verdecken.
- `ZLMLP53P` erhält `Demonstrated`, da umgesetzte Programme und Nutzungsdaten vorliegen. Eine kontrollierte Wirkungsprüfung fehlt.
- `UBYTNGNV` erhält `Feministisch=1` für die strukturelle Gendergleichheitsperspektive. Eine explizite feministische Theorie wird nicht entwickelt.
- `JZN2I6J5` verwendet gelernte Soft Prompts, für die das Analysevokabular keinen Technik-Code enthält. `AN_Prompt_Techniques=None` ist deshalb in den Notizen erklärt.

## Konkrete UI- und Workflow-Befunde

1. Der Trial-Modus erlaubt die sichtbare Bearbeitung ohne Ordnerdialog. Reproduktion erfolgt durch direkten Aufruf der Trial-URL, Eingabe von `ea`, vollständige Erfassung und Klick auf das Diskettensymbol.
2. Nach dem Speichern springt die Oberfläche zum nächsten offenen Corpus-Paper. Für die vorgegebene Reihenfolge muss die direkte URL des nächsten Zielpapers erneut geöffnet werden.
3. Der Trial-Modus besitzt keinen sichtbaren JSON-Export. Im isolierten Browser-Ausführungskontext stehen `window.__PRISMA_TEST__`, `window.EC` und `localStorage` auch read-only nicht bereit. Die sichtbar gespeicherten Werte wurden daher serialisiert; nur die Zeitstempel wurden auf einen gemeinsamen Exportzeitpunkt normalisiert.
4. Bei `AIGLDZ4C` liefen direkte Checkbox-Aktionen am sichtbaren Override-Feld in ein Timeout. Der Klick auf die sichtbare Beschriftung „Override zu Exclude“ setzte den Wert zuverlässig.
5. Bei `CLKAD87H` stimmen die Autor:innen-Metadaten nach erneutem Laden nicht mit dem Titelblatt des korrekt zugeordneten Volltexts überein.
6. „Überarbeiten“ führte beim gesperrten Exclude-Record in zwei Versuchen zu keiner sichtbaren Zustandsänderung und zeigte keinen Fehlerhinweis.

## Textgrundlagen

Grundlage waren ausschließlich die aktuellen Dateien `docs/data/fulltext/<ID>.md` der zehn Ziel-IDs und die darin sichtbaren PRISM-Volltexte. Alle positiven Kategorien besitzen manuell angeheftete Belege mit `origin="human"`. Insgesamt wurden 65 von 65 Snippets als exakte, groß-/kleinschreibungsunabhängige Teilzeichenfolgen der aktuellen Volltexte bestätigt.

## Selbstprüfung und Validierung

- `ea.json` entspricht `femprompt-prisma-reviewer/0.3` und enthält exakt zehn vollständige Zielrecords.
- Alle neun Includes besitzen vollständige Analysepflichtfelder, kontrollierte Werte und `AN_Coding_Basis="Fulltext"`.
- Der Exclude besitzt `reason="Wrong_publication_type"` und den erforderlichen Override.
- Die Muss-Prüfung für IDs, Kategorieniveaus, Beleggates, Entscheidungsableitung, Reviewer, Textquelle und Analysefelder bestand ohne Fehler.
- Die lokale Testsuite bestand mit `109/109` PRISM-Tests und `15/15` Companion-Smoke-Tests.
- Der PRISM-Navigator bestätigte `9/1/0`; alle zehn Fälle wurden sichtbar bearbeitet und gespeichert.

Gesamtergebnis `PASS`.
