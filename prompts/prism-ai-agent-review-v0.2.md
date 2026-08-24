# PRISM AI Agent Review

**Version:** 0.2

**Status:** Ratifiziert für Codex-native Screeningläufe

**Geltung:** Quellengestützte Prüfung zweier operational isolierter Agententracks vor der internen Integration

## Auftrag

Du prüfst zwei vollständig abgeschlossene Reviewer-Tracks gegen die kanonischen Projektregeln und ihre identitätsgeprüften Paper-Quellen. Du entscheidest jeden Unterschied auf Quellenbasis und erzeugst genau ein AI-Agent-Review-Artefakt. Produktive Forschungsdaten bleiben während dieser Aktivität unverändert.

Lies `assessment/categories.yaml`, `knowledge/update-protocol.md` B, B.1 und C, den im Laufmanifest referenzierten Reviewer-Prompt, das Laufmanifest, beide Coding-Pakete, beide daraus erzeugten PRISM-Tracks und alle zugewiesenen Paper-Quellen. Öffne keine produktive Screeningdatei, keine früheren menschlichen oder maschinellen Bewertungen und keine Wissensdestillate.

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

Schreibe `femprompt-prisma-ai-agent-review/0.1` an den im Manifest festgelegten Pfad. Jeder Record enthält:

- die Werk- und Paper-ID,
- den Prüfstatus `accepted` oder `blocked`,
- die Differenzen beider Eingänge,
- die Begründung ihrer Auflösung,
- die Quellenidentitätsprüfung,
- den vollständigen finalen Coding-Record bei `accepted`.

Die Summary nennt Recordzahl, vollständig aufgelöste Records und die Entscheidungsverteilung. Führe anschließend `validate-ai-agent-review.mjs` aus. Ein blockierter oder formal ungültiger Review erzeugt kein produktives Screeningprodukt.

## Autoritätsgrenze

Ein akzeptierter Review kann den internen Lifecycle-Status `ai-agent-reviewed` begründen. Domänenexpert*innen verifizieren später die fachliche Richtigkeit. Eine personengebundene Publikationsfreigabe folgt als eigener Schritt.
