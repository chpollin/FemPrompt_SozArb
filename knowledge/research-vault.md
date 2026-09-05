---
title: Research Vault
project:
  name: FemPrompt SozArb
  repository: https://github.com/chpollin/FemPrompt_SozArb
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
status: complete
language: de
version: "0.7"
created: 2026-07-18
updated: 2026-09-05
authors: [Christopher Pollin]
generated-with: Codex (GPT-5.6), Codex (GPT-6)
topics: ["[[Grounded Vault]]", "[[Systematic Review]]", "[[Context Engineering]]"]
related: [methods, data, governance, verification, testing, plan, standards]
---

# Research Vault

Der Research Vault trägt das Gegenstandswissen des Reviews in einer durchgängigen Belegkette. Er verbindet Quellen, aufbereiteten Volltext, distillierte Wissensdokumente, Assertions und publizierbare Ausgaben. Der Literaturbericht und das Paper entstehen als getrennte Ausgaben über derselben Assertion-Schicht.

## Ebenenmodell

```text
00_sources → 10_markdown → 20_distillates → 30_assertions → 40_output
```

Jede Ebene referenziert die unmittelbar darunterliegende Ebene. Diese Beschränkung macht prüfbar, welcher Transformationsschritt eine Aussage erzeugt hat und wo eine Korrektur ansetzen muss.

| Ebene | Inhalt | Referenzziel |
|---|---|---|
| `00_sources/` | bibliografisch identifizierte Originalquellen und lokale Volltexte | stabile Work-Identität und exakte Publikations-Version aus der Registry |
| `10_markdown/` | überprüfte Markdown-Repräsentation des Volltexts | Originalquelle |
| `20_distillates/` | quellenspezifische, strukturierte Wissensreduktion | `record-id`, `work-id`, `version-id`, `version-type` und identifizierte Markdown-Blöcke oder geprüfte Publikationszitate |
| `30_assertions/` | atomare, quellenübergreifend belegbare Aussagen | identifizierte Distillat-Aussagen |
| `40_output/` | Literaturbericht, Paper und weitere Synthesen | Assertions |

Die älteren Ordner `10_distillates/` und `20_claims/` bleiben als schreibgeschützte Migrationsquellen erhalten. Auch `generated/distilled/` und die verlinkte Arbeitskollektion unter `generated/vault/Papers/` sind keine automatisch geprüfte aktive Assertion-Schicht. Neue Artefakte verwenden die aktuelle Kette und den Begriff Assertion.

## Quellen- und Rechtegrenze

Der Ergebnisbuild übernimmt keine vollständigen Drittquellen oder die historische Arbeitskollektion. Lokale PDF-Binaries und bereits versionierte Arbeitsrepräsentationen sind getrennte Bestände; ein Ausschluss aus `build/site/` macht vorhandene Repository-Dateien oder ihre Git-Historie nicht privat. Die Ergebnisdaten enthalten bibliografische Metadaten, eigene Prosa, geprüfte Kurzzitate und deren Quellenprovenienz. Herkunft, Zugang und quellenspezifische Rechte bleiben getrennt dokumentiert.

Der Quellenstatus wird vor der Annotation geklärt. Ein Paper kann als gebunden, konvertierbar, mehrdeutig, nicht verfügbar oder rechtegebunden geführt werden. Nur eine überprüfte Paper-Schicht darf die Belegbasis einer produktiven Annotation bilden.

## Distillierte Wissensdokumente

Ein distilliertes Wissensdokument reduziert einen Volltext auf die für die Forschungsfragen relevanten Strukturen. Es hält Metadaten, Forschungsfrage, Methode, zentrale Befunde, Argumente, Kategoriebezug und identifizierte Belegstellen. Die Reduktion dient dem Context Engineering, weil sie den Arbeitskontext verkleinert und zugleich den Rückweg zur Quelle erhält.

Die Erzeugung umfasst vier kontrollierte Operationen.

1. Ein Extraktionsprompt erzeugt eine strukturierte Darstellung der Paperinhalte und kennzeichnet Unsicherheit.
2. Ein Formatierungsschritt überführt die Extraktion in das kanonische Markdown-Schema.
3. Eine quellengestützte AI Agent Review prüft Belegdeckung, Polarität, Identität und die Trennung von Zitat und Paraphrase.
4. Für die abschließende fachliche Verifikation prüft eine Domänenexpertin oder ein Domänenexperte die Aussagen und ihre Interpretation. Die ausdrücklich gekennzeichnete vorläufige KI-geprüfte Ergebnisausgabe kann schon auf Stufe 3 erfolgen, wenn die artefaktbezogenen Prüfbelege die [Freigaberegel](../config/publication_policy.json) erfüllen.

Promptversion, Modell, Eingabetext, Ausgabepfad und Prüfergebnis gehören zur Provenienz der Distillation. Ein LLM-Wissensdestillat bleibt in PRISM eine eigene Referenzschicht. Es erfüllt das Paper-Evidence-Gate der Screeningannotation nicht.

## Assertions

Eine Assertion formuliert genau eine wissenschaftlich relevante Aussage. Sie verweist auf eine oder mehrere identifizierte Aussagen in den Distillaten. Mehrere Quellen können eine Assertion stützen, einschränken oder ihr widersprechen.

Eine Assertion führt mindestens folgende Informationen.

- stabile Assertion-ID und präziser Aussagewortlaut
- Referenzen auf die unterstützenden Distillat-Aussagen
- thematische Zuordnung und Bezug zu den Forschungsfragen
- Kennzeichnung widersprechender oder einschränkender Evidenz
- Prüfstatus mit datierter Aktivität und verantwortlichem Akteur
- vorgesehene Ausgabe, etwa Literaturbericht, Paper oder beide

Berichts-Assertions und Paper-Assertions bilden keine getrennten Wissensbestände. Das Feld für die vorgesehene Ausgabe steuert, welche Assertions in welchem Text verwendet werden. Methodische Aussagen des Papers können zusätzlich auf Projektartefakte wie ADRs, Run-Manifeste, Tests und Replay-Ausgaben verweisen.

## Status und Prüfungen

| Status | Bedeutung | Autorisierte Aktivität |
|---|---|---|
| `grounded` | Alle erforderlichen Referenzen auf die darunterliegende Ebene lösen auf | deterministische Anker- und Schemaprüfung |
| `ai-agent-reviewed` | Ein AI Agent hat Aussage und Belegkette gegen die zugewiesenen Quellen geprüft | quellengestützte AI Agent Review |
| `verified` | Eine Domänenexpertin oder ein Domänenexperte hat Evidenz und wissenschaftliche Interpretation bestätigt | personengebundene Verifikation |
| `publication-approved` | Das verifizierte Artefakt ist für eine konkrete öffentliche Projektion freigegeben | personengebundene Publikationsfreigabe |

Deterministische Validierung erscheint unter `checked.validation`. Sie prüft Schema, Anker, Referenzen und Statusregeln. Der Status einer Quelle propagiert nicht automatisch. Ein Outputkapitel kann erst verifiziert werden, nachdem seine verwendeten Assertions verifiziert wurden und die Interpretation des Kapitels eine eigene fachliche Prüfung erhalten hat.

## Literaturbericht und Paper

`40_output/literature-report/` enthält die fachliche Synthese der eingeschlossenen Literatur. Die Kapitel führen über Assertions zu den Distillaten und weiter zum Papertext. Der Bericht ist die ausführliche Darstellung des Literaturwissens.

`40_output/paper/paper.md` ist das kanonische Manuskript. Sein Methodenteil bezieht zusätzlich die dokumentierten Projektartefakte ein. Der vorläufige Ergebnisteil verwendet die bisher aktive, AI-geprüfte Assertion-Teilmenge und nennt deren Abdeckungs- und Autoritätsgrenzen. Die vollständige Korpusanalyse und fachlich verifizierte Synthese bleiben das Ziel. Eine frühere Datei `paper/draft.md` wurde in dieses Manuskript integriert; Git bewahrt ihre Entwicklungsgeschichte.

## Analyse über die Wissensstruktur

Die quantitative Analyse verwendet strukturierte Annotationen und Assertion-Metadaten. Dazu gehören Kategorien, Ko-Vorkommen, Evidenztypen, Populationen, Praxisfelder, Methoden und Leerstellen. Jede Zahl entsteht durch ein ausführbares Skript über die kanonischen Daten.

Die qualitative Analyse synthetisiert Assertions entlang der Forschungsfragen zu Prompting-Techniken, Biasachsen und Mitigationsansätzen sowie domänenspezifischen Anforderungen. Topic Modeling kann als explorative Orientierung über Volltexte, Distillate, Annotationen, Keywords und Vault-Relationen eingesetzt werden. Die fachliche Interpretation der Themen erfolgt gegen die beleggebundene Wissensstruktur.

## Aktueller Implementierungsstand

Die aktive Ordnerstruktur, ein geprüfter Teilbestand und der projektspezifische Validator sind eingerichtet. Die folgende Tabelle erschließt die aktive Belegkette; aktuelle Mengen und Prüfzustände stehen im generierten Completion-Paket. Die Beziehungen sind keine pauschale Eins-zu-eins-Zuordnung:

| Aktives Distillat | Unterstützte Assertion |
|---|---|
| [Ahn: AI Literacy in der Sozialen Arbeit](../research-vault/20_distillates/publications/ahn-2025-ai-literacy-for-social-work.md) | [Integration in bestehende Kernkompetenzen](../research-vault/30_assertions/ahn-et-al-propose-integrating-ai-literacy-across-existing-core-competencies.md) |
| [Kaneko: CoT und Gender Bias](../research-vault/20_distillates/publications/kaneko-2024-cot-and-gender-bias.md) | [Begrenzte berichtete CoT-Effekte](../research-vault/30_assertions/kaneko-et-al-report-cot-reduced-bias-in-specific-evaluations.md) und die gemeinsame Assertion zur Variation |
| [Kamruzzaman: Dual-Process Prompting](../research-vault/20_distillates/publications/kamruzzaman-2024-dual-process-prompting.md) | Zusammen mit Kaneko: [Effekte variieren nach Modell und Bias-Kategorie](../research-vault/30_assertions/reported-prompting-effects-vary-across-models-and-bias-categories.md) |
| [Kabra: Reasoning-guided Fine-Tuning](../research-vault/20_distillates/publications/kabra-2025-reasoning-guided-fine-tuning.md) | [Übertragung von Reasoning-Spuren durch Training](../research-vault/30_assertions/kabra-et-al-transfer-reasoning-through-fine-tuning-for-bias-mitigation.md); eine Methodenbeschreibung, keine pauschale Wirksamkeitsbehauptung |

Diese Aussagen haben zugeschriebene KI-Quellenprüfungen, keine dadurch erfundene Domänenverifikation. Der Chat greift auf den [freigegebenen Assertion-Index](../docs/data/assertion_index.json) zu. Verbindungen im historischen Knowledge Graph beruhen auf Kategorie-Ko-Vorkommen; sie ersetzen keine belegte wissenschaftliche Beziehung zwischen Aussagen.

Nicht alle vorgesehenen Papers sind aktiv distilliert, mit Assertions verbunden oder analysebereit. Für den Arbeitsstand gelten getrennte Kennzahlen:

| Frage | Maßgeblicher Nachweis |
|---|---|
| Existiert ein verlinktes historisches Wissensdokument? | `knowledge_coverage` und Dokument-/Recordzahlen in [research_vault_v2.json](../docs/data/research_vault_v2.json); keine Qualitätsfreigabe |
| Welche Aussagen dürfen im Ergebnis und Chat erscheinen? | [assertion_index.json](../docs/data/assertion_index.json) und seine aktuelle Prüfkette |
| Welche Works tragen aktuelle Screening- und Analysewerte? | [literature_landscape.json](../docs/data/literature_landscape.json), mit angegebenen Nennern für Works und Records |
| Was fehlt im gesamten Zielkorpus? | [Completion-Paket](../generated/completion/README.md), insbesondere `analysis_eligible`, offene Quellenprüfungen, Identitätskonflikte und ungebundene Kandidaten |

Aktuelle Teilmengen lassen sich bereits deskriptiv auswerten. Eine abgeschlossene Gesamtsynthese setzt vollständige Entscheidungen für den Zielkorpus, tragfähige Quellen und Coding, geprüfte Assertions für die tatsächlich verwendeten Aussagen sowie die fachliche Prüfung des Berichts voraus. Exkludierte oder zurückgehaltene Arbeiten müssen dokumentiert werden; sie benötigen keine künstlich erzeugten Synthese-Assertions.

## Kanonische Prüfpfade

| Prüfung | Kommando oder Artefakt |
|---|---|
| Grounded-Vault-Schema und benachbarte Referenzen | `python -m src.publish.validate_research_vault` |
| Kompatibilitätsprüfung der Legacy-Claim-Schicht | `python -m src.publish.check_claims` |
| Source- und Corpus-Readiness | `generated/agent-screening-queue.json` und `generated/round2-intake.json` |
| Screening-Lifecycle | `docs/data/screening_lifecycle_contract.json` und [[governance]] |
| Publikationsreife | [[verification]] |
