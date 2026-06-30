---
title: "Pipeline: Assessment"
type: pipeline
stage: 4
tags: [pipeline, assessment, benchmark]
---

# Stufe 4: Dualer Assessment-Pfad

## Methode

**Zwei unabhaengige Bewertungspfade** mit identischem 10-Kategorien-Schema:

| Pfad | Methode | Bewertet | Kosten |
|------|---------|----------|--------|
| Human | Google Sheets | 210/326 | -- |
| LLM (10K) | Claude Haiku 4.5 | 326/326 | $1.44 |

**10 binaere Kategorien** (Ja/Nein):
AI_Literacies, Generative_KI, Prompting, KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit, Gender, Diversitaet, Feministisch, Fairness

**Entscheidungslogik:** Include wenn TECHNIK_OK (mind. 1x Ja in AI/GenKI/Prompting/KI_Sonstige) UND SOZIAL_OK (mind. 1x Ja in SozArb/Bias/Gender/Div/Fem/Fairness)

## Assessment-Prompt (LLM)

```
Du bist ein wissenschaftlicher Reviewer...

## Kategorien (binaer: Ja/Nein)

- **AI_Literacies**: Das Paper behandelt Kompetenzen, Fähigkeiten oder Wissen im Umgang mit KI-Systemen. Umfasst kritische Reflexion, technisches Verständnis oder praktische Anwendungskompetenz.
  Beispiele JA: Framework für KI-Kompetenzentwicklung, Curriculum für AI Literacy in Schulen
  Beispiele NEIN: Rein technische KI-Implementierung ohne Bildungsbezug
- **Generative_KI**: Fokus auf generative KI-Modelle wie Large Language Models, Bildgeneratoren oder andere generative Systeme.
  Beispiele JA: ChatGPT in der Beratung, Midjourney für kreative Prozesse
  Beispiele NEIN: Klassische ML-Klassifikation ohne generativen Aspekt
- **Prompting**: Behandelt Prompt-Engineering, Prompt-Strategien oder die Gestaltung von Eingaben für KI-Systeme.
  Beispiele JA: Chain-of-Thought Prompting für Bias-Reduktion, Prompt-Templates für Dokumentation
  Beispiele NEIN: KI-Nutzung ohne Fokus auf Eingabegestaltung
- **KI_Sonstige**: Andere KI/ML-Themen: klassisches Machine Learning, algorithmische Entscheidungssysteme, Predictive Analytics, Robotik, Computer Vision. WICHTIG: Algorithmische Systeme im Sozialbereich (z.B. Risikobewertung in der Jugendhilfe) zählen hierzu und sind relevant!
  Beispiele JA: Algorithmische Risikobewertung in der Jugendhilfe, Predictive Policing und soziale Auswirkungen
  Beispiele NEIN: Reine Robotik ohne sozialen Bezug
- **Soziale_Arbeit**: Direkter Bezug zu sozialarbeiterischer Praxis, Theorie, Ausbildung oder den Zielgruppen Sozialer Arbeit.
  Beispiele JA: KI in der Jugendhilfe, Algorithmische Entscheidungssysteme im Sozialamt
  Beispiele NEIN: Allgemeine KI-Ethik ohne Sozialarbeitsbezug
- **Bias_Ungleichheit**: Thematisiert Diskriminierung, algorithmischen Bias, soziale Ungleichheit oder strukturelle Benachteiligung im KI-Kontext.
  Beispiele JA: Analyse von Racial Bias in LLM-Outputs, Algorithmische Diskriminierung bei Kreditvergabe
  Beispiele NEIN: Allgemeine KI-Performance-Studie ohne Bias-Fokus
- **Gender**: Expliziter Gender-Fokus, Geschlechterperspektive oder Analyse von Gender-Bias.
  Beispiele JA: Gender-Bias in Sprachmodellen, Geschlechterstereotype in KI-generierten Bildern
  Beispiele NEIN: Demografische Daten enthalten Geschlecht, aber kein Gender-Fokus
- **Diversitaet**: Thematisiert Diversität, Inklusion oder Repräsentation verschiedener Gruppen.
  Beispiele JA: Inklusive KI-Entwicklung mit marginalisierten Communities, Repraesentation verschiedener Ethnien in Trainingsdaten
  Beispiele NEIN: Diverse Methoden verwendet (methodische Diversitaet, nicht sozial)
- **Feministisch**: Verwendet feministische Theorie, Methodik oder Perspektive. Auch implizit feministische Ansätze zählen: intersektionale Analysen, kritische Betrachtung von Machtstrukturen, Fokus auf marginalisierte Gruppen aus Geschlechterperspektive.
  Beispiele JA: Intersektionale Analyse nach Crenshaw, Kritik aus feministischer Technikforschung
  Beispiele NEIN: Gender nur als Variable erwähnt ohne kritische Perspektive
- **Fairness**: Thematisiert algorithmische Fairness, faire ML-Systeme oder Fairness-Metriken.
  Beispiele JA: Fairness-Metriken fuer Klassifikationsmodelle, Fair ML Frameworks und Debiasing-Strategien
  Beispiele NEIN: Allgemeine Ethik-Diskussion ohne spezifischen Fairness-Bezug

## STRIKTE Entscheidungslogik

Paper wird eingeschlossen wenn BEIDE Bedingungen erfüllt sind:
1. TECHNIK: Mindestens eine dieser Kategorien ist Ja:
   - AI_Literacies (KI-Kompetenzen)
   - Generative_KI (LLMs, ChatGPT, etc.)
   - Prompting (Prompt-Engineering)
   - KI_Sonstige (klassisches ML, algorithmische Systeme)

2. SOZIAL: Mindestens eine dieser Kategorien ist Ja:
   - Soziale_Arbeit
   - Bias_Ungleichheit
   - Gender
   - Diversitaet
   - Feministisch
   - Fairness

WICHTIG: Die Decision MUSS konsistent mit den Kategorie-Bewertungen sein! Wenn Technik UND Sozial erfüllt → Include. Wenn nur Technik ODER nur Sozial → Exclude.


## Negative Constraints (Sycophancy-Mitigation)

- Feministisch = "Ja" NUR bei EXPLIZIT feministischer Theorie/Methode
- Soziale_Arbeit = "Ja" NUR bei direktem Bezug zu sozialarbeiterischer Praxis
- Prompting = "Ja" NUR bei substantiellem Prompt-Engineering-Fokus
- Max 4-5 Kategorien "Ja" pro Paper (es sei denn substantiell begruendet)

(Vollstaendiger Prompt: siehe benchmark/scripts/run_llm_assessment.py)
```

## Benchmark-Ergebnis

| Metrik | Wert |
|--------|------|
| Overall Agreement | 47.14% |
| Cohen's Kappa | 0.035 (Prevalence-Bias-Artefakt) |
| LLM Include-Rate | 68% |
| Human Include-Rate | 42% |
| Disagreements | 111/200 |

**Konfusionsmatrix (n=200):**

|  | Human Include | Human Exclude |
|--|--------------|---------------|
| **LLM Include** | 65 | 78 |
| **LLM Exclude** | 23 | 34 |

## Limitationen

- Human Assessment nur fuer 210/326 Papers (64%)
- LLM hat keinen Zugriff auf Volltexte (nur Titel + Abstract)
- Kappa = 0.035 ist Prevalence-Bias-Artefakt (Byrt et al., 1993), NICHT primaere Metrik
- Sycophancy-Mitigation durch negative constraints, aber nicht vollstaendig eliminierbar
