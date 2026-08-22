---
name: prism-agent-review
description: Führt kontrollierte, blinde PRISM-Agentenreviews für zugewiesene SocialAI-Papers aus oder prüft solche Tracks vor der Integration. Verwenden bei Reviewbatches, Agententracks, PRISM-Annotationen, Adjudikation und kontrollierter Übernahme in die produktiven Forschungsdaten.
---

# PRISM Agent Review

Arbeite ausschließlich im SocialAI-Repository und behandle frühere Bewertungen als gesperrt, solange ein Reviewer-Track entsteht.

## Vor jedem Lauf

1. Lies `prompts/prism-agent-reviewer.md` vollständig.
2. Lies `assessment/categories.yaml` v1.3 sowie `knowledge/update-protocol.md`, Abschnitte B, B.1 und C.
3. Lies das konkrete Laufmanifest. Verwende dessen Run-ID, Reviewer-Kürzel, Paper-IDs, PRISM-URL und Zielpfade unverändert. Errate keinen Parameter.
4. Prüfe den im Manifest eingetragenen Prompt-Hash gegen die tatsächlich verwendete Datei. Stoppe bei einer Abweichung.

## Reviewer-Track

- Verwende die sichtbare PRISM-Oberfläche und die im Manifest konfigurierte URL.
- Bearbeite nur die zugewiesenen Paper-IDs und schreibe nur den eigenen Track-Export sowie den eigenen Bericht.
- Belege jede positive Kategorie mit einer wörtlichen Passage aus der identitätsgeprüften Paper-Ebene.
- Verwende das `LLM-Wissensdestillat` nur zur Orientierung. Es ist keine Paper-Evidenz.
- Speichere jeden vollständigen Record einmal und prüfe ihn nach erneutem Öffnen.
- Erzeuge den authentischen PRISM-Export. Direkte Änderungen an Forschungs-JSONs, Browserzustand oder Test-Hooks sind unzulässig.
- Melde reproduzierbare UI- oder Datenfehler kompakt. Behebe sie nur in einem getrennten, geprüften Code-Arbeitsschritt.

## Adjudikation und Integration

Halte Reviewer-Track, Evaluatorurteil und produktive Forschungsdaten getrennt. Verwende `prompts/prism-ratification-evaluator.md` für die unabhängige Prüfung. Eine produktive Übernahme ist nur zulässig, wenn:

- Zuweisung und exportierte ID-Menge exakt übereinstimmen,
- Quellenidentität und Textbasis je Paper geprüft sind,
- alle positiven Kategorien Paper-Belege besitzen,
- jeder Include-Record vollständig analysiert ist,
- Rohtracks unverändert archiviert bleiben,
- die Adjudikation bestanden ist und
- die Übernahmeentscheidung dokumentiert wurde.

Die produktiven Records tragen Run-ID, Akteur, Reviewer-Provenienz, Prompt-Version und Evaluationsstatus. Ein fehlgeschlagener oder unvollständiger Track bleibt außerhalb der produktiven Daten.

## Abschluss

Führe die für den veränderten Umfang vorgesehenen Publisher, Datenprüfungen und PRISM-Tests aus. Berichte nur Ergebnis, Evidenz, Abweichungen und den nächsten ausführbaren Schritt. Verweise auf die kanonischen Dateien; kopiere ihre Regeln nicht in neue Paralleldokumente.
