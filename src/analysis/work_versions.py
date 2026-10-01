"""Shared Work-Version identity and validation helpers.

The project screens one scholarly work once while preserving every known
publication version as a separately addressable evidence source.  The controlled
vocabulary lives in ``docs/data/work_version_contract.json``.  Registry builders,
publishers, and queues use this module so selection and referential checks remain
identical across the pipeline.
"""

from __future__ import annotations

import html
import json
import re
import unicodedata
from collections.abc import Iterable
from copy import deepcopy
from pathlib import Path
from typing import Any

from src.file_hashing import file_sha256

REPO = Path(__file__).resolve().parents[2]
CONTRACT_PATH = REPO / "docs" / "data" / "work_version_contract.json"
REGISTRY_PATH = REPO / "corpus" / "work_version_registry.json"
REGISTRY_SCHEMA = "femprompt-work-version-registry/0.1"
BLOCKED_INTEGRITY = {"withdrawn", "retracted"}
SOURCE_BINDINGS_PATH = "corpus/source_version_bindings.json"


def normalise_arxiv(value: object) -> str:
    """Parse an arXiv identifier without discarding its revision, if present."""
    text = str(value or "").strip().casefold()
    if text.startswith(("http://", "https://")):
        match = re.fullmatch(
            r"https?://(?:www\.)?arxiv\.org/(abs|pdf|html)/([^?#]+)", text
        )
        if not match:
            return ""
        text = match[2]
        if match[1] == "pdf" and text.endswith(".pdf"):
            text = text[:-4]
    else:
        text = re.sub(r"^(?:arxiv:\s*|10\.48550/arxiv\.)", "", text)
    return (
        text
        if re.fullmatch(r"(?:\d{4}\.\d{4,5}|[a-z][a-z.-]*/\d{7})(?:v[1-9]\d*)?", text)
        else ""
    )


def validate_source_version_identity(
    version: dict, identity: object, *, require_revision: bool = True
) -> None:
    """Check a reviewed identity against one existing version, never just its work.

    arXiv's DOI is shared by revisions. At least one registered arXiv identifier or
    URL must pin the exact revision; conflicting revisions require registry repair.
    DOI-less NBER working papers use the report number encoded in their registered
    canonical URL. No other report or web-page identity is inferred from a URL.
    """
    if not isinstance(identity, dict) or set(identity) - {
        "title",
        "doi",
        "arxiv",
        "report_number",
        "url",
    }:
        raise ValueError("source version identity contains unsupported metadata")
    if (
        not isinstance(identity.get("title"), str)
        or not identity["title"].strip()
        or normalise_title(identity["title"]) != normalise_title(version.get("title"))
    ):
        raise ValueError("source version title differs from registered bibliography")
    identifiers = version.get("identifiers", {})
    dois = {normalise_doi(value) for value in values(identifiers.get("doi"))}
    raw_arxiv = values(identifiers.get("arxiv"))
    urls = (
        values(identifiers.get("url"))
        + values(version.get("landing_url"))
        + values(version.get("fulltext_url"))
    )
    if any(not normalise_arxiv(value) for value in raw_arxiv) or any(
        re.match(r"https?://(?:www\.)?arxiv\.org/", value, re.IGNORECASE)
        and not normalise_arxiv(value)
        for value in urls
    ):
        raise ValueError("registered arXiv identifier or revision URL is malformed")
    registered_arxiv = {
        parsed
        for value in raw_arxiv + urls + list(dois)
        if (parsed := normalise_arxiv(value))
    }
    report_identity = identity.get("report_number") or identity.get("url")
    if report_identity:
        if set(identity) != {"title", "report_number", "url"}:
            raise ValueError(
                "working-paper identity needs title, report number and URL"
            )
        if version.get("version_type") != "working_paper":
            raise ValueError("report-number identity is restricted to working papers")
        registered_urls = set(values(identifiers.get("url"))) | set(
            values(version.get("landing_url"))
        )
        url = identity.get("url")
        if not isinstance(url, str) or url not in registered_urls:
            raise ValueError("working-paper URL differs from registered bibliography")
        match = re.fullmatch(r"https://www\.nber\.org/papers/w([1-9]\d*)", url)
        if not match or str(identity.get("report_number") or "") != match[1]:
            raise ValueError("working-paper number differs from registered NBER URL")
        return
    if not (identity.get("doi") or identity.get("arxiv")):
        raise ValueError(
            "source version identity needs a DOI, exact arXiv revision or registered NBER working-paper number"
        )
    if "doi" in identity and (
        not isinstance(identity["doi"], str)
        or not identity["doi"].strip()
        or normalise_doi(identity["doi"]) not in dois
    ):
        raise ValueError("source version DOI differs from registered bibliography")
    if "arxiv" in identity or (require_revision and registered_arxiv):
        expected = normalise_arxiv(identity.get("arxiv"))
        if not expected or not re.search(r"v[1-9]\d*$", expected):
            raise ValueError("source version identity needs a pinned arXiv revision")
        bases = {re.sub(r"v\d+$", "", item) for item in registered_arxiv}
        revisions = {
            item for item in registered_arxiv if re.search(r"v[1-9]\d*$", item)
        }
        if bases != {re.sub(r"v\d+$", "", expected)} or revisions != {expected}:
            raise ValueError(
                "registered arXiv revision is missing, conflicting or different from source identity"
            )


# Receipt-based bindings (operator decision of 1 October 2026). An acquisition
# receipt proves where a text came from; it never proves which work the text is.
# Identity therefore comes from the paper's own opening pages, never from the
# converter's front matter, which was written from the Zotero record itself.
RECEIPT_MODE = "acquisition_receipt"
RECEIPT_HEAD_CHARS = 12000
AUTHOR_WINDOW_BEFORE = 1500
AUTHOR_WINDOW_AFTER = 2500
# A source-only addition is a manuscript-stage expression. "unknown" covers an
# author-layout repository copy whose stage (submitted or accepted) the source
# does not state; it ranks lowest and can never become the preferred version.
ADDED_SOURCE_VERSION_TYPES = {
    "authors_original",
    "submitted_manuscript_under_review",
    "preprint",
    "accepted_manuscript",
    "unknown",
}
FRONTMATTER_PATTERN = re.compile(r"\A﻿?---\s*\n.*?\n---\s*\n", re.DOTALL)
COMMENT_PATTERN = re.compile(r"<!--.*?-->", re.DOTALL)
DOI_PATTERN = re.compile(
    r"(?:\bdoi\s*:?\s*|doi\.org/\s*)(10\.\d{4,9}\s*/\s*[^\s<>\"'\])]+)",
    re.IGNORECASE,
)
DOI_MASTHEAD_CHARS = 6000
REFERENCES_PATTERN = re.compile(
    r"\n#*\s*(?:references|literatur|literaturverzeichnis|bibliography|referencias)\b",
    re.IGNORECASE,
)


def identity_compact(value: object) -> str:
    """Return a letters-and-digits key that survives line breaks and hyphenation."""
    # Docling writes undecodable ligatures as glyph names such as "/uniFB01".
    text = re.sub(
        r"\s?/uni([0-9A-Fa-f]{4})\s?",
        lambda match: chr(int(match[1], 16)),
        html.unescape(str(value or "")),
    )
    text = unicodedata.normalize("NFKD", text).casefold()
    text = "".join(char for char in text if not unicodedata.combining(char))
    text = text.replace("&", "and").replace("¨", "")
    return "".join(char for char in text if char.isalnum())


def source_text_head(text: str) -> str:
    """Return the paper's own opening text without converter front matter."""
    text = FRONTMATTER_PATTERN.sub("", text, count=1)
    return COMMENT_PATTERN.sub(" ", text)[:RECEIPT_HEAD_CHARS]


def first_author_surname(authors: object) -> str:
    """Return the first registered creator's surname, or an organisation's name."""
    names = values(authors)
    if not names:
        return ""
    name = names[0]
    if "," in name:
        return name.split(",", 1)[0].strip()
    parts = name.split()
    # Personal names end in the surname. An organisation keeps its full name.
    return parts[-1] if 1 < len(parts) <= 4 and not name.endswith(".") else name


def receipt_identity_check(
    text: str, version: dict, accepted_dois: Iterable[str] = ()
) -> dict[str, str]:
    """Check a bound text against one registered version by title, author, DOI, year.

    The title must occur in the opening text; the first registered author's surname
    must occur there whenever authors are registered. A DOI printed in the opening
    text must be one of the accepted DOIs, so a text that prints another work's DOI
    fails. A year that is not printed stays recorded as such and cannot pass.
    """
    head = source_text_head(text)
    compact_head = identity_compact(head)
    title = identity_compact(version.get("title"))
    position = compact_head.find(title) if len(title) >= 8 else -1
    if position < 0 and len(title) >= 8:
        # A printed acronym in parentheses, e.g. "Intelligence (AI)", is the
        # only tolerated difference; it cannot turn another title into this one.
        bare_head = identity_compact(re.sub(r"\([^)]{1,12}\)", " ", head))
        bare_title = identity_compact(
            re.sub(r"\([^)]{1,12}\)", " ", str(version.get("title") or ""))
        )
        bare_position = bare_head.find(bare_title)
        if bare_position >= 0:
            compact_head, title, position = bare_head, bare_title, bare_position
    result = {"title": "pass" if position >= 0 else "fail"}
    surname = identity_compact(first_author_surname(version.get("authors")))
    if not surname:
        result["first_author"] = "not_registered"
    else:
        # The byline stands next to a printed title, on the title page or in the
        # recommended citation. A surname found only elsewhere is usually a citation
        # of another work and cannot confirm authorship.
        found = False
        while position >= 0 and not found:
            start = max(0, position - AUTHOR_WINDOW_BEFORE)
            end = position + len(title) + AUTHOR_WINDOW_AFTER
            found = surname in compact_head[start:end]
            position = compact_head.find(title, position + 1)
        result["first_author"] = "pass" if found else "fail"
    accepted = {normalise_doi(doi) for doi in accepted_dois if normalise_doi(doi)}
    # Only the masthead region counts: DOIs of cited works in a reference list
    # say nothing about the citing text's own identity.
    masthead = REFERENCES_PATTERN.split(head[:DOI_MASTHEAD_CHARS], maxsplit=1)[0]
    printed = {
        normalise_doi(re.sub(r"\s+", "", match).rstrip(".,;:"))
        for match in DOI_PATTERN.findall(html.unescape(masthead))
    }
    if not accepted:
        result["doi"] = "not_registered"
    elif not printed:
        result["doi"] = "not_printed"
    elif printed & accepted or any(
        doi.startswith(item) or item.startswith(doi)
        for doi in printed
        for item in accepted
    ):
        result["doi"] = "pass"
    else:
        result["doi"] = "fail"
    year = re.match(r"\d{4}", str(version.get("version_date") or ""))
    if not year:
        result["year"] = "not_registered"
    else:
        result["year"] = "pass" if year[0] in head else "not_printed"
    return result


def receipt_identity_failures(check: dict[str, str]) -> list[str]:
    """Name the identity elements that refute a receipt-based binding."""
    return [field for field, value in check.items() if value == "fail"]


def accepted_receipt_dois(work: dict, source_version: dict) -> set[str]:
    """DOIs a bound text of this Work may print without contradicting identity.

    A manuscript commonly prints the DOI of its published version, so every DOI
    registered for the same Work is accepted; the version type is reviewed apart.
    """
    versions = [*work.get("versions", []), source_version]
    dois = {
        normalise_doi(doi)
        for version in versions
        for doi in values(version.get("identifiers", {}).get("doi"))
    }
    for version in versions:
        for value in values(version.get("identifiers", {}).get("arxiv")):
            if parsed := normalise_arxiv(value):
                dois.add("10.48550/arxiv." + re.sub(r"v\d+$", "", parsed))
    return dois


def validate_acquisition_receipt(receipt: object, repo: Path | None = None) -> None:
    """Require origin, retrieval time and artefact hash for an acquired source."""
    if not isinstance(receipt, dict) or set(receipt) - {
        "source_url",
        "repo_path",
        "retrieved_at",
        "sha256",
        "route",
        "note",
    }:
        raise ValueError("acquisition receipt is missing or has unsupported fields")
    url = receipt.get("source_url")
    path = receipt.get("repo_path")
    if not (
        (isinstance(url, str) and re.match(r"https?://\S+$", url))
        or (isinstance(path, str) and path)
    ):
        raise ValueError("acquisition receipt needs a source URL or repository path")
    if not re.fullmatch(r"sha256:[0-9a-f]{64}", str(receipt.get("sha256", ""))):
        raise ValueError("acquisition receipt needs the acquired artefact's sha256")
    from datetime import datetime

    try:
        retrieved = datetime.fromisoformat(
            str(receipt.get("retrieved_at", "")).replace("Z", "+00:00")
        )
    except ValueError as error:
        raise ValueError("acquisition receipt needs a retrieval timestamp") from error
    if retrieved.tzinfo is None:
        raise ValueError("acquisition receipt timestamp needs a timezone")
    if isinstance(path, str) and path:
        reference = Path(path)
        if "\\" in path or reference.is_absolute() or ".." in reference.parts:
            raise ValueError("acquisition receipt path must stay in the repository")
        if repo is not None:
            local = (repo / path).resolve()
            # Licensed originals such as PDFs stay local and git-ignored. Their
            # digest is then retained provenance and is verified wherever present.
            if local.is_file() and "sha256:" + file_sha256(local) != receipt["sha256"]:
                raise ValueError("acquisition receipt hash differs from its artefact")
            if not local.is_file() and not url:
                raise ValueError("acquisition receipt artefact is missing")


def validate_receipt_binding(
    binding: dict, work: dict, version: dict, repo: Path | None = None
) -> None:
    """Re-run the receipt rule against the bound text whenever it is available."""
    validate_acquisition_receipt(binding.get("acquisition_receipt"), repo)
    recorded = binding.get("identity_check")
    if not isinstance(recorded, dict) or receipt_identity_failures(recorded):
        raise ValueError("receipt binding lacks a passed identity check")
    if recorded.get("title") != "pass" or recorded.get("first_author") not in {
        "pass",
        "not_registered",
    }:
        raise ValueError("receipt binding needs a passed title and author check")
    relation = binding.get("version_relation")
    if (
        not isinstance(relation, dict)
        or relation.get("source_version_type") != version.get("version_type")
        or relation.get("preferred_version_id") != work.get("preferred_version_id")
        or not isinstance(relation.get("difference_to_preferred"), str)
        or not relation["difference_to_preferred"].strip()
    ):
        raise ValueError("receipt binding must record its version and difference")
    if repo is not None:
        path = repo / binding["source_path"]
        check = receipt_identity_check(
            path.read_text(encoding="utf-8", errors="replace"),
            version,
            accepted_receipt_dois(work, version),
        )
        if check != recorded:
            raise ValueError(
                f"receipt identity check no longer holds: {check} != {recorded}"
            )


def source_binding_for_record(
    registry: dict, record_id: str, repo: Path | None = None
) -> dict | None:
    """Resolve a governed reading source separately from the bibliographic record."""
    binding = registry.get("source_index", {}).get(record_id)
    if binding is None:
        return None
    canonical = registry.get("record_index", {}).get(record_id, {})
    work = next(
        (
            item
            for item in registry.get("works", [])
            if item["work_id"] == canonical.get("work_id")
        ),
        {},
    )
    version = next(
        (
            item
            for item in work.get("versions", [])
            if item["version_id"] == binding.get("source_version_id")
        ),
        {},
    )
    if (
        binding.get("record_id") != record_id
        or binding.get("work_id") != canonical.get("work_id")
        or binding.get("bibliographic_version_id") != canonical.get("version_id")
        or not version
        or binding.get("source_version_type") != version.get("version_type")
        or version.get("integrity_status") in BLOCKED_INTEGRITY
        or binding.get("preferred_version_id") != work.get("preferred_version_id")
        or binding.get("is_preferred_version")
        is not (version.get("version_id") == work.get("preferred_version_id"))
    ):
        raise ValueError(
            f"{record_id}: source binding crosses or misstates canonical Work-Version identity"
        )
    mode = binding.get("binding_mode")
    if mode == RECEIPT_MODE:
        bibliographic = next(
            item
            for item in work["versions"]
            if item["version_id"] == canonical["version_id"]
        )
        if normalise_title(
            (binding.get("bibliographic_identity") or {}).get("title")
        ) != normalise_title(bibliographic.get("title")):
            raise ValueError(f"{record_id}: receipt binding names another bibliography")
        # The source Version was looked up inside the record's own Work above, so
        # a differing source can only be another registered expression of it.
        try:
            validate_receipt_binding(binding, work, version, repo)
        except ValueError as error:
            raise ValueError(f"{record_id}: {error}") from error
    elif mode is not None or binding["source_version_id"] == canonical["version_id"]:
        if (
            mode != "existing_version"
            or binding["source_version_id"] != canonical["version_id"]
        ):
            raise ValueError(
                f"{record_id}: existing source binding must retain the exact bibliographic version"
            )
        validate_source_version_identity(
            version, binding.get("bibliographic_identity"), require_revision=False
        )
        validate_source_version_identity(version, binding.get("version_identity"))
    reference = binding.get("source_path", "")
    if (
        not isinstance(reference, str)
        or not reference
        or "\\" in reference
        or "#" in reference
        or Path(reference).is_absolute()
        or ".." in Path(reference).parts
    ):
        raise ValueError(f"{record_id}: invalid source binding path")
    if not re.fullmatch(r"sha256:[0-9a-f]{64}", str(binding.get("source_sha256", ""))):
        raise ValueError(f"{record_id}: invalid source binding hash")
    if repo is not None:
        path = (repo / reference).resolve()
        if (
            not path.is_relative_to(repo.resolve())
            or "sha256:" + file_sha256(path) != binding["source_sha256"]
        ):
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
        item["key"]: int(item["preference_rank"]) for item in contract["version_types"]
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
            raise ValueError(
                f"{work_id}: latest_version_id does not follow the contract"
            )
        if work.get("preferred_version_id") != preferred:
            raise ValueError(
                f"{work_id}: preferred_version_id does not follow the contract"
            )

    for work in registry.get("works", []):
        for version in work["versions"]:
            for relation in version.get("relations", []):
                if relation.get("type") not in allowed_relations:
                    raise ValueError(f"{version['version_id']}: unknown relation type")
                target = relation.get("target_version_id")
                if target not in version_ids:
                    raise ValueError(
                        f"{version['version_id']}: unknown relation target {target}"
                    )
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
