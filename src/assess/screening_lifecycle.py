"""Validate and project the canonical PRISM screening lifecycle.

PRISM keeps JSON as its canonical exchange format. Every decision record embeds
PROV-O-compatible provenance beside a lifecycle object; it does not require a
separate annotation registry. The deterministic migration projects an earlier
agent track to schema 0.5 without altering its input file.

Usage:
    python -m src.assess.screening_lifecycle validate path/to/track.json
    python -m src.assess.screening_lifecycle migrate input.json output-0.5.json

The contract was aligned to the frozen PRISM publisher surface on 2026-08-23.
Missing historical prompt, model, and reviewer identity data stay explicit as
``legacy_gap`` / ``unrecorded``; this module never reconstructs such values.
"""

from __future__ import annotations

import argparse
import copy
import hashlib
import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Any


SCHEMA_V03 = "femprompt-prisma-reviewer/0.3"
SCHEMA_V04 = "femprompt-prisma-reviewer/0.4"
SCHEMA_V05 = "femprompt-prisma-reviewer/0.5"
CONTRACT_PATH = (
    Path(__file__).resolve().parents[2]
    / "docs"
    / "data"
    / "screening_lifecycle_contract.json"
)


def _load_contract() -> dict[str, Any]:
    contract = json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))
    if contract.get("record_schema") != SCHEMA_V05:
        raise RuntimeError(f"Lifecycle contract does not target {SCHEMA_V05}")
    return contract


CONTRACT = _load_contract()
STATES = tuple(CONTRACT["states"])
ACTOR_TYPES = frozenset(("person", "ai_agent", "software_agent"))
ROLES = frozenset(CONTRACT["roles"])
TRANSITIONS = {(item["from"], item["to"]): item for item in CONTRACT["transitions"]}
NON_TRANSITIONS = {
    (item["state"], item["event_type"], result): item
    for item in CONTRACT["non_transition_events"]
    for result in item["results"]
}
VERIFICATION_RESULTS = frozenset(CONTRACT["verification_results"])
CHECK_STATUSES = frozenset(CONTRACT["check_statuses"])
CHECK_TYPES = frozenset(CONTRACT["check_types"])
ANNOTATION_BODY_FIELDS = (
    "categories",
    "decision",
    "override",
    "reason",
    "override_reason",
    "evidence",
    "analysis",
    "text_source",
    "ts",
    "reviewer",
    "actor",
)


def _is_mapping(value: Any) -> bool:
    return isinstance(value, dict)


def _nonempty_string(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def _validate_iso_time(value: Any, location: str, errors: list[str]) -> None:
    if not _nonempty_string(value):
        errors.append(f"{location}: timestamp is required")
        return
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        errors.append(f"{location}: invalid ISO-8601 timestamp {value!r}")
        return
    if parsed.tzinfo is None:
        errors.append(f"{location}: timestamp needs an explicit UTC offset")


def _validate_capture(value: Any, location: str, errors: list[str]) -> None:
    if not _is_mapping(value):
        errors.append(f"{location}: capture must be an object")
        return
    if value.get("status") == "recorded" and _nonempty_string(value.get("reference")):
        return
    if value.get("status") == "legacy_gap" and value.get("value") == "unrecorded":
        return
    if (
        value.get("status") == "not_applicable"
        and value.get("value") == "not_applicable"
    ):
        return
    errors.append(
        f"{location}: use recorded/reference, legacy_gap/unrecorded, "
        "or not_applicable/not_applicable"
    )


def _validate_actor(actor: Any, location: str, errors: list[str]) -> str | None:
    if not _is_mapping(actor):
        errors.append(f"{location}: actor must be an object")
        return None
    actor_id = actor.get("id")
    if not _nonempty_string(actor_id):
        errors.append(f"{location}.id: non-empty string required")
        return None
    if actor.get("type") not in ACTOR_TYPES:
        errors.append(f"{location}.type: unsupported actor type {actor.get('type')!r}")
    roles = actor.get("roles")
    if (
        not isinstance(roles, list)
        or not roles
        or any(role not in ROLES for role in roles)
    ):
        errors.append(f"{location}.roles: non-empty known role list required")
    return actor_id


def _validate_references(values: Any, location: str, errors: list[str]) -> None:
    if not isinstance(values, list) or not values:
        errors.append(f"{location}: at least one reference is required")
        return
    for index, value in enumerate(values):
        item_location = f"{location}[{index}]"
        if not _is_mapping(value):
            errors.append(f"{item_location}: reference must be an object")
            continue
        for key in ("id", "type", "reference"):
            if not _nonempty_string(value.get(key)):
                errors.append(f"{item_location}.{key}: non-empty string required")


def _validate_provenance(
    provenance: Any, paper_id: str, errors: list[str]
) -> tuple[dict[str, dict[str, Any]], dict[str, dict[str, Any]]]:
    location = f"{paper_id}.provenance"
    if not _is_mapping(provenance):
        errors.append(f"{location}: provenance is required")
        return {}, {}
    for field in ("annotation_id", "annotation_type"):
        if not _nonempty_string(provenance.get(field)):
            errors.append(f"{location}.{field}: non-empty string required")

    actor_index: dict[str, dict[str, Any]] = {}
    actors = provenance.get("actors")
    if not isinstance(actors, list) or not actors:
        errors.append(f"{location}.actors: at least one actor is required")
    else:
        for index, actor in enumerate(actors):
            actor_id = _validate_actor(actor, f"{location}.actors[{index}]", errors)
            if actor_id is None:
                continue
            if actor_id in actor_index:
                errors.append(
                    f"{location}.actors[{index}].id: duplicate actor id {actor_id!r}"
                )
                continue
            actor_index[actor_id] = actor

    activity_index: dict[str, dict[str, Any]] = {}
    activities = provenance.get("activities")
    if not isinstance(activities, list) or not activities:
        errors.append(f"{location}.activities: at least one activity is required")
    else:
        for index, activity in enumerate(activities):
            activity_location = f"{location}.activities[{index}]"
            if not _is_mapping(activity):
                errors.append(f"{activity_location}: activity must be an object")
                continue
            activity_id = activity.get("id")
            if not _nonempty_string(activity_id):
                errors.append(f"{activity_location}.id: non-empty string required")
                continue
            if activity_id in activity_index:
                errors.append(
                    f"{activity_location}.id: duplicate activity id {activity_id!r}"
                )
                continue
            activity_index[activity_id] = activity
            for field in ("type", "run_id", "method"):
                if not _nonempty_string(activity.get(field)):
                    errors.append(
                        f"{activity_location}.{field}: non-empty string required"
                    )
            _validate_capture(
                activity.get("prompt"), f"{activity_location}.prompt", errors
            )
            _validate_capture(
                activity.get("model"), f"{activity_location}.model", errors
            )
            actor_ids = activity.get("associated_actor_ids")
            if not isinstance(actor_ids, list) or not actor_ids:
                errors.append(
                    f"{activity_location}.associated_actor_ids: non-empty list required"
                )
            else:
                for actor_id in actor_ids:
                    if actor_id not in actor_index:
                        errors.append(
                            f"{activity_location}.associated_actor_ids: unknown actor {actor_id!r}"
                        )

    _validate_references(
        provenance.get("used_sources"), f"{location}.used_sources", errors
    )
    _validate_references(
        provenance.get("derived_from"), f"{location}.derived_from", errors
    )
    return actor_index, activity_index


def _validate_actor_ids(
    actor_ids: Any,
    actor_index: dict[str, dict[str, Any]],
    location: str,
    errors: list[str],
) -> list[str]:
    if not isinstance(actor_ids, list) or not actor_ids:
        errors.append(f"{location}: non-empty actor id list required")
        return []
    known_ids: list[str] = []
    for actor_id in actor_ids:
        if not _nonempty_string(actor_id) or actor_id not in actor_index:
            errors.append(f"{location}: unknown actor {actor_id!r}")
            continue
        known_ids.append(actor_id)
    return known_ids


def _has_role(
    actor_ids: list[str],
    actor_index: dict[str, dict[str, Any]],
    role: str,
    actor_type: str,
) -> bool:
    return any(
        actor_index[actor_id].get("type") == actor_type
        and role in actor_index[actor_id].get("roles", [])
        for actor_id in actor_ids
    )


def annotation_body(record: dict[str, Any]) -> dict[str, Any]:
    """Return the effective annotation projection without governance metadata."""
    return {
        field: copy.deepcopy(record[field])
        for field in ANNOTATION_BODY_FIELDS
        if field in record
    }


def _validate_annotations(
    record: dict[str, Any],
    paper_id: str,
    actor_index: dict[str, dict[str, Any]],
    errors: list[str],
) -> dict[str, dict[str, Any]]:
    location = f"{paper_id}.annotations"
    annotations = record.get("annotations")
    if not isinstance(annotations, list) or not annotations:
        errors.append(f"{location}: at least one immutable annotation is required")
        return {}
    annotation_index: dict[str, dict[str, Any]] = {}
    previous_annotation_id: str | None = None
    for index, annotation in enumerate(annotations):
        item_location = f"{location}[{index}]"
        if not _is_mapping(annotation):
            errors.append(f"{item_location}: annotation must be an object")
            continue
        annotation_id = annotation.get("annotation_id")
        if not _nonempty_string(annotation_id):
            errors.append(f"{item_location}.annotation_id: non-empty string required")
            continue
        if annotation_id in annotation_index:
            errors.append(
                f"{item_location}.annotation_id: duplicate annotation id {annotation_id!r}"
            )
            continue
        annotation_index[annotation_id] = annotation
        annotation_type = annotation.get("annotation_type")
        if annotation_type not in (
            "screening_decision",
            "domain_expert_correction",
        ):
            errors.append(
                f"{item_location}.annotation_type: unsupported value {annotation_type!r}"
            )
        _validate_iso_time(annotation.get("at"), item_location, errors)
        _validate_actor_ids(
            annotation.get("actor_ids"),
            actor_index,
            f"{item_location}.actor_ids",
            errors,
        )
        body = annotation.get("body")
        if not _is_mapping(body):
            errors.append(f"{item_location}.body: annotation body is required")
        if annotation_type == "domain_expert_correction":
            supersedes = annotation.get("supersedes")
            if not _nonempty_string(supersedes) or supersedes != previous_annotation_id:
                errors.append(
                    f"{item_location}.supersedes: must reference the preceding annotation"
                )
            actor_ids = annotation.get("actor_ids")
            if isinstance(actor_ids, list) and not _has_role(
                actor_ids, actor_index, "domain_expert", "person"
            ):
                errors.append(
                    f"{item_location}: correction requires a person domain_expert actor"
                )
            if not _nonempty_string(annotation.get("reason")):
                errors.append(f"{item_location}.reason: correction reason is required")
            changes = annotation.get("changes")
            if not isinstance(changes, list) or not changes:
                errors.append(f"{item_location}.changes: correction diff is required")
            elif any(
                not _is_mapping(change)
                or not _nonempty_string(change.get("path"))
                or "before" not in change
                or "after" not in change
                for change in changes
            ):
                errors.append(
                    f"{item_location}.changes: every change needs path, before, and after"
                )
        previous_annotation_id = annotation_id

    active_id = record.get("active_annotation_id")
    active = annotation_index.get(active_id)
    if not _nonempty_string(active_id) or active is None:
        errors.append(
            f"{paper_id}.active_annotation_id: must reference a known annotation"
        )
    elif active_id != previous_annotation_id:
        errors.append(
            f"{paper_id}.active_annotation_id: must reference the latest annotation"
        )
    elif active.get("body") != annotation_body(record):
        errors.append(
            f"{paper_id}.active_annotation_id: active body differs from record projection"
        )
    return annotation_index


def _validate_checks(
    checks: Any,
    paper_id: str,
    actor_index: dict[str, dict[str, Any]],
    annotation_index: dict[str, dict[str, Any]],
    errors: list[str],
) -> None:
    location = f"{paper_id}.checks"
    if not isinstance(checks, list):
        errors.append(f"{location}: checks must be a list")
        return
    check_ids: set[str] = set()
    for index, check in enumerate(checks):
        item_location = f"{location}[{index}]"
        if not _is_mapping(check):
            errors.append(f"{item_location}: check must be an object")
            continue
        check_id = check.get("check_id")
        if not _nonempty_string(check_id):
            errors.append(f"{item_location}.check_id: non-empty string required")
        elif check_id in check_ids:
            errors.append(f"{item_location}.check_id: duplicate check id {check_id!r}")
        else:
            check_ids.add(check_id)
        if check.get("check_type") not in CHECK_TYPES:
            errors.append(f"{item_location}.check_type: unsupported check type")
        if check.get("status") not in CHECK_STATUSES:
            errors.append(f"{item_location}.status: expected passed or failed")
        _validate_iso_time(check.get("at"), item_location, errors)
        actor_id = check.get("actor_id")
        actor = actor_index.get(actor_id)
        if (
            actor is None
            or actor.get("type") != "software_agent"
            or "validation" not in actor.get("roles", [])
        ):
            errors.append(
                f"{item_location}.actor_id: deterministic validation requires a software_agent validation actor"
            )
        tool = check.get("tool")
        if not _is_mapping(tool) or not all(
            _nonempty_string(tool.get(field)) for field in ("name", "version")
        ):
            errors.append(f"{item_location}.tool: name and version are required")
        subject = check.get("subject")
        if not _is_mapping(subject):
            errors.append(f"{item_location}.subject: subject is required")
            continue
        if subject.get("annotation_id") not in annotation_index:
            errors.append(f"{item_location}.subject.annotation_id: unknown annotation")
        digest = subject.get("sha256")
        if (
            not _nonempty_string(digest)
            or len(digest) != 64
            or any(char not in "0123456789abcdefABCDEF" for char in digest)
        ):
            errors.append(f"{item_location}.subject.sha256: 64-digit hash required")
        else:
            annotation = annotation_index.get(subject.get("annotation_id"))
            if annotation is not None and digest.lower() != _annotation_sha256(
                annotation
            ):
                errors.append(
                    f"{item_location}.subject.sha256: does not match the annotation body"
                )


def _validate_lifecycle(
    lifecycle: Any,
    paper_id: str,
    active_annotation_id: Any,
    actor_index: dict[str, dict[str, Any]],
    activity_index: dict[str, dict[str, Any]],
    annotation_index: dict[str, dict[str, Any]],
    event_ids: set[str],
    errors: list[str],
) -> None:
    location = f"{paper_id}.lifecycle"
    if not _is_mapping(lifecycle):
        errors.append(f"{location}: lifecycle is required")
        return
    baseline = lifecycle.get("baseline")
    if not _is_mapping(baseline):
        errors.append(f"{location}.baseline: baseline is required")
        return
    baseline_state = baseline.get("state")
    if baseline_state not in STATES:
        errors.append(f"{location}.baseline.state: unknown state {baseline_state!r}")
        return
    if not _nonempty_string(baseline.get("basis")):
        errors.append(f"{location}.baseline.basis: non-empty string required")
    _validate_iso_time(baseline.get("at"), f"{location}.baseline", errors)
    _validate_actor_ids(
        baseline.get("actor_ids"), actor_index, f"{location}.baseline.actor_ids", errors
    )
    if baseline.get("basis") == "legacy_import" and baseline_state != "curated":
        errors.append(f"{location}.baseline: legacy_import must establish curated")

    events = lifecycle.get("events")
    if not isinstance(events, list) or not events:
        errors.append(f"{location}.events: ordered events are required")
        return
    previous_state = baseline_state
    correction_event_ids: set[str] = set()
    for index, event in enumerate(events):
        event_location = f"{location}.events[{index}]"
        if not _is_mapping(event):
            errors.append(f"{event_location}: event must be an object")
            continue
        event_id = event.get("event_id")
        if not _nonempty_string(event_id):
            errors.append(f"{event_location}.event_id: non-empty string required")
        elif event_id in event_ids:
            errors.append(f"{event_location}.event_id: duplicate event id {event_id!r}")
        else:
            event_ids.add(event_id)
        _validate_iso_time(event.get("at"), event_location, errors)
        if event.get("from") != previous_state:
            errors.append(
                f"{event_location}.from: expected {previous_state!r}, got {event.get('from')!r}"
            )
        target = event.get("to")
        if target not in STATES:
            errors.append(f"{event_location}.to: unknown state {target!r}")
            continue
        event_type = event.get("event_type")
        result = event.get("result")
        transition = TRANSITIONS.get((previous_state, target))
        non_transition = NON_TRANSITIONS.get((previous_state, event_type, result))
        if transition is None and non_transition is None:
            errors.append(
                f"{event_location}: {previous_state!r} to {target!r} with result {result!r} is not allowed"
            )
            continue
        rule = transition or non_transition
        if event_type != rule["event_type"]:
            errors.append(
                f"{event_location}.event_type: expected {rule['event_type']!r}"
            )
        allowed_results = (
            transition.get("accepted_results") if transition else rule.get("results")
        )
        if result not in allowed_results:
            errors.append(f"{event_location}.result: unsupported result {result!r}")
        activity = activity_index.get(event.get("activity_id"))
        if activity is None:
            errors.append(
                f"{event_location}.activity_id: unknown activity {event.get('activity_id')!r}"
            )
        actor_ids = _validate_actor_ids(
            event.get("actor_ids"), actor_index, f"{event_location}.actor_ids", errors
        )
        if activity is not None and not set(actor_ids).issubset(
            set(activity.get("associated_actor_ids", []))
        ):
            errors.append(
                f"{event_location}.actor_ids: must belong to the referenced activity"
            )
        if not _has_role(actor_ids, actor_index, rule["role"], rule["actor_type"]):
            errors.append(
                f"{event_location}: {event_type} requires a {rule['actor_type']} {rule['role']} actor"
            )
        annotation_id = event.get("annotation_id")
        if (
            target in ("agent-annotated", "ai-agent-reviewed")
            and annotation_id not in annotation_index
        ):
            errors.append(
                f"{event_location}.annotation_id: annotation event requires a known annotation"
            )
        if result == "corrected_and_accepted":
            annotation = annotation_index.get(annotation_id)
            if (
                annotation is None
                or annotation.get("annotation_type") != "domain_expert_correction"
            ):
                errors.append(
                    f"{event_location}.annotation_id: corrected verification requires a correction annotation"
                )
            else:
                correction_event_ids.add(annotation_id)
        elif annotation_id is not None and annotation_id not in annotation_index:
            errors.append(f"{event_location}.annotation_id: unknown annotation")
        if target in ("verified", "publication-approved") and (
            annotation_id != active_annotation_id
        ):
            errors.append(
                f"{event_location}.annotation_id: authority event must reference the active annotation"
            )
        if transition is not None:
            previous_state = target
    if lifecycle.get("state") != previous_state:
        errors.append(
            f"{location}.state: expected final event state {previous_state!r}"
        )
    for annotation_id, annotation in annotation_index.items():
        if (
            annotation.get("annotation_type") == "domain_expert_correction"
            and annotation_id not in correction_event_ids
        ):
            errors.append(
                f"{location}: correction annotation {annotation_id!r} has no corrected_and_accepted event"
            )


def validate_document(document: dict[str, Any]) -> list[str]:
    """Return every deterministic contract violation in a 0.5 screening document."""
    errors: list[str] = []
    if not _is_mapping(document):
        return ["document: expected a JSON object"]
    if document.get("schema") != SCHEMA_V05:
        errors.append(f"document.schema: expected {SCHEMA_V05!r}")
    decisions = document.get("decisions")
    if not _is_mapping(decisions) or not decisions:
        return [*errors, "document.decisions: non-empty object required"]
    event_ids: set[str] = set()
    for paper_id in sorted(decisions):
        record = decisions[paper_id]
        if not _is_mapping(record):
            errors.append(f"{paper_id}: record must be an object")
            continue
        actor_index, activity_index = _validate_provenance(
            record.get("provenance"), paper_id, errors
        )
        annotation_index = _validate_annotations(record, paper_id, actor_index, errors)
        _validate_checks(
            record.get("checks"),
            paper_id,
            actor_index,
            annotation_index,
            errors,
        )
        _validate_lifecycle(
            record.get("lifecycle"),
            paper_id,
            record.get("active_annotation_id"),
            actor_index,
            activity_index,
            annotation_index,
            event_ids,
            errors,
        )
    return errors


def require_valid_document(document: dict[str, Any]) -> None:
    """Raise ValueError with the complete fail-closed validation report."""
    errors = validate_document(document)
    if errors:
        raise ValueError("Invalid screening lifecycle:\n- " + "\n- ".join(errors))


def _legacy_capture() -> dict[str, str]:
    return {"status": "legacy_gap", "value": "unrecorded"}


REPO_ROOT = Path(__file__).resolve().parents[2]
CANONICAL_LEGACY_METHOD = (
    "operationally_isolated_agent_screening_with_separate_source_review"
)


def _review_context(source: dict[str, Any]) -> dict[str, Any]:
    context = source.get("review_context")
    if _is_mapping(context):
        return context
    legacy = source.get("ratification")
    return legacy if _is_mapping(legacy) else {}


def _manifest_path(source: dict[str, Any]) -> Path | None:
    context = _review_context(source)
    manifest_path = context.get("run_manifest")
    if _nonempty_string(manifest_path):
        path = Path(manifest_path)
        return path if path.is_absolute() else REPO_ROOT / path
    consensus_path = context.get("review_path") or context.get("consensus_path")
    if not _nonempty_string(consensus_path):
        return None
    path = Path(consensus_path)
    if path.is_absolute():
        return path.parent / "run.json"
    return REPO_ROOT / path.parent / "run.json"


def _run_manifest(source: dict[str, Any]) -> dict[str, Any] | None:
    manifest_path = _manifest_path(source)
    if manifest_path is None or not manifest_path.is_file():
        return None
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return None
    return manifest if _is_mapping(manifest) else None


def _prompt_capture(prompt: Any) -> dict[str, str]:
    if not _is_mapping(prompt) or not _nonempty_string(prompt.get("path")):
        return _legacy_capture()
    capture = {"status": "recorded", "reference": prompt["path"]}
    for field in ("version", "sha256"):
        if _nonempty_string(prompt.get(field)):
            capture[field] = prompt[field]
    return capture


def _model_capture(model: Any) -> dict[str, str]:
    if (
        not _is_mapping(model)
        or not _nonempty_string(model.get("provider"))
        or not _nonempty_string(model.get("model"))
    ):
        return _legacy_capture()
    capture = {
        "status": "recorded",
        "reference": f"{model['provider']}:{model['model']}",
        "provider": model["provider"],
        "model": model["model"],
    }
    for field in ("model_version", "immutable_model_id"):
        if _nonempty_string(model.get(field)):
            capture[field] = model[field]
    return capture


def _recorded_prompt(source: dict[str, Any]) -> dict[str, str]:
    manifest = _run_manifest(source)
    return _prompt_capture(manifest.get("prompt") if manifest else None)


def _recorded_model(source: dict[str, Any]) -> dict[str, str]:
    manifest = _run_manifest(source)
    return _model_capture(manifest.get("model") if manifest else None)


def _recorded_ai_review_capture(source: dict[str, Any], field: str) -> dict[str, str]:
    manifest = _run_manifest(source)
    activities = (
        manifest.get("provenance", {}).get("activities", []) if manifest else []
    )
    review = next(
        (
            activity
            for activity in activities
            if _is_mapping(activity) and activity.get("type") == "ai_agent_review"
        ),
        None,
    )
    value = review.get(field) if _is_mapping(review) else None
    return _prompt_capture(value) if field == "prompt" else _model_capture(value)


def _activity_context(source: dict[str, Any]) -> tuple[str, str]:
    context = _review_context(source)
    return (
        str(context.get("run_id") or "legacy-import"),
        str(context.get("provenance_method") or CANONICAL_LEGACY_METHOD),
    )


def _derivations(source: dict[str, Any]) -> list[dict[str, str]]:
    context = _review_context(source)
    result: list[dict[str, str]] = []
    review_path = context.get("review_path") or context.get("consensus_path")
    if _nonempty_string(review_path):
        is_review = _nonempty_string(context.get("review_path"))
        result.append(
            {
                "id": "ai-agent-review" if is_review else "consensus",
                "type": "ai_agent_review" if is_review else "consensus_coding",
                "reference": review_path,
            }
        )
    manifest = context.get("run_manifest")
    if _nonempty_string(manifest):
        result.append(
            {
                "id": "run-manifest",
                "type": "run_manifest",
                "reference": manifest,
            }
        )
    elif _nonempty_string(review_path):
        result.append(
            {
                "id": "run-manifest",
                "type": "run_manifest",
                "reference": str(Path(review_path).parent / "run.json").replace(
                    "\\", "/"
                ),
            }
        )
    for track in context.get("input_tracks", []):
        if not _is_mapping(track) or not _nonempty_string(track.get("path")):
            continue
        reviewer = str(track.get("reviewer") or "track")
        result.append(
            {
                "id": f"track:{reviewer}",
                "type": "reviewer_track",
                "reference": track["path"],
            }
        )
    return result or [
        {"id": "legacy-import", "type": "legacy_import", "reference": "unrecorded"}
    ]


def _screening_actors(source: dict[str, Any]) -> list[dict[str, Any]]:
    tracks = _review_context(source).get("input_tracks", [])
    actors = []
    for track in tracks:
        if not _is_mapping(track) or not _nonempty_string(track.get("reviewer")):
            continue
        actors.append(
            {
                "id": str(track.get("actor_id") or f"ai-screening:{track['reviewer']}"),
                "type": "ai_agent",
                "roles": ["screening"],
            }
        )
    if actors:
        return actors
    raise ValueError("Migration requires named ratification input tracks")


def _ai_review_actor(source: dict[str, Any], model: dict[str, str]) -> dict[str, Any]:
    context = _review_context(source)
    return {
        "id": str(
            context.get("ai_agent_reviewer_actor_id") or "legacy-ai-agent-reviewer"
        ),
        "type": "ai_agent",
        "roles": ["ai_agent_reviewer"],
        "identity": copy.deepcopy(model),
    }


def _curation_actor(source: dict[str, Any]) -> dict[str, Any]:
    if _is_mapping(source.get("review_context")):
        return {
            "id": "curation-provenance-unrecorded",
            "type": "person",
            "roles": ["curation"],
            "identity": _legacy_capture(),
        }
    return {
        "id": "legacy-curation",
        "type": "person",
        "roles": ["curation"],
        "identity": _legacy_capture(),
    }


def _used_sources(source: dict[str, Any], paper_id: str) -> list[dict[str, Any]]:
    paper_source = _review_context(source).get("paper_sources", {}).get(paper_id)
    decision = source.get("decisions", {}).get(paper_id, {})
    if _is_mapping(paper_source) and _nonempty_string(paper_source.get("path")):
        reference = {
            "id": f"paper:{paper_id}",
            "type": "paper",
            "reference": paper_source["path"],
        }
        if _nonempty_string(paper_source.get("sha256")):
            reference["sha256"] = paper_source["sha256"]
        version_id = paper_source.get("version_id") or decision.get("version_id")
        if _nonempty_string(version_id):
            reference["version_id"] = version_id
            for field in ("work_id", "version_type"):
                value = paper_source.get(field) or decision.get(field)
                if _nonempty_string(value):
                    reference[field] = value
        return [reference]
    reference = {"id": f"paper:{paper_id}", "type": "paper", "reference": paper_id}
    if _nonempty_string(decision.get("version_id")):
        reference["version_id"] = decision["version_id"]
        for field in ("work_id", "version_type"):
            if _nonempty_string(decision.get(field)):
                reference[field] = decision[field]
    return [reference]


def _annotation_snapshot(
    record: dict[str, Any],
    annotation_id: str,
    timestamp: str,
    actor_ids: list[str],
) -> dict[str, Any]:
    return {
        "annotation_id": annotation_id,
        "annotation_type": "screening_decision",
        "at": timestamp,
        "actor_ids": actor_ids,
        "body": annotation_body(record),
    }


def _annotation_sha256(annotation: dict[str, Any]) -> str:
    payload = json.dumps(
        annotation.get("body", {}),
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
    ).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def add_validation_receipts(document: dict[str, Any], checked_at: str) -> None:
    """Append historical deterministic validation receipts to every annotation."""
    validation_actor = {
        "id": "deterministic-validator",
        "type": "software_agent",
        "roles": ["validation"],
    }
    for paper_id, record in document["decisions"].items():
        actors = record["provenance"].setdefault("actors", [])
        if not any(actor.get("id") == validation_actor["id"] for actor in actors):
            actors.append(copy.deepcopy(validation_actor))
        active_id = record["active_annotation_id"]
        annotation = next(
            item for item in record["annotations"] if item["annotation_id"] == active_id
        )
        record.setdefault("checks", []).append(
            {
                "check_id": f"{paper_id}:lifecycle-contract:{checked_at}",
                "check_type": "lifecycle_contract",
                "status": "passed",
                "at": checked_at,
                "actor_id": validation_actor["id"],
                "tool": {
                    "name": "src.assess.screening_lifecycle",
                    "version": "0.5",
                },
                "subject": {
                    "annotation_id": active_id,
                    "sha256": _annotation_sha256(annotation),
                },
            }
        )


def migrate_v03_document(
    source: dict[str, Any], checked_at: str | None = None
) -> dict[str, Any]:
    """Project a 0.3 agent reviewer file to the nested 0.5 contract."""
    if not _is_mapping(source) or source.get("schema") not in {SCHEMA_V03, SCHEMA_V04}:
        raise ValueError(
            f"Migration requires a {SCHEMA_V03} or {SCHEMA_V04} JSON object"
        )
    if source.get("actor") != "agent":
        raise ValueError(
            "Migration only projects agent reviewer tracks; human records need their own history"
        )
    decisions = source.get("decisions")
    if not _is_mapping(decisions) or not decisions:
        raise ValueError("Migration requires non-empty decisions")

    migrated = copy.deepcopy(source)
    migrated["schema"] = SCHEMA_V05
    migrated["status"] = "ai-agent-reviewed"
    migrated["decisions"] = {}
    reviewer = str(source.get("reviewer") or "legacy-reviewer")
    run_id, method = _activity_context(source)
    screening_actors = _screening_actors(source)
    screening_actor_ids = [actor["id"] for actor in screening_actors]
    prompt = _recorded_prompt(source)
    model = _recorded_model(source)
    ai_review_prompt = _recorded_ai_review_capture(source, "prompt")
    ai_review_model = _recorded_ai_review_capture(source, "model")
    curator = _curation_actor(source)
    ai_agent_reviewer = _ai_review_actor(source, ai_review_model)
    for paper_id in sorted(decisions):
        record = copy.deepcopy(decisions[paper_id])
        if not _is_mapping(record):
            raise ValueError(f"{paper_id}: decision record must be an object")
        if record.get("actor", "agent") != "agent":
            raise ValueError(
                f"{paper_id}: an agent track cannot contain a human decision"
            )
        timestamp = record.get("ts") or source.get("updated")
        if not _nonempty_string(timestamp):
            raise ValueError(f"{paper_id}: legacy record has no timestamp")
        screening_activity_id = f"{paper_id}:agent-annotation"
        ai_review_activity_id = f"{paper_id}:ai-agent-review"
        annotation_id = f"{reviewer}:{paper_id}"
        record["provenance"] = {
            "annotation_id": annotation_id,
            "annotation_type": "screening_decision",
            "actors": [curator, *screening_actors, ai_agent_reviewer],
            "activities": [
                {
                    "id": screening_activity_id,
                    "type": "screening",
                    "run_id": run_id,
                    "method": method,
                    "prompt": prompt,
                    "model": copy.deepcopy(model),
                    "associated_actor_ids": screening_actor_ids,
                },
                {
                    "id": ai_review_activity_id,
                    "type": "ai_agent_review",
                    "run_id": run_id,
                    "method": method,
                    "prompt": ai_review_prompt,
                    "model": copy.deepcopy(ai_review_model),
                    "associated_actor_ids": [ai_agent_reviewer["id"]],
                },
            ],
            "used_sources": _used_sources(source, paper_id),
            "derived_from": _derivations(source),
        }
        record["annotations"] = [
            _annotation_snapshot(record, annotation_id, timestamp, screening_actor_ids)
        ]
        record["active_annotation_id"] = annotation_id
        record["checks"] = []
        record["lifecycle"] = {
            "baseline": {
                "state": "curated",
                "basis": (
                    "curated_corpus_snapshot"
                    if _is_mapping(source.get("review_context"))
                    else "legacy_import"
                ),
                "at": timestamp,
                "actor_ids": [curator["id"]],
            },
            "state": "ai-agent-reviewed",
            "events": [
                {
                    "event_id": f"{paper_id}:agent-annotation",
                    "event_type": "agent_annotation",
                    "from": "curated",
                    "to": "agent-annotated",
                    "at": timestamp,
                    "activity_id": screening_activity_id,
                    "actor_ids": screening_actor_ids,
                    "result": "completed",
                    "annotation_id": annotation_id,
                },
                {
                    "event_id": f"{paper_id}:ai-agent-review",
                    "event_type": "ai_agent_review",
                    "from": "agent-annotated",
                    "to": "ai-agent-reviewed",
                    "at": timestamp,
                    "activity_id": ai_review_activity_id,
                    "actor_ids": [ai_agent_reviewer["id"]],
                    "result": "accepted",
                    "annotation_id": annotation_id,
                },
            ],
        }
        migrated["decisions"][paper_id] = record
    if checked_at is not None:
        timestamp_errors: list[str] = []
        _validate_iso_time(checked_at, "checked_at", timestamp_errors)
        if timestamp_errors:
            raise ValueError(timestamp_errors[0])
        add_validation_receipts(migrated, checked_at)
    require_valid_document(migrated)
    return migrated


def _read_json(path: Path) -> dict[str, Any]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as error:
        raise FileNotFoundError(f"Input file is missing: {path}") from error
    except json.JSONDecodeError as error:
        raise ValueError(f"Invalid JSON in {path}: {error}") from error
    if not _is_mapping(data):
        raise ValueError(f"Expected a JSON object in {path}")
    return data


def _write_json(path: Path, document: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(document, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
        newline="\n",
    )


def main(argv: list[str] | None = None) -> int:
    """Run the validator or a deterministic 0.3-to-0.5 projection."""
    parser = argparse.ArgumentParser(description="Validate PRISM screening lifecycles.")
    subparsers = parser.add_subparsers(dest="command", required=True)
    validate_parser = subparsers.add_parser("validate", help="validate a 0.5 file")
    validate_parser.add_argument("input", type=Path)
    migrate_parser = subparsers.add_parser("migrate", help="project a 0.3 file to 0.5")
    migrate_parser.add_argument("input", type=Path)
    migrate_parser.add_argument("output", type=Path)
    migrate_parser.add_argument(
        "--checked-at",
        help="append passed lifecycle-contract receipts at this ISO-8601 timestamp",
    )
    args = parser.parse_args(argv)
    try:
        document = _read_json(args.input)
        if args.command == "validate":
            require_valid_document(document)
            print(f"OK: {args.input}")
        else:
            _write_json(
                args.output,
                migrate_v03_document(document, checked_at=args.checked_at),
            )
            print(f"OK: wrote {args.output}")
    except (FileNotFoundError, ValueError) as error:
        print(f"FEHLER: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
