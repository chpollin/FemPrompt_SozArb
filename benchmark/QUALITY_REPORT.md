# Quality Report - LLM Assessment Test (50 Papers)

**Datum:** 2026-02-02
**Modell:** Claude Haiku 4.5 (claude-3-5-haiku-latest)
**Papers:** 50 (von 326)

---

## Executive Summary

Nach Identifikation von Qualitätsproblemen in V1 wurden Prompt und Logik optimiert. V2 zeigt signifikante Verbesserungen:

| Metrik | V1 | V2 | Verbesserung |
|--------|----|----|--------------|
| Include | 22 (44%) | 23 (46%) | +1 |
| Exclude | 28 (56%) | 27 (54%) | -1 |
| **Inkonsistenzen** | 10 (20%) | 3 (6%) | **-70%** |
| **Feministisch erkannt** | 0 | 8 | **+8** |
| Avg Confidence | 0.80 | 0.73 | -0.07 |
| Kosten | $0.14 | $0.21 | +50% |

---

## Änderungen V1 → V2

### 1. Inklusions-Logik erweitert

**Alt (V1):**
```
(AI_Literacies OR Generative_KI OR Prompting) AND Sozial → Include
```

**Neu (V2):**
```
(AI_Literacies OR Generative_KI OR Prompting OR KI_Sonstige) AND Sozial → Include
```

**Begründung:** Papers über algorithmische Entscheidungssysteme in der Sozialen Arbeit (z.B. Risikobewertung in der Jugendhilfe) fallen unter KI_Sonstige und sind hochrelevant.

### 2. Prompt mit strikter Konsistenzregel

**Hinzugefügt:**
```
WICHTIG - Konsistenzregel:
Deine Decision MUSS mathematisch aus den Kategorien folgen!
Du darfst die Logik NICHT mit eigenem Judgment überschreiben!
```

### 3. Feministisch-Definition erweitert

**Alt:** Nur explizit feministische Theorie
**Neu:** Auch implizit feministische Ansätze (intersektionale Analysen, kritische Machtstruktur-Betrachtung)

---

## V1: Ursprüngliche Ergebnisse

### Statistiken

| Metrik | Wert |
|--------|------|
| Include | 22 (44%) |
| Exclude | 28 (56%) |
| Avg Confidence | 0.80 |
| Niedrige Confidence (<0.7) | 9 Papers |
| **Inkonsistenzen mit Logik** | **10 Papers (20%)** |

### Kritische Befunde

#### 1. Inkonsistenz zwischen Kategorien und Decision (20%)

**Problem:** Das LLM entschied Include/Exclude nicht konsistent mit der definierten Inklusions-Logik.

**False Positives (8 Papers):** LLM sagte "Include", aber KEINE Technik-Kategorie war Ja - diese Papers hatten nur KI_Sonstige=Ja.

**False Negatives (2 Papers):** LLM sagte "Exclude", obwohl Technik UND Sozial erfüllt waren.

#### 2. Feministisch = 0%

Kein einziges Paper wurde als "Feministisch" klassifiziert - problematisch für das Projekt.

#### 3. KI_Sonstige überrepräsentiert (74%)

Papers über "algorithmic decision-making" fielen in KI_Sonstige und wurden ausgeschlossen, obwohl relevant.

---

## V2: Nach Optimierung

### Statistiken

| Metrik | Wert |
|--------|------|
| Include | 23 (46%) |
| Exclude | 27 (54%) |
| Avg Confidence | 0.73 |
| **Inkonsistenzen mit Logik** | **3 Papers (6%)** |
| **Feministisch = Ja** | **8 Papers (16%)** |

### Verbesserungen

1. **Inkonsistenzen reduziert:** 20% → 6% (-70%)
2. **Feministisch-Erkennung:** 0 → 8 Papers
3. **Relevante Papers korrekt eingeschlossen:** Algorithmische Systeme in Sozialer Arbeit

### Verbleibende Inkonsistenzen (3 Papers)

Diese 3 Papers zeigen Grenzfälle, die qualitative Analyse benötigen.

---

## Empfehlung

**V2 ist bereit für den vollständigen Durchlauf (326 Papers).**

Geschätzte Kosten: ~$1.30 (basierend auf $0.21 / 50 Papers)

---

## Kategorie-Verteilung V2

| Kategorie | Ja | % |
|-----------|-----|---|
| AI_Literacies | 28 | 56% |
| Generative_KI | 9 | 18% |
| Prompting | 1 | 2% |
| KI_Sonstige | 38 | 76% |
| Soziale_Arbeit | 25 | 50% |
| Bias_Ungleichheit | 24 | 48% |
| Gender | 4 | 8% |
| Diversitaet | 15 | 30% |
| Feministisch | 8 | 16% |
| Fairness | 19 | 38% |

---

## Dateien

- `llm_assessment_50.csv` - V1 Ergebnisse
- `llm_assessment_50_v2.csv` - V2 Ergebnisse (optimiert)
- `categories.yaml` - Aktualisierte Kategorie-Definitionen (v1.1)

---

*Report erstellt: 2026-02-02*
