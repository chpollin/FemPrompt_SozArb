---
title: "Pipeline: Synthese"
type: pipeline
stage: 5
tags: [pipeline, synthese, vault]
---

# Stufe 5: Synthese (Vault-Generierung)

## Methode

Deterministisches Python-Script (`scripts/generate_vault_v2.py`) mit LLM-gestuetzter Konzept-Extraktion.

## Vault-Dokumenttypen

| Typ | Anzahl | Beschreibung |
|-----|--------|-------------|
| Paper-Notes | 249 | Transformation Trail + Assessment + Wissensdokument |
| Konzept-Notes | 136 | LLM-extrahierte Konzepte mit Definitionen und Co-Occurrence |
| Pipeline-Notes | 5 | Prompts, Konfiguration, Statistiken, Limitationen |
| Divergenz-Notes | 111 | Klassifizierte Disagreement-Faelle |

## Prozess

1. Multi-Strategie Titel-Matching (Knowledge-Docs <-> Zotero)
2. LLM-basierte Konzept-Extraktion (3-8 Konzepte pro Paper, Haiku 4.5)
3. Konzept-Konsolidierung (Synonym-Merge, Frequency-Filter >= 2)
4. LLM-basierte Divergenz-Klassifikation (3 Muster)
5. Vault-Generierung (4 Dokumenttypen + MOCs + ZIP)

## Limitationen

- Konzept-Extraktion ist probabilistisch (LLM-abhaengig)
- Co-Occurrence ist dokumentbasiert, nicht satzbasiert
- Divergenz-Klassifikation ist eine LLM-Interpretation einer LLM-Divergenz (Meta-Ebene)
