# Quellengebundenes Agentenreview des Themenkandidaten

- Revieweridentität: Subagent `/root/dev_extraction_now`, Runtime-Default, exakter Modell-Identifier nicht exponiert; nicht der Producer des Themenkandidaten.
- UTC-Zeit: 2026-10-31T21:01:51Z.
- Original: `evaluation/paper-2026-10-31/development/themes/original.md`.
- Original-SHA256: `8C089A499545590DE52AECCCD87B2FBC286F56095A5C6F132C7F912292EEC8CC`.
- D01, `docs/data/fulltext/ET4MMZGH.md`, SHA256: `6CDFCD76B60B5BFBE705E5619E85FB539DAD523F178BF6830FE265649EDCC0F0`.
- D02, `docs/data/fulltext/2EBHMYU4.md`, SHA256: `A2C87D3702B11A580F428735A07D20DA3CBDC595F12B39952B9DD85D18044193`.
- D03, `docs/data/fulltext/UIIDCXLB.md`, SHA256: `8A1168C05555303884970C61E319F3F6C6EECDD510C78E198F5188E6676DF7BB`.

## Ergebnis und Reviewgrenze

Der Themenkandidat erhält Quellentypen, die Grenzen experimenteller Befunde und den zusätzlichen Interpretationsschritt überwiegend zutreffend. Keine zentrale Themenkette erwies sich als unbelegt. Präzisierung benötigen die universell klingende Notwendigkeit von Sichtbarkeit in T02, die Bezeichnung bestimmter Antworten als Verweigerung in D03-A03 und die Referenzkette für Datenkategorien in T04. Diese Punkte entwerten die jeweiligen interpretativen Kerne nicht.

Der Review ist nicht verblindet. Derselbe Reviewer hat zuvor eine eigene strukturierte Extraktion der drei Quellen erstellt und gesehen. Diese Vorbefassung weicht ausdrücklich vom Reinheitsideal des Reviewprompts ab; sie war im neuen Reviewauftrag offengelegt und autorisiert. Der Reviewer hat keinen anderen Agentenkandidaten als den jetzt zu prüfenden Themenkandidaten gelesen. Beide Originale bleiben unverändert. Keine menschliche Referenz, Evaluationstexte oder Webquellen wurden verwendet. Keine menschliche Verifikation oder Akzeptanz wird behauptet.

Die vollständige Quellenlektüre erfolgte im unmittelbar vorausgehenden Lauf desselben Agentenkontexts: D01 Zeilen 1–113, D02 1–179, D03 1–206, in aufeinanderfolgenden, nicht abgeschnittenen Toolausgaben. Für den Review wurden Original, Reviewprompt und Themenprompt vollständig gelesen und die aktuellen Datei-Hashes erhoben. Keine zweite vollständige Quellenlektüre wird behauptet. Die Hashes dokumentieren den gegenwärtigen Dateistand; vor der Erstlektüre wurden keine Hashes erhoben. Identität zwischen Erstlektüre und Hashzeitpunkt ist daher nicht durch zwei Hashmessungen abgesichert.

## Prüfung der quellenspezifischen Aussagen

Alle Fundstellen beziehen sich auf die oben identifizierten Serving-Dateien. „Vollständig gestützt“ bezeichnet hier die Tragfähigkeit der beschriebenen Aussage beziehungsweise ausdrücklich markierten Interpretation durch diesen Text, keine Bestätigung der Primärstudien, auf die er verweist. Fehlercodes sind nur bei festgestelltem Korrekturbedarf vergeben.

| Kandidaten-ID | Urteil und Codes | Fundstelle und kurzes Belegzitat | Begründung und erforderliche Korrektur |
|---|---|---|---|
| D01-A01 | Vollständig gestützt; keine | „Where AI Gender Bias Comes From“, Absatz „Developers tell algorithms what variables“: „women having less time to chat online“; „a proxy called ‘social data’“ (typografische Anführungszeichen hier normalisiert) | Proxy, Sorgearbeit, verminderte digitale Aktivität und Benachteiligung stehen in derselben Passage. Der Code „Sichtbarkeit ersetzt Kompetenz“ ist eine zugespitzte Interpretation, durch die explizite Kennzeichnung als Code und die nachfolgende Reichweitenbegrenzung vertretbar. Keine Korrektur nötig. |
| D01-A02 | Vollständig gestützt; keine | Derselbe Abschnitt, „Data that isn’t disaggregated“: „concealing important differences“; „Labeling of data“: „simplistic, binary female-male categories“ | Beide Spannungsseiten sind vorhanden: fehlende Differenzierung und reduktive Kategorisierung. Das Thema, dass mehr Daten allein nicht genügen, ist ein nachvollziehbarer zusätzlicher Schluss. Die zugleich empfohlenen Datenpraktiken verhindern eine pauschale Lesart gegen Datenerhebung. |
| D01-A03 | Vollständig gestützt; keine | „Impacts of Gender-Biased AI“, „Gender-biased AI not only“ und Folgeabsätze: „publicly available instances of bias“; „erasure of already marginalized gender identities“ | Herkunft der Fallsammlung, alle aufgeführten Schadensfamilien und die Beschränkung auf problematisch erfasste Systeme sind richtig. Die Quelle liefert keine repräsentative Stichprobe, daher ist die Warnung vor Prävalenzschlüssen sachgerecht. |
| D01-A04 | Vollständig gestützt; keine | „What Social Change Leaders Can Do“, Punkt 2: „advocate for AI literacy training“; „What ML Developers Can Do“, Einleitung: „Intending to build a system for good is not enough“; Punkte 2–4 | Expertise, Dokumentation/Audits, Beteiligung und Governance sind an den genannten Stellen vorgeschlagen. Die Darstellung macht aus ihnen keinen Wirkungsnachweis. „Organisationsübergreifend“ ist eine zulässige Synthese der Rollen und Partnerschaften, keine eigene gemessene Eigenschaft. |
| D02-A01 | Vollständig gestützt; keine | §3.1, „The reports raise“: „deeply intertwined“; „Importantly, the reports emphasize“: „discriminatory workplace practices leading to discriminatory tools“ | Der Kandidat unterscheidet korrekt zwischen eigenem Framingbefund und nicht selbst gemessener Unternehmenskausalität. §3.2, „women. Furthermore, documents refer to each other“, trägt die Abhängigkeitsgrenze. |
| D02-A02 | Vollständig gestützt; keine | §3.2, „To summarize, while all four reports“, Fortsetzung: „remain voiceless and marginalized“ | Regionale, institutionelle und berufliche Konzentration werden ausdrücklich kritisiert. Die Formulierung einer selbstkritischen Wissensprüfung bleibt eine plausible thematische Interpretation. Der Beitrag der Berichte wird in §4 ausdrücklich anerkannt; der Gegenbeleg ist erhalten. |
| D02-A03 | Vollständig gestützt; keine | §3.4, „The reports emphasize a critical moment“: „ability to exert influence“; „To tackle the development“: „participation washing“ | Die Unterscheidung von numerischer Repräsentation, bloßer Teilnahme und wirklichem Einfluss steht explizit im Text. Ziele und Quoten werden im Folgeabsatz „Similarly, S. M. West“ ebenfalls vorgeschlagen; der Kandidat behandelt sie korrekt als ergänzend. |
| D02-A04 | Vollständig gestützt; keine | §3.4, „Importantly, the reports also suggest exploring“: „should not be deployed“; „some things may not be able to be fixed“ | Verzicht/Abbruch gehört ausdrücklich zu den referierten Empfehlungen. Der vorherige Absatz zu inklusiven Stellenanzeigen begrenzt eine pauschale Anti-AI-Lesart. Keine Korrektur nötig. |
| D02-A05 | Vollständig gestützt; keine | §4, „Nevertheless, the problems“: „rather than part of the core AI agenda“; Schlusszitat nach „This study contributes“: „serving merely as a buzzword“ | Politische Marginalisierung und begriffliche Entleerung sind unterschiedlich belegte Warnungen. Der Kandidat kennzeichnet Diskussion und referierte Konzeption, ohne empirische Häufigkeit zu erfinden. |
| D03-A01 | Vollständig gestützt; keine | §5, „Figure 2. Figure 2 shows“: „on average a Human Persona with System 2 prompting best reduces social bias“; „Modeland Bias-specific Prompting Effects“: „but that is not universal“ | Die Behauptung ist auf berichtete Antwortanteile im konkreten Benchmark beschränkt. Das Gegenbeispiel GPT-4/Profession steht in §5 und ist erhalten. Bilddaten selbst fehlen, der Fließtext trägt die qualitative Darstellung. Keine Korrektur erforderlich. |
| D03-A02 | Vollständig gestützt; keine | §5, „A surprising result“: „CoT leads to an increase in stereotypical responses“; §6, „Now we further investigate“: „least correlated with the System 2 prompt variant“ | Aggregierte Minimalpaare, Korrelationsvergleich und fehlender Nachweis kognitiver Mechanismen sind korrekt getrennt. Ausnahme Llama 2/Religion und günstigere Abstractdarstellung werden zutreffend als Grenzen genannt. Tabelle 2 bestätigt die qualitative Korrelationsordnung. |
| D03-A03 | Korrekturbedürftig; `overstated` | §7, „We excluded certain examples“: „state that promoting stereotypes is inappropriate“; „as anti-stereotype responses“ | Ausschlüsse und Codierung sind korrekt. Der Code „Verweigerung wird Antistereotypie“ ist stärker als die beschriebene Antwortklasse: Die Passage nennt stereotypekritische Aussagen, nicht ausschließlich oder zwingend ausdrückliche Antwortverweigerungen. Korrektur: „Stereotypenkritik wird als Antistereotypie gewertet“. Die Interpretation, dass dies eine Auswertungsentscheidung darstellt, sowie die offen gelassene Effektrichtung bleiben bestehen. |

D01-A01 enthält in der Reviewtabelle ein zusätzliches kurzes Zitat mit normalisierten typografischen Anführungszeichen; die tragenden wortgetreuen Belegfolgen sind „women having less time to chat online“ und „social data“. Es wurde kein Zitat aus der externen Primärliteratur als selbst gelesene Quelle ausgegeben.

## Prüfung der Themenketten und Alternativen

### T01 — Vollständig gestützt als ausdrücklich interpretative Zusammenführung

**Fehlercodes:** keine. **Geprüfte Kette:** D01-A04, D02-A03/A04, D03-A01/A03. Alle genannten Quellen tragen jeweils eine andere Entscheidungsebene: D01, „What ML Developers Can Do“, „Intending to build a system for good is not enough“; D02 §3.4, „ability to exert influence“ und „should not be deployed“; D03 §5/§7, „not universal“ und „as anti-stereotype responses“.

Der Kandidat behauptet kein gemeinsam evaluiertes Maßnahmenmodell. Die Alternative, Promptänderungen könnten institutionelle Veränderungen ersetzen, ist anhand des begrenzten Gegenstands von D03 überzeugend zurückgewiesen. Sie ist allerdings eine schwache, vom Kandidaten selbst konstruierte Gegenposition: Keine der Quellen vertritt sie. Keine sachliche Korrektur nötig; für eine anspruchsvollere Alternativenprüfung wäre die Lesart denkbar, dass die Entscheidungsebenen zwar nebeneinander bestehen, aber keine gemeinsame Handlungslogik benötigen. Dies ist ein methodischer Verbesserungsvorschlag, kein Fehlerbefund.

### T02 — Korrekturbedürftig im Titel, tragfähiger begrenzter Kern

**Fehlercode:** `overstated`. **Geprüfte Kette:** D01-A02, D02-A02, D03-A03. D01, „Data that isn’t disaggregated“, „concealing important differences“, trägt die Bedeutung differenzierter Erfassung. D02 §3.2, „remain voiceless and marginalized“, trägt Ausschlüsse durch die Wissensbasis. D03 §7, „providing invalid responses“, trägt eine technische Auswertungsselektion.

Der Titel „Sichtbarkeit ist notwendig“ formuliert eine unbeschränkte normative Notwendigkeit. Besonders D03 belegt keine Notwendigkeit, sämtliche Antworten sichtbar zu halten; der Kandidat erkennt selbst, dass Bereinigung und gesellschaftlicher Ausschluss nicht gleichzusetzen sind. Korrektur des Titels: „Sichtbarkeit wird durch Auswahlentscheidungen hergestellt“. Die Zusammenführung über Auswahlfolgen und die ausdrücklich erhaltene alternative Lesart sind tragfähig. Die mögliche Auswirkung ausgeschlossener Antworten bleibt unbekannt.

### T03 — Vollständig gestützt als interpretative Verbindung

**Fehlercodes:** keine. **Geprüfte Kette:** D01-A04, D02-A03/A05, D03-A02. D01s „for good“, D02s „participation washing“ (§3.4) und „serving merely as a buzzword“ (§4) sowie D03s „CoT leads to an increase“ (§5) tragen die Unterscheidung zwischen Ansprüchen und beobachteten Ergebnissen.

Die zusätzliche Abstraktion liegt im Begriff Verfahrensbezeichnung. Der Kandidat benennt sie und hält die verschiedenen Mechanismen auseinander. Die Alternative, D03 betreffe eine kognitive Analogie und D02 Macht, wird nicht wegargumentiert, sondern als Grenze akzeptiert. Keine Korrektur nötig.

### T04 — Korrekturbedürftige Referenzkette, plausible Bildungsübertragung

**Fehlercode:** `context_lost`. **Geprüfte Kette:** D01-A04, D02-A03/A04, D03-A02/A03. Literacy ist durch D01, „What Social Change Leaders Can Do“, Punkt 2, „AI literacy training“, ausdrücklich belegt. Einfluss und Einsatzgrenzen sind durch D02 §3.4, „ability to exert influence“/„should not be deployed“, gedeckt. Prüfbedarf bezüglich Promptvarianten und Auswertung entsteht als zulässige Interpretation aus D03 §5/§7.

Der konkret genannte Lerngegenstand „Datenkategorien“ ist in der aufgeführten Kette nicht präzise verankert. Seine eigentliche Passage steht in D01-A02: „simplistic, binary female-male categories“. Korrektur: D01-A02 als Herkunft ergänzen. Die Übertragung auf professionelle Bildung ist klar markiert; keine Bildungswirkung und keine Evaluation in Sozialer Arbeit werden behauptet. Die Alternative eines primären Prompttrainings wird zutreffend an Modell- und Kategorieabhängigkeit begrenzt.

## Weitere Aussagen, Auslassungen und Protokollfragen

Die unnummerierte Eingangssynthese ist durch D01-A04, D02-A03 und D03-A01/A02 in der genannten begrenzten Lesart gestützt. Sie sollte bei strikter Anwendung des gemeinsamen Prompts eine eigene ID oder einen expliziten Verweis auf T01/T03 erhalten. Fehlende Work-/Source-Version-Header sowie die angegebenen Veröffentlichungsdaten von D01/D02 stimmen mit den gelesenen Texten überein. D03 hat im vorhandenen Header kein verlässlich ausgewiesenes Datum. Die Dateischlüssel werden korrekt nicht zu geregelten Versionskennungen umgedeutet.

Folgende auffällige Auslassungen sind Befunde dieses Agenten, keine Simulation einer menschlichen Referenz und bei offener thematischer Auswahl nicht automatisch Fehler:

- D01s explizite feministische Datenprinzipien, besonders lokales und Indigenes Wissen sowie Kritik ungleicher Macht, könnten T02 und T04 genauer tragen. Fundstelle: „What Social Change Leaders Can Do“, Punkt 1, „priority given to local and Indigenous knowledge“.
- D02s Spannung zwischen nichtbinärem/intersektionalem Anspruch und eingeschränkter empirischer Datenlage bleibt gegenüber den anderen Themen unterbelichtet. Fundstelle: §3.3, „Documents discuss a well-known problem“, „limited availability of intersectional data“. Dies wäre eine quellennahe Erweiterung von T02, kein neuer äußerer Rahmen.
- D03s ungleiche Modellbedingungen werden nicht vertieft: §4/Fußnoten nennt für GPT-4 eine GenAssocBias-Teilstichprobe und für Llama 2/Mistral Quantisierung. Das entkräftet den qualitativen Befund nicht, begrenzt aber modelübergreifende Vergleiche. Die fehlenden Abbildungen verhindern die Prüfung einzelner Baselines, Effektgrößen und sämtlicher Rankings.

Die Durchführungsaussagen über den Producerlauf sind nur begrenzt reviewbar. Die vorliegenden Quellen stützen die genannten Extraktionsartefakte und fehlenden Bild-/Supplementinhalte. Ob der Producer tatsächlich ausschließlich die aufgeführten Dateien las, keine abgeschnittene Ausgabe erhielt und keine Dateien änderte, lässt sich aus dem Kandidatentext selbst nicht unabhängig feststellen. Urteil zu diesen Laufbehauptungen: ungeklärt; keine inhaltlichen Fehlercodes vergeben. Der Kandidat legt seinen nicht vollständig isolierten Regelkontext selbst offen.

## Abschluss

Der Review hat alle nummerierten Quelleneinheiten und Themenketten geprüft, darunter auch ihre ausdrücklich genannten Gegenbeispiele und Alternativen. Wegen gebündelter Evidenzeinheiten ist dies keine vollständige Neucodierung aller Quellenaussagen. Eine Accuracy-Quote oder menschliche Akzeptanz wird nicht ausgewiesen. Original und Quellen wurden nicht verändert; vorgeschlagene Korrekturen bleiben Empfehlungen für einen getrennten Folgeschritt.