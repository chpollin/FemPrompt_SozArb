import json
import threading
from http.client import HTTPConnection
from http.server import ThreadingHTTPServer

import pytest

from src.publish.serve import Handler

VALID = {"schema": "femprompt-prisma-reviewer/0.5", "reviewer": "sabine", "actor": "human", "decisions": {}}


@pytest.fixture()
def server(tmp_path):
    screening = tmp_path / "docs/data/screening"
    screening.mkdir(parents=True)
    (tmp_path / "docs/prisma.html").write_text("<!doctype html>", encoding="utf-8")
    (screening / "assignment.json").write_text(json.dumps({
        "schema": "femprompt-prisma-assignment/1.0",
        "reviewers": [{"key": "sabine", "label": "Sabine"}, {"key": "susi", "label": "Susi"}],
        "assignments": {},
    }), encoding="utf-8")
    handler = type("TestHandler", (Handler,), {"repo": tmp_path, "log_message": lambda *a: None})
    httpd = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    yield httpd, screening
    httpd.shutdown()


def request(httpd, method, path, body=None, headers=None):
    port = httpd.server_address[1]
    connection = HTTPConnection("127.0.0.1", port)
    base = {"Origin": f"http://127.0.0.1:{port}", "Content-Type": "application/json"}
    connection.request(method, path, body=body, headers={**base, **(headers or {})})
    response = connection.getresponse()
    return response.status, response.getheader("X-Prism-Clone"), response.read().decode("utf-8")


def put(httpd, name, payload, **headers):
    return request(httpd, "PUT", f"/__prism/screening/{name}", json.dumps(payload).encode("utf-8"), headers)


def test_own_page_writes_an_assigned_reviewer_file(server):
    httpd, screening = server
    status, _, _ = put(httpd, "sabine.json", VALID)
    assert status == 200
    assert json.loads((screening / "sabine.json").read_text(encoding="utf-8")) == VALID


@pytest.mark.parametrize("headers", [
    {"Origin": "https://example.org"},
    {"Origin": ""},
    {"Host": "attacker.example:80"},
])
def test_requests_from_other_origins_or_hosts_are_refused(server, headers):
    httpd, screening = server
    status, _, _ = put(httpd, "sabine.json", VALID, **headers)
    assert status == 403
    assert not (screening / "sabine.json").exists()


@pytest.mark.parametrize("name,payload", [
    ("ar2.json", {**VALID, "reviewer": "ar2"}),
    ("assignment.json", {**VALID, "reviewer": "assignment"}),
    ("sabine.json", {**VALID, "actor": "agent"}),
    ("sabine.json", {**VALID, "reviewer": "susi"}),
    ("sabine.json", {**VALID, "schema": "other/1.0"}),
    ("..%2Fprisma.json", {**VALID, "reviewer": "prisma"}),
])
def test_only_a_human_reviewer_file_of_an_assigned_key_is_written(server, name, payload):
    httpd, screening = server
    before = sorted(p.name for p in screening.iterdir())
    status, _, _ = put(httpd, name, payload)
    assert status == 400
    assert sorted(p.name for p in screening.iterdir()) == before


def test_clone_info_and_marker_header(server):
    httpd, _ = server
    status, marker, _ = request(httpd, "HEAD", "/prisma.html")
    assert status == 200 and marker == "1"
    status, _, body = request(httpd, "GET", "/__prism/clone")
    assert status == 200 and json.loads(body)["reviewers"] == ["sabine", "susi"]
