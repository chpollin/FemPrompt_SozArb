# Status (2026-02-02)

## Aktueller Fokus: FemPrompt Thematisches Assessment

Das FemPrompt-Projekt befindet sich in der thematischen Assessment-Phase.

---

## FemPrompt (303 Papers) - AKTIV

### Thematisches Assessment

| Aspekt | Stand |
|--------|-------|
| Papers exportiert | 303 (254 DeepResearch + 49 Human 1 Collection) |
| Schema | 10 binaere Kategorien (Technik + Sozial) |
| Google Spreadsheet | [Link](https://docs.google.com/spreadsheets/d/1z-HQSwVFg-TtdP0xo1UH4GKLMAXNvvXSdySPSA7KUdM/) |
| Bearbeiter | Susi Sackl-Sharif, Sabine Klinger |
| Metadaten | Christina ergaenzt in Zotero |

### LLM-Assessment Benchmark (NEU)

| Aspekt | Stand |
|--------|-------|
| Test-Durchlauf | 50 Papers (V2) |
| Inkonsistenz-Rate | 6% (V1: 20%) |
| Feministisch erkannt | 8 Papers (V1: 0) |
| Bereit fuer Vollauf | Ja (~$1.30 geschaetzt) |

### PDF-Bestand

| Quelle | Anzahl |
|--------|--------|
| Zotero Attachments | 294 |
| Lokal vorhanden | 97 |
| Zu laden | ~197 |

### Naechste Schritte

1. Human-Assessment im Google Spreadsheet abschliessen
2. Vollstaendiger LLM-Assessment-Durchlauf (303 Papers)
3. Benchmark-Analyse (Human vs. LLM)
4. PDFs von Zotero laden
5. Pipeline ausfuehren (PDF -> Markdown -> Summary -> Vault)

---

## SozArb (325 Papers) - PAUSIERT

### Pipeline-Fortschritt

| Phase | Status |
|-------|--------|
| Assessment | 325/325 (222 Include, 83 Exclude, 20 Unclear) |
| Enhanced Summaries | 75/222 (76.1/100 avg quality) |
| Vault | Operativ (266 Papers, 144 Concepts) |
| Web Viewer | Implementiert, nicht deployed |

### Kosten (historisch)

| Komponente | Kosten |
|------------|--------|
| LLM Assessment | $0.58 |
| Enhanced Summarization | $3.15 |
| **Total** | **$3.73** |

---

## Paper: Forum Wissenschaft 2/2026

| Aspekt | Stand |
|--------|-------|
| Deadline | 4. Mai 2026 |
| Umfang | 18.000 Zeichen |
| Fokus | Deep-Research-gestuetzte Literature Reviews im Praxistest |

### Abhaengigkeiten

1. Human-Assessment muss abgeschlossen sein
2. LLM-Assessment Vollauf muss erfolgen
3. Benchmark-Metriken (Kappa, Agreement) muessen berechnet sein

---

## Pipeline-Phasen

```
Phase 1: Assessment & Benchmark
  Human-Assessment (Google Sheets)     [IN BEARBEITUNG]
  LLM-Assessment (Claude Haiku 4.5)    [BEREIT]
  Benchmark-Analyse (Cohen's Kappa)    [WARTET]

Phase 2: Pipeline-Execution
  PDF-Akquise (getPDF_intelligent.py)  [PROTOTYP GETESTET]
  Markdown-Konversion (Docling)        [BEREIT]
  LLM-Summarisierung (Enhanced v2.0)   [BEREIT]
  Vault-Generierung (Obsidian)         [BEREIT]

Phase 3: Paper-Entwicklung
  Textbausteine                        [WARTET]
  Ergebnisse einarbeiten               [WARTET]
  Finalisierung                        [WARTET]
```

---

## Technische Infrastruktur

### Scripts (getestet)

| Script | Funktion |
|--------|----------|
| benchmark/scripts/run_llm_assessment.py | LLM-Assessment mit YAML-Schema |
| benchmark/scripts/run_phase2_pipeline.py | PDF -> Markdown -> Summary Orchestrierung |
| analysis/getPDF_intelligent.py | Hierarchische PDF-Akquise |
| analysis/summarize_documents_enhanced.py | Multi-Pass Summarisierung |

### Konfiguration

| Datei | Zweck |
|-------|-------|
| benchmark/config/categories.yaml | 10-Kategorien-Schema (v1.1) |
| .env | API Keys (ANTHROPIC_API_KEY) |

---

## Offene Punkte

- [ ] Meeting mit Susi: Kategoriendefinitionen finalisieren
- [ ] Human-Assessment: 303 Papers bewerten
- [ ] LLM-Vollauf: Nach Human-Assessment starten
- [ ] PDFs: 197 fehlende PDFs von Zotero laden
- [ ] Paper: Textbausteine nach Benchmark-Ergebnissen

---

*Aktualisiert: 2026-02-02*
*Version: 5.0*
