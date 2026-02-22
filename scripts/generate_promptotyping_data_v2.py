#!/usr/bin/env python3
"""
Generate promptotyping_v2.json for the Promptotyping Web Interface v2.

Reads from vault cache + all source data. No LLM calls -- pure data transformation.

Output structure:
  - papers: 249 paper journeys (transformation through 5 pipeline stages)
  - concepts: graph data (nodes + edges)
  - divergences: 111 classified disagreement cases
  - pipeline: stage definitions + Sankey flow data
  - categories: 10 category definitions
  - meta: confusion matrix, kappa, rates, totals

Outputs: docs/data/promptotyping_v2.json
"""

import json
import csv
import re
import yaml
from pathlib import Path
from collections import defaultdict

REPO_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_PATH = REPO_ROOT / "docs" / "data" / "promptotyping_v2.json"

ASSESSMENT_CATEGORIES = [
    "AI_Literacies", "Generative_KI", "Prompting", "KI_Sonstige",
    "Soziale_Arbeit", "Bias_Ungleichheit", "Gender",
    "Diversitaet", "Feministisch", "Fairness"
]

TECHNIK_CATEGORIES = {"AI_Literacies", "Generative_KI", "Prompting", "KI_Sonstige"}
SOZIAL_CATEGORIES = {"Soziale_Arbeit", "Bias_Ungleichheit", "Gender", "Diversitaet", "Feministisch", "Fairness"}

# Featured papers for the landing page (hand-picked to illustrate three epistemic stances)
FEATURED_PAPERS = {
    "Ahmed_2024_Feminist_perspectives_on_AI_Ethical": {
        "why": "Semantische Expansion: LLM liest nur 'AI Literacy', Human erkennt feministisch-ethischen Kern",
        "stance_highlight": "limits",
    },
    "Shafie_2025_More_or_less_wrong_A_benchmark_for_directional": {
        "why": "Keyword-Inklusion: LLM findet Bias-Keywords, aber nicht den klinischen Kontext ausserhalb Sozialer Arbeit",
        "stance_highlight": "process",
    },
    "Kaneko_2024_Debiasing_prompts_for_gender_bias_in_large": {
        "why": "Volle Uebereinstimmung: Pipeline und Mensch erkennen Gender-Bias-Forschung als relevant",
        "stance_highlight": "result",
    },
}


# ---------------------------------------------------------------------------
# Reusable loaders (from generate_promptotyping_data.py)
# ---------------------------------------------------------------------------

def extract_prompt_constants(py_path: Path) -> dict:
    """Extract STAGE*_PROMPT constants from distill_knowledge.py."""
    if not py_path.exists():
        return {}
    content = py_path.read_text(encoding="utf-8")
    prompts = {}
    for name in ["STAGE1_EXTRACT_CLASSIFY_PROMPT", "STAGE2_FORMAT_MARKDOWN_PROMPT", "STAGE3_VERIFY_PROMPT"]:
        pattern = rf'{name}\s*=\s*"""(.*?)"""'
        match = re.search(pattern, content, re.DOTALL)
        if match:
            raw = match.group(1).strip()
            raw = raw.replace("{markdown_content}", "[PAPER-INHALT]")
            raw = raw.replace("{extracted_json}", "[EXTRAHIERTES JSON AUS STUFE 1]")
            raw = raw.replace("{references_from_original}", "[REFERENZEN AUS ORIGINALTEXT]")
            raw = raw.replace("{original_excerpt}", "[ORIGINALTEXT-AUSSCHNITT]")
            raw = raw.replace("{knowledge_document}", "[GENERIERTES WISSENSDOKUMENT]")
            raw = raw.replace("{{", "{").replace("}}", "}")
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
    """Reconstruct assessment prompt from categories.yaml."""
    if not categories_path.exists():
        return ""
    with open(categories_path, "r", encoding="utf-8") as f:
        categories = yaml.safe_load(f)

    cat_descriptions = []
    for cat in categories.get("categories", []):
        desc = f"- **{cat['name']}**: {cat['definition'].strip()}"
        if cat.get("examples_positive"):
            desc += f"\n  Beispiele JA: {', '.join(cat['examples_positive'][:2])}"
        if cat.get("examples_negative"):
            desc += f"\n  Beispiele NEIN: {', '.join(cat['examples_negative'][:2])}"
        cat_descriptions.append(desc)

    decision_info = categories.get("decision", {})
    include_criteria = decision_info.get("include_criteria", "Nicht definiert")

    return f"""Du bist ein wissenschaftlicher Reviewer...

## Kategorien (binaer: Ja/Nein)

{chr(10).join(cat_descriptions)}

## STRIKTE Entscheidungslogik

{include_criteria}

## Negative Constraints (Sycophancy-Mitigation)

- Feministisch = "Ja" NUR bei EXPLIZIT feministischer Theorie/Methode
- Soziale_Arbeit = "Ja" NUR bei direktem Bezug zu sozialarbeiterischer Praxis
- Prompting = "Ja" NUR bei substantiellem Prompt-Engineering-Fokus
- Max 4-5 Kategorien "Ja" pro Paper

(Vollstaendiger Prompt: siehe benchmark/scripts/run_llm_assessment.py)"""


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


def load_verification_scores(verification_dir: Path) -> dict:
    """Load verification scores indexed by paper stem."""
    scores = {}
    for json_path in sorted(verification_dir.glob("*.json")):
        try:
            data = json.loads(json_path.read_text(encoding="utf-8"))
            scores[json_path.stem] = {
                "completeness": data.get("verification", {}).get("completeness", {}).get("score", 0),
                "correctness": data.get("verification", {}).get("correctness", {}).get("score", 0),
                "categories": data.get("verification", {}).get("category_validation", {}).get("score", 0),
                "overall": data.get("overall_confidence", 0),
                "needs_correction": data.get("needs_correction", False),
            }
        except (json.JSONDecodeError, KeyError):
            pass
    return scores


# ---------------------------------------------------------------------------
# Data builders
# ---------------------------------------------------------------------------

def load_assessments(repo_root: Path):
    """Load LLM and human assessments, indexed by Zotero_Key."""
    llm_assessments = {}
    human_assessments = {}

    llm_path = repo_root / "benchmark" / "data" / "llm_assessment_10k.csv"
    if llm_path.exists():
        with open(llm_path, "r", encoding="utf-8-sig", newline="") as f:
            for row in csv.DictReader(f):
                key = row.get("Zotero_Key", "").strip()
                if not key:
                    continue
                cats = {}
                for cat in ASSESSMENT_CATEGORIES:
                    cats[cat] = row.get(cat, "").strip() == "Ja"
                try:
                    confidence = float(row.get("LLM_Confidence", 0) or 0)
                except (ValueError, TypeError):
                    confidence = 0.0
                llm_assessments[key] = {
                    "decision": row.get("Decision", "").strip(),
                    "categories": cats,
                    "confidence": round(confidence, 2),
                    "reasoning": row.get("LLM_Reasoning", "").strip()[:500],
                    "author_year": row.get("Author_Year", "").strip(),
                    "title": row.get("Title", "").strip(),
                }

    human_path = repo_root / "benchmark" / "data" / "human_assessment.csv"
    if human_path.exists():
        with open(human_path, "r", encoding="utf-8-sig", newline="") as f:
            for row in csv.DictReader(f):
                key = row.get("Zotero_Key", "").strip()
                if not key:
                    continue
                decision = row.get("Decision", "").strip()
                if not decision:
                    continue
                cats = {}
                for cat in ASSESSMENT_CATEGORIES:
                    cats[cat] = row.get(cat, "").strip() == "Ja"
                human_assessments[key] = {
                    "decision": decision,
                    "categories": cats,
                }

    return llm_assessments, human_assessments


def load_zotero_items(repo_root: Path) -> dict:
    """Load Zotero items indexed by key."""
    zotero_path = repo_root / "corpus" / "zotero_export.json"
    if not zotero_path.exists():
        return {}
    items = json.loads(zotero_path.read_text(encoding="utf-8"))
    return {item["key"]: item for item in items if item.get("key")}


def load_concept_cache(cache_dir: Path) -> dict:
    """Load cached concept extractions."""
    concepts_dir = cache_dir / "concepts"
    if not concepts_dir.exists():
        return {}
    result = {}
    for json_path in sorted(concepts_dir.glob("*.json")):
        try:
            result[json_path.stem] = json.loads(json_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            pass
    return result


def load_divergence_cache(cache_dir: Path) -> dict:
    """Load cached divergence classifications."""
    div_dir = cache_dir / "divergences"
    if not div_dir.exists():
        return {}
    result = {}
    for json_path in sorted(div_dir.glob("*.json")):
        try:
            result[json_path.stem] = json.loads(json_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            pass
    return result


def build_knowledge_to_zotero_mapping(repo_root: Path) -> dict:
    """Use the vault generator's matching logic to build stem -> zotero_key mapping."""
    # Import and use the matching from generate_vault_v2
    import sys
    sys.path.insert(0, str(repo_root / "scripts"))
    from generate_vault_v2 import build_knowledge_doc_to_zotero_index

    knowledge_dir = repo_root / "pipeline" / "knowledge" / "distilled"
    zotero_path = repo_root / "corpus" / "zotero_export.json"
    stage1_dir = knowledge_dir / "_stage1_json"

    zotero_items = json.loads(zotero_path.read_text(encoding="utf-8"))
    result, unmatched = build_knowledge_doc_to_zotero_index(knowledge_dir, zotero_items, stage1_dir)
    return result


# ---------------------------------------------------------------------------
# Concept graph builder (synonym map from generate_vault_v2)
# ---------------------------------------------------------------------------

CONCEPT_SYNONYMS = {
    'algorithmic bias': 'Algorithmic Bias',
    'algorithm bias': 'Algorithmic Bias',
    'ai bias': 'AI Bias',
    'artificial intelligence bias': 'AI Bias',
    'gender bias': 'Gender Bias',
    'racial bias': 'Racial Bias',
    'intersectionality': 'Intersectionality',
    'intersectional analysis': 'Intersectionality',
    'feminist ai': 'Feminist AI',
    'feminist hci': 'Feminist HCI',
    'fairness': 'Algorithmic Fairness',
    'algorithmic fairness': 'Algorithmic Fairness',
    'ai fairness': 'Algorithmic Fairness',
    'ai literacy': 'AI Literacy',
    'ai literacies': 'AI Literacy',
    'prompt engineering': 'Prompt Engineering',
    'prompting': 'Prompt Engineering',
    'llm': 'Large Language Models',
    'llms': 'Large Language Models',
    'large language models': 'Large Language Models',
    'generative ai': 'Generative AI',
    'social work': 'Social Work',
    'soziale arbeit': 'Social Work',
    'data justice': 'Data Justice',
    'data feminism': 'Data Feminism',
    'responsible ai': 'Responsible AI',
    'explainable ai': 'Explainable AI',
    'xai': 'Explainable AI',
    'natural language processing': 'Natural Language Processing',
    'nlp': 'Natural Language Processing',
}


def build_concept_graph(concept_cache: dict) -> dict:
    """Build concept graph nodes + edges from cached extractions."""
    # Consolidate concepts
    concept_data = defaultdict(lambda: {"definitions": [], "papers": [], "frequency": 0})
    paper_concepts = {}  # stem -> [canonical_names]

    for stem, concepts_list in concept_cache.items():
        canonicals = set()
        for c in concepts_list:
            name = c.get("concept", "").strip()
            if not name:
                continue
            lower = name.lower()
            canonical = CONCEPT_SYNONYMS.get(lower, name)
            if lower not in CONCEPT_SYNONYMS and not canonical[0].isupper():
                canonical = canonical.title()
            canonicals.add(canonical)
            if c.get("definition"):
                concept_data[canonical]["definitions"].append(c["definition"])

        for canonical in canonicals:
            concept_data[canonical]["papers"].append(stem)
            concept_data[canonical]["frequency"] += 1
        paper_concepts[stem] = list(canonicals)

    # Filter frequency >= 2
    filtered = {}
    for name, data in concept_data.items():
        if data["frequency"] >= 2:
            defs = data["definitions"]
            best_def = max(defs, key=len) if defs else ""
            filtered[name] = {
                "definition": best_def,
                "papers": data["papers"],
                "frequency": data["frequency"],
            }

    # Build co-occurrence
    co_occurrence = defaultdict(int)
    valid_concepts = set(filtered.keys())
    for stem, canonicals in paper_concepts.items():
        valid = sorted(set(c for c in canonicals if c in valid_concepts))
        for i, c1 in enumerate(valid):
            for c2 in valid[i + 1:]:
                pair = tuple(sorted([c1, c2]))
                co_occurrence[pair] += 1

    # Build graph
    nodes = []
    for name, data in sorted(filtered.items(), key=lambda x: x[1]["frequency"], reverse=True):
        nodes.append({
            "id": name,
            "label": name,
            "frequency": data["frequency"],
            "papers_count": len(data["papers"]),
            "definition": data["definition"][:300],
        })

    edges = []
    for (c1, c2), weight in sorted(co_occurrence.items(), key=lambda x: x[1], reverse=True):
        if weight >= 2:  # Only edges with >= 2 shared papers
            edges.append({
                "source": c1,
                "target": c2,
                "weight": weight,
            })

    return {"nodes": nodes, "edges": edges}


def assign_concept_clusters(concept_graph: dict, papers: list) -> None:
    """Assign technik/sozial/bridge cluster to each concept node based on category affinity."""
    # Build paper lookup by concept
    paper_by_concept = defaultdict(list)
    for p in papers:
        for c in p.get("concepts", []):
            paper_by_concept[c].append(p)

    for node in concept_graph["nodes"]:
        concept_papers = paper_by_concept.get(node["id"], [])
        technik_score = 0
        sozial_score = 0
        for p in concept_papers:
            cats = p.get("stages", {}).get("ske", {}).get("stage1_categories", {})
            technik_score += sum(1 for c in TECHNIK_CATEGORIES if cats.get(c))
            sozial_score += sum(1 for c in SOZIAL_CATEGORIES if cats.get(c))

        total = technik_score + sozial_score
        if total == 0:
            node["cluster"] = "bridge"
        elif technik_score / total > 0.65:
            node["cluster"] = "technik"
        elif sozial_score / total > 0.65:
            node["cluster"] = "sozial"
        else:
            node["cluster"] = "bridge"


# ---------------------------------------------------------------------------
# Paper journey builder
# ---------------------------------------------------------------------------

def build_paper_journeys(
    repo_root: Path,
    kd_to_zotero: dict,
    llm_assessments: dict,
    human_assessments: dict,
    zotero_by_key: dict,
    verif_scores: dict,
    concept_cache: dict,
    divergence_cache: dict,
    disagreements: list,
) -> list:
    """Build transformation journey for each of the 249 knowledge docs."""
    knowledge_dir = repo_root / "pipeline" / "knowledge" / "distilled"
    stage1_dir = knowledge_dir / "_stage1_json"

    # Build disagreement lookup by Zotero key
    disagree_by_key = {}
    for row in disagreements:
        pid = row.get("paper_id", "")
        # Find the Zotero key for this paper
        # The paper_id in disagreements.csv is the row index, not Zotero key
        # We need to match by title or use the data directly
        disagree_by_key[pid] = row

    # Also build by title for matching
    disagree_by_title = {}
    for row in disagreements:
        title = row.get("title", "").strip().lower()
        if title:
            disagree_by_title[title] = row

    papers = []
    for stem_path in sorted(knowledge_dir.glob("*.md")):
        stem = stem_path.stem

        match_data = kd_to_zotero.get(stem, {})
        zotero_item = match_data.get("zotero_item", {})
        zotero_key = match_data.get("zotero_key", "")

        # Basic info
        creators = zotero_item.get("creators", [])
        authors = [f"{c.get('firstName', '')} {c.get('lastName', '')}".strip() for c in creators]
        first_author = creators[0].get("lastName", "") if creators else ""
        year = (zotero_item.get("date", "") or "").split("-")[0] or ""
        author_year = f"{first_author} ({year})" if first_author and year else stem.split("_")[0]
        title = zotero_item.get("title", stem) or stem

        # Stage 1: SKE extraction
        stage1 = {}
        stage1_path = stage1_dir / f"{stem}.json"
        if stage1_path.exists():
            try:
                s1 = json.loads(stage1_path.read_text(encoding="utf-8"))
                cats = s1.get("categories", {})
                stage1 = {
                    "categories": {k: v for k, v in cats.items() if isinstance(v, bool)},
                    "arguments_count": len(s1.get("arguments", [])),
                    "key_finding": s1.get("core", {}).get("key_finding", "")[:200],
                }
            except json.JSONDecodeError:
                pass

        # Stage 3: Verification
        verif = verif_scores.get(stem, {})

        # Stage 4: Assessment
        llm_data = llm_assessments.get(zotero_key, {})
        human_data = human_assessments.get(zotero_key, {})

        assessment = {}
        if llm_data:
            assessment["llm"] = {
                "decision": llm_data["decision"],
                "confidence": llm_data["confidence"],
                "categories": [c for c, v in llm_data["categories"].items() if v],
                "reasoning": llm_data.get("reasoning", "")[:300],
            }
        if human_data:
            assessment["human"] = {
                "decision": human_data["decision"],
                "categories": [c for c, v in human_data["categories"].items() if v],
            }

        # Agreement
        if llm_data and human_data:
            assessment["agreement"] = "agree" if llm_data["decision"] == human_data["decision"] else "disagree"
        elif llm_data:
            assessment["agreement"] = "llm_only"

        # Divergence pattern
        if assessment.get("agreement") == "disagree":
            # Find matching disagreement row
            title_lower = title.lower().strip()
            disagree_row = disagree_by_title.get(title_lower, {})
            if disagree_row:
                pid = disagree_row.get("paper_id", "")
                div_cls = divergence_cache.get(pid, {})
                assessment["divergence_pattern"] = div_cls.get("pattern", "")
                assessment["divergence_justification"] = div_cls.get("justification", "")
                assessment["disagreement_type"] = disagree_row.get("disagreement_type", "")
                assessment["severity"] = int(disagree_row.get("severity", 0)) if disagree_row.get("severity", "").isdigit() else 0

        # Concepts
        raw_concepts = concept_cache.get(stem, [])
        concept_names = []
        for c in raw_concepts:
            name = c.get("concept", "").strip()
            if name:
                lower = name.lower()
                canonical = CONCEPT_SYNONYMS.get(lower, name)
                concept_names.append(canonical)

        # Knowledge doc summary (Kernbefund)
        kd_content = stem_path.read_text(encoding="utf-8")
        kernbefund = ""
        kb_match = re.search(r'## Kernbefund\s*\n\n(.*?)(?=\n\n##|\Z)', kd_content, re.DOTALL)
        if kb_match:
            kernbefund = kb_match.group(1).strip()[:400]

        paper = {
            "id": zotero_key or stem,
            "stem": stem,
            "title": title,
            "author_year": author_year,
            "year": int(year) if year.isdigit() else None,
            "stages": {
                "identification": {
                    "in_zotero": bool(zotero_key),
                },
                "conversion": {
                    "pdf_acquired": True,  # All 249 have PDFs (they have knowledge docs)
                    "markdown_converted": True,
                },
                "ske": {
                    "stage1_categories": stage1.get("categories", {}),
                    "stage1_arguments_count": stage1.get("arguments_count", 0),
                    "stage1_key_finding": stage1.get("key_finding", ""),
                    "stage3_completeness": verif.get("completeness", 0),
                    "stage3_correctness": verif.get("correctness", 0),
                    "stage3_overall": verif.get("overall", 0),
                },
                "assessment": assessment,
            },
            "concepts": list(set(concept_names)),
            "knowledge_summary": kernbefund,
        }

        # Featured paper annotation
        if stem in FEATURED_PAPERS:
            paper["featured"] = FEATURED_PAPERS[stem]

        papers.append(paper)

    return papers


# ---------------------------------------------------------------------------
# Pipeline flow (Sankey data)
# ---------------------------------------------------------------------------

def build_pipeline_flow() -> dict:
    """Build Sankey flow data for the pipeline visualization."""
    nodes = [
        {"id": "zotero", "label": "Zotero (326)", "value": 326, "stage": 0},
        {"id": "pdfs", "label": "PDFs (257)", "value": 257, "stage": 1},
        {"id": "pdfs_missing", "label": "Fehlende PDFs (69)", "value": 69, "stage": 1},
        {"id": "markdown", "label": "Markdown (252)", "value": 252, "stage": 2},
        {"id": "conv_fail", "label": "Konversions-Fehler (5)", "value": 5, "stage": 2},
        {"id": "knowledge", "label": "Knowledge Docs (249)", "value": 249, "stage": 3},
        {"id": "ske_fail", "label": "SKE-Verlust (3)", "value": 3, "stage": 3},
        {"id": "assessed_both", "label": "Dual bewertet (210)", "value": 210, "stage": 4},
        {"id": "assessed_llm", "label": "Nur LLM (39)", "value": 39, "stage": 4},
        {"id": "agree", "label": "Agreement (99)", "value": 99, "stage": 5},
        {"id": "disagree", "label": "Disagreement (111)", "value": 111, "stage": 5},
    ]

    links = [
        {"source": "zotero", "target": "pdfs", "value": 257},
        {"source": "zotero", "target": "pdfs_missing", "value": 69},
        {"source": "pdfs", "target": "markdown", "value": 252},
        {"source": "pdfs", "target": "conv_fail", "value": 5},
        {"source": "markdown", "target": "knowledge", "value": 249},
        {"source": "markdown", "target": "ske_fail", "value": 3},
        {"source": "knowledge", "target": "assessed_both", "value": 210},
        {"source": "knowledge", "target": "assessed_llm", "value": 39},
        {"source": "assessed_both", "target": "agree", "value": 99},
        {"source": "assessed_both", "target": "disagree", "value": 111},
    ]

    return {"nodes": nodes, "links": links}


# ---------------------------------------------------------------------------
# Divergences list
# ---------------------------------------------------------------------------

def build_divergences_list(repo_root: Path, divergence_cache: dict) -> list:
    """Build the 111 divergence items with classification."""
    disagree_path = repo_root / "benchmark" / "results" / "disagreements.csv"
    if not disagree_path.exists():
        return []

    divergences = []
    with open(disagree_path, "r", encoding="utf-8-sig", newline="") as f:
        for row in csv.DictReader(f):
            pid = row.get("paper_id", "")
            cls = divergence_cache.get(pid, {})

            # Category comparison
            category_comparison = {}
            for cat in ASSESSMENT_CATEGORIES:
                h = row.get(f"human_{cat}", "").strip()
                a = row.get(f"agent_{cat}", "").strip()
                category_comparison[cat] = {
                    "human": h,
                    "llm": a,
                    "divergent": h != a,
                }

            divergences.append({
                "paper_id": pid,
                "title": row.get("title", ""),
                "author_year": row.get("author_year", ""),
                "human_decision": row.get("human_decision", ""),
                "llm_decision": row.get("agent_decision", ""),
                "disagreement_type": row.get("disagreement_type", ""),
                "severity": int(row.get("severity", 0)) if row.get("severity", "").isdigit() else 0,
                "affected_categories": row.get("affected_categories", ""),
                "n_affected": int(row.get("n_affected_categories", 0)) if row.get("n_affected_categories", "").isdigit() else 0,
                "llm_confidence": float(row.get("agent_confidence", 0) or 0),
                "llm_reasoning": row.get("agent_reasoning", "")[:500],
                "pattern": cls.get("pattern", ""),
                "justification": cls.get("justification", ""),
                "category_comparison": category_comparison,
            })

    return divergences


# ---------------------------------------------------------------------------
# Pipeline stage definitions
# ---------------------------------------------------------------------------

def build_pipeline_stages(repo_root: Path) -> list:
    """Build pipeline stage metadata with prompts."""
    distill_path = repo_root / "pipeline" / "scripts" / "distill_knowledge.py"
    categories_path = repo_root / "benchmark" / "config" / "categories.yaml"

    ske_prompts = extract_prompt_constants(distill_path)
    assessment_prompt = build_assessment_prompt_from_code(categories_path)

    stages = [
        {
            "id": "identification",
            "name": "Identifikation",
            "description": "Deep Research mit 4 Anbietern + Manuelle Ergaenzung",
            "type": "mixed",
            "input": 326,
            "output": 326,
            "prompt": None,
            "limitations": [
                "Keine vollstaendige Reproduzierbarkeit der Deep-Research-Ergebnisse",
                "290/326 Papers ohne verifizierte Source_Tool-Zuordnung",
            ],
        },
        {
            "id": "conversion",
            "name": "Konversion",
            "description": "PDF -> Markdown (Docling, deterministisch)",
            "type": "deterministic",
            "input": 257,
            "output": 252,
            "loss": 5,
            "prompt": None,
            "limitations": [
                "69 Papers ohne PDF (Open-Access-Verfuegbarkeit)",
                "Tabellen und Abbildungen gehen verloren",
                "Layout-komplexe Papers produzieren Artefakte",
            ],
        },
        {
            "id": "ske",
            "name": "Structured Knowledge Extraction",
            "description": "3-Stage LLM-Pipeline (Extract, Format, Verify)",
            "type": "probabilistic",
            "input": 252,
            "output": 249,
            "loss": 3,
            "prompts": {
                "stage1": ske_prompts.get("STAGE1_EXTRACT_CLASSIFY_PROMPT", "")[:2000],
                "stage2_note": "Stufe 2 ist DETERMINISTISCH: Python-Template, kein LLM.",
                "stage3": ske_prompts.get("STAGE3_VERIFY_PROMPT", "")[:2000],
            },
            "limitations": [
                "LLM-Extraktion abhaengig von Markdown-Qualitaet",
                "Kategorie-Extraktion probabilistisch",
                "Verifikation prueft nur gegen Originaltext",
            ],
        },
        {
            "id": "assessment",
            "name": "Duales Assessment",
            "description": "Human (210/326) + LLM (326/326) mit identischem 10K-Schema",
            "type": "probabilistic",
            "input": 249,
            "output": 210,
            "prompt": assessment_prompt[:3000],
            "limitations": [
                "Human Assessment nur 210/326 (64%)",
                "LLM hat keinen Zugriff auf Volltexte",
                "Kappa = 0.035 ist Prevalence-Bias-Artefakt",
            ],
        },
        {
            "id": "synthesis",
            "name": "Synthese",
            "description": "Vault-Generierung (deterministisch + LLM-Konzeptextraktion)",
            "type": "mixed",
            "input": 249,
            "output": 249,
            "prompt": None,
            "limitations": [
                "Konzept-Extraktion probabilistisch",
                "Co-Occurrence dokumentbasiert, nicht satzbasiert",
            ],
        },
    ]
    return stages


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print("Generating promptotyping_v2.json...")
    print(f"  Repo root: {REPO_ROOT}")

    # Load all data sources
    print("  [1/7] Loading Zotero + assessments...")
    zotero_by_key = load_zotero_items(REPO_ROOT)
    llm_assessments, human_assessments = load_assessments(REPO_ROOT)
    print(f"    Zotero: {len(zotero_by_key)}, LLM: {len(llm_assessments)}, Human: {len(human_assessments)}")

    print("  [2/7] Building knowledge-to-Zotero mapping...")
    kd_to_zotero = build_knowledge_to_zotero_mapping(REPO_ROOT)
    print(f"    Matched: {len(kd_to_zotero)}/249")

    print("  [3/7] Loading concept + divergence caches...")
    concept_cache = load_concept_cache(REPO_ROOT / ".vault_cache")
    divergence_cache = load_divergence_cache(REPO_ROOT / ".vault_cache")
    print(f"    Concepts: {len(concept_cache)} papers, Divergences: {len(divergence_cache)} cases")

    print("  [4/7] Loading verification scores...")
    verif_dir = REPO_ROOT / "pipeline" / "knowledge" / "distilled" / "_verification"
    verif_scores = load_verification_scores(verif_dir)
    print(f"    Verification: {len(verif_scores)} files")

    print("  [5/7] Building paper journeys...")
    disagree_path = REPO_ROOT / "benchmark" / "results" / "disagreements.csv"
    disagreements = []
    if disagree_path.exists():
        with open(disagree_path, "r", encoding="utf-8-sig", newline="") as f:
            disagreements = list(csv.DictReader(f))

    papers = build_paper_journeys(
        REPO_ROOT, kd_to_zotero, llm_assessments, human_assessments,
        zotero_by_key, verif_scores, concept_cache, divergence_cache, disagreements
    )
    print(f"    Papers: {len(papers)}")

    print("  [6/7] Building concept graph + divergences + pipeline...")
    concept_graph = build_concept_graph(concept_cache)
    assign_concept_clusters(concept_graph, papers)
    divergences_list = build_divergences_list(REPO_ROOT, divergence_cache)
    pipeline_stages = build_pipeline_stages(REPO_ROOT)
    pipeline_flow = build_pipeline_flow()
    categories = load_categories(REPO_ROOT / "benchmark" / "config" / "categories.yaml")

    # Cluster distribution
    cluster_counts = defaultdict(int)
    for n in concept_graph["nodes"]:
        cluster_counts[n.get("cluster", "bridge")] += 1
    print(f"    Concepts: {len(concept_graph['nodes'])} nodes, {len(concept_graph['edges'])} edges")
    print(f"      Clusters: technik={cluster_counts['technik']}, sozial={cluster_counts['sozial']}, bridge={cluster_counts['bridge']}")
    print(f"    Divergences: {len(divergences_list)}")

    # Pattern distribution
    pattern_counts = defaultdict(int)
    for d in divergences_list:
        pat = d.get("pattern", "")
        if pat:
            pattern_counts[pat] += 1
    print(f"    Patterns: {dict(pattern_counts)}")

    # Featured papers check
    featured_count = sum(1 for p in papers if p.get("featured"))
    print(f"    Featured: {featured_count}/3")

    print("  [7/7] Loading agreement metrics...")
    agreement_path = REPO_ROOT / "benchmark" / "results" / "agreement_metrics.json"
    agreement_metrics = {}
    if agreement_path.exists():
        agreement_metrics = json.loads(agreement_path.read_text(encoding="utf-8"))

    # Assemble final JSON
    data = {
        "papers": papers,
        "concepts": concept_graph,
        "divergences": divergences_list,
        "pipeline": {
            "stages": pipeline_stages,
            "flow": pipeline_flow,
        },
        "categories": categories,
        "meta": {
            "total_papers": 326,
            "knowledge_docs": len(papers),
            "human_assessed": len(human_assessments),
            "llm_assessed": len(llm_assessments),
            "disagreements": len(divergences_list),
            "concepts_count": len(concept_graph["nodes"]),
            "confusion_matrix": agreement_metrics.get("decision", {}).get("confusion_matrix", {}),
            "kappa": agreement_metrics.get("decision", {}).get("cohens_kappa", 0),
            "overall_agreement": agreement_metrics.get("decision", {}).get("overall_agreement", 0),
            "llm_include_rate": 0.68,
            "human_include_rate": 0.42,
            "pattern_distribution": dict(pattern_counts),
            "asymmetry": {
                "llm_overincludes": agreement_metrics.get("decision", {}).get("confusion_matrix", {}).get("Exclude_Include", 78),
                "human_overincludes": agreement_metrics.get("decision", {}).get("confusion_matrix", {}).get("Include_Exclude", 23),
            },
        },
    }

    # Write output
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )

    size_mb = OUTPUT_PATH.stat().st_size / (1024 * 1024)
    print(f"\n  Output: {OUTPUT_PATH} ({size_mb:.1f} MB)")
    print(f"  Papers: {len(papers)}, Concepts: {len(concept_graph['nodes'])}, Divergences: {len(divergences_list)}")
    print("  Done.")


if __name__ == "__main__":
    main()
