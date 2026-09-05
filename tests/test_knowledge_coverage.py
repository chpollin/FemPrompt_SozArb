import copy
import json

import pytest

from src.analysis.knowledge_coverage import build_knowledge_coverage


def write(repo, path, value):
    target = repo / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(value) if not isinstance(value, str) else value, encoding="utf-8")


def fixture(repo):
    registry = {"record_index": {"A": {"work_id": "W1"}, "B": {"work_id": "W1"}, "C": {"work_id": "W2"}, "D": {"work_id": "W3"}}}
    write(repo, "docs/data/research_vault_v2.json", {"papers": [
        {"id": "A", "work_id": "W1", "knowledge_doc": "vault/Papers/shared.md"},
        {"id": "B", "work_id": "W1", "knowledge_doc": None},
        {"id": "C", "work_id": "W2", "knowledge_doc": "vault/Papers/shared.md"},
        {"id": "D", "work_id": "W3", "knowledge_doc": "vault/Papers/missing.md"},
    ]})
    write(repo, "docs/vault/Papers/shared.md", "# Unreviewed legacy summary\n")
    write(repo, "docs/data/concept_graph.json", {"nodes": [{"id": "x"}, {"id": "y"}, {"id": "z"}],
        "edges": [{"source": "x", "target": "y", "weight": 2}],
        "paper_concepts": {"A": ["x"], "B": ["x"], "D": ["y"], "old_stem": ["x"], "C": []}})
    return registry


def test_separates_records_works_documents_and_does_not_promote_shared_identity(tmp_path):
    registry = fixture(tmp_path)
    original = copy.deepcopy(registry)
    inputs = set()
    result = build_knowledge_coverage(tmp_path, registry, inputs)
    assert result["counts"] == {"canonical_records": 4, "record_bound_works": 3, "linked_records": 2,
        "linked_works": 2, "distinct_linked_documents": 1, "missing_link_records": 1,
        "broken_link_records": 1, "works_without_linked_document": 1, "shared_documents_across_works": 1}
    assert result["shared_documents_across_works"] == [{"knowledge_doc": "docs/vault/Papers/shared.md", "work_ids": ["W1", "W2"], "record_ids": ["A", "C"]}]
    assert result["works_without_document"] == [{"work_id": "W3", "record_ids": ["D"]}]
    assert "docs/vault/Papers/shared.md" in inputs
    assert "docs/vault/Papers/missing.md" not in inputs
    assert registry == original


def test_graph_retains_unbound_keys_missing_maps_and_isolated_nodes(tmp_path):
    result = build_knowledge_coverage(tmp_path, fixture(tmp_path), set())["graph"]
    assert result["canonical_mapped_records"] == 3
    assert result["canonical_mapped_works"] == 2
    assert result["unbound_record_keys"] == ["old_stem"]
    assert result["records_without_concept_map"] == ["C"]
    assert result["mapped_records_without_document"] == ["B", "D"]
    assert result["isolated_node_ids"] == ["z"]


@pytest.mark.parametrize("path", ["../../outside.md", "/outside.md", "C:/outside.md", "vault\\Papers\\outside.md", "data/private.md"])
def test_unsafe_document_links_are_broken_and_never_read(tmp_path, path):
    registry = fixture(tmp_path)
    write(tmp_path, "docs/data/research_vault_v2.json", {"papers": [{"id": "A", "work_id": "W1", "knowledge_doc": path}]})
    inputs = set()
    result = build_knowledge_coverage(tmp_path, registry, inputs)
    assert result["counts"]["linked_records"] == 0
    assert result["broken_document_links"][0]["record_id"] == "A"
    assert all(not key.startswith("..") for key in inputs)


def test_existing_file_with_stale_work_binding_is_not_coverage(tmp_path):
    registry = fixture(tmp_path)
    registry["record_index"]["A"]["work_id"] = "CORRECTED"
    result = build_knowledge_coverage(tmp_path, registry, set())
    assert result["counts"]["linked_records"] == 1
    assert result["projection_identity_mismatches"] == [{"record_id": "A", "work_id": "CORRECTED", "projected_work_id": "W1"}]
    assert any(row["reason"] == "projection_work_identity_mismatch" for row in result["broken_document_links"])


def test_active_maturity_and_legacy_files_remain_distinct_from_verified_claims(tmp_path):
    registry = fixture(tmp_path)
    for name in ("first", "second"):
        write(tmp_path, f"generated/distilled/{name}.md", "---\nsource_file: same.md\ntitle: Same title\n---\nText\n")
    write(tmp_path, "research-vault/10_distillates/first.md", "---\nlayer: distillate\naudit: P-pending\n---\n")
    write(tmp_path, "research-vault/10_distillates/INDEX.md", "---\nlayer: distillate-index\n---\n")
    write(tmp_path, "research-vault/20_distillates/p.md", "---\ntype: distillate\nstatus: ai-agent-reviewed\nwork-id: W1\n---\n")
    write(tmp_path, "research-vault/30_assertions/a.md", "---\ntype: assertion\nstatus: grounded\n---\n")
    inputs = set()
    result = build_knowledge_coverage(tmp_path, registry, inputs)
    assert result["legacy"] == {"generated_document_files": 2, "distinct_declared_source_files": 1,
        "distinct_exact_titles": 1, "migrated_distillates": 1, "migrated_audit_states": {"P-pending": 1}}
    assert result["active"]["counts_by_type"] == {"assertion": 1, "distillate": 1}
    assert result["active"]["recorded_status_counts"] == {"ai-agent-reviewed": 1, "grounded": 1}
    assert result["active"]["distillate_work_ids"] == ["W1"]
    assert "research-vault/30_assertions/a.md" in inputs
    assert "Current source-bound review receipts are evaluated separately" in result["definitions"]["active_status"]
    assert build_knowledge_coverage(tmp_path, registry, set()) == result


def test_duplicate_projected_record_fails_instead_of_hiding_coverage(tmp_path):
    registry = fixture(tmp_path)
    write(tmp_path, "docs/data/research_vault_v2.json", {"papers": [{"id": "A"}, {"id": "A"}]})
    with pytest.raises(ValueError, match="Duplicate record IDs"):
        build_knowledge_coverage(tmp_path, registry, set())
