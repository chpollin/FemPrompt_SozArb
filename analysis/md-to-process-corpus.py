import langextract as lx
import textwrap
from pathlib import Path
import os
import logging
import json

# --- Step 1: Logging Setup ---
# Configures a clear and informative logging system that prints progress
# and errors to your terminal as the script runs.
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

def analyze_single_paper():
    """
    Loads one markdown file, extracts structured data using the Gemini model
    via LangExtract, and saves the results as JSONL and an HTML visualization.
    """
    # --- Configuration ---
    # Define the single input file and the output files.
    # >>> CHANGE THIS to the path of your markdown file. <<<
    markdown_file = Path("markdown_papers/AI___Intersectionality__A_Toolkit_For_Fairness___I.md")
    
    # You can customize the output names if you wish.
    output_jsonl_path = "paper_analysis.jsonl"
    output_html_path = "paper_analysis_visualization.html"

    # --- Securely load API key from an environment variable ---
    # This is a security best practice to avoid saving secrets in your code.
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        logging.error("FATAL: GEMINI_API_KEY environment variable not set.")
        logging.error("Please set this environment variable before running the script.")
        return

    # --- Step 2: Read the single Markdown file ---
    logging.info(f"Attempting to read file: '{markdown_file}'")
    if not markdown_file.exists():
        logging.error(f"The file '{markdown_file}' was not found. Please check the path and filename.")
        return

    try:
        content = markdown_file.read_text(encoding='utf-8')
        # The Document object holds the text and an ID for tracking purposes.
        document = lx.data.Document(document_id=markdown_file.name, text=content)
        logging.info("Successfully read the file and created a Document object.")
    except Exception as e:
        logging.error(f"Could not read or process the file. Error: {e}")
        return

    # --- Step 3: Define the Extraction Task ---
    # A detailed prompt instructs the AI on exactly what to find and how to format it.
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

    # Few-shot examples guide the AI for better accuracy and consistent formatting.
    examples = [
        lx.data.ExampleData(
            text="This paper introduces 'inclusive prompt engineering' as a strategy to probe and mitigate biases in generative AI image systems.",
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
            ]
        ),
        lx.data.ExampleData(
            text="The study reveals that 44% of AI systems exhibit gender bias.",
            extractions=[
                lx.data.Extraction(
                    extraction_class="bias_type",
                    extraction_text="gender bias",
                    attributes={"prevalence": "44% of AI systems"}
                )
            ]
        )
    ]

    # --- Step 4: Run the Extraction ---
    logging.info("Starting data extraction with the Gemini model...")
    try:
        # The `lx.extract` function expects an iterable (like a list).
        # FIX: We pass the single `document` object inside a list: `[document]`.
        results = list(lx.extract(
            text_or_documents=[document],
            prompt_description=prompt,
            examples=examples,
            model_id="gemini-2.5-flash",
            api_key=api_key
        ))
        
        if not results:
            logging.error("Extraction returned no results. The model may have failed to process the input.")
            return

        # Get the single result object from the list of results.
        result = results[0]

        # Check if an error occurred for this specific document.
        if hasattr(result, 'error') and result.error:
            logging.error(f"Could not process document '{result.document_id}'. Error: {result.error}")
            return
            
        logging.info("✅ Extraction process finished successfully.")

    except lx.inference.InferenceOutputError as e:
        logging.error(f"A critical API error occurred: {e}")
        logging.error("This could be an invalid API key, permissions issue, or a temporary service outage.")
        return
    except Exception as e:
        logging.error(f"An unexpected error occurred during the extraction process: {e}")
        return

    # --- Step 5: Save and Visualize the Results ---
    # Save the structured data to a machine-readable JSONL file.
    # The save function also expects a list, so we pass `[result]`.
    lx.io.save_annotated_documents([result], output_jsonl_path)
    logging.info(f"Structured results have been saved to '{output_jsonl_path}'")

    # Generate an interactive HTML file for easy human review.
    logging.info("Generating interactive visualization...")
    try:
        html_content = lx.visualize(output_jsonl_path)
        with open(output_html_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        logging.info(f"Interactive visualization saved to '{output_html_path}'")
        logging.info(f"--> Open this HTML file in your browser to see the results in context.")
    except Exception as e:
        logging.error(f"Failed to generate visualization. Error: {e}")

# This standard Python construct ensures the `analyze_single_paper` function
# is called only when the script is executed directly.
if __name__ == "__main__":
    analyze_single_paper()