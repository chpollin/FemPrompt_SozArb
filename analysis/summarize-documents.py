"""
PRODUCTION VERSION: Verarbeitet alle Markdown-Dokumente
mit dem bewährten dreistufigen Konversations-Workflow.

Basiert auf dem erfolgreichen Test-Skript mit erweiterten Features:
- Batch-Verarbeitung aller Dokumente
- Fortschritts-Tracking
- Robuste Fehlerbehandlung
- Detaillierte Statistiken
"""

import os
import json
import logging
import re
import requests
import time
from pathlib import Path
from typing import List, Dict, Any

# Setup Logging - detailliert aber nicht überwältigend
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

def preprocess_markdown(text: str) -> str:
    """Bereinigt den Markdown-Text, um Rauschen für das LLM zu entfernen."""
    
    # YAML-Frontmatter entfernen
    parts = text.split('---', 2)
    if len(parts) > 2: 
        text = parts[2]
    
    # HTML-Kommentare entfernen
    text = re.sub(r'<!--.*?-->', '', text, flags=re.DOTALL)
    
    # Disclaimer-Zeilen entfernen
    lines = text.splitlines()
    disclaimer_phrases = [
        "Funded by the European Union.", 
        "Neither the European Union nor EACEA can be held responsible for them.",
        "This document was funded by the European Union.",
        "The views and opinions expressed are those of the author(s) only"
    ]
    
    lines = [line for line in lines if not any(phrase in line for phrase in disclaimer_phrases)]
    cleaned_text = "\n".join(lines).strip()
    
    return cleaned_text

def call_gemini_api(conversation_history: List[Dict[str, str]], api_key: str, stage_name: str, max_retries: int = 3) -> str:
    """
    Ruft die echte Gemini API auf mit Retry-Mechanismus für 503-Fehler
    """
    
    for attempt in range(max_retries):
        try:
            if attempt > 0:
                wait_time = 2 ** attempt  # Exponential backoff: 2, 4, 8 Sekunden
                logging.info(f"Retry {attempt + 1}/{max_retries} für {stage_name} - Warte {wait_time}s...")
                time.sleep(wait_time)
            
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
            
            # Konvertiere Konversationshistorie zu Gemini-Format
            contents = []
            for msg in conversation_history:
                role = "user" if msg["role"] == "user" else "model"
                contents.append({
                    "role": role,
                    "parts": [{"text": msg["content"]}]
                })
            
            payload = {
                "contents": contents,
                "generationConfig": {
                    "temperature": 0.3,
                    "maxOutputTokens": 2048,
                    "topP": 0.8,
                    "topK": 40
                },
                "safetySettings": [
                    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"}
                ]
            }
            
            response = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=30)
            
            # Bei 503 (Service Unavailable) retry versuchen
            if response.status_code == 503:
                if attempt < max_retries - 1:
                    logging.warning(f"503 Service Unavailable - Retry...")
                    continue
                else:
                    raise requests.exceptions.RequestException(f"Gemini API nicht verfügbar nach {max_retries} Versuchen")
            
            response.raise_for_status()
            result = response.json()
            
            if "candidates" in result and len(result["candidates"]) > 0:
                candidate = result["candidates"][0]
                if "content" in candidate and "parts" in candidate["content"]:
                    response_text = candidate["content"]["parts"][0]["text"]
                    return response_text
                else:
                    logging.error(f"Unerwartete API-Antwortstruktur in {stage_name}")
                    return f"Fehler: Keine gültige Antwort erhalten in {stage_name}."
            else:
                logging.error(f"Keine Kandidaten in API-Antwort für {stage_name}")
                return f"Fehler: API-Antwort enthält keine Kandidaten in {stage_name}."
                
        except requests.exceptions.RequestException as e:
            if "503" in str(e) and attempt < max_retries - 1:
                continue
            else:
                logging.error(f"HTTP-Fehler in {stage_name}: {e}")
                raise
        except Exception as e:
            logging.error(f"Unerwarteter Fehler in {stage_name}: {e}")
            raise
    
    raise requests.exceptions.RequestException(f"Alle {max_retries} Versuche für {stage_name} fehlgeschlagen")

def create_three_stage_summary(document_path: Path, api_key: str, doc_number: int, total_docs: int) -> Dict[str, Any]:
    """
    Führt den dreistufigen Konversations-Workflow für ein Dokument durch.
    """
    
    logging.info(f"📄 [{doc_number}/{total_docs}] Verarbeite: {document_path.name}")
    
    # Dokument lesen und vorverarbeiten
    try:
        raw_content = document_path.read_text(encoding='utf-8')
        cleaned_content = preprocess_markdown(raw_content)
        logging.info(f"Cleaned: {len(raw_content):,} → {len(cleaned_content):,} characters")
    except Exception as e:
        logging.error(f"Fehler beim Lesen von {document_path.name}: {e}")
        return None
    
    # Konversationshistorie initialisieren
    conversation_history = []
    
    # STUFE 1: Analyse des akademischen Narrativs
    logging.info(f"🔍 [{doc_number}/{total_docs}] Stage 1: Analysis...")
    stage1_prompt = f"""
Analyze the following academic document and identify the underlying academic narrative:

DOCUMENT:
---
{cleaned_content[:4000]}...
---

Please analyze systematically:
1. The main theme and central research question
2. The most important arguments and theses
3. The methodology used or theoretical framework
4. The main findings and conclusions
5. The position of the document in the broader scientific discourse

Respond structured and precisely in maximum 400 words. Write your response in English, even if the input document is in German.
"""
    
    conversation_history.append({"role": "user", "content": stage1_prompt})
    
    try:
        stage1_response = call_gemini_api(conversation_history, api_key, "Stage 1")
        conversation_history.append({"role": "model", "content": stage1_response})
        logging.info(f"✅ [{doc_number}/{total_docs}] Stage 1 completed ({len(stage1_response)} characters)")
    except Exception as e:
        logging.error(f"❌ [{doc_number}/{total_docs}] Stage 1 failed: {e}")
        return None
    
    # STUFE 2: Synthese der Zusammenfassung
    logging.info(f"📝 [{doc_number}/{total_docs}] Stage 2: Synthesis...")
    stage2_prompt = """
Based on your analysis, now create a compact, structured summary of the document. 

The summary should:
- Comprise a maximum of 500 words
- Highlight the most important findings
- Retain relevant concepts and terminology
- Be structured in Markdown format
- Be optimized for further automated analysis

Use this structure:
## Overview
## Main Findings  
## Methodology/Approach
## Relevant Concepts
## Significance for the Research Field

Create a substantial, informative summary in English, even if the original document is in German.
"""
    
    conversation_history.append({"role": "user", "content": stage2_prompt})
    
    try:
        stage2_response = call_gemini_api(conversation_history, api_key, "Stage 2")
        conversation_history.append({"role": "model", "content": stage2_response})
        logging.info(f"✅ [{doc_number}/{total_docs}] Stage 2 completed ({len(stage2_response)} characters)")
    except Exception as e:
        logging.error(f"❌ [{doc_number}/{total_docs}] Stage 2 failed: {e}")
        return None
        
    # STUFE 3: Validierung der Vollständigkeit
    logging.info(f"🔍 [{doc_number}/{total_docs}] Stage 3: Validation...")
    stage3_prompt = """
Critically review your summary:

1. Have all essential information from the original document been captured?
2. Are the most important findings correctly represented?
3. Are important concepts or terminologies missing?
4. Is the summary suitable for automated content analysis?

If improvements are needed, create a revised version of the summary.
If the summary is complete, confirm this and provide the final version of the summary.

IMPORTANT: Provide the final, complete summary in English, not just a validation note. Even if the original document is in German, your summary must be in English.
"""
    
    conversation_history.append({"role": "user", "content": stage3_prompt})
    
    try:
        stage3_response = call_gemini_api(conversation_history, api_key, "Stufe 3")
        conversation_history.append({"role": "model", "content": stage3_response})
        logging.info(f"✅ [{doc_number}/{total_docs}] Stage 3 completed ({len(stage3_response)} characters)")
    except Exception as e:
        logging.error(f"❌ [{doc_number}/{total_docs}] Stage 3 failed: {e}")
        return None
    
    return {
        "document_name": document_path.name,
        "original_length": len(raw_content),
        "cleaned_length": len(cleaned_content),
        "stage1_response": stage1_response,
        "stage2_response": stage2_response,
        "stage3_response": stage3_response,
        "final_summary_length": len(stage3_response),
        "compression_ratio": len(stage3_response) / len(raw_content)
    }

def process_all_documents():
    """
    Hauptfunktion: Verarbeitet alle Markdown-Dokumente und erstellt Zusammenfassungen
    """
    
    # Konfiguration
    markdown_dir = Path("markdown_papers")
    summaries_dir = Path("markdown_summaries_production")
    metadata_file = summaries_dir / "batch_processing_metadata.json"
    
    # Verzeichnisse erstellen
    summaries_dir.mkdir(exist_ok=True)
    
    # API Key prüfen
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        logging.error("FATAL: Umgebungsvariable GEMINI_API_KEY nicht gesetzt.")
        return
    
    # Markdown-Dateien finden
    markdown_files = list(markdown_dir.glob("*.md"))
    if not markdown_files:
        logging.error(f"Keine Markdown-Dateien in '{markdown_dir}' gefunden.")
        return
    
    # Sortieren für konsistente Reihenfolge
    markdown_files.sort()
    
    logging.info("🚀 STARTING BATCH PROCESSING")
    logging.info("="*60)
    logging.info(f"📁 Source directory: {markdown_dir}")
    logging.info(f"📁 Target directory: {summaries_dir}")
    logging.info(f"📊 Number of documents: {len(markdown_files)}")
    logging.info("="*60)
    
    successful_summaries = []
    failed_documents = []
    start_time = time.time()
    
    for i, document_path in enumerate(markdown_files, 1):
        try:
            # Dreistufige Zusammenfassung erstellen
            result = create_three_stage_summary(document_path, api_key, i, len(markdown_files))
            
            if result:
                # Zusammenfassung als Markdown-Datei speichern
                summary_filename = f"summary_{document_path.stem}.md"
                summary_path = summaries_dir / summary_filename
                
                # Metadaten-Header für die Zusammenfassung
                header = f"""---
original_document: {document_path.name}
created_at: {time.strftime('%Y-%m-%d %H:%M:%S')}
original_length: {result['original_length']} characters
cleaned_length: {result['cleaned_length']} characters
final_summary_length: {result['final_summary_length']} characters
compression_ratio: {result['compression_ratio']:.2%}
processing_order: {i}
language: English
---

# Summary: {document_path.stem}

## Stage 1: Academic Analysis
{result['stage1_response']}

## Stage 2: Structured Summary
{result['stage2_response']}

## Stage 3: Final Validated Summary
{result['stage3_response']}
"""
                
                with open(summary_path, 'w', encoding='utf-8') as f:
                    f.write(header)
                
                successful_summaries.append(result)
                logging.info(f"💾 [{i}/{len(markdown_files)}] Saved: {summary_filename}")
                
                # Pause zwischen Dokumenten zur Schonung der API
                if i < len(markdown_files):  # Nicht nach dem letzten Dokument
                    time.sleep(3)
                
            else:
                failed_documents.append(document_path.name)
                logging.warning(f"⚠️ [{i}/{len(markdown_files)}] Skipped: {document_path.name}")
                
        except Exception as e:
            logging.error(f"❌ [{i}/{len(markdown_files)}] Critical error for {document_path.name}: {e}")
            failed_documents.append(document_path.name)
    
    # Verarbeitung abgeschlossen
    end_time = time.time()
    processing_time = end_time - start_time
    
    # Statistiken berechnen
    if successful_summaries:
        avg_compression = sum(s['compression_ratio'] for s in successful_summaries) / len(successful_summaries)
        avg_original_length = sum(s['original_length'] for s in successful_summaries) / len(successful_summaries)
        avg_summary_length = sum(s['final_summary_length'] for s in successful_summaries) / len(successful_summaries)
    else:
        avg_compression = avg_original_length = avg_summary_length = 0
    
    # Metadaten speichern
    metadata = {
        "processing_summary": {
            "total_documents": len(markdown_files),
            "successful_summaries": len(successful_summaries),
            "failed_documents": len(failed_documents),
            "success_rate": f"{len(successful_summaries) / len(markdown_files) * 100:.1f}%"
        },
        "timing": {
            "start_time": time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(start_time)),
            "end_time": time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(end_time)),
            "total_processing_time": f"{processing_time / 60:.1f} minutes",
            "average_time_per_document": f"{processing_time / len(markdown_files):.1f} seconds"
        },
        "statistics": {
            "average_compression_ratio": f"{avg_compression:.2%}",
            "average_original_length": f"{avg_original_length:,.0f} characters",
            "average_summary_length": f"{avg_summary_length:,.0f} characters"
        },
        "failed_documents": failed_documents,
        "file_list": [s['document_name'] for s in successful_summaries]
    }
    
    with open(metadata_file, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)
    
    # Abschlussbericht
    logging.info("="*60)
    logging.info("🎉 BATCH PROCESSING COMPLETED")
    logging.info("="*60)
    logging.info(f"📊 Total documents: {len(markdown_files)}")
    logging.info(f"✅ Successfully processed: {len(successful_summaries)}")
    logging.info(f"❌ Failed: {len(failed_documents)}")
    logging.info(f"📈 Success rate: {len(successful_summaries) / len(markdown_files) * 100:.1f}%")
    logging.info(f"⏱️ Total time: {processing_time / 60:.1f} minutes")
    logging.info(f"⚡ Avg time per document: {processing_time / len(markdown_files):.1f} seconds")
    if successful_summaries:
        logging.info(f"📉 Avg compression: {avg_compression:.2%}")
        logging.info(f"📏 Avg original length: {avg_original_length:,.0f} characters")
        logging.info(f"📏 Avg summary length: {avg_summary_length:,.0f} characters")
    logging.info(f"📁 Summaries: {summaries_dir}")
    logging.info(f"📄 Metadata: {metadata_file}")
    
    if failed_documents:
        logging.warning("⚠️ Failed documents:")
        for doc in failed_documents:
            logging.warning(f"   - {doc}")
    else:
        logging.info("🎯 All documents processed successfully!")
    
    logging.info("="*60)

if __name__ == "__main__":
    process_all_documents()