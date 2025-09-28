#!/usr/bin/env python3
"""
Test Script for FemPrompt Research Pipeline
Simulates the complete workflow with mock data for testing and validation
"""

import os
import sys
import json
import time
import shutil
import random
import logging
import argparse
from pathlib import Path
from datetime import datetime
from typing import Dict, List
import traceback

# ANSI Colors
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'


class PipelineTestSimulator:
    """Simulates pipeline execution with mock data"""

    def __init__(self, mode: str = 'quick', with_errors: bool = False, verbose: bool = False):
        """
        Initialize test simulator

        Args:
            mode: 'quick' (5 papers) or 'full' (30 papers)
            with_errors: Inject random errors for testing
            verbose: Enable verbose output
        """
        self.mode = mode
        self.with_errors = with_errors
        self.verbose = verbose
        self.base_path = Path(__file__).parent
        self.test_dir = self.base_path / 'test_pipeline_data'
        self.start_time = datetime.now()

        # Configure test parameters
        self.num_papers = 5 if mode == 'quick' else 30
        self.error_probability = 0.3 if with_errors else 0

        # Setup logging
        self._setup_logging()

        # Statistics
        self.stats = {
            'stages_completed': 0,
            'stages_failed': 0,
            'mock_files_created': 0,
            'total_duration': 0
        }

    def _setup_logging(self):
        """Setup test logging"""
        log_level = logging.DEBUG if self.verbose else logging.INFO
        log_file = self.base_path / f"test_pipeline_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"

        logging.basicConfig(
            level=log_level,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger('TestPipeline')

    def _print_header(self):
        """Print test header"""
        print(f"\n{Colors.BOLD}{Colors.HEADER}Pipeline Test Simulator{Colors.ENDC}")
        print("="*60)
        print(f"Mode: {self.mode.upper()} ({self.num_papers} papers)")
        print(f"Error injection: {'Enabled' if self.with_errors else 'Disabled'}")
        print(f"Test directory: {self.test_dir}")
        print("="*60 + "\n")

    def _create_mock_bibliography(self) -> Dict:
        """Create mock Zotero bibliography"""
        self.logger.info(f"Creating mock bibliography with {self.num_papers} papers")

        papers = []
        for i in range(1, self.num_papers + 1):
            paper = {
                'key': f'TEST{i:04d}',
                'title': f'Test Paper {i}: Investigating Bias in AI Systems Using {random.choice(["Feminist", "Intersectional", "Critical"])} Approaches',
                'creators': [
                    {'lastName': f'Author{i}', 'firstName': f'Test{i}'},
                    {'lastName': 'Collaborator', 'firstName': 'Research'}
                ],
                'date': f'{random.randint(2023, 2025)}',
                'DOI': f'10.1234/test.{i:04d}',
                'url': f'https://example.com/papers/test_{i}.pdf',
                'abstractNote': f'This is a test abstract for paper {i} discussing various aspects of AI bias and mitigation strategies.',
                'attachments': []
            }

            # Randomly add attachment (simulating Zotero PDFs)
            if random.random() > 0.3:
                paper['attachments'].append({
                    'key': f'PDF{i:04d}',
                    'title': 'Full Text PDF',
                    'mimeType': 'application/pdf',
                    'path': f'storage:test_paper_{i}.pdf'
                })

            papers.append(paper)

        bibliography = {'items': papers}

        # Save to file
        json_path = self.test_dir / 'analysis' / 'zotero_vereinfacht.json'
        json_path.parent.mkdir(parents=True, exist_ok=True)
        with open(json_path, 'w') as f:
            json.dump(bibliography, f, indent=2)

        self.stats['mock_files_created'] += 1
        return bibliography

    def _create_mock_pdfs(self):
        """Create mock PDF files"""
        pdf_dir = self.test_dir / 'analysis' / 'pdfs'
        pdf_dir.mkdir(parents=True, exist_ok=True)

        created = 0
        for i in range(1, self.num_papers + 1):
            # Simulate some PDFs not being available
            if random.random() > 0.1:  # 90% success rate
                pdf_path = pdf_dir / f'Author{i}_{random.randint(2023,2025)}_Test.pdf'
                # Create fake PDF (just text file for testing)
                with open(pdf_path, 'wb') as f:
                    f.write(b'%PDF-1.4\n')  # PDF header
                    f.write(f'Mock PDF content for test paper {i}\n'.encode() * 100)
                created += 1

        self.logger.info(f"Created {created}/{self.num_papers} mock PDFs")
        self.stats['mock_files_created'] += created
        return created

    def _create_mock_markdowns(self):
        """Create mock markdown files"""
        md_dir = self.test_dir / 'analysis' / 'markdown_papers'
        md_dir.mkdir(parents=True, exist_ok=True)

        # Get PDF files
        pdf_dir = self.test_dir / 'analysis' / 'pdfs'
        pdfs = list(pdf_dir.glob('*.pdf')) if pdf_dir.exists() else []

        created = 0
        for pdf in pdfs:
            md_name = pdf.stem + '.md'
            md_path = md_dir / md_name

            content = f"""# {pdf.stem}

## Abstract
This is a mock paper testing the pipeline functionality.

## Introduction
Testing bias in AI systems requires comprehensive approaches...

## Methodology
We employ {"feminist" if random.random() > 0.5 else "intersectional"} frameworks...

## Results
Our findings indicate significant {"gender" if random.random() > 0.5 else "racial"} bias...

## Conclusion
Mitigation strategies include prompt engineering and {"debiasing" if random.random() > 0.5 else "fine-tuning"}...

## Keywords
AI bias, {"intersectionality" if random.random() > 0.5 else "fairness"}, {"prompt engineering" if random.random() > 0.5 else "machine learning"}
"""
            with open(md_path, 'w') as f:
                f.write(content)
            created += 1

        self.logger.info(f"Created {created} mock markdown files")
        self.stats['mock_files_created'] += created
        return created

    def _create_mock_summaries(self):
        """Create mock summary files"""
        summaries_dir = self.test_dir / 'analysis' / 'summaries_final'
        summaries_dir.mkdir(parents=True, exist_ok=True)

        # Get markdown files
        md_dir = self.test_dir / 'analysis' / 'markdown_papers'
        markdowns = list(md_dir.glob('*.md')) if md_dir.exists() else []

        created = 0
        for md in markdowns:
            summary_name = f'summary_{md.stem}.md'
            summary_path = summaries_dir / summary_name

            content = f"""---
title: "Summary of {md.stem}"
document_type: Research Paper
research_domain: AI Bias & Fairness
methodology: Empirical/Quantitative
keywords: bias, fairness, AI, mitigation
---

# Summary: {md.stem}

## Overview
This paper investigates bias in AI systems.

## Main Findings
- Significant bias detected in {"language models" if random.random() > 0.5 else "computer vision systems"}
- {"Gender" if random.random() > 0.5 else "Racial"} disparities observed

## Methodology
{"Quantitative analysis" if random.random() > 0.5 else "Qualitative study"} of AI outputs.

## Significance
Important contribution to understanding AI bias.
"""
            with open(summary_path, 'w') as f:
                f.write(content)
            created += 1

        self.logger.info(f"Created {created} mock summaries")
        self.stats['mock_files_created'] += created
        return created

    def _simulate_stage(self, stage_name: str, duration: float, success_rate: float = 0.95) -> bool:
        """
        Simulate a pipeline stage

        Args:
            stage_name: Name of the stage
            duration: Simulated duration in seconds
            success_rate: Probability of success

        Returns:
            Success status
        """
        print(f"\n{Colors.BOLD}Simulating: {stage_name}{Colors.ENDC}")
        print("-" * 40)

        # Progress bar simulation
        steps = 10
        for i in range(steps):
            time.sleep(duration / steps)
            progress = (i + 1) / steps * 100
            bar = "█" * (i + 1) + "░" * (steps - i - 1)
            print(f"\r[{bar}] {progress:.0f}%", end="", flush=True)

        print()  # New line after progress bar

        # Determine success
        if self.with_errors:
            success = random.random() < success_rate
        else:
            success = True

        if success:
            print(f"{Colors.OKGREEN}✓ {stage_name} completed{Colors.ENDC}")
            self.stats['stages_completed'] += 1
        else:
            print(f"{Colors.FAIL}✗ {stage_name} failed (simulated error){Colors.ENDC}")
            self.stats['stages_failed'] += 1

        return success

    def run_test(self) -> bool:
        """Run the complete test simulation"""
        self._print_header()

        try:
            # Cleanup previous test data
            if self.test_dir.exists():
                print(f"Cleaning up previous test data...")
                shutil.rmtree(self.test_dir)

            # Stage 1: Create mock data
            print(f"\n{Colors.BOLD}[Preparation] Creating Mock Data{Colors.ENDC}")
            print("-" * 40)

            self._create_mock_bibliography()
            print(f"✓ Created mock bibliography ({self.num_papers} papers)")

            pdf_count = self._create_mock_pdfs()
            print(f"✓ Created {pdf_count} mock PDFs")

            # Stage 2: Simulate PDF acquisition
            if not self._simulate_stage(
                "PDF Acquisition",
                duration=2 if self.mode == 'quick' else 5,
                success_rate=0.9
            ):
                if not self.with_errors:
                    return False

            # Stage 3: Simulate PDF conversion
            md_count = self._create_mock_markdowns()
            if not self._simulate_stage(
                "PDF to Markdown Conversion",
                duration=1 if self.mode == 'quick' else 3,
                success_rate=0.95
            ):
                if not self.with_errors:
                    return False

            # Stage 4: Simulate summarization
            summary_count = self._create_mock_summaries()
            if not self._simulate_stage(
                "Document Summarization",
                duration=3 if self.mode == 'quick' else 10,
                success_rate=0.85
            ):
                if not self.with_errors:
                    return False

            # Stage 5: Simulate vault generation
            if not self._simulate_stage(
                "Obsidian Vault Generation",
                duration=1,
                success_rate=0.95
            ):
                if not self.with_errors:
                    return False

            # Stage 6: Simulate quality testing
            if not self._simulate_stage(
                "Quality Testing",
                duration=0.5,
                success_rate=0.98
            ):
                if not self.with_errors:
                    return False

            # Calculate total duration
            self.stats['total_duration'] = (datetime.now() - self.start_time).total_seconds()

            # Print summary
            self._print_summary()
            return True

        except Exception as e:
            print(f"\n{Colors.FAIL}Test failed with exception: {e}{Colors.ENDC}")
            if self.verbose:
                traceback.print_exc()
            return False

    def _print_summary(self):
        """Print test summary"""
        print(f"\n{Colors.BOLD}{Colors.HEADER}Test Summary{Colors.ENDC}")
        print("="*60)

        print(f"Mode: {self.mode.upper()}")
        print(f"Papers processed: {self.num_papers}")
        print(f"Mock files created: {self.stats['mock_files_created']}")
        print(f"Stages completed: {self.stats['stages_completed']}")
        print(f"Stages failed: {self.stats['stages_failed']}")
        print(f"Total duration: {self.stats['total_duration']:.1f} seconds")

        if self.stats['stages_failed'] == 0:
            print(f"\n{Colors.OKGREEN}✓ All tests passed successfully!{Colors.ENDC}")
        else:
            print(f"\n{Colors.WARNING}⚠ {self.stats['stages_failed']} stages failed (error injection enabled){Colors.ENDC}")

        print("\nTest artifacts location:")
        print(f"  {self.test_dir}/")
        print("="*60)

    def benchmark(self) -> Dict:
        """Run performance benchmark"""
        print(f"\n{Colors.BOLD}Running Performance Benchmark{Colors.ENDC}")
        print("-" * 40)

        benchmarks = {}

        # Test file creation speed
        start = time.time()
        self._create_mock_bibliography()
        benchmarks['bibliography_creation'] = time.time() - start

        start = time.time()
        self._create_mock_pdfs()
        benchmarks['pdf_creation'] = time.time() - start

        start = time.time()
        self._create_mock_markdowns()
        benchmarks['markdown_creation'] = time.time() - start

        # Print results
        print("\nBenchmark Results:")
        for key, duration in benchmarks.items():
            print(f"  {key}: {duration:.3f}s")

        return benchmarks

    def cleanup(self):
        """Clean up test data"""
        if self.test_dir.exists():
            print(f"\nCleaning up test data: {self.test_dir}")
            shutil.rmtree(self.test_dir)
            print("✓ Test data cleaned up")


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(
        description='Test Simulator for FemPrompt Research Pipeline',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Modes:
  quick       - Quick test with 5 mock papers (~10 seconds)
  full        - Full test with 30 mock papers (~30 seconds)
  benchmark   - Performance benchmark

Examples:
  python test_pipeline.py               # Quick test
  python test_pipeline.py --full        # Full test
  python test_pipeline.py --with-errors # Test error handling
  python test_pipeline.py --benchmark   # Run performance tests
        """
    )

    parser.add_argument('--quick', action='store_true', default=True,
                       help='Quick test mode (5 papers)')
    parser.add_argument('--full', action='store_true',
                       help='Full test mode (30 papers)')
    parser.add_argument('--with-errors', action='store_true',
                       help='Inject random errors for testing')
    parser.add_argument('--benchmark', action='store_true',
                       help='Run performance benchmark')
    parser.add_argument('--cleanup', action='store_true',
                       help='Clean up test data and exit')
    parser.add_argument('--verbose', '-v', action='store_true',
                       help='Enable verbose output')

    args = parser.parse_args()

    # Determine mode
    if args.full:
        mode = 'full'
    elif args.benchmark:
        mode = 'benchmark'
    else:
        mode = 'quick'

    # Initialize simulator
    simulator = PipelineTestSimulator(
        mode='full' if args.full else 'quick',
        with_errors=args.with_errors,
        verbose=args.verbose
    )

    try:
        # Handle cleanup
        if args.cleanup:
            simulator.cleanup()
            return

        # Run appropriate test
        if args.benchmark:
            simulator.benchmark()
        else:
            success = simulator.run_test()
            sys.exit(0 if success else 1)

    except KeyboardInterrupt:
        print(f"\n{Colors.WARNING}Test interrupted by user{Colors.ENDC}")
        sys.exit(130)
    except Exception as e:
        print(f"\n{Colors.FAIL}Test failed: {e}{Colors.ENDC}")
        if args.verbose:
            traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()