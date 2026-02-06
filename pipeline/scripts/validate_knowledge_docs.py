#!/usr/bin/env python3
"""
Structural Validation for Knowledge Documents

Validates Knowledge Documents after distillation to ensure:
1. YAML frontmatter is complete and valid
2. All required sections are present
3. Confidence scores are in expected range
4. No obvious structural issues

Usage:
    python validate_knowledge_docs.py
    python validate_knowledge_docs.py --input pipeline/knowledge/distilled
    python validate_knowledge_docs.py --output validation_report.json
"""

import os
import sys
import json
import re
import argparse
from pathlib import Path
from typing import Dict, List, Any, Tuple
from datetime import datetime

# Add parent directory to path for utils import
sys.path.insert(0, str(Path(__file__).parent))

from utils import setup_windows_encoding, setup_logging

setup_windows_encoding()
logger = setup_logging(__name__)


# Required frontmatter fields
REQUIRED_FRONTMATTER = [
    'title',
    'authors',
    'year',
    'type',
    'categories',
    'confidence',
    'source_file'
]

# Required sections in document body
REQUIRED_SECTIONS = [
    'Kernbefund',
    'Forschungsfrage',
    'Methodik',
    'Hauptargumente',
    'Kategorie-Evidenz',
    'Assessment-Relevanz',
    'Schlüsselreferenzen'
]

# Valid category names
VALID_CATEGORIES = [
    'AI_Literacies',
    'Generative_KI',
    'Prompting',
    'KI_Sonstige',
    'Soziale_Arbeit',
    'Bias_Ungleichheit',
    'Gender',
    'Diversitaet',
    'Feministisch',
    'Fairness'
]


def parse_frontmatter(content: str) -> Tuple[Dict[str, Any], str]:
    """Extract YAML frontmatter from markdown content."""
    if not content.startswith('---'):
        return {}, content

    # Find end of frontmatter
    end_match = re.search(r'\n---\n', content[3:])
    if not end_match:
        return {}, content

    frontmatter_str = content[4:end_match.start() + 3]
    body = content[end_match.end() + 4:]

    # Simple YAML parsing (enough for our format)
    frontmatter = {}
    current_key = None
    current_list = None

    for line in frontmatter_str.split('\n'):
        line = line.rstrip()

        # List item
        if line.startswith('  - '):
            if current_list is not None:
                current_list.append(line[4:])
            continue

        # Key-value pair
        if ':' in line and not line.startswith(' '):
            if current_key and current_list is not None:
                frontmatter[current_key] = current_list

            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip()

            if value == '':
                # Start of list
                current_key = key
                current_list = []
            elif value.startswith('[') and value.endswith(']'):
                # Inline list (JSON-style)
                try:
                    frontmatter[key] = json.loads(value)
                except:
                    frontmatter[key] = value
                current_key = None
                current_list = None
            elif value.startswith('"') and value.endswith('"'):
                frontmatter[key] = value[1:-1]
                current_key = None
                current_list = None
            else:
                # Try to parse as number
                try:
                    frontmatter[key] = int(value)
                except:
                    frontmatter[key] = value
                current_key = None
                current_list = None

    # Don't forget last list
    if current_key and current_list is not None:
        frontmatter[current_key] = current_list

    return frontmatter, body


def validate_document(filepath: Path) -> Dict[str, Any]:
    """Validate a single Knowledge Document."""
    result = {
        'filename': filepath.name,
        'valid': True,
        'errors': [],
        'warnings': [],
        'metrics': {}
    }

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        result['valid'] = False
        result['errors'].append(f"Cannot read file: {e}")
        return result

    # Parse frontmatter
    frontmatter, body = parse_frontmatter(content)

    if not frontmatter:
        result['valid'] = False
        result['errors'].append("No valid YAML frontmatter found")
        return result

    # Check required frontmatter fields
    for field in REQUIRED_FRONTMATTER:
        if field not in frontmatter:
            result['valid'] = False
            result['errors'].append(f"Missing frontmatter field: {field}")
        elif frontmatter[field] is None or frontmatter[field] == '':
            result['warnings'].append(f"Empty frontmatter field: {field}")

    # Validate confidence score
    confidence = frontmatter.get('confidence')
    if confidence is not None:
        result['metrics']['confidence'] = confidence
        if isinstance(confidence, int):
            if confidence < 50:
                result['warnings'].append(f"Low confidence score: {confidence}%")
            elif confidence < 70:
                result['warnings'].append(f"Below-average confidence: {confidence}%")

    # Validate categories
    categories = frontmatter.get('categories', [])
    if isinstance(categories, list):
        result['metrics']['category_count'] = len(categories)
        for cat in categories:
            if cat not in VALID_CATEGORIES and cat != 'none':
                result['warnings'].append(f"Unknown category: {cat}")
        if len(categories) == 0 or (len(categories) == 1 and categories[0] == 'none'):
            result['warnings'].append("No categories assigned")

    # Validate year
    year = frontmatter.get('year')
    if year:
        result['metrics']['year'] = year
        if isinstance(year, int) and (year < 2015 or year > 2026):
            result['warnings'].append(f"Unusual publication year: {year}")

    # Check required sections
    for section in REQUIRED_SECTIONS:
        pattern = rf'^##\s+{re.escape(section)}'
        if not re.search(pattern, body, re.MULTILINE):
            result['valid'] = False
            result['errors'].append(f"Missing section: {section}")

    # Check for empty sections
    sections = re.split(r'^##\s+', body, flags=re.MULTILINE)
    for section in sections[1:]:  # Skip content before first ##
        lines = section.strip().split('\n')
        if len(lines) >= 1:
            section_name = lines[0].strip()
            section_content = '\n'.join(lines[1:]).strip()
            if len(section_content) < 20:
                result['warnings'].append(f"Very short section: {section_name}")

    # Check document length
    result['metrics']['char_count'] = len(content)
    result['metrics']['word_count'] = len(content.split())

    if len(content) < 1000:
        result['warnings'].append("Document seems too short")
    elif len(content) > 15000:
        result['warnings'].append("Document seems unusually long")

    # Check for wikilinks (references)
    wikilinks = re.findall(r'\[\[([^\]]+)\]\]', body)
    result['metrics']['wikilink_count'] = len(wikilinks)
    if len(wikilinks) == 0:
        result['warnings'].append("No wikilinks (references) found")

    return result


def validate_all(input_dir: Path) -> Dict[str, Any]:
    """Validate all Knowledge Documents in directory."""
    results = {
        'timestamp': datetime.now().isoformat(),
        'input_dir': str(input_dir),
        'summary': {
            'total': 0,
            'valid': 0,
            'invalid': 0,
            'with_warnings': 0
        },
        'confidence_stats': {
            'min': 100,
            'max': 0,
            'avg': 0,
            'below_75': 0
        },
        'documents': []
    }

    # Find all markdown files (exclude subdirectories like _stage1_json)
    md_files = [f for f in input_dir.glob('*.md') if f.is_file()]

    confidences = []

    for md_file in sorted(md_files):
        doc_result = validate_document(md_file)
        results['documents'].append(doc_result)
        results['summary']['total'] += 1

        if doc_result['valid']:
            results['summary']['valid'] += 1
        else:
            results['summary']['invalid'] += 1

        if doc_result['warnings']:
            results['summary']['with_warnings'] += 1

        # Collect confidence scores
        conf = doc_result['metrics'].get('confidence')
        if conf is not None:
            confidences.append(conf)
            if conf < 75:
                results['confidence_stats']['below_75'] += 1

    # Calculate confidence stats
    if confidences:
        results['confidence_stats']['min'] = min(confidences)
        results['confidence_stats']['max'] = max(confidences)
        results['confidence_stats']['avg'] = round(sum(confidences) / len(confidences), 1)

    return results


def print_summary(results: Dict[str, Any]):
    """Print validation summary to console."""
    summary = results['summary']
    conf = results['confidence_stats']

    logger.info("=" * 60)
    logger.info("KNOWLEDGE DOCUMENT VALIDATION REPORT")
    logger.info("=" * 60)
    logger.info(f"Directory: {results['input_dir']}")
    logger.info(f"Timestamp: {results['timestamp']}")
    logger.info("")
    logger.info("SUMMARY")
    logger.info("-" * 40)
    logger.info(f"Total documents:    {summary['total']}")
    logger.info(f"Valid:              {summary['valid']} ({summary['valid']/max(summary['total'],1)*100:.1f}%)")
    logger.info(f"Invalid:            {summary['invalid']}")
    logger.info(f"With warnings:      {summary['with_warnings']}")
    logger.info("")
    logger.info("CONFIDENCE SCORES")
    logger.info("-" * 40)
    logger.info(f"Min:                {conf['min']}%")
    logger.info(f"Max:                {conf['max']}%")
    logger.info(f"Average:            {conf['avg']}%")
    logger.info(f"Below 75%:          {conf['below_75']}")
    logger.info("")

    # List invalid documents
    invalid_docs = [d for d in results['documents'] if not d['valid']]
    if invalid_docs:
        logger.info("INVALID DOCUMENTS")
        logger.info("-" * 40)
        for doc in invalid_docs:
            logger.info(f"  {doc['filename']}")
            for error in doc['errors']:
                logger.info(f"    ERROR: {error}")

    # List documents with warnings (limit to 10)
    warning_docs = [d for d in results['documents'] if d['warnings']]
    if warning_docs:
        logger.info("")
        logger.info(f"DOCUMENTS WITH WARNINGS (showing first 10 of {len(warning_docs)})")
        logger.info("-" * 40)
        for doc in warning_docs[:10]:
            logger.info(f"  {doc['filename']}")
            for warning in doc['warnings'][:3]:
                logger.info(f"    WARN: {warning}")

    logger.info("")
    logger.info("=" * 60)


def main():
    parser = argparse.ArgumentParser(
        description="Validate Knowledge Documents after distillation"
    )
    parser.add_argument(
        "--input", "-i",
        default="pipeline/knowledge/distilled",
        help="Input directory with Knowledge Documents"
    )
    parser.add_argument(
        "--output", "-o",
        help="Output JSON file for detailed results"
    )
    parser.add_argument(
        "--quiet", "-q",
        action="store_true",
        help="Only print summary, not individual issues"
    )

    args = parser.parse_args()

    input_dir = Path(args.input)
    if not input_dir.exists():
        logger.error(f"Input directory not found: {input_dir}")
        sys.exit(1)

    # Run validation
    results = validate_all(input_dir)

    # Print summary
    print_summary(results)

    # Save detailed results if requested
    if args.output:
        output_path = Path(args.output)
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        logger.info(f"Detailed results saved to: {output_path}")

    # Exit with error code if invalid documents found
    if results['summary']['invalid'] > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
