---
name: prism-agent-review
description: Führt kontrollierte, operational isolierte PRISM-Agentenreviews für zugewiesene SocialAI-Papers aus oder prüft solche Tracks vor der Integration. Verwenden bei Reviewbatches, Agententracks, PRISM-Annotationen, Quellenprüfung und kontrollierter Übernahme in die produktiven Forschungsdaten.
---

# PRISM Agent Review

Arbeite ausschließlich im SocialAI-Repository und behandle frühere Bewertungen als gesperrt, solange ein Reviewer-Track entsteht.

## Codex-nativer Run-Vertrag

Künftige Läufe verwenden `femprompt-prisma-agent-run/1.2`. Das verbindliche
Template liegt unter `tests/review-cases/agent-runs/run-template.json`; vor dem
Lauf wird es vollständig mit konkreten Werten befüllt und mit
`node tests/review-cases/validate-run-contract.mjs <run.json>` geprüft. Das
Manifest ist ein Protokoll der Ausführungsbedingungen. Eine bestandene Prüfung
belegt keine epistemische Unabhängigkeit der Ergebnisse.

Der Vertrag verlangt genau zwei operational isolierte Agent-Tracks. Jeder Track
trägt eine eigene Reviewer-ID, Actor-ID und den Actor-Typ `ai_agent`, die komplette
Paper-Zuweisung sowie je Paper den Quellpfad und den SHA-256-Hash. Die
Isolationserklärung hält getrennte Codex-Kontexte, Reviewer-Identitäten und
Ausgabepfade fest und setzt `epistemic_independence_claimed` ausdrücklich auf
`false`. Jeder Track schreibt ein Coding-Paket und einen Bericht. Beide Dateien
werden im Manifest mit Hash gebunden.

`execution.mode` lautet
`blinded_source_review_with_deterministic_prism_roundtrip`. Nach bestandener
Coding-Paket-Prüfung erzeugt der Orchestrator eine schema-0.3-Projektion und
führt sie durch `validateReviewerPayload`, `importReviewerPayload`,
`recordRequirements` und `reviewerFileText` der produktiven PRISM-Logik. Der
resultierende Track bleibt ein unverändertes Laufartefakt. Die sichtbare
Oberfläche ist für diese maschinelle Datenübertragung keine Voraussetzung.

Das Manifest fixiert außerdem Provider, Modell und Modellversion (alternativ
eine unveränderliche Modellkennung), Prompt-Pfad, Prompt-Version und Prompt-Hash,
den Baseline-Commit, UTC-Zeitpunkte sowie alle Track- und Prüfoutputs mit Hash.
`actors` registriert Reviewer und die separate Prüfinstanz als `ai_agent`,
jeweils mit einer Rolle. `provenance.activities[]` führt für
jede Aktivität ID, Typ, Run-ID, Methode, Prompt, Modell und zugehörige Actor-IDs.
Das Lebenszyklusziel lautet `ai-agent-reviewed`; `lifecycle` führt Baseline,
Zustand und typisierte Ereignisse. Eine quellengestützte Prüfung ist als eigene
`ai_agent_review`-Aktivität mit einem `ai_agent` in der Rolle
`ai_agent_reviewer`, beiden Track-IDs und Quellenbasis
zu protokollieren.

Eine agentische Literaturergänzung wird bei Bedarf als
`identification_activity` mit dem Subtyp `agentic_literature_supplement`
geführt. Der Status darf erst nach einem protokollierten Lauf auf `completed`
oder `performed: true` stehen; das Laufprotokoll muss dann Run-ID, Zeitpunkte
und gehashte Outputs enthalten. `legacy_gap` gehört nur in einen ausdrücklich
dokumentierten Migrationsfall. Das historische Run-Artefakt
`ratification-ar2-20260822/run.json` wird vom Validator als Legacy gelesen und
nicht umgeschrieben; seine Rohtracks bleiben unverändert.

Neue Run-Manifeste und Berichte verwenden präzise Angaben zu operationaler
Isolation, Quellenbasis und Actor-Typ. Sie schreiben daraus keine weitergehende
epistemische Eigenschaft der Tracks oder der Prüfung ab.

## Vor jedem Lauf

1. Lies `prompts/prism-agent-reviewer-v1.1.md` vollständig.
2. Lies `assessment/categories.yaml` v1.3 sowie `knowledge/update-protocol.md`, Abschnitte B, B.1 und C.
3. Lies das konkrete Laufmanifest. Verwende dessen Run-ID, Reviewer-Kürzel, Paper-IDs, Quellpfade und Zielpfade unverändert. Errate keinen Parameter.
4. Prüfe den im Manifest eingetragenen Prompt-Hash gegen die tatsächlich verwendete Datei. Stoppe bei einer Abweichung.

## Reviewer-Track

- Bearbeite nur die zugewiesenen Paper-IDs und schreibe nur das eigene Coding-Paket sowie den eigenen Bericht.
- Belege jede positive Kategorie mit einer wörtlichen Passage aus der identitätsgeprüften Paper-Ebene.
- Öffne keine Wissensdestillate, früheren Bewertungen, produktiven Screeningdateien oder anderen Tracks.
- Erfasse alle zehn Kategorien und bei Include die vollständige Analyse im Schema `femprompt-prisma-coding-packet/0.1`.
- Führe `validate-coding-packet.mjs` für den eigenen Track aus. Ein fehlerhaftes Paket bleibt außerhalb des Transfers.
- Direkte Änderungen an produktiven Forschungs-JSONs und Dateien anderer Tracks sind unzulässig.

## Deterministischer PRISM-Transfer

- Der Orchestrator erzeugt mit `build-prism-track.mjs` eine Projektion aus dem validierten Coding-Paket.
- `roundtrip-prism-track.mjs` führt die Projektion durch die produktiven PRISM-Funktionen und serialisiert den Track.
- `validate-prism-track.mjs` vergleicht den resultierenden Track erneut mit Coding-Paket und Manifest.
- Coding-Paket, Bericht, Projektion und Track bleiben als getrennte Laufartefakte erhalten. Ihre Hashes werden vor dem Abschluss im Manifest fixiert.
- Der sichtbare PRISM-Pilot prüft weiterhin die Browseroberfläche. Domänenexpert*innen verwenden die sichtbare Oberfläche später für Verification und Korrekturen.

## AI Agent Review und Integration

Halte Reviewer-Track, AI Agent Review und produktive Forschungsdaten getrennt. Verwende `prompts/prism-ai-agent-review-v0.2.md` für die separate quellengestützte Prüfung. Eine produktive Übernahme ist nur zulässig, wenn:

- Zuweisung und exportierte ID-Menge exakt übereinstimmen,
- Quellenidentität und Textbasis je Paper geprüft sind,
- alle positiven Kategorien Paper-Belege besitzen,
- jeder Include-Record vollständig analysiert ist,
- Rohtracks unverändert archiviert bleiben,
- das AI Agent Review mit `accepted` abgeschlossen ist und
- die Übernahmeentscheidung dokumentiert wurde.

Die produktiven Records tragen Run-ID, Akteur, Reviewer-Provenienz, Prompt-Version und Evaluationsstatus. Ein fehlgeschlagener oder unvollständiger Track bleibt außerhalb der produktiven Daten.

## Abschluss

Führe die für den veränderten Umfang vorgesehenen Publisher, Datenprüfungen und PRISM-Tests aus. Berichte nur Ergebnis, Evidenz, Abweichungen und den nächsten ausführbaren Schritt. Verweise auf die kanonischen Dateien; kopiere ihre Regeln nicht in neue Paralleldokumente.
