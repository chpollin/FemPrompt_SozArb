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
    assert all(len(name) <= 100 for name in (first, second, third))
