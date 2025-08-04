"""
Finales, produktives Python-Skript zur dynamischen, strukturierten Informationsextraktion.

Version 3.0: Beinhaltet die korrekte Methode zur Übergabe von Modell-Parametern
(language_model_type) an die extract-Funktion.
"""
import langextract as lx
from langextract.inference import GeminiLanguageModel
from pathlib import Path
import os
import logging
import json
import re

# --- Schritt 1: Konfiguration des Loggings ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)


def preprocess_markdown(text: str) -> str:
    """Bereinigt den Markdown-Text, um Rauschen für das LLM zu entfernen."""
    logging.info(f"Starte Vorverarbeitung für Textausschnitt: {text[:70].strip()}...")
    parts = text.split('---', 2)
    if len(parts) > 2: text = parts[2]
    text = re.sub(r'', '', text)
    lines = text.splitlines()
    disclaimer_phrases = ["Funded by the European Union.", "Neither the European Union nor EACEA can be held responsible for them."]
    lines = [line for line in lines if not any(phrase in line for phrase in disclaimer_phrases)]
    cleaned_text = "\n".join(lines)
    logging.info("Vorverarbeitung abgeschlossen.")
    return cleaned_text


def load_extraction_schema(schema_path: Path) -> dict | None:
    """Lädt das Extraktionsschema sicher aus einer JSON-Datei."""
    if not schema_path.exists():
        logging.error(f"FATAL: Schema-Datei nicht gefunden unter '{schema_path}'")
        return None
    try:
        with open(schema_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        logging.error(f"FATAL: Konnte Schema-Datei nicht lesen. Fehler: {e}")
        return None


def generate_prompt_from_schema(schema: dict) -> str:
    """Generiert dynamisch den Anweisungstext (Prompt) aus dem geladenen Schema."""
    prompt_intro = "Sie sind ein Forschungsassistent. Extrahieren Sie aus dem folgenden Forschungstext die unten definierten Konzepte:"
    category_descriptions = [f"- {cat['name']}: {cat['description']}" for cat in schema.get("extraction_categories", [])]
    return "\n".join([prompt_intro] + category_descriptions)


def run_analysis_pipeline():
    """Führt den gesamten Extraktions-Workflow aus und speichert die Ergebnisse in zwei Formaten."""
    schema_file = Path("schema.json")
    markdown_dir = Path("markdown_papers")
    output_dir = Path("analysis_results")
    
    full_output_filename = "full_results.jsonl"
    simple_output_filename = "simplified_data.jsonl"
    html_output_filename = "corpus_analysis_visualization.html"

    full_output_path = output_dir / full_output_filename
    simple_output_path = output_dir / simple_output_filename
    html_output_path = output_dir / html_output_filename

    output_dir.mkdir(exist_ok=True)

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        logging.error("FATAL: Umgebungsvariable GEMINI_API_KEY nicht gesetzt.")
        return

    schema = load_extraction_schema(schema_file)
    if not schema: return
    prompt = generate_prompt_from_schema(schema)
    
    markdown_file_paths = list(markdown_dir.glob("*.md"))
    if not markdown_file_paths:
        logging.error(f"Keine Markdown-Dateien in '{markdown_dir}' gefunden.")
        return
        
    documents = []
    for file_path in markdown_file_paths:
        try:
            raw_content = file_path.read_text(encoding='utf-8')
            cleaned_content = preprocess_markdown(raw_content)
            doc = lx.data.Document(document_id=file_path.name, text=cleaned_content)
            documents.append(doc)
        except Exception as e:
            logging.error(f"Lesen/Vorverarbeiten von {file_path.name} fehlgeschlagen: {e}")

    if not documents:
        logging.error("Keine Dokumente konnten gelesen werden.")
        return

    logging.info(f"{len(documents)} Dokumente werden verarbeitet...")
    successful_results = []
    for document in documents:
        try:
            logging.info(f"Verarbeite Dokument: {document.document_id}...")
            
            # *** FINALE, KORREKTE API-AUFRUF-STRUKTUR ***
            result = next(lx.extract(
                text_or_documents=[document],
                prompt_description=prompt,
                # 1. Spezifiziere den TYP des Modells
                language_model_type=GeminiLanguageModel,
                # 2. Übergib alle Konfigurations-Argumente direkt
                model_id="gemini-1.5-pro",
                api_key=api_key,
                safety_settings={
                    'HARM_CATEGORY_HARASSMENT': 'BLOCK_NONE',
                    'HARM_CATEGORY_HATE_SPEECH': 'BLOCK_NONE',
                    'HARM_CATEGORY_SEXUALLY_EXPLICIT': 'BLOCK_NONE',
                    'HARM_CATEGORY_DANGEROUS_CONTENT': 'BLOCK_NONE',
                }
            ))

            if hasattr(result, 'error') and result.error:
                raise RuntimeError(f"Bibliotheksfehler: {result.error}")
            successful_results.append(result)
            logging.info(f"--> Dokument erfolgreich verarbeitet: {document.document_id}")
        except Exception as e:
            logging.error(f"Verarbeitung von '{document.document_id}' fehlgeschlagen. Dokument wird übersprungen. Fehler: {e}")
            
    logging.info("✅ Extraktionsprozess abgeschlossen.")

    if not successful_results:
        logging.warning("Keine Ergebnisse zum Speichern vorhanden. Beende.")
        return

    # --- Speichern der Ergebnisse (unverändert) ---
    # 1. Vollständiges Format für die Visualisierung
    logging.info(f"Speichere vollständige Ergebnisse für die Visualisierung in '{full_output_path}'...")
    try:
        lx.io.save_annotated_documents(annotated_documents=successful_results, output_name=full_output_filename, output_dir=output_dir)
        html_content = lx.visualize(full_output_path)
        with open(html_output_path, "w", encoding="utf-8") as f: f.write(html_content)
        logging.info(f"Interaktive Visualisierung gespeichert unter '{html_output_path}'")
    except Exception as e:
        logging.error(f"Speichern/Visualisieren der vollständigen Ergebnisse fehlgeschlagen. Fehler: {e}")

    # 2. Vereinfachtes Format für die Datenanalyse
    logging.info(f"Speichere Extraktionen im vereinfachten Format in '{simple_output_path}'...")
    try:
        with open(simple_output_path, 'w', encoding='utf-8') as f:
            extraction_count = 0
            for annotated_doc in successful_results:
                for extraction in annotated_doc.extractions:
                    simple_record = {
                        "document": annotated_doc.document_id,
                        "category": extraction.extraction_class,
                        "extracted_text": extraction.extraction_text,
                        "start_char": extraction.char_interval.start,
                        "end_char": extraction.char_interval.end
                    }
                    f.write(json.dumps(simple_record) + '\n')
                    extraction_count += 1
        logging.info(f"✅ Erfolgreich {extraction_count} einzelne Extraktionen in '{simple_output_path}' gespeichert.")
    except Exception as e:
        logging.error(f"Speichern der vereinfachten Ergebnisse fehlgeschlagen. Fehler: {e}")


if __name__ == "__main__":
    run_analysis_pipeline()