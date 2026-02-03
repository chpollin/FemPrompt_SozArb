# Benchmark Scripts

Scripts für den Human vs. Agent Assessment Benchmark.

## Übersicht

| Script | Funktion | Input | Output |
|--------|----------|-------|--------|
| `run_llm_assessment.py` | LLM-basiertes Paper-Assessment | Metadaten-CSV | Assessment-CSV |
| `merge_assessments.py` | Human + Agent Assessments zusammenführen | 2x CSV | Merged CSV |
| `calculate_agreement.py` | Agreement-Metriken berechnen (Kappa) | Merged CSV | Metriken-JSON |
| `analyze_disagreements.py` | Divergenzen qualitativ analysieren | Merged CSV | Disagreements-CSV |
| `run_phase2_pipeline.py` | Phase 2 Pipeline orchestrieren | - | - |

## Workflow

```
Human Assessment (Google Sheets)
         ↓
    Export CSV
         ↓
run_llm_assessment.py  ←  Papers-Metadaten
         ↓
merge_assessments.py   ←  Human CSV + LLM CSV
         ↓
calculate_agreement.py
         ↓
analyze_disagreements.py
```

## Verwendung

### LLM-Assessment durchführen

```bash
python benchmark/scripts/run_llm_assessment.py \
  --input corpus/papers_metadata.csv \
  --config benchmark/config/categories.yaml \
  --output benchmark/data/llm_assessment.csv
```

### Assessments zusammenführen

```bash
python benchmark/scripts/merge_assessments.py \
  --human benchmark/data/human_assessment.csv \
  --agent benchmark/data/llm_assessment.csv \
  --output benchmark/data/merged_comparison.csv
```

### Agreement berechnen

```bash
python benchmark/scripts/calculate_agreement.py \
  --input benchmark/data/merged_comparison.csv \
  --output benchmark/results/agreement_metrics.json
```

### Disagreements analysieren

```bash
python benchmark/scripts/analyze_disagreements.py \
  --input benchmark/data/merged_comparison.csv \
  --output benchmark/results/disagreement_cases.csv
```

## Konfiguration

Assessment-Schema: `benchmark/config/categories.yaml`

Enthält:
- 10 Kategorien (4 Technik, 6 Sozial)
- Definitionen und Beispiele
- Inklusions-Logik
