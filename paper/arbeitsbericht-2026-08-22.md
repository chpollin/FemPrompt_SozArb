---
title: Arbeitsbericht PRISM und Evidence Companion
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: snapshot
language: de
version: "0.6"
created: 2026-08-22
updated: 2026-08-23
authors: [Christopher Pollin]
generated-with: Claude Code
related: [journal, specification, verification]
---

# Arbeitsbericht PRISM und Evidence Companion

> [!note] Historischer Stand
> Dieser Bericht dokumentiert den Projektstand vom 22. August 2026. ADR-035 und ADR-036 haben die damaligen Begriffe `ratifizierter Agentenkonsens`, unabhängige Adjudikation und sichtbare PRISM-Transkription für spätere Läufe präzisiert. Der aktuelle Methodenvertrag steht in `knowledge/governance.md`, `knowledge/update-protocol.md` und `knowledge/verification.md`.

**Stand:** 22. August 2026 · **Projekt:** Feministische AI Literacies in der Sozialen Arbeit

## Kurzfassung

Die Arbeitsrunde hat den lokalen Reviewprozess technisch geschlossen und mit realen Papers geprüft. PRISM besitzt nun eine reduzierte Arbeitsoberfläche für Editor:innen, einen abgesicherten Speicherprozess und ein einheitliches Datenformat für menschliche sowie agentische Reviews. Zehn Papers wurden in zwei unabhängigen Blindreviews bearbeitet, quellengestützt adjudiziert und nach dokumentierter Operatorannahme als ratifizierter Agentenkonsens in die Forschungsdaten übernommen. Der Evidence Companion erhielt ein interaktives Literaturbild, das die PRISM-Annotationen bis zu den jeweiligen Paper-Belegen nachvollziehbar macht. Gemeinsame Schemata, lokale Laufzeitabhängigkeiten und reproduzierbare Publisher sichern Daten- und Frontendarchitektur. Parallel wurden Wissensdokument-Verknüpfungen geprüft, zwei belegte Distillationslücken geschlossen und fehlerhafte öffentliche Links korrigiert.

## Umgesetzte Arbeiten

### PRISM-Arbeitsoberfläche

- Editor:innen legen einmalig ein persönliches Kürzel und den lokalen Repository-Ordner fest. Danach steht pro Paper eine einzige Speicheraktion zur Verfügung. GitHub Desktop übernimmt Commit, Pull und Push.
- Die frühere Projektadministration, Import-/Exportsteuerung und das ausklappbare Daten-Sidepanel wurden aus dem täglichen Reviewprozess entfernt.
- Der Volltextbereich ist visuell abgehoben und erhält auf breiten Bildschirmen mindestens doppelt so viel Platz wie die Bewertungsspalte. Metadaten sind kompakt angeordnet; DOI und Quellenangaben sind direkt verlinkt.
- Jede positive Kategorie benötigt einen Beleg aus dem Paper. Include-Entscheidungen können erst gespeichert werden, wenn alle Analysefelder vollständig und widerspruchsfrei bearbeitet sind.
- Frühere Expert:innen- und Modellbewertungen werden erst nach der eigenen gespeicherten Entscheidung zugänglich. Das LLM-Wissensdestillat bleibt bis dahin ebenfalls verborgen.
- Suchtreffer zeigen Paper-ID, Titel, Autor:innen und Treffertyp eindeutig. Hilfetexte und Entscheidungsregeln liegen in zugänglichen Informations-Popovers und beanspruchen keinen dauerhaften Arbeitsraum.

### Agentische Erprobung und Forschungsdaten

- Drei unterschiedliche Agentenprofile bearbeiteten jeweils zehn Papers. Diese 30 Entscheidungen dienten der Prozessevaluation. Der Durchgang identifizierte Fehler bei Export, Akteursprovenienz, Kategorienstatus und Textsuche; alle vier Fehler wurden im Werkzeug behoben. Die 30 Entscheidungen bleiben als Evaluationsmaterial gekennzeichnet.
- Zwei unabhängige Blindreviews bearbeiteten anschließend dieselben zehn frischen Papers mit getrennten Kürzeln. Die authentischen PRISM-Exporte umfassen 20 Records und 115 Eingabebelege; eine ausführbare Prüfung bestätigt die vollständige Transkription.
- Eine dritte, unabhängige Quellenprüfung adjudizierte Kategorien, Analysefelder und Belege. Der Konsens umfasst sieben Includes, ein Unclear, zwei Excludes und 58 verifizierte positive Paper-Belege. Alle Includes erfüllen die Analysepflicht; kein Fall blieb blockiert.
- Nach dokumentierter Operatorannahme wurde der Konsens als `ratified_agent_consensus` in `docs/data/screening/ar2.json` übernommen. Der Track bewahrt `actor: agent`, beide unveränderten Rohtrack-Hashes, den Konsens-Hash und die Annahmeprovenienz. Gegenüber dem vorläufigen Stand wurden sechs Kategoriestufen, 23 Analysefelder und ein nicht wörtlicher Beleg korrigiert.
- Der im Lauf geprüfte Reviewer-Prompt ist als Version 1.0 ratifiziert. Ein projektlokaler Skill verbindet Prompt, Manifest, Blindreview, Evaluator und Integrationsgates zu einem wiederverwendbaren Arbeitsvertrag.

### Interaktives Literaturbild

- Der Evidence Companion besitzt eine neue Ansicht „Literaturbild“. Eine linke Steuerleiste bündelt Bearbeitungsstand, Ansichtswechsel und Filter.
- Der zentrale Bereich zeigt jeweils eine Visualisierung: entweder die Matrix „Gegenstand × Perspektive“ oder ein ausgewähltes Analyseprofil. Die frühere Dashboard-Struktur mit Kennzahlenkarten, erklärenden Textblöcken und mehreren gleichzeitigen Diagrammen wurde entfernt.
- Matrixzellen und Profilwerte öffnen die zugehörigen Papers, Analysefelder und gespeicherten Belegstellen. Thematische Häufigkeiten verwenden ausschließlich Include-Records. Status und agentische Provenienz des ratifizierten Tracks bleiben sichtbar.
- Ein fail-closed Publisher erzeugt die Visualisierungsdaten aus dem produktiven PRISM-Track. Unbekannte Paper-IDs, ungültige Kategorien, unbelegte positive Kategorien und unvollständige Include-Analysen stoppen den Build.

### Wissensdokumente und Datenintegrität

- Der frühere Zähler „238 Wissensdokumente“ wurde fachlich präzisiert. Er bezeichnete 238 verknüpfte Korpusrecords und 182 unterschiedliche Dateien. Mehrere Records können dasselbe Werk referenzieren.
- Siebzehn Links verwendeten eine auf Windows tolerierte Groß- und Kleinschreibung, die auf GitHub Pages zu nicht erreichbaren Dateien geführt hätte. Alle veröffentlichten Pfade werden nun gegen die exakte Dateischreibweise geprüft.
- Zwei verfügbare Volltextquellen besaßen noch kein Distillat. Für *Queer in AI* und *Intersectionality in Artificial Intelligence* wurden Stage-1-Extraktion, formatierter Entwurf, Verifikationsbericht und finales Wissensdokument erstellt. Sämtliche Kategoriebelege wurden wörtlich gegen den Volltext geprüft.
- Der aktuelle Companion verknüpft 242 Korpusrecords mit 183 unterschiedlichen Wissensdokumenten. Alle 242 Links sind exakt erreichbar. Auf der Ebene der 174 verifizierten Volltextidentitäten liegt nun für jede Quelle ein Distillat vor.
- Der fehlerhafte Sekundärtitel von T8R8RKX9 wurde anhand von DOI, Autorinnen und offizieller Publikationsseite korrigiert. Der DOI-identische Record XW8NHCIE nutzt dieselbe stabile Werkidentität und dasselbe Wissensdokument.
- Ein explizites Binding-Manifest verhindert, dass vier gleichnamige Records mit dokumentiertem Titelkonflikt fälschlich dem neuen Wissensdokument zugeordnet werden.

### Refactoring und Reproduzierbarkeit

- `assessment/categories.yaml` ist die einzige fachliche Quelle für die zehn Kategorien. Ein geprüfter Publisher erzeugt daraus das Schema für PRISM, Companion und Literaturbild.
- Der Korpus unterscheidet 326 Records, 258 stabile Werkidentitäten, 242 Dokumentverknüpfungen und 183 unterschiedliche Wissensdokumente. Jeder Record trägt einen nachvollziehbaren Identitätsgrund und einen Abdeckungsstatus.
- Der Datenpublisher ersetzt volatile Erzeugungszeiten durch einen Fingerabdruck aller kanonischen Quellen. Wiederholte Builds erzeugen byte-identische Dateien. Ein fehlgeschlagener Build erhält die vorherige Ausgabe.
- Der öffentliche Datenpublisher entfernt nicht mehr referenzierte Paper-Seiten deterministisch. Die veröffentlichte Paper-Sammlung enthält nur die aktuell gebundenen Wissensdokumente.
- Der frühere generierte Parallel-Vault mit Konzept-, Divergenz-, Pipeline- und MOC-Dateien wurde aufgelöst. Der Download enthält nun ausschließlich die reproduzierbare Paper-Wissenssammlung; Forschungsnetz und Analysen werden aus den kanonischen JSON-Daten erzeugt.
- Ein Windows-sicherer Dateilöschpfad und kollisionsfreie, längenbegrenzte Dateinamen sichern die vollständige Paper-Sammlung auch bei langen Titeln. Die erzeugte Sammlung und das ZIP enthalten jeweils 210 Paper-Dateien.
- Ein veraltetes Übergabedokument und drei isolierte Stilproben wurden nach Konsolidierung ihrer bleibenden Aussagen entfernt. Ihre Provenienz bleibt über die Git-Historie erhalten.
- Der retrospektive Replay prüft die Kennzeichnung menschlicher Bewertungen jetzt gegen den vollständigen kanonischen Schlüsselbestand. Eine historische Sonderausnahme wurde durch diese allgemeine Konsistenzprüfung ersetzt.
- Die öffentlichen Seiten laden D3 und Font Awesome lokal. Remote-Schriften, Fuse.js und JSZip wurden entfernt. Der Browsertest verzeichnet keine externe Laufzeitanfrage.
- Gemeinsame Design-Tokens, allgemeine Companion-Stile, Literaturbild und PRISM liegen in getrennten Stylesheets. Ansicht, Filter, Profil und Auswahl des Literaturbilds sind über die URL wiederherstellbar.
- Der optionale Wissens-Chat hält den API-Schlüssel nur im aktuellen Browser-Tab und nennt die Übertragung von Frage und ausgewähltem Forschungskontext.

## Prüfstand

| Prüfung | Ergebnis |
|---|---:|
| Python-Tests | 50 bestanden |
| PRISM-Logiktests | 113 bestanden |
| Evidence-Companion-Tests | 19 bestanden |
| Browserpilot | 115 Prüfungen bestanden |
| Companion-Browserprüfung | 10 Prüfungen bestanden |
| Claim-Ankerprüfung | bestanden |
| Retrospektiver Benchmark-Replay | reproduziert die kanonischen Kennzahlen; Kennzeichnungen menschlicher Bewertungen sind vollständig konsistent; Prüfmodus verändert keine Dateien |
| Browserprüfung Literaturbild | Umschaltung, Filter, Drill-down und Auswahlzustand bestanden |

Die Seiten- und Visualisierungspublisher erzeugen bei wiederholter Ausführung identische Dateien. Während des Browserdurchgangs trat kein horizontaler Seitenüberlauf auf.

## Fachlich offene Punkte

- Der produktive PRISM-Track umfasst derzeit zehn von 326 Korpusrecords. Die weitere Bearbeitung benötigt eine kanonische Zuordnung der Dubletten und anschließend getrennte, prüfbare Reviewtracks.
- 84 Records besitzen noch keinen veröffentlichten Wissensdokument-Link. Davon sind 30 technisch als `fulltext_ready` klassifiziert, 11 besitzen eine ungeklärte Quellenidentität und 43 keine sicher gebundene Quelle.
- Die dauerhafte Browserberechtigung für den lokalen Repository-Ordner muss einmal in Chrome oder Edge an einem realen Klon bestätigt werden.
- Die bestehenden älteren Wissensdokumente tragen unterschiedliche Verifikationsstände. Die vollständige fachliche Ratifikation des Gesamtbestands bleibt eine eigene wissenschaftliche Prüfung.
- Der vollständige Ruff-Lauf meldet 79 ältere Stil- und Qualitätsbefunde in Akquise-, Bewertungs- und Distillationsskripten. Die in dieser Runde veränderten Publisher-, Replay- und Testdateien bestehen die Ruff-Prüfung.
