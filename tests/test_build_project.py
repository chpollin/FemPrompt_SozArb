import json

import pytest

from src.publish import build_project


def test_local_settings_and_temporary_audits_do_not_change_portable_build_inputs(
    tmp_path, monkeypatch
):
    monkeypatch.setattr(build_project, "OUTPUTS", ())
    monkeypatch.setattr(build_project, "OUTPUT_DIRS", ())
    for name in (
        "docs/js/config.local.js",
        "docs/js/chat.js",
        "generated/distilled/_evidence_audit/summary.md",
        "generated/distilled/study.md",
    ):
        path = tmp_path / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text("test", encoding="utf-8")
    assert set(build_project.snapshot(tmp_path)["inputs"]) == {
        "docs/js/chat.js",
        "generated/distilled/study.md",
    }


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


def test_original_converter_output_is_local_but_bound_source_is_portable(
    tmp_path, monkeypatch
):
    monkeypatch.setattr(build_project, "OUTPUTS", ())
    monkeypatch.setattr(build_project, "OUTPUT_DIRS", ())
    names = (
        "generated/source-acquisition/completion-20260921/oa-markdown/J4K3XA52.md",
        "corpus/source-acquisition/completion-20260921/J4K3XA52.identity-bound.md",
        "corpus/source-acquisition/completion-20260921/SHJQQTI6-repaired-r2.md",
        "generated/source-acquisition/completion-20260921/conversion-qc/SHJQQTI6-repair-4.png",
        "generated/source-acquisition/completion-20260921/conversion-qc/oa-review/J4K3XA52-contact.png",
        "generated/source-acquisition/audit-2026-09-21/markdown-new-bytes/136b6db72d8a7b8d390c.md",
    )
    source = (build_project.ROOT / names[1]).read_text(encoding="utf-8")
    for name in names:
        path = tmp_path / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(source, encoding="utf-8")
    assert set(build_project.snapshot(tmp_path)["inputs"]) == {names[1]}
