#!/usr/bin/env python3
"""Deterministic anchor check for research-vault/20_claims/.

A claim may only reference the distillate layer, and every wikilink must
resolve: [[stem]] to research-vault/10_distillates/<stem>.md, [[stem#Heading]]
additionally to an existing heading in that file. Links between claim
documents and to their topic map resolve within 20_claims/. The `grounded`
status of a claim is only legitimate while this check passes; run it after
every change to the layer.

Exit code 0 means all anchors resolve. Run:
python src/publish/check_claims.py
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
CLAIMS = REPO / "research-vault" / "20_claims"
DIST = REPO / "research-vault" / "10_distillates"

WIKILINK = re.compile(r"\[\[([^\]|#]+)(?:#([^\]|]+))?(?:\|[^\]]+)?\]\]")


def headings(path: Path) -> set[str]:
    return {m.group(1).strip()
            for m in re.finditer(r"^#{1,6}\s+(.+)$", path.read_text(encoding="utf-8"), re.M)}


def main() -> int:
    errors = []
    for f in sorted(CLAIMS.glob("*.md")):
        for m in WIKILINK.finditer(f.read_text(encoding="utf-8")):
            target, head = m.group(1).strip(), m.group(2)
            cand_dist = DIST / f"{target}.md"
            cand_claim = CLAIMS / f"{target}.md"
            if cand_dist.exists():
                cand = cand_dist
            elif cand_claim.exists():
                cand = cand_claim
            else:
                errors.append(f"{f.name}: Ziel fehlt: [[{target}]]")
                continue
            if head and head.strip() not in headings(cand):
                errors.append(f"{f.name}: Anker fehlt: [[{target}#{head}]]")
    if errors:
        print("FAIL")
        for e in errors:
            print(" ", e)
        return 1
    print("OK: alle Claim-Anker aufgelöst")
    return 0


if __name__ == "__main__":
    sys.exit(main())
