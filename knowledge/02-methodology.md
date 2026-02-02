# Methodik: PRISMA 2020 und Assessment

## PRISMA 2020 Framework

Der Workflow folgt PRISMA 2020 Standards fuer systematische Reviews:
- 27-Item-Checkliste strukturiert Identifikation, Screening, Eligibility-Assessment
- Flow-Diagramm dokumentiert Selektionsprozess mit Quantifizierung jeder Phase
- Explizite Benennung von Ausschlussgruenden

### Abweichung von Standard-Datenbanksuchen

Die Identifikationsphase nutzt KI-gestuetzte Deep Research statt traditioneller Datenbanksuchen:
- 4 Modelle (ChatGPT, Claude, Gemini, Perplexity) generieren Empfehlungen
- Parametrische Prompts sichern Vergleichbarkeit
- Abweichung wird explizit dokumentiert und begruendet

---

## Thematisches Assessment-Schema (FemPrompt)

### Forschungsfrage

> Inwiefern kommen die Themen oder die Verknuepfung der Bereiche feministische AI Literacies, generative KI / Prompting und Soziale Arbeit in wissenschaftlicher Literatur vor?

### 10 Binaere Kategorien

**Technik-Dimensionen (Ja/Nein):**

| Kategorie | Beschreibung |
|-----------|--------------|
| AI_Literacies | KI-Kompetenzen, kritische Reflexion, Anwendungskompetenz |
| Generative_KI | LLMs, ChatGPT, Bildgeneratoren |
| Prompting | Prompt-Engineering, Eingabegestaltung |
| KI_Sonstige | Klassisches ML, algorithmische Systeme, Predictive Analytics |

**Sozial-Dimensionen (Ja/Nein):**

| Kategorie | Beschreibung |
|-----------|--------------|
| Soziale_Arbeit | Praxis, Theorie, Ausbildung, Zielgruppen |
| Bias_Ungleichheit | Diskriminierung, algorithmischer Bias, strukturelle Benachteiligung |
| Gender | Geschlechterperspektive, Gender-Bias |
| Diversitaet | Diversitaet, Inklusion, Repraesentation |
| Feministisch | Feministische Theorie, Methodik, Perspektive (auch implizit) |
| Fairness | Algorithmische Fairness, faire ML-Systeme |

### Inklusions-Logik

```
(AI_Literacies OR Generative_KI OR Prompting OR KI_Sonstige)
AND
(Soziale_Arbeit OR Bias_Ungleichheit OR Gender OR Diversitaet OR Feministisch OR Fairness)
-> Include
```

**Wichtig:** KI_Sonstige wurde in v1.1 zur Inklusions-Logik hinzugefuegt, da algorithmische Systeme im Sozialbereich (z.B. Risikobewertung in der Jugendhilfe) hochrelevant sind.

### Exclusion Reasons

| Code | Beschreibung |
|------|--------------|
| Duplicate | Identische Publikation aus anderem Source_Tool |
| Not_relevant_topic | Thematisch nicht passend |
| Wrong_publication_type | Ungeeigneter Publikationstyp |
| No_full_text | Kein Volltext verfuegbar |
| Language | Sprache nicht zugaenglich |

### Studientypen

- Empirisch
- Experimentell
- Theoretisch
- Konzept
- Literaturreview
- Unclear

---

## LLM-Assessment (SozArb)

Fuer das SozArb-Projekt wurde ein automatisiertes 5-dimensionales Scoring-System entwickelt:

### Relevanz-Dimensionen (0-3 Skala)

| Dimension | 0 | 1 | 2 | 3 |
|-----------|---|---|---|---|
| AI_Komp | Keine Erwaehnung | Oberflaechlich | Substantiell | Framework-Entwicklung |
| Vulnerable | Keine Erwaehnung | Erwaehnt | Fokus | Intersektional |
| Bias | Keine Erwaehnung | Erwaehnt | Analysiert | Bias-Detection-Studie |
| Praxis | Rein theoretisch | Konzepte | Anwendung | Evaluiertes Tool |
| Prof | Kein Kontext | Allgemein | Human Services | Soziale Arbeit |

### Performance

- 325 Papers in 24 Minuten
- 100% Erfolgsrate
- Kosten: $0.58 (Claude Haiku 4.5)

---

## Multi-Modell-Recherche (Prozess)

### Parametrischer Prompt

Alle 4 Modelle erhalten identische Prompts mit:

1. **Rolle:** Literature Review Spezialist fuer feministische KI-Forschung
2. **Aufgabe:** Annotierte Bibliographie mit strukturierten Metadaten
3. **Kontext:** Forschungsziele, zeitlicher Scope, geografischer Fokus
4. **Analyseschritte:** 20-30 Publikationen, peer-reviewed priorisiert
5. **Output-Format:** APA 7, 150-200 Woerter Summary, Relevanz-Score

### Ausfuehrung

- Manuelles Copy-Paste in 4 Deep Research Interfaces
- Ergebnisse in Zotero-Collections mit Praefix "_DEEPRESEARCH"
- Typisch 3-15 Empfehlungen pro Modell

---

## RIS-Standardisierung

Heterogene Modell-Outputs werden in RIS-Format konvertiert:

```
TY - Dokumenttyp
AU - Autoren
TI - Titel
JO - Journal
VL - Volume
IS - Issue
SP/EP - Seiten
PY - Jahr
DO - DOI
AB - Abstract
KW - Keywords
```

- DOI-Validierung gegen CrossRef-Muster
- Unsichere Angaben mit N1-Note markiert
- Temporaere Konversion via Claude-Projekt

---

## Zotero-Integration

### Import

- Sequenzieller Import der RIS-Dateien
- Modellspezifische Collections (claude_, gemini_, openai_, perplexity_)
- Provenienz-Information bleibt erhalten

### Qualitaetskontrolle

- Duplikaterkennung via Title-Matching und DOI-Vergleich
- Metadaten-Korrektur (ORCID, Journal-Namen)
- PDF-Attachment via Browser-Integration

### Export

- `zotero_vereinfacht.json` fuer Pipeline-Input
- Felder: key, itemType, title, creators, date, DOI, url, abstractNote

---

## Qualitaetsbewertung

### Bibliographische Validierung

- DOI-Validierung ueber CrossRef API
- Autoren-Disambiguierung via ORCID
- Journal-Verifikation gegen DOAJ und Beall's List

### Methodische Rigorositaet

**Empirische Studien:**
- Stichprobengroesse und Repraesentativitaet
- Methodentransparenz und Reproduzierbarkeit
- Statistische Power und Effektstaerken

**Theoretische Arbeiten:**
- Konzeptuelle Klarheit
- Argumentationslogik
- Integration bestehender Literatur

### KI-Output-Validierung

- Halluzinationserkennung durch Zitat-Validierung
- Sycophancy-Mitigation durch neutrale Prompts
- Vergleich der Outputs verschiedener Modelle

---

## Alternative Review-Standards

| Standard | Fokus | Anwendung |
|----------|-------|-----------|
| JBI Manual | Pluralistische Evidenz | 13 Checklisten fuer verschiedene Studientypen |
| Cochrane 6.5 | Gesundheitsinterventionen | RoB 2, ROBINS-I |
| ENTREQ | Qualitative Synthesen | 21 Items fuer Reflexivitaet |
| MMAT | Mixed-Methods | 5 studientypspezifische Kriterien |

---

## Human-LLM Benchmark

Fuer das Forum Wissenschaft Paper wird ein Vergleich zwischen Human- und LLM-Assessment durchgefuehrt:

### Metriken

- **Cohen's Kappa:** Inter-Rater-Reliabilitaet
- **Agreement pro Kategorie:** Wo stimmen Human/LLM ueberein?
- **Disagreement-Analyse:** Qualitative Untersuchung der Abweichungen

### Benchmark-Scripts

```
benchmark/
  config/categories.yaml     # 10 Kategorien (synchron mit Human-Assessment)
  scripts/
    run_llm_assessment.py    # LLM-Assessment mit YAML-Schema
    merge_assessments.py     # Human + LLM zusammenfuehren
    calculate_agreement.py   # Cohen's Kappa berechnen
    analyze_disagreements.py # Qualitative Analyse
```

### V2-Ergebnisse (50 Papers Test)

| Metrik | V1 | V2 | Verbesserung |
|--------|----|----|--------------|
| Inkonsistenzen | 20% | 6% | -70% |
| Feministisch erkannt | 0 | 8 | +8 |

---

*Konsolidiert aus: METHODOLOGY.md, analysis/PRISMA_COMPLIANCE.md*
*Konfiguration: benchmark/config/categories.yaml (v1.1)*
*Version: 1.0 (2026-02-02)*
