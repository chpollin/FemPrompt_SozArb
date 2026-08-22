# Fachliche Vorbereitung der Praxisredaktion

## Persona und Vorgehen

Die Praxisredaktion bewertet wissenschaftliche Verwendbarkeit, Nachvollziehbarkeit der Belege und den Transfer in die Soziale Arbeit. Entscheidend ist eine belastbare Verbindung zwischen einer protokollgemäßen Technikdimension und einer protokollgemäßen Sozialdimension. Allgemeine Erwähnungen von Ethik oder Digitalisierung erhalten keine höhere Kategorie, wenn der Text Bias, Ungleichheit, Gender, Diversität, Feminismus, Fairness oder Soziale Arbeit nicht substanziell behandelt.

Die Codierung folgt `assessment/categories.yaml` in Version 1.3 und `knowledge/update-protocol.md`. Jede Kategorie wurde mit 0 für nein, 1 für teilweise oder 2 für ja bewertet. Mindestens eine Technik- und eine Sozialkategorie mit dem Wert 2 führen zur abgeleiteten Entscheidung Include. Zwei nur teilweise erfüllte Dimensionen führen zu Unclear. Eine vollständig fehlende Dimension führt zu Exclude. Abweichungen von der abgeleiteten Entscheidung sind als Override mit einem kontrollierten Ausschlussgrund dokumentiert.

Vor der fachlichen Prüfung wurden Metadatentitel und Volltexttitel verglichen. Neun Fälle besitzen einen titelgleichen Volltext. Für MITLDF9S ist die bisherige Volltextzuordnung nachweislich falsch. Das titelungleiche Präsentationskonvolut wurde weder gelesen noch zur Codierung verwendet. Dieser Fall beruht ausschließlich auf dem nachgewiesenen Abstract und den bibliografischen Metadaten. Bestehende Reviewer-, Acceptance- und Agentenberichte wurden nicht geöffnet.

## Entscheidungen

| Paper-ID | Kurztitel | Entscheidung | Ausschlussgrund oder fachlicher Kern | Textgrundlage |
|---|---|---|---|---|
| Z4YXX9PZ | Prompting techniques for reducing social bias in LLMs | Include | Experimenteller Vergleich von zwölf Prompttechniken über soziale Biasachsen | Volltext |
| AIGLDZ4C | How to Create Inclusive AI Images | Exclude | `Wrong_publication_type`; Unternehmensblog ohne wissenschaftliche Methode | Volltext |
| VP6SXQHY | The AI literacy development canvas | Unclear | KI-Kompetenz ist zentral; Bias und Fairness bleiben sekundäre Teilkompetenzen | Volltext |
| P82X89Q4 | A Competency Framework for AI Literacy | Exclude | `Not_relevant_topic`; Sozialdimension des Protokolls fehlt | Volltext |
| AMYZFAPH | Recommendations for social work researchers and journal editors | Include | Generative KI, Promptdokumentation und Biasfragen in der Sozialarbeitsforschung | Volltext |
| 4GYXUS9Y | ChatGPT and social work | Include | Generative KI in Praxis und Lehre mit Kompetenz-, Bias- und Marginalisierungsbezug | Volltext |
| 9WIGR47Y | Ethical issues related to the use of technology in social work practice | Exclude | `Not_relevant_topic`; digitale Sozialarbeit ohne substanziellen KI-Gegenstand | Volltext |
| MITLDF9S | KI-basiertes Assistenzsystem im Kinderschutzverfahren | Include | KI-Entscheidungshilfe im Kinderschutz mit Bias-, Fehlklassifikations- und Kontrollrisiken | Abstract |
| TRAN2GJU | How can feminism inform AI governance in practice? | Exclude | `Wrong_publication_type`; als News-Beitrag ausgewiesene Webseite | Volltext |
| A776TPGG | The EU artificial intelligence act through a gender lens | Include | Feministische und intersektionale Policyanalyse zu KI, Diskriminierung und Fairness | Volltext |

Die Verteilung umfasst fünf Includes, ein Unclear und vier Excludes. Zwei Excludes folgen unmittelbar aus einer fehlenden Dimension. Zwei inhaltlich einschlägige Webbeiträge wurden wegen ihres ungeeigneten Publikationstyps per Override ausgeschlossen.

## Wichtigste Belege

Z4YXX9PZ untersucht fünf Sprachmodelle und zwölf Promptvarianten. Der Text nennt eingebettete soziale Biases als Problem, wertet neun Biaskategorien aus und begründet die Reduktion mit Fairness und Inklusion. Die Belegstellen liegen in `generated/markdown_clean/Kamruzzaman_2024_Prompting_techniques_for_reducing_social_bias_in.md` auf den Zeilen 40, 50, 68, 74 und 82.

AMYZFAPH behandelt generative KI und Large Language Models ausdrücklich in sozialarbeitswissenschaftlicher Forschung. Der Beitrag diskutiert rassifizierte und geschlechtsbezogene Verzerrungen, mögliche Nachteile für marginalisierte Gruppen und die Dokumentation detaillierter Prompts. Maßgebliche Belege stehen im Volltext auf den Zeilen 26, 36, 86 bis 88, 124, 142 und 168.

4GYXUS9Y verknüpft ChatGPT mit sozialarbeiterischer Praxis und Lehre. Der Text fordert Kompetenzaufbau, diskutiert vielfältige Perspektiven und beschreibt Biasrisiken anhand von Gefährdungseinschätzungen im Kinderschutz. Die zentralen Stellen stehen auf den Zeilen 14, 22, 42 und 48 des zugeordneten Volltexts.

A776TPGG analysiert den EU AI Act mit einer feministischen und intersektionalen Perspektive. Der Forschungsbericht behandelt geschlechtsbezogene Verzerrung, Überschneidungen mit weiteren Ungleichheitsachsen, stereotype Repräsentationen und diskriminierende Wirkungen. Empfehlungen betreffen Daten, Folgenprüfung, Beteiligung und organisatorische Kontrolle. Die tragenden Textstellen liegen auf den Zeilen 73, 99, 175, 179, 201 bis 206 und 227 bis 229.

MITLDF9S wird durch den Abstract als KI-Assistenzsystem für die Gefährdungseinschätzung im Kinderschutz ausgewiesen. Der Metadatensatz nennt Human-in-the-Loop, Datenschutz, Organisationsentwicklung, Schulungsbedarf, Bias und Fehlklassifikationen. Diese Angaben tragen die Include-Entscheidung. Konkrete Biasachsen und Schadensmechanismen bleiben unentscheidbar und sind im Analyseblock entsprechend markiert.

Die Grenzfälle wurden restriktiv bewertet. VP6SXQHY nennt Diskriminierung nach Herkunft, Alter oder Behinderung sowie Fairness und fortgeschrittene Prompttechniken. Der Organisationsrahmen behandelt diese Aspekte als Teile einer umfassenden KI-Kompetenz. Die Sozialdimension erreicht daher den Wert 1 und führt zu Unclear. P82X89Q4 entwickelt ebenfalls ein tragfähiges KI-Kompetenzmodell. Seine allgemeine Ethikdimension enthält keine ausreichende Analyse der sechs Sozialkategorien und führt zu Exclude. 9WIGR47Y behandelt digitale Technik in der Sozialen Arbeit. Künstliche Intelligenz erscheint erst als Empfehlung für künftige Forschung, weshalb die Technikdimension leer bleibt.

AIGLDZ4C und TRAN2GJU erfüllen die inhaltlichen Dimensionen deutlich. Der erste Text ist als Unternehmensblog ausgewiesen, der zweite als News-Seite. Beide enthalten keine nachvollziehbare wissenschaftliche Methode oder Evaluation. Der Ausschlussgrund `Wrong_publication_type` bildet diese Abgrenzung ab.

## Unsicherheiten und Grenzen

MITLDF9S besitzt die stärkste Einschränkung der Textgrundlage. Der Abstract erlaubt eine Entscheidung über die grundsätzliche Relevanz. Er erlaubt keine belastbare Zuordnung einzelner Biasachsen oder Schadensarten. Der Analyseblock verwendet dafür explizite Unentscheidbarkeitsmarkierungen und die Codierbasis Abstract.

Bei VP6SXQHY hängt die Entscheidung an der Gewichtung ethischer Teilkompetenzen innerhalb eines allgemeinen Organisationsmodells. Die Belege sind substanzieller als eine beiläufige Erwähnung und schwächer als eine eigenständige Bias- oder Fairnessanalyse. Unclear bildet diese mittlere Evidenzlage ab.

4GYXUS9Y ist ein wissenschaftlich publizierter Kommentar mit konzeptionellem Charakter. Das Review-Protokoll sieht keinen Ausschluss wissenschaftlicher Kommentarformate vor. Der Beitrag wurde deshalb als Konzeptbeitrag eingeschlossen und mit dem Studientyp Konzept codiert.

## Erwartungen an die Eingabe in PRISM

Die sichtbare Übernahme soll für jeden Fall zuerst den Metadatentitel mit der Textüberschrift vergleichen. MITLDF9S benötigt eine klar erkennbare Abstract-Grundlage und einen Warnhinweis zur gesperrten Volltextzuordnung. Das falsche Präsentationskonvolut darf in keinem Arbeitsschritt als Evidenz dienen.

Jeder positive Kategorienwert benötigt mindestens einen präzisen, an die Kategorie gehefteten Beleg. Die Oberfläche sollte abgeleitete Entscheidung, finale Entscheidung und Override getrennt zeigen. Für AIGLDZ4C und TRAN2GJU muss der Override samt `Wrong_publication_type` sichtbar erhalten bleiben.

Bei Includes müssen alle Analysefelder vor dem Speichern vollständig sein. Eine Unentscheidbarkeitsmarkierung braucht einen eigenen Zustand, damit sie nicht wie ein versehentlich leeres Feld erscheint. Dies betrifft bei MITLDF9S `AN_Bias_Axes` und `AN_Harm_Types`. Die Codierbasis muss dort Abstract lauten. Bei den übrigen Includes lautet sie Fulltext.

Die Übernahme erfolgt unter dem Reviewer-Kürzel `pe` über die regulären Bedienelemente. Nach jedem Fall sollte die Oberfläche den erfolgreichen Speichervorgang und die zugehörige Paper-ID bestätigen. Ein abschließender Export muss genau die zehn zugewiesenen IDs enthalten und die Verteilung fünf Include, ein Unclear und vier Exclude reproduzieren.

## Validierungsumfang

`pe-prepared.json` enthält genau zehn Records mit den zehn zugewiesenen Paper-IDs. Jeder Record enthält Titelprüfung, Textgrundlage, zehn Kategorien, Kategorienbegründungen, präzise Exzerpte, abgeleitete und finale Entscheidung sowie Entscheidungsbegründung. Alle vier Excludes besitzen einen kontrollierten Ausschlussgrund. Die fünf Includes besitzen vollständig ausgefüllte Analyseblöcke. Die zwei auf Abstractbasis nicht entscheidbaren Felder bei MITLDF9S sind explizit markiert.
