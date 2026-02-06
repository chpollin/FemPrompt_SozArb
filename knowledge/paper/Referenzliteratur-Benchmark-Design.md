# Referenzliteratur zum Benchmark-Design: Human-AI Collaboration in Literature Screening

Wissensdokument für das Projekt *Deep-Research-gestützte Literature Reviews im Praxistest*
(Pollin, Sackl-Sharif, Klinger – Forum Wissenschaft 2/2026)

Stand: 4. Februar 2026. Alle Angaben gegen die Originaltexte verifiziert.

---

## Zweck dieses Dokuments

Dieses Dokument dokumentiert die methodische Referenzliteratur für den Benchmark-Teil des Papers. Es fasst zusammen, was jede Quelle empirisch zeigt, wo sie zum Projektdesign passt und wo nicht, und welche konkreten Werte als Erwartungshorizont für die eigenen Ergebnisse dienen können.

Das Projekt implementiert ein paralleles Human-LLM-Assessment auf 326 Papers mit einem 10-Kategorien-Schema (binär) plus Include/Exclude-Entscheidung. Zwei Fachexpertinnen (Susi, Sabine) bewerten parallel zu Claude Haiku 4.5. Die primäre Vergleichsmetrik ist Cohen's Kappa. Der methodische Rahmen ist PRISMA-2020 mit KI-spezifischen Erweiterungen.

Drei Referenzstudien wurden als relevant eingestuft.

---

## 1. Woelfle et al. (2024) – Methodische Hauptreferenz

**Vollständige Referenz**
Woelfle, T., et al. (2024). Benchmarking Human–AI collaboration for common evidence appraisal tools. *Journal of Clinical Epidemiology*, 175, 111533.

**Reproduzierbarkeit:** Vollständig (GitHub-Repo mit Code, Daten, Prompts; interaktives Web-Dashboard)

### Was die Studie macht

Woelfle vergleicht fünf LLMs (Claude-3-Opus, Claude-2, GPT-4, GPT-3.5, Mixtral-8x22B) systematisch mit menschlichem Konsens bei drei Bewertungsinstrumenten. Die Instrumente sind nach steigender Komplexität geordnet.

PRISMA (27 Items) prüft die Berichtsqualität systematischer Reviews. Die Items fragen nach dem Vorhandensein spezifischer Textmerkmale ("Wurde eine Suchstrategie dokumentiert?"). Das ist primär textbasierte Pattern-Erkennung.

AMSTAR (11 Items) bewertet die methodische Rigorosität. Die Items erfordern bereits Interpretation, nicht nur Textsuche ("Wurde das Biasrisiko adäquat bewertet?").

PRECIS-2 (9 Domains) beurteilt den Pragmatismus klinischer Studien auf einer 5-Punkte-Skala. Das erfordert komplexes kontextuelles Urteil.

Die Datenbasis umfasst 112 Systematic Reviews (PRISMA, AMSTAR) und 56 RCTs (PRECIS-2).

### Zentrale Ergebnisse (verifiziert)

**Individuelle LLM-Accuracy**

| Instrument | Bestes LLM | Schlechtestes LLM | Menschliche Baseline |
|---|---|---|---|
| PRISMA | Claude-3-Opus, 70% | GPT-3.5, 63% | 89% |
| AMSTAR | Claude-3-Opus, 74% | GPT-3.5, 53% | 89% |
| PRECIS-2 | Claude-3-Opus, 55% | GPT-3.5, 38% | 75% |

**Human-AI-Kollaboration (Deferring-Ansatz)**

Bei diesem Ansatz entscheidet das LLM autonom bei hoher Konfidenz und delegiert unsichere Fälle an den menschlichen Rater. Die Ergebnisse variieren je nach Modell und Deferring-Schwelle.

| Instrument | Accuracy-Spanne | Deferring-Rate |
|---|---|---|
| PRISMA | 89–96% | 25–35% |
| AMSTAR | 91–95% | 25–35% |
| PRECIS-2 | 80–86% | 71–76% |

**Inter-Rater-Reliabilität der menschlichen Rater**

| Instrument | Cohen's κ |
|---|---|
| PRISMA | 0.84 |
| AMSTAR | 0.77 |
| PRECIS-2 | 0.29 |

Der niedrige κ-Wert bei PRECIS-2 zeigt, dass selbst erfahrene menschliche Rater bei komplexen Bewertungsaufgaben nur schwache Übereinstimmung erreichen.

**Methodische Besonderheiten:** Bootstrap-Konfidenzintervalle mit 1000 Resamples, Duplikat-Runs zur Reliabilitätsprüfung (Median Quote Similarity 99%), vollständige Prompt-Archivierung.

### Passung zum Projektdesign

Die Passung ist hoch auf der Ebene des Designs (paralleles Human-LLM-Assessment mit identischem Schema, Cohen's Kappa als Metrik, PRISMA-Kontext). Es gibt aber einen substanziellen Unterschied in der Aufgabenart. Woelfle evaluiert *Evidence Appraisal*, also die Bewertung bereits eingeschlossener Studien anhand strukturierter Checklisten. Das Projekt macht *Screening*, also die Entscheidung, ob ein Paper thematisch relevant ist und in bestimmte Kategorien fällt.

Dieser Unterschied hat Konsequenzen für die erwartbare LLM-Leistung. PRISMA-Items fragen nach Textmerkmalen, was LLMs begünstigt. Das 10-Kategorien-Schema des Projekts fragt nach thematischer Zugehörigkeit ("Ist dieses Paper feministisch?"), was disziplinäres Kontextwissen erfordert. Die Aufgabe liegt auf der Komplexitätsskala vermutlich zwischen AMSTAR und PRECIS-2.

**Konkreter Nutzen für das Paper:**
Das parallele Design und die PRISMA-Konformität werden als methodische Vorlage referenziert. Die Komplexitätsabhängigkeit der LLM-Leistung (PRISMA 70% → PRECIS-2 55%) dient als Erwartungskalibrierung. Die PRECIS-2-Ergebnisse sind als realistischer Erwartungshorizont vermutlich aussagekräftiger als die hohen PRISMA-Werte.

**Was nicht übertragbar ist:**
Die hohen Accuracy-Werte bei Human-AI-Kollaboration (bis 96%) beziehen sich auf strukturierte Checklisten-Items und sind wahrscheinlich nicht auf kategorienbasiertes thematisches Screening transferierbar.

---

## 2. Hanegraaf et al. (2024) – Menschliche Baseline

**Vollständige Referenz**
Hanegraaf, G., et al. (2024). Inter-reviewer reliability of human literature reviewing and implications for the introduction of machine-assisted systematic reviews. *BMJ Open*, 14, e076912.

**Registrierung:** PROSPERO CRD42023386706
**Reproduzierbarkeit:** Mittel (registriert, aber Rohdaten nicht öffentlich verfügbar)

### Was die Studie macht

Hanegraaf stellt eine Frage, die erstaunlicherweise vor dieser Studie nie systematisch untersucht wurde, nämlich wie hoch die Inter-Reviewer-Reliabilität menschlicher Reviewer in systematischen Reviews tatsächlich ist. Die Studie kombiniert einen systematischen Review (836 gescreente Artikel, 45 eingeschlossen) mit einer Befragung von 37 SLR-Autor:innen.

### Zentrale Ergebnisse (verifiziert)

**Menschliche IRR nach Screening-Phase (aus dem Systematic Review, n=45 SLRs)**

| Phase | Durchschnittlicher Cohen's κ | SD | n (Studien, die κ berichten) |
|---|---|---|---|
| Abstract-Screening | 0.82 | 0.11 | 12 |
| Full-Text-Screening | 0.77 | 0.18 | 14 |
| Gesamt-Screening | 0.86 | – | (aggregiert) |
| Datenextraktion | 0.88 | – | (aggregiert) |

**IRR der eigenen Studie:** Die Reviewer der Studie selbst erreichten κ = 0.72 sowohl für Abstract- als auch für Full-Text-Screening.

**Survey-Befunde:** Befragte erwarten von ML-gestützten Reviews eine *höhere* IRR als von menschlichen Reviews. Die erwarteten κ-Bereiche überlappen (0.6–0.9), aber die Schwelle für Akzeptanz maschineller Ergebnisse liegt über dem, was Menschen selbst leisten. Die Autor:innen ziehen eine Analogie zum *better-than-average*-Effekt bei selbstfahrenden Autos (nach Nees, 2019), wonach autonome Systeme nicht nur durchschnittliche, sondern überdurchschnittliche Leistung erreichen müssen, bevor sie akzeptiert werden.

**Methodische Qualität der eingeschlossenen SLRs:** 91.1% (n=41/45) wurden nach AMSTAR 2 als *critically low* bewertet, was auf systematische Qualitätsprobleme in der IRR-Berichterstattung hinweist.

**Limitationen:** Nur SLRs von RCTs eingeschlossen. Kleine Survey-Stichprobe (n=37). Wahrscheinlicher Publikationsbias, da Studien mit niedriger IRR diese vermutlich seltener berichten.

### Passung zum Projektdesign

Der Wert für das Projekt liegt nicht in einem einzelnen Benchmark-Wert, sondern in zwei Argumenten.

Erstens die imperfekte menschliche Baseline. Wenn Susi und Sabine bei komplexen Kategorien wie "feministisch" oder "intersektional" nur moderate Übereinstimmung erreichen, ist das kein Defekt des Schemas, sondern konsistent mit dem, was Hanegraaf für menschliche Reviewer generell zeigt. Die Kappa-Werte 0.77–0.88 sind allerdings nur bedingt als direkte Vergleichswerte geeignet, weil sie aus SLRs von RCTs stammen, einem Kontext mit klareren Ein-/Ausschlusskriterien als "feministische AI-Literacy".

Zweitens der Doppelstandard bei ML-Akzeptanz. Falls die eigenen Ergebnisse zeigen, dass Claude Haiku 4.5 eine moderate Übereinstimmung mit den Expert:innen erreicht (etwa κ ≈ 0.5–0.7), kann Hanegraaf argumentativ eingesetzt werden, um zu zeigen, dass ein solcher Wert innerhalb der Bandbreite menschlicher Übereinstimmung liegt und der implizite Anspruch, dass LLMs *besser* sein müssten als Menschen, empirisch nicht begründet ist.

---

## 3. Sandner et al. (2025) – Expertise-Variable und Screening-Kontext

**Vollständige Referenz**
Sandner, F., et al. (2025). Assessing the Reliability of Human and LLM-Based Screening in Systematic Reviews: A Study of First-Time Reviewers. Konferenzpräsentation (OSSYM), Folienformat.

**Reproduzierbarkeit:** Nicht beurteilbar (nur Folien verfügbar, kein Volltext)

### Was die Studie macht

Sandner nutzt eine Lehrveranstaltung an der TU Graz (Information Search and Retrieval, WS2024) als natürliches Experiment. 54 Studierende in 10 Teams screenen jeweils 30 Papers aus 10 SIGIR'24-Topics. Jedes Paper wird von mindestens 4 Studierenden bewertet. Parallel wird ein LLM-Screening mit einem 5-Tier-Ansatz durchgeführt (Stufen 1–3 = Include, 4–5 = Exclude), das vor dem menschlichen Screening stattfindet.

### Zentrale Ergebnisse (verifiziert)

**Menschliche Übereinstimmung (Novizen)**

| Metrik | Wert | Anmerkung |
|---|---|---|
| Fleiss' κ (Teamdurchschnitte) | 0.24–0.65 | Spanne über 10 Teams |
| Fleiss' κ (Gesamtdurchschnitt) | 0.39 | Fair agreement nach Landis & Koch |

Die einzelnen Team-Werte sind 0.25, 0.31, 0.24, 0.32, 0.65, 0.38, 0.53, 0.45, 0.46, 0.26.

**Human-LLM-Übereinstimmung**

| Metrik | Wert | Anmerkung |
|---|---|---|
| Cohen's κ (Human-Konsens vs. LLM) | 0.26–0.80 | Spanne über 10 Topics |
| Cohen's κ (Durchschnitt) | 0.52 | Weak to moderate agreement |

**Leistung gegen Ground Truth (Team-Konsens als Referenz)**

| Konfiguration | Sensitivity | Specificity |
|---|---|---|
| Einzelner Mensch | 84.03% | 90.36% |
| LLM allein | 80.30% | 85.50% |
| Doppeltes menschliches Screening | 99.18% | 82.10% |
| Mensch + LLM | 94.98% | 79.22% |

### Passung zum Projektdesign

Sandner ist trotz des Konferenzformats für das Projektdesign überraschend relevant, aus drei Gründen.

Erstens die Aufgabenähnlichkeit. Sandner untersucht Title/Abstract-Screening mit Include/Exclude-Entscheidungen. Das ist dem Screening-Design des Projekts am nächsten, näher als Woelfles Evidence Appraisal.

Zweitens die Expertise-Frage. Sandners Novizen stehen am einen Ende des Erfahrungsspektrums. Die Expert:innen des Projekts (Susi, Sabine) haben Domänenexpertise in Sozialer Arbeit und Genderforschung, aber möglicherweise begrenzte Erfahrung mit systematischen Reviews als Methode. Das positioniert das Projekt zwischen Sandners Novizen und Woelfles erfahrenen Ratern. Die eigenen IRR-Werte sollten über Sandners Fleiss' κ ≈ 0.39 liegen, aber möglicherweise unter Hanegraaf's κ ≈ 0.82.

Drittens der Kernbefund. Dass LLMs nicht stärker von Menschen abweichen als Menschen voneinander (Cohen's κ Human-LLM ≈ 0.52 vs. Fleiss' κ Human-Human ≈ 0.39), ist direkt als Hypothese für das eigene Design überprüfbar. Falls ein ähnliches Muster auftritt, stützt das die Argumentation, dass LLM-Assessment als gleichwertiger Screening-Partner fungieren kann.

**Konkreter Nutzen für das Paper:**
Ergänzender Befund, der eine spezifische Hypothese stützt, nämlich dass die Expertise-Variable den IRR-Wert stärker moderiert als die Frage Mensch-vs.-Maschine. Außerdem die methodisch wichtige Warnung, dass Gruppenkonsens als Ground Truth problematisch ist, wenn die Gruppe selbst nur moderat übereinstimmt.

**Zitierstrategie:**
Sandner wird nicht als gleichrangige empirische Evidenz neben Woelfle gestellt, sondern als ergänzender Befund mit der Einschränkung, dass nur Konferenzfolien vorliegen und die IR-Domäne sich von feministischer AI-Literacy unterscheidet.

---

## Konvergierende Befunde und Erwartungshorizont für das Projekt

### Drei Befunde, die alle drei Studien stützen

**Menschliche Übereinstimmung ist nicht perfekt und variiert stark mit der Aufgabenkomplexität.** Hanegraaf zeigt κ = 0.77–0.88 bei erfahrenen Reviewern mit relativ klaren Kriterien (RCT-Einschluss). Woelfle zeigt κ = 0.84 bei einfachen Items (PRISMA), aber nur κ = 0.29 bei komplexen Bewertungen (PRECIS-2). Sandner zeigt κ = 0.39 bei Novizen. Die Komplexität der Aufgabe und die Erfahrung der Reviewer bestimmen die Baseline stärker als die Methodik.

**LLMs allein liegen unter erfahrener menschlicher Leistung, können aber Novizen-Niveau erreichen.** Woelfle zeigt 53–74% LLM-Accuracy vs. 89% menschliche Baseline. Sandner zeigt LLM-Sensitivity von 80% vs. menschliche 84%. In keiner Studie übertrifft ein einzelnes LLM die menschliche Leistung.

**Human-AI-Kollaboration kann die individuelle menschliche Leistung übertreffen, aber nur bei hinreichend strukturierten Aufgaben.** Woelfle zeigt bis zu 96% Accuracy bei PRISMA (strukturiert), aber nur 86% bei PRECIS-2 (komplex). Bei PRECIS-2 müssen 71–76% der Items an Menschen delegiert werden, was den Effizienzgewinn erheblich reduziert.

### Erwartungshorizont für das Projekt

Basierend auf den drei Referenzstudien lässt sich eine begründete Erwartung formulieren.

**Human-Human-Kappa (Susi vs. Sabine):** Erwartbar im Bereich κ ≈ 0.5–0.8, abhängig von der Kategorie. Gut definierte Kategorien (AI_Literacies, Generative_KI) sollten höhere Werte erreichen als interpretationsabhängige Kategorien (Feministisch, Diversitaet). Werte unter 0.6 bei interpretativen Kategorien wären kein Defekt, sondern konsistent mit der Literatur.

**Human-LLM-Kappa:** Erwartbar im Bereich κ ≈ 0.3–0.7, ebenfalls kategorienabhängig. Keyword-nahe Kategorien (Prompting, Generative_KI) sollten höhere Werte erreichen als kontextabhängige (Feministisch, Bias_Ungleichheit). Die Hypothese aus Sandner, dass Human-LLM-Kappa in der gleichen Größenordnung liegt wie Human-Human-Kappa, ist testbar.

**Erwartbare Fehlermuster:** Basierend auf Woelfle und Sandner sind zwei systematische Muster plausibel. Erstens LLM-Overinclusion bei keyword-nahen, aber kontextuell irrelevanten Papers. Ein Paper, das "gender" im Titel trägt, aber Genderaspekte nur am Rand behandelt, könnte vom LLM als "Gender = Ja" klassifiziert werden. Zweitens LLM-Underinclusion bei implizit relevanten Papers. Arbeiten, die feministische Perspektiven einnehmen, ohne den Begriff "feministisch" zu verwenden, könnten vom LLM übersehen werden. Dieses Muster wäre ein konkreter Beleg für die im Paper-Entwurf diskutierten epistemischen Asymmetrien zwischen statistischer Pattern-Erkennung und disziplinärem Kontextwissen.

---

## Projektspezifische Besonderheiten ohne Referenz in der Literatur

Drei Aspekte des Projektdesigns werden in keiner der drei Referenzstudien adressiert.

**Domänenspezifik.** Feministische AI-Literacy und intersektionales Prompting in der Sozialen Arbeit sind Felder, in denen Klassifikationsentscheidungen stark von implizitem disziplinärem Wissen abhängen. Ob ein Paper "feministisch" ist, lässt sich nicht an Keywords ablesen, sondern erfordert Vertrautheit mit theoretischen Traditionen. Das macht die Aufgabe potenziell anspruchsvoller als alle drei Referenzstudien, und die erwartbaren Kappa-Werte entsprechend niedriger. Dieser Befund wäre, falls er sich bestätigt, ein genuín neuer Beitrag.

**Sycophancy-Effekt.** Der Paper-Entwurf diskutiert die Möglichkeit, dass der Assessment-Prompt das LLM dazu verleitet, betonte Kategorien großzügiger zuzuweisen. Keine der drei Referenzstudien untersucht diesen Effekt empirisch. Falls das LLM systematisch mehr Includes produziert als die Expert:innen, wäre das ein Befund, der über die reine IRR-Messung hinausgeht und mit Malmqvists *Error Introduction Rates* verknüpft werden kann.

**Zirkularität.** LLMs werden eingesetzt, um Literatur über LLMs zu identifizieren und zu bewerten. Diese reflexive Struktur ist in keiner der Referenzstudien gegeben. Falls sich zeigt, dass das LLM Literatur, die LLM-Limitationen dokumentiert, weniger zuverlässig identifiziert als Literatur, die LLM-Potenziale betont, wäre das ein methodisch und epistemologisch relevanter Befund.

---

## Terminologie-Empfehlung

**Verwenden:**
- "Parallel Human-AI Assessment" (angelehnt an Woelfle)
- "Inter-Rater Reliability Benchmark" (angelehnt an Hanegraaf)
- "Symbiotic Mode" (aus dem HAIC-Framework, arXiv 2024)

**Vermeiden:**
- "Dual Track Design" (Agile-Terminus aus der Softwareentwicklung, falsche Assoziation)

---

## Formulierungsvorschlag für die Methodik-Sektion

> Adapting the parallel human-AI assessment design from Woelfle et al. (2024), we implement a benchmarking approach where identical papers are evaluated by both domain experts and LLM using the same categorical schema. Unlike Woelfle's evidence appraisal task (structured checklist items), our screening task requires thematic categorization based on disciplinary context knowledge, positioning it closer to PRECIS-2 complexity levels where human IRR itself is moderate (κ ≈ 0.29–0.77, depending on task complexity; Hanegraaf et al., 2024; Woelfle et al., 2024).

---

## Bibliographische Referenzen

Hanegraaf, G., et al. (2024). Inter-reviewer reliability of human literature reviewing and implications for the introduction of machine-assisted systematic reviews. *BMJ Open*, 14, e076912. PROSPERO CRD42023386706.

Sandner, F., et al. (2025). Assessing the Reliability of Human and LLM-Based Screening in Systematic Reviews: A Study of First-Time Reviewers. Konferenzpräsentation (OSSYM), TU Graz / WHO / CERN.

Woelfle, T., et al. (2024). Benchmarking Human–AI collaboration for common evidence appraisal tools. *Journal of Clinical Epidemiology*, 175, 111533. GitHub: [Code und Daten offen verfügbar].

---

*Erstellt: 4. Februar 2026*
*Verknüpft mit: [[Human-LLM Assessment Benchmark]], [[Forum Wissenschaft Paper - Arbeitsplan]], [[Workflow für eine Deep-Research-gestützte Literaturanalyse am Beispiel von feministischem AI-Literacy]]*
