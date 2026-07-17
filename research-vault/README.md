---
layer: vault-root
title: "research-vault, Gegenstandswissen nach dem Grounded-Vault-Modell"
created: 2026-07-17
status: in-Umsetzung
---

# research-vault

Dieser Top-Level-Ordner trägt das Gegenstandswissen des Reviews nach dem fünfstufigen Grounded-Vault-Modell mit Statusleiter und strenger Abwärts-Referenz. Der verbindliche Bauplan liegt in `knowledge/research-vault-plan.md`. Der Ordner steht neben `knowledge/` mit einer anderen Aufgabe. `knowledge/` trägt Steuerungswissen über die Arbeit, dieser Ordner trägt Gegenstandswissen darüber, was die Literatur zur Forschungsfrage sagt, mit welcher Beleglage und in welchem Prüfstatus. Die beiden Wissensarten bleiben getrennt, keine Ebene übernimmt Inhalt aus der jeweils anderen.

## Ebenen und Referenzrichtung

Referenzen laufen ausschließlich abwärts und nur innerhalb dieses Ordners. Jede Ebene referenziert die unmittelbar darunterliegende. Kein Deliverable zitiert direkt eine Quelle, es zitiert einen Claim, der Claim einen Distillat-Anker, das Distillat einen Repräsentations-Anker, die Repräsentation ihre Quelle.

| Ebene | Inhalt | Push |
|---|---|---|
| `_sources/` | Volltexte Dritter, PDF oder Markdown | nie, gitignored |
| `references/` | bibliografische Records, CSL JSON, nur Metadaten | committed |
| `00_representation/` | stabile Ankerschicht auf den Volltexten | nie, gitignored |
| `10_distillates/` | ein Distillat je Quelle, jede Kernaussage zeigt auf einen Repräsentations-Anker | committed |
| `20_claims/` | atomare Claims in Topic Maps, referenzieren nur Distillate | committed |
| `30_deliverable/` | synthetisierte Ausgaben, jeder tragende Satz an einen Claim verankert | committed |

`_sources/` und `00_representation/` existieren nur lokal und werden nie angelegt oder committed, solange geschütztes Material sie füllen würde. Sie stehen in der `.gitignore` des Repos gesperrt.

## Lizenz- und Push-Sperre

`_sources/` und `00_representation/` enthalten lizenzpflichtige Volltexte Dritter. Das Repo ist öffentlich, ein Push dieser Schichten wäre eine Urheberrechtsverletzung. Die Sperre folgt dem Muster, das im Repo für `docs/data/fulltext/` schon gilt. Sie ist eine rechtsgebundene Entscheidung, keine technische Bequemlichkeit. Ein späteres Freigeben einzelner Open-Access-Volltexte wäre eine eigene, je Quelle geprüfte Entscheidung.

## Statusleiter

Jedes Dokument der prüfbaren Ebenen trägt einen Status. Ein Status wird nur gesetzt, wenn die zugehörige Prüfung tatsächlich lief, mit Datum und Ergebnis.

| Status | Bedeutung | Wer setzt ihn |
|---|---|---|
| `grounded` | jede tragende Aussage zeigt formal auf einen Anker der Ebene darunter | deterministische Prüfung |
| `validated` | adversariale Maschinenprüfung hat die Verankerung inhaltlich gegengelesen | Maschinen-Review, advisory |
| `verified` | eine autorisierte menschliche Fachperson hat die Belegkette bestätigt | Mensch, allein, bindend |
| `contested` | Quellen widersprechen einander, der Widerspruch wird festgehalten | Claim-Ebene |

Die in dieser ersten Umsetzung migrierten Distillate tragen `status: migrated`, nicht `grounded`. Die Grounding-Prüfung setzt eine reale `00_representation/`-Ankerschicht voraus, die hier nicht angelegt wurde, weil sie geschütztes Material trägt und gitignored bleibt. `grounded` wird erst gesetzt, wenn die Ankerauflösung im lokalen Klon mit den Volltexten tatsächlich gelaufen ist.

## Tote Anker

Ein committed Distillat zeigt auf Anker in `00_representation/`, die im öffentlichen Repo nicht existieren. Ein solcher toter Anker ist zulässig und erwartet, solange er auf die gitignorten Ebenen zeigt, er ist die Folge der Push-Sperre, kein Integritätsfehler. Aufgelöst und geprüft wird er im lokalen Klon mit den Volltexten. Ein toter Anker, der auf eine committed Ebene ins Leere zeigt, ist dagegen ein echter Integritätsfehler.

## Präregistrierungs-Vorbedingung der Migration

In `10_distillates/` ziehen nur Distillate ein, die der Evidence-Audit unter `generated/distilled/_evidence_audit/` als unauffällig ausweist. Ein Distillat ist migrierbar, wenn es keinen F-, D- oder G-Befund trägt. P-Befunde sind zulässig und im Frontmatter des migrierten Dokuments als `audit: P-pending` vermerkt, unauffällige tragen `audit: clean`. Distillate mit F-, D- oder G-Befund und die Distillate ohne auflösbaren Volltext sind in `waitlist.md` registriert und warten auf die bindende menschliche Stufe-3-Verifikation.

## Glossar

**Anker.** Eine stabile, adressierbare Marke auf einer Textstelle. Geprägt an seiner Heimatebene, referenziert von der Ebene darüber, bedarfsgetrieben von oben nach unten.

**Toter Anker.** Ein Anker, dessen Ziel im vorliegenden Klon nicht auflösbar ist. Im Repo zulässig, wenn er auf die gitignorten Ebenen zeigt.

**Distillat.** Ein Dokument in `10_distillates/`, genau eines je Quelle, das die Quelle strukturiert zusammenfasst.

**Claim.** Eine atomare, quer über Quellen belegbare Einzelaussage in `20_claims/`, organisiert in Topic Maps.

**Ingestion.** Der förmliche Vorgang, durch den ein Dokument zur zitierbaren Quelle wird, Referenz-Record, Ablage in `_sources/`, Repräsentation mit Ankern. Kein Ad-hoc-Link ersetzt ihn.
