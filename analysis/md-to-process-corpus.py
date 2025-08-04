import langextract as lx
import textwrap
from pathlib import Path
import os
import logging
import json

# --- Step 1: Setup Logging ---
# A simple and clean logging setup to track the script's progress and errors.
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

def process_corpus():
    """
    Loads markdown files, extracts structured data using LangExtract in parallel,
    and saves the results. This version is optimized for security and robustness.
    """
    # --- Configuration ---
    # Define the input directory and the names for the output files.
    markdown_dir = Path("markdown_papers")
    output_jsonl_path = "corpus_analysis.jsonl"
    output_html_path = "corpus_analysis_visualization.html"

    # --- BEST PRACTICE: Load API key securely from environment variables ---
    # This avoids exposing your secret key directly in the code.
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        logging.error("FATAL: GEMINI_API_KEY environment variable not set.")
        logging.error("Please set the environment variable before running the script.")
        return

    # --- Step 2: Locate and Read all Markdown files ---
    # Check if the source directory exists before proceeding.
    if not markdown_dir.exists():
        logging.error(f"The directory '{markdown_dir}' was not found.")
        logging.error("Please ensure you have run the pdf-to-md-converter.py script first.")
        return

    # Find all files ending with .md in the specified directory.
    markdown_file_paths = list(markdown_dir.glob("*.md"))
    if not markdown_file_paths:
        logging.error(f"No Markdown files found in '{markdown_dir}'.")
        return

    logging.info(f"Found {len(markdown_file_paths)} Markdown files to process.")

    # Read each file and create a langextract Document object.
    documents = []
    for file_path in markdown_file_paths:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                # The document_id helps identify which file the results belong to.
                doc = lx.data.Document(document_id=file_path.name, text=content)
                documents.append(doc)
        except Exception as e:
            logging.warning(f"Could not read file {file_path}. Skipping. Error: {e}")
    
    if not documents:
        logging.error("No documents could be read. Exiting.")
        return
        
    logging.info("Successfully created Document objects for all readable files.")

    # --- Step 3: Define the Extraction Task ---
    # This detailed prompt instructs the AI on its role, the data to find, and the output format.
    prompt = textwrap.dedent("""\
        You are a research assistant specializing in AI ethics and feminist studies.
        From the research paper, extract the following concepts in order of appearance:
        - ai_technology: The specific AI system or model being discussed (e.g., Large Language Models, Stable Diffusion).
        - bias_type: The specific form of bias or discrimination identified (e.g., gender bias, intersectional bias).
        - mitigation_strategy: The technique or framework proposed to reduce bias (e.g., diversity-reflective prompting, feminist AI literacy, data debiasing).
        - key_finding: A direct, concise quote that summarizes a core result, conclusion, or significant finding of the paper.

        Use the exact text from the document for all extractions. Do not paraphrase.
        Provide meaningful attributes for each entity to add context.
        Ensure your entire output is a single, valid JSON object.
        """)

    # Few-shot examples guide the AI to produce more accurate and consistently formatted results.
    examples = [
        lx.data.ExampleData(
            text="This paper introduces 'inclusive prompt engineering' as a strategy to probe and mitigate biases in generative AI image systems. Our findings underscore the need for improved prompt interfaces that actively promote inclusive representation.",
            extractions=[
                lx.data.Extraction(
                    extraction_class="mitigation_strategy",
                    extraction_text="inclusive prompt engineering",
                    attributes={"goal": "probe and mitigate biases"}
                ),
                lx.data.Extraction(
                    extraction_class="ai_technology",
                    extraction_text="generative AI image systems",
                ),
                lx.data.Extraction(
                    extraction_class="key_finding",
                    extraction_text="findings underscore the need for improved prompt interfaces that actively promote inclusive representation",
                ),
            ]
        ),
        lx.data.ExampleData(
            text="The study reveals that 44% of AI systems exhibit gender bias, with 25% showing both gender and racial bias.",
            extractions=[
                lx.data.Extraction(
                    extraction_class="bias_type",
                    extraction_text="gender bias",
                    attributes={"prevalence": "44% of AI systems"}
                ),
                lx.data.Extraction(
                    extraction_class="bias_type",
                    extraction_text="gender and racial bias",
                    attributes={"prevalence": "25% of AI systems", "nature": "intersectional"}
                )
            ]
        )
    ]

    # --- Step 4: Run the Extraction in Parallel ---
    logging.info("Starting extraction with parallel processing.")
    
    try:
        results_generator = lx.extract(
            text_or_documents=documents,
            prompt_description=prompt,
            examples=examples,
            model_id="gemini-1.5-flash",
            max_workers=10, # Process up to 10 documents concurrently.
            api_key=api_key
        )

        # --- ROBUSTNESS (Corrected): Iterate through results to handle individual failures ---
        results_list = []
        error_count = 0
        
        for result in results_generator:
            # FIX: First check if the 'error' attribute exists before trying to access it.
            # This correctly handles both successful and failed results.
            if hasattr(result, 'error') and result.error:
                logging.error(f"Could not process document '{result.document_id}'. Error: {result.error}")
                error_count += 1
                continue  # Skip this failed document and continue with the next.
            results_list.append(result)

        logging.info("✅ Extraction process finished.")
        logging.info(f"Successfully processed {len(results_list)} documents.")
        if error_count > 0:
            logging.warning(f"Failed to process {error_count} documents due to errors. See logs above.")

    except lx.inference.InferenceOutputError as e:
        logging.error(f"A critical API error occurred during extraction: {e}")
        logging.error("This could be due to an invalid API key, lack of permissions, or a temporary service outage.")
        return
    except Exception as e:
        # This will catch other unexpected errors during the setup of the extraction call.
        logging.error(f"An unexpected error occurred: {e}")
        return

    if not results_list:
        logging.warning("No documents were successfully processed. Exiting without saving results.")
        return

    # --- Step 5: Save and Visualize the Results ---
    # Save the structured data to a JSONL file for machine analysis.
    lx.io.save_annotated_documents(results_list, output_jsonl_path)
    logging.info(f"Structured results have been saved to '{output_jsonl_path}'")

    # Generate the interactive HTML file for human review.
    visualize_results(output_jsonl_path, output_html_path)

def visualize_results(jsonl_path, html_path):
    """Generates the HTML visualization from the final JSONL file."""
    if not os.path.exists(jsonl_path):
        logging.warning("No results file found to visualize.")
        return
        
    logging.info("Generating final interactive visualization...")
    try:
        html_content = lx.visualize(jsonl_path)
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        logging.info(f"Interactive visualization has been saved to '{html_path}'")
        logging.info(f"--> Open '{html_path}' in your browser to review the extracted data in context.")
    except Exception as e:
        logging.error(f"Failed to generate visualization. Error: {e}")

# This ensures the script runs only when executed directly (not when imported).
if __name__ == "__main__":
    process_corpus()
