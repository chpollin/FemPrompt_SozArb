# LLM Assessment Report (5D)

**Datum:** 2025-11-02
**Modell:** Claude Haiku 4.5
**Assessment-Datei:** [assessment_llm.xlsx](output/assessment_llm.xlsx)

---

## Ergebnis

| Metrik | Wert |
|--------|------|
| **Papers bewertet** | 325 |
| **Erfolgsrate** | 100% |
| **Kosten** | $1.15 (~$0.0035/Paper) |
| **Dauer** | 23 Minuten (~13.7 Papers/Min) |
| **Input Tokens** | 1,114,534 (~3,429/Paper) |
| **Output Tokens** | 64,700 (~199/Paper) |

---

## PRISMA-Entscheidungen

| Decision | Count | Anteil |
|----------|-------|--------|
| **Include** | 222 | 68.3% |
| **Exclude** | 83 | 25.5% |
| **Unclear** | 20 | 6.2% |

### Ausschlussgruende

| Grund | Count | Anteil |
|-------|-------|--------|
| No full text | 50 | 60.2% |
| Not relevant topic | 24 | 28.9% |
| Wrong publication type | 9 | 10.8% |

---

## Relevanz-Dimensionen (nur Include-Papers)

5 Dimensionen auf Skala 0-3:

| Dimension | Avg Score | Beschreibung |
|-----------|-----------|--------------|
| **Rel_Bias** | 2.47 | Algorithmische Verzerrungen (hoechste Relevanz) |
| **Rel_Vulnerable** | 2.23 | Vulnerable Gruppen und Digital Equity |
| **Rel_Praxis** | 1.68 | Praktische Implementation |
| **Rel_Prof** | 1.67 | Professioneller Kontext (Soziale Arbeit) |
| **Rel_AI_Komp** | 1.18 | AI/LLM-Kompetenzen |

**Interpretation:** Das Korpus hat starken Fokus auf Bias-Thematik und vulnerable Gruppen. AI-Literacy ist eher peripher behandelt (viele Papers setzen AI-Kontext voraus).

---

## Assessment-Schema

### Entscheidungs-Kategorien
- **Include:** AI/LLM-Relevanz UND (Bias ODER Vulnerable Groups ODER Professional Social Context)
- **Exclude:** Mindestens ein Inklusionskriterium nicht erfuellt
- **Unclear:** Unzureichendes Abstract oder Grenzfall

### Relevanz-Dimensionen (0-3)

| Score | Bedeutung | Beispiel |
|-------|-----------|----------|
| 0 | Keine Erwaehnung | -- |
| 1 | Periphere Erwaehnung | Einzelne Nennung als Limitation |
| 2 | Substantielle Behandlung | Eigenes Kapitel oder Datenanalyse |
| 3 | Kernfokus | Framework-Entwicklung, primaerer Forschungsgegenstand |

---

## Thematische Schwerpunkte

| Cluster | Papers | Beispiele |
|---------|--------|-----------|
| Child Welfare und Algorithmic Decision-Making | 10+ (Score 12-13) | Kawakami, Cheng, Hall, Field |
| AI Ethics in Social Work | 15+ | Reamer, Baker, McDonald, Singer |
| Digital Welfare State | 5+ | Amnesty, Jorgensen, Meilvang |
| Feminist AI und Intersectionality | 20+ | Prompting-Techniken, Bias-Mitigation |
| Deutschsprachige Forschung | 15+ | Linnemann, Kutscher, Schneider |

---

## Technische Details

### Modell-Konfiguration
- **Modell:** claude-haiku-4-5
- **Temperature:** 0.3 (erster Versuch), 0.1 (Retry)
- **Max Tokens:** 1024
- **Delay:** 2 Sekunden zwischen API-Calls

### Response-Repair (automatisch)
29 Papers wurden automatisch repariert (primaer `scores: null` zu `[0,0,0,0,0]`). Weitere Reparaturtypen: Array zu kurz/lang, Float-zu-Int, String-zu-Int.

### Auto-Exclude
30 Papers ohne Abstract wurden automatisch als "Exclude" markiert (Grund: "No full text").

### Validierungschecks
- JSON-Parsing, Pflichtfelder, Score-Range (0-3), Array-Laenge (5), Decision-Werte, Exclusion-Reason-Logik

---

## Run-Historie

| Run | Papers | Erfolgsrate | Kosten | Status |
|-----|--------|-------------|--------|--------|
| Run 1 | 265 | 84.2% | $0.39 | Abgeschlossen (42 Fehler) |
| Run 2 | 265 | 62.6% | ~$0.30 | Unvollstaendig |
| Run 3 | 265 | Partiell | ~$0.15 | Unvollstaendig |
| Run 4 | 265 | Partiell | ~$0.15 | Unvollstaendig |
| **Run 5 (final)** | **325** | **100%** | **$0.58** | **Abgeschlossen** |

Run 5 loeste das Problem durch Response-Repair-Logik (`_repair_response()` in `assess_papers.py`). Gesamtkosten ueber alle Runs: ~$1.15.

---

## Output-Dateien

| Datei | Inhalt |
|-------|--------|
| `output/assessment_llm.xlsx` | Finale Assessment-Ergebnisse (325 Papers) |
| `logs/api_calls.jsonl` | API-Call-Log (Run 5) |
| `logs/assessment.log` | Processing-Log (Run 5) |

Archivierte Logs frueherer Runs in `logs/` (Suffix `_OLD_run1`, `_RUN2_incomplete`, etc.).

---

## Limitationen

- 50 Papers ohne Abstract automatisch ausgeschlossen (moeglicherweise false negatives)
- Bewertung basiert nur auf Abstracts (kein Full-Text)
- 20 Unclear-Papers erfordern manuelle Nachbearbeitung
- Moeglicher Bias bei englischsprachiger Dominanz
- Prompt-Dokumentation: siehe [prompts/CHANGELOG.md](../prompts/CHANGELOG.md)

---

*Aktualisiert: 2026-02-14*
