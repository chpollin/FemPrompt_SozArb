"""Workflow-diagnostic regressions for the committed agent-run packages."""

import json

from src.assess import agent_track_diagnostics as diagnostics


def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value), encoding="utf-8")


def packet_record(decision, gender, axes=None):
    categories = {name: "nein" for name in diagnostics.CATEGORIES}
    categories["Gender"] = gender
    return {
        "categories": categories,
        "decision": decision,
        "analysis": {"AN_Bias_Axes": axes, "AN_Mitigation_Status": "Proposed"}
        if decision == "Include"
        else None,
    }


def run_fixture(tmp_path, run_id, packets, review=None):
    base = tmp_path / diagnostics.RUNS / run_id
    write(
        base / "run.json",
        {"schema": "femprompt-prisma-agent-run/1.3", "run_id": run_id},
    )
    for reviewer, decisions in packets.items():
        write(
            base / "tracks" / f"{reviewer}-coding.json",
            {"reviewer": reviewer, "decisions": decisions},
        )
    if review is not None:
        write(base / "ai-agent-review.json", {"records": review})


def test_coding_normalises_sparse_levels_and_nested_analysis():
    sparse = diagnostics.coding(
        {
            "categories": {"Gender": 2},
            "decision": "Include",
            "analysis": {
                "fields": {"AN_Bias_Axes": ["Gender", "Age"]},
                "undecidable": {"AN_Harm_Types": "nicht entscheidbar"},
            },
        }
    )
    assert sparse["Gender"] == "ja" and sparse["Fairness"] == "nein"
    assert sparse["AN_Bias_Axes"] == ("Age", "Gender")
    assert sparse["AN_Harm_Types"] == diagnostics.UNDECIDABLE
    assert sparse["AN_Population"] is None
    explicit = diagnostics.coding({"categories": {"Gender": "teilweise"}})
    assert explicit["Gender"] == "teilweise" and explicit["Fairness"] is None


def test_diagnostics_separate_track_differences_review_outcomes_and_blockers(tmp_path):
    write(
        tmp_path / "docs/data/screening/ar2.json",
        {
            "schema": "femprompt-prisma-reviewer/0.5",
            "review_runs": [{"run_id": "pooled"}],
        },
    )
    run_fixture(
        tmp_path,
        "pooled",
        {
            "ar1": {
                "P1": packet_record("Include", "ja", ["Gender"]),
                "P2": packet_record("Exclude", "nein"),
                "P3": packet_record("Include", "ja", ["Gender"]),
            },
            "ar2": {
                "P1": packet_record("Include", "teilweise", ["Age", "Gender"]),
                "P2": packet_record("Exclude", "nein"),
                "P3": packet_record("Include", "ja", ["Gender"]),
            },
        },
        {
            "P1": {
                "result": "resolved",
                "final_coding": packet_record(
                    "Include", "teilweise", ["Race_Ethnicity"]
                ),
            },
            "P2": {
                "result": "resolved",
                "final_coding": packet_record("Include", "nein", ["Gender"]),
            },
            "P3": {"result": "blocked", "rationale": "source identity unresolved"},
        },
    )
    run_fixture(tmp_path, "trial", {"ar2": {"P9": packet_record("Include", "ja")}})
    run_fixture(
        tmp_path,
        "unnamed",
        {
            "ar1": {"P8": packet_record("Include", "ja")},
            "ar2": {"P8": packet_record("Exclude", "nein")},
        },
    )
    works = [
        {
            "agent_records": [
                {
                    "record_id": "P1",
                    "state": "ai-agent-reviewed",
                    "applied_ai_correction": {
                        "changes": [
                            {"path": "/analysis/fields/AN_Bias_Axes"},
                            {"path": "/categories/Gender"},
                            {"path": "/evidence/Gender/0/term"},
                        ]
                    },
                }
            ],
            "analysis_eligible": True,
            "analysis_fields": {"AN_Coding_Basis": ["Fulltext"]},
        }
    ]
    queue = {
        "queue": [
            {"work_id": "work:x", "blockers": ["reviewed_fulltext_markdown_missing"]}
        ]
    }
    inputs = set()
    result = diagnostics.build_diagnostics(tmp_path, inputs, works, queue)
    assert result["label"] == diagnostics.LABEL
    assert "tracks/ar1-coding.json" in " ".join(sorted(inputs))
    runs = {run["run_id"]: run for run in result["runs"]}
    assert runs["pooled"]["pooled"] is True
    assert runs["trial"]["not_pooled_reason"] == "not_two_coding_packets"
    assert runs["unnamed"]["not_pooled_reason"] == "not_named_by_productive_track"
    differences = {row["field"]: row for row in result["track_differences"]}
    assert differences["decision"]["compared_records"] == 3
    assert differences["decision"]["different"] == 0
    assert differences["Gender"]["different_record_refs"] == ["pooled/P1"]
    assert differences["Gender"]["cohens_kappa"] is not None
    # Analysis fields compare only where both tracks include the work.
    assert differences["AN_Bias_Axes"]["compared_records"] == 2
    assert differences["AN_Bias_Axes"]["code_disagreements"] == {"Age": 1}
    assert "cohens_kappa" not in differences["AN_Bias_Axes"]
    outcomes = {row["field"]: row for row in result["ai_review_outcomes"]}
    assert outcomes["Gender"]["reviewed_records"] == 2
    assert outcomes["Gender"]["adopted_one_track_record_refs"] == ["pooled/P1"]
    assert outcomes["decision"]["overrode_track_agreement_record_refs"] == ["pooled/P2"]
    bias = outcomes["AN_Bias_Axes"]
    assert bias["value_from_neither_track_record_refs"] == ["pooled/P1"]
    # Both tracks excluded P2 and coded nothing; the review's Include coding overrides that.
    assert bias["overrode_track_agreement_record_refs"] == ["pooled/P2"]
    assert result["blockers"]["ai_review"]["blocked"][0]["record_ref"] == "pooled/P3"
    assert result["blockers"]["source_queue"] == {
        "reviewed_fulltext_markdown_missing": ["work:x"]
    }
    corrections = {
        row["field"]: row["records"] for row in result["accepted_ai_corrections"]
    }
    assert corrections == {"AN_Bias_Axes": 1, "Gender": 1, "evidence:Gender": 1}
    flat = {row["field"]: row for row in diagnostics.diagnostics_rows(result)}
    assert flat["Gender"]["accepted_ai_correction_records"] == 1
    assert all(row["label"] == diagnostics.LABEL for row in flat.values())
    assert "accuracy" not in json.dumps(result["track_differences"]).replace(
        "not_accuracy", ""
    )
