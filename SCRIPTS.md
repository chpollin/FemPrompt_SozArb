# Python Scripts Reference

## Master Orchestrator

### run_pipeline.py
**Funktion:** Koordiniert alle fünf Verarbeitungsstufen der Pipeline.

**Features:**
- Checkpoint-basierte Wiederaufnahme nach Unterbrechungen
- Selektive Stage-Aktivierung (nur bestimmte Stufen ausführen)
- Stage-Überspringen (bestimmte Stufen auslassen)
- Dry-Run-Modus zur Vorschau
- Farbcodierte Konsolenausgabe mit Statustracking
- JSON-basierte Statusverfolgung in .pipeline_status.json

**Verwendung:**
```bash
python run_pipeline.py                    # Vollständige Pipeline
python run_pipeline.py --resume           # Nach Unterbrechung fortsetzen
python run_pipeline.py --stages acquire_pdfs,convert_pdfs  # Nur bestimmte Stages
python run_pipeline.py --skip summarize   # Stage überspringen
python run_pipeline.py --dry-run          # Vorschau ohne Ausführung
```

**Benötigt:** Alle anderen Skripte, pipeline_config.yaml, GEMINI_API_KEY

---

## PDF-Akquisition

### getPDF_intelligent.py
**Funktion:** Lädt PDFs durch hierarchische Fallback-Strategien herunter.

**Strategien (in Reihenfolge):**
1. Zotero lokale Attachments (schnellste Methode)
2. DOI-Resolution über CrossRef API
3. ArXiv-ID-Extraktion und -Download
4. Semantic Scholar API für Open-Access-Versionen
5. Unpaywall-Integration
6. BASE Academic Search
7. Verlagsspezifische Parser
8. URL-basierte Direktsuche

**Output:**
- PDFs in analysis/pdfs/
- acquisition_log.json mit Erfolgen/Fehlern
- missing_pdfs.csv für manuelle Nachbearbeitung

**Verwendung:**
```bash
python analysis/getPDF_intelligent.py
python analysis/getPDF_intelligent.py --api-key KEY --library-id ID  # Mit Zotero API
```

**Benötigt:** zotero_vereinfacht.json, Internetverbindung

---

### getPDF.py
**Status:** DEPRECATED - Legacy-Version ohne intelligente Fallbacks.

**Empfehlung:** Verwende getPDF_intelligent.py stattdessen.

---

## Dokumentenkonversion

### pdf-to-md-converter.py
**Funktion:** Konvertiert PDFs zu strukturiertem Markdown mit Docling.

**Features:**
- Strukturerhaltung (Überschriften, Listen, Tabellen, Zitationen)
- MD5-Hash-basierte Duplikaterkennung
- Metadaten-Tracking in conversion_metadata.json
- Fehlertoleranz (problematische PDFs isolieren)
- Normalisierte Dateinamen

**Output:**
- Markdown-Dateien in analysis/markdown_papers/
- conversion_metadata.json mit Verarbeitungsstatus

**Verwendung:**
```bash
python analysis/pdf-to-md-converter.py
```

**Benötigt:** PDFs in analysis/pdfs/, optional docling installiert

---

## KI-gestützte Analyse

### summarize-documents.py
**Funktion:** Generiert strukturierte Zusammenfassungen mit Gemini 2.5 Flash.

**5-Stufen-Workflow:**
1. Akademische Analyse (Forschungsfrage, Methodik, Ergebnisse)
2. Strukturierte Synthese (500 Wörter)
3. Kritische Validierung (Konsistenzprüfung)
4. Bereinigte Zusammenfassung (150 Wörter)
5. Metadaten-Extraktion (YAML-Format)

**Features:**
- Temperature 0.3 für Konsistenz
- 10-Sekunden Rate-Limiting (konfigurierbar)
- Batch-Metadaten-Tracking
- Retry-Logik für transiente Fehler
- Verarbeitungszeit: ~120 Sekunden pro Dokument

**Output:**
- Summaries in analysis/summaries_final/
- batch_metadata.json mit Performance-Metriken

**Verwendung:**
```bash
python analysis/summarize-documents.py
```

**Benötigt:** GEMINI_API_KEY, Markdown in analysis/markdown_papers/

---

## Obsidian-Vault-Generierung

### generate_obsidian_vault_improved.py
**Funktion:** Erstellt navigierbare Obsidian Knowledge Base aus Summaries.

**Features:**
- Pattern-basierte Konzeptextraktion
- Synonym-Mapping-Dictionary (180 Einträge)
- Fuzzy-Matching-Deduplizierung
- Frequenz-basierte Filterung (min_frequency=2)
- Frequency-Caps für generische Begriffe
- Intersektionale Konsolidierung
- Kategorisierung: Bias Types (14), Mitigation Strategies (21)

**Output:**
- FemPrompt_Vault/Papers/ (Paper-Notizen)
- FemPrompt_Vault/Concepts/ (Konzept-Notizen)
- FemPrompt_Vault/MASTER_MOC.md (Navigationsindex)

**Verwendung:**
```bash
python analysis/generate_obsidian_vault_improved.py
```

**Benötigt:** Summaries in analysis/summaries_final/

---

### test_vault_quality.py
**Funktion:** Validiert Obsidian-Vault systematisch.

**Metriken:**
- Konzept-Uniqueness (Ziel: >95%)
- Metadata-Completeness (Ziel: 100%)
- Link-Integrity (broken links)
- Network-Connectivity (isolierte Komponenten)
- Gesamtscore-Berechnung

**Output:**
- Farbcodierter Konsolenreport
- vault_test_report.json (optional)

**Verwendung:**
```bash
python analysis/test_vault_quality.py
```

**Benötigt:** FemPrompt_Vault/ existiert

---

## Assessment-Workflow

### zotero_to_excel.py
**Funktion:** Exportiert Zotero-Bibliothek direkt zu Excel-Assessment-Template.

**Features:**
- Direkte Zotero API-Integration via pyzotero
- PRISMA-konforme Spaltenstruktur
- Vordefinierte Bewertungskategorien
- Conditional Formatting in Excel
- Datenvalidierung für konsistente Eingaben

**Output:**
- assessment.xlsx mit strukturierten Bewertungsspalten

**Verwendung:**
```bash
python analysis/zotero_to_excel.py -o assessment.xlsx
python analysis/zotero_to_excel.py --api-key KEY --library-id ID -o output.xlsx
```

**Benötigt:** ZOTERO_API_KEY (optional), zotero_vereinfacht.json

---

### ris_to_excel.py
**Funktion:** Konvertiert RIS-Dateien zu Excel-Assessment-Template.

**Features:**
- RIS-Parser für bibliographische Metadaten
- Excel-Generierung mit Validierung
- Conditional Formatting
- Matching-Algorithmus für Zotero-Abgleich

**Verwendung:**
```bash
python analysis/ris_to_excel.py input.ris -o assessment.xlsx
```

**Benötigt:** RIS-Datei als Input

---

### ris_to_excel_optimized.py
**Funktion:** Optimierte Version mit 13-Spalten-Format.

**Verbesserungen:**
- Schnellere Verarbeitung
- Erweiterte Matching-Algorithmen
- Bessere Excel-Formatierung

**Verwendung:**
```bash
python analysis/ris_to_excel_optimized.py input.ris -o assessment.xlsx
```

---

### excel_to_ris.py
**Funktion:** Führt Excel-Bewertungen zurück in RIS-Format.

**Features:**
- DOI/Title-basiertes Matching
- PRISMA-Tag-Enrichment (Include/Exclude/Unclear)
- Ausschlussgründe als Custom Fields
- Roundtrip-Validierung

**Output:**
- Angereicherte RIS-Datei mit Assessment-Tags

**Verwendung:**
```bash
python analysis/excel_to_ris.py assessment.xlsx bibliography.ris -o enriched.ris
```

**Benötigt:** Ausgefüllte assessment.xlsx, Original-RIS

---

### test_assessment_workflow.py
**Funktion:** Testet Excel↔RIS Roundtrip-Integrität.

**Tests:**
- RIS→Excel→RIS Konsistenz
- Datentyp-Validierung
- Matching-Algorithmus-Genauigkeit
- Mock-Data-Generierung

**Verwendung:**
```bash
python analysis/test_assessment_workflow.py
```

---

## Workflow-Zusammenfassung

```
1. zotero_to_excel.py       → Excel-Template generieren
2. [Manuelle Bewertung]     → assessment.xlsx ausfüllen
3. excel_to_ris.py          → Bewertungen zurück zu RIS
4. [Zotero Re-Import]       → Optional: Enriched RIS in Zotero
5. getPDF_intelligent.py    → PDFs herunterladen
6. pdf-to-md-converter.py   → PDFs zu Markdown konvertieren
7. summarize-documents.py   → KI-Summaries generieren
8. generate_obsidian_vault_improved.py → Wissensgraph erstellen
9. test_vault_quality.py    → Qualität validieren
```

## Abhängigkeiten

Alle Skripte benötigen:
```bash
pip install -r requirements.txt
```

Spezifische Requirements:
- **summarize-documents.py:** GEMINI_API_KEY Environment-Variable
- **zotero_to_excel.py:** pyzotero, optional ZOTERO_API_KEY
- **pdf-to-md-converter.py:** docling (optional aber empfohlen)
- **Assessment-Skripte:** pandas, openpyxl, xlsxwriter

## Konfiguration

Alle Pfade und Parameter in `pipeline_config.yaml` konfigurierbar.
