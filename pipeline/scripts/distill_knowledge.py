#!/usr/bin/env python3
"""
Knowledge Distillation Pipeline - Markdown-basierter 3-Stages-Workflow

Pipeline zur Extraktion von Wissensdokumenten aus akademischen Papers
für den Obsidian Vault.

Stages:
1. Extract & Classify - Kombinierte Extraktion von Struktur und Kategorien (JSON)
2. Format & Enrich - Konvertierung zu Obsidian-Markdown mit Wikilinks
3. Verify & Finalize - Verifikation gegen Original und Confidence-Score

Usage:
    python distill_knowledge.py --input pipeline/markdown --output pipeline/knowledge/distilled
    python distill_knowledge.py --limit 10  # Test mit 10 Dokumenten
    python distill_knowledge.py --single "path/to/paper.md"
"""

import os
import sys
import json
import time
import re
import argparse
from pathlib import Path
from typing import Dict, Any, Optional, List, Tuple
from datetime import datetime

# Load .env file from project root
from dotenv import load_dotenv
load_dotenv(Path(__file__).parent.parent.parent / '.env')

# Add parent directory to path for utils import
sys.path.insert(0, str(Path(__file__).parent))

from utils import (
    setup_windows_encoding,
    setup_logging,
    create_anthropic_client,
    parse_json_response,
    load_config
)

# Setup
setup_windows_encoding()
logger = setup_logging(__name__)


# =============================================================================
# PROMPTS - 3-Stage Workflow
# =============================================================================

STAGE1_EXTRACT_CLASSIFY_PROMPT = """Du bist ein Experte für wissenschaftliche Literaturanalyse im Bereich KI, Soziale Arbeit und Gender Studies.

# PAPER (Markdown-Format)
{markdown_content}

# AUFGABE
Extrahiere alle relevanten Informationen und klassifiziere das Paper nach 10 Kategorien.
Antworte im JSON-Format (kein Markdown-Codeblock, nur reines JSON).

{{
  "metadata": {{
    "title": "Vollständiger Titel des Papers",
    "authors": ["Autor1", "Autor2"],
    "year": 2024,
    "type": "journalArticle|conferencePaper|report|book|thesis|workingPaper",
    "language": "en|de|other"
  }},
  "core": {{
    "research_question": "Die zentrale Forschungsfrage (1 Satz)",
    "methodology": "Ansatz und Methoden (kurz: Empirisch/Theoretisch/Mixed/Review + spezifische Methoden)",
    "key_finding": "Wichtigster Befund oder Beitrag (1-2 Sätze)",
    "data_basis": "Datenbasis falls empirisch (z.B. n=125 Surveys, 50 Interviews)"
  }},
  "arguments": [
    "Hauptargument 1 (1-2 Sätze)",
    "Hauptargument 2 (1-2 Sätze)",
    "Hauptargument 3 (1-2 Sätze)"
  ],
  "categories": {{
    "AI_Literacies": true,
    "Generative_KI": false,
    "Prompting": false,
    "KI_Sonstige": true,
    "Soziale_Arbeit": true,
    "Bias_Ungleichheit": true,
    "Gender": false,
    "Diversitaet": true,
    "Feministisch": false,
    "Fairness": true
  }},
  "category_evidence": {{
    "AI_Literacies": "Direktes Zitat oder Paraphrase als Evidenz",
    "KI_Sonstige": "Evidenz...",
    "Soziale_Arbeit": "Evidenz...",
    "Bias_Ungleichheit": "Evidenz...",
    "Diversitaet": "Evidenz...",
    "Fairness": "Evidenz..."
  }},
  "references": [
    {{"author": "Buolamwini", "year": 2018, "short_title": "Gender Shades"}},
    {{"author": "D'Ignazio & Klein", "year": 2020, "short_title": "Data Feminism"}},
    {{"author": "Eubanks", "year": 2019, "short_title": "Automating Inequality"}}
  ],
  "assessment": {{
    "domain_fit": "Wie relevant ist das Paper für die Schnittstelle AI/Soziale Arbeit/Gender? (1-2 Sätze)",
    "unique_contribution": "Was ist der besondere wissenschaftliche Beitrag? (1 Satz)",
    "limitations": "Methodische oder thematische Einschränkungen (1 Satz oder 'nicht angegeben')"
  }},
  "target_group": "Für wen ist das Paper relevant? (z.B. Sozialarbeiter, KI-Entwickler, Policymaker)"
}}

# KATEGORIE-DEFINITIONEN

**AI_Literacies**: Kompetenzen, Fähigkeiten oder Wissen im Umgang mit KI-Systemen. Kritische Reflexion, technisches Verständnis, Anwendungskompetenz, Curricula, Bildung.

**Generative_KI**: Fokus auf generative KI-Modelle wie LLMs (ChatGPT, Claude, GPT-4), Bildgeneratoren (DALL-E, Midjourney, Stable Diffusion), oder andere generative Systeme.

**Prompting**: Prompt-Engineering, Prompt-Strategien, Gestaltung von Eingaben für KI-Systeme, Chain-of-Thought, Few-Shot, Zero-Shot, Jailbreaks.

**KI_Sonstige**: Andere KI-Themen (klassisches ML, Robotik, Computer Vision, Predictive Analytics, algorithmische Entscheidungssysteme, NLP ohne generativen Fokus).

**Soziale_Arbeit**: Direkter Bezug zu sozialarbeiterischer Praxis, Theorie, Ausbildung oder Zielgruppen Sozialer Arbeit (Jugendhilfe, Beratung, Care-Arbeit, Soziale Dienste).

**Bias_Ungleichheit**: Thematisiert Diskriminierung, algorithmischen Bias, soziale Ungleichheit, strukturelle Benachteiligung im KI-Kontext, Digital Divide.

**Gender**: Expliziter Gender-Fokus, Geschlechterperspektive, Gender-Bias in KI, Frauen in Tech/AI, geschlechtsspezifische Auswirkungen.

**Diversitaet**: Thematisiert Diversität, Inklusion, Repräsentation verschiedener Gruppen, marginalisierte Communities, intersektionale Perspektiven.

**Feministisch**: Verwendet EXPLIZIT feministische Theorie, Methodik oder Perspektive. Referenzen auf feministische Autor:innen (Crenshaw, Haraway, D'Ignazio, Harding, hooks). NICHT nur Gender erwähnt!

**Fairness**: Algorithmische Fairness, faire ML-Systeme, Fairness-Metriken (Equalized Odds, Demographic Parity, Calibration), Fairness-aware ML.

# WICHTIGE REGELN

1. **categories**: NUR true/false Werte, kein Text
2. **category_evidence**: NUR für Kategorien die true sind (direkte Evidenz aus dem Text)
3. **Feministisch = true** NUR wenn explizit feministische Theorie/Methodik verwendet wird
4. **references**: Extrahiere 3-10 der wichtigsten zitierten Werke (mit Autor, Jahr, Kurztitel)
5. Bei fehlenden Informationen: "nicht angegeben" verwenden
6. Antworte NUR mit dem JSON-Objekt, keine Erklärungen davor oder danach"""


STAGE2_FORMAT_MARKDOWN_PROMPT = """Konvertiere die extrahierten Daten in ein Obsidian-kompatibles Markdown-Dokument.

# EXTRAHIERTE DATEN (JSON)
{extracted_json}

# ZUSÄTZLICHE REFERENZ-LISTE AUS ORIGINAL
{references_from_original}

# AUFGABE
Erstelle ein Markdown-Dokument für Obsidian mit:
1. YAML-Frontmatter
2. Strukturierte Sections
3. Wikilinks für Referenzen (Format: [[Autor_Jahr]])
4. Kurze, prägnante Inhalte

Antworte NUR mit dem Markdown-Dokument (keine Erklärungen):

---
title: "{title}"
authors: {authors_yaml}
year: {year}
type: {type}
language: {language}
categories:
{categories_yaml}
processed: {date}
---

# {title}

## Kernbefund

{key_finding}

## Forschungsfrage

{research_question}

## Methodik

{methodology}

{data_basis_if_present}

## Hauptargumente

- {argument1}
- {argument2}
- {argument3}

## Kategorie-Evidenz

{category_evidence_sections}

## Assessment-Relevanz

**Domain Fit:** {domain_fit}

**Unique Contribution:** {unique_contribution}

**Limitations:** {limitations}

**Target Group:** {target_group}

## Schlüsselreferenzen

{references_as_wikilinks}

---

WICHTIG:
- Wikilinks für Referenzen im Format: [[Autor_Jahr]] - Kurztitel
- Kategorien im Frontmatter als Liste (nur die true-Kategorien)
- Kompakt und informativ
- Deutsche Überschriften, Inhalt kann Englisch sein wenn Original englisch"""


STAGE3_VERIFY_PROMPT = """Du bist ein wissenschaftlicher Qualitätsprüfer. Vergleiche das generierte Wissensdokument mit dem Originaltext.

# ORIGINAL-MARKDOWN (Ausschnitt)
{original_excerpt}

# GENERIERTES WISSENSDOKUMENT
{knowledge_document}

# AUFGABE
Prüfe auf drei Dimensionen und gib einen Confidence-Score.

Antworte im JSON-Format:

{{
  "verification": {{
    "completeness": {{
      "score": 85,
      "missing_critical": [],
      "missing_minor": ["Detail X nicht erwähnt"]
    }},
    "correctness": {{
      "score": 95,
      "errors": [],
      "distortions": []
    }},
    "category_validation": {{
      "score": 90,
      "incorrect_categories": [],
      "missing_categories": []
    }}
  }},
  "overall_confidence": 90,
  "needs_correction": false,
  "corrections": {{
    "frontmatter": null,
    "content_fixes": []
  }}
}}

# PRÜFKRITERIEN

**Completeness (0-100)**:
- Sind Forschungsfrage, Methodik und Hauptbefunde korrekt erfasst?
- Fehlen kritische Informationen?

**Correctness (0-100)**:
- Gibt es faktische Fehler?
- Wurden Aussagen verzerrt?

**Category Validation (0-100)**:
- Sind die Kategorien durch den Originaltext belegt?
- Fehlen offensichtliche Kategorien?

**Overall Confidence**: Gewichteter Durchschnitt (Completeness 40%, Correctness 40%, Categories 20%)

**needs_correction**: true wenn overall_confidence < 75

Falls needs_correction = true, füge spezifische Korrekturen hinzu.

Antworte NUR mit dem JSON-Objekt."""


# =============================================================================
# KNOWLEDGE DISTILLER V2 CLASS
# =============================================================================

class KnowledgeDistillerV2:
    def __init__(
        self,
        api_key: str,
        input_dir: str = None,
        output_dir: str = None,
        model: str = None,
        delay: float = None,
        config: Dict[str, Any] = None
    ):
        # Load config if not provided
        if config is None:
            config = load_config()

        api_config = config.get('api', {})
        paths_config = config.get('paths', {})

        # Use config defaults, allow overrides
        self.client = create_anthropic_client(api_key)
        self.input_dir = Path(input_dir or paths_config.get('markdown', 'pipeline/markdown'))
        self.output_dir = Path(output_dir or paths_config.get('knowledge_distilled', 'pipeline/knowledge/distilled'))
        self.output_dir.mkdir(exist_ok=True, parents=True)
        self.model = model or api_config.get('model', 'claude-haiku-4-5-20251001')
        self.delay = delay if delay is not None else api_config.get('delay', 1.0)

        # Statistics
        self.stats = {
            "processed": 0,
            "successful": 0,
            "failed": 0,
            "total_input_tokens": 0,
            "total_output_tokens": 0,
            "confidences": [],
            "start_time": None,
            "end_time": None
        }

        # Create subdirectories for intermediate outputs
        (self.output_dir / "_stage1_json").mkdir(exist_ok=True)
        (self.output_dir / "_stage2_draft").mkdir(exist_ok=True)
        (self.output_dir / "_verification").mkdir(exist_ok=True)

    def _call_llm(self, prompt: str, max_tokens: int = 4000) -> Tuple[str, Dict]:
        """Call LLM and return response + usage stats"""
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=max_tokens,
                messages=[{"role": "user", "content": prompt}]
            )

            usage = {
                "input_tokens": response.usage.input_tokens,
                "output_tokens": response.usage.output_tokens
            }

            self.stats["total_input_tokens"] += usage["input_tokens"]
            self.stats["total_output_tokens"] += usage["output_tokens"]

            return response.content[0].text, usage

        except Exception as e:
            logger.error(f"LLM call failed: {e}")
            raise

    def _extract_json(self, text: str) -> Optional[Dict]:
        """Extract JSON from LLM response (more robust than YAML)"""
        try:
            # Try to find JSON in the response
            text = text.strip()

            # Remove markdown code blocks if present
            if text.startswith("```json"):
                text = text[7:]
            elif text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]

            text = text.strip()

            # Find JSON object boundaries
            start = text.find('{')
            end = text.rfind('}') + 1

            if start >= 0 and end > start:
                json_str = text[start:end]
                return json.loads(json_str)

            return None
        except json.JSONDecodeError as e:
            logger.warning(f"JSON parsing failed: {e}")
            return None

    def _get_excerpt(self, markdown: str, max_chars: int = 40000) -> str:
        """Get representative excerpt from markdown"""
        # Remove page markers
        text = '\n'.join(line for line in markdown.split('\n')
                        if not line.strip().startswith('<!-- PAGE'))

        if len(text) <= max_chars:
            return text

        # Get beginning, middle, and end
        third = max_chars // 3
        beginning = text[:third]
        middle_start = len(text) // 2 - third // 2
        middle = text[middle_start:middle_start + third]
        end = text[-third:]

        return f"{beginning}\n\n[...EXCERPT...]\n\n{middle}\n\n[...EXCERPT...]\n\n{end}"

    def _extract_references_from_markdown(self, markdown: str) -> str:
        """Extract reference section from original markdown"""
        lines = markdown.split('\n')
        in_references = False
        ref_lines = []

        for line in lines:
            lower = line.lower()
            if any(x in lower for x in ['## references', '## literatur', '## bibliography', '## works cited']):
                in_references = True
                continue
            if in_references:
                if line.startswith('## ') and 'reference' not in lower:
                    break
                if line.strip():
                    ref_lines.append(line.strip())
                if len(ref_lines) > 50:  # Limit
                    break

        return '\n'.join(ref_lines[:30]) if ref_lines else "Keine separate Referenzliste gefunden."

    def _format_categories_yaml(self, categories: Dict[str, bool]) -> str:
        """Format categories for YAML frontmatter (only true categories)"""
        true_cats = [cat for cat, val in categories.items() if val]
        if not true_cats:
            return "  - none"
        return '\n'.join(f"  - {cat}" for cat in true_cats)

    def _format_category_evidence(self, categories: Dict[str, bool], evidence: Dict[str, str]) -> str:
        """Format category evidence sections"""
        sections = []
        for cat, is_present in categories.items():
            if is_present and cat in evidence:
                sections.append(f"### {cat}\n\n{evidence[cat]}")
        return '\n\n'.join(sections) if sections else "*Keine Kategorie-Evidenz verfügbar*"

    def _format_references_wikilinks(self, references: List[Dict]) -> str:
        """Format references as Wikilinks"""
        if not references:
            return "*Keine Schlüsselreferenzen extrahiert*"

        links = []
        for ref in references[:10]:  # Max 10
            author = ref.get('author', 'Unknown')
            year = ref.get('year', '')
            title = ref.get('short_title', '')

            # Create wikilink-safe filename
            author_clean = re.sub(r'[^\w\s&]', '', author).replace(' & ', '_').replace(' ', '_')
            wikilink = f"[[{author_clean}_{year}]]"

            if title:
                links.append(f"- {wikilink} - {title}")
            else:
                links.append(f"- {wikilink}")

        return '\n'.join(links)

    def stage1_extract_classify(self, markdown: str, filename: str) -> Optional[Dict]:
        """Stage 1: Combined extraction and classification"""
        logger.info(f"  Stage 1: Extract & Classify...")

        # Use excerpt for very long documents
        content = self._get_excerpt(markdown, 45000)

        prompt = STAGE1_EXTRACT_CLASSIFY_PROMPT.format(markdown_content=content)

        response, usage = self._call_llm(prompt, max_tokens=3000)
        result = self._extract_json(response)

        if result:
            # Save intermediate result
            output_path = self.output_dir / "_stage1_json" / f"{filename}.json"
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(result, f, ensure_ascii=False, indent=2)
            logger.info(f"    -> {usage['output_tokens']} tokens")
        else:
            logger.warning(f"    -> JSON parsing failed, saving raw response")
            raw_path = self.output_dir / "_stage1_json" / f"{filename}_raw.txt"
            with open(raw_path, 'w', encoding='utf-8') as f:
                f.write(response)

        time.sleep(self.delay)
        return result

    def stage2_format_markdown(self, extracted: Dict, original_markdown: str, filename: str) -> Optional[str]:
        """Stage 2: Format as Obsidian Markdown"""
        logger.info(f"  Stage 2: Format Markdown...")

        # Get references from original
        refs_from_original = self._extract_references_from_markdown(original_markdown)

        # Build the markdown document directly (more reliable than LLM formatting)
        try:
            meta = extracted.get('metadata', {})
            core = extracted.get('core', {})
            categories = extracted.get('categories', {})
            evidence = extracted.get('category_evidence', {})
            assessment = extracted.get('assessment', {})
            references = extracted.get('references', [])
            arguments = extracted.get('arguments', [])

            # Build YAML frontmatter
            authors_yaml = json.dumps(meta.get('authors', []), ensure_ascii=False)
            categories_yaml = self._format_categories_yaml(categories)

            # Build content sections
            category_evidence_md = self._format_category_evidence(categories, evidence)
            references_md = self._format_references_wikilinks(references)

            # Format arguments
            arguments_md = '\n'.join(f"- {arg}" for arg in arguments) if arguments else "- Keine Argumente extrahiert"

            # Data basis line (only if present)
            data_basis = core.get('data_basis', '')
            data_basis_line = f"\n**Datenbasis:** {data_basis}" if data_basis and data_basis != 'nicht angegeben' else ""

            markdown_doc = f"""---
title: "{meta.get('title', 'Unbekannter Titel')}"
authors: {authors_yaml}
year: {meta.get('year', 'n.d.')}
type: {meta.get('type', 'unknown')}
language: {meta.get('language', 'en')}
categories:
{categories_yaml}
processed: {datetime.now().strftime('%Y-%m-%d')}
source_file: {filename}.md
---

# {meta.get('title', 'Unbekannter Titel')}

## Kernbefund

{core.get('key_finding', 'Nicht extrahiert')}

## Forschungsfrage

{core.get('research_question', 'Nicht extrahiert')}

## Methodik

{core.get('methodology', 'Nicht extrahiert')}{data_basis_line}

## Hauptargumente

{arguments_md}

## Kategorie-Evidenz

{category_evidence_md}

## Assessment-Relevanz

**Domain Fit:** {assessment.get('domain_fit', 'Nicht bewertet')}

**Unique Contribution:** {assessment.get('unique_contribution', 'Nicht bewertet')}

**Limitations:** {assessment.get('limitations', 'nicht angegeben')}

**Target Group:** {extracted.get('target_group', 'Nicht spezifiziert')}

## Schlüsselreferenzen

{references_md}
"""
            # Save draft
            output_path = self.output_dir / "_stage2_draft" / f"{filename}.md"
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(markdown_doc)

            logger.info(f"    -> {len(markdown_doc)} chars")
            return markdown_doc

        except Exception as e:
            logger.error(f"    -> Formatting failed: {e}")
            return None

    def stage3_verify(self, markdown_doc: str, original_markdown: str, filename: str) -> Tuple[str, int]:
        """Stage 3: Verify and get confidence score"""
        logger.info(f"  Stage 3: Verify...")

        # Use excerpt of original for comparison
        # Note: Increased from 30k to 45k to reduce false positives in verification
        # (Long papers had relevant content cut off, leading to incorrect "needs_correction" flags)
        original_excerpt = self._get_excerpt(original_markdown, 45000)

        prompt = STAGE3_VERIFY_PROMPT.format(
            original_excerpt=original_excerpt,
            knowledge_document=markdown_doc
        )

        response, usage = self._call_llm(prompt, max_tokens=1500)
        result = self._extract_json(response)

        confidence = 75  # Default
        final_doc = markdown_doc

        if result:
            confidence = result.get('overall_confidence', 75)

            # Save verification report
            output_path = self.output_dir / "_verification" / f"{filename}.json"
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(result, f, ensure_ascii=False, indent=2)

            # Apply corrections if needed
            if result.get('needs_correction') and result.get('corrections'):
                corrections = result['corrections']
                content_fixes = corrections.get('content_fixes', [])
                if content_fixes:
                    logger.info(f"    -> Applying {len(content_fixes)} corrections")
                    # For now, just log corrections - could be applied programmatically
                    for fix in content_fixes:
                        logger.info(f"       - {fix}")

            logger.info(f"    -> Confidence: {confidence}%")
        else:
            logger.warning(f"    -> Verification parsing failed, using default confidence")

        time.sleep(self.delay)
        return final_doc, confidence

    def _add_confidence_to_frontmatter(self, markdown_doc: str, confidence: int) -> str:
        """Add confidence score to frontmatter"""
        # Find end of frontmatter
        if markdown_doc.startswith('---'):
            end_idx = markdown_doc.find('---', 3)
            if end_idx > 0:
                frontmatter = markdown_doc[3:end_idx]
                rest = markdown_doc[end_idx:]
                # Add confidence before closing ---
                new_frontmatter = frontmatter.rstrip() + f"\nconfidence: {confidence}\n"
                return f"---{new_frontmatter}{rest}"
        return markdown_doc

    def process_paper(self, markdown_path: Path) -> Optional[str]:
        """Process a single paper through all 3 stages"""
        filename = markdown_path.stem
        logger.info(f"Processing: {filename}")

        try:
            with open(markdown_path, 'r', encoding='utf-8') as f:
                markdown = f.read()

            # Stage 1: Extract & Classify
            extracted = self.stage1_extract_classify(markdown, filename)
            if not extracted:
                logger.error(f"  Stage 1 failed")
                self.stats["failed"] += 1
                return None

            # Stage 2: Format Markdown
            markdown_doc = self.stage2_format_markdown(extracted, markdown, filename)
            if not markdown_doc:
                logger.error(f"  Stage 2 failed")
                self.stats["failed"] += 1
                return None

            # Stage 3: Verify
            final_doc, confidence = self.stage3_verify(markdown_doc, markdown, filename)

            # Add confidence to frontmatter
            final_doc = self._add_confidence_to_frontmatter(final_doc, confidence)

            # Save final document
            output_path = self.output_dir / f"{filename}.md"
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(final_doc)

            self.stats["successful"] += 1
            self.stats["confidences"].append(confidence)

            logger.info(f"  -> Saved: {output_path.name}")
            return final_doc

        except Exception as e:
            logger.error(f"  Failed: {e}")
            self.stats["failed"] += 1
            return None
        finally:
            self.stats["processed"] += 1

    def process_all(self, limit: Optional[int] = None, skip_existing: bool = True):
        """Process all markdown files"""
        markdown_files = sorted(self.input_dir.glob("*.md"))

        if limit:
            markdown_files = markdown_files[:limit]

        logger.info(f"Found {len(markdown_files)} markdown files")

        if skip_existing:
            existing = set(p.stem for p in self.output_dir.glob("*.md"))
            markdown_files = [f for f in markdown_files if f.stem not in existing]
            logger.info(f"Skipping {len(existing)} already processed, {len(markdown_files)} remaining")

        if not markdown_files:
            logger.info("No files to process")
            return

        self.stats["start_time"] = datetime.now()

        for i, md_path in enumerate(markdown_files, 1):
            logger.info(f"\n[{i}/{len(markdown_files)}]")
            self.process_paper(md_path)

        self.stats["end_time"] = datetime.now()
        self._print_summary()

    def _print_summary(self):
        """Print processing summary"""
        duration = (self.stats["end_time"] - self.stats["start_time"]).total_seconds()

        # Calculate average confidence
        confidences = self.stats["confidences"]
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0

        # Estimate cost (Haiku 4.5 pricing: $0.80/M input, $4.00/M output)
        input_cost = (self.stats["total_input_tokens"] / 1_000_000) * 0.80
        output_cost = (self.stats["total_output_tokens"] / 1_000_000) * 4.00
        total_cost = input_cost + output_cost

        logger.info("\n" + "="*60)
        logger.info("KNOWLEDGE DISTILLATION V2 COMPLETE")
        logger.info("="*60)
        logger.info(f"Processed:      {self.stats['processed']}")
        logger.info(f"Successful:     {self.stats['successful']}")
        logger.info(f"Failed:         {self.stats['failed']}")
        logger.info(f"Duration:       {duration:.1f}s ({duration/60:.1f} min)")
        logger.info(f"Avg Confidence: {avg_confidence:.1f}%")
        logger.info(f"Total Tokens:   {self.stats['total_input_tokens']:,} in / {self.stats['total_output_tokens']:,} out")
        logger.info(f"Est. Cost:      ${total_cost:.3f}")
        logger.info(f"Output Dir:     {self.output_dir}")
        logger.info("="*60)


# =============================================================================
# MAIN
# =============================================================================

def main():
    # Load config for default values
    config = load_config()
    api_config = config.get('api', {})
    paths_config = config.get('paths', {})

    parser = argparse.ArgumentParser(
        description="Knowledge Distillation Pipeline - Markdown Output for Obsidian"
    )
    parser.add_argument(
        "--input", "-i",
        default=paths_config.get('markdown', 'pipeline/markdown'),
        help="Input directory with markdown files"
    )
    parser.add_argument(
        "--output", "-o",
        default=paths_config.get('knowledge_distilled', 'pipeline/knowledge/distilled'),
        help="Output directory for knowledge documents"
    )
    parser.add_argument(
        "--single", "-s",
        help="Process a single file instead of directory"
    )
    parser.add_argument(
        "--limit", "-l",
        type=int,
        help="Limit number of files to process"
    )
    parser.add_argument(
        "--model", "-m",
        default=api_config.get('model', 'claude-haiku-4-5-20251001'),
        help="Model to use"
    )
    parser.add_argument(
        "--delay", "-d",
        type=float,
        default=api_config.get('delay', 1.0),
        help="Delay between API calls in seconds"
    )
    parser.add_argument(
        "--no-skip",
        action="store_true",
        help="Don't skip already processed files"
    )
    parser.add_argument(
        "--config", "-c",
        help="Path to config file (default: config/defaults.yaml)"
    )

    args = parser.parse_args()

    # Reload config if custom path specified
    if args.config:
        config = load_config(Path(args.config))

    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        logger.error("ANTHROPIC_API_KEY not found in environment")
        sys.exit(1)

    distiller = KnowledgeDistillerV2(
        api_key=api_key,
        input_dir=args.input,
        output_dir=args.output,
        model=args.model,
        delay=args.delay,
        config=config
    )

    if args.single:
        single_path = Path(args.single)
        if not single_path.exists():
            logger.error(f"File not found: {single_path}")
            sys.exit(1)
        distiller.process_paper(single_path)
        distiller.stats["end_time"] = datetime.now()
        distiller.stats["start_time"] = distiller.stats["end_time"]
        distiller._print_summary()
    else:
        distiller.process_all(limit=args.limit, skip_existing=not args.no_skip)


if __name__ == "__main__":
    main()
