import json

import pytest

from src.publish import build_project


def test_build_freshness_detects_input_and_output_changes(tmp_path, monkeypatch):
    monkeypatch.setattr(build_project, "OUTPUTS", ("out.json",))
    monkeypatch.setattr(build_project, "OUTPUT_DIRS", ())
    monkeypatch.setattr(build_project, "INPUT_GLOBS", ("source.json",))
    (tmp_path / "source.json").write_text("input", encoding="utf-8")
    (tmp_path / "out.json").write_text("output", encoding="utf-8")
    manifest = tmp_path / build_project.MANIFEST
    manifest.parent.mkdir()
    manifest.write_text(json.dumps(build_project.snapshot(tmp_path)), encoding="utf-8")
    build_project.check_build(tmp_path)
    (tmp_path / "source.json").write_text("new input", encoding="utf-8")
    with pytest.raises(ValueError, match="inputs: source.json"):
        build_project.check_build(tmp_path)
    (tmp_path / "source.json").write_text("input", encoding="utf-8")
    (tmp_path / "out.json").write_text("manually edited", encoding="utf-8")
    with pytest.raises(ValueError, match="outputs: out.json"):
        build_project.check_build(tmp_path)
