# codebook-v141-includes-04-5-20261002 · ar2

- Akteur: agent
- Zuweisung: 22XEFRWP, 3QUWCYVW, 7G78SADI, KNQYFQ6B, PYN6HB3E (Reihenfolge nach Laufmanifest)
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-04-5-20261002/ar2/ar2-coding.json
- Quellenbasis: Volltexte unter docs/data/fulltext/ gemäß Laufmanifest, SHA-256 aller fünf Quellen vor der Codierung gegen das Manifest geprüft und übereinstimmend, jede Quelle vollständig gelesen einschließlich Anhängen
- Ergebnis: bestanden
- Verteilung: Include 4 · Unclear 1 · Exclude 0 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 22XEFRWP | Fulltext | verified | Include | Generative_KI ja, Bias_Ungleichheit ja, Gender ja, AI_Literacies teilweise, Diversitaet teilweise | Experimentell, Gehaltsdisparitäten als konstruierte Stimuli, eigene DOI und Jahr nicht im Text |
| 3QUWCYVW | Fulltext | verified | Include | KI_Sonstige ja, Bias_Ungleichheit ja, Fairness ja, AI_Literacies teilweise, Generative_KI teilweise, Gender teilweise, Diversitaet teilweise | Theoretisch, rechtlich-technische Fairnessanalyse, eigene DOI und Jahr nicht im Text |
| 7G78SADI | Fulltext | verified | Unclear | AI_Literacies ja, Generative_KI teilweise, KI_Sonstige teilweise, Bias_Ungleichheit teilweise, Gender teilweise | Review zu AI Literacy, soziale Dimension nur als nachgeordneter Teilaspekt |
| KNQYFQ6B | Fulltext | verified | Include | Generative_KI ja, Prompting ja, Bias_Ungleichheit ja, Gender ja, KI_Sonstige teilweise, Fairness teilweise | Experimentell, Publikationsort und Jahr nicht im Text, Versionstyp im Manifest unknown |
| PYN6HB3E | Fulltext | verified | Include | AI_Literacies ja, KI_Sonstige ja, Soziale_Arbeit ja, Bias_Ungleichheit ja, Diversitaet teilweise, Fairness teilweise | Konzept, DOI 10.1080/26408066.2025.2547219 im Text |

## Abweichungen und Blocker

- 7G78SADI · Entscheidung · Der Lauf führt das Werk als Include-Batch, die Quellenprüfung ergibt Unclear. AI Literacy ist zentral, Bias erscheint nur als Teilbereich der Datenkompetenz, in einem synthetisierten Effekt (Erkennen von Gender Bias) und in einer Forschungsfrage zu Minderheiten, keine Sozialkategorie erreicht `ja`. · Prüfung durch die AI Agent Review und gegebenenfalls Domain-Expert:innen, ob die soziale Dimension `ja` erreicht.
- 22XEFRWP, 3QUWCYVW, 7G78SADI, KNQYFQ6B · Identität · Eigene DOI und Erscheinungsjahr stehen nicht in der Paper-Ebene, das Laufmanifest liefert nur den Titel. Titel, Autorenschaft und Hash-Bindung sind konsistent, ein Konflikt besteht nicht. · Keine Klärung für die Codierung nötig, Abgleich mit Korpusmetadaten außerhalb des Tracks.
- Keine Blocker.

## Codierregeln mit Auslegungsbedarf

- AN_Harm_Types · 22XEFRWP · Die Gehaltsdisparitäten sind von den Autor:innen konstruierte ChatGPT-Antworten, das Werk misst kein Modellverhalten. Codiert als Indirect_Discrimination, weil das Werk diese namensbasierte Allokation (Jerome, Judi) als KI-generiertes Vorurteil operationalisiert. Eine Lesart mit `None` ist vertretbar.
- AN_Prompting_Role · 22XEFRWP · Der Prompt im Screenshot ist Teil des Stimulus, ruft aber kein Modellverhalten hervor, daher `None` statt Research_Instrument.
- AN_Bias_Definition · 22XEFRWP · „AI-generated prejudice (i.e., disparities in salary or hourly wage)“ als Operationalisierung gelesen, daher Implicit_Only statt Explicit.
- AN_Theory_Reference · 22XEFRWP · TAM, UTAUT und das Vertrauensmodell nach Mayer et al. rahmen die Wirkung KI-generierter Vorurteile, gewertet als Theoriebezug für Bias.
- AN_Bias_Axes · 3QUWCYVW · Intersectional aus der Synthese der Gruppenfairness und der eigenen Kritik am EU-Recht, ohne eigenes Ergebnis zur Kombination. Grenzfall zwischen eigener Argumentation und referierter Literatur (Buolamwini und Gebru).
- AN_Mitigation_Status · 3QUWCYVW · Evaluated gestützt allein auf das synthetisierte Ergebnis von Tyagi et al., die übrigen Verfahren sind Inventar. Proposed wäre die strengere Lesart.
- AN_Gender_Definition und AN_Gender_Understanding · 3QUWCYVW · Geschlecht erscheint nur in Beispielen zur Gruppenfairness und Datenaugmentation. Gewertet als Gegenstand mit binärem Verständnis (Implicit_Only, Binary_Categorical), Not_Applicable wäre die engere Lesart.
- AN_Task · KNQYFQ6B · Maschinelle Übersetzung als Anwendungsaufgabe außerhalb der Sozialen Arbeit gewertet (Other_Task), nicht als allgemeiner LLM-Benchmark (None).
- AN_Prompting_Role · KNQYFQ6B · Recommended_Practice zusätzlich zu Research_Instrument, weil das Werk Prompting abschließend als wirksame Minderungsmethode empfiehlt.
- Feministisch · PYN6HB3E · Epistemische Ungerechtigkeit nach Fricker und Design Justice rahmen eine Machtanalyse, ohne Geschlechterperspektive oder ausdrücklich feministische Rahmung im Text, daher `nein`.
- AN_Harm_Types · PYN6HB3E · Indirect_Discrimination stützt sich auf einen aus der Literatur übernommenen Fall, den das Werk im eigenen Argument ausführt. Nach der Regel zu zitierten Fällen ist die Codierung ein Grenzfall. Erasure stammt aus dem eigenen Argument zur epistemischen Ungerechtigkeit.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
