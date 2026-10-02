# AI Agent Review des Laufs codebook-v141-includes-04-5-20261002

- Akteur: agent, Prüfinstanz ai-agent-review
- Regelgrundlage: Prompt prism-ai-agent-review-v0.4, Codebuch 1.4.1, Reviewer-Prompt 1.4, update-protocol Abschnitte Eligibility, Text preparation and source gate, Agent-assisted completion und Analysis coding einschließlich der Quellenklärung vom 5. September 2026
- Eingaben: Coding-Pakete ar1 und ar2, PRISM-Tracks ar1 und ar2, Berichte beider Tracks und die fünf zugewiesenen Volltexte, deren SHA-256 dem Laufmanifest entspricht
- Ausgabe: ai-agent-review.json im Laufordner
- Validator: PASS AI-agent review: 5 records
- Ergebnis: 3 agreed, 2 resolved, 0 blocked
- Entscheidungen: Include 4, Unclear 1, Exclude 0

## Records

| Paper-ID | Ergebnis | Entscheidung | Unterschiede und Auflösung |
|---|---|---|---|
| 22XEFRWP | agreed | Include | keine |
| 3QUWCYVW | resolved | Include | Feministisch auf nein, Disparate_Performance entfällt |
| 7G78SADI | agreed | Unclear | keine |
| KNQYFQ6B | resolved | Include | Diversitaet auf teilweise |
| PYN6HB3E | agreed | Include | keine |

## Prüfbefunde

Alle Kategorienbelege und Fundstellen in `analysis_evidence` beider Pakete stehen zeichengetreu und zusammenhängend in den zugewiesenen Volltexten. Die finalen Records vereinigen die Belege beider Tracks, wo beide denselben Wert mit unterschiedlichen Passagen stützen. Identität und Publikationstyp tragen bei allen fünf Werken. Bei 22XEFRWP, 3QUWCYVW, 7G78SADI und KNQYFQ6B fehlen DOI und Jahr in der Paper-Ebene, bei KNQYFQ6B zusätzlich das Venue. Titel, Autor:innen und Hash-Bindung stimmen, ein Titel- oder DOI-Konflikt besteht nicht. KNQYFQ6B ist über Seitenzählung, Methodik, Ethical Statement und Literaturverzeichnis als wissenschaftlicher Tagungsbeitrag erkennbar.

## Auflösungen

- 3QUWCYVW, Feministisch, ar1 teilweise, ar2 nein, gewählt nein. Die einzige Passage ist eine rechtsdogmatische Kritik daran, dass das EU-Recht Diskriminierungsgründe einzeln betrachtet. Das Werk entwickelt daraus keine feministische Theorie, Methodik oder geschlechterbezogene Machtanalyse und argumentiert für individuelle statt gruppenbezogene Fairness.
- 3QUWCYVW, AN_Harm_Types, ar1 mit Disparate_Performance, ar2 ohne, gewählt Direct_Discrimination und Indirect_Discrimination. Die Fehlerratenvergleiche beschreiben Fairnesskriterien, der einzige Qualitätsunterschied zwischen Gruppen ist das zitierte Ergebnis von Buolamwini und Gebru, das nach Codebuch 1.4.1 keine Schadensart begründet.
- KNQYFQ6B, Diversitaet, ar1 teilweise, ar2 nein, gewählt teilweise. Das Gender Bias Statement nennt die Repräsentation der Geschlechter als Motiv, und der wirksame Prompt beruht ausdrücklich auf mehr weiblicher Repräsentation in den Beispielen. Das ist ein expliziter, nachgeordneter Aspekt.

Die Schadensarten von KNQYFQ6B unterscheiden sich zwischen den Tracks nur in der Reihenfolge und gelten nicht als Unterschied.

## Von beiden Tracks geteilte Grenzfälle

- 22XEFRWP, AN_Harm_Types Indirect_Discrimination. Die Gehaltszuteilung über stereotyp Schwarze oder weibliche Vornamen ist ein von den Autor:innen konstruierter Stimulus. Das eigene Argument macht diesen Mechanismus zum Gegenstand, gemessen am Modell wird er nicht. Der Review übernimmt den gemeinsamen Wert.
- PYN6HB3E, AN_Harm_Types Indirect_Discrimination und AN_Bias_Axes Socioeconomic. Der Fall armutsbezogener Proxyvariablen in einem Risikoinstrument der Kinder- und Jugendhilfe stammt aus der Literatur und dient als eigenes Arbeitsbeispiel zum Gruppendenken. Die Einleitung argumentiert die überproportionale Wirkung solcher Zuteilungen auf marginalisierte Gruppen selbst. Der Review übernimmt den gemeinsamen Wert.
- 3QUWCYVW, AN_Mitigation_Status Evaluated. Der Status stützt sich allein auf das synthetisierte Ergebnis von Tyagi et al., was die Quellenklärung vom 5. September 2026 für synthetisierte Evaluationen zulässt. AN_Notes begrenzt den Status auf diese Maßnahme.
- 3QUWCYVW, AN_Gender_Definition Implicit_Only und AN_Gender_Understanding Binary_Categorical. Geschlecht erscheint in mehreren eigenen Arbeitsbeispielen, daher kein Not_Applicable.

## Markierung für Domänenexpert:innen

- 7G78SADI, der Lauf führt das Werk als Include, die Quelle ergibt nach der Ableitungsregel Unclear, weil Bias und Gender im Scoping Review zu AI Literacy nur nachgeordnet erscheinen.
- 22XEFRWP, Indirect_Discrimination beruht auf einer konstruierten Stimulus-Zuteilung und nicht auf gemessenem Modellverhalten.
- PYN6HB3E, Indirect_Discrimination beruht auf einem zitierten Fall, den das Werk als eigenes Arbeitsbeispiel verwendet.

## Autoritätsgrenze

Der Review begründet höchstens den internen Status ai-agent-reviewed. Die Übereinstimmung zweier Tracks auf demselben Modell ist eine Prozessdiagnose und keine Reliabilitätsschätzung. Fachliche Verifikation und Publikationsfreigabe bleiben bei den Domänenexpert:innen.
