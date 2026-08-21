# Human assessment (expert track)

The manual assessment by the two reviewing experts (social work, gender and diversity studies). The track is complete and epistemically binding; its canonical CSV is `assessment/human_assessment.csv`. Round-2 screening runs through PRISM (`docs/prisma.html`), so this workflow is kept as the record of how the round-1 track was captured.

Working copy of the round-1 capture: [results/assessment_20260218.xlsx](results/assessment_20260218.xlsx); the live sheet was on Google Sheets: [Link](https://docs.google.com/spreadsheets/d/1z-HQSwVFg-TtdP0xo1UH4GKLMAXNvvXSdySPSA7KUdM/).

## Schema

Category definitions live in [../categories.yaml](../categories.yaml) (single source of truth). Ten binary categories in two dimensions:

- Technology: AI_Literacies, Generative_KI, Prompting, KI_Sonstige
- Social: Soziale_Arbeit, Bias_Ungleichheit, Gender, Diversitaet, Feministisch, Fairness

Decision logic: Include when at least one technology AND at least one social category apply; Exclude otherwise; Unclear marks records needing discussion (they enter PRISM as report items, never as decisions).

## Sheet-to-CSV export (round 1 procedure)

1. Open the Google Sheet.
2. File, Download, Comma-separated values (.csv).
3. Save as `assessment/human_assessment.csv`.

### Column mapping

| Sheet column | CSV column |
|---------------------|------------|
| ID | ID |
| Zotero Key | Zotero_Key |
| Autor:in (Jahr) | Author_Year |
| Titel | Title |
| AI Literacies | AI_Literacies |
| Generative KI | Generative_KI |
| Prompting | Prompting |
| KI Sonstige | KI_Sonstige |
| Soziale Arbeit | Soziale_Arbeit |
| Bias/Ungleichheit | Bias_Ungleichheit |
| Gender | Gender |
| Diversitaet / Intersektionalitaet | Diversitaet |
| Feministisch | Feministisch |
| Fairness | Fairness |
| Studientyp | Studientyp |
| Decision | Decision |
| Exclusion Reason | Exclusion_Reason |
| Notes | Notes |

Values: categories `Ja` or `Nein` (empty reads as Nein), Decision `Include` / `Exclude` / `Unclear`.

## Scripts

The workflow scripts moved to `src/assess/` in the folder restructure:

```bash
python src/assess/create_thematic_assessment.py   # generate the formatted Excel from Zotero
python src/assess/excel_to_zotero_tags.py         # write final decisions back to Zotero as tags
```

## Quality assurance (round 1)

- Disagreements were resolved in inter-rater discussion between the two reviewers; the consensus is documented in the Notes column.
- Unclear marks papers that needed further discussion.

The counts of this track live in the data (`generated/benchmark-results/`, reproduced by `src/replay/`) and the Evidence Companion.
