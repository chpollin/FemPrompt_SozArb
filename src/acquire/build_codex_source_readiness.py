#!/usr/bin/env python3
"""Build the source-readiness ledger for the Codex Websearch 2026 intake."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path
from typing import Any

REPO = Path(__file__).resolve().parents[2]
SEARCH_DIR = REPO / "corpus" / "deep-research" / "round2" / "Codex Websearch"
PACKAGE_PATH = SEARCH_DIR / "codex-websearch-2026-package.json"
PLAN_PATH = SEARCH_DIR / "source-acquisition-plan.json"
ACQUISITION_DIR = REPO / "generated" / "source-acquisition" / "codex-websearch-2026"
MANIFEST_PATH = ACQUISITION_DIR / "acquisition-manifest.json"
QC_DIR = ACQUISITION_DIR / "agent-qc"
DEFAULT_OUTPUT = ACQUISITION_DIR / "source-readiness.json"
AVAILABLE_STATUSES = {"downloaded", "already_available", "html_available"}
APPROVED_DECISIONS = {
    "approved_for_screening",
    "approved_for_screening_after_repair",
}


def _direct_qc_approved(record: dict[str, Any] | None) -> bool:
    if not record or record.get("decision") not in APPROVED_DECISIONS:
        return False
    tables = record.get("tables") or {}
    return (
        record.get("identity_match") is True
        and record.get("body_complete") is True
        and tables.get("material_loss") is False
    )


def _repair_qc_approved(record: dict[str, Any] | None) -> bool:
    if not record or record.get("decision") not in APPROVED_DECISIONS:
        return False
    repaired_units = [
        unit
        for field in ("tables", "repaired_segments", "text_segments")
        for unit in (record.get(field) or [])
    ]
    return (
        record.get("page_markers_preserved") is True
        and bool(record.get("repaired_markdown"))
        and bool(repaired_units)
        and all(unit.get("status") == "verified_complete" for unit in repaired_units)
    )


def _read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def _sha256_path(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _verified_repo_file(
    repo: Path,
    relative_path: str,
    *,
    expected_sha256: str | None = None,
    allow_missing_with_recorded_hash: bool = False,
) -> str:
    repo_root = repo.resolve()
    path = (repo / relative_path).resolve()
    if not path.is_relative_to(repo_root):
        raise ValueError(f"missing or invalid repository file: {relative_path}")
    if not path.is_file():
        if allow_missing_with_recorded_hash and expected_sha256:
            return expected_sha256
        raise ValueError(f"missing or invalid repository file: {relative_path}")
    actual_sha256 = _sha256_path(path)
    if expected_sha256 and actual_sha256 != expected_sha256:
        raise ValueError(f"checksum mismatch for repository file: {relative_path}")
    return actual_sha256


def _serialise(payload: dict[str, Any]) -> str:
    return json.dumps(payload, ensure_ascii=False, indent=2) + "\n"


def _source_ref(path: Path, repo: Path) -> dict[str, str]:
    return {
        "path": path.relative_to(repo).as_posix(),
        "sha256": _sha256_path(path),
    }


def _latest_validation(acquisition_dir: Path) -> Path:
    reports = sorted((acquisition_dir / "validation").glob("validation_report_*.json"))
    if not reports:
        raise ValueError("no Markdown validation report found")
    return reports[-1]


def _load_agent_records(
    paths: list[Path],
    *,
    allowed_ids: set[str],
    id_aliases: dict[str, str] | None = None,
) -> tuple[dict[str, dict[str, Any]], list[dict[str, str]]]:
    records: dict[str, dict[str, Any]] = {}
    sources: list[dict[str, str]] = []
    for path in paths:
        payload = _read_json(path)
        sources.append(_source_ref(path, REPO))
        for record in payload.get("records") or []:
            candidate_id = record.get("candidate_id")
            candidate_id = (id_aliases or {}).get(candidate_id, candidate_id)
            if candidate_id not in allowed_ids:
                raise ValueError(f"{path}: unknown candidate_id {candidate_id!r}")
            if candidate_id in records:
                raise ValueError(f"duplicate agent QC for {candidate_id}")
            records[candidate_id] = {**record, "candidate_id": candidate_id}
    return records, sources


def _source_state(
    acquisition: dict[str, Any] | None,
    validation: dict[str, Any] | None,
    direct_qc: dict[str, Any] | None,
    repair_qc: dict[str, Any] | None,
    visual_assessment: dict[str, Any] | None,
) -> tuple[str, bool, str]:
    if acquisition is None:
        return (
            "fulltext_access_not_available",
            False,
            "lawful_fulltext_source_required",
        )
    if acquisition.get("status") not in AVAILABLE_STATUSES:
        return (
            "automatic_acquisition_failed",
            False,
            "alternative_source_or_operator_download_required",
        )
    if validation is None:
        return "conversion_validation_missing", False, "conversion_validation_required"
    if direct_qc is None:
        return "agent_qc_pending", False, "agent_source_qc_required"

    if _direct_qc_approved(direct_qc):
        return "agent_qc_approved", True, "zotero_identity_binding_pending"
    if _repair_qc_approved(repair_qc):
        return (
            "agent_qc_approved_after_repair",
            True,
            "zotero_identity_binding_pending",
        )
    if visual_assessment:
        assessment = visual_assessment.get("assessment") or {}
        if (
            assessment.get("status")
            == "not_representable_in_current_prism_evidence_structure"
        ):
            return (
                "visual_evidence_support_required",
                False,
                "prism_visual_evidence_not_representable",
            )
    return "repair_required", False, "source_representation_repair_required"


def build_readiness(repo: Path = REPO) -> dict[str, Any]:
    """Build one record per candidate from acquisition, conversion, and agent QC."""
    search_dir = repo / "corpus" / "deep-research" / "round2" / "Codex Websearch"
    acquisition_dir = repo / "generated" / "source-acquisition" / "codex-websearch-2026"
    package_path = search_dir / PACKAGE_PATH.name
    plan_path = search_dir / PLAN_PATH.name
    manifest_path = acquisition_dir / MANIFEST_PATH.name
    qc_dir = acquisition_dir / "agent-qc"
    validation_path = _latest_validation(acquisition_dir)

    package = _read_json(package_path)
    plan = _read_json(plan_path)
    manifest = _read_json(manifest_path)
    validation_payload = _read_json(validation_path)
    candidate_ids = {record["candidate_id"] for record in package["records"]}

    plan_by_id = {record["candidate_id"]: record for record in plan["records"]}
    file_stem_to_id = {
        Path(record["local_pdf_name"]).stem: record["candidate_id"]
        for record in plan["records"]
    }
    acquisition_by_id = {
        record["candidate_id"]: record for record in manifest["records"]
    }
    validation_by_file = {
        record["pdf_filename"]: record
        for record in validation_payload["detailed_results"]
    }

    direct_paths = sorted(
        path
        for path in qc_dir.glob("part-*.json")
        if re.fullmatch(r"part-[a-z]+\.json", path.name)
    )
    direct_qc, direct_sources = _load_agent_records(
        direct_paths,
        allowed_ids=candidate_ids,
    )
    repair_paths = sorted(qc_dir.glob("repair-*.json"))
    repair_qc, repair_sources = _load_agent_records(
        repair_paths,
        allowed_ids=candidate_ids,
        id_aliases=file_stem_to_id,
    )

    visual_by_id: dict[str, dict[str, Any]] = {}
    visual_manifest_by_id: dict[str, dict[str, Any]] = {}
    visual_sources: list[dict[str, str]] = []
    visual_manifest_sources: list[dict[str, str]] = []
    for visual_path in sorted(qc_dir.glob("visual-evidence-assessment*.json")):
        visual_payload = _read_json(visual_path)
        visual_records = visual_payload.get("records") or [visual_payload]
        for visual_record in visual_records:
            candidate_id = visual_record["candidate_id"]
            if candidate_id not in candidate_ids:
                raise ValueError(
                    f"{visual_path}: unknown candidate_id {candidate_id!r}"
                )
            if candidate_id in visual_by_id:
                raise ValueError(f"duplicate visual assessment for {candidate_id}")
            visual_by_id[candidate_id] = visual_record
            manifest_relative = (visual_record.get("visual_source") or {}).get(
                "manifest"
            )
            if not manifest_relative:
                raise ValueError(f"visual assessment lacks manifest: {candidate_id}")
            manifest_sha256 = _verified_repo_file(repo, manifest_relative)
            manifest_path = repo / manifest_relative
            visual_manifest = _read_json(manifest_path)
            if (
                visual_manifest.get("schema")
                != "femprompt-visual-evidence-manifest/0.1"
                or visual_manifest.get("candidate_id") != candidate_id
            ):
                raise ValueError(f"visual manifest identity mismatch: {candidate_id}")
            source_pdf = visual_manifest.get("source_pdf") or {}
            _verified_repo_file(
                repo,
                source_pdf.get("file"),
                expected_sha256=source_pdf.get("sha256"),
                allow_missing_with_recorded_hash=True,
            )
            images = list(visual_manifest.get("images") or [])
            for table in visual_manifest.get("tables") or []:
                images.extend(table.get("images") or [])
            expected_images = (visual_manifest.get("extraction") or {}).get(
                "image_count"
            )
            if not images or expected_images != len(images):
                raise ValueError(
                    f"visual manifest image count mismatch: {candidate_id}"
                )
            if (visual_record.get("visual_source") or {}).get("image_count") != len(
                images
            ):
                raise ValueError(
                    f"visual assessment image count mismatch: {candidate_id}"
                )
            manifest_directory = Path(manifest_relative).parent
            for image in images:
                _verified_repo_file(
                    repo,
                    (manifest_directory / image.get("file")).as_posix(),
                    expected_sha256=image.get("sha256"),
                )
            visual_manifest_by_id[candidate_id] = {
                "path": manifest_relative,
                "sha256": manifest_sha256,
                "image_count": len(images),
                "pdf_pages": (visual_record.get("visual_source") or {}).get(
                    "pdf_pages"
                ),
                "table_ids": (visual_record.get("visual_source") or {}).get(
                    "table_ids"
                ),
            }
            visual_manifest_sources.append(
                {"path": manifest_relative, "sha256": manifest_sha256}
            )
        visual_sources.append(_source_ref(visual_path, repo))

    recovery_path = search_dir / "source-recovery-audit.json"
    recovery_by_id: dict[str, dict[str, Any]] = {}
    recovery_source = None
    if recovery_path.exists():
        recovery_payload = _read_json(recovery_path)
        recovery_by_id = {
            record["candidate_id"]: record
            for record in recovery_payload.get("records") or []
        }
        recovery_source = _source_ref(recovery_path, repo)

    html_manifest_path = acquisition_dir / "html-source-manifest.json"
    html_by_id: dict[str, dict[str, Any]] = {}
    html_manifest_source = None
    if html_manifest_path.exists():
        html_manifest = _read_json(html_manifest_path)
        if html_manifest.get("schema") != "femprompt-html-source-manifest/0.1":
            raise ValueError("unexpected HTML source manifest schema")
        html_by_id = {
            record["candidate_id"]: record
            for record in html_manifest.get("records") or []
        }
        unknown_ids = set(html_by_id) - candidate_ids
        if unknown_ids:
            raise ValueError(f"HTML source manifest has unknown IDs: {unknown_ids}")
        html_manifest_source = _source_ref(html_manifest_path, repo)

    records: list[dict[str, Any]] = []
    for candidate in package["records"]:
        candidate_id = candidate["candidate_id"]
        planned = plan_by_id[candidate_id]
        acquisition = acquisition_by_id.get(candidate_id)
        html_source = html_by_id.get(candidate_id)
        local_pdf_name = planned["local_pdf_name"]
        validation = validation_by_file.get(local_pdf_name)
        local_representation = None
        effective_acquisition = acquisition
        if acquisition and acquisition.get("status") in AVAILABLE_STATUSES:
            source_file = f"generated/pdfs/codex-websearch-2026/{local_pdf_name}"
            markdown_file = (
                "generated/source-acquisition/codex-websearch-2026/"
                f"markdown-clean/{Path(local_pdf_name).stem}.md"
            )
            source_sha256 = _verified_repo_file(
                repo,
                source_file,
                expected_sha256=acquisition.get("sha256"),
                allow_missing_with_recorded_hash=True,
            )
            markdown_sha256 = _verified_repo_file(repo, markdown_file)
            local_representation = {
                "format": "pdf",
                "source_storage": "local_only_not_committed",
                "source_file": source_file,
                "markdown_file": markdown_file,
                "source_sha256": source_sha256,
                "markdown_sha256": markdown_sha256,
                "source_version": acquisition.get("source_version"),
            }
        elif html_source:
            effective_acquisition = {
                "status": "html_available",
                "source_version": html_source.get("source_version"),
            }
            validation = {
                "status": "HTML_SOURCE_MANIFEST",
                "confidence_score": None,
                "issues": [],
            }
            source_file = html_source.get("source_file")
            markdown_file = html_source.get("markdown_file")
            source_sha256 = _verified_repo_file(
                repo,
                source_file,
                expected_sha256=html_source.get("source_sha256"),
                allow_missing_with_recorded_hash=True,
            )
            markdown_sha256 = _verified_repo_file(
                repo,
                markdown_file,
                expected_sha256=html_source.get("markdown_sha256"),
            )
            local_representation = {
                "format": "html",
                "source_storage": "local_only_not_committed",
                "source_file": source_file,
                "markdown_file": markdown_file,
                "source_sha256": source_sha256,
                "markdown_sha256": markdown_sha256,
                "source_version": html_source.get("source_version"),
            }
        direct = direct_qc.get(candidate_id)
        repair = repair_qc.get(candidate_id)
        visual = visual_by_id.get(candidate_id)
        visual_manifest = visual_manifest_by_id.get(candidate_id)
        recovery = recovery_by_id.get(candidate_id)
        state, ready, blocker = _source_state(
            effective_acquisition,
            validation,
            direct,
            repair,
            visual,
        )
        if state == "automatic_acquisition_failed" and recovery:
            blocker = "format_specific_or_operator_acquisition_required"
        screening_markdown = None
        screening_markdown_sha256 = None
        if _repair_qc_approved(repair):
            screening_markdown = repair.get("repaired_markdown")
            repair_validation = repair.get("validation") or {}
            expected_repair_sha256 = repair_validation.get(
                "repaired_markdown_sha256"
            ) or repair_validation.get("repaired_sha256")
            screening_markdown_sha256 = _verified_repo_file(
                repo,
                screening_markdown,
                expected_sha256=expected_repair_sha256,
            )
        elif _direct_qc_approved(direct) and local_representation:
            screening_markdown = local_representation["markdown_file"]
            screening_markdown_sha256 = local_representation["markdown_sha256"]
        records.append(
            {
                "candidate_id": candidate_id,
                "title": candidate["title"],
                "doi": candidate.get("doi"),
                "preferred_version": {
                    "type": planned.get("preferred_version_type"),
                    "date": planned.get("preferred_version_date"),
                },
                "local_source_version": (
                    local_representation.get("source_version")
                    if local_representation
                    else None
                ),
                "acquisition": {
                    "access_status": planned.get("access_status"),
                    "automated_candidate": planned.get("download_eligible"),
                    "eligibility_reason": planned.get("eligibility_reason"),
                    "status": (
                        acquisition.get("status")
                        if acquisition
                        else "not_automatically_attempted"
                    ),
                    "local_pdf_name": (
                        local_pdf_name
                        if acquisition
                        and acquisition.get("status") in AVAILABLE_STATUSES
                        else None
                    ),
                    "sha256": acquisition.get("sha256") if acquisition else None,
                    "error": acquisition.get("error") if acquisition else None,
                },
                "source_recovery": (
                    {
                        "status": recovery.get("status"),
                        "alternative_url": recovery.get("alternative_url"),
                        "version_type": recovery.get("version_type"),
                        "relation_to_preferred": recovery.get("relation_to_preferred"),
                    }
                    if recovery
                    else None
                ),
                "local_representation": local_representation,
                "conversion_validation": (
                    {
                        "status": validation.get("status"),
                        "confidence": validation.get("confidence_score"),
                        "issues": validation.get("issues") or [],
                    }
                    if validation
                    else None
                ),
                "agent_qc": (
                    {
                        "decision": direct.get("decision"),
                        "identity_match": direct.get("identity_match"),
                        "body_complete": direct.get("body_complete"),
                    }
                    if direct
                    else None
                ),
                "repair_qc": (
                    {
                        "decision": repair.get("decision"),
                        "repaired_markdown": repair.get("repaired_markdown"),
                        "issues_remaining": repair.get("issues_remaining") or [],
                    }
                    if repair
                    else None
                ),
                "visual_evidence_assessment": (
                    (visual.get("assessment") or {}).get("status") if visual else None
                ),
                "visual_evidence_manifest": visual_manifest,
                "source_readiness": state,
                "screening_source_ready": ready,
                "screening_markdown_file": screening_markdown,
                "screening_markdown_sha256": screening_markdown_sha256,
                "canonical_queue_status": (
                    "pending_zotero_identity_binding" if ready else "blocked"
                ),
                "next_required_action": blocker,
            }
        )

    states: dict[str, int] = {}
    for record in records:
        state = record["source_readiness"]
        states[state] = states.get(state, 0) + 1
    return {
        "schema": "femprompt-source-readiness/0.2",
        "scope": "Codex Websearch 2026 candidates before Zotero identity binding",
        "authority": (
            "This ledger establishes local source-preparation state only. It does not "
            "establish PRISM inclusion, domain-expert verification, or publication approval."
        ),
        "sources": {
            "package": _source_ref(package_path, repo),
            "acquisition_plan": _source_ref(plan_path, repo),
            "acquisition_manifest": _source_ref(manifest_path, repo),
            "conversion_validation": _source_ref(validation_path, repo),
            "direct_agent_qc": direct_sources,
            "repair_agent_qc": repair_sources,
            "visual_assessment": visual_sources,
            "visual_evidence_manifests": visual_manifest_sources,
            "source_recovery": recovery_source,
            "html_source_manifest": html_manifest_source,
        },
        "counts": {
            "candidates": len(records),
            "local_pdfs": sum(
                (record["local_representation"] or {}).get("format") == "pdf"
                for record in records
            ),
            "local_html_sources": sum(
                (record["local_representation"] or {}).get("format") == "html"
                for record in records
            ),
            "local_sources": sum(
                record["local_representation"] is not None for record in records
            ),
            "screening_source_ready": sum(
                record["screening_source_ready"] for record in records
            ),
            "pending_zotero_identity_binding": sum(
                record["canonical_queue_status"] == "pending_zotero_identity_binding"
                for record in records
            ),
            "recovery_alternative_not_local": sum(
                record["source_readiness"] == "automatic_acquisition_failed"
                and record["source_recovery"] is not None
                for record in records
            ),
            "validated_visual_evidence_bundles": len(visual_manifest_by_id),
            "source_readiness": states,
        },
        "records": records,
    }


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()

    payload = build_readiness()
    serialised = _serialise(payload)
    if args.check:
        if (
            not args.output.exists()
            or args.output.read_text(encoding="utf-8") != serialised
        ):
            sys.exit("FEHLER: stale or missing Codex source-readiness ledger")
        print("OK: Codex source-readiness ledger is current")
        return
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(serialised, encoding="utf-8")
    print(
        "OK: "
        f"{payload['counts']['local_sources']} local sources; "
        f"{payload['counts']['screening_source_ready']} source-ready"
    )


if __name__ == "__main__":
    main()
