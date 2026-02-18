# Forum Wissenschaft Paper - Arbeitsplan

**Stand:** 18. Februar 2026
**Deadline:** 4. Mai 2026 (75 Tage)

---

## Rahmenbedingungen

| Parameter | Wert |
|-----------|------|
| Umfang | 18.000 Zeichen |
| Format | Wissenschaftlich-journalistisch |
| Zitierweise | Fussnoten (kein Literaturverzeichnis) |
| Zielgruppe | Wenig KI-Vorwissen |
| Autor:innen | Christopher Pollin, Susanne Sackl-Sharif, Sabine Klinger, Christian Steiner |

---

## Forschungsfrage

> Wie reliabel ist LLM-basiertes Literatur-Assessment im Vergleich zu Expert:innen-Bewertung bei einem interdisziplinaeren, feministisch-technischen Forschungsfeld?

---

## Projektziel (Gesamtprojekt)

**Primaer:** Systematischer Literature Review zu feministischer AI Literacy und LLM-Bias - empirische Grundlage fuer weitere Forschung.

**Sekundaer (dieses Paper):** Methodische Innovation dokumentieren - Vergleich Human vs. Agent Assessment.

---

## Zielgruppe

| Zielgruppe | Nutzen |
|------------|--------|
| Forscher:innen (Soziale Arbeit + KI) | Strukturierte Literaturuebersicht |
| Praktiker:innen (Soziale Arbeit) | Evidenzbasis fuer LLM-Nutzung |
| Lehrende (AI Literacy) | Kursmaterial, Konzepte |

---

## Erfolgskriterien

### Must-Have

| Kriterium | Messbar |
|-----------|---------|
| Literature Review abgeschlossen | 326 Papers kategorisiert |
| Paper eingereicht | 4. Mai 2026 |
| Assessment-Daten vorhanden | Human + Agent komplett |

### Should-Have

| Kriterium | Messbar |
|-----------|---------|
| Benchmark-Metriken | Cohen's Kappa berechnet |
| Obsidian Vault | Vernetzte Wissensbasis |

---

## Nicht-Ziele

- Fertiger Prompting-Leitfaden (nachgelagerte Phase)
- Tool fuer Endnutzer:innen
- Vollstaendige Automatisierung
- Training eigener Modelle

---

## Korpus

| Aspekt | Wert |
|--------|------|
| Papers gesamt | 326 (Zotero Group 6080294) |
| PDFs heruntergeladen | 257 |
| Markdown konvertiert | 252 (98.1%) |
| Assessment-Schema | 10 binaere Kategorien |

---

## Pipeline-Status

### Phase 1: Datenakquise (Abgeschlossen)

| Schritt | Status | Ergebnis |
|---------|--------|----------|
| Zotero-Export | Fertig | 326 Papers |
| PDF-Download | Fertig | 257 PDFs |
| Markdown-Konversion (Docling) | Fertig | 252 Dateien |
| Validierung | Fertig | 98.7 Konfidenz-Score |
| Post-Processing | Fertig | 107k Zeichen bereinigt |
| PDF-zu-JPG (Sync-Scroll) | Fertig | ~4000 Seiten |
| Review-Tool | Fertig | Browser-basiert mit Import/Export |

### Phase 2: Assessment (In Arbeit)

| Track | Methode | Status | Verantwortlich |
|-------|---------|--------|----------------|
| Human | Google Sheets manuell | In Arbeit | Susi, Sabine |
| Agent | Claude Haiku 4.5 | Bereit | Christopher |

**Blocker:** Human-Assessment muss abgeschlossen sein vor Benchmark.

### Phase 3: Benchmark (Wartet)

| Schritt | Script | Status |
|---------|--------|--------|
| Assessments zusammenfuehren | `merge_assessments.py` | Wartet |
| Agreement berechnen | `calculate_agreement.py` | Wartet |
| Disagreements analysieren | `analyze_disagreements.py` | Wartet |

**Output:** Cohen's Kappa, Konfusionsmatrix, Disagreement-Faelle

### Phase 4: Synthese (Wartet)

| Schritt | Status |
|---------|--------|
| LLM-Summarisierung | ⏸️ Wartet auf Stichproben-Review |
| Obsidian Vault | Wartet |

---

## Offene Aufgaben

### Sofort (diese Woche)

- [ ] Stichproben-Review mit Browser-Tool (~25 Dokumente, 10%)
- [ ] Human-Assessment Status bei Susi/Sabine erfragen

### Nach Human-Assessment

- [ ] LLM-Assessment Vollauf (326 Papers, ~$1.30)
- [ ] Human-Assessment aus Google Sheets exportieren
- [ ] Benchmark-Skripte ausfuehren
- [ ] Disagreement-Faelle qualitativ analysieren

### Paper-Entwicklung (im Repo, iterativ)

**Zentrale Datei:** `knowledge/paper/paper-draft.md`
**Google Docs ist nicht mehr relevant -- Paper wird ausschliesslich im Repo iteriert.**

- [x] Grundstruktur mit epistemischer Infrastruktur als Leitkonzept
- [ ] Ergebnisse einarbeiten (nach Benchmark)
- [ ] Zeichenzaehlung pruefen und kuerzen
- [ ] Finale Review mit Co-Autor:innen

---

## Paper-Gliederung

```
1. Einleitung (~2.500 Zeichen)
   - KI veraendert wissenschaftliche Wissensproduktion
   - Forschungsfrage: Wie reliabel ist LLM-Assessment?

2. Kontext: Feministische AI Literacies (~2.000 Zeichen)
   - Arbeitsdefinition
   - Soziale Arbeit als Anwendungsfeld

3. Methodik (~4.000 Zeichen)
   - Dual-Track-Design (Human vs. Agent)
   - 10-Kategorien-Schema
   - Benchmark-Metriken

4. Ergebnisse (~5.000 Zeichen)
   - Quantitativer Vergleich (Kappa, Uebereinstimmung)
   - Wo Divergenz, warum
   - Epistemische Asymmetrien

5. Diskussion (~3.000 Zeichen)
   - Co-Intelligence: Staerken und Grenzen
   - Abhaengigkeit von proprietaeren Systemen

6. Fazit (~1.500 Zeichen)
   - Praktische Empfehlungen
```

---

## Benchmark-Erwartungen

| Metrik | Beschreibung |
|--------|--------------|
| Cohen's Kappa | Uebereinstimmung bereinigt um Zufall |
| Gesamtuebereinstimmung | % identische Include/Exclude |
| Kategorie-Uebereinstimmung | Pro Kategorie (10x) |
| Konfusionsmatrix | Human x Agent (Include/Exclude) |
| Disagreement-Faelle | Qualitative Analyse fuer Paper |

---

## Technische Infrastruktur

### Scripts (bereit)

| Script | Zweck |
|--------|-------|
| `benchmark/scripts/run_llm_assessment.py` | LLM-Assessment ausfuehren |
| `benchmark/scripts/merge_assessments.py` | Human + Agent zusammenfuehren |
| `benchmark/scripts/calculate_agreement.py` | Kappa berechnen |
| `benchmark/scripts/analyze_disagreements.py` | Divergenzen analysieren |

### Tools (bereit)

| Tool | Zweck |
|------|-------|
| `pipeline/tools/markdown_reviewer.html` | Stichproben-Review |
| Google Sheets | Human-Assessment |

---

## Ressourcen

| Ressource | Link/Pfad |
|-----------|-----------|
| Repository | github.com/chpollin/FemPrompt_SozArb |
| Google Sheets | [Thematisches Assessment](https://docs.google.com/spreadsheets/d/1z-HQSwVFg-TtdP0xo1UH4GKLMAXNvvXSdySPSA7KUdM/) |
| Zotero Group | 6080294 |
| Dokumentation | `knowledge/` |

---

## Team

| Person | Rolle | Aufgabe aktuell |
|--------|-------|-----------------|
| Christopher Pollin | Technische Umsetzung | Pipeline, Benchmark-Scripts |
| Susi Sackl-Sharif | Human-Assessment | Google Sheets bewerten |
| Sabine Klinger | Human-Assessment | Google Sheets bewerten |
| Christian Steiner | Paper-Review | Finalisierung |
| Christina | Zotero-Kuratierung | Abgeschlossen |

---

## Kernbotschaft

1. **Deep Research funktioniert** fuer breite Literaturidentifikation
2. **Expert:innenwissen bleibt unverzichtbar** fuer Qualitaetsurteil
3. **Transparenz** ueber den Prozess ist wissenschaftliche Pflicht
4. **Benchmark quantifiziert** wo LLM-Assessment zuverlaessig ist

---

*Aktualisiert: 2026-02-18*
