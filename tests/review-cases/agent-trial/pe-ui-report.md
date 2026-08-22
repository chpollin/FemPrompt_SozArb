# PRISM-UI-Testbericht, Praxisredaktion

## Testkontext

| Merkmal | Beobachteter Wert |
|---|---|
| Test-URL | `http://127.0.0.1:8774/prisma.html?trial=1` |
| Reviewer-Kürzel | `pe` |
| Sichtbares Ziel | `isolierter Testlauf/pe.json` |
| Sichtbarer Korpusstatus | `10 / 326` |
| Gespeicherte Entscheidungen | 5 Include, 1 Unclear, 4 Exclude |
| Auswirkung auf Forschungsdaten | Die Oberfläche meldete, dass die Forschungsdaten unverändert blieben. |

Alle zehn zugewiesenen Records wurden über die sichtbaren PRISM-Bedienelemente erfasst. Der Ablauf nutzte direkte Paper-URLs, die Volltextsuche, Kategorie-Chips, Belegdialoge, Ausschlussgründe, Override-Schalter, die Diskettenaktion und das Analysepanel für Include-Records. Ein Test-Hook oder eine direkte Manipulation des Seitenzustands kam nicht zum Einsatz.

## Erfasstes UI-Ergebnis

Die zehn gespeicherten Paper-IDs entsprechen der Zuweisung. Jede Kategorie mit einem Wert über null besitzt einen als `Mensch` markierten Beleg. Die zwei inhaltlich einschlägigen Webseiten wurden mit `Wrong_publication_type` und aktivem Override als Exclude gespeichert. Die zwei protokollbasierten Ausschlüsse tragen `Not_relevant_topic`. Jeder Include-Record zeigt `Analyse-Codierung vollständig.` mit dem Vokabularhinweis `categories.yaml v1.3`.

Die gesperrten Records reproduzierten die vorbereiteten Kategoriestufen und finalen Entscheidungen. PRISM kennzeichnete die gespeicherten Korpuseinträge als `eingeschlossen`, `unklar` oder `ausgeschlossen`. Der Reviewer-Bereich behielt `pe` bei und meldete `Testlauf im Browser gespeichert. Forschungsdaten bleiben unverändert.`

## UI-Beobachtungen

1. Die Reviewer-Ersteinrichtung akzeptierte `pe` und zeigte unmittelbar den isolierten Zielpfad. Im Testmodus war kein Repository-Ordner erforderlich.
2. Direkte Links mit `?paper=<ID>` öffneten die zugewiesenen Records zuverlässig und erhielten den Reviewer-Track.
3. Das Anheften eines menschlichen Belegs setzt die Kategorie unmittelbar auf `ja`. Für vorbereitete Kategorien mit `teilweise` musste der Wert danach über `nein` zurück auf `teilweise` geschaltet werden. Die gesperrten Kategorie-Chips bewahrten anschließend die beabsichtigte Stufe.
4. Die Volltextsuche wird mit kurzer Verzögerung angewendet. Eine unmittelbar gesendete Enter-Eingabe kann noch auf der vorherigen Treffermenge arbeiten, weil Enter bestehende Treffer weiterschaltet. Das Warten auf den Trefferzähler und die aktivierte Belegschaltfläche ergab stabile Resultate.
5. Der Volltext von `AMYZFAPH` enthält wörtliche `/uniFB01`-Ligaturcodes in Wörtern wie „artificial“. Der vorbereitete Suchbegriff `Generative artificial intelligence` lieferte keinen Treffer. Der sichtbar passende Begriff `large language models (LLMs) are poised` wurde an Generative KI geheftet und steht daher in `pe.json`.
6. `MITLDF9S` zeigte den Quellenhinweis `nur LLM-Wissensdestillat`, während die Paper-Ebene den geprüften Abstract enthielt. Die Codierbasis wurde automatisch auf `Abstract` gesetzt, und die zwei nicht entscheidbaren Felder blieben explizit markiert. Der Quellenhinweis vermittelt diese Abstract-Grundlage unzureichend.
7. Include-Records werden zuerst über die Diskettenaktion gespeichert. Danach erscheint das gesperrte Analysepanel, das jede Feldänderung automatisch sichert. Die Weiter-Aktion wird verfügbar, sobald das Panel die Vollständigkeit meldet.
8. Exclude- und Unclear-Records wechseln unmittelbar nach der Diskettenaktion zum nächsten offenen Paper. Die Bestätigung desselben gespeicherten Papers erforderte das erneute Öffnen seiner direkten URL.
9. Die gesperrte Belegliste zeigt Herkunft und Snippet. Suchbegriff und generierter Zeitstempel bleiben unsichtbar. Die Reviewer-Datei verwendet deshalb einen gemeinsamen Übertragungszeitpunkt für `updated`, die Entscheidungsfelder `ts` und die Belegfelder `ts`. Alle eingegebenen Kategorien, Suchbegriffe, Snippets, Gründe, Overrides und Analysewerte entsprechen der UI-Eingabe.

## Validierung

- Das Reviewer-Schema lautet `femprompt-prisma-reviewer/0.3`.
- Das Reviewer-Kürzel lautet `pe`.
- Die Entscheidungsmap enthält exakt die zehn zugewiesenen IDs.
- Jede Kategorie mit dem Wert 1 oder 2 besitzt einen Beleg menschlicher Herkunft.
- Alle vier Exclude-Records enthalten einen kontrollierten Ausschlussgrund.
- Alle fünf Include-Records enthalten vollständige Analysefelder.
- `MITLDF9S` markiert `AN_Bias_Axes` und `AN_Harm_Types` als nicht entscheidbar und hält `AN_Coding_Basis` mit `Abstract` fest.
- Die übrigen Include-Records verwenden `Fulltext`.
- Die Analysewerte entsprechen dem eingefrorenen Vokabular der Version 1.3.
