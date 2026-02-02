# LLM-Based Paper Assessment Guide

Automatisiertes PRISMA-Assessment mit Claude Haiku 4.5.

---

## Schnellstart

```bash
# API Key setzen
export ANTHROPIC_API_KEY="sk-ant-your-key"

# Assessment ausfuehren
python assessment-llm/assess_papers.py \
  -i assessment/papers.xlsx \
  -o assessment-llm/output/assessment.xlsx
```

---

## Ablauf

1. **Liest** Excel mit Paper-Metadaten (Titel, Abstract, etc.)
2. **Pro Paper:**
   - Baut Assessment-Prompt
   - Ruft Claude Haiku 4.5 API auf
   - Parst JSON-Response
   - Validiert Scores
3. **Schreibt** Ergebnis nach `output/assessment.xlsx`
4. **Loggt** API-Calls nach `logs/api_calls.jsonl`

---

## Assessment-Schema

### Entscheidung

| Wert | Bedeutung |
|------|-----------|
| Include | Paper ist relevant |
| Exclude | Paper nicht relevant |
| Unclear | Unsicher, manuelle Pruefung noetig |

### Ausschlussgruende (bei Exclude)

- Not relevant topic
- Wrong publication type
- Wrong language
- Duplicate
- No full text
- Insufficient quality

### Relevanz-Scores (0-3)

| Dimension | 0 | 1 | 2 | 3 |
|-----------|---|---|---|---|
| AI_Komp | Kein Bezug | Erwaehnt | Zentral | Framework |
| Vulnerable | Keine Gruppe | Erwaehnt | Fokus | Intersektional |
| Bias | Kein Bias | Erwaehnt | Analysiert | Studie |
| Praxis | Theorie | Beispiele | Tool | Evaluiert |
| Prof | Allgemein | Berufsfeld | Sozialwesen | Sozialarbeit |

---

## Output-Format

Excel mit folgenden Spalten:
- Decision (M)
- Exclusion_Reason (N)
- Rel_AI_Komp (O)
- Rel_Vulnerable (P)
- Rel_Bias (Q)
- Rel_Praxis (R)
- Rel_Prof (S)
- Notes (T)

---

## Performance

**Run 5 (325 Papers):**
- Dauer: 24 Minuten
- Input Tokens: 557.647 (~1.716/Paper)
- Output Tokens: 32.258 (~99/Paper)
- Kosten: $0.58
- Erfolgsrate: 100%

---

## Fehlerbehandlung

### Layer 1: Auto-Repair

Automatische Reparatur vor Validierung:
- `scores: null` → `[0, 0, 0, 0, 0]`
- Array zu kurz → Mit Nullen auffuellen
- Array zu lang → Auf 5 kuerzen
- Float → Int konvertieren

### Layer 2: Retry

Bei Reparatur-Fehler:
- Retry mit `temperature=0.1`
- 2 Sekunden Delay

### Auto-Exclude

Papers ohne Abstract werden automatisch excluded:
- Decision: Exclude
- Reason: "No full text"
- Spart API-Kosten

---

## Rate Limiting

Default: 2 Sekunden zwischen API-Calls.

```bash
# Anpassen:
python assess_papers.py --delay 5.0
```

---

## Dateien

```
assessment-llm/
  assess_papers.py         # Haupt-Script
  prompt_template.md       # Prompt-Template
  logs/
    assessment.log         # Verarbeitungs-Log
    api_calls.jsonl        # API-Historie
  output/
    assessment.xlsx        # Ergebnis
```

---

## Nach dem Assessment

1. Output pruefen: `assessment-llm/output/assessment.xlsx`
2. Logs reviewen: `logs/assessment.log`
3. Stichprobe validieren (10-20 Papers manuell)
4. Ggf. nach Zotero exportieren

---

*Version: 2.0 (2026-02-02)*
