import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
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

function normalizedText(value) {
  return String(value || '')
    .normalize('NFKC')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function stable(value) {
  if (Array.isArray(value)) return [...value].sort();
  if (value && typeof value === 'object')
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  return value;
}

function same(left, right) {
  return JSON.stringify(stable(left)) === JSON.stringify(stable(right));
}

export function validatePrismTrack(payload, packet, run, reviewerId) {
  const errors = [];
  const packetValidation = validateCodingPacket(packet, run, reviewerId);
  if (!packetValidation.ok) errors.push(...packetValidation.errors.map((error) => `coding packet: ${error}`));
  const track = run.tracks.find((candidate) => candidate.reviewer_id === reviewerId);
  if (!track) return { ok: false, errors: [`reviewer ${reviewerId} is absent from manifest`] };

  if (!['femprompt-prisma-reviewer/0.3', 'femprompt-prisma-reviewer/0.4'].includes(payload?.schema))
    errors.push('track schema must be femprompt-prisma-reviewer/0.3 or version-aware 0.4');
  if (payload?.reviewer !== reviewerId || payload?.actor !== 'agent') errors.push('track reviewer or actor differs');
  if (!/^\d{4}-\d{2}-\d{2}T/.test(payload?.updated || '')) errors.push('track updated timestamp is missing');
  const expectedIds = [...track.paper_ids].sort();
  const actualIds = Object.keys(payload?.decisions || {}).sort();
  if (JSON.stringify(actualIds) !== JSON.stringify(expectedIds)) errors.push('track decision IDs differ from manifest');

  if (payload?.transcription) {
    if (payload.transcription.run_id !== run.run_id) errors.push('transcription run_id differs from manifest');
    if (payload.transcription.source_packet !== track.coding_packet) errors.push('transcription source packet differs from manifest');
    if (payload.transcription.source_packet_sha256 !== sha256(track.coding_packet)) errors.push('transcription source packet hash differs');
  }

  for (const id of expectedIds) {
    const expected = packet?.decisions?.[id];
    const actual = payload?.decisions?.[id];
    const label = `${reviewerId}/${id}`;
    if (!expected || !actual) {
      errors.push(`${label} is missing`);
      continue;
    }
    const expectedCategories = Object.fromEntries(
      Object.entries(expected.categories)
        .filter(([, value]) => level[value] > 0)
        .map(([category, value]) => [category, level[value]]),
    );
    if (!same(actual.categories, expectedCategories)) errors.push(`${label}.categories differ from coding packet`);
    if (actual.decision !== expected.decision) errors.push(`${label}.decision differs from coding packet`);
    if ((actual.reason || null) !== (expected.reason || null)) errors.push(`${label}.reason differs from coding packet`);
    if (actual.override !== false || actual.override_reason !== null) errors.push(`${label} contains an unassigned override`);
    if (actual.reviewer !== reviewerId || actual.actor !== 'agent') errors.push(`${label} record provenance differs`);
    if (actual.text_source !== 'raw') errors.push(`${label}.text_source must be raw`);
    if (payload.schema === 'femprompt-prisma-reviewer/0.4') {
      const assignment = run.assignment.papers.find((paper) => paper.paper_id === id);
      if (!assignment || actual.work_id !== assignment.work_id ||
          actual.version_id !== assignment.version_id ||
          actual.version_type !== assignment.version_type ||
          actual.preferred_version_id !== assignment.preferred_version_id)
        errors.push(`${label} work-version identity differs from manifest`);
    }

    for (const [category, quotes] of Object.entries(expected.evidence)) {
      const evidence = actual.evidence?.[category] || [];
      if (evidence.length !== quotes.length) errors.push(`${label}.${category} evidence count differs`);
      for (const [index, quote] of quotes.entries()) {
        const item = evidence[index];
        if (normalizedText(item?.term) !== normalizedText(quote).slice(0, 80).trimEnd())
          errors.push(`${label}.${category} evidence[${index}] term differs`);
        if (item?.source_layer !== 'paper' || item?.actor !== 'agent')
          errors.push(`${label}.${category} evidence[${index}] provenance differs`);
        if (payload.schema === 'femprompt-prisma-reviewer/0.4' &&
            (item?.work_id !== actual.work_id || item?.version_id !== actual.version_id))
          errors.push(`${label}.${category} evidence[${index}] version differs`);
      }
    }

    if (expected.decision === 'Include') {
      const { undecidable = {}, ...fields } = expected.analysis;
      if (!same(actual.analysis?.fields, fields)) errors.push(`${label}.analysis.fields differ from coding packet`);
      if (!same(actual.analysis?.undecidable || {}, undecidable)) errors.push(`${label}.analysis.undecidable differs from coding packet`);
    } else if ('analysis' in actual) {
      errors.push(`${label}.analysis must be absent outside Include`);
    }
  }

  return { ok: errors.length === 0, errors: [...new Set(errors)] };
}

function main() {
  const [runPath, reviewerId, payloadPath] = process.argv.slice(2);
  if (!runPath || !reviewerId || !payloadPath)
    throw new Error('usage: node tests/review-cases/validate-prism-track.mjs <run.json> <reviewer-id> <track.json>');
  const run = json(runPath);
  const track = run.tracks.find((candidate) => candidate.reviewer_id === reviewerId);
  if (!track?.coding_packet) throw new Error(`manifest has no coding packet for ${reviewerId}`);
  const result = validatePrismTrack(json(payloadPath), json(track.coding_packet), run, reviewerId);
  if (!result.ok) {
    console.error(`FAIL PRISM track: ${reviewerId}`);
    for (const error of result.errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(`PASS PRISM track: ${reviewerId}, ${track.paper_ids.length} records`);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) main();
