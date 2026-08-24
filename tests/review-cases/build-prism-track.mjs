import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateCodingPacket } from './validate-coding-packet.mjs';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const level = { nein: 0, teilweise: 1, ja: 2 };

function json(path) {
  return JSON.parse(readFileSync(resolve(root, path), 'utf8'));
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex');
}

function sortedObject(value) {
  return Object.fromEntries(Object.entries(value).sort(([left], [right]) => left.localeCompare(right)));
}

function buildEvidence(record, timestamp, paper = {}) {
  const evidence = {};
  for (const [category, quotes] of Object.entries(record.evidence)) {
    if (!quotes.length) continue;
    evidence[category] = quotes.map((quote) => {
      const item = {
      term: quote.trim().slice(0, 80),
      snippet: quote.trim().slice(0, 260),
      ts: timestamp,
      origin: 'human',
      source_layer: 'paper',
      actor: 'agent',
      };
      if (paper.version_id) Object.assign(item, {
        paper_id: paper.paper_id,
        work_id: paper.work_id,
        version_id: paper.version_id,
      });
      return item;
    });
  }
  return evidence;
}

export function buildPrismRecord(record, reviewerId, timestamp, paper = {}) {
  const categories = Object.fromEntries(
    Object.entries(record.categories)
      .filter(([, value]) => level[value] > 0)
      .map(([category, value]) => [category, level[value]]),
  );
  const output = {
    categories,
    decision: record.decision,
    override: false,
    reason: record.decision === 'Exclude' ? record.reason : null,
    override_reason: null,
    evidence: buildEvidence(record, timestamp, paper),
    ts: timestamp,
    reviewer: reviewerId,
    actor: 'agent',
    text_source: 'raw',
  };
  if (paper.version_id) Object.assign(output, {
    work_id: paper.work_id,
    version_id: paper.version_id,
    version_type: paper.version_type,
    preferred_version_id: paper.preferred_version_id,
    selected_version_is_preferred: paper.selected_version_is_preferred === true,
  });
  if (record.decision === 'Include') {
    const { undecidable = {}, ...fields } = record.analysis;
    output.analysis = { fields, undecidable };
  }
  return output;
}

export function buildPrismTrack(runPath, reviewerId, timestamp) {
  const run = json(runPath);
  const track = run.tracks.find((candidate) => candidate.reviewer_id === reviewerId);
  if (!track?.coding_packet) throw new Error(`manifest has no coding packet for ${reviewerId}`);
  const packet = json(track.coding_packet);
  const validation = validateCodingPacket(packet, run, reviewerId);
  if (!validation.ok) throw new Error(`invalid coding packet:\n- ${validation.errors.join('\n- ')}`);

  const decisions = {};
  const assignments = new Map(run.assignment.papers.map((paper) => [paper.paper_id, paper]));
  for (const id of track.paper_ids)
    decisions[id] = buildPrismRecord(packet.decisions[id], reviewerId, timestamp, assignments.get(id));
  return {
    schema: run.schema === 'femprompt-prisma-agent-run/1.3'
      ? 'femprompt-prisma-reviewer/0.4'
      : 'femprompt-prisma-reviewer/0.3',
    reviewer: reviewerId,
    actor: 'agent',
    updated: timestamp,
    transcription: {
      run_id: run.run_id,
      source_packet: track.coding_packet,
      source_packet_sha256: sha256(track.coding_packet),
      method: 'deterministic_packet_projection_pending_prism_roundtrip',
    },
    decisions: sortedObject(decisions),
  };
}

function main() {
  const [runPath, reviewerId, outputPath, timestamp = new Date().toISOString()] = process.argv.slice(2);
  if (!runPath || !reviewerId || !outputPath)
    throw new Error('usage: node tests/review-cases/build-prism-track.mjs <run.json> <reviewer-id> <output.json> [timestamp]');
  const payload = buildPrismTrack(runPath, reviewerId, timestamp);
  writeFileSync(resolve(root, outputPath), `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`WROTE PRISM import payload: ${outputPath}, ${Object.keys(payload.decisions).length} records`);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) main();
