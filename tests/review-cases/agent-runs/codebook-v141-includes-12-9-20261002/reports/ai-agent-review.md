# codebook-v141-includes-12-9-20261002, AI Agent Review

- Akteur: agent (ai-agent-review), separat beauftragt, an keinem Track beteiligt
- Regelbasis: Prompt `prompts/prism-ai-agent-review-v0.4.md`, Codebuch 1.4.1 (`assessment/categories.yaml`), Reviewer-Prompt 1.4, `knowledge/update-protocol.md` in den Abschnitten Eligibility, Text preparation and source gate, Agent-assisted completion und Analysis coding
- Eingaben: `tracks/ar1-coding.json` und `tracks/ar2-coding.json` mit den Manifest-Hashes, PRISM-Tracks `tracks/ar1.json` und `tracks/ar2.json`, Berichte beider Tracks, alle neun Volltexte unter `docs/data/fulltext/` mit den Manifest-Hashes, jeweils vollständig gelesen
- Ausgabe: `ai-agent-review.json` (`femprompt-prisma-ai-agent-review/0.1`)
- Validator: `PASS AI-agent review: 9 records`
- Ergebnis: 2 agreed, 7 resolved, 0 blocked
- Entscheidungen: Include 5, Unclear 3, Exclude 1

## Records

| Paper-ID | Ergebnis | Entscheidung | Aufgelöste Unterschiede |
|---|---|---|---|
| C325Y32P | resolved | Unclear | Gender nein |
| CYZQ6XPK | resolved | Include | Fairness ja, AN_Prompt_Techniques mit General_Guidance |
| KRUQB7L2 | resolved | Exclude (Not_relevant_topic) | Prompting ja |
| LT3D3ZQ2 | resolved | Include | AN_Bias_Axes None |
| LXKXPD5H | resolved | Include | AN_Task mit Counselling_Client_Communication |
| MTMU9UPJ | resolved | Include | AN_Harm_Types ohne Exclusionary_Norms |
| N7J2ZRFP | agreed | Unclear | keine |
| V4GTLMED | agreed | Include | keine |
| VP6SXQHY | resolved | Unclear | KI_Sonstige teilweise, Fairness nein |

Beide Tracks stimmen in allen neun Entscheidungen überein. Kein Unterschied verändert eine Entscheidung. Alle Belegstellen beider Pakete sind zeichengetreue, zusammenhängende Teilstrings der Quellen. Identität und Publikationstyp sind bei acht Werken verifiziert, bei LXKXPD5H vorläufig.

## Auflösungen

- C325Y32P, Gender: Die einzige Stelle ist eine Anteilsangabe zu frauengeführten Sozialunternehmen aus dem Vorgängerbericht in der Einleitung. Das Papier entwickelt keine Geschlechterperspektive, die Nennung ist beiläufige Demografie im Sinn des Negativbeispiels der Kategorie.
- CYZQ6XPK, Fairness: Eigene Bias-Metrik und evaluierte Debiasing-Strategie stehen im Zentrum der Methode, das trägt `ja`.
- CYZQ6XPK, AN_Prompt_Techniques: Der Debiasing-Prompt ist eine getestete Prompting-Strategie ohne Technikfamilie mit berichtetem Ergebnis und wird als General_Guidance codiert, die Strategie steht in AN_Notes.
- KRUQB7L2, Prompting: Experiment 2 variiert die Prompts, und die vorgeschlagene Abhilfe ist die konfidenzabhängige Promptgestaltung. Prompting ist die zentrale Intervention.
- LT3D3ZQ2, AN_Bias_Axes: Das Werk analysiert keinen Bias. Die Achsen stehen in einer programmatischen Aufzählung dessen, was eine feministische Metaethik untersuchen würde, daher None. AN_Gender_Understanding Intersectional bleibt, weil beide Tracks es codieren und das Argument des theoretischen Werks selbst Privileg und Benachteiligung von der Wechselwirkung abhängig macht.
- LXKXPD5H, AN_Task: Die eigene Fallvignette eines KI-gestützten Chat-Tools für Anträge von Klient:innen trägt Counselling_Client_Communication auf derselben Grundlage, auf der beide Tracks Case_Assessment_Decision_Support aus Vignetten codieren.
- MTMU9UPJ, AN_Harm_Types: Der männliche Default erscheint nur als vorsichtig formulierte Erklärung im Anhang B und ist kein eigenes Ergebnis. Das gemessene Ergebnis ist bereits als Disparate_Performance codiert.
- VP6SXQHY, KI_Sonstige: Der Rahmen gilt KI allgemein und nennt nicht-generative Systeme wie Recruitment Screening und Predictive Maintenance ausdrücklich als Einsatzkontexte.
- VP6SXQHY, Fairness: Fairness steht nur als Aufzählungsglied ethischer Risiken ohne Kriterium, Metrik oder faire Systemgestaltung.

## Markierungen für Domänenexpert:innen

- C325Y32P: Der Lauf gilt eingeschlossenen Werken, die quellengebundene Codierung erreicht keine Sozialkategorie auf `ja`. Die Zielgruppenlesart von Soziale_Arbeit entscheidet zwischen Unclear und Include.
- KRUQB7L2: Keine Sozialkategorie in der Quelle, Exclude mit Not_relevant_topic gegen die frühere Include-Einstufung.
- N7J2ZRFP: Bias nur als referierender Abschnitt einer IR-Agenda, Unclear gegen die frühere Include-Einstufung.
- VP6SXQHY: Bias nur als Teil ethischer AI Literacy in einem Unternehmensrahmen, Unclear gegen die frühere Include-Einstufung.
- LT3D3ZQ2: Grenze zwischen AN_Bias_Axes None und AN_Gender_Understanding Intersectional bei einer programmatischen Agenda ohne Bias-Analyse.
- LXKXPD5H: Autorschaft fehlt im Text, Publikationstyp als Tagungsunterlage mit Literaturempfehlungen ohne Belegapparat ist unter der Publikationstypregel als wissenschaftliche Graue Literatur zu bestätigen.

## Autoritätsgrenze

Die Übereinstimmung der Tracks ist eine Prozessdiagnose. Beide Tracks liefen auf demselben Modell und sind nicht epistemisch unabhängig. Der Review begründet höchstens den internen Status `ai-agent-reviewed`, keine fachliche Verifikation und keine Publikationsfreigabe.
