import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const LEGACY_RUN = 'tests/review-cases/agent-runs/ratification-ar2-20260822/run.json';
const HASH = /^[a-f0-9]{64}$/i;
const COMMIT = /^[a-f0-9]{7,64}$/i;
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
const FORBIDDEN_TERMS = [
  new RegExp(['agent', 'first'].join('-'), 'i'),
  new RegExp(['independent', 'source', 'adjudication'].join(' '), 'i'),
  new RegExp(['human', 'expert'].join(' '), 'i'),
  new RegExp(['machine', 'review'].join('[ _-]'), 'i'),
];

function normalizedPath(path) {
  const value = String(path || '').replaceAll('\\', '/');
  if (!value) return '';
  const absolute = resolve(root, value);
  return value.startsWith('/') || /^[A-Za-z]:\//.test(value)
    ? relative(root, absolute).replaceAll('\\', '/')
    : value;
}

function isLegacyPath(path) {
  return normalizedPath(path) === LEGACY_RUN;
}

function hashFile(path) {
  return createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex');
}

function isPlaceholder(value) {
  return typeof value !== 'string' || !value.trim() || value.includes('replace-me');
}

function sameSet(left, right) {
  return JSON.stringify([...new Set(left)].sort()) === JSON.stringify([...new Set(right)].sort());
}

function walkStrings(value, visit) {
  if (typeof value === 'string') visit(value);
  else if (Array.isArray(value)) value.forEach((entry) => walkStrings(entry, visit));
  else if (value && typeof value === 'object') Object.values(value).forEach((entry) => walkStrings(entry, visit));
}

function requireString(value, label, errors, nullable = false) {
  if (nullable && value === null) return;
  if (isPlaceholder(value)) errors.push(`${label} is missing`);
}

function requireHash(value, label, errors) {
  if (!HASH.test(String(value || ''))) errors.push(`${label} must be a SHA-256 hash`);
}

function requireTimestamp(value, label, errors, nullable = false) {
  if (nullable && value === null) return;
  if (typeof value !== 'string' || !ISO.test(value) || Number.isNaN(Date.parse(value)))
    errors.push(`${label} must be an ISO-8601 UTC timestamp`);
}

function validateOutput(output, label, errors, completed) {
  if (!output || typeof output !== 'object') {
    errors.push(`${label} is missing`);
    return;
  }
  requireString(output.path, `${label}.path`, errors);
  if (!completed && output.sha256 === null) return;
  requireHash(output.sha256, `${label}.sha256`, errors);
  if (completed && !isPlaceholder(output.path)) {
    const path = normalizedPath(output.path);
    if (!existsSync(resolve(root, path))) errors.push(`${label}.path does not exist: ${path}`);
    else if (hashFile(path).toLowerCase() !== output.sha256.toLowerCase()) errors.push(`${label}.sha256 does not match file`);
  }
}

export function validateManifest(run, { path = '<memory>', allowLegacy = true } = {}) {
  if (!run || typeof run !== 'object' || Array.isArray(run)) return { ok: false, legacy: false, errors: ['manifest must be an object'] };

  if (allowLegacy && isLegacyPath(path) && run.schema === 'femprompt-prisma-agent-run/0.2')
    return { ok: true, legacy: true, errors: [] };

  const errors = [];
  const acceptedTransitionRun = run.schema === 'femprompt-prisma-agent-run/1.1'
    && run.execution?.protocol_deviation?.status === 'accepted_as_method_amendment'
    && run.execution?.protocol_deviation?.to === 'deterministic PRISM frontend roundtrip'
    && run.execution?.canonical_successor_schema === 'femprompt-prisma-agent-run/1.2';
  const versionAwareRun = run.schema === 'femprompt-prisma-agent-run/1.3';
  const historicalRun = run.schema === 'femprompt-prisma-agent-run/1.2';
  if (!versionAwareRun && !historicalRun && !acceptedTransitionRun)
    errors.push('schema must be femprompt-prisma-agent-run/1.3, historical 1.2, or a documented accepted 1.1 transition run');
  requireString(run.run_id, 'run_id', errors);
  if (!['prepared', 'running', 'completed', 'aborted'].includes(run.status)) errors.push('status is invalid');
  if (run.lifecycle?.target !== 'ai-agent-reviewed') errors.push('lifecycle.target must be ai-agent-reviewed');
  if (typeof run.lifecycle?.baseline !== 'string' || !run.lifecycle.baseline.trim()) errors.push('lifecycle.baseline must be recorded');
  if (run.lifecycle?.state !== run.status) errors.push('lifecycle.state must match status');
  if (!Array.isArray(run.lifecycle?.events)) errors.push('lifecycle.events must be an array');
  for (const [index, event] of (run.lifecycle?.events || []).entries()) {
    for (const key of ['event_id', 'event_type', 'from', 'to', 'activity_id']) requireString(event?.[key], `lifecycle.events[${index}].${key}`, errors);
    requireTimestamp(event?.at, `lifecycle.events[${index}].at`, errors);
    if (!Array.isArray(event?.actor_ids) || !event.actor_ids.length) errors.push(`lifecycle.events[${index}].actor_ids must be non-empty`);
  }

  const model = run.model || {};
  requireString(model.provider, 'model.provider', errors);
  requireString(model.model, 'model.model', errors);
  if (isPlaceholder(model.model_version) && isPlaceholder(model.immutable_model_id))
    errors.push('model.model_version or model.immutable_model_id is required');

  const prompt = run.prompt || {};
  requireString(prompt.path, 'prompt.path', errors);
  requireString(prompt.version, 'prompt.version', errors);
  requireHash(prompt.sha256, 'prompt.sha256', errors);

  if (!COMMIT.test(String(run.baseline?.commit || ''))) errors.push('baseline.commit must be an immutable commit identifier');

  const assignment = run.assignment || {};
  if (assignment.complete !== true) errors.push('assignment.complete must be true');
  const papers = Array.isArray(assignment.papers) ? assignment.papers : [];
  if (!papers.length) errors.push('assignment.papers must contain every assigned paper');
  const paperIds = papers.map((paper) => paper?.paper_id);
  if (new Set(paperIds).size !== paperIds.length || paperIds.some(isPlaceholder)) errors.push('assignment paper IDs are incomplete or duplicated');
  const paperSources = new Map(papers.map((paper) => [paper?.paper_id, paper?.source]));
  for (const paper of papers) {
    requireString(paper?.work_id, `work_id for ${paper?.paper_id || '<paper>'}`, errors);
    if (versionAwareRun) {
      requireString(paper?.version_id, `version_id for ${paper?.paper_id || '<paper>'}`, errors);
      requireString(paper?.version_type, `version_type for ${paper?.paper_id || '<paper>'}`, errors);
      requireString(paper?.preferred_version_id, `preferred_version_id for ${paper?.paper_id || '<paper>'}`, errors);
      if (paper?.selected_version_is_preferred !== (paper?.version_id === paper?.preferred_version_id))
        errors.push(`selected_version_is_preferred for ${paper?.paper_id || '<paper>'} must match the version IDs`);
      if (paper?.source?.version_id !== paper?.version_id)
        errors.push(`source version for ${paper?.paper_id || '<paper>'} must match the selected version`);
    }
    const recordIds = Array.isArray(paper?.record_ids) ? paper.record_ids : [];
    if (!recordIds.length || new Set(recordIds).size !== recordIds.length || recordIds.some(isPlaceholder))
      errors.push(`record_ids for ${paper?.paper_id || '<paper>'} must be non-empty and unique`);
    if (!recordIds.includes(paper?.paper_id))
      errors.push(`record_ids for ${paper?.paper_id || '<paper>'} must include the representative paper_id`);
    if (paper?.human_coverage !== false)
      errors.push(`human_coverage for ${paper?.paper_id || '<paper>'} must be false`);
    if (paper?.ai_agent_review_coverage !== false)
      errors.push(`ai_agent_review_coverage for ${paper?.paper_id || '<paper>'} must be false`);
    requireString(paper?.source?.path, `source path for ${paper?.paper_id || '<paper>'}`, errors);
    requireHash(paper?.source?.sha256, `source hash for ${paper?.paper_id || '<paper>'}`, errors);
  }

  const isolation = run.isolation || {};
  if (isolation.mode !== 'operational') errors.push('isolation.mode must be operational');
  if (isolation.epistemic_independence_claimed !== false) errors.push('isolation must not claim epistemic independence');
  requireString(isolation.explanation, 'isolation.explanation', errors);

  const execution = run.execution || {};
  if ((versionAwareRun || historicalRun)
      && execution.mode !== 'blinded_source_review_with_deterministic_prism_roundtrip')
    errors.push('execution.mode must use the deterministic PRISM roundtrip');
  if (acceptedTransitionRun && execution.mode !== 'blinded_source_review_with_operator_prism_transcription')
    errors.push('accepted 1.1 transition run must preserve its executed source mode');
  requireString(execution.reason, 'execution.reason', errors);
  if (!Array.isArray(execution.required_controls) || execution.required_controls.length < 3
      || execution.required_controls.some(isPlaceholder))
    errors.push('execution.required_controls must record the isolation and transfer controls');
  requireString(execution.coding_packet_validation?.command, 'execution.coding_packet_validation.command', errors);
  requireString(execution.frontend_roundtrip?.command, 'execution.frontend_roundtrip.command', errors);
  if (execution.frontend_roundtrip?.method !== 'deterministic_projection_with_prism_frontend_roundtrip')
    errors.push('execution.frontend_roundtrip.method is invalid');
  const productionFunctions = [
    'validateReviewerPayload',
    'importReviewerPayload',
    'recordRequirements',
    'reviewerFileText',
  ];
  if (!sameSet(execution.frontend_roundtrip?.production_functions || [], productionFunctions))
    errors.push('execution.frontend_roundtrip.production_functions is incomplete');
  requireString(execution.protocol_basis, 'execution.protocol_basis', errors);

  const actors = Array.isArray(run.actors) ? run.actors : [];
  const actorIdsFromManifest = actors.map((actor) => actor?.id);
  if (actors.length !== 3) errors.push('actors must contain two reviewer actors and one AI-agent-review actor');
  if (new Set(actorIdsFromManifest).size !== actorIdsFromManifest.length || actorIdsFromManifest.some(isPlaceholder)) errors.push('actor IDs must be present and unique');
  for (const actor of actors) {
    requireString(actor?.id, 'actors[].id', errors);
    if (!['person', 'ai_agent', 'software_agent'].includes(actor?.type)) errors.push(`actor ${actor?.id || '<unknown>'}.type is invalid`);
    requireString(actor?.role, `actor ${actor?.id || '<unknown>'}.role`, errors);
  }

  const timestamps = run.timestamps || {};
  requireTimestamp(timestamps.created_at, 'timestamps.created_at', errors);
  for (const key of ['started_at', 'completed_at']) {
    if (!(key in timestamps)) errors.push(`timestamps.${key} must be recorded, including null before execution`);
    else requireTimestamp(timestamps[key], `timestamps.${key}`, errors, true);
  }
  if (run.status === 'completed') {
    requireTimestamp(timestamps.started_at, 'timestamps.started_at', errors);
    requireTimestamp(timestamps.completed_at, 'timestamps.completed_at', errors);
    if (execution.coding_packet_validation?.result !== 'pass')
      errors.push('completed run requires passed coding-packet validation');
    if (execution.frontend_roundtrip?.result !== 'pass')
      errors.push('completed run requires passed PRISM frontend roundtrip');
    if (execution.coding_packet_validation?.records !== papers.length * 2)
      errors.push('coding-packet validation count must cover both tracks');
    if (execution.frontend_roundtrip?.records !== papers.length * 2)
      errors.push('frontend roundtrip count must cover both tracks');
  }

  const tracks = Array.isArray(run.tracks) ? run.tracks : [];
  if (tracks.length !== 2) errors.push('exactly two operational agent tracks are required');
  const trackIds = tracks.map((track) => track?.reviewer_id);
  const actorIds = tracks.map((track) => track?.actor_id);
  if (new Set(trackIds).size !== trackIds.length || trackIds.some(isPlaceholder)) errors.push('reviewer IDs must be present and unique');
  if (new Set(actorIds).size !== actorIds.length || actorIds.some(isPlaceholder)) errors.push('actor IDs must be present and unique');
  for (const track of tracks) {
    requireString(track?.reviewer_id, 'track.reviewer_id', errors);
    requireString(track?.actor_id, `track ${track?.reviewer_id || '<unknown>'}.actor_id`, errors);
    if (track?.actor_type !== 'ai_agent') errors.push(`track ${track?.reviewer_id || '<unknown>'}.actor_type must be ai_agent`);
    if (!actors.some((actor) => actor?.id === track?.actor_id && actor?.type === 'ai_agent' && actor?.role === 'reviewer'))
      errors.push(`track ${track?.reviewer_id || '<unknown>'} actor is not registered as an ai_agent reviewer`);
    if (!sameSet(track?.paper_ids || [], paperIds)) errors.push(`track ${track?.reviewer_id || '<unknown>'} paper assignment is incomplete`);
    const sourceAssignments = Array.isArray(track?.source_assignments) ? track.source_assignments : [];
    if (sourceAssignments.length !== papers.length) errors.push(`track ${track?.reviewer_id || '<unknown>'} source assignment is incomplete`);
    const sourcePaperIds = sourceAssignments.map((source) => source?.paper_id);
    if (new Set(sourcePaperIds).size !== sourcePaperIds.length || !sameSet(sourcePaperIds, paperIds))
      errors.push(`track ${track?.reviewer_id || '<unknown>'} source assignment IDs are incomplete or duplicated`);
    for (const source of sourceAssignments) {
      if (!paperIds.includes(source?.paper_id)) errors.push(`track ${track?.reviewer_id || '<unknown>'} has an unassigned source`);
      requireString(source?.source_path, 'track source path', errors);
      requireHash(source?.source_sha256, 'track source hash', errors);
      const assigned = paperSources.get(source?.paper_id);
      if (versionAwareRun && source?.version_id !== assigned?.version_id)
        errors.push(`track ${track?.reviewer_id || '<unknown>'} version does not match manifest assignment`);
      if (assigned && (source.source_path !== assigned.path || source.source_sha256?.toLowerCase() !== assigned.sha256?.toLowerCase()))
        errors.push(`track ${track?.reviewer_id || '<unknown>'} source does not match manifest assignment`);
    }
    for (const key of ['started_at', 'completed_at']) {
      if (!(key in (track || {}))) errors.push(`track ${track?.reviewer_id || '<unknown>'}.${key} must be recorded`);
      else requireTimestamp(track[key], `track ${track?.reviewer_id || '<unknown>'}.${key}`, errors, true);
    }
    validateOutput(
      { path: track?.coding_packet, sha256: track?.coding_packet_sha256 },
      `track ${track?.reviewer_id || '<unknown>'}.coding_packet`,
      errors,
      run.status === 'completed',
    );
    validateOutput(
      { path: track?.report, sha256: track?.report_sha256 },
      `track ${track?.reviewer_id || '<unknown>'}.report`,
      errors,
      run.status === 'completed',
    );
    validateOutput(track?.output, `track ${track?.reviewer_id || '<unknown>'}.output`, errors, run.status === 'completed');
  }
  if (!sameSet(trackIds, ['ar1', 'ar2'])) errors.push('tracks must use two distinct reviewer IDs');

  const activities = Array.isArray(run.provenance?.activities)
    ? run.provenance.activities
    : Array.isArray(run.activities)
      ? run.activities
      : [];
  if (!Array.isArray(run.provenance?.activities)) errors.push('provenance.activities must be recorded');
  for (const [index, activity] of activities.entries()) {
    requireString(activity?.id, `provenance.activities[${index}].id`, errors);
    requireString(activity?.run_id, `provenance.activities[${index}].run_id`, errors, true);
    requireString(activity?.method, `provenance.activities[${index}].method`, errors);
    const activityPrompt = activity?.prompt || {};
    requireString(activityPrompt.path, `provenance.activities[${index}].prompt.path`, errors);
    requireString(activityPrompt.version, `provenance.activities[${index}].prompt.version`, errors);
    requireHash(activityPrompt.sha256, `provenance.activities[${index}].prompt.sha256`, errors);
    const activityModel = activity?.model || {};
    requireString(activityModel.provider, `provenance.activities[${index}].model.provider`, errors);
    requireString(activityModel.model, `provenance.activities[${index}].model.model`, errors);
    if (isPlaceholder(activityModel.model_version) && isPlaceholder(activityModel.immutable_model_id))
      errors.push(`provenance.activities[${index}].model needs model_version or immutable_model_id`);
    if (!Array.isArray(activity?.associated_actor_ids) || !activity.associated_actor_ids.length)
      errors.push(`provenance.activities[${index}].associated_actor_ids must be non-empty`);
  }
  const identification = activities.filter((activity) => activity?.type === 'identification_activity');
  const aiAgentReviews = activities.filter((activity) => activity?.type === 'ai_agent_review');
  if (identification.length > 1) errors.push('at most one identification_activity is allowed');
  if (aiAgentReviews.length !== 1) errors.push('exactly one separate ai_agent_review activity is required');
  const identificationActivity = identification[0];
  if (identificationActivity) {
    if (identificationActivity.method !== 'agentic_literature_supplement') errors.push('identification_activity method is invalid');
    if (!['planned', 'running', 'completed', 'aborted'].includes(identificationActivity.status)) errors.push('identification_activity status is invalid');
    if (identificationActivity.performed === true || identificationActivity.status === 'completed') {
      const log = identificationActivity.run_log;
      requireString(log?.run_id, 'identification_activity.run_log.run_id', errors);
      requireTimestamp(log?.started_at, 'identification_activity.run_log.started_at', errors);
      requireTimestamp(log?.completed_at, 'identification_activity.run_log.completed_at', errors);
      if (!Array.isArray(log?.outputs) || !log.outputs.length) errors.push('performed identification_activity needs logged outputs');
      else log.outputs.forEach((output, index) => validateOutput(output, `identification_activity.run_log.outputs[${index}]`, errors, true));
    } else if (identificationActivity.performed !== false) {
      errors.push('identification_activity.performed must be false until a run is logged');
    }
  }
  const aiAgentReview = aiAgentReviews[0];
  if (aiAgentReview) {
    if (aiAgentReview.method !== 'source_grounded_ai_agent_review') errors.push('ai_agent_review method is invalid');
    if (aiAgentReview.actor_type !== 'ai_agent') errors.push('ai_agent_review.actor_type must be ai_agent');
    requireString(aiAgentReview.actor_id, 'ai_agent_review.actor_id', errors);
    if (!actors.some((actor) => actor?.id === aiAgentReview.actor_id && actor?.type === 'ai_agent' && actor?.role === 'ai_agent_reviewer'))
      errors.push('ai_agent_review actor is not registered as an ai_agent reviewer');
    if (!sameSet(aiAgentReview.input_track_ids || [], trackIds)) errors.push('ai_agent_review must name both agent tracks as inputs');
    requireString(aiAgentReview.source_basis, 'ai_agent_review.source_basis', errors);
    if (!String(aiAgentReview.source_basis || '').toLowerCase().includes('source')) errors.push('ai_agent_review.source_basis must identify source records');
    if (!aiAgentReview.associated_actor_ids?.includes(aiAgentReview.actor_id)) errors.push('ai_agent_review associated_actor_ids must include its actor');
    for (const key of ['started_at', 'completed_at']) {
      if (!(key in aiAgentReview)) errors.push(`ai_agent_review.${key} must be recorded`);
      else requireTimestamp(aiAgentReview[key], `ai_agent_review.${key}`, errors, true);
    }
    if (aiAgentReview.status === 'completed') {
      if (!Array.isArray(aiAgentReview.outputs) || !aiAgentReview.outputs.length) errors.push('completed ai_agent_review needs outputs');
      else aiAgentReview.outputs.forEach((output, index) => validateOutput(output, `ai_agent_review.outputs[${index}]`, errors, true));
    }
  }

  const outputs = Array.isArray(run.outputs) ? run.outputs : [];
  if (outputs.length < tracks.length + 1) errors.push('outputs must include both track exports and the AI-agent-review output');
  for (const [index, output] of outputs.entries()) validateOutput(output, `outputs[${index}]`, errors, run.status === 'completed');
  const outputReviewers = outputs.filter((output) => output?.kind === 'agent_track').map((output) => output.reviewer_id);
  if (!sameSet(outputReviewers, trackIds)) errors.push('outputs must include one hashed export per agent track');
  if (!outputs.some((output) => output?.kind === 'ai_agent_review')) errors.push('outputs must include a hashed AI-agent-review output');
  for (const track of tracks) {
    const output = outputs.find((candidate) => candidate?.kind === 'agent_track' && candidate?.reviewer_id === track?.reviewer_id);
    if (output && (output.path !== track.output?.path || output.sha256?.toLowerCase() !== track.output?.sha256?.toLowerCase()))
      errors.push(`outputs entry for ${track.reviewer_id} does not match track output`);
  }

  if ('legacy_gap' in run && !(run.migration?.type === 'legacy_migration' && requireNonPlaceholder(run.migration.source_run_id) && requireNonPlaceholder(run.migration.reason)))
    errors.push('legacy_gap is allowed only on a documented legacy migration');

  walkStrings(run, (value) => {
    if (FORBIDDEN_TERMS.some((term) => term.test(value))) errors.push('forbidden epistemic terminology found in new run manifest');
  });

  return { ok: errors.length === 0, legacy: false, errors: [...new Set(errors)] };
}

function requireNonPlaceholder(value) {
  return typeof value === 'string' && value.trim() && !value.includes('replace-me');
}

function main() {
  const runArgument = process.argv[2];
  if (!runArgument) throw new Error('usage: node tests/review-cases/validate-run-contract.mjs <run.json>');
  const path = normalizedPath(runArgument);
  const run = JSON.parse(readFileSync(resolve(root, path), 'utf8'));
  const result = validateManifest(run, { path });
  if (!result.ok) {
    console.error(`FAIL run contract: ${path}`);
    for (const error of result.errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(`PASS run contract${result.legacy ? ' (legacy)' : ''}: ${path}`);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) main();
