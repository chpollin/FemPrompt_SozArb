# PRISM AI Agent Review

**Version:** 0.3

**Status:** Ratifiziert für Codex-native Screeningläufe

**Geltung:** Quellengestützte Prüfung zweier operational isolierter Agententracks vor der internen Integration

**Revision vom 5. September 2026:** Verweise auf die aktuellen Abschnittsnamen des konsolidierten Protokolls und Ausgabefeldnamen an den bestehenden Validator angepasst; Kategorien, Schwellen und Analysevokabular bleiben unverändert. Frühere Promptdateien bleiben als hashgebundene Laufprovenienz erhalten.

## Auftrag

Du prüfst zwei vollständig abgeschlossene Reviewer-Tracks gegen die kanonischen Projektregeln und ihre identitätsgeprüften Paper-Quellen. Du entscheidest jeden Unterschied auf Quellenbasis und erzeugst genau ein AI-Agent-Review-Artefakt. Produktive Forschungsdaten bleiben während dieser Aktivität unverändert.

Lies `assessment/categories.yaml`, `knowledge/update-protocol.md` Abschnitte „Eligibility“, „Text preparation and source gate“, „Agent-assisted completion“ sowie „Analysis coding“ einschließlich der datierten „Source-review clarification“, den im Laufmanifest referenzierten Reviewer-Prompt, das Laufmanifest, beide Coding-Pakete, beide daraus erzeugten PRISM-Tracks und alle zugewiesenen Paper-Quellen. Öffne keine produktive Screeningdatei, keine früheren menschlichen oder maschinellen Bewertungen und keine Wissensdestillate.

## Prüfung pro Werk

1. Prüfe Paper-ID, Werkidentität, Titel, DOI oder stabile Quellenkennung, Autor:innen und Jahr gegen die Paper-Ebene.
2. Prüfe den Publikationstyp gegen die im Manifest festgelegte Regel.
3. Prüfe jede positive Belegstelle auf zeichengetreue, zusammenhängende Übereinstimmung mit der Paper-Quelle.
4. Prüfe, ob Beleg und Paperargument die Kategorie und ihre Stufe tragen. `ja` verlangt einen zentralen Beitrag; `teilweise` einen expliziten nachgeordneten Aspekt.
5. Prüfe die Entscheidung gegen die Dimensionslogik.
6. Prüfe bei Include jedes Analysefeld gegen das kontrollierte Vokabular und den Papergegenstand.
7. Vergleiche beide Tracks feldweise. Dokumentiere jeden Unterschied und seine quellenbasierte Auflösung.

Stimmen beide Tracks überein und trägt die Quelle das Urteil, übernimm den Record. Bei einer Abweichung wähle den quellenkonformen Wert oder formuliere einen vollständig korrigierten Zielrecord. Ein ungeklärter Identitäts-, Quellen-, Publikationstyp- oder Methodenkonflikt setzt den Record auf `blocked`.

## Ausgabe

Schreibe `femprompt-prisma-ai-agent-review/0.1` an den im Manifest festgelegten Pfad. Verwende den bestehenden Vertrag von `tests/review-cases/validate-ai-agent-review.mjs`: `run_id`, `actor: agent`, `reviewer: ai-agent-review`, tatsächlichen UTC-Zeitpunkt in `created`, beide Coding-Pakete als `inputs.tracks` mit `reviewer`, `path` und `sha256` sowie alle zugewiesenen Quellen als `inputs.sources` mit `paper_id`, `path` und `sha256`. Hashes sind SHA-256-Hexwerte ohne Präfix.

`records` ist ein Objekt mit exakt den zugewiesenen Paper-IDs als Schlüssel. Jeder aufgelöste Record enthält:

- die Werk- und Paper-ID,
- `result: agreed` bei übereinstimmendem, belegtem Urteil oder `result: resolved` bei quellenbasiert aufgelösten Unterschieden,
- `differences`: leer bei `agreed`, sonst alle Unterschiede mit ihren Auflösungen,
- `rationale`: die quellengebundene Begründung,
- `identity_check`: Identitätsstatus und Quellenbasis wie im Coding-Paket,
- `final_coding`: alle zehn Kategorien und Evidence-Arrays, Entscheidung, Ausschlussgrund und bei Include die vollständige Analyse im Coding-Paket-Vertrag.

`summary.records` nennt die Gesamtzahl, `summary.resolved_records` die Anzahl der `resolved`-Records; `summary.decisions` enthält in dieser Reihenfolge `Include`, `Unclear`, `Exclude` mit ihren Anzahlen. Führe anschließend `validate-ai-agent-review.mjs` aus. Der Validator akzeptiert nur einen vollständig aufgelösten Review. Bei einem Blocker dokumentierst du `blocked` und den konkreten Befund im Review-Artefakt; du darfst keinen finalen Coding-Record erfinden, um die Prüfung zu bestehen. Ein blockierter oder formal ungültiger Review erzeugt kein produktives Screeningprodukt. Die spätere Integrationsaktivität dokumentiert `accepted` als Review-Ausgang; dieser Lifecycle-Ausgang ist nicht der Wert von `records[paper_id].result`.

## Autoritätsgrenze

Ein akzeptierter Review kann den internen Lifecycle-Status `ai-agent-reviewed` begründen. Domänenexpert*innen verifizieren später die fachliche Richtigkeit. Eine personengebundene Publikationsfreigabe folgt als eigener Schritt.
