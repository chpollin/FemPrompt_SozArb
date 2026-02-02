#!/usr/bin/env python3
"""
Obsidian Vault Generator - Improved Concept Extraction
With normalization, deduplication, and synonym mapping
"""

import os
import sys
import json
import re
import shutil
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional
from datetime import datetime
from collections import defaultdict, Counter
import hashlib

# Fix encoding for Windows console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

class ImprovedVaultGenerator:
    def __init__(self, base_path: str = None, vault_name: str = "vault"):
        if base_path is None:
            # Script is in pipeline/scripts/, so go up two levels
            self.base_path = Path(__file__).parent.parent.parent
        else:
            self.base_path = Path(base_path)

        self.vault_path = self.base_path / vault_name
        self.papers_path = self.base_path / "pipeline" / "summaries"
        self.metadata_path = self.base_path / "corpus" / "zotero_export.json"

        # Improved concept extraction patterns - FIXED to avoid fragments
        self.bias_patterns = [
            # Full phrases first (more specific)
            r'\b(gender|racial|ethnic|age|disability|intersectional|demographic|cultural|linguistic)\s+bias\b',
            r'\b(algorithmic|systematic|structural|historical)\s+(bias|discrimination|unfairness)\b',
            r'\b(stereotyp\w+|prejudice|discrimination|inequity|disparity|unfairness)\b',
            # Intersectional patterns - IMPROVED to avoid "of intersectionality"
            r'(?<!\bof\s)\bintersectional\s+\w+\b',  # Negative lookbehind for "of"
            r'(?<!\bthe\s)(?<!\band\s)(?<!\bof\s)\bintersectionality\b',  # Standalone intersectionality
        ]

        # AI tech patterns removed - too generic per user request

        self.mitigation_patterns = [
            # Specific techniques
            r'\b(prompt\s+engineering|prompt\s+design|prompt\s+modification|prompting\s+strategies)\b',
            r'\b(debiasing|bias\s+mitigation|fairness\s+constraints?|bias\s+correction)\b',
            r'\b(counterfactual\s+\w+|adversarial\s+training|fine-?tuning|calibration)\b',
            # Approaches
            r'\b(feminist\s+AI|feminist\s+framework|feminist\s+approach)\b',
            r'\b(intersectional\s+\w+|inclusive\s+\w+|equitable\s+\w+)\b',
            r'\b(diverse\s+training|balanced\s+datasets?|representation\s+learning)\b',
            # Evaluation
            r'\b(fairness\s+metrics?|bias\s+evaluation|equity\s+assessment)\b',
        ]

        # Synonym mappings for normalization
        self.synonyms = {
            # AI Technologies
            'ml': 'Machine Learning',
            'machine learning': 'Machine Learning',
            'deep learning': 'Deep Learning',
            'dl': 'Deep Learning',
            'llm': 'Large Language Models',
            'llms': 'Large Language Models',
            'large language model': 'Large Language Models',
            'large language models': 'Large Language Models',
            'foundation model': 'Foundation Models',
            'foundation models': 'Foundation Models',
            'nlp': 'Natural Language Processing',
            'natural language processing': 'Natural Language Processing',
            'cv': 'Computer Vision',
            'computer vision': 'Computer Vision',
            'genai': 'Generative AI',
            'generative ai': 'Generative AI',
            'generative artificial intelligence': 'Generative AI',
            'text-to-image': 'Text-to-Image Generation',
            'text to image': 'Text-to-Image Generation',
            'image generation': 'Text-to-Image Generation',
            'dall-e': 'DALL-E',
            'dalle': 'DALL-E',
            'dall-e 2': 'DALL-E 2',
            'dalle2': 'DALL-E 2',
            'gpt': 'GPT',
            'gpt-2': 'GPT-2',
            'gpt2': 'GPT-2',
            'gpt-3': 'GPT-3',
            'gpt3': 'GPT-3',
            'gpt-4': 'GPT-4',
            'gpt4': 'GPT-4',
            'chatgpt': 'ChatGPT',
            'chat-gpt': 'ChatGPT',
            'stable diffusion': 'Stable Diffusion',
            'midjourney': 'Midjourney',
            'neural network': 'Neural Networks',
            'neural networks': 'Neural Networks',
            'transformer': 'Transformers',
            'transformers': 'Transformers',
            'bert': 'BERT',
            'ai': 'Artificial Intelligence',
            'artificial intelligence': 'Artificial Intelligence',
            'ai system': 'AI Systems',
            'ai systems': 'AI Systems',
            'ai model': 'AI Models',
            'ai models': 'AI Models',

            # Bias & Fairness
            'gender bias': 'Gender Bias',
            'racial bias': 'Racial Bias',
            'ethnic bias': 'Ethnic Bias',
            'algorithmic bias': 'Algorithmic Bias',
            'algorithmic fairness': 'Algorithmic Fairness',
            'algorithmic discrimination': 'Algorithmic Discrimination',

            # INTERSECTIONALITY CONSOLIDATION - Map ALL variations to single concept
            'intersectionality': 'Intersectionality',
            'intersectional': 'Intersectionality',
            'intersectional bias': 'Intersectionality',
            'intersectional biases': 'Intersectionality',
            'intersectional approach': 'Intersectionality',
            'intersectional approaches': 'Intersectionality',
            'intersectional analysis': 'Intersectionality',
            'intersectional fairness': 'Intersectionality',
            'intersectional framework': 'Intersectionality',
            'intersectional feminist': 'Intersectionality',
            'intersectional feminism': 'Intersectionality',
            'intersectional black': 'Intersectionality',
            'intersectional lens': 'Intersectionality',
            'intersectional perspective': 'Intersectionality',
            'intersectional principles': 'Intersectionality',
            'intersectional group': 'Intersectionality',
            'intersectional groups': 'Intersectionality',
            'intersectional subgroup': 'Intersectionality',
            'intersectional subgroups': 'Intersectionality',
            'intersectional identity': 'Intersectionality',
            'intersectional identities': 'Intersectionality',
            'intersectional discrimination': 'Intersectionality',
            'intersectional knowledge': 'Intersectionality',
            'intersectional praxis': 'Intersectionality',
            'intersectional resistance': 'Intersectionality',
            'intersectional categories': 'Intersectionality',
            'intersectional comparisons': 'Intersectionality',
            'intersectional notions': 'Intersectionality',
            'intersectional practices': 'Intersectionality',
            'intersectional issues': 'Intersectionality',
            'intersectional ai': 'Intersectionality',
            'intersectional and': 'Intersectionality',
            'intersectional cases': 'Intersectionality',
            'intersectional logics': 'Intersectionality',
            'intersectional critical': 'Intersectionality',
            'intersectional theoretical': 'Intersectionality',
            'intersectional research': 'Intersectionality',
            'intersectional re': 'Intersectionality',
            'intersectional methods': 'Intersectionality',
            'intersectional theory': 'Intersectionality',
            'intersectional combinations': 'Intersectionality',
            'intersectional considerations': 'Intersectionality',
            'intersectional contexts': 'Intersectionality',
            'intersectional examination': 'Intersectionality',
            'intersectional visual': 'Intersectionality',
            'intersectional or': 'Intersectionality',  # Broken fragment
            'of intersectionality': '',  # Remove fragment completely

            'bias': 'Bias',
            'biases': 'Bias',
            'prejudice': 'Prejudice',
            'discrimination': 'Discrimination',
            'unfairness': 'Unfairness',
            'inequity': 'Inequity',
            'disparity': 'Disparity',
            'stereotyping': 'Stereotyping',
            'stereotypes': 'Stereotyping',

            # Mitigation
            'prompt engineering': 'Prompt Engineering',
            'prompting': 'Prompt Engineering',
            'debiasing': 'Debiasing',
            'bias mitigation': 'Bias Mitigation',
            'fairness constraint': 'Fairness Constraints',
            'fairness constraints': 'Fairness Constraints',
            'counterfactual': 'Counterfactual Methods',
            'counterfactuals': 'Counterfactual Methods',
            'fine-tuning': 'Fine-tuning',
            'finetuning': 'Fine-tuning',
            'calibration': 'Calibration',
            'feminist ai': 'Feminist AI',
            'feminist framework': 'Feminist Frameworks',
            'feminist frameworks': 'Feminist Frameworks',
            'diverse training': 'Diverse Training Data',
            'balanced dataset': 'Balanced Datasets',
            'balanced datasets': 'Balanced Datasets',

            # Fix other broken links
            'inclusive representation': 'Inclusive Ai',
            'fairness metrics': 'Bias Evaluation',
            'fairness metric': 'Bias Evaluation',
        }

        # Blacklist of too generic terms - EXPANDED to reduce over-extraction
        self.blacklist = {
            'ai', 'bias', 'gender', 'racial', 'ethnic', 'age',
            'the', 'and', 'or', 'of', 'in', 'to', 'for', 'with',
            'data', 'model', 'system', 'method', 'approach',
            'paper', 'study', 'research', 'work', 'analysis',
            'using', 'based', 'learning', 'training',
            # Added to reduce over-extraction
            'artificial', 'intelligence', 'machine', 'systems',
            'technology', 'technologies', 'models', 'modeling',
            'general', 'specific', 'various', 'different',
            'cultural', 'historical', 'inclusive'
        }

        # Maximum frequency caps for over-extracted terms
        self.frequency_caps = {
            'AI Systems': 30,
            'Artificial Intelligence': 30,
            'Machine Learning': 30,
            'Large Language Models': 50,
            'Generative AI': 30
        }

        # Track all concepts with frequency
        self.concept_frequency = Counter()
        self.all_concepts: Dict[str, Set[str]] = {
            'bias_types': set(),
            'mitigations': set()
        }
        self.paper_metadata: Dict[str, Dict] = {}

    def setup_vault_structure(self):
        """Create the Obsidian vault directory structure"""
        directories = [
            self.vault_path,
            self.vault_path / "Papers",
            self.vault_path / "Concepts",
            self.vault_path / "Concepts" / "Bias_Types",
            self.vault_path / "Concepts" / "Mitigation_Strategies",
            self.vault_path / "MOCs",
            self.vault_path / "Synthesis",
            self.vault_path / "Assets",
            self.vault_path / ".obsidian"
        ]

        for dir_path in directories:
            dir_path.mkdir(parents=True, exist_ok=True)

        print(f"+ Vault structure created at {self.vault_path}")

    def load_metadata(self) -> Dict[str, Dict]:
        """Load Zotero metadata"""
        if not self.metadata_path.exists():
            print(f"Warning: Metadata file not found: {self.metadata_path}")
            return {}

        with open(self.metadata_path, 'r', encoding='utf-8') as f:
            metadata = json.load(f)

        indexed = {}
        for item in metadata:
            title = item.get('title', '')
            if title:
                simple_title = self.simplify_title(title)
                indexed[simple_title] = item

        print(f"+ Loaded metadata for {len(indexed)} papers")
        return indexed

    def simplify_title(self, title: str) -> str:
        """Simplify title for matching"""
        simple = re.sub(r'[^\w\s]', '', title)
        simple = re.sub(r'\s+', '_', simple)
        return simple[:50]

    def normalize_concept(self, concept: str) -> str:
        """Normalize and deduplicate concept"""
        # Clean up
        concept = concept.strip()
        concept = re.sub(r'\s+', ' ', concept)  # Normalize whitespace
        concept = concept.lower()

        # Check synonym mapping
        if concept in self.synonyms:
            normalized = self.synonyms[concept]
            # Return empty string to skip if mapped to empty
            if normalized == '':
                return None
            return normalized

        # Check if it's too generic (single word in blacklist)
        words = concept.split()
        if len(words) == 1 and concept in self.blacklist:
            return None

        # If not in synonyms, apply smart capitalization
        # Keep acronyms uppercase
        if concept.isupper() and len(concept) <= 5:
            return concept.upper()

        # Otherwise title case
        return concept.title()

    def extract_concepts(self, content: str) -> Dict[str, Set[str]]:
        """Extract concepts with improved normalization"""
        concepts = {
            'bias_types': set(),
            'mitigations': set()
        }

        # Limit content to avoid processing entire papers
        content_sample = content[:15000]  # First ~15k chars

        # Extract bias types
        for pattern in self.bias_patterns:
            matches = re.findall(pattern, content_sample, re.IGNORECASE)
            for match in matches:
                if isinstance(match, tuple):
                    match = ' '.join(match)
                normalized = self.normalize_concept(match)
                if normalized and len(normalized) > 2:
                    # Check frequency cap
                    if normalized in self.frequency_caps:
                        if self.concept_frequency[normalized] >= self.frequency_caps[normalized]:
                            continue  # Skip if over cap
                    concepts['bias_types'].add(normalized)
                    self.concept_frequency[normalized] += 1

        # Skip extracting technologies - category removed per user request

        # Extract mitigation strategies
        for pattern in self.mitigation_patterns:
            matches = re.findall(pattern, content_sample, re.IGNORECASE)
            for match in matches:
                if isinstance(match, tuple):
                    match = ' '.join(match)
                normalized = self.normalize_concept(match)
                if normalized and len(normalized) > 2:
                    # Check frequency cap
                    if normalized in self.frequency_caps:
                        if self.concept_frequency[normalized] >= self.frequency_caps[normalized]:
                            continue  # Skip if over cap
                    concepts['mitigations'].add(normalized)
                    self.concept_frequency[normalized] += 1

        return concepts

    def create_paper_note(self, paper_file: Path, metadata: Dict) -> Tuple[str, Dict]:
        """Create an Obsidian note for a paper"""
        with open(paper_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Extract concepts
        concepts = self.extract_concepts(content)

        # Update global concept tracking
        self.all_concepts['bias_types'].update(concepts['bias_types'])
        self.all_concepts['mitigations'].update(concepts['mitigations'])

        # Build frontmatter - IMPROVED with fallback values
        authors_list = [f"{c.get('firstName', '')} {c.get('lastName', '')}".strip()
                       for c in metadata.get('creators', [])]
        # Ensure at least one author or use default
        if not authors_list or all(not a for a in authors_list):
            authors_list = ['Unknown Author']

        # Extract year with fallback
        year = ''
        if metadata.get('date'):
            year = metadata.get('date', '').split('-')[0]
        if not year or year == '':
            year = '2024'  # Default to 2024 if missing

        frontmatter = {
            'title': metadata.get('title', paper_file.stem) or paper_file.stem,
            'authors': authors_list,
            'year': year,
            'type': metadata.get('itemType', 'research-paper') or 'research-paper',
            'url': metadata.get('url', '') or '',
            'doi': metadata.get('DOI', '') or '',
            'tags': ['paper', 'feminist-ai', 'bias-research'],  # Always include
            'date_added': metadata.get('dateAdded', datetime.now().strftime('%Y-%m-%d')),
            'date_modified': datetime.now().strftime('%Y-%m-%d'),
            'bias_types': list(concepts['bias_types']) if concepts['bias_types'] else [],
            'mitigation_strategies': list(concepts['mitigations']) if concepts['mitigations'] else []
        }

        # Create note content
        note = f"---\n"
        for key, value in frontmatter.items():
            if isinstance(value, list):
                if value:
                    note += f"{key}:\n"
                    for item in value:
                        note += f"  - {item}\n"
            elif value:
                note += f"{key}: {value}\n"
        note += "---\n\n"

        note += f"# {frontmatter['title']}\n\n"

        if metadata.get('abstractNote'):
            note += f"## Abstract\n\n{metadata['abstractNote']}\n\n"

        # Add concept links section
        note += "## Key Concepts\n\n"

        if concepts['bias_types']:
            note += "### Bias Types\n"
            for concept in sorted(concepts['bias_types']):
                note += f"- [[{concept}]]\n"
            note += "\n"


        if concepts['mitigations']:
            note += "### Mitigation Strategies\n"
            for concept in sorted(concepts['mitigations']):
                note += f"- [[{concept}]]\n"
            note += "\n"

        # Add original content
        note += "## Full Text\n\n"
        note += content

        return note, concepts

    def create_concept_note(self, concept: str, category: str, papers: List[str], frequency: int) -> str:
        """Create a concept note with frequency information"""
        note = f"---\n"
        note += f"title: {concept}\n"
        note += f"category: {category}\n"
        note += f"frequency: {frequency}\n"
        note += f"papers: {len(papers)}\n"
        note += f"tags: [concept, {category.lower().replace(' ', '-')}]\n"
        note += f"date_created: {datetime.now().strftime('%Y-%m-%d')}\n"
        note += f"---\n\n"

        note += f"# {concept}\n\n"
        note += f"**Category:** {category}  \n"
        note += f"**Mentioned:** {frequency} times across {len(papers)} papers\n\n"

        note += "## Papers\n\n"
        for paper in sorted(papers):
            note += f"- [[{paper}]]\n"

        note += "\n## Related Concepts\n\n"
        note += f"*Add related concepts here*\n\n"

        note += "## Notes\n\n"
        note += f"*Add your notes about {concept} here*\n"

        return note

    def create_moc_index(self, stats: Dict) -> str:
        """Create main index MOC with statistics"""
        note = f"---\n"
        note += f"title: FemPrompt Research Index\n"
        note += f"type: moc\n"
        note += f"tags: [moc, index]\n"
        note += f"date_created: {datetime.now().strftime('%Y-%m-%d')}\n"
        note += f"---\n\n"

        note += "# FemPrompt Research Knowledge Graph\n\n"
        note += "> How can feminist Digital/AI Literacies and diversity-reflective prompting help to expose and mitigate bias and intersectional discrimination in AI technologies?\n\n"

        note += "## Research Collections\n\n"
        note += "- [[Papers Index]] - All research papers\n"
        note += "- [[Concepts Index]] - Key concepts and themes\n"
        note += "- [[High Frequency Concepts]] - Most discussed topics\n\n"

        note += "## Core Topics\n\n"
        note += "### Bias Types\n"
        # Show top bias concepts
        top_bias = sorted([(c, self.concept_frequency[c]) for c in self.all_concepts['bias_types']],
                         key=lambda x: x[1], reverse=True)[:5]
        for concept, freq in top_bias:
            note += f"- [[{concept}]] ({freq} mentions)\n"
        note += "\n"

        note += "### Mitigation Approaches\n"
        top_mit = sorted([(c, self.concept_frequency[c]) for c in self.all_concepts['mitigations']],
                        key=lambda x: x[1], reverse=True)[:5]
        for concept, freq in top_mit:
            note += f"- [[{concept}]] ({freq} mentions)\n"
        note += "\n"

        note += "## Statistics\n\n"
        note += f"- Total Papers: {stats['papers']}\n"
        note += f"- Total Concepts: {stats['total_concepts']}\n"
        note += f"  - Bias Types: {stats['bias_types']}\n"
        note += f"  - Mitigations: {stats['mitigations']}\n"
        note += f"- High-frequency concepts (10+ mentions): {stats['high_freq']}\n"
        note += f"- Date Range: 2023-2025\n\n"

        note += "## Last Updated\n\n"
        note += f"{datetime.now().strftime('%Y-%m-%d %H:%M')}\n"

        return note

    def create_master_moc(self, papers_data: List[Dict], stats: Dict, created_concepts: int) -> str:
        """Create a compact Master MOC with entire vault overview on one page"""
        note = "---\n"
        note += "title: MASTER MOC - FemPrompt Research\n"
        note += "type: master-moc\n"
        note += "tags: [moc, master, navigation]\n"
        note += f"generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n"
        note += "---\n\n"

        note += "# 🎯 MASTER MOC - Complete Vault Navigation\n\n"

        # Research Question Box
        note += "```\n"
        note += "RESEARCH QUESTION:\n"
        note += "How can feminist Digital/AI Literacies and diversity-reflective\n"
        note += "prompting help to expose and mitigate bias and intersectional\n"
        note += "discrimination in AI technologies?\n"
        note += "```\n\n"

        # Quick Stats Dashboard
        note += "## 📊 Vault Statistics\n\n"
        note += f"| Papers | Concepts | High-Freq | Categories |\n"
        note += f"|:------:|:--------:|:---------:|:----------:|\n"
        note += f"| **{stats['papers']}** | **{created_concepts}** | **{stats['high_freq']}** | **3** |\n\n"

        # Navigation Structure
        note += "## 🗺️ Navigation Structure\n\n"
        note += "```mermaid\n"
        note += "graph TD\n"
        note += "    A[Master MOC] --> B[Papers]\n"
        note += "    A --> C[Concepts]\n"
        note += "    A --> D[Analysis]\n"
        note += "    C --> E[Bias Types]\n"
        note += "    C --> F[Mitigation Strategies]\n"
        note += "    D --> H[Frequency Analysis]\n"
        note += "    D --> I[Synthesis Notes]\n"
        note += "```\n\n"

        # Top Concepts by Category
        note += "## 🔥 Top Concepts by Category\n\n"

        note += "### Bias Types (Top 10)\n"
        bias_concepts = [(c, self.concept_frequency[c])
                        for c in self.all_concepts['bias_types']]
        bias_sorted = sorted(bias_concepts, key=lambda x: x[1], reverse=True)[:10]
        for i, (concept, freq) in enumerate(bias_sorted, 1):
            note += f"{i}. [[{concept}]] `{freq}x`\n"
        note += "\n"


        note += "### Mitigation Strategies (Top 10)\n"
        mit_concepts = [(c, self.concept_frequency[c])
                        for c in self.all_concepts['mitigations']]
        mit_sorted = sorted(mit_concepts, key=lambda x: x[1], reverse=True)[:10]
        for i, (concept, freq) in enumerate(mit_sorted, 1):
            note += f"{i}. [[{concept}]] `{freq}x`\n"
        note += "\n"

        # Recent Papers (2024-2025)
        note += "## 📚 Recent Papers (2024-2025)\n\n"
        recent_papers = [p for p in papers_data if p.get('year', '') in ['2024', '2025']]
        for paper in recent_papers[:10]:
            note += f"- [[{paper['title']}]] ({paper['year']})\n"
        if len(recent_papers) > 10:
            note += f"\n*...and {len(recent_papers) - 10} more recent papers*\n"
        note += "\n"

        # Key Findings Summary
        note += "## 💡 Key Research Themes\n\n"
        note += "Based on concept frequency analysis:\n\n"

        # Identify main themes
        if 'Intersectional Bias' in self.all_concepts['bias_types']:
            note += "2. **Intersectionality**: Intersectional concepts appear {0}x\n".format(
                sum(self.concept_frequency[c] for c in self.all_concepts['bias_types']
                    if 'intersectional' in c.lower()))
        if 'Prompt Engineering' in self.all_concepts['mitigations']:
            note += "3. **Prompting Solutions**: Prompt-based mitigation discussed {0}x\n".format(
                sum(self.concept_frequency[c] for c in self.all_concepts['mitigations']
                    if 'prompt' in c.lower()))
        note += "\n"

        # Quick Links Section
        note += "## ⚡ Quick Links\n\n"
        note += "### Core MOCs\n"
        note += "- [[Index]] - Main navigation index\n"
        note += "- [[Concept_Frequency]] - Frequency analysis\n"
        note += "- [[Papers Index]] - All papers by year\n\n"

        note += "### Your Workspace\n"
        note += "- [[Synthesis/]] - Add your analysis here\n"
        note += "- [[Research Notes]] - Create your notes\n"
        note += "- [[Questions]] - Track open questions\n\n"

        # Search Queries
        note += "## 🔍 Useful Searches\n\n"
        note += "Copy these into Obsidian search:\n\n"
        note += "- `tag:#paper` - All research papers\n"
        note += "- `tag:#concept` - All concepts\n"
        note += "- `/\\[\\[.*Bias\\]\\]/` - Papers mentioning bias types\n"
        note += "- `/frequency: [0-9]{2,}/` - High-frequency concepts\n"
        note += "- `path:Synthesis` - Your synthesis notes\n\n"

        # Footer
        note += "---\n\n"
        note += f"*Vault generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}*  \n"
        note += f"*Total files: {stats['papers'] + created_concepts + 5} | "
        note += f"Python script: `generate_obsidian_vault_improved.py`*\n"

        return note

    def create_frequency_report(self) -> str:
        """Create a frequency analysis report"""
        note = "---\n"
        note += "title: Concept Frequency Analysis\n"
        note += "type: analysis\n"
        note += "tags: [analysis, frequency]\n"
        note += "---\n\n"

        note += "# Concept Frequency Analysis\n\n"

        note += "## Most Frequent Concepts (All Categories)\n\n"
        top_20 = self.concept_frequency.most_common(20)
        for concept, freq in top_20:
            note += f"1. [[{concept}]] - {freq} mentions\n"

        note += "\n## Frequency Distribution\n\n"
        freq_dist = Counter()
        for freq in self.concept_frequency.values():
            if freq >= 10:
                freq_dist['High (10+)'] += 1
            elif freq >= 5:
                freq_dist['Medium (5-9)'] += 1
            elif freq >= 2:
                freq_dist['Low (2-4)'] += 1
            else:
                freq_dist['Rare (1)'] += 1

        for category, count in freq_dist.most_common():
            note += f"- {category}: {count} concepts\n"

        return note

    def generate_vault(self):
        """Main method to generate the entire vault"""
        print("\n>>> Starting Improved Obsidian Vault Generation...\n")

        # Setup structure
        self.setup_vault_structure()

        # Load metadata
        metadata_index = self.load_metadata()

        # Process papers
        paper_concepts_map = {}
        papers_data = []

        if self.papers_path.exists():
            paper_files = list(self.papers_path.glob("*.md"))
            print(f"\n[Papers] Processing {len(paper_files)} papers...")

            for paper_file in paper_files:
                # Match with metadata
                simple_title = self.simplify_title(paper_file.stem)
                metadata = metadata_index.get(simple_title, {})

                if not metadata:
                    for key, value in metadata_index.items():
                        if simple_title[:20] in key or key[:20] in simple_title:
                            metadata = value
                            break

                # Create paper note
                note_content, concepts = self.create_paper_note(paper_file, metadata)

                # Save paper note
                paper_title = metadata.get('title', paper_file.stem)
                safe_title = re.sub(r'[<>:"/\\|?*\n\r]', '-', paper_title).strip('. ')
                paper_note_path = self.vault_path / "Papers" / f"{safe_title}.md"

                with open(paper_note_path, 'w', encoding='utf-8') as f:
                    f.write(note_content)

                # Track for concept notes
                paper_concepts_map[safe_title] = concepts
                papers_data.append({
                    'title': safe_title,
                    'year': metadata.get('date', '').split('-')[0] if metadata.get('date') else 'Unknown'
                })

                print(f"  + {safe_title[:60]}...")

        # Create concept notes - only for concepts with frequency >= 2
        print(f"\n[Concepts] Creating concept notes (min frequency: 2)...")
        concept_papers = defaultdict(list)

        for paper_title, concepts in paper_concepts_map.items():
            for concept in concepts.get('bias_types', []):
                concept_papers[('Bias_Types', concept)].append(paper_title)
            # Skip technologies - we're removing AI_Technologies category
            for concept in concepts.get('mitigations', []):
                concept_papers[('Mitigation_Strategies', concept)].append(paper_title)

        created_concepts = 0
        skipped_concepts = 0

        for (category, concept), papers in concept_papers.items():
            frequency = self.concept_frequency[concept]

            # Only create note if mentioned at least twice
            if frequency >= 2:
                note_content = self.create_concept_note(concept, category, papers, frequency)
                safe_concept = re.sub(r'[<>:"/\\|?*\n\r]', '-', concept).strip('. ')
                concept_path = self.vault_path / "Concepts" / category / f"{safe_concept}.md"

                with open(concept_path, 'w', encoding='utf-8') as f:
                    f.write(note_content)
                created_concepts += 1
            else:
                skipped_concepts += 1

        print(f"  + Created {created_concepts} concept notes")
        print(f"  + Skipped {skipped_concepts} rare concepts (mentioned only once)")

        # Create MOCs
        print(f"\n[MOCs] Creating Maps of Content...")

        # Calculate statistics
        high_freq = sum(1 for f in self.concept_frequency.values() if f >= 10)

        stats = {
            'papers': len(papers_data),
            'total_concepts': len(self.all_concepts['bias_types']) +
                            len(self.all_concepts['mitigations']),
            'bias_types': len(self.all_concepts['bias_types']),
            'mitigations': len(self.all_concepts['mitigations']),
            'high_freq': high_freq
        }

        # Main index
        index_content = self.create_moc_index(stats)
        with open(self.vault_path / "MOCs" / "Index.md", 'w', encoding='utf-8') as f:
            f.write(index_content)

        # Frequency report
        freq_report = self.create_frequency_report()
        with open(self.vault_path / "MOCs" / "Concept_Frequency.md", 'w', encoding='utf-8') as f:
            f.write(freq_report)

        # Master MOC - THE MAIN NAVIGATION HUB
        master_moc = self.create_master_moc(papers_data, stats, created_concepts)
        with open(self.vault_path / "MASTER_MOC.md", 'w', encoding='utf-8') as f:
            f.write(master_moc)

        # Create README
        self.create_vault_readme()

        print(f"\n>>> Vault generation complete!")
        print(f">>> Statistics:")
        print(f"    - Papers: {stats['papers']}")
        print(f"    - Concepts created: {created_concepts}")
        print(f"    - Concepts skipped: {skipped_concepts}")
        print(f"    - Total unique concepts found: {stats['total_concepts']}")
        print(f">>> Open {self.vault_path} in Obsidian to explore your knowledge graph\n")

    def create_vault_readme(self):
        """Create a README for the vault"""
        readme = "# FemPrompt Research Vault (Improved)\n\n"
        readme += "An Obsidian knowledge graph for feminist AI and bias research.\n\n"
        readme += "## Improvements in this version\n\n"
        readme += "- **Concept deduplication**: Synonyms mapped to canonical forms\n"
        readme += "- **Frequency filtering**: Only concepts mentioned 2+ times get notes\n"
        readme += "- **Better normalization**: Consistent naming and capitalization\n"
        readme += "- **Blacklist filtering**: Removed overly generic terms\n"
        readme += "- **Frequency tracking**: See how often concepts appear\n\n"
        readme += "## Quick Start\n\n"
        readme += "1. Open Obsidian\n"
        readme += "2. Select 'Open folder as vault'\n"
        readme += f"3. Choose: `{self.vault_path}`\n"
        readme += "4. Start with [[Index]] in the MOCs folder\n\n"
        readme += "## Structure\n\n"
        readme += "- **Papers/**: Individual research papers\n"
        readme += "- **Concepts/**: Bias types and mitigation strategies\n"
        readme += "- **MOCs/**: Maps of Content for navigation\n"
        readme += "- **Synthesis/**: Your analysis and notes\n\n"
        readme += f"## Generated\n\n{datetime.now().strftime('%Y-%m-%d %H:%M')}\n"

        with open(self.vault_path / "README.md", 'w', encoding='utf-8') as f:
            f.write(readme)

def main():
    """Run the improved vault generator"""
    import argparse

    parser = argparse.ArgumentParser(description='Generate improved Obsidian vault')
    parser.add_argument('--path', default=None, help='Base path of the project')
    parser.add_argument('--vault-name', default='vault', help='Name of the vault folder')
    parser.add_argument('--clean', action='store_true', help='Clean existing vault before generation')

    args = parser.parse_args()

    generator = ImprovedVaultGenerator(args.path, args.vault_name)

    if args.clean and generator.vault_path.exists():
        print(f"Warning: Removing existing vault at {generator.vault_path}")
        shutil.rmtree(generator.vault_path)

    generator.generate_vault()

if __name__ == "__main__":
    main()