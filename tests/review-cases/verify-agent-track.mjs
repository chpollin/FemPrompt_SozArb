import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateManifest } from './validate-run-contract.mjs';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const provisionalRunPath = 'tests/review-cases/agent-runs/agent-v03-10b-20260822/run.json';
const ratificationRunPath = 'tests/review-cases/agent-runs/ratification-ar2-20260822/run.json';
const currentProductPath = 'docs/data/screening/ar2.json';

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
const contract = validateManifest(ratificationRun, { path: ratificationRunPath });
assert(contract.ok && contract.legacy, 'historical ratification manifest is not accepted as legacy');
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

const currentProduct = json(currentProductPath);
assert(currentProduct.schema === 'femprompt-prisma-reviewer/0.5', 'current product is not schema 0.5');
assert(currentProduct.status === 'ai-agent-reviewed', 'current product is not ai-agent-reviewed');
for (const id of ratificationRun.paper_ids) {
  const current = structuredClone(currentProduct.decisions[id]);
  const historical = structuredClone(product.decisions[id]);
  delete current.provenance;
  delete current.lifecycle;
  delete current.annotations;
  delete current.active_annotation_id;
  delete current.checks;
  same(current, historical, `${id}: lifecycle projection changed the screening decision`);

  const provenance = currentProduct.decisions[id].provenance;
  const lifecycle = currentProduct.decisions[id].lifecycle;
  assert(lifecycle?.baseline?.state === 'curated', `${id}: curated baseline missing`);
  assert(lifecycle?.state === 'ai-agent-reviewed', `${id}: lifecycle state differs`);
  assert(lifecycle?.events?.length === 2, `${id}: expected two lifecycle events`);
  assert(lifecycle.events[0].to === 'agent-annotated', `${id}: agent annotation event missing`);
  assert(lifecycle.events[1].to === 'ai-agent-reviewed', `${id}: AI-agent review event missing`);
  assert(lifecycle.events[1].event_type === 'ai_agent_review', `${id}: AI-agent review event type differs`);
  assert(provenance?.activities?.length === 2, `${id}: provenance activities missing`);
  assert(
    provenance.activities.every((activity) => activity.prompt?.status === 'recorded'),
    `${id}: recorded prompt provenance missing`,
  );
  assert(
    provenance.activities.every((activity) => activity.model?.status === 'legacy_gap'),
    `${id}: historical model gap is not explicit`,
  );
  assert(currentProduct.decisions[id].annotations?.length === 1, `${id}: original annotation snapshot missing`);
  assert(
    currentProduct.decisions[id].active_annotation_id === currentProduct.decisions[id].annotations[0].annotation_id,
    `${id}: active annotation pointer differs`,
  );
  assert(
    currentProduct.decisions[id].checks?.some((check) => check.check_type === 'lifecycle_contract' && check.status === 'passed'),
    `${id}: deterministic lifecycle validation receipt missing`,
  );
}

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
