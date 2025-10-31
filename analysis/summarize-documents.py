#!/usr/bin/env python3
"""
Perfect Gemini 2.5 Flash Document Processor
Verarbeitet Markdown-Dokumente mit 5-stufigem Workflow:
1. Akademische Analyse
2. Strukturierte Synthese  
3. Kritische Validierung
4. Clean Summary (nur finale Zusammenfassung)
5. Intelligente Metadaten-Extraktion
"""

import os
import json
import logging
import re
import requests
import time
import yaml
from pathlib import Path
from typing import List, Dict, Any, Optional

# Logging Setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%H:%M:%S'
)
logger = logging.getLogger(__name__)

class GeminiDocumentProcessor:
    def __init__(self, api_key: str, source_dir: str = "analysis/markdown_papers",
                 output_dir: str = "analysis/summaries_final"):
        self.api_key = api_key
        self.source_dir = Path(source_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        self.url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
        
    def clean_markdown(self, text: str) -> str:
        """Bereinigt Markdown-Text von Rauschen"""
        # YAML Frontmatter entfernen
        parts = text.split('---', 2)
        if len(parts) > 2:
            text = parts[2]
        
        # HTML Kommentare entfernen
        text = re.sub(r'<!--.*?-->', '', text, flags=re.DOTALL)
        
        # EU-Disclaimer entfernen
        disclaimer_phrases = [
            "Funded by the European Union",
            "Neither the European Union nor EACEA",
            "This document was funded by",
            "The views and opinions expressed"
        ]
        
        lines = [line for line in text.splitlines() 
                if not any(phrase in line for phrase in disclaimer_phrases)]
        
        return "\n".join(lines).strip()
    
    def call_gemini(self, messages: List[Dict], stage: str, retries: int = 3) -> Optional[str]:
        """Ruft Gemini 2.5 Flash API auf mit Retry-Mechanismus"""
        
        payload = {
            "contents": [
                {"role": "user" if msg["role"] == "user" else "model", 
                 "parts": [{"text": msg["content"]}]}
                for msg in messages
            ],
            "generationConfig": {
                "temperature": 0.3,
                "maxOutputTokens": 2048,
                "topP": 0.8,
                "topK": 40,
                "thinkingConfig": {"thinkingBudget": 0}  # Kostenoptimiert
            },
            "safetySettings": [
                {"category": cat, "threshold": "BLOCK_NONE"}
                for cat in ["HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_HATE_SPEECH",
                           "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_DANGEROUS_CONTENT"]
            ]
        }
        
        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": self.api_key,
            "User-Agent": "DocumentProcessor/2.0"
        }
        
        for attempt in range(retries):
            try:
                if attempt > 0:
                    wait = min(2 ** attempt, 30)
                    logger.warning(f"{stage} - Retry {attempt+1}/{retries}, wait {wait}s")
                    time.sleep(wait)
                
                response = requests.post(self.url, json=payload, headers=headers, timeout=60)
                
                # Rate limiting handling
                if response.status_code == 429:
                    if attempt < retries - 1:
                        wait_time = 30 * (attempt + 1)
                        logger.warning(f"{stage} - Rate limited, wait {wait_time}s")
                        time.sleep(wait_time)
                        continue
                
                response.raise_for_status()
                result = response.json()
                
                if "candidates" in result and result["candidates"]:
                    return result["candidates"][0]["content"]["parts"][0]["text"]
                else:
                    logger.error(f"{stage} - No candidates in response")
                    return None
                    
            except Exception as e:
                logger.error(f"{stage} - Attempt {attempt+1} failed: {e}")
                if attempt == retries - 1:
                    return None
        
        return None
    
    def process_document(self, doc_path: Path, doc_num: int, total: int) -> Optional[Dict[str, Any]]:
        """Verarbeitet ein Dokument mit 5-Stufen-Workflow"""
        
        logger.info(f"📄 [{doc_num}/{total}] Processing: {doc_path.name}")
        
        try:
            # Dokument laden und bereinigen
            raw_text = doc_path.read_text(encoding='utf-8')
            clean_text = self.clean_markdown(raw_text)
            logger.info(f"Cleaned: {len(raw_text):,} → {len(clean_text):,} chars")
            
            conversation = []
            
            # STUFE 1: Akademische Analyse
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

            conversation.append({"role": "user", "content": stage1_prompt})
            
            stage1_response = self.call_gemini(conversation, f"Stage1-{doc_num}")
            if not stage1_response:
                return None
            
            conversation.append({"role": "assistant", "content": stage1_response})
            logger.info(f"✅ [{doc_num}/{total}] Stage 1 completed ({len(stage1_response)} chars)")
            
            # STUFE 2: Strukturierte Synthese
            logger.info(f"📝 [{doc_num}/{total}] Stage 2: Synthesis")
            
            stage2_prompt = """Based on your analysis, create a comprehensive summary using EXACTLY this structure:

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

            conversation.append({"role": "user", "content": stage2_prompt})
            
            stage2_response = self.call_gemini(conversation, f"Stage2-{doc_num}")
            if not stage2_response:
                return None
            
            conversation.append({"role": "assistant", "content": stage2_response})
            logger.info(f"✅ [{doc_num}/{total}] Stage 2 completed ({len(stage2_response)} chars)")
            
            # STUFE 3: Kritische Validierung
            logger.info(f"🔍 [{doc_num}/{total}] Stage 3: Validation")
            
            stage3_prompt = """Review your summary critically:
1. Are all essential findings captured?
2. Are key concepts properly represented?
3. Is it suitable for automated analysis?
4. Any missing important information?

If improvements needed, provide the IMPROVED version.
If it's good, confirm and provide the SAME summary again.
Use the exact same structure as Stage 2."""

            conversation.append({"role": "user", "content": stage3_prompt})
            
            stage3_response = self.call_gemini(conversation, f"Stage3-{doc_num}")
            if not stage3_response:
                return None
            
            conversation.append({"role": "assistant", "content": stage3_response})
            logger.info(f"✅ [{doc_num}/{total}] Stage 3 completed ({len(stage3_response)} chars)")
            
            # STUFE 4: Clean Final Summary
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

            conversation.append({"role": "user", "content": stage4_prompt})
            
            stage4_response = self.call_gemini(conversation, f"Stage4-{doc_num}")
            if not stage4_response:
                # Fallback: Extract clean summary from Stage 3
                stage4_response = self.extract_clean_summary(stage3_response)
            
            logger.info(f"✅ [{doc_num}/{total}] Stage 4 completed ({len(stage4_response)} chars)")
            
            # STUFE 5: Metadaten-Extraktion
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

            conversation.append({"role": "user", "content": metadata_prompt})
            
            metadata_response = self.call_gemini(conversation, f"Metadata-{doc_num}")
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
        """Extrahiert nur die Zusammenfassung ohne Meta-Kommentare"""
        lines = text.split('\n')
        
        # Finde den Start der eigentlichen Zusammenfassung
        start_idx = 0
        for i, line in enumerate(lines):
            if line.strip().startswith('## Overview'):
                start_idx = i
                break
        
        # Entferne Meta-Kommentare am Ende
        end_idx = len(lines)
        for i in range(len(lines) - 1, -1, -1):
            if any(phrase in lines[i].lower() for phrase in [
                'no revisions', 'comprehensive', 'well-structured', 'final version'
            ]):
                end_idx = i
                break
        
        return '\n'.join(lines[start_idx:end_idx]).strip()
    
    def generate_fallback_metadata(self, filename: str) -> str:
        """Generiert Fallback-Metadaten wenn Stage 5 fehlschlägt"""
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
        """Parst YAML Metadaten von Gemini"""
        metadata = {}
        
        # Bereinige YAML Block
        if "```yaml" in metadata_yaml:
            metadata_yaml = metadata_yaml.split("```yaml")[1].split("```")[0]
        elif "```" in metadata_yaml:
            parts = metadata_yaml.split("```")
            if len(parts) >= 2:
                metadata_yaml = parts[1]
        
        # Einfaches YAML Parsing (robust)
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
        """Speichert finale Zusammenfassung mit intelligenten Metadaten"""
        
        summary_file = self.output_dir / f"summary_{Path(result['document_name']).stem}.md"
        metadata = self.parse_metadata(result['metadata_response'])
        
        # Titel aus Dateiname generieren
        title = Path(result['document_name']).stem.replace('_', ' ').replace('  ', ' ')
        
        # YAML Header mit intelligenten Metadaten
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
---"""
        
        # Finale Zusammenfassung (NUR Stage 4)
        content = f"""{yaml_header}

# Summary: {title}

{result['stage4_response']}
"""
        
        summary_file.write_text(content, encoding='utf-8')
        logger.info(f"💾 [{doc_num}] Saved: {summary_file.name}")
    
    def process_all(self) -> None:
        """Verarbeitet alle Markdown-Dokumente"""
        
        # Markdown-Dateien finden
        md_files = sorted(list(self.source_dir.glob("*.md")))
        if not md_files:
            logger.error(f"No markdown files found in {self.source_dir}")
            return
        
        logger.info("🚀 STARTING PERFECT BATCH PROCESSING")
        logger.info("="*60)
        logger.info(f"📁 Source: {self.source_dir}")
        logger.info(f"📁 Output: {self.output_dir}")  
        logger.info(f"📊 Documents: {len(md_files)}")
        logger.info(f"🔧 Model: Gemini 2.5 Flash (thinkingBudget=0)")
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
            
            # Rate limiting zwischen Dokumenten (wichtig für API Limits)
            if i < len(md_files):
                time.sleep(10)  # 10 Sekunden Pause
        
        # Verarbeitungsstatistiken
        end_time = time.time()
        processing_time = end_time - start_time
        
        # Metadaten für Batch speichern
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
            "model_used": "gemini-2.5-flash",
            "workflow_stages": 5
        }
        
        (self.output_dir / "batch_metadata.json").write_text(
            json.dumps(batch_metadata, indent=2, ensure_ascii=False), encoding='utf-8'
        )
        
        # Abschlussbericht
        logger.info("="*60)
        logger.info("🎉 PERFECT PROCESSING COMPLETED")
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
    """Hauptfunktion"""
    # API Key prüfen
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        logger.error("❌ GEMINI_API_KEY environment variable not set!")
        logger.info("💡 Set it with: export GEMINI_API_KEY='your-key-here'")
        return
    
    # Processor starten
    logger.info("🚀 Starting Perfect Gemini Document Processor")
    processor = GeminiDocumentProcessor(api_key)
    processor.process_all()


if __name__ == "__main__":
    main()