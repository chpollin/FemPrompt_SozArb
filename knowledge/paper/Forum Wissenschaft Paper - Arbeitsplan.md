---
type: knowledge
created: 2026-02-02
tags: [workflow, research, original]
status: draft
---

# Forum Wissenschaft Paper - Arbeitsplan

## Summary

Arbeitsplan für das Paper "Deep-Research-gestützte Literature Reviews im Praxistest" für Forum Wissenschaft (Ausgabe 2/2026). Das Paper dokumentiert den Vergleich zwischen LLM-gestützter und menschlicher Literature Review am Beispiel feministischer AI Literacies in der Sozialen Arbeit.

## Rahmenbedingungen

| Parameter | Wert |
|-----------|------|
| Deadline | 4. Mai 2026 |
| Umfang | 18.000 Zeichen |
| Format | Wissenschaftlich-journalistisch |
| Zitierweise | Fußnoten (kein Literaturverzeichnis) |
| Zielgruppe | Wenig KI-Vorwissen |
| Autor:innen | Christopher Pollin, Susanne Sackl-Sharif, Sabine Klinger, Christian Steiner |

## Aktueller Stand (2. Februar 2026)

### FemPrompt Literature Review

| Phase | Status | Details |
|-------|--------|---------|
| Deep Research | ✅ Abgeschlossen | 303 Papers identifiziert (4 LLM-Modelle) |
| Thematisches Assessment | 🔄 Läuft | Susi & Sabine via Google Sheets |
| Kategoriendefinition | ⚠️ Abstimmung nötig | Meeting mit Susi diese Woche |
| PDF-Akquise | ⏸️ Wartet | Blockiert durch Assessment |
| Markdown-Konversion | ⏸️ Wartet | Pipeline bereit |
| LLM-Summarisierung | ⏸️ Wartet | Pipeline bereit |
| Obsidian Vault | ⏸️ Wartet | Pipeline bereit |

### Repository-Status

GitHub: `chpollin/FemPrompt_SozArb`

- 33 Python-Scripts im `analysis/` Ordner
- 5-Stage Pipeline implementiert und getestet
- SozArb-Vault operativ (266 Papers, 144 Konzepte) — als Referenz verfügbar

### Benchmark-Komponente (geplant)

Das Repository enthält einen eingebauten Benchmark für den Human-LLM-Vergleich:

```
benchmark/
├── README.md                    # Methodenbeschreibung
├── data/
│   ├── human_assessment.csv     # Export Google Sheets
│   ├── llm_assessment.csv       # Export assessment-llm/
│   └── merged_comparison.csv    # Vereinigt (Paper-ID als Key)
├── scripts/
│   ├── merge_assessments.py     # Zusammenführung
│   ├── calculate_agreement.py   # Kappa, Übereinstimmung
│   └── analyze_disagreements.py # Qualitative Divergenzanalyse
└── results/
    ├── agreement_metrics.json   # Quantitative Ergebnisse
    └── disagreement_cases.csv   # Fälle für Paper
```

**Erwartete Metriken:**
- Gesamtübereinstimmung und Cohen's Kappa
- Übereinstimmung nach Kategorie (explizit feminist, intersektional, deutschsprachig)
- Konfusionsmatrix (Human Include/Exclude × LLM Include/Exclude)
- Qualitative Analyse der Disagreement-Fälle

## Offene Aufgaben

### Blocker (vor Pipeline-Ausführung)

> [!warning] BLOCKER: Thematisches Assessment
> Das menschliche Assessment durch Susi und Sabine muss abgeschlossen sein, bevor die Pipeline für FemPrompt ausgeführt werden kann. Die Kategoriendefinitionen wurden überarbeitet und müssen im Meeting abgestimmt werden.

1. **Meeting mit Susi** (diese Woche)
   - Überarbeitete Kategoriendefinitionen besprechen
   - Bewertungskriterien finalisieren
   - Timeline für Assessment-Abschluss klären

2. **Assessment abschließen** (Susi & Sabine)
   - 303 Papers bewerten
   - Include/Exclude-Entscheidungen dokumentieren
   - Inter-Rater-Diskussion bei Uneinigkeit

### Nach Assessment-Abschluss

3. **Metadata in Zotero ergänzen**
   - PDF-Links hinzufügen
   - Fehlende Metadaten vervollständigen

4. **Pipeline ausführen**
   ```
   PDF-Akquise → Markdown-Konversion → Summarisierung → Vault-Generierung
   ```

5. **Benchmark ausführen** (Human-LLM Assessment Comparison)
   - Human-Assessment aus Google Sheets exportieren
   - LLM-Assessment aus `assessment-llm/` exportieren
   - Merge-Skript ausführen → `merged_comparison.csv`
   - Übereinstimmungsmetriken berechnen (Cohen's Kappa)
   - Disagreement-Analyse für qualitative Auswertung

### Paper-Entwicklung

6. **Textbausteine entwickeln** (parallel möglich)
   - Methodenbeschreibung (bereits im Abstract)
   - Theoretischer Rahmen (Co-Intelligence, PRISMA)
   - Reflexion über epistemische Grenzen

7. **Ergebnisse einarbeiten**
   - Nach Pipeline-Abschluss
   - Quantitative Vergleichsdaten
   - Qualitative Beobachtungen

8. **Finalisierung**
   - Auf 18.000 Zeichen kürzen
   - Fußnoten formatieren
   - Co-Autor:innen-Review

## Paper-Gliederung (Entwurf)

```
1. Einleitung (~2.500 Zeichen)
   - KI verändert wissenschaftliche Wissensproduktion
   - Deep Research als neues Werkzeug
   - Forschungsfrage: Wo Co-Intelligence, wo Grenzen?

2. Kontext: Feministische AI Literacies (~2.000 Zeichen)
   - Arbeitsdefinition
   - Elisabeth-List-Fellowship Projekt
   - Soziale Arbeit als Anwendungsfeld

3. Methodik (~4.000 Zeichen)
   - 3-Phasen-Workflow
   - Phase 1: Deep Research (4 LLMs)
   - Phase 2: Parallele Bewertung (LLM vs. Expert:innen)
   - Phase 3: Synthese und Knowledge Graph

4. Ergebnisse (~5.000 Zeichen)
   - Quantitativer Vergleich
   - Wo Übereinstimmung, wo Divergenz
   - Epistemische Asymmetrien

5. Diskussion (~3.000 Zeichen)
   - Co-Intelligence: Stärken und Grenzen
   - Verantwortungsfrage
   - Abhängigkeit von proprietären Systemen

6. Fazit (~1.500 Zeichen)
   - Praktische Empfehlungen
   - Offene Fragen
```

## Kernbotschaft des Papers

Die Frage ist nicht, *ob* KI bei Literature Reviews eingesetzt wird, sondern *wie*. Der Praxistest zeigt:

1. **Deep Research funktioniert** für breite Literaturidentifikation
2. **Expert:innenwissen bleibt unverzichtbar** für Qualitätsurteil und Kontextualisierung
3. **Transparenz** über den Prozess ist wissenschaftliche Pflicht
4. **Abhängigkeit** von proprietären Systemen ist ein Grundproblem

## Verbindung zu anderen Dokumenten

- [[Abstract - Deep-Research-gestützte Literature Reviews]]: Eingereicher Abstract
- [[Literature Review Pipeline - Technische Dokumentation]]: Technische Details
- [[Human-LLM Assessment Benchmark]]: Benchmark-Spezifikation und Workflow
- [[FemPrompt-SozArb MOC]]: Projekt-Navigation
- [[Workflow für eine Deep-Research-gestützte Literaturanalyse am Beispiel von feministischem AI-Literacy]]: Methodendokument

## Related

- [[SocialAI MOC]]
- [[Promptotyping MOC]]
- [[Critical-Expert-in-the-Loop]]
