# codebook-v141-includes-16-10-20261002, AI Agent Review

- Akteur: agent, Rolle ai-agent-review, Prompt `prompts/prism-ai-agent-review-v0.4.md`
- Codebuch: `assessment/categories.yaml` 1.4.1, Reviewer-Prompt der Tracks `prompts/prism-agent-reviewer-v1.4.md`
- Eingaben: `tracks/ar1-coding.json`, `tracks/ar2-coding.json`, die projizierten Tracks `tracks/ar1.json` und `tracks/ar2.json`, die Berichte beider Tracks und die zehn zugewiesenen Volltexte unter `docs/data/fulltext/`, jeweils vollständig gelesen und mit den Manifest-Hashes gebunden
- Ausgabe: `ai-agent-review.json`
- Validator: `PASS AI-agent review: 10 records`
- Ergebnis: 3 agreed, 7 resolved, 0 blocked
- Verteilung der finalen Codierung: Include 9, Unclear 1, Exclude 0

Alle Belegstellen beider Tracks in `evidence` und `analysis_evidence` wurden maschinell gegen die Quelltexte geprüft und sind zeichengetreu und zusammenhängend. Unterschiede, die nur die Reihenfolge derselben Werte eines Mehrfachfelds betreffen (AN_Harm_Types bei LGYFN6JK, AN_Prompting_Role bei YTDMY5W4), sind keine inhaltlichen Abweichungen und wurden nicht als Differenz geführt. Die finalen Evidence-Arrays vereinigen die quellengetreuen Belege beider Tracks für jeden positiven Wert und ergänzen eigene Belege dort, wo eine Auflösung einen Wert trägt, den nur ein Track gesetzt hatte.

## Records

| Paper-ID | Ergebnis | Entscheidung | Identität | Aufgelöste Felder |
|---|---|---|---|---|
| 4GYXUS9Y | resolved | Include | verified | KI_Sonstige, AN_Task |
| 5G2QTZYD | agreed | Include | verified | keine |
| 6N2E242K | resolved | Include | verified | KI_Sonstige |
| 79TL6HSB | resolved | Include | verified | AN_Population |
| 7G73H3KM | resolved | Include | verified | Bias_Ungleichheit, AN_Prompting_Role |
| 7IVS7X63 | resolved | Include | provisional | Feministisch, AN_Mitigation_Stage |
| KPSF8EZE | agreed | Unclear | verified | keine |
| LGYFN6JK | agreed | Include | verified | keine |
| X7ZGW6CN | resolved | Include | provisional | AN_Task |
| YTDMY5W4 | resolved | Include | verified | identity_check.status, Prompting, AN_Harm_Types |

## Auflösungen

- 4GYXUS9Y, KI_Sonstige: nein. Die Risikobewertung in der Kinder- und Jugendhilfe steht nur in einem zitierten Satz (Gillingham 2019) und ist beiläufig.
- 4GYXUS9Y, AN_Task: Counselling_Client_Communication ergänzt. Der Kommentar beschreibt selbst Psychoedukationsmaterial und gemeinsame Zielreflexion mit Klient:innen in Echtzeit.
- 6N2E242K, KI_Sonstige: nein. Das Fallbewertungsbeispiel illustriert nur den Akzeptanzbegriff.
- 79TL6HSB, AN_Population: Education_Professional ergänzt. Abschnitt 3.4 schlägt KI-Curricula und Weiterbildung für Fachkräfte der Sozialen Arbeit vor.
- 7G73H3KM, Bias_Ungleichheit: ja. Der erste der beiden Vorschläge ist um die Offenlegung der eingebetteten Biases von ChatGPT gebaut.
- 7G73H3KM, AN_Prompting_Role: nur Learning_Content. Prompting ist eine Studierendenaktivität innerhalb einer Lehraufgabe, keine empfohlene berufliche Praxis.
- 7IVS7X63, Feministisch: nein. Die intersektionale Linse kombiniert Nationalität und psychische Erkrankung ohne Geschlechterperspektive und ohne Machtanalyse.
- 7IVS7X63, AN_Mitigation_Stage: Pre_Processing. Die Maßnahmenstelle trägt konkret nur die Repräsentation eines Symptomspektrums in Trainingsdaten, „model engineering“ bleibt unspezifische Lebenszyklussprache.
- X7ZGW6CN, AN_Task: Other_Task. Das Werk beschreibt und schlägt KI-Einsatz in künstlerischer und taktischer Medienpraxis vor (Chatbot ladymouth, NLP in poetischer Praxis).
- YTDMY5W4, identity_check.status: verified. Titel, Version und Autorenschaft stimmen, die offene Frage betrifft den Publikationstyp, nicht die Identität.
- YTDMY5W4, Prompting: ja. Inklusives Prompting gehört zur Definition von Critical AI Literacy und kehrt in mehreren Rahmenwerksabschnitten als eigener Kompetenzpunkt wieder.
- YTDMY5W4, AN_Harm_Types: None. Epistemische Ungerechtigkeit und nicht inklusive Ausgaben werden als Prämisse behauptet, ohne dass das Rahmenwerk einen Mechanismus für eine soziale Gruppe entwickelt.

## Übernommene Records mit Befund

- 5G2QTZYD: Beide Tracks stimmen vollständig überein. Studientyp Empirisch, Direct_Discrimination und Disparate_Performance beruhen auf eigenen Ergebnissen, deren Datenherkunft der Text nicht ausweist. Tabelle 4 nennt Häufigkeiten mit Summe 130 und Prozentwerte auf Basis 125, darunter 10 Antworten als 4 Prozent.
- KPSF8EZE: Beide Tracks kommen nach der Ableitungsregel auf Unclear, weil im Editorial keine Sozialkategorie ja erreicht. Der Lauf ist als Include-Lauf angelegt, die quellengebundene Codierung hält das Ergebnis Unclear fest.
- LGYFN6JK: vollständige Übereinstimmung, die Achsen Race_Ethnicity und Language_Culture und die Schadensarten Exclusionary_Norms und Erasure beruhen auf dem eigenen Argument des Werks, nicht auf der Aufzählung von Merkmalen.

## Publikationstyp und Identität

Alle zehn Quellen erfüllen die ratifizierte Publikationstypregel. YTDMY5W4 ist ein hochschulinternes Rahmenwerk der Open University in Version 0.1 mit benannter Autorenschaft, Begutachtung und Literatur und wird als belegter Policy-Report zugelassen. 7IVS7X63 und X7ZGW6CN bleiben provisional, weil Jahr, Venue und DOI im Text fehlen, Titel und Autor:innen aber übereinstimmen. Kein Record ist blockiert.

## Markierung für Domänenexpert:innen

- KPSF8EZE: Unclear in einem Include-Lauf, ob die nur nachgeordnete Sozialdimension den Einschluss trägt.
- 5G2QTZYD: nicht ausgewiesene Datenherkunft und arithmetische Inkonsistenz, an denen Studientyp und Schadensarten hängen.
- YTDMY5W4: Einordnung eines internen Rahmenwerks in Version 0.1 als Grauliteratur.
- 79TL6HSB: Berichtsqualität (Platzhalter der Ethikgenehmigung, Prozentwerte aus qualitativer Erhebung).
- 7IVS7X63: Grenzfall Feministisch bei intersektionaler Linse ohne Geschlecht, zudem Soziale_Arbeit nein trotz psychisch erkrankter Zielgruppe.
- X7ZGW6CN: AN_Task als Pilotfeld mit Other_Task für künstlerische Praxis, Non_Binary_Inclusive und Social_Construct in einem rein konzeptuellen Essay.

## Autoritätsgrenze

Die Übereinstimmung beider Tracks ist eine Prozessdiagnose und keine Reliabilitätsschätzung, zumal beide Tracks auf demselben Modell liefen. Der Review begründet höchstens den internen Status ai-agent-reviewed. Fachliche Verifikation und Publikationsfreigabe bleiben den Domänenexpert:innen vorbehalten.
