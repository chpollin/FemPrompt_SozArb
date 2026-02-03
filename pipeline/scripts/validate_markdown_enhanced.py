#!/usr/bin/env python3
"""
Enhanced Markdown Conversion Quality Validator

Extends basic validation with:
- PDF character comparison (text loss detection)
- Table detection comparison (PDF vs Markdown)
- Advanced artifact detection (OCR, layout, header/footer)
- LLM-based semantic spot-checking
- Confidence scoring and review queue generation

Usage:
    python validate_markdown_enhanced.py --md-dir pipeline/markdown --pdf-dir pipeline/pdfs
    python validate_markdown_enhanced.py --md-dir pipeline/markdown --pdf-dir pipeline/pdfs --llm-check
"""

import argparse
import json
import re
import os
import sys
import random
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass, asdict, field
from collections import Counter
from datetime import datetime

# Import shared utilities
from utils import setup_windows_encoding, load_env_file, get_env_var

# Fix encoding for Windows console
setup_windows_encoding()

# Optional imports
try:
    import pdfplumber
    PDFPLUMBER_AVAILABLE = True
except ImportError:
    PDFPLUMBER_AVAILABLE = False
    print("[WARNING] pdfplumber not installed. PDF comparison disabled.")
    print("Install with: pip install pdfplumber")

try:
    from anthropic import Anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False


@dataclass
class EnhancedValidationMetrics:
    """Extended validation metrics including PDF comparison"""
    # Basic info
    filename: str
    pdf_filename: str

    # Size metrics
    md_char_count: int
    md_word_count: int
    md_file_size_mb: float

    # Basic quality (from original validator)
    glyph_count: int
    unicode_error_count: int
    text_to_noise_ratio: float

    # PDF comparison
    pdf_char_count: int
    pdf_word_count: int
    char_ratio: float  # md_chars / pdf_chars
    char_loss_warning: bool

    # Table comparison
    pdf_table_count: int
    md_table_count: int
    table_mismatch: bool

    # Artifact detection
    artifact_types: Dict[str, int]
    artifact_score: float  # 0-100, lower is better

    # Semantic completeness (LLM)
    llm_reviewed: bool
    semantic_score: Optional[float]
    section_coverage: Dict[str, bool]
    llm_issues: List[str]

    # Overall assessment
    confidence_score: float  # 0-100
    status: str  # PASS, WARNING, FAIL
    issues: List[str]
    needs_manual_review: bool
    manual_review_reasons: List[str]


class PDFAnalyzer:
    """Extract metrics from source PDF for comparison"""

    def __init__(self, pdf_path: Path):
        self.pdf_path = pdf_path

    def extract_stats(self) -> Dict[str, Any]:
        """Extract character count, word count, and table count from PDF"""
        if not PDFPLUMBER_AVAILABLE:
            return {
                'char_count': 0,
                'word_count': 0,
                'table_count': 0,
                'page_count': 0,
                'error': 'pdfplumber not available'
            }

        stats = {
            'char_count': 0,
            'word_count': 0,
            'table_count': 0,
            'page_count': 0,
            'error': None
        }

        try:
            with pdfplumber.open(self.pdf_path) as pdf:
                stats['page_count'] = len(pdf.pages)

                for page in pdf.pages:
                    # Extract text
                    text = page.extract_text() or ''
                    stats['char_count'] += len(text)
                    stats['word_count'] += len(text.split())

                    # Detect tables
                    tables = page.extract_tables()
                    # Filter false positives (require at least 2 rows and 2 columns)
                    valid_tables = [t for t in tables if t and len(t) > 1 and len(t[0]) > 1]
                    stats['table_count'] += len(valid_tables)

        except Exception as e:
            stats['error'] = str(e)

        return stats


class ArtifactDetector:
    """Detect conversion artifacts that disrupt text flow"""

    # Artifact patterns with severity weights
    PATTERNS = [
        # Docling-specific
        (r'GLYPH<\d+>', 'glyph_placeholder', 10),

        # Font encoding issues
        (r'[✗✂✁☎✄✝✆✞✠✟☛✡☞✌✎✒✓✔✖✘✙✚✛✜]+', 'unicode_symbol_cluster', 5),
        (r'[➀➁➂➃➄➅➆➇➈➉➊➌➋]+', 'special_sequence', 5),

        # OCR artifacts
        (r'\b[Il1|]{4,}\b', 'ocr_confusion', 8),
        (r'[oO0]{4,}', 'ocr_zero_o', 3),

        # Layout artifacts
        (r'\n{5,}', 'excessive_newlines', 2),
        (r'^\s*\d{1,3}\s*$', 'orphan_page_number', 1),
        (r'^[A-Z\s]{30,}$', 'all_caps_noise', 3),

        # Table conversion failures
        (r'\|{5,}', 'table_separator_artifact', 5),
        (r'\+-{5,}\+', 'ascii_table_artifact', 3),

        # Hyphenation artifacts (word split across lines)
        (r'(\w{3,})-\s*\n\s*([a-z]{3,})', 'broken_hyphenation', 2),

        # Repeated content (headers/footers)
        (r'((?:JOURNAL|Journal)\s+(?:OF|of)\s+[A-Za-z\s]+\n?){3,}', 'repeated_header', 7),
        (r'((?:VOL|Vol)\.\s*\d+.*?\n?){3,}', 'repeated_volume', 7),
    ]

    def __init__(self):
        self.compiled_patterns = [
            (re.compile(p, re.MULTILINE | re.IGNORECASE), name, severity)
            for p, name, severity in self.PATTERNS
        ]

    def analyze(self, content: str) -> Dict[str, Any]:
        """Analyze markdown for artifacts"""
        artifact_counts = {}
        total_score = 0

        for pattern, name, severity in self.compiled_patterns:
            matches = pattern.findall(content)
            count = len(matches)
            if count > 0:
                artifact_counts[name] = count
                total_score += count * severity

        # Normalize to 0-100 (0 = no artifacts, 100 = many artifacts)
        max_expected_score = 500
        artifact_score = min(100, (total_score / max_expected_score) * 100)

        return {
            'artifact_types': artifact_counts,
            'artifact_score': round(artifact_score, 1),
            'total_occurrences': sum(artifact_counts.values())
        }


class MarkdownAnalyzer:
    """Analyze markdown document structure"""

    def __init__(self, content: str):
        self.content = content

    def get_char_count(self) -> int:
        return len(self.content)

    def get_word_count(self) -> int:
        return len(self.content.split())

    def count_tables(self) -> int:
        """Count markdown tables (pipe syntax)"""
        lines = self.content.split('\n')
        table_count = 0
        in_table = False
        table_rows = 0

        for line in lines:
            stripped = line.strip()
            # Table line: starts with | and contains more |
            if stripped.startswith('|') and stripped.count('|') >= 2:
                if not in_table:
                    in_table = True
                    table_rows = 1
                else:
                    table_rows += 1
            else:
                if in_table:
                    # Require header + separator + at least 1 data row
                    if table_rows >= 3:
                        table_count += 1
                    in_table = False
                    table_rows = 0

        # Handle table at end of file
        if in_table and table_rows >= 3:
            table_count += 1

        return table_count

    def get_glyph_count(self) -> int:
        return len(re.findall(r'GLYPH<\d+>', self.content))

    def get_unicode_error_count(self) -> int:
        pattern = re.compile(r'[✗✂✁☎✄✝✆✞✠✟☛✡☞✌✎✒✓✔✖✘✙✚✛✜✢✣✤✥✦★✧✩✫✪✭✬✯✮✱✰✲✴✳✶✵✸✷✹✺✼✻✽✾✿❀]+')
        matches = pattern.findall(self.content)
        return sum(len(m) for m in matches)

    def get_text_to_noise_ratio(self) -> float:
        readable_words = re.findall(r'\b[a-zA-Z]{3,}\b', self.content)
        readable_chars = sum(len(word) for word in readable_words)
        total_chars = max(len(self.content), 1)
        return readable_chars / total_chars

    def detect_sections(self) -> Dict[str, bool]:
        """Detect presence of common academic paper sections"""
        content_lower = self.content.lower()

        sections = {
            'abstract': bool(re.search(r'#+\s*abstract|^abstract\s*$', content_lower, re.MULTILINE)),
            'introduction': bool(re.search(r'#+\s*introduction|^introduction\s*$', content_lower, re.MULTILINE)),
            'methodology': bool(re.search(r'#+\s*(method|methodology|materials)', content_lower, re.MULTILINE)),
            'results': bool(re.search(r'#+\s*results|^results\s*$', content_lower, re.MULTILINE)),
            'discussion': bool(re.search(r'#+\s*discussion|^discussion\s*$', content_lower, re.MULTILINE)),
            'conclusion': bool(re.search(r'#+\s*conclusion|^conclusion', content_lower, re.MULTILINE)),
            'references': bool(re.search(r'#+\s*references|^references\s*$', content_lower, re.MULTILINE)),
        }

        return sections


class LLMSemanticValidator:
    """LLM-based semantic completeness checking"""

    def __init__(self, api_key: str, model: str = "claude-haiku-4-5-20241022"):
        self.client = Anthropic(api_key=api_key)
        self.model = model

    def validate_sample(self, md_content: str, filename: str) -> Dict[str, Any]:
        """Use LLM to assess semantic completeness of a document sample"""

        # Sample: first 3000 chars + last 1500 chars
        if len(md_content) > 5000:
            sample = md_content[:3000] + "\n\n[...truncated...]\n\n" + md_content[-1500:]
        else:
            sample = md_content

        prompt = f"""Analyze this academic paper markdown conversion for quality issues.

DOCUMENT: {filename}

CONVERTED MARKDOWN (sampled):
{sample}

Evaluate the conversion quality and respond in JSON format:

{{
    "structural_completeness": {{
        "has_title": true/false,
        "has_abstract": true/false,
        "has_body_content": true/false,
        "has_references": true/false
    }},
    "content_quality": {{
        "readable": true/false,
        "coherent_flow": true/false,
        "obvious_gaps": true/false
    }},
    "issues_detected": [
        "List 1-3 specific issues if any, empty list if none"
    ],
    "semantic_score": 0-100,
    "recommendation": "PASS" or "NEEDS_REVIEW"
}}

Focus on structural integrity, not content accuracy. Be concise."""

        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=400,
                temperature=0,
                messages=[{"role": "user", "content": prompt}]
            )

            # Parse JSON from response
            response_text = response.content[0].text
            # Find JSON in response
            json_match = re.search(r'\{[\s\S]*\}', response_text)
            if json_match:
                result = json.loads(json_match.group())
                return {
                    'success': True,
                    'semantic_score': result.get('semantic_score', 50),
                    'issues': result.get('issues_detected', []),
                    'recommendation': result.get('recommendation', 'NEEDS_REVIEW'),
                    'details': result
                }
            else:
                return {
                    'success': False,
                    'error': 'Could not parse LLM response',
                    'semantic_score': None,
                    'issues': ['LLM response parsing failed']
                }

        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'semantic_score': None,
                'issues': [f'LLM validation failed: {str(e)}']
            }


class EnhancedMarkdownValidator:
    """Enhanced validator with PDF comparison and artifact detection"""

    # Thresholds
    MAX_GLYPH_COUNT = 50
    MIN_CHAR_RATIO = 0.7  # MD should have at least 70% of PDF chars
    MAX_ARTIFACT_SCORE = 30
    MIN_TEXT_NOISE_RATIO = 0.3
    MIN_SEMANTIC_SCORE = 70

    def __init__(self, llm_validator: Optional[LLMSemanticValidator] = None):
        self.artifact_detector = ArtifactDetector()
        self.llm_validator = llm_validator

    def find_matching_pdf(self, md_path: Path, pdf_dir: Path) -> Optional[Path]:
        """Find the PDF that corresponds to this markdown file"""
        md_stem = md_path.stem

        # Try exact match
        pdf_path = pdf_dir / f"{md_stem}.pdf"
        if pdf_path.exists():
            return pdf_path

        # Try case-insensitive match
        for pdf_file in pdf_dir.glob("*.pdf"):
            if pdf_file.stem.lower() == md_stem.lower():
                return pdf_file

        # Try partial match (markdown might have truncated name)
        for pdf_file in pdf_dir.glob("*.pdf"):
            if md_stem.lower() in pdf_file.stem.lower() or pdf_file.stem.lower() in md_stem.lower():
                return pdf_file

        return None

    def validate_file(
        self,
        md_path: Path,
        pdf_dir: Path,
        run_llm_check: bool = False
    ) -> EnhancedValidationMetrics:
        """Validate a single markdown file with PDF comparison"""

        # Read markdown
        try:
            md_content = md_path.read_text(encoding='utf-8', errors='replace')
        except Exception as e:
            return self._create_error_metrics(md_path.name, str(e))

        # Analyze markdown
        md_analyzer = MarkdownAnalyzer(md_content)

        # Find and analyze PDF
        pdf_path = self.find_matching_pdf(md_path, pdf_dir)
        pdf_stats = {'char_count': 0, 'word_count': 0, 'table_count': 0}
        pdf_filename = "NOT_FOUND"

        if pdf_path:
            pdf_filename = pdf_path.name
            pdf_analyzer = PDFAnalyzer(pdf_path)
            pdf_stats = pdf_analyzer.extract_stats()

        # Calculate metrics
        md_chars = md_analyzer.get_char_count()
        md_words = md_analyzer.get_word_count()
        pdf_chars = pdf_stats.get('char_count', 0)
        pdf_words = pdf_stats.get('word_count', 0)

        # Character ratio (avoid division by zero)
        char_ratio = md_chars / max(pdf_chars, 1) if pdf_chars > 0 else 1.0

        # Table comparison
        md_tables = md_analyzer.count_tables()
        pdf_tables = pdf_stats.get('table_count', 0)

        # Artifact detection
        artifact_results = self.artifact_detector.analyze(md_content)

        # Section detection
        sections = md_analyzer.detect_sections()

        # LLM semantic check (optional)
        llm_result = {'semantic_score': None, 'issues': [], 'success': False}
        if run_llm_check and self.llm_validator:
            llm_result = self.llm_validator.validate_sample(md_content, md_path.name)

        # Determine issues and status
        issues = []
        review_reasons = []

        glyph_count = md_analyzer.get_glyph_count()
        if glyph_count > self.MAX_GLYPH_COUNT:
            issues.append(f"High GLYPH count: {glyph_count}")
            review_reasons.append("glyph_threshold_exceeded")

        if char_ratio < self.MIN_CHAR_RATIO and pdf_chars > 0:
            issues.append(f"Low char ratio: {char_ratio:.2f} (possible text loss)")
            review_reasons.append("text_loss_detected")

        if artifact_results['artifact_score'] > self.MAX_ARTIFACT_SCORE:
            issues.append(f"High artifact score: {artifact_results['artifact_score']:.1f}")
            review_reasons.append("artifact_threshold_exceeded")

        text_ratio = md_analyzer.get_text_to_noise_ratio()
        if text_ratio < self.MIN_TEXT_NOISE_RATIO:
            issues.append(f"Low text ratio: {text_ratio:.2%}")
            review_reasons.append("low_text_ratio")

        table_mismatch = (pdf_tables > 0 and md_tables == 0) or (abs(pdf_tables - md_tables) > 2)
        if table_mismatch:
            issues.append(f"Table mismatch: PDF={pdf_tables}, MD={md_tables}")
            review_reasons.append("table_mismatch")

        if llm_result.get('success') and llm_result.get('semantic_score', 100) < self.MIN_SEMANTIC_SCORE:
            issues.append(f"Low semantic score: {llm_result['semantic_score']}")
            review_reasons.append("semantic_score_low")

        # Calculate confidence score
        confidence = 100
        confidence -= min(30, glyph_count / 2)  # -30 max for glyphs
        confidence -= min(20, (1 - char_ratio) * 40) if char_ratio < 1 else 0  # -20 max for char loss
        confidence -= min(20, artifact_results['artifact_score'] / 5)  # -20 max for artifacts
        confidence -= min(15, (0.5 - text_ratio) * 30) if text_ratio < 0.5 else 0  # -15 max for noise
        confidence = max(0, min(100, confidence))

        # Determine status
        if confidence < 50 or text_ratio < 0.1 or glyph_count > 200:
            status = "FAIL"
        elif issues:
            status = "WARNING"
        else:
            status = "PASS"

        needs_review = status != "PASS" or len(review_reasons) > 0

        return EnhancedValidationMetrics(
            filename=md_path.name,
            pdf_filename=pdf_filename,
            md_char_count=md_chars,
            md_word_count=md_words,
            md_file_size_mb=len(md_content) / (1024 * 1024),
            glyph_count=glyph_count,
            unicode_error_count=md_analyzer.get_unicode_error_count(),
            text_to_noise_ratio=round(text_ratio, 3),
            pdf_char_count=pdf_chars,
            pdf_word_count=pdf_words,
            char_ratio=round(char_ratio, 3),
            char_loss_warning=char_ratio < self.MIN_CHAR_RATIO and pdf_chars > 0,
            pdf_table_count=pdf_tables,
            md_table_count=md_tables,
            table_mismatch=table_mismatch,
            artifact_types=artifact_results['artifact_types'],
            artifact_score=artifact_results['artifact_score'],
            llm_reviewed=llm_result.get('success', False),
            semantic_score=llm_result.get('semantic_score'),
            section_coverage=sections,
            llm_issues=llm_result.get('issues', []),
            confidence_score=round(confidence, 1),
            status=status,
            issues=issues,
            needs_manual_review=needs_review,
            manual_review_reasons=review_reasons
        )

    def _create_error_metrics(self, filename: str, error: str) -> EnhancedValidationMetrics:
        """Create metrics object for files that couldn't be processed"""
        return EnhancedValidationMetrics(
            filename=filename,
            pdf_filename="ERROR",
            md_char_count=0,
            md_word_count=0,
            md_file_size_mb=0,
            glyph_count=0,
            unicode_error_count=0,
            text_to_noise_ratio=0,
            pdf_char_count=0,
            pdf_word_count=0,
            char_ratio=0,
            char_loss_warning=True,
            pdf_table_count=0,
            md_table_count=0,
            table_mismatch=False,
            artifact_types={},
            artifact_score=100,
            llm_reviewed=False,
            semantic_score=None,
            section_coverage={},
            llm_issues=[],
            confidence_score=0,
            status="FAIL",
            issues=[f"Error reading file: {error}"],
            needs_manual_review=True,
            manual_review_reasons=["file_read_error"]
        )

    def validate_directory(
        self,
        md_dir: Path,
        pdf_dir: Path,
        llm_sample_rate: float = 0.0,
        llm_check_flagged: bool = True
    ) -> List[EnhancedValidationMetrics]:
        """Validate all markdown files in a directory"""

        md_files = sorted(md_dir.glob("*.md"))
        if not md_files:
            print(f"[WARNING] No markdown files found in {md_dir}")
            return []

        print(f"[*] Validating {len(md_files)} markdown files...")
        print(f"[*] PDF directory: {pdf_dir}")
        if self.llm_validator:
            print(f"[*] LLM spot-check enabled (sample rate: {llm_sample_rate:.0%})")
        print()

        results = []

        # First pass: validate all without LLM
        for i, md_path in enumerate(md_files, 1):
            print(f"[{i}/{len(md_files)}] {md_path.name}...", end=" ")
            metrics = self.validate_file(md_path, pdf_dir, run_llm_check=False)
            results.append(metrics)
            print(f"{metrics.status} (conf: {metrics.confidence_score:.0f})")

        # Second pass: LLM spot-check on sample + flagged
        if self.llm_validator and (llm_sample_rate > 0 or llm_check_flagged):
            print("\n[*] Running LLM spot-checks...")

            # Select documents for LLM check
            llm_check_indices = set()

            # Add flagged documents
            if llm_check_flagged:
                for i, r in enumerate(results):
                    if r.status != "PASS":
                        llm_check_indices.add(i)

            # Add random sample from passing
            if llm_sample_rate > 0:
                passing_indices = [i for i, r in enumerate(results) if r.status == "PASS"]
                sample_size = max(1, int(len(passing_indices) * llm_sample_rate))
                llm_check_indices.update(random.sample(passing_indices, min(sample_size, len(passing_indices))))

            for i in sorted(llm_check_indices):
                md_path = md_files[i]
                print(f"  LLM checking: {md_path.name}...", end=" ")

                # Re-validate with LLM
                metrics = self.validate_file(md_path, pdf_dir, run_llm_check=True)
                results[i] = metrics

                if metrics.semantic_score:
                    print(f"score: {metrics.semantic_score}")
                else:
                    print("failed")

                # Rate limiting
                import time
                time.sleep(1)

        return results


class ValidationReportGenerator:
    """Generate comprehensive validation reports"""

    def __init__(self, results: List[EnhancedValidationMetrics]):
        self.results = results

    def generate_summary(self) -> Dict[str, Any]:
        """Generate summary statistics"""
        status_counts = Counter(r.status for r in self.results)

        char_ratios = [r.char_ratio for r in self.results if r.pdf_char_count > 0]
        artifact_scores = [r.artifact_score for r in self.results]
        confidence_scores = [r.confidence_score for r in self.results]

        return {
            'total_documents': len(self.results),
            'status_distribution': {
                'pass': status_counts.get('PASS', 0),
                'warning': status_counts.get('WARNING', 0),
                'fail': status_counts.get('FAIL', 0)
            },
            'pass_rate': status_counts.get('PASS', 0) / max(len(self.results), 1),
            'metrics': {
                'avg_char_ratio': sum(char_ratios) / max(len(char_ratios), 1) if char_ratios else None,
                'avg_artifact_score': sum(artifact_scores) / max(len(artifact_scores), 1),
                'avg_confidence': sum(confidence_scores) / max(len(confidence_scores), 1),
                'min_confidence': min(confidence_scores) if confidence_scores else 0,
                'max_confidence': max(confidence_scores) if confidence_scores else 0,
            },
            'table_mismatch_count': sum(1 for r in self.results if r.table_mismatch),
            'char_loss_warning_count': sum(1 for r in self.results if r.char_loss_warning),
            'manual_review_queue_size': sum(1 for r in self.results if r.needs_manual_review),
            'llm_reviewed_count': sum(1 for r in self.results if r.llm_reviewed)
        }

    def get_manual_review_queue(self) -> List[Dict[str, Any]]:
        """Get prioritized list of documents needing manual review"""
        flagged = [r for r in self.results if r.needs_manual_review]

        def priority_score(r: EnhancedValidationMetrics) -> int:
            score = 0
            if r.status == "FAIL":
                score += 100
            elif r.status == "WARNING":
                score += 50
            if r.char_loss_warning:
                score += 30
            if r.table_mismatch:
                score += 20
            score += int(r.artifact_score)
            return score

        flagged.sort(key=priority_score, reverse=True)

        return [
            {
                'filename': r.filename,
                'status': r.status,
                'confidence': r.confidence_score,
                'issues': r.issues,
                'reasons': r.manual_review_reasons,
                'priority': 'HIGH' if priority_score(r) > 100 else 'MEDIUM' if priority_score(r) > 50 else 'LOW'
            }
            for r in flagged
        ]

    def save_json_report(self, output_path: Path) -> None:
        """Save comprehensive JSON report"""
        report = {
            'metadata': {
                'timestamp': datetime.now().isoformat(),
                'version': '2.0',
                'validator': 'validate_markdown_enhanced.py'
            },
            'summary': self.generate_summary(),
            'manual_review_queue': self.get_manual_review_queue(),
            'detailed_results': [asdict(r) for r in self.results]
        }

        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding='utf-8')
        print(f"[SAVED] JSON report: {output_path}")

    def save_csv_summary(self, output_path: Path) -> None:
        """Save CSV summary for spreadsheet analysis"""
        import csv

        output_path.parent.mkdir(parents=True, exist_ok=True)

        with output_path.open('w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([
                'Filename', 'Status', 'Confidence', 'Char_Ratio',
                'GLYPH_Count', 'Artifact_Score', 'Tables_PDF', 'Tables_MD',
                'Table_Mismatch', 'Needs_Review', 'Issues'
            ])

            for r in self.results:
                writer.writerow([
                    r.filename,
                    r.status,
                    f"{r.confidence_score:.1f}",
                    f"{r.char_ratio:.3f}",
                    r.glyph_count,
                    f"{r.artifact_score:.1f}",
                    r.pdf_table_count,
                    r.md_table_count,
                    'YES' if r.table_mismatch else 'NO',
                    'YES' if r.needs_manual_review else 'NO',
                    '; '.join(r.issues)
                ])

        print(f"[SAVED] CSV summary: {output_path}")

    def save_review_queue(self, output_path: Path) -> None:
        """Save manual review queue as CSV"""
        import csv

        queue = self.get_manual_review_queue()

        output_path.parent.mkdir(parents=True, exist_ok=True)

        with output_path.open('w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['Priority', 'Filename', 'Status', 'Confidence', 'Issues', 'Review_Reasons'])

            for item in queue:
                writer.writerow([
                    item['priority'],
                    item['filename'],
                    item['status'],
                    f"{item['confidence']:.1f}",
                    '; '.join(item['issues']),
                    '; '.join(item['reasons'])
                ])

        print(f"[SAVED] Review queue: {output_path}")

    def save_markdown_report(self, output_path: Path) -> None:
        """Save human-readable markdown report"""
        summary = self.generate_summary()
        queue = self.get_manual_review_queue()

        report = f"""# Markdown Validation Report

**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M')}

---

## Summary

| Metric | Value |
|--------|-------|
| Total Documents | {summary['total_documents']} |
| Pass | {summary['status_distribution']['pass']} |
| Warning | {summary['status_distribution']['warning']} |
| Fail | {summary['status_distribution']['fail']} |
| Pass Rate | {summary['pass_rate']:.1%} |

### Quality Metrics

| Metric | Value |
|--------|-------|
| Avg Character Ratio | {f"{summary['metrics']['avg_char_ratio']:.3f}" if summary['metrics']['avg_char_ratio'] else 'N/A'} |
| Avg Artifact Score | {summary['metrics']['avg_artifact_score']:.1f} |
| Avg Confidence | {summary['metrics']['avg_confidence']:.1f} |
| Documents with Table Mismatch | {summary['table_mismatch_count']} |
| Documents with Text Loss | {summary['char_loss_warning_count']} |
| Manual Review Queue | {summary['manual_review_queue_size']} |

---

## Manual Review Queue ({len(queue)} documents)

"""

        if queue:
            report += "| Priority | Filename | Status | Confidence | Issues |\n"
            report += "|----------|----------|--------|------------|--------|\n"

            for item in queue[:30]:  # Show top 30
                issues_short = item['issues'][0][:50] + '...' if item['issues'] else '-'
                report += f"| {item['priority']} | {item['filename'][:40]} | {item['status']} | {item['confidence']:.0f} | {issues_short} |\n"

            if len(queue) > 30:
                report += f"\n*... and {len(queue) - 30} more documents*\n"
        else:
            report += "*No documents require manual review.*\n"

        report += "\n---\n\n*Report generated by validate_markdown_enhanced.py*\n"

        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(report, encoding='utf-8')
        print(f"[SAVED] Markdown report: {output_path}")

    def print_summary(self) -> None:
        """Print summary to console"""
        summary = self.generate_summary()

        print("\n" + "=" * 70)
        print("ENHANCED VALIDATION SUMMARY")
        print("=" * 70)

        print(f"\nTotal Documents: {summary['total_documents']}")
        print(f"  PASS:    {summary['status_distribution']['pass']:3d} ({summary['status_distribution']['pass']/max(summary['total_documents'],1):.1%})")
        print(f"  WARNING: {summary['status_distribution']['warning']:3d}")
        print(f"  FAIL:    {summary['status_distribution']['fail']:3d}")

        print(f"\nQuality Metrics:")
        print(f"  Avg Confidence Score: {summary['metrics']['avg_confidence']:.1f}/100")
        if summary['metrics']['avg_char_ratio']:
            print(f"  Avg Character Ratio:  {summary['metrics']['avg_char_ratio']:.2f}")
        print(f"  Avg Artifact Score:   {summary['metrics']['avg_artifact_score']:.1f}/100")

        print(f"\nIssues Detected:")
        print(f"  Table Mismatches:     {summary['table_mismatch_count']}")
        print(f"  Text Loss Warnings:   {summary['char_loss_warning_count']}")
        print(f"  Manual Review Queue:  {summary['manual_review_queue_size']}")

        if summary['llm_reviewed_count'] > 0:
            print(f"  LLM Reviewed:         {summary['llm_reviewed_count']}")

        print("\n" + "=" * 70 + "\n")


def main():
    parser = argparse.ArgumentParser(
        description="Enhanced markdown validation with PDF comparison"
    )
    parser.add_argument(
        "--md-dir", required=True,
        help="Directory containing markdown files"
    )
    parser.add_argument(
        "--pdf-dir", required=True,
        help="Directory containing source PDF files"
    )
    parser.add_argument(
        "--output-dir", default="pipeline/validation_reports",
        help="Directory for output reports"
    )
    parser.add_argument(
        "--llm-check", action="store_true",
        help="Enable LLM spot-checking"
    )
    parser.add_argument(
        "--llm-sample-rate", type=float, default=0.1,
        help="Sample rate for LLM checking (0.0-1.0, default: 0.1)"
    )

    args = parser.parse_args()

    md_dir = Path(args.md_dir)
    pdf_dir = Path(args.pdf_dir)
    output_dir = Path(args.output_dir)

    if not md_dir.exists():
        print(f"[ERROR] Markdown directory not found: {md_dir}")
        return 1

    if not pdf_dir.exists():
        print(f"[ERROR] PDF directory not found: {pdf_dir}")
        return 1

    # Initialize LLM validator if requested
    llm_validator = None
    if args.llm_check:
        if not ANTHROPIC_AVAILABLE:
            print("[WARNING] anthropic not installed. LLM checking disabled.")
        else:
            load_env_file()
            api_key = get_env_var('ANTHROPIC_API_KEY', required=False)
            if api_key:
                llm_validator = LLMSemanticValidator(api_key)
                print("[*] LLM validator initialized")
            else:
                print("[WARNING] ANTHROPIC_API_KEY not found. LLM checking disabled.")

    # Run validation
    validator = EnhancedMarkdownValidator(llm_validator=llm_validator)
    results = validator.validate_directory(
        md_dir,
        pdf_dir,
        llm_sample_rate=args.llm_sample_rate if llm_validator else 0.0,
        llm_check_flagged=True if llm_validator else False
    )

    if not results:
        print("[ERROR] No results generated")
        return 1

    # Generate reports
    timestamp = datetime.now().strftime('%Y%m%d_%H%M')
    report_gen = ValidationReportGenerator(results)

    report_gen.print_summary()
    report_gen.save_json_report(output_dir / f"validation_report_{timestamp}.json")
    report_gen.save_csv_summary(output_dir / f"validation_summary_{timestamp}.csv")
    report_gen.save_review_queue(output_dir / f"manual_review_queue_{timestamp}.csv")
    report_gen.save_markdown_report(output_dir / f"validation_report_{timestamp}.md")

    # Return code based on results
    fail_count = sum(1 for r in results if r.status == "FAIL")
    warning_count = sum(1 for r in results if r.status == "WARNING")

    if fail_count > 0:
        return 2
    elif warning_count > 0:
        return 1
    else:
        return 0


if __name__ == "__main__":
    sys.exit(main())
