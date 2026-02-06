# LLM Assessment Report

**Datum:** 2025-11-02
**Assessment-Datei:** [assessment_llm.xlsx](output/assessment_llm.xlsx)

---

## Executive Summary

✅ **325 Papers erfolgreich bewertet** mit 100% Erfolgsrate
💰 **Kosten:** $1.15 (~$0.0035 pro Paper)
⏱️ **Dauer:** ~20 Minuten (~16 Papers/Minute)
🤖 **Model:** Claude Haiku 4.5

---

## PRISMA-Entscheidungen

| Decision | Count | Percentage |
|----------|-------|------------|
| **Include** | 222 | 68.3% |
| **Exclude** | 83 | 25.5% |
| **Unclear** | 20 | 6.2% |

### Ausschlussgründe (Exclude Papers)

| Grund | Count | Percentage |
|-------|-------|------------|
| No full text | 50 | 60.2% |
| Not relevant topic | 24 | 28.9% |
| Wrong publication type | 9 | 10.8% |

---

## Relevanz-Dimensionen (Include Papers)

**Durchschnittliche Scores** (Skala 0-3):

| Dimension | Avg Score | Interpretation |
|-----------|-----------|----------------|
| **Rel_Bias** | 2.47 | Bias & Diskriminierung (höchste Relevanz) |
| **Rel_Vulnerable** | 2.23 | Vulnerable Gruppen & Digital Equity |
| **Rel_Praxis** | 1.68 | Praktische Implementation |
| **Rel_Prof** | 1.67 | Professioneller Kontext (Soziale Arbeit) |
| **Rel_AI_Komp** | 1.18 | AI/LLM-Kompetenzen |

**Interpretation:**
- Das Korpus hat **starken Fokus auf Bias-Thematik** und vulnerable Gruppen
- Moderate Praxis-Relevanz und professioneller Sozialarbeits-Kontext
- AI-Literacy ist eher peripher behandelt (viele Papers setzen AI-Kontext voraus)

---

## Top 10 Papers nach Gesamtrelevanz

### 1. How child welfare workers reduce racial disparities in algorithmic decisions
- **Total Score:** 13/15 (höchstmöglich!)
- **Scores:** AI:1, Vuln:3, Bias:3, Prax:3, Prof:3
- **Highlights:** Empirische Studie zu Bias-Reduktion durch menschliche Expertise

### 2-3. Systematic Reviews zu Child Welfare AI
- **Total Score:** 12/15
- A systematic review of sophisticated predictive and prescriptive analytics
- Improving human-AI partnerships in child welfare

### 4-5. AI Literacy für Soziale Arbeit
- **Total Score:** 12/15
- Algorithmic decision-making in social work practice and pedagogy
- Artificial Intelligence (AI) literacy for social work: Implications for core competencies

### 6. Artificial intelligence in social work: An EPIC model for practice
- **Total Score:** 12/15
- **Scores:** AI:2, Vuln:3, Bias:2, Prax:2, Prof:3

### 7. Künstliche Intelligenz in der Sozialen Arbeit (Linnemann)
- **Total Score:** 12/15
- **Deutschsprachiges Grundlagenwerk**

### 8. Algorithmic-Assisted Decision-Making Tools in Child Welfare Practice
- **Total Score:** 12/15

### 9-10. AI Literacy for Social Work (Duplikate)
- **Total Score:** 12/15
- Mehrere hochrelevante Papers zum gleichen Thema

---

## Thematische Schwerpunkte

### Child Welfare & Algorithmic Decision-Making
- **10+ hochrelevante Papers** (Score 12-13)
- Fokus: Racial/social bias, fairness, human-AI collaboration
- Beispiele: Kawakami, Cheng, Hall, Cher, Moreau, Field

### AI Ethics in Social Work
- **15+ Papers** zu ethischen Fragen
- Autoren: Reamer, Baker, McDonald, Hodgson, Singer
- Themen: Professional standards, emerging issues, ChatGPT impact

### Digital Welfare State
- **Dänische Forschung prominent** (Amnesty, Jørgensen, Meilvang)
- Algorithmic surveillance, data rights, automation

### Feminist AI & Intersectionality
- **20+ Papers** zu Gender Bias, Intersectionality
- Stark vertreten: Prompting-Techniken zur Bias-Mitigation
- Konzeptionelle und technische Ansätze

### Deutschsprachige Forschung
- **15+ Papers** aus D/A/CH-Raum
- Schwerpunkte: Digitalisierung Sozialer Arbeit, KI-Kompetenzen
- Key-Autoren: Linnemann, Kutscher, Schneider, Gravelmann

---

## Zotero-Tag-System

**PRISMA Tags:**
- `PRISMA_Include` (222 Papers)
- `PRISMA_Exclude` (83 Papers)
- `PRISMA_Unclear` (20 Papers)

**Relevanz-Tags (nur Include/Unclear):**
- `Relevance_High` (Total Score ≥10)
- `Relevance_Medium` (Total Score 6-9)
- `Relevance_Low` (Total Score <6)

**Dimensions-Tags (bei Score ≥2):**
- `Dimension_AI_Literacy`
- `Dimension_Vulnerable_Groups`
- `Dimension_Bias`
- `Dimension_Practice`
- `Dimension_Social_Work`

**Exclusion-Tags:**
- `Exclusion_No_full_text`
- `Exclusion_Not_relevant_topic`
- `Exclusion_Wrong_publication_type`

---

## API-Nutzung

**Token-Verbrauch:**
- Input: 1,114,534 tokens (~3,429 tokens/paper)
- Output: 64,700 tokens (~199 tokens/paper)

**Kosten (Claude Haiku 4.5):**
- Input: $0.89 ($0.80/1M tokens)
- Output: $0.26 ($4.00/1M tokens)
- **Total: $1.15**

**Performance:**
- 0 Fehler bei 325 Papers (100% Erfolgsrate)
- Auto-Repair für 20 Papers mit null-Scores
- 50 Papers ohne Abstract automatisch ausgeschlossen

---

## Nächste Schritte

### 1. Zotero synchronisieren
- Öffnen Sie: https://www.zotero.org/groups/6284300/socialai-litreview-curated
- Klicken Sie auf den grünen Sync-Button
- Tags sollten jetzt sichtbar sein

### 2. PRISMA-Filter anwenden
- Filtern Sie nach `PRISMA_Include` → 222 Papers
- Nutzen Sie Dimensions-Tags für thematische Cluster

### 3. PDF-Akquise (Optional)
```bash
python pipeline/scripts/download_zotero_pdfs.py \
  --output pipeline/pdfs/
```

### 4. Weitere Analyse
- Excel-Datei öffnen für detaillierte Notes
- Relevanz-Scores nach Bedarf anpassen
- Unclear-Papers manuell reviewen (20 Papers)

---

## Dateien

- **Excel Assessment:** `assessment-llm/output/assessment_socialai_llm.xlsx`
- **API Logs:** `assessment-llm/logs/api_calls.jsonl`
- **Analysis Script:** `assessment-llm/analyze_results.py`
- **Zotero Export:** `assessment/assessment_socialai.xlsx`

---

## Reflexion & Limitationen

### Stärken
✅ Vollautomatische Bewertung ohne manuellen Aufwand
✅ Konsistente 5-dimensionale Relevanz-Bewertung
✅ Transparent dokumentierte Entscheidungsgründe
✅ Kosteneffizient ($0.0035/Paper)

### Limitationen
⚠️ 50 Papers ohne Abstract automatisch ausgeschlossen (evtl. false negatives)
⚠️ LLM-Entscheidungen basieren nur auf Abstracts (kein Full-Text)
⚠️ 20 Unclear-Papers erfordern manuelle Nachbearbeitung
⚠️ Bias in LLM-Bewertungen möglich (v.a. bei englischsprachiger Dominanz)

### Empfehlungen
1. **Unclear-Papers manuell reviewen** (20 Papers, überschaubar)
2. **Stichproben-Validierung** der Include-Entscheidungen (10-20 Papers)
3. **No-abstract-Papers prüfen**: Evtl. DOI-basierte Abstract-Suche
4. **Dimensionen-Scores anpassen** falls thematischer Fokus sich verschiebt

---

**Generiert:** 2025-11-02 16:15 CET
**Repository:** https://github.com/chpollin/FemPrompt_SozArb
