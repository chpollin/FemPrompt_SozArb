---
title: "Evaluating the Prompt Steerability of Large Language Models"
authors: ["Erik Miehling", "Michael Desmond", "Karthikeyan Natesan Ramamurthy", "Elizabeth M. Daly", "Kush R. Varshney", "Eitan Farchi", "Pierre Dognin", "Jesus Rios", "Djallel Bouneffouf", "Miao Liu", "Prasanna Sattigeri"]
year: 2024
type: conferencePaper
language: en
processed: 2026-02-05
source_file: He_2024_steerability.md
confidence: 95
---

# Evaluating the Prompt Steerability of Large Language Models

## Kernbefund

Aktuelle Modelle zeigen begrenzte Steerability durch Prompting, mit asymmetrischen Fähigkeiten über Persona-Dimensionen und bei steering-Richtungen. Größere Modelle sind steuerbarer, aber alle zeigen Schwierigkeiten, von ihrer Baseline-Persönlichkeit abzuweichen.

## Forschungsfrage

In welchem Ausmaß können Large Language Models durch Prompting allein gesteuert werden, um verschiedene Personas und Wertsysteme widerzuspiegeln?

## Methodik

Empirisch: Benchmark-Entwicklung mit formaler Definition von Prompt-Steerability, Evaluation Profiles basierend auf Score-Funktionen, Analyse von Steerability-Indizes über mehrere Persona-Dimensionen hinweg unter Verwendung des Anthropic Persona Datasets.
**Datenbasis:** Anthropic Persona Dataset mit Statements für multiple Persona-Dimensionen (agreeableness, conscientiousness, political views, moral frameworks etc.); Evaluationen an 6 verschiedenen LLMs; yes/no Antworten auf Profiling-Fragen als primäre Datenform

## Hauptargumente

- AI-Pluralismus erfordert Modelle, die verschiedene Wertsysteme und Persönlichkeiten darstellen können, nicht ein durchschnittliches Menschenpräferenz-Alignment. Steerability ist ein notwendiger Mechanismus für solche pluralistischen Systeme.
- Prompting ist die praktisch machbarste Steer-Methode für Nutzer ohne Zugriff auf Modellgewichte oder Computekapazität, obwohl Fine-Tuning und Aktivierungs-Steering technisch effektiver sind.
- Die gemessene Baseline-Persönlichkeit eines Modells bestimmt seinen Widerstand gegen prompt-basierte Steering; asymmetrische Steerability in verschiedenen Richtungen hindert Modelle daran, das volle Spektrum möglicher Personas anzunehmen.

## Kategorie-Evidenz

### Evidenz 1

Benchmark zur Bewertung der Fähigkeit von Modellen, verschiedene Wertsysteme zu repräsentieren; 'understanding how much a model can be steered along a given dimension' als Kernkompetenz für AI-Literalität

### Evidenz 2

Fokus auf Large Language Models und deren Prompt-Verhalten; Evaluierung von LLMs wie GPT-4, Llama-3, Phi-3, Granite-Modellen

### Evidenz 3

Zentral: 'Our investigation focuses on prompting, primarily due to its simplicity in modifying model behavior'; Design von Steering-Funktionen σ über Prompts; Analyse von Persona-Statements als Prompting-Prinzipien

### Evidenz 4

Alignment-Forschung, Kontrolltheorie für LLMs, In-Context Learning, formally definition von Modellverhalten durch Evaluation Profiles

### Evidenz 5

Asymmetrische Steerability führt zu ungleichen Möglichkeiten, verschiedene Perspektiven zu vertreten; Baseline-Skew erzeugt Verzerrungen in der Steerability über Dimensionen

### Evidenz 6

'designing models that are able to be shaped to represent a wide range of value systems and cultures'; Fokus auf Pluralismus und Repräsentation verschiedener Persönlichkeiten und Wertsysteme

### Evidenz 7

Algorithmic Fairness durch Steerability: 'designing steerable models' für faire Behandlung verschiedener Wertesysteme; Evaluation von Fairness über multiple Persona-Dimensionen

## Assessment-Relevanz

**Domain Fit:** Das Paper hat begrenzte direkte Relevanz für Soziale Arbeit, ist aber hochgradig relevant für die Schnittstelle von KI-Governance, Fairness und pluralistischen Systemen, die vulnerable Gruppen repräsentieren müssen. Die Erkenntnisse zur Baseline-Persönlichkeit und asymmetrischen Steerability könnten für sozialarbeiterische Anwendungen von KI-Systemen wichtig sein.

**Unique Contribution:** Erste formalisierte Benchmark zur Messung von Prompt-Steerability mit kontrollierbaren Metriken (Steerability Indices), die baseline-Verhalten berücksichtigen und vergleichbare Analysen über Modelle und Persona-Dimensionen ermöglichen.

**Limitations:** Limitierungen: Abhängigkeit von Datensatzqualität (Persona-Statements); Binary Response-Format als mögliche Vereinfachung von realem Modellverhalten; keine Joint-Steerability über mehrere Dimensionen; Single-Turn Steering statt Multi-Turn Sequenzen; Möglichkeit von Caricature-Effekten; potentielle Ähnlichkeit zu Many-Shot Jailbreaking könnte Modell-Resistenz erklären.

**Target Group:** KI-Entwickler und Forscher (primär), AI Governance und Policy-Maker, Alignment-Forscher, Plattformdesigner von LLM-Systemen, sekundär: Sozialarbeiter und Care-Professionelle, die KI-Systeme einsetzen oder regulieren

## Schlüsselreferenzen

- [[Klingefjord_et_al_2024]] - AI/Algorithmic Pluralism
- [[Perez_et_al_2022]] - Red Teaming Language Models with Language Models
- [[Wolf_et_al_2023]] - Existence theorem on prompt manipulation
- [[Bhargava_et_al_2023]] - Control-theoretic perspective on prompt steerability
- [[Li_et_al_2023]] - Persona embeddings via prompt tuning
- [[Brown_et_al_2020]] - Language Models are Few-Shot Learners
- [[Yao_et_al_2023]] - FULCRA: Moral Values in Language Models
- [[Feng_et_al_2024]] - Community LMs for Pluralistic AI
- [[Anil_et_al_2024]] - Many-Shot Jailbreaking
- [[Sorensen_et_al_2024]] - AI Pluralism
