# Benchmark: Human-LLM Assessment

Vergleich zwischen manuellem Human Assessment (Susi + Sabine) und LLM Assessment (Claude Haiku 4.5) ueber 10 binaere Kategorien. Primaere Metrik: Cohen's Kappa pro Kategorie.

Methodische Grundlage: Woelfle et al. (2024), Hanegraaf et al. (2024), Sandner et al. (2025).

---

## Struktur

```
benchmark/
├── config/
│   └── categories.yaml              # 10 Kategorie-Definitionen (Single Source of Truth)
├── data/
│   ├── papers_full.csv              # Vollstaendiger Korpus (326 Papers, aus Zotero)
│   ├── human_assessment.csv         # Human Assessment Export (Google Sheets)
│   ├── llm_assessment_10k.csv       # LLM Assessment (326/326, Haiku 4.5, $1.44)
│   └── merged_assessment.csv        # Schnittmenge fuer Benchmark (wird generiert)
├── prompts/
│   └── assessment_prompt.md         # LLM-Assessment-Prompt (dokumentiert)
├── results/                         # Benchmark-Ergebnisse (werden generiert)
│   ├── agreement_metrics.json       # Cohen's Kappa pro Kategorie
│   ├── disagreements.csv            # Disagreement-Faelle
│   └── figures/                     # Visualisierungen
└── scripts/
    ├── generate_papers_csv.py        # Zotero -> papers_full.csv
    ├── run_llm_assessment.py         # LLM Assessment ausfuehren
    ├── merge_assessments.py          # Human + LLM zusammenfuehren
    ├── calculate_agreement.py        # Cohen's Kappa berechnen
    └── analyze_disagreements.py      # Disagreements analysieren
```

---

## Assessment-Status

| Track | Datei | Papers | Status |
|-------|-------|--------|--------|
| Human | `data/human_assessment.csv` | 305 (171 bewertet) | In Arbeit |
| LLM 10K | `data/llm_assessment_10k.csv` | 326/326 | Fertig ($1.44) |
| Benchmark | `data/merged_assessment.csv` | ~170 (Schnittmenge) | Wartet auf HA |

---

## Workflow

### 1. LLM Assessment (abgeschlossen)

```bash
python scripts/run_llm_assessment.py \
  --input data/papers_full.csv \
  --config config/categories.yaml \
  --output data/llm_assessment_10k.csv
```

### 2. Human Assessment Export

1. [Google Sheets oeffnen](https://docs.google.com/spreadsheets/d/1z-HQSwVFg-TtdP0xo1UH4GKLMAXNvvXSdySPSA7KUdM/)
2. Datei -> Herunterladen -> CSV
3. Speichern als `benchmark/data/human_assessment.csv`

### 3. Benchmark ausfuehren

```bash
# Merge (Schnittmenge Human + LLM)
python scripts/merge_assessments.py \
  --human data/human_assessment.csv \
  --llm data/llm_assessment_10k.csv \
  --output data/merged_assessment.csv

# Cohen's Kappa berechnen
python scripts/calculate_agreement.py \
  --input data/merged_assessment.csv \
  --output results/agreement_metrics.json

# Disagreements analysieren
python scripts/analyze_disagreements.py \
  --input data/merged_assessment.csv \
  --output results/disagreements.csv
```

---

## Erwartete Ergebnisse

| Metrik | Erwartungshorizont |
|--------|-------------------|
| Human-Human κ | 0.5--0.8 (kategorienabhaengig) |
| Human-LLM κ | 0.3--0.7 |
| Benchmark-Basis | ~170 Papers (mit Human + LLM Assessment) |

---

## Kategorienschema

Vollstaendige Definitionen mit Beispielen: [config/categories.yaml](config/categories.yaml)

**Technik:** AI_Literacies, Generative_KI, Prompting, KI_Sonstige

**Sozial:** Soziale_Arbeit, Bias_Ungleichheit, Gender, Diversitaet, Feministisch, Fairness

**Entscheidung:** Include (Technik >= 1 UND Sozial >= 1), Exclude, Unclear

---

## Referenzen

- Woelfle et al. (2024). Benchmarking Human-AI collaboration for common evidence appraisal tools. *Journal of Clinical Epidemiology*, 175, 111533.
- Hanegraaf et al. (2024). Inter-reviewer reliability of human literature reviewing. *BMJ Open*, 14, e076912.
- Sandner et al. (2025). Assessing the Reliability of Human and LLM-Based Screening. OSSYM.

---

*Aktualisiert: 2026-02-18*
