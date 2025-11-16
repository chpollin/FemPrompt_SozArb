#!/usr/bin/env python3
"""
Enhance existing summaries with Practical Implications, Limitations, and Relations
Uses Claude API to add missing sections
"""

import sys
import os
import re
import time
from pathlib import Path
from dotenv import load_dotenv

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

load_dotenv()

try:
    from anthropic import Anthropic
except ImportError:
    print("❌ anthropic package not installed!")
    print("💡 Install with: pip install anthropic")
    exit(1)


class SummaryEnhancer:
    def __init__(self, api_key: str):
        self.client = Anthropic(api_key=api_key)
        self.model = "claude-haiku-4-5"  # Fast and cheap

    def extract_existing_summary(self, summary_path: Path) -> str:
        """Extract existing summary content"""
        content = summary_path.read_text(encoding='utf-8')

        # Remove YAML frontmatter
        parts = content.split('---', 2)
        if len(parts) > 2:
            return parts[2].strip()
        return content

    def enhance_summary(self, existing_content: str) -> str:
        """Add missing sections using Claude"""

        prompt = f"""You are enhancing an academic summary for social work practitioners and researchers.

EXISTING SUMMARY:
{existing_content}

TASK: Add THREE new sections to this summary:

1. ## Practical Implications
   - Structure by stakeholder: "For Social Workers:", "For Organizations:", "For Policymakers:", "For Researchers:"
   - Provide 2 actionable, specific recommendations per stakeholder
   - Focus on HOW this knowledge can be applied

2. ## Limitations & Open Questions
   - List 3-4 methodological/scope limitations
   - List 3-4 unresolved questions or future research directions
   - Be honest and critical

3. ## Relation to Other Research
   - Identify 3-4 research themes/topics this paper connects to
   - Use general terms like "feminist AI frameworks", "bias mitigation strategies", "social work AI ethics"
   - Do NOT reference specific papers (those will be added manually later)
   - Format: "- **[Theme]:** [How this paper relates, 1 sentence]"

OUTPUT FORMAT:
Return ONLY the three new sections with headers, ready to append.
Start with "## Practical Implications" and end after "## Relation to Other Research".
No preamble, no meta-commentary.
"""

        response = self.client.messages.create(
            model=self.model,
            max_tokens=1500,
            temperature=0.3,
            messages=[{"role": "user", "content": prompt}]
        )

        return response.content[0].text

    def enhance_file(self, summary_path: Path) -> bool:
        """Enhance a single summary file"""

        content = summary_path.read_text(encoding='utf-8')

        # Check if already enhanced
        if '## Practical Implications' in content:
            return False  # Already enhanced

        # Extract existing content
        existing = self.extract_existing_summary(summary_path)

        # Generate enhancements
        try:
            enhancements = self.enhance_summary(existing)
        except Exception as e:
            print(f"❌ API error: {e}")
            return False

        # Append enhancements before final metadata
        # Find the last ## section
        last_section = content.rfind('## Significance')
        if last_section > 0:
            # Find end of Significance section
            end_of_significance = content.find('\n\n', last_section + 100)
            if end_of_significance > 0:
                # Insert enhancements
                new_content = (
                    content[:end_of_significance] +
                    '\n\n' + enhancements +
                    content[end_of_significance:]
                )
                summary_path.write_text(new_content, encoding='utf-8')
                return True

        return False


def main():
    api_key = os.getenv('ANTHROPIC_API_KEY')
    if not api_key:
        print("❌ ANTHROPIC_API_KEY not found in environment!")
        print("💡 Set it in .env file")
        exit(1)

    enhancer = SummaryEnhancer(api_key)

    summaries_dir = Path('SozArb_Research_Vault/Summaries')
    summary_files = list(summaries_dir.glob('summary_*.md'))

    print(f"=== Enhancing {len(summary_files)} Summaries ===\n")

    enhanced_count = 0
    skipped_count = 0
    error_count = 0

    for i, summary_file in enumerate(summary_files, 1):
        print(f"[{i}/{len(summary_files)}] {summary_file.name[:50]}...", end=' ')

        try:
            if enhancer.enhance_file(summary_file):
                enhanced_count += 1
                print("✅")
            else:
                skipped_count += 1
                print("⏭️  (already enhanced)")

            # Rate limiting: 2 seconds between API calls
            if i < len(summary_files):
                time.sleep(2)

        except Exception as e:
            error_count += 1
            print(f"❌ {e}")

    print(f"\n=== Summary ===")
    print(f"Enhanced: {enhanced_count}")
    print(f"Skipped (already done): {skipped_count}")
    print(f"Errors: {error_count}")
    print(f"\nEstimated cost: ${enhanced_count * 0.005:.2f}")


if __name__ == '__main__':
    main()
