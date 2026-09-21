import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LEDGER = (
    ROOT
    / "generated"
    / "source-acquisition"
    / "residual-queue-9-20260826"
    / "resolution-ledger.json"
)
QUEUE = ROOT / "generated" / "agent-screening-queue.json"


def _json(path: Path) -> dict[str, object]:
    return json.loads(path.read_text(encoding="utf-8"))


def test_resolution_ledger_covers_the_audited_residual_cohort() -> None:
    ledger = _json(LEDGER)
    queue = _json(QUEUE)
    records = {record["record_id"]: record for record in ledger["records"]}
    queued = {record["work_id"]: record for record in queue["queue"]}
    productive = _json(ROOT / "docs/data/screening/ar2.json")["decisions"]
    registry = _json(ROOT / "corpus/work_version_registry.json")
    versions = {
        work["work_id"]: {version["version_id"] for version in work["versions"]}
        for work in registry["works"]
    }

    # The dated acquisition cohort stays fixed as later governed runs shrink
    # the live queue. Leaving the queue requires a reviewed record of that Work.
    assert set(records) == {
        "SQYLQFRU",
        "RAY6G2R7",
        "ZQHP5G35",
        "LR8Z3YHP",
        "KI9GRGHB",
        "5T55I5Z7",
        "XG7RFFC7",
        "Z9DNTBFF",
        "8NG4ZEWE",
    }
    assert set(ledger["scope"]["record_ids"]) == set(records)
    assert records["8NG4ZEWE"]["work_id"] not in queued
    for record_id, record in records.items():
        work_id = record["work_id"]
        if work_id not in queued:
            assert productive[record_id]["work_id"] == record["work_id"]
            assert productive[record_id]["lifecycle"]["state"] in {
                "ai-agent-reviewed",
                "verified",
                "publication-approved",
            }
            continue
        # Live Zotero additions may become the representative of the same Work.
        assert record_id in queued[work_id]["record_ids"]
        # The dated audited Version stays addressable when a later one is selected.
        assert record["version_id"] in versions[work_id]
        assert queued[work_id]["selected_version_id"] in versions[work_id]
        assert record["evidence_urls"]
        assert record["required_action"]


def test_only_reviewed_intersectionality_source_is_ready() -> None:
    records = {record["record_id"]: record for record in _json(LEDGER)["records"]}
    ready = {
        record_id
        for record_id, record in records.items()
        if record["resolution_status"] == "source_ready"
    }

    assert ready == {"8NG4ZEWE"}
    source = ROOT / records["8NG4ZEWE"]["paper_source"]
    assert source.exists()
    assert (
        hashlib.sha256(source.read_bytes()).hexdigest()
        == records["8NG4ZEWE"]["paper_source_sha256"]
    )


def test_bibliographic_corrections_remain_exact() -> None:
    records = {record["record_id"]: record for record in _json(LEDGER)["records"]}

    assert records["LR8Z3YHP"]["verified_identity"]["doi"] == (
        "10.1080/03085147.2020.1733842"
    )
    assert records["SQYLQFRU"]["verified_identity"]["arxiv"] == "2504.05632"
    assert records["RAY6G2R7"]["candidate_swiftsage_identity"]["arxiv"] == (
        "2305.17390"
    )
    assert records["Z9DNTBFF"]["candidate_srinivasan_bisk_identity"]["doi"] == (
        "10.18653/v1/2022.gebnlp-1.10"
    )
