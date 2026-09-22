#!/usr/bin/env python3
"""JSON Schema validation for the generated and governed JSON contracts.

Each binding names one schema in schemas/ and the repository files it
describes. A missing file is not an error here, because the reading layer,
the acquisition tree and the productive screening track are prepared
locally and are not all present in every checkout.

Exit code 0 means every present file validates. Run:
python -m src.publish.validate_schemas
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

from jsonschema import Draft202012Validator

REPO = Path(__file__).resolve().parents[2]
SCHEMAS = REPO / "schemas"

# schema stem -> repository glob patterns relative to the repository root
BINDINGS: dict[str, tuple[str, ...]] = {
    "femprompt-completion-package-1.0": ("generated/completion/completion-package.json",),
    "femprompt-prisma-reviewer-0.5": ("docs/data/screening/*.json",),
    "femprompt-source-readiness-0.2": (
        "generated/source-acquisition/codex-websearch-2026/source-readiness.json",
    ),
    "femprompt-source-version-bindings-0.2": ("corpus/source_version_bindings.json",),
    "femprompt-work-version-registry-0.1": ("corpus/work_version_registry.json",),
}


def schema_path(stem: str) -> Path:
    return SCHEMAS / f"{stem}.schema.json"


def bound_files(stem: str, repo: Path = REPO) -> list[Path]:
    paths: list[Path] = []
    for pattern in BINDINGS[stem]:
        paths.extend(sorted(repo.glob(pattern)))
    return paths


def validate_file(stem: str, path: Path) -> list[str]:
    """Return one message per violation, empty when the file conforms."""
    schema = json.loads(schema_path(stem).read_text(encoding="utf-8"))
    document = json.loads(path.read_text(encoding="utf-8"))
    validator = Draft202012Validator(schema)
    messages = []
    for error in sorted(validator.iter_errors(document), key=lambda e: list(e.absolute_path)):
        location = "/" + "/".join(str(part) for part in error.absolute_path)
        messages.append(f"{_label(path)}: {location}: {error.message}")
    return messages


def _label(path: Path) -> str:
    try:
        return path.relative_to(REPO).as_posix()
    except ValueError:
        return path.as_posix()


def collect_errors(repo: Path = REPO) -> list[str]:
    errors: list[str] = []
    for stem in sorted(BINDINGS):
        if not schema_path(stem).exists():
            errors.append(f"schemas/{stem}.schema.json: missing schema file")
            continue
        for path in bound_files(stem, repo):
            errors.extend(validate_file(stem, path))
    return errors


def main() -> int:
    errors = collect_errors()
    for message in errors:
        print(f"SCHEMA {message}")
    if errors:
        print(f"validate_schemas: {len(errors)} violation(s)")
        return 1
    print("validate_schemas: ok")
    return 0


if __name__ == "__main__":
    sys.exit(main())
