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
updated: 2026-08-24
authors: [Christopher Pollin]
generated-with: Codex (GPT-5.6)
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

Die älteren Ordner `10_distillates/` und `20_claims/` bleiben als schreibgeschützte Migrationsquellen erhalten. Neue Artefakte verwenden die aktuelle Kette und den Begriff Assertion.

## Quellen- und Rechtegrenze

Volltexte Dritter und ihre vollständigen Markdown-Repräsentationen bleiben lokal, sofern keine quellenspezifische Lizenz die Veröffentlichung erlaubt. Git führt bibliografische Metadaten, eigene Prosa, zulässige Kurzzitate, Assertions und Ausgaben. Jede veröffentlichbare Quelldatei dokumentiert Herkunft, Lizenz und Konversionsprovenienz im Frontmatter.

Der Quellenstatus wird vor der Annotation geklärt. Ein Paper kann als gebunden, konvertierbar, mehrdeutig, nicht verfügbar oder rechtegebunden geführt werden. Nur eine überprüfte Paper-Schicht darf die Belegbasis einer produktiven Annotation bilden.

## Distillierte Wissensdokumente

Ein distilliertes Wissensdokument reduziert einen Volltext auf die für die Forschungsfragen relevanten Strukturen. Es hält Metadaten, Forschungsfrage, Methode, zentrale Befunde, Argumente, Kategoriebezug und identifizierte Belegstellen. Die Reduktion dient dem Context Engineering, weil sie den Arbeitskontext verkleinert und zugleich den Rückweg zur Quelle erhält.

Die Erzeugung umfasst vier kontrollierte Operationen.

1. Ein Extraktionsprompt erzeugt eine strukturierte Darstellung der Paperinhalte und kennzeichnet Unsicherheit.
2. Ein Formatierungsschritt überführt die Extraktion in das kanonische Markdown-Schema.
3. Eine quellengestützte AI Agent Review prüft Belegdeckung, Polarität, Identität und die Trennung von Zitat und Paraphrase.
4. Eine Domänenexpertin oder ein Domänenexperte verifiziert die wissenschaftlich verwendeten Aussagen und ihre Interpretation.

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

`40_output/paper/paper.md` ist das kanonische Manuskript. Sein Methodenteil bezieht zusätzlich die dokumentierten Projektartefakte ein. Der Ergebnisteil verwendet die verifizierten Assertions des vollständigen analysierten Korpus. Eine frühere Datei `paper/draft.md` wurde in dieses Manuskript integriert; Git bewahrt ihre Entwicklungsgeschichte.

## Analyse über die Wissensstruktur

Die quantitative Analyse verwendet strukturierte Annotationen und Assertion-Metadaten. Dazu gehören Kategorien, Ko-Vorkommen, Evidenztypen, Populationen, Praxisfelder, Methoden und Leerstellen. Jede Zahl entsteht durch ein ausführbares Skript über die kanonischen Daten.

Die qualitative Analyse synthetisiert Assertions entlang der Forschungsfragen zu Prompting-Techniken, Biasachsen und Mitigationsansätzen sowie domänenspezifischen Anforderungen. Topic Modeling kann als explorative Orientierung über Volltexte, Distillate, Annotationen, Keywords und Vault-Relationen eingesetzt werden. Die fachliche Interpretation der Themen erfolgt gegen die beleggebundene Wissensstruktur.

## Aktueller Implementierungsstand

Die aktive Ordnerstruktur, ein erster vertikaler Durchstich und der projektspezifische Validator sind eingerichtet. Die bisher angelegten Literatur-Assertions liegen unterhalb der Domänenverifikation. Der vollständige Korpusdurchgang, die quantitative Auswertung, die qualitative Synthese und die anschließende fachliche Verifikation bleiben auszuführen. Aktuelle Mengen und Abdeckungszustände stehen in den generierten Manifesten.

## Kanonische Prüfpfade

| Prüfung | Kommando oder Artefakt |
|---|---|
| Grounded-Vault-Schema und benachbarte Referenzen | `python -m src.publish.validate_research_vault` |
| Kompatibilitätsprüfung der Legacy-Claim-Schicht | `python -m src.publish.check_claims` |
| Source- und Corpus-Readiness | `generated/agent-screening-queue.json` und `generated/round2-intake.json` |
| Screening-Lifecycle | `docs/data/screening_lifecycle_contract.json` und [[governance]] |
| Publikationsreife | [[verification]] |
