"""Tests for the downloadable paper-collection publisher."""

import importlib.util
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location(
    "generate_vault_v2",
    ROOT / "src" / "publish" / "generate_vault_v2.py",
)
vault_module = importlib.util.module_from_spec(spec)
sys.modules["generate_vault_v2"] = vault_module
spec.loader.exec_module(vault_module)


def test_unique_filename_prevents_case_insensitive_overwrite(tmp_path: Path) -> None:
    generator = vault_module.VaultV2Generator(base_path=tmp_path)
    used: set[str] = set()

    first = generator._unique_filename("A" * 140, "First_source", used)
    second = generator._unique_filename("a" * 140, "Second_source", used)
    third = generator._unique_filename("A" * 140, "Second_source", used)

    assert len({first.casefold(), second.casefold(), third.casefold()}) == 3
    assert all(len(name) <= 72 for name in (first, second, third))


def test_assessments_read_case_and_human_diversity_column(tmp_path: Path) -> None:
    generator = vault_module.VaultV2Generator(base_path=tmp_path)
    generator.llm_csv_path = tmp_path / "llm.csv"
    generator.human_csv_path = tmp_path / "human.csv"
    generator.llm_csv_path.write_text(
        "Zotero_Key,Decision,Gender\nA,Include,ja\n", encoding="utf-8")
    generator.human_csv_path.write_text(
        "Zotero_Key,Decision,Diversitaet / Intersektionalität\nA,Include,Ja\n",
        encoding="utf-8")

    generator._load_assessments()

    assert generator.llm_assessments["A"]["categories"]["Gender"] is True
    assert generator.human_assessments["A"]["categories"]["Diversitaet"] is True
