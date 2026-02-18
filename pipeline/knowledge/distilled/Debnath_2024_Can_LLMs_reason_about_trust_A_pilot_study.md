---
title: "Can LLMs Reason About Trust? A Pilot Study"
authors: ["Anushka Debnath", "Stephen Cranefield", "Emiliano Lorini", "Bastin Tony Roy Savarimuthu"]
year: 2024
type: conferencePaper
language: en
processed: 2026-02-05
source_file: Debnath_2024_Can_LLMs_reason_about_trust_A_pilot_study.md
confidence: 88
---

# Can LLMs Reason About Trust? A Pilot Study

## Kernbefund

LLMs zeigen grundsätzliche Fähigkeit, Vertrauen anhand von Willingness, Competence und Safety zu analysieren und strategische Aktionspläne zu entwickeln; GPT-4o performt am besten, aber alle Modelle zeigen Halluzinationen und Fehlurteile bei komplexen Szenarien.

## Forschungsfrage

Können Large Language Models über Vertrauen zwischen zwei Personen reasoning durchführen und Vertrauen durch strategische Planung aufbauen?

## Methodik

Empirisch mit Mixed-Methods: Fallstudienanalyse von fünf Dialogszenarien zwischen Professor und PhD-Student; Vergleich von vier LLM-Modellen (gpt-4o, llama-3.3-70b, mixtral-8x7b, gemma2-9b) gegen menschliche Grundwahrheit; iteratives Prompt-Response-Design mit standardisierten Trust-Fragen.
**Datenbasis:** Qualitative Fallstudien: 5 Dialogszenarien (Fallstudie 1) + 2 Rollen-Play-Szenarien (Fallstudie 2); Vergleich mit Annotationen der Erstautorin als Ground Truth; keine quantitativen Survey-Daten

## Hauptargumente

- LLMs können komplexe mentale Zustände (beliefs, goals, intentions) zur Vertrauensmodellierung erfassen, wo traditionelle symbolische Ansätze scheitern. Sie lernen Vertrauensmuster aus großen Datenmengen und adaptieren sich flexibel an neue Kontexte ohne vordefinierte logische Regeln.
- Castelfranchi und Falcones sozio-kognitive Vertrauenstheorie mit den Komponenten Trustor, Trustee, Action und Goal bietet ein rigoroses Framework für die Evaluation von LLM-Reasoning über Vertrauen in dynamischen, zielorientierten Szenarien wie Professor-Student-Beziehungen.
- LLMs können nicht nur Vertrauen zwischen Individuen analysieren, sondern auch proaktiv Vertrauensaufbau durch rollenbasierte Szenarien planen und konkrete Handlungsschritte vorschlagen, was Anwendungen in menschlich-computergestützten sozialen Interaktionen eröffnet.

## Kategorie-Evidenz

### Evidenz 1

Das Paper evaluiert die Fähigkeit von Menschen (oder Systemen), KI-Modelle zu verstehen und deren Reasoning über soziale Konzepte kritisch zu bewerten. 'we assess whether LLMs are capable of inducing trust by role-playing' und die Notwendigkeit, LLM-Halluzinationen und Fehlurteile zu erkennen.

### Evidenz 2

Expliziter Fokus auf vier state-of-the-art LLM-Modelle: gpt-4o, llama-3.3-70b-versatile, mixtral-8x7b-32768, gemma2-9b-it. 'Large Language Models (LLMs) are advanced AI systems designed to understand, generate, and process human language'

### Evidenz 3

Detailliertes System-Prompt-Design in Abb. 1 mit strukturierten Fragen zu Zielen, Willingness, Competence, Security. Iteratives Prompt-Response-Cycle mit Zusammenfassungen und Kontextanreicherung (Abb. 2).

### Evidenz 4

Theoretische Fundierung in Multi-Agent-Systemen (MAS), Comparison zwischen computational und socio-cognitive Trust Models, Bezug zu symbolischer KI und AI Planning.

### Evidenz 5

Anwendungskontext: Beziehungen zwischen PhD-Student und Supervisor, die 'long-term, healthy relationships' und 'cooperation' erfordern. Relevanz für 'computer-supported human interactions' und 'establishment and maintenance of relationships'.

### Evidenz 6

Das Paper adressiert implizit Fairness durch die Evaluation, ob verschiedene LLM-Modelle konsistent und reliabel über Vertrauen urteilen. Vergleich zeigt unterschiedliche Modell-Performances (GPT-4o vs. Gemma2-9b), was auf Fairness-Disparitäten hinweist: 'Gemma underperforms, scoring the lowest in willingness'.

## Assessment-Relevanz

**Domain Fit:** Das Paper ist hochrelevant für die Schnittstelle von generativer KI und sozialen Beziehungen, hat aber nur indirekten Bezug zu Sozialer Arbeit. Es adressiert AI-Kompetenzentwicklung und technisches Verständnis von LLM-Capabilities im Kontext vertrauensbasierter professioneller Beziehungen, die für sozialarbeiterische Theorie und Praxis von Interesse sind.

**Unique Contribution:** Das Paper leistet einen ersten empirischen Beitrag zur Evaluation der Fähigkeit von LLMs, komplexe sozio-kognitive Vertrauenskonzepte zu reasoning und strategisch anzuwenden, was die Lücke zwischen symbolischen KI-Ansätzen und modernen generativen Modellen adressiert.

**Limitations:** Limitiert auf eine einzelne Anwendungsdomäne (PhD-Student-Supervisor); kleine Stichprobe (2 Fallstudien, 7 Szenarien); Ground Truth nur von einer Person annotiert; keine Validierung mit echten Benutzerstudien oder realen Vertrauensdynamiken; LLM-Halluzinationen und Fehlurteile nicht systematisch analysiert.

**Target Group:** KI-Forschende (insbes. NLP/LLM-Entwickler), Informatiker in Multi-Agent-Systemen, Hochschulforschende zu Vertrauen und menschlich-computergestützten Interaktionen, potentiell Sozialarbeiter und Care-Professionelle mit Interesse an KI-Assistenzsystemen.

## Schlüsselreferenzen

- [[Castelfranchi_Falcone_2010]] - Trust Theory: A Socio-Cognitive and Computational Model
- [[Castelfranchi_et_al_2008]] - A non-reductionist approach to trust
- [[Falcone_Castelfranchi_2001]] - Social trust: A cognitive approach
- [[Park_et_al_2023]] - Generative agents: Interactive simulacra of human behavior
- [[Xi_et_al_2023]] - The rise and potential of large language model based agents: A survey
- [[Herzig_et_al_2010]] - A logic of trust and reputation
- [[Lorini_Demolombe_2008]] - From binary trust to graded trust in information sources
- [[Marsh_1994]] - Formalising Trust as a Computational Concept
- [[Gambetta_1988]] - Can we trust trust?
