import { validateManifest } from './validate-run-contract.mjs';

const hash = 'a'.repeat(64);
const paper = {
  paper_id: 'PAPER-1',
  work_id: 'work:11111111-1111-5111-8111-111111111111',
  version_id: 'version:22222222-2222-5222-8222-222222222222',
  version_type: 'version_of_record',
  preferred_version_id: 'version:22222222-2222-5222-8222-222222222222',
  selected_version_is_preferred: true,
  record_ids: ['PAPER-1'],
  human_coverage: false,
  ai_agent_review_coverage: false,
  source: {
    path: 'generated/markdown_clean/PAPER-1.md',
    sha256: hash,
    version_id: 'version:22222222-2222-5222-8222-222222222222',
  },
};

function track(reviewerId) {
  return {
    reviewer_id: reviewerId,
    actor_id: `agent-${reviewerId}`,
    actor_type: 'ai_agent',
    execution_environment: {
      harness: 'Claude Code subagent',
      provider: 'Anthropic',
      model: 'opus',
      model_id: 'claude-example',
    },
    paper_ids: ['PAPER-1'],
    source_assignments: [{
      paper_id: 'PAPER-1',
      version_id: paper.version_id,
      source_path: paper.source.path,
      source_sha256: hash,
    }],
    coding_packet: `tests/review-cases/agent-runs/example/tracks/${reviewerId}-coding.json`,
    coding_packet_sha256: hash,
    report: `tests/review-cases/agent-runs/example/reports/${reviewerId}.md`,
    report_sha256: hash,
    started_at: null,
    completed_at: null,
    output: {
      path: `tests/review-cases/agent-runs/example/tracks/${reviewerId}.json`,
      sha256: hash,
    },
  };
}

function validManifest() {
  return {
    schema: 'femprompt-prisma-agent-run/1.4',
    run_id: 'example-20260823',
    status: 'prepared',
    lifecycle: { baseline: 'identified', state: 'prepared', target: 'ai-agent-reviewed', events: [] },
    codebook: { path: 'assessment/categories.yaml', version: '1.4', sha256: hash },
    prompt: { path: 'prompts/prism-agent-reviewer.md', version: '1.0', sha256: hash },
    baseline: { commit: 'a'.repeat(40) },
    assignment: { complete: true, papers: [paper] },
    isolation: {
      mode: 'operational',
      epistemic_independence_claimed: false,
      model_diversity: 'same_model',
      explanation: 'Separate agent contexts, reviewer identities, and output paths are recorded per track.',
    },
    actors: [
      { id: 'agent-ar1', type: 'ai_agent', role: 'reviewer', reviewer_id: 'ar1' },
      { id: 'agent-ar2', type: 'ai_agent', role: 'reviewer', reviewer_id: 'ar2' },
      { id: 'agent-ai-agent-review', type: 'ai_agent', role: 'ai_agent_reviewer' },
    ],
    timestamps: { created_at: '2026-08-23T10:00:00.000Z', started_at: null, completed_at: null },
    execution: {
      mode: 'blinded_source_review_with_deterministic_prism_roundtrip',
      reason: 'Validated source-grounded coding packets pass mechanically through the production PRISM functions.',
      required_controls: [
        'Each reviewer reads only assigned sources.',
        'Each reviewer writes only its own packet and report.',
        'The orchestrator transfers values without substantive changes.',
      ],
      coding_packet_validation: {
        command: 'node tests/review-cases/validate-coding-packet.mjs run.json <reviewer-id>',
        result: 'pending',
        records: 0,
      },
      frontend_roundtrip: {
        method: 'deterministic_projection_with_prism_frontend_roundtrip',
        command: 'node tests/review-cases/roundtrip-prism-track.mjs run.json <reviewer-id> projection.json track.json',
        result: 'pending',
        records: 0,
        production_functions: [
          'validateReviewerPayload',
          'importReviewerPayload',
          'recordRequirements',
          'reviewerFileText',
        ],
      },
      protocol_basis: 'knowledge/specification.md#ADR-037',
    },
    tracks: [track('ar1'), track('ar2')],
    provenance: { activities: [
      {
        id: 'ai-agent-review-1',
        type: 'ai_agent_review',
        run_id: null,
        method: 'source_grounded_ai_agent_review',
        prompt: { path: 'prompts/prism-agent-reviewer.md', version: '1.0', sha256: hash },
        model: { provider: 'OpenAI', model: 'gpt-example', model_version: '2026-08-23' },
        associated_actor_ids: ['agent-ai-agent-review'],
        status: 'planned',
        actor_id: 'agent-ai-agent-review',
        actor_type: 'ai_agent',
        execution_environment: { harness: 'Claude Code subagent', provider: 'Anthropic', model: 'opus', model_id: 'claude-example' },
        input_track_ids: ['ar1', 'ar2'],
        source_basis: 'assigned paper/source records',
        started_at: null,
        completed_at: null,
        outputs: [],
      },
    ] },
    outputs: [
      { kind: 'agent_track', reviewer_id: 'ar1', path: 'tests/review-cases/agent-runs/example/tracks/ar1.json', sha256: hash },
      { kind: 'agent_track', reviewer_id: 'ar2', path: 'tests/review-cases/agent-runs/example/tracks/ar2.json', sha256: hash },
      { kind: 'ai_agent_review', path: 'tests/review-cases/agent-runs/example/ai-agent-review.json', sha256: hash },
    ],
  };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const accepted = validateManifest(validManifest(), { path: 'tests/review-cases/agent-runs/example/run.json' });
assert(accepted.ok && !accepted.legacy, 'valid new-run contract was rejected');

const preparedWithoutOutputHashes = validManifest();
for (const trackItem of preparedWithoutOutputHashes.tracks) trackItem.output.sha256 = null;
for (const output of preparedWithoutOutputHashes.outputs) output.sha256 = null;
assert(validateManifest(preparedWithoutOutputHashes).ok, 'prepared run with pending output hashes was rejected');

const completedWithoutOutputHashes = preparedWithoutOutputHashes;
completedWithoutOutputHashes.status = 'completed';
completedWithoutOutputHashes.lifecycle.state = 'completed';
completedWithoutOutputHashes.timestamps.started_at = '2026-08-23T10:01:00.000Z';
completedWithoutOutputHashes.timestamps.completed_at = '2026-08-23T10:02:00.000Z';
assert(!validateManifest(completedWithoutOutputHashes).ok, 'completed run without output hashes was accepted');

const missingModel = validManifest();
delete missingModel.tracks[0].execution_environment.model_id;
assert(!validateManifest(missingModel).ok, 'missing track model id was accepted');

const missingHarness = validManifest();
delete missingHarness.tracks[1].execution_environment.harness;
assert(!validateManifest(missingHarness).ok, 'missing track harness was accepted');

const undeclaredSameModel = validManifest();
undeclaredSameModel.isolation.model_diversity = 'different_models';
assert(!validateManifest(undeclaredSameModel).ok, 'two tracks on one model were declared as different models');

const mixedHarness = validManifest();
mixedHarness.tracks[1].execution_environment = { harness: 'Codex', provider: 'OpenAI', model: 'gpt-example', model_id: 'gpt-example-2026' };
mixedHarness.isolation.model_diversity = 'different_models';
assert(validateManifest(mixedHarness).ok, 'tracks on two harnesses and models were rejected');

const missingCodebook = validManifest();
delete missingCodebook.codebook;
assert(!validateManifest(missingCodebook).ok, 'run without a codebook version was accepted');

const sharedOutput = validManifest();
sharedOutput.tracks[1].coding_packet = sharedOutput.tracks[0].coding_packet;
assert(!validateManifest(sharedOutput).ok, 'tracks sharing an output path were accepted');

const historical = validManifest();
historical.schema = 'femprompt-prisma-agent-run/1.3';
delete historical.codebook;
historical.model = { provider: 'OpenAI', model: 'gpt-example', model_version: '2026-08-23' };
assert(validateManifest(historical).ok, 'historical 1.3 run was rejected');

const oneTrack = validManifest();
oneTrack.tracks.pop();
assert(!validateManifest(oneTrack).ok, 'one-track run was accepted');

const visibleTranscription = validManifest();
visibleTranscription.execution.mode = 'blinded_source_review_with_operator_prism_transcription';
assert(!validateManifest(visibleTranscription).ok, 'visible transcription was accepted as the canonical agent transfer');

const incompleteSource = validManifest();
incompleteSource.tracks[1].source_assignments = [];
assert(!validateManifest(incompleteSource).ok, 'incomplete source assignment was accepted');

const previouslyCoveredWork = validManifest();
previouslyCoveredWork.schema = 'femprompt-prisma-agent-run/1.3';
delete previouslyCoveredWork.codebook;
previouslyCoveredWork.model = { provider: 'OpenAI', model: 'gpt-example', model_version: '2026-08-23' };
previouslyCoveredWork.assignment.papers[0].human_coverage = true;
assert(!validateManifest(previouslyCoveredWork).ok, 'historical run with human coverage was accepted');

const analysisOfScreenedWork = validManifest();
analysisOfScreenedWork.assignment.papers[0].human_coverage = true;
assert(validateManifest(analysisOfScreenedWork).ok, 'analysis coding of a human-screened work was rejected');
delete analysisOfScreenedWork.assignment.papers[0].human_coverage;
assert(!validateManifest(analysisOfScreenedWork).ok, 'unrecorded human coverage was accepted');

// The shared paper fixture leaks mutations between cases, so each recode case clones it.
const recodeRun = () => {
  const run = structuredClone(validManifest());
  run.assignment.papers[0].human_coverage = false;
  run.assignment.papers[0].ai_agent_review_coverage = true;
  run.assignment.papers[0].recode_of = { 'PAPER-1': { annotation_id: 'ar2:PAPER-1', record_sha256: hash } };
  return run;
};
assert(validateManifest(recodeRun()).ok, 'a declared recode of an AI-agent-reviewed work was rejected');
const undeclaredReviewCoverage = recodeRun();
delete undeclaredReviewCoverage.assignment.papers[0].recode_of;
assert(!validateManifest(undeclaredReviewCoverage).ok, 'AI Agent Review coverage without a recode binding was accepted');
const recodeWithoutCoverage = recodeRun();
recodeWithoutCoverage.assignment.papers[0].ai_agent_review_coverage = false;
assert(!validateManifest(recodeWithoutCoverage).ok, 'a recode that denies its AI Agent Review coverage was accepted');
const recodeOutsideRecords = recodeRun();
recodeOutsideRecords.assignment.papers[0].recode_of = { OTHER: { annotation_id: 'ar2:OTHER', record_sha256: hash } };
assert(!validateManifest(recodeOutsideRecords).ok, 'a recode binding outside the assigned record IDs was accepted');
const recodeWithoutHash = recodeRun();
recodeWithoutHash.assignment.papers[0].recode_of['PAPER-1'].record_sha256 = 'sha256:abc';
assert(!validateManifest(recodeWithoutHash).ok, 'a recode binding without a record hash was accepted');
const historicalRecode = recodeRun();
historicalRecode.schema = 'femprompt-prisma-agent-run/1.3';
delete historicalRecode.codebook;
historicalRecode.model = { provider: 'OpenAI', model: 'gpt-example', model_version: '2026-08-23' };
assert(!validateManifest(historicalRecode).ok, 'a recode under a historical run schema was accepted');

const missingRepresentativeAlias = validManifest();
missingRepresentativeAlias.assignment.papers[0].record_ids = ['ALIAS-1'];
assert(!validateManifest(missingRepresentativeAlias).ok, 'work without its representative record ID was accepted');

const missingVersion = validManifest();
delete missingVersion.assignment.papers[0].version_id;
assert(!validateManifest(missingVersion).ok, 'version-aware run without a version ID was accepted');

const mismatchedTrackVersion = validManifest();
mismatchedTrackVersion.tracks[0].source_assignments[0].version_id = 'version:33333333-3333-5333-8333-333333333333';
assert(!validateManifest(mismatchedTrackVersion).ok, 'track with a mismatched source version was accepted');

const performedWithoutLog = validManifest();
performedWithoutLog.provenance.activities.unshift({
  id: 'identification-1',
  type: 'identification_activity',
  run_id: null,
  method: 'agentic_literature_supplement',
  prompt: { path: 'prompts/prism-agent-reviewer.md', version: '1.0', sha256: hash },
  model: { provider: 'OpenAI', model: 'gpt-example', model_version: '2026-08-23' },
  associated_actor_ids: ['agent-ar1'],
  status: 'completed',
  performed: true,
  performed_at: null,
  run_log: null,
});
assert(!validateManifest(performedWithoutLog).ok, 'unlogged identification activity was accepted');

const unexplainedLegacyGap = validManifest();
unexplainedLegacyGap.legacy_gap = 'old field';
assert(!validateManifest(unexplainedLegacyGap).ok, 'legacy_gap without migration was accepted');

console.log('PASS run contract: valid new run and required rejection cases');
