# FemPrompt_SozArb - Nächste Schritte

**Letzte Aktualisierung:** 2025-11-16
**Projekt Status:** SozArb Enhanced Summaries v2.0 komplett (47 papers, 76.1/100 avg quality)

---

## 🔥 Kritisch (Sofort)

### 1. Concepts Dateinamen-Konsistenz herstellen
**Problem:** 15 Concept-Dateien haben falsche Capitalization ("Ai" statt "AI")

**Betroffene Dateien:**
- `Ai_Accountability.md` → `AI_Accountability.md`
- `Ai_Act.md` → `AI_Act.md`
- `Ai_Bias_Mitigation.md` → `AI_Bias_Mitigation.md`
- `Ai_Ethics.md` → `AI_Ethics.md`
- `Ai_Governance.md` → `AI_Governance.md`
- `Ai_Transparency.md` → `AI_Transparency.md`
- `Ai_Workforce_Diversity.md` → `AI_Workforce_Diversity.md`
- `Fair_Ai_Prompting.md` → `Fair_AI_Prompting.md`
- `Feminist_Ai.md` → `Feminist_AI.md`
- `Generative_Ai.md` → `Generative_AI.md`
- `Diversity_In_Ai.md` → `Diversity_In_AI.md`
- `Gender_Bias_In_Ai.md` → `Gender_Bias_In_AI.md`
- `Inclusive_Ai_Design.md` → `Inclusive_AI_Design.md`
- `Explainable_Ai.md` → `Explainable_AI.md`
- `Responsible_Ai.md` → `Responsible_AI.md`

**Action Items:**
- [ ] Umbenennung der 15 Dateien
- [ ] Interne Links in Papers aktualisieren
- [ ] Git commit: "refactor: fix AI capitalization in Concepts filenames"

**Aufwand:** ~15-20 Minuten
**Priorität:** KRITISCH (verhindert Link-Probleme)

---

## ⚠️ Wichtig (Diese Woche)

### 2. Duplikate in Concepts überprüfen
**Problem:** 4 potenzielle Duplikat-Paare gefunden

**Zu überprüfen:**
1. `Chain_of_Thought_CoT.md` vs. `Chain_of_Thought_CoT_Prompting.md`
2. `Explainable_Ai.md` vs. `Explainable_AI_XAI.md` (werden nach Umbenennung kollidieren!)
3. `Large_Language_Models.md` vs. `Large_Language_Models_LLMs.md`
4. `Inclusive_Ai_Design.md` vs. `Inclusive_design.md`

**Action Items:**
- [ ] Inhalte vergleichen (manuell oder mit diff)
- [ ] Entscheiden: Zusammenführen oder getrennt halten
- [ ] Bei Zusammenführung: Bessere Datei behalten, schlechtere löschen
- [ ] Git commit: "refactor: consolidate duplicate Concepts"

**Aufwand:** ~30-45 Minuten
**Priorität:** Wichtig (verhindert Verwirrung)

---

### 3. Vault Integration der 47 Enhanced Summaries
**Ziel:** Integration der Enhanced Summaries v2.0 in SozArb_Research_Vault/Papers/

**Action Items:**
- [ ] Script `integrate_summaries_direct.py` auf SozArb anwenden
- [ ] Prüfen: Werden Summaries korrekt in Papers eingebettet?
- [ ] Alternative: Transclusion-Links statt Direct-Embedding?
- [ ] Git commit: "feat: integrate 47 enhanced summaries into SozArb vault"

**Aufwand:** ~30 Minuten
**Priorität:** Wichtig (vervollständigt Vault)

---

### 4. Konzeptextraktion aus Enhanced Summaries
**Ziel:** Automatische Extraktion von Konzepten aus YAML keywords der 47 Summaries

**Action Items:**
- [ ] Script schreiben: Parse YAML frontmatter aus `SozArb_Research_Vault/Summaries/summary_*.md`
- [ ] Extrahiere `keywords`, `research_domain`, `methodology` Felder
- [ ] Frequenz-Analyse: Welche Konzepte kommen wie oft vor?
- [ ] Neue Concepts erstellen (wenn >2x erwähnt)
- [ ] Git commit: "feat: extract concepts from 47 enhanced summaries"

**Aufwand:** ~1-2 Stunden
**Priorität:** Wichtig (erweitert Knowledge Graph)

---

### 5. Bidirektionale Concept-Links aktualisieren
**Ziel:** Backlinks in Concepts zu neuen Papers hinzufügen

**Action Items:**
- [ ] Script `create_bidirectional_concept_links.py` auf SozArb anwenden
- [ ] Prüfen: Werden alle 47 Papers korrekt verlinkt?
- [ ] Validate: Keine broken links
- [ ] Git commit: "feat: update bidirectional concept links for 47 papers"

**Aufwand:** ~30 Minuten
**Priorität:** Wichtig (vervollständigt Knowledge Graph)

---

## 📅 Normal (Nächste 2 Wochen)

### 6. Vollständige PDF-Akquisition für SozArb
**Ziel:** Weitere 161 Include-Papers verarbeiten (von 222 total)

**Action Items:**
- [ ] Aktiviere alle 8 Fallback-Strategien in `getPDF_intelligent.py`
- [ ] Manuelle Suche für nicht-verfügbare Papers
- [ ] Konvertierung zu Markdown
- [ ] Validation mit `validate_markdown_quality.py`
- [ ] Enhanced Summarization Pipeline v2.0 auf alle neuen Papers anwenden

**Aufwand:** ~8-10 Stunden (verteilt über mehrere Tage)
**Kosten:** ~$6.75 (API costs)
**Priorität:** Normal (erst nach Vault-Integration der 47)

---

### 7. Feminist Analysis Framework implementieren (v3.0)
**Ziel:** Adaptive Prompts mit 9 Dimensionen für high-relevance Papers

**Action Items:**
- [ ] Identify papers with `rel_bias > 2.5` and `rel_vulnerable > 2.5`
- [ ] Develop adaptive prompt templates
- [ ] Test on 3-5 papers
- [ ] Full run on ~30-40 qualifying papers
- [ ] Git commit: "feat: implement feminist analysis framework v3.0"

**Aufwand:** ~4-6 Stunden
**Priorität:** Normal (methodische Erweiterung)

---

### 8. Web Viewer Integration
**Ziel:** SozArb summaries im Obsidian Web Viewer anzeigen

**Action Items:**
- [ ] Implement dynamic Papers/Concepts loading in `docs/js/app.js`
- [ ] Parse YAML frontmatter client-side
- [ ] Render Papers/Concepts als Cards
- [ ] Build knowledge graph visualization
- [ ] Activate GitHub Pages
- [ ] Test on https://chpollin.github.io/FemPrompt_SozArb/

**Aufwand:** ~3-4 Stunden
**Priorität:** Normal (für Publikation nützlich)

---

## 🔮 Optional (Zukünftige Iterationen)

### 9. Meta-Synthesis Dokumente erstellen
**Ziel:** Übergreifende thematische Synthesen aus den 47 Papers

**Action Items:**
- [ ] Thematische Cluster identifizieren
- [ ] Synthese-Dokumente schreiben (z.B. "AI Bias in Social Work: State of the Art")
- [ ] Verlinken zu relevanten Papers
- [ ] Git commit: "docs: add meta-synthesis documents"

**Aufwand:** ~6-8 Stunden
**Priorität:** Optional (für Publikation wertvoll)

---

### 10. Quality Review der 9 Fair-Quality Summaries
**Ziel:** Manuelle Überprüfung der Summaries mit <60/100 Score

**Action Items:**
- [ ] Identify 9 papers mit Quality Score <60/100
- [ ] Manuell lesen und mit Summary vergleichen
- [ ] Prompt refinement wo nötig
- [ ] Re-run Enhanced Pipeline für diese Papers
- [ ] Git commit: "refactor: improve quality of 9 fair-rated summaries"

**Aufwand:** ~3-4 Stunden
**Priorität:** Optional (Quality improvement)

---

## 📊 Fortschritt-Tracking

**Aktueller Stand (2025-11-16):**
- ✅ Enhanced Summarization Pipeline v2.0: KOMPLETT (47 papers)
- ✅ Markdown Quality Validation Tool: ERSTELLT
- ✅ Knowledge/ Dokumentation: VOLLSTÄNDIG AKTUALISIERT
- ⏳ Concepts Umbenennung: AUSSTEHEND
- ⏳ Vault Integration: AUSSTEHEND
- ⏳ Web Viewer: PARTIELL (UI fertig, Daten-Integration ausstehend)

**Pipeline-Status:**
- Assessment: ✅ 100% (325/325 papers)
- PDFs: ✅ 47 von 222 Include-Papers
- Markdown: ✅ 47 von 222 Include-Papers
- Enhanced Summaries v2.0: ✅ 75 summaries (alle vom Nov 16)
- Vault: ⏳ Integration ausstehend
- Web Viewer: ⏳ Daten-Integration ausstehend

---

## 🎯 Empfohlene Reihenfolge

**Heute (2025-11-16):**
1. Concepts Dateinamen-Konsistenz (15 min)
2. Duplikate überprüfen (30 min)

**Diese Woche:**
3. Vault Integration (30 min)
4. Konzeptextraktion (2h)
5. Bidirektionale Links (30 min)

**Nächste Woche:**
6. Web Viewer Integration (4h)
7. PDF-Akquisition starten (2-3 Tage)

**Später:**
8. Feminist Analysis Framework (4-6h)
9. Meta-Synthesis (6-8h)

---

## 📝 Notizen

- Alle knowledge/ Dokumentation ist aktuell (2025-11-16)
- Git Status: clean, alle Änderungen committed und gepushed
- Background Task e2aa94 läuft noch (summary count check)
- Temp file `temp_concepts_list.txt` kann gelöscht werden

---

*Erstellt: 2025-11-16*
*Version: 1.0*
*Nächste Review: Nach Concepts-Umbenennung*
