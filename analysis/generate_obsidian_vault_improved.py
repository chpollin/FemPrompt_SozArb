#!/usr/bin/env python3
"""
Obsidian Vault Generator - Improved Concept Extraction
With normalization, deduplication, and synonym mapping
"""

import os
import json
import re
import shutil
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional
from datetime import datetime
from collections import defaultdict, Counter
import hashlib

class ImprovedVaultGenerator:
    def __init__(self, base_path: str = None, vault_name: str = "FemPrompt_Vault"):
        if base_path is None:
            self.base_path = Path(__file__).parent.parent
        else:
            self.base_path = Path(base_path)

        self.vault_path = self.base_path / vault_name
        self.papers_path = self.base_path / "analysis" / "markdown_papers"
        self.metadata_path = self.base_path / "analysis" / "zotero_vereinfacht.json"

        # Improved concept extraction patterns
        self.bias_patterns = [
            # Full phrases first (more specific)
            r'\b(gender|racial|ethnic|age|disability|intersectional|demographic|cultural|linguistic)\s+bias\b',
            r'\b(algorithmic|systematic|structural|historical)\s+(bias|discrimination|unfairness)\b',
            r'\b(stereotyp\w+|prejudice|discrimination|inequity|disparity|unfairness)\b',
            # Intersectional patterns
            r'\bintersectional\s+\w+\b',
            r'\b\w+\s+intersectionality\b',
        ]

        self.ai_tech_patterns = [
            # Specific models/systems
            r'\b(GPT-?[234]?|DALL-?E\s*2?|Stable\s+Diffusion|Midjourney|Claude|Gemini|BERT|T5|LLaMA)\b',
            # General AI terms
            r'\b(large\s+language\s+models?|LLMs?|foundation\s+models?)\b',
            r'\b(text-to-image|image\s+generation|generative\s+AI|GenAI)\b',
            r'\b(machine\s+learning|deep\s+learning|neural\s+networks?|transformers?)\b',
            r'\b(computer\s+vision|NLP|natural\s+language\s+processing)\b',
            # Variations
            r'\b(artificial\s+intelligence|AI\s+systems?|AI\s+models?)\b',
        ]

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
            'intersectional bias': 'Intersectional Bias',
            'intersectionality': 'Intersectionality',
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
        }

        # Blacklist of too generic terms
        self.blacklist = {
            'ai', 'bias', 'gender', 'racial', 'ethnic', 'age',
            'the', 'and', 'or', 'of', 'in', 'to', 'for', 'with',
            'data', 'model', 'system', 'method', 'approach',
            'paper', 'study', 'research', 'work', 'analysis',
            'using', 'based', 'learning', 'training',
        }

        # Track all concepts with frequency
        self.concept_frequency = Counter()
        self.all_concepts: Dict[str, Set[str]] = {
            'bias_types': set(),
            'technologies': set(),
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
            self.vault_path / "Concepts" / "AI_Technologies",
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
            return self.synonyms[concept]

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
            'technologies': set(),
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
                    concepts['bias_types'].add(normalized)
                    self.concept_frequency[normalized] += 1

        # Extract technologies
        for pattern in self.ai_tech_patterns:
            matches = re.findall(pattern, content_sample, re.IGNORECASE)
            for match in matches:
                if isinstance(match, tuple):
                    match = ' '.join(match)
                normalized = self.normalize_concept(match)
                if normalized and len(normalized) > 2:
                    concepts['technologies'].add(normalized)
                    self.concept_frequency[normalized] += 1

        # Extract mitigation strategies
        for pattern in self.mitigation_patterns:
            matches = re.findall(pattern, content_sample, re.IGNORECASE)
            for match in matches:
                if isinstance(match, tuple):
                    match = ' '.join(match)
                normalized = self.normalize_concept(match)
                if normalized and len(normalized) > 2:
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
        self.all_concepts['technologies'].update(concepts['technologies'])
        self.all_concepts['mitigations'].update(concepts['mitigations'])

        # Build frontmatter
        frontmatter = {
            'title': metadata.get('title', paper_file.stem),
            'authors': [f"{c.get('firstName', '')} {c.get('lastName', '')}"
                       for c in metadata.get('creators', [])],
            'year': metadata.get('date', '').split('-')[0] if metadata.get('date') else '',
            'type': metadata.get('itemType', 'paper'),
            'url': metadata.get('url', ''),
            'doi': metadata.get('DOI', ''),
            'tags': ['paper', 'feminist-ai', 'bias-research'],
            'date_added': metadata.get('dateAdded', ''),
            'date_modified': datetime.now().strftime('%Y-%m-%d'),
            'bias_types': list(concepts['bias_types']),
            'ai_technologies': list(concepts['technologies']),
            'mitigation_strategies': list(concepts['mitigations'])
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

        if concepts['technologies']:
            note += "### AI Technologies\n"
            for concept in sorted(concepts['technologies']):
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

        note += "### AI Technologies\n"
        top_tech = sorted([(c, self.concept_frequency[c]) for c in self.all_concepts['technologies']],
                         key=lambda x: x[1], reverse=True)[:5]
        for concept, freq in top_tech:
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
        note += f"  - Technologies: {stats['technologies']}\n"
        note += f"  - Mitigations: {stats['mitigations']}\n"
        note += f"- High-frequency concepts (10+ mentions): {stats['high_freq']}\n"
        note += f"- Date Range: 2023-2025\n\n"

        note += "## Last Updated\n\n"
        note += f"{datetime.now().strftime('%Y-%m-%d %H:%M')}\n"

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
            for concept in concepts.get('technologies', []):
                concept_papers[('AI_Technologies', concept)].append(paper_title)
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
                            len(self.all_concepts['technologies']) +
                            len(self.all_concepts['mitigations']),
            'bias_types': len(self.all_concepts['bias_types']),
            'technologies': len(self.all_concepts['technologies']),
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
        readme += "- **Concepts/**: Bias types, AI technologies, mitigation strategies\n"
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
    parser.add_argument('--vault-name', default='FemPrompt_Vault_Improved', help='Name of the vault folder')
    parser.add_argument('--clean', action='store_true', help='Clean existing vault before generation')

    args = parser.parse_args()

    generator = ImprovedVaultGenerator(args.path, args.vault_name)

    if args.clean and generator.vault_path.exists():
        print(f"Warning: Removing existing vault at {generator.vault_path}")
        shutil.rmtree(generator.vault_path)

    generator.generate_vault()

if __name__ == "__main__":
    main()