"""Generated fingerprints survive checkout newline conversion, not edits."""

import hashlib

import pytest

from src import file_hashing
from src.analysis import build_agent_screening_queue as queue
from src.analysis import build_completion_package as completion
from src.analysis import build_work_version_registry as registry
from src.publish import generate_docs_data as docs_data


@pytest.mark.parametrize("suffix", [".md", ".json", ".csv", ".ris", ".py", ".mjs", ".YAML"])
def test_canonical_file_hash_ignores_only_text_crlf(tmp_path, suffix):
    path = tmp_path / f"input{suffix}"
    lf = "first line\nsecond ä line\n".encode("utf-8")
    path.write_bytes(lf)
    expected = file_hashing.file_sha256(path)
    path.write_bytes(lf.replace(b"\n", b"\r\n"))
    assert file_hashing.file_sha256(path) == expected
    assert file_hashing.canonical_file_bytes(path) == lf
    path.write_bytes(lf.replace(b"second", b"changed"))
    assert file_hashing.file_sha256(path) != expected


@pytest.mark.parametrize("suffix", [".pdf", ".png", ".zip", ".unknown"])
def test_binary_and_unknown_file_hashes_remain_byte_exact(tmp_path, suffix):
    path = tmp_path / f"input{suffix}"
    original = b"\x00binary\r\nbytes\xff"
    path.write_bytes(original)
    expected = hashlib.sha256(original).hexdigest()
    assert file_hashing.file_sha256(path) == expected
    path.write_bytes(original.replace(b"\r\n", b"\n"))
    assert file_hashing.file_sha256(path) != expected


@pytest.mark.parametrize("builder", ["docs_data", "registry", "registry_file", "queue", "completion"])
def test_build_fingerprints_use_same_text_contract(tmp_path, monkeypatch, builder):
    monkeypatch.setattr(docs_data, "REPO_ROOT", tmp_path)
    monkeypatch.setattr(registry, "REPO", tmp_path)
    fingerprint = {
        "docs_data": lambda path: docs_data.source_fingerprint([path]),
        "registry": lambda path: registry._source_fingerprint([path]),
        "registry_file": registry._sha256,
        "queue": queue._sha256,
        "completion": completion._sha,
    }[builder]
    path = tmp_path / "input.json"
    path.write_bytes(b'{"source": "evidence"}\n')
    lf_hash = fingerprint(path)
    path.write_bytes(b'{"source": "evidence"}\r\n')
    assert fingerprint(path) == lf_hash
    path.write_bytes(b'{"source": "changed"}\n')
    assert fingerprint(path) != lf_hash
    binary = tmp_path / "source.pdf"
    binary.write_bytes(b"\x00source\r\n")
    binary_hash = fingerprint(binary)
    binary.write_bytes(b"\x00source\n")
    assert fingerprint(binary) != binary_hash


def test_completion_keeps_acquisition_hash_byte_exact(tmp_path):
    source = tmp_path / "source.md"
    original = b"source\r\ntext\r\n"
    source.write_bytes(original)
    candidates = {"records": [{"candidate_id": "one", "title": "One"}]}
    readiness = {"records": [{"candidate_id": "one", "screening_source_ready": True,
        "screening_markdown_file": "source.md", "screening_markdown_sha256": hashlib.sha256(original).hexdigest()}]}
    rows = completion._candidate_rows(tmp_path, candidates, readiness, {"record_index": {}}, set())
    assert rows[0]["source_hash_matches"]
    source.write_bytes(original.replace(b"\r\n", b"\n"))
    rows = completion._candidate_rows(tmp_path, candidates, readiness, {"record_index": {}}, set())
    assert not rows[0]["source_hash_matches"]
