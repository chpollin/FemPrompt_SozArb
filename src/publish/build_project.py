"""One offline build for canonical data, review preparation and the result site.

No API calls, new literature searches, Zotero writes or AI-review decisions occur
here. The final manifest detects changes in inputs and generated outputs.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
import subprocess
import sys
from typing import Any

from src.file_hashing import file_sha256

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = "generated/build-manifest.json"
OUTPUTS = (
    "corpus/work_version_registry.json", "docs/data/category_schema.json",
    "docs/data/analysis_fields.json", "docs/data/research_vault_v2.json",
    "docs/data/promptotyping_v2.json", "docs/data/fulltext_index.json",
    "docs/data/fulltext_manifest.json", "docs/data/literature_landscape.json",
    "docs/data/assertion_index.json", "generated/agent-screening-queue.json",
    "generated/source-acquisition/codex-websearch-2026/source-readiness.json",
    "docs/downloads/vault.zip",
)
OUTPUT_DIRS = ("docs/data/fulltext", "generated/completion", "build/site")
INPUT_GLOBS = (
    "src/**/*.py", "config/*.json", "assessment/*.csv", "assessment/*.yaml",
    "corpus/**/*.json", "corpus/**/*.ris", "corpus/**/*.md", "corpus/**/*.txt", "corpus/**/*.png", "corpus/papers_metadata.csv",
    "generated/markdown/*.md", "generated/markdown_clean/*.md",
    "generated/distilled/**/*.json", "generated/distilled/**/*.md",
    "generated/source-acquisition/**/*.json", "generated/source-acquisition/**/*.md",
    "generated/source-acquisition/**/*.csv", "generated/source-acquisition/**/*.png",
    "generated/verification/*.json", "generated/benchmark-results/agreement_metrics.json",
    "generated/benchmark-results/disagreements.csv", "generated/conformance/conformance_map.yaml",
    "generated/round2-intake.json", "generated/round2-agent-review/*.json",
    "research-vault/10_distillates/**/*.md", "research-vault/20_claims/**/*.md",
    "research-vault/20_distillates/**/*.md", "research-vault/30_assertions/**/*.md",
    "research-vault/40_output/**/*.md", "research-vault/references/*.json",
    "tests/review-cases/agent-runs/**/*.json", "docs/data/screening/*.json",
    "docs/data/knowledge_doc_bindings.json", "docs/data/*contract.json",
    "docs/data/concept_graph.json", "docs/vault/Papers/*.md",
    "docs/*.html", "docs/js/*.js", "docs/css/*.css", "docs/vendor/**/*",
    "knowledge/project.md", ".gitattributes", ".gitignore", ".github/workflows/*.yml",
    ".github/workflows/*.yaml",
    "package.json", "package-lock.json", "requirements-build.txt",
)
LOCAL_INPUT_PATHS = {"docs/js/config.local.js"}
LOCAL_INPUT_PREFIXES = ("generated/distilled/_evidence_audit/",)


def file_hash(path: Path) -> str:
    return file_sha256(path)


def snapshot(repo: Path) -> dict[str, Any]:
    outputs = {repo / name for name in OUTPUTS}
    for name in OUTPUT_DIRS:
        outputs.update(p for p in (repo / name).rglob("*") if p.is_file())
    missing = sorted(p.relative_to(repo).as_posix() for p in outputs if not p.is_file())
    if missing:
        raise ValueError("Missing build outputs: " + ", ".join(missing))
    inputs = {p for pattern in INPUT_GLOBS for p in repo.glob(pattern)
              if p.is_file() and p.relative_to(repo).as_posix() not in LOCAL_INPUT_PATHS
              and not p.relative_to(repo).as_posix().startswith(LOCAL_INPUT_PREFIXES)} - outputs
    return {
        "schema": "femprompt-project-build/0.1",
        "inputs": {p.relative_to(repo).as_posix(): file_hash(p) for p in sorted(inputs, key=lambda item: item.relative_to(repo).as_posix())},
        "outputs": {p.relative_to(repo).as_posix(): file_hash(p) for p in sorted(outputs, key=lambda item: item.relative_to(repo).as_posix())},
        "authority": "Deterministic generation only; AI source review and human verification are separate recorded activities.",
    }


def check_build(repo: Path = ROOT) -> None:
    path = repo / MANIFEST
    if not path.is_file():
        raise ValueError("No build manifest. Run python -m src.publish.build_project first.")
    stored = json.loads(path.read_text(encoding="utf-8"))
    current = snapshot(repo)
    if stored.get("schema") != current["schema"]:
        raise ValueError("Unsupported build manifest")
    stale = []
    for group in ("inputs", "outputs"):
        old, new = stored[group], current[group]
        stale += [f"{group}: {name}" for name in sorted(set(old) | set(new)) if old.get(name) != new.get(name)]
    if stale:
        raise ValueError("Build is stale; run npm run build:\n" + "\n".join(stale[:30]))
    from src.assess.artifact_verification import load_reviews
    load_reviews(repo)
    print("OK: canonical inputs, generated data, review preparation and result site are current")


def _run(module: str, *args: str) -> None:
    result = subprocess.run([sys.executable, "-X", "utf8", "-m", module, *args], cwd=ROOT,
                            capture_output=True, text=True, encoding="utf-8")
    if result.returncode:
        raise RuntimeError(f"{module} failed:\n{result.stdout}\n{result.stderr}")
    print(f"OK: {module}", flush=True)


def build() -> None:
    if sys.version_info < (3, 11):
        raise RuntimeError("The reproducible build requires Python 3.11 or later")
    for module in ("src.publish.build_category_schema", "src.publish.build_analysis_fields",
                   "src.analysis.build_work_version_registry"):
        _run(module)
    # Project current registry/source identities before resolving any full text.
    # Rejoin the resulting source manifest once; only one full-text pass is
    # needed, and an old corpus cannot label a new manuscript binding as VOR.
    _run("src.publish.generate_docs_data", "--prepare-fulltext")
    _run("src.publish.build_fulltext")
    _run("src.publish.generate_docs_data")
    for module in ("src.publish.generate_promptotyping_data_v2", "src.publish.build_screening_index",
                   "src.acquire.build_codex_source_readiness", "src.analysis.build_agent_screening_queue",
                   "src.publish.validate_research_vault", "src.publish.check_claims"):
        _run(module)
    _run("src.publish.build_assertion_index")
    _run("src.publish.generate_literature_landscape", "--policy", "config/publication_policy.json",
         "--verification-ledger", "generated/verification/ai-source-reviews.json")
    _run("src.analysis.build_completion_package")
    _run("src.publish.build_downloads")
    _run("src.publish.build_release")
    from src.publish.generate_docs_data import write_json_atomic
    write_json_atomic(ROOT / MANIFEST, snapshot(ROOT))
    check_build()


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Read-only freshness and review-receipt check")
    args = parser.parse_args(argv)
    if args.check:
        check_build()
    else:
        build()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
