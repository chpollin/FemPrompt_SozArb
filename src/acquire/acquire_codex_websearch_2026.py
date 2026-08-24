#!/usr/bin/env python3
"""Prepare and execute bounded source acquisition for Codex Websearch 2026.

The module reads the audited candidate package, creates a deterministic source
plan, and optionally downloads only full texts explicitly recorded as open
access. PDFs remain local and gitignored. The runtime manifest records the
resolved URL, checksum, size, and every failed attempt so acquisition can resume
without repeating successful downloads.

Usage:
    python -m src.acquire.acquire_codex_websearch_2026
    python -m src.acquire.acquire_codex_websearch_2026 --check
    python -m src.acquire.acquire_codex_websearch_2026 --download
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
import time
from copy import deepcopy
from datetime import UTC, datetime
from pathlib import Path
from typing import Any
from urllib.parse import urlparse, urlsplit, urlunsplit

REPO = Path(__file__).resolve().parents[2]
SEARCH_DIR = REPO / "corpus" / "deep-research" / "round2" / "Codex Websearch"
PACKAGE_PATH = SEARCH_DIR / "codex-websearch-2026-package.json"
DEFAULT_PLAN = SEARCH_DIR / "source-acquisition-plan.json"
DEFAULT_PDF_DIR = REPO / "generated" / "pdfs" / "codex-websearch-2026"
DEFAULT_MANIFEST = (
    REPO
    / "generated"
    / "source-acquisition"
    / "codex-websearch-2026"
    / "acquisition-manifest.json"
)
DEFAULT_RECOVERY_AUDIT = SEARCH_DIR / "source-recovery-audit.json"
USER_AGENT = (
    "FemPrompt-SozArb/2026 "
    "(+https://github.com/chpollin/FemPrompt_SozArb; scholarly source acquisition)"
)
MAX_PDF_BYTES = 100 * 1024 * 1024
MIN_PDF_BYTES = 2_048


def _read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def _sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def _sha256_path(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _serialise(payload: dict[str, Any]) -> str:
    return json.dumps(payload, ensure_ascii=False, indent=2) + "\n"


def _atomic_write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(f"{path.suffix}.tmp")
    temporary.write_text(text, encoding="utf-8", newline="\n")
    temporary.replace(path)


def _atomic_write_bytes(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(f"{path.suffix}.tmp")
    temporary.write_bytes(data)
    temporary.replace(path)


def _source_url(record: dict[str, Any]) -> str | None:
    access = record.get("access") or {}
    preferred = record.get("preferred_version") or {}
    value = access.get("fulltext_url") or preferred.get("fulltext_url")
    return str(value).strip() if value else None


def _normalise_url_for_match(value: Any) -> str | None:
    if not value:
        return None
    parsed = urlsplit(str(value).strip())
    return urlunsplit(
        (
            parsed.scheme.casefold(),
            parsed.netloc.casefold(),
            parsed.path.rstrip("/"),
            parsed.query,
            "",
        )
    )


def _source_version(record: dict[str, Any], source_url: str | None) -> dict[str, Any]:
    """Identify the exact recorded Version represented by the source URL."""
    normalised_source = _normalise_url_for_match(source_url)
    matches: list[dict[str, Any]] = []
    for version in record.get("versions") or []:
        version_urls = {
            _normalise_url_for_match(version.get(field))
            for field in ("fulltext_url", "url", "landing_url")
        }
        if normalised_source and normalised_source in version_urls:
            matches.append(version)

    preferred = record.get("preferred_version") or {}
    if len(matches) != 1:
        return {
            "version_type": "not_established",
            "date": None,
            "identifier": None,
            "title": None,
            "authors": [],
            "relation_to_preferred": "not_established",
        }

    match = matches[0]
    identifier = match.get("identifier") or match.get("identifiers")
    preferred_date = preferred.get("date") or record.get("selected_version_date")
    relation = (
        "preferred_version"
        if match.get("version_type") == preferred.get("version_type")
        and match.get("date") == preferred_date
        else "alternative_recorded_version"
    )
    return {
        "version_type": match.get("version_type") or "not_established",
        "date": match.get("date"),
        "identifier": identifier,
        "title": match.get("title") or record.get("title"),
        "authors": deepcopy(match.get("authors") or record.get("authors") or []),
        "relation_to_preferred": relation,
    }


def _recovery_version(
    record: dict[str, Any], recovery: dict[str, Any]
) -> dict[str, Any]:
    raw_type = str(recovery.get("version_type") or "not_established")
    version_type = (
        "accepted_manuscript"
        if raw_type.startswith("accepted_manuscript")
        else "version_of_record"
        if raw_type.startswith("version_of_record")
        else raw_type
    )
    preferred = record.get("preferred_version") or {}
    relation = (
        "preferred_version"
        if version_type == preferred.get("version_type")
        else "alternative_recorded_version"
    )
    return {
        "version_type": version_type,
        "source_version_label": raw_type,
        "date": recovery.get("version_date"),
        "identifier": deepcopy(recovery.get("identifier")),
        "title": record.get("title"),
        "authors": deepcopy(record.get("authors") or []),
        "relation_to_preferred": relation,
        "relation_basis": recovery.get("relation_to_preferred"),
    }


def _source_options(
    record: dict[str, Any],
    recovery: dict[str, Any] | None = None,
) -> list[dict[str, Any]]:
    """Return audited source first, followed by recorded Version fallbacks."""
    urls: list[str] = []
    audited_url = _source_url(record)
    if audited_url:
        urls.append(audited_url)
    for version in record.get("versions") or []:
        value = version.get("fulltext_url")
        if value and str(value).strip() not in urls:
            urls.append(str(value).strip())
    options = [
        {
            "url": url,
            "priority": "audited_access" if index == 0 else "recorded_version_fallback",
            "source_version": _source_version(record, url),
            "source_recovery": False,
        }
        for index, url in enumerate(urls)
    ]
    if recovery and recovery.get("status") == "alternative_located":
        recovery_url = str(recovery.get("alternative_url") or "").strip()
        existing = next(
            (option for option in options if option["url"] == recovery_url),
            None,
        )
        if existing:
            existing.update(
                {
                    "priority": f"{existing['priority']}_and_source_recovery",
                    "source_version": _recovery_version(record, recovery),
                    "source_recovery": True,
                }
            )
        elif recovery_url:
            options.append(
                {
                    "url": recovery_url,
                    "priority": "source_recovery_audit",
                    "source_version": _recovery_version(record, recovery),
                    "source_recovery": True,
                }
            )
    return options


def _download_eligibility(record: dict[str, Any]) -> tuple[bool, str]:
    access = record.get("access") or {}
    url = _source_url(record)
    if access.get("status") != "open_access":
        return False, "access_not_confirmed_open"
    if not url:
        return False, "fulltext_url_missing"
    parsed = urlparse(url)
    if parsed.scheme != "https" or not parsed.netloc:
        return False, "fulltext_url_not_https"
    return True, "confirmed_open_fulltext_url"


def _source_filename(candidate_id: str) -> str:
    digest = hashlib.sha256(candidate_id.encode("utf-8")).hexdigest()[:20]
    return f"{digest}.pdf"


def build_plan(repo: Path = REPO) -> dict[str, Any]:
    """Return the deterministic acquisition plan for all selected candidates."""
    package_path = (
        repo
        / "corpus"
        / "deep-research"
        / "round2"
        / "Codex Websearch"
        / "codex-websearch-2026-package.json"
    )
    package = _read_json(package_path)
    recovery_path = package_path.parent / "source-recovery-audit.json"
    recovery_by_id: dict[str, dict[str, Any]] = {}
    if recovery_path.exists():
        recovery_payload = _read_json(recovery_path)
        if recovery_payload.get("schema") != "femprompt-source-recovery-audit/0.1":
            raise ValueError("unexpected source-recovery audit schema")
        recovery_by_id = {
            item["candidate_id"]: item for item in recovery_payload.get("records") or []
        }
    records: list[dict[str, Any]] = []
    for record in package.get("records") or []:
        eligible, reason = _download_eligibility(record)
        access = record.get("access") or {}
        preferred = record.get("preferred_version") or {}
        source_url = _source_url(record)
        source_options = _source_options(
            record, recovery_by_id.get(record["candidate_id"])
        )
        records.append(
            {
                "candidate_id": record["candidate_id"],
                "title": record["title"],
                "doi": record.get("doi"),
                "preferred_version_date": record.get("selected_version_date"),
                "preferred_version_type": preferred.get("version_type"),
                "source_version": _source_version(record, source_url),
                "source_options": source_options,
                "access_status": access.get("status") or "not_established",
                "license": access.get("license"),
                "source_url": source_url,
                "download_eligible": eligible,
                "eligibility_reason": reason,
                "local_pdf_name": _source_filename(record["candidate_id"]),
            }
        )
    counts = {
        "candidates": len(records),
        "download_eligible": sum(item["download_eligible"] for item in records),
        "with_recorded_source_url": sum(bool(item["source_url"]) for item in records),
        "with_recorded_license": sum(bool(item["license"]) for item in records),
        "with_recovery_option": sum(
            any(option["source_recovery"] for option in item["source_options"])
            for item in records
        ),
    }
    return {
        "schema": "femprompt-source-acquisition-plan/0.2",
        "scope": "Codex Websearch 2026 candidates",
        "authority": (
            "Source preparation only; acquisition does not establish PRISM inclusion "
            "or scholarly verification."
        ),
        "source": {
            "path": package_path.relative_to(repo).as_posix(),
            "sha256": _sha256_path(package_path),
        },
        "source_recovery": (
            {
                "path": recovery_path.relative_to(repo).as_posix(),
                "sha256": _sha256_path(recovery_path),
            }
            if recovery_path.exists()
            else None
        ),
        "rights_rule": (
            "Automated acquisition begins only for records whose audited access state "
            "is open_access and whose full-text URL uses HTTPS. It may fall back only "
            "to another full-text URL already recorded in that Work's Version chain; "
            "the acquired Version is retained separately from the preferred Version."
        ),
        "counts": counts,
        "records": records,
    }


def _valid_pdf(data: bytes) -> tuple[bool, str]:
    if len(data) < MIN_PDF_BYTES:
        return False, "response_too_small"
    if not data.startswith(b"%PDF-"):
        return False, "response_is_not_pdf"
    if b"%%EOF" not in data[-4_096:]:
        return False, "pdf_eof_marker_missing"
    return True, "valid_pdf_container"


def _fetch_pdf(url: str, timeout: float) -> tuple[bytes, str, str | None]:
    import requests

    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "application/pdf,text/html;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
    }
    try:
        with requests.get(
            url,
            headers=headers,
            timeout=timeout,
            allow_redirects=True,
            stream=True,
        ) as response:
            response.raise_for_status()
            content_length = response.headers.get("Content-Length")
            if content_length and int(content_length) > MAX_PDF_BYTES:
                raise ValueError("declared PDF exceeds 100 MiB safety limit")
            chunks: list[bytes] = []
            size = 0
            for chunk in response.iter_content(chunk_size=64 * 1024):
                if not chunk:
                    continue
                size += len(chunk)
                if size > MAX_PDF_BYTES:
                    raise ValueError("download exceeded 100 MiB safety limit")
                chunks.append(chunk)
            return (
                b"".join(chunks),
                response.url,
                response.headers.get("Content-Type"),
            )
    except requests.RequestException as exc:
        raise RuntimeError(f"HTTP acquisition failed: {exc}") from exc


def _existing_result(
    item: dict[str, Any],
    path: Path,
    previous: dict[str, Any] | None,
) -> dict[str, Any] | None:
    if not path.exists():
        return None
    data = path.read_bytes()
    valid, validation = _valid_pdf(data)
    if not valid:
        return None
    retained = previous or {}
    retained_url = retained.get("source_url") or item["source_url"]
    current_source_version = next(
        (
            option["source_version"]
            for option in item["source_options"]
            if option["url"] == retained_url
        ),
        item["source_version"],
    )
    return {
        **item,
        "status": "already_available",
        "source_url": retained_url,
        "source_version": current_source_version,
        "resolved_url": retained.get("resolved_url") or item["source_url"],
        "content_type": "application/pdf",
        "bytes": len(data),
        "sha256": _sha256_bytes(data),
        "validation": validation,
        "attempts": retained.get("attempts") or [],
        "error": None,
    }


def _download_one(
    item: dict[str, Any],
    pdf_dir: Path,
    timeout: float,
    previous: dict[str, Any] | None,
) -> dict[str, Any]:
    output_path = pdf_dir / item["local_pdf_name"]
    existing = _existing_result(item, output_path, previous)
    if existing:
        return existing
    attempts: list[dict[str, Any]] = []
    for option in item["source_options"]:
        try:
            data, resolved_url, content_type = _fetch_pdf(option["url"], timeout)
            valid, validation = _valid_pdf(data)
            if not valid:
                raise ValueError(validation)
            _atomic_write_bytes(output_path, data)
            attempts.append({**option, "status": "available", "error": None})
            return {
                **item,
                "source_url": option["url"],
                "source_version": option["source_version"],
                "status": "downloaded",
                "resolved_url": resolved_url,
                "content_type": content_type,
                "bytes": len(data),
                "sha256": _sha256_bytes(data),
                "validation": validation,
                "attempts": attempts,
                "error": None,
            }
        except (RuntimeError, TimeoutError, ValueError, OSError) as exc:
            attempts.append(
                {
                    **option,
                    "status": "failed",
                    "error": f"{type(exc).__name__}: {exc}",
                }
            )
    return {
        **item,
        "status": "failed",
        "resolved_url": None,
        "content_type": None,
        "bytes": 0,
        "sha256": None,
        "validation": None,
        "attempts": attempts,
        "error": attempts[-1]["error"] if attempts else "no_source_option",
    }


def acquire(
    plan: dict[str, Any],
    pdf_dir: Path,
    manifest_path: Path,
    *,
    timeout: float,
    delay: float,
) -> dict[str, Any]:
    """Download eligible sources sequentially and persist after every item."""
    eligible = [item for item in plan["records"] if item["download_eligible"]]
    previous_records: dict[str, dict[str, Any]] = {}
    if manifest_path.exists():
        previous_manifest = _read_json(manifest_path)
        previous_records = {
            record["candidate_id"]: record
            for record in previous_manifest.get("records") or []
        }
    results: list[dict[str, Any]] = []
    manifest: dict[str, Any] = {}
    for index, item in enumerate(eligible, start=1):
        result = _download_one(
            item,
            pdf_dir,
            timeout,
            previous_records.get(item["candidate_id"]),
        )
        results.append(result)
        manifest = {
            "schema": "femprompt-source-acquisition-run/0.2",
            "generated_at": datetime.now(UTC).isoformat(),
            "plan_source": plan["source"],
            "plan_fingerprint_sha256": _sha256_bytes(_serialise(plan).encode("utf-8")),
            "source_recovery": plan.get("source_recovery"),
            "local_pdf_directory": pdf_dir.relative_to(REPO).as_posix(),
            "counts": {
                "eligible": len(eligible),
                "processed": len(results),
                "available": sum(
                    result["status"] in {"downloaded", "already_available"}
                    for result in results
                ),
                "failed": sum(result["status"] == "failed" for result in results),
            },
            "records": results,
        }
        _atomic_write_text(manifest_path, _serialise(manifest))
        print(f"{result['status'].upper()}: {index}/{len(eligible)} {item['title']}")
        if index < len(eligible):
            time.sleep(delay)
    return manifest


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(
        description="Prepare or execute Codex Websearch 2026 source acquisition"
    )
    parser.add_argument("--plan", type=Path, default=DEFAULT_PLAN)
    parser.add_argument("--pdf-dir", type=Path, default=DEFAULT_PDF_DIR)
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--download", action="store_true")
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--timeout", type=float, default=45.0)
    parser.add_argument("--delay", type=float, default=0.5)
    args = parser.parse_args()

    plan = build_plan()
    serialised = _serialise(plan)
    if args.check:
        if (
            not args.plan.exists()
            or args.plan.read_text(encoding="utf-8") != serialised
        ):
            sys.exit("FEHLER: stale or missing source-acquisition plan")
        print("OK: Codex Websearch 2026 source-acquisition plan is current")
        return
    _atomic_write_text(args.plan, serialised)
    print(
        "OK: "
        f"{plan['counts']['candidates']} candidates, "
        f"{plan['counts']['download_eligible']} eligible open sources"
    )
    if args.download:
        manifest = acquire(
            plan,
            args.pdf_dir.resolve(),
            args.manifest.resolve(),
            timeout=args.timeout,
            delay=args.delay,
        )
        failed = manifest["counts"]["failed"]
        if failed:
            sys.exit(f"FEHLER: {failed} eligible source downloads failed")


if __name__ == "__main__":
    main()
