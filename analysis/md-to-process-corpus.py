import langextract as lx
import textwrap
from pathlib import Path
import os
import logging
import json

# --- Step 1: Logging Setup ---
# Configures a clear and informative logging system.
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

def analyze_corpus():
    """
    Loads multiple markdown files from a directory, processes them sequentially
    for robustness, and saves the combined results.
    """
    # --- Configuration ---
    # Directory containing the markdown files to be processed.
    markdown_dir = Path("markdown_papers")
    
    # Define the output directory and final visualization file.
    output_dir = Path("analysis_results_corpus")
    output_jsonl_file = output_dir / "data.jsonl"
    output_html_path = "corpus_analysis_visualization.html"

    # --- Create the output directory if it doesn't already exist ---
    output_dir.mkdir(exist_ok=True)

    # --- Securely load API key from an environment variable ---
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        logging.error("FATAL: GEMINI_API_KEY environment variable not set.")
        return

    # --- Step 2: Locate and Read Markdown files ---
    if not markdown_dir.exists():
        logging.error(f"The source directory '{markdown_dir}' was not found.")
        return

    # Find all files ending with .md and limit the list to 5.
    # >>> You can change the number `5` to process more or fewer files. <<<
    markdown_file_paths = list(markdown_dir.glob("*.md"))[:5]
    
    if not markdown_file_paths:
        logging.error(f"No Markdown files found in '{markdown_dir}'.")
        return

    logging.info(f"Found {len(markdown_file_paths)} Markdown files to process.")

    # Read each file and create a langextract Document object.
    documents = []
    for file_path in markdown_file_paths:
        try:
            content = file_path.read_text(encoding='utf-8')
            doc = lx.data.Document(document_id=file_path.name, text=content)
            documents.append(doc)
        except Exception as e:
            logging.warning(f"Could not read file {file_path}. Skipping. Error: {e}")
    
    if not documents:
        logging.error("No documents could be read. Exiting.")
        return
        
    logging.info(f"Successfully created {len(documents)} Document objects.")

    # --- Step 3: Define the Extraction Task ---
    # This prompt instructs the AI on its role and what data to find.
    prompt = textwrap.dedent("""\
        You are a research assistant specializing in AI ethics. From the research paper, extract:
        - ai_technology: The specific AI system or model discussed.
        - bias_type: The specific form of bias or discrimination identified.
        - mitigation_strategy: The technique or framework proposed to reduce bias.
        - key_finding: A direct, concise quote summarizing a core result or conclusion.
        """)

    # Few-shot examples guide the AI for better accuracy.
    examples = [
        lx.data.ExampleData(
            text="This paper introduces 'inclusive prompt engineering' to mitigate biases in generative AI.",
            extractions=[
                lx.data.Extraction(extraction_class="mitigation_strategy", extraction_text="inclusive prompt engineering"),
                lx.data.Extraction(extraction_class="ai_technology", extraction_text="generative AI"),
            ]
        )
    ]

    # --- Step 4: Run the Extraction Sequentially for Robustness ---
    logging.info("Starting extraction sequentially to handle potential API errors robustly.")
    successful_results = []
    error_count = 0

    for document in documents:
        logging.info(f"Processing document: {document.document_id}...")
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
                logging.error(f"Could not process document '{result.document_id}'. Library Error: {result.error}")
                error_count += 1
            else:
                successful_results.append(result)
                logging.info(f"--> Successfully processed document: {document.document_id}")

        except Exception as e:
            logging.error(f"A critical error occurred for document '{document.document_id}'. Skipping. Error: {e}")
            error_count += 1
            continue

    logging.info("✅ Extraction process finished.")
    logging.info(f"Successfully processed {len(successful_results)} documents.")
    if error_count > 0:
        logging.warning(f"Failed to process {error_count} documents. See logs for details.")

    if not successful_results:
        logging.warning("No documents were successfully processed. Exiting.")
        return

    # --- Step 5: Save and Visualize the Combined Results ---
    # Manually save results to a JSONL file with explicit UTF-8 encoding
    # to prevent UnicodeEncodeError on systems with different default encodings.
    logging.info(f"Saving {len(successful_results)} results to '{output_jsonl_file}'...")
    try:
        with open(output_jsonl_file, "w", encoding="utf-8") as f:
            for result in successful_results:
                # Convert the result object to a dictionary
                doc_dict = result.to_dict()
                # Write the dictionary as a JSON string on a new line
                f.write(json.dumps(doc_dict, ensure_ascii=False) + '\n')
        logging.info(f"Combined structured results saved successfully.")
    except Exception as e:
        logging.error(f"Failed to save results to file. Error: {e}")
        return

    # Generate the interactive HTML file for human review.
    logging.info("Generating final interactive visualization...")
    try:
        html_content = lx.visualize(output_jsonl_file)
        with open(output_html_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        logging.info(f"Interactive visualization saved to '{output_html_path}'")
    except Exception as e:
        logging.error(f"Failed to generate visualization. Error: {e}")

if __name__ == "__main__":
    analyze_corpus()
