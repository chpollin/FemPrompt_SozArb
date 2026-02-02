---
type: vault-organisation
created: 2026-01-05
tags: [moc, hub, social-work, ai-literacy]
status: complete
---
# FemPrompt-SozArb - Map of Content

## Summary

Einstiegspunkt für das Literature Review zu feministischem Prompting und AI-Literacy in der Sozialarbeit. Teil des [[SocialAI MOC|SocialAI-Projekts]].

## Aktueller Status (Februar 2026)

> [!info] Pipeline-Status
> - **FemPrompt:** 303 Papers, thematisches Assessment läuft (Susi, Sabine)
> - **SozArb:** 325 Papers, Vault operativ (266 Papers, 144 Konzepte), pausiert
> - **Nächster Schritt:** Assessment abschließen → Pipeline ausführen

| Phase | FemPrompt | SozArb |
|-------|-----------|--------|
| Deep Research | ✅ 303 Papers | ✅ 325 Papers |
| Human Assessment | 🔄 Läuft | ✅ Abgeschlossen |
| LLM Assessment | ⏸️ Wartet | ✅ 100% (222 Include) |
| PDF-Akquise | ⏸️ Wartet | ⏸️ 70% |
| Vault | ⏸️ Wartet | ✅ Operativ |

## Paper in Arbeit

- [[Forum Wissenschaft Paper - Arbeitsplan]]: Deadline 4. Mai 2026, 18.000 Zeichen

## Hauptdokument

- [[Workflow für eine Deep-Research-gestützte Literaturanalyse am Beispiel von feministischem AI-Literacy]]: Methodische Beschreibung des PRISMA-konformen Multi-Model Literature Review Workflows
- [[Abstract - Deep-Research-gestützte Literature Reviews]]: Konferenzabstract zum methodischen Experiment

## Technische Dokumentation

- [[Literature Review Pipeline - Technische Dokumentation]]: Detaillierte Pipeline-Beschreibung (Python-Skripte, Stages, Konfiguration)
- [[Human-LLM Assessment Benchmark]]: Benchmark-Spezifikation für Human-LLM-Vergleich (Kategorien, Datenformate, Metriken)

## Prompts

- [[Parametrisierbarer Literature-Analysis-Prompt]]: Wiederverwendbarer Prompt-Baukasten für Deep Research

## Forschungsfragen

1. Wie manifestiert sich Bias in Frontier-LLMs kontextabhängig?
2. Welche Prompt-Strategien ermöglichen diskriminierungssensible KI-Nutzung?
3. Wie können Sozialarbeitende AI-Literacy entwickeln, die der Systemkomplexität gerecht wird?

## Repository

GitHub: [FemPrompt_SozArb](https://github.com/chpollin/FemPrompt_SozArb) - Transparente Dokumentation aller Prompts, Zwischenergebnisse und Entscheidungsprozesse.

**Verzeichnisstruktur:**
```
FemPrompt_SozArb/
├── analysis/              # 33 Python-Scripts (Kern-Pipeline)
├── assessment-llm/        # LLM-basiertes PRISMA-Assessment
├── assessment/            # Manuelles Assessment (FemPrompt)
├── FemPrompt_Vault/       # Obsidian Vault (in Entwicklung)
├── SozArb_Research_Vault/ # Operativer Vault (266 Papers)
├── docs/                  # Web-Viewer (GitHub Pages ready)
├── knowledge/             # Dokumentation
└── deep-research/         # Multi-Model Outputs
```

## Offene Aufgaben

> [!warning] TODO: Meeting mit Susi
> Kategoriendefinitionen wurden überarbeitet. Abstimmung vor Assessment-Fortführung nötig.

1. ⏳ Meeting mit Susi — Kategorien finalisieren
2. ⏳ Assessment abschließen — 303 Papers (Susi & Sabine)
3. ⏳ Metadata in Zotero ergänzen
4. ⏳ Pipeline ausführen (PDF → Markdown → Summary → Vault)
5. ⏳ Vergleichsanalyse (LLM vs. Human Assessment)
6. ⏳ Paper schreiben (Deadline: 4. Mai 2026)

## Related

- [[SocialAI MOC]]: Übergeordnetes Projekt
- [[Framework zur Bias-Evaluierung in KI gestützter Sozialarbeit]]: FAIR-SW-Bench
- [[Applied-GenerativeAI MOC]]: KI-Grundlagen
- [[Promptotyping MOC]]: Methodologie
