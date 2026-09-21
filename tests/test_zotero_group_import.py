"""Exercise imports against real RIS data and simulated external API failures."""

import copy
import json
from pathlib import Path

import pytest

from src.acquire import zotero_group_import as importer
from src.acquire.zotero_group_reconcile import DEFAULT_RIS, GROUP_ID
from src.analysis.build_round2_intake import parse_ris


def template(kind: str) -> dict:
    # This narrow external-API fixture isolates field preservation from networking.
    return {
        "itemType": kind,
        "title": "",
        "date": "",
        "url": "",
        "DOI": "",
        "extra": "",
        "creators": [],
        "tags": [],
        "collections": [],
        "relations": {},
        "publicationTitle": "",
        "proceedingsTitle": "",
        "bookTitle": "",
        "pages": "",
    }


def test_real_ris_fields_and_source_notes_survive_conversion() -> None:
    for path in DEFAULT_RIS:
        for record in parse_ris(path):
            kind = importer.TYPES[record["TY"][0]]
            item = importer.to_item(record, template(kind), path.name)
            assert item["title"] == record["TI"][0]
            assert len(item["creators"]) == len(record.get("AU", []))
            assert [t["tag"] for t in item["tags"]] == list(
                dict.fromkeys(record.get("KW", []))
            )
            assert all(note in item["extra"] for note in record.get("N1", []))
            for tag in record.keys() - {"TY", "AU", "KW", "N1", "PY", "DA", "SP", "EP"}:
                if tag in importer.FIELDS or tag == "T2":
                    continue
                assert all(value in item["extra"] for value in record[tag])


def test_doi_survives_a_template_without_native_doi() -> None:
    record = parse_ris(DEFAULT_RIS[0])[2]
    minimal = template("bookSection")
    del minimal["DOI"]
    item = importer.to_item(record, minimal, "real.ris")
    assert "DOI: " + record["DO"][0] in item["extra"]


def test_readback_accepts_reordered_tags_but_detects_lost_tags_and_author_order() -> (
    None
):
    record = parse_ris(DEFAULT_RIS[0])[0]
    expected = importer.to_item(record, template("journalArticle"), "real.ris")
    actual = copy.deepcopy(expected)
    actual["tags"] = [{**tag, "type": 0} for tag in reversed(actual["tags"])]
    assert importer.differences(expected, actual) == []
    actual["tags"].pop()
    actual["creators"].reverse()
    assert set(importer.differences(expected, actual)) == {"tags", "creators"}


def test_version_and_identity_conflicts_are_not_treated_as_missing() -> None:
    real = importer.identity(parse_ris(DEFAULT_RIS[0])[0])
    item = {**real, "key": "EXISTING"}
    assert importer.classify(real, [item]) == ("present", ["EXISTING"])
    for change in ({"year": ""}, {"doi": "different-doi"}):
        candidate = {**real, **change}
        if "year" in change:
            candidate["doi"] = ""
        assert importer.classify(candidate, [item])[0] == "ambiguous"
    assert (
        importer.classify({**real, "title": "Conflicting title"}, [item])[0]
        == "ambiguous"
    )


class FakeClient:
    key = "credential-not-for-reports"

    def __init__(self) -> None:
        self.items = []
        self.version = 1
        self.writes = 0
        self.fail = False
        self.corrupt = False

    def snapshot(self) -> dict:
        return {"version": self.version, "items": copy.deepcopy(self.items)}

    def request(self, path: str, payload=None, version=None) -> tuple:
        if path.startswith("/items/new"):
            return template(path.split("=")[1]), None
        if payload is not None:
            assert version == self.version
            self.writes += 1
            if self.fail:
                raise RuntimeError("timeout after sending " + self.key)
            self.version += 1
            key = f"KEY{self.writes:05d}"
            data = copy.deepcopy(payload[0])
            if self.corrupt:
                data["title"] = "Server changed the title"
            self.items.append({"key": key, "version": self.version, "data": data})
            return {
                "successful": {"0": {"key": key}},
                "unchanged": {},
                "failed": {},
            }, self.version
        return self.items[-1], self.version


def test_additive_import_reads_back_and_second_plan_is_empty(tmp_path: Path) -> None:
    client = FakeClient()
    plan = importer.prepare(client, client.snapshot(), [DEFAULT_RIS[0], DEFAULT_RIS[0]])
    creates = [r for r in plan["records"] if r["status"] == "create"]
    assert len(creates) == len(parse_ris(DEFAULT_RIS[0]))
    receipt = importer.apply(client, plan, tmp_path)
    assert len(receipt["created"]) == len(creates)
    assert all(r["verified"] for r in receipt["created"])
    assert receipt["existing_items_changed"] == []
    repeated = importer.prepare(client, client.snapshot(), [DEFAULT_RIS[0]])
    assert all(r["status"] == "present" for r in repeated["records"])


@pytest.mark.parametrize("failure", ["fail", "corrupt"])
def test_uncertain_write_or_readback_mismatch_stops_with_receipt(
    tmp_path: Path, failure: str
) -> None:
    client = FakeClient()
    plan = importer.prepare(client, client.snapshot(), [DEFAULT_RIS[0]])
    setattr(client, failure, True)
    with pytest.raises((ValueError, RuntimeError)):
        importer.apply(client, plan, tmp_path)
    assert client.writes == 1
    receipt_text = (tmp_path / "receipt.json").read_text(encoding="utf-8")
    receipt = json.loads(receipt_text)
    assert receipt["pending"] and receipt["errors"]
    assert client.key not in receipt_text


def test_stale_plan_and_wrong_group_never_write(tmp_path: Path) -> None:
    client = FakeClient()
    plan = importer.prepare(client, client.snapshot(), [DEFAULT_RIS[0]])
    client.version += 1
    with pytest.raises(ValueError, match="Library changed"):
        importer.apply(client, plan, tmp_path)
    plan["group"] = "other"
    with pytest.raises(ValueError, match="another group"):
        importer.apply(client, plan, tmp_path)
    assert client.writes == 0


def test_client_rejects_existing_item_and_wrong_endpoint_writes() -> None:
    client = importer.GroupClient("unused")
    with pytest.raises(ValueError, match="Existing-item"):
        client.request(f"/groups/{GROUP_ID}/items", [{"key": "EXISTING"}], 1)
    with pytest.raises(ValueError, match="Only version-guarded"):
        client.request("/groups/other/items", [{}], 1)


@pytest.mark.parametrize(
    "access",
    [
        {"groups": {"all": {"library": True, "write": True}}},
        {
            "user": {"library": True},
            "groups": {GROUP_ID: {"library": True, "write": True}},
        },
        {"groups": {GROUP_ID: {"library": True}}},
    ],
)
def test_broader_or_read_only_keys_are_rejected(monkeypatch, access: dict) -> None:
    client = importer.GroupClient("unused")
    monkeypatch.setattr(client, "request", lambda *args: ({"access": access}, None))
    with pytest.raises(ValueError):
        client.check_access()
