import { createHash } from 'node:crypto';
import { readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const [runArgument, consensusArgument, outputArgument, acceptedAt, confirmation] = process.argv.slice(2);

if (!runArgument || !consensusArgument || !outputArgument || !acceptedAt || !['--accept', '--check'].includes(confirmation)) {
  throw new Error(
    'usage: node tests/review-cases/apply-ratification.mjs <run.json> <consensus.json> <output.json> <accepted-at> <--accept|--check>',
  );
}

function absolute(path) {
  return resolve(root, path);
}

function bytes(path) {
  return readFileSync(absolute(path));
}

function json(path) {
  return JSON.parse(bytes(path).toString('utf8'));
}

function sha256Bytes(value) {
  return createHash('sha256').update(value).digest('hex');
}

function sha256(path) {
  return sha256Bytes(bytes(path));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const run = json(runArgument);
const consensus = json(consensusArgument);
const consensusHash = sha256(consensusArgument);

assert(consensus.run_id === run.run_id, 'run IDs differ');
assert(consensus.phase === 'A_blinded_source_adjudication', 'unexpected consensus phase');
assert(consensus.summary?.phase_a_gate === 'PASS', 'Phase-A gate did not pass');
assert(consensus.summary?.status_counts?.blocked === 0, 'consensus contains blocked records');
assert(Number.isFinite(Date.parse(acceptedAt)), 'accepted-at is not an ISO timestamp');

const consensusIds = Object.keys(consensus.records || {});
assert(JSON.stringify(consensusIds) === JSON.stringify(run.paper_ids), 'consensus IDs or order differ from manifest');

const decisions = {};
for (const id of run.paper_ids) {
  const proposed = structuredClone(consensus.records[id]?.proposed_record);
  assert(proposed && proposed.decision, `${id}: proposed record missing`);
  proposed.ts = acceptedAt;
  proposed.reviewer = 'ar2';
  proposed.actor = 'agent';
  decisions[id] = proposed;
}

const payload = {
  schema: 'femprompt-prisma-reviewer/0.3',
  reviewer: 'ar2',
  actor: 'agent',
  status: 'ratified_agent_consensus',
  updated: acceptedAt,
  ratification: {
    run_id: run.run_id,
    method: 'dual_blind_agent_review_with_independent_source_adjudication',
    consensus_path: consensusArgument.replaceAll('\\', '/'),
    consensus_sha256: consensusHash,
    input_tracks: run.tracks.map((track) => ({
      reviewer: track.reviewer,
      path: track.export,
      sha256: track.sha256,
    })),
    operator_acceptance: {
      status: 'accepted',
      accepted_at: acceptedAt,
      basis: 'User authorized direct integration into the real research data and execution through Milestone 1.',
    },
  },
  decisions,
};

const serialized = `${JSON.stringify(payload, null, 2)}\n`;
const outputPath = absolute(outputArgument);
if (confirmation === '--check') {
  assert(readFileSync(outputPath, 'utf8') === serialized, 'ratified output differs from consensus projection');
} else {
  const temporaryPath = `${outputPath}.tmp`;
  writeFileSync(temporaryPath, serialized, 'utf8');
  renameSync(temporaryPath, outputPath);
}

console.log(`PASS ratification ${confirmation === '--check' ? 'verification' : 'integration'}: ${run.paper_ids.length} records`);
console.log(`consensus sha256=${consensusHash}`);
console.log(`output sha256=${sha256Bytes(serialized)}`);
