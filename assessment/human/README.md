# Human Assessment

Manuelles Assessment durch Fachexpert:innen (Susi Sackl-Sharif, Sabine Klinger).

---

## Aktueller Stand

| Metrik | Wert |
|--------|------|
| Papers gesamt | 305 |
| Mit Decision | ~171 (56%) |
| Include | ~55 |
| Exclude | ~102 |
| Unclear | ~14 |

Aktuelle Datei: [results/assessment_20260218.xlsx](results/assessment_20260218.xlsx)

Google Sheets (live): [Link](https://docs.google.com/spreadsheets/d/1z-HQSwVFg-TtdP0xo1UH4GKLMAXNvvXSdySPSA7KUdM/)

---

## Assessment-Schema

Vollstaendige Kategorie-Definitionen: [../../benchmark/config/categories.yaml](../../benchmark/config/categories.yaml)

### 10 Binaere Kategorien

**Technik-Dimensionen:**
- AI_Literacies
- Generative_KI
- Prompting
- KI_Sonstige

**Sozial-Dimensionen:**
- Soziale_Arbeit
- Bias_Ungleichheit
- Gender
- Diversitaet / Intersektionalitaet
- Feministisch
- Fairness

### Entscheidungslogik

- **Include:** Mindestens 1 Technik-Kategorie = Ja UND mindestens 1 Sozial-Kategorie = Ja
- **Exclude:** Kriterien nicht erfuellt
- **Unclear:** Unsicher, Diskussion noetig

---

## Google Sheets Export fuer Benchmark

1. [Google Sheets oeffnen](https://docs.google.com/spreadsheets/d/1z-HQSwVFg-TtdP0xo1UH4GKLMAXNvvXSdySPSA7KUdM/)
2. Datei -> Herunterladen -> Comma-separated values (.csv)
3. Speichern als `benchmark/data/human_assessment.csv`

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
| Diversitaet / Intersektionalitaet | Diversitaet |
| Feministisch | Feministisch |
| Fairness | Fairness |
| Studientyp | Studientyp |
| Decision | Decision |
| Exclusion Reason | Exclusion_Reason |
| Notes | Notes |

Werte: Kategorien = `Ja` oder `Nein` (leer = Nein), Decision = `Include` / `Exclude` / `Unclear`

---

## Skripte

### Excel aus Zotero generieren

Erstellt eine neue formatierte Excel-Datei mit allen Papers (fuer Google Sheets Upload):

```bash
python assessment/human/create_thematic_assessment.py
```

### Ergebnisse nach Zotero exportieren

Schreibt die finalen Assessment-Entscheidungen als Tags zurueck in Zotero:

```bash
python assessment/human/excel_to_zotero_tags.py
```

---

## Qualitaetssicherung

- Bei Uneinigkeit: Inter-Rater-Diskussion (Susi + Sabine)
- Konsens-Entscheidung in Notes-Spalte dokumentieren
- Unclear-Kategorie fuer Papers die weitere Diskussion benoetigen

---

## Dateien

```
assessment/human/
├── README.md                          # Diese Datei
├── create_thematic_assessment.py      # Excel aus Zotero generieren
├── excel_to_zotero_tags.py            # Ergebnisse -> Zotero Tags
└── results/
    └── assessment_20260218.xlsx       # Aktuelles Assessment (exportiert 2026-02-18)
```

---

*Aktualisiert: 2026-02-18*
