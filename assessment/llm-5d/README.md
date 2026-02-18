# LLM Assessment 5D (Archiv)

Abgeschlossenes LLM-basiertes Assessment mit 5 ordinalen Dimensionen (0-3).

**Status: Fertig, archiviert.** Dieses System wurde durch das 10K Assessment (`benchmark/`) abgeloest, das das Human-Assessment-Schema (10 binaere Kategorien) fuer den Benchmark verwendet.

---

## Ergebnisse

| Metrik | Wert |
|--------|------|
| Papers bewertet | 325 |
| Erfolgsrate | 100% |
| Include | 222 (68.3%) |
| Exclude | 83 (25.5%) |
| Unclear | 20 (6.2%) |
| Kosten | $1.15 |
| Modell | Claude Haiku 4.5 |
| Datum | 2025-11-02 |

Vollstaendiger Bericht: [REPORT.md](REPORT.md)

---

## Schema (5 Dimensionen, 0-3)

| Dimension | Beschreibung | Avg Score |
|-----------|-------------|-----------|
| Rel_Bias | Algorithmische Verzerrungen | 2.47 |
| Rel_Vulnerable | Vulnerable Gruppen / Digital Equity | 2.23 |
| Rel_Praxis | Praktische Implementation | 1.68 |
| Rel_Prof | Professioneller Kontext (Soziale Arbeit) | 1.67 |
| Rel_AI_Komp | AI/LLM-Kompetenzen | 1.18 |

Score-Bedeutung: 0 = keine Erwaehnung, 1 = peripher, 2 = substantiell, 3 = Kernfokus

---

## Dateien

```
assessment/llm-5d/
├── README.md                          # Diese Datei
├── REPORT.md                          # Ergebnisbericht
├── prompt_template.md                 # Prompt-Template (5D-Schema)
├── scripts/
│   ├── assess_papers.py               # Hauptskript (5D Assessment)
│   ├── analyze_results.py             # Ergebnisanalyse
│   ├── write_llm_tags_to_zotero.py    # Tags nach Zotero
│   └── write_llm_tags_to_zotero_simple.py
└── output/
    ├── assessment_llm.xlsx            # Finale Ergebnisse (325 Papers)
    └── zotero_tags.csv                # Exportierte Zotero-Tags
```

---

## Abgrenzung zum 10K Assessment

| Aspekt | 5D (dieses System) | 10K (benchmark/) |
|--------|-------------------|-----------------|
| Schema | 5 Dimensionen (0-3) | 10 binaere Kategorien |
| Zweck | Parametrisches Screening | Benchmark (Cohen's Kappa) |
| Papers | 325 | 326 |
| Status | Archiviert | Aktiv |
| Output | `output/assessment_llm.xlsx` | `benchmark/data/llm_assessment_10k.csv` |

---

*Aktualisiert: 2026-02-18*
