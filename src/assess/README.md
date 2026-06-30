# Benchmark Scripts

Scripts für den Human vs. Agent Assessment Benchmark.

## Übersicht

| Script | Funktion | Input | Output |
|--------|----------|-------|--------|
| `run_llm_assessment.py` | LLM-basiertes Paper-Assessment | Metadaten-CSV | Assessment-CSV |
| `merge_assessments.py` | Human + Agent Assessments zusammenführen | 2x CSV | Merged CSV |
| `calculate_agreement.py` | Agreement-Metriken berechnen (Kappa) | Merged CSV | Metriken-JSON |
| `analyze_disagreements.py` | Divergenzen qualitativ analysieren | Merged CSV | Disagreements-CSV |

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
python src/assess/run_llm_assessment.py \
  --input corpus/papers_metadata.csv \
  --config assessment/categories.yaml \
  --output assessment/llm_assessment.csv
```

### Assessments zusammenführen

```bash
python src/assess/merge_assessments.py \
  --human assessment/human_assessment.csv \
  --agent assessment/llm_assessment.csv \
  --output assessment/merged_comparison.csv
```

### Agreement berechnen

```bash
python src/assess/calculate_agreement.py \
  --input assessment/merged_comparison.csv \
  --output generated/benchmark-results/agreement_metrics.json
```

### Disagreements analysieren

```bash
python src/assess/analyze_disagreements.py \
  --input assessment/merged_comparison.csv \
  --output generated/benchmark-results/disagreement_cases.csv
```

## Konfiguration

Assessment-Schema: `assessment/categories.yaml`

Enthält:
- die zehn Kategorien (Technik und Sozial)
- Definitionen und Beispiele
- Inklusions-Logik
