"""Anchor check of the claims layer: a wikilink written as an example inside code
markup documents the syntax and is not a reference, while a real dead anchor must
still fail. The `grounded` status of the layer rides on this distinction."""
import importlib.util
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("check_claims", ROOT / "src" / "publish" / "check_claims.py")
cc = importlib.util.module_from_spec(spec)
sys.modules["check_claims"] = cc
spec.loader.exec_module(cc)


def _layer(
    tmp_path: Path, claim_text: str, distillate: str = "# Titel\n\n## Kernbefund\n\nText.\n"
) -> tuple[Path, Path]:
    claims = tmp_path / "20_claims"
    dist = tmp_path / "10_distillates"
    claims.mkdir()
    dist.mkdir()
    (dist / "Quelle_2026_Titel.md").write_text(distillate, encoding="utf-8")
    (claims / "INDEX.md").write_text(claim_text, encoding="utf-8")
    return claims, dist


def test_inline_code_example_is_not_a_reference(tmp_path: Path) -> None:
    claims, dist = _layer(tmp_path, "Anker werden als `[[Distillat#Ueberschrift]]` referenziert.\n")
    assert cc.collect_errors(claims, dist) == []


def test_fenced_code_example_is_not_a_reference(tmp_path: Path) -> None:
    claims, dist = _layer(tmp_path, "Schema:\n\n```\n[[Distillat#Ueberschrift]]\n```\n")
    assert cc.collect_errors(claims, dist) == []


def test_missing_target_still_fails(tmp_path: Path) -> None:
    claims, dist = _layer(tmp_path, "Beleg: [[Fehlende_Quelle#Kernbefund]].\n")
    errors = cc.collect_errors(claims, dist)
    assert len(errors) == 1
    assert "Fehlende_Quelle" in errors[0]


def test_missing_heading_still_fails(tmp_path: Path) -> None:
    claims, dist = _layer(tmp_path, "Beleg: [[Quelle_2026_Titel#Fehlender_Anker]].\n")
    errors = cc.collect_errors(claims, dist)
    assert len(errors) == 1
    assert "Anker fehlt" in errors[0]


def test_real_reference_beside_an_example_resolves(tmp_path: Path) -> None:
    claims, dist = _layer(
        tmp_path,
        "Form ist `[[Distillat#Kernbefund]]`, hier ein Beleg: [[Quelle_2026_Titel#Kernbefund]].\n",
    )
    assert cc.collect_errors(claims, dist) == []


def test_repository_claim_layer_is_nonempty_and_resolves() -> None:
    claim_files = sorted(cc.CLAIMS.glob("*.md"))
    assert claim_files, "the repository must contain claim documents"
    link_count = sum(
        len(cc.WIKILINK.findall(cc.strip_code(path.read_text(encoding="utf-8"))))
        for path in claim_files
    )
    assert link_count > 0, "the claim layer must contain at least one real wikilink"
    assert cc.collect_errors(cc.CLAIMS, cc.DIST) == []
