# codebook-v141-includes-04-5-20261002 · ar1

- Akteur: agent
- Zuweisung: 22XEFRWP, 3QUWCYVW, 7G78SADI, KNQYFQ6B, PYN6HB3E
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-04-5-20261002/ar1/ar1-coding.json
- Quellenbasis: Volltexte unter docs/data/fulltext/, SHA-256 aller fünf Quellen vor der Codierung gegen das Laufmanifest geprüft und übereinstimmend, jede Quelle vollständig gelesen einschließlich Anhängen
- Ergebnis: bestanden
- Verteilung: Include 4 · Unclear 1 · Exclude 0 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 22XEFRWP | Fulltext | verified | Include | Generative_KI, Bias_Ungleichheit, Gender (ja); AI_Literacies, Diversitaet (teilweise) | DOI und Jahr fehlen in der Paper-Ebene |
| 3QUWCYVW | Fulltext | verified | Include | KI_Sonstige, Bias_Ungleichheit, Fairness (ja); AI_Literacies, Generative_KI, Gender, Diversitaet, Feministisch (teilweise) | DOI und Jahr fehlen in der Paper-Ebene |
| 7G78SADI | Fulltext | verified | Unclear | AI_Literacies (ja); Generative_KI, KI_Sonstige, Bias_Ungleichheit, Gender (teilweise) | soziale Dimension nur nachgeordnet |
| KNQYFQ6B | Fulltext | verified | Include | Generative_KI, Prompting, Bias_Ungleichheit, Gender (ja); KI_Sonstige, Diversitaet, Fairness (teilweise) | Venue, DOI und Jahr fehlen, Versionstyp unknown |
| PYN6HB3E | Fulltext | verified | Include | AI_Literacies, KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit (ja); Diversitaet, Fairness (teilweise) | DOI vorhanden |

## Abweichungen und Blocker

- 7G78SADI · Entscheidung · Das Laufmanifest beschreibt den Lauf als Analysecodierung eingeschlossener Werke, die Quelle trägt aber nur Unclear. Der Scoping Review zu AI Literacy behandelt Bias, Gender-Bias und Minderheiten nur als nachgeordnete Befunde (Tabelle 6, Forschungsrichtung VI), keine Sozialkategorie erreicht ja. Ohne Include fehlen Analysefelder. · Klärung durch AI Agent Review oder Fachexpert:innen, ob eine Sozialkategorie zentral ist.
- 22XEFRWP, 3QUWCYVW, KNQYFQ6B · Identität · DOI und Erscheinungsjahr stehen nicht in der Paper-Ebene, bei KNQYFQ6B auch kein Venue. Titel und Autor:innen stimmen, kein Titel- oder DOI-Konflikt, Quelle über Manifest-Hash gebunden. · Keine Sperre, Metadatenergänzung bei Gelegenheit.
- Keine Blocker.

## Codierregeln mit Auslegungsbedarf

- AN_Harm_Types · 22XEFRWP · Die gezeigte Gehaltsdisparität ist ein von den Forschenden konstruierter Stimulus, nicht gemessenes Modellverhalten. Codiert als Indirect_Discrimination nach der Regel zu namensbasierten Variationen, weil das eigene Argument diesen Mechanismus zum Gegenstand macht.
- AN_Harm_Types · PYN6HB3E · Der Fall armutsbezogener Proxyvariablen in einer Kinderschutz-Risikoeinschätzung stammt aus der Literatur, dient aber als Fall im eigenen Argument zum Gruppendenken. Codiert als Indirect_Discrimination. Erasure über das eigene Argument epistemischer Ungerechtigkeit.
- AN_Bias_Axes · 3QUWCYVW · Intersectional codiert über den eigenen Abschnitt zu Gruppen an der Schnittstelle zweier Achsen und die Kritik am EU-Recht. Das tragende Ergebnisbeispiel ist zitiert (Buolamwini und Gebru), wird aber zur Illustration des eigenen Fairnessarguments verwendet.
- AN_Mitigation_Status · 3QUWCYVW · Evaluated nur über die synthetisierte Evaluation eines Variational Autoencoder gegen Gender-Bias in Worteinbettungen, alle anderen Verfahren beschrieben oder vorgeschlagen.
- AN_Theory_Reference · 22XEFRWP · UTAUT und Vertrauensmodell nach Mayer et al. rahmen Technikakzeptanz, werden aber ausdrücklich um Rasse und Gender als Moderatoren der Wirkung KI-generierter Vorurteile erweitert, daher Yes.
- AN_Theory_Reference · 3QUWCYVW · Procedural fairness nach Tyler und die rechtliche Unterscheidung unmittelbarer und mittelbarer Diskriminierung als rahmende Konzepte gezählt.
- AN_Theory_Reference · KNQYFQ6B · Die einmalige Erwähnung repräsentationaler und allokativer Schäden in der Einleitung als illustrative Nennung gewertet, daher No.
- Feministisch · 3QUWCYVW · teilweise über die explizite Kritik am fehlenden Konzept intersektionaler Diskriminierung im EU-Recht, ohne feministische Theorie.
- Feministisch · PYN6HB3E · nein, epistemische Ungerechtigkeit und Design Justice rahmen Machtverhältnisse ohne Geschlechterperspektive.
- Studientyp · 3QUWCYVW · Theoretisch statt Literaturreview, weil das Werk ohne Suchmethode referiert und argumentativ schließt.
- AN_Task · KNQYFQ6B · Other_Task für maschinelle Übersetzung, da das Werk eine Anwendungsaufgabe testet und nicht nur ein allgemeines Benchmark.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
