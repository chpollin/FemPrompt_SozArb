import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createPrismaWindow } from '../prisma-window.mjs';
import { validateCodingPacket } from './validate-coding-packet.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');

function json(path) {
  return JSON.parse(readFileSync(resolve(root, path), 'utf8'));
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex');
}

function main() {
  const [runPath, reviewerId, projectionPath, outputPath] = process.argv.slice(2);
  if (!runPath || !reviewerId || !projectionPath || !outputPath)
    throw new Error('usage: node tests/review-cases/roundtrip-prism-track.mjs <run.json> <reviewer-id> <projection.json> <output.json>');

  const run = json(runPath);
  const track = run.tracks.find((candidate) => candidate.reviewer_id === reviewerId);
  if (!track?.coding_packet) throw new Error(`manifest has no coding packet for ${reviewerId}`);
  const packet = json(track.coding_packet);
  const codingValidation = validateCodingPacket(packet, run, reviewerId);
  if (!codingValidation.ok) throw new Error(`invalid coding packet:\n- ${codingValidation.errors.join('\n- ')}`);

  const projection = json(projectionPath);
  projection.transcription = {
    ...projection.transcription,
    method: 'deterministic_projection_with_prism_frontend_roundtrip',
    projection_path: projectionPath,
    projection_sha256: sha256(projectionPath),
  };

  const { window } = createPrismaWindow(root);
  const tool = window.__PRISMA_TEST__;
  tool.setAnalysisFields(json('docs/data/analysis_fields.json'));
  const corpus = json('docs/data/research_vault_v2.json');
  tool.setPapers(Array.isArray(corpus) ? corpus : corpus.papers || []);
  const payloadValidation = tool.validateReviewerPayload(projection);
  if (!payloadValidation.ok) throw new Error(`PRISM rejected projection: ${payloadValidation.message}`);
  // A governed transfer explicitly enters the same write mode as the UI.
  // Selecting a stored reviewer must never enable writes by itself.
  tool.setEditMode(true);
  tool.selectReviewer(reviewerId);
  const imported = tool.importReviewerPayload(projection, reviewerId, true);
  if (!imported.ok || imported.count !== track.paper_ids.length)
    throw new Error(`PRISM import failed: ${JSON.stringify(imported)}`);
  for (const id of track.paper_ids) {
    const requirements = tool.recordRequirements(tool.curDec()[id]);
    if (!requirements.ok) throw new Error(`${id}: PRISM requirements failed: ${requirements.missing.join(', ')}`);
  }
  const output = `${tool.reviewerFileText(reviewerId)}\n`;
  writeFileSync(resolve(root, outputPath), output);
  console.log(`PASS PRISM frontend roundtrip: ${reviewerId}, ${imported.count} records -> ${outputPath}`);
}

main();
