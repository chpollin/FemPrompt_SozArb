# FemPrompt_SozArb -- Projekt-Wissensdokument

Synthetisiertes Uber-Wissensdokument. Zentraler Einstiegspunkt fuer den schnellen Ueberblick ueber alle Projektdimensionen. Detaillierte Dokumentation liegt in `knowledge/`.

---

## Identitaet des Projekts

**Was:** Systematischer Literature Review zu feministischer AI Literacy und LLM-Bias in der Sozialen Arbeit.

**Forschungsfrage:** Wie reliabel ist LLM-basiertes Literatur-Assessment im Vergleich zu Expert:innen-Bewertung bei einem interdisziplinaeren, feministisch-technischen Forschungsfeld?

**Zentrales Konzept:** *Epistemische Infrastruktur* -- Gesamtheit der Verfahren, Dokumentationsstrukturen und Praktiken, die sicherstellen, dass LLM-Beitraege in der Forschung ueberpruefbar, nachvollziehbar und verantwortbar bleiben. Nicht das Modell wird verlaesslich -- der Forschungsprozess wird auditierbar.

**Output:** Paper fuer Forum Wissenschaft 2/2026 (Deadline 4. Mai 2026, 18.000 Zeichen).

**Team:** Christopher Pollin (Technik), Susanne Sackl-Sharif + Sabine Klinger (Human Assessment), Christian Steiner (Review)

---

## Meilenstein-Status (Stand 2026-02-18)

| Meilenstein | Status | Kern-Output |
|-------------|--------|-------------|
| M1 Knowledge-Konsolidierung | DONE | knowledge/ neu strukturiert |
| M2 Paper im Repo | DONE | knowledge/paper/paper-draft.md |
| M3 Deep-Research-Prompts restaurieren | DONE | prompts/deep-research-template.md |
| M4 Korpus-Bereinigung | DONE | benchmark/data/papers_full.csv (326 Zeilen) |
| M5 10K LLM Assessment | DONE | benchmark/data/llm_assessment_10k.csv (326/326, $1.44) |
| M6 Teilmengen-Benchmark | DONE | benchmark/results/ (κ = 0,035, 210 Papers) |
| M7 Ergebnisse ins Paper | DONE (v0.4) | paper-draft.md 17.975 Zeichen, 25 unter Limit |
| M8 Paper finalisieren | OFFEN | Review-Runde Co-Autor:innen |
| M9 GitHub Pages | OFFEN | docs/ SPA deployed, Pages-Aktivierung manuell |

**Naechster Blocker:** Human Assessment Vervollstaendigung (116 Papers ohne Entscheidung). Kein Paper-Schritt blockiert mehr durch fehlende Daten -- M7 vollstaendig geschrieben.

---

## Korpus

| Parameter | Wert |
|-----------|------|
| Papers gesamt (Zotero) | 326 |
| Davon Deep Research | 254 (ChatGPT, Claude, Gemini, Perplexity) |
| Davon manuell | 50 |
| PDFs beschafft | 257 / 326 (79 %) |
| Markdown konvertiert | 252 / 257 (98 %) |
| Knowledge Docs | 249 / 252 (97 % Qualitaet) |
| Human Assessment (mit Entscheidung) | 210 |
| Ohne Human Assessment | 116 (kein Blocker fuer Paper) |

**Provenienz-Besonderheit:** 93,8 % der Deep-Research-Papers wurden von nur einem Provider gefunden (Stichprobe 34 Papers). Verschiedene Modelle erzeugen weitgehend disjunkte Evidenzbasen.

---

## Benchmark-Ergebnisse (Kern)

**Basis:** 210 Papers mit vollstaendigem Human + LLM Assessment.

| Metrik | Wert |
|--------|------|
| Gesamtuebereinstimmung (Include/Exclude) | 47,1 % |
| Cohen's Kappa (gesamt) | 0,035 ("slight") |
| LLM-Inklusionsrate | 71 % (232/326) |
| Human-Inklusionsrate | 42 % (88/210) |
| Disagreements gesamt | 102 (74 LLM-Include/Human-Exclude, 28 umgekehrt) |

**Konfusionsmatrix:**

| | Human Include | Human Exclude |
|-|:---:|:---:|
| LLM Include | 63 (Kern) | 78 (LLM-Kandidaten) |
| LLM Exclude | 23 (Human-Signal) | 34 (Konsens-Ausschluss) |

**Kategorie-Kappa (Auswahl):**

| Kategorie | Kappa | Interpretation |
|-----------|-------|----------------|
| Feministisch | +0,075 | Beste: explizite Fachterminologie |
| KI_Sonstige | +0,048 | Gut |
| Fairness | -0,163 | Schlechteste: LLM ueberdehnt Breitbegriff |
| Gender | -0,098 | LLM missiert implizite Perspektiven |
| Bias_Ungleichheit | -0,097 | Trugbild: beide klassifizieren hoch, verschiedene Papers |

**Interpretation (Jagged Frontier):** κ = 0,035 ist kein Messfehler. Das LLM ist bei "Fairness" uebermenschlich (73 % Ja, Human 52 %) und bei "Gender" untermenschlich (36 % Ja, Human 63 %). Die Grenzlinie der LLM-Kompetenz ist nicht intuitiv vorhersagbar -- das ist das Jagged-Frontier-Phaenomen (Mollick).

---

## Assessment-Schema (10K)

**Inklusions-Logik:** TECHNIK (mind. 1) UND SOZIAL (mind. 1) = Include.

**Technik (4 binaere Kategorien):** AI_Literacies, Generative_KI, Prompting, KI_Sonstige

**Sozial (6 binaere Kategorien):** Soziale_Arbeit, Bias_Ungleichheit, Gender, Diversitaet, Feministisch, Fairness

**Sycophancy-Mitigation:** Negative Constraints im Prompt ("Bei Unsicherheit: Nein"), Prompt-Versionierung (v2.1), Prompt-Governance.

---

## Epistemische Infrastruktur: Vier Ebenen

| Ebene | Massnahme | Artefakt |
|-------|-----------|----------|
| Workflow | Dualer Bewertungspfad (LLM + Human parallel) | benchmark/data/, benchmark/results/ |
| Research Integrity | 3-Stage SKE (LLM -> deterministisch -> Verifikation), Prompt-Versionierung | pipeline/knowledge/, prompts/ |
| Institutionell | Keine KI-Richtlinien an vielen Einrichtungen: individuelle Infrastruktur notwendig | CLAUDE.md, Dokumentation |
| Community | Neue Transparenzstandards fuer LLM-gestuetzte Peer-Review-Workflows | Oeffentliches Repository |

**3-Stage SKE (Structured Knowledge Extraction):**
- Stufe 1: LLM extrahiert JSON aus Volltext (probabilistisch)
- Stufe 2: Template-Rendering ohne LLM (deterministisch, kein Konfabulationsrisiko)
- Stufe 3: LLM verifiziert gegen Original (Completeness 40% + Correctness 40% + Category Validation 20%)
- Ergebnis: 242/249 (97,2 %) Confidence >= 75

**Konfabulation (nicht Halluzination):** Erzeugung kohaerenter, aber faktuell ungesicherter Aussagen ohne interne Wahrheitspruefung. Der Begriff ist praeziser: Konfabulierte Outputs sind gerade dann ueberzeugend, wenn sie falsch sind (erhoehte Narrativitaet).

---

## Paper-Stand

**Datei:** `knowledge/paper/paper-draft.md` (Single Source of Truth)

**Version:** v0.4 -- 17.975 Zeichen (Limit: 18.000, Differenz: +25)

**Titel:** "Epistemische Asymmetrien in Deep-Research-gestuetzten Literature Reviews"

| Abschnitt | Zeichen | Status |
|-----------|---------|--------|
| 1. Einleitung | 2.284 | Fertig |
| 2. Epistemische Asymmetrie | 3.014 | Fertig (inkl. Jagged Frontier) |
| 3. Epistemische Infrastruktur | 3.126 | Fertig |
| 4. Methodik | 3.091 | Fertig |
| 5. Ergebnisse | 3.445 | Fertig (inkl. qualitative Beispiele) |
| 6. Diskussion | 1.927 | Fertig |
| 7. Fazit | 1.088 | Fertig |

**Offene Punkte:**
- Review-Runde mit Co-Autor:innen (Susi, Sabine, Christian Steiner)
- Eventuell: Human-Human Inter-Rater-Reliabilitaet ergaenzen (wenn Susi+Sabine beide dieselben Papers bewertet haben)
- Einreichung 4. Mai 2026

---

## SPA (GitHub Pages)

**URL (nach Aktivierung):** https://chpollin.github.io/FemPrompt_SozArb/

**Stack:** Chart.js 4.4, vis-network 9.1.6, Fuse.js 7.0, kein Build-Step

**Tabs:** Papers Browser | Benchmark | Dashboard | Graph

**Benchmark-Tab Visualisierungen:**
- Kategorie-Divergenz (Slope Chart): Human-Rate (links) vs. LLM-Rate (rechts) je Kategorie, steile Linien = grosse epistemische Divergenz
- Erkenntnisfluss (Overlap-Treemap): 4 Zellen proportional, klickbar -> Papers-Tab-Filter
- Divergenz-Profil (Kappa-Chart): horizontal bar, Farbe nach Divergenzrichtung
- Divergenz-Faelle (Tabelle): 102 Disagreements, nach Severity sortiert

**Dashboard-Tab Visualisierungen:**
- Korpus-Abdeckung (stacked bar): LLM 326 vs. Human 210 bewertet
- Kategorie-Divergenz (Scatter): X=Human-Ja-Rate, Y=LLM-Ja-Rate, Diagonale=Konsens
- Kategorie-Verteilung LLM / Human
- Publikationen nach Jahr
- LLM Konfidenz-Verteilung

**Aktivierung (manuell):** Settings -> Pages -> Source: docs/, Branch: main

---

## Pipeline-Kosten (Gesamt)

| Operation | Kosten |
|-----------|--------|
| PDF-Akquise / Konversion | $0 |
| Knowledge Distillation (249 Papers, SKE) | ~$7,00 |
| 5D LLM-Assessment (325 Papers) | $1,15 |
| 10K LLM-Assessment (326 Papers) | $1,44 |
| Sonstige API-Calls | ~$0,58 |
| **Gesamt** | **~$10,17** |

Modell: Claude Haiku 4.5 ($1.00/MTok Input, $5.00/MTok Output, Stand Feb 2026)

---

## Wichtige Dateipfade

| Was | Pfad |
|-----|------|
| Paper (Single Source of Truth) | `knowledge/paper/paper-draft.md` |
| Projektplan | `knowledge/paper/Forum Wissenschaft Paper - Arbeitsplan.md` |
| Status + Meilensteine | `knowledge/status.md` |
| Methodik-Dokumentation | `knowledge/methodology.md` |
| Technische Doku | `knowledge/technical.md` |
| Epistemische Infrastruktur | `knowledge/epistemic-framework.md` |
| Paper vs. Repo Abgleich | `knowledge/paper-integrity.md` |
| Assessment-Schema | `benchmark/config/categories.yaml` |
| LLM Assessment-Ergebnis | `benchmark/data/llm_assessment_10k.csv` |
| Benchmark-Ergebnisse | `benchmark/results/agreement_metrics.json` |
| Knowledge Docs | `pipeline/knowledge/distilled/` (249 Dateien) |
| SPA-Daten | `docs/data/research_vault_v2.json` |

---

## Bekannte Grenzen

- Overlap-Analyse nur fuer 34 Papers (Stichprobe, keine Gesamtanalyse moeglich)
- PDF-Rate 79 % (69 Papers primaer Paywall-gesperrt)
- Human Assessment: 116 Papers ohne Entscheidung (kein Blocker fuer Paper, nur fuer finalen Benchmark)
- Deep-Research-Prompt: Template rekonstruiert, instanziierter Prompt nicht persistent gespeichert
- Proprietaere Systeme: keine vollstaendige Reproduzierbarkeit moeglich

---

## Referenz-Literatur (Paper)

| Quelle | Befund | Verwendung |
|--------|--------|------------|
| Woelfle et al. (2024), J Clin Epidemiol | Human IRR κ = 0,29-0,84 (komplexitaetsabhaengig) | Design + Erwartungshorizont |
| Hanegraaf et al. (2024), BMJ Open | Human IRR in SLRs κ = 0,77-0,88 | Benchmark-Werte |
| Sandner et al. (2025), OSSYM | LLM weicht nicht staerker ab als Mensch von Mensch | Hypothese |
| Malmqvist (2024), arXiv | Sycophancy: bis zu 40 % Fehlereinbringung | Sycophancy-Mitigation |
| Shanahan (2024), Minds and Machines | Exotic Mind-Like Entities | Theoretischer Rahmen |
| Hauswald (2025) | Epistemische Deferenz, justifikatorische Esoterik | Epistemische Theorie |
| Mollick (2023/2024) | Jagged Frontier | Interpretationsrahmen Benchmark |
| Chatterji et al. (2025), NBER | 700 Mio. ChatGPT-Nutzer, 42 % Schreibaufgaben | Einleitung |

---

*Aktualisiert: 2026-02-18*
