# Agent Workflow Assessment

LLM-basiertes automatisiertes Assessment mit Claude Haiku 4.5.

## Verwendung

```bash
# Vom assessment/agent/ Verzeichnis aus:
python run_assessment.py \
  --input ../../corpus/papers_metadata.csv \
  --config config.yaml \
  --output results/assessment_$(date +%Y%m%d).csv
```

## Konfiguration

### config.yaml

Enthält die Kategorie-Definitionen (identisch mit Human Assessment).

### prompt_template.md

Template für den Assessment-Prompt.

## Output

Ergebnisse werden in `results/` gespeichert:
- `assessment_YYYYMMDD.csv` - Vollständiges Assessment

### Output-Spalten

| Spalte | Beschreibung |
|--------|--------------|
| ID | Paper-ID |
| Zotero_Key | Zotero-Referenz |
| AI_Literacies | Ja/Nein |
| ... | (alle 10 Kategorien) |
| Decision | Include/Exclude/Unclear |
| Exclusion_Reason | Falls Exclude |
| Studientyp | Empirisch, Theoretisch, etc. |
| LLM_Confidence | 0.0-1.0 |
| LLM_Reasoning | Begründung |

## Kosten

- Modell: Claude Haiku 4.5
- Kosten: ~$0.002 pro Paper
- Geschätzt für 303 Papers: ~$0.60

## Performance

Aus SozArb-Testlauf:
- 325 Papers in 24 Minuten
- 100% Erfolgsrate
- Inkonsistenz-Rate: 6% (nach Schema-Optimierung)

## Dateien

```
assessment/agent/
├── README.md              # Diese Datei
├── config.yaml            # Kategorie-Schema
├── prompt_template.md     # Prompt-Template
├── run_assessment.py      # Haupt-Script
└── results/
    └── assessment_YYYYMMDD.csv
```

---

*Version: 1.0 (2026-02-02)*
