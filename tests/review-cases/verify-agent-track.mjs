import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const provisionalRunPath = 'tests/review-cases/agent-runs/agent-v03-10b-20260822/run.json';
const ratificationRunPath = 'tests/review-cases/agent-runs/ratification-ar2-20260822/run.json';

function bytes(path) {
  return readFileSync(resolve(root, path));
}

function json(path) {
  return JSON.parse(bytes(path).toString('utf8'));
}

function sha256(path) {
  return createHash('sha256').update(bytes(path)).digest('hex').toUpperCase();
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function same(actual, expected, label) {
  const stable = (value) => {
    if (Array.isArray(value)) return value.map(stable);
    if (value && typeof value === 'object')
      return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
    return value;
  };
  assert(JSON.stringify(stable(actual)) === JSON.stringify(stable(expected)), `${label} differs`);
}

function normalizedText(value) {
  return String(value || '')
    .normalize('NFKC')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

const provisionalRun = json(provisionalRunPath);
for (const input of provisionalRun.integration.inputs)
  assert(sha256(input.path) === input.sha256, `input hash mismatch: ${input.path}`);

const main = json(provisionalRun.integration.inputs[0].path);
const supplement = json(provisionalRun.integration.inputs[1].path);
const acceptance = json(provisionalRun.integration.acceptance_copy.path);

const merged = { ...main.decisions, ...supplement.decisions };
same(acceptance.decisions, merged, 'provisional acceptance decisions');
assert(acceptance.status === 'provisional_technical_acceptance', 'historical acceptance is not provisional');
assert(
  sha256(provisionalRun.integration.acceptance_copy.path) === provisionalRun.integration.acceptance_copy.sha256,
  'historical acceptance hash mismatch',
);

const ratificationRun = json(ratificationRunPath);
for (const track of ratificationRun.tracks)
  assert(sha256(track.export).toLowerCase() === track.sha256, `ratification track hash mismatch: ${track.export}`);

const consensusPath = ratificationRun.adjudication.consensus.path;
const consensus = json(consensusPath);
assert(
  sha256(consensusPath).toLowerCase() === ratificationRun.adjudication.consensus.sha256,
  'consensus hash mismatch',
);

const productPath = ratificationRun.adjudication.integration.output;
const product = json(productPath);
const acceptedAt = ratificationRun.adjudication.integration.accepted_at;
const decisions = {};
for (const id of ratificationRun.paper_ids) {
  const record = structuredClone(consensus.records[id]?.proposed_record);
  assert(record?.decision, `${id}: consensus record missing`);
  record.ts = acceptedAt;
  record.reviewer = 'ar2';
  record.actor = 'agent';
  decisions[id] = record;
}

const expectedProduct = {
  schema: 'femprompt-prisma-reviewer/0.3',
  reviewer: 'ar2',
  actor: 'agent',
  status: 'ratified_agent_consensus',
  updated: acceptedAt,
  ratification: {
    run_id: ratificationRun.run_id,
    method: 'dual_blind_agent_review_with_independent_source_adjudication',
    consensus_path: consensusPath,
    consensus_sha256: ratificationRun.adjudication.consensus.sha256,
    input_tracks: ratificationRun.tracks.map((track) => ({
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

same(product, expectedProduct, 'ratified product');
assert(
  sha256(productPath).toLowerCase() === ratificationRun.adjudication.integration.output_sha256,
  'ratified product hash mismatch',
);

const ids = Object.keys(product.decisions).sort();
assert(ids.length === 10, `expected 10 records, got ${ids.length}`);
assert(
  JSON.stringify(ids) === JSON.stringify([...ratificationRun.paper_ids].sort()),
  'ratified product IDs differ from the run manifest',
);

let evidenceCount = 0;
for (const id of ids) {
  const record = product.decisions[id];
  assert(record.reviewer === 'ar2' && record.actor === 'agent', `${id}: record provenance changed`);
  assert(['Include', 'Unclear', 'Exclude'].includes(record.decision), `${id}: invalid decision`);
  for (const [category, level] of Object.entries(record.categories || {})) {
    if (Number(level) <= 0) continue;
    const evidence = record.evidence?.[category] || [];
    assert(evidence.length > 0, `${id}: ${category} has no evidence`);
  }
  if (record.decision === 'Include') {
    const analysis = record.analysis;
    assert(analysis?.fields?.Studientyp, `${id}: Include has no study type`);
    assert(analysis?.fields?.AN_Coding_Basis, `${id}: Include has no coding basis`);
  }

  const sourcePath = ratificationRun.paper_sources[id];
  if (!sourcePath?.startsWith('generated/')) {
    assert(!Object.values(record.evidence || {}).flat().length, `${id}: evidence exists without pinned full text`);
    continue;
  }
  const paper = normalizedText(bytes(sourcePath).toString('utf8'));
  for (const evidence of Object.values(record.evidence || {}).flat()) {
    const quote = normalizedText(evidence.term || evidence.snippet);
    assert(quote && paper.includes(quote), `${id}: evidence is not verbatim in the pinned full text`);
    evidenceCount += 1;
  }
}

console.log(
  `PASS agent track: historical provisional acceptance and ratified product verified; ${ids.length} records, ${evidenceCount} evidence passages`,
);
