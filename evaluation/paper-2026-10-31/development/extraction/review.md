# Quellengebundenes Agentenreview des Extraktionskandidaten

Reviewer: Agent `/root/dev_themes_now`, anderer Agent als der Extraktionsproducer; Runtime-Default, exakter Modellbezeichner nicht verlässlich exponiert.
UTC: 2026-10-31T21:01:49.5585271Z
Original: `evaluation/paper-2026-10-31/development/extraction/original.md`
Original-SHA256: `7BCDF9051F7C5BC713D7C67BAF6677E7FC3356C7A21ABC64858C7A48A6EBB699`

| Fall | Gelesene Quelle | SHA256 |
|---|---|---|
| D01 | docs/data/fulltext/ET4MMZGH.md | 6CDFCD76B60B5BFBE705E5619E85FB539DAD523F178BF6830FE265649EDCC0F0 |
| D02 | docs/data/fulltext/2EBHMYU4.md | A2C87D3702B11A580F428735A07D20DA3CBDC595F12B39952B9DD85D18044193 |
| D03 | docs/data/fulltext/UIIDCXLB.md | 8A1168C05555303884970C61E319F3F6C6EECDD510C78E198F5188E6676DF7BB |

## Prüfstatus und Vorbefassung

Dies ist ein nicht verblindetes Agentenreview, keine menschliche Verifikation. Ich habe zuvor dieselben Quellen vollständig für eine eigene thematische Analyse gelesen und diesen Themenkandidaten erzeugt. Damit ist die Anforderung des Reviewprompts, keinen anderen Kandidaten gesehen zu haben, nicht erfüllt. Diese Abweichung ist im neuen Reviewauftrag ausdrücklich benannt; die Rollenverschiedenheit zum Extraktionsproducer bleibt bestehen.

Für den Review wurden Originalkandidat, `prompts/review.md` und `prompts/extraction.md` vollständig gelesen. `prompts/common.md` und alle drei Quellentexte waren im vorausgehenden Lauf vollständig gelesen worden. Die aktuelle Prüfung nutzt diese Lektüre; Quellenhashes wurden jetzt erhoben. Keine Evaluationsquellen, menschlichen Referenzen oder Webquellen wurden herangezogen. Original und Quellen bleiben unverändert.

Die ausgewiesenen Work-IDs und geregelten Source-Versionen fehlen in den Quellenheadern. Die Hashes identifizieren die Serving-Dateien, ersetzen aber keine geregelte Source-Version.

## Ergebnis

Der Kandidat unterscheidet überwiegend korrekt zwischen eigener Empirie, referierten Empfehlungen und eigener Übertragung. Insbesondere D03-04 erhält die entscheidende Aggregatbegrenzung der CoT-Aussage. Korrekturbedarf besteht bei der Stärke einer Geschlechterklassifikationsaussage, bei einzelnen Fundstellen, der Atomarität und der auf Soziale Arbeit bezogenen Vergleichsmatrix. Fehlende Bilddaten begrenzen die unabhängige Prüfung numerischer Resultate.

Die folgenden Zeilen prüfen jede nummerierte Kandidateneinheit. „Vollständig gestützt“ gilt jeweils für den im Kandidaten ausdrücklich begrenzten Aussageumfang im Serving-Text, nicht für eine unabhängige Bestätigung des berichteten Befunds. „—“ bedeutet kein inhaltlicher Fehlercode. Atomaritäts- und Locatorprobleme werden gesondert beschrieben, weil die vorgegebenen Fehlercodes sie nicht präzise erfassen.

## D01

| ID | Urteil / Fehlercodes | Fundstelle und kurzer Beleg | Begründung und erforderliche Korrektur |
|---|---|---|---|
| D01-01 | Vollständig gestützt / — | Einleitung, „Many institutions make decisions“: „who the health care system prioritizes“; Impacts, „In addition, certain systems“: „health care, welfare“; Absatz „Gender-biased AI systems have six primary impacts“: „Voice-recognition systems“ | Sektorbeispiele und Abgrenzung zur Sozialen Arbeit stimmen. Für Sprachverarbeitung den dritten Locator ergänzen; kein sachlicher Änderungsbedarf. |
| D01-02 | Vollständig gestützt / — | Where AI Gender Bias Comes From, „In terms of gender bias from data“: „gender digital divide“; „Data that isn’t disaggregated“: „concealing important differences“ | Zugang, medizinische Stichprobenauswahl und Disaggregation sind korrekt als unterschiedliche Wege dargestellt. Für strikt atomare Extraktion in getrennte Mechanismen aufteilen. |
| D01-03 | Korrekturbedürftig / overstated | Where AI Gender Bias Comes From, „Labeling of data can be subjective“: „reduces the potential for AI to reflect gender fluidity and self-held gender identity“ | „schließt … aus“ ist stärker als die Quelle. Ersetzen durch „verringert die Möglichkeit, Geschlechterfluidität und selbstbestimmte Geschlechtsidentität abzubilden“. |
| D01-04 | Vollständig gestützt / — | Where AI Gender Bias Comes From, „Developers tell algorithms“: „women having less time to chat online“ und „assume male identities“ | Die vorsichtige Mechanismusaussage stimmt. Quelle nennt Sorgearbeit und Schutz vor Belästigung beziehungsweise Identitätswechsel; keine gemessene Effektgröße. Kein Korrekturbedarf. |
| D01-05 | Vollständig gestützt; Locator korrigieren / — | Impacts, Absatzbeginn „Gender-biased AI not only“: „we track publicly available instances“; folgende Absätze bis „In addition, certain systems“ | Schadensfamilien und Auswahlgrenze stimmen. „As part of our work“ ist hier kein Absatzbeginn, sondern ein Satz im ersten Absatz. Locator ersetzen. Einzelne Schadenskategorien benötigen für atomare Auswertung eigene Einheiten. |
| D01-06 | Vollständig gestützt / — | What Social Change Leaders Can Do, Punkt 1: „priority given to local and Indigenous knowledge“; „As one example, Digital Democracy“: „track, analyze, map, and share data“ | Referierte Prinzipien, Vorschlagsstatus und Grenze des Beispiels stimmen. Getrennte Prinzipien bei strikter Atomarität aufteilen. |
| D01-07 | Vollständig gestützt / — | What Social Change Leaders Can Do, Punkte 2–3: „advocating for AI literacy training among gender experts“ und „assess potential AI systems for gender bias“ | Empfehlung zu Literacy und vorgängiger Prüfung belegt. Kein Kompetenz- oder Wirksamkeitsnachweis behauptet. Für Zielgruppenpräzision Literacyforderung an Genderexperten und Systemprüfung an Social Change Leaders getrennt ausweisen. |
| D01-08 | Vollständig gestützt, strukturell korrekturbedürftig / — | What ML Developers Can Do, Punkte 1–4: „Datasheets for Datasets“, „model cards“, „gender-sensitive governance approaches“ | Die Maßnahmen stehen in der Quelle; die referierte Diversitätsstudie wird nicht als eigene Evaluation ausgegeben. Die Einheit enthält jedoch mehrere unabhängig prüfbare Maßnahmen. Für die verlangte atomare Extraktion aufteilen und je Maßnahme die passende Fundstelle verwenden. |

## D02

| ID | Urteil / Fehlercodes | Fundstelle und kurzer Beleg | Begründung und erforderliche Korrektur |
|---|---|---|---|
| D02-01 | Vollständig gestützt / — | §2.2, „To examine the emerging agenda“: „four high-profile reports“; „To analyze how these reports“: „a framing approach“ | Gegenstand, Auswahl und Evidenzart stimmen. Keine Interventionsevaluation behauptet. |
| D02-02 | Vollständig gestützt / — | §2.1, „To examine how AI impacts“: „multiple and overlapping identities“ und „oppression, dominance, and power“ | Konzeption und Machtbezug stimmen. Aussage über weitere Perspektiven wird durch den Absatz „Crenshaw’s focus“ sowie §3.4, „Experts call for research“ getragen. Diese zusätzlichen Locator ergänzen. |
| D02-03 | Vollständig gestützt / — | §3.1, „Importantly, the reports emphasize“: „discriminatory workplace practices leading to discriminatory tools“ | Korrekte Trennung zwischen Framingbefund und neuem Kausalnachweis. |
| D02-04 | Vollständig gestützt / — | §3.3, „While one of the reports“: „Gender is typically understood as non-binary“; „Documents discuss“: „limited availability of intersectional data“ | Anspruch und Datengrenze sind belegt. Für die nichtbinäre Position zusätzlich den ersten Absatz von §3.3 als Locator nennen. |
| D02-05 | Vollständig gestützt / — | §3.2, „To summarize, while all four reports“: „elite ranks in a tiny number of Global North countries“ und „data labeling or content moderation“ | Konzentrierte Wissensproduktion wird korrekt als methodenkritische Interpretation behandelt. |
| D02-06 | Vollständig gestützt, strukturell korrekturbedürftig / — | §3.4, „The reports emphasize a critical moment“: „culture and power“; „Similarly, S. M. West“: „ending pay and opportunity inequality“; „To tackle the development“: „participation washing“ | Maßnahmenbündel belegt, aber der einzelne Locator trägt Arbeitskultur und materielle Ungleichheit nicht allein. Nach Maßnahmen aufteilen und die jeweiligen Absätze ergänzen. Das Originalzitat verwendet andere Anführungszeichen; dies verändert hier nicht den Inhalt. |
| D02-07 | Vollständig gestützt / — | §3.4, „Importantly, the reports also suggest“: „should ultimately be abandoned“ und „remained biased after multiple attempts to fix it“ | Nicht-Einsatz und referiertes Scheitern sind korrekt zugeordnet, ausdrücklich kein eigener experimenteller Nullbefund. |
| D02-08 | Vollständig gestützt / — | §3.4, „The UNESCO (2020) report mentions“: „AI can help employers use gender-sensitive language“ | Potenzial statt gemessener Nutzen korrekt. |
| D02-09 | Vollständig gestützt, strukturell korrekturbedürftig / — | §3.4, „The reports emphasize a critical moment“: „technical and ethical education“; §4, „Nevertheless, the problems“: „not just as an add-on“ | Zwei verschiedene Aussagen und Evidenzarten sind korrekt bezeichnet, sollten aber atomar getrennt werden: referierte Bildungsforderung und eigene Forschungsfrage der Quelle. |

## D03

| ID | Urteil / Fehlercodes | Fundstelle und kurzer Beleg | Begründung und erforderliche Korrektur |
|---|---|---|---|
| D03-01 | Vollständig gestützt / — | §3, „We use two bias detection datasets“; §4.1: „Fill in the BLANK“; §5, „We present our main results“: „percentage (%) of responses“ | Aufgabe, neun Kategorien und Antwortmaß stimmen. Keine intersektionalen Gruppenauswertungen werden im verfügbaren Text berichtet. Abwesenheitsaussagen gelten für diesen Text, nicht ungelesene Supplemente. |
| D03-02 | Vollständig gestützt / — | §4, „We evaluate five major language models“; Fußnote 2: „a sample of 2,100 entries“ und „equal number of examples from each bias category“; Fußnote 3: „4-bit quantized“; Tabelle 1 | Zwölf Varianten und fünf Modelle sind korrekt. Teilstichprobe und Quantisierung werden richtig begrenzt. Für Reproduzierbarkeit könnten die vorhandenen Angaben 2.100 und 4-bit aufgenommen werden; ihr Fehlen macht die bestehende Aussage nicht falsch. |
| D03-03 | Vollständig gestützt als Bericht; numerische Replikation ungeklärt / — | §5, „Figure 2. Figure 2 shows“: „on average a Human Persona with System 2“; „Things do not stop“: „over 3%“; „Modeland Bias-specific“: „not universal“ | Aggregatoptimum und Ausnahme sind korrekt. „over 3%“ wird wortgetreu wiedergegeben und nicht unerlaubt in Prozentpunkte umgerechnet. Rohwerte der Abbildung fehlen; Effektgröße und Aggregationsrechnung sind nicht unabhängig nachprüfbar. |
| D03-04 | Vollständig gestützt / — | §5, „A surprising result“: „for every available minimal pair“ und „CoT leads to an increase“; Kontext zuvor: „averaged across all 5 models and 9 bias categories“ | Besonders geprüfter Punkt: „aggregierten Minimalpaaren“ ist richtig. Es darf nicht zu „CoT erhöht für jedes Modell und jede Bias-Kategorie die Stereotypenrate“ umgeschrieben werden. Gegenbeispiele und Spannung zum Abstract werden korrekt erhalten. Kein Korrekturbedarf. |
| D03-05 | Vollständig gestützt als Bericht; numerische Replikation ungeklärt / — | §5, „Gender. We also observe“: „up to 9 percent“ und „with Mistral 7B, HP System 1 outperforms“ | Zahl und Modell-Prompt-Zuordnungen stimmen. Die Einheit „percent“ bleibt korrekt offen; Abbildungsdaten erlauben hier keine Prüfung der Differenz. |
| D03-06 | Vollständig gestützt / — | §6, „Now we further investigate“: „most similar to the Standard zeroshot prompt“; Tabelle 2 | Die angegebenen Kendall-Werte bestätigen die deskriptive Reihenfolge: ohne Persona 0,4755 Standard, 0,458 System 1, 0,4339 System 2; mit HP 0,4639 versus 0,4423; mit MP 0,4556 versus 0,4372. Dies sind Korrelationen, keine Reduktionsmaße oder Nachweise menschlicher Mechanismen. Die Tabelle belegt auch keinen separaten Signifikanztest der Differenz zwischen diesen Korrelationen; der Kandidat behauptet einen solchen nicht. |
| D03-07 | Vollständig gestützt / — | §7, „We excluded certain examples“: „as anti-stereotype responses“ | Ausschluss und Stereotypenverweigerung sind korrekt unterschieden. Fehlende Ausschlussraten und Sensitivitätsanalysen beziehen sich auf den gelesenen Text. |
| D03-08 | Vollständig gestützte, zulässige Übertragung / — | §5, „Modeland Bias-specific“: „not universal“; §7, „We excluded certain examples“ | Vergleich und Evidenzprüfung sind eine plausible Folgerung aus den beschriebenen Grenzen. Der zusätzliche Interpretationsschritt und die nicht nachgewiesene Bildungswirkung sind ausdrücklich markiert. |

## Vergleichsmatrix, Zusammenführung und Arbeitsbegriffe

| Einheit | Urteil / Fehlercodes | Beleg und Begründung | Erforderliche Korrektur |
|---|---|---|---|
| Matrix SQ1, D01–D03 | Korrekturbedürftig / context_lost | Der Methodenprompt fragt nach Aufgaben und Settings der Sozialen Arbeit. D01 nennt sektorale Beispiele („health care, welfare“), D02 untersucht Berichte (§2.2), D03 Lückensatz-Benchmarks (§3/4.1). Der Kandidat erkennt jeweils das fehlende sozialarbeiterische Setting an, markiert aber pauschal „Gefunden“. | Innerhalb der Zellen trennen: „Keine Untersuchung eines Settings Sozialer Arbeit gefunden im gelesenen Text“ und anschließend sektorales Beispiel, Policygegenstand oder Benchmark beziehungsweise behaupteter Nutzen. Die Vorbemerkung über Teilfragen mildert, beseitigt die Mehrdeutigkeit aber nicht. |
| Matrix SQ2–SQ5 | Vollständig gestützt als Übersicht / — | Durch D01-02–08, D02-02–09, D03-01–08 gedeckt; passende Quellenanker stehen dort. | Keine inhaltliche Korrektur. Die Matrix ist eine Zusammenfassung, keine zusätzliche unabhängige Evidenz. |
| X01 | Vollständig gestützte Interpretation / — | D01, What ML Developers Can Do, Punkt 2: „algorithm audits with a gender lens“; D02 §3.4: „participation washing“ und „should ultimately be abandoned“; D03 §5/7 | Der soziotechnische Umfang wird von D01/D02 getragen; D03 ergänzt tatsächlich nur Benchmark-Prompting. Die Begrenzung auf keine gemeinsam getestete Intervention ist korrekt. |
| X02 | Vollständig gestützte Interpretation / — | D01, What Social Change Leaders Can Do, Punkt 3: „assess potential AI systems“; D02 §3.2: „remain voiceless“; D03 §5: „not universal“ und §7 | Plausible Kompetenzübertragung mit ausdrücklich fehlendem Wirkungsnachweis. Als alternative Folgerung wären institutionelle Beschaffungs- oder Governanceprüfungen statt individueller Bildung denkbar; das macht die markierte Bildungslesart nicht falsch. |
| X03 | Vollständig gestützt / — | D01 erwähnt Gender Shades, Hiring und UNESCO; D02 §§1/3.2 führt dieselben Beispielarten und verwandte Literatur an: „documents refer to each other“; D03 §§3/4 beschreibt eigenständige Benchmarks | Gemeinsame Beispiele beweisen allein keine genaue Abhängigkeit jedes Befunds, aber der Kandidat sagt nur „teilweise“ und schließt zu Recht eine unabhängige Dreifachreplikation aus. Kein Korrekturbedarf. |
| Arbeitsbegriffe | Vollständig gestützt als Paraphrasen / — | D02 §3.4: „meaningfully shape it“; D03 §5: „percentage (%)“; D02 §3.3: „limited availability of intersectional data“ | Participation washing, Stereotypenrate und intersektionale Datenlücke werden sachgerecht in eigenen Worten erklärt. |
| Einleitende Quellentypisierung | Vollständig gestützt / — | D01 Impacts: „we track“; D02 §2.2: „framing approach“; D03 §4: „We evaluate“ | Die unterschiedlichen Evidenzarten stimmen. Keine Quelle berichtet im gelesenen Text einen sozialarbeiterischen Anwendungstest. |
| Lese- und Durchführungsbericht des Producers | Teilweise ungeklärt / — | Die Dateiinhalte bestätigen Wiederholungen in D01, Tabellenlinearisation in D02 und fehlende Abbildungsdaten in D03. | Ob der Producer sämtliche angegebenen Schritte tatsächlich ausführte, lässt sich aus Kandidat und Quellen allein nicht unabhängig prüfen. Keine daraus abgeleitete Verifikationsbehauptung. |

## Auffällige Auslassungen aus eigener Quellenlektüre

Dies sind Agentenbefunde, keine Abweichungen von einer menschlichen Referenz:

- D01-05 nennt die Schadenskategorien, lässt aber sämtliche Zahlen der eigenen Fallsammlung aus. Die Quelle nennt im Absatz „Gender-biased AI not only“ ungefähr 133 erfasste problematische Systeme, davon 59 mit Gender Bias und 34 mit Gender- und Race-Bias. Bei einer vollständigen Extraktion eigener Ergebnisse sollten diese Angaben mit ihrem selektiven Nenner erfasst werden. Sie dürfen nicht als Prävalenz in allen KI-Systemen erscheinen.
- D02 §4, „Nevertheless, the problems and recommendations“, benennt das Risiko, intersektionale Fragen außerhalb der zentralen KI-Agenda zu halten („rather than part of the core AI agenda“). D02-09 erfasst die Forschungsfrage, nicht diesen politischen Mechanismus. Das ist eine mögliche Ergänzung zu SQ2.
- D03 berichtet in §5 differenzierte Resultate auch für Ageism, Beauty, Beauty in Profession, Institutional, Nationality, Profession, Race und Religion. Der Kandidat isoliert hauptsächlich Gender und einzelne Gegenbeispiele. Für eine vollständige maßnahmen- und kategoriespezifische Extraktion fehlen diese Einzelbefunde; für eine kompakte Übersicht ist die Auswahl erkennbar, darf aber nicht als erschöpfend bezeichnet werden.
- D03s Schlussabschnitt beansprucht robuste Anwendbarkeit über Kontexte („robust and applicable across different contexts“). Der Kandidat übernimmt diese Überdehnung nicht. Sie wäre als behauptete Reichweite der Quelle mit Gegenprüfung an den Benchmarkgrenzen separat erfassbar.

## Lesegrenzen und Abschluss

Die gesamte verfügbare Textfassung aller Quellen wurde im vorangegangenen Lauf gelesen, ohne abgeschnittene Toolausgabe. Das umfasst die vorhandenen Tabellen und Literaturverzeichnisse, nicht die Volltexte der darin zitierten Werke. D03-Abbildungen und Supplemente fehlen. Daher konnte die berichtete Zahlenprosa verglichen, aber nicht jede Zahl anhand der Diagramme oder Rohdaten nachgerechnet werden. D02-Tabellen sind linearisiert; die ursprüngliche räumliche Tabellenstruktur wurde nicht geprüft.

Der Kandidat ist keine strikt atomare Vollauswertung. Die benannten Bündel sind überwiegend sachlich gestützt, aber für eine nachfolgende Prüfung auf Aussageebene aufzuteilen. Keine Prozentaccuracy, kein menschlicher Akzeptanzstatus und keine produktiven Statusänderungen wurden erzeugt. Nur dieser Reviewbericht wurde geschrieben; Original, Quellen und frühere Themenanalyse bleiben unverändert.