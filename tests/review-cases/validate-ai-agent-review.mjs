import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateCodingPacket } from './validate-coding-packet.mjs';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));

function json(path) {
  return JSON.parse(readFileSync(resolve(root, path), 'utf8'));
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex');
}

function nonempty(value) {
  return typeof value === 'string' && Boolean(value.trim());
}

export function validateAiAgentReview(review, run) {
  const errors = [];
  if (review?.schema !== 'femprompt-prisma-ai-agent-review/0.1') errors.push('schema must be femprompt-prisma-ai-agent-review/0.1');
  if (review?.run_id !== run.run_id) errors.push('run_id differs from manifest');
  if (review?.actor !== 'agent' || review?.reviewer !== 'ai-agent-review') errors.push('review actor or reviewer differs');
  if (!nonempty(review?.created) || Number.isNaN(Date.parse(review.created))) errors.push('created timestamp is invalid');

  const trackInputs = Array.isArray(review?.inputs?.tracks) ? review.inputs.tracks : [];
  for (const track of run.tracks) {
    const input = trackInputs.find((candidate) => candidate.reviewer === track.reviewer_id);
    if (!input || input.path !== track.coding_packet) errors.push(`input track ${track.reviewer_id} differs from manifest`);
    else if (input.sha256 !== sha256(input.path)) errors.push(`input track ${track.reviewer_id} hash differs`);
  }
  if (trackInputs.length !== run.tracks.length) errors.push('input track count differs from manifest');

  const sourceInputs = Array.isArray(review?.inputs?.sources)
    ? Object.fromEntries(review.inputs.sources.map((source) => [source.paper_id, source]))
    : review?.inputs?.sources || {};
  for (const paper of run.assignment.papers) {
    const input = sourceInputs[paper.paper_id];
    if (!input || input.path !== paper.source.path) errors.push(`input source ${paper.paper_id} differs from manifest`);
    else if (input.sha256 !== paper.source.sha256 || input.sha256 !== sha256(input.path))
      errors.push(`input source ${paper.paper_id} hash differs`);
  }
  if (Object.keys(sourceInputs).length !== run.assignment.papers.length) errors.push('input source count differs from manifest');

  const expectedIds = run.assignment.papers.map((paper) => paper.paper_id).sort();
  const actualIds = Object.keys(review?.records || {}).sort();
  if (JSON.stringify(actualIds) !== JSON.stringify(expectedIds)) errors.push('review record IDs differ from manifest');
  const virtualDecisions = {};
  let resolved = 0;
  const decisionCounts = { Include: 0, Unclear: 0, Exclude: 0 };
  for (const paper of run.assignment.papers) {
    const record = review?.records?.[paper.paper_id];
    const label = `ai-agent-review/${paper.paper_id}`;
    if (!record) continue;
    if (!['agreed', 'resolved'].includes(record.result)) errors.push(`${label}.result is invalid`);
    const differences = Array.isArray(record.differences) ? record.differences : [];
    if (record.result === 'agreed' && differences.length) errors.push(`${label}.agreed record contains differences`);
    if (record.result === 'resolved') {
      resolved += 1;
      if (!differences.length) errors.push(`${label}.resolved record has no documented difference`);
    }
    if (!nonempty(record.rationale)) errors.push(`${label}.rationale is missing`);
    virtualDecisions[paper.paper_id] = {
      source_path: paper.source.path,
      identity_check: record.identity_check,
      ...record.final_coding,
    };
    const decision = record.final_coding?.decision;
    if (decision in decisionCounts) decisionCounts[decision] += 1;
  }

  const virtualPacket = {
    schema: 'femprompt-prisma-coding-packet/0.1',
    run_id: run.run_id,
    reviewer: 'ai-agent-review',
    actor: 'agent',
    source_mode: run.execution.mode,
    decisions: virtualDecisions,
  };
  const virtualRun = structuredClone(run);
  virtualRun.tracks.push({
    reviewer_id: 'ai-agent-review',
    paper_ids: expectedIds,
    source_assignments: run.assignment.papers.map((paper) => ({
      paper_id: paper.paper_id,
      source_path: paper.source.path,
      source_sha256: paper.source.sha256,
    })),
  });
  const codingValidation = validateCodingPacket(virtualPacket, virtualRun, 'ai-agent-review');
  if (!codingValidation.ok) errors.push(...codingValidation.errors.map((error) => `final coding: ${error}`));

  const summary = review?.summary || {};
  if ((summary.records ?? summary.record_count) !== expectedIds.length) errors.push('summary record count differs from manifest');
  if ((summary.resolved_records ?? summary.resolved_difference_records) !== resolved)
    errors.push('summary resolved record count differs from records');
  if (JSON.stringify(summary.decisions || {}) !== JSON.stringify(decisionCounts)) errors.push('summary.decisions differs from records');
  return { ok: errors.length === 0, errors: [...new Set(errors)] };
}

function main() {
  const [runPath, reviewPath] = process.argv.slice(2);
  if (!runPath || !reviewPath) throw new Error('usage: node tests/review-cases/validate-ai-agent-review.mjs <run.json> <review.json>');
  const run = json(runPath);
  const result = validateAiAgentReview(json(reviewPath), run);
  if (!result.ok) {
    console.error('FAIL AI-agent review');
    for (const error of result.errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(`PASS AI-agent review: ${run.assignment.papers.length} records`);
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) main();
