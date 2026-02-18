# Epistemische Asymmetrien in Deep-Research-gestuetzten Literature Reviews

**Untertitel:** Workflow-Design zwischen Large Language Models und Expert:innenwissen

**Autor:innen:** Christopher Pollin, Susanne Sackl-Sharif, Sabine Klinger, Christian Steiner

**Zielformat:** Forum Wissenschaft 2/2026
**Zeichenlimit:** 18.000 (inkl. Leerzeichen, inkl. Fussnoten)
**Fussnoten:** max. 15, kein Literaturverzeichnis
**Zielgruppe:** Wissenschaftler:innen mit wenig KI-Vorwissen
**Stand:** v0.4 -- ausgebaut und auf Limit gebracht (17.975 Zeichen, Limit 18.000)

---

## Editorische Hinweise

- Zeichenzaehlung: Python `len(text)` auf den reinen Fliesstext (ohne diese Meta-Sektion)
- Platzhalter `[[...]]` markieren Abschnitte, die noch offen sind
- Fussnoten werden inline als `[^N]` notiert
- Iterationshistorie: Aenderungen werden ueber Git-Commits nachvollzogen

---

## 1. Einleitung (~2.500 Zeichen)

Woechentlich nutzen 700 Millionen Menschen ChatGPT.[^1] Schreibaufgaben dominieren mit 42 Prozent die berufliche Nutzung, gefolgt von Entscheidungsunterstuetzung -- beides Kernfunktionen in der Sozialen Arbeit: Fallberichte, Dokumentation, Antragsstellung, Interventionsplanung. Gleichzeitig verschiebt sich die Nutzung in den privaten Bereich (73 Prozent Non-Work), was LLM-Literacy zur gesellschaftlichen Herausforderung macht. Granulare Daten zur Kategorie "Social Services" fehlen gaenzlich.

Diese Dynamik trifft ein Praxisfeld, das methodisch sensibler ist als die meisten anderen: Soziale Arbeit operiert mit vulnerablen Populationen, in Machtverhaeltnissen, die durch algorithmische Entscheidungen weiter sedimentiert werden koennen. AI Literacy -- das Wissen, wie KI-Systeme funktionieren, wie ihre Outputs zu bewerten sind und welche Werte sie tragen -- ist keine technische Zusatzkompetenz, sondern eine professionelle Grundanforderung, die bisher weder in Ausbildungscurricula noch in der Forschungsliteratur systematisch adressiert ist.

Diese Dynamik wirft eine grundlegende methodologische Frage auf: Wenn Frontier-LLMs -- das sind aktuelle Sprachmodelle der Leistungsklasse ChatGPT-4o, Claude 3.7, Gemini 2.0 -- zunehmend auch fuer wissenschaftliche Recherche eingesetzt werden, welche epistemischen Bedingungen muessen dann gelten, damit die Ergebnisse als Forschung zaehlen koennen? Epistemisch meint hier: auf Wissen bezogen, die Art und Weise betreffend, wie Erkenntnisse gewonnen, begruendet und ueberprueft werden.

Wir schlagen den Begriff der **epistemischen Infrastruktur** vor: die Gesamtheit der Verfahren, Dokumentationsstrukturen und Community-Praktiken, die sicherstellen, dass LLM-Beitraege in der Forschung ueberpruefbar, nachvollziehbar und verantwortbar bleiben. Nicht das Modell wird verlaesslich -- sondern der Forschungsprozess wird auditierbar.

Der Beitrag dokumentiert einen systematischen Literature Review zu feministischer AI Literacy und LLM-Bias in der Sozialen Arbeit (326 Papers, vier Deep-Research-Systeme) und fragt: **Welche epistemische Infrastruktur braucht ein LLM-gestuetzter Literature Review, um der Asymmetrie zwischen maschineller Musterkennung und fachlicher Urteilskraft methodisch gerecht zu werden?**

## 2. Epistemische Asymmetrie als Ausgangsproblem (~2.500 Zeichen)

### Jenseits simpler Bias-Narrative

Die Herausforderung hat sich verschoben. Waehrend Bias-Forschung noch mit Checklisten fuer algorithmische Fairness operiert[^2], zeigen Frontier-LLMs emergente Verhaltensweisen: Faehigkeiten, die ohne explizites Training entstehen; Alignment-Mechanismen, die in Spannung zu professionsspezifischen Werten stehen; Persona-Effekte, die durch Finetuning unvorhersehbare Auswirkungen erzeugen.[^3] Shanahan praegte den Begriff "Exotic Mind-Like Entities" fuer Systeme, die anders als Menschen operieren, obwohl ihr Verhalten menschenaehnlich erscheint.[^4]

### Das Jagged-Frontier-Phaenomen

Ethan Mollick praegte den Begriff "Jagged Frontier" fuer eine Eigentuemlichkeit von Frontier-LLMs: Sie sind in manchen Dimensionen weit uebermenschlich leistungsfaehig (Textverarbeitung, Mustererkennung ueber grosse Korpora), in anderen erschreckend schwach (implizite Feldkenntnis, disziplinaere Verortung) -- und die Grenzlinie ist von aussen nicht intuitiv vorhersagbar.

Unser Benchmark quantifiziert diese Grenzlinie empirisch: "Fairness" zeigt das uebermenschliche Muster -- das LLM klassifiziert 73 Prozent als Fairness-relevant, die Expert:innen nur 52 Prozent; es erkennt semantische Varianten des Konzepts auch ohne explizite Benennung. "Gender" zeigt das untermenschliche Muster -- das LLM klassifiziert nur 36 Prozent, die Expert:innen 63 Prozent; es verpasst systematisch Papers, die Gender-Perspektiven implizit anlegen.

### Sycophancy als Strukturproblem

Fuer die Soziale Arbeit relevant ist eine weitere Eigentuemlichkeit: **Sycophancy** -- die empirisch belegte Tendenz von LLMs, den Vorannahmen eines Prompts zuzustimmen, statt kritisch zu hinterfragen. Malmqvist dokumentiert Fehlereinbringungsraten von bis zu 40 Prozent bei suggestiven Anfragen.[^5] Wir begegnen diesem Risiko mit expliziten negativen Constraints im Assessment-Prompt: "Bei Unsicherheit: 'Nein' statt 'Ja'. Im Zweifel fuer den restriktiveren Wert."

### Die Asymmetrie ist wechselseitig

Epistemische Asymmetrie beschreibt eine Arbeitsteilung, in der die beteiligten Instanzen auf grundsaetzlich verschiedene Weise Wissen verarbeiten, wobei keine Seite die epistemischen Beitraege der anderen vollstaendig bewerten kann. LLMs verarbeiten grosse Textmengen und erkennen Muster ueber Hunderte von Texten. Expert:innen erkennen Nuancen, die nur mit Feldkenntnis sichtbar werden -- ob ein Paper zu algorithmischen Entscheidungssystemen in der Verwaltung tatsaechlich in der sozialen Praxis verwurzelt ist oder aus der Informatik operiert.

Hauswald argumentiert, dass epistemische Deferenz nicht an menschliches Verstehen gebunden sein muss.[^6] Entscheidend ist, ob Outputs als zuverlaessige Wahrheitsindikatoren fungieren -- das erlaubt es, LLM-Beitraege als epistemisch relevant zu behandeln, ohne dem System Verstehen zuzuschreiben. Zugleich beschreibt er eine "justifikatorische Esoterik": Trainingsdaten, Modellarchitekturen und Selektionslogiken bleiben unzugaenglich.

## 3. Epistemische Infrastruktur: Vom Konzept zur Operationalisierung (~3.000 Zeichen)

### Vier Ebenen

Epistemische Infrastruktur operiert auf vier ineinander verschraenkten Ebenen:

**Workflow-Ebene:** Duale Bewertungspfade und deterministische Verarbeitungsstufen. In unserem Workflow bewertet Claude Haiku 4.5 -- ein schnelles, kostenguenstiges LLM der aktuellen Modellgeneration -- alle 326 Papers parallel zu zwei Fachexpertinnen mit einem identischen 10-Kategorien-Schema. Die Divergenzen werden nicht als Fehler behandelt, sondern als epistemische Marker: Sie zeigen, wo maschinelle Musterkennung und disziplinaeres Kontextwissen systematisch auseinanderfallen.

**Research-Integrity-Ebene:** Jede Designentscheidung wird dokumentiert und nachvollziehbar begruendet. Das oeffentliche GitHub-Repository archiviert alle Prompts (versioniert), Zwischenergebnisse und Entscheidungsprozesse. Die 3-Stage Structured Knowledge Extraction (SKE) adressiert das Konfabulationsrisiko -- die Erzeugung kohaerenter, aber faktuell ungesicherter Aussagen -- durch eine deterministische mittlere Stufe: Stufe 1 extrahiert per LLM, Stufe 2 formatiert rein algorithmisch ohne jede LLM-Beteiligung (keine Konfabulation moeglich), Stufe 3 verifiziert gegen den Originaltext.[^7] Das Ergebnis: 97,2 Prozent der Wissens-Dokumente erreichen einen Verifikations-Score von mindestens 75/100.

**Institutionelle Ebene:** KI-Richtlinien fuer den Einsatz von LLMs in der Forschung existieren an vielen Einrichtungen noch nicht. Individuelle epistemische Infrastruktur ist umso notwendiger -- und eroeffnet die Chance, Praktiken zu etablieren, bevor sie top-down vorgeschrieben werden.

**Community-Ebene:** Peer-Review-Verfahren muessen kuenftig LLM-gestuetzte Workflows einschliessen koennen. Das erfordert neue Transparenzstandards (Prompt-Dokumentation, Modellversionierung) und eine realistische Einschaetzung von Reproduzierbarkeit: Gleiche Prompts erzeugen bei proprietaeren Systemen nicht zwingend gleiche Outputs.

### Konfabulation statt Halluzination

Wir verwenden den Begriff **Konfabulation** statt Halluzination: die Erzeugung kohaerenter, aber faktuell ungesicherter Aussagen, ohne dass eine interne Instanz den Wahrheitsgehalt prueft. Der Begriff stammt aus der klinischen Neuropsychologie und bezeichnet das unbewusste Fuellen von Gedaechtnisluecken mit plausiblen, aber nicht verifizierten Inhalten. Er beschreibt den Erzeugungsmechanismus praeziser als der wahrnehmungspsychologische Begriff "Halluzination", der ein Sinneserleben ohne Objekt impliziert.[^8] Konfabulierte LLM-Outputs weisen hoehere Narrativitaet und semantische Kohaerenz auf als veridikale -- sie sind also gerade dann ueberzeugend, wenn sie falsch sind.

### Kosten und Zugangsfragen

Die gesamte Pipeline kostete 10,17 Dollar: 7 Dollar fuer die Wissensextraktion aus 249 Volltexten, 1,44 Dollar fuer das 10-Kategorien-Assessment, 1,15 Dollar fuer das Relevanz-Screening. Epistemische Infrastruktur muss nicht teuer sein. Der kritische Engpass ist nicht Rechenkapazitaet, sondern Expert:innen-Zeit: Das Human Assessment von 210 Papers erfordert qualifiziertes Urteilsvermoegen, das nicht skaliert.

## 4. Methodik: Multi-Model Literature Review (~3.500 Zeichen)

### Identifikation: Parallele Deep Research

**Deep Research** bezeichnet die Faehigkeit aktueller Frontier-LLMs, autonom mehrstufige Recherchen durchzufuehren: Quellen identifizieren, Inhalte evaluieren, Erkenntnisse synthetisieren -- ohne menschliche Intervention in jedem Schritt. Der Workflow nutzt vier Systeme parallel: ChatGPT Deep Research, Claude Research, Gemini Deep Research und Perplexity, deren Selektionsmuster systematisch divergieren. Die Kontextparametrisierung erfolgt durch theoriegeleitete Prompt-Templates, die domaenenspezifische Terminologie (intersektionale Analyse, feministische AI-Literacy), methodische Anforderungen (PRISMA-konforme Dokumentation) und feldspezifische Publikationskanaele integrieren.

Aus den aggregierten Suchergebnissen entstand ein Korpus von 326 Papers: 254 via Deep Research, 50 manuell ergaenzt, 22 aus kuratierter Zotero-Sammlung. Die Multi-Provider-Strategie ist selbst epistemische Infrastruktur: Die Overlap-Analyse einer Stichprobe von 34 Papers zeigt, dass 93,8 Prozent der Papers von nur einem einzigen Provider gefunden wurden.[^9] Perplexity, ChatGPT, Claude und Gemini erzeugen weitgehend disjunkte Evidenzbasen -- Triangulation ist empirisch notwendig, nicht bloss methodische Vorsicht.

### Kuration: Paralleles Human-AI Assessment

Das Assessment-Design adaptiert den Benchmarking-Ansatz von Woelfle et al., bei dem identische Items von menschlichen Expert:innen und LLMs mit demselben Schema bewertet werden.[^10] Zwei Fachexpertinnen (Sozialpolitik, feministische Wissenschaftstheorie) bewerten alle Papers mit einem 10-Kategorien-Schema (binaer: AI_Literacies, Generative_KI, Prompting, KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit, Gender, Diversitaet, Feministisch, Fairness) plus Include/Exclude-Entscheidung. Claude Haiku 4.5 bewertet mit identischem Schema und zusaetzlichen negativen Constraints gegen Sycophancy.

Die primaere Vergleichsmetrik ist **Cohen's Kappa**: Der Koeffizient misst die Uebereinstimmung zwischen zwei Bewerter:innen, bereinigt um jene Uebereinstimmung, die rein zufaellig zu erwarten waere. Kappa = 1.0 bedeutet perfekte, 0.0 nur Zufallsuebereinstimmung. Der Erwartungshorizont: Woelfle et al. zeigen, menschliche Inter-Rater-Reliabilitaet sinkt mit Aufgabenkomplexitaet (kappa = 0,84 bei einfachen vs. 0,29 bei komplexen Items).[^10] Hanegraaf et al. dokumentieren kappa = 0,77-0,88 bei klaren Kriterien.[^11] Sandner et al. zeigen, dass LLMs nicht staerker von Menschen abweichen als Menschen voneinander.[^12]

### Synthese: Structured Knowledge Extraction

Die 249 erfolgreich konvertierten Volltexte durchlaufen eine dreistufige Wissensextraktion. Pro Paper werden Kernbefund, Forschungsfrage, Methodik, Hauptargumente und kategoriespezifische Evidenz extrahiert und in einem strukturierten Markdown-Dokument abgelegt. Die Verifikation in Stufe 3 prueft Vollstaendigkeit (40%), faktuelle Korrektheit (40%) und Kategorien-Evidenz (20%). Die gesamte Pipeline kostet 10,17 Dollar -- ein Befund, der zeigt, dass epistemische Infrastruktur nicht zwingend teuer sein muss.

## 5. Ergebnisse (~3.500 Zeichen)

### 5.1 Quantitative Ergebnisse

Auf Basis von 210 Papers mit vollstaendigen Bewertungen beider Pfade ergibt sich fuer die Include/Exclude-Entscheidung eine Gesamtuebereinstimmung von 47,1 Prozent und ein Cohen's Kappa von kappa = 0,035 ("slight" nach Landis & Koch). Diese Zahl beschreibt keine Qualitaet der Bewertenden, sondern eine epistemische Struktur: LLM und Expert:innen operieren auf grundsaetzlich verschiedenen Wissensbasen und kommen deshalb systematisch zu verschiedenen Ergebnissen.

Die Konfusionsmatrix zeigt das asymmetrische Muster: In 78 Faellen schliesst das LLM ein, die Expert:innen aus; in 23 Faellen ist es umgekehrt; in 63 Faellen stimmen beide zu einer Inklusion ueberein; in 34 Faellen stimmen beide zu einem Ausschluss ueberein. Die LLM-Inklusionsrate betraegt 71 Prozent, die menschliche 42 Prozent. Das LLM klassifiziert grosszuegiger -- nicht weil es schlechter urteilt, sondern weil es auf anderen Merkmalen operiert: expliziten Keywords statt impliziter Feldverankerung.

Die Kategorie-Ebene zeigt differentielle Muster:

| Kategorie | Uebereinstimmung | Kappa | Befund |
|-----------|-----------------|-------|--------|
| Soziale_Arbeit | 68,9 % | -0,083 | Trugbild: hohe Uebereinstimmung durch gemeinsame Ablehnung |
| Feministisch | 64,2 % | +0,075 | Einzige Kategorie mit echter gegenseitiger Uebereinstimmung |
| Bias_Ungleichheit | 62,6 % | -0,097 | Beide klassifizieren hoch, aber auf verschiedene Papers |
| Gender | 41,1 % | -0,098 | Staerkste Diskrepanz: Human 63 %, LLM 36 % |
| Fairness | 43,2 % | -0,163 | Schlechteste Kappa: LLM 73 % vs. Human 52 % |

### 5.2 Divergenz-Analyse: Drei Muster mit konkreten Belegen

Die 102 Disagreement-Faelle verteilen sich ungleich: 78 Faelle (74 Prozent) folgen dem Muster "LLM Include, Human Exclude", 24 Faelle dem umgekehrten Muster. Dieses Ungleichgewicht ist kein Messfehler, sondern die messbare Konsequenz der Jagged Frontier.

**Muster 1: Keyword-Inklusion ohne Feldverankerung.** Das LLM reagiert auf thematische Oberflaechenstruktur. Meilvang & Dahler (2024) zur algorithmischen Entscheidungsunterstuetzung werden vom LLM mit fuenf positiven Kategorien versehen. Die Expert:innen schliessen aus: Kontext ist Verwaltungsinformatik, nicht sozialarbeiterische Praxis. Keywords stimmen, Feldverankerung fehlt.

**Muster 2: Semantische Expansion bei wertgeladenen Kategorien.** Bei "Fairness" klassifiziert das LLM 73 Prozent positiv, die Expert:innen 52 Prozent. "Fairness" wird auf alle Gleichbehandlungsfragen ausgedehnt -- van Toorn et al. (2024) zum "digitalen Wohlfahrtsstaat" erhalten "Fairness = Ja" vom LLM, obwohl algorithmische Fairness-Metriken im technischen Sinn nicht thematisiert werden. Kategoriendefinitionen im Prompt koennen den fachspezifischen Bedeutungshorizont nicht vollstaendig einfangen.

**Muster 3: Implizite Feldzugehoerigkeit.** Gender (Human 63 %, LLM 36 %) zeigt das umgekehrte Muster. Pinski & Benlian (2024) und Ruiz et al. (2024) zu AI Literacy Frameworks werden von den Expert:innen mit "Gender = Ja" klassifiziert -- weil sie Kompetenzrahmen diskutieren, die historisch genderblind konstruiert sind und deren Implikationen sich erst bei feldspezifischer Lektuere erschliessen. Das LLM liest "Gender" an expliziten Begriffsmarken fest.

### 5.3 Epistemische Marker

Die Ergebnisse bestaetigen die Ausgangshypothese: Die Jagged Frontier ist messbar. LLM-Unterstuetzung ist dort am hoechsten, wo Kategorien durch explizite Fachterminologie abgegrenzt sind ("Feministisch", kappa = +0,075); am niedrigsten, wo semantische Expansion verhindert werden muss ("Fairness", kappa = -0,163) oder wo implizites Feldwissen erforderlich ist ("Gender", kappa = -0,098).

Der niedrige Gesamt-Kappa-Wert ist kein Argument gegen LLM-basiertes Assessment, sondern ein Argument fuer den dualen Bewertungspfad: Die Disagreement-Faelle sind die eigentlichen Daten -- sie markieren, wo maschinelle Musterkennung und disziplinaeres Kontextwissen strukturell auseinanderfallen.

## 6. Diskussion: Grenzen und Implikationen (~2.000 Zeichen)

### Zirkularitaet als Bedingung

LLMs werden eingesetzt, um Literatur ueber LLMs zu untersuchen. Diese reflexive Struktur ist kein Defekt, sondern eine Bedingung des Feldes: Es gibt keinen externen Standpunkt, von dem aus AI Literacy untersucht werden koennte, ohne selbst auf AI Literacy angewiesen zu sein. Wer LLM-Bias erforscht, muss LLMs einsetzen, ohne sicher wissen zu koennen, ob die Outputs ihrerseits biasverzerrt sind. Die epistemische Infrastruktur macht diese Zirkularitaet transparent und auditierbar, ohne sie aufloesen zu koennen.

### Grenzen des Designs

Drei Einschraenkungen sind systematisch: Der Benchmark basiert auf 210 der 326 Papers -- 116 ohne vollstaendiges Human Assessment bleiben aussen vor. Die Overlap-Analyse der Provider ist nur fuer eine Stichprobe von 34 Papers belegbar. Die PDF-Beschaffungsrate von 79 Prozent erzeugt eine systematische Unterrepraesentation paywall-gesicherter Literatur.

### Abhaengigkeit und Verantwortung

Der Workflow operiert auf proprietaeren Systemen, deren interne Mechanismen intransparent sind. Die justifikatorische Esoterik laesst sich nicht beheben, nur bearbeiten: durch Multi-Provider-Strategien, deterministische Verarbeitungsstufen und den Expert:innen-Pfad als verbindlichen Referenzpfad. Die Verantwortung bleibt bei den Forscher:innen -- nicht beim Modell. Diese Asymmetrie ist der Grund, warum epistemische Infrastruktur notwendig ist.

### Implikationen fuer Curricula und Praxis

AI Literacy ist keine Bedienungsanleitung. Sie umfasst das Verstaendnis, dass LLMs auf explizite Begriffe, nicht auf implizite Fachkulturen reagieren; dass ihre Ausgaben kohaerenter klingen, je falscher sie sind; dass Kontrolle bei der fachkundigen Person verbleiben muss. Ein LLM, das einen Fall als "Fairness-relevant" klassifiziert, hat eine semantische Entsprechung gefunden -- keine fachliche Einschaetzung getroffen.

## 7. Fazit (~1.000 Zeichen)

Epistemische Infrastruktur transformiert LLM-Einsatz von situativer Unterstuetzung zu nachvollziehbarer, verantwortbarer Wissensproduktion. Die hier vorgestellte Infrastruktur -- duale Bewertungspfade, deterministische Verarbeitungsstufen, Prompt-Governance, Divergenz-Dokumentation -- zeigt einen gangbaren Weg, der die Leistungsfaehigkeit von Frontier-LLMs nutzt, ohne die epistemischen Standards wissenschaftlicher Forschung aufzugeben.

Der Befund kappa = 0,035 ist nicht ernuechternd, sondern instruktiv: Die "Jagged Frontier" ist im Bereich AI Literacy und Soziale Arbeit empirisch messbar. Wer weiss, dass sein Instrument bei "Fairness" ueberschiesst und bei "Gender" unterschiesst, kann methodisch damit umgehen. Drei Empfehlungen: Dualen Bewertungspfad als Standarddesign etablieren. Divergenz-Faelle als Daten analysieren, nicht als Fehler bereinigen. Prompt-Governance institutionalisieren: Negative Constraints und Prompt-Versionierung sind Mindeststandards, keine Praezisionswerkzeuge. Der vollstaendige Workflow ist oeffentlich zugaenglich.[^13]

---

## Fussnoten

[^1]: Chatterji, A., Cunningham, T., Deming, D. J., et al. (2025). How People Use ChatGPT. NBER Working Paper No. W34255.
[^2]: Selbst, A. D., & Barocas, S. (2019). Fairness and Abstraction in Sociotechnical Systems. FAT* '19. ACM.
[^3]: Chen et al. (2025) dokumentieren "Persona Vectors" -- konsistente Charaktereigenschaften, die sich durch Finetuning verschieben koennen, einschliesslich Cross-Trait-Effekten auf nicht intendierte Dimensionen.
[^4]: Shanahan, M. (2024). Talking About Large Language Models. Minds and Machines, 34(1), Art. 3.
[^5]: Malmqvist, L. (2024). Sycophancy in Large Language Models: Causes and Mitigations. arXiv:2411.15287v1.
[^6]: Hauswald, R. (2025). Kuenstliche epistemische Autoritaeten. Der Begriff der "justifikatorischen Esoterik" bezeichnet den Zustand, in dem ein epistemisches System Outputs produziert, ohne seine Begruendungen offenzulegen.
[^7]: Pipeline-Code, Prompt-Templates und Zwischenergebnisse: github.com/chpollin/FemPrompt_SozArb. Der exakt instanziierte Deep-Research-Prompt wurde nicht persistent gespeichert; das parametrische Template und eine Rekonstruktion der Parametrisierung sind dokumentiert.
[^8]: Zur Begrifflichkeit vgl. Wiggins & Bunin (2023); zur erhoehten Narrativitaet konfabulierter LLM-Outputs vgl. Sui et al. (2024).
[^9]: Overlap-Analyse auf Basis von 34 Papers der ersten Deep-Research-Runde (RIS-Dateien). Vollstaendige Daten: github.com/chpollin/FemPrompt_SozArb/corpus/. Eine Gesamt-Overlap-Analyse ist mit den vorhandenen Metadaten nicht durchfuehrbar, da jedes Paper in der Datenbank nur einem Provider zugeordnet ist.
[^10]: Woelfle, T., et al. (2024). Benchmarking Human-AI collaboration for common evidence appraisal tools. J Clin Epidemiol, 175, 111533.
[^11]: Hanegraaf, G., et al. (2024). Inter-reviewer reliability of human literature reviewing. BMJ Open, 14, e076912.
[^12]: Sandner, F., et al. (2025). Assessing the Reliability of Human and LLM-Based Screening. Konferenzpraesentation, OSSYM.
[^13]: github.com/chpollin/FemPrompt_SozArb -- Repository mit Prompt-Templates, Daten und Analyseskripten.

---

## Zeichenzaehlung (Richtwert)

| Abschnitt | Ziel | Status |
|-----------|------|--------|
| 1. Einleitung | ~2.500 | Ausgebaut v0.3 |
| 2. Epistemische Asymmetrie | ~2.500 | Ausgebaut (Jagged Frontier) |
| 3. Epistemische Infrastruktur | ~3.000 | Ausgebaut (SKE-Details, Kosten) |
| 4. Methodik | ~3.500 | Ausgebaut (Provenienz, Kappa-Erklaerung) |
| 5. Ergebnisse | ~3.500 | Ausgebaut (qualitative Beispiele) |
| 6. Diskussion | ~2.000 | Ausgebaut (Grenzen, Curricula) |
| 7. Fazit | ~1.000 | Ausgebaut (3 Empfehlungen) |
| **Gesamt** | **18.000** | **v0.4 -- 17.975 Zeichen (25 unter Limit)** |

---

*Aktualisiert: 2026-02-18 (v0.4)*
