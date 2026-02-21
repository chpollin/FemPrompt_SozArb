# Deep-Research Prompt-Template

**Status:** Aus Git-History restauriert (Original: `knowledge/Operativ.md`, Commit `0a98f49`, 31.10.2025)
**Hinweis:** Dies ist das **parametrische Template** mit Platzhaltern. Der exakt instanziierte Prompt, wie er in die 4 Deep-Research-Interfaces eingefuegt wurde, wurde nie committed und ist genuinely verloren.

---

## 1. Basis-Template fuer Deep Research

Das Template strukturiert KI-Anfragen durch fuenf Komponenten. Die Rolle definiert die Expertenperspektive, die Aufgabe spezifiziert den Output-Typ, der Kontext bettet Forschungsziele ein, Analyseschritte strukturieren den Prozess, das Output-Format standardisiert Ergebnisse.

```markdown
# ROLLE
Du bist ein systematischer Literature Review Experte mit Spezialisierung auf [FACHGEBIET].
Deine Expertise umfasst [SPEZIFISCHE KOMPETENZEN].

# AUFGABE
Erstelle eine comprehensive bibliographische Recherche zum Thema: "[FORSCHUNGSFRAGE]"
Output-Typ: Annotierte Bibliographie mit strukturierten Metadaten

# KONTEXT
Forschungsziel: [ZIEL]
Theoretischer Rahmen: [THEORIEN]
Zeitlicher Scope: [ZEITRAHMEN]
Geografischer Fokus: [REGION]
Sprachen: [SPRACHEN]

# ANALYSESCHRITTE
1. Identifiziere 20-30 hochrelevante Publikationen
2. Priorisiere peer-reviewed Journals und aktuelle Konferenzbeitraege
3. Inkludiere Schluesselautoren: [AUTORENLISTE]
4. Beruecksichtige interdisziplinaere Perspektiven aus: [DISZIPLINEN]
5. Strukturiere nach thematischen Clustern

# OUTPUT-FORMAT
Fuer jede Quelle:
- Vollstaendige bibliographische Angaben (APA 7)
- 150-200 Woerter strukturierte Zusammenfassung
- Relevanz-Score (1-5) mit Begruendung
- Methodischer Ansatz
- Kernbefunde
- Theoretische Verortung
- Verbindungen zu anderen Quellen
```

**Ausfuehrung:** Manuelles Copy-Paste in 4 Deep Research Interfaces (ChatGPT, Claude, Gemini, Perplexity). Identischer Prompt fuer alle 4 Modelle.

---

## 2. RIS-Konvertierungs-Prompt

```markdown
Konvertiere die folgenden bibliographischen Angaben in das RIS-Format.
Behalte alle Metadaten bei und ergaenze fehlende Standardfelder.
Nutze TY, AU, TI, JO, VL, IS, SP, EP, PY, DO, AB, KW Tags.
Validiere DOIs gegen CrossRef-Format.
Markiere unsichere Angaben mit N1 - Note.
```

---

## 3. Dokumenten-Zusammenfassungs-Prompt

```markdown
Analysiere das folgende akademische Dokument in fuenf Schritten:

1. AKADEMISCHE ANALYSE
- Identifiziere Forschungsfrage und Hypothesen
- Extrahiere methodisches Vorgehen
- Liste Hauptergebnisse
- Notiere theoretischen Rahmen

2. STRUKTURIERTE SYNTHESE
Erstelle eine 200-Wort-Zusammenfassung mit:
- Kontext und Relevanz
- Methodik und Sample
- Kernbefunde
- Implikationen

3. KRITISCHE VALIDIERUNG
- Pruefe interne Konsistenz
- Identifiziere Limitationen
- Bewerte Generalisierbarkeit

4. BEREINIGTE ZUSAMMENFASSUNG
Erstelle finale 150-Wort-Version fuer Datenbank

5. METADATEN-EXTRAKTION
Format als YAML:
- keywords: []
- methods: []
- theories: []
- sample_size:
- geographic_scope:
- temporal_scope:
```

---

## 4. Rekonstruierte Parametrisierung

Die folgenden Werte wurden aus verschiedenen Repo-Quellen rekonstruiert. Sie sind **nicht** der exakte Wortlaut des instanziierten Prompts.

| Placeholder | Rekonstruierter Wert | Quelle | Sicherheit |
|---|---|---|---|
| `[FACHGEBIET]` | Feministische KI-Forschung / Feminist AI Research | `prompts/CHANGELOG.md` Z.24 | Hoch |
| `[FORSCHUNGSFRAGE]` | Feministische Digital/AI Literacies und diversitaetsreflektierendes Prompting | OpenAI-PDF-Titel, `knowledge/methods-and-pipeline.md` | Hoch |
| `[ZEITRAHMEN]` | 2023-2025 | OpenAI-PDF-Titel: "...(2023-2025)" | Hoch |
| `[THEORIEN]` | Intersektionale Analyse, feministische AI-Literacy | `knowledge/paper/Workflow...md` Z.68 | Mittel |
| `[DISZIPLINEN]` | Social Work Journals, DH-Konferenzen | `knowledge/paper/Workflow...md` Z.68 | Mittel |
| `[SPRACHEN]` | DE/EN | `knowledge/methods-and-pipeline.md` | Hoch |
| `[SPEZIFISCHE KOMPETENZEN]` | Nicht rekonstruierbar | -- | Verloren |
| `[ZIEL]` | Nicht exakt rekonstruierbar | -- | Verloren |
| `[REGION]` | Nicht rekonstruierbar | -- | Verloren |
| `[AUTORENLISTE]` | Nicht rekonstruierbar | -- | Verloren |

---

## 5. Was genuinely verloren ist

1. **Der exakt instanziierte Prompt-Text:** Wurde manuell in 4 Interfaces kopiert, nie in Git gespeichert
2. **Mehrere Placeholder-Werte:** Autorenliste, spezifische Kompetenzen, Forschungsziel (exakter Wortlaut), Region
3. **OpenAI/ChatGPT Raw-Output:** War nur als binaere PDF committed, nicht als Text
4. **Etwaige Variationen:** Ob der Prompt zwischen den 4 Modellen identisch war oder leicht angepasst wurde, ist nicht pruefbar

---

## 6. Verfuegbare Artefakte

| Artefakt | Pfad | Status |
|---|---|---|
| Raw Output Claude | `deep-research/restored/raw/Claude_deep-research.md` | Vorhanden |
| Raw Output Gemini | `deep-research/restored/raw/Gemini_deep-research.md` | Vorhanden |
| Raw Output Perplexity | `deep-research/restored/raw/Perplexity_deep-research.md` | Vorhanden |
| Raw Output OpenAI | -- | Verloren (nur binaere PDF existierte) |
| RIS Claude | `deep-research/restored/Claude.ris` | Vorhanden |
| RIS Gemini | `deep-research/restored/Gemini.ris` | Vorhanden |
| RIS OpenAI | `deep-research/restored/OpenAI.ris` | Vorhanden |
| RIS Perplexity | `deep-research/restored/Perplexity.ris` | Vorhanden |
| RIS Template | `deep-research/restored/ris-template.md` | Vorhanden |

---

*Aktualisiert: 2026-02-18*
