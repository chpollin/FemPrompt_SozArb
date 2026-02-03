#!/usr/bin/env python3
"""
LLM-based Assessment for Literature Review

Führt automatisiertes Assessment von Papers durch, basierend auf dem
Kategorienschema in categories.yaml. Verwendet Claude Haiku 4.5 für
kosteneffiziente Bewertung.

Usage:
    python run_llm_assessment.py --input data/papers.csv --config config/categories.yaml --output data/llm_assessment.csv
"""

import argparse
import csv
import json
import os
import sys
import time
from pathlib import Path
from typing import Optional

import yaml

try:
    import anthropic
except ImportError:
    print("Error: anthropic package not installed. Run: pip install anthropic")
    sys.exit(1)


def load_categories(config_path: str) -> dict:
    """Lädt Kategorie-Definitionen aus YAML-Datei."""
    with open(config_path, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)


def build_assessment_prompt(categories: dict) -> str:
    """Generiert Assessment-Prompt aus Kategorie-Definitionen."""

    category_descriptions = []
    for cat in categories.get('categories', []):
        desc = f"- **{cat['name']}**: {cat['definition'].strip()}"
        if cat.get('examples_positive'):
            desc += f"\n  Beispiele JA: {', '.join(cat['examples_positive'][:2])}"
        if cat.get('examples_negative'):
            desc += f"\n  Beispiele NEIN: {', '.join(cat['examples_negative'][:2])}"
        category_descriptions.append(desc)

    decision_info = categories.get('decision', {})
    include_criteria = decision_info.get('include_criteria', 'Nicht definiert')

    prompt = f"""Du bist ein wissenschaftlicher Reviewer für ein Literature Review zu feministischen AI Literacies in der Sozialen Arbeit.

## Aufgabe
Bewerte das Paper anhand der Kategorien. Die Decision MUSS logisch konsistent mit den Kategorie-Bewertungen sein!

## Kategorien (binär: Ja/Nein)

{chr(10).join(category_descriptions)}

## STRIKTE Entscheidungslogik

{include_criteria}

## WICHTIG - Konsistenzregel

Deine Decision MUSS mathematisch aus den Kategorien folgen:
- Zähle: Hat das Paper mindestens 1x Ja bei AI_Literacies, Generative_KI, Prompting oder KI_Sonstige? → TECHNIK_OK
- Zähle: Hat das Paper mindestens 1x Ja bei Soziale_Arbeit, Bias_Ungleichheit, Gender, Diversitaet, Feministisch oder Fairness? → SOZIAL_OK
- Wenn TECHNIK_OK UND SOZIAL_OK → Decision = "Include"
- Sonst → Decision = "Exclude"

Du darfst die Logik NICHT mit eigenem Judgment überschreiben!

## Exclusion Reasons
Falls Exclude: Duplicate, Not_relevant_topic, Wrong_publication_type, No_full_text, Language

## Output-Format (JSON)

Antworte NUR mit diesem JSON-Objekt:

```json
{{
  "AI_Literacies": "Ja" | "Nein",
  "Generative_KI": "Ja" | "Nein",
  "Prompting": "Ja" | "Nein",
  "KI_Sonstige": "Ja" | "Nein",
  "Soziale_Arbeit": "Ja" | "Nein",
  "Bias_Ungleichheit": "Ja" | "Nein",
  "Gender": "Ja" | "Nein",
  "Diversitaet": "Ja" | "Nein",
  "Feministisch": "Ja" | "Nein",
  "Fairness": "Ja" | "Nein",
  "Decision": "Include" | "Exclude" | "Unclear",
  "Exclusion_Reason": "..." | null,
  "Studientyp": "Empirisch" | "Experimentell" | "Theoretisch" | "Konzept" | "Literaturreview" | "Unclear",
  "Confidence": 0.0-1.0,
  "Reasoning": "Kurze Begründung (max 100 Wörter)"
}}
```
"""
    return prompt


def assess_paper(client: anthropic.Anthropic, system_prompt: str, paper: dict, model: str = "claude-3-5-haiku-20241022") -> Optional[dict]:
    """Bewertet ein einzelnes Paper mit dem LLM."""

    # Baue Paper-Text
    title = paper.get('Title', 'Unbekannt')
    abstract = paper.get('Abstract', '')
    author_year = paper.get('Author_Year', '')

    user_message = f"""## Paper zur Bewertung

**Titel:** {title}
**Autor/Jahr:** {author_year}

**Abstract:**
{abstract if abstract else '[Kein Abstract verfügbar]'}

Bewerte dieses Paper gemäß den definierten Kategorien.
"""

    try:
        response = client.messages.create(
            model=model,
            max_tokens=1024,
            system=system_prompt,
            messages=[{"role": "user", "content": user_message}]
        )

        # Extrahiere JSON aus Response
        content = response.content[0].text

        # Versuche JSON zu extrahieren (mit oder ohne Code-Block)
        if "```json" in content:
            json_str = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            json_str = content.split("```")[1].split("```")[0].strip()
        else:
            json_str = content.strip()

        result = json.loads(json_str)

        # Füge Token-Info hinzu
        result['_input_tokens'] = response.usage.input_tokens
        result['_output_tokens'] = response.usage.output_tokens

        return result

    except json.JSONDecodeError as e:
        print(f"  JSON Parse Error: {e}")
        return None
    except anthropic.APIError as e:
        print(f"  API Error: {e}")
        return None


def main():
    parser = argparse.ArgumentParser(description='LLM-basiertes Paper Assessment')
    parser.add_argument('--input', required=True, help='Input CSV mit Papers')
    parser.add_argument('--config', required=True, help='YAML config mit Kategorien')
    parser.add_argument('--output', required=True, help='Output CSV für Ergebnisse')
    parser.add_argument('--model', default='claude-3-5-haiku-20241022', help='Anthropic Model')
    parser.add_argument('--limit', type=int, help='Limit Anzahl Papers (für Tests)')
    parser.add_argument('--delay', type=float, default=0.5, help='Delay zwischen API calls (Sekunden)')
    parser.add_argument('--resume', action='store_true', help='Setze von letztem Checkpoint fort')
    args = parser.parse_args()

    # API Key prüfen (Umgebungsvariable oder .env Datei)
    api_key = os.environ.get('ANTHROPIC_API_KEY')

    # Versuche .env zu laden wenn kein Key in Umgebung
    if not api_key:
        env_file = Path(__file__).parent.parent.parent / '.env'
        if env_file.exists():
            with open(env_file, 'r') as f:
                for line in f:
                    if line.startswith('ANTHROPIC_API_KEY='):
                        api_key = line.split('=', 1)[1].strip()
                        break

    if not api_key:
        print("Error: ANTHROPIC_API_KEY not found in environment or .env file")
        sys.exit(1)

    client = anthropic.Anthropic(api_key=api_key)

    # Lade Kategorien und baue Prompt
    print(f"Lade Kategorien aus {args.config}...")
    categories = load_categories(args.config)
    system_prompt = build_assessment_prompt(categories)

    # Lade Papers
    print(f"Lade Papers aus {args.input}...")
    papers = []
    with open(args.input, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        papers = list(reader)

    print(f"Gefunden: {len(papers)} Papers")

    if args.limit:
        papers = papers[:args.limit]
        print(f"Limitiert auf: {len(papers)} Papers")

    # Checkpoint für Resume
    checkpoint_file = Path(args.output).with_suffix('.checkpoint.json')
    processed_ids = set()

    if args.resume and checkpoint_file.exists():
        with open(checkpoint_file, 'r') as f:
            checkpoint = json.load(f)
            processed_ids = set(checkpoint.get('processed_ids', []))
        print(f"Fortsetzen: {len(processed_ids)} bereits verarbeitet")

    # Output vorbereiten
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Header für Output
    output_fields = [
        'ID', 'Zotero_Key', 'Author_Year', 'Title',
        'AI_Literacies', 'Generative_KI', 'Prompting', 'KI_Sonstige',
        'Soziale_Arbeit', 'Bias_Ungleichheit', 'Gender', 'Diversitaet', 'Feministisch', 'Fairness',
        'Decision', 'Exclusion_Reason', 'Studientyp',
        'LLM_Confidence', 'LLM_Reasoning'
    ]

    # Sammle Ergebnisse
    results = []
    total_input_tokens = 0
    total_output_tokens = 0

    print(f"\nStarte Assessment mit Modell {args.model}...")
    print("-" * 60)

    for i, paper in enumerate(papers):
        paper_id = paper.get('ID', str(i))

        if paper_id in processed_ids:
            continue

        title = paper.get('Title', 'Unbekannt')[:60]
        print(f"[{i+1}/{len(papers)}] {title}...")

        assessment = assess_paper(client, system_prompt, paper, args.model)

        if assessment:
            result = {
                'ID': paper_id,
                'Zotero_Key': paper.get('Zotero_Key', ''),
                'Author_Year': paper.get('Author_Year', ''),
                'Title': paper.get('Title', ''),
                'AI_Literacies': assessment.get('AI_Literacies', ''),
                'Generative_KI': assessment.get('Generative_KI', ''),
                'Prompting': assessment.get('Prompting', ''),
                'KI_Sonstige': assessment.get('KI_Sonstige', ''),
                'Soziale_Arbeit': assessment.get('Soziale_Arbeit', ''),
                'Bias_Ungleichheit': assessment.get('Bias_Ungleichheit', ''),
                'Gender': assessment.get('Gender', ''),
                'Diversitaet': assessment.get('Diversitaet', ''),
                'Feministisch': assessment.get('Feministisch', ''),
                'Fairness': assessment.get('Fairness', ''),
                'Decision': assessment.get('Decision', ''),
                'Exclusion_Reason': assessment.get('Exclusion_Reason', ''),
                'Studientyp': assessment.get('Studientyp', ''),
                'LLM_Confidence': assessment.get('Confidence', ''),
                'LLM_Reasoning': assessment.get('Reasoning', '')
            }
            results.append(result)

            total_input_tokens += assessment.get('_input_tokens', 0)
            total_output_tokens += assessment.get('_output_tokens', 0)

            processed_ids.add(paper_id)

            # Checkpoint speichern
            with open(checkpoint_file, 'w') as f:
                json.dump({'processed_ids': list(processed_ids)}, f)

            print(f"  -> {assessment.get('Decision', 'N/A')} (Confidence: {assessment.get('Confidence', 'N/A')})")
        else:
            print(f"  -> FEHLER bei Bewertung")

        # Rate limiting
        time.sleep(args.delay)

    # Schreibe Ergebnisse
    print("-" * 60)
    print(f"\nSchreibe {len(results)} Ergebnisse nach {args.output}...")

    with open(args.output, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=output_fields)
        writer.writeheader()
        writer.writerows(results)

    # Kosten berechnen (Haiku 4.5 Preise: $1/MTok input, $5/MTok output)
    input_cost = (total_input_tokens / 1_000_000) * 1.00
    output_cost = (total_output_tokens / 1_000_000) * 5.00
    total_cost = input_cost + output_cost

    print(f"\n=== Zusammenfassung ===")
    print(f"Papers verarbeitet: {len(results)}")
    print(f"Input Tokens:  {total_input_tokens:,}")
    print(f"Output Tokens: {total_output_tokens:,}")
    print(f"Geschätzte Kosten: ${total_cost:.4f}")

    # Cleanup checkpoint
    if checkpoint_file.exists():
        checkpoint_file.unlink()

    print(f"\nErgebnis: {args.output}")


if __name__ == '__main__':
    main()
