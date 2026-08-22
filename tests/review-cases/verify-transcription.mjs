import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const runArgument = process.argv[2];

if (!runArgument) {
  throw new Error('usage: node tests/review-cases/verify-transcription.mjs <run.json>');
}

function bytes(path) {
  return readFileSync(resolve(root, path));
}

function json(path) {
  return JSON.parse(bytes(path).toString('utf8'));
}

function sha256(path) {
  return createHash('sha256').update(bytes(path)).digest('hex');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
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

function stableValues(value) {
  return Array.isArray(value) ? [...value].sort() : value;
}

function sameValue(actual, expected, label) {
  const left = JSON.stringify(stableValues(actual));
  const right = JSON.stringify(stableValues(expected));
  assert(left === right, `${label}: ${left} != ${right}`);
}

const level = { nein: 0, teilweise: 1, ja: 2 };
const runPath = runArgument.replaceAll('\\', '/');
const run = json(runPath);
const expectedIds = [...run.paper_ids].sort();
let evidenceCount = 0;

assert(run.execution?.mode === 'blinded_source_review_with_operator_prism_transcription', 'unexpected execution mode');

for (const track of run.tracks) {
  const packet = json(track.coding_packet);
  const exportData = json(track.export);
  const actualIds = Object.keys(exportData.decisions || {}).sort();

  assert(exportData.schema === 'femprompt-prisma-reviewer/0.3', `${track.reviewer}: unexpected schema`);
  assert(exportData.reviewer === track.reviewer, `${track.reviewer}: payload reviewer differs`);
  assert(exportData.actor === 'agent', `${track.reviewer}: payload actor differs`);
  assert(JSON.stringify(actualIds) === JSON.stringify(expectedIds), `${track.reviewer}: paper IDs differ from manifest`);

  for (const id of expectedIds) {
    const expected = packet.decisions[id];
    const actual = exportData.decisions[id];
    assert(expected && actual, `${track.reviewer}/${id}: missing record`);
    assert(actual.reviewer === track.reviewer && actual.actor === 'agent', `${track.reviewer}/${id}: record provenance differs`);
    assert(actual.decision === expected.decision, `${track.reviewer}/${id}: decision differs`);
    assert((actual.reason || null) === (expected.reason || null), `${track.reviewer}/${id}: exclusion reason differs`);

    for (const [category, expectedLabel] of Object.entries(expected.categories)) {
      const actualLevel = Number(actual.categories?.[category] || 0);
      assert(actualLevel === level[expectedLabel], `${track.reviewer}/${id}/${category}: category level differs`);
      const expectedQuotes = expected.evidence?.[category] || [];
      const actualEvidence = actual.evidence?.[category] || [];
      assert(actualEvidence.length === expectedQuotes.length, `${track.reviewer}/${id}/${category}: evidence count differs`);

      for (let index = 0; index < expectedQuotes.length; index += 1) {
        const quote = normalizedText(expectedQuotes[index]);
        const evidence = actualEvidence[index];
        const term = normalizedText(evidence?.term);
        assert(term === quote.slice(0, 80).trimEnd(), `${track.reviewer}/${id}/${category}: pinned term differs`);
        assert(evidence.source_layer === 'paper' && evidence.actor === 'agent', `${track.reviewer}/${id}/${category}: evidence provenance differs`);
        evidenceCount += 1;
      }
    }

    if (expected.source_path) {
      const source = normalizedText(bytes(expected.source_path).toString('utf8'));
      const served = normalizedText(bytes(`docs/data/fulltext/${id}.md`).toString('utf8'));
      for (const quote of Object.values(expected.evidence || {}).flat()) {
        const normalizedQuote = normalizedText(quote);
        assert(source.includes(normalizedQuote), `${track.reviewer}/${id}: quote absent from assigned source`);
        assert(served.includes(normalizedQuote), `${track.reviewer}/${id}: quote absent from served PRISM full text`);
      }
      assert(actual.text_source === 'raw', `${track.reviewer}/${id}: PRISM did not record raw full text`);
    } else {
      assert(Object.values(actual.evidence || {}).flat().length === 0, `${track.reviewer}/${id}: evidence exists without assigned full text`);
    }

    if (expected.decision === 'Include') {
      const fields = actual.analysis?.fields || {};
      for (const [field, expectedValue] of Object.entries(expected.analysis || {})) {
        sameValue(fields[field], expectedValue, `${track.reviewer}/${id}/${field}`);
      }
    } else {
      assert(!actual.analysis, `${track.reviewer}/${id}: non-Include record has analysis coding`);
    }
  }

  console.log(`PASS ${track.reviewer}: ${actualIds.length} records, sha256=${sha256(track.export)}`);
}

console.log(`PASS transcription: ${run.tracks.length} tracks, ${evidenceCount} evidence passages`);
