# Assessment

Zwei parallele Assessment-Systeme fuer den systematischen Literature Review.

---

## Struktur

```
assessment/
├── human/                          # Manuelles Human Assessment
│   ├── README.md                   # Anleitung + Schema
│   ├── create_thematic_assessment.py  # Excel aus Zotero generieren
│   ├── excel_to_zotero_tags.py     # Assessment-Ergebnisse -> Zotero Tags
│   └── results/
│       └── assessment_20260218.xlsx   # Aktuelles Assessment (Susi + Sabine)
│
└── llm-5d/                         # LLM Assessment 5D (abgeschlossen, archiviert)
    ├── REPORT.md                   # Ergebnisbericht
    ├── prompt_template.md          # Prompt-Template (5D-Schema)
    ├── scripts/
    │   ├── assess_papers.py        # Hauptskript (5D Assessment)
    │   ├── analyze_results.py      # Ergebnisanalyse
    │   ├── write_llm_tags_to_zotero.py
    │   └── write_llm_tags_to_zotero_simple.py
    └── output/
        ├── assessment_llm.xlsx     # 325 Papers, 5 Dimensionen (0-3)
        └── zotero_tags.csv         # Exportierte Zotero-Tags
```

---

## Zwei Assessment-Tracks

| Track | Ordner | Schema | Status |
|-------|--------|--------|--------|
| **Human** | `human/` | 10 binaere Kategorien (Ja/Nein) | In Arbeit (210/326 mit Decision) |
| **LLM 5D** | `llm-5d/` | 5 ordinale Dimensionen (0-3) | Fertig (325/325, $1.15) |
| **LLM 10K** | `../benchmark/` | 10 binaere Kategorien (Ja/Nein) | Fertig (326/326, $1.44) |

Das **LLM 10K Assessment** (`benchmark/data/llm_assessment_10k.csv`) matcht das Human-Schema und dient dem Benchmark (Cohen's Kappa).

Das **LLM 5D Assessment** (`llm-5d/output/assessment_llm.xlsx`) verwendet ein anderes Schema (5 Dimensionen 0-3) und wurde fuer parametrisches Screening eingesetzt. Es ist abgeschlossen und archiviert.

---

## Human Assessment -- Workflow

### Excel aktualisieren (wenn neue Papers in Zotero)

```bash
python assessment/human/create_thematic_assessment.py
```

### Google Sheets Export fuer Benchmark

1. [Google Sheets oeffnen](https://docs.google.com/spreadsheets/d/1z-HQSwVFg-TtdP0xo1UH4GKLMAXNvvXSdySPSA7KUdM/)
2. Datei -> Herunterladen -> Comma-separated values (.csv)
3. Speichern als `benchmark/data/human_assessment.csv`

### Assessment-Ergebnisse nach Zotero

```bash
python assessment/human/excel_to_zotero_tags.py
```

---

*Aktualisiert: 2026-02-21*
