#!/usr/bin/env python3
"""
Vault v2 Generator -- Epistemisches Wissensnetz fuer Promptotyping.

Generates a fully-connected Obsidian vault with 4 document types:
  - Paper Notes (249): Transformation trails, concepts, assessment data
  - Concept Notes (~80-120): LLM-extracted, with definitions and co-occurrence
  - Pipeline Notes (5): Prompts, configs, stats, limitations
  - Divergence Notes (111): Classified disagreement cases

Usage:
    python scripts/generate_vault_v2.py              # Full run (needs API key)
    python scripts/generate_vault_v2.py --skip-llm   # Use cached LLM results
    python scripts/generate_vault_v2.py --clean       # Delete vault first
"""

import os
import sys
import json
import csv
import re
import time
import argparse
import shutil
import zipfile
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional, Any
from datetime import datetime
from collections import defaultdict, Counter
from difflib import SequenceMatcher

# Fix encoding for Windows console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')


# ---------------------------------------------------------------------------
# Step 1.0: Multi-strategy title matching
# ---------------------------------------------------------------------------

def normalize_for_matching(text: str) -> str:
    """Normalize a string for fuzzy matching: lowercase, strip punctuation, collapse whitespace."""
    text = text.lower()
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def extract_author_year_from_stem(stem: str) -> Tuple[Optional[str], Optional[str]]:
    """Extract (first_author_surname, year) from a knowledge-doc filename stem.
    Pattern: AuthorSurname_YYYY_Title_words...
    """
    parts = stem.split('_')
    if len(parts) < 2:
        return None, None
    author = parts[0].lower()
    year = parts[1] if re.match(r'^\d{4}$', parts[1]) else None
    return author, year


def extract_author_year_from_zotero(item: dict) -> Tuple[Optional[str], Optional[str]]:
    """Extract (first_author_surname, year) from a Zotero item."""
    creators = item.get('creators', [])
    author = None
    if creators:
        author = creators[0].get('lastName', '').lower()
    date = item.get('date', '') or ''
    year = date.split('-')[0] if date else None
    if year and not re.match(r'^\d{4}$', year):
        year = None
    return author, year


def _read_kd_yaml_title(knowledge_dir: Path, stem: str) -> str:
    """Read the title from a knowledge doc's YAML frontmatter."""
    path = knowledge_dir / f'{stem}.md'
    if not path.exists():
        return ''
    content = path.read_text(encoding='utf-8')
    if content.startswith('---'):
        end = content.find('---', 3)
        if end != -1:
            try:
                import yaml
                fm = yaml.safe_load(content[3:end])
                return fm.get('title', '') or ''
            except Exception:
                pass
    return ''


def build_knowledge_doc_to_zotero_index(
    knowledge_dir: Path, zotero_items: list, stage1_dir: Path
) -> Dict[str, dict]:
    """Multi-strategy matching: knowledge-doc stem -> {zotero_item, zotero_key}.

    Strategies (in priority order):
    1. Stage1 JSON metadata.title -> exact normalized Zotero title
    2. KD YAML frontmatter title -> exact/fuzzy normalized Zotero title
    3. Filename stem -> normalized Zotero title (prefix match)
    4. (author, year) from filename -> (author, year) from Zotero (with flexible author matching)
    5. SequenceMatcher fuzzy on stem (threshold 0.50)
    """
    # Build Zotero lookup structures
    zotero_by_norm_title: Dict[str, dict] = {}
    zotero_by_author_year: Dict[Tuple[str, str], list] = defaultdict(list)

    for item in zotero_items:
        title = item.get('title', '')
        key = item.get('key', '')
        if title:
            norm = normalize_for_matching(title)
            zotero_by_norm_title[norm] = {'item': item, 'key': key}
        author, year = extract_author_year_from_zotero(item)
        if author and year:
            zotero_by_author_year[(author, year)].append({'item': item, 'key': key})

    # All knowledge doc stems
    knowledge_stems = [p.stem for p in sorted(knowledge_dir.glob('*.md'))]

    result: Dict[str, dict] = {}
    unmatched = []

    for stem in knowledge_stems:
        matched = None

        # Strategy 1: Stage1 JSON metadata.title -> Zotero title (exact normalized)
        stage1_path = stage1_dir / f"{stem}.json"
        if stage1_path.exists():
            try:
                stage1 = json.loads(stage1_path.read_text(encoding='utf-8'))
                s1_title = stage1.get('metadata', {}).get('title', '')
                if s1_title and s1_title != 'nicht angegeben':
                    norm_s1 = normalize_for_matching(s1_title)
                    if norm_s1 in zotero_by_norm_title:
                        matched = zotero_by_norm_title[norm_s1]
            except (json.JSONDecodeError, KeyError):
                pass

        # Strategy 2: KD YAML frontmatter title -> Zotero title
        if not matched:
            kd_title = _read_kd_yaml_title(knowledge_dir, stem)
            if kd_title:
                kd_norm = normalize_for_matching(kd_title)
                # Exact match
                if kd_norm in zotero_by_norm_title:
                    matched = zotero_by_norm_title[kd_norm]
                else:
                    # Fuzzy match with high threshold
                    best_ratio = 0
                    best_entry = None
                    for norm_title, entry in zotero_by_norm_title.items():
                        ratio = SequenceMatcher(None, kd_norm, norm_title).ratio()
                        if ratio > best_ratio:
                            best_ratio = ratio
                            best_entry = entry
                    if best_ratio >= 0.65 and best_entry:
                        matched = best_entry

        # Strategy 3: Filename stem title portion -> Zotero title (prefix/contains)
        if not matched:
            parts = stem.split('_')
            if len(parts) > 2:
                title_portion = normalize_for_matching(' '.join(parts[2:]))
                if len(title_portion) >= 15:
                    for norm_title, entry in zotero_by_norm_title.items():
                        if title_portion[:40] in norm_title or norm_title[:40] in title_portion:
                            matched = entry
                            break

        # Strategy 4: (author, year) match with flexible author handling
        if not matched:
            f_author, f_year = extract_author_year_from_stem(stem)
            if f_author and f_year:
                # Direct match
                candidates = zotero_by_author_year.get((f_author, f_year), [])

                # Flexible: strip special chars, try prefix match
                if not candidates:
                    f_author_clean = re.sub(r'[^a-z]', '', f_author)
                    for (za, zy), entries in zotero_by_author_year.items():
                        za_clean = re.sub(r'[^a-z]', '', za)
                        if zy == f_year and (
                            f_author_clean.startswith(za_clean[:3]) or
                            za_clean.startswith(f_author_clean[:3]) or
                            f_author_clean == za_clean
                        ):
                            candidates.extend(entries)

                if len(candidates) == 1:
                    matched = candidates[0]
                elif len(candidates) > 1:
                    stem_norm = normalize_for_matching(stem)
                    best_ratio = 0
                    best_candidate = None
                    for c in candidates:
                        c_title = normalize_for_matching(c['item'].get('title', ''))
                        ratio = SequenceMatcher(None, stem_norm, c_title).ratio()
                        if ratio > best_ratio:
                            best_ratio = ratio
                            best_candidate = c
                    if best_ratio >= 0.3 and best_candidate:
                        matched = best_candidate

        # Strategy 5: Full fuzzy match against all Zotero titles (lower threshold)
        if not matched:
            stem_norm = normalize_for_matching(stem)
            best_ratio = 0
            best_candidate = None
            for norm_title, entry in zotero_by_norm_title.items():
                ratio = SequenceMatcher(None, stem_norm, norm_title).ratio()
                if ratio > best_ratio:
                    best_ratio = ratio
                    best_candidate = entry
            if best_ratio >= 0.50 and best_candidate:
                matched = best_candidate

        if matched:
            result[stem] = {
                'zotero_item': matched['item'] if 'item' in matched else matched.get('zotero_item'),
                'zotero_key': matched['key'] if 'key' in matched else matched.get('zotero_key', ''),
            }
        else:
            unmatched.append(stem)

    return result, unmatched


# ---------------------------------------------------------------------------
# Step 1.6: Pipeline prompt extraction (reused from generate_promptotyping_data.py)
# ---------------------------------------------------------------------------

def extract_prompt_constants(py_path: Path) -> dict:
    """Extract STAGE*_PROMPT constants from distill_knowledge.py."""
    if not py_path.exists():
        return {}
    content = py_path.read_text(encoding='utf-8')
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
            prompts[name] = raw
    return prompts


def build_assessment_prompt_from_code(categories_path: Path) -> str:
    """Reconstruct the assessment prompt exactly as run_llm_assessment.py does."""
    if not categories_path.exists():
        return "(Prompt nicht verfuegbar -- categories.yaml fehlt)"
    import yaml
    with open(categories_path, 'r', encoding='utf-8') as f:
        categories = yaml.safe_load(f)

    cat_descriptions = []
    for cat in categories.get('categories', []):
        desc = f"- **{cat['name']}**: {cat['definition'].strip()}"
        if cat.get('examples_positive'):
            desc += f"\n  Beispiele JA: {', '.join(cat['examples_positive'][:2])}"
        if cat.get('examples_negative'):
            desc += f"\n  Beispiele NEIN: {', '.join(cat['examples_negative'][:2])}"
        cat_descriptions.append(desc)

    decision_info = categories.get('decision', {})
    include_criteria = decision_info.get('include_criteria', 'Nicht definiert')

    return f"""Du bist ein wissenschaftlicher Reviewer...

## Kategorien (binaer: Ja/Nein)

{chr(10).join(cat_descriptions)}

## STRIKTE Entscheidungslogik

{include_criteria}

## Negative Constraints (Sycophancy-Mitigation)

- Feministisch = "Ja" NUR bei EXPLIZIT feministischer Theorie/Methode
- Soziale_Arbeit = "Ja" NUR bei direktem Bezug zu sozialarbeiterischer Praxis
- Prompting = "Ja" NUR bei substantiellem Prompt-Engineering-Fokus
- Max 4-5 Kategorien "Ja" pro Paper (es sei denn substantiell begruendet)

(Vollstaendiger Prompt: siehe benchmark/scripts/run_llm_assessment.py)"""


# ---------------------------------------------------------------------------
# Main Generator Class (Step 1.1)
# ---------------------------------------------------------------------------

class VaultV2Generator:
    """Generates Obsidian Vault v2 with 4 document types."""

    ASSESSMENT_CATEGORIES = [
        "AI_Literacies", "Generative_KI", "Prompting", "KI_Sonstige",
        "Soziale_Arbeit", "Bias_Ungleichheit", "Gender",
        "Diversitaet", "Feministisch", "Fairness"
    ]

    # Synonym map for concept consolidation
    CONCEPT_SYNONYMS = {
        'algorithmic bias': 'Algorithmic Bias',
        'algorithm bias': 'Algorithmic Bias',
        'ai bias': 'AI Bias',
        'artificial intelligence bias': 'AI Bias',
        'machine learning bias': 'ML Bias',
        'gender bias': 'Gender Bias',
        'racial bias': 'Racial Bias',
        'intersectionality': 'Intersectionality',
        'intersectional analysis': 'Intersectionality',
        'intersectional approach': 'Intersectionality',
        'feminist ai': 'Feminist AI',
        'feminist artificial intelligence': 'Feminist AI',
        'feminist hci': 'Feminist HCI',
        'feminist human-computer interaction': 'Feminist HCI',
        'fairness': 'Algorithmic Fairness',
        'algorithmic fairness': 'Algorithmic Fairness',
        'ai fairness': 'Algorithmic Fairness',
        'ai literacy': 'AI Literacy',
        'ai literacies': 'AI Literacy',
        'artificial intelligence literacy': 'AI Literacy',
        'prompt engineering': 'Prompt Engineering',
        'prompting': 'Prompt Engineering',
        'llm': 'Large Language Models',
        'llms': 'Large Language Models',
        'large language models': 'Large Language Models',
        'large language model': 'Large Language Models',
        'generative ai': 'Generative AI',
        'generative artificial intelligence': 'Generative AI',
        'social work': 'Social Work',
        'soziale arbeit': 'Social Work',
        'data justice': 'Data Justice',
        'data feminism': 'Data Feminism',
        'responsible ai': 'Responsible AI',
        'responsible artificial intelligence': 'Responsible AI',
        'explainable ai': 'Explainable AI',
        'xai': 'Explainable AI',
        'natural language processing': 'Natural Language Processing',
        'nlp': 'Natural Language Processing',
        'facial recognition': 'Facial Recognition',
        'face recognition': 'Facial Recognition',
        'sentiment analysis': 'Sentiment Analysis',
        'hate speech detection': 'Hate Speech Detection',
        'content moderation': 'Content Moderation',
        'critical race theory': 'Critical Race Theory',
        'crt': 'Critical Race Theory',
        'disability studies': 'Disability Studies',
        'queer theory': 'Queer Theory',
        'postcolonial theory': 'Postcolonial Theory',
        'decolonial ai': 'Decolonial AI',
    }

    def __init__(self, base_path: Path = None, cache_dir: str = '.vault_cache'):
        if base_path is None:
            self.base_path = Path(__file__).resolve().parent.parent
        else:
            self.base_path = Path(base_path)

        self.vault_path = self.base_path / 'vault'
        self.cache_dir = self.base_path / cache_dir
        self.knowledge_dir = self.base_path / 'pipeline' / 'knowledge' / 'distilled'
        self.stage1_dir = self.knowledge_dir / '_stage1_json'
        self.stage2_dir = self.knowledge_dir / '_stage2_draft'
        self.verification_dir = self.knowledge_dir / '_verification'
        self.zotero_path = self.base_path / 'corpus' / 'zotero_export.json'
        self.llm_csv_path = self.base_path / 'benchmark' / 'data' / 'llm_assessment_10k.csv'
        self.human_csv_path = self.base_path / 'benchmark' / 'data' / 'human_assessment.csv'
        self.disagreements_csv_path = self.base_path / 'benchmark' / 'results' / 'disagreements.csv'
        self.agreement_json_path = self.base_path / 'benchmark' / 'results' / 'agreement_metrics.json'
        self.categories_yaml_path = self.base_path / 'benchmark' / 'config' / 'categories.yaml'
        self.distill_py_path = self.base_path / 'pipeline' / 'scripts' / 'distill_knowledge.py'

        # Data stores
        self.zotero_items: list = []
        self.zotero_by_key: Dict[str, dict] = {}
        self.llm_assessments: Dict[str, dict] = {}   # by Zotero_Key
        self.human_assessments: Dict[str, dict] = {}  # by Zotero_Key
        self.knowledge_to_zotero: Dict[str, dict] = {}  # stem -> {zotero_item, zotero_key}
        self.disagreements: List[dict] = []  # raw rows from disagreements.csv
        self.agreement_metrics: dict = {}

        # LLM-derived data
        self.concepts: Dict[str, dict] = {}  # canonical_name -> {definition, papers, frequency}
        self.paper_concepts: Dict[str, List[str]] = {}  # stem -> [concept_names]
        self.co_occurrence: Dict[Tuple[str, str], int] = defaultdict(int)
        self.divergence_classifications: Dict[str, dict] = {}  # paper_id -> {pattern, justification}

        # LLM client (lazy init)
        self._client = None

    @property
    def client(self):
        """Lazy-init Anthropic client."""
        if self._client is None:
            try:
                import anthropic
            except ImportError:
                print("Error: pip install anthropic")
                sys.exit(1)
            api_key = os.environ.get('ANTHROPIC_API_KEY')
            if not api_key:
                env_file = self.base_path / '.env'
                if env_file.exists():
                    for line in env_file.read_text(encoding='utf-8').splitlines():
                        if line.startswith('ANTHROPIC_API_KEY='):
                            api_key = line.split('=', 1)[1].strip()
                            break
            if not api_key:
                print("Error: ANTHROPIC_API_KEY not found in environment or .env")
                sys.exit(1)
            self._client = anthropic.Anthropic(api_key=api_key)
        return self._client

    # -------------------------------------------------------------------
    # Data loading
    # -------------------------------------------------------------------

    def load_all_data(self):
        """Load all data sources."""
        print("=" * 60)
        print("LOADING DATA")
        print("=" * 60)

        # 1. Zotero
        if self.zotero_path.exists():
            self.zotero_items = json.loads(self.zotero_path.read_text(encoding='utf-8'))
            self.zotero_by_key = {item['key']: item for item in self.zotero_items if item.get('key')}
            print(f"  Zotero: {len(self.zotero_items)} items")
        else:
            print(f"  WARNING: Zotero export not found: {self.zotero_path}")

        # 2. Assessments
        self._load_assessments()

        # 3. Title matching
        self.knowledge_to_zotero, unmatched = build_knowledge_doc_to_zotero_index(
            self.knowledge_dir, self.zotero_items, self.stage1_dir
        )
        print(f"  Title matching: {len(self.knowledge_to_zotero)}/249 matched")
        if unmatched:
            print(f"  WARNING: {len(unmatched)} unmatched: {unmatched[:5]}...")

        # 4. Disagreements
        if self.disagreements_csv_path.exists():
            with open(self.disagreements_csv_path, 'r', encoding='utf-8-sig', newline='') as f:
                self.disagreements = list(csv.DictReader(f))
            print(f"  Disagreements: {len(self.disagreements)} cases")

        # 5. Agreement metrics
        if self.agreement_json_path.exists():
            self.agreement_metrics = json.loads(self.agreement_json_path.read_text(encoding='utf-8'))
            print(f"  Agreement metrics: loaded")

        print()

    def _load_assessments(self):
        """Load LLM and human assessment CSVs, indexed by Zotero_Key."""
        # LLM assessment
        if self.llm_csv_path.exists():
            with open(self.llm_csv_path, 'r', encoding='utf-8-sig', newline='') as f:
                for row in csv.DictReader(f):
                    key = row.get('Zotero_Key', '').strip()
                    if not key:
                        continue
                    cats = {}
                    for cat in self.ASSESSMENT_CATEGORIES:
                        cats[cat] = row.get(cat, '').strip() == 'Ja'
                    try:
                        confidence = float(row.get('LLM_Confidence', 0) or 0)
                    except (ValueError, TypeError):
                        confidence = 0.0
                    self.llm_assessments[key] = {
                        'decision': row.get('Decision', '').strip(),
                        'categories': cats,
                        'confidence': round(confidence, 2),
                        'reasoning': row.get('LLM_Reasoning', '').strip(),
                        'author_year': row.get('Author_Year', '').strip(),
                        'title': row.get('Title', '').strip(),
                    }
            print(f"  LLM assessments: {len(self.llm_assessments)} papers")

        # Human assessment
        if self.human_csv_path.exists():
            with open(self.human_csv_path, 'r', encoding='utf-8-sig', newline='') as f:
                for row in csv.DictReader(f):
                    key = row.get('Zotero_Key', '').strip()
                    if not key:
                        continue
                    decision = row.get('Decision', '').strip()
                    if not decision:
                        continue
                    cats = {}
                    for cat in self.ASSESSMENT_CATEGORIES:
                        cats[cat] = row.get(cat, '').strip() == 'Ja'
                    self.human_assessments[key] = {
                        'decision': decision,
                        'categories': cats,
                    }
            print(f"  Human assessments: {len(self.human_assessments)} papers (with decision)")

    # -------------------------------------------------------------------
    # Step 1.2: LLM-based concept extraction
    # -------------------------------------------------------------------

    def extract_concepts_llm(self, content: str, stem: str) -> List[dict]:
        """Call LLM to extract 3-8 concepts from a knowledge doc.
        Returns: [{concept, definition, relevance}]
        """
        # Check cache first
        cache_path = self.cache_dir / 'concepts' / f'{stem}.json'
        if cache_path.exists():
            return json.loads(cache_path.read_text(encoding='utf-8'))

        prompt = """Analysiere dieses akademische Wissensdokument und extrahiere 3-8 Fachkonzepte.

Regeln:
- Verwende die ENGLISCHE kanonische Form (z.B. "Algorithmic Fairness", nicht "algorithmische Fairness")
- Keine generischen Begriffe allein (nicht "AI" oder "Bias" allein, sondern spezifisch: "Algorithmic Bias", "Gender Bias", "AI Literacy")
- Jedes Konzept braucht eine knappe Definition (1-2 Saetze) und eine Relevanz-Einschaetzung (zentral/unterstuetzend)
- Konzepte sollen den thematischen Kern des Papers abbilden

Antworte NUR mit diesem JSON-Array:

```json
[
  {"concept": "Konzeptname", "definition": "Knappe Definition", "relevance": "zentral"},
  {"concept": "...", "definition": "...", "relevance": "unterstuetzend"}
]
```"""

        try:
            response = self.client.messages.create(
                model='claude-haiku-4-5-20251001',
                max_tokens=1024,
                messages=[{"role": "user", "content": f"{prompt}\n\n---\n\n{content[:6000]}"}]
            )
            text = response.content[0].text

            # Extract JSON from response
            if '```json' in text:
                json_str = text.split('```json')[1].split('```')[0].strip()
            elif '```' in text:
                json_str = text.split('```')[1].split('```')[0].strip()
            else:
                json_str = text.strip()

            concepts = json.loads(json_str)
            if not isinstance(concepts, list):
                concepts = [concepts]

            # Cache result
            cache_path.parent.mkdir(parents=True, exist_ok=True)
            cache_path.write_text(json.dumps(concepts, ensure_ascii=False, indent=2), encoding='utf-8')

            return concepts

        except Exception as e:
            print(f"    LLM error for {stem}: {e}")
            return []

    def consolidate_concepts(self):
        """Post-process all extracted concepts: synonym merge, frequency, co-occurrence."""
        print("  Consolidating concepts...")

        # Collect raw concepts per paper
        raw_per_paper: Dict[str, List[str]] = {}  # stem -> [canonical_names]

        for stem, concept_list in self.paper_concepts.items():
            canonicals = []
            for name in concept_list:
                # Normalize and apply synonym map
                lower = name.lower().strip()
                canonical = self.CONCEPT_SYNONYMS.get(lower, name.strip())
                # Title-case if not in synonym map
                if lower not in self.CONCEPT_SYNONYMS:
                    canonical = canonical.title() if not canonical[0].isupper() else canonical
                canonicals.append(canonical)
            raw_per_paper[stem] = list(set(canonicals))  # deduplicate within paper

        # Build frequency and paper lists
        concept_data: Dict[str, dict] = defaultdict(lambda: {
            'definitions': [], 'papers': [], 'frequency': 0
        })

        for stem, canonicals in raw_per_paper.items():
            for c in canonicals:
                concept_data[c]['papers'].append(stem)
                concept_data[c]['frequency'] += 1

        # Merge definitions from LLM extractions
        for stem, concept_list_raw in self.paper_concepts.items():
            # We need the original LLM output for definitions
            cache_path = self.cache_dir / 'concepts' / f'{stem}.json'
            if cache_path.exists():
                try:
                    llm_concepts = json.loads(cache_path.read_text(encoding='utf-8'))
                    for lc in llm_concepts:
                        name = lc.get('concept', '')
                        lower = name.lower().strip()
                        canonical = self.CONCEPT_SYNONYMS.get(lower, name.strip())
                        if lower not in self.CONCEPT_SYNONYMS:
                            canonical = canonical.title() if canonical and not canonical[0].isupper() else canonical
                        if canonical in concept_data and lc.get('definition'):
                            concept_data[canonical]['definitions'].append(lc['definition'])
                except (json.JSONDecodeError, KeyError):
                    pass

        # Filter: frequency >= 2
        filtered = {}
        for name, data in concept_data.items():
            if data['frequency'] >= 2:
                # Pick best definition (longest, or first)
                defs = data['definitions']
                best_def = max(defs, key=len) if defs else ''
                filtered[name] = {
                    'definition': best_def,
                    'papers': data['papers'],
                    'frequency': data['frequency'],
                }

        self.concepts = filtered

        # Update paper_concepts to use canonical names (filtered)
        valid_concepts = set(filtered.keys())
        for stem in raw_per_paper:
            self.paper_concepts[stem] = [c for c in raw_per_paper[stem] if c in valid_concepts]

        # Co-occurrence matrix
        self.co_occurrence = defaultdict(int)
        for stem, canonicals in self.paper_concepts.items():
            unique = sorted(set(canonicals))
            for i, c1 in enumerate(unique):
                for c2 in unique[i + 1:]:
                    pair = tuple(sorted([c1, c2]))
                    self.co_occurrence[pair] += 1

        print(f"    {len(self.concepts)} concepts (freq >= 2)")
        # Print top 10
        top = sorted(self.concepts.items(), key=lambda x: x[1]['frequency'], reverse=True)[:10]
        for name, data in top:
            print(f"      {name}: {data['frequency']} papers")

    def run_concept_extraction(self, skip_llm: bool = False):
        """Step 1.2: Extract concepts from all 249 knowledge docs."""
        print("=" * 60)
        print("CONCEPT EXTRACTION (LLM)")
        print("=" * 60)

        knowledge_files = sorted(self.knowledge_dir.glob('*.md'))
        total = len(knowledge_files)
        print(f"  Processing {total} knowledge docs...")

        for i, kd_path in enumerate(knowledge_files, 1):
            stem = kd_path.stem
            content = kd_path.read_text(encoding='utf-8')

            if skip_llm:
                cache_path = self.cache_dir / 'concepts' / f'{stem}.json'
                if cache_path.exists():
                    concepts = json.loads(cache_path.read_text(encoding='utf-8'))
                else:
                    print(f"    [{i}/{total}] SKIP (no cache): {stem[:50]}")
                    self.paper_concepts[stem] = []
                    continue
            else:
                concepts = self.extract_concepts_llm(content, stem)
                if i % 25 == 0 or i == total:
                    print(f"    [{i}/{total}] extracted {len(concepts)} concepts")
                time.sleep(0.3)  # Rate limiting

            self.paper_concepts[stem] = [c.get('concept', '') for c in concepts if c.get('concept')]

        self.consolidate_concepts()
        print()

    # -------------------------------------------------------------------
    # Step 1.3: Divergence classification per LLM
    # -------------------------------------------------------------------

    def classify_single_divergence(self, row: dict) -> dict:
        """Classify a single disagreement case into one of 3 patterns."""
        paper_id = row.get('paper_id', '')

        # Check cache
        cache_path = self.cache_dir / 'divergences' / f'{paper_id}.json'
        if cache_path.exists():
            return json.loads(cache_path.read_text(encoding='utf-8'))

        # Build category comparison table
        cat_comparison = []
        for cat in self.ASSESSMENT_CATEGORIES:
            h_val = row.get(f'human_{cat}', '').strip()
            a_val = row.get(f'agent_{cat}', '').strip()
            divergent = " <-- DIVERGENT" if h_val != a_val else ""
            cat_comparison.append(f"  {cat}: Human={h_val}, LLM={a_val}{divergent}")

        comparison_text = "\n".join(cat_comparison)

        prompt = f"""Klassifiziere diesen Disagreement-Fall zwischen menschlichem und LLM-Assessment.

**Titel:** {row.get('title', '')}
**Autor/Jahr:** {row.get('author_year', '')}
**Human-Entscheidung:** {row.get('human_decision', '')}
**LLM-Entscheidung:** {row.get('agent_decision', '')}
**LLM-Confidence:** {row.get('agent_confidence', '')}
**LLM-Reasoning:** {row.get('agent_reasoning', '')[:500]}

**Kategorie-Vergleich:**
{comparison_text}

Klassifiziere in EINES dieser drei Muster:
1. **Keyword-Inklusion**: LLM hat aufgrund expliziter Keywords im Titel/Abstract entschieden, ohne den Kontext zu verstehen
2. **Semantische Expansion**: LLM hat den Bedeutungsraum einer Kategorie ueber- oder unterdehnt
3. **Implizite Feldzugehoerigkeit**: LLM hat implizites Feldwissen (z.B. dass ein Thema zur Sozialen Arbeit gehoert) nicht erkannt

Antworte NUR mit diesem JSON:
```json
{{"pattern": "Keyword-Inklusion|Semantische Expansion|Implizite Feldzugehoerigkeit", "justification": "Kurze Begruendung (max 2 Saetze)"}}
```"""

        try:
            response = self.client.messages.create(
                model='claude-haiku-4-5-20251001',
                max_tokens=256,
                messages=[{"role": "user", "content": prompt}]
            )
            text = response.content[0].text

            if '```json' in text:
                json_str = text.split('```json')[1].split('```')[0].strip()
            elif '```' in text:
                json_str = text.split('```')[1].split('```')[0].strip()
            else:
                json_str = text.strip()

            result = json.loads(json_str)

            # Validate pattern
            valid_patterns = ['Keyword-Inklusion', 'Semantische Expansion', 'Implizite Feldzugehoerigkeit']
            if result.get('pattern') not in valid_patterns:
                result['pattern'] = 'Keyword-Inklusion'  # Fallback

            cache_path.parent.mkdir(parents=True, exist_ok=True)
            cache_path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')

            return result

        except Exception as e:
            print(f"    LLM error for divergence {paper_id}: {e}")
            return {'pattern': 'Keyword-Inklusion', 'justification': f'Classification failed: {e}'}

    def run_divergence_classification(self, skip_llm: bool = False):
        """Step 1.3: Classify all 111 disagreement cases."""
        print("=" * 60)
        print("DIVERGENCE CLASSIFICATION (LLM)")
        print("=" * 60)

        total = len(self.disagreements)
        print(f"  Classifying {total} disagreement cases...")

        for i, row in enumerate(self.disagreements, 1):
            paper_id = row.get('paper_id', str(i))

            if skip_llm:
                cache_path = self.cache_dir / 'divergences' / f'{paper_id}.json'
                if cache_path.exists():
                    result = json.loads(cache_path.read_text(encoding='utf-8'))
                else:
                    result = {'pattern': 'Keyword-Inklusion', 'justification': 'No cache available'}
            else:
                result = self.classify_single_divergence(row)
                if i % 20 == 0 or i == total:
                    print(f"    [{i}/{total}] classified")
                time.sleep(0.3)

            self.divergence_classifications[paper_id] = result

        # Print pattern distribution
        patterns = Counter(v['pattern'] for v in self.divergence_classifications.values())
        print(f"  Pattern distribution:")
        for pattern, count in patterns.most_common():
            print(f"    {pattern}: {count} ({count * 100 / total:.0f}%)")
        print()

    # -------------------------------------------------------------------
    # Vault structure
    # -------------------------------------------------------------------

    def setup_vault_structure(self, clean: bool = False):
        """Create vault directory structure."""
        if clean and self.vault_path.exists():
            shutil.rmtree(self.vault_path)
            print(f"  Cleaned vault: {self.vault_path}")

        for subdir in ['Papers', 'Concepts', 'Pipeline', 'Divergenzen', 'MOCs']:
            (self.vault_path / subdir).mkdir(parents=True, exist_ok=True)

        print(f"  Vault structure ready: {self.vault_path}")

    # -------------------------------------------------------------------
    # Step 1.4: Paper notes
    # -------------------------------------------------------------------

    def _safe_filename(self, title: str) -> str:
        """Make a filesystem-safe filename from a title."""
        safe = re.sub(r'[<>:"/\\|?*\n\r]', '-', title).strip('. ')
        return safe[:200]  # Max length

    def _yaml_frontmatter(self, data: dict) -> str:
        """Render a dict as YAML frontmatter."""
        lines = ['---']
        for key, value in data.items():
            if isinstance(value, list):
                if value:
                    lines.append(f'{key}:')
                    for item in value:
                        lines.append(f'  - "{item}"' if isinstance(item, str) and ':' in str(item) else f'  - {item}')
                else:
                    lines.append(f'{key}: []')
            elif isinstance(value, bool):
                lines.append(f'{key}: {"true" if value else "false"}')
            elif isinstance(value, (int, float)):
                lines.append(f'{key}: {value}')
            elif value is None:
                lines.append(f'{key}: null')
            elif isinstance(value, str) and (':' in value or '"' in value or '\n' in value):
                escaped = value.replace('"', '\\"').replace('\n', ' ')
                lines.append(f'{key}: "{escaped}"')
            else:
                lines.append(f'{key}: {value}')
        lines.append('---')
        return '\n'.join(lines) + '\n'

    def create_paper_note(self, stem: str) -> str:
        """Create an Obsidian note for a single paper."""
        # Read knowledge doc
        kd_path = self.knowledge_dir / f'{stem}.md'
        kd_content = kd_path.read_text(encoding='utf-8') if kd_path.exists() else ''

        # Strip existing YAML frontmatter from knowledge doc content
        if kd_content.startswith('---'):
            end = kd_content.find('---', 3)
            if end != -1:
                kd_body = kd_content[end + 3:].strip()
            else:
                kd_body = kd_content
        else:
            kd_body = kd_content

        # Zotero metadata
        match_data = self.knowledge_to_zotero.get(stem, {})
        zotero_item = match_data.get('zotero_item', {})
        zotero_key = match_data.get('zotero_key', '')

        # Authors
        creators = zotero_item.get('creators', [])
        authors = [f"{c.get('firstName', '')} {c.get('lastName', '')}".strip() for c in creators]
        if not authors or all(not a for a in authors):
            authors = ['Unknown Author']

        # Year
        date_str = zotero_item.get('date', '') or ''
        year = date_str.split('-')[0] if date_str else ''
        if not year or not re.match(r'^\d{4}$', year):
            year = '2024'

        title = zotero_item.get('title', stem) or stem

        # Assessment data
        llm_data = self.llm_assessments.get(zotero_key, {})
        human_data = self.human_assessments.get(zotero_key, {})

        # Agreement
        agreement = None
        if llm_data and human_data:
            agreement = 'agree' if llm_data['decision'] == human_data['decision'] else 'disagree'

        # Stage1 data
        stage1 = {}
        stage1_path = self.stage1_dir / f'{stem}.json'
        if stage1_path.exists():
            try:
                stage1 = json.loads(stage1_path.read_text(encoding='utf-8'))
            except json.JSONDecodeError:
                pass

        # Verification data
        verif = {}
        verif_path = self.verification_dir / f'{stem}.json'
        if verif_path.exists():
            try:
                verif = json.loads(verif_path.read_text(encoding='utf-8'))
            except json.JSONDecodeError:
                pass

        # Build frontmatter
        fm = {
            'title': title,
            'authors': authors,
            'year': int(year) if year.isdigit() else year,
            'type': zotero_item.get('itemType', 'research-paper'),
            'doi': zotero_item.get('DOI', '') or '',
            'url': zotero_item.get('url', '') or '',
            'tags': ['paper'],
        }

        if llm_data:
            fm['llm_decision'] = llm_data['decision']
            fm['llm_confidence'] = llm_data['confidence']
            fm['llm_categories'] = [c for c, v in llm_data['categories'].items() if v]

        if human_data:
            fm['human_decision'] = human_data['decision']
            fm['human_categories'] = [c for c, v in human_data['categories'].items() if v]

        if agreement:
            fm['agreement'] = agreement

        # Concepts
        paper_concepts = self.paper_concepts.get(stem, [])

        note = self._yaml_frontmatter(fm)
        note += f'\n# {title}\n\n'

        # Section 1: Transformation Trail
        note += '## Transformation Trail\n\n'

        # Stage 1: JSON extraction
        if stage1:
            cats = stage1.get('categories', {})
            positive_cats = [k for k, v in cats.items() if v]
            note += '### Stufe 1: Extraktion & Klassifikation (LLM)\n\n'
            note += f'**Extrahierte Kategorien:** {", ".join(positive_cats) if positive_cats else "keine"}\n'
            args = stage1.get('arguments', [])
            if args:
                note += f'**Argumente:** {len(args)} extrahiert\n'
            note += '\n'

        # Stage 3: Verification
        if verif:
            v = verif.get('verification', {})
            note += '### Stufe 3: Verifikation (LLM)\n\n'
            note += f'| Metrik | Score |\n|--------|-------|\n'
            note += f'| Completeness | {v.get("completeness", {}).get("score", "?")} |\n'
            note += f'| Correctness | {v.get("correctness", {}).get("score", "?")} |\n'
            note += f'| Category Validation | {v.get("category_validation", {}).get("score", "?")} |\n'
            note += f'| **Overall Confidence** | **{verif.get("overall_confidence", "?")}** |\n\n'

        # Stage 4: Assessment comparison
        if llm_data or human_data:
            note += '### Stufe 4: Assessment\n\n'
            if llm_data:
                note += f'**LLM:** {llm_data["decision"]} (Confidence: {llm_data["confidence"]})\n'
            if human_data:
                note += f'**Human:** {human_data["decision"]}\n'
            if agreement == 'disagree':
                note += '\n**Kategorie-Vergleich (bei Divergenz):**\n\n'
                note += '| Kategorie | Human | LLM | Divergent |\n'
                note += '|-----------|-------|-----|----------|\n'
                for cat in self.ASSESSMENT_CATEGORIES:
                    h = 'Ja' if human_data.get('categories', {}).get(cat) else 'Nein'
                    l = 'Ja' if llm_data.get('categories', {}).get(cat) else 'Nein'
                    div = 'X' if h != l else ''
                    note += f'| {cat} | {h} | {l} | {div} |\n'
                note += '\n'
                # Link to divergence note
                note += f'> Siehe [[Divergenz {stem}]] fuer detaillierte Analyse\n\n'
            note += '\n'

        # Section 2: Key Concepts
        if paper_concepts:
            note += '## Key Concepts\n\n'
            for c in sorted(paper_concepts):
                note += f'- [[{c}]]\n'
            note += '\n'

        # Section 3: Wissensdokument
        note += '## Wissensdokument\n\n'
        note += kd_body + '\n'

        return note

    # -------------------------------------------------------------------
    # Step 1.5: Concept notes
    # -------------------------------------------------------------------

    def create_concept_note(self, name: str, data: dict) -> str:
        """Create a concept note with definition, co-occurrence, and papers."""
        # Find related concepts (top 5 by co-occurrence)
        related = []
        for pair, count in self.co_occurrence.items():
            if name in pair:
                other = pair[0] if pair[1] == name else pair[1]
                related.append((other, count))
        related.sort(key=lambda x: x[1], reverse=True)
        related = related[:8]

        fm = {
            'title': name,
            'type': 'concept',
            'frequency': data['frequency'],
            'papers_count': len(data['papers']),
            'related_concepts': [r[0] for r in related[:5]],
            'tags': ['concept'],
        }

        note = self._yaml_frontmatter(fm)
        note += f'# {name}\n\n'

        # Definition
        note += '## Definition\n\n'
        if data.get('definition'):
            note += f'{data["definition"]}\n\n'
        else:
            note += '*Keine LLM-extrahierte Definition verfuegbar.*\n\n'

        # Co-occurrence
        if related:
            note += '## Co-occurrence\n\n'
            note += '| Konzept | Gemeinsame Papers |\n'
            note += '|---------|------------------|\n'
            for other, count in related:
                note += f'| [[{other}]] | {count} |\n'
            note += '\n'

        # Papers
        note += '## Papers\n\n'
        for stem in sorted(data['papers']):
            # Use vault filename if available (handles collisions), fallback to safe title
            vault_fn = getattr(self, '_stem_to_vault_filename', {}).get(stem)
            if not vault_fn:
                match_data = self.knowledge_to_zotero.get(stem, {})
                zotero_item = match_data.get('zotero_item', {})
                title = zotero_item.get('title', stem)
                vault_fn = self._safe_filename(title)
            note += f'- [[{vault_fn}]]\n'
        note += '\n'

        # Assessment divergence stats for papers with this concept
        disagree_count = 0
        total_assessed = 0
        for stem in data['papers']:
            match_data = self.knowledge_to_zotero.get(stem, {})
            zk = match_data.get('zotero_key', '')
            if zk in self.llm_assessments and zk in self.human_assessments:
                total_assessed += 1
                if self.llm_assessments[zk]['decision'] != self.human_assessments[zk]['decision']:
                    disagree_count += 1

        if total_assessed > 0:
            note += '## Assessment-Divergenz\n\n'
            agree_pct = ((total_assessed - disagree_count) / total_assessed) * 100
            note += f'Von {total_assessed} bewerteten Papers: {disagree_count} Divergenzen ({100 - agree_pct:.0f}%)\n\n'

        return note

    # -------------------------------------------------------------------
    # Step 1.6: Pipeline notes
    # -------------------------------------------------------------------

    def create_pipeline_notes(self):
        """Create 5 pipeline stage documentation notes."""
        # Extract prompts from code
        ske_prompts = extract_prompt_constants(self.distill_py_path)
        assessment_prompt = build_assessment_prompt_from_code(self.categories_yaml_path)

        notes = {}

        # 1. Identifikation
        notes['Identifikation'] = f"""---
title: "Pipeline: Identifikation"
type: pipeline
stage: 1
tags: [pipeline, identifikation]
---

# Stufe 1: Identifikation

## Methode

Deep Research mit 4 Anbietern (Perplexity, Elicit, Consensus, Google Scholar).
Manuelle Ergaenzung ueber Schneeballverfahren und Expert:innen-Empfehlungen.

## Ergebnis

**326 Papers** in Zotero-Bibliothek aufgenommen.

| Quelle | Papers |
|--------|--------|
| Deep Research | ~254 |
| Manual/Snowball | ~50 |
| Overlap | ~22 |

## Konfiguration

- Zotero als Bibliotheksverwaltung
- RIS-Import fuer systematische Quellen
- Manuelle DOI-Eintraege fuer Einzelfunde

## Limitationen

- Keine vollstaendige Reproduzierbarkeit der Deep-Research-Ergebnisse (abhaengig von Zeitpunkt und Anbieter-Algorithmen)
- 290/326 Papers ohne verifizierte Source_Tool-Zuordnung
- Kein formales Screening-Protokoll vor Aufnahme in Zotero
"""

        # 2. Konversion
        notes['Konversion'] = f"""---
title: "Pipeline: Konversion"
type: pipeline
stage: 2
tags: [pipeline, konversion]
---

# Stufe 2: Konversion (PDF -> Markdown)

## Methode

**Docling** (IBM) fuer PDF-zu-Markdown-Konversion. Deterministischer Prozess.

PDF-Akquisition: 4 Fallback-Strategien (Zotero-Attachment, DOI-Resolver, Unpaywall API, ArXiv).

## Ergebnis

| Schritt | Anzahl |
|---------|--------|
| Zotero-Eintraege | 326 |
| PDFs akquiriert | 257 |
| Markdown konvertiert | 252 |
| Konversions-Fehler | 5 |
| Fehlende PDFs | 69 |

## Konfiguration

- `pipeline/scripts/acquire_pdfs.py`
- Docling mit Standard-Einstellungen
- Retry-Logik fuer fehlgeschlagene Downloads

## Limitationen

- 69 Papers ohne PDF (Open-Access-Verfuegbarkeit)
- Tabellen und Abbildungen gehen bei Konversion verloren
- Fussnoten werden oft falsch zugeordnet
- Layout-komplexe Papers (Multi-Column) produzieren Artefakte
"""

        # 3. SKE (Structured Knowledge Extraction)
        stage1_prompt = ske_prompts.get('STAGE1_EXTRACT_CLASSIFY_PROMPT', '(nicht extrahierbar)')
        stage3_prompt = ske_prompts.get('STAGE3_VERIFY_PROMPT', '(nicht extrahierbar)')

        # Truncate prompts for readability
        if len(stage1_prompt) > 2000:
            stage1_prompt = stage1_prompt[:2000] + '\n\n[... gekuerzt, siehe pipeline/scripts/distill_knowledge.py]'
        if len(stage3_prompt) > 2000:
            stage3_prompt = stage3_prompt[:2000] + '\n\n[... gekuerzt, siehe pipeline/scripts/distill_knowledge.py]'

        # Verification stats
        verif_count = len(list(self.verification_dir.glob('*.json')))
        verif_scores = []
        for vf in self.verification_dir.glob('*.json'):
            try:
                vdata = json.loads(vf.read_text(encoding='utf-8'))
                verif_scores.append(vdata.get('overall_confidence', 0))
            except (json.JSONDecodeError, KeyError):
                pass
        avg_confidence = sum(verif_scores) / len(verif_scores) if verif_scores else 0
        above_75 = sum(1 for s in verif_scores if s >= 75)

        notes['SKE'] = f"""---
title: "Pipeline: Structured Knowledge Extraction"
type: pipeline
stage: 3
tags: [pipeline, ske, llm]
---

# Stufe 3: Structured Knowledge Extraction (SKE)

## Methode

3-Stage LLM-Pipeline mit Claude Haiku 4.5:

1. **Extract & Classify** (LLM): Extraktion von Metadaten, Kernbefund, Argumenten, 10 Kategorien
2. **Format & Enrich** (deterministisch): Konversion zu Obsidian-Markdown mit YAML-Frontmatter
3. **Verify & Finalize** (LLM): Verifikation gegen Originaltext, Confidence-Score

## Ergebnis

| Metrik | Wert |
|--------|------|
| Input (Markdown-Docs) | 252 |
| Output (Knowledge-Docs) | 249 |
| Verifikations-Dateien | {verif_count} |
| Durchschnittliche Confidence | {avg_confidence:.1f} |
| Score >= 75 | {above_75}/{len(verif_scores)} |

## Prompt: Stufe 1 (Extract & Classify)

```
{stage1_prompt}
```

## Prompt: Stufe 3 (Verify)

```
{stage3_prompt}
```

## Konfiguration

- Modell: Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Kosten: ~$0.028 pro Paper (gesamt: ~$7)
- Rate Limiting: 1s Delay zwischen Calls
- Config: `config/defaults.yaml`

## Limitationen

- 3 Papers bei Konversion verloren (252 -> 249)
- LLM-Extraktion abhaengig von Markdown-Qualitaet (Tabellen/Abbildungen fehlen)
- Kategorie-Extraktion in Stufe 1 ist probabilistisch (nicht identisch mit 10K-Assessment)
- Verifikation prueft nur gegen Originaltext, nicht gegen Realitaet
"""

        # 4. Assessment
        notes['Assessment'] = f"""---
title: "Pipeline: Assessment"
type: pipeline
stage: 4
tags: [pipeline, assessment, benchmark]
---

# Stufe 4: Dualer Assessment-Pfad

## Methode

**Zwei unabhaengige Bewertungspfade** mit identischem 10-Kategorien-Schema:

| Pfad | Methode | Bewertet | Kosten |
|------|---------|----------|--------|
| Human | Google Sheets | 210/326 | -- |
| LLM (10K) | Claude Haiku 4.5 | 326/326 | $1.44 |

**10 binaere Kategorien** (Ja/Nein):
AI_Literacies, Generative_KI, Prompting, KI_Sonstige, Soziale_Arbeit, Bias_Ungleichheit, Gender, Diversitaet, Feministisch, Fairness

**Entscheidungslogik:** Include wenn TECHNIK_OK (mind. 1x Ja in AI/GenKI/Prompting/KI_Sonstige) UND SOZIAL_OK (mind. 1x Ja in SozArb/Bias/Gender/Div/Fem/Fairness)

## Assessment-Prompt (LLM)

```
{assessment_prompt}
```

## Benchmark-Ergebnis

| Metrik | Wert |
|--------|------|
| Overall Agreement | 47.14% |
| Cohen's Kappa | 0.035 (Prevalence-Bias-Artefakt) |
| LLM Include-Rate | 68% |
| Human Include-Rate | 42% |
| Disagreements | 111/200 |

**Konfusionsmatrix (n=200):**

|  | Human Include | Human Exclude |
|--|--------------|---------------|
| **LLM Include** | 65 | 78 |
| **LLM Exclude** | 23 | 34 |

## Limitationen

- Human Assessment nur fuer 210/326 Papers (64%)
- LLM hat keinen Zugriff auf Volltexte (nur Titel + Abstract)
- Kappa = 0.035 ist Prevalence-Bias-Artefakt (Byrt et al., 1993), NICHT primaere Metrik
- Sycophancy-Mitigation durch negative constraints, aber nicht vollstaendig eliminierbar
"""

        # 5. Synthese
        notes['Synthese'] = f"""---
title: "Pipeline: Synthese"
type: pipeline
stage: 5
tags: [pipeline, synthese, vault]
---

# Stufe 5: Synthese (Vault-Generierung)

## Methode

Deterministisches Python-Script (`scripts/generate_vault_v2.py`) mit LLM-gestuetzter Konzept-Extraktion.

## Vault-Dokumenttypen

| Typ | Anzahl | Beschreibung |
|-----|--------|-------------|
| Paper-Notes | 249 | Transformation Trail + Assessment + Wissensdokument |
| Konzept-Notes | {len(self.concepts)} | LLM-extrahierte Konzepte mit Definitionen und Co-Occurrence |
| Pipeline-Notes | 5 | Prompts, Konfiguration, Statistiken, Limitationen |
| Divergenz-Notes | {len(self.divergence_classifications)} | Klassifizierte Disagreement-Faelle |

## Prozess

1. Multi-Strategie Titel-Matching (Knowledge-Docs <-> Zotero)
2. LLM-basierte Konzept-Extraktion (3-8 Konzepte pro Paper, Haiku 4.5)
3. Konzept-Konsolidierung (Synonym-Merge, Frequency-Filter >= 2)
4. LLM-basierte Divergenz-Klassifikation (3 Muster)
5. Vault-Generierung (4 Dokumenttypen + MOCs + ZIP)

## Limitationen

- Konzept-Extraktion ist probabilistisch (LLM-abhaengig)
- Co-Occurrence ist dokumentbasiert, nicht satzbasiert
- Divergenz-Klassifikation ist eine LLM-Interpretation einer LLM-Divergenz (Meta-Ebene)
"""

        return notes

    # -------------------------------------------------------------------
    # Step 1.7: Divergence notes
    # -------------------------------------------------------------------

    def create_divergenz_note(self, row: dict) -> str:
        """Create a divergence note for a single disagreement case."""
        paper_id = row.get('paper_id', '')
        title = row.get('title', '')
        author_year = row.get('author_year', '')
        classification = self.divergence_classifications.get(paper_id, {})

        fm = {
            'title': f'Divergenz: {title[:80]}',
            'type': 'divergenz',
            'pattern': classification.get('pattern', 'unklassifiziert'),
            'human_decision': row.get('human_decision', ''),
            'llm_decision': row.get('agent_decision', ''),
            'severity': int(row.get('severity', 0)) if row.get('severity', '').isdigit() else 0,
            'paper_id': paper_id,
            'tags': ['divergenz'],
        }

        note = self._yaml_frontmatter(fm)
        note += f'# Divergenz: {title}\n\n'
        note += f'**Paper:** {author_year}\n'
        note += f'**Paper-ID:** {paper_id}\n\n'

        # Decisions
        note += '## Entscheidungen\n\n'
        note += f'| | Entscheidung |\n|---|---|\n'
        note += f'| **Human** | {row.get("human_decision", "")} |\n'
        note += f'| **LLM** | {row.get("agent_decision", "")} |\n'
        note += f'| **Typ** | {row.get("disagreement_type", "")} |\n'
        note += f'| **Schweregrad** | {row.get("severity", "")} |\n\n'

        # Category comparison
        note += '## Kategorie-Vergleich\n\n'
        note += '| Kategorie | Human | LLM | Divergent |\n'
        note += '|-----------|-------|-----|----------|\n'
        for cat in self.ASSESSMENT_CATEGORIES:
            h = row.get(f'human_{cat}', '')
            l = row.get(f'agent_{cat}', '')
            div = '**X**' if h != l else ''
            note += f'| {cat} | {h} | {l} | {div} |\n'
        note += '\n'

        # LLM Reasoning
        reasoning = row.get('agent_reasoning', '')
        if reasoning:
            note += '## LLM-Reasoning\n\n'
            note += f'> {reasoning[:800]}\n\n'

        # Divergence pattern
        note += '## Divergenz-Muster\n\n'
        note += f'**Pattern:** {classification.get("pattern", "nicht klassifiziert")}\n\n'
        justification = classification.get('justification', '')
        if justification:
            note += f'**Begruendung:** {justification}\n\n'

        # Annotation hint
        hint = row.get('annotation_hint', '')
        if hint:
            note += '## Annotation\n\n'
            note += f'{hint}\n\n'

        return note

    # -------------------------------------------------------------------
    # Step 1.8: MOC/Index notes + ZIP
    # -------------------------------------------------------------------

    def create_index_notes(self) -> Dict[str, str]:
        """Create MOC (Map of Content) index notes."""
        notes = {}

        # Master MOC
        master = f"""---
title: FemPrompt Promptotyping Vault
type: moc
tags: [moc, index, master]
---

# FemPrompt Promptotyping Vault

> Epistemische Infrastruktur fuer LLM-gestuetzte Wissensproduktion sichtbar machen.

## Navigation

- [[Papers Index]] -- {len(list(self.knowledge_dir.glob('*.md')))} Paper-Notes nach Jahr
- [[Concepts Index]] -- {len(self.concepts)} Konzept-Notes nach Haeufigkeit
- [[Divergenzen Index]] -- {len(self.divergence_classifications)} Divergenz-Faelle nach Muster
- [[Pipeline Index]] -- 5 Pipeline-Stufen mit Prompts und Limitationen

## Forschungsfrage

Wie laesst sich die epistemische Transformation von Wissen in einem LLM-gestuetzten Forschungsprozess sichtbar, navigierbar und auditierbar machen?

## Zahlen

| Metrik | Wert |
|--------|------|
| Papers im Korpus | 326 |
| Knowledge-Dokumente | 249 |
| Human-bewertet | {len(self.human_assessments)} |
| LLM-bewertet | {len(self.llm_assessments)} |
| Disagreements | {len(self.disagreements)} |
| Konzepte (freq >= 2) | {len(self.concepts)} |
| Cohen's Kappa | 0.035 (Prevalence-Bias-Artefakt) |

## Drei Haltungen

Jede Note in diesem Vault operiert auf drei Ebenen:

1. **Zeigen, was ist** -- Daten, Zahlen, Ergebnisse
2. **Zeigen, wie es entstanden ist** -- Prompts, Konfigurationen, Entscheidungen
3. **Zeigen, was nicht geht** -- Verluste, Luecken, nicht auditierbare Schritte
"""
        notes['MASTER_MOC'] = master

        # Papers Index
        papers_by_year: Dict[str, list] = defaultdict(list)
        for stem in sorted(self.knowledge_to_zotero.keys()):
            match_data = self.knowledge_to_zotero[stem]
            item = match_data.get('zotero_item', {})
            year = (item.get('date', '') or '').split('-')[0] or 'Unknown'
            title = item.get('title', stem)
            papers_by_year[year].append(self._safe_filename(title))

        pi = '---\ntitle: Papers Index\ntype: moc\ntags: [moc, papers]\n---\n\n'
        pi += '# Papers Index\n\n'
        for year in sorted(papers_by_year.keys(), reverse=True):
            pi += f'## {year}\n\n'
            for title in sorted(papers_by_year[year]):
                pi += f'- [[{title}]]\n'
            pi += '\n'
        notes['Papers_Index'] = pi

        # Concepts Index
        ci = '---\ntitle: Concepts Index\ntype: moc\ntags: [moc, concepts]\n---\n\n'
        ci += '# Concepts Index\n\n'
        ci += f'**{len(self.concepts)} Konzepte** mit Frequency >= 2\n\n'
        sorted_concepts = sorted(self.concepts.items(), key=lambda x: x[1]['frequency'], reverse=True)
        ci += '| Konzept | Frequency | Papers |\n|---------|-----------|--------|\n'
        for name, data in sorted_concepts:
            ci += f'| [[{name}]] | {data["frequency"]} | {len(data["papers"])} |\n'
        ci += '\n'
        notes['Concepts_Index'] = ci

        # Divergenzen Index
        di = '---\ntitle: Divergenzen Index\ntype: moc\ntags: [moc, divergenzen]\n---\n\n'
        di += '# Divergenzen Index\n\n'
        di += f'**{len(self.disagreements)} Disagreement-Faelle**\n\n'

        # Group by pattern
        by_pattern: Dict[str, list] = defaultdict(list)
        for row in self.disagreements:
            pid = row.get('paper_id', '')
            cls = self.divergence_classifications.get(pid, {})
            pattern = cls.get('pattern', 'unklassifiziert')
            by_pattern[pattern].append(row)

        for pattern, cases in sorted(by_pattern.items()):
            di += f'## {pattern} ({len(cases)})\n\n'
            for row in cases:
                pid = row.get('paper_id', '')
                author_year = row.get('author_year', '')
                safe_name = f"Divergenz_{pid}_{self._safe_filename(author_year)}"
                di += f'- [[{safe_name}]] -- {row.get("title", "")[:60]}\n'
            di += '\n'
        notes['Divergenzen_Index'] = di

        # Pipeline Index
        pli = '---\ntitle: Pipeline Index\ntype: moc\ntags: [moc, pipeline]\n---\n\n'
        pli += '# Pipeline Index\n\n'
        pli += '5 Stufen der Forschungspipeline:\n\n'
        pli += '1. [[Identifikation]] -- Deep Research, 326 Papers\n'
        pli += '2. [[Konversion]] -- PDF -> Markdown (Docling), 252/257\n'
        pli += '3. [[SKE]] -- 3-Stage Knowledge Extraction (LLM), 249 Docs\n'
        pli += '4. [[Assessment]] -- Dualer Pfad (Human + LLM), Benchmark\n'
        pli += '5. [[Synthese]] -- Vault-Generierung, deterministisch + LLM\n\n'
        pli += '```\n'
        pli += '326 Papers -> 257 PDFs -> 252 Markdown -> 249 Knowledge Docs\n'
        pli += '                                              |\n'
        pli += '                                    210 Human + 326 LLM Assessment\n'
        pli += '                                              |\n'
        pli += '                                    111 Disagreements\n'
        pli += '                                              |\n'
        pli += '                                    Vault (4 Dokumenttypen)\n'
        pli += '```\n'
        notes['Pipeline_Index'] = pli

        return notes

    def generate_vault_zip(self):
        """Create a ZIP of the vault for download."""
        zip_dir = self.base_path / 'docs' / 'downloads'
        zip_dir.mkdir(parents=True, exist_ok=True)
        zip_path = zip_dir / 'vault.zip'

        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
            for file_path in sorted(self.vault_path.rglob('*.md')):
                arcname = file_path.relative_to(self.vault_path)
                zf.write(file_path, arcname)

        size_mb = zip_path.stat().st_size / (1024 * 1024)
        print(f"  Vault ZIP: {zip_path} ({size_mb:.1f} MB)")

    # -------------------------------------------------------------------
    # Main orchestrator
    # -------------------------------------------------------------------

    def generate(self, clean: bool = False, skip_llm: bool = False):
        """Full generation pipeline."""
        print("\n" + "=" * 60)
        print("VAULT V2 GENERATOR")
        print("=" * 60 + "\n")

        # Setup
        self.setup_vault_structure(clean=clean)
        self.load_all_data()

        # LLM phases
        self.run_concept_extraction(skip_llm=skip_llm)
        self.run_divergence_classification(skip_llm=skip_llm)

        # Generate documents
        print("=" * 60)
        print("GENERATING VAULT DOCUMENTS")
        print("=" * 60)

        # Paper notes (Step 1.4)
        print("\n  [Papers] Generating paper notes...")
        paper_count = 0
        used_filenames: Dict[str, int] = {}  # Track collisions
        self._stem_to_vault_filename: Dict[str, str] = {}  # For cross-references
        knowledge_files = sorted(self.knowledge_dir.glob('*.md'))
        for kd_path in knowledge_files:
            stem = kd_path.stem
            note = self.create_paper_note(stem)

            # Filename from Zotero title (with collision handling)
            match_data = self.knowledge_to_zotero.get(stem, {})
            zotero_item = match_data.get('zotero_item', {})
            title = zotero_item.get('title', stem) or stem
            safe_title = self._safe_filename(title)

            # Handle filename collisions by appending stem suffix
            if safe_title in used_filenames:
                used_filenames[safe_title] += 1
                # Truncate title to leave room for suffix, keeping total under 150 chars
                truncated = safe_title[:100].rstrip('. ')
                safe_title = f"{truncated} ({stem[:40]})"
            else:
                used_filenames[safe_title] = 1

            self._stem_to_vault_filename[stem] = safe_title
            out_path = self.vault_path / 'Papers' / f'{safe_title}.md'
            out_path.write_text(note, encoding='utf-8')
            paper_count += 1

        print(f"    {paper_count} paper notes created")

        # Concept notes (Step 1.5)
        print("  [Concepts] Generating concept notes...")
        concept_count = 0
        for name, data in self.concepts.items():
            note = self.create_concept_note(name, data)
            safe_name = self._safe_filename(name)
            out_path = self.vault_path / 'Concepts' / f'{safe_name}.md'
            out_path.write_text(note, encoding='utf-8')
            concept_count += 1
        print(f"    {concept_count} concept notes created")

        # Pipeline notes (Step 1.6)
        print("  [Pipeline] Generating pipeline notes...")
        pipeline_notes = self.create_pipeline_notes()
        for name, content in pipeline_notes.items():
            out_path = self.vault_path / 'Pipeline' / f'{name}.md'
            out_path.write_text(content, encoding='utf-8')
        print(f"    {len(pipeline_notes)} pipeline notes created")

        # Divergence notes (Step 1.7)
        print("  [Divergenzen] Generating divergence notes...")
        div_count = 0
        for row in self.disagreements:
            note = self.create_divergenz_note(row)
            pid = row.get('paper_id', '')
            author_year = row.get('author_year', '')
            safe_name = f"Divergenz_{pid}_{self._safe_filename(author_year)}"
            out_path = self.vault_path / 'Divergenzen' / f'{safe_name}.md'
            out_path.write_text(note, encoding='utf-8')
            div_count += 1
        print(f"    {div_count} divergence notes created")

        # MOC/Index notes (Step 1.8)
        print("  [MOCs] Generating index notes...")
        index_notes = self.create_index_notes()
        # Master MOC at vault root
        (self.vault_path / 'MASTER_MOC.md').write_text(index_notes.pop('MASTER_MOC'), encoding='utf-8')
        for name, content in index_notes.items():
            out_path = self.vault_path / 'MOCs' / f'{name}.md'
            out_path.write_text(content, encoding='utf-8')
        print(f"    {len(index_notes) + 1} index notes created")

        # ZIP
        print("\n  [ZIP] Creating vault archive...")
        self.generate_vault_zip()

        # Summary
        print("\n" + "=" * 60)
        print("VAULT V2 GENERATION COMPLETE")
        print("=" * 60)
        print(f"  Papers:      {paper_count}")
        print(f"  Concepts:    {concept_count}")
        print(f"  Pipeline:    {len(pipeline_notes)}")
        print(f"  Divergenzen: {div_count}")
        print(f"  MOCs:        {len(index_notes) + 1}")
        print(f"  Location:    {self.vault_path}")
        print()


# ---------------------------------------------------------------------------
# CLI (Step 1.9)
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description='Generate Obsidian Vault v2 for Promptotyping'
    )
    parser.add_argument('--clean', action='store_true',
                        help='Delete existing vault before generation')
    parser.add_argument('--skip-llm', action='store_true',
                        help='Use cached LLM results (no API calls)')
    parser.add_argument('--cache-dir', default='.vault_cache',
                        help='Directory for LLM result cache (default: .vault_cache)')
    parser.add_argument('--base-path', default=None,
                        help='Repository root (auto-detected if not set)')
    args = parser.parse_args()

    base_path = Path(args.base_path) if args.base_path else None
    generator = VaultV2Generator(base_path=base_path, cache_dir=args.cache_dir)
    generator.generate(clean=args.clean, skip_llm=args.skip_llm)


if __name__ == '__main__':
    main()
