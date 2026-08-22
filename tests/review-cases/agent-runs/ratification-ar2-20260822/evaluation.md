# Unabhängige Ratifikationsauswertung · Milestone 1

- **Lauf:** `ratification-ar2-20260822`
- **Auswertung:** 2026-08-22
- **Phase-A-Konsens:** `consensus-coding.json`
- **Fixierter SHA-256:** `5efa0727c2e4a60795f66592d0357fc2d6e92afb9022ccebedd523c960e44d4c`
- **Produktiver Track:** `docs/data/screening/ar2.json`, SHA-256 `38ab5796c6018b5fbde6a9cb562a4ececfb4c0c88dcaea86cb18325fb0fdd392`

## Ergebnis und Gate

Der geblendete Phase-A-Konsens besteht die fachliche und technische Prüfung: zehn manifestierte IDs, keine blockierte Quelle, sieben Include-, ein Unclear- und zwei Exclude-Records. Alle 58 positiven Konsensbelege sind in der zugewiesenen Paper-Ebene auffindbar; 57 stimmen nach Rücknahme der HTML-Entitäten direkt überein, ein Beleg benötigt ausschließlich die dokumentierte PDF-Whitespace-Normalisierung. Alle sieben Include-Records besitzen die vollständigen Analysefelder und gültige kontrollierte Werte.

**Ratifikationsartefakt: PASS.** Der Konsens ist vollständig, reproduzierbar gehasht und fachlich entscheidbar.

**Produktive Übernahme: PASS.** Die dokumentierte Operatorannahme liegt vor. Der Konsens wurde kontrolliert in `ar2.json` überführt; die sechs Kategoriestufen, 23 Analysefelder und der nicht wörtliche Beleg des vorläufigen Tracks wurden korrigiert. Die Rohtracks blieben unverändert.

Offene fachliche Blocker bestehen nicht. Der fehlerhafte Sekundärtitel von T8R8RKX9 wurde anhand der stabilen offiziellen Publikationskennung im Korpus berichtigt; die beiden DOI-identischen Records behalten eine gemeinsame Werkidentität.

## Phasentrennung und Provenienz

Phase A wurde vollständig abgeschlossen, geschrieben, validiert und gehasht, bevor `docs/data/screening/ar2.json` geöffnet oder durchsucht wurde. Frühere ar2-Auswertungen, Wissensdestillate, Reviewer-Berichte, Reconciliation-Details und Vor-Coding-Pakete wurden weder geöffnet noch als Bewertungsgrundlage verwendet. Zugelassen waren die kanonischen Regeln, das Laufmanifest, die authentischen Browserexporte `tracks/rr1.json` und `tracks/rr2.json`, die manifestierten Paper-Ebenen, die Korpusmetadaten zur Identitätsprüfung und die offizielle AAAI/ACM-Seite hinter der stabilen Korpus-URL von T8R8RKX9.

Die beiden Eingabetracks erfüllen `femprompt-prisma-reviewer/0.3`, tragen die erwarteten Reviewer `rr1` und `rr2`, den Akteur `agent` und exakt die zehn manifestierten IDs. Ihre SHA-256-Werte stimmen mit dem Laufmanifest überein:

- `rr1.json`: `0c85e461fc278db08f590987a5cc45fadbb6ff9837a2a73151d06e4202291b62`
- `rr2.json`: `1dacb64f26f67bf539381f4bcee8be3fa02a867bb52dbc1b9f6fe4e5483f35df`

Die Reviewer hatten keine nutzbare Browserbindung. Der Operator transkribierte ihre unabhängigen Coding-Pakete in isolierte PRISM-Trial-Origins. Das Laufmanifest dokumentiert eine bestandene Byte-für-Byte-Transkriptionskontrolle über 20 Records und 115 Belegpassagen. Diese Kontrolle wurde hier aus Gründen der Bewertungsblindheit nicht durch Öffnen der Vor-Coding-Pakete wiederholt. Die Ratifikation verwendet ausschließlich die authentischen Browserexporte.

## Technische Konformität

| Prüfung | Ergebnis | Befund |
|---|---:|---|
| Track-Schema und Provenienz | PASS | Beide Tracks: Schema 0.3, `actor=agent`, erwarteter Reviewer, zehn IDs. |
| ID-Menge und Reihenfolge | PASS | Exakt die zehn IDs des Laufmanifests; Konsensreihenfolge stimmt. |
| Quellenpfade und Integrität | PASS | Neun manifestierte Volltexte vorhanden und mit SHA-256 im Konsens fixiert; EXRF5629 ausdrücklich ohne verifizierte Paper-Ebene. |
| Entscheidungsableitung | PASS | Jeder Konsensrecord folgt der Technik-/Sozialdimensionslogik; kein Override erforderlich. |
| Konsensbelege | PASS | 58 Belege: 57 direkte Treffer, ein reiner Whitespace-Treffer, keine Wortlautabweichung. |
| Include-Analyse | PASS | Sieben Records, alle zehn Analysefelder vorhanden, kontrollierte Vokabulare eingehalten, Fulltext-Schadensfeld befüllt. |
| Vorläufiger ar2-Belegcheck | FAIL | 57 Belege: 53 direkte Treffer, drei reine Whitespace-Treffer, ein veränderter Wortlaut bei 7VFNS5R3. |
| Produktivdaten | PASS | Der fixierte Konsens wurde nach Operatorannahme reproduzierbar in `ar2.json` projiziert; Rohtracks und Konsens blieben unverändert. |

Die reine PDF-Suchnormalisierung kollabiert nur aufeinanderfolgende Whitespace-Zeichen. Sie war in den Eingabetracks bei `rr1/THGC3PA2/Generative_KI`, `rr1/WAYCKUZ8/Fairness` und `rr2/THGC3PA2/KI_Sonstige` nötig. Im Konsens verbleibt davon nur `rr2/THGC3PA2/KI_Sonstige`. HTML-Entitäten wurden ausschließlich für den Vergleich in ihre dargestellten Zeichen zurückgeführt. Wörter, Zeichensetzung und Kategoriezuordnung blieben unverändert.

Der ar2-Beleg für `7VFNS5R3/Bias_Ungleichheit` beginnt mit „The course helped …“, während die Paper-Ebene an dieser Stelle „the course helped …“ enthält. Die Großschreibung wurde im angehefteten Suchterm verändert. Der Konsens ersetzt diesen Beleg durch einen wörtlichen Track-Beleg.

## Übereinstimmung

| Vergleich | Entscheidung | Kategoriestufen | Belegsätze | Include-Analyse |
|---|---:|---:|---:|---:|
| rr1 gegen rr2 | 10/10 | 92/100 Zellen | 54 positive Kategorie-Belegsätze verschieden | 48/70 Felder identisch; 22 verschieden |
| Konsens gegen ar2 | 10/10 | 94/100 Zellen | 51 positive Kategorie-Belegsätze verschieden | 47/70 Felder identisch; 23 verschieden |

Die identischen Gesamtentscheidungen verdecken relevante Unterschiede. Acht rr1/rr2-Kategoriestufen in sechs Papers mussten adjudiziert werden. Gegenüber ar2 ändert der Konsens sechs Stufen in fünf Papers. Alternative wörtliche Belege ohne Bedeutungsdifferenz werden als `other` ausgewiesen; inhaltliche Tragfähigkeit und Literalität wurden unabhängig davon geprüft.

## Vollständige Abweichungstabelle

Abkürzungen: `K` bezeichnet den fixierten Konsens. Pfeile in der Spalte ar2 → K geben die tatsächlich vorgeschlagene Korrektur an. Jeder Befund ist mindestens einem zulässigen Abweichungsgrund zugeordnet.

| Paper | Entscheidungen rr1 / rr2 / ar2 / K | rr1 ↔ rr2 | ar2 → K | Gründe |
|---|---|---|---|---|
| MA3LBJS6 | Include / Include / Include / Include | Kategorien gleich. Belege verschieden bei AI_Literacies, Bias_Ungleichheit, KI_Sonstige, Soziale_Arbeit. Analyse: Bias-Achsen `Age; Gender` gegen `None`; rr1 zusätzlich `Exclusionary_Norms`; Notes verschieden. | Kategorien gleich. Alternative Belege bei KI_Sonstige und Soziale_Arbeit. Analyse: Harm Types ergänzen `Exclusionary_Norms; Indirect_Discrimination`; `Health_Care` aus Population entfernen; begründende Notes ergänzen. | `analysis_coding`, `other` |
| WAYCKUZ8 | Unclear / Unclear / Unclear / Unclear | Kategorien gleich; alle vier positiven Belegsätze verschieden und wörtlich tragfähig; keine Analyse. | Kategorien und Analyse gleich; alle vier Belegsätze alternativ und tragfähig. K übernimmt rr2. | `other` |
| 7L78MV2V | Include / Include / Include / Include | `KI_Sonstige` 1 gegen 2; `Feministisch` 2 gegen 1. Alle acht Belegsätze verschieden. Harm Types, Mitigation Stage, Status und Notes verschieden. | `KI_Sonstige` 0 → 2. Alle acht Belegsätze verschieden beziehungsweise KI_Sonstige ergänzt. Prompt Techniques `General_Guidance; ICL` → `ICL`; Mitigation Stage `In_Training; Post_Processing; Pre_Processing` → `In_Training; Organisational_Process; Pre_Processing`; Notes ersetzt. | `category_scope`, `centrality`, `analysis_coding`, `other` |
| 3GB9B4IJ | Exclude / Exclude / Exclude / Exclude | `KI_Sonstige` 1 gegen 0; drei Belegsätze verschieden; keine Analyse. | `KI_Sonstige` 0 → 1 und wörtlichen Beleg ergänzen. Die soziale Dimension bleibt 0, deshalb bleibt Exclude. | `category_scope`, `other` |
| 7VFNS5R3 | Include / Include / Include / Include | `Feministisch` 1 gegen 0. Belege verschieden bei AI_Literacies, Bias_Ungleichheit, Gender und Feministisch. Analyse: `Other_Axis` nur rr1; Harm Types `Indirect_Discrimination` gegen `Stereotyping`; Notes verschieden. | Kategorien gleich. Alternative Belege bei AI_Literacies, Bias_Ungleichheit, Diversitaet, Feministisch und KI_Sonstige; der ar2-Bias-Beleg ist wegen veränderter Anfangsgroßschreibung nicht wörtlich. Population `Not_SW_Specific` → `Education_Professional`; Notes ergänzen. | `evidence_quality`, `analysis_coding`, `other` |
| 2EBHMYU4 | Include / Include / Include / Include | Kategorien gleich. Sechs Belegsätze verschieden. Analyseachsen: rr1 enthält Nationality_Migration und Religion, rr2 enthält Language_Culture; Notes verschieden. | `Fairness` 0 → 1 mit Beleg. Sieben Belegsätze verschieden beziehungsweise Fairness ergänzt. Bias-Achsen von `Gender; Intersectional; Race_Ethnicity; Socioeconomic` auf die zehn quellenbelegten Achsen erweitern; Harm Types um `Erasure; Indirect_Discrimination; Misrepresentation` ergänzen; Notes präzisieren. | `category_scope`, `centrality`, `analysis_coding`, `other` |
| T8R8RKX9 | Include / Include / Include / Include | `Generative_KI` 1 gegen 2; alle acht Belegsätze verschieden. Harm Types unterscheiden Exclusionary_Norms und Indirect_Discrimination; Mitigation Stages und Notes verschieden. | `Generative_KI` 2 → 1. Sieben Belegsätze alternativ, Gender identisch. Harm Types ohne `Indirect_Discrimination`; Mitigation Stage `Organisational_Process; Post_Processing; Pre_Processing` → `Organisational_Process`; Notes präzisieren. Der fehlerhafte Korpustitel wird über die stabile offizielle Artikelkennung 31748 aufgelöst. | `source_identity`, `centrality`, `analysis_coding`, `other` |
| XIYX5HJS | Include / Include / Include / Include | `AI_Literacies` 2 gegen 1; `Soziale_Arbeit` 1 gegen 0. Neun Belegsätze verschieden. rr2 ergänzt Toxicity; Populationen und Notes verschieden. | `AI_Literacies` 1 → 2; `Soziale_Arbeit` 1 → 0. Alle zehn ar2-Belegsätze unterscheiden sich vom Ziel beziehungsweise der Sozialarbeitsbeleg entfällt. Harm Types ohne `Toxicity`; Mitigation Stage ohne `Post_Processing`; Population um `Social_Assistance_Admin` ergänzen; Studientyp `Konzept` → `Empirisch`; Notes ersetzen. | `category_scope`, `centrality`, `analysis_coding`, `other` |
| THGC3PA2 | Include / Include / Include / Include | `Fairness` 2 gegen 1. Acht Belegsätze verschieden. `Other_Axis` nur rr1; Harm Types, Mitigation Stage und Notes verschieden. | Kategorien gleich. Sieben Belegsätze alternativ, Bias_Ungleichheit identisch. Bias-Achsen ohne `Language_Culture; Other_Axis`; Harm Types ohne `Direct_Discrimination; Misrepresentation`; Mitigation Stage ohne `In_Training`; Notes ergänzen. Der nichtkommerzielle FU-Beitrag erfüllt aufgrund identifizierter Fachautorin, Quellenbasis und substanziellem Seminar-/Konzeptbeitrag die erlaubte fachwissenschaftliche Kommentarkategorie. | `publication_type`, `analysis_coding`, `other` |
| EXRF5629 | Exclude / Exclude / Exclude / Exclude | Vollständige Übereinstimmung: keine Kategorien, keine Belege, Grund `No_full_text`. | Vollständige Übereinstimmung. Die synthetische Korpuszusammenfassung ist kein originales Abstract. | — |

## Publikationstypen und Quellenidentität

Alle zehn Fälle sind entscheidbar. MA3LBJS6 ist ein wissenschaftlicher Forum-Beitrag, WAYCKUZ8 ein fachwissenschaftlicher Viewpoint, 7L78MV2V ein Review-Artikel, 3GB9B4IJ und T8R8RKX9 Konferenzbeiträge, 7VFNS5R3 und 2EBHMYU4 Journalartikel, XIYX5HJS ein belegter Policy-Report und EXRF5629 ein Journalartikel ohne verifizierte Paper-Ebene.

THGC3PA2 bezeichnet sich als „TOOLBOX – BLOG“. Die Ausschlussregel nennt kommerzielle Blogs. Der Beitrag stammt aus einem nichtkommerziellen FU-Berlin-Kontext, identifiziert Dr. Tanja Kubes mit einschlägiger Fachrolle, dokumentiert ein durchgeführtes Hochschulseminar und einen Queerbot-Workshop und führt fachwissenschaftliche Literatur auf. Er erfüllt damit die zugelassene Kategorie eines fachwissenschaftlichen Kommentars mit Autorenschaft und Quellenbasis. Die Regel trägt diese Einordnung deterministisch; eine Publikationstyp-Operatorentscheidung ist nicht erforderlich.

Bei T8R8RKX9 lautet der Korpustitel „AI tools show biases in ranking job applicants' names according to perceived race and gender“. Die stabile Korpus-URL `https://ojs.aaai.org/index.php/AIES/article/view/31748` führt zur offiziellen AAAI/ACM-Publikation „Gender, Race, and Intersectional Bias in Resume Screening via Language Model Retrieval“ von Kyra Wilson und Aylin Caliskan, publiziert 2024, DOI `10.1609/aies.v7i1.31748`. Titel, Autorinnen, Jahr und Inhalt der offiziellen Publikation stimmen mit dem zugewiesenen Volltext überein. Der Korpustitel ist ein korrigierbarer Metadatenfehler; die Quelle bleibt eindeutig.

## Fallbelegte Regeln

1. Ein abweichender Korpustitel kann nur dann als Metadatenfehler aufgelöst werden, wenn eine bereits im Korpus gespeicherte stabile Quellenkennung zur offiziellen Publikation führt und Autor:innen, Jahr, DOI und Volltext übereinstimmen. T8R8RKX9 erfüllt diese Bedingung.
2. Kategoriestufe 2 folgt dem zentralen Untersuchungsgegenstand. Das breite NLP-/Sprachmodellinventar von 7L78MV2V trägt KI_Sonstige=2; bei T8R8RKX9 bleibt generative Funktion gegenüber Embedding-Retrieval nachgeordnet und trägt Generative_KI=1.
3. Soziale_Arbeit verlangt eine direkte sozialarbeiterische Praxis- oder Theoriebehandlung. Wohlfahrtsautomatisierung und Sozialleistungsbeispiele in einem globalen Governance-Report tragen bei XIYX5HJS den Analysekontext `Social_Assistance_Admin`, jedoch keine positive Reviewkategorie Soziale_Arbeit.
4. Bei Review- und Konzeptarbeiten sind die systematisch synthetisierten Gegenstände codierbar. 7L78MV2V erreicht deshalb bei empirisch geprüften Metriken und Mitigationen den Status `Evaluated`.
5. Analyseachsen erfassen untersuchte Ungleichheitsachsen. Demografische oder curriculare Vergleichsmerkmale reichen nicht. Das entfernt Age/Gender bei MA3LBJS6 und Other_Axis bei 7VFNS5R3; die explizit ausgewerteten Policy-Achsen von 2EBHMYU4 bleiben erhalten.
6. Eine Mitigation Stage beschreibt die eigene Intervention oder die bei Reviews synthetisierte Intervention. Referierte Fremdverfahren und experimentelle Kontrollen tragen keine zusätzliche Stage. Das entfernt bei T8R8RKX9 Pre- und Post-Processing.
7. Höherer Bildungs- und professioneller AI-Literacy-Unterricht wird als `Education_Professional` codiert. Der evaluierte Hochschulkurs von 7VFNS5R3 erfüllt die eingefrorene Einschränkung dieses Werts.
8. Ein angehefteter Suchterm muss die Paper-Ebene zeichengetreu wiedergeben. Reine PDF-Whitespace-Normalisierung ist dokumentierbar; die veränderte Großschreibung im ar2-Beleg von 7VFNS5R3 ist eine Belegabweichung.
9. Die Bezeichnung Blog entscheidet den Publikationstyp nicht allein. THGC3PA2 ist aufgrund des nichtkommerziellen Hochschulkontexts, der identifizierten Fachautorin, der Quellenbasis und des substanziellen Fachbeitrags als zugelassener fachwissenschaftlicher Kommentar einzuordnen.

## Operatorannahme und produktive Übernahme

Die Anweisung, Ergebnisse direkt in die echten Forschungsdaten zu schreiben und Milestone 1 vollständig auszuführen, wurde am 22.08.2026 als Operatorannahme dokumentiert. Der fixierte Konsens wurde kontrolliert nach `docs/data/screening/ar2.json` übernommen. Der produktive Track trägt den Status `ratified_agent_consensus`, bewahrt `actor=agent`, referenziert den Konsens-Hash `5efa0727c2e4a60795f66592d0357fc2d6e92afb9022ccebedd523c960e44d4c` und hat den SHA-256-Wert `38ab5796c6018b5fbde6a9cb562a4ececfb4c0c88dcaea86cb18325fb0fdd392`. Die mechanische Projektion, die unveränderten Rohtracks, die zehn Records, die Dimensionsableitung, die Beleg-Literalität und die vollständigen Include-Analysen wurden erneut geprüft. Das Übernahme-Gate ist geschlossen.
