# Arbeitsjournal

Chronologisches Protokoll der Arbeitssitzungen mit Entscheidungen, Ergebnissen und Learnings.

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
**Dokumentiert in:** `ANALYSIS_SESSION_2026-02-22.md` (Arbeitsdokument, nicht in knowledge/)

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
