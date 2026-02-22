---
title: "Pipeline: Structured Knowledge Extraction"
type: pipeline
stage: 3
tags: [pipeline, ske, llm]
---

# Stufe 3: Structured Knowledge Extraction (SKE)

## Methode

3-Stage LLM-Pipeline mit Claude Haiku 4.5:

1. **Extract & Classify** (LLM): Extraktion von Metadaten, Kernbefund, Argumenten, 10 Kategorien
2. **Format & Enrich** (deterministisch): Konversion zu Obsidian-Markdown mit YAML-Frontmatter
3. **Verify & Finalize** (LLM): Verifikation gegen Originaltext, Confidence-Score

## Ergebnis

| Metrik | Wert |
|--------|------|
| Input (Markdown-Docs) | 252 |
| Output (Knowledge-Docs) | 249 |
| Verifikations-Dateien | 219 |
| Durchschnittliche Confidence | 91.5 |
| Score >= 75 | 217/219 |

## Prompt: Stufe 1 (Extract & Classify)

```
Du bist ein Experte für wissenschaftliche Literaturanalyse im Bereich KI, Soziale Arbeit und Gender Studies.

# PAPER (Markdown-Format)
[PAPER-INHALT]

# AUFGABE
Extrahiere alle relevanten Informationen und klassifiziere das Paper nach 10 Kategorien.
Antworte im JSON-Format (kein Markdown-Codeblock, nur reines JSON).

{
  "metadata": {
    "title": "Vollständiger Titel des Papers",
    "authors": ["Autor1", "Autor2"],
    "year": 2024,
    "type": "journalArticle|conferencePaper|report|book|thesis|workingPaper",
    "language": "en|de|other"
  },
  "core": {
    "research_question": "Die zentrale Forschungsfrage (1 Satz)",
    "methodology": "Ansatz und Methoden (kurz: Empirisch/Theoretisch/Mixed/Review + spezifische Methoden)",
    "key_finding": "Wichtigster Befund oder Beitrag (1-2 Sätze)",
    "data_basis": "Datenbasis falls empirisch (z.B. n=125 Surveys, 50 Interviews)"
  },
  "arguments": [
    "Hauptargument 1 (1-2 Sätze)",
    "Hauptargument 2 (1-2 Sätze)",
    "Hauptargument 3 (1-2 Sätze)"
  ],
  "categories": {
    "AI_Literacies": true,
    "Generative_KI": false,
    "Prompting": false,
    "KI_Sonstige": true,
    "Soziale_Arbeit": true,
    "Bias_Ungleichheit": true,
    "Gender": false,
    "Diversitaet": true,
    "Feministisch": false,
    "Fairness": true
  },
  "category_evidence": {
    "AI_Literacies": "Direktes Zitat oder Paraphrase als Evidenz",
    "KI_Sonstige": "Evidenz...",
    "Soziale_Arbeit": "Evidenz...",
    "Bias_Ungleichheit": "Evidenz...",
    "Diversitaet": "Evidenz...",
    "Fairness": "Evidenz..."
  },
  "references": [
    {"author": "Buolamwini", "year": 2018, "short_title": "Gender Shades"},
    {"author": "D'Ignazio & Klein", "year": 2020, "short_title": "Data Feminism"},
    {"author": "Eubanks", "year": 2019, "short_title": "Automating Inequality"}
  ],
  "assessment": {
    "domain_fit": "Wie relevant ist das Paper für die Schnittstelle AI/Soziale Arbeit/Gender? (1-2 Sätze)",
    "unique_contribution": "Was ist der besond

[... gekuerzt, siehe pipeline/scripts/distill_knowledge.py]
```

## Prompt: Stufe 3 (Verify)

```
Du bist ein wissenschaftlicher Qualitätsprüfer. Vergleiche das generierte Wissensdokument mit dem Originaltext.

# ORIGINAL-MARKDOWN (Ausschnitt)
[ORIGINALTEXT-AUSSCHNITT]

# GENERIERTES WISSENSDOKUMENT
[GENERIERTES WISSENSDOKUMENT]

# AUFGABE
Prüfe auf drei Dimensionen und gib einen Confidence-Score.

Antworte im JSON-Format:

{
  "verification": {
    "completeness": {
      "score": 85,
      "missing_critical": [],
      "missing_minor": ["Detail X nicht erwähnt"]
    },
    "correctness": {
      "score": 95,
      "errors": [],
      "distortions": []
    },
    "category_validation": {
      "score": 90,
      "incorrect_categories": [],
      "missing_categories": []
    }
  },
  "overall_confidence": 90,
  "needs_correction": false,
  "corrections": {
    "frontmatter": null,
    "content_fixes": []
  }
}

# PRÜFKRITERIEN

**Completeness (0-100)**:
- Sind Forschungsfrage, Methodik und Hauptbefunde korrekt erfasst?
- Fehlen kritische Informationen?

**Correctness (0-100)**:
- Gibt es faktische Fehler?
- Wurden Aussagen verzerrt?

**Category Validation (0-100)**:
- Sind die Kategorien durch den Originaltext belegt?
- Fehlen offensichtliche Kategorien?

**Overall Confidence**: Gewichteter Durchschnitt (Completeness 40%, Correctness 40%, Categories 20%)

**needs_correction**: true wenn overall_confidence < 75

Falls needs_correction = true, füge spezifische Korrekturen hinzu.

Antworte NUR mit dem JSON-Objekt.
```

## Konfiguration

- Modell: Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Kosten: ~$0.028 pro Paper (gesamt: ~$7)
- Rate Limiting: 1s Delay zwischen Calls
- Config: `config/defaults.yaml`

## Limitationen

- 3 Papers bei Konversion verloren (252 -> 249)
- LLM-Extraktion abhaengig von Markdown-Qualitaet (Tabellen/Abbildungen fehlen)
- Kategorie-Extraktion in Stufe 1 ist probabilistisch (nicht identisch mit 10K-Assessment)
- Verifikation prueft nur gegen Originaltext, nicht gegen Realitaet
