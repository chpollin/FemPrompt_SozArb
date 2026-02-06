# PDF Acquisition Guide

Hierarchische PDF-Akquise mit 8 Fallback-Strategien.

---

## Schnellstart

Das Script `pipeline/scripts/download_zotero_pdfs.py` (bzw. `acquire_pdfs.py`) akquiriert PDFs aus verschiedenen Quellen.

**Parameter:**
- `--input` - Excel oder JSON mit Paper-Metadaten
- `--output` - Zielverzeichnis fuer PDFs
- `--filter-decision` - Nur Papers mit bestimmter Decision (Include, Exclude, Unclear)

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

## Input-Formate

### Excel (empfohlen)

Spalten: Title, Authors, DOI, URL, Decision

### JSON

Array mit Objekten: title, authors, doi, url, decision

---

## Output

### Erfolgreiche PDFs

Dateiname-Format: `Author2024_TitleKeyword.pdf`

Speicherort: `pipeline/pdfs/`

### Logs

| Datei | Inhalt |
|-------|--------|
| `acquisition_log.json` | Detailliertes Log aller Versuche |
| `missing_pdfs.csv` | Fehlende PDFs mit DOIs |

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
4. In `pipeline/pdfs/` ablegen
5. Pipeline fortsetzen

---

## Troubleshooting

| Problem | Loesung |
|---------|---------|
| Zotero API 403 | CSV-Export aus Zotero verwenden |
| NaN URL | Wird automatisch behandelt (Type-Checking) |
| Timeout | Rate limiting aktivieren (2 Sekunden zwischen Requests) |

---

## Best Practices

1. **Test zuerst:** Mit `--limit 5` testen
2. **Filter nutzen:** `--filter-decision Include` spart Zeit
3. **Logs pruefen:** `acquisition_log.json` nach jedem Run
4. **Institutionell:** Fehlende PDFs manuell beschaffen

---

*Aktualisiert: 2026-02-06*
