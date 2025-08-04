import langextract as lx
import textwrap
from pathlib import Path
import os

# --- Step 1: Locate all Markdown files ---
# This script assumes it's in the same root directory as your 'markdown_papers' folder.
markdown_dir = Path("markdown_papers")

if not markdown_dir.exists():
    print(f"ERROR: The directory '{markdown_dir}' was not found.")
    print("Please ensure you have run the pdf-to-md-converter.py script first.")
else:
    # Create a list of all .md file paths in the directory
    markdown_files = [str(p) for p in markdown_dir.glob("*.md")]

    if not markdown_files:
        print(f"No Markdown files found in '{markdown_dir}'.")
    else:
        print(f"Found {len(markdown_files)} Markdown files to process.")

        # --- Step 2: Define the Improved Extraction Task ---
        # This prompt is now tailored to your specific research goal of analyzing
        # AI bias, feminist literacies, and mitigation strategies.
        prompt = textwrap.dedent("""\
            You are a research assistant specializing in AI ethics and feminist studies.
            From the research paper, extract the following concepts in order of appearance:
            - ai_technology: The specific AI system or model being discussed (e.g., Large Language Models, Stable Diffusion).
            - bias_type: The specific form of bias or discrimination identified (e.g., gender bias, intersectional bias).
            - mitigation_strategy: The technique or framework proposed to reduce bias (e.g., diversity-reflective prompting, feminist AI literacy, data debiasing).
            - key_finding: A direct, concise quote that summarizes a core result, conclusion, or significant finding of the paper.

            Use the exact text from the document for all extractions. Do not paraphrase.
            Provide meaningful attributes for each entity to add context.
            """)

        # Provide high-quality examples to guide the model. These examples are
        # crucial for ensuring the model extracts data accurately and consistently.
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

        # --- Step 3: Run the Extraction ---
        # NOTE: This requires your API key to be set up. Using a .env file is recommended.
        print("\nStarting extraction with the improved prompt. This may take several minutes...")
        
        results = lx.extract(
            text_or_documents=markdown_files,
            prompt_description=prompt,
            examples=examples,
            model_id="gemini-1.5-flash",  # Recommended default model
            max_workers=10 # Adjust based on your machine's capability and to avoid rate limits
        )

        print(f"\n✅ Processing Complete! Successfully processed {len(results)} documents.")

        # --- Step 4: Save and Visualize the Results ---
        output_jsonl_path = "corpus_analysis.jsonl"
        output_html_path = "corpus_analysis_visualization.html"

        # Save the structured data to a JSONL file
        lx.io.save_annotated_documents(results, output_jsonl_path)
        print(f"Structured results have been saved to '{output_jsonl_path}'")

        # Generate an interactive HTML file to review the extractions
        html_content = lx.visualize(output_jsonl_path)
        with open(output_html_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        
        print(f"Interactive visualization has been saved to '{output_html_path}'")
        print("\n--> Open the .html file in your browser to review the extracted data in context.")
