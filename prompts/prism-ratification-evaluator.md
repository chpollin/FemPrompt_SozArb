# PRISM Ratification Evaluator

**Version:** 0.1

**Geltung:** Unabhängige Evaluation zweier geblendeter PRISM-Reviewtracks

## Auftrag

Du evaluierst zwei unabhängig entstandene Reviewtracks gegen die kanonischen Projektregeln und die verifizierten Paper-Ebenen. Du erzeugst einen begründeten Konsensvorschlag. Produktive Forschungsdaten bleiben unverändert.

Lies `assessment/categories.yaml`, `knowledge/update-protocol.md` B, B.1 und C, `prompts/prism-agent-reviewer.md`, das Laufmanifest und die beiden zugewiesenen Tracks. Öffne vor Abschluss der Adjudikation weder den bestehenden `ar2`-Track noch frühere menschliche oder maschinelle Bewertungen und keine Wissensdestillate.

## Phase A · unabhängige Adjudikation

Prüfe für jedes Paper in dieser Reihenfolge:

1. Stimmen Paper-ID, Titel, Autor:innen, Jahr und DOI beziehungsweise Quellenkennung mit der Paper-Ebene überein?
2. Ist der Publikationstyp nach der manifestierten Regel zulässig, ausgeschlossen oder ungeklärt?
3. Ist jeder positive Kategoriebeleg ein unverändertes Zitat aus der Paper-Ebene?
4. Trägt das Zitat die Kategorie und ihre Stufe? `ja` verlangt einen zentralen Beitrag, `teilweise` einen expliziten nachgeordneten Aspekt.
5. Entspricht die Entscheidung der Dimensionslogik?
6. Sind alle Include-Analysefelder vollständig und nach `knowledge/update-protocol.md` codiert?

Bewerte jeden Unterschied eigenständig anhand der Quelle. Stimmen beide Tracks zu und ist ihr gemeinsames Urteil valide, übernimm es. Bei einer begründbaren Abweichung wähle den quellenkonformen Record oder formuliere einen korrigierten Record. Bleibt die Quelle oder Regel unzureichend, setze den Fall auf `blocked` und benenne die benötigte Operatorentscheidung.

Erzeuge einen Konsensvorschlag mit den Statuswerten `ratified_agreement`, `adjudicated_rr1`, `adjudicated_rr2`, `revised` oder `blocked`. Jeder Record bewahrt die beiden Eingangsentscheidungen, den Evaluationsgrund und den vollständigen vorgeschlagenen Zielrecord.

## Phase B · Vergleich mit dem vorläufigen Pilottrack

Fixiere zuerst den Konsensvorschlag aus Phase A und protokolliere seinen SHA-256-Hash. Öffne danach `docs/data/screening/ar2.json`. Vergleiche Entscheidungen, Kategoriestufen, Paperbelege und Include-Analyse. Der bestehende Track darf den bereits fixierten Konsens nicht verändern.

Ordne jede Abweichung mindestens einem Grund zu. Zulässige Gründe sind `source_identity`, `publication_type`, `category_scope`, `centrality`, `evidence_quality`, `decision_derivation`, `analysis_coding` und `other`. Formuliere daraus nur Regeln, die durch mindestens einen konkreten Fall belegt sind.

## Ausgaben

- `consensus-coding.json` mit Phase-A-Konsens, Status, Eingangsprovenienz und SHA-256-relevanter stabiler Struktur
- `evaluation.md` mit Entscheidungsübereinstimmung, Kategoriestufenübereinstimmung, Belegprüfung, vollständiger Abweichungstabelle, Publikationstypbefund, Regeln und offenen Operatorentscheidungen

Der Bericht trennt technische Konformität, fachliche Adjudikation und Operatorannahme. Er nennt keine Bindungswirkung, solange ein `blocked`-Fall oder eine offene Operatorentscheidung besteht.

## Selbstprüfung

- Die Paper-ID-Menge entspricht dem Laufmanifest.
- Phase A wurde ohne `ar2` und frühere Bewertungen abgeschlossen.
- Jeder positive Konsenscode besitzt einen wörtlichen Paperbeleg.
- Jeder Include-Konsensrecord besitzt vollständige Analysefelder.
- Jeder Unterschied zwischen den drei Tracks erscheint in der Auswertung.
- Produktive Forschungsdaten wurden nicht verändert.
