# Manual Review Checklist for PDF-to-Markdown Conversion

**Zweck:** Strukturierte Qualitätsprüfung von konvertierten Markdown-Dokumenten

---

## Dokument-Information

| Feld | Wert |
|------|------|
| **Dateiname** | |
| **PDF-Quelle** | |
| **Reviewer** | |
| **Datum** | |
| **Konfidenz-Score** | /100 |
| **Automatischer Status** | PASS / WARNING / FAIL |

---

## 1. Strukturelle Integrität

### 1.1 Metadaten

- [ ] **Titel** korrekt extrahiert (vergleiche mit PDF)
- [ ] **Autoren** korrekt (falls erkennbar)
- [ ] **Jahr** korrekt (falls erkennbar)

### 1.2 Akademische Struktur

- [ ] **Abstract** vorhanden und vollständig
- [ ] **Introduction** erkennbar
- [ ] **Methodology/Methods** erkennbar (falls im Original)
- [ ] **Results** erkennbar (falls im Original)
- [ ] **Discussion** erkennbar (falls im Original)
- [ ] **Conclusion** vorhanden
- [ ] **References/Literaturverzeichnis** vorhanden

### 1.3 Sektions-Hierarchie

- [ ] Überschriften als Markdown-Headers formatiert (##, ###)
- [ ] Hierarchie logisch (keine h4 ohne h3)
- [ ] Keine verwaisten Überschriften

---

## 2. Inhaltliche Vollständigkeit

### 2.1 Text-Integrität

- [ ] **Erster Absatz** nach Abstract lesbar und kohärent
- [ ] **Letzter Absatz** (Conclusion) lesbar und vollständig
- [ ] **Stichprobe Mitte** (beliebiger Absatz) kohärent

### 2.2 Keine offensichtlichen Lücken

- [ ] Keine abrupt endenden Sätze
- [ ] Keine fehlenden Seiten erkennbar
- [ ] Seitenübergänge sauber (keine Page-Break-Artefakte)

### 2.3 Sprachqualität

- [ ] Umlaute korrekt (ä, ö, ü, ß für deutsche Texte)
- [ ] Akzente korrekt (é, è, ñ für andere Sprachen)
- [ ] Anführungszeichen konsistent

---

## 3. Tabellen-Qualität

### 3.1 Vollständigkeit

- [ ] Anzahl Tabellen entspricht PDF (±2 Toleranz)
- [ ] Wichtige Datentabellen vorhanden

### 3.2 Formatierung

- [ ] **Tabellen-Header** lesbar
- [ ] **Spalten** korrekt ausgerichtet
- [ ] **Daten** vollständig (keine fehlenden Zellen)
- [ ] **Captions** vorhanden (falls im Original)

### 3.3 Inhalt

- [ ] Numerische Werte korrekt (Stichprobe)
- [ ] Keine Zellen mit "GLYPH<>" oder Artefakten

---

## 4. Text-Qualität

### 4.1 Konvertierungs-Artefakte

- [ ] Keine exzessiven **GLYPH<>** Placeholder
- [ ] Keine seltsamen **Zeichenfolgen** (z.B. ➀➁➂)
- [ ] Keine **OCR-typischen Fehler** (l/1/I Verwechslung)

### 4.2 Layout-Artefakte

- [ ] Keine wiederholten **Header/Footer** im Text
- [ ] Keine **Seitenzahlen** im Fließtext
- [ ] Keine **Spalten-Vermischung** (Text springt nicht zwischen Spalten)

### 4.3 Hyphenation

- [ ] **Silbentrennung** korrekt aufgelöst (kein "Metho-dology")
- [ ] Keine zeilenübergreifenden Wortfragmente

---

## 5. Spezielle Elemente

### 5.1 Abbildungen

- [ ] Abbildungen als Placeholder markiert (<!-- image --> oder [Figure X])
- [ ] **Figure Captions** vorhanden und lesbar
- [ ] Verweis im Text stimmt mit Abbildungsnummer überein

### 5.2 Formeln (falls vorhanden)

- [ ] Mathematische Formeln lesbar
- [ ] Variablen erkennbar
- [ ] Indizes/Exponenten korrekt

### 5.3 Zitationen

- [ ] **In-text Citations** erkennbar ([1], (Author, 2024))
- [ ] Zitationsformat konsistent
- [ ] Keine fragmentierten Zitationen

---

## 6. Gesamtbewertung

### Zusammenfassung der Probleme

| Kategorie | Anzahl Issues | Schweregrad |
|-----------|---------------|-------------|
| Struktur | | Gering / Mittel / Hoch |
| Vollständigkeit | | Gering / Mittel / Hoch |
| Tabellen | | Gering / Mittel / Hoch |
| Artefakte | | Gering / Mittel / Hoch |
| Spezielle Elemente | | Gering / Mittel / Hoch |

### Finale Bewertung

- [ ] **PASS** - Dokument uneingeschränkt für LLM-Summarisierung geeignet
- [ ] **PASS MIT ISSUES** - Dokument nutzbar, aber mit bekannten kleineren Mängeln
- [ ] **FAIL** - Dokument benötigt Rekonvertierung oder manuelle Korrektur

### Empfohlene Aktion

- [ ] Keine Aktion nötig
- [ ] Bekannte Issues dokumentieren, aber weiterverarbeiten
- [ ] Tabellen manuell prüfen
- [ ] Rekonvertierung mit anderen Einstellungen
- [ ] Manuelles Editing erforderlich
- [ ] PDF-Quelle prüfen (Qualität, Scan vs. Digital)

---

## Notizen

*Freitext für spezifische Beobachtungen, Kontext oder Empfehlungen:*

---

---

*Checklist Version 1.0 | Erstellt: 2026-02-03*

---

## Anhang: Review-Tool Workflow

### Tool: `pipeline/tools/markdown_reviewer.html`

**Starten:**
1. VS Code: Rechtsklick auf Datei → "Open with Live Server"
2. Oder: `npx live-server pipeline/tools/`

### Keyboard-Shortcuts

| Taste | Aktion |
|-------|--------|
| `1` | PASS - Dokument OK |
| `2` | WARN - Dokument mit Issues |
| `3` | FAIL - Dokument unbrauchbar |
| `0` | **Reset** - Status zurücksetzen |
| `←` `→` | Navigation |
| `L` | Liste ein/ausblenden |
| `S` | Sync-Scroll toggle |

### Datenpersistenz

| Speicherort | Beschreibung |
|-------------|--------------|
| `localStorage` (Browser) | Automatisch, sessionübergreifend |
| Export (JSON) | Manuell via "Export" Button |
| Import (JSON) | Manuell via "Import" Button |

### Empfohlener Workflow

1. **Review durchführen:**
   - Tool öffnen mit Live Server
   - Dokumente mit 1/2/3 bewerten
   - Bei Fehler: `0` drücken zum Reset

2. **Ergebnisse sichern:**
   - "Export" klicken
   - Speichern als: `pipeline/validation_reports/human_review_YYYY-MM-DD.json`

3. **Session fortsetzen:**
   - Tool erneut öffnen (LocalStorage bleibt)
   - Oder: "Import" → vorherige JSON laden

### JSON-Format (Export)

Das Export-Format enthaelt:
- **date**: Zeitstempel des Exports
- **summary**: Zaehler fuer pass, warn, fail, pending
- **total**: Gesamtanzahl Dokumente
- **reviews**: Objekt mit Dateiname → Status-Zuordnung

### Integration mit Claude

Claude kann die exportierte JSON-Datei lesen und analysieren.

**Speicherort:** `pipeline/validation_reports/human_review_YYYY-MM-DD.json`

**Moegliche Analysen:**
- Problematische Dokumente identifizieren (WARN/FAIL)
- Statistiken berechnen
- Empfehlungen fuer Rekonvertierung geben
