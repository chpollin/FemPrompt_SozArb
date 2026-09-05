"""Build a deterministic, source-bound public chat index from the active vault.

Only assertion statements and their cited distillate blocks are exported. Legacy
claims, abstracts, screening rationales and local full texts are not chat evidence.
The policy controls eligible maturity states; an AI review additionally needs a
current, attributed verification receipt. Validation never promotes maturity.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from datetime import date
from pathlib import Path
from typing import Any
from urllib.parse import quote, urlsplit

REPO_ROOT = Path(__file__).resolve().parents[2]
if __package__ in (None, ""):
    sys.path.insert(0, str(REPO_ROOT))

from src.analysis.work_versions import load_registry, lookup_by_record
from src.assess.artifact_verification import SCHEMA as LEDGER_SCHEMA, validated_reviews
from src.publish.validate_research_vault import (
    Document,
    ValidationReport,
    WIKILINK,
    _check_metadata,
    _parse_document,
)

DEFAULT_VAULT = REPO_ROOT / "research-vault"
DEFAULT_REGISTRY = REPO_ROOT / "corpus/work_version_registry.json"
DEFAULT_POLICY = REPO_ROOT / "config/publication_policy.json"
DEFAULT_LEDGER = REPO_ROOT / "generated/verification/ai-source-reviews.json"
DEFAULT_OUTPUT = REPO_ROOT / "docs/data/assertion_index.json"
SCHEMA = "femprompt-assertion-index/0.1"


def _read_json(path: Path) -> dict[str, Any]:
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValueError(f"{path}: expected JSON object")
    return value


def _required_text(value: Any, label: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{label}: expected nonempty text")
    return value.strip()


def _document(path: Path, vault: Path) -> Document:
    report = ValidationReport()
    doc = _parse_document(path, vault, report)
    if doc is None:
        raise ValueError("; ".join(report.errors))
    return doc


def _check_publishable(doc: Document) -> None:
    report = ValidationReport()
    _check_metadata(doc, report)
    if report.errors:
        raise ValueError("; ".join(report.errors))
    checked = doc.metadata["checked"]
    latest = max(date.fromisoformat(str(value)[:10]) for value in checked.values())
    updated = date.fromisoformat(str(doc.metadata["updated"])[:10])
    if updated > latest:
        raise ValueError(f"{doc.key}: content is newer than its checks")


def _section(body: str, heading: str) -> str:
    match = re.search(r"^## " + re.escape(heading) + r"\s*\n(.*?)(?=^## |\Z)", body, re.M | re.S)
    return match.group(1).strip() if match else ""


def _safe_url(value: str) -> str:
    parsed = urlsplit(value)
    if (
        parsed.scheme not in ("https", "http") or not parsed.hostname
        or parsed.username or parsed.password
        or re.search(r'[\s<>"\[\]\\]', value)
    ):
        raise ValueError(f"invalid public source URL: {value!r}")
    return value


def _source_identity(value: str) -> str:
    """Compare DOI/arXiv notation with the exact version's registered URLs."""
    value = value.strip().casefold().rstrip("/")
    value = re.sub(r"^https?://(?:dx\.)?doi\.org/", "doi:", value)
    value = re.sub(r"^doi:10\.48550/arxiv\.", "arxiv:", value)
    value = re.sub(r"^https?://arxiv\.org/(?:abs|pdf)/", "arxiv:", value)
    return value.removesuffix(".pdf") if value.startswith("arxiv:") else value


def _evidence_block(doc: Document, block_id: str) -> tuple[str, str, str, str]:
    core = _section(doc.body, "Core statements")
    matches = list(re.finditer(
        r"^- (.+?) \^" + re.escape(block_id) + r"\s*$", core, re.M
    ))
    if len(matches) != 1:
        raise ValueError(f"{doc.key}: expected one core statement block {block_id}")
    match = matches[0]
    tail = re.split(r"^[-#]", core[match.end():], maxsplit=1, flags=re.M)[0]
    excerpt = " ".join(re.findall(r"^\s*>\s*(.+)$", tail, re.M))
    citation = re.fullmatch(r'["“](.+)["”]\s*\((.+?),\s*(.+)\)', excerpt)
    if citation is None:
        raise ValueError(f"{doc.key}#^{block_id}: quote needs a source identifier and locator")
    quotation, identifier, locator = (part.strip() for part in citation.groups())
    if len(quotation) > 2400:
        raise ValueError(f"{doc.key}#^{block_id}: evidence must be a short excerpt")
    if not quotation or not locator:
        raise ValueError(f"{doc.key}#^{block_id}: empty evidence or locator")
    if identifier.lower().startswith("doi:"):
        url = "https://doi.org/" + quote(identifier[4:], safe="/().:;-")
    elif identifier.lower().startswith("arxiv:"):
        url = "https://arxiv.org/abs/" + quote(identifier[6:], safe="./-")
    else:
        url = _safe_url(identifier)
    return match.group(1).strip(), quotation, locator, _safe_url(url)


def _references(vault: Path) -> dict[str, dict[str, Any]]:
    refs = {}
    for path in sorted((vault / "references").glob("*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        for item in data if isinstance(data, list) else [data]:
            if not isinstance(item, dict) or not item.get("id"):
                raise ValueError(f"{path}: invalid bibliographic reference")
            if item["id"] in refs:
                raise ValueError(f"duplicate reference ID: {item['id']}")
            refs[item["id"]] = item
    return refs


def _stable_id(prefix: str, key: str) -> str:
    return prefix + hashlib.sha256(key.encode("utf-8")).hexdigest()[:16]


def _receipt(doc: Document, reviews: dict[str, Any]) -> dict[str, Any] | None:
    """A maturity label alone is not proof that an attributed review occurred."""
    artifact = "research-vault/" + doc.key + ".md"
    review = reviews.get(artifact)
    if review is None:
        return None
    return {"type": "ai-source-review", "artifact_sha256": review["sha256"],
            **{key: review[key] for key in ("agent_id", "model", "reviewed_at", "findings")},
            **({"model_id_status": review["model_id_status"]} if review.get("model_id_status") else {})}


def _check_receipt_evidence(
    doc: Document, reviews: dict[str, Any], work_id: str, version_id: str,
    source_url: str, locator: str, excerpt: str,
) -> None:
    receipt = reviews.get("research-vault/" + doc.key + ".md")
    if receipt is None:
        return
    if not any(
        source["work_id"] == work_id and source["version_id"] == version_id
        and _source_identity(str(source.get("source_url", ""))) == _source_identity(source_url)
        and source["locator"] == locator
        and " ".join(str(source.get("quote", "")).split()) == " ".join(excerpt.split())
        for source in receipt["evidence"]
    ):
        raise ValueError(f"{doc.key}: AI review does not cover quoted evidence at {locator}")


def build_index(
    vault: Path = DEFAULT_VAULT,
    registry_path: Path = DEFAULT_REGISTRY,
    policy_path: Path = DEFAULT_POLICY,
    ledger_path: Path = DEFAULT_LEDGER,
    repo: Path | None = None,
) -> dict[str, Any]:
    policy = _read_json(policy_path) if policy_path.is_file() else {
        "allowed_states": ["publication-approved"], "public_label": "Publikationsfreigegeben"
    }
    allowed = policy.get("allowed_states")
    if not isinstance(allowed, list) or not allowed or any(
        state not in ("ai-agent-reviewed", "verified", "publication-approved") for state in allowed
    ):
        raise ValueError("publication policy: invalid allowed_states")
    ledger = _read_json(ledger_path) if ledger_path.is_file() else {"schema": LEDGER_SCHEMA, "reviews": []}
    repo = repo or vault.parent
    reviews = validated_reviews(repo, ledger)
    registry = load_registry(registry_path)
    from src.analysis.historical_resolution import load_source_holds
    source_holds = load_source_holds(repo)
    source_holds.update({work["work_id"]: work["source_hold"] for work in registry["works"] if work.get("source_hold")})
    references = _references(vault)
    docs = {doc.key: doc for folder in ("20_distillates", "30_assertions")
            for path in sorted((vault / folder).rglob("*.md"))
            for doc in [_document(path, vault)]}
    assertions = []
    source_count = 0
    for doc in docs.values():
        if doc.metadata.get("type") != "assertion":
            continue
        source_count += 1
        if doc.metadata.get("status") not in allowed:
            continue
        _check_publishable(doc)
        review = _receipt(doc, reviews)
        if (doc.metadata["status"] == "ai-agent-reviewed" or policy.get("ai_review_requires_attributed_receipt")) and review is None:
            continue
        grounding = doc.metadata.get("grounding")
        if not isinstance(grounding, list) or not grounding:
            raise ValueError(f"{doc.key}: assertion has no grounding")
        evidence = []
        withheld = False
        for value in grounding:
            link = WIKILINK.fullmatch(str(value))
            if link is None or not link.group(2) or not link.group(1).startswith("20_distillates/"):
                raise ValueError(f"{doc.key}: invalid grounding {value!r}")
            target, block_id = link.group(1), link.group(2)
            distillate = docs.get(target)
            if distillate is None or distillate.metadata.get("type") != "distillate":
                raise ValueError(f"{doc.key}: unresolved distillate {target}")
            meta = distillate.metadata
            if meta.get("work-id") in source_holds:
                withheld = True
                continue
            if meta.get("status") not in allowed:
                withheld = True
                continue
            _check_publishable(distillate)
            source_review = _receipt(distillate, reviews)
            if (meta["status"] == "ai-agent-reviewed" or policy.get("ai_review_requires_attributed_receipt")) and source_review is None:
                withheld = True
                continue
            if meta.get("source-type") != "publication" or "quote" not in meta["checked"]:
                raise ValueError(f"{target}: publication and checked.quote required")
            ref = references.get(meta.get("reference"))
            if ref is None:
                raise ValueError(f"{target}: unresolved reference")
            identity = {"work_id": meta["work-id"], "version_id": meta["version-id"]}
            if registry.get("record_index", {}).get(meta["record-id"]) != identity:
                raise ValueError(f"{target}: work/version identity differs from registry")
            for field in ("record-id", "work-id", "version-id", "version-type"):
                if ref.get("femprompt-" + field) != meta[field]:
                    raise ValueError(f"{target}: reference {field} differs from distillate")
            resolved = lookup_by_record(registry, meta["record-id"])
            if resolved is None:
                raise ValueError(f"{target}: record is absent from registry")
            _, version = resolved
            if version["version_type"] != meta["version-type"]:
                raise ValueError(f"{target}: version type differs from registry")
            if version.get("integrity_status") in ("retracted", "withdrawn"):
                raise ValueError(f"{target}: source version is {version['integrity_status']}")
            statement, excerpt, locator, url = _evidence_block(distillate, block_id)
            identifiers = version.get("identifiers", {})
            known_sources = {_source_identity(value) for value in identifiers.get("url", [])}
            known_sources.update(_source_identity("doi:" + value) for value in identifiers.get("doi", []))
            if _source_identity(url) not in known_sources:
                raise ValueError(f"{target}#^{block_id}: quote source is not the registered version")
            for artifact in (doc, distillate):
                _check_receipt_evidence(artifact, reviews, meta["work-id"], meta["version-id"], url, locator, excerpt)
            key = target + "#^" + block_id
            authors = [str(author.get("family") or author.get("literal") or "").strip()
                       for author in ref.get("author", [])]
            authors = [author for author in authors if author]
            year_parts = ref.get("issued", {}).get("date-parts", [[]])
            year = str(year_parts[0][0]) if year_parts and year_parts[0] else ""
            author_year = (authors[0] + (" et al." if len(authors) > 1 else "")) if authors else ""
            if year:
                author_year += " (" + year + ")"
            evidence.append({
                "id": _stable_id("E-", key), "statement_ref": key,
                "statement": statement, "quote": excerpt, "locator": locator,
                "source_url": url, "record_id": meta["record-id"], **identity,
                "version_type": meta["version-type"],
                "title": _required_text(ref.get("title"), target + ": title"),
                "author_year": author_year, "year": year, "status": meta["status"],
                "review": source_review,
            })
        if withheld:
            continue
        statement = _required_text(_section(doc.body, "Statement"), doc.key + ": Statement")
        title = re.search(r"^# (.+)$", doc.body, re.M)
        topics = doc.metadata.get("topics")
        if not isinstance(topics, list) or any(not isinstance(topic, str) for topic in topics):
            raise ValueError(f"{doc.key}: topics must be text values")
        assertions.append({
            "id": _stable_id("A-", doc.key), "assertion_ref": doc.key,
            "title": title.group(1).strip() if title else statement,
            "statement": statement, "topics": [topic.strip("[]") for topic in topics],
            "status": doc.metadata["status"], "review": review,
            "evidence": sorted({item["id"]: item for item in evidence}.values(), key=lambda item: item["id"]),
        })
    assertions.sort(key=lambda item: item["id"])
    return {
        "schema": SCHEMA,
        "meta": {
            "source_assertions": source_count, "published_assertions": len(assertions),
            "withheld_assertions": source_count - len(assertions),
            "allowed_states": allowed, "public_label": policy.get("public_label", "Quellengeprüft"),
        },
        "assertions": assertions,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--vault", type=Path, default=DEFAULT_VAULT)
    parser.add_argument("--registry", type=Path, default=DEFAULT_REGISTRY)
    parser.add_argument("--policy", type=Path, default=DEFAULT_POLICY)
    parser.add_argument("--ledger", type=Path, default=DEFAULT_LEDGER)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args(argv)
    payload = build_index(args.vault, args.registry, args.policy, args.ledger)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Chat index: {payload['meta']['published_assertions']} published, "
          f"{payload['meta']['withheld_assertions']} withheld assertions")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
