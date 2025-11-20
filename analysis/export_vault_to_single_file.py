#!/usr/bin/env python3
"""
Export SozArb Research Vault to Single Markdown File
Combines all Papers, Concepts, and MOCs into one readable document
"""

import os
import re
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Tuple

def clean_wikilinks(text: str) -> str:
    """Convert wikilinks to plain text for readability"""
    # [[Concepts/AI_Ethics|AI Ethics]] -> AI Ethics
    text = re.sub(r'\[\[.*?\|(.*?)\]\]', r'\1', text)
    # [[AI_Ethics]] -> AI Ethics
    text = re.sub(r'\[\[(.*?)\]\]', r'\1', text)
    return text

def extract_yaml_and_content(file_path: Path) -> Tuple[str, str]:
    """Extract YAML frontmatter and main content separately"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if file has YAML frontmatter
    if content.startswith('---\n'):
        parts = content.split('---\n', 2)
        if len(parts) >= 3:
            yaml_section = f"---\n{parts[1]}---\n"
            main_content = parts[2].strip()
            return yaml_section, main_content

    return "", content.strip()

def extract_title_from_content(content: str, filename: str) -> str:
    """Extract title from content or generate from filename"""
    # Try to find first H1 heading
    match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    if match:
        return match.group(1).strip()

    # Fallback to filename
    return filename.replace('_', ' ').replace('.md', '')

def collect_papers(vault_path: Path) -> List[Dict]:
    """Collect all papers with metadata"""
    papers = []
    papers_dir = vault_path / "Papers"

    if not papers_dir.exists():
        return papers

    for md_file in sorted(papers_dir.glob("*.md")):
        yaml_section, content = extract_yaml_and_content(md_file)
        title = extract_title_from_content(content, md_file.stem)

        papers.append({
            'filename': md_file.name,
            'title': title,
            'yaml': yaml_section,
            'content': clean_wikilinks(content)
        })

    print(f"[OK] Collected {len(papers)} papers")
    return papers

def collect_concepts(vault_path: Path) -> List[Dict]:
    """Collect all concept files"""
    concepts = []
    concepts_dir = vault_path / "Concepts"

    if not concepts_dir.exists():
        return concepts

    for md_file in sorted(concepts_dir.glob("*.md")):
        yaml_section, content = extract_yaml_and_content(md_file)
        title = extract_title_from_content(content, md_file.stem)

        concepts.append({
            'filename': md_file.name,
            'title': title,
            'yaml': yaml_section,
            'content': clean_wikilinks(content)
        })

    print(f"[OK] Collected {len(concepts)} concepts")
    return concepts

def collect_mocs(vault_path: Path) -> List[Dict]:
    """Collect all MOC files"""
    mocs = []
    mocs_dir = vault_path / "MOCs"

    if not mocs_dir.exists():
        return mocs

    # Add MASTER_MOC first
    master_moc = vault_path / "MASTER_MOC.md"
    if master_moc.exists():
        yaml_section, content = extract_yaml_and_content(master_moc)
        mocs.append({
            'filename': 'MASTER_MOC.md',
            'title': 'Master Map of Content',
            'yaml': yaml_section,
            'content': clean_wikilinks(content)
        })

    # Add other MOCs
    for md_file in sorted(mocs_dir.glob("*.md")):
        yaml_section, content = extract_yaml_and_content(md_file)
        title = extract_title_from_content(content, md_file.stem)

        mocs.append({
            'filename': md_file.name,
            'title': title,
            'yaml': yaml_section,
            'content': clean_wikilinks(content)
        })

    print(f"[OK] Collected {len(mocs)} MOCs")
    return mocs

def generate_toc(papers: List[Dict], concepts: List[Dict], mocs: List[Dict]) -> str:
    """Generate table of contents with anchor links"""
    toc = ["# Table of Contents\n"]

    if mocs:
        toc.append("## Maps of Content (MOCs)")
        for moc in mocs:
            anchor = moc['filename'].replace('.md', '').replace(' ', '-').lower()
            toc.append(f"- [{moc['title']}](#{anchor})")
        toc.append("")

    if papers:
        toc.append(f"## Papers ({len(papers)})")
        for paper in papers[:50]:  # Show first 50 in TOC
            anchor = paper['filename'].replace('.md', '').replace(' ', '-').lower()
            toc.append(f"- [{paper['title']}](#{anchor})")
        if len(papers) > 50:
            toc.append(f"- ... and {len(papers) - 50} more papers")
        toc.append("")

    if concepts:
        toc.append(f"## Concepts ({len(concepts)})")
        for concept in concepts[:50]:  # Show first 50 in TOC
            anchor = concept['filename'].replace('.md', '').replace(' ', '-').lower()
            toc.append(f"- [{concept['title']}](#{anchor})")
        if len(concepts) > 50:
            toc.append(f"- ... and {len(concepts) - 50} more concepts")
        toc.append("")

    return "\n".join(toc)

def generate_combined_file(papers: List[Dict], concepts: List[Dict], mocs: List[Dict], output_file: Path):
    """Generate single combined markdown file"""

    with open(output_file, 'w', encoding='utf-8') as f:
        # Header
        f.write("# SozArb Research Vault - Complete Export\n\n")
        f.write(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        f.write(f"**Contents:** {len(papers)} Papers, {len(concepts)} Concepts, {len(mocs)} MOCs\n\n")
        f.write("---\n\n")

        # Table of Contents
        f.write(generate_toc(papers, concepts, mocs))
        f.write("\n---\n\n")

        # MOCs Section
        if mocs:
            f.write("# Maps of Content (MOCs)\n\n")
            for moc in mocs:
                anchor = moc['filename'].replace('.md', '')
                f.write(f"<a id='{anchor.replace(' ', '-').lower()}'></a>\n\n")
                f.write(f"## {moc['title']}\n\n")
                if moc['yaml']:
                    f.write(f"{moc['yaml']}\n")
                f.write(f"{moc['content']}\n\n")
                f.write("---\n\n")

        # Papers Section
        if papers:
            f.write(f"# Papers ({len(papers)})\n\n")
            for i, paper in enumerate(papers, 1):
                anchor = paper['filename'].replace('.md', '')
                f.write(f"<a id='{anchor.replace(' ', '-').lower()}'></a>\n\n")
                f.write(f"## Paper {i}/{len(papers)}: {paper['title']}\n\n")
                f.write(f"**Source file:** `{paper['filename']}`\n\n")
                if paper['yaml']:
                    f.write(f"{paper['yaml']}\n")
                f.write(f"{paper['content']}\n\n")
                f.write("---\n\n")

                # Progress indicator
                if i % 50 == 0:
                    print(f"  Written {i}/{len(papers)} papers...")

        # Concepts Section
        if concepts:
            f.write(f"# Concepts ({len(concepts)})\n\n")
            for i, concept in enumerate(concepts, 1):
                anchor = concept['filename'].replace('.md', '')
                f.write(f"<a id='{anchor.replace(' ', '-').lower()}'></a>\n\n")
                f.write(f"## Concept {i}/{len(concepts)}: {concept['title']}\n\n")
                f.write(f"**Source file:** `{concept['filename']}`\n\n")
                if concept['yaml']:
                    f.write(f"{concept['yaml']}\n")
                f.write(f"{concept['content']}\n\n")
                f.write("---\n\n")

                # Progress indicator
                if i % 50 == 0:
                    print(f"  Written {i}/{len(concepts)} concepts...")

def main():
    """Main execution"""
    # Paths
    base_path = Path(__file__).parent.parent
    vault_path = base_path / "SozArb_Research_Vault"
    output_file = base_path / "SozArb_Complete_Vault.md"

    print("=" * 60)
    print("SozArb Research Vault - Single File Export")
    print("=" * 60)
    print()

    # Check vault exists
    if not vault_path.exists():
        print(f"[ERROR] Vault directory not found: {vault_path}")
        return

    print(f"Vault directory: {vault_path}")
    print(f"Output file: {output_file}")
    print()

    # Collect data
    print("Collecting vault contents...")
    mocs = collect_mocs(vault_path)
    papers = collect_papers(vault_path)
    concepts = collect_concepts(vault_path)
    print()

    # Generate combined file
    print("Generating combined markdown file...")
    generate_combined_file(papers, concepts, mocs, output_file)

    # Summary
    file_size_mb = output_file.stat().st_size / (1024 * 1024)
    print()
    print("=" * 60)
    print("[SUCCESS] Export Complete!")
    print("=" * 60)
    print(f"Output file: {output_file}")
    print(f"File size: {file_size_mb:.2f} MB")
    print(f"Contents: {len(papers)} papers, {len(concepts)} concepts, {len(mocs)} MOCs")
    print()

if __name__ == "__main__":
    main()
