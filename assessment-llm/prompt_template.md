# Paper-Assessment SocialAI

Bewerte Paper für Literature Review "AI in Sozialer Arbeit":

## Metadaten
- **Titel**: {title}
- **Autor(en)**: {authors}
- **Jahr**: {year}
- **Typ**: {item_type}
- **DOI**: {doi}
- **Sprache**: {language}
- **Quelle**: {source_tool}

## Abstract
{abstract}

---

## Decision
**Include**: AI/LLM-Bezug UND (Bias ODER Vulnerable Groups ODER professioneller Sozialkontext), wissenschaftliche Publikation, Sprache DE/EN
**Exclude**: Erfüllt mindestens ein Ausschlusskriterium (siehe unten)
**Unclear**: Abstract unvollständig oder Grenzfall zwischen Feldern

## Exclusion-Kategorien (nur bei Exclude)
- **Not relevant topic**: Weder AI/LLM-Bezug noch sozial-ethische Dimension
- **Wrong publication type**: Nicht peer-reviewed (Editorial, Commentary, Blog, News)
- **Wrong language**: Außerhalb DE/EN
- **Duplicate**: Identischer Inhalt bereits erfasst (gleicher DOI oder Titel+Autor)
- **No full text**: Zugriff technisch unmöglich (Paywall, nicht über Unpaywall/ArXiv)
- **Insufficient quality**: Methodische Mängel im Abstract erkennbar
- **Other**: Andere Gründe (in Notes spezifizieren)

## Relevanz-Scoring (0-3, nur bei Include/Unclear)

**AI_Komp** - Behandlung von AI/LLM-Kompetenzen:
- 0: Keine Erwähnung
- 1: Periphere Erwähnung ohne substanzielle Ausführung
  *Bsp: "AI literacy mentioned in introduction"*
- 2: Dediziertes Kapitel, empirische Daten oder Framework-Komponente
  *Bsp: "Evaluation of AI literacy course"*
- 3: Hauptfokus auf Kompetenzentwicklung, eigenes Framework oder Taxonomie
  *Bsp: Kong (2021) "AI literacy framework development"*

**Vulnerable** - Adressierung benachteiligter Gruppen:
- 0: Keine Erwähnung
- 1: Generische Inklusionsstatements ohne Spezifizierung
  *Bsp: "Technology should be accessible to all"*
- 2: Analyse spezifischer Barrieren oder empirische Daten zu Ungleichheit
  *Bsp: "Digital health divide analysis with empirical data"*
- 3: Primärfokus auf marginalisierte Populationen oder intersektionale Methodik
  *Bsp: Arias López (2023) "Digital literacy as determinant of health"*

**Bias** - Algorithmische Verzerrungen:
- 0: Keine Erwähnung
- 1: Einmalige Erwähnung als Limitation ohne Vertiefung
  *Bsp: "AI systems may contain bias (disclaimer)"*
- 2: Diskussion konkreter Bias-Typen mit Beispielen oder Messungen
  *Bsp: "Gender bias analysis in LLM outputs"*
- 3: Entwicklung von Bias-Detection-Methoden oder empirische Bias-Studie
  *Bsp: "Novel approach to bias mitigation with evaluation"*

**Praxis** - Implementierbare Komponenten:
- 0: Ausschließlich theoretische Abhandlung
- 1: Abstrakte Handlungsempfehlungen ohne Operationalisierung
  *Bsp: "Organizations should implement AI training"*
- 2: Konkrete Methoden, Tools oder Guidelines ohne Evaluation
  *Bsp: "Step-by-step implementation guideline"*
- 3: Empirisch evaluierte Intervention oder validiertes Tool
  *Bsp: "Training intervention with pre/post assessment"*

**Prof** - Professioneller Anwendungskontext:
- 0: Rein technische oder allgemeinbildende Ausrichtung (K-12, general public)
- 1: Potenzielle Relevanz für Praktiker angedeutet
  *Bsp: "Digital health literacy" (übertragbare Methoden, kein direkter SW-Bezug)*
- 2: Expliziter Bezug zu Care-Work, Beratung oder verwandten Feldern
  *Bsp: "AI ethics in counseling contexts"*
- 3: Primärer Fokus auf Soziale Arbeit oder empirische Studie mit Fachkräften
  *Bsp: "AI literacy for social workers: empirical study"*

## Notes
Rationale in Stichpunkten, max. 30 Wörter
- Bei **Include**: Warum relevant? Besondere Stärken?
- Bei **Exclude**: Zusatzinfo (wenn "Other" gewählt)
- Bei **Unclear**: Was fehlt? Wo Grenzfall?

## Output Format
Antworte AUSSCHLIESSLICH mit validem JSON. KEINE Erklärungen, KEIN zusätzlicher Text.

**PFLICHT-FORMAT (exakt so):**

```json
{{
  "decision": "Include",
  "exclusion_reason": null,
  "scores": [2, 1, 3, 0, 2],
  "note": "Kurze Begründung hier"
}}
```

**KRITISCHE Anforderungen an scores-Array:**
- MUSS GENAU 5 Integer-Werte enthalten
- JEDER Wert MUSS 0, 1, 2 oder 3 sein (Integer, KEINE Floats wie 2.5)
- KEINE null-Werte erlaubt (verwende 0 statt null)
- KEINE Strings erlaubt (2 statt "2")
- Reihenfolge: [AI_Komp, Vulnerable, Bias, Praxis, Prof]

**Beispiele für KORREKTE scores:**
- `[2, 1, 3, 0, 2]` ✓
- `[0, 0, 0, 0, 0]` ✓
- `[3, 3, 3, 3, 3]` ✓
- `[1, 2, 1, 1, 0]` ✓

**Beispiele für FALSCHE scores (vermeide!):**
- `[2, 1, 3]` ✗ (nur 3 Werte)
- `[2, 1, 3, 0, 2, 1]` ✗ (6 Werte)
- `[2.5, 1, 3, 0, 2]` ✗ (Float statt Integer)
- `[2, 1, null, 0, 2]` ✗ (null-Wert)
- `["2", "1", "3", "0", "2"]` ✗ (Strings)

**Weitere Anforderungen:**
- decision: NUR "Include", "Exclude" oder "Unclear" (exakte Schreibweise)
- exclusion_reason: null bei Include/Unclear, sonst Kategorie-String aus obiger Liste
- note: Max 30 Wörter, deutsch, präzise Begründung
