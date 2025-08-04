import langextract as lx
import textwrap
from pathlib import Path
import os
import logging
import json
import time

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
    with retries for robustness, and saves the combined results.
    """
    # --- Configuration ---
    markdown_dir = Path("markdown_papers")
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
    markdown_file_paths = list(markdown_dir.glob("*.md"))[:5]
    
    if not markdown_file_paths:
        logging.error(f"No Markdown files found in '{markdown_dir}'.")
        return

    logging.info(f"Found {len(markdown_file_paths)} Markdown files to process.")

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
    prompt = textwrap.dedent("""\
        You are a research assistant specializing in AI ethics. From the research paper, extract:
        - ai_technology: The specific AI system or model discussed.
        - bias_type: The specific form of bias or discrimination identified.
        - mitigation_strategy: The technique or framework proposed to reduce bias.
        - key_finding: A direct, concise quote summarizing a core result or conclusion.
        """)

    examples = [
        lx.data.ExampleData(
            text="This paper introduces 'inclusive prompt engineering' to mitigate biases in generative AI.",
            extractions=[
                lx.data.Extraction(extraction_class="mitigation_strategy", extraction_text="inclusive prompt engineering"),
                lx.data.Extraction(extraction_class="ai_technology", extraction_text="generative AI"),
            ]
        )
    ]

    # --- Step 4: Run the Extraction Sequentially with Retries ---
    logging.info("Starting extraction sequentially with retries for robustness.")
    successful_results = []
    failed_documents = 0
    max_retries = 3

    for document in documents:
        logging.info(f"Processing document: {document.document_id}...")
        success = False
        for attempt in range(max_retries):
            try:
                # Use a more powerful model for better handling of large/complex documents.
                results_generator = lx.extract(
                    text_or_documents=[document],
                    prompt_description=prompt,
                    examples=examples,
                    model_id="gemini-1.5-flash",  # Note: Corrected from the non-existent 2.5
                    api_key=api_key
                )
                
                result = next(results_generator)

                if hasattr(result, 'error') and result.error:
                    raise RuntimeError(f"Library Error: {result.error}")
                
                successful_results.append(result)
                logging.info(f"--> Successfully processed document: {document.document_id}")
                success = True
                break # Exit retry loop on success

            except Exception as e:
                logging.warning(f"Attempt {attempt + 1}/{max_retries} failed for document '{document.document_id}'. Error: {e}")
                if attempt < max_retries - 1:
                    time.sleep(2) # Wait 2 seconds before retrying
                else:
                    logging.error(f"All {max_retries} attempts failed for document '{document.document_id}'. Skipping.")
        
        if not success:
            failed_documents += 1

    logging.info("✅ Extraction process finished.")
    logging.info(f"Successfully processed {len(successful_results)} documents.")
    if failed_documents > 0:
        logging.warning(f"Failed to process {failed_documents} documents after all retries. See logs for details.")

    if not successful_results:
        logging.warning("No documents were successfully processed. Exiting.")
        return

    # --- Step 5: Save and Visualize the Combined Results ---
    logging.info(f"Saving {len(successful_results)} results to '{output_jsonl_file}'...")
    try:
        # CORRECTED CODE BLOCK:
        # Replaced the manual loop and incorrect .to_dict() call
        # with a dedicated library function for saving.
        lx.save_annotated_documents(
            annotated_documents=successful_results,
            output_path=output_jsonl_file
        )
        logging.info(f"Combined structured results saved successfully.")
    except Exception as e:
        logging.error(f"Failed to save results to file. Error: {e}")
        return

    logging.info("Generating final interactive visualization...")
    try:
        # This step should now work as it can find the file created above.
        html_content = lx.visualize(output_jsonl_file)
        with open(output_html_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        logging.info(f"Interactive visualization saved to '{output_html_path}'")
    except Exception as e:
        logging.error(f"Failed to generate visualization. Error: {e}")

if __name__ == "__main__":
    analyze_corpus()