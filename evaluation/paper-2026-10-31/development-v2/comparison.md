# Vergleich der diagnostischen Entwicklungsläufe v1 und v2

V2 ist in allen drei Verfahren qualitativ besser prüfbar und behebt mehrere konkrete Überdehnungen des ersten Laufs. Die Extraktion gewinnt vor allem an getrennten Evidenzeinheiten und Ergebnisabdeckung, die Themenanalyse an präzisen Begriffs- und Referenzketten, das Framing an der Trennung von Beteiligungsforderung, Entscheidungsmacht und kognitiver Deutung. Einzelne Überstärkungen und Auslassungen bleiben bestehen.

| Verfahren | Urteil | Praktische Bedeutung |
|---|---|---|
| Strukturierte Extraktion | besser, mit Korrekturbedarf | Maßnahmen und berichtete Zahlen sind einzeln prüfbar. Die Sozialarbeitsmatrix ist präziser. Verweigerung und einzelne normative Verstärkungen bleiben problematisch. |
| Offene Themenanalyse | besser, mit verbleibenden Grenzen | Bekannte Begriffsfehler sind behoben, Kategorien und Bildungsübertragung besser verankert. Eine schwache Alternativlesart bleibt bestehen. |
| Framing | besser, mit verbleibenden Auslassungen | Die behauptbare Reichweite von Machtübertragung und kognitiven Deutungen wird genauer begrenzt. Kategorienkritik und theoretische Nuancen bleiben selektiv. |

Die Urteile betreffen diese konkreten Artefakte auf den gelieferten Entwicklungsquellen. „Besser“ bedeutet hier eine begründete qualitative Vergleichsbeurteilung durch einen AI-Reviewer. Es bezeichnet weder eine statistische Accuracy noch menschliche Verifikation oder einen Nachweis allgemeiner methodischer Überlegenheit.

## Prüfkontext und Reichweite

Reviewer ist `/root/compare_v1_v2`, ein eigener Kontext ohne Beteiligung an der Erstellung der verglichenen Originale. Der exakte Runtime-Modell-Identifier ist nicht exponiert. Bei der Beauftragung war die Existenz früherer Defekte bekannt. Anschließend wurden beide Varianten und die v1-Reviews bewusst vergleichend gelesen. Der Review ist deshalb unabhängig von der Produktion, aber weder verblindet noch eine unabhängige Replikation aller vorherigen Prüfungen.

Vollständig gelesen wurden die drei lokalen Quellen ET4MMZGH, 2EBHMYU4 und UIIDCXLB einschließlich Referenzen und Seitentext sowie sämtliche sechs Originale und drei v1-Reviews. Eine gekürzte frühe Sammelausgabe der Kandidaten wurde durch Einzel- und Teilreads ersetzt. D01 wurde zusätzlich vollständig einzeln gelesen, D02 und D03 in ungekürzten aufeinanderfolgenden Chunks. Die finale Extraktion wurde erst nach Abschlussmeldung und Übereinstimmung ihres Hashes beurteilt. Schreibzwischenstände gehen nicht als Auslassung in das Urteil ein.

Zusätzlich gelesen wurden die Identitätsdatei `development-v2/inputs.json`, das abschließende Extraktionsprotokoll sowie erforderliche Arbeits- und Schreibregeln und Projektsteuertext. Es wurden keine Evaluationstexte, menschlichen Referenzen oder Webquellen gelesen. Grokipedia war vollständig ausgeschlossen. Die Untersuchung bleibt privat, ohne Publikation oder Änderung produktiver Annotationen.

Die Quellenbelege unten beziehen sich jeweils auf die vollständig gelesene Entwicklungsquelle. D01s zitierte Studien und D02s analysierte Originalberichte wurden nicht separat gelesen. D03s Figuren und Supplemente fehlen im Input. Weder die rechnerische Reproduktion der publizierten Effekte noch die Vollständigkeit gegenüber den Originalpublikationen ist festgestellt. Der Review prüft die Quellendarstellung, nicht die Wahrheit sämtlicher darin referierter Ergebnisse.

## Konfundierung des Vergleichs

Neben den überarbeiteten Prompts änderte sich nach dem Laufauftrag auch die Ausführung. Die Wortbegrenzung wurde entfernt, und die Produzenten erhielten zusätzliche Identitätsangaben über das Inputmanifest. Die Quelldateien selbst besitzen weiterhin keinen vollständigen Source-Version-Header. Diese Zusatzangaben erleichtern Identifikation, beheben aber die fehlende tatsächliche Source-Version nicht.

Die größere Detailtiefe kann aus Promptänderung, verfügbarer Ausgabelänge, zusätzlichem Kontext oder deren Zusammenspiel entstehen. Ein kausaler Prompt-only-Effekt lässt sich daraus nicht ableiten. Je Verfahren liegt hier ein diagnostischer Vergleich vor. Wiederholungsstabilität, Nutzen für menschliche Reviewer, vollständige Fehlerabdeckung und generalisierbare Methodenqualität bleiben offen. Die v1-Reviews zu Extraktion und Themen hatten zudem gegenseitige Producer-Vorbefassung, die sie selbst ausweisen.

## Quellengebundene Vergleichsbefunde

### Strukturierte Extraktion

#### E01

V1 `D01-03`, v2 `D01-07`.

Das absolute Ausschließen wird auf eine verringerte Abbildungsmöglichkeit begrenzt. Die neue Wendung „fluid gewählter Identität“ fügt allerdings eine Wahlkomponente hinzu, die diese Passage nicht behauptet.

Die Belegstelle ist `ET4MMZGH.md, Where AI Gender Bias Comes From, Labeling of data`. Kurze Belegfolgen sind „reduces the potential for AI to reflect gender fluidity and self-held gender identity“. „Geschlechterfluidität und selbstbestimmte Geschlechtsidentität“ verwenden.

#### E02

V1 `D01-08; D02-06`, v2 `D01-34–44; D02-25–39`.

Zuvor gebündelte Maßnahmen erhalten eigene IDs und passende Fundstellen. Dokumentation, Audits, Bezahlung, Beteiligung und Nichtnutzung lassen sich getrennt prüfen.

Die Belegstelle ist `ET4MMZGH.md, What ML Developers Can Do, 2–4; 2EBHMYU4.md, 3.4, Similarly / To tackle`. Kurze Belegfolgen sind „Datasheets for Datasets“, „model cards“, „ending pay and opportunity inequality“, „participation washing“.

#### E03

V1 `D01-05; D03-05`, v2 `D01-11–18; D03-27–48, D03-62–63`.

Die Fallsammlungszahlen und zusätzliche Kategorienergebnisse sind jetzt explizit erfasst. Selektiver Nenner und fehlende Grafikprüfung bleiben sichtbar. Dies ist breitere berichtete Ergebnisabdeckung, keine neue Messung.

Die Belegstelle ist `ET4MMZGH.md, Impacts; UIIDCXLB.md, 5, kategorienspezifische Absätze`. Kurze Belegfolgen sind „44.2 percent (59 systems)“, „25.7 percent (34 systems)“, „approximately 2 to 5 percent“, „up to a 10 percent reduction“.

#### E06

V1 `Vergleichsmatrix SQ1`, v2 `Vergleichsmatrix, SQ1 untersuchtes Setting Sozialer Arbeit; SYN-05`.

Die Matrix trennt fehlende Sozialarbeitssettings von angrenzenden Sektoren, allgemeinen Kontexten und Benchmarkversuchen. Das frühere mehrdeutige „Gefunden“ ist für das eigentliche Sozialarbeitssetting durch „K“ ersetzt.

Die Belegstelle ist `ET4MMZGH.md, Einleitung / Impacts; 2EBHMYU4.md, 2.2; UIIDCXLB.md, 3–4`. Kurze Belegfolgen sind „health care, welfare“, „four high‐profile reports“, „two bias detection datasets“.

#### E04

V1 `D03-07`, v2 `D03-50`.

Die Grenzspalte nennt weiterhin „Normbewusstsein/Verweigerung“. Die Quelle beschreibt stereotypekritische Antworten, ohne sie notwendig als Antwortverweigerung auszuweisen. Dasselbe Problem war im v1-Themenreview erkannt, im v1-Extraktionsreview jedoch nicht beanstandet worden.

Die Belegstelle ist `UIIDCXLB.md, 7, We excluded certain examples`. Kurze Belegfolgen sind „state that promoting stereotypes is inappropriate“. Stereotypenkritik, Optionswahl und ausdrückliche Verweigerung auseinanderhalten.

#### E05

V1 `keine entsprechende Einheit`, v2 `D02-31`.

„Verbindliche Ziele“ verstärkt „actionable targets“ um einen Bindungsgrad. Die separate Quotenforderung macht Ziele nicht automatisch verbindlich.

Die Belegstelle ist `2EBHMYU4.md, 3.4, Similarly, S. M. West`. Kurze Belegfolgen sind „actionable targets, incentives, and quotas“. „Umsetzbare Ziele“ oder „konkrete Handlungsziele“ schreiben.

### Offene Themenanalyse

#### T01

V1 `D03-A03; T02`, v2 `D03-P12; T02-A`.

Stereotypkritik wird ausdrücklich von Verweigerung unterschieden. Die universelle Notwendigkeitsbehauptung über Sichtbarkeit entfällt. Die Synthese bindet Datenrepräsentation und Einfluss nun an getrennte Passagen.

Die Belegstelle ist `UIIDCXLB.md, 7; ET4MMZGH.md, Where AI Gender Bias Comes From; 2EBHMYU4.md, 3.2–3.4`. Kurze Belegfolgen sind „as anti-stereotype responses“, „concealing important differences“, „ability to exert influence“.

#### T02

V1 `T04; fehlende Ergänzungen laut review.md`, v2 `T02-C; D01-P07; D02-P05–06`.

Die Bildungsübertragung verankert Datenkategorien in D01-P03. Lokales/indigenes Wissen und die eingeschränkte intersektionale Datenlage werden explizit aufgenommen.

Die Belegstelle ist `ET4MMZGH.md, Social Change Leaders, 1; 2EBHMYU4.md, 3.2, To study; 3.3, Documents discuss`. Kurze Belegfolgen sind „priority given to local and Indigenous knowledge“, „limited data availability hinders opportunities for intersectional analysis“.

#### T03

V1 `T01 Alternative`, v2 `T01-B`.

Die Alternative, gezieltes Prompting reiche für Bias-Bearbeitung aus, bleibt schwach. D03-P02 trägt den begrenzten Mittelwertvorteil, keine Hinlänglichkeitsbehauptung. Ein zitierter Anker macht diese starke Gegenposition noch nicht zu einer quellengetragenen Lesart.

Die Belegstelle ist `UIIDCXLB.md, 5, Figure 2 / Modeland Bias-specific; 2EBHMYU4.md, 3.4, To tackle`. Kurze Belegfolgen sind „on average“, „not universal across models and bias categories“, „wider social analysis“. Als ausdrücklich hypothetische Fehllesart kennzeichnen oder eine ernsthafte Alternative über getrennte Handlungsebenen prüfen.

#### T04

V1 `Auslassung im review.md`, v2 `D03-P13`.

Die GPT-4-Teilstichprobe ist ergänzt. Die Quantisierung von Llama 2/Mistral bleibt als unterschiedlicher Versuchsparameter unberücksichtigt. Bei offener Themenauswahl ist das eine verbleibende Abdeckungsgrenze.

Die Belegstelle ist `UIIDCXLB.md, 4, Fußnoten 2–3`. Kurze Belegfolgen sind „a sample of 2,100 entries“, „4-bit quantized Llama 2 and Mistral“. Bei modelübergreifenden Methodenvergleichen ergänzen.

### Framing

#### F01

V1 `D01-F03`, v2 `F-D01-L06; F-D01-R01; F-X04`.

Die frühere alternative Lesart konsequenter Machtübertragung wird zurückgenommen. Verbindliche Mitentscheidungs- und Vetorechte erscheinen als zusätzliche normative Forderung. Das entspricht der fehlenden institutionellen Ausarbeitung im Text.

Die Belegstelle ist `ET4MMZGH.md, What ML Developers Can Do, 3–4`. Kurze Belegfolgen sind „Center the voices of marginalized community members“, „gender-sensitive governance approaches“.

#### F02

V1 `D03-F02; Auslassungen im review.md`, v2 `F-D03-T02; F-D03-T03; F-D03-R01`.

Mechanismusdeutung, Antwortkorrelation und starke Transferbehauptung der Quelle werden jetzt gesondert überprüft. Ihre Evidenzgrenzen werden nicht durch die zusätzliche Detailtiefe aufgehoben.

Die Belegstelle ist `UIIDCXLB.md, 5, Another surprising result; 6; 8`. Kurze Belegfolgen sind „similar to Solomon's Paradox“, „most similar to the Standard zeroshot prompt“, „robust and applicable across different contexts“.

#### F03

V1 `Auslassungen im review.md`, v2 `F-D02-T01; F-D03-T01–T03`.

Die Spannung zwischen nichtbinärem Anspruch und binärer Datenbasis sowie die theoretische Einschränkung, dass logisches Denken auch ohne System 2 möglich ist, bleiben ohne eigene Rekonstruktion. Die institutionelle Herkunftskritik und der fehlende Mechanismusnachweis decken diese anderen Punkte nicht vollständig ab.

Die Belegstelle ist `2EBHMYU4.md, 3.3, Documents discuss; UIIDCXLB.md, 2, Coming to the Dual Process Theory`. Kurze Belegfolgen sind „limited availability of intersectional data“, „logical thinking does not just belong to System 2“. Für vertiefte Theorieprüfung ergänzen.

## Gleich gebliebene Stärken und Grenzen

Alle drei v2-Originale erhalten die bereits in v1 richtige Unterscheidung zwischen aggregierten CoT-Nachteilen und einzelnen günstigeren Modell-Kategorie-Kombinationen. Beleg sind UIIDCXLB, Abschnitt 5, „A surprising result“, und die Religion-Fortsetzung nach Tabelle 2. Extraktion D03-X01, Themen D03-P03/P04/P07 und Framing F-D03-C01–C03 bewahren diese unterschiedlichen Ebenen. Dieser Punkt ist eine erhaltene Stärke, kein neuer Erfolg von v2.

Die Abgrenzung zwischen Empfehlung und nachgewiesener Wirkung sowie zwischen Benchmarkantwort und professioneller Sozialarbeit war ebenfalls bereits vorhanden und bleibt erhalten. Die schärfere Darstellung in v2 erweitert die Evidenz selbst nicht. D01 und D02 evaluieren kein gemeinsames Bildungsprogramm, D03 untersucht Lückensatzaufgaben.

Die v2-Extraktion erfasst die im früheren Review vermisste politische Marginalisierung intersektionaler Fragen weiterhin hauptsächlich als offene Forschungsfrage in D02-18. Die konkrete Gefahr des Abdrängens aus der Kernagenda steht in 2EBHMYU4, Abschnitt 4, „Nevertheless“, mit „rather than part of the core AI agenda“. Themen D02-P13 erfasst sie ausdrücklich. Dies ist eine verbleibende Abdeckungsdifferenz zwischen Verfahren.

Die hinzugefügten Numerikangaben sind als berichtete Werte prüfbar. Ihre Zahl ist keine Qualitätskennzahl. V2 gibt sie als Quellenwerte wieder. Eine unabhängige Neuberechnung aus der Fallsammlung ist damit nicht erfolgt.

## Artefaktbindung und Abschluss

`comparison.json` bindet alle gelesenen Originale, v1-Reviews und Entwicklungsquellen durch beim Abschluss erhobene SHA-256-Werte. Die Hashes fixieren den Prüfgegenstand, ohne frühere Producer-Lesehandlungen zu beweisen. Producerangaben über ihre vollständige Lektüre, Isolation oder Werkzeugläufe werden als Protokollangaben behandelt.

Die Abschlusskontrolle umfasst vollständige Artefaktlektüre, Quellenabgleich der genannten Befunde, Hashbindung und syntaktische Prüfung der JSON-Datei. Keine Accuracy, menschliche Referenz, Akzeptanz oder Publikationsfreigabe wurde erzeugt.
