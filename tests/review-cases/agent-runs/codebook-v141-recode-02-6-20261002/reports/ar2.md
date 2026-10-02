# codebook-v141-recode-02-6-20261002, ar2

- Akteur: agent
- Zuweisung: 6TAA76Q4, 7VFNS5R3, 8JR5AGRG, 8MRNK6FX, HDXTRBUK, JFDBPUBN
- Coding-Paket: tmp/agent-runs/codebook-v141-recode-02-6-20261002/ar2/ar2-coding.json
- Quellenbasis: zugewiesene Volltexte unter docs/data/fulltext/, Hashes gegen das Laufmanifest geprüft, jeweils vollständig gelesen
- Ergebnis: bestanden
- Verteilung: Include 5, Unclear 1, Exclude 0, Blockiert 0

## Records

| Paper-ID | Textbasis | Identitätsstatus | Entscheidung | positive Kategorien | Hinweis |
|---|---|---|---|---|---|
| 6TAA76Q4 | Fulltext | verified | Unclear | Generative_KI ja, Prompting teilweise, Bias_Ungleichheit teilweise, Gender teilweise | Nutzungsstudie zu ChatGPT, Geschlechter- und Einkommensunterschiede der Nutzung als nachgeordneter Befund, kein Sozialbezug auf ja-Niveau |
| 7VFNS5R3 | Fulltext | provisional | Include | AI_Literacies ja, Gender ja, KI_Sonstige teilweise, Bias_Ungleichheit teilweise, Diversitaet teilweise | DOI und Jahr im konvertierten Text nicht lesbar |
| 8JR5AGRG | Fulltext | verified | Include | Generative_KI ja, Bias_Ungleichheit ja, Gender ja, Diversitaet ja, AI_Literacies teilweise, Prompting teilweise, Feministisch teilweise, Fairness teilweise | UNESCO/IRCAI-Bericht mit eigenen Experimenten, als Forschungs- und Policy-Report zulässig |
| 8MRNK6FX | Fulltext | provisional | Include | Generative_KI ja, Soziale_Arbeit ja, Bias_Ungleichheit ja, AI_Literacies teilweise, KI_Sonstige teilweise, Diversitaet teilweise, Fairness teilweise | DOI, Venue und Jahr fehlen im Text |
| HDXTRBUK | Fulltext | verified | Include | KI_Sonstige ja, Soziale_Arbeit ja, AI_Literacies teilweise, Bias_Ungleichheit teilweise | Ankerwerk des Codebuchs (VSZM7CT6) für die Grenze bei Bias-Achsen |
| JFDBPUBN | Fulltext | verified | Include | AI_Literacies ja, KI_Sonstige ja, Bias_Ungleichheit ja, Gender ja, Diversitaet teilweise, Feministisch teilweise, Fairness teilweise | deutscher Projektbericht mit DOI, als Forschungsreport zulässig |

## Abweichungen und Blocker

- 6TAA76Q4, mögliche Divergenz zur früheren Einordnung, das Werk wird als Recode eines Includes geführt, die Quelle trägt aber nur Generative_KI auf ja, Geschlechter- und Einkommensunterschiede der Nutzung sind ein deskriptiver Teilbefund, benötigt Expert:innen-Entscheidung, ob Gender oder Bias_Ungleichheit das ja-Niveau erreichen.
- 7VFNS5R3, Metadatenlücke, DOI und Erscheinungsjahr im konvertierten Text unleserlich, Titel, Autoren und Zeitschrift stimmen, vorläufig codiert.
- 8MRNK6FX, Metadatenlücke, keine DOI, kein Venue, kein Jahr im Text, Titel und Autor stimmen, vorläufig codiert.
- Keine Blocker.

## Codierregeln mit Auslegungsbedarf

- AN_Mitigation_Stage und AN_Mitigation_Status, 7VFNS5R3, der Kurs verringert eine Geschlechterlücke beim KI-Lernen, nicht algorithmischen Bias. Als Organisational_Process (Schulung) mit Evaluated codiert, weil eine identifizierbare Maßnahme mit berichtetem Ergebnis vorliegt. Alternative wäre None.
- AN_Bias_Axes, 8JR5AGRG, Gender wird mit Kultur und Nationalität gekreuzt, das Werk selbst fordert aber in den Limitationen eine noch ausstehende intersektionale Analyse. Intersectional daher nicht codiert.
- AN_Harm_Types, 8JR5AGRG, die geringere Vielfalt der Ausgaben für Frauen und lokale Gruppen als Stereotyping gewertet, nicht als Disparate_Performance (Stilunterschied der Ausgabe).
- AN_Mitigation_Status, 8JR5AGRG, der Vergleich zwischen ChatGPT mit RLHF und Basismodellen als Modellvergleich und nicht als Evaluation einer Maßnahme gewertet, daher Proposed.
- AN_Harm_Types, 8MRNK6FX, das Werk trennt mittelbare und unmittelbare Diskriminierung nicht. „based on their inherent characteristics“ als Direct_Discrimination gelesen, offene Pilotfrage zu nicht klassifizierten allokativen Disparitäten.
- AN_Bias_Axes, 8MRNK6FX, „economically disadvantaged“ steht nur in einem Beispielsatz und wird nicht als eigenes ausgeführtes Beispiel entwickelt. None codiert, Disparate_Performance aber aus demselben Mechanismusargument vergeben.
- AN_Theory_Reference, HDXTRBUK, Braidottis kritischer Posthumanismus rahmt Ungleichheit und Bias, als Yes codiert. Die Grenze zwischen rahmendem Konzept und illustrierender Erwähnung bleibt offen.
- AN_Gender_Understanding, JFDBPUBN, explizite Bestimmung von gender als sozialem Geschlecht und Erklärung der Unterschiede über Rollenerwartungen ergibt Social_Construct, die Auswertung nur zweier Kategorien nach Ausschluss der Gruppe „divers“ ergibt Binary_Categorical. Beide Werte gemeinsam codiert.
- AN_Bias_Axes, JFDBPUBN, die Alterskorrelation mit Vertrauen wird nicht als Bias gerahmt, Age daher nicht codiert.

## Selbstprüfung

- zugewiesene und codierte IDs stimmen überein: ja
- alle positiven Kategorien haben zeichengetreue Paper-Belege: ja
- alle Includes sind vollständig analysiert: ja
- Coding-Paket-Validator bestanden: ja
