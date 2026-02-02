# Repository-Analyse: FemPrompt_SozArb

## Aufgabe

Analysiere das Repository `https://github.com/chpollin/FemPrompt_SozArb` vollständig und erstelle einen strukturierten Bericht.

## Analyse-Dimensionen

### 1. Struktur
- Verzeichnisbaum mit allen Ordnern und Dateien
- Welche Komponenten existieren? (Scripts, Daten, Dokumentation, Prompts)

### 2. Pipeline-Status
Das Repository implementiert eine 3-Phasen Literature Review Pipeline:

**Phase 1 (Identifikation):** Deep Research mit 4 LLMs → RIS-Export → Zotero
- Welche Dateien gehören hierzu?
- Welche Prompts existieren?
- Was ist der Output?

**Phase 2 (Bewertung):** LLM-Assessment vs. Human-Assessment nach PRISMA
- Gibt es Assessment-Scripts?
- Welche Bewertungskriterien sind implementiert?
- Wo werden Human-Ratings gespeichert?

**Phase 3 (Synthese):** PDF → Markdown → LLM-Analyse → Obsidian Knowledge Graph
- Welche Konversions-Tools werden verwendet?
- Welche Analyse-Prompts existieren?
- Wie sieht das Output-Format aus?

### 3. Datenstand
- Wie viele Quellen sind in Zotero/RIS?
- Wie viele PDFs wurden konvertiert?
- Wie viele Markdown-Analysen existieren?
- Was fehlt noch?

### 4. Prompts
Liste alle Prompts mit:
- Dateiname
- Zweck
- Input-Parameter
- Output-Format

### 5. Offene TODOs
- Was ist im Code als TODO markiert?
- Welche README-Abschnitte sind unvollständig?
- Was fehlt für eine vollständige Pipeline?

## Output-Format

```markdown
# FemPrompt_SozArb Repository Analysis

## Verzeichnisstruktur
[Tree-Darstellung]

## Pipeline-Komponenten

### Phase 1: Identifikation
- Status: [complete/partial/missing]
- Dateien: [Liste]
- Prompts: [Liste mit Kurzbeschreibung]

### Phase 2: Bewertung
- Status: [complete/partial/missing]
- Dateien: [Liste]
- Human-Assessment: [Status]
- LLM-Assessment: [Status]

### Phase 3: Synthese
- Status: [complete/partial/missing]
- Dateien: [Liste]
- Konvertierte PDFs: [Anzahl]
- Analysierte Texte: [Anzahl]

## Datenbestand
- Zotero-Einträge: [n]
- PDFs verfügbar: [n]
- Markdown-Konversionen: [n]
- LLM-Analysen: [n]

## Prompt-Inventar
| Prompt | Zweck | Phase |
|--------|-------|-------|
| ... | ... | ... |

## Kritische Lücken
1. [Was fehlt für Phase 1]
2. [Was fehlt für Phase 2]
3. [Was fehlt für Phase 3]

## Nächste Schritte
[Priorisierte Liste der nächsten Aktionen]
```

## Kontext

Dieses Repository unterstützt ein Paper für Forum Wissenschaft (Deadline: 4. Mai 2026, 18.000 Zeichen). Das Paper dokumentiert den Vergleich zwischen LLM-gestützter und menschlicher Literature Review. Die menschliche Bewertung wird parallel von Susanne Sackl-Sharif und Sabine Klinger durchgeführt.

Forschungsfrage: Wie und wo lassen sich LLM-Stärken mit Expert:innenwissen verbinden, und wo liegen die Grenzen?
