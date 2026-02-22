# Working Rules for Claude AI Assistant

**Project:** FemPrompt SozArb -- Systematischer Literature Review zu AI Literacy & LLM-Bias im Kontext Sozialer Arbeit
**Last Updated:** 2026-02-22

---

## Project Overview

326 wissenschaftliche Papers werden durch eine 5-stufige LLM-Pipeline verarbeitet (Identifikation -> PDF-Akquise -> Markdown-Konversion -> Wissensextraktion -> Assessment). Kernfrage: **Was passiert mit Wissen, wenn es durch eine LLM-Pipeline fliesst?**

Das Projekt hat drei Schichten (definiert in `knowledge/FORSCHUNGSPROJEKT-PROMPTOTYPING.md`):
1. **Obsidian Vault** -- 505 Markdown-Dateien (248 Papers, 136 Konzepte, 111 Divergenzen, 5 Pipeline-Stufen, MOCs)
2. **Web-Interface** -- Promptotyping-Interface (`docs/promptotyping.html`) + Research Dashboard (`docs/index.html`)
3. **Paper** -- Forum Wissenschaft 2/2026, 18.000 Zeichen, Deadline 4. Mai 2026

### Leitkonzepte

- **Epistemische Asymmetrie:** LLM Include-Rate 68% vs. Human 42% = 26 Prozentpunkte Differenz. 78x LLM-Include/Human-Exclude vs. 23x umgekehrt.
- **Drei epistemische Haltungen:** Zeigen was ist (blau, Ergebnis) / Zeigen wie es entstanden ist (gruen, Prozess) / Zeigen was nicht geht (orange, Grenze)
- **Kappa-Prevalence-Bias:** Cohen's Kappa 0.035 ist Artefakt, NICHT primaerer Indikator. Primaere Metriken: Konfusionsmatrix + Basisraten.
- **Divergenz-Muster:** 90 Semantische Expansion (81%), 12 Keyword-Inklusion (11%), 9 Implizite Feldzugehoerigkeit (8%)

### Assessment-Tracks

| Track | Methode | Schema | Status |
|-------|---------|--------|--------|
| **Human** | Google Sheets | 10 binaere Kategorien | 210/326 mit Decision |
| **LLM (5D)** | Claude Haiku 4.5 | 5 Dimensionen (0-3) | Fertig (archiviert) |
| **LLM (10K)** | Claude Haiku 4.5 | 10 binaere Kategorien | Fertig (326/326, Benchmark) |

---

## Repository Structure

### Directories

| Verzeichnis | Inhalt | Aendern? |
|-------------|--------|----------|
| `knowledge/` | **Single Source of Truth** fuer alle Projektdokumentation | Ja, mit Vorsicht |
| `knowledge/paper/` | Paper-Entwurf + Referenzliteratur | Nur auf Anfrage |
| `pipeline/knowledge/distilled/` | 249 Knowledge-Dokumente (NICHT "vault") | Read-only |
| `pipeline/knowledge/_stage1_json/` | Rohe JSON-Extraktionen (Kategorien als Booleans) | Read-only |
| `pipeline/knowledge/_stage2_draft/` | Markdown-Drafts | Read-only |
| `pipeline/knowledge/_verification/` | 219 Verifikationsdateien | Read-only |
| `vault/` | Obsidian Vault v2 (248 Papers, 136 Concepts, 111 Divergenzen) | Generiert |
| `docs/` | GitHub Pages: Web-Interfaces + Daten + Downloads | Aktiv bearbeitet |
| `docs/data/` | JSON-Daten fuer Web-Interfaces | Generiert |
| `benchmark/` | Benchmark-Scripts + Ergebnisse + Konfiguration | Fertig |
| `assessment/` | LLM-Assessment (5D) + Human-Assessment | Fertig |
| `scripts/` | Generatoren (Vault v2, Promptotyping-Daten) | Aktiv bearbeitet |
| `config/` | `defaults.yaml` -- einzige Config-Datei | Nicht aendern |
| `.vault_cache/` | LLM-API-Cache (360 JSON-Dateien, reproduzierbar) | Nicht aendern |
| `prompts/` | Prompt-Governance + CHANGELOG | Read-only |

### Key Files

| Datei | Zweck | Aendern? |
|-------|-------|----------|
| `knowledge/status.md` | **Aktueller Stand, Meilensteine, Benchmark-Ergebnisse** | Ja |
| `knowledge/journal.md` | Arbeitsjournal (chronologisch) | Ja |
| `knowledge/methods-and-pipeline.md` | Methodik, Script-Referenz, Kosten | Selten |
| `knowledge/README.md` | Dokumentations-Index | Ja |
| `knowledge/paper/paper-draft.md` | **DAS PAPER** (Single Source of Truth, 17.975 Zeichen) | Nur auf Anfrage |
| `knowledge/FORSCHUNGSPROJEKT-PROMPTOTYPING.md` | Konzeptdokument Promptotyping | Selten |
| `knowledge/paper-integrity.md` | Paper vs. Repo Abgleich | Selten |
| `docs/promptotyping.html` | Promptotyping-Interface (5 Views) | Aktiv |
| `docs/js/promptotyping-app.js` | Promptotyping JS (~1090 Zeilen, IIFE) | Aktiv |
| `docs/css/promptotyping.css` | Promptotyping CSS (~650 Zeilen) | Aktiv |
| `docs/index.html` | Research Dashboard (4-Tab SPA) | Fertig |
| `scripts/generate_vault_v2.py` | Vault v2 Generator (~1660 Zeilen, LLM-Calls) | Selten |
| `scripts/generate_promptotyping_data_v2.py` | Datengenerator (~580 Zeilen, deterministisch) | Aktiv |
| `benchmark/results/agreement_metrics.json` | Kanonische Benchmark-Metriken | Read-only |
| `benchmark/config/categories.yaml` | Kanonische Kategorie-Definitionen | Read-only |

### Branches

| Branch | Zweck | Status |
|--------|-------|--------|
| `main` | Stabil, alle M1-M9 abgeschlossen | Stabil |
| `FemPrompt_SozArb_promptotyping-interface` | Promptotyping v2/v2.1 Entwicklung | **Aktiv** |

---

## Web-Interfaces (docs/)

### Promptotyping-Interface (`docs/promptotyping.html`)

5 Views, Vanilla JS + D3.js + Chart.js via CDN, IIFE-Pattern:

| View | Inhalt | D3-Abhaengigkeit |
|------|--------|-------------------|
| **Landing** | Leitfrage, 3 Kennzahlen, 3 Featured Papers | Nein |
| **Pipeline** | Sankey-Diagramm, 5 Stufen mit Dropout-Baendern | d3-sankey v0.12.3 |
| **Paper Journey** | Featured Picks + Suche, Timeline mit Stance-Indicators | Nein |
| **Konzept-Explorer** | Force Graph, Cluster-Farben, Divergenz-Ring | D3 Force |
| **Divergenz-Navigator** | Exemplarische Faelle, Narrative Cards, Filter | Nein |

**Architektur-Regeln:**
- Kein Build-Tool, kein Framework, kein npm. Nur CDN + IIFE.
- CSS erbt aus `research.css` (:root-Variablen), eigener `pt-*` Namespace fuer Promptotyping
- Daten: `docs/data/promptotyping_v2.json` (generiert durch `scripts/generate_promptotyping_data_v2.py`)
- **Epistemische Haltungen sind strukturell:** `.stance-section--result` (blau), `.stance-section--process` (gruen), `.stance-section--limits` (orange) in JEDER Detail-Ansicht
- **Featured Papers:** 3 handverlesen in `FEATURED_PAPERS` dict im Datengenerator (Ahmed_2024, Shafie_2025, Kaneko_2024)
- **Konzept-Cluster:** Technik/Sozial/Bridge, berechnet aus Kategorie-Affinitaet (65%-Threshold)

**D3-Sankey Besonderheiten:**
- `d3.sankeyLinkHorizontal()` erzeugt Path mit `stroke-width` (NICHT `fill`)
- Orphan-Nodes (ohne Links) koennen D3-Sankey crashen
- Links muessen `fill: none` haben

### Research Dashboard (`docs/index.html`)

4-Tab Chart.js SPA (Papers, Benchmark, Dashboard, Graph). Fertig, keine Aenderungen geplant.
Daten: `docs/data/research_vault_v2.json` (generiert durch `pipeline/scripts/generate_docs_data.py`)

---

## Pipeline-Details

### PDF-Akquise -> Knowledge

```
326 Zotero Papers -> 257 PDFs (4 Fallback-Strategien) -> 252 Markdown (Docling)
-> 249 Knowledge Docs (3-Stage: Extract JSON -> Format MD -> Verify)
```

Verlustrate: 77/326 (23.6%) -- primaer Paywalls und korrupte PDFs.

### Knowledge-Dokument-Struktur

- YAML-Frontmatter: title, authors, year, type, language, processed, source_file, confidence
- Sektionen: Kernbefund, Forschungsfrage, Methodik, Hauptargumente, Kategorie-Evidenz, Assessment-Relevanz, Schluesselreferenzen
- **Kategorien sind in `_stage1_json/`** als Booleans, NICHT in MD-Frontmatter

### LLM-Kosten (gesamt)

| Komponente | Kosten |
|-----------|--------|
| Knowledge Distillation (249 Papers) | ~$7 |
| 5D Assessment (325 Papers) | $1.15 |
| 10K Assessment (326 Papers) | $1.44 |
| Vault v2 (Konzepte + Divergenzen) | ~$1 |
| **Gesamt** | **~$10.59** |

---

## Data Flow (JSON)

### promptotyping_v2.json

Generiert durch `scripts/generate_promptotyping_data_v2.py`. Struktur:

```
{
  "meta": { total_papers, disagreements, kappa, confusion_matrix, rates,
            pattern_distribution, asymmetry },
  "pipeline": { stages: [...], flow: { nodes, links } },
  "papers": [{ id, stem, title, author_year, featured?,
               stages: { identification, conversion, ske, assessment },
               concepts: [...], knowledge_summary }],
  "concepts": { nodes: [{ id, label, frequency, cluster, definition }],
                edges: [{ source, target, weight }] },
  "divergences": [{ paper_id, title, author_year, human_decision, llm_decision,
                    pattern, justification, severity, n_affected, category_comparison,
                    llm_reasoning }]
}
```

### research_vault_v2.json

Generiert durch `pipeline/scripts/generate_docs_data.py`. Fuer Research Dashboard.

---

## Redundancy Rules (kanonische Orte)

Jede Information hat genau EINEN kanonischen Ort. Andere Dateien referenzieren, duplizieren nicht.

| Information | Kanonischer Ort |
|-------------|-----------------|
| Benchmark-Ergebnisse | `knowledge/status.md` (M6) + `benchmark/results/agreement_metrics.json` |
| Kappa-Revision | `ANALYSIS_SESSION_2026-02-22.md` |
| Script-Referenz | `knowledge/methods-and-pipeline.md` |
| Pipeline-Statistiken | `knowledge/status.md` + `knowledge/methods-and-pipeline.md` |
| Kategorie-Definitionen | `benchmark/config/categories.yaml` |
| Theorie + Operationalisierung | `knowledge/project.md` |
| Promptotyping-Konzept | `knowledge/FORSCHUNGSPROJEKT-PROMPTOTYPING.md` |
| Arbeitsjournal | `knowledge/journal.md` |

---

## Working Conventions

### Session Start

1. Read `knowledge/status.md` (aktueller Stand)
2. Check `git status` + `git log -3` (Branch + letzte Commits)
3. Read `knowledge/journal.md` (letzte Session, offene Punkte)
4. Create TodoWrite for multi-step tasks

### Documentation Rules

- **Sprache:** Deutsch fuer Dokumentation, English fuer Code/Variablen/Kommentare
- **Keine Emojis** in Dokumentationsdateien
- **Datum-Footer:** `*Aktualisiert: YYYY-MM-DD*` (kein Versionsnummer)
- **Tabellen** fuer Vergleiche, Listen fuer Aufzaehlungen
- **Journal updaten** bei jeder substantiellen Session

### Git Workflow

- **Commit-Format:** `[type]: [description]` (feat, fix, docs, refactor, test, chore)
- **Commit haeufig** nach jeder logischen Aenderung
- **Push:** `git push -u origin <branch-name>`
- **NEVER** force push to main
- **Aktueller Branch:** `FemPrompt_SozArb_promptotyping-interface`

**Nicht committen:** `.env`, generierte Daten (PDFs, Knowledge Docs), Test-Artefakte, `.vault_cache/`

### Code Rules

- **Immer lesen vor editieren** -- keine Aenderungen an Code, der nicht gelesen wurde
- **Existierende Dateien bevorzugen** -- keine neuen Dateien erstellen, wenn editieren reicht
- **IIFE-Pattern** fuer Vanilla JS (`(function() { 'use strict'; ... })();`)
- **CSS:** Variables aus `research.css` erben, `pt-*` Namespace fuer eigene Variablen
- **Python:** `pathlib.Path` fuer Dateipfade, UTF-8 erzwingen, Windows MAX_PATH beachten (Titel auf 100 Zeichen kuerzen)

### TodoWrite

**IMMER nutzen** bei:
- Multi-Step-Tasks (3+ Schritte)
- Lange Operationen
- User-Requests mit mehreren Items

**Real-time updaten:**
- `in_progress` BEVOR Arbeit beginnt
- `completed` SOFORT nach Abschluss
- Nur EIN Task gleichzeitig `in_progress`

---

## Known Issues & Gotchas

| Problem | Loesung |
|---------|---------|
| Windows `nul` Datei | Ignorieren (reservierter Geraetename, nicht git-tracked) |
| Knowledge Doc "Kernaussage" vs "Kernbefund" | Korrekt ist "Kernbefund" |
| 326 Zotero vs 305 HA Papers | Temporale Divergenz, Merge via Zotero_Key + DOI/Titel |
| Kappa 0.035 | Prevalence-Bias-Artefakt (Byrt et al. 1993), NICHT primaerer Indikator |
| Source_Tool Feld leer | 290/326 leer, "254 DR / 50 Manual" aus Zotero Collections |
| D3 Sankey Links nicht sichtbar | `fill: none` + `stroke-width` verwenden (NICHT `fill`) |
| Titel-Matching | 5-Strategie-Kaskade (Stage1-JSON, KD-YAML, Filename-Prefix, Autor+Jahr, Fuzzy) |
| Windows MAX_PATH | Dateinamen auf 100 Zeichen kuerzen vor Suffix |
| `human_yes_rate` / `agent_yes_rate` | Skala 0-100 (z.B. 32.7 = 32.7%), NICHT 0-1 |

---

## Meilenstein-Status (Kurzfassung)

| M | Name | Status |
|---|------|--------|
| M1 | Knowledge-Konsolidierung | Abgeschlossen |
| M2 | Paper im Repo | Abgeschlossen |
| M3 | Deep-Research-Prompts | Abgeschlossen |
| M4 | Korpus-Bereinigung | Abgeschlossen |
| M5 | 10K LLM Assessment | Abgeschlossen |
| M6 | Teilmengen-Benchmark | Abgeschlossen |
| M7 | Ergebnisse ins Paper | Abgeschlossen |
| M8 | Paper finalisieren | **Offen** (Review-Runde, Einreichung 4. Mai) |
| M9 | Vault + GitHub Pages | Abgeschlossen |
| M10 | Promptotyping v1 | Ersetzt durch M11 |
| M11 | Promptotyping v2/v2.1 | **In Arbeit** (Browser-Test, Merge zu main) |

---

## Key Innovations

1. **LLM-basiertes PRISMA Assessment** -- 326/326, 100% Erfolgsrate, $1.44
2. **5-dimensionale Relevanz-Bewertung** -- Parametrisch, adaptierbar
3. **Hierarchische PDF-Akquise** -- 4 Fallback-Strategien, 79% Erfolgsrate
4. **Human-LLM Benchmark** -- Konfusionsmatrix + Basisraten als primaere Metriken
5. **Epistemische Divergenz-Analyse** -- 111 Disagreements in 3 Muster klassifiziert (LLM-basiert)
6. **Promptotyping-Interface** -- Forschungsprozess als navigierbares epistemisches Artefakt
7. **Obsidian Vault v2** -- 505 interlinked Markdown-Dateien mit LLM-extrahierten Konzepten

---

*This file is for Claude (me) only. Users should read knowledge/README.md instead.*
