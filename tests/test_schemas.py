"""Every governed JSON file conforms to the schema that describes it.

The schemas in schemas/ document the generated and governed contracts. This
check keeps them bound to the real files, so a schema cannot drift into a
description of data that no generator produces.
"""

import json
from pathlib import Path

import pytest

from src.publish.validate_schemas import (
    BINDINGS,
    REPO,
    bound_files,
    collect_errors,
    schema_path,
    validate_file,
)

jsonschema = pytest.importorskip("jsonschema")


@pytest.mark.parametrize("stem", sorted(BINDINGS))
def test_schema_file_is_valid_draft_2020_12(stem: str) -> None:
    path = schema_path(stem)
    assert path.exists(), f"missing schema file {path.name}"
    schema = json.loads(path.read_text(encoding="utf-8"))
    jsonschema.Draft202012Validator.check_schema(schema)
    assert schema["$schema"] == "https://json-schema.org/draft/2020-12/schema"


@pytest.mark.parametrize("stem", sorted(BINDINGS))
def test_every_bound_file_validates(stem: str) -> None:
    paths = bound_files(stem)
    if not paths:
        pytest.skip(f"no file present for {stem} in this checkout")
    for path in paths:
        errors = validate_file(stem, path)
        assert not errors, "\n".join(errors)


def test_repository_has_no_schema_violations() -> None:
    assert collect_errors() == []


def test_a_broken_document_is_reported_with_its_path(tmp_path: Path) -> None:
    """The check reports the offending path rather than only failing."""
    source = REPO / "corpus" / "work_version_registry.json"
    document = json.loads(source.read_text(encoding="utf-8"))
    document["works"][0]["versions"][0]["version_type"] = "not_a_version_type"
    broken = tmp_path / "corpus" / "work_version_registry.json"
    broken.parent.mkdir(parents=True)
    broken.write_text(json.dumps(document), encoding="utf-8")

    errors = validate_file("femprompt-work-version-registry-0.1", broken)

    assert len(errors) == 1
    assert "/works/0/versions/0/version_type" in errors[0]


def test_reviewer_schema_admits_the_optional_verification_keys() -> None:
    """PRISM appends verification records to an otherwise unchanged track."""
    stem = "femprompt-prisma-reviewer-0.5"
    tracks = bound_files(stem)
    if not tracks:
        pytest.skip("no reviewer track present in this checkout")
    document = json.loads(tracks[0].read_text(encoding="utf-8"))
    document["verification_schema"] = "femprompt-prisma-verification/0.1"
    document["verifications"] = [{"paper_id": "ABCD1234", "outcome": "accepted"}]
    schema = json.loads(schema_path(stem).read_text(encoding="utf-8"))

    jsonschema.Draft202012Validator(schema).validate(document)
