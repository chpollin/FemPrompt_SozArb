# assessment/

Data of the parallel assessment tracks for the systematic review. The method is described in `knowledge/methods.md`; the scripts that produce and compare these files live in `src/assess/` (see its README).

## Layout

```
assessment/
├── categories.yaml              # the ten categories, single source of truth
├── papers_full.csv              # corpus master table (from the Zotero export)
├── human_assessment.csv         # expert track (binding)
├── llm_assessment_10k.csv       # LLM benchmark track (Haiku 4.5, ten binary categories)
├── llm_assessment_haiku.csv     # condition contrast: Haiku, title+abstract input
├── llm_assessment_haiku_kd.csv  # condition contrast: Haiku, knowledge-document input
├── llm_assessment_sonnet.csv    # condition contrast: Sonnet, title+abstract input
├── llm_assessment_sonnet_kd.csv # condition contrast: Sonnet, knowledge-document input
├── merged_*.csv                 # merged human-LLM tables per condition (paired by Zotero_Key)
├── human/                       # human-assessment workflow notes and Excel results
└── llm-5d/                      # archived 5D track (own README, REPORT, scripts, output)
```

## Tracks

| Track | Data | Schema | Status |
|---|---|---|---|
| Human | `human_assessment.csv` | 10 binary categories | complete, epistemically binding |
| LLM 10K | `llm_assessment_10k.csv` | 10 binary categories | complete, the benchmark track |
| LLM 5D | `llm-5d/` | 5 ordinal dimensions | complete, archived |

The four `llm_assessment_{haiku,sonnet}[_kd].csv` files are the 2x2 condition contrast (model by input source, trAIce M4).

## Rules

- Pairing between tracks is by `Zotero_Key`; the 2026-03 merge bug came from row-order pairing, so any join by sequential id is wrong by construction.
- The agreement figures are computed by `src/assess/calculate_agreement.py` and asserted by the committed replay `src/replay/replay_round1.py` (self-test against `generated/benchmark-results/agreement_metrics.json`); no figure is maintained by hand in prose.
