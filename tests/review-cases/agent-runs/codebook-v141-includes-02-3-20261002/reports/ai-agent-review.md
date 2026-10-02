# codebook-v141-includes-02-3-20261002, AI Agent Review

- Akteur: agent, Reviewer `ai-agent-review`
- Prompt: `prompts/prism-ai-agent-review-v0.4.md`, Codebuch 1.4.1, Reviewer-Prompt der Tracks 1.4
- Eingaben: `tracks/ar1-coding.json`, `tracks/ar2-coding.json`, die PRISM-Tracks `tracks/ar1.json` und `tracks/ar2.json`, die Berichte beider Tracks und die drei zugewiesenen Volltexte unter `docs/data/fulltext/`, jeweils vollständig gelesen, Hashes gegen das Manifest geprüft
- Ausgabe: `ai-agent-review.json`
- Validator: `PASS AI-agent review: 3 records`
- Ergebnis: drei Records `resolved`, keiner `agreed`, keiner `blocked`. Entscheidungen Include 3, Unclear 0, Exclude 0

## Records

| Paper-ID | Identität | Entscheidung | Ergebnis | Aufgelöstes Feld | Gewählter Wert |
|---|---|---|---|---|---|
| AXEIVEW3 | verifiziert, DOI 10.5281/zenodo.11525357, Forschungsbericht D3.1 | Include | resolved | `AN_Population` | `Child_Family_Welfare`, `Education_Professional` |
| LXDG4KQK | verifiziert, Amnesty International Index EUR 18/8709/2024, Forschungs- und Policy-Report | Include | resolved | `Diversitaet` | `ja` |
| Y6M97SWQ | verifiziert, DOI 10.1177/10497315251350933, systematischer Review | Include | resolved | `AN_Theory_Reference` | `No` |

Beide Tracks stimmen in allen drei Entscheidungen und in allen übrigen Kategorien und Analysefeldern überein. Alle Kategoriebelege und alle Fundstellen in `analysis_evidence` beider Tracks stehen wörtlich in den Quellen. Die Belege beider Tracks wurden im finalen Record zusammengeführt.

## Auflösungen

### AXEIVEW3, `AN_Population`

ar1 codierte `Homelessness_Youth` und `Education_Professional`, ar2 `Child_Family_Welfare` und `Education_Professional`. `Homelessness_Youth` setzt Wohnungslosenhilfe oder Angebote für junge Menschen in prekären Lebenslagen voraus. Der Bericht behandelt allgemeine Jugendarbeit in der non-formalen Bildung in vier Ländern und benennt nirgends prekäre Lebenslagen, was ar1 in seinem Bericht selbst einräumt. Jugendarbeit als Angebot für junge Menschen liegt `Child_Family_Welfare` näher. Das Codebuch hat keinen Wert für allgemeine Jugendarbeit.

### LXDG4KQK, `Diversitaet`

ar1 codierte `teilweise`, ar2 `ja`. Die Methodik nennt digitale Exklusion und erzwungene Inklusion als einen der vier Hauptgegenstände der Untersuchung („Ways in which UDK's digitization practices enable forms of digital exclusion and forced inclusion.“). Kapitel 9 führt ihn mit eigenen Fokusgruppen und der Befragung in Frauenhäusern vollständig aus, und die Analyse der Haushaltsnormen in Kapitel 8.2 stützt sich auf die vom Modell ignorierten kulturellen Unterschiede. Inklusion und Repräsentation verschiedener Gruppen sind damit ein zentraler Beitrag. Die Entscheidung bleibt in beiden Fällen Include.

### Y6M97SWQ, `AN_Theory_Reference`

ar1 codierte `No`, ar2 `Yes` mit den ethischen Rahmenwerken von Russell (2015) und Drake et al. (2020) zusammen mit dem Consolidated Framework for Implementation Research (CFIR). Russell liefert ein Bewertungsmodell mit vier Leistungsaspekten, Drake et al. einen praktischen Prüfrahmen, CFIR einen Implementierungsrahmen. Der Review setzt sie als Bewertungsraster ein, nicht als Theorie, die seine Behandlung von Bias rahmt. Das Equity-Kriterium steht bereits als ausdrückliche Bestimmung unter `AN_Bias_Definition` = `Explicit`. Der Review nennt die geringe Nutzung theoretischer Rahmen selbst als Lücke und erwähnt feministische und kritische Theorien nur als Ausblick. Die Theoriebelegstelle von ar2 geht deshalb nicht in den finalen Record ein.

## Geprüfte Übereinstimmungen mit Auslegungsbedarf

- AXEIVEW3, `Soziale_Arbeit` = `ja`: Das Include setzt voraus, dass Jugendarbeit als Handlungsfeld der Sozialen Arbeit gilt. Ohne diese Lesart fiele das Werk auf Unclear.
- AXEIVEW3, `AN_Bias_Axes` = `Language_Culture` mit `AN_Harm_Types` = `Exclusionary_Norms`: Die Codierung stützt sich auf die in den eigenen Fokusgruppen genannte Sprachbarriere (Werkzeuge überwiegend auf Englisch), also auf ein Zugangshindernis und keine Bias-Analyse im engeren Sinn. Beide Tracks codieren gleich, die Quelle trägt die Lesart als Grenzfall.
- AXEIVEW3, `Gender` = `teilweise` mit `Implicit_Only` und `Binary_Categorical`: Grundlage sind referierte Umfragedaten zu Nutzungsunterschieden zwischen Männern und Frauen, die das Fazit aufgreift.
- LXDG4KQK, `AN_Theory_Reference` = `Yes`: Strukturelle Diskriminierung (Definition nach Najcevska) und Othering rahmen die Diskriminierungsanalyse von Kapitel 8 ausdrücklich, anders als die Bewertungsraster in Y6M97SWQ.
- Y6M97SWQ, `AN_Mitigation_Status` = `Evaluated`: Der Wert gilt nur für die vom Review synthetisierte Schwellenkorrektur von Purdy und Glass (2023) mit berichtetem Ergebnis.

## Markierung für Domänenexpert:innen

- AXEIVEW3: Das Include hängt an der Lesart von Jugendarbeit als Sozialer Arbeit, das Codebuch hat keinen `AN_Population`-Wert für Jugendarbeit, und die Achse `Language_Culture` mit `Exclusionary_Norms` beruht auf einem Zugangshindernis statt auf einer Bias-Analyse.
- Y6M97SWQ: Grenzfall bei `AN_Theory_Reference`, ob ethische Bewertungsrahmen wie Russell (2015) und Drake et al. (2020) als Theoriebezug zählen.

## Autoritätsgrenze

Die Übereinstimmung der Tracks ist eine Prozessdiagnose. Beide Tracks liefen auf demselben Modell und sind nicht epistemisch unabhängig. Der Review begründet höchstens den internen Status `ai-agent-reviewed`, verifiziert keinen Record fachlich und erteilt keine Publikationsfreigabe.
