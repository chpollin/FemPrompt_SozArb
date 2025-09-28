#!/usr/bin/env python3
"""
Obsidian Vault Generator for FemPrompt_SozArb Literature Review
Transforms markdown papers and Zotero metadata into a structured knowledge graph
"""

import os
import json
import re
import shutil
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional
from datetime import datetime
from collections import defaultdict
import hashlib

class ObsidianVaultGenerator:
    def __init__(self, base_path: str = None, vault_name: str = "FemPrompt_Vault"):
        if base_path is None:
            # Get the parent directory of the analysis folder
            self.base_path = Path(__file__).parent.parent
        else:
            self.base_path = Path(base_path)

        self.vault_path = self.base_path / vault_name
        self.papers_path = self.base_path / "analysis" / "markdown_papers"
        self.metadata_path = self.base_path / "analysis" / "zotero_vereinfacht.json"

        # Concept extraction patterns
        self.bias_patterns = [
            r'\b(gender|racial|ethnic|age|disability|intersectional|demographic|stereotyp\w+)\s+bias\b',
            r'\b(discrimination|prejudice|unfairness|inequity|disparity)\b',
            r'\balgorithmic\s+(bias|fairness|discrimination)\b'
        ]

        self.ai_tech_patterns = [
            r'\b(GPT-?\d*|DALL-?E|Stable\s+Diffusion|Midjourney|Claude|Gemini|LLM|BERT|transformer)\b',
            r'\b(machine\s+learning|deep\s+learning|neural\s+network|AI\s+model|generative\s+AI)\b',
            r'\b(computer\s+vision|NLP|natural\s+language\s+processing|image\s+generation)\b'
        ]

        self.mitigation_patterns = [
            r'\b(debiasing|fairness\s+constraint|prompt\s+engineering|diverse\s+training)\b',
            r'\b(counterfactual|adversarial\s+training|fine-tuning|calibration)\b',
            r'\b(feminist\s+\w+|intersectional\s+\w+|inclusive\s+\w+)\b'
        ]

        # Track all concepts for cross-linking
        self.all_concepts: Set[str] = set()
        self.all_authors: Dict[str, List[str]] = defaultdict(list)
        self.paper_metadata: Dict[str, Dict] = {}

    def setup_vault_structure(self):
        """Create the Obsidian vault directory structure"""
        directories = [
            self.vault_path,
            self.vault_path / "Papers",
            self.vault_path / "Concepts",
            self.vault_path / "Concepts" / "Bias Types",
            self.vault_path / "Concepts" / "AI Technologies",
            self.vault_path / "Concepts" / "Mitigation Strategies",
            self.vault_path / "Authors",
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

        # Index by title for matching with markdown files
        indexed = {}
        for item in metadata:
            title = item.get('title', '')
            if title:
                # Create simplified title for matching
                simple_title = self.simplify_title(title)
                indexed[simple_title] = item

                # Extract authors
                for creator in item.get('creators', []):
                    author_name = f"{creator.get('firstName', '')} {creator.get('lastName', '')}".strip()
                    if author_name:
                        self.all_authors[author_name].append(title)

        print(f"+ Loaded metadata for {len(indexed)} papers")
        return indexed

    def simplify_title(self, title: str) -> str:
        """Simplify title for matching"""
        # Remove special characters and normalize spaces
        simple = re.sub(r'[^\w\s]', '', title)
        simple = re.sub(r'\s+', '_', simple)
        return simple[:50]  # Truncate for matching

    def extract_concepts(self, content: str) -> Dict[str, Set[str]]:
        """Extract concepts from paper content"""
        concepts = {
            'bias_types': set(),
            'ai_technologies': set(),
            'mitigation_strategies': set()
        }

        # Extract bias types
        for pattern in self.bias_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            for match in matches:
                if isinstance(match, tuple):
                    match = ' '.join(match)
                concept = match.strip().title()
                concepts['bias_types'].add(concept)
                self.all_concepts.add(concept)

        # Extract AI technologies
        for pattern in self.ai_tech_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            for match in matches:
                if isinstance(match, tuple):
                    match = ' '.join(match)
                concept = match.strip()
                # Preserve common acronyms
                if concept.upper() in ['GPT', 'BERT', 'NLP', 'AI', 'LLM']:
                    concept = concept.upper()
                elif 'GPT' in concept.upper():
                    concept = concept.upper().replace('GPT', 'GPT-')
                else:
                    concept = concept.title()
                concepts['ai_technologies'].add(concept)
                self.all_concepts.add(concept)

        # Extract mitigation strategies
        for pattern in self.mitigation_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            for match in matches:
                if isinstance(match, tuple):
                    match = ' '.join(match)
                concept = match.strip().title()
                concepts['mitigation_strategies'].add(concept)
                self.all_concepts.add(concept)

        return concepts

    def create_paper_note(self, paper_file: Path, metadata: Dict) -> Tuple[str, Dict]:
        """Create an Obsidian note for a paper"""
        with open(paper_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Extract concepts
        concepts = self.extract_concepts(content)

        # Build frontmatter
        frontmatter = {
            'title': metadata.get('title', paper_file.stem),
            'authors': [f"[[{c.get('firstName', '')} {c.get('lastName', '')}]]"
                       for c in metadata.get('creators', [])],
            'year': metadata.get('date', '').split('-')[0] if metadata.get('date') else '',
            'type': metadata.get('itemType', 'paper'),
            'url': metadata.get('url', ''),
            'doi': metadata.get('DOI', ''),
            'tags': ['paper', 'feminist-ai', 'bias-research'],
            'date_added': metadata.get('dateAdded', ''),
            'date_modified': datetime.now().strftime('%Y-%m-%d'),
            'bias_types': list(concepts['bias_types']),
            'ai_technologies': list(concepts['ai_technologies']),
            'mitigation_strategies': list(concepts['mitigation_strategies'])
        }

        # Create note content
        note = f"---\n"
        for key, value in frontmatter.items():
            if isinstance(value, list):
                if value:  # Only include if list is not empty
                    note += f"{key}:\n"
                    for item in value:
                        note += f"  - {item}\n"
            elif value:  # Only include if value exists
                note += f"{key}: {value}\n"
        note += "---\n\n"

        # Add paper metadata section
        note += f"# {frontmatter['title']}\n\n"

        if metadata.get('abstractNote'):
            note += f"## Abstract\n\n{metadata['abstractNote']}\n\n"

        # Add concept links section
        note += "## Key Concepts\n\n"

        if concepts['bias_types']:
            note += "### Bias Types\n"
            for concept in concepts['bias_types']:
                note += f"- [[{concept}]]\n"
            note += "\n"

        if concepts['ai_technologies']:
            note += "### AI Technologies\n"
            for concept in concepts['ai_technologies']:
                note += f"- [[{concept}]]\n"
            note += "\n"

        if concepts['mitigation_strategies']:
            note += "### Mitigation Strategies\n"
            for concept in concepts['mitigation_strategies']:
                note += f"- [[{concept}]]\n"
            note += "\n"

        # Add original content
        note += "## Full Text\n\n"
        note += content

        return note, concepts

    def create_concept_note(self, concept: str, category: str, papers: List[str]) -> str:
        """Create a concept note"""
        note = f"---\n"
        note += f"title: {concept}\n"
        note += f"category: {category}\n"
        note += f"tags: [concept, {category.lower().replace(' ', '-')}]\n"
        note += f"date_created: {datetime.now().strftime('%Y-%m-%d')}\n"
        note += f"---\n\n"

        note += f"# {concept}\n\n"
        note += f"A {category.lower()} concept appearing in feminist AI and bias research.\n\n"

        note += "## Mentioned in Papers\n\n"
        for paper in papers:
            note += f"- [[{paper}]]\n"

        note += "\n## Related Concepts\n\n"
        note += f"*Add related concepts here*\n\n"

        note += "## Notes\n\n"
        note += f"*Add your notes about {concept} here*\n"

        return note

    def create_author_note(self, author: str, papers: List[str]) -> str:
        """Create an author profile note"""
        note = f"---\n"
        note += f"title: {author}\n"
        note += f"type: author\n"
        note += f"tags: [author, researcher]\n"
        note += f"---\n\n"

        note += f"# {author}\n\n"

        note += "## Publications in This Collection\n\n"
        for paper in papers:
            note += f"- [[{paper}]]\n"

        note += "\n## Research Focus\n\n"
        note += "*Add research focus areas*\n\n"

        note += "## Collaborators\n\n"
        note += "*Add frequent collaborators*\n"

        return note

    def create_moc_index(self) -> str:
        """Create main index MOC (Map of Content)"""
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
        note += "- [[Authors Index]] - Researcher profiles\n"
        note += "- [[Concepts Index]] - Key concepts and themes\n\n"

        note += "## Core Topics\n\n"
        note += "### Bias Types\n"
        note += "- [[Gender Bias]]\n"
        note += "- [[Racial Bias]]\n"
        note += "- [[Intersectional Bias]]\n\n"

        note += "### AI Technologies\n"
        note += "- [[Large Language Models]]\n"
        note += "- [[Image Generation]]\n"
        note += "- [[Stable Diffusion]]\n\n"

        note += "### Mitigation Approaches\n"
        note += "- [[Prompt Engineering]]\n"
        note += "- [[Debiasing Techniques]]\n"
        note += "- [[Feminist AI Frameworks]]\n\n"

        note += "## Statistics\n\n"
        note += f"- Total Papers: {len(self.paper_metadata)}\n"
        note += f"- Authors: {len(self.all_authors)}\n"
        note += f"- Concepts: {len(self.all_concepts)}\n"
        note += f"- Date Range: 2023-2025\n\n"

        note += "## Last Updated\n\n"
        note += f"{datetime.now().strftime('%Y-%m-%d %H:%M')}\n"

        return note

    def create_papers_index(self, papers: List[Dict]) -> str:
        """Create papers index"""
        note = "---\n"
        note += "title: Papers Index\n"
        note += "type: moc\n"
        note += "tags: [moc, papers-index]\n"
        note += "---\n\n"

        note += "# All Research Papers\n\n"

        # Group by year
        papers_by_year = defaultdict(list)
        for paper in papers:
            year = paper.get('year', 'Unknown')
            papers_by_year[year].append(paper)

        for year in sorted(papers_by_year.keys(), reverse=True):
            note += f"## {year}\n\n"
            for paper in papers_by_year[year]:
                note += f"- [[{paper['title']}]]\n"
            note += "\n"

        return note

    def generate_vault(self):
        """Main method to generate the entire vault"""
        print("\n>>> Starting Obsidian Vault Generation...\n")

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
                    # Try to find by partial match
                    for key, value in metadata_index.items():
                        if simple_title[:20] in key or key[:20] in simple_title:
                            metadata = value
                            break

                # Create paper note
                note_content, concepts = self.create_paper_note(paper_file, metadata)

                # Save paper note
                paper_title = metadata.get('title', paper_file.stem)
                # Sanitize filename - replace invalid characters
                safe_title = re.sub(r'[<>:"/\\|?*]', '-', paper_title)
                safe_title = safe_title.strip('. ')  # Remove trailing dots and spaces
                paper_note_path = self.vault_path / "Papers" / f"{safe_title}.md"

                with open(paper_note_path, 'w', encoding='utf-8') as f:
                    f.write(note_content)

                # Track for concept notes
                paper_concepts_map[paper_title] = concepts
                papers_data.append({
                    'title': paper_title,
                    'year': metadata.get('date', '').split('-')[0] if metadata.get('date') else 'Unknown'
                })

                print(f"  + {paper_title}")

        # Create concept notes
        print(f"\n[Concepts] Creating concept notes...")
        concept_papers = defaultdict(list)

        for paper_title, concepts in paper_concepts_map.items():
            for concept in concepts.get('bias_types', []):
                concept_papers[('Bias Types', concept)].append(paper_title)
            for concept in concepts.get('ai_technologies', []):
                concept_papers[('AI Technologies', concept)].append(paper_title)
            for concept in concepts.get('mitigation_strategies', []):
                concept_papers[('Mitigation Strategies', concept)].append(paper_title)

        for (category, concept), papers in concept_papers.items():
            note_content = self.create_concept_note(concept, category, papers)
            # Sanitize concept name for filename
            safe_concept = re.sub(r'[<>:"/\\|?*\n\r]', '-', concept)
            safe_concept = safe_concept.strip('. ')
            concept_path = self.vault_path / "Concepts" / category / f"{safe_concept}.md"

            with open(concept_path, 'w', encoding='utf-8') as f:
                f.write(note_content)

        print(f"  + Created {len(concept_papers)} concept notes")

        # Create author notes
        print(f"\n[Authors] Creating author notes...")
        for author, papers in self.all_authors.items():
            if author.strip():
                note_content = self.create_author_note(author, papers)
                author_path = self.vault_path / "Authors" / f"{author}.md"

                with open(author_path, 'w', encoding='utf-8') as f:
                    f.write(note_content)

        print(f"  + Created {len(self.all_authors)} author notes")

        # Create MOCs
        print(f"\n[MOCs] Creating Maps of Content...")

        # Main index
        index_content = self.create_moc_index()
        with open(self.vault_path / "MOCs" / "Index.md", 'w', encoding='utf-8') as f:
            f.write(index_content)

        # Papers index
        papers_index_content = self.create_papers_index(papers_data)
        with open(self.vault_path / "MOCs" / "Papers Index.md", 'w', encoding='utf-8') as f:
            f.write(papers_index_content)

        print(f"  + Created MOC index files")

        # Create README
        self.create_vault_readme()

        print(f"\n>>> Vault generation complete!")
        print(f">>> Open {self.vault_path} in Obsidian to explore your knowledge graph\n")

    def create_vault_readme(self):
        """Create a README for the vault"""
        readme = "# FemPrompt Research Vault\n\n"
        readme += "An Obsidian knowledge graph for feminist AI and bias research.\n\n"
        readme += "## Quick Start\n\n"
        readme += "1. Open Obsidian\n"
        readme += "2. Select 'Open folder as vault'\n"
        readme += f"3. Choose: `{self.vault_path}`\n"
        readme += "4. Start with [[Index]] in the MOCs folder\n\n"
        readme += "## Structure\n\n"
        readme += "- **Papers/**: Individual research papers\n"
        readme += "- **Concepts/**: Bias types, AI technologies, mitigation strategies\n"
        readme += "- **Authors/**: Researcher profiles\n"
        readme += "- **MOCs/**: Maps of Content for navigation\n"
        readme += "- **Synthesis/**: Your analysis and notes\n\n"
        readme += "## Navigation Tips\n\n"
        readme += "- Use the Graph View to explore connections\n"
        readme += "- Command+Click (Ctrl+Click) to open links\n"
        readme += "- Use tags to filter content\n"
        readme += "- Create new synthesis notes as you research\n\n"
        readme += f"## Generated\n\n{datetime.now().strftime('%Y-%m-%d %H:%M')}\n"

        with open(self.vault_path / "README.md", 'w', encoding='utf-8') as f:
            f.write(readme)

def main():
    """Run the vault generator"""
    import argparse

    parser = argparse.ArgumentParser(description='Generate Obsidian vault from research papers')
    parser.add_argument('--path', default=None, help='Base path of the project (default: parent of analysis folder)')
    parser.add_argument('--vault-name', default='FemPrompt_Vault', help='Name of the vault folder')
    parser.add_argument('--clean', action='store_true', help='Clean existing vault before generation')

    args = parser.parse_args()

    generator = ObsidianVaultGenerator(args.path, args.vault_name)

    if args.clean and generator.vault_path.exists():
        print(f"Warning: Removing existing vault at {generator.vault_path}")
        shutil.rmtree(generator.vault_path)

    generator.generate_vault()

if __name__ == "__main__":
    main()