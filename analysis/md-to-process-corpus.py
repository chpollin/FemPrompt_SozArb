"""
Perfektes Python-Skript zur dynamischen, strukturierten Informationsextraktion.

Dieses Skript implementiert einen robusten und flexiblen Workflow:
1. Lädt ein Extraktionsschema aus einer externen `schema.json`-Datei.
2. Generiert dynamisch einen Prompt für das KI-Modell.
3. Verarbeitet eine konfigurierbare Anzahl von Markdown-Dateien.
4. Nutzt einen Wiederholungsmechanismus für Netzwerkstabilität.
5. Verwendet die korrekte, dokumentierte Speicherfunktion `lx.io.save_annotated_documents`.
6. Erzeugt eine JSONL-Datei für maschinelle Analysen und eine interaktive HTML-Datei zur visuellen Prüfung.
"""

import langextract as lx
from pathlib import Path
import os
import logging
import json
import time

# --- Schritt 1: Konfiguration des Loggings ---
# Ein klares und informatives Logging-System wird konfiguriert.
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
    except json.JSONDecodeError:
        logging.error(f"FATAL: Schema-Datei '{schema_path}' ist kein valides JSON.")
        return None
    except Exception as e:
        logging.error(f"FATAL: Konnte Schema-Datei nicht lesen. Fehler: {e}")
        return None


def generate_prompt_from_schema(schema: dict) -> str:
    """Generiert dynamisch den Anweisungstext (Prompt) aus dem geladenen Schema."""
    prompt_intro = "Sie sind ein Forschungsassistent. Extrahieren Sie aus dem folgenden Forschungstext die unten definierten Konzepte:"
    
    category_descriptions = []
    for category in schema.get("extraction_categories", []):
        category_descriptions.append(
            f"- {category['name']}: {category['description']}"
        )
    
    return "\n".join([prompt_intro] + category_descriptions)


def run_analysis():
    """Führt den gesamten dynamischen Extraktions-Workflow aus."""
    # --- Konfiguration ---
    schema_file = Path("schema.json")
    markdown_dir = Path("markdown_papers")
    output_dir = Path("analysis_results")
    output_filename = "data.jsonl"
    output_jsonl_file = output_dir / output_filename
    output_html_path = output_dir / "corpus_analysis_visualization.html"

    # --- Verzeichnis erstellen, falls nicht vorhanden ---
    output_dir.mkdir(exist_ok=True)

    # --- API-Schlüssel sicher laden ---
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        logging.error("FATAL: Umgebungsvariable GEMINI_API_KEY nicht gesetzt. Bitte setzen Sie den Schlüssel und versuchen Sie es erneut.")
        return

    # --- Schritt 2: Schema laden und Prompt generieren ---
    schema = load_extraction_schema(schema_file)
    if not schema:
        return  # Abbruch, wenn das Schema nicht geladen werden konnte

    prompt = generate_prompt_from_schema(schema)
    logging.info("Dynamischer Prompt für die Extraktion wurde generiert.")

    # --- Schritt 3: Markdown-Dateien finden und einlesen ---
    if not markdown_dir.is_dir():
        logging.error(f"Quellverzeichnis '{markdown_dir}' nicht gefunden oder ist kein Verzeichnis.")
        return

    # Limitiere die Anzahl der Dateien auf 2 für schnelle Tests
    markdown_file_paths = list(markdown_dir.glob("*.md"))[:2]
    
    if not markdown_file_paths:
        logging.error(f"Keine Markdown-Dateien in '{markdown_dir}' gefunden.")
        return

    logging.info(f"{len(markdown_file_paths)} Markdown-Dateien zur Verarbeitung gefunden.")

    documents = []
    for file_path in markdown_file_paths:
        try:
            content = file_path.read_text(encoding='utf-8')
            doc = lx.data.Document(document_id=file_path.name, text=content)
            documents.append(doc)
        except Exception as e:
            logging.warning(f"Datei {file_path} konnte nicht gelesen werden. Übersprungen. Fehler: {e}")
    
    if not documents:
        logging.error("Keine Dokumente konnten gelesen werden. Abbruch.")
        return
        
    logging.info(f"{len(documents)} Dokument-Objekte erfolgreich erstellt.")

    # --- Schritt 4: Few-Shot-Beispiele definieren ---
    # Diese Beispiele helfen dem Modell, das korrekte Ausgabeformat zu verstehen.
    examples = [
        lx.data.ExampleData(
            text="Diese Arbeit stellt 'inklusives Prompt-Engineering' vor, um Verzerrungen in 'generativer KI' zu mindern.",
            extractions=[
                lx.data.Extraction(extraction_class="mitigation_strategy", extraction_text="inklusives Prompt-Engineering"),
                lx.data.Extraction(extraction_class="ai_technology", extraction_text="generative KI"),
            ]
        )
    ]

    # --- Schritt 5: Sequenzielle Extraktion mit Wiederholungslogik ---
    logging.info("Starte sequenzielle Extraktion...")
    successful_results = []
    max_retries = 3

    for document in documents:
        logging.info(f"Verarbeite Dokument: {document.document_id}...")
        for attempt in range(max_retries):
            try:
                results_generator = lx.extract(
                    text_or_documents=[document],
                    prompt_description=prompt,
                    examples=examples,
                    model_id="gemini-1.5-flash",
                    api_key=api_key
                )
                
                result = next(results_generator)

                if hasattr(result, 'error') and result.error:
                    raise RuntimeError(f"Bibliotheksfehler: {result.error}")
                
                successful_results.append(result)
                logging.info(f"--> Dokument erfolgreich verarbeitet: {document.document_id}")
                break  # Erfolgreich, Wiederholungsschleife für dieses Dokument verlassen

            except Exception as e:
                logging.warning(f"Versuch {attempt + 1}/{max_retries} für '{document.document_id}' fehlgeschlagen. Fehler: {e}")
                if attempt < max_retries - 1:
                    time.sleep(2) # Kurze Pause vor dem nächsten Versuch
                else:
                    logging.error(f"Alle {max_retries} Versuche für '{document.document_id}' fehlgeschlagen. Dokument wird übersprungen.")

    logging.info("✅ Extraktionsprozess abgeschlossen.")

    if not successful_results:
        logging.warning("Keine Ergebnisse zum Speichern vorhanden. Beende.")
        return

    # --- Schritt 6: Ergebnisse speichern und visualisieren ---
    logging.info(f"Speichere {len(successful_results)} Ergebnis-Dokument(e) in '{output_jsonl_file}'...")
    try:
        # KORREKTER AUFRUF laut offizieller GitHub-Dokumentation: in lx.io-Submodul
        lx.io.save_annotated_documents(
            annotated_documents=successful_results,
            output_name=output_filename, # Der Dateiname
            output_dir=output_dir         # Das Verzeichnis-Objekt
        )
        logging.info("Strukturierte Ergebnisse erfolgreich gespeichert.")
    except Exception as e:
        logging.error(f"Speichern der Ergebnisse fehlgeschlagen. Fehler: {e}")
        return

    logging.info("Generiere interaktive Visualisierung...")
    try:
        html_content = lx.visualize(output_jsonl_file)
        with open(output_html_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        logging.info(f"Interaktive Visualisierung gespeichert unter '{output_html_path}'")
    except Exception as e:
        logging.error(f"Generierung der Visualisierung fehlgeschlagen. Fehler: {e}")


if __name__ == "__main__":
    run_analysis()