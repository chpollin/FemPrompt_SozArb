#!/usr/bin/env python3
"""
Claude Haiku 4.5 Document Processor
Alternative to Gemini - uses Anthropic Claude Haiku for document summarization
"""

import os
import json
import logging
import re
import time
import argparse
from pathlib import Path
from typing import List, Dict, Any, Optional

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

class ClaudeDocumentProcessor:
    def __init__(self, api_key: str, source_dir: str = "analysis/markdown_papers",
                 output_dir: str = "analysis/summaries_final", model: str = "claude-3-5-haiku-20241022"):
        self.api_key = api_key
        self.source_dir = Path(source_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True, parents=True)
        self.model = model  # claude-3-5-haiku-20241022 or claude-3-5-sonnet-20241022
        self.client = Anthropic(api_key=api_key)

    def clean_markdown(self, text: str) -> str:
        """Clean markdown text from noise"""
        # Remove YAML frontmatter
        parts = text.split('---', 2)
        if len(parts) > 2:
            text = parts[2]

        # Remove HTML comments
        text = re.sub(r'<!--.*?-->', '', text, flags=re.DOTALL)

        # Remove EU disclaimers
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

                return response.content[0].text

            except Exception as e:
                logger.error(f"{stage} - Attempt {attempt+1} failed: {e}")
                if attempt == retries - 1:
                    return None

        return None

    def process_document(self, doc_path: Path, doc_num: int, total: int) -> Optional[Dict[str, Any]]:
        """Process document with 5-stage workflow"""

        logger.info(f"📄 [{doc_num}/{total}] Processing: {doc_path.name}")

        try:
            # Load and clean document
            raw_text = doc_path.read_text(encoding='utf-8')
            clean_text = self.clean_markdown(raw_text)
            logger.info(f"Cleaned: {len(raw_text):,} → {len(clean_text):,} chars")

            # STAGE 1: Academic Analysis
            logger.info(f"🔍 [{doc_num}/{total}] Stage 1: Academic Analysis")

            stage1_prompt = f"""Analyze this academic document systematically:

DOCUMENT (first 4000 chars):
{clean_text[:4000]}...

Provide analysis in exactly this structure:
1. Main theme and research question
2. Key arguments and theses
3. Methodology/theoretical framework
4. Main findings and conclusions
5. Position in scientific discourse

Write in English, max 400 words, be precise and structured."""

            stage1_response = self.call_claude([{"role": "user", "content": stage1_prompt}], f"Stage1-{doc_num}")
            if not stage1_response:
                return None

            logger.info(f"✅ [{doc_num}/{total}] Stage 1 completed ({len(stage1_response)} chars)")

            # STAGE 2: Structured Synthesis
            logger.info(f"📝 [{doc_num}/{total}] Stage 2: Synthesis")

            stage2_prompt = f"""Based on this analysis:

{stage1_response}

Create a comprehensive summary using EXACTLY this structure:

## Overview
[Overview paragraph]

## Main Findings
[Main findings paragraph]

## Methodology/Approach
[Methodology paragraph]

## Relevant Concepts
[Key concepts with definitions]

## Significance
[Significance paragraph]

Max 500 words total. Write substantial, informative content in English."""

            stage2_response = self.call_claude([
                {"role": "user", "content": stage1_prompt},
                {"role": "assistant", "content": stage1_response},
                {"role": "user", "content": stage2_prompt}
            ], f"Stage2-{doc_num}")

            if not stage2_response:
                return None

            logger.info(f"✅ [{doc_num}/{total}] Stage 2 completed ({len(stage2_response)} chars)")

            # STAGE 3: Critical Validation
            logger.info(f"🔍 [{doc_num}/{total}] Stage 3: Validation")

            stage3_prompt = """Review your summary critically:
1. Are all essential findings captured?
2. Are key concepts properly represented?
3. Is it suitable for automated analysis?
4. Any missing important information?

If improvements needed, provide the IMPROVED version.
If it's good, confirm and provide the SAME summary again.
Use the exact same structure as before."""

            stage3_response = self.call_claude([
                {"role": "user", "content": stage1_prompt},
                {"role": "assistant", "content": stage1_response},
                {"role": "user", "content": stage2_prompt},
                {"role": "assistant", "content": stage2_response},
                {"role": "user", "content": stage3_prompt}
            ], f"Stage3-{doc_num}")

            if not stage3_response:
                return None

            logger.info(f"✅ [{doc_num}/{total}] Stage 3 completed ({len(stage3_response)} chars)")

            # STAGE 4: Clean Final Summary
            logger.info(f"🧹 [{doc_num}/{total}] Stage 4: Clean Summary")

            stage4_prompt = """Output ONLY the final, clean summary.

NO meta-commentary, NO "here is the summary", NO explanations.
Start directly with "## Overview" and end with the last sentence of "## Significance".
NOTHING else before or after.

Use the exact structure:
## Overview
## Main Findings
## Methodology/Approach
## Relevant Concepts
## Significance"""

            stage4_response = self.call_claude([
                {"role": "user", "content": stage1_prompt},
                {"role": "assistant", "content": stage1_response},
                {"role": "user", "content": stage2_prompt},
                {"role": "assistant", "content": stage2_response},
                {"role": "user", "content": stage3_prompt},
                {"role": "assistant", "content": stage3_response},
                {"role": "user", "content": stage4_prompt}
            ], f"Stage4-{doc_num}")

            if not stage4_response:
                # Fallback: Extract clean summary from Stage 3
                stage4_response = self.extract_clean_summary(stage3_response)

            logger.info(f"✅ [{doc_num}/{total}] Stage 4 completed ({len(stage4_response)} chars)")

            # STAGE 5: Metadata Extraction
            logger.info(f"🏷️ [{doc_num}/{total}] Stage 5: Metadata")

            metadata_prompt = """Based on the complete document analysis, extract metadata in this EXACT YAML format:

```yaml
document_type: [Research Paper|Toolkit/Guide|Policy Document|Literature Review|Empirical Study|Conference Paper|Technical Report]
research_domain: [AI Ethics|AI Bias & Fairness|Generative AI|AI in Education|Machine Learning|Computer Vision|Natural Language Processing|Other]
methodology: [Empirical/Quantitative|Qualitative|Mixed Methods|Theoretical|Comparative Analysis|Case Study|Survey|Experimental|Literature Review|Applied/Practical]
keywords: [exactly 4-5 key terms, comma-separated]
mini_abstract: [1-2 sentences capturing the core message]
target_audience: [Researchers|Policymakers|Industry|Practitioners|Students|General Public|Mixed]
key_contributions: [main novel contribution in 5-8 words]
geographic_focus: [Global|Europe|North America|Asia|Specific Country|Not Applicable]
publication_year: [YYYY if detectable, otherwise "Unknown"]
related_fields: [2-3 related academic fields, comma-separated]
```

Respond with ONLY the YAML block, no other text."""

            metadata_response = self.call_claude([
                {"role": "user", "content": stage1_prompt},
                {"role": "assistant", "content": stage1_response},
                {"role": "user", "content": metadata_prompt}
            ], f"Metadata-{doc_num}")

            if not metadata_response:
                metadata_response = self.generate_fallback_metadata(doc_path.name)

            logger.info(f"✅ [{doc_num}/{total}] Stage 5 completed ({len(metadata_response)} chars)")

            return {
                "document_name": doc_path.name,
                "original_length": len(raw_text),
                "cleaned_length": len(clean_text),
                "stage1_response": stage1_response,
                "stage2_response": stage2_response,
                "stage3_response": stage3_response,
                "stage4_response": stage4_response,
                "metadata_response": metadata_response,
                "final_summary_length": len(stage4_response)
            }

        except Exception as e:
            logger.error(f"❌ [{doc_num}/{total}] Failed processing {doc_path.name}: {e}")
            return None

    def extract_clean_summary(self, text: str) -> str:
        """Extract only the summary without meta-comments"""
        lines = text.split('\n')

        # Find the start of the actual summary
        start_idx = 0
        for i, line in enumerate(lines):
            if line.strip().startswith('## Overview'):
                start_idx = i
                break

        # Remove meta-comments at the end
        end_idx = len(lines)
        for i in range(len(lines) - 1, -1, -1):
            if any(phrase in lines[i].lower() for phrase in [
                'no revisions', 'comprehensive', 'well-structured', 'final version'
            ]):
                end_idx = i
                break

        return '\n'.join(lines[start_idx:end_idx]).strip()

    def generate_fallback_metadata(self, filename: str) -> str:
        """Generate fallback metadata when Stage 5 fails"""
        return """document_type: Unknown
research_domain: Unknown
methodology: Unknown
keywords: Unknown
mini_abstract: Summary not available
target_audience: Unknown
key_contributions: Unknown
geographic_focus: Unknown
publication_year: Unknown
related_fields: Unknown"""

    def parse_metadata(self, metadata_yaml: str) -> Dict[str, str]:
        """Parse YAML metadata from Claude"""
        metadata = {}

        # Clean YAML block
        if "```yaml" in metadata_yaml:
            metadata_yaml = metadata_yaml.split("```yaml")[1].split("```")[0]
        elif "```" in metadata_yaml:
            parts = metadata_yaml.split("```")
            if len(parts) >= 2:
                metadata_yaml = parts[1]

        # Simple YAML parsing (robust)
        for line in metadata_yaml.split('\n'):
            line = line.strip()
            if ':' in line and not line.startswith('#'):
                try:
                    key, value = line.split(':', 1)
                    metadata[key.strip()] = value.strip()
                except:
                    continue

        return metadata

    def save_summary(self, result: Dict[str, Any], doc_num: int) -> None:
        """Save final summary with intelligent metadata"""

        summary_file = self.output_dir / f"summary_{Path(result['document_name']).stem}.md"
        metadata = self.parse_metadata(result['metadata_response'])

        # Generate title from filename
        title = Path(result['document_name']).stem.replace('_', ' ').replace('  ', ' ')

        # YAML Header with intelligent metadata
        yaml_header = f"""---
title: "{metadata.get('title', title)}"
original_document: {result['document_name']}
document_type: {metadata.get('document_type', 'Unknown')}
research_domain: {metadata.get('research_domain', 'Unknown')}
methodology: {metadata.get('methodology', 'Unknown')}
keywords: {metadata.get('keywords', 'Unknown')}
mini_abstract: "{metadata.get('mini_abstract', 'No abstract available')}"
target_audience: {metadata.get('target_audience', 'Unknown')}
key_contributions: "{metadata.get('key_contributions', 'Unknown')}"
geographic_focus: {metadata.get('geographic_focus', 'Unknown')}
publication_year: {metadata.get('publication_year', 'Unknown')}
related_fields: {metadata.get('related_fields', 'Unknown')}
summary_date: {time.strftime('%Y-%m-%d')}
language: English
ai_model: {self.model}
---"""

        # Final summary (ONLY Stage 4)
        content = f"""{yaml_header}

# Summary: {title}

{result['stage4_response']}
"""

        summary_file.write_text(content, encoding='utf-8')
        logger.info(f"💾 [{doc_num}] Saved: {summary_file.name}")

    def process_all(self) -> None:
        """Process all markdown documents"""

        # Find markdown files
        md_files = sorted(list(self.source_dir.glob("*.md")))
        if not md_files:
            logger.error(f"No markdown files found in {self.source_dir}")
            return

        logger.info("🚀 STARTING CLAUDE BATCH PROCESSING")
        logger.info("="*60)
        logger.info(f"📁 Source: {self.source_dir}")
        logger.info(f"📁 Output: {self.output_dir}")
        logger.info(f"📊 Documents: {len(md_files)}")
        logger.info(f"🔧 Model: {self.model}")
        logger.info("="*60)

        successful = []
        failed = []
        start_time = time.time()

        for i, doc_path in enumerate(md_files, 1):
            result = self.process_document(doc_path, i, len(md_files))

            if result:
                self.save_summary(result, i)
                successful.append(result)
            else:
                failed.append(doc_path.name)
                logger.warning(f"⚠️ [{i}/{len(md_files)}] Failed: {doc_path.name}")

            # Rate limiting between documents
            if i < len(md_files):
                time.sleep(2)  # Claude is faster than Gemini

        # Processing statistics
        end_time = time.time()
        processing_time = end_time - start_time

        # Metadata for batch
        if successful:
            avg_original = sum(s['original_length'] for s in successful) / len(successful)
            avg_summary = sum(s['final_summary_length'] for s in successful) / len(successful)
            avg_compression = avg_summary / avg_original * 100
        else:
            avg_original = avg_summary = avg_compression = 0

        batch_metadata = {
            "processing_summary": {
                "total_documents": len(md_files),
                "successful": len(successful),
                "failed": len(failed),
                "success_rate": f"{len(successful) / len(md_files) * 100:.1f}%"
            },
            "timing": {
                "start_time": time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(start_time)),
                "end_time": time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(end_time)),
                "total_time_minutes": f"{processing_time / 60:.1f}",
                "avg_time_per_doc": f"{processing_time / len(md_files):.1f}s"
            },
            "statistics": {
                "avg_original_length": f"{avg_original:,.0f} chars",
                "avg_summary_length": f"{avg_summary:,.0f} chars",
                "avg_compression": f"{avg_compression:.1f}%"
            },
            "failed_documents": failed,
            "model_used": self.model,
            "workflow_stages": 5
        }

        (self.output_dir / "batch_metadata.json").write_text(
            json.dumps(batch_metadata, indent=2, ensure_ascii=False), encoding='utf-8'
        )

        # Final report
        logger.info("="*60)
        logger.info("🎉 CLAUDE PROCESSING COMPLETED")
        logger.info("="*60)
        logger.info(f"✅ Success: {len(successful)}/{len(md_files)} ({len(successful)/len(md_files)*100:.1f}%)")
        logger.info(f"⏱️ Time: {processing_time/60:.1f} min ({processing_time/len(md_files):.1f}s/doc)")
        if successful:
            logger.info(f"📊 Avg compression: {avg_compression:.1f}%")
            logger.info(f"📏 Avg summary: {avg_summary:,.0f} chars")
        if failed:
            logger.warning(f"❌ Failed: {', '.join(failed)}")
        else:
            logger.info("🎯 All documents processed successfully!")
        logger.info(f"📁 Results: {self.output_dir}")
        logger.info("="*60)


def main():
    """Main function"""
    parser = argparse.ArgumentParser(description='Process documents with Claude Haiku/Sonnet')
    parser.add_argument('--source-dir', default='analysis/markdown_papers',
                       help='Directory with markdown files (default: analysis/markdown_papers)')
    parser.add_argument('--output-dir', default='analysis/summaries_final',
                       help='Output directory for summaries (default: analysis/summaries_final)')
    parser.add_argument('--api-key', default=None,
                       help='Anthropic API key (default: read from ANTHROPIC_API_KEY env var)')
    parser.add_argument('--model', default='claude-3-5-haiku-20241022',
                       choices=['claude-3-5-haiku-20241022', 'claude-3-5-sonnet-20241022'],
                       help='Claude model to use (default: haiku)')
    args = parser.parse_args()

    # API Key check
    api_key = args.api_key or os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        logger.error("❌ ANTHROPIC_API_KEY environment variable not set!")
        logger.info("💡 Set it with: export ANTHROPIC_API_KEY='your-key-here'")
        logger.info("💡 Or pass --api-key argument")
        return

    # Start processor
    logger.info(f"🚀 Starting Claude Document Processor ({args.model})")
    processor = ClaudeDocumentProcessor(api_key, args.source_dir, args.output_dir, args.model)
    processor.process_all()


if __name__ == "__main__":
    main()
