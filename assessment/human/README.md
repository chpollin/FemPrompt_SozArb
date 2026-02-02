# Human Expert Assessment

Manuelles Assessment durch Fachexpert:innen.

## Bearbeiter:innen

- Susi Sackl-Sharif
- Sabine Klinger

## Google Sheet

**URL:** https://docs.google.com/spreadsheets/d/1z-HQSwVFg-TtdP0xo1UH4GKLMAXNvvXSdySPSA7KUdM/

## Schema

Siehe [schema.yaml](schema.yaml) fuer Kategorie-Definitionen.

### 10 Binaere Kategorien

**Technik:**
- AI_Literacies
- Generative_KI
- Prompting
- KI_Sonstige

**Sozial:**
- Soziale_Arbeit
- Bias_Ungleichheit
- Gender
- Diversitaet
- Feministisch
- Fairness

### Entscheidung

- Include: Technik >= 1 AND Sozial >= 1
- Exclude: Nicht relevant
- Unclear: Unsicher, Diskussion noetig

## Export-Anleitung

### CSV Export aus Google Sheets

1. Google Sheet oeffnen
2. File → Download → Comma Separated Values (.csv)
3. Datei speichern als: `assessment_YYYYMMDD.csv`
4. In `results/` Ordner kopieren

### Spalten-Mapping

| Google Sheets Spalte | CSV Spalte |
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
| Diversitaet | Diversitaet |
| Feministisch | Feministisch |
| Fairness | Fairness |
| Decision | Decision |
| Exclusion Reason | Exclusion_Reason |
| Notes | Notes |

### Werte

- Kategorien: `Ja` oder `Nein` (oder leer = Nein)
- Decision: `Include`, `Exclude`, `Unclear`

## Dateien

```
assessment/human/
├── README.md           # Diese Datei
├── schema.yaml         # Kategorie-Definitionen
└── results/
    └── assessment_YYYYMMDD.csv  # Exportierte Assessments
```

## Qualitaetssicherung

1. **Inter-Rater-Diskussion:** Bei Uneinigkeit zwischen Susi und Sabine
2. **Konsens-Entscheidung:** Dokumentiert in Notes-Spalte
3. **Unclear-Kategorie:** Fuer Papers die weitere Diskussion benoetigen

---

*Version: 1.0 (2026-02-02)*
