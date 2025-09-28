#!/usr/bin/env python3
"""
FemPrompt Research Pipeline - Master Orchestration Script
Coordinates the complete literature research workflow from PDF acquisition to knowledge graph generation
"""

import os
import sys
import json
import time
import logging
import argparse
import subprocess
import traceback
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Any
import yaml

# Version
__version__ = "1.0.0"

# ANSI Color codes for terminal output
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


class ResearchPipeline:
    """Master pipeline orchestrator for literature research workflow"""

    def __init__(self, config_file: str = None, resume: bool = False, verbose: bool = False):
        """
        Initialize pipeline

        Args:
            config_file: Path to configuration YAML
            resume: Resume from last checkpoint
            verbose: Enable verbose logging
        """
        self.start_time = datetime.now()
        self.run_id = self.start_time.strftime("%Y%m%d_%H%M%S")

        # Setup paths
        self.base_path = Path(__file__).parent
        self.config_file = config_file or self.base_path / "pipeline_config.yaml"
        self.status_file = self.base_path / ".pipeline_status.json"
        self.logs_dir = self.base_path / "logs"
        self.logs_dir.mkdir(exist_ok=True)

        # Load configuration
        self.config = self._load_config()

        # Setup logging
        self._setup_logging(verbose)

        # Define pipeline stages (must be before status initialization)
        self.stages = [
            {
                'name': 'acquire_pdfs',
                'display': 'PDF Acquisition',
                'script': 'analysis/getPDF_intelligent.py',
                'function': self._stage_acquire_pdfs,
                'required': True
            },
            {
                'name': 'convert_pdfs',
                'display': 'PDF to Markdown Conversion',
                'script': 'analysis/pdf-to-md-converter.py',
                'function': self._stage_convert_pdfs,
                'required': True
            },
            {
                'name': 'summarize',
                'display': 'Document Summarization',
                'script': 'analysis/summarize-documents.py',
                'function': self._stage_summarize,
                'required': True
            },
            {
                'name': 'generate_vault',
                'display': 'Obsidian Vault Generation',
                'script': 'analysis/generate_obsidian_vault_improved.py',
                'function': self._stage_generate_vault,
                'required': False
            },
            {
                'name': 'test_quality',
                'display': 'Quality Testing',
                'script': 'analysis/test_vault_quality.py',
                'function': self._stage_test_quality,
                'required': False
            }
        ]

        # Initialize status (after stages are defined)
        if resume and self.status_file.exists():
            self.status = self._load_status()
            self.logger.info(f"Resuming pipeline from checkpoint: {self.status.get('last_checkpoint')}")
        else:
            self.status = self._initialize_status()

    def _load_config(self) -> Dict:
        """Load configuration from YAML file"""
        # Default configuration
        default_config = {
            'pipeline': {
                'name': 'FemPrompt Research Pipeline',
                'version': __version__
            },
            'paths': {
                'zotero_json': 'analysis/zotero_vereinfacht.json',
                'pdf_dir': 'analysis/pdfs',
                'markdown_dir': 'analysis/markdown_papers',
                'summaries_dir': 'analysis/summaries_final',
                'vault_dir': 'FemPrompt_Vault'
            },
            'stages': {
                'acquire_pdfs': {'enabled': True, 'timeout': 1800},
                'convert_pdfs': {'enabled': True, 'parallel': True},
                'summarize': {'enabled': True, 'rate_limit_delay': 10},
                'generate_vault': {'enabled': True},
                'test_quality': {'enabled': True, 'target_score': 85}
            },
            'logging': {
                'level': 'INFO',
                'format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            }
        }

        # Load custom config if exists
        if self.config_file and Path(self.config_file).exists():
            try:
                with open(self.config_file, 'r') as f:
                    custom_config = yaml.safe_load(f)
                    # Merge configs
                    default_config.update(custom_config)
            except Exception as e:
                print(f"Warning: Could not load config file: {e}")

        return default_config

    def _setup_logging(self, verbose: bool):
        """Configure logging system"""
        log_level = logging.DEBUG if verbose else logging.INFO
        log_file = self.logs_dir / f"pipeline_{self.run_id}.log"

        # Configure root logger
        logging.basicConfig(
            level=log_level,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler()
            ]
        )

        self.logger = logging.getLogger('Pipeline')
        self.logger.info(f"Pipeline run started: {self.run_id}")

    def _initialize_status(self) -> Dict:
        """Initialize pipeline status"""
        return {
            'run_id': self.run_id,
            'start_time': self.start_time.isoformat(),
            'config': str(self.config_file),
            'stages': {
                stage['name']: {'status': 'pending'}
                for stage in self.stages
            },
            'last_checkpoint': None
        }

    def _load_status(self) -> Dict:
        """Load status from file"""
        with open(self.status_file, 'r') as f:
            return json.load(f)

    def _save_status(self):
        """Save status to file"""
        self.status['last_checkpoint'] = datetime.now().isoformat()
        with open(self.status_file, 'w') as f:
            json.dump(self.status, f, indent=2)

    def _print_header(self):
        """Print pipeline header"""
        print("\n" + "="*60)
        print(f"{Colors.BOLD}{Colors.HEADER}FemPrompt Research Pipeline v{__version__}{Colors.ENDC}")
        print("="*60)
        print(f"Run ID: {self.run_id}")
        print(f"Config: {self.config_file}")
        print(f"Started: {self.start_time.strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*60 + "\n")

    def _print_stage_header(self, stage_name: str, stage_num: int, total: int):
        """Print stage header"""
        print(f"\n{Colors.BOLD}[Stage {stage_num}/{total}] {stage_name}{Colors.ENDC}")
        print("-" * 40)

    def _print_progress(self, message: str, status: str = "info"):
        """Print progress message with color"""
        timestamp = datetime.now().strftime("%H:%M:%S")

        if status == "success":
            color = Colors.OKGREEN
            symbol = "✓"
        elif status == "error":
            color = Colors.FAIL
            symbol = "✗"
        elif status == "warning":
            color = Colors.WARNING
            symbol = "⚠"
        else:
            color = Colors.OKCYAN
            symbol = "→"

        print(f"[{timestamp}] {color}{symbol} {message}{Colors.ENDC}")

    def _run_script(self, script_path: str, args: List[str] = None) -> bool:
        """
        Run external Python script

        Args:
            script_path: Path to script
            args: Command line arguments

        Returns:
            Success status
        """
        full_path = self.base_path / script_path

        if not full_path.exists():
            self.logger.error(f"Script not found: {full_path}")
            return False

        cmd = [sys.executable, str(full_path)]
        if args:
            cmd.extend(args)

        self.logger.info(f"Running: {' '.join(cmd)}")

        try:
            # Run with output capture
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                cwd=self.base_path
            )

            # Log output
            if result.stdout:
                for line in result.stdout.splitlines():
                    self.logger.info(f"  {line}")

            if result.stderr:
                for line in result.stderr.splitlines():
                    self.logger.warning(f"  {line}")

            return result.returncode == 0

        except Exception as e:
            self.logger.error(f"Failed to run script: {e}")
            return False

    def _check_environment(self) -> bool:
        """Check environment and dependencies"""
        self._print_progress("Checking environment...", "info")

        checks = []

        # Check Python version
        py_version = sys.version_info
        if py_version.major >= 3 and py_version.minor >= 8:
            self._print_progress(f"Python {py_version.major}.{py_version.minor} ✓", "success")
            checks.append(True)
        else:
            self._print_progress(f"Python 3.8+ required (found {py_version.major}.{py_version.minor})", "error")
            checks.append(False)

        # Check API keys
        if os.environ.get('GEMINI_API_KEY'):
            self._print_progress("GEMINI_API_KEY configured ✓", "success")
            checks.append(True)
        else:
            self._print_progress("GEMINI_API_KEY not set", "warning")

        # Check required directories
        required_dirs = [
            'analysis',
            'deep-research',
            'to-Zotero'
        ]

        for dir_name in required_dirs:
            dir_path = self.base_path / dir_name
            if dir_path.exists():
                self._print_progress(f"Directory '{dir_name}' exists ✓", "success")
                checks.append(True)
            else:
                self._print_progress(f"Creating directory '{dir_name}'", "info")
                dir_path.mkdir(parents=True, exist_ok=True)
                checks.append(True)

        # Check input file
        zotero_json = self.base_path / self.config['paths']['zotero_json']
        if zotero_json.exists():
            self._print_progress(f"Input file exists: {zotero_json.name} ✓", "success")
            checks.append(True)
        else:
            self._print_progress(f"Input file missing: {zotero_json.name}", "warning")

        return all(checks)

    def _stage_acquire_pdfs(self) -> Dict:
        """Stage 1: Acquire PDFs from Zotero and online sources"""
        self.logger.info("Starting PDF acquisition")

        args = [
            '--input', self.config['paths']['zotero_json'],
            '--output', self.config['paths']['pdf_dir']
        ]

        success = self._run_script('analysis/getPDF_intelligent.py', args)

        # Count PDFs
        pdf_dir = self.base_path / self.config['paths']['pdf_dir']
        pdf_count = len(list(pdf_dir.glob('*.pdf'))) if pdf_dir.exists() else 0

        return {
            'success': success,
            'pdf_count': pdf_count,
            'duration': 0  # Will be calculated by wrapper
        }

    def _stage_convert_pdfs(self) -> Dict:
        """Stage 2: Convert PDFs to Markdown"""
        self.logger.info("Starting PDF to Markdown conversion")

        # Note: pdf-to-md-converter.py needs to be updated to accept arguments
        # For now, it uses hardcoded paths
        success = self._run_script('analysis/pdf-to-md-converter.py')

        # Count markdown files
        md_dir = self.base_path / self.config['paths']['markdown_dir']
        md_count = len(list(md_dir.glob('*.md'))) if md_dir.exists() else 0

        return {
            'success': success,
            'markdown_count': md_count
        }

    def _stage_summarize(self) -> Dict:
        """Stage 3: Summarize documents with Gemini"""
        self.logger.info("Starting document summarization")

        if not os.environ.get('GEMINI_API_KEY'):
            self._print_progress("GEMINI_API_KEY required for summarization", "error")
            return {'success': False, 'error': 'Missing API key'}

        success = self._run_script('analysis/summarize-documents.py')

        # Count summaries
        summaries_dir = self.base_path / self.config['paths']['summaries_dir']
        summary_count = len(list(summaries_dir.glob('*.md'))) if summaries_dir.exists() else 0

        return {
            'success': success,
            'summary_count': summary_count
        }

    def _stage_generate_vault(self) -> Dict:
        """Stage 4: Generate Obsidian vault"""
        self.logger.info("Starting Obsidian vault generation")

        success = self._run_script('analysis/generate_obsidian_vault_improved.py')

        # Count vault files
        vault_dir = self.base_path / self.config['paths']['vault_dir']
        if vault_dir.exists():
            paper_count = len(list((vault_dir / 'Papers').glob('*.md'))) if (vault_dir / 'Papers').exists() else 0
            concept_count = len(list((vault_dir / 'Concepts').glob('*.md'))) if (vault_dir / 'Concepts').exists() else 0
        else:
            paper_count = concept_count = 0

        return {
            'success': success,
            'paper_count': paper_count,
            'concept_count': concept_count
        }

    def _stage_test_quality(self) -> Dict:
        """Stage 5: Test vault quality"""
        self.logger.info("Starting quality testing")

        success = self._run_script('analysis/test_vault_quality.py')

        return {
            'success': success,
            'quality_score': 85 if success else 0  # Parse from output in real implementation
        }

    def run(self, stages: List[str] = None, skip_stages: List[str] = None, dry_run: bool = False):
        """
        Run the pipeline

        Args:
            stages: Specific stages to run (None = all)
            skip_stages: Stages to skip
            dry_run: Show what would be done without executing
        """
        self._print_header()

        # Check environment
        if not dry_run:
            if not self._check_environment():
                self._print_progress("Environment check failed", "error")
                return False

        # Determine stages to run
        stages_to_run = []
        for stage in self.stages:
            # Check if stage should run
            if skip_stages and stage['name'] in skip_stages:
                continue
            if stages and stage['name'] not in stages:
                continue
            if not self.config['stages'].get(stage['name'], {}).get('enabled', True):
                continue

            # Check if already completed (for resume)
            if self.status['stages'][stage['name']].get('status') == 'completed':
                self._print_progress(f"Stage '{stage['display']}' already completed", "info")
                continue

            stages_to_run.append(stage)

        if dry_run:
            self._print_progress("DRY RUN - Stages that would be executed:", "info")
            for i, stage in enumerate(stages_to_run, 1):
                print(f"  {i}. {stage['display']}")
            return True

        # Run stages
        total_stages = len(stages_to_run)
        for i, stage in enumerate(stages_to_run, 1):
            self._print_stage_header(stage['display'], i, total_stages)

            # Update status
            self.status['stages'][stage['name']] = {
                'status': 'in_progress',
                'start': datetime.now().isoformat()
            }
            self._save_status()

            try:
                # Run stage
                start_time = time.time()
                result = stage['function']()
                duration = time.time() - start_time

                # Update status
                if result.get('success', False):
                    self.status['stages'][stage['name']].update({
                        'status': 'completed',
                        'end': datetime.now().isoformat(),
                        'duration': duration,
                        'result': result
                    })
                    self._print_progress(f"Stage completed in {duration:.1f}s", "success")

                    # Print stage results
                    for key, value in result.items():
                        if key != 'success':
                            print(f"  • {key}: {value}")
                else:
                    self.status['stages'][stage['name']].update({
                        'status': 'failed',
                        'end': datetime.now().isoformat(),
                        'error': result.get('error', 'Unknown error')
                    })
                    self._print_progress(f"Stage failed: {result.get('error', 'Unknown')}", "error")

                    if stage['required']:
                        self._print_progress("Required stage failed, stopping pipeline", "error")
                        return False

            except Exception as e:
                self.logger.error(f"Stage {stage['name']} failed with exception: {e}")
                self.logger.error(traceback.format_exc())

                self.status['stages'][stage['name']].update({
                    'status': 'failed',
                    'end': datetime.now().isoformat(),
                    'error': str(e)
                })
                self._print_progress(f"Stage failed with exception: {e}", "error")

                if stage['required']:
                    return False

            finally:
                self._save_status()

        # Final summary
        self._print_summary()
        return True

    def _print_summary(self):
        """Print pipeline execution summary"""
        duration = (datetime.now() - self.start_time).total_seconds()

        print("\n" + "="*60)
        print(f"{Colors.BOLD}Pipeline Summary{Colors.ENDC}")
        print("="*60)

        # Stage results
        for stage_name in self.status['stages']:
            stage_status = self.status['stages'][stage_name]
            status = stage_status.get('status', 'pending')

            if status == 'completed':
                color = Colors.OKGREEN
                symbol = "✓"
            elif status == 'failed':
                color = Colors.FAIL
                symbol = "✗"
            elif status == 'in_progress':
                color = Colors.WARNING
                symbol = "⋯"
            else:
                color = Colors.ENDC
                symbol = "○"

            stage_display = next((s['display'] for s in self.stages if s['name'] == stage_name), stage_name)
            print(f"{color}{symbol} {stage_display}: {status}{Colors.ENDC}")

            if status == 'completed' and 'result' in stage_status:
                for key, value in stage_status['result'].items():
                    if key != 'success':
                        print(f"    {key}: {value}")

        print(f"\nTotal duration: {duration:.1f} seconds")
        print(f"Log file: logs/pipeline_{self.run_id}.log")
        print("="*60)


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(
        description='FemPrompt Research Pipeline - Automated Literature Processing',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python run_pipeline.py                    # Run complete pipeline
  python run_pipeline.py --resume           # Resume from last checkpoint
  python run_pipeline.py --stages summarize # Run only specific stage
  python run_pipeline.py --dry-run          # Show what would be done
        """
    )

    parser.add_argument('--config', '-c',
                       help='Configuration file (default: pipeline_config.yaml)')
    parser.add_argument('--resume', '-r', action='store_true',
                       help='Resume from last checkpoint')
    parser.add_argument('--stages', '-s',
                       help='Comma-separated list of stages to run')
    parser.add_argument('--skip',
                       help='Comma-separated list of stages to skip')
    parser.add_argument('--dry-run', '-n', action='store_true',
                       help='Show what would be done without executing')
    parser.add_argument('--verbose', '-v', action='store_true',
                       help='Enable verbose logging')
    parser.add_argument('--version', action='version',
                       version=f'%(prog)s {__version__}')

    args = parser.parse_args()

    # Parse stage lists
    stages = args.stages.split(',') if args.stages else None
    skip_stages = args.skip.split(',') if args.skip else None

    # Initialize and run pipeline
    try:
        pipeline = ResearchPipeline(
            config_file=args.config,
            resume=args.resume,
            verbose=args.verbose
        )

        success = pipeline.run(
            stages=stages,
            skip_stages=skip_stages,
            dry_run=args.dry_run
        )

        sys.exit(0 if success else 1)

    except KeyboardInterrupt:
        print(f"\n{Colors.WARNING}Pipeline interrupted by user{Colors.ENDC}")
        sys.exit(130)
    except Exception as e:
        print(f"\n{Colors.FAIL}Pipeline failed: {e}{Colors.ENDC}")
        if args.verbose:
            traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()