#!/usr/bin/env python3
"""
Generate promptotyping_v2.json for the Promptotyping Web Interface v2/v3.

Reads committed corpus, concept graph and source data. No LLM calls or local cache inputs.

Output structure:
  - papers: canonical corpus records with optional journey enrichments
  - concepts: graph data (nodes + edges)
  - divergences: recorded disagreement cases with optional classifications
  - pipeline: stage definitions + Sankey flow data
  - categories: 10 category definitions
  - meta: confusion matrix, kappa, rates, totals, category_rates, category_definitions

Outputs: docs/data/promptotyping_v2.json
"""

import argparse
import json
import csv
import re
import yaml
from pathlib import Path
from collections import Counter, defaultdict
from copy import deepcopy

REPO_ROOT = Path(__file__).resolve().parents[2]
OUTPUT_PATH = REPO_ROOT / "docs" / "data" / "promptotyping_v2.json"
DECISIONS = ("Include", "Exclude", "Unclear")


def _rate(numerator: int, denominator: int):
    return numerator / denominator if denominator else None


def _decision(paper: dict, actor: str):
    value = (paper.get(actor) or {}).get("decision")
    return value if value in DECISIONS else None


def build_summary(corpus: dict, agreement_metrics: dict) -> dict:
    """Derive record-level metrics from one corpus; disclose every denominator."""
    papers = corpus["papers"]
    if len({paper.get("id") for paper in papers}) != len(papers) or any(not paper.get("id") for paper in papers):
        raise ValueError("Canonical corpus must contain unique, nonempty record IDs")
    actor_counts = {
        actor: Counter(_decision(paper, actor) for paper in papers if _decision(paper, actor))
        for actor in ("human", "llm")
    }
    pairs = [paper for paper in papers if _decision(paper, "human") and _decision(paper, "llm")]
    matrix = {f"{human}_{llm}": 0 for human in DECISIONS for llm in DECISIONS}
    for paper in pairs:
        matrix[f"{_decision(paper, 'human')}_{_decision(paper, 'llm')}"] += 1
    benchmark = agreement_metrics.get("decision", {})
    supplied_matrix = benchmark.get("confusion_matrix")
    if supplied_matrix is not None and any(supplied_matrix.get(key, 0) != value for key, value in matrix.items()):
        raise ValueError("Benchmark confusion matrix differs from canonical corpus; rebuild benchmark inputs")
    if benchmark.get("n") is not None and benchmark["n"] != len(pairs):
        raise ValueError("Benchmark decision denominator differs from canonical corpus")
    agreed = sum(matrix[f"{decision}_{decision}"] for decision in DECISIONS)
    observed = _rate(agreed, len(pairs))
    expected = sum(
        sum(matrix[f"{decision}_{other}"] for other in DECISIONS)
        * sum(matrix[f"{other}_{decision}"] for other in DECISIONS)
        for decision in DECISIONS
    ) / len(pairs) ** 2 if pairs else None
    kappa = (observed - expected) / (1 - expected) if expected is not None and expected < 1 else None
    coverage = Counter(paper.get("knowledge_coverage", "source_missing") for paper in papers)
    human_n = sum(actor_counts["human"].values())
    llm_n = sum(actor_counts["llm"].values())
    return {
        "source_fingerprint": corpus.get("meta", {}).get("source_fingerprint"),
        "total_papers": len(papers),
        "corpus_record_total": len(papers),
        "corpus_work_total": len({paper.get("work_id") or f"record:{paper['id']}" for paper in papers}),
        "aggregation_unit": "record",
        "knowledge_docs": len({paper["knowledge_doc"] for paper in papers if paper.get("knowledge_doc")}),
        "knowledge_linked_records": coverage["linked"],
        "knowledge_coverage": dict(sorted(coverage.items())),
        "human_assessed": human_n,
        "llm_assessed": llm_n,
        "paired_assessed": len(pairs),
        "disagreements": len(pairs) - agreed,
        "confusion_matrix": matrix,
        "kappa": kappa,
        "overall_agreement": observed,
        "llm_include_rate": _rate(actor_counts["llm"]["Include"], llm_n),
        "human_include_rate": _rate(actor_counts["human"]["Include"], human_n),
        "llm_include_count": actor_counts["llm"]["Include"],
        "human_include_count": actor_counts["human"]["Include"],
        "include_rates": {
            actor: {"numerator": actor_counts[actor]["Include"], "denominator": sum(actor_counts[actor].values()),
                    "denominator_name": f"{actor}_assessed_corpus_records", "unit": "proportion"}
            for actor in ("human", "llm")
        },
        "asymmetry": {"llm_overincludes": matrix["Exclude_Include"], "human_overincludes": matrix["Include_Exclude"]},
        "denominators": {
            "llm_include_rate": "llm_assessed", "human_include_rate": "human_assessed",
            "overall_agreement": "paired_assessed", "kappa": "paired_assessed",
            "confusion_matrix": "paired_assessed", "asymmetry": "paired_assessed",
            "knowledge_linked_records": "corpus_record_total", "knowledge_docs": "distinct_knowledge_doc_paths",
        },
    }


def project_canonical_journeys(corpus: dict, journeys: list) -> list:
    """Retain every canonical alias and replace duplicate legacy bibliographic data."""
    by_id = {journey["id"]: journey for journey in journeys}
    by_doc = {
        paper["knowledge_doc"]: by_id[paper["id"]]
        for paper in corpus["papers"] if paper.get("knowledge_doc") and paper["id"] in by_id
        and by_id[paper["id"]].get("knowledge_sections")
    }
    output = []
    for paper in corpus["papers"]:
        journey = deepcopy(by_id.get(paper["id"], by_doc.get(paper.get("knowledge_doc"), {})))
        # Keep this enrichment projection compact: assessments occur once under
        # stages, and complete abstracts/version registries stay in the corpus.
        metadata = (
            "id", "title", "authors", "author_year", "year", "doi", "url", "item_type", "journal",
            "work_id", "version_id", "version_type", "version_date", "peer_review_status", "peer_review_basis",
            "preferred_version_id", "latest_version_id", "is_preferred_version", "knowledge_doc", "knowledge_coverage",
        )
        journey.update({key: deepcopy(paper[key]) for key in metadata if key in paper})
        journey["abstract"] = str(paper.get("abstract") or "")[:500]
        journey.setdefault("stem", f"_thin_{paper['id']}")
        journey.setdefault("concepts", [])
        journey.setdefault("knowledge_summary", None)
        journey.setdefault("knowledge_sections", None)
        stages = journey.setdefault("stages", {})
        stages["identification"] = {"in_zotero": True}
        stages["conversion"] = {
            "pdf_acquired": None,
            "markdown_converted": True if paper.get("knowledge_coverage") in ("linked", "fulltext_ready") else None,
            "knowledge_coverage": paper.get("knowledge_coverage", "source_missing"),
        }
        if not paper.get("knowledge_doc"):
            journey.update({"knowledge_summary": None, "knowledge_sections": None, "concepts": []})
            stages["ske"] = None
        assessment = {actor: deepcopy(paper[actor]) for actor in ("human", "llm") if paper.get(actor)}
        if _decision(paper, "human") and _decision(paper, "llm"):
            assessment["agreement"] = "agree" if _decision(paper, "human") == _decision(paper, "llm") else "disagree"
        elif _decision(paper, "llm"):
            assessment["agreement"] = "llm_only"
        elif _decision(paper, "human"):
            assessment["agreement"] = "human_only"
        stages["assessment"] = assessment
        output.append(journey)
    return output

ASSESSMENT_CATEGORIES = [
    "AI_Literacies", "Generative_KI", "Prompting", "KI_Sonstige",
    "Soziale_Arbeit", "Bias_Ungleichheit", "Gender",
    "Diversitaet", "Feministisch", "Fairness"
]

TECHNIK_CATEGORIES = {"AI_Literacies", "Generative_KI", "Prompting", "KI_Sonstige"}
SOZIAL_CATEGORIES = {"Soziale_Arbeit", "Bias_Ungleichheit", "Gender", "Diversitaet", "Feministisch", "Fairness"}

# Deterministic journey picks (3 featured + 2 agree papers, hand-picked)
JOURNEY_PICKS = [
    "Ahmed_2024_Feminist_perspectives_on_AI_Ethical",
    "Shafie_2025_More_or_less_wrong_A_benchmark_for_directional",
    "Kaneko_2024_Debiasing_prompts_for_gender_bias_in_large",
    "Ahn_2025_Artificial_Intelligence_(AI)_literacy_for_social",
    "Alam_2025_Social_work_in_the_age_of_artificial_intelligence",
]

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
# Reusable loaders
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

    llm_path = repo_root / "assessment" / "llm_assessment_10k.csv"
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

    human_path = repo_root / "assessment" / "human_assessment.csv"
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


def build_knowledge_to_zotero_mapping(repo_root: Path) -> dict:
    """Use the vault generator's matching logic to build stem -> zotero_key mapping."""
    # Import and use the matching from generate_vault_v2
    import sys
    sys.path.insert(0, str(repo_root / "src" / "publish"))
    from generate_vault_v2 import build_knowledge_doc_to_zotero_index

    knowledge_dir = repo_root / "generated" / "distilled"
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
        elif technik_score / total > 0.55:
            node["cluster"] = "technik"
        elif sozial_score / total > 0.55:
            node["cluster"] = "sozial"
        else:
            node["cluster"] = "bridge"


# ---------------------------------------------------------------------------
# Knowledge doc section parser
# ---------------------------------------------------------------------------

def parse_knowledge_sections(md_content: str) -> dict:
    """Extract key sections from a knowledge document markdown file."""
    sections = {}
    section_patterns = {
        "kernbefund": r'## Kernbefund\s*\n\n(.*?)(?=\n\n##|\Z)',
        "forschungsfrage": r'## Forschungsfrage\s*\n\n(.*?)(?=\n\n##|\Z)',
        "methodik": r'## Methodik\s*\n\n(.*?)(?=\n\n##|\Z)',
        "hauptargumente": r'## Hauptargumente\s*\n\n(.*?)(?=\n\n##|\Z)',
    }
    for key, pattern in section_patterns.items():
        match = re.search(pattern, md_content, re.DOTALL)
        if match:
            text = match.group(1).strip()
            # Truncate to reasonable length
            if key == "hauptargumente":
                sections[key] = text[:1500]  # arguments can be longer
            else:
                sections[key] = text[:500]
    return sections


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
    knowledge_dir = repo_root / "generated" / "distilled"
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
        if stem not in kd_to_zotero:
            continue  # excluded distillate (duplicate, wrong-content, mis-bind, or unmatched)

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

        # Knowledge doc sections
        kd_content = stem_path.read_text(encoding="utf-8")
        kd_sections = parse_knowledge_sections(kd_content)
        kernbefund = kd_sections.get("kernbefund", "")[:400]

        # DOI, URL, Abstract from Zotero
        doi = (zotero_item.get("DOI", "") or "").strip()
        url = (zotero_item.get("url", "") or "").strip()
        abstract = (zotero_item.get("abstractNote", "") or "").strip()[:500]

        paper = {
            "id": zotero_key or stem,
            "stem": stem,
            "title": title,
            "author_year": author_year,
            "year": int(year) if year.isdigit() else None,
            "doi": doi,
            "url": url,
            "abstract": abstract,
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
            "concepts": sorted(set(concept_names)),
            "knowledge_summary": kernbefund,
            "knowledge_sections": kd_sections if kd_sections else None,
        }

        # Featured paper annotation
        if stem in FEATURED_PAPERS:
            paper["featured"] = FEATURED_PAPERS[stem]

        papers.append(paper)

    # -----------------------------------------------------------------------
    # Add "thin" papers (no knowledge doc, but in Zotero + may have assessment)
    # -----------------------------------------------------------------------
    kd_zotero_keys = {p["id"] for p in papers if p["id"]}
    # Also exclude by title (for 12 unmatched KDs that have id==stem, not zotero key)
    kd_titles = {p["title"].lower().strip() for p in papers if p.get("title")}
    thin_count = 0
    for zkey, zitem in sorted(zotero_by_key.items()):
        if zkey in kd_zotero_keys:
            continue  # already have a full paper entry (matched by key)
        ztitle = (zitem.get("title", "") or "").lower().strip()
        if ztitle and ztitle in kd_titles:
            continue  # already have a full paper entry (matched by title)

        creators = zitem.get("creators", [])
        first_author = creators[0].get("lastName", "") if creators else ""
        year_str = (zitem.get("date", "") or "").split("-")[0] or ""
        author_year_thin = f"{first_author} ({year_str})" if first_author and year_str else zkey
        title_thin = zitem.get("title", zkey) or zkey

        llm_data = llm_assessments.get(zkey, {})
        human_data = human_assessments.get(zkey, {})

        # Build assessment (same logic as full papers)
        assessment = {}
        if llm_data:
            assessment["llm"] = {
                "decision": llm_data["decision"],
                "categories": [c for c, v in llm_data["categories"].items() if v],
                "reasoning": llm_data.get("reasoning", "")[:300],
            }
        if human_data:
            assessment["human"] = {
                "decision": human_data["decision"],
                "categories": [c for c, v in human_data["categories"].items() if v],
            }
        if llm_data and human_data:
            assessment["agreement"] = "agree" if llm_data["decision"] == human_data["decision"] else "disagree"
        elif llm_data:
            assessment["agreement"] = "llm_only"

        # Check if this paper has a divergence
        if assessment.get("agreement") == "disagree":
            title_lower = title_thin.lower().strip()
            disagree_row = disagree_by_title.get(title_lower, {})
            if disagree_row:
                pid = disagree_row.get("paper_id", "")
                div_cls = divergence_cache.get(pid, {})
                assessment["divergence_pattern"] = div_cls.get("pattern", "")
                assessment["divergence_justification"] = div_cls.get("justification", "")
                assessment["disagreement_type"] = disagree_row.get("disagreement_type", "")
                assessment["severity"] = int(disagree_row.get("severity", 0)) if disagree_row.get("severity", "").isdigit() else 0

        # DOI, URL, Abstract
        doi = (zitem.get("DOI", "") or "").strip()
        url = (zitem.get("url", "") or "").strip()
        abstract = (zitem.get("abstractNote", "") or "").strip()[:500]

        # Determine conversion status -- we know these papers have no knowledge doc
        # Some may have had PDFs but failed conversion, others had no PDF at all
        # We cannot determine this precisely, so mark as not having knowledge doc
        has_pdf = False  # conservative: if they had a KD, they'd be in the main loop

        thin_paper = {
            "id": zkey,
            "stem": f"_thin_{zkey}",
            "title": title_thin,
            "author_year": author_year_thin,
            "year": int(year_str) if year_str.isdigit() else None,
            "doi": doi,
            "url": url,
            "abstract": abstract,
            "stages": {
                "identification": {"in_zotero": True},
                "conversion": {
                    "pdf_acquired": has_pdf,
                    "markdown_converted": False,
                },
                "ske": None,  # No knowledge extraction possible
                "assessment": assessment if assessment else {},
            },
            "concepts": [],
            "knowledge_summary": None,
            "knowledge_sections": None,
        }

        papers.append(thin_paper)
        thin_count += 1

    print(f"    Thin papers (no KD): {thin_count}")
    return papers


# ---------------------------------------------------------------------------
# Pipeline flow (Sankey data)
# ---------------------------------------------------------------------------

def build_pipeline_flow(corpus: dict) -> dict:
    """A conserved record flow through actual assessment coverage and decisions.

    Source conversion counts are reported separately because an assessment is
    possible without a converted full text; they are not a serial funnel.
    """
    groups = Counter()
    outcomes = Counter()
    for paper in corpus["papers"]:
        human, llm = _decision(paper, "human"), _decision(paper, "llm")
        group = "assessed_both" if human and llm else "assessed_human" if human else "assessed_llm" if llm else "unassessed"
        groups[group] += 1
        if human and llm:
            outcomes["agree" if human == llm else "disagree"] += 1
    nodes = [{"id": "zotero", "label": f"Korpus-Einträge ({len(corpus['papers'])})", "value": len(corpus["papers"]), "stage": 0}]
    labels = {"assessed_both": "Dual bewertet", "assessed_human": "Nur Human", "assessed_llm": "Nur LLM", "unassessed": "Ohne Bewertung"}
    links = []
    for key, label in labels.items():
        nodes.append({"id": key, "label": f"{label} ({groups[key]})", "value": groups[key], "stage": 1})
        links.append({"source": "zotero", "target": key, "value": groups[key]})
    for key, label in (("agree", "Übereinstimmung"), ("disagree", "Abweichung")):
        nodes.append({"id": key, "label": f"{label} ({outcomes[key]})", "value": outcomes[key], "stage": 2})
        links.append({"source": "assessed_both", "target": key, "value": outcomes[key]})
    return {"unit": "corpus_record", "nodes": nodes, "links": links}


# ---------------------------------------------------------------------------
# Divergences list
# ---------------------------------------------------------------------------

def build_divergences_list(repo_root: Path, divergence_cache: dict) -> list:
    """Build the 111 divergence items with classification."""
    disagree_path = repo_root / "generated" / "benchmark-results" / "disagreements.csv"
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
                h = h if h in ("Ja", "Nein") else None
                a = a if a in ("Ja", "Nein") else None
                category_comparison[cat] = {
                    "human": h,
                    "llm": a,
                    "divergent": h is not None and a is not None and h != a,
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
                "llm_reasoning": row.get("agent_reasoning", "")[:500],
                "pattern": cls.get("pattern", ""),
                "justification": cls.get("justification", ""),
                "category_comparison": category_comparison,
            })

    return divergences


# ---------------------------------------------------------------------------
# Pipeline stage definitions
# ---------------------------------------------------------------------------

def build_pipeline_stages(repo_root: Path, summary: dict) -> list:
    """Use current coverage, avoiding historical PDF counts and invented losses."""
    ske_prompts = extract_prompt_constants(repo_root / "src" / "distill" / "distill_knowledge.py")
    assessment_prompt = build_assessment_prompt_from_code(repo_root / "assessment" / "categories.yaml")
    total = summary["corpus_record_total"]
    linked = summary["knowledge_linked_records"]
    ready = linked + summary["knowledge_coverage"].get("fulltext_ready", 0)
    return [
        {"id": "identification", "name": "Identifikation", "description": "Kanonischer Korpus mit Werk- und Versionszuordnung",
         "type": "mixed", "input": total, "output": total, "unit": "corpus_record", "prompt": None,
         "limitations": ["Historische Rechercheläufe sind nicht vollständig reproduzierbar."]},
        {"id": "conversion", "name": "Textverfügbarkeit", "description": "Einträge mit verknüpftem Wissensdokument oder bereitstehendem Volltext",
         "type": "deterministic", "input": total, "output": ready, "unit": "corpus_record", "prompt": None,
         "limitations": ["Fehlende Zuordnung ist kein Nachweis eines Konversionsfehlers.", "Tabellen und Abbildungen können bei Textkonversion verloren gehen."]},
        {"id": "ske", "name": "Structured Knowledge Extraction", "description": "Kanonisch verknüpfte Wissensdokumente",
         "type": "probabilistic", "input": ready, "output": linked, "unit": "corpus_record",
         "distinct_documents": summary["knowledge_docs"],
         "prompts": {"stage1": ske_prompts.get("STAGE1_EXTRACT_CLASSIFY_PROMPT", "")[:2000],
                     "stage2_note": "Stufe 2 ist deterministisch: Python-Template.",
                     "stage3": ske_prompts.get("STAGE3_VERIFY_PROMPT", "")[:2000]},
         "limitations": ["Mehrere bibliografische Einträge können dasselbe Wissensdokument verwenden.", "Extraktion und Verifikation ersetzen keine fachliche Prüfung."]},
        {"id": "assessment", "name": "Duales Assessment",
         "description": f"Human ({summary['human_assessed']}/{total}) und LLM ({summary['llm_assessed']}/{total})",
         "type": "probabilistic", "input": total, "output": summary["paired_assessed"], "unit": "corpus_record",
         "prompt": assessment_prompt[:3000],
         "limitations": ["Bewertungen können auf Abstracts beruhen.", "Übereinstimmung misst keine inhaltliche Richtigkeit."]},
        {"id": "synthesis", "name": "Wissenssammlung", "description": "Verknüpfte Wissensdokumente; kein Maß für den Abschluss der Synthese",
         "type": "mixed", "input": linked, "output": linked, "unit": "corpus_record", "prompt": None,
         "limitations": ["Konzept-Co-Occurrence ist dokumentbasiert.", "Der Abschluss der fachlichen Synthese wird separat geprüft."]},
    ]


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def build(repo_root: Path = REPO_ROOT) -> dict:
    print("Generating promptotyping_v2.json...")
    print(f"  Repo root: {repo_root}")
    corpus = json.loads((repo_root / "docs" / "data" / "research_vault_v2.json").read_text(encoding="utf-8"))
    agreement_metrics = json.loads((repo_root / "generated" / "benchmark-results" / "agreement_metrics.json").read_text(encoding="utf-8"))
    summary = build_summary(corpus, agreement_metrics)

    # Load all data sources
    print("  [1/7] Loading Zotero + assessments...")
    zotero_by_key = load_zotero_items(repo_root)
    llm_assessments, human_assessments = load_assessments(repo_root)
    print(f"    Zotero: {len(zotero_by_key)}, LLM: {len(llm_assessments)}, Human: {len(human_assessments)}")

    print("  [2/7] Building knowledge-to-Zotero mapping...")
    kd_to_zotero = build_knowledge_to_zotero_mapping(repo_root)
    print(f"    Matched knowledge documents: {len(kd_to_zotero)}")

    print("  [3/7] Loading committed concept graph...")
    concept_cache = {}
    divergence_cache = {}

    # Local caches are intentionally ignored: developer machines and clean
    # checkouts must use the same versioned evidence projection. Per-paper
    # concepts are keyed by Zotero record, so remap them onto matched stems.
    persisted_graph = None
    if not concept_cache:
        cg_path = repo_root / "docs" / "data" / "concept_graph.json"
        if cg_path.exists():
            persisted_graph = json.loads(cg_path.read_text(encoding="utf-8"))
            pc_by_key = persisted_graph.get("paper_concepts", {})
            for stem, m in kd_to_zotero.items():
                names = pc_by_key.get(m.get("zotero_key", ""), [])
                if names:
                    concept_cache[stem] = [{"concept": n} for n in names]
            print(f"    Loaded concept_graph.json ({len(pc_by_key)} paper maps)")
    print(f"    Concepts: {len(concept_cache)} papers, Divergences: {len(divergence_cache)} cases")

    print("  [4/7] Loading verification scores...")
    verif_dir = repo_root / "generated" / "distilled" / "_verification"
    verif_scores = load_verification_scores(verif_dir)
    print(f"    Verification: {len(verif_scores)} files")

    print("  [5/7] Building paper journeys...")
    disagree_path = repo_root / "generated" / "benchmark-results" / "disagreements.csv"
    disagreements = []
    if disagree_path.exists():
        with open(disagree_path, "r", encoding="utf-8-sig", newline="") as f:
            disagreements = list(csv.DictReader(f))

    papers = build_paper_journeys(
        repo_root, kd_to_zotero, llm_assessments, human_assessments,
        zotero_by_key, verif_scores, concept_cache, divergence_cache, disagreements
    )
    papers = project_canonical_journeys(corpus, papers)
    print(f"    Papers: {len(papers)}")

    print("  [6/7] Building concept graph + divergences + pipeline...")
    if persisted_graph:
        concept_graph = {"nodes": persisted_graph["nodes"], "edges": persisted_graph["edges"]}
    else:
        concept_graph = build_concept_graph(concept_cache)
    assign_concept_clusters(concept_graph, papers)
    divergences_list = build_divergences_list(repo_root, divergence_cache)
    pipeline_stages = build_pipeline_stages(repo_root, summary)
    pipeline_flow = build_pipeline_flow(corpus)
    categories = load_categories(repo_root / "assessment" / "categories.yaml")

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

    print("  [7/7] Building current metrics...")

    # Count full vs thin papers
    full_papers = [p for p in papers if p.get("knowledge_sections") is not None]
    thin_papers = [p for p in papers if p.get("knowledge_sections") is None]
    print(f"    Total papers: {len(papers)} (full: {len(full_papers)}, thin: {len(thin_papers)})")

    # Build category rates from agreement metrics
    category_rates = {}
    for cat_name, cat_data in agreement_metrics.get("categories", {}).items():
        category_rates[cat_name] = {
            "human_yes_rate": round(cat_data["human_yes_rate"] * 100, 1) if cat_data.get("human_yes_rate") is not None else None,
            "agent_yes_rate": round(cat_data["agent_yes_rate"] * 100, 1) if cat_data.get("agent_yes_rate") is not None else None,
            "kappa": round(cat_data["kappa"], 3) if cat_data.get("kappa") is not None else None,
            "n": cat_data.get("n"),
            "denominator_name": "benchmark_category_paired_records",
            "rate_unit": "percent",
        }

    # Build category definitions for frontend
    category_definitions = {}
    for cat in categories:
        category_definitions[cat["name"]] = {
            "definition": cat["definition"],
            "group": cat["group"],
            "examples_positive": cat.get("examples_positive", []),
            "examples_negative": cat.get("examples_negative", []),
        }

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
            **summary,
            "exported_journeys": len(papers),
            "enriched_journeys": len(full_papers),
            "divergence_items": len(divergences_list),
            "concepts_count": len(concept_graph["nodes"]),
            "pattern_distribution": dict(pattern_counts),
            "category_rates": category_rates,
            "category_definitions": category_definitions,
            "journey_picks": JOURNEY_PICKS,
        },
    }

    return data


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo-root", type=Path, default=REPO_ROOT)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--check", action="store_true", help="Fail if the existing output is stale; do not write")
    args = parser.parse_args(argv)
    repo_root = args.repo_root.resolve()
    output_path = args.output or repo_root / "docs" / "data" / "promptotyping_v2.json"
    data = build(repo_root)
    serialized = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    if args.check:
        if not output_path.exists() or output_path.read_text(encoding="utf-8") != serialized:
            print(f"STALE: {output_path}")
            return 1
        print(f"OK: {output_path} is current")
        return 0
    output_path.parent.mkdir(parents=True, exist_ok=True)
    temporary = output_path.with_suffix(output_path.suffix + ".tmp")
    temporary.write_text(serialized, encoding="utf-8")
    temporary.replace(output_path)
    print(f"OK: {output_path}; {len(data['papers'])} canonical records")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
