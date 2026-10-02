# codebook-v141-recode-02-6-20261002, AI Agent Review

- Akteur: agent, Reviewer ai-agent-review, Claude Code subagent auf claude-opus-5-5
- Prompt: prompts/prism-ai-agent-review-v0.4.md, Codebuch assessment/categories.yaml 1.4.1, Reviewer-Prompt der Tracks 1.4
- Eingaben: tracks/ar1-coding.json und tracks/ar2-coding.json mit den Hashes des Manifests, sechs Volltexte unter docs/data/fulltext/, jeweils vollständig gelesen und gegen die Manifesthashes geprüft
- Ausgabe: ai-agent-review.json
- Validator: `PASS AI-agent review: 6 records`
- Ergebnis: 3 agreed, 3 resolved, 0 blocked
- Verteilung: Include 5, Unclear 1, Exclude 0

Die Prüfung erfolgte unabhängig von der früheren Kodierung nach ADR-046. Die in `recode_of` gebundenen Annotationen wurden nicht geöffnet.

## Records

| Paper-ID | Ergebnis | Entscheidung | Identität | Unterschiede |
|---|---|---|---|---|
| 6TAA76Q4 | agreed | Unclear | verified | keine |
| 7VFNS5R3 | resolved | Include | provisional | KI_Sonstige, AN_Task |
| 8JR5AGRG | resolved | Include | verified | KI_Sonstige, AN_Bias_Axes, AN_Gender_Understanding, AN_Mitigation_Status |
| 8MRNK6FX | resolved | Include | provisional | Fairness, AN_Bias_Axes |
| HDXTRBUK | agreed | Include | verified | keine |
| JFDBPUBN | agreed | Include | verified | keine |

Alle Belegstellen beider Tracks und alle Fundstellen in `analysis_evidence` stehen zeichengetreu in der zugewiesenen Quelle. Die Belege beider Tracks wurden im finalen Record zusammengeführt. Freitextnotizen wurden aus beiden Tracks zu einer quellengebundenen Notiz verdichtet und gelten nicht als Kodierunterschied.

## Auflösungen

- 7VFNS5R3, KI_Sonstige, ar1 ja, ar2 teilweise, gewählt ja. Maschinelles Lernen mit KNN, Klassifikation und Clustering ist der zentrale Kursinhalt und Gegenstand der ersten Forschungsfrage.
- 7VFNS5R3, AN_Task, ar1 None, ar2 Teaching_Further_Education, gewählt None. KI ist Lerninhalt des Kurses und kein Werkzeug für eine Aufgabe, der Bildungskontext steht bereits in AN_Population.
- 8JR5AGRG, KI_Sonstige, ar1 teilweise, ar2 nein, gewählt teilweise. Der Abschnitt zu den Quellen algorithmischen Bias behandelt nicht generative Systeme ausdrücklich als nachgeordneten Aspekt.
- 8JR5AGRG, AN_Bias_Axes, gewählt mit Intersectional. Studie 3 berichtet Berufszuschreibungen, die von der Kombination aus Geschlecht und Kultur abhängen, etwa für Zulu-Frauen andere als für britische Frauen und Zulu-Männer.
- 8JR5AGRG, AN_Gender_Understanding, gewählt Binary_Categorical mit Intersectional, weil Intersectional der Regel in AN_Bias_Axes folgt und die Analyse binär bleibt.
- 8JR5AGRG, AN_Mitigation_Status, ar1 Evaluated, ar2 Proposed, gewählt Proposed. Der RLHF-Befund ist ein Vergleich dreier verschiedener Modelle und isoliert keine Maßnahme, alle eigenen Maßnahmen sind Empfehlungen.
- 8MRNK6FX, Fairness, ar1 nein, ar2 teilweise, gewählt teilweise. Das Werk argumentiert ausdrücklich mit der Fairness des Systems und schlägt eine Umgestaltung von Daten und Training vor.
- 8MRNK6FX, AN_Bias_Axes, ar1 Socioeconomic, ar2 None, gewählt Socioeconomic. Der Satz zu wirtschaftlich benachteiligten Gruppen ist das eigene, nicht zitierte Beispiel des Werks, aus dem beide Tracks auch Disparate_Performance ableiten.

## Für Domänenexpert:innen markiert

- 6TAA76Q4, die Neukodierung ergibt Unclear für ein zuvor als Include kodiertes Werk, offen ist, ob der Gender-Gap der Nutzung oder die Bildungs- und Berufsgradienten das ja-Niveau erreichen.
- 7VFNS5R3, die Maßnahmencodes beruhen auf einem Kurs gegen eine Geschlechterlücke beim KI-Lernen statt gegen algorithmischen Bias, AN_Task für einen AI-Literacy-Kurs ist ein Grenzfall der Pilotwerte.
- 8JR5AGRG, Intersectional trotz der Limitation, die intersektionale Analyse als offenen Bedarf nennt, damit auch das offene Paar Binary_Categorical mit Intersectional, sowie Proposed für den RLHF-Vergleich.
- 8MRNK6FX, Socioeconomic aus einem einzelnen Beispielsatz an der Grenze des Ankers VSZM7CT6, Direct_Discrimination für eine vom Werk nicht klassifizierte allokative Benachteiligung, Identität ohne DOI, Venue und Jahr vorläufig.
- HDXTRBUK, Theory_Reference Yes über Braidottis kritischen Posthumanismus an der offenen Grenze zwischen rahmendem Konzept und illustrierender Erwähnung, das Werk trägt zudem den Record VSZM7CT6, den Grenzanker des Codebuchs für AN_Bias_Axes.
- JFDBPUBN, Social_Construct zusammen mit Binary_Categorical auf Grundlage einer Begriffsbestimmung bei binärer Auswertung nach Ausschluss der Gruppe divers, offene Schwelle für Social_Construct.

## Selbstprüfung

- Record-IDs entsprechen exakt den zugewiesenen Paper-IDs: ja
- alle positiven Kategorien und Fundstellen zeichengetreu belegt: ja
- alle Includes vollständig analysiert: ja
- Validator bestanden: ja
- Manifest, Pakete und Tracks unverändert: ja
