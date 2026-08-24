"""Validate the project-specific Grounded Vault profile.

The upstream Grounded Vault layer model is retained. This project replaces its
``validated`` maturity state with the explicit ``ai-agent-reviewed`` state and
records deterministic validation separately under ``checked.validation``.

Usage:
    python -m src.publish.validate_research_vault
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass, field
from datetime import date
from pathlib import Path
from typing import Any

import yaml


REPO_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_VAULT = REPO_ROOT / "research-vault"
WORK_VERSION_REGISTRY = REPO_ROOT / "corpus" / "work_version_registry.json"
CONTENT_FOLDERS = ("20_distillates", "30_assertions", "40_output")
TYPE_FOLDERS = {
    "distillate": "20_distillates/",
    "assertion": "30_assertions/",
    "moc": "30_assertions/",
    "chapter": "40_output/",
}
STATUS_RANK = {
    "grounded": 0,
    "ai-agent-reviewed": 1,
    "verified": 2,
    "publication-approved": 3,
}
REQUIRED_CHECKS = {
    "grounded": (),
    "ai-agent-reviewed": ("validation", "ai-agent-review"),
    "verified": ("validation", "ai-agent-review", "verification"),
    "publication-approved": (
        "validation",
        "ai-agent-review",
        "verification",
        "publication-approval",
    ),
}
REQUIRED_FIELDS = {
    "distillate": (
        "type",
        "source-type",
        "record-id",
        "work-id",
        "version-id",
        "version-type",
        "topics",
        "status",
        "checked",
        "created",
        "updated",
    ),
    "assertion": (
        "type",
        "topics",
        "status",
        "checked",
        "grounding",
        "contested-with",
        "created",
        "updated",
    ),
    "moc": ("type", "topic", "created", "updated"),
    "chapter": (
        "type",
        "stage",
        "status",
        "checked",
        "assertions",
        "posits",
        "created",
        "updated",
    ),
}
WIKILINK = re.compile(r"\[\[([^\]#|]+?)(?:#\^([A-Za-z0-9-]+))?(?:\|[^\]]*)?\]\]")
BLOCK_ID = re.compile(r"\^([A-Za-z0-9-]+)\s*$")


@dataclass
class Document:
    path: Path
    key: str
    metadata: dict[str, Any]
    body: str
    blocks: set[str]


@dataclass
class ValidationReport:
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)

    @property
    def ok(self) -> bool:
        return not self.errors


def _iso_date(value: Any) -> date | None:
    try:
        return date.fromisoformat(str(value).strip()[:10])
    except ValueError:
        return None


def _parse_document(
    path: Path, vault: Path, report: ValidationReport
) -> Document | None:
    text = path.read_text(encoding="utf-8")
    key = path.relative_to(vault).with_suffix("").as_posix()
    if not text.startswith("---\n"):
        report.errors.append(f"{key}: missing YAML frontmatter")
        return None
    end = text.find("\n---\n", 4)
    if end < 0:
        report.errors.append(f"{key}: unterminated YAML frontmatter")
        return None
    try:
        metadata = yaml.safe_load(text[4:end]) or {}
    except yaml.YAMLError as error:
        report.errors.append(f"{key}: invalid YAML frontmatter: {error}")
        return None
    if not isinstance(metadata, dict):
        report.errors.append(f"{key}: frontmatter must be a mapping")
        return None
    body = text[end + 5 :]
    blocks = {
        match.group(1) for line in body.splitlines() if (match := BLOCK_ID.search(line))
    }
    return Document(path, key, metadata, body, blocks)


def _documents(vault: Path, report: ValidationReport) -> dict[str, Document]:
    documents: dict[str, Document] = {}
    for folder in CONTENT_FOLDERS:
        for path in sorted((vault / folder).rglob("*.md")):
            document = _parse_document(path, vault, report)
            if document is not None:
                documents[document.key] = document
    return documents


def _reference_ids(vault: Path) -> set[str]:
    import json

    identifiers: set[str] = set()
    for path in sorted((vault / "references").glob("*.json")):
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            continue
        records = payload if isinstance(payload, list) else [payload]
        identifiers.update(
            str(record["id"])
            for record in records
            if isinstance(record, dict) and record.get("id")
        )
    return identifiers


def _links(values: Any) -> list[tuple[str, str | None]]:
    if not isinstance(values, list):
        return []
    return [
        (match.group(1).strip(), match.group(2))
        for value in values
        for match in WIKILINK.finditer(str(value))
    ]


def _check_metadata(document: Document, report: ValidationReport) -> None:
    metadata = document.metadata
    document_type = metadata.get("type")
    required = REQUIRED_FIELDS.get(document_type)
    if required is None:
        report.errors.append(f"{document.key}: unknown type {document_type!r}")
        return
    if not document.key.startswith(TYPE_FOLDERS[document_type]):
        report.errors.append(
            f"{document.key}: type {document_type!r} is stored in the wrong layer"
        )
    for field_name in required:
        if field_name not in metadata:
            report.errors.append(f"{document.key}: missing {field_name}")
    if document_type == "moc":
        return
    status = metadata.get("status")
    if status not in STATUS_RANK:
        report.errors.append(f"{document.key}: unknown status {status!r}")
        return
    checked = metadata.get("checked")
    if not isinstance(checked, dict):
        report.errors.append(f"{document.key}: checked must be a mapping")
        return
    for check_name in REQUIRED_CHECKS[status]:
        if check_name not in checked:
            report.errors.append(
                f"{document.key}: status {status} requires checked.{check_name}"
            )
    for check_name, checked_at in checked.items():
        if _iso_date(checked_at) is None:
            report.errors.append(
                f"{document.key}: checked.{check_name} is not an ISO date"
            )
    check_dates = [parsed for value in checked.values() if (parsed := _iso_date(value))]
    updated = _iso_date(metadata.get("updated"))
    if check_dates and updated is not None and updated > max(check_dates):
        report.warnings.append(
            f"{document.key}: content date is newer than its latest check"
        )


def _resolve_link(
    document: Document,
    target: str,
    block: str | None,
    expected_layer: str,
    documents: dict[str, Document],
    report: ValidationReport,
) -> Document | None:
    if not target.startswith(expected_layer):
        report.errors.append(
            f"{document.key}: link {target!r} must point into {expected_layer}"
        )
        return None
    target_document = documents.get(target)
    if target_document is None:
        report.errors.append(f"{document.key}: unresolved link {target!r}")
        return None
    if block is not None and block not in target_document.blocks:
        report.errors.append(f"{document.key}: unresolved block {target}#^{block}")
    return target_document


def _check_distillate(
    document: Document,
    references: set[str],
    record_index: dict[str, dict[str, str]],
    report: ValidationReport,
) -> None:
    metadata = document.metadata
    if metadata.get("source-type") != "publication":
        report.errors.append(
            f"{document.key}: current profile supports publication distillates only"
        )
        return
    if metadata.get("reference") not in references:
        report.errors.append(f"{document.key}: reference is unresolved")
    record_id = str(metadata.get("record-id") or "")
    work_id = str(metadata.get("work-id") or "")
    version_id = str(metadata.get("version-id") or "")
    if not work_id.startswith("work:") or not version_id.startswith("version:"):
        report.errors.append(f"{document.key}: invalid work-version source identity")
    if record_index:
        expected = record_index.get(record_id)
        if expected is None:
            report.errors.append(f"{document.key}: record-id is absent from the registry")
        elif expected != {"work_id": work_id, "version_id": version_id}:
            report.errors.append(
                f"{document.key}: work-version source identity differs from the registry"
            )
    if "quote" not in (metadata.get("checked") or {}):
        report.errors.append(f"{document.key}: checked.quote is required")
    in_statements = False
    statement_count = 0
    for line in document.body.splitlines():
        if line.startswith("## "):
            in_statements = line.strip().lower() == "## core statements"
        elif in_statements and line.startswith("- "):
            statement_count += 1
            if BLOCK_ID.search(line) is None:
                report.errors.append(
                    f"{document.key}: core statement lacks a statement ID"
                )
    if statement_count == 0:
        report.errors.append(f"{document.key}: no core statements")


def _check_assertion(
    document: Document,
    documents: dict[str, Document],
    report: ValidationReport,
) -> None:
    targets = _links(document.metadata.get("grounding"))
    if not targets:
        report.errors.append(f"{document.key}: assertion has no grounding")
        return
    for target, block in targets:
        if block is None:
            report.errors.append(f"{document.key}: grounding lacks a statement ID")
        grounded_in = _resolve_link(
            document,
            target,
            block,
            "20_distillates/",
            documents,
            report,
        )
        if grounded_in is not None and STATUS_RANK[document.metadata["status"]] > (
            STATUS_RANK.get(grounded_in.metadata.get("status"), 0)
        ):
            report.errors.append(
                f"{document.key}: status exceeds grounding {grounded_in.key}"
            )


def _check_chapter(
    document: Document,
    documents: dict[str, Document],
    report: ValidationReport,
) -> None:
    targets = _links(document.metadata.get("assertions"))
    if document.metadata.get("status") != "grounded" and not targets:
        report.errors.append(
            f"{document.key}: reviewed chapter must name supporting assertions"
        )
    for target, block in targets:
        supports = _resolve_link(
            document,
            target,
            block,
            "30_assertions/",
            documents,
            report,
        )
        if supports is not None and STATUS_RANK[document.metadata["status"]] > (
            STATUS_RANK.get(supports.metadata.get("status"), 0)
        ):
            report.errors.append(
                f"{document.key}: status exceeds assertion {supports.key}"
            )


def validate_vault(vault: Path = DEFAULT_VAULT) -> ValidationReport:
    """Return all deterministic findings for the active research-vault layers."""
    report = ValidationReport()
    documents = _documents(vault, report)
    references = _reference_ids(vault)
    record_index: dict[str, dict[str, str]] = {}
    if vault.resolve() == DEFAULT_VAULT.resolve() and WORK_VERSION_REGISTRY.exists():
        registry = json.loads(WORK_VERSION_REGISTRY.read_text(encoding="utf-8"))
        record_index = registry.get("record_index", {})
    for document in documents.values():
        _check_metadata(document, report)
        document_type = document.metadata.get("type")
        if document_type == "distillate":
            _check_distillate(document, references, record_index, report)
        elif document_type == "assertion":
            _check_assertion(document, documents, report)
        elif document_type == "chapter":
            _check_chapter(document, documents, report)
    return report


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("vault", nargs="?", type=Path, default=DEFAULT_VAULT)
    args = parser.parse_args(argv)
    report = validate_vault(args.vault.resolve())
    for warning in report.warnings:
        print(f"WARNUNG: {warning}")
    if report.errors:
        for error in report.errors:
            print(f"FEHLER: {error}", file=sys.stderr)
        return 1
    print(f"OK: Research Vault profile validated ({len(report.warnings)} warnings)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
