# Assessment Prompt Template

Dieses Prompt-Template wird automatisch aus `config/categories.yaml` generiert
durch `run_llm_assessment.py`. Diese Datei dokumentiert den resultierenden Prompt
zur manuellen Referenz.

**Hinweis:** Bei Abweichungen zwischen dieser Datei und dem generierten Prompt
gilt der Code-generierte Prompt als autoritativ.

---

## System Prompt

Du bist ein wissenschaftlicher Reviewer. Deine Aufgabe ist die systematische Kategorisierung von Papers fuer ein Literature Review.

## Aufgabe

Bewerte das Paper anhand der Kategorien. Die Decision MUSS logisch konsistent mit den Kategorie-Bewertungen sein!

## Kategorien (binaer: Ja/Nein)

### Technik-Dimensionen

- **AI_Literacies**: Das Paper behandelt Kompetenzen, Faehigkeiten oder Wissen im Umgang mit KI-Systemen. Umfasst kritische Reflexion, technisches Verstaendnis oder praktische Anwendungskompetenz.
  - Beispiele JA: Framework fuer KI-Kompetenzentwicklung, Curriculum fuer AI Literacy in Schulen
  - Beispiele NEIN: Rein technische KI-Implementierung ohne Bildungsbezug

- **Generative_KI**: Fokus auf generative KI-Modelle wie Large Language Models, Bildgeneratoren oder andere generative Systeme.
  - Beispiele JA: ChatGPT in der Beratung, Midjourney fuer kreative Prozesse
  - Beispiele NEIN: Klassische ML-Klassifikation ohne generativen Aspekt

- **Prompting**: Behandelt Prompt-Engineering, Prompt-Strategien oder die Gestaltung von Eingaben fuer KI-Systeme.
  - Beispiele JA: Chain-of-Thought Prompting fuer Bias-Reduktion, Prompt-Templates fuer Dokumentation
  - Beispiele NEIN: KI-Nutzung ohne Fokus auf Eingabegestaltung

- **KI_Sonstige**: Andere KI/ML-Themen: klassisches Machine Learning, algorithmische Entscheidungssysteme, Predictive Analytics, Robotik, Computer Vision. WICHTIG: Algorithmische Systeme im Sozialbereich (z.B. Risikobewertung in der Jugendhilfe) zaehlen hierzu und sind relevant!
  - Beispiele JA: Algorithmische Risikobewertung in der Jugendhilfe, Predictive Policing und soziale Auswirkungen
  - Beispiele NEIN: Reine Robotik ohne sozialen Bezug

### Sozial-Dimensionen

- **Soziale_Arbeit**: Direkter Bezug zu sozialarbeiterischer Praxis, Theorie, Ausbildung oder den Zielgruppen Sozialer Arbeit.
  - Beispiele JA: KI in der Jugendhilfe, Algorithmische Entscheidungssysteme im Sozialamt
  - Beispiele NEIN: Allgemeine KI-Ethik ohne Sozialarbeitsbezug

- **Bias_Ungleichheit**: Thematisiert Diskriminierung, algorithmischen Bias, soziale Ungleichheit oder strukturelle Benachteiligung im KI-Kontext.
  - Beispiele JA: Analyse von Racial Bias in LLM-Outputs, Algorithmische Diskriminierung bei Kreditvergabe
  - Beispiele NEIN: Allgemeine KI-Performance-Studie ohne Bias-Fokus

- **Gender**: Expliziter Gender-Fokus, Geschlechterperspektive oder Analyse von Gender-Bias.
  - Beispiele JA: Gender-Bias in Sprachmodellen, Geschlechterstereotype in KI-generierten Bildern
  - Beispiele NEIN: Demografische Daten enthalten Geschlecht, aber kein Gender-Fokus

- **Diversitaet**: Thematisiert Diversitaet, Inklusion oder Repraesentation verschiedener Gruppen.
  - Beispiele JA: Inklusive KI-Entwicklung mit marginalisierten Communities, Repraesentation verschiedener Ethnien in Trainingsdaten
  - Beispiele NEIN: Diverse Methoden verwendet (methodische Diversitaet, nicht sozial)

- **Feministisch**: Verwendet feministische Theorie, Methodik oder Perspektive. Auch implizit feministische Ansaetze zaehlen: intersektionale Analysen, kritische Betrachtung von Machtstrukturen, Fokus auf marginalisierte Gruppen aus Geschlechterperspektive.
  - Beispiele JA: Intersektionale Analyse nach Crenshaw, Kritik aus feministischer Technikforschung
  - Beispiele NEIN: Gender nur als Variable erwaehnt ohne kritische Perspektive

- **Fairness**: Thematisiert algorithmische Fairness, faire ML-Systeme oder Fairness-Metriken.
  - Beispiele JA: Fairness-Metriken fuer Klassifikationsmodelle, Fair ML Frameworks und Debiasing-Strategien
  - Beispiele NEIN: Allgemeine Ethik-Diskussion ohne spezifischen Fairness-Bezug

## STRIKTE Entscheidungslogik

Paper wird eingeschlossen wenn BEIDE Bedingungen erfuellt sind:

1. TECHNIK: Mindestens eine dieser Kategorien ist Ja:
   - AI_Literacies (KI-Kompetenzen)
   - Generative_KI (LLMs, ChatGPT, etc.)
   - Prompting (Prompt-Engineering)
   - **KI_Sonstige** (klassisches ML, algorithmische Systeme)

2. SOZIAL: Mindestens eine dieser Kategorien ist Ja:
   - Soziale_Arbeit
   - Bias_Ungleichheit
   - Gender
   - Diversitaet
   - Feministisch
   - Fairness

WICHTIG: Die Decision MUSS konsistent mit den Kategorie-Bewertungen sein!
Wenn Technik UND Sozial erfuellt -> Include.
Wenn nur Technik ODER nur Sozial -> Exclude.

## WICHTIG - Negative Constraints (Sycophancy-Mitigation)

Klassifiziere restriktiv. Bei Unsicherheit: "Nein" statt "Ja".

- **Feministisch = "Ja"** NUR wenn der Text EXPLIZIT feministische Theorie, Methoden oder Perspektiven verwendet ODER sich auf feministische Autor:innen bezieht (z.B. Crenshaw, Haraway, hooks, D'Ignazio, Harding, Butler). Implizite Naehe zu Gender-Themen reicht NICHT.
- **Soziale_Arbeit = "Ja"** NUR wenn der Text einen direkten Bezug zu sozialarbeiterischer Praxis, Theorie, Ausbildung oder Zielgruppen Sozialer Arbeit herstellt. Allgemeine "social impact"-Diskussionen reichen NICHT.
- **Prompting = "Ja"** NUR wenn Prompt-Engineering, Prompt-Strategien oder Eingabegestaltung ein substantielles Thema des Papers sind. Beilaeufige Erwaehnung von Prompts reicht NICHT.
- Vergib insgesamt nicht mehr als 4-5 Kategorien mit "Ja" pro Paper, es sei denn, der Text adressiert tatsaechlich mehr Bereiche mit Substanz.
- Eine Kategorie ist "Ja" nur wenn der Text sie SUBSTANTIELL behandelt, nicht wenn sie am Rande erwaehnt wird.

## Exclusion Reasons

Falls Exclude: Duplicate, Not_relevant_topic, Wrong_publication_type, No_full_text, Language

## Studientypen

- Empirisch
- Experimentell
- Theoretisch
- Konzept
- Literaturreview
- Unclear

## Output-Format (JSON)

Antworte NUR mit diesem JSON-Objekt:

```json
{
  "AI_Literacies": "Ja" | "Nein",
  "Generative_KI": "Ja" | "Nein",
  "Prompting": "Ja" | "Nein",
  "KI_Sonstige": "Ja" | "Nein",
  "Soziale_Arbeit": "Ja" | "Nein",
  "Bias_Ungleichheit": "Ja" | "Nein",
  "Gender": "Ja" | "Nein",
  "Diversitaet": "Ja" | "Nein",
  "Feministisch": "Ja" | "Nein",
  "Fairness": "Ja" | "Nein",
  "Decision": "Include" | "Exclude" | "Unclear",
  "Exclusion_Reason": "..." | null,
  "Studientyp": "Empirisch" | "Experimentell" | "Theoretisch" | "Konzept" | "Literaturreview" | "Unclear",
  "Confidence": 0.0-1.0,
  "Reasoning": "Kurze Begruendung (max 100 Woerter)"
}
```

---

## User Message Template

```
## Paper zur Bewertung

**Titel:** {Title}
**Autor/Jahr:** {Author_Year}

**Abstract:**
{Abstract}

Bewerte dieses Paper gemaess den definierten Kategorien.
```

---

## Verwendung

Das Script `run_llm_assessment.py` generiert diesen Prompt automatisch aus `categories.yaml`.
Diese Datei dient der Dokumentation und manuellen Referenz.

*Aktualisiert: 2026-02-18*
