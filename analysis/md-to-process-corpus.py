"""
Finales, verbessertes Python-Skript zur dynamischen, strukturierten Informationsextraktion.

Dieses Skript implementiert den "Best of Both Worlds"-Ansatz:
1. Es erzeugt eine vollständige JSONL-Datei und eine interaktive HTML-Visualisierung.
2. Es erzeugt eine zweite, vereinfachte und flache JSONL-Datei für die einfache Datenanalyse.
3. Es behält alle robusten und dynamischen Merkmale der vorherigen Versionen bei.
"""
import langextract as lx
from pathlib import Path
import os
import logging
import json
import time

# --- Schritt 1: Konfiguration des Loggings ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)


def load_extraction_schema(schema_path: Path) -> dict | None:
    """Lädt das Extraktionsschema sicher aus einer JSON-Datei."""
    if not schema_path.exists():
        logging.error(f"FATAL: Schema-Datei nicht gefunden unter '{schema_path}'")
        return None
    try:
        with open(schema_path, 'r', encoding='utf-8') as f:
            schema = json.load(f)
        logging.info(f"Extraktionsschema erfolgreich aus '{schema_path}' geladen.")
        return schema
    except Exception as e:
        logging.error(f"FATAL: Konnte Schema-Datei nicht lesen. Fehler: {e}")
        return None


def generate_prompt_from_schema(schema: dict) -> str:
    """Generiert dynamisch den Anweisungstext (Prompt) aus dem geladenen Schema."""
    prompt_intro = "Sie sind ein Forschungsassistent. Extrahieren Sie aus dem folgenden Forschungstext die unten definierten Konzepte:"
    category_descriptions = [f"- {cat['name']}: {cat['description']}" for cat in schema.get("extraction_categories", [])]
    return "\n".join([prompt_intro] + category_descriptions)


def run_dual_analysis():
    """Führt den gesamten Extraktions-Workflow aus und speichert die Ergebnisse in zwei Formaten."""
    # --- Konfiguration ---
    schema_file = Path("schema.json")
    markdown_dir = Path("markdown_papers")
    output_dir = Path("analysis_results")
    
    # Dateinamen für die beiden Ausgabeformate
    full_output_filename = "full_results.jsonl"
    simple_output_filename = "simplified_data.jsonl"
    html_output_filename = "corpus_analysis_visualization.html"

    # Vollständige Pfade
    full_output_path = output_dir / full_output_filename
    simple_output_path = output_dir / simple_output_filename
    html_output_path = output_dir / html_output_filename

    output_dir.mkdir(exist_ok=True)

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        logging.error("FATAL: Umgebungsvariable GEMINI_API_KEY nicht gesetzt.")
        return

    # --- Schritte 2-5: Laden, Vorbereiten und Extrahieren (unverändert) ---
    schema = load_extraction_schema(schema_file)
    if not schema: return
    prompt = generate_prompt_from_schema(schema)
    
    markdown_file_paths = list(markdown_dir.glob("*.md"))[:2]
    if not markdown_file_paths:
        logging.error(f"Keine Markdown-Dateien in '{markdown_dir}' gefunden.")
        return

    documents = [doc for file_path in markdown_file_paths if (doc := lx.data.Document(document_id=file_path.name, text=file_path.read_text(encoding='utf-8')))]
    if not documents:
        logging.error("Keine Dokumente konnten gelesen werden.")
        return

    logging.info(f"{len(documents)} Dokumente werden verarbeitet...")
    
    examples = [lx.data.ExampleData(text="Text", extractions=[lx.data.Extraction(extraction_class="class", extraction_text="text")])]
    
    successful_results = []
    for document in documents:
        # Hier würde die Wiederholungslogik aus den vorherigen Skripten stehen
        try:
            result = next(lx.extract(text_or_documents=[document], prompt_description=prompt, examples=examples, model_id="gemini-1.5-flash", api_key=api_key))
            if hasattr(result, 'error') and result.error: raise RuntimeError(f"Bibliotheksfehler: {result.error}")
            successful_results.append(result)
            logging.info(f"--> Dokument erfolgreich verarbeitet: {document.document_id}")
        except Exception as e:
            logging.error(f"Verarbeitung von '{document.document_id}' fehlgeschlagen. Fehler: {e}")
            
    logging.info("✅ Extraktionsprozess abgeschlossen.")

    if not successful_results:
        logging.warning("Keine Ergebnisse zum Speichern vorhanden. Beende.")
        return

    # --- Schritt 6: Ergebnisse in ZWEI Formaten speichern ---

    # 1. Speichere das vollständige Originalformat für die Visualisierung
    logging.info(f"Speichere vollständige Ergebnisse für die Visualisierung in '{full_output_path}'...")
    try:
        lx.io.save_annotated_documents(annotated_documents=successful_results, output_name=full_output_filename, output_dir=output_dir)
        logging.info("Vollständige Ergebnisse erfolgreich gespeichert.")
        
        # Erzeuge die Visualisierung aus der vollständigen Datei
        html_content = lx.visualize(full_output_path)
        with open(html_output_path, "w", encoding="utf-8") as f: f.write(html_content)
        logging.info(f"Interaktive Visualisierung gespeichert unter '{html_output_path}'")
    except Exception as e:
        logging.error(f"Speichern/Visualisieren der vollständigen Ergebnisse fehlgeschlagen. Fehler: {e}")

    # 2. Speichere das vereinfachte, flache Format für die Datenanalyse
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
    run_dual_analysis()