---
type: knowledge
created: 2025-01-27
tags: [quality-criteria, validation, literature-review, bias-detection, methodology]
status: reviewed
confidence: high
aliases: [Qualitätskriterien, Quality Standards]
---

# Workflow-Qualität

## Summary

Die Qualitätssicherung im KI-gestützten Literature Review Workflow operiert auf drei Ebenen: bibliographische Validierung, methodische Rigorosität und theoretische Konsistenz. Das Framework definiert explizite Kriterien für jede Phase des Prozesses, von der initialen KI-Recherche bis zur finalen Synthese. Die Integration menschlicher Expertise an kritischen Validierungspunkten adressiert bekannte Limitationen von KI-Systemen wie Halluzinationen und Sycophancy.

Das Bewertungsschema implementiert eine Matrix mit quantitativen Scores (1-5) und qualitativen Assessments (hoch/mittel/niedrig). Die fünfstufige Relevanzbewertung wird ergänzt durch kategoriale Qualitätseinschätzungen (hoch/mittel/niedrig) und binäre Einschlussentscheidungen. Diese Kombination ermöglicht differenzierte Bewertungen über binäre Accept/Reject-Entscheidungen hinaus.

Die Dokumentation aller Qualitätsentscheidungen in Zotero und Obsidian sichert Transparenz und Nachvollziehbarkeit. Die explizite Markierung von Unsicherheiten durch Confidence-Level ermöglicht differenzierte Interpretation der Ergebnisse. Die iterative Validierung durch mehrere Reviewer reduziert individuelle Bias.

## Core Concepts

### Bibliographische Validierungskriterien

Die Verifikation bibliographischer Daten erfolgt mehrstufig. DOI-Validierung über CrossRef API bestätigt die Existenz und Korrektheit von Publikationen. Autoren-Disambiguierung nutzt ORCID-IDs wo verfügbar. Journal-Verifikation prüft gegen Beall's List und DOAJ für Legitimität. Publikationsdaten werden mit Verlags-Websites abgeglichen.

Duplikaterkennung operiert auf mehreren Ebenen. Exakte Titel-Matches identifizieren offensichtliche Duplikate. Fuzzy-Matching mit Levenshtein-Distanz erkennt Variationen. DOI-Vergleich identifiziert Mehrfachindexierungen. Abstrakt-Ähnlichkeit über Cosine-Similarity detektiert Selbstplagiate.

Die Vollständigkeitsprüfung validiert essenzielle Metadaten. Fehlende Abstracts triggern Nachrecherche. Unvollständige Autorenlisten werden über Verlags-PDFs ergänzt. Fehlende Keywords werden aus Titel und Abstract extrahiert. Inkonsistente Jahresangaben werden manuell verifiziert.

### Methodische Rigorositätsbewertung

Die Qualitätsbewertung differenziert nach Dokumenttyp. Empirische Studien werden evaluiert nach: Stichprobengröße und -repräsentativität, Methodentransparenz und Reproduzierbarkeit, statistische Power und Effektstärken, Limitations-Diskussion und Bias-Reflexion.

Theoretische Arbeiten werden bewertet nach: konzeptueller Klarheit und Definitionen, Argumentationslogik und Evidenz, Integration bestehender Literatur, Innovation und Beitrag zum Feld.

Policy-Dokumente und Reports unterliegen Kriterien wie: Datenquellen und Erhebungsmethoden, Interessenkonflikte und Funding, Stakeholder-Repräsentation, Implementierbarkeit der Empfehlungen.

### KI-Output-Validierung

Halluzinationserkennung fokussiert auf faktische Überprüfung. Alle Zitate werden gegen Originaltexte validiert. Statistische Angaben werden mit Primärquellen abgeglichen. Chronologische Inkonsistenzen werden identifiziert. Nicht-existente Autoren oder Journals werden markiert.

Sycophancy-Mitigation erfordert kritische Prompt-Gestaltung. Neutrale Formulierungen vermeiden Leading Questions. Explizite Aufforderung zu kritischer Analyse. Vergleich der Outputs verschiedener Modelle. Identifikation von Bestätigungsmustern.

Knowledge-Cutoff-Management dokumentiert Modell-spezifische Limitationen. Aktualitätsprüfung für zeitkritische Themen. Supplementierung durch aktuelle Quellen. Explizite Markierung unsicherer Zeitangaben.

### Bewertungsmatrix und Scoring

Die fünfstufige Relevanzbewertung operationalisiert Passung zur Forschungsfrage: 5 = zentral relevant und unverzichtbar, 4 = relevant mit wichtigen Beiträgen, 3 = teilweise relevant mit Randaspekten, 2 = marginal relevant mit minimalen Bezügen, 1 = irrelevant oder off-topic.

Qualitätskategorisierung erfolgt dreistufig. "Hoch" indiziert methodische Exzellenz, transparente Dokumentation und signifikante Beiträge. "Mittel" zeigt solide Methodik mit kleineren Schwächen. "Niedrig" markiert erhebliche methodische Mängel oder unzureichende Dokumentation.

Die Einschlussentscheidung basiert auf kombinierter Bewertung. "Einschluss" erfordert Relevanz ≥3 und Qualität ≥mittel. "Ausschluss" bei Relevanz <3 oder Qualität = niedrig. "Unklar" triggert Second-Review oder Diskussion.

## Synthesis

### Qualität als mehrdimensionales Konstrukt

Die Operationalisierung von Qualität im Literature Review erfordert Balance zwischen Standardisierung und Flexibilität. Die definierten Kriterien bieten Struktur ohne kontextuelle Nuancen zu eliminieren. Die mehrdimensionale Bewertung erfasst Komplexität wissenschaftlicher Publikationen.

Die Integration quantitativer Scores mit qualitativen Assessments ermöglicht sowohl systematische Aggregation als auch interpretative Tiefe. Dies adressiert Kritik an rein metrischen Bewertungssystemen. Die Dokumentation der Bewertungsrationale macht subjektive Urteile transparent.

### Menschliche Expertise als kritischer Faktor

Die Human-in-the-Loop-Validierung ist nicht nur Qualitätskontrolle sondern aktive Wissensproduktion. Experten bringen domänenspezifisches Wissen ein, das KI-Systeme nicht erfassen. Die Identifikation subtiler theoretischer Beiträge erfordert tiefes Fachverständnis.

Die iterative Validierung durch mehrere Reviewer reduziert individuelle Bias und erhöht Reliabilität. Diskrepanzen zwischen Reviewern werden dokumentiert und durch Konsensbildung aufgelöst. Die Konsensfindung ist selbst ein epistemologischer Prozess.

### Transparenz und Reproduzierbarkeit

Die vollständige Dokumentation aller Qualitätsentscheidungen ermöglicht externe Validierung. Die explizite Benennung von Unsicherheiten durch Confidence-Level (hoch/mittel/niedrig) dokumentiert Bewertungssicherheit. Die Versionierung von Bewertungskriterien dokumentiert methodische Evolution.

Die Integration in Zotero und Obsidian schafft persistente Dokumentation. Tags und Notizen bleiben mit Referenzen verknüpft. Die Nachvollziehbarkeit von Ein-/Ausschlussentscheidungen ermöglicht systematische Reviews der Reviews.

## Sources

PRISMA Group. (2021). PRISMA 2020 Statement: Updated guidelines for reporting systematic reviews. *BMJ*, 372, n71.

Page, M. J., et al. (2021). The PRISMA 2020 statement: An updated guideline for reporting systematic reviews. *Systematic Reviews*, 10(1), 89.

Shamseer, L., et al. (2015). Preferred reporting items for systematic review and meta-analysis protocols (PRISMA-P) 2015: elaboration and explanation. *BMJ*, 349, g7647.

## Related

- [[Methodische Qualitätskriterien für SocialAI Literature Review]] - Spezifische Kriterien
- [[Konzept]] - Theoretische Einbettung
- [[PRISMA]] - PRISMA-Integration
- [[Technisch]] - Technische Validierung