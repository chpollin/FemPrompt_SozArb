import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { validateCodingPacket } from './validate-coding-packet.mjs';

const hash = 'a'.repeat(64);
const categories = {
  AI_Literacies: 'nein',
  Generative_KI: 'teilweise',
  Prompting: 'nein',
  KI_Sonstige: 'nein',
  Soziale_Arbeit: 'nein',
  Bias_Ungleichheit: 'teilweise',
  Gender: 'nein',
  Diversitaet: 'nein',
  Feministisch: 'nein',
  Fairness: 'nein',
};
const evidence = Object.fromEntries(Object.keys(categories).map((name) => [name, []]));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const run = {
  run_id: 'example',
  execution: { mode: 'isolated-test' },
  tracks: [{
    reviewer_id: 'ar1',
    paper_ids: ['PAPER-1'],
    coding_packet: 'unused.json',
    source_assignments: [{
      paper_id: 'PAPER-1',
      source_path: 'prompts/prism-agent-reviewer.md',
      source_sha256: hash,
    }],
  }],
};
const packet = {
  schema: 'femprompt-prisma-coding-packet/0.1',
  run_id: 'example',
  reviewer: 'ar1',
  actor: 'agent',
  source_mode: 'isolated-test',
  decisions: {
    'PAPER-1': {
      source_path: 'prompts/prism-agent-reviewer.md',
      identity_check: { status: 'verified', basis: 'Test fixture.' },
      categories,
      decision: 'Unclear',
      reason: null,
      evidence: {
        ...evidence,
        Generative_KI: ['Der Review untersucht feministische AI Literacies, KI-Bias und KI-Nutzung in der Sozialen Arbeit.'],
        Bias_Ungleichheit: ['Der Review untersucht feministische AI Literacies, KI-Bias und KI-Nutzung in der Sozialen Arbeit.'],
      },
    },
  },
};

const originalHash = run.tracks[0].source_assignments[0].source_sha256;
run.tracks[0].source_assignments[0].source_sha256 = createHash('sha256')
  .update(readFileSync('prompts/prism-agent-reviewer.md'))
  .digest('hex');
assert(validateCodingPacket(packet, run, 'ar1').ok, 'valid coding packet was rejected');

const positiveWithoutEvidence = structuredClone(packet);
positiveWithoutEvidence.decisions['PAPER-1'].evidence.Generative_KI = [];
assert(!validateCodingPacket(positiveWithoutEvidence, run, 'ar1').ok, 'positive category without evidence was accepted');

const wrongThreshold = structuredClone(packet);
wrongThreshold.decisions['PAPER-1'].decision = 'Include';
assert(!validateCodingPacket(wrongThreshold, run, 'ar1').ok, 'decision that differs from category threshold was accepted');

const omittedRecord = structuredClone(packet);
delete omittedRecord.decisions['PAPER-1'];
assert(!validateCodingPacket(omittedRecord, run, 'ar1').ok, 'incomplete packet was accepted');

const wrongSourceHash = structuredClone(run);
wrongSourceHash.tracks[0].source_assignments[0].source_sha256 = originalHash;
assert(!validateCodingPacket(packet, wrongSourceHash, 'ar1').ok, 'source hash mismatch was accepted');

console.log('PASS coding packet: valid packet and required rejection cases');
