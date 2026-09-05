"""Build the local working collection from the canonical linked paper inventory.

The public result ZIP is separately emitted by build_release using reviewed data.
This archive is an explicitly labelled working snapshot, never a public release.
"""
import json
from pathlib import Path

from src.assess.artifact_verification import safe_path
from src.publish.build_release import paper_filename, zip_bytes

ROOT = Path(__file__).resolve().parents[2]


def build(repo: Path = ROOT) -> bytes:
    payload = json.loads((repo / "docs/data/research_vault_v2.json").read_text(encoding="utf-8"))
    documents = {}
    links = []
    seen_ids = set()
    for paper in sorted(payload["papers"], key=lambda item: item["id"]):
        filename = paper_filename(paper["id"])
        if paper["id"] in seen_ids:
            raise ValueError(f"Duplicate corpus record ID: {paper['id']}")
        seen_ids.add(paper["id"])
        reference = paper.get("knowledge_doc")
        if not reference:
            continue
        path = safe_path(repo / "docs", reference)
        if not path.is_relative_to((repo / "docs/vault/Papers").resolve()) or path.suffix != ".md":
            raise ValueError(f"Knowledge document is outside the paper-note collection: {reference}")
        if not path.is_file():
            raise ValueError(f"Missing linked knowledge document: {reference}")
        # Keep physical file identity, with short IDs to avoid Windows path limits.
        if path not in documents:
            documents[path] = (filename, path.read_bytes().replace(b"\r\n", b"\n"))
        links.append({"record_id": paper["id"], "work_id": paper["work_id"],
                      "version_id": paper["version_id"], "knowledge_doc": documents[path][0]})
    files = {name: body for name, body in documents.values()}
    files["README.md"] = ("# FemPrompt working collection\n\n"
        "Historical and provisional research material, not a completed or uniformly verified synthesis.\n"
        "The source-reviewed public release is built separately with agent/model/date attribution.\n"
        "record-index.json retains aliases and exact bibliographic Versions. Document reuse across records "
        "does not establish that the source was read in each of those Versions.\n").encode("utf-8")
    files["record-index.json"] = (json.dumps(links, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
    return zip_bytes(files)


def main() -> None:
    output = ROOT / "docs/downloads/vault.zip"
    output.parent.mkdir(parents=True, exist_ok=True)
    body = build()
    if not output.exists() or output.read_bytes() != body:
        temporary = output.with_suffix(".zip.tmp")
        temporary.write_bytes(body)
        temporary.replace(output)
    print("OK: working archive generated from canonical knowledge links")


if __name__ == "__main__":
    main()
