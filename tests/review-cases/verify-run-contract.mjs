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
    actor_id: `codex-${reviewerId}`,
    actor_type: 'ai_agent',
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
    schema: 'femprompt-prisma-agent-run/1.3',
    run_id: 'example-20260823',
    status: 'prepared',
    lifecycle: { baseline: 'identified', state: 'prepared', target: 'ai-agent-reviewed', events: [] },
    model: { provider: 'OpenAI', model: 'gpt-example', model_version: '2026-08-23' },
    prompt: { path: 'prompts/prism-agent-reviewer.md', version: '1.0', sha256: hash },
    baseline: { commit: 'a'.repeat(40) },
    assignment: { complete: true, papers: [paper] },
    isolation: {
      mode: 'operational',
      epistemic_independence_claimed: false,
      explanation: 'Separate Codex contexts, reviewer identities, and output paths are recorded per track.',
    },
    actors: [
      { id: 'codex-ar1', type: 'ai_agent', role: 'reviewer', reviewer_id: 'ar1' },
      { id: 'codex-ar2', type: 'ai_agent', role: 'reviewer', reviewer_id: 'ar2' },
      { id: 'codex-ai-agent-review', type: 'ai_agent', role: 'ai_agent_reviewer' },
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
        associated_actor_ids: ['codex-ai-agent-review'],
        status: 'planned',
        actor_id: 'codex-ai-agent-review',
        actor_type: 'ai_agent',
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
delete missingModel.model.model_version;
assert(!validateManifest(missingModel).ok, 'missing model version was accepted');

const oneTrack = validManifest();
oneTrack.tracks.pop();
assert(!validateManifest(oneTrack).ok, 'one-track run was accepted');

const visibleTranscription = validManifest();
visibleTranscription.execution.mode = 'blinded_source_review_with_operator_prism_transcription';
assert(!validateManifest(visibleTranscription).ok, 'visible transcription was accepted as the canonical Codex transfer');

const incompleteSource = validManifest();
incompleteSource.tracks[1].source_assignments = [];
assert(!validateManifest(incompleteSource).ok, 'incomplete source assignment was accepted');

const previouslyCoveredWork = validManifest();
previouslyCoveredWork.assignment.papers[0].human_coverage = true;
assert(!validateManifest(previouslyCoveredWork).ok, 'work with human coverage was accepted');

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
  associated_actor_ids: ['codex-ar1'],
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
