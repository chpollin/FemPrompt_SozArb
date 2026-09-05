"""Shared Work-Version identity and validation helpers.

The project screens one scholarly work once while preserving every known
publication version as a separately addressable evidence source.  The controlled
vocabulary lives in ``docs/data/work_version_contract.json``.  Registry builders,
publishers, and queues use this module so selection and referential checks remain
identical across the pipeline.
"""

from __future__ import annotations

import json
import re
import unicodedata
from copy import deepcopy
from pathlib import Path
from typing import Any, Iterable

from src.file_hashing import file_sha256

REPO = Path(__file__).resolve().parents[2]
CONTRACT_PATH = REPO / "docs" / "data" / "work_version_contract.json"
REGISTRY_PATH = REPO / "corpus" / "work_version_registry.json"
REGISTRY_SCHEMA = "femprompt-work-version-registry/0.1"
BLOCKED_INTEGRITY = {"withdrawn", "retracted"}
SOURCE_BINDINGS_PATH = "corpus/source_version_bindings.json"


def source_binding_for_record(registry: dict, record_id: str, repo: Path | None = None) -> dict | None:
    """Resolve a governed reading source separately from the bibliographic record."""
    binding = registry.get("source_index", {}).get(record_id)
    if binding is None:
        return None
    canonical = registry.get("record_index", {}).get(record_id, {})
    work = next((item for item in registry.get("works", []) if item["work_id"] == canonical.get("work_id")), {})
    version = next((item for item in work.get("versions", []) if item["version_id"] == binding.get("source_version_id")), {})
    if (
        binding.get("record_id") != record_id
        or binding.get("work_id") != canonical.get("work_id")
        or binding.get("bibliographic_version_id") != canonical.get("version_id")
        or not version
        or binding.get("source_version_type") != version.get("version_type")
        or version.get("integrity_status") in BLOCKED_INTEGRITY
        or binding.get("preferred_version_id") != work.get("preferred_version_id")
        or binding.get("is_preferred_version") is not (version.get("version_id") == work.get("preferred_version_id"))
    ):
        raise ValueError(f"{record_id}: source binding crosses or misstates canonical Work-Version identity")
    reference = binding.get("source_path", "")
    if not isinstance(reference, str) or not reference or "\\" in reference or "#" in reference or Path(reference).is_absolute() or ".." in Path(reference).parts:
        raise ValueError(f"{record_id}: invalid source binding path")
    if not re.fullmatch(r"sha256:[0-9a-f]{64}", str(binding.get("source_sha256", ""))):
        raise ValueError(f"{record_id}: invalid source binding hash")
    if repo is not None:
        path = (repo / reference).resolve()
        if not path.is_relative_to(repo.resolve()) or "sha256:" + file_sha256(path) != binding["source_sha256"]:
            raise ValueError(f"{record_id}: stale source binding")
    return deepcopy(binding)


def normalise_doi(value: object) -> str:
    """Return a DOI payload without resolver and punctuation noise."""
    doi = str(value or "").strip().casefold()
    doi = re.sub(r"^https?://(?:dx\.)?doi\.org/", "", doi)
    doi = re.sub(r"^doi:\s*", "", doi)
    return doi.rstrip("/., ")


def normalise_title(value: object) -> str:
    """Return a conservative Unicode title key for identity comparison."""
    text = unicodedata.normalize("NFKC", str(value or "")).casefold()
    return " ".join(re.findall(r"[\w]+", text, flags=re.UNICODE))


def values(value: object) -> list[str]:
    """Normalise a scalar or list identifier field into distinct strings."""
    raw = value if isinstance(value, list) else [value]
    result: list[str] = []
    for item in raw:
        text = str(item or "").strip()
        if text and text not in result:
            result.append(text)
    return result


def load_contract(path: Path = CONTRACT_PATH) -> dict[str, Any]:
    """Load the controlled vocabulary at the shared data boundary."""
    return json.loads(path.read_text(encoding="utf-8"))


def version_ranks(contract: dict[str, Any]) -> dict[str, int]:
    """Return the configured preference rank per version type."""
    return {
        item["key"]: int(item["preference_rank"])
        for item in contract["version_types"]
    }


def version_date_key(value: object) -> tuple[int, int, int]:
    """Parse the available date precision into a sortable calendar tuple."""
    parts = [int(part) for part in re.findall(r"\d+", str(value or ""))[:3]]
    if not parts or parts[0] < 1000:
        return (0, 0, 0)
    return (
        parts[0],
        parts[1] if len(parts) > 1 and parts[1] <= 12 else 0,
        parts[2] if len(parts) > 2 and parts[2] <= 31 else 0,
    )


def select_version_ids(
    versions: Iterable[dict[str, Any]], contract: dict[str, Any]
) -> tuple[str, str]:
    """Return latest and preferred IDs without turning stage into quality."""
    candidates = list(versions)
    if not candidates:
        raise ValueError("a work must contain at least one version")
    ranks = version_ranks(contract)

    def latest_key(version: dict[str, Any]) -> tuple[tuple[int, int, int], int, str]:
        return (
            version_date_key(version.get("version_date")),
            ranks.get(version.get("version_type", "unknown"), 0),
            version["version_id"],
        )

    latest = max(candidates, key=latest_key)
    eligible = [
        version
        for version in candidates
        if version.get("integrity_status", "unknown") not in BLOCKED_INTEGRITY
    ]
    if not eligible:
        eligible = candidates

    def preferred_key(version: dict[str, Any]) -> tuple[int, tuple[int, int, int], str]:
        return (
            ranks.get(version.get("version_type", "unknown"), 0),
            version_date_key(version.get("version_date")),
            version["version_id"],
        )

    preferred = max(eligible, key=preferred_key)
    return latest["version_id"], preferred["version_id"]


def load_registry(path: Path = REGISTRY_PATH) -> dict[str, Any]:
    """Load and validate the canonical registry."""
    registry = json.loads(path.read_text(encoding="utf-8"))
    validate_registry(registry, load_contract())
    return registry


def lookup_by_record(
    registry: dict[str, Any], record_id: str
) -> tuple[dict[str, Any], dict[str, Any]] | None:
    """Resolve a Zotero or corpus record to its work and exact version."""
    reference = registry.get("record_index", {}).get(record_id)
    if not reference:
        return None
    work = next(
        item for item in registry["works"] if item["work_id"] == reference["work_id"]
    )
    version = next(
        item
        for item in work["versions"]
        if item["version_id"] == reference["version_id"]
    )
    return work, version


def validate_registry(registry: dict[str, Any], contract: dict[str, Any]) -> None:
    """Fail closed on identity, vocabulary, and selection inconsistencies."""
    if registry.get("schema") != REGISTRY_SCHEMA:
        raise ValueError(f"unexpected registry schema: {registry.get('schema')!r}")
    allowed_types = {item["key"] for item in contract["version_types"]}
    allowed_peer_status = set(contract["peer_review_statuses"])
    allowed_peer_basis = set(contract["peer_review_bases"])
    allowed_integrity = set(contract["integrity_statuses"])
    allowed_relations = set(contract["relation_types"])
    work_ids: set[str] = set()
    version_ids: set[str] = set()
    version_to_work: dict[str, str] = {}

    for work in registry.get("works", []):
        work_id = work.get("work_id")
        if not isinstance(work_id, str) or not work_id.startswith("work:"):
            raise ValueError(f"invalid work_id: {work_id!r}")
        if work_id in work_ids:
            raise ValueError(f"duplicate work_id: {work_id}")
        work_ids.add(work_id)
        versions = work.get("versions", [])
        if not versions:
            raise ValueError(f"{work_id}: no versions")
        for version in versions:
            version_id = version.get("version_id")
            if not isinstance(version_id, str) or not version_id.startswith("version:"):
                raise ValueError(f"{work_id}: invalid version_id {version_id!r}")
            if version_id in version_ids:
                raise ValueError(
                    f"duplicate version_id: {version_id} in "
                    f"{version_to_work[version_id]} and {work_id}"
                )
            version_ids.add(version_id)
            version_to_work[version_id] = work_id
            if version.get("version_type") not in allowed_types:
                raise ValueError(f"{version_id}: unknown version_type")
            if version.get("peer_review_status") not in allowed_peer_status:
                raise ValueError(f"{version_id}: unknown peer_review_status")
            if version.get("peer_review_basis") not in allowed_peer_basis:
                raise ValueError(f"{version_id}: unknown peer_review_basis")
            if version.get("integrity_status") not in allowed_integrity:
                raise ValueError(f"{version_id}: unknown integrity_status")
        latest, preferred = select_version_ids(versions, contract)
        if work.get("latest_version_id") != latest:
            raise ValueError(f"{work_id}: latest_version_id does not follow the contract")
        if work.get("preferred_version_id") != preferred:
            raise ValueError(f"{work_id}: preferred_version_id does not follow the contract")

    for work in registry.get("works", []):
        for version in work["versions"]:
            for relation in version.get("relations", []):
                if relation.get("type") not in allowed_relations:
                    raise ValueError(f"{version['version_id']}: unknown relation type")
                target = relation.get("target_version_id")
                if target not in version_ids:
                    raise ValueError(f"{version['version_id']}: unknown relation target {target}")
                if version_to_work[target] != work["work_id"]:
                    raise ValueError(
                        f"{version['version_id']}: relation crosses work boundary"
                    )

    for record_id, reference in registry.get("record_index", {}).items():
        if reference.get("work_id") not in work_ids:
            raise ValueError(f"{record_id}: record index has unknown work")
        version_id = reference.get("version_id")
        if version_id not in version_ids:
            raise ValueError(f"{record_id}: record index has unknown version")
        if version_to_work[version_id] != reference["work_id"]:
            raise ValueError(f"{record_id}: record index crosses work boundary")

    for alias, work_id in registry.get("legacy_work_id_index", {}).items():
        if not alias or work_id not in work_ids:
            raise ValueError(f"legacy alias {alias!r} has unknown work")

    for record_id in registry.get("source_index", {}):
        source_binding_for_record(registry, record_id)
