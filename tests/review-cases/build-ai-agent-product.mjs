import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildPrismRecord } from './build-prism-track.mjs';
import { validateAiAgentReview } from './validate-ai-agent-review.mjs';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));

function json(path) {
  return JSON.parse(readFileSync(resolve(root, path), 'utf8'));
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex');
}

function main() {
  const [runPath, reviewPath, outputPath, timestamp = new Date().toISOString()] = process.argv.slice(2);
  if (!runPath || !reviewPath || !outputPath)
    throw new Error('usage: node tests/review-cases/build-ai-agent-product.mjs <run.json> <review.json> <output.json> [timestamp]');
  const run = json(runPath);
  const review = json(reviewPath);
  const validation = validateAiAgentReview(review, run);
  if (!validation.ok) throw new Error(`invalid AI-agent review:\n- ${validation.errors.join('\n- ')}`);
  const reviewActivity = run.provenance?.activities?.find(
    (activity) => activity.type === 'ai_agent_review',
  );
  if (!reviewActivity?.actor_id)
    throw new Error('run manifest has no AI-agent-review actor');

  const decisions = {};
  for (const paper of run.assignment.papers) {
    for (const recordId of paper.record_ids) {
      decisions[recordId] = {
        ...buildPrismRecord(review.records[paper.paper_id].final_coding, 'ar2', timestamp, paper),
        representative_record_id: paper.paper_id,
      };
      if (recordId !== paper.paper_id) decisions[recordId].alias_of = paper.paper_id;
    }
  }
  const product = {
    schema: run.schema === 'femprompt-prisma-agent-run/1.3'
      ? 'femprompt-prisma-reviewer/0.4'
      : 'femprompt-prisma-reviewer/0.3',
    reviewer: 'ar2',
    actor: 'agent',
    status: 'ai-agent-reviewed',
    updated: timestamp,
    review_context: {
      run_id: run.run_id,
      provenance_method: 'operationally_isolated_agent_screening_with_source_grounded_ai_agent_review',
      run_manifest: runPath,
      review_path: reviewPath,
      review_sha256: sha256(reviewPath),
      ai_agent_reviewer_actor_id: reviewActivity.actor_id,
      input_tracks: run.tracks.map((track) => ({
        reviewer: track.reviewer_id,
        actor_id: track.actor_id,
        path: track.output.path,
        sha256: sha256(track.output.path),
        coding_packet: track.coding_packet,
        coding_packet_sha256: sha256(track.coding_packet),
      })),
      paper_sources: Object.fromEntries(run.assignment.papers.flatMap((paper) => paper.record_ids.map((recordId) => [
        recordId,
        {
          path: paper.source.path,
          sha256: paper.source.sha256,
          work_id: paper.work_id,
          version_id: paper.version_id,
          version_type: paper.version_type,
          representative_record_id: paper.paper_id,
        },
      ]))),
      work_assignments: run.assignment.papers.map((paper) => ({
        work_id: paper.work_id,
        version_id: paper.version_id,
        version_type: paper.version_type,
        preferred_version_id: paper.preferred_version_id,
        representative_record_id: paper.paper_id,
        record_ids: paper.record_ids,
      })),
    },
    decisions: Object.fromEntries(Object.entries(decisions).sort(([left], [right]) => left.localeCompare(right))),
  };
  writeFileSync(resolve(root, outputPath), `${JSON.stringify(product, null, 2)}\n`);
  console.log(`WROTE AI-agent-reviewed product: ${outputPath}, ${Object.keys(product.decisions).length} records`);
}

main();
