# Evaluation · agent-v03-10b-20260822

Der Lauf ist nach einem blinden Ergänzungslauf technisch vollständig. Der Hauptlauf erzeugte neun authentische PRISM-Records. `2EBHMYU4` blieb wegen einer falschen Volltextzuordnung offen. Nach der Reparatur der Quelle bearbeitete eine frische Instanz diesen Fall in einem eigenen Browser-Ursprung. Die beiden authentischen Exporte wurden deterministisch zu `docs/data/screening/ar2.json` vereinigt. Die Produktivdatei trägt den Status `provisional_technical_acceptance`; die fachliche Ratifikation der Urteile und der vorläufigen Publikationstypregel steht aus.

## Ergebnis

- 10 von 10 zugewiesenen Paper-IDs erfasst
- 7 Include, 1 Unclear, 2 Exclude
- 57 von 57 Belegstellen im gerenderten Papertext nachweisbar
- jede positive Kategorie durch mindestens einen Paper-Beleg gedeckt
- alle sieben Include-Records mit vollständiger Analyse
- Schema `femprompt-prisma-reviewer/0.3`, Reviewer `ar2`, Akteur `agent`
- Produktivdatei SHA-256: `CF7E129212FFA7FA6073480B8DD2BA0AAC9A7AEF7D01BCAC13D15A06A221FFAF`

## Quellenreparatur

Der Record `2EBHMYU4` war einem verwandten Blogbeitrag derselben Autorin und desselben Jahres zugeordnet. Der Volltext-Builder unterscheidet gleichnamige Autor-Jahr-Kandidaten jetzt über den dokumentierten Titel. Der korrigierte Record verweist auf den wissenschaftlichen Artikel „Intersectionality in Artificial Intelligence: Framing Concerns and Recommendations for Action“, DOI `10.17645/si.7543`.

## Werkzeugbefunde

Die im Lauf gefundenen Anzeigeprobleme sind geschlossen: Eine Paper-ID-Suche zeigt ihren konkreten Wert auch bei vorhandener DOI; Identitätssuchen werden beim Öffnen nicht als Volltextsuche übernommen; eine vervollständigte Include-Analyse aktualisiert den Korpusstatus unmittelbar; nach einer vollständigen Entscheidung wird eine verbliebene Korpussuche vor dem automatischen Wechsel geleert. Die Speicherhinweise unterscheiden Ausschlussgrund und Include-Override ausdrücklich.

## Verifikation

- Python: 18 Prüfungen bestanden
- PRISM: 110 Prüfungen bestanden
- Evidence Companion: 15 Prüfungen bestanden
- Chromium-Pilot: 107 Prüfungen bestanden
- schreibgeschützte Abnahmeansicht: 10 Records, `2EBHMYU4` als Include und vollständig erfasst
- ausführbare Integrationsprüfung: Quell- und Produkthashes, deterministischer Supplement-Merge, Produkt-/Abnahmekopie, Volltexthashes und 57 Paper-Belege bestätigt (`npm run verify:agent-track`)

## Provenienzgrenzen

Modell, Provider, Ausgangscommit, Dirty-Worktree-Status, Prompt-Hash und Volltexthashes sind im Laufmanifest erfasst. Der exakte Hash der während des Laufs geladenen PRISM-Anwendung wurde nicht vor Ausführung gespeichert. Der v0.3-Prompt war ebenfalls noch nicht als eigener Snapshot committet; sein beim Lauf erfasster Hash bleibt im Manifest, während der aktuelle v0.4-Prompt die Reihenfolge des einzigen Speichervorgangs korrigiert. Diese beiden Lücken verhindern die Behauptung einer bytegenauen Wiederholung des Browserlaufs, ohne die Authentizität der gespeicherten Exporte oder deren nachträgliche Integrationsprüfung aufzuheben.

Der ältere Drei-Persona-Pilot wurde nicht übernommen. Seine 30 Records entstanden vor den später behobenen Provenienz- und Stufenfehlern.
