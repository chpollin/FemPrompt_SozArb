#!/usr/bin/env python3
"""
Pipeline Stage Validator - checks data consistency between pipeline stages.

Validates that outputs from each stage are valid inputs for the next stage.
Does NOT re-run any pipeline steps; only checks file existence, structure,
and cross-stage consistency.

Stages checked:
  1. Corpus (zotero_export.json) -> PDFs
  2. PDFs -> Markdown
  3. Markdown -> Markdown Clean
  4. Markdown Clean -> Knowledge Docs
  5. Knowledge Docs -> Assessment

Usage:
    python validate_pipeline.py
    python validate_pipeline.py --stage 4    # Only check stage 4
    python validate_pipeline.py --fix        # Show fix suggestions
"""

import json
import re
import sys
import argparse
from pathlib import Path
from collections import defaultdict

# Fix encoding for Windows console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')


def get_project_root() -> Path:
    """Get project root (two levels up from pipeline/scripts/)."""
    return Path(__file__).parent.parent.parent


class PipelineValidator:
    def __init__(self, project_root: Path):
        self.root = project_root
        self.errors = []
        self.warnings = []
        self.stats = {}

    def error(self, stage: int, msg: str):
        self.errors.append(f"[Stage {stage}] ERROR: {msg}")

    def warn(self, stage: int, msg: str):
        self.warnings.append(f"[Stage {stage}] WARN: {msg}")

    def stat(self, key: str, value):
        self.stats[key] = value

    # ------------------------------------------------------------------
    # Stage 1: Corpus -> PDFs
    # ------------------------------------------------------------------
    def validate_stage1(self):
        """Check that Zotero export exists and PDFs match corpus entries."""
        zotero_path = self.root / "corpus" / "zotero_export.json"
        pdf_dir = self.root / "pipeline" / "pdfs"

        if not zotero_path.exists():
            self.error(1, f"Zotero export not found: {zotero_path}")
            return

        with open(zotero_path, "r", encoding="utf-8") as f:
            corpus = json.load(f)

        corpus_count = len(corpus)
        self.stat("corpus_papers", corpus_count)

        # Check corpus entries have required fields
        missing_title = sum(1 for item in corpus if not item.get("title"))
        missing_key = sum(1 for item in corpus if not item.get("key"))
        if missing_title > 0:
            self.error(1, f"{missing_title} corpus entries without title")
        if missing_key > 0:
            self.error(1, f"{missing_key} corpus entries without Zotero key")

        # Check PDFs
        if not pdf_dir.exists():
            self.error(1, f"PDF directory not found: {pdf_dir}")
            return

        pdfs = list(pdf_dir.glob("*.pdf"))
        self.stat("pdfs", len(pdfs))

        if len(pdfs) == 0:
            self.error(1, "No PDFs found in pipeline/pdfs/")
        elif len(pdfs) < corpus_count * 0.5:
            self.warn(1, f"Only {len(pdfs)}/{corpus_count} PDFs ({len(pdfs)/corpus_count*100:.0f}%) - expected at least 50%")

        # Check metadata CSV
        metadata_path = self.root / "corpus" / "papers_metadata.csv"
        if not metadata_path.exists():
            self.warn(1, "papers_metadata.csv not found - run extract_metadata.py")
        else:
            import csv
            with open(metadata_path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                rows = list(reader)
            self.stat("metadata_rows", len(rows))
            if len(rows) != corpus_count:
                self.warn(1, f"Metadata CSV has {len(rows)} rows but corpus has {corpus_count} entries")

            # Check Source_Tool population
            with_source = sum(1 for r in rows if r.get("Source_Tool", "").strip())
            self.stat("with_source_tool", with_source)

    # ------------------------------------------------------------------
    # Stage 2: PDFs -> Markdown
    # ------------------------------------------------------------------
    def validate_stage2(self):
        """Check that Markdown files exist for PDFs."""
        pdf_dir = self.root / "pipeline" / "pdfs"
        md_dir = self.root / "pipeline" / "markdown"

        if not md_dir.exists():
            self.error(2, f"Markdown directory not found: {md_dir}")
            return

        pdfs = {p.stem for p in pdf_dir.glob("*.pdf")} if pdf_dir.exists() else set()
        mds = {m.stem for m in md_dir.glob("*.md")}
        self.stat("markdown_files", len(mds))

        # PDFs without markdown
        missing = pdfs - mds
        if missing:
            self.warn(2, f"{len(missing)} PDFs without markdown conversion")

        # Check for empty markdown files
        empty = 0
        for md in md_dir.glob("*.md"):
            if md.stat().st_size < 100:
                empty += 1
        if empty:
            self.warn(2, f"{empty} markdown files are suspiciously small (<100 bytes)")

    # ------------------------------------------------------------------
    # Stage 3: Markdown -> Markdown Clean
    # ------------------------------------------------------------------
    def validate_stage3(self):
        """Check that clean markdown files exist and are valid."""
        md_dir = self.root / "pipeline" / "markdown"
        clean_dir = self.root / "pipeline" / "markdown_clean"

        if not clean_dir.exists():
            self.warn(3, f"Clean markdown directory not found: {clean_dir}")
            return

        mds = {m.stem for m in md_dir.glob("*.md")} if md_dir.exists() else set()
        cleans = {c.stem for c in clean_dir.glob("*.md")}
        self.stat("markdown_clean_files", len(cleans))

        # Markdown without clean version
        not_cleaned = mds - cleans
        if not_cleaned and len(not_cleaned) > len(mds) * 0.2:
            self.warn(3, f"{len(not_cleaned)}/{len(mds)} markdown files not cleaned ({len(not_cleaned)/len(mds)*100:.0f}%)")

    # ------------------------------------------------------------------
    # Stage 4: Markdown Clean -> Knowledge Docs
    # ------------------------------------------------------------------
    def validate_stage4(self):
        """Check knowledge docs structure and consistency."""
        clean_dir = self.root / "pipeline" / "markdown_clean"
        knowledge_dir = self.root / "pipeline" / "knowledge" / "distilled"

        if not knowledge_dir.exists():
            self.error(4, f"Knowledge directory not found: {knowledge_dir}")
            return

        knowledge_docs = list(knowledge_dir.glob("*.md"))
        self.stat("knowledge_docs", len(knowledge_docs))

        if len(knowledge_docs) == 0:
            self.error(4, "No knowledge documents found")
            return

        # Validate structure of each knowledge doc
        valid = 0
        invalid_yaml = 0
        missing_sections = 0
        required_sections = ["Kernbefund", "Forschungsfrage", "Methodik"]

        for doc in knowledge_docs:
            content = doc.read_text(encoding="utf-8", errors="replace")

            # Check YAML frontmatter
            if not content.startswith("---"):
                invalid_yaml += 1
                continue

            parts = content.split("---", 2)
            if len(parts) < 3:
                invalid_yaml += 1
                continue

            # Check required frontmatter fields
            frontmatter = parts[1]
            required_fields = ["title", "authors", "year", "categories"]
            for field in required_fields:
                if f"{field}:" not in frontmatter:
                    self.warn(4, f"{doc.name}: missing frontmatter field '{field}'")

            # Check required sections
            body = parts[2]
            for section in required_sections:
                if f"## {section}" not in body:
                    missing_sections += 1
                    break
            else:
                valid += 1

        self.stat("knowledge_valid", valid)

        if invalid_yaml > 0:
            self.error(4, f"{invalid_yaml} knowledge docs with invalid YAML frontmatter")
        if missing_sections > 0:
            self.warn(4, f"{missing_sections} knowledge docs missing required sections")

        # Cross-check: knowledge docs should have corresponding markdown_clean
        if clean_dir.exists():
            clean_stems = {c.stem for c in clean_dir.glob("*.md")}
            knowledge_stems = {k.stem for k in knowledge_docs}
            orphan_knowledge = knowledge_stems - clean_stems
            if orphan_knowledge and len(orphan_knowledge) > 5:
                self.warn(4, f"{len(orphan_knowledge)} knowledge docs without corresponding markdown_clean")

    # ------------------------------------------------------------------
    # Stage 5: Knowledge Docs -> Assessment
    # ------------------------------------------------------------------
    def validate_stage5(self):
        """Check that assessment data is consistent with corpus."""
        knowledge_dir = self.root / "pipeline" / "knowledge" / "distilled"
        assessment_5d = self.root / "assessment-llm" / "output"
        benchmark_data = self.root / "benchmark" / "data"

        # Check 5D assessment
        if assessment_5d.exists():
            xlsx_files = list(assessment_5d.glob("*.xlsx"))
            if xlsx_files:
                self.stat("assessment_5d_files", len(xlsx_files))
            else:
                self.warn(5, "No 5D assessment output files found")
        else:
            self.warn(5, "assessment-llm/output/ directory not found")

        # Check benchmark data
        if benchmark_data.exists():
            csv_files = list(benchmark_data.glob("*.csv"))
            self.stat("benchmark_csv_files", len(csv_files))

            # Check human assessment
            human = benchmark_data / "human_assessment.csv"
            if human.exists():
                import csv
                with open(human, "r", encoding="utf-8") as f:
                    reader = csv.DictReader(f)
                    rows = list(reader)
                self.stat("human_assessment_rows", len(rows))
            else:
                self.warn(5, "No human_assessment.csv in benchmark/data/")
        else:
            self.warn(5, "benchmark/data/ directory not found")

        # Check categories config consistency
        categories_path = self.root / "benchmark" / "config" / "categories.yaml"
        if categories_path.exists():
            try:
                import yaml
                with open(categories_path, "r", encoding="utf-8") as f:
                    cats = yaml.safe_load(f)
                cat_names = [c["name"] for c in cats.get("categories", [])]
                self.stat("benchmark_categories", len(cat_names))

                expected = ["AI_Literacies", "Generative_KI", "Prompting", "KI_Sonstige",
                            "Soziale_Arbeit", "Bias_Ungleichheit", "Gender", "Diversitaet",
                            "Feministisch", "Fairness"]
                if cat_names != expected:
                    self.error(5, f"Categories mismatch: got {cat_names}, expected {expected}")
            except ImportError:
                self.warn(5, "PyYAML not installed - cannot validate categories.yaml")

    # ------------------------------------------------------------------
    # Report
    # ------------------------------------------------------------------
    def run(self, stages=None):
        """Run all or selected validation stages."""
        all_stages = {
            1: ("Corpus -> PDFs", self.validate_stage1),
            2: ("PDFs -> Markdown", self.validate_stage2),
            3: ("Markdown -> Markdown Clean", self.validate_stage3),
            4: ("Markdown Clean -> Knowledge Docs", self.validate_stage4),
            5: ("Knowledge Docs -> Assessment", self.validate_stage5),
        }

        if stages is None:
            stages = list(all_stages.keys())

        print("=" * 60)
        print("PIPELINE VALIDATION REPORT")
        print("=" * 60)

        for stage_num in stages:
            name, func = all_stages[stage_num]
            print(f"\n--- Stage {stage_num}: {name} ---")
            func()

        # Print stats
        print("\n" + "=" * 60)
        print("STATISTICS")
        print("=" * 60)
        for key, value in self.stats.items():
            print(f"  {key}: {value}")

        # Print data flow
        print("\n" + "=" * 60)
        print("DATA FLOW")
        print("=" * 60)
        flow_keys = ["corpus_papers", "pdfs", "markdown_files", "markdown_clean_files",
                      "knowledge_docs", "knowledge_valid"]
        flow = []
        for key in flow_keys:
            if key in self.stats:
                label = key.replace("_", " ").title()
                flow.append(f"{label}: {self.stats[key]}")
        print("  " + " -> ".join(flow))

        # Print warnings
        if self.warnings:
            print("\n" + "=" * 60)
            print(f"WARNINGS ({len(self.warnings)})")
            print("=" * 60)
            for w in self.warnings:
                print(f"  {w}")

        # Print errors
        if self.errors:
            print("\n" + "=" * 60)
            print(f"ERRORS ({len(self.errors)})")
            print("=" * 60)
            for e in self.errors:
                print(f"  {e}")

        # Summary
        print("\n" + "=" * 60)
        if self.errors:
            print(f"RESULT: FAIL ({len(self.errors)} errors, {len(self.warnings)} warnings)")
        elif self.warnings:
            print(f"RESULT: PASS with warnings ({len(self.warnings)} warnings)")
        else:
            print("RESULT: PASS (all checks passed)")
        print("=" * 60)

        return len(self.errors) == 0


def main():
    parser = argparse.ArgumentParser(description="Validate pipeline data consistency")
    parser.add_argument("--stage", "-s", type=int, choices=[1, 2, 3, 4, 5],
                        help="Only validate specific stage")
    args = parser.parse_args()

    root = get_project_root()
    validator = PipelineValidator(root)

    stages = [args.stage] if args.stage else None
    success = validator.run(stages)

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
