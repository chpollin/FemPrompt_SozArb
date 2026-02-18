# Prompt-Changelog

Versionierte Dokumentation aller Prompts, die in der Pipeline und im Assessment eingesetzt werden. Teil der epistemischen Infrastruktur (siehe `knowledge/epistemic-framework.md`).

---

## Prompt-Inventar

| Prompt | Datei | Zeilen | Version | Status |
|--------|-------|--------|---------|--------|
| Deep-Research-Prompt | `prompts/deep-research-template.md` | -- | v1.0 (restauriert) | Template wiederhergestellt, instanziierter Prompt rekonstruiert |
| SKE Stage 1: Extract & Classify | `pipeline/scripts/distill_knowledge.py` | 53-143 | v1.0 | Aktiv, 249 Docs produziert |
| SKE Stage 3: Verify | `pipeline/scripts/distill_knowledge.py` | 223-282 | v1.0 | Aktiv, 249 Docs verifiziert |
| 5D Assessment | `assessment-llm/prompt_template.md` | 1-124 | v1.0 | Aktiv, 325/325 bewertet |
| 10K Assessment | `benchmark/scripts/run_llm_assessment.py` | 37-102 | v2.0 | Getestet (50 Papers) |

---

## Deep-Research-Prompt (restauriert)

**Status:** Template aus Git-History wiederhergestellt (`knowledge/Operativ.md`, Commit `0a98f49`). Instanziierter Prompt mit realen Parameterwerten rekonstruiert, soweit moeglich. Exakter Wortlaut des ausgefuehrten Prompts war nie committed.

**Datei:** `prompts/deep-research-template.md`

**Struktur (5-Komponenten):**
1. Rolle: Literature Review Spezialist fuer feministische KI-Forschung
2. Aufgabe: Annotierte Bibliographie mit strukturierten Metadaten
3. Kontext: Forschungsziele, zeitlicher Scope, geografischer Fokus
4. Analyseschritte: 20-30 Publikationen, peer-reviewed priorisiert
5. Output-Format: APA 7, 150-200 Woerter Summary, Relevanz-Score

**Ausfuehrung:** Manuelles Copy-Paste in 4 Deep Research Interfaces (Gemini, Claude, ChatGPT, Perplexity). Identischer Prompt fuer alle 4 Modelle.

**Genuinely verloren:** Exakter instanziierter Prompt-Text, Autorenliste, spezifische Kompetenzen, Region, OpenAI Raw-Output (nur binaere PDF).

---

## SKE Stage 1: Extract & Classify (v1.0)

**Datei:** `pipeline/scripts/distill_knowledge.py`, Zeilen 53-143
**Variable:** `STAGE1_EXTRACT_CLASSIFY_PROMPT`
**Modell:** Claude Haiku 4.5
**max_tokens:** 3000
**Erstellt:** ca. Januar 2026
**Eingesetzt:** 249 Dokumente (Volllauf)

**Kernstruktur:**
- Rolle: "Experte fuer wissenschaftliche Literaturanalyse im Bereich KI, Soziale Arbeit und Gender Studies"
- Input: Volltext-Markdown
- Output: JSON mit metadata, core (research_question, methodology, key_finding), arguments (3), categories (10 binaer), category_evidence, references, assessment, target_group
- Kategorie-Definitionen: Alle 10 Kategorien mit Beschreibung

**Wichtige Regeln im Prompt:**
- categories: NUR true/false
- category_evidence: NUR fuer Kategorien mit true
- "Feministisch = true NUR wenn explizit feministische Theorie/Methodik verwendet wird"
- references: 3-10 wichtigste zitierte Werke

**Sycophancy-Relevanz:** Der Prompt definiert "Feministisch" restriktiv ("NUR wenn explizit..."), was als negative Constraint wirkt. Aber: Die Rolle "Experte fuer ... Gender Studies" koennte eine implizite Ueberattribuierung bei Gender-nahen Kategorien foerdern.

---

## SKE Stage 3: Verify (v1.0)

**Datei:** `pipeline/scripts/distill_knowledge.py`, Zeilen 223-282
**Variable:** `STAGE3_VERIFY_PROMPT`
**Modell:** Claude Haiku 4.5
**max_tokens:** 1500
**Erstellt:** ca. Januar 2026
**Eingesetzt:** 249 Dokumente (Volllauf)

**Kernstruktur:**
- Rolle: "wissenschaftlicher Qualitaetspruefer"
- Input: Original-Markdown (Ausschnitt) + generiertes Wissensdokument
- Output: JSON mit verification (completeness, correctness, category_validation), overall_confidence, needs_correction, corrections
- Confidence-Formel: Completeness 40% + Correctness 40% + Categories 20%
- Eskalationsregel: needs_correction = true wenn overall_confidence < 75

**Sycophancy-Relevanz:** Gering. Der Prompt definiert eine Pruefrolle, nicht eine Erzeugerrolle. Die Asymmetrie zwischen Erzeugung und Pruefung wird hier genutzt.

---

## 5D Assessment (v1.0)

**Datei:** `assessment-llm/prompt_template.md`
**Modell:** Claude Haiku 4.5
**max_tokens:** nicht explizit gesetzt
**Erstellt:** ca. November 2025
**Eingesetzt:** 325 Papers (Volllauf, 100% Erfolgsrate)

**Kernstruktur:**
- Aufgabe: Paper-Assessment fuer Literature Review "AI Literacy & Bias in Social Work"
- Input: Metadaten (Titel, Autoren, Jahr, Typ, DOI, Sprache, Quelle) + Abstract
- Decision: Include/Exclude/Unclear
- 7 Exclusion-Kategorien
- 5 Relevanz-Dimensionen (0-3): AI_Komp, Vulnerable, Bias, Praxis, Prof
- Output: JSON mit decision, exclusion_reason, scores (5 Integer), note

**Sycophancy-Relevanz:** Mittel. Der Titel "AI Literacy & Bias in Social Work" im Prompt-Header koennte eine allgemeine Tendenz zur Inklusion foerdern. Keine expliziten negativen Constraints.

---

## 10K Assessment (v2.0)

**Datei:** `benchmark/scripts/run_llm_assessment.py`, Zeilen 37-102
**Funktion:** `build_assessment_prompt(categories: dict)`
**Modell:** Claude Haiku 4.5
**max_tokens:** 1024
**Erstellt:** ca. Februar 2026
**Eingesetzt:** Testlauf (50 Papers, v1 + v2)

**Kernstruktur:**
- Rolle: "wissenschaftlicher Reviewer fuer ein Literature Review zu feministischen AI Literacies in der Sozialen Arbeit"
- Dynamisch generiert aus `benchmark/config/categories.yaml`
- 10 binaere Kategorien (Ja/Nein) mit Definitionen, positiven und negativen Beispielen
- Strikte Entscheidungslogik: TECHNIK_OK UND SOZIAL_OK -> Include
- Konsistenzregel: "Du darfst die Logik NICHT mit eigenem Judgment ueberschreiben!"
- Output: JSON mit 10 Kategorien, Decision, Exclusion_Reason, Studientyp, Confidence, Reasoning

**Versionshistorie:**

| Version | Aenderung | Auswirkung |
|---------|-----------|------------|
| v1.0 | Initialer Prompt ohne Konsistenzregel | 20% Inkonsistenzen, "Feministisch" 0x erkannt |
| v2.0 | Konsistenzregel + negative/positive Beispiele pro Kategorie | 6% Inkonsistenzen, "Feministisch" 8x erkannt |
| v2.1 (geplant) | Negative Constraints fuer Sycophancy-Mitigation | Ausstehend |

**Sycophancy-Relevanz:** Hoch. Die Rolle "Reviewer fuer ... feministische AI Literacies" koennte systematische Ueberattribuierung bei feministischen/Gender-Kategorien foerdern. v2.0 verbesserte die Trennschaerfe durch Beispiele, aber negative Constraints fehlen noch.

**Geplante Aenderungen (v2.1):**
- Negative Constraints: "Klassifiziere nur als 'Feministisch', wenn der Text explizit feministische Theorie, Methoden oder Perspektiven verwendet ODER sich auf feministische Autor:innen bezieht"
- "Bei Unsicherheit: 'Nein' statt 'Ja'"
- "Vergib nicht mehr als 3-4 Kategorien pro Paper, es sei denn, der Text adressiert tatsaechlich mehr"
- Calibration Items (3-5 Papers mit bekannter Klassifikation)

---

## Aenderungsprotokoll

| Datum | Prompt | Von | Zu | Begruendung |
|-------|--------|-----|-----|-------------|
| Okt 2025 | Deep-Research | vorhanden | geloescht | Unklar (versehentlich?) |
| Feb 2026 | Deep-Research | geloescht | restauriert | Template aus Git-History, Parametrisierung rekonstruiert |
| Nov 2025 | 5D Assessment | -- | v1.0 | Erstversion, 325/325 bewertet |
| Jan 2026 | SKE Stage 1 + 3 | -- | v1.0 | Erstversion, 249 Docs produziert |
| Feb 2026 | 10K Assessment | v1.0 | v2.0 | Konsistenzregel, Beispiele hinzugefuegt |
| (geplant) | 10K Assessment | v2.0 | v2.1 | Sycophancy-Mitigation |

---

*Aktualisiert: 2026-02-18*
