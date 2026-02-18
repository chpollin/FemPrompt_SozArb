# Epistemische Asymmetrien in Deep-Research-gestuetzten Literature Reviews

**Untertitel:** Workflow-Design zwischen Large Language Models und Expert:innenwissen

**Autor:innen:** Christopher Pollin, Susanne Sackl-Sharif, Sabine Klinger, Christian Steiner

**Zielformat:** Forum Wissenschaft 2/2026
**Zeichenlimit:** 18.000 (inkl. Leerzeichen, inkl. Fussnoten)
**Fussnoten:** max. 15, kein Literaturverzeichnis
**Zielgruppe:** Wissenschaftler:innen mit wenig KI-Vorwissen
**Stand:** Erster Repo-Entwurf (v0.1)

---

## Editorische Hinweise

- Zeichenzaehlung: `wc -m` oder Python `len(text)` auf den reinen Fliesstext (ohne diese Meta-Sektion)
- Platzhalter `[[...]]` markieren Abschnitte, die Benchmark-Ergebnisse benoetigen
- Fussnoten werden inline als `[^N]` notiert
- Iterationshistorie: Aenderungen werden ueber Git-Commits nachvollzogen

---

## 1. Einleitung (~2.500 Zeichen)

Woechentlich nutzen 700 Millionen Menschen ChatGPT.[^1] Schreibaufgaben dominieren mit 42 Prozent die berufliche Nutzung, gefolgt von Entscheidungsunterstuetzung -- beides Kernfunktionen in der Sozialen Arbeit: Fallberichte, Dokumentation, Antragsstellung, Interventionsplanung. Gleichzeitig verschiebt sich die Nutzung in den privaten Bereich (73 Prozent Non-Work), was LLM-Literacy zur gesellschaftlichen Herausforderung macht. Granulare Daten zur Kategorie "Social Services" fehlen gaenzlich.

Diese Dynamik wirft eine grundlegende methodologische Frage auf: Wenn Frontier-LLMs zunehmend auch fuer wissenschaftliche Recherche eingesetzt werden -- als Deep-Research-Agenten, die autonom Literatur identifizieren, bewerten und synthetisieren --, welche epistemischen Bedingungen muessen dann gelten, damit die Ergebnisse als Forschung zaehlen koennen?

Wir schlagen den Begriff der **epistemischen Infrastruktur** vor: die Gesamtheit der Verfahren, Dokumentationsstrukturen und Community-Praktiken, die sicherstellen, dass LLM-Beitraege in der Forschung ueberpruefbar, nachvollziehbar und verantwortbar bleiben. Nicht das Modell wird verlaesslich -- sondern der Forschungsprozess wird auditierbar.

Der Beitrag dokumentiert einen systematischen Literature Review zu feministischer AI Literacy und LLM-Bias in der Sozialen Arbeit (326 Papers, vier Deep-Research-Systeme) und fragt: **Welche epistemische Infrastruktur braucht ein LLM-gestuetzter Literature Review, um der Asymmetrie zwischen maschineller Musterkennung und fachlicher Urteilskraft methodisch gerecht zu werden?**

## 2. Epistemische Asymmetrie als Ausgangsproblem (~2.500 Zeichen)

### Jenseits simpler Bias-Narrative

Die Herausforderung hat sich verschoben. Waehrend Bias-Forschung noch mit Checklisten fuer algorithmische Fairness operiert[^2], zeigen Frontier-LLMs emergente, kontextabhaengige Verhaltensweisen: Capabilities, die ohne explizites Training entstehen; komplexe Alignment-Mechanismen, die in Spannung zu professionsspezifischen Werten stehen; Persona-Effekte, die durch Finetuning unvorhersehbare Cross-Trait-Auswirkungen erzeugen.[^3] Shanahan praegte den Begriff "Exotic Mind-Like Entities" fuer Systeme, die anders als Menschen operieren, obwohl ihr Verhalten menschenaehnlich erscheint.[^4]

Fuer die Soziale Arbeit manifestiert sich diese Komplexitaet in einem Phaenomen, das die methodische Reflexion betrifft: **Sycophancy** -- die empirisch belegte Tendenz von LLMs, den Vorannahmen eines Prompts uebermaeessig zuzustimmen. Malmqvist dokumentiert Error Introduction Rates von bis zu 40 Prozent bei suggestiven Anfragen.[^5] In der Praxis koennte ein LLM problematische Vorannahmen ueber Klient:innen verstaerken, statt sie kritisch zu hinterfragen.

### Die Asymmetrie ist wechselseitig

Epistemische Asymmetrie beschreibt eine Arbeitsteilung, in der die beteiligten Instanzen auf grundsaetzlich verschiedene Weise Wissen verarbeiten, wobei keine Seite die epistemischen Beitraege der anderen vollstaendig bewerten kann. LLMs verarbeiten grosse Textmengen und erkennen Muster ueber Hunderte von Texten. Expert:innen bewerten die epistemische Qualitaet von Quellen und erkennen Nuancen, die nur mit Feldkenntnis sichtbar werden.

Hauswald argumentiert, dass epistemische Deferenz nicht an Ueberzeugungen oder kommunikative Intentionen gebunden sein muss -- entscheidend ist, ob Outputs als zuverlaessige Wahrheitsindikatoren fungieren.[^6] Das erlaubt es, LLM-Beitraege als epistemisch relevant zu behandeln, ohne dem System menschliches Verstehen zuzuschreiben. Zugleich beschreibt er eine "justifikatorische Esoterik": Nicht der Inhalt, sondern die Begruendung bleibt unzugaenglich. Trainingsdaten, Modellarchitekturen und Selektionslogiken werden nicht offengelegt.

Die Konsequenz: Die Verantwortungsasymmetrie bindet die anderen Dimensionen. Ohne zurechenbare Verantwortung gibt es keine Instanz, die Intransparenz, Zugangsbedingungen und Kompetenzunterschiede methodisch bearbeiten kann.

## 3. Epistemische Infrastruktur: Vom Konzept zur Operationalisierung (~3.000 Zeichen)

### Vier Ebenen

Epistemische Infrastruktur operiert auf vier ineinander verschraenkten Ebenen:

**Workflow-Ebene:** Duale Bewertungspfade und deterministische Verarbeitungsstufen. In unserem Workflow bewertet Claude Haiku 4.5 alle 326 Papers parallel zu zwei Fachexpertinnen mit einem identischen 10-Kategorien-Schema. Die Divergenzen werden nicht als Fehler behandelt, sondern als epistemische Marker: Sie zeigen, wo maschinelle Musterkennung und disziplinaeres Kontextwissen systematisch auseinanderfallen.

**Research-Integrity-Ebene:** Jede Designentscheidung wird dokumentiert und nachvollziehbar begruendet. Das oeffentliche GitHub-Repository archiviert alle Prompts (versioniert), Zwischenergebnisse und Entscheidungsprozesse. Die 3-Stage Structured Knowledge Extraction (SKE) adressiert Konfabulationsrisiko durch eine deterministische mittlere Stufe: Stufe 1 extrahiert per LLM, Stufe 2 formatiert rein algorithmisch (kein LLM, keine Konfabulation moeglich), Stufe 3 verifiziert gegen den Originaltext.[^7]

**Institutionelle Ebene:** KI-Richtlinien, die den Einsatz von LLMs in der Forschung regulieren, existieren an vielen Einrichtungen noch nicht. Das Fehlen institutioneller Rahmenbedingungen macht individuelle epistemische Infrastruktur umso notwendiger.

**Community-Ebene:** Peer-Review-Verfahren muessen kuenftig LLM-gestuetzte Workflows einschliessen koennen. Das erfordert sowohl neue Transparenzstandards (Prompt-Dokumentation, Modellversionierung) als auch eine realistische Einschaetzung dessen, was Reproduzierbarkeit bei proprietaeren Systemen bedeuten kann.

### Konfabulation statt Halluzination

Wir verwenden den Begriff Konfabulation statt Halluzination: die Erzeugung kohaerenter, aber faktuell ungesicherter Aussagen, ohne dass eine interne Instanz den Wahrheitsgehalt prueft. Der klinisch-psychologische Begriff beschreibt den Erzeugungsmechanismus praeziser als der wahrnehmungspsychologische.[^8] Konfabulierte LLM-Outputs weisen hoehere Narrativitaet und semantische Kohaerenz auf als veridikale -- sie sind also gerade dann ueberzeugend, wenn sie falsch sind.

## 4. Methodik: Multi-Model Literature Review (~3.500 Zeichen)

### Identifikation: Parallele Deep Research

Deep Research bezeichnet die Faehigkeit aktueller Frontier-LLMs, autonom mehrstufige Recherchen durchzufuehren. Der Workflow nutzt vier Systeme parallel (ChatGPT, Claude, Gemini, Perplexity), deren Selektionsmuster systematisch divergieren. Die Kontextparametrisierung erfolgt durch theoriegeleitete Prompt-Templates, die domaenenspezifische Terminologie (intersektionale Analyse, feministische AI-Literacy), methodische Anforderungen (PRISMA-konforme Dokumentation) und feldspezifische Publikationskanaele integrieren.

Aus den aggregierten Suchergebnissen entstand ein Korpus von 326 Papers (254 via Deep Research, 50 manuell ergaenzt, 22 aus Zotero-Kuratierung). Die Multi-Provider-Strategie ist selbst ein Instrument epistemischer Infrastruktur: Die Overlap-Analyse einer Stichprobe von 34 Papers zeigt, dass 93,8 Prozent der Papers von nur einem Provider gefunden wurden.[^9] Verschiedene Modelle erzeugen also verschiedene Evidenzbasen -- eine Befund, der die Notwendigkeit der Triangulation empirisch stuetzt.

### Kuration: Paralleles Human-AI Assessment

Das Assessment-Design adaptiert den Benchmarking-Ansatz von Woelfle et al., bei dem identische Items von menschlichen Expert:innen und LLMs mit demselben Schema bewertet werden.[^10] Zwei Fachexpertinnen bewerten alle Papers mit einem 10-Kategorien-Schema (binaer: AI_Literacies, Generative_KI, Prompting, KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit, Gender, Diversitaet, Feministisch, Fairness) plus Include/Exclude-Entscheidung. Claude Haiku 4.5 bewertet mit identischem Schema.

Die primaere Vergleichsmetrik ist Cohen's Kappa, bereinigt um Zufallsuebereinstimmung. Der Erwartungshorizont basiert auf drei Referenzstudien: Woelfle et al. zeigen, dass menschliche Inter-Rater-Reliabilitaet mit der Aufgabenkomplexitaet sinkt (kappa = 0,84 bei einfachen vs. 0,29 bei komplexen Items).[^10] Hanegraaf et al. dokumentieren kappa = 0,77-0,88 fuer erfahrene Reviewer bei relativ klaren Kriterien.[^11] Sandner et al. zeigen, dass LLMs nicht staerker von Menschen abweichen als Menschen voneinander.[^12]

### Synthese: Structured Knowledge Extraction

Die 249 erfolgreich konvertierten Volltexte durchlaufen eine dreistufige Wissensextraktion. Die Pipeline kostet $8,73 fuer den gesamten Korpus -- ein Befund, der die Ressourcenasymmetrie zwischen ambitionierten Zielen und verfuegbaren Mitteln illustriert, aber auch zeigt, dass epistemische Infrastruktur nicht zwingend teuer sein muss.

## 5. Ergebnisse (~3.500 Zeichen)

### 5.1 Quantitative Ergebnisse

Auf Basis von 210 Papers mit vollstaendigen Bewertungen beider Pfade ergibt sich fuer die Include/Exclude-Entscheidung eine Gesamtuebereinstimmung von 47,1 Prozent und ein Cohen's Kappa von κ = 0,035 ("slight"). Diese Zahl beschreibt keine Qualitaet der Bewertenden, sondern eine epistemische Struktur: LLM und Expert:innen operieren auf grundsaetzlich verschiedenen Wissensbasen und kommen deshalb systematisch zu verschiedenen Ergebnissen.

Die Verwirrungsmatrix zeigt das asymmetrische Muster: In 78 Faellen schliesst das LLM ein, die Expert:innen aus; in 23 Faellen ist es umgekehrt. Die LLM-Inklusionsrate betraegt 71 Prozent, die menschliche 42 Prozent. Das LLM klassifiziert grosszuegiger -- nicht weil es schlechter urteilt, sondern weil es auf anderen Merkmalen operiert: expliziten Keywords statt impliziter Feldverankerung.

Die Kategorie-Ebene zeigt differentielle Muster:

| Kategorie | Uebereinstimmung | Kappa | Befund |
|-----------|-----------------|-------|--------|
| Soziale_Arbeit | 68,9 % | -0,083 | Hohe Uebereinstimmung durch gemeinsame Ablehnung (LLM selten: 7,3 % vs. Human: 24,4 %) |
| Feministisch | 64,2 % | +0,075 | Einzige Kategorie mit klarer gegenseitiger Uebereinstimmung |
| Bias_Ungleichheit | 62,6 % | -0,097 | Trugbild: beide klassifizieren hoch, aber auf verschiedene Papers |
| Gender | 41,1 % | -0,098 | Staerkste Diskrepanz: Human 63 %, LLM 36 % |
| Fairness | 43,2 % | -0,163 | Schlechteste Kappa: LLM 73 % vs. Human 52 % |

### 5.2 Divergenz-Analyse

Die 111 Disagreement-Faelle verteilen sich ungleich: 78 Faelle (70 Prozent) folgen dem Muster "LLM Include, Human Exclude". Dieses Muster ist kein Messfehler, sondern die messbare Konsequenz epistemischer Asymmetrie.

**Muster 1: Keyword-Inklusion ohne Feldverankerung.** Das LLM reagiert auf thematische Oberflaechenstruktur -- ein Paper zum Einsatz algorithmischer Entscheidungssysteme in der Verwaltung erhaelt "KI_Sonstige = Ja" und "Soziale_Arbeit = Ja", weil die Woerter vorhanden sind. Die Expert:innen schliessen aus, weil der Paper-Kontext kein sozialarbeiterisches Problemverstaendnis entwickelt. Die Keywords stimmen, die Feldverankerung fehlt.

**Muster 2: Semantische Expansion bei wertgeladenen Kategorien.** Bei "Fairness" klassifiziert das LLM 73 Prozent aller bewerteten Papers positiv, die Expert:innen nur 52 Prozent. "Fairness" wird semantisch auf alle Gleichbehandlungsfragen ausgedehnt, wo die Expert:innen engere Kriterien (algorithmische Fairness-Metriken) anlegen. Dieses Muster zeigt, dass die Kategoriendefinitionen im Prompt den fachspezifischen Bedeutungshorizont nicht vollstaendig einfangen.

**Muster 3: Implizite Feldzugehoerigkeit.** Gender (Human 63 %, LLM 36 %) zeigt das umgekehrte Muster: Das LLM unterschaetzt systematisch, weil es "Gender" an expliziten Begriffsmarken festmacht. Expert:innen erkennen Gender-Perspektiven auch dann, wenn der Text sie implizit anlegt -- in Forschungsdesign, Stichprobenbeschreibung oder theoretischer Rahmung.

### 5.3 Epistemische Marker

Die Ergebnisse bestaetigen und praezisieren die theoretische Ausgangshypothese: Die Unterstuetzungsleistung des LLM ist nicht symmetrisch ueber Kategorien hinweg. Sie ist dort am hoechsten, wo Kategorien durch explizite Fachterminologie abgegrenzt sind ("Feministisch" mit direktem Theoriebezug, kappa = +0,075); sie ist dort am niedrigsten, wo die Kategorisierung semantische Expansion verhindert werden muss ("Fairness", kappa = -0,163) oder wo implizites Feldwissen erforderlich ist ("Gender", kappa = -0,098).

Der niedrige Gesamt-Kappa-Wert ist kein Argument gegen LLM-basiertes Assessment, sondern ein Argument fuer den dualen Bewertungspfad: Er zeigt, dass die Divergenz zwischen beiden Pfaden informationshaltig ist. Die Disagreement-Faelle sind keine Fehlerquelle, sondern die eigentlichen Daten -- sie markieren, wo maschinelle Musterkennung und disziplinaeres Kontextwissen strukturell auseinanderfallen.

## 6. Diskussion: Grenzen und Implikationen (~2.000 Zeichen)

### Zirkularitaet als Bedingung

LLMs werden eingesetzt, um Literatur ueber LLMs zu untersuchen. Diese reflexive Struktur ist kein Defekt, sondern eine Bedingung des Feldes: Es gibt keinen externen Standpunkt, von dem aus AI Literacy untersucht werden koennte, ohne selbst auf AI Literacy angewiesen zu sein. Die epistemische Infrastruktur macht diese Zirkularitaet transparent und auditierbar, ohne sie aufloesen zu koennen.

### Abhängigkeit und Verantwortung

Der gesamte Workflow operiert auf proprietaeren Systemen, deren interne Mechanismen intransparent sind. Die justifikatorische Esoterik[^6] laesst sich nicht beheben, nur bearbeiten: durch Multi-Provider-Strategien, deterministische Verarbeitungsstufen und den Expert:innen-Pfad als epistemisch verbindlichen Referenzpfad. Die Verantwortung fuer alle Ergebnisse bleibt bei den Forscher:innen.

### Was wir (nicht) wissen

Die empirische Datenlage zur LLM-Nutzung in der Sozialen Arbeit ist duenn. Welche Nutzungsmuster sich in der Praxis etabliert haben, welche Standards fuer "gute Nutzung" gelten koennten und welche Risiken jenseits offensichtlicher Bias-Problematiken existieren -- all das bleibt offen. Der systematische Literature Review schafft eine erste Evidenzbasis, die praxistaugliche Frameworks ermoeglichen soll.

## 7. Fazit (~1.000 Zeichen)

Epistemische Infrastruktur transformiert LLM-Einsatz von situativer Unterstuetzung zu nachvollziehbarer, verantwortbarer Wissensproduktion. Die hier vorgestellte Infrastruktur -- duale Bewertungspfade, deterministische Verarbeitungsstufen, Prompt-Governance, Divergenz-Dokumentation -- zeigt einen gangbaren Weg, der die Leistungsfaehigkeit von Frontier-LLMs nutzt, ohne die epistemischen Standards wissenschaftlicher Forschung aufzugeben. Der vollstaendige Workflow, die Prompt-Templates und alle Daten sind oeffentlich zugaenglich.[^13]

---

## Fussnoten

[^1]: Chatterji, A., Cunningham, T., Deming, D. J., et al. (2025). How People Use ChatGPT. NBER Working Paper No. W34255.
[^2]: Selbst, A. D., & Barocas, S. (2019). Fairness and Abstraction in Sociotechnical Systems. FAT* '19. ACM.
[^3]: Chen et al. (2025) dokumentieren "Persona Vectors" -- konsistente Charaktereigenschaften, die sich durch Finetuning verschieben koennen.
[^4]: Shanahan, M. (2024). Talking About Large Language Models. Minds and Machines, 34(1), Art. 3.
[^5]: Malmqvist, L. (2024). Sycophancy in Large Language Models: Causes and Mitigations. arXiv:2411.15287v1.
[^6]: Hauswald, R. (2025). Kuenstliche epistemische Autoritaeten.
[^7]: Pipeline-Code, Prompt-Templates (restauriert aus Git-History) und Zwischenergebnisse: github.com/chpollin/FemPrompt_SozArb. Der exakt instanziierte Deep-Research-Prompt wurde nicht persistent gespeichert; das parametrische Template und eine Rekonstruktion der Parametrisierung sind dokumentiert.
[^8]: Wiggins, B. & Bunin, S. (2023). Der Begriff der Konfabulation beschreibt den Erzeugungsmechanismus praeziser; vgl. Sui et al. (2024) zur erhoehten Narrativitaet konfabulierter LLM-Outputs.
[^9]: Overlap-Analyse auf Basis von 34 Papers der ersten Deep-Research-Runde. Vollstaendige Daten: github.com/chpollin/FemPrompt_SozArb/corpus/
[^10]: Woelfle, T., et al. (2024). Benchmarking Human-AI collaboration for common evidence appraisal tools. J Clin Epidemiol, 175, 111533.
[^11]: Hanegraaf, G., et al. (2024). Inter-reviewer reliability of human literature reviewing. BMJ Open, 14, e076912.
[^12]: Sandner, F., et al. (2025). Assessing the Reliability of Human and LLM-Based Screening. Konferenzpraesentation, OSSYM.
[^13]: github.com/chpollin/FemPrompt_SozArb -- Repository mit Prompt-Templates, Daten und Analyseskripten. Die Deep-Research-Prompt-Parametrisierung ist rekonstruiert, nicht verbatim archiviert.

---

## Zeichenzaehlung (Richtwert)

| Abschnitt | Ziel | Status |
|-----------|------|--------|
| 1. Einleitung | ~2.500 | Entwurf |
| 2. Epistemische Asymmetrie | ~2.500 | Entwurf |
| 3. Epistemische Infrastruktur | ~3.000 | Entwurf |
| 4. Methodik | ~3.500 | Entwurf |
| 5. Ergebnisse | ~3.500 | Platzhalter |
| 6. Diskussion | ~2.000 | Entwurf |
| 7. Fazit | ~1.000 | Entwurf |
| **Gesamt** | **~18.000** | **Entwurf + Platzhalter** |

---

*Aktualisiert: 2026-02-18*
