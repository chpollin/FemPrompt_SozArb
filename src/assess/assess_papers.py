#!/usr/bin/env python3
"""
LLM-based Paper Assessment for PRISMA Review
Processes papers from assessment.xlsx using Claude Haiku 4.5
"""

import os
import json
import time
import pandas as pd
from pathlib import Path
from anthropic import Anthropic
import logging
from typing import Dict, Optional

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('assessment-llm/logs/assessment.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class PaperAssessor:
    """Assess papers using Claude Haiku 4.5"""

    def __init__(self, api_key: str = None):
        """Initialize with Anthropic API key"""
        self.api_key = api_key or os.environ.get('ANTHROPIC_API_KEY')
        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY not found in environment")

        self.client = Anthropic(api_key=self.api_key)

        # Load prompt template
        template_path = Path('assessment-llm/prompt_template.md')
        with open(template_path, 'r', encoding='utf-8') as f:
            self.prompt_template = f.read()

    def build_prompt(self, paper: Dict) -> str:
        """Build assessment prompt from paper metadata"""
        return self.prompt_template.format(
            title=paper.get('Title', 'N/A'),
            authors=paper.get('Author_Year', 'N/A'),
            year=paper.get('Publication_Year', 'N/A'),
            item_type=paper.get('Item_Type', 'N/A'),
            doi=paper.get('DOI', 'N/A'),
            language=paper.get('Language', 'N/A'),
            source_tool=paper.get('Source_Tool', 'N/A'),
            abstract=paper.get('Abstract', 'No abstract available')
        )

    def assess_paper(self, paper: Dict, paper_id: int, retry: bool = False) -> Optional[Dict]:
        """Assess single paper using Claude Haiku 4.5 with retry logic"""
        # Check if abstract exists - auto-exclude if missing
        abstract = paper.get('Abstract', '')

        # Check for missing abstract (None, NaN, empty string, or "No abstract available")
        import pandas as pd
        if pd.isna(abstract) or not abstract or str(abstract).strip() == '' or str(abstract) == 'No abstract available':
            logger.info(f"Paper {paper_id} has no abstract - auto-excluding")
            return {
                'decision': 'Exclude',
                'exclusion_reason': 'No full text',
                'scores': [0, 0, 0, 0, 0],
                'note': 'Automatisch ausgeschlossen: Kein Abstract verfügbar'
            }

        # Use stricter temperature on retry
        temperature = 0.1 if retry else 0.3

        try:
            prompt = self.build_prompt(paper)

            if retry:
                logger.info(f"RETRY with temperature={temperature} for paper {paper_id}: {paper.get('Title', 'N/A')[:60]}...")
            else:
                logger.info(f"Assessing paper {paper_id}: {paper.get('Title', 'N/A')[:60]}...")

            # Call Claude API
            message = self.client.messages.create(
                model="claude-haiku-4-5-20251001",
                max_tokens=1024,
                temperature=temperature,
                messages=[{
                    "role": "user",
                    "content": prompt
                }]
            )

            # Extract response
            response_text = message.content[0].text

            # Parse JSON response
            # Handle markdown code blocks if present
            if '```json' in response_text:
                response_text = response_text.split('```json')[1].split('```')[0].strip()
            elif '```' in response_text:
                response_text = response_text.split('```')[1].split('```')[0].strip()

            result = json.loads(response_text)

            # Auto-repair common score issues BEFORE validation
            result = self._repair_response(result, paper_id)

            # Validate response structure
            self._validate_response(result)

            # Log to JSONL
            self._log_api_call(paper_id, paper, result, message.usage, retry=retry)

            return result

        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON for paper {paper_id}: {e}")
            logger.error(f"Response was: {response_text}")

            # Retry once with stricter temperature
            if not retry:
                logger.info(f"Retrying paper {paper_id} with temperature=0.1...")
                time.sleep(2)  # Brief delay before retry
                return self.assess_paper(paper, paper_id, retry=True)

            return None

        except ValueError as e:
            # Validation errors (scores, decision, etc.)
            logger.error(f"Validation error for paper {paper_id}: {e}")

            # Retry once with stricter temperature
            if not retry:
                logger.info(f"Retrying paper {paper_id} with temperature=0.1...")
                time.sleep(2)  # Brief delay before retry
                return self.assess_paper(paper, paper_id, retry=True)

            return None

        except Exception as e:
            logger.error(f"Error assessing paper {paper_id}: {e}")

            # Retry once with stricter temperature
            if not retry:
                logger.info(f"Retrying paper {paper_id} with temperature=0.1...")
                time.sleep(2)  # Brief delay before retry
                return self.assess_paper(paper, paper_id, retry=True)

            return None

    def _repair_response(self, result: Dict, paper_id: int) -> Dict:
        """Auto-repair common LLM response issues"""

        # Repair scores: null → [0, 0, 0, 0, 0]
        if result.get('scores') is None:
            logger.warning(f"Paper {paper_id}: Auto-repairing scores from null to [0,0,0,0,0]")
            result['scores'] = [0, 0, 0, 0, 0]

        # Repair scores if it's a list
        elif isinstance(result.get('scores'), list):
            scores = result['scores']

            # Fix length if too short
            if len(scores) < 5:
                logger.warning(f"Paper {paper_id}: Auto-padding scores from {len(scores)} to 5 values")
                scores.extend([0] * (5 - len(scores)))

            # Fix length if too long
            elif len(scores) > 5:
                logger.warning(f"Paper {paper_id}: Auto-truncating scores from {len(scores)} to 5 values")
                scores = scores[:5]

            # Convert floats/strings to ints, handle null values
            repaired_scores = []
            for i, s in enumerate(scores):
                if s is None:
                    logger.warning(f"Paper {paper_id}: Auto-repairing scores[{i}] from null to 0")
                    repaired_scores.append(0)
                elif isinstance(s, str):
                    logger.warning(f"Paper {paper_id}: Auto-converting scores[{i}] from string '{s}' to int")
                    repaired_scores.append(int(float(s)))
                elif isinstance(s, float):
                    logger.warning(f"Paper {paper_id}: Auto-converting scores[{i}] from float {s} to int")
                    repaired_scores.append(int(s))
                else:
                    repaired_scores.append(s)

            result['scores'] = repaired_scores

        return result

    def _validate_response(self, result: Dict):
        """Validate LLM response structure"""
        required_keys = ['decision', 'exclusion_reason', 'scores', 'note']
        for key in required_keys:
            if key not in result:
                raise ValueError(f"Missing required key: {key}")

        # Validate scores
        if not isinstance(result['scores'], list):
            raise ValueError(f"scores must be list, got {type(result['scores']).__name__}: {result['scores']}")
        if len(result['scores']) != 5:
            raise ValueError(f"scores must have exactly 5 values, got {len(result['scores'])}: {result['scores']}")

        for i, score in enumerate(result['scores']):
            if score is None:
                raise ValueError(f"Invalid score at position {i}: None (null not allowed, use 0)")
            if not isinstance(score, int) or score < 0 or score > 3:
                raise ValueError(f"Invalid score at position {i}: {score} (must be integer 0-3)")

        # Validate decision
        if result['decision'] not in ['Include', 'Exclude', 'Unclear']:
            raise ValueError(f"Invalid decision: {result['decision']}")

        # Validate exclusion_reason logic
        if result['decision'] in ['Include', 'Unclear'] and result['exclusion_reason'] is not None:
            logger.warning(f"exclusion_reason should be null for {result['decision']}")

        if result['decision'] == 'Exclude' and result['exclusion_reason'] is None:
            logger.warning("exclusion_reason is null for Exclude decision")

    def _log_api_call(self, paper_id: int, paper: Dict, result: Dict, usage, retry: bool = False):
        """Log API call to JSONL file"""
        log_entry = {
            'paper_id': paper_id,
            'zotero_key': paper.get('Zotero_Key', ''),
            'title': paper.get('Title', ''),
            'result': result,
            'usage': {
                'input_tokens': usage.input_tokens,
                'output_tokens': usage.output_tokens
            },
            'retry': retry,
            'timestamp': time.time()
        }

        log_file = Path('assessment-llm/logs/api_calls.jsonl')
        with open(log_file, 'a', encoding='utf-8') as f:
            f.write(json.dumps(log_entry, ensure_ascii=False) + '\n')

    def process_batch(self, input_file: str, output_file: str, delay: float = 2.0):
        """Process all papers from Excel"""
        logger.info(f"Reading input file: {input_file}")
        df = pd.read_excel(input_file)

        logger.info(f"Found {len(df)} papers to assess")

        # Track results
        results = []
        failed = []

        for idx, row in df.iterrows():
            paper_id = idx + 1

            # Assess paper
            result = self.assess_paper(row.to_dict(), paper_id)

            if result:
                results.append({
                    'paper_id': paper_id,
                    **result
                })
            else:
                failed.append(paper_id)

            # Rate limiting
            if idx < len(df) - 1:  # Don't sleep after last paper
                time.sleep(delay)

        # Merge results back to DataFrame
        logger.info("Merging results back to DataFrame...")

        for result in results:
            idx = result['paper_id'] - 1
            df.loc[idx, 'Decision'] = result['decision']
            df.loc[idx, 'Exclusion_Reason'] = result['exclusion_reason'] if result['exclusion_reason'] else ''
            df.loc[idx, 'Rel_AI_Komp'] = result['scores'][0]
            df.loc[idx, 'Rel_Vulnerable'] = result['scores'][1]
            df.loc[idx, 'Rel_Bias'] = result['scores'][2]
            df.loc[idx, 'Rel_Praxis'] = result['scores'][3]
            df.loc[idx, 'Rel_Prof'] = result['scores'][4]
            df.loc[idx, 'Notes'] = result['note']

        # Save output
        logger.info(f"Saving results to: {output_file}")
        df.to_excel(output_file, index=False, engine='xlsxwriter')

        # Generate report
        self._generate_report(len(df), len(results), failed)

        return df

    def _generate_report(self, total: int, successful: int, failed: list):
        """Generate assessment quality report"""
        logger.info("\n" + "="*80)
        logger.info("ASSESSMENT REPORT")
        logger.info("="*80)
        logger.info(f"Total papers: {total}")
        logger.info(f"Successfully assessed: {successful} ({successful/total*100:.1f}%)")
        logger.info(f"Failed: {len(failed)} ({len(failed)/total*100:.1f}%)")

        if failed:
            logger.info(f"Failed paper IDs: {failed}")

        # Read API call logs to calculate costs
        log_file = Path('assessment-llm/logs/api_calls.jsonl')
        if log_file.exists():
            total_input = 0
            total_output = 0

            with open(log_file, 'r', encoding='utf-8') as f:
                for line in f:
                    entry = json.loads(line)
                    total_input += entry['usage']['input_tokens']
                    total_output += entry['usage']['output_tokens']

            # Haiku 4 pricing: $0.80/1M input, $4.00/1M output
            cost_input = (total_input / 1_000_000) * 0.80
            cost_output = (total_output / 1_000_000) * 4.00
            total_cost = cost_input + cost_output

            logger.info(f"\nAPI Usage:")
            logger.info(f"  Input tokens: {total_input:,}")
            logger.info(f"  Output tokens: {total_output:,}")
            logger.info(f"  Estimated cost: ${total_cost:.2f}")

        logger.info("="*80)


def main():
    """Main execution"""
    import argparse

    parser = argparse.ArgumentParser(
        description='LLM-based paper assessment for PRISMA review'
    )

    parser.add_argument(
        '-i', '--input',
        default='assessment/assessment.xlsx',
        help='Input Excel file (default: assessment/assessment.xlsx)'
    )

    parser.add_argument(
        '-o', '--output',
        default='assessment-llm/output/assessment_llm.xlsx',
        help='Output Excel file (default: assessment-llm/output/assessment_llm.xlsx)'
    )

    parser.add_argument(
        '--delay',
        type=float,
        default=2.0,
        help='Delay between API calls in seconds (default: 2.0)'
    )

    args = parser.parse_args()

    # Create output directory
    Path(args.output).parent.mkdir(parents=True, exist_ok=True)

    try:
        # Initialize assessor
        assessor = PaperAssessor()

        # Process batch
        assessor.process_batch(args.input, args.output, args.delay)

        logger.info(f"\n✓ Assessment complete! Output saved to: {args.output}")

    except Exception as e:
        logger.error(f"✗ Error: {e}")
        raise


if __name__ == '__main__':
    main()
