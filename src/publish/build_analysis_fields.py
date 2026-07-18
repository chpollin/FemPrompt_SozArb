#!/usr/bin/env python3
"""Emit the analysis-field vocabulary for the PRISM analysis panel (FR-14, ADR-026).

The static PRISM app cannot read assessment/categories.yaml directly, and a
hand-kept second vocabulary list in the JS would be a second source of truth that
drifts from the frozen schema. This script is the one seam: it reads the frozen
analysis_fields block from assessment/categories.yaml (v1.3) and writes it to
docs/data/analysis_fields.json, which prisma.js loads the way it loads the
full-text manifest. The panel's closed selections are fed only from this file, so
no code path can produce a value outside the frozen vocabulary.

The Studientyp vocabulary (existing study_types) travels along, because
update-protocol D makes Studientyp required for Include and the analysis export
carries it; it is not an AN_ field but is read from the same source here.

Output: docs/data/analysis_fields.json
  { "meta": {...}, "version": "1.3",
    "fields": [ { "name", "multi", "values"[, "optional", "free_text", ...] } ],
    "study_types": [...] }

Run: python src/publish/build_analysis_fields.py

No third-party YAML dependency: the analysis_fields block is a small, regular
subset of YAML (a list of mappings with scalar and inline-list values plus folded
notes), parsed here directly to keep the build dependency-free like the rest of
src/publish.
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
YAML_IN = ROOT / "assessment" / "categories.yaml"
JSON_OUT = ROOT / "docs" / "data" / "analysis_fields.json"

VERSION_RE = re.compile(r"^#\s*Version:\s*([0-9.]+)")
INLINE_LIST_RE = re.compile(r"^\[(.*)\]$")


def parse_scalar(v: str):
    """A YAML scalar as written in this file: an inline [a, b] list, a bare bool,
    or a quoted / bare string. Notes and multi-line folded values are ignored by
    the caller; only the fields the panel needs are read."""
    v = v.strip()
    m = INLINE_LIST_RE.match(v)
    if m:
        inner = m.group(1).strip()
        if not inner:
            return []
        return [x.strip() for x in inner.split(",") if x.strip()]
    if v in ("true", "false"):
        return v == "true"
    if len(v) >= 2 and v[0] in "\"'" and v[-1] == v[0]:
        return v[1:-1]
    return v


def parse_block(lines, start, end):
    """Parse the list of `- name: ...` field mappings between line indices
    [start, end). Each field is a dict of the scalar keys the panel reads."""
    fields = []
    cur = None
    for i in range(start, end):
        raw = lines[i]
        if not raw.strip() or raw.lstrip().startswith("#"):
            continue
        # a new list item starts at "  - key: value"
        item = re.match(r"^\s*-\s+(\w+):\s*(.*)$", raw)
        if item:
            if cur is not None:
                fields.append(cur)
            cur = {}
            cur[item.group(1)] = parse_scalar(item.group(2))
            continue
        # a continuation key of the current item: "    key: value"
        kv = re.match(r"^\s+(\w+):\s*(.*)$", raw)
        if kv and cur is not None:
            cur[kv.group(1)] = parse_scalar(kv.group(2))
    if cur is not None:
        fields.append(cur)
    return fields


def section_bounds(lines, key):
    """Line index of a top-level `key:` and the index where its block ends
    (the next top-level key or EOF). Top-level keys start at column 0."""
    start = None
    for i, ln in enumerate(lines):
        if re.match(r"^" + re.escape(key) + r":\s*$", ln):
            start = i + 1
            break
    if start is None:
        return None, None
    end = len(lines)
    for i in range(start, len(lines)):
        if re.match(r"^\S", lines[i]) and not lines[i].startswith("#"):
            end = i
            break
    return start, end


def main() -> int:
    if not YAML_IN.exists():
        print(f"ERROR: {YAML_IN} not found", file=sys.stderr)
        return 1
    text = YAML_IN.read_text(encoding="utf-8")
    lines = text.split("\n")

    version = ""
    for ln in lines[:5]:
        m = VERSION_RE.match(ln)
        if m:
            version = m.group(1)
            break

    af_start, af_end = section_bounds(lines, "analysis_fields")
    if af_start is None:
        print("ERROR: analysis_fields block not found in categories.yaml", file=sys.stderr)
        return 1
    raw_fields = parse_block(lines, af_start, af_end)

    # Keep only the keys the panel consumes; drop notes/serves/binding_when, which
    # are coding guidance, not vocabulary. A single-select field is `multi: false`.
    fields = []
    for f in raw_fields:
        out = {"name": f["name"]}
        if f.get("free_text"):
            out["free_text"] = True
            fields.append(out)
            continue
        out["multi"] = bool(f.get("multi", False))
        out["values"] = f.get("values", [])
        if f.get("optional"):
            out["optional"] = True
        if f.get("binding_when"):
            out["binding_when"] = f["binding_when"]
        fields.append(out)

    st_start, st_end = section_bounds(lines, "study_types")
    study_types = []
    if st_start is not None:
        for i in range(st_start, st_end):
            m = re.match(r"^\s*-\s+(\S+)\s*$", lines[i])
            if m:
                study_types.append(m.group(1))

    payload = {
        "meta": {
            "generated_by": "src/publish/build_analysis_fields.py",
            "source": "assessment/categories.yaml",
            "note": "Closed vocabulary for the PRISM analysis panel (FR-14/ADR-026); the one source, do not hand-edit.",
        },
        "version": version,
        "fields": fields,
        "study_types": study_types,
    }
    JSON_OUT.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Wrote {JSON_OUT.relative_to(ROOT)}")
    print(f"  version: {version}  fields: {len(fields)}  study_types: {len(study_types)}")
    for f in fields:
        kind = "free" if f.get("free_text") else ("multi" if f.get("multi") else "single")
        n = len(f.get("values", []))
        print(f"    {f['name']:22} {kind:6} {n} values" + (" (optional)" if f.get("optional") else ""))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
