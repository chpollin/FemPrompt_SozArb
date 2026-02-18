# Forum Wissenschaft Paper - Arbeitsplan

**Stand:** 18. Februar 2026
**Deadline:** 4. Mai 2026 (75 Tage)

**Aktueller Status:** M1-M7 abgeschlossen. Paper v0.4: 17.975 Zeichen. Naechste Phase: Review-Runde Co-Autor:innen (M8).

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

### Phase 2: Assessment (Abgeschlossen)

| Track | Methode | Status | Verantwortlich |
|-------|---------|--------|----------------|
| Human | Google Sheets manuell | Abgeschlossen (210/326 mit Decision) | Susi, Sabine |
| LLM (10K) | Claude Haiku 4.5 | Abgeschlossen (326/326, $1.44) | Christopher |

### Phase 3: Benchmark (Abgeschlossen)

| Schritt | Script | Status |
|---------|--------|--------|
| Assessments zusammenfuehren | `merge_assessments.py` | Abgeschlossen (210 Papers) |
| Agreement berechnen | `calculate_agreement.py` | Abgeschlossen (κ = 0,035) |
| Disagreements analysieren | `analyze_disagreements.py` | Abgeschlossen (111 Faelle) |

**Output:** `benchmark/results/agreement_metrics.json` -- Cohen's Kappa 0,035, Konfusionsmatrix, Kategorie-Kappas

### Phase 4: Paper (Abgeschlossen, Review offen)

| Schritt | Status |
|---------|--------|
| Paper v0.4 | Fertig -- 17.975 Zeichen (Limit 18.000) |
| Obsidian Vault | Ausstehend (Nice-to-Have) |
| GitHub Pages SPA | Implementiert, Aktivierung manuell |

---

## Offene Aufgaben

### Erledigt

- [x] Stichproben-Review mit Browser-Tool
- [x] Human-Assessment exportiert (210/326 mit Decision)
- [x] 10K LLM-Assessment ausgefuehrt (326/326, $1.44)
- [x] Benchmark-Skripte ausgefuehrt (κ = 0,035)
- [x] Disagreement-Faelle analysiert (111 Faelle, 3 Muster identifiziert)
- [x] Benchmark-Ergebnisse ins Paper eingearbeitet

### Paper-Entwicklung (im Repo, iterativ)

**Zentrale Datei:** `knowledge/paper/paper-draft.md`
**Google Docs ist nicht mehr relevant -- Paper wird ausschliesslich im Repo iteriert.**

- [x] Grundstruktur mit epistemischer Infrastruktur als Leitkonzept
- [x] Ergebnisse einarbeiten (Benchmark-Metriken, Jagged Frontier, qualitative Beispiele)
- [x] Zeichenzaehlung: 17.975 Zeichen (Limit 18.000, Differenz +25)
- [ ] Finale Review mit Co-Autor:innen (M8, naechster Schritt)
- [ ] Einreichung 4. Mai 2026

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

## Benchmark-Ergebnisse (Endstand)

| Metrik | Wert |
|--------|------|
| Papers mit beiden Assessments | 210 |
| Cohen's Kappa (gesamt) | 0,035 ("slight") |
| Gesamtuebereinstimmung | 47,1 % |
| LLM Include-Rate | 71 % (232/326) |
| Human Include-Rate | 42 % (88/210) |
| Disagreements gesamt | 111 Faelle |
| Kategorie-Kappa best | +0,075 (Feministisch) |
| Kategorie-Kappa worst | -0,163 (Fairness) |

**Interpretation:** Jagged Frontier -- LLM uebermenschlich bei "Fairness" (73 % Ja vs. Human 52 %), untermenschlich bei "Gender" (36 % Ja vs. Human 63 %). Die epistemische Grenzlinie ist nicht intuitiv vorhersagbar.

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

---

## Paper-Gliederung (Endstand v0.4)

```
1. Einleitung (~2.284 Zeichen) -- Fertig
2. Epistemische Asymmetrie (~3.014 Zeichen) -- Fertig (inkl. Jagged Frontier)
3. Epistemische Infrastruktur (~3.126 Zeichen) -- Fertig
4. Methodik (~3.091 Zeichen) -- Fertig
5. Ergebnisse (~3.445 Zeichen) -- Fertig (inkl. qualitative Beispiele)
6. Diskussion (~1.927 Zeichen) -- Fertig
7. Fazit (~1.088 Zeichen) -- Fertig
Gesamt: 17.975 Zeichen (Limit: 18.000)
```
