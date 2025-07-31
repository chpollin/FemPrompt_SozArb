# Deep-Research → Literaturverwaltung (Zotero): Workflow-Dokumentation

Der folgende Workflow verbindet KI-gestützte Deep-Research-Prompts mit systematischer Literaturverwaltung in Zotero.

## Workflow

**1. Parametrisierter Deep-Research-Prompt**

Ein standardisierter Prompt definiert Fachrolle (z.B. "Experte für systematische Literaturanalyse"), Ziel (z.B. Literaturbericht), Kontext (Forschungsfrage, Zeitrahmen, geografische Eingrenzung), Analyseschritte (Recherche, Bewertung, Synthese) und Ausgabeformat (z.B. APA-Zitation, Qualitätsbewertung). Diese Parameter gewährleisten eine flexible Wiederverwendbarkeit.

```
KONTEXT:
***
Wie können feministische Digital- und KI-Kompetenzen (Digital / AI Literacies) und diversitätsreflektierendes Prompting dazu beitragen, Bias und intersektionale Diskriminierungsformen in KI-Technologien sichtbar zu machen und zu reduzieren?
***

You are an expert in systematic scientific literature analysis. You conduct comprehensive research, summarise relevant sources accurately, critically evaluate their quality and cite them correctly in APA style.

Your task:
1. Identify relevant academic literature on the topic ‘[Topic]’ from 2023-2025, especially from peer-reviewed sources.
2. Create a concise summary (max. 150 words) for each source, accurately presenting the central key messages.
3. Cite each source completely in APA format (with URL)
4. Evaluate the quality of each source systematically and transparently (high/medium/low), justifying your evaluation explicitly with:  
   - Peer review status  
   - Reputation of the journal (e.g. impact factor)  
   - Methodological robustness  
   - Citation frequency and influence of the publication.
   - The quality of the text and the relevance of the topic.

The results serve as a comprehensive scientific review and must be written in a neutral, precise, academic style. Structure of the answer:

1. APA citation  
2. Concise summary of the key statements  
3. Critical quality assessment including explicit justification
```

**2. Ausführung mit mehreren KI-Modellen**

Der Prompt wird parallel in mehreren KI-Umgebungen (Gemini, Claude, OpenAI, Perplexity) ausgeführt. Jedes Modell generiert eigenständig Fachliteratur-Recherchen, Zusammenfassungen und Qualitätsbewertungen (Peer-Review-Status, methodische Solidität, Relevanz).

**3. RIS-Export**

Die KI-Ergebnisse werden mithilfe eines spezialisierten System-Prompts ins RIS-Format konvertiert, ein standardisiertes, tagbasiertes Format (u.a. Felder: TY, AU, PY, T1). KI-generierte Zusammenfassungen und Qualitätsbewertungen werden in RIS-Notizenfeldern (AB/N1) gespeichert.

```
You are a precise and efficient RIS formatter. Given any scholarly reference input (title, authors, journal, year, DOI, URL, abstract, and quality notes), your task is to accurately convert it into RIS format, strictly following this template:

TY  - [Entry type: JOUR, CONF, RPRT, etc.]
AU  - [Author 1 surname, Initial.]
AU  - [Author 2 surname, Initial.] (Repeat for each author)
PY  - [Year]
TI  - [Title]
JO  - [Journal/Book Title or Conference Name/ or what the document type is]
DO  - [DOI]
UR  - [URL]
AB  - [Concise abstract summarizing key points clearly]
N1  - Quality: [Concise quality assessment notes]
ER  -

Always maintain accuracy and completeness, and do not add fields beyond what's specified.
```

**4. Zotero-Import**

Die RIS-Daten werden direkt in Zotero importiert ("File → Import" oder "Import from Clipboard"). Quellen aus unterschiedlichen KI-Modellen werden zur Nachvollziehbarkeit in separaten Sammlungen organisiert.

**5. Expert-in-the-Loop**

Fachwissenschaftler validieren und kuratieren die importierten Einträge manuell:

- Prüfung von Qualität, Relevanz und Impact
- Dublettenentfernung (Zotero-unterstützt)
- Ergänzung/Korrektur bibliografischer Angaben
- Strukturierung, Verschlagwortung und finale Auswahl

## Workflow-Diagramm

![Deep Research Workflow](image-url-placeholder)