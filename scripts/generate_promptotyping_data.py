"""
Generate promptotyping_data.json for the Research-Promptotyping-Interface.

Reads from existing repo artifacts:
- pipeline/scripts/distill_knowledge.py (prompt constants)
- benchmark/scripts/run_llm_assessment.py (assessment prompt builder)
- benchmark/config/categories.yaml (category definitions)
- pipeline/knowledge/distilled/_verification/*.json (confidence scores)
- deep-research/restored/*.ris (provider counts)
- pipeline/knowledge/distilled/_stage1_json/ (example paper)
- pipeline/knowledge/distilled/_stage2_draft/ (example paper)
- pipeline/knowledge/distilled/ (example paper)

Outputs: docs/data/promptotyping_data.json
"""

import json
import os
import re
import glob
import yaml
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_PATH = REPO_ROOT / "docs" / "data" / "promptotyping_data.json"

# Example paper for the walkthrough
EXAMPLE_PAPER_STEM = "Ahmed_2024_Feminist_perspectives_on_AI_Ethical"


def extract_prompt_constants(py_path: Path) -> dict:
    """Extract STAGE*_PROMPT constants from distill_knowledge.py."""
    content = py_path.read_text(encoding="utf-8")
    prompts = {}
    for name in ["STAGE1_EXTRACT_CLASSIFY_PROMPT", "STAGE2_FORMAT_MARKDOWN_PROMPT", "STAGE3_VERIFY_PROMPT"]:
        pattern = rf'{name}\s*=\s*"""(.*?)"""'
        match = re.search(pattern, content, re.DOTALL)
        if match:
            raw = match.group(1).strip()
            # Replace Python format placeholders with readable markers
            raw = raw.replace("{markdown_content}", "[PAPER-INHALT WIRD HIER EINGEFUEGT]")
            raw = raw.replace("{extracted_json}", "[EXTRAHIERTES JSON AUS STUFE 1]")
            raw = raw.replace("{references_from_original}", "[REFERENZEN AUS ORIGINALTEXT]")
            raw = raw.replace("{original_excerpt}", "[ORIGINALTEXT-AUSSCHNITT]")
            raw = raw.replace("{knowledge_document}", "[GENERIERTES WISSENSDOKUMENT]")
            # Clean up Python-style double-braces to single for display
            raw = raw.replace("{{", "{").replace("}}", "}")
            # Remove template variables that are filled by Stage 2 code
            for var in ["{title}", "{authors_yaml}", "{year}", "{type}", "{language}",
                        "{categories_yaml}", "{date}", "{key_finding}", "{research_question}",
                        "{methodology}", "{data_basis_if_present}", "{argument1}", "{argument2}",
                        "{argument3}", "{category_evidence_sections}", "{domain_fit}",
                        "{unique_contribution}", "{limitations}", "{target_group}",
                        "{references_as_wikilinks}"]:
                raw = raw.replace(var, f"[{var[1:-1].upper()}]")
            prompts[name] = raw
    return prompts


def build_assessment_prompt_from_code(categories_path: Path) -> str:
    """Reconstruct the assessment prompt exactly as run_llm_assessment.py does."""
    with open(categories_path, "r", encoding="utf-8") as f:
        categories = yaml.safe_load(f)

    category_descriptions = []
    for cat in categories.get("categories", []):
        desc = f"- **{cat['name']}**: {cat['definition'].strip()}"
        if cat.get("examples_positive"):
            desc += f"\n  Beispiele JA: {', '.join(cat['examples_positive'][:2])}"
        if cat.get("examples_negative"):
            desc += f"\n  Beispiele NEIN: {', '.join(cat['examples_negative'][:2])}"
        category_descriptions.append(desc)

    decision_info = categories.get("decision", {})
    include_criteria = decision_info.get("include_criteria", "Nicht definiert")

    prompt = f"""Du bist ein wissenschaftlicher Reviewer. Deine Aufgabe ist die systematische Kategorisierung von Papers fuer ein Literature Review.

## Aufgabe
Bewerte das Paper anhand der Kategorien. Die Decision MUSS logisch konsistent mit den Kategorie-Bewertungen sein!

## Kategorien (binaer: Ja/Nein)

{chr(10).join(category_descriptions)}

## STRIKTE Entscheidungslogik

{include_criteria}

## WICHTIG - Konsistenzregel

Deine Decision MUSS mathematisch aus den Kategorien folgen:
- Zaehle: Hat das Paper mindestens 1x Ja bei AI_Literacies, Generative_KI, Prompting oder KI_Sonstige? -> TECHNIK_OK
- Zaehle: Hat das Paper mindestens 1x Ja bei Soziale_Arbeit, Bias_Ungleichheit, Gender, Diversitaet, Feministisch oder Fairness? -> SOZIAL_OK
- Wenn TECHNIK_OK UND SOZIAL_OK -> Decision = "Include"
- Sonst -> Decision = "Exclude"

Du darfst die Logik NICHT mit eigenem Judgment ueberschreiben!

## WICHTIG - Negative Constraints (Sycophancy-Mitigation)

Klassifiziere restriktiv. Bei Unsicherheit: "Nein" statt "Ja".

- **Feministisch = "Ja"** NUR wenn der Text EXPLIZIT feministische Theorie, Methoden oder Perspektiven verwendet ODER sich auf feministische Autor:innen bezieht (z.B. Crenshaw, Haraway, hooks, D'Ignazio, Harding, Butler). Implizite Naehe zu Gender-Themen reicht NICHT.
- **Soziale_Arbeit = "Ja"** NUR wenn der Text einen direkten Bezug zu sozialarbeiterischer Praxis, Theorie, Ausbildung oder Zielgruppen Sozialer Arbeit herstellt. Allgemeine "social impact"-Diskussionen reichen NICHT.
- **Prompting = "Ja"** NUR wenn Prompt-Engineering, Prompt-Strategien oder Eingabegestaltung ein substantielles Thema des Papers sind. Beilaeufige Erwaehnung von Prompts reicht NICHT.
- Vergib insgesamt nicht mehr als 4-5 Kategorien mit "Ja" pro Paper, es sei denn, der Text adressiert tatsaechlich mehr Bereiche mit Substanz.
- Eine Kategorie ist "Ja" nur wenn der Text sie SUBSTANTIELL behandelt, nicht wenn sie am Rande erwaehnt wird.

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
  "Reasoning": "Kurze Begruendung (max 100 Woerter)"
}}
```"""
    return prompt


def count_ris_entries(ris_path: Path) -> int:
    """Count number of TY entries in a RIS file."""
    if not ris_path.exists():
        return 0
    content = ris_path.read_text(encoding="utf-8", errors="ignore")
    return content.count("TY  -")


def load_verification_scores(verification_dir: Path) -> list:
    """Load all verification scores from _verification/ JSONs."""
    scores = []
    for json_path in sorted(verification_dir.glob("*.json")):
        try:
            data = json.loads(json_path.read_text(encoding="utf-8"))
            paper_id = json_path.stem
            entry = {
                "paper_id": paper_id,
                "completeness": data.get("verification", {}).get("completeness", {}).get("score", 0),
                "correctness": data.get("verification", {}).get("correctness", {}).get("score", 0),
                "categories": data.get("verification", {}).get("category_validation", {}).get("score", 0),
                "overall": data.get("overall_confidence", 0),
                "needs_correction": data.get("needs_correction", False),
            }
            scores.append(entry)
        except (json.JSONDecodeError, KeyError) as e:
            print(f"  Warning: Could not parse {json_path.name}: {e}")
    return scores


def load_categories(categories_path: Path) -> list:
    """Load category definitions from YAML."""
    with open(categories_path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)

    result = []
    for cat in data.get("categories", []):
        result.append({
            "name": cat["name"],
            "group": cat.get("group", "unknown"),
            "definition": cat["definition"].strip(),
            "examples_positive": cat.get("examples_positive", []),
            "examples_negative": cat.get("examples_negative", []),
        })
    return result


def load_example_paper(repo_root: Path, stem: str) -> dict:
    """Load all three stages of an example paper for the walkthrough."""
    stage1_path = repo_root / "pipeline" / "knowledge" / "distilled" / "_stage1_json" / f"{stem}.json"
    stage2_path = repo_root / "pipeline" / "knowledge" / "distilled" / "_stage2_draft" / f"{stem}.md"
    final_path = repo_root / "pipeline" / "knowledge" / "distilled" / f"{stem}.md"
    verification_path = repo_root / "pipeline" / "knowledge" / "distilled" / "_verification" / f"{stem}.json"

    example = {}

    if stage1_path.exists():
        example["stage1_json"] = json.loads(stage1_path.read_text(encoding="utf-8"))

    if stage2_path.exists():
        example["stage2_markdown"] = stage2_path.read_text(encoding="utf-8")

    if final_path.exists():
        example["final_document"] = final_path.read_text(encoding="utf-8")

    if verification_path.exists():
        example["verification"] = json.loads(verification_path.read_text(encoding="utf-8"))

    return example


def main():
    print("Generating promptotyping_data.json...")
    print(f"  Repo root: {REPO_ROOT}")

    data = {}

    # 1. Pipeline stats
    print("  [1/7] Pipeline stats...")
    distilled_count = len(list((REPO_ROOT / "pipeline" / "knowledge" / "distilled").glob("*.md")))
    stage1_count = len(list((REPO_ROOT / "pipeline" / "knowledge" / "distilled" / "_stage1_json").glob("*.json")))
    markdown_count = len(list((REPO_ROOT / "pipeline" / "markdown").glob("*.md"))) if (REPO_ROOT / "pipeline" / "markdown").exists() else 252
    pdf_count = len(list((REPO_ROOT / "pipeline" / "pdfs").glob("*.pdf"))) if (REPO_ROOT / "pipeline" / "pdfs").exists() else 257

    data["pipeline_stats"] = {
        "zotero_total": 326,
        "pdfs_acquired": pdf_count,
        "pdfs_missing": 326 - pdf_count,
        "markdown_converted": markdown_count,
        "knowledge_docs": distilled_count,
        "stage1_extracted": stage1_count,
        "verification_total": len(list((REPO_ROOT / "pipeline" / "knowledge" / "distilled" / "_verification").glob("*.json"))),
        "cost_ske": 7.00,
        "cost_10k": 1.44,
        "cost_5d": 1.15,
        "cost_total": 10.17,
    }

    # 2. Prompts
    print("  [2/7] Extracting prompts...")
    distill_path = REPO_ROOT / "pipeline" / "scripts" / "distill_knowledge.py"
    categories_path = REPO_ROOT / "benchmark" / "config" / "categories.yaml"

    ske_prompts = extract_prompt_constants(distill_path)
    assessment_prompt = build_assessment_prompt_from_code(categories_path)

    data["prompts"] = {
        "stage1_extract": ske_prompts.get("STAGE1_EXTRACT_CLASSIFY_PROMPT", ""),
        "stage2_format": ske_prompts.get("STAGE2_FORMAT_MARKDOWN_PROMPT", ""),
        "stage2_note": "Stufe 2 ist DETERMINISTISCH: Kein LLM, reine Template-basierte Formatierung. Der Prompt hier beschreibt das Format-Schema, wird aber von Python-Code (nicht LLM) ausgefuehrt.",
        "stage3_verify": ske_prompts.get("STAGE3_VERIFY_PROMPT", ""),
        "assessment_10k": assessment_prompt,
    }

    # 3. Categories
    print("  [3/7] Loading categories...")
    data["categories"] = load_categories(categories_path)

    # 4. Verification scores
    print("  [4/7] Loading verification scores...")
    verification_dir = REPO_ROOT / "pipeline" / "knowledge" / "distilled" / "_verification"
    scores = load_verification_scores(verification_dir)
    data["verification_scores"] = scores

    pass_count = sum(1 for s in scores if s["overall"] >= 75)
    data["pipeline_stats"]["verification_pass"] = pass_count
    print(f"    {len(scores)} scores loaded, {pass_count}/{len(scores)} pass (>= 75)")

    # 5. Deep Research RIS providers
    print("  [5/7] Counting RIS entries...")
    ris_dir = REPO_ROOT / "deep-research" / "restored"
    data["deep_research_ris"] = {
        "providers": [
            {"name": "Claude", "entries": count_ris_entries(ris_dir / "Claude.ris")},
            {"name": "Gemini", "entries": count_ris_entries(ris_dir / "Gemini.ris")},
            {"name": "OpenAI (ChatGPT)", "entries": count_ris_entries(ris_dir / "OpenAI.ris")},
            {"name": "Perplexity", "entries": count_ris_entries(ris_dir / "Perplexity.ris")},
        ]
    }
    for p in data["deep_research_ris"]["providers"]:
        print(f"    {p['name']}: {p['entries']} entries")

    # 6. Example paper walkthrough
    print("  [6/7] Loading example paper...")
    data["example_paper"] = load_example_paper(REPO_ROOT, EXAMPLE_PAPER_STEM)
    stages_found = [k for k in data["example_paper"].keys()]
    print(f"    Stages found: {', '.join(stages_found)}")

    # 7. Limitations
    print("  [7/7] Writing limitations...")
    data["limitations"] = [
        {
            "id": "paywall",
            "title": "Paywall-Luecke",
            "description": f"{326 - pdf_count} von 326 Papers fehlen (Paywall). Systematische Unterrepraesentation kostenpflichtiger Literatur.",
            "affected_step": 1,
        },
        {
            "id": "source_tool",
            "title": "Provider-Zuordnung unvollstaendig",
            "description": "290 von 326 Papers ohne verifizierte Provider-Zuordnung. Die Aufteilung '254 Deep Research / 50 Manual' stammt aus Zotero-Collections, nur 34 Papers sind via RIS-Matching verifiziert.",
            "affected_step": 1,
        },
        {
            "id": "prompts_lost",
            "title": "Instanziierte Prompts verloren",
            "description": "Das Deep-Research-Prompt-Template ist versioniert, aber die konkreten, instanziierten Prompts (mit eingesetzten Parametern) sind nicht erhalten.",
            "affected_step": 1,
        },
        {
            "id": "sycophancy_no_ab",
            "title": "Keine empirische Validierung der Anti-Sycophancy-Massnahmen",
            "description": "Die negativen Constraints im Assessment-Prompt sind theoretisch begruendet (Malmqvist), aber nicht durch A/B-Tests gegen einen Prompt ohne Constraints validiert.",
            "affected_step": 4,
        },
        {
            "id": "proprietary",
            "title": "Proprietaere Modellabhaengigkeit",
            "description": "Die gesamte Pipeline ist an ein proprietaeres Modell (Anthropic Claude Haiku 4.5) gebunden. Reproduzierbarkeit ist durch Modellversionierung eingeschraenkt.",
            "affected_step": "all",
        },
        {
            "id": "info_asymmetry",
            "title": "Unterschiedliche Informationsbasen",
            "description": "Human-Assessment basiert auf Titel und Abstract (Google Spreadsheet). LLM-Assessment basiert auf Knowledge-Dokumenten (extrahiert aus Volltexten). Die Divergenzen bilden teilweise Informationstiefe-Unterschiede ab, nicht nur Urteilsunterschiede.",
            "affected_step": 4,
        },
    ]

    # Write output
    print(f"\n  Writing to {OUTPUT_PATH}...")
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    file_size = OUTPUT_PATH.stat().st_size / 1024
    print(f"  Done! {file_size:.1f} KB written.")


if __name__ == "__main__":
    main()
