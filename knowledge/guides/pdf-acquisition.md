# PDF Acquisition Guide

Hierarchische PDF-Akquise mit 8 Fallback-Strategien.

---

## Schnellstart

```bash
python analysis/getPDF_intelligent.py \
  --input assessment.xlsx \
  --output analysis/pdfs/ \
  --filter-decision Include
```

---

## Fallback-Strategien

Das Script versucht die folgenden Quellen in dieser Reihenfolge:

| # | Strategie | Beschreibung |
|---|-----------|--------------|
| 1 | Zotero Attachments | Lokale PDFs aus Zotero |
| 2 | DOI via CrossRef | Direkter DOI-Link |
| 3 | ArXiv | Preprint-Server |
| 4 | Unpaywall | Open Access Versionen |
| 5 | Semantic Scholar | Akademische Suchmaschine |
| 6 | BASE | Bielefeld Academic Search Engine |
| 7 | Publisher-Parser | Direkter Publisher-Zugang |
| 8 | URL-Suche | Fallback auf URL-Feld |

---

## Parameter

```bash
python analysis/getPDF_intelligent.py \
  --input <input-file>           # Excel oder JSON
  --output <output-dir>          # Zielverzeichnis
  --filter-decision <decision>   # Include, Exclude, Unclear
  --limit <n>                    # Nur erste n Papers
  --skip-existing                # Existierende ueberspringen
```

---

## Input-Formate

### Excel (empfohlen)

```
| Title | Authors | DOI | URL | Decision |
|-------|---------|-----|-----|----------|
| ...   | ...     | ... | ... | Include  |
```

### JSON

```json
[
  {
    "title": "...",
    "authors": "...",
    "doi": "10.1234/...",
    "url": "https://...",
    "decision": "Include"
  }
]
```

---

## Output

### Erfolgreiche PDFs

```
analysis/pdfs/
  Author2024_TitleKeyword.pdf
  Smith2023_MachineLearning.pdf
  ...
```

### Logs

```
acquisition_log.json     # Detailliertes Log
missing_pdfs.csv         # Fehlende PDFs mit DOIs
```

---

## Erfolgsraten

| Quelle | Typische Rate |
|--------|---------------|
| Zotero lokal | 30-40% |
| DOI + Unpaywall | 20-30% |
| ArXiv | 10-20% |
| Gesamt | 70-85% |

---

## Fehlende PDFs beschaffen

1. `missing_pdfs.csv` oeffnen
2. DOIs in institutionellem Zugang suchen
3. Manuell herunterladen
4. In `analysis/pdfs/` ablegen
5. Pipeline fortsetzen

---

## Troubleshooting

### Zotero API 403

```
Workaround: CSV-Export aus Zotero verwenden
```

### NaN URL

Bereits gefixt mit Type-Checking:
```python
if not url or not isinstance(url, str):
    url = ''
```

### Timeout

Rate limiting aktivieren:
```python
time.sleep(2)  # Zwischen Requests
```

---

## Best Practices

1. **Test zuerst:** Mit `--limit 5` testen
2. **Filter nutzen:** `--filter-decision Include` spart Zeit
3. **Logs pruefen:** `acquisition_log.json` nach jedem Run
4. **Institutionell:** Fehlende PDFs manuell beschaffen

---

*Version: 2.0 (2026-02-02)*
