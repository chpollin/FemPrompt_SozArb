# Deep-Research → Literaturverwaltung (Zotero): Workflow-Dokumentation

Der folgende Workflow verbindet KI-gestützte Deep-Research-Prompts mit systematischer Literaturverwaltung in Zotero.

## Workflow

**1. Parameterisierter Deep-Research-Prompt**
Ein standardisierter Prompt definiert Fachrolle (z.B. „Expert\:in für systematische Literaturanalyse“), Ziel (z.B. Literaturbericht), Kontext (Forschungsfrage, Zeitrahmen, geografische Eingrenzung), Analyseschritte (Recherche, Bewertung, Synthese) und Ausgabeformat (z.B. APA-Zitation, Qualitätsbewertung). Diese Parameter gewährleisten eine flexible Wiederverwendbarkeit.

**2. Ausführung mit mehreren KI-Modellen**
Der Prompt wird parallel in mehreren KI-Umgebungen (Gemini, Claude, OpenAI, Perplexity) ausgeführt. Jedes Modell generiert eigenständig Fachliteratur-Recherchen, Zusammenfassungen und Qualitätsbewertungen (Peer-Review-Status, methodische Solidität, Relevanz).

**3. RIS-Export**
Die KI-Ergebnisse werden mithilfe eines spezialisierten System-Prompts ins RIS-Format konvertiert, ein standardisiertes, tagbasiertes Format (u.a. Felder: TY, AU, PY, T1). KI-generierte Zusammenfassungen und Qualitätsbewertungen werden in RIS-Notizenfeldern (AB/N1) gespeichert.

**4. Zotero-Import**
Die RIS-Daten werden direkt in Zotero importiert („File → Import“ oder „Import from Clipboard“). Quellen aus unterschiedlichen KI-Modellen werden zur Nachvollziehbarkeit in separaten Sammlungen organisiert.

**5. Expert-in-the-Loop**
Fachwissenschaftler\:innen validieren und kuratieren die importierten Einträge manuell:

* Prüfung von Qualität, Relevanz und Impact
* Dublettenentfernung (Zotero-unterstützt)
* Ergänzung/Korrektur bibliografischer Angaben
* Strukturierung, Verschlagwortung und finale Auswahl

![][image1]

[image1]: deep_research_workflow_diagram.png
