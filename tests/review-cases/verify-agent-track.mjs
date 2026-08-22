import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const runPath = 'tests/review-cases/agent-runs/agent-v03-10b-20260822/run.json';

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

const run = json(runPath);
for (const input of run.integration.inputs)
  assert(sha256(input.path) === input.sha256, `input hash mismatch: ${input.path}`);

const main = json(run.integration.inputs[0].path);
const supplement = json(run.integration.inputs[1].path);
const product = json(run.integration.output.path);
const acceptance = json(run.integration.acceptance_copy.path);

const merged = { ...main.decisions, ...supplement.decisions };
same(product.decisions, merged, 'integrated decisions');
same(acceptance, product, 'acceptance copy');
assert(product.schema === 'femprompt-prisma-reviewer/0.3', 'unexpected reviewer schema');
assert(product.reviewer === 'ar2' && product.actor === 'agent', 'reviewer or actor changed');
assert(product.status === 'provisional_technical_acceptance', 'product status is not provisional');
assert(sha256(run.integration.output.path) === run.integration.output.sha256, 'product hash mismatch');
assert(sha256(run.integration.acceptance_copy.path) === run.integration.acceptance_copy.sha256, 'acceptance hash mismatch');

const ids = Object.keys(product.decisions).sort();
assert(ids.length === 10, `expected 10 records, got ${ids.length}`);

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

  const expectedFulltextHash = run.fulltext_sha256[id];
  if (!expectedFulltextHash) {
    assert(!Object.values(record.evidence || {}).flat().length, `${id}: evidence exists without pinned full text`);
    continue;
  }
  const fulltextPath = `docs/data/fulltext/${id}.md`;
  assert(sha256(fulltextPath) === expectedFulltextHash, `${id}: full-text hash mismatch`);
  const paper = normalizedText(bytes(fulltextPath).toString('utf8'));
  for (const evidence of Object.values(record.evidence || {}).flat()) {
    const quote = normalizedText(evidence.term || evidence.snippet);
    assert(quote && paper.includes(quote), `${id}: evidence is not verbatim in the pinned full text`);
    evidenceCount += 1;
  }
}

console.log(`PASS agent track: ${ids.length} records, ${evidenceCount} evidence passages, hashes and integration verified`);
