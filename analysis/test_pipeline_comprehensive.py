#!/usr/bin/env python3
"""
Comprehensive Pipeline Test Suite
Tests all 5 stages of the Literature Review research pipeline with detailed logging
"""

import os
import sys
import json
import time
import logging
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional
import subprocess

class PipelineComprehensiveTester:
    """Comprehensive test suite for all pipeline stages"""

    def __init__(self, log_file: str = None):
        self.base_path = Path(__file__).parent.parent
        self.test_start = datetime.now()
        self.test_id = self.test_start.strftime("%Y%m%d_%H%M%S")

        # Setup logging
        if log_file is None:
            log_file = self.base_path / f"test_pipeline_{self.test_id}.log"

        logging.basicConfig(
            level=logging.DEBUG,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler(sys.stdout)
            ]
        )
        self.logger = logging.getLogger(__name__)

        # Test results
        self.results = {
            'test_id': self.test_id,
            'start_time': self.test_start.isoformat(),
            'stages': {},
            'overall_success': False
        }

        self.logger.info("="*80)
        self.logger.info("COMPREHENSIVE PIPELINE TEST SUITE")
        self.logger.info(f"Test ID: {self.test_id}")
        self.logger.info("="*80)

    def log_stage_start(self, stage_name: str, stage_num: int):
        """Log the start of a test stage"""
        self.logger.info("")
        self.logger.info("="*80)
        self.logger.info(f"STAGE {stage_num}: {stage_name}")
        self.logger.info("="*80)
        return time.time()

    def log_stage_end(self, stage_name: str, start_time: float, success: bool, details: Dict):
        """Log the end of a test stage with results"""
        duration = time.time() - start_time
        status = "SUCCESS" if success else "FAILED"

        self.logger.info("-"*80)
        self.logger.info(f"Stage Result: {status}")
        self.logger.info(f"Duration: {duration:.2f}s")
        self.logger.info(f"Details: {json.dumps(details, indent=2)}")
        self.logger.info("-"*80)

        self.results['stages'][stage_name] = {
            'success': success,
            'duration': duration,
            'details': details
        }

        return success

    def test_environment(self) -> bool:
        """Test 0: Environment and dependencies"""
        start_time = self.log_stage_start("Environment Check", 0)
        details = {}

        try:
            # Python version
            py_version = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
            self.logger.info(f"Python version: {py_version}")
            details['python_version'] = py_version

            # Check API key
            api_key = os.environ.get('ANTHROPIC_API_KEY')
            if api_key:
                self.logger.info(f"ANTHROPIC_API_KEY: Found ({len(api_key)} chars)")
                details['api_key_present'] = True
            else:
                self.logger.warning("ANTHROPIC_API_KEY: NOT FOUND")
                details['api_key_present'] = False

            # Check required packages
            required_packages = [
                'anthropic', 'requests', 'yaml', 'pandas',
                'openpyxl', 'pyzotero', 'dotenv'
            ]

            details['packages'] = {}
            for package in required_packages:
                try:
                    __import__(package.replace('-', '_'))
                    self.logger.info(f"Package '{package}': OK")
                    details['packages'][package] = True
                except ImportError:
                    self.logger.error(f"Package '{package}': MISSING")
                    details['packages'][package] = False

            # Check directories
            required_dirs = [
                'analysis', 'analysis/pdfs', 'analysis/summaries_final',
                'Literature Review_Vault'
            ]

            details['directories'] = {}
            for dir_path in required_dirs:
                full_path = self.base_path / dir_path
                exists = full_path.exists()
                self.logger.info(f"Directory '{dir_path}': {'OK' if exists else 'MISSING'}")
                details['directories'][dir_path] = exists

            # Check input files
            zotero_json = self.base_path / "analysis" / "zotero_vereinfacht.json"
            if zotero_json.exists():
                self.logger.info(f"Input file: {zotero_json.name} OK")
                details['input_file'] = str(zotero_json)
            else:
                self.logger.warning(f"Input file: {zotero_json.name} MISSING")
                details['input_file'] = None

            # Overall success
            success = (
                details['api_key_present'] and
                all(details['packages'].values()) and
                all(details['directories'].values())
            )

        except Exception as e:
            self.logger.error(f"Environment check failed: {e}")
            details['error'] = str(e)
            success = False

        return self.log_stage_end("Environment Check", start_time, success, details)

    def test_stage1_pdf_acquisition(self) -> bool:
        """Test Stage 1: PDF Acquisition"""
        start_time = self.log_stage_start("PDF Acquisition", 1)
        details = {}

        try:
            script = self.base_path / "analysis" / "getPDF_intelligent.py"

            if not script.exists():
                self.logger.error(f"Script not found: {script}")
                details['error'] = "Script not found"
                return self.log_stage_end("PDF Acquisition", start_time, False, details)

            # Count PDFs before
            pdf_dir = self.base_path / "analysis" / "pdfs"
            pdfs_before = len(list(pdf_dir.glob("*.pdf"))) if pdf_dir.exists() else 0
            self.logger.info(f"PDFs before: {pdfs_before}")

            # Run script (dry-run check only)
            self.logger.info("Checking script can be loaded...")
            result = subprocess.run(
                [sys.executable, str(script), "--help"],
                capture_output=True,
                text=True,
                timeout=30
            )

            details['pdfs_count'] = pdfs_before
            details['script_loadable'] = result.returncode == 0

            success = result.returncode == 0

        except Exception as e:
            self.logger.error(f"Stage 1 test failed: {e}")
            details['error'] = str(e)
            success = False

        return self.log_stage_end("PDF Acquisition", start_time, success, details)

    def test_stage2_pdf_conversion(self) -> bool:
        """Test Stage 2: PDF to Markdown Conversion"""
        start_time = self.log_stage_start("PDF Conversion", 2)
        details = {}

        try:
            script = self.base_path / "analysis" / "pdf-to-md-converter.py"

            if not script.exists():
                self.logger.error(f"Script not found: {script}")
                details['error'] = "Script not found"
                return self.log_stage_end("PDF Conversion", start_time, False, details)

            # Count markdown files
            md_dir = self.base_path / "analysis" / "markdown_papers"
            md_count = len(list(md_dir.glob("*.md"))) if md_dir.exists() else 0
            self.logger.info(f"Markdown files: {md_count}")

            # Check script syntax
            self.logger.info("Checking script syntax...")
            result = subprocess.run(
                [sys.executable, "-m", "py_compile", str(script)],
                capture_output=True,
                text=True,
                timeout=10
            )

            details['markdown_count'] = md_count
            details['script_valid'] = result.returncode == 0

            if result.returncode != 0:
                self.logger.error(f"Script syntax error: {result.stderr}")
                details['error'] = result.stderr

            success = result.returncode == 0

        except Exception as e:
            self.logger.error(f"Stage 2 test failed: {e}")
            details['error'] = str(e)
            success = False

        return self.log_stage_end("PDF Conversion", start_time, success, details)

    def test_stage3_summarization(self) -> bool:
        """Test Stage 3: Document Summarization with Claude"""
        start_time = self.log_stage_start("Claude Summarization", 3)
        details = {}

        try:
            script = self.base_path / "analysis" / "summarize-documents.py"

            if not script.exists():
                self.logger.error(f"Script not found: {script}")
                details['error'] = "Script not found"
                return self.log_stage_end("Claude Summarization", start_time, False, details)

            # Count summaries
            summaries_dir = self.base_path / "analysis" / "summaries_final"
            summaries = list(summaries_dir.glob("*.md")) if summaries_dir.exists() else []
            self.logger.info(f"Summaries found: {len(summaries)}")

            # Check batch metadata
            batch_meta = summaries_dir / "batch_metadata.json"
            if batch_meta.exists():
                with open(batch_meta) as f:
                    meta = json.load(f)
                self.logger.info(f"Batch metadata: {json.dumps(meta, indent=2)}")
                details['batch_metadata'] = meta

            # Validate summary structure
            details['summaries'] = {}
            for summary_file in summaries[:5]:  # Check first 5
                self.logger.info(f"Validating: {summary_file.name}")
                with open(summary_file, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Check YAML frontmatter
                has_yaml = content.startswith('---')
                has_title = 'title:' in content[:500]
                has_model = 'ai_model:' in content[:1000]

                details['summaries'][summary_file.name] = {
                    'has_yaml': has_yaml,
                    'has_title': has_title,
                    'has_model': has_model,
                    'size': len(content)
                }

                self.logger.info(f"  YAML: {has_yaml}, Title: {has_title}, Model: {has_model}")

            success = len(summaries) > 0
            details['summary_count'] = len(summaries)

        except Exception as e:
            self.logger.error(f"Stage 3 test failed: {e}")
            details['error'] = str(e)
            success = False

        return self.log_stage_end("Claude Summarization", start_time, success, details)

    def test_stage4_vault_generation(self) -> bool:
        """Test Stage 4: Obsidian Vault Generation"""
        start_time = self.log_stage_start("Vault Generation", 4)
        details = {}

        try:
            script = self.base_path / "analysis" / "generate_obsidian_vault_improved.py"
            vault_path = self.base_path / "Literature Review_Vault"

            if not script.exists():
                self.logger.error(f"Script not found: {script}")
                details['error'] = "Script not found"
                return self.log_stage_end("Vault Generation", start_time, False, details)

            # Check vault structure
            if not vault_path.exists():
                self.logger.warning("Vault does not exist")
                details['vault_exists'] = False
                return self.log_stage_end("Vault Generation", start_time, False, details)

            self.logger.info(f"Vault path: {vault_path}")
            details['vault_exists'] = True

            # Count vault contents
            papers = list((vault_path / "Papers").glob("*.md")) if (vault_path / "Papers").exists() else []
            concepts = list((vault_path / "Concepts").rglob("*.md")) if (vault_path / "Concepts").exists() else []

            self.logger.info(f"Papers: {len(papers)}")
            self.logger.info(f"Concepts: {len(concepts)}")

            details['papers_count'] = len(papers)
            details['concepts_count'] = len(concepts)

            # Check MOCs
            master_moc = vault_path / "MASTER_MOC.md"
            details['has_master_moc'] = master_moc.exists()
            self.logger.info(f"Master MOC: {details['has_master_moc']}")

            success = len(papers) > 0 and len(concepts) > 0

        except Exception as e:
            self.logger.error(f"Stage 4 test failed: {e}")
            details['error'] = str(e)
            success = False

        return self.log_stage_end("Vault Generation", start_time, success, details)

    def test_stage5_quality_validation(self) -> bool:
        """Test Stage 5: Quality Validation"""
        start_time = self.log_stage_start("Quality Validation", 5)
        details = {}

        try:
            script = self.base_path / "analysis" / "test_vault_quality.py"

            if not script.exists():
                self.logger.error(f"Script not found: {script}")
                details['error'] = "Script not found"
                return self.log_stage_end("Quality Validation", start_time, False, details)

            # Run quality tests
            self.logger.info("Running quality validation...")
            result = subprocess.run(
                [sys.executable, str(script)],
                capture_output=True,
                text=True,
                timeout=60,
                cwd=self.base_path
            )

            details['exit_code'] = result.returncode

            # Check for quality report
            report_file = self.base_path / "analysis" / "vault_test_report.json"
            if report_file.exists():
                with open(report_file) as f:
                    report = json.load(f)
                self.logger.info(f"Quality report: {json.dumps(report, indent=2)}")
                details['quality_report'] = report
                details['quality_score'] = report.get('quality_score', 0)
            else:
                self.logger.warning("Quality report not found")
                details['quality_report'] = None

            success = result.returncode == 0

        except Exception as e:
            self.logger.error(f"Stage 5 test failed: {e}")
            details['error'] = str(e)
            success = False

        return self.log_stage_end("Quality Validation", start_time, success, details)

    def run_all_tests(self) -> Dict:
        """Run all pipeline tests"""
        self.logger.info("Starting comprehensive pipeline test...")

        # Run tests in order
        test_sequence = [
            ("Environment", self.test_environment),
            ("Stage 1", self.test_stage1_pdf_acquisition),
            ("Stage 2", self.test_stage2_pdf_conversion),
            ("Stage 3", self.test_stage3_summarization),
            ("Stage 4", self.test_stage4_vault_generation),
            ("Stage 5", self.test_stage5_quality_validation)
        ]

        all_passed = True
        for test_name, test_func in test_sequence:
            try:
                passed = test_func()
                if not passed:
                    self.logger.warning(f"{test_name} FAILED")
                    all_passed = False
            except Exception as e:
                self.logger.error(f"{test_name} CRASHED: {e}")
                all_passed = False

        # Final summary
        self.results['overall_success'] = all_passed
        self.results['end_time'] = datetime.now().isoformat()
        self.results['total_duration'] = (datetime.now() - self.test_start).total_seconds()

        self.logger.info("")
        self.logger.info("="*80)
        self.logger.info("FINAL TEST SUMMARY")
        self.logger.info("="*80)
        self.logger.info(f"Overall Status: {'SUCCESS' if all_passed else 'FAILED'}")
        self.logger.info(f"Total Duration: {self.results['total_duration']:.2f}s")
        self.logger.info(f"Tests Passed: {sum(1 for s in self.results['stages'].values() if s['success'])}/{len(self.results['stages'])}")

        # Save results
        results_file = self.base_path / f"test_results_{self.test_id}.json"
        with open(results_file, 'w') as f:
            json.dump(self.results, f, indent=2)
        self.logger.info(f"Results saved: {results_file}")

        return self.results


def main():
    """Main entry point"""
    tester = PipelineComprehensiveTester()
    results = tester.run_all_tests()

    # Exit with appropriate code
    sys.exit(0 if results['overall_success'] else 1)


if __name__ == "__main__":
    main()
