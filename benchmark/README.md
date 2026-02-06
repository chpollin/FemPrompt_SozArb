# Human-LLM Assessment Benchmark

Parallel Human-AI Assessment für den Vergleich zwischen menschlichem und LLM-basiertem PRISMA-Screening.

## Zweck

Quantifizierung der Übereinstimmung zwischen Expert:innen-Bewertung (Susi, Sabine) und LLM-Assessment (Claude Haiku 4.5). Das Design adaptiert den Benchmarking-Ansatz von Woelfle et al. (2024).

## Methodische Referenzen

| Studie | Kernbefund |
|--------|------------|
| Woelfle et al. (2024) | Human IRR variiert mit Aufgabenkomplexität: κ = 0.84 (PRISMA) bis κ = 0.29 (PRECIS-2) |
| Hanegraaf et al. (2024) | Menschliche Baseline in SLRs: κ = 0.77–0.88 |
| Sandner et al. (2025) | Human-LLM κ ≈ Human-Human κ bei Screening-Aufgaben |

**Erwartungshorizont für dieses Projekt:**
- Human-Human: κ ≈ 0.5–0.8 (kategorienabhängig)
- Human-LLM: κ ≈ 0.3–0.7

Detaillierte Analyse: [Referenzliteratur-Benchmark-Design.md](../knowledge/paper/Referenzliteratur-Benchmark-Design.md)

## Verzeichnisstruktur

```
benchmark/
├── config/
│   └── categories.yaml      # Kategorie-Definitionen (10 binär)
├── data/
│   ├── human_assessment.csv # Export aus Google Sheets
│   ├── llm_assessment.csv   # LLM-generiert
│   └── merged_comparison.csv
├── prompts/
│   └── assessment_prompt.md # LLM-Assessment-Prompt
├── scripts/
│   ├── run_llm_assessment.py
│   ├── merge_assessments.py
│   ├── calculate_agreement.py
│   └── analyze_disagreements.py
└── results/
    ├── agreement_metrics.json
    ├── disagreement_cases.csv
    └── figures/
```

## Workflow

1. **Human-Assessment abschließen** → Export als CSV
2. **LLM-Assessment durchführen** mit identischem Schema
3. **Merge** → `merged_comparison.csv`
4. **Metriken berechnen** → Cohen's Kappa, Agreement pro Kategorie
5. **Disagreements analysieren** → Qualitative Auswertung für Paper

## Kategorienschema

Siehe `config/categories.yaml` für vollständige Definitionen.

**Technik-Dimensionen:** AI_Literacies, Generative_KI, Prompting, KI_Sonstige
**Sozial-Dimensionen:** Soziale_Arbeit, Bias_Ungleichheit, Gender, Diversitaet, Feministisch, Fairness

## Verwendung

```bash
# Nach Human-Assessment-Export:
python scripts/run_llm_assessment.py --config config/categories.yaml --output data/llm_assessment.csv

# Merge und Analyse:
python scripts/merge_assessments.py --human data/human_assessment.csv --llm data/llm_assessment.csv
python scripts/calculate_agreement.py --input data/merged_comparison.csv
```

## Dokumentation

- [Human-LLM Assessment Benchmark](../knowledge/paper/Human-LLM%20Assessment%20Benchmark.md) - Vollständige Spezifikation
- [Referenzliteratur-Benchmark-Design](../knowledge/paper/Referenzliteratur-Benchmark-Design.md) - Methodische Referenzen
- [Forum Wissenschaft Paper](../knowledge/paper/Forum%20Wissenschaft%20Paper%20-%20Arbeitsplan.md) - Paper-Kontext

## Referenzen

- Woelfle, T., et al. (2024). Benchmarking Human–AI collaboration for common evidence appraisal tools. *Journal of Clinical Epidemiology*, 175, 111533.
- Hanegraaf, G., et al. (2024). Inter-reviewer reliability of human literature reviewing. *BMJ Open*, 14, e076912.
- Sandner, F., et al. (2025). Assessing the Reliability of Human and LLM-Based Screening. OSSYM.
