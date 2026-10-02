# codebook-v141-includes-03-3-20261002 · ar1

- Akteur: agent
- Zuweisung: GJF776AY, KQ5A8D6E, MS3CNU3S (Reihenfolge laut Laufmanifest)
- Coding-Paket: tmp/agent-runs/codebook-v141-includes-03-3-20261002/ar1/ar1-coding.json
- Quellenbasis: zugewiesene Volltexte unter docs/data/fulltext/, SHA-256 aller drei Quellen gegen das Manifest geprüft und übereinstimmend, jeweils vollständig gelesen
- Ergebnis: bestanden
- Verteilung: Include 3 · Unclear 0 · Exclude 0 · Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| GJF776AY | Fulltext | verified | Include | KI_Sonstige ja, Bias_Ungleichheit ja, Feministisch ja, Gender teilweise, Diversitaet teilweise, Fairness teilweise | Theoretischer Essay, DOI 10.3389/fcomm.2025.1380252 im Text |
| KQ5A8D6E | Fulltext | verified | Include | AI_Literacies ja, KI_Sonstige ja, Bias_Ungleichheit ja, Diversitaet ja, Generative_KI teilweise, Fairness teilweise | UNESCO-Rahmenwerk 2024, ISBN statt DOI, Policy-Report nach Publikationstypregel zulässig |
| MS3CNU3S | Fulltext | verified | Include | Generative_KI ja, Bias_Ungleichheit ja, Fairness ja, Prompting teilweise, Gender teilweise, Diversitaet teilweise, Feministisch teilweise | Survey, kein DOI im Text, Titel, Autor:innen und Jahr ohne Konflikt |

## Abweichungen und Blocker

- keine Blocker
- MS3CNU3S · Identität · Der Text druckt keinen DOI, die DOI-Prüfung war daher nicht möglich · keine Klärung nötig, Titel, Autor:innen und Jahr widersprechen sich nicht
- MS3CNU3S · Quellkonvertierung · In Tabelle 1 fehlt die Zeilenbezeichnung „Derogatory language“, die Definition ist erhalten · Beleg für Derogatory_Language daher aus Abschnitt 2.4.2
- KQ5A8D6E · Identität · version_type im Manifest „unknown“ · keine Klärung für die Codierung nötig

## Codierregeln mit Auslegungsbedarf

- Gender · KQ5A8D6E · Geschlecht erscheint nur in Aufzählungen von Bias-Arten und Disaggregationsvariablen, daher Kategorie nein und SQ4-Geschlechtsfelder Not_Applicable
- Bias_Ungleichheit, Diversitaet · KQ5A8D6E · Nichtdiskriminierung und Inklusivität sind tragende Prinzipien des Rahmenwerks (Abschnitt 2.4, Schlussabsatz), daher ja trotz Kompetenzfokus
- AN_Task · KQ5A8D6E · KI ist Lerninhalt im Schulcurriculum, keine berufliche Aufgabe der KI-Nutzung, daher None statt Teaching_Further_Education
- AN_Bias_Axes · GJF776AY · Race und Gender als eigene ausgeführte Beispiele des Essays codiert, die Eingangsaufzählung nicht, Intersectional trotz intersektional-feministischem Rahmen nicht codiert, weil keine Textstelle ein Ergebnis von einer Achsenkombination abhängig macht
- AN_Harm_Types · GJF776AY · Erasure und Exclusionary_Norms aus eigenen Befunden und dem Schluss des Essays, zitierte Fallbeispiele (Gesichtserkennung, Bildsuche) nicht codiert, Grenzfall zwischen eigener Argumentation und referierten Fällen
- AN_Bias_Definition · GJF776AY · Explicit, weil der Essay Bias ausdrücklich als „systemic coding of the dominant social fabric“ bestimmt und die zitierte Bestimmung übernimmt
- AN_Bias_Axes · MS3CNU3S · Achsen aus den Zielgruppen-Spalten von Tabelle 4 als eigene Syntheseordnung des Surveys codiert, Disability und Socioeconomic nur in Aufzählungen und Fußnote, daher nicht codiert, Intersectional nicht codiert
- AN_Gender_Understanding · MS3CNU3S · Social_Construct aus der Aussage, dass soziale Gruppen (nach Definition 3 einschließlich gender identity und sex) sozial konstruiert und machtgebunden sind, sowie der übernommenen Kritik binärer Geschlechtsmodellierung; die Aussage betrifft Gruppen allgemein, nicht Geschlecht allein, daher Grenzfall zur 1.4.1-Klarstellung
- AN_Mitigation_Status · MS3CNU3S · Evaluated als synthetisierte Evaluation (Borchers et al. 2022, erfolglose Diversitäts- und Gleichstellungsinstruktionen), kein eigenes Experiment
- AN_Prompting_Role · MS3CNU3S · nur Research_Instrument, die Darstellung von Prompt-Mitigationen als Inventar ist weder Empfehlung noch eigenständige Kritik der Praxis

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
