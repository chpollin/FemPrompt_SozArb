"""Exercise a real corpus title correction against external-write failure modes."""

import copy
import json

import pytest

from src.acquire import zotero_title_correction as correction


@pytest.fixture
def plan():
    raw = json.loads(
        (correction.REPO / "corpus/zotero_export.json").read_text(encoding="utf-8")
    )
    before = copy.deepcopy(next(item for item in raw if item["key"] == "SHJQQTI6"))
    source = "generated/markdown/Gohar_2023_Survey.md"
    return {
        "group_id": correction.GROUP_ID,
        "before": before,
        "title": "A Survey on Intersectional Fairness in Machine Learning: Notions, Mitigation, and Challenges",
        "evidence": [
            {
                "source_path": source,
                "sha256": correction.artifact_hash(correction.REPO, source),
                "source_url": "https://www.ijcai.org/proceedings/2023/742",
                "locator": "Article title",
                "quote": "A Survey on Intersectional Fairness in Machine Learning: Notions, Mitigation, and Challenges",
            }
        ],
    }


class Client:
    key = "test-credential-never-in-receipt"

    def __init__(self, item):
        self.item = copy.deepcopy(item)

    def request(self, path):
        assert path == f"/groups/{correction.GROUP_ID}/items/{self.item['key']}"
        return {"data": copy.deepcopy(self.item)}, self.item["version"]


@pytest.mark.parametrize("field", ["quote", "title"])
def test_evidence_must_resolve_and_support_new_title(
    plan, tmp_path, monkeypatch, field
):
    if field == "quote":
        plan["evidence"][0]["quote"] = plan["before"]["title"]
    else:
        plan["title"] = plan["before"]["title"] + " "
    client = Client(plan["before"])
    monkeypatch.setattr(
        correction, "patch_title", lambda *args: pytest.fail("no write")
    )
    with pytest.raises(ValueError, match="resolving title quotation"):
        correction.apply_correction(client, plan, tmp_path / "receipt.json")


@pytest.mark.parametrize("uncertain", [False, True])
def test_readback_resolves_a_successful_write_even_after_timeout(
    plan, tmp_path, monkeypatch, uncertain
):
    client = Client(plan["before"])

    def patch(client, before, title):
        client.item["title"] = title
        if uncertain:
            raise TimeoutError(client.key)

    monkeypatch.setattr(correction, "patch_title", patch)
    receipt_path = tmp_path / "receipt.json"
    result = correction.apply_correction(client, plan, receipt_path)
    assert result["status"] == "verified"
    assert client.key not in receipt_path.read_text(encoding="utf-8")
    with pytest.raises(ValueError, match="already exists"):
        correction.apply_correction(client, plan, receipt_path)


def test_stale_item_is_rejected_before_any_write(plan, tmp_path, monkeypatch):
    client = Client(plan["before"])
    client.item["version"] += 1
    monkeypatch.setattr(
        correction, "patch_title", lambda *args: pytest.fail("write must not run")
    )
    with pytest.raises(ValueError, match="changed since planning"):
        correction.apply_correction(client, plan, tmp_path / "receipt.json")


def test_unrelated_field_loss_fails_readback(plan, tmp_path, monkeypatch):
    client = Client(plan["before"])

    def patch(client, before, title):
        client.item["title"] = title
        client.item["creators"] = []

    monkeypatch.setattr(correction, "patch_title", patch)
    receipt_path = tmp_path / "receipt.json"
    with pytest.raises(RuntimeError, match="not verified"):
        correction.apply_correction(client, plan, receipt_path)
    assert json.loads(receipt_path.read_text(encoding="utf-8"))[
        "mismatched_fields"
    ] == ["creators"]


def test_http_request_is_title_only_and_version_guarded(plan, monkeypatch):
    captured = []

    class Response:
        status = 204

        def __enter__(self):
            return self

        def __exit__(self, *args):
            return None

    def open_request(request, timeout):
        captured.append(request)
        assert timeout == 45
        return Response()

    monkeypatch.setattr(correction, "urlopen", open_request)
    correction.patch_title(Client(plan["before"]), plan["before"], plan["title"])
    request = captured[0]
    assert request.method == "PATCH"
    assert json.loads(request.data) == {"title": plan["title"]}
    assert request.get_header("If-unmodified-since-version") == str(
        plan["before"]["version"]
    )
