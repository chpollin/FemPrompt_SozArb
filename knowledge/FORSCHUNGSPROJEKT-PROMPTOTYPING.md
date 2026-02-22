# Forschungsprojekt: Promptotyping als epistemische Praxis

**Arbeitstitel:** Promptotyping -- Epistemische Infrastruktur fuer LLM-gestuetzte Wissensproduktion sichtbar machen

**Kontext:** Aufbauend auf dem Elisabeth-List-Fellowship-Projekt "Diversitaetssensibler Umgang mit Kuenstlicher Intelligenz" (Universitaet Graz, 2025-2026) und dem Paper fuer Forum Wissenschaft 2/2026.

---

## 1. Problemstellung

### Was wir haben

Ein abgeschlossener LLM-gestuetzter Literature Review mit:
- 326 Papers, 249 destillierte Wissensdokumente, dualer Bewertungspfad (Human + LLM)
- Dokumentierte Pipeline: Identifikation -> Konversion -> Wissensextraktion -> Assessment -> Synthese
- Messbarer Befund: Epistemische Asymmetrie (Kappa 0,035; Konfusionsmatrix zeigt systematisches Muster)
- Theoretischer Rahmen: Epistemische Infrastruktur (Workflow, Research Integrity, Institutionell, Community)
- Paper, das diesen Prozess beschreibt (17.975 Zeichen)

### Was wir nicht haben

Das Paper *beschreibt* die epistemische Infrastruktur. Es *zeigt* sie nicht. Die Leser:innen muessen uns glauben, dass die Pipeline so funktioniert wie behauptet. Das Repository ist offen, aber ein Git-Repository ist kein epistemisches Werkzeug -- es archiviert, es erklaert nicht.

Der bestehende Obsidian-Vault ist ein **flacher Paper-Index mit Keyword-Listen**, kein Wissensgraph:
- 226 Paper-Notes (von 249 erwartet) -- Titel-Matching verliert 23 Papers
- 79 Konzept-Dateien, davon viele fragmentiert (8 Varianten von "Stereotyp", Deutsch/Englisch unsortiert)
- Konzept-Notes enthalten nur Backlink-Listen, keine Definitionen, keine Relationen
- "Related Concepts" ueberall leer
- Synthese-Ordner leer

### Die Luecke

Zwischen dem Paper (Text) und dem Repository (Code + Daten) fehlt eine dritte Darstellungsform: eine, die den **Forschungsprozess selbst als navigierbares epistemisches Artefakt** zeigt. Nicht als Dashboard, nicht als Vault, sondern als Werkzeug, das die Frage beantwortet: *Was passiert mit Wissen, wenn es durch eine LLM-gestuetzte Pipeline fliesst?*

---

## 2. Forschungsfrage

**Wie laesst sich die epistemische Transformation von Wissen in einem LLM-gestuetzten Forschungsprozess sichtbar, navigierbar und auditierbar machen?**

Unterfragen:
1. Welche Informationen gehen bei jedem Pipeline-Schritt verloren, welche werden hinzugefuegt?
2. Wo divergieren maschinelle und menschliche Wissensproduktion -- und was zeigen diese Divergenzen?
3. Wie kann ein Interface die epistemische Qualitaet eines Forschungsprozesses *zeigen* statt nur *behaupten*?

---

## 3. Konzept: Promptotyping

### Begriffsdefinition

**Promptotyping** verbindet "Prompting" (die Steuerung von LLMs durch strukturierte Eingaben) mit "Prototyping" (das iterative Entwickeln von Artefakten, um Wissen zu materialisieren). Promptotyping bezeichnet die Praxis, LLM-gestuetzte Forschungsprozesse so zu dokumentieren und darzustellen, dass die epistemischen Entscheidungen -- was wird abgefragt, wie wird gefiltert, wo entscheiden Menschen, wo Maschinen -- sichtbar und nachvollziehbar werden.

Promptotyping ist kein Produkt, sondern eine **epistemische Praxis**: der Forschungsprozess wird zum Forschungsgegenstand.

### Drei Haltungen

Jede Darstellung im Promptotyping operiert auf drei Haltungen:

| Haltung | Frage | Zeigt |
|---------|-------|-------|
| **Zeigen, was ist** | Was hat der Prozess produziert? | Daten, Zahlen, Ergebnisse |
| **Zeigen, wie es entstanden ist** | Welche Entscheidungen stecken dahinter? | Prompts, Konfigurationen, Designentscheidungen |
| **Zeigen, was nicht geht** | Wo liegen die Grenzen? | Verluste, Luecken, nicht auditierbare Schritte |

Diese drei Haltungen sind nicht dekorativ. Sie operationalisieren Haraways "situiertes Wissen": Jeder Befund wird zusammen mit seinen Entstehungsbedingungen und seinen Grenzen praesentiert.

---

## 4. Architektur: Drei Schichten

### Schicht 1: Wissensgraph (Obsidian Vault, neu gebaut)

**Problem des bestehenden Vaults:** Flach, fragmentiert, konzeptlos.

**Neuer Ansatz:** Der Vault wird zum eigentlichen Forschungsartefakt. Nicht ein Index, sondern ein **epistemisches Netzwerk**, in dem:

**a) Paper-Notes** die volle Pipeline-Geschichte tragen:
- YAML-Frontmatter mit Assessment-Daten (wie jetzt)
- Aber zusaetzlich: **Transformation-Trail** -- an jedem Paper ist sichtbar, was bei jedem Pipeline-Schritt passiert ist:
  - Stage 1 (JSON-Extraktion): welche Informationen hat das LLM extrahiert?
  - Stage 2 (Formatierung): was wurde deterministisch umformatiert?
  - Stage 3 (Verifikation): Confidence-Score, welche Felder wurden als problematisch markiert?
  - Assessment: Human-Entscheidung vs. LLM-Entscheidung, bei Divergenz: die Kategorien im Vergleich

**b) Konzept-Notes** werden semantisch fundiert:
- Definition (aus den Knowledge-Docs extrahiert, LLM-gestuetzt mit Quellenangabe)
- Frequency UND Tiefe (wie oft erwaehnt vs. wie zentral fuer das Paper)
- Relationen zu anderen Konzepten (co-occurrence in Papers, semantische Naehe)
- Deutsch/Englisch-Konsolidierung (ein Konzept, nicht 8 Varianten)

**c) Pipeline-Notes** als neue Dokumenttyp-Klasse:
- Jeder Pipeline-Schritt hat eine eigene Note: `Pipeline/Identifikation.md`, `Pipeline/Konversion.md`, `Pipeline/SKE.md`, `Pipeline/Assessment.md`, `Pipeline/Synthese.md`
- Jede Note enthaelt: den genutzten Prompt (versioniert), die Konfiguration, die Ergebnisstatistik, die bekannten Limitationen
- Backlinks zu allen Papers, die diesen Schritt durchlaufen haben

**d) Divergenz-Notes** als epistemische Marker:
- Jeder der 111 Disagreement-Faelle bekommt eine Note
- Inhalt: Human-Entscheidung, LLM-Entscheidung, Kategorien-Vergleich, LLM-Reasoning-Auszug
- Klassifikation nach den drei Mustern aus dem Paper (Keyword-Inklusion, Semantische Expansion, Implizite Feldzugehoerigkeit)
- Backlinks zu betroffenen Konzepten und Pipeline-Stufen

### Schicht 2: Web-Interface (GitHub Pages)

**Nicht:** Ein Dashboard, das Zahlen zeigt.
**Sondern:** Ein Interface, das den Wissensgraphen navigierbar macht fuer Leser:innen *ohne* Obsidian.

**Kernfunktionen:**

**a) Paper-Journey:**
Ein einzelnes Paper auswaehlen und seine Transformation durch die Pipeline verfolgen:
- PDF -> Markdown (was ging verloren? Tabellen, Abbildungen, Fussnoten?)
- Markdown -> Knowledge-Doc (was hat das LLM extrahiert? Was nicht?)
- Knowledge-Doc -> Assessment (wie hat Human bewertet? Wie LLM? Warum die Divergenz?)

**b) Konzept-Explorer:**
Konzepte als Netzwerk, nicht als Liste. Klick auf ein Konzept zeigt:
- Welche Papers verwenden es?
- Mit welchen anderen Konzepten tritt es auf?
- Wie unterschiedlich verwenden Human- und LLM-Assessment dieses Konzept?

**c) Divergenz-Navigator:**
Die 111 Disagreement-Faelle als Haupteinstieg (nicht als Fehlerliste):
- Filterbar nach Muster (Keyword-Inklusion, Semantische Expansion, Implizite Feldzugehoerigkeit)
- Filterbar nach Kategorie
- Jeder Fall zeigt den Vergleich: Human-Sicht vs. LLM-Sicht

**d) Pipeline-Durchlicht:**
Die gesamte Pipeline als Sankey-Diagramm oder Flow:
- 326 Papers fliessen durch die Stufen
- An jeder Stufe: wie viele gehen verloren? Warum?
- Klick auf eine Stufe zeigt den Prompt, die Konfiguration, die Limitation

### Schicht 3: Das Paper (bereits vorhanden, wird erweitert)

Das bestehende Paper (Forum Wissenschaft) beschreibt die Methodik. Das Promptotyping-Interface wird als **Companion** referenziert -- nicht als Illustration, sondern als eigenstaendiges epistemisches Artefakt, das die Behauptungen des Papers nachvollziehbar macht.

---

## 5. Operationalisierung

### Phase 1: Vault-Neubau (Daten-Infrastruktur)

| Schritt | Beschreibung | Input | Output |
|---------|-------------|-------|--------|
| 1.1 | Konzept-Extraktion neu (LLM-gestuetzt statt Regex) | 249 Knowledge-Docs | Konsolidierte Konzept-Liste mit Definitionen |
| 1.2 | Co-Occurrence-Matrix berechnen | Konzepte x Papers | Konzept-Relationen |
| 1.3 | Transformation-Trail pro Paper | Stage1-JSON + Stage2-Draft + Verification-JSON + Assessment-CSVs | Integrierte Paper-Notes |
| 1.4 | Divergenz-Analyse aufbereiten | 111 Disagreement-Faelle + LLM-Reasoning | Klassifizierte Divergenz-Notes |
| 1.5 | Pipeline-Notes generieren | Prompts (aus Code), Konfiguration, Statistiken | 5 Pipeline-Stufen-Dokumente |
| 1.6 | Vault generieren (neues Script) | Alles oben | Obsidian Vault mit 4 Dokumenttypen |

**Geschaetzte Kosten:** ~$5-10 (LLM-gestuetzte Konzept-Extraktion + Definitionen fuer ~80 Konzepte)

### Phase 2: Datengenerator (JSON fuer Web-Interface)

| Schritt | Beschreibung | Input | Output |
|---------|-------------|-------|--------|
| 2.1 | `generate_promptotyping_data_v2.py` | Vault + Pipeline-Artefakte | `promptotyping_data_v2.json` |
| 2.2 | Konzept-Netzwerk als Graph-Daten | Co-Occurrence-Matrix | Nodes + Edges JSON |
| 2.3 | Paper-Journey-Daten | Transformation-Trails | Per-Paper JSON-Objekte |
| 2.4 | Sankey-Flow-Daten | Pipeline-Statistiken | Flow-Daten fuer D3 |

### Phase 3: Web-Interface (GitHub Pages)

| Schritt | Beschreibung | Technologie |
|---------|-------------|-------------|
| 3.1 | Paper-Journey-View | Vanilla JS + CSS Transitions |
| 3.2 | Konzept-Explorer | D3.js Force-Graph oder Sigma.js |
| 3.3 | Divergenz-Navigator | Filterable List + Detail-Panel |
| 3.4 | Pipeline-Durchlicht | D3.js Sankey oder Alluvial |
| 3.5 | Integration: alle Views als Tabs oder Router | Vanilla JS |

---

## 6. Was dieses Projekt *nicht* ist

| Abgrenzung | Begruendung |
|------------|-------------|
| Kein CMS / Content-Management-System | Es geht nicht darum, Papers zu verwalten, sondern den Forschungsprozess sichtbar zu machen |
| Keine Visualisierung "fuer sich" | Jede Visualisierung hat eine epistemische Funktion: sie zeigt, was sonst unsichtbar bliebe |
| Kein generisches Tool | Es ist spezifisch fuer *diesen* Forschungsprozess, nicht als Framework gedacht |
| Kein Ersatz fuer das Paper | Das Paper argumentiert; das Interface zeigt |
| Kein AI-Playground | Keine Live-LLM-Interaktion, alles auf reproduzierbaren Daten |

---

## 7. Forschungsbeitrag

### Zum Paper (Forum Wissenschaft)

Das Paper behauptet: "Epistemische Infrastruktur transformiert LLM-Einsatz von situativer Unterstuetzung zu nachvollziehbarer, verantwortbarer Wissensproduktion."

Das Promptotyping-Interface *belegt* diese Behauptung: Es zeigt die Infrastruktur als navigierbares Artefakt. Leser:innen koennen nachpruefen, was das Paper behauptet.

### Zum Feld (LLM-gestuetzte Forschung)

Aktuell gibt es:
- Viele Papers *ueber* LLM-gestuetzte Forschung
- Einige Repositories *hinter* solchen Papers
- Kaum Artefakte, die den *Prozess selbst* als Forschungsgegenstand darstellen

Promptotyping fuellt diese Luecke: Es ist ein Vorschlag, wie LLM-gestuetzte Forschungsprozesse so dokumentiert werden koennen, dass andere Forscher:innen die epistemischen Entscheidungen nachvollziehen koennen -- ohne das Repository klonen und den Code lesen zu muessen.

### Zur Sozialen Arbeit

Fuer Forscher:innen und Lehrende in der Sozialen Arbeit, die LLMs einsetzen wollen, zeigt das Interface konkret:
- Wo LLMs gut funktionieren (explizite Begriffe: "Feministisch" hat den besten Kappa)
- Wo sie systematisch versagen (implizites Feldwissen: "Gender" hat den schlechtesten)
- Was "AI Literacy" in der Praxis bedeutet: nicht Bedienungsanleitung, sondern Verstaendnis der Jagged Frontier

---

## 8. Bezug zum CSAP-Protokoll

Das CSAP (Context Stream Agent Protocol) definiert Dokumenttypen und Uebergabe-Protokolle fuer Multi-Agenten-Systeme. Fuer das Promptotyping-Projekt ist relevant:

| CSAP-Konzept | Promptotyping-Umsetzung |
|--------------|------------------------|
| KNOWLEDGE-DOC (persistentes Wissen) | Paper-Notes und Konzept-Notes im Vault |
| ANALYSIS (interpretative Ebene) | Divergenz-Notes (111 Disagreement-Faelle, klassifiziert) |
| BRIDGE-DOC (Uebergang zwischen Kontexten) | Pipeline-Notes (verbinden Stufen, dokumentieren Transformationen) |
| Loss Profile (was geht bei Uebergabe verloren) | Transformation-Trail pro Paper (an jedem Schritt: was rein, was raus, was verloren) |
| Handoff Parameters (was der naechste Agent braucht) | Prompt-Dokumentation pro Pipeline-Stufe |

Das CSAP wird nicht als Protokoll implementiert, sondern als **konzeptuelle Vorlage** fuer die Dokumenttypen im Vault.

---

## 9. Abhaengigkeiten und Risiken

| Risiko | Wahrscheinlichkeit | Mitigation |
|--------|-------------------|------------|
| Vault-Neubau dauert laenger als erwartet | Mittel | Phase 1 ist scriptbasiert und reproduzierbar; Iteration moeglich |
| Konzept-Extraktion (LLM) liefert inkonsistente Ergebnisse | Mittel | Deterministische Nachbearbeitung (Synonym-Map, Schwellenwerte) |
| Web-Interface wird zu komplex fuer statisches Hosting | Niedrig | Alles Client-Side (JS + JSON), kein Backend noetig |
| Paper-Deadline (4. Mai 2026) wird gefaehrdet | Niedrig | Paper ist zu 99% fertig; Promptotyping ist Companion, nicht Vorbedingung |
| Konzept-Explorer (D3-Graph) wird visuell ueberladen | Hoch | Clustering, Zoom, Filter; oder Fallback auf einfachere Darstellung |

---

## 10. Naechste Schritte

1. **Entscheidung treffen:** Dieses Konzept als Arbeitsbasis annehmen (oder modifizieren)
2. **Phase 1 starten:** `generate_vault_v2.py` schreiben -- neues Vault-Script mit Konzept-Extraktion (LLM), Transformation-Trails, Pipeline-Notes, Divergenz-Notes
3. **Phase 2:** Datengenerator fuer das Web-Interface
4. **Phase 3:** Interface bauen (iterativ, beginnend mit Paper-Journey-View)

---

*Erstellt: 2026-02-22*
