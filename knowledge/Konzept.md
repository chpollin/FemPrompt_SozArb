---
type: knowledge
created: 2025-01-27
tags: [social-ai, literature-review, workflow, feminist-theory, methodology]
status: reviewed
confidence: high
aliases: [Konzeptueller Workflow, Workflow Theorie]
---

# Workflow-Konzept

## Summary

Dieser Workflow implementiert eine KI-gestützte systematische Literaturanalyse, die feministische Theorieperspektiven mit automatisierten Recherchemethoden verbindet. Der Ansatz basiert auf dem Konzept des situierten Wissens nach Donna Haraway, der Intersektionalitätstheorie nach Kimberlé Crenshaw und dem Prinzip der Response-Ability. Die Methodik kombiniert Multi-Modell-KI-Recherche mit Expert-in-the-Loop-Validierung in einem dreiphasigen Prozess.

Der konzeptuelle Rahmen adressiert die Forschungsfrage nach feministischen Digital/AI Literacies und diversitätsreflektierendem Prompting zur Sichtbarmachung von Ko-Konstitution (wechselseitige Hervorbringung) von Diskriminierungsformen in KI-Systemen. Gleichzeitig reflektiert der Ansatz kritisch die Grenzen individueller Kompetenzansätze gegenüber strukturellen Machtasymmetrien.

Die Architektur des Workflows basiert auf drei Säulen: automatisierte Datenakquisition durch Deep Research, menschenzentrierte Validierung in Zotero, und syntheseorientierte Wissensproduktion in Obsidian. Diese Triangulation kombiniert automatisierte Prozesse mit manueller Validierung.

## Core Concepts

### Theoretische Grundlagen

**Situiertes Wissen** postuliert, dass alle Erkenntnisse aus spezifischen sozialen, kulturellen und materiellen Kontexten entstehen. Im Workflow manifestiert sich dies durch die explizite Dokumentation der Positionalität der KI-Modelle und der forschenden Person. Die Multi-Modell-Strategie adressiert die unterschiedlichen "Standpunkte" der KI-Systeme.

**Intersektionalität** ermöglicht die Analyse sich überschneidender Diskriminierungsformen. Der Workflow operationalisiert dies durch ein mehrdimensionales Kategorisierungsschema, das technische, soziale und ethische Dimensionen von KI-Bias erfasst. Die Bewertungsmatrix integriert intersektionale Analysekategorien.

**Response-Ability** (nach Haraway, 2016) verschiebt den Fokus von Erklärbarkeit zu Ver-Antwortungs-Fähigkeit. Dies prägt die Gestaltung der Human-in-the-Loop-Validierung, bei der menschliche Expertise nicht nur kontrolliert, sondern aktiv gestaltet. Die Expert-Integration erfolgt an kritischen Entscheidungspunkten.

### Deep Research Paradigma

Das Deep Research Konzept strukturiert KI-Anfragen durch einen parametrischen Prompt-Baukasten mit fünf Komponenten. Die Rolle definiert die Expertenperspektive, die Aufgabe spezifiziert den Output-Typ, der Kontext bettet Forschungsziele ein, Analyseschritte strukturieren den Prozess, und das Output-Format standardisiert Ergebnisse.

Die parallele Ausführung identischer Prompts in vier KI-Modellen (Gemini, Claude, GPT, Perplexity) minimiert modellspezifische Verzerrungen. Jedes Modell bringt unterschiedliche Trainingsdaten und algorithmische Perspektiven ein. Die Konvergenz und Divergenz der Ergebnisse wird dokumentiert und analysiert.

### Phasenmodell und Datenfluss

Phase 1 fokussiert auf breite Datenakquisition durch automatisierte Prozesse. Die KI-gestützte Recherche generiert einen initialen Literaturkorpus, der durch technische Extraktionsstrategien erweitert wird. Diese Phase maximiert Recall über Precision.

Phase 2 implementiert rigorose Qualitätskontrolle durch Human-in-the-Loop-Validierung. Zotero fungiert als zentraler Hub für bibliographische Verwaltung und Expertenbewertung. Die Validierung erfolgt mehrdimensional: Relevanz, Qualität, theoretische Fundierung, Aktualität.

Phase 3 synthetisiert Erkenntnisse in Obsidian durch vernetzte Wissensstrukturen. Die Vault-Organisation in vier Hauptdokumente (README, NARRATIVE, SYNTHESIS, EVIDENCE-MAP) vermeidet Fragmentierung. Die Konsolidierung fördert kohärente Narrative statt atomisierter Fakten.

## Synthesis

### Epistemologische Innovation

Der Workflow kombiniert computergestützte Methoden mit feministischer Theoriebildung. Die Integration feministischer Theorie ist nicht additiv, sondern transformativ für die Methodologie. Dies manifestiert sich in der Privilegierung von Kontext über Abstraktion und Beziehungen über Isolation.

Die Multi-Modell-Strategie operationalisiert Haraways Konzept partieller Perspektiven. Anstatt eine singuläre "objektive" Wahrheit zu suchen, aggregiert der Workflow multiple situierte Perspektiven. Die Divergenz zwischen Modellen wird dokumentiert und als Ausgangspunkt für vertiefende Analyse genutzt.

### Methodologische Implikationen

Der dreiphasige Prozess balanciert Automatisierung mit menschlicher Urteilskraft. Dies adressiert die Kritik rein technokratischer Ansätze in den Digital Humanities. Die Expert-in-the-Loop-Integration ist nicht nur Qualitätskontrolle, sondern aktive Wissensproduktion.

Die Dokumentation in NARRATIVE.md macht den Forschungsprozess transparent und nachvollziehbar. Dies entspricht feministischen Forderungen nach reflexiver Wissenschaftspraxis. Die chronologische Erfassung von Entscheidungen ermöglicht kritische Selbstreflexion und externe Evaluation.

### Limitationen und Reflexion

Der Workflow reproduziert potentiell die Dominanz englischsprachiger und westlicher Perspektiven durch die verwendeten KI-Modelle. Dies wird durch explizite Dokumentation und kritische Reflexion adressiert, kann aber nicht vollständig eliminiert werden. Die Paywall-Problematik verstärkt Ungleichheiten im Wissenszugang.

Die Abhängigkeit von proprietären KI-Systemen wirft Fragen der Nachhaltigkeit und Reproduzierbarkeit auf. Die Dokumentation aller Parameter und Prompts mildert dies, eliminiert aber nicht die grundlegende Abhängigkeit. Alternative Open-Source-Modelle könnten integriert werden.

## Sources

Haraway, D. (1988). Situated Knowledges: The Science Question in Feminism and the Privilege of Partial Perspective. *Feminist Studies*, 14(3), 575-599.

Crenshaw, K. (1989). Demarginalizing the Intersection of Race and Sex: A Black Feminist Critique of Antidiscrimination Doctrine. *University of Chicago Legal Forum*, 1989(1), 139-167.

D'Ignazio, C., & Klein, L. F. (2020). *Data Feminism*. MIT Press.

Haraway, D. (2016). *Staying with the Trouble: Making Kin in the Chthulucene*. Duke University Press.

## Related

- [[Technisch]] - Technische Implementierung
- [[Qualität]] - Qualitätskriterien und Validierung
- [[PRISMA]] - PRISMA 2020 Methodologie
- [[Bias in KI-Systemen für die Sozialarbeit]]
- [[FAIR-SW-Bench. Framework zur Bias-Evaluierung in KI gestützter Sozialarbeit]]