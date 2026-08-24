#!/usr/bin/env python3
"""Build the self-contained 2026 Codex Websearch Zotero package.

The builder selects Tier-A candidates, deduplicates them across search lanes,
checks the committed Zotero export, and emits an import RIS plus a bibliographic
audit. Identification priority does not establish a PRISM screening decision.

Usage:
    python -m src.analysis.build_codex_websearch_2026
    python -m src.analysis.build_codex_websearch_2026 --check
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import unicodedata
from copy import deepcopy
from pathlib import Path
from typing import Any

REPO = Path(__file__).resolve().parents[2]
SEARCH_DIR = REPO / "corpus" / "deep-research" / "round2" / "Codex Websearch"
RAW_DIR = SEARCH_DIR / "raw"
PROTOCOL_PATH = SEARCH_DIR / "protocol.md"
ZOTERO_PATH = REPO / "corpus" / "zotero_export.json"
DEFAULT_PACKAGE = SEARCH_DIR / "codex-websearch-2026-package.json"
DEFAULT_RIS = SEARCH_DIR / "codex-websearch-2026-zotero-import.ris"
DEFAULT_AUDIT = SEARCH_DIR / "bibliographic-audit.json"
EXPECTED_SCHEMA = "femprompt-codex-websearch-lane/0.1"
EXPECTED_ENRICHMENT_SCHEMA = "femprompt-source-enrichment/0.1"
CUTOFF_DATE = "2026-08-24"
ZOTERO_GROUP_ID = "6080294"
ZOTERO_LIBRARY_NAME = "FemPrompt_SozArb"


def _read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _normalise_doi(value: Any) -> str | None:
    text = str(value or "").strip().casefold()
    for prefix in ("https://doi.org/", "http://doi.org/", "doi:"):
        if text.startswith(prefix):
            text = text[len(prefix) :]
    return text or None


def _normalise_text(value: Any) -> str:
    text = unicodedata.normalize("NFKD", str(value or "")).casefold()
    return " ".join(re.findall(r"[a-z0-9]+", text))


def _normalise_repository_download_url(value: Any) -> str | None:
    url = str(value or "").strip()
    if not url:
        return None
    parsed_hosts = (
        "discovery.dundee.ac.uk",
        "kclpure.kcl.ac.uk",
        "www.ucviden.dk",
    )
    if any(host in url for host in parsed_hosts):
        url = re.sub(r"/(?:portal/)?files/", "/ws/files/", url, count=1)
    return url


def _candidate_key(candidate: dict[str, Any]) -> str:
    doi = _normalise_doi(candidate.get("doi"))
    if doi:
        return f"doi:{doi}"
    identifiers = candidate.get("other_identifiers") or {}
    if isinstance(identifiers, dict):
        for name in (
            "arxiv",
            "acl_anthology",
            "iclr_proceedings_hash",
            "pmid",
            "isbn",
        ):
            value = str(identifiers.get(name) or "").strip().casefold()
            if value:
                return f"{name}:{value}"
    title = _normalise_text(candidate.get("title"))
    if not title:
        raise ValueError("candidate without a stable identifier or title")
    digest = hashlib.sha256(title.encode("utf-8")).hexdigest()[:16]
    return f"title:{digest}"


def _selected_version_date(candidate: dict[str, Any]) -> str:
    preferred = candidate.get("preferred_version") or {}
    return str(preferred.get("date") or candidate.get("publication_date") or "")


def _valid_2026_date(value: str) -> bool:
    if not re.fullmatch(r"2026(?:-\d{2})?(?:-\d{2})?", value):
        return False
    lower = (
        value
        if len(value) == 10
        else f"{value}-01"
        if len(value) == 7
        else "2026-01-01"
    )
    upper = (
        value
        if len(value) == 10
        else f"{value}-31"
        if len(value) == 7
        else "2026-12-31"
    )
    return lower <= CUTOFF_DATE and upper >= "2026-01-01"


def _completeness_score(candidate: dict[str, Any]) -> tuple[int, int, int]:
    fields = (
        "doi",
        "venue",
        "publication_date",
        "volume_issue_pages",
        "peer_review_evidence",
        "access",
        "preferred_version",
    )
    access = candidate.get("access") or {}
    return (
        sum(bool(candidate.get(field)) for field in fields),
        int(bool(access.get("fulltext_url"))),
        len(candidate.get("source_urls") or []),
    )


def _list_union(left: Any, right: Any) -> list[Any]:
    result: list[Any] = []
    for value in [*(left or []), *(right or [])]:
        marker = json.dumps(value, ensure_ascii=False, sort_keys=True)
        if all(
            json.dumps(existing, ensure_ascii=False, sort_keys=True) != marker
            for existing in result
        ):
            result.append(deepcopy(value))
    return result


def _merge_candidates(
    current: dict[str, Any], incoming: dict[str, Any]
) -> dict[str, Any]:
    preferred, supplement = (
        (incoming, current)
        if _completeness_score(incoming) > _completeness_score(current)
        else (current, incoming)
    )
    merged = deepcopy(preferred)
    for field, value in supplement.items():
        if field.startswith("_"):
            continue
        if not merged.get(field) and value:
            merged[field] = deepcopy(value)
    for field in ("versions", "source_urls", "notes"):
        merged[field] = _list_union(current.get(field), incoming.get(field))
    merged["_source_lanes"] = sorted(
        set(current.get("_source_lanes", [])) | set(incoming.get("_source_lanes", []))
    )
    merged["_duplicate_checks"] = _list_union(
        current.get("_duplicate_checks"), incoming.get("_duplicate_checks")
    )
    merged["_source_records"] = _list_union(
        current.get("_source_records"), incoming.get("_source_records")
    )
    merged["_lane_snapshots"] = _list_union(
        current.get("_lane_snapshots"), incoming.get("_lane_snapshots")
    )
    return merged


def _lane_candidates(
    lane_paths: list[Path],
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    selected: dict[str, dict[str, Any]] = {}
    lane_summaries: list[dict[str, Any]] = []
    for path in lane_paths:
        payload = _read_json(path)
        if payload.get("schema") != EXPECTED_SCHEMA:
            raise ValueError(f"{path}: unexpected schema")
        lane_id = str(payload.get("lane_id") or path.stem)
        candidates = payload.get("candidates")
        if not isinstance(candidates, list):
            raise ValueError(f"{path}: candidates must be a list")
        lane_summaries.append(
            {
                "lane_id": lane_id,
                "path": path,
                "tier_a": sum(item.get("tier") == "A" for item in candidates),
                "tier_b": sum(item.get("tier") == "B" for item in candidates),
                "exclusions": len(payload.get("exclusions") or []),
            }
        )
        for index, raw in enumerate(candidates):
            if not isinstance(raw, dict) or raw.get("tier") != "A":
                continue
            candidate = deepcopy(raw)
            candidate["doi"] = _normalise_doi(candidate.get("doi"))
            selected_date = _selected_version_date(candidate)
            if not _valid_2026_date(selected_date):
                raise ValueError(
                    f"{path}: Tier-A candidate outside 2026 cutoff: "
                    f"{candidate.get('title')} ({selected_date})"
                )
            candidate["_source_lanes"] = [lane_id]
            candidate["_duplicate_checks"] = [candidate.get("duplicate_check") or {}]
            candidate["_source_records"] = [{"lane_id": lane_id, "record_index": index}]
            candidate["_lane_snapshots"] = [
                {
                    "lane_id": lane_id,
                    "title": candidate.get("title"),
                    "authors": candidate.get("authors") or [],
                    "publication_date": candidate.get("publication_date"),
                    "doi": candidate.get("doi"),
                }
            ]
            key = _candidate_key(candidate)
            selected[key] = (
                _merge_candidates(selected[key], candidate)
                if key in selected
                else candidate
            )
    return list(selected.values()), lane_summaries


def _zotero_indexes(
    zotero_items: list[dict[str, Any]],
) -> tuple[dict[str, list[str]], dict[str, list[str]]]:
    by_doi: dict[str, list[str]] = {}
    by_title: dict[str, list[str]] = {}
    for item in zotero_items:
        key = str(item.get("key") or "")
        doi = _normalise_doi(item.get("DOI"))
        title = _normalise_text(item.get("title"))
        if doi:
            by_doi.setdefault(doi, []).append(key)
        if title:
            by_title.setdefault(title, []).append(key)
    return by_doi, by_title


def _candidate_conflicts(candidate: dict[str, Any]) -> list[str]:
    snapshots = candidate.get("_lane_snapshots") or []
    conflicts: list[str] = []
    if len(snapshots) < 2:
        return conflicts
    titles = {
        _normalise_text(record.get("title"))
        for record in snapshots
        if record.get("title")
    }
    authors = {
        tuple(_normalise_text(author) for author in record.get("authors") or [])
        for record in snapshots
        if record.get("authors")
    }
    dates = {
        str(record.get("publication_date") or "")
        for record in snapshots
        if record.get("publication_date")
    }
    dois = {
        _normalise_doi(record.get("doi")) for record in snapshots if record.get("doi")
    }
    if len(titles) > 1:
        conflicts.append("title_differs_between_lanes")
    if len(authors) > 1:
        conflicts.append("authors_differ_between_lanes")
    if len(dates) > 1:
        conflicts.append("publication_date_differs_between_lanes")
    if len(dois) > 1:
        conflicts.append("doi_differs_between_lanes")
    return conflicts


def _records(
    candidates: list[dict[str, Any]],
    zotero_items: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    by_doi, by_title = _zotero_indexes(zotero_items)
    records: list[dict[str, Any]] = []
    for candidate in candidates:
        key = _candidate_key(candidate)
        source_lanes = candidate.pop("_source_lanes")
        duplicate_checks = candidate.pop("_duplicate_checks")
        source_records = candidate.pop("_source_records")
        lane_snapshots = candidate.pop("_lane_snapshots")
        doi = _normalise_doi(candidate.get("doi"))
        title = _normalise_text(candidate.get("title"))
        zotero_keys = sorted(set(by_doi.get(doi or "", []) + by_title.get(title, [])))
        discovery_status = (
            "previously_identified"
            if any(
                str(check.get("status") or "") == "previously_identified"
                for check in duplicate_checks
            )
            else "new_candidate"
        )
        relation_to_existing_work = next(
            (
                check.get("relation_to_existing_work")
                for check in duplicate_checks
                if check.get("relation_to_existing_work")
            ),
            None,
        )
        candidate.update(
            {
                "candidate_id": f"codex-websearch-2026:{key}",
                "selected_version_date": _selected_version_date(candidate),
                "source_lanes": source_lanes,
                "source_records": source_records,
                "lane_snapshots": lane_snapshots,
                "discovery_status": discovery_status,
                "relation_to_existing_work": relation_to_existing_work,
                "zotero_status": (
                    "already_in_committed_export" if zotero_keys else "import_ready"
                ),
                "matched_zotero_keys": zotero_keys,
                "lifecycle_state": "identified",
                "screening_status": "identified_not_screened",
            }
        )
        records.append(candidate)
    return sorted(records, key=lambda item: item["candidate_id"])


def _apply_simple_correction(
    record: dict[str, Any],
    correction: dict[str, Any],
    *,
    preserve_prior_version_metadata: bool = False,
) -> bool:
    field = correction.get("field")
    old_value = correction.get("old_value")
    new_value = correction.get("new_value")
    if field == "publication_date":
        record["publication_date"] = new_value
        preferred = record.get("preferred_version") or {}
        if preferred.get("date") == old_value:
            preferred["date"] = new_value
            record["preferred_version"] = preferred
        for version in record.get("versions") or []:
            if version.get("date") == old_value:
                version["date"] = new_value
        return True
    if field == "volume_issue_pages":
        record["volume_issue_pages"] = new_value
        return True
    if field in {"title", "authors"}:
        if preserve_prior_version_metadata and old_value:
            for version in record.get("versions") or []:
                version.setdefault(field, deepcopy(old_value))
        record[field] = deepcopy(new_value)
        return True
    if field in {"venue", "publication_type"}:
        record[field] = deepcopy(new_value)
        return True
    if field == "doi":
        record["doi"] = _normalise_doi(new_value)
        return True
    if field == "preferred_version.date":
        preferred = record.get("preferred_version") or {}
        preferred["date"] = new_value
        record["preferred_version"] = preferred
        for version in record.get("versions") or []:
            if version.get("date") == old_value:
                version["date"] = new_value
        return True
    if field == "preferred_version.version_type":
        preferred = record.get("preferred_version") or {}
        preferred["version_type"] = new_value
        source_url = (record.get("access") or {}).get("fulltext_url")
        if source_url:
            preferred["fulltext_url"] = source_url
        record["preferred_version"] = preferred
        for version in record.get("versions") or []:
            if version.get("version_type") == old_value:
                version["version_type"] = new_value
                if source_url:
                    version["fulltext_url"] = source_url
        return True
    if field == "version_relation" and record.get("doi"):
        version = {
            "version_type": "version_of_record",
            "date": record.get("publication_date"),
            "identifiers": {"doi": record["doi"]},
            "title": record.get("title"),
            "authors": deepcopy(record.get("authors") or []),
            "landing_url": f"https://doi.org/{record['doi']}",
            "fulltext_url": None,
            "relation": "version_of_record_of_prior_versions",
        }
        record["versions"] = _list_union(record.get("versions"), [version])
        record["preferred_version"] = deepcopy(version)
        return True
    relation_match = re.fullmatch(r"versions\[(.+)]\.relation", str(field or ""))
    if relation_match:
        identifier = relation_match.group(1).casefold()
        matched = False
        for version in record.get("versions") or []:
            identifiers = [
                str(version.get("identifier") or ""),
                *[
                    f"{name}:{value}"
                    for name, value in (version.get("identifiers") or {}).items()
                ],
            ]
            if identifier in {value.casefold() for value in identifiers}:
                version["relation"] = (
                    "related_antecedent_work_same_work_not_established"
                )
                matched = True
        return matched
    if field == "correction_relation":
        doi_match = re.search(r"10\.\d{4,9}/\S+", str(new_value or ""))
        relation = {
            "description": new_value,
            "doi": doi_match.group(0) if doi_match else None,
            "evidence_url": correction.get("evidence_url"),
            "basis": correction.get("basis"),
        }
        record["correction_relations"] = _list_union(
            record.get("correction_relations"), [relation]
        )
        return True
    return False


def _apply_enrichments(
    records: list[dict[str, Any]], search_dir: Path
) -> tuple[list[dict[str, Any]], list[Path], list[dict[str, Any]]]:
    enrichment_paths = sorted((search_dir / "enrichment").glob("part-*.json"))
    if len(enrichment_paths) != 3:
        raise ValueError(
            f"expected three source-enrichment partitions, found {len(enrichment_paths)}"
        )
    sorted_ids = [record["candidate_id"] for record in records]
    expected_partitions = {
        "A": sorted_ids[:20],
        "B": sorted_ids[20:39],
        "C": sorted_ids[39:],
    }
    by_id = {record["candidate_id"]: record for record in records}
    summaries: list[dict[str, Any]] = []
    seen_ids: list[str] = []
    for path in enrichment_paths:
        payload = _read_json(path)
        if payload.get("schema") != EXPECTED_ENRICHMENT_SCHEMA:
            raise ValueError(f"{path}: unexpected enrichment schema")
        partition = str(payload.get("partition") or "")
        candidate_ids = payload.get("candidate_ids") or []
        enrichment_records = payload.get("records") or []
        if partition not in expected_partitions:
            raise ValueError(f"{path}: unexpected partition {partition!r}")
        if candidate_ids != expected_partitions[partition]:
            raise ValueError(f"{path}: candidate partition does not match package")
        if [item.get("candidate_id") for item in enrichment_records] != candidate_ids:
            raise ValueError(f"{path}: enrichment records do not match candidate_ids")
        located = 0
        applied_corrections = 0
        pending_corrections = 0
        for enrichment in enrichment_records:
            candidate_id = enrichment["candidate_id"]
            record = by_id[candidate_id]
            if _normalise_text(enrichment.get("title")) != _normalise_text(
                record.get("title")
            ):
                raise ValueError(f"{path}: title mismatch for {candidate_id}")
            checked_urls = enrichment.get("checked_urls") or []
            record["source_urls"] = _list_union(record.get("source_urls"), checked_urls)
            fulltext = deepcopy(enrichment.get("fulltext") or {})
            fulltext["url"] = _normalise_repository_download_url(fulltext.get("url"))
            fulltext_status = fulltext.get("status")
            access = deepcopy(record.get("access") or {})
            preferred = deepcopy(record.get("preferred_version") or {})
            if fulltext_status in {"located_open_access", "located_repository_copy"}:
                located += 1
                access.update(
                    {
                        "status": "open_access",
                        "fulltext_url": fulltext.get("url"),
                        "license": fulltext.get("license"),
                        "basis": fulltext.get("basis"),
                        "evidence_url": fulltext.get("evidence_url"),
                    }
                )
                if fulltext_status == "located_open_access":
                    preferred["fulltext_url"] = fulltext.get("url")
            elif fulltext_status in {
                "publisher_landing_only",
                "restricted",
                "not_found",
            }:
                access.update(
                    {
                        "status": (
                            "restricted"
                            if fulltext_status == "restricted"
                            else "publisher_access"
                            if fulltext_status == "publisher_landing_only"
                            else "restricted_or_not_verified"
                        ),
                        "fulltext_url": None,
                        "license": fulltext.get("license"),
                        "basis": fulltext.get("basis"),
                        "evidence_url": fulltext.get("evidence_url"),
                    }
                )
                preferred.pop("fulltext_url", None)
            else:
                raise ValueError(
                    f"{path}: unexpected fulltext status for {candidate_id}"
                )
            record["access"] = access
            record["preferred_version"] = preferred
            peer_review = enrichment.get("peer_review") or {}
            record["peer_review_evidence"] = deepcopy(peer_review)
            pending: list[dict[str, Any]] = []
            corrections = enrichment.get("metadata_corrections") or []
            preserve_prior_version_metadata = any(
                correction.get("field") == "version_relation"
                for correction in corrections
            )
            for correction in corrections:
                if _apply_simple_correction(
                    record,
                    correction,
                    preserve_prior_version_metadata=preserve_prior_version_metadata,
                ):
                    applied_corrections += 1
                else:
                    pending.append(deepcopy(correction))
                    pending_corrections += 1
            record["selected_version_date"] = _selected_version_date(record)
            if not _valid_2026_date(record["selected_version_date"]):
                raise ValueError(
                    f"{path}: correction moved selected Version outside cutoff for "
                    f"{candidate_id}"
                )
            record["source_enrichment"] = {
                "partition": partition,
                "searched_at": payload.get("searched_at"),
                "checked_urls": checked_urls,
                "fulltext": deepcopy(fulltext),
                "peer_review": deepcopy(peer_review),
                "applied_metadata_corrections": [
                    deepcopy(correction)
                    for correction in enrichment.get("metadata_corrections") or []
                    if correction not in pending
                ],
                "pending_zotero_corrections": pending,
                "notes": deepcopy(enrichment.get("notes") or []),
            }
            seen_ids.append(candidate_id)
        summaries.append(
            {
                "partition": partition,
                "records": len(enrichment_records),
                "fulltexts_located": located,
                "metadata_corrections_applied": applied_corrections,
                "metadata_corrections_pending_zotero": pending_corrections,
            }
        )
    if sorted(seen_ids) != sorted_ids:
        raise ValueError("source-enrichment coverage does not partition all candidates")
    return (
        records,
        enrichment_paths,
        sorted(summaries, key=lambda item: item["partition"]),
    )


def _ris_type(record: dict[str, Any]) -> str:
    value = str(record.get("publication_type") or "").casefold()
    if "chapter" in value or "book_section" in value:
        return "CHAP"
    if "conference" in value or "proceedings" in value:
        return "CONF"
    if "preprint" in value or "report" in value:
        return "RPRT"
    if value == "book":
        return "BOOK"
    return "JOUR"


def _landing_url(record: dict[str, Any]) -> str:
    preferred = record.get("preferred_version") or {}
    access = record.get("access") or {}
    return str(
        preferred.get("landing_url")
        or preferred.get("url")
        or access.get("landing_url")
        or next(iter(record.get("source_urls") or []), "")
    )


def _peer_review_status(record: dict[str, Any]) -> str:
    evidence = record.get("peer_review_evidence") or {}
    if isinstance(evidence, dict):
        return str(evidence.get("status") or "not_established")
    return "not_established"


def _ris_text(records: list[dict[str, Any]]) -> str:
    lines: list[str] = []
    for record in records:
        if record["zotero_status"] != "import_ready":
            continue
        lines.append(f"TY  - {_ris_type(record)}")
        lines.append(f"TI  - {record['title']}")
        for author in record.get("authors") or []:
            lines.append(f"AU  - {author}")
        lines.append("PY  - 2026")
        lines.append(f"DA  - {record['selected_version_date']}")
        if record.get("venue"):
            lines.append(f"T2  - {record['venue']}")
        if record.get("doi"):
            lines.append(f"DO  - {record['doi']}")
        url = _landing_url(record)
        if url:
            lines.append(f"UR  - {url}")
        lines.extend(
            [
                "KW  - Codex Websearch",
                "KW  - 2026",
                "KW  - Tier A candidate",
                f"KW  - {record['discovery_status']}",
                f"N1  - FemPrompt-Candidate-ID: {record['candidate_id']}",
                f"N1  - Source-Lanes: {', '.join(record['source_lanes'])}",
                f"N1  - Peer-Review-Status: {_peer_review_status(record)}",
                "N1  - Screening-Status: identified_not_screened",
            ]
        )
        if record.get("relation_to_existing_work"):
            lines.append(
                "N1  - Related-FemPrompt-Work-ID: "
                f"{record['relation_to_existing_work']}"
            )
        lines.extend(["ER  -", ""])
    return "\n".join(lines).rstrip() + ("\n" if lines else "")


def _audit_record(record: dict[str, Any]) -> dict[str, Any]:
    access = record.get("access") or {}
    gaps: list[str] = []
    if not record.get("authors"):
        gaps.append("authors_missing")
    if not record.get("venue"):
        gaps.append("venue_missing")
    if not record.get("doi"):
        gaps.append("doi_not_assigned_or_not_found")
    if _peer_review_status(record) == "not_established":
        gaps.append("item_specific_peer_review_not_established")
    if not access.get("fulltext_url"):
        gaps.append("fulltext_url_not_established")
    stable_identifiers = bool(record.get("doi") or record.get("other_identifiers"))
    if not stable_identifiers:
        gaps.append("external_identifier_missing")
    return {
        "candidate_id": record["candidate_id"],
        "title": record["title"],
        "zotero_status": record["zotero_status"],
        "discovery_status": record["discovery_status"],
        "peer_review_status": _peer_review_status(record),
        "access_status": access.get("status") or "not_established",
        "metadata_gaps": gaps,
        "pending_zotero_corrections": len(
            (record.get("source_enrichment") or {}).get("pending_zotero_corrections")
            or []
        ),
        "blocking_conflicts": _candidate_conflicts(
            {"_lane_snapshots": record.get("lane_snapshots") or []}
        ),
    }


def build_outputs(
    repo: Path = REPO,
) -> tuple[dict[str, Any], str, dict[str, Any]]:
    """Return the package, import RIS, and bibliographic audit."""
    search_dir = repo / "corpus" / "deep-research" / "round2" / "Codex Websearch"
    lane_paths = sorted((search_dir / "raw").glob("lane-*.json"))
    if len(lane_paths) != 3:
        raise ValueError(f"expected three search lanes, found {len(lane_paths)}")
    candidates, lane_summaries = _lane_candidates(lane_paths)
    zotero_path = repo / "corpus" / "zotero_export.json"
    zotero_items = _read_json(zotero_path)
    if not isinstance(zotero_items, list):
        raise ValueError("committed Zotero export must be a JSON list")
    records = _records(candidates, zotero_items)
    records, enrichment_paths, enrichment_summaries = _apply_enrichments(
        records, search_dir
    )
    audit_records = [_audit_record(record) for record in records]
    blocking = sum(bool(item["blocking_conflicts"]) for item in audit_records)
    source_paths = [
        *lane_paths,
        *enrichment_paths,
        search_dir / "protocol.md",
        search_dir / "run-manifest.json",
        zotero_path,
    ]
    sources = [
        {"path": path.relative_to(repo).as_posix(), "sha256": _sha256(path)}
        for path in source_paths
    ]
    counts = {
        "lane_tier_a_rows": sum(item["tier_a"] for item in lane_summaries),
        "distinct_tier_a_candidates": len(records),
        "new_in_codex_websearch": sum(
            record["discovery_status"] == "new_candidate" for record in records
        ),
        "previously_identified": sum(
            record["discovery_status"] == "previously_identified" for record in records
        ),
        "import_ready": sum(
            record["zotero_status"] == "import_ready" for record in records
        ),
        "already_in_committed_zotero_export": sum(
            record["zotero_status"] == "already_in_committed_export"
            for record in records
        ),
        "doi_present": sum(bool(record.get("doi")) for record in records),
        "fulltext_located": sum(
            bool((record.get("access") or {}).get("fulltext_url")) for record in records
        ),
        "blocking_bibliographic_conflicts": blocking,
        "pending_zotero_corrections": sum(
            item["pending_zotero_corrections"] for item in audit_records
        ),
    }
    package = {
        "schema": "femprompt-codex-websearch-2026-package/0.1",
        "cutoff_date": CUTOFF_DATE,
        "year_filter": "2026 only",
        "selection_rule": (
            "Tier A in at least one deep-search lane; selected publication "
            "Version dated 2026-01-01 through 2026-08-24"
        ),
        "authority": (
            "Identification candidate package; Zotero import and Tier A do not "
            "establish PRISM inclusion"
        ),
        "sources": sources,
        "lane_summaries": [
            {key: value for key, value in item.items() if key != "path"}
            for item in lane_summaries
        ],
        "source_enrichment_summaries": enrichment_summaries,
        "counts": counts,
        "zotero_target": {
            "library_name": ZOTERO_LIBRARY_NAME,
            "group_id": ZOTERO_GROUP_ID,
            "import_status": "deferred_until_operator_at_desktop",
        },
        "gate": {
            "status": (
                "ready_for_later_zotero_import"
                if blocking == 0
                else "bibliographic_conflicts_require_review"
            ),
            "required_after_import": [
                "curate_metadata_and_Work-Version_relations_in_Zotero",
                "export_curated_Zotero_library",
                "rebuild_Work-Version_registry",
                "acquire_convert_and_review_preferred_fulltexts",
                "run_governed_PRISM_screening",
            ],
        },
        "records": records,
    }
    audit = {
        "schema": "femprompt-codex-websearch-2026-bibliographic-audit/0.1",
        "cutoff_date": CUTOFF_DATE,
        "sources": sources,
        "counts": {
            **counts,
            "peer_review_status": {
                status: sum(
                    item["peer_review_status"] == status for item in audit_records
                )
                for status in sorted(
                    {item["peer_review_status"] for item in audit_records}
                )
            },
            "access_status": {
                status: sum(item["access_status"] == status for item in audit_records)
                for status in sorted({item["access_status"] for item in audit_records})
            },
        },
        "interpretation": {
            "metadata_gap": (
                "A missing DOI, item-specific peer-review history, or full-text URL "
                "is recorded explicitly and does not by itself invalidate identity."
            ),
            "blocking_conflict": (
                "A conflicting title, authorship, date, or Work-Version identity "
                "withholds the record from unreviewed import."
            ),
        },
        "records": audit_records,
    }
    return package, _ris_text(records), audit


def _serialise(payload: dict[str, Any]) -> str:
    return json.dumps(payload, ensure_ascii=False, indent=2) + "\n"


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Build Codex Websearch 2026 outputs")
    parser.add_argument("--package", type=Path, default=DEFAULT_PACKAGE)
    parser.add_argument("--ris", type=Path, default=DEFAULT_RIS)
    parser.add_argument("--audit", type=Path, default=DEFAULT_AUDIT)
    parser.add_argument(
        "--check", action="store_true", help="Fail when any output is stale"
    )
    args = parser.parse_args()
    package, ris, audit = build_outputs()
    outputs = (
        (args.package.resolve(), _serialise(package)),
        (args.ris.resolve(), ris),
        (args.audit.resolve(), _serialise(audit)),
    )
    if args.check:
        if any(
            not path.exists() or path.read_text(encoding="utf-8") != text
            for path, text in outputs
        ):
            sys.exit("FEHLER: stale or missing Codex Websearch output")
        print("OK: Codex Websearch 2026 outputs are current")
        return
    for path, text in outputs:
        path.parent.mkdir(parents=True, exist_ok=True)
        temporary = path.with_suffix(f"{path.suffix}.tmp")
        temporary.write_text(text, encoding="utf-8", newline="\n")
        temporary.replace(path)
    print(
        "OK: "
        f"{package['counts']['distinct_tier_a_candidates']} candidates, "
        f"{package['counts']['import_ready']} import-ready, "
        f"{package['counts']['new_in_codex_websearch']} newly identified"
    )


if __name__ == "__main__":
    main()
