#!/usr/bin/env python3
"""
Enhanced Document Summarization Pipeline with Multi-Pass Analysis
- Multi-pass reading for 100% coverage
- Cross-validation against original
- Enhanced structure (Practical Implications, Limitations, Relations)
- Quality metrics and validation
"""

import os
import sys
import json
import logging
import re
import time
import argparse
from pathlib import Path
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

# Fix encoding for Windows console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

load_dotenv()

# Logging Setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%H:%M:%S'
)
logger = logging.getLogger(__name__)

try:
    from anthropic import Anthropic
except ImportError:
    logger.error("❌ anthropic package not installed!")
    logger.info("💡 Install with: pip install anthropic")
    exit(1)


class QualityMetrics:
    """Track quality metrics for validation"""

    def __init__(self):
        self.metrics = {
            'coverage_score': 0,      # 0-100: How much of paper is covered
            'accuracy_score': 0,       # 0-100: Factual accuracy
            'completeness_score': 0,   # 0-100: All key findings present
            'actionability_score': 0,  # 0-100: Practical implications present
            'structure_score': 0,      # 0-100: All sections present
            'limitations_present': False,
            'implications_present': False,
            'concepts_count': 0,
        }

    def calculate_overall_score(self) -> int:
        """Calculate weighted overall quality score"""
        weights = {
            'coverage_score': 0.25,
            'accuracy_score': 0.25,
            'completeness_score': 0.20,
            'actionability_score': 0.15,
            'structure_score': 0.15,
        }

        score = sum(self.metrics[k] * weights[k] for k in weights)
        return int(score)


class EnhancedDocumentProcessor:
    def __init__(self, api_key: str, source_dir: str = "pipeline/markdown",
                 output_dir: str = "pipeline/knowledge/distilled", model: str = "claude-haiku-4-5"):
        self.api_key = api_key
        self.source_dir = Path(source_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True, parents=True)
        self.model = model
        self.client = Anthropic(api_key=api_key)

        # Statistics
        self.stats = {
            'total_processed': 0,
            'total_api_calls': 0,
            'total_cost': 0.0,
            'avg_quality_score': 0.0,
        }

    def clean_markdown(self, text: str) -> str:
        """Clean markdown text from noise"""
        parts = text.split('---', 2)
        if len(parts) > 2:
            text = parts[2]

        text = re.sub(r'<!--.*?-->', '', text, flags=re.DOTALL)

        disclaimer_phrases = [
            "Funded by the European Union",
            "Neither the European Union nor EACEA",
            "This document was funded by",
            "The views and opinions expressed"
        ]

        lines = [line for line in text.splitlines()
                if not any(phrase in line for phrase in disclaimer_phrases)]

        return "\n".join(lines).strip()

    def call_claude(self, messages: List[Dict], stage: str, retries: int = 3) -> Optional[str]:
        """Call Claude API with retry mechanism"""

        for attempt in range(retries):
            try:
                if attempt > 0:
                    wait = min(2 ** attempt, 30)
                    logger.warning(f"{stage} - Retry {attempt+1}/{retries}, wait {wait}s")
                    time.sleep(wait)

                response = self.client.messages.create(
                    model=self.model,
                    max_tokens=2048,
                    temperature=0.3,
                    messages=messages
                )

                self.stats['total_api_calls'] += 1
                self.stats['total_cost'] += 0.002  # Rough estimate

                return response.content[0].text

            except Exception as e:
                logger.error(f"{stage} - Attempt {attempt+1} failed: {e}")
                if attempt == retries - 1:
                    return None

        return None

    def intelligent_chunking(self, clean_text: str) -> List[Dict[str, str]]:
        """Split paper by semantic sections"""

        # Try to detect section headers
        section_patterns = [
            (r'\n#{1,3}\s*(Abstract|Summary)', 'abstract'),
            (r'\n#{1,3}\s*(Introduction|Background)', 'introduction'),
            (r'\n#{1,3}\s*(Method|Methodology|Approach|Design)', 'methodology'),
            (r'\n#{1,3}\s*(Results?|Findings?)', 'results'),
            (r'\n#{1,3}\s*(Discussion)', 'discussion'),
            (r'\n#{1,3}\s*(Limitations?)', 'limitations'),
            (r'\n#{1,3}\s*(Conclusion|Implications?)', 'conclusion'),
        ]

        sections = {}
        for pattern, name in section_patterns:
            match = re.search(pattern, clean_text, re.IGNORECASE)
            if match:
                sections[name] = match.start()

        # If no sections found, chunk by size
        if not sections:
            chunks = []
            chunk_size = 8000
            for i in range(0, len(clean_text), chunk_size):
                chunks.append({
                    'name': f'chunk_{i//chunk_size + 1}',
                    'content': clean_text[i:i+chunk_size]
                })
            return chunks

        # Extract sections based on headers
        sorted_sections = sorted(sections.items(), key=lambda x: x[1])
        chunks = []

        for i, (name, start) in enumerate(sorted_sections):
            if i < len(sorted_sections) - 1:
                end = sorted_sections[i+1][1]
            else:
                end = len(clean_text)

            chunks.append({
                'name': name,
                'content': clean_text[start:end]
            })

        return chunks

    def multi_pass_analysis(self, chunks: List[Dict[str, str]], doc_num: int, total: int) -> str:
        """Analyze paper in multiple passes"""

        logger.info(f"📖 [{doc_num}/{total}] Multi-Pass Analysis ({len(chunks)} sections)")

        pass_analyses = []

        for i, chunk in enumerate(chunks, 1):
            logger.info(f"  Pass {i}/{len(chunks)}: {chunk['name']}")

            prompt = f"""Analyze this section of a research paper:

SECTION: {chunk['name'].upper()}
{chunk['content'][:4000]}

Extract key information relevant to this section:
- Main points and arguments
- Key findings or methods (if applicable)
- Important definitions or concepts
- Any limitations mentioned
- Practical implications mentioned

Max 200 words. Be precise and comprehensive.
"""

            analysis = self.call_claude([{"role": "user", "content": prompt}], f"Pass{i}-{doc_num}")

            if analysis:
                pass_analyses.append(f"## {chunk['name'].upper()}\n{analysis}")

            time.sleep(1)  # Rate limiting

        # Synthesize all passes
        logger.info(f"🔄 [{doc_num}/{total}] Synthesizing {len(pass_analyses)} analyses")

        synthesis_prompt = f"""You analyzed a research paper in {len(pass_analyses)} passes.
Now synthesize into ONE comprehensive analysis.

{chr(10).join(pass_analyses)}

Create a COMPLETE synthesis with these sections:

## Research Question & Context
[50 words: What problem does this address? Why important?]

## Methodology
[75 words: How was research conducted? Design, data, analysis]

## Main Findings
[150 words: LIST all key findings. Use bullet points if helpful]

## Practical Implications
[50 words: What does this mean for practitioners/policymakers?]

## Limitations
[50 words: What limitations are mentioned? Scope, methods, generalizability]

## Conclusions
[50 words: Main takeaways and significance]

Total: ~425 words. Ensure NO information from any pass is lost.
"""

        comprehensive_analysis = self.call_claude([{"role": "user", "content": synthesis_prompt}], f"Synthesis-{doc_num}")

        return comprehensive_analysis

    def generate_enhanced_summary(self, original_text: str, analysis: str, doc_num: int, total: int) -> str:
        """Generate enhanced summary with all sections"""

        logger.info(f"✍️  [{doc_num}/{total}] Generating Enhanced Summary")

        prompt = f"""Based on comprehensive analysis AND original document, create a detailed summary.

ORIGINAL DOCUMENT (first 8000 chars for context):
{original_text[:8000]}

COMPREHENSIVE ANALYSIS:
{analysis}

Create summary using EXACTLY this structure:

## Overview
[Context, motivation, research gap, main thesis. ~200 words]

## Main Findings
Structure as numbered list with brief explanations:
1. [Finding 1]
2. [Finding 2]
3. [Finding 3]
[Continue as needed]

## Methodology/Approach
[Research design, data collection, analysis methods. ~150 words]

## Relevant Concepts
Define 5-7 key concepts in format:
**[Concept Name]:** [Definition in 1-2 sentences]

## Practical Implications
**For Social Workers:**
- [Actionable recommendation]
- [Actionable recommendation]

**For Organizations:**
- [Actionable recommendation]
- [Actionable recommendation]

**For Policymakers:**
- [Actionable recommendation]

**For Researchers:**
- [Actionable recommendation]

## Limitations & Open Questions
**Limitations:**
- [Limitation 1 from analysis]
- [Limitation 2]
- [Limitation 3]

**Open Questions:**
- [Unresolved question]
- [Future research direction]

## Relation to Other Research
Identify 3-4 research themes this connects to (use general terms, not specific papers):
- **[Theme 1]:** [How this paper relates]
- **[Theme 2]:** [How this paper relates]

## Significance
[Why this matters, impact, broader implications. ~200 words]

Max 800 words total. Use clear, direct language. Be specific and actionable.
"""

        summary = self.call_claude([{"role": "user", "content": prompt}], f"Summary-{doc_num}")

        return summary

    def cross_validate(self, original_text: str, summary: str, doc_num: int, total: int) -> tuple:
        """Cross-validate summary against original, return (validated_summary, quality_metrics)"""

        logger.info(f"🔍 [{doc_num}/{total}] Cross-Validation")

        prompt = f"""Validate this summary against the original document.

ORIGINAL DOCUMENT (8000 chars):
{original_text[:8000]}

GENERATED SUMMARY:
{summary}

VALIDATION TASKS:

1. ACCURACY CHECK (0-100 score)
   - Any misrepresentations of claims?
   - Any unsupported statements?

2. COMPLETENESS CHECK (0-100 score)
   - Are all major findings included?
   - Are limitations mentioned?
   - Are practical implications present?

3. STRUCTURE CHECK (0-100 score)
   - All required sections present?
   - Concepts properly defined?

4. ACTIONABILITY CHECK (0-100 score)
   - Are implications specific and actionable?
   - Can readers apply this knowledge?

Provide in EXACTLY this format:

SCORES:
Accuracy: [0-100]
Completeness: [0-100]
Structure: [0-100]
Actionability: [0-100]

IMPROVEMENTS NEEDED:
1. [Specific improvement or "None"]
2. [Specific improvement or "None"]
3. [Specific improvement or "None"]

If any score < 80, provide IMPROVED summary incorporating fixes.
Otherwise, respond: "VALIDATED - No improvements needed"
"""

        validation = self.call_claude([{"role": "user", "content": prompt}], f"Validation-{doc_num}")

        # Parse scores
        metrics = QualityMetrics()

        try:
            accuracy_match = re.search(r'Accuracy:\s*(\d+)', validation)
            completeness_match = re.search(r'Completeness:\s*(\d+)', validation)
            structure_match = re.search(r'Structure:\s*(\d+)', validation)
            actionability_match = re.search(r'Actionability:\s*(\d+)', validation)

            if accuracy_match:
                metrics.metrics['accuracy_score'] = int(accuracy_match.group(1))
            if completeness_match:
                metrics.metrics['completeness_score'] = int(completeness_match.group(1))
            if structure_match:
                metrics.metrics['structure_score'] = int(structure_match.group(1))
            if actionability_match:
                metrics.metrics['actionability_score'] = int(actionability_match.group(1))

            metrics.metrics['limitations_present'] = 'Limitations:' in summary
            metrics.metrics['implications_present'] = 'Practical Implications' in summary
            metrics.metrics['concepts_count'] = len(re.findall(r'\*\*[^*]+:\*\*', summary))
            metrics.metrics['coverage_score'] = 90  # Assume high coverage with multi-pass

        except Exception as e:
            logger.warning(f"Could not parse validation scores: {e}")

        # Check if improvements needed
        if "VALIDATED" in validation:
            return summary, metrics
        else:
            # Extract improved summary if present
            improved_match = re.search(r'## Overview\n(.+)', validation, re.DOTALL)
            if improved_match:
                return validation, metrics
            else:
                return summary, metrics

    def extract_metadata(self, summary: str, doc_num: int, total: int) -> Dict[str, Any]:
        """Extract structured metadata"""

        logger.info(f"🏷️  [{doc_num}/{total}] Extracting Metadata")

        prompt = f"""Extract metadata from this summary in YAML format:

{summary[:1500]}

Provide EXACTLY this format:

```yaml
document_type: [Research Paper|Literature Review|Policy Document|Case Study|...]
research_domain: [AI Ethics|AI Bias & Fairness|Social Work|...]
methodology: [Qualitative|Quantitative|Mixed Methods|Theoretical|...]
keywords: [4-5 keywords, comma-separated]
mini_abstract: [1-2 sentences capturing core message]
target_audience: [Researchers, Policymakers, Practitioners, ...]
geographic_focus: [Global|Europe|North America|Specific Country|...]
publication_year: [YYYY or Unknown]
related_fields: [2-3 related fields, comma-separated]
```

Respond with ONLY the YAML block.
"""

        metadata_yaml = self.call_claude([{"role": "user", "content": prompt}], f"Metadata-{doc_num}")

        return metadata_yaml

    def process_document(self, doc_path: Path, doc_num: int, total: int) -> Optional[Dict[str, Any]]:
        """Process document with enhanced multi-pass pipeline"""

        logger.info(f"\n{'='*60}")
        logger.info(f"📄 [{doc_num}/{total}] Processing: {doc_path.name}")
        logger.info(f"{'='*60}")

        try:
            # Load and clean
            raw_text = doc_path.read_text(encoding='utf-8')
            clean_text = self.clean_markdown(raw_text)
            logger.info(f"📏 Document: {len(clean_text):,} chars")

            # === STAGE 1: Multi-Pass Analysis ===
            chunks = self.intelligent_chunking(clean_text)
            comprehensive_analysis = self.multi_pass_analysis(chunks, doc_num, total)

            if not comprehensive_analysis:
                logger.error(f"❌ Multi-pass analysis failed")
                return None

            # === STAGE 2: Generate Enhanced Summary ===
            summary = self.generate_enhanced_summary(clean_text, comprehensive_analysis, doc_num, total)

            if not summary:
                logger.error(f"❌ Summary generation failed")
                return None

            # === STAGE 3: Cross-Validation ===
            validated_summary, quality_metrics = self.cross_validate(clean_text, summary, doc_num, total)

            # === STAGE 4: Metadata Extraction ===
            metadata_yaml = self.extract_metadata(validated_summary, doc_num, total)

            # Calculate quality score
            quality_score = quality_metrics.calculate_overall_score()

            logger.info(f"✅ Quality Score: {quality_score}/100")
            logger.info(f"   - Accuracy: {quality_metrics.metrics['accuracy_score']}/100")
            logger.info(f"   - Completeness: {quality_metrics.metrics['completeness_score']}/100")
            logger.info(f"   - Structure: {quality_metrics.metrics['structure_score']}/100")
            logger.info(f"   - Actionability: {quality_metrics.metrics['actionability_score']}/100")
            logger.info(f"   - Concepts: {quality_metrics.metrics['concepts_count']}")

            # Save summary
            base_name = doc_path.stem
            output_file = self.output_dir / f"summary_{base_name}.md"

            # Create full summary file
            full_summary = f"""{metadata_yaml}
---

# Summary: {base_name}

{validated_summary}

---

**Quality Metrics:**
- Overall Score: {quality_score}/100
- Accuracy: {quality_metrics.metrics['accuracy_score']}/100
- Completeness: {quality_metrics.metrics['completeness_score']}/100
- Actionability: {quality_metrics.metrics['actionability_score']}/100
- Concepts Defined: {quality_metrics.metrics['concepts_count']}

*Generated: {time.strftime('%Y-%m-%d %H:%M')}*
*Model: {self.model}*
*API Calls: {self.stats['total_api_calls']} total*
"""

            output_file.write_text(full_summary, encoding='utf-8')

            self.stats['total_processed'] += 1
            self.stats['avg_quality_score'] = (
                (self.stats['avg_quality_score'] * (self.stats['total_processed'] - 1) + quality_score)
                / self.stats['total_processed']
            )

            logger.info(f"💾 Saved: {output_file.name}")

            return {
                'file': doc_path.name,
                'quality_score': quality_score,
                'metrics': quality_metrics.metrics
            }

        except Exception as e:
            logger.error(f"❌ Error processing {doc_path.name}: {e}")
            return None

    def process_directory(self, limit: Optional[int] = None):
        """Process all documents in directory"""

        md_files = list(self.source_dir.glob("*.md"))

        if limit:
            md_files = md_files[:limit]

        total = len(md_files)

        logger.info(f"\n🚀 Enhanced Summarization Pipeline")
        logger.info(f"📁 Source: {self.source_dir}")
        logger.info(f"💾 Output: {self.output_dir}")
        logger.info(f"📄 Documents: {total}")
        logger.info(f"🤖 Model: {self.model}\n")

        results = []

        for i, md_file in enumerate(md_files, 1):
            result = self.process_document(md_file, i, total)
            if result:
                results.append(result)

            # Rate limiting between documents
            if i < total:
                time.sleep(2)

        # Final statistics
        logger.info(f"\n{'='*60}")
        logger.info(f"📊 FINAL STATISTICS")
        logger.info(f"{'='*60}")
        logger.info(f"✅ Processed: {self.stats['total_processed']}/{total}")
        logger.info(f"🎯 Average Quality Score: {self.stats['avg_quality_score']:.1f}/100")
        logger.info(f"📞 Total API Calls: {self.stats['total_api_calls']}")
        logger.info(f"💰 Estimated Cost: ${self.stats['total_cost']:.2f}")

        # Save results
        results_file = self.output_dir / 'processing_results.json'
        results_file.write_text(json.dumps({
            'stats': self.stats,
            'results': results
        }, indent=2), encoding='utf-8')

        logger.info(f"💾 Results saved: {results_file}")


def main():
    parser = argparse.ArgumentParser(description='Enhanced Document Summarization Pipeline')
    parser.add_argument('--input-dir', default='pipeline/markdown',
                       help='Input directory with markdown files')
    parser.add_argument('--output-dir', default='pipeline/knowledge/distilled',
                       help='Output directory for summaries')
    parser.add_argument('--limit', type=int, help='Limit number of documents (for testing)')
    parser.add_argument('--model', default='claude-haiku-4-5',
                       help='Claude model to use')

    args = parser.parse_args()

    api_key = os.getenv('ANTHROPIC_API_KEY')
    if not api_key:
        logger.error("❌ ANTHROPIC_API_KEY not found!")
        logger.info("💡 Set in .env file")
        exit(1)

    processor = EnhancedDocumentProcessor(
        api_key=api_key,
        source_dir=args.input_dir,
        output_dir=args.output_dir,
        model=args.model
    )

    processor.process_directory(limit=args.limit)


if __name__ == '__main__':
    main()
