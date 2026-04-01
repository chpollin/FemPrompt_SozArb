# Arbeitsjournal

Chronologisches Protokoll der Arbeitssitzungen mit Entscheidungen, Ergebnissen und Learnings.

---

## 2026-03-27 (Session 9): Human Assessment abgeschlossen, Merge-Bug behoben

**Branch:** `main`

### Was passiert ist

1. **Human Assessment abgeschlossen:** Google Spreadsheet importiert (304 Zeilen). 27 Korrekturen/Ergaenzungen angewendet: 5 Christopher-Papers reviewed (Chisca, Garg, Gohar, Hayati, He), 16 Unclear aufgeloest (13 Include, 3 Exclude), 4 leere Decisions ergaenzt, 1 Fehlerkorrektur (Kaneko war faelschlich Exclude), 1 Kategorie-Update (Gohar: Feministisch Nein->Ja wg. Crenshaw). 1 defekte Zeile entfernt. Ergebnis: 303 Papers, 142 Include, 161 Exclude, 0 Unclear.

2. **Kritischen Merge-Bug entdeckt und behoben:** `merge_assessments.py` matchte Human- und LLM-Assessment per sequentieller ID statt Zotero_Key. Die beiden CSVs haben komplett unterschiedliche ID-Reihenfolgen (301 von 304 IDs zeigten auf verschiedene Papers). Alle bisherigen Benchmark-Ergebnisse (Kappa 0,035, Konfusionsmatrix 65/23/78/34, 111 Divergenzen) basierten auf falschen Paarungen. Fix: Zeile 65 in merge_assessments.py auf Zotero_Key umgestellt.

3. **Benchmark komplett neu berechnet:** 291 Papers mit beiden Assessments (korrekt per Zotero_Key gepaart). Konfusionsmatrix: 100/34/108/49. Kappa: 0,056. Kategorie-Kappas jetzt alle 0,39--0,82 (vorher teils negativ -- das war Rauschen). 142 Disagreements (108 LLM-Inc/Human-Exc, 34 umgekehrt).

4. **Divergenz-Klassifikation mit Sonnet 4.6:** Alten Divergenz-Cache invalidiert (.vault_cache/divergences/). 142 Faelle neu klassifiziert mit Claude Sonnet 4.6 (statt Haiku 4.5). Ergebnis: Semantische Expansion 51% (73), Implizite Feldzugehoerigkeit 30% (42), Keyword-Inklusion 19% (27). Sonnet differenziert deutlich staerker als Haiku -- weniger pauschale "Semantische Expansion", mehr Erkennung von implizitem Feldwissen.

5. **JSON-Daten regeneriert:** research_vault_v2.json und promptotyping_v2.json mit korrekten Metriken und Divergenz-Mustern neu generiert. Alle Wissensdokumente (methods-and-pipeline, paper-integrity, project, quickstart) aktualisiert.

### Was wir gelernt haben

**Merge-Key ist kritisch:** Ein Merge per sequentieller ID statt stabiler Identifier (Zotero_Key) produziert plausibel aussehende aber voellig falsche Ergebnisse. Die alten Zahlen (78:23 Ratio, Kappa 0,035) sahen inhaltlich sinnvoll aus, weil die Marginalverteilungen (Basisraten) korrekt blieben -- nur die Zellwerte der Konfusionsmatrix waren Zufall.

**Kategorie-Kappas als Validierungsindikator:** Die alten Kategorie-Kappas waren teils negativ (Gender -0,098, Fairness -0,163). Negative Kappas bei binaeren Kategorien sind ein Warnsignal fuer fehlerhaftes Matching. Die korrekten Werte (0,39--0,82) zeigen echte Uebereinstimmungssignale.

**Sonnet 4.6 vs Haiku 4.5 bei Klassifikation:** Sonnet produziert differenziertere Divergenz-Klassifikationen. Haiku hatte 81% als "Semantische Expansion" eingestuft (Catch-all). Sonnet verteilt 51/30/19 -- die Muster sind ausgeglichener und die Begruendungen inhaltlich praeziser.

### Was entstanden ist

| Datei | Aenderung |
|-------|-----------|
| `benchmark/scripts/merge_assessments.py` | Bug-Fix: Zotero_Key statt sequentielle ID |
| `benchmark/data/human_assessment.csv` | Neu: 303 Zeilen, 27 Korrekturen, komplett |
| `benchmark/data/merged_comparison.csv` | Neu: 291 korrekt gepaarte Papers |
| `benchmark/results/agreement_metrics.json` | Neu: korrekte Metriken |
| `benchmark/results/disagreements.csv` | Neu: 142 korrekt gepaarte Disagreements |
| `docs/data/research_vault_v2.json` | Regeneriert mit korrekten Metriken |
| `docs/data/promptotyping_v2.json` | Regeneriert mit Sonnet-4.6-Divergenzmustern |
| `scripts/generate_vault_v2.py` | Modell fuer Divergenz-Klassifikation: Sonnet 4.6 |
| `knowledge/status.md` | Benchmark-Ergebnisse aktualisiert |
| `knowledge/methods-and-pipeline.md` | Script-Referenzen + Metriken aktualisiert |
| `knowledge/paper-integrity.md` | Merge-Bug + neue Werte dokumentiert |
| `knowledge/project.md` | Benchmark-Basis aktualisiert |
| `knowledge/guides/quickstart.md` | Benchmark-Zahlen aktualisiert |
| `CLAUDE.md` | HA-Status, Leitkonzepte, Known Issues aktualisiert |

### Offene Punkte

- [ ] Vault-Notes regenerieren (142 Divergenz-Notes mit neuen Mustern) + Vault-ZIP
- [ ] Evidence Companion: Stats im Header pruefen (326 Papers, 249 WD, 291 Bewertungen)
- [ ] Paper-Zahlen aktualisieren (Konfusionsmatrix, Raten, Divergenz-Muster)
- [ ] M8: Paper finalisieren (Deadline 4. Mai)

---

## 2026-03-24 (Session 8): Kategorien-Explorer, Wissensnetz-Redesign, Methoden-Seite

**Branch:** `main`

### Was passiert ist

1. **Bewertungsvergleich ersetzt durch Kategorien-Explorer:** Der statische Dashboard-View (Callout, Slope Chart, Kappa) wurde durch einen interaktiven Kategorien-Explorer ersetzt. 10 Kategorien als Spektrum (Gegenstand bis Perspektive), Klick auf eine Kategorie zeigt: Rate-Vergleich (Human vs LLM), konkrete Divergenz-Papers mit LLM-Reasoning, haeufige Konzepte. Cross-View-Navigation zu Korpus und Wissensnetz.

2. **Wissensnetz-Redesign:** Cluster-separierendes Layout (Technik links, Sozial rechts, Bruecke oben). Divergenz-Modus-Toggle (hebt Divergenz-Konzepte hervor, faerbt nach dominantem Muster). Hover-Glow-Effekt (SVG feGaussianBlur Filter). Always-visible Detail-Sidebar mit Placeholder. Kompakte Toolbar (Suche + Legende + Buttons). Full-width Layout (bricht aus main max-width aus).

3. **Divergenz-Daten-Anreicherung:** `promptotyping_v2.json` wird geladen. 111 Divergenzen werden per Title-Matching auf Paper-Objekte gemappt (pattern, justification, category_comparison, llm_reasoning). Neue EC API: getDivergencePatterns(), getDivergences(), getCategoryDivergences().

4. **Stats-Bar in Header:** Die separate Stats-Zeile (326 Papers, 249 WD, 210 Bewertungen, 10 Kategorien) wurde als kompakte Zeile in den Header integriert.

5. **Methoden-Unterseite (methoden.html):** Neue statische Seite mit Pipeline-Visualisierung, Kategorie-System-Tabelle, Bewertungsmethodik, Kernergebnissen, Kosten, Limitationen.

6. **Navigation vereinheitlicht:** Alle Seiten (index, about, methoden, help) haben identische Navigation: Chat | Wissensnetz | Kategorien | Korpus | About | Methoden | Hilfe. Hash-basierte Navigation von Unterseiten zurueck zu Views. "Fragen Sie das Wissen" durch "Recherche im Forschungskorpus" ersetzt.

### Was wir gelernt haben

**Kein Dashboard, sondern Exploration:** Der Bewertungsvergleich war ein Bericht -- man scrollt und schaut. Der Kategorien-Explorer ist ein Werkzeug -- man waehlt eine Dimension und sieht die konkrete Evidenz. Das ist der Unterschied zwischen "Zeigen was ist" und "Explorierbar machen".

**Force Layout + Cluster:** Cluster-separierendes Layout funktioniert nur, wenn die Cluster-Force dominant ist (0.4) und die Link-Force schwach (0.06). Sonst zieht die Link-Force alles in einen Blob zurueck.

**Fehlende Dimension:** 27 ungenutzte Datenfelder identifiziert. Kein fuenfter View noetig -- stattdessen Knowledge-Sections und Verification-Scores in bestehende Views integrieren.

### Was entstanden ist

| Datei | Aenderung |
|-------|-----------|
| `docs/js/kategorien.js` | Neu: Kategorien-Explorer IIFE (~300 Zeilen) |
| `docs/js/wissensnetz.js` | Komplett neu: Cluster-Layout, Divergenz-Modus, Glow, Sidebar |
| `docs/js/research-app.js` | Divergenz-Daten laden, EC API, Modal-Tabs, Markdown-Export (~1100 Zeilen) |
| `docs/js/kategorien.js` | Neu: Kategorien-Explorer IIFE (~300 Zeilen) |
| `docs/js/wissensnetz.js` | Komplett neu: Cluster-Layout, Divergenz-Modus, Glow, Sidebar |
| `docs/js/wissenschat.js` | Heading geaendert |
| `docs/js/features.js` | Entfernt (war nur noch No-Op Stubs) |
| `docs/index.html` | Kategorien-Explorer, Wissensnetz Toolbar, Stats in Header, Modal-Tabs |
| `docs/methoden.html` | Neu: Pipeline-Viz, Kategorie-Tabelle, Nachnutzungsanleitungen |
| `docs/about.html` | Nav aktualisiert |
| `docs/help.html` | Nav + Inhalt aktualisiert (Kategorien statt Bewertungsvergleich) |
| `docs/css/research.css` | Refactored: -700 Zeilen toten Code, Kategorien + Wissensnetz + Detail-Tabs |
| `scripts/generate_promptotyping_data_v2.py` | Cluster-Schwelle 0.55, leere Human-Werte als null |
| `docs/data/*.json` | Regeneriert mit neuen Clustern (7/20/109) |

### Offene Punkte

- [ ] M8: Paper finalisieren (Deadline 4. Mai)

---

## 2026-03-24 (Session 6): Wissens-Chat + Panel-Optimierung + Quellenleiste

**Branch:** `FemPrompt_SozArb_promptotyping-interface`

### Was passiert ist

1. **Panel-Optimierung:** Side Panel von 680px auf `min(480px, 45vw)` verkleinert. Bei offenem Panel werden Tabellenspalten (Jahr, Status, Kategorien) ausgeblendet, Overlay transparent, Tabelle bleibt klickbar. Aktive Zeile wird hervorgehoben. Kein Scroll-Lock mehr.

2. **Vault-Download aufgewertet:** "Vault (.zip)" umbenannt zu "Wissensdokumente (.zip)" mit Tooltip und Erklaertext ("505 Markdown-Dateien -- nutzbar in Obsidian oder als LLM-Kontext").

3. **Wissens-Chat (neuer 4. Tab):** Gemini 2.5 Flash-basierter Q&A-Chat ueber den Forschungskorpus. RAG-lite: Keyword-Suche ueber 326 Papers + 136 Konzepte, Top 30 als Kontext. SSE-Streaming. API-Key lokal im Browser (localStorage). 3 Vorschlagsfragen als Einstieg.

4. **Quellenleiste mit Cross-View-Navigation:** Nach jeder Chat-Antwort erscheint eine klickbare Quellenleiste. Papers werden per Autoren-/Titel-Matching als "zitiert" erkannt. Klick navigiert zum Korpus-Tab und oeffnet das Detail-Panel -- der epistemische Kreislauf: Chat-Antwort → Quelle → LLM-Begruendung pruefen → zurueck.

5. **Bug-Fix:** Quellenleisten bleiben bei Re-Render erhalten (complete-Flag + Event Delegation statt direkter Listener).

### Was wir gelernt haben

**Side Panel vs. Accordion:** Side Panel ist das richtige Pattern fuer Explorations-Tools (vs. Accordion fuer Archive). Das Problem war nicht das Panel, sondern der Informationsverlust in der komprimierten Tabelle. Loesung: gezielte Spaltenreduktion statt pauschaler Komprimierung.

**Chat als epistemisches Interface:** Ein Chat ueber die Wissensbasis wird erst dann sinnvoll, wenn die Antworten verifizierbar sind. Die Quellenleiste mit Navigation zum Korpus-Tab macht den Chatbot zu einem verifizierbaren epistemischen Werkzeug statt einer Black Box.

**RAG-lite reicht:** Fuer 326 Papers braucht man kein Embedding-basiertes Retrieval. Einfaches Keyword-Matching + Padding mit Divergenz-Faellen liefert guten Kontext. Gemini 2.5 Flash mit 1M Kontext koennte sogar alles auf einmal verarbeiten.

### Was entstanden ist

| Datei | Aenderung |
|-------|-----------|
| `docs/js/wissenschat.js` | Neu: ~560 Zeilen, Chat + Streaming + Quellenleiste + Navigation |
| `docs/js/research-app.js` | Panel-Logik, EC.getConceptData(), Chat-Lazy-Init, highlightActiveRow() |
| `docs/css/research.css` | Panel-Optimierung, Chat-Styles, Quellenleiste (~300 Zeilen neu) |
| `docs/index.html` | 4. Tab, Vault-Link, config.local.js Einbindung |
| `.env` | Gemini API Key (gitignored) |
| `docs/js/config.local.js` | Browser-Bridge fuer API Key (gitignored) |

---

## 2026-03-24 (Session 6b-7): UI Polish, Navigation, Tooltips, Merge

**Branch:** `FemPrompt_SozArb_promptotyping-interface` → gemerged zu `main`

### Was passiert ist

1. **Inline-Zitationen:** Gemini-Antworten werden post-processed -- Autor (Jahr) Muster werden erkannt und als klickbare Links zum Korpus-Tab gerendert. Referenzliste unter jeder Antwort zeigt nur tatsaechlich zitierte Papers.

2. **Chat-Redesign:** Chat als eigenstaendiges Fenster (weiss, Border, Shadow). Subtiler Primary-Akzent oben statt doppeltem Regenbogen. API-Key-Bar kompakt. User-Bubble dunkelgrau statt teal.

3. **Tab-Reihenfolge:** Wissens-Chat (Default) > Wissensnetz > Bewertungsvergleich > Korpus (Referenzschicht). Chat wird sofort initialisiert.

4. **Header-Navigation:** Dropdown durch direkte View-Buttons ersetzt. About/Hilfe als echte Unterseiten (`about.html`, `help.html`) statt Modals. `switchView()` als globale Funktion.

5. **Rich Data Tooltips:** JS-basierte Tooltips mit echten Daten aus dem JSON: Jahresverteilung (Barcharts), Pipeline-Verlust (Step-Chain), Include/Exclude/Divergenz (Stat-Grid), Kategorie-Haeufigkeit (farbige Balken), Top-Konzepte.

6. **Bewertungsvergleich:** Callout-Box "78 vs. 23" fuer Kernergebnis. Slope-Label-Overlap gefixt.

7. **Wissensnetz:** Legende (Technik/Sozial/Bruecke + Divergenz-Ring).

8. **Merge zu main** und GitHub Pages Deployment.

### Was wir gelernt haben

**Verifiable Chat > Black-Box Chat:** Der Wissens-Chat wird erst wertvoll, wenn jede Aussage verifizierbar ist. Inline-Zitationen + Cross-View-Navigation zum Korpus schliessen den epistemischen Kreislauf.

**Tooltips als Datenschicht:** Statt Beschreibungstext zeigen die Tooltips echte Statistiken (Barcharts, Pipeline-Viz). Das macht die Stats-Bar zu einer interaktiven Datenebene statt nur einer Zahlenleiste.

**Navigation flach halten:** Dropdown war ein Schritt zu viel. Direkte Buttons sind besser fuer 4 Views -- man sieht sofort alle Optionen.

### Offene Punkte

- [ ] M13: Wissenstaxonomie (Wissensnetz-Redesign: Hierarchie, Quell-Definitionen, Kategoriefarben)
- [ ] M8: Paper finalisieren (Abb. 3 abgleichen, Deadline 4. Mai)
- [ ] Bewertungsvergleich: Dashboard-Charakter weiter reduzieren

---

## 2026-03-19 (Session 5): Evidence Companion -- Richtungswechsel

**Branch:** `FemPrompt_SozArb_promptotyping-interface`
**Commits:** `1d54c46`, `895d791`, `a7703e4`

### Was passiert ist

1. **Gesamtanalyse:** Paper-Text vs. Repository vs. Web-Frontend abgeglichen. Identifiziert: Das Paper referenziert eine "publizierte Wissensumgebung" (Abb. 3) -- das ist das Research Dashboard, nicht Promptotyping.

2. **Richtungswechsel:** Promptotyping-Interface wird nicht weiterentwickelt. Entscheidung: Ein einziges Frontend als akademische Begleitpublikation ("Evidence Companion").

3. **Komplettes Redesign von `docs/index.html`:**
   - Name: "Feministische AI Literacies -- Systematischer Review"
   - IBM Plex Serif fuer Headings (akademische Seriositaet)
   - Weisser Header, Spektrum-Farbsystem (10 Kategorien als Regenbogen)
   - Tabelle statt Cards (sortierbar, 50/Seite, Pagination)
   - Seitenpanel statt Modal (slide-in)
   - Tabs entfernt, dann als 2-Tab-Navigation wiederhergestellt (Korpus / Bewertungsvergleich)

4. **LLM-Confidence entfernt:** War Selbsteinschaetzung des LLMs, keine valide Metrik. Komplett raus aus Interface, Daten, Generator.

5. **Datengenerator erweitert:** 300 Papers (249 full + 51 thin), DOI/URL/Abstract, Knowledge-Sektionen, Kategorie-Raten, deterministische Picks.

6. **Farbsystem redesigned:** 10 Kategorien als genderneutrales Spektrum (Salbeigruen -> Teal -> Stahlblau -> Lila -> Altrosa -> Terrakotta -> Bernstein -> Olivgold -> Pflaume -> Moosgruen). Gruppierung als "Gegenstand" (KI-Dimension) und "Perspektive" (Gesellschaftliche Dimension) statt "Technik/Sozial".

### Was wir gelernt haben

**Promptotyping vs. Evidence Companion:**
- Promptotyping ging ueber das Paper-Versprechen hinaus. Das Paper beschreibt eine Wissensumgebung zum Explorieren, Vergleichen, Identifizieren, Nachvollziehen. Das ist ein Evidence Browser, kein Pipeline-Explorer.
- **Learning:** Das Interface muss das einloesen, was das Paper verspricht -- nicht mehr. Zusaetzliche Features (Pipeline-Sankey, Konzept-Force-Graph) sind interessant, aber nicht das, was Reviewer:innen oder Kolleg:innen brauchen.

**Design-Professionalitaet:**
- Das alte Dashboard wirkte wie ein Tech-Startup (dunkler Header, KPI-Tiles, bunte Zahlen). Akademische Interfaces brauchen: Serif-Headings, Whitespace, zurueckhaltende Farben, Journal-Style Tabellen.
- **Learning:** Inspirationsquellen: Our World in Data (Klarheit), Distill.pub (Artikel als Interface), eLife (Progressive Enhancement). Nicht: SaaS-Dashboards, Admin-Panels.

**LLM-Confidence ist keine Metrik:**
- Der Wert 0.95 suggeriert Praezision, die nicht gegeben ist. Es ist eine Selbsteinschaetzung des LLMs, kein unabhaengiges Qualitaetsmass. Muss raus.
- **Learning:** Jede Zahl im Interface muss pruefbar sein. Pseudoquantitative Werte (LLM-Confidence, Sycophancy-Scores) sind irrefuehrend.

**Farbcodierung und Gender:**
- Blau (Technik) / Warm (Sozial) reproduziert Gender-Stereotypen -- inakzeptabel fuer ein feministisches Forschungsprojekt.
- **Learning:** Farbsysteme sind politisch. Ein Regenbogen-Spektrum ohne hierarchische Zuordnung ist die bessere Wahl.

**"Gegenstand" und "Perspektive" statt "Technik" und "Sozial":**
- Die interne Operationalisierung (TECHNIK_OK AND SOZIAL_OK) muss nicht die UI-Sprache sein. "Gegenstand" (was wird untersucht?) und "Perspektive" (aus welchem Blickwinkel?) ist praeziser und fachlicher.

### Was entstanden ist

| Datei | Aenderung |
|-------|-----------|
| `docs/index.html` | Komplett neu: Header, Intro, 2 Tabs, Tabelle, Detail-Panel, Footer |
| `docs/css/research.css` | Redesign: Typographie, Farben, Layout (~1400 Zeilen) |
| `docs/js/research-app.js` | Rewrite: Tabelle, Sortierung, Detail-Panel, Confidence entfernt (~600 Zeilen) |
| `docs/js/features.js` | filterByQuadrant angepasst |
| `scripts/generate_promptotyping_data_v2.py` | +200 Zeilen: thin papers, DOI/URL, KD-Sektionen, Kategorie-Raten |
| `docs/data/promptotyping_v2.json` | Regeneriert: 300 Papers, 1.7 MB |

### Offene Punkte

- [ ] Wissensnetz-View (Konzept-Graph, Tab 3)
- [ ] Bewertungsvergleich-Tab (Konfusionsmatrix, Slope Chart)
- [ ] Promptotyping-Dateien physisch entfernen (werden nicht mehr geladen, aber existieren noch)
- [ ] CLAUDE.md aktualisieren
- [ ] Merge zu main nach Fertigstellung
- [ ] Paper: Abb. 3 und Fazit-Beschreibung mit tatsaechlichem Interface abgleichen

---

## 2026-02-22 (Session 4): Promptotyping v2.1 -- Epistemische Tiefe

**Branch:** `FemPrompt_SozArb_promptotyping-interface`
**Dauer:** ~3h (2 Claude-Sessions, davon 1 Context-Kompression)

### Was passiert ist

1. **Kritische Evaluation von v2** -- 4 Screenshots im Browser betrachtet. Erkenntnis: Das Interface ist ein Daten-Explorer, kein epistemisches Werkzeug. 5 Probleme identifiziert: Haltungen nur dekorativ, Paper Journey startet leer, Konzept-Graph monochrom, Divergenzen zeigen Karten statt Geschichten, kein roter Faden.

2. **Plan geschrieben und genehmigt** -- 4-Phasen-Plan (Datengenerator, HTML, JS, CSS) mit detaillierten Code-Snippets. Ziel: Interface soll die Frage beantworten "Was passiert mit Wissen, wenn es durch eine LLM-Pipeline fliesst?" -- nicht durch Zahlen, sondern durch navigierbare Erfahrung.

3. **Phase A: Datengenerator erweitert** -- 3 Featured Papers handverlesen (Ahmed_2024: Semantische Expansion, Shafie_2025: Keyword-Inklusion, Kaneko_2024: Uebereinstimmung). Konzept-Cluster berechnet (1 Technik, 55 Sozial, 80 Bridge). Pattern-Distribution + Asymmetrie-Daten in Meta.

4. **Phase B: HTML umgebaut** -- 5 Views statt 4 (Landing als Default). Stances-Legend kompakt. Container fuer Featured Papers in Journey + Concept Legend.

5. **Phase C: JS komplett neu geschrieben** (~1090 Zeilen) -- Landing View mit Kennzahlen + Featured Cards. Paper Journey mit Pre-Populated Picks + Stance-basierte Timeline. Concept Explorer mit Cluster-Farben + Divergenz-Ring. Divergenz-Navigator mit Narrative Cards + Exemplarische Faelle + Knowledge Summary in Detail. Alle Detail-Panels mit 3 Stance-Sektionen (Ergebnis/Prozess/Grenze).

6. **Phase D: CSS komplett neu geschrieben** (~650 Zeilen) -- Stance-Sektionen als Kern-Pattern (farbige linke Raender). Landing-Layout. Featured Cards mit Stance-Bars. Journey Picks als Pills. Narrative Divergenz-Cards mit Story-Bars. Konzept-Legende. Responsive Breakpoints.

### Was wir gelernt haben

**Epistemische Haltungen muessen strukturell sein, nicht dekorativ:**
- v2 hatte 3 farbige Punkte als Banner. Sah nett aus, tat nichts.
- v2.1 verwendet `.stance-section` Divs mit farbigen linken Raendern in JEDER Detail-Ansicht. Die Farbe IST die Information.
- **Learning:** Wenn ein UI-Element weggelassen werden kann ohne Funktionsverlust, ist es Dekoration. Epistemische Haltungen muessen die Informationsarchitektur bestimmen, nicht die Farbgebung.

**Konzept-Cluster spiegeln den Korpus:**
- Erwartet: ~30% Technik, ~40% Sozial, ~30% Bridge
- Tatsaechlich: 1 Technik (0.7%), 55 Sozial (40.4%), 80 Bridge (58.8%)
- Interpretation: Fast alle Konzepte im Korpus "AI Literacy + Soziale Arbeit" haben per Definition Verbindungen zu beiden Seiten. Nur 1 reines Technik-Konzept ueberlebt den 65%-Threshold.
- **Learning:** Die Cluster-Verteilung ist ein Ergebnis, kein Problem. Sie zeigt, dass der Korpus tatsaechlich interdisziplinaer ist.

**Featured Papers als narrativer Anker:**
- Statt leerer Views: 3 handverlesene Papers repraesentieren je ein Divergenz-Muster.
- Der User sieht sofort "Hier ist ein konkretes Beispiel" statt "Bitte suche etwas".
- **Learning:** Narrative brauchen Protagonisten. Zahlen und Suchfelder reichen nicht.

### Was entstanden ist (Aenderungen an bestehenden Dateien)

| Datei | Aenderung |
|-------|-----------|
| `scripts/generate_promptotyping_data_v2.py` | +Featured Papers, +Cluster, +Pattern-Distribution (~+80 Zeilen) |
| `docs/promptotyping.html` | +Landing View, +Stances Legend, +5 Views statt 4 (~+40 Zeilen) |
| `docs/js/promptotyping-app.js` | Komplett-Rewrite (~1090 Zeilen, vorher 778) |
| `docs/css/promptotyping.css` | Komplett-Rewrite (~650 Zeilen, vorher 653) |
| `docs/data/promptotyping_v2.json` | Regeneriert mit neuen Feldern |

### Offene Punkte

- [ ] Browser-Test (lokal via HTTP-Server)
- [ ] Mobile-Ansicht pruefen (< 768px)
- [ ] Merge zu main nach Browser-Test

---

## 2026-02-22 (Session 3): Promptotyping v2 -- Vom Dashboard zum Forschungsartefakt

**Branch:** `FemPrompt_SozArb_promptotyping-interface`
**Commits:** `bb147c0` (v1), `3476437` (v2)
**Dauer:** ~6h (3 Claude-Sessions)
**LLM-Kosten:** ~$1 (249 Konzept-Extraktionen + 111 Divergenz-Klassifikationen, Haiku 4.5)

### Was passiert ist

1. **Promptotyping v1 gebaut und verworfen** -- Erstes Interface war ein 5-Schritte-Dashboard, das den Forschungsprozess *beschreibt* (Trichter, Prozess-Diagramme, Statistiken). Problem erkannt: Ein Dashboard zeigt Zahlen, kein Wissen. Committed als `bb147c0`, sofort als Ausgangspunkt fuer v2 verwendet.

2. **Konzeptdokument geschrieben** -- `knowledge/FORSCHUNGSPROJEKT-PROMPTOTYPING.md` definiert Promptotyping als epistemische Praxis: "Der Forschungsprozess wird zum Forschungsgegenstand." Drei Haltungen operationalisiert: Zeigen was ist / Zeigen wie / Zeigen was nicht geht.

3. **3-Phasen-Plan erstellt und umgesetzt:**
   - Phase 1: Vault v2 (`scripts/generate_vault_v2.py`, ~1660 Zeilen) -- LLM-basierte Konzept-Extraktion (249 Papers -> 136 konsolidierte Konzepte), Divergenz-Klassifikation (111 Faelle in 3 Muster), 5-Strategie-Titel-Matching (237/249 vs. vorher 226/249)
   - Phase 2: Datengenerator (`scripts/generate_promptotyping_data_v2.py`, ~500 Zeilen) -- Reine Datentransformation, kein LLM
   - Phase 3: Web-Interface (HTML + CSS + JS Neubau) -- 4 Views statt 5 Steps: Pipeline-Sankey, Paper Journey, Konzept-Explorer (Force Graph), Divergenz-Navigator

### Was wir gelernt haben

**Titel-Matching ist ein unterschaetztes Problem:**
- `simplify_title()` in v1 war naiv (50-Char-Truncation + 20-Char-Prefix). Verlor 23/249 Papers.
- 5-Strategie-Kaskade (Stage1-JSON-Titel, KD-YAML-Titel, Filename-Prefix, Autor+Jahr, Fuzzy) bringt 237/249.
- Die letzten 12 sind echte Datenqualitaetsprobleme: falsche Titel in Knowledge-Docs (LLM-Halluzination bei Extraktion), nicht-standardisierte Autorennamen (D'Ignazio, Arias_Lopez), Organisationsautoren (Statistics, Women, Alliance).
- **Learning:** Matching braucht mehrere unabhaengige Signale. Ein einzelnes Signal (egal wie clever) scheitert an der Vielfalt realer Daten.

**Windows MAX_PATH ist ein reales Problem:**
- Zotero-Titel koennen sehr lang sein. `safe_filename(title)` + Zotero-Key-Suffix sprengt 260 Zeichen.
- Fix: Titel auf 100 Zeichen kuerzen vor Suffix-Anhaengung.
- 27 Filename-Kollisionen bei 249 Papers (verschiedene Papers mit aehnlichen Titeln).
- **Learning:** Dateinamen aus externen Quellen immer defensiv behandeln. Laenge begrenzen, Kollisionen explizit pruefen.

**D3-Sankey-Links sind keine Linien:**
- `d3.sankeyLinkHorizontal()` erzeugt einen Path, der mit `stroke-width` gerendert wird (nicht `fill`).
- Orphan-Nodes (ohne Links) koennen D3-Sankey crashen.
- **Learning:** D3-Dokumentation genau lesen. Die meisten "mein Sankey rendert nicht"-Probleme sind fill/stroke-Verwechslungen.

**Divergenz-Muster-Verteilung ueberrascht:**
- Erwartet: ~50% Keyword, ~30% Semantisch, ~20% Implizit
- Tatsaechlich: 81% Semantische Expansion, 11% Keyword-Inklusion, 8% Implizite Feldzugehoerigkeit
- Interpretation: Der LLM expandiert Bedeutung viel staerker als erwartet. Er findet "Fairness" wo nur "Gerechtigkeit" steht, "Soziale Arbeit" wo nur "Community Services" steht. Das ist kein Bug -- es ist das Kernphaenomen der epistemischen Asymmetrie.
- **Learning:** Die drei Muster aus dem Paper sind empirisch bestaetigt, aber die Gewichtung ist anders als theoretisch vermutet. Das Paper sollte das reflektieren.

**IIFE-Pattern fuer Vanilla JS bleibt solide:**
- Kein Build-Tool, kein Framework, kein npm. Nur eine IIFE mit State-Management und View-Routing.
- 778 Zeilen fuer 4 Views mit D3-Sankey, D3-Force-Graph, Suche, Filter und Cross-View-Navigation.
- **Learning:** Fuer statische GitHub Pages ohne Backend ist Vanilla JS + IIFE nach wie vor die beste Wahl. Die Komplexitaet liegt in den Daten, nicht im Framework.

**Kappa-Prevalence-Bias bestaetigt sich auch in der Divergenz-Analyse:**
- 81% Semantische Expansion = LLM findet Relevanz, die Human nicht sieht.
- Konsistent mit LLM-Include-Rate 68% vs. Human 42%.
- Kappa 0.035 ist Symptom, nicht Diagnose. Die Diagnose ist: LLM und Human operieren auf verschiedenen epistemischen Ebenen.

### Was entstanden ist

| Artefakt | Pfad | Groesse |
|----------|------|---------|
| Vault v2 Generator | `scripts/generate_vault_v2.py` | ~1660 Zeilen |
| Datengenerator | `scripts/generate_promptotyping_data_v2.py` | ~500 Zeilen |
| Web-Interface HTML | `docs/promptotyping.html` | 172 Zeilen |
| Web-Interface CSS | `docs/css/promptotyping.css` | 653 Zeilen |
| Web-Interface JS | `docs/js/promptotyping-app.js` | 778 Zeilen |
| JSON-Daten | `docs/data/promptotyping_v2.json` | 1.0 MB |
| Vault: Paper Notes | `vault/Papers/` | 248 Dateien |
| Vault: Concept Notes | `vault/Concepts/` | 136 Dateien |
| Vault: Pipeline Notes | `vault/Pipeline/` | 5 Dateien |
| Vault: Divergenz Notes | `vault/Divergenzen/` | 111 Dateien |
| Vault: MOCs | `vault/MOCs/` + `MASTER_MOC.md` | 5 Dateien |
| Vault ZIP | `docs/downloads/vault.zip` | 1.1 MB |
| LLM-Cache | `.vault_cache/` | 360 JSON-Dateien |
| Konzeptdokument | `knowledge/FORSCHUNGSPROJEKT-PROMPTOTYPING.md` | 252 Zeilen |

### Offene Punkte

- [ ] Web-Interface im Browser testen (lokal via HTTP-Server fuer JSON-Fetch)
- [ ] Cross-View-Navigation verifizieren (Konzept-Klick -> Explorer, Paper-Klick -> Journey)
- [ ] Mobile-Ansicht pruefen (< 768px)
- [ ] Divergenz-Pattern-Matching in Paper-Journey verbessern (18/74 disagree-Papers ohne Pattern)
- [ ] Paper v0.5: Divergenz-Muster-Verteilung (81/11/8) einarbeiten
- [ ] Merge zu main nach Browser-Test

---

## 2026-02-22 (Session 2): Kappa-Revision und Workflow-Analyse

**Branch:** `main`
**Dokumentiert in:** `knowledge/paper-integrity.md` Abschnitt 3.6, `knowledge/status.md` M6-Interpretation

### Was passiert ist

- Comprehensive Workflow-Analyse des gesamten Forschungsprozesses
- Kappa-Revision: Cohen's Kappa 0.035 als Prevalence-Bias-Artefakt identifiziert (Byrt et al. 1993)
- Entscheidung: Primaere Metriken sind Konfusionsmatrix + Basisraten, Kappa bleibt als Vergleichsanker

### Was wir gelernt haben

- **Prevalence-Bias-Paradox:** Bei 26 Prozentpunkten Basisraten-Differenz (LLM 68% vs. Human 42% Include) kollabiert Kappa, unabhaengig von der Bewertungsqualitaet. Das ist kein Fehler im Benchmark, sondern eine bekannte Eigenschaft von Kappa (Byrt et al. 1993).
- **Kappa ist kein primaerer Indikator fuer Human-LLM-Vergleiche:** Die Referenzliteratur (Woelfle, Hanegraaf, Sandner) verwendet Kappa fuer Human-Human-Vergleiche, wo Basisraten aehnlich sind. Fuer Human-LLM-Vergleiche mit systematischer Basisraten-Divergenz ist Kappa irrefuehrend.

---

## 2026-02-21 (Session 1): Knowledge-Konsolidierung Phase 2

**Branch:** `main`
**Commit:** `471dca1`

### Was passiert ist

- 13 redundante Dateien aus `knowledge/` geloescht
- `epistemic-framework.md` in `project.md` gemergt
- `methodology.md` + `technical.md` in `methods-and-pipeline.md` gemergt
- Redundanzregeln etabliert (jede Information hat genau einen kanonischen Ort)

### Was wir gelernt haben

- **Redundanz in Dokumentation ist Gift:** Wenn dieselbe Information an 3 Stellen steht, divergieren die Stellen innerhalb von 2 Sessions. Redundanzregeln brauchen explizite Zuweisung ("Benchmark-Ergebnisse NUR in status.md").
- **MEMORY.md ist der Schluessel:** Die Auto-Memory-Datei in `.claude/projects/` ueberlebt Session-Wechsel. Redundanzregeln dort festhalten verhindert Regression.

---

## 2026-02-18 (Sessions): Paper v0.4, SPA-Rebuild, Visualisierungen

**Branch:** `main`
**Commits:** `5d8bd36` bis `45998df`

### Was passiert ist

- Research Vault SPA komplett neu gebaut (4-Tab-Layout: Papers, Benchmark, Dashboard, Graph)
- Observable Plot durch Chart.js ersetzt (Observable Plot crashte im Static-Hosting-Kontext)
- Visualisierungen epistemisch reframed: Divergenz-Scatter, Slope Chart, Overlap-Treemap, Coverage Map
- Paper v0.4 geschrieben: 17.975 Zeichen (Limit 18.000), alle Abschnitte ausformuliert
- `knowledge/` konsolidiert (M1 abgeschlossen)

### Was wir gelernt haben

- **Observable Plot ist fuer Static Hosting ungeeignet:** Braucht ESM-Imports, die auf `file://` und einfachen Hosts Probleme machen. Chart.js via CDN funktioniert ueberall.
- **Visualisierungen brauchen epistemische Funktion:** Ein Radar-Chart zeigt Daten. Ein Slope Chart zeigt *Divergenz* -- die Steigung ist die Aussage. Das ist der Unterschied zwischen "Daten darstellen" und "Wissen zeigen".
- **Confusion-Matrix-Bug:** `generate_docs_data.py` hatte eine fehlende Guard-Clause fuer Papers ohne Human-Assessment. Zeigte sich erst bei 326 Papers (vorher nur 210 getestet).

---

## Wiederkehrende Muster

### Was immer wieder hilft

1. **Mehrstrategie-Matching:** Nie auf ein einzelnes Signal verlassen (Titel, DOI, Autor). Immer Kaskade mit Fallbacks.
2. **LLM-Caching:** API-Ergebnisse sofort als JSON cachen. Erlaubt Vault-Regeneration ohne erneute API-Calls ($0 statt $1).
3. **Redundanzregeln:** Jede Information hat genau einen kanonischen Ort. Andere Stellen referenzieren, duplizieren nicht.
4. **Vanilla JS + CDN:** Fuer statische Seiten kein Build-Tool. D3 und Chart.js per CDN, IIFE-Pattern, fertig.
5. **TodoWrite konsequent nutzen:** Hilft nicht nur beim Tracking, sondern beim Denken. Aufgaben formulieren zwingt zur Klarheit.

### Was immer wieder schiefgeht

1. **Windows-Pfade:** `MAX_PATH`, `nul`-Datei (reservierter Geraetename), CP1252 statt UTF-8.
2. **Datenqualitaet in externen Quellen:** Zotero-Titel koennen HTML enthalten, Autorennamen sind nicht normalisiert, Jahreszahlen fehlen.
3. **Kappa-Interpretation:** Cohen's Kappa ist fuer symmetrische Vergleiche (Human-Human) entwickelt. Fuer asymmetrische Vergleiche (Human-LLM mit verschiedenen Basisraten) ist es irrefuehrend.

---

*Aktualisiert: 2026-02-22*
