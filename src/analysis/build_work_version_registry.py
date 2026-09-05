#!/usr/bin/env python3
"""Build the canonical Work-Version registry from curated and intake data.

The registry separates a scholarly work from the publication versions through
which it is available.  Existing registry identifiers are reused before new
UUIDv5 identifiers are minted, so later metadata enrichment does not rename an
established work or version.  Exact DOI and Zotero identifiers are strong merge
signals.  Title matching is limited to the already curated intake relations.

Usage:
    python -m src.analysis.build_work_version_registry
    python -m src.analysis.build_work_version_registry --check
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any, Iterable

from src.file_hashing import canonical_file_bytes, file_sha256
from src.analysis.metadata_corrections import CORRECTIONS_PATH, apply_metadata_corrections
from src.analysis.work_versions import (
    REGISTRY_PATH,
    REGISTRY_SCHEMA,
    SOURCE_BINDINGS_PATH,
    load_contract,
    normalise_arxiv,
    normalise_doi,
    normalise_title,
    select_version_ids,
    source_binding_for_record,
    validate_registry,
    values,
)

REPO = Path(__file__).resolve().parents[2]
ZOTERO_PATH = REPO / "corpus" / "zotero_export.json"
ROUND2_PATH = REPO / "generated" / "round2-intake.json"
CORPUS_PATH = REPO / "docs" / "data" / "research_vault_v2.json"
AGENT_REVIEW_DIR = REPO / "generated" / "round2-agent-review"
AGENT_REVIEW_FILES = {
    "identity": AGENT_REVIEW_DIR / "identity.json",
    "metadata": AGENT_REVIEW_DIR / "metadata.json",
    "source": AGENT_REVIEW_DIR / "sources.json",
}
WORK_NAMESPACE = uuid.UUID("ee2e644c-1e23-4cdc-b4f5-0af3086204fb")
VERSION_NAMESPACE = uuid.UUID("984437f4-e846-4b27-ae56-ce4e157f180a")
VERSION_FIELDS = (
    "title",
    "version_type",
    "version_date",
    "item_type",
    "journal_or_repository",
    "peer_review_status",
    "peer_review_basis",
    "integrity_status",
    "access_status",
    "landing_url",
    "fulltext_url",
    "license",
)
VERSION_TYPE_ALIASES = {
    "conference_proceedings_version": "version_of_record",
    "publisher_version": "version_of_record",
    "published_article": "version_of_record",
    "reissued_book_chapter_version": "version_of_record",
    "repository_copy_of_version_of_record": "version_of_record",
}
NON_RECORD_VERSION_TYPES = {
    "authors_original",
    "submitted_manuscript_under_review",
    "preprint",
    "working_paper",
    "accepted_manuscript",
    "proof",
}


def _sha256(path: Path) -> str:
    return file_sha256(path)


def _read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def _normalise_url(value: object) -> str:
    return str(value or "").strip().rstrip("/")


def _creator_names(item: dict[str, Any]) -> list[str]:
    names: list[str] = []
    for creator in item.get("creators", []):
        if creator.get("creatorType") != "author":
            continue
        name = " ".join(
            part
            for part in (creator.get("firstName", ""), creator.get("lastName", ""))
            if part
        ).strip()
        if name:
            names.append(name)
    return names


def _first_author_key(authors: Iterable[str]) -> str:
    first = next(iter(authors), "")
    return normalise_title(first)


def _year(value: object) -> str:
    match = re.search(r"\b(?:19|20)\d{2}\b", str(value or ""))
    return match.group(0) if match else ""


def _identifier_map(raw: object) -> dict[str, list[str]]:
    source = raw if isinstance(raw, dict) else {}
    identifiers: dict[str, list[str]] = {}
    for key in ("doi", "arxiv", "zotero_key", "url"):
        entries = values(source.get(key))
        if key == "doi":
            entries = [normalise_doi(entry) for entry in entries]
        elif key == "arxiv":
            entries = [entry.casefold().removeprefix("arxiv:") for entry in entries]
        elif key == "url":
            entries = [_normalise_url(entry) for entry in entries]
        entries = sorted({entry for entry in entries if entry})
        if entries:
            identifiers[key] = entries
    return identifiers


def _identifier_tokens(identifiers: dict[str, list[str]]) -> set[str]:
    return {
        f"{kind}:{value.casefold()}"
        for kind, entries in identifiers.items()
        for value in entries
    }


def _infer_version_type(item_type: object, identifiers: dict[str, list[str]]) -> str:
    joined = " ".join(
        identifiers.get("doi", [])
        + identifiers.get("url", [])
        + identifiers.get("arxiv", [])
    ).casefold()
    if "arxiv" in joined:
        return "preprint"
    if "nber.org/papers" in joined:
        return "working_paper"
    if str(item_type or "").casefold() == "journalarticle":
        return "version_of_record"
    return "unknown"


def _empty_version() -> dict[str, Any]:
    return {
        "title": "",
        "authors": [],
        "version_type": "unknown",
        "version_date": "",
        "item_type": "",
        "journal_or_repository": "",
        "identifiers": {},
        "peer_review_status": "not_established",
        "peer_review_basis": "unknown",
        "integrity_status": "current",
        "access_status": "unknown",
        "landing_url": "",
        "fulltext_url": "",
        "license": "",
        "source_lanes": [],
        "evidence": [],
        "provenance": [],
        "relations": [],
        "flags": [],
    }


def _version_from_zotero(item: dict[str, Any]) -> dict[str, Any]:
    version = _empty_version()
    identifiers = _identifier_map(
        {
            "doi": item.get("DOI"),
            "zotero_key": item.get("key"),
            "url": item.get("url"),
        }
    )
    version.update(
        {
            "title": str(item.get("title") or "").strip(),
            "authors": _creator_names(item),
            "version_type": _infer_version_type(item.get("itemType"), identifiers),
            "version_date": str(item.get("date") or "").strip(),
            "item_type": str(item.get("itemType") or "").strip(),
            "journal_or_repository": str(
                item.get("publicationTitle")
                or item.get("repository")
                or item.get("publisher")
                or ""
            ).strip(),
            "identifiers": identifiers,
            "landing_url": _normalise_url(item.get("url")),
            "provenance": [
                {
                    "source": "zotero_export",
                    "reference": str(item.get("key") or ""),
                }
            ],
        }
    )
    if item.get("_metadata_correction"):
        version["provenance"].append({"source": CORRECTIONS_PATH, "reference": item["key"],
                                      "ai_metadata_correction": item["_metadata_correction"]})
    return version


def _version_from_round2(work: dict[str, Any]) -> dict[str, Any]:
    version = _empty_version()
    identifiers = _identifier_map({"doi": work.get("doi")})
    version.update(
        {
            "title": str(work.get("title") or "").strip(),
            "authors": [str(author).strip() for author in work.get("authors", []) if author],
            "version_type": _infer_version_type("", identifiers),
            "version_date": str(work.get("year") or ""),
            "identifiers": identifiers,
            "source_lanes": sorted(set(work.get("lanes", []))),
            "provenance": [
                {
                    "source": "round2_intake",
                    "reference": work["work_id"],
                }
            ],
        }
    )
    return version


def _version_from_agent(
    raw: dict[str, Any], role: str, input_work_id: str
) -> dict[str, Any]:
    version = _empty_version()
    identifiers = _identifier_map(raw.get("identifiers", {}))
    landing_url = _normalise_url(raw.get("landing_url"))
    fulltext_url = _normalise_url(raw.get("fulltext_url"))
    if landing_url:
        identifiers.setdefault("url", [])
        if landing_url not in identifiers["url"]:
            identifiers["url"].append(landing_url)
            identifiers["url"].sort()
    raw_version_type = str(raw.get("version_type") or "unknown")
    version_type = VERSION_TYPE_ALIASES.get(raw_version_type, raw_version_type)
    if version_type in NON_RECORD_VERSION_TYPES and not identifiers.get("url"):
        for evidence in raw.get("evidence", []):
            evidence_url = _normalise_url(evidence.get("url"))
            source_type = str(evidence.get("source_type") or "").casefold()
            if evidence_url and any(
                token in source_type
                for token in ("proof", "manuscript", "repository", "preprint")
            ):
                identifiers.setdefault("url", []).append(evidence_url)
                break
    input_doi = (
        normalise_doi(input_work_id.removeprefix("doi:"))
        if input_work_id.startswith("doi:")
        else ""
    )
    related_work_dois: list[str] = []
    if (
        version_type in NON_RECORD_VERSION_TYPES
        and (identifiers.get("arxiv") or identifiers.get("url"))
        and input_doi
        and input_doi in identifiers.get("doi", [])
    ):
        # Repositories frequently repeat the published article DOI on an
        # accepted manuscript. The DOI identifies the Version of Record in
        # this registry; the repository URL identifies the manuscript.
        identifiers["doi"].remove(input_doi)
        if not identifiers["doi"]:
            del identifiers["doi"]
        related_work_dois.append(input_doi)
    version.update(
        {
            "title": str(raw.get("title") or raw.get("canonical_title") or "").strip(),
            "authors": [str(author).strip() for author in raw.get("authors", []) if author],
            "version_type": version_type,
            "version_date": str(
                raw.get("publication_date")
                or raw.get("issued_date")
                or raw.get("version_date")
                or ""
            ).strip(),
            "item_type": str(raw.get("item_type") or "").strip(),
            "journal_or_repository": str(
                raw.get("journal_or_repository") or raw.get("repository") or ""
            ).strip(),
            "identifiers": identifiers,
            "peer_review_status": str(
                raw.get("peer_review_status") or "not_established"
            ),
            "peer_review_basis": str(raw.get("peer_review_basis") or "unknown"),
            "integrity_status": str(raw.get("integrity_status") or "current"),
            "access_status": str(raw.get("access_status") or "unknown"),
            "landing_url": landing_url,
            "fulltext_url": fulltext_url,
            "license": str(raw.get("license") or "").strip(),
            "evidence": raw.get("evidence", []) if isinstance(raw.get("evidence"), list) else [],
            "provenance": [
                {
                    "source": f"round2_agent_{role}",
                    "reference": input_work_id,
                }
            ],
            "flags": [str(flag) for flag in raw.get("flags", [])],
        }
    )
    for doi in related_work_dois:
        version["flags"].append(f"related_work_doi:{doi}")
    if raw_version_type != version_type:
        version["flags"].append(f"normalised_version_type:{raw_version_type}")
    return version


def _merge_list(target: list[Any], source: Iterable[Any]) -> None:
    for item in source:
        if item not in target:
            target.append(item)


def _merge_version(target: dict[str, Any], source: dict[str, Any]) -> None:
    for kind, entries in source.get("identifiers", {}).items():
        target["identifiers"].setdefault(kind, [])
        _merge_list(target["identifiers"][kind], entries)
        target["identifiers"][kind].sort()
    _merge_list(target["authors"], source.get("authors", []))
    for field in VERSION_FIELDS:
        incoming = source.get(field)
        current = target.get(field)
        default = field in {"version_type", "integrity_status", "access_status"} and current in {
            "unknown",
            "current",
        }
        default = default or (
            field in {"peer_review_status", "peer_review_basis"}
            and current in {"not_established", "unknown"}
        )
        if incoming and (not current or default):
            target[field] = incoming
        elif incoming and current and incoming != current and field in {
            "version_type",
            "peer_review_status",
            "integrity_status",
        }:
            _merge_list(
                target["flags"],
                [f"{field}_conflict:{current}|{incoming}"],
            )
    for field in ("source_lanes", "evidence", "provenance", "flags"):
        _merge_list(target[field], source.get(field, []))


def _version_key(version: dict[str, Any]) -> str:
    identifiers = version.get("identifiers", {})
    order = ("doi", "arxiv", "url", "zotero_key")
    if version.get("version_type") in NON_RECORD_VERSION_TYPES:
        order = ("arxiv", "url", "doi", "zotero_key")
    for kind in order:
        entries = identifiers.get(kind, [])
        if entries:
            return f"{kind}:{entries[0].casefold()}"
    return "meta:" + "|".join(
        (
            version.get("version_type", "unknown"),
            normalise_title(version.get("title")),
            _year(version.get("version_date")),
        )
    )


def _zotero_group_key(version: dict[str, Any]) -> str:
    identifiers = version["identifiers"]
    if identifiers.get("doi"):
        return f"doi:{identifiers['doi'][0]}"
    title = normalise_title(version.get("title"))
    author = _first_author_key(version.get("authors", []))
    year = _year(version.get("version_date"))
    if title and author and year:
        return f"meta:{title}|{author}|{year}"
    return f"zotero:{identifiers['zotero_key'][0]}"


def _previous_maps(previous: dict[str, Any] | None) -> dict[str, Any]:
    maps: dict[str, Any] = {
        "record": {},
        "legacy": {},
        "identifier_work": {},
        "identifier_version": {},
    }
    if not previous:
        return maps
    maps["record"] = previous.get("record_index", {})
    maps["legacy"] = previous.get("legacy_work_id_index", {})
    for token, reference in previous.get("identifier_index", {}).items():
        maps["identifier_work"][token] = reference["work_id"]
        maps["identifier_version"][token] = reference["version_id"]
    return maps


def _stable_work_id(
    aliases: set[str], versions: list[dict[str, Any]], previous: dict[str, Any]
) -> str:
    candidates = {
        previous["legacy"][alias]
        for alias in aliases
        if alias in previous["legacy"]
    }
    for version in versions:
        for key in version.get("identifiers", {}).get("zotero_key", []):
            if key in previous["record"]:
                candidates.add(previous["record"][key]["work_id"])
        for token in _identifier_tokens(version.get("identifiers", {})):
            if token in previous["identifier_work"]:
                candidates.add(previous["identifier_work"][token])
    if len(candidates) > 1:
        raise ValueError(f"new relation would merge established works: {sorted(candidates)}")
    if candidates:
        return next(iter(candidates))
    seeds = sorted(
        set(aliases)
        | {
            token
            for version in versions
            for token in _identifier_tokens(version.get("identifiers", {}))
        }
    )
    if not seeds:
        seeds = sorted(normalise_title(version.get("title")) for version in versions)
    return f"work:{uuid.uuid5(WORK_NAMESPACE, chr(10).join(seeds))}"


def _stable_version_id(
    version: dict[str, Any], previous: dict[str, Any]
) -> str:
    candidates = {
        previous["identifier_version"][token]
        for token in _identifier_tokens(version.get("identifiers", {}))
        if token in previous["identifier_version"]
    }
    for key in version.get("identifiers", {}).get("zotero_key", []):
        if key in previous["record"]:
            candidates.add(previous["record"][key]["version_id"])
    if len(candidates) > 1:
        raise ValueError(f"version identifiers collide: {sorted(candidates)}")
    if candidates:
        return next(iter(candidates))
    seed = "|".join(
        (
            _version_key(version),
            normalise_title(version.get("title")),
            str(version.get("version_date") or ""),
        )
    )
    return f"version:{uuid.uuid5(VERSION_NAMESPACE, seed)}"


def _split_version_id(version: dict[str, Any]) -> str:
    """Mint an ID when a formerly conflated version is split during migration."""
    seed = "|".join(
        (
            "split",
            _version_key(version),
            str(version.get("version_type") or "unknown"),
            normalise_title(version.get("title")),
            str(version.get("version_date") or ""),
        )
    )
    return f"version:{uuid.uuid5(VERSION_NAMESPACE, seed)}"


def _agent_payloads() -> tuple[dict[str, dict[str, Any]], list[Path]]:
    payloads: dict[str, dict[str, Any]] = {}
    inputs: list[Path] = []
    for role, path in AGENT_REVIEW_FILES.items():
        if not path.exists():
            continue
        data = _read_json(path)
        payloads[role] = {
            str(record["input_work_id"]): record for record in data.get("records", [])
        }
        inputs.append(path)
    return payloads, inputs


def _source_fingerprint(paths: Iterable[Path]) -> str:
    digest = hashlib.sha256()
    for path in sorted(paths, key=lambda item: item.as_posix()):
        digest.update(path.relative_to(REPO).as_posix().encode("utf-8"))
        digest.update(canonical_file_bytes(path))
    return f"sha256:{digest.hexdigest()}"


def apply_source_bindings(repo: Path, registry: dict, contract: dict) -> list[Path]:
    """Bind reviewed sources without moving record IDs.

    Manifest 0.2 adds ``binding_mode: existing_version`` with a
    ``version_identity`` (title and DOI or revision-pinned arXiv ID). It permits
    no ``version`` metadata and changes only source_index. The index retains
    both reviewed identities for validation by consumers of the built registry.
    The original manuscript-addition contract remains compatible with 0.1/0.2.
    """
    from copy import deepcopy
    from src.assess.artifact_verification import artifact_hash, safe_path

    manifest_path = repo / SOURCE_BINDINGS_PATH
    if not manifest_path.is_file():
        return []
    manifest = _read_json(manifest_path)
    if manifest.get("schema") not in {"femprompt-source-version-bindings/0.1", "femprompt-source-version-bindings/0.2"} or not isinstance(manifest.get("records"), dict):
        raise ValueError("Unsupported source-version binding manifest")
    inputs = [manifest_path]
    registry["source_index"] = {}
    all_versions = {version["version_id"] for work in registry["works"] for version in work["versions"]}
    for record_id, entry in sorted(manifest["records"].items()):
        if not isinstance(entry, dict):
            raise ValueError(f"{record_id}: source binding entry must be an object")
        for field in ("agent_id", "model", "reviewed_at", "reason"):
            if not isinstance(entry.get(field), str) or not entry[field].strip():
                raise ValueError(f"{record_id}: source binding lacks {field}")
        if datetime.fromisoformat(entry["reviewed_at"].replace("Z", "+00:00")).tzinfo is None:
            raise ValueError(f"{record_id}: source binding timestamp needs a timezone")
        canonical = registry["record_index"].get(record_id, {})
        binding = deepcopy(entry.get("binding", {}))
        work = next((item for item in registry["works"] if item["work_id"] == canonical.get("work_id")), None)
        if not work or binding.get("work_id") != work["work_id"] or binding.get("bibliographic_version_id") != canonical.get("version_id"):
            raise ValueError(f"{record_id}: source manifest targets another bibliographic identity")
        bibliographic = next(item for item in work["versions"] if item["version_id"] == canonical["version_id"])
        mode = entry.get("binding_mode", "accepted_manuscript")
        if mode not in {"accepted_manuscript", "existing_version"}:
            raise ValueError(f"{record_id}: unsupported source binding mode")
        evidence = entry.get("evidence")
        if not isinstance(evidence, list) or not evidence:
            raise ValueError(f"{record_id}: source binding lacks identity evidence")
        for source in evidence:
            if not isinstance(source, dict) or not isinstance(source.get("locator"), str) or not source["locator"].strip():
                raise ValueError(f"{record_id}: stale or incomplete source identity evidence")
            if artifact_hash(repo, source.get("source_path", "")) != source.get("sha256"):
                raise ValueError(f"{record_id}: stale or incomplete source identity evidence")
            path = safe_path(repo, source["source_path"].partition("#")[0])
            inputs.append(path)
            if source.get("quote") and (not isinstance(source["quote"], str) or " ".join(source["quote"].split()) not in " ".join(path.read_text(encoding="utf-8").split())):
                raise ValueError(f"{record_id}: source identity quotation does not resolve")

        if mode == "existing_version":
            if manifest["schema"] != "femprompt-source-version-bindings/0.2":
                raise ValueError(f"{record_id}: existing version bindings require manifest 0.2")
            allowed_entry = {"binding_mode", "binding", "bibliographic_identity", "version_identity", "agent_id", "model", "reviewed_at", "reason", "evidence"}
            allowed_binding = {"record_id", "work_id", "bibliographic_version_id", "source_version_id", "source_version_type", "preferred_version_id", "is_preferred_version", "source_path", "source_sha256"}
            if set(entry) - allowed_entry or set(binding) != allowed_binding:
                raise ValueError(f"{record_id}: existing version binding cannot supply new version metadata")
            binding.update(binding_mode=mode, bibliographic_identity=deepcopy(entry.get("bibliographic_identity")),
                           version_identity=deepcopy(entry.get("version_identity")))
            # Validate before changing even source_index. In particular the source
            # must be the record's already registered exact bibliographic version.
            staged = {**registry, "source_index": {**registry["source_index"], record_id: binding}}
            source_binding_for_record(staged, record_id, repo)
            quotes = " ".join(source.get("quote") or "" for source in evidence
                              if source.get("source_path") == binding["source_path"]
                              and source.get("sha256") == binding["source_sha256"])
            identity = binding["version_identity"]
            if " " + normalise_title(identity["title"]) + " " not in " " + normalise_title(quotes) + " ":
                raise ValueError(f"{record_id}: bound source evidence must quote its registered title")
            identifier = normalise_arxiv(identity["arxiv"]) if identity.get("arxiv") else normalise_doi(identity["doi"])
            if not re.search(r"(?<![\w.])" + re.escape(identifier) + r"(?![\w.])", quotes, re.IGNORECASE):
                raise ValueError(f"{record_id}: bound source evidence must quote its exact version identifier")
            if identity.get("arxiv"):
                for source in evidence:
                    source_url = str(source.get("source_url") or "")
                    source_arxiv = normalise_arxiv(source_url) or normalise_arxiv(normalise_doi(source_url))
                    if re.match(r"https?://(?:www\.)?arxiv\.org/", source_url, re.IGNORECASE) and not source_arxiv:
                        raise ValueError(f"{record_id}: malformed arXiv evidence URL")
                    if source_arxiv and source_arxiv != identifier:
                        raise ValueError(f"{record_id}: source evidence URL differs from the exact arXiv revision")
            registry["source_index"][record_id] = binding
            inputs.append(repo / binding["source_path"])
            continue

        expected = entry.get("bibliographic_identity", {})
        if not expected.get("title") or normalise_title(expected["title"]) != normalise_title(bibliographic.get("title")) or normalise_doi(expected.get("doi")) not in bibliographic.get("identifiers", {}).get("doi", []):
            raise ValueError(f"{record_id}: source manifest bibliographic metadata is stale or uncorrected")
        version = deepcopy(entry.get("version", {}))
        if version.get("version_type") != "accepted_manuscript" or version.get("version_id") != binding.get("source_version_id") or version["version_id"] in all_versions:
            raise ValueError(f"{record_id}: invalid or duplicate manuscript version")
        identifiers = version.get("identifiers", {})
        if set(identifiers) != {"url"} or not identifiers["url"] or normalise_title(version.get("title")) != normalise_title(bibliographic.get("title")):
            raise ValueError(f"{record_id}: manuscript must have a distinct repository identity")
        if version.get("relations") != [{"type": "isVersionOf", "target_version_id": canonical["version_id"]}]:
            raise ValueError(f"{record_id}: manuscript relation must target its bibliographic version")
        version.setdefault("provenance", []).append({"source": SOURCE_BINDINGS_PATH, "reference": f"#/records/{record_id}", "agent_id": entry["agent_id"], "model": entry["model"], "reviewed_at": entry["reviewed_at"]})
        work["versions"].append(version)
        work["versions"].sort(key=lambda item: item["version_id"])
        all_versions.add(version["version_id"])
        latest, preferred = select_version_ids(work["versions"], contract)
        if preferred != work["preferred_version_id"]:
            raise ValueError(f"{record_id}: source-only addition changed preferred bibliography")
        work["latest_version_id"] = latest
        bibliographic["relations"].append({"type": "hasVersion", "target_version_id": version["version_id"]})
        bibliographic["relations"].sort(key=lambda item: (item["type"], item["target_version_id"]))
        for token in _identifier_tokens(identifiers):
            if token in registry["identifier_index"] or token in registry["ambiguous_identifiers"]:
                raise ValueError(f"{record_id}: source repository identifier collision")
            registry["identifier_index"][token] = {"work_id": work["work_id"], "version_id": version["version_id"]}
        registry["source_index"][record_id] = binding
        source_binding_for_record(registry, record_id, repo)
        inputs.append(repo / binding["source_path"])
    return inputs


def build_registry(repo: Path = REPO) -> dict[str, Any]:
    """Return the complete registry while reusing any established local IDs."""
    zotero_path = repo / "corpus" / "zotero_export.json"
    round2_path = repo / "generated" / "round2-intake.json"
    corpus_path = repo / "docs" / "data" / "research_vault_v2.json"
    registry_path = repo / "corpus" / "work_version_registry.json"
    contract = load_contract(repo / "docs" / "data" / "work_version_contract.json")
    previous_registry = _read_json(registry_path) if registry_path.exists() else None
    if previous_registry:
        validate_registry(previous_registry, contract)
    previous = _previous_maps(previous_registry)
    zotero_items = apply_metadata_corrections(repo, _read_json(zotero_path))
    round2 = _read_json(round2_path)
    previous_works = {
        work["work_id"]: work for work in (previous_registry or {}).get("works", [])
    }
    legacy_by_record: dict[str, str] = {}
    if not previous_registry:
        corpus = _read_json(corpus_path)
        legacy_by_record = {
            paper["id"]: paper.get("legacy_work_id") or paper.get("work_id")
            for paper in corpus.get("papers", [])
            if paper.get("id")
            and (paper.get("legacy_work_id") or paper.get("work_id"))
        }

    buckets: dict[str, dict[str, Any]] = {}
    zotero_bucket: dict[str, str] = {}
    doi_bucket: dict[str, str] = {}
    for item in zotero_items:
        version = _version_from_zotero(item)
        key = str(item.get("key") or "")
        legacy_work_id = legacy_by_record.get(key)
        previous_reference = previous["record"].get(key)
        if previous_reference:
            bucket_id = f"previous:{previous_reference['work_id']}"
        elif legacy_work_id and not legacy_work_id.startswith("record:"):
            bucket_id = f"legacy:{legacy_work_id}"
        else:
            bucket_id = _zotero_group_key(version)
        bucket = buckets.setdefault(
            bucket_id,
            {
                "versions": [],
                "legacy_work_ids": set(),
                "candidate_ids": set(),
                "source_lanes": set(),
                "statuses": {},
                "flags": [],
                "raw_relations": [],
            },
        )
        bucket["versions"].append(version)
        if key:
            zotero_bucket[key] = bucket_id
            if previous_reference:
                previous_work = previous_works[previous_reference["work_id"]]
                bucket["legacy_work_ids"].update(
                    previous_work.get("legacy_work_ids", [])
                )
                # An explicitly disproven DOI is historical metadata, not an
                # alias of the corrected work. Keep it only in the audit.
                for change in item.get("_metadata_correction", {}).get("changes", []):
                    if change.get("before") != change.get("after"):
                        if change.get("field") == "DOI":
                            bucket["legacy_work_ids"].discard(f"doi:{normalise_doi(change.get('before'))}")
                        elif change.get("field") == "url":
                            bucket["legacy_work_ids"].discard(f"url:{_normalise_url(change.get('before'))}")
            else:
                bucket["legacy_work_ids"].add(
                    legacy_work_id
                    or (
                        f"doi:{version['identifiers']['doi'][0]}"
                        if version["identifiers"].get("doi")
                        else f"record:{key}"
                    )
                )
        for doi in version["identifiers"].get("doi", []):
            doi_bucket[doi] = bucket_id

    candidate_bucket: dict[str, str] = {}
    for work in round2.get("works", []):
        input_work_id = work["work_id"]
        existing = [
            zotero_bucket[key]
            for key in work.get("existing_corpus_candidates", [])
            if key in zotero_bucket
        ]
        round2_doi = normalise_doi(work.get("doi"))
        if round2_doi and round2_doi in doi_bucket:
            existing.append(doi_bucket[round2_doi])
        bucket_id = existing[0] if existing else f"round2:{input_work_id}"
        bucket = buckets.setdefault(
            bucket_id,
            {
                "versions": [],
                "legacy_work_ids": set(),
                "candidate_ids": set(),
                "source_lanes": set(),
                "statuses": {},
                "flags": [],
                "raw_relations": [],
            },
        )
        bucket["versions"].append(_version_from_round2(work))
        bucket["legacy_work_ids"].add(input_work_id)
        bucket["candidate_ids"].add(input_work_id)
        bucket["source_lanes"].update(work.get("lanes", []))
        if len(set(existing)) > 1:
            bucket["flags"].append("multiple_existing_corpus_matches")
        candidate_bucket[input_work_id] = bucket_id

    agent_payloads, agent_paths = _agent_payloads()
    for role, records in agent_payloads.items():
        for input_work_id, record in records.items():
            bucket_id = candidate_bucket.get(input_work_id)
            if not bucket_id:
                continue
            bucket = buckets[bucket_id]
            status_key = {
                "identity": "identity_status",
                "metadata": "metadata_status",
                "source": "source_status",
            }[role]
            bucket["statuses"][role] = str(record.get(status_key) or "unreviewed")
            bucket["flags"].extend(str(flag) for flag in record.get("flags", []))
            for version_raw in record.get("versions", []):
                bucket["versions"].append(
                    _version_from_agent(version_raw, role, input_work_id)
                )
            if role == "metadata" and not record.get("versions"):
                bucket["versions"].append(
                    _version_from_agent(record, role, input_work_id)
                )
            if role == "identity":
                bucket["raw_relations"].extend(record.get("relations", []))
                for key in record.get("matched_existing_keys", []):
                    other_id = zotero_bucket.get(str(key))
                    if other_id and other_id != bucket_id:
                        bucket["flags"].append(
                            f"agent_existing_match_requires_merge:{key}"
                        )

    works: list[dict[str, Any]] = []
    record_index: dict[str, dict[str, str]] = {}
    candidate_index: dict[str, dict[str, str]] = {}
    identifier_index: dict[str, dict[str, str]] = {}
    ambiguous_identifiers: dict[str, list[dict[str, str]]] = {}
    legacy_index: dict[str, str] = {}

    for bucket_id, bucket in sorted(buckets.items()):
        merged_by_key: dict[str, dict[str, Any]] = {}
        for version in bucket["versions"]:
            key = _version_key(version)
            if key in merged_by_key:
                _merge_version(merged_by_key[key], version)
            else:
                merged_by_key[key] = version
        versions = list(merged_by_key.values())
        work_id = _stable_work_id(bucket["legacy_work_ids"], versions, previous)
        assigned_version_ids: set[str] = set()
        for version in versions:
            version_id = _stable_version_id(version, previous)
            if version_id in assigned_version_ids:
                version_id = _split_version_id(version)
                version["flags"].append("migration_split_from_conflated_version")
            if version_id in assigned_version_ids:
                raise ValueError(f"could not mint a unique version ID for {bucket_id}")
            version["version_id"] = version_id
            assigned_version_ids.add(version_id)
            version["source_lanes"] = sorted(set(version["source_lanes"]))
            version["flags"] = sorted(set(version["flags"]))
            version["provenance"] = sorted(
                version["provenance"],
                key=lambda item: (item.get("source", ""), item.get("reference", "")),
            )
            version["evidence"] = sorted(
                version["evidence"],
                key=lambda item: (
                    str(item.get("url", "")),
                    str(item.get("supports", "")),
                ),
            )

        latest_id, preferred_id = select_version_ids(versions, contract)
        preferred_version = next(
            version for version in versions if version["version_id"] == preferred_id
        )
        for version in versions:
            if version["version_id"] == preferred_id:
                continue
            forward_type = (
                "isPreprintOf"
                if version.get("version_type") == "preprint"
                else "isVersionOf"
            )
            reverse_type = (
                "hasPreprint"
                if version.get("version_type") == "preprint"
                else "hasVersion"
            )
            version["relations"] = [
                {"type": forward_type, "target_version_id": preferred_id}
            ]
            preferred_version["relations"].append(
                {
                    "type": reverse_type,
                    "target_version_id": version["version_id"],
                }
            )
        preferred_version["relations"] = sorted(
            preferred_version["relations"],
            key=lambda relation: (
                relation["type"], relation["target_version_id"]
            ),
        )
        preferred = next(
            version for version in versions if version["version_id"] == preferred_id
        )
        work = {
            "work_id": work_id,
            "canonical_title": preferred.get("title")
            or next((version.get("title") for version in versions if version.get("title")), ""),
            "identity_status": (
                "curated"
                if any(version["identifiers"].get("zotero_key") for version in versions)
                else bucket["statuses"].get("identity", "identified")
            ),
            "review_status": {
                "identity": bucket["statuses"].get("identity", "unreviewed"),
                "metadata": bucket["statuses"].get("metadata", "unreviewed"),
                "source": bucket["statuses"].get("source", "unreviewed"),
            },
            "legacy_work_ids": sorted(bucket["legacy_work_ids"]),
            "source_lanes": sorted(bucket["source_lanes"]),
            "latest_version_id": latest_id,
            "preferred_version_id": preferred_id,
            "versions": sorted(versions, key=lambda item: item["version_id"]),
            "flags": sorted(set(bucket["flags"])),
        }
        works.append(work)
        for alias in work["legacy_work_ids"]:
            if alias in legacy_index and legacy_index[alias] != work_id:
                raise ValueError(f"legacy work alias collision: {alias}")
            legacy_index[alias] = work_id
        for candidate_id in bucket["candidate_ids"]:
            candidate_index[candidate_id] = {
                "work_id": work_id,
                "preferred_version_id": preferred_id,
            }
        for version in versions:
            reference = {"work_id": work_id, "version_id": version["version_id"]}
            for key in version["identifiers"].get("zotero_key", []):
                record_index[key] = reference
            for token in _identifier_tokens(version["identifiers"]):
                if token in ambiguous_identifiers:
                    if reference not in ambiguous_identifiers[token]:
                        ambiguous_identifiers[token].append(reference)
                    continue
                previous_reference = identifier_index.get(token)
                if previous_reference and previous_reference != reference:
                    if token.startswith("doi:") or token.startswith("arxiv:"):
                        raise ValueError(f"strong external identifier collision: {token}")
                    ambiguous_identifiers[token] = [previous_reference, reference]
                    del identifier_index[token]
                    continue
                identifier_index[token] = reference

    inputs = [
        zotero_path,
        round2_path,
        repo / "docs" / "data" / "work_version_contract.json",
    ]
    if not previous_registry:
        inputs.append(corpus_path)
    inputs.extend(path for path in agent_paths if path.is_relative_to(repo))
    if (repo / CORRECTIONS_PATH).is_file():
        inputs.append(repo / CORRECTIONS_PATH)
        inputs.extend(repo / evidence["source_path"].partition("#")[0]
                      for item in zotero_items if item.get("_metadata_correction")
                      for evidence in item["_metadata_correction"]["evidence"])
        inputs = list(set(inputs))
    registry = {
        "schema": REGISTRY_SCHEMA,
        "source_fingerprint": _source_fingerprint(inputs),
        "sources": [
            {
                "path": path.relative_to(repo).as_posix(),
                "sha256": _sha256(path),
            }
            for path in sorted(inputs, key=lambda item: item.as_posix())
        ],
        "counts": {
            "works": len(works),
            "versions": sum(len(work["versions"]) for work in works),
            "zotero_records": len(record_index),
            "round2_candidates": len(candidate_index),
            "works_with_multiple_versions": sum(len(work["versions"]) > 1 for work in works),
            "works_with_flags": sum(bool(work["flags"]) for work in works),
            "ambiguous_external_identifiers": len(ambiguous_identifiers),
        },
        "works": sorted(works, key=lambda item: item["work_id"]),
        "record_index": dict(sorted(record_index.items())),
        "candidate_index": dict(sorted(candidate_index.items())),
        "identifier_index": dict(sorted(identifier_index.items())),
        "ambiguous_identifiers": {
            token: sorted(
                references,
                key=lambda item: (item["work_id"], item["version_id"]),
            )
            for token, references in sorted(ambiguous_identifiers.items())
        },
        "legacy_work_id_index": dict(sorted(legacy_index.items())),
    }
    inputs.extend(apply_source_bindings(repo, registry, contract))
    from src.analysis.historical_resolution import load_source_holds, RESOLUTION_PATH
    source_holds = load_source_holds(repo)
    for work in works:
        if work["work_id"] in source_holds:
            work["source_hold"] = source_holds[work["work_id"]]
    if source_holds:
        inputs.append(repo / RESOLUTION_PATH)
        resolution = _read_json(repo / RESOLUTION_PATH)
        inputs.extend(repo / source["source_path"].partition("#")[0] for entry in resolution.get("work_resolutions", {}).values() if entry.get("work_id") in source_holds for source in entry.get("evidence", []))
    inputs = sorted(set(inputs), key=lambda path: path.as_posix())
    registry["source_fingerprint"] = _source_fingerprint(inputs)
    registry["sources"] = [{"path": path.relative_to(repo).as_posix(), "sha256": _sha256(path)} for path in inputs]
    registry["counts"]["versions"] = sum(len(work["versions"]) for work in works)
    registry["counts"]["works_with_multiple_versions"] = sum(len(work["versions"]) > 1 for work in works)
    registry["counts"]["bound_sources"] = len(registry.get("source_index", {}))
    registry["identifier_index"] = dict(sorted(registry["identifier_index"].items()))
    validate_registry(registry, contract)
    return registry


def _serialise(registry: dict[str, Any]) -> str:
    return json.dumps(registry, ensure_ascii=False, indent=2) + "\n"


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Build the Work-Version registry")
    parser.add_argument("--output", type=Path, default=REGISTRY_PATH)
    parser.add_argument(
        "--check", action="store_true", help="Fail when the registry is stale"
    )
    args = parser.parse_args()
    registry = build_registry()
    rendered = _serialise(registry)
    output = args.output.resolve()
    if args.check:
        if not output.exists() or output.read_text(encoding="utf-8") != rendered:
            sys.exit(f"FEHLER: stale or missing Work-Version registry: {output}")
        print(f"OK: Work-Version registry is current: {output}")
        return
    output.parent.mkdir(parents=True, exist_ok=True)
    temporary = output.with_suffix(f"{output.suffix}.tmp")
    temporary.write_text(rendered, encoding="utf-8", newline="\n")
    temporary.replace(output)
    counts = registry["counts"]
    print(
        "OK: "
        f"{counts['works']} works, {counts['versions']} versions, "
        f"{counts['round2_candidates']} round-two candidates"
    )


if __name__ == "__main__":
    main()
